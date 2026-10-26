"""Offline development checks and a blinded human-review handoff.

These checks measure implementation/coverage, not independent biological accuracy.
The frozen 50-paper holdout is exported without model predictions or annotations.
"""
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path
from src.kg.drug_targets import ROOT, load_graph, run, TABLES


def evaluate(root=ROOT):
    g=load_graph(root)
    before={t:hashlib.sha256((root/f'data/processed/{t}.csv').read_bytes()).hexdigest() for t in TABLES}
    out=root/'reports/serine_module';out.mkdir(exist_ok=True)
    exact=run(root,False);scenario=run(root,True)
    for name,data in [('drug_exact_mapping',exact),('drug_scenario',scenario)]:
        (out/(name+'.json')).write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
    result=scenario['results']['PubChem:118796328']
    cpt='edge:full:a8b7d69a426f9706995a214d'
    # A readable trace terminating at RNA is a mechanistic explanation, not an
    # assumed RNA-abundance -> protein-activity -> phenotype causal shortcut.
    paths=g.find_mechanism_paths('LOCAL:protein:mouse:PHGDH','LOCAL:rna:mouse:Nfatc1',max_depth=10,max_paths=1000)
    full=[p for p in paths if 'RHEA:14329' in p['nodes'] and 'RXN:CHROMATIN_H3K27me3_demethylation_Nfatc1' in p['nodes']]
    checks={
        'cpt1a_female_compatible':g.context_applicability(cpt,{'sex':'female'})['status']=='compatible',
        'cpt1a_male_incompatible':g.context_applicability(cpt,{'sex':'male'})['status']=='incompatible',
        'complete_reaction_chromatin_rna_trace_present':bool(full),
        'biochemical_trace_does_not_invent_causal_sign':bool(full) and all(p['net_sign']==0 for p in full),
        'human_target_not_automatically_mouse_target':exact['target_decisions'][0]['mapping']=='target_not_represented',
        'explicit_transfer_retains_assumptions':bool(result['all_paths']) and all(p['transfer_assumptions'] for p in result['all_paths']),
        'no_drug_analysis_path_truncation':not result['search_truncated'],
        'no_drugs_in_canonical_nodes':not any(n['type']=='drug' for n in g.nodes.values()),
        'canonical_tables_unchanged_by_evaluation':before=={t:hashlib.sha256((root/f'data/processed/{t}.csv').read_bytes()).hexdigest() for t in TABLES},
    }
    held=set(map(str,json.loads((root/'data/staging/full_enrichment_prepared_v2/config.json').read_text())['excluded_holdout_pmids']))
    used={'38200114','27110680','16275763','37917194'}
    checks['development_sources_disjoint_from_frozen_holdout']=not bool(held & used)
    assert all(checks.values()),checks
    packets=[]
    for line in (root/'data/staging/claim_extraction_pilot_v1/requests.jsonl').read_text(encoding='utf-8').splitlines():
        p=json.loads(line)
        if str(p['pmid']) in held:
            packets.append({k:p[k] for k in ['pmid','source_id','source_sha256','raw_file','passages']})
    assert len(packets)==50 and {str(p['pmid']) for p in packets}==held
    folder=root/'data/evaluation/heldout_50';folder.mkdir(parents=True,exist_ok=True)
    packet_text=''.join(json.dumps(p,ensure_ascii=False)+'\n' for p in sorted(packets,key=lambda p:str(p['pmid'])))
    (folder/'blind_packets.jsonl').write_text(packet_text,encoding='utf-8')
    # Never overwrite a human's work on a subsequent evaluation run.
    review=folder/'review_results.csv'
    if not review.exists():
        fields=['pmid','reviewer','review_date','status','true_positive_claims','false_positive_claims','missed_claims','entity_errors','sign_errors','intervention_errors','context_errors','notes']
        with review.open('w',encoding='utf-8',newline='') as f:
            w=csv.DictWriter(f,fieldnames=fields,lineterminator='\n');w.writeheader()
            w.writerows({'pmid':p['pmid'],'status':'pending_independent_review'} for p in packets)
    known_overlap=sorted(s.removeprefix('PMID:') for s in g.source_records if s.startswith('PMID:') and s.removeprefix('PMID:') in held)
    summary={'scope':'development engineering checks; not held-out scientific validation','checks':checks,
        'counts':{'nodes':len(g.nodes),'edges':len(g.edges),'evidence':len(g.edge_evidence)},
        'relations':dict(Counter(e['relation'] for e in g.edges.values())),
        'informed_usable':sum(g.assess_edge(e)['usable'] for e in g.edges),'strict_experimental':sum(g.evidence_eligible(e) for e in g.edges),
        'nct503_scenario':{'supporting':len(result['paths']),'opposing':len(result['opposing_paths']),'unsigned':len(result['direction_unresolved_paths']),
                           'context_incompatible':len(result['context_incompatible_paths']),'total':len(result['all_paths'])},
        'example_metabolic_trace':min(full,key=lambda p:p['path_length']),
        'holdout':{'papers':len(packets),'blind_packet_sha256':hashlib.sha256(packet_text.encode()).hexdigest(),
                   'canonical_source_overlap_pmids':known_overlap,'independent_review_status':'pending',
                   'precision':None,'recall':None,'instruction':'Mask held-out papers from canonical evidence before evaluation, including any original seed-graph overlap. No human metrics inferred from automated checks.'},
        'canonical_input_sha256':before}
    (out/'evaluation.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
    c=summary['counts'];n=summary['nct503_scenario']
    lines=['# Serine module and evidence-policy iteration','',
           'Current generated inventory: **%s nodes, %s relationships, %s evidence records**.'%(c['nodes'],c['edges'],c['evidence']),
           'Informed usable: %s. Strict experimental: %s. Neither is a count of independently validated facts.'%(summary['informed_usable'],summary['strict_experimental']),'',
           '## What changed','',
           '- Evidence resolution and tier are assessed per supporting record. Context-compatible support cannot borrow the tier of incompatible support.',
           '- Sex and other qualifiers remain structured in context/experiment JSON. Unknown conditions remain available; known mismatches are returned separately from the requested scenario score.',
           '- Three serine-synthesis reactions use registry-specific chemical participants. INPUT_TO and OUTPUT_OF both point compound → reaction; traversal explicitly reverses OUTPUT_OF to reach products. Participation and gene/product mappings remain unsigned.',
           '- Four source-backed ENCODES relationships connect gene and protein identity without inventing transcripts. Translation retains unspecified isoforms; it does not assert abundance-to-activity causality.',
           '- The measured alpha-ketoglutarate pool is separate from its protonation states. Source-specific chromatin/RNA interpretation replaces three over-specific legacy activation claims. The endpoint has separate NFATc1 loss evidence in a different precursor model.',
           '- Drug-target rows record accession/taxon, assay, potency, source, measured/predicted status, and transfer assumptions. NCT-503 is a research control, not an FDA candidate in this input set.','',
           '## Observed example','',
           'PHGDH → RHEA:12641 → 3-phosphonatooxypyruvate → RHEA:14329 → 2-oxoglutarate → Nfatc1-locus H3K27 demethylation → Nfatc1 RNA.',
           'This is a connected explanatory route with unresolved overall direction because reaction participation is unsigned. It is not a flux simulation or a calibrated drug prediction.',
           f'The explicit human-to-mouse NCT-503 scenario returns {n["total"]} paths: {n["supporting"]} compatible-or-unknown signed supporting paths, {n["unsigned"]} unsigned paths, and {n["context_incompatible"]} context-incompatible paths (categories can overlap). The direct signed supporting route uses genetic functional-role evidence and retains that transfer warning.',
           'Exact accession/taxon matching alone finds no mouse target for the human assay. Cross-species use requires the explicit scenario option; the human IC50 is never relabeled as mouse potency.','',
           '## Validation and boundaries','',
           f'{len(checks)} automated development checks passed; see evaluation.json. These are not independent accuracy estimates.',
           'Fifty frozen papers are exported as blinded source packets with an empty human review sheet. Precision and recall remain null until independent adjudication. Original seed-source overlap is recorded and must be paper-masked for evaluation.',
           'The module preserves failed serine/formate/succinate rescue and timing limitations in data/modules/serine_boundary_observations.json. The chromatin reaction is a contextual partial representation, not a mass-balanced genome-scale model.',
           'PRMT6/fatty-acid and itaconate/TET2 modules remain subsequent curation work; this iteration completes the first bounded serine module, not all osteoclast metabolism.','',
           '## Reproduce','', '```powershell','python -m src.kg.rebuild','python -m src.kg.evaluate_serine_module','python -m unittest tests.test_serine_iteration','```','',
           'Historical data construction applies the serine patch followed by the biological-validation patch to their matching input checkpoints. Do not reapply an earlier patch to the current later dataset. The integration patch checks exact before/after table hashes, supports rollback, and retains input hashes. Applying it to a later incompatible dataset refuses overwrite. No extraction or paid API calls are made.']
    (out/'README.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(json.dumps({k:summary[k] for k in ['counts','informed_usable','strict_experimental','nct503_scenario']},indent=2))
    return summary


if __name__=='__main__':evaluate()
