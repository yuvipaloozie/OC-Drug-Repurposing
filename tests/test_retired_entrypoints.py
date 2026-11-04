"""Retired transforms must fail before they can change canonical data."""
import runpy
import unittest


class RetiredEntrypointTests(unittest.TestCase):
    def test_legacy_transforms_remain_disabled(self):
        modules = (
            'enrichment.gnn_chemical_featurizer',
            'enrichment.omnipath_fantom_stitch',
            'enrichment.pan_disease_multiomics_catalog',
            'enrichment.primekg_catalog',
            'enrichment.primekg_enrichment_builder',
            'enrichment.single_cell_sc_enricher',
            'kg.apply_simplified_schema',
            'kg.convert_simplified_schema',
            'kg.integrate_string_ppi',
            'kg.partition_protein_subtypes',
        )
        for module in modules:
            with self.subTest(module=module):
                with self.assertRaisesRegex(RuntimeError, 'Retired legacy transform:'):
                    runpy.run_module('src.' + module, run_name='__main__')
