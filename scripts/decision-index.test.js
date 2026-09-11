#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const TOOL = path.join(__dirname, "decision-index.mjs");
const OUTPUT_ADVISORY = 24 * 1024;
const DECISIONS = path.join(ROOT, "docs", "decisions");

// docs/ is Korean, so decision header fields are Korean and there is no language option.
const F = { state: "상태", subject: "주제", date: "날짜" };
const ACTIVE = "유효";
const KOREAN = /[가-힣]/;

function run(cwd, ...args) {
  return spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
}

function decisionFile(id, title, { subject = "Fixture subject", state = ACTIVE, date = "2026-09-11" } = {}) {
  return `# ${id} · ${title}\n\n- ${F.state}: ${state}\n- ${F.subject}: ${subject}\n`
    + `- ${F.date}: ${date}\n\nFixture reason.\n`;
}

function fixture(t, files) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-decision-index-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, "docs", "decisions");
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, body] of files) fs.writeFileSync(path.join(dir, name), body, "utf8");
  return root;
}

function rows(output) {
  return output.split(/\r?\n/).flatMap((line) => {
    const match = /^\|\s*(DD-\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/.exec(line);
    return match && match[1] !== "ID"
      ? [{ id: match[1], title: match[2], date: match[3], state: match[4] }]
      : [];
  });
}

function repositoryDecisions() {
  return fs.readdirSync(DECISIONS).filter((name) => name.endsWith(".md"))
    .map((name) => /^# (DD-\d+) · (.+)$/m.exec(fs.readFileSync(path.join(DECISIONS, name), "utf8")))
    .map((match) => ({ id: match[1], title: match[2].trim() }));
}

test("the index projects every decision file exactly once", () => {
  const result = run(ROOT);
  assert.equal(result.status, 0, result.stderr);
  const projected = rows(result.stdout);
  const expected = repositoryDecisions();
  assert.equal(projected.length, expected.length, "row count does not match the file count");
  assert.deepEqual(projected.map((r) => r.id).sort(), expected.map((d) => d.id).sort());
  const titles = new Map(expected.map((d) => [d.id, d.title]));
  for (const row of projected) assert.equal(row.title, titles.get(row.id), `${row.id}: title drift`);
});

test("the projection is Korean and carries no second language directory", () => {
  assert.match(run(ROOT).stdout, KOREAN, "the index should be Korean");
  assert.ok(!fs.existsSync(path.join(DECISIONS, "ko")), "docs/decisions/ko/ came back");
});

test("--id prints one decision in full and nothing else", () => {
  const result = run(ROOT, "--id", "DD-84");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^# DD-84 · /);
  assert.match(result.stdout, new RegExp(`^- ${F.state}: `, "m"));
  assert.doesNotMatch(result.stdout, /^# DD-(?!84)\d+ · /m, "--id leaked another decision");
  assert.ok(Buffer.byteLength(result.stdout) < 16 * 1024, "one decision should open on its own");
  assert.equal(run(ROOT, "--id", "84").stdout, result.stdout, "a bare number should resolve the same");
});

test("rows stay grouped under their subject heading", () => {
  const subjects = [...run(ROOT).stdout.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.ok(subjects.length >= 2, "the index lost its subject grouping");
  assert.equal(new Set(subjects).size, subjects.length, "a subject heading repeats");
});

test("unknown options and identifiers fail loudly", () => {
  const lang = run(ROOT, "--lang", "ko");
  assert.equal(lang.status, 1, "the language option is gone with the pairs");
  assert.match(lang.stderr, /unknown option/);
  const missing = run(ROOT, "--id", "DD-99999");
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /is not a decision/);
  const shape = run(ROOT, "--id", "nonsense");
  assert.equal(shape.status, 1);
  assert.match(shape.stderr, /must look like DD-84/);
});

test("a missing title is refused instead of invented", (t) => {
  const body = `# DD-01 ·\n\n- ${F.state}: ${ACTIVE}\n- ${F.subject}: S\n- ${F.date}: 2026-09-11\n\nBody.\n`;
  const result = run(fixture(t, [["001-a.md", body]]));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /first line must be/);
});

test("a missing header field is refused instead of invented", (t) => {
  const body = `# DD-01 · Title\n\n- ${F.state}: ${ACTIVE}\n- ${F.date}: 2026-09-11\n\nBody.\n`;
  const result = run(fixture(t, [["001-a.md", body]]));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /header needs nonempty/);
});

test("each subject's rejections are reachable from the index, and a stray rejection is refused", (t) => {
  const entry = "- **[DR-01 · v0.1.0]** **x** — y.\n";
  const homed = decisionFile("DD-01", "A", { subject: "S" }) + `\n## 기각된 안 — S\n\n${entry}`;
  const ok = run(fixture(t, [["001-a.md", homed]]));
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /^기각된 안: DR-01 — `--id DD-01`$/m, "the subject does not point at its rejections");
  const stray = run(fixture(t, [["001-a.md", decisionFile("DD-01", "A", { subject: "S" }) + `\n${entry}`]]));
  assert.equal(stray.status, 1, "a rejection with no subject section was projected");
  assert.match(stray.stderr, /rejection section/);
});

test("an unknown state is refused instead of projected", (t) => {
  const result = run(fixture(t, [["001-a.md", decisionFile("DD-01", "Title", { state: "maybe" })]]));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid state/);
});

test("a duplicate identifier across two files is refused", (t) => {
  const result = run(fixture(t, [
    ["001-a.md", decisionFile("DD-01", "First")],
    ["002-b.md", decisionFile("DD-01", "Second")],
  ]));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate decision identifier/);
});

test("a missing decision directory is refused", (t) => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-decision-index-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /decision directory is missing/);
});

test("an oversized projection stays complete and only warns", (t) => {
  const files = [];
  for (let index = 1; index <= 400; index += 1) {
    files.push([`${String(index).padStart(3, "0")}-x.md`,
      decisionFile(`DD-${index}`, `Padded title ${"y".repeat(120)} ${index}`)]);
  }
  const result = run(fixture(t, files));
  assert.equal(result.status, 0, result.stderr);
  assert.ok(Buffer.byteLength(result.stdout) > OUTPUT_ADVISORY, "fixture did not exceed the advisory size");
  assert.match(result.stderr, /warning: decision index is \d+ bytes/);
  assert.equal(rows(result.stdout).length, 400, "the projection was truncated");
});

test("the tool writes nothing", () => {
  const before = fs.readdirSync(DECISIONS).sort();
  run(ROOT);
  run(ROOT, "--id", "DD-84");
  assert.deepEqual(fs.readdirSync(DECISIONS).sort(), before);
});
