#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.join(__dirname, "..");
const skillDirs = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(root, "skills", entry.name));
const pairRelatives = [
  ...skillDirs.map((dir) => path.relative(root, path.join(dir, "SKILL_ko.md"))),
  "skills/principles/state-predicates_ko.md",
  "skills/principles/verification-predicates_ko.md",
  "skills/principles/baseline-predicates_ko.md",
  "skills/principles/planning-evidence_ko.md",
  "skills/principles/coordinator_ko.md",
  "skills/work/reviewer_ko.md",
  "skills/verify/verifier_ko.md",
  "skills/verify/auditor_ko.md",
  "skills/verify/retrospector_ko.md",
  "codex/AGENTS-devflow_ko.md",
  "docs/design_ko.md",
  "docs/design-decisions_ko.md",
  "docs/design-backlog_ko.md",
  "docs/maintenance-protocol_ko.md",
  "docs/rounds/v0.10.0/proposal_ko.md",
  "docs/rounds/v0.11.0/report_ko.md",
  "docs/rounds/v0.9.21/report_ko.md",
];

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function shape(text) {
  return {
    headings: count(text, /^#{1,6}\s+/gm),
    numberedItems: count(text, /^\s*\d+\.\s+/gm),
    // Unordered items count too: documents that are mostly bullets (the backlog) could
    // otherwise lose an item in one language and still pass this check.
    bulletItems: count(text, /^\s*[-*]\s+/gm),
    tableRows: count(text, /^\s*\|.*\|\s*$/gm),
    diagrams: count(text, /^```mermaid\s*$/gm),
  };
}

function machineFigures(text) {
  const versions = [...text.matchAll(/\bv?\d+\.\d+(?:\.\d+)?\b/gi)].map((match) => match[0]);
  const percentages = [...text.matchAll(/[+-]?\d+(?:\.\d+)?%/g)].map((match) => match[0]);
  return { versions, percentages };
}

const CARD_NUMBER_SOURCE = String.raw`[0-9]+[a-z]*(?:\.[0-9]+[a-z]*)+`;
const ROUTING_FIX_CARDS = new RegExp(
  `^routing: fix cards (${CARD_NUMBER_SOURCE}(?:\\+${CARD_NUMBER_SOURCE})*)$`,
);
const FAILURE_HISTORY_TEMPLATES = [
  "- source id: <id>; timestamp: <ts>; <failure: … | unverified: …>; routing: pending",
  "- source id: <id>; timestamp: <ts>; <failure: … | unverified: …>; signal card: <number>; routing: pending",
  "- source id: <id>; timestamp: <ts>; <failure: … | unverified: …>; signal card: <number>; repair lineage: <root>; recurrence observation: <positive integer>; routing: pending",
];
const ROUTING_VALUE_SOURCE = `(?:pending|fix cards ${CARD_NUMBER_SOURCE}(?:\\+${CARD_NUMBER_SOURCE})*|documents .+|product re-run .+)`;
const FAILURE_HISTORY_ENTRY_FORMS = [
  new RegExp(
    `^- source id: (?<sourceId>[^;]+); timestamp: (?<timestamp>[^;]+); (?<kind>failure|unverified): (?<message>.+);`
      + ` signal card: (?<signalCard>${CARD_NUMBER_SOURCE}); repair lineage: (?<repairLineage>[^;]+);`
      + ` recurrence observation: (?<recurrence>[1-9][0-9]*); routing: (?<routing>${ROUTING_VALUE_SOURCE})$`,
  ),
  new RegExp(
    `^- source id: (?<sourceId>[^;]+); timestamp: (?<timestamp>[^;]+); (?<kind>failure|unverified): (?<message>.+);`
      + ` signal card: (?<signalCard>${CARD_NUMBER_SOURCE}); routing: (?<routing>${ROUTING_VALUE_SOURCE})$`,
  ),
  new RegExp(
    `^- source id: (?<sourceId>[^;]+); timestamp: (?<timestamp>[^;]+); (?<kind>failure|unverified): (?<message>.+);`
      + ` routing: (?<routing>${ROUTING_VALUE_SOURCE})$`,
  ),
];

function parseFailureHistoryFixture(line, targetKey) {
  const match = FAILURE_HISTORY_ENTRY_FORMS.map((form) => form.exec(line)).find(Boolean);
  if (!match) return null;
  const { sourceId, timestamp, kind, message, signalCard, repairLineage, recurrence, routing } = match.groups;
  if (/; (?:signal card|repair lineage|recurrence observation):/.test(message)) return null;
  const routeMatch = ROUTING_FIX_CARDS.exec(`routing: ${routing}`);
  return {
    sourceId,
    timestamp,
    kind,
    message,
    signalCard: signalCard || null,
    root: repairLineage || `${targetKey}@${sourceId}`,
    recurrence: recurrence ? Number(recurrence) : 0,
    routing,
    routeCards: routeMatch ? routeMatch[1].split("+") : [],
  };
}

function cardNumberParts(value) {
  const parts = value.split(".").map((component) => /^([0-9]+)([a-z]*)$/.exec(component));
  assert.ok(parts.length >= 2 && parts.every(Boolean), `invalid fixture card number: ${value}`);
  return parts.map((match) => ({ integer: Number(match[1]), suffix: match[2] }));
}

function compareCardNumbers(left, right) {
  const leftParts = cardNumberParts(left);
  const rightParts = cardNumberParts(right);
  for (let index = 0; index < Math.min(leftParts.length, rightParts.length); index += 1) {
    if (leftParts[index].integer !== rightParts[index].integer) {
      return leftParts[index].integer - rightParts[index].integer;
    }
    if (leftParts[index].suffix !== rightParts[index].suffix) {
      if (!leftParts[index].suffix) return -1;
      if (!rightParts[index].suffix) return 1;
      return Buffer.compare(Buffer.from(leftParts[index].suffix), Buffer.from(rightParts[index].suffix));
    }
  }
  if (leftParts.length !== rightParts.length) return leftParts.length - rightParts.length;
  return Buffer.compare(Buffer.from(left), Buffer.from(right));
}

function sortedCardNumbers(values) {
  return [...new Set(values)].sort(compareCardNumbers);
}

function projectRepairLineageFixture(files, labels) {
  const entries = files.flatMap(({ targetKey, text }) => text.split(/\r?\n/)
    .filter((line) => line.startsWith("- source id:"))
    .map((line) => {
      const parsed = parseFailureHistoryFixture(line, targetKey);
      assert.ok(parsed, `unparseable fixture entry: ${line}`);
      return parsed;
    }));
  const routeIndex = new Map();
  for (const entry of entries) {
    for (const card of entry.routeCards) {
      const roots = routeIndex.get(card) || new Set();
      roots.add(entry.root);
      routeIndex.set(card, roots);
    }
  }
  const candidates = labels.map((label) => ({
    label,
    roots: [...(routeIndex.get(label) || [])].sort(),
  }));
  const ambiguous = candidates.filter((candidate) => candidate.roots.length >= 2);
  if (ambiguous.length > 0) return { blocked: true, ambiguous, items: [] };

  const items = candidates.map(({ label, roots }) => {
    if (roots.length === 0) {
      return {
        label,
        root: null,
        recurrenceObservation: null,
        previousRouteCards: [],
        inheritedCards: [label],
        humanGate: false,
      };
    }
    const rootValue = roots[0];
    const rootEntries = entries.filter((entry) => entry.root === rootValue);
    const maximum = Math.max(...rootEntries.map((entry) => entry.recurrence));
    const completedRepairEntries = rootEntries.filter((entry) => entry.routeCards.length > 0);
    const previousRound = Math.max(...completedRepairEntries.map((entry) => entry.recurrence));
    const previousRouteCards = sortedCardNumbers(completedRepairEntries
      .filter((entry) => entry.recurrence === previousRound)
      .flatMap((entry) => entry.routeCards));
    const recurrenceObservation = maximum + 1;
    return {
      label,
      root: rootValue,
      recurrenceObservation,
      previousRouteCards,
      inheritedCards: sortedCardNumbers([label, ...previousRouteCards]),
      humanGate: recurrenceObservation >= 2,
    };
  });
  return { blocked: false, ambiguous: [], items };
}

test("every Korean design original has an English deploy pair with the same structure", () => {
  for (const relative of pairRelatives) {
    const original = path.join(root, relative);
    assert.ok(fs.existsSync(original), `missing original ${relative}`);
    const deployed = original.replace(/_ko\.md$/, ".md");
    assert.ok(fs.existsSync(deployed), `missing pair for ${path.relative(root, original)}`);
    assert.deepEqual(
      shape(fs.readFileSync(original, "utf8")),
      shape(fs.readFileSync(deployed, "utf8")),
      `structure drift: ${path.relative(root, original)}`,
    );
    assert.deepEqual(
      machineFigures(fs.readFileSync(original, "utf8")),
      machineFigures(fs.readFileSync(deployed, "utf8")),
      `machine-checkable figure drift: ${path.relative(root, original)}`,
    );
  }
});

test("English deploy artifacts contain no Korean", () => {
  const deployFiles = [
    "AGENTS.md",
    "CHANGELOG.md",
    "docs/design.md",
    "docs/design-decisions.md",
    "docs/design-backlog.md",
    "docs/maintenance-protocol.md",
    "docs/rounds/v0.10.0/proposal.md",
    "docs/rounds/v0.11.0/report.md",
    "docs/rounds/v0.9.21/report.md",
    "codex/AGENTS-devflow.md",
    "codex/install.ps1",
    "codex/install.sh",
    "CLAUDE.md",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    "hooks/hooks.json",
    ...skillDirs.flatMap((dir) => fs.readdirSync(dir)
      .filter((name) => name.endsWith(".md") && !name.endsWith("_ko.md"))
      .map((name) => path.relative(root, path.join(dir, name)))),
    // .mjs counts: a tool is a deploy artifact too, and the capsule tool's marker vocabulary
    // is exactly where Korean crept in behind an .js-only filter.
    ...fs.readdirSync(path.join(root, "scripts"))
      .filter((name) => name.endsWith(".js") || name.endsWith(".mjs"))
      .map((name) => path.join("scripts", name)),
  ].map((relative) => path.join(root, relative));
  for (const file of deployFiles) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    const matches = fs.readFileSync(file, "utf8").split(/\r?\n/)
      .filter((line) => /[\uAC00-\uD7A3]/.test(line));
    assert.equal(matches.length, 0, `${relative}: lines containing Korean`);
  }
});

test("the generated decision projections and decision bodies hold the same identifiers", () => {
  const tool = path.join(root, "scripts", "decision-index.mjs");
  const projected = [];
  for (const [language, bodyFile] of [
    [[], "docs/design-decisions.md"],
    [["--lang", "ko"], "docs/design-decisions_ko.md"],
  ]) {
    const result = spawnSync(process.execPath, [tool, ...language], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const indexed = [...result.stdout.matchAll(/^\|\s*(DD-\d+)\s*\|/gm)].map((match) => match[1]);
    const body = fs.readFileSync(path.join(root, bodyFile), "utf8");
    const bodied = [...body.matchAll(/^###\s+(DD-\d+)\s+·/gm)].map((match) => match[1]);
    assert.ok(indexed.length > 0, `${bodyFile}: generated projection has no decisions`);
    assert.deepEqual(new Set(indexed).size, indexed.length, `${bodyFile}: duplicate projected rows`);
    assert.deepEqual(new Set(bodied).size, bodied.length, `${bodyFile}: duplicate decision bodies`);
    assert.deepEqual(indexed, bodied, `${bodyFile}: projection is not a source-ordered 1:1 view`);
    projected.push(indexed);
  }
  assert.deepEqual(projected[0], projected[1], "English and Korean projections disagree on identifiers");
});

test("decision and rejection identifiers are dense, unreused, and carry a known state", () => {
  const body = fs.readFileSync(path.join(root, "docs/design-decisions.md"), "utf8");
  for (const [prefix, pattern] of [
    ["DD", /^###\s+(DD-\d+)\s+·/gm],
    ["DR", /\*\*\[(DR-\d+)\s+·/g],
  ]) {
    const ids = [...body.matchAll(pattern)].map((m) => m[1]);
    const numbers = ids.map((x) => Number(x.slice(3))).sort((a, b) => a - b);
    assert.deepEqual(new Set(numbers).size, numbers.length, `${prefix}: an identifier is reused`);
    assert.deepEqual(numbers, numbers.map((_, i) => i + 1), `${prefix}: identifiers are not dense from 1`);
  }
  const states = [...body.matchAll(/\|\s*State:\s*(.+)$/gm)].map((m) => m[1].trim());
  assert.ok(states.length > 0, "no decision states found");
  for (const state of states) {
    assert.ok(
      state === "active"
        || /^replaced by DD-\d+ \(v\d+\.\d+\.\d+\)$/.test(state)
        || /^active, partly corrected by DD-\d+ \(v\d+\.\d+\.\d+\)(?:, DD-\d+ \(v\d+\.\d+\.\d+\))*$/.test(state),
      `unknown decision state: ${state}`,
    );
  }
});

test("every docs path a document names resolves to a file that exists", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".md")) files.push(p);
    }
  };
  walk(root);
  const dangling = [];
  for (const file of files) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    // Changelog entries name the paths as they stood in that release; they are history.
    if (relative === "CHANGELOG.md" || relative === "docs/changelog-archive.md") continue;
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/\bdocs\/[A-Za-z0-9._/-]+\.md\b/g)) {
      const target = match[0];
      // Round records quote platform documentation (docs/hooks.md) and user-project
      // examples (docs/specs/...) that live outside this repository. Only paths in this
      // repository's own docs namespace are checked.
      const ours = target.startsWith("docs/rounds/")
        || /^docs\/(design|maintenance-protocol|audit-guideline|usecase-matrix|capability-knowledge|v0\.)/.test(target);
      if (!ours) continue;
      if (!fs.existsSync(path.join(root, target))) dangling.push(`${relative} -> ${target}`);
    }
  }
  assert.deepEqual(dangling, [], "documents name docs paths that do not exist");
});

test("the maintenance gate names the canon files and both standing instruments", () => {
  const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  for (const required of [
    "docs/design.md",
    "docs/design-decisions.md",
    "docs/design-backlog.md",
    "docs/maintenance-protocol.md",
    "docs/audit-guideline_ko.md",
    "docs/usecase-matrix_ko.md",
    "docs/rounds/",
  ]) {
    assert.ok(agents.includes(required), `AGENTS.md never names ${required}`);
  }
  const sessionStart = fs.readFileSync(path.join(root, "scripts", "session-start.js"), "utf8");
  const codexFallback = fs.readFileSync(path.join(root, "codex", "AGENTS-devflow.md"), "utf8");
  assert.match(sessionStart, /path\.join\(__dirname, "\.\.", "skills", "principles", "coordinator\.md"\)/);
  assert.match(sessionStart, /dispatch another agent to perform a devflow stage/);
  assert.match(sessionStart, /coordinator role contract at \$\{coordinatorContract\}/);
  assert.match(codexFallback, /dispatching another agent to perform a devflow stage/);
  assert.match(codexFallback, /`coordinator` role contract/);
  for (const dir of skillDirs) {
    for (const name of fs.readdirSync(dir).filter((entry) => entry.endsWith(".md"))) {
      const file = path.join(dir, name);
      if (file === path.join(root, "skills", "principles", "coordinator.md")) continue;
      assert.doesNotMatch(
        fs.readFileSync(file, "utf8"),
        /coordinator\.md/,
        `${path.relative(root, file)} must not reference the coordinator contract`,
      );
    }
  }
});

test("maintenance onboarding stays bounded and every conditional protocol section is wired", () => {
  const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  const design = fs.readFileSync(path.join(root, "docs", "design.md"), "utf8");
  const protocol = fs.readFileSync(path.join(root, "docs", "maintenance-protocol.md"), "utf8");
  assert.ok(Buffer.byteLength(agents) <= 6 * 1024, "AGENTS.md exceeds the 6 KiB entry budget");
  // The decision index grows one row per decision forever while this budget stays fixed, so the
  // two collide on a schedule. v0.18.1 found the collision: design.md sat 29 bytes below the old
  // 24 KiB line, leaving no room for DD-76's row plus the state strings its corrections require.
  // Raised once, minimally. The structural answer — splitting or relocating the index — is a
  // decision the backlog carries; do not raise these again to fit one more row.
  assert.ok(Buffer.byteLength(design) <= 26 * 1024, "docs/design.md exceeds the 26 KiB intent budget");
  assert.ok(
    Buffer.byteLength(agents) + Buffer.byteLength(design) <= 32 * 1024,
    "always-read AGENTS.md + docs/design.md exceeds 32 KiB",
  );
  const sections = [...protocol.matchAll(/^##\s+(\d+)\./gm)].map((match) => match[1]);
  assert.deepEqual(sections, ["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  for (const section of sections) {
    assert.match(agents, new RegExp(`§${section}(?:\\D|$)`), `protocol §${section} has no root route`);
  }
  assert.doesNotMatch(protocol, /^\| Condition \| Read additionally \|$/m,
    "conditional read dispatch is duplicated outside AGENTS.md");
  assert.match(agents, /opening a folder under `docs\/rounds\/`[^\n]+not the bounded current-state read/i,
    "the entry gate's bounded round read can recursively open older rounds");
  assert.match(protocol, /large enough to take its own version is a round/i,
    "versioned work can lose its round record");
  assert.match(agents, /for a version bump, also §5/i,
    "a version bump cannot reach its round-record rule");
  assert.match(protocol, /versioned implementation without naming a round-document role[\s\S]+`report_ko\.md`/i,
    "versioned implementation has no deterministic default round record");
  assert.match(agents, /External\s+contributors are not required to open either one/i,
    "external contributors lost the Korean-only standing-instrument exception");
  assert.match(protocol, /equivalent PR evidence stands in place of opening the two/i,
    "external PR evidence no longer substitutes for Korean-only standing instruments");
  assert.doesNotMatch(agents, /read (?:all of |the whole )?docs\/maintenance-protocol\.md/i);
  for (const forbidden of ["CURRENT.md", "another skill map", "whole CHANGELOG", "all rounds"] ) {
    assert.ok(agents.includes(forbidden), `AGENTS.md does not forbid default onboarding through ${forbidden}`);
  }
});

test("the always-read design intent index covers every skill and companion", () => {
  const design = fs.readFileSync(path.join(root, "docs", "design.md"), "utf8");
  const intentStart = design.indexOf("### Skill intent index");
  const intentEnd = design.indexOf("## Document map", intentStart);
  assert.ok(intentStart >= 0 && intentEnd > intentStart, "design.md has no bounded skill intent index");
  const intent = design.slice(intentStart, intentEnd);
  for (const dir of skillDirs) {
    const name = path.basename(dir);
    assert.ok(intent.includes(`\`${name}\``), `skill intent index omits ${name}`);
  }
  for (const companion of [
    "state-predicates.md",
    "verification-predicates.md",
    "baseline-predicates.md",
    "planning-evidence.md",
    "coordinator.md",
    "reviewer.md",
    "verifier.md",
    "auditor.md",
    "retrospector.md",
  ]) {
    assert.ok(intent.includes(`\`${companion}\``), `skill intent index omits ${companion}`);
  }
  assert.match(intent, /not a substitute for skill rules/);
  assert.match(intent, /read the affected skill/);
});

test("every maintenance script and document has a declared lifecycle", () => {
  const scriptsDir = path.join(root, "scripts");
  const scriptWiring = new Map([
    ["decision-index.mjs", ["AGENTS.md", "docs/design.md", "docs/design_ko.md"]],
    ["remove-generated-codex-prompts.js", ["codex/install.ps1", "codex/install.sh"]],
    ["remove-legacy-codex-hook.js", ["codex/install.ps1", "codex/install.sh"]],
    ["project-knowledge.mjs", ["skills/principles/baseline-predicates.md", "skills/principles/baseline-predicates_ko.md"]],
    ["session-start.js", ["hooks/hooks.json"]],
    ["verify-codex-plugin-install.js", ["codex/install.ps1", "codex/install.sh"]],
  ]);
  const runtimeScripts = fs.readdirSync(scriptsDir)
    .filter((name) => (name.endsWith(".js") || name.endsWith(".mjs")) && !name.endsWith(".test.js"))
    .sort();
  assert.deepEqual(runtimeScripts, [...scriptWiring.keys()].sort(),
    "scripts contains an undeclared runtime file or lost a declared one");
  for (const [script, consumers] of scriptWiring) {
    const testFile = script.replace(/\.m?js$/, ".test.js");
    assert.ok(fs.existsSync(path.join(scriptsDir, testFile)), `${script} has no direct test`);
    for (const consumer of consumers) {
      const text = fs.readFileSync(path.join(root, consumer), "utf8");
      assert.ok(text.includes(script), `${script} has no live consumer in ${consumer}`);
    }
  }
  const standaloneTests = new Set([
    "git-state-transitions.test.js",
    "repository-invariants.test.js",
  ]);
  // A tool that executes the canon lives beside the canon (`skills/<name>/scripts/`) so it
  // travels on every install channel, while its suite stays here so no user gets it installed.
  // Such a suite still needs a real runtime source; it just is not this folder's sibling.
  const skillToolDirs = fs.readdirSync(path.join(root, "skills"))
    .map((name) => path.join(root, "skills", name, "scripts"))
    .filter((dir) => fs.existsSync(dir));
  for (const testFile of fs.readdirSync(scriptsDir).filter((name) => name.endsWith(".test.js"))) {
    const source = testFile.replace(/\.test\.js$/, ".js");
    const sourceMjs = testFile.replace(/\.test\.js$/, ".mjs");
    const beside = skillToolDirs.some((dir) => fs.existsSync(path.join(dir, source)) || fs.existsSync(path.join(dir, sourceMjs)));
    assert.ok(fs.existsSync(path.join(scriptsDir, source)) || fs.existsSync(path.join(scriptsDir, sourceMjs)) || beside || standaloneTests.has(testFile),
      `${testFile} is neither a direct runtime test nor a declared standalone suite`);
  }

  const topLevelDocs = fs.readdirSync(path.join(root, "docs"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(topLevelDocs, [
    "audit-guideline_ko.md",
    "changelog-archive.md",
    "design-backlog.md",
    "design-backlog_ko.md",
    "design-decisions.md",
    "design-decisions_ko.md",
    "design.md",
    "design_ko.md",
    "maintenance-protocol.md",
    "maintenance-protocol_ko.md",
    "usecase-matrix_ko.md",
  ], "docs contains a top-level artifact with no declared lifecycle");
  const design = fs.readFileSync(path.join(root, "docs", "design.md"), "utf8");
  for (const lifecycle of [
    "docs/audit-guideline_ko.md",
    "docs/usecase-matrix_ko.md",
    "docs/changelog-archive.md",
    "docs/rounds/<version>/",
    "docs/blueprints/",
  ]) {
    assert.ok(design.includes(lifecycle), `design.md has no lifecycle for ${lifecycle}`);
  }
  const standardRoundRecord = /^(?:request|handoff|plan|report|audit|plan-audit)(?:[2-9]\d*|-r[1-9]\d*)?_ko\.md$/;
  for (const accepted of ["request2_ko.md", "plan3_ko.md", "plan-r1_ko.md"]) {
    assert.match(accepted, standardRoundRecord, `declared round-record form is rejected: ${accepted}`);
  }
  for (const rejected of ["request0_ko.md", "request1_ko.md", "request01_ko.md", "report-r0_ko.md"]) {
    assert.doesNotMatch(rejected, standardRoundRecord,
      `undeclared round-record form is accepted: ${rejected}`);
  }
  const historicalRoundRecords = new Map([
    ["v0.9.21/report.md", "docs/rounds/v0.9.21/report_ko.md ↔ report.md"],
    ["v0.10.0/proposal.md", "docs/rounds/v0.10.0/proposal_ko.md ↔ proposal.md"],
    ["v0.10.0/proposal_ko.md", "docs/rounds/v0.10.0/proposal_ko.md ↔ proposal.md"],
    ["v0.11.0/report.md", "docs/rounds/v0.11.0/report_ko.md ↔ report.md"],
    ["v0.15.0/progress-review_ko.md", "v0.15.0/progress-review_ko.md"],
  ]);
  const protocol = fs.readFileSync(path.join(root, "docs", "maintenance-protocol.md"), "utf8");
  for (const entry of fs.readdirSync(path.join(root, "docs", "rounds"), { withFileTypes: true })) {
    assert.ok(entry.isDirectory() && /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(entry.name),
      `docs/rounds contains an undeclared entry: ${entry.name}`);
    const files = fs.readdirSync(path.join(root, "docs", "rounds", entry.name));
    assert.ok(files.length > 0, `${entry.name} is an empty round`);
    for (const name of files) {
      const relative = `${entry.name}/${name}`;
      if (standardRoundRecord.test(name)) continue;
      const repair = name.match(/^report-(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)_ko\.md$/);
      const round = entry.name.match(/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
      if (repair && round
        && repair[1] === round[1]
        && repair[2] === round[2]
        && BigInt(repair[3]) > BigInt(round[3])) {
        assert.ok(protocol.includes("report-<repair version>_ko.md"),
          "repair-release report naming is not declared in the maintenance protocol");
        continue;
      }
      assert.ok(historicalRoundRecords.has(relative),
        `docs/rounds contains a record with no declared lifecycle: ${relative}`);
      assert.ok(protocol.includes(historicalRoundRecords.get(relative)),
        `historical round record is not declared in the maintenance protocol: ${relative}`);
    }
  }
  assert.doesNotMatch("report-0.16.003_ko.md",
    /^report-(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)_ko\.md$/,
    "repair-release report accepts a non-canonical semver");
  const blueprints = fs.readdirSync(path.join(root, "docs", "blueprints"));
  assert.ok(blueprints.length > 0 && blueprints.every((name) => name.endsWith(".md")),
    "docs/blueprints is empty or contains a non-snapshot artifact");
});

test("release manifests match and the Codex manifest carries the shared hook", () => {
  const claude = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8"));
  const codex = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
  const hooks = JSON.parse(fs.readFileSync(path.join(root, "hooks", "hooks.json"), "utf8"));
  assert.equal(codex.version, claude.version);
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.hooks, "./hooks/hooks.json");
  assert.equal(hooks.hooks.SessionStart[0].hooks[0].timeout, 5);
});

test("the Windows installer keeps its UTF-8 BOM", () => {
  const bytes = fs.readFileSync(path.join(root, "codex", "install.ps1"));
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
});

test("active adapters do not call the removed global-hook registrar", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh"]) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    assert.doesNotMatch(text, /install-codex-hook\.js/, relative);
  }
});

test("both installers confirm one exact native plugin before removing the predecessor", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh"]) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    assert.match(text, /codex plugin list --json/, relative);
    assert.match(text, /verify-codex-plugin-install\.js/, relative);
    assert.doesNotMatch(text, /plugin list(?: 2>&1)?[\s\S]{0,160}(?:-match|grep[^\n]*-q)[^\n]*devflow@nanomia/, relative);
  }
});

test("each canonical companion is referenced only by its consumers", () => {
  const verificationPredicates = fs.readFileSync(path.join(root, "skills", "principles", "verification-predicates.md"), "utf8");
  const baselinePredicates = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const consumersOf = (companion) => skillDirs
    .filter((dir) => fs.readFileSync(path.join(dir, "SKILL.md"), "utf8").includes("`../principles/" + companion + "`"))
    .map((dir) => path.basename(dir))
    .sort();
  // The state tool executes both predicate companions, so no skill reads either at runtime.
  // The files stay one more release and are deleted in the next; until then the invariant is
  // that nobody reads them, which is what makes that deletion safe.
  assert.deepEqual(consumersOf("state-predicates.md"), []);
  assert.deepEqual(consumersOf("verification-predicates.md"), []);
  // resume drops out of the baseline canon too: it reads only the tool's `baseline:` lines,
  // plus the one `Writers and replacement boundaries` range its own row names.
  assert.deepEqual(consumersOf("baseline-predicates.md"), ["adopt", "arch", "verify"]);
  // Every skill that lost a companion gained the same call, so no judgment lost its executor.
  for (const name of ["resume", "verify", "work", "split", "arch", "adopt"]) {
    assert.match(
      fs.readFileSync(path.join(root, "skills", name, "SKILL.md"), "utf8"),
      /node \.\.\/principles\/scripts\/project-state\.mjs state/,
      `${name} must call the state tool for the judgments it stopped computing`,
    );
  }
  assert.deepEqual(consumersOf("planning-evidence.md"), ["adopt", "arch", "product", "split"]);
  for (const name of ["work", "verify", "resume", "design"]) {
    assert.doesNotMatch(
      fs.readFileSync(path.join(root, "skills", name, "SKILL.md"), "utf8"),
      /planning-evidence\.md/,
      `${name} must not read the planning-evidence companion`,
    );
  }
  for (const name of ["split", "work", "resume"]) {
    assert.doesNotMatch(
      fs.readFileSync(path.join(root, "skills", name, "SKILL.md"), "utf8"),
      /baseline-predicates\.md/,
      `${name} must not read the baseline companion directly`,
    );
  }
  // A companion is delivered beside its skill on every platform, so it never points upward.
  assert.doesNotMatch(verificationPredicates, /`state-predicates\.md`|`\.\.\//);
  assert.doesNotMatch(baselinePredicates, /`state-predicates\.md`|`\.\.\//);
});

test("the Codex installer has one channel and cleans its own generated prompts", () => {
  const ps1 = fs.readFileSync(path.join(root, "codex", "install.ps1"), "utf8");
  const sh = fs.readFileSync(path.join(root, "codex", "install.sh"), "utf8");
  const cleanup = fs.readFileSync(path.join(root, "scripts", "remove-generated-codex-prompts.js"), "utf8");
  for (const [name, text] of [["install.ps1", ps1], ["install.sh", sh]]) {
    assert.match(text, /remove-generated-codex-prompts\.js/, name);
    // no second channel: nothing writes into the flat prompts folder any more
    assert.doesNotMatch(text, /prompts[\/]devflow-|installed: \/devflow-/, name);
    assert.doesNotMatch(text, /PRINCIPLES|\$principles/, name);
    // the legacy global hook survives until the user has confirmed the plugin hook
    assert.doesNotMatch(text, /node .{0,60}remove-legacy-codex-hook\.js"?\)?\s*$/m, name);
    assert.match(text, /open \/hooks in a Codex session and confirm/, name);
    assert.match(text, /remove-legacy-codex-hook\.js/, name);
  }
  const { GENERATED_NAMES } = require("./remove-generated-codex-prompts.js");
  assert.equal(GENERATED_NAMES.length, skillDirs.length - 1, "one generated name per non-principles skill");
  assert.match(cleanup, /a file a user wrote under the same name is left alone/);
});

test("task-local execution state stays on the card, not in journal or an assignment field", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const deployText = [
    split,
    fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8"),
  ].join("\n");
  assert.match(split, /^Approval:\s+pending \| YYYY-MM-DDTHH:MM:SSZ; parallel: <number\+number\|none>$/m);
  assert.match(split, /^Review:\s+required \| waived$/m);
  assert.doesNotMatch(deployText, /^Assignment:/m);
  assert.doesNotMatch(deployText, /journal approval|approval line|per-card execution-proposal approvals/i);
});

test("brownfield, layer-opening, and product-re-run states have producers and consumers", () => {
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const product = fs.readFileSync(path.join(root, "skills", "product", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");

  assert.match(arch, /^Brownfield: no$/m);
  assert.match(adopt, /`Brownfield: yes`/);
  assert.match(split, /When arch\.md says `Brownfield: yes`/);
  assert.match(resume, /\| `setup\.brownfield-field` \| ask once, "Did implementation code exist before devflow entered\?"/);

  const layerMarker = /YYYY-MM-DDTHH:MM:SSZ layer opening: parent: <devflow\/tree or folder path with status suffixes removed>; children: <number\+number>; source-json: <JSON string containing the exact durable source locator>/;
  assert.match(principles, layerMarker);
  assert.match(split, /`split — begin <parent>`/);
  assert.match(principles, /layer-opening marker/);
  assert.match(resume, /\| `transition\.layer-opening` \| split — take that marker together with every marker carrying the same `source-json`/);

  const productMarker = /YYYY-MM-DDTHH:MM:SSZ product re-run pending: statement-json: <JSON string containing the whole disproved identity or success-criterion text>/;
  assert.match(principles, productMarker);
  assert.match(product, /product re-run pending/);
  assert.match(resume, /\| `marker\.product-rerun` \| product \|/);

  const maintenanceMarker = /YYYY-MM-DDTHH:MM:SSZ maintenance routing pending: request-json: <JSON string containing the whole user request>/;
  assert.match(principles, maintenanceMarker);
  assert.match(adopt, /maintenance routing pending/);
  assert.match(resume, /\| `request\.existing` \| split — plan that line's request through maintenance routing \|/);

  assert.match(product, /decode each `statement-json` as a JSON string/);
  assert.match(split, /decode `request-json` as a JSON string/);
  assert.match(principles, /does any `-json` value fail to parse as a JSON string/);
});

test("remote evidence wait has one durable format and an execution consumer", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ evidence-wait: card-json: <JSON string containing the full task-card path>; checkpoint: <NN\.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ evidence-finalizing:/);
  assert.match(principles, /checkpoint's exact message is `<id> NN\.N wip: evidence-wait`/);
  assert.match(principles, /remote evidence check: check-json: .*; verdict: unrun \| pass \| fail \| pending \| inaccessible \| no-verdict; detail-json:/);
  assert.match(work, /A committed `evidence-finalizing` line in HEAD means the final task commit is done/);
  assert.match(work, /canonical exact evidence-wait\s+checkpoint message/);
  assert.match(work, /last uncommitted `remote evidence check` line has the same `check-json` with\s+`verdict: fail`/);
  assert.match(work, /run its `check-json` command or open its URL only\s+after pushing/);
  assert.match(work, /make no final task\s+commit/);
});

test("verification events use a durable three-state record and revision-independent product key", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const state = fs.readFileSync(path.join(root, "skills", "principles", "verification-predicates.md"), "utf8");
  assert.match(verify, /`pending · source id: <id> · event timestamp: <timestamp> · event key: <key>`/);
  assert.match(verify, /`awaiting user decision · source id: <same id>/);
  assert.match(verify, /routing · source id: <same id> · event timestamp: <same timestamp>/);
  assert.match(verify, /Take the lowest adopted number whose routing is pending/);
  assert.match(verify, /Process another pending finding only after\s+the active layer-opening marker is gone and that commit has landed/);
  assert.match(verify, /boundary — verify event <Audit\|Retrospective> <source id> pending/);
  assert.match(verify, /boundary — verify event <Audit\|Retrospective> <source id> result/);
  assert.match(verify, /boundary — verify event <Audit\|Retrospective> <source id> decision/);
  assert.match(verify, /journal request-line timestamp/);
  assert.match(state, /\| Audit \| `product` \|/);
  assert.match(state, /\| Retrospective \| `product` \|/);
  assert.doesNotMatch(state, /product <Product revision>/);
  assert.match(verify, /not run: scope unresolved/);
  assert.match(verify, /This completed entry\s+suppresses the same automatic key/);
  assert.match(resume, /\| `event\.pending` \| verify — run and record one runnable pending event \|/);
  assert.match(verify, /continue the caller's remaining state/);
  assert.match(verify, /exact blocking path or branch state and reason/);
  assert.match(verify, /Before an Audit, regardless of verdict/);
  assert.match(resume, /`blocked\.audits` does not gate a verdict/);
  assert.match(resume, /leave disk unchanged and skip those\s+candidates alone for the rest of this session's judgments/);
});

test("existing-record compatibility is an indexed, bounded read path", () => {
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(adopt, /under arch\.md's `Existing records`/);
  assert.match(arch, /`Existing records` is only a locator index/);
  assert.match(split, /mapped capability and `shared` in arch\.md's\s+`Existing records`/);
  assert.match(work, /Do not open a path listed only\s+in arch\.md's\s+`Existing records`/);
});

test("glossary has a producer and deterministic recovery on both project types", () => {
  const product = fs.readFileSync(path.join(root, "skills", "product", "SKILL.md"), "utf8");
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(product, /create only glossary\.md/);
  assert.match(adopt, /product\.md, code-style\.md, glossary\.md, and arch\.md/);
  // The missing-glossary condition is the tool's `setup:` zone now; the recovery split is
  // still resume's, and it still says "only" on both sides.
  assert.match(resume, /\| `setup\.layer0-incomplete` \| ask the same question/);
  assert.match(resume, /yes makes adopt reverse-derive only the documents `missing` names/);
  assert.match(resume, /no makes product create only glossary\.md without changing the confirmed product\.md/);
});

test("explicit product verification and capability closure markers have resume consumers", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification requested/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification running:/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification result:/);
  assert.match(resume, /\| `event\.product-requested` \| verify — product layer \|/);
  assert.match(resume, /\| `transition\.product-running` \| verify — rerun the recorded flight \|/);
  assert.match(resume, /\| `transition\.product-result` \| verify — finish the stored result's failure routing, events, and report \|/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ capability closing: folder: <devflow\/tree\/capability folder path with status suffixes removed>; head: <git rev-parse HEAD>; product: <Product revision>; verification: <Verification revision>; capability: <Capability revision>/);
  assert.match(verify, /`boundary — begin <capability number>`/);
  assert.match(verify, /`boundary — product verification running`/);
  assert.match(verify, /`boundary — product verification result`/);
  assert.match(verify, /`boundary — product verification reported`/);
  assert.match(verify, /a complete current Record contains all four current revisions[\s\S]*every new `routing: pending`[\s\S]*Failure\s+history, Audit, and Retrospective sections from HEAD/);
  assert.match(verify, /canonical interrupted product-result\s+write[\s\S]*completeness element\s+missing are a partial write[\s\S]*Repeat the product procedure from step\s+2/);
  assert.match(verify, /At the capability layer[\s\S]*file is complete, do not execute again[\s\S]*capability verification result[\s\S]*step 7's capability-closing begin commit/);
  assert.match(verify, /Current revisions\s+and a new verdict with any completeness element missing are a partial write[\s\S]*Repeat\s+the capability procedure from step 2[\s\S]*step-5 closure gates/);
  assert.match(verify, /rejoin the branch determined by steps 4 and 5/);
  assert.match(verify, /before selecting the entry, first land this run's complete verify\.md and all its\s+new pending entries as `boundary — capability verification result <capability number>`/);
  assert.match(principles, /Land a capability verification's fail or unverified result[\s\S]*`boundary — capability verification result <capability number>`/);
  assert.match(resume, /\| `marker\.capability-closure` \| verify — finish the interrupted capability closure \|/);
  assert.match(resume, /first finish the missing output and that state or routing commit/);
});

test("a Git-work-tree operation blocks every normal route without breaking non-Git projects", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const state = fs.readFileSync(path.join(root, "skills", "principles", "state-predicates.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /`git rev-parse --is-inside-work-tree` returns\s+`true`/);
  assert.match(principles, /Otherwise skip the gate and do not initialize Git/);
  assert.match(principles, /Immediately on entry before normal\s+routing, execution, or any path change/);
  assert.match(principles, /check whether `git\s+status` reports an open rebase or merge/);
  assert.match(principles, /Before the\s+user decides, change no path and make no commit/);
  assert.match(principles, /Never abort automatically/);
  assert.match(principles, /confirmed conflict-resolution paths and commits Git\s+makes while continuing the existing operation/);
  assert.ok(
    resume.indexOf("| `git.open-operation` |") <
      resume.indexOf("| `transition.prepared-route` |"),
    "an open Git operation must outrank every devflow recovery route",
  );
  assert.doesNotMatch(principles, /40-character/);
  assert.match(principles, /unabbreviated full\s+commit object ID/);
  assert.match(state, /A task-card number matches\s+`\[0-9\]\+\[a-z\]\*\(\?:\\\.\[0-9\]\+\[a-z\]\*\)\+`/);
  assert.match(principles, /Canonical ordering has only two orders[\s\S]*Canonical path order[\s\S]*Canonical card-number order/);
  for (const consumer of [state, split, work, verify, resume]) {
    assert.doesNotMatch(consumer, /lexically first|lexicographically first|path string ascending|path ascending/);
  }
});

test("a capability pass cannot close with old gates and its closure is prefix-recoverable", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(verify, /Standards: pending for current pass/);
  assert.match(verify, /Recalculate both step-5 gates/);
  assert.match(verify, /Before calculating revisions for a new product- or capability-layer verification/);
  assert.match(verify, /return without writing or executing to the\s+canonical target-owning skill/);
  assert.match(verify, /After that skill lands its binding decision, repeat step 7 with the changed\s+revisions/);
  assert.match(verify, /verify\.md below the still-open\s+capability folder; journal\.md; then the capability-folder rename that adds `\.done`/);
  assert.match(verify, /whole working-tree diff must equal\s+exactly one prefix of that order/);
  assert.match(verify, /canonical step-8 closure\s+prefix/);
});

test("capability knowledge has one executable canon and bounded consumers", () => {
  const proposal = fs.readFileSync(path.join(root, "docs", "rounds", "v0.10.0", "proposal.md"), "utf8");
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const retrospector = fs.readFileSync(path.join(root, "skills", "verify", "retrospector.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const active = [arch, adopt, split, work, reviewer, verify, retrospector, resume].join("\n");

  assert.match(proposal, /Historical record of an adopted design\. Not an executable contract/);
  assert.match(proposal, /executable contract exists only in\s+`skills\/principles\/baseline-predicates\.md`/);
  assert.doesNotMatch(proposal, /capability_baseline/);

  assert.match(baseline, /Capability\s+knowledge baselines are always on; there is no\s+per-project switch/);
  assert.match(baseline, /arch, adopt, and verify read this canon directly; resume opens only\s+the `Writers and replacement boundaries` section, and work, reviewer, and retrospector\s+receive only their required projections/);
  assert.match(baseline, /Each file contains exactly one `## Verified state` H2 heading/);
  assert.match(baseline, /bytes before it are the \*\*design zone\*\*[\s\S]*heading through end of file is the \*\*verified\s+zone\*\*/);
  assert.match(baseline, /\| 7 \| Design metadata \| design \|[\s\S]*\| 15 \| Verification metadata \| verified \|/);
  assert.match(baseline, /^Capability number: 02$/m);
  assert.match(baseline, /^Purpose: <why it exists and what it implements, one line>$/m);
  assert.match(baseline, /^Boundary: owns <owned scope>; does not own <neighbor capability number and name, or none>$/m);
  assert.match(baseline, /^Trust: design reflects confirmed Layer 0; verified state reflects the last passing capability verification, or contains no evidence before one\. Judge each zone by its metadata\.$/m);
  assert.match(baseline, /^Design head: <output of the Design head command>$/m);
  assert.match(baseline, /^Verified at: <YYYY-MM-DDTHH:MM:SSZ \| none>$/m);
  assert.match(baseline, /^Covered cards: \["02\.1","02\.2","02\.2b"\]$/m);
  assert.match(baseline, /^Scope paths: \["src\/payment\/\.\.\.", \.\.\.\]$/m);
  assert.match(baseline, /^Consumed paths: \["src\/customer\/contract\.ts", \.\.\.\]$/m);
  assert.match(baseline, /^Scope head: <output of the Scope head command \| none>$/m);
  assert.match(baseline, /git log -1 --format=%H --\s+devflow\/project\/product\.md devflow\/project\/arch\.md devflow\/project\/glossary\.md/);
  assert.match(baseline, /^  git log -1 --format=%H -- devflow\/project\/product\.md devflow\/project\/arch\.md devflow\/project\/glossary\.md$/m);
  assert.match(baseline, /union is empty[\s\S]{0,120}`Scope head: none`/);
  assert.match(baseline, /Never run\s+pathless `git log -1`/);
  assert.match(baseline, /arch, or adopt in a brownfield, replaces from file start up to but excluding[\s\S]*verify replaces from `## Verified state` through end of file/);
  assert.match(baseline, /The expected set is the foundation plus every non-retired capability number/);
  assert.match(baseline, /Before either exists, use the product\.md\s+capability name exactly as split would use it in the tree; invent no separate slug\s+normalization/);
  // The filename placeholder names the capability name itself, so it cannot ask for the
  // slug the rule directly above forbids inventing.
  assert.match(baseline, /`devflow\/project\/capabilities\/NN-<capability-name>\.md`/);
  assert.doesNotMatch(baseline, /capability-name-slug/);
  // The first-4-lines rule defers to the heading order above it, which starts at `## Intent`.
  assert.match(baseline, /readable in the first 4 lines, followed by the\s+sections in the order above/);
  assert.doesNotMatch(baseline, /followed immediately\s+by `Concept model`/);
  assert.match(baseline, /absent means no same-numbered baseline in HEAD/);
  assert.match(baseline, /Working-tree bytes with\s+no HEAD counterpart have nothing to preserve, so the creation replaces them/);
  assert.match(baseline, /Those three paths are the only\s+sources for `Design head`/);
  assert.match(baseline, /work parses the leading number of the depth-1 ancestor directly below `devflow\/tree\/`/);
  assert.match(baseline, /Do not copy\s+baseline or ADR paths into cards/);
  assert.match(baseline, /remains in a card's\s+`Read first` is legacy wiring[\s\S]*select and shape-gate only through the number rule/);
  assert.match(baseline, /With all\s+three present, resume resolves the target by the canonical rules' canonical recognition/);
  assert.match(baseline, /With an empty resolution set it reports only foundation plus non-retired number\/name\s+candidates and asks; with two or more it reports only the resolved candidates and asks/);
  assert.match(baseline, /registered consumers: <number \(status\), \.\.\. \| none>/);

  assert.match(baseline, /a\s+commit containing capability documents only, `arch — capabilities` or\s+`adopt — capabilities`, is the last commit of that run/);
  assert.match(arch, /run the\s+canonical baseline predicates' design-writer procedure/);
  assert.match(adopt, /run the canonical\s+baseline predicates' brownfield design-writer procedure/);
  assert.doesNotMatch(split, /capability_baseline|baseline's exact path/);
  assert.match(work, /depth-1 ancestor directly below\s+`devflow\/tree\/`/);
  assert.match(work, /baseline path directly under\s+`devflow\/project\/capabilities\/` is legacy wiring[\s\S]*defer it to the number judgment/);
  assert.match(work, /select its path but do not open the body\s+yet[\s\S]*only when its shape gate permits, read both\s+zones and the exact Binding ADR paths/);
  assert.match(reviewer, /design zone of the capability document[\s\S]*every existing file at an exact path listed in that zone's Binding\s+ADRs section/);
  assert.match(reviewer, /baseline missing[\s\S]{0,80}judge from the card and supplied shared documents/);
  assert.match(reviewer, /Apply supplied Binding ADRs as binding intent\. A baseline summary cannot override them/);
  assert.match(reviewer, /design: hypothesis — <exact path#heading reconfirmed\[, \.\.\.\]>/);
  assert.match(verify, /replace from exactly one `## Verified state`\s+heading through EOF/);
  assert.match(verify, /union of the closing baseline's HEAD-before and refreshed-after Scope paths/);
  assert.match(verify, /Capability first closure[\s\S]*every legacy `ADR-NNN\.md` directly under[\s\S]*Binding ADRs list/);
  assert.match(retrospector, /do not use a hypothetical verification\s+statement as strain evidence/);
  assert.match(retrospector, /supplied product\.md, arch\.md,\s+glossary\.md, or ADRs/);
  assert.match(resume, /^## Domain-Entry Questions$/m);
  assert.match(resume, /When the `setup:` zone is not empty, report only each exact missing path or field it\s+names and `domain knowledge not initialized`; open no capability body/);
  assert.match(resume, /no same-numbered file exists for the selection, including foundation/);
  assert.match(resume, /zero or multiple boundaries follow the\s+`next: baseline\.boundary` row[\s\S]*verified-only shape\s+anomaly/);
  assert.match(resume, /With an empty resolution set, present only foundation\s+plus non-retired number\/name candidates and ask; with two or more, present only the\s+resolved candidates and ask\. Open no body before the answer/);
  assert.match(resume, /only when the user\s+explicitly requests the full expected set/);
  assert.doesNotMatch(active, /capability_baseline/);
});

test("domain knowledge capsules are bounded, provenance-marked, and reachable only by exact path", () => {
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");

  // The capsule contract lives in exactly one canon; every other file points at it.
  assert.match(baseline, /^## Domain knowledge capsules$/m);
  assert.match(baseline, /K-<three digits, zero-padded>-<topic slug>\.md/);
  assert.match(baseline, /`# <what it is> · <when to open it>`[\s\S]*`about: <the words a searcher would use that are not already in line one>`/);
  assert.match(baseline, /A capability without capsules is the default/);
  assert.match(baseline, /`Source basis: \[\.\.\.\]`/);
  // Unmarked is the default, so most of a capsule leans on Source basis: it must be checked
  // as hard as the rare insertion coordinate, or the load and the checking sit on opposite sides.
  assert.match(baseline, /every element must be a\s+string satisfying the coordinate grammar below/);
  assert.match(baseline, /\*\*`validate` checks each element's path existence and line range with the same strength as\s+an insertion coordinate\*\*/);
  assert.match(baseline, /\*\*It cannot be empty\*\*/);

  // The owner's anti-rigidity requirement: default unmarked, four closed heads, no quota.
  assert.match(baseline, /^### Provenance marks — unmarked is the default$/m);
  assert.match(baseline, /There is no marking quota — a faithful capsule with zero marks is normal/);
  // The vocabulary has one home, and an unlisted head is rejected with or without a coordinate —
  // the pair of rules that keeps a misspelled `conjecture` from passing as unmarked source.
  assert.match(baseline, /\*\*This section is the canonical home of this vocabulary, and a head that is not listed here\s+is rejected whether or not it carries a coordinate\*\*/);
  assert.match(baseline, /`conjecture` in particular is the\s+only head with no coordinate/);
  assert.match(baseline, /a token a machine reads\s+does not follow a human language/);
  for (const head of [
    "  - `(synthesis@<coordinate>[,<coordinate>]: free prose)`",
    "  - `(code@<coordinate>[,<coordinate>]: free prose)`",
    "  - `(conjecture: free prose)`",
    "  - `[dispute C-<three digits>@<coordinate>,<coordinate>: free prose]`",
  ]) {
    assert.ok(baseline.includes(head), `capsule head vocabulary missing: ${head}`);
  }
  // conjecture carries no coordinate; that asymmetry is what keeps a guess from citing evidence.
  assert.match(baseline, /`\(conjecture: free prose\)` — a judgment with no coordinate to pin it to/);
  assert.match(baseline, /Source silence is written as a sentence, not a mark/);
  assert.match(baseline, /Do not pick one side and smooth it over — keep both contents, each\s+with its own coordinate/);
  assert.match(baseline, /Two distinct coordinates are required/);

  // Soft authoring cap, hard opening cap: the asymmetry is the point.
  assert.match(baseline, /authoring cap is soft at 120 lines per capsule/);
  assert.match(baseline, /^### Opening budget — a hard cap$/m);
  assert.match(baseline, /at most 240 lines or 24 KiB[\s\S]*open none[\s\S]*explicit approval is this cap's only exit/);
  assert.match(baseline, /Do not create a hand-written index\s+section in the capability document/);

  // Ownership, source disposition, and the consumers are wired exactly once each.
  assert.match(principles, /knowledge capsule folder belongs to the design-zone\s+writer/);
  assert.match(principles, /never delete, move, or edit the source documents a capsule was\s+processed from/);
  assert.match(principles, /capability documents and their knowledge capsules as\s+`arch — capabilities`/);
  assert.match(arch, /moves down into the canonical\s+baseline predicates' knowledge capsules/);
  assert.match(adopt, /\*\*Capsule processing\.\*\*[\s\S]*provenance\s+sampling check that finds three unmarked sentences per capsule/);
  assert.match(adopt, /Deleting or moving the source is not part of this procedure/);
  assert.match(split, /read only the header\s+projection[\s\S]*never a capsule body/);
  assert.match(split, /does not apply to capsule\s+paths — a capsule is not reached by the depth-1 number rule/);
  assert.match(work, /enforces the opening budget as a hard cap — over it, it returns zero bodies/);
  assert.match(work, /`conjecture` sentence is not an\s+implementation basis/);
  assert.match(resume, /a request for all of them is that budget's\s+explicit approval/);
  // Every consumer that reads capsules names an executable command, never "a machine query":
  // a literal reader with no command either stops or invents one.
  for (const [name, text] of [["split", split], ["work", work], ["resume", resume]]) {
    assert.match(text, /node <plugin root>\/scripts\/project-knowledge\.mjs project --capability <capability number>/,
      `${name} has no executable index-projection command`);
  }
  // verify needs both arms, and only `disputes` carries them — `project` gives the id alone.
  assert.match(verify, /node <plugin root>\/scripts\/project-knowledge\.mjs disputes --capability <capability number>/,
    "verify does not call the dispute-only projection");
  assert.doesNotMatch(verify, /project --capability/,
    "verify still reaches for the projection that drops both arms");
  for (const [name, text] of [["work", work], ["resume", resume]]) {
    assert.match(text, /select --path/, `${name} has no executable body-opening command`);
  }
  assert.match(baseline, /`project --capability <number>`\s+is the canonical call/);
  // The index is bounded in two tiers so a large capability stays selectable rather than blocked.
  assert.match(baseline, /An unfiltered `project` gathers every capability's first two lines at once\s+and overruns the index budget/);
  assert.match(baseline, /the\s+full projection when it fits \(`form=full`\), and otherwise an automatic downgrade to a\s+compact projection/);
  assert.match(baseline, /When even compact overruns, it reports zero entries and the\s+filters to narrow by/);
  // `disputes` is a canonical means, not a fifth undocumented command.
  assert.match(baseline, /`project`, `disputes`, `select`, and `validate` subcommands/);
  assert.match(baseline, /a consumer that must show a\s+person both arms calls `disputes`/);
  // verify must reach both arms without opening a body — the projection carries them, or it
  // says so; opening a capsule to show the two arms is the one shortcut that is forbidden.
  assert.match(verify, /the C number, both\s+coordinates, and the source content each coordinate points at/);
  assert.match(verify, /opening one to show the two arms is the\s+shortcut forbidden here/);
  assert.match(verify, /blocks no closure, and writes no capsule/);

  // The canon and the tool must name the same four heads. A capsule written to the canon while
  // the tool recognized a different vocabulary validated clean with every mark silently dropped;
  // prose-only assertions could not see that, so compare the two artifacts directly.
  const capsuleTool = fs.readFileSync(path.join(root, "scripts", "project-knowledge.mjs"), "utf8");
  for (const head of ["synthesis", "code", "conjecture", "dispute"]) {
    assert.ok(capsuleTool.includes(`"${head}"`), `the capsule tool does not recognize the head ${head}`);
  }
  assert.equal(capsuleTool.split(/\r?\n/).filter((line) => /\\u[0-9a-fA-F]{4}/.test(line)).length, 0,
    "the capsule tool hides characters behind unicode escapes");

  // Intent overview is the unconditional reach point that capsules must not absorb.
  assert.match(baseline, /^\| 2 \| Intent overview \| design \|/m);
  assert.match(baseline, /unconditional reach point for\s+intent that runs through the whole capability/);
  assert.match(baseline, /`## Intent`, `## Concept model`/);
  assert.match(arch, /Derive only purpose, boundary, Intent overview/);
  assert.match(adopt, /Derive purpose, boundary, Intent overview/);
});

test("capability knowledge lifecycle has deterministic creation, recovery, and rename routes", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const product = fs.readFileSync(path.join(root, "skills", "product", "SKILL.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const adopt = fs.readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const retrospector = fs.readFileSync(path.join(root, "skills", "verify", "retrospector.md"), "utf8");

  assert.match(baseline, /initialization exception[\s\S]*absent file or after the user explicitly chooses to\s+reset a zero- or multiple-boundary file[\s\S]*verify is the sole writer/);
  assert.match(baseline, /^## v0\.10 Baseline Migration$/m);
  assert.match(baseline, /zero `## Verified state` headings[\s\S]*`## Conceptual model`[\s\S]*`## Machine block`, in that order/);
  assert.match(baseline, /Machine block has only `Capability number`, `Verified at`, `Covered cards`, `Scope[\s\S]*paths`, `Scope head`, and `Docs head`/);
  assert.match(baseline, /Apply this section to no other zero-boundary file/);
  assert.match(baseline, /Preserve the body bytes of the old Main\s+flow, Lifecycle, Current behavior, Entrypoints, Traps, and Verify[\s\S]*add `Consumed paths: \[\]` and `Scope\s+head: none`[\s\S]*discard the old `Scope head` and `Docs head`/);
  assert.match(baseline, /old `Scope head` was\s+calculated from Scope paths alone[\s\S]*verified statements are hypotheses immediately after migration/);
  assert.match(principles, /exact mechanical v0\.10 migration/);
  assert.match(baseline, /In the ordinary design batch, arch or adopt derives the design zone anew from current Layer\s+0 and transforms the verified zone mechanically/);
  assert.match(baseline, /Except for the exact v0\.10 migration below,\s+never auto-heal zero or multiple boundaries/);
  assert.match(resume, /\| `baseline\.legacy-v010` \| with `Brownfield: yes`, adopt; with `no`, arch — migrate to current Layer 0 design plus the mechanically carried verified zone \|/);
  assert.match(work, /capability document in the earlier shape[\s\S]*open no body/);
  assert.match(verify, /baseline no-op: legacy v0\.10 migration pending[\s\S]*do not migrate its verified zone/);
  assert.match(baseline, /uncommitted diff from a post-confirmation interrupted write is a capability-design[\s\S]*regenerate the whole expected set/);
  assert.doesNotMatch(baseline, /equals the\s+current writer's final re-derivation from HEAD/);
  assert.match(baseline, /user-confirmed boundary reset is not\s+recovered as a prefix/);
  assert.match(baseline, /Writer eligibility and begin recovery judge\s+the boundary count in the HEAD file/);
  assert.match(baseline, /restores those bytes to the damaged\s+file's current expected path/);
  assert.match(baseline, /head values the migration discards take no part in this judgment/);
  assert.match(baseline, /Restore that path to its HEAD\s+content, and leave no working-tree file there when HEAD has none/);
  assert.match(baseline, /machine query \*\*against the HEAD file\*\*/);
  assert.match(baseline, /Every routing judgment, including absence\s+and boundary count, therefore uses the same HEAD values as writer eligibility/);
  assert.match(baseline, /gives an exact v0\.10 file the mechanical verified-zone transformation below/);
  assert.match(arch, /only capability documents are\s+missing or need repair/);
  assert.match(resume, /\| `baseline\.boundary` \|/);
  assert.match(principles, /user-identified Git revision to its current expected path/);
  assert.match(verify, /a standard-refresh-set input cannot\s+be parsed/);
  assert.match(verify, /recalculate this closure's capability code\s+scope and consumed paths from current topology/);
  assert.match(resume, /skip only the `baseline:` zone's three kinds during the\s+rest of this session's judgments/);
  assert.match(resume, /split's maintenance-mapping\s+gate does not open on that deferral/);
  assert.match(adopt, /When Layer 0 is complete and\s+only capability documents are missing or need repair/);
  assert.match(baseline, /present them as one batch; change no\s+capability-document path before the user confirms that batch/);
  assert.match(baseline, /Show the exact migrating paths and this mechanical transformation with the design batch\.\s+After the user confirms the batch, land it in the same capability-design commit/);
  assert.match(baseline, /Do not load the whole original into the report\. Report its path, the HEAD boundary count\s+that selected this route, the working-tree\s+boundary count and line count, the HEAD blob object ID for that exact path or `none`, and\s+the expected boundary/);
  assert.match(baseline, /The HEAD blob identifies provenance; it is not presumed valid/);
  assert.match(baseline, /resume writes no file and offers only two choices: after confirming that a user-identified\s+Git revision and path has one boundary, the user restores those bytes to the damaged\s+file's current expected path and commits only that file[\s\S]*or the user discards the old verified\s+prose/);
  assert.match(baseline, /Search no history for a known-good revision/);
  assert.match(resume, /\| `baseline\.boundary` \| resume — read only the canonical baseline predicates' `Writers and replacement boundaries` section and apply it exactly \|/);
  assert.match(baseline, /When a file is absent or the user confirms a boundary reset, arch or adopt creates both\s+zones; verified sections start as/);
  assert.match(baseline, /user-confirmed deletion exception changes no path and has a diff with zero added lines/);
  assert.match(baseline, /fixed section headings[\s\S]*metadata fields are not deletion-exception targets/);
  assert.match(baseline, /Do not use this exception for the last admissible body item in a section[\s\S]*replace the section body with `None\.`/);
  assert.match(baseline, /person making a direct deletion commits that deletion alone before the next devflow\s+skill runs/);
  assert.match(baseline, /Preserve an\s+`external` Trap's HEAD row byte-for-byte unless a person authorizes deletion/);
  assert.match(baseline, /the selected unit's number names the same-numbered capability document/);
  assert.match(baseline, /Before opening a body, exactly one same-numbered file[\s\S]*read only valid files, skip anomalous\s+numbers, and continue/);
  assert.match(resume, /Before opening a body,\s+require exactly one same-numbered file with `shapeValid` true and one fixed boundary/);
  assert.match(resume, /When a Binding ADR path is absent, report the exact path that line names, make the\s+design zone a hypothesis, and search for no substitute/);
  assert.match(baseline, /union of that provider's Scope paths before the\s+refresh in HEAD and after the refresh/);
  assert.match(baseline, /Consumed contracts has exactly one row per `Consumed paths` member in the same canonical\s+path order and no other row/);
  assert.match(baseline, /every\s+other-capability number equals the provider currently mapped by arch\.md's Code structure/);
  assert.match(baseline, /projects only number, `Verified\s+at`, `Consumed paths`, `Scope paths`, `Covered cards`, `Scope head`, and the exact-path and\s+other-capability-number columns of Consumed contracts/);
  assert.match(baseline, /`fresh` only when `Verified at` is not `none`[\s\S]*both relation representations and the current provider mapping agree[\s\S]*When\s+the required fields parse and any condition is false, it is `hypothesis`[\s\S]*Git comparison cannot execute, it is\s+`unknown`/);
  assert.match(baseline, /visits, in ascending integer order, every non-retired capability\s+number in the current expected set except the provider[\s\S]*foundation is not a candidate/);
  assert.match(baseline, /first zero or multiple match[\s\S]*registered consumers: unknown/);
  assert.match(baseline, /candidate's number or `Consumed paths` cannot be parsed[\s\S]*same\s+unknown form/);
  assert.match(baseline, /valid Binding ADRs section[\s\S]*absent or unparseable[\s\S]*open and infer no ADR path/);
  assert.match(work, /With one boundary, open only exact paths from a valid Binding ADRs section[\s\S]*absent or unparseable[\s\S]*guess no substitute/);
  assert.match(baseline, /A provider closure, capability retirement or split, and any other binding decision that\s+changes path ownership reports one line/);
  assert.match(baseline, /retirement or split that does not change path\s+ownership, use the original capability's stored Scope paths/);
  assert.match(baseline, /A rename re-derives every expected design zone[\s\S]*identified by the other capability's number and exact code path/);
  assert.match(baseline, /current and final expected capability-document paths[\s\S]*rename may delete the old same-numbered path and add the final path[\s\S]*number-matched existing\s+file's HEAD verified zone/);
  assert.match(baseline, /registered consumers: unknown —\s+provider baseline no-op: <same reason>/);
  assert.match(verify, /When the baseline refresh is a no-op, run no consumer projection/);
  assert.match(baseline, /Delete any other Trap only when its reproduction condition[\s\S]*Replace the Verify section every time with only the\s+commands and scenarios actually run at this closure/);
  assert.match(baseline, /symmetric difference between the current completed-card set and\s+`Covered cards`[\s\S]*`<number> missing`[\s\S]*`<number> ambiguous`/);
  assert.match(baseline, /working-tree path may be absent, partial, or arbitrary bytes[\s\S]*same-numbered HEAD file's design zone[\s\S]*exactly one such HEAD file with one boundary exists[\s\S]*baseline no-op rather than prefix recovery/);
  assert.match(verify, /do not treat an absent, partial, or arbitrary\s+working-tree path as baseline absence[\s\S]*unique\s+same-numbered one-boundary HEAD file/);
  assert.match(resume, /symmetric difference in completed cards since the baseline/);
  assert.doesNotMatch(baseline, /Delete a Trap or Verify item/);

  const contradictionCheck = product.indexOf("For every re-run, first compare");
  const documentOnlyBranch = product.indexOf("When there is no contradiction but the capability list");
  assert.ok(contradictionCheck >= 0 && contradictionCheck < documentOnlyBranch);
  assert.match(arch, /When confirmed arch\.md says `Brownfield: yes`, do not run this section[\s\S]*adopt's\s+capability-document-only branch/);
  const adoptionMarker = adopt.indexOf("first append\nsplit's exact `maintenance routing pending`");
  const capabilityDocuments = adopt.indexOf("## Capability documents — final output after the adoption commit");
  assert.ok(
    adoptionMarker >= 0 && capabilityDocuments >= 0 && adoptionMarker < capabilityDocuments,
    "new-adoption maintenance state must land before the final capability-document commit",
  );
  assert.match(principles, /A capability's name changed[\s\S]*first update product\.md[\s\S]*following arch capability-design commit/);
  assert.match(principles, /Outside a canonical capability-design commit, the canonical human-deletion exception,\s+restoration of one complete one-boundary file from a user-identified Git revision to its current expected path, or this begin transition, any\s+`devflow\/project\/capabilities\/` diff is an integrity anomaly/);

  assert.ok(
    resume.indexOf("| `claim.mine` | work |") <
      resume.indexOf("| `baseline.design-refresh` |"),
    "an active claimed card must outrank baseline repair",
  );
  assert.match(work, /no capability document for <number>[\s\S]*continue from Layer 0 and the card/);
  assert.match(work, /exact-path set in Consumed contracts differs from `Consumed paths`[\s\S]*other-capability number differs from or is ambiguous under the current provider\s+mapping/);
  assert.match(work, /zero or multiple fixed boundaries, guess no zone and read no\s+body[\s\S]*baseline-missing\s+projection/);
  assert.doesNotMatch(work, /git log -1 --format=%H --\r?\n/);
  assert.doesNotMatch([arch, adopt, work].join("\n"), /conceptual model/i);
  assert.match(reviewer, /A baseline-missing projection is not itself an objection/);
  assert.doesNotMatch(verify, /indeterminate/);
  assert.match(retrospector, /At a product event only,[\s\S]*each exact Consumed path relation[\s\S]*provider named by that row's other-capability number[\s\S]*single-capability event cannot claim a cross-capability conflict/);
});

test("product verification is a committed single-flight state machine", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(verify, /exactly one active journal-state kind/);
  assert.match(verify, /otherwise\s+coalesce it into that run without appending/);
  assert.match(verify, /An existing result marker never reruns/);
  assert.match(verify, /Keep a product result marker while this result has a Failure history/);
  assert.match(verify, /report the stored verdict, revisions, and evidence/);
  assert.match(principles, /two or more active product-verification state kinds together/);
  assert.match(principles, /result line whose product, verification, code, or verdict field differs/);
});

test("requested verification and events do not preempt this session's claimed card", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(verify, /never preempts a task card claimed by this\s+session/);
  assert.match(verify, /When this session still holds a claimed card it was carrying, select no event/);
  assert.ok(
    resume.indexOf("| `claim.mine` | work |") <
      resume.indexOf("| `event.product-requested` |"),
    "claimed work must outrank a requested product verification",
  );
});

test("verification routing has reconstructible prepared state and repair lineage fixtures", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /Routing write order/);
  assert.match(principles, /replace `routing: pending`\s+with `routing prepared: <JSON object>` before output/);
  assert.match(principles, /keys `base`, `result`, and `operations`/);
  assert.match(principles, /`\{"op":"write"[\s\S]*`\{"op":"move"[\s\S]*`\{"op":"delete"/);
  assert.match(principles, /commit's first parent must equal\s+`base`/);
  assert.match(principles, /including staged, unstaged, and untracked paths/);
  assert.match(principles, /track the current\s+verify\.md path through each ancestor move/);
  assert.match(principles, /Never\s+select a new route or create the output twice/);
  assert.match(verify, /canonical prepared-route prefix/);
  assert.match(verify, /canonical\s+integrity item 14/);
  assert.match(resume, /\| `transition\.prepared-route` \| verify — compare and apply its payload/);

  for (const template of FAILURE_HISTORY_TEMPLATES) assert.ok(verify.includes(template), template);
  const historySamples = [
    "- source id: n0; timestamp: 2026-08-14T00:00:00Z; failure: first; routing: pending",
    "- source id: n1; timestamp: 2026-08-14T00:01:00Z; unverified: absent; signal card: 02.1; routing: pending",
    "- source id: n2; timestamp: 2026-08-14T00:02:00Z; failure: again; signal card: 02.2; repair lineage: 02@n0; recurrence observation: 1; routing: pending",
  ];
  assert.deepEqual(historySamples.map((line) => parseFailureHistoryFixture(line, "02")?.signalCard), [null, "02.1", "02.2"]);
  const semicolonBody = parseFailureHistoryFixture(
    "- source id: n3; timestamp: 2026-08-14T00:03:00Z; failure: POST /save; then GET /list; signal card: 02.1; routing: pending",
    "02",
  );
  assert.equal(semicolonBody?.message, "POST /save; then GET /list");
  assert.equal(semicolonBody?.signalCard, "02.1");
  assert.equal(parseFailureHistoryFixture(
    "- source id: bad; timestamp: 2026-08-14T00:03:00Z; signal card: 02.1; failure: wrong order; routing: pending",
    "02",
  ), null);
  assert.equal(parseFailureHistoryFixture(
    "- source id: bad; timestamp: 2026-08-14T00:03:00Z; failure: missing signal; repair lineage: 02@n0; recurrence observation: 1; routing: pending",
    "02",
  ), null);

  const normalizedRoutingCanon = [principles, verify, split].join("\n").replace(/\s+/g, " ");
  assert.equal(count(normalizedRoutingCanon, /routing: fix cards\b/g), 4);
  assert.doesNotMatch(normalizedRoutingCanon, /routing: fix card\b/);
  assert.deepEqual(ROUTING_FIX_CARDS.exec("routing: fix cards 02.1+02.2")?.[1].split("+"), ["02.1", "02.2"]);
  assert.equal(ROUTING_FIX_CARDS.exec("routing: fix card 02.1"), null);

  const fixtureFile = (targetKey, lines) => ({ targetKey, text: lines.join("\n") });
  const rootless = projectRepairLineageFixture([], ["02.9"]);
  assert.equal(rootless.blocked, false);
  assert.deepEqual(rootless.items[0], {
    label: "02.9",
    root: null,
    recurrenceObservation: null,
    previousRouteCards: [],
    inheritedCards: ["02.9"],
    humanGate: false,
  });

  const firstRepair = fixtureFile("02", [
    "- source id: a0; timestamp: 2026-08-14T01:00:00Z; failure: first; signal card: 02.1; routing: fix cards 02.1+02.2+02.10",
  ]);
  const recurrenceOne = projectRepairLineageFixture([firstRepair], ["02.2"]);
  assert.equal(recurrenceOne.items[0].root, "02@a0");
  assert.equal(recurrenceOne.items[0].recurrenceObservation, 1);
  assert.deepEqual(recurrenceOne.items[0].previousRouteCards, ["02.1", "02.2", "02.10"]);
  assert.deepEqual(recurrenceOne.items[0].inheritedCards, ["02.1", "02.2", "02.10"]);
  assert.equal(recurrenceOne.items[0].humanGate, false);

  const secondRepair = fixtureFile("02", [
    "- source id: a0; timestamp: 2026-08-14T01:00:00Z; failure: first; signal card: 02.1; routing: fix cards 02.3",
    "- source id: a1; timestamp: 2026-08-14T01:01:00Z; failure: again; signal card: 02.3; repair lineage: 02@a0; recurrence observation: 1; routing: fix cards 02.4",
  ]);
  const recurrenceTwo = projectRepairLineageFixture([secondRepair], ["02.4"]);
  assert.equal(recurrenceTwo.items[0].recurrenceObservation, 2);
  assert.deepEqual(recurrenceTwo.items[0].previousRouteCards, ["02.4"]);
  assert.equal(recurrenceTwo.items[0].humanGate, true);

  const otherRoot = fixtureFile("03", [
    "- source id: b0; timestamp: 2026-08-14T01:02:00Z; failure: other; signal card: 03.1; routing: fix cards 03.2",
  ]);
  const differentRoots = projectRepairLineageFixture([secondRepair, otherRoot], ["02.3", "03.2"]);
  assert.deepEqual(differentRoots.items.map((item) => item.root), ["02@a0", "03@b0"]);
  const rootedAndRootless = projectRepairLineageFixture([secondRepair], ["02.3", "04.1"]);
  assert.deepEqual(rootedAndRootless.items.map((item) => item.root), ["02@a0", null]);

  const sameRoot = projectRepairLineageFixture([firstRepair], ["02.1", "02.10"]);
  assert.deepEqual(sameRoot.items.map((item) => item.recurrenceObservation), [1, 1]);
  assert.deepEqual(sameRoot.items.map((item) => item.root), ["02@a0", "02@a0"]);

  const duplicateRoot = fixtureFile("03", [
    "- source id: b0; timestamp: 2026-08-14T01:03:00Z; failure: duplicate; signal card: 03.1; routing: fix cards 02.3",
  ]);
  const ambiguous = projectRepairLineageFixture([secondRepair, duplicateRoot], ["02.3", "04.1"]);
  assert.equal(ambiguous.blocked, true);
  assert.equal(ambiguous.ambiguous[0].label, "02.3");
  assert.deepEqual(ambiguous.ambiguous[0].roots, ["02@a0", "03@b0"]);
  assert.deepEqual(ambiguous.items, []);

  const nonCardRound = fixtureFile("02", [
    "- source id: a0; timestamp: 2026-08-14T01:00:00Z; failure: first; signal card: 02.1; routing: fix cards 02.3",
    "- source id: a1; timestamp: 2026-08-14T01:01:00Z; failure: again; signal card: 02.3; repair lineage: 02@a0; recurrence observation: 1; routing: documents [\"devflow/project/arch.md\"]",
  ]);
  const afterNonCard = projectRepairLineageFixture([nonCardRound], ["02.3"]);
  assert.equal(afterNonCard.items[0].recurrenceObservation, 2);
  assert.deepEqual(afterNonCard.items[0].previousRouteCards, ["02.3"]);
  assert.equal(afterNonCard.items[0].humanGate, true);
  assert.deepEqual(
    sortedCardNumbers(["02.10", "02.2b", "02.2", "02.1", "02.2"]),
    ["02.1", "02.2", "02.2b", "02.10"],
  );
});

test("routing reads integration state before local claimed work", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /Before routing, fetch integration and read this shared state at that tip/);
  assert.match(principles, /include the integration\s+tip in the current branch before local claimed work/);
  assert.match(principles, /runs even while a card is claimed/);
});

test("normal task completion has one final commit and a restartable boundary", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /last commit that changed it has this exact subject, the final task commit is complete/);
  assert.match(principles, /Canonical claim→done move/);
  assert.match(principles, /`transition: kind=finish-boundary case=claim-done-move` carries that fact/);
  assert.match(principles, /that commit includes the claimed card and its progress log/);
  assert.match(principles, /before writing any status rename, HANDOFF, journal, verify\.md, or feedback\s+document change/);
  assert.match(work, /make no second final task commit/);
  assert.match(work, /The rename commit to `\.wip-<my id>\.` is the claim/);
  assert.ok(
    work.indexOf("Integration gate") > work.indexOf("Final task commit")
      && work.indexOf("Integration gate") < work.indexOf("Land upper-document feedback"),
    "integration must precede every boundary working-tree mutation",
  );
  assert.match(resume, /\| `transition\.finish-boundary` \| work — make no second final task commit; finish only upper-document feedback and the boundary \|/);
});

test("a greenfield root cannot create an empty foundation or mistake waiting files for cards", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /waiting capability file, not a task card/);
  assert.match(split, /create no empty foundation folder/);
  assert.match(split, /`01-foundation\/` must have at least one direct card/);
  assert.match(resume, /\| `layer\.no-foundation` \| split — create `01-foundation\/` and at least one direct task card in the same layer \|/);
  assert.match(resume, /\| `ready\.waiting-capability` \| split — open one layer of that capability \|/);
});

test("dependency syntax is canonical while legacy cards have an explicit migration path", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const state = fs.readFileSync(path.join(root, "skills", "principles", "state-predicates.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(split, /^Depends:\s+none \| 02\.1, 03\.2$/m);
  assert.match(state, /Only a card\s+missing either `Approval` or `Review` is a legacy card/);
  assert.match(state, /git diff --name-only -z\s+--no-renames -- devflow\/tree/);
  assert.match(state, /git diff --cached --name-only -z --no-renames\s+<authority> -- devflow\/tree/);
  assert.match(state, /Split that output on NUL, never on newlines, and never drop\s+`--no-renames`/);
  assert.match(principles, /state predicates' canonical or legacy format/);
  // The parse and effectiveness judgments moved into the tool; the consumers now name the
  // zone kind that carries each one, so an unparseable member and an ineffective approval
  // still have exactly one named route each.
  assert.match(resume, /\| `claim\.depends-anomaly` \| split — replace it with the user-confirmed canonical dependency value/);
  assert.match(resume, /\| `ready\.approval-invalid` \| split — report the exact invalidity, reset `Approval` to `pending`/);
  assert.match(split, /`Approval` is not `pending` and `ready:` reports the card as `approval-invalid`/);
  const flatSplit = split.replace(/\s+/g, " ");
  assert.match(flatSplit, /When that reason includes `progress-heading`, first restore exactly one `## Progress log` boundary/);
  assert.match(flatSplit, /With no heading, the boundary goes immediately after the canonical final `Review:` field when that field is unique; if it is not unique, report the ambiguous card instead of guessing\. With duplicates, keep the first boundary and remove only the later heading lines/);
  assert.match(flatSplit, /Only then reset `Approval` to `pending` and present the repaired whole card/);
  assert.match(work, /The claimed card's `claim:` line carries its `Depends` judgment/);
  assert.match(work, /`kind=depends-anomaly`, report that line's anomaly and stop/);
  assert.match(verify, /project-state\.mjs state/);
});

test("stale task history is non-blocking only after replacement planning is durable", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const marker = /YYYY-MM-DDTHH:MM:SSZ re-split pending: folder: <direct parent folder path with status suffixes removed>; stale: <number\+number>; source: <devflow\/project file path>#<heading>/;
  assert.match(principles, marker);
  assert.match(split, /When journal has a `re-split pending` marker/);
  assert.match(resume, /\| `marker\.re-split` \| split — finish that marker's replacement-card plan \|/);
  assert.match(principles, /excluded from active-child counts and closure judgment/);
  assert.match(verify, /A `\.stale\.` task card\s+is history and is excluded from this judgment/);
  assert.doesNotMatch(resume, /no pending,\s*claimed, or `\.stale\.` card/);
});

test("upper-document feedback is settled before a card closes or a finding event completes", () => {
  const product = fs.readFileSync(path.join(root, "skills", "product", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const judgment = work.indexOf("Upper-document feedback judgment — before the final task commit");
  const taskCommit = work.indexOf("Final task commit — the canonical 1 task = 1 commit discipline");
  const feedback = work.indexOf("Land upper-document feedback");
  const doneRename = work.indexOf("Rename the card to .done.");
  assert.ok(judgment >= 0 && judgment < taskCommit);
  assert.ok(feedback > taskCommit && feedback < doneRename);
  assert.match(work, /enter the canonical Document\s+Hierarchy procedure/);
  assert.match(product, /every action in the canonical discovery→update row/);
  assert.match(product, /one binding-decision commit/);
  assert.match(verify, /exact status renames, markers, and output required by\s+the selected canonical discovery→update row/);
});

test("browser requirements are platform-neutral", () => {
  const deployText = [
    fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "design", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "verify", "verifier.md"), "utf8"),
  ].join("\n");
  assert.match(deployText, /browser-control tool/);
  assert.doesNotMatch(deployText, /Browser MCP required|browser-MCP/i);
});

test("planning transitions have one canonical registry and committed begin states", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const deploy = [principles, split, resume].join("\n");

  assert.match(principles, /`core:<path>#<heading>`/);
  assert.match(principles, /`card:<path>@<hash>`/);
  assert.match(principles, /`journal:<whole reserved journal line>`/);
  assert.match(principles, /deleting a journal source with its\s+layer-opening marker/);
  assert.match(principles, /`verify:<path>#Failure history@<source id>`/);
  assert.match(principles, /`verify:<path>#<Audit\|Retrospective>@<source id>\/<finding number>`/);
  assert.match(principles, /an id is never reused/);
  assert.match(principles, /boundary — verify source ids/);
  assert.match(split, /first land it, together with any uncommitted source record, in a\s+`split — begin <parent>` commit/);
  assert.match(split, /integrate the\s+current branch through that commit[\s\S]*before writing a marker or\s+tree diff/);
  // Which of the working tree and HEAD carries a marker is the tool's read now, so the
  // registry stays in the canon and resume names only the route the marker produces.
  assert.match(resume, /\| `transition\.layer-opening` \| split/);
  assert.equal(count(deploy, /^YYYY-MM-DDTHH:MM:SSZ layer opening:/gm), 1);
  assert.equal(count(deploy, /^YYYY-MM-DDTHH:MM:SSZ maintenance routing pending:/gm), 1);
});

test("re-split repairs active dependency edges and reopens every closed ancestor", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  assert.match(split, /Remove `\.done` from that\s+folder and every ancestor through the depth-1 capability or foundation/);
  assert.match(split, /every pending\s+or claimed non-`\.stale\.` card/);
  assert.match(split, /replace a `Depends` member exactly equal\s+to a stale number with its approved replacement-number group/);
  assert.match(split, /Reset a changed pending card's `Approval` to `pending`/);
});

test("product verdict freshness binds product, verification inputs, and committed code revisions", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const state = fs.readFileSync(path.join(root, "skills", "principles", "verification-predicates.md"), "utf8");
  assert.match(verify, /Code revision/);
  assert.match(verify, /Verification revision/);
  assert.match(state, /git log -1 --format=%H -- \. ':\(exclude\)devflow\/\*\*'/);
  assert.match(state, /git ls-tree -r -z --full-tree HEAD --/);
  assert.match(state, /git hash-object --stdin/);
  assert.match(state, /every direct `Depends`\s+card of those cards/);
  assert.doesNotMatch(state, /git ls-tree[^\n]*:\(exclude\)/);
  assert.match(verify, /direct-dependency card/);
  assert.match(verify, /When Failure history has zero entries, write no line between `Failure history:` and\s+`Regression:`/,
    "zero Failure-history entries are represented by an empty span, not a sentinel row");
  assert.match(state, /PowerShell object pipeline and shell text conversion are not/);
  assert.match(verify, /Before either layer, combine the non-empty output/);
  // The revision comparison and the uncommitted-outside-devflow trigger are the tool's
  // `product:` zone; resume keeps the route each one produces, and verify still names
  // where the four revisions come from.
  assert.match(resume, /\| `product\.shape-or-revision` \| verify — product layer \|/);
  assert.match(resume, /\| `product\.unverified` \| verify — rerun the product layer \|/);
  assert.match(verify, /take the four\s+revisions from the tool/);
});

test("verification roles have stable targets and current-topology audit scope", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const verifier = fs.readFileSync(path.join(root, "skills", "verify", "verifier.md"), "utf8");
  const auditor = fs.readFileSync(path.join(root, "skills", "verify", "auditor.md"), "utf8");

  assert.match(verifier, /hostile input/);
  assert.doesNotMatch(verifier, /card with its progress-log section removed|boundary input/);
  assert.match(verify, /current\s+topology, never past commits, diffs, or task cards/);
  assert.match(verify, /`root: <repository-relative folder>` or `file: <repository-relative file>`/);
  assert.match(auditor, /exact capability code scope/);
  assert.doesNotMatch(auditor, /task-code-path/);
});

test("stale and retired cards cannot leave orphan remote-evidence state", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /Delete in\s+the same binding-decision commit every `evidence-wait` or `evidence-finalizing` line/);
  assert.match(principles, /Delete\s+in the retirement commit every `evidence-wait` and `evidence-finalizing` journal line/);
});

test("devflow has exactly one mode", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const branchers = [
    principles,
    fs.readFileSync(path.join(root, "skills", "principles", "state-predicates.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8"),
    work,
    fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8"),
    resume,
    arch,
  ];
  for (const text of branchers) {
    assert.doesNotMatch(text, /solo/i, "no solo branch survives");
    assert.doesNotMatch(text, /multi(?![a-z])/i, "no multi branch survives");
  }
  assert.match(principles, /devflow has one mode/);
  assert.match(principles, /Resolve your id before writing to the tree, journal, or a core document/);
  assert.match(principles, /\*\*the integration tip is HEAD\*\*/);
  assert.match(principles, /Upgrading from a version without rooms/);
  assert.match(principles, /6\. Is there a bare `\.wip\.` or a root `devflow\/HANDOFF\.md`/);
  assert.match(work, /finish the canonical room\s+transition before anything below/);
  assert.match(resume, /\| `setup\.room-upgrade` \| work — confirm the owner with the user/);
  assert.match(resume, /\| `setup\.integration-config` \| arch — propose under arch's integration default rule/);
  assert.match(arch, /The default proposal for `integration` forks on how many worktrees `git worktree list`\s+reports/);
  assert.match(arch, /With one, it is the current branch and there is no extra question/);
  assert.match(arch, /devflow creates\nneither a branch nor a worktree/);
});

test("claims are freely parallel and terminal identity stays with the user", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /A person may hold several claims/);
  assert.match(principles, /One card is carried by one session at a time/);
  assert.match(principles, /A candidate's \*\*depth-1 unit\*\* is the first path component below `devflow\/tree\/`/);
  assert.match(principles, /1\. Does a claimed card carry an `<id>` that matches no `devflow\/users\/\*\/owner\.md` room/);
  assert.doesNotMatch(principles, /One claim per id per depth-1 unit/);
  assert.match(work, /Any number of claims of mine, in any units, is ordinary concurrent work/);
  assert.match(work, /name those claims in one line/);
  assert.match(work, /information, not a question/);
  assert.doesNotMatch(work, /Never claim a pending card in a depth-1 unit where I already hold a claim/);
  assert.doesNotMatch(work, /reciprocal parallel/);
  assert.match(resume, /\*\*The one claimed card this invocation continues\*\* is read in full/);
  assert.match(resume, /For others' claims, the `claim:` line's path and claimant are enough/);
  assert.match(resume, /otherwise `next:` settles it at report time/);
  assert.match(resume, /show the claim paths, ask which one to continue/);
  assert.match(resume, /run its deferred uncommitted comparison/);
  assert.match(resume, /neither\s+`uncommittedUnattributed` nor `notYetOnIntegration` holds the card this invocation would\s+continue/);
  assert.match(resume, /report every remaining uncommitted path without attributing\s+it to a card/);
});

test("the unintegrated count judges the commit set, not bare ancestry", () => {
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const stateTool = fs.readFileSync(path.join(root, "skills", "principles", "scripts", "project-state.mjs"), "utf8");
  // resume reports the count; the tool computes it. Both halves have to exist or the number
  // reaches the user with nobody deriving it.
  assert.match(resume, /not yet on integration: <N paths \| none>/);
  assert.match(stateTool, /notYetOnIntegration/);
  // The count is a commit-range read, never an ancestry test — a branch with local commits
  // piled up is exactly the shape an ancestry test calls `none`. The behavioral form of this
  // (an ancestor tip with a non-empty set still counts) belongs to the tool's own suite.
  assert.match(stateTool, /integration\.ref\}\.\.HEAD/);
  const commitSet = /const changedOnBranch = [\s\S]+?\n\s+: \[\];/.exec(stateTool)?.[0] ?? "";
  assert.notEqual(commitSet, "", "changedOnBranch projection is missing");
  assert.doesNotMatch(commitSet, /is-ancestor/);
});

test("candidate selection has one canonical order", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  assert.match(principles, /\*\*Canonical candidate order\*\* is a selection order among candidates/);
  assert.match(principles, /\*\*Canonical recognition\*\* resolves the current conversation's text to a set of units/);
  assert.match(principles, /complete product\.md capability name, a standalone number token compared with unit numbers\s+as integers/);
  assert.match(principles, /never changes which row matches and\s+never makes an unready card ready/);
  // the recognition machine is defined once and cited elsewhere
  const deploy = [principles, baseline, resume, work, split].join("\n");
  assert.ok(count(deploy, /complete product\.md capability name|complete capability name/g) <= 3,
    "canonical recognition must not be restated in more than one place");
  assert.match(resume, /Resolve the target by the\n   canonical rules' canonical recognition/);
  assert.match(work, /in canonical\s+candidate order over my remaining claims/);
  assert.match(resume, /selected by\n<your request \| the last handoff \| canonical order>/);
  assert.match(resume, /When this conversation carries a change request that no `existing-request:` line holds yet,\s+record it as one canonical journal line before routing/);
  assert.ok(
    resume.indexOf("record it as one canonical journal line before routing") <
      resume.indexOf("| `claim.mine` | work |"),
    "a fresh change request is recorded before a claim resumes, like the persisted form below it",
  );
  assert.ok(
    resume.indexOf("| `claim.mine` | work |") <
      resume.indexOf("| `request.existing` |"),
    "planning a maintenance request yields to an open claim; only recording it does not",
  );
  for (const consumer of [work, split, resume]) {
    assert.doesNotMatch(consumer, /the next pending card that is ready/);
  }
});

test("every devflow commit and review diff carries only its own paths", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(principles, /\*\*Every devflow commit carries only its own paths\.\*\*/);
  assert.match(principles, /Whatever else this working tree has\s+staged, a commit contains exactly the paths its own rule names/);
  assert.match(principles, /a file another flow in\s+the same folder staged earlier never rides along/);
  assert.match(work, /the diff limited to this card's paths/);
});

test("room files have merge rules and HANDOFF paths survive a claim", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /HANDOFF merge conflicts take the side whose `# HANDOFF \u00b7 <timestamp>` header is newer/);
  assert.doesNotMatch(principles, /keep `Open decisions` as the union/);
  assert.match(principles, /5\. Does a path referenced by HANDOFF fail to match exactly one existing path when every\s+component's status suffix is removed/);
});

test("each card leaves one carry line and the next card reads only those", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  const verifier = fs.readFileSync(path.join(root, "skills", "verify", "verifier.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ carry: <a fact that could make the next card in this depth-1 unit wrong \| none>/);
  assert.match(principles, /The line rides the final task commit, so the canonical claim→done move\n  stays byte-identical/);
  assert.match(principles, /immediately before the\s+final task commit, work reruns the state tool/i);
  assert.match(principles, /Continue only when `carry=present`/);
  assert.match(work, /number is not in the capability document's `Covered cards`[\s\S]{0,200}last `carry:` line/);
  assert.match(work, /Read only that output and open\n  no card body/);
  assert.match(work, /carry-\n  line query output/);
  for (const role of [reviewer, verifier]) assert.doesNotMatch(role, /carry:/);
  assert.ok(
    work.indexOf("Carry check — immediately before the final task commit") > work.indexOf("Upper-document feedback judgment"),
    "the carry check runs after the landing check",
  );
  assert.ok(
    work.indexOf("Carry check — immediately before the final task commit") < work.indexOf("Final task commit — the canonical"),
    "the carry check runs before the vehicle leaves",
  );
  assert.match(work, /Carry check —[\s\S]{0,240}`claim: kind=mine`[\s\S]{0,160}`carry=present`/);
});

test("an observation about another capability has a keyed line and a harvester", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole observation>/);
  assert.match(principles, /`capability closing:`, `capability note:`/);
  assert.match(principles, /An observation confirmed in code about a capability other than the one being worked on \| one canonical `capability note` line/);
  assert.match(verify, /delete in the same sweep only those byte-identical to the\n   multiset step 7 collected/);
  assert.match(verify, /A line appended\n   after the begin commit and another capability's line stay/);
  assert.match(verify, /retained\n   when that refresh was a baseline no-op/);
  assert.match(verify, /only this marker and those collected capability notes removed/);
  assert.match(verify, /multiset of its\n   numbered short-form lines collected from the journal blob at the marker's `head`/);
});

test("the capability design ascent has one producer, one route, and one design writer", () => {
  const read = (...parts) => fs.readFileSync(path.join(root, "skills", ...parts), "utf8");
  const principles = read("principles", "SKILL.md");
  const baseline = read("principles", "baseline-predicates.md");
  const resume = read("resume", "SKILL.md");
  const work = read("work", "SKILL.md");

  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole confirmed statement>; card-json: <JSON string containing the whole task-card path>; code-json: <JSON array of the exact code paths>$/m,
    "the design form is the same journal kind carrying statement, card, and code, and nothing more");
  assert.doesNotMatch(principles, /capability note: capability: <NN>;[^\n]*head: </,
    "no second supposed commit basis is written into the line");
  assert.match(principles.replace(/\s+/g, " "), /no commit basis is written into the line — the `NN\.N wip:` checkpoint that first holds that exact line is both the revision anchor and the card and code snapshot of that moment, and the tool computes it\./,
    "the anchor is derived, and that checkpoint is itself the card and code snapshot");
  assert.match(principles, /\| The user confirms a statement belonging to the Intent or Invariants of the capability being worked on, with Layer 0 unchanged \| one canonical `capability note` design line[^|]*It is durable only once one `NN\.N wip:` checkpoint lands that line with the current card and the current code\./,
    "the producer contract is one discovery→update row whose line becomes durable in one wip checkpoint");
  assert.match(work.replace(/\s+/g, " "), /Upper-document feedback judgment — before the final task commit[^↓]*land that line with the current card and the current code in one `NN\.N wip: capability design note` checkpoint, and end this invocation\./,
    "the producer branch sits in the pre-final feedback judgment and ends the invocation");
  assert.match(principles, /Do not edit the capability document or a capsule directly — the tool routes that line and arch \(Brownfield `no`\) or adopt \(`yes`\) rederives the design zone \|/,
    "the producer never writes the design zone itself");

  const designRoute = resume.split(/\r?\n/).find((line) => line.startsWith("| `marker.design-note` |"));
  assert.ok(designRoute, "resume has one design-note route row");
  assert.match(designRoute, /Take the first matching case in this order/);
  const routeCases = ["`prefix=design-only`", "`recovery=producer`", "`recovery=external`", "an `anchor`"];
  for (let index = 1; index < routeCases.length; index += 1) {
    assert.ok(designRoute.indexOf(routeCases[index - 1]) < designRoute.indexOf(routeCases[index]),
      `${routeCases[index - 1]} must outrank ${routeCases[index]}`);
  }
  assert.match(designRoute, /an `anchor` sends design only to arch when Brownfield is `no`, or adopt when `yes`/,
    "the final valid route still reaches exactly one design writer");
  assert.match(work.replace(/\s+/g, " "), /Producer recovery for a routed capability design note begins only when `marker\.design-note` carries `recovery=producer`/,
    "work alone owns recovery of its malformed design-note artifact");
  assert.match(work.replace(/\s+/g, " "), /remove the exact invalid line, and append a fresh-timestamp line only when the same user-confirmed statement and exact live card and code basis still stand/,
    "producer recovery never silently changes the confirmed knowledge basis");
  assert.match(principles.replace(/\s+/g, " "), /A `capability note` design-form append continues only in its canonical `<id> <NN\.N> wip: capability design note` checkpoint with that exact card and code basis/,
    "integration blockade cannot create an invalid first anchor");

  for (const skill of ["arch", "adopt"]) {
    const text = read(skill, "SKILL.md").replace(/\s+/g, " ");
    assert.match(text, /\*\*Design-only entry\.\*\* When the entry handed over a `marker\.design-note`, do not run/,
      `${skill} must own a design-only branch`);
    assert.match(text, /Rederive only the design zone of the one capability that line names, from the confirmed current Layer 0 and that exact statement\./,
      `${skill} rederives one capability design zone from current inputs and the exact note`);
    assert.match(text, /Put the statement in Intent or Invariants when it fits the capability-document budget, and move design-topic detail over that budget down through the (?:same-number capsule contract|capsule procedure above)\./,
      `${skill} places the fact in the design zone and spills only over-budget detail`);
    assert.match(text, /The `anchor` handed over is the exact snapshot basis of that `card` and `code`; recompute no other basis from history or cards, and never duplicate a capability fact into arch\.md to wake the writer — only a real Layer 0 fact takes the discovery→update table's existing route\./,
      `${skill} treats the anchor as the snapshot basis and duplicates no capability fact into Layer 0`);
    assert.match(text, /Delete the journal line byte-identical to that one in the same binding capability-document commit\./,
      `${skill} consumes the byte-identical note in the same binding commit`);
  }

  assert.match(work, /Compatible means rerun the completion signal and stand one more\nclean review before final completion\./,
    "a compatible card reruns the signal and stands one clean review");
  assert.match(work, /Incompatible means walk the canonical Document Hierarchy\n`\.stale\.` and re-split pending path as it stands\. work writes no design byte and no capsule\./,
    "an incompatible card takes the existing stale path and work writes no design byte");

  const verify = read("verify", "SKILL.md");
  assert.match(verify.replace(/\s+/g, " "), /This capability's `capability note` input is the multiset of its numbered short-form lines collected from the journal blob at the marker's `head` — the design form carrying `card-json` and `code-json` is arch and adopt's input, so it is neither collected nor deleted\./,
    "verify harvests and deletes the short form only, never the design form");
  assert.match(baseline.replace(/\s+/g, " "), /In a design-only entry, `devflow\/journal\.md` is the one exception only when its working bytes equal HEAD with exactly one byte-identical occurrence of the routed design line removed\./,
    "the design-only prefix is defined by the canonical baseline contract");
  assert.match(baseline, /What moves down into a capsule beyond this budget is only design-zone domain\n  knowledge, which arch and adopt own/,
    "capsule spill belongs to the design zone alone");
  assert.match(baseline, /verify writes the fixed verified-zone sections as it normally does, creates no\n  capsule and drops no verified fact to meet this cap, and reports whole-document overage\./,
    "verify writes its normal sections, creates no capsule, and loses no verified fact");
  assert.match(baseline, /Deleting the one `capability note`\n  design line a design-only entry consumes is the single exception that rides that commit; no\n  other journal change does\./,
    "the writer boundary carries one narrow design-note consumption exception");
  assert.match(baseline.replace(/\s+/g, " "), /In a design-only entry, `devflow\/journal\.md` is the one exception only when its working bytes equal HEAD with exactly one byte-identical occurrence of the routed design line removed\./,
    "the interrupted writer prefix recognizes exactly the routed note deletion");
  assert.match(baseline.replace(/\s+/g, " "), /for a design-only entry, recalculate that one design-line deletion before finishing the commit\. Any other journal change or mismatch is an integrity anomaly\./,
    "prefix recovery regenerates the note consumption and rejects every other journal edit");
});

test("same-origin siblings are passed, not recomputed", () => {
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(resume, /The selected candidate's own `claim:` or `ready:` line carries its `origin` and\nits `siblings` — the current card paths from that same origin, with the card itself left out\./,
    "resume must name the projected field and the self-excluded convention");
  assert.match(resume, /Pass that array on to work \(or the next reader\) as it stands: never recompute it, never scan\nthe tree to fill it/,
    "resume must pass the exact paths through instead of deriving them again");
  assert.match(work, /when the entry passed a non-empty `siblings` list, read exactly those paths and no others/,
    "work must consume the exact projected paths");
  assert.match(work, /Never recompute the paths and never scan the\n  folder\. A sibling card is boundary context only: no authority to modify it, and no grounds\n  to widen this card/,
    "sibling context is bounded: no scan, no edit, no widening");
  for (const [name, text] of [["resume", resume], ["work", work]]) {
    assert.doesNotMatch(text, /^Origin:/m, `${name} must not turn the projection into a card field`);
  }
});

test("HANDOFF carries only a recomputable pointer", () => {
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(work, /^## Next single step\s+<!-- one tree path \| none -->$/m);
  assert.doesNotMatch(work, /^## Open decisions/m);
  assert.match(work, /Add no other section to this file/);
  assert.doesNotMatch(work, /^## Just learned/m);
  assert.doesNotMatch(work, /^## Traps$/m);
  assert.doesNotMatch(work, /If all four are empty, an empty file is fine/);
  assert.match(work, /`Next single step` is mandatory and holds one tree path/);
  assert.match(work.replace(/\s+/g, " "), /the exact path named by the tool's first actionable tree route: a capability folder when capability verification is next, and `devflow\/tree\/verify\.md` when a product verification transition names that record\. It is not limited to a card or a waiting file/,
    "the pointer is whatever the first actionable tree route names, not a card-only field");
  assert.doesNotMatch(work, /no pending and no claimed card/,
    "`none` is the absence of an actionable tree path, not the absence of cards");
  assert.match(work, /The first time this room's HANDOFF still carries a `## Just learned`, `## Traps`, or\n`## Open decisions` section,\s+land that content before overwriting/);
  assert.match(work, /Do not backfill carry lines\nonto older `\.done\.` cards/);
});

test("concurrent verification is not weakened", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(verify, /if any path does not start with `devflow\/`,\nrecord unverified and do not execute/);
  assert.match(verify, /uncommitted paths outside devflow/);
  assert.match(verify, /Run an audit only at a boundary with no staged, unstaged, or untracked path outside\ndevflow/);
});

test("a reopened capability cannot report verified statements as fresh", () => {
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(baseline, /They are hypotheses too while any non-`\.stale\.`\s+card below that folder lacks a `\.done` status/);
  assert.match(work, /`verifiedFreshness` and `coveredFreshness` are both `fresh`/);
});

test("an external trap survives without a source URL", () => {
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  assert.match(baseline, /its cause cell holds the exact\n  source URL, or, when the behavior is undocumented, the number of the card that observed it\n  together with the reproduction condition/);
});

test("hypothesis reconfirmation reaches binding ADRs and consumed paths without widening scope", () => {
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(baseline, /or at an already-open exact path named by\nthat zone's valid Binding ADRs/);
  assert.match(baseline, /which for\nreconfirmation alone also holds `Consumed paths`/);
  assert.match(baseline, /neither\naddition widens the Standards gate or the Audit scope/);
  assert.match(baseline, /Consumed paths do\n  not expand the capability code scope, Standards gate, or Audit scope/);
  assert.match(work, /which for reconfirmation alone also holds `Consumed paths`/);
});

test("foundation is verified through its consumers", () => {
  const baseline = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  assert.match(baseline, /Shared code the foundation\n  owns lies inside the capability code scope of every capability that uses it/);
  assert.match(baseline, /verified through those consumers and that knowledge lands in their verified zones/);
});

test("the resume report names its reason and the alternatives", () => {
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(resume, /The selection reason comes straight out of `selectionReason`/);
  // the seventh axis: the report has to show which line the judgment came from
  assert.match(resume, /\*\*Quote the\s+fact line that carries that one step beside the next step\*\*/);
  assert.match(resume, /Also open:\n<every other unit that could be started now for the same reason \| none>/);
  assert.match(resume, /When the session unit\nholds no candidate, say so in that clause/);
});

test("a mis-mapped card has a recall route and split maps from the boundary line", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  assert.match(split, /read\n   the fixed first four lines of each candidate capability document and nothing else/);
  assert.match(split, /`Boundary: owns …; does not own …` is the mapping oracle/);
  assert.match(split, /leaves the original as a\n`\.stale\.` tombstone at the same path and number/);
  assert.match(split, /The tombstone keeps that number in the tree, so the\nnext minting does not reuse it/);
  assert.match(split, /\*\*Card recall\.\*\*/);
  assert.match(split, /only while that card was never claimed and no task\s+commit subject has named its number/);
  assert.match(split, /When step 1 finds an existing pending card of this request's scope sitting\s+in the wrong folder/);
});

test("parking happens only on explicit request and carries only this session's changes", () => {
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(work, /^## Letting Go of a Card — parking only on explicit request$/m);
  assert.match(work, /Moving to another card needs no procedure: claim it/);
  assert.match(work, /Land the changes this session made for that card/);
  assert.match(work, /Uncommitted changes this session did\s+not make belong to another flow and do not ride/);
  assert.match(work, /claim no automatic candidate/);
  assert.match(work, /parking is a release, not a handoff/);
});

test("devflow requires a Git work tree and has no degraded mode", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  assert.match(principles, /devflow runs only in a Git work tree/);
  assert.match(principles, /proposes `git init`\s+and stops when the user declines/);
  assert.match(principles, /With `user\.name` or `user\.email` unset, propose the exact\s+`git config` line and stop until it is confirmed/);
  assert.match(work, /Apply the canonical Git requirement/);
  assert.match(arch, /propose `git init` and stop when the user declines/);
  // the degraded non-Git mode is gone
  for (const text of [principles, work, arch]) {
    assert.doesNotMatch(text, /no recovery possible/);
    assert.doesNotMatch(text, /integration: none/);
  }
});

test("one integration branch is the only shared authority", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const skillTexts = skillDirs.flatMap((dir) => fs.readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !name.endsWith("_ko.md"))
    .map((name) => fs.readFileSync(path.join(dir, name), "utf8")));

  // paragraph 1 — where shared truth lives
  assert.match(principles, /\*\*Shared truth is the integration branch\.\*\*/);
  assert.match(principles, /another\s+worktree's HEAD is evidence not yet integrated, never authority/);
  assert.match(principles, /`git worktree list --porcelain` lists this repository's worktrees/);
  // paragraph 2 — how a shared transition is published
  assert.match(principles, /\*\*Publishing a shared transition\.\*\*/);
  assert.match(principles, /When the integration tip is not an ancestor of the branch\s+you tried to publish, this is ordinary contention[\s\S]{0,80}three\s+times at most/);
  assert.match(principles, /When the tip is an ancestor and the publish is still refused, it is a\s+structural blocker/);
  assert.match(principles, /never by error text, which\s+varies by locale and Git version/);
  assert.match(principles, /these continue: code edits, progress-log checkpoints, tweak commits \(the lane's commit is\s+not a binding decision\), and the final task commit/);
  assert.match(principles, /Those four are the whole set of journal appends that continue during a\s+blockade/);
  assert.match(principles, /consuming \(deleting\) a canonical journal line/);
  assert.match(principles, /a layer-opening marker \(it mints numbers\)/);
  // paragraph 3 — several hands in one working folder
  assert.match(principles, /\*\*Several hands in one working folder\.\*\*/);
  assert.match(principles, /Several sessions may carry different cards at the\s+same time/);
  assert.match(principles, /Change `devflow\/journal\.md` by appending/);
  assert.match(principles, /edit the part that changes instead of\s+rewriting a file whole/);
  assert.match(principles, /report those exact paths before counting the\s+failure ladder/);
  assert.match(principles, /A worktree is not a safety device/);
  // the three paragraphs sit together, in order
  assert.ok(
    principles.indexOf("**Shared truth is the integration branch.**")
      < principles.indexOf("**Publishing a shared transition.**")
      && principles.indexOf("**Publishing a shared transition.**")
        < principles.indexOf("**Several hands in one working folder.**"),
    "the three concurrency paragraphs stay in one place, in order",
  );
  // the union authority is gone from every deployed skill file
  for (const text of skillTexts) {
    assert.doesNotMatch(text, /union of the integration tip/);
    assert.doesNotMatch(text, /unioned with each worktree HEAD/);
  }
  // The tree listing is read at the integration tip by the tool; resume keeps the fetch step
  // that makes that tip current before anything is judged from it.
  assert.match(resume, /On `integration=<branch>@unknown networkNeeded=1`, fetch integration and call the tool again/);
});

test("a change request is recorded at once but planned only after the claim closes", () => {
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  assert.match(resume, /record it as one canonical journal line before routing — unless `git:` or `integrity:`\nblocks — and call the tool again/);
  assert.match(split, /land that commit alone as a binding decision and return to the card/);
  assert.match(split, /`<id> boundary — request recorded`/);
  assert.ok(
    resume.indexOf("record it as one canonical journal line before routing") <
      resume.indexOf("| `claim.mine` | work |"),
    "recording a fresh request outranks the claim",
  );
  assert.ok(
    resume.indexOf("| `claim.mine` | work |") <
      resume.indexOf("| `request.existing` |"),
    "planning it yields to the claim",
  );
});

test("a completion signal is scoped so one flow cannot fail another's card", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(split, /Scope a completion signal to the paths this capability owns whenever the means allows it/);
  assert.match(split, /One working tree runs one build/);
  assert.match(work, /When this session left uncommitted changes on another card of mine, land them as that\s+card's `NN\.N wip:` checkpoint first/);
  assert.match(work, /uncommitted changes this session did not make\s+belong to another flow/);
});

test("resume asks which unit instead of guessing when several are open", () => {
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(resume, /When the conversation named no depth-1 unit and two or more units hold a candidate in that\s+zone, ask which unit to continue instead of proposing one/);
  assert.match(resume, /With a single unit\s+holding candidates there is nothing to ask; propose it/);
});

test("the tweak lane lives in the canon and every consumer only cites it", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  // the gate, procedure, and commit form are defined once
  assert.match(principles, /^## The Tweak Lane$/m);
  assert.match(principles, /judges each against\s+the three questions separately/);
  assert.match(principles, /any\s+uncertainty means it\s+is not one/);
  assert.match(principles, /`<id> tweak <unit number>: <what>`/);
  assert.match(principles, /no `devflow\/` path\s+is touched/);
  assert.match(principles, /stop, report, and switch to the ordinary path/);
  // the landing checks and same-file yield live in the canon
  assert.match(principles, /apply only to an item that requests a\s+change to the repository's artifacts/);
  assert.match(principles, /written into no journal line/);
  assert.match(principles, /`git symbolic-ref -q HEAD`/);
  assert.match(principles, /When any verify\.md in the working tree contains `routing prepared`/);
  assert.match(principles, /When the readable integration tip is not an ancestor of HEAD/);
  assert.match(principles, /the existing glossary\.md too: term decisions live only\s+there/);
  assert.match(principles, /applied to that item's own\s+text/);
  assert.match(principles, /do not guess their owner/);
  assert.match(principles, /back my edits out, reapply them after the other flow\s+has\s+committed/);
  assert.match(principles, /take them over or discard them by\s+the user's decision/);
  assert.match(principles, /with no `devflow\/` at the\s+repository root, do not tweak/);
  // consumers cite the lane instead of restating the gate
  assert.match(resume, /^## Tweak Entry$/m);
  assert.match(resume, /passes the canonical rules' three tweak questions/);
  assert.match(resume, /Apply only\s+the canonical open-Git-operation gate/);
  assert.match(resume, /the recorded line holds only those items/);
  assert.match(work, /separate `tweak` commits through that lane — one per depth-1 unit/);
  assert.match(work, /through the tweak lane's target-path check/);
  assert.doesNotMatch(work, /so it never mixes with card work/);
  // split never sends a recorded item back out to the lane
  assert.match(split, /A recorded request line holds no item that passed the tweak\s+gate/);
  assert.doesNotMatch(split, /goes through the tweak lane, not a card/);
  assert.match(split, /minus any items that passed the canonical\s+tweak gate/);
  assert.match(resume, /A commit whose subject has the canonical\s+tweak form/);
  for (const consumer of [resume, work, split]) {
    assert.doesNotMatch(
      consumer,
      /does it change a precondition-to-outcome transition the user sees/,
      "the three questions are stated only in the canon",
    );
  }
});

test("journal merges resolve 3-way and blockade appends are exactly enumerated", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /Journal merge conflicts resolve 3-way/);
  assert.match(principles, /was consumed — never restore it/);
  assert.doesNotMatch(principles, /Journal merge conflicts resolve as a union/);
  assert.match(principles, /`maintenance\s+routing pending`, `capability note`, attributed open-item and decision lines, `product\s+re-run pending`/);
  assert.match(principles, /nothing waits unnamed/);
  // "nothing waits unnamed" holds only while every canonical journal kind sits on one side of
  // this paragraph. Ten are named outright; the three product-verification kinds ride the one
  // phrase that names them as a family. A kind on neither side leaves a blockaded session free
  // to write it or hold it — the 0.18.6 defect, and the same class as the 0.14.0 one.
  const start = principles.indexOf("**Publishing a shared transition.**");
  const end = principles.indexOf("**Several hands in one working folder.**");
  assert.ok(start >= 0 && end > start, "the blockade paragraph must be findable by its two headings");
  const blockade = principles.slice(start, end);
  for (const kind of [/a layer-opening marker \(it mints numbers\)/, /`re-split pending` marker/,
    /`maintenance\s+routing pending`/, /`product\s+re-run pending`/, /`capability closing` marker/,
    /`capability note`/, /`audit requested`/, /`retrospective requested`/, /`evidence-wait`/,
    /`evidence-finalizing`/, /verification-state lines/]) {
    assert.match(blockade, kind, "unnamed in the blockade paragraph, so this kind has no disposition");
  }
  // the continuing side is a closed set of four, never a predicate a literal reader can extend
  assert.match(blockade, /Those four are the whole set of journal appends that continue during a\s+blockade/);
  assert.doesNotMatch(blockade, /journal appends that mint no number and make no claim/);
});

test("the canonical timestamp divides journal ownership line by line", () => {
  // Measured before 0.18.8 in two real projects: every one of the 98 blocking integrity
  // reports was a note a person had written into journal.md by hand, and the accident item
  // 12 guards -- a reserved headword in a broken format -- happened zero times. Machine
  // ownership of every line locks a person out of the file they keep as a notebook. A line
  // the machine owns carries one of two marks -- the canonical timestamp, or a reserved
  // headword leading the line -- and everything else is the person's.
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(principles, /A line that starts with the canonical\s+timestamp or is led by a reserved\s+headword below is the machine's/);
  assert.match(principles, /Every other line is a person's — it enters no judgment and\s+stays as it stands/);
  assert.doesNotMatch(principles, /journal\s+admits only/);
  // Item 12 is the third leg of the same predicate. Before 0.18.8 it named only the
  // timestamped case while the tool judged both, and that gap is what let prose and code
  // say different things about the very line this test divides.
  assert.match(principles, /Does a journal line led by `layer opening:`[\s\S]{0,400}?with or without the canonical timestamp before it/);
  // verify classifies twice -- once before revisions, once in the closure sweep. A person's
  // line has to survive both, so both sites carry the same scope and the same anomaly test.
  assert.equal(count(verify, /classify\s+every\s+journal\s+line\s+that\s+starts\s+with\s+the\s+canonical\s+timestamp/gi), 2);
  assert.equal(count(verify, /A\s+timestamped\s+line\s+in\s+none\s+of\s+these\s+classes\s+is\s+an\s+integrity\s+anomaly/g), 2);
});

// The one canon range an entry skill may leave unread. Everything below keeps that gate
// honest: the boundary has to be real, nothing but the capsule contract may live inside it,
// and the four entry sentences have to name the same boundary the canon carries.
const CAPSULE_GATE = {
  "skills/principles/baseline-predicates.md": {
    open: "## Domain knowledge capsules",
    close: "## Metadata and freshness",
    kept: "Two worked capsules",
  },
  "skills/principles/baseline-predicates_ko.md": {
    open: "## \uB3C4\uBA54\uC778 \uC9C0\uC2DD \uCEA1\uC290",
    close: "## \uBA54\uD0C0\uB370\uC774\uD130\uC640 \uC2E0\uC120\uB3C4",
    kept: "\uBCF8\uBCF4\uAE30 \uB450 \uD3B8",
  },
};

function gatedRange(text, gate) {
  const open = text.indexOf(`\n${gate.open}\n`);
  const close = text.indexOf(`\n${gate.close}\n`);
  assert.ok(open >= 0 && close > open, `${gate.open} ... ${gate.close}: range not found in order`);
  return { inside: text.slice(open, close), outside: text.slice(0, open) + text.slice(close) };
}

test("the capsule gate boundary is a real, single, ordered pair in both languages", () => {
  for (const [relative, gate] of Object.entries(CAPSULE_GATE)) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    for (const heading of [gate.open, gate.close]) {
      assert.equal(text.split(/\r?\n/).filter((line) => line === heading).length, 1,
        `${relative}: ${heading} must appear exactly once for the range to be unambiguous`);
    }
    const { inside } = gatedRange(text, gate);
    // The narrower exception the other branch keeps sits inside the wider one, so a session
    // that skips the range never needs the narrower rule spelled out twice.
    assert.ok(inside.includes(gate.kept), `${relative}: ${gate.kept} must sit inside the gated range`);
  }
});

test("no rule a capsule-less project still needs has drifted inside the capsule gate", () => {
  const relative = "skills/principles/baseline-predicates.md";
  const text = fs.readFileSync(path.join(root, relative), "utf8");
  const { inside, outside } = gatedRange(text, CAPSULE_GATE[relative]);
  // Each token is a capability-document rule that a project with no capsule still executes.
  // If one of them ever moves inside the range, a capsule-less session loses it in silence —
  // that is the only realistic path from this gate to a "needed it, never read it" failure.
  for (const token of ["## Verified state", "Design head", "Scope head", "Covered cards",
    "v0.10 Baseline Migration", "Brownfield", "Writers and replacement",
    "Capability-closing begin commit", "Accepted limits", "Lifecycle and recovery"]) {
    assert.ok(outside.includes(token), `${token}: token no longer exists outside the gate, so this check is dead`);
    assert.equal(inside.includes(token), false,
      `${token}: moved inside the capsule gate, so a capsule-less session would lose it`);
  }
});

// Every skill that calls the capsule tool names it by a `<plugin root>` placeholder, and the
// canon that resolves that placeholder lives in `baseline-predicates.md` \u2014 the file the entry
// call decides the read range of, and a file `split` and `work` never read at all. So each
// call site carries the resolution itself; without it a model guesses a path, and a guess
// that misses is silent: the entry reads a capsule-bearing project as capsule-less, and
// split and work select no capsule while the card runs on regardless.
// The two resolution clauses are identical everywhere (one concept, one word); only the exit
// differs, because each site loses a different thing when the tool cannot be reached.
const PLUGIN_ROOT_RESOLUTION = {
  en: "`<plugin root>` is the folder two levels above this loaded file, and in a runtime that sets `${CLAUDE_PLUGIN_ROOT}` that variable names the same folder.",
  ko: "`<\uD50C\uB7EC\uADF8\uC778 \uB8E8\uD2B8>`\uB294 \uC9C0\uAE08 \uC5F4\uC5B4 \uB454 \uC774 \uD30C\uC77C\uC5D0\uC11C \uB450 \uB2E8\uACC4 \uC704 \uD3F4\uB354\uC774\uACE0, `${CLAUDE_PLUGIN_ROOT}`\uB97C \uC124\uC815\uD558\uB294 \uB7F0\uD0C0\uC784\uC5D0\uC11C\uB294 \uADF8 \uBCC0\uC218\uAC00 \uAC19\uC740 \uD3F4\uB354\uB97C \uAC00\uB9AC\uD0A8\uB2E4.",
};
const PLUGIN_ROOT_EXIT_PREFIX = {
  en: "When the platform gives this file no source path, or the tool cannot be run there, report that in one line and ",
  ko: "\uD50C\uB7AB\uD3FC\uC774 \uC774 \uD30C\uC77C\uC758 \uC6D0\uBCF8 \uACBD\uB85C\uB97C \uC8FC\uC9C0 \uC54A\uAC70\uB098 \uADF8 \uC790\uB9AC\uC5D0\uC11C \uB3C4\uAD6C\uB97C \uC2E4\uD589\uD560 \uC218 \uC5C6\uC73C\uBA74 \uD55C \uC904\uB85C \uBCF4\uACE0\uD558\uACE0 ",
};
// verify: the gate falls back to reading the whole canon. resume: the domain answer stands
// without the capsule index. split: nothing reaches `Read first`. work: no body is opened.
// Each is the canonical disposition for that site, not a new rule.
const CAPSULE_TOOL_CALL_SITES = [
  ["skills/resume/SKILL.md", "en", "answer from the capability document alone, with no capsule index."],
  ["skills/verify/SKILL.md", "en", "take the every-other-output branch below."],
  ["skills/split/SKILL.md", "en", "put no capsule path on `Read first`."],
  ["skills/work/SKILL.md", "en", "open no capsule body."],
  ["skills/resume/SKILL_ko.md", "ko", "\ucea1\uc290 \uc0c9\uc778 \uc5c6\uc774 \ub2a5\ub825 \ubb38\uc11c\ub9cc\uc73c\ub85c \ub2f5\ud55c\ub2e4."],
  ["skills/verify/SKILL_ko.md", "ko", "\uC544\uB798 \u300C\uADF8 \uBC16\uC758 \uBAA8\uB4E0 \uCD9C\uB825\u300D \uAC08\uB798\uB97C \uD0C4\uB2E4."],
  ["skills/split/SKILL_ko.md", "ko", "\uCEA1\uC290 \uACBD\uB85C\uB97C `\uC77D\uC744 \uAC83`\uC5D0 \uB123\uC9C0 \uC54A\uB294\uB2E4."],
  ["skills/work/SKILL_ko.md", "ko", "\uCEA1\uC290 \uBCF8\uBB38\uC744 \uC5F4\uC9C0 \uC54A\uB294\uB2E4."],
];

test("every capsule-tool call site resolves <plugin root> and names its own failure exit", () => {
  // line wrapping differs per file, so compare on flattened whitespace
  const flat = (text) => text.replace(/\s+/g, " ");
  const called = new Set();
  for (const [relative, language, exit] of CAPSULE_TOOL_CALL_SITES) {
    const text = flat(fs.readFileSync(path.join(root, relative), "utf8"));
    assert.ok(/project-knowledge\.mjs (presence|project|disputes|select)/.test(text),
      `${relative}: listed as a call site but calls no capsule subcommand`);
    assert.ok(text.includes(PLUGIN_ROOT_RESOLUTION[language]),
      `${relative}: must resolve <plugin root> at the call site, in the same words as every other site`);
    assert.ok(text.includes(PLUGIN_ROOT_EXIT_PREFIX[language] + exit),
      `${relative}: must name its own exit for a tool it cannot reach`);
    called.add(relative);
  }
  // no skill may call the tool from outside this table \u2014 a new caller without the resolution
  // is exactly the defect this check exists for
  for (const dir of fs.readdirSync(path.join(root, "skills"))) {
    for (const name of ["SKILL.md", "SKILL_ko.md"]) {
      const relative = `skills/${dir}/${name}`;
      const full = path.join(root, relative);
      if (!fs.existsSync(full)) continue;
      const placeholder = /<plugin root>|<\uD50C\uB7EC\uADF8\uC778 \uB8E8\uD2B8>/.test(fs.readFileSync(full, "utf8"));
      assert.equal(placeholder, called.has(relative),
        `${relative}: uses the <plugin root> placeholder but is not in CAPSULE_TOOL_CALL_SITES`);
    }
  }
});

test("the entry skill that reads the baseline canon gates its capsule range on the tool, and falls to reading on anything else", () => {
  // resume stopped reading the baseline canon when the state tool took over its judgments, so
  // the gate has one reader left. It is not weakened for that reader: both branches, the exact
  // opening answer, and both range headings are still required, in both languages.
  for (const [skill, language, gate] of [
    ["verify", "SKILL.md", CAPSULE_GATE["skills/principles/baseline-predicates.md"]],
    ["verify", "SKILL_ko.md", CAPSULE_GATE["skills/principles/baseline-predicates_ko.md"]],
  ]) {
    const label = `${skill}/${language}`;
    const text = fs.readFileSync(path.join(root, "skills", skill, language), "utf8");
    // the machine, not the model, computes the predicate
    assert.match(text, /project-knowledge\.mjs presence/, label);
    // reaching that machine is held by the call-site check above, for every caller at once
    // the entry sentence names the same boundary the canon carries, so a rename breaks here
    assert.ok(text.includes(gate.open), `${label}: must name ${gate.open}`);
    assert.ok(text.includes(gate.close), `${label}: must name ${gate.close}`);
    // only one exact answer opens the gate
    assert.match(text, /capsuleArtifacts=absent/, label);
    // and every other answer keeps the current full read
    assert.ok(text.includes(gate.kept), `${label}: the other branch must still name ${gate.kept}`);
  }
});

test("the state tool is called by relative path and none of the retired call protocol survives", () => {
  for (const language of ["SKILL.md", "SKILL_ko.md"]) {
    const resume = fs.readFileSync(path.join(root, "skills", "resume", language), "utf8");
    // The tool sits beside the canon, so it is reached the same way the canon is. A skill that
    // reintroduced the placeholder here would reintroduce the resolution defect v0.18.6 removed.
    assert.match(resume, /node ..[/]principles[/]scripts[/]project-state[.]mjs state/, language);
    assert.doesNotMatch(resume, /<plugin root>[/]scripts[/]project-state/, language);
    assert.doesNotMatch(resume, /<\ud50c\ub7ec\uadf8\uc778 \ub8e8\ud2b8>[/]scripts[/]project-state/, language);
    // The four sentences the narrowed call retired. Each one asked the session to encode a
    // conversational fact, hand it to the tool, and call again; the tool answers none of them
    // now, so a session still carrying one waits on a round trip that never returns.
    for (const retired of [/changeRequestPending/, /pending-input/, /--answer /,
      /--defer-|--named-card|--session-unit|--chosen-claim|--carried-claim|--reported-blocked-audit|--full-set|--explain/]) {
      assert.doesNotMatch(resume, retired, `${language}: retired call protocol survives`);
    }
  }
  // A prohibition on re-reading the conditions was what held the saving up in the earlier
  // design. The conditions are on the screen now, so the prohibition has no subject and its
  // presence would only invite a reader to look for one.
  assert.doesNotMatch(fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8"),
    /do not read the conditions again|never read the conditions again/i);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "skills", "resume", "SKILL_ko.md"), "utf8"),
    /\uc870\uac74\uc740 \ub2e4\uc2dc \uc77d\uc9c0 \uc54a\ub294\ub2e4/);
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  // `next:` is derived, and saying so is what lets a session override it from the same screen.
  assert.match(resume, /it is a summary\s+derived from the facts, not a contract/);
  // Every zone prints even when empty, which is what makes "nothing is pending here" visible
  // without a second call.
  assert.match(resume, /an empty zone still prints its line/);
});

// ---------------------------------------------------------------------------
// A: the progress log's machine lines have one format owner, one producer, and a
// revision anchor a reader with only Git can resolve.
// ---------------------------------------------------------------------------

// Prose wraps; meaning does not. Collapse runs of whitespace so a rewrap never turns a
// contract assertion red and never lets a reworded rule pass.
function flat(text) {
  return text.replace(/\s+/g, " ");
}

test("the progress log has four machine formats in one canonical list", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ completion signal result: head: <[^>]+>; verdict: pass \| fail \| unverified; detail-json: <short JSON string>/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ review result: head: <[^>]+>; verdict: pass \| objections \| unverified; detail-json: <short JSON string>/);
  // One list names the closed set, so a fifth format cannot appear beside a bullet.
  assert.match(principles, /`completion signal result:`[\s\S]{0,160}`review result:`[\s\S]{0,160}`carry:`[\s\S]{0,160}`remote evidence check:`/);
  // Every other progress line stays the implementer's prose.
  assert.match(principles, /[Ee]very other progress line is the implementer's prose/);
  // The format lives here once; work only fills the values.
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.doesNotMatch(work, /verdict: pass \| fail \| unverified; detail-json:/);
  assert.doesNotMatch(work, /verdict: pass \| objections \| unverified; detail-json:/);
});

test("each progress result is anchored by the commit that first introduced its line", () => {
  const principles = flat(fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8"));
  // One rule, not a branch per path: the anchor is whichever task commit carries the line first.
  assert.match(principles, /revision anchor is the next canonical task commit that first carries that line/);
  assert.match(principles, /a descendant that still contains the line is not the anchor/);
  assert.match(principles, /before the task diff changes and before this path leaves for a boundary or design commit/);
  // The four shapes are instances of that one rule, not exceptions to it.
  for (const instance of [
    /straight-through final local `pass` and its clean review ride the final task commit/,
    /`fail`, `objections`, or `unverified` rides that card's `NN\.N wip: [^`]*` checkpoint/,
    /a clean review on the remote-evidence path rides the `NN\.N wip: evidence-wait` checkpoint/,
    /a departure that stales the card rides its `NN\.N wip: upper-document change` checkpoint/,
  ]) assert.match(principles, instance);
  // The execution base is a field, so another flow's commit between run and anchor cannot move it.
  assert.match(principles, /`head:` is the full object ID of HEAD captured immediately before that run or review input/);
  assert.match(principles, /`head:` is not the containing commit/);
  // Two or more checkpoints still reconstruct one attempt.
  assert.match(principles, /cumulative task commits from the claim through that anchor/);
  assert.match(principles, /interleaved boundary or design commits[\s\S]{0,120}are not task diff/);
  // A rerun keeps its own base and deletes nothing.
  assert.match(principles, /a rerun writes a new line with its own `head:` and deletes no earlier line/);
  // Remote-only execution keeps its single existing producer.
  assert.match(principles, /never write a generic completion line for the same result/);
});

test("work produces the two result lines and keeps carry the last machine line", () => {
  const raw = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const work = flat(raw);
  assert.match(work, /Record the result as the canonical `completion signal result:` line/);
  assert.match(work, /record the returned result as the canonical `review result:` line/);
  // work is the only place that can know the base it actually ran against.
  assert.match(work, /Capture the full `git rev-parse HEAD` immediately before the run and write it as that line's `head:`/);
  assert.match(work, /Capture the full `git rev-parse HEAD` immediately before assembling the review input/);
  // The ordering that keeps `carryState()` free of parser exceptions.
  assert.match(work, /Every signal and review result is written before this line, and no machine line follows it/);
  assert.match(work, /run the signal and review again and append a new final `carry:`/);
  // DD-24 stays input/diff freshness. An interruption alone does not stale a result.
  assert.match(work, /An interruption before the anchor commit does not stale a result/);
  // The reviewer never learns the attempt history.
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  for (const text of [raw, reviewer]) {
    assert.doesNotMatch(text, /PR_CONTEXT|commit trailer|pull request/i);
  }
  assert.match(work, /only the card \(Progress log section excluded\)/);
});

// ---------------------------------------------------------------------------
// B: the clean reviewer receives the basis split already approved, and the review
// flow is one place with a human boundary at the third anchored objection about the code.
// ---------------------------------------------------------------------------

const REVIEW_HOMES = [
  ["skills/work/SKILL.md", "skills/work/reviewer.md"],
  ["skills/work/SKILL_ko.md", "skills/work/reviewer_ko.md"],
];

test("the clean reviewer receives every approved non-capsule Read first file", () => {
  const work = flat(fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"));
  const reviewer = flat(fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8"));
  // split already approved these exact paths; withholding them is what produced the
  // speculative objections.
  for (const text of [work, reviewer]) {
    assert.match(text, /every currently existing exact path the card's `Read first` names/);
    // The capsule body is the one exception, and it is named by its exact shape.
    assert.match(text, /except a knowledge-capsule body at `devflow\/project\/capabilities\/NN-name\/K-NNN-topic\.md`/);
  }
  // Resolving the paths belongs to the assembler, not to the role that receives files.
  assert.match(work, /Report a missing path and invent no substitute/);
  assert.doesNotMatch(reviewer, /invent no substitute/);
});

test("no second capsule opening route reaches the reviewer", () => {
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  for (const [, reviewerPath] of REVIEW_HOMES) {
    const reviewer = fs.readFileSync(path.join(root, reviewerPath), "utf8");
    // The role contract is briefed verbatim into a clean context, so a tool call there has
    // no plugin root to resolve and no budget to spend.
    for (const forbidden of [/project-knowledge/, /select --path/, /--approved/, /<plugin root>/, /opening budget/]) {
      assert.doesNotMatch(reviewer, forbidden, `${reviewerPath}: the reviewer must not open a capsule`);
    }
  }
  // work keeps exactly one capsule gate: the loop's own opening step.
  assert.equal((work.match(/project-knowledge\.mjs/g) ?? []).length, 1);
  // Nothing about a capsule is synthesized for the reviewer.
  assert.match(flat(work), /synthesize no capsule header, provenance, or remaining budget for the reviewer/);
  assert.match(flat(work), /the loop's capsule gate stays the only opener/);
});

test("a capsule-only basis becomes an objection about the card, not an invented fact", () => {
  // The Korean original carries the same rule in the fixed Korean term for it. Escaped,
  // because this file is a deploy artifact and carries no Korean of its own.
  assert.match(flat(fs.readFileSync(path.join(root, "skills", "work", "reviewer_ko.md"), "utf8")),
    /\uCE74\uB4DC \uACC4\uC57D\uC5D0 \uB300\uD55C \uC9C0\uC801\uC73C\uB85C \uB3CC\uB824\uBCF4\uB0B8\uB2E4[\s\S]{0,80}\uCEA1\uC290\uC744 \uC5F4\uC9C0\uB3C4 \uC54A\uB294\uB2E4/);
  const reviewer = flat(fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8"));
  assert.match(reviewer, /When the card's contract and the exact files you received cannot decide it, return an objection about the card's contract/);
  assert.match(reviewer, /never infer the missing basis and never open a capsule/);
});

// ---------------------------------------------------------------------------
// The review flow turns on three distinctions, and each is its own table of conditions
// that do not overlap. The seal proves that: for every modeled history, exactly one row
// of each table applies — the last row is an explicit complement, never an unconditional
// default — and the row a second, differently shaped classifier picks is the same one.
// Each action must also carry its steps in the order the procedure needs them.
// ---------------------------------------------------------------------------

// 1. The completion precondition — a verdict and freshness, not freshness alone.
const SIGNAL_ROWS = [
  (h) => h.remoteOnly,
  (h) => !h.remoteOnly && (h.signal === "absent" || h.signal === "unreadable" || !h.fresh),
  (h) => !h.remoteOnly && h.fresh && h.signal === "fail",
  (h) => !h.remoteOnly && h.fresh && h.signal === "unverified",
  (h) => !h.remoteOnly && h.fresh && h.signal === "pass",
];
function expectedSignalRow(h) {
  if (h.remoteOnly) return 0;
  if (h.fresh && h.signal === "pass") return 4;
  if (h.fresh && h.signal === "unverified") return 3;
  if (h.fresh && h.signal === "fail") return 2;
  return 1;
}

// 2. Settling the tail that is written but not yet anchored.
const TAIL_ROWS = [
  (h) => !h.fresh,
  (h) => h.fresh && h.pending === "pass",
  (h) => h.fresh && (h.pending === "code12" || h.pending === "card" || h.pending === "unverified"),
  (h) => h.fresh && h.pending === "code3",
];
function expectedTailRow(h) {
  if (!h.fresh) return 0;
  switch (h.pending) {
    case "code3": return 3;
    case "pass": return 1;
    default: return 2;
  }
}

// 3. Reducing the anchored events. The disposition rows key on how many results followed
// it; the rest key on the latest result and the objection count.
const REDUCE_ROWS = [
  (h) => h.disposition === "valid" && h.after === 0,
  (h) => h.disposition === "valid" && h.after === 1 && h.afterFirst === "pass",
  (h) => h.disposition === "valid" && h.after === 1 && h.afterFirst !== "pass",
  (h) => h.disposition === "valid" && h.after >= 2,
  (h) => h.disposition !== "valid" && h.latest === "none",
  (h) => h.disposition !== "valid" && h.latest === "pass",
  (h) => h.disposition !== "valid" && h.latest === "card",
  (h) => h.disposition !== "valid" && h.latest === "code" && (h.count === 1 || h.count === 2),
  (h) => h.disposition !== "valid" && h.latest === "unverified",
  (h) => h.disposition !== "valid" && h.latest === "code" && h.count >= 3,
];
function expectedReduceRow(h) {
  if (h.disposition === "valid") {
    if (h.after > 1) return 3;
    if (h.after === 0) return 0;
    return h.afterFirst === "pass" ? 1 : 2;
  }
  const byLatest = { none: 4, pass: 5, card: 6, unverified: 8 };
  if (h.latest !== "code") return byLatest[h.latest];
  return h.count >= 3 ? 9 : 7;
}

function reachableReduce(h) {
  if (h.disposition !== "valid" && h.after !== 0) return false;
  if (h.after === 0 && h.afterFirst !== "pass") return false;
  if (h.latest === "none") {
    return h.count === 0 && h.disposition === "none" && h.after === 0;
  }
  if (h.latest === "code" && h.count < 1) return false;
  if (h.disposition === "valid") {
    if (h.count < 3) return false;
    if (h.after === 0) return h.latest === "code" && h.count === 3;
    if (h.after === 1) {
      if (h.latest !== h.afterFirst) return false;
      return h.afterFirst === "code" ? h.count === 4 : h.count === 3;
    }
  }
  return true;
}

const EN_STEPS = {
  signal: [
    [/no generic completion line is created or required/, /take the clean review/, /the loop's remote-evidence route above/, /never wait here for a line the canonical rules forbid/],
    [/run the completion signal/, /record its result/, /read this table again/],
    [/anchor that line/, /before any code change/, /then repair and run it again/],
    [/anchor it the same way first/, /clear the reason it records/, /run it again/],
    [/the precondition stands/, /not yet anchored/, /do not run it again merely because it is unanchored/],
  ],
  tail: [
    [/it is not evidence/, /leave the line where it is/, /only the anchored events in 3/],
    [/takes no anchor of its own/, /the latest settled event that 3 reads/, /Never take the review again for it/, /never carry out an already-consumed disposition again/],
    [/anchor it in its own/, /before the action it selects changes the diff or releases the claim/],
    [/anchor it together with the person's disposition in one checkpoint/, /recognize it and anchor both/, /ask once and anchor both together/],
  ],
  reduce: [
    [/first carry out what that disposition says/, /establish a current `pass` by 1/, /exactly one clean review/],
    [/the carry line/, /the final task commit/],
    [/that disposition is spent/, /stop and report to the person/, /Later evidence never revives it/, /does not go to split/],
    [/the record is broken/, /stop and report to the person/],
    [/establish a current `pass` by 1/, /the first clean review/],
    [/the carry line/, /the final task commit/],
    [/the owner section below/, /whatever the objection count/],
    [/make the repair it names/, /establish a current `pass` by 1/, /a new clean review/],
    [/clear the reason it records/, /establish a current `pass` by 1/, /a clean review again/],
    [/stop and report to the person/, /authorizes nothing/, /fresh execution-proposal approval/],
  ],
};

// The Korean original carries the same steps in the same order. Escaped, because this file
// is a deploy artifact and carries no Korean of its own.
const KO_STEPS = {
  signal: [
    ["\uC77C\uBC18 \uC644\uB8CC \uC904\uC740 \uB9CC\uB4E4\uC9C0\uB3C4 \uC694\uAD6C\uD558\uC9C0\uB3C4 \uC54A\uB294\uB2E4", "\uAE68\uB057\uD55C \uAC80\uD1A0", "\uC6D0\uACA9 \uC99D\uAC70 \uACBD\uB85C", "\uAE30\uB2E4\uB9AC\uC9C0 \uC54A\uB294\uB2E4"],
    ["\uC644\uB8CC \uC2E0\uD638\uB97C \uC2E4\uD589", "\uB2E4\uC2DC \uC77D\uB294\uB2E4"],
    ["\uCF54\uB4DC\uB97C \uBC14\uAFB8\uAE30 \uC804\uC5D0", "anchor", "\uB2E4\uC2DC \uC2E4\uD589"],
    ["\uBA3C\uC800 anchor", "\uC774\uC720\uB97C \uD480\uACE0", "\uC0AC\uB78C\uC5D0\uAC8C \uBCF4\uACE0"],
    ["\uC804\uC81C\uAC00 \uC130\uB2E4", "\uAC80\uD1A0\uC5D0 \uB123\uB294\uB2E4", "\uB2E4\uC2DC \uC2E4\uD589\uD558\uC9C0 \uC54A\uB294\uB2E4"],
  ],
  tail: [
    ["\uC99D\uAC70\uAC00 \uC544\uB2C8\uB2E4", "anchor\uB41C \uC0AC\uAC74\uB9CC \uC77D\uB294\uB2E4"],
    ["\uB530\uB85C anchor\uD558\uC9C0 \uC54A\uB294\uB2E4", "3\uC774 \uACE0\uB974\uB294 \uD589\uB3D9", "\uAC80\uD1A0\uB97C \uB2E4\uC2DC \uBC1B\uC9C0 \uC54A\uACE0", "\uB2E4\uC2DC \uC2E4\uD589\uD558\uC9C0\uB3C4 \uC54A\uB294\uB2E4"],
    ["diff\uB97C \uBC14\uAFB8\uAC70\uB098 \uC810\uC720\uB97C \uD574\uC81C\uD558\uAE30 \uC804\uC5D0", "\uBA3C\uC800 anchor"],
    ["\uD568\uAED8 anchor", "\uC54C\uC544\uBCF4\uACE0", "\uD55C \uBC88 \uBB3C\uC5B4"],
  ],
  reduce: [
    ["\uCC98\uBD84\uC774 \uB9D0\uD55C \uAC83\uC744 \uBA3C\uC800 \uC2E4\uD589", "\uD604\uC7AC `\uD1B5\uACFC`\uB97C \uC138\uC6B4", "\uC815\uD655\uD788 \uD55C \uBC88"],
    ["\uC2B9\uACC4 \uC904", "\uCD5C\uC885 \uC791\uC5C5 \uCEE4\uBC0B"],
    ["\uC18C\uC9C4\uB410\uB2E4", "\uBA48\uCD94\uACE0 \uC0AC\uB78C\uC5D0\uAC8C \uBCF4\uACE0", "split\uC73C\uB85C \uAC00\uC9C0 \uC54A\uB294\uB2E4"],
    ["\uAE30\uB85D\uC774 \uAE68\uC84C\uB2E4", "\uBA48\uCD94\uACE0 \uC0AC\uB78C\uC5D0\uAC8C \uBCF4\uACE0"],
    ["\uD604\uC7AC `\uD1B5\uACFC`\uB97C \uC138\uC6B4", "\uCCAB \uAE68\uB057\uD55C \uAC80\uD1A0"],
    ["\uC2B9\uACC4 \uC904", "\uCD5C\uC885 \uC791\uC5C5 \uCEE4\uBC0B"],
    ["\uC9C0\uC801 \uD69F\uC218\uC640 \uBB34\uAD00\uD558\uAC8C", "\uC18C\uC720\uC790 \uC808"],
    ["\uC218\uB9AC\uB97C \uD558\uACE0", "\uD604\uC7AC `\uD1B5\uACFC`\uB97C \uC138\uC6B4", "\uC0C8 \uAE68\uB057\uD55C \uAC80\uD1A0"],
    ["\uC774\uC720\uB97C \uD480\uACE0", "\uD604\uC7AC `\uD1B5\uACFC`\uB97C \uC138\uC6B4", "\uB2E4\uC2DC \uAE68\uB057\uD55C \uAC80\uD1A0"],
    ["\uBA48\uCD94\uACE0 \uC0AC\uB78C\uC5D0\uAC8C \uBCF4\uACE0", "\uC544\uBB34\uAC83\uB3C4 \uC2B9\uC778\uD558\uC9C0 \uC54A\uB294\uB2E4", "\uC0C8 \uC2E4\uD589 \uC81C\uC548 \uC2B9\uC778"],
  ],
};

// The condition each row states, so that a row cannot quietly widen (a count becoming
// "any", a verdict becoming "fresh") while its action still reads the same.
const EN_WHEN = {
  signal: [
    /running it establishes that only remote evidence remains/,
    /its newest local result is absent, unreadable as a verdict, or stale/,
    /its newest local result is current and `fail`/,
    /its newest local result is current and `unverified`/,
    /its newest local result is current and `pass`/,
  ],
  tail: [
    /stale — its completion inputs or this card's task diff changed since that review ran/,
    /a fresh `pass`/,
    /a fresh objection about the code that is the first or the second, an objection about the card's contract, or `unverified`/,
    /a fresh third objection about the code/,
  ],
  reduce: [
    /a valid disposition with no .*`review result` after it/,
    /exactly one .*`review result` after it, and it is `pass`/,
    /exactly one .*`review result` after it that is not `pass`/,
    /two or more .*`review result` lines after it/,
    /no valid disposition, and no .*`review result` after the boundary/,
    /no valid disposition, and the latest result is `pass`/,
    /no valid disposition, and the latest result objects to the card's contract/,
    /no valid disposition, and the latest result objects to the code and is the first or the second/,
    /no valid disposition, and the latest result is `unverified`/,
    /no valid disposition, and the latest result objects to the code and is the third or later/,
  ],
};

function flowTable(relative, heading, subHeading) {
  const lines = fs.readFileSync(path.join(root, relative), "utf8").split(/\r?\n/);
  const section = lines.findIndex((line) => line === heading);
  assert.notEqual(section, -1, `${relative}: ${heading} is missing`);
  const start = lines.findIndex((line, index) => index > section && line === subHeading);
  assert.notEqual(start, -1, `${relative}: ${subHeading} is missing`);
  const header = lines.findIndex((line, index) => index > start && line.startsWith("|"));
  assert.notEqual(header, -1, `${relative}: ${subHeading} has no table`);
  const rows = [];
  for (let i = header + 2; i < lines.length && lines[i].startsWith("|"); i += 1) {
    const cells = lines[i].split("|").slice(1, -1).map((cell) => cell.trim());
    assert.equal(cells.length, 2, `${relative} ${subHeading}: row ${rows.length + 1} is not two cells`);
    rows.push({ when: cells[0], action: cells[1] });
  }
  assert.doesNotMatch(lines.slice(start, header).join("\n"), /├─|└─/,
    `${relative}: a branch diagram beside the table is a second, non-total answer`);
  return rows;
}

function stepsInOrder(action, steps, label) {
  let at = 0;
  for (const step of steps) {
    const rest = action.slice(at);
    const found = typeof step === "string" ? rest.indexOf(step) : rest.search(step);
    assert.notEqual(found, -1, `${label}: the action is missing ${step} after the step before it`);
    at += found + 1;
  }
}

const EN_HEADING = "## Review — one flow";
const KO_HEADING = "## \uAC80\uD1A0 — \uD558\uB098\uC758 \uD750\uB984";
const EN_SUBS = ["### 1. The completion precondition", "### 2. Settle the written tail before acting on it", "### 3. Reduce the settled events"];
const KO_SUBS = ["### 1. \uC644\uB8CC \uC804\uC81C", "### 2. \uC4F0\uC778 \uAF2C\uB9AC\uB97C \uC815\uB9AC\uD55C \uB4A4\uC5D0 \uC6C0\uC9C1\uC778\uB2E4", "### 3. \uC815\uB9AC\uB41C \uC0AC\uAC74\uC744 \uCD95\uC57D\uD55C\uB2E4"];
const TABLES = ["signal", "tail", "reduce"];
const PREDICATES = { signal: SIGNAL_ROWS, tail: TAIL_ROWS, reduce: REDUCE_ROWS };

test("each review table is a set of conditions that never overlap and never leave a gap", () => {
  TABLES.forEach((name, index) => {
    const en = flowTable("skills/work/SKILL.md", EN_HEADING, EN_SUBS[index]);
    const ko = flowTable("skills/work/SKILL_ko.md", KO_HEADING, KO_SUBS[index]);
    assert.equal(en.length, PREDICATES[name].length, `${name}: one row per modeled condition`);
    assert.equal(ko.length, en.length, `${name}: the ko table must carry the same rows`);
    en.forEach((row, i) => {
      assert.match(row.when, EN_WHEN[name][i], `${name} row ${i + 1} must state its own condition`);
      assert.ok(row.action.length >= 20, `${name} row ${i + 1} must say what happens next`);
      stepsInOrder(row.action, EN_STEPS[name][i], `en ${name} row ${i + 1}`);
      stepsInOrder(ko[i].action, KO_STEPS[name][i], `ko ${name} row ${i + 1}`);
    });
  });

  const exactlyOne = (rows, h, what) => {
    const matched = rows.map((when, i) => (when(h) ? i : -1)).filter((i) => i >= 0);
    assert.equal(matched.length, 1, `${what}: ${JSON.stringify(h)} matched rows ${JSON.stringify(matched)}`);
    return matched[0];
  };

  let seen = 0;
  for (const signal of ["absent", "unreadable", "fail", "unverified", "pass"]) {
    for (const fresh of [true, false]) {
      for (const remoteOnly of [true, false]) {
        const h = { signal, fresh, remoteOnly };
        seen += 1;
        assert.equal(exactlyOne(SIGNAL_ROWS, h, "signal"), expectedSignalRow(h), `signal ${JSON.stringify(h)}`);
      }
    }
  }
  for (const pending of ["pass", "code12", "code3", "card", "unverified"]) {
    for (const fresh of [true, false]) {
      for (const answerWritten of [true, false]) {
        const h = { pending, fresh, answerWritten };
        seen += 1;
        assert.equal(exactlyOne(TAIL_ROWS, h, "tail"), expectedTailRow(h), `tail ${JSON.stringify(h)}`);
      }
    }
  }
  for (const disposition of ["none", "valid", "elsewhere"]) {
    for (const after of [0, 1, 2]) {
      for (const afterFirst of ["pass", "code", "card", "unverified"]) {
        for (const latest of ["none", "pass", "code", "card", "unverified"]) {
          for (const count of [0, 1, 2, 3, 4]) {
            const h = { disposition, after, afterFirst, latest, count };
            if (!reachableReduce(h)) continue;
            seen += 1;
            assert.equal(exactlyOne(REDUCE_ROWS, h, "reduce"), expectedReduceRow(h), `reduce ${JSON.stringify(h)}`);
          }
        }
      }
    }
  }
  assert.equal(seen, MODELED_REVIEW_HISTORIES, "the modeled history space itself changed");

  // The last reduce row is the explicit complement, not an unconditional default: a history
  // it must not answer proves it.
  assert.equal(REDUCE_ROWS[REDUCE_ROWS.length - 1]({ disposition: "none", latest: "pass", count: 4, after: 0, afterFirst: "pass" }), false,
    "the last row must be a condition, not a catch-all that swallows a pass");
});
const MODELED_REVIEW_HISTORIES = 116;

test("representative histories each reach one action", () => {
  const scenarios = [
    ["running the signal establishes that only remote evidence remains", "signal", { signal: "absent", fresh: false, remoteOnly: true }, 0],
    ["a restart with no completion result yet", "signal", { signal: "absent", fresh: false, remoteOnly: false }, 1],
    ["a repair landed, so the recorded pass is stale", "signal", { signal: "pass", fresh: false, remoteOnly: false }, 1],
    ["a current fail is anchored before the repair", "signal", { signal: "fail", fresh: true, remoteOnly: false }, 2],
    ["a current unverified signal", "signal", { signal: "unverified", fresh: true, remoteOnly: false }, 3],
    ["a fresh unanchored signal pass feeds the review", "signal", { signal: "pass", fresh: true, remoteOnly: false }, 4],
    ["a stale unanchored result is not evidence", "tail", { pending: "code12", fresh: false }, 0],
    ["a fresh unanchored pass takes no anchor of its own", "tail", { pending: "pass", fresh: true }, 1],
    ["a fresh unanchored card objection anchors before the claim is released", "tail", { pending: "card", fresh: true }, 2],
    ["a fresh unanchored third objection anchors with the disposition", "tail", { pending: "code3", fresh: true }, 3],
    ["nothing reviewed yet", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "none", count: 0 }, 4],
    ["the first objection about the code", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "code", count: 1 }, 7],
    ["the third objection anchored with no valid disposition", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "code", count: 3 }, 9],
    ["a disposition written in another checkpoint", "reduce", { disposition: "elsewhere", after: 0, afterFirst: "pass", latest: "code", count: 3 }, 9],
    ["a valid disposition with nothing after it", "reduce", { disposition: "valid", after: 0, afterFirst: "pass", latest: "code", count: 3 }, 0],
    ["the one result after the disposition passes", "reduce", { disposition: "valid", after: 1, afterFirst: "pass", latest: "pass", count: 3 }, 1],
    ["the one result after the disposition objects", "reduce", { disposition: "valid", after: 1, afterFirst: "code", latest: "code", count: 4 }, 2],
    ["the one result after the disposition objects to the card", "reduce", { disposition: "valid", after: 1, afterFirst: "card", latest: "card", count: 3 }, 2],
    ["two results after the disposition", "reduce", { disposition: "valid", after: 2, afterFirst: "pass", latest: "code", count: 4 }, 3],
    ["an objection about the card before the boundary", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "card", count: 2 }, 6],
    ["a review that could not judge", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "unverified", count: 1 }, 8],
    ["a fresh approval from split resets the boundary and the count", "reduce", { disposition: "none", after: 0, afterFirst: "pass", latest: "none", count: 0 }, 4],
    ["the disposition is already written beside the unanchored third objection", "tail", { pending: "code3", fresh: true, answerWritten: true }, 3],
    ["no disposition is written yet beside it", "tail", { pending: "code3", fresh: true, answerWritten: false }, 3],
  ];
  const tables = {
    signal: flowTable("skills/work/SKILL.md", EN_HEADING, EN_SUBS[0]),
    tail: flowTable("skills/work/SKILL.md", EN_HEADING, EN_SUBS[1]),
    reduce: flowTable("skills/work/SKILL.md", EN_HEADING, EN_SUBS[2]),
  };
  for (const [what, name, h, expected] of scenarios) {
    if (name === "reduce") assert.ok(reachableReduce(h), `${what}: the scenario must be a history this procedure can stand in`);
    const matched = PREDICATES[name].map((when, i) => (when(h) ? i : -1)).filter((i) => i >= 0);
    assert.deepEqual(matched, [expected], what);
    const classifier = { signal: expectedSignalRow, tail: expectedTailRow, reduce: expectedReduceRow }[name];
    assert.equal(classifier(h), expected, `${what}: the second classifier disagrees`);
    stepsInOrder(tables[name][expected].action, EN_STEPS[name][expected], `${what}: the action`);
  }
});

// ---------------------------------------------------------------------------
// B audit repair: one interruption-safe review flow, a precise boundary between
// machine records and a person's own authority, and one owner for a card whose
// contract cannot support judgment.
// ---------------------------------------------------------------------------

test("prose enters no machine judgment while an explicit human disposition stays a person's authority", () => {
  const principles = flat(fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8"));
  // The machine surface is closed: still exactly four formats and no fifth.
  assert.match(principles, /the four formats above are the whole machine surface, and nothing here adds a fifth/);
  assert.match(principles, /No machine format, no state-tool predicate, and no recorded result is ever derived from it/);
  // But a literal reader of a procedure may obey a person's answer written there.
  assert.match(principles, /when a procedure asks for an explicit human disposition, the answer is one bounded ordinary line and a literal reader obeys it as the person's word/);
  // Its binding is positional, so it needs no format, key, file, or second writer.
  assert.match(principles, /same checkpoint, immediately after the line it answers/);
  assert.match(principles, /needs no format, no key, no new file, and no second writer/);
  // The ladder and the flow must never name two next actions for one review event —
  // including a review that could not judge, which the ladder would otherwise retry.
  assert.match(principles, /Review rounds are not ladder counts either/);
  assert.match(principles, /`Review — one flow` owns that count, its human boundary, and what a review that could not judge does next/);
});

test("the boundary, the count, and the disposition's binding are fixed once", () => {
  const work = flat(fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"));
  assert.match(work, /read from the canonical planning commit carrying this card's current `Approval` forward, in commit order/);
  assert.match(work, /A new execution-proposal approval is a new boundary and the objection count starts again at zero/);
  assert.match(work, /one review carrying five objections is one, and `pass`, `unverified`, and an objection about the card's contract raise nothing/);
  assert.match(work, /valid only in the same checkpoint as the third objection about the code and immediately after that line/);
  assert.match(work, /bounded ordinary Progress entry that invents no machine format, and a disposition written anywhere else is not one/);
  // Current is a verdict as well as freshness, and no review starts without a passing one.
  assert.match(work, /Current means both fresh and a verdict: its completion inputs and this card's task diff are unchanged since it ran, and the line carries one of the three verdicts/);
  assert.match(work, /No clean review starts unless the current local completion result is `pass`/);
  // One home: the role contract restates none of the flow.
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  for (const forbidden of [/objection count/, /the third objection/, /clean review/, /disposition/]) {
    assert.doesNotMatch(reviewer, forbidden, "the flow lives in work, not in the role contract");
  }
});

test("a forbidden Read first path is a card defect, not a reviewer input", () => {
  const work = flat(fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"));
  assert.match(work, /Validate `Read first` before assembling: a baseline path directly under `devflow\/project\/capabilities\/` is the legacy wiring this loop already refuses to open, and in a card's contract it is a defect — start no review and hand the reviewer nothing: checkpoint, name that exact invalid path in the progress log, release the claim, and take it to the owner section/);
  // The settled input contract is untouched around it.
  assert.match(work, /every currently existing exact path the card's `Read first` names/);
  assert.match(work, /Report a missing path and invent no substitute/);
  assert.match(work, /except a knowledge-capsule body at `devflow\/project\/capabilities\/NN-name\/K-NNN-topic\.md`/);
  assert.match(work, /the loop's capsule gate stays the only opener/);
});

test("an objection about the card's contract routes to split, which owns only the card", () => {
  const work = flat(fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"));
  assert.match(work, /An objection about the card's contract belongs to split/);
  // Progress is a handoff, not authority over anything outside the card.
  assert.match(work, /write the missing proposition and what this loop observed into the progress log, concretely — that is a handoff, not authority to change a document outside the card/);
  assert.match(work, /split changes only what it already owns: the task card's fields and the exact `Read first` paths already in that card/);
  assert.match(work, /establishes any replacement statement or path from the existing canonical owner under its own permitted reads/);
  assert.match(work, /writes no arch file, capability document, or other `Read first` file from the progress log, and it neither opens nor infers a capsule/);
  assert.match(work, /When no legitimate existing non-capsule basis can go into the card's contract, it does not approve the same card again/);
  assert.match(work, /The same route carries the defect this loop finds itself before a review: an invalid exact `Read first` path named in the progress log is the same card-contract defect, and split repairs it under the same limits/);
  assert.match(work, /An approval that does land is a new boundary, so the objection count starts at zero/);
  assert.doesNotMatch(work, /new planning document|second planning layer/);
  // split carries the same limits on the route it already owns.
  const split = flat(fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8"));
  assert.match(split, /a clean review returns an objection about the card's contract, or work names an invalid exact `Read first` path in the progress log before a review and releases the card/);
  assert.match(split, /either card-contract defect reads the progress log as a handoff naming what is missing, establishes the replacement statement or path from its existing canonical owner under its own permitted reads, and repairs only the fields and the exact non-capsule `Read first` paths the card already carries/);
  assert.match(split, /writes no arch file, capability document, or other `Read first` file from the progress log, opens and infers no capsule, and when no legitimate existing non-capsule basis can go into the card's contract it stops and reports to the person/);
});

// ---------------------------------------------------------------------------
// The three layers have to compose into ONE next action, not three independent answers.
// 2 settles what is written, 3 reduces the settled events, and 1 is what a review-bearing
// outcome means by "establish a current `pass`" — including the remote-only branch, which
// must never sit waiting for a generic line the canonical rules forbid.
// ---------------------------------------------------------------------------

const COMPOSED_ACTIONS = new Set([
  "tail:anchor-before-acting", "tail:anchor-third-with-disposition",
  "card:pre-review-handoff", "signal:remote-only", "signal:run",
  "signal:anchor-then-repair", "signal:anchor-then-clear",
  ...Array.from({ length: 10 }, (unused, i) => `reduce:${i}`),
]);

// Shape one — the pipeline the section describes: 2 settles the written tail, 3 reduces the
// settled events, and 1 is what the one review-bearing outcome with no step of its own means
// by "establish a current `pass`". The forbidden-baseline check belongs to assembling the
// review input, so a step 3 owes first happens before it.
function composedAction(h) {
  const tailRow = h.pending === "none" ? -1 : TAIL_ROWS.findIndex((row) => row(h));
  if (tailRow === 2) return "tail:anchor-before-acting";
  if (tailRow === 3) return "tail:anchor-third-with-disposition";
  const settled = tailRow === 1
    ? {
      ...h,
      latest: "pass",
      after: h.disposition === "valid" ? Math.min(h.after + 1, 2) : h.after,
      afterFirst: h.disposition === "valid" && h.after === 0 ? "pass" : h.afterFirst,
    }
    : h;
  const row = REDUCE_ROWS.findIndex((one) => one(settled));
  if (row !== 4) return `reduce:${row}`;
  const next = ["signal:remote-only", "signal:run", "signal:anchor-then-repair", "signal:anchor-then-clear", "reduce:4"][
    SIGNAL_ROWS.findIndex((one) => one(h))
  ];
  const assemblesTheReviewNow = next === "reduce:4" || next === "signal:remote-only";
  return assemblesTheReviewNow && h.readFirstInvalid ? "card:pre-review-handoff" : next;
}

// Shape two — flat exact-action predicates over the raw history, written from the section's
// own wording rather than from the pipeline. Every composed history must match exactly one,
// and it must be the action shape one returns.
const freshTail = (h) => h.pending !== "none" && h.fresh;
const settledPass = (h) => freshTail(h) && h.pending === "pass";
const tailBlocks = (h) => freshTail(h) && h.pending !== "pass";
const latestOf = (h) => (settledPass(h) ? "pass" : h.latest);
const afterOf = (h) => (h.disposition === "valid" && settledPass(h) ? Math.min(h.after + 1, 2) : h.after);
const firstOf = (h) => (h.disposition === "valid" && h.after === 0 && settledPass(h) ? "pass" : h.afterFirst);
const answered = (h) => !tailBlocks(h) && h.disposition === "valid";
const openFlow = (h) => !tailBlocks(h) && h.disposition !== "valid";
const assembling = (h) => openFlow(h) && latestOf(h) === "none";
const currentPass = (h) => !h.remoteOnly && h.fresh && h.signal === "pass";
const COMPOSED_PREDICATES = [
  { action: "tail:anchor-before-acting", when: (h) => tailBlocks(h) && h.pending !== "code3" },
  { action: "tail:anchor-third-with-disposition", when: (h) => tailBlocks(h) && h.pending === "code3" },
  { action: "reduce:0", when: (h) => answered(h) && afterOf(h) === 0 },
  { action: "reduce:1", when: (h) => answered(h) && afterOf(h) === 1 && firstOf(h) === "pass" },
  { action: "reduce:2", when: (h) => answered(h) && afterOf(h) === 1 && firstOf(h) !== "pass" },
  { action: "reduce:3", when: (h) => answered(h) && afterOf(h) >= 2 },
  { action: "reduce:5", when: (h) => openFlow(h) && latestOf(h) === "pass" },
  { action: "reduce:6", when: (h) => openFlow(h) && latestOf(h) === "card" },
  { action: "reduce:7", when: (h) => openFlow(h) && latestOf(h) === "code" && (h.count === 1 || h.count === 2) },
  { action: "reduce:8", when: (h) => openFlow(h) && latestOf(h) === "unverified" },
  { action: "reduce:9", when: (h) => openFlow(h) && latestOf(h) === "code" && h.count >= 3 },
  { action: "card:pre-review-handoff", when: (h) => assembling(h) && h.readFirstInvalid && (h.remoteOnly || currentPass(h)) },
  { action: "signal:remote-only", when: (h) => assembling(h) && h.remoteOnly && !h.readFirstInvalid },
  { action: "signal:run", when: (h) => assembling(h) && !h.remoteOnly && (h.signal === "absent" || h.signal === "unreadable" || !h.fresh) },
  { action: "signal:anchor-then-repair", when: (h) => assembling(h) && !h.remoteOnly && h.fresh && h.signal === "fail" },
  { action: "signal:anchor-then-clear", when: (h) => assembling(h) && !h.remoteOnly && h.fresh && h.signal === "unverified" },
  { action: "reduce:4", when: (h) => assembling(h) && currentPass(h) && !h.readFirstInvalid },
];

test("the three layers compose into one next action", () => {
  const raw = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const work = flat(raw);
  // The reducer literally consumes settled results, and the definition lives once in 3.
  assert.match(work, /Read the settled review events after the boundary in commit order: the anchored `review result` lines, and a fresh unanchored `pass` from 2 as the latest of them/);
  assert.match(work, /After a valid disposition that pass is the one consuming result, so it finishes rather than authorizing another review/);
  const reduceRows = flowTable("skills/work/SKILL.md", EN_HEADING, EN_SUBS[2]);
  const settledConditions = reduceRows.filter((row) => /settled `review result`/.test(row.when));
  assert.equal(settledConditions.length, 5,
    "every row that counts results must count settled ones, not anchored-only ones");
  assert.equal(reduceRows.filter((row) => /anchored `review result`/.test(row.when)).length, 0,
    "no row may still say anchored where it means settled");
  // The settled pass carries its own anchor and repeats nothing.
  assert.match(work, /it is the latest settled event that 3 reads, and the action 3 selects — the final task commit, or the `evidence-wait` checkpoint — carries it. Never take the review again for it, and never carry out an already-consumed disposition again/);
  // The remote-only branch stands ahead of the generic verdict rule.
  assert.match(work, /running it establishes that only remote evidence remains \| no generic completion line is created or required for that result/);
  assert.match(work, /A rerun after an interruption may rediscover the same thing; never wait here for a line the canonical rules forbid/);
  // And the forbidden-path check belongs to assembling the review, not to the front of the flow.
  assert.match(work, /That check runs when the review input is assembled, so a step 3 owes first — carrying out a disposition, making a repair, clearing an `unverified` reason — happens before it/);

  let seen = 0;
  for (const disposition of ["none", "valid", "elsewhere"]) {
    for (const after of [0, 1, 2]) {
      for (const afterFirst of ["pass", "code", "card", "unverified"]) {
        for (const latest of ["none", "pass", "code", "card", "unverified"]) {
          for (const count of [0, 1, 2, 3, 4]) {
            if (!reachableReduce({ disposition, after, afterFirst, latest, count })) continue;
            for (const pending of ["none", "pass", "code12", "code3", "card", "unverified"]) {
              for (const fresh of [true, false]) {
                for (const signal of ["absent", "fail", "unverified", "pass"]) {
                  for (const remoteOnly of [true, false]) {
                    for (const readFirstInvalid of [true, false]) {
                      const h = { disposition, after, afterFirst, latest, count, pending, fresh, signal, remoteOnly, readFirstInvalid };
                      const action = composedAction(h);
                      assert.ok(COMPOSED_ACTIONS.has(action), `no composed action for ${JSON.stringify(h)}`);
                      const matched = COMPOSED_PREDICATES.filter((one) => one.when(h)).map((one) => one.action);
                      assert.equal(matched.length, 1, `${JSON.stringify(h)} matched ${JSON.stringify(matched)}`);
                      assert.equal(matched[0], action, `the two shapes disagree on ${JSON.stringify(h)}`);
                      seen += 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  assert.equal(seen, COMPOSED_HISTORIES, "the composed history space itself changed");
});
const COMPOSED_HISTORIES = 14592;

test("composed scenes each reach one end-to-end action", () => {
  const base = {
    disposition: "none", after: 0, afterFirst: "pass", latest: "none", count: 0,
    pending: "none", fresh: true, signal: "pass", remoteOnly: false, readFirstInvalid: false,
  };
  const scenes = [
    // A straight-through review passed and the session died before the commit: the pass is
    // the latest settled event, so the next action finishes the card — no second review.
    ["straight-through unanchored pass on restart", { pending: "pass" }, "reduce:5"],
    // The same line after a valid disposition is that disposition's one consuming result.
    ["disposition-consuming unanchored pass on restart",
      { disposition: "valid", after: 0, latest: "code", count: 3, pending: "pass" }, "reduce:1"],
    // A stale one is ignored and the anchored events decide instead.
    ["a stale unanchored pass is ignored", { pending: "pass", fresh: false, latest: "code", count: 1 }, "reduce:7"],
    // Remote-only is discovered by running the signal, and never waits for a generic line.
    ["remote-only before the review, heading for evidence-wait", { signal: "absent", remoteOnly: true }, "signal:remote-only"],
    ["remote-only after an interruption does not loop for a generic line",
      { signal: "absent", fresh: false, remoteOnly: true }, "signal:remote-only"],
    // The person's instruction is the first action, and the Read first check waits for the
    // review that instruction leads to.
    ["a valid disposition with nothing after it is carried out even when Read first is invalid",
      { disposition: "valid", after: 0, latest: "code", count: 3, readFirstInvalid: true }, "reduce:0"],
    ["a repair is made before the Read first check", { latest: "code", count: 1, readFirstInvalid: true }, "reduce:7"],
    ["a stale signal is run before the Read first check",
      { signal: "absent", fresh: false, readFirstInvalid: true }, "signal:run"],
    // The forbidden baseline path never reaches the reviewer; it becomes the card handoff.
    ["pre-review forbidden baseline path becomes the card handoff", { readFirstInvalid: true }, "card:pre-review-handoff"],
    ["remote-only with an invalid Read first hands off instead of assembling",
      { signal: "absent", remoteOnly: true, readFirstInvalid: true }, "card:pre-review-handoff"],
    ["a card already finishing is not diverted by the pre-review check",
      { readFirstInvalid: true, latest: "pass", count: 0 }, "reduce:5"],
    // Ordinary settlement still precedes everything that mutates.
    ["a fresh unanchored objection anchors first", { pending: "code12", latest: "code", count: 1 }, "tail:anchor-before-acting"],
    ["a fresh unanchored third objection anchors with the disposition",
      { pending: "code3", latest: "code", count: 2 }, "tail:anchor-third-with-disposition"],
  ];
  for (const [what, over, expected] of scenes) {
    const h = { ...base, ...over };
    assert.equal(composedAction(h), expected, what);
    const matched = COMPOSED_PREDICATES.filter((one) => one.when(h)).map((one) => one.action);
    assert.deepEqual(matched, [expected], `${what}: the flat predicates disagree`);
  }
});

test("a third code objection leaves exactly one producer slot for the person's reply", () => {
  const work = flat(fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"));
  assert.match(work, /After a fresh third objection, append no implementer-authored Progress prose before the person's reply/);
  assert.match(work, /The person's exact reply is the only line permitted immediately after that objection/);
  assert.match(work, /A later reader trusts that ordinary line by this writer boundary, not by inventing a new journal kind or machine tag/);
});

// E1 — a channel that only answered `--help` was recorded as confirmed, and the verifier
// then met a screen it could never read.
test("a screen verify channel is confirmed only by a read probe and an interaction probe", () => {
  const arch = fs.readFileSync(path.join(root, "skills", "arch", "SKILL.md"), "utf8");
  const archKo = fs.readFileSync(path.join(root, "skills", "arch", "SKILL_ko.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  // both probes live on the existing verify_channel `means` line — no second channel home
  assert.match(arch, /^ {2}means:.*read probe: .*interaction probe: /m);
  // written as escapes so this deploy-scanned file itself stays free of Korean
  assert.match(archKo, new RegExp("^ {2}\\uD655\\uC778 \\uC218\\uB2E8:.*\\uC77D\\uAE30 \\uD504\\uB85C\\uBE0C: .*\\uC0C1\\uD638\\uC791\\uC6A9 \\uD504\\uB85C\\uBE0C: ", "m"));
  assert.equal(count(arch, /^verify_channel:$/gm), 1);
  assert.equal(count(archKo, /^verify_channel:$/gm), 1);
  // the four things that are not confirmation are named, so the negative is checkable
  assert.match(arch, /Help output, a\ncapability listing, the binary existing, and an attach that\nexits 0 are none of them confirmation/);
  assert.match(arch, /read one actually rendered element\*\* and\n\*\*succeed at one real interaction\*\*/);
  // the stored line has to name the probes and what was observed, not just that it passed
  assert.match(arch, /exact commands and observed outcomes on that line verbatim/);
  assert.match(arch, /leaves the channel unconfirmed/);
  // old project records are checked by the consumer, not trusted forever
  assert.match(verify, /accept the channel record only when its `means` line contains both\n {3}`read probe:` and `interaction probe:`/);
  assert.match(verify, /return to arch to reconfirm and replace that one\n {3}channel line; write no verification Record or marker and do not brief the verifier/);
});

// E2 — DD-81. A tool failure filed as product evidence multiplied impossible cards; the
// product layer was still walking the DD-68 ladder with it.
test("a channel that could not be acquired is not product evidence at either layer", () => {
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const decisions = fs.readFileSync(path.join(root, "docs", "design-decisions.md"), "utf8");
  // the reason keeps its one home and its one form
  assert.equal(count(verify, /unverified: channel unavailable — /g), 1);
  assert.match(verify, /`unverified: channel unavailable — <the exact command that failed>; timeout=<observed value>`/);
  assert.match(verify, /write `unverified: channel unavailable[\s\S]{0,180}as the exact value of `Executed:`/);
  // non-product tool evidence never enters the product-defect ledger or its consumers
  assert.match(verify, /create no Failure-history entry, set `New entries` to 0, and enter no signal-card, maintenance, repair-lineage, or recurrence route/);
  assert.match(verify, /At the capability layer, land the complete Record as `boundary — capability verification result <capability number>`/);
  assert.match(verify, /step 9 reports and removes a product result marker with no pending work/);
  assert.match(verify, /state suppresses automatic capability and product re-entry and automatic product Audit and Retrospective events/);
  assert.match(verify, /a direct capability verification request or an explicit product verification request starts a new run/);
  assert.doesNotMatch(verify, /reason is `channel unavailable`[\s\S]{0,300}`routing: pending`/);
  assert.match(resume, /Also report every `blocked: kind=channel` line even when another route is first/);
  assert.match(resume, /`blocked\.channel` \| report the exact target, verify path, command, and timeout, then wait/);
  assert.match(decisions.replace(/\s+/g, " "), /DD-81[\s\S]*The item sent to the person is the committed Record's exact `Executed:` result, not a Failure-history entry/);
  assert.match(decisions.replace(/\s+/g, " "), /state projects its target, verify path, command, and timeout as a human wait without creating a second durable owner/);
  const dd81 = decisions.match(/### DD-81[\s\S]*?(?=\r?\n### )/)?.[0] ?? "";
  assert.match(dd81, /Affected coordinates:[\s\S]*skills\/principles\/scripts\/project-state\.mjs[\s\S]*skills\/resume\/SKILL/);
  // removing the special entry must not strand ordinary label-less failures
  assert.match(verify, /For `recurrence observation: 2` or higher[\s\S]{0,360}Otherwise, send only that failure or unverified entry through split's maintenance/);
});

test("tree-input revisions preserve raw bytes without a shell-specific authority", () => {
  const decisionsRaw = fs.readFileSync(path.join(root, "docs", "design-decisions.md"), "utf8");
  const decisions = decisionsRaw.replace(/\s+/g, " ");
  const predicates = fs.readFileSync(path.join(root, "skills", "principles", "verification-predicates.md"), "utf8").replace(/\s+/g, " ");
  assert.match(decisions, /DD-39[\s\S]*State: active, partly corrected by DD-85 \(v0\.19\.0\)/);
  assert.match(decisions, /DD-85 · Tree-input revision hashing preserves raw Git bytes at the process boundary; a Buffer handoff supersedes the Windows-only shell pipe/);
  assert.match(decisions, /exact stdout `Buffer` becomes `git hash-object --stdin`'s stdin without text decoding or shell parsing/);
  const dd85 = decisionsRaw.match(/### DD-85[\s\S]*?(?=\r?\n### )/)?.[0] ?? "";
  assert.match(dd85, /Affected coordinates:[\s\S]*skills\/principles\/scripts\/project-state\.mjs[\s\S]*verification-predicates/);
  assert.match(dd85, /Revisit when:[\s\S]*raw stdout `Buffer`/);
  assert.match(predicates, /pass the raw stdout `Buffer` directly as the stdin of `git hash-object --stdin`/);
  assert.doesNotMatch(predicates, /run that same pipe inside `cmd \/d \/s \/c`/);
});

// E3 — one unfinished interaction became source ids 3, 4, 5, 6, then four candidate roots
// and a root choice no human could make.
test("one attempted scenario step is one failure-history entry", () => {
  const verifier = fs.readFileSync(path.join(root, "skills", "verify", "verifier.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  // the producer: the verifier returns one item per scene
  assert.match(verifier, /One failure scene is one attempted scenario step and the observations it directly\n {3}caused/);
  assert.match(verifier, /one primary failure[\s\S]{0,160}subordinate signals[\s\S]{0,160}same evidence and reproduction/);
  assert.match(verifier, /A suspected different\n {3}cause never splits observations from that attempted step/);
  assert.match(verifier, /another item only for a\n {3}separate attempted scenario step that reproduces independently/);
  // the recorder: one scene, one source id, one root — the old per-reason split is gone
  assert.doesNotMatch(verify, /Give each fail or unverified reproduction, criterion, or reason one new source id/);
  assert.match(verify, /Give each failure scene[\s\S]{0,200}one new source id/);
  assert.match(verify, /so that scene's repair lineage root is one too/);
  // post-verifier normalization and the pre-verifier label projection have distinct order
  assert.match(verify, /after the verifier returns[\s\S]{0,180}before the recorder assigns this result's source ids and repair-lineage fields/);
  assert.match(verify, /does not change the Pre-verifier Repair Lineage Projection[\s\S]{0,140}not a relaxation of the human gate/);
  // the ambiguous-multi-root stop is untouched
  assert.match(verify, /Two or more candidate roots or an unparseable format blocks the whole execution before the verifier/);
});
