#!/usr/bin/env node
// devflow SessionStart observes only cheap activation eligibility. Request classification
// belongs to principles after the user has supplied intent; resume owns workflow state.
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
  if (run.status !== 0 || !run.stdout) return null;
  return run.stdout.trim() || null;
}

const root = checkoutRoot(sessionDirectory());
if (!root) process.exit(0);

// This is the deliberately weaker, non-binding half of project-state's membership answer.
// It gates only a fixed pointer, never a route or file body, and therefore uses current files
// only: no index, history, project-state, or route lookup belongs in SessionStart.
const currentProduct = fs.existsSync(path.join(root, ".devflow", "project", "product.md"));
if (!currentProduct) process.exit(0);

const additionalContext = [
  "[devflow] A named devflow stage enters directly and reads shared policy from its own entry. When the user intends to operate, resume, recover, or inspect this project through devflow without naming a stage, run devflow:principles to classify the request and follow its route.",
  "If you were handed a devflow role contract, follow that contract directly; do not re-enter through principles or generic stage entry.",
  "Before dispatching another agent to perform a devflow stage in this project, read and follow devflow's `coordinator` role contract.",
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext,
  },
}));
