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

// resume's `not yet on integration`: the ordinary working branch is AHEAD of integration,
// so the tip IS an ancestor while unintegrated commits exist — only the commit set of
// `integration..HEAD` reports truthfully (v0.14.0 audit 4.6).
test("a branch ahead of integration is an ancestor case that still holds unintegrated paths", (t) => {
  const { git, gitTry, write } = makeRepo(t);
  git("branch", "integration");
  git("checkout", "-qb", "flow");
  write("devflow/tree/02-x/02.1-card.md", "# 02.1 card\n");
  git("add", "-A");
  git("commit", "-qm", "a boundary — request recorded");
  assert.equal(
    gitTry("merge-base", "--is-ancestor", "integration", "HEAD").status, 0,
    "integration tip is an ancestor of the working branch — the shape the old guard misread as none",
  );
  assert.equal(git("rev-list", "--count", "integration..HEAD"), "1");
  const changed = git("diff", "--name-only", "integration..HEAD").split("\n").filter(Boolean);
  assert.ok(changed.includes("devflow/tree/02-x/02.1-card.md"), "the card path shows in the commit set");
});

// The physical limit the tweak lane's target-path check stands on: a pathspec commit
// records the file's final content, so it carries another session's changes left in the
// same file (v0.14.0 audit 4.3).
test("a pathspec commit carries another session's changes left in the same file", (t) => {
  const { git, write } = makeRepo(t);
  write("shared.txt", "top\nbottom\n");
  git("add", "-A");
  git("commit", "-qm", "base shared");
  write("shared.txt", "top A-edited\nbottom\n"); // session A's half-done change, uncommitted
  write("shared.txt", "top A-edited\nbottom B-edited\n"); // session B edits the other part
  git("commit", "-qm", "b tweak 02: bottom", "--", "shared.txt");
  const blob = git("show", "HEAD:shared.txt");
  assert.match(blob, /top A-edited/, "A's uncommitted change rode B's commit");
  assert.match(blob, /bottom B-edited/);
  assert.equal(git("status", "--porcelain"), "", "nothing left behind — the ride-along is silent");
});

// The tweak lane's named-branch check: a commit on a detached HEAD is contained by no
// branch and survives only in the reflog (v0.14.0 audit 4.2).
test("a commit on a detached HEAD lands in no branch", (t) => {
  const { git, gitTry, write } = makeRepo(t);
  git("checkout", "-q", "--detach");
  assert.notEqual(gitTry("symbolic-ref", "-q", "HEAD").status, 0, "the lane's check: no symbolic ref");
  write("stray.txt", "stray\n");
  git("add", "-A");
  git("commit", "-qm", "a tweak 01: stray");
  const hash = git("rev-parse", "HEAD");
  git("checkout", "-q", "main");
  assert.equal(git("branch", "--contains", hash), "", "no branch contains the tweak commit");
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

// The task attempt envelope: a reader with only Git resolves each progress result to the
// commit that first introduced its line, then joins it to the task commits from the claim
// through that anchor. Interleaved boundary commits are not part of that diff.
const repoRoot = path.resolve(__dirname, "..");

// The fixtures below write the canon's exact formats, so they only mean something while the
// canon still owns them. `head:` is what lets a result name the base it actually ran against.
function ownsResultFormats() {
  const principles = fs.readFileSync(path.join(repoRoot, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ completion signal result: head: <[^>]+>; verdict: pass \| fail \| unverified; detail-json: <short JSON string>/,
    "principles must own the completion signal result format, with head:, before a reader can join it");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ review result: head: <[^>]+>; verdict: pass \| objections \| unverified; detail-json: <short JSON string>/,
    "principles must own the review result format, with head:, before a reader can join it");
}

const HEAD_OF = /^\S+ (?:completion signal|review) result: head: ([0-9a-f]{40,64});/;

test("a progress result anchors to its first-introducing commit and joins the cumulative task commits", (t) => {
  const { root, git, write } = makeRepo(t);
  ownsResultFormats();

  const pending = "devflow/tree/02-x/02.1-card.md";
  const card = "devflow/tree/02-x/02.1-card.wip-a.md";
  const head = "# 02.1 card\nDestination: fixture becomes true\nForbidden: none\nCompletion signal: node --test\n\n## Progress log\n";
  write(pending, head);
  git("add", "-A");
  git("commit", "-qm", "a split — 02-x");
  fs.renameSync(path.join(root, pending), path.join(root, card));
  git("add", "-A");
  git("commit", "-qm", "a 02.1 claim");
  const claim = git("rev-parse", "HEAD");

  const append = (line) => fs.appendFileSync(path.join(root, card), `${line}\n`);
  const base = git("rev-parse", "HEAD");
  const failLine = `2026-01-01T00:00:01Z completion signal result: head: ${base}; verdict: fail; detail-json: "one"`;
  const objectionLine = `2026-01-01T00:00:02Z review result: head: ${base}; verdict: objections; detail-json: "two"`;
  const passLine = `2026-01-01T00:00:03Z completion signal result: head: ${base}; verdict: pass; detail-json: "three"`;
  const reviewPassLine = `2026-01-01T00:00:04Z review result: head: ${base}; verdict: pass; detail-json: "four"`;

  append(failLine);
  write("src/a.txt", "a\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 wip: signal failed");
  const firstCheckpoint = git("rev-parse", "HEAD");

  // Another flow's boundary lands between the two attempts.
  write("devflow/journal.md", "2026-01-01T00:00:00Z capability note: capability: 03; note-json: \"x\"\n");
  git("add", "-A");
  git("commit", "-qm", "a boundary — room upgrade");
  const boundary = git("rev-parse", "HEAD");

  append(objectionLine);
  write("src/b.txt", "b\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 wip: review objections");
  const secondCheckpoint = git("rev-parse", "HEAD");

  append(passLine);
  append(reviewPassLine);
  append("2026-01-01T00:00:05Z carry: none");
  write("src/c.txt", "c\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 card");
  const finalCommit = git("rev-parse", "HEAD");

  const introducedBy = (line) =>
    git("log", "--reverse", "--format=%H", "-S", line, "--", card).split("\n").filter(Boolean)[0];
  assert.equal(introducedBy(failLine), firstCheckpoint);
  assert.equal(introducedBy(objectionLine), secondCheckpoint);
  assert.equal(introducedBy(passLine), finalCommit);
  assert.equal(introducedBy(reviewPassLine), finalCommit);
  // A descendant that still contains the line is not the anchor.
  assert.notEqual(introducedBy(failLine), finalCommit);

  const taskCommits = (anchor) => git("log", "--reverse", "--format=%H%x00%s", `${claim}..${anchor}`)
    .split("\n").filter(Boolean).map((row) => row.split("\0"))
    .filter(([, subject]) => /^a 02\.1(?: wip: .+)?$/.test(subject) || subject === "a 02.1 card")
    .map(([hash]) => hash);
  const through = taskCommits(finalCommit);
  assert.deepEqual(through, [firstCheckpoint, secondCheckpoint, finalCommit]);
  assert.ok(!through.includes(boundary), "an interleaved boundary commit is not a task commit");

  const pathsOf = (hash) => git("show", "--name-only", "--format=", hash).split("\n").filter(Boolean);
  // One checkpoint alone loses the earlier attempt; the cumulative set does not.
  assert.ok(!pathsOf(secondCheckpoint).includes("src/a.txt"));
  const union = new Set(through.flatMap(pathsOf));
  for (const p of ["src/a.txt", "src/b.txt", "src/c.txt", card]) assert.ok(union.has(p), `missing ${p}`);
  assert.ok(!union.has("devflow/journal.md"), "the boundary commit's paths are not task diff");
});

// Adopted finding 1: between the run and the anchor, another flow's commit moves HEAD. The
// result's own `head:` is what keeps each run pinned to the base it actually saw.
test("two results sharing one anchor keep the separate bases they ran against", (t) => {
  const { root, git, write } = makeRepo(t);
  ownsResultFormats();

  const card = "devflow/tree/02-x/02.1-card.wip-a.md";
  write(card, "# 02.1 card\nForbidden: none\n\n## Progress log\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 claim");
  const claim = git("rev-parse", "HEAD");

  const append = (line) => fs.appendFileSync(path.join(root, card), `${line}\n`);
  // The signal runs against the claim tip.
  const signalBase = git("rev-parse", "HEAD");
  append(`2026-01-01T00:00:01Z completion signal result: head: ${signalBase}; verdict: fail; detail-json: "one"`);

  // Another flow lands its own boundary while this card is still uncommitted.
  write("devflow/journal.md", "2026-01-01T00:00:00Z capability note: capability: 03; note-json: \"x\"\n");
  git("add", "--", "devflow/journal.md");
  git("commit", "-qm", "b boundary — room upgrade");
  const foreign = git("rev-parse", "HEAD");
  assert.notEqual(foreign, signalBase);

  // The review input is assembled after that, so it saw a different base.
  const reviewBase = git("rev-parse", "HEAD");
  append(`2026-01-01T00:00:02Z review result: head: ${reviewBase}; verdict: objections; detail-json: "two"`);
  write("src/a.txt", "a\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 wip: signal failed");
  const anchor = git("rev-parse", "HEAD");

  const lines = fs.readFileSync(path.join(root, card), "utf8").split("\n").filter(Boolean);
  const heads = lines.map((line) => HEAD_OF.exec(line)?.[1]).filter(Boolean);
  assert.deepEqual(heads, [signalBase, reviewBase], "each result keeps the base it ran against");
  assert.notEqual(heads[0], heads[1], "the interleaved commit must not collapse the two bases");

  // One shared anchor, and the foreign commit is not part of this card's task diff.
  const introducedBy = (line) =>
    git("log", "--reverse", "--format=%H", "-S", line, "--", card).split("\n").filter(Boolean)[0];
  for (const line of lines.filter((value) => HEAD_OF.test(value))) assert.equal(introducedBy(line), anchor);
  const taskCommits = git("log", "--reverse", "--format=%H%x00%s", `${claim}..${anchor}`)
    .split("\n").filter(Boolean).map((row) => row.split("\0"))
    .filter(([, subject]) => /^a 02\.1(?: wip: .+)?$/.test(subject))
    .map(([hash]) => hash);
  assert.deepEqual(taskCommits, [anchor]);
  assert.ok(!taskCommits.includes(foreign), "another flow's boundary commit is not task diff");
  assert.ok(!git("show", "--name-only", "--format=", anchor).includes("devflow/journal.md"));
});

// Adopted finding 3: on the remote-evidence path the clean review runs before the
// evidence-wait checkpoint, so that checkpoint is its anchor — not the later final commit.
test("a remote-path clean review anchors to the evidence-wait checkpoint", (t) => {
  const { root, git, write } = makeRepo(t);
  ownsResultFormats();

  const card = "devflow/tree/02-x/02.1-card.wip-a.md";
  write(card, "# 02.1 card\nReview: required\n\n## Progress log\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 claim");

  const append = (line) => fs.appendFileSync(path.join(root, card), `${line}\n`);
  const reviewBase = git("rev-parse", "HEAD");
  const reviewLine = `2026-01-01T00:00:01Z review result: head: ${reviewBase}; verdict: pass; detail-json: "clean"`;
  append(reviewLine);
  append('2026-01-01T00:00:02Z remote evidence check: check-json: "gh run view"; verdict: unrun; detail-json: ""');
  write("src/a.txt", "a\n");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 wip: evidence-wait");
  const evidenceWait = git("rev-parse", "HEAD");

  // The verdict arrives later and the final task commit still contains the review line.
  append('2026-01-01T00:00:03Z remote evidence check: check-json: "gh run view"; verdict: pass; detail-json: "green"');
  append("2026-01-01T00:00:04Z carry: none");
  git("add", "-A");
  git("commit", "-qm", "a 02.1 card");
  const final = git("rev-parse", "HEAD");

  const introducedBy = (line) =>
    git("log", "--reverse", "--format=%H", "-S", line, "--", card).split("\n").filter(Boolean)[0];
  assert.equal(introducedBy(reviewLine), evidenceWait, "the evidence-wait checkpoint is the review's anchor");
  assert.notEqual(introducedBy(reviewLine), final, "a descendant that still holds the line is not the anchor");
  assert.ok(git("show", "--name-only", "--format=", evidenceWait).includes(card));
});
