# Independent review of the frozen 50-paper set

These papers were withheld from the full extraction run. The blind packet contains source passages and provenance only, without extracted claims or suggested entities. Its content scope is the cached passages; an abstract-only packet does not support a full-text recall estimate.

1. A biological reviewer first reads `blind_packets.jsonl` and records all relevant supported claims separately, including molecular form/identity, relationship, sign, intervention, species, cell/model, sex/timing restrictions, and exact supporting spans. Record no-effect results and uncertain claims without turning them into signed effects.
2. Freeze those reference annotations with reviewer/date and a checksum before revealing model output. Ideally a second reviewer independently annotates a subset and adjudicates disagreements with the first reviewer.
3. Use the frozen extraction prompt/schema to generate predictions only after the reference annotations are frozen. No model inference or paid requests have been run on these packets by this iteration. Do not tune development rules on these evaluation labels.
4. Match source-supported claims against the frozen reference set, treating entity/form, direction, intervention, and material context errors as incorrect claims. Record true positives, false positives, and missed gold claims per paper in `review_results.csv`, plus the error categories. Supporting quotes must refer to the packet actually evaluated.
5. Compute precision = TP/(TP+FP), recall = TP/(TP+FN), and F1, with a paper-level uncertainty interval. Empty denominators are undefined, not zero. Report agreement, reviewed paper count, and source scope alongside any metric. Partial annotation must not be reported as the full 50-paper result.

For downstream graph prediction, mask all held-out paper evidence with `filter_subgraph_by_leakage`; the generated evaluation also checks original canonical-source overlap. Shared reaction/registry facts are not independent experimental confirmation. A drug-ranking benchmark additionally needs compound/assay labels, scaffold/compound splits, and leakage analysis.

`review_results.csv` is intentionally unfilled. Automated engineering tests, assistant source checks, and the prior 120-claim diagnostic audit are not substitutes for this independent review. The evaluation generator never overwrites this file once created.
