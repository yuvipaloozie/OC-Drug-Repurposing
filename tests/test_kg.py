"""
Unit tests for Osteoclast Mechanism Knowledge Graph.
Verifies:
1. Schema parsing and loading of all 5 tables.
2. Multigraph path traversal from drug to osteoclast phenotype.
3. Signed path consistency and mechanism scoring.
4. Leakage-safe filtering when evaluating held-out papers and compounds.
"""

import os
import sys
import unittest

# Ensure src is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

from src.kg.graph import OsteoclastKnowledgeGraph


class TestOsteoclastKG(unittest.TestCase):
    def setUp(self):
        self.kg = OsteoclastKnowledgeGraph()
        nodes_path = os.path.join(project_root, "data", "processed", "nodes.csv")
        edges_path = os.path.join(project_root, "data", "processed", "edges.csv")
        experiments_path = os.path.join(project_root, "data", "processed", "experiments.csv")
        evidence_path = os.path.join(project_root, "data", "processed", "edge_evidence.csv")
        contexts_path = os.path.join(project_root, "data", "processed", "contexts.csv")

        self.kg.load_from_csv(
            nodes_path=nodes_path,
            edges_path=edges_path,
            experiments_path=experiments_path,
            evidence_path=evidence_path,
            contexts_path=contexts_path,
        )

    def test_graph_loading(self):
        self.assertGreater(len(self.kg.nodes), 20, "Should load at least 20 seed nodes")
        self.assertGreater(len(self.kg.edges), 25, "Should load at least 25 seed edges")
        self.assertGreater(len(self.kg.experiments), 5, "Should load experimental records")
        self.assertIn("HGNC:PHGDH", self.kg.nodes)
        self.assertIn("PHENO:osteoclast_differentiation", self.kg.nodes)

    def test_serine_synthesis_path(self):
        # CBR5884 -> PHGDH -> alphaKG -> Histone demethylation -> NFATc1 -> Phenotype
        res = self.kg.score_drug_mechanism("CHEMBL:CBR5884", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        self.assertGreater(res["surviving_paths_count"], 0)
        self.assertGreater(res["mechanism_feature"], 0.0)
        # Check path details
        found_nodes = set()
        for p in res["paths"]:
            found_nodes.update(p["nodes"])
        self.assertIn("HGNC:PHGDH", found_nodes)
        self.assertIn("HGNC:NFATC1", found_nodes)

    def test_prmt6_path(self):
        # EPZ020411 -> PRMT6 -> H3R2me2a -> PPARD -> Phenotype
        res = self.kg.score_drug_mechanism("CHEMBL:EPZ020411", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        self.assertGreater(res["surviving_paths_count"], 0)

    def test_glutaminolysis_path(self):
        # CB-839 -> GLS -> Phenotype
        res = self.kg.score_drug_mechanism("CHEMBL:CB839", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        self.assertGreater(res["surviving_paths_count"], 0)

    def test_leakage_safe_filtering(self):
        # Hold out Stegen et al. paper
        held_out_papers = {"PMID:38200114"}
        held_out_compounds = {"CHEMBL:CBR5884"}
        filtered_kg = self.kg.filter_subgraph_by_leakage(held_out_papers, held_out_compounds)

        # Under filtered KG, CBR5884 should have zero paths
        res = filtered_kg.score_drug_mechanism("CHEMBL:CBR5884", desired_phenotype_effect=-1)
        self.assertFalse(res["mechanism_coverage"])
        self.assertEqual(res["surviving_paths_count"], 0)

        # But other paths (e.g. CB839 from Hu et al.) must remain intact!
        res_cb839 = filtered_kg.score_drug_mechanism("CHEMBL:CB839", desired_phenotype_effect=-1)
        self.assertTrue(res_cb839["mechanism_coverage"])


if __name__ == "__main__":
    unittest.main()
