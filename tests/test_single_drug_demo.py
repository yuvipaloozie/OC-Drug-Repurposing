import copy
import unittest
from src.kg.graph import OsteoclastKnowledgeGraph
from src.kg.single_drug_demo import map_targets, overlay, DRUG


class SingleDrugDemoTests(unittest.TestCase):
    def test_maps_protein_not_rna_and_does_not_map_fusion_to_abl1(self):
        g = OsteoclastKnowledgeGraph()
        g.nodes = {n: {'node_id': n, 'symbol': s, 'type': t}
                   for n, s, t in [('p', 'SRC', 'protein'), ('r', 'SRC', 'RNA'),
                                   ('a', 'ABL1', 'protein')]}
        rows = map_targets(g)
        self.assertEqual(len(rows), 8)
        self.assertEqual(rows[0]['candidate_node_ids'], [])
        self.assertEqual(rows[1]['candidate_node_ids'], ['p'])

    def test_projection_is_separate_and_not_strict_evidence(self):
        g = OsteoclastKnowledgeGraph()
        g.nodes['p'] = {'node_id': 'p', 'symbol': 'SRC', 'type': 'protein',
                        'identity_status': 'pending'}
        snapshot = copy.deepcopy(g.__dict__)
        out = overlay(g, map_targets(g), {'source_id': 'label'})
        self.assertEqual(g.__dict__, snapshot)
        self.assertNotIn(DRUG, g.nodes)
        eid = out.adj_out[DRUG][0][1]
        self.assertEqual(out.edges[eid]['sign'], -1)
        self.assertEqual(out.assess_edge(eid)['tier'], 'citation_only_candidate')
        self.assertFalse(out.assess_edge(eid, 'strict')['usable'])
        self.assertEqual(out.edge_evidence, [])


if __name__ == '__main__':
    unittest.main()
