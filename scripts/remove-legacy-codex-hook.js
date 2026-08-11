#!/usr/bin/env node
// Removes the pre-0.9.20 global devflow SessionStart registration. The native Codex
// plugin delivers the hook; leaving the old entry would execute the same hook twice.
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function isLegacyDevflowHook(hook) {
  const statusMessages = ["Loading devflow state", "Loading nano-devflow state"];
  if (hook.type !== "command" || !statusMessages.includes(hook.statusMessage) ||
      hook.timeout !== 15 || typeof hook.command !== "string") return false;
  const command = hook.command.trim();
  return [
    /^node(?:\.exe)?\s+"[^"\r\n]*[\\/]scripts[\\/]session-start\.js"\s*$/i,
    /^node(?:\.exe)?\s+'[^'\r\n]*[\\/]scripts[\\/]session-start\.js'\s*$/i,
    /^node(?:\.exe)?\s+[^\s"'\r\n]*[\\/]scripts[\\/]session-start\.js\s*$/i,
  ].some((pattern) => pattern.test(command));
}

function removeLegacyDevflowHook(root) {
  const groups = root && root.hooks && root.hooks.SessionStart;
  if (!Array.isArray(groups)) return 0;
  let removed = 0;
  const kept = [];
  for (const group of groups) {
    if (!Array.isArray(group && group.hooks)) {
      kept.push(group);
      continue;
    }
    const hooks = group.hooks.filter((hook) => {
      if (!isLegacyDevflowHook(hook)) return true;
      removed += 1;
      return false;
    });
    if (hooks.length) kept.push({ ...group, hooks });
  }
  if (!removed) return 0;
  if (kept.length) root.hooks.SessionStart = kept;
  else delete root.hooks.SessionStart;
  return removed;
}

function run() {
  const codexDir = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  const hooksPath = path.join(codexDir, "hooks.json");
  if (!fs.existsSync(hooksPath)) return;

  let root;
  try {
    root = JSON.parse(fs.readFileSync(hooksPath, "utf8"));
  } catch {
    console.warn("NOTE: could not remove the legacy devflow hook because hooks.json is invalid: " + hooksPath);
    return;
  }

  const removed = removeLegacyDevflowHook(root);
  if (!removed) return;
  fs.writeFileSync(hooksPath, JSON.stringify(root, null, 2) + "\n");
  console.log(`removed ${removed} legacy global devflow SessionStart registration(s)`);
}

if (require.main === module) run();

module.exports = { removeLegacyDevflowHook };
