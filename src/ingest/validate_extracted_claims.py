"""Validate structure, links and evidence anchoring; not a biology review."""
import copy
from jsonschema import Draft202012Validator


def validate_response(response, packet, schema):
    errors = sorted(Draft202012Validator(schema).iter_errors(response), key=lambda e: str(e.path))
    if errors:
        return {'valid_envelope': False, 'errors': ['schema:' + str(list(e.path)) for e in errors], 'accepted': [], 'rejected': [], 'repairs': []}
    if any(response[k] != packet[k] for k in ['request_id', 'source_id']):
        return {'valid_envelope': False, 'errors': ['request/source mismatch'], 'accepted': [], 'rejected': [], 'repairs': []}
    passages = {p['passage_index']: p['text'] for p in packet['passages']}
    annotations = {e['annotation_id'] for e in packet['provider_entities']}
    node_ids = {n['node_id'] for n in packet['suggested_existing_nodes_unverified']}
    accepted, rejected, repairs, seen = [], [], [], set()
    for original in response['claims']:
        c = copy.deepcopy(original)
        issues = []
        if c['local_claim_id'] in seen:
            issues.append('duplicate claim key')
        seen.add(c['local_claim_id'])
        keys = [e['key'] for e in c['entities']]
        if len(keys) != len(set(keys)):
            issues.append('duplicate entity keys')
        for e in c['entities']:
            if not set(e['annotation_ids']) <= annotations:
                issues.append('invented annotation ID')
            if e['existing_node_id'] is not None and e['existing_node_id'] not in node_ids:
                issues.append('invented existing node ID')
        for span in c['evidence']:
            text = passages.get(span['passage_index'])
            quote = span['quote']
            if text is None or not quote:
                issues.append('missing passage/quote')
                continue
            lo, hi = span['start'], span['end']
            if not (0 <= lo < hi <= len(text) and text[lo:hi] == quote):
                # Exact unique matching only; preserve original model offsets in raw response.
                start = text.find(quote)
                if start >= 0 and text.find(quote, start + 1) < 0:
                    repairs.append({'claim': c['local_claim_id'], 'passage_index': span['passage_index'],
                                    'original_offsets': [lo, hi], 'corrected_offsets': [start, start + len(quote)],
                                    'method': 'unique_exact_quote_match'})
                    span.update(start=start, end=start + len(quote))
                else:
                    issues.append('quote not uniquely anchorable')
        r, reaction = c['regulatory'], c['reaction']
        if c['kind'] == 'metabolic_conversion':
            if reaction is None or r is not None:
                issues.append('reaction form mismatch')
            elif any(x not in keys for x in ([reaction['enzyme']] if reaction['enzyme'] else []) +
                     [p['entity'] for p in reaction['substrates'] + reaction['products']]):
                issues.append('unknown reaction participant')
        elif r is None or reaction is not None:
            issues.append('regulatory form mismatch')
        else:
            if any(x not in keys for x in [r['subject'], r['object']] if x is not None):
                issues.append('unknown regulatory participant')
            if (c['kind'] == 'association' or r['direction'] != 'subject_to_object') and r['sign'] != 'unknown':
                issues.append('unsigned relationship has causal sign')
        record = {'claim': c, 'status': 'automated_extraction_unreviewed',
                  'projection_candidate': c['assertion'] in ('observed_result', 'background_statement'),
                  'identity_resolution_required': True, 'canonical_imported': False}
        if issues:
            rejected.append({**record, 'errors': sorted(set(issues))})
        else:
            accepted.append(record)
    return {'valid_envelope': True, 'errors': [], 'accepted': accepted, 'rejected': rejected, 'repairs': repairs}
