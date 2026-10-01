import csv
import io
import json
from pathlib import Path
import tempfile
import unittest
from src.ingest.resolution_quality_pass import ROOT,OUT,REPAIRS,cleaned_surface
from src.kg.integrate_quality_pass import resolve
from src.kg.integrate_resolution_iteration import project
from src.kg.integrate_pyk2_pilot import TABLES,apply_patch_file
from src.kg.validate_schema import run_verification

def node_rows():
    return list(csv.DictReader(io.StringIO((ROOT/'data/processed/nodes.csv').read_text(encoding='utf-8'))))

class QualityPassTests(unittest.TestCase):
    def test_wrappers_preserve_variants_and_molecular_form(self):
        self.assertEqual(cleaned_surface('Arp2 protein','protein'),'Arp2')
        self.assertEqual(cleaned_surface('Ctsk mRNA expression level','RNA'),'Ctsk')
        self.assertEqual(cleaned_surface('Bcl-xl mRNA','RNA'),'Bcl-xl')
        self.assertEqual(cleaned_surface('SRC family members','protein'),'SRC family members')
        for s in ['Bcl-xl mRNA','Src family members','LMW-PTP slow isoform','miR-222-3p']:
            self.assertIsNone(resolve({'surface':s,'molecular_form':'protein'},{},{},{})[0])

    def test_target_inhibition_not_molecular_addition(self):
        c={'assertion':'observed_result','kind':'perturbation_effect','entities':[{'key':'s','surface':'TBK1','molecular_form':'protein'},{'key':'t','surface':'osteoclast formation','molecular_form':'phenotype'}],'regulatory':{'subject':'s','object':'t','sign':'unknown','direction':'subject_to_object','effect_level':'phenotype','interpretation':'inferred_from_perturbation'},'experiment':{'intervention':'pharmacological inhibition of TBK1','perturbation_type':'chemical_treatment','endpoint':'osteoclast formation','outcome_change':'decreased'},'evidence':[{'quote':'Pharmacological inhibition of TBK1 reduced osteoclast formation.'}]}
        self.assertEqual(project(c),(None,'pharmacological_target_inhibition_is_not_protein_addition'))
        c['entities'][0]['surface']='TRAIL';c['experiment']['intervention']='TRAIL addition';c['evidence'][0]['quote']='TRAIL addition reduced osteoclast formation.';c['regulatory']['sign']='negative'
        self.assertEqual(project(c)[0],('REGULATES',-1,'reported_molecular_addition_effect'))

    def test_false_accessions_are_not_live_identities_or_aliases(self):
        nodes=node_rows()
        ids={n['node_id'] for n in nodes}
        self.assertFalse(ids & set(REPAIRS))
        self.assertTrue({r[0] for r in REPAIRS.values()} <= ids)
        self.assertFalse(set(REPAIRS)&{x for n in nodes for x in n['legacy_ids'].split('|')})
        for n in nodes:
            if n['node_id'] in {r[0] for r in REPAIRS.values()}:
                self.assertEqual(json.loads(n['structure_candidates'])['small_molecule']['registry_id'],n['node_id'])

    def test_protein_mapping_matches_registry_species_and_primary_gene(self):
        nodes={n['node_id']:n for n in node_rows()}
        from src.ingest.ground_development_claims import taxon,normalize
        rows=json.loads((OUT/'protein_accession_decisions.json').read_text(encoding='utf-8'))
        for r in rows:
            n=nodes[r['node_id']];s=json.loads(n['structure_candidates'])
            if r['status']=='unique_reviewed_registry_match':
                body=json.loads((ROOT/r['registry_source']).read_text(encoding='utf-8'))
                e=next(e for e in body['results'] if e['primaryAccession']==r['accession'])
                self.assertEqual(e['entryType'],'UniProtKB reviewed (Swiss-Prot)')
                self.assertEqual(str(e['organism']['taxonId']),taxon(n['taxon']))
                self.assertIn(normalize(n['symbol']),{normalize(g.get('geneName',{}).get('value')) for g in e.get('genes',[])})
                self.assertEqual(s['uniprot_id'],r['accession'])
                if r.get('changed_previous_accession'): self.assertEqual(s.get('pdb_structures'),[])
            else:
                self.assertFalse(s.get('uniprot_id') or s.get('pdb_structures'))

    def test_final_patch_reversible_and_structurally_valid(self):
        path=OUT/'release_patch.json';p=json.loads(path.read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);d=root/'data/processed';d.mkdir(parents=True)
            for t in TABLES:(d/(t+'.csv')).write_bytes(p['before'][t].encode())
            self.assertEqual(apply_patch_file(path,root),'applied')
            self.assertEqual(run_verification(d)['errors'],[])
            self.assertEqual(apply_patch_file(path,root),'already_applied')
            self.assertEqual(apply_patch_file(path,root,rollback=True),'rolled_back')
            for t in TABLES:self.assertEqual((d/(t+'.csv')).read_bytes(),p['before'][t].encode())

    def test_audit_sample_and_fixed_connectivity_denominator(self):
        sample=[json.loads(l) for l in (OUT/'random_audit_sample.jsonl').read_text(encoding='utf-8').splitlines()]
        self.assertEqual(len({r['claim_id'] for r in sample}),120)
        audit=list(csv.DictReader(io.StringIO((OUT/'diagnostic_audit.csv').read_text(encoding='utf-8'))))
        self.assertEqual({r['claim_id'] for r in audit},{r['claim_id'] for r in sample})
        r=json.loads((ROOT/'data/staging/full_integration_v3/connectivity_comparison.json').read_text())
        self.assertEqual(r['before']['starting_proteins'],r['after']['starting_proteins'])
        self.assertFalse(r['before']['search_truncated'] or r['after']['search_truncated'])

if __name__=='__main__':unittest.main()
