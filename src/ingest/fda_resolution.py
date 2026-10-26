"""Cached FDA/PubChem/ChEMBL joins. Offline by default; --fetch enables public APIs.

No paid calls, canonical KG mutations, inferred negative labels, or symbol-only target joins.
"""
import argparse
import csv
import hashlib
import json
import threading
import time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote
import requests

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'data/raw/fda_resolution_v1'
OUT = ROOT / 'data/fda/resolution_v1'
LOCK = threading.Lock()
LAST = 0.0


def digest(b): return hashlib.sha256(b).hexdigest()
def norm(s): return ' '.join((s or '').upper().split())
def read_csv(p):
    with p.open(encoding='utf-8', newline='') as f: return list(csv.DictReader(f))
def write_csv(p, rows):
    with p.open('w', encoding='utf-8', newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)


def cached(url, fetch=False):
    global LAST
    RAW.mkdir(parents=True,exist_ok=True)
    key=digest(url.encode());p=RAW/(key+'.json');mp=RAW/(key+'.meta.json')
    if p.exists() and mp.exists():
        meta=json.loads(mp.read_text(encoding='utf-8'));body=p.read_bytes()
        if digest(body)!=meta['sha256']: raise ValueError('Cache checksum mismatch')
        return json.loads(body),meta
    if not fetch: raise FileNotFoundError('Missing cached URL: '+url)
    for attempt in range(3):
        try:
            # Global ceiling below PubChem's five requests/sec across all workers.
            with LOCK:
                time.sleep(max(0,.30-(time.monotonic()-LAST)));LAST=time.monotonic()
            r=requests.get(url,timeout=30,headers={'User-Agent':'OC-Drug-Repurposing public research data pipeline'})
            if r.status_code==404: data=r.json()
            else: r.raise_for_status();data=r.json()
            body=r.content
            meta={'url':url,'retrieved_at':datetime.now(timezone.utc).isoformat(),'http_status':r.status_code,'sha256':digest(body),'raw_file':p.relative_to(ROOT).as_posix()}
            p.write_bytes(body);mp.write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
            return data,meta
        except (requests.RequestException,ValueError):
            if attempt==2: raise
            time.sleep(2**attempt)


def pages(url,key,fetch):
    result=[];provenance={}
    while url:
        d,m=cached(url,fetch)
        for row in d[key]:
            result.append(row)
            identifier=row.get('molecule_chembl_id') if key=='molecules' else row.get('target_chembl_id') if key=='targets' else str(row['mec_id'])
            provenance[identifier]=m
        nxt=d['page_meta']['next'];url='https://www.ebi.ac.uk'+nxt if nxt else None
        print(key,len(result),flush=True)
    return result,provenance


def resolve_pubchem(ingredient,fetch):
    url='https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+quote(ingredient['ingredient_name'],safe='')+'/property/MolecularFormula,MolecularWeight,InChIKey,IsomericSMILES/JSON?name_type=complete'
    row={'ingredient_id':ingredient['ingredient_id'],'ingredient_name':ingredient['ingredient_name'],'inventory_status':ingredient['inventory_status'],'pubchem_status':'unresolved','pubchem_cid':'','pubchem_candidates':'','inchikey':'','smiles':'','formula':'','molecular_weight':'','raw_file':'','raw_sha256':'','source_url':url,'error':''}
    try:
        d,m=cached(url,fetch);props=d.get('PropertyTable',{}).get('Properties',[])
        row.update(raw_file=m['raw_file'],raw_sha256=m['sha256'],pubchem_candidates='|'.join(str(p['CID']) for p in props))
        if len(props)==1:
            p=props[0];row.update(pubchem_status='unique_complete_name_registry_result',pubchem_cid=p['CID'],inchikey=p.get('InChIKey',''),smiles=p.get('SMILES',p.get('IsomericSMILES','')),formula=p.get('MolecularFormula',''),molecular_weight=p.get('MolecularWeight',''))
        elif len(props)>1: row['pubchem_status']='ambiguous_multiple_structures'
        else: row['pubchem_status']='no_registry_match'
    except (requests.RequestException,FileNotFoundError,ValueError,KeyError) as e:
        row['pubchem_status']='retrieval_error';row['error']=str(e)
    return row


def choose_chembl(row,molecules,bykey,byname):
    exact=bykey.get(row['inchikey'],[]) if row['inchikey'] else []
    ids=exact or byname.get(norm(row['ingredient_name']),[])
    # Equivalent records can share a parent, but ambiguity across parents is retained.
    parents={(molecules[i].get('molecule_hierarchy') or {}).get('parent_chembl_id') or i for i in ids}
    if not ids:return [],'', 'unmapped'
    if len(parents)!=1:return ids,'','ambiguous_parent_mappings'
    return ids,next(iter(parents)),'full_inchikey_match' if exact else 'exact_registry_name_or_synonym_parent_mapping'


def ensure_orthology(fetch=False):
    p=RAW/'HOM_MouseHumanSequence.rpt';mp=RAW/'HOM_MouseHumanSequence.meta.json'
    if p.exists() and mp.exists():
        if digest(p.read_bytes())!=json.loads(mp.read_text(encoding='utf-8'))['sha256']:raise ValueError('MGI checksum mismatch')
        return
    if not fetch:raise FileNotFoundError('Missing MGI homology snapshot')
    url='https://www.informatics.jax.org/downloads/reports/HOM_MouseHumanSequence.rpt'
    r=requests.get(url,timeout=60);r.raise_for_status()
    if 'SWISS_PROT IDs' not in r.text[:1000]:raise ValueError('Unexpected MGI report schema')
    p.write_bytes(r.content);mp.write_text(json.dumps({'url':url,'sha256':digest(r.content),'retrieved_at':datetime.now(timezone.utc).isoformat()},indent=2)+'\n',encoding='utf-8')


def run(fetch=False):
    OUT.mkdir(parents=True,exist_ok=True)
    RAW.mkdir(parents=True,exist_ok=True);ensure_orthology(fetch)
    pointer=json.loads((ROOT/'data/fda/current.json').read_text(encoding='utf-8'))
    ingredients=read_csv(ROOT/pointer['directory']/'ingredients.csv')
    status,_=cached('https://www.ebi.ac.uk/chembl/api/data/status.json',fetch)
    mols,mp=pages('https://www.ebi.ac.uk/chembl/api/data/molecule.json?max_phase=4&limit=1000','molecules',fetch)
    mechanisms,mep=pages('https://www.ebi.ac.uk/chembl/api/data/mechanism.json?limit=1000','mechanisms',fetch)
    molecules={m['molecule_chembl_id']:m for m in mols};bykey=defaultdict(list);byname=defaultdict(list)
    for mid,m in molecules.items():
        k=(m.get('molecule_structures') or {}).get('standard_inchi_key')
        if k:bykey[k].append(mid)
        names={norm(m.get('pref_name'))}|{norm(x.get('molecule_synonym')) for x in m.get('molecule_synonyms',[])}
        for name in names- {''}:byname[name].append(mid)
    identities=[]
    with ThreadPoolExecutor(max_workers=4) as pool:
        for row in pool.map(lambda i:resolve_pubchem(i,fetch),ingredients):
            ids,parent,basis=choose_chembl(row,molecules,bykey,byname)
            row.update(chembl_ids='|'.join(sorted(ids)),chembl_parent_id=parent,chembl_mapping_basis=basis,
                       chembl_source_files='|'.join(sorted({mp[i]['raw_file'] for i in ids})),
                       chemical_identity_review='registry_mapping_not_independent_identity_review')
            identities.append(row)
            if len(identities)%100==0:
                write_csv(OUT/'identities.csv',identities);print('identity',len(identities),'/',len(ingredients),flush=True)
    write_csv(OUT/'identities.csv',identities)
    byparent=defaultdict(list)
    for row in identities:
        if row['chembl_parent_id']:byparent[row['chembl_parent_id']].append(row)
    relevant=[m for m in mechanisms if (m.get('parent_molecule_chembl_id') or m['molecule_chembl_id']) in byparent]
    targetids=sorted({m['target_chembl_id'] for m in relevant if m.get('target_chembl_id')})
    targets={};tp={}
    for start in range(0,len(targetids),40):
        url='https://www.ebi.ac.uk/chembl/api/data/target.json?target_chembl_id__in='+','.join(targetids[start:start+40])+'&limit=1000'
        values,prov=pages(url,'targets',fetch);targets.update({t['target_chembl_id']:t for t in values});tp.update(prov)
    nodes=read_csv(ROOT/'data/processed/nodes.csv');exactnodes=defaultdict(list)
    for n in nodes:
        sc=json.loads(n.get('structure_candidates') or '{}')
        if n['type']=='protein' and sc.get('uniprot_id'):exactnodes[(sc['uniprot_id'],n['taxon'])].append(n['node_id'])
    taxa={9606:'human',10090:'mouse',10116:'rat'};rows=[]
    for m in relevant:
        parent=m.get('parent_molecule_chembl_id') or m['molecule_chembl_id'];tid=m.get('target_chembl_id');t=targets.get(tid,{})
        comps=t.get('target_components') or [{}];tax=taxa.get(t.get('tax_id'),str(t.get('tax_id') or ''))
        for drug in byparent[parent]:
            for c in comps:
                acc=c.get('accession') or '';matches=exactnodes.get((acc,tax),[]) if t.get('target_type')=='SINGLE PROTEIN' else []
                rows.append({'ingredient_id':drug['ingredient_id'],'ingredient_name':drug['ingredient_name'],'chembl_parent_id':parent,
                    'mechanism_id':m['mec_id'],'mechanism_molecule_id':m['molecule_chembl_id'],'action_type':m.get('action_type') or '',
                    'mechanism':m.get('mechanism_of_action') or '', 'target_chembl_id':tid or '', 'target_name':t.get('pref_name',''),
                    'target_type':t.get('target_type',''),'target_accession':acc,'target_taxon':tax,
                    'direct_interaction':m.get('direct_interaction'),'molecular_mechanism':m.get('molecular_mechanism'),
                    'mechanism_refs':json.dumps(m.get('mechanism_refs',[]),sort_keys=True),
                    'selectivity_comment':m.get('selectivity_comment') or '', 'mechanism_comment':m.get('mechanism_comment') or '',
                    'evidence_status':'curated_database_mechanism_not_new_assay_review', 'potency_value':'',
                    'identity_mapping_basis':drug['chembl_mapping_basis'], 'kg_node_ids':'|'.join(matches),
                    'kg_mapping_status':'exact_accession_and_taxon' if matches else 'complex_or_family_not_projected' if t.get('target_type') not in {'SINGLE PROTEIN',''} else 'target_not_represented',
                    'mechanism_raw_file':mep[str(m['mec_id'])]['raw_file'],'mechanism_raw_sha256':mep[str(m['mec_id'])]['sha256'],
                    'target_raw_file':tp.get(tid,{}).get('raw_file',''),'target_raw_sha256':tp.get(tid,{}).get('sha256','')})
    if rows:write_csv(OUT/'drug_targets.csv',rows)
    coverage=[]
    for d in identities:
        rr=[r for r in rows if r['ingredient_id']==d['ingredient_id']]
        coverage.append({'ingredient_id':d['ingredient_id'],'ingredient_name':d['ingredient_name'],'inventory_status':d['inventory_status'],
                         'pubchem_status':d['pubchem_status'],'chembl_mapping_basis':d['chembl_mapping_basis'],
                         'mechanism_records':len({r['mechanism_id'] for r in rr}), 'exact_kg_target_nodes':'|'.join(sorted({n for r in rr for n in r['kg_node_ids'].split('|') if n})),
                         'osteoclast_effect_label':'unknown'})
    write_csv(OUT/'coverage.csv',coverage)
    summary={'fda_snapshot':pointer['snapshot_id'],'chembl_status':status,'ingredients_processed':len(identities),
        'identity_status':dict(Counter(r['pubchem_status'] for r in identities)), 'chembl_mapping_basis':dict(Counter(r['chembl_mapping_basis'] for r in identities)),
        'ingredients_with_mechanisms':sum(r['mechanism_records']>0 for r in coverage), 'drug_target_component_rows':len(rows),
        'ingredients_with_exact_kg_targets':sum(bool(r['exact_kg_target_nodes']) for r in coverage),
        'canonical_graph_mutated':False,'clinical_potency_inferred':False,'files':{n:digest((OUT/n).read_bytes()) for n in ['identities.csv','drug_targets.csv','coverage.csv']}}
    (OUT/'summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8');print(json.dumps(summary,indent=2),flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--fetch',action='store_true');run(p.parse_args().fetch)
