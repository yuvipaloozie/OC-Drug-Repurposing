import copy
import csv
import io
import json
from pathlib import Path
import tempfile
import unittest
from src.ingest.prepare_resolution_iteration import infer_species,chemical_name,molecule_name,registry_aliases
from src.kg.integrate_resolution_iteration import project,ROOT,OUTPUT,chemical_catalog
from src.kg.integrate_pyk2_pilot import apply_patch_file,TABLES
from src.kg.validate_schema import run_verification


class ResolutionIterationTests(unittest.TestCase):
    def test_mixed_species_not_inferred_and_foreign_transgene_not_replaced(self):
        packet={'passages':[{'text':'Human samples and mouse cultures were studied.'}]}
        self.assertIsNone(infer_species({}, {},packet)[0])
        self.assertIsNone(infer_species({'taxon':'rabbit'}, {'species':'mouse'},packet)[0])
        self.assertEqual(infer_species({}, {'cell_type':'RAW264.7'}, {'passages':[{'text':'RAW264.7 cells'}]})[0],'10090')

    def test_name_normalization_preserves_chemical_stereochemistry(self):
        self.assertEqual(molecule_name('TGF-β'),'TGF-beta')
        self.assertNotEqual(chemical_name('D-serine'),chemical_name('L-serine'))
        self.assertNotEqual(chemical_name('calcium'),chemical_name('calcium(2+)'))
        self.assertIn('csrc',registry_aliases(['proto-oncogene c-Src']))
        self.assertNotIn('src',registry_aliases(['Src family kinases']))

    def test_chemical_treatment_uses_observed_sign_not_knockout_inversion(self):
        claim={'assertion':'observed_result','kind':'perturbation_effect','entities':[{'key':'s','surface':'dasatinib','molecular_form':'compound'},{'key':'t','surface':'osteoclast formation','molecular_form':'phenotype'}],'regulatory':{'subject':'s','object':'t','sign':'negative','direction':'subject_to_object','effect_level':'phenotype','interpretation':'explicit_in_text'},'experiment':{'intervention':'dasatinib treatment','endpoint':'osteoclast formation','outcome_change':'decreased','perturbation_type':'chemical_treatment'},'evidence':[{'quote':'Dasatinib treatment reduced osteoclast formation.'}]}
        original=copy.deepcopy(claim)
        self.assertEqual(project(claim)[0],('REGULATES',-1,'chemical_treatment_effect'))
        self.assertEqual(claim,original)
        claim['regulatory']['sign']='positive'
        self.assertIsNone(project(claim)[0])

    def test_wrong_chebi_ids_not_used(self):
        ids={r['node_id'] for rows in chemical_catalog().values() for r in rows}
        self.assertFalse(ids & {'CHEBI:32838','CHEBI:30805','CHEBI:17544','CHEBI:15554'})

    def test_expression_during_differentiation_is_not_causal(self):
        claim={'assertion':'observed_result','kind':'regulation','entities':[{'key':'s','surface':'osteoclast differentiation','molecular_form':'phenotype'},{'key':'t','surface':'MAGL','molecular_form':'protein'}],'regulatory':{'subject':'s','object':'t','sign':'positive','effect_level':'expression'},'experiment':{'perturbation_type':'not_stated'},'evidence':[{'quote':'MAGL expression increased during osteoclast differentiation.'}]}
        self.assertEqual(project(claim)[0],('ASSOCIATED_WITH',0,'observational_expression_change'))

    def test_patch_roundtrip_preserves_previous_enrichment(self):
        path=ROOT/OUTPUT/'patch.json';patch=json.loads(path.read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);folder=root/'data/processed';folder.mkdir(parents=True)
            for t in TABLES:
                (folder/(t+'.csv')).write_bytes(patch['before'][t].encode())
            self.assertEqual(apply_patch_file(path,root),'applied')
            self.assertFalse(run_verification(folder)['errors'])
            self.assertEqual(apply_patch_file(path,root),'already_applied')
            self.assertEqual(apply_patch_file(path,root,rollback=True),'rolled_back')
            for t in TABLES:
                self.assertEqual((folder/(t+'.csv')).read_bytes(),patch['before'][t].encode())
        before=list(csv.DictReader(io.StringIO(patch['before']['edge_evidence'])))
        after=list(csv.DictReader(io.StringIO(patch['after']['edge_evidence'])))
        old={e['evidence_id']:e for e in before};new={e['evidence_id']:e for e in after}
        self.assertTrue(all(new[k]==v for k,v in old.items()))
        added=[e for k,e in new.items() if k not in old]
        self.assertTrue(added)
        self.assertTrue(all(e['curator_status']=='automated_extraction' and not e['reviewed_at'] for e in added))

    def test_connectivity_compares_fixed_denominator(self):
        report=json.loads((ROOT/OUTPUT/'connectivity_comparison.json').read_text())
        a=report['fixed_mouse_protein_baseline'];b=report['same_proteins_after']
        self.assertEqual(a['starting_proteins'],b['starting_proteins'])
        self.assertFalse(a['search_truncated'] or b['search_truncated'])
        self.assertGreater(b['pairs_without_reported_species_or_cell_mismatch'],a['pairs_without_reported_species_or_cell_mismatch'])


if __name__=='__main__':
    unittest.main()
