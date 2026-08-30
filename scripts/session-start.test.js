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

function makeProbe(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-hook-probe-"));
  const probe = path.join(directory, "probe.js");
  fs.writeFileSync(probe, `
"use strict";
const fs = require("node:fs");
const childProcess = require("node:child_process");
const events = [];
const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;
const spawnSync = childProcess.spawnSync;
fs.readFileSync = function tracedRead(target, ...rest) {
  events.push({ type: "read", target: String(target) });
  return readFileSync.call(this, target, ...rest);
};
childProcess.spawnSync = function tracedSpawn(command, args, options) {
  events.push({ type: "spawn", command, args, cwd: options && options.cwd });
  return spawnSync.call(this, command, args, options);
};
process.on("exit", () => writeFileSync(process.env.DEVFLOW_HOOK_TRACE, JSON.stringify(events), "utf8"));
`);
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return probe;
}

function runHook(root, startDirectory = root, { input, probe } = {}) {
  const trace = probe && path.join(path.dirname(probe), "trace.json");
  const args = probe ? ["--require", probe, hook] : [hook];
  const run = spawnSync(process.execPath, args, {
    cwd: startDirectory,
    encoding: "utf8",
    input,
    env: trace ? { ...process.env, DEVFLOW_HOOK_TRACE: trace } : process.env,
  });
  assert.equal(run.status, 0, run.stderr);
  const payload = run.stdout ? JSON.parse(run.stdout) : null;
  return {
    payload,
    context: payload ? payload.hookSpecificOutput.additionalContext : "",
    events: trace ? JSON.parse(fs.readFileSync(trace, "utf8")) : [],
  };
}

function sessionInput(directory) {
  return JSON.stringify({ hook_event_name: "SessionStart", cwd: directory });
}

test("a Git checkout receives one delayed principles instruction", (t) => {
  const root = makeProject(t, { "NOTES.md": "# Fixture\n" }, { git: true });
  const { payload, context } = runHook(root, root, { input: sessionInput(root) });
  assert.equal(payload.hookSpecificOutput.hookEventName, "SessionStart");
  assert.equal(context.split("\n").length, 2);
  assert.match(context, /After the user states their intent/);
  assert.match(context, /devflow:principles/);
  assert.doesNotMatch(context, /run (?:the )?devflow resume|project-state/i);
});

test("a role contract bypasses entry classification", (t) => {
  const root = makeProject(t, {}, { git: true });
  const { context } = runHook(root, root, { input: sessionInput(root) });
  assert.match(context, /role contract.*follow that contract directly/i);
  assert.match(context, /do not re-enter through principles/i);
});

test("a subdirectory start resolves the checkout root without project reads", (t) => {
  const root = makeProject(t, {
    "devflow/project/product.md": "SECRET PROJECT\n",
    "devflow/tree/02-domain/02.1-secret-task.wip-ab.md": "SECRET TASK\n",
    "devflow/journal.md": "SECRET JOURNAL\n",
    "src/deep/deeper/note.txt": "x\n",
  }, { git: true });
  const startDirectory = path.join(root, "src", "deep", "deeper");
  const probe = makeProbe(t);
  const { context, events } = runHook(root, startDirectory, {
    input: sessionInput(startDirectory),
    probe,
  });

  assert.match(context, /devflow:principles/);
  assert.doesNotMatch(context, /SECRET|devflow[\\/](?:project|tree)|session-start\.js/i);
  assert.deepEqual(events, [
    { type: "read", target: hook },
    { type: "read", target: "0" },
    { type: "spawn", command: "git", args: ["rev-parse", "--show-toplevel"], cwd: startDirectory },
  ]);
  assert.doesNotMatch(JSON.stringify(events), /project-state|resume/i);
});

test("malformed or missing stdin falls back safely, while non-Git directories stay silent", (t) => {
  const gitRoot = makeProject(t, {}, { git: true });
  assert.match(runHook(gitRoot, gitRoot, { input: "{not-json" }).context, /devflow:principles/);
  assert.match(runHook(gitRoot, gitRoot).context, /devflow:principles/);

  const nonGitRoot = makeProject(t, { "NOTES.md": "# Fixture\n" });
  assert.equal(runHook(nonGitRoot, nonGitRoot, { input: "{not-json" }).context, "");
  assert.equal(runHook(nonGitRoot, nonGitRoot).context, "");
});
