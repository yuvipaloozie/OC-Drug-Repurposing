"""Integrate audited v3 matches with frozen inputs and measurable before/after coverage."""
import argparse
import copy
import csv
import io
import json
import re
from pathlib import Path
from src.ingest.resolution_quality_pass import ROOT,OUT,RAW,REPAIRS,read_jsonl,write_json,write_jsonl,cleaned_surface
from src.ingest.prepare_resolution_iteration import chemical_name
from src.ingest.ground_development_claims import normalize,perturbation_projection
from src.kg import integrate_full_enrichment as base
from src.kg import integrate_resolution_iteration as v2
from src.kg.integrate_pyk2_pilot import apply_patch_file,sha
from src.kg.measure_resolution_connectivity import graph_from_tables,measure

OUTPUT='data/staging/full_integration_v3'
REVIEW_DEFERRALS={
 'extracted:b5aa6e9a0629e1538967f940':'Review abstract mixes mouse osteoclast and OSCC experiments; OSCC species is not established by the mouse mention.',
 'extracted:1c3828fc21f2bc8589390afd':'Human interface tissue and calvarial animal model are mixed; human FSTL1 cannot be assigned to the calvarial intervention from this abstract.',
}
EXISTING_BAD_PROJECTIONS={'extracted:a156acce8f1c58e92e576f4e','extracted:9af178df993edd89f3725579'}
PROCESSES={'ranklinducedosteoclastdifferentiation':'PATHWAY:OSTEOCLAST_DIFFERENTIATION',
           'ranklinducedosteoclastogenesis':'PATHWAY:OSTEOCLAST_DIFFERENTIATION',
           'alveolarboneresorption':'LOCAL:process:alveolar_bone_resorption',
           'osteolysis':'LOCAL:process:osteolysis',
           'actindepolymerization':'LOCAL:process:actin_depolymerization'}

def resolve(entity,grounded,packet,nodes):
    surface=entity['surface']
    if re.search(r'\bisoform\b|\bmutant\b|\bmutation\b|\bfamily\b|\bbcl[- ]?xl\b|miR-\d+.*-[35]p\b',surface,re.I):
        return None,None,'variant_family_or_mature_RNA_requires_specific_identity'
    key=normalize(surface)
    if entity['molecular_form'] in ('pathway','phenotype') and key in PROCESSES:
        nid=PROCESSES[key]
        return nid,None if nid in nodes else {'node_id':nid,'type':'pathway','name':surface,'taxon':'all','identity_status':'local_process_definition','structure_candidates':'{}','annotation_status':'Bounded process definition; no equivalence to a broader endpoint asserted.'},'explicit_process_mapping_v3'
    nid,new,status=v2.resolve(entity,grounded,packet,nodes)
    if new and 'registry_' in status:
        new['annotation_status']='Automated registry alias/species mapping; exact molecular form and experiment remain unreviewed. Decisions: '+OUTPUT+'/entity_decisions.jsonl.'
    return nid,new,status

def project(claim):
    result,reason=v2.project(claim)
    if reason=='gene_versus_protein_intervention_requires_review':
        text=' '.join(e['quote'] for e in claim['evidence'])
        reg=claim.get('regulatory') or {}
        if claim['experiment']['perturbation_type']=='loss_of_function' and re.search(r'\bablation\b|\blacking\b',text,re.I) and reg.get('direction')=='subject_to_object':
            role=perturbation_projection({**claim,'kind':'perturbation_effect'})
            if role['normal_role_sign_candidate'] is not None:
                return ('REGULATES',role['normal_role_sign_candidate'],'genetic_perturbation_role_inference'),'projected'
    return result,reason

def chemical_catalog():
    result=v2.chemical_catalog()
    for old,(nid,name,aliases) in REPAIRS.items():
        path=RAW/('chebi_'+nid.split(':')[1]+'.json');meta=json.loads(path.with_suffix('.json.meta.json').read_text())
        if sha(path.read_bytes())!=meta['sha256']: raise ValueError('Registry changed')
        entry=json.loads(path.read_text(encoding='utf-8'))
        names=[entry['ascii_name']]+aliases.split('|')
        # Only reviewed aliases of the selected chemical representation; no acid/base merging.
        for n in names:
            result.setdefault(chemical_name(n),[]).append({'node_id':nid,'source':path.relative_to(ROOT).as_posix(),'sha256':meta['sha256']})
    return result

def run(apply=False):
    v2.CHEMICALS=chemical_catalog();base.REVIEW_DEFERRALS.update(v2.REVIEW_DEFERRALS);base.REVIEW_DEFERRALS.update(REVIEW_DEFERRALS)
    folder=ROOT/OUTPUT;folder.mkdir(parents=True,exist_ok=True)
    inputs=[OUT/'claims.jsonl',OUT/'grounding.jsonl',OUT/'mapping_changes.jsonl',OUT/'prepared.json',ROOT/'data/staging/resolution_iteration_v2/packets.jsonl']
    inputs+=sorted(RAW.glob('*.json'))
    digests={p.relative_to(ROOT).as_posix():sha(p.read_bytes()) for p in inputs}
    manifest=folder/'input_sha256.json'
    if manifest.exists() and json.loads(manifest.read_text())!=digests: raise ValueError('Frozen integration inputs changed')
    if not manifest.exists(): write_json(manifest,digests)
    path=base.prepare(output=OUTPUT,records_path=OUT.relative_to(ROOT).as_posix()+'/claims.jsonl',grounding_path=OUT.relative_to(ROOT).as_posix()+'/grounding.jsonl',packets_path='data/staging/resolution_iteration_v2/packets.jsonl',resolver=resolve,projector=project)
    patch=json.loads(path.read_text(encoding='utf-8'))
    if not patch.get('existing_projection_review'):
        rows={t:list(csv.DictReader(io.StringIO(v))) for t,v in patch['after'].items()}
        affected=set()
        for ev in rows['edge_evidence']:
            try: cid=json.loads(ev['source_location']).get('claim_id')
            except (ValueError,TypeError): continue
            if cid in EXISTING_BAD_PROJECTIONS:
                affected.add(ev['edge_id']);ev['curator_status']='quarantined'
                ev['review_note']+=' V3 audit: pharmacological target inhibition was incorrectly projected as addition of that protein. Retain source, exclude erroneous signed claim.'
        for edge in rows['edges']:
            if edge['edge_id'] in affected:
                edge['status']='quarantined';edge['review_note']+=' V3 audit: inhibition of the target is not addition of the target; prior effect sign is not a normal-role claim.'
        from src.kg.integrate_pyk2_pilot import csv_text
        patch['after']={t:csv_text(rows[t],next(csv.reader(io.StringIO(v)))) for t,v in patch['after'].items()}
        patch['after_sha256']={t:sha(v.encode()) for t,v in patch['after'].items()}
        patch['existing_projection_review']=sorted(affected)
        write_json(path,patch)
    if apply:
        print(apply_patch_file(path))
        from src.kg.rebuild import rebuild
        rebuild(ROOT)
    patch=json.loads(path.read_text(encoding='utf-8'))
    repair=json.loads((OUT/'identity_patch.json').read_text(encoding='utf-8'))
    # Include both identity repairs and recovered evidence in the comparison.
    before=graph_from_tables(repair['before']);after=graph_from_tables(patch['after'])
    fixed={nid for nid,n in before.nodes.items() if n['type']=='protein' and n.get('taxon')=='mouse'}
    result={'scope':'Same starting proteins, 4 edges, 1000 paths per pair; no phenotype intermediates. Coverage is not biomedical accuracy. Includes identity repairs.','before':measure(before,fixed),'after':measure(after,fixed),'before_sha256':repair['before_sha256'],'after_sha256':patch['after_sha256']}
    write_json(folder/'connectivity_comparison.json',result)
    print(json.dumps({k:{a:b for a,b in result[k].items() if a not in ('paths','pairs')} for k in ('before','after')},indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--apply',action='store_true');run(p.parse_args().apply)
