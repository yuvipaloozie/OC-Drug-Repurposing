"""Freeze compact full-corpus requests while preserving the original 50-paper holdout."""
import csv
import json
from pathlib import Path

from src.ingest.prepare_claim_extraction import packet_for, encoded, sha
from src.ingest.run_openai_claim_extraction import estimate

ROOT = Path(__file__).resolve().parents[2]


def compact_packet(packet):
    # Keep complete text and exact annotation locations; remove redundant infons
    # and predicted relations so the extractor reads the primary text itself.
    result = {k: v for k, v in packet.items() if k not in ('request_id', 'provider_relations_unverified')}
    result['passages'] = [{k: p[k] for k in ('passage_index', 'passage_type', 'offset', 'text')} for p in packet['passages']]
    result['provider_entities'] = [{k: e.get(k) for k in ('annotation_id', 'text', 'type', 'identifier', 'locations', 'passage_index')} for e in packet['provider_entities']]
    result['request_id'] = 'request:' + sha(encoded(result))[:24]
    return result


def partition(papers, pilot):
    held = {p['pmid'] for p in pilot if p['split'] == 'held_out'}
    development = {p['pmid'] for p in pilot if p['split'] == 'development'}
    if len(held) != 50 or held & development:
        raise ValueError('Expected the frozen 50-paper holdout')
    if len({p['pmid'] for p in papers}) != len(papers):
        raise ValueError('Duplicate source paper')
    return [(p, 'development' if p['pmid'] in development else 'discovery') for p in papers if p['pmid'] not in held], sorted(held)


def main():
    source = ROOT / 'data/staging/connectivity_2500'
    output = ROOT / 'data/staging/full_enrichment_prepared_v2'
    if output.exists():
        raise ValueError('Prepared run already exists; do not overwrite frozen requests')
    papers = json.loads((source / 'annotated_documents.json').read_text(encoding='utf-8'))
    candidates = json.loads((source / 'candidates.json').read_text(encoding='utf-8'))
    pilot_path = ROOT / 'data/staging/claim_extraction_pilot_v1/requests.jsonl'
    pilot = list(map(json.loads, pilot_path.read_text(encoding='utf-8').splitlines()))
    selected, held = partition(papers, pilot)
    with (ROOT / 'data/processed/nodes.csv').open(encoding='utf-8-sig', newline='') as handle:
        nodes = {n['node_id']: {k: n.get(k, '') for k in ('node_id', 'name', 'type', 'taxon', 'identity_status', 'symbol')} for n in csv.DictReader(handle)}
    grouped = {}
    for c in candidates:
        grouped.setdefault(c['pmid'], []).append(c)
    prompt = (ROOT / 'prompts/mechanism_claim_extraction_v2.md').read_bytes()
    schema = (ROOT / 'schemas/claim_extraction_v1.schema.json').read_bytes()
    packets, verified = [], {}
    for paper, split in sorted(selected, key=lambda pair: sha(pair[0]['pmid'].encode())):
        packet = compact_packet(packet_for(paper, grouped.get(paper['pmid'], []), nodes, ROOT, verified))
        packet.update(split=split, stratum='full_corpus', prompt_sha256=sha(prompt), schema_sha256=sha(schema))
        packets.append(packet)
    config = {'version': 'full-enrichment-v2', 'provider': 'openai', 'model': 'gpt-5.4-mini-2026-03-17',
              'budget_usd': 90, 'user_maximum_usd': 100, 'workers': 16, 'max_output_tokens': 8000,
              'canonical_bulk_import': False, 'excluded_holdout_pmids': held,
              'note': 'Re-extract 100 development papers with v2; preserve all 50 pilot holdouts. Remaining papers are discovery, not evaluation data.'}
    outputs = {'requests.jsonl': b''.join(json.dumps(p, sort_keys=True, ensure_ascii=False).encode() + b'\n' for p in packets),
               'prompt.md': prompt, 'response.schema.json': schema, 'config.json': encoded(config)}
    manifest = {'status': 'prepared', 'request_count': len(packets), 'annotated_corpus_papers': len(papers),
                'held_out_papers_excluded': len(held), 'heldout_list_sha256': sha(encoded(held)),
                'development_papers': sum(p['split'] == 'development' for p in packets),
                'discovery_papers': sum(p['split'] == 'discovery' for p in packets),
                'verified_raw_snapshots': len(verified), 'output_hashes': {k: sha(v) for k, v in outputs.items()},
                'source_hashes': {str(p.relative_to(ROOT)).replace('\\', '/'): sha(p.read_bytes()) for p in
                                  [source / 'annotated_documents.json', source / 'candidates.json', pilot_path, ROOT / 'data/processed/nodes.csv', Path(__file__)]}}
    output.mkdir(parents=True)
    for name, data in outputs.items():
        (output / name).write_bytes(data)
    (output / 'manifest.json').write_bytes(encoded(manifest))
    calculation = estimate(packets, prompt.decode(), json.loads(schema), 8000)
    (output / 'cost_estimate.json').write_bytes(encoded(calculation))
    print(json.dumps({'manifest': manifest, 'cost_estimate': calculation}, indent=2))


if __name__ == '__main__':
    main()
