import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLayout } from "./graph-layout.ts";

test("layout retains disconnected entities and does not mutate worker input", () => {
  const input = {
    ids: Array.from({ length: 40 }, (_, i) => `node-${i}`),
    edges: [{ source: "node-0", target: "node-1" }],
    spacing: 1,
  };
  const original = structuredClone(input);
  const result = calculateLayout(input);
  assert.deepEqual(input, original);
  assert.deepEqual(Object.keys(result), input.ids);
  for (const point of Object.values(result)) {
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
  }
  assert.deepEqual(calculateLayout(input), result);
});
