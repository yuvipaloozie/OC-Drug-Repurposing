"""
Generates the interactive, self-contained HTML5 web application
for exploring the Osteoclast Mechanism Knowledge Graph.
Designed specifically for pharmacology researchers and drug repurposing scientists.
"""

import os
import csv
import json


def build_app(data_dir: str, output_paths: list):
    # 1. Load CSVs
    def read_csv(filename):
        with open(os.path.join(data_dir, filename), "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    nodes = read_csv("nodes.csv")
    edges = read_csv("edges.csv")
    experiments = read_csv("experiments.csv")
    evidence = read_csv("edge_evidence.csv")
    contexts = read_csv("contexts.csv")

    # Index experiments by exp_id
    exp_map = {e["experiment_id"]: e for e in experiments}
    # Index evidence by edge_id
    ev_map = {}
    for ev in evidence:
        eid = ev["edge_id"]
        if eid not in ev_map:
            ev_map[eid] = []
        # attach experiment info if available
        exp_info = exp_map.get(ev["experiment_id"], {})
        ev_combined = dict(ev)
        if exp_info:
            ev_combined["paper_id"] = exp_info.get("paper_id", "")
            ev_combined["cell_type"] = exp_info.get("cell_type", "")
            ev_combined["treatment"] = exp_info.get("treatment", "")
            ev_combined["dose"] = exp_info.get("dose", "")
            ev_combined["figure_or_table"] = exp_info.get("figure_or_table", "")
            ev_combined["endpoint"] = exp_info.get("endpoint", "")
        ev_map[eid].append(ev_combined)

    # Attach evidence to edges
    for edge in edges:
        edge["evidence"] = ev_map.get(edge["edge_id"], [])

    kg_payload = {
        "nodes": nodes,
        "edges": edges,
        "experiments": experiments,
        "contexts": contexts,
    }

    kg_json = json.dumps(kg_payload, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Osteoclast Differentiation & Metabolism Knowledge Graph</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    /* Custom styling for nodes and graph */
    .custom-scrollbar::-webkit-scrollbar {{
      width: 6px;
      height: 6px;
    }}
    .custom-scrollbar::-webkit-scrollbar-track {{
      background: rgba(0, 0, 0, 0.05);
    }}
    .custom-scrollbar::-webkit-scrollbar-thumb {{
      background: rgba(100, 116, 139, 0.4);
      border-radius: 3px;
    }}
    canvas {{
      cursor: grab;
    }}
    canvas:active {{
      cursor: grabbing;
    }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased overflow-hidden">

  <!-- Header Navbar -->
  <header class="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-20 shrink-0">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
        OC
      </div>
      <div>
        <h1 class="text-base font-bold text-slate-100 flex items-center space-x-2">
          <span>Osteoclast Mechanism Knowledge Graph</span>
          <span class="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">v1.0 (K0.3)</span>
        </h1>
        <p class="text-xs text-slate-400">RANKL Differentiation Pathway, Multiomics, Epigenetics & Drug Repurposing</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="hidden lg:flex items-center space-x-6 text-xs text-slate-400">
      <div class="flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>Nodes: <strong class="text-slate-200" id="stat-nodes">0</strong></span>
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span>Signed Edges: <strong class="text-slate-200" id="stat-edges">0</strong></span>
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span>Experiments: <strong class="text-slate-200" id="stat-exps">0</strong></span>
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-purple-400"></span>
        <span>Cell Systems: <strong class="text-slate-200">mouse BMM / RAW 264.7</strong></span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center space-x-3">
      <button id="btn-reset-view" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition">
        Reset Camera
      </button>
      <button id="btn-export-csv" class="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium shadow-sm transition">
        Export Targets CSV
      </button>
    </div>
  </header>

  <!-- Main Work Area -->
  <div class="flex-1 flex overflow-hidden relative">

    <!-- Left Sidebar: Modules & Target Selector -->
    <aside class="w-80 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 z-10">
      
      <!-- Search Input -->
      <div class="p-3 border-b border-slate-800">
        <div class="relative">
          <input type="text" id="target-search" placeholder="Search gene, enzyme, drug, metabolite..."
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500">
        </div>
      </div>

      <!-- Biological Module Filter Tabs -->
      <div class="p-3 border-b border-slate-800 bg-slate-900/50">
        <label class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block mb-1.5">Biological Subsystem</label>
        <select id="module-filter" class="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
          <option value="all">All Biological Modules (Full KG)</option>
          <option value="glycolysis">1. Glycolytic Shift (HK2, PFKFB3, PKM, LDHA)</option>
          <option value="tca">2. TCA Cycle & Anaplerosis (PHGDH, GLS, aKG)</option>
          <option value="epigenetics">3. Epigenetic Checkpoints (KDM6B, PRMT6, TET2)</option>
          <option value="signaling">4. RANKL-RANK-TRAF6 & ITAM Signaling</option>
          <option value="fusion">5. Syncytium Fusion (DC-STAMP, OC-STAMP, d2)</option>
          <option value="cytoskeleton">6. Actin Ring & Sealing Zone (Src, Vav3, Rac1)</option>
          <option value="resorption">7. Proton Pump & Acidified Lacuna (TCIRG1, CTSK)</option>
          <option value="brakes">8. Molecular Brakes (IRF8, Blimp1, BCL6, Gna13)</option>
          <option value="drugs">9. Repurposable Therapeutics & Controls</option>
        </select>
      </div>

      <!-- Target Node List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1" id="node-list-container">
        <!-- Rendered by JS -->
      </div>

      <!-- Legend -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/70 text-[11px] space-y-1.5">
        <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Entity Color Legend</div>
        <div class="grid grid-cols-2 gap-1.5">
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-emerald-500"></span><span>Drug / Probe</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-indigo-500"></span><span>Protein / Enzyme</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-amber-500"></span><span>Metabolite</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-purple-500"></span><span>Chromatin Event</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-rose-500"></span><span>Phenotype</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded bg-cyan-500"></span><span>Cell Structure</span></div>
        </div>
      </div>
    </aside>

    <!-- Center: Interactive Graph Canvas -->
    <main class="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
      
      <!-- Graph Canvas Container -->
      <div class="flex-1 relative" id="canvas-container">
        <canvas id="kg-canvas" class="w-full h-full absolute inset-0 block"></canvas>
        
        <!-- Controls Overlay -->
        <div class="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-sm pointer-events-auto space-y-1">
          <div class="font-semibold text-slate-200">Interactive Controls:</div>
          <div>• <strong>Click Node:</strong> Inspect target dossier & audit trail</div>
          <div>• <strong>Drag Canvas:</strong> Pan view</div>
          <div>• <strong>Scroll Wheel:</strong> Zoom in / out</div>
          <div>• <strong>Drag Node:</strong> Reposition in 2D space</div>
        </div>

        <!-- Path Highlight Status -->
        <div id="path-status-badge" class="hidden absolute top-4 right-4 bg-indigo-900/90 border border-indigo-700 rounded-lg px-3 py-2 text-xs text-indigo-200 shadow-xl backdrop-blur-sm flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span id="path-status-text">Tracing mechanism path...</span>
          <button id="btn-clear-path" class="ml-2 text-indigo-300 hover:text-white underline font-semibold text-[11px]">Clear</button>
        </div>
      </div>

      <!-- Bottom Panel: Differentiation Stages Timeline -->
      <div class="h-28 bg-slate-900/90 border-t border-slate-800 p-3 shrink-0 flex flex-col justify-between z-10">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Osteoclast Differentiation Stage Progression (Mouse BMM / RAW 264.7)</span>
          <span class="text-slate-500 text-[11px]">Click a stage to highlight active targets</span>
        </div>
        <div class="grid grid-cols-5 gap-2 my-1">
          <button class="stage-btn bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded p-1.5 text-left transition" data-stage="STAGE:monocyte_BMM_precursor">
            <div class="text-[10px] text-slate-400 font-mono">Stage 0</div>
            <div class="text-xs font-semibold text-slate-200 truncate">BMM Precursor</div>
            <div class="text-[10px] text-slate-500 truncate">PU.1, CSF1R (c-Fms)</div>
          </button>
          <button class="stage-btn bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded p-1.5 text-left transition" data-stage="STAGE:early_mononuclear_pre_osteoclast">
            <div class="text-[10px] text-indigo-400 font-mono">Day 1 post-RANKL</div>
            <div class="text-xs font-semibold text-slate-200 truncate">Early Pre-osteoclast</div>
            <div class="text-[10px] text-slate-500 truncate">TRAF6, c-Fos, Glycolysis</div>
          </button>
          <button class="stage-btn bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded p-1.5 text-left transition" data-stage="STAGE:committed_mononuclear_TRAP_pos">
            <div class="text-[10px] text-cyan-400 font-mono">Day 3 post-RANKL</div>
            <div class="text-xs font-semibold text-slate-200 truncate">Committed TRAP+</div>
            <div class="text-[10px] text-slate-500 truncate">NFATc1 auto-amp, DC-STAMP</div>
          </button>
          <button class="stage-btn bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded p-1.5 text-left transition" data-stage="STAGE:syncytium_prefusion_polykaryon">
            <div class="text-[10px] text-amber-400 font-mono">Day 4 post-RANKL</div>
            <div class="text-xs font-semibold text-slate-200 truncate">Syncytium Polykaryon</div>
            <div class="text-[10px] text-slate-500 truncate">Membrane fusion, d2, SNX10</div>
          </button>
          <button class="stage-btn bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded p-1.5 text-left transition" data-stage="STAGE:mature_resorbing_osteoclast">
            <div class="text-[10px] text-rose-400 font-mono">Day 5 post-RANKL</div>
            <div class="text-xs font-semibold text-slate-200 truncate">Mature Resorbing OC</div>
            <div class="text-[10px] text-slate-500 truncate">Sealing zone, TCIRG1, CTSK</div>
          </button>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Target Dossier & Pharmacological Evidence -->
    <aside class="w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-10 overflow-hidden" id="dossier-panel">
      
      <!-- Panel Header -->
      <div class="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase tracking-wider font-semibold text-indigo-400" id="dossier-badge">Target Profile</span>
          <h2 class="text-base font-bold text-slate-100" id="dossier-title">Select a Node to Inspect</h2>
        </div>
        <span class="text-xs font-mono text-slate-400" id="dossier-id"></span>
      </div>

      <!-- Dossier Content Scrollable -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" id="dossier-body">
        
        <!-- Default Empty State -->
        <div class="text-center py-12 text-slate-500 text-xs">
          <svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p>Click any node in the graph or target list to view its pharmacological profile, mechanism connections, and verifiable literature audit trail.</p>
        </div>

      </div>

    </aside>

  </div>

  <script>
    // Embedded Knowledge Graph Payload
    const KG_DATA = {kg_json};

    // Color definitions
    const TYPE_COLORS = {{
      'drug': '#10b981',             // emerald
      'protein': '#6366f1',          // indigo
      'gene': '#818cf8',             // lighter indigo
      'metabolite': '#f59e0b',        // amber
      'chromatin_event': '#a855f7',   // purple
      'phenotype': '#f43f5e',         // rose
      'cellular_structure': '#06b6d4',// cyan
      'differentiation_stage': '#38bdf8', // sky
      'mirna': '#ec4899',            // pink
      'mrna': '#93c5fd'              // light blue
    }};

    // State
    let state = {{
      nodes: [],
      edges: [],
      selectedNode: null,
      highlightedNodes: new Set(),
      highlightedEdges: new Set(),
      filterModule: 'all',
      searchQuery: '',
      scale: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      draggedNode: null
    }};

    const canvas = document.getElementById('kg-canvas');
    const ctx = canvas.getContext('2d');

    // Initialize graph coordinates
    function initGraph() {{
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      state.nodes = KG_DATA.nodes.map((n, i) => {{
        // Distribute loosely in layers
        let x = width * 0.5 + (Math.random() - 0.5) * width * 0.7;
        let y = height * 0.5 + (Math.random() - 0.5) * height * 0.7;

        // Custom coordinates based on biological type
        if (n.type === 'drug') {{
          x = width * 0.15 + (Math.random() - 0.5) * 80;
        }} else if (n.type === 'phenotype') {{
          x = width * 0.88 + (Math.random() - 0.5) * 60;
        }} else if (n.type === 'metabolite') {{
          y = height * 0.25 + (Math.random() - 0.5) * 120;
        }} else if (n.type === 'cellular_structure') {{
          y = height * 0.75 + (Math.random() - 0.5) * 100;
        }}

        return {{
          ...n,
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          radius: n.type === 'phenotype' ? 14 : (n.type === 'drug' ? 12 : 9)
        }};
      }});

      state.edges = KG_DATA.edges.map(e => ({{ ...e }}));

      // Update counters
      document.getElementById('stat-nodes').textContent = state.nodes.length;
      document.getElementById('stat-edges').textContent = state.edges.length;
      document.getElementById('stat-exps').textContent = KG_DATA.experiments.length;

      // Render node list
      renderNodeList();

      // Run simulation steps
      for (let step = 0; step < 80; step++) {{
        runSimulationStep(width, height);
      }}

      render();
    }}

    function runSimulationStep(w, h) {{
      const nodeMap = new Map(state.nodes.map(n => [n.node_id, n]));
      
      // Repulsion between all nodes
      for (let i = 0; i < state.nodes.length; i++) {{
        for (let j = i + 1; j < state.nodes.length; j++) {{
          const a = state.nodes[i];
          const b = state.nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {{
            const force = (180 - dist) / dist * 0.08;
            a.x -= dx * force;
            a.y -= dy * force;
            b.x += dx * force;
            b.y += dy * force;
          }}
        }}
      }}

      // Attraction along edges
      for (const e of state.edges) {{
        const src = nodeMap.get(e.source_id);
        const tgt = nodeMap.get(e.target_id);
        if (src && tgt) {{
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 90;
          const force = (dist - targetDist) * 0.012;
          src.x += dx / dist * force;
          src.y += dy / dist * force;
          tgt.x -= dx / dist * force;
          tgt.y -= dy / dist * force;
        }}
      }}

      // Keep within canvas bounds
      for (const n of state.nodes) {{
        n.x = Math.max(40, Math.min(w - 40, n.x));
        n.y = Math.max(40, Math.min(h - 40, n.y));
      }}
    }}

    function render() {{
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(state.panX, state.panY);
      ctx.scale(state.scale, state.scale);

      const nodeMap = new Map(state.nodes.map(n => [n.node_id, n]));

      // 1. Draw Edges
      for (const e of state.edges) {{
        const src = nodeMap.get(e.source_id);
        const tgt = nodeMap.get(e.target_id);
        if (!src || !tgt) continue;

        const isHighlighted = state.highlightedEdges.has(e.edge_id);
        const isDimmed = state.highlightedEdges.size > 0 && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {{
          ctx.strokeStyle = e.sign < 0 ? '#ef4444' : '#10b981';
          ctx.lineWidth = 3;
        }} else if (isDimmed) {{
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
          ctx.lineWidth = 1;
        }} else {{
          ctx.strokeStyle = e.sign < 0 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(99, 102, 241, 0.35)';
          ctx.lineWidth = 1.2;
        }}

        if (e.sign < 0) {{
          ctx.setLineDash([4, 3]);
        }} else {{
          ctx.setLineDash([]);
        }}

        ctx.stroke();
        ctx.setLineDash([]);

        // Small directional arrow
        if (!isDimmed) {{
          drawArrow(src.x, src.y, tgt.x, tgt.y, tgt.radius, e.sign < 0 ? '#ef4444' : (isHighlighted ? '#10b981' : '#6366f1'));
        }}
      }}

      // 2. Draw Nodes
      for (const n of state.nodes) {{
        const isSelected = state.selectedNode && state.selectedNode.node_id === n.node_id;
        const isHighlighted = state.highlightedNodes.has(n.node_id);
        const isDimmed = (state.highlightedNodes.size > 0 || state.selectedNode) && !isHighlighted && !isSelected;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        const color = TYPE_COLORS[n.type] || '#94a3b8';
        if (isDimmed) {{
          ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.2)';
        }} else {{
          ctx.fillStyle = color;
          ctx.strokeStyle = isSelected ? '#ffffff' : (isHighlighted ? '#38bdf8' : 'rgba(0, 0, 0, 0.4)');
        }}

        ctx.lineWidth = isSelected ? 3 : (isHighlighted ? 2.5 : 1.5);
        ctx.fill();
        ctx.stroke();

        // Node label
        if (!isDimmed || isSelected || isHighlighted) {{
          ctx.fillStyle = isSelected ? '#ffffff' : (isHighlighted ? '#38bdf8' : '#cbd5e1');
          ctx.font = `${{isSelected ? 'bold 11px' : '9px'}} sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y + n.radius + 12);
        }}
      }}

      ctx.restore();
    }}

    function drawArrow(x1, y1, x2, y2, targetRadius, color) {{
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 10) return;

      const stopDist = dist - targetRadius - 3;
      const ax = x1 + (dx / dist) * stopDist;
      const ay = y1 + (dy / dist) * stopDist;

      const angle = Math.atan2(dy, dx);
      const arrowLength = 6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - arrowLength * Math.cos(angle - Math.PI / 6), ay - arrowLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(ax - arrowLength * Math.cos(angle + Math.PI / 6), ay - arrowLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }}

    function selectNode(node) {{
      state.selectedNode = node;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();

      if (node) {{
        state.highlightedNodes.add(node.node_id);
        
        // Find adjacent edges and nodes
        for (const e of state.edges) {{
          if (e.source_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.target_id);
          }} else if (e.target_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.source_id);
          }}
        }}

        renderDossier(node);
      }}

      render();
    }}

    function renderDossier(node) {{
      const badge = document.getElementById('dossier-badge');
      const title = document.getElementById('dossier-title');
      const idElem = document.getElementById('dossier-id');
      const body = document.getElementById('dossier-body');

      badge.textContent = node.type.replace('_', ' ');
      title.textContent = node.name;
      idElem.textContent = node.node_id;

      // Find in/out edges
      const inEdges = state.edges.filter(e => e.target_id === node.node_id);
      const outEdges = state.edges.filter(e => e.source_id === node.node_id);

      // Collect all literature evidence
      const allEv = [...inEdges, ...outEdges].flatMap(e => e.evidence || []);

      let html = `
        <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Namespace:</span>
            <span class="font-mono text-slate-200">${{node.node_id.split(':')[0]}}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Cell Compartment:</span>
            <span class="text-slate-200 capitalize">${{node.compartment || 'Not specified'}}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Aliases:</span>
            <span class="text-slate-300 truncate max-w-[200px]" title="${{node.aliases}}">${{node.aliases || 'None'}}</span>
          </div>
        </div>
      `;

      // Pharmacological Druggability Actions
      if (node.type === 'drug') {{
        html += `
          <div class="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-lg space-y-2">
            <div class="text-xs font-semibold text-emerald-400 flex items-center justify-between">
              <span>Therapeutic Candidate Profile</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Drug</span>
            </div>
            <p class="text-xs text-slate-300">Click below to simulate full mechanistic path towards inhibiting osteoclast differentiation.</p>
            <button onclick="traceDrugPath('${{node.node_id}}')" class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm">
              Trace Complete Mechanism Route
            </button>
          </div>
        `;
      }} else if (node.type === 'protein') {{
        html += `
          <div class="bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-lg space-y-2">
            <div class="text-xs font-semibold text-indigo-400 flex items-center justify-between">
              <span>Pharmacological Target Assessment</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Target</span>
            </div>
            <div class="text-xs text-slate-300 space-y-1">
              <div><strong>Direct Upstream Inputs:</strong> ${{inEdges.length}} interactions</div>
              <div><strong>Downstream Effectors:</strong> ${{outEdges.length}} pathways</div>
            </div>
          </div>
        `;
      }}

      // Connected Edges List
      html += `
        <div class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Mechanism Interactions</h3>
          <div class="space-y-1.5">
      `;

      for (const e of outEdges) {{
        const signColor = e.sign < 0 ? 'text-red-400 bg-red-950/40 border-red-800/50' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
        const signText = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        html += `
          <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs flex flex-col space-y-1 cursor-pointer hover:border-slate-700" onclick="focusTarget('${{e.target_id}}')">
            <div class="flex items-center justify-between">
              <span class="font-medium text-slate-200">──► ${{e.target_id}}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded border ${{signColor}} font-mono">${{signText}}</span>
            </div>
            <div class="text-[11px] text-slate-400 truncate">Source: ${{e.source_record_id}} (${{e.source_db}})</div>
          </div>
        `;
      }}

      for (const e of inEdges) {{
        const signColor = e.sign < 0 ? 'text-red-400 bg-red-950/40 border-red-800/50' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
        const signText = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        html += `
          <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs flex flex-col space-y-1 cursor-pointer hover:border-slate-700" onclick="focusTarget('${{e.source_id}}')">
            <div class="flex items-center justify-between">
              <span class="font-medium text-slate-200">◄── ${{e.source_id}}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded border ${{signColor}} font-mono">${{signText}}</span>
            </div>
            <div class="text-[11px] text-slate-400 truncate">Source: ${{e.source_record_id}} (${{e.source_db}})</div>
          </div>
        `;
      }}

      html += `</div></div>`;

      // Verifiable Evidence List
      if (allEv.length > 0) {{
        html += `
          <div class="space-y-2 pt-2 border-t border-slate-800">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Primary Literature Audit Trail</span>
              <span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">${{allEv.length}}</span>
            </h3>
            <div class="space-y-2">
        `;

        for (const ev of allEv) {{
          const isPmid = ev.paper_id && ev.paper_id.startsWith('PMID:');
          const pmidNum = isPmid ? ev.paper_id.replace('PMID:', '') : '';
          const pubmedLink = isPmid ? `https://pubmed.ncbi.nlm.nih.gov/${{pmidNum}}/` : '#';

          html += `
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <a href="${{pubmedLink}}" target="_blank" class="font-mono text-cyan-400 hover:underline flex items-center space-x-1">
                  <span>${{ev.paper_id || 'Database Record'}}</span>
                  <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <span class="text-[10px] uppercase text-slate-500 font-mono">${{ev.evidence_kind || 'curated'}}</span>
              </div>
              <p class="text-slate-300 italic text-[11px] leading-relaxed">"${{ev.quote_or_location}}"</p>
              ${{ev.figure_or_table ? `<div class="text-[10px] text-slate-500">Location: <span class="text-slate-400">${{ev.figure_or_table}}</span> | Cell: <span class="text-slate-400">${{ev.cell_type}}</span></div>` : ''}}
            </div>
          `;
        }}

        html += `</div></div>`;
      }}

      body.innerHTML = html;
    }}

    function renderNodeList() {{
      const container = document.getElementById('node-list-container');
      const query = state.searchQuery.toLowerCase();
      const mod = state.moduleFilter || 'all';

      const filtered = state.nodes.filter(n => {{
        const matchesQuery = n.name.toLowerCase().includes(query) || n.node_id.toLowerCase().includes(query) || n.aliases.toLowerCase().includes(query);
        if (!matchesQuery) return false;

        if (mod === 'glycolysis') return ['HGNC:HK2', 'HGNC:GPI', 'HGNC:PFKFB3', 'HGNC:PFKM', 'HGNC:PKM', 'HGNC:LDHA', 'CHEBI:17234', 'CHEBI:16651', 'CHEMBL:2DG', 'CHEMBL:SHOKI3'].includes(n.node_id);
        if (mod === 'tca') return ['HGNC:PHGDH', 'HGNC:GLS', 'HGNC:ACOD1', 'CHEBI:30915', 'CHEBI:16015', 'CHEBI:30805', 'CHEMBL:CBR5884', 'CHEMBL:CB839', 'CHEMBL:4OI'].includes(n.node_id);
        if (mod === 'epigenetics') return ['HGNC:KDM6B', 'HGNC:PRMT6', 'HGNC:EZH2', 'HGNC:TET2', 'HGNC:SIRT3', 'CHEMBL:EPZ020411'].includes(n.node_id);
        if (mod === 'signaling') return ['HGNC:TNFSF11', 'HGNC:TNFRSF11A', 'HGNC:TRAF6', 'HGNC:FOS', 'HGNC:NFATC1', 'HGNC:PPP3CA', 'CHEMBL:FK506'].includes(n.node_id);
        if (mod === 'fusion') return ['HGNC:DCSTAMP', 'HGNC:OCSTAMP', 'HGNC:ATP6V0D2', 'HGNC:SNX10', 'HGNC:MSN', 'STRUCT:syncytium'].includes(n.node_id);
        if (mod === 'cytoskeleton') return ['HGNC:SRC', 'HGNC:VAV3', 'HGNC:RAC1', 'STRUCT:podosome_belt', 'STRUCT:f_actin_sealing_zone', 'CHEMBL:DASATINIB'].includes(n.node_id);
        if (mod === 'resorption') return ['HGNC:TCIRG1', 'HGNC:CTSK', 'HGNC:ACP5', 'HGNC:MMP9', 'HGNC:CLCN7', 'STRUCT:resorption_lacuna'].includes(n.node_id);
        if (mod === 'brakes') return ['HGNC:IRF8', 'HGNC:PRDM1', 'HGNC:BCL6', 'HGNC:GNA13', 'HGNC:IFNB1', 'HGNC:IFNAR1'].includes(n.node_id);
        if (mod === 'drugs') return n.type === 'drug';

        return true;
      }});

      container.innerHTML = filtered.map(n => `
        <div class="px-2.5 py-1.5 rounded-md hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs transition border border-transparent hover:border-slate-700" onclick="focusTarget('${{n.node_id}}')">
          <div class="flex items-center space-x-2 truncate">
            <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${{TYPE_COLORS[n.type] || '#94a3b8'}}"></span>
            <span class="font-medium text-slate-200 truncate">${{n.name}}</span>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">${{n.type}}</span>
        </div>
      `).join('');
    }}

    window.focusTarget = function(nodeId) {{
      const node = state.nodes.find(n => n.node_id === nodeId);
      if (node) {{
        selectNode(node);
        // Center camera
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;
        state.panX = width / 2 - node.x * state.scale;
        state.panY = height / 2 - node.y * state.scale;
        render();
      }}
    }};

    window.traceDrugPath = function(drugId) {{
      // Find paths to phenotype
      const paths = [];
      const visited = new Set();
      
      function dfs(curr, curPath) {{
        if (curPath.length > 8) return;
        if (curr === 'PHENO:osteoclast_differentiation' || curr === 'PHENO:bone_resorption') {{
          paths.push([...curPath]);
          return;
        }}
        for (const e of state.edges) {{
          if (e.source_id === curr && !visited.has(e.target_id)) {{
            visited.add(e.target_id);
            curPath.push(e);
            dfs(e.target_id, curPath);
            curPath.pop();
            visited.remove(e.target_id);
          }}
        }}
      }}

      visited.add(drugId);
      dfs(drugId, []);

      if (paths.length > 0) {{
        state.highlightedNodes.clear();
        state.highlightedEdges.clear();
        const bestPath = paths[0];
        state.highlightedNodes.add(drugId);
        for (const e of bestPath) {{
          state.highlightedEdges.add(e.edge_id);
          state.highlightedNodes.add(e.target_id);
        }}
        document.getElementById('path-status-badge').classList.remove('hidden');
        document.getElementById('path-status-text').textContent = `Path Found (${{bestPath.length}} steps) -> Inhibit Resorption`;
        render();
      }}
    }};

    document.getElementById('btn-clear-path').onclick = function() {{
      document.getElementById('path-status-badge').classList.add('hidden');
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      render();
    }};

    document.getElementById('btn-reset-view').onclick = function() {{
      state.scale = 1;
      state.panX = 0;
      state.panY = 0;
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      document.getElementById('path-status-badge').classList.add('hidden');
      render();
    }};

    document.getElementById('target-search').oninput = function(e) {{
      state.searchQuery = e.target.value;
      renderNodeList();
    }};

    document.getElementById('module-filter').onchange = function(e) {{
      state.moduleFilter = e.target.value;
      renderNodeList();
    }};

    // Stage buttons
    document.querySelectorAll('.stage-btn').forEach(btn => {{
      btn.onclick = function() {{
        const stageId = this.dataset.stage;
        focusTarget(stageId);
      }};
    }});

    // Export CSV
    document.getElementById('btn-export-csv').onclick = function() {{
      const headers = ['node_id', 'name', 'type', 'compartment', 'aliases'];
      const rows = state.nodes.map(n => [n.node_id, `"${{n.name}}"`, n.type, n.compartment, `"${{n.aliases}}"`]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'osteoclast_kg_targets.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }};

    // Canvas Mouse & Interaction handlers
    canvas.addEventListener('mousedown', e => {{
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - state.panX) / state.scale;
      const my = (e.clientY - rect.top - state.panY) / state.scale;

      // Check if clicked node
      const clicked = state.nodes.find(n => {{
        const dx = n.x - mx;
        const dy = n.y - my;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 3;
      }});

      if (clicked) {{
        state.draggedNode = clicked;
        selectNode(clicked);
      }} else {{
        state.isDragging = true;
        state.dragStartX = e.clientX - state.panX;
        state.dragStartY = e.clientY - state.panY;
      }}
    }});

    window.addEventListener('mousemove', e => {{
      if (state.draggedNode) {{
        const rect = canvas.getBoundingClientRect();
        state.draggedNode.x = (e.clientX - rect.left - state.panX) / state.scale;
        state.draggedNode.y = (e.clientY - rect.top - state.panY) / state.scale;
        render();
      }} else if (state.isDragging) {{
        state.panX = e.clientX - state.dragStartX;
        state.panY = e.clientY - state.dragStartY;
        render();
      }}
    }});

    window.addEventListener('mouseup', () => {{
      state.isDragging = false;
      state.draggedNode = null;
    }});

    canvas.addEventListener('wheel', e => {{
      e.preventDefault();
      const zoomFactor = 1.1;
      if (e.deltaY < 0) {{
        state.scale = Math.min(3, state.scale * zoomFactor);
      }} else {{
        state.scale = Math.max(0.3, state.scale / zoomFactor);
      }}
      render();
    }}, {{ passive: false }});

    window.addEventListener('resize', initGraph);

    // Initial load
    initGraph();
  </script>
</body>
</html>
"""

    for out_path in output_paths:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated web app: {out_path}")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_dir = os.path.join(project_root, "data", "processed")

    repo_html = os.path.join(project_root, "index.html")
    artifact_dir = "/Users/sarahszabo/.gemini/antigravity/brain/f3c85251-4355-46db-a0c2-5ac60706f3c7"
    artifact_html = os.path.join(artifact_dir, "osteoclast_kg_explorer.html")

    build_app(data_dir, [repo_html, artifact_html])
