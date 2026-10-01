"""Prepare/apply/rollback a bounded, source-backed PYK2 integration patch.

The projection is an explicit AI-assisted decision, not unattended bulk import.
New evidence stays proposed/unreviewed. Canonical before/after bytes are retained.
"""
import argparse
import copy
import csv
import hashlib
import io
import json
from pathlib import Path
import tempfile
import xml.etree.ElementTree as ET

from src.kg.validate_schema import run_verification
from src.ingest.ground_development_claims import load_catalog

ROOT = Path(__file__).resolve().parents[2]
TABLES = ['nodes', 'edges', 'contexts', 'experiments', 'edge_evidence', 'source_records']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def csv_text(rows, fields):
    output = io.StringIO(newline='')
    writer = csv.DictWriter(output, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    writer.writerows({k: r.get(k, '') for k in fields} for r in rows)
    return output.getvalue()


def checked_file(path):
    metadata = json.loads(path.with_suffix(path.suffix + '.meta.json').read_text())
    if sha(path.read_bytes()) != metadata['sha256']:
        raise ValueError('Source checksum mismatch: ' + str(path))
    return metadata


def prepare(root=ROOT):
    target = root / 'data/staging/pyk2_integration_v1/patch.json'
    if target.exists():
        return target  # Immutable patch; apply verifies the exact dataset state.
    registry = root / 'data/raw/provenance/development_grounding_v1'
    publication = registry / 'pubmed_11102447.xml'
    metadata = checked_file(publication)
    paper = ET.parse(publication)
    if paper.findtext('.//MedlineCitation/PMID') != '11102447':
        raise ValueError('Unexpected publication')
    abstract = ' '.join(''.join(t.itertext()) for t in paper.findall('.//AbstractText'))
    packet = next(p for p in map(json.loads, (root / 'data/staging/claim_extraction_pilot_v1/requests.jsonl').read_text(encoding='utf-8').splitlines()) if p['pmid'] == '11102447')
    if packet['split'] != 'development' or packet['passages'][1]['text'] != abstract:
        raise ValueError('Development scope or primary/PubTator passage mismatch')
    before, tables, fields = {}, {}, {}
    for table in TABLES:
        data = (root / 'data/processed' / (table + '.csv')).read_bytes()
        before[table] = data.decode('utf-8')
        reader = csv.DictReader(io.StringIO(before[table]))
        tables[table], fields[table] = list(reader), reader.fieldnames
    catalog = load_catalog(root)
    mapping_decisions = []
    for symbol, gene_id, accession in [('PTK2B', '19229', 'Q9QVP9'), ('PTK2', '14083', 'P34152')]:
        path = registry / ('uniprot_' + accession + '.json')
        source_meta = checked_file(path)
        protein = json.loads(path.read_text())
        if protein['organism']['taxonId'] != 10090 or not any(g.get('geneName', {}).get('value', '').upper() == symbol for g in protein['genes']):
            raise ValueError('UniProt species/symbol mismatch')
        if not any(x['database'] == 'GeneID' and x['id'] == gene_id for x in protein['uniProtKBCrossReferences']):
            raise ValueError('UniProt/NCBI cross-reference mismatch')
        if catalog[gene_id]['symbol'].upper() != symbol or catalog[gene_id]['taxon'] != '10090':
            raise ValueError('NCBI species/symbol mismatch')
        node_id = 'LOCAL:protein:mouse:' + symbol
        node = next(n for n in tables['nodes'] if n['node_id'] == node_id)
        old = copy.deepcopy(node)
        candidates = json.loads(node['structure_candidates'])
        candidates.update(uniprot_id=accession, uniprot_identity_status='registry_verified_mouse_protein',
                          registry_gene_id='NCBIGene:' + gene_id,
                          registry_identity_source=str(path.relative_to(root)).replace('\\', '/'),
                          registry_identity_sha256=source_meta['sha256'])
        candidates['pdb_structures'] = [p for p in candidates.get('pdb_structures', []) if len(p) == 4 and p[0].isdigit() and p.isalnum()]
        node.update(identity_status='registry_mapped_gene_and_protein', structure_candidates=json.dumps(candidates, sort_keys=True))
        mapping_decisions.append({'node_id': node_id, 'gene_id': gene_id, 'uniprot_id': accession,
                                  'before': old, 'after': copy.deepcopy(node), 'scope': 'identity only; no biological claim or 3D experimental validation'})
    for field in ['causal_basis', 'effect_level']:
        if field not in fields['edges']:
            fields['edges'].append(field)
    context_id = 'ctx:duong2001_murine_osteoclast_coculture'
    tables['contexts'].append({'context_id': context_id, 'species': 'mouse',
        'cell_type': 'osteoclast-like cells or their mononuclear precursors', 'stage': '', 'compartment': '',
        'disease_setting': '', 'verification_status': 'pending_source_review',
        'note': 'Murine bone marrow/osteoblast co-culture stated in abstract; not automatically relabeled RAW264.7 or purified BMM.'})
    tables['source_records'].append({'source_id': 'PMID:11102447', 'title': paper.findtext('.//ArticleTitle'),
        'doi': next((x.text for x in paper.findall('.//ArticleId') if x.attrib.get('IdType') == 'doi'), ''),
        'pmid': '11102447', 'pmcid': '', 'publication_types': '|'.join(x.text or '' for x in paper.findall('.//PublicationType')),
        'resolution_status': 'resolved', 'claim_match_status': 'relevant_paper_claim_pending',
        'url': 'https://pubmed.ncbi.nlm.nih.gov/11102447/', 'retrieved_at': metadata['retrieved_at'],
        'raw_file': str(publication.relative_to(root)).replace('\\', '/'), 'raw_sha256': metadata['sha256']})
    start = abstract.index('Murine osteoclast-like cells')
    end = abstract.index(' Taken together,')
    quote = abstract[start:end]
    decision_note = ('AI-assisted primary-abstract projection: antisense depletion reduced PYK2 protein and the measured endpoint. '
                     'Positive sign represents inferred normal-protein support, not direct activation. '
                     'Protein depletion is not established to equal catalytic drug inhibition; pharmacological transfer remains unverified. '
                     'See data/staging/pyk2_integration_v1/patch.json. No dose, duration, assay or viability result inferred.')
    edge_ids = []
    for short, endpoint, phrase, origin in [
        ('resorption', 'PATHWAY:BONE_RESORPTION', 'inhibition of bone resorption in vitro', 'extracted:063108912d1b31fc70804253'),
        ('actin_ring', 'PATHWAY:F_ACTIN_SEALING_ZONE', 'inhibition of cell spreading and of actin ring formation', 'AI-assisted exact-passage extension; not a model-extracted claim')]:
        if phrase not in quote:
            raise ValueError('Expected endpoint observation absent from primary abstract')
        edge_id = 'edge:duong2001_ptk2b_' + short
        exp_id = 'exp:duong2001_' + short
        edge_ids.append(edge_id)
        tables['edges'].append({'edge_id': edge_id, 'source_id': 'LOCAL:protein:mouse:PTK2B', 'relation': 'REGULATES',
            'target_id': endpoint, 'sign': '1', 'context_id': context_id, 'source_db': 'pubmed',
            'source_record_id': 'PMID:11102447', 'status': 'proposed', 'context_status': 'pending',
            'legacy_source_record_id': '', 'review_note': decision_note,
            'causal_basis': 'genetic_perturbation_role_inference', 'effect_level': 'phenotype'})
        tables['experiments'].append({'experiment_id': exp_id, 'paper_id': 'PMID:11102447', 'model_system': 'in_vitro',
            'species': 'mouse', 'cell_type': 'osteoclast-like cells or their mononuclear precursors', 'differentiation_stage': '',
            'treatment': 'PYK2 antisense adenovirus; uninfected and sense-PYK2 controls', 'dose': '', 'duration': '',
            'endpoint': 'bone resorption' if short == 'resorption' else 'actin ring formation',
            'assay': '', 'measured_effect': phrase, 'viability': 'not reported', 'figure_or_table': '',
            'verification_status': 'pending_passage_review', 'review_note': 'Endpoint-specific record from one paper, not an independent replication. ' + decision_note,
            'legacy_record_path': ''})
        tables['edge_evidence'].append({'evidence_id': 'ev:duong2001_ptk2b_' + short, 'edge_id': edge_id,
            'experiment_id': exp_id, 'source_id': 'PMID:11102447', 'quote_or_location': quote,
            'claim_summary': 'PYK2/PTK2B protein depletion reduced ' + ('bone resorption' if short == 'resorption' else 'actin ring formation') + ' in murine osteoclast cultures.',
            'passage_status': 'source_checked_quote',
            'source_location': f'PubMed XML AbstractText characters [{start},{end}); originating claim: {origin}',
            'source_url': 'https://pubmed.ncbi.nlm.nih.gov/11102447/', 'source_sha256': metadata['sha256'],
            'evidence_kind': 'perturbation', 'polarity': 'support', 'curator_status': 'automated_extraction',
            'reviewed_at': '', 'review_note': decision_note, 'legacy_experiment_id': '', 'legacy_source_records': ''})
    after = {table: csv_text(tables[table], fields[table]) for table in TABLES}
    with tempfile.TemporaryDirectory() as tmp:
        for table, text in after.items():
            (Path(tmp) / (table + '.csv')).write_bytes(text.encode())
        verification = run_verification(tmp)
        if verification['errors']:
            raise ValueError(verification['errors'])
    patch = {'patch_id': 'pyk2_pilot_v1', 'scope': 'development only; proposed qualitative protein-depletion role claims',
             'source_sha256': metadata['sha256'], 'identity_decisions': mapping_decisions, 'new_edge_ids': edge_ids,
             'before': before, 'after': after,
             'before_sha256': {k: sha(v.encode()) for k, v in before.items()},
             'after_sha256': {k: sha(v.encode()) for k, v in after.items()}}
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(patch, indent=2) + '\n', encoding='utf-8')
    return target


def apply_patch_file(path, root=ROOT, rollback=False):
    patch = json.loads(path.read_text(encoding='utf-8'))
    expected, desired = ('after', 'before') if rollback else ('before', 'after')
    data = root / 'data/processed'
    current = {t: (data / (t + '.csv')).read_bytes() for t in TABLES}
    if all(sha(current[t]) == patch[desired + '_sha256'][t] for t in TABLES):
        return 'already_applied' if not rollback else 'already_rolled_back'
    if any(sha(current[t]) != patch[expected + '_sha256'][t] for t in TABLES):
        raise ValueError('Dataset changed since patch preparation; refusing overwrite')
    for t in TABLES:
        if sha(patch[desired][t].encode()) != patch[desired + '_sha256'][t]:
            raise ValueError('Patch content hash mismatch')
    try:
        for t in TABLES:
            temporary = data / (t + '.csv.patch-tmp')
            temporary.write_bytes(patch[desired][t].encode())
            temporary.replace(data / (t + '.csv'))
        verification = run_verification(data)
        if verification['errors']:
            raise ValueError(verification['errors'])
    except Exception:
        for t, content in current.items():
            (data / (t + '.csv')).write_bytes(content)
        raise
    return 'rolled_back' if rollback else 'applied'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--apply', action='store_true')
    group.add_argument('--rollback', action='store_true')
    args = parser.parse_args()
    path = prepare()
    if args.apply or args.rollback:
        print(apply_patch_file(path, rollback=args.rollback))
        from src.kg.rebuild import rebuild
        rebuild(ROOT)
    else:
        print('Prepared and validated:', path)


if __name__ == '__main__':
    main()
