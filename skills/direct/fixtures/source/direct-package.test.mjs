import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(sourceDir, "../..");

test("materialization projects bounded owner K headers before writing cards", async () => {
  const spec = await import(pathToFileURL(join(skillRoot, "spec.mjs")).href);
  const stage = spec.STAGES.find(({ id }) => id === "materialize");
  const body = readFileSync(join(skillRoot, "body.md"), "utf8");

  for (const branch of ["continue-active-bundle", "begin-request-bundle"]) {
    const effects = stage.branches[branch];
    const cardWrite = effects.findIndex((effect) => Array.isArray(effect) && effect[0] === "WRITE" && effect[1].artifact === "cardBundle");
    const projection = effects.findIndex((effect) => Array.isArray(effect) && effect[0] === "RUN" && /project existing K headers/.test(effect[1].action));
    assert.ok(projection >= 0 && projection < cardWrite, branch);
    assert.equal(effects.some((effect) => Array.isArray(effect) && effect[0] === "WRITE" && /knowledge/i.test(effect[1].artifact ?? "")), false);
  }

  assert.match(body, /current Layer 0 owner needed by the unit, its target capability, and any explicit crosscut owner/);
  assert.match(body, /Affected knowledge owners.*not the sole read gate/);
  assert.match(body, /never open bodies or enumerate other capabilities/);
});
