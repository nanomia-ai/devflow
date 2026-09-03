#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const hook = path.join(__dirname, "session-start.js");
const workspace = path.resolve(__dirname, "..");
const managedContext = [
  "[devflow] An explicitly named devflow stage enters that stage directly. For other devflow intent, run devflow:principles to classify the request and follow its route.",
  "If you were handed a devflow role contract, follow that contract directly; do not re-enter through principles.",
].join("\n");
const managedOutput = JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: managedContext,
  },
});

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
const existsSync = fs.existsSync;
const spawnSync = childProcess.spawnSync;
fs.readFileSync = function tracedRead(target, ...rest) {
  events.push({ type: "read", target: String(target) });
  return readFileSync.call(this, target, ...rest);
};
childProcess.spawnSync = function tracedSpawn(command, args, options) {
  events.push({ type: "spawn", command, args, cwd: options && options.cwd });
  return spawnSync.call(this, command, args, options);
};
fs.existsSync = function tracedExists(target) {
  events.push({ type: "exists", target: String(target) });
  return existsSync.call(this, target);
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
    raw: run.stdout,
    payload,
    context: payload ? payload.hookSpecificOutput.additionalContext : "",
    events: trace ? JSON.parse(fs.readFileSync(trace, "utf8")) : [],
  };
}

function sessionInput(directory) {
  return JSON.stringify({ hook_event_name: "SessionStart", cwd: directory });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("an unmanaged Git checkout exits silently", (t) => {
  const root = makeProject(t, { "NOTES.md": "# Fixture\n" }, { git: true });
  const result = runHook(root, root, { input: sessionInput(root) });
  assert.equal(result.raw, "");
  assert.equal(result.payload, null);
  assert.equal(result.context, "");
});

test("an empty devflow directory remains silent", (t) => {
  const root = makeProject(t, { ".devflow/.keep": "", "NOTES.md": "# Fixture\n" }, { git: true });
  const { raw, payload, context } = runHook(root, root, { input: sessionInput(root) });
  assert.equal(raw, "");
  assert.equal(payload, null);
  assert.equal(context, "");
});

test("a current product file receives the byte-identical delayed instruction", (t) => {
  const root = makeProject(t, { ".devflow/project/product.md": "# Product\n" }, { git: true });
  const { raw, context } = runHook(root, root, { input: sessionInput(root) });
  assert.equal(raw, managedOutput);
  assert.match(context, /explicitly named devflow stage enters that stage directly/i);
  assert.match(context, /devflow:principles/);
  assert.doesNotMatch(context, /run (?:the )?devflow resume|project-state/i);
});

test("a role contract bypasses entry classification", (t) => {
  const root = makeProject(t, { ".devflow/project/product.md": "# Product\n" }, { git: true });
  const { context } = runHook(root, root, { input: sessionInput(root) });
  assert.match(context, /role contract.*follow that contract directly/i);
  assert.match(context, /do not re-enter through principles/i);
});

test("a subdirectory start resolves the checkout root with current-files checks only", (t) => {
  const root = makeProject(t, {
    ".devflow/project/product.md": "SECRET PROJECT\n",
    ".devflow/tree/02-domain/02.1-secret-task.wip-ab.md": "SECRET TASK\n",
    ".devflow/journal.md": "SECRET JOURNAL\n",
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
    { type: "exists", target: path.join(root, ".devflow", "project", "product.md") },
  ]);
  assert.doesNotMatch(JSON.stringify(events), /project-state|resume|\"log\"|ls-files/i);
});

test("malformed or missing stdin falls back safely, while non-Git directories stay silent", (t) => {
  const gitRoot = makeProject(t, { ".devflow/project/product.md": "# Product\n" }, { git: true });
  assert.match(runHook(gitRoot, gitRoot, { input: "{not-json" }).context, /devflow:principles/);
  assert.match(runHook(gitRoot, gitRoot).context, /devflow:principles/);

  const nonGitRoot = makeProject(t, { "NOTES.md": "# Fixture\n" });
  assert.equal(runHook(nonGitRoot, nonGitRoot, { input: "{not-json" }).context, "");
  assert.equal(runHook(nonGitRoot, nonGitRoot).context, "");
});

test("generated trigger surfaces require managed routing or explicit devflow intent", () => {
  const downstream = ["arch", "design", "split", "work", "verify", "resume"];
  const activation = "Use when explicitly invoked, when another devflow skill routes here, or for work in an existing devflow-managed project.";
  for (const name of downstream) {
    const root = path.join(workspace, "skills", name);
    const description = JSON.parse(fs.readFileSync(path.join(root, ".skill-rails", "intent.json"), "utf8")).description;
    assert.ok(description.endsWith(activation), `${name} intent must own the downstream activation clause`);
    assert.match(fs.readFileSync(path.join(root, "SKILL.md"), "utf8"), new RegExp(`^description: ${escapeRegExp(JSON.stringify(description))}$`, "m"));
    assert.match(fs.readFileSync(path.join(root, "agents", "openai.yaml"), "utf8"), new RegExp(`short_description: ${escapeRegExp(JSON.stringify(description))}`));
  }

  for (const name of ["product", "adopt"]) {
    const root = path.join(workspace, "skills", name);
    const description = JSON.parse(fs.readFileSync(path.join(root, ".skill-rails", "intent.json"), "utf8")).description;
    assert.match(description, /Use only with explicit devflow intent/);
    assert.match(description, /direct invocation/);
    assert.match(fs.readFileSync(path.join(root, "SKILL.md"), "utf8"), new RegExp(`^description: ${escapeRegExp(JSON.stringify(description))}$`, "m"));
    assert.match(fs.readFileSync(path.join(root, "agents", "openai.yaml"), "utf8"), /allow_implicit_invocation: true/);
  }
});
