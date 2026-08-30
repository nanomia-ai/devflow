#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "skills");
// Principles is deliberately state-free: it classifies conversational intent and
// routes stateful work once to resume. Requiring a project collector there would
// recreate the duplicated entry collectors the redesign removes.
const MECHANICAL_PACKAGES = new Set(["resume", "split", "work", "verify"]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sourceFamily(atom) {
  const source = atom.source ?? "unknown";
  if (!source.startsWith("migration:")) return source.split(":", 1)[0];
  // Korean and English files are one canonical source pair, not independent
  // evidence families. Counting them twice falsely labels faithful 1:1
  // projections as semantic fan-in.
  return basename(source.slice("migration:".length).split(":", 1)[0])
    .replace(/_ko(?=\.[^.]+$)/, "");
}

function observationRows(spec) {
  const start = spec.indexOf("export const OBSERVATIONS");
  const end = spec.indexOf("export const FORMATS", start);
  if (start < 0 || end < 0) return [];
  const block = spec.slice(start, end);
  const rows = [];
  const rowPattern = /["']([^"']+)["']\s*:\s*\{([^\n]+)\}/g;
  for (const match of block.matchAll(rowPattern)) {
    rows.push({
      name: match[1],
      decided: /\bdecided\s*:\s*true\b/.test(match[2]),
      judged: /\bjudged\s*:\s*true\b/.test(match[2]),
      collector: /\bcollector\s*:/.test(match[2]),
      references: spec.split(match[1]).length - 1,
    });
  }
  return rows;
}

function scenarioFacts(path) {
  if (!existsSync(path)) return { count: 0, raw: 0, decidedOnly: 0 };
  let scenarios;
  try { scenarios = readJson(path); }
  catch (error) { return { count: 0, raw: 0, decidedOnly: 0, parseError: error.message }; }
  let raw = 0;
  let decidedOnly = 0;
  for (const scenario of scenarios) {
    const rawKeys = Object.keys(scenario.s ?? {});
    const decidedKeys = Object.keys(scenario.decided ?? {});
    if (rawKeys.length > 0) raw += 1;
    if (rawKeys.length === 0 && decidedKeys.length > 0) decidedOnly += 1;
  }
  return { count: scenarios.length, raw, decidedOnly };
}

function auditPackage(id) {
  const root = join(ROOT, id);
  const specPath = join(root, "spec.mjs");
  const ledgerPath = join(root, ".skill-rails", "obligation-ledger.json");
  if (!existsSync(specPath) || !existsSync(ledgerPath)) return null;

  const spec = readFileSync(specPath, "utf8");
  const bodyPath = join(root, "body.md");
  const body = existsSync(bodyPath) ? readFileSync(bodyPath, "utf8") : "";
  const referenceRoot = join(root, "references");
  const referenceTexts = existsSync(referenceRoot)
    ? readdirSync(referenceRoot, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
      .map(entry => ({ name: entry.name, text: readFileSync(join(referenceRoot, entry.name), "utf8") }))
    : [];
  let ledger;
  try { ledger = readJson(ledgerPath); }
  catch (error) {
    return {
      id,
      ok: false,
      atoms: 0,
      reviewRequired: 0,
      targetCount: 0,
      failures: [`invalid obligation ledger JSON: ${error.message}`],
    };
  }
  const targetAtoms = new Map();
  for (const atom of ledger.atoms ?? []) {
    for (const target of atom.targets ?? []) {
      const list = targetAtoms.get(target) ?? [];
      list.push(atom);
      targetAtoms.set(target, list);
    }
  }

  const reviewRequired = (ledger.atoms ?? []).filter(atom => atom.disposition === "review-required");
  const semanticTarget = /^(spec:|body:|file:references\/|file:templates\/|file:SKILL\.md$|file:agents\/)/;
  const evidenceOnlyAtoms = (ledger.atoms ?? []).filter(atom =>
    atom.disposition === "projected"
    && String(atom.source ?? "").startsWith("migration:")
    && !(atom.targets ?? []).some(target => semanticTarget.test(target))
  );
  const placeholderDeclarations = [
    ...(spec.match(/atom-migration-a\d+/g) ?? []),
    ...(spec.match(/distinct-projection:migration-a\d+/g) ?? []),
  ];
  const fanInLimit = Math.max(20, Math.ceil((ledger.atoms?.length ?? 0) * 0.10));
  const fanIn = [...targetAtoms.entries()]
    .map(([target, atoms]) => ({
      target,
      count: atoms.length,
      sources: [...new Set(atoms.map(sourceFamily))].sort(),
      high: atoms.filter(atom => atom.consequence === "high").length,
    }))
    .sort((left, right) => right.count - left.count);
  const overloaded = fanIn.filter(row => row.count >= fanInLimit || (row.count >= 20 && row.sources.length > 2));
  const observations = observationRows(spec);
  const unusedObservations = observations.filter(row => row.references < 2);
  const syntheticProgress = observations.filter(row => row.decided && /(^flow\.|\.(done|complete|opened|located|classified|contracted|proposed)$)/.test(row.name));
  const doneClauses = [...spec.matchAll(/\bdone\s*:\s*([^\n]+)/g)].map(match => match[1]);
  const judgmentDoneReads = observations
    .filter(row => row.decided || row.judged)
    .filter(row => doneClauses.some(clause => clause.includes(`s.${row.name}`)));
  const unsafeJudgmentDoneReads = judgmentDoneReads.filter(row => /(^flow\.|\.action$|\.(done|complete|opened|located|classified|contracted|proposed)$)/.test(row.name));
  const effectFreeNext = [...spec.matchAll(/:\s*\[\s*["']NEXT["']\s*\]/g)].length;
  const facts = scenarioFacts(join(root, "fixtures", "scenarios.json"));
  const collectorCount = observations.filter(row => row.collector).length;
  const decidedCount = observations.filter(row => row.decided).length;

  const failures = [];
  const danglingOwners = [];
  for (const [name, text] of [["spec.mjs", spec], ["body.md", body], ...referenceTexts.map(row => [`references/${row.name}`, row.text])]) {
    if (/external shared-policy owner|remains the external shared-policy owner/i.test(text)) danglingOwners.push(name);
  }
  if (reviewRequired.length > 0) failures.push(`${reviewRequired.length} review-required atoms`);
  if (evidenceOnlyAtoms.length > 0) failures.push(`${evidenceOnlyAtoms.length} migration atoms have evidence-only targets`);
  if (placeholderDeclarations.length > 0) failures.push(`${placeholderDeclarations.length} atom-id placeholder declarations`);
  if (overloaded.length > 0) failures.push(`${overloaded.length} overloaded provenance targets require semantic review`);
  if (unusedObservations.length > 0) failures.push(`${unusedObservations.length} unused observations`);
  if (syntheticProgress.length > 0) failures.push(`${syntheticProgress.length} synthetic decided progress observations`);
  if (unsafeJudgmentDoneReads.length > 0) failures.push(`${unsafeJudgmentDoneReads.length} action/progress judgments drive stage completion`);
  if (effectFreeNext > 0) failures.push(`${effectFreeNext} effect-free NEXT branches`);
  if (facts.count === 0) failures.push("no scenarios");
  if (facts.parseError) failures.push(`invalid scenario JSON: ${facts.parseError}`);
  if (MECHANICAL_PACKAGES.has(id) && collectorCount === 0) failures.push("mechanical package has no collected observation");
  if (MECHANICAL_PACKAGES.has(id) && facts.raw === 0) failures.push("mechanical package has no raw-fact scenario");
  if (danglingOwners.length > 0) failures.push(`${danglingOwners.length} files retain dangling external policy owners`);

  return {
    id,
    ok: failures.length === 0,
    atoms: ledger.atoms?.length ?? 0,
    reviewRequired: reviewRequired.length,
    evidenceOnlyAtoms: evidenceOnlyAtoms.length,
    targetCount: targetAtoms.size,
    fanInLimit,
    overloaded,
    placeholderDeclarations: placeholderDeclarations.length,
    danglingOwners,
    observations: { total: observations.length, collected: collectorCount, decided: decidedCount, unused: unusedObservations.map(row => row.name), syntheticProgress: syntheticProgress.map(row => row.name), judgmentDoneReads: judgmentDoneReads.map(row => row.name), unsafeJudgmentDoneReads: unsafeJudgmentDoneReads.map(row => row.name) },
    effectFreeNext,
    scenarios: facts,
    failures,
    topFanIn: fanIn.slice(0, 12),
  };
}

if (!existsSync(ROOT)) {
  console.error(`missing migration root: ${ROOT}`);
  process.exit(2);
}

const requested = process.argv.slice(2);
const ids = requested.length > 0
  ? requested
  : readdirSync(ROOT, { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith(".")).map(entry => entry.name).sort();
const reports = ids.map(auditPackage).filter(Boolean);
console.log(JSON.stringify({ schema: "devflow/skill-rails-semantic-audit/1", reports }, null, 2));
process.exit(reports.every(report => report.ok) ? 0 : 1);
