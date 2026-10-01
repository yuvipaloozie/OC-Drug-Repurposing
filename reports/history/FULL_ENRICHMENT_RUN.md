# Full literature extraction run

Status: extraction stopped and saved outputs assembled. Completion counts below distinguish a complete corpus from a partial run.

- Prepared papers: 2404 (50 frozen evaluation papers excluded).
- Attempted papers: 2404.
- Completed papers: 2404.
- Claims passing automated checks, still unreviewed: 4436.
- Papers with accepted claims: 2011.
- Rejected claims: 1123.
- Token-derived cost estimate: $29.9749 (cache discounts excluded).
- Billed-or-reserved accounting including uncertain requests: $29.9749.
- Enforced run ceiling: $90.00; user maximum $100.
- Canonical graph mutations: 0.

## Outputs

The repository's `data/staging/full_enrichment_v2/claims.jsonl` retains exact evidence, source IDs and hashes, molecular forms, experimental context, model and prompt provenance. `review_queue.csv` is the readable review queue; `extraction_summary.json` includes claim types and rejection reasons. Each shard retains its raw responses, validation outputs, and spending ledger. The prepared corpus is frozen in `data/staging/full_enrichment_prepared_v2`.

## Interpretation

Passing automated checks establishes the output format and passage anchoring, not biological accuracy. These are proposed claims. Registry grounding, context-aware relationship projection, and a reversible graph patch are the next steps. Gene, RNA, and protein mentions remain distinct; perturbation outcomes do not automatically become drug effects. The live canonical viewer remains unchanged by this extraction run.

## Reproduction

Run `python -m src.ingest.run_full_enrichment`, then `python -m src.ingest.finalize_full_enrichment`. Already attempted requests are skipped; failed or ambiguous requests are not automatically charged again. Credentials are loaded locally and are never included in output artifacts. Do not delete ledgers to retry a paid run.
