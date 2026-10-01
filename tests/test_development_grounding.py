import copy
import json
import tempfile
import unittest
from pathlib import Path

from src.ingest.ground_development_claims import ground_entity, perturbation_projection, taxon
from src.kg.integrate_pyk2_pilot import apply_patch_file, TABLES
from src.kg.graph import OsteoclastKnowledgeGraph

ROOT = Path(__file__).resolve().parents[1]


class DevelopmentGroundingTests(unittest.TestCase):
    def fixture(self):
        entity = {'key': 'x', 'surface': 'PYK2', 'molecular_form': 'protein', 'taxon': 'mouse',
                  'annotation_ids': ['a'], 'existing_node_id': 'FAK'}
        packet = {'provider_entities': [{'annotation_id': 'a', 'type': 'Gene', 'identifier': '14083'}]}
        catalog = {'19229': {'gene_id': '19229', 'symbol': 'Ptk2b', 'taxon': '10090', 'aliases': ['pyk2', 'ptk2b']},
                   '14083': {'gene_id': '14083', 'symbol': 'Ptk2', 'taxon': '10090', 'aliases': ['fak', 'ptk2']}}
        nodes = [{'node_id': 'PYK2', 'type': 'protein', 'taxon': 'mouse', 'symbol': 'PTK2B'},
                 {'node_id': 'FAK', 'type': 'protein', 'taxon': 'mouse', 'symbol': 'PTK2'}]
        return entity, packet, catalog, nodes

    def test_alias_check_catches_wrong_provider_gene_and_model_node(self):
        e, p, c, n = self.fixture()
        result = ground_entity(e, {}, p, c, n)
        self.assertEqual(result['canonical_candidates'], ['PYK2'])
        self.assertIn('provider_identifier_not_supported_by_exact_registry_alias_and_taxon', result['flags'])
        self.assertIn('model_node_hint_not_confirmed', result['flags'])

    def test_gene_not_merged_into_protein_and_unknown_taxon_not_invented(self):
        e, p, c, n = self.fixture()
        e['molecular_form'] = 'gene'
        result = ground_entity(e, {}, p, c, n)
        self.assertEqual(result['canonical_candidates'], [])
        self.assertIn('molecular_form_conflict_with_model_node_hint', result['flags'])
        e.update(molecular_form='protein', taxon='null')
        self.assertEqual(ground_entity(e, {}, p, c, n)['canonical_candidates'], [])
        self.assertIsNone(taxon('null'))
        self.assertEqual(taxon('Murine'), '10090')

    def test_perturbation_sign_is_not_the_normal_protein_sign(self):
        entity, _, _, _ = self.fixture()
        claim = {'entities': [entity], 'kind': 'perturbation_effect', 'assertion': 'observed_result',
                 'regulatory': {'subject': 'x', 'sign': 'negative'},
                 'experiment': {'intervention': 'PYK2 antisense', 'perturbation_type': 'loss_of_function', 'outcome_change': 'decreased'}}
        before = copy.deepcopy(claim)
        result = perturbation_projection(claim)
        self.assertEqual(result['normal_role_sign_candidate'], 1)
        self.assertTrue(result['model_sign_disagrees'])
        self.assertEqual(before, claim)
        claim['experiment']['outcome_change'] = 'increased'
        self.assertEqual(perturbation_projection(claim)['normal_role_sign_candidate'], -1)
        claim['entities'][0]['molecular_form'] = 'compound'
        self.assertIsNone(perturbation_projection(claim)['normal_role_sign_candidate'])

    def test_patch_roundtrip_idempotence_and_stale_dataset_protection(self):
        path = ROOT / 'data/staging/pyk2_integration_v1/patch.json'
        patch = json.loads(path.read_text())
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            data = root / 'data/processed'
            data.mkdir(parents=True)
            for table in TABLES:
                (data / (table + '.csv')).write_bytes(patch['before'][table].encode())
            self.assertEqual(apply_patch_file(path, root), 'applied')
            self.assertEqual(apply_patch_file(path, root), 'already_applied')
            self.assertEqual(apply_patch_file(path, root, rollback=True), 'rolled_back')
            for table in TABLES:
                self.assertEqual((data / (table + '.csv')).read_bytes(), patch['before'][table].encode())
            (data / 'nodes.csv').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'Dataset changed'):
                apply_patch_file(path, root)

    def test_proposed_path_retains_genetic_to_drug_transfer_warning(self):
        graph = OsteoclastKnowledgeGraph()
        data = ROOT / 'data/processed'
        graph.load_from_csv(*(str(data / (name + '.csv')) for name in ['nodes', 'edges', 'experiments', 'edge_evidence', 'contexts']))
        edge = 'edge:duong2001_ptk2b_resorption'
        assessment = graph.assess_edge(edge)
        self.assertTrue(assessment['usable'])
        self.assertEqual(assessment['tier'], 'extracted_candidate')
        self.assertIn('genetic_perturbation_not_equivalent_to_drug_inhibition', assessment['warnings'])
        self.assertFalse(graph.evidence_eligible(edge))
        paths = graph.find_mechanism_paths('LOCAL:protein:mouse:PTK2B', 'PATHWAY:BONE_RESORPTION', max_depth=1)
        self.assertTrue(any(p['net_sign'] == 1 and edge in p['edges'] and
                            'genetic_perturbation_not_equivalent_to_drug_inhibition' in p['warnings'] for p in paths))


if __name__ == '__main__':
    unittest.main()
