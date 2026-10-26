"""Prepare a reversible, offline source-backed serine module. No paid extraction.

Run --apply to install; patch contains exact before/after canonical table bytes.
Registry snapshots are inputs, not inferred biology. Literature curation here is
assistant-led and explicitly not independent biological adjudication.
"""
import argparse
import copy
import csv
import hashlib
import html
import io
import json
import re
from pathlib import Path
from src.kg.integrate_pyk2_pilot import apply_patch_file

ROOT = Path(__file__).resolve().parents[2]
TABLES = ['nodes', 'edges', 'contexts', 'experiments', 'edge_evidence', 'source_records']
MODULE = 'Serine synthesis and epigenetic regulation'


def sha(b):
    return hashlib.sha256(b).hexdigest()


def prepare(root=ROOT):
    root = Path(root)
    dest = root/'data/staging/serine_module_v1/patch.json'
    if dest.exists():
        return dest
    before = {t: (root/f'data/processed/{t}.csv').read_bytes().decode('utf-8') for t in TABLES}
    tables = {t: list(csv.DictReader(io.StringIO(v))) for t, v in before.items()}
    fields = {t: list(rows[0]) for t, rows in tables.items()}
    for table in ['contexts', 'experiments']:
        if 'qualifiers' not in fields[table]: fields[table].append('qualifiers')
        for row in tables[table]: row['qualifiers'] = row.get('qualifiers') or '{}'
    keys = {'nodes':'node_id', 'edges':'edge_id', 'contexts':'context_id', 'experiments':'experiment_id', 'edge_evidence':'evidence_id', 'source_records':'source_id'}
    index = {t:{r[keys[t]]:r for r in rows} for t,rows in tables.items()}
    changes = []
    inputs = {}

    def load(path):
        b = (root/path).read_bytes(); inputs[path] = sha(b)
        return json.loads(b)

    def put(table, **values):
        key = values[keys[table]]
        if key in index[table]: return index[table][key]
        row = {k:'' for k in fields[table]}; row.update(values)
        tables[table].append(row); index[table][key] = row
        return row

    def node(nid, name, kind, **kw):
        return put('nodes', node_id=nid, name=name, type=kind, taxon=kw.pop('taxon','mouse'),
                   identity_status=kw.pop('identity_status','registry_mapped'), physiological_pillar=MODULE,
                   annotation_status='source_checked_identity_not_experimental_validation', structure_candidates='{}', **kw)

    def source(sid, path, url, title):
        inputs[path] = sha((root/path).read_bytes())
        return put('source_records', source_id=sid, title=title, resolution_status='resolved',
                   claim_match_status='source_checked_for_selected_claims', url=url,
                   retrieved_at='2026-10-02', raw_file=path, raw_sha256=inputs[path])

    def edge(tag, a, rel, b, sid, note, sign=0, context='ctx:serine:biochemistry', db='uniprot', status='curated', experiment='', kind='association', basis='registry_biochemical_annotation'):
        eid = 'edge:serine:'+tag
        put('edges', edge_id=eid, source_id=a, target_id=b, relation=rel, sign=str(sign), context_id=context,
            source_db=db, source_record_id=sid, status=status, context_status='not_experimental' if db=='uniprot' else 'pending',
            causal_basis=basis, effect_level='biochemical_participation' if sign==0 else 'contextual_regulation', review_note=note)
        src=index['source_records'][sid]
        put('edge_evidence', evidence_id='ev:serine:'+tag, edge_id=eid, experiment_id=experiment, source_id=sid,
            quote_or_location=note, claim_summary=note, evidence_kind=kind, polarity='support',
            curator_status='reviewed', reviewed_at='2026-10-02', passage_status='source_checked_paraphrase',
            source_location='UniProt catalytic activity / gene cross-reference' if db=='uniprot' else 'PMC10822776 Sec5–6; Fig. 3–5; Methods Sec17, Sec22–25',
            source_url='https://pmc.ncbi.nlm.nih.gov/articles/PMC10822776/' if sid=='PMID:38200114' else src['url'],
            source_sha256=sha((root/'data/raw/provenance/PMC10822776.xml').read_bytes()) if sid=='PMID:38200114' else src['raw_sha256'],
            review_note='Assistant source check; not independent expert adjudication. Registry homology annotations retain their evidence codes in the raw snapshot.')
        return eid

    put('contexts', context_id='ctx:serine:biochemistry', species='mouse', cell_type='', stage='',
        verification_status='registry_annotation_not_experiment', qualifiers='{}',
        note='Enzyme annotation; participant orientation describes serine biosynthesis, not measured flux or pool changes.')

    # Preserve qualifiers explicitly present in the imported CPT1A passage.
    for ev in tables['edge_evidence']:
        quote=ev.get('quote_or_location','')
        if 'only in the female mice' in quote and 'Cpt1a' in quote:
            e=index['edges'][ev['edge_id']]; ctx=index['contexts'][e['context_id']]
            ctx['qualifiers']=json.dumps({'sex':'female','intervention_type':'gene_deletion','model_setting':'in_vivo'})
            if ev['experiment_id'] in index['experiments']:
                index['experiments'][ev['experiment_id']]['qualifiers']=ctx['qualifiers']
            changes.append({'edge_id':e['edge_id'], 'reason':'Sex-specific result explicitly qualified in source passage; not generalized to males.'})

    restrictions={
        'edge:full:7c0bebb547152249ebfde53c':('male mice',{'sex':'male','model_setting':'in_vivo','intervention_type':'gene_deletion'}),
        'edge:full:bda66421b9556d837cc180da':('only when BM cells were co-cultured',{'model_setting':'bone_marrow_preosteoblast_coculture'}),
        'edge:full:56dd72288c890934c00b7784':('periodontitis-associated',{'disease_setting':'periodontitis','intervention_type':'gene_deletion'}),
        'edge:full:f0eaca18559376b359136632':('resorptive challenge',{'model_setting':'resorptive_challenge','intervention_type':'gene_deletion'}),
    }
    for eid,(anchor,qualifiers) in restrictions.items():
        records=[ev for ev in tables['edge_evidence'] if ev['edge_id']==eid and ev['curator_status']!='quarantined' and anchor in ev.get('quote_or_location','')]
        assert records, 'Restriction must be explicitly present in supporting passage'
        ctx=index['contexts'][index['edges'][eid]['context_id']]
        ctx['qualifiers']=json.dumps({**json.loads(ctx.get('qualifiers') or '{}'),**qualifiers})
        for ev in records:
            if ev['experiment_id'] in index['experiments']:
                exp=index['experiments'][ev['experiment_id']]
                exp['qualifiers']=json.dumps({**json.loads(exp.get('qualifiers') or '{}'),**qualifiers})
        changes.append({'edge_id':eid,'reason':'Explicit source-passage restriction preserved without promoting scientific review status.','qualifiers':qualifiers})

    # Existing structure snapshots bind the exact reviewed accession and taxon.
    proteins={}
    for symbol in ['PHGDH','PSAT1','PSPH','KDM6B','NFATC1']:
        n=index['nodes']['LOCAL:protein:mouse:'+symbol]
        sc=json.loads(n['structure_candidates']); path=sc['registry_identity_source']
        d=load(path); entry=next(v for v in d['results'] if v['primaryAccession']==sc['uniprot_id'])
        assert entry['organism']['taxonId']==10090 and 'reviewed' in entry['entryType']
        sid='UniProtKB:'+entry['primaryAccession']
        source(sid,path,'https://www.uniprot.org/uniprotkb/'+entry['primaryAccession']+'/entry',symbol+' mouse reviewed protein annotation')
        n['physiological_pillar']=MODULE; proteins[symbol]=(n,entry,sid)
        # Gene product identity is unsigned and cannot imply inhibitor/knockout equivalence.
        gids=[x['id'] for x in entry.get('uniProtKBCrossReferences',[]) if x['database']=='GeneID']
        if len(gids)==1:
            gid='LOCAL:gene:NCBIGene:'+gids[0]
            node(gid,entry['genes'][0]['geneName']['value']+' gene','gene',symbol=entry['genes'][0]['geneName']['value'], aliases='NCBIGene:'+gids[0])
            edge(symbol+'_encodes',gid,'ENCODES',n['node_id'],sid,'Registry gene/product mapping from NCBI Gene '+gids[0]+' to '+entry['primaryAccession']+'. No specific transcript or intervention equivalence asserted.')

    # Rhea participant chemical species are kept separate from historical neutral-acid nodes.
    chebis=[15378,18110,57540,57945,58272,16810,29985,57524,15377,33384,43474]
    for cid in chebis:
        d=load(f'data/raw/provenance/serine_module_v1/chebi_{cid}.json')
        assert d['chebi_accession']=='CHEBI:'+str(cid)
        node('CHEBI:'+str(cid),html.unescape(re.sub('<[^>]+>','',d['name'])),'intracellular_compound',taxon='all')
    reactions=[('PHGDH','12641',[58272,57540],[18110,57945,15378]),
               ('PSAT1','14329',[18110,29985],[57524,16810]),
               ('PSPH','21208',[57524,15377],[33384,43474])]
    for symbol,rhea,substrates,products in reactions:
        n,entry,sid=proteins[symbol]
        activity=next(c['reaction'] for c in entry['comments'] if c['commentType']=='CATALYTIC ACTIVITY' and any(x['id']=='RHEA:'+rhea for x in c['reaction']['reactionCrossReferences']))
        expected={x['id'] for x in activity['reactionCrossReferences'] if x['database']=='ChEBI'}
        assert expected=={'CHEBI:'+str(c) for c in substrates+products}
        rid='RHEA:'+rhea
        node(rid,activity['name'],'reaction',taxon='all',identity_status='registry_reaction_mapped')
        note='RHEA:'+rhea+'; '+activity['name']+'. Participation stoichiometry 1 for each listed species. Oriented toward serine synthesis; reversible equation does not establish in-cell flux. Mouse annotation evidence: '+json.dumps(activity.get('evidences',[]))
        edge(symbol+'_catalysis',n['node_id'],'CATALYZES',rid,sid,note)
        for relation,participants in [('INPUT_TO',substrates),('OUTPUT_OF',products)]:
            for cid in participants: edge(symbol+'_'+relation+'_'+str(cid),'CHEBI:'+str(cid),relation,rid,sid,note)

    paper='PMID:38200114'
    src=index['source_records'][paper];inputs[src['raw_file']]=sha((root/src['raw_file']).read_bytes())
    inputs['data/raw/provenance/PMC10822776.xml']=sha((root/'data/raw/provenance/PMC10822776.xml').read_bytes())
    held=load('data/staging/full_enrichment_prepared_v2/config.json')['excluded_holdout_pmids']
    assert '38200114' not in {str(x) for x in held}, 'Do not develop against frozen holdout'
    pool='LOCAL:pool:intracellular_alpha_ketoglutarate'
    node(pool,'Intracellular alpha-ketoglutarate pool (unresolved protonation)','intracellular_compound', identity_status='source_defined_metabolite_pool',taxon='mouse')
    for eid in ['edge:0034','edge:0217']:
        index['edges'][eid]['target_id']=pool
        index['edges'][eid]['causal_basis']='genetic_perturbation_role_inference'
        index['edges'][eid]['review_note']+=' Pool measurement does not resolve protonation or subcellular compartment; represented by a local measured-pool entity.'
    for eid in ['edge:stegen2024_phgdh_formation','edge:stegen2024_psat1_formation']:
        index['edges'][eid]['causal_basis']='genetic_perturbation_role_inference'
    for eid in ['edge:0035','edge:0036','edge:0037']:
        index['edges'][eid]['status']='quarantined'
        index['edges'][eid]['review_note']+=' Superseded by source-specific serine-module claims separating co-substrate participation, enzyme catalysis, and RNA expression; legacy activation wording was over-specific.'
    early='ctx:serine:early_culture'
    put('contexts',context_id=early,species='mouse',cell_type='bone marrow mononuclear cell-derived osteoclast precursors',stage='early differentiation',
        disease_setting='RANKL_induced_osteoclastogenesis',qualifiers=json.dumps({'duration':'0–3 days','model_setting':'in_vitro'}),
        verification_status='source_checked_not_expert_adjudicated',note='Methods describe donors of both sexes; sex-specific effect is not established, so no sex qualifier inferred.')
    demethyl='RXN:CHROMATIN_H3K27me3_demethylation_Nfatc1'
    rna='LOCAL:rna:mouse:Nfatc1'
    index['nodes'][demethyl]['physiological_pillar']=MODULE
    index['nodes'][rna]['physiological_pillar']=MODULE
    edge('pool_identity',pool,'ASSOCIATED_WITH','CHEBI:16810',paper,'The reported alpha-ketoglutarate pool includes chemically related protonation states; this mapping is not exact identity or a signed pool effect.',context=early,db='pubmed',status='proposed',basis='measured_pool_representation')
    edge('kdm6b_catalysis','LOCAL:protein:mouse:KDM6B','CATALYZES',demethyl,paper,'Sec6 interprets the Nfatc1-locus H3K27 demethylation as JMJD3/KDM6B-mediated. The experiment is not an isolated-enzyme assay; contribution is proposed, and catalysis is unsigned.',context=early,db='pubmed',status='proposed',basis='paper_mechanistic_interpretation')
    edge('oxoglutarate_cosubstrate','CHEBI:16810','INPUT_TO',demethyl,paper,'Sec6 identifies alpha-ketoglutarate as a co-substrate of Jumonji-domain demethylases. This is partial reaction participation; histone substrate, oxygen, and other products are not a balanced reaction model.',context=early,db='pubmed',status='proposed',basis='paper_mechanistic_interpretation')
    claims=[('pool_demethylation',pool,demethyl,1,'Alpha-ketoglutarate availability supports H3K27 demethylation at the Nfatc1 locus in PHGDH-deficient cultures: cell-permeable dimethyl-alpha-ketoglutarate rescue reduces the elevated mark. This is an indirect interpretation, not direct binding or universal sufficiency.','Fig. 5j–k','ChIP-qPCR; immunoblot'),
            ('demethylation_transcription',demethyl,rna,1,'The authors interpret removal of repressive H3K27me3 near the Nfatc1 transcription start site as facilitating Nfatc1 transcription. Chromatin and expression/rescue measurements support an indirect mechanistic interpretation, not direct activation of NFATC1 protein.','Fig. 3m, 5k; Sec6','ChIP-qPCR; RT-qPCR')]
    for tag,a,b,sign,note,location,assay in claims:
        exp='exp:serine:'+tag
        put('experiments',experiment_id=exp,paper_id=paper,model_system='in_vitro',species='mouse',cell_type='bone marrow mononuclear cell-derived osteoclast precursors',
            differentiation_stage='early differentiation',treatment='PHGDH deletion versus control; dimethyl-alpha-ketoglutarate rescue',dose='0.25 mM rescue reagent',duration='0–3 days',endpoint=location,assay=assay,
            measured_effect=note,viability='Not independently established by the chromatin assay',figure_or_table=location,verification_status='source_checked_mechanistic_interpretation',
            qualifiers=json.dumps({'intervention_type':'gene_deletion_with_metabolite_rescue','model_setting':'in_vitro'}),review_note='Assistant qualitative curation; no expert sign-off or quantitative effect digitization.')
        edge(tag,a,'REGULATES',b,paper,note,sign,early,'pubmed','proposed',exp,'rescue','paper_mechanistic_interpretation')
    # Gene-level RNA identity was already present; transcript isoform remains unspecified.
    n,entry,sid=proteins['NFATC1']
    edge('nfatc1_translation',rna,'TRANSLATED_TO',n['node_id'],sid,'Nfatc1 gene-level mRNA encodes NFATC1 protein; UniProt O88942 names Nfatc1. Transcript isoform and abundance-to-activity response are unspecified. This is unsigned translation, not an activating effect.')

    # Independent primary endpoint support; retain the distinct precursor model.
    assert '16275763' not in {str(x) for x in held}
    source('PMID:16275763','data/raw/provenance/serine_module_v1/PMC2213228.xml',
           'https://pmc.ncbi.nlm.nih.gov/articles/PMC2213228/',
           'Autoamplification of NFATc1 expression determines its essential role in bone homeostasis')
    ctx='ctx:serine:nfatc1_chimera_precursors'
    put('contexts',context_id=ctx,species='mouse',cell_type='splenocyte-derived osteoclast precursors from fetal-liver-cell chimeras',
        stage='osteoclast differentiation',verification_status='source_checked_not_expert_adjudicated',
        qualifiers=json.dumps({'model_setting':'in_vitro','intervention_type':'gene_deletion'}),
        note='Different precursor preparation from the serine study; retain model-transfer qualification.')
    exp='exp:serine:nfatc1_loss'
    note='Nfatc1-deficient splenocyte-derived precursors from fetal-liver-cell chimeras failed to form TRAP-positive multinucleated osteoclasts under M-CSF/RANKL stimulation. Positive functional-role inference; not direct activation, inhibitor equivalence, or validation in the serine-study culture model.'
    put('experiments',experiment_id=exp,paper_id='PMID:16275763',model_system='in_vitro',species='mouse',
        cell_type='splenocyte-derived osteoclast precursors from fetal-liver-cell chimeras',differentiation_stage='osteoclast differentiation',
        treatment='Nfatc1-deficient versus heterozygous donor cells; M-CSF and RANKL',dose='M-CSF 10 ng/mL; RANKL 50 ng/mL',
        endpoint='TRAP-positive multinucleated cells (>3 nuclei)',assay='TRAP staining',measured_effect=note,figure_or_table='Fig. 1F',
        verification_status='source_checked_not_expert_adjudicated',qualifiers=json.dumps({'model_setting':'in_vitro','intervention_type':'gene_deletion'}))
    edge('nfatc1_outcome',n['node_id'],'REGULATES','PATHWAY:OSTEOCLAST_DIFFERENTIATION','PMID:16275763',note,
         1,ctx,'pubmed','proposed',exp,'perturbation','genetic_perturbation_role_inference')
    index['edge_evidence']['ev:serine:nfatc1_outcome']['source_location']='PMC2213228 Results; Fig. 1F caption'

    # Record boundary observations separately: absence of rescue is not inhibition.
    boundaries=[{'observation_id':'serine_no_rescue','source_id':paper,'location':'Fig. 3e–g','observation':'Supplementary serine, methyl-serine ester, and formate did not rescue PHGDH-loss differentiation defect.','scope':'specified PHGDH-deficient mouse cultures; no universal serine ineffectiveness claim'},
                {'observation_id':'succinate_no_rescue','source_id':paper,'location':'Fig. 5a–c','observation':'Cell-permeable succinate did not rescue the PHGDH-loss differentiation defect.','scope':'specified treatment condition'},
                {'observation_id':'early_rescue','source_id':paper,'location':'Extended Data Fig. 5a–c','observation':'Early alpha-ketoglutarate rescue was stronger than late supplementation.','scope':'timing matters; intracellular pool and dimethyl ester are distinct entities'}]
    out=root/'data/modules';out.mkdir(exist_ok=True)
    (out/'serine_boundary_observations.json').write_text(json.dumps(boundaries,indent=2)+'\n',encoding='utf-8')
    after={}
    for table,rows in tables.items():
        buf=io.StringIO(newline='');w=csv.DictWriter(buf,fieldnames=fields[table],lineterminator='\n');w.writeheader();w.writerows(rows);after[table]=buf.getvalue()
    patch={'patch_id':'serine_module_v1','scope':'Assistant source-checked module; no independent expert validation','changes':changes,'input_sha256':inputs,
           'before':before,'after':after,'before_sha256':{k:sha(v.encode()) for k,v in before.items()},'after_sha256':{k:sha(v.encode()) for k,v in after.items()}}
    dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(patch,indent=2)+'\n',encoding='utf-8')
    return dest


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--apply',action='store_true');args=parser.parse_args()
    path=prepare();print(path)
    if args.apply: print(apply_patch_file(path))
