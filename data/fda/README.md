# FDA candidate inventory

This is the candidate universe for repurposing, **not a labeled osteoclast test set**. Source: the official [FDA Orange Book data files](https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files). `current.json` selects an immutable content-addressed snapshot. The ZIP, retrieval metadata, and output checksums support offline reproduction.

The October 2, 2026 retrieval contains a products file dated September 11, 2026: 48,761 product records, 2,374 distinct exact ingredient names, 1,718 names with an RX/OTC product, and 1,556 names with a marketed single-ingredient product. These are names/products, not already normalized unique small molecules. Orange Book coverage is not the complete biologics universe.

- `products.csv`: original FDA fields, application/product identifiers, marketing category, and source row.
- `ingredients.csv`: exact ingredient names with stable local IDs and product counts. Salt forms remain distinct; no stereochemistry, active-moiety equivalence, or target binding is guessed.
- `ingredient_products.csv`: links retain combination-product composition. A combination's efficacy cannot be assigned to each component individually.
- RX/OTC are currently listed product categories; DISCN-only ingredients remain archived. Discontinuation is not automatically labeled a safety withdrawal.
- All osteoclast outcomes, molecular structures, and targets are initially unknown. FDA approval supplies no osteoclast efficacy label.

Replay: `python -m src.ingest.fda_inventory`. Update deliberately: `python -m src.ingest.fda_inventory --refresh`. A changed ZIP creates a new snapshot; freeze a snapshot for each experiment. No recurring update automation or paid calls are configured.

## Next transformations

1. Resolve exact ingredient/salt/stereochemistry to registry structures and maintain reversible parent-moiety mappings. Separate biologics, mixtures, and products without an unambiguous structure from the molecular-graph lane.
2. Attach source-backed targets, accession/species, action, assay potency, and exposure/selectivity limitations through `data/drug_targets/targets.csv`. FDA label descriptions may help identify targets but are not uniformly quantitative binding measurements.
3. Measure target-to-KG coverage before scoring. Missing target or mechanism coverage is unknown, not an inactive-drug label.
4. Run chemistry-only, mechanism-only, and combined methods over the **same eligible candidate population**, reporting missingness and domain applicability.
5. Evaluate on independent compound/assay outcomes. Keep formation, viability, and resorption outcomes distinct; record dose, duration, species, model, controls, and source. Freeze compound/scaffold groups and paper holdouts before model tuning. Unknown or untested compounds are not negatives.

The NCT-503 literature example is a development control, not an independent test case: its osteoclast outcome paper already helped construct the mechanism. A final prospective test set needs laboratory results collected under the planned assay; retrospective evaluation needs independently held-out outcome papers and explicit leakage controls.

## Executed resolution and evaluation iteration

The [drug experiment report](../evaluation/drug_pilot_v1/README.md) documents completed registry resolution, target coverage, the 28-observation outcome pilot, and the ML split/evaluation protocol. Derived files are in `resolution_v1`; the original FDA snapshot remains unchanged.
