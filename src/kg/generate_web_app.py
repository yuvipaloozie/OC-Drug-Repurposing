"""
Generates a minimalist, clean, white-background interactive Knowledge Graph viewer
customized for pharmacology researchers.
- Pure white background.
- Clean color palette:
    * Proteins: green (#16a34a)
    * RNA (miRNA/mRNA): red (#dc2626)
    * Enzymes: blue (#2563eb)
    * Epigenetics: purple (#9333ea)
    * Transcription Factors: orange (#ea580c)
    * Metabolites: amber (#d97706)
    * Drugs: teal (#0d9488)
    * Phenotypes: rose (#e11d48)
    * Structures: cyan (#0891b2)
- All nodes presented at once in a logical multi-tier layout.
- Pathway dropdown filter.
- Fact search bar for searching genes, metabolites, mechanisms, and literature facts.
- Distraction-free: No stats counters, no floating instructions boxes, no visual clutter.
"""

import os
import csv
import json


def build_clean_app(data_dir: str, output_paths: list):
    def read_csv(filename):
        with open(os.path.join(data_dir, filename), "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    nodes = read_csv("nodes.csv")
    edges = read_csv("edges.csv")
    experiments = read_csv("experiments.csv")
    evidence = read_csv("edge_evidence.csv")

    exp_map = {e["experiment_id"]: e for e in experiments}
    ev_map = {}
    for ev in evidence:
        eid = ev["edge_id"]
        if eid not in ev_map:
            ev_map[eid] = []
        exp_info = exp_map.get(ev.get("experiment_id", ""), {})
        ev_combined = dict(ev)
        if exp_info:
            ev_combined["paper_id"] = exp_info.get("paper_id", "")
            ev_combined["cell_type"] = exp_info.get("cell_type", "")
            ev_combined["treatment"] = exp_info.get("treatment", "")
            ev_combined["dose"] = exp_info.get("dose", "")
            ev_combined["figure_or_table"] = exp_info.get("figure_or_table", "")
            ev_combined["endpoint"] = exp_info.get("endpoint", "")
        ev_map[eid].append(ev_combined)

    for edge in edges:
        edge["evidence"] = ev_map.get(edge["edge_id"], [])

    # Exact Classification rules based on user request
    TF_SET = {
        'HGNC:NFATC1', 'HGNC:FOS', 'HGNC:JUN', 'HGNC:SPI1', 'HGNC:MITF', 'HGNC:TFE3',
        'HGNC:CEBPA', 'HGNC:CREB1', 'HGNC:NFKB1', 'HGNC:RELA', 'HGNC:NFKB2', 'HGNC:RELB',
        'HGNC:REL', 'HGNC:IRF8', 'HGNC:PRDM1', 'HGNC:BCL6', 'HGNC:RBPJ', 'HGNC:MAFB', 'HGNC:TGIF2',
        'HGNC:SREBF2', 'HGNC:IRF7', 'HGNC:HIF1A'
    }
    EPIGENETIC_SET = {
        'HGNC:PRMT6', 'HGNC:KDM6B', 'HGNC:KDM4A', 'HGNC:EZH2', 'HGNC:SIRT3', 'HGNC:PDHA1',
        'HGNC:EP300', 'HGNC:TET2', 'HGNC:DNMT3A', 'HGNC:DPY30', 'HGNC:ASXL1', 'HGNC:HDAC1',
        'HGNC:HDAC2', 'HGNC:HDAC5', 'HGNC:SIRT1', 'HGNC:SIRT6',
        'CHREV:H3K27me3_demethylation_Nfatc1',
        'CHREV:H3R2me2a_fao_promoters', 'CHREV:H3K9ac_H3K27ac_promoters',
        'CHREV:TET2_5hmC_hydroxymethylation', 'CHREV:EZH2_H3K27me3_repression'
    }
    ENZYME_SET = {
        'HGNC:HK2', 'HGNC:GPI', 'HGNC:PFKFB3', 'HGNC:PFKM', 'HGNC:ALDOA', 'HGNC:GAPDH',
        'HGNC:PGK1', 'HGNC:PGAM1', 'HGNC:ENO1', 'HGNC:PKM', 'HGNC:LDHA', 'HGNC:CS',
        'HGNC:ACO2', 'HGNC:IDH2', 'HGNC:OGDH', 'HGNC:SUCLG1', 'HGNC:SDHA', 'HGNC:FH',
        'HGNC:MDH2', 'HGNC:PC', 'HGNC:GLS', 'HGNC:PHGDH', 'HGNC:PSAT1', 'HGNC:PSPH',
        'HGNC:ACOD1', 'HGNC:SRC', 'HGNC:PTK2B', 'HGNC:SYK', 'HGNC:BTK', 'HGNC:PLCG2',
        'HGNC:PPP3CA', 'HGNC:CAMK4', 'HGNC:CHUK', 'HGNC:IKBKB', 'HGNC:IKBKG', 'HGNC:MAP3K14',
        'HGNC:MAP3K7', 'HGNC:MAPK14', 'HGNC:MAPK8', 'HGNC:MAPK1', 'HGNC:CTSK', 'HGNC:ACP5',
        'HGNC:MMP9', 'HGNC:CA2', 'HGNC:CBLB', 'HGNC:CBL', 'HGNC:CYLD', 'HGNC:MAP3K1',
        'HGNC:MAP3K5', 'HGNC:RAF1', 'HGNC:MAP2K1', 'HGNC:MAP2K2', 'HGNC:MAP2K3', 'HGNC:MAP2K6',
        'HGNC:MAP2K4', 'HGNC:MAP2K7', 'HGNC:MAPK3', 'HGNC:MAPK11', 'HGNC:MAPK12', 'HGNC:MAPK13',
        'HGNC:MAPK9', 'HGNC:MAPK10', 'HGNC:PIK3CA', 'HGNC:AKT1', 'HGNC:GSK3B', 'HGNC:TEC',
        'HGNC:DUSP1', 'HGNC:DUSP6', 'HGNC:PPM1D', 'HGNC:MMP2', 'HGNC:MMP3', 'HGNC:MMP8', 'HGNC:MMP13'
    }

    classified_nodes = []
    for n in nodes:
        nid = n["node_id"]
        ntype = n["type"]
        if nid in TF_SET or ntype == "gene":
            category = "transcription_factor"
        elif nid in EPIGENETIC_SET or ntype == "chromatin_event":
            category = "epigenetics"
        elif ntype in ["mrna", "mirna"] or nid.startswith("RNA:") or nid.startswith("MIRNA:") or nid.startswith("MRNA:"):
            category = "rna"
        elif nid in ENZYME_SET:
            category = "enzyme"
        elif ntype == "metabolite":
            category = "metabolite"
        elif ntype == "drug":
            category = "drug"
        elif ntype in ["phenotype", "differentiation_stage"]:
            category = "phenotype"
        elif ntype == "cellular_structure":
            category = "cellular_structure"
        else:
            category = "protein"

        item = dict(n)
        item["category"] = category
        classified_nodes.append(item)

    kg_payload = {
        "nodes": classified_nodes,
        "edges": edges,
    }

    kg_json = json.dumps(kg_payload, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Osteoclast Knowledge Graph Explorer</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    body {{
      background-color: #ffffff;
      color: #0f172a;
    }}
    .custom-scroll::-webkit-scrollbar {{
      width: 5px;
    }}
    .custom-scroll::-webkit-scrollbar-thumb {{
      background: #cbd5e1;
      border-radius: 4px;
    }}
    canvas {{
      cursor: grab;
      background-color: #ffffff;
    }}
    canvas:active {{
      cursor: grabbing;
    }}
  </style>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased overflow-hidden select-none bg-white">

  <!-- Minimalist Clean Header -->
  <header class="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between z-20 shrink-0 shadow-sm">
    <div class="flex items-center space-x-4">
      <h1 class="text-base font-bold text-slate-900 tracking-tight">
        Osteoclast Knowledge Graph
      </h1>
      
      <!-- Pathway Dropdown -->
      <div class="relative">
        <select id="pathway-select" class="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-xs">
          <option value="all">Display All Pathways (Full Graph)</option>
          <option value="glycolysis">Glycolytic Shift (HK2, PFKFB3, PKM2, LDHA)</option>
          <option value="tca">TCA Cycle & Anaplerosis (PHGDH, GLS1, Itaconate, aKG)</option>
          <option value="epigenetics">Epigenetic Checkpoints (KDM6B, PRMT6, EZH2, TET2)</option>
          <option value="signaling">RANKL-RANK-TRAF6 & ITAM Signaling</option>
          <option value="fusion">Cell Fusion & Syncytium (DC-STAMP, OC-STAMP, d2)</option>
          <option value="cytoskeleton">Podosomes & Actin Sealing Zone (Src, Vav3, Rac1)</option>
          <option value="resorption">Lacunar Acidification & Proteolysis (TCIRG1, CTSK, TRAP)</option>
          <option value="brakes">Molecular Brakes (IRF8, Blimp1, BCL6, Galpha13)</option>
          <option value="drugs">Repurposable Therapeutics & Controls</option>
        </select>
      </div>
    </div>

    <!-- Search Box for Facts -->
    <div class="flex items-center space-x-3 w-96 max-w-full">
      <div class="relative w-full">
        <input type="text" id="fact-search" placeholder="Search facts, targets, enzymes, drugs, PMIDs..."
          class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs">
        <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div id="search-results-dropdown" class="hidden absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-72 overflow-y-auto custom-scroll z-50 text-xs divide-y divide-slate-100">
          <!-- Populated by JS -->
        </div>
      </div>

      <button id="btn-reset" class="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg bg-slate-50 transition shrink-0 font-medium">
        Reset View
      </button>
    </div>
  </header>

  <!-- Main Canvas & Detail Drawer -->
  <div class="flex-1 flex overflow-hidden relative">

    <!-- Interactive Canvas -->
    <div class="flex-1 relative bg-white" id="canvas-wrapper">
      <canvas id="kg-canvas" class="w-full h-full absolute inset-0 block"></canvas>

      <!-- Category Legend (Clean minimal floating bar at top-left) -->
      <div class="absolute top-3 left-4 bg-white/95 border border-slate-200 rounded-lg px-3 py-2 shadow-xs text-xs backdrop-blur-xs flex items-center space-x-3.5 pointer-events-auto">
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Legend:</span>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#16a34a]"></span><span class="text-slate-700 font-medium">Proteins</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#2563eb]"></span><span class="text-slate-700 font-medium">Enzymes</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#ea580c]"></span><span class="text-slate-700 font-medium">Transcription Factors</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#9333ea]"></span><span class="text-slate-700 font-medium">Epigenetics</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#dc2626]"></span><span class="text-slate-700 font-medium">RNA</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#d97706]"></span><span class="text-slate-700 font-medium">Metabolites</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-[#0d9488]"></span><span class="text-slate-700 font-medium">Drugs</span></div>
      </div>
    </div>

    <!-- Right Side: Fact Sheet & Pharmacological Profile (Collapsible) -->
    <aside id="info-drawer" class="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg z-10 transition-transform duration-200">
      
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div>
          <span id="fact-category" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-slate-500">Node</span>
          <h2 id="fact-title" class="text-base font-bold text-slate-900 mt-1">Select a Target</h2>
        </div>
        <button id="btn-close-drawer" class="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs font-bold">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 text-xs" id="fact-content">
        <div class="text-center py-16 text-slate-400">
          <p>Click any node in the graph or search above to view its biological function, mechanism of action, and literature facts.</p>
        </div>
      </div>

    </aside>

  </div>

  <script>
    const DATA = {kg_json};

    // User-Specified Color Mapping
    const CATEGORY_COLORS = {{
      'protein': '#16a34a',             // Green (Proteins)
      'rna': '#dc2626',                 // Red (RNA)
      'enzyme': '#2563eb',              // Blue (Enzymes)
      'epigenetics': '#9333ea',         // Purple (Epigenetics)
      'transcription_factor': '#ea580c',// Orange (Transcription Factors)
      'metabolite': '#d97706',          // Warm Amber (Metabolites)
      'drug': '#0d9488',                // Teal (Drugs)
      'phenotype': '#e11d48',           // Rose (Phenotypes)
      'cellular_structure': '#0891b2'   // Cyan (Cellular Structures)
    }};

    let state = {{
      nodes: [],
      edges: [],
      selectedNode: null,
      highlightedNodes: new Set(),
      highlightedEdges: new Set(),
      scale: 1,
      panX: 0,
      panY: 0,
      activePathway: 'all',
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      draggedNode: null
    }};

    const canvas = document.getElementById('kg-canvas');
    const ctx = canvas.getContext('2d');

    // Pathway memberships
    const PATHWAY_MEMBERS = {{
      'glycolysis': ['HGNC:HK2', 'HGNC:GPI', 'HGNC:PFKFB3', 'HGNC:PFKM', 'HGNC:ALDOA', 'HGNC:GAPDH', 'HGNC:PGK1', 'HGNC:PGAM1', 'HGNC:ENO1', 'HGNC:PKM', 'HGNC:LDHA', 'CHEBI:17234', 'CHEBI:14314', 'CHEBI:15946', 'CHEBI:16905', 'CHEBI:17138', 'CHEBI:16001', 'CHEBI:17794', 'CHEBI:17835', 'CHEBI:18021', 'CHEBI:32816', 'CHEBI:16651', 'CHEMBL:2DG', 'CHEMBL:SHOKI3', 'CHEMBL:PFK15', 'MRNA:Pkm', 'MRNA:Pfkfb3'],
      'tca': ['HGNC:CS', 'HGNC:ACO2', 'HGNC:IDH2', 'HGNC:OGDH', 'HGNC:SUCLG1', 'HGNC:SDHA', 'HGNC:FH', 'HGNC:MDH2', 'HGNC:PC', 'HGNC:GLS', 'HGNC:PHGDH', 'HGNC:PSAT1', 'HGNC:PSPH', 'HGNC:ACOD1', 'CHEBI:15351', 'CHEBI:16947', 'CHEBI:32838', 'CHEBI:30887', 'CHEBI:30915', 'CHEBI:15380', 'CHEBI:15741', 'CHEBI:18012', 'CHEBI:15589', 'CHEBI:16452', 'CHEBI:30805', 'CHEBI:18050', 'CHEBI:16015', 'CHEBI:17115', 'CHEMBL:CBR5884', 'CHEMBL:CB839', 'CHEMBL:4OI'],
      'epigenetics': ['HGNC:PRMT6', 'HGNC:KDM6B', 'HGNC:KDM4A', 'HGNC:EZH2', 'HGNC:SIRT3', 'HGNC:PDHA1', 'HGNC:EP300', 'HGNC:TET2', 'CHREV:H3K27me3_demethylation_Nfatc1', 'CHREV:H3R2me2a_fao_promoters', 'CHREV:H3K9ac_H3K27ac_promoters', 'CHREV:TET2_5hmC_hydroxymethylation', 'CHREV:EZH2_H3K27me3_repression', 'CHEMBL:EPZ020411'],
      'signaling': ['HGNC:TNFSF11', 'HGNC:TNFRSF11A', 'HGNC:TRAF6', 'HGNC:CHUK', 'HGNC:IKBKB', 'HGNC:IKBKG', 'HGNC:NFKB1', 'HGNC:RELA', 'HGNC:MAPK14', 'HGNC:MAPK8', 'HGNC:MAPK1', 'HGNC:FOS', 'HGNC:JUN', 'HGNC:NFATC1', 'HGNC:TYROBP', 'HGNC:FCER1G', 'HGNC:OSCAR', 'HGNC:TREM2', 'HGNC:SYK', 'HGNC:BTK', 'HGNC:BLNK', 'HGNC:PLCG2', 'HGNC:PPP3CA', 'HGNC:CALM1', 'CHEMBL:FK506', 'CHEMBL:DENOSUMAB'],
      'fusion': ['HGNC:DCSTAMP', 'HGNC:OCSTAMP', 'HGNC:ATP6V0D2', 'HGNC:SNX10', 'HGNC:MSN', 'STRUCT:syncytium', 'MRNA:Dcstamp', 'STAGE:syncytium_prefusion_polykaryon'],
      'cytoskeleton': ['HGNC:ITGAV', 'HGNC:ITGB3', 'HGNC:SRC', 'HGNC:PTK2B', 'HGNC:VAV3', 'HGNC:RAC1', 'HGNC:CDC42', 'HGNC:RHOA', 'HGNC:CTTN', 'HGNC:WAS', 'STRUCT:podosome_belt', 'STRUCT:f_actin_sealing_zone', 'CHEMBL:DASATINIB', 'CHEMBL:SARACATINIB'],
      'resorption': ['HGNC:TCIRG1', 'HGNC:ATP6V1C1', 'HGNC:ATP6AP1', 'HGNC:CLCN7', 'HGNC:OSTM1', 'HGNC:CA2', 'HGNC:ACP5', 'HGNC:CTSK', 'HGNC:MMP9', 'STRUCT:resorption_lacuna', 'MRNA:Acp5', 'MRNA:Ctsk', 'PHENO:bone_resorption', 'PHENO:trap_production'],
      'brakes': ['HGNC:IRF8', 'HGNC:PRDM1', 'HGNC:BCL6', 'HGNC:RBPJ', 'HGNC:GNA13', 'HGNC:IFNB1', 'HGNC:IFNAR1', 'HGNC:IFT80', 'HGNC:CBLB', 'HGNC:XPO1', 'CHEMBL:SELINEXOR'],
      'drugs': ['CHEMBL:DENOSUMAB', 'CHEMBL:ZOLEDRONATE', 'CHEMBL:ALENDRONATE', 'CHEMBL:DASATINIB', 'CHEMBL:SARACATINIB', 'CHEMBL:FK506', 'CHEMBL:SELINEXOR', 'CHEMBL:CBR5884', 'CHEMBL:CB839', 'CHEMBL:EPZ020411', 'CHEMBL:4OI', 'CHEMBL:2DG', 'CHEMBL:SHOKI3', 'CHEMBL:PFK15']
    }};

    function init() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const w = rect.width;
      const h = rect.height;

      // Group nodes into distinct columns across the white canvas
      state.nodes = DATA.nodes.map((n, idx) => {{
        let x = w * 0.5 + (Math.random() - 0.5) * w * 0.75;
        let y = h * 0.5 + (Math.random() - 0.5) * h * 0.75;

        // Structured multi-column layout for immediate presentation
        if (n.category === 'drug') {{
          x = w * 0.08 + (Math.random() - 0.5) * 60;
          y = h * 0.15 + (idx % 8) * (h * 0.1);
        }} else if (n.category === 'protein' && (n.node_id.includes('RANK') || n.node_id.includes('ITG') || n.node_id.includes('TYROBP') || n.node_id.includes('OSCAR'))) {{
          x = w * 0.22 + (Math.random() - 0.5) * 50;
        }} else if (n.category === 'enzyme' && (n.node_id.includes('HK') || n.node_id.includes('PFK') || n.node_id.includes('PKM') || n.node_id.includes('GLS') || n.node_id.includes('PHGDH'))) {{
          x = w * 0.40 + (Math.random() - 0.5) * 80;
          y = h * 0.22 + (Math.random() - 0.5) * 160;
        }} else if (n.category === 'metabolite') {{
          x = w * 0.48 + (Math.random() - 0.5) * 90;
          y = h * 0.22 + (Math.random() - 0.5) * 160;
        }} else if (n.category === 'epigenetics') {{
          x = w * 0.58 + (Math.random() - 0.5) * 70;
          y = h * 0.42 + (Math.random() - 0.5) * 140;
        }} else if (n.category === 'transcription_factor') {{
          x = w * 0.68 + (Math.random() - 0.5) * 70;
          y = h * 0.50 + (Math.random() - 0.5) * 160;
        }} else if (n.category === 'rna') {{
          x = w * 0.72 + (Math.random() - 0.5) * 50;
          y = h * 0.25 + (Math.random() - 0.5) * 120;
        }} else if (n.category === 'cellular_structure' || n.category === 'phenotype') {{
          x = w * 0.88 + (Math.random() - 0.5) * 50;
          y = h * 0.52 + (Math.random() - 0.5) * 180;
        }}

        return {{
          ...n,
          x: x,
          y: y,
          radius: n.category === 'phenotype' ? 12 : (n.category === 'drug' ? 10 : 8)
        }};
      }});

      state.edges = DATA.edges;

      // Relax layout slightly
      for (let i = 0; i < 45; i++) {{
        relaxForces(w, h);
      }}

      render();
    }}

    function relaxForces(w, h) {{
      for (let i = 0; i < state.nodes.length; i++) {{
        for (let j = i + 1; j < state.nodes.length; j++) {{
          const a = state.nodes[i];
          const b = state.nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 110) {{
            const force = (110 - dist) / dist * 0.05;
            a.x -= dx * force;
            a.y -= dy * force;
            b.x += dx * force;
            b.y += dy * force;
          }}
        }}
      }}
      for (const n of state.nodes) {{
        n.x = Math.max(30, Math.min(w - 30, n.x));
        n.y = Math.max(30, Math.min(h - 30, n.y));
      }}
    }}

    function render() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(state.panX, state.panY);
      ctx.scale(state.scale, state.scale);

      const nodeMap = new Map(state.nodes.map(n => [n.node_id, n]));
      const activeMembers = state.activePathway !== 'all' ? new Set(PATHWAY_MEMBERS[state.activePathway] || []) : null;

      // Draw Edges
      for (const e of state.edges) {{
        const src = nodeMap.get(e.source_id);
        const tgt = nodeMap.get(e.target_id);
        if (!src || !tgt) continue;

        let inPathway = true;
        if (activeMembers) {{
          inPathway = activeMembers.has(src.node_id) && activeMembers.has(tgt.node_id);
        }}

        const isHighlighted = state.highlightedEdges.has(e.edge_id) || (activeMembers && inPathway);
        const isDimmed = (state.highlightedEdges.size > 0 || activeMembers) && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {{
          ctx.strokeStyle = e.sign < 0 ? '#ef4444' : '#10b981';
          ctx.lineWidth = 2.5;
        }} else if (isDimmed) {{
          ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
          ctx.lineWidth = 0.8;
        }} else {{
          ctx.strokeStyle = e.sign < 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = 1;
        }}

        if (e.sign < 0) {{
          ctx.setLineDash([4, 3]);
        }} else {{
          ctx.setLineDash([]);
        }}

        ctx.stroke();
        ctx.setLineDash([]);
      }}

      // Draw Nodes
      for (const n of state.nodes) {{
        let inPathway = true;
        if (activeMembers) {{
          inPathway = activeMembers.has(n.node_id);
        }}

        const isSelected = state.selectedNode && state.selectedNode.node_id === n.node_id;
        const isHighlighted = state.highlightedNodes.has(n.node_id) || (activeMembers && inPathway);
        const isDimmed = (state.highlightedNodes.size > 0 || state.selectedNode || activeMembers) && !isHighlighted && !isSelected;

        const baseColor = CATEGORY_COLORS[n.category] || '#64748b';

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (isDimmed) {{
          ctx.fillStyle = '#f1f5f9';
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
        }} else {{
          ctx.fillStyle = baseColor;
          ctx.strokeStyle = isSelected ? '#0f172a' : '#ffffff';
          ctx.lineWidth = isSelected ? 3 : 1.5;
        }}

        ctx.fill();
        ctx.stroke();

        // Node Label
        if (!isDimmed || isSelected || isHighlighted) {{
          ctx.fillStyle = isSelected ? '#0f172a' : (isHighlighted ? '#1e293b' : '#475569');
          ctx.font = `${{isSelected ? 'bold 11px' : '9px'}} sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y + n.radius + 11);
        }}
      }}

      ctx.restore();
    }}

    function selectNode(node) {{
      state.selectedNode = node;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();

      if (node) {{
        state.highlightedNodes.add(node.node_id);
        for (const e of state.edges) {{
          if (e.source_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.target_id);
          }} else if (e.target_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.source_id);
          }}
        }}
        renderFactSheet(node);
      }}

      render();
    }}

    function renderFactSheet(node) {{
      const badge = document.getElementById('fact-category');
      const title = document.getElementById('fact-title');
      const body = document.getElementById('fact-content');

      const color = CATEGORY_COLORS[node.category] || '#64748b';
      badge.textContent = node.category.replace('_', ' ');
      badge.style.backgroundColor = color;
      title.textContent = node.name;

      const inEdges = state.edges.filter(e => e.target_id === node.node_id);
      const outEdges = state.edges.filter(e => e.source_id === node.node_id);
      const allEv = [...inEdges, ...outEdges].flatMap(e => e.evidence || []);

      let html = `
        <div class="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">ID:</span>
            <span class="font-mono text-slate-800 font-medium">${{node.node_id}}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Cellular Compartment:</span>
            <span class="text-slate-700 capitalize font-medium">${{node.compartment || 'Unspecified'}}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Known Aliases:</span>
            <span class="text-slate-600 truncate max-w-[180px]" title="${{node.aliases}}">${{node.aliases || 'None'}}</span>
          </div>
        </div>
      `;

      // Upstream & Downstream interactions
      html += `
        <div class="space-y-1.5">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Interactions</h3>
      `;

      for (const e of outEdges) {{
        const signLabel = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        const signBadge = e.sign < 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
        html += `
          <div class="p-2 rounded border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between cursor-pointer" onclick="focusNode('${{e.target_id}}')">
            <span class="text-slate-700 font-medium">──► ${{e.target_id}}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded border font-mono font-semibold ${{signBadge}}">${{signLabel}}</span>
          </div>
        `;
      }}

      for (const e of inEdges) {{
        const signLabel = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        const signBadge = e.sign < 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
        html += `
          <div class="p-2 rounded border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between cursor-pointer" onclick="focusNode('${{e.source_id}}')">
            <span class="text-slate-700 font-medium">◄── ${{e.source_id}}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded border font-mono font-semibold ${{signBadge}}">${{signLabel}}</span>
          </div>
        `;
      }}

      html += `</div>`;

      // Literature Facts
      if (allEv.length > 0) {{
        html += `
          <div class="space-y-2 pt-2 border-t border-slate-200">
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Literature Evidence & Facts</span>
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">${{allEv.length}}</span>
            </h3>
            <div class="space-y-2">
        `;

        for (const ev of allEv) {{
          const isPmid = ev.paper_id && ev.paper_id.startsWith('PMID:');
          const pmidNum = isPmid ? ev.paper_id.replace('PMID:', '') : '';
          const link = isPmid ? `https://pubmed.ncbi.nlm.nih.gov/${{pmidNum}}/` : '#';

          html += `
            <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
              <div class="flex items-center justify-between">
                <a href="${{link}}" target="_blank" class="text-indigo-600 font-bold hover:underline font-mono text-[11px]">${{ev.paper_id || 'Database Record'}}</a>
                <span class="text-[10px] text-slate-400 uppercase font-mono">${{ev.evidence_kind || 'curated'}}</span>
              </div>
              <p class="text-slate-700 italic text-[11px] leading-relaxed">"${{ev.quote_or_location}}"</p>
              ${{ev.cell_type ? `<div class="text-[10px] text-slate-500 font-medium">Cell Model: ${{ev.cell_type}} | Dose: ${{ev.dose || 'N/A'}}</div>` : ''}}
            </div>
          `;
        }}

        html += `</div></div>`;
      }}

      body.innerHTML = html;
      document.getElementById('info-drawer').classList.remove('translate-x-full');
    }}

    window.focusNode = function(nid) {{
      const n = state.nodes.find(x => x.node_id === nid);
      if (n) {{
        selectNode(n);
        const rect = canvas.parentElement.getBoundingClientRect();
        state.panX = rect.width / 2 - n.x * state.scale;
        state.panY = rect.height / 2 - n.y * state.scale;
        render();
      }}
    }};

    // Pathway Select
    document.getElementById('pathway-select').onchange = function(e) {{
      state.activePathway = e.target.value;
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      render();
    }};

    // Search Box for Facts & Nodes
    const searchInput = document.getElementById('fact-search');
    const searchDropdown = document.getElementById('search-results-dropdown');

    searchInput.addEventListener('input', e => {{
      const q = e.target.value.trim().toLowerCase();
      if (!q) {{
        searchDropdown.classList.add('hidden');
        return;
      }}

      // Search nodes and evidence
      const matches = [];
      for (const n of state.nodes) {{
        if (n.name.toLowerCase().includes(q) || n.node_id.toLowerCase().includes(q) || n.aliases.toLowerCase().includes(q)) {{
          matches.push({{
            type: 'node',
            title: n.name,
            sub: `${{n.node_id}} • ${{n.category}}`,
            id: n.node_id
          }});
        }}
      }}

      // Search evidence quotes
      for (const e of state.edges) {{
        for (const ev of (e.evidence || [])) {{
          if (ev.quote_or_location && ev.quote_or_location.toLowerCase().includes(q)) {{
            matches.push({{
              type: 'fact',
              title: ev.paper_id || 'Evidence',
              sub: ev.quote_or_location.slice(0, 80) + '...',
              id: e.source_id
            }});
            break;
          }}
        }}
        if (matches.length >= 25) break;
      }}

      if (matches.length > 0) {{
        searchDropdown.innerHTML = matches.slice(0, 15).map(m => `
          <div class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex flex-col" onclick="selectSearchMatch('${{m.id}}')">
            <span class="font-bold text-slate-800">${{m.title}}</span>
            <span class="text-[11px] text-slate-500 truncate">${{m.sub}}</span>
          </div>
        `).join('');
        searchDropdown.classList.remove('hidden');
      }} else {{
        searchDropdown.innerHTML = `<div class="p-3 text-slate-400 text-center">No matching facts found</div>`;
        searchDropdown.classList.remove('hidden');
      }}
    }});

    window.selectSearchMatch = function(nid) {{
      searchDropdown.classList.add('hidden');
      searchInput.value = '';
      focusNode(nid);
    }};

    document.addEventListener('click', e => {{
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {{
        searchDropdown.classList.add('hidden');
      }}
    }});

    document.getElementById('btn-reset').onclick = function() {{
      state.scale = 1;
      state.panX = 0;
      state.panY = 0;
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      state.activePathway = 'all';
      document.getElementById('pathway-select').value = 'all';
      render();
    }};

    document.getElementById('btn-close-drawer').onclick = function() {{
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      render();
    }};

    // Mouse & Pan/Zoom
    canvas.addEventListener('mousedown', e => {{
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - state.panX) / state.scale;
      const my = (e.clientY - rect.top - state.panY) / state.scale;

      const clicked = state.nodes.find(n => {{
        const dx = n.x - mx;
        const dy = n.y - my;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
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
      const factor = 1.1;
      if (e.deltaY < 0) {{
        state.scale = Math.min(3, state.scale * factor);
      }} else {{
        state.scale = Math.max(0.35, state.scale / factor);
      }}
      render();
    }}, {{ passive: false }});

    window.addEventListener('resize', init);
    init();
  </script>
</body>
</html>
"""

    for out_path in output_paths:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated clean app: {out_path}")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_dir = os.path.join(project_root, "data", "processed")

    repo_html = os.path.join(project_root, "index.html")
    artifact_dir = "/Users/sarahszabo/.gemini/antigravity/brain/f3c85251-4355-46db-a0c2-5ac60706f3c7"
    artifact_html = os.path.join(artifact_dir, "osteoclast_kg_explorer.html")

    build_clean_app(data_dir, [repo_html, artifact_html])
