# Literature discovery pilot: method, schema mapping, and results

Run: 29 September 2026 US Eastern / 30 September 2026 UTC. This is a bounded discovery sample, not a systematic review, a validated mechanistic subgraph, or a drug prediction run.

## What was implemented and executed

1. **Inspect the existing schema and protect the canonical tables.** The six canonical tables remain `nodes`, `edges`, `source_records`, `edge_evidence`, `experiments`, and `contexts`. SHA-256 checks before and after execution confirm all processed CSVs were unchanged. Live viewer exports were not rebuilt or edited.
2. **Retrieve a broad and a targeted sample.** Europe PMC returns publication metadata, abstract text, MeSH headings, publication types, PMID/PMCID/DOI, and links. Three overlapping queries cover general osteoclast biology, metabolism-enriched biology, and known mechanism anchors. Exact queries, counts, retrieval timestamps, request URLs and page cursors are saved. Restricting to `SRC:MED` makes PMID deduplication explicit. The pilot requests the first relevance-ranked page, capped at 150 records per query, without date or language exclusions. It is not a random sample. Search counts overlap and must not be summed as unique papers.
3. **Deduplicate and annotate a balanced subset.** Records are deduplicated by PMID. Annotation selection alternates between query families, with two positive controls included first. PubTator export requests contain ten PMIDs per batch. Direct control lookups are logged separately from natural search retrieval. There is no inference that a paper outside the first page is absent from the full search space.
4. **Extract a transparent review queue.** The updated BioC parser retains every passage, annotation span, identifier, provider metadata, and provider relation. The pilot selects abstract sentence-like spans containing a mechanistic keyword and at least one provider annotation. It preserves exact provider text and document offsets. This rule captures candidates, not subject-predicate-object claims. Provider relation predictions and scores are retained in `annotated_documents.json` but are not translated into canonical edges.
5. **Check provenance, ambiguity and usability.** All 212 selected passages reconstruct exactly from the cached provider responses. A targeted qualitative sample was inspected for retrieval relevance, molecular identity ambiguity, negation and contextual scope. Offline replay uses only checksummed responses. The HTML queue provides text search, graph-match and negation filters, source links, and expandable provenance. No approval or biological curation decisions are stored through the HTML page.

The code uses `requests`, already listed in repository requirements. It does not need Neo4j, an LLM API, or a PubTator API key.

## Measured results

| Measure | Result |
| --- | ---: |
| Broad query hits / retrieved | 85,953 / 150 |
| Metabolism query hits / retrieved | 16,431 / 150 |
| Mechanism-anchor hits / retrieved | 72 / 72 |
| Unique papers after PMID deduplication | 318 |
| Papers with Europe PMC abstracts | 316 |
| PubTator papers requested / returned | 60 / 56 |
| Entity mentions, including repeated mentions | 1,525 |
| Provider relation predictions retained, not promoted | 357 |
| Candidate passages | 212 |
| Passages with type-compatible lexical graph suggestions | 126 |
| Distinct existing nodes suggested | 49 |
| Passages with a negation cue | 13 |
| New canonical nodes / edges | 0 / 0 |

Four requested PMIDs were absent from the successful PubTator responses: 42789335, 42792530, 42793056, 42801354. The cause is not established; they remain marked `missing_or_failed`, not excluded as irrelevant. There were no failed HTTP requests in this run. PubTator returned Gene, Chemical, Disease, Species and Variant annotations; the 1,525 mentions are not 1,525 unique biological entities.

Both positive controls were naturally retrieved by the anchor search: PMID 38200114 (serine synthesis/PHGDH) and PMID 40500265 (itaconate/TET2). That checks two known examples only; it does not measure recall across osteoclast biology.

The initial online retrieval and extraction took **9.23 seconds** for ten successful batched API requests. The final offline replay took about **0.11 seconds**. These are script timings on this machine, excluding implementation, testing, browser checks and interpretation. They do not imply the full literature can be curated in seconds. Network behavior, batching, response sizes and future full-text extraction will change runtime. Cache files total approximately 4.1 MB. `initial_online_run.json` preserves the first measurement; `summary.json` records the latest replay. The first run had 127 matching passages/51 suggested nodes; a type-compatibility repair reduced these to 126/49 without altering the 212 passages.

## How staging maps to the existing schema

No columns were appended to the six canonical tables. New fields are stored only under `data/staging/discovery_pilot`; exact public API responses and retrieval metadata are under `data/raw/discovery_pilot`.

| Staging file and fields | Existing destination after review | Meaning / gate |
| --- | --- | --- |
| `papers.csv`: `source_id`, `pmid`, `pmcid`, `doi`, `title`, `publication_types`, `url`, `retrieved_at`, `raw_file`, `raw_sha256` | Same-named fields in `source_records.csv` | A resolved publication proves bibliographic identity, not support for any claim. Match existing sources by PMID/DOI as well as source ID to avoid duplicating DOI-keyed sources. |
| `papers.csv`: `abstract`, `year`, `mesh_terms`, `query_families`, `annotation_status` | Discovery metadata; not canonical node attributes | Explains selection and coverage. Publication types help distinguish reviews from original experiments. |
| `mentions.csv`: `annotation_id`, `text`, `type`, `identifier`, `normalized_name`, `locations`, `infons`, `passage_index`, `passage_type` | Candidate inputs to `nodes.csv` identity review | Provider identifiers and names are retained verbatim. Provider type is not the graph's molecular ontology. |
| `mentions.csv`: `candidate_node_ids`, `mapping_status`, `raw_file`, `source_sha256` | Possible existing `node_id` links | Type-compatible lexical matching of names/symbols/aliases only; not a registry crosswalk or orthology mapping. |
| `candidate_passages.csv`: `candidate_id`, `source_id`, `passage_text`, `source_location`, `source_url`, `source_sha256` | Later `edge_evidence`: `evidence_id`, `source_id`, `quote_or_location`, location/URL/checksum | The candidate ID identifies an extracted span. One span may yield several reviewed claims, and several spans may support one claim. Do not reuse candidate IDs as edge IDs. |
| `candidate_passages.csv`: `start`, `end`, `passage_index`, `annotation_ids`, `provider_identifiers` | Evidence traceability | Character positions refer to the exact PubTator BioC passage/document, not a PDF or the separately cleaned Europe PMC abstract. |
| `candidate_passages.csv`: `mechanistic_cues`, `negation_cue`, `triage_score`, `query_families`, `publication_types` | Review aids only | None are confidence, direction, polarity or evidence-strength measurements. |
| Candidate `relation`, `sign`, `context_id`, `experiment_id`, `polarity` | Later `edges`, `contexts`, `experiments`, `edge_evidence` | Intentionally blank. The pilot does not infer these from words such as “inhibits.” |
| Candidate `curator_status`, `passage_status`, `identity_status`, `eligible_for_scoring` | Existing evidence-review workflow | All pending/unreviewed, molecular form/species unresolved, scoring false. Finding exact text is not the same as reviewing its biological implication. |

## Ontology and molecular identity

The existing local schema supports **gene, RNA, protein, intracellular compound, extracellular compound, reaction, and pathway**. Protein functions such as enzyme/transcription factor remain roles; RNA subtypes remain separate fields. It is a local typed graph with external identifiers, not a fully registry-normalized ontology.

PubTator's **Gene** annotations may refer to a gene locus, transcript expression, or protein activity in prose. The pilot therefore permits suggestions across our gene/RNA/protein types but does not choose among them. A numeric NCBI Gene identifier is not a UniProt protein identifier. Species must be checked from the provider's identifier and the relevant experiment, not borrowed from the existing mouse node.

PubTator **Chemical** annotations can suggest only intracellular/extracellular compound nodes. A MeSH chemical identifier is not automatically a ChEBI identifier; name matching does not resolve stereochemistry, chemical derivatives, protonation state or compartment. Chemical interventions and drug derivatives can appear in staging but are not added to the biological mechanism topology. Their later drug-target representation belongs to the separate repurposing lane.

Disease, Species and Variant mentions are retained as annotations without manufacturing new canonical node classes. They can inform later context/experiment curation. Likewise, no new reaction, pathway membership or RNA translation edge is inferred from entity co-occurrence.

After curation, relationships must use the existing controlled vocabulary: `ACTIVATES`, `INHIBITS`, `REGULATES`, `ASSOCIATED_WITH`, `CATALYZES`, `INPUT_TO`, `OUTPUT_OF`, `TRANSPORTS`, `TRANSCRIBED_FROM`, `TRANSLATED_TO`, `PART_OF`. Reaction/structural/unsigned edges use sign 0 under the current schema. Co-mention or a PubTator relation prediction does not by itself justify a signed causal edge.

## Qualitative spot-check and repairs

This was an assistant inspection of a purposive sample, not expert biological approval or a precision estimate. All candidates retain pending status.

| Example inspected | Finding and consequence |
| --- | --- |
| PMID 38200114, PHGDH deletion passage | Useful perturbation language was retrieved, but the provider did not annotate PHGDH in this selected span. A mention-dependent method can miss important participants. The queue does not invent the missing entity. |
| PMID 38200114, Nfatc1 locus passage | The lexical suggestion points to the existing NFATC1 protein despite text about a gene locus/expression. Molecular form needs adjudication; no mapping is asserted. “Activated” inside the expanded NFAT name also demonstrates keyword false positives. |
| PMID 40500265, itaconate/TET2 enzyme-activity passage | Useful candidate for the existing itaconate/TET2 module. The provider gives a Gene identifier and the graph has a local mouse protein; species and protein identity are unresolved. No dose, assay or figure is invented from the abstract. |
| PMID 38964754, ACOD1/ROS/HIF1A passage | A useful multistep hypothesis touches existing nodes. It must be decomposed and checked rather than collapsed to one unsupported direct edge. |
| PMID 41913623, mitochondrial review passage | “Not only” triggers a negation cue without contradicting a mechanism. Review synthesis must be separated from original experimental evidence. |
| PMID 41349947, SIGLEC-15 passage | Positive osteoclast and negative osteoblast statements coexist. A single passage-level polarity would be wrong. |
| PMID 42320631, Nrf2/viability passage | “Without alterations in cell viability” is relevant context, not a blanket contradiction of the molecular effect. No lexical match does not prove node novelty. |
| PMID 41639517, Gm5532 study-aim passage | Search retrieves potentially relevant RNA/metabolic material outside lexical coverage, but a study objective is not a demonstrated result. |
| PMID 42013185, calcium passage | Initial punctuation-insensitive matching suggested both calcium and carbonic anhydrase CA2. Type-aware matching now excludes protein nodes for Chemical annotations; a regression test covers this failure. |

## Limitations and next expansion

This run used abstracts, not full texts or figure-level evidence. It does not extract reviewed doses, durations, assays, viability measurements or effect sizes. Sentence splitting is deliberately simple and can split abbreviations; exact offsets remain available for inspection. A mechanistic cue plus an annotation does not ensure a mechanistic assertion. Background sentences, aims, reviews and indirect effects remain in the queue. Negation is a review flag, not a linguistic classifier.

The broad query includes bone resorption and can retrieve neighboring biology. No relevance exclusions were applied beyond PMID availability and caps. The 60-paper annotation subset is balanced for exploration, not a prevalence estimate. Query counts are broader than an earlier `TITLE_ABS:osteoclast*` count because this search adds bone resorption and MeSH.

The next scientific step is to select a small connected module from the queue, resolve species/molecular identities, retrieve permitted full texts, and curate claim-specific experiments and contexts. Only then append reviewed records to canonical tables and run the existing rebuild/validation workflow. Separately, database adapters for Reactome/Recon3D/OmniPath remain future work; this pilot does not implement those imports.

## Reproduce and inspect

From the repository root:

```powershell
python -m src.ingest.discovery_pilot
python -m src.ingest.discovery_pilot --offline
python -m unittest discover -s tests -v
```

The default command reuses cache entries with identical URLs/parameters. To obtain a fresh snapshot, first archive/rename the raw cache directory and retain the corresponding staging outputs; there is no automatic expiry. Offline mode fails if a required cached response is missing and detects checksum mismatches. Request failures are recorded in the run summary; partially available annotations do not silently count as complete.

Browse `data/staging/discovery_pilot/review_queue.html`, or serve the repository and visit that path. The page is self-contained, read-only and searchable. `searches.json` records full queries; `api_calls.json` records successful calls/cache accesses; `runs/` records subsequent run summaries. The 32-test suite passed, including seven new discovery tests and exact reconstruction of every candidate span. Existing graph/export integrity tests passed.

## Primary technical references

- [Europe PMC REST API](https://europepmc.org/RestfulWebService): search fields, core metadata, paging and defaults.
- [PubTator 3.0 paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC11223843/): entity/relation annotations and BioC export.
- [COSMOS](https://link.springer.com/article/10.15252/msb.20209730): structured prior networks and context-specific mechanistic hypotheses; a guide for later database integration.
- [GraphOmics](https://pmc.ncbi.nlm.nih.gov/articles/PMC8684259/): Reactome-based reaction/pathway integration.
- [Global Network of Biomedical Relationships](https://pmc.ncbi.nlm.nih.gov/articles/PMC6061699/): literature-derived relations with sentence-level provenance; a methodological precedent, not the extractor used here.
