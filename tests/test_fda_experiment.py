import importlib.util
import json
import unittest
from collections import Counter
from src.ingest.fda_resolution import choose_chembl,ROOT,OUT,read_csv,digest
from src.kg.drug_experiment import grouped_components,evaluate,PILOT


class ResolutionTests(unittest.TestCase):
    def test_null_hierarchy_does_not_crash_or_create_parent(self):
        mols={'CHEMBL1':{'molecule_hierarchy':None}}
        self.assertEqual(choose_chembl({'inchikey':'K','ingredient_name':'A'},mols,{'K':['CHEMBL1']},{})[1],'CHEMBL1')

    def test_ambiguous_parents_are_not_silently_selected(self):
        mols={'A':{},'B':{}}
        result=choose_chembl({'inchikey':'','ingredient_name':'same'},mols,{}, {'SAME':['A','B']})
        self.assertEqual(result[1],'');self.assertEqual(result[2],'ambiguous_parent_mappings')

    def test_full_structure_match_precedes_name_match(self):
        result=choose_chembl({'inchikey':'K','ingredient_name':'A'},{'A':{},'B':{}},{'K':['B']},{'A':['A']})
        self.assertEqual(result[1],'B');self.assertEqual(result[2],'full_inchikey_match')


class ExperimentTests(unittest.TestCase):
    def test_transitive_paper_drug_scaffold_grouping(self):
        rows=[{'observation_id':'1','drug_name':'A','source_id':'P1','ingredient_id':'A'},
              {'observation_id':'2','drug_name':'B','source_id':'P1','ingredient_id':'B'},
              {'observation_id':'3','drug_name':'B','source_id':'P2','ingredient_id':'B'},
              {'observation_id':'4','drug_name':'C','source_id':'P3','ingredient_id':'C'}]
        groups=grouped_components(rows,{'A':{'scaffold_group':'S'},'C':{'scaffold_group':'S'}})
        self.assertEqual(groups,[['1','2','3','4']])

    def test_unknown_and_trend_never_become_efficacy_negatives(self):
        rows=[{'observation_id':str(i),'drug_name':str(i),'endpoint':'formation','effect_direction':d} for i,d in enumerate(['decreased','no_significant_change','unknown','trend_decreased'])]
        predictions=[{'observation_id':str(i),'score':str(4-i)} for i in range(4)]
        result=evaluate(rows,predictions,'formation')
        self.assertEqual(result['eligible_observations'],2);self.assertEqual(result['average_precision'],1)

    def test_missing_predictions_report_coverage_and_single_class_no_auc(self):
        rows=[{'observation_id':'1','drug_name':'A','endpoint':'formation','effect_direction':'decreased'}, {'observation_id':'2','drug_name':'B','endpoint':'formation','effect_direction':'no_significant_change'}]
        result=evaluate(rows,[{'observation_id':'1','score':'0.5'}],'formation')
        self.assertEqual(result['coverage'],.5);self.assertIsNone(result['roc_auc'])

    def test_pilot_provenance_and_no_promoted_independent_review(self):
        rows=read_csv(PILOT/'observations.csv')
        self.assertEqual(len(rows),28)
        for r in rows:
            self.assertEqual(digest((ROOT/r['raw_file']).read_bytes()),r['raw_sha256'])
            self.assertEqual(r['independent_review_status'],'pending')
            if r['viability_assessment']!='no_reduction_reported':self.assertEqual(r['selective_inhibition_label'],'')
        self.assertTrue(any(r['effect_direction']=='increased' for r in rows))
        self.assertTrue(any(r['effect_direction']=='no_significant_change' for r in rows))


@unittest.skipUnless(importlib.util.find_spec('rdkit'),'Optional RDKit environment required')
class ChemicalGroupsTests(unittest.TestCase):
    def test_salt_parent_and_stereochemistry_are_explicit(self):
        from src.kg.fda_features import structure_features
        salt=structure_features('C[C@H](N)C(=O)O.Cl');base=structure_features('C[C@H](N)C(=O)O')
        self.assertEqual(salt['parent_inchikey'],base['parent_inchikey'])
        self.assertEqual(salt['fragment_count'],2)
        self.assertNotEqual(base['parent_inchikey'],structure_features('C[C@@H](N)C(=O)O')['parent_inchikey'])
    def test_no_generic_or_mixture_silently_becomes_small_molecule(self):
        from src.kg.fda_features import structure_features
        self.assertNotEqual(structure_features('CCCCCCCC.CCCCCCCCC')['structure_status'],'eligible_small_molecule')
        self.assertNotEqual(structure_features('[Na+]')['structure_status'],'eligible_small_molecule')


if __name__=='__main__':unittest.main()
