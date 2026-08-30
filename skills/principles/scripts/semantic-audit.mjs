#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectors } from "../collectors/index.mjs";
import { DECLARATIONS, FORMATS, OBSERVATIONS, READ_FIRST, ROLES, STAGES, TEMPLATES } from "../spec.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const classify = STAGES.find((stage) => stage.id === "classify");
const checks = [];
const check = (name, action) => { action(); checks.push(name); };

check("state-free-observations", () => {
  assert.deepEqual(Object.keys(collectors), []);
  const text = JSON.stringify(OBSERVATIONS);
  for (const forbidden of ["project-state", "journal", "card", "dependency", "sibling", "route."]) {
    assert.equal(text.includes(forbidden), false, forbidden);
  }
});

check("single-resume-route", () => {
  for (const [name, effects] of Object.entries(classify.branches).filter(([name]) => name.startsWith("normal-"))) {
    assert.deepEqual(effects, ["ROUTE:resume"], name);
  }
  assert.equal(JSON.stringify(classify.branches).includes("ROUTE:principles"), false);
});

check("tweak-cost", () => {
  const effects = classify.branches.tweak.filter(Array.isArray);
  assert.equal(effects.filter(([verb]) => verb === "COMMIT").length, 1);
  assert.match(DECLARATIONS.tweak_lane.value, /card=0, K=0, journal=0/);
});

check("role-bypass", () => {
  assert.ok(Object.keys(ROLES).length > 0);
  for (const role of Object.values(ROLES)) assert.equal(Object.hasOwn(role, "reads"), false);
});

check("accepted-redesign-boundary", () => {
  assert.match(DECLARATIONS.knowledge_landing.value, /no residual object, route, token, or batch/);
  assert.match(DECLARATIONS.research_entry.value, /canonical heading is '# NN\.N Research:/);
  assert.match(JSON.stringify(FORMATS.knowledgeLandingPending), /source-json/);
});

check("portable-references", () => {
  for (const item of READ_FIRST) assert.equal(fs.existsSync(path.join(root, ...item.path.split("/"))), true, item.path);
});

check("immutable-format-owner-matrix", () => {
  const grammarPath = path.join(root, "templates", "canonical-journal-progress-grammar.md");
  const grammar = fs.readFileSync(grammarPath, "utf8");
  const formatOwners = ["maintenanceRoutingPending", "productReRunPending", "productVerificationRequested", "productVerificationRunning", "productVerificationResult", "capabilityClosing", "capabilityNote", "knowledgeLandingPending", "completionSignalResult", "reviewResult"];
  const guidanceHeads = ["layer opening:", "re-split pending:", "audit requested:", "retrospective requested:", "capability note:", "evidence-wait:", "evidence-finalizing:", "remote evidence check:", "carry:"];
  assert.deepEqual(Object.keys(FORMATS).sort(), [...formatOwners].sort());
  assert.equal(TEMPLATES.canonicalJournalProgressGrammar.file, "templates/canonical-journal-progress-grammar.md");
  for (const head of guidanceHeads) assert.equal(grammar.includes(head), true, head);
  assert.equal(READ_FIRST.some((item) => item.path === "templates/canonical-journal-progress-grammar.md"), true);
  assert.equal(DECLARATIONS.canonical_format_ownership.consumer.includes("project-state"), true);
});

const scenarios = JSON.parse(fs.readFileSync(path.join(root, "fixtures", "scenarios.json"), "utf8"));
process.stdout.write(`semantic-audit: pass checks=${checks.length} scenarios=${scenarios.length}\n`);
