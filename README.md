# Osteoclast Drug Repurposing: Contextual Mechanism Knowledge Graph & Molecular Graphs

A research framework for studying small molecules that may inhibit **osteoclast differentiation, activity, and pathological bone resorption**. The project combines an osteoclast mechanism knowledge graph with a planned molecular graph branch for drug-repurposing research.

The current release contains **267 biological entities, 334 relationship claims, and 345 evidence records**, together with interactive pathway and structure explorers, relational data, Excel workbooks, and Neo4j exports. The schema and provenance repair preserves the biological inventory while distinguishing source-checked evidence from pending and quarantined assertions. This is a working research resource, not yet a validated prediction benchmark.

## Architectural Principles

### 1. Biological topology and separate drug modeling

The mechanism graph represents biological entities and their relationships. Exogenous drug candidates belong in the separate molecular modeling branch rather than becoming nodes in the current biological topology. This separation supports the intended research design, but does not by itself guarantee freedom from training or evaluation leakage.

- **267 biological nodes:** proteins, RNA, endogenous compounds, reactions, and pathways.
- **334 relationship claims:** directed relationships with positive, negative, or unknown signs. Their presence in the graph does not establish causality.
- **Individual evidence records:** multiple sources or experiments supporting the same claim remain separate records and are exported as arrays rather than overwritten.
- **Review-aware modeling:** pending and quarantined evidence remains available for curation, but cannot qualify a mechanism path for default evidence-based scoring.

Unsupported drug-target, multi-omics, and quantitative annotations from the earlier enrichment pipeline have been removed from active scientific fields. Their original values remain recoverable in `data/quarantine/legacy_snapshot.zip`.

### 2. The nine physiological modules

The original physiological organization remains available for browsing and filtering. These modules organize the inventory; they are not independent evidence of a node's function or an edge's mechanism.

| Module | Research focus |
| --- | --- |
| `differentiation` | RANKL/RANK signaling, TRAF6, NFATc1, transcriptional regulation, and chromatin-associated claims. |
| `metabolism` | Glycolysis, the TCA cycle, glutaminolysis, serine synthesis, fatty-acid metabolism, and itaconate. |
| `activity_acidification` | Resorption-lacuna acidification, proton transport, proteases, and TRAP-associated activity. |
| `morphology_cytoskeleton` | Integrins, actin organization, podosomes, sealing zones, and cytoskeletal regulators. |
| `inflammation` | Cytokine signaling and inflammatory interactions represented in the inventory. |
| `immunomodulation` | Costimulatory receptors, signaling adaptors, and calcium-associated pathways. |
| `maturation_fusion` | Precursor maturation, membrane fusion, and multinucleated osteoclast formation. |
| `interactions_with_other_processes` | Coupling to other cell types and biological processes. |
| `hormonal_influence` | Endocrine influences and hormone-associated signaling. |

### 3. Gene, RNA, and protein identity

**Protein is now a base entity type.** Enzyme and transcription-factor annotations are functional roles rather than competing top-level identities. The inventory contains 198 proteins; their legacy role assignments still require biological review.

Thirteen entities formerly labeled as genes are now represented as RNA: six mRNAs, six miRNAs, and one lncRNA. Translation relationships connect mRNA to protein. The schema supports DNA gene entities, but gene nodes or gene-to-transcript relationships have not been invented from protein symbols.

Symbol-based protein identifiers previously using the `HGNC:` prefix now use explicit local identifiers such as `LOCAL:protein:mouse:PHGDH`. RNA uses an analogous namespace. These are local identities, not verified HGNC, MGI, or UniProt accessions. `identifier_map.json` and `legacy_ids` preserve older URLs and search aliases while registry and orthology mapping remains pending.

## Source Data, Evidence, and Provenance

The canonical data is maintained in `data/processed`:

| Table | Purpose |
| --- | --- |
| `nodes.csv` | Biological identity, type, RNA subtype, roles, aliases, module, and identity-review status. |
| `edges.csv` | Stable claim IDs, source/target entities, relation, sign, context references, and claim status. |
| `contexts.csv` | Recorded species, cell type, stage, compartment, and context verification status. |
| `experiments.csv` | Experimental records and their review status; unsupported measurements are left blank. |
| `edge_evidence.csv` | Individually identified evidence records linking claims, sources, and experiments. |
| `source_records.csv` | Retrieved publication metadata and source-resolution/claim-matching status. |

Publication resolution and claim verification are separate steps. A valid PMID or DOI confirms that a publication record exists; it does not establish that the article supports the associated mechanism or experiment.

The source audit requested 44 references from Europe PMC: 42 resolved and two remained unresolved. It flagged 29 apparent citation-topic mismatches, six references needing additional claim matching, and seven relevant publications still requiring claim-level scrutiny. Five open-access full-text XML snapshots and retrieval records are included under `data/raw/provenance`.

Of the **345 evidence records**, **248 are quarantined, 94 are pending, and three contain source-checked qualitative paraphrases**. All 48 experiment records remain quarantined or pending. The checked paraphrases do not validate historical dose, duration, effect-size, or exact-context assertions.

Recovered repository narratives are retained in `claim_summary`, not presented as article quotations. Checked excerpts or paraphrases use `quote_or_location` alongside a source location, URL, checksum, and review information. Broken context and experiment references have been cleared without inventing replacements, and joined experiment IDs have been separated into individual evidence rows.

Twenty STRING-derived relationships are represented as unsigned `ASSOCIATED_WITH` claims rather than unsupported activation or inhibition. Database associations and format-valid identifiers must not be interpreted as mechanistic verification.

See the [schema and provenance repair report](reports/SCHEMA_AND_PROVENANCE_REPAIR.md), [audit changes](data/processed/audit_changes.csv), and [audit notebook](reports/provenance_audit.ipynb) for record-level details. The original data and exports remain in the quarantine archive.

## Interactive Pathway and Structure Explorers

Both HTML explorers share a research interface with rounded panels, bordered entity-detail cells, restrained teal/green/coral/gold accents, and pale category colors. The static viewers do not require Neo4j or a frontend build tool.

### Pathway explorer

Open [`index.html`](index.html) to navigate the biological graph:

- Browse the full collection or filter by physiological module.
- Search by name, symbol, current identifier, or legacy alias.
- Select an entity from the left catalog to open its neighborhood.
- Click a graph node to inspect its identity, schema fields, connections, and evidence; double-click to explore its neighborhood.
- Drag nodes to arrange them, drag the background to pan, and use zoom, Fit, Readable size, or Expand to adjust the view.

The full graph starts with wider spacing and light category/role fills. At whole-network fit, labels are necessarily small; zoom or switch to a neighborhood for detailed reading. Neighborhoods refit after their animation settles to keep their nodes inside the canvas.

Relationship details preserve all associated evidence records and show their review status. Visibility in the viewer does not mean a claim is eligible for scientific scoring.

### Structure explorer

Open [`osteoclast_3d_conformation_explorer.html`](osteoclast_3d_conformation_explorer.html) to inspect molecular shape. The viewer uses bundled 3Dmol.js and offers available structure-source candidates for the selected entity. The source selector lists usable candidates only. If just one candidate exists, it is shown as a fixed selection with an explanation; placeholder PDB IDs are excluded. For multiple candidates, choose a source and select Load 3D structure. Loading remote structures requires internet access; interactive rendering requires WebGL.

Legacy protein structure identifiers are explicitly marked as unverified candidates. Registry, species, and sequence correspondence still need checking before a structure can be treated as the correct experimental target. RNA entities are no longer treated as proteins simply because of their older labels. A rendered structure does not demonstrate target engagement, inhibition, or support for a KG relationship.

### Local quickstart

From the repository root:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Visit http://127.0.0.1:8765/index.html and switch explorers using the navigation bar. Python serves the static files; Neo4j is optional. See [viewer development](src/visualization/VIEWERS.md) for the shared templates and build process.

## Master Evidence Workbook

The rebuilt [Excel workbook](data/processed/osteoclast_knowledge_graph_sources.xlsx) contains seven sheets: a scope/read-me sheet followed by nodes, edges, contexts, experiments, edge evidence, and source records. A synchronized copy is provided under `neo4j`.

The workbook mirrors the canonical tables, including missing values and review status. It replaces the earlier eight-tab presentation of unsupported enrichment and blanket verification claims. Source CSV exports provide a flattened evidence ledger with publication metadata, while the graph JSON retains multiple evidence records per relationship.

Use the workbook for inspection and curation planning. Update canonical tables and rebuild to propagate a change across the repository; editing a generated workbook alone will not update the graph or viewers.

## Molecular Graphs and Downstream Validation

The original two-branch research direction remains:

```text
Small-molecule atoms and bonds -> Molecular model / fingerprint baseline --+
                                                                         |
                                                                         v
                                                                  Future late fusion
                                                                         |
                                                                         v
                                                              Candidate ranking
                                                                         ^
                                                                         |
Reviewed biological evidence -> Contextual mechanism knowledge graph -----+
```

The molecular branch is intended to compare chemical representations with fingerprint baselines. The mechanism branch is intended to provide inspectable biological paths with source, experiment, and context provenance. Late fusion, calibrated rankings, and a validated drug-repurposing benchmark remain development goals rather than demonstrated results.

Default mechanism-path scoring requires reviewed claim evidence, experimental support, and verified context. **No current complete mechanism path meets those gates.** For topology exploration, `find_mechanism_paths(..., evidence_only=False)` allows inspection of recorded paths without representing them as evidence-backed predictions.

Paper-held-out filtering removes claims whose only support is held out. This is one leakage control, not a complete benchmark validation. Scaffold splits, source independence, target overlap, and model calibration still need an explicit evaluation design.

Earlier generated tissue-expression values, pseudotime coordinates, mutation annotations, kinetics, and chemical features are not active validated inputs. The obsolete generators are disabled so they cannot silently restore those assertions during routine rebuilding.

## Seed Biological Modules and Curation Priorities

The original seed topics remain useful starting points for targeted literature review:

1. **Serine synthesis, alpha-ketoglutarate, and chromatin.** The checked PHGDH claim is an indirect serine-pathway effect involving PSAT1, not direct alpha-ketoglutarate production by PHGDH. The source locations are Figure 3i and Extended Data Figure 4e in cached `PMC10822776`. The earlier CBR-5884 dose/effect assertion was quarantined; it was not transferred to the paper's NCT-503 intervention.
2. **PRMT6 and fatty-acid-oxidation gene regulation.** A qualitative paraphrase from cached `PMC11516099` supports reduced H3R2 asymmetric dimethylation at FAO gene promoters with PRMT6 deficiency. Detailed experimental and contextual assignments remain under review.
3. **Glutaminolysis and metabolic support.** GLS-associated claims remain part of the inventory, with `PMC11467445` cached for review. Publication availability does not establish every recorded downstream relationship or drug-response assertion.
4. **Itaconate and TET2.** A checked qualitative claim is linked to the abstract and Results of cached `PMC12159140`. Derivative experiments, including OI, must not be assigned to parent itaconate as dose-equivalent evidence.
5. **Pyruvate, acetyl-CoA, and histone acetylation.** These remain candidate mechanisms for source-specific curation; earlier detailed residue and assay claims should not be treated as validated findings.
6. **The RANKL signaling backbone.** RANKL/RANK, TRAF6, transcriptional regulators, and downstream osteoclast-associated entities remain central navigation routes. Each relationship still needs its own evidence and context assessment.

The immediate priority is source-to-claim matching and passage-level experimental curation, followed by registry/orthology mapping and context review. These steps should precede promoting paths into the default scoring set.

## Repository Structure

```text
OC-Drug-Repurposing/
  configs/kg_config.yaml           Schema and research configuration
  data/
    raw/provenance/                Publication snapshots and retrieval records
    processed/                     Canonical CSV tables and generated exports
    quarantine/                    Original snapshot and archival notes
    manifest.json                  SHA-256 hashes of packaged artifacts
  neo4j/                           Import, loader, queries, styling, export copies
  schemas/models.py                Entity, claim, and provenance models
  src/
    ingest/                        Literature ingestion helpers
    kg/graph.py                    Graph loading, paths, and evidence gates
    kg/validate_schema.py          Structural and review-status validation
    kg/rebuild.py                  Canonical export rebuild
    visualization/templates/       Shared HTML, CSS, and JavaScript
    visualization/build_viewers.py Both browser explorers
    enrichment/                    Workbook builder and retired legacy tools
  assets/                          Generated viewer data, styling, bundled library
  reports/                         Audit findings, summary, and notebook
  tests/                           Graph and audited-schema regression tests
  index.html                       Pathway explorer
  osteoclast_3d_conformation_explorer.html
  requirements.txt
```

## Neo4j Deployment

Neo4j is useful for database queries and inspection, but is not required for the browser explorers. Rebuild the export, then import into an empty database:

```powershell
python -B -m src.kg.rebuild
python neo4j/load_to_neo4j.py --password YOUR_NEO4J_PASSWORD
```

The export includes biological nodes and relationships plus separate Claim, Evidence, Source, Experiment, and Context records. Protein and RNA labels follow the revised identity model; functional roles supplement the Protein label.

Existing databases can retain old IDs and enrichment properties. Back up and review their contents before choosing a reset or fresh import. The legacy enrichment, deduplication, and drug-removal Cypher files are retired no-ops. A live Neo4j import has not been executed as part of this repair.

Example inspection queries:

```cypher
MATCH (n:Protein) RETURN n LIMIT 100;
MATCH (n:RNA) RETURN n;
MATCH (v:Evidence)-[:EVIDENCE_FOR]->(c:Claim)
WHERE v.curator_status <> 'reviewed'
RETURN v, c LIMIT 100;
```

See the [Neo4j guide](neo4j/README.md) and generated sample queries for more detail.

## Validation and Reproducible Rebuilds

```powershell
python -B -m src.kg.verify_kg
python -B -m src.kg.rebuild
python -B -m unittest discover -s tests -v
```

Structural validation checks identifiers, foreign keys, entity types, RNA translation relationships, and review requirements. A structural PASS does not certify biological truth or model readiness.

Rebuild synchronizes both graph JSON copies, browser assets, inventory, source ledgers, both Excel workbooks, Neo4j artifacts, and the file-hash manifest. It performs no network enrichment and does not automatically promote records to reviewed status. Legacy export and master-pipeline entry points redirect to this rebuild.

The repair passed 20 unit/regression tests, including evidence preservation, invalid-reference rejection, source checksums, export consistency, and held-out support handling. A fresh Git checkout also passed the suite with all 43 manifest artifacts present. Git attributes preserve checksum-covered bytes, and the required provenance snapshots are included in version control.

The remaining scientific work is documented in the [repair report](reports/SCHEMA_AND_PROVENANCE_REPAIR.md). Test success establishes software/data consistency within these checks; it does not resolve the pending literature review or validate a repurposing prediction.
