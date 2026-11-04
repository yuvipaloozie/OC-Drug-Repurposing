import { test } from "node:test";
import assert from "node:assert/strict";
import { fitCamera } from "./graph-camera.ts";

test("fit centers node bounds with the existing toolbar clearance", () => {
  const size = { w: 800, h: 600 };
  const camera = fitCamera(
    [
      { x: -200, y: -100 },
      { x: 400, y: 300 },
    ],
    size,
    1.15,
    60,
  )!;
  assert.equal(camera.k, Math.min(1.15, 740 / 830, 475 / 510));
  assert.equal(camera.x + 100 * camera.k, 400);
  assert.equal(camera.y + 100 * camera.k, 270);
});

test("empty and single-node layouts keep existing fitting behavior", () => {
  assert.equal(fitCamera([], { w: 800, h: 600 }, 1.1, 50), null);
  assert.deepEqual(fitCamera([{ x: 0, y: 0 }], { w: 800, h: 600 }, 1.1, 50), {
    k: 1.1,
    x: 400,
    y: 270,
  });
});
