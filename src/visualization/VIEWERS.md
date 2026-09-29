# Browser explorers

Run `python -m http.server 8765 --bind 127.0.0.1` from the repository root, then open http://127.0.0.1:8765/. Neo4j is not needed.

- `index.html`: pathway explorer. Search names, aliases or identifiers; explore the whole graph, or select an entity in the left list to open its complete one-hop neighborhood with an animated layout. Drag nodes to rearrange them, drag the background to pan, and double-click a node to explore its neighborhood. Keyboard users can press Enter to inspect, Shift+Enter to explore, and arrow keys to move a focused node. Selecting an entity preserves the graph positions and camera. A deterministic force layout spaces connected entities with rectangular collision avoidance. The details panel exposes the full entity schema and connection list. SVG nodes support keyboard selection, pan, zoom, fit and readable-size controls. Edge colors indicate the recorded sign, not independent validation of causality.
- `osteoclast_3d_conformation_explorer.html`: structure explorer. Choose a target, then load an AlphaFold predicted model or a PDB experimental structure. Downloads use the selected identifier, and failure/missing states never substitute another protein. Models are drawn directly with 3Dmol.js. AlphaFold species and description are read from the live source; graph species remains separately displayed. Identifier syntax alone does not validate entity identity.

Both pages are generated from `data/processed/osteoclast_knowledge_graph.json`. They do not use the older HTML pages' embedded snapshots. Edit `src/visualization/templates/` and run:

```powershell
python src/visualization/build_viewers.py
```

This writes the two HTML shells and `assets/research-{data,viewer}.js` plus `assets/research-viewer.css`. Keep the assets directory beside the HTML files. The graph uses local assets and works without a database or a network request. Online structure downloads require network access and WebGL. No package installation is required to rebuild.

The older `src/kg/generate_web_app.py` and `src/visualization/build_3d_conformation_explorer.py` generate the prior interfaces; use the new builder to retain this design. Re-run the new builder after a pipeline that invokes a legacy generator.

## Third-party renderer

`assets/vendor/3Dmol-min.js` was retrieved from https://3dmol.org/build/3Dmol-min.js on 2026-09-29. SHA-256: `4ab374e1830bccec950b280fd285a430e05e91bd13c9ef0097c611c66de6cb36`. Its license is stored alongside it in `3Dmol-LICENSE.txt`. API reference: https://3dmol.org/doc/GLViewer.html. No runtime CDN script is required.

## Research limitations

The UI redesign does not validate the biological evidence, repair the KG, or train a predictor. It preserves the source snapshot and exposes additional annotations separately. Some existing repository annotations are generated or unverified; see the project review before using them in research conclusions.

## Audited schema v3

Node type is separate from protein roles and RNA subtype. Old node URLs resolve through legacy aliases. Every connection exposes all evidence records, their actual source titles and review status. Legacy narratives are labeled unverified; structure identifiers are candidate mappings only. Full-network positions are spread 3.6x horizontally and 1.55x vertically with pastel type/role fills. Rebuild the whole repository with `python -m src.kg.rebuild` after canonical data edits.


### Reference-inspired visual refresh
Both explorers share white panels, soft rounded interactive surfaces, fine dividers, and a teal/green/coral/gold category palette. Square markers identify categories; pale rounded node cards preserve graph readability. Entity fields use a bordered cell grid. System sans-serif typography keeps the viewer usable offline. Neighborhood animation refits after settling to prevent a resize during animation from leaving nodes clipped.
