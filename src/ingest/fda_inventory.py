"""Versioned FDA Orange Book candidate inventory, not an osteoclast test set.

Offline replay is the default. --refresh downloads the official ZIP into a new
content-addressed snapshot. No API key, literature extraction, or KG mutation.
"""
import argparse
import csv
import hashlib
import io
import json
import re
import urllib.request
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
URL='https://www.fda.gov/media/76860/download?attachment='


def sha(data): return hashlib.sha256(data).hexdigest()


def parse_products(data):
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        files=[n for n in z.namelist() if Path(n).name.lower()=='products.txt']
        if len(files)!=1: raise ValueError('Expected one FDA products file')
        rows=list(csv.DictReader(io.StringIO(z.read(files[0]).decode('utf-8-sig')),delimiter='~'))
        timestamp=list(z.getinfo(files[0]).date_time)
    required={'Ingredient','Appl_Type','Appl_No','Product_No','Type','Approval_Date','DF;Route'}
    if not rows or not required.issubset(rows[0]): raise ValueError('Unexpected FDA schema')
    if any(r['Type'].strip() not in {'RX','OTC','DISCN'} for r in rows): raise ValueError('Unknown marketing category')
    return rows,timestamp


def normalize_ingredient(text):
    # No salt stripping, stereochemistry inference, or guessed synonym merging.
    return re.sub(r'\s+',' ',text.strip()).upper()


def make_inventory(rows):
    ingredients=defaultdict(list);links=[];products=[]
    for i,r in enumerate(rows):
        parts=[normalize_ingredient(x) for x in r['Ingredient'].split(';') if x.strip()]
        if not parts: raise ValueError('Empty ingredient record')
        pid='FDA:'+r['Appl_Type']+r['Appl_No'].zfill(6)+':'+r['Product_No'].zfill(3)
        record=pid+':'+sha(json.dumps(r,sort_keys=True).encode())[:12]
        products.append({'record_id':record,'product_id':pid,'source_row':i+2,**r})
        for name in dict.fromkeys(parts):
            iid='FDAING:'+sha(name.encode())[:20]
            ingredients[name].append(r)
            links.append({'ingredient_id':iid,'product_record_id':record,'product_id':pid,'is_combination_product':len(parts)>1,'source_ingredient_string':r['Ingredient']})
    candidates=[]
    for name,records in sorted(ingredients.items()):
        marketed=[r for r in records if r['Type'] in {'RX','OTC'}]
        candidates.append({'ingredient_id':'FDAING:'+sha(name.encode())[:20],'ingredient_name':name,
            'product_records':len(records),'marketed_product_records':len(marketed),
            'marketing_categories':'|'.join(sorted({r['Type'] for r in records})),
            'marketed_single_ingredient_product':any(';' not in r['Ingredient'] for r in marketed),
            'inventory_status':'marketed_product_present' if marketed else 'discontinued_products_only',
            'molecular_identity_status':'unmapped_exact_FDA_name','small_molecule_status':'not_assigned',
            'target_mapping_status':'not_assigned','osteoclast_effect_label':'unknown',
            'dataset_role':'candidate_universe_not_labeled_test_set'})
    return products,candidates,links


def write_csv(path,rows):
    with path.open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)


def run(root=ROOT, refresh=False, source=None):
    folder=root/'data/fda';raw=root/'data/raw/fda';folder.mkdir(exist_ok=True);raw.mkdir(exist_ok=True)
    pointer=folder/'current.json'
    if refresh:
        with urllib.request.urlopen(urllib.request.Request(URL,headers={'User-Agent':'OC-Drug-Repurposing research inventory'}),timeout=60) as response:
            data=response.read();server_date=response.headers.get('Date')
        meta={'url':URL,'retrieved_at':datetime.now(timezone.utc).isoformat(),'http_date':server_date,'sha256':sha(data)}
    elif source:
        source=Path(source);data=source.read_bytes()
        meta=json.loads(Path(str(source)+'.meta.json').read_text(encoding='utf-8'))
        if sha(data)!=meta['sha256']: raise ValueError('Source checksum mismatch')
    else:
        current=json.loads(pointer.read_text(encoding='utf-8'));data=(root/current['raw_file']).read_bytes()
        meta=json.loads((root/current['retrieval_file']).read_text(encoding='utf-8'))
        if sha(data)!=meta['sha256']: raise ValueError('Source checksum mismatch')
    rows,timestamp=parse_products(data)
    snapshot=sha(data)[:16];out=folder/'snapshots'/snapshot;out.mkdir(parents=True,exist_ok=True)
    rawfile=raw/(snapshot+'.zip');rawfile.write_bytes(data)
    metafile=raw/(snapshot+'.retrieval.json');metafile.write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
    products,candidates,links=make_inventory(rows)
    for name,table in [('products',products),('ingredients',candidates),('ingredient_products',links)]:write_csv(out/(name+'.csv'),table)
    summary={'snapshot_id':snapshot,'source':URL,'retrieved_at':meta['retrieved_at'],'source_zip_sha256':sha(data),'products_zip_timestamp':timestamp,
             'product_rows':len(products),'distinct_application_product_ids':len({r['product_id'] for r in products}),
             'product_marketing_categories':dict(Counter(r['Type'] for r in products)),
             'exact_ingredient_names':len(candidates),'ingredients_with_marketed_products':sum(r['marketed_product_records']>0 for r in candidates),
             'marketed_single_ingredient_names':sum(r['marketed_single_ingredient_product'] for r in candidates),
             'compound_structure_mapped':0,'osteoclast_labels_assigned':0,
             'scope':'Orange Book products only; not all biologics, not unique chemical moieties, not a validated osteoclast screening library.',
             'files':{p.name:sha(p.read_bytes()) for p in out.glob('*.csv')}}
    (out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
    pointer.write_text(json.dumps({'snapshot_id':snapshot,'directory':out.relative_to(root).as_posix(),'raw_file':rawfile.relative_to(root).as_posix(),'retrieval_file':metafile.relative_to(root).as_posix()},indent=2)+'\n',encoding='utf-8')
    print(json.dumps(summary,indent=2));return summary


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--refresh',action='store_true');p.add_argument('--source',type=Path);a=p.parse_args();run(refresh=a.refresh,source=a.source)
