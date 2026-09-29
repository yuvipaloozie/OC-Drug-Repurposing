"""One-time migration. Original artifacts are preserved before any replacements."""
import csv,json,re,zipfile,hashlib,sys
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT))
from src.kg.rebuild import read,write
d=ROOT/'data/processed';q=ROOT/'data/quarantine';q.mkdir(exist_ok=True)
if (q/'legacy_snapshot.zip').exists():raise SystemExit('Already migrated; use rebuild instead.')
with zipfile.ZipFile(q/'legacy_snapshot.zip','w',zipfile.ZIP_DEFLATED) as z:
 for rel in ['data/processed','neo4j','reports']:
  for p in (ROOT/rel).glob('*'):
   if p.is_file():z.write(p,str(p.relative_to(ROOT)))
 for rel in ['data/manifest.json','sources.csv']:z.write(ROOT/rel,rel)
g=json.loads((d/'osteoclast_knowledge_graph.json').read_text(encoding='utf-8'))
old_ev={e['edge_id']:e for e in g['edges']}
audit=[]
def log(kind,id,change,reason):audit.append({'record_type':kind,'record_id':id,'change':change,'reason':reason})
# Local entity identities explicitly distinguish molecules from gene loci. Old URLs remain aliases.
mapping={};ns=[]
for n in g['nodes']:
 old=n['id'];typ=n['type'];roles=[];sub='';nid=old
 if typ in ('protein','enzyme','transcription_factor'):
  roles=[typ] if typ!='protein' else [];typ='protein';nid=f"LOCAL:protein:{n.get('taxon','unspecified')}:{old.split(':',1)[1]}"
 elif typ=='gene':
  typ='rna';sub='mrna' if 'messenger RNA' in n['name'] else 'mirna' if 'MicroRNA' in n['name'] else 'lncrna';nid=f"LOCAL:rna:{n.get('taxon','unspecified')}:{old.split(':',1)[1]}"
 mapping[old]=nid
 candidates={k:n[k] for k in ['uniprot_id','pdb_structures','primary_pdb'] if n.get(k)} if typ=='protein' else {}
 row={'node_id':nid,'type':typ,'rna_type':sub,'roles':'|'.join(roles),'name':n['name'],'symbol':n.get('symbol') or (old.split(':',1)[1] if old.startswith('HGNC:') else ''),
      'taxon':n.get('taxon',''),'compartment':n.get('compartment',''),'aliases':'|'.join(n.get('aliases',[])),
      'legacy_ids':old if nid!=old else '', 'physiological_pillar':n.get('physiological_pillar',''),'identity_status':'legacy_identity_pending_registry_mapping',
      'structure_candidates':json.dumps(candidates),'annotation_status':'core_legacy_annotations_unverified; generated_enrichment_quarantined'}
 ns.append(row)
 if nid!=old:log('node',nid,old+' -> '+nid,'Explicit molecule identity; not an official registry accession. No invented DNA gene nodes.')
(d/'identifier_map.json').write_text(json.dumps(mapping,indent=2))
# Record actual registry titles, rather than hard-coded citation titles from legacy scripts.
raw=ROOT/'data/raw/provenance';records=json.loads((raw/'europepmc_records.json').read_text())['resultList']['result'];lookup={}
for r in records:
 if r.get('pmid'):lookup['PMID:'+r['pmid']]=r
 if r.get('doi'):lookup['DOI:'+r['doi'].lower()]=r
retrieval=json.loads((raw/'retrieval.json').read_text());sources=[]
relevant={'38200114','39120025','16061724','15711558','23225151','39271775','40500265'}
ambiguous={'24497523','20093358','16886064','30689953','28623696','29706539'}
for ref in retrieval['requested_refs']:
 r=lookup.get(ref if ref.startswith('PMID:') else ref.lower().replace('doi:','DOI:',1));pmid=r.get('pmid','') if r else ''
 status='not_resolved' if not r else 'relevant_paper_claim_pending' if pmid in relevant else 'claim_match_pending' if pmid in ambiguous else 'citation_topic_mismatch'
 sources.append({'source_id':ref,'title':r.get('title','') if r else '', 'doi':r.get('doi','') if r else '', 'pmid':pmid,'pmcid':r.get('pmcid','') if r else '',
                 'publication_types':'|'.join(r.get('pubTypeList',{}).get('pubType',[])) if r else '', 'resolution_status':'resolved' if r else 'not_resolved',
                 'claim_match_status':status,'url':f'https://pubmed.ncbi.nlm.nih.gov/{pmid}/' if pmid else '',
                 'retrieved_at':retrieval['retrieved_at'],'raw_file':'data/raw/provenance/europepmc_records.json','raw_sha256':retrieval['sha256']})
source_map={s['source_id']:s for s in sources}
experiments=read('experiments',ROOT)
for exp in experiments:
 ref=exp['paper_id'];sr=source_map.get(ref,{})
 exp['verification_status']='quarantined' if sr.get('claim_match_status') in ['citation_topic_mismatch','not_resolved'] else 'pending_passage_review'
 exp['review_note']='Original assay/dose/effect fields are legacy assertions, not verified measurements. See source_records.csv for actual citation title.'
 if exp['experiment_id']=='exp:stegen_01':
  exp['verification_status']='quarantined';exp['review_note']='Wrong experiment citation: Figure 2b is bone volume; this paper uses NCT-503, not the asserted CBR-5884 assay. Original values preserved in archive.'
  for k in ['treatment','dose','duration','endpoint','assay','measured_effect','viability','figure_or_table']:exp[k]=''
 log('experiment',exp['experiment_id'],exp['verification_status'],exp['review_note'])
exps={e['experiment_id']:e for e in experiments};contexts=read('contexts',ROOT);ctxids={c['context_id'] for c in contexts}
for c in contexts:c['verification_status']='legacy_context_pending_source_review'
edges=read('edges',ROOT);evs=[]
def refs(text):return list(dict.fromkeys(re.findall(r'(?:PMID:\d+|DOI:10\.[^\s;]+)',text)))
for edge in edges:
 eid=edge['edge_id'];old=old_ev[eid];ev=old.get('evidence',{});edge['source_id']=mapping[edge['source_id']];edge['target_id']=mapping[edge['target_id']]
 edge['review_note']='Legacy claim; source registry resolution does not verify its mechanism, sign or experimental context.'
 if edge['context_id'] not in ctxids:
  log('edge',eid,'context_id cleared: '+edge['context_id'],'Unresolved placeholder; no cell/stage context inferred.');edge['context_id']=''
  if edge['source_db'].lower()=='string' or eid.startswith('EDGE_STR'):
   edge['relation']='ASSOCIATED_WITH';edge['sign']='0';edge['review_note']='STRING-only claim downgraded to unsigned association; raw supporting interaction record absent.'
 edge['context_status']='pending' if edge['context_id'] else 'not_recorded'
 edge_refs=refs(edge['source_record_id'])
 exp_ids=[s.strip() for s in ev.get('experiment_id','').split(';') if s.strip()] or ['']
 for exp_id in exp_ids:
  missing=bool(exp_id and exp_id not in exps)
  if missing:log('evidence',eid,'experiment_id cleared: '+exp_id,'Unresolved placeholder; retained in legacy_experiment_id.')
  exp=exps.get(exp_id);ref=exp['paper_id'] if exp else (edge_refs[0] if len(edge_refs)==1 else '')
  agreement=not exp or not edge_refs or ref in edge_refs
  mismatch=source_map.get(ref,{}).get('claim_match_status') in ['citation_topic_mismatch','not_resolved']
  status='quarantined' if mismatch or exp and exp['verification_status']=='quarantined' or not agreement else 'pending'
  evs.append({'evidence_id':f'ev:{len(evs)+1:04d}','edge_id':eid,'experiment_id':exp_id if exp else '',
              'source_id':ref if ref in source_map else '', 'quote_or_location':'','claim_summary':re.sub(r'\s*\[Confirmed by STRING[^\]]*\]','',ev.get('quote_or_description','')).strip(),
              'passage_status':'missing','source_location':'','source_url':'','source_sha256':'',
              'evidence_kind':ev.get('kind','association').split(';')[0].strip(),'polarity':ev.get('polarity','support'),
              'curator_status':status,'reviewed_at':'','review_note':'Source/experiment disagreement.' if not agreement else 'Recovered legacy narrative is a claim summary, not a source quotation. Exact source passage not yet verified.',
              'legacy_experiment_id':exp_id if missing else '', 'legacy_source_records':edge['source_record_id']})
 related=[e for e in evs if e['edge_id']==eid]
 edge['status']='quarantined' if all(e['curator_status']=='quarantined' for e in related) else 'proposed'
# Narrow claim-level re-curation from retrieved primary papers. No unsupported doses/effect sizes.
corrections=[
 ('edge:0034','PMID:38200114','PMC10822776','Fig3','Figure 3i; Extended Data Figure 4e',
  'PHGDH loss or pharmacological inhibition reduced intracellular alpha-ketoglutarate in osteoclast cultures. The paper attributes production to downstream PSAT1; this is an indirect pathway effect, not PHGDH catalysis.'),
 ('edge:0039','PMID:39120025','PMC11516099',None,'Abstract; mechanistic claim, not an extracted quantitative assay',
  'PRMT6 deficiency reduced H3R2 asymmetric dimethylation at fatty-acid-oxidation gene promoters, including Ppard, Acox3 and Cpt1a.'),
 ('edge:0047','DOI:10.1038/s41413-025-00437-w','PMC12159140',None,'Abstract; Results: ITA inhibits Tet2 to suppress osteoclast-associated genes',
  'The study reports itaconate-mediated inhibition of Tet2 activity and suppression of excessive osteoclast activation. OI derivative experiments must not be treated as interchangeable dose measurements for itaconate.')]
for eid,ref,pmc,anchor,loc,summary in corrections:
 path=raw/(pmc+'.xml');sha=hashlib.sha256(path.read_bytes()).hexdigest()
 evs.append({'evidence_id':f'ev:{len(evs)+1:04d}','edge_id':eid,'experiment_id':'','source_id':ref,'quote_or_location':summary,'claim_summary':summary,
             'passage_status':'source_checked_paraphrase','source_location':loc,'source_url':f'https://pmc.ncbi.nlm.nih.gov/articles/{pmc}/'+('#'+anchor if anchor else ''),
             'source_sha256':sha,'evidence_kind':'perturbation','polarity':'support','curator_status':'reviewed','reviewed_at':'2026-09-29',
             'review_note':'Qualitative claim reviewed against retrieved primary text. Original experiment fields and precise context remain unverified; not model eligible.',
             'legacy_experiment_id':'','legacy_source_records':''})
 log('evidence',eid,'Added source-checked qualitative paraphrase',loc)
for edge in edges:
 if edge['edge_id'] in ['edge:0034','edge:0039','edge:0047']:
  edge['status']='proposed';edge['review_note']='Qualitative source support checked; experimental context pending.'
for exp in experiments:
 for k in ['dose','duration','measured_effect','viability','figure_or_table']:exp[k]=''
 exp['legacy_record_path']='data/quarantine/legacy_snapshot.zip:data/processed/experiments.csv#'+exp['experiment_id']
for edge in edges:
 edge['legacy_source_record_id']=edge['source_record_id']
 edge['source_record_id']='; '.join(x for x in refs(edge['source_record_id']) if x in source_map)
for name,rows in [('nodes',ns),('edges',edges),('contexts',contexts),('experiments',experiments),('edge_evidence',evs),('source_records',sources)]:write(name,rows,ROOT)
write('audit_changes',audit,ROOT)
(q/'README.md').write_text('Legacy snapshot is unverified historical material, excluded from current exports and scoring. The archive preserves original IDs, fabricated/enriched annotations, unsupported quantitative assertions and pre-migration exports for audit. Do not re-import it as evidence.\n',encoding='utf-8')
summary={'nodes':len(ns),'edges':len(edges),'evidence_rows':len(evs),'source_records':len(sources),'source_statuses':dict(Counter(s['claim_match_status'] for s in sources)),
 'experiment_statuses':dict(Counter(e['verification_status'] for e in experiments)),'evidence_statuses':dict(Counter(e['curator_status'] for e in evs)),
 'node_types':dict(Counter(n['type'] for n in ns)),'rna_types':dict(Counter(n['rna_type'] for n in ns if n['type']=='rna'))}
(ROOT/'reports/repair_summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
