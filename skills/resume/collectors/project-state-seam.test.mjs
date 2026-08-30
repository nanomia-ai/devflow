import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectors } from "./index.mjs";

const projectRoot = realpathSync(fileURLToPath(new URL("../../../", import.meta.url)));

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
  assert.equal(await collectors["state.brownfield"]({ projectRoot: missingProject }), "UNKNOWN");
});
