"""Second integration: recover grounded mechanisms and preserve a separate chemical evidence layer."""
import argparse
import copy
import csv
import hashlib
import json
from pathlib import Path
import re
from collections import Counter

from src.ingest.prepare_resolution_iteration import OUT,chemical_name,molecule_name
from src.ingest.ground_development_claims import normalize
from src.kg import integrate_full_enrichment as base
from src.kg.integrate_pyk2_pilot import apply_patch_file

ROOT=base.ROOT
OUTPUT='data/staging/full_integration_v2'
CHEMICALS={}
REVIEW_DEFERRALS={
 'extracted:b02d31298faaa086b6476964':'Mixed human xenograft/mouse paper; abstract does not identify osteoclast assay species or separate genetic from pharmacological c-Src suppression. Full-text assay review required.',
 'extracted:06cb954cc37a05c86aa2a414':'Source says could promote: hypothesis misclassified as observed.',
 'extracted:88e2317cb2886b14500ff33f':'Modal combination claim does not establish a single PTX3 effect.',
 'extracted:e3bb546079548b8525055175':'Source says could stimulate: requires primary experimental evidence.',
 'extracted:1bc65ec4b2bf464f26fe92d3':'Quoted fragment lacks the intervention and outcome direction.',
 'extracted:ea0783557024d9815effd949':'Combined calcium and phosphorus-oxide exposure cannot be attributed to calcium alone.',
}
EXTRA_PROCESSES={
 'osteoclasticresorption':'PATHWAY:BONE_RESORPTION','osteoclastresorption':'PATHWAY:BONE_RESORPTION',
 'osteoclastdifferentiationandformation':'LOCAL:process:osteoclast_formation_and_differentiation',
 'osteoclastogenesisandboneresorption':'LOCAL:process:osteoclastogenesis_and_resorption',
 'osteoclastdifferentiationandresorption':'LOCAL:process:osteoclast_differentiation_and_resorption',
 'osteoclastmigration':'LOCAL:process:osteoclast_migration',
 'osteoclastsurvival':'LOCAL:process:osteoclast_survival',
 'osteoclastapoptosis':'LOCAL:process:osteoclast_apoptosis',
 'boneloss':'LOCAL:process:bone_loss','glycolysis':'LOCAL:process:glycolysis',
 'oxidativephosphorylation':'LOCAL:process:oxidative_phosphorylation',
 'autophagy':'LOCAL:process:autophagy',
}


def chemical_catalog():
    result={}
    blocked={'CHEBI:32838','CHEBI:30805','CHEBI:17544','CHEBI:15554'}
    for path in (ROOT/'data/raw/provenance/compound_structures').glob('*.json'):
        if '.meta.' in path.name:
            continue
        meta=json.loads(path.with_suffix('.meta.json').read_text())
        if hashlib.sha256(path.read_bytes()).hexdigest()!=meta['sha256']:
            raise ValueError('Chemical registry hash mismatch')
        entry=json.loads(path.read_text(encoding='utf-8'));nid=entry['chebi_accession']
        if nid in blocked:
            continue
        names=[entry['name'],entry.get('ascii_name','')]+[n.get('ascii_name') or n['name'] for rows in entry.get('names',{}).values() for n in rows]
        for name in names:
            if name:
                result.setdefault(chemical_name(name),[]).append({'node_id':nid,'source':path.relative_to(ROOT).as_posix(),'sha256':meta['sha256']})
    return result


def resolve(entity,grounded,packet,nodes):
    if entity['molecular_form']=='compound':
        matches=CHEMICALS.get(chemical_name(entity['surface']),[])
        ids={m['node_id'] for m in matches if m['node_id'] in nodes}
        if len(ids)==1:
            return next(iter(ids)),None,'exact_cached_ChEBI_synonym'
        return None,None,'chemical_not_mapped_to_canonical_endogenous_entity'
    key=normalize(entity['surface'])
    if entity['molecular_form'] in ('pathway','phenotype') and key in EXTRA_PROCESSES:
        nid=EXTRA_PROCESSES[key]
        if nid in nodes:
            return nid,None,'explicit_process_mapping_v2'
        return nid,{'node_id':nid,'type':'pathway','name':entity['surface'],'taxon':'all','identity_status':'local_process_definition','structure_candidates':'{}','annotation_status':'Local process definition; composite outcomes are kept composite, not split or treated as equivalent to individual endpoints.'},'local_process_definition'
    if grounded.get('species_resolution_basis')=='Cellosaurus:CVCL_0493':
        # The checked cell-line registry supplies the species, not provider gene IDs.
        checked=copy.deepcopy(packet)
        checked['passages']=checked['passages']+[{'text':'mouse (Cellosaurus CVCL_0493 species crosswalk)'}]
        return base.resolve(entity,grounded,checked,nodes)
    return base.resolve(entity,grounded,packet,nodes)


def project(claim):
    reg=claim.get('regulatory')
    if not reg or claim['assertion']!='observed_result':
        return base.project(claim)
    entities={e['key']:e for e in claim['entities']}
    subject=entities.get(reg['subject'],{})
    text=' '.join(e['quote'] for e in claim['evidence'])
    if subject.get('molecular_form') in ('pathway','phenotype') and claim['experiment']['perturbation_type']=='not_stated' and reg['effect_level'] in ('expression','abundance') and re.search(r'\bduring\b|coupled with|correlat',text,re.I):
        return ('ASSOCIATED_WITH',0,'observational_expression_change'),'projected'
    if reg['effect_level']=='binding' and reg['sign']=='unknown':
        return ('ASSOCIATED_WITH',0,'reported_association'),'projected'
    if claim['experiment']['perturbation_type']=='chemical_treatment' and subject.get('molecular_form') in ('compound','protein'):
        if subject['molecular_form']=='protein' and re.search(r'inhibit|blockade|antagonis|suppress',claim['experiment'].get('intervention') or '',re.I):
            return None,'pharmacological_target_inhibition_is_not_protein_addition'
        name=normalize(subject.get('surface'))
        if not name or name not in normalize(claim['experiment'].get('intervention')) or name not in normalize(molecule_name(text)):
            return None,'chemical_intervention_not_explicitly_anchored'
        direction={'increased':1,'decreased':-1}.get(claim['experiment']['outcome_change'])
        model={'positive':1,'negative':-1}.get(reg['sign'])
        if not direction or (model and model!=direction) or reg['direction']!='subject_to_object':
            return None,'chemical_outcome_direction_requires_review'
        candidate=copy.deepcopy(claim)
        candidate.update(kind='regulation')
        candidate['experiment']['perturbation_type']='other'
        candidate['regulatory'].update(interpretation='explicit_in_text',sign='positive' if direction==1 else 'negative')
        result,reason=base.project(candidate)
        if result:
            return (result[0],result[1],'chemical_treatment_effect' if subject['molecular_form']=='compound' else 'reported_molecular_addition_effect'),'projected'
        return result,reason
    return base.project(claim)


def chemical_layer(nodes):
    records=list(map(json.loads,(ROOT/OUT/'claims.jsonl').read_text(encoding='utf-8').splitlines()))
    packets={p['request_id']:p for p in map(json.loads,(ROOT/OUT/'packets.jsonl').read_text(encoding='utf-8').splitlines())}
    grounding={r['claim_id']:r for r in map(json.loads,(ROOT/OUT/'grounding.jsonl').read_text(encoding='utf-8').splitlines())}
    chemicals=json.loads((ROOT/OUT/'chemical_identities.json').read_text())
    for chemical in chemicals:
        for field in ('source','property_source'):
            meta=chemical.get(field)
            if meta and hashlib.sha256((ROOT/meta['raw_file']).read_bytes()).hexdigest()!=meta['sha256']:
                raise ValueError('Chemical registry snapshot changed')
    index={c['surface']:c for c in chemicals if c['status']=='exact_registry_synonym_candidate'}
    results=[]
    for r in records:
        c=r['claim'];reg=c.get('regulatory')
        if not reg:
            continue
        bykey={e['key']:e for e in c['entities']};s=bykey.get(reg['subject']);t=bykey.get(reg['object'])
        if not s or not t or s['molecular_form']!='compound':
            continue
        chem=index.get(chemical_name(s['surface']))
        if not chem:
            continue
        projection,reason=project(c)
        if not projection:
            continue
        packet=packets[r['request_id']]
        if not any('osteoclast' in p['text'].casefold() for p in packet['passages']):
            continue
        # Preserve exact extraction provenance and explicitly avoid interpreting expression effects as binding.
        g=next(g for g in grounding[r['claim_id']]['grounding'] if g['entity_key']==t['key'])
        tid,new,status=resolve(t,g,packet,nodes)
        results.append({'claim_id':r['claim_id'],'source_id':r['source_id'],'chemical_id':'PUBCHEM:'+str(chem['pubchem_cid']),'surface':s['surface'],'target_node_id':tid if tid in nodes else None,'target_surface':t['surface'],'target_mapping_status':status,'relation':projection[0],'sign':projection[1],'causal_basis':projection[2],'effect_level':reg['effect_level'],'directness':reg['directness'],'context':c['context'],'experiment':c['experiment'],'evidence':c['evidence'],'summary':c['summary'],'uncertainties':c['uncertainties'],'registry_provenance':chem['source'],'property_provenance':chem['property_source'],'raw_source_file':r['raw_source_file'],'source_sha256':r['source_sha256'],'review_status':'automated_extraction','canonical_imported':False,'direct_drug_target_binding_established':False})
    out=ROOT/OUTPUT
    (out/'chemical_effects.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in results),encoding='utf-8')
    fields=['claim_id','source_id','chemical_id','surface','target_node_id','target_surface','relation','sign','causal_basis','effect_level','review_status']
    with (out/'chemical_effects.csv').open('w',encoding='utf-8',newline='') as handle:
        writer=csv.DictWriter(handle,fields,extrasaction='ignore');writer.writeheader();writer.writerows(results)
    report={'source_linked_chemical_effects':len(results),'distinct_chemical_ids':len({r['chemical_id'] for r in results}),'with_existing_canonical_target':sum(bool(r['target_node_id']) for r in results),'direct_drug_target_binding_assertions':0,'additional_paid_calls':0}
    (out/'chemical_layer_summary.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))


def run(apply=False):
    global CHEMICALS
    CHEMICALS=chemical_catalog()
    base.REVIEW_DEFERRALS.update(REVIEW_DEFERRALS)
    path=base.prepare(output=OUTPUT,records_path=OUT+'/claims.jsonl',packets_path=OUT+'/packets.jsonl',grounding_path=OUT+'/grounding.jsonl',resolver=resolve,projector=project)
    patch=json.loads(path.read_text(encoding='utf-8'))
    files=[OUT+'/'+name for name in ['claims.jsonl','grounding.jsonl','packets.jsonl','entity_decisions.jsonl','chemical_identities.json']]
    files+=['data/raw/provenance/resolution_iteration_v2/CVCL_0493.html','data/raw/provenance/resolution_iteration_v2/CVCL_0493.meta.json']
    digests={name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in files}
    if 'resolution_input_sha256' in patch and patch['resolution_input_sha256']!=digests:
        raise ValueError('Resolution inputs changed after patch freezing')
    if 'resolution_input_sha256' not in patch:
        patch['resolution_input_sha256']=digests
        path.write_text(json.dumps(patch,ensure_ascii=False),encoding='utf-8')
    if apply:
        print(apply_patch_file(path))
        from src.kg.rebuild import rebuild
        rebuild(ROOT)
    patch=json.loads(path.read_text(encoding='utf-8'))
    import io
    nodes={n['node_id']:n for n in csv.DictReader(io.StringIO(patch['after']['nodes']))}
    chemical_layer(nodes)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--apply',action='store_true')
    run(parser.parse_args().apply)
