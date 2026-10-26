import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  flags,
  evidenceLabel,
  matchesEvidence,
  structureOptions,
  resolveEntity,
  safeLink,
  type Dataset,
  type Edge,
  type Entity,
} from "./model.ts";
const data = JSON.parse(
  readFileSync(
    new URL(
      "../../../data/processed/osteoclast_knowledge_graph.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as Dataset;
test("mixed evidence retains both review and quarantine states", () => {
  const e = {
    status: "proposed",
    evidence: [
      {
        curator_status: "reviewed",
        passage_status: "source_checked_paraphrase",
      },
      { curator_status: "quarantined" },
    ],
  } as Edge;
  assert.equal(evidenceLabel(e), "Mixed");
  assert.equal(flags(e).eligible, false);
  assert.ok(matchesEvidence(e, "reviewed"));
  assert.ok(matchesEvidence(e, "quarantined"));
});
test("legacy protein links resolve to canonical identities", () => {
  const n = resolveEntity(data, "HGNC:PHGDH");
  assert.equal(n?.id, "LOCAL:protein:mouse:PHGDH");
  assert.equal(n?.type, "protein");
});
test("gene and RNA do not inherit protein structure candidates", () => {
  for (const type of ["gene", "rna"])
    assert.deepEqual(
      structureOptions({
        id: "test",
        name: "Test",
        type,
        structure_candidates: { uniprot_id: "Q61753", primary_pdb: "1ABC" },
      } as Entity),
      [],
    );
});
test("placeholder structures and external conformer paths are excluded", () => {
  assert.deepEqual(
    structureOptions({
      id: "test",
      name: "Test",
      type: "protein",
      structure_candidates: { primary_pdb: "XXXX", uniprot_id: "invalid" },
    } as Entity),
    [],
  );
  assert.deepEqual(
    structureOptions({
      id: "test",
      name: "Test",
      type: "intracellular_compound",
      structure_candidates: {
        small_molecule: { sdf_url: "https://example.com/x.sdf" },
      },
    } as Entity),
    [],
  );
});
test("each exported claim remains inspectable with all evidence records", () => {
  const ids = new Set(data.nodes.map((n) => n.id));
  for (const e of data.edges) {
    assert.ok(ids.has(e.source) && ids.has(e.target));
    assert.equal(typeof evidenceLabel(e), "string");
    assert.ok(matchesEvidence(e, "all"));
  }
  assert.ok(data.edges.some((e) => (e.evidence?.length || 0) > 0));
});
test("source links reject script and local protocols", () => {
  assert.equal(safeLink("javascript:alert(1)"), undefined);
  assert.equal(safeLink("file:///private"), undefined);
  assert.equal(
    safeLink("https://pubmed.ncbi.nlm.nih.gov/38200114/"),
    "https://pubmed.ncbi.nlm.nih.gov/38200114/",
  );
});
