"""Build both browser explorers from one KG snapshot; no third-party dependencies.

Run from the repository root: python src/visualization/build_viewers.py
Legacy generate_web_app.py and build_3d_conformation_explorer.py create the old UI.
"""
import json
from pathlib import Path

def build(root=None):
    root = Path(root) if root else Path(__file__).resolve().parents[2]
    templates = Path(__file__).resolve().parent / 'templates'
    graph = json.loads((root / 'data/processed/osteoclast_knowledge_graph.json').read_text(encoding='utf-8'))
    ids = {n['id'] for n in graph['nodes']}
    if len(ids) != len(graph['nodes']):
        raise ValueError('Duplicate node IDs')
    if any(e['source'] not in ids or e['target'] not in ids for e in graph['edges']):
        raise ValueError('Graph edges reference missing nodes')
    assets = root / 'assets'
    assets.mkdir(exist_ok=True)
    payload = json.dumps(graph, ensure_ascii=True, separators=(',', ':')).replace('<', '\\u003c')
    (assets / 'research-data.js').write_text('window.OC_GRAPH = ' + payload + ';\n', encoding='utf-8')
    for name in ['research-viewer.css', 'research-viewer.js']:
        (assets / name).write_text((templates / name).read_text(encoding='utf-8'), encoding='utf-8')
    template = (templates / 'viewer.html').read_text(encoding='utf-8')
    for name, mode, title in [('index.html', 'graph', 'Pathway explorer'), ('osteoclast_3d_conformation_explorer.html', 'structure', 'Structure explorer')]:
        (root / name).write_text(template.replace('__MODE__', mode).replace('__TITLE__', title), encoding='utf-8')
    print(f'Built both explorers: {len(ids)} entities, {len(graph["edges"])} relationships')

if __name__ == '__main__':
    build()
