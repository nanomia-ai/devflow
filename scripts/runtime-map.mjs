#!/usr/bin/env node

// Read-only projection of the nine P2 specs: what each skill's stages, guards, declared roles and
// routes currently are. Nothing is committed — prose must not restate this shape, it calls this.
// The consumers are usecase-matrix §3 re-judgment, audit coverage, and the design.md role row.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  let skill = null;
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag === "--skill") {
      if (value === undefined || value.startsWith("--")) fail("--skill requires a package name");
      skill = value;
      index += 1;
    } else {
      fail(`unknown option ${flag}`);
    }
  }
  return { skill };
}

function terminals(stage) {
  const seen = new Set();
  const text = JSON.stringify(stage, (key, value) => (typeof value === "function" ? "fn" : value));
  for (const match of text.matchAll(/"ROUTE:([a-z-]+)"/g)) seen.add(match[1]);
  for (const match of text.matchAll(/"(DONE|WAIT|HUMAN)"/g)) seen.add(match[1]);
  return [...seen];
}

function roleLines(roles) {
  const lines = [];
  for (const [id, role] of Object.entries(roles ?? {})) {
    const parts = [];
    if (Array.isArray(role?.inputs)) parts.push(`inputs ${role.inputs.length}`);
    if (Array.isArray(role?.reads)) parts.push(`reads ${role.reads.length}`);
    if (Array.isArray(role?.judgments)) parts.push(`judgments ${role.judgments.join("|")}`);
    if (role?.template) parts.push(`template ${role.template}`);
    lines.push(`  role ${id}${parts.length ? ` — ${parts.join(" · ")}` : ""}`);
  }
  return lines;
}

async function main() {
  const { skill } = parseArguments(process.argv.slice(2));
  const root = process.cwd();
  const skillsDir = path.join(root, "skills");
  if (!fs.existsSync(skillsDir)) fail("skills/ is missing; run from the repository root");
  const packages = fs.readdirSync(skillsDir)
    .filter((name) => fs.existsSync(path.join(skillsDir, name, "spec.mjs")))
    .filter((name) => !skill || name === skill)
    .sort();
  if (packages.length === 0) fail(skill ? `no spec.mjs for ${skill}` : "no P2 packages found");

  const lines = ["# Runtime map", "",
    "Generated from `skills/*/spec.mjs`. Read-only; nothing here is committed.", ""];
  let stageTotal = 0;
  let guardTotal = 0;
  let roleTotal = 0;
  for (const name of packages) {
    const module = await import(pathToFileURL(path.join(skillsDir, name, "spec.mjs")).href);
    const stages = module.STAGES ?? [];
    const guards = module.GUARDS ?? [];
    const roles = module.ROLES ?? {};
    stageTotal += stages.length;
    guardTotal += guards.length;
    roleTotal += Object.keys(roles).length;
    lines.push(`## ${name}  —  ${stages.length} stages · ${guards.length} guards · ${Object.keys(roles).length} roles`);
    for (const guard of guards) {
      const stop = guard?.stop ? ` (${guard.stop})` : "";
      lines.push(`  guard ${guard.id}${stop}`);
    }
    for (const stage of stages) {
      const routes = terminals(stage);
      lines.push(`  stage ${stage.id}${routes.length ? ` -> ${routes.join(", ")}` : ""}`);
    }
    lines.push(...roleLines(roles));
    lines.push("");
  }
  lines.push(`total: ${packages.length} packages · ${stageTotal} stages · ${guardTotal} guards · ${roleTotal} declared roles`);
  process.stdout.write(`${lines.join("\n")}\n`);
}

try {
  await main();
} catch (error) {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
}
