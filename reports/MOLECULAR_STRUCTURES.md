# Molecular structure support

The structure explorer now displays locally generated SDF models for 23 of the 30 compound nodes: 20 molecular conformers and three single-atom ions. The v3 quality pass maps 222 of 231 proteins to unique reviewed UniProt primary-gene/species records. PDB candidates attached to replaced accessions were removed; unresolved nodes have no unverified fallback. These are sequence-reference identities, not experimentally confirmed conformations or isoforms. RDKit is not a protein-folding model. Gene, pathway and reaction nodes have no single molecular geometry; RNA requires sequence-specific structure work.

Each compound is looked up by its exact ChEBI accession. Raw responses and checksums are cached. RDKit ETKDGv3 generates a seeded conformer, followed by MMFF94 optimization when parameterized, or UFF otherwise. Single atoms are placed at the origin. Coordinates are display models, not experimental structures, molecular dynamics, docking poses, or a full conformational ensemble. Charge/protonation follows the registry structure rather than being inferred from the KG name.

The structure_candidates JSON field stores registry identity, SMILES, InChIKey, charge, formula, SDF path/hash, generation method, RDKit version, seed and provenance. Rebuild propagates this field to browser data, both graph JSON exports, all workbooks and Neo4j properties. It does not promote node biological identity or mechanism evidence status. The original nodes table is saved in data/quarantine/nodes_before_compound_structures.csv.

The four prior accession/name conflicts have been repaired and incident claims reviewed: cis-aconitate(3-) is CHEBI:16383, itaconate(2-) is CHEBI:17240, hydron/H+ is CHEBI:15378, and PGE2 is CHEBI:15551. Hydron is not hydronium. These molecular representations do not assign an experimental protonation state. See [the quality report](RESOLUTION_QUALITY_PASS.md).

## Coverage

| KG node | Registry identity | Status/reason |
|---|---|---|
| CHEBI:17234 (D-glucose) | glucose | Registry has no specific molecular structure |
| CHEBI:14314 (D-glucose 6-phosphate) | D-glucose 6-phosphate | Registry has no specific molecular structure |
| CHEBI:15946 (D-fructose 6-phosphate) | keto-D-fructose 6-phosphate | generated |
| CHEBI:16905 (D-fructose 1,6-bisphosphate) | keto-D-fructose 1,6-bisphosphate | generated |
| CHEBI:17138 (glyceraldehyde 3-phosphate) | glyceraldehyde 3-phosphate | Registry structure leaves stereochemistry unspecified |
| CHEBI:16001 (1,3-bisphospho-D-glycerate) | 3-phospho-D-glyceroyl dihydrogen phosphate | generated |
| CHEBI:17794 (3-phospho-D-glycerate) | 3-phospho-D-glyceric acid | generated |
| CHEBI:17835 (2-phospho-D-glycerate) | 2-phospho-D-glyceric acid | generated |
| CHEBI:18021 (phosphoenolpyruvate (PEP)) | phosphoenolpyruvate | generated |
| CHEBI:32816 (pyruvate) | pyruvic acid | generated |
| CHEBI:16651 (L-lactate) | (S)-lactate | generated |
| CHEBI:15351 (acetyl-CoA) | acetyl-CoA | Registry structure leaves stereochemistry unspecified |
| CHEBI:16947 (citrate) | citrate(3−) | generated |
| CHEBI:16383 (cis-aconitate(3-)) | cis-aconitate(3−) | generated |
| CHEBI:30887 (isocitrate) | isocitric acid | Registry structure leaves stereochemistry unspecified |
| CHEBI:30915 (2-oxoglutaric acid (alpha-ketoglutaric acid)) | 2-oxoglutaric acid | generated |
| CHEBI:15380 (succinyl-CoA) | succinyl-CoA | Registry structure leaves stereochemistry unspecified |
| CHEBI:15741 (succinate) | succinic acid | generated |
| CHEBI:18012 (fumarate) | fumaric acid | generated |
| CHEBI:15589 ((S)-malate) | (S)-malate(2−) | generated |
| CHEBI:16452 (oxaloacetate) | oxaloacetate(2−) | generated |
| CHEBI:17240 (itaconate(2-)) | itaconate(2−) | generated |
| CHEBI:18050 (L-glutamine) | L-glutamine | generated |
| CHEBI:16015 (L-glutamic acid) | L-glutamic acid | generated |
| CHEBI:17115 (L-serine) | L-serine | generated |
| CHEBI:29108 (calcium(2+)) | calcium(2+) | generated |
| CHEBI:15378 (hydron (H+)) | hydron | generated |
| CHEBI:17996 (chloride(1-)) | chloride | generated |
| CHEBI:15551 (prostaglandin E2) | prostaglandin E2 | generated |
| CHEBI:26523 (Reactive oxygen species (ROS)) | reactive oxygen species | Registry has no specific molecular structure |


## Reproduce

Use a clean Python environment and install `requirements-structures.txt` (RDKit 2026.3.6). Then run:

```powershell
python -m src.enrichment.build_compound_structures --offline
python -m src.kg.rebuild
python -m unittest discover -s tests -q
```

Omit --offline to fetch missing registry snapshots. Existing snapshots are reused and hash-checked. Exact coordinates are version/platform sensitive; distributed SDF files and hashes are the authoritative display artifacts. The generation step writes only structure_candidates within the nodes table, then rebuild synchronizes derived exports. Local models and the bundled rendering library work without network structure downloads.

## Connectivity slider

The KG viewer also includes Minimum connections and Reset. Counts use all recorded incident relationships in the full graph before evidence filtering, with self-links counted once and parallel claims counted separately. The slider filters the graph canvas, not the search catalog or entity evidence panel; the catalog remains available for navigation. Neighborhood centers below the threshold are hidden with an explanatory message. Connectivity is not evidence quality or unique-neighbor count.
