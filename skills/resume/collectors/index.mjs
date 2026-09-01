import { realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unknown } from "../scripts/skill-rails/dsl.mjs";

// Resume is the only stateful entry after principles classification.  The text
// command is deliberately not an input: it is a compatibility projection, while
// calculateState is the schema-2 contract consumed here.
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
      if (state?.schema !== "devflow/project-state/2" || !state.route || !state.zones || !state.facts || !state.metadata) return null;
      return state;
    }).catch(() => null));
  }
  return snapshots.get(root);
}

function route(state) { return state?.route?.id ?? "unrecognized"; }
function brownfield(state) {
  const value = state?.metadata?.brownfield;
  return value === "yes" || value === "no" ? value : unknown();
}

function compatibleWriter(state) {
  if (route(state) !== "marker.compatible-feedback") return "none";
  const entries = state?.zones?.marker?.entries;
  if (!Array.isArray(entries)) return "invalid";
  const marker = entries.find((entry) => entry?.kind === "compatible-feedback");
  return ["product", "design", "arch", "adopt"].includes(marker?.writer) ? marker.writer : "invalid";
}

export const collectors = Object.freeze({
  "state.canonical-next": async (context) => route(await stateFor(context)),
  "state.brownfield": async (context) => brownfield(await stateFor(context)),
  "state.compatible-writer": async (context) => compatibleWriter(await stateFor(context)),
  "state.schema": async (context) => (await stateFor(context)) ? "schema-2" : "unavailable",
  "state.route": async (context) => route(await stateFor(context)),
  "state.zones": async (context) => (await stateFor(context)) ? "available" : "unavailable",
  "state.facts": async (context) => (await stateFor(context)) ? "available" : "unavailable"
});

export const snapshotBasis = null;
