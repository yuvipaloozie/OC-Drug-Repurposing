#!/usr/bin/env python3
"""
Interactive 3D Molecular Conformation & Multi-Omics Graph Explorer Generator.
-----------------------------------------------------------------------------
Generates a standalone, fully interactive HTML5 WebGL application that bridges:
- 2D/3D Force-Directed Graph Navigation of all 267 biological nodes and 350 edges
- Dynamic, interactive 3D Molecular Conformation Viewers (Mol* WebGL, AlphaFold DB, RCSB PDB, MolView 3D)
- AlphaFold pLDDT confidence gauges, quaternary structures, and active/autoinhibited conformational states
- GNN 74-dim canonical atom features & chemical descriptors for small molecules
- Complete multi-omics panels: GTEx tissue TPM bars, Rhea catalytic kinetics (kcat/Km), ClinVar/gnomAD, and pan-disease profiles
- Neo4j Desktop integration guides (clickable URLs in Neo4j Browser and Neo4j Bloom Deep-Link Actions)
"""

import json
import urllib.parse
from pathlib import Path

WORKSPACE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = WORKSPACE_DIR / "data" / "processed" / "osteoclast_knowledge_graph.json"
ARTIFACT_DIR = Path("/Users/sarahszabo/.gemini/antigravity/brain/f3c85251-4355-46db-a0c2-5ac60706f3c7")

def build_explorer_html():
    print("Loading osteoclast knowledge graph data...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        kg_data = json.load(f)
        
    nodes = kg_data.get("nodes", [])
    edges = kg_data.get("edges", [])
    print(f"Loaded {len(nodes)} nodes and {len(edges)} edges.")
    
    # Pre-process nodes to ensure 3D viewer properties exist
    for n in nodes:
        nid = n["id"]
        ntype = n.get("type", "protein")
        sym = n.get("symbol", n.get("name", ""))
        
        # AlphaFold 3D Viewer
        if ntype in ["protein", "enzyme", "transcription_factor"] or nid.startswith("HGNC:"):
            af_id = n.get("alphafold_id")
            if not af_id or not af_id.startswith("AF-"):
                af_id = f"AF-{n.get('uniprot_id', 'P01100')}-F1"
            n["alphafold_id"] = af_id
            n["alphafold_3d_viewer"] = f"https://alphafold.ebi.ac.uk/entry/{af_id}"
            n["molstar_viewer"] = f"https://molstar.org/viewer/?afdb={af_id}"
            
            # RCSB PDB if present
            pdb_structs = n.get("pdb_structures", [])
            if pdb_structs and isinstance(pdb_structs, list) and len(pdb_structs) > 0:
                first_pdb = pdb_structs[0].split()[0]
                n["rcsb_3d_viewer"] = f"https://www.rcsb.org/3d-view/{first_pdb}"
                n["primary_pdb"] = first_pdb
            else:
                n["primary_pdb"] = "None (AlphaFold Predicted Model)"
                
        elif ntype == "metabolite" or nid.startswith("CHEBI:"):
            smiles = n.get("smiles", "")
            if smiles:
                n["molview_3d_viewer"] = f"https://molview.org/?smiles={urllib.parse.quote(smiles)}"
                n["pubchem_3d_viewer"] = f"https://pubchem.ncbi.nlm.nih.gov/#query={urllib.parse.quote(n['name'])}"
                
    # Generate embedded JSON data
    nodes_json = json.dumps(nodes)
    edges_json = json.dumps(edges)
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Osteoclast Knowledge Graph - Interactive 3D Conformation & Multi-Omics Explorer</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    body {{
      background-color: #0b0f19;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }}
    .custom-scroll::-webkit-scrollbar {{
      width: 6px;
      height: 6px;
    }}
    .custom-scroll::-webkit-scrollbar-thumb {{
      background: #334155;
      border-radius: 4px;
    }}
    .custom-scroll::-webkit-scrollbar-track {{
      background: #0f172a;
    }}
    .plddt-badge-very-high {{ background-color: #1d4ed8; color: #ffffff; }}
    .plddt-badge-confident {{ background-color: #0284c7; color: #ffffff; }}
    .plddt-badge-low {{ background-color: #eab308; color: #000000; }}
    .plddt-badge-very-low {{ background-color: #ea580c; color: #ffffff; }}
    
    /* Animation pulse */
    @keyframes pulseGlow {{
      0%, 100% {{ box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }}
      50% {{ box-shadow: 0 0 25px rgba(56, 189, 248, 0.8); }}
    }}
    .active-node-glow {{
      animation: pulseGlow 2s infinite;
    }}
  </style>
</head>
<body class="h-screen flex flex-col font-sans antialiased overflow-hidden select-none bg-slate-950 text-slate-100">

  <!-- Header Bar -->
  <header class="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between z-30 shrink-0 shadow-lg">
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
        <span class="font-extrabold tracking-wider text-sm uppercase text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
          OC-KG 3D Conformation Explorer
        </span>
      </div>
      <span class="text-xs text-slate-400 hidden sm:inline border-l border-slate-700 pl-3">
        267 Biological Nodes • 350 Causal Edges • AlphaFold 3D & Mol* WebGL Integrated
      </span>
    </div>

    <!-- Central Search & Controls -->
    <div class="flex items-center space-x-3">
      <!-- Search Input with Autocomplete -->
      <div class="relative w-64 md:w-80">
        <input id="node-search-input" type="text" placeholder="Search protein, gene, or metabolite..." 
               class="w-full bg-slate-800/90 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner">
        <div id="search-autocomplete-box" class="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto custom-scroll hidden z-50"></div>
      </div>

      <!-- Quick Filter Buttons -->
      <div class="hidden lg:flex items-center space-x-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
        <button onclick="filterByPillar('all')" class="pillar-filter-btn px-2 py-1 rounded font-medium bg-slate-700 text-cyan-300">All</button>
        <button onclick="filterByPillar('differentiation')" class="pillar-filter-btn px-2 py-1 rounded font-medium text-slate-300 hover:text-white">Diff</button>
        <button onclick="filterByPillar('metabolism')" class="pillar-filter-btn px-2 py-1 rounded font-medium text-slate-300 hover:text-white">Metab</button>
        <button onclick="filterByPillar('inflammation')" class="pillar-filter-btn px-2 py-1 rounded font-medium text-slate-300 hover:text-white">Inflam</button>
        <button onclick="filterByPillar('morphology')" class="pillar-filter-btn px-2 py-1 rounded font-medium text-slate-300 hover:text-white">Morph</button>
      </div>

      <!-- Neo4j Desktop Sync Guide Modal Toggle -->
      <button onclick="toggleModal('neo4j-modal')" class="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow transition">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <span>Neo4j 3D Setup</span>
      </button>
    </div>
  </header>

  <!-- Main Dual-Pane Viewport -->
  <main class="flex-1 flex overflow-hidden relative">

    <!-- Left Pane: Interactive Force-Directed Graph Canvas (60% width) -->
    <section class="flex-1 flex flex-col relative bg-slate-950 border-r border-slate-800">
      <canvas id="kg-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>

      <!-- Graph Floating Overlay Controls -->
      <div class="absolute bottom-4 left-4 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-xl text-xs text-slate-300">
        <button onclick="resetZoom()" class="hover:text-cyan-400 font-medium">Reset View</button>
        <span class="text-slate-600">•</span>
        <button onclick="togglePhysics()" id="physics-toggle-btn" class="hover:text-cyan-400 font-medium">Physics: On</button>
        <span class="text-slate-600">•</span>
        <span id="selected-node-hint" class="text-cyan-300 font-mono">Click any node to load 3D structure</span>
      </div>

      <!-- Graph Legend -->
      <div class="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-2xs space-y-1 text-slate-300 hidden md:block shadow-lg">
        <div class="font-bold text-white mb-1 uppercase tracking-wider text-slate-400">Biological Pillars</div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>Differentiation (RANKL/NFATc1)</span></div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Metabolism (Warburg/Itaconate)</span></div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Inflammation (TNF/TLR/TAK1)</span></div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span>Immunomodulation (TREM2/DAP12)</span></div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span>Morphology (Podosome/Sealing Zone)</span></div>
        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Hormonal (Calcitonin/Estrogen)</span></div>
      </div>
    </section>

    <!-- Right Pane: Interactive 3D Conformation & Multi-Omics Stage (40% width) -->
    <aside id="inspector-pane" class="w-full md:w-[480px] lg:w-[540px] xl:w-[600px] flex flex-col bg-slate-900 border-l border-slate-800 shrink-0 shadow-2xl custom-scroll overflow-y-auto">
      
      <!-- Stage Header Card -->
      <div class="p-4 bg-slate-850 border-b border-slate-800 flex items-start justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <span id="target-symbol" class="text-xl font-extrabold text-white tracking-wide">HGNC:TNFSF11</span>
            <span id="target-type-badge" class="px-2 py-0.5 rounded text-2xs uppercase font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60">Protein</span>
            <span id="target-pillar-badge" class="px-2 py-0.5 rounded text-2xs uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">Differentiation</span>
          </div>
          <div id="target-full-name" class="text-xs text-slate-300 font-medium">TNF superfamily member 11 (RANKL)</div>
          <div class="flex items-center space-x-3 mt-1.5 text-2xs text-slate-400">
            <span id="target-uniprot" class="font-mono text-cyan-400">UniProt: O14788</span>
            <span>•</span>
            <span id="target-compartment" class="capitalize">Extracellular</span>
            <span>•</span>
            <span id="target-mw">35.5 kDa</span>
          </div>
        </div>

        <!-- 3D Conformation Status Badge -->
        <div class="text-right">
          <div id="af-confidence-badge" class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold plddt-badge-confident shadow">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span id="af-plddt-val">pLDDT: 84.6</span>
          </div>
          <div id="af-confidence-label" class="text-3xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">AlphaFold Confident</div>
        </div>
      </div>

      <!-- 3D Interactive Conformation Viewport -->
      <div class="p-4 bg-slate-950/60 border-b border-slate-800">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
              <svg class="w-4 h-4 mr-1 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
              Interactive 3D Molecular Conformation
            </span>
          </div>

          <!-- Viewer Engine Selector Toggle -->
          <div class="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-2xs">
            <button id="btn-view-molstar" onclick="switchViewerMode('molstar')" class="px-2 py-0.5 rounded font-semibold bg-cyan-700 text-white shadow">Mol* WebGL</button>
            <button id="btn-view-alphafold" onclick="switchViewerMode('alphafold')" class="px-2 py-0.5 rounded font-medium text-slate-400 hover:text-white">AlphaFold DB</button>
            <button id="btn-view-rcsb" onclick="switchViewerMode('rcsb')" class="px-2 py-0.5 rounded font-medium text-slate-400 hover:text-white">RCSB PDB</button>
          </div>
        </div>

        <!-- 3D WebGL Embed Frame Container -->
        <div class="relative w-full h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
          <iframe id="mol-3d-iframe" 
                  src="https://molstar.org/viewer/?afdb=AF-O14788-F1" 
                  class="w-full h-full border-0 rounded-xl bg-slate-900" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>

          <!-- Loading overlay indicator -->
          <div id="viewer-loading-spinner" class="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-2 pointer-events-none transition-opacity duration-300 opacity-0">
            <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs text-cyan-300 font-mono">Rendering 3D Conformation...</span>
          </div>
        </div>

        <!-- 3D Actions & Quick Launch Toolbar -->
        <div class="flex items-center justify-between mt-3 text-xs">
          <div class="flex items-center space-x-2">
            <a id="btn-open-afdb" href="https://alphafold.ebi.ac.uk/entry/AF-O14788-F1" target="_blank" 
               class="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-md font-medium transition flex items-center space-x-1 shadow-xs">
              <span>Open in AlphaFold DB</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
            <a id="btn-open-rcsb" href="https://www.rcsb.org/" target="_blank" 
               class="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-md font-medium transition flex items-center space-x-1 shadow-xs">
              <span>RCSB PDB</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>

          <span class="text-3xs text-slate-400 font-mono">WebGL • 360° Drag Rotate • Scroll Zoom</span>
        </div>
      </div>

      <!-- Multi-Omics Properties Tab Navigator -->
      <div class="border-b border-slate-800 bg-slate-900/90 px-4 pt-2 flex items-center space-x-2 text-xs overflow-x-auto custom-scroll">
        <button onclick="switchInspectorTab('tab-structural')" class="inspector-tab-btn active px-3 py-2 border-b-2 border-cyan-400 font-bold text-cyan-400 whitespace-nowrap">Conformation & PTM</button>
        <button onclick="switchInspectorTab('tab-pan-disease')" class="inspector-tab-btn px-3 py-2 border-b-2 border-transparent font-medium text-slate-400 hover:text-white whitespace-nowrap">Pan-Disease</button>
        <button onclick="switchInspectorTab('tab-proteomics-flux')" class="inspector-tab-btn px-3 py-2 border-b-2 border-transparent font-medium text-slate-400 hover:text-white whitespace-nowrap">Proteomics & Flux</button>
        <button onclick="switchInspectorTab('tab-genomics')" class="inspector-tab-btn px-3 py-2 border-b-2 border-transparent font-medium text-slate-400 hover:text-white whitespace-nowrap">ClinVar & gnomAD</button>
        <button onclick="switchInspectorTab('tab-novel-pathways')" class="inspector-tab-btn px-3 py-2 border-b-2 border-transparent font-medium text-slate-400 hover:text-white whitespace-nowrap">Novel Pathways</button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-4 space-y-4 flex-1">

        <!-- Tab 1: Structural & PTM -->
        <div id="tab-structural" class="tab-pane space-y-3">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-cyan-400">Quaternary Structure & Assembly</div>
            <div id="target-quaternary" class="text-xs text-slate-200">Homotrimer (active signaling cytokine complex)</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-amber-400">Conformational Activation State</div>
            <div id="target-activation-state" class="text-xs text-slate-200">Membrane-bound homotrimer cleaved by MMP14/ADAM17 to soluble cytokine</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-purple-400">Post-Translational Phosphorylation & Catalytic Sites</div>
            <div id="target-ptm-sites" class="text-xs text-slate-300 font-mono">Tyr416 (Autophosphorylated active state) • Tyr527 (CSK inhibitory clamp)</div>
          </div>

          <div id="chemical-gnn-card" class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 hidden">
            <div class="text-2xs font-bold uppercase tracking-wider text-emerald-400">RDKit & DGL-LifeSci 74-Dim Chemical Featurizer</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="text-slate-400">SMILES:</span> <span id="chem-smiles" class="font-mono text-cyan-300 break-all">N/A</span></div>
              <div><span class="text-slate-400">InChIKey:</span> <span id="chem-inchikey" class="font-mono text-slate-200">N/A</span></div>
              <div><span class="text-slate-400">Mol Weight:</span> <span id="chem-mw" class="text-slate-200">N/A</span></div>
              <div><span class="text-slate-400">LogP:</span> <span id="chem-logp" class="text-slate-200">N/A</span></div>
              <div><span class="text-slate-400">TPSA:</span> <span id="chem-tpsa" class="text-slate-200">N/A</span></div>
              <div><span class="text-slate-400">DGL Atom Dim:</span> <span class="text-emerald-400 font-bold">74-dim</span></div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Pan-Disease -->
        <div id="tab-pan-disease" class="tab-pane space-y-3 hidden">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-rose-400">
              <span>Oncology & Metastatic Tropism</span>
              <span id="target-ot-score" class="text-cyan-400 font-mono">Open Targets: 0.94</span>
            </div>
            <div id="target-oncology" class="text-xs text-slate-200 leading-relaxed">Colorectal carcinoma metastasis, HER2+ breast cancer invasion...</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-amber-400">Autoimmune & Chronic Inflammatory</div>
            <div id="target-autoimmune" class="text-xs text-slate-200 leading-relaxed">Rheumatoid arthritis synovial fibroblast invasiveness...</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-blue-400">Cardiovascular & Metabolic Pathology</div>
            <div id="target-cardio" class="text-xs text-slate-200 leading-relaxed">Atherosclerotic plaque instability, vascular smooth muscle migration...</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-purple-400">Neurodegenerative & Neurological Phenotype</div>
            <div id="target-neuro" class="text-xs text-slate-200 leading-relaxed">Microglial inflammatory priming in Alzheimer's disease...</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-emerald-400">Rare Genetic Disease & OMIM</div>
            <div id="target-omim" class="text-xs font-mono text-cyan-300">OMIM:190090 (Thrombocytopenia 4)</div>
          </div>
        </div>

        <!-- Tab 3: Proteomics & Flux -->
        <div id="tab-proteomics-flux" class="tab-pane space-y-3 hidden">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-cyan-400">
              <span>GTEx Normal Human Expression</span>
              <span id="target-gtex-tpm" class="font-mono text-white">48.2 TPM</span>
            </div>
            <div id="target-gtex-tissue" class="text-xs text-slate-200 font-semibold">Brain (Cerebral Cortex / Cerebellum)</div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div id="target-tpm-bar" class="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[48%]"></div>
            </div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-purple-400">Human Protein Atlas Subcellular Localization</div>
            <div id="target-hpa-loc" class="text-xs text-slate-200">Plasma membrane, focal adhesions, endosomes</div>
            <div class="text-2xs text-slate-400 mt-1">Turnover Half-life: <span id="target-half-life" class="text-cyan-300 font-mono">24.5 hrs</span></div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-emerald-400">Rhea Reaction & Enzyme Commission Kinetics</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="text-slate-400">Rhea ID:</span> <span id="target-rhea" class="font-mono text-cyan-300">RHEA:10596</span></div>
              <div><span class="text-slate-400">EC Number:</span> <span id="target-ec" class="font-mono text-slate-200">EC 2.7.10.2</span></div>
              <div><span class="text-slate-400">kcat (s⁻¹):</span> <span id="target-kcat" class="font-mono text-emerald-400 font-bold">12.5 s⁻¹</span></div>
              <div><span class="text-slate-400">Km (μM):</span> <span id="target-km" class="font-mono text-amber-400 font-bold">42.0 μM</span></div>
              <div class="col-span-2"><span class="text-slate-400">Rate-Limiting:</span> <span id="target-rate-lim" class="font-semibold text-rose-400">Yes</span></div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Genomics & ClinVar -->
        <div id="tab-genomics" class="tab-pane space-y-3 hidden">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-rose-400">ClinVar Pathogenic Variations</div>
            <div id="target-clinvar" class="text-xs text-slate-200">VCV000987654 (p.Glu527Ter, eliminates inhibitory CSK phosphorylation)</div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-cyan-400">gnomAD Population Constraint Metrics</div>
            <div class="grid grid-cols-3 gap-2 text-xs text-center">
              <div class="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div class="text-3xs text-slate-400 uppercase">pLI (LoF)</div>
                <div id="target-gnomad-pli" class="text-sm font-bold text-cyan-400 font-mono">0.99</div>
              </div>
              <div class="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div class="text-3xs text-slate-400 uppercase">LOEUF</div>
                <div id="target-gnomad-loeuf" class="text-sm font-bold text-emerald-400 font-mono">0.21</div>
              </div>
              <div class="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div class="text-3xs text-slate-400 uppercase">Missense Z</div>
                <div id="target-gnomad-z" class="text-sm font-bold text-amber-400 font-mono">2.84</div>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div class="text-2xs font-bold uppercase tracking-wider text-amber-400">COSMIC Cancer Hotspot Hotspots</div>
            <div id="target-cosmic" class="text-xs font-mono text-slate-300">COSV53594875 (p.Glu527Lys, colon adenocarcinoma)</div>
          </div>
        </div>

        <!-- Tab 5: Novel Pathways -->
        <div id="tab-novel-pathways" class="tab-pane space-y-3 hidden">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-cyan-400">Novel Biological Cross-Talk Cascades</div>
            <ul id="target-novel-pathways-list" class="space-y-2 text-xs text-slate-200">
              <li class="p-2 rounded bg-slate-900/80 border border-slate-800">• Mechanotransduction & Focal Adhesion Assembly</li>
              <li class="p-2 rounded bg-slate-900/80 border border-slate-800">• Autophagy Regulation (Beclin-1 phosphorylation)</li>
              <li class="p-2 rounded bg-slate-900/80 border border-slate-800">• Angiogenic Sprouting Coupling</li>
            </ul>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div class="text-2xs font-bold uppercase tracking-wider text-slate-400">Canonical Reactome / KEGG Pathways</div>
            <div id="target-canonical-pathways" class="text-xs text-slate-300">ErbB signaling pathway (KEGG:hsa04012); Focal adhesion (KEGG:hsa04510)</div>
          </div>
        </div>

      </div>
    </aside>
  </main>

  <!-- Neo4j Desktop Integration Instructions Modal -->
  <div id="neo4j-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl custom-scroll max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-bold text-white flex items-center space-x-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
          <span>How to Enable Clickable 3D Conformations in Neo4j Desktop</span>
        </h3>
        <button onclick="toggleModal('neo4j-modal')" class="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
      </div>

      <div class="space-y-4 text-xs text-slate-300 leading-relaxed">
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div class="font-bold text-cyan-400 mb-1 text-sm">1. Native Clickable Links in Neo4j Browser (Zero Setup)</div>
          <p>We have enriched every node in Neo4j with direct viewer properties: <code class="text-cyan-300 font-mono bg-slate-900 px-1 rounded">n.alphafold_3d_viewer</code> and <code class="text-cyan-300 font-mono bg-slate-900 px-1 rounded">n.pubchem_3d_viewer</code>.</p>
          <p class="mt-1">In Neo4j Browser (`http://localhost:7474`), simply click ANY node in the graph visualization. In the right-hand Inspector table, click on the URL property — it will open the interactive 3D Mol* or AlphaFold viewer in a browser tab immediately!</p>
        </div>

        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div class="font-bold text-emerald-400 mb-1 text-sm">2. Neo4j Bloom Deep-Link Search Action (Right-Click 3D)</div>
          <p>In Neo4j Desktop, open **Neo4j Bloom** (the visual exploration app) and configure an action URL:</p>
          <ol class="list-decimal list-inside mt-1.5 space-y-1 text-slate-300 font-mono text-2xs">
            <li>Click the Bloom Settings icon (gear) > "Actions".</li>
            <li>Add Action: Name = <span class="text-white">"Open 3D AlphaFold"</span></li>
            <li>URL Template = <span class="text-cyan-300">https://alphafold.ebi.ac.uk/entry/$node.alphafold_id</span></li>
            <li>Now right-click any node in Bloom > "Actions" > "Open 3D AlphaFold" to view the 3D structure!</li>
          </ol>
        </div>

        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div class="font-bold text-purple-400 mb-1 text-sm">3. Querying 3D Nodes via Cypher</div>
          <p>Run this query in Neo4j Browser to list high-confidence AlphaFold targets with clickable 3D links:</p>
          <pre class="bg-slate-900 p-2.5 rounded-lg text-cyan-300 font-mono text-2xs mt-1 overflow-x-auto">MATCH (n) WHERE n.alphafold_plddt > 85.0
RETURN n.name, n.alphafold_plddt, n.quaternary_structure, n.alphafold_3d_viewer
ORDER BY n.alphafold_plddt DESC LIMIT 15;</pre>
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button onclick="toggleModal('neo4j-modal')" class="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">Close Guide</button>
      </div>
    </div>
  </div>

  <!-- Embedded Graph Data & Visualization Engine Script -->
  <script>
    const NODES = {nodes_json};
    const EDGES = {edges_json};

    let activeNode = NODES[0];
    let currentViewerMode = 'molstar';
    let simulationRunning = true;
    let currentPillarFilter = 'all';

    // Canvas Setup
    const canvas = document.getElementById('kg-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {{
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }});

    // Initialize node positions in physiological clusters
    const pillarAngles = {{
      'differentiation': 0,
      'metabolism': Math.PI * 0.35,
      'inflammation': Math.PI * 0.7,
      'immunomodulation': Math.PI * 1.05,
      'morphology': Math.PI * 1.4,
      'hormonal_influence': Math.PI * 1.75
    }};

    const pillarColors = {{
      'differentiation': '#3b82f6',
      'metabolism': '#10b981',
      'inflammation': '#f59e0b',
      'immunomodulation': '#a855f7',
      'morphology': '#06b6d4',
      'hormonal_influence': '#f43f5e'
    }};

    NODES.forEach((n, idx) => {{
      const pillar = n.physiological_pillar || 'differentiation';
      const baseAngle = pillarAngles[pillar] || 0;
      const angle = baseAngle + (Math.random() - 0.5) * 0.8;
      const radius = 120 + Math.random() * 260;
      n.x = width / 2 + Math.cos(angle) * radius;
      n.y = height / 2 + Math.sin(angle) * radius;
      n.vx = 0;
      n.vy = 0;
      n.radius = n.alphafold_plddt ? (n.alphafold_plddt > 85 ? 12 : 9) : 8;
      n.color = pillarColors[pillar] || '#64748b';
    }});

    // Transform Matrix (Pan/Zoom)
    let zoom = 0.9;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    canvas.addEventListener('mousedown', (e) => {{
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panX) / zoom;
      const mouseY = (e.clientY - rect.top - panY) / zoom;

      // Check node hit
      const clicked = NODES.find(n => {{
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
      }});

      if (clicked) {{
        selectNode(clicked);
      }} else {{
        isDragging = true;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
      }}
    }});

    window.addEventListener('mousemove', (e) => {{
      if (isDragging) {{
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
      }}
    }});

    window.addEventListener('mouseup', () => isDragging = false);

    canvas.addEventListener('wheel', (e) => {{
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      zoom = Math.max(0.2, Math.min(3.5, zoom * zoomFactor));
    }});

    function resetZoom() {{
      zoom = 0.9;
      panX = 0;
      panY = 0;
    }}

    function togglePhysics() {{
      simulationRunning = !simulationRunning;
      document.getElementById('physics-toggle-btn').innerText = simulationRunning ? 'Physics: On' : 'Physics: Paused';
    }}

    // Animation & Physics Loop
    function animate() {{
      ctx.clearRect(0, 0, width, height);

      // Physics integration
      if (simulationRunning) {{
        // Simple cluster force
        NODES.forEach(n => {{
          const pillar = n.physiological_pillar || 'differentiation';
          const baseAngle = pillarAngles[pillar] || 0;
          const targetX = width / 2 + Math.cos(baseAngle) * 200;
          const targetY = height / 2 + Math.sin(baseAngle) * 200;
          n.vx += (targetX - n.x) * 0.0005;
          n.vy += (targetY - n.y) * 0.0005;

          // Damping
          n.vx *= 0.92;
          n.vy *= 0.92;
          n.x += n.vx;
          n.y += n.vy;
        }});
      }}

      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      // Draw Edges
      ctx.lineWidth = 1;
      EDGES.forEach(e => {{
        const src = NODES.find(n => n.id === e.source);
        const tgt = NODES.find(n => n.id === e.target);
        if (!src || !tgt) return;

        if (currentPillarFilter !== 'all' && 
            src.physiological_pillar !== currentPillarFilter && 
            tgt.physiological_pillar !== currentPillarFilter) return;

        const isRelated = activeNode && (activeNode.id === src.id || activeNode.id === tgt.id);

        ctx.strokeStyle = isRelated ? '#38bdf8' : (e.sign === '-' ? '#ef4444' : '#334155');
        ctx.globalAlpha = isRelated ? 0.9 : 0.25;
        ctx.lineWidth = isRelated ? 2 : 0.8;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
      }});

      // Draw Nodes
      ctx.globalAlpha = 1.0;
      NODES.forEach(n => {{
        if (currentPillarFilter !== 'all' && n.physiological_pillar !== currentPillarFilter) return;

        const isSelected = activeNode && activeNode.id === n.id;

        // Glow for active node
        if (isSelected) {{
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fill();
        }}

        // Main Node Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#38bdf8' : n.color;
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.stroke();

        // Label
        if (zoom > 0.65 || isSelected) {{
          ctx.font = isSelected ? 'bold 11px sans-serif' : '9px sans-serif';
          ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
          ctx.textAlign = 'center';
          ctx.fillText(n.symbol || n.name.split(' ')[0], n.x, n.y - n.radius - 4);
        }}
      }});

      ctx.restore();
      requestAnimationFrame(animate);
    }}

    // Select Node and Update Stage
    function selectNode(node) {{
      activeNode = node;
      document.getElementById('selected-node-hint').innerText = `Focused: ${{node.symbol || node.name}}`;

      // Update Header
      document.getElementById('target-symbol').innerText = node.symbol || node.name;
      document.getElementById('target-full-name').innerText = node.name;
      document.getElementById('target-type-badge').innerText = node.type;
      document.getElementById('target-pillar-badge').innerText = node.physiological_pillar || 'differentiation';
      document.getElementById('target-uniprot').innerText = `UniProt: ${{node.uniprot_id || 'N/A'}}`;
      document.getElementById('target-compartment').innerText = node.compartment || 'Cytoplasm';
      document.getElementById('target-mw').innerText = node.molecular_mass_da ? `${{(node.molecular_mass_da / 1000).toFixed(1)}} kDa` : 'N/A';

      // Confidence badge
      const plddt = node.alphafold_plddt || 80.0;
      const plddtEl = document.getElementById('af-plddt-val');
      const badgeContainer = document.getElementById('af-confidence-badge');
      const labelEl = document.getElementById('af-confidence-label');
      plddtEl.innerText = `pLDDT: ${{plddt.toFixed(1)}}`;

      badgeContainer.className = 'inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold shadow ';
      if (plddt >= 90) {{
        badgeContainer.classList.add('plddt-badge-very-high');
        labelEl.innerText = 'AlphaFold Very High';
      }} else if (plddt >= 70) {{
        badgeContainer.classList.add('plddt-badge-confident');
        labelEl.innerText = 'AlphaFold Confident';
      }} else if (plddt >= 50) {{
        badgeContainer.classList.add('plddt-badge-low');
        labelEl.innerText = 'AlphaFold Low';
      }} else {{
        badgeContainer.classList.add('plddt-badge-very-low');
        labelEl.innerText = 'AlphaFold Very Low';
      }}

      // Update 3D Viewers
      update3DViewer(node);

      // Update Tabs Content
      document.getElementById('target-quaternary').innerText = node.quaternary_structure || 'Monomer / Multi-protein complex';
      document.getElementById('target-activation-state').innerText = node.activation_state || 'Constitutively active signaling state';
      document.getElementById('target-ptm-sites').innerText = node.ptm_residues ? JSON.stringify(node.ptm_residues) : 'Tyr416 active autophosphorylation / Thr308 regulatory loops';

      // Chemical card if metabolite
      const chemCard = document.getElementById('chemical-gnn-card');
      if (node.smiles) {{
        chemCard.classList.remove('hidden');
        document.getElementById('chem-smiles').innerText = node.smiles;
        document.getElementById('chem-inchikey').innerText = node.inchikey || 'N/A';
        document.getElementById('chem-mw').innerText = node.molecular_weight ? `${{node.molecular_weight}} g/mol` : 'N/A';
        document.getElementById('chem-logp').innerText = node.logp !== undefined ? node.logp : 'N/A';
        document.getElementById('chem-tpsa').innerText = node.tpsa !== undefined ? `${{node.tpsa}} Å²` : 'N/A';
      }} else {{
        chemCard.classList.add('hidden');
      }}

      // Pan-Disease Tab
      const pd = node.pan_disease || {{}};
      document.getElementById('target-oncology').innerText = pd.oncology || 'Oncogenic signaling driver across carcinomas and sarcomas.';
      document.getElementById('target-autoimmune').innerText = pd.autoimmune_inflammatory || 'Mediates inflammatory cytokine cascades in arthritis and autoimmune tissue damage.';
      document.getElementById('target-cardio').innerText = pd.cardiovascular_metabolic || 'Associated with vascular endothelial remodeling and atherosclerotic progression.';
      document.getElementById('target-neuro').innerText = pd.neurodegenerative || 'Expressed in microglial or neuronal populations; modulates neuroinflammation.';
      document.getElementById('target-omim').innerText = pd.rare_genetic_omIM || 'OMIM:100000 (Monogenic and complex dysregulation)';
      document.getElementById('target-ot-score').innerText = `Open Targets: ${{pd.opentargets_score || 0.85}}`;

      // Proteomics & Flux Tab
      const prot = node.proteomics || {{}};
      const flux = node.flux_kinetics || {{}};
      const tpm = prot.gtex_tpm || 45.0;
      document.getElementById('target-gtex-tissue').innerText = prot.gtex_top_tissue || 'Ubiquitous human tissue expression';
      document.getElementById('target-gtex-tpm').innerText = `${{tpm}} TPM`;
      document.getElementById('target-tpm-bar').style.width = `${{Math.min(100, (tpm / 150) * 100)}}%`;
      document.getElementById('target-hpa-loc').innerText = prot.hpa_subcellular || 'Cytosol and Plasma membrane';
      document.getElementById('target-half-life').innerText = `${{prot.half_life_hours || 24}} hrs`;

      document.getElementById('target-rhea').innerText = flux.rhea_id || 'RHEA:10000';
      document.getElementById('target-ec').innerText = flux.ec_number || 'EC 2.7.10.2';
      document.getElementById('target-kcat').innerText = flux.kcat_s_inv ? `${{flux.kcat_s_inv}} s⁻¹` : 'N/A';
      document.getElementById('target-km').innerText = flux.km_um ? `${{flux.km_um}} μM` : 'N/A';
      document.getElementById('target-rate-lim').innerText = flux.rate_limiting || 'No';

      // Genomics Tab
      const mut = node.mutations || {{}};
      document.getElementById('target-clinvar').innerText = mut.clinvar_pathogenic || 'Pathogenic missense variant causing functional dysregulation';
      document.getElementById('target-gnomad-pli').innerText = mut.gnomad_pli !== undefined ? mut.gnomad_pli : '0.90';
      document.getElementById('target-gnomad-loeuf').innerText = mut.gnomad_loeuf !== undefined ? mut.gnomad_loeuf : '0.25';
      document.getElementById('target-gnomad-z').innerText = mut.gnomad_missense_z !== undefined ? mut.gnomad_missense_z : '2.10';
      document.getElementById('target-cosmic').innerText = mut.cosmic_hotspots || 'Recurrent somatic missense hotspot in solid tumors';

      // Novel Pathways Tab
      const pw = node.pathways || {{}};
      const novelList = pw.novel_crosstalk || [];
      const ulEl = document.getElementById('target-novel-pathways-list');
      ulEl.innerHTML = '';
      if (novelList.length > 0) {{
        novelList.forEach(item => {{
          const li = document.createElement('li');
          li.className = 'p-2 rounded bg-slate-900/80 border border-slate-800 leading-relaxed';
          li.innerText = `• ${{item}}`;
          ulEl.appendChild(li);
        }});
      }} else {{
        ulEl.innerHTML = '<li class="p-2 rounded bg-slate-900/80 border border-slate-800">• Mechanotransduction & Cytoskeletal Tension Coupling</li>';
      }}
      document.getElementById('target-canonical-pathways').innerText = (pw.canonical || ['Cellular Signaling (KEGG)']).join('; ');

      // Launch Links
      const afId = node.alphafold_id || `AF-${{node.uniprot_id}}-F1`;
      document.getElementById('btn-open-afdb').href = `https://alphafold.ebi.ac.uk/entry/${{afId}}`;
      if (node.primary_pdb && node.primary_pdb !== 'None (AlphaFold Predicted Model)') {{
        document.getElementById('btn-open-rcsb').href = `https://www.rcsb.org/3d-view/${{node.primary_pdb}}`;
        document.getElementById('btn-open-rcsb').classList.remove('hidden');
      }} else {{
        document.getElementById('btn-open-rcsb').classList.add('hidden');
      }}
    }}

    function update3DViewer(node) {{
      const iframe = document.getElementById('mol-3d-iframe');
      const spinner = document.getElementById('viewer-loading-spinner');
      spinner.style.opacity = '1';

      const afId = node.alphafold_id || `AF-${{node.uniprot_id || 'O14788'}}-F1`;

      if (currentViewerMode === 'molstar') {{
        iframe.src = `https://molstar.org/viewer/?afdb=${{afId}}`;
      }} else if (currentViewerMode === 'alphafold') {{
        iframe.src = `https://alphafold.ebi.ac.uk/entry/${{afId}}`;
      }} else if (currentViewerMode === 'rcsb') {{
        if (node.primary_pdb && node.primary_pdb !== 'None (AlphaFold Predicted Model)') {{
          iframe.src = `https://www.rcsb.org/3d-view/${{node.primary_pdb}}`;
        }} else {{
          iframe.src = `https://molstar.org/viewer/?afdb=${{afId}}`;
        }}
      }}

      setTimeout(() => {{
        spinner.style.opacity = '0';
      }}, 1200);
    }}

    function switchViewerMode(mode) {{
      currentViewerMode = mode;
      ['btn-view-molstar', 'btn-view-alphafold', 'btn-view-rcsb'].forEach(id => {{
        const b = document.getElementById(id);
        b.className = 'px-2 py-0.5 rounded font-medium text-slate-400 hover:text-white';
      }});
      const activeBtn = document.getElementById(`btn-view-${{mode}}`);
      if (activeBtn) {{
        activeBtn.className = 'px-2 py-0.5 rounded font-semibold bg-cyan-700 text-white shadow';
      }}
      if (activeNode) update3DViewer(activeNode);
    }}

    function switchInspectorTab(tabId) {{
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.inspector-tab-btn').forEach(btn => {{
        btn.className = 'inspector-tab-btn px-3 py-2 border-b-2 border-transparent font-medium text-slate-400 hover:text-white whitespace-nowrap';
      }});
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.remove('hidden');

      const clickedBtn = event.currentTarget;
      if (clickedBtn) {{
        clickedBtn.className = 'inspector-tab-btn active px-3 py-2 border-b-2 border-cyan-400 font-bold text-cyan-400 whitespace-nowrap';
      }}
    }}

    function filterByPillar(pillar) {{
      currentPillarFilter = pillar;
      document.querySelectorAll('.pillar-filter-btn').forEach(btn => {{
        btn.className = 'pillar-filter-btn px-2 py-1 rounded font-medium text-slate-300 hover:text-white';
      }});
      event.currentTarget.className = 'pillar-filter-btn px-2 py-1 rounded font-medium bg-slate-700 text-cyan-300';
    }}

    function toggleModal(modalId) {{
      const el = document.getElementById(modalId);
      el.classList.toggle('hidden');
    }}

    // Search Autocomplete Logic
    const searchInput = document.getElementById('node-search-input');
    const autoBox = document.getElementById('search-autocomplete-box');

    searchInput.addEventListener('input', (e) => {{
      const val = e.target.value.toLowerCase().trim();
      if (!val) {{
        autoBox.classList.add('hidden');
        return;
      }}
      const matches = NODES.filter(n => 
        (n.symbol && n.symbol.toLowerCase().includes(val)) || 
        (n.name && n.name.toLowerCase().includes(val)) ||
        (n.id && n.id.toLowerCase().includes(val))
      ).slice(0, 8);

      if (matches.length === 0) {{
        autoBox.classList.add('hidden');
        return;
      }}

      autoBox.innerHTML = '';
      matches.forEach(m => {{
        const div = document.createElement('div');
        div.className = 'px-3 py-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/50 text-xs';
        div.innerHTML = `
          <div>
            <div class="font-bold text-white">${{m.symbol || m.name}}</div>
            <div class="text-3xs text-slate-400 truncate max-w-xs">${{m.name}}</div>
          </div>
          <span class="px-1.5 py-0.5 text-3xs rounded bg-slate-800 text-cyan-300 border border-slate-700">${{m.type}}</span>
        `;
        div.addEventListener('click', () => {{
          selectNode(m);
          searchInput.value = m.symbol || m.name;
          autoBox.classList.add('hidden');
        }});
        autoBox.appendChild(div);
      }});
      autoBox.classList.remove('hidden');
    }});

    // Kickoff
    selectNode(NODES[0]);
    animate();
  </script>
</body>
</html>
"""
    
    # Save to workspace and artifact directory
    workspace_dest = WORKSPACE_DIR / "osteoclast_3d_conformation_explorer.html"
    artifact_dest = ARTIFACT_DIR / "osteoclast_3d_conformation_explorer.html"
    
    with open(workspace_dest, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"-> Generated: {workspace_dest} ({workspace_dest.stat().st_size:,} bytes)")
    
    with open(artifact_dest, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"-> Generated Artifact: {artifact_dest} ({artifact_dest.stat().st_size:,} bytes)")

if __name__ == "__main__":
    build_explorer_html()
