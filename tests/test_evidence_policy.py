"""Policy regressions: useful incomplete evidence must not become established causality."""
import unittest
from src.kg.graph import OsteoclastKnowledgeGraph


class EvidencePolicyTests(unittest.TestCase):
    def graph(self, status='proposed', relation='REGULATES', sign=1):
        g=OsteoclastKnowledgeGraph()
        g.nodes={k:{'identity_status':'reviewed'} for k in ['a','b','c']}
        g.edges={'e':{'source_id':'a','target_id':'b','relation':relation,'sign':sign,
                      'status':status,'context_id':'ctx','context_status':'reviewed',
                      'source_record_id':'PMID:1','source_db':'pubmed'}}
        g.adj_out['a'].append(('b','e'))
        g.source_records={'PMID:1':{'resolution_status':'resolved','claim_match_status':'pending'},
                          'PMID:2':{'resolution_status':'resolved','claim_match_status':'pending'}}
        g.contexts={'ctx':{'verification_status':'reviewed','species':'mouse','cell_type':'BMM'}}
        return g

    def evidence(self,g,polarity='support',source='PMID:1',reviewed=True):
        g.edge_evidence.append({'edge_id':'e','source_id':source,'polarity':polarity,
                               'curator_status':'reviewed' if reviewed else 'automated_extraction',
                               'passage_status':'source_checked_quote' if reviewed else 'automated_extraction_unreviewed',
                               'quote_or_location':'A changes B.','source_location':'abstract',
                               'source_sha256':'a'*64,'experiment_id':'exp'})

    def test_one_step_and_missing_experiment_are_usable_but_not_strict(self):
        g=self.graph();self.evidence(g)
        paths=g.find_mechanism_paths('a','b')
        self.assertEqual(len(paths),1)
        self.assertEqual(paths[0]['path_length'],1)
        self.assertEqual(paths[0]['edge_assessments'][0]['tier'],'reviewed_passage')
        self.assertFalse(g.find_mechanism_paths('a','b',mode='strict'))
        self.assertFalse(g.evidence_eligible('e'))

    def test_curated_database_does_not_require_experiment(self):
        g=self.graph(status='curated');g.edges['e']['source_db']='reactome'
        self.assertEqual(g.assess_edge('e')['tier'],'curated_database')
        self.assertTrue(g.find_mechanism_paths('a','b'))
        self.assertFalse(g.evidence_eligible('e'))

    def test_automated_candidate_retains_lower_weight(self):
        g=self.graph();self.evidence(g,reviewed=False)
        self.assertEqual(g.assess_edge('e')['tier'],'extracted_candidate')
        self.assertLess(g.assess_edge('e')['weight'],0.65)
        self.assertEqual(g.edge_evidence[0]['curator_status'],'automated_extraction')

    def test_quarantine_and_citation_mismatch_do_not_leak_through_fallback(self):
        g=self.graph(status='quarantined');self.evidence(g)
        self.assertFalse(g.assess_edge('e',mode='discovery')['usable'])
        g.edges['e']['status']='proposed'
        g.edge_evidence[0]['curator_status']='quarantined'
        self.assertFalse(g.assess_edge('e')['usable'])
        g.edge_evidence[0]['curator_status']='reviewed'
        g.source_records['PMID:1']['claim_match_status']='citation_topic_mismatch'
        self.assertFalse(g.assess_edge('e')['usable'])
        self.evidence(g,source='PMID:2')
        self.assertTrue(g.assess_edge('e')['usable'])
        self.assertEqual(g.assess_edge('e')['support_sources'],['PMID:2'])

    def test_context_transfer_is_qualified_and_strict_rejects_it(self):
        g=self.graph(status='curated');self.evidence(g)
        g.experiments={'exp':{'verification_status':'reviewed','species':'Mus musculus','cell_type':'bmm'}}
        self.assertTrue(g.evidence_eligible('e'))
        path=g.find_mechanism_paths('a','b',target_context={'species':'human'})[0]
        self.assertIn('context_mismatch',path['warnings'])
        self.assertFalse(g.find_mechanism_paths('a','b',mode='strict',target_context={'species':'human'}))

    def test_unsigned_biochemistry_is_retained_without_inventing_sign(self):
        g=self.graph(status='curated',relation='CATALYZES',sign=1)
        g.edges['e']['source_db']='rhea'
        score=g.score_drug_mechanism('a',target_phenotype_id='b')
        self.assertTrue(score['graph_coverage'])
        self.assertFalse(score['mechanism_coverage'])
        self.assertEqual(score['direction_unresolved_paths'][0]['net_sign'],0)
        self.assertEqual(score['direction_unresolved_paths'][0]['unsigned_steps'][0]['kind'],'structural_or_biochemical')

    def test_contradictory_records_are_visible_and_downweight(self):
        g=self.graph();self.evidence(g)
        before=g.score_drug_mechanism('a',1,'b')['mechanism_feature']
        self.evidence(g,polarity='contradict',source='PMID:2')
        score=g.score_drug_mechanism('a',1,'b')
        self.assertTrue(score['contradiction_flag'])
        self.assertLess(score['mechanism_feature'],before)
        self.assertEqual(score['paths'][0]['edge_assessments'][0]['contradicting_sources'],['PMID:2'])

    def test_only_contradiction_cannot_be_support(self):
        g=self.graph();self.evidence(g,polarity='contradict')
        self.assertFalse(g.assess_edge('e')['usable'])
        result=g.score_drug_mechanism('a',1,'b')
        self.assertTrue(result['contradiction_flag'])
        self.assertEqual(result['excluded_edges'][0]['contradicting_sources'],['PMID:1'])

    def test_opposing_routes_are_returned_and_reduce_net_score(self):
        g=self.graph();self.evidence(g)
        g.edges['op']={**g.edges['e'],'sign':-1}
        g.adj_out['a'].append(('b','op'))
        g.edge_evidence.append({**g.edge_evidence[0],'edge_id':'op'})
        score=g.score_drug_mechanism('a',1,'b')
        self.assertEqual(len(score['opposing_paths']),1)
        self.assertEqual(score['mechanism_feature'],0)
        self.assertTrue(score['contradiction_flag'])

    def test_unresolved_source_is_discovery_only_and_holdout_removes_support(self):
        g=self.graph();self.evidence(g)
        g.source_records['PMID:1']['resolution_status']='unresolved'
        self.assertFalse(g.assess_edge('e')['usable'])
        self.assertTrue(g.assess_edge('e','discovery')['usable'])
        self.assertFalse(g.filter_subgraph_by_leakage({'PMID:1'},set()).edges)

    def test_path_cap_is_explicit(self):
        g=self.graph();self.evidence(g)
        g.edges['second']={**g.edges['e']};g.adj_out['a'].append(('b','second'))
        g.edge_evidence.append({**g.edge_evidence[0],'edge_id':'second'})
        result=g.score_drug_mechanism('a',1,'b',max_paths=1)
        self.assertEqual(len(result['all_paths']),1)
        self.assertTrue(result['search_truncated'])


if __name__=='__main__':unittest.main()
