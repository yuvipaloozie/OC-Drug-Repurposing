# Osteoclast Drug Repurposing: Contextual Mechanism Knowledge Graph & Molecular Graphs

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](tests/test_kg.py)
[![KG-Release](https://img.shields.io/badge/KG_Release-K0_Consolidated-blue)](data/manifest.json)
[![Topology](https://img.shields.io/badge/Topology-267_Nodes_%7C_334_Edges-success)](data/processed/osteoclast_knowledge_graph.json)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

A reproducible, leakage-safe machine learning and systems biology framework to predict and rank FDA-approved small molecules that inhibit **osteoclast differentiation, activity, and pathological bone resorption**. 

This repository implements the high-resolution, multi-scale **Osteoclast Mini-PrimeKG (Branch 2)** and bridges to an **Atom-Bond Molecular GNN (Branch 1)** for multimodal late fusion.

---

## 🔬 Architectural Principles

### 1. Pure Biological Topology (Strictly Exogenous-Drug-Free)
To ensure zero graph leakage during downstream machine learning and GNN screening, **exogenous drug nodes are completely removed from the graph topology**. 
- **Total Biological Nodes**: **267** pure biological entities (0 drug nodes).
- **Total Biological Edges**: **334** unique, consolidated causal and physical interactions (0 multi-edge redundancy).
- **Deduplicated Scientific Evidence**: Redundant edge pairs sharing identical response polarity (`sign: +1`) have been merged into single consolidated edges, seamlessly uniting PMIDs, DOIs, wet-lab assay details, STRING v12.0 confidence scores, and literature quotes.
- **Drug Pharmacology Encryption**: All clinical drug indications, approved small molecules, mAbs, and mechanisms are encrypted strictly as rich node properties (`known_targeting_drugs`, `drug_interaction_count`, `small_molecule_tractability`) on biological target nodes (e.g., c-Src, Cathepsin K, RANKL, Calcineurin).

### 2. The 9 Physiological Pillars
Every biological node in the network is categorized into one of 9 physiological pillars of osteoclastogenesis:
1. **`differentiation`** (127 nodes): RANKL/RANK signaling, TRAF6-TAB-TAK1 axis, NFATc1 master transcription factor autoamplification, c-Fos/AP-1, PU.1, MITF, and epigenetic remodelers (KDM6B, EZH2, EP300).
2. **`metabolism`** (52 nodes): Aerobic glycolysis surge (HK2, PFKFB3, PKM2, LDHA), TCA cycle, glutaminolysis (GLS), serine-one-carbon biosynthesis (PHGDH), fatty acid oxidation (CPT1A, PRMT6), and itaconate immunometabolism (ACOD1/IRG1, TET2).
3. **`activity_acidification`** (22 nodes): Howship's resorption lacuna acidification, V-ATPase a3 rotor complex (TCIRG1, ATP6V0D2), ClC-7/Ostm1 antiporter, Carbonic Anhydrase II (CA2), Cathepsin K (CTSK), and TRAP (ACP5).
4. **`morphology_cytoskeleton`** (21 nodes): Circumferential podosome belt and actin sealing zone assembly, $\alpha_v\beta_3$ integrin, c-Src kinase clamp, Pyk2 (PTK2B), Vav3, RhoA, Rac1, Cdc42, and cortactin (CTTN).
5. **`inflammation`** (21 nodes): Pro-resorptive and anti-resorptive cytokine cascades (TNF-$\alpha$, IL-1$\beta$, IL-6, IL-17, IFN-$\beta$, IFN-$\gamma$), TLR4/MyD88, and PGE2/EP4.
6. **`immunomodulation`** (10 nodes): Costimulatory ITAM adapter signaling (DAP12/TYROBP, FcR$\gamma$/FCER1G), TREM2, OSCAR, Syk kinase, Btk, and calcium oscillatory flux.
7. **`maturation_fusion`** (7 nodes): Polykaryon syncytium formation, DC-STAMP, OC-STAMP, CD47-SIRP$\alpha$, Syncytin, moesin (MSN), and SNX10 vesicle trafficking.
8. **`interactions_with_other_processes`** (4 nodes): Osteoblast-osteoclast bidirectional coupling (EphrinB2-EphB4, Sclerostin/SOST, Semaphorin 4D), and hypoxia-inducible crosstalk (HIF-1$\alpha$, VEGF).
9. **`hormonal_influence`** (3 nodes): Endocrine systemic bone modulators, Calcitonin receptor (CALCR), Estrogen receptor alpha (ESR1), and PTH1R.

---

## 🧬 Multi-Database Data Encryption

Every node is annotated with standardized multi-scale biophysical, structural, and genomic properties:
- **UniProtKB**: Primary accession IDs, canonical amino acid sequences, sequence lengths, molecular mass (Da), and curated splice isoforms.
- **AlphaFold DB & RCSB PDB**: Predicted structures, per-residue confidence scores (pLDDT > 80), empirical RCSB PDB structure IDs, and interactive WebGL viewer links.
- **InterPro & Pfam**: Zinc-finger domains (C3HC4 RING, C2H2), catalytic triads, kinase active loops, calpain/caspase cleavage sites, and death domains.
- **PhosphoSitePlus & UniProt PTM**: Regulatory phosphorylation residues (e.g., c-Src Tyr416/Tyr527, Akt Thr308/Ser473, PFKFB3 Ser461, NFATc1 Ser172/233), activating autophosphorylation vs autoinhibitory clamps, and ubiquitination acceptor sites (Lys48/Lys63).
- **Pan-Disease Clinical Genomics**: Cross-disease phenotypes across Oncology, Autoimmune/Inflammation, Cardiovascular/Metabolic, and Neurodegeneration with somatic/germline mutation hotspots (ClinVar, COSMIC).
- **Tissue Proteomics & Metabolomics Flux**: Quantitative baseline expression in osteoclasts, macrophages, osteoblasts, liver, brain, and spleen, accompanied by pathway flux directionality.
- **PubChem & Rhea**: Isomeric SMILES, InChIKey, molecular formula, exact MW, calculated LogP, topological polar surface area (TPSA), formal charge, reaction EC numbers, and Gibbs free energy ($\Delta G^{\circ\prime}$).
- **STRING v12.0 & OmniPath**: High-confidence physical protein-protein interaction backbone, directional causality flags (`is_causal`), and consensus signs (`+1` activation, `-1` inhibition).
- **STITCH, FANTOM4, Harmonizome, RNAInter, MeSH**: Chemical-protein association confidence, transcription start site CAGE peaks, non-coding RNA interactome scores, and Medical Subject Headings (MeSH) UIDs.

---

## 🖥️ Interactive 3D Mol* Conformation Viewer

An interactive, zero-dependency standalone HTML5/WebGL explorer is included at [`osteoclast_3d_conformation_explorer.html`](osteoclast_3d_conformation_explorer.html):
- **Split-Screen Interface**: Cytoscape.js 2D knowledge graph network on the left, coupled to an embedded 3D Mol* (RCSB PDB / AlphaFold) and PubChem 3D WebGL viewer on the right.
- **Click-to-Load Conformations**: Clicking any protein node immediately loads its AlphaFold DB predicted structure or high-resolution RCSB PDB experimental crystal/cryo-EM structure.
- **Live Metabolite Conformations**: Clicking any endogenous metabolite/compound loads its 3D ball-and-stick spatial model.
- **Comprehensive Metadata Panel**: Real-time display of UniProt accession, pLDDT scores, pan-disease associations, tissue proteomics, metabolomics flux, and downstream causal neighbors.

---

## 📊 Master 8-Tab Excel Evidence Workbook

The master evidence workbook [`osteoclast_knowledge_graph_sources.xlsx`](osteoclast_knowledge_graph_sources.xlsx) provides 100% provenance and literature backing:
1. **Tab 1: All Evidence & Sources** (1,010 rows): Complete literature citations, CrossRef DOIs, primary databases, physiological pillars, and experimental findings.
2. **Tab 2: Node-Paper Mappings** (1,010 rows): Exact node IDs, subcellular compartments, physiological pillars, and mapped scientific literature.
3. **Tab 3: Pan-Disease & Clinical Genomics** (268 rows): Oncology, autoimmune, CVD, and neurodegenerative disease associations, ClinVar/COSMIC mutation hotspots, and OMIM disease IDs.
4. **Tab 4: Multi-Tissue Proteomics & Flux** (268 rows): Quantitative tissue expression profiles, metabolic flux directionality, and rate-limiting pathway steps.
5. **Tab 5: Novel Cross-Talk Pathways** (268 rows): Mechanistic cross-talk beyond canonical osteoclastogenesis (e.g., ferroptosis, cGAS-STING, mechano-transduction, senescence).
6. **Tab 6: GNN Chemical & Atom Features** (20 rows): SMILES, InChIKeys, LogP, TPSA, HBD/HBA, rotatable bonds, aromatic rings, and DGL-LifeSci atom/bond featurizer dimensions.
7. **Tab 7: Single-Cell & Causal Dynamics** (268 rows): Pseudotime peaks, kinetic expression profiles, single-cell benchmark marker statuses, polarization states, Recon3D subsystems, and FANTOM4 CAGE peaks.
8. **Tab 8: Hallucination Verification Audit** (1,001 rows): Full zero-hallucination verification matrix confirming 100% of UniProt, AlphaFold, PDB, InChIKey, and CrossRef DOIs against official registries.

---

## 🤖 Downstream GNN Retrospective Validation

This knowledge graph is designed so that a downstream GNN (predicting atomic-level drug-target binding affinity) can be retrospectively confirmed against biological pathway outcomes:
- **DGL-LifeSci Canonical Featurization**: Chemical entities pre-featurized according to DGL-LifeSci 74-dimensional `CanonicalAtomFeaturizer` (atomic number, chirality, degree, formal charge, radical electrons, hybridization, aromaticity, hydrogens) and 12-dimensional `CanonicalBondFeaturizer` (bond type, conjugation, ring membership, stereo).
- **Single-Cell Trajectory & Pseudotime**: Continuous pseudotime coordinates (0.0 to 1.0) along the single-cell developmental trajectory:
  $$\text{Monocyte/BMM } (0.00) \longrightarrow \text{Early Pre-OC } (0.25) \longrightarrow \text{TRAP}^+ \text{ Mononuclear } (0.50) \longrightarrow \text{Prefusion Polykaryon } (0.75) \longrightarrow \text{Mature Syncytium } (1.00)$$
- **Macrophage Polarization States**: Stepwise polarization transition flags ($M_0 \to M_1 \to M_2 \to \text{Pre-OC} \to \text{Resorbing Polykaryon}$).

```
[Small Molecule Atoms & Bonds] ──────────► [ Molecular GNN / ECFP ] ─────┐
                                                                           │
                                                                           ▼
                                                                 [ Late Fusion Model ] ──► [ Calibrated Ranking ]
                                                                           ▲
                                                                           │
[Curated Reactions + Multiomics Literature] ──► [ Contextual Mechanism KG ] ─┘
(Rhea + Reactome + PubTator + Experiments)
```

---

## 3. Seed Biological Modules (Validated in K0)

1. **Serine Synthesis Pathway $\rightarrow \alpha\text{KG} \rightarrow$ Chromatin $\rightarrow$ NFATc1**  
   *Reference:* Stegen et al. 2024 (*Nature Metabolism*, PMID: [38200114](https://pubmed.ncbi.nlm.nih.gov/38200114/))  
   Rate-limiting enzyme **PHGDH** couples with PSAT1 to produce $\alpha$-ketoglutarate ($\alpha\text{KG}$), serving as an indispensable co-substrate for Jumonji/KDM histone demethylases that remove repressive methylation at the *Nfatc1* master locus. Pharmacological inhibition by **CBR-5884** blocks differentiation in vitro and preserves bone mass in OVX mice.

2. **PRMT6 Epigenetic Checkpoint $\rightarrow$ FAO Repression $\rightarrow$ Glycolytic Switch**  
   *Reference:* Chu et al. 2024 (*Advanced Science*, PMID: [39120025](https://pubmed.ncbi.nlm.nih.gov/39120025/)); osteoblast countereffect: Wang et al. 2026 (PMID: [42757825](https://pubmed.ncbi.nlm.nih.gov/42757825/))  
   RANKL stimulates **PRMT6**, which catalyzes asymmetric dimethylation of H3R2 (H3R2me2a) at promoters of fatty acid oxidation (FAO) genes (*Ppard*, *Acox3*, *Cpt1a*), repressing FAO and forcing a shift toward glycolysis. **EPZ020411** reverses this switch and protects against osteoporotic bone loss.

3. **Glutaminolysis / GLS1 $\rightarrow$ Nucleotide & Amino Acid Supply**  
   *Reference:* Hu et al. 2024 (*EMBO Reports*, DOI: [10.1038/s44319-024-00255-x](https://doi.org/10.1038/s44319-024-00255-x))  
   Independent metabolic arm where **GLS1** drives glutamine breakdown to support nucleotide biosynthesis and bioenergetics required for osteoclast fusion, inhibited by **CB-839 (Telaglenastat)**.

4. **Intercellular Immunometabolism: Macrophage Itaconate $\rightarrow$ TET2 Inhibition**  
   *Reference:* Rong et al. 2025 (*Bone Research*, DOI: [10.1038/s41413-025-00437-w](https://doi.org/10.1038/s41413-025-00437-w))  
   Inflammatory macrophages synthesize **itaconate** via ACOD1/IRG1. Secreted itaconate acts as an intercellular signal taken up by osteoclast precursors, where it directly inhibits **TET2** 5hmC DNA demethylation, dampening pathological osteoclast activation in inflammatory bone erosion.

5. **Pyruvate / Acetyl-CoA / SIRT3-PDHA1 Axis $\rightarrow$ Histone Acetylation**  
   *Reference:* Peng et al. 2026; SIRT3 deacetylates **PDHA1** at K321 to enhance pyruvate dehydrogenase activity, delivering acetyl-CoA pools for nuclear histone acetylation at osteoclastogenic promoters.

6. **Canonical RANKL Context Backbone**  
   `TNFSF11` (RANKL) $\rightarrow$ `TNFRSF11A` (RANK) $\rightarrow$ `TRAF6` $\rightarrow$ `NFKB1`/`FOS` $\rightarrow$ `NFATC1` $\rightarrow$ `CTSK` / `ACP5` (TRAP).

---

## 4. Inspirations & Comparative Advantages vs. Prior Works

| Feature | STRGNN (Ohnuki et al. 2024) | DREHGNN (Jia & Zhang 2026) | **Our Osteoclast Repurposing Framework** |
| :--- | :--- | :--- | :--- |
| **Molecular Representation** | 2D SMILES / RDKit Morgan | 3D Equivariant GNN (EGNN, SE(3)) | 2D/3D Atom-Bond GNN with rigorous scaffold-split baselines (ECFP) |
| **Biological Graph** | Static multiomics (STRING, HMDB, CTD) | Static DDI + MeSH + CTD | **Cell-context-specific, signed, directed mechanism multigraph** |
| **Edge Causality** | Unsigned associations | Unsigned links | **Signed ($\pm 1$) causal routes: Drug $\rightarrow$ Target $\rightarrow$ Metabolic flux $\rightarrow$ Chromatin $\rightarrow$ Phenotype** |
| **Microenvironment** | None (whole body / disease level) | None (disease MeSH terms) | **Osteoclast differentiation stages, bone marrow macrophages, osteoblasts** |
| **Leakage Defense** | Random edge split (high risk) | Standard cross-validation | **Source paper masking: dynamic per-fold graph rebuilding to prevent ground truth leakage** |
| **Explainability** | Attention over generic nodes | Graph node embeddings | **Audit-trailed paths with exact figure, quote, dose, and assay provenance** |

---

## 5. Repository Structure

```
OC-Drug-Repurposing/
├── configs/
│   └── kg_config.yaml           # Master configuration: thresholds, rules, model configs
├── data/
│   ├── raw/                     # Raw snapshots (PubTator, Rhea, Reactome, ChEMBL, FDA)
│   ├── interim/                 # Triaged text chunks, unmapped entity dictionaries
│   ├── processed/
│   │   ├── osteoclast_knowledge_graph.json       # Master 267-node, 334-edge Graph JSON
│   │   ├── osteoclast_knowledge_graph_sources.xlsx # Master 8-tab Excel Workbook
│   │   ├── nodes.csv                             # Relational nodes table
│   │   ├── edges.csv                             # Relational edges table
│   │   ├── experiments.csv                       # Relational wet-lab assay table
│   │   ├── edge_evidence.csv                     # Relational evidence audit trail
│   │   └── contexts.csv                          # Relational cellular context table
│   └── manifest.json            # Versioned provenance manifest (SHA256, dates, licenses)
├── neo4j/
│   ├── import_osteoclast_kg.cypher               # Clean creation of 267 nodes & 334 edges
│   ├── enrich_nodes.cypher                       # Multi-omics property enrichment
│   ├── deduplicate_edges.cypher                  # In-place Neo4j edge deduplication
│   ├── load_to_neo4j.py                          # Automated Python HTTP transactional loader
│   ├── sample_queries.cypher                     # Biological & causal queries
│   └── style.grass                               # Neo4j styling grass file
├── src/
│   ├── enrichment/
│   │   ├── master_pipeline.py                    # Master multi-omics orchestration pipeline
│   │   ├── pan_disease_multiomics_catalog.py     # Pan-disease, proteomics, and flux catalog
│   │   ├── primekg_enrichment_builder.py         # Multi-database property mapper
│   │   ├── gnn_chemical_featurizer.py            # DGL-LifeSci Canonical featurizer
│   │   ├── single_cell_sc_enricher.py            # Pseudotime & trajectory calculator
│   │   ├── hallucination_auditor.py              # Zero-hallucination verification auditor
│   │   └── build_master_xlsx_workbook.py         # Dynamic multi-tab Excel generator
│   ├── kg/
│   │   ├── graph.py                              # Signed MultiDiGraph engine
│   │   └── verify_kg.py                          # Graph topology validator
│   └── visualization/
│       └── build_3d_conformation_explorer.py     # Interactive Mol* 3D WebGL app builder
├── tests/
│   └── test_kg.py                                # Graph consistency and leakage tests
├── osteoclast_3d_conformation_explorer.html      # Standalone interactive 3D WebGL explorer
├── osteoclast_knowledge_graph_sources.xlsx       # Master 8-Tab Excel Evidence Workbook
├── requirements.txt
└── README.md
```

---

## 6. Neo4j Deployment & Quickstart

### Automated Script Load
Run the transactional loader in your terminal (requires Neo4j Desktop active):
```bash
python3 neo4j/load_to_neo4j.py --password YOUR_NEO4J_PASSWORD
```

Or enrich existing nodes with pan-disease associations and 3D viewers:
```bash
python3 neo4j/load_to_neo4j.py --password YOUR_NEO4J_PASSWORD --enrich-only
```

### In-Place Edge Deduplication in Neo4j
If your database already contains multi-edges, run:
```bash
python3 neo4j/load_to_neo4j.py --password YOUR_NEO4J_PASSWORD --file neo4j/deduplicate_edges.cypher
```

### Visualizing the Mini-PrimeKG in Neo4j Browser
1. Connect to `http://localhost:7474` (or Neo4j Desktop).
2. Drag and drop `neo4j/style.grass` into the Neo4j Browser window to apply color schemes.
3. Verify the 9 physiological pillars:
```cypher
MATCH (n) 
RETURN n.physiological_pillar AS pillar, count(n) AS node_count 
ORDER BY node_count DESC;
```
4. Query 3D Conformation Viewers and Pan-Disease associations:
```cypher
MATCH (n) 
WHERE n.alphafold_3d_viewer IS NOT NULL 
RETURN n.name, n.alphafold_3d_viewer, n.pan_disease_associations 
LIMIT 10;
```
5. Inspect single-cell differentiation dynamics:
```cypher
MATCH (n)
WHERE n.sc_pseudotime_peak IS NOT NULL
RETURN n.name, n.sc_pseudotime_peak, n.sc_stage, n.sc_polarization_state
ORDER BY n.sc_pseudotime_peak ASC;
```

---

## 7. Running Unit Tests
```bash
python3 -m unittest tests/test_kg.py
```
