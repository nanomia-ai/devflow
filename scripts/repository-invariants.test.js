#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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
  "skills/work/reviewer_ko.md",
  "skills/verify/verifier_ko.md",
  "skills/verify/auditor_ko.md",
  "skills/verify/retrospector_ko.md",
  "codex/AGENTS-devflow_ko.md",
  "README_ko.md",
  "docs/design_ko.md",
  "docs/capability-knowledge-proposal_ko.md",
  "docs/v0.11.0-domain-knowledge-redesign-report_ko.md",
  "docs/v0.9.21-redesign-report_ko.md",
];

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function shape(text) {
  return {
    headings: count(text, /^#{1,6}\s+/gm),
    numberedItems: count(text, /^\s*\d+\.\s+/gm),
    tableRows: count(text, /^\s*\|.*\|\s*$/gm),
    diagrams: count(text, /^```mermaid\s*$/gm),
  };
}

function machineFigures(text) {
  const versions = [...text.matchAll(/\bv?\d+\.\d+(?:\.\d+)?\b/gi)].map((match) => match[0]);
  const percentages = [...text.matchAll(/[+-]?\d+(?:\.\d+)?%/g)].map((match) => match[0]);
  return { versions, percentages };
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

test("English deploy artifacts contain no Korean except README's language switcher", () => {
  const deployFiles = [
    "README.md",
    "CHANGELOG.md",
    "docs/design.md",
    "docs/capability-knowledge-proposal.md",
    "docs/v0.11.0-domain-knowledge-redesign-report.md",
    "docs/v0.9.21-redesign-report.md",
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
    ...fs.readdirSync(path.join(root, "scripts"))
      .filter((name) => name.endsWith(".js"))
      .map((name) => path.join("scripts", name)),
  ].map((relative) => path.join(root, relative));
  for (const file of deployFiles) {
    const relative = path.relative(root, file).replace(/\\/g, "/");
    const matches = fs.readFileSync(file, "utf8").split(/\r?\n/)
      .filter((line) => /[\uAC00-\uD7A3]/.test(line));
    const expected = relative === "README.md" ? 1 : 0;
    assert.equal(matches.length, expected, `${relative}: lines containing Korean`);
  }
});

test("release manifests match and the Codex manifest carries the shared hook", () => {
  const claude = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8"));
  const codex = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
  assert.equal(codex.version, claude.version);
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.hooks, "./hooks/hooks.json");
});

test("the Windows installer keeps its UTF-8 BOM", () => {
  const bytes = fs.readFileSync(path.join(root, "codex", "install.ps1"));
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
});

test("active adapters do not call the removed global-hook registrar", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh", "README.md", "README_ko.md"]) {
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

test("both Codex installers embed each predicate companion only for its consumers", () => {
  const ps1 = fs.readFileSync(path.join(root, "codex", "install.ps1"), "utf8");
  const sh = fs.readFileSync(path.join(root, "codex", "install.sh"), "utf8");
  const verificationPredicates = fs.readFileSync(path.join(root, "skills", "principles", "verification-predicates.md"), "utf8");
  const baselinePredicates = fs.readFileSync(path.join(root, "skills", "principles", "baseline-predicates.md"), "utf8");
  const consumers = skillDirs
    .filter((dir) => fs.readFileSync(path.join(dir, "SKILL.md"), "utf8")
      .includes("`../principles/state-predicates.md`"))
    .map((dir) => path.basename(dir))
    .sort();
  assert.deepEqual(consumers, ["resume", "split", "verify", "work"]);
  const verificationConsumers = skillDirs
    .filter((dir) => fs.readFileSync(path.join(dir, "SKILL.md"), "utf8")
      .includes("`../principles/verification-predicates.md`"))
    .map((dir) => path.basename(dir))
    .sort();
  assert.deepEqual(verificationConsumers, ["resume", "verify"]);
  const baselineConsumers = skillDirs
    .filter((dir) => fs.readFileSync(path.join(dir, "SKILL.md"), "utf8")
      .includes("`../principles/baseline-predicates.md`"))
    .map((dir) => path.basename(dir))
    .sort();
  assert.deepEqual(baselineConsumers, ["adopt", "arch", "resume", "verify"]);
  for (const name of ["split", "work"]) {
    assert.doesNotMatch(
      fs.readFileSync(path.join(root, "skills", name, "SKILL.md"), "utf8"),
      /baseline-predicates\.md/,
      `${name} must not pull the baseline companion into its generated prompt`,
    );
  }
  assert.match(ps1, /\$usesStatePredicates = \$body\.Contains\('\`\.\.\/principles\/state-predicates\.md\`'\)/);
  assert.match(ps1, /if \(\$usesStatePredicates\) \{\s+\$companions \+= @\("", "---", "", \$statePredicates\.TrimEnd\(\)\)/);
  assert.match(sh, /resume\|split\|verify\|work\)/);
  assert.match(sh, /printf '%s\\n' "\$STATE_PREDICATES"/);
  assert.match(ps1, /\$usesVerificationPredicates = \$body\.Contains\('\`\.\.\/principles\/verification-predicates\.md\`'\)/);
  assert.match(ps1, /if \(\$usesVerificationPredicates\) \{\s+\$companions \+= @\("", "---", "", \$verificationPredicates\.TrimEnd\(\)\)/);
  assert.match(sh, /resume\|verify\)/);
  assert.match(sh, /printf '%s\\n' "\$VERIFICATION_PREDICATES"/);
  assert.match(ps1, /\$usesBaselinePredicates = \$body\.Contains\('\`\.\.\/principles\/baseline-predicates\.md\`'\)/);
  assert.match(ps1, /if \(\$usesBaselinePredicates\) \{\s+\$companions \+= @\("", "---", "", \$baselinePredicates\.TrimEnd\(\)\)/);
  assert.match(sh, /adopt\|arch\|resume\|verify\)/);
  assert.match(sh, /printf '%s\\n' "\$BASELINE_PREDICATES"/);
  assert.doesNotMatch(verificationPredicates, /`state-predicates\.md`|`\.\.\//);
  assert.doesNotMatch(baselinePredicates, /`state-predicates\.md`|`\.\.\//);
});

test("task-local execution state stays on the card, not in journal or an assignment field", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const deployText = [
    split,
    fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8"),
    fs.readFileSync(path.join(root, "README.md"), "utf8"),
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
  assert.match(resume, /arch\.md lacks the Brownfield field/);

  const layerMarker = /YYYY-MM-DDTHH:MM:SSZ layer opening: parent: <devflow\/tree or folder path with status suffixes removed>; children: <number\+number>; source-json: <JSON string containing the exact durable source locator>/;
  assert.match(principles, layerMarker);
  assert.match(split, /`split — begin <parent>`/);
  assert.match(principles, /layer-opening marker/);
  assert.match(resume, /layer-opening marker/);

  const productMarker = /YYYY-MM-DDTHH:MM:SSZ product re-run pending: statement-json: <JSON string containing the whole disproved identity or success-criterion text>/;
  assert.match(principles, productMarker);
  assert.match(product, /product re-run pending/);
  assert.match(resume, /product re-run pending/);

  const maintenanceMarker = /YYYY-MM-DDTHH:MM:SSZ maintenance routing pending: request-json: <JSON string containing the whole user request>/;
  assert.match(principles, maintenanceMarker);
  assert.match(adopt, /maintenance routing pending/);
  assert.match(resume, /maintenance routing pending/);

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
  assert.match(resume, /`pending · source id:`/);
  assert.match(verify, /continue the caller's remaining state/);
  assert.match(verify, /exact blocking path or branch state and reason/);
  assert.match(verify, /Before an Audit, regardless of verdict/);
  assert.match(resume, /The blocked-Audit reporting row does not gate a verdict/);
  assert.match(resume, /as not unrun events for the rest of this\s+session's table scans/);
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
  assert.match(resume, /`devflow\/project\/glossary\.md` is missing/);
  assert.match(resume, /with `Brownfield: yes`, adopt reverse-derives only glossary\.md/);
  assert.match(resume, /with `no`, product creates only glossary\.md/);
});

test("explicit product verification and capability closure markers have resume consumers", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification requested/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification running:/);
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ product verification result:/);
  assert.match(resume, /journal contains an exact `product verification requested` line/);
  assert.match(resume, /journal contains a `product verification running` line/);
  assert.match(resume, /journal contains a `product verification result` line/);
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
  assert.match(resume, /valid capability-closing marker exists in HEAD/);
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
    resume.indexOf("| `git status` reports an open rebase or merge |") <
      resume.indexOf("| Any verify.md in HEAD contains a valid `routing prepared` object |"),
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
  const proposal = fs.readFileSync(path.join(root, "docs", "capability-knowledge-proposal.md"), "utf8");
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
  assert.match(baseline, /arch, adopt, verify, and resume read this canon directly; work,\s+reviewer, and retrospector receive only their required projections/);
  assert.match(baseline, /Each file contains exactly one `## Verified state` H2 heading/);
  assert.match(baseline, /bytes before it are the \*\*design zone\*\*[\s\S]*heading through end of file is the \*\*verified\s+zone\*\*/);
  assert.match(baseline, /\| 6 \| Design metadata \| design \|[\s\S]*\| 14 \| Verification metadata \| verified \|/);
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
  assert.match(baseline, /absent means no same-numbered baseline in HEAD/);
  assert.match(baseline, /Working-tree bytes with\s+no HEAD counterpart have nothing to preserve, so the creation replaces them/);
  assert.match(baseline, /Those three paths are the only\s+sources for `Design head`/);
  assert.match(baseline, /work parses the leading number of the depth-1 ancestor directly below `devflow\/tree\/`/);
  assert.match(baseline, /Do not copy\s+baseline or ADR paths into cards/);
  assert.match(baseline, /remains in a card's\s+`Read first` is legacy wiring[\s\S]*select and shape-gate only through the number rule/);
  assert.match(baseline, /With all\s+three present, resume resolves the target by the canonical rules' canonical recognition/);
  assert.match(baseline, /With an empty resolution set it reports only foundation plus non-retired number\/name\s+candidates and asks; with two or more it reports only the resolved candidates and asks/);
  assert.match(baseline, /registered consumers: <number \(status\), \.\.\. \| none>/);

  assert.match(arch, /`arch — capabilities`[\s\S]*run's last\s+commit/);
  assert.match(adopt, /`adopt — capabilities`[\s\S]*run's last\s+commit/);
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
  assert.match(verify, /Capability first closure[\s\S]*all of product\.md and\s+arch\.md · glossary\.md when present · every `\.md` directly under `devflow\/project\/decisions\/`/);
  assert.match(retrospector, /do not use a hypothetical verification\s+statement as strain evidence/);
  assert.match(retrospector, /supplied product\.md, arch\.md,\s+glossary\.md, or ADRs/);
  assert.match(resume, /^## Domain-Entry Questions$/m);
  assert.match(resume, /If any of product\.md, arch\.md, or glossary\.md is absent or arch\.md lacks `Brownfield`[\s\S]*domain knowledge not initialized[\s\S]*open no capability body/);
  assert.match(resume, /no same-numbered file exists for the selection, including foundation/);
  assert.match(resume, /Zero or multiple boundaries follow the canon's\s+recovery procedure[\s\S]*verified-only shape anomaly/);
  assert.match(resume, /With an empty resolution set, present only foundation plus\s+non-retired number\/name candidates and ask; with two or more, present only the resolved\s+candidates and ask\. Open no body before the answer/);
  assert.match(resume, /only when the user explicitly requests the full expected set/);
  assert.doesNotMatch(active, /capability_baseline/);
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
  assert.match(arch, /exact `legacy v0\.10` shape[\s\S]*canonical mechanical\s+migration[\s\S]*not treat it as boundary\s+damage or a data-loss reset/);
  assert.match(adopt, /exact `legacy v0\.10` shape[\s\S]*canonical mechanical\s+migration[\s\S]*not treat it as boundary\s+damage or a data-loss reset/);
  assert.match(resume, /expected file has the canonical baseline predicates' exact `legacy v0\.10` shape[\s\S]*mechanically carried verified zone/);
  assert.match(work, /legacy baseline:\s+migration pending — <path>[\s\S]*open no body/);
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
  assert.match(resume, /An expected HEAD file has zero or more than one `## Verified state` boundary/);
  assert.match(principles, /user-identified Git revision to its current expected path/);
  assert.match(verify, /a standard-refresh-set input cannot\s+be parsed/);
  assert.match(verify, /recalculate this closure's capability code\s+scope and consumed paths from current topology/);
  assert.match(resume, /skip only the three baseline\s+rows above/);
  assert.match(adopt, /When Layer 0 is complete and\s+only capability documents are missing or need repair/);
  assert.match(baseline, /present them as one batch; change no\s+capability-document path before the user confirms that batch/);
  assert.match(arch, /Before changing disk, present all design zones that would change as one batch and obtain\s+user confirmation/);
  assert.match(adopt, /Before changing disk, present all design zones that would change as one batch and obtain\s+user confirmation/);
  assert.match(baseline, /Do not load the whole original into the report\. Report its path, the HEAD boundary count\s+that selected this route, the working-tree\s+boundary count and line count, the HEAD blob object ID for that exact path or `none`, and\s+the expected boundary/);
  assert.match(baseline, /The HEAD blob identifies provenance; it is not presumed valid/);
  assert.match(baseline, /resume writes no file and offers only two choices: after confirming that a user-identified\s+Git revision and path has one boundary, the user restores those bytes to the damaged\s+file's current expected path and commits only that file[\s\S]*or the user discards the old verified\s+prose/);
  assert.match(baseline, /Search no history for a known-good revision/);
  assert.match(resume, /offer only two choices: \(1\) after confirming that a user-identified Git revision and path has one boundary, the user restores those bytes to the damaged file's current expected path and commits only that file; \(2\)[\s\S]*route `Brownfield: yes` to adopt or `no` to arch/);
  assert.match(resume, /Search no history for a known-good revision; resume writes no file/);
  assert.match(arch, /zero or more\s+than one boundary and the user did not choose in resume[\s\S]*reset the whole file from\s+current Layer 0 design plus the empty initial verified scaffold/);
  assert.match(adopt, /zero or more than one boundary and the user did not choose in resume[\s\S]*reset the whole file from current Layer 0 design plus the empty initial\s+verified scaffold/);
  assert.match(baseline, /user-confirmed deletion exception changes no path and has a diff with zero added lines/);
  assert.match(baseline, /fixed section headings[\s\S]*metadata fields are not deletion-exception targets/);
  assert.match(baseline, /Do not use this exception for the last admissible body item in a section[\s\S]*replace the section body with `None\.`/);
  assert.match(baseline, /person making a direct deletion commits that deletion alone before the next devflow\s+skill runs/);
  assert.match(baseline, /Preserve an\s+`external` Trap's HEAD row byte-for-byte unless a person authorizes deletion/);
  assert.match(baseline, /the selected unit's number names the same-numbered capability document/);
  assert.match(baseline, /Before opening a body, exactly one same-numbered file[\s\S]*read only valid files, skip anomalous\s+numbers, and continue/);
  assert.match(resume, /Before opening a body, require exactly one same-numbered\s+file with valid fixed boundary, sections, and metadata shape/);
  assert.match(resume, /When a Binding ADR path is\s+absent, report the exact path, make the design zone a hypothesis, and search for no\s+substitute/);
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
  assert.match(baseline, /This is not an `arch — capabilities` commit and changes no capability-[\s\S]*except the old exact path to the new exact path in Binding ADRs/);
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
  assert.match(arch, /When a capability retires or splits, or another code-boundary change alters path ownership/);
  assert.match(adopt, /When a capability retires or splits, or another code-boundary change alters path ownership/);
  const adoptionMarker = adopt.indexOf("first append\nsplit's exact `maintenance routing pending`");
  const capabilityDocuments = adopt.indexOf("## Capability documents — final output after the adoption commit");
  assert.ok(
    adoptionMarker >= 0 && capabilityDocuments >= 0 && adoptionMarker < capabilityDocuments,
    "new-adoption maintenance state must land before the final capability-document commit",
  );
  assert.match(principles, /A capability's name changed[\s\S]*first update product\.md[\s\S]*following arch capability-design commit/);
  assert.match(principles, /Outside a canonical capability-design commit, the mechanical\s+exact-path replacement for a superseded ADR, the canonical human-deletion exception,\s+restoration of one complete one-boundary file from a user-identified Git revision to its current expected path, or this begin transition, any\s+`devflow\/project\/capabilities\/` diff is an integrity anomaly/);

  assert.ok(
    resume.indexOf("| A card of mine is claimed | work |") <
      resume.indexOf("| An expected file under the canonical baseline predicates is missing"),
    "an active claimed card must outrank baseline repair",
  );
  assert.match(work, /baseline missing: <number>[\s\S]*continue from Layer 0 and the card/);
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
  assert.match(verify, /When this session has a claimed task card, select no event/);
  assert.ok(
    resume.indexOf("| A card of mine is claimed | work |") <
      resume.indexOf("| journal contains an exact `product verification requested` line |"),
    "claimed work must outrank a requested product verification",
  );
});

test("verification routing has a reconstructible prepared state and no duplicate output", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
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
  assert.match(resume, /Any verify\.md in HEAD contains a valid `routing prepared` object/);
});

test("routing reads integration state before local claimed work", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /Shared state for next-stage routing and the integrity check comes from the integration\s+tip, not the current branch/);
  assert.match(principles, /include the integration\s+tip in the current branch before local claimed work/);
  assert.match(principles, /runs even while a card is claimed/);
});

test("normal task completion has one final commit and a restartable boundary", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /last commit that changed it has this exact subject, the final task commit is complete/);
  assert.match(principles, /Canonical claim→done move/);
  assert.match(principles, /Whether git reports a rename or a deletion plus untracked\s+file is not part of the judgment/);
  assert.match(principles, /that commit includes the claimed card and its progress log/);
  assert.match(principles, /before writing any status rename, HANDOFF, journal, verify\.md, or feedback\s+document change/);
  assert.match(work, /make no second final task commit/);
  assert.match(work, /The rename commit to `\.wip-<my id>\.` is the claim/);
  assert.ok(
    work.indexOf("Integration gate") > work.indexOf("Final task commit")
      && work.indexOf("Integration gate") < work.indexOf("Land upper-document feedback"),
    "integration must precede every boundary working-tree mutation",
  );
  assert.match(resume, /canonical final task subject/);
});

test("a greenfield root cannot create an empty foundation or mistake waiting files for cards", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /waiting capability file, not a task card/);
  assert.match(split, /create no empty foundation folder/);
  assert.match(split, /`01-foundation\/` must have at least one direct card/);
  assert.match(resume, /neither `01-foundation\/` nor `01-foundation\.done\/`/);
  assert.match(resume, /A waiting capability file exists \| split — open one layer of that capability/);
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
  assert.match(state, /`git diff\s+--quiet -- <card path>`/);
  assert.match(state, /`git diff --cached --quiet <authority> -- <card path>`/);
  assert.match(principles, /state predicates' canonical or legacy format/);
  assert.match(resume, /state predicates cannot parse/);
  assert.match(resume, /`Approval` is not `pending` and is not effective under the state predicates/);
  assert.match(split, /`Approval` is not `pending` but is ineffective under the state\s+predicates/);
  assert.match(work, /state predicates' canonical or legacy format/);
  assert.match(verify, /canonical state\s+predicates/);
});

test("stale task history is non-blocking only after replacement planning is durable", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  const marker = /YYYY-MM-DDTHH:MM:SSZ re-split pending: folder: <direct parent folder path with status suffixes removed>; stale: <number\+number>; source: <devflow\/project file path>#<heading>/;
  assert.match(principles, marker);
  assert.match(split, /When journal has a `re-split pending` marker/);
  assert.match(resume, /journal contains an exact `re-split pending` line/);
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
  assert.match(resume, /working tree or HEAD/);
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
  for (const text of [verify, resume]) {
    assert.match(text, /Code revision/);
    assert.match(text, /Verification revision/);
  }
  assert.match(state, /git log -1 --format=%H -- \. ':\(exclude\)devflow\/\*\*'/);
  assert.match(state, /git ls-tree -r -z --full-tree HEAD --/);
  assert.match(state, /git hash-object --stdin/);
  assert.match(state, /every direct `Depends`\s+card of those cards/);
  assert.doesNotMatch(state, /git ls-tree[^\n]*:\(exclude\)/);
  assert.match(verify, /direct-dependency card/);
  assert.match(state, /never use the PowerShell object pipeline/);
  assert.match(verify, /Before either layer, combine the non-empty output/);
  assert.match(resume, /a path outside devflow is uncommitted/);
  assert.match(resume, /differs from the verification predicates' current value/);
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
  assert.match(principles, /Delete\s+in the retirement commit every evidence record/);
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
  assert.match(resume, /A bare `\.wip\.` card or a root `devflow\/HANDOFF\.md` exists \| work/);
  assert.match(resume, /arch\.md lacks the `integration` or `merge` line \| arch/);
  assert.match(arch, /The default for `integration` is the current branch/);
});

test("claims are keyed to the depth-1 unit", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const resume = fs.readFileSync(path.join(root, "skills", "resume", "SKILL.md"), "utf8");
  assert.match(principles, /One claim per id per depth-1 unit/);
  assert.match(principles, /A candidate's \*\*depth-1 unit\*\* is the first path component below `devflow\/tree\/`/);
  assert.match(principles, /1\. Inside one depth-1 unit, are there 2 or more `\.wip\.` cards with the same id/);
  assert.match(work, /Group my\s+remaining claims by depth-1 unit/);
  assert.match(work, /two or more inside one unit are an integrity anomaly/);
  assert.match(resume, /every claim of mine \u2014 path and status for all, and in full only the one this\s+invocation continues/);
  assert.match(resume, /report every remaining uncommitted path\s+without attributing it to a card/);
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
  assert.match(resume, /Resolve the target by the canonical\n   rules' canonical recognition/);
  assert.match(work, /in canonical\s+candidate order over my remaining claims/);
  assert.match(resume, /selected by\n<your request \| the last handoff \| canonical order>/);
  assert.match(resume, /The current conversation carries a change request from the user that no journal line, verify entry, or claimed card preserves yet \| split \u2014 maintenance routing, which records the request before it reads any code \|/);
  assert.ok(
    resume.indexOf("| The current conversation carries a change request") <
      resume.indexOf("| A card of mine is claimed | work |"),
    "a fresh change request is recorded before a claim resumes, like the persisted form above it",
  );
  assert.ok(
    resume.indexOf("| journal contains an exact `maintenance routing pending` line |") <
      resume.indexOf("| The current conversation carries a change request"),
    "the persisted request still outranks the conversation one",
  );
  for (const consumer of [work, split, resume]) {
    assert.doesNotMatch(consumer, /the next pending card that is ready/);
  }
});

test("every devflow commit and review diff carries only its own paths", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(principles, /\*\*Every devflow commit carries only its own paths\.\*\*/);
  assert.match(principles, /never sweeps in another flow's uncommitted change/);
  assert.match(work, /the diff limited to this card's paths/);
});

test("room files have merge rules and HANDOFF paths survive a claim", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /HANDOFF merge conflicts keep `Open decisions` as the union of both sides/);
  assert.match(principles, /`Next single step` from the side whose `# HANDOFF \u00b7 <timestamp>` header is newer/);
  assert.match(principles, /5\. Does a path referenced by HANDOFF fail to match exactly one existing path when every\s+component's status suffix is removed/);
});

test("each card leaves one carry line and the next card reads only those", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const reviewer = fs.readFileSync(path.join(root, "skills", "work", "reviewer.md"), "utf8");
  const verifier = fs.readFileSync(path.join(root, "skills", "verify", "verifier.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ carry: <a fact that could make the next card in this depth-1 unit wrong \| none>/);
  assert.match(principles, /The line rides the final task commit, so the canonical claim→done move\n  stays byte-identical/);
  assert.match(work, /number is not in the capability document's `Covered cards`[\s\S]{0,200}last `carry:` line/);
  assert.match(work, /Read only that output and open\n  no card body/);
  assert.match(work, /carry-\n  line query output/);
  for (const role of [reviewer, verifier]) assert.doesNotMatch(role, /carry:/);
  assert.ok(
    work.indexOf("Carry line — append the canonical `carry:` line") > work.indexOf("Upper-document feedback judgment"),
    "the carry line is written after the landing check",
  );
  assert.ok(
    work.indexOf("Carry line — append the canonical `carry:` line") < work.indexOf("Final task commit — the canonical"),
    "the carry line rides the final task commit",
  );
});

test("an observation about another capability has a keyed line and a harvester", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  const verify = fs.readFileSync(path.join(root, "skills", "verify", "SKILL.md"), "utf8");
  assert.match(principles, /YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole observation>/);
  assert.match(principles, /`capability closing:`, `capability note:`/);
  assert.match(principles, /An observation confirmed in code about a capability other than the one being worked on \| one canonical `capability note` line/);
  assert.match(verify, /Delete in\n   the same sweep every `capability note` line whose capability number is this closing\n   capability's/);
  assert.match(verify, /retain them all when that refresh was a baseline no-op/);
  assert.match(verify, /only this marker and those capability notes removed/);
});

test("HANDOFF carries only a pointer and open decisions", () => {
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert.match(work, /^## Next single step\s+<!-- one tree path \| none -->$/m);
  assert.match(work, /^## Open decisions \(needs a human\)$/m);
  assert.doesNotMatch(work, /^## Just learned/m);
  assert.doesNotMatch(work, /^## Traps$/m);
  assert.doesNotMatch(work, /If all four are empty, an empty file is fine/);
  assert.doesNotMatch(readme, /An empty HANDOFF is normal/);
  assert.match(work, /`Next single step` is mandatory and holds one tree path/);
  assert.match(work, /The first time this room's HANDOFF still carries a `## Just learned` or `## Traps` section,\s+land that content before overwriting/);
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
  assert.match(work, /when any non-`\.stale\.` card below that folder\nlacks a `\.done` status/);
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
  assert.match(resume, /The selection reason comes straight out of the canonical candidate order/);
  assert.match(resume, /Also open:\n<every other unit holding a candidate under the same matched row \| none>/);
  assert.match(resume, /When the session unit\nholds no candidate, say so in that clause/);
});

test("a mis-mapped card has a recall route and split maps from the boundary line", () => {
  const split = fs.readFileSync(path.join(root, "skills", "split", "SKILL.md"), "utf8");
  assert.match(split, /read the fixed first\n   four lines of each candidate capability document and nothing else/);
  assert.match(split, /`Boundary: owns …;\n   does not own …` is the mapping oracle/);
  assert.match(split, /\*\*Card recall\.\*\*/);
  assert.match(split, /only while that card was never claimed and no task\s+commit subject has named its number/);
  assert.match(split, /When step 1 finds an existing pending card of this request's scope sitting\s+in the wrong folder/);
});

test("switching inside one capability parks instead of handing off", () => {
  const work = fs.readFileSync(path.join(root, "skills", "work", "SKILL.md"), "utf8");
  assert.match(work, /^## Switching Inside One Capability — park, then release$/m);
  assert.match(work, /Moving to another depth-1 unit needs no procedure/);
  assert.match(work, /parking is a release, not a handoff/);
});
