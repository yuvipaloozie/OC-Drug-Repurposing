"""Reproducible graph description and source-dependence checks; no ML accuracy claims."""
import hashlib
import json
from collections import Counter
from pathlib import Path
import networkx as nx
from src.kg.drug_targets import ROOT, load_graph, TABLES
from src.kg.measure_resolution_connectivity import measure


def network_summary(nodes, edges):
    g=nx.Graph();g.add_nodes_from(nodes)
    g.add_edges_from((e['source_id'],e['target_id']) for e in edges)
    components=sorted(nx.connected_components(g),key=len,reverse=True)
    return {'projection':'undirected simple graph; all canonical nodes retained; parallel relationships collapsed',
            'simple_edges':g.number_of_edges(),'components':len(components),'largest_component_nodes':len(components[0]) if components else 0,
            'isolated_nodes':nx.number_of_isolates(g),'mean_degree':round(sum(dict(g.degree()).values())/len(g),4),
            'density':round(nx.density(g),6)}


def run(root=ROOT):
    graph=load_graph(root);assess={eid:graph.assess_edge(eid) for eid in graph.edges}
    usable=[e for eid,e in graph.edges.items() if assess[eid]['usable']]
    starts={nid for nid,n in graph.nodes.items() if n['type']=='protein' and n.get('taxon')=='mouse'}
    coverage=measure(graph,starts)
    coverage={k:v for k,v in coverage.items() if k not in {'paths','pairs'}}
    coverage['scope']='Signed paths at depth <=4 to four prespecified osteoclast endpoints; excludes intermediate endpoint shortcuts. Coverage is not predictive accuracy.'
    source_support=Counter(len(set(assess[e['edge_id']]['support_sources'])) for e in usable)
    retained=[]
    for source in sorted({s for e in usable for s in assess[e['edge_id']]['support_sources']}):
        masked=graph.filter_subgraph_by_leakage({source},set())
        remaining=sum(masked.assess_edge(e)['usable'] for e in masked.edges)
        retained.append({'removed_source':source,'usable_edges_lost':len(usable)-remaining})
    serine_mask=graph.filter_subgraph_by_leakage({'PMID:38200114'},set())
    before=graph.find_mechanism_paths('LOCAL:protein:mouse:PHGDH','LOCAL:rna:mouse:Nfatc1',max_depth=10)
    after=serine_mask.find_mechanism_paths('LOCAL:protein:mouse:PHGDH','LOCAL:rna:mouse:Nfatc1',max_depth=10)
    result={'counts':{'nodes':len(graph.nodes),'relationships':len(graph.edges),'evidence_records':len(graph.edge_evidence),
                      'contexts':len(graph.contexts),'experiments':len(graph.experiments),'sources':len(graph.source_records)},
            'node_types':dict(Counter(n['type'] for n in graph.nodes.values())),
            'taxon_labels':dict(Counter(n['taxon'] for n in graph.nodes.values())),
            'relationships':dict(Counter(e['relation'] for e in graph.edges.values())),
            'edge_status':dict(Counter(e['status'] for e in graph.edges.values())),
            'evidence_record_status':dict(Counter(e['curator_status'] for e in graph.edge_evidence)),
            'informed_tiers':dict(Counter(a['tier'] for a in assess.values())),
            'all_recorded_network':network_summary(graph.nodes,graph.edges.values()),
            'informed_network':network_summary(graph.nodes,usable),
            'signed_endpoint_coverage':coverage,
            'usable_edge_qualifying_source_counts':dict(sorted(source_support.items())),
            'most_influential_sources_by_edge_loss':sorted(retained,key=lambda x:-x['usable_edges_lost'])[:10],
            'serine_source_ablation':{'source':'PMID:38200114','PHGDH_to_Nfatc1_RNA_paths_before':len(before),'paths_after':len(after),
                                      'meaning':'Source dependence, not an external validation experiment.'},
            'genes_with_usable_product_mapping':len({e['source_id'] for e in usable if e['relation']=='ENCODES'}),
            'nodes_without_module':sum(not n.get('physiological_pillar') for n in graph.nodes.values()),
            'canonical_input_sha256':{t:hashlib.sha256((root/f'data/processed/{t}.csv').read_bytes()).hexdigest() for t in TABLES}}
    out=root/'reports/biological_validation';out.mkdir(exist_ok=True)
    (out/'graph_statistics.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,indent=2));return result


if __name__=='__main__':run()
