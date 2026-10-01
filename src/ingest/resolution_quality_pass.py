"""Versioned identity repair and deferred-claim audit; no paid extraction calls.

Registry mappings remain automated proposals, never expert biological validation.
"""
import argparse
import copy
import csv
from collections import Counter
from datetime import datetime, timezone
import hashlib
import io
import json
from pathlib import Path
import random
import re
import time
import requests

from src.ingest.ground_development_claims import load_catalog, ground_entity, normalize
from src.ingest.prepare_resolution_iteration import registry_aliases
from src.kg.integrate_pyk2_pilot import TABLES, csv_text, sha, apply_patch_file

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'data/staging/resolution_quality_v3'
RAW=ROOT/'data/raw/provenance/resolution_quality_v3'
REPAIRS={'CHEBI:32838':('CHEBI:16383','cis-aconitate(3-)','cis-aconitate'),
         'CHEBI:30805':('CHEBI:17240','itaconate(2-)','itaconate|2-methylenesuccinate'),
         'CHEBI:17544':('CHEBI:15378','hydron (H+)','H+|hydron'),
         'CHEBI:15554':('CHEBI:15551','prostaglandin E2','PGE2|dinoprostone|prostaglandin E2')}

def read_jsonl(path):
    return [json.loads(l) for l in path.read_text(encoding='utf-8').splitlines()]

def write_json(path,value):
    path.write_text(json.dumps(value,indent=2,ensure_ascii=False),encoding='utf-8')

def write_jsonl(path,rows):
    path.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows),encoding='utf-8')

def cache(name,url,params=None,offline=False):
    RAW.mkdir(parents=True,exist_ok=True)
    path=RAW/name;meta=path.with_suffix(path.suffix+'.meta.json')
    if path.exists():
        m=json.loads(meta.read_text())
        if sha(path.read_bytes())!=m['sha256']: raise ValueError('Registry hash changed')
        return json.loads(path.read_text(encoding='utf-8'))
    if offline: raise FileNotFoundError(path)
    response=requests.get(url,params=params,timeout=50);response.raise_for_status()
    body=response.json();path.write_bytes(response.content)
    write_json(meta,{'url':response.url,'sha256':sha(response.content),'retrieved_at':datetime.now(timezone.utc).isoformat()})
    time.sleep(.4)
    return body

def repair(apply=False,offline=False):
    OUT.mkdir(parents=True,exist_ok=True);target=OUT/'identity_patch.json'
    if not target.exists():
        before={t:(ROOT/'data/processed'/f'{t}.csv').read_bytes().decode('utf-8') for t in TABLES}
        tables={t:list(csv.DictReader(io.StringIO(v))) for t,v in before.items()}
        fields={t:next(csv.reader(io.StringIO(v))) for t,v in before.items()}
        decisions=[]
        for old,(new,name,aliases) in REPAIRS.items():
            registry=cache('chebi_'+new.split(':')[1]+'.json','https://www.ebi.ac.uk/chebi/backend/api/public/compound/'+new.split(':')[1]+'/',offline=offline)
            if registry['chebi_accession']!=new: raise ValueError('Unexpected chemical accession')
            if normalize(registry['ascii_name'])!=normalize(name.replace(' (H+)','')): raise ValueError('Unexpected chemical name')
            node=next(n for n in tables['nodes'] if n['node_id']==old)
            if any(n['node_id']==new for n in tables['nodes']): raise ValueError('Merge requires review')
            node.update(node_id=new,name=name,aliases=aliases,identity_status='registry_identity_corrected',structure_candidates='{}')
            # A false accession is NOT a valid external synonym or legacy identity.
            node['annotation_status']+='; Corrected erroneous accession '+old+'. Standard chemical representation; experimental protonation is not established. See resolution_quality_v3/identity_review.json.'
            incident=[]
            for edge in tables['edges']:
                if old not in (edge['source_id'],edge['target_id']): continue
                previous=copy.deepcopy(edge)
                for key in ('source_id','target_id'):
                    if edge[key]==old: edge[key]=new
                if edge['edge_id']!='edge:0047':
                    edge['status']='quarantined'
                    reason='Affected legacy relation has no resolved supporting source; chemical identity repair cannot establish activation/inhibition. Substrate/product participation must not be inferred as activation.'
                else:
                    reason='Retained proposed itaconate/TET2 claim and source-checked qualitative passage; identity correction does not validate exact protonation, context, or pharmacological mechanism.'
                edge['review_note']+=' Identity review v3: '+reason
                incident.append({'edge_id':edge['edge_id'],'before':previous,'after':copy.deepcopy(edge),'decision':reason})
            decisions.append({'old_erroneous_id':old,'corrected_id':new,'registry_ascii_name':registry['ascii_name'],'incident_edges':incident,'old_accession_is_not_an_alias':True})
        after={t:csv_text(tables[t],fields[t]) for t in TABLES}
        patch={'patch_id':'identity_quality_v3','before':before,'after':after,'before_sha256':{t:sha(v.encode()) for t,v in before.items()},'after_sha256':{t:sha(v.encode()) for t,v in after.items()},'new_edge_ids':[]}
        write_json(target,patch);write_json(OUT/'identity_review.json',decisions)
    if apply: print(apply_patch_file(target))
    return target

def cleaned_surface(surface,form):
    """Strip only expression/measurement wrappers; never variant or family suffixes."""
    result=surface.strip()
    if form=='protein': result=re.sub(r'\s+protein$','',result,flags=re.I)
    if form=='gene': result=re.sub(r'\s+gene$','',result,flags=re.I)
    if form=='RNA': result=re.sub(r'\s+mRNA(?:\s+expression(?:\s+level)?)?$','',result,flags=re.I)
    return result

def prepare(offline=False):
    OUT.mkdir(parents=True,exist_ok=True)
    if (OUT/'prepared.json').exists(): return
    outcomes=read_jsonl(ROOT/'data/staging/full_integration_v2/claim_outcomes.jsonl')
    deferred={r['claim_id']:r for r in outcomes if r['status']=='deferred'}
    records=[r for r in read_jsonl(ROOT/'data/staging/resolution_iteration_v2/claims.jsonl') if r['claim_id'] in deferred]
    oldg={r['claim_id']:r for r in read_jsonl(ROOT/'data/staging/resolution_iteration_v2/grounding.jsonl')}
    packets={p['request_id']:p for p in read_jsonl(ROOT/'data/staging/resolution_iteration_v2/packets.jsonl')}
    rng=random.Random(20261002)
    sample=rng.sample(sorted(records,key=lambda r:r['claim_id']),120)
    write_jsonl(OUT/'random_audit_sample.jsonl',[{'claim_id':r['claim_id'],'source_id':r['source_id'],'prior_reason':deferred[r['claim_id']]['reason'],'claim':r['claim']} for r in sample])
    catalog=load_catalog(ROOT,ROOT/'data/raw/provenance/full_grounding_v1')
    # Discover missing registry entries for recurring exact names in a known species.
    names=Counter((cleaned_surface(g.get('surface',''),g['molecular_form']),g.get('specimen_taxon_candidate')) for row in oldg.values() if row['claim_id'] in deferred for g in row['grounding'] if g['molecular_form'] in ('gene','protein','RNA') and not g.get('registry_candidates') and g.get('specimen_taxon_candidate'))
    selected=[(n,t,c) for (n,t),c in names.most_common() if re.fullmatch(r'[A-Za-z][A-Za-z0-9-]{2,18}',n) and c>=2][:30]
    discoveries=[]
    for name,tid,count in selected:
        key=hashlib.sha256((name+tid).encode()).hexdigest()[:16]
        result=cache('search_'+key+'.json','https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',{'db':'gene','term':f'"{name}"[Gene Name] AND txid{tid}[Organism] AND alive[prop]','retmode':'json','retmax':20},offline)
        ids=result.get('esearchresult',{}).get('idlist',[])
        if ids:
            cache('ncbi_gene_'+key+'.json','https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',{'db':'gene','id':','.join(ids),'retmode':'json'},offline)
        discoveries.append({'surface':name,'taxon':tid,'mentions':count,'search_candidate_ids':ids})
        print('Registry search',name,tid,len(ids),flush=True)
    catalog.update(load_catalog(ROOT,RAW))
    for gene in catalog.values():
        raw=json.loads((ROOT/gene['raw_file']).read_text(encoding='utf-8'))['result'][gene['gene_id']]
        gene['aliases']=sorted(set(gene['aliases'])|registry_aliases([raw['name'],raw.get('description','')]+raw.get('otheraliases','').split(',')+raw.get('otherdesignations','').split('|')))
    nodes=list(csv.DictReader((ROOT/'data/processed/nodes.csv').open(encoding='utf-8-sig')))
    grounded=[];decisions=[]
    for r in records:
        gs=[]
        for e in r['claim']['entities']:
            previous=next(g for g in oldg[r['claim_id']]['grounding'] if g['entity_key']==e['key'])
            candidate={**e,'surface':cleaned_surface(e['surface'],e['molecular_form'])}
            grounding_context=copy.deepcopy(r['claim']['context'])
            if not previous.get('specimen_taxon_candidate'):
                # A v2 context completed from OTHER entities cannot assign this entity's species.
                grounding_context['species']=None
            g=ground_entity(candidate,grounding_context,packets[r['request_id']],catalog,nodes)
            g['flags']=[f for f in g['flags'] if f!='molecular_form_conflict_with_model_node_hint']
            g['species_resolution_basis']=previous.get('species_resolution_basis')
            if len(g['registry_candidates'])==1 and len(previous.get('registry_candidates',[]))!=1:
                decisions.append({'claim_id':r['claim_id'],'source_id':r['source_id'],'entity_key':e['key'],'original_surface':e['surface'],'lookup_surface':candidate['surface'],'molecular_form':e['molecular_form'],'old_candidates':previous.get('registry_candidates',[]),'new_candidates':g['registry_candidates'],'species':g.get('specimen_taxon_candidate'),'basis':'unique_exact_registry_alias_with_species; optional form-consistent terminal wrapper removal','review_status':'automated_registry_match'})
            gs.append(g)
        grounded.append({'claim_id':r['claim_id'],'grounding':gs})
    write_jsonl(OUT/'claims.jsonl',records);write_jsonl(OUT/'grounding.jsonl',grounded)
    write_jsonl(OUT/'mapping_changes.jsonl',decisions)
    write_json(OUT/'registry_searches.json',discoveries)
    write_json(OUT/'prepared.json',{'deferred_claims':len(records),'simple_random_sample':120,'seed':20261002,'new_unique_entity_matches':len(decisions),'deferral_reasons':dict(Counter(r['reason'] for r in deferred.values())),'paid_calls':0})

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('step',choices=['repair','prepare']);p.add_argument('--apply',action='store_true');p.add_argument('--offline',action='store_true');a=p.parse_args()
    repair(a.apply,a.offline) if a.step=='repair' else prepare(a.offline)
