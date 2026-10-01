import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from src.ingest.pubtator_parser import PubTatorParser
from src.ingest.discovery_pilot import Cache, candidate_passages, node_index, match_nodes


class DiscoveryPilotTests(unittest.TestCase):
    def fixture(self):
        return {"id": "123", "passages": [
            {"infons": {"type": "title"}, "offset": 0, "text": "Example"},
            {"infons": {"type": "abstract"}, "offset": 8, "text": "  PHGDH inhibits osteoclast differentiation.",
             "annotations": [{"id": "A1", "text": "PHGDH", "infons": {"type": "Gene", "identifier": "10797"},
                              "locations": [{"offset": 10, "length": 5}]}]},
            {"infons": {"type": "abstract"}, "offset": 52, "text": "Other abstract section."}],
            "relations": [{"id": "R1", "infons": {"type": "Inhibit", "score": "0.99"}}]}

    def test_collection_shapes_and_multiple_abstracts(self):
        doc = self.fixture()
        for payload in [doc, [doc], {"documents": [doc]}, {"PubTator3": [doc]}]:
            paper = PubTatorParser.parse_bioc_json(payload)[0]
            self.assertIn("Other abstract section.", paper["abstract"])
            self.assertEqual(paper["relations"][0]["id"], "R1")
            self.assertEqual(paper["entities"][0]["locations"], [{"offset": 10, "length": 5}])

    def test_span_and_ambiguous_form_are_not_promoted(self):
        paper = PubTatorParser.parse_bioc_json(self.fixture())[0]
        nodes = [{"node_id": "LOCAL:protein:mouse:PHGDH", "name": "PHGDH", "type": "protein"},
                 {"node_id": "LOCAL:gene:human:PHGDH", "name": "PHGDH", "type": "gene"}]
        row = candidate_passages(paper, {"sha256": "abc", "raw_file": "cached.json"}, node_index(nodes))[0]
        self.assertEqual(row["start"], 10)
        self.assertEqual(row["passage_text"], paper["passages"][1]["text"][2:])
        self.assertEqual(len(row["candidate_node_ids"]), 2)
        for field in ["relation", "sign", "experiment_id", "context_id", "polarity"]:
            self.assertEqual(row[field], "")
        self.assertFalse(row["eligible_for_scoring"])

    def test_candidate_ids_repeat_and_no_cue_is_not_a_claim(self):
        p = PubTatorParser.parse_bioc_json(self.fixture())[0]
        prov = {"sha256": "x", "raw_file": "f"}
        self.assertEqual(candidate_passages(p, prov, {}), candidate_passages(p, prov, {}))
        p["passages"][1]["text"] = "PHGDH was measured."
        self.assertEqual(candidate_passages(p, prov, {}), [])

    def test_missing_locations_do_not_invent_offsets(self):
        doc = self.fixture()
        doc["passages"][1]["annotations"][0]["locations"] = []
        self.assertIsNone(PubTatorParser.parse_bioc_json(doc)[0]["entities"][0]["offset"])

    def test_calcium_does_not_match_carbonic_anhydrase(self):
        index = node_index([{"node_id": "protein:CA2", "name": "CA2", "type": "protein"},
                            {"node_id": "compound:calcium", "name": "Ca2+", "type": "intracellular_compound"}])
        self.assertEqual(match_nodes({"text": "Ca2+", "type": "Chemical"}, index), ["compound:calcium"])

    def test_offline_cache_never_networks_and_detects_corruption(self):
        with tempfile.TemporaryDirectory() as temp:
            cache = Cache(Path(temp), offline=True)
            with patch.object(cache.session, "get", side_effect=AssertionError("network called")):
                with self.assertRaises(RuntimeError):
                    cache.get("url", {})
                key = hashlib.sha256(json.dumps(["url", {}], sort_keys=True).encode()).hexdigest()
                (Path(temp) / f"{key}.json").write_text("{}")
                (Path(temp) / f"{key}.meta.json").write_text(json.dumps({"sha256": "bad"}))
                with self.assertRaises(ValueError):
                    cache.get("url", {})

    def test_saved_pilot_passages_reconstruct_exactly(self):
        root = Path(__file__).resolve().parents[1]
        path = root / "data/staging/discovery_pilot/candidates.json"
        if not path.exists():
            self.skipTest("No live pilot snapshot in this checkout")
        candidates = json.loads(path.read_text(encoding="utf-8"))
        self.assertEqual(len(candidates), len({c["candidate_id"] for c in candidates}))
        for row in candidates:
            raw = (root / row["raw_file"]).read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(), row["source_sha256"])
            docs = PubTatorParser.parse_bioc_json(json.loads(raw))
            doc = next(d for d in docs if d["pmid"] == row["pmid"])
            passage = doc["passages"][row["passage_index"]]
            self.assertEqual(passage["text"][row["start"]-passage["offset"]:row["end"]-passage["offset"]], row["passage_text"])
            self.assertFalse(row["eligible_for_scoring"])


if __name__ == "__main__":
    unittest.main()
