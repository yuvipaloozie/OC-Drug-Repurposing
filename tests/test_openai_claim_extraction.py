import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

from src.ingest.validate_extracted_claims import validate_response
from src.ingest.run_openai_claim_extraction import run

ROOT = Path(__file__).resolve().parents[1]


class OpenAIClaimTests(unittest.TestCase):
    def fixture(self):
        schema = json.loads((ROOT / 'schemas/claim_extraction_v1.schema.json').read_text())
        packet = {'request_id': 'request:abc', 'source_id': 'PMID:1', 'split': 'development',
                  'passages': [{'passage_index': 0, 'text': 'X lowered Y.'}],
                  'provider_entities': [], 'suggested_existing_nodes_unverified': []}
        entities = [{'key': k, 'surface': k, 'molecular_form': 'unknown', 'taxon': None,
                     'annotation_ids': [], 'existing_node_id': None, 'mapping_qualification': 'unresolved'} for k in ['X', 'Y']]
        claim = {'local_claim_id': '1', 'kind': 'regulation', 'assertion': 'observed_result', 'summary': 'X lowered Y.',
                 'evidence': [{'passage_index': 0, 'start': 0, 'end': 12, 'quote': 'X lowered Y.'}], 'entities': entities,
                 'regulatory': {'subject': 'X', 'object': 'Y', 'direction': 'subject_to_object', 'sign': 'negative',
                                'effect_level': 'unknown', 'directness': 'unknown', 'interpretation': 'explicit_in_text'},
                 'reaction': None, 'context': {k: None for k in ['species', 'cell_type', 'stage', 'compartment', 'disease_setting']},
                 'experiment': {**{k: None for k in ['intervention', 'endpoint', 'assay', 'dose', 'duration']},
                                'perturbation_type': 'not_stated', 'outcome_change': 'not_stated'}, 'uncertainties': []}
        response = {'request_id': 'request:abc', 'source_id': 'PMID:1', 'claims': [claim], 'no_claim_reason': None}
        return packet, response, schema

    def test_unknown_context_does_not_block_proposed_candidate(self):
        p, r, s = self.fixture()
        result = validate_response(r, p, s)
        self.assertEqual(len(result['accepted']), 1)
        self.assertTrue(result['accepted'][0]['identity_resolution_required'])
        self.assertFalse(result['accepted'][0]['canonical_imported'])

    def test_exact_reanchoring_and_fabricated_quote_rejection(self):
        p, r, s = self.fixture()
        r['claims'][0]['evidence'][0]['start'] = 3
        self.assertEqual(len(validate_response(r, p, s)['repairs']), 1)
        r['claims'][0]['evidence'][0]['quote'] = 'X raised Y.'
        self.assertEqual(len(validate_response(r, p, s)['rejected']), 1)

    def test_unknown_ids_unsigned_sign_and_hypothesis(self):
        p, r, s = self.fixture()
        r['claims'][0]['entities'][0]['annotation_ids'] = ['invented']
        self.assertEqual(len(validate_response(r, p, s)['rejected']), 1)
        r['claims'][0]['entities'][0]['annotation_ids'] = []
        r['claims'][0]['regulatory']['direction'] = 'unknown'
        self.assertEqual(len(validate_response(r, p, s)['rejected']), 1)
        r['claims'][0]['regulatory']['sign'] = 'unknown'
        r['claims'][0]['assertion'] = 'hypothesis'
        self.assertFalse(validate_response(r, p, s)['accepted'][0]['projection_candidate'])

    def test_changed_source_and_reaction_form_rejected(self):
        p, r, s = self.fixture()
        wrong = copy.deepcopy(r)
        wrong['source_id'] = 'PMID:2'
        self.assertFalse(validate_response(wrong, p, s)['valid_envelope'])
        r['claims'][0]['kind'] = 'metabolic_conversion'
        self.assertEqual(len(validate_response(r, p, s)['rejected']), 1)

    def test_budget_blocks_network_and_resume_never_rebills(self):
        p, r, s = self.fixture()
        api = MagicMock()
        api.status_code = 200
        api.json.return_value = {'status': 'completed', 'id': 'fake', 'model': 'fixture',
                                 'usage': {'input_tokens': 100, 'output_tokens': 100},
                                 'output': [{'content': [{'type': 'output_text', 'text': json.dumps(r)}]}]}
        with tempfile.TemporaryDirectory() as d, patch('src.ingest.run_openai_claim_extraction.load_prepared', return_value=([p], 'prompt', s, {'output_hashes': {}})), \
                patch('src.ingest.run_openai_claim_extraction.estimate', return_value={}), \
                patch('src.ingest.run_openai_claim_extraction.load_key', return_value='fixture'), \
                patch('src.ingest.run_openai_claim_extraction.requests.Session') as session:
            session.return_value.post.return_value = api
            run(Path(d), Path(d) / 'blocked', 1, 'all', 0.000001, 8000, True)
            session.return_value.post.assert_not_called()
            run(Path(d), Path(d) / 'allowed', 1, 'all', 1, 8000, True)
            run(Path(d), Path(d) / 'allowed', 1, 'all', 1, 8000, True)
            self.assertEqual(session.return_value.post.call_count, 1)


if __name__ == '__main__':
    unittest.main()
