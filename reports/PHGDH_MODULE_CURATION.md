# PHGDH / serine-synthesis module: first source-level curation

30 September 2026 UTC. This pass reviews selected qualitative claims from Stegen et al., *The serine synthesis pathway drives osteoclast differentiation through epigenetic regulation of NFATc1 expression* (PMID 38200114, PMC10822776). It is an assistant-led literature curation, not independent experimental replication or PI approval. It does not finish the entire metabolic-to-chromatin mechanism.

## Result

The graph now contains 267 nodes, 336 claims, 349 evidence records, 52 experiments and eight contexts. Seven evidence records are source-checked paraphrases, 250 remain quarantined and 92 remain pending. Exactly two claims meet the existing evidence/context/experiment eligibility gate: PHGDH and PSAT1 positively regulate the osteoclast differentiation endpoint in the specified mouse cultures. These are perturbation-supported phenotypic contributions, not direct molecular activation or proof of sufficiency. Both derive from one paper and are not independent replication.

| Claim | Change | Evidence |
| --- | --- | --- |
| PHGDH -> osteoclast differentiation | New `REGULATES`, sign +1; curated | Conditional Phgdh loss reduced TRAP-positive multinucleated cell formation; Fig. 2g-l, Sec4, Methods Sec11/17/19 |
| PSAT1 -> osteoclast differentiation | New `REGULATES`, sign +1; curated | Psat1 shRNA reduced TRAP-positive multinucleated cell formation; Fig. 4g-h, Sec5, Methods Sec17/19/20 |
| PHGDH -> alpha-ketoglutarate pool (`edge:0034`) | `ACTIVATES` changed to `REGULATES`, +1; proposed | Phgdh loss reduced intracellular pool abundance; Fig. 3i, Methods Sec21. Indirect pathway effect, not PHGDH catalysis. |
| PSAT1 -> alpha-ketoglutarate pool (`edge:0217`) | `ACTIVATES` changed to `REGULATES`, +1; proposed | Psat1 silencing reduced intracellular pool abundance; Fig. 4c, Methods Sec20/21. Complete reaction/species representation still unresolved. |

The original 334 claims remain present, with the two pool-claim semantics corrected. Four new evidence records and four new experiments were added. Legacy quarantined experiments and evidence were preserved; source-supported replacements do not retroactively validate their old doses or claims. No drug nodes were introduced.

## Identities and chemical representation

Reviewed UniProt records map mouse PHGDH to **Q61753** and mouse PSAT1 to **Q99K85** (taxon 10090). The stable local protein IDs are preserved; UniProt aliases and identity statuses are updated. PHGDH previously carried a human UniProt identifier, while PSAT1 contained a placeholder. Their structure candidates now use the mouse accessions, with placeholder PDB entries removed. A valid protein identity does not guarantee an available or experimentally validated structure.

CHEBI:30915 is **2-oxoglutaric acid**, charge zero, not a chemically precise label for every intracellular alpha-ketoglutarate species. Its displayed label is corrected, and the unsupported mitochondrial-only compartment is cleared. Its registry label is checked but measured-pool mapping remains pending. The study measured intracellular metabolite abundance without resolving that pool into protonation states or subcellular compartments.

The rescue reagent was **dimethyl-alpha-ketoglutarate, 0.25 mM**, distinct from the endogenous pool. No rescue edge identifying that derivative as the endogenous compound was created. Likewise, no serine-sufficiency edge was added: the authors report failure of supplementary serine/formate to rescue the differentiation defect. The paper also discusses different effects at higher alpha-ketoglutarate concentrations in other studies. Neither finding supports a universal signed metabolite effect.

## Experimental fields and contexts

Two source-specific contexts replace reuse of the unverified generic day-one context for these selected claims:

- Primary mouse bone-marrow mononuclear cell-derived precursors, early differentiation, day three metabolite endpoint.
- The same culture system, day six multinucleated-osteoclast endpoint.

Methods Sec17 specifies 10 ng/mL M-CSF pretreatment for 24 h, then 20 ng/mL M-CSF plus 100 ng/mL RANKL for differentiation. The paper's cell preparation is recorded as described rather than silently relabeled RAW264.7 or an assumed macrophage purification protocol. Methods Sec19 defines the TRAP endpoint as positive cells with **more than three nuclei**. Methods Sec20 identifies Psat1 shRNA TRCN0000120419, empty-vector control, and 24 h transduction before differentiation.

Four new experiment rows separate PHGDH-loss metabolomics, PSAT1-silencing metabolomics, PHGDH-loss cell formation and PSAT1-silencing cell formation. They contain treatment/control, species, cell type, stage, differentiation cytokine doses, duration, assay, qualitative endpoint/effect, figure/method references and verification status. No numerical effect sizes were digitized or invented. The PHGDH-associated caspase-3 survival result is qualified as a day-six assay from Fig. 3b, not general safety. Psat1-specific viability is explicitly not established in the selected panels.

Each new evidence row has an individual ID, edge ID, experiment ID, PMID, qualitative paraphrase, figure/method location, source URL, cached-full-text SHA-256, support polarity, perturbation kind, review date and scope note. “Reviewed” means checked by this assistant against the paper's text, captions and methods; it is not a claim of expert sign-off.

## What remains incomplete

The alpha-ketoglutarate -> KDM6B/JMJD3 -> H3K27 demethylation -> NFATc1 branch remains unpromoted. In particular, promoter chromatin and transcript-expression findings must not be represented automatically as direct activation of NFATC1 protein. A complete reaction model requires explicit participants, gene/transcript/protein distinctions, appropriate registry mapping, and evidence for each step. The two newly eligible phenotype edges can support exploratory target-to-endpoint paths under the existing code; they do not constitute a validated repurposing predictor or establish drug efficacy/selectivity.

## Audit and propagation

- Pre-change canonical tables: `data/quarantine/pre_phgdh_curation_20260930.zip`.
- Field-level change reasons: `data/processed/audit_changes.csv`.
- Full text: `data/raw/provenance/PMC10822776.xml`.
- Mouse identity snapshots: `uniprot_mouse_Phgdh.json`, `uniprot_mouse_Psat1.json`, and retrieval metadata in `data/raw/provenance`.
- Rebuilt canonical JSON, Neo4j JSON/Cypher/source ledgers, browser graph assets, entity inventory, all three workbook copies and the checksum manifest.
- Viewer layout and interactions remain unchanged. Evidence filters now expose the two newly eligible claims.
- The discovery pilot remains a historical pre-curation snapshot; its 318 papers and 212 unreviewed candidate passages were not bulk-promoted.

## Sources

- [Full paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC10822776/), particularly Figs. 2-5 and Methods; local complete XML reviewed.
- [Mouse PHGDH](https://www.uniprot.org/uniprotkb/Q61753/entry) and [mouse PSAT1](https://www.uniprot.org/uniprotkb/Q99K85/entry), reviewed UniProt records retrieved for this pass.
- [CHEBI:30915](https://www.ebi.ac.uk/chebi/CHEBI:30915), neutral 2-oxoglutaric acid.
