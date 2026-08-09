#!/usr/bin/env node
// devflow SessionStart hook: injects tree state and HANDOFF into new sessions (start/resume/post-compact).
// Exits silently in projects without devflow (no devflow/tree).
// Multi mode (any devflow/users/*/owner.md): resolves my id via git config, scopes wip to my claim.
"use strict";
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

// --- multi-mode detection: any devflow/users/*/owner.md ---
// Parse failures degrade to "room not counted" — the hook must never crash a session.
const usersDir = path.join(cwd, "devflow", "users");
const rooms = []; // { id, idents: [git name/email strings] }
try {
  if (fs.existsSync(usersDir)) {
    for (const e of fs.readdirSync(usersDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const t = safeRead(path.join(usersDir, e.name, "owner.md"), 2000);
      if (!t) continue;
      const idm = t.match(/^id:\s*([a-z0-9]{2,8})\s*$/m);
      if (!idm) continue;
      const gitm = t.match(/^git:\s*(.+)$/m);
      const idents = gitm
        ? gitm[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean)
        : [];
      rooms.push({ id: idm[1], idents });
    }
  }
} catch {}
const multi = rooms.length > 0;

// --- identity resolution (multi only): git config name/email vs owner.md declarations ---
let myId = null;
if (multi) {
  let gitName = null, gitEmail = null;
  try { gitName = execSync("git config user.name", { cwd, timeout: 3000, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch {}
  try { gitEmail = execSync("git config user.email", { cwd, timeout: 3000, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch {}
  for (const r of rooms) {
    if (r.idents.some((x) => x && (x === gitName || x === gitEmail))) { myId = r.id; break; }
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
    if (e.isDirectory()) {
      if (/\.stale$/.test(e.name)) continue; // retired capability: inner card statuses are void
      walk(p, acc);
    } else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const files = walk(treeDir, []);
const rel = (p) => path.relative(cwd, p).replace(/\\/g, "/");
const wipRe = /\.wip(-([a-z0-9]{2,8}))?\.md$/;
const wipOwner = (p) => {
  const m = path.basename(p).match(wipRe);
  return m && m[2] ? m[2] : null;
};
const wip = files.filter((p) => wipRe.test(p));
const done = files.filter((p) => /\.done\.md$/.test(p));
const pending = files.filter((p) => !wipRe.test(p) && !/\.(done|stale)\.md$/.test(p) && path.basename(p) !== "verify.md");
const myWip = multi ? (myId ? wip.filter((p) => wipOwner(p) === myId) : []) : wip;
const otherWip = multi ? wip.filter((p) => !myWip.includes(p)) : [];
const bareWip = wip.filter((p) => wipOwner(p) === null);

const parts = [];
parts.push("[devflow] This project is managed with devflow. Tree state:");
parts.push(`- done ${done.length} / in progress ${wip.length} / pending ${pending.length}`);
if (multi) {
  parts.push(myId
    ? `- multi mode · my id: ${myId}`
    : "⚠ multi mode, identity unresolved (git config name/email matches no devflow/users/*/owner.md) — read-only until resolved; ask the user once, then create their room per the canonical rules (or match an existing one). Rooms: " + rooms.map((r) => r.id).join(", "));
}

// Integrity warning: duplicate card numbers (numbers are immutable identifiers; duplication = corruption)
const numOf = (p) => {
  const m = path.basename(p).match(/^(\d+(?:\.\d+)*[a-z]?)-/);
  return m ? m[1] : null;
};
const seen = new Map();
const dups = new Set();
for (const p of files) {
  if (path.basename(p) === "verify.md") continue;
  const n = numOf(p);
  if (!n) continue;
  if (seen.has(n)) dups.add(n);
  seen.set(n, p);
}
if (dups.size) parts.push(`⚠ duplicate numbers detected: ${[...dups].join(", ")} — integrity check needed (report, do not fix)`);
if (!multi) {
  if (wip.length > 1) parts.push(`⚠ ${wip.length} .wip. cards — an integrity anomaly unless parallelism or evidence-wait is recorded in journal`);
} else {
  if (bareWip.length) parts.push(`⚠ ${bareWip.length} bare .wip. card(s) in multi mode — ownerless claim or incomplete transition (report, do not fix)`);
  const perId = new Map();
  for (const p of wip) {
    const o = wipOwner(p);
    if (!o) continue;
    perId.set(o, (perId.get(o) || 0) + 1);
  }
  for (const [o, n] of perId) {
    if (n > 1) parts.push(`⚠ ${n} .wip-${o}. cards — an integrity anomaly unless parallelism or evidence-wait is recorded in journal`);
  }
}

// Identity paragraph (body before the first blank line within the first 20 lines of product.md)
const product = safeRead(path.join(cwd, "devflow", "project", "product.md"), 4000);
if (product) {
  const lines = product.split(/\r?\n/).slice(0, 20);
  const idx = lines.findIndex((l, i) => i > 0 && l.trim() === "" && lines.slice(1, i).some((x) => x.trim()));
  const identity = lines.slice(0, idx > 0 ? idx : 6).join("\n").trim();
  if (identity) parts.push("\nIdentity:\n" + identity);
}

if (myWip.length) {
  parts.push(multi ? "\nMy in-progress cards (read fully, then continue):" : "\nIn-progress cards (read fully, then continue):");
  for (const p of myWip) parts.push("- " + rel(p));
} else if (pending.length) {
  parts.push((multi ? "\nNo card of mine in progress." : "\nNo card in progress.") + " Next pending card example: " + rel(pending[0]));
}
if (otherWip.length) {
  parts.push("\nOthers' claims (read-only reference — never write these):");
  for (const p of otherWip) parts.push(`- ${rel(p)} (claimed by ${wipOwner(p) || "unknown"})`);
}

// HANDOFF: solo = devflow/HANDOFF.md; multi = my room's. A root HANDOFF.md in multi mode
// signals an incomplete solo→multi transition — inject it with a warning, never drop it silently.
// Truncation is never silent: the HANDOFF format ends with open decisions (human calls),
// so a cut tail must be flagged with an instruction to read the file in full.
const HANDOFF_MAX = 6000;
function readHandoff(p) {
  let t;
  try { t = fs.readFileSync(p, "utf8"); } catch { return null; }
  return t.length > HANDOFF_MAX ? { text: t.slice(0, HANDOFF_MAX), truncated: true } : { text: t, truncated: false };
}
const truncNote = (relPath) =>
  `⚠ HANDOFF exceeds ${HANDOFF_MAX} chars — truncated below; read ${relPath} in full (tail sections, e.g. open decisions, may be cut)`;
const rootHandoffPath = path.join(cwd, "devflow", "HANDOFF.md");
if (multi) {
  if (myId) {
    const h = readHandoff(path.join(usersDir, myId, "HANDOFF.md"));
    if (h && h.text.trim()) {
      if (h.truncated) parts.push("\n" + truncNote(`devflow/users/${myId}/HANDOFF.md`));
      parts.push("\nHANDOFF (my room):\n" + h.text.trim());
    }
  }
  const rootH = readHandoff(rootHandoffPath);
  if (rootH && rootH.text.trim()) {
    if (rootH.truncated) parts.push("\n" + truncNote("devflow/HANDOFF.md"));
    parts.push("\n⚠ devflow/HANDOFF.md exists in multi mode — incomplete solo→multi transition. Confirm its owner with the user, then finish the transition. Its content:\n" + rootH.text.trim());
  }
} else {
  const handoff = readHandoff(rootHandoffPath);
  if (handoff && handoff.text.trim()) {
    if (handoff.truncated) parts.push("\n" + truncNote("devflow/HANDOFF.md"));
    parts.push("\nHANDOFF:\n" + handoff.text.trim());
  }
}

parts.push("\nFollow the devflow resume skill to resume. Do not modify code before approval.");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: parts.join("\n"),
    },
  })
);
