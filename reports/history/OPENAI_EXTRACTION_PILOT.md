# OpenAI extraction pilot results

The local OpenAI integration is configured and the 150-paper pilot is complete. The key is stored in Windows Credential Manager, not in repository files. No canonical graph data or viewer content changed.

| Result | Count |
| --- | ---: |
| Papers completed | 150 |
| Papers with claims passing implemented checks | 122 |
| Unreviewed claims passing checks | 277 |
| Claims set aside by validation | 93 |
| Unique exact-quotation offset repairs | 409 |
| Approximate token cost, excluding cache discounts | $2.5066 |
| Spending ceiling | $8.00 |
| Canonical graph mutations | 0 |

The retained claims comprise 107 regulatory effects, 158 perturbation effects and 12 associations. No metabolic-conversion claim passed validation in this sample. This is a gap to investigate, not evidence that metabolic reactions are absent from the corpus. Development and held-out sets remain separate: 193 and 84 retained claims respectively, from the original 100/50 paper split.

Passing a check does not establish biological correctness. Scientific precision/recall has not been measured. Four hypotheses, four no-effect observations and one negated relation remain in the ledger without being marked projection candidates. Source identity, molecular form, taxon and causal interpretation still need grounding and scientific evaluation before canonical integration. The 277 records are not 277 new graph edges.

Validator findings (a rejected claim may have several):

- unsigned relationship has causal sign: 39
- regulatory form mismatch: 15
- unknown regulatory participant: 12
- unknown reaction participant: 1
- quote not uniquely anchorable: 15
- invented annotation ID: 12
- invented existing node ID: 3

All source text used for accepted evidence was matched exactly. Incorrect model-generated character offsets were repaired only where the quotation matched uniquely; raw responses preserve the original offsets and the validation record preserves the repair. The large number of offset corrections reinforces why source anchoring belongs in deterministic code.

## Files and reproduction

- `data/staging/openai_claim_pilot_parallel_v1/claims.jsonl`: unreviewed claim sidecar, with source hashes, prompt/schema hashes, run/model versions and response/validation links.
- `data/staging/openai_claim_pilot_parallel_v1/review_queue.csv`: human-readable claim review queue.
- `data/staging/openai_claim_pilot_parallel_v1/extraction_summary.json`: aggregate results.
- `data/staging/openai_claim_pilot_v1`: initial three-paper smoke test ($0.0588, included in the total).
- `data/staging/openai_claim_pilot_parallel_v1/shard_*`: immutable response files, validation records, usage/reservation ledgers and sanitized logs.

Run `python -m src.ingest.summarize_claim_extraction` to regenerate the ledger and review queue without API calls. See [OpenAI extraction setup](../OPENAI_EXTRACTION_SETUP.md) for the provider, encrypted credential setup, costs, runtime commands and retry behavior.

Verification: 61 tests run, 58 passed and three optional RDKit tests skipped in the base environment. The credential scan found zero plaintext copies in 1,281 repository files at the time of the scan; common secret-file paths are ignored by Git. Initial preparation source hashes confirm the canonical node file remained unchanged.

Next: label and inspect development examples, address reaction extraction coverage, resolve molecular identities, then generate a reversible graph patch. Keep held-out claims isolated from prompt tuning. Neither extraction success nor graph connectivity establishes drug efficacy.
