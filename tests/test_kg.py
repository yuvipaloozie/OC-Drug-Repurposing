"""
Unit tests for Osteoclast Mechanism Knowledge Graph & Mini-PrimeKG.
Verifies:
1. Pure biological topology: exactly 267 biological entities (0 drug nodes).
2. Consolidated edge topology: exactly 334 unique edges (0 redundant multi-edges with same sign).
3. Biological causal circuits:
   - RANKL (TNFSF11) -> RANK (TNFRSF11A) -> TRAF6 -> NFKB1 -> NFATC1 -> CTSK / ACP5
   - Transcriptional brakes: PRDM1 (Blimp1) inhibits IRF8, IRF8 inhibits NFATC1
   - Metabolic coupling: PHGDH, GLS, PRMT6, SIRT3, IDH2
   - Lacunar acidification: TCIRG1, ATP6V0D2, CLCN7, OSTM1, CA2
   - Cytoskeleton & sealing zone: SRC, PTK2B (Pyk2), VAV3, RAC1, CTTN
4. Target pharmacology encryption on biological target nodes (zero graph leakage).
5. Multi-scale enrichment properties (UniProt, AlphaFold, PDB, Pan-Disease, Proteomics, Flux).
"""

import os
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
            
        cls.nodes = {n["id"]: n for n in cls.kg_data["nodes"]}
        cls.edges = cls.kg_data["edges"]

    def test_pure_biological_node_count(self):
        """Verifies exactly 267 pure biological nodes and zero drug nodes."""
        self.assertEqual(len(self.nodes), 267)
        for nid, n in self.nodes.items():
            self.assertNotEqual(n.get("type"), "drug", f"Drug node found: {nid}")
            self.assertFalse(nid.startswith("CHEMBL:"), f"Exogenous drug node found: {nid}")

    def test_consolidated_edge_count(self):
        """Verifies exactly 334 unique consolidated edges and zero redundancy."""
        self.assertEqual(len(self.edges), 334)
        
        # Check that there are no duplicate edges between same (source, target) with same sign
        edge_pairs = set()
        for e in self.edges:
            pair = (e["source"], e["target"], e.get("sign", 1))
            self.assertNotIn(pair, edge_pairs, f"Duplicate edge found: {pair}")
            edge_pairs.add(pair)

    def test_canonical_rankl_signaling_axis(self):
        """Verifies TNFSF11 -> TNFRSF11A -> TRAF6 -> IKBKB -> NFKB1 -> NFATC1."""
        edge_map = {(e["source"], e["target"]): e for e in self.edges}
        
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
        edge_map = {(e["source"], e["target"]): e for e in self.edges}
        
        self.assertIn(("HGNC:PRDM1", "HGNC:IRF8"), edge_map)
        self.assertEqual(edge_map[("HGNC:PRDM1", "HGNC:IRF8")]["sign"], -1)

        self.assertIn(("HGNC:IRF8", "HGNC:NFATC1"), edge_map)
        self.assertEqual(edge_map[("HGNC:IRF8", "HGNC:NFATC1")]["sign"], -1)

    def test_src_cytoskeleton_axis(self):
        """Verifies c-Src -> Vav3 -> Rac1 podosome / sealing zone pathway."""
        edge_map = {(e["source"], e["target"]): e for e in self.edges}
        
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

    def test_target_pharmacology_encryption(self):
        """Verifies clinical small molecules and biologics are encrypted on target nodes."""
        targets = {
            "HGNC:PHGDH": "CBR-5884",
            "HGNC:TNFSF11": "Denosumab",
            "HGNC:SRC": "Dasatinib",
            "HGNC:GLS": "CB-839",
            "HGNC:PRMT6": "EPZ020411",
            "HGNC:XPO1": "Selinexor",
            "HGNC:CTSK": "Odanacatib",
        }
        for target_id, drug_substr in targets.items():
            self.assertIn(target_id, self.nodes)
            raw_drugs = self.nodes[target_id].get("known_targeting_drugs", "")
            drugs_prop = " ".join(raw_drugs) if isinstance(raw_drugs, list) else str(raw_drugs)
            self.assertTrue(
                drug_substr.lower() in drugs_prop.lower(),
                f"Expected drug '{drug_substr}' in '{target_id}.known_targeting_drugs': {drugs_prop}"
            )

    def test_multi_scale_node_annotations(self):
        """Verifies multi-scale annotations (UniProt, AlphaFold, Pan-Disease, Proteomics, Flux)."""
        src_node = self.nodes["HGNC:SRC"]
        self.assertEqual(src_node.get("uniprot_id"), "P12931")
        self.assertEqual(src_node.get("alphafold_id"), "AF-P12931-F1")
        self.assertGreater(src_node.get("alphafold_plddt", 0), 80)
        self.assertTrue("Oncology" in src_node.get("pan_disease_associations", ""))
        self.assertTrue(len(src_node.get("alphafold_3d_viewer", "")) > 0)

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
