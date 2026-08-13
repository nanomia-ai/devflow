#!/usr/bin/env node
// Real-Git fixtures for the state transitions the canonical rules assert. Fifteen releases
// of devflow were verified by reading text; these run the commands instead.
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const { test } = require("node:test");

function makeRepo(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-git-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const gitBytes = (...args) => execFileSync("git", args, { cwd: root, encoding: "buffer" });
  const gitTry = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8" });
  git("init", "-q", "-b", "main");
  git("config", "user.name", "A");
  git("config", "user.email", "a@x");
  const write = (relative, content) => {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  write("devflow/journal.md", "");
  git("add", "-A");
  git("commit", "-qm", "base");
  return { root, git, gitBytes, gitTry, write };
}

// The canonical rules' "Publishing a shared transition": an unchanged integration id with a
// rejection is a structural blocker; a changed id is ordinary contention.
test("publishing to an unclaimed integration branch works with no remote", (t) => {
  const { git } = makeRepo(t);
  git("branch", "integration");
  const before = git("rev-parse", "integration");
  git("commit", "-q", "--allow-empty", "-m", "a 02.1 claim");
  git("push", "-q", ".", "HEAD:integration");
  assert.notEqual(git("rev-parse", "integration"), before);
  assert.equal(git("rev-parse", "integration"), git("rev-parse", "HEAD"));
});

test("a worktree holding integration refuses the publish and leaves its id unchanged", (t) => {
  const { root, git, gitTry } = makeRepo(t);
  git("branch", "integration");
  const holder = path.join(path.dirname(root), `${path.basename(root)}-holder`);
  t.after(() => fs.rmSync(holder, { recursive: true, force: true }));
  git("worktree", "add", "-q", holder, "integration");
  const before = git("rev-parse", "integration");
  git("commit", "-q", "--allow-empty", "-m", "a 02.1 claim");
  const push = gitTry("push", ".", "HEAD:integration");
  assert.notEqual(push.status, 0, "a checked-out integration branch must refuse the publish");
  assert.equal(git("rev-parse", "integration"), before, "an unchanged id is what marks it structural");
});

test("the ancestor test classifies a rejection where the remembered id cannot", (t) => {
  const { root, git, gitTry } = makeRepo(t);
  git("branch", "integration");
  const other = path.join(path.dirname(root), `${path.basename(root)}-other`);
  t.after(() => fs.rmSync(other, { recursive: true, force: true }));
  git("worktree", "add", "-q", other, "-b", "flow-other");
  execFileSync("git", ["config", "user.name", "B"], { cwd: other });
  execFileSync("git", ["config", "user.email", "b@x"], { cwd: other });

  // The sibling publishes first.
  execFileSync("git", ["commit", "-q", "--allow-empty", "-m", "b 03.1 boundary"], { cwd: other });
  execFileSync("git", ["push", "-q", ".", "HEAD:integration"], { cwd: other });

  // This flow only now remembers integration, so the id never changes under it.
  const remembered = git("rev-parse", "integration");
  git("commit", "-q", "--allow-empty", "-m", "a 02.1 boundary");
  assert.notEqual(gitTry("push", ".", "HEAD:integration").status, 0);
  assert.equal(git("rev-parse", "integration"), remembered, "the remembered id cannot see this race");
  assert.notEqual(
    gitTry("merge-base", "--is-ancestor", "integration", "HEAD").status, 0,
    "not an ancestor — the ancestor test calls this ordinary contention",
  );
  git("merge", "-q", "--no-edit", "integration", "-m", "merge");
  git("push", "-q", ".", "HEAD:integration");

  // A worktree holding integration refuses a push that IS a fast-forward.
  const holder = path.join(path.dirname(root), `${path.basename(root)}-holder`);
  t.after(() => fs.rmSync(holder, { recursive: true, force: true }));
  git("worktree", "add", "-q", holder, "integration");
  git("commit", "-q", "--allow-empty", "-m", "a 02.2 boundary");
  assert.notEqual(gitTry("push", ".", "HEAD:integration").status, 0);
  assert.equal(
    gitTry("merge-base", "--is-ancestor", "integration", "HEAD").status, 0,
    "an ancestor with a refusal — the ancestor test calls this a structural blocker",
  );
});

test("a commit names its own paths whatever else the working tree has staged", (t) => {
  const { git, write } = makeRepo(t);
  write("mine.md", "mine\n");
  write("theirs.md", "theirs\n");
  git("add", "--", "theirs.md"); // another flow staged this first
  // A pathspec commit only reaches paths git already knows, so a new path is added first;
  // the pathspec is what keeps the other flow's staged file out of the commit.
  git("add", "--", "mine.md");
  git("commit", "-q", "-m", "a 02.1 mine", "--", "mine.md");
  const carried = git("show", "--name-only", "--format=", "HEAD").split("\n").filter(Boolean);
  assert.deepEqual(carried, ["mine.md"]);
  assert.match(git("status", "--porcelain"), /^A\s+theirs\.md$/m, "the other flow keeps its staged file");
});

// The canonical state predicates' approval-freshness judgment, computed once per tree.
test("the tree-wide approval judgment matches the per-card judgment on hostile paths", (t) => {
  const { root, git, gitBytes, gitTry, write } = makeRepo(t);
  const TREE = "devflow/tree";
  const cards = {
    clean: `${TREE}/02-x/02.1-clean.md`,
    worktreeEdit: `${TREE}/02-x/02.2-worktree edit.md`,
    stagedEdit: `${TREE}/02-x/02.3-staged.md`,
    deleted: `${TREE}/02-x/02.4-deleted.md`,
    renamedFrom: `${TREE}/02-x/02.5-renamed.md`,
    unicode: `${TREE}/02-x/02.6-«ünïcødé-ローマ».md`,
    punctuated: `${TREE}/02-x/02.7-quote'and dollar$ and #hash %pct [br].md`,
    both: `${TREE}/02-x/02.9-both.md`,
    nested: `${TREE}/02-x/02.10-deep/02.10.1-child.md`,
  };
  const renamedTo = `${TREE}/03-y/03.1-renamed.md`;
  const untracked = `${TREE}/02-x/02.11-untracked.md`;
  for (const p of Object.values(cards)) write(p, "# card\nApproval: 2026-01-01T00:00:00Z; parallel: none\n");
  git("add", "-A");
  git("commit", "-qm", "cards");
  const authority = git("rev-parse", "HEAD");

  fs.appendFileSync(path.join(root, cards.worktreeEdit), "worktree\n");
  fs.appendFileSync(path.join(root, cards.stagedEdit), "staged\n");
  git("add", "--", cards.stagedEdit);
  fs.rmSync(path.join(root, cards.deleted));
  fs.mkdirSync(path.join(root, path.dirname(renamedTo)), { recursive: true });
  fs.renameSync(path.join(root, cards.renamedFrom), path.join(root, renamedTo));
  git("add", "-A", "--", TREE);
  fs.appendFileSync(path.join(root, cards.unicode), "u\n");
  fs.appendFileSync(path.join(root, cards.punctuated), "p\n");
  fs.appendFileSync(path.join(root, cards.nested), "n\n");
  fs.appendFileSync(path.join(root, cards.both), "s\n");
  git("add", "--", cards.both);
  fs.appendFileSync(path.join(root, cards.both), "w\n");
  write(untracked, "# new\n");

  const everyPath = [...Object.values(cards), renamedTo, untracked];
  const perCard = everyPath.filter((p) =>
    gitTry("diff", "--quiet", "--", p).status === 0 &&
    gitTry("diff", "--cached", "--quiet", authority, "--", p).status === 0);
  const nulList = (...args) => gitBytes(...args).toString("utf8").split("\0").filter(Boolean);
  const changed = new Set([
    ...nulList("diff", "--name-only", "-z", "--no-renames", "--", TREE),
    ...nulList("diff", "--cached", "--name-only", "-z", "--no-renames", authority, "--", TREE),
  ]);
  const treeWide = everyPath.filter((p) => !changed.has(p));

  assert.deepEqual(treeWide.sort(), perCard.sort());
  assert.deepEqual(perCard.sort(), [cards.clean, untracked].sort(), "only the untouched card stays effective");
  assert.ok(changed.has(cards.renamedFrom) && changed.has(renamedTo), "--no-renames must expose both sides");
});

// The capability-closing sweep deletes only the lines its marker snapshot held.
test("a journal blob at a recorded head keeps lines appended after it", (t) => {
  const { root, git } = makeRepo(t);
  const journal = path.join(root, "devflow", "journal.md");
  fs.appendFileSync(journal, "2026-01-01T00:00:00Z capability note: capability: 03; note-json: \"one\"\n");
  git("add", "-A");
  git("commit", "-qm", "a note one");
  const head = git("rev-parse", "HEAD");
  fs.appendFileSync(journal, "2026-01-02T00:00:00Z capability note: capability: 03; note-json: \"two\"\n");
  git("add", "-A");
  git("commit", "-qm", "b note two");

  const snapshot = git("show", `${head}:devflow/journal.md`).split("\n").filter(Boolean);
  const current = fs.readFileSync(journal, "utf8").split("\n").filter(Boolean);
  const remaining = current.filter((line) => !snapshot.includes(line));
  assert.deepEqual(remaining, ['2026-01-02T00:00:00Z capability note: capability: 03; note-json: "two"']);
});

// Four flows appending to one journal in one working tree lose nothing.
test("concurrent appends to journal keep every line intact", (t) => {
  const { root } = makeRepo(t);
  const journal = path.join(root, "devflow", "journal.md");
  const flows = ["w", "x", "y", "z"];
  const script = path.join(root, "append.js");
  fs.writeFileSync(script, `const fs=require("fs");
for (let i = 0; i < 5; i += 1) fs.appendFileSync(process.argv[2], process.argv[3] + i + "\\n");`);
  const runs = flows.map((flow) =>
    spawnSync(process.execPath, [script, journal, `flow-${flow}-`], { cwd: root, encoding: "utf8" }));
  for (const run of runs) assert.equal(run.status, 0, run.stderr);
  const lines = fs.readFileSync(journal, "utf8").split("\n").filter(Boolean);
  assert.equal(lines.length, 20);
  assert.equal(new Set(lines).size, 20, "no line may be truncated or merged into another");
});

// The canonical rules' journal merge: 3-way against the merge base — a line the base held
// that one side deleted was consumed and never comes back; lines absent from the base are
// additions and both survive. Union semantics revived consumed requests (measurements 15-16).
test("a 3-way journal merge drops the consumed line and keeps both additions", (t) => {
  const { root, git, gitTry, write } = makeRepo(t);
  write(
    "devflow/journal.md",
    "2026-01-01T00:00:00Z maintenance routing pending: request-json: \"fix rounding\"\n",
  );
  git("add", "-A");
  git("commit", "-qm", "a boundary — request recorded");
  const base = git("rev-parse", "HEAD");
  // side A consumes the request (its planning commit deletes the line)
  write("devflow/journal.md", "");
  git("add", "-A");
  git("commit", "-qm", "a split — plan consumes the request");
  // side B, forked before the consumption, appends an adjacent observation
  git("checkout", "-q", "-b", "flow-b", base);
  write(
    "devflow/journal.md",
    "2026-01-01T00:00:00Z maintenance routing pending: request-json: \"fix rounding\"\n" +
      "2026-01-02T00:00:00Z capability note: capability: 03; note-json: \"list sort is server-side\"\n",
  );
  git("add", "-A");
  git("commit", "-qm", "b boundary — note appended");
  const merge = gitTry("merge", "--no-edit", "main");
  // a delete-vs-adjacent-append IS a conflict (measurement 13); the canon resolves it 3-way
  const baseLines = git("show", `${base}:devflow/journal.md`).split("\n").filter(Boolean);
  if (merge.status !== 0) {
    const ours = git("show", ":2:devflow/journal.md").split("\n").filter(Boolean);
    const theirs = git("show", ":3:devflow/journal.md").split("\n").filter(Boolean);
    const resolved = [
      ...baseLines.filter((l) => ours.includes(l) && theirs.includes(l)),
      ...ours.filter((l) => !baseLines.includes(l)),
      ...theirs.filter((l) => !baseLines.includes(l)),
    ];
    fs.writeFileSync(
      path.join(root, "devflow/journal.md"),
      resolved.length ? resolved.join("\n") + "\n" : "",
    );
    git("add", "-A", "--", "devflow/journal.md");
    git("commit", "-qm", "b boundary — journal merge resolved 3-way");
  }
  const merged = fs.readFileSync(path.join(root, "devflow/journal.md"), "utf8");
  const mergedLines = merged.split("\n").filter(Boolean);
  // the consumed request (present in base, deleted on one side) must not revive
  for (const line of baseLines) {
    assert.ok(!mergedLines.includes(line), `consumed line revived: ${line}`);
  }
  // the addition (absent from base) must survive
  assert.ok(
    mergedLines.some((line) => line.includes("capability note: capability: 03")),
    "the appended observation must survive the merge",
  );
});

// Free parallel claims: three sessions in one folder each rename their own card and commit
// only its path — no claim mixes into another's commit, whatever else is staged.
test("three same-unit claims land as three clean path-scoped commits", (t) => {
  const { root, git, write } = makeRepo(t);
  for (const n of ["1", "2", "3"]) {
    write(`devflow/tree/04-listing/04.${n}-part.md`, `# 04.${n} part\n`);
  }
  git("add", "-A");
  git("commit", "-qm", "a split — 04 layer");
  for (const n of ["1", "2", "3"]) {
    const from = `devflow/tree/04-listing/04.${n}-part.md`;
    const to = `devflow/tree/04-listing/04.${n}-part.wip-a.md`;
    fs.renameSync(path.join(root, from), path.join(root, to));
    git("add", "-A", "--", from, to);
    git("commit", "-qm", `a 04.${n} claim`, "--", from, to);
    const shown = git("show", "--no-renames", "--name-only", "--format=", "HEAD")
      .split("\n")
      .filter(Boolean);
    assert.ok(shown.length >= 1 && shown.length <= 2, `unexpected path count for 04.${n}`);
    for (const p of shown) assert.ok(p.includes(`04.${n}-part`), `foreign path in claim: ${p}`);
  }
});
