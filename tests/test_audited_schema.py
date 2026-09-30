import csv,json,hashlib,tempfile,shutil,unittest
from pathlib import Path
from src.kg.validate_schema import run_verification
from src.kg.graph import OsteoclastKnowledgeGraph

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data/processed'
def rows(name):
    with (DATA/f'{name}.csv').open(encoding='utf-8',newline='') as f:return list(csv.DictReader(f))

class AuditedSchemaTests(unittest.TestCase):
    def test_structural_validation_is_explicitly_not_scientific_certification(self):
        result=run_verification(DATA)
        self.assertEqual(result['errors'],[])
        self.assertEqual(result['scope'],'structural_only')
        self.assertTrue(result['warnings'])

    def test_translation_is_mrna_to_protein(self):
        nodes={n['node_id']:n for n in rows('nodes')}
        for e in rows('edges'):
            if e['relation']=='TRANSLATED_TO':
                self.assertEqual(nodes[e['source_id']]['rna_type'],'mrna')
                self.assertEqual(nodes[e['target_id']]['type'],'protein')
        self.assertFalse(any(n['type']=='gene' and 'RNA' in n['name'] for n in nodes.values()))

    def test_review_requires_passage_and_source_checksum(self):
        for ev in rows('edge_evidence'):
            if ev['curator_status']=='reviewed':
                self.assertTrue(ev['quote_or_location']);self.assertTrue(ev['source_location'])
                checksums={hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'data/raw/provenance').glob('*.xml')}
                self.assertIn(ev['source_sha256'],checksums)

    def test_validator_rejects_dangling_and_false_review(self):
        with tempfile.TemporaryDirectory() as temp:
            d=Path(temp);shutil.copytree(DATA,d,dirs_exist_ok=True)
            data=rows('edge_evidence');data[0]['experiment_id']='does-not-exist';data[0]['curator_status']='reviewed';data[0]['source_sha256']=''
            with (d/'edge_evidence.csv').open('w',encoding='utf-8',newline='') as f:
                w=csv.DictWriter(f,fieldnames=list(data[0]));w.writeheader();w.writerows(data)
            errors=run_verification(d)['errors']
            self.assertTrue(any('experiment_id' in e for e in errors));self.assertTrue(any('source_sha256' in e for e in errors))

    def test_csv_json_and_neo4j_payload_match(self):
        g=json.loads((DATA/'osteoclast_knowledge_graph.json').read_text(encoding='utf-8'))
        self.assertEqual(g,json.loads((ROOT/'neo4j/osteoclast_knowledge_graph.json').read_text(encoding='utf-8')))
        self.assertEqual({n['node_id'] for n in rows('nodes')},{n['id'] for n in g['nodes']})
        self.assertEqual({r['evidence_id'] for r in rows('edge_evidence')},{v['evidence_id'] for e in g['edges'] for v in e['evidence']})
        self.assertTrue(all(isinstance(e['evidence'],list) for e in g['edges']))

    def test_legacy_urls_have_unique_alias_targets(self):
        mappings=json.loads((DATA/'identifier_map.json').read_text())
        nodes={n['node_id']:n for n in rows('nodes')}
        for old,new in mappings.items():
            self.assertIn(new,nodes)
            if old!=new:self.assertIn(old,nodes[new]['legacy_ids'].split('|'))

    def test_generated_annotations_are_not_live_features(self):
        g=json.loads((DATA/'osteoclast_knowledge_graph.json').read_text(encoding='utf-8'))
        for n in g['nodes']:
            for k in ['pan_disease','pan_literature','proteomics','flux_kinetics','mutations','alphafold_plddt','known_targeting_drugs']:self.assertNotIn(k,n)
        self.assertTrue((ROOT/'data/quarantine/legacy_snapshot.zip').is_file())

    def test_multiexperiment_evidence_not_semicolon_joined(self):
        self.assertTrue(all(';' not in ev['experiment_id'] for ev in rows('edge_evidence')))

    def test_string_only_edges_not_signed_causal_evidence(self):
        for e in rows('edges'):
            if e['edge_id'].startswith('EDGE_STR'):
                self.assertEqual(e['relation'],'ASSOCIATED_WITH');self.assertEqual(e['sign'],'0')

    def test_hash_manifest_matches_all_files(self):
        manifest=json.loads((ROOT/'data/manifest.json').read_text())
        for path,expected in manifest['files'].items():self.assertEqual(hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),expected,path)

    def test_pending_claims_cannot_score(self):
        g=OsteoclastKnowledgeGraph();g.load_from_csv(*(str(DATA/f'{x}.csv') for x in ['nodes','edges','experiments','edge_evidence','contexts']))
        self.assertFalse(any(g.evidence_eligible(k) for k in g.edges))

    def test_only_heldout_support_removes_edge(self):
        g=OsteoclastKnowledgeGraph();g.nodes={'a':{},'b':{}};g.edges={'e':{'source_id':'a','target_id':'b','source_record_id':'database:x'}}
        g.experiments={'x':{'paper_id':'PMID:123'}};g.edge_evidence=[{'edge_id':'e','experiment_id':'x','source_id':'PMID:123'}]
        sub=g.filter_subgraph_by_leakage({'PMID:123'},set());self.assertFalse(sub.edges);self.assertFalse(sub.edge_evidence)

    def test_independent_support_survives_fold_mask(self):
        g=OsteoclastKnowledgeGraph();g.nodes={'a':{},'b':{}};g.edges={'e':{'source_id':'a','target_id':'b','source_record_id':'database:x'}}
        g.edges['e']['source_record_id']='PMID:123;PMID:456'
        g.experiments={'x':{'paper_id':'PMID:123'},'y':{'paper_id':'PMID:456'}}
        g.edge_evidence=[{'edge_id':'e','experiment_id':'x','source_id':'PMID:123'},{'edge_id':'e','experiment_id':'y','source_id':'PMID:456'}]
        sub=g.filter_subgraph_by_leakage({'PMID:123'},set());self.assertIn('e',sub.edges);self.assertEqual(len(sub.edge_evidence),1)
        self.assertEqual(sub.edges['e']['source_record_id'],'PMID:456')
        self.assertEqual(g.edges['e']['source_record_id'],'PMID:123;PMID:456')


    def test_default_endpoint_finds_and_scores_reviewed_fixture(self):
        g=OsteoclastKnowledgeGraph();end='PATHWAY:OSTEOCLAST_DIFFERENTIATION'
        g.nodes={k:{} for k in ['drug','target',end]}
        g.contexts={'c':{'verification_status':'reviewed','species':'mouse','cell_type':'BMM'}}
        g.experiments={'x':{'verification_status':'reviewed','species':'mouse','cell_type':'BMM'}}
        for i,(a,b,sign) in enumerate([('drug','target',-1),('target',end,1)]):
            key=str(i);g.edges[key]={'source_id':a,'target_id':b,'sign':sign,'status':'curated','context_status':'reviewed','context_id':'c'}
            g.adj_out[a].append((b,key))
            g.edge_evidence.append({'edge_id':key,'experiment_id':'x','curator_status':'reviewed','polarity':'support','passage_status':'source_checked_quote','source_id':'fixture','source_location':'fixture','source_sha256':'fixture','quote_or_location':'fixture'})
        self.assertEqual(len(g.find_mechanism_paths('drug')),1)
        self.assertTrue(g.score_drug_mechanism('drug')['mechanism_coverage'])

    def test_all_workbook_copies_match(self):
        expected=(DATA/'osteoclast_knowledge_graph_sources.xlsx').read_bytes()
        for directory in [ROOT,ROOT/'neo4j']:
            self.assertEqual((directory/'osteoclast_knowledge_graph_sources.xlsx').read_bytes(),expected)
        self.assertIn('osteoclast_knowledge_graph_sources.xlsx',json.loads((ROOT/'data/manifest.json').read_text())['files'])

    def test_glutamic_acid_identity_and_incident_quarantine(self):
        nodes={n['node_id']:n for n in rows('nodes')}
        self.assertEqual(nodes['CHEBI:16015']['name'],'L-glutamic acid')
        self.assertIn('CHEBI:30915',nodes)
        incident=[e for e in rows('edges') if 'CHEBI:16015' in (e['source_id'],e['target_id'])]
        self.assertEqual(len(incident),2)
        self.assertTrue(all(e['status']=='quarantined' for e in incident))

    def test_viewer_eligibility_matches_scoring_gate(self):
        g=OsteoclastKnowledgeGraph();g.load_from_csv(*(str(DATA/f'{x}.csv') for x in ['nodes','edges','experiments','edge_evidence','contexts']))
        payload=json.loads((DATA/'osteoclast_knowledge_graph.json').read_text(encoding='utf-8'))
        for e in payload['edges']:self.assertEqual(e['evidence_eligible'],g.evidence_eligible(e['edge_id']))

    def test_legacy_source_only_mask_keeps_independent_reference(self):
        g=OsteoclastKnowledgeGraph();g.nodes={'a':{},'b':{}}
        g.edges={'e':{'source_id':'a','target_id':'b','source_record_id':'PMID:123;PMID:456'}}
        sub=g.filter_subgraph_by_leakage({'PMID:123'},set())
        self.assertEqual(sub.edges['e']['source_record_id'],'PMID:456')
        self.assertFalse(g.filter_subgraph_by_leakage({'PMID:123','PMID:456'},set()).edges)

if __name__=='__main__':unittest.main()
