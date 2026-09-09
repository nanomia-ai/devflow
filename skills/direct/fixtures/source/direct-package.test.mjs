import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(sourceDir, "../..");

test("materialization gives T-low cards concrete basis without copying automatic inputs", async () => {
  const spec = await import(pathToFileURL(join(skillRoot, "spec.mjs")).href);
  const stage = spec.STAGES.find(({ id }) => id === "materialize");
  const body = readFileSync(join(skillRoot, "body.md"), "utf8");

  for (const branch of ["continue-active-bundle", "begin-request-bundle"]) {
    const effects = stage.branches[branch];
    const cardWrite = effects.findIndex((effect) => Array.isArray(effect) && effect[0] === "WRITE" && effect[1].artifact === "cardBundle");
    const projection = effects.findIndex((effect) => Array.isArray(effect) && effect[0] === "RUN" && /minimal bounded concrete provider or consumer code\/test paths/.test(effect[1].action));
    assert.ok(projection >= 0 && projection < cardWrite, branch);
    assert.match(effects[projection][1].action, /for every task or research card, put only destination-matched exact K paths in Read first/);
    assert.match(effects[projection][1].action, /Never copy automatic Layer 0, number-owned current capability, or Binding ADR inputs into a card/);
    assert.match(effects[projection][1].action, /any essential ordering or dataflow constraint in Destination or Forbidden/);
    assert.match(effects[projection][1].action, /exactly the literal Read first: none and Forbidden: T-low basis: N\/A — greenfield\|independent/);
    assert.match(effects[projection][1].action, /task-specific fixture in both Destination and Completion signal/);
    assert.equal(effects.some((effect) => Array.isArray(effect) && effect[0] === "WRITE" && /knowledge/i.test(effect[1].artifact ?? "")), false);
  }

  assert.match(body, /Every task or research card puts only destination-matched exact K paths/);
  assert.match(body, /T-low implementation card additionally puts the minimal bounded concrete provider or consumer code\/test paths its consumer needs/);
  assert.match(body, /no card copies those paths into `Read first`/);
  assert.match(body, /any essential ordering or dataflow constraint in Destination or Forbidden/);
  assert.match(body, /exactly the literal `Read first: none` with `Forbidden: T-low basis: N\/A — greenfield\|independent`/);
  assert.match(body, /Affected knowledge owners.*never acting as the sole read gate/);
  assert.match(body, /Reproject only a needed nested branch/);
  assert.match(body, /never open bodies or enumerate other capabilities/);
});
