#!/usr/bin/env node
// devflow SessionStart hook: activates resume without interpreting checkout state.
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

// The session may start in any subfolder of the checkout, so the folder the hook happens
// to run in is a starting point, never the answer.
function sessionDirectory() {
  if (process.stdin.isTTY) return process.cwd();
  let raw;
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch {
    return process.cwd();
  }
  try {
    const payload = JSON.parse(raw);
    if (payload && typeof payload.cwd === "string" && payload.cwd) return payload.cwd;
  } catch {
    // an unparseable payload leaves the process directory as the only known start point
  }
  return process.cwd();
}

function checkoutRoot(directory) {
  const run = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: directory, encoding: "utf8" });
  if (run.status !== 0 || !run.stdout) return directory;
  return run.stdout.trim() || directory;
}

const root = checkoutRoot(sessionDirectory());
const projectDir = path.join(root, "devflow", "project");
const treeDir = path.join(root, "devflow", "tree");
const coordinatorContract = path.join(__dirname, "..", "skills", "principles", "coordinator.md");
const projectStateExists = ["product.md", "arch.md", "code-style.md", "design.md", "glossary.md"]
  .some((name) => fs.existsSync(path.join(projectDir, name)));

if (!fs.existsSync(treeDir) && !projectStateExists) process.exit(0);

const additionalContext = [
  "[devflow] Durable project state exists in this checkout.",
  "Run the devflow resume skill before any other devflow stage.",
  `If you dispatch another agent to perform a devflow stage in this checkout, read the coordinator role contract at ${coordinatorContract} before the first dispatch.`,
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext,
  },
}));
