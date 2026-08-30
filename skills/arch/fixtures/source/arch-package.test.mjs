import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(sourceDir, "../..");

function write(root, relative, content) {
  const target = join(root, ...relative.split("/"));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true }).trim();
}

function commit(root, subject) {
  git(root, "add", "-A");
  git(root, "commit", "-qm", subject);
  return git(root, "rev-parse", "HEAD");
}

function product() {
  return `# Fixture service

Fixture identity.

## Problem
Fixture problem.
## Approach
Fixture approach.
## Capabilities
None.
## Boundary
Fixture boundary.
## Success criteria
- fixture passes
## Screens & access points
None.
## Open questions
None.
`;
}

function architecture() {
  return `# Architecture

Brownfield: no
## Components
None.
## Stack
None.
## Code structure
None.
## Data
None.
## Risks
None.
## Out of scope
None.

frontend: none
verify_channel:
  work server: node --test
  means: CLI
integration: main
merge: merge-commit
`;
}

function makeProject(t) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "arch-p2-state-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, "init", "-q", "-b", "main");
  git(root, "config", "core.autocrlf", "false");
  git(root, "config", "user.name", "Arch Fixture");
  git(root, "config", "user.email", "arch@example.test");
  write(root, "devflow/project/product.md", product());
  write(root, "devflow/project/arch.md", architecture());
  write(root, "devflow/project/glossary.md", "# Glossary\n\nNone.\n");
  write(root, "devflow/project/code-style.md", "# Code Style\n\nNone.\n");
  write(root, "devflow/users/jmp/owner.md", "id: jmp\ngit: Arch Fixture, arch@example.test\n");
  write(root, "devflow/users/jmp/HANDOFF.md", "");
  write(root, "devflow/journal.md", "");
  write(root, "seed.txt", "seed\n");
  commit(root, "jmp layer 0");
  const card = "devflow/tree/00-project/00.1-source.done.md";
  write(root, card, `# 00.1 Research: durable source
Coordinates: project research
Identity: durable source.
Destination: architecture knowledge
Why: retain evidence
Forbidden: none
Depends: none
Read first: none
Completion signal: node --test
Approval: 2026-08-29T00:00:00Z; parallel: none
Review: required

## Progress log
2026-08-29T00:00:00Z durable research conclusion
`);
  const hash = commit(root, "jmp 00.1 wip: research synthesis");
  return { root, card, hash, source: `${card}@${hash}` };
}

function marker(owner, writer, source, timestamp = "2026-08-29T01:00:00Z") {
  return `${timestamp} knowledge landing pending: owner: ${owner}; writer: ${writer}; source-json: ${JSON.stringify(source)}`;
}

async function currentContractCollectors(t) {
  const url = pathToFileURL(join(skillRoot, "collectors", "index.mjs"));
  url.searchParams.set("fixture", String(Date.now()));
  return (await import(url.href)).collectors;
}

function stageProject(t, root, ...answers) {
  const trace = realpathSync(mkdtempSync(join(tmpdir(), "arch-p2-trace-")));
  t.after(() => rmSync(trace, { recursive: true, force: true }));
  const args = [
    join(skillRoot, "scripts", "skill-rails", "run.mjs"), "stage",
    "--skill", skillRoot, "--project", root, "--trace-dir", trace, "--json",
    ...answers.flatMap(([kind, value]) => [`--${kind}`, value])
  ];
  const run = spawnSync(process.execPath, args, { encoding: "utf8", windowsHide: true });
  assert.ok([0, 2].includes(run.status), run.stderr || run.stdout);
  const result = JSON.parse(run.stdout);
  assert.equal(result.schema, "skill-rails/stage-result/1");
  return result.decision;
}

test("collector consumes only the context-bound structured calculateState contract", async (t) => {
  const fixture = makeProject(t);
  const line = marker("devflow/project/arch.md", "arch", fixture.source);
  write(fixture.root, "devflow/journal.md", `${line}\n`);
  commit(fixture.root, "jmp boundary — knowledge landing");
  const collectors = await currentContractCollectors(t);
  const context = Object.freeze({ projectRoot: fixture.root });
  assert.equal(await collectors["state.arch-kernel"](context), "available");
  assert.equal(await collectors["state.arch-route"](context), "marker.knowledge-landing");
  assert.equal(await collectors["knowledge.arch-marker-count"](context), 1);
  const payload = JSON.parse(await collectors["knowledge.arch-markers"](context));
  assert.deepEqual(payload.map(({ owner, writer, source }) => ({ owner, writer, source })), [
    { owner: "devflow/project/arch.md", writer: "arch", source: fixture.source }
  ]);
  const decision = stageProject(t, fixture.root, ["judged", "landing.mode=compact"]);
  assert.equal(decision.stage, "knowledge-landing");
  assert.deepEqual(decision.effects.map((effect) => Array.isArray(effect) ? effect[0] : effect), ["READ", "WRITE", "RUN", "COMMIT", "NEXT"]);
});

test("invalid writer and non-JSON source are rejected by shared state, never arch-local parsing", async (t) => {
  const wrongWriter = makeProject(t);
  write(wrongWriter.root, "devflow/journal.md", `${marker("devflow/project/arch.md", "adopt", wrongWriter.source)}\n`);
  commit(wrongWriter.root, "jmp boundary — invalid writer");
  let collectors = await currentContractCollectors(t);
  assert.equal(await collectors["state.arch-route"]({ projectRoot: wrongWriter.root }), "integrity.blocking");
  const blockedWriter = stageProject(t, wrongWriter.root);
  assert.equal(blockedWriter.status, "BLOCK");
  assert.equal(blockedWriter.guard.id, "canonical-integrity-block");

  const rawSource = makeProject(t);
  const validPrefix = marker("devflow/project/arch.md", "arch", rawSource.source);
  const malformed = `${validPrefix.slice(0, validPrefix.indexOf("source-json: ") + "source-json: ".length)}${rawSource.source}`;
  write(rawSource.root, "devflow/journal.md", `${malformed}\n`);
  commit(rawSource.root, "jmp boundary — invalid source JSON");
  collectors = await currentContractCollectors(t);
  assert.equal(await collectors["state.arch-route"]({ projectRoot: rawSource.root }), "integrity.blocking");
  const blockedSource = stageProject(t, rawSource.root);
  assert.equal(blockedSource.status, "BLOCK");
  assert.equal(blockedSource.guard.id, "canonical-integrity-block");
});

test("structured multi-owner markers preserve exact owner/source pairs", async (t) => {
  const fixture = makeProject(t);
  const lines = [
    marker("devflow/project/arch.md", "arch", fixture.source),
    marker("devflow/project/product.md", "arch", fixture.source, "2026-08-29T01:01:00Z")
  ];
  write(fixture.root, "devflow/journal.md", `${lines.join("\n")}\n`);
  commit(fixture.root, "jmp boundary — multi-owner knowledge landing");
  const collectors = await currentContractCollectors(t);
  const context = { projectRoot: fixture.root };
  assert.equal(await collectors["knowledge.arch-marker-count"](context), 2);
  const payload = JSON.parse(await collectors["knowledge.arch-markers"](context));
  assert.deepEqual(payload.map((entry) => entry.owner), ["devflow/project/arch.md", "devflow/project/product.md"]);
  const decision = stageProject(t, fixture.root, ["judged", "landing.mode=partial-compact"]);
  assert.equal(decision.stage, "knowledge-landing");
  assert.deepEqual(decision.effects.map((effect) => Array.isArray(effect) ? effect[0] : effect), ["READ", "WRITE", "RUN", "COMMIT", "NEXT"]);
});

test("workflow has concrete writes and atomic landing boundaries", async () => {
  const spec = await import(pathToFileURL(join(skillRoot, "spec.mjs")).href);
  const landing = spec.STAGES.find((stage) => stage.id === "knowledge-landing");
  assert.ok(landing);
  for (const name of ["compact", "recursive", "partial-compact", "partial-recursive", "multi-mixed"]) {
    const effects = landing.branches[name];
    const verbs = effects.map((effect) => Array.isArray(effect) ? effect[0] : effect);
    assert.ok(verbs.includes("WRITE"), name);
    assert.ok(verbs.includes("RUN"), name);
    assert.ok(verbs.includes("COMMIT"), name);
    assert.equal(verbs.some((verb) => String(verb).includes("marker pending")), false);
    assert.ok(verbs.indexOf("WRITE") < verbs.indexOf("RUN") && verbs.indexOf("RUN") < verbs.indexOf("COMMIT"), name);
  }
  const approval = spec.STAGES.find((stage) => stage.id === "approval");
  assert.deepEqual(approval.branches["approve-initial"].map((effect) => Array.isArray(effect) ? effect[0] : effect), ["WRITE", "WRITE", "WRITE", "COMMIT", "NEXT"]);
});

test("templates retain exact Layer 0 and capability design-zone contracts", () => {
  const architectureText = readFileSync(join(skillRoot, "templates", "architecture.md"), "utf8");
  for (const required of ["Brownfield: no", "## Components", "## Stack", "## Code structure", "## Data", "## Existing records", "## Provisional", "frontend:", "verify_channel:", "  work server:", "  means:", "integration:", "merge:"]) {
    assert.ok(architectureText.includes(required), required);
  }
  const capabilityText = readFileSync(join(skillRoot, "templates", "capability-design.md"), "utf8");
  assert.deepEqual(capabilityText.split(/\r?\n/).slice(0, 5), [
    "# {{number}} {{name}}",
    "Purpose: {{purpose}}",
    "Boundary: {{boundary}}",
    "Concepts: {{concepts}}",
    "Trust: design reflects confirmed Layer 0; verified state reflects the last passing capability verification, or contains no evidence before one. Judge each zone by its metadata."
  ]);
  for (const required of ["## Intent", "## Concept model", "## Invariants", "## Non-goals", "## Binding ADRs", "## Design metadata", "Capability number: {{number}}", "Design head: {{designHead}}", "## Verified state", "### Main flow", "### Lifecycle", "### Current behavior", "### Entrypoints", "### Consumed contracts", "### Traps", "### Verify", "### Verification metadata", "Verified at: none", "Covered cards: []", "Scope paths: []", "Consumed paths: []", "Scope head: none"]) {
    assert.ok(capabilityText.includes(required), required);
  }
});

test("ledger resolves all 158 atoms to portable behavioral evidence", () => {
  const ledger = JSON.parse(readFileSync(join(skillRoot, ".skill-rails", "obligation-ledger.json"), "utf8"));
  const scenarios = new Set(JSON.parse(readFileSync(join(skillRoot, "fixtures", "scenarios.json"), "utf8")).map(({ id }) => id));
  assert.equal(ledger.atoms.length, 158);
  assert.equal(ledger.atoms.filter(({ disposition }) => disposition === "projected").length, 158);
  assert.equal(ledger.atoms.some(({ targets, evidence }) => [...targets, ...evidence].some((value) => /legacy-atoms|legacy-source|^[A-Za-z]:\\|review-required|DEFERRED/i.test(value))), false);
  for (const atom of ledger.atoms) {
    assert.ok(atom.targets.length > 0, atom.id);
    assert.ok(atom.evidence.length > 0, atom.id);
    for (const evidence of atom.evidence) {
      assert.ok(evidence.startsWith("fixture:") && scenarios.has(evidence.slice("fixture:".length)), `${atom.id}: ${evidence}`);
    }
  }
});
