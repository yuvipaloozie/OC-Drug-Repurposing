# Scientific viewer

The two existing HTML entry points now load this React workbench. The compiled files in `../assets/workbench` are distributed with the repository, so viewing does not require Node or npm. Serve the repository using its existing Python HTTP server.

## Development

Requires Node 22.18+ (or Node 24) and npm.

```powershell
cd viewer
npm ci
npm run build
npm test
```

`npm run build` type-checks the frontend and replaces only `assets/workbench/`. It does not read or write FDA inputs, evaluation labels, or canonical biological data. `assets/research-data.js` remains the data interface maintained by the Python pipeline. The existing Python viewer builder uses `src/visualization/templates/viewer.html`, so data rebuilds retain the new interface. The previous HTML template is preserved in `legacy-viewer.html`; its JavaScript and CSS remain untouched.

## Interaction

- Graph, Structure and Split share entity selection. Switching views retains the graph layout and loaded model.
- Select a node to inspect; double-click or Shift+Enter to explore its neighborhood. Drag nodes or the background; arrow keys move a focused node.
- Select a relationship to inspect each evidence record, source, experiment and context. Evidence filtering keeps the node layout. Species filters use recorded claim context, including an explicit unknown option.
- Ctrl/Cmd+K opens entity and alias search. Entity rows distinguish species and molecular form.
- Networks above 30 entities show the selected entity's connections by default; choose All relationships to display every edge. All entities remain available. Large layouts run in a background worker and the last 12 layouts are cached for navigation; evidence filters retain geometry.
- Resize or collapse side panels. Small screens use dialog panels.
- Protein and compound representations, chain selection, ligand visibility, graph SVG and structure PNG export are available where applicable.

Repeated instructional/disclaimer paragraphs have been removed. Scientific source passages and record-specific qualifications are preserved in the evidence inspector and expandable record details.

The 21st.dev contribution is a design-pattern adaptation, not copied gated code. See THIRD_PARTY.md.
