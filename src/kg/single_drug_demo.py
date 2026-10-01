"""Offline dasatinib coverage experiment; never modifies canonical KG tables.

Run python -m src.kg.single_drug_demo after the source snapshot is installed.
The projected drug->mouse target edge is a scenario assumption, not curated evidence.
"""
import copy
import hashlib
import json
from pathlib import Path
from src.kg.graph import OsteoclastKnowledgeGraph

ROOT = Path(__file__).resolve().parents[2]
DRUG = 'LOCAL:drug:dasatinib'
TARGETS = [('BCR-ABL', None), ('SRC', 'SRC'), ('LCK', 'LCK'), ('YES', 'YES1'),
           ('FYN', 'FYN'), ('c-KIT', 'KIT'), ('EPHA2', 'EPHA2'), ('PDGFRbeta', 'PDGFRB')]
ENDPOINTS = ['PATHWAY:OSTEOCLAST_DIFFERENTIATION', 'PATHWAY:BONE_RESORPTION']
TABLES = ['nodes', 'edges', 'experiments', 'edge_evidence', 'contexts', 'source_records']

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def map_targets(graph):
    rows = []
    for label, symbol in TARGETS:
        matches = [n['node_id'] for n in graph.nodes.values()
                   if symbol and n.get('symbol') == symbol and n.get('type') == 'protein']
        rows.append({'label_target': label, 'symbol': symbol, 'candidate_node_ids': matches,
                     'mapping_status': 'target_binding_and_species_transfer_review_required' if matches else 'not_represented',
                     'node_identity_statuses': {nid:graph.nodes[nid].get('identity_status','unknown') for nid in matches},
                     'action': 'INHIBITS', 'sign': -1})
    return rows

def overlay(graph, targets, source):
    result = copy.deepcopy(graph)
    result.nodes[DRUG] = {'node_id': DRUG, 'type': 'drug', 'name': 'Dasatinib',
                          'identity_status': 'label_ingredient_identified_structure_not_mapped'}
    sid = source['source_id']
    result.source_records[sid] = {**source, 'resolution_status': 'resolved',
                                 'claim_match_status': 'label_targets_checked'}
    result.contexts['ctx:demo_transfer'] = {'species': '', 'cell_type': '',
        'verification_status': 'pending', 'note': 'Label does not establish binding to this mouse node.'}
    for row in targets:
        for nid in row['candidate_node_ids']:
            eid = 'demo:dasatinib:' + nid
            result.edges[eid] = {'edge_id': eid, 'source_id': DRUG, 'target_id': nid,
                'relation': 'INHIBITS', 'sign': -1, 'status': 'proposed',
                'context_id': 'ctx:demo_transfer', 'source_record_id': sid,
                'review_note': 'Conditional target transfer; not experimentally verified in mouse.'}
            result.adj_out[DRUG].append((nid, eid))
            result.adj_in[nid].append((DRUG, eid))
            # Intentionally citation-only: the checked label is NOT checked evidence
            # for inhibition of this specific mouse protein, even after registry mapping.
    return result

def run(root=ROOT):
    folder = root / 'data/processed'
    paths = [folder / (n + '.csv') for n in TABLES]
    before = {str(p.relative_to(root)): digest(p) for p in paths}
    source = json.loads((root / 'data/drug_demo/dasatinib_source.json').read_text(encoding='utf-8'))
    if digest(root / source['raw_file']) != source['raw_sha256']:
        raise ValueError('Source snapshot checksum mismatch')
    graph = OsteoclastKnowledgeGraph()
    graph.load_from_csv(*[str(p) for p in paths])
    targets = map_targets(graph)
    projected = overlay(graph, targets, source)
    scores = {}
    for endpoint in ENDPOINTS:
        if endpoint not in graph.nodes:
            raise ValueError('Missing endpoint: ' + endpoint)
        scores[endpoint] = {mode: projected.score_drug_mechanism(DRUG,
            target_phenotype_id=endpoint, mode=mode, max_depth=8,
            target_context={'species': 'mouse'}, max_paths=1000)
            for mode in ['informed', 'strict']}
    # Show reachable partial mechanisms without treating them as phenotype hits.
    partial = []
    for nid in graph.nodes:
        if nid.startswith('PATHWAY:') and nid not in ENDPOINTS:
            for path in projected.find_mechanism_paths(DRUG, nid, max_depth=8, mode='informed'):
                partial.append(path)
    unchanged = before == {str(p.relative_to(root)): digest(p) for p in paths}
    if not unchanged:
        raise RuntimeError('Canonical inputs changed during analysis')
    result = {'drug': 'dasatinib', 'source': source, 'targets': targets,
              'scenario': 'Conditional inhibition of candidate mouse SRC; species transfer unverified',
              'target_list_scope': 'Eight targets/groups in label section 12.1; not an exhaustive targetome',
              'canonical_input_sha256': before, 'canonical_inputs_unchanged': unchanged,
              'scores': scores, 'partial_paths': partial,
              'interpretation': 'No phenotype coverage is unknown, not evidence of inefficacy. Scores are uncalibrated heuristics, not ML probabilities.'}
    out = root / 'reports/single_drug_demo'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'dasatinib.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    lines = ['# Single-drug demonstration: dasatinib', '',
        'This tests coverage and sign-aware traversal in the existing graph. It is not an efficacy prediction.', '',
        '## Drug and target input', '',
        'Dasatinib is an approved kinase inhibitor. The label lists eight kinase targets/groups in section 12.1. Only SRC has a candidate protein node in this graph. BCR-ABL is a fusion and is not silently equated with ABL1.', '',
        '| Label target | Candidate in KG |', '|---|---|']
    lines += [f"| {r['label_target']} | {', '.join(r['candidate_node_ids']) or 'Not represented'} |" for r in targets]
    identity_text='; '.join(nid+': '+graph.nodes[nid].get('identity_status','unknown') for row in targets for nid in row['candidate_node_ids'])
    lines += ['', 'Current candidate identity status: '+identity_text+'. The label does not verify inhibition of the particular mouse protein. A temporary, citation-only drug-to-SRC edge therefore represents a conditional transfer assumption. No canonical drug, claim, evidence or experiment was added.', '',
              '## Results', '', '| Endpoint | Mode | Supporting | Opposing | Unsigned |', '|---|---|---:|---:|---:|']
    for endpoint, modes in scores.items():
        for mode, value in modes.items():
            lines.append(f"| {endpoint} | {mode} | {len(value['paths'])} | {len(value['opposing_paths'])} | {len(value['direction_unresolved_paths'])} |")
    lines += ['', 'A zero feature here means missing eligible connectivity, not a predicted biological null effect. No search was allowed to reinstate quarantined claims.', '', '## Partial routes and stopping points', '']
    for endpoint,modes in scores.items():
        for path in modes['informed']['all_paths']:
            lines.append('- Full candidate route to '+endpoint+': '+' -> '.join(path['nodes'])+'. Warnings: '+', '.join(path['warnings'])+'.')
    for path in partial:
        lines.append('- ' + ' -> '.join(path['nodes']) + f"; net sign {path['net_sign']}; evidence-weight heuristic {path['heuristic_weight']} (not probability).")
    blocked = scores[ENDPOINTS[0]]['informed']['excluded_edges']
    for item in blocked:
        e = graph.edges.get(item['edge_id'], {})
        lines.append(f"- Blocked {item['edge_id']}: {e.get('source_id')} -> {e.get('target_id')}; {', '.join(item['warnings'])}.")
    lines += ['', '## Interpretation and next curation task', '',
        'This drug exercises the cytoskeleton/resorption branch, not a demonstrated metabolic route. Differentiation and bone resorption are separate endpoints. Source-check target engagement/species transfer and the links from SRC/VAV3 through actin organization to bone resorption. Registry mapping does not establish these mechanisms. Any reported context mismatch or incomplete context remains a limitation on the full candidate route. Expand other target branches separately. Absence of opposing routes does not establish absence of opposing biology.', '',
        'The molecular/chemical ML lane is not run here. No clinical exposure, selectivity or therapeutic benefit is estimated. This is a reproducible engineering demonstration, not a claim of novel repurposing.', '',
        '## Reproduce', '', '`python -m src.kg.single_drug_demo`', '',
        'The run is offline and verifies the cached source hash. The JSON records all six canonical input hashes, source provenance, mapping gaps, full paths and exclusion reasons. Canonical input hashes were unchanged.', '',
        f"Source: [DailyMed label, section 12.1]({source['url']}). Retrieved {source['retrieved_at']}. The source snapshot is separate from the canonical KG source ledger."]
    (out / 'dasatinib.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    return result

if __name__ == '__main__':
    result = run()
    print(json.dumps({'targets': len(result['targets']), 'partial_paths': len(result['partial_paths']),
                      'canonical_inputs_unchanged': result['canonical_inputs_unchanged'],
                      'results': {e: {m: len(v['all_paths']) for m, v in modes.items()}
                                  for e, modes in result['scores'].items()}}, indent=2))
