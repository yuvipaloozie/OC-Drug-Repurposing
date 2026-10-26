"""Reusable, source-backed drug-target overlays; canonical KG remains unchanged.

python -m src.kg.drug_targets [--allow-species-transfer]
No symbol-only matching, pharmacology extrapolation, network or paid API calls.
"""
import argparse
import copy
import csv
import hashlib
import json
from pathlib import Path
from src.kg.graph import OsteoclastKnowledgeGraph

ROOT=Path(__file__).resolve().parents[2]
TABLES=['nodes','edges','experiments','edge_evidence','contexts','source_records']


def load_graph(root=ROOT):
    g=OsteoclastKnowledgeGraph()
    g.load_from_csv(*(str(root/f'data/processed/{n}.csv') for n in TABLES))
    return g


def load_targets(path, root=ROOT):
    with Path(path).open(encoding='utf-8',newline='') as f:
        rows=list(csv.DictReader(f))
    required=('record_id','drug_id','drug_name','target_accession','target_taxon','action','evidence_status','source_id','source_location','source_url','raw_file','raw_sha256')
    if len({r['record_id'] for r in rows}) != len(rows): raise ValueError('Duplicate drug-target record')
    for r in rows:
        if any(not r.get(k) for k in required): raise ValueError('Incomplete drug-target provenance')
        if r['action'] not in {'INHIBITS','ACTIVATES','BINDS'}: raise ValueError('Unsupported drug action')
        if r['evidence_status'] not in {'measured','predicted','label_reported'}: raise ValueError('Invalid drug-target evidence status')
        raw=(root/r['raw_file']).resolve()
        if not raw.is_relative_to(root.resolve()): raise ValueError('Source outside repository')
        if hashlib.sha256(raw.read_bytes()).hexdigest()!=r['raw_sha256']: raise ValueError('Drug-target source hash mismatch')
        if r.get('selectivity_raw_file'):
            caveat=(root/r['selectivity_raw_file']).resolve()
            if not caveat.is_relative_to(root.resolve()) or hashlib.sha256(caveat.read_bytes()).hexdigest()!=r.get('selectivity_raw_sha256'):
                raise ValueError('Selectivity source hash mismatch')
        if r.get('potency_value'):
            if float(r['potency_value'])<=0 or not r.get('potency_unit') or not r.get('potency_type'):
                raise ValueError('Potency requires positive value, type, and unit')
    return rows


def overlay(graph, rows, allow_species_transfer=False):
    result=copy.deepcopy(graph); decisions=[]
    for row in rows:
        candidates=[]
        for nid,n in graph.nodes.items():
            sc=n.get('structure_candidates') or '{}';sc=json.loads(sc) if isinstance(sc,str) else sc
            if n.get('type')=='protein' and sc.get('uniprot_id')==row['target_accession'] and graph._context_value(n.get('taxon'))==graph._context_value(row['target_taxon']):
                candidates.append(nid)
        transferred=False
        if not candidates and allow_species_transfer and row.get('scenario_target_node'):
            n=graph.nodes.get(row['scenario_target_node'],{})
            sc=json.loads(n.get('structure_candidates') or '{}')
            if n.get('type')!='protein' or sc.get('uniprot_id')!=row.get('scenario_target_accession') or not row.get('transfer_assumptions'):
                raise ValueError('Transfer requires an explicit registry-matched scenario target and assumptions')
            candidates=[row['scenario_target_node']]; transferred=True
        if len(candidates)>1: raise ValueError('Ambiguous exact drug-target match')
        decisions.append({'record_id':row['record_id'],'target_nodes':candidates,'mapping':'explicit_cross_species_scenario' if transferred else 'exact_accession_and_taxon' if candidates else 'target_not_represented'})
        for target in candidates:
            drug=row['drug_id'];eid='drug-target:'+row['record_id'];sid=row['source_id']
            result.nodes[drug]={'node_id':drug,'type':'drug','name':row['drug_name'],'identity_status':'registry_mapped_external_input'}
            result.source_records[sid]={'source_id':sid,'resolution_status':'resolved','claim_match_status':'source_checked_target_assay','url':row['source_url']}
            ctx='ctx:'+eid
            result.contexts[ctx]={'species':row['target_taxon'],'cell_type':'purified protein' if row['evidence_status']=='measured' else '',
                                  'note':'Target-binding assay context is separate from the downstream phenotype experiment.'}
            result.edges[eid]={'edge_id':eid,'source_id':drug,'target_id':target,'relation':'ASSOCIATED_WITH' if row['action']=='BINDS' else row['action'],
                'sign':{'INHIBITS':-1,'ACTIVATES':1,'BINDS':0}[row['action']],'status':'proposed','source_db':'drug_target_input','source_record_id':sid,
                # An assay context describes binding, not the downstream cell phenotype.
                'context_id':'','causal_basis':'drug_target_assay','transfer_assumptions':row['transfer_assumptions'] if transferred else '',
                'pharmacology_caveats':row.get('pharmacology_caveats',''),
                'drug_target_record':copy.deepcopy(row), 'binding_context_id':ctx}
            result.adj_out[drug].append((target,eid));result.adj_in[target].append((drug,eid))
            result.edge_evidence.append({'evidence_id':'ev:'+eid,'edge_id':eid,'source_id':sid,'polarity':'support',
                'curator_status':'reviewed' if row['evidence_status']=='measured' and not transferred else 'automated_extraction',
                'passage_status':'source_checked_paraphrase' if row['evidence_status']=='measured' and not transferred else 'scenario_assumption',
                'quote_or_location':row.get('evidence_summary',''), 'source_location':row['source_location'],'source_sha256':row['raw_sha256']})
    return result,decisions


def run(root=ROOT,allow_species_transfer=False):
    before={t:hashlib.sha256((root/f'data/processed/{t}.csv').read_bytes()).hexdigest() for t in TABLES}
    rows=load_targets(root/'data/drug_targets/targets.csv',root)
    graph,decisions=overlay(load_graph(root),rows,allow_species_transfer)
    results={r['drug_id']:graph.score_drug_mechanism(r['drug_id'],target_context={'species':'mouse'},max_depth=12) for r in rows}
    assert before=={t:hashlib.sha256((root/f'data/processed/{t}.csv').read_bytes()).hexdigest() for t in TABLES}
    return {'canonical_inputs_unchanged':True,'canonical_input_sha256':before,'allow_species_transfer':allow_species_transfer,
            'target_decisions':decisions,'results':results,'interpretation':'Research-probe coverage exercise, not an FDA candidate ranking or efficacy prediction. Potency is assay-specific and is not converted into a phenotype probability.'}


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--allow-species-transfer',action='store_true');args=p.parse_args()
    result=run(allow_species_transfer=args.allow_species_transfer)
    out=ROOT/'reports/serine_module';out.mkdir(exist_ok=True)
    path=out/('drug_scenario.json' if args.allow_species_transfer else 'drug_exact_mapping.json')
    path.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(path)
