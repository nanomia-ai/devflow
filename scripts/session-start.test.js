#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const hook = path.join(__dirname, "session-start.js");

function makeProject(t, files, { git = false } = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-hook-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
  }
  if (git) spawnSync("git", ["init", "-q"], { cwd: root });
  return root;
}

function runHook(root, startDirectory = root) {
  const run = spawnSync(process.execPath, [hook], {
    cwd: startDirectory,
    encoding: "utf8",
    input: JSON.stringify({ hook_event_name: "SessionStart", cwd: startDirectory }),
  });
  assert.equal(run.status, 0, run.stderr);
  if (!run.stdout) return "";
  return JSON.parse(run.stdout).hookSpecificOutput.additionalContext;
}

test("a repository without devflow state produces no hook output", (t) => {
  const root = makeProject(t, { "README.md": "# Fixture\n" }, { git: true });
  assert.equal(runHook(root), "");
});

test("Layer 0 or tree state activates resume without choosing a stage", (t) => {
  const roots = [
    makeProject(t, { "devflow/project/glossary.md": "term: definition\n" }),
    makeProject(t, { "devflow/tree/02-domain/02.1-task.md": "# Task\n" }),
  ];
  for (const root of roots) {
    const context = runHook(root);
    assert.match(context, /Run the devflow resume skill/);
    assert.equal(context.split("\n").length, 2);
    assert.doesNotMatch(context, /next (?:stage|card) is/i);
  }
});

test("the hook finds the checkout from any depth below its root", (t) => {
  const root = makeProject(t, {
    "devflow/tree/02-domain/02.1-task.md": "# Task\n",
    "src/deep/deeper/note.txt": "x\n",
  }, { git: true });
  for (const relative of [".", "src", path.join("src", "deep", "deeper")]) {
    const context = runHook(root, path.join(root, relative));
    assert.match(context, /Run the devflow resume skill/, `start directory: ${relative}`);
  }
});

test("a sibling checkout without devflow stays silent from any depth", (t) => {
  const root = makeProject(t, { "src/deep/note.txt": "x\n" }, { git: true });
  for (const relative of [".", "src", path.join("src", "deep")]) {
    assert.equal(runHook(root, path.join(root, relative)), "", `start directory: ${relative}`);
  }
});

test("the hook never injects local identity, task, or HANDOFF content", (t) => {
  const root = makeProject(t, {
    "devflow/project/product.md": "# Secret identity\n",
    "devflow/tree/02-domain/02.1-secret-task.wip-ab.md": "# Secret task\n",
    "devflow/users/ab/owner.md": "id: ab\ngit: Alice\n",
    "devflow/users/ab/HANDOFF.md": "SECRET HANDOFF\n",
  }, { git: true });
  const context = runHook(root);
  assert.doesNotMatch(context, /Secret|Alice|my id|HANDOFF|\.wip/);
  assert.doesNotMatch(context, /integration|approval|classify/i);
});
