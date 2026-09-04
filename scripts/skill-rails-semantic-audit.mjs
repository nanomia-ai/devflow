#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_ROOT = resolve(process.cwd(), "skills");
// Principles is deliberately state-free: it classifies conversational intent and
// routes stateful work once to resume. Requiring a project collector there would
// recreate the duplicated entry collectors the redesign removes.
const MECHANICAL_PACKAGES = new Set(["resume", "direct", "work", "verify"]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function finding(code, message, count = 1) {
  return { code, count, message };
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

function observationRows(spec, definitions) {
  return Object.entries(definitions).map(([name, definition]) => ({
    name,
    decided: definition?.decided === true,
    judged: definition?.judged === true,
    collector: typeof definition?.collector === "string" && definition.collector.length > 0,
    references: spec.split(name).length - 1,
  }));
}

function scenarioFacts(path) {
  if (!existsSync(path)) return { count: 0, raw: 0, decidedOnly: 0 };
  let scenarios;
  try { scenarios = readJson(path); }
  catch (error) { return { count: 0, raw: 0, decidedOnly: 0, parseError: error.message }; }
  if (!Array.isArray(scenarios)) {
    return { count: 0, raw: 0, decidedOnly: 0, parseError: "scenario root must be an array" };
  }
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

function markdownFiles(root, prefix) {
  if (!existsSync(root)) return [];
  const output = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        const name = `${prefix}/${relative(root, path).split(sep).join("/")}`;
        if (!name.includes("/legacy-atoms/")) {
          output.push({ name, text: readFileSync(path, "utf8") });
        }
      }
    }
  };
  walk(root);
  return output;
}

function hasCurrentSemanticTarget(target) {
  return /^(?:spec:|body:|file:templates\/|file:SKILL\.md$|file:agents\/)/.test(target)
    || /^file:references\/(?!legacy-atoms\/)/.test(target);
}

function missingPackageReport(id, missing) {
  const hardFailures = [finding(
    "missing-package-inputs",
    `missing required package inputs: ${missing.join(", ")}`,
    missing.length,
  )];
  return {
    id,
    ok: false,
    atoms: 0,
    reviewRequired: 0,
    targetCount: 0,
    hardFailures,
    advisories: [],
  };
}

export async function auditPackage(skillsRoot, id) {
  const root = join(skillsRoot, id);
  const specPath = join(root, "spec.mjs");
  const ledgerPath = join(root, ".skill-rails", "obligation-ledger.json");
  const missing = [
    ["spec.mjs", specPath],
    [".skill-rails/obligation-ledger.json", ledgerPath],
  ].filter(([, path]) => !existsSync(path)).map(([name]) => name);
  if (missing.length > 0) return missingPackageReport(id, missing);

  const spec = readFileSync(specPath, "utf8");
  const bodyPath = join(root, "body.md");
  const body = existsSync(bodyPath) ? readFileSync(bodyPath, "utf8") : "";
  const authoredTexts = [
    ["spec.mjs", spec],
    ["body.md", body],
    ...markdownFiles(join(root, "references"), "references").map(row => [row.name, row.text]),
    ...markdownFiles(join(root, "templates"), "templates").map(row => [row.name, row.text]),
  ];
  let ledger;
  try { ledger = readJson(ledgerPath); }
  catch (error) {
    const hardFailures = [finding("invalid-ledger-json", `invalid obligation ledger JSON: ${error.message}`)];
    return {
      id,
      ok: false,
      atoms: 0,
      reviewRequired: 0,
      targetCount: 0,
      hardFailures,
      advisories: [],
    };
  }
  let observationDefinitions = {};
  let specLoadError;
  try {
    const loadedSpec = await import(pathToFileURL(specPath).href);
    if (!loadedSpec.OBSERVATIONS || typeof loadedSpec.OBSERVATIONS !== "object" || Array.isArray(loadedSpec.OBSERVATIONS)) {
      throw new Error("OBSERVATIONS must be an object");
    }
    observationDefinitions = loadedSpec.OBSERVATIONS;
  } catch (error) {
    specLoadError = error.message;
  }

  const targetAtoms = new Map();
  for (const atom of ledger.atoms ?? []) {
    for (const target of atom.targets ?? []) {
      const row = targetAtoms.get(target) ?? { atoms: new Map(), occurrences: 0 };
      row.occurrences += 1;
      if (!row.atoms.has(atom.id)) row.atoms.set(atom.id, atom);
      targetAtoms.set(target, row);
    }
  }

  const reviewRequired = (ledger.atoms ?? []).filter(atom => atom.disposition === "review-required");
  const migrationAtomsWithoutCurrentSemanticTarget = (ledger.atoms ?? []).filter(atom =>
    atom.disposition === "projected"
    && String(atom.source ?? "").startsWith("migration:")
    && !(atom.targets ?? []).some(hasCurrentSemanticTarget)
  );
  const placeholderDeclarations = [
    ...(spec.match(/atom-migration-a\d+/g) ?? []),
    ...(spec.match(/distinct-projection:migration-a\d+/g) ?? []),
  ];
  const fanInLimit = Math.max(20, Math.ceil((ledger.atoms?.length ?? 0) * 0.10));
  const fanIn = [...targetAtoms.entries()]
    .map(([target, row]) => {
      const atoms = [...row.atoms.values()];
      return {
        target,
        count: atoms.length,
        occurrences: row.occurrences,
        duplicateLocators: row.occurrences - atoms.length,
        sources: [...new Set(atoms.map(sourceFamily))].sort(),
        high: atoms.filter(atom => atom.consequence === "high").length,
      };
    })
    .sort((left, right) => right.count - left.count || right.occurrences - left.occurrences);
  const duplicateTargetLocators = fanIn.reduce((sum, row) => sum + row.duplicateLocators, 0);
  const overloaded = fanIn.filter(row => row.count >= fanInLimit || (row.count >= 20 && row.sources.length > 2));
  const observations = observationRows(spec, observationDefinitions);
  const unusedObservations = observations.filter(row => row.references < 2);
  const progressName = /(^flow\.|\.(done|complete|opened|located|classified|contracted|proposed)$)/;
  const syntheticProgress = observations.filter(row => row.decided && progressName.test(row.name));
  const doneClauses = [...spec.matchAll(/\bdone\s*:\s*([^\n]+)/g)].map(match => match[1]);
  const judgmentDoneReads = observations
    .filter(row => row.decided || row.judged)
    .filter(row => doneClauses.some(clause => clause.includes(`s.${row.name}`)));
  const unsafeJudgmentDoneReads = judgmentDoneReads
    .filter(row => /(^flow\.|\.action$|\.(done|complete|opened|located|classified|contracted|proposed)$)/.test(row.name));
  const effectFreeNext = [...spec.matchAll(/:\s*\[\s*["']NEXT["']\s*\]/g)].length;
  const facts = scenarioFacts(join(root, "fixtures", "scenarios.json"));
  const collectorCount = observations.filter(row => row.collector).length;
  const decidedCount = observations.filter(row => row.decided).length;
  const danglingOwners = authoredTexts
    .filter(([, text]) => /external shared-policy owner|remains the external shared-policy owner/i.test(text))
    .map(([name]) => name);

  const hardFailures = [];
  const advisories = [];
  if (specLoadError) hardFailures.push(finding(
    "invalid-spec-module",
    `cannot load spec.mjs: ${specLoadError}`,
  ));
  if (reviewRequired.length > 0) hardFailures.push(finding(
    "review-required-atoms",
    `${reviewRequired.length} review-required atoms`,
    reviewRequired.length,
  ));
  if (facts.parseError) hardFailures.push(finding(
    "invalid-scenario-json",
    `invalid scenario JSON: ${facts.parseError}`,
  ));
  else if (facts.count === 0) hardFailures.push(finding("missing-scenarios", "no scenarios"));
  if (MECHANICAL_PACKAGES.has(id) && !specLoadError && collectorCount === 0) hardFailures.push(finding(
    "missing-mechanical-collector",
    "mechanical package has no collected observation",
  ));
  if (MECHANICAL_PACKAGES.has(id) && !facts.parseError && facts.raw === 0) hardFailures.push(finding(
    "missing-raw-fact-scenario",
    "mechanical package has no raw-fact scenario",
  ));
  if (placeholderDeclarations.length > 0) hardFailures.push(finding(
    "placeholder-atom-declarations",
    `${placeholderDeclarations.length} atom-id placeholder declarations`,
    placeholderDeclarations.length,
  ));
  if (migrationAtomsWithoutCurrentSemanticTarget.length > 0) advisories.push(finding(
    "migration-atoms-without-current-semantic-target",
    `${migrationAtomsWithoutCurrentSemanticTarget.length} projected migration atoms name no current semantic target`,
    migrationAtomsWithoutCurrentSemanticTarget.length,
  ));
  if (duplicateTargetLocators > 0) advisories.push(finding(
    "duplicate-target-locators",
    `${duplicateTargetLocators} duplicate atom-to-target locators`,
    duplicateTargetLocators,
  ));
  if (overloaded.length > 0) advisories.push(finding(
    "provenance-fan-in",
    `${overloaded.length} high-fan-in provenance targets merit semantic review`,
    overloaded.length,
  ));
  if (unusedObservations.length > 0) advisories.push(finding(
    "unused-observations",
    `${unusedObservations.length} observations appear unused`,
    unusedObservations.length,
  ));
  if (syntheticProgress.length > 0) advisories.push(finding(
    "synthetic-progress-observations",
    `${syntheticProgress.length} decided observations use progress-shaped names`,
    syntheticProgress.length,
  ));
  if (unsafeJudgmentDoneReads.length > 0) advisories.push(finding(
    "judgment-drives-completion",
    `${unsafeJudgmentDoneReads.length} action/progress judgments drive stage completion`,
    unsafeJudgmentDoneReads.length,
  ));
  if (effectFreeNext > 0) advisories.push(finding(
    "effect-free-next-branches",
    `${effectFreeNext} effect-free NEXT branches`,
    effectFreeNext,
  ));
  if (danglingOwners.length > 0) advisories.push(finding(
    "possible-dangling-policy-owner",
    `${danglingOwners.length} files may retain dangling external policy owners`,
    danglingOwners.length,
  ));

  return {
    id,
    ok: hardFailures.length === 0,
    atoms: ledger.atoms?.length ?? 0,
    reviewRequired: reviewRequired.length,
    migrationAtomsWithoutCurrentSemanticTarget: migrationAtomsWithoutCurrentSemanticTarget.length,
    targetCount: targetAtoms.size,
    fanInLimit,
    overloaded,
    duplicateTargetLocators,
    placeholderDeclarations: placeholderDeclarations.length,
    danglingOwners,
    observations: {
      total: observations.length,
      collected: collectorCount,
      decided: decidedCount,
      unused: unusedObservations.map(row => row.name),
      syntheticProgress: syntheticProgress.map(row => row.name),
      judgmentDoneReads: judgmentDoneReads.map(row => row.name),
      unsafeJudgmentDoneReads: unsafeJudgmentDoneReads.map(row => row.name),
    },
    effectFreeNext,
    scenarios: facts,
    hardFailures,
    advisories,
    topFanIn: fanIn.slice(0, 12),
  };
}

export async function auditRepository(skillsRoot = DEFAULT_ROOT, requested = []) {
  if (!existsSync(skillsRoot)) throw new Error(`missing migration root: ${skillsRoot}`);
  const ids = requested.length > 0
    ? requested
    : readdirSync(skillsRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith("."))
      .filter(entry => existsSync(join(skillsRoot, entry.name, "spec.mjs"))
        || existsSync(join(skillsRoot, entry.name, ".skill-rails", "obligation-ledger.json")))
      .map(entry => entry.name)
      .sort();
  const reports = await Promise.all(ids.map(id => auditPackage(skillsRoot, id)));
  return {
    schema: "devflow/skill-rails-semantic-audit/2",
    reports,
  };
}

async function main() {
  let result;
  try { result = await auditRepository(DEFAULT_ROOT, process.argv.slice(2)); }
  catch (error) {
    console.error(error.message);
    process.exit(2);
  }
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.reports.every(report => report.ok) ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
