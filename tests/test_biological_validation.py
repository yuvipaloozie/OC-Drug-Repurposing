import csv
import io
import json
import unittest
import zipfile
from pathlib import Path
from src.ingest.fda_inventory import make_inventory,parse_products,normalize_ingredient
from src.kg.biological_validation import reaction_balance,ROOT
from src.kg.drug_targets import load_graph,load_targets,overlay


class BiologicalAuditTests(unittest.TestCase):
    def test_three_registry_reactions_balance_atoms_and_charge(self):
        result=reaction_balance(ROOT,load_graph())
        self.assertEqual(len(result),3)
        self.assertTrue(all(r['balanced'] for r in result))

    def test_biochemical_assay_has_distinct_context_and_no_phenotype_claim(self):
        g=load_graph();e=g.edges['edge:audit:itaconate_tet2_biochemical']
        c=g.contexts[e['context_id']]
        self.assertEqual(json.loads(c['qualifiers'])['model_setting'],'purified_enzyme')
        self.assertEqual(e['target_id'],'LOCAL:protein:mouse:TET2')
        self.assertFalse(g.evidence_eligible(e['edge_id']))
        self.assertEqual(g.context_applicability(e['edge_id'],{'model_setting':'in_vivo'})['status'],'incompatible')

    def test_specificity_warning_survives_drug_overlay(self):
        g=load_graph();rows=load_targets(ROOT/'data/drug_targets/targets.csv')
        g,_=overlay(g,rows,True)
        paths=g.find_mechanism_paths(rows[0]['drug_id'],max_depth=2)
        self.assertTrue(paths)
        self.assertTrue(all(p['pharmacology_caveats'] for p in paths))


class FDAInventoryTests(unittest.TestCase):
    def row(self,ingredient,kind='RX',number='1'):
        return {'Ingredient':ingredient,'Appl_Type':'N','Appl_No':number,'Product_No':'001','Type':kind,'Approval_Date':'Jan 1, 2000','DF;Route':'TABLET;ORAL'}

    def test_combinations_salts_discontinued_and_unknown_labels(self):
        rows=[self.row('A HYDROCHLORIDE; B'),self.row('A',number='2'),self.row('C','DISCN','3')]
        products,ingredients,links=make_inventory(rows)
        self.assertEqual(len(products),3);self.assertEqual(len(ingredients),4);self.assertEqual(len(links),4)
        by={r['ingredient_name']:r for r in ingredients}
        self.assertFalse(by['A HYDROCHLORIDE']['marketed_single_ingredient_product'])
        self.assertTrue(by['A']['marketed_single_ingredient_product'])
        self.assertEqual(by['C']['inventory_status'],'discontinued_products_only')
        self.assertTrue(all(r['osteoclast_effect_label']=='unknown' for r in ingredients))

    def test_snapshot_hashes_and_membership(self):
        import hashlib
        pointer=json.loads((ROOT/'data/fda/current.json').read_text())
        folder=ROOT/pointer['directory'];summary=json.loads((folder/'summary.json').read_text())
        for name,digest in summary['files'].items():self.assertEqual(hashlib.sha256((folder/name).read_bytes()).hexdigest(),digest)
        self.assertEqual(summary['osteoclast_labels_assigned'],0)
        self.assertGreater(summary['ingredients_with_marketed_products'],1000)

    def test_source_parser_rejects_unknown_marketing_state(self):
        row=self.row('A','MYSTERY');text=io.StringIO();w=csv.DictWriter(text,fieldnames=list(row),delimiter='~');w.writeheader();w.writerow(row)
        blob=io.BytesIO()
        with zipfile.ZipFile(blob,'w') as z:z.writestr('products.txt',text.getvalue())
        with self.assertRaises(ValueError):parse_products(blob.getvalue())


if __name__=='__main__':unittest.main()
