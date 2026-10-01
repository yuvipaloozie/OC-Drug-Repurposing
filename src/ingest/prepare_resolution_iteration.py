"""Deterministic deferral audit, cached chemical lookup, and improved molecular grounding."""
import argparse
import copy
import csv
from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import html
import json
from pathlib import Path
import random
import re
import time
from urllib.parse import quote
import requests

from src.ingest.ground_development_claims import load_catalog, ground_entity, normalize, taxon

ROOT=Path(__file__).resolve().parents[2]
OUT='data/staging/resolution_iteration_v2'
GREEK=str.maketrans({'α':'alpha','β':'beta','γ':'gamma','δ':'delta','ε':'epsilon','κ':'kappa','μ':'mu'})
FORM_REPAIRS={
    'extracted:3ceee9bb3fce66a60047dcb8':{'e1':'protein','e3':'protein'},
    'extracted:4d8b6634159e53a678e0ab4b':{'e1':'protein'},
    'extracted:dc2df37362a444411f8aa769':{'e1':'protein','e2':'protein'},
} # Source passages explicitly describe protein binding/kinase activity; no blanket gene->protein conversion.


def molecule_name(value):
    return str(value or '').translate(GREEK)


def registry_aliases(names):
    expanded=[molecule_name(n) for n in names if n]
    # Registry names such as "proto-oncogene c-Src" explicitly name c-Src.
    expanded += [re.sub(r'^proto-oncogene\s+','',n,flags=re.I) for n in expanded if re.match(r'^proto-oncogene\s+c-',n,re.I)]
    return {normalize(n) for n in expanded if normalize(n)}


def chemical_name(value):
    # Retain stereochemistry, charge and punctuation; do not collapse chemical forms.
    return ' '.join(html.unescape(re.sub('<[^>]+>','',str(value))).casefold().split())


def cache(url, offline=False):
    folder=ROOT/'data/raw/provenance/resolution_iteration_v2';folder.mkdir(parents=True,exist_ok=True)
    key=hashlib.sha256(url.encode()).hexdigest()
    path=folder/(key+'.json');meta=folder/(key+'.meta.json')
    if path.exists():
        metadata=json.loads(meta.read_text())
        if hashlib.sha256(path.read_bytes()).hexdigest()!=metadata['sha256']:
            raise ValueError('Cached registry changed')
        return json.loads(path.read_text(encoding='utf-8')),metadata
    if offline:
        raise FileNotFoundError(url)
    response=requests.get(url,timeout=40)
    if response.status_code not in (200,404):
        response.raise_for_status()
    body=response.json()
    path.write_bytes(response.content)
    metadata={'url':url,'retrieved_at':datetime.now(timezone.utc).isoformat(),'status':response.status_code,'sha256':hashlib.sha256(response.content).hexdigest(),'raw_file':path.relative_to(ROOT).as_posix()}
    meta.write_text(json.dumps(metadata,indent=2))
    time.sleep(.3)
    return body,metadata


def infer_species(entity,context,packet):
    explicit=entity.get('taxon')
    if normalize(explicit) not in ('','null','unknown','notstated'):
        return taxon(explicit),'explicit_entity_taxon' # No substitution for unsupported taxa.
    if taxon(context.get('species')):
        return taxon(context['species']),'extracted_context'
    cell=context.get('cell_type') or ''
    if re.search(r'\bRAW\s*264[. ]?7\b',cell,re.I) and any(re.search(r'\bRAW\s*264[. ]?7\b',p['text'],re.I) for p in packet['passages']):
        return '10090','Cellosaurus:CVCL_0493'
    text=' '.join(p['text'] for p in packet['passages'])
    patterns={'10090':r'\b(mouse|mice|murine|mus musculus)\b','9606':r'\b(human|humans|homo sapiens)\b','10116':r'\b(rat|rats|rattus norvegicus)\b'}
    found=[tid for tid,pattern in patterns.items() if re.search(pattern,text,re.I)]
    if not found and re.search(r'\bRAW\s*264[. ]?7\b',text,re.I):
        return '10090','Cellosaurus:CVCL_0493'
    return (found[0],'single_explicit_paper_species_candidate') if len(found)==1 else (None,'species_unresolved_or_multiple')


def run(offline=False):
    out=ROOT/OUT;out.mkdir(parents=True,exist_ok=True)
    if (ROOT/'data/staging/full_integration_v2/patch.json').exists():
        raise RuntimeError('Frozen v2 patch exists; do not regenerate its input decisions.')
    records=list(map(json.loads,(ROOT/'data/staging/full_enrichment_v2/claims.jsonl').read_text(encoding='utf-8').splitlines()))
    packets={p['request_id']:p for p in map(json.loads,(ROOT/'data/staging/full_enrichment_prepared_v2/requests.jsonl').read_text(encoding='utf-8').splitlines())}
    outcomes=list(map(json.loads,(ROOT/'data/staging/full_integration_v1/claim_outcomes.jsonl').read_text(encoding='utf-8').splitlines()))
    deferred={o['claim_id']:o for o in outcomes if o['status']=='deferred'}
    byid={r['claim_id']:r for r in records}
    groups=defaultdict(list)
    for cid,row in deferred.items():
        groups[row['reason']].append(cid)
    rng=random.Random(20261001);sample=[]
    for reason,ids in sorted(groups.items()):
        for cid in rng.sample(sorted(ids),min(3,len(ids))):
            c=byid[cid]['claim']
            sample.append({'claim_id':cid,'reason':reason,'stratum_size':len(ids),'source_id':byid[cid]['source_id'],'summary':c['summary'],'quotes':[e['quote'] for e in c['evidence']],'claim':c})
    (out/'diagnostic_sample.json').write_text(json.dumps(sample,indent=2,ensure_ascii=False),encoding='utf-8')
    # Prioritize recurring, spelled-out names. Short acronyms and mixtures are not inferred.
    names=Counter(chemical_name(e['surface']) for r in records for e in r['claim']['entities'] if e['molecular_form']=='compound')
    excluded={'reactive oxygen species','bisphosphonates','herbal phytometabolites','vitamin d','calcium','lipopolysaccharide','denosumab','hydroxyapatite','extracellular vesicles'}
    selected=[name for name,n in sorted(names.items(),key=lambda x:(-x[1],x[0])) if n>=3 and len(name)>=6 and name not in excluded][:45]
    chemical=[]
    for name in selected:
        url='https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+quote(name,safe='')+'/synonyms/JSON'
        try:
            body,meta=cache(url,offline)
            infos=body.get('InformationList',{}).get('Information',[])
            exact=[info for info in infos if name in {chemical_name(n) for n in info.get('Synonym',[])}]
            record={'surface':name,'mention_count':names[name],'status':'ambiguous_or_no_exact_synonym','source':meta}
            if len(infos)==1 and len(exact)==1:
                cid=exact[0]['CID']
                properties,propmeta=cache(f'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/property/InChIKey,IUPACName,MolecularFormula/JSON',offline)
                props=properties['PropertyTable']['Properties'][0]
                if props.get('InChIKey'):
                    record.update(status='exact_registry_synonym_candidate',pubchem_cid=cid,properties=props,property_source=propmeta,synonyms=exact[0]['Synonym'])
            chemical.append(record)
        except (requests.RequestException,ValueError,KeyError) as exc:
            chemical.append({'surface':name,'status':'lookup_failed','error_type':type(exc).__name__})
        print('Chemical lookup:',name,chemical[-1]['status'],flush=True)
    (out/'chemical_identities.json').write_text(json.dumps(chemical,indent=2),encoding='utf-8')
    catalog=load_catalog(ROOT,ROOT/'data/raw/provenance/full_grounding_v1')
    nodes=list(csv.DictReader((ROOT/'data/processed/nodes.csv').open(encoding='utf-8-sig',newline='')))
    # Add Greek-letter-normalized aliases from raw registry records, not speculative synonyms.
    for gene in catalog.values():
        raw=json.loads((ROOT/gene['raw_file']).read_text(encoding='utf-8'))['result'][gene['gene_id']]
        nameset=[raw['name'],raw.get('description','')]+raw.get('otheraliases','').split(',')+raw.get('otherdesignations','').split('|')
        gene['aliases']=sorted(set(gene['aliases'])|registry_aliases(nameset))
    changed=[];grounded=[];decisions=[]
    for record in records:
        if record['claim_id'] not in deferred:
            continue
        r=copy.deepcopy(record);c=r['claim'];p=packets[r['request_id']]
        c['regulatory']=c.get('regulatory')
        gs=[]
        for e in c['entities']:
            original=copy.deepcopy(e)
            if e['key'] in FORM_REPAIRS.get(r['claim_id'],{}):
                e['molecular_form']=FORM_REPAIRS[r['claim_id']][e['key']]
                e['existing_node_id']=None
            tid,basis=infer_species(e,c['context'],p)
            if tid:
                e['taxon']=tid
            e['surface']=molecule_name(e['surface'])
            # Parenthetical expanded names are usable only if an exact registry alias resolves.
            g=ground_entity(e,c['context'],p,catalog,nodes)
            if not g['registry_candidates'] and e['molecular_form'] in ('gene','protein','RNA'):
                aliases=re.findall(r'\(([^()]+)\)',e['surface'])
                alternatives=[ground_entity({**e,'surface':a},c['context'],p,catalog,nodes) for a in aliases]
                alternatives=[a for a in alternatives if len(a['registry_candidates'])==1]
                if len(alternatives)==1:
                    g=alternatives[0]
            # A wrong model node hint cannot veto a separately resolved exact form/species match.
            g['flags']=[f for f in g['flags'] if f!='molecular_form_conflict_with_model_node_hint']
            g['species_resolution_basis']=basis
            gs.append(g)
            decisions.append({'claim_id':r['claim_id'],'entity_key':e['key'],'original':original,'candidate':e,'species_basis':basis,'registry_candidates':g['registry_candidates']})
        # Fill missing context only if all resolved molecular entities agree on one supported species.
        tids={taxon(e.get('taxon')) for e in c['entities'] if e['molecular_form'] in ('gene','protein','RNA')}
        tids.discard(None)
        if not taxon(c['context'].get('species')) and len(tids)==1:
            c['context']['species']={'10090':'mouse','9606':'human','10116':'rat'}[next(iter(tids))]
        changed.append(r);grounded.append({'claim_id':r['claim_id'],'grounding':gs})
    for name,rows in [('claims',changed),('grounding',grounded),('entity_decisions',decisions),('packets',list(packets.values()))]:
        (out/(name+'.jsonl')).write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows),encoding='utf-8')
    summary={'diagnostic_sample':len(sample),'sample_seed':20261001,'sampling':'up to 3 per deferral category; diagnostic, not a prevalence or accuracy estimate','deferred_claims':len(changed),'chemical_queries':len(selected),'chemical_results':dict(Counter(c['status'] for c in chemical)),'paid_api_calls':0}
    (out/'summary.json').write_text(json.dumps(summary,indent=2))
    print(json.dumps(summary,indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--offline',action='store_true')
    run(parser.parse_args().offline)
