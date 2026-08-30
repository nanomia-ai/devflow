import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { collectors } from "../../collectors/index.mjs";
import { DECLARATIONS, OBSERVATIONS, READ_FIRST, ROLES, STAGES } from "../../spec.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(here, "..", "..");
const classify = STAGES.find((stage) => stage.id === "classify");

test("pure tweak has zero state reads and exactly card=0 K=0 journal=0 commit=1", () => {
  assert.deepEqual(Object.keys(collectors), []);
  const observationText = JSON.stringify(OBSERVATIONS);
  for (const forbidden of ["project-state", "journal", "card", "dependency", "sibling"]) {
    assert.equal(observationText.includes(forbidden), false, forbidden);
  }
  const effects = classify.branches.tweak.filter(Array.isArray);
  assert.equal(effects.filter(([verb]) => verb === "COMMIT").length, 1);
  assert.deepEqual(effects.find(([verb]) => verb === "COMMIT"), ["COMMIT", { count: 1, subject: "tweak" }]);
  assert.match(DECLARATIONS.tweak_lane.value, /card=0, K=0, journal=0/);
});

test("role contracts bypass the request classifier", () => {
  for (const role of Object.values(ROLES)) {
    assert.equal(Object.hasOwn(role, "reads"), false);
    assert.equal(Object.hasOwn(role, "stage"), false);
  }
  assert.match(DECLARATIONS.role_bypass.value, /bypasses request classification/);
});

test("stateful and fallback branches route exactly once without a principles loop", () => {
  const normal = Object.entries(classify.branches).filter(([name]) => name.startsWith("normal-"));
  assert.ok(normal.length > 0);
  for (const [, effects] of normal) assert.deepEqual(effects, ["ROUTE:resume"]);
  assert.equal(JSON.stringify(classify.branches).includes("ROUTE:principles"), false);
});

test("mixed items retain accepted scope and package references survive a standalone copy", async () => {
  assert.deepEqual(classify.branches["normal-mixed"], ["ROUTE:resume"]);
  assert.equal(classify.reentry, "rejudge");
  assert.match(DECLARATIONS.mixed_items.value, /remaining tweak items without loss/);
  const sandbox = mkdtempSync(resolve(tmpdir(), "principles-portable-"));
  try {
    const copied = resolve(sandbox, "principles");
    cpSync(skillRoot, copied, { recursive: true });
    for (const item of READ_FIRST) assert.equal(existsSync(resolve(copied, item.path)), true, item.path);
    const moved = await import(`${pathToFileURL(resolve(copied, "collectors", "index.mjs")).href}?portable=1`);
    assert.deepEqual(Object.keys(moved.collectors), []);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
