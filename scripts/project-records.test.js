#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const tool = path.join(__dirname, "project-records.mjs");
const keys = [
  "v", "kind", "during", "affects", "scope", "mode",
  "evidence", "checked-at", "review-after", "supersedes",
];

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-records-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function rawGitBlobOid(bytes) {
  return crypto.createHash("sha1")
    .update(Buffer.from(`blob ${bytes.length}\0`, "utf8"))
    .update(bytes)
    .digest("hex");
}

function gitBlobOid(bytes) {
  return rawGitBlobOid(Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8"));
}

function header(overrides = {}) {
  return {
    v: 1,
    kind: "decision",
    during: "arch",
    affects: ["arch:Stack"],
    scope: "project",
    mode: null,
    evidence: [],
    "checked-at": null,
    "review-after": null,
    supersedes: [],
    ...overrides,
  };
}

function writeRecord(root, prefix, slug, value, body = "# Record\n", date = "20260817",
  lineEnding = "\n") {
  assert.deepEqual(Object.keys(value), keys);
  const text = `record: ${JSON.stringify(value)}\n${body}`.replace(/\r\n/g, "\n");
  const bytes = Buffer.from(lineEnding === "\r\n" ? text.replace(/\n/g, "\r\n") : text, "utf8");
  const oid = gitBlobOid(bytes);
  const name = `${prefix}-${date}-${slug}-${oid}.md`;
  const directory = prefix === "D" ? "decisions" : "evidence";
  const target = path.join(root, "devflow", "project", directory, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
  return { name, target };
}

function evidenceHeader(overrides = {}) {
  return header({
    kind: "evidence",
    mode: "reproducible",
    evidence: [],
    "checked-at": "2026-08-17",
    "review-after": null,
    ...overrides,
  });
}

function reproducibleEvidenceBody(root, relative = "fixtures/reproduce.txt") {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, "fixture\n", "utf8");
  return `# Evidence\n## Reproduce\n\`node ${relative}\`\n## Invalidates-when\nThe fixture changes.\n`;
}

function reportedEvidenceBody(reproduce = "Observed in the fixture UI.") {
  return `# Evidence\n## Reproduce\n${reproduce}\n## Invalidates-when\nThe reported observation is reconfirmed.\n`;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [tool, ...args, "--root", root], {
    cwd: root,
    encoding: "utf8",
  });
}

function assertOk(result) {
  assert.equal(result.status, 0, result.stderr);
}

function toolAffectsLiterals() {
  const source = fs.readFileSync(tool, "utf8");
  const block = /const AFFECTS = new Set\(\[([\s\S]*?)\]\);/.exec(source);
  assert.ok(block, "tool AFFECTS declaration must remain machine-readable");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]).sort();
}

function documentedAffectsLiterals(file, sectionHeading) {
  const source = fs.readFileSync(file, "utf8");
  const start = source.search(sectionHeading);
  assert.notEqual(start, -1, `${path.basename(file)} must contain the planning-records section`);
  const tail = source.slice(start);
  const headingEnd = tail.indexOf("\n") + 1;
  const end = tail.slice(headingEnd).search(/^## (?!#)/m);
  const section = end < 0 ? tail : tail.slice(0, headingEnd + end);
  const compact = [...section.matchAll(/`((?:product|arch|design):[A-Za-z][A-Za-z|-]*)`/g)]
    .map((match) => match[1]);
  assert.equal(compact.length, 3, `${path.basename(file)} must define product, arch, and design affects`);
  return compact.flatMap((entry) => {
    const [first, ...rest] = entry.split("|");
    const prefix = first.slice(0, first.indexOf(":") + 1);
    return [first, ...rest.map((literal) => `${prefix}${literal}`)];
  }).sort();
}

test("both plugin manifest surfaces resolve the same shared tool", () => {
  const root = path.join(__dirname, "..");
  const claudePath = path.join(root, ".claude-plugin", "..", "scripts", "project-records.mjs");
  const codexPath = path.join(root, ".codex-plugin", "..", "scripts", "project-records.mjs");
  assert.equal(fs.realpathSync(claudePath), fs.realpathSync(codexPath));
  assert.equal(fs.realpathSync(claudePath), fs.realpathSync(tool));
});

test("missing and empty record folders are normal zero-record states", (t) => {
  const root = fixture(t);
  for (const command of ["summary", "validate"]) {
    const missing = run(root, command);
    assertOk(missing);
    assert.match(missing.stdout, /(?:valid|current)=0/);
  }
  fs.mkdirSync(path.join(root, "devflow", "project", "decisions"), { recursive: true });
  fs.mkdirSync(path.join(root, "devflow", "project", "evidence"), { recursive: true });
  const selected = run(root, "select", "--affects", "arch:Stack");
  assertOk(selected);
  assert.match(selected.stdout, /matched=0 opened=0 bind=1/);
});

test("validate rejects malformed first-line JSON and key order", (t) => {
  const root = fixture(t);
  const directory = path.join(root, "devflow", "project", "decisions");
  fs.mkdirSync(directory, { recursive: true });
  const malformed = Buffer.from("record: {no}\n# Body\n", "utf8");
  fs.writeFileSync(path.join(directory, `D-20260817-bad-${gitBlobOid(malformed)}.md`), malformed);
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /first-line JSON is invalid/);

  fs.rmSync(path.join(directory, fs.readdirSync(directory)[0]));
  const reordered = { kind: "decision", v: 1 };
  for (const key of keys.slice(2)) reordered[key] = header()[key];
  const bytes = Buffer.from(`record: ${JSON.stringify(reordered)}\n# Body\n`, "utf8");
  fs.writeFileSync(path.join(directory, `D-20260817-order-${gitBlobOid(bytes)}.md`), bytes);
  const order = run(root, "validate");
  assert.equal(order.status, 1);
  assert.match(order.stderr, /header keys must be exactly/);
});

test("validate rejects a filename oid that does not match the complete bytes", (t) => {
  const root = fixture(t);
  const record = writeRecord(root, "D", "oid", header());
  const wrong = record.target.replace(/[0-9a-f]{40}\.md$/, `${"0".repeat(40)}.md`);
  fs.renameSync(record.target, wrong);
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /oid mismatch/);
});

test("LF-normalized oid validates the same record with LF and CRLF bytes", (t) => {
  const lfRoot = fixture(t);
  const crlfRoot = fixture(t);
  const lf = writeRecord(lfRoot, "D", "line-endings", header(), "# Record\nGround.\n");
  const crlf = writeRecord(crlfRoot, "D", "line-endings", header(), "# Record\nGround.\n",
    "20260817", "\r\n");

  assert.equal(lf.name, crlf.name);
  assert.notEqual(rawGitBlobOid(fs.readFileSync(lf.target)), rawGitBlobOid(fs.readFileSync(crlf.target)));
  assertOk(run(lfRoot, "validate"));
  assertOk(run(crlfRoot, "validate"));

  const canonicalOid = /([0-9a-f]{40})\.md$/.exec(crlf.name)[1];
  const rawOid = rawGitBlobOid(fs.readFileSync(crlf.target));
  const rawNamed = crlf.target.replace(canonicalOid, rawOid);
  fs.renameSync(crlf.target, rawNamed);
  const mismatch = run(crlfRoot, "validate");
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, new RegExp(`content ${canonicalOid}`));
});

test("body length above 15 lines and the 8 KiB hard limit both reject", (t) => {
  const lineRoot = fixture(t);
  writeRecord(lineRoot, "D", "lines", header(), `${Array.from({ length: 16 }, (_, i) => `line ${i}`).join("\n")}\n`);
  const lines = run(lineRoot, "validate");
  assert.equal(lines.status, 1);
  assert.match(lines.stderr, /body has 16 lines; hard limit is 15/);

  const hardRoot = fixture(t);
  writeRecord(hardRoot, "D", "bytes", header(), "x".repeat(8193));
  const hard = run(hardRoot, "validate");
  assert.equal(hard.status, 1);
  assert.match(hard.stderr, /hard limit is 8192/);
});

test("evidence body grammar is required and reproducible paths must exist", (t) => {
  const validRoot = fixture(t);
  writeRecord(validRoot, "E", "valid-reproduce", evidenceHeader(), reproducibleEvidenceBody(validRoot));
  assertOk(run(validRoot, "validate"));

  const missingRoot = fixture(t);
  writeRecord(missingRoot, "E", "missing-reproduce", evidenceHeader(),
    "# Evidence\n## Reproduce\n`node scripts/does-not-exist.mjs`\n## Invalidates-when\nThe command changes.\n");
  const missing = run(missingRoot, "validate");
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /Reproduce must name an existing repository path/);

  const malformedRoot = fixture(t);
  writeRecord(malformedRoot, "E", "missing-invalidates", evidenceHeader(),
    reproducibleEvidenceBody(malformedRoot).replace("## Invalidates-when", "## Applicability"));
  const malformed = run(malformedRoot, "validate");
  assert.equal(malformed.status, 1);
  assert.match(malformed.stderr, /requires the Invalidates-when section/);

  const reportedRoot = fixture(t);
  writeRecord(reportedRoot, "E", "reported", evidenceHeader({ mode: "reported" }),
    reportedEvidenceBody("`node scripts/does-not-exist.mjs` (reported, not executed)"));
  assertOk(run(reportedRoot, "validate"));
});

test("current set follows an existing supersedes chain", (t) => {
  const root = fixture(t);
  const first = writeRecord(root, "D", "choice", header(), "first\n");
  const second = writeRecord(root, "D", "choice", header({ supersedes: [first.name] }), "second\n");
  writeRecord(root, "D", "choice", header({ supersedes: [second.name] }), "third\n");
  const result = run(root, "summary");
  assertOk(result);
  assert.match(result.stdout, /valid=3 current=1 decisions=1 evidence=0 superseded=2/);
});

test("select stops with zero bodies at q greater than three and has bounded exits", (t) => {
  const root = fixture(t);
  const names = [];
  const fixtures = [
    ["a", "20260811"], ["b", "20260818"], ["c", "20260815"], ["d", "20260817"],
  ];
  for (const [slug, date] of fixtures) {
    names.push(writeRecord(root, "D", slug, header(), `${slug} body\n`, date).name);
  }
  const blocked = run(root, "select", "--affects", "arch:Stack");
  assert.equal(blocked.status, 3);
  assert.equal((blocked.stdout.match(/^candidate:/gm) || []).length, 4);
  assert.equal((blocked.stdout.match(/^body:/gm) || []).length, 0);
  assert.match(blocked.stdout, /opened=0 bind=0/);
  const blockedCandidates = [...blocked.stdout.matchAll(/^candidate: (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(blockedCandidates, [names[1], names[3], names[2], names[0]]);

  const chosen = run(root, "select", "--affects", "arch:Stack", "--choose", names[3]);
  assertOk(chosen);
  assert.equal((chosen.stdout.match(/^body:/gm) || []).length, 1);
  assert.match(chosen.stdout, /opened=1 bind=1/);
  assert.match(chosen.stdout, new RegExp(`body: ${names[3].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));

  const approved = run(root, "select", "--affects", "arch:Stack", "--approved");
  assertOk(approved);
  assert.equal((approved.stdout.match(/^body:/gm) || []).length, 3);
  assert.match(approved.stdout, /opened=3 bind=1/);
  const approvedBodies = [...approved.stdout.matchAll(/^body: (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(approvedBodies, [names[1], names[3], names[2]]);
});

test("select choose binds exact user picks and composes with approved", (t) => {
  const root = fixture(t);
  const names = [];
  for (let index = 0; index < 8; index += 1) {
    names.push(writeRecord(root, "D", `choice-${index}`, header(), `choice ${index}\n`,
      `202608${String(index + 1).padStart(2, "0")}`).name);
  }
  const picks = [names[1], names[6]];
  const chosen = run(root, "select", "--affects", "arch:Stack", "--choose", picks.join(","));
  assertOk(chosen);
  assert.match(chosen.stdout, /matched=8 opened=2 bind=1/);
  assert.deepEqual([...chosen.stdout.matchAll(/^body: (.+)$/gm)].map((match) => match[1]), picks);

  const combined = run(root, "select", "--affects", "arch:Stack", "--approved",
    "--choose", picks.join(","));
  assertOk(combined);
  assert.match(combined.stdout, /matched=8 opened=2 bind=1/);
  assert.deepEqual([...combined.stdout.matchAll(/^body: (.+)$/gm)].map((match) => match[1]), picks);
});

test("select matches any queried affects literal and opens newest records first", (t) => {
  const root = fixture(t);
  const stack = writeRecord(root, "D", "stack", header({ affects: ["arch:Stack"] }),
    "stack\n", "20260812");
  const components = writeRecord(root, "D", "components", header({ affects: ["arch:Components"] }),
    "components\n", "20260818");
  writeRecord(root, "D", "data", header({ affects: ["arch:Data"] }), "data\n", "20260817");

  const result = run(root, "select", "--affects", "arch:Stack", "--affects", "arch:Components");
  assertOk(result);
  assert.match(result.stdout, /matched=2 opened=2 bind=1/);
  const bodies = [...result.stdout.matchAll(/^body: (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(bodies, [components.name, stack.name]);
  assert.doesNotMatch(result.stdout, /^candidate: D-20260817-data-/m);
});

test("same-slug concurrent additions remain distinct by content oid", (t) => {
  const root = fixture(t);
  const left = writeRecord(root, "D", "same", header(), "left\n");
  const right = writeRecord(root, "D", "same", header(), "right\n");
  assert.notEqual(left.name, right.name);
  const result = run(root, "summary");
  assertOk(result);
  assert.match(result.stdout, /valid=2 current=2/);
});

test("validate accepts only the fixed affects literals and known capability numbers", (t) => {
  const badRoot = fixture(t);
  writeRecord(badRoot, "D", "bad-affects", header({ affects: ["arch:stack"] }));
  const bad = run(badRoot, "validate");
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /invalid affects literal/);

  const goodRoot = fixture(t);
  const product = path.join(goodRoot, "devflow", "project", "product.md");
  fs.mkdirSync(path.dirname(product), { recursive: true });
  fs.writeFileSync(product, "# P\n\n## Capabilities\n① One\n② Two\n\n## Boundary\n", "utf8");
  writeRecord(goodRoot, "D", "capability", header({
    affects: ["capability:2"],
    scope: "capability",
  }));
  assertOk(run(goodRoot, "validate"));
});

test("every documented non-capability affects literal is accepted verbatim", (t) => {
  const root = fixture(t);
  const allowed = [
    "product:Identity", "product:Approach", "product:Capabilities", "product:Boundary",
    "product:Success-criteria",
    "arch:Components", "arch:Stack", "arch:Code-structure", "arch:Data", "arch:Verify-channel",
    "design:Approach", "design:Design-source", "design:Token-strategy",
    "design:Component-strategy", "design:Decomposition-axis", "design:Review-surface",
  ];
  for (const [index, affects] of allowed.entries()) {
    writeRecord(root, "D", `literal-${index}`, header({ affects: [affects] }), `${affects}\n`);
  }
  const result = run(root, "validate");
  assertOk(result);
  assert.match(result.stdout, /valid=16/);
});

test("tool AFFECTS stays identical to both canonical prompt literal lists", () => {
  const root = path.join(__dirname, "..");
  const toolLiterals = toolAffectsLiterals();
  const english = documentedAffectsLiterals(
    path.join(root, "skills", "principles", "SKILL.md"),
    /^### Planning records\b/m,
  );
  const korean = documentedAffectsLiterals(
    path.join(root, "skills", "principles", "SKILL_ko.md"),
    /^### \uAE30\uD68D \uAE30\uB85D/m,
  );
  assert.deepEqual(english, korean, "ko/en canonical affects lists must be identical");
  assert.deepEqual(toolLiterals, english, "tool AFFECTS must equal the canonical prompt literals");
});

test("scope derives capability membership only from affects", (t) => {
  const root = fixture(t);
  const product = path.join(root, "devflow", "project", "product.md");
  fs.mkdirSync(path.dirname(product), { recursive: true });
  fs.writeFileSync(product, "# P\n\n## Capabilities\n① One\n② Two\n\n## Boundary\n", "utf8");

  writeRecord(root, "D", "foundation", header({ scope: "foundation" }), "foundation\n");
  writeRecord(root, "D", "capability", header({
    scope: "capability",
    affects: ["arch:Stack", "capability:2"],
  }), "capability\n");
  assertOk(run(root, "validate"));

  const badRoot = fixture(t);
  const badProduct = path.join(badRoot, "devflow", "project", "product.md");
  fs.mkdirSync(path.dirname(badProduct), { recursive: true });
  fs.writeFileSync(badProduct, "# P\n\n## Capabilities\n① One\n\n## Boundary\n", "utf8");
  writeRecord(badRoot, "D", "duplicate-home", header({
    scope: "foundation",
    affects: ["capability:1"],
  }), "bad\n");
  const bad = run(badRoot, "validate");
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /foundation scope must not include capability affects tokens/);
});

test("review-after is counted and blocks select at its due date", (t) => {
  const root = fixture(t);
  writeRecord(root, "E", "stale", evidenceHeader({
    "checked-at": "2000-01-01",
    "review-after": "2000-01-31",
  }), reproducibleEvidenceBody(root));
  const summary = run(root, "summary");
  assertOk(summary);
  assert.match(summary.stdout, /review-due=1/);

  const selected = run(root, "select", "--affects", "arch:Stack");
  assert.equal(selected.status, 5);
  assert.match(selected.stdout, /bind=0 review-due=1/);
  assert.match(selected.stdout, /^review-due: E-/m);
});

test("select choose or approved keeps bind closed when opened evidence is review-due", (t) => {
  const root = fixture(t);
  const due = writeRecord(root, "E", "stale", evidenceHeader({
    "checked-at": "2000-01-01",
    "review-after": "2000-01-31",
  }), reproducibleEvidenceBody(root));
  for (let index = 0; index < 3; index += 1) {
    writeRecord(root, "D", `current-${index}`, header(), `current ${index}\n`,
      `202608${String(index + 1).padStart(2, "0")}`);
  }

  const selected = run(root, "select", "--affects", "arch:Stack", "--choose", due.name);
  assert.equal(selected.status, 5);
  assert.match(selected.stdout, /matched=4 opened=1 bind=0 review-due=1/);
  assert.match(selected.stdout, new RegExp(`body: ${due.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));

  const approved = run(root, "select", "--affects", "arch:Stack", "--approved");
  assert.equal(approved.status, 5);
  assert.match(approved.stdout, /matched=4 opened=3 bind=0 review-due=1/);
  assert.match(approved.stdout, new RegExp(`body: ${due.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
});

test("unopened review-due evidence is reported but does not block clean choose or approved", (t) => {
  const root = fixture(t);
  const due = writeRecord(root, "E", "stale-unopened", evidenceHeader({
    "checked-at": "2000-01-01",
    "review-after": "2000-01-31",
  }), reproducibleEvidenceBody(root), "20260801");
  const clean = [];
  for (const [slug, date] of [["clean-a", "20260818"], ["clean-b", "20260817"],
    ["clean-c", "20260816"]]) {
    clean.push(writeRecord(root, "D", slug, header(), `${slug}\n`, date).name);
  }

  const chosen = run(root, "select", "--affects", "arch:Stack", "--choose", clean[1]);
  assertOk(chosen);
  assert.match(chosen.stdout, /matched=4 opened=1 bind=1 review-due=1/);
  assert.match(chosen.stdout, new RegExp(`^review-due: ${due.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m"));
  assert.doesNotMatch(chosen.stdout, new RegExp(`^body: ${due.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m"));

  const approved = run(root, "select", "--affects", "arch:Stack", "--approved");
  assertOk(approved);
  assert.match(approved.stdout, /matched=4 opened=3 bind=1 review-due=1/);
  assert.doesNotMatch(approved.stdout, new RegExp(`^body: ${due.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m"));
});

test("reverse-evidence lists only current decisions with fixed-string evidence refs", (t) => {
  const root = fixture(t);
  const evidence = writeRecord(root, "E", "timing", evidenceHeader(), reproducibleEvidenceBody(root));
  const old = writeRecord(root, "D", "old", header({ evidence: [evidence.name] }), "old\n");
  const current = writeRecord(root, "D", "new", header({
    evidence: [evidence.name],
    supersedes: [old.name],
  }), "new\n");
  const result = run(root, "reverse-evidence", "--name", evidence.name);
  assertOk(result);
  assert.match(result.stdout, /current-decisions=1/);
  assert.match(result.stdout, new RegExp(current.name));
  assert.doesNotMatch(result.stdout, new RegExp(old.name));
});

test("prune-check catches current evidence citations and never edits", (t) => {
  const root = fixture(t);
  const body = reproducibleEvidenceBody(root);
  const old = writeRecord(root, "E", "probe", evidenceHeader(), body);
  writeRecord(root, "E", "probe", evidenceHeader({ supersedes: [old.name] }), body.replace("# Evidence", "# New evidence"));
  const citing = writeRecord(root, "D", "choice", header({ evidence: [old.name] }), "decision\n");
  const before = fs.readFileSync(old.target);
  const result = run(root, "prune-check", "--path", path.relative(root, old.target));
  assert.equal(result.status, 4);
  assert.match(result.stdout, /unsafe/);
  assert.match(result.stdout, new RegExp(citing.name));
  assert.deepEqual(fs.readFileSync(old.target), before);
});

test("prune-check accepts only an unreferenced superseded leaf", (t) => {
  const root = fixture(t);
  const old = writeRecord(root, "D", "leaf", header(), "old\n");
  writeRecord(root, "D", "leaf", header({ supersedes: [old.name] }), "new\n");
  const result = run(root, "prune-check", "--path", old.name);
  assertOk(result);
  assert.match(result.stdout, /safe/);
  assert.ok(fs.existsSync(old.target), "read-only check must not delete the safe leaf");
});
