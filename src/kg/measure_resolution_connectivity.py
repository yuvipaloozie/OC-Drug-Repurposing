"""Compare frozen before/after graph coverage with fixed starting proteins and endpoint definitions."""
import json
from pathlib import Path
import tempfile
from src.kg.graph import OsteoclastKnowledgeGraph
from src.kg.single_drug_demo import TARGETS

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'data/staging/full_integration_v2'
ENDPOINTS=['PATHWAY:OSTEOCLAST_DIFFERENTIATION','PATHWAY:BONE_RESORPTION','LOCAL:process:osteoclast_formation','PATHWAY:F_ACTIN_SEALING_ZONE']


def graph_from_tables(tables):
    graph=OsteoclastKnowledgeGraph()
    with tempfile.TemporaryDirectory() as tmp:
        folder=Path(tmp)
        for name,text in tables.items():
            (folder/(name+'.csv')).write_bytes(text.encode())
        graph.load_from_csv(*(str(folder/(name+'.csv')) for name in ['nodes','edges','experiments','edge_evidence','contexts','source_records']))
    return graph


def measure(graph,starts):
    pairs=set();intermediate=set();compatible=set();complete=set();examples=[];truncated=False
    for start in sorted(starts):
        for end in ENDPOINTS:
            paths=graph.find_mechanism_paths(start,end,max_depth=4,max_paths=1000,mode='informed',target_context={'species':'mouse'})
            truncated |= graph.last_search_truncated
            signed=[p for p in paths if p['net_sign']!=0 and not set(p['nodes'][1:-1]) & set(ENDPOINTS)]
            if signed:
                pairs.add((start,end))
            for p in signed:
                if p['path_length']>=2:
                    intermediate.add((start,end))
                if 'context_mismatch' not in p['warnings']:
                    compatible.add((start,end))
                    if 'context_incomplete' not in p['warnings']:
                        complete.add((start,end))
                examples.append(p)
    return {'starting_proteins':len(starts),'proteins_reaching_endpoint':len({p[0] for p in pairs}),'signed_target_endpoint_pairs':len(pairs),'pairs_with_intermediate_mechanism':len(intermediate),'pairs_without_reported_species_or_cell_mismatch':len(compatible),'pairs_with_complete_species_and_cell_context':len(complete),'search_truncated':truncated,'pairs':sorted(pairs),'paths':examples}


def run():
    patch=json.loads((OUT/'patch.json').read_text(encoding='utf-8'))
    before=graph_from_tables(patch['before']);after=graph_from_tables(patch['after'])
    fixed={nid for nid,n in before.nodes.items() if n['type']=='protein' and n.get('taxon')=='mouse'}
    expanded={nid for nid,n in after.nodes.items() if n['type']=='protein' and n.get('taxon')=='mouse'}
    baseline=measure(before,fixed);matched=measure(after,fixed);expanded_result=measure(after,expanded)
    targets={symbol.casefold() for _,symbol in TARGETS if symbol}
    drug_before={nid for nid in fixed if before.nodes[nid].get('symbol','').casefold() in targets}
    drug_after={nid for nid in expanded if after.nodes[nid].get('symbol','').casefold() in targets}
    result={'scope':'Unreviewed mechanism coverage, not predictive accuracy or efficacy. Mouse target context; depth 4 and at most 1000 paths per pair. Context-complete means species/cell labels present, not experimental compatibility verified.', 'endpoint_ids':ENDPOINTS,'fixed_mouse_protein_baseline':baseline,'same_proteins_after':matched,'expanded_mouse_proteins_after':expanded_result,'dasatinib_label_targets_before':measure(before,drug_before),'dasatinib_label_targets_after':measure(after,drug_after),'before_table_sha256':patch['before_sha256'],'after_table_sha256':patch['after_sha256']}
    oldpairs={tuple(p) for p in baseline['pairs']}
    result['new_same_protein_paths']=[p for p in matched['paths'] if (p['start_node_id'],p['nodes'][-1]) not in oldpairs]
    (OUT/'connectivity_comparison.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({k:{a:b for a,b in v.items() if a not in ('paths','pairs')} for k,v in result.items() if isinstance(v,dict) and 'starting_proteins' in v},indent=2))


if __name__=='__main__':
    run()
