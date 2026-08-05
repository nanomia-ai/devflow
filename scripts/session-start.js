#!/usr/bin/env node
// nano-devflow SessionStart hook: injects tree state and HANDOFF into new sessions (start/resume/post-compact).
// Exits silently in projects without devflow (no devflow/tree).
"use strict";
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const treeDir = path.join(cwd, "devflow", "tree");
if (!fs.existsSync(treeDir)) process.exit(0);

function safeRead(p, maxLen) {
  try {
    const t = fs.readFileSync(p, "utf8");
    return t.length > maxLen ? t.slice(0, maxLen) + "\n…(truncated)" : t;
  } catch {
    return null;
  }
}

// Recursive walk under devflow/tree (shallow is enough — tree depth is low by convention)
function walk(dir, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const files = walk(treeDir, []);
const rel = (p) => path.relative(cwd, p).replace(/\\/g, "/");
const wip = files.filter((p) => /\.wip\.md$/.test(p));
const done = files.filter((p) => /\.done\.md$/.test(p));
const pending = files.filter((p) => !/\.(wip|done|stale)\.md$/.test(p) && !/verify\.md$/.test(p));

const parts = [];
parts.push("[nano-devflow] This project is managed with devflow. Tree state:");
parts.push(`- done ${done.length} / in progress ${wip.length} / pending ${pending.length}`);

// Integrity warning: duplicate card numbers (numbers are immutable identifiers; duplication = corruption)
const numOf = (p) => {
  const m = path.basename(p).match(/^(\d+(?:\.\d+)*[a-z]?)-/);
  return m ? m[1] : null;
};
const seen = new Map();
const dups = new Set();
for (const p of files) {
  if (/verify\.md$/.test(path.basename(p))) continue;
  const n = numOf(p);
  if (!n) continue;
  if (seen.has(n)) dups.add(n);
  seen.set(n, p);
}
if (dups.size) parts.push(`⚠ duplicate numbers detected: ${[...dups].join(", ")} — integrity check needed (report, do not fix)`);
if (wip.length > 1) parts.push(`⚠ ${wip.length} .wip. cards — an integrity anomaly unless parallelism was approved`);

// Identity paragraph (body before the first blank line within the first 20 lines of product.md)
const product = safeRead(path.join(cwd, "devflow", "project", "product.md"), 4000);
if (product) {
  const lines = product.split(/\r?\n/).slice(0, 20);
  const idx = lines.findIndex((l, i) => i > 0 && l.trim() === "" && lines.slice(1, i).some((x) => x.trim()));
  const identity = lines.slice(0, idx > 0 ? idx : 6).join("\n").trim();
  if (identity) parts.push("\nIdentity:\n" + identity);
}

if (wip.length) {
  parts.push("\nIn-progress cards (read fully, then continue):");
  for (const p of wip) parts.push("- " + rel(p));
} else if (pending.length) {
  parts.push("\nNo card in progress. Next pending card example: " + rel(pending[0]));
}

const handoff = safeRead(path.join(cwd, "devflow", "HANDOFF.md"), 3000);
if (handoff && handoff.trim()) parts.push("\nHANDOFF:\n" + handoff.trim());

parts.push("\nFollow the nano-devflow resume skill to resume. Do not modify code before approval.");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: parts.join("\n"),
    },
  })
);
