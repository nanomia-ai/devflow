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

function run(cwd, ...args) {
  return spawnSync(process.execPath, [TOOL, ...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
}

function write(root, relative, content) {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function decision(id, title, subject = "Fixture subject", state = "active", introduced = "fixture") {
  return `### ${id} · ${title}\n\nSubject: ${subject} | Introduced: ${introduced} | State: ${state}\n\nFixture reason.\n`;
}

function fixture(t, english, korean = english) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-decision-index-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  write(root, "docs/design-decisions.md", `# Decisions\n\n${english}`);
  write(root, "docs/design-decisions_ko.md", `# \uACB0\uC815\n\n${korean}`);
  return root;
}

function rows(output) {
  return output.split(/\r?\n/).flatMap((line) => {
    const match = /^\|\s*(DD-\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/.exec(line);
    if (!match || match[1] === "ID") return [];
    return [{ id: match[1], title: match[2], state: match[3] }];
  });
}

function sourceDecisions(relative) {
  const text = fs.readFileSync(path.join(ROOT, relative), "utf8");
  return [...text.matchAll(/^###\s+(DD-\d+)\s+·\s+(.+)$/gm)]
    .map((match) => ({ id: match[1], title: match[2].trim()
      .replace(/ \(v\d+\.\d+\.\d+(?:, [^()]+ v\d+\.\d+\.\d+)?\)$/, "") }));
}

test("decision index projects every English decision once in source order", () => {
  const result = run(ROOT);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /^error:/m);
  const expected = sourceDecisions("docs/design-decisions.md");
  const actual = rows(result.stdout);
  assert.ok(expected.length >= 80, "the canonical source unexpectedly lost legacy decisions");
  assert.deepEqual(actual.map((item) => item.id), expected.map((item) => item.id));
  assert.deepEqual(actual.map((item) => item.title), expected.map((item) => item.title));
  assert.equal(new Set(actual.map((item) => item.id)).size, actual.length);
  assert.doesNotMatch(result.stdout, /truncat|\.\.\./i);
});

test("decision index projects Korean with the same identifier set and row count", () => {
  const english = run(ROOT);
  const korean = run(ROOT, "--lang", "ko");
  assert.equal(english.status, 0, english.stderr);
  assert.equal(korean.status, 0, korean.stderr);
  const enRows = rows(english.stdout);
  const koRows = rows(korean.stdout);
  assert.deepEqual(koRows.map((item) => item.id), sourceDecisions("docs/design-decisions_ko.md").map((item) => item.id));
  assert.deepEqual(new Set(koRows.map((item) => item.id)), new Set(enRows.map((item) => item.id)));
  assert.equal(koRows.length, enRows.length);
  assert.doesNotMatch(korean.stdout, /truncat|\.\.\./i);
});

test("decision index preserves the four legacy index meanings that used to exist only in design.md", () => {
  const result = run(ROOT);
  assert.equal(result.status, 0, result.stderr);
  const byId = new Map(rows(result.stdout).map((item) => [item.id, item.title]));
  const legacyMeaning = new Map([
    ["DD-65", "A mixed request records only its gate-failing items — a passing item enters no journal line"],
    ["DD-78", "One canon range goes unread only when a tool proves that range has no subject — the machine cuts, it reads HEAD and the working tree both, and every other answer collapses to the full read"],
    ["DD-79", "README is a person's document and lives outside the AI's read set — not read, not updated, not used as grounds for a judgment, and the line holds after README returns"],
  ]);
  for (const [id, title] of legacyMeaning) assert.equal(byId.get(id), title, `${id} lost legacy index meaning`);
  const entry = byId.get("DD-71") ?? "";
  assert.match(entry, /design in full.*decision index generated from the source/i);
  assert.match(entry, /AGENTS routes detailed procedure conditionally/i);
  assert.match(entry, /history is not onboarding/i);
});

test("decision index groups rows by Subject without changing source order", (t) => {
  const body = [
    decision("DD-01", "First", "Alpha"),
    decision("DD-02", "Second", "Alpha"),
    decision("DD-03", "Third", "Beta", "active, partly corrected by DD-02 (v1.2.3)"),
  ].join("\n");
  const root = fixture(t, body);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^## Alpha$/m);
  assert.match(result.stdout, /^## Beta$/m);
  assert.deepEqual(rows(result.stdout).map((item) => item.id), ["DD-01", "DD-02", "DD-03"]);
  assert.doesNotMatch(result.stdout, /Introduced/);
});

test("decision index rejects an unsupported language and arbitrary path surface", () => {
  const language = run(ROOT, "--lang", "fr");
  assert.notEqual(language.status, 0);
  assert.match(language.stderr, /--lang.*(?:en|ko)/i);
  const pathOption = run(ROOT, "--path", "elsewhere.md");
  assert.notEqual(pathOption.status, 0);
  assert.match(pathOption.stderr, /unknown option/i);
});

for (const [name, english, expected] of [
  ["missing title", "### DD-01 · \n\nSubject: Alpha | Introduced: fixture | State: active\n", /title/i],
  ["missing Subject", "### DD-01 · First\n\nIntroduced: fixture | State: active\n", /metadata|Subject/i],
  ["missing State", "### DD-01 · First\n\nSubject: Alpha | Introduced: fixture\n", /metadata|State/i],
  ["invalid State", decision("DD-01", "First", "Alpha", "deprecated"), /State/i],
  ["duplicate identifier", decision("DD-01", "First") + decision("DD-01", "Again"), /duplicate/i],
]) {
  test(`decision index rejects ${name} instead of inventing a value`, (t) => {
    const root = fixture(t, english);
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
    assert.equal(result.stdout, "");
  });
}

test("decision index rejects an English/Korean identifier-set mismatch", (t) => {
  const root = fixture(t, decision("DD-01", "First"), decision("DD-02", "\uCCAB\uC9F8"));
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /identifier set|ID set/i);
  assert.equal(result.stdout, "");
});

test("decision index keeps an oversized projection complete and warns instead of blocking entry", (t) => {
  const body = Array.from({ length: 180 }, (_, index) => decision(
    `DD-${1000 + index}`,
    `Complete decision ${index} ${"x".repeat(180)}`,
  )).join("\n");
  const root = fixture(t, body);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(Buffer.byteLength(result.stdout) > OUTPUT_ADVISORY);
  assert.equal(rows(result.stdout).length, 180);
  assert.match(result.stderr, /^warning: decision index is \d+ bytes; advisory threshold is \d+\n$/);
  assert.doesNotMatch(result.stdout, /truncat|\.\.\./i);
});
