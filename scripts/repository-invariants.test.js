#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.join(__dirname, "..");
const P2_PACKAGES = [
  "principles",
  "adopt",
  "product",
  "arch",
  "design",
  "resume",
  "direct",
  "work",
  "verify",
];
const LANGUAGE_PAIR_RELATIVES = [
  "codex/AGENTS-devflow_ko.md",
  "docs/design_ko.md",
  "docs/design-decisions_ko.md",
  "docs/design-backlog_ko.md",
  "docs/maintenance-protocol_ko.md",
  "docs/rounds/v0.10.0/proposal_ko.md",
  "docs/rounds/v0.11.0/report_ko.md",
  "docs/rounds/v0.9.21/report_ko.md",
];
const ROOT_SCRIPT_LIFECYCLES = new Map([
  ["decision-index.mjs", ["AGENTS.md", "docs/design.md"]],
  ["project-knowledge.mjs", ["skills/principles/references/knowledge/opening-and-freshness.md"]],
  ["remove-generated-codex-prompts.js", ["codex/install.ps1", "codex/install.sh"]],
  ["remove-legacy-codex-hook.js", ["codex/install.ps1", "codex/install.sh"]],
  ["session-start.js", ["hooks/hooks.json"]],
  ["skill-rails-semantic-audit.mjs", []],
  ["verify-codex-plugin-install.js", ["codex/install.ps1", "codex/install.sh"]],
]);
const PRINCIPLES_CUSTOM_SCRIPT_LIFECYCLES = new Map([
  ["project-state.mjs", { directTest: "scripts/project-state.test.js", consumers: [] }],
  ["project-knowledge.mjs", { directTest: "scripts/project-knowledge.test.js", consumers: ["skills/principles/references/knowledge/opening-and-freshness.md"] }],
  ["semantic-audit.mjs", { directTest: null, consumers: ["scripts/repository-invariants.test.js"] }],
]);

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function normalizedText(relative) {
  return read(relative).replace(/\r\n/g, "\n");
}

function structure(text) {
  const count = (pattern) => (text.match(pattern) || []).length;
  return {
    headings: count(/^#{1,6}\s+/gm),
    numberedItems: count(/^\s*\d+\.\s+/gm),
    bulletItems: count(/^\s*[-*]\s+/gm),
    tableRows: count(/^\s*\|.*\|\s*$/gm),
    diagrams: count(/^```mermaid\s*$/gm),
  };
}

function machineFigures(text) {
  return {
    versions: [...text.matchAll(/\bv?\d+\.\d+(?:\.\d+)?\b/gi)].map((match) => match[0]),
    percentages: [...text.matchAll(/[+-]?\d+(?:\.\d+)?%/g)].map((match) => match[0]),
  };
}

function walk(dir, predicate, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target, predicate, output);
    else if (predicate(entry.name)) output.push(target);
  }
  return output;
}

test("declared Korean design originals have structurally equivalent English deploy pairs", () => {
  for (const relative of LANGUAGE_PAIR_RELATIVES) {
    const original = path.join(root, relative);
    const deployed = original.replace(/_ko\.md$/, ".md");
    assert.ok(fs.existsSync(original), `missing original ${relative}`);
    assert.ok(fs.existsSync(deployed), `missing pair for ${relative}`);
    assert.deepEqual(structure(fs.readFileSync(original, "utf8")), structure(fs.readFileSync(deployed, "utf8")),
      `structure drift: ${relative}`);
    assert.deepEqual(machineFigures(fs.readFileSync(original, "utf8")), machineFigures(fs.readFileSync(deployed, "utf8")),
      `machine-checkable figure drift: ${relative}`);
  }
});

test("English deploy artifacts contain no Korean", () => {
  const deployFiles = [
    "AGENTS.md",
    "CHANGELOG.md",
    "CLAUDE.md",
    "docs/design.md",
    "docs/design-decisions.md",
    "docs/design-backlog.md",
    "docs/maintenance-protocol.md",
    "codex/AGENTS-devflow.md",
    "codex/install.ps1",
    "codex/install.sh",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    "hooks/hooks.json",
    ...walk(path.join(root, "skills"), (name) => name.endsWith(".md") && !name.endsWith("_ko.md")),
    ...walk(path.join(root, "scripts"), (name) => name.endsWith(".js") || name.endsWith(".mjs")),
  ].map((item) => (path.isAbsolute(item) ? item : path.join(root, item)));

  for (const file of deployFiles) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    // P2 preserves the original Korean source verbatim in its provenance ledger. Those
    // records are migration evidence, not English runtime guidance.
    if (/^skills\/[^/]+\/references\/legacy-atoms\//.test(relative)) continue;
    assert.doesNotMatch(read(relative), /[\uAC00-\uD7A3]/, `${relative}: Korean in English deploy artifact`);
  }
});

test("the generated decision projections remain source-ordered one-to-one views", () => {
  const tool = path.join(root, "scripts", "decision-index.mjs");
  const projected = [];
  for (const [args, bodyFile] of [
    [[], "docs/design-decisions.md"],
    [["--lang", "ko"], "docs/design-decisions_ko.md"],
  ]) {
    const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const indexed = [...result.stdout.matchAll(/^\|\s*(DD-\d+)\s*\|/gm)].map((match) => match[1]);
    const bodied = [...read(bodyFile).matchAll(/^###\s+(DD-\d+)\s+·/gm)].map((match) => match[1]);
    assert.ok(indexed.length > 0, `${bodyFile}: generated projection has no decisions`);
    assert.deepEqual(new Set(indexed).size, indexed.length, `${bodyFile}: duplicate projected rows`);
    assert.deepEqual(new Set(bodied).size, bodied.length, `${bodyFile}: duplicate decision bodies`);
    assert.deepEqual(indexed, bodied, `${bodyFile}: projection is not source ordered`);
    projected.push(indexed);
  }
  assert.deepEqual(projected[0], projected[1], "English and Korean projections disagree on identifiers");
});

test("decision and rejection identifiers remain dense and decision states are known", () => {
  const body = read("docs/design-decisions.md");
  for (const [prefix, pattern] of [
    ["DD", /^###\s+(DD-\d+)\s+·/gm],
    ["DR", /\*\*\[(DR-\d+)\s+·/g],
  ]) {
    const numbers = [...body.matchAll(pattern)].map((match) => Number(match[1].slice(3))).sort((a, b) => a - b);
    assert.deepEqual(new Set(numbers).size, numbers.length, `${prefix}: identifier is reused`);
    assert.deepEqual(numbers, numbers.map((_, index) => index + 1), `${prefix}: identifiers are not dense`);
  }
  for (const state of [...body.matchAll(/\|\s*State:\s*(.+)$/gm)].map((match) => match[1].trim())) {
    assert.match(state, /^(?:active|replaced by DD-\d+ \(v\d+\.\d+\.\d+\)|active, partly corrected by DD-\d+ \(v\d+\.\d+\.\d+\)(?:, DD-\d+ \(v\d+\.\d+\.\d+\))*)$/,
      `unknown decision state: ${state}`);
  }
});

test("repository-owned documentation references resolve", () => {
  const markdown = walk(root, (name) => name.endsWith(".md"));
  const dangling = [];
  for (const file of markdown) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    if (relative === "CHANGELOG.md" || relative === "docs/changelog-archive.md") continue;
    for (const match of fs.readFileSync(file, "utf8").matchAll(/\bdocs\/[A-Za-z0-9._/-]+\.md\b/g)) {
      const target = match[0];
      const ours = target.startsWith("docs/rounds/")
        || /^docs\/(design|maintenance-protocol|audit-guideline|usecase-matrix|capability-knowledge|v0\.)/.test(target);
      if (ours && !fs.existsSync(path.join(root, target))) dangling.push(`${relative} -> ${target}`);
    }
  }
  assert.deepEqual(dangling, [], "documents name docs paths that do not exist");
});

test("the maintenance entry routes to its canonical document owners", () => {
  const agents = read("AGENTS.md");
  for (const required of [
    "docs/design.md",
    "docs/design-decisions.md",
    "docs/design-backlog.md",
    "docs/maintenance-protocol.md",
    "docs/audit-guideline_ko.md",
    "docs/usecase-matrix_ko.md",
    "docs/rounds/",
  ]) assert.ok(agents.includes(required), `AGENTS.md never names ${required}`);
  assert.ok(read("docs/design.md").includes("Skill intent index"), "design lacks its component-intent owner");
  assert.ok(read("docs/maintenance-protocol.md").includes("## 7. Release and installation"),
    "release procedure is not reachable from its canonical owner");
});

test("maintenance onboarding stays bounded and every protocol section has an entry route", () => {
  const agents = read("AGENTS.md");
  const protocol = read("docs/maintenance-protocol.md");
  const sections = [...protocol.matchAll(/^##\s+(\d+)\./gm)].map((match) => match[1]);
  assert.deepEqual(sections, ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    "the canonical maintenance protocol no longer has its nine numbered sections");
  for (const section of sections) {
    assert.ok(agents.includes(`\u00a7${section}`), `protocol \u00a7${section} has no AGENTS.md route`);
  }
  const normalizedAgents = normalizedText("AGENTS.md");
  const normalizedDesign = normalizedText("docs/design.md");
  assert.ok(Buffer.byteLength(normalizedAgents) <= 6 * 1024, "AGENTS.md exceeds the 6 KiB entry budget");
  assert.ok(Buffer.byteLength(normalizedDesign) <= 26 * 1024, "docs/design.md exceeds the 26 KiB intent budget");
  assert.ok(Buffer.byteLength(normalizedAgents) + Buffer.byteLength(normalizedDesign) <= 32 * 1024,
    "always-read AGENTS.md + docs/design.md exceeds 32 KiB");
  assert.doesNotMatch(protocol, /^\| Condition \| Read additionally \|$/m,
    "conditional read dispatch is duplicated outside AGENTS.md");
  assert.match(agents, /opening a folder under `docs\/rounds\/`[^\n]+not the bounded current-state read/i);
  assert.match(protocol, /versioned implementation without naming a round-document role[\s\S]+`report_ko\.md`/i);
  assert.doesNotMatch(agents, /read (?:all of |the whole )?docs\/maintenance-protocol\.md/i);
  for (const forbidden of ["CURRENT.md", "another skill map", "whole CHANGELOG", "all rounds"]) {
    assert.ok(agents.includes(forbidden), `AGENTS.md does not bound default onboarding through ${forbidden}`);
  }
});

test("the always-read design intent index covers promoted packages and their role homes", () => {
  const design = read("docs/design.md");
  const start = design.indexOf("### Skill intent index");
  const end = design.indexOf("## Document map", start);
  assert.ok(start >= 0 && end > start, "design.md has no bounded skill intent index");
  const intent = design.slice(start, end);
  for (const id of P2_PACKAGES) assert.ok(intent.includes(`\`${id}\``), `skill intent index omits ${id}`);
  for (const roleHome of [
    "references/state/task-card-predicates.md",
    "references/verification/revision-predicates.md",
    "references/verification/event-predicates.md",
    "references/knowledge/baseline-contract.md",
    "references/planning/evidence-discipline.md",
    "work/references/reviewer-role.md",
    "verify/references/verifier-role.md",
    "verify/references/auditor-role.md",
    "verify/references/retrospector-role.md",
    "references/coordination/coordinator-contract.md",
  ]) assert.ok(intent.includes(`\`${roleHome}\``), `skill intent index omits ${roleHome}`);
});

test("maintenance scripts and documents have repository-owned lifecycles", () => {
  const scriptsDir = path.join(root, "scripts");
  const deployedScripts = fs.readdirSync(scriptsDir)
    .filter((name) => /\.(?:js|mjs)$/.test(name) && !name.endsWith(".test.js"))
    .sort();
  assert.deepEqual(deployedScripts, [...ROOT_SCRIPT_LIFECYCLES.keys()].sort(),
    "scripts contains an undeclared deploy artifact or lost a lifecycle");
  for (const [script, consumers] of ROOT_SCRIPT_LIFECYCLES) {
    for (const consumer of consumers) assert.ok(read(consumer).includes(script), `${script} has no consumer in ${consumer}`);
    const directTest = script.replace(/\.m?js$/, ".test.js");
    assert.ok(fs.existsSync(path.join(scriptsDir, directTest)),
      `${script} has no direct suite`);
  }

  const design = read("docs/design.md");
  for (const entry of fs.readdirSync(path.join(root, "docs"), { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (entry.name.endsWith("_ko.md")) {
      const deployed = entry.name.replace(/_ko\.md$/, ".md");
      const standingInstrument = new Set(["audit-guideline_ko.md", "usecase-matrix_ko.md"]);
      assert.ok(standingInstrument.has(entry.name) || fs.existsSync(path.join(root, "docs", deployed)),
        `${entry.name} has neither a deploy pair nor a declared Korean-only lifecycle`);
    } else {
      assert.ok(design.includes(`docs/${entry.name}`), `${entry.name} is absent from the document map`);
    }
  }
});

test("Principles custom scripts have the bounded direct test or consumer inventory", () => {
  const scriptsDir = path.join(root, "skills", "principles", "scripts");
  const actual = fs.readdirSync(scriptsDir)
    .filter((name) => /\.mjs$/.test(name) && name !== "skill-rails")
    .sort();
  assert.deepEqual(actual, [...PRINCIPLES_CUSTOM_SCRIPT_LIFECYCLES.keys()].sort(),
    "Principles custom-script inventory changed without direct lifecycle review");
  for (const [script, lifecycle] of PRINCIPLES_CUSTOM_SCRIPT_LIFECYCLES) {
    if (lifecycle.directTest) assert.ok(fs.existsSync(path.join(root, lifecycle.directTest)), `${script} lacks ${lifecycle.directTest}`);
    for (const consumer of lifecycle.consumers) assert.ok(read(consumer).includes(script), `${script} has no consumer in ${consumer}`);
    assert.ok(lifecycle.directTest || lifecycle.consumers.length > 0, `${script} has neither direct test nor consumer`);
  }
});

test("release manifests match and the Codex manifest carries the shared hook", () => {
  const claude = JSON.parse(read(".claude-plugin/plugin.json"));
  const codex = JSON.parse(read(".codex-plugin/plugin.json"));
  const hooks = JSON.parse(read("hooks/hooks.json"));
  assert.equal(codex.version, claude.version);
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.hooks, "./hooks/hooks.json");
  assert.equal(hooks.hooks.SessionStart[0].hooks[0].timeout, 5);
});

test("the Windows installer keeps its UTF-8 BOM", () => {
  const bytes = fs.readFileSync(path.join(root, "codex", "install.ps1"));
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
});

test("active adapters retain the native-plugin lifecycle", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh"]) {
    const installer = read(relative);
    assert.doesNotMatch(installer, /install-codex-hook\.js/, relative);
    assert.match(installer, /codex plugin list --json/, relative);
    assert.match(installer, /verify-codex-plugin-install\.js/, relative);
    assert.match(installer, /remove-generated-codex-prompts\.js/, relative);
    assert.doesNotMatch(installer, /prompts[\\/]devflow-|installed: \/devflow-/, relative);
  }
});

test("the Codex installer retains one native channel and only cleans its generated predecessor", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh"]) {
    const installer = read(relative);
    assert.doesNotMatch(installer, /PRINCIPLES|\$principles/, relative);
    assert.match(installer, /remove-legacy-codex-hook\.js/, relative);
    assert.match(installer, /open \/hooks in a Codex session and confirm/, relative);
  }
  const { GENERATED_NAMES } = require("./remove-generated-codex-prompts.js");
  const expected = [
    ...P2_PACKAGES.filter((id) => id !== "principles" && id !== "direct").map((id) => `devflow-${id}.md`),
    "devflow-split.md",
  ].sort();
  assert.deepEqual([...GENERATED_NAMES].sort(), expected, "generated-prompt cleanup does not match the installed stages");
});

test("the root suite runs every tracked P2 package test and both semantic audits", (t) => {
  const listed = spawnSync("git", ["ls-files", "--", "skills/**/*.test.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(listed.status, 0, listed.stderr);
  const packageTests = listed.stdout.split(/\r?\n/).filter(Boolean);
  assert.equal(packageTests.length, 13, "the promoted package-test inventory changed without root-gate review");
  const tests = spawnSync(process.execPath, ["--test", ...packageTests], { cwd: root, encoding: "utf8" });
  assert.equal(tests.status, 0, tests.stderr || tests.stdout);
  const audit = spawnSync(process.execPath, ["scripts/skill-rails-semantic-audit.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(audit.status, 0, audit.stderr || audit.stdout);
  const auditResult = JSON.parse(audit.stdout);
  assert.equal(auditResult.schema, "devflow/skill-rails-semantic-audit/2");
  assert.deepEqual(auditResult.reports.map(report => report.id).sort(), [...P2_PACKAGES].sort(),
    "the semantic audit did not report every promoted P2 package");
  for (const report of auditResult.reports.filter(row => row.advisories.length > 0)) {
    t.diagnostic(`${report.id} semantic advisories: ${report.advisories.map(row => `${row.code}=${row.count}`).join(", ")}`);
  }
  const principlesAudit = spawnSync(process.execPath, ["skills/principles/scripts/semantic-audit.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(principlesAudit.status, 0, principlesAudit.stderr || principlesAudit.stdout);
});

test("canonical companion parity compares distinct root and deployed sources", () => {
  const pairs = [[
    "scripts/project-knowledge.mjs",
    "skills/principles/scripts/project-knowledge.mjs",
  ]];
  for (const [canonical, deployed] of pairs) {
    assert.notEqual(canonical, deployed, "a canonical-companion pair cannot compare a file to itself");
    assert.equal(normalizedText(canonical), normalizedText(deployed),
      `${canonical} and ${deployed} differ after LF normalization`);
  }
});

test("all promoted stages are complete portable P2 packages", () => {
  for (const id of P2_PACKAGES) {
    const packageRoot = path.join(root, "skills", id);
    const required = [
      "spec.mjs",
      "body.md",
      ".generated.json",
      ".skill-rails/obligation-ledger.json",
      "scripts/skill-rails/run.mjs",
    ];
    for (const relative of required) {
      assert.ok(fs.existsSync(path.join(packageRoot, relative)), `${id}: missing P2 package artifact ${relative}`);
    }
    const generated = JSON.parse(fs.readFileSync(path.join(packageRoot, ".generated.json"), "utf8"));
    const ledger = JSON.parse(fs.readFileSync(path.join(packageRoot, ".skill-rails", "obligation-ledger.json"), "utf8"));
    assert.equal(generated.skill_id, id, `${id}: generated manifest owns another package`);
    assert.equal(generated.profile, "p2", `${id}: generated manifest is not P2`);
    assert.equal(ledger.profile, "p2", `${id}: obligation ledger is not P2`);
  }
});

test("all promoted P2 packages share one Skill Rails runtime and validator version and hash", () => {
  const versions = P2_PACKAGES.map((id) => {
    const generated = JSON.parse(read(`skills/${id}/.generated.json`));
    return {
      id,
      runtime: generated.runtime_version,
      runtimeHash: generated.runtime_hash,
      validator: generated.validator_version,
      validatorHash: generated.validator_hash,
    };
  });
  const expected = {
    runtime: versions[0].runtime,
    runtimeHash: versions[0].runtimeHash,
    validator: versions[0].validator,
    validatorHash: versions[0].validatorHash,
  };
  for (const version of versions) {
    assert.deepEqual(
      {
        runtime: version.runtime,
        runtimeHash: version.runtimeHash,
        validator: version.validator,
        validatorHash: version.validatorHash,
      },
      expected,
      `${version.id}: generated Skill Rails version or hash differs from the shared package`,
    );
  }
});

test("P2 stages enter one shared Principles policy index while companions and roles stay owner-local", () => {
  const companionHomes = new Map([
    ["principles", [
      "references/state/task-card-predicates.md",
      "references/verification/revision-predicates.md",
      "references/verification/event-predicates.md",
      "references/knowledge/baseline-contract.md",
      "references/planning/evidence-discipline.md",
      "references/coordination/coordinator-contract.md",
    ]],
    ["work", ["references/reviewer-role.md"]],
    ["verify", ["references/verifier-role.md", "references/auditor-role.md", "references/retrospector-role.md"]],
  ]);
  for (const [owner, relatives] of companionHomes) {
    const generated = JSON.parse(fs.readFileSync(path.join(root, "skills", owner, ".generated.json"), "utf8"));
    for (const relative of relatives) {
      assert.ok(fs.existsSync(path.join(root, "skills", owner, relative)), `${owner}: missing ${relative}`);
      assert.ok(Object.hasOwn(generated.content, relative), `${owner}: generated manifest omits ${relative}`);
      const foreignReferences = P2_PACKAGES.filter((id) => id !== owner)
        .flatMap((id) => walk(path.join(root, "skills", id), (name) => name.endsWith(".md") || name.endsWith(".mjs")))
        .filter((file) => !file.includes(`${path.sep}legacy-atoms${path.sep}`))
        .filter((file) => fs.readFileSync(file, "utf8").includes(`../${owner}/${relative}`));
      assert.deepEqual(foreignReferences, [], `${owner}/${relative} has an undeclared cross-package consumer`);
    }
  }
  const sharedPolicyPointer = "../principles/references/policy-index.md";
  const sharedPolicySentence = "Read `<skill-root>/../principles/references/policy-index.md` as this stage's shared-policy entry; this consumes common policy without invoking Principles request classification.";
  for (const packageName of P2_PACKAGES.filter((name) => name !== "principles")) {
    const body = read(`skills/${packageName}/body.md`);
    const pointers = body.match(/\.\.\/principles\/references\/policy-index\.md/g) ?? [];
    assert.equal(pointers.length, 1, `${packageName} must enter the single shared Principles policy index exactly once`);
    const purpose = body.match(/## why: purpose\r?\n\r?\n([\s\S]*?)(?:\r?\n## |\s*$)/)?.[1] ?? "";
    assert.ok(purpose.includes(sharedPolicySentence),
      `${packageName} must carry the byte-identical shared policy pointer in why: purpose`);
    assert.match(read(`skills/${packageName}/spec.mjs`), /body:\s*"why: purpose"/,
      `${packageName} must deliver the shared policy pointer through its always-read purpose`);
    const directPolicyFiles = walk(path.join(root, "skills", packageName), (name) => name.endsWith(".md") || name.endsWith(".mjs"))
      .filter((file) => !file.includes(`${path.sep}legacy-atoms${path.sep}`))
      .flatMap((file) => [...fs.readFileSync(file, "utf8").matchAll(/\.\.\/principles\/references\/([a-zA-Z0-9._/-]+)/g)]
        .map((match) => match[0]));
    assert.deepEqual([...new Set(directPolicyFiles)], [sharedPolicyPointer],
      `${packageName} must reach Principles policy through the single index, not a topic bypass`);
  }
  assert.ok(Object.hasOwn(JSON.parse(read("skills/principles/.generated.json")).content, "references/policy-index.md"),
    "Principles generated package must carry the shared policy index");
  const adoptBody = read("skills/adopt/body.md");
  const archWorkflow = read("skills/arch/references/workflow.md");
  assert.match(adoptBody, /<skill-root>\/\.\.\/arch\/references\/workflow\.md/,
    "Adopt's first-read body must name its bounded Arch source");
  assert.match(archWorkflow, /\| Surface \| Required channel \| Missing-channel action \|/,
    "Adopt's selected verification-channel columns must remain addressable");
  assert.match(archWorkflow, /^The proposal carries .*The ADR conditions are .*$/m,
    "Adopt's selected proposal and ADR paragraph must remain addressable");
  for (const [packageName, roles] of [["principles", ["coordinator"]], ["work", ["reviewer"]], ["verify", ["verifier", "auditor", "retrospector"]]]) {
    const spec = read(`skills/${packageName}/spec.mjs`);
    for (const role of roles) assert.match(spec, new RegExp(`\\b${role}\\s*:`), `${packageName} does not declare ${role}`);
  }
});

test("the deployed semantic audit remains present beside the promoted packages", () => {
  assert.ok(fs.existsSync(path.join(root, "scripts", "skill-rails-semantic-audit.mjs")),
    "missing deployed Skill Rails semantic audit");
});
