"""
Unit tests for Osteoclast Mechanism Knowledge Graph.
Verifies:
1. Schema parsing and loading of all 5 tables.
2. Multigraph path traversal from drug to osteoclast phenotype.
3. Signed path consistency and mechanism scoring.
4. Leakage-safe filtering when evaluating held-out papers and compounds.
5. Domain-specific pathways: Glycolysis, Actin/Src sealing zone, Syncytium fusion, miRNAs.
"""

import os
import sys
import unittest

# Ensure src is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

from src.kg.graph import OsteoclastKnowledgeGraph
from src.kg.verify_kg import run_verification


class TestOsteoclastKG(unittest.TestCase):
    def setUp(self):
        self.kg = OsteoclastKnowledgeGraph()
        self.data_dir = os.path.join(project_root, "data", "processed")
        nodes_path = os.path.join(self.data_dir, "nodes.csv")
        edges_path = os.path.join(self.data_dir, "edges.csv")
        experiments_path = os.path.join(self.data_dir, "experiments.csv")
        evidence_path = os.path.join(self.data_dir, "edge_evidence.csv")
        contexts_path = os.path.join(self.data_dir, "contexts.csv")

        self.kg.load_from_csv(
            nodes_path=nodes_path,
            edges_path=edges_path,
            experiments_path=experiments_path,
            evidence_path=evidence_path,
            contexts_path=contexts_path,
        )

    def test_schema_verification_suite(self):
        """Runs the strict anti-hallucination and search limits audit."""
        result = run_verification(self.data_dir)
        self.assertEqual(result["status"], "PASS")
        self.assertGreaterEqual(result["total_nodes"], 100)
        self.assertGreaterEqual(result["total_edges"], 80)
        self.assertGreaterEqual(result["total_experiments"], 15)

    def test_serine_synthesis_path(self):
        # CBR5884 -> PHGDH -> alphaKG -> Histone demethylation -> NFATc1 -> Phenotype
        res = self.kg.score_drug_mechanism("CHEMBL:CBR5884", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        self.assertGreater(res["surviving_paths_count"], 0)
        found_nodes = {n for p in res["paths"] for n in p["nodes"]}
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

    def test_calcineurin_inhibition_path(self):
        # FK506 -> Calcineurin (PPP3CA) -> NFATc1 -> Phenotype
        res = self.kg.score_drug_mechanism("CHEMBL:FK506", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        found_nodes = {n for p in res["paths"] for n in p["nodes"]}
        self.assertIn("HGNC:PPP3CA", found_nodes)
        self.assertIn("HGNC:NFATC1", found_nodes)

    def test_src_actin_resorption_path(self):
        # Dasatinib -> Src -> Vav3 -> Rac1 -> Sealing Zone -> Bone Resorption
        res = self.kg.score_drug_mechanism(
            "CHEMBL:DASATINIB",
            desired_phenotype_effect=-1,
            target_phenotype_id="PHENO:bone_resorption",
        )
        self.assertTrue(res["mechanism_coverage"])
        found_nodes = {n for p in res["paths"] for n in p["nodes"]}
        self.assertIn("HGNC:SRC", found_nodes)
        self.assertIn("STRUCT:f_actin_sealing_zone", found_nodes)

    def test_syncytium_formation_connectivity(self):
        # NFATc1 -> DCSTAMP / OCSTAMP / ATP6V0D2 -> Syncytium -> Differentiation
        paths = self.kg.find_mechanism_paths(
            "HGNC:NFATC1", target_phenotype_id="PHENO:osteoclast_differentiation", max_depth=4
        )
        self.assertGreater(len(paths), 0)
        all_nodes = {n for p in paths for n in p["nodes"]}
        self.assertIn("STRUCT:syncytium", all_nodes)

    def test_leakage_safe_filtering(self):
        # Hold out Stegen et al. paper
        held_out_papers = {"PMID:38200114"}
        held_out_compounds = {"CHEMBL:CBR5884"}
        filtered_kg = self.kg.filter_subgraph_by_leakage(held_out_papers, held_out_compounds)

        # Under filtered KG, CBR5884 should have zero paths
        res = filtered_kg.score_drug_mechanism("CHEMBL:CBR5884", desired_phenotype_effect=-1)
        self.assertFalse(res["mechanism_coverage"])
        self.assertEqual(res["surviving_paths_count"], 0)

        # But other paths (e.g. FK506, CB-839) must remain intact
        res_fk506 = filtered_kg.score_drug_mechanism("CHEMBL:FK506", desired_phenotype_effect=-1)
        self.assertTrue(res_fk506["mechanism_coverage"])

    def test_denosumab_neutralization(self):
        # Denosumab -> RANKL -> RANK -> TRAF6 -> NF-kB -> NFATc1 -> Differentiation
        res = self.kg.score_drug_mechanism("CHEMBL:DENOSUMAB", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        found_nodes = {n for p in res["paths"] for n in p["nodes"]}
        self.assertIn("HGNC:TNFSF11", found_nodes)
        self.assertIn("HGNC:TNFRSF11A", found_nodes)
        self.assertIn("HGNC:NFATC1", found_nodes)

    def test_selinexor_xpo1_axis(self):
        # Selinexor -> XPO1 -> NF-kB -> NFATc1 -> Differentiation
        res = self.kg.score_drug_mechanism("CHEMBL:SELINEXOR", desired_phenotype_effect=-1)
        self.assertTrue(res["mechanism_coverage"])
        found_nodes = {n for p in res["paths"] for n in p["nodes"]}
        self.assertIn("HGNC:XPO1", found_nodes)
        self.assertIn("HGNC:NFKB1", found_nodes)

    def test_irf8_blimp1_circuit(self):
        # Verify Blimp1 represses IRF8, which represses NFATc1
        out_edges = self.kg.adj_out.get("HGNC:PRDM1", [])
        irf8_edge = [eid for tgt, eid in out_edges if tgt == "HGNC:IRF8"]
        self.assertTrue(len(irf8_edge) > 0)
        self.assertEqual(self.kg.edges[irf8_edge[0]]["sign"], -1)

        irf8_out = self.kg.adj_out.get("HGNC:IRF8", [])
        nfatc1_edge = [eid for tgt, eid in irf8_out if tgt == "HGNC:NFATC1"]
        self.assertTrue(len(nfatc1_edge) > 0)
        self.assertEqual(self.kg.edges[nfatc1_edge[0]]["sign"], -1)


if __name__ == "__main__":
    unittest.main()
