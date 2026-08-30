import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectors } from "./index.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("00-project accepts only the canonical research heading", () => {
  const collector = readFileSync(join(root, "collectors", "index.mjs"), "utf8");
  assert.match(collector, /\^# \\d\+\\\.\\d\+ Research:/);
  assert.match(collector, /00-project card is not a canonical research card/);
  assert.match(collector, /devflow\/project-state\/2/);
  assert.doesNotMatch(collector, /state\.compatibility\.(?:snapshot|evaluated)/);
});

test("collector accepts the schema-2 core without a compatibility projection", async () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "devflow-split-core-state-"));
  try {
    const skillRoot = join(fixtureRoot, "split");
    const projectRoot = join(fixtureRoot, "project");
    const toolRoot = join(fixtureRoot, "principles", "scripts");
    mkdirSync(skillRoot, { recursive: true });
    mkdirSync(projectRoot, { recursive: true });
    mkdirSync(toolRoot, { recursive: true });
    writeFileSync(join(toolRoot, "project-state.mjs"), `export async function calculateState() {
  return {
    schema: "devflow/project-state/2",
    route: { id: "none", zone: null, kind: null },
    zones: { setup: { entries: [] } },
    facts: { existingRequests: [] },
    metadata: { head: "${"0".repeat(40)}" }
  };
}\n`);
    assert.equal(await collectors["state.project.product"]({ skillRoot, projectRoot }), "present");
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("task cards retain identity and one progress-log boundary", () => {
  const template = readFileSync(join(root, "templates", "task-card.md"), "utf8");
  assert.match(template, /^Coordinates: \{\{address\}\}$/m);
  assert.match(template, /^Identity: \{\{identity\}\}$/m);
  assert.equal((template.match(/^## Progress log$/gm) ?? []).length, 1);
});

test("00-project materialization names the research template only", () => {
  const spec = readFileSync(join(root, "spec.mjs"), "utf8");
  assert.match(spec, /00-project=researchCard; all-other-scopes=taskCard/);
  assert.match(spec, /forbiddenTemplates: "taskCard@00-project"/);
});

test("negative card fixtures describe only rejected contracts", () => {
  const fixtures = JSON.parse(readFileSync(join(root, "fixtures", "card-contract-negatives.json"), "utf8"));
  assert.deepEqual(fixtures.map(row => row.expect), ["integrity-block", "template-reject", "template-reject"]);
});
