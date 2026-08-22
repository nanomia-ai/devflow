#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawn, spawnSync } = require("node:child_process");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");

const TOOL = path.resolve(__dirname, "../skills/principles/scripts/project-state.mjs");
const ROUTE_MAP = [
  ["git", "open-operation"],
  ["transition", "prepared-route"], ["transition", "interrupted"],
  ["transition", "source-id-migration"], ["transition", "layer-opening"],
  ["transition", "product-running"], ["transition", "product-result"],
  ["transition", "remote-evidence"], ["transition", "finish-boundary"],
  ["transition", "event-routing"], ["transition", "event-decision"],
  ["transition", "failure-routing"],
  ["marker", "product-rerun"], ["marker", "capability-closure"], ["marker", "re-split"],
  ["setup", "brownfield-field"], ["setup", "integration-config"], ["setup", "room-upgrade"],
  ["setup", "layer0-incomplete"],
  ["claim", "depends-anomaly"], ["claim", "needs-reapproval"],
  ["claim", "blocked-by-prerequisite"],
  null, // request recording is the conversation-owned exception; the preserved fact is tested below.
  ["claim", "mine"],
  ["baseline", "legacy-v010"], ["baseline", "design-refresh"],
  ["request", "existing"], ["baseline", "boundary"],
  ["event", "product-requested"], ["event", "pending"], ["event", "new"],
  ["layer", "empty-folder"], ["layer", "folder-boundary"], ["layer", "children-done"],
  ["layer", "correspondence-gap"], ["layer", "no-foundation"],
  ["ready", "needs-normalization"], ["ready", "approval-invalid"],
  ["ready", "approval-pending"], ["ready", "ready"], ["ready", "waiting-capability"],
  ["blocked", "audits"], ["blocked", "dependencies"], ["blocked", "other-claims"],
  ["product", "shape-or-revision"], ["product", "fail"], ["product", "unverified"],
  ["complete", "product-pass"],
  ["setup", "no-product"], ["setup", "layer0-incomplete"],
  ["complete", "adoption"], ["layer", "no-tree"],
  ["ready", "digest-behind"],
  null, // design.entry is the conversation-owned choice inside layer.no-tree.
];

function write(root, relative, content) {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function gitTry(root, ...args) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8" });
}

function commit(root, subject = "jmp fixture") {
  git(root, "add", "-A");
  git(root, "commit", "-qm", subject);
  return git(root, "rev-parse", "HEAD");
}

function product(capabilities = []) {
  const circled = "①②③④⑤⑥⑦⑧⑨⑩";
  return `# Fixture service

Fixture identity.

## Problem
Fixture problem.
## Approach
Fixture approach.
## Capabilities        <!-- ① ② ③ number + name + user outcome + why that outcome is needed for success -->
${capabilities.map((name, index) => `- **${circled[index]} ${name}** — Fixture user outcome because success needs it.`).join("\n") || "None."}
## Boundary
Fixture boundary.
## Success criteria
- fixture passes
## Screens & access points
None.
## Open questions
None.
`;
}

function arch({ brownfield = "yes", includeBrownfield = true, includeIntegration = true } = {}) {
  return `# Architecture

${includeBrownfield ? `Brownfield: ${brownfield}\n` : ""}
## Components
None.
## Stack
None.
## Code structure
None.
## Data
None.
## Risks
None.
## Out of scope
None.

frontend: none
verify_channel:
  work server: node --test
  means: CLI
${includeIntegration ? "integration: main\nmerge: merge-commit\n" : ""}`;
}

function baseline(number, name, designHead, overrides = {}) {
  const nn = String(number).padStart(2, "0");
  const covered = overrides.covered ?? [];
  const scope = overrides.scope ?? [];
  const consumed = overrides.consumed ?? [];
  const scopeHead = overrides.scopeHead ?? "none";
  const verifiedAt = overrides.verifiedAt ?? "none";
  return `# ${nn} ${name}
Purpose: fixture purpose
Boundary: owns fixture; does not own none
Trust: design reflects confirmed Layer 0; verified state reflects the last passing capability verification, or contains no evidence before one. Judge each zone by its metadata.
## Intent
${overrides.intent ?? "None."}
## Concept model
None.
## Invariants
None.
## Non-goals
None.
## Binding ADRs
${overrides.adrs ?? "None."}
## Design metadata
Capability number: ${nn}
Design head: ${overrides.designHead ?? designHead}
## Verified state
### Main flow
None.
### Lifecycle
None.
### Current behavior
None.
### Entrypoints
None.
### Consumed contracts
None.
### Traps
None.
### Verify
None.
### Verification metadata
Verified at: ${verifiedAt}
Covered cards: ${JSON.stringify(covered)}
Scope paths: ${JSON.stringify(scope)}
Consumed paths: ${JSON.stringify(consumed)}
Scope head: ${scopeHead}
`;
}

function legacyBaseline(number = 1, name = "foundation") {
  const nn = String(number).padStart(2, "0");
  return `# ${nn} ${name}
Purpose.
## Conceptual model
None.
## Main flow
None.
## Lifecycle
None.
## Current behavior
None.
## Invariants
None.
## What we decided not to do
None.
## Entrypoints
None.
## Traps
None.
## Verify
None.
## Binding ADRs
None.
## Machine block
Capability number: ${nn}
Verified at: none
Covered cards: []
Scope paths: []
Scope head: none
Docs head: none
`;
}

function cardText(number, { depends = "none", approval = "2026-01-01T00:00:00Z; parallel: none", review = "required", progress = "2026-01-02T00:00:00Z implemented exact fixture", omit = [] } = {}) {
  const rows = [
    `# ${number} fixture card`,
    "Coordinates: Fixture ▸ foundation",
    "Identity: Fixture identity.",
    "Destination: fixture becomes true",
    "Why: fixture needs it",
    "Forbidden: none",
    `Depends: ${depends}`,
    "Read first: none",
    "Completion signal: node --test",
    `Approval: ${approval}`,
    `Review: ${review}`,
    "",
    "## Progress log",
    progress,
    "",
  ];
  return rows.filter((line) => !omit.some((field) => line.startsWith(`${field}:`))).join("\n");
}

function makeRepo(t, options = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-state-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, "init", "-q", "-b", "main");
  git(root, "config", "core.autocrlf", "false");
  git(root, "config", "user.name", "Jmp");
  git(root, "config", "user.email", "jmp@example.test");
  if (options.product !== false) write(root, "devflow/project/product.md", product(options.capabilities ?? []));
  if (options.arch !== false) write(root, "devflow/project/arch.md", arch(options));
  if (options.glossary !== false) write(root, "devflow/project/glossary.md", "# Glossary\n\nNone.\n");
  if (options.codeStyle !== false) write(root, "devflow/project/code-style.md", "# Code Style\n\nNone.\n");
  write(root, "devflow/users/jmp/owner.md", "id: jmp\ngit: Jmp, jmp@example.test\n");
  write(root, "devflow/users/jmp/HANDOFF.md", "");
  write(root, "devflow/journal.md", "");
  if (options.tree !== false) fs.mkdirSync(path.join(root, "devflow", "tree"), { recursive: true });
  write(root, "seed.txt", "seed\n");
  commit(root, "jmp layer 0");
  const designHead = git(root, "log", "-1", "--format=%H", "--", "devflow/project/product.md", "devflow/project/arch.md", "devflow/project/glossary.md");
  if (options.baseline !== false && options.product !== false) {
    write(root, "devflow/project/capabilities/01-foundation.md", baseline(1, "foundation", designHead));
    for (let index = 0; index < (options.capabilities ?? []).length; index += 1) {
      write(root, `devflow/project/capabilities/${String(index + 2).padStart(2, "0")}-${options.capabilities[index]}.md`, baseline(index + 2, options.capabilities[index], designHead));
    }
    commit(root, "jmp arch — capabilities");
  }
  return root;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [TOOL, "state", "--root", root, ...args], { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
}

function ok(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /^state: schema=1 /);
  assert.match(result.stdout, /\nnext: [^\n]+\n$/);
}

function hasKind(output, zone, kind) {
  return output.split(/\r?\n/).some((line) => line.startsWith(`${zone}: kind=${kind}`));
}

function nextOf(output) {
  return /^next: (.+)$/m.exec(output)?.[1];
}

function snapshot(root) {
  return {
    head: git(root, "rev-parse", "HEAD"),
    status: git(root, "status", "--porcelain=v1", "--untracked-files=all"),
    files: listManifest(root),
  };
}

function listManifest(root) {
  const result = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) result.push(`${path.relative(root, target).replace(/\\/g, "/")}:${fs.readFileSync(target).toString("hex")}`);
    }
  };
  visit(root);
  return result.sort();
}

function assertReadOnly(root, before) {
  assert.deepEqual(snapshot(root), before);
}

function writeClaim(root, { number = "02.1", status = "wip-jmp", depends = "none", approval, review, progress, commitSubject = "fixture claim" } = {}) {
  const relative = `devflow/tree/02-capability/${number}-fixture.${status}.md`;
  write(root, relative, cardText(number, { depends, approval, review, progress }));
  commit(root, commitSubject);
  return relative;
}

function writePending(root, { number = "02.1", depends = "none", approval, review, omit = [] } = {}) {
  const relative = `devflow/tree/02-capability/${number}-fixture.md`;
  write(root, relative, cardText(number, { depends, approval, review, omit }));
  commit(root, "jmp split — fixture");
  return relative;
}

function prepareFinalizingMove(t, options = {}) {
  const root = makeRepo(t);
  const check = "https://example.test/check";
  const claimed = "devflow/tree/02-capability/02.1-fixture.wip-jmp.md";
  const waiting = `2026-08-20T00:00:00Z remote evidence check: check-json: ${JSON.stringify(check)}; verdict: unrun; detail-json: ""`;
  write(root, claimed, cardText("02.1", { progress: waiting }));
  if (options.checkpointTouchesCard === false) {
    commit(root, "jmp 02.1 card before evidence wait");
    write(root, "checkpoint.txt", "checkpoint\n");
  }
  const checkpoint = commit(root, options.checkpointSubject ?? "jmp 02.1 wip: evidence-wait");
  const passed = `2026-08-20T00:00:00Z remote evidence check: check-json: ${JSON.stringify(check)}; verdict: pass; detail-json: ${JSON.stringify("passed")}`;
  const carry = "2026-08-20T00:01:00Z carry: remote evidence passed";
  write(root, claimed, cardText("02.1", { progress: `${passed}\n${carry}` }));
  const journalCheck = options.journalCheck ?? check;
  write(root, "devflow/journal.md", `2026-08-20T00:02:00Z evidence-finalizing: card-json: ${JSON.stringify(claimed)}; checkpoint: 02.1 wip: ${checkpoint}; check-json: ${JSON.stringify(journalCheck)}\n`);
  commit(root, "jmp boundary — evidence finalizing 02.1");
  const done = claimed.replace(".wip-jmp.md", ".done.md");
  git(root, "mv", claimed, done);
  if (options.damage) fs.appendFileSync(path.join(root, ...done.split("/")), "damaged after rename\n", "utf8");
  return { root, claimed, done };
}

function currentRevisions(root) {
  const productRevision = git(root, "hash-object", "devflow/project/product.md");
  const present = ["devflow/project/arch.md", "devflow/project/code-style.md", "devflow/project/glossary.md"];
  const tree = execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", "HEAD", "--", ...present], { cwd: root });
  const verificationRevision = execFileSync("git", ["hash-object", "--stdin"], { cwd: root, input: tree, encoding: "utf8" }).trim();
  const codeRevision = git(root, "log", "-1", "--format=%H", "--", ".", ":(exclude)devflow/**") || "none";
  return { productRevision, verificationRevision, codeRevision };
}

function pathSetRevision(root, paths) {
  const tree = execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", "HEAD", "--", ...paths], { cwd: root });
  return execFileSync("git", ["hash-object", "--stdin"], { cwd: root, input: tree, encoding: "utf8" }).trim();
}

function rootVerify(root, verdict, { events = true, executed = null } = {}) {
  const revisions = currentRevisions(root);
  write(root, "devflow/tree/verify.md", `# Verification · product
Product revision: ${revisions.productRevision}
Verification revision: ${revisions.verificationRevision}
Code revision: ${revisions.codeRevision}
Capability revision: not-applicable
${executed === null ? "" : `Executed: ${executed}\n`}Verdict: ${verdict}
New entries: 0
Failure history:
## Audit
${events ? "- source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 0 findings · 0 adopted · routing: none" : "- not run"}
## Retrospective
${events ? "- source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 0 findings · 0 adopted · routing: none" : "- not run"}
`);
  commit(root, "jmp boundary — product verification result");
}

function capabilityVerify(root, relative, { failures = "", audit = "- not run", retrospective = "- not run", verdict = "pass", executed = "fixture" } = {}) {
  const revisions = currentRevisions(root);
  write(root, relative, `# Verification · fixture · 2026-08-20
Product revision: ${revisions.productRevision}
Verification revision: ${revisions.verificationRevision}
Code revision: ${revisions.codeRevision}
Capability revision: unresolved
Scenario: fixture
Executed: ${executed}
Verdict: ${verdict}
New entries: ${failures === "" || failures === "None." ? 0 : 1}
Failure history:
${failures}
Regression: none
Standards: none
Provisional: none
Journal sweep: none

## Audit
${audit}

## Retrospective
${retrospective}
`);
  commit(root, "jmp boundary — capability verification result 02");
}

async function registry() {
  return import(pathToFileURL(TOOL).href);
}

function completedRepo(t, verdict = null) {
  const root = makeRepo(t, { brownfield: "no" });
  fs.mkdirSync(path.join(root, "devflow", "tree", "01-foundation.done"), { recursive: true });
  write(root, "devflow/tree/01-foundation.done/01.1-fixture.done.md", cardText("01.1"));
  commit(root, "jmp boundary — foundation");
  if (verdict) rootVerify(root, verdict);
  return root;
}

function mappingScene(t, number) {
  if (number === 49) return makeRepo(t, { product: false, baseline: false, tree: false });
  if (number === 50) return makeRepo(t, { arch: false, baseline: false, tree: false });
  if (number === 52) return makeRepo(t, { brownfield: "no", tree: false });
  let root = makeRepo(t);
  const journal = (line, subject = "jmp boundary — journal") => {
    write(root, "devflow/journal.md", `${line}\n`);
    commit(root, subject);
  };
  const verify = (text, subject = "jmp boundary — verify fixture") => {
    write(root, "devflow/tree/02-capability/verify.md", text);
    commit(root, subject);
  };
  switch (number) {
    case 1: {
      git(root, "checkout", "-qb", "side");
      write(root, "seed.txt", "side\n");
      commit(root, "side");
      git(root, "checkout", "main");
      write(root, "seed.txt", "main\n");
      commit(root, "main");
      gitTry(root, "merge", "--no-edit", "side");
      break;
    }
    case 2: {
      const pending = "# Verification\nFailure history:\n- source id: 1; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n";
      write(root, "devflow/tree/02-capability/verify.md", pending);
      commit(root, "jmp boundary — verify pending");
      const base = git(root, "rev-parse", "HEAD");
      write(root, "devflow/tree/02-capability/verify.md", pending.replace("routing: pending", `routing prepared: ${JSON.stringify({ base, result: "routing: fix cards 02.1", operations: [{ op: "write", path: "devflow/tree/02-capability/02.1-fix.md", content: "# fix\\n" }] })}`));
      break;
    }
    case 3:
      write(root, "devflow/tree/02-capability/verify.md", "# Verification\nVerdict: fail\nFailure history:\nNone.\n## Audit\n- not run\n## Retrospective\n- not run\n");
      break;
    case 4:
      verify("# Verification\nFailure history:\n- timestamp: 2026-08-20T00:00:00Z; failure: fixture; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n");
      break;
    case 5:
      journal(`2026-08-20T00:00:00Z layer opening: parent: devflow/tree; children: 02+03+04+05; source-json: ${JSON.stringify("core:devflow/project/product.md#Capabilities")}`);
      break;
    case 6: {
      const r = currentRevisions(root);
      journal(`2026-08-20T00:00:00Z product verification running: trigger: automatic; product: ${r.productRevision}; verification: ${r.verificationRevision}; code: ${r.codeRevision}`);
      break;
    }
    case 7: {
      const r = currentRevisions(root);
      journal(`2026-08-20T00:00:00Z product verification result: trigger: automatic; product: ${r.productRevision}; verification: ${r.verificationRevision}; code: ${r.codeRevision}; verdict: fail`);
      break;
    }
    case 8: {
      const check = "https://example.test/check";
      const card = writeClaim(root, {
        commitSubject: "jmp 02.1 wip: evidence-wait",
        progress: `2026-08-20T00:00:00Z remote evidence check: check-json: ${JSON.stringify(check)}; verdict: unrun; detail-json: ""`,
      });
      const hash = git(root, "rev-parse", "HEAD");
      journal(`2026-08-20T00:00:00Z evidence-wait: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${hash}; check-json: ${JSON.stringify(check)}`);
      break;
    }
    case 9:
      writeClaim(root, { commitSubject: "jmp 02.1 fixture card" });
      break;
    case 10:
      verify("# Verification\nFailure history:\nNone.\n## Audit\n- routing · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 1 findings · 1 adopted\n  1. exact fixture\n     routing: pending\n## Retrospective\n- not run\n");
      break;
    case 11:
      verify("# Verification\nFailure history:\nNone.\n## Audit\n- awaiting user decision · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product\n  1. exact fixture\n## Retrospective\n- not run\n");
      break;
    case 12:
      verify("# Verification\nFailure history:\n- source id: 3; timestamp: 2026-08-20T00:00:00Z; failure: fixture; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n");
      break;
    case 13:
      journal(`2026-08-20T00:00:00Z product re-run pending: statement-json: ${JSON.stringify("identity is disproved")}`);
      break;
    case 14: {
      const head = git(root, "rev-parse", "HEAD");
      journal(`2026-08-20T00:00:00Z capability closing: folder: devflow/tree/02-capability; head: ${head}; product: p; verification: v; capability: c`);
      break;
    }
    case 15:
      journal("2026-08-20T00:00:00Z re-split pending: folder: devflow/tree/02-capability; stale: 02.1; source: devflow/project/product.md#Capabilities");
      break;
    case 16:
      write(root, "devflow/project/arch.md", arch({ includeBrownfield: false }));
      commit(root, "jmp arch — Brownfield missing");
      break;
    case 17:
      write(root, "devflow/project/arch.md", arch({ includeIntegration: false }));
      commit(root, "jmp arch — config missing");
      break;
    case 18:
      writeClaim(root, { status: "wip" });
      break;
    case 19:
      fs.rmSync(path.join(root, "devflow", "project", "glossary.md"));
      commit(root, "jmp glossary missing");
      break;
    case 20:
      writeClaim(root, { depends: "wrong value" });
      break;
    case 21:
      writeClaim(root, { approval: "pending" });
      break;
    case 22:
      write(root, "devflow/tree/02-capability/02.0-prereq.wip-other.md", cardText("02.0"));
      write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n");
      write(root, "devflow/users/other/HANDOFF.md", "");
      write(root, "devflow/users/other/digest.md", "none\n");
      write(root, "devflow/tree/02-capability/02.1-fixture.wip-jmp.md", cardText("02.1", { depends: "02.0" }));
      commit(root, "jmp claims");
      break;
    case 23:
    case 27:
      journal(`2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("fix A=B; preserve C")}`);
      break;
    case 24:
      writeClaim(root);
      break;
    case 25: {
      write(root, "devflow/project/capabilities/01-foundation.md", legacyBaseline());
      commit(root, "jmp legacy baseline");
      break;
    }
    case 26:
      fs.rmSync(path.join(root, "devflow", "project", "capabilities", "01-foundation.md"));
      commit(root, "jmp baseline missing");
      break;
    case 28: {
      const relative = "devflow/project/capabilities/01-foundation.md";
      write(root, relative, read(root, relative).replace("## Verified state\n", ""));
      commit(root, "jmp baseline boundary anomaly");
      break;
    }
    case 29:
      journal("2026-08-20T00:00:00Z product verification requested");
      break;
    case 30:
      verify("# Verification\nFailure history:\nNone.\n## Audit\n- pending · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product\n## Retrospective\n- not run\n");
      break;
    case 31:
      rootVerify(root, "pass", { events: false });
      break;
    case 32:
      fs.mkdirSync(path.join(root, "devflow", "tree", "02-capability"), { recursive: true });
      break;
    case 33:
      write(root, "devflow/tree/02-capability/02.1-group/02.1.1-child.done.md", cardText("02.1.1"));
      commit(root, "jmp child done");
      break;
    case 34:
      write(root, "devflow/tree/02-capability/02.1-child.done.md", cardText("02.1"));
      commit(root, "jmp child done");
      break;
    case 35:
      root = makeRepo(t, { brownfield: "no", capabilities: ["capability"] });
      break;
    case 36:
      root = makeRepo(t, { brownfield: "no" });
      break;
    case 37:
      writePending(root, { omit: ["Approval", "Review"] });
      break;
    case 38:
      writePending(root, { approval: "not-a-timestamp" });
      break;
    case 39:
      writePending(root, { approval: "pending" });
      break;
    case 40:
      writePending(root);
      break;
    case 41:
      write(root, "devflow/tree/02-capability.md", "capability\n");
      commit(root, "jmp waiting capability");
      break;
    case 42:
      verify("# Verification\nFailure history:\nNone.\n## Audit\n- pending · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product\n## Retrospective\n- not run\n");
      write(root, "devflow/tree/02-capability/02.1-placeholder.stale.md", cardText("02.1"));
      commit(root, "jmp stale placeholder");
      write(root, "outside.txt", "uncommitted\n");
      break;
    case 43:
      write(root, "devflow/tree/02-capability/02.0-prereq.wip-other.md", cardText("02.0"));
      write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n");
      write(root, "devflow/users/other/HANDOFF.md", "");
      write(root, "devflow/users/other/digest.md", "none\n");
      write(root, "devflow/tree/02-capability/02.1-fixture.md", cardText("02.1", { depends: "02.0" }));
      commit(root, "jmp blocked dependency");
      break;
    case 44:
      write(root, "devflow/tree/02-capability/02.1-fixture.wip-other.md", cardText("02.1"));
      write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n");
      write(root, "devflow/users/other/HANDOFF.md", "");
      write(root, "devflow/users/other/digest.md", "none\n");
      commit(root, "other claim");
      break;
    case 45:
      root = completedRepo(t);
      break;
    case 46:
      root = completedRepo(t, "fail");
      break;
    case 47:
      root = completedRepo(t, "unverified");
      break;
    case 48:
      root = completedRepo(t, "pass");
      break;
    case 53: {
      const marker = git(root, "rev-parse", "HEAD");
      write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
      commit(root, "jmp boundary — digest marker");
      break;
    }
    case 51:
      break;
    default:
      break;
  }
  return root;
}

function read(root, relative) {
  return fs.readFileSync(path.join(root, ...relative.split("/")), "utf8");
}

test("E channel-unavailable results wait for an explicit verification request", (t) => {
  const reason = "unverified: channel unavailable — browser attach; timeout=30s";

  const capabilityRoot = mappingScene(t, 34);
  capabilityVerify(capabilityRoot, "devflow/tree/02-capability/verify.md", {
    verdict: "unverified",
    executed: reason,
  });
  const capability = run(capabilityRoot); ok(capability);
  assert.equal(hasKind(capability.stdout, "layer", "children-done"), false, capability.stdout);
  assertFragment(capability.stdout, "blocked: kind=channel", "path=devflow/tree/02-capability/verify.md");
  assertFragment(capability.stdout, "blocked: kind=channel", "target=2");
  assertFragment(capability.stdout, "blocked: kind=channel", "command=\"browser attach\"");
  assertFragment(capability.stdout, "blocked: kind=channel", "timeout=30s");
  assert.equal(nextOf(capability.stdout), "blocked.channel", capability.stdout);

  const productRoot = completedRepo(t);
  rootVerify(productRoot, "unverified", { events: false, executed: reason });
  const product = run(productRoot); ok(product);
  assert.equal(hasKind(product.stdout, "product", "unverified"), false, product.stdout);
  assert.equal(hasKind(product.stdout, "event", "new"), false, product.stdout);
  assertFragment(product.stdout, "blocked: kind=channel", "path=devflow/tree/verify.md");
  assertFragment(product.stdout, "blocked: kind=channel", "target=product");
  assertFragment(product.stdout, "blocked: kind=channel", "command=\"browser attach\"");
  assertFragment(product.stdout, "blocked: kind=channel", "timeout=30s");
  assert.equal(nextOf(product.stdout), "blocked.channel", product.stdout);

  write(productRoot, "devflow/journal.md", "2026-08-23T00:00:00Z product verification requested\n");
  commit(productRoot, "jmp boundary — product verification requested");
  const requested = run(productRoot); ok(requested);
  assert.equal(hasKind(requested.stdout, "event", "product-requested"), true, requested.stdout);
  assert.equal(nextOf(requested.stdout), "event.product-requested", requested.stdout);
});

test("gate A feeds every canon-reserved journal line to the deployed parser", { timeout: 30_000 }, async (t) => {
  const timestamp = "2026-08-21T00:00:00Z";
  const root = makeRepo(t, { capabilities: ["capability"] });
  rootVerify(root, "pass");
  capabilityVerify(root, "devflow/tree/02-capability/verify.md");
  const check = "https://example.test/check";
  const card = writeClaim(root, {
    commitSubject: "jmp 02.1 wip: evidence-wait",
    progress: `2026-08-21T00:00:00Z remote evidence check: check-json: ${JSON.stringify(check)}; verdict: unrun; detail-json: ""`,
  });
  const checkpoint = git(root, "rev-parse", "HEAD");
  const revisions = currentRevisions(root);
  const valid = [
    { name: "layer opening (root)", head: "layer opening:", batch: "root",
      line: `${timestamp} layer opening: parent: devflow/tree; children: 02+03+04+05; source-json: ${JSON.stringify("core:devflow/project/product.md#Capabilities")}`,
      zone: "transition", kind: "layer-opening", fragment: "parent=devflow/tree children=02+03+04+05" },
    { name: "layer opening (nested)", head: "layer opening:", batch: "base",
      line: `${timestamp} layer opening: parent: devflow/tree/01-foundation; children: 01.1+01.2; source-json: ${JSON.stringify("core:devflow/project/arch.md#Components")}`,
      zone: "transition", kind: "layer-opening", fragment: "parent=devflow/tree/01-foundation children=01.1+01.2" },
    { name: "re-split pending", head: "re-split pending:", batch: "base",
      line: `${timestamp} re-split pending: folder: devflow/tree/02-capability; stale: 02.1; source: devflow/project/product.md#Capabilities`,
      zone: "marker", kind: "re-split", fragment: "stale=02.1" },
    { name: "maintenance routing pending", head: "maintenance routing pending:", batch: "base",
      line: `${timestamp} maintenance routing pending: request-json: ${JSON.stringify("rename the third column")}`,
      zone: "request", kind: "existing", fragment: `timestamp=${timestamp}` },
    { name: "product re-run pending", head: "product re-run pending:", batch: "base",
      line: `${timestamp} product re-run pending: statement-json: ${JSON.stringify("a team can finish a retro in ten minutes")}`,
      zone: "marker", kind: "product-rerun", fragment: `timestamp=${timestamp}` },
    { name: "product verification requested", head: "product verification requested", batch: "product-requested",
      line: `${timestamp} product verification requested`,
      zone: "event", kind: "product-requested", fragment: `key=${timestamp}` },
    { name: "product verification running", head: "product verification running:", batch: "product-running",
      line: `${timestamp} product verification running: trigger: requested; product: ${revisions.productRevision}; verification: ${revisions.verificationRevision}; code: ${revisions.codeRevision}`,
      zone: "transition", kind: "product-running", fragment: "trigger=requested" },
    { name: "product verification result", head: "product verification result:", batch: "product-result",
      line: `${timestamp} product verification result: trigger: requested; product: ${revisions.productRevision}; verification: ${revisions.verificationRevision}; code: ${revisions.codeRevision}; verdict: pass`,
      zone: "transition", kind: "product-result", fragment: "verdict=pass" },
    { name: "capability closing", head: "capability closing:", batch: "base",
      line: `${timestamp} capability closing: folder: devflow/tree/02-capability; head: ${checkpoint}; product: ${revisions.productRevision}; verification: ${revisions.verificationRevision}; capability: ${checkpoint}`,
      zone: "marker", kind: "capability-closure", fragment: "folder=devflow/tree/02-capability" },
    { name: "capability note", head: "capability note:", batch: "base",
      line: `${timestamp} capability note: capability: 02; note-json: ${JSON.stringify("the column names are display-only")}` },
    { name: "capability note (design)", head: "capability note:", batch: "base",
      line: `${timestamp} capability note: capability: 02; note-json: ${JSON.stringify("a column rename never changes the export contract")}; card-json: ${JSON.stringify(card)}; code-json: ${JSON.stringify(["src/export/contract.ts", "src/export/rename.ts"])}` },
    { name: "audit requested (capability)", head: "audit requested:", batch: "base",
      line: `${timestamp} audit requested: 02`,
      zone: "event", kind: "new", fragment: "role=Audit target=2" },
    { name: "audit requested (product)", head: "audit requested:", batch: "base",
      line: `${timestamp} audit requested: product`,
      zone: "event", kind: "new", fragment: "role=Audit target=product" },
    { name: "retrospective requested", head: "retrospective requested:", batch: "base",
      line: `${timestamp} retrospective requested: 02`,
      zone: "event", kind: "new", fragment: "role=Retrospective target=2" },
    { name: "evidence-wait", head: "evidence-wait:", batch: "base",
      line: `${timestamp} evidence-wait: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}; check-json: ${JSON.stringify(check)}`,
      zone: "transition", kind: "remote-evidence", fragment: "state=evidence-wait" },
    { name: "evidence-finalizing", head: "evidence-finalizing:", batch: "base",
      line: `${timestamp} evidence-finalizing: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}; check-json: ${JSON.stringify(check)}`,
      zone: "transition", kind: "remote-evidence", fragment: "state=evidence-finalizing" },
  ];
  const invalid = [
    { name: "layer opening", head: "layer opening:", line: `${timestamp} layer opening: parent: devflow/tree; children: 02+03+04+05` },
    { name: "re-split pending", head: "re-split pending:", line: `${timestamp} re-split pending: folder: devflow/tree/02-capability; stale: 02; source: devflow/project/product.md#Capabilities` },
    { name: "maintenance routing pending", head: "maintenance routing pending:", line: `${timestamp} maintenance routing pending: request-json:` },
    { name: "product re-run pending", head: "product re-run pending:", line: `${timestamp} product re-run pending: statement-json:` },
    { name: "product verification requested", head: "product verification requested", line: `${timestamp} product verification requested: extra` },
    { name: "product verification running", head: "product verification running:", line: `${timestamp} product verification running: trigger: requested; product: p; verification: v` },
    { name: "product verification result", head: "product verification result:", line: `${timestamp} product verification result: trigger: requested; product: p; verification: v; code: c` },
    { name: "capability closing", head: "capability closing:", line: `${timestamp} capability closing: folder: devflow/tree/02-capability; head: ${checkpoint}; product: p; verification: v` },
    { name: "capability note", head: "capability note:", line: `${timestamp} capability note: capability: 02` },
    { name: "capability note (design)", head: "capability note:", line: `${timestamp} capability note: capability: 02; note-json: ${JSON.stringify("a statement")}; card-json: ${JSON.stringify(card)}; code-json: ${JSON.stringify("src/export/contract.ts")}` },
    { name: "audit requested", head: "audit requested:", line: `${timestamp} audit requested: 02x` },
    { name: "retrospective requested", head: "retrospective requested:", line: `${timestamp} retrospective requested: 02x` },
    { name: "evidence-wait", head: "evidence-wait:", line: `${timestamp} evidence-wait: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}` },
    { name: "evidence-finalizing", head: "evidence-finalizing:", line: `${timestamp} evidence-finalizing: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}` },
  ];

  const uniqueSorted = (values) => [...new Set(values)].sort();
  const tableHeads = uniqueSorted(valid.map((item) => item.head));
  assert.equal(valid.length, 16);
  assert.equal(invalid.length, 14);
  assert.deepEqual(uniqueSorted(invalid.map((item) => item.head)), tableHeads);

  const toolSource = fs.readFileSync(TOOL, "utf8");
  const reservedBlock = /const RESERVED_JOURNAL_HEADS = \[\r?\n(?<body>[\s\S]*?)\r?\n\];/.exec(toolSource);
  assert.ok(reservedBlock, "RESERVED_JOURNAL_HEADS block missing");
  const parserHeads = uniqueSorted([...reservedBlock.groups.body.matchAll(/^\s+"([^"]+)",\s*$/gm)].map((match) => match[1]));
  assert.deepEqual(parserHeads, tableHeads);

  const canon = fs.readFileSync(path.resolve(__dirname, "../skills/principles/SKILL.md"), "utf8");
  const canonPrefix = "YYYY-MM-DDTHH:MM:SSZ ";
  const canonStart = canon.indexOf(`${canonPrefix}layer opening:`);
  const canonEnd = canon.indexOf("\n```", canonStart);
  assert.notEqual(canonStart, -1, "canonical journal-format block start missing");
  assert.notEqual(canonEnd, -1, "canonical journal-format block end missing");
  const canonHeads = uniqueSorted(canon.slice(canonStart, canonEnd).split(/\r?\n/)
    .filter((line) => line.startsWith(canonPrefix))
    .map((line) => {
      const body = line.slice(canonPrefix.length);
      const colon = body.indexOf(":");
      return colon === -1 ? body : body.slice(0, colon + 1);
    }));
  assert.deepEqual(canonHeads, tableHeads);

  const execute = async (lines, subject) => {
    const batchRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-gate-a-")));
    t.after(() => fs.rmSync(batchRoot, { recursive: true, force: true }));
    fs.cpSync(root, batchRoot, { recursive: true });
    write(batchRoot, "devflow/journal.md", `${lines.join("\n")}\n`);
    commit(batchRoot, subject);
    const before = snapshot(batchRoot);
    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [TOOL, "state", "--root", batchRoot], {
        cwd: batchRoot, windowsHide: true,
      });
      const stdout = [];
      const stderr = [];
      child.stdout.on("data", (chunk) => stdout.push(chunk));
      child.stderr.on("data", (chunk) => stderr.push(chunk));
      child.on("error", reject);
      child.on("close", (status) => resolve({ status, stdout: Buffer.concat(stdout).toString("utf8"), stderr: Buffer.concat(stderr).toString("utf8") }));
    });
    ok(result);
    assertReadOnly(batchRoot, before);
    return result.stdout;
  };
  const pendingOutputs = new Map();
  for (const batch of uniqueSorted(valid.map((item) => item.batch))) {
    pendingOutputs.set(batch, execute(valid.filter((item) => item.batch === batch).map((item) => item.line), `jmp gate A — ${batch}`));
  }
  const pendingInvalid = execute(invalid.map((item) => item.line), "jmp gate A — invalid controls");
  const outputs = new Map();
  for (const [batch, pending] of pendingOutputs) outputs.set(batch, await pending);
  const invalidOutput = await pendingInvalid;
  const item12 = invalidOutput.split(/\r?\n/)
    .filter((line) => line.startsWith("integrity: kind=blocking") && line.includes("item=12 "));
  assert.equal(item12.length, 14, invalidOutput);

  for (const item of valid) {
    await t.test(`accepts ${item.name}`, () => {
      const output = outputs.get(item.batch);
      assertFragment(output, "integrity:", "blocking=0");
      if (item.zone) {
        assert.ok(hasKind(output, item.zone, item.kind), `missing ${item.zone}.${item.kind}\n${output}`);
        const matching = output.split(/\r?\n/).filter((line) => line.startsWith(`${item.zone}: kind=${item.kind}`));
        assert.ok(matching.some((line) => line.includes(item.fragment)), `missing ${item.fragment}\n${matching.join("\n")}`);
      } else {
        assert.equal(lineWith(output, "open-item:"), undefined, output);
      }
    });
  }
  for (const item of invalid) {
    await t.test(`rejects damaged ${item.name}`, () => {
      const reason = `reserved-format:${item.head}`;
      assert.ok(item12.some((line) => line.includes(`reason=${JSON.stringify(reason)}`) || line.includes(`reason=${reason}`)),
        `missing ${reason}\n${invalidOutput}`);
    });
  }
});

for (let index = 0; index < ROUTE_MAP.length; index += 1) {
  const number = index + 1;
  test(`T1 mapping ${String(number).padStart(2, "0")} has the exact zone, kind, values, and derived next`, async (t) => {
    if (number === 54) {
      const module = await registry();
      assert.equal(module.ZONE_DEFINITIONS.flatMap((zone) => zone.kinds).some((kind) => kind.name === "design-entry"), false);
      const root = mappingScene(t, 52);
      const result = run(root);
      ok(result);
      assert.ok(hasKind(result.stdout, "layer", "no-tree"));
      return;
    }
    const root = mappingScene(t, number);
    const before = snapshot(root);
    const result = run(root);
    ok(result);
    if (number === 3) t.diagnostic(`measurement interrupted-transition stdout-bytes=${Buffer.byteLength(result.stdout)}`);
    if (number === 24) t.diagnostic(`measurement ordinary-claim stdout-bytes=${Buffer.byteLength(result.stdout)}`);
    if (number === 23) {
      assert.match(result.stdout, /^existing-request: 2026-08-20T00:00:00Z maintenance routing pending: request-json: "fix A=B; preserve C"$/m);
      assert.equal(nextOf(result.stdout), "request.existing");
    } else {
      const [zone, kind] = ROUTE_MAP[index];
      assert.ok(hasKind(result.stdout, zone, kind), `missing ${zone}.${kind}\n${result.stdout}`);
      assert.equal(nextOf(result.stdout), `${zone}.${kind}`, result.stdout);
      if (number === 5) {
        assertFragment(result.stdout, "integrity:", "blocking=0");
        assertFragment(result.stdout, "transition: kind=layer-opening", "parent=devflow/tree children=02+03+04+05");
      }
    }
    assertReadOnly(root, before);
  });
}

const ROUTE_ZONES = ["git", "integrity", "transition", "marker", "setup", "claim", "baseline", "request", "event", "layer", "ready", "blocked", "product", "complete"];

function lineWith(output, prefix) {
  return output.split(/\r?\n/).find((line) => line.startsWith(prefix));
}

function assertFragment(output, prefix, fragment) {
  const line = lineWith(output, prefix);
  assert.ok(line, `missing ${prefix}\n${output}`);
  assert.ok(line.includes(fragment), `missing ${fragment}\n${line}`);
}

function assertNoFragment(output, prefix, fragment) {
  const line = lineWith(output, prefix);
  assert.ok(line, `missing ${prefix}\n${output}`);
  assert.ok(!line.includes(fragment), `unexpected ${fragment}\n${line}`);
}

test("T1 empty-zone contract prints every canonical zone in canonical order", async (t) => {
  const root = makeRepo(t);
  const result = run(root);
  ok(result);
  const module = await registry();
  const starts = result.stdout.split(/\r?\n/).filter((line) => module.ZONE_DEFINITIONS.some((zone) => line.startsWith(`${zone.zone}:`)));
  const first = module.ZONE_DEFINITIONS.map((zone) => starts.find((line) => line.startsWith(`${zone.zone}:`)));
  assert.deepEqual(module.ZONE_DEFINITIONS.map((zone) => zone.zone), ROUTE_ZONES);
  assert.equal(first.every(Boolean), true);
  assert.deepEqual(first.map((line) => line.split(":", 1)[0]), ROUTE_ZONES);
  assert.deepEqual(first.slice(2, 5), ["transition: none", "marker: none", "setup: none"]);
  assert.equal(nextOf(result.stdout), "complete.adoption");
});

test("T2 priority structure has one canonical array position per zone", async () => {
  const module = await registry();
  assert.deepEqual(module.ZONE_DEFINITIONS.map((item) => item.zone), ROUTE_ZONES);
  assert.equal(new Set(module.ZONE_DEFINITIONS.map((item) => item.zone)).size, 14);
  assert.equal(module.ZONE_DEFINITIONS.flatMap((item) => item.kinds.map((kind) => `${item.zone}.${kind.name}`)).length, 56);
});

test("T2 priority selector uses the canonical array for every i less than j", async () => {
  const module = await registry();
  const representatives = module.ZONE_DEFINITIONS.map((zone) => `${zone.zone}.${zone.kinds.find((kind) => kind.routing !== false && kind.present !== null).name}`);
  for (let i = 0; i < representatives.length; i += 1) {
    for (let j = i + 1; j < representatives.length; j += 1) {
      assert.equal(module.selectFirstRoute([representatives[j], representatives[i]]), representatives[i], `${i}<${j}`);
    }
  }
});

test("T2 overlap open Git and my claim keeps both and routes Git first", (t) => {
  const root = makeRepo(t);
  const card = writeClaim(root);
  git(root, "checkout", "-qb", "side");
  write(root, "seed.txt", "side\n");
  commit(root, "side");
  git(root, "checkout", "main");
  write(root, "seed.txt", "main\n");
  commit(root, "main");
  gitTry(root, "merge", "--no-edit", "side");
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "git: kind=open-operation", "operation=merge");
  assertFragment(result.stdout, "claim: kind=mine", `path=${card}`);
  assert.equal(nextOf(result.stdout), "git.open-operation");
});

test("T2 overlap product rerun marker and my claim keeps both and routes marker first", (t) => {
  const root = makeRepo(t);
  const card = writeClaim(root, { commitSubject: "jmp 02.1 claim" });
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z product re-run pending: statement-json: ${JSON.stringify("identity is disproved")}\n`);
  commit(root, "jmp boundary — marker");
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "marker: kind=product-rerun", "identity is disproved");
  assertFragment(result.stdout, "claim: kind=mine", `path=${card}`);
  assert.equal(nextOf(result.stdout), "marker.product-rerun");
});

test("T2 overlap remote evidence and ordinary claim keeps both and routes transition first", (t) => {
  const root = mappingScene(t, 8);
  const result = run(root);
  ok(result);
  assert.ok(hasKind(result.stdout, "transition", "remote-evidence"));
  assert.ok(hasKind(result.stdout, "claim", "mine"));
  assert.equal(nextOf(result.stdout), "transition.remote-evidence");
});

test("T2 overlap preserves ineffective card A and ready card B exact predicates", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/tree/02-capability/02.1-a.md", cardText("02.1", { approval: "invalid" }));
  write(root, "devflow/tree/02-capability/02.2-b.md", cardText("02.2"));
  commit(root, "jmp split — two cards");
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=approval-invalid", "file=devflow/tree/02-capability/02.1-a.md");
  assertFragment(result.stdout, "ready: kind=ready", "file=devflow/tree/02-capability/02.2-b.md");
  assert.equal(nextOf(result.stdout), "ready.approval-invalid");
});

function integrityFixture(t, item, bad) {
  const root = makeRepo(t);
  if (!bad) return root;
  const head = git(root, "rev-parse", "HEAD");
  switch (item) {
    case 1:
      write(root, "devflow/tree/02-capability/02.1-fixture.wip-ghost.md", cardText("02.1")); commit(root, "ghost claim"); break;
    case 2:
      write(root, "devflow/tree/02-a/02.1-first.md", cardText("02.1")); write(root, "devflow/tree/03-b/02.1-second.md", cardText("02.1")); commit(root, "duplicate card"); break;
    case 3:
      write(root, "devflow/tree/02-capability.done/02.1-active.md", cardText("02.1")); commit(root, "active under done"); break;
    case 4:
      write(root, "devflow/tree/02-capability/02.1-fixture.md", cardText("02.1", { depends: "02.9 prose" })); commit(root, "bad depends"); break;
    case 5:
      write(root, "devflow/users/jmp/HANDOFF.md", "# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step\ndevflow/tree/99-missing/99.1-no.md\n"); commit(root, "bad handoff"); break;
    case 6:
      write(root, "devflow/HANDOFF.md", "legacy\n"); commit(root, "root handoff"); break;
    case 7:
      write(root, "devflow/users/twin/owner.md", "id: twin\ngit: Jmp, jmp@example.test\n"); write(root, "devflow/users/twin/HANDOFF.md", ""); write(root, "devflow/users/twin/digest.md", "none\n"); commit(root, "duplicate identity"); break;
    case 8:
      write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n"); write(root, "devflow/users/other/HANDOFF.md", ""); write(root, "devflow/users/other/digest.md", "none\n"); write(root, "devflow/tree/02-capability/02.1-fixture.wip-other.md", cardText("02.1")); commit(root, "mismatched author"); break;
    case 9:
      write(root, "devflow/tree/02-capability/02.1-fixture.md", cardText("02.1", { omit: ["Approval", "Review"] })); commit(root, "missing fields"); break;
    case 10:
      fs.mkdirSync(path.join(root, "devflow", "tree", "02-empty"), { recursive: true }); break;
    case 11:
      write(root, "devflow/tree/02-capability/02.1-group/02.1.1-child.done.md", cardText("02.1.1")); commit(root, "open completed folder"); break;
    case 12:
      write(root, "devflow/journal.md", "product verification running: malformed\n"); break;
    case 13:
      write(root, "devflow/journal.md", `2026-08-20T00:00:00Z evidence-wait: card-json: ${JSON.stringify("devflow/tree/02-capability/02.1-missing.wip-jmp.md")}; checkpoint: 02.1 wip: ${head}; check-json: ${JSON.stringify("https://example.test/check")}\n`); break;
    case 14:
      write(root, "devflow/tree/02-capability/verify.md", "# Verification\nFailure history:\n- source id: 1; timestamp: 2026-08-20T00:00:00Z; failure: one; routing: pending\n- source id: 1; timestamp: 2026-08-20T00:00:01Z; failure: two; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n"); break;
    case 15: {
      const r = currentRevisions(root);
      write(root, "devflow/journal.md", `2026-08-20T00:00:00Z product verification requested\n2026-08-20T00:00:01Z product verification running: trigger: automatic; product: ${r.productRevision}; verification: ${r.verificationRevision}; code: ${r.codeRevision}\n`); break;
    }
    default: throw new Error(`unknown integrity item ${item}`);
  }
  return root;
}

const INTEGRITY_REASONS = [
  "orphan-claim:ghost", "duplicate-number:02.1", "active-card-in-done-folder", "noncanonical Depends: 02.9 prose",
  "handoff-path-resolves-0", "root-handoff", "duplicate-git-identity", "claimant-author-mismatch",
  "missing-approval-or-review", "empty-folder-without-layer-opening", "complete-children-without-done-folder",
  "reserved-format:product verification running:", "card-resolves-0", "source-id", "product-state-cardinality",
];

for (let item = 1; item <= 15; item += 1) {
  test(`T3 integrity ${String(item).padStart(2, "0")} reports the exact anomaly`, (t) => {
    const root = integrityFixture(t, item, true);
    const result = run(root);
    ok(result);
    const line = result.stdout.split(/\r?\n/).find((value) => value.startsWith("integrity: kind=") && value.includes(`item=${item} `));
    assert.ok(line, result.stdout);
    assert.ok(line.includes(`reason=${JSON.stringify(INTEGRITY_REASONS[item - 1])}`) || line.includes(`reason=${INTEGRITY_REASONS[item - 1]}`), line);
    if (item >= 12) assert.equal(nextOf(result.stdout), "integrity.blocking");
  });

  test(`T3 integrity ${String(item).padStart(2, "0")} accepts the corrected control`, (t) => {
    const root = integrityFixture(t, item, false);
    const result = run(root);
    ok(result);
    assert.equal(result.stdout.split(/\r?\n/).some((value) => value.startsWith("integrity: kind=") && value.includes(`item=${item} `)), false, result.stdout);
  });
}

test("T4 report service is the exact current project identity", (t) => {
  const result = run(makeRepo(t)); ok(result);
  assertFragment(result.stdout, "report:", 'service="Fixture service"');
});

test("T4 product producer heading round-trips with its canonical HTML comment", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "baseline:", "expected=2");
  assertFragment(result.stdout, "integrity:", "shape=0");
});

test("T4 product arbitrary heading suffix stays rejected and visible", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const current = read(root, "devflow/project/product.md");
  write(root, "devflow/project/product.md", current.replace(
    "## Capabilities        <!-- ① ② ③ number + name + user outcome + why that outcome is needed for success -->",
    "## Capabilities of the old plan",
  ));
  commit(root, "old product heading");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "baseline:", "expected=1");
  assertFragment(result.stdout, "integrity:", "shape=1");
  assertFragment(result.stdout, "integrity: kind=shape", "zone=product");
  assertFragment(result.stdout, "integrity: kind=shape", "detail=capabilities-heading-missing");
});

test("T4 product prose beginning with bold circled numbers is not a capability", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha", "Beta", "Gamma", "Delta"] });
  const current = read(root, "devflow/project/product.md");
  write(root, "devflow/project/product.md", current.replace(
    "- **④ Delta** — Fixture user outcome because success needs it.\n## Boundary",
    "- **④ Delta** — Fixture user outcome because success needs it.\n**①② are the MVP.** ③④ support that flow.\n## Boundary",
  ));
  commit(root, "product prose");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "baseline:", "expected=5");
  assertFragment(result.stdout, "integrity:", "shape=0");
});

test("T4 product prose beginning with one circled number is a named duplicate anomaly", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha", "Beta", "Gamma", "Delta"] });
  const current = read(root, "devflow/project/product.md");
  write(root, "devflow/project/product.md", current.replace(
    "- **④ Delta** — Fixture user outcome because success needs it.\n## Boundary",
    "- **④ Delta** — Fixture user outcome because success needs it.\n**④ Work surface recovery comes later.**\n## Boundary",
  ));
  commit(root, "single-number product prose");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "baseline:", "expected=6");
  assertFragment(result.stdout, "integrity:", "shape=1");
  assertFragment(result.stdout, "integrity: kind=shape", "detail=duplicate-capability-number:5");
});

test("T4 report progressLastPoint is the exact last nonempty progress entry", (t) => {
  const root = makeRepo(t); const card = writeClaim(root, { progress: "2026-08-20T01:02:03Z exact last point" });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", `taskInProgress=${card}`);
  assertFragment(result.stdout, "report:", 'progressLastPoint="2026-08-20T01:02:03Z exact last point"');
});

test("T4 report notYetOnIntegration is the exact branch-only canonical path", (t) => {
  const root = makeRepo(t); git(root, "checkout", "-qb", "task"); const card = writePending(root);
  const result = run(root); ok(result);
  assertFragment(result.stdout, "git:", "notYetOnIntegration=1");
  assertFragment(result.stdout, "report:", `notYetOnIntegration=[${JSON.stringify(card)}]`);
});

test("T4 report uncommittedUnattributed is the exact path outside my claim", (t) => {
  const root = makeRepo(t); write(root, "outside.txt", "changed\n");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", 'uncommittedUnattributed=["outside.txt"]');
});

test("T4 openItems round-trips punctuation without parsing the prose", (t) => {
  const root = makeRepo(t); const open = "2026-08-20T01:02:03Z jmp: decide A=B; or keep C";
  write(root, "devflow/journal.md", `${open}\n`); commit(root, "jmp note");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "openItems=1");
  assert.match(result.stdout, new RegExp(`^open-item: ${open.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
});

test("T4 human journal prose mentioning a reserved head is outside machine ownership", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/journal.md", "# Journal\nThis is a human notebook line.\n- Today I documented how a line beginning with audit requested: is written.\n");
  commit(root, "human journal prose");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity:", "blocking=0");
  assertFragment(result.stdout, "report:", "openItems=0");
  assert.equal(result.stdout.includes("unrecognized-journal-line"), false, result.stdout);
});

test("T4 timestamp-less reserved journal head after a list marker remains blocking", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/journal.md", "  - audit requested: product\n");
  commit(root, "reserved journal head without timestamp");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity:", "blocking=1");
  assertFragment(result.stdout, "integrity: kind=blocking", 'reason="reserved-format:audit requested:"');
  assert.equal(nextOf(result.stdout), "integrity.blocking");
});

test("T4 selection reason exposes a valid HANDOFF exact path", (t) => {
  const root = makeRepo(t); const card = writeClaim(root);
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${card}\n`); commit(root, "jmp handoff");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "selectionReason=last-handoff");
  assertFragment(result.stdout, "handoff:", `date=2099-01-01T00:00:00Z stale=0 nextStep=${card}`);
});

test("T4 HANDOFF waiting capability path is live and selected", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const waiting = "devflow/tree/02-Alpha.md";
  write(root, waiting, "# 02 Alpha\n");
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${waiting}\n`);
  commit(root, "jmp waiting capability handoff");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("handoff-path-resolves-0"), false, result.stdout);
  assertFragment(result.stdout, "handoff:", `date=2099-01-01T00:00:00Z stale=0 nextStep=${waiting}`);
  assertFragment(result.stdout, "report:", "selectionReason=last-handoff");
  assertFragment(result.stdout, "ready: kind=waiting-capability", `file=${waiting}`);
  assert.equal(nextOf(result.stdout), "ready.waiting-capability", result.stdout);
});

test("T4 HANDOFF none is a canonical sentinel, not a path or stale cause", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/users/jmp/HANDOFF.md", "# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\nnone\n");
  commit(root, "jmp none handoff");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "handoff:", "date=2099-01-01T00:00:00Z stale=0 nextStep=none");
  assert.equal(result.stdout.includes("handoff-path-resolves-0"), false, result.stdout);
});

test("T4 selection reason rejects a stale HANDOFF and exposes its stale fact", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/users/jmp/HANDOFF.md", "# HANDOFF · 2000-01-01T00:00:00Z\n## Next single step\ndevflow/tree/99-missing/99.1-no.md\n"); commit(root, "jmp stale handoff");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "selectionReason=canonical-order");
  assertFragment(result.stdout, "handoff:", "stale=1");
});

test("T4 selection reason uses canonical order when no HANDOFF points", (t) => {
  const result = run(makeRepo(t)); ok(result);
  assertFragment(result.stdout, "report:", "selectionReason=canonical-order");
  assertFragment(result.stdout, "handoff:", "date=none stale=0 nextStep=none");
});

test("T4 revisions project product verification code and the selected capability on one line", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const card = "devflow/tree/02-Alpha/02.1-fixture.done.md";
  write(root, card, cardText("02.1"));
  commit(root, "jmp 02.1 final");
  const expected = currentRevisions(root);
  const capability = pathSetRevision(root, [card]);

  const product = run(root); ok(product);
  assertFragment(product.stdout, "revisions:", `product=${expected.productRevision}`);
  assertFragment(product.stdout, "revisions:", `verification=${expected.verificationRevision}`);
  assertFragment(product.stdout, "revisions:", `code=${expected.codeRevision}`);
  assertFragment(product.stdout, "revisions:", "capability=not-applicable");
  assert.equal(product.stdout.split(/\r?\n/).filter((line) => line.startsWith("revisions:")).length, 1, product.stdout);

  const narrowed = run(root, "--capability", "2"); ok(narrowed);
  assertFragment(narrowed.stdout, "revisions:", `capability=${capability}`);
});

test("D5 closure an empty verification input set hashes empty bytes instead of the repository", async (t) => {
  const root = makeRepo(t, { arch: false, glossary: false, codeStyle: false, baseline: false });
  const empty = execFileSync("git", ["hash-object", "--stdin"], {
    cwd: root, input: Buffer.alloc(0), encoding: "utf8",
  }).trim();
  const result = run(root); ok(result);
  assertFragment(result.stdout, "revisions:", `verification=${empty}`);

  const { nativeBinaryHash } = await registry();
  assert.equal(await nativeBinaryHash(root, "HEAD", []), empty);
});

test("D5 closure a failed revision source cannot become a successful empty hash", async (t) => {
  const root = makeRepo(t);
  const { nativeBinaryHash, revisionFromGit } = await registry();
  assert.equal(await nativeBinaryHash(root, "refs/heads/does-not-exist", ["devflow/project/product.md"]), null);
  const id = git(root, "rev-parse", "HEAD");
  assert.equal(revisionFromGit({ status: 1, stdout: Buffer.from(`${id}\n`) }, "none"), "unresolved");
  assert.equal(revisionFromGit({ status: 0, stdout: Buffer.from("not-an-object\n") }, "none"), "unresolved");
  assert.equal(revisionFromGit({ status: 0, stdout: Buffer.alloc(0) }, "none"), "none");
  assert.equal(revisionFromGit({ status: 0, stdout: Buffer.from(`${id}\n`) }, "none"), id);
});

// Freshness is measured against the history this room claimed. With nothing claimed there is
// no such history, and `git log -- ` with no path is the whole repository, so the question
// itself has to be skipped rather than asked wider.
test("T4 a room with no claimed card is not staled by history it never claimed", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const waiting = "devflow/tree/02-Alpha.md";
  write(root, waiting, "# 02 Alpha\n");
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2000-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${waiting}\n`);
  commit(root, "jmp waiting capability handoff");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "handoff:", `date=2000-01-01T00:00:00Z stale=0 nextStep=${waiting}`);
  assertFragment(result.stdout, "report:", "selectionReason=last-handoff");
});

// A waiting capability file, the folder it opens into, and any status-suffixed form of either
// are one durable tree identity. A HANDOFF written before the folder existed still names the
// same subject, and the routable folder is what the layer route hands back.
test("T4 a HANDOFF path survives its capability opening into the same-identity folder", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const waiting = "devflow/tree/02-Alpha.md";
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${waiting}\n`);
  write(root, "devflow/tree/02-Alpha/02.1-fixture.done.md", cardText("02.1"));
  commit(root, "jmp layer opening — 02 Alpha");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("handoff-path-resolves-"), false, result.stdout);
  assertFragment(result.stdout, "handoff:", `stale=0 nextStep=${waiting}`);
  assertFragment(result.stdout, "report:", "selectionReason=last-handoff");
  assertFragment(result.stdout, "layer: kind=children-done", "folder=devflow/tree/02-Alpha");

  // the same identity written as the folder it now is, trailing separator and all
  write(root, "devflow/users/jmp/HANDOFF.md", "# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\ndevflow/tree/02-Alpha/\n");
  const folderForm = run(root); ok(folderForm);
  assert.equal(folderForm.stdout.includes("handoff-path-resolves-"), false, folderForm.stdout);
  assertFragment(folderForm.stdout, "handoff:", "stale=0 nextStep=devflow/tree/02-Alpha/");

  fs.renameSync(path.join(root, "devflow/tree/02-Alpha"), path.join(root, "devflow/tree/02-Alpha.done"));
  const statusForm = run(root); ok(statusForm);
  assert.equal(statusForm.stdout.includes("handoff-path-resolves-"), false, statusForm.stdout);
  assertFragment(statusForm.stdout, "handoff:", "stale=0 nextStep=devflow/tree/02-Alpha/");
});

test("T4 a HANDOFF may preserve the exact verify path named by a product transition", (t) => {
  const root = completedRepo(t);
  rootVerify(root, "pass", { events: false });
  write(root, "devflow/users/jmp/HANDOFF.md", "# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step\ndevflow/tree/verify.md\n");
  commit(root, "jmp boundary — product verify handoff");
  const revisions = currentRevisions(root);
  write(root, "devflow/journal.md",
    `2026-08-23T00:00:00Z product verification result: trigger: automatic; product: ${revisions.productRevision}; verification: ${revisions.verificationRevision}; code: ${revisions.codeRevision}; verdict: pass\n`);
  commit(root, "jmp boundary — product verification result");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "handoff:", "stale=0 nextStep=devflow/tree/verify.md");
  assertFragment(result.stdout, "transition: kind=product-result", "path=devflow/tree/verify.md");
});

test("T4 a waiting file and its folder at once is an ambiguity, not a match", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha"] });
  const waiting = "devflow/tree/02-Alpha.md";
  write(root, waiting, "# 02 Alpha\n");
  write(root, "devflow/tree/02-Alpha/02.1-fixture.md", cardText("02.1"));
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${waiting}\n`);
  commit(root, "jmp waiting file and folder at once");
  const result = run(root); ok(result);
  assert.ok(result.stdout.includes("reason=handoff-path-resolves-2"), result.stdout);
  assertFragment(result.stdout, "handoff:", "stale=1");
  assertFragment(result.stdout, "report:", "selectionReason=canonical-order");
});

// The path regex is ASCII, so a Unicode capability reaches nextStep through the raw-line
// fallback — and the same identity has to hold there. Escaped, because this file is a deploy
// artifact and carries no Korean of its own.
test("T4 a Unicode waiting path resolves through the raw-line fallback into its folder", (t) => {
  const name = "\uB2A5\uB825";
  const root = makeRepo(t, { capabilities: [name] });
  const waiting = `devflow/tree/02-${name}.md`;
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2099-01-01T00:00:00Z\n## Next single step          <!-- one tree path | none -->\n${waiting}\n`);
  write(root, `devflow/tree/02-${name}/02.1-fixture.done.md`, cardText("02.1"));
  commit(root, "jmp layer opening — unicode capability");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("handoff-path-resolves-"), false, result.stdout);
  assertFragment(result.stdout, "handoff:", `stale=0 nextStep=${waiting}`);
  assertFragment(result.stdout, "layer: kind=children-done", `folder=devflow/tree/02-${name}`);
});

test("T4 the claim-history query cannot run with an empty claimed path list", () => {
  const body = /\nfunction parseHandoff\(snapshot\) \{\n([\s\S]*?)\n\}\n/.exec(fs.readFileSync(TOOL, "utf8"))?.[1];
  assert.ok(body, "parseHandoff must be findable in the deployed tool");
  const query = '"log", "-1", "--format=%cI"';
  assert.equal(body.split(query).length - 1, 1, "there is exactly one claim-history query to guard");
  const guard = /if \(date !== null && claimed\.length > 0\) \{/;
  assert.match(body, guard, "a non-empty claimed path list is what opens the query");
  assert.ok(body.indexOf(query) > body.search(guard), "the query sits inside that guard");
});

const BASELINE_FIELDS = [
  ["expectedSet", () => [{ number: 1, path: "devflow/project/capabilities/01-foundation.md", retired: false }]],
  ["pathState", () => ({ "devflow/project/capabilities/01-foundation.md": "present" })],
  ["boundary", () => ({ count: 1, status: "ok" })],
  ["shapeValid", () => true],
  ["anomalies", () => []],
  ["noneSections", () => ["## Intent", "## Concept model", "## Invariants", "## Non-goals", "## Binding ADRs", "### Main flow", "### Lifecycle", "### Current behavior", "### Entrypoints", "### Consumed contracts", "### Traps", "### Verify"]],
  ["legacyV010", () => ({ value: false, reasons: [] })],
  ["designHead", (root) => { const value = git(root, "log", "-1", "--format=%H", "--", "devflow/project/product.md", "devflow/project/arch.md", "devflow/project/glossary.md"); return { stored: value, current: value }; }],
  ["scopeHead", () => ({ stored: "none", current: "none", union: [] })],
  ["designFreshness", () => ({ value: "fresh", reason: null })],
  ["verifiedFreshness", () => ({ value: "hypothesis", reasons: ["verified-at-none", "empty-scope"] })],
  ["coveredFreshness", () => ({ value: "fresh", symmetricDifference: [] })],
  ["bindingAdrStatus", () => []],
];

for (const [field, expected] of BASELINE_FIELDS) {
  test(`T4 baseline --capability exact field ${field}`, (t) => {
    const root = makeRepo(t);
    const result = run(root, "--capability", "1"); ok(result);
    const line = result.stdout.split(/\r?\n/).find((value) => value.startsWith("baseline: capability=1 "));
    assert.ok(line, result.stdout);
    const value = expected(root);
    const rendered = typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : JSON.stringify(value);
    assert.ok(line.includes(`${field}=${rendered}`), `${field}=${rendered}\n${line}`);
  });
}

test("T6 missing node executable stops with the exact launch cause and no guessed next", () => {
  const result = spawnSync("node-definitely-missing-devflow", [TOOL, "state"], { encoding: "utf8" });
  assert.equal(result.status, null);
  assert.equal(result.error?.code, "ENOENT");
  assert.doesNotMatch(result.stdout ?? "", /^next:/m);
});

test("T6 missing tool source path stops and emits no guessed next", () => {
  const missing = `${TOOL}.missing`;
  const result = spawnSync(process.execPath, [missing, "state"], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /MODULE_NOT_FOUND|Cannot find module/);
  assert.doesNotMatch(result.stdout, /^next:/m);
});

test("output budget compact shortens only the non-routing progress hint, then refuses without dropping durable facts", (t) => {
  const compactRoot = makeRepo(t);
  writeClaim(compactRoot, { progress: `2026-08-20T00:00:00Z ${"x".repeat(26000)}` });
  const compact = run(compactRoot); ok(compact);
  assert.match(compact.stdout, /^state: .* bytes=\d+\/24576 form=compact$/m);
  assert.equal(Buffer.byteLength(compact.stdout) <= 24 * 1024, true);
  assert.match(compact.stdout, /progressLastPointTruncated=1/);

  const refusedRoot = makeRepo(t);
  const refusedRows = Array.from({ length: 400 }, (_, index) => `2026-08-20T00:${String(index % 60).padStart(2, "0")}:00Z jmp: ${index}-${"x".repeat(100)}`);
  write(refusedRoot, "devflow/journal.md", `${refusedRows.join("\n")}\n`);
  const refused = run(refusedRoot);
  assert.equal(refused.status, 3, refused.stderr);
  assert.equal(refused.stderr, "");
  assert.match(refused.stdout, /form=compact emitted=0/);
  assert.match(refused.stdout, /^blocked: output budget exceeded; narrow --capability <n>$/m);
  assert.doesNotMatch(refused.stdout, /--card/);
  assert.doesNotMatch(refused.stdout, /^next:/m);
});

test("compact integrity blocking keeps each whole repair payload distinguishable", (t) => {
  const root = makeRepo(t);
  writeClaim(root, { progress: `2026-08-20T00:00:00Z ${"x".repeat(26000)}` });
  const shared = `2026-08-20T00:00:00Z product verification running: ${"same-prefix-".repeat(14)}`;
  const rows = [`${shared}A`, `${shared}B`];
  write(root, "devflow/journal.md", `${rows.join("\n")}\n`);
  const result = run(root); ok(result);
  assert.match(result.stdout, /^state: .* form=compact$/m);
  const repairItems = result.stdout.split(/\r?\n/).filter((line) => line.startsWith("integrity: kind=blocking"));
  assert.equal(repairItems.length, rows.length);
  for (const row of rows) {
    assert.ok(repairItems.some((line) => line.includes(`line=${JSON.stringify(row)}`)), `${row}\n${repairItems.join("\n")}`);
  }
  assert.doesNotMatch(result.stdout, /lineTruncated=1/);
  assert.equal(nextOf(result.stdout), "integrity.blocking");
});

test("adversarial F1 canonical Failure history without source id requires migration", (t) => {
  const root = makeRepo(t);
  capabilityVerify(root, "devflow/tree/02-capability/verify.md", {
    failures: "- timestamp: 2026-08-20T00:00:00Z; failure: canonical missing id; routing: pending",
  });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=source-id-migration", 'section="Failure history"');
  assert.equal(nextOf(result.stdout), "transition.source-id-migration");
});

test("D6 an empty Failure history has zero list items and legacy dash-none invents no source id", async (t) => {
  for (const [label, failures] of [["canonical empty", ""], ["legacy dash-none", "- none"]]) {
    await t.test(label, () => {
      const root = makeRepo(t);
      capabilityVerify(root, "devflow/tree/02-capability/verify.md", { failures });
      const result = run(root); ok(result);
      assert.equal(hasKind(result.stdout, "transition", "source-id-migration"), false, result.stdout);
      assert.equal(result.stdout.includes("reason=source-id"), false, result.stdout);
    });
  }
});

test("adversarial F1 canonical Failure history duplicate source ids blocks", (t) => {
  const root = makeRepo(t);
  capabilityVerify(root, "devflow/tree/02-capability/verify.md", {
    failures: "- source id: 1; timestamp: 2026-08-20T00:00:00Z; failure: one; routing: pending\n- source id: 1; timestamp: 2026-08-20T00:00:01Z; failure: two; routing: pending",
  });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=14");
  assert.equal(nextOf(result.stdout), "integrity.blocking");
});

test("adversarial F1 canonical numbered event finding is projected verbatim", (t) => {
  const root = makeRepo(t);
  capabilityVerify(root, "devflow/tree/02-capability/verify.md", {
    audit: "- awaiting user decision · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product\n  1. exact numbered finding",
  });
  const result = run(root); ok(result);
  assert.match(result.stdout, /^finding: devflow\/tree\/02-capability\/verify\.md:\d+ 1\. exact numbered finding$/m);
});

test("adversarial F2 product Audit request becomes a runnable event", (t) => {
  const root = makeRepo(t, { brownfield: "no" });
  rootVerify(root, "pass");
  write(root, "devflow/journal.md", "2026-08-20T00:00:00Z audit requested: product\n");
  commit(root, "jmp audit request");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "event: kind=new", "role=Audit");
  assertFragment(result.stdout, "event: kind=new", "key=2026-08-20T00:00:00Z");
  assert.equal(nextOf(result.stdout), "event.new");
});

test("adversarial F2 capability Retrospective request becomes a runnable event", (t) => {
  const root = makeRepo(t, { brownfield: "no", capabilities: ["capability"] });
  capabilityVerify(root, "devflow/tree/02-capability/verify.md");
  write(root, "devflow/journal.md", "2026-08-20T00:00:00Z retrospective requested: 2\n");
  commit(root, "jmp retrospective request");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "event: kind=new", "role=Retrospective");
  assertFragment(result.stdout, "event: kind=new", "target=2");
  assert.equal(nextOf(result.stdout), "event.new");
});

test("adversarial F2 post-failure capability Audit is automatic", (t) => {
  const root = makeRepo(t, { brownfield: "no", capabilities: ["capability"] });
  write(root, "devflow/tree/02-capability.done/02.1-work.done.md", cardText("02.1"));
  commit(root, "jmp capability done");
  capabilityVerify(root, "devflow/tree/02-capability.done/verify.md", {
    failures: "- source id: 4; timestamp: 2026-08-20T00:00:00Z; failure: exact failure; routing: fixed",
  });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "event: kind=new", "role=Audit");
  assertFragment(result.stdout, "event: kind=new", 'key="post-failure through 4"');
});

test("adversarial F2 first capability closure Retrospective is automatic", (t) => {
  const root = makeRepo(t, { brownfield: "no", capabilities: ["capability"] });
  write(root, "devflow/tree/02-capability.done/02.1-work.done.md", cardText("02.1"));
  commit(root, "jmp capability done");
  capabilityVerify(root, "devflow/tree/02-capability.done/verify.md");
  const result = run(root); ok(result);
  const events = result.stdout.split(/\r?\n/).filter((line) => line.startsWith("event: kind=new"));
  assert.ok(events.some((line) => line.includes("role=Retrospective") && line.includes('key="first closure 2"')), result.stdout);
});

test("adversarial F3 item 8 checks authors after my current claim commit", (t) => {
  const root = makeRepo(t);
  const card = writeClaim(root, { commitSubject: "jmp claim 02.1" });
  git(root, "config", "user.name", "Other");
  git(root, "config", "user.email", "other@example.test");
  write(root, card, `${read(root, card)}2026-08-20T00:00:00Z other edit\n`);
  commit(root, "other changed claimed card");
  git(root, "config", "user.name", "Jmp");
  git(root, "config", "user.email", "jmp@example.test");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=advisory", "item=8");
  assertFragment(result.stdout, "integrity: kind=advisory", "reason=claimant-author-mismatch");
});

test("adversarial F3 item 12 rejects a timestamped malformed reserved line", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/journal.md", "2026-08-20T00:00:00Z product verification running: malformed\n");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=12");
  assert.equal(nextOf(result.stdout), "integrity.blocking");
});

test("adversarial F3 item 13 checks checkpoint subject path and remote check JSON", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.1-fixture.wip-jmp.md";
  write(root, card, `${cardText("02.1")}2026-08-20T00:00:00Z remote evidence check: check-json: ${JSON.stringify("https://example.test/actual")}; verdict: unrun; detail-json: ""\n`);
  const checkpoint = commit(root, "jmp 02.1 wip: evidence-wait");
  write(root, "devflow/journal.md", `2026-08-20T00:00:01Z evidence-wait: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}; check-json: ${JSON.stringify("https://example.test/different")}\n`);
  commit(root, "jmp boundary — evidence-wait 02.1");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=13");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=checkpoint-check-json");
});

test("adversarial F3 prepared-route accepts CRLF payload content matching the working tree", (t) => {
  const root = makeRepo(t);
  const verify = "devflow/tree/02-capability/verify.md";
  const target = "devflow/tree/02-capability/02.1-fix.md";
  const pending = "# Verification\nFailure history:\n- source id: 1; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n";
  write(root, verify, pending);
  commit(root, "jmp boundary — verify pending");
  const base = git(root, "rev-parse", "HEAD");
  const content = "# fix\r\n\r\nWindows payload\r\n";
  const object = { base, result: "routing: fix cards 02.1", operations: [{ op: "write", path: target, content }] };
  write(root, target, content);
  write(root, verify, pending.replace("routing: pending", `routing prepared: ${JSON.stringify(object)}`));
  const result = run(root); ok(result);
  assert.equal(hasKind(result.stdout, "transition", "prepared-route"), true, result.stdout);
  assertFragment(result.stdout, "transition: kind=prepared-route", `path=${verify}`);
  assertFragment(result.stdout, "transition: kind=prepared-route", "prefix=1");
  assert.equal(nextOf(result.stdout), "transition.prepared-route", result.stdout);
});

test("adversarial F3 prepared-route treats CRLF payload matching the base as no change", (t) => {
  const root = makeRepo(t);
  const verify = "devflow/tree/02-capability/verify.md";
  const target = "devflow/tree/02-capability/02.1-fix.md";
  const pending = "# Verification\nFailure history:\n- source id: 1; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n";
  const content = "# fix\r\n\r\nWindows payload\r\n";
  write(root, target, content);
  write(root, verify, pending);
  commit(root, "jmp boundary — verify pending");
  const base = git(root, "rev-parse", "HEAD");
  const object = { base, result: "routing: fix cards 02.1", operations: [{ op: "write", path: target, content }] };
  write(root, verify, pending.replace("routing: pending", `routing prepared: ${JSON.stringify(object)}`));
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=14");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=operation-write-no-change");
  assert.equal(hasKind(result.stdout, "transition", "prepared-route"), false, result.stdout);
});

test("adversarial F3 prepared-route move resolves an Audit locator from its base", (t) => {
  const root = makeRepo(t, { capabilities: ["capability"] });
  const closed = "devflow/tree/02-capability.done";
  const open = "devflow/tree/02-capability";
  const baseVerify = `${closed}/verify.md`;
  const currentVerify = `${open}/verify.md`;
  const pending = "# Verification\nFailure history:\nNone.\n## Audit\n- routing · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: capability:02 · 1 findings · 1 adopted\n  1. reopen exact finding\n     routing: pending\n## Retrospective\n- not run\n";
  const locator = `verify:${baseVerify}#Audit@1/1`;
  write(root, baseVerify, pending);
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z layer opening: parent: ${open}; children: 02.1; source-json: ${JSON.stringify(locator)}\n`);
  commit(root, "jmp boundary — closed Audit routing pending");
  const base = git(root, "rev-parse", "HEAD");
  const object = {
    base,
    result: "routing: fix cards 02.1",
    operations: [
      { op: "move", from: closed, to: open },
      { op: "write", path: `${open}/02.1-fix.md`, content: cardText("02.1") },
    ],
  };
  write(root, baseVerify, pending.replace("routing: pending", `routing prepared: ${JSON.stringify(object)}`));
  fs.renameSync(path.join(root, ...closed.split("/")), path.join(root, ...open.split("/")));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assertFragment(result.stdout, "transition: kind=prepared-route", `path=${currentVerify}`);
  assertFragment(result.stdout, "transition: kind=prepared-route", "prefix=1");
  assert.equal(nextOf(result.stdout), "transition.prepared-route", result.stdout);
});

test("adversarial F3 core locator falls back to HEAD when an uncommitted output deletes the file", (t) => {
  const root = makeRepo(t);
  const locator = "core:devflow/project/product.md#Capabilities";
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(locator)}\n`);
  commit(root, "jmp split — begin devflow/tree");
  fs.rmSync(path.join(root, "devflow", "project", "product.md"));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "transition", "layer-opening"), true, result.stdout);
});

test("adversarial F3 journal locator falls back to HEAD when an uncommitted output deletes the line", (t) => {
  const root = makeRepo(t);
  const source = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("exact source")}`;
  const marker = `2026-08-20T00:00:01Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(`journal:${source}`)}`;
  write(root, "devflow/journal.md", `${source}\n${marker}\n`);
  commit(root, "jmp split — begin devflow/tree");
  write(root, "devflow/journal.md", `${marker}\n`);
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "transition", "layer-opening"), true, result.stdout);
});

test("adversarial F3 Failure history locator falls back to HEAD after another uncommitted output transition", (t) => {
  const root = makeRepo(t);
  const verify = "devflow/tree/02-capability/verify.md";
  const pending = "# Verification\nFailure history:\n- source id: 1; timestamp: 2026-08-20T00:00:00Z; failure: exact source; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n";
  const locator = `verify:${verify}#Failure history@1`;
  write(root, verify, pending);
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(locator)}\n`);
  commit(root, "jmp split — begin devflow/tree");
  write(root, verify, pending.replace("- source id: 1; timestamp: 2026-08-20T00:00:00Z; failure: exact source; routing: pending", "None."));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "transition", "layer-opening"), true, result.stdout);
});

test("adversarial F3 event locator falls back to HEAD after another uncommitted output transition", (t) => {
  const root = makeRepo(t);
  const verify = "devflow/tree/02-capability/verify.md";
  const pending = "# Verification\nFailure history:\nNone.\n## Audit\n- not run\n## Retrospective\n- routing · source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: capability:02 · 1 findings · 1 adopted\n  1. exact source\n     routing: pending\n";
  const locator = `verify:${verify}#Retrospective@1/1`;
  write(root, verify, pending);
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(locator)}\n`);
  commit(root, "jmp split — begin devflow/tree");
  write(root, verify, pending.replace(/## Retrospective[\s\S]*$/, "## Retrospective\n- not run\n"));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "transition", "layer-opening"), true, result.stdout);
});

test("adversarial F3 card locator remains anchored to its explicit commit hash", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.1-source.md";
  write(root, card, cardText("02.1"));
  const hash = commit(root, "jmp 02.1 source");
  const locator = `card:${card}@${hash}`;
  write(root, "devflow/journal.md", `2026-08-20T00:00:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(locator)}\n`);
  commit(root, "jmp split — begin devflow/tree");
  fs.rmSync(path.join(root, ...card.split("/")));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reason=source-resolves-0"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "transition", "layer-opening"), true, result.stdout);
});

test("adversarial F3 item 14 rejects delete of an absent prepared-route input", (t) => {
  const root = makeRepo(t);
  const pending = "# Verification\nFailure history:\n- source id: 1; routing: pending\n## Audit\n- not run\n## Retrospective\n- not run\n";
  write(root, "devflow/tree/02-capability/verify.md", pending);
  commit(root, "jmp boundary — verify pending");
  const base = git(root, "rev-parse", "HEAD");
  const object = { base, result: "routing: fix cards 02.1", operations: [{ op: "delete", path: "devflow/tree/02-capability/02.1-missing.md" }] };
  write(root, "devflow/tree/02-capability/verify.md", pending.replace("routing: pending", `routing prepared: ${JSON.stringify(object)}`));
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=14");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=operation-delete-input");
  assert.equal(hasKind(result.stdout, "transition", "prepared-route"), false);
});

test("adversarial F4 foundation done children close a folder boundary, not a capability", (t) => {
  const root = makeRepo(t, { brownfield: "no" });
  write(root, "devflow/tree/01-foundation/01.1-fixture.done.md", cardText("01.1"));
  commit(root, "jmp foundation child done");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "layer: kind=folder-boundary", "folder=devflow/tree/01-foundation");
  assert.equal(hasKind(result.stdout, "layer", "children-done"), false);
  assert.equal(nextOf(result.stdout), "layer.folder-boundary");
});

test("adversarial F5 nonblocking integrity uses advisory while shape retains zone semantics", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/tree/02-capability/02.1-fixture.wip-ghost.md", cardText("02.1"));
  commit(root, "ghost claim");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=advisory", "item=1");
  assert.equal(result.stdout.split(/\r?\n/).some((line) => line.startsWith("integrity: kind=shape") && line.includes("item=1")), false);
  assert.notEqual(nextOf(result.stdout), "integrity.advisory");
});

function integrityItemLines(output, item) {
  return output.split(/\r?\n/)
    .filter((line) => line.startsWith("integrity: kind=") && line.includes(`item=${item} `));
}

test("R1 closed-folder projection suppresses integrity 1, 4, 8, 9, and 13 while preserving item 3", async (t) => {
  await t.test("item 1 orphan claim", () => {
    const root = makeRepo(t);
    write(root, "devflow/tree/02-capability.done/02.1-orphan.wip-ghost.md", cardText("02.1"));
    commit(root, "ghost closed claim");
    const result = run(root); ok(result);
    assert.equal(integrityItemLines(result.stdout, 1).length, 0, result.stdout);
    assert.equal(integrityItemLines(result.stdout, 3).length, 1, result.stdout);
  });

  await t.test("item 4 dependency body", () => {
    const root = makeRepo(t);
    write(root, "devflow/tree/02-capability.done/02.1-dependency.done.md", cardText("02.1", { depends: "02.9 prose" }));
    commit(root, "closed dependency history");
    const result = run(root); ok(result);
    assert.equal(integrityItemLines(result.stdout, 4).length, 0, result.stdout);
  });

  await t.test("item 8 claimant author", () => {
    const root = makeRepo(t);
    write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n");
    write(root, "devflow/users/other/HANDOFF.md", "");
    write(root, "devflow/users/other/digest.md", "none\n");
    write(root, "devflow/tree/02-capability.done/02.1-author.wip-other.md", cardText("02.1"));
    commit(root, "mismatched closed author");
    const result = run(root); ok(result);
    assert.equal(integrityItemLines(result.stdout, 8).length, 0, result.stdout);
    assert.equal(integrityItemLines(result.stdout, 3).length, 1, result.stdout);
  });

  await t.test("item 9 pending fields", () => {
    const root = makeRepo(t);
    write(root, "devflow/tree/02-capability.done/02.1-fields.md", cardText("02.1", { omit: ["Approval", "Review"] }));
    commit(root, "closed pending history");
    const result = run(root); ok(result);
    assert.equal(integrityItemLines(result.stdout, 9).length, 0, result.stdout);
    assert.equal(integrityItemLines(result.stdout, 3).length, 1, result.stdout);
  });

  await t.test("item 13 remote evidence", () => {
    const root = makeRepo(t);
    const card = "devflow/tree/02-capability.done/02.1-evidence.wip-jmp.md";
    write(root, card, `${cardText("02.1")}2026-08-20T00:00:00Z remote evidence check: check-json: ${JSON.stringify("https://example.test/actual")}; verdict: unrun; detail-json: ""\n`);
    const checkpoint = commit(root, "jmp 02.1 wip: evidence-wait");
    write(root, "devflow/journal.md", `2026-08-20T00:00:01Z evidence-wait: card-json: ${JSON.stringify(card)}; checkpoint: 02.1 wip: ${checkpoint}; check-json: ${JSON.stringify("https://example.test/different")}\n`);
    commit(root, "jmp boundary — closed evidence");
    const result = run(root); ok(result);
    assert.equal(integrityItemLines(result.stdout, 13).length, 0, result.stdout);
    assert.equal(integrityItemLines(result.stdout, 3).length, 1, result.stdout);
  });
});

test("R1 a done card body in a closed folder is never opened", (t) => {
  const root = makeRepo(t);
  const relative = "devflow/tree/02-capability.done/02.1-history.done.md";
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.from([0xff, 0xfe, 0xfd]));
  commit(root, "closed opaque history");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity:", "blocking=0");
});

test("R2 unstaged delete plus untracked done card is a bounded claim-done move", (t) => {
  const root = makeRepo(t);
  const claimed = writeClaim(root);
  const done = claimed.replace(".wip-jmp.md", ".done.md");
  fs.renameSync(path.join(root, ...claimed.split("/")), path.join(root, ...done.split("/")));
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=finish-boundary", `card=${claimed}`);
  assertFragment(result.stdout, "transition: kind=finish-boundary", `path=${done}`);
  assertFragment(result.stdout, "transition: kind=finish-boundary", "case=claim-done-move");
});

test("R2 a similar untracked filename is not guessed to be a claim-done move", (t) => {
  const root = makeRepo(t);
  const claimed = writeClaim(root);
  fs.rmSync(path.join(root, ...claimed.split("/")));
  write(root, "devflow/tree/02-capability/02.2-fixture.done.md", cardText("02.2"));
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("case=claim-done-move"), false, result.stdout);
});

test("R2 a staged canonical claim-done rename remains recognized", (t) => {
  const root = makeRepo(t);
  const claimed = writeClaim(root);
  const done = claimed.replace(".wip-jmp.md", ".done.md");
  git(root, "mv", claimed, done);
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=finish-boundary", "case=claim-done-move");
});

test("R2 a line-ending-only byte change is not a canonical claim-done move", (t) => {
  const root = makeRepo(t);
  const claimed = writeClaim(root);
  const done = claimed.replace(".wip-jmp.md", ".done.md");
  const text = read(root, claimed);
  fs.renameSync(path.join(root, ...claimed.split("/")), path.join(root, ...done.split("/")));
  fs.writeFileSync(path.join(root, ...done.split("/")), text.replace(/\n/g, "\r\n"), "utf8");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("case=claim-done-move"), false, result.stdout);
});

test("R2 a staged rename with a changed card body is not a canonical claim-done move", (t) => {
  const root = makeRepo(t);
  const claimed = writeClaim(root);
  const done = claimed.replace(".wip-jmp.md", ".done.md");
  git(root, "mv", claimed, done);
  fs.appendFileSync(path.join(root, ...done.split("/")), "changed after rename\n", "utf8");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("case=claim-done-move"), false, result.stdout);
});

test("Phase 5B E2 evidence-finalizing accepts an interrupted done rename matching the HEAD claimed card", (t) => {
  const { root, claimed, done } = prepareFinalizingMove(t);
  const result = run(root); ok(result);
  assert.equal(integrityItemLines(result.stdout, 13).length, 0, result.stdout);
  assertFragment(result.stdout, "transition: kind=finish-boundary", `card=${claimed}`);
  assertFragment(result.stdout, "transition: kind=finish-boundary", `path=${done}`);
});

test("Phase 5B E2 evidence-finalizing still blocks damaged done bytes", (t) => {
  const { root } = prepareFinalizingMove(t, { damage: true });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=13");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=finalizing-done-resolves-1");
  assert.equal(result.stdout.includes("case=claim-done-move"), false, result.stdout);
});

test("Phase 5B E2 evidence-finalizing keeps checkpoint subject validation", (t) => {
  const { root } = prepareFinalizingMove(t, { checkpointSubject: "jmp wrong evidence checkpoint" });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=13");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=checkpoint-subject");
});

test("Phase 5B E2 evidence-finalizing keeps checkpoint path validation", (t) => {
  const { root } = prepareFinalizingMove(t, { checkpointTouchesCard: false });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=13");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=checkpoint-path");
});

test("Phase 5B E2 evidence-finalizing keeps checkpoint check-json validation", (t) => {
  const { root } = prepareFinalizingMove(t, { journalCheck: "https://example.test/different" });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "integrity: kind=blocking", "item=13");
  assertFragment(result.stdout, "integrity: kind=blocking", "reason=checkpoint-check-json");
});

test("R3 unrelated source changes do not hide an interrupted canonical output", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/tree/02-capability/verify.md", "# Verification\nFailure history:\nNone.\n");
  write(root, "devflow/journal.md", "2026-08-20T00:00:00Z jmp: interrupted fixture\n");
  write(root, "src/x.js", "export const x = 1;\n");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=interrupted", 'paths=["devflow/journal.md","devflow/tree/02-capability/verify.md"]');
  assertFragment(result.stdout, "report:", 'uncommittedUnattributed=["devflow/journal.md","devflow/tree/02-capability/verify.md","src/x.js"]');
});

test("R3 an unrelated source change alone does not invent an interrupted transition", (t) => {
  const root = makeRepo(t);
  write(root, "src/x.js", "export const x = 1;\n");
  const result = run(root); ok(result);
  assert.equal(hasKind(result.stdout, "transition", "interrupted"), false, result.stdout);
});

test("R4 capability filtering keeps global judgment and adds only requested detail", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha", "Beta"] });
  write(root, "devflow/tree/02-Alpha/02.1-alpha.md", cardText("02.1"));
  write(root, "devflow/tree/03-Beta/03.1-beta.md", cardText("03.1"));
  commit(root, "jmp split — two capabilities");
  write(root, "outside.txt", "global diff\n");
  const full = run(root); ok(full);
  const narrowed = run(root, "--capability", "2"); ok(narrowed);
  assert.doesNotMatch(full.stdout, /^baseline: capability=/m,
    "an unfiltered entry call must not compute or emit per-capability baseline detail");
  const narrowedWithoutDetail = narrowed.stdout.split(/\r?\n/)
    .filter((line) => !line.startsWith("baseline: capability="))
    .join("\n");
  assert.ok(Buffer.byteLength(narrowedWithoutDetail) <= Buffer.byteLength(full.stdout),
    `${Buffer.byteLength(narrowedWithoutDetail)} > ${Buffer.byteLength(full.stdout)}`);
  assert.match(narrowed.stdout, /^state: .* narrow=2(?:\s|$)/m);
  assert.match(narrowed.stdout, /^baseline: capability=2(?:\s|$)/m);
  assert.doesNotMatch(narrowed.stdout, /^baseline: capability=3(?:\s|$)/m);
  assert.match(narrowed.stdout, /02\.1-alpha\.md/);
  assert.doesNotMatch(narrowed.stdout, /03\.1-beta\.md/);
  assertFragment(narrowed.stdout, "git:", "uncommittedUnattributed");
  assertFragment(narrowed.stdout, "report:", "uncommittedUnattributed");
});

test("R4 a capability filter with nothing to reduce reports narrow=none and still supplies detail", (t) => {
  const root = makeRepo(t);
  const full = run(root); ok(full);
  const narrowed = run(root, "--capability", "1"); ok(narrowed);
  assert.match(narrowed.stdout, /^state: .* narrow=none(?:\s|$)/m);
  assert.match(narrowed.stdout, /^baseline: capability=1(?:\s|$)/m);
});

test("R4 capability filtering projects aggregate blocked facts and counts to the selected capability", (t) => {
  const root = makeRepo(t, { capabilities: ["Alpha", "Beta"] });
  write(root, "devflow/users/other/owner.md", "id: other\ngit: Other, other@example.test\n");
  write(root, "devflow/users/other/HANDOFF.md", "");
  write(root, "devflow/tree/02-Alpha/02.1-prerequisite.wip-other.md", cardText("02.1"));
  write(root, "devflow/tree/02-Alpha/02.2-work.md", cardText("02.2", { depends: "02.1" }));
  write(root, "devflow/tree/03-Beta/03.1-prerequisite.wip-other.md", cardText("03.1"));
  write(root, "devflow/tree/03-Beta/03.2-work.md", cardText("03.2", { depends: "03.1" }));
  commit(root, "jmp split — two blocked capabilities");
  const result = run(root, "--capability", "2"); ok(result);
  const blocked = result.stdout.split(/\r?\n/).find((line) => line.startsWith("blocked: kind=dependencies"));
  assert.ok(blocked, result.stdout);
  assert.match(blocked, /cards=\["02\.2"\]/);
  assert.doesNotMatch(blocked, /03\.[12]/);
  assert.match(result.stdout, /^claim: mine=0 others=1$/m);
  assert.match(result.stdout, /^baseline: expected=1 /m);
  assert.match(result.stdout, /^ready: count=1$/m);
});

test("R4 the consumerless --card surface is rejected", (t) => {
  const result = run(makeRepo(t), "--card", "devflow/tree/02-capability/02.1-fixture.md");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown option --card/);
  assert.equal(result.stdout, "");
});

test("an actual open card makes baseline verifiedFreshness report the open-card reason", async (t) => {
  for (const [status, expected] of [["", true], [".done", false]]) {
    await t.test(status === "" ? "open card" : "done card negative control", () => {
      const root = makeRepo(t, { capabilities: ["capability"] });
      write(root, `devflow/tree/02-capability/02.1-fixture${status}.md`, cardText("02.1"));
      commit(root, `jmp ${status === "" ? "open" : "closed"} card freshness`);
      const result = run(root, "--capability", "2"); ok(result);
      const detail = result.stdout.split(/\r?\n/)
        .find((line) => line.startsWith("baseline: capability=2 "));
      assert.ok(detail, result.stdout);
      assert.equal(detail.includes('verifiedFreshness={"value":"hypothesis","reasons":') && detail.includes("open-card"), expected, detail);
    });
  }
});

test("R5 digest lag is a ready fact and does not interrupt a current claim", (t) => {
  const root = makeRepo(t);
  const marker = git(root, "rev-parse", "HEAD");
  write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
  commit(root, "jmp boundary — digest marker");
  git(root, "config", "user.name", "Other");
  git(root, "config", "user.email", "other@example.test");
  write(root, "other.txt", "other\n");
  commit(root, "other change");
  git(root, "config", "user.name", "Jmp");
  git(root, "config", "user.email", "jmp@example.test");
  write(root, "mine.txt", "mine\n");
  commit(root, "change without room prefix");
  const card = writeClaim(root, { commitSubject: "jmp 02.1 claim" });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=ancestor");
  assertFragment(result.stdout, "ready: kind=digest-behind", "behind=4");
  assertFragment(result.stdout, "ready: kind=digest-behind", "others=2");
  assertFragment(result.stdout, "claim: kind=mine", `path=${card}`);
  assert.equal(nextOf(result.stdout), "claim.mine", result.stdout);
});

function otherCommit(root, subject) {
  git(root, "config", "user.name", "Other");
  git(root, "config", "user.email", "other@example.test");
  write(root, `${subject.replace(/\W/g, "-")}.txt`, "other\n");
  const hash = commit(root, subject);
  git(root, "config", "user.name", "Jmp");
  git(root, "config", "user.email", "jmp@example.test");
  return hash;
}

// A marker that names no commit here is not a distance of zero and not a distance of
// everything: with no anchor there is no range, so no history fact may be reported at all.
for (const [label, makeMarker] of [
  ["an invented object id", () => "deadbeef".repeat(5)],
  ["an abbreviation of a real commit", (root) => git(root, "rev-parse", "--short=12", "HEAD")],
  ["a hex string of no object-id length", () => "a".repeat(48)],
  ["an empty marker", () => ""],
]) {
  test(`R5 an unresolvable digest marker (${label}) reports no distance and no history`, (t) => {
    const root = makeRepo(t);
    otherCommit(root, "other change");
    const marker = makeMarker(root);
    write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
    commit(root, "jmp boundary — unresolvable digest marker");
    const result = run(root); ok(result);
    assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker || "invalid"}`);
    assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=unresolved");
    assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
    assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
  });
}

test("R5 a digest marker that exists off the integration line is a non-ancestor fact", (t) => {
  const root = makeRepo(t);
  git(root, "checkout", "-qb", "side");
  write(root, "side.txt", "side\n");
  const marker = commit(root, "side-only");
  git(root, "checkout", "-q", "main");
  otherCommit(root, "other change");
  write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
  commit(root, "jmp boundary — divergent digest marker");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=non-ancestor");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
});

test("R5 a none digest marker counts from the first integration commit", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/users/jmp/digest.md", "none\n");
  commit(root, "jmp boundary — initial digest marker");
  const count = git(root, "rev-list", "--count", "HEAD");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", "marker=none");
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=none");
  assertFragment(result.stdout, "ready: kind=digest-behind", `behind=${count}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "others=0");
});

// Removing one loose commit object in the middle of the integration history is the
// deterministic seam for "Git could not answer": rev-parse and status still work, and every
// history walk that has to cross that point exits with a status that is neither 0 nor 1.
function breakHistoryWalk(root, hash) {
  const object = path.join(root, ".git", "objects", hash.slice(0, 2), hash.slice(2));
  assert.ok(fs.existsSync(object), `the seam needs a loose object at ${object}`);
  fs.rmSync(object);
}

test("R5 a merge-base Git cannot answer is unavailable, not a non-ancestor verdict", (t) => {
  const root = makeRepo(t);
  const unwalkable = otherCommit(root, "other change");
  write(root, "keep.txt", "keep\n");
  const marker = commit(root, "jmp tip");
  write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
  commit(root, "jmp boundary — digest marker");
  breakHistoryWalk(root, unwalkable);
  assert.equal(gitTry(root, "merge-base", "--is-ancestor", marker, "main").status, 128, "the seam must make Git decline, not answer 1");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=unavailable");
  assertFragment(result.stdout, "ready: kind=digest-behind", "reason=merge-base-unavailable");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "non-ancestor");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
});

test("R5 a history walk Git cannot run is unavailable, not a suppressed zero", (t) => {
  const root = makeRepo(t);
  const unwalkable = otherCommit(root, "other change");
  write(root, "devflow/users/jmp/digest.md", "none\n");
  commit(root, "jmp boundary — initial digest marker");
  breakHistoryWalk(root, unwalkable);
  assert.equal(gitTry(root, "rev-list", "--count", "main").status, 128, "the seam must make the count decline");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", "marker=none");
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=unavailable");
  assertFragment(result.stdout, "ready: kind=digest-behind", "reason=history-unavailable");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
});

test("R5 a digest history that will not decode is unavailable, not a dead tool", (t) => {
  const root = makeRepo(t);
  const marker = git(root, "rev-parse", "HEAD");
  write(root, "other.txt", "other\n");
  git(root, "add", "-A");
  // Git transcodes an identity it takes from config, so the undecodable author name goes in
  // through plumbing, with fixed timestamps so the fixture is the same object every run.
  const created = execFileSync("git", ["hash-object", "-t", "commit", "-w", "--stdin"], {
    cwd: root,
    encoding: "utf8",
    input: Buffer.concat([
      Buffer.from(`tree ${git(root, "write-tree")}\nparent ${marker}\nauthor `),
      Buffer.from([0xff, 0xfe]),
      Buffer.from(" Other <other@example.test> 1700000000 +0000\n"
        + "committer Jmp <jmp@example.test> 1700000000 +0000\n\nother change\n"),
    ]),
  }).trim();
  git(root, "update-ref", "refs/heads/main", created);
  git(root, "reset", "-q", "--hard", "main");
  write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
  commit(root, "jmp boundary — digest marker");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=unavailable");
  assertFragment(result.stdout, "ready: kind=digest-behind", "reason=history-undecodable");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
});

// A status-zero Git result is evidence only in Git's own grammar, and no repository can
// print a malformed count on purpose — so the two grammars are exercised directly.
test("R5 the digest count reads only a canonical non-negative decimal integer", async () => {
  const { digestDistance } = await registry();
  assert.equal(digestDistance("3\n"), 3, "what rev-list --count actually prints");
  assert.equal(digestDistance("0\n"), 0);
  for (const bad of ["", "   ", "\n", "3", " 3\n", "3 \n", "3\n\n", "-1\n", "1.5\n", "0x10\n", "007\n", "+1\n", "1 2\n", "1e3\n", "three\n"]) {
    assert.equal(digestDistance(bad), null, `${JSON.stringify(bad)} is not a count`);
  }
});

// Measured, not assumed: `git log -z --format=%an%x00%ae%x00%s` terminates every record with
// NUL and adds nothing after the last one, so the only tail to remove is that final empty
// field — and an empty range prints nothing at all.
test("R5 the digest history reads exact triples closed by one trailing delimiter", async () => {
  const { digestRecords } = await registry();
  assert.deepEqual(digestRecords(""), [], "what an empty range actually prints");
  assert.deepEqual(digestRecords("A\0a@x\0s\0"), [["A", "a@x", "s"]]);
  assert.deepEqual(digestRecords("A\0a@x\0\0"), [["A", "a@x", ""]], "an empty subject is a field, not a gap");
  assert.deepEqual(digestRecords("A\0a@x\0s\0B\0b@y\0\0"), [["A", "a@x", "s"], ["B", "b@y", ""]]);
  for (const bad of ["A\0a@x\0s", "A\0a@x\0s\0B\0b@y\0", "A\0a@x\0s\0tail", "A\0a@x\0s\0\n"]) {
    assert.equal(digestRecords(bad), null, `${JSON.stringify(bad)} is not a record set`);
  }
});

test("R5 an empty-subject commit keeps the records aligned and counts as unseen history", (t) => {
  const root = makeRepo(t);
  const marker = git(root, "rev-parse", "HEAD");
  write(root, "devflow/users/jmp/digest.md", `${marker}\n`);
  commit(root, "jmp boundary — digest marker");
  git(root, "commit", "-q", "--allow-empty", "-m", "jmp 02.1 wip: one");
  // mine by name and email and with no id prefix to start, so it is one unseen commit — and
  // the record whose empty subject used to be dropped, shifting every field after it
  git(root, "commit", "-q", "--allow-empty", "--allow-empty-message", "-m", "");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", `marker=${marker}`);
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=ancestor");
  assertFragment(result.stdout, "ready: kind=digest-behind", "behind=3");
  assertFragment(result.stdout, "ready: kind=digest-behind", "others=1");
});

// One seam cannot fail rev-list and log separately, so the rule that each command's own
// status gates its own output is sealed against the deployed source instead.
test("R5 digestLag parses no Git output before that command's status is checked", () => {
  const body = /\nfunction digestLag\(snapshot\) \{\n([\s\S]*?)\n\}\n/.exec(fs.readFileSync(TOOL, "utf8"))?.[1];
  assert.ok(body, "digestLag must be findable in the deployed tool");
  for (const [command, guard] of [
    ["merge-base", /ancestry !== 0 && ancestry !== 1/],
    ["rev-list", /counted\.status !== 0/],
    ["log", /raw\.status !== 0/],
  ]) assert.match(body, guard, `${command}: its own status must gate its own output`);
  assert.match(body, /catch \{\n\s+return unavailable\("history-undecodable"\)/,
    "output that will not decode is a bounded fact, not a dead tool");
  assert.match(body, /behind === null \|\| records === null\) return unavailable\("history-unreadable"\)/,
    "output outside Git's grammar is a bounded fact, not a count");
});

test("R5 an unresolved integration ref is unavailable, not a count against local HEAD", (t) => {
  const root = makeRepo(t);
  write(root, "devflow/project/arch.md", arch().replace("integration: main", "integration: never-created"));
  write(root, "devflow/users/jmp/digest.md", "none\n");
  otherCommit(root, "other change");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "ready: kind=digest-behind", "marker=none");
  assertFragment(result.stdout, "ready: kind=digest-behind", "resolution=unavailable");
  assertFragment(result.stdout, "ready: kind=digest-behind", "reason=integration-ref-unresolved");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "behind=");
  assertNoFragment(result.stdout, "ready: kind=digest-behind", "others=");
});

test("R6 final-task boundary reports missing carry and claim exposes carry absence", (t) => {
  const root = makeRepo(t);
  const card = writeClaim(root, { commitSubject: "jmp 02.1 fixture card", progress: "2026-08-20T00:00:00Z implementation complete" });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=finish-boundary", 'missing=["carry"]');
  assertFragment(result.stdout, "claim: kind=mine", `path=${card}`);
  assertFragment(result.stdout, "claim: kind=mine", "carry=absent");
});

test("R6 a final carry line makes boundary completeness explicit", (t) => {
  const root = makeRepo(t);
  writeClaim(root, {
    commitSubject: "jmp 02.1 fixture card",
    progress: "2026-08-20T00:00:00Z implementation complete\n2026-08-20T00:01:00Z carry: exact trap",
  });
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=finish-boundary", "missing=[]");
  assertFragment(result.stdout, "claim: kind=mine", "carry=present");
});

test("R6 a stale HANDOFF remains a repairable boundary passenger", (t) => {
  const root = makeRepo(t);
  const card = writeClaim(root, {
    commitSubject: "jmp 02.1 fixture card",
    progress: "2026-08-20T00:00:00Z implementation complete\n2026-08-20T00:01:00Z carry: exact trap",
  });
  write(root, "devflow/users/jmp/HANDOFF.md", `# HANDOFF · 2000-01-01T00:00:00Z\n## Next single step\n${card}\n`);
  const result = run(root); ok(result);
  assertFragment(result.stdout, "transition: kind=finish-boundary", 'missing=["handoff"]');
  assertFragment(result.stdout, "handoff:", "stale=1");
});

test("R6 capability closure projects only non-none carry facts", (t) => {
  const root = makeRepo(t, { capabilities: ["capability"] });
  const first = "devflow/tree/02-capability/02.1-first.done.md";
  const second = "devflow/tree/02-capability/02.2-second.done.md";
  write(root, first, cardText("02.1", { progress: "2026-08-20T00:00:00Z implemented\n2026-08-20T00:01:00Z carry: exact trap" }));
  write(root, second, cardText("02.2", { progress: "2026-08-20T00:00:00Z implemented\n2026-08-20T00:01:00Z carry: none" }));
  commit(root, "jmp completed capability children");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "layer: kind=children-done", "carry=1");
  assertFragment(result.stdout, "layer: kind=children-done", `carryFacts=[{\"card\":\"${first}\",\"fact\":\"exact trap\"}]`);
});

test("current claim origin is derived from the card-creation commit's deleted request", (t) => {
  const root = makeRepo(t);
  const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("exact request")}`;
  write(root, "devflow/journal.md", `${request}\n`);
  commit(root, "jmp boundary — request recorded");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — request planned");
  const claimed = pending.replace(".md", ".wip-jmp.md");
  git(root, "mv", pending, claimed);
  commit(root, "jmp 02.1 claim");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", `origin=${JSON.stringify(`journal:${request}`)}`);
});

function claimFromMarkerOnlyBundle(t, sourceSetup) {
  const root = makeRepo(t);
  const { source, retainedJournal = "" } = sourceSetup(root);
  const firstMarker = `2026-08-20T00:01:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(source)}`;
  const secondMarker = `2026-08-20T00:02:00Z layer opening: parent: devflow/tree/02-capability; children: 02.1+02.2; source-json: ${JSON.stringify(source)}`;
  write(root, "devflow/journal.md", `${retainedJournal}${firstMarker}\n${secondMarker}\n`);
  commit(root, "jmp split — marker-only bundle opened");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", retainedJournal);
  commit(root, "jmp split — marker-only bundle planned");
  const claimed = pending.replace(".md", ".wip-jmp.md");
  git(root, "mv", pending, claimed);
  commit(root, "jmp 02.1 claim");
  return { root, firstMarker };
}

const MARKER_ONLY_ORIGIN_SCENES = [
  ["verify source", (root) => {
    capabilityVerify(root, "devflow/tree/02-capability/verify.md", {
      failures: "- source id: 1; timestamp: 2026-08-20T00:00:00Z; failure: exact source; routing: pending",
    });
    return { source: "verify:devflow/tree/02-capability/verify.md#Failure history@1" };
  }],
  ["core source", () => ({ source: "core:devflow/project/product.md#Capabilities" })],
  ["journal source with its request retained outside the planning diff", () => {
    const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("retained request")}`;
    return { source: `journal:${request}`, retainedJournal: `${request}\n` };
  }],
];

for (const [name, sourceSetup] of MARKER_ONLY_ORIGIN_SCENES) {
  test(`Phase 5B E1 two marker-only lines sharing one ${name} are one origin bundle`, (t) => {
    const { root, firstMarker } = claimFromMarkerOnlyBundle(t, sourceSetup);
    const result = run(root); ok(result);
    assertFragment(result.stdout, "report:", `origin=${JSON.stringify(`journal:${firstMarker}`)}`);
    assert.doesNotMatch(result.stdout, /originReason=/);
  });
}

test("Phase 5B E1 one deleted request and its same-source layer markers are one origin bundle", (t) => {
  const root = makeRepo(t);
  const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("exact request")}`;
  const source = `journal:${request}`;
  const rootMarker = `2026-08-20T00:01:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(source)}`;
  const childMarker = `2026-08-20T00:02:00Z layer opening: parent: devflow/tree/02-capability; children: 02.1+02.2; source-json: ${JSON.stringify(source)}`;
  write(root, "devflow/journal.md", `${request}\n${rootMarker}\n${childMarker}\n`);
  commit(root, "jmp split — request layers opened");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — request planned");
  const claimed = pending.replace(".md", ".wip-jmp.md");
  git(root, "mv", pending, claimed);
  commit(root, "jmp 02.1 claim");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", `origin=${JSON.stringify(source)}`);
  assert.doesNotMatch(result.stdout, /originReason=/);
});

test("Phase 5B E1 genuinely different deleted origin identities remain unknown", (t) => {
  const root = makeRepo(t);
  const first = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("first request")}`;
  const second = `2026-08-20T00:00:01Z maintenance routing pending: request-json: ${JSON.stringify("second request")}`;
  const firstMarker = `2026-08-20T00:01:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify(`journal:${first}`)}`;
  const secondMarker = `2026-08-20T00:02:00Z layer opening: parent: devflow/tree/02-capability; children: 02.1; source-json: ${JSON.stringify(`journal:${second}`)}`;
  write(root, "devflow/journal.md", `${first}\n${second}\n${firstMarker}\n${secondMarker}\n`);
  commit(root, "jmp split — different origins opened");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — different origins planned");
  const claimed = pending.replace(".md", ".wip-jmp.md");
  git(root, "mv", pending, claimed);
  commit(root, "jmp 02.1 claim");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "origin=unknown");
  assertFragment(result.stdout, "report:", "originReason=multiple-matches");
});

test("Phase 5B E1 a single deleted layer marker keeps its exact legacy origin", (t) => {
  const root = makeRepo(t);
  const marker = `2026-08-20T00:01:00Z layer opening: parent: devflow/tree; children: 02; source-json: ${JSON.stringify("core:devflow/project/product.md#Capabilities")}`;
  write(root, "devflow/journal.md", `${marker}\n`);
  commit(root, "jmp split — legacy layer opened");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — legacy layer planned");
  const claimed = pending.replace(".md", ".wip-jmp.md");
  git(root, "mv", pending, claimed);
  commit(root, "jmp 02.1 claim");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", `origin=${JSON.stringify(`journal:${marker}`)}`);
});

test("Phase 5B E1 shallow history remains explicitly unknown", (t) => {
  const root = makeRepo(t);
  writeClaim(root);
  fs.writeFileSync(path.join(root, ".git", "shallow"), `${git(root, "rev-parse", "HEAD")}\n`, "utf8");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "origin=unknown");
  assertFragment(result.stdout, "report:", "originReason=shallow-history");
});

test("current claim origin is none when its creation commit deleted no canonical input", (t) => {
  const root = makeRepo(t);
  writeClaim(root);
  const result = run(root); ok(result);
  assertFragment(result.stdout, "report:", "origin=none");
});

test("S2 an old product verify without event sections emits each existing event kind once", (t) => {
  const root = makeRepo(t, { brownfield: "no" });
  const revisions = currentRevisions(root);
  const oldVerify = `# Verification · product\nProduct revision: ${revisions.productRevision}\nVerification revision: ${revisions.verificationRevision}\nCode revision: ${revisions.codeRevision}\nCapability revision: not-applicable\nVerdict: pass\nFailure history:\nNone.\n`;
  const relative = "devflow/tree/verify.md";
  write(root, relative, oldVerify);
  commit(root, "jmp old capability verify");
  const result = run(root); ok(result);
  const events = result.stdout.split(/\r?\n/).filter((line) => line.startsWith("event: kind=new"));
  assert.equal(events.filter((line) => line.includes("role=Audit")).length, 1, result.stdout);
  assert.equal(events.filter((line) => line.includes("role=Retrospective")).length, 1, result.stdout);
  const completed = "- source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 0 findings · 0 adopted · routing: none";
  write(root, relative, `${oldVerify}## Audit\n${completed}\n## Retrospective\n${completed}\n`);
  commit(root, "jmp old capability events complete");
  const negative = run(root); ok(negative);
  assert.equal(negative.stdout.split(/\r?\n/).filter((line) => line.startsWith("event: kind=new")).length, 0, negative.stdout);
});

test("S3 binary revision hashing uses the exact ls-tree bytes without a shell pipeline", async (t) => {
  const root = makeRepo(t);
  const paths = ["devflow/project/arch.md", "devflow/project/code-style.md", "devflow/project/glossary.md"];
  const tree = execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", "HEAD", "--", ...paths], { cwd: root });
  const nodeHash = execFileSync("git", ["hash-object", "--stdin"], { cwd: root, input: tree, encoding: "utf8" }).trim();
  const { nativeBinaryHash } = await registry();
  assert.equal(await nativeBinaryHash(root, "HEAD", paths), nodeHash);
  const changedHash = execFileSync("git", ["hash-object", "--stdin"], {
    cwd: root, input: Buffer.concat([tree, Buffer.from([0])]), encoding: "utf8",
  }).trim();
  assert.notEqual(changedHash, nodeHash);

  const unusual = ["src/hash/space & shell.txt", "src/hash/\uB2A5\uB825-#-revision.txt"];
  for (const relative of unusual) write(root, relative, `// ${relative}\n`);
  commit(root, "jmp fixture — unusual revision paths");
  const unusualTree = execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", "HEAD", "--", ...unusual], { cwd: root });
  const unusualHash = execFileSync("git", ["hash-object", "--stdin"], { cwd: root, input: unusualTree, encoding: "utf8" }).trim();
  assert.equal(await nativeBinaryHash(root, "HEAD", unusual), unusualHash);
});

// ---------------------------------------------------------------------------
// D-1 approval freshness: the plan bytes above exactly one `## Progress log`
// heading are the approval's subject; append-only execution bytes below it are not.
// ---------------------------------------------------------------------------

test("D1 an unstaged Progress-only append keeps approval effective", (t) => {
  const root = makeRepo(t);
  const card = writePending(root);
  fs.appendFileSync(path.join(root, card), '2026-01-03T00:00:00Z completion signal result: verdict: pass; detail-json: ""\n');
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=ready", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=ready", "approval=effective");
});

test("D1 a staged Progress-only append keeps approval effective", (t) => {
  const root = makeRepo(t);
  const card = writePending(root);
  fs.appendFileSync(path.join(root, card), '2026-01-03T00:00:00Z review result: verdict: objections; detail-json: ""\n');
  git(root, "add", "--", card);
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=ready", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=ready", "approval=effective");
});

test("D1 one changed plan byte above the heading stays invalid", (t) => {
  const root = makeRepo(t);
  const card = writePending(root);
  write(root, card, cardText("02.1").replace("Forbidden: none", "Forbidden: nothing"));
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=approval-invalid", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-invalid", 'invalidity=["card-diff"]');
});

test("D1 a missing Progress log heading fails closed", (t) => {
  const root = makeRepo(t);
  const card = writePending(root);
  write(root, card, cardText("02.1").replace("## Progress log\n", ""));
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=approval-invalid", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-invalid", 'invalidity=["progress-heading"]');
});

test("D1 a duplicated Progress log heading fails closed", (t) => {
  const root = makeRepo(t);
  const card = writePending(root);
  write(root, card, `${cardText("02.1")}## Progress log\n2026-01-04T00:00:00Z second section\n`);
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=approval-invalid", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-invalid", 'invalidity=["progress-heading"]');
});

// Adopted finding 2: a card's fields live above its one `## Progress log` heading. Prose
// below it that happens to look like `Field: value` is the task's record, not the plan.
test("D1 Progress prose shaped like plan fields does not override the plan", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.2-fixture.md";
  write(root, card, cardText("02.2", {
    depends: "02.1",
    approval: "pending",
    review: "required",
    progress: [
      "2026-01-02T00:00:00Z implemented exact fixture",
      "Approval: 2026-01-01T00:00:00Z; parallel: none",
      "Depends: none",
      "Review: waived",
    ].join("\n"),
  }));
  commit(root, "jmp split — fixture");
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=approval-pending", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-pending", 'depends=["02.1"]');
});

test("D1 a Review line only below the heading leaves the card legacy", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, card, cardText("02.1", {
    omit: ["Review"],
    progress: "2026-01-02T00:00:00Z implemented exact fixture\nReview: waived",
  }));
  commit(root, "jmp split — fixture");
  const result = run(root);
  ok(result);
  assertFragment(result.stdout, "ready: kind=needs-normalization", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=needs-normalization", 'missingFields=["Review"]');
});

// Re-audit finding: a malformed card can be committed clean, so it never enters the changed
// set and never reaches the side-by-side plan comparison. The boundary is broken either way,
// so the reason has to travel with the card itself.
function malformedCard(number, headings) {
  const plan = [
    `# ${number} fixture card`,
    "Coordinates: Fixture ▸ foundation",
    "Identity: Fixture identity.",
    "Destination: fixture becomes true",
    "Why: fixture needs it",
    "Forbidden: none",
    "Depends: none",
    "Read first: none",
    "Completion signal: node --test",
    "Approval: 2026-01-01T00:00:00Z; parallel: none",
    "Review: required",
    "",
  ];
  const prose = [
    "2026-01-02T00:00:00Z implemented exact fixture",
    "Approval: 2026-01-03T00:00:00Z; parallel: none",
    "Depends: 02.9",
    "Review: waived",
    "",
  ];
  if (headings === 0) return [...plan, ...prose].join("\n");
  return [...plan, "## Progress log", ...prose, "## Progress log", "2026-01-04T00:00:00Z second section", ""].join("\n");
}

test("D1 a clean committed card with no Progress log heading is invalid, not ready", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, card, malformedCard("02.1", 0));
  commit(root, "jmp split — fixture");
  const result = run(root);
  ok(result);
  assert.ok(!hasKind(result.stdout, "ready", "ready"), "a card with no plan boundary is never ready");
  assertFragment(result.stdout, "ready: kind=approval-invalid", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-invalid", 'invalidity=["progress-heading"]');
});

test("D1 a clean committed card with two Progress log headings is invalid, not ready", (t) => {
  const root = makeRepo(t);
  const card = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, card, malformedCard("02.1", 2));
  commit(root, "jmp split — fixture");
  const result = run(root);
  ok(result);
  assert.ok(!hasKind(result.stdout, "ready", "ready"), "a card with two plan boundaries is never ready");
  assertFragment(result.stdout, "ready: kind=approval-invalid", `file=${card}`);
  assertFragment(result.stdout, "ready: kind=approval-invalid", 'invalidity=["progress-heading"]');
  // Fields still come from above the first heading, so the prose below never rides along.
  assertFragment(result.stdout, "ready: kind=approval-invalid", "depends=[]");
});

// D7: the request a card came from is also the partition it belongs to. One planning commit
// consumes one canonical input and creates several cards; the reader of any one of them needs
// the exact paths of the others that are still current, and nothing wider.
function candidateLine(output, zone, relative) {
  const key = zone === "claim" ? `path=${relative} ` : `file=${relative} `;
  const line = output.split(/\r?\n/).find((item) => item.startsWith(`${zone}: kind=`) && item.includes(key));
  assert.ok(line, `missing ${zone} candidate for ${relative}\n${output}`);
  return line;
}

function sameOriginPlan(t) {
  const root = makeRepo(t);
  const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("one request, three cards")}`;
  const other = `2026-08-20T00:00:01Z maintenance routing pending: request-json: ${JSON.stringify("another request")}`;
  write(root, "devflow/journal.md", `${request}\n${other}\n`);
  commit(root, "jmp boundary — two requests recorded");

  const mineSource = "devflow/tree/02-capability/02.1-first.md";
  const pending = "devflow/tree/02-capability/02.2-second.md";
  const closingSource = "devflow/tree/02-capability/02.3-third.md";
  write(root, mineSource, cardText("02.1"));
  write(root, pending, cardText("02.2"));
  write(root, closingSource, cardText("02.3"));
  write(root, "devflow/journal.md", `${other}\n`);
  commit(root, "jmp split — first request planned");

  const foreign = "devflow/tree/02-capability/02.4-fourth.md";
  write(root, foreign, cardText("02.4"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — second request planned");

  const claimed = mineSource.replace(".md", ".wip-jmp.md");
  const closed = closingSource.replace(".md", ".done.md");
  git(root, "mv", mineSource, claimed);
  git(root, "mv", closingSource, closed);
  commit(root, "jmp 02.1 claim");
  return { root, request, other, claimed, pending, closed, foreign };
}

test("D7 every current candidate of one planning commit carries that origin and its exact siblings", (t) => {
  const scene = sameOriginPlan(t);
  const result = run(scene.root); ok(result);
  const origin = `origin=${JSON.stringify(`journal:${scene.request}`)}`;
  const mine = candidateLine(result.stdout, "claim", scene.claimed);
  const sibling = candidateLine(result.stdout, "ready", scene.pending);
  assert.ok(mine.includes(origin), mine);
  assert.ok(sibling.includes(origin), sibling);
  assert.ok(mine.includes(`siblings=[${JSON.stringify(scene.pending)}]`), mine);
  assert.ok(sibling.includes(`siblings=[${JSON.stringify(scene.claimed)}]`), sibling);
  // the report stays coherent for the in-progress card, and is no longer the only projection
  assertFragment(result.stdout, "report:", origin);
});

test("D7 compact output never shortens the exact same-origin sibling paths", (t) => {
  const root = makeRepo(t);
  const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("one request with long sibling paths")}`;
  write(root, "devflow/journal.md", `${request}\n`);
  commit(root, "jmp boundary — long sibling request recorded");
  const cards = [1, 2, 3].map((number) =>
    `devflow/tree/02-capability/02.${number}-${"long-sibling-name-".repeat(3)}${number}.md`);
  for (let index = 0; index < cards.length; index += 1) {
    const progress = index === 0 ? `2026-08-22T00:00:00Z ${"x".repeat(26000)}` : undefined;
    write(root, cards[index], cardText(`02.${index + 1}`, { progress }));
  }
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — long sibling request planned");
  const claimed = cards[0].replace(/\.md$/, ".wip-jmp.md");
  git(root, "mv", cards[0], claimed);
  commit(root, "jmp boundary — compact output fixture");

  const result = run(root); ok(result);
  assert.match(result.stdout, /^state: .* form=compact$/m);
  const line = candidateLine(result.stdout, "claim", claimed);
  assert.ok(line.includes(`siblings=${JSON.stringify(cards.slice(1))}`), line);
  assert.equal(line.includes("siblingsTruncated=1"), false, line);
});

test("D7 a current card from another origin is not a sibling", (t) => {
  const scene = sameOriginPlan(t);
  const result = run(scene.root); ok(result);
  const foreign = candidateLine(result.stdout, "ready", scene.foreign);
  assert.ok(foreign.includes(`origin=${JSON.stringify(`journal:${scene.other}`)}`), foreign);
  assert.ok(foreign.includes("siblings=[]"), foreign);
  for (const line of [candidateLine(result.stdout, "claim", scene.claimed), candidateLine(result.stdout, "ready", scene.pending)]) {
    assert.equal(line.includes(scene.foreign), false, line);
  }
});

test("D7 a closed card from the same origin is not a current sibling", (t) => {
  const scene = sameOriginPlan(t);
  const result = run(scene.root); ok(result);
  for (const line of [candidateLine(result.stdout, "claim", scene.claimed), candidateLine(result.stdout, "ready", scene.pending)]) {
    assert.equal(line.includes(scene.closed), false, line);
  }
  assert.equal(result.stdout.includes(`file=${scene.closed}`), false, result.stdout);
});

test("D7 none and unknown origins never become a sibling bundle", (t) => {
  const root = makeRepo(t);
  const noneA = "devflow/tree/02-capability/02.1-none-a.md";
  const noneB = "devflow/tree/02-capability/02.2-none-b.md";
  write(root, noneA, cardText("02.1"));
  write(root, noneB, cardText("02.2"));
  commit(root, "jmp split — planned with no recorded input");

  const first = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("first request")}`;
  const second = `2026-08-20T00:00:01Z maintenance routing pending: request-json: ${JSON.stringify("second request")}`;
  write(root, "devflow/journal.md", `${first}\n${second}\n`);
  commit(root, "jmp boundary — two requests recorded");
  const unknownA = "devflow/tree/02-capability/02.3-unknown-a.md";
  const unknownB = "devflow/tree/02-capability/02.4-unknown-b.md";
  write(root, unknownA, cardText("02.3"));
  write(root, unknownB, cardText("02.4"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — two origins planned at once");

  const result = run(root); ok(result);
  for (const relative of [noneA, noneB]) {
    const line = candidateLine(result.stdout, "ready", relative);
    assert.ok(line.includes("origin=none"), line);
    assert.ok(line.includes("siblings=[]"), line);
  }
  for (const relative of [unknownA, unknownB]) {
    const line = candidateLine(result.stdout, "ready", relative);
    assert.ok(line.includes("origin=unknown"), line);
    assert.ok(line.includes("originReason=multiple-matches"), line);
    assert.ok(line.includes("siblings=[]"), line);
  }
});

// D7 closure: a Git command that could not answer is not an answer. The creation diff is the
// one read that decides whether a card has an origin at all, so a missing blob or bytes that
// will not decode must fail closed as unknown — never as `none`, which claims the planning
// commit consumed no request.
function unreadableOriginPlan(t, breakJournal) {
  const root = makeRepo(t);
  const request = `2026-08-20T00:00:00Z maintenance routing pending: request-json: ${JSON.stringify("exact request")}`;
  const journal = path.join(root, "devflow", "journal.md");
  breakJournal.before(root, journal, request);
  commit(root, "jmp boundary — request recorded");
  const pending = "devflow/tree/02-capability/02.1-fixture.md";
  write(root, pending, cardText("02.1"));
  write(root, "devflow/journal.md", "");
  commit(root, "jmp split — request planned");
  breakJournal.after(root);
  return { root, pending };
}

test("D7 closure a creation diff Git cannot read is unknown, not none", (t) => {
  const scene = unreadableOriginPlan(t, {
    before: (root, journal, request) => fs.writeFileSync(journal, `${request}\n`, "utf8"),
    // scoped to the journal alone, so the card's own history and parent lookups still answer
    // and only the creation diff cannot run — a program by this name exists nowhere
    after: (root) => {
      fs.writeFileSync(path.join(root, ".gitattributes"), "devflow/journal.md diff=devflow-absent-driver\n", "utf8");
      git(root, "config", "diff.devflow-absent-driver.textconv", "devflow-textconv-that-does-not-exist");
    },
  });
  const result = run(scene.root); ok(result);
  const line = candidateLine(result.stdout, "ready", scene.pending);
  assert.ok(line.includes("origin=unknown"), line);
  assert.ok(line.includes("originReason=creation-diff-unavailable"), line);
  assert.ok(line.includes("siblings=[]"), line);
});

test("D7 closure a creation diff that will not decode is unknown, not none", (t) => {
  const scene = unreadableOriginPlan(t, {
    // bytes Git stores and replays verbatim; the working tree is valid UTF-8 again by the
    // time the tool runs, so only the historic diff is undecodable
    before: (root, journal, request) => fs.writeFileSync(journal, Buffer.concat([
      Buffer.from(`${request}\n`), Buffer.from([0xff, 0xfe]), Buffer.from("\n"),
    ])),
    after: () => {},
  });
  const result = run(scene.root); ok(result);
  const line = candidateLine(result.stdout, "ready", scene.pending);
  assert.ok(line.includes("origin=unknown"), line);
  assert.ok(line.includes("originReason=creation-diff-undecodable"), line);
  assert.ok(line.includes("siblings=[]"), line);
});

// C: a user-confirmed Intent or Invariant of the capability being worked on has no path into
// its design zone. The note it is written as must reach arch or adopt before the claim
// continues and before that capability's closure harvest, carrying the exact statement, card,
// code basis, and the commit that first held it.
function designNote(capability, statement, card, code) {
  return `2026-08-21T00:00:00Z capability note: capability: ${capability}; note-json: ${JSON.stringify(statement)}; card-json: ${JSON.stringify(card)}; code-json: ${JSON.stringify(code)}`;
}

function designNoteScene(t, {
  capability = "02", commitNote = true, note = null, card: noted = null,
  code = ["src/export/contract.ts", "src/export/rename.ts"], present = null,
  checkpoint = "jmp 02.1 wip: capability design note",
} = {}) {
  const root = makeRepo(t, { capabilities: ["capability"] });
  const card = writeClaim(root, { commitSubject: "jmp 02.1 claim" });
  const statement = "a column rename never changes the export contract";
  const line = note ?? designNote(capability, statement, noted ?? card, code);
  // the canonical wip checkpoint that first holds the line is the anchor, and it holds this
  // card and this code in the same commit
  for (const relative of present ?? code) write(root, relative, `// ${relative}\n`);
  write(root, "devflow/journal.md", `${line}\n`);
  const anchor = commitNote ? commit(root, checkpoint) : null;
  return { root, card, statement, code, line, anchor };
}

test("C design a committed current-capability note preempts the claim and projects its exact basis", async (t) => {
  const scene = designNoteScene(t);
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "capability=02");
  assertFragment(result.stdout, "marker: kind=design-note", `card=${scene.card}`);
  assertFragment(result.stdout, "marker: kind=design-note", `note=${JSON.stringify(scene.statement)}`);
  assertFragment(result.stdout, "marker: kind=design-note", `code=${JSON.stringify(scene.code)}`);
  assertFragment(result.stdout, "marker: kind=design-note", `anchor=${scene.anchor}`);
  assertNoFragment(result.stdout, "marker: kind=design-note", "head=");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
  const module = await registry();
  for (const later of ["claim.mine", "layer.children-done", "marker.capability-closure", "marker.re-split"]) {
    assert.equal(module.selectFirstRoute([later, "marker.design-note"]), "marker.design-note", later);
  }
});

test("C design a line HEAD holds only inside a longer line is not that line", (t) => {
  const scene = designNoteScene(t, { commitNote: false });
  write(scene.root, "devflow/journal.md", `${scene.line} and one more clause\n`);
  commit(scene.root, "jmp 02.1 wip: a different line");
  write(scene.root, "devflow/journal.md", `${scene.line}\n`);
  const result = run(scene.root); ok(result);
  assert.equal(hasKind(result.stdout, "marker", "design-note"), false, result.stdout);
  assert.equal(nextOf(result.stdout), "claim.mine", result.stdout);
});

test("C design an earlier longer line is not the exact-line anchor", (t) => {
  const scene = designNoteScene(t, { commitNote: false });
  write(scene.root, "devflow/journal.md", `${scene.line} and one more clause\n`);
  commit(scene.root, "jmp 02.1 wip: capability design note");
  write(scene.root, "devflow/journal.md", `${scene.line}\n`);
  const exactAnchor = commit(scene.root, "jmp 02.1 wip: capability design note");
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", `anchor=${exactAnchor}`);
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an anchor lookup Git cannot run fails closed ahead of the claim", (t) => {
  const scene = designNoteScene(t);
  // the pickaxe walks every historical journal blob; removing one loose object is the
  // narrowest deterministic way to make that lookup impossible
  const stale = git(scene.root, "rev-parse", "HEAD~1:devflow/journal.md");
  fs.rmSync(path.join(scene.root, ".git", "objects", stale.slice(0, 2), stale.slice(2)));
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=anchor-unavailable");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=external");
  assertNoFragment(result.stdout, "marker: kind=design-note", "anchor=");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an uncommitted note is not a durable route", (t) => {
  const scene = designNoteScene(t, { commitNote: false });
  const result = run(scene.root); ok(result);
  assert.equal(hasKind(result.stdout, "marker", "design-note"), false, result.stdout);
  assert.equal(nextOf(result.stdout), "claim.mine", result.stdout);
});

test("C design a different-capability observation stays a closure harvest, not a design route", (t) => {
  const scene = designNoteScene(t, {
    note: `2026-08-21T00:00:00Z capability note: capability: 03; note-json: ${JSON.stringify("the neighbour capability caches the same column")}`,
  });
  const before = snapshot(scene.root);
  const result = run(scene.root); ok(result);
  assert.equal(hasKind(result.stdout, "marker", "design-note"), false, result.stdout);
  assert.equal(nextOf(result.stdout), "claim.mine", result.stdout);
  assert.equal(read(scene.root, "devflow/journal.md"), `${scene.line}\n`, "the observation stays for that capability's closure");
  assertReadOnly(scene.root, before);
});

// C follow-up: a committed design form that cannot take the live same-capability route is not
// an ordinary observation to harvest, an interrupted design-only write is not a generic verify
// prefix, and no Git read failure may end as silence.
test("C design a committed design note with no live card blocks instead of vanishing", (t) => {
  const scene = designNoteScene(t, { card: "devflow/tree/02-capability/02.9-absent.md" });
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=card-absent");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design a committed design note naming another capability blocks instead of vanishing", (t) => {
  const scene = designNoteScene(t, { capability: "03" });
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=capability-mismatch");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

function designOnlyPrefix(t, { verifyFile = false, unrelated = false } = {}) {
  const scene = designNoteScene(t);
  if (verifyFile) capabilityVerify(scene.root, "devflow/tree/02-capability/verify.md");
  write(scene.root, "devflow/project/capabilities/02-capability.md",
    `${read(scene.root, "devflow/project/capabilities/02-capability.md")}\n`);
  write(scene.root, "devflow/journal.md", "");
  if (unrelated) write(scene.root, "src/unrelated.ts", "// unrelated\n");
  return scene;
}

test("C design an interrupted design-only prefix routes back to the writer", (t) => {
  const scene = designOnlyPrefix(t);
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "prefix=design-only");
  assertFragment(result.stdout, "marker: kind=design-note", `card=${scene.card}`);
  assertFragment(result.stdout, "marker: kind=design-note", `anchor=${scene.anchor}`);
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an interrupted design-only prefix is not a generic verify prefix", (t) => {
  const scene = designOnlyPrefix(t, { verifyFile: true });
  const result = run(scene.root); ok(result);
  assert.equal(hasKind(result.stdout, "transition", "interrupted"), false, result.stdout);
  assertFragment(result.stdout, "marker: kind=design-note", "prefix=design-only");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design a design-only prefix carrying an unrelated path blocks", (t) => {
  const scene = designOnlyPrefix(t, { unrelated: true });
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=prefix-mismatch");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=external");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design a design-only prefix changing another capability blocks", (t) => {
  const scene = designNoteScene(t);
  write(scene.root, "devflow/project/capabilities/03-neighbour.md", "# Capability 03\n");
  write(scene.root, "devflow/journal.md", "");
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=prefix-mismatch");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an anchor that is not the canonical checkpoint blocks", (t) => {
  const scene = designNoteScene(t, { checkpoint: "bad 02.1 wip: capability design note" });
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=anchor-not-checkpoint");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=producer");
  assertNoFragment(result.stdout, "marker: kind=design-note", "anchor=");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design a code path missing from the anchor tree blocks", (t) => {
  const scene = designNoteScene(t, {
    code: ["src/export/contract.ts", "src/export/typo.ts"], present: ["src/export/contract.ts"],
  });
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=code-absent");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design a statement carrying the field delimiters stays one short note", (t) => {
  const root = makeRepo(t, { capabilities: ["capability"] });
  writeClaim(root, { commitSubject: "jmp 02.1 claim" });
  const statement = "write it as ; card-json: <path> and ; code-json: [paths]";
  const line = `2026-08-21T00:00:00Z capability note: capability: 03; note-json: ${JSON.stringify(statement)}`;
  write(root, "devflow/journal.md", `${line}\n`);
  commit(root, "jmp boundary — observation recorded");
  const result = run(root); ok(result);
  assert.equal(result.stdout.includes("reserved-format:capability note:"), false, result.stdout);
  assert.equal(hasKind(result.stdout, "marker", "design-note"), false, result.stdout);
  assert.equal(nextOf(result.stdout), "claim.mine", result.stdout);
});

test("C design an unreadable HEAD journal blocks instead of falling to the claim", (t) => {
  const scene = designNoteScene(t);
  const blob = git(scene.root, "rev-parse", "HEAD:devflow/journal.md");
  fs.rmSync(path.join(scene.root, ".git", "objects", blob.slice(0, 2), blob.slice(2)));
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=head-journal-unavailable");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=external");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an interrupted prefix with an unreadable HEAD journal still blocks", (t) => {
  const scene = designOnlyPrefix(t, { unrelated: true });
  const blob = git(scene.root, "rev-parse", "HEAD:devflow/journal.md");
  fs.rmSync(path.join(scene.root, ".git", "objects", blob.slice(0, 2), blob.slice(2)));
  const result = run(scene.root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=head-journal-unavailable");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=external");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});

test("C design an undecodable HEAD journal classifies its unresolved route as external", (t) => {
  const root = makeRepo(t);
  fs.writeFileSync(path.join(root, "devflow", "journal.md"), Buffer.from([0xff, 0xfe, 0x0a]));
  commit(root, "jmp fixture — undecodable HEAD journal");
  write(root, "devflow/journal.md", "working journal changed\n");
  const result = run(root); ok(result);
  assertFragment(result.stdout, "marker: kind=design-note", "reason=head-journal-undecodable");
  assertFragment(result.stdout, "marker: kind=design-note", "recovery=external");
  assert.equal(nextOf(result.stdout), "marker.design-note", result.stdout);
});
