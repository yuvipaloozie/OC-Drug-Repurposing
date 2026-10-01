"""Topology regression checks for the legacy claim inventory, not evidence validation."""
import os
import csv
import sys
import json
import unittest
from pathlib import Path

# Ensure src is on path
current_dir = Path(__file__).resolve().parent
project_root = current_dir.parent
sys.path.insert(0, str(project_root))

from src.kg.graph import OsteoclastKnowledgeGraph


class TestOsteoclastKG(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data_dir = project_root / "data" / "processed"
        cls.json_path = cls.data_dir / "osteoclast_knowledge_graph.json"

        with open(cls.json_path, "r", encoding="utf-8") as f:
            cls.kg_data = json.load(f)

        cls.nodes = {old: n for n in cls.kg_data["nodes"] for old in [n["id"], *n.get("legacy_ids", [])]}
        reverse = {n["id"]: n["legacy_ids"][0] if n.get("legacy_ids") else n["id"] for n in cls.kg_data["nodes"]}
        cls.edges = [{**e, "source": reverse[e["source"]], "target": reverse[e["target"]]} for e in cls.kg_data["edges"]]

    def test_pure_biological_node_count(self):
        """Verifies exported entity IDs match canonical tables and no drug nodes are introduced."""
        with (self.data_dir / "nodes.csv").open(encoding="utf-8") as handle:
            canonical = {r["node_id"] for r in csv.DictReader(handle)}
        self.assertEqual({n["id"] for n in self.kg_data["nodes"]}, canonical)
        self.assertGreaterEqual(len(canonical), 267)
        for nid, n in self.nodes.items():
            self.assertNotEqual(n.get("type"), "drug", f"Drug node found: {nid}")
            self.assertFalse(nid.startswith("CHEMBL:"), f"Exogenous drug node found: {nid}")

    def test_consolidated_edge_count(self):
        """Verifies canonical claim IDs survive export without duplicate context-specific relationships."""
        with (self.data_dir / "edges.csv").open(encoding="utf-8") as handle:
            canonical = {r["edge_id"] for r in csv.DictReader(handle)}
        self.assertEqual({e["edge_id"] for e in self.edges}, canonical)
        self.assertGreaterEqual(len(canonical), 338)

        # Check that there are no duplicate edges between same (source, target) with same sign
        edge_pairs = set()
        for e in self.edges:
            pair = (e["source"], e["target"], e["relation"], e.get("sign", 1), e.get("context_id"))
            self.assertNotIn(pair, edge_pairs, f"Duplicate edge found: {pair}")
            edge_pairs.add(pair)

    def test_canonical_rankl_signaling_axis(self):
        """Verifies TNFSF11 -> TNFRSF11A -> TRAF6 -> IKBKB -> NFKB1 -> NFATC1."""
        edge_map = {(e["source"], e["target"]): e for e in self.edges if not e["edge_id"].startswith("edge:full:")}

        self.assertIn(("HGNC:TNFSF11", "HGNC:TNFRSF11A"), edge_map)
        self.assertEqual(edge_map[("HGNC:TNFSF11", "HGNC:TNFRSF11A")]["sign"], 1)

        self.assertIn(("HGNC:TNFRSF11A", "HGNC:TRAF6"), edge_map)
        self.assertEqual(edge_map[("HGNC:TNFRSF11A", "HGNC:TRAF6")]["sign"], 1)

        self.assertIn(("HGNC:TRAF6", "HGNC:IKBKB"), edge_map)
        self.assertEqual(edge_map[("HGNC:TRAF6", "HGNC:IKBKB")]["sign"], 1)

        self.assertIn(("HGNC:IKBKB", "HGNC:NFKB1"), edge_map)
        self.assertEqual(edge_map[("HGNC:IKBKB", "HGNC:NFKB1")]["sign"], 1)

        self.assertIn(("HGNC:NFKB1", "HGNC:NFATC1"), edge_map)
        self.assertEqual(edge_map[("HGNC:NFKB1", "HGNC:NFATC1")]["sign"], 1)

    def test_irf8_blimp1_transcriptional_brake(self):
        """Verifies Blimp1 (PRDM1) -| IRF8 -| NFATc1 (double negative sign)."""
        edge_map = {(e["source"], e["target"]): e for e in self.edges if not e["edge_id"].startswith("edge:full:")}

        self.assertIn(("HGNC:PRDM1", "HGNC:IRF8"), edge_map)
        self.assertEqual(edge_map[("HGNC:PRDM1", "HGNC:IRF8")]["sign"], -1)

        self.assertIn(("HGNC:IRF8", "HGNC:NFATC1"), edge_map)
        self.assertEqual(edge_map[("HGNC:IRF8", "HGNC:NFATC1")]["sign"], -1)

    def test_src_cytoskeleton_axis(self):
        """Verifies c-Src -> Vav3 -> Rac1 podosome / sealing zone pathway."""
        edge_map = {(e["source"], e["target"]): e for e in self.edges if not e["edge_id"].startswith("edge:full:")}

        self.assertIn(("HGNC:SRC", "HGNC:VAV3"), edge_map)
        self.assertEqual(edge_map[("HGNC:SRC", "HGNC:VAV3")]["sign"], 1)

        self.assertIn(("HGNC:VAV3", "HGNC:RAC1"), edge_map)
        self.assertEqual(edge_map[("HGNC:VAV3", "HGNC:RAC1")]["sign"], 1)

    def test_lacunar_acidification_machinery(self):
        """Verifies V-ATPase complex, carbonic anhydrase II, and CTSK."""
        for required_gene in ["HGNC:TCIRG1", "HGNC:CA2", "HGNC:CTSK", "HGNC:CLCN7"]:
            self.assertIn(required_gene, self.nodes)
            node = self.nodes[required_gene]
            self.assertEqual(node.get("physiological_pillar"), "activity_acidification")
        self.assertIn("HGNC:ATP6V0D2", self.nodes)

    def test_9_physiological_pillars_coverage(self):
        """Verifies all 9 physiological pillars are populated."""
        pillar_counts = {}
        for n in self.nodes.values():
            p = n.get("physiological_pillar", "unknown")
            pillar_counts[p] = pillar_counts.get(p, 0) + 1

        expected_pillars = [
            "differentiation", "metabolism", "activity_acidification",
            "morphology_cytoskeleton", "inflammation", "immunomodulation",
            "maturation_fusion", "interactions_with_other_processes", "hormonal_influence"
        ]
        for p in expected_pillars:
            self.assertIn(p, pillar_counts)
            self.assertGreater(pillar_counts[p], 0, f"Pillar '{p}' is empty")


if __name__ == "__main__":
    unittest.main()
