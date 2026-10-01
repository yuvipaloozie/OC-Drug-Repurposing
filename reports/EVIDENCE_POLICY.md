# Evidence-informed discovery and optional strict auditing

The graph's default analysis policy is now **informed**, not an all-or-nothing experimental gate. Stored review statuses are not automatically changed. The viewer remains an inventory browser; it does not acquire a drug-ranking workflow or additional mode controls.

## Modes

| Mode | Use |
| --- | --- |
| `informed` (default) | Traverse source-linked claims, including proposed claims, and expose their evidence tier and uncertainty. With a source ledger loaded, unresolved citations remain outside this mode. |
| `discovery` | Also permits source-linked claims with unresolved source metadata, clearly provisional. Known quarantines and citation-topic mismatches remain excluded. |
| `strict` | Retains the reviewed-claim, checked-passage/checksum, reviewed-experiment, and reviewed-context requirements. Each linked experiment must match the edge context on species/cell type; incompatible contexts across a path are excluded. |

`evidence_eligible(edge_id)` remains a compatibility API for **strict** eligibility only. It no longer defines what the default graph analysis can use. `assess_edge(edge_id, mode=...)` returns usable status, tier, heuristic weight, support sources, contradicting sources and warnings. Existing `find_mechanism_paths(..., evidence_only=True)` selects strict; `False` selects discovery. Unlike the old unrestricted topology switch, False does not permit known quarantined assertions to support paths. The viewer's all-claims display still includes those records for audit.

## Evidence tiers

| Tier | Base weight | Requirement |
| --- | ---: | --- |
| Reviewed experiment | 1.00 | Existing strict edge requirements met |
| Curated database | 0.80 | Explicit curated claim from a supported structured database with usable provenance; no local experimental record required |
| Reviewed passage | 0.65 | Reviewed supporting quotation/paraphrase with source and location; experiment/context may remain incomplete |
| Extracted candidate | 0.25 | Nonquarantined supporting evidence with text; extraction may be unreviewed |
| Citation-only candidate | 0.15 | Traceable nonquarantined source support, but no qualifying passage yet |

These weights are **uncalibrated policy choices**, not probabilities, evidence grades endorsed by a professional body, or fitted ML parameters. We should evaluate them against benchmark performance before interpreting numerical rankings scientifically. A lower tier is usable information, not a rejection. The database tier requires the claim itself to be curated; merely setting `source_db=reactome` is insufficient. Import adapters still need to establish what their source records mean.

Known mismatched citations cannot support a claim. Quarantined evidence cannot be reused through an edge-level citation fallback. If another independent, nonquarantined source supports the relationship, it remains usable unless the claim itself is quarantined. Evidence with only contradiction is reported as an excluded assertion with its negative evidence, not converted into support. An unresolved identity creates a warning/downweighting, not a blanket ban; known-invalid claims should remain explicitly quarantined in canonical data.

## Paths and scores

- Single-edge paths are now valid. This makes target-to-phenotype inspection work without inventing an intervening node.
- Only signed `ACTIVATES`, `INHIBITS`, and `REGULATES` relationships propagate a direction. Signed regulation can be indirect and context-specific; the code does not establish causality.
- `CATALYZES`, reaction participants, transport, translation and membership steps remain traversable with a structural/biochemical designation. They do not silently contribute a positive causal sign. Mixed or unsigned routes are returned with unresolved direction and cannot count as a predicted inhibitory effect. No flux, reaction stoichiometry, or kinetic model was implemented.
- Species names and simple formatting variations are normalized for comparison. Context differences are warnings and penalties in informed/discovery modes; they are not silently pooled as the same experiment. Optional `target_context` enables comparisons with the intended species/cell type. Synonyms such as BMM versus a fully spelled-out preparation are not automatically inferred.
- Contradictory evidence stays visible and reduces a route's heuristic weight. Opposing signed routes are returned separately. Multiple records from the same paper do not increase a route's weight merely by repetition.
- A route's weight is its weakest edge's tier weight divided by the square root of path length, multiplied by qualification penalties: 0.6 for a context mismatch, otherwise 0.85 for incomplete context; 0.85 for pending endpoint identity; 0.5 when contradictory evidence is present. These are transparent heuristics, not calibrated probabilities. The source/experiment/context details remain available for inspection.
- The reported mechanism feature is the strongest desired-direction route weight minus the strongest opposing-direction route weight. `mechanism_coverage` means a desired-direction route exists, even if there is equally strong opposition. `graph_coverage` includes unsigned/opposing routes. Inspect these alongside the feature; a zero feature does not mean no evidence exists.
- Default search limits are eight edges and 1,000 returned paths; both are configurable. A path-count cap is explicitly reported through `search_truncated`. Truncated results are not an exhaustive ranking, and callers can increase the cap or narrow the query. Depth is a scope limit, not a quality judgment.

`score_drug_mechanism` returns supporting, opposing, unsigned, and all paths, plus exclusion reasons encountered from reachable nodes. Its `contradiction_flag` includes contradictory-only excluded edges encountered by the search; it is a review signal, not proof of inconsistent experiments under identical conditions. Missing registry data on hand-built graphs is surfaced as a warning. Normal CSV loading automatically uses the neighboring canonical source ledger. Held-out-paper masking carries the filtered ledger forward.

## Snapshot when the evidence policy was introduced

The inventory is unchanged: 267 nodes, 336 claims, 349 evidence records. No candidate was relabeled as scientifically reviewed.

| Policy | Usable relationships |
| --- | ---: |
| Strict | 2 |
| Informed | 66 |
| Discovery | 66 |

The 66 comprise two reviewed-experiment relationships, four reviewed-passage relationships, and **60 citation-only candidates**. The equal informed/discovery totals reflect this snapshot, not identical policies. There are currently no usable imported database-tier or automated-extraction-tier canonical edges; the PubTator discovery queue remains staging data. The code supports those tiers for future reviewed imports and candidate promotion.

PHGDH and PSAT1 now each return their one-step positive phenotype relationship, along with longer provisional routes whose direction can remain unresolved. This is target-level exploration. A drug-level inhibitory hypothesis still requires an explicit, sourced drug-target interaction; the code does not assume every drug inhibits its target.

## API examples

```python
# No Neo4j is required. Load the same canonical CSVs as before.
g.load_from_csv(nodes_csv, edges_csv, experiments_csv, evidence_csv, contexts_csv)

# Default: return evidence-informed target-to-endpoint routes.
paths = g.find_mechanism_paths('LOCAL:protein:mouse:PHGDH')

# Optional strict audit; now also handles a one-edge target route.
strict = g.find_mechanism_paths('LOCAL:protein:mouse:PHGDH', mode='strict')

# Score only after an actual drug node and drug-target interaction are supplied
# to the analysis graph; the canonical biological graph stays separate.
result = g.score_drug_mechanism(
    drug_id, mode='informed',
    target_context={'species': 'mouse', 'cell_type': 'BMM'},
)
```

## Export and UI compatibility

Derived JSON/Neo4j relationship properties now include `informed_usable`, `evidence_tier`, `evidence_weight`, and `evidence_warnings`. The existing `evidence_eligible` property retains strict meaning. Canonical CSVs and their scientific fields are unchanged, and workbook copies still mirror those canonical tables rather than storing derived ranking weights as experimental measurements.

The viewer keeps all existing layout, interaction and evidence controls. Its previous “Eligible for scoring” option is renamed **“Strict experimental evidence”** so the narrow audit subset is not mistaken for the entire usable graph. Default display remains all recorded claims. There are no added sliders, policy dashboards or drug-ranking panels.

Regression coverage includes single-step paths, database facts without experiments, provisional extraction, quarantines, citation mismatches with independent support, context transfer, unsigned biochemical routes, supporting/contradicting records, opposing routes, unresolved citations, leakage masking and explicit search limits. All 43 tests pass.

## PYK2 development integration update

At the PYK2 checkpoint, the inventory contained 267 nodes, 338 claims and 351 evidence records. Informed/discovery analysis can use 68 claims; strict remains two. Two new proposed PTK2B relationships use the existing extracted-candidate tier, not a new or stricter gate. Optional `causal_basis` and `effect_level` fields preserve interpretation, and path warnings state that protein depletion does not establish the effect of catalytic drug inhibition. See [the integration report](history/DEVELOPMENT_GROUNDING_AND_PYK2.md).

## Full-corpus integration update

At the first full-corpus integration, the inventory had 314 entities, 397 claims and 410 evidence records. The 59 new source-anchored proposals use the existing extracted-candidate tier; informed usability increases from 68 to 127, while strict eligibility remains two. No evidence gate was tightened. Projection deferrals describe identity or interpretation tasks, not rejection of the underlying papers. See [the full integration report](history/FULL_GRAPH_INTEGRATION.md).

## Resolution/connectivity iteration

At the v2 checkpoint, the graph had 357 entities, 451 relationships, 466 evidence records, and 181 informed-usable claims. Strict eligibility remains two. The tier policy is unchanged; chemical-treatment sign projection and identity resolution improved upstream. Observational expression changes are unsigned, and the connectivity benchmark excludes intermediate phenotype shortcuts. The separate chemical-effects layer is not a direct-binding database. See [the iteration report](history/RESOLUTION_CONNECTIVITY_ITERATION.md).

## Identity and enrichment quality pass

The current graph has 378 nodes, 475 relationships, 490 evidence records, 199 informed-usable relationships and two strict experimental relationships. Evidence weights are unchanged. Four previously usable legacy chemical relationships and two erroneous pharmacological-target projections were quarantined; 24 source-anchored proposals were added. Registry identity resolution does not promote biological evidence. See [the quality report](RESOLUTION_QUALITY_PASS.md).
