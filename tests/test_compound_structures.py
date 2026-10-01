import csv
import hashlib
import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class StructureArtifactTests(unittest.TestCase):
    def test_all_display_models_match_their_hash_and_accession(self):
        with (ROOT/'data/processed/nodes.csv').open(encoding='utf-8') as f:
            nodes=list(csv.DictReader(f))
        for n in nodes:
            model=json.loads(n['structure_candidates']).get('small_molecule')
            if model:
                self.assertEqual(model['registry_id'],n['node_id'])
                self.assertEqual(hashlib.sha256((ROOT/model['sdf_url']).read_bytes()).hexdigest(),model['sdf_sha256'])
        for n in nodes:
            if n['node_id'] in {'CHEBI:32838','CHEBI:30805','CHEBI:17544','CHEBI:15554'}:
                data=json.loads(n['structure_candidates'])
                self.assertNotIn('small_molecule',data)
                self.assertIn('conflicts',data['small_molecule_unavailable'])

@unittest.skipUnless(importlib.util.find_spec('rdkit'), 'Optional RDKit environment required')
class ConformerTests(unittest.TestCase):
    def test_rejects_undefined_chemistry(self):
        from src.enrichment.build_compound_structures import generate
        for smiles in ['*CC','[Na+].[Cl-]','CC(O)C(=O)O']:
            with self.assertRaises(ValueError):generate(smiles)
    def test_seeded_geometry_and_charge(self):
        from src.enrichment.build_compound_structures import generate
        from rdkit import Chem
        a,_=generate('O=C([O-])CCC(=O)[O-]');b,_=generate('O=C([O-])CCC(=O)[O-]')
        self.assertTrue(a.GetConformer().Is3D())
        self.assertEqual(Chem.GetFormalCharge(a),-2)
        self.assertEqual(Chem.MolToMolBlock(a),Chem.MolToMolBlock(b))
    def test_distributed_sdfs_are_parseable_3d(self):
        from rdkit import Chem
        for path in (ROOT/'assets/structures').glob('*.sdf'):
            mol=next(iter(Chem.SDMolSupplier(str(path),removeHs=False)))
            self.assertIsNotNone(mol,path.name)
            self.assertTrue(mol.GetConformer().Is3D(),path.name)
