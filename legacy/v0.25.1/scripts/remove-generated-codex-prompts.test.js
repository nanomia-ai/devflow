#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const { removeGeneratedCodexPrompts, GENERATED_NAMES } = require("./remove-generated-codex-prompts.js");

function makePromptsDir(t, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-prompts-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, "utf8");
  }
  return dir;
}

test("every generated name is removed when it carries the marker", (t) => {
  const files = Object.fromEntries(
    GENERATED_NAMES.map((name) => [name, "<!-- devflow (generated 2026-08-11) -->\n\nbody\n"]),
  );
  const dir = makePromptsDir(t, files);
  assert.deepEqual(removeGeneratedCodexPrompts(dir).sort(), [...GENERATED_NAMES].sort());
  assert.deepEqual(fs.readdirSync(dir), []);
});

test("a marker written with a UTF-8 BOM still counts", (t) => {
  const dir = makePromptsDir(t, {
    "devflow-work.md": "﻿<!-- devflow (generated 2026-08-01) -->\n\nbody\n",
  });
  assert.deepEqual(removeGeneratedCodexPrompts(dir), ["devflow-work.md"]);
});

test("a user's own file under the same name survives", (t) => {
  const dir = makePromptsDir(t, {
    "devflow-work.md": "# my own prompt\n",
    "devflow-split.md": "<!-- devflow (generated 2026-08-11) -->\n",
  });
  assert.deepEqual(removeGeneratedCodexPrompts(dir), ["devflow-split.md"]);
  assert.equal(fs.readFileSync(path.join(dir, "devflow-work.md"), "utf8"), "# my own prompt\n");
});

test("unrelated prompts and a missing folder are untouched", (t) => {
  const dir = makePromptsDir(t, { "my-notes.md": "<!-- devflow (generated 2026-08-11) -->\n" });
  assert.deepEqual(removeGeneratedCodexPrompts(dir), []);
  assert.deepEqual(fs.readdirSync(dir), ["my-notes.md"]);
  assert.deepEqual(removeGeneratedCodexPrompts(path.join(dir, "absent")), []);
});
