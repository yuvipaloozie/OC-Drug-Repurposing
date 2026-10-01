"""Development-only identity cross-checks and perturbation-sign projection candidates.

Registry existence is not specimen identity or biological validation. Outputs are
sidecars; no canonical claims are automatically imported by this module.
"""
from collections import Counter
import csv
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]


def normalize(value):
    return re.sub(r'[^a-z0-9]', '', str(value or '').casefold())


def taxon(value):
    value = normalize(value)
    return {'mouse': '10090', 'mice': '10090', 'murine': '10090', 'musmusculus': '10090', '10090': '10090',
            'human': '9606', 'humans': '9606', 'homosapiens': '9606', '9606': '9606',
            'rat': '10116', 'rats': '10116', 'rattusnorvegicus': '10116', '10116': '10116'}.get(value)


def load_catalog(root=ROOT, directory=None):
    directory = directory or root / 'data/raw/provenance/development_grounding_v1'
    catalog = {}
    for file in sorted(directory.glob('ncbi_gene_*.json')):
        if file.name.endswith('.meta.json'):
            continue
        metadata = json.loads(file.with_suffix('.json.meta.json').read_text())
        if hashlib.sha256(file.read_bytes()).hexdigest() != metadata['sha256']:
            raise ValueError('Registry checksum mismatch')
        results = json.loads(file.read_text())['result']
        for key in results['uids']:
            record = results[key]
            if 'error' in record or not record.get('name'):
                continue
            names = [record['name'], record.get('description', '')] + record.get('otheraliases', '').split(',') + record.get('otherdesignations', '').split('|')
            catalog[key] = {'gene_id': key, 'symbol': record['name'], 'taxon': str(record['organism']['taxid']),
                            'aliases': sorted({normalize(n) for n in names if normalize(n)}),
                            'raw_file': str(file.relative_to(root)).replace('\\', '/'), 'source_sha256': metadata['sha256']}
    return catalog


def ground_entity(entity, context, packet, catalog, nodes):
    form = entity['molecular_form']
    specimen_taxon = taxon(entity.get('taxon')) or taxon(context.get('species'))
    name = normalize(entity['surface'])
    annotation_ids = set(entity['annotation_ids'])
    provider_ids = sorted({e['identifier'] for e in packet['provider_entities'] if e['annotation_id'] in annotation_ids and e['type'] == 'Gene'})
    flags = []
    if form not in ('gene', 'protein', 'RNA'):
        return {'entity_key': entity['key'], 'status': 'requires_non_gene_grounding', 'molecular_form': form,
                'canonical_candidates': [], 'registry_candidates': [], 'flags': []}
    matches = [r for r in catalog.values() if name in r['aliases'] and (specimen_taxon is None or r['taxon'] == specimen_taxon)]
    if provider_ids and not set(provider_ids) & {r['gene_id'] for r in matches}:
        flags.append('provider_identifier_not_supported_by_exact_registry_alias_and_taxon')
    if specimen_taxon is None:
        flags.append('specimen_taxon_unresolved_do_not_assign_from_provider_gene')
    if len(matches) != 1:
        flags.append('registry_alias_unresolved' if not matches else 'registry_alias_ambiguous')
    canonical = []
    if len(matches) == 1 and specimen_taxon:
        r = matches[0]
        canonical = [n['node_id'] for n in nodes if n['type'] == form.lower() and
                     taxon(n['taxon']) == specimen_taxon and normalize(n.get('symbol')) == normalize(r['symbol'])]
    proposed = entity.get('existing_node_id')
    if proposed:
        n = next((n for n in nodes if n['node_id'] == proposed), None)
        if n and n['type'] != form.lower():
            flags.append('molecular_form_conflict_with_model_node_hint')
        if proposed not in canonical:
            flags.append('model_node_hint_not_confirmed')
    if form == 'protein':
        flags.append('gene_locus_crosswalk_only_protein_accession_requires_separate_check')
    return {'entity_key': entity['key'], 'surface': entity['surface'], 'molecular_form': form,
            'specimen_taxon_candidate': specimen_taxon, 'provider_gene_ids': provider_ids,
            'registry_candidates': matches, 'canonical_candidates': canonical,
            'status': 'registry_alias_candidate' if len(matches) == 1 else 'unresolved', 'flags': flags}


def perturbation_projection(claim):
    regulation = claim.get('regulatory')
    experiment = claim['experiment']
    result = {'model_sign': regulation.get('sign') if regulation else None, 'normal_role_sign_candidate': None,
              'projection_review_required': True, 'reason': 'not_a_resolved_genetic_perturbation'}
    if not regulation or claim['assertion'] != 'observed_result' or claim['kind'] != 'perturbation_effect':
        return result
    subject = next((e for e in claim['entities'] if e['key'] == regulation['subject']), None)
    if not subject or subject['molecular_form'] not in ('gene', 'protein', 'RNA'):
        return result
    name, intervention = normalize(subject['surface']), normalize(experiment.get('intervention'))
    if not name or name not in intervention:
        result['reason'] = 'intervention_target_not_explicitly_matched'
        return result
    perturbation = {'loss_of_function': -1, 'gain_of_function': 1}.get(experiment['perturbation_type'])
    outcome = {'decreased': -1, 'increased': 1}.get(experiment['outcome_change'])
    if perturbation is None or outcome is None:
        result['reason'] = 'perturbation_or_outcome_direction_unresolved'
        return result
    sign = perturbation * outcome
    result.update(normal_role_sign_candidate=sign, perturbation_direction=perturbation, observed_outcome_direction=outcome,
                  reason='qualified_role_inference_from_reported_perturbation_not_direct_activation',
                  model_sign_disagrees=regulation['sign'] != ('positive' if sign == 1 else 'negative'))
    return result


def main():
    claims_file = ROOT / 'data/staging/openai_claim_pilot_parallel_v1/claims.jsonl'
    records = [r for r in map(json.loads, claims_file.read_text(encoding='utf-8').splitlines()) if r['split'] == 'development']
    packets = {p['request_id']: p for p in map(json.loads, (ROOT / 'data/staging/claim_extraction_pilot_v1/requests.jsonl').read_text(encoding='utf-8').splitlines()) if p['split'] == 'development'}
    with (ROOT / 'data/processed/nodes.csv').open(encoding='utf-8-sig', newline='') as handle:
        nodes = list(csv.DictReader(handle))
    catalog = load_catalog()
    results = []
    for record in records:
        claim = record['claim']
        results.append({'claim_id': record['claim_id'], 'source_id': record['source_id'], 'split': 'development',
                        'grounding': [ground_entity(e, claim['context'], packets[record['request_id']], catalog, nodes) for e in claim['entities']],
                        'perturbation_projection': perturbation_projection(claim), 'canonical_imported': False})
    output = ROOT / 'data/staging/development_grounding_v1'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'grounded_claims.jsonl').write_text(''.join(json.dumps(r, sort_keys=True, ensure_ascii=False) + '\n' for r in results), encoding='utf-8')
    summary = {'development_claims': len(results), 'held_out_claims_processed': 0,
               'registry_gene_records': len(catalog),
               'entity_statuses': dict(Counter(e['status'] for r in results for e in r['grounding'])),
               'entity_flags': dict(Counter(f for r in results for e in r['grounding'] for f in e['flags'])),
               'qualified_perturbation_sign_candidates': sum(r['perturbation_projection']['normal_role_sign_candidate'] is not None for r in results),
               'model_sign_disagreements': sum(r['perturbation_projection'].get('model_sign_disagrees', False) for r in results),
               'canonical_mutations': 0, 'paid_api_calls': 0}
    (output / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
