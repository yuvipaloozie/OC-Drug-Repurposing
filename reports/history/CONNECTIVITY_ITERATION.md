# Connectivity iteration 1: broad discovery, focused mechanism completion

## Decision

The next iteration is to turn sparse, partly disconnected mechanisms into source-supported routes from druggable proteins to osteoclast differentiation and bone resorption. Those are separate endpoints. Discover broadly across cytoskeletal signaling, serine/epigenetic regulation, itaconate/glycolysis, glutamine and mitochondrial metabolism, and pharmacological perturbations. Then curate the highest-value connecting claims rather than adding entities merely to increase graph size.

The immediate acceptance criterion is a small set of complete, interpretable modules with documented missing or conflicting evidence. Completion is not defined by obtaining a favorable drug score. Dasatinib is an engineering positive-control case; direct drug-outcome papers should be held out when evaluating mechanism-based recovery.

## Architecture: plain Python now

The current bottleneck is biological interpretation, entity identity and context, not the number of agents making HTTP requests. Keep deterministic retrieval, deduplication, caching, normalization, validation and export in Python. Keep pending claims and disagreements inspectable. Use bounded, rate-limited requests rather than parallel agents independently hitting the same public endpoint.

A multi-agent framework is not required for this iteration. It becomes worth evaluating if separate extraction and verification tasks demonstrably improve precision or curator throughput on a labeled sample. Two models agreeing is not independent experimental evidence. Their roles would be proposer and source-checker, with unresolved disagreements retained. Compare any such design against one extraction pass plus deterministic validation before accepting its additional cost and complexity.

LangChain provides agent/model orchestration, but it does not itself improve literature coverage or validate biological claims. Our existing requests-based pipeline is sufficient for the present retrieval and staging workflow. No LangChain dependency or paid model endpoint has been added.

These runs successfully used public Europe PMC metadata/search and PubTator annotation endpoints without credentials. An optional NCBI E-utilities API key concerns that separate service's request limits; it is not needed for this workflow. If unattended LLM extraction is added later, configure a model endpoint through environment variables and save the model version, prompt, inputs, outputs and extraction schema. A local model is another option, subject to the same evaluation requirements.

Chat-assisted curation can help interpret papers now. Chat history must not be the database build system: accepted edits need recorded provenance and replayable transformations. Repeating live searches is an updated retrieval, not an exact reproduction. Exact replay uses the saved responses and hashes; building the accepted KG uses canonical tables and the existing rebuild command.

## Executed search design

1. Start with the missing SRC/resorption branch while retaining metabolic discovery priorities.
2. Search eight named query families from a versioned JSON configuration. Store each exact query, cursor, retrieval time, total hits and returned records. Deduplicate by PMID.
3. Select unique papers round-robin across query families, with two known controls explicitly included. Small families exhaust early; this is not an equal-sized stratified or random sample. Larger query families receive remaining slots.
4. Request PubTator BioC annotations in batches of ten with caching, request spacing and retries. Preserve entity identifiers, offsets, all returned passages and provider relationships. An absent annotation is logged, never treated as an irrelevant paper.
5. Extract mechanistic candidate spans and type-compatible lexical suggestions for existing KG nodes. These are triage aids, not confirmed signed relationships. A PubTator Gene annotation does not distinguish our gene, RNA and protein entities.
6. Verify source hashes and reconstruct candidate spans exactly from the returned passages. Produce a separate curation shortlist with review, correction and retraction-related flags. The flags are metadata heuristics, not a comprehensive retraction check.
7. Prioritize full-text review and registry mapping for connecting claims. Capture species, cell type, intervention, endpoint, direction and supporting/contradicting evidence. Do not assume co-mentions imply a mechanism or that all signed effects transfer across species.
8. Apply reviewed changes through the existing canonical tables; rebuild synchronized exports and rerun drug coverage checks. Steps 7–8 are the next scientific curation phase, not an outcome claimed by this retrieval run.

The sample expands from 1,000 requested annotations to 2,500 because the first run finished far below one hour. The larger run follows up to three 500-result pages per query. The two samples need not be nested: expanding each query pool changes the round-robin ordering. Missing provider annotations are reported separately from requests. No claim of systematic-search recall is made.

## Schema and ontology integration

No new canonical node or edge classes are required for discovery. The existing tables remain the source of truth:

| Discovery output | Canonical destination after review |
|---|---|
| Publication identifiers, title, source URL, retrieval time and raw hash | `source_records` |
| Entity mentions, provider identifiers, lexical matches | `nodes`, after molecular-form/species/registry resolution |
| Subject, relationship, object, sign and context | `edges`, after claim extraction and review |
| Exact passage/location, source hash, polarity and review status | `edge_evidence` |
| Intervention, model, assay and measured outcome | `experiments` |
| Species, cell type and experimental setting | `contexts` |

New run-level metadata includes `run_name`, `queries`, `pages_per_query` and search-page numbers. The separate shortlist adds publication flags, candidate counts and a reason for prioritizing each paper. None of these are confidence probabilities. Existing heuristic evidence modes remain unchanged; quarantined claims are not reactivated by matching their entities in a new paper.

## Prioritized reading

- [Vav3 regulates osteoclast function and bone mass](https://pubmed.ncbi.nlm.nih.gov/15711558/): inspect the perturbations and exact signaling claims instead of assuming the existing SRC-to-VAV3 edge is established.
- [Dasatinib inhibits osteoclast activation and PC-3-induced formation](https://pubmed.ncbi.nlm.nih.gov/19855158/): a direct experimental outcome reference for validation; reserve it from mechanism-based prediction evaluation.
- [ACOD1-mediated inhibition of glycolysis](https://pubmed.ncbi.nlm.nih.gov/38964754/): candidate connection between itaconate, metabolic state and differentiation. Do not equate endogenous itaconate with all administered derivatives.
- [Glutaminolysis supplies nucleotides and amino acids](https://pubmed.ncbi.nlm.nih.gov/39271775/): expand nutrient-metabolism coverage beyond the initial serine module.
- SRC/cortactin and cofilin papers, PMIDs 24144981 and 27064822: inspect cytoskeletal organization and resorption measurements, including publication-status checks and indirect effects.

Direct drug-outcome evidence can inform a separate validation set. It should not be silently added as a shortcut that makes a mechanism prediction appear successful. Likewise, a study of resorption should not automatically be labeled a study of osteoclast formation.

## Reproduction

From the repository root:

```powershell
python -m src.ingest.discovery_pilot --query-config configs/connectivity_1000.json --run-name connectivity_2500 --per-query 500 --pages 3 --annotations 2500
python -m src.ingest.discovery_pilot --query-config configs/connectivity_1000.json --run-name connectivity_2500 --per-query 500 --pages 3 --annotations 2500 --offline
python -m src.ingest.summarize_connectivity connectivity_2500
python -m unittest discover -s tests -q
```

Responses live in the shared checksummed `data/raw/discovery_pilot` cache. Separate `data/staging/connectivity_1000` and `connectivity_2500` directories preserve the runs without overwriting the original pilot. Each run includes metadata, candidate tables, BioC documents, an HTML review queue and a manifest-like summary. Offline replay preserves research content but updates runtime metadata; compare paper/candidate content, not clock-dependent summaries.

The live KG viewer is unchanged. The discovery queue is separate, because unreviewed text-mining output should not make the graph look more scientifically complete than it is.

## What success should measure next

Track distinct drug-target mappings; targets connected to each endpoint; direction-resolved versus unsigned paths; missing identity/context annotations; independent paper support; conflicting evidence; and sampled extraction precision. Report target-to-endpoint reachability separately by evidence tier. More possible paths or more literature mentions alone is not validation.

Before broader deployment, add fixed evaluation cases and a manually labeled extraction sample, assess full-text availability and licensing, and record decisions to include or reject each proposed claim. Preserve whole-paper holdouts and independent support handling. A later optional automated extraction stage should be accepted only after showing useful accuracy on that evaluation sample.

References: [PubTator API](https://www.ncbi.nlm.nih.gov/research/pubtator3/api), [Europe PMC REST API](https://europepmc.org/RestfulWebService), [NCBI E-utilities API-key policy](https://support.nlm.nih.gov/knowledgebase/article/KA-05317/en-us), [LangChain documentation](https://docs.langchain.com/oss/python/langchain/overview).

## Measured results (30 September 2026)

| Metric | 1,000-paper request | 2,500-paper request |
|---|---:|---:|
| Unique papers in search pool | 1,863 | 4,546 |
| Papers requested from PubTator | 1,000 | 2,500 |
| Papers returned | 976 | 2,454 |
| Missing provider annotations | 24 | 46 |
| Candidate passages | 3,406 | 8,045 |
| Existing nodes with lexical suggestions | 126 | 152 |
| Retrieval/extraction seconds | 88.50 | 179.48 |

The 2,500-paper run made 257 network requests and reused 10 cached responses. No HTTP requests failed; 46 requested papers were absent from successful provider responses. This does not imply irrelevance. All 8,045 spans reconstructed from returned BioC text and all 267 cached response hashes passed. Offline replay took 4.95 seconds with zero network calls and reproduced papers.csv and candidates.json byte-for-byte. BioC output also contains runtime cache/timing metadata, so its complete file hash is intentionally not an equality criterion.

Publication heuristics flagged 939 review-related, 20 correction-related and 23 retraction-related records across the 4,546-paper search pool; categories may overlap. They are queue flags, not completed publication-integrity reviews. The candidate passages come from 2,152 distinct papers and are not unique mechanistic claims. No nodes or edges were promoted. These timings measure retrieval/extraction, not full-text reading or scientific curation.

The pipeline and pagination regression suite passed 48 tests. The 1,000-paper run completed while pagination code was being developed; its code hash was captured at run completion, not frozen at process launch. Use the final 2,500-paper run and verified offline replay as the reproducibility reference for this iteration.
