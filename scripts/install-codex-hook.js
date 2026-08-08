#!/usr/bin/env node
// Registers the devflow SessionStart hook in ~/.codex/hooks.json.
// Idempotent: replaces an existing devflow entry, appends otherwise,
// and never touches entries owned by other tools.
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

const MARKER = "devflow"; // identifies our entry among others ("nano-devflow" era entries also match)
const scriptPath = path.join(__dirname, "session-start.js");
const codexDir = path.join(os.homedir(), ".codex");
const hooksPath = path.join(codexDir, "hooks.json");

if (!fs.existsSync(codexDir)) {
  console.error("~/.codex not found — is Codex CLI installed? Skipping hook registration.");
  process.exit(0);
}

let root = { hooks: {} };
if (fs.existsSync(hooksPath)) {
  try {
    root = JSON.parse(fs.readFileSync(hooksPath, "utf8"));
  } catch (e) {
    console.error("hooks.json is not valid JSON — refusing to modify it. Fix it first: " + hooksPath);
    process.exit(1);
  }
}
if (!root.hooks) root.hooks = {};
if (!Array.isArray(root.hooks.SessionStart)) root.hooks.SessionStart = [];

const entry = {
  hooks: [
    {
      type: "command",
      // marker comment travels inside the command string so we can find our entry later
      command: `node "${scriptPath}"`,
      timeout: 15,
      statusMessage: "Loading devflow state",
    },
  ],
};

const isOurs = (g) =>
  Array.isArray(g.hooks) &&
  g.hooks.some((h) => typeof h.command === "string" && (h.command.includes(MARKER) || h.command.includes("session-start.js")));

const idx = root.hooks.SessionStart.findIndex(isOurs);
if (idx >= 0) {
  root.hooks.SessionStart[idx] = entry;
  console.log("hook updated: SessionStart (devflow)");
} else {
  root.hooks.SessionStart.push(entry);
  console.log("hook registered: SessionStart (devflow)");
}

fs.writeFileSync(hooksPath, JSON.stringify(root, null, 2) + "\n");

// Check the feature flag — hooks are off by default in Codex.
const configPath = path.join(codexDir, "config.toml");
let flagOn = false;
if (fs.existsSync(configPath)) {
  const toml = fs.readFileSync(configPath, "utf8");
  flagOn = /^\s*hooks\s*=\s*true/m.test(toml);
}
if (!flagOn) {
  console.log("NOTE: enable hooks in ~/.codex/config.toml:\n  [features]\n  hooks = true");
} else {
  console.log("feature flag OK: [features] hooks = true");
}
