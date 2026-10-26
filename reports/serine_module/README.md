# Serine module and evidence-policy iteration

Current generated inventory: **396 nodes, 503 relationships, 518 evidence records**.
Informed usable: 224. Strict experimental: 2. Neither is a count of independently validated facts.

## What changed

- Evidence resolution and tier are assessed per supporting record. Context-compatible support cannot borrow the tier of incompatible support.
- Sex and other qualifiers remain structured in context/experiment JSON. Unknown conditions remain available; known mismatches are returned separately from the requested scenario score.
- Three serine-synthesis reactions use registry-specific chemical participants. INPUT_TO and OUTPUT_OF both point compound → reaction; traversal explicitly reverses OUTPUT_OF to reach products. Participation and gene/product mappings remain unsigned.
- Four source-backed ENCODES relationships connect gene and protein identity without inventing transcripts. Translation retains unspecified isoforms; it does not assert abundance-to-activity causality.
- The measured alpha-ketoglutarate pool is separate from its protonation states. Source-specific chromatin/RNA interpretation replaces three over-specific legacy activation claims. The endpoint has separate NFATc1 loss evidence in a different precursor model.
- Drug-target rows record accession/taxon, assay, potency, source, measured/predicted status, and transfer assumptions. NCT-503 is a research control, not an FDA candidate in this input set.

## Observed example

PHGDH → RHEA:12641 → 3-phosphonatooxypyruvate → RHEA:14329 → 2-oxoglutarate → Nfatc1-locus H3K27 demethylation → Nfatc1 RNA.
This is a connected explanatory route with unresolved overall direction because reaction participation is unsigned. It is not a flux simulation or a calibrated drug prediction.
The explicit human-to-mouse NCT-503 scenario returns 16 paths: 1 compatible-or-unknown signed supporting paths, 15 unsigned paths, and 15 context-incompatible paths (categories can overlap). The direct signed supporting route uses genetic functional-role evidence and retains that transfer warning.
Exact accession/taxon matching alone finds no mouse target for the human assay. Cross-species use requires the explicit scenario option; the human IC50 is never relabeled as mouse potency.

## Validation and boundaries

10 automated development checks passed; see evaluation.json. These are not independent accuracy estimates.
Fifty frozen papers are exported as blinded source packets with an empty human review sheet. Precision and recall remain null until independent adjudication. Original seed-source overlap is recorded and must be paper-masked for evaluation.
The module preserves failed serine/formate/succinate rescue and timing limitations in data/modules/serine_boundary_observations.json. The chromatin reaction is a contextual partial representation, not a mass-balanced genome-scale model.
PRMT6/fatty-acid and itaconate/TET2 modules remain subsequent curation work; this iteration completes the first bounded serine module, not all osteoclast metabolism.

## Reproduce

```powershell
python -m src.kg.rebuild
python -m src.kg.evaluate_serine_module
python -m unittest tests.test_serine_iteration
```

Historical data construction applies the serine patch followed by the biological-validation patch to their matching input checkpoints. Do not reapply an earlier patch to the current later dataset. The integration patch checks exact before/after table hashes, supports rollback, and retains input hashes. Applying it to a later incompatible dataset refuses overwrite. No extraction or paid API calls are made.
