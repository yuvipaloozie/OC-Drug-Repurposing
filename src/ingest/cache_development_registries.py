"""Cache registry and primary-source records for the development-only grounding iteration."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import time
import requests

ROOT = Path(__file__).resolve().parents[2]


def cache(name, url, params, offline=False):
    directory = ROOT / 'data/raw/provenance/development_grounding_v1'
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / name
    meta = path.with_suffix(path.suffix + '.meta.json')
    if path.exists():
        metadata = json.loads(meta.read_text())
        if hashlib.sha256(path.read_bytes()).hexdigest() != metadata['sha256']:
            raise ValueError('Cached source checksum mismatch: ' + name)
        return path
    if offline:
        raise FileNotFoundError(name)
    response = requests.get(url, params=params, timeout=60)
    response.raise_for_status()
    path.write_bytes(response.content)
    meta.write_text(json.dumps({'url': response.url, 'retrieved_at': datetime.now(timezone.utc).isoformat(),
                                'sha256': hashlib.sha256(response.content).hexdigest()}, indent=2) + '\n')
    time.sleep(0.4)
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--offline', action='store_true')
    args = parser.parse_args()
    packets = [p for p in map(json.loads, (ROOT / 'data/staging/claim_extraction_pilot_v1/requests.jsonl').read_text(encoding='utf-8').splitlines()) if p['split'] == 'development']
    ids = sorted({'19229', '14083', '12927'} | {e['identifier'] for p in packets for e in p['provider_entities'] if e['type'] == 'Gene' and e['identifier'].isdigit()})
    for offset in range(0, len(ids), 80):
        batch = ids[offset:offset + 80]
        cache('ncbi_gene_' + str(offset // 80) + '.json', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
              {'db': 'gene', 'id': ','.join(batch), 'retmode': 'json'}, args.offline)
    for accession in ['Q9QVP9', 'P34152']:
        cache('uniprot_' + accession + '.json', 'https://rest.uniprot.org/uniprotkb/' + accession + '.json', {}, args.offline)
    cache('pubmed_11102447.xml', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',
          {'db': 'pubmed', 'id': '11102447', 'retmode': 'xml'}, args.offline)
    print('Cached registry candidates for', len(ids), 'development gene IDs; original evidence and held-out packets unchanged.')


if __name__ == '__main__':
    main()
