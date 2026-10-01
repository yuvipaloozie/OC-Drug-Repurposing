# Identity resolution and enrichment quality pass

This iteration completed the four requested tasks: repair known identity defects, inspect a representative deferred-claim sample, improve matching, and reintegrate with before/after measurements. It used cached literature and public registry calls; no paid model extraction calls were made. Viewer layout and evidence-tier weights are unchanged.

## Identity repairs

| Incorrect prior accession/label | Corrected graph representation |
| --- | --- |
| CHEBI:32838 / cis-aconitate | CHEBI:16383 / cis-aconitate(3-) |
| CHEBI:30805 / itaconate | CHEBI:17240 / itaconate(2-) |
| CHEBI:17544 / hydronium (H+) | CHEBI:15378 / hydron (H+) |
| CHEBI:15554 / PGE2 | CHEBI:15551 / prostaglandin E2 |

Raw ChEBI responses and hashes establish these registry identities. The selected conjugate-base representations do not establish the protonation state in an experiment. Hydron is not hydronium. Itaconic acid is not silently made an exact synonym of itaconate(2-).

All ten incident relationships were inspected. Nine legacy relationships are quarantined (five already were); they lack a resolved supporting source and several confuse substrate/product participation with activation. The source-checked qualitative itaconate/TET2 claim remains proposed with its original evidence qualifications. No mechanistic activation was inferred from correcting a chemical name. Erroneous accessions are preserved in the repair ledger, not registered as valid aliases of different chemicals. Rebuild now derives the identifier map from current nodes and explicit legacy aliases.

The protein pass checked 231 protein nodes against reviewed UniProt primary-gene/species records, requiring a matching GeneID cross-reference for new NCBIGene-based nodes. It found 222 unique matches. It replaced 186 previous accessions, including placeholders and inappropriate legacy candidates, and removed PDB lists tied to changed accessions. Nine unresolved nodes have no unverified structure fallback. Exact isoform identity and the species of every original experiment remain separate review questions; registry matching is not biological validation.

RDKit models were regenerated for the repaired compounds: 23/30 compound nodes now have display geometry, including three single-atom ions. Seven remain unavailable because the registry supplies a class, unspecified structure, or insufficient stereochemistry.

## Representative audit

We drew 120 claims without replacement from the 4,321 deferred claims, using seed 20261002. Each received an AI-assisted passage-inspection note in `data/staging/resolution_quality_v3/diagnostic_audit.csv`.

| Main follow-up identified | Sample count |
| --- | ---: |
| Chemical identity or separate exposure-layer work | 36 |
| Intervention, molecular form, species or passage interpretation | 34 |
| Background, hypothesis or no-effect statement | 26 |
| Different context or endpoint | 20 |
| Bounded projection/process mapping improvement | 4 |

Categories identify the main follow-up, not mutually exclusive scientific defects. Some differently scoped observations remain useful for future contextual or countereffect models. This is a random diagnostic sample, **not independent expert adjudication or an extraction precision/recall estimate**. It is development data; the previously held-out papers remain untouched.

## Resolver and projection changes

- Thirty recurring, species-specified names received cached NCBI Gene searches; search hits only enter matching after exact registry-alias/species checks.
- Form-consistent terminal wrappers such as `Arp2 protein` and `Ctsk mRNA expression level` can be removed for lookup without changing the original quote, molecular form or source record.
- This produced 64 additional unique gene-locus match candidates. A locus match does not authorize collapsing Bcl-xL, mature miRNA arms, variants, families or isoforms into a generic molecule; those remain deferred where specific identity is required.
- A context filled from other entities cannot supply an otherwise unresolved entity's species. A mixed-species paper remains insufficient to locate a specific experiment.
- Explicit ablation/lacking wording can support qualified genetic loss-of-function interpretation. Alveolar bone resorption, osteolysis and actin depolymerization remain distinct local processes. RANKL-induced differentiation retains its experimental condition in source/context records.
- Pharmacological inhibition of a protein is no longer projected as addition of that protein. The audit quarantined two existing erroneous projections (GSNOR and p38 blockade) and withheld a newly encountered TBK1 inhibitor projection. It does not infer a direct drug-binding edge from these observations.
- Two draft additions were withheld after whole-abstract inspection: OSCC experiments embedded in a mouse-focused review, and human tissue findings mixed with a calvarial intervention model. The paper-level species did not establish the experimental species.

All 24 additions were inspected at the passage level before applying the final integration; targeted whole-abstract checks informed the exclusions above. They remain automated, unreviewed proposals, not expert-reviewed experiments.

## Enrichment and measured coverage

The final graph has **378 nodes, 475 relationships and 490 evidence records**: 21 nodes, 24 relationships and 24 evidence/experiment records added. There are 199 informed-usable relationships and two strict experimental relationships. Existing questionable claims were removed from informed use without discarding their source history.

Across the three integration passes, 139 extracted claims have been imported at some point; two are now quarantined for projection defects. The 4,297 claims still deferred by this integration are not a count of false claims or failed name matches.

| Same 221 mouse proteins, same four endpoints, maximum four edges | Before | After |
| --- | ---: | ---: |
| Proteins reaching an endpoint | 30 | 30 |
| Signed protein-endpoint pairs | 35 | 38 |
| Pairs with an intermediate mechanism | 13 | 15 |
| Pairs without reported species/cell mismatch | 29 | 29 |
| Pairs with species/cell labels present and no reported mismatch | 21 | 21 |

Neither search hit its 1,000-path-per-pair cap; phenotype endpoints cannot serve as intermediate shortcuts. **Context-compatible coverage did not improve in this fixed-start comparison.** Identity correctness improved substantially, but remaining experimental-context and pathway gaps still limit inference. Matching labels do not establish complete compatibility across dose, sex, stage or disease. No predictive accuracy or efficacy claim follows from these counts.

The refreshed eight-edge dasatinib demo now finds a supporting resorption candidate via SRC -> VAV3 -> RAC1 -> WAS -> resorption. It still has context-mismatch/incompleteness warnings, citation-only upstream links and a genetic-depletion-to-function inference. The WASp source specifically reports impairment under resorptive challenge despite maintained steady-state resorption. It is a useful candidate route for review, not a reliable drug-effect prediction. The opposing differentiation route also remains context-mismatched; strict results remain empty. The demo now reads current node identity status instead of repeating the obsolete statement that SRC awaits registry mapping.

## Reproduction and rollback

Code: `src/ingest/resolution_quality_pass.py`, `src/ingest/report_resolution_audit.py`, `src/ingest/resolve_protein_accessions.py`, and `src/kg/integrate_quality_pass.py`. Source-specific decisions, search responses, raw hashes, patches and measurement outputs are versioned under `data/staging/resolution_quality_v3`, `data/staging/full_integration_v3` and `data/raw/provenance/resolution_quality_v3`.

From the pre-iteration six-table snapshot, the preparation sequence is identity repair, resolution preparation, audit report, integration, protein accession resolution, compound structure generation, and rebuild. Public registry stages accept `--offline` after caches exist. Intermediate patches are order-dependent and must not be applied over later snapshots.

For exact final six-table replay or rollback, use `apply_patch_file(Path('data/staging/resolution_quality_v3/release_patch.json'))` from `src.kg.integrate_pyk2_pilot`; add `rollback=True` for rollback. Then run `python -m src.kg.rebuild`. The helper verifies exact current table hashes and refuses stale state. Display SDFs remain harmless cached assets on rollback. Historical drafts are explicitly named and are not release patches.

Canonical exports, both viewers' data, three workbooks, Neo4j exports, identifier mapping and manifest are rebuilt together. Historical v1/v2 staging directories remain frozen for audit; current graph consumers should use canonical CSV/JSON tables.

Registry sources: [ChEBI](https://www.ebi.ac.uk/chebi/), [NCBI Gene](https://www.ncbi.nlm.nih.gov/gene/), [UniProt](https://www.uniprot.org/).

## Verification

The main suite completed 86 tests: 83 passed and three optional RDKit tests were skipped in the base environment. The dedicated RDKit environment separately passed all four compound-structure tests, including the three skipped cases. Structural schema checks, six-table patch apply/idempotence/rollback, species/accession consistency, false-identity exclusion and the target-inhibition regression passed. All manifest hashes and the three workbook copies match. The live HTTP viewer data matches the rebuilt local asset. Scientific precision remains unmeasured without independent biomedical adjudication.
