"""Reproduce a bounded, assistant-adjudicated literature evaluation pilot.

Labels stay outside the KG. No guessed doses, efficacy negatives from missingness,
or claims of independent human adjudication. Assay observations, not drug truths.
"""
import json
from collections import Counter
from pathlib import Path
from src.ingest.fda_resolution import ROOT,read_csv,write_csv,digest

OUT=ROOT/'data/evaluation/drug_pilot_v1'
RAW=ROOT/'data/raw/provenance/drug_evaluation_v1'
NAMES={'fluoxetine':'FLUOXETINE HYDROCHLORIDE','paroxetine':'PAROXETINE HYDROCHLORIDE',
       'fluvoxamine':'FLUVOXAMINE MALEATE','citalopram':'CITALOPRAM HYDROBROMIDE','sertraline':'SERTRALINE HYDROCHLORIDE',
       'propranolol':'PROPRANOLOL HYDROCHLORIDE','enoxacin':'ENOXACIN','rosiglitazone':'ROSIGLITAZONE MALEATE'}


def run():
    OUT.mkdir(parents=True,exist_ok=True)
    ptr=json.loads((ROOT/'data/fda/current.json').read_text(encoding='utf-8'))
    ingredients={r['ingredient_name']:r for r in read_csv(ROOT/ptr['directory']/'ingredients.csv')}
    rows=[]
    def add(drug,pmid,pmcid,doi,file,location,endpoint,direction,dose,unit,duration,species,model,viability,summary,limits,scope='full_text'):
        raw=RAW/file;blob=raw.read_bytes();ingredient=ingredients[NAMES[drug]]
        # This maps a named pharmacological moiety to an FDA salt candidate, not
        # the exact experimental formulation. Preserve this limitation in every row.
        rows.append({'observation_id':f'OC-PILOT:{len(rows)+1:03d}','drug_name':drug,'ingredient_id':ingredient['ingredient_id'],
            'fda_ingredient_name':NAMES[drug],'inventory_status':ingredient['inventory_status'],
            'experimental_formulation':'not_resolved_to_exact_FDA_salt','compound_mapping':'named_moiety_to_FDA_ingredient_review_required',
            'source_id':'PMID:'+pmid,'pmcid':pmcid,'doi':doi,'source_url':'https://pubmed.ncbi.nlm.nih.gov/'+pmid+'/',
            'raw_file':raw.relative_to(ROOT).as_posix(),'raw_sha256':digest(blob),'source_location':location,'source_scope':scope,
            'endpoint':endpoint,'effect_direction':direction,'dose_value':dose,'dose_unit':unit,'duration':duration,
            'species':species,'model':model,'sex':'female' if pmid=='35122666' else 'not_extracted','control':'vehicle comparator; see source protocol',
            'viability_assessment':viability,'effect_size':'','effect_size_status':'not_digitized_or_inferred',
            'evidence_summary':summary,'limitations':limits,'reviewer':'assistant_source_review','independent_review_status':'pending',
            'dataset_role':'retrospective_pilot_not_locked_test','selective_inhibition_label':'1' if direction=='decreased' and viability=='no_reduction_reported' and endpoint=='formation' else '',
            'phenotype_direction_label':{'decreased':'1','no_significant_change':'0','increased':'-1'}.get(direction,''),
            'label_warning':'0 means reported non-significance under these conditions, not equivalence or proven inactivity. Selective-inhibition label requires separate viability interpretation.'})
    # 2016: primary mouse precursor cultures, source Methods and Fig 2.
    for drug in ['fluoxetine','paroxetine','fluvoxamine','citalopram']:
        direction='no_significant_change' if drug=='citalopram' else 'decreased'
        add(drug,'27595322','PMC5053870','10.1038/nm.4166','PMC5053870.bioc.xml','Results: Flx directly impairs osteoclast differentiation and function; Fig. 2b; Methods: cell culture','formation',direction,'3','uM','6 days','mouse','primary bone-marrow-derived osteoclast precursors','mononuclear_count_proxy_unchanged',
            'Three SSRIs reduced mature osteoclast counts; citalopram did not significantly inhibit differentiation. Mononuclear counts were similar across conditions.',
            'Mononuclear counts are a viability proxy, not a full viability panel. Fluoxetine reversibility supports this interpretation. No equivalence test for citalopram.')
        add(drug,'27595322','PMC5053870','10.1038/nm.4166','PMC5053870.bioc.xml','Results and Fig. 2d; Methods: cell culture','TRAP_activity',direction,'3','uM','24 hours after differentiation','mouse','mature primary osteoclast cultures','not_matched_to_endpoint_duration',
            'Fluoxetine, paroxetine and fluvoxamine reduced TRAP activity; citalopram did not show a significant reduction.',
            'TRAP activity is a surrogate and is not substituted for pit resorption or formation.')
    # 2013 human comparison: available primary abstract only; retain apoptotic confounding.
    for drug in ['sertraline','fluoxetine','paroxetine','fluvoxamine','citalopram']:
        for endpoint in ['formation','resorption']:
            add(drug,'23260229','','10.1016/j.biopsych.2012.11.003','ssri_search.json','Primary abstract: Methods and Results',endpoint,
                'no_significant_change' if drug=='citalopram' else 'decreased','1-10','uM','not_reported_in_available_abstract','human','human osteoclast cultures; preparation not specified in available abstract',
                'not_fully_resolved' if drug=='citalopram' else 'apoptosis_associated',
                'The authors report differential suppression of formation and resorption by four SSRIs, with citalopram the exception; apoptosis accompanies suppression.',
                'Abstract-level qualitative label; full-text and exact concentration-specific outcome review required. Do not call apoptosis-associated loss selective inhibition.','primary_abstract')
    add('fluoxetine','39711842','PMC11662947','10.1515/med-2024-1094','PMC11662947.xml','Results 3.3, Fig. 3l-o; viability Fig. 2','formation','decreased','0.1','uM','Methods TRAP protocol 5 days; hPBMC induction described as 10 days','human','RANKL/M-CSF-induced hPBMCs from one donor','no_reduction_reported',
        'Reduced TRAP-positive multinucleated cells; the paper reports no hPBMC viability change over the investigated concentration range.',
        'Single donor; exposure timing and viability timing conflict between Methods/figure descriptions. Do not invent a precise harmonized duration.')
    add('fluoxetine','39711842','PMC11662947','10.1515/med-2024-1094','PMC11662947.xml','Results 3.2, Fig. 2c,e','viability','decreased','10','uM','Methods 2 days; Fig. 2 caption 10 days','mouse','RAW264.7','reduction_reported',
        'Higher fluoxetine concentration reduced viability and increased LDH release in RAW264.7 cells.',
        'Toxicity observation only; not a negative efficacy label. Source timing discrepancy retained.')
    add('propranolol','35122666','PMC9098680','10.1002/jbmr.4523','PMC9098680.bioc.xml','Results and Fig. 8D; Methods: Osteoclast culture','formation','decreased','1','uM','6-7 days','mouse','wild-type C57BL/6J bone marrow stromal cultures with RANKL/M-CSF','not_reported',
        'Propranolol reduced mature multinucleated osteoclast counts in wild-type cultures.',
        'No matched viability result extracted; not labeled selective/noncytotoxic.')
    add('propranolol','35122666','PMC9098680','10.1002/jbmr.4523','PMC9098680.bioc.xml','Results and Fig. 8E; Methods: Osteoclast culture','resorption','trend_decreased','1','uM','10-12 days','mouse','wild-type C57BL/6J cultures on Osteo Assay surface','not_reported',
        'Authors describe a tendency toward reduced resorbed area.',
        'A stated trend is not promoted to a significant inhibitory label.')
    add('propranolol','35122666','PMC9098680','10.1002/jbmr.4523','PMC9098680.bioc.xml','Results and Fig. 8D','formation','no_significant_change','1','uM','6-7 days','mouse','Adrb1/Adrb2 double-knockout bone marrow stromal cultures','not_reported',
        'The same propranolol treatment did not affect knockout-derived osteoclast formation.',
        'Genotype-specific mechanistic control; not a general wild-type drug negative.')
    for endpoint in ['formation','resorption']:
        add('enoxacin','19630402','PMC2889180','10.1021/jm900277z','enoxacin_search.json','Primary abstract',endpoint,'decreased','','','not_extracted','mouse','vitamin-D-stimulated marrow cultures','not_reported',
            'Enoxacin reduced osteoclast formation and resorption lacunae in the reported assays.',
            'Osteoblast sparing is not an osteoclast viability assay. Dose and duration absent from available abstract; currently discontinued-only FDA inventory.','primary_abstract')
    add('rosiglitazone','20519122','PMC3521515','10.1016/j.cmet.2010.04.015','rosiglitazone_search.json','Primary abstract','formation','increased','','','not_extracted','mouse','genetic mouse models and osteoclast differentiation experiments','not_reported',
        'Study reports PPARgamma/PGC1beta-mediated promotion of osteoclastogenesis and resorption.',
        'Abstract-only, exact drug assay conditions not extracted. Opposite-direction evidence retained alongside a different study.','primary_abstract')
    for endpoint in ['formation','resorption']:
        add('rosiglitazone','22286232','PMC3887713','10.1007/s10059-012-2240-z','rosiglitazone2012_search.json','Primary abstract',endpoint,'decreased','','','not_extracted','mouse','mouse bone marrow cultures','not_reported',
            'This study reports dose- and time-dependent suppression of osteoclast formation and pit formation.',
            'Abstract-only, unresolved conditions and apparent conflict with another study. Do not collapse into one drug-level label.','primary_abstract')
    # Verify DOI metadata rather than trusting manually entered citation fields.
    for r in rows:
        if r['raw_file'].endswith('_search.json') or r['raw_file'].endswith('/ssri_search.json'):
            found=[x for x in json.loads((ROOT/r['raw_file']).read_text(encoding='utf-8'))['resultList']['result'] if x['id']==r['source_id'][5:]]
            if len(found)!=1:raise ValueError('Ambiguous primary abstract')
            r['doi']=found[0].get('doi','');r['pmcid']=found[0].get('pmcid','')
    write_csv(OUT/'observations.csv',rows)
    review=[{'observation_id':r['observation_id'],'reviewer_name':'','agree_with_extraction':'','corrected_effect_direction':'','corrected_dose':'','corrected_duration':'','viability_interpretation':'','notes':''} for r in rows]
    if not (OUT/'independent_review.csv').exists():write_csv(OUT/'independent_review.csv',review)
    ledger=read_csv(ROOT/'data/processed/source_records.csv')
    sourcepmids={r['source_id'][5:] for r in rows};overlap=sorted({s['pmid'] for s in ledger if s.get('pmid') in sourcepmids})
    summary={'observations':len(rows),'named_drug_moieties':len({r['drug_name'] for r in rows}),'papers':len(sourcepmids),
        'directions':dict(Counter(r['effect_direction'] for r in rows)),'endpoints':dict(Counter(r['endpoint'] for r in rows)),
        'source_scope':dict(Counter(r['source_scope'] for r in rows)),'canonical_source_overlap_pmids':overlap,
        'independent_human_review':'pending','selection':'Purposive contrast/challenge sample, not a systematic or prevalence-representative screen.',
        'locked_test_set':False,'observations_sha256':digest((OUT/'observations.csv').read_bytes())}
    (OUT/'summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8');print(json.dumps(summary,indent=2))


if __name__=='__main__':run()
