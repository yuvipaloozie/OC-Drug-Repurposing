"""Rebuild all supported exports from the audited CSV tables. No enrichment/network calls."""
import csv
import json
import hashlib
from collections import Counter, defaultdict
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

def read(name, root=ROOT):
    with (root/'data/processed'/f'{name}.csv').open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def write(name, rows, root=ROOT, fields=None):
    fields = fields or list(dict.fromkeys(k for row in rows for k in row))
    with (root/'data/processed'/f'{name}.csv').open('w', encoding='utf-8', newline='') as f:
        w=csv.DictWriter(f, fieldnames=fields,lineterminator='\n');w.writeheader();w.writerows(rows)

def rebuild(root=ROOT):
    root=Path(root)
    from src.kg.verify_kg import run_verification
    check=run_verification(str(root/'data/processed'))
    if check['errors']: raise ValueError('\n'.join(check['errors']))
    tables={name:read(name,root) for name in ['nodes','edges','contexts','experiments','edge_evidence','source_records']}
    evidence=defaultdict(list)
    for row in tables['edge_evidence']:evidence[row['edge_id']].append(row)
    nodes=[]
    for row in tables['nodes']:
        n=dict(row);n['id']=n.pop('node_id')
        for k in ['aliases','roles','legacy_ids']:n[k]=[s.strip() for s in n.get(k,'').split('|') if s.strip()]
        n['structure_candidates']=json.loads(n.get('structure_candidates') or '{}')
        nodes.append(n)
    edges=[]
    for row in tables['edges']:
        e=dict(row);e['source']=e.pop('source_id');e['target']=e.pop('target_id');e['sign']=int(e['sign'])
        e['evidence']=evidence[e['edge_id']];e['context_id']=e['context_id'] or None
        edges.append(e)
    payload={'metadata':{'version':'3.0.0','description':'Audited claim inventory; review status is separate from registry resolution. Pending and quarantined claims are not validated facts.',
                         'statistics':{'total_nodes':len(nodes),'total_edges':len(edges),'node_types':dict(Counter(n['type'] for n in nodes))}},
             'nodes':nodes,'edges':edges,'contexts':tables['contexts'],'experiments':tables['experiments'],'sources':tables['source_records']}
    text=json.dumps(payload,ensure_ascii=False,indent=2)+'\n'
    for p in [root/'data/processed/osteoclast_knowledge_graph.json',root/'neo4j/osteoclast_knowledge_graph.json']:p.write_text(text,encoding='utf-8')
    (root/'data/processed/biological_nodes_inventory.json').write_text(json.dumps(nodes,indent=2),encoding='utf-8')
    # A single row per evidence record: no flattening/loss of multiple experiments.
    sources={s['source_id']:s for s in tables['source_records']}
    ledger=[{**ev,'article':sources.get(ev['source_id'],{}).get('title',''),'doi':sources.get(ev['source_id'],{}).get('doi',''),
             'source_resolution':sources.get(ev['source_id'],{}).get('resolution_status','')} for ev in tables['edge_evidence']]
    write('sources',ledger,root)
    source_text=(root/'data/processed/sources.csv').read_bytes()
    for p in ['sources.csv','neo4j/sources.csv','neo4j/sources_curated.csv']:(root/p).write_bytes(source_text)
    # Workbook reflects the canonical tables, including missingness and review status.
    from src.enrichment.build_master_xlsx_workbook import create_master_xlsx
    tabs=[{'name':'Read me','headers':['Scope','Meaning'],'rows':[
        ['Structural validation', 'Checks IDs, foreign keys, types and export consistency; does not certify biological truth.'],
        ['Evidence', 'Only reviewed entries with verified passage locations can be evidence eligible.'],
        ['Pending/quarantined', 'Visible for curation; excluded from default mechanism scoring.'],
        ['Archive','Original values and enrichment are preserved in data/quarantine/legacy_snapshot.zip.']]}]
    for name,rows in tables.items():
        fields=list(rows[0]) if rows else []
        tabs.append({'name':name,'headers':fields,'rows':[[row.get(k,'') for k in fields] for row in rows]})
    xlsx=root/'data/processed/osteoclast_knowledge_graph_sources.xlsx';create_master_xlsx(xlsx,tabs)
    (root/'neo4j'/xlsx.name).write_bytes(xlsx.read_bytes())
    export_neo4j(payload,root)
    import importlib.util
    spec=importlib.util.spec_from_file_location('viewer_build',root/'src/visualization/build_viewers.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);module.build(root)
    outputs=['index.html','osteoclast_3d_conformation_explorer.html','sources.csv']
    files=[p for base in ['data/processed','data/raw/provenance','data/quarantine','neo4j','assets','schemas'] for p in (root/base).rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    files += [root/p for p in outputs]
    manifest={'manifest_version':'3.0.0','note':'Hashes describe local files; original source claims are archived, not certified.',
              'files':{str(p.relative_to(root)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(set(files))}}
    (root/'data/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print(f"Rebuilt {len(nodes)} entities, {len(edges)} claims, {len(ledger)} evidence records")

def export_neo4j(g,root):
    # All IDs/properties are serialized, not concatenated as executable user text.
    def props(row):return '{'+', '.join(k+': '+json.dumps(v,ensure_ascii=True) for k,v in row.items() if v is not None)+'}'
    lines=['// Audited v3 import. Use an empty database or the loader --reset option; legacy nodes are not deleted automatically.',
           'CREATE CONSTRAINT oc_id IF NOT EXISTS FOR (n:Node) REQUIRE n.id IS UNIQUE;',
           'CREATE CONSTRAINT oc_ev_id IF NOT EXISTS FOR (n:Evidence) REQUIRE n.evidence_id IS UNIQUE;',
           'CREATE CONSTRAINT oc_source_id IF NOT EXISTS FOR (n:Source) REQUIRE n.source_id IS UNIQUE;']
    labels={'protein':'Protein','rna':'RNA','gene':'Gene','reaction':'Reaction','pathway':'Pathway','intracellular_compound':'IntracellularCompound','extracellular_compound':'ExtracellularCompound'}
    for n in g['nodes']:
        row={k:v for k,v in n.items() if k!='structure_candidates'};row['structure_candidates_json']=json.dumps(n['structure_candidates'])
        extra=':Enzyme' if 'enzyme' in n['roles'] else ':TranscriptionFactor' if 'transcription_factor' in n['roles'] else ''
        lines.append(f"MERGE (n:Node:{labels[n['type']]}{extra} {{id: {json.dumps(n['id'])}}}) SET n = {props(row)};")
    for collection,label,key in [('sources','Source','source_id'),('contexts','Context','context_id'),('experiments','Experiment','experiment_id')]:
        for row in g[collection]:lines.append(f'MERGE (n:{label} {{{key}: {json.dumps(row[key])}}}) SET n = {props(row)};')
    for e in g['edges']:
        row={k:v for k,v in e.items() if k not in ['source','target','evidence']}
        lines.append(f"MATCH (s:Node {{id: {json.dumps(e['source'])}}}), (t:Node {{id: {json.dumps(e['target'])}}}) MERGE (s)-[r:{e['relation']} {{edge_id: {json.dumps(e['edge_id'])}}}]->(t) SET r = {props(row)};")
        lines.append(f"MERGE (c:Claim {{edge_id: {json.dumps(e['edge_id'])}}}) SET c = {props(row)};")
        lines.append(f"MATCH (s:Node {{id: {json.dumps(e['source'])}}}), (t:Node {{id: {json.dumps(e['target'])}}}), (c:Claim {{edge_id: {json.dumps(e['edge_id'])}}}) MERGE (c)-[:SUBJECT]->(s) MERGE (c)-[:OBJECT]->(t);")
        if e['context_id']:
            lines.append(f"MATCH (c:Claim {{edge_id: {json.dumps(e['edge_id'])}}}), (x:Context {{context_id: {json.dumps(e['context_id'])}}}) MERGE (c)-[:IN_CONTEXT]->(x);")
        for ev in e['evidence']:
            lines.append(f"MERGE (v:Evidence {{evidence_id: {json.dumps(ev['evidence_id'])}}}) SET v = {props(ev)};")
            lines.append(f"MATCH (v:Evidence {{evidence_id: {json.dumps(ev['evidence_id'])}}}), (c:Claim {{edge_id: {json.dumps(e['edge_id'])}}}) MERGE (v)-[:EVIDENCE_FOR]->(c);")
            for key,label in [('source_id','Source'),('experiment_id','Experiment')]:
                if ev[key]:lines.append(f"MATCH (v:Evidence {{evidence_id: {json.dumps(ev['evidence_id'])}}}), (n:{label} {{{key}: {json.dumps(ev[key])}}}) MERGE (v)-[:CITES]->(n);")
    (root/'neo4j/import_osteoclast_kg.cypher').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    for name in ['enrich_nodes','deduplicate_edges','remove_drug_nodes']:
        (root/'neo4j'/f'{name}.cypher').write_text('// Retired: do not alter audited claims with legacy enrichment or deduplication.\nRETURN "Use python -m src.kg.rebuild and import into a clean database" AS instruction;\n',encoding='utf-8')
    (root/'neo4j/sample_queries.cypher').write_text('MATCH (n:Protein) RETURN n LIMIT 100;\nMATCH (n:RNA) RETURN n;\nMATCH (s)-[r]->(t) WHERE r.status = "curated" RETURN s,r,t;\nMATCH (v:Evidence) WHERE v.curator_status <> "reviewed" RETURN v LIMIT 100;\n',encoding='utf-8')
    (root/'neo4j/style.grass').write_text('node { caption: "{name}"; color: #edf2f5; }\nnode.Protein { color: #e7f2eb; }\nnode.RNA { color: #fff0db; }\nnode.Gene { color: #fbe8df; }\nnode.IntracellularCompound { color: #eee9f8; }\nnode.Pathway { color: #e1f2f3; }\n',encoding='utf-8')

if __name__=='__main__':rebuild()
