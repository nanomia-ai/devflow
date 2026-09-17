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
const ROOT_SCRIPT_LIFECYCLES = new Map([
  ["decision-index.mjs", ["AGENTS.md", "docs/design.md"]],
  ["runtime-map.mjs", ["docs/design.md", "docs/README.md"]],
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

test("the one language rule holds: skills English, docs Korean, CHANGELOG English", () => {
  const KOREAN = /[\uAC00-\uD7A3]/;
  const english = [
    "AGENTS.md",
    "CHANGELOG.md",
    "CLAUDE.md",
    "docs/changelog-archive.md",
    "codex/AGENTS-devflow.md",
    "codex/install.ps1",
    "codex/install.sh",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    "hooks/hooks.json",
    ...walk(path.join(root, "skills"), (name) => name.endsWith(".md")),
  ].map((item) => (path.isAbsolute(item) ? item : path.join(root, item)));
  for (const file of english) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    // P2 keeps its original Korean source verbatim as migration provenance, not runtime guidance.
    if (/^skills\/[^/]+\/references\/legacy-atoms\//.test(relative)) continue;
    assert.doesNotMatch(read(relative), KOREAN, `${relative}: Korean in an English surface`);
  }
  // docs/ is the Korean working surface, and it carries no _ko pairs any more.
  for (const entry of fs.readdirSync(path.join(root, "docs"), { withFileTypes: true })) {
    assert.doesNotMatch(entry.name, /_ko\.md$/, `docs/${entry.name}: the _ko suffix is gone with the pairs`);
    if (!entry.isFile() || entry.name === "changelog-archive.md") continue;
    assert.match(read(`docs/${entry.name}`), KOREAN, `docs/${entry.name} carries no Korean; docs/ is the Korean surface`);
  }
  const decisions = fs.readdirSync(path.join(root, "docs", "decisions"), { withFileTypes: true });
  assert.ok(!decisions.some((entry) => entry.isDirectory()),
    "docs/decisions/ has a subdirectory; one decision is one file in one language");
  for (const entry of decisions.filter((e) => e.isFile() && e.name.endsWith(".md"))) {
    assert.match(read(`docs/decisions/${entry.name}`), KOREAN, `docs/decisions/${entry.name} is not Korean`);
  }
});

test("the generated decision projection is a one-to-one view of docs/decisions/", () => {
  const tool = path.join(root, "scripts", "decision-index.mjs");
  const projected = [];
  for (const [args, dir] of [[[], path.join("docs", "decisions")]]) {
    const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const indexed = [...result.stdout.matchAll(/^\|\s*(DD-\d+)\s*\|/gm)].map((match) => match[1]);
    const filed = fs.readdirSync(path.join(root, dir)).filter((name) => name.endsWith(".md"))
      .map((name) => /^# (DD-\d+) ·/m.exec(fs.readFileSync(path.join(root, dir, name), "utf8"))?.[1]);
    assert.ok(indexed.length > 0, `${dir}: generated projection has no decisions`);
    assert.ok(filed.every(Boolean), `${dir}: a decision file has no "# DD-nn ·" heading`);
    assert.deepEqual(new Set(indexed).size, indexed.length, `${dir}: duplicate projected rows`);
    assert.deepEqual([...indexed].sort(), [...filed].sort(), `${dir}: projection and files disagree`);
    projected.push([...indexed].sort());
  }
  // One decision opens on its own, which is the reason the single-file source was split.
  const one = spawnSync(process.execPath, [tool, "--id", "DD-84"], { cwd: root, encoding: "utf8" });
  assert.equal(one.status, 0, one.stderr);
  assert.match(one.stdout, /^# DD-84 ·/, "--id does not print the decision itself");
  assert.ok(Buffer.byteLength(one.stdout) < 16 * 1024, "a single decision should be small enough to open alone");
});

// Decision state grammar is enforced by decision-index.mjs itself, which the projection test runs.
test("decision and rejection identifiers remain dense", () => {
  const dir = path.join(root, "docs", "decisions");
  const body = fs.readdirSync(dir).filter((name) => name.endsWith(".md"))
    .map((name) => fs.readFileSync(path.join(dir, name), "utf8")).join("\n");
  for (const [prefix, pattern] of [
    ["DD", /^# (DD-\d+) ·/gm],
    ["DR", /\*\*\[(DR-\d+)\s+·/g],
  ]) {
    const numbers = [...body.matchAll(pattern)].map((match) => Number(match[1].slice(3))).sort((a, b) => a - b);
    assert.deepEqual(new Set(numbers).size, numbers.length, `${prefix}: identifier is reused`);
    assert.deepEqual(numbers, numbers.map((_, index) => index + 1), `${prefix}: identifiers are not dense`);
  }
});

test("repository-owned documentation references resolve", () => {
  const markdown = walk(root, (name) => name.endsWith(".md"));
  const dangling = [];
  for (const file of markdown) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    if (relative === "CHANGELOG.md" || relative === "docs/changelog-archive.md") continue;
    // skills/ prose names paths inside a *user's* project, where docs/ is not this repository's.
    if (relative.startsWith("skills/")) continue;
    for (const match of fs.readFileSync(file, "utf8").matchAll(/\bdocs\/[A-Za-z0-9._/-]+\.md\b/g)) {
      const target = match[0];
      // DD-115 forbids _ko files under docs/, so a _ko path in prose can only be a historical name.
      if (/_ko\.md$/.test(target)) continue;
      // Any docs/ path this repository writes must resolve; the list of names is not hardcoded.
      const ours = target.startsWith("docs/");
      if (ours && !fs.existsSync(path.join(root, target))) dangling.push(`${relative} -> ${target}`);
    }
  }
  assert.deepEqual(dangling, [], "documents name docs paths that do not exist");
});

test("the maintenance entry routes to its canonical document owners", () => {
  const agents = read("AGENTS.md");
  for (const required of [
    "docs/README.md",
    "docs/design.md",
    "docs/direction.md",
    "docs/decisions/",
    "docs/direction.md",
    "docs/working-method.md",
    "docs/maintenance-protocol.md",
    "docs/audit-guideline.md",
    "docs/usecase-matrix.md",
  ]) assert.ok(agents.includes(required), `AGENTS.md never names ${required}`);
  assert.ok(read("docs/design.md").includes("스킬 의도 색인"), "design lacks its component-intent owner");
  assert.ok(/^## 5. /m.test(read("docs/maintenance-protocol.md")),
    "release procedure is not reachable from its canonical owner");
});

test("every docs entry answers exactly one question in the README map", () => {
  const readme = read("docs/README.md");
  for (const entry of fs.readdirSync(path.join(root, "docs"), { withFileTypes: true })) {
    if (entry.name === "README.md") continue;
    const named = entry.isDirectory() ? `${entry.name}/` : entry.name;
    assert.ok(readme.includes(named), `docs/${named} has no row in docs/README.md`);
  }
  for (const match of readme.matchAll(/\]\(([A-Za-z0-9._/-]+)\)/g)) {
    if (match[1].startsWith("../")) continue;
    assert.ok(fs.existsSync(path.join(root, "docs", match[1])), `docs/README.md names missing ${match[1]}`);
  }
});

test("no read route reaches history that the reorganization removed", () => {
  const agents = read("AGENTS.md");
  assert.doesNotMatch(agents, /docs\/rounds\//, "AGENTS.md still routes to the removed round layer");
  assert.ok(!fs.existsSync(path.join(root, "docs", "rounds")), "docs/rounds/ came back");
  assert.ok(!fs.existsSync(path.join(root, "docs", "blueprints")), "docs/blueprints/ came back");
  assert.match(agents, /rounds-archive-v1/, "AGENTS.md does not name the archive tag that holds the originals");
});

test("the entry stays bounded and every protocol section is routed", () => {
  const agents = read("AGENTS.md");
  const protocol = read("docs/maintenance-protocol.md");
  // A section with no entry route is unreachable. The *number* of sections is not a defect - the
  // exact-count assertion this replaces only ever fired on legitimate renumbering.
  const sections = [...protocol.matchAll(/^##\s+(\d+)\./gm)].map((match) => match[1]);
  assert.ok(sections.length > 0, "no numbered protocol sections were found; this check would pass vacuously");
  for (const section of sections) {
    assert.ok(agents.includes(`§${section}`), `protocol §${section} has no AGENTS.md route`);
  }
  // One ceiling, on the sum, because the sum is what a cold session actually pays. Per-file ceilings
  // blocked nothing and had to be raised three times in one round to let the entry carry its content.
  const entry = ["AGENTS.md", "docs/README.md", "docs/design.md", "docs/direction.md"];
  const total = entry.reduce((sum, relative) => sum + Buffer.byteLength(normalizedText(relative)), 0);
  assert.ok(total <= 42 * 1024, `the always-read entry is ${total} B and exceeds 42 KiB`);
  // jgnote's status field cannot lie because a checker cross-references code; ours is prose, so at
  // minimum it must name the version it describes, or "where we are" rots silently.
  const version = JSON.parse(read(".claude-plugin/plugin.json")).version;
  assert.ok(read("docs/direction.md").includes(version),
    `docs/direction.md does not name the current version ${version}; the present tense has gone stale`);
});

test("the always-read design intent index covers promoted packages and their role homes", () => {
  const design = read("docs/design.md");
  const start = design.indexOf("### 스킬 의도 색인");
  const end = design.indexOf("## 이 문서 체계가 누적되는 방식", start);
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

test("the root suite inventories every current non-ignored P2 package test and runs both semantic audits", (t) => {
  const listed = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "--", "skills/**/*.test.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(listed.status, 0, listed.stderr);
  const packageTests = listed.stdout.split(/\r?\n/).filter(Boolean).sort();
  assert.equal(packageTests.length, 15, "the current package-test inventory changed without root-gate review");
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
  const sharedPolicySentence = "Before this stage's first judgment, anchor the active skill's objective to the current request and latest explicit approval or approved proposal/card, then use `<skill-root>/../principles/references/policy-index.md` and the selected Decision to open the canonical owner/read path; this does not invoke Principles classification.";
  for (const packageName of P2_PACKAGES.filter((name) => name !== "principles")) {
    const body = read(`skills/${packageName}/body.md`);
    const pointers = body.match(/\.\.\/principles\/references\/policy-index\.md/g) ?? [];
    assert.equal(pointers.length, 1, `${packageName} must enter the single shared Principles policy index exactly once`);
    assert.ok(body.includes(sharedPolicySentence),
      `${packageName} body must repeat the sentence skills/principles/references/policy-index.md owns, byte-for-byte`);
    const entered = spawnSync(process.execPath, [path.join(root, "skills", packageName, "scripts", "skill-rails", "run.mjs"),
      "enter", "--skill", path.join(root, "skills", packageName), "--json"],
    { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    assert.equal(entered.status, 0, entered.stdout + entered.stderr);
    assert.ok(JSON.parse(entered.stdout).sections.some(({ markdown }) => markdown.includes(sharedPolicySentence)),
      `${packageName} actual enter must project that same sentence`);
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
  // Every declared role is discovered from source, never listed here: a hardcoded list stops growing
  // with the specs, and by 0.25.0 it guarded five of the seven roles that actually existed.
  const mapped = spawnSync(process.execPath, [path.join(root, "scripts", "runtime-map.mjs")], { cwd: root, encoding: "utf8" });
  assert.equal(mapped.status, 0, mapped.stderr);
  const declared = [...mapped.stdout.matchAll(/^  role ([a-z][\w-]*)/gm)].map((match) => match[1]);
  assert.ok(declared.length > 0, "no ROLES are declared in any P2 package");
  const designRoles = read("docs/design.md");
  for (const role of declared) {
    assert.ok(designRoles.includes(role), `docs/design.md never names the declared role ${role}`);
  }
  for (const packageName of P2_PACKAGES) {
    const spec = read(`skills/${packageName}/spec.mjs`);
    const owned = [...mapped.stdout.matchAll(new RegExp(`^## ${packageName}\\b[\\s\\S]*?(?=\\n## |\\ntotal:)`, "gm"))]
      .flatMap((block) => [...block[0].matchAll(/^  role ([a-z][\w-]*)/gm)].map((match) => match[1]));
    for (const role of owned) {
      assert.match(spec, new RegExp(`\\b${role}"?\\s*:`), `${packageName} does not declare ${role}`);
    }
  }
});

test("Working language has one Product value owner and preserves fixed schema through both proposal paths", () => {
  const policy = read("skills/principles/references/authoring/prompt-principles.md");
  assert.match(policy, /The exact `Working language: <owner-confirmed description>` line in `\.devflow\/project\/product\.md` is the sole durable language choice/);
  assert.match(read("skills/product/body.md"), /A current legacy product without the Working language line remains valid/);
  assert.doesNotMatch(read("skills/principles/scripts/project-state.mjs"), /Working language:/,
    "Working language must not become a project-state parser or global state field");

  const templateHeadings = new Map([
    ["skills/product/templates/product-proposal.md", ["## Problem", "## Approach", "## Capabilities", "## Boundary", "## Success criteria", "## Screens & access points", "## Proposed glossary delta", "## Owner-adjacent knowledge changes"]],
    ["skills/product/templates/product-confirmed.md", ["## Problem", "## Approach", "## Capabilities", "## Boundary", "## Success criteria", "## Screens & access points", "## Open questions"]],
    ["skills/adopt/templates/product.md", ["## Problem", "## Approach", "## Capabilities", "## Boundary", "## Success criteria", "## Screens & access points", "## Open questions"]],
  ]);
  for (const [relative, expectedHeadings] of templateHeadings) {
    const text = read(relative);
    assert.equal((text.match(/^Working language: \{\{workingLanguage\}\}$/gm) ?? []).length, 1,
      `${relative} must carry the one exact Product-owned Working language line`);
    assert.deepEqual(text.match(/^## .+$/gm), expectedHeadings,
      `${relative} must preserve its fixed schema headings`);
  }
  assert.match(read("skills/adopt/templates/adoption-proposal.md"), /^Working language: \{\{workingLanguage\}\}$/m,
    "Adopt must expose its inferred proposal before any canonical write");

  const productAsk = JSON.parse(read("skills/product/fixtures/scenarios.json"))
    .find((scenario) => scenario.id === "new-inline-ask");
  assert.deepEqual(productAsk.expect.effects, ["RUN", "REPORT", "ASK"]);
  assert.equal(productAsk.expect.effects.some((effect) => effect === "WRITE" || effect === "COMMIT"), false,
    "Product language correction must reuse the write-free ask/rejudge path");
  assert.match(read("skills/product/body.md"), /use the existing ask path to re-report the whole proposal without writing/);
  const productApprove = JSON.parse(read("skills/product/fixtures/scenarios.json"))
    .find((scenario) => scenario.id === "new-inline-approved-commit");
  assert.equal(productApprove.expect.effects.includes("WRITE"), true);
  assert.equal(productApprove.expect.effects.includes("COMMIT"), true,
    "Product must write the confirmed language only behind its existing approval boundary");
  assert.match(policy, /If that line is absent from a legacy managed project, preserve each target artifact's already coherent prose language until Product reconfirms it; do not rewrite merely to add the line/,
    "The always-read policy must define safe behavior without claiming a state-observed legacy branch");

  const adoptPrepare = JSON.parse(read("skills/adopt/fixtures/scenarios.json"))
    .find((scenario) => scenario.id === "adoption-prepare");
  assert.deepEqual(adoptPrepare.expect.effects, ["REPORT", "ASK"]);
  assert.equal(adoptPrepare.expect.effects.some((effect) => effect === "WRITE" || effect === "COMMIT"), false,
    "Adopt language correction must reuse the write-free proposal fallback until approval");
  assert.match(read("skills/adopt/body.md"), /A Working language correction is not approval/);
  const adoptApprove = JSON.parse(read("skills/adopt/fixtures/scenarios.json"))
    .find((scenario) => scenario.id === "approval-approve");
  assert.equal(adoptApprove.expect.effects.includes("WRITE"), true);
  assert.equal(adoptApprove.expect.effects.includes("COMMIT"), true,
    "Adopt must write the confirmed language only behind its existing binding approval");
});

test("the deployed semantic audit remains present beside the promoted packages", () => {
  assert.ok(fs.existsSync(path.join(root, "scripts", "skill-rails-semantic-audit.mjs")),
    "missing deployed Skill Rails semantic audit");
});

// jgnote's expiresWhen mechanism has a checker that reports stale entries; docs/direction.md is
// prose instead of data, so this is the minimum equivalent: a bullet cannot lose its closing
// condition without failing here.
test("every Next-measurement-targets bullet in docs/direction.md names its closing condition", () => {
  const direction = read("docs/direction.md");
  // Match the heading by its text, not its number - renumbering a section is not a defect.
  const found = new RegExp(`^## (?:\\d+\\. )?\u{B2E4}\u{C74C} \u{CE21}\u{C815} \u{B300}\u{C0C1}\\s*$`, "mu").exec(direction);
  const start = found ? found.index : -1;
  const end = start >= 0 ? direction.indexOf("\n## ", start + found[0].length) : -1;
  assert.ok(start >= 0 && end > start, "docs/direction.md has no bounded Next-measurement-targets section");
  const bullets = direction.slice(start, end).split(/\n(?=- \*\*)/).slice(1);
  assert.ok(bullets.length > 0, "Next-measurement-targets section has no bullets");
  // "closes when" / "reopen condition" markers, Korean and English
  const closingCondition = /\u{B2EB}\u{D788}\u{B294} \u{C870}\u{AC74}|\u{C7AC}\u{AC1C} \u{C870}\u{AC74}|Closes when|Reopen/u;
  for (const bullet of bullets) {
    assert.match(bullet, closingCondition, `bullet has no closing condition: ${bullet.slice(0, 60)}`);
  }
});
