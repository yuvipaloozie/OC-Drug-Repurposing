"""Assistant-led biological source audit and bounded corrections, not lab validation.

Audits the source-checked mechanistic core plus registry reaction chemistry.
Unreviewed extraction/citation-only claims remain explicitly unadjudicated.
"""
import argparse
import csv
import hashlib
import io
import json
import re
from collections import Counter
from pathlib import Path
from src.kg.drug_targets import ROOT, load_graph
from src.kg.integrate_pyk2_pilot import apply_patch_file

TABLES=['nodes','edges','contexts','experiments','edge_evidence','source_records']


def sha(b): return hashlib.sha256(b).hexdigest()


def formula(text):
    pieces=re.findall(r'([A-Z][a-z]?)(\d*)',text)
    if ''.join(a+b for a,b in pieces)!=text: raise ValueError('Unsupported formula')
    return Counter({a:int(b or 1) for a,b in pieces})


def reaction_balance(root, graph):
    results=[]
    for reaction in ['RHEA:12641','RHEA:14329','RHEA:21208']:
        elements=Counter();charge=0;participants=[]
        for e in graph.edges.values():
            if e['target_id']!=reaction or e['relation'] not in {'INPUT_TO','OUTPUT_OF'}:continue
            path=root/('data/raw/provenance/serine_module_v1/chebi_'+e['source_id'].split(':')[1]+'.json')
            d=json.loads(path.read_bytes());chem=d['chemical_data'];sgn=-1 if e['relation']=='INPUT_TO' else 1
            for atom,n in formula(chem['formula']).items():elements[atom]+=sgn*n
            charge+=sgn*chem['charge']
            participants.append({'id':e['source_id'],'role':e['relation'],'stoichiometry':1,'formula':chem['formula'],'charge':chem['charge'],'source_sha256':sha(path.read_bytes())})
        delta={k:v for k,v in elements.items() if v}
        results.append({'reaction':reaction,'participants':participants,'element_delta':delta,'charge_delta':charge,'balanced':not delta and charge==0,
                        'scope':'Registry reaction chemistry only; does not demonstrate cellular flux, enzyme essentiality, or drug efficacy.'})
    assert all(r['balanced'] for r in results)
    return results


def prepare_patch(root=ROOT):
    out=root/'data/staging/biological_validation_v1';out.mkdir(exist_ok=True)
    dest=out/'patch.json'
    if dest.exists():return dest
    before={t:(root/f'data/processed/{t}.csv').read_bytes().decode('utf-8') for t in TABLES}
    tables={t:list(csv.DictReader(io.StringIO(text))) for t,text in before.items()}
    fields={t:list(rows[0]) for t,rows in tables.items()}
    edges={e['edge_id']:e for e in tables['edges']}
    # Preserve source-level limits in canonical details without blanket exclusion.
    limits={
        'edge:serine:kdm6b_catalysis':'BIOLOGICAL AUDIT: source supports a model-specific JMJD3/KDM6B interpretation, not universal necessity. A separate RAW264 stable-knockdown study reports no differentiation defect (PMC3339979); this is a context limitation, not direct refutation of catalysis.',
        'edge:0039':'BIOLOGICAL AUDIT: PRMT6 contribution to promoter H3R2me2a is supported by Prmt6-loss ChIP-qPCR in RANKL-stimulated mouse BMMs (PMC11516099, Fig. 7H); FAO/glycolysis effects must remain context-specific.',
        'edge:0047':'BIOLOGICAL AUDIT: native itaconate, 4-octyl itaconate, and conditioned-medium experiments are not interchangeable. The 2025 arthritis study includes nuclear-extract TET-family assays and Tet2 genetics; direct biochemical inhibition is separately represented from the 2022 purified-enzyme study.',
    }
    for eid,note in limits.items(): edges[eid]['review_note']+=' '+note
    edges['edge:0039']['relation']='REGULATES'
    edges['edge:0039']['causal_basis']='genetic_perturbation_role_inference'
    edges['edge:0047']['causal_basis']='paper_mechanistic_interpretation'
    # Stronger primary biochemical support belongs in its own assay context.
    raw='data/raw/provenance/biological_audit_v1/PMC9305987.bioc.xml'
    held=json.loads((root/'data/staging/full_enrichment_prepared_v2/config.json').read_text(encoding='utf-8'))['excluded_holdout_pmids']
    assert not {'35256775','34192988'} & set(map(str,held)), 'Do not develop against frozen evaluation papers'
    blob=(root/raw).read_bytes()
    assert blob.startswith(b'<?xml') and b'171' in blob and b'mTET2CD' in blob
    sid='PMID:35256775';ctx='ctx:audit:purified_mouse_tet2_cd';exp='exp:audit:itaconate_tet2_cd';eid='edge:audit:itaconate_tet2_biochemical'
    def add(table,**values):
        row={k:'' for k in fields[table]};row.update(values);tables[table].append(row)
    assert not any(s['source_id']==sid for s in tables['source_records'])
    add('source_records',source_id=sid,title='Itaconate inhibits TET DNA dioxygenases to dampen inflammatory responses',doi='10.1038/s41556-022-00853-8',pmid='35256775',pmcid='PMC9305987',
        resolution_status='resolved',claim_match_status='selected_biochemical_claim_source_checked',url='https://pmc.ncbi.nlm.nih.gov/articles/PMC9305987/',
        retrieved_at='2026-10-02',raw_file=raw,raw_sha256=sha(blob),publication_types='research-article')
    add('contexts',context_id=ctx,species='mouse',cell_type='purified TET2 catalytic domain',stage='',
        verification_status='source_checked_assistant_not_independent',qualifiers=json.dumps({'model_setting':'purified_enzyme','intervention_type':'compound_inhibition'}),
        note='Catalytic domain assay, not full-length cellular TET2 or an osteoclast assay; distinct human-domain NMR experiment is not substituted for this mouse assay.')
    summary='Itaconate inhibited purified mouse TET2 catalytic-domain activity in an immobilized methylated-DNA assay with reported IC50 171 micromolar; excess alpha-ketoglutarate overcame inhibition. This establishes biochemical activity under the assay conditions, not osteoclast potency or selectivity across all proteins.'
    add('experiments',experiment_id=exp,paper_id=sid,model_system='purified_enzyme',species='mouse',cell_type='purified TET2 catalytic domain',
        treatment='Itaconate concentration-response; alpha-ketoglutarate competition',dose='Reported IC50 171 uM (assay result, not a treatment dose)',
        endpoint='5hmC generation from immobilized methylated DNA',assay='Immobilized substrate DNA / fluorescence detection of 5hmC',measured_effect=summary,
        figure_or_table='Fig. 2a-c',verification_status='source_checked_assistant_not_independent',qualifiers=json.dumps({'model_setting':'purified_enzyme','intervention_type':'compound_inhibition'}),
        review_note='Catalytic-domain-to-canonical-protein transfer remains qualified. Assay pH/protonation is not resolved by the canonical ChEBI anion representation.')
    add('edges',edge_id=eid,source_id='CHEBI:17240',target_id='LOCAL:protein:mouse:TET2',relation='INHIBITS',sign='-1',context_id=ctx,
        source_db='pubmed',source_record_id=sid,status='proposed',context_status='pending',causal_basis='purified_catalytic_domain_assay',effect_level='enzyme_activity',review_note=summary+' Canonical full-protein node represents the assayed domain target at gene-product level; no cellular potency inference.')
    add('edge_evidence',evidence_id='ev:audit:itaconate_tet2_biochemical',edge_id=eid,experiment_id=exp,source_id=sid,
        quote_or_location=summary,claim_summary=summary,evidence_kind='perturbation',polarity='support',curator_status='reviewed',reviewed_at='2026-10-02',
        passage_status='source_checked_paraphrase',source_location='PMC9305987 Results: ITA binds TET2; Fig. 2a-c',source_url='https://pmc.ncbi.nlm.nih.gov/articles/PMC9305987/',source_sha256=sha(blob),review_note='Assistant primary-source audit; not independent biological validation.')
    after={}
    for t,rows in tables.items():
        f=io.StringIO(newline='');w=csv.DictWriter(f,fieldnames=fields[t],lineterminator='\n');w.writeheader();w.writerows(rows);after[t]=f.getvalue()
    patch={'patch_id':'biological_validation_v1','before':before,'after':after,'before_sha256':{t:sha(v.encode()) for t,v in before.items()},'after_sha256':{t:sha(v.encode()) for t,v in after.items()},'primary_source_sha256':{raw:sha(blob)},'scope':'Assistant source audit and one bounded biochemical claim, not blanket graph validation.'}
    dest.write_text(json.dumps(patch,indent=2)+'\n',encoding='utf-8');return dest


def audit(root=ROOT):
    g=load_graph(root);out=root/'reports/biological_validation';out.mkdir(exist_ok=True)
    notes={
        'edge:0034':('supported_with_limits','PMC10822776 Fig. 3i; Extended Data Fig. 4e','Indirect pathway contribution to measured alpha-ketoglutarate pool; no direct PHGDH production of alpha-ketoglutarate.'),
        'edge:0217':('supported_with_limits','PMC10822776 Fig. 4c','PSAT1 silencing lowers pool; complete stoichiometry comes from separate registry reaction, not pool measurement.'),
        'edge:stegen2024_phgdh_formation':('supported_with_limits','PMC10822776 Fig. 2g-l','Genetic loss affects cultured osteoclast formation; not inhibitor equivalence or clinical efficacy.'),
        'edge:stegen2024_psat1_formation':('supported_with_limits','PMC10822776 Fig. 4g-h','shRNA perturbation; no independently replicated drug-target result.'),
        'edge:0039':('supported_with_limits','PMC11516099 Fig. 7H','Promoter H3R2me2a loss in Prmt6-deficient BMMs supports positive contribution; ACTIVATE wording corrected to REGULATES.'),
        'edge:0047':('supported_with_limits','PMC12159140 Fig. 4-5; PMC9305987 Fig. 2','TET2 mechanism supported across biochemical and genetic evidence, but derivative/parent and assay contexts must remain separate.'),
        'edge:serine:pool_identity':('representation_assumption','PMC10822776 metabolomics; ChEBI:16810','Measured pool is not an exact single protonation state; unsigned correspondence only.'),
        'edge:serine:kdm6b_catalysis':('context_dependent_interpretation','PMC10822776 Sec6/Fig. 5; PMID:21735477; PMC3339979','Biochemical interpretation and prior knockdown support coexist with a RAW264 no-effect report; no universal necessity claim.'),
        'edge:serine:oxoglutarate_cosubstrate':('supported_partial_reaction','PMC10822776 Sec6','Co-substrate participation; chromatin reaction lacks complete balanced histone/oxygen/product representation.'),
        'edge:serine:pool_demethylation':('context_dependent_interpretation','PMC10822776 Fig. 5j-k','Dimethyl-alpha-ketoglutarate rescue supports proposed coupling in PHGDH-deficient cultures, not an unconditional pool-response rule.'),
        'edge:serine:demethylation_transcription':('context_dependent_interpretation','PMC10822776 Fig. 3m, 5k and Sec6','Authors integrate chromatin and RNA observations; no isolated direct causal transfer function.'),
        'edge:serine:nfatc1_outcome':('supported_with_limits','PMC2213228 Fig. 1F','Nfatc1 loss in chimera-derived splenocyte precursors; source-specific precursor preparation differs from serine study.'),
        'edge:audit:itaconate_tet2_biochemical':('supported_with_limits','PMC9305987 Fig. 2a-c','Purified mouse catalytic domain, reported IC50 171 uM; not whole-cell or osteoclast potency.'),
    }
    rows=[]
    for eid,e in g.edges.items():
        a=g.assess_edge(eid)
        verdict,location,note=notes.get(eid,('not_source_adjudicated_this_pass','','No new biological validation assigned.'))
        if eid.startswith('edge:serine:') and e['source_db']=='uniprot':
            verdict,location,note='registry_supported','Cached UniProt gene/catalytic-activity annotations','Exact registry mapping/participants checked; homology evidence retained. Neither measured osteoclast flux nor intervention equivalence follows.'
        rows.append({'edge_id':eid,'source_id':e['source_id'],'relation':e['relation'],'target_id':e['target_id'],'sign':e['sign'],
                     'analysis_tier':a['tier'],'audit_verdict':verdict,'source_location':location,'biological_limit':note,'reviewer':'assistant_source_audit' if verdict!='not_source_adjudicated_this_pass' else '', 'independent_human_review':'not_completed'})
    with (out/'claim_audit.csv').open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
    balances=reaction_balance(root,g)
    (out/'reaction_balance.json').write_text(json.dumps(balances,indent=2)+'\n',encoding='utf-8')
    findings=[{'id':'nct503_selectivity','source':'PMID:34192988','source_url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC8253182/',
               'finding':'Neuroblastoma experiments show PHGDH-independent changes in glucose carbon routing under NCT-503, including knockout cells.',
               'implication':'An NCT-503 phenotype is not sufficient evidence that PHGDH alone caused it; orthogonal perturbation and viability controls remain necessary.'},
              {'id':'jmjd3_context','source':'PMC3339979','source_url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC3339979/',
               'finding':'Primary paper reports normal differentiation after stable Jmjd3 knockdown in RAW264 cells.',
               'retrieval_scope':'Web-indexed primary-paper Results passage; downloadable full text unavailable in this run.',
               'implication':'Record model-dependent counterevidence; not a direct disproof of biochemical catalysis or the distinct primary-precursor study.'},
              {'id':'itaconate_direct','source':'DOI:10.1038/s41556-022-00853-8','source_url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC9305987/',
               'finding':'Purified mouse TET2 catalytic-domain inhibition and alpha-ketoglutarate competition are directly reported.',
               'implication':'Adds independent biochemical support, while keeping the purified-domain context separate from arthritis/osteoclast experiments.'}]
    summary={'scope':'Literature-based biological plausibility/support audit of the source-checked core; NOT full-graph validation, independent adjudication, or laboratory replication.',
             'verdicts':dict(Counter(r['audit_verdict'] for r in rows)),'reaction_balance_passed':sum(r['balanced'] for r in balances),
             'findings':findings,'independent_extraction_precision':None,'independent_extraction_recall':None,'drug_ranking_accuracy':None}
    (out/'audit_summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8');print(json.dumps(summary,indent=2));return summary


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--apply',action='store_true');a=p.parse_args()
    if a.apply: print(apply_patch_file(prepare_patch()))
    audit()
