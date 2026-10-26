# Biological source audit and graph readiness

## Scope and outcome

On 2026-10-02, this assistant checked 34 core relationship representations against primary literature or cached registry annotations. The audit covers 21 registry-supported relationships, eight supported with limitations, three context-dependent interpretations, one measured-pool representation assumption, and one partial biochemical reaction. The other 469 relationships are explicitly marked as not newly adjudicated in this pass. See `claim_audit.csv` for every relationship and `audit_summary.json` for findings.

This is source-based scientific scrutiny, not independent human annotation, laboratory replication, or validation of all 503 relationships. Extraction precision, recall, and drug-ranking accuracy remain unknown. The frozen 50-paper review packet still needs independent annotations.

## Biological corrections and additions

- **PHGDH/serine metabolism:** PHGDH affects the measured alpha-ketoglutarate pool through the pathway; it does not directly catalyze alpha-ketoglutarate synthesis. The three registry-specific serine reactions balance both elements and charge. This verifies representation, not osteoclast metabolic flux. Chromatin demethylation remains a partial reaction.
- **NCT-503 specificity:** [a primary study](https://pmc.ncbi.nlm.nih.gov/articles/PMC8253182/) reports PHGDH-independent metabolic effects in neuroblastoma cells, including knockout cells. The drug-target input and resulting paths now preserve this caveat. These experiments do not establish the same off-target effect in osteoclasts; they prevent assuming that every NCT-503 phenotype proves PHGDH mediation.
- **KDM6B/JMJD3:** [a RAW264 study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3339979/) reports normal differentiation after stable knockdown. This limits universal necessity claims without disproving catalysis or findings in different primary precursor models. This counterexample was checked through the web-indexed primary Results passage; full-text download was unavailable in this run.
- **PRMT6:** promoter H3R2me2a loss after Prmt6 deletion supports a positive contribution, so the over-specific ACTIVATES relationship was changed to REGULATES with a genetic-perturbation inference qualifier. Fatty-acid oxidation conclusions remain model-specific.
- **Itaconate/TET2:** [direct biochemical evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC9305987/) was added as a separate claim: inhibition of purified mouse TET2 catalytic-domain activity, reported IC50 171 micromolar. This is not osteoclast potency. Native itaconate, its octyl derivative, conditioned medium, and TET-family nuclear-extract assays remain distinct experimental interpretations.

Changes are reversible through `data/staging/biological_validation_v1/patch.json`, which requires matching before/after hashes. Historical reconstruction applies the serine-module patch first, then this audit patch. Do not apply an earlier patch over a later dataset.

## What the graph represents

The biological inventory has **396 nodes**: 231 proteins, 69 genes, 18 RNA entities, 41 compounds, eight reactions, and 29 pathways/processes. Labels are predominantly mouse: 326 mouse, eight human, six rat, and 56 taxon-independent/all labels.

There are **503 relationship claims**, supported or qualified by **518 evidence records**, **197 experiments**, **137 contexts**, and **154 source records**. These supporting records are relational tables, not 503 independent experiments or 154 independently confirming publications. Evidence links a claim to a passage/source and, when available, an experiment and its conditions.

A sign of +1 means a recorded positive effect, -1 a negative effect, and 0 unknown or unsigned. A positive sign is not necessarily a direct biochemical activation. Identity mappings, associations, and reaction participation do not imply positive regulation. Gene, RNA, and protein are distinct; ENCODES and TRANSLATED_TO do not establish that a drug reproduces gene deletion.

An example explanatory route is PHGDH protein -> serine-pathway reactions -> alpha-ketoglutarate pool -> chromatin demethylation -> Nfatc1 RNA -> osteoclast differentiation. Each step retains its own source and experimental context. Unsigned participation prevents the full route from becoming a signed drug prediction automatically. The graph is neither a flux model nor a trained drug-efficacy model.

## Descriptive statistics and robustness

| Measure | Current result |
|---|---:|
| Relationships eligible for informed exploration | 224 / 503 |
| Strict experimental relationships under current policy | 2 |
| Largest component, all recorded claims | 379 / 396 nodes |
| Largest component, informed relationships | 180 / 396 nodes |
| Isolated nodes after informed filtering | 181 |
| Mouse proteins with signed paths to an endpoint, depth <=4 | 38 / 225 |
| Signed protein-endpoint pairs | 46 |
| Pairs with an intermediate mechanism | 19 |
| Genes with an eligible ENCODES mapping | 4 / 69 |

Component counts use an undirected simple projection with all nodes retained; direction, parallel claims, and context matter separately for inference. Endpoint coverage uses directed signed traversal to four prespecified osteoclast endpoints and is not predictive accuracy. Only 23 protein-endpoint pairs have complete species and cell context; 33 lack a reported species/cell mismatch. Unknown context does not establish compatibility.

All 224 eligible claims currently have one qualifying recorded source each. This counts source identifiers, not verified independent biological replications. Removing PMID:38200114 reduces current PHGDH-to-Nfatc1 RNA paths from four to zero. The graph has explanatory value and traceability, but limited redundancy, human-target coverage, and complete contextual mechanisms. Improving these is more informative than adding unsupported connectivity.

## FDA layer: inventory first, evaluation labels separately

The official Orange Book snapshot contains 48,761 product rows, 2,374 exact ingredient names, and 1,718 ingredient names with listed RX/OTC products. Of these, 1,556 have a listed single-ingredient product. These counts are not resolved unique small molecules. Salt forms and combinations are retained explicitly; discontinued products are distinguished. The Orange Book does not cover the full biologics universe.

See [the FDA inventory](../../data/fda/README.md). Every osteoclast activity label remains unknown. The next steps are identity/structure resolution, evidence-backed target mappings, and graph coverage measurement across a fixed candidate universe. Drug structures can feed the chemical-model lane; targets feed the mechanistic lane. Their ranking performance should be compared on the same independently labeled compounds.

An efficacy test set additionally needs independently sourced outcomes, dose, viability, formation versus resorption endpoints, and model/species. Unknown results are not negatives. Freeze evaluation labels and use compound/scaffold and source-paper separation to avoid leakage. NCT-503 is a development control, not an independent held-out validation result, because its supporting mechanism paper helped construct this module.

## Reproduce current reports

```powershell
python -m src.kg.biological_validation
python -m src.kg.graph_statistics
python -m src.ingest.fda_inventory
python -m src.kg.rebuild
python -m src.kg.evaluate_serine_module
python -m unittest discover -s tests -q
```

These commands use local retained inputs and do not initiate paid extraction. `python -m src.ingest.fda_inventory --refresh` explicitly downloads a new official snapshot; refresh is not scheduled automatically. Current verification: 104 tests run, 101 passed, three optional-environment tests skipped. Viewer layout is unchanged; biological records and exported data were rebuilt.
