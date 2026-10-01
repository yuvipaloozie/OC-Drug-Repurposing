# Full graph integration

The 2,404-paper extraction produced 4,436 unreviewed claims. This iteration cached 2,117 NCBI Gene records and checked molecular mentions against exact registry aliases and species, without further paid model calls.

## Applied changes

| Table | Before | After | Added |
| --- | ---: | ---: | ---: |
| Entities | 267 | 314 | 47 |
| Relationships | 338 | 397 | 59 |
| Evidence records | 351 | 410 | 59 |
| Experiments | 54 | 113 | 59 |
| Contexts | 9 | 66 | 57 |
| Publication sources | 45 | 96 | 51 |

The added evidence records remain `automated_extraction`, relationships remain `proposed`, and experiments/contexts remain pending review. Experiment rows are claim-specific descriptions, not evidence of independent replication. Unverified doses, durations and assay details were not promoted from model output. The original model responses remain immutable.

The existing six-table schema is unchanged. Molecular forms use distinct gene, RNA and protein nodes. New local IDs include molecular form and NCBI gene locus, for example `LOCAL:gene:NCBIGene:12894`; they are not UniProt or transcript accessions. Protein accession and transcript identity remain pending. Two new process labels use the established pathway entity category and are explicitly local definitions. No new ontology accession is invented.

## Concrete example

PMID:37917194 reports that deleting Cpt1a in osteoclast progenitors impaired osteoclast formation only in female mice. The gene maps to NCBI Gene 12894. The resulting proposed positive normal-role relationship points to the separate osteoclast-formation endpoint. The source quote retains the female-specific limitation. The sign means that loss of the gene reduced the outcome in that experiment; it does not establish that a CPT1A inhibitor will reproduce the effect. Context and source qualifications remain available through the evidence record.

## Identity and interpretation checks

- Exact registry aliases plus explicit paper species are required for molecular projection; entity form is not collapsed from gene to protein.
- An explicitly foreign or unsupported taxon cannot be replaced by the host animal's species.
- Recorded subject/object, measured endpoint, and perturbation direction are checked before projection. Phosphorylation alone does not establish activation: these changes remain unsigned.
- Associations remain unsigned. Formation, differentiation and activity are not silently merged.
- Quarantined sources are not rehabilitated. Background statements, hypotheses and no-effect assertions remain in staging for separate handling.
- Source bytes are checked against frozen hashes and every projected quote is rechecked against exact passage offsets.

The 4,377 deferred claims remain in `data/staging/full_integration_v1/claim_outcomes.jsonl` with reasons. Many concern chemicals, unresolved species or ambiguous experimental roles. This is a first connected integration, not completion of chemical/complex/reaction grounding. Exact-alias rules can miss genuine synonyms. Registry identity is not biological validation; no expert-review status is assigned.

## Artifacts and reproduction

1. `python -m src.ingest.ground_full_enrichment` caches public registry records and generates `data/staging/full_grounding_v1`.
2. `python -m src.kg.integrate_full_enrichment` prepares and validates a byte-preserving before/after patch.
3. `python -m src.kg.integrate_full_enrichment --apply` applies idempotently and rebuilds JSON, browser data, Neo4j, all workbook copies, sources CSVs and the manifest.
4. `python -m src.kg.integrate_full_enrichment --rollback` restores the exact pre-integration tables only when current tables match the applied snapshot. It refuses to overwrite subsequent edits.

`entity_decisions.jsonl` records mappings and registry provenance, `claim_outcomes.jsonl` links claims to edges or deferral reasons, and `summary.json` records counts. These are in `data/staging/full_integration_v1`. The original extraction has no mutation or deletion. Preliminary patches are explicitly named as unapplied drafts.

The viewer layout and controls are unchanged. Informed-use relationships increase from 68 to 127, while strict experimental eligibility stays at two. No new paid extraction was needed.
