import copy
import json
import unittest
from pathlib import Path
from src.kg.graph import OsteoclastKnowledgeGraph
from src.kg.drug_targets import load_graph, load_targets, overlay, ROOT


class RecordAndContextTests(unittest.TestCase):
    def test_future_integration_preserves_explicit_qualifiers_only(self):
        from src.kg.integrate_full_enrichment import context_qualifiers
        c={'context':{'sex':'female','model_setting':'in_vivo'},'experiment':{'dose':None,'duration':'3 days'}}
        self.assertEqual(context_qualifiers(c),{'sex':'female','model_setting':'in_vivo','duration':'3 days'})
        self.assertEqual(context_qualifiers({'context':{},'experiment':{}}),{})

    def fixture(self):
        g=OsteoclastKnowledgeGraph()
        g.nodes={n:{'identity_status':'registry_mapped'} for n in ['a','b']}
        g.edges['e']={'edge_id':'e','source_id':'a','target_id':'b','relation':'REGULATES','sign':1,'status':'proposed','context_id':'c','source_record_id':'A;B'}
        g.contexts['c']={'species':'mouse','cell_type':'precursor'}
        g.adj_out['a'].append(('b','e'))
        g.source_records={'A':{'resolution_status':'unresolved'},'B':{'resolution_status':'resolved'}}
        g.edge_evidence=[{'evidence_id':'ea','edge_id':'e','source_id':'A','polarity':'support','curator_status':'reviewed','passage_status':'source_checked_quote','quote_or_location':'A increases B','source_location':'abstract','source_sha256':'a'*64},
                         {'evidence_id':'eb','edge_id':'e','source_id':'B','polarity':'support','curator_status':'pending'}]
        return g

    def test_sources_cannot_borrow_resolution(self):
        g=self.fixture();a=g.assess_edge('e')
        self.assertEqual(a['weight'],.15)
        self.assertEqual(a['support_sources'],['B'])
        self.assertEqual(g.assess_edge('e','discovery')['weight'],.65)
        self.assertFalse(g.filter_subgraph_by_leakage({'B'},set()).assess_edge('e')['usable'])

    def test_sex_mismatch_explorable_but_not_scenario_support(self):
        g=self.fixture();g.contexts['c']['qualifiers']='{"sex":"female"}'
        female=g.score_drug_mechanism('a',1,'b',target_context={'sex':'female'})
        male=g.score_drug_mechanism('a',1,'b',target_context={'sex':'male'})
        self.assertEqual(len(female['paths']),1)
        self.assertEqual(len(male['context_incompatible_paths']),1)
        self.assertFalse(male['paths'])
        self.assertIn('context_mismatch:sex',male['all_paths'][0]['warnings'])

    def test_missing_qualifier_stays_unknown_and_available(self):
        g=self.fixture();p=g.find_mechanism_paths('a','b',target_context={'sex':'female'})[0]
        self.assertEqual(p['context_applicability'],'unknown')
        self.assertIn('context_unknown:sex',p['warnings'])

    def test_compatible_record_cannot_borrow_incompatible_tier(self):
        g=self.fixture();g.source_records['A']['resolution_status']='resolved'
        g.edge_evidence[0]['experiment_id']='female';g.edge_evidence[1]['experiment_id']='male'
        g.experiments={'female':{'qualifiers':'{"sex":"female"}'},'male':{'qualifiers':'{"sex":"male"}'}}
        self.assertEqual(g.assess_edge('e',target_context={'sex':'male'})['weight'],.15)
        self.assertEqual(g.assess_edge('e',target_context={'sex':'female'})['weight'],.65)

    def test_gene_mapping_does_not_create_causal_sign(self):
        g=self.fixture();g.edges['e']['relation']='ENCODES';g.edges['e']['sign']=0
        p=g.find_mechanism_paths('b','a')[0]
        self.assertEqual(p['net_sign'],0)
        self.assertEqual(p['traversal_directions'],['reverse_structural'])
        self.assertTrue(p['transfer_assumptions'])


class SerineModuleTests(unittest.TestCase):
    def test_real_cpt1a_counterfactual(self):
        g=load_graph();eid='edge:full:a8b7d69a426f9706995a214d';e=g.edges[eid]
        for sex,status in [('female','compatible'),('male','incompatible')]:
            self.assertEqual(g.context_applicability(eid,{'sex':sex})['status'],status)
        self.assertTrue(g.find_mechanism_paths(e['source_id'],e['target_id'],max_depth=1,target_context={'sex':'male'}))

    def test_wasp_challenge_is_not_steady_state_support(self):
        g=load_graph();eid='edge:full:f0eaca18559376b359136632'
        self.assertEqual(g.context_applicability(eid,{'model_setting':'steady_state'})['status'],'incompatible')
        self.assertEqual(g.context_applicability(eid,{'model_setting':'resorptive_challenge'})['status'],'compatible')

    def test_reaction_participants_are_unsigned_and_complete(self):
        g=load_graph()
        expected={'RHEA:12641':(2,3),'RHEA:14329':(2,2),'RHEA:21208':(2,2)}
        for rid,counts in expected.items():
            es=[e for e in g.edges.values() if e['target_id']==rid]
            self.assertEqual(tuple(sum(e['relation']==rel for e in es) for rel in ['INPUT_TO','OUTPUT_OF']),counts)
            self.assertEqual(sum(e['relation']=='CATALYZES' for e in es),1)
            self.assertTrue(all(e['sign']==0 for e in es))

    def test_no_neutral_acid_or_serine_rescue_shortcut(self):
        g=load_graph()
        self.assertEqual(g.edges['edge:0034']['target_id'],'LOCAL:pool:intracellular_alpha_ketoglutarate')
        self.assertEqual(g.edges['edge:0037']['status'],'quarantined')
        self.assertEqual(g.edges['edge:serine:demethylation_transcription']['target_id'],'LOCAL:rna:mouse:Nfatc1')
        self.assertFalse(any(e['source_id']=='CHEBI:33384' and e['sign']!=0 for e in g.edges.values()))

    def test_drug_overlay_requires_explicit_transfer_and_preserves_graph(self):
        g=load_graph();before=copy.deepcopy(g.__dict__)
        rows=load_targets(ROOT/'data/drug_targets/targets.csv')
        exact,decisions=overlay(g,rows)
        self.assertEqual(decisions[0]['mapping'],'target_not_represented')
        scenario,decisions=overlay(g,rows,True)
        self.assertEqual(decisions[0]['mapping'],'explicit_cross_species_scenario')
        edge=scenario.edges['drug-target:'+rows[0]['record_id']]
        self.assertTrue(edge['transfer_assumptions'])
        self.assertEqual(edge['drug_target_record']['target_taxon'],'human')
        self.assertEqual(g.__dict__,before)

    def test_all_patch_input_hashes_and_holdout_exclusion(self):
        import hashlib
        patch=json.loads((ROOT/'data/staging/serine_module_v1/patch.json').read_text())
        for path,digest in patch['input_sha256'].items():
            self.assertEqual(hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),digest,path)
        held=json.loads((ROOT/'data/staging/full_enrichment_prepared_v2/config.json').read_text())['excluded_holdout_pmids']
        self.assertNotIn('38200114',{str(x) for x in held})


if __name__=='__main__':unittest.main()
