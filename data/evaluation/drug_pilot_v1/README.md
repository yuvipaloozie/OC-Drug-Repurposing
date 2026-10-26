# FDA identity, target coverage, and drug-evaluation experiment

This iteration executes three tasks: registry resolution of the FDA inventory, source-backed target mapping, and a bounded literature outcome pilot. It does not train a drug-efficacy model or promote outcome papers into the canonical KG.

## 1. Candidate identity and chemistry

`python -m src.ingest.fda_resolution --fetch` retrieved public PubChem and ChEMBL data without API keys or paid calls. Omit `--fetch` to replay retained responses. Responses include retrieval times, URLs, HTTP statuses, and SHA-256 checksums. The FDA snapshot remains unchanged.

All **2,374 exact FDA ingredient names** were processed: 2,207 returned one PubChem structure, 26 multiple structures, and 141 no match. These are registry results, not independent adjudications of every FDA identity. 1,832 names matched approved ChEMBL records by full InChIKey and 464 by an exact normalized registry name/synonym with an unambiguous parent. Seventy-eight remain unmapped to this ChEMBL snapshot. Name normalization changes case and whitespace only; it does not strip salts or stereochemistry. ChEMBL approval status is not used as a substitute for FDA status.

`identities.csv` retains the exact FDA name, PubChem CID, candidate CIDs, original SMILES, InChIKey, formula, molecular weight, ChEMBL records/parent, mapping basis, source file/hash, and errors. A unique registry name lookup is useful evidence but still requires scrutiny for formulations, stereochemistry, mixtures, and biologics. Registry-name mappings can refer to a parent while the PubChem structure describes a salt; these remain distinct fields.

The RDKit step uses the explicit ChEMBL parent where available; otherwise it uses the PubChem structure. It records FragmentParent/Uncharger transformations, original-versus-model identity, stereochemical uncertainty, a grouping scaffold, and model eligibility. No missing stereochemistry is invented. The initial molecular-model domain is specific organic structures with parent molecular weight <=1,200; this is a modeling choice, not a scientific validity cutoff. Larger molecules, inorganics, unresolved mixtures, and missing structures remain in the inventory.

There are **2,047 ingredient rows with model-eligible structures**, including **1,500 of 1,718 currently listed ingredient names**. Names that share a parent are not independent drugs. Chiral Morgan fingerprints (radius 2, 2,048 bits) are saved in `morgan_r2_2048.bits`, with row IDs and decoding metadata in the companion JSON. Decode with NumPy `unpackbits`, bit order `big`, reshape to `(rows, 2048)`; the bytes are packed by row.

## 2. Drug targets and the mechanistic lane

ChEMBL 37 supplies 12,518 ingredient-mechanism-target-component rows spanning **2,135 ingredient names**. Rows retain target accession/species, target type, action, direct-interaction flag, original reference links, mechanism/selectivity comments, and both mechanism and target response hashes. These are curated database mechanism annotations, not newly verified quantitative affinity assays or a comprehensive off-target screen. Potency fields remain blank rather than inferred.

Mapping first requires exact UniProt accession and taxon. **No ingredient currently has an exact same-species target match in the canonical KG.** This follows from the actual KG and target inventory; it does not imply the target does not exist biologically.

A separate scenario uses MGI human/mouse homology classes with one distinct gene on each side and accession-level matching. It does not use gene-symbol matching. It links 46 FDA ingredient names to KG targets, including 41 currently listed names. Two names have eligible signed paths to differentiation/resorption at depth <=4. These are counts of coverage, not ranked hits or predicted efficacy. The species transfer does not establish conserved drug binding, potency, exposure, or phenotype.

Protein families, complexes, and fusion proteins remain recorded with their components but are not silently converted to independently measured single-protein binding. For example, ChEMBL describes dasatinib's SRC mechanism as a protein-family record. Its component list alone is not new evidence of each component's affinity; the existing separate label-based dasatinib demonstration remains available. This illustrates why database mechanism coverage is narrower than a fully reviewed pharmacological target profile.

`drug_targets.csv` is an external input table; `orthology_mappings.csv` and `orthology_drug_scenarios.csv` preserve the assumptions. `features.csv` stores exact and scenario coverage, signed supporting/opposing path counts, and missingness indicators. Unknown coverage is never converted into an inactivity label. Antagonism is treated as a conditional negative action for the exploratory path features, not a dose-dependent pharmacodynamic model.

All seven pilot outcome papers and their source aliases are masked before KG feature construction. Mechanism rows citing those outcome PMIDs are also excluded from features. Outcomes never become direct drug-to-phenotype feature edges. The current pilot source PMIDs have no overlap with the canonical source ledger, but masking remains enforced for future graph updates.

## 3. Outcome pilot and scientific review

The pilot contains **28 observations, eight drug moieties, and seven papers**. Drugs: fluoxetine, paroxetine, fluvoxamine, citalopram, sertraline, propranolol, enoxacin, and rosiglitazone. This is a purposive challenge sample selected to exercise positive, null, toxic, and conflicting evidence; it is not a systematic screen or a representative sample of the FDA universe. Enoxacin and rosiglitazone are discontinued-only in this FDA snapshot and are retained as retrospective controls, not current-market candidates.

Each observation preserves compound/formulation mapping, endpoint, direction, dose/range, duration, species, model, control, viability qualification, source location, source hash, and review status. Thirteen observations were reviewed against available full text and 15 against primary abstracts. No numerical effect sizes were digitized or invented. Abstract-only and incomplete records remain useful qualified evidence rather than being discarded.

The labels were extracted by the assistant; **independent human adjudication is pending** in `independent_review.csv`. The exact FDA salt versus experimental formulation is not fully resolved. The pilot is therefore a development/evaluation resource, not an untouched gold-standard test set. Existing human edits in the review sheet are preserved when regenerating observations.

Examples of why context matters:

- [Ortuño et al., 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5053870/): 3 micromolar fluoxetine, paroxetine, and fluvoxamine suppressed differentiation in primary mouse cultures; citalopram did not significantly inhibit it. Mononuclear counts provide a viability proxy, not a complete toxicity panel. TRAP activity is stored separately from formation and resorption.
- [Hodge et al., 2013](https://pubmed.ncbi.nlm.nih.gov/23260229/): human osteoclast suppression by several SSRIs accompanied apoptosis. These are not automatically selective/noncytotoxic hits.
- [Fluoxetine study, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11662947/): low-dose formation inhibition and higher-dose mouse-cell toxicity are separate observations. Conflicting duration descriptions in Methods and captions are retained, not silently reconciled.
- [Propranolol study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9098680/): formation reduction, a resorption trend, and a knockout-model null are separate labels. A trend is not promoted to significant inhibition.
- Two rosiglitazone primary abstracts report differing directions under incompletely extracted conditions. Both are retained rather than forced into one permanent drug label.

## Making this an ML experiment

**Question:** Given a compound's structure, independently sourced target/mechanism features, and experimental conditions, can we prioritize compounds that reduce osteoclast formation without unacceptable loss of viability? Resorption is a distinct secondary task, and clinical fracture prevention is outside this prediction target.

**Example row:** fluoxetine + 3 micromolar + six days + mouse primary precursors + formation endpoint. Structure and pre-existing mechanisms are inputs. The held-out assay outcome is the label. A different dose, model, or endpoint is a different observation, but all observations for the compound stay together when testing generalization to new drugs.

**Baselines before a GNN:** compare a prevalence baseline, Morgan-fingerprint logistic regression, mechanism-only regularized logistic regression, and a combined model. Use exactly the same compound groups and evaluation population. Missing KG coverage is an explicit feature and is reported separately. A later molecular GNN must outperform the fingerprint baseline under the same split, rather than receiving an easier split or extra labels.

**Splits:** salt variants and common parents, shared scaffolds, shared drug moieties, and shared papers are connected into groups. The present 28 rows form only **four independent groups**, so the code creates leave-one-group-out development folds. Twenty rows fall in the connected SSRI group. A random row split would leak the same compounds or study conditions into both sides and overstate performance. Acyclic molecules use connectivity-based groups because their Murcko scaffold is empty; similarity-based grouping should be evaluated as a sensitivity analysis in a larger dataset. Scaffold separation alone does not guarantee a genuinely novel chemical series.

**Training discipline:** fit imputers, scalers, feature selection, hyperparameters, and calibration only inside development folds. Keep dose, species, and endpoint representation explicit; do not feed citation text, compound names, or review notes to the model. Use the numeric allowlist in `configs/drug_experiment_v1.json`. The current tiny, inspected pilot is not a final locked test set, and no model has been trained on it in this iteration.

**Evaluation:** report drug-weighted average precision with the positive prevalence baseline; ROC-AUC only when both outcome classes exist; and prediction/target coverage. The included evaluator gives every drug equal total weight within an endpoint so repeated assays do not dominate. Report full-text versus abstract-only and viability-qualified versus confounded results separately. A non-significant result is a qualified comparator, not proof of biological inactivity. Unknowns and mere trends are excluded from binary metrics, not counted as negatives.

For a sufficiently large tested panel, add precision/enrichment at the laboratory's screening budget and confidence intervals clustered by compound/source group. Report both all-candidate performance and the subset with covered targets; reporting only the covered subset hides abstention. Paired comparisons must use the same held-out compounds. Retrospective literature selection strongly biases prevalence and hit rates, so screening yield requires a prospective panel that also includes low-ranked or randomly selected controls.

**Final test:** freeze a later set of compounds, structures, source cutoffs, and assay protocol before ranking. The lab specifies dose range, exposure, formation/resorption assays, viability threshold, controls, biological replicates, and blinding. Do not retune on this test after seeing outcomes. We can already run exploratory group-held-out evaluations; what remains unavailable is a defensible final accuracy estimate from eight mostly related drugs.

This methodology follows the emphasis on chemically meaningful splits and comparable baselines in [MoleculeNet](https://pubs.rsc.org/en/content/articlehtml/2018/sc/c7sc02664a) ([code](https://github.com/deepchem/moleculenet)) and [Therapeutics Data Commons](https://tdcommons.ai/functions/data_split/) ([code](https://github.com/mims-harvard/TDC)). We add paper-level leakage controls and assay context because these labels come from heterogeneous mechanistic literature.

## Reproduction and files

From the repository root:

```powershell
# Offline registry replay (add --fetch only to retrieve missing cached URLs)
python -m src.ingest.fda_resolution
python -m src.kg.build_drug_pilot
# Use the RDKit environment for this command
python -m src.kg.fda_features
python -m src.kg.drug_experiment
python -m src.kg.rebuild --manifest-only
python -m unittest tests.test_fda_experiment
```

Evaluate actual out-of-fold predictions with `python -m src.kg.drug_experiment --predictions predictions.csv --endpoint formation`. Prediction columns are `observation_id,score`, higher score meaning stronger predicted inhibition. This evaluator cannot certify the training history behind supplied predictions; no placeholder predictions or fabricated model metrics are published.

- `src/ingest/fda_resolution.py`: cached public registry retrieval and exact identity/target joins.
- `src/kg/fda_features.py`: reversible structure features, fingerprints, homology scenarios, source-masked KG features.
- `src/kg/build_drug_pilot.py`: source-linked observation curation and review packet.
- `src/kg/drug_experiment.py`: grouped folds, input assembly, and optional metric calculation.
- `data/fda/resolution_v1`: identity, target, chemistry, and coverage artifacts.
- `data/evaluation/drug_pilot_v1`: observations, independent review sheet, folds, model inputs, and summaries.

Canonical KG tables and viewer layout remain unchanged. This is the external drug evaluation layer alongside the graph, with future integration possible after review.
