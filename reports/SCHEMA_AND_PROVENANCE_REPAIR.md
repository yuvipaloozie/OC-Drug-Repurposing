# Schema and provenance repair — 29 September 2026

This repair preserves the 267-entity, 334-claim inventory while separating recorded claims from source-backed evidence. Structural correctness is not biological verification. It is a curation-ready dataset, not yet an evidence-ready drug-repurposing benchmark.

## What changed

| Area | Before | After |
|---|---|---|
| Context foreign keys | 20 references to nonexistent CTX_0001 | Explicitly missing contexts, with audit reasons; no invented replacements |
| Experiment foreign keys | 20 missing EXP_0001 references; 8 joined-ID rows | Missing links cleared with legacy IDs retained; joined links split into individual evidence rows |
| Evidence text | All 334 CSV passages blank, but labeled reviewed | 334 legacy JSON narratives recovered into claim_summary; repeated where one claim has multiple evidence records; not promoted to source quotations |
| Source-backed text | No trustworthy passage-status distinction | Three additional, source-checked qualitative paraphrases with source locations, URLs and SHA-256 hashes |
| References | Hard-coded titles/DOIs and format-only verification | Actual Europe PMC registry metadata saved for 44 requested references; 42 resolved, 2 unresolved |
| Source relevance | Not checked | 29 citation-topic mismatches flagged, 6 require claim matching, 7 relevant papers still require claim-level scrutiny |
| Experiments | Unsupported quantitative assertions in active fields | All unchecked doses, durations, effect sizes, viability and panel assertions removed from active fields and preserved in the audit archive |
| Generated enrichment | Generated literature, measurements and verification claims exposed as facts | Enrichment removed from live nodes and preserved in quarantine; legacy generators retired |
| STRING | 20 unsupported, contextless signed mechanistic claims | Unsigned ASSOCIATED_WITH claims pending source retrieval; STRING does not establish activation/inhibition |
| Evidence export | Single evidence object; later entries could overwrite earlier ones | Evidence arrays preserve all 345 records and their individual review status; edge source references resolve to the source ledger, with obsolete tokens retained only as legacy assertions |

### Source-review results

345 evidence records: **248 quarantined, 94 pending, 3 reviewed qualitative paraphrases**. Forty-eight experiment records: **32 quarantined, 16 awaiting passage-level review**. All original records remain recoverable in `data/quarantine/legacy_snapshot.zip`.

Examples of mismatched citations: PMID:35465406 resolves to *IoT enabled smart bus for COVID-19*, not a selinexor experiment; PMID:28094254 resolves to a paper on polyhedral tilings; PMID:16339965 resolves to a myocardial-cell commentary. These were not replaced with guessed PMIDs. The source ledger exposes the actual titles and the review queue exposes the affected evidence records.

The previously asserted CBR-5884/10 uM/82% effect in `exp:stegen_01` is quarantined. The retrieved paper uses NCT-503 and Figure 2b concerns bone volume. We did not reinterpret this row as a different assay or transfer its numeric effects to NCT-503.

The three newly checked qualitative claims are:

1. `edge:0034`: PHGDH perturbation reduces intracellular alpha-ketoglutarate; an indirect serine-pathway effect involving PSAT1, not direct PHGDH catalysis. Source: PMID:38200114, Figure 3i and Extended Data Figure 4e, PMC10822776.
2. `edge:0039`: PRMT6 deficiency reduces H3R2 asymmetric dimethylation at fatty-acid-oxidation gene promoters. Source: PMID:39120025, abstract, PMC11516099.
3. `edge:0047`: itaconate-mediated inhibition of Tet2 is supported qualitatively. Source: DOI:10.1038/s41413-025-00437-w, abstract and Results, PMC12159140. OI-derivative assays are not assigned to parent itaconate as dose-equivalent evidence.

These claims do **not** validate their old experiment rows or exact context assignments. They therefore remain ineligible for default mechanism scoring. Five open-access full-text XML files and the complete metadata response are cached in `data/raw/provenance`, with retrieval timestamps and hashes.

## Entity model

- 198 entities now have type `protein`; enzyme (99) and transcription-factor (22) assignments are separate legacy functional roles, not competing top-level identities. Role assignments still require biological review.
- 13 entities previously labeled `gene` are RNA: 6 mRNA, 6 miRNA and 1 lncRNA. Translation links now connect mRNA to protein.
- No DNA gene nodes or gene-to-transcript links were fabricated. The schema supports `gene` for future genuinely identified loci.
- Symbol-based `HGNC:...` protein IDs are replaced by explicit `LOCAL:protein:<species>:<symbol>` IDs. RNA has an analogous local namespace. These are local identities, not official HGNC/MGI/UniProt mappings.
- `identifier_map.json` and `legacy_ids` preserve old links and search aliases. Existing gene symbols remain display labels. Registry identity and orthology mapping remain pending.
- Old structure identifiers are retained only as explicitly unverified structure candidates; the structure explorer labels that limitation. Generated structure-confidence scores are removed.

## Propagation and reproducibility

Canonical inputs are the CSV tables in `data/processed`, including the new `source_records.csv`. The five biological/evidence tables remain separate. Run:

```powershell
python -B -m src.kg.verify_kg
python -B -m src.kg.rebuild
python -B -m unittest discover -s tests -v
```

The rebuild synchronizes both graph JSON copies, both viewers and their data asset, the inventory, all source CSV copies, both Excel workbooks, Neo4j Cypher/style/examples, and a real file-hash manifest. It does not contact external services or create new scientific annotations. Legacy export/master-pipeline commands redirect to this rebuild. Obsolete enrichment/schema mutation scripts fail explicitly instead of silently undoing the repairs. The old regex auditor now calls its results format checks.

The model consumer excludes pending/quarantined claims and requires reviewed passages, experiments and context. Paper-held-out masking also removes claims whose only support was held out. No current complete mechanism path meets those evidence gates; this is an honest readiness result, not a failed graph visualization.

Neo4j exports use distinct Protein/RNA/Gene labels and evidence/source/experiment/context records. Import into a fresh database or explicitly reset an existing one; the repair did not connect to or modify a running Neo4j database. Existing databases can still contain stale imported nodes until reimported.

The viewer uses pastel category/role fills and a 3.6× horizontal / 1.55× vertical expansion of its full-network layout. Neighborhood exploration remains compact and interactive. At whole-network fit, text necessarily becomes smaller; use Readable size, zoom or Expand for detailed inspection.

## Remaining work, explicitly not claimed complete

The broken joins, export loss, misleading review statuses and automatic regeneration of unsupported annotations are repaired. Exhaustive literature re-curation is not complete. The 342 pending/quarantined evidence records need valid source-to-claim matches and exact experimental passages before promotion. Missing context, registry/orthology mappings and source-specific assays must be curated from actual records. No statement that all citations or biological claims are now validated should be inferred from the structural validator passing.

## Verification performed

20 unit/regression tests passed, including missing-reference rejection, review requirements, RNA translation types, preservation of multiple evidence records, export equivalence, source hashes and held-out support removal. All Python sources compile, workbook XML is valid, and two consecutive rebuilds produced identical manifests. Both viewers were checked in the browser for legacy-link resolution, RNA identity, evidence display, and the full 267-node graph. A live Neo4j database import was not executed.


## Follow-up: identity, consumers, and viewer evidence filters

The historical counts above describe the first repair. Current evidence counts are 250 quarantined, 92 pending, and 3 reviewed after quarantining the two CHEBI:16015 incident claims. ChEBI confirms this accession is L-glutamic acid (https://www.ebi.ac.uk/chebi/CHEBI:16015, checked 2026-09-29). The old GLS-to-compound and compound-to-alpha-ketoglutarate ACTIVATES assertions are retained for audit only, not approved reaction semantics. No node merge or protonation change was inferred.

Path finding and scoring now default to PATHWAY:OSTEOCLAST_DIFFERENTIATION. Paper masking filters individual evidence before deciding whether a relationship survives; retained edge source lists omit held-out IDs and do not mutate the input graph. The root workbook now matches the processed and Neo4j copies and is included in the manifest.

Viewer evidence filters affect relationships only, preserving node positions, navigation, and pan/zoom. Has reviewed passage is distinct from Eligible for scoring; the latter is exported directly from the Python eligibility gate and currently matches zero edges. Mixed-status evidence can match more than one filter. Incident details continue to show all records for auditing. Regression coverage now totals 25 tests.
