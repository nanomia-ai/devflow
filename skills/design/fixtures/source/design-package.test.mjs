import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(sourceDir, "../..");

test("proposal and confirmation discover bounded input-owner K before reporting", async () => {
  const spec = await import(pathToFileURL(join(skillRoot, "spec.mjs")).href);
  const body = readFileSync(join(skillRoot, "body.md"), "utf8");
  const proposal = spec.STAGES.find((stage) => stage.id === "proposal").branches["needs-choice"];
  const confirmation = spec.STAGES.find((stage) => stage.id === "confirmation");

  for (const effects of [proposal, confirmation.branches.ask]) {
    assert.deepEqual(effects.slice(0, 2).map((effect) => effect[0]), ["RUN", "RUN"]);
    assert.match(effects[0][1].action, /product\/K and arch\/K headers separately under each exact input owner/);
    assert.match(effects[0][1].action, /first-line use-when matches a pending Design judgment/);
    assert.equal(effects.findIndex((effect) => Array.isArray(effect) && effect[0] === "REPORT"), 2);
  }

  assert.deepEqual(spec.ARTIFACTS.productKnowledge, { path: ".devflow/project/product", writer: "external.product", readers: ["stage.proposal", "stage.confirmation"] });
  assert.deepEqual(spec.ARTIFACTS.archKnowledge, { path: ".devflow/project/arch", writer: "external.arch", readers: ["stage.proposal", "stage.confirmation"] });
  assert.match(JSON.stringify(confirmation.branches.commit), /approved sourced design-owned units/);
  assert.doesNotMatch(JSON.stringify(confirmation.branches.commit), /productKnowledge|archKnowledge/);
  assert.match(body, /Product and Architecture owners' K headers/);
});
