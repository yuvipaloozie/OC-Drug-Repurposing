# Evidence-linked claim extraction framework

> Implementation update: the OpenAI adapter, Windows credential-vault support, semantic/span checks and bounded extraction runner now exist. See [OPENAI_EXTRACTION_SETUP.md](OPENAI_EXTRACTION_SETUP.md). Identity grounding and canonical integration remain pending.

Status: offline preparation, OpenAI Responses extraction, Windows vault credential access, structural/span validation and a bounded pilot runner are implemented. Scientific evaluation, registry grounding and canonical patch integration remain pending. The existing graph and viewer are unchanged.

## Objective and architecture

Convert cached literature into source-linked mechanistic assertions, including new entities and connections, while retaining the current six-table KG. Use an INDRA-style statement/evidence intermediate representation with separate regulatory and enzyme-reaction extraction tasks. A model extracts statements; deterministic code checks provenance, resolves identities, constructs reversible patches and runs the existing rebuild. No multi-agent orchestrator or LangChain dependency is needed.

Flow: cached PubTator documents -> complete title/abstract request packets -> structured extraction -> exact-span and semantic validation -> registry grounding -> proposed claim ledger -> six-table patch -> existing rebuild -> coverage and signed-path evaluation.

Two independent layers of reproducibility: replaying validated saved claims and rebuilding the graph can be deterministic; obtaining byte-identical new generations from a hosted model cannot be promised. Cache every raw response and record provider, model identifier, parameters, usage, prompt/schema hashes, input request hash and extraction version.

## Credentials and dependencies

The implemented preparation stage uses Python's standard library and the existing local cache: no API key, model download, network connection or Neo4j server. Discovery used the public PubTator endpoint; extraction credentials are separate. A later hosted model adapter needs that provider's API credential and billing access. A local model adapter can avoid a hosted key but needs suitable hardware and separate quality evaluation. A paid ChatGPT/Codex app session must not be treated as an API credential.

The editable configs/claim_extraction_pilot.json now identifies OpenAI and a pinned model; the original prepared snapshot retains its provider-neutral config for audit. Do not paste secrets into chat, JSON, prompts, notebooks or source control. After choosing a provider, configure its documented environment variable locally. The runner should record the variable NAME only, never its value. Rebuilding saved outputs must not require the key.

Before any paid run: choose provider/model, verify the current provider documentation and data-handling settings, tokenize the prepared requests with the selected model's tokenizer, set maximum output tokens, calculate a bounded cost estimate, and set a spending ceiling. Character counts in the manifest are not token or price estimates. Pilot first; no automatic launch of the full corpus.

## Working offline preparation

Run from the repository root:

```powershell
python -m src.ingest.prepare_claim_extraction --output data/staging/claim_extraction_pilot_v1
python -m unittest discover -s tests -p test_claim_extraction_preparation.py
```

The command refuses an existing output directory. It samples 150 unique papers deterministically across four triage buckets: negation-cue candidates, existing-node hints, candidates without node hints, and papers without keyword-selected candidates. These are heuristic buckets, not biological labels. Full supplied title/abstract passages are retained with their original offsets; oversized documents are deferred explicitly, never silently truncated. It verifies raw snapshot hashes and candidate text spans, then saves requests.jsonl, prompt.md, response.schema.json, config.json and manifest.json. No canonical table is edited.

Every third selected paper is held out: 100 development papers and 50 held-out papers for a complete 150-paper run. Do not tune the prompt on held-out labels. This is a paper-level pilot, not 150 independent claims; label all relevant claims and no-claim cases within each paper. Later ensure all passages from a held-out paper remain held out across reruns. Expand sampling to query-family, publication-type and mechanism strata if initial labels show undercoverage. Source excerpts are for processing/audit, not blanket permission to redistribute full texts; existing cached abstract reuse remains subject to source terms.

## Extraction contract and prompt

The exact provider-neutral prompt is prompts/mechanism_claim_extraction_v1.md. The JSON Schema is schemas/claim_extraction_v1.schema.json. A provider adapter should submit this prompt, one paper packet, and this output contract, using provider-supported structured output when available. If the provider supports only a schema subset, translate the transport schema without weakening local validation. Paper content is data, not instructions.

Each response returns request_id/source_id and zero or more claims. Each claim records exact evidence spans; local entity keys and qualified mapping suggestions; regulatory subject/object, direction, sign, effect level and directness OR an enzyme/substrate/product reaction event; assertion category; perturbation and measured outcome; experimental context; concrete uncertainties. Unknown values are null or explicit unknown enums. Model guesses are not registry verification. No model-generated confidence score is treated as a probability.

For example, a loss-of-function result is preserved as an observed perturbation and outcome. Any inference that normal gene function supports an outcome is labeled inferred_from_perturbation. It does not establish direct protein activation, a drug-target interaction, or efficacy. An enzyme-catalyzed conversion is represented as a reaction event, not a positive signaling edge. All context and numerical details require supporting spans. No claimed full-text experiment can be inferred from an abstract that omits it.

## Validation and proposed-claim policy (integration specification)

The response JSON Schema checks structure only. Implemented semantic checks cover references, event form, causal-sign consistency and exact quotation anchoring; the full integration validator must also establish the biological identity/context/projection conditions below:

- request/source IDs against the input; every quote against the exact input passage slice; start/end bounds; unique claim/entity keys; referenced entity keys and suggested existing IDs actually present.
- Exactly one event form: metabolic_conversion requires reaction and null regulatory; other kinds require regulatory and null reaction. Association/undirected events cannot carry a causal sign. Each defined reaction participant must refer to a claim entity.
- Molecular form and taxon are supported independently of lexical match. Prioritize exact provider identifiers plus registry crosswalks; use Gilda-style contextual fallback. Do not merge species, RNA/protein forms, complexes or stereoisomers. Known conflicting accessions remain blocked pending correction. Unresolved but plausible new entities may receive stable local staging identities with warnings; ambiguous mappings cannot silently merge with an existing node.
- Observed/background statements may become proposed candidates. Hypotheses, negated relationships and no-effect observations remain recorded but cannot become positive support for a signed mechanism. No-effect is not automatically contradictory to a claim under different conditions. A sign inferred from genetic perturbation stays qualified and requires an explicit projection policy, including molecular-form resolution, before signed scoring.
- Missing dose, duration or complete context does not block proposed status. Unknown causal direction stays unsigned. Extraction does not confer reviewed status. Known wrong provenance/identity and withdrawn support are excluded. Retraction flags require source integrity resolution; corrections and reviews are not automatically invalidated.

Malformed outputs can be retried once with precise validation feedback; retain both responses and charge both attempts against the cap. Quote mismatches may be re-anchored only by an exact unique text match with an explicit audit record; never rewrite the source quote or fabricate context. Unrecoverable failures enter a review queue rather than disappearing. Scientific validity still requires held-out evaluation and sampling; a schema pass is not biological validation.

## Mapping into the existing schema

| Canonical table | Proposed integration rule |
| --- | --- |
| nodes | Reuse an unambiguous identity or stage a new stable local ID. Preserve type, taxon and identity_status. Phenotypic endpoints currently use pathway nodes; preserve that convention with explicit annotations pending a separate ontology migration. No new top-level phenotype/complex enum is silently introduced. Unrepresentable complexes stay in staging. |
| edges | Project regulatory statements to REGULATES with supported sign; use ACTIVATES/INHIBITS only when semantics warrant. ASSOCIATED_WITH remains unsigned. Preserve status=proposed and qualified context. |
| edges: reactions | Add a reaction node with enzyme -> reaction CATALYZES, substrate -> reaction INPUT_TO, and product -> reaction OUTPUT_OF, as an explicit proposed direction convention to test against all consumers before import. All signs remain 0. Do not infer flux or reversible causal paths. Preserve stoichiometry/reversibility in the claim sidecar until the canonical schema supports them explicitly. |
| edge_evidence | Keep one traceable evidence record per distinct experiment/claim observation: source ID, quote/location, source checksum and unreviewed extraction status. Use support/contradict only relative to the projected claim; no automatic relabeling as reviewed. |
| experiments | Add only when a reported experiment exists. Keep unknown fields empty, verification pending. An absent experiment does not block passage-level proposed evidence. |
| contexts | Store stated species/cell/stage/compartment independently; incomplete contexts remain pending, never defaulted to mouse BMM. |
| source_records | Reuse or add actual resolved publication metadata with retrieval provenance. Publication resolution is separate from checking the claim. |

The graph already has an extracted_candidate tier (heuristic weight 0.25); no new evidence gate or viewer control is necessary. Source usability and other existing policy checks still apply. Proposed does not mean reviewed. Raw model claims, validation results, identity decisions, extraction versions and fields absent from CSV schema remain in a versioned sidecar ledger with stable claim/evidence links. The patch writer must preserve these links in existing review_note/source_location fields or add an explicitly documented schema field; it must not drop the sidecar silently during exports.

Deduplicate canonical relationships by normalized endpoints, predicate, sign, context and projection semantics; retain distinct experiments and support records. Repeated passages from the same paper are not independent replication. Preserve conflicting claims, species and contexts. Stable content IDs and a decision ledger make repeated imports idempotent. Each patch contains before/after hashes, additions/updates, rejected/unmapped reasons and rollback data; apply transactionally against unchanged baseline hashes. Run src/kg/rebuild.py only after validation; derived browser data, Neo4j files and workbooks continue through the existing path.

## Evaluation, rollout and remaining implementation

1. Human-label development and held-out papers for entities, claims, direction/sign, context and evidence spans. Evaluate precision and recall separately for regulatory and reaction tasks; include missed claims from the full abstract, not only the keyword queue. Have a biologically knowledgeable reviewer adjudicate ambiguous cases.
2. Compare an available relation extractor/provider baseline against structured model extraction before choosing the production model. Numerical quality thresholds are not yet calibrated. Select them from error consequences and measured performance, with higher precision required for signed scoring than for visible proposed associations.
3. The provider adapter, cost reservation, response cache and structural/span validator are now implemented. Failed or ambiguous calls are not automatically retried. Next implement registry grounding, biological projection checks, deterministic patch generation and idempotence/rollback tests.
4. Import a small successful pilot as proposed claims, inspect identity and context errors, and compare graph coverage and outcome reachability. Expand to the cached corpus only after reporting results and estimated cost. Keep direct known-drug outcome papers separate from repurposing validation to avoid leakage. A connected path is not a validated drug prediction.

Success measures: usable source-linked relationships added, independent evidence added to existing relationships, resolved new entities, new paths to osteoclast outcomes, context consistency, held-out extraction precision/recall, and unresolved/rejected counts. Node count alone is not success. Neither UI changes nor retraining the chemical ML lane is part of this stage.

## Published implementation precedents

- INDRA statement assembly: https://pmc.ncbi.nlm.nih.gov/articles/PMC10167483/ ; https://github.com/gyorilab/indra
- EnzChemRED enzyme/conversion extraction: https://www.nature.com/articles/s41597-024-03835-7 ; https://github.com/ncbi-nlp/EnzChemRED
- BioREDirect directionality: https://doi.org/10.1093/bioinformatics/btaf226 ; https://github.com/ncbi-nlp/BioREDirect
- Gilda contextual grounding: https://pmc.ncbi.nlm.nih.gov/articles/PMC9710686/ ; https://github.com/gyorilab/gilda

These are architecture and component precedents, not proof that their published accuracy transfers to this graph or that their dependencies must all be installed.
