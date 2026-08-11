#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.join(__dirname, "..");
const extractor = path.join(__dirname, "extract-adopt-reference.js");

function extract(stage) {
  return execFileSync(
    process.execPath,
    [extractor, path.join(root, "skills", stage, "SKILL.md"), stage],
    { encoding: "utf8" },
  );
}

test("product reference carries only the output contract", () => {
  const text = extract("product");
  assert.match(text, /^## Output — devflow\/project\/product\.md/m);
  assert.match(text, /^## Success criteria/m);
  assert.doesNotMatch(text, /^## Interview Rules/m);
  assert.doesNotMatch(text, /^## Gates/m);
});

test("arch reference carries the required gate and both output contracts", () => {
  const text = extract("arch");
  assert.match(text, /^### 5\. Verify-channel decision — a pass-gate/m);
  assert.match(text, /^## Output — devflow\/project\/arch\.md/m);
  assert.match(text, /^## Output 2 — devflow\/project\/code-style\.md/m);
  assert.match(text, /\| A \| Domain-vertical modules/);
  assert.match(text, /\| B \| Feature-Sliced/);
  assert.match(text, /\| C \| Flat/);
  assert.doesNotMatch(text, /derived questions \(step 3\)/);
  assert.doesNotMatch(text, /^## Procedure/m);
  assert.doesNotMatch(text, /^### 1\. Component derivation/m);
  assert.doesNotMatch(text, /^## Capability documents/m);
  assert.doesNotMatch(text, /^On completion:/m);
});

test("both Codex installers use the bounded extractor", () => {
  for (const relative of ["codex/install.ps1", "codex/install.sh"]) {
    const text = require("node:fs").readFileSync(path.join(root, relative), "utf8");
    assert.match(text, /extract-adopt-reference\.js/, relative);
    assert.match(text, /bounded output contract/, relative);
  }
});

test("adopt permits the selected verify-channel range while forbidding only text outside it", () => {
  const text = require("node:fs").readFileSync(path.join(root, "skills", "adopt", "SKILL.md"), "utf8");
  assert.match(text, /read `Verify-channel decision`/);
  assert.match(text, /outside those\s+ranges/);
  assert.doesNotMatch(text, /Do not read or execute either skill's interview or procedure/);
});
