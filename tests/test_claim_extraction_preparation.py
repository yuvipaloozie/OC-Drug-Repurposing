import hashlib
import tempfile
import unittest
from pathlib import Path

from src.ingest.prepare_claim_extraction import packet_for, encoded, source_path


class ClaimPreparationTests(unittest.TestCase):
    def fixture(self, root):
        raw = root / 'snapshot.json'
        raw.write_bytes(b'{"fixture": true}')
        checksum = hashlib.sha256(raw.read_bytes()).hexdigest()
        paper = {'pmid': '123', 'provenance': {'raw_file': 'snapshot.json', 'sha256': checksum},
                 'passages': [{'passage_index': 0, 'passage_type': 'abstract', 'offset': 100,
                               'text': 'X decreases Y.'}], 'entities': [], 'relations': []}
        c = {'candidate_id': 'candidate:test', 'passage_index': 0, 'start': 100, 'end': 114,
             'passage_text': 'X decreases Y.', 'source_sha256': checksum, 'candidate_node_ids': []}
        return paper, c

    def test_stable_packet_and_empty_candidate_control(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            p, c = self.fixture(root)
            self.assertEqual(encoded(packet_for(p, [c], {}, root, {})), encoded(packet_for(p, [c], {}, root, {})))
            self.assertEqual(packet_for(p, [], {}, root, {})['candidate_ids'], [])

    def test_reject_changed_raw_source(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            p, c = self.fixture(root)
            (root / 'snapshot.json').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'checksum'):
                packet_for(p, [c], {}, root, {})

    def test_reject_wrong_span_and_candidate_provenance(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            p, c = self.fixture(root)
            with self.assertRaisesRegex(ValueError, 'span'):
                packet_for(p, [{**c, 'start': 99}], {}, root, {})
            with self.assertRaisesRegex(ValueError, 'provenance'):
                packet_for(p, [{**c, 'source_sha256': 'wrong'}], {}, root, {})

    def test_reject_source_outside_repo(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError):
                source_path(Path(d), '../outside.json')


if __name__ == '__main__':
    unittest.main()
