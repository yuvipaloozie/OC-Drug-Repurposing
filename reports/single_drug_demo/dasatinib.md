# Single-drug demonstration: dasatinib

This tests coverage and sign-aware traversal in the existing graph. It is not an efficacy prediction.

## Drug and target input

Dasatinib is an approved kinase inhibitor. The label lists eight kinase targets/groups in section 12.1. Only SRC has a candidate protein node in this graph. BCR-ABL is a fusion and is not silently equated with ABL1.

| Label target | Candidate in KG |
|---|---|
| BCR-ABL | Not represented |
| SRC | LOCAL:protein:mouse:SRC |
| LCK | Not represented |
| YES | Not represented |
| FYN | Not represented |
| c-KIT | Not represented |
| EPHA2 | Not represented |
| PDGFRbeta | Not represented |

Current candidate identity status: LOCAL:protein:mouse:SRC: registry_gene_species_protein_accession_mapped. The label does not verify inhibition of the particular mouse protein. A temporary, citation-only drug-to-SRC edge therefore represents a conditional transfer assumption. No canonical drug, claim, evidence or experiment was added.

## Results

| Endpoint | Mode | Supporting | Opposing | Unsigned |
|---|---|---:|---:|---:|
| PATHWAY:OSTEOCLAST_DIFFERENTIATION | informed | 0 | 1 | 0 |
| PATHWAY:OSTEOCLAST_DIFFERENTIATION | strict | 0 | 0 | 0 |
| PATHWAY:BONE_RESORPTION | informed | 1 | 0 | 0 |
| PATHWAY:BONE_RESORPTION | strict | 0 | 0 | 0 |

A zero feature here means missing eligible connectivity, not a predicted biological null effect. No search was allowed to reinstate quarantined claims.

## Partial routes and stopping points

- Full candidate route to PATHWAY:OSTEOCLAST_DIFFERENTIATION: LOCAL:drug:dasatinib -> LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:VAV3 -> LOCAL:protein:mouse:RAC1 -> LOCAL:protein:mouse:WAS -> LOCAL:protein:mouse:CTTN -> PATHWAY:OSTEOCLAST_DIFFERENTIATION. Warnings: context_incomplete, context_mismatch, endpoint_identity_pending, genetic_perturbation_not_equivalent_to_drug_inhibition, inferred_functional_role_not_direct_activation, not_strict_experimental_evidence.
- Full candidate route to PATHWAY:BONE_RESORPTION: LOCAL:drug:dasatinib -> LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:VAV3 -> LOCAL:protein:mouse:RAC1 -> LOCAL:protein:mouse:WAS -> PATHWAY:BONE_RESORPTION. Warnings: context_incomplete, context_mismatch, endpoint_identity_pending, genetic_perturbation_not_equivalent_to_drug_inhibition, inferred_functional_role_not_direct_activation, not_strict_experimental_evidence.
- LOCAL:drug:dasatinib -> LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:VAV3 -> LOCAL:protein:mouse:RAC1 -> LOCAL:protein:mouse:WAS -> LOCAL:protein:mouse:CTTN -> PATHWAY:PODOSOME_BELT; net sign 0; evidence-weight heuristic 0.044244 (not probability).
- LOCAL:drug:dasatinib -> LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:VAV3 -> LOCAL:protein:mouse:RAC1 -> LOCAL:protein:mouse:WAS -> LOCAL:protein:mouse:CTTN -> PATHWAY:PODOSOME_BELT -> PATHWAY:F_ACTIN_SEALING_ZONE; net sign 0; evidence-weight heuristic 0.040962 (not probability).
- Blocked edge:0052: LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:PTK2B; quarantined_claim.
- Blocked edge:0060: PATHWAY:F_ACTIN_SEALING_ZONE -> PATHWAY:BONE_RESORPTION; quarantined_claim.
- Blocked EDGE_STR_0358: LOCAL:protein:mouse:SRC -> LOCAL:protein:mouse:PXN; no_nonquarantined_source_support.

## Interpretation and next curation task

This drug exercises the cytoskeleton/resorption branch, not a demonstrated metabolic route. Differentiation and bone resorption are separate endpoints. Source-check target engagement/species transfer and the links from SRC/VAV3 through actin organization to bone resorption. Registry mapping does not establish these mechanisms. Any reported context mismatch or incomplete context remains a limitation on the full candidate route. Expand other target branches separately. Absence of opposing routes does not establish absence of opposing biology.

The molecular/chemical ML lane is not run here. No clinical exposure, selectivity or therapeutic benefit is estimated. This is a reproducible engineering demonstration, not a claim of novel repurposing.

## Reproduce

`python -m src.kg.single_drug_demo`

The run is offline and verifies the cached source hash. The JSON records all six canonical input hashes, source provenance, mapping gaps, full paths and exclusion reasons. Canonical input hashes were unchanged.

Source: [DailyMed label, section 12.1](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9b79d54-9bee-4c93-9c87-f3e65d91f146). Retrieved 2026-09-30T04:21:19.117704+00:00. The source snapshot is separate from the canonical KG source ledger.
