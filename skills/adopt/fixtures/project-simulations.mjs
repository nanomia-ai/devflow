import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { simulateSkill } from "../scripts/skill-rails/api.mjs";

const skillRoot = fileURLToPath(new URL("../", import.meta.url));
const scenarios = JSON.parse(await readFile(new URL("scenarios.json", import.meta.url), "utf8"));
const required = [
  "adoption-prepare", "approval-refuse", "approval-approve", "no-project-material", "managed-state",
  "integrity-block"
];
for (const id of required) assert.ok(scenarios.some(item => item.id === id), `missing required scenario ${id}`);
await access(new URL("projects/initial-brownfield/src/server.js", import.meta.url));
await access(new URL("projects/initial-brownfield/docs/orders.md", import.meta.url));
await access(new URL("projects/missing-code/README.md", import.meta.url));
for (const id of required) {
  const fixture = scenarios.find(item => item.id === id);
  const result = await simulateSkill({ skillRoot, fixture, fullValidation: false });
  assert.equal(result.decision.status, fixture.expect.status, id);
}
console.log(JSON.stringify({ projectFixtures: 3, simulations: required.length, status: "pass" }));
