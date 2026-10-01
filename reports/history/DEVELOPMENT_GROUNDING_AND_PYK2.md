# Development grounding and first proposed-claim integration

The next iteration prioritizes correct entity identity and correct interpretation of perturbations. A graph can become more connected while becoming less useful if it attaches findings to the wrong protein or reverses a functional sign. The development sample contains a concrete example of both failure modes.

## What changed

- Added a reproducible, cached NCBI Gene cross-check for 229 development-set gene identifiers, plus independently cross-linked UniProt mouse PTK2B and PTK2 records.
- Added development-only grounding and perturbation-sign sidecars. Gene, RNA and protein forms remain distinct; missing specimen species is not supplied from a provider's chosen identifier.
- Applied a reversible primary-source patch: two proposed PTK2B relationships, two endpoint-specific experiment records, one context and one publication record. No new nodes were needed.
- Corrected the mouse PTK2B and PTK2 protein accessions using matching species, gene symbols and NCBI Gene cross-references. The old structure candidates remain in the patch's before snapshot. A validated protein identity is not validation of an experimental 3D structure.
- Added optional edge fields `causal_basis` and `effect_level`. The path scorer propagates genetic-perturbation transfer warnings without excluding proposed hypotheses or changing evidence-tier weights. Existing viewer details display the explanatory review note; no new UI controls or layout were introduced.
- Rebuilt canonical-derived JSON, browser assets, Neo4j exports, all three workbook copies, evidence ledgers and the checksum manifest.

## Illustrative example: PYK2, not FAK

The development packet for [Duong et al., PMID 11102447](https://pubmed.ncbi.nlm.nih.gov/11102447/) contains an incorrect PubTator normalization: the surface name PYK2 was assigned mouse Gene 14083/Ptk2. The model then suggested the existing PTK2/FAK node. Registry comparison separates these identities:

| Entity | Mouse NCBI Gene | Mouse UniProt | Canonical node |
| --- | --- | --- | --- |
| PYK2 / PTK2B | [19229](https://www.ncbi.nlm.nih.gov/gene/19229) | [Q9QVP9](https://www.uniprot.org/uniprotkb/Q9QVP9/entry) | LOCAL:protein:mouse:PTK2B |
| FAK / PTK2 | [14083](https://www.ncbi.nlm.nih.gov/gene/14083) | [P34152](https://www.uniprot.org/uniprotkb/P34152/entry) | LOCAL:protein:mouse:PTK2 |

The primary PubMed abstract and cached PubTator abstract match exactly. The study reports that antisense treatment reduced endogenous PYK2 protein and reduced osteoclast bone resorption and actin-ring formation in murine cultures. The original model assigned a negative sign to the normal protein's relationship with resorption, confusing the effect of depletion with the inferred role of the protein.

The qualified interpretation is:

```text
Observed experiment:
PYK2 protein depletion -> lower bone resorption

Proposed normal-protein role:
PTK2B/PYK2 -- REGULATES (+), role inferred from depletion --> bone resorption
```

The inference is context-dependent, not proof of a direct activating interaction. It does not establish that inhibiting PYK2's catalytic activity has the same effect as reducing its abundance. This qualification is stored as `causal_basis=genetic_perturbation_role_inference`; the existing path output now includes `genetic_perturbation_not_equivalent_to_drug_inhibition` and `inferred_functional_role_not_direct_activation`.

The resorption relationship traces to extracted:063108912d1b31fc70804253. The actin-ring relationship is an explicitly documented AI-assisted extension from the same primary abstract, not a claim that the model originally extracted it. Osteoclast formation was not silently mapped onto the broader differentiation/multinucleation endpoint. Unknown dose, duration, assay, viability and unreported stage remain unfilled.

## Development audit, not a benchmark accuracy claim

Only the 193 retained development claims were processed; no held-out claim was used to tune these rules. Entity counts below count mentions within claim records, not distinct molecules.

| Finding | Count |
| --- | ---: |
| Registry alias candidates | 124 |
| Gene/protein/RNA mentions still unresolved | 102 |
| Other forms requiring separate grounding | 479 |
| Provider-ID/alias/taxon discrepancy flags | 34 |
| Model node hints not confirmed | 23 |
| Gene/RNA/protein form conflicts with node hints | 11 |
| Qualifying genetic perturbation sign candidates | 22 |
| Model sign disagreements among those candidates | 16 |

These flags are not all confirmed extraction errors: incomplete alias coverage, missing species and ambiguous names can produce flags. No bulk relabeling was performed. The sign calculation is a review candidate based on stated perturbation and outcome directions, not a general guarantee of monotonic causal biology. A chemical treatment is not automatically equated with a genetic loss-of-function result.

## Graph impact and evidence policy

| Inventory | Before | After |
| --- | ---: | ---: |
| Nodes | 267 | 267 |
| Relationship claims | 336 | 338 |
| Evidence records | 349 | 351 |
| Publication records | 44 | 45 |
| Experiments | 52 | 54 |
| Contexts | 8 | 9 |
| Informed-usable relationships | 66 | 68 |
| Strict experimental relationships | 2 | 2 |

The two new claims remain `proposed`, evidence remains `automated_extraction`, and experiment/context review remains pending. Exact quotation checking is distinguished from scientific approval. Both use the existing extracted-candidate tier (base heuristic weight 0.25). Multiple endpoints from this paper are not independent replication. No dose/effect size or drug-efficacy claim was invented, and no legacy quarantined edge was rehabilitated.

The graph now contains a usable, qualified one-step PTK2B-to-bone-resorption path. It does not by itself create a valid drug-to-target link or resolve the earlier dasatinib coverage gap.

## Local code and reproducibility

- `src/ingest/cache_development_registries.py`: public registry snapshots, hashes and offline cache verification.
- `src/ingest/ground_development_claims.py`: identity/form/species cross-checks and separate observed-versus-normal-role signs.
- `data/staging/development_grounding_v1/grounded_claims.jsonl`: per-claim grounding candidates and flags; raw model outputs remain unchanged.
- `src/kg/integrate_pyk2_pilot.py`: bounded primary-source decision, six-table patch, stale-state protection, apply and rollback.
- `data/staging/pyk2_integration_v1/patch.json`: exact before/after canonical bytes and hashes, registry decisions and new edge IDs.
- `src/kg/graph.py`: inference-basis warnings propagated into edge assessment and paths.
- `tests/test_development_grounding.py`: mistaken-provider identity, molecular-form separation, unknown species, perturbation signs, patch round-trip/idempotence and path qualifications.

```powershell
python -m src.ingest.cache_development_registries --offline
python -m src.ingest.ground_development_claims
python -m src.kg.integrate_pyk2_pilot --apply
# Optional deliberate rollback, only against the exact after-state:
python -m src.kg.integrate_pyk2_pilot --rollback
```

The integration script refuses to overwrite canonical data changed after the patch was prepared. Applying an already-applied patch does not duplicate evidence. Caught application errors restore prior canonical bytes; this is not a claim of crash-atomic transactions across six files. Run rebuild after any deliberate manual restoration.

No paid model calls were made in this iteration. The live viewer keeps its existing UI and receives the rebuilt data. Next expand reviewed identity decisions and context-aware projections across development mechanisms, and build a reaction-focused evaluation sample; zero retained metabolic conversions from the first pilot remains an unresolved coverage issue.

Verification completed: 66 tests run, 63 passed and three optional structure tests skipped. Patch apply/rollback round trips and stale-state refusal passed; reapplying the live patch returned already_applied. The live HTTP graph data serves both new relationships. The offline dasatinib demo was rerun against the updated inputs.
