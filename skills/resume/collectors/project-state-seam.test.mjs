import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { collectors } from "./index.mjs";
import { unknown as unknownValue } from "../scripts/skill-rails/dsl.mjs";

const projectRoot = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));
const skillRoot = realpathSync(fileURLToPath(new URL("../", import.meta.url)));

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
}

function write(root, relative, content) {
  const target = join(root, ...relative.split("/"));
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, content, "utf8");
}

function makeProject(t, brownfield) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "resume-project-state-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, "init", "-q", "-b", "main");
  git(root, "config", "core.autocrlf", "false");
  git(root, "config", "user.name", "Fixture");
  git(root, "config", "user.email", "fixture@example.invalid");
  write(root, "devflow/project/product.md", "# Product\n\nService: fixture\n\n## Capabilities\n\nNone.\n");
  write(root, "devflow/project/arch.md", `# Architecture\n\n${brownfield === null ? "" : `Brownfield: ${brownfield}\n`}Integration branch: main\n\n## Components\n\nNone.\n`);
  write(root, "devflow/project/glossary.md", "# Glossary\n\nNone.\n");
  write(root, "devflow/project/code-style.md", "# Code Style\n\nNone.\n");
  write(root, "devflow/journal.md", "# Journal\n");
  write(root, "devflow/users/fixture/owner.md", "id: fixture\ngit: Fixture, fixture@example.invalid\n");
  write(root, "devflow/users/fixture/HANDOFF.md", "");
  git(root, "add", ".");
  git(root, "commit", "-q", "-m", "fixture");
  return root;
}

function stageProject(t, root) {
  const trace = realpathSync(mkdtempSync(join(tmpdir(), "resume-stage-trace-")));
  t.after(() => rmSync(trace, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [
    join(skillRoot, "scripts", "skill-rails", "run.mjs"), "stage",
    "--skill", skillRoot, "--project", root, "--trace-dir", trace, "--json",
    "--judged", "intent.scope=ordinary"
  ], { encoding: "utf8", windowsHide: true });
  assert.ok([0, 2].includes(run.status), run.stderr || run.stdout);
  return JSON.parse(run.stdout).decision;
}

test("resume collector requires an explicit root and reads the schema-2 state seam", async () => {
  assert.equal(await collectors["state.schema"]({}), "unavailable");
  const context = { projectRoot };
  assert.equal(await collectors["state.schema"](context), "schema-2");
  assert.notEqual(await collectors["state.canonical-next"](context), "unrecognized");
  assert.equal(await collectors["state.zones"](context), "available");
  assert.equal(await collectors["state.facts"](context), "available");
});

test("resume collector consumes only canonical brownfield metadata", async (t) => {
  const yesProject = makeProject(t, "yes");
  const noProject = makeProject(t, "no");
  const missingProject = makeProject(t, null);

  assert.equal(await collectors["state.brownfield"]({ projectRoot: yesProject }), "yes");
  assert.equal(await collectors["state.brownfield"]({ projectRoot: noProject }), "no");
  assert.deepEqual(await collectors["state.brownfield"]({ projectRoot: missingProject }), unknownValue());
});

test("setup routing does not read branch-local brownfield state", (t) => {
  const decision = stageProject(t, makeProject(t, null));
  assert.equal(decision.status, "ASK");
  assert.equal(decision.stage, "scope-entry");
  assert.equal(decision.row, "ASK:setup");
  assert.equal(decision.facts.some(({ field }) => field === "state.brownfield"), false);
});

test("brownfield-consuming routes remain fail-closed until yes or no", async () => {
  const { simulateSkill } = await import(pathToFileURL(join(skillRoot, "scripts", "skill-rails", "api.mjs")).href);
  const simulate = brownfield => simulateSkill({
    skillRoot,
    fixture: {
      id: `brownfield-${brownfield}`,
      s: { "state.canonicalNext": "baseline.design-refresh", "state.brownfield": brownfield },
      judged: { "intent.scope": "ordinary" }
    }
  });

  const unknown = (await simulate("UNKNOWN")).decision;
  assert.equal(unknown.status, "BLOCK");
  assert.equal(unknown.stage, "scope-entry");
  assert.equal(unknown.row, "ROUTE:adopt");
  assert.deepEqual(unknown.needs.map(({ field }) => field), ["state.brownfield"]);

  const yes = (await simulate("yes")).decision;
  assert.equal(yes.status, "ROUTE");
  assert.equal(yes.row, "ROUTE:adopt");
  assert.equal(yes.effects.at(-1), "ROUTE:adopt");

  const no = (await simulate("no")).decision;
  assert.equal(no.status, "ROUTE");
  assert.equal(no.row, "ROUTE:arch");
  assert.equal(no.effects.at(-1), "ROUTE:arch");
});
