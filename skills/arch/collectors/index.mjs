import { realpath } from "node:fs/promises";

const siblingStateModule = new URL("../../principles/scripts/project-state.mjs", import.meta.url);
let siblingStatePromise;
const byContext = new WeakMap();

async function siblingCalculateState() {
  siblingStatePromise ??= import(siblingStateModule.href).then((module) => module.calculateState);
  const calculateState = await siblingStatePromise;
  if (typeof calculateState !== "function") throw new TypeError("Sibling principles must export calculateState.");
  return calculateState;
}

async function canonicalState(context) {
  if (!context || typeof context !== "object") return null;
  if (!byContext.has(context)) {
    byContext.set(context, (async () => {
      const supplied = context.projectRoot ?? context.project;
      if (typeof supplied !== "string" || supplied.length === 0) return null;
      try {
        const root = await realpath(supplied);
        const calculateState = await siblingCalculateState();
        const state = await calculateState({ root });
        if (state?.schema !== "devflow/project-state/2" || !state.route || !state.zones || !state.metadata) return null;
        return state;
      } catch {
        return null;
      }
    })());
  }
  return byContext.get(context);
}

function routeOf(state) {
  const id = state?.route?.id;
  if (id === "none") return "none";
  const direct = new Set([
    "git.open-operation", "integrity.blocking", "integrity.shape",
    "marker.glossary-term", "marker.design-note", "marker.design-open-item", "marker.knowledge-landing",
    "setup.no-product", "setup.layer0-incomplete", "setup.brownfield-field", "setup.integration-config",
    "baseline.legacy-v010", "baseline.design-refresh", "baseline.boundary",
    "complete.product-pass", "complete.adoption"
  ]);
  if (direct.has(id)) return id;
  if (typeof id !== "string" || id.length === 0) return "unrecognized";
  return "owned-elsewhere";
}

function snapshotOf(state) {
  return state?.compatibility?.snapshot ?? null;
}

function field(snapshot, name) {
  return snapshot?.archFields instanceof Map ? snapshot.archFields.get(name) : undefined;
}

function markerEntries(state, kind) {
  const entries = state?.zones?.marker?.entries;
  return Array.isArray(entries) ? entries.filter((entry) => entry?.kind === kind) : [];
}

async function kernel(context) {
  return await canonicalState(context) === null ? "unavailable" : "available";
}

async function route(context) {
  return routeOf(await canonicalState(context));
}

async function brownfield(context) {
  const value = field(snapshotOf(await canonicalState(context)), "Brownfield");
  return value === "yes" ? "yes" : value === "no" ? "no" : "unknown";
}

async function code(context) {
  const value = snapshotOf(await canonicalState(context))?.revisions?.code;
  return value === "none" ? "none" : typeof value === "string" && value.length > 0 ? "present" : "unknown";
}

async function frontend(context) {
  const value = field(snapshotOf(await canonicalState(context)), "frontend");
  return value === "none" ? "none" : value === "needed" ? "needed" : "unknown";
}

async function worktrees(context) {
  const count = snapshotOf(await canonicalState(context))?.worktrees;
  return Number.isInteger(count) && count === 1 ? "one" : Number.isInteger(count) && count > 1 ? "many" : "unknown";
}

async function layer0(context) {
  const state = await canonicalState(context);
  if (state === null) return "unknown";
  const setup = state.zones?.setup?.entries;
  if (!Array.isArray(setup)) return "unknown";
  return setup.some((entry) => ["no-product", "layer0-incomplete", "brownfield-field", "integration-config"].includes(entry?.kind)) ? "incomplete" : "current";
}

async function capabilities(context) {
  const baseline = snapshotOf(await canonicalState(context))?.baseline;
  const summary = baseline?.summary;
  if (!summary || !Number.isInteger(summary.expected)) return "unknown";
  if (summary.expected === 0) return "current";
  const records = Array.isArray(baseline.records) ? baseline.records : [];
  if (records.some((record) => record?.headExists !== true)) return "missing";
  return summary.designRefresh > 0 || summary.legacyV010 > 0 || summary.boundary !== "ok" ? "refresh" : "current";
}

async function expected(context) {
  const value = snapshotOf(await canonicalState(context))?.baseline?.summary?.expected;
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

async function knowledgeMarkers(context) {
  const entries = markerEntries(await canonicalState(context), "knowledge-landing")
    .map(({ owner, writer, source, timestamp }) => ({ owner, writer, source, timestamp }));
  return entries.length === 0 ? "none" : JSON.stringify(entries);
}

async function knowledgeMarkerCount(context) {
  return markerEntries(await canonicalState(context), "knowledge-landing").length;
}

export const collectors = Object.freeze({
  "state.arch-kernel": kernel,
  "state.arch-route": route,
  "state.arch-brownfield": brownfield,
  "state.arch-code": code,
  "state.arch-frontend": frontend,
  "state.arch-worktrees": worktrees,
  "state.arch-layer0": layer0,
  "state.arch-capabilities": capabilities,
  "state.arch-expected": expected,
  "knowledge.arch-markers": knowledgeMarkers,
  "knowledge.arch-marker-count": knowledgeMarkerCount
});

export const snapshotBasis = null;
