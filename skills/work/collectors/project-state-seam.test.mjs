import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { calculateState } from "../../principles/scripts/project-state.mjs";
import { collectors } from "./index.mjs";

const template = (await readFile(new URL("../templates/remote-evidence-check.md", import.meta.url), "utf8")).trimEnd();

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
}

function remoteLine(check, detail) {
  return template
    .replace("{{timestamp}}", "2026-08-30T00:00:00Z")
    .replace("{{checkJson}}", check)
    .replace("{{verdict}}", "pending")
    .replace("{{detailJson}}", detail);
}

async function project(progress) {
  const root = await mkdtemp(join(tmpdir(), "work-project-state-"));
  await mkdir(join(root, "devflow", "project"), { recursive: true });
  await mkdir(join(root, "devflow", "tree", "01-foundation"), { recursive: true });
  await mkdir(join(root, "devflow", "users", "jmp"), { recursive: true });
  await writeFile(join(root, "devflow", "project", "product.md"), "# Product\n\nService: fixture\n\n## Capabilities\n\n- foundation\n", "utf8");
  await writeFile(join(root, "devflow", "project", "arch.md"), "# Architecture\n\nIntegration branch: main\n", "utf8");
  await writeFile(join(root, "devflow", "journal.md"), "# Journal\n", "utf8");
  await writeFile(join(root, "devflow", "users", "jmp", "owner.md"), "id: jmp\ngit: Fixture, fixture@example.invalid\n", "utf8");
  await writeFile(join(root, "devflow", "users", "jmp", "HANDOFF.md"), "", "utf8");
  await writeFile(join(root, "devflow", "users", "jmp", "digest.md"), "none\n", "utf8");
  const cardPath = "devflow/tree/01-foundation/01.1-remote.wip-jmp.md";
  await writeFile(join(root, ...cardPath.split("/")), `# 01.1 Remote\nCoordinates: fixture / foundation / 01.1\nIdentity: fixture\n\nDestination: fixture\nWhy: fixture\nCompletion signal: observe fixture\nDepends: none\nRead first: none\nApproval: 2026-08-30T00:00:00Z; parallel: none\nReview: required\n\n## Progress log\n${progress}\n`, "utf8");
  git(root, "init", "-b", "main");
  git(root, "config", "user.email", "fixture@example.invalid");
  git(root, "config", "user.name", "Fixture");
  git(root, "add", ".");
  git(root, "commit", "-m", "fixture");
  return { root, cardPath };
}

test("schema-2 principles accepts the exact remote template and work observes it", async () => {
  const fixture = await project(remoteLine(JSON.stringify("https://ci.example/run/1; verdict: fail"), JSON.stringify('owner said "wait"')));
  try {
    const state = await calculateState({ root: fixture.root });
    assert.equal(state.schema, "devflow/project-state/2");
    assert.equal(state.zones.integrity.entries.some(entry => entry.path === fixture.cardPath), false, JSON.stringify({ integrity: state.zones.integrity.entries, claim: state.zones.claim.entries }));
    assert.equal(await collectors["work/state.kernel"]({ projectRoot: fixture.root }), "available");
    assert.equal(await collectors["work/remote.state"]({ projectRoot: fixture.root, cardPath: fixture.cardPath }), "pending");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

for (const [name, check, detail] of [
  ["bare check token", "run-1", JSON.stringify("waiting")],
  ["object check token", '{"run":1}', JSON.stringify("waiting")],
  ["bare detail token", JSON.stringify("run-1"), "waiting"]
]) test(`schema-2 principles makes ${name} an integrity block`, async () => {
  const fixture = await project(remoteLine(check, detail));
  try {
    const state = await calculateState({ root: fixture.root });
    assert.equal(state.schema, "devflow/project-state/2");
    assert.equal(state.zones.integrity.entries.some(entry => entry.path === fixture.cardPath), true, JSON.stringify({ integrity: state.zones.integrity.entries, claim: state.zones.claim.entries }));
    assert.equal(await collectors["work/remote.state"]({ projectRoot: fixture.root, cardPath: fixture.cardPath }), "invalid");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
