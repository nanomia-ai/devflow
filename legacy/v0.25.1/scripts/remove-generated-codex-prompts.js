#!/usr/bin/env node
// Removes the flat Codex slash prompts devflow generated before v0.13.0. The native plugin
// channel carries the same skills with their companion files, so a second channel that
// embeds the whole canon in every prompt only doubles the maintenance cost. Deletion is
// keyed to the generated marker, so a file a user wrote under the same name is left alone.
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const GENERATED_NAMES = [
  "devflow-adopt.md",
  "devflow-arch.md",
  "devflow-design.md",
  "devflow-product.md",
  "devflow-resume.md",
  "devflow-split.md",
  "devflow-verify.md",
  "devflow-work.md",
];

const MARKER = /^<!-- devflow \(generated \d{4}-\d{2}-\d{2}\) -->/;

function hasGeneratedMarker(file) {
  let handle;
  try {
    handle = fs.openSync(file, "r");
    const buffer = Buffer.alloc(64);
    const read = fs.readSync(handle, buffer, 0, 64, 0);
    return MARKER.test(buffer.subarray(0, read).toString("utf8").replace(/^﻿/, ""));
  } catch {
    return false;
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
  }
}

function removeGeneratedCodexPrompts(promptsDir) {
  const removed = [];
  for (const name of GENERATED_NAMES) {
    const file = path.join(promptsDir, name);
    if (!fs.existsSync(file) || !hasGeneratedMarker(file)) continue;
    fs.rmSync(file);
    removed.push(name);
  }
  return removed;
}

function run() {
  const promptsDir = path.join(os.homedir(), ".codex", "prompts");
  if (!fs.existsSync(promptsDir)) return;
  const removed = removeGeneratedCodexPrompts(promptsDir);
  if (!removed.length) return;
  console.log(`removed ${removed.length} generated devflow slash prompt(s) - the native plugin channel replaces them`);
}

if (require.main === module) run();

module.exports = { removeGeneratedCodexPrompts, GENERATED_NAMES };
