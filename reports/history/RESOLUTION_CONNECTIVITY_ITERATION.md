# Resolution and connectivity iteration

This iteration reused the existing 2,404-paper corpus. It made no paid model calls and did not change the viewer layout or evidence-tier policy.

## Results

- Audited a reproducible diagnostic sample of 47 deferred claims: seed 20261001, up to three per deferral category. Source passages and metadata were inspected with AI assistance. This is not a random prevalence estimate, blinded expert review, or a measured scientific accuracy score.
- Applied 56 additional proposed evidence records, comprising 54 new relationships and extra support on two existing relationships. Added 43 entities.
- Current graph: **357 entities, 451 relationships, 466 evidence records**, 181 informed-usable relationships, and two strict experimental relationships.
- Queried 45 recurring spelled-out chemical names. Forty had one PubChem result with an exact returned synonym and an InChIKey. Five remained ambiguous/unmatched. Name matching does not establish biological role, stereochemical sufficiency in the experiment, or physiological protonation.
- Saved **125 source-linked chemical effects across 34 PubChem identities**, including 42 records with a target already in the canonical graph. This is a separate chemical-effects layer, not a list of established direct drug-target bindings or FDA approvals.

## Measured improvement

The comparison uses the same 210 pre-existing mouse protein starting nodes and four fixed endpoints: differentiation, bone resorption, formation, and actin-ring/sealing-zone formation. It searches at most four edges and 1,000 paths per pair. No search hit the cap. A path with another endpoint as an intermediate shortcut is excluded from the benchmark. Unsigned associations do not count as signed mechanisms.

| Metric, same 210 proteins | Before | After |
| --- | ---: | ---: |
| Proteins with a signed endpoint route | 23 | 24 |
| Signed protein-endpoint pairs | 24 | 29 |
| Pairs with a multi-step route | 9 | 12 |
| Pairs with a route without reported species/cell mismatch | 17 | 23 |
| Pairs with a route with species/cell labels present and no reported mismatch | 14 | 18 |

With the expanded 221 mouse proteins, 30 proteins reach an endpoint across 35 signed pairs. The fixed-start comparison is the fairer test of connectivity improvement. Missing or matching context labels do not establish experimental compatibility; sex, dose, disease and intervention still require review. Counts describe unreviewed candidate routes, not validated predictions.

One added candidate route is IL22 -> RANKL -> osteoclast differentiation. The co-culture and indirect-action qualifications remain in the evidence. Another recovered relationship is Pkn3 -> c-Src activity: the source explicitly describes protein binding/kinase activity, and the registry name supports the c-Src synonym.

## What changed in the pipeline

1. **Chemical effects have their own projection rule.** A chemical exposure that reduces an outcome retains a negative observed-effect sign. It is not sent through knockout-to-normal-role inversion. Opposing model/outcome signs remain deferred. Effects on expression are not asserted to be physical target binding.
2. **Species is resolved from additional evidence.** Missing species can use a single explicitly named paper species, or RAW264.7 from Cellosaurus CVCL_0493. Multiple species remain unresolved without a specific entity/context assignment. A foreign transgene is not replaced by the host species.
3. **Synonym handling improved.** Greek letters and parenthetical names are checked against registry aliases. Explicit registry names such as proto-oncogene c-Src supply the c-Src synonym. Gene families are not reduced to arbitrary members. A model's wrong suggested node does not veto an independent match with the correct form/species.
4. **Molecular-form corrections are bounded.** Three source-reviewed claim records have specific protein-form corrections for binding/kinase contexts. Original extraction records remain unchanged; corrected working copies and decisions are saved. No blanket gene-to-protein conversion or inferred translation links were added.
5. **Observational changes stay unsigned.** MAGL expression increasing during differentiation is an association, not proof that differentiation causes MAGL activity. This correction removed inflated paths from the initial diagnostic count.
6. **Processes retain their meaning.** Bone loss, osteoclast formation, differentiation, apoptosis, and composite outcomes are not silently collapsed into the same endpoint. Local process nodes use the existing pathway category and make no external ontology-accession claim.

## Remaining limitations and the drug example

Within the fixed four-edge target benchmark, the cached dasatinib label still yields no complete signed target-to-osteoclast route. The separate eight-edge drug-overlay search finds one opposing differentiation route, but it mixes osteoclast and stromal-cell contexts and is flagged for context mismatch; it supplies no supporting inhibition route. An apparent SRC -> resorption route from PMID:16627750 was inspected in its full cached abstract and deferred: it mixes human tumor xenografts, mouse hosts, genetic constructs and pharmacological inhibition without identifying the osteoclast-assay species/intervention precisely enough for the proposed mouse-protein edge. It is a concrete full-text follow-up, not a reason to declare dasatinib ineffective.

The chemical-effects layer separately records published dasatinib observations, including reduced osteoclastogenesis in PMID:19092851. These are literature observations, not independent predictions and not evidence to validate the same graph that learned them. A future evaluation must hold those papers out.

The canonical conversion now covers 115 of the 4,436 extracted claims across both integrations; 4,321 remain outside the canonical graph. Chemical-layer counts can overlap canonical evidence and must not be added to that total. Short acronyms, compound mixtures, isoforms, transcript sites, uncertain species, and poorly anchored experimental roles still require work. Protein accession/structure identity remains pending for new gene-locus-grounded proteins. This iteration improves retrieval-to-graph conversion and measured connectivity; it does not establish biomedical precision or clinical utility.

## Files, reproducibility and rollback

- `src/ingest/prepare_resolution_iteration.py`: sample generation, cached PubChem queries, species/synonym handling and explicit form corrections.
- `src/kg/integrate_resolution_iteration.py`: separate chemical projection, canonical patch application and chemical-effects exports.
- `src/kg/measure_resolution_connectivity.py`: fixed-start, before/after path benchmark.
- `data/staging/resolution_iteration_v2`: immutable original-derived working claims, grounding records, chemical identities and diagnostic sample.
- `data/staging/full_integration_v2`: `patch.json`, `claim_outcomes.jsonl`, `entity_decisions.jsonl`, `diagnostic_audit.csv`, `chemical_effects.csv/jsonl`, and `connectivity_comparison.json`.

On a pre-iteration checkout, run preparation, integration, and measurement in that order. `--offline` preparation replays cached public registries. Once a patch exists, preparation refuses to overwrite its inputs. `python -m src.kg.integrate_resolution_iteration --apply` verifies frozen input hashes, applies idempotently and rebuilds all supported exports. No key is needed for these public registry/offline steps.

Rollback uses `apply_patch_file(Path('data/staging/full_integration_v2/patch.json'), rollback=True)` from `src.kg.integrate_pyk2_pilot`, followed by `python -m src.kg.rebuild`. It restores v1 tables only when current tables match this patch. Earlier intermediate snapshots are named as drafts or rolled back; only `patch.json` is the applied state. Do not run the v1 rollback over v2; versioned snapshots protect later edits.

All canonical CSVs, graph JSONs, viewer data, source exports, Neo4j exports, three workbook copies and the manifest were synchronized. The website's layout remains unchanged. New evidence remains automated/unreviewed; no strict gate was relaxed or new clinical efficacy asserted.

Primary registry documentation: [PubChem PUG REST](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest), [Cellosaurus RAW264.7](https://www.cellosaurus.org/CVCL_0493). Registry response bytes and retrieval metadata are cached locally.

## Verification

All 80 tests completed: 77 passed and three optional RDKit tests were skipped. The live HTTP viewer data matches the rebuilt asset bytes. The refreshed eight-edge dasatinib overlay finds zero supporting routes and one opposing differentiation route flagged for context mismatch. That route joins citation-only osteoclast signaling to a cortactin result in stromal cells; it is not a reliable efficacy prediction. The fixed four-edge target benchmark remains at zero. Canonical table hashes were unchanged by that analysis.
