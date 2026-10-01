"""Assemble the fixed pilot's unreviewed claim sidecar and review queue, offline."""
from collections import Counter
import argparse
import csv
import hashlib
import json
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--full', action='store_true', help='Assemble the full v2 corpus instead of the fixed pilot.')
    args = parser.parse_args()
    prepared = root / ('data/staging/full_enrichment_prepared_v2' if args.full else 'data/staging/claim_extraction_pilot_v1')
    packets = {p['request_id'].split(':', 1)[1]: p for p in
               map(json.loads, (prepared / 'requests.jsonl').read_text(encoding='utf-8').splitlines())}
    base = root / ('data/staging/full_enrichment_v2' if args.full else 'data/staging/openai_claim_pilot_parallel_v1')
    runs = ([] if args.full else [root / 'data/staging/openai_claim_pilot_v1']) + sorted(p.parent for p in base.glob('shard_*/ledger.json'))
    claims, queue, seen_requests, paper_records, errors = [], [], set(), [], Counter()
    for run in runs:
        ledger = json.loads((run / 'ledger.json').read_text(encoding='utf-8'))
        for key, request in ledger['requests'].items():
            if key in seen_requests:
                raise ValueError('Duplicate request across runs')
            seen_requests.add(key)
            packet = packets[key]
            paper_records.append(request)
            if request['status'] != 'completed':
                continue
            validation_path = run / (key + '.validation.json')
            if not validation_path.exists():
                continue
            validation = json.loads(validation_path.read_text(encoding='utf-8'))
            for rejected in validation['rejected']:
                errors.update(rejected['errors'])
            for record in validation['accepted']:
                c = record['claim']
                content = {'source_id': packet['source_id'], 'claim': {k: v for k, v in c.items() if k != 'local_claim_id'}}
                claim_id = 'extracted:' + hashlib.sha256(json.dumps(content, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:24]
                row = {**record, 'claim_id': claim_id, 'request_id': packet['request_id'], 'source_id': packet['source_id'],
                       'source_sha256': packet['source_sha256'], 'raw_source_file': packet['raw_file'],
                       'prompt_sha256': packet['prompt_sha256'], 'schema_sha256': packet['schema_sha256'],
                       'split': packet['split'], 'stratum': packet['stratum'], 'extractor_model': request.get('returned_model'),
                       'response_id': request.get('response_id'), 'run_fingerprint': ledger['fingerprint'],
                       'raw_response_file': str((run / (key + '.response.json')).relative_to(root)).replace('\\', '/'),
                       'validation_file': str(validation_path.relative_to(root)).replace('\\', '/')}
                claims.append(row)
                queue.append({'claim_id': claim_id, 'source_id': packet['source_id'], 'split': packet['split'],
                              'kind': c['kind'], 'assertion': c['assertion'], 'summary': c['summary'],
                              'quote': ' | '.join(e['quote'] for e in c['evidence']),
                              'species': c['context']['species'], 'cell_type': c['context']['cell_type'],
                              'sign': (c['regulatory'] or {}).get('sign', 'unsigned_reaction'),
                              'uncertainties': ' | '.join(c['uncertainties']), 'review_status': 'unreviewed',
                              'raw_response_file': row['raw_response_file']})
    claims.sort(key=lambda c: (c['source_id'], c['claim_id']))
    (base / 'claims.jsonl').write_text(''.join(json.dumps(c, ensure_ascii=False, sort_keys=True) + '\n' for c in claims), encoding='utf-8')
    if queue:
        with (base / 'review_queue.csv').open('w', encoding='utf-8', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=list(queue[0]))
            writer.writeheader()
            writer.writerows(sorted(queue, key=lambda r: (r['source_id'], r['claim_id'])))
    summary = {'prepared_papers': len(packets), 'attempted_papers': len(paper_records),
               'completed_papers': sum(p['status'] == 'completed' for p in paper_records),
               'accepted_unreviewed_claims': len(claims),
               'papers_with_accepted_claims': len({c['source_id'] for c in claims}),
               'claim_kinds': dict(Counter(c['claim']['kind'] for c in claims)),
               'assertions': dict(Counter(c['claim']['assertion'] for c in claims)),
               'split_claim_counts': dict(Counter(c['split'] for c in claims)),
               'rejected_claims': sum(p.get('rejected_claims', 0) for p in paper_records),
               'rejection_reasons': dict(errors), 'exact_quote_offset_repairs': sum(p.get('repaired_spans', 0) for p in paper_records),
               'estimated_token_cost_usd': sum(p['reserved_or_billed_usd'] for p in paper_records if 'usage' in p),
               'reserved_or_billed_usd': sum(p['reserved_or_billed_usd'] for p in paper_records),
               'canonical_mutations': 0, 'scientific_accuracy_measured': False,
               'next_step': 'Development-set scientific review, identity grounding, then reversible canonical patch generation; preserve held-out evaluation.'}
    (base / 'extraction_summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
