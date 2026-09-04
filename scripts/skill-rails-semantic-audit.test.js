#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test } = require("node:test");

const auditModule = import(pathToFileURL(path.join(__dirname, "skill-rails-semantic-audit.mjs")));

function write(root, relative, content) {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function fixture(t, { id = "sample", atoms = [], spec, scenarios = [{ s: { raw: "fixture" } }] } = {}) {
  const skillsRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-semantic-audit-")));
  t.after(() => fs.rmSync(skillsRoot, { recursive: true, force: true }));
  const defaultSpec = [
    "export const OBSERVATIONS = {};",
    "export const FORMATS = {};",
    "export const STAGES = {};",
  ].join("\n");
  write(skillsRoot, `${id}/spec.mjs`, spec ?? defaultSpec);
  write(skillsRoot, `${id}/body.md`, "## why: purpose\n\nFixture.\n");
  write(skillsRoot, `${id}/.skill-rails/obligation-ledger.json`, JSON.stringify({ atoms }));
  if (scenarios !== null) write(skillsRoot, `${id}/fixtures/scenarios.json`, JSON.stringify(scenarios));
  return { skillsRoot, id };
}

function atom(id, source, targets, disposition = "projected") {
  return { id, source, consequence: "low", disposition, targets };
}

function codes(findings) {
  return findings.map(row => row.code);
}

test("provenance fan-in is a review signal, not a package failure", async (t) => {
  const atoms = Array.from({ length: 21 }, (_, index) => atom(
    `migration-${index + 1}`,
    `migration:source-${index % 3}.md:${index + 1}`,
    ["spec:STAGES/run"],
  ));
  const { skillsRoot, id } = fixture(t, { atoms });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, true);
  assert.deepEqual(report.hardFailures, []);
  assert.ok(codes(report.advisories).includes("provenance-fan-in"));
  assert.equal(report.topFanIn[0].count, 21);
});

test("a repeated locator in one atom is counted as one semantic edge", async (t) => {
  const { skillsRoot, id } = fixture(t, {
    atoms: [atom("migration-1", "migration:source.md:1", ["spec:STAGES/run", "spec:STAGES/run"])],
  });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, true);
  assert.equal(report.topFanIn[0].count, 1);
  assert.equal(report.topFanIn[0].occurrences, 2);
  assert.equal(report.duplicateTargetLocators, 1);
  assert.ok(codes(report.advisories).includes("duplicate-target-locators"));
  assert.ok(!codes(report.advisories).includes("provenance-fan-in"));
});

test("explicitly unresolved provenance remains a hard failure", async (t) => {
  const { skillsRoot, id } = fixture(t, {
    atoms: [atom("migration-1", "migration:source.md:1", [], "review-required")],
  });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, false);
  assert.ok(codes(report.hardFailures).includes("review-required-atoms"));
});

test("a reserved migration placeholder is an incomplete artifact, not a prose preference", async (t) => {
  const spec = [
    "export const OBSERVATIONS = {};",
    "export const FORMATS = {};",
    "export const STAGES = { run: { atom: 'atom-migration-a17' } };",
  ].join("\n");
  const { skillsRoot, id } = fixture(t, { spec });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, false);
  assert.ok(codes(report.hardFailures).includes("placeholder-atom-declarations"));
  assert.ok(!codes(report.advisories).includes("placeholder-atom-declarations"));
});

test("a mechanical package recognizes a multiline collector declaration", async (t) => {
  const spec = [
    "export const OBSERVATIONS = {",
    "  'state.route': {",
    "    collector: 'state.route',",
    "    domain: ['ready', 'blocked'],",
    "  }, // a valid formatting choice must not change the audit result",
    "};",
    "export const FORMATS = {};",
    "export const STAGES = {};",
  ].join("\n");
  const { skillsRoot, id } = fixture(t, { id: "resume", spec });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, true);
  assert.equal(report.observations.collected, 1);
  assert.ok(!codes(report.hardFailures).includes("missing-mechanical-collector"));
});

test("a judgment-shaped progress completion is reported without dictating validity", async (t) => {
  const spec = [
    "const s = { flow: { done: false } };",
    "export const OBSERVATIONS = {",
    "  \"flow.done\": { decided: true },",
    "};",
    "export const FORMATS = {};",
    "export const STAGES = {",
    "  run: { done: s.flow.done, },",
    "};",
  ].join("\n");
  const { skillsRoot, id } = fixture(t, { spec });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  assert.equal(report.ok, true);
  assert.ok(codes(report.advisories).includes("judgment-drives-completion"));
});

test("every finding has a stable numeric count", async (t) => {
  const spec = [
    "const s = { flow: { done: false } };",
    "export const OBSERVATIONS = { 'flow.done': { decided: true } };",
    "export const FORMATS = {};",
    "export const STAGES = { run: { done: s.flow.done } };",
  ].join("\n");
  const { skillsRoot, id } = fixture(t, {
    spec,
    atoms: [atom("migration-1", "migration:source.md:1", [], "review-required")],
    scenarios: null,
  });
  const { auditPackage } = await auditModule;
  const report = await auditPackage(skillsRoot, id);

  for (const finding of [...report.hardFailures, ...report.advisories]) {
    assert.equal(Number.isInteger(finding.count), true, finding.code);
    assert.ok(finding.count > 0, finding.code);
  }
});

test("an explicitly requested package cannot disappear from the audit", async (t) => {
  const { skillsRoot } = fixture(t);
  const { auditRepository } = await auditModule;
  const result = await auditRepository(skillsRoot, ["missing"]);

  assert.equal(result.reports.length, 1);
  assert.equal(result.reports[0].ok, false);
  assert.ok(codes(result.reports[0].hardFailures).includes("missing-package-inputs"));
});
