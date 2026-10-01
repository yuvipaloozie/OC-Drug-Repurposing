# OpenAI extraction setup and pilot

The OpenAI Responses adapter, local credential support, structural/evidence-span validator and bounded pilot runner are implemented. Grounding, canonical patch integration and scientific evaluation remain separate next steps. No extracted claim is automatically marked reviewed or imported into the live KG.

## Credentials

On this Windows machine the credential is stored in **Windows Credential Manager**, service `OC-Drug-Repurposing/OpenAI`, username `OPENAI_API_KEY`. The runner uses that Windows vault explicitly, not a plaintext keyring backend. No credential is stored in the repository, config, browser code or model prompt. An `OPENAI_API_KEY` environment variable takes precedence for CI or another machine. The vault belongs to the Windows user running the command; run setup and extraction as that same user.

```powershell
python -m src.ingest.openai_credentials status
python -m src.ingest.openai_credentials set
```

The set command prompts without echo and replaces the vault value. Never pass a secret as a command-line argument. Local encrypted storage does not revoke a key previously pasted into a conversation; rotation remains advisable. The runner does not have administrative authorization to rotate account keys itself.

Install optional dependencies from requirements-extraction.txt on another machine. Use the environment-variable route outside Windows. Requests are sent only to `https://api.openai.com/v1/responses`, with redirects disabled. Authorization headers are never written to disk, and HTTP error bodies are not logged. `store=false` disables stored Responses state; it is not a claim of zero server-side retention. See the provider's data policy for retention controls.

## Model and cost controls

The initial evaluated candidate is pinned to `gpt-5.4-mini-2026-03-17`, low reasoning effort, strict JSON structured output, maximum 8,000 output tokens. This is an extraction baseline, not a medically validated model choice. The official model page lists standard rates of $0.75/M input tokens and $4.50/M output tokens. Recheck prices before future runs. Cached-input discounts are omitted from our cost calculation, so reported token-derived costs may exceed billed charges. Taxes and unrelated account usage are outside this local ceiling.

The 150-paper offline estimate is about 1.72 million input tokens and $3.32 assuming 3,000 output tokens per paper. This is an estimate using o200k_base with overhead, not exact server tokenization. Actual usage returned by the API is recorded. Before each request the runner reserves a conservative input allowance based on UTF-8 payload bytes plus overhead and the maximum output tokens. It persists this reservation before sending. Unknown-charge network failures retain the reservation; there are no automatic retries or silent duplicate requests. The limit applies to this runner, not other clients using the account.

## Reproduction

From the repository root:

```powershell
# No paid call: inspect the estimate.
python -m src.ingest.run_openai_claim_extraction --limit 150

# The initial development smoke test (already completed on this machine).
python -m src.ingest.run_openai_claim_extraction --limit 3 --split development --budget-usd 8 --execute

# Continue the fixed pilot, excluding every already-attempted smoke request.
python -m src.ingest.run_openai_pilot
```

The parallel runner uses eight disjoint shards, each capped at $0.99, and first checks that their combined ceilings plus the smoke-test reservation remain within $8. It aggregates unique requests across the smoke run and shards. Each shard resumes completed/attempted requests without reissuing them. Changed runner hashes, model settings, prepared artifacts or budget require a new output directory; old outputs remain intact. An interrupted in-flight attempt must be reconciled manually before any retry. A stale `.run.lock` should only be removed after confirming no worker is still running.

The preparation snapshot remains immutable, including its original provider-neutral config. Runtime provider settings and hashes are captured in each shard's run_config.json. The current editable preparation config may name OpenAI without rewriting the sealed request snapshot.

Files:

- data/staging/claim_extraction_pilot_v1: frozen requests, prompt, schema, hashes and split.
- data/staging/openai_claim_pilot_v1: three-paper smoke test, raw responses, validation, ledger and usage.
- data/staging/openai_claim_pilot_parallel_v1: eight shards, sanitized logs and combined summary.

## Interpretation of outputs

`accepted_unreviewed_claims` means the output passed implemented structural checks, quoted text was matched to supplied passages, identifiers referenced allowed hints, and event-form/sign consistency checks passed. It does **not** mean verified biological truth, correct species resolution, a curated experiment, canonical import eligibility, or drug efficacy. A valid quotation can still be misinterpreted.

The validator retains hypotheses and no-effect results without marking them projection candidates; it rejects fabricated/nonunique quotations, invented annotation/node links, broken event forms and association claims with causal signs. Incomplete context alone does not cause rejection. Unique exact quotations with wrong character offsets are re-anchored deterministically; both the original response and explicit offset-repair record are retained. No paraphrase is silently substituted for a quotation.

Development and held-out paper splits remain attached to each request. Human labeling and biological evaluation are not yet complete; held-out responses must not be used to tune the extraction prompt. Next: evaluate the development claims, resolve entities against registries, specify safe projection for perturbation effects, then build and inspect a reversible six-table patch. The current graph and viewer do not change during extraction.

## Official API references

- Model, snapshot and pricing: https://developers.openai.com/api/docs/models/gpt-5.4-mini
- Responses structured output: https://developers.openai.com/api/docs/guides/structured-outputs
- Exact server token counting, if needed: https://developers.openai.com/api/docs/guides/token-counting
