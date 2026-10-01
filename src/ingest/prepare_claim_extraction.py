"""Prepare auditable, provider-neutral extraction packets; never call an API or edit KG data."""
import argparse
import csv
import hashlib
import json
from pathlib import Path


def sha(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode('utf-8')


def source_path(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError('Source snapshot is outside repository')
    return path


def packet_for(paper, candidates, nodes, root, verified):
    provenance = paper['provenance']
    raw = source_path(root, provenance['raw_file'])
    if raw not in verified:
        verified[raw] = sha(raw.read_bytes())
    if verified[raw] != provenance['sha256']:
        raise ValueError('Raw source checksum mismatch: ' + str(raw))
    passages = [p for p in paper['passages'] if p['passage_type'] in ('title', 'abstract')]
    by_index = {p['passage_index']: p for p in passages}
    for candidate in candidates:
        p = by_index[candidate['passage_index']]
        lo, hi = candidate['start'] - p['offset'], candidate['end'] - p['offset']
        if not (0 <= lo <= hi <= len(p['text'])) or p['text'][lo:hi] != candidate['passage_text']:
            raise ValueError('Candidate span mismatch: ' + candidate['candidate_id'])
        if candidate['source_sha256'] != provenance['sha256']:
            raise ValueError('Candidate provenance mismatch')
    hinted = sorted({n for c in candidates for n in c.get('candidate_node_ids', [])})
    packet = {
        'source_id': 'PMID:' + paper['pmid'], 'pmid': paper['pmid'],
        'source_sha256': provenance['sha256'], 'raw_file': provenance['raw_file'],
        'passages': passages,
        'provider_entities': [e for e in paper['entities'] if e['passage_index'] in by_index],
        'provider_relations_unverified': paper['relations'],
        'candidate_ids': [c['candidate_id'] for c in candidates],
        'suggested_existing_nodes_unverified': [nodes[n] for n in hinted if n in nodes],
        'publication_types': sorted({t for c in candidates for t in c.get('publication_types', [])}),
        'instructions': 'Extract across supplied passages; lexical hints and provider predictions are not facts. An empty claims array is valid.'
    }
    packet['request_id'] = 'request:' + sha(encoded(packet))[:24]
    return packet


def prepare(root, config, output):
    root = root.resolve()
    if output.exists():
        raise ValueError('Choose a new output directory; existing runs are immutable')
    source = root / config['input_directory']
    candidates = json.loads((source / 'candidates.json').read_text(encoding='utf-8'))
    papers = json.loads((source / 'annotated_documents.json').read_text(encoding='utf-8'))
    with (root / 'data/processed/nodes.csv').open(encoding='utf-8-sig', newline='') as handle:
        nodes = {r['node_id']: {k: r.get(k, '') for k in ('node_id', 'name', 'type', 'taxon', 'identity_status', 'symbol')} for r in csv.DictReader(handle)}
    grouped = {}
    for c in candidates:
        grouped.setdefault(c['pmid'], []).append(c)
    # Deterministic coverage of lexical matches, new entities, negation cues, and
    # papers without keyword-selected candidates. Buckets are triage, not truth.
    buckets = {key: [] for key in ('negation_cue', 'existing_node_hint', 'no_node_hint', 'no_candidates')}
    for p in papers:
        cs = grouped.get(p['pmid'], [])
        key = ('no_candidates' if not cs else 'negation_cue' if any(c.get('negation_cue') for c in cs)
               else 'existing_node_hint' if any(c.get('candidate_node_ids') for c in cs) else 'no_node_hint')
        buckets[key].append(p)
    for values in buckets.values():
        values.sort(key=lambda p: sha((config['selection_seed'] + ':' + p['pmid']).encode()))
    selected, deferred = [], []
    while len(selected) < config['max_papers'] and any(buckets.values()):
        for key, values in buckets.items():
            if not values or len(selected) >= config['max_papers']:
                continue
            p = values.pop(0)
            if sum(len(v['text']) for v in p['passages']) > config['max_paper_characters']:
                deferred.append({'pmid': p['pmid'], 'reason': 'oversize; not truncated'})
                continue
            selected.append((key, p))
    prompt = (root / config['prompt_file']).read_bytes()
    schema = (root / config['schema_file']).read_bytes()
    verified, packets = {}, []
    for i, (bucket, p) in enumerate(selected):
        packet = packet_for(p, grouped.get(p['pmid'], []), nodes, root, verified)
        packet.update({'stratum': bucket, 'split': 'held_out' if i % 3 == 2 else 'development',
                       'prompt_sha256': sha(prompt), 'schema_sha256': sha(schema)})
        packets.append(packet)
    outputs = {
        'requests.jsonl': b''.join(json.dumps(p, ensure_ascii=False, sort_keys=True).encode('utf-8') + b'\n' for p in packets),
        'prompt.md': prompt, 'response.schema.json': schema, 'config.json': encoded(config)
    }
    manifest = {'status': 'prepared_only_no_extraction', 'network_calls': 0,
                'canonical_mutations': 0, 'request_count': len(packets),
                'development_papers': sum(p['split'] == 'development' for p in packets),
                'held_out_papers': sum(p['split'] == 'held_out' for p in packets),
                'strata': {k: sum(p['stratum'] == k for p in packets) for k in buckets},
                'verified_raw_snapshots': len(verified), 'deferred': deferred,
                'source_hashes': {str(p.relative_to(root)).replace('\\', '/'): sha(p.read_bytes()) for p in
                                  [source / 'candidates.json', source / 'annotated_documents.json', root / 'data/processed/nodes.csv', Path(__file__).resolve()]},
                'output_hashes': {k: sha(v) for k, v in outputs.items()},
                'input_characters': sum(len(v['text']) for p in packets for v in p['passages']),
                'note': 'Characters are not billed tokens. API cost requires provider, model and output limits.'}
    output.mkdir(parents=True)
    for name, content in outputs.items():
        (output / name).write_bytes(content)
    (output / 'manifest.json').write_bytes(encoded(manifest))
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument('--config', default='configs/claim_extraction_pilot.json')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    config = json.loads((args.root / args.config).read_text(encoding='utf-8'))
    print(json.dumps(prepare(args.root, config, args.output.resolve()), indent=2))


if __name__ == '__main__':
    main()
