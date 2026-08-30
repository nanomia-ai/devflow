import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { calculateState } from "../../principles/scripts/project-state.mjs";
import { collectors } from "./index.mjs";

const template = (await readFile(new URL("../templates/remote-evidence-check.md", import.meta.url), "utf8")).trimEnd();
const skillRoot = fileURLToPath(new URL("../", import.meta.url));

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

async function stageProject(t, root, targetPath) {
  const trace = await mkdtemp(join(tmpdir(), "work-stage-trace-"));
  t.after(() => rm(trace, { recursive: true, force: true }));
  const args = [
    join(skillRoot, "scripts", "skill-rails", "run.mjs"), "stage",
    "--skill", skillRoot, "--project", root, "--trace-dir", trace, "--json",
    ...(targetPath === undefined ? [] : ["--target", targetPath, "--judged", "history.basis=none"])
  ];
  const result = spawnSync(process.execPath, args, { encoding: "utf8", windowsHide: true });
  assert.ok([0, 2].includes(result.status), result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.schema, "skill-rails/stage-result/1");
  return parsed.decision;
}

function targetFact(decision) {
  return decision.facts.find(({ field }) => field === "card.target")?.value;
}

function fact(decision, field) {
  return decision.facts.find(item => item.field === field)?.value;
}

test("schema-2 principles accepts the exact remote template and work observes it", async () => {
  const fixture = await project(remoteLine(JSON.stringify("https://ci.example/run/1; verdict: fail"), JSON.stringify('owner said "wait"')));
  try {
    const state = await calculateState({ root: fixture.root });
    assert.equal(state.schema, "devflow/project-state/2");
    assert.equal(state.zones.integrity.entries.some(entry => entry.path === fixture.cardPath), false, JSON.stringify({ integrity: state.zones.integrity.entries, claim: state.zones.claim.entries }));
    assert.equal(await collectors["work/state.kernel"]({ projectRoot: fixture.root }), "available");
    assert.equal(await collectors["work/remote.state"]({ projectRoot: fixture.root, targetPath: fixture.cardPath }), "pending");
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
    assert.equal(await collectors["work/remote.state"]({ projectRoot: fixture.root, targetPath: fixture.cardPath }), "invalid");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("public target selects one of two simultaneous claims and becomes a Decision fact", async (t) => {
  const fixture = await project(remoteLine(JSON.stringify("https://ci.example/run/2"), JSON.stringify("waiting")));
  try {
    const secondPath = "devflow/tree/01-foundation/01.2-local.wip-jmp.md";
    const first = await readFile(join(fixture.root, ...fixture.cardPath.split("/")), "utf8");
    await writeFile(join(fixture.root, ...secondPath.split("/")), first
      .replace("# 01.1 Remote", "# 01.2 Local")
      .replace(/## Progress log\n[\s\S]*$/, "## Progress log\n\n"), "utf8");
    git(fixture.root, "add", ".");
    git(fixture.root, "commit", "-m", "second simultaneous claim");

    const remoteDecision = await stageProject(t, fixture.root, fixture.cardPath);
    assert.equal(targetFact(remoteDecision), fixture.cardPath);
    assert.equal(fact(remoteDecision, "card.phase"), "claimed");
    assert.equal(fact(remoteDecision, "remote.state"), "pending");

    const localDecision = await stageProject(t, fixture.root, secondPath);
    assert.equal(targetFact(localDecision), secondPath);
    assert.equal(fact(localDecision, "card.phase"), "claimed");
    assert.equal(fact(localDecision, "remote.state"), "none");
    assert.notEqual(remoteDecision.decision_id, localDecision.decision_id);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("missing public target is UNKNOWN guidance and never invalid-card routing", async (t) => {
  const fixture = await project("");
  try {
    const decision = await stageProject(t, fixture.root);
    assert.equal(decision.status, "BLOCK");
    assert.equal(decision.guard.id, "card-target-required");
    assert.deepEqual(targetFact(decision), { kind: "UNKNOWN", reason: "unknown", details: null });
    assert.ok(decision.snapshot.unknowns.some(({ field }) => field === "card.target"));
    assert.deepEqual(decision.needs.map(({ field }) => field), ["card.target"]);
    assert.match(decision.body.markdown, /public `--target` stage option/);
    assert.equal(JSON.stringify(decision).includes("ROUTE:split"), false);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("direct card collector rejects lexical escapes before reading outside the project", async () => {
  const fixture = await project("");
  const outside = await mkdtemp(join(tmpdir(), "work-collector-outside-"));
  try {
    const cardText = await readFile(join(fixture.root, ...fixture.cardPath.split("/")), "utf8");
    const outsideCard = join(outside, "outside.md");
    await writeFile(outsideCard, cardText, "utf8");
    const absolute = join(fixture.root, ...fixture.cardPath.split("/"));
    const parent = `../${basename(outside)}/outside.md`;
    const dot = fixture.cardPath.replace("01-foundation/", "01-foundation/./");
    const empty = fixture.cardPath.replace("01-foundation/", "01-foundation//");
    const backslash = fixture.cardPath.replaceAll("/", "\\");
    for (const targetPath of [absolute, parent, dot, empty, backslash]) {
      assert.equal(await collectors["work/card.contract"]({ projectRoot: fixture.root, targetPath }), "invalid", targetPath);
    }
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test("direct card collector rejects a physical symlink or junction escape before reading outside the project", async () => {
  const fixture = await project("");
  const outside = await mkdtemp(join(tmpdir(), "work-collector-physical-outside-"));
  const link = join(fixture.root, "devflow", "tree", "escape");
  try {
    const cardText = await readFile(join(fixture.root, ...fixture.cardPath.split("/")), "utf8");
    await writeFile(join(outside, "outside.md"), cardText, "utf8");
    await symlink(outside, link, process.platform === "win32" ? "junction" : "dir");
    const targetPath = "devflow/tree/escape/outside.md";
    assert.equal(await collectors["work/card.contract"]({ projectRoot: fixture.root, targetPath }), "invalid");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test("ready file-shape entries resolve through the supplied target", async (t) => {
  const fixture = await project("");
  try {
    const readyPath = fixture.cardPath.replace(".wip-jmp.md", ".md");
    git(fixture.root, "mv", fixture.cardPath, readyPath);
    git(fixture.root, "commit", "-m", "ready card");
    assert.equal(await collectors["work/card.phase"]({ projectRoot: fixture.root, targetPath: readyPath }), "ready");
    const decision = await stageProject(t, fixture.root, readyPath);
    assert.equal(targetFact(decision), readyPath);
    assert.equal(fact(decision, "card.phase"), "ready");
    assert.notEqual(decision.guard?.id, "invalid-card");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("work consumes the ordered multiline readFirst projection", async () => {
  const fixture = await project("");
  try {
    await mkdir(join(fixture.root, "docs"), { recursive: true });
    await writeFile(join(fixture.root, "docs", "first.md"), "first\n", "utf8");
    const card = await readFile(join(fixture.root, ...fixture.cardPath.split("/")), "utf8");
    await writeFile(join(fixture.root, ...fixture.cardPath.split("/")), card.replace(
      "Read first: none",
      "Read first: docs/first.md\n  docs/second.md"
    ), "utf8");
    git(fixture.root, "add", ".");
    git(fixture.root, "commit", "-m", "multiline read first");

    const state = await calculateState({ root: fixture.root });
    const entry = state.zones.claim.entries.find(({ path }) => path === fixture.cardPath);
    assert.deepEqual(entry.readFirst, ["docs/first.md", "docs/second.md"]);
    assert.equal(await collectors["work/card.basis"]({ projectRoot: fixture.root, targetPath: fixture.cardPath }), "missing");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("canonical done target is terminal without an invalid-card route", async (t) => {
  const pass = remoteLine(JSON.stringify("https://ci.example/run/done"), JSON.stringify("passed"))
    .replace("verdict: pending", "verdict: pass");
  const fixture = await project(pass);
  try {
    const claimed = join(fixture.root, ...fixture.cardPath.split("/"));
    await writeFile(claimed, (await readFile(claimed, "utf8")).replace("Review: required", "Review: not-applicable"), "utf8");
    git(fixture.root, "add", ".");
    git(fixture.root, "commit", "-m", "pass evidence");
    const donePath = fixture.cardPath.replace(".wip-jmp.md", ".done.md");
    git(fixture.root, "mv", fixture.cardPath, donePath);
    git(fixture.root, "commit", "-m", "done card");
    const context = { projectRoot: fixture.root, targetPath: donePath };
    assert.equal(await collectors["work/card.phase"](context), "done");
    assert.equal(await collectors["work/card.basis"](context), "complete");
    assert.equal(await collectors["work/task.commit"](context), "present");
    assert.equal(await collectors["work/boundary.state"](context), "complete");
    const decision = await stageProject(t, fixture.root, donePath);
    assert.equal(decision.status, "DONE");
    assert.notEqual(decision.guard?.id, "invalid-card");
    assert.equal(fact(decision, "card.phase"), "done");
    assert.equal(fact(decision, "card.basis"), "complete");
    assert.equal(fact(decision, "task.commit"), "present");
    assert.equal(fact(decision, "boundary.state"), "complete");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
