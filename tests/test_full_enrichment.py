import copy
import json
from pathlib import Path
import unittest

from src.ingest.prepare_full_enrichment import compact_packet, partition
from src.ingest.run_openai_claim_extraction import load_prepared

ROOT = Path(__file__).resolve().parents[1]


class FullEnrichmentTests(unittest.TestCase):
    def test_holdout_is_frozen_by_pmid_not_new_order(self):
        pilot = [{'pmid': str(i), 'split': 'held_out' if i < 50 else 'development'} for i in range(150)]
        papers = [{'pmid': str(i)} for i in reversed(range(160))]
        selected, held = partition(papers, pilot)
        self.assertEqual(len(selected), 110)
        self.assertFalse(set(held) & {p['pmid'] for p, _ in selected})
        self.assertEqual(sum(split == 'development' for _, split in selected), 100)
        self.assertEqual(sum(split == 'discovery' for _, split in selected), 10)
        with self.assertRaises(ValueError):
            partition(papers + [papers[0]], pilot)

    def test_compaction_preserves_exact_text_and_annotation_locations(self):
        packet = {'request_id': 'old', 'source_id': 'PMID:1', 'provider_relations_unverified': [{'prediction': 'noise'}],
                  'passages': [{'passage_index': 1, 'passage_type': 'abstract', 'offset': 20, 'text': 'α lowered β.', 'infons': {}}],
                  'provider_entities': [{'annotation_id': 'a', 'text': 'α', 'type': 'Gene', 'identifier': '123',
                                         'locations': [{'offset': 20, 'length': 1}], 'passage_index': 1, 'infons': {'redundant': True}}]}
        original = copy.deepcopy(packet)
        compact = compact_packet(packet)
        self.assertEqual(compact['passages'][0]['text'], 'α lowered β.')
        self.assertEqual(compact['provider_entities'][0]['locations'], packet['provider_entities'][0]['locations'])
        self.assertNotIn('provider_relations_unverified', compact)
        self.assertEqual(packet, original)
        self.assertEqual(compact, compact_packet(packet))

    def test_prepared_full_run_hashes_holdout_and_unique_shards(self):
        path = ROOT / 'data/staging/full_enrichment_prepared_v2'
        packets, _, _, manifest = load_prepared(path)
        pilot = list(map(json.loads, (ROOT / 'data/staging/claim_extraction_pilot_v1/requests.jsonl').read_text(encoding='utf-8').splitlines()))
        held = {p['pmid'] for p in pilot if p['split'] == 'held_out'}
        self.assertEqual(len(packets), 2404)
        self.assertFalse(held & {p['pmid'] for p in packets})
        shards = [packets[i::16] for i in range(16)]
        self.assertEqual(len({p['request_id'] for shard in shards for p in shard}), 2404)
        self.assertEqual(manifest['held_out_papers_excluded'], 50)


if __name__ == '__main__':
    unittest.main()
