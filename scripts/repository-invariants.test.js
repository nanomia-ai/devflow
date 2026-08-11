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
  assert.deepEqual(baselineConsumers, ["resume", "verify"]);
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
  assert.match(principles, /checkpoint's exact message is `NN\.N wip: evidence-wait` in solo and\s+`<claim id> NN\.N wip: evidence-wait` in multi/);
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
  assert.match(work, /Do not open a path listed only in arch\.md's\s+`Existing records`/);
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

test("the capability-knowledge proposal separates coverage from mutable task state", () => {
  const proposal = fs.readFileSync(path.join(root, "docs", "capability-knowledge-proposal.md"), "utf8");
  assert.match(proposal, /Status: \*\*candidate contract v2\.2/);
  assert.match(proposal, /Until skills execute this contract, no skill\s+executes this proposal/);
  assert.match(proposal, /no separate baseline per `arch\.md` component[\s\S]*no\s+independent component-level verification closure/);
  assert.match(proposal, /A baseline file\s+copies no current card status, progress, assignee, or next work; Covered cards records\s+only past inclusion\./);
  assert.match(proposal, /Covered cards[\s\S]*canonical card-number order[\s\S]*\["02\.2","02\.2b","02\.10"\]/);
  assert.match(proposal, /Covered cards holds every non-`\.stale\.` `\.done\.` card number below that\s+capability folder at closure/);
  assert.match(proposal, /This does not tell work to\s+read every change card automatically\. work keeps its existing read set/);
  assert.match(proposal, /An existing-record index becomes such an input only after split rechecks it\s+against the current change scope and puts it in a card's `Read first`\./);

  assert.match(proposal, /devflow\/project\/capabilities\/NN-<capability-name-slug>\.md/);
  assert.match(proposal, /Derive the number of a capability not yet assigned one on disk from its position in the\s+product\.md capability list/);
  assert.match(proposal, /\*\*Once a folder, a pending file, or a baseline already holds a\s+number, disk is the sole authority\.\*\*/);
  assert.match(proposal, /the capability list is append-only — a retired\s+row keeps its place, rows are never deleted or reordered, and additions go at the end\s+of the list\./);
  assert.match(proposal, /The name slug carries no authority[\s\S]*Judgment uses the number only\./);
  assert.match(proposal, /There are exactly two format anomalies: a file whose number cannot be parsed, and two\s+files for one capability\./);

  assert.match(proposal, /Each file has only these 12 sections, in this order\./);
  assert.match(proposal, /The total cap is ~140 lines, and the first 40 lines are the domain itself\.[\s\S]*A write over the cap still succeeds\.[\s\S]*\*\*Rows marked `external` in the Traps section are excluded from the cap count\.\*\*/);
  assert.match(proposal, /Write exactly `None\.` in a section with no verified content\. Invent nothing without\s+evidence\./);

  assert.match(proposal, /`capability_baseline: yes \| no`\. \*\*Absent means no\*\*[\s\S]*\*\*When the switch is\s+no, an existing file is caught by no wiring, no integrity-check item, and no resume\s+listing\.\*\*/);
  assert.match(proposal, /\*\*Riding the begin commit\*\*: the begin commit carries the passing verify\.md, the\s+capability-closing marker, and the closing capability's baseline file together\./);
  assert.match(proposal, /Regenerate it from the standard refresh set[\s\S]*before completing the begin commit\./);
  assert.match(proposal, /Any other diff under\s+`capabilities\/` is still an anomaly\./);
  assert.match(proposal, /\*\*add the baseline to all four exclusivity phrasings\*\*/);
  assert.match(proposal, /Step 8's three operations \(verify\.md sweep → journal → folder rename\) are unchanged\./);
  assert.match(proposal, /Closure and both head calculations happen on the integration branch\s+after a fetch, so a stored head always remains an ancestor\./);
  assert.match(proposal, /\*\*Durability — shape tolerance\*\*: a file with a different section or field set is a\s+hypothesis, and the next closure heals it\./);
  assert.match(proposal, /a baseline failure\s+is a report plus a no-op, and closure proceeds/);
  assert.match(proposal, /Reporting one line to the user at that\s+closure is mandatory: “baseline no-op: <reason>”\./);
  assert.match(proposal, /delete a trap or a Verify item only when its\s+reproduction condition has vanished from current code/);
  assert.match(proposal, /whenever split creates or revises a pending implementation card[\s\S]*put the baseline path and the\s+existing paths from the Binding ADRs section in each such card's `Read first`/);
  assert.match(proposal, /it is an anomaly\s+when a pending or claimed implementation card below a capability whose switch is yes\s+and whose baseline file exists lacks that baseline's exact path in `Read first`/);
  assert.match(proposal, /resume reads only the list of filenames under\s+`capabilities\/` in step 1 \(never the contents\)/);
  assert.match(proposal, /\*\*Wiring — the full machine contract\*\* lives in\s+`skills\/principles\/baseline-predicates\.md`/);
  assert.match(proposal, /The\s+principles body grows by one ownership sentence, the begin-ride wording change, and one\s+brownfield sentence in the number convention\./);

  assert.match(proposal, /The machine block at the very end of a baseline has six fields, all `key: value`\./);
  assert.match(proposal, /Scope head: <output of git log -1 --format=%H -- <one :\(literal\) pathspec per Scope paths member>>/);
  assert.match(proposal, /Scope paths is the exact path list that verify step 5 produced for this closure\./);
  assert.match(proposal, /\*\*Pass every Scope paths member as a `:\(literal\)` pathspec\*\*/);
  assert.match(proposal, /\*\*Pass each pathspec to the shell as one quoted argument\*\* —\s+parentheses are metacharacters in both POSIX shells and PowerShell\./);
  assert.match(proposal, /The five paths of Docs head are fixed\. When design\.md does not exist, that path\s+contributes nothing, which keeps the computation deterministic and blocks false\s+freshness for design\.md\./);
  assert.match(proposal, /\*\*Scope head and Docs head must parse as complete Git object IDs\.\*\* Empty output or a\s+malformed value makes that group of statements a hypothesis/);
  assert.match(proposal, /The GPT contract's four revision fields are out of the machine block; the verify Record\s+already holds the verification lineage\./);
  assert.match(proposal, /when it differs or the output is empty,[\s>]+the code statements are a hypothesis/);
  assert.match(proposal, /when that differs from `Covered cards`, the whole baseline is a hypothesis/);
  assert.match(proposal, /recheck it at a current[\s>]+authority path inside the existing read set and code-search boundary\. Do not expand[\s>]+those boundaries\./);

  assert.match(proposal, /The refresh at closure compares nothing: read the \*\*standard refresh set\*\* once and\s+replace the file wholesale\./);
  assert.match(proposal, /baseline-predicates enumerates that set: the existing\s+baseline[\s\S]*always the \*\*baseline at HEAD\*\*,\s+and working-tree bytes are never an input/);
  assert.match(proposal, /the current non-`\.stale\.` `\.done\.` cards outside Covered\s+cards together with those cards' direct `Depends` and `Read first` paths\./);
  assert.match(proposal, /\*\*Byte stability is a writing instruction, not a predicate\*\*[\s\S]*Rephrasing an unchanged fact is a\s+defect/);
  assert.match(proposal, /canonical Document Hierarchy applies unchanged/);
  assert.match(proposal, /An ADR in the Binding ADRs section\s+overrides a binding decision only within the scope that a canonical document explicitly\s+delegates to that exact path\./);
  assert.match(proposal, /A conclusion from a `\.stale\.` card cannot support the current baseline\. Retain only\s+content reconfirmed from the full `capability code scope` that step 5 produced\./);
  assert.match(proposal, /Derive capability retirement from current product\.md and tree state\. Neither edit nor\s+rename the baseline file\./);
  assert.doesNotMatch(proposal, /reconfirmed from current code/);
  assert.doesNotMatch(proposal, /canonical responsibility search|exactly indexed existing records|git hash-object -- <actual path>/);
  assert.doesNotMatch(proposal, /stable-key=|<stable-key>|\.pending\.md|baseline-operations|Product-capability-(?:row|number)-json|input digest|Covered-history extension/);
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

test("multi routing reads integration state before local claimed work", () => {
  const principles = fs.readFileSync(path.join(root, "skills", "principles", "SKILL.md"), "utf8");
  assert.match(principles, /shared state for next-stage routing and the integrity check comes from the tip of\s+arch\.md's integration branch/);
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
  assert.match(work, /rename rides the next wip checkpoint or final\s+task commit that contains the card/);
  assert.ok(
    work.indexOf("Multi integration gate") > work.indexOf("Final task commit")
      && work.indexOf("Multi integration gate") < work.indexOf("Land upper-document feedback"),
    "multi integration must precede every boundary working-tree mutation",
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
