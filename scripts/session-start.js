#!/usr/bin/env node
// devflow SessionStart hook: activates resume without interpreting checkout state.
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const cwd = process.cwd();
const projectDir = path.join(cwd, "devflow", "project");
const treeDir = path.join(cwd, "devflow", "tree");
const projectStateExists = ["product.md", "arch.md", "code-style.md", "design.md", "glossary.md"]
  .some((name) => fs.existsSync(path.join(projectDir, name)));

if (!fs.existsSync(treeDir) && !projectStateExists) process.exit(0);

const additionalContext = [
  "[devflow] Durable project state exists in this checkout.",
  "Run the devflow resume skill before any other devflow stage.",
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext,
  },
}));
