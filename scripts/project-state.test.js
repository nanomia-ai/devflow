#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
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
  write(root, "devflow/users/jmp/digest.md", "none\n");
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

function currentRevisions(root) {
  const productRevision = git(root, "hash-object", "devflow/project/product.md");
  const present = ["devflow/project/arch.md", "devflow/project/code-style.md", "devflow/project/glossary.md"];
  const tree = execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", "HEAD", "--", ...present], { cwd: root });
  const verificationRevision = execFileSync("git", ["hash-object", "--stdin"], { cwd: root, input: tree, encoding: "utf8" }).trim();
  const codeRevision = git(root, "log", "-1", "--format=%H", "--", ".", ":(exclude)devflow/**") || "none";
  return { productRevision, verificationRevision, codeRevision };
}

function rootVerify(root, verdict, { events = true } = {}) {
  const revisions = currentRevisions(root);
  write(root, "devflow/tree/verify.md", `# Verification · product
Product revision: ${revisions.productRevision}
Verification revision: ${revisions.verificationRevision}
Code revision: ${revisions.codeRevision}
Capability revision: not-applicable
Verdict: ${verdict}
New entries: 0
Failure history:
None.
## Audit
${events ? "- source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 0 findings · 0 adopted · routing: none" : "- not run"}
## Retrospective
${events ? "- source id: 1 · event timestamp: 2026-08-20T00:00:00Z · event key: product · 0 findings · 0 adopted · routing: none" : "- not run"}
`);
  commit(root, "jmp boundary — product verification result");
}

function capabilityVerify(root, relative, { failures = "None.", audit = "- not run", retrospective = "- not run", verdict = "pass" } = {}) {
  const revisions = currentRevisions(root);
  write(root, relative, `# Verification · fixture · 2026-08-20
Product revision: ${revisions.productRevision}
Verification revision: ${revisions.verificationRevision}
Code revision: ${revisions.codeRevision}
Capability revision: unresolved
Scenario: fixture
Executed: fixture
Verdict: ${verdict}
New entries: ${failures === "None." ? 0 : 1}
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
      journal(`2026-08-20T00:00:00Z layer opening: parent: devflow/tree/02-capability; children: 02.1+02.2; source-json: ${JSON.stringify("core:devflow/project/product.md#Capabilities")}`);
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

for (let index = 0; index < ROUTE_MAP.length; index += 1) {
  const number = index + 1;
  test(`T1 mapping ${String(number).padStart(2, "0")} has the exact zone, kind, values, and derived next`, async (t) => {
    if (number === 53) {
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
  assert.equal(module.ZONE_DEFINITIONS.flatMap((item) => item.kinds.map((kind) => `${item.zone}.${kind.name}`)).length, 53);
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
  const card = writeClaim(root);
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

test("output budget compact emits every item, then refuses without dropping a subset", (t) => {
  const compactRoot = makeRepo(t);
  const rows = Array.from({ length: 180 }, (_, index) => `2026-08-20T00:${String(index % 60).padStart(2, "0")}:00Z jmp: ${index}-${"x".repeat(100)}`);
  write(compactRoot, "devflow/journal.md", `${rows.join("\n")}\n`);
  const compact = run(compactRoot); ok(compact);
  assert.match(compact.stdout, /^state: .* bytes=\d+\/24576 form=compact$/m);
  assert.equal(Buffer.byteLength(compact.stdout) <= 24 * 1024, true);
  assert.equal(compact.stdout.split(/\r?\n/).filter((line) => line.startsWith("open-item:")).length, rows.length);
  assert.match(compact.stdout, /^open-item: .+ \[truncated\]$/m);

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

test("compact integrity blocking keeps every repair item with explicit line truncation", (t) => {
  const root = makeRepo(t);
  const rows = Array.from({ length: 50 }, (_, index) =>
    `2026-08-20T00:${String(index % 60).padStart(2, "0")}:00Z product verification running: malformed-${index}-${"x".repeat(400)}`);
  write(root, "devflow/journal.md", `${rows.join("\n")}\n`);
  const result = run(root); ok(result);
  assert.match(result.stdout, /^state: .* form=compact$/m);
  assert.equal(result.stdout.split(/\r?\n/).filter((line) => line.startsWith("integrity: kind=blocking")).length, rows.length);
  assert.equal(result.stdout.split(/\r?\n/).filter((line) => line.startsWith("integrity: kind=blocking") && line.includes("lineTruncated=1")).length, rows.length);
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
  assertFragment(result.stdout, "event: kind=new", "role=Retrospective");
  assertFragment(result.stdout, "event: kind=new", 'key="first closure 2"');
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
