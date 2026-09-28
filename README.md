# Osteoclast Drug Repurposing: Contextual Mechanism Knowledge Graph & Molecular Graphs

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](tests/test_kg.py)
[![KG-Release](https://img.shields.io/badge/KG_Release-K0-blue)](data/manifest.json)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

A reproducible, leakage-safe machine learning and systems biology framework to predict and rank FDA-approved small molecules that inhibit **osteoclast differentiation, activity, and pathological bone resorption**. 

This repository implements the **Contextual Mechanism Knowledge Graph (Branch 2)** and bridges to an **Atom-Bond Molecular GNN (Branch 1)** for multimodal late fusion.

---

## 1. Scientific Rationale & Architecture

Osteoclasts are multinucleated, bone-resorbing polykaryons derived from monocyte/macrophage lineage precursors. While canonical therapeutics (e.g., bisphosphonates, anti-RANKL antibodies like Denosumab) blunt bone loss, they face severe long-term complications (atypical femur fractures, osteonecrosis of the jaw, adynamic bone disease).

Drug repurposing in bone biology has historically suffered from two failure modes:
1. **Chemistry-Only Predictors (Molecular GNNs alone)**: Can detect structural motifs that bind a target in vitro, but cannot determine whether that target is expressed or functionally coupled to chromatin regulation during the precursor differentiation window.
2. **Generic Heterogeneous Graphs (e.g., DREHGNN, STRGNN)**: Leverage massive, static biomedical networks (STRING, DrugBank, CTD, MeSH). However, they lack **cell-type context**, **differentiation kinetics**, **signed directionality** (activation vs. inhibition), and suffer from **severe literature-derived data leakage**.

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

## 2. Knowledge Graph Schema (Five Canonical Tables)

The knowledge graph is modeled as a signed, directed multigraph implemented in `src/kg/graph.py` and strictly validated across five relational tables in `data/processed/`:

| Table | Primary Key | Description & Key Columns |
| :--- | :--- | :--- |
| **`nodes.csv`** | `node_id` | Namespaced stable IDs (`HGNC:`, `CHEBI:`, `CHEMBL:`, `CHREV:`, `PHENO:`, `REACT:`), `type`, `name`, `taxon`, `compartment`, `aliases`. |
| **`edges.csv`** | `edge_id` | `source_id`, `relation` (`INHIBITS`, `ACTIVATES`, `CATALYZES`, `REGULATES`), `target_id`, `sign` ($\pm 1$), `context_id`, `source_db`, `source_record_id`, `status`. |
| **`experiments.csv`** | `experiment_id` | Detailed wet-lab assay records: `paper_id`, `model_system`, `species`, `cell_type`, `differentiation_stage`, `treatment`, `dose`, `duration`, `endpoint`, `assay`, `measured_effect`, `viability`, `figure_or_table`. |
| **`edge_evidence.csv`**| `(edge_id, exp_id)`| Verifiable audit trail: `quote_or_location`, `evidence_kind` (`perturbation`, `rescue`, `measurement`, `association`), `polarity` (`support`, `contradict`), `curator_status`, `reviewed_at`. |
| **`contexts.csv`** | `context_id` | Controlled biological state: `species`, `cell_type`, `stage`, `compartment`, `disease_setting`, `note`. |

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
│   ├── processed/               # Canonical 5 tables (nodes, edges, experiments, evidence, contexts)
│   └── manifest.json            # Versioned provenance manifest (SHA256, dates, licenses)
├── schemas/
│   └── models.py                # Pydantic & Dataclass schema definitions
├── src/
│   ├── ingest/
│   │   └── pubtator_parser.py   # PubTator 3.0 BioC-JSON extraction and claim proposal
│   ├── chemistry/               # Atom-bond molecular featurizers (RDKit)
│   ├── kg/
│   │   └── graph.py             # Signed MultiDiGraph engine, path scoring & leakage filtering
│   ├── models/                  # Molecular GNN, GAT, and Logistic Fusion models
│   └── evaluation/              # Scaffold-split cross-validation and prospective ranking
├── tests/
│   └── test_kg.py               # Unit tests verifying graph consistency and leakage safety
├── notebooks/                   # Interactive analysis and visualization notebooks
├── reports/                     # Prospective candidate ranking files and ablation ledgers
├── requirements.txt
└── README.md
```

---

## 6. Quickstart & Verification

### Running Unit Tests
```bash
python3 -m unittest tests/test_kg.py
```

### Loading and Scoring Candidates
```python
from src.kg.graph import OsteoclastKnowledgeGraph

# Initialize graph
kg = OsteoclastKnowledgeGraph()
kg.load_from_csv(
    nodes_path="data/processed/nodes.csv",
    edges_path="data/processed/edges.csv",
    experiments_path="data/processed/experiments.csv",
    evidence_path="data/processed/edge_evidence.csv",
    contexts_path="data/processed/contexts.csv",
)

# Score CBR-5884 for osteoclast differentiation inhibition (desired sign: -1)
result = kg.score_drug_mechanism("CHEMBL:CBR5884", desired_phenotype_effect=-1)
print("Mechanism Coverage:", result["mechanism_coverage"])
print("Mechanism Feature Score:", result["mechanism_feature"])
print("Surviving Validated Paths:", len(result["paths"]))
for p in result["paths"]:
    print(" -> ".join(p["nodes"]))
```

---

## 7. Git Remote Setup

To push this repository to GitHub:
```bash
git remote set-url origin https://github.com/yuvipaloozie/OC-Drug-Repurposing.git
git add .
git commit -m "feat: initialize osteoclast knowledge graph K0 release, schemas, and tests"
git push -u origin main
```
