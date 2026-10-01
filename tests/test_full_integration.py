import copy
import json
from pathlib import Path
import tempfile
import unittest
from src.kg.integrate_full_enrichment import ROOT, OUTPUT, resolve, project, ENDPOINTS
from src.kg.integrate_pyk2_pilot import TABLES, apply_patch_file
from src.kg.validate_schema import run_verification


class FullIntegrationTests(unittest.TestCase):
    def test_foreign_transgene_does_not_inherit_mouse_host(self):
        entity={'surface':'PTP-oc','molecular_form':'gene','taxon':'9986'}
        ground={'registry_candidates':[{'gene_id':'1'}],'specimen_taxon_candidate':'10090'}
        self.assertIsNone(resolve(entity,ground,{'passages':[{'text':'Transgenic mice'}]}, {})[0])

    def test_distinct_formation_and_differentiation(self):
        self.assertNotEqual(ENDPOINTS['osteoclastformation'],ENDPOINTS['osteoclastdifferentiation'])

    def test_wrong_measured_target_not_projected(self):
        claim={'assertion':'observed_result','kind':'regulation','regulatory':{'subject':'a','object':'b','effect_level':'phenotype'},'entities':[{'key':'a','surface':'NIK','molecular_form':'protein'},{'key':'b','surface':'RANKL','molecular_form':'protein'}],'experiment':{'endpoint':'mitochondrial DNA'}}
        self.assertIsNone(project(claim)[0])

    def test_patch_roundtrip_and_no_review_promotion(self):
        path=ROOT/OUTPUT/'patch.json'
        patch=json.loads(path.read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); data=root/'data/processed';data.mkdir(parents=True)
            for name in TABLES:
                (data/(name+'.csv')).write_bytes(patch['before'][name].encode())
            self.assertEqual(apply_patch_file(path,root),'applied')
            self.assertFalse(run_verification(data)['errors'])
            self.assertEqual(apply_patch_file(path,root),'already_applied')
            self.assertEqual(apply_patch_file(path,root,rollback=True),'rolled_back')
            for name in TABLES:
                self.assertEqual((data/(name+'.csv')).read_bytes(),patch['before'][name].encode())
        import csv,io
        new=[r for r in csv.DictReader(io.StringIO(patch['after']['edge_evidence'])) if r['evidence_id'].startswith('ev:full:')]
        self.assertEqual(len(new),59)
        self.assertTrue(all(r['curator_status']=='automated_extraction' and not r['reviewed_at'] for r in new))


if __name__=='__main__':
    unittest.main()
