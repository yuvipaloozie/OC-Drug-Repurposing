"""Cache NCBI gene identities and ground the frozen full extraction, without paid calls."""
import csv
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter
import time
import requests
from src.ingest.ground_development_claims import load_catalog, ground_entity, perturbation_projection

ROOT = Path(__file__).resolve().parents[2]


def main():
    packets = {p['request_id']: p for p in map(json.loads, (ROOT/'data/staging/full_enrichment_prepared_v2/requests.jsonl').read_text(encoding='utf-8').splitlines())}
    ids = sorted({'19229', '14083', '12927'} | {e['identifier'] for p in packets.values() for e in p['provider_entities'] if e['type'] == 'Gene' and e['identifier'].isdigit()})
    directory = ROOT/'data/raw/provenance/full_grounding_v1'
    directory.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(ids), 80):
        batch = ids[start:start+80]
        key = hashlib.sha256(','.join(batch).encode()).hexdigest()[:16]
        path = directory/f'ncbi_gene_{key}.json'
        if path.exists():
            continue
        response = requests.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi', params={'db':'gene','id':','.join(batch),'retmode':'json'}, timeout=60)
        response.raise_for_status()
        body = response.json()
        if 'result' not in body or set(body['result']['uids']) != set(batch):
            raise ValueError('Incomplete registry response')
        path.write_bytes(response.content)
        path.with_suffix('.json.meta.json').write_text(json.dumps({'url':response.url,'retrieved_at':datetime.now(timezone.utc).isoformat(),'sha256':hashlib.sha256(response.content).hexdigest()},indent=2))
        print(f'Cached {min(start+80,len(ids))}/{len(ids)} gene IDs', flush=True)
        time.sleep(0.4)
    catalog = load_catalog(ROOT, directory)
    nodes = list(csv.DictReader((ROOT/'data/processed/nodes.csv').open(encoding='utf-8-sig',newline='')))
    records = list(map(json.loads,(ROOT/'data/staging/full_enrichment_v2/claims.jsonl').read_text(encoding='utf-8').splitlines()))
    output = ROOT/'data/staging/full_grounding_v1'
    output.mkdir(parents=True,exist_ok=True)
    results=[]
    for r in records:
        c=r['claim']
        results.append({'claim_id':r['claim_id'],'source_id':r['source_id'],'grounding':[ground_entity(e,c['context'],packets[r['request_id']],catalog,nodes) for e in c['entities']], 'perturbation_projection':perturbation_projection(c),'canonical_imported':False})
    (output/'grounded_claims.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in results),encoding='utf-8')
    summary={'claims':len(results),'registry_genes':len(catalog),'entity_statuses':dict(Counter(e['status'] for r in results for e in r['grounding'])),'flags':dict(Counter(f for r in results for e in r['grounding'] for f in e['flags'])),'paid_api_calls':0}
    (output/'summary.json').write_text(json.dumps(summary,indent=2))
    print(json.dumps(summary,indent=2))


if __name__=='__main__':
    main()
