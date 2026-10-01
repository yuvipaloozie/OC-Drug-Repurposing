"""Audit a discovery snapshot and prepare a connectivity-oriented review shortlist."""
import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def publication_flags(row):
    text = (row.get('title', '') + ' ' + row.get('publication_types', '')).lower()
    return [name for name, present in [
        ('retraction_related_check_required', 'retract' in text),
        ('correction_check_required', 'erratum' in text or 'correction' in text),
        ('review_not_primary_experiment', 'review' in text),
        ('preprint_check_required', 'preprint' in text)] if present]

def run(name):
    folder = ROOT / 'data/staging' / name
    summary = json.loads((folder/'summary.json').read_text())
    papers = list(csv.DictReader((folder/'papers.csv').open(encoding='utf-8')))
    candidates = json.loads((folder/'candidates.json').read_text(encoding='utf-8'))
    docs = {d['pmid']: d for d in json.loads((folder/'annotated_documents.json').read_text(encoding='utf-8'))}
    errors = []
    for c in candidates:
        passage = docs[c['pmid']]['passages'][c['passage_index']]
        offset = int(passage.get('offset', 0))
        if passage['text'][c['start']-offset:c['end']-offset] != c['passage_text']:
            errors.append(c['candidate_id'])
    calls = json.loads((folder/'api_calls.json').read_text())
    hashes = {r['raw_file']: r['sha256'] for r in calls}
    bad_hashes = [p for p, h in hashes.items() if hashlib.sha256((ROOT/p).read_bytes()).hexdigest() != h]
    flags = {r['pmid']: publication_flags(r) for r in papers}
    counts = Counter(c['pmid'] for c in candidates)
    shortlist = []
    anchors = {'15711558': 'VAV3 bridge: inspect direct perturbation and downstream signaling',
               '19855158': 'Dasatinib positive-control outcome; hold out from prediction evaluation',
               '38964754': 'ACOD1/itaconate/glycolysis metabolic bridge',
               '39271775': 'Glutamine/nucleotide/amino-acid metabolic bridge',
               '24144981': 'SRC/cortactin/podosome branch; check related publication notices',
               '27064822': 'Cofilin/cortactin/resorption endpoint bridge',
               '38200114': 'Existing PHGDH positive control',
               '40500265': 'Itaconate/TET2/chromatin bridge'}
    for p in papers:
        shortlist.append({'pmid': p['pmid'], 'title': p['title'], 'url': p['url'],
            'query_families': p['query_families'], 'annotation_status': p['annotation_status'],
            'candidate_passages': counts[p['pmid']], 'publication_flags': '|'.join(flags[p['pmid']]),
            'review_priority_reason': anchors.get(p['pmid'], 'Broader discovery; relevance and mechanism not yet reviewed')})
    shortlist.sort(key=lambda r: (r['pmid'] not in anchors, bool(r['publication_flags']), -r['candidate_passages'], r['pmid']))
    with (folder/'curation_shortlist.csv').open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(shortlist[0]));writer.writeheader();writer.writerows(shortlist)
    audit = {'candidate_spans_checked': len(candidates), 'span_failures': errors,
             'raw_snapshots_checked': len(hashes), 'checksum_failures': bad_hashes,
             'publication_flag_counts': dict(Counter(f for values in flags.values() for f in values)),
             'unique_candidate_pmids': len(counts), 'curated_claims_added': 0,
             'limitations': ['Publication flags rely on returned titles/types, not a comprehensive retraction registry.',
                            'Lexical node matches do not resolve species or gene/RNA/protein identity.',
                            'Abstract sentence splitting is approximate and can split abbreviations; inspect surrounding BioC passage.',
                            'Provider ordering and query caps create selection bias; this is not a systematic or random sample.']}
    (folder/'quality_audit.json').write_text(json.dumps(audit, indent=2)+'\n')
    if errors or bad_hashes:
        raise ValueError(audit)
    print(json.dumps(audit, indent=2))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('run_name', choices=['connectivity_1000', 'connectivity_2500'])
    run(parser.parse_args().run_name)
