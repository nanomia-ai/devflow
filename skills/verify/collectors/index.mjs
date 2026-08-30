import { realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unknown } from "../scripts/skill-rails/dsl.mjs";

// Verification consumes only the canonical state projection. It never reparses
// verification records, journals, cards, dependencies, or rendered output.
const packageRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
const migrationRoot = realpathSync(resolve(packageRoot, ".."));
const stateModule = await import(pathToFileURL(join(migrationRoot, "principles", "scripts", "project-state.mjs")).href);
const { calculateState } = stateModule;
const snapshots = new Map();

function explicitRoot(context) {
  const supplied = context?.projectRoot ?? context?.project;
  if (typeof supplied !== "string" || supplied.length === 0) return null;
  try { return realpathSync(resolve(supplied)); } catch { return null; }
}

async function stateFor(context) {
  const root = explicitRoot(context);
  if (!root || typeof calculateState !== "function") return null;
  if (!snapshots.has(root)) {
    snapshots.set(root, Promise.resolve(calculateState({ root })).then((state) => {
      if (!state?.zones
        || !Array.isArray(state?.compatibility?.evaluated?.verify?.records)
        || !Array.isArray(state?.compatibility?.evaluated?.verify?.prepared)) return null;
      return state;
    }).catch(() => null));
  }
  return snapshots.get(root);
}

function entries(state, zone, kind = null) {
  const value = state?.zones?.[zone]?.entries ?? [];
  return kind === null ? value : value.filter((entry) => entry.kind === kind);
}

function allEntries(state) {
  return Object.values(state?.zones ?? {}).flatMap((zone) => Array.isArray(zone?.entries) ? zone.entries : []);
}

function canonicalVerify(state) {
  return state?.compatibility?.evaluated?.verify ?? null;
}

function selectedRecord(state) {
  const verify = canonicalVerify(state);
  const records = verify?.records ?? [];
  if (records.length === 0) return { state: "missing", record: null };

  const recordPaths = new Set(records.map((record) => record.path));
  const selectedPaths = new Set(verify.prepared.map((item) => item.path));
  const selectedTargets = new Set();
  for (const entry of allEntries(state)) {
    if (recordPaths.has(entry.path)) selectedPaths.add(entry.path);
    if (entry.target === "product" || Number.isInteger(entry.target)) selectedTargets.add(entry.target);
  }
  const selected = records.filter((record) => selectedPaths.has(record.path) || selectedTargets.has(record.target));
  if (selected.length === 1) return { state: "selected", record: selected[0] };
  if (selected.length > 1) return { state: "mismatched", record: null };
  if (records.length === 1) return { state: "selected", record: records[0] };
  return { state: "mismatched", record: null };
}

function layer(state) {
  if (entries(state, "transition", "product-running").length || entries(state, "transition", "product-result").length
    || entries(state, "event", "product-requested").length) return "product";
  if (entries(state, "marker", "capability-closure").length) return "capability";
  return "invalid";
}
function transition(state) {
  if (canonicalVerify(state)?.prepared.length) return "prepared-route";
  if (entries(state, "transition", "interrupted").length) return "partial-write";
  if (entries(state, "transition", "product-running").length || entries(state, "transition", "product-result").length) return "interrupted-result";
  return "none";
}
function pendingEvent(state) {
  const pending = [...entries(state, "event", "pending"), ...entries(state, "event", "new")];
  if (pending.some((entry) => entry.role === "Retrospective")) return "retrospective";
  if (pending.length || entries(state, "transition", "event-routing").length || entries(state, "transition", "event-decision").length) return "audit";
  return "none";
}
function residual(state) { return entries(state, "marker", "knowledge-landing").length ? "owner-marker" : "none"; }

async function recordCurrent(context) {
  const selected = selectedRecord(await stateFor(context));
  if (selected.state !== "selected") return selected.state;
  return selected.record.current === true ? "current" : "stale";
}

async function recordFreshness(context) {
  const selected = selectedRecord(await stateFor(context));
  if (selected.state === "missing") return "current";
  return selected.state === "selected" && selected.record.current === true ? "current" : "stale";
}

async function executionEvidence(context) {
  const selected = selectedRecord(await stateFor(context));
  if (selected.state !== "selected") return "missing";
  return selected.record.current === true && selected.record.verdict === "pass" && selected.record.executed.trim().length > 0
    ? "current"
    : "missing";
}

export const collectors = Object.freeze({
  "verify/principles.verification-layer": async (context) => layer(await stateFor(context)),
  "verify/principles.transition": async (context) => transition(await stateFor(context)),
  "verify/principles.channel": async (context) => {
    const state = await stateFor(context);
    return !state ? unknown() : entries(state, "blocked", "channel").length ? "unavailable" : "available";
  },
  "verify/principles.residual-landing": async (context) => residual(await stateFor(context)),
  "verify/principles.pending-event": async (context) => pendingEvent(await stateFor(context)),
  "verify/record.freshness": recordFreshness,
  "verify/record.current": recordCurrent,
  "verify/record.execution-evidence": executionEvidence
});

export const snapshotBasis = null;
