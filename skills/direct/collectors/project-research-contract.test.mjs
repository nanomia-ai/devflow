import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectors } from "./index.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
}

async function project() {
  const root = await mkdtemp(join(tmpdir(), "direct-project-state-"));
  await mkdir(join(root, ".devflow", "project"), { recursive: true });
  await mkdir(join(root, ".devflow", "tree", "01-foundation"), { recursive: true });
  await mkdir(join(root, ".devflow", "users", "jmp"), { recursive: true });
  await writeFile(join(root, ".devflow", "project", "product.md"), "# Product\n\nService: fixture\n\n## Capabilities\n\n- foundation\n", "utf8");
  await writeFile(join(root, ".devflow", "project", "arch.md"), "# Architecture\n\nIntegration branch: main\n", "utf8");
  await writeFile(join(root, ".devflow", "journal.md"), "# Journal\n", "utf8");
  await writeFile(join(root, ".devflow", "users", "jmp", "owner.md"), "id: jmp\ngit: Fixture, fixture@example.invalid\n", "utf8");
  await writeFile(join(root, ".devflow", "users", "jmp", "HANDOFF.md"), "", "utf8");
  await writeFile(join(root, ".devflow", "users", "jmp", "digest.md"), "none\n", "utf8");
  git(root, "init", "-b", "main");
  git(root, "config", "user.email", "fixture@example.invalid");
  git(root, "config", "user.name", "Fixture");
  git(root, "add", ".");
  git(root, "commit", "-m", "fixture");
  return { root };
}

test("00-project accepts only the canonical research heading", () => {
  const collector = readFileSync(join(root, "collectors", "index.mjs"), "utf8");
  assert.match(collector, /\^# \\d\+\\\.\\d\+ Research:/);
  assert.match(collector, /00-project card is not a canonical research card/);
  assert.match(collector, /\.devflow\/project-state\/2/);
  assert.doesNotMatch(collector, /state\.compatibility\.(?:snapshot|evaluated)/);
});

test("collector accepts the schema-2 core without a compatibility projection", async () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "devflow-direct-core-state-"));
  try {
    const skillRoot = join(fixtureRoot, "direct");
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

test("an active failure-route bundle keeps its durable Direct request", async () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "devflow-direct-failure-route-"));
  try {
    const skillRoot = join(fixtureRoot, "direct");
    const projectRoot = join(fixtureRoot, "project");
    const toolRoot = join(fixtureRoot, "principles", "scripts");
    mkdirSync(skillRoot, { recursive: true });
    mkdirSync(projectRoot, { recursive: true });
    mkdirSync(toolRoot, { recursive: true });
    writeFileSync(join(toolRoot, "project-state.mjs"), `export async function calculateState() {
  return {
    schema: "devflow/project-state/2",
    route: { id: "transition.layer-opening", zone: "transition", kind: "layer-opening" },
    zones: {
      setup: { entries: [] },
      transition: { entries: [
        {
          kind: "layer-opening",
          timestamp: "2026-09-04T00:00:00Z",
          sourceJson: "verify:.devflow/tree/01-foundation/verify.md#Failure history@7",
          parent: ".devflow/tree/01-foundation",
          children: "01"
        },
        { kind: "failure-routing", path: ".devflow/tree/01-foundation/verify.md", sourceId: 7 }
      ] }
    },
    facts: { existingRequests: [] },
    metadata: { head: "${"0".repeat(40)}" }
  };
}\n`);
    const context = { skillRoot, projectRoot };
    const source = "verify:.devflow/tree/01-foundation/verify.md#Failure history@7";
    assert.deepEqual(await collectors["state.request.current"](context), { source, request: source });
    assert.equal(await collectors["state.request.phase"](context), "failure-routed");
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("uncommitted canonical request record is the current request on rejudge", async () => {
  const fixture = await project();
  try {
    const line = '2026-08-31T00:00:00Z maintenance routing pending: request-json: "repair the intake"';
    writeFileSync(join(fixture.root, ".devflow", "journal.md"), `# Journal\n${line}\n`, "utf8");
    assert.deepEqual(await collectors["state.request.current"]({ skillRoot: root, projectRoot: fixture.root }), {
      source: `journal:${line}`,
      request: "repair the intake"
    });
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("request phase follows the request introduction and canonical design commit", async () => {
  const fixture = await project();
  try {
    const line = '2026-09-03T00:00:00Z maintenance routing pending: request-json: "refresh the design"';
    writeFileSync(join(fixture.root, ".devflow", "journal.md"), `# Journal\n${line}\n`, "utf8");
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "uncommitted");

    git(fixture.root, "add", ".devflow/journal.md");
    git(fixture.root, "commit", "-m", "jmp 01.1 wip: design discovery");
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "committed");

    writeFileSync(join(fixture.root, ".devflow", "project", "design.md"), "# Design\n", "utf8");
    git(fixture.root, "add", ".devflow/project/design.md");
    git(fixture.root, "commit", "-m", "jmp design — design.md");
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "design-confirmed");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("each design commit confirms only the oldest request present in its journal", async () => {
  const fixture = await project();
  try {
    const first = '2026-09-03T00:00:00Z maintenance routing pending: request-json: "refresh navigation"';
    const second = '2026-09-03T00:00:01Z maintenance routing pending: request-json: "refresh checkout"';
    writeFileSync(join(fixture.root, ".devflow", "journal.md"), `# Journal\n${first}\n${second}\n`, "utf8");
    git(fixture.root, "add", ".devflow/journal.md");
    git(fixture.root, "commit", "-m", "jmp 01.1 wip: two design discoveries");

    writeFileSync(join(fixture.root, ".devflow", "project", "design.md"), "# Design\n\nNavigation confirmed.\n", "utf8");
    git(fixture.root, "add", ".devflow/project/design.md");
    git(fixture.root, "commit", "-m", "jmp design — design.md");
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "design-confirmed");

    writeFileSync(join(fixture.root, ".devflow", "journal.md"), `# Journal\n${second}\n`, "utf8");
    git(fixture.root, "add", ".devflow/journal.md");
    git(fixture.root, "commit", "-m", "jmp direct — navigation plan");
    assert.deepEqual(await collectors["state.request.current"]({ skillRoot: root, projectRoot: fixture.root }), {
      source: `journal:${second}`,
      request: "refresh checkout"
    });
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "committed");

    writeFileSync(join(fixture.root, ".devflow", "project", "design.md"), "# Design\n\nCheckout confirmed.\n", "utf8");
    git(fixture.root, "add", ".devflow/project/design.md");
    git(fixture.root, "commit", "-m", "jmp design — design.md");
    assert.equal(await collectors["state.request.phase"]({ skillRoot: root, projectRoot: fixture.root }), "design-confirmed");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
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
