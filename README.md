# Osteoclast mechanism KG and drug-repurposing research

A research claim inventory, browser explorers, and mechanism-scoring prototype covering 267 entities and 334 claims. Evidence is marked reviewed, pending, or quarantined; this is not a validated drug-repurposing benchmark.

See the [schema and provenance audit](reports/SCHEMA_AND_PROVENANCE_REPAIR.md) for findings and unresolved issues. Original data is preserved in `data/quarantine/legacy_snapshot.zip`.

## Explore locally

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/index.html. Neo4j is optional.

- **Pathway explorer:** browse the full graph or select an entity for its neighborhood. Click to inspect, double-click to explore, and drag to arrange or pan.
- **Structure explorer:** view AlphaFold/PDB structure candidates. Requires internet and WebGL; legacy identity mappings remain unverified.

## Canonical data and schema

`data/processed/{nodes,edges,contexts,experiments,edge_evidence}.csv` are the canonical tables. `source_records.csv` holds publication metadata; `identifier_map.json` preserves legacy IDs.

Proteins have enzyme/transcription-factor roles. RNA uses mRNA, miRNA, and lncRNA subtypes. Local protein/RNA IDs are not registry accessions.

Evidence rows reference individual experiments. `claim_summary` preserves repository narratives; `quote_or_location` holds checked excerpts or paraphrases with source locations and checksums. Missing information remains blank.

## Validate and rebuild

```powershell
python -B -m src.kg.verify_kg
python -B -m src.kg.rebuild
python -B -m unittest discover -s tests -v
```

Validation separates structural correctness from evidence readiness. Rebuild synchronizes JSON, viewers, source ledgers, Excel, Neo4j exports, and SHA-256 hashes. It does not add synthetic enrichment or promote evidence to reviewed status.

Legacy exporters redirect to rebuild; obsolete enrichment and schema transforms are disabled.

## Research limitations

Of 44 references, 42 resolved and 2 remain unresolved. The audit flagged 29 apparent topic mismatches and 6 references needing claim matching. The 345 evidence records include 248 quarantined, 94 pending, and 3 source-checked qualitative paraphrases. Those paraphrases do not validate historical assay values or exact contexts.

Default mechanism scoring requires reviewed evidence, experiments, and contexts; no complete path currently qualifies. Use `find_mechanism_paths(..., evidence_only=False)` for exploratory topology only.

Registry/orthology mapping, passage-level curation, chemistry modeling, and a calibrated repurposing benchmark remain future work.

[Neo4j import](neo4j/README.md) | [Viewer development](src/visualization/VIEWERS.md)
