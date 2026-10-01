"""Bounded OpenAI Responses extraction into staging. No canonical KG writes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import time

import requests
import tiktoken

from src.ingest.openai_credentials import load_key
from src.ingest.validate_extracted_claims import validate_response

MODEL = 'gpt-5.4-mini-2026-03-17'
INPUT_RATE = 0.75 / 1_000_000
OUTPUT_RATE = 4.50 / 1_000_000
ENDPOINT = 'https://api.openai.com/v1/responses'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def serialize(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n'


def save(path, value):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(serialize(value), encoding='utf-8')
    temporary.replace(path)


def load_prepared(prepared):
    manifest = json.loads((prepared / 'manifest.json').read_text(encoding='utf-8'))
    for name, expected in manifest['output_hashes'].items():
        if digest((prepared / name).read_bytes()) != expected:
            raise ValueError('Prepared artifact checksum mismatch: ' + name)
    packets = [json.loads(line) for line in (prepared / 'requests.jsonl').read_text(encoding='utf-8').splitlines()]
    prompt = (prepared / 'prompt.md').read_text(encoding='utf-8')
    schema = json.loads((prepared / 'response.schema.json').read_text(encoding='utf-8'))
    return packets, prompt, schema, manifest


def body_for(packet, prompt, schema, max_output_tokens):
    return {'model': MODEL, 'instructions': prompt, 'input': serialize(packet),
            'text': {'format': {'type': 'json_schema', 'name': 'mechanism_claims_v1', 'strict': True, 'schema': schema}},
            'reasoning': {'effort': 'low'}, 'max_output_tokens': max_output_tokens, 'store': False}


def estimate(packets, prompt, schema, max_output_tokens):
    enc = tiktoken.get_encoding('o200k_base')
    sizes = [serialize(body_for(p, prompt, schema, max_output_tokens)) for p in packets]
    token_estimate = sum(len(enc.encode(s)) + 256 for s in sizes)
    # UTF-8 bytes plus overhead deliberately over-reserve versus approximate tokenizer counts.
    byte_reservation = sum(len(s.encode('utf-8')) + 2048 for s in sizes)
    return {'model': MODEL, 'papers': len(packets), 'approximate_input_tokens': token_estimate,
            'expected_output_3000_tokens_each_usd': round(token_estimate * INPUT_RATE + len(packets) * 3000 * OUTPUT_RATE, 4),
            'maximum_output_tokens_each': max_output_tokens,
            'conservative_reservation_all_requests_usd': round(byte_reservation * INPUT_RATE + len(packets) * max_output_tokens * OUTPUT_RATE, 4),
            'pricing_source': 'https://developers.openai.com/api/docs/models/gpt-5.4-mini',
            'note': 'Token estimate uses o200k_base, not exact server counting. Reservations use UTF-8 byte counts plus overhead. Discounts excluded; prices must be rechecked before later runs.'}


def run(prepared, output, limit, split, budget, max_output_tokens, execute, shard_index=0, shard_count=1, exclude_run=None):
    if limit <= 0 or max_output_tokens <= 0 or budget <= 0:
        raise ValueError('Positive limit, token cap and budget required')
    packets, prompt, schema, manifest = load_prepared(prepared)
    packets = [p for p in packets if split == 'all' or p['split'] == split][:limit]
    if shard_count < 1 or not 0 <= shard_index < shard_count:
        raise ValueError('Invalid shard configuration')
    if exclude_run:
        prior = json.loads((exclude_run / 'ledger.json').read_text(encoding='utf-8'))
        excluded = set(prior['requests'])
        packets = [p for p in packets if p['request_id'].split(':', 1)[1] not in excluded]
    packets = packets[shard_index::shard_count]
    prediction = estimate(packets, prompt, schema, max_output_tokens)
    print(serialize(prediction), flush=True)
    if not execute:
        return prediction
    output.mkdir(parents=True, exist_ok=True)
    lock = output / '.run.lock'
    fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
    os.close(fd)
    try:
        fingerprint = digest(serialize({'prepared': manifest['output_hashes'], 'model': MODEL,
                                       'max_output_tokens': max_output_tokens, 'reasoning': 'low',
                                       'runner_sha256': digest(Path(__file__).read_bytes())}).encode())
        ledger_path = output / 'ledger.json'
        ledger = json.loads(ledger_path.read_text(encoding='utf-8')) if ledger_path.exists() else {
            'fingerprint': fingerprint, 'budget_usd': budget, 'requests': {}, 'estimated_billed_usd': 0.0}
        if ledger['fingerprint'] != fingerprint or ledger['budget_usd'] != budget:
            raise ValueError('Run configuration changed; use a new output directory')
        save(output / 'estimate.json', prediction)
        save(output / 'run_config.json', {'model': MODEL, 'store': False, 'reasoning': 'low', 'max_output_tokens': max_output_tokens,
                                          'budget_usd': budget, 'prepared_manifest': manifest,
                                          'credential': 'OPENAI_API_KEY environment or Windows Credential Manager; value omitted'})
        session = requests.Session()
        session.headers.update({'Authorization': 'Bearer ' + load_key(), 'Content-Type': 'application/json'})
        for packet in packets:
            key = packet['request_id'].split(':', 1)[1]
            if key in ledger['requests']:
                continue  # Includes ambiguous in-flight/failed calls: never auto-spend twice.
            body = body_for(packet, prompt, schema, max_output_tokens)
            reserve = (len(serialize(body).encode()) + 2048) * INPUT_RATE + max_output_tokens * OUTPUT_RATE
            committed = sum(r['reserved_or_billed_usd'] for r in ledger['requests'].values())
            if committed + reserve > budget:
                print('Budget ceiling reached; remaining requests deferred.', flush=True)
                break
            item = {'source_id': packet['source_id'], 'split': packet['split'], 'status': 'in_flight',
                    'reserved_or_billed_usd': reserve, 'request_sha256': digest(serialize(body).encode())}
            ledger['requests'][key] = item
            save(ledger_path, ledger)  # Persist charge reservation BEFORE sending.
            try:
                response = session.post(ENDPOINT, json=body, timeout=(15, 180), allow_redirects=False)
            except requests.RequestException:
                item['status'] = 'transport_error_charge_unknown'
                save(ledger_path, ledger)
                print('Transport failure; reserved cost retained. Stopping without retry.', flush=True)
                break
            item['http_status'] = response.status_code
            if response.status_code != 200:
                item['status'] = 'http_error'
                # Do not persist/print API error bodies or headers; they may contain credentials.
                save(ledger_path, ledger)
                print('OpenAI HTTP ' + str(response.status_code) + '; stopping without retry.', flush=True)
                break
            result = response.json()
            save(output / (key + '.response.json'), result)
            usage = result.get('usage') or {}
            if 'input_tokens' in usage and 'output_tokens' in usage:
                cost = usage['input_tokens'] * INPUT_RATE + usage['output_tokens'] * OUTPUT_RATE
                item.update(usage=usage, reserved_or_billed_usd=cost)
            item.update(status=result.get('status', 'unknown'), response_id=result.get('id'), returned_model=result.get('model'))
            if item['status'] == 'completed':
                texts = [c['text'] for o in result.get('output', []) for c in o.get('content', []) if c.get('type') == 'output_text']
                try:
                    extraction = json.loads(''.join(texts))
                    validation = validate_response(extraction, packet, schema)
                except (ValueError, TypeError, KeyError):
                    validation = {'valid_envelope': False, 'errors': ['missing_or_invalid_json'], 'accepted': [], 'rejected': [], 'repairs': []}
                save(output / (key + '.validation.json'), validation)
                item.update(accepted_claims=len(validation['accepted']), rejected_claims=len(validation['rejected']),
                            repaired_spans=len(validation['repairs']), valid_envelope=validation['valid_envelope'])
            ledger['estimated_billed_usd'] = sum(r['reserved_or_billed_usd'] for r in ledger['requests'].values() if 'usage' in r)
            save(ledger_path, ledger)
            print(f"{packet['source_id']}: {item['status']}, accepted={item.get('accepted_claims', 0)}, rejected={item.get('rejected_claims', 0)}, usage cost=${ledger['estimated_billed_usd']:.4f}", flush=True)
            if item['status'] != 'completed' or not item.get('valid_envelope', False):
                print('Incomplete/refused/invalid output; inspect before continuing.', flush=True)
                break
            time.sleep(0.2)
        session.close()
        summary = {'attempted_papers': len(ledger['requests']),
                   'completed_papers': sum(r['status'] == 'completed' for r in ledger['requests'].values()),
                   'accepted_unreviewed_claims': sum(r.get('accepted_claims', 0) for r in ledger['requests'].values()),
                   'rejected_claims': sum(r.get('rejected_claims', 0) for r in ledger['requests'].values()),
                   'repaired_spans': sum(r.get('repaired_spans', 0) for r in ledger['requests'].values()),
                   'estimated_billed_usd': ledger['estimated_billed_usd'],
                   'reserved_or_billed_usd': sum(r['reserved_or_billed_usd'] for r in ledger['requests'].values()),
                   'canonical_mutations': 0, 'scientific_review_completed': False}
        save(output / 'summary.json', summary)
        print(serialize(summary), flush=True)
        return summary
    finally:
        lock.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepared', type=Path, default=Path('data/staging/claim_extraction_pilot_v1'))
    parser.add_argument('--output', type=Path, default=Path('data/staging/openai_claim_pilot_v1'))
    parser.add_argument('--limit', type=int, default=150)
    parser.add_argument('--split', choices=['all', 'development', 'held_out'], default='all')
    parser.add_argument('--budget-usd', type=float, default=8.0)
    parser.add_argument('--max-output-tokens', type=int, default=8000)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--shard-index', type=int, default=0)
    parser.add_argument('--shard-count', type=int, default=1)
    parser.add_argument('--exclude-run', type=Path)
    args = parser.parse_args()
    run(args.prepared, args.output, args.limit, args.split, args.budget_usd, args.max_output_tokens, args.execute,
        args.shard_index, args.shard_count, args.exclude_run)


if __name__ == '__main__':
    main()
