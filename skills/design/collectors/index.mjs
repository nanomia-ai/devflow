import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

function root(ctx) {
  const value = ctx?.projectRoot ?? ctx?.project;
  return typeof value === "string" && value.length > 0 ? resolve(value) : null;
}
function text(path) { try { return readFileSync(path, "utf8"); } catch { return null; } }
function projectStateTool(ctx) {
  const declared = ctx?.projectStateTool;
  if (typeof declared === "string" && existsSync(declared)) return declared;
  const skillRoot = ctx?.skillRoot;
  const sibling = typeof skillRoot === "string" ? resolve(skillRoot, "..", "principles", "scripts", "project-state.mjs") : null;
  return sibling && existsSync(sibling) ? sibling : null;
}
async function canonicalState(ctx, projectRoot) {
  try {
    const tool = projectStateTool(ctx);
    if (tool === null) return null;
    const url = pathToFileURL(tool);
    url.searchParams.set("design_collector", "canonical");
    const module = await import(url.href);
    if (typeof module.calculateState !== "function") return null;
    const state = await module.calculateState({ root: projectRoot });
    if (state?.schema !== "devflow/project-state/2" || !state.route || !state.zones || !state.facts || !state.metadata) return null;
    return state;
  } catch { return null; }
}
function requests(state) {
  if (!Array.isArray(state.facts.existingRequests)) return null;
  const values = state.facts.existingRequests.map((value, index) => ({ value, index }))
    .filter(({ value }) => typeof value === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ maintenance routing pending: request-json:/.test(value));
  return values.length === state.facts.existingRequests.length
    ? values.sort((left, right) => left.value.slice(0, 20).localeCompare(right.value.slice(0, 20)) || left.index - right.index).map(({ value }) => value) : null;
}
async function maintenanceState(ctx, projectRoot) {
  const state = await canonicalState(ctx, projectRoot);
  if (state === null) return "unknown";
  const values = requests(state);
  return values === null ? "unknown" : values.length > 0 ? "current" : "none";
}
async function researchState(ctx, projectRoot) {
  try {
    const state = await canonicalState(ctx, projectRoot);
    if (state === null) return "unknown";
    const values = requests(state);
    if (values === null) return "unknown";
    if (values.length === 0) return "none";
    const origin = `journal:${values[0]}`;
    const entries = [...(state.zones.ready?.entries ?? []), ...(state.zones.claim?.entries ?? [])];
    const matches = entries.filter(entry => {
      const path = entry.file ?? entry.path;
      return typeof path === "string" && path.startsWith("devflow/tree/00-project/") && entry.origin === origin
        && /^# \d+\.\d+ Research:/.test(text(join(projectRoot, path)) ?? "");
    });
    if (matches.length > 1) return "unknown";
    if (matches.length === 0) return "none";
    return matches[0].approval === "effective" ? "effective" : matches[0].approval === "pending" ? "pending" : "unknown";
  } catch { return "unknown"; }
}
async function compatible(ctx, projectRoot) {
  const state = await canonicalState(ctx, projectRoot);
  const entries = state?.zones?.marker?.entries;
  if (!Array.isArray(entries)) return { owner: "invalid", landing: "invalid" };
  const marker = entries.find(entry => entry?.kind === "compatible-feedback" && entry?.writer === "design");
  if (!marker) return { owner: "none", landing: "none" };
  const owner = marker.owner === "devflow/project/design.md" ? "design" : "invalid";
  const landing = marker.landing === "satisfied" ? "satisfied" : marker.landing === "pending" ? "pending" : "invalid";
  return { owner, landing };
}
function fileState(ctx, local) {
  const projectRoot = root(ctx);
  return projectRoot === null ? "unknown" : existsSync(join(projectRoot, local)) ? "present" : "absent";
}

export const collectors = Object.freeze({
  "state.design-product": ctx => fileState(ctx, "devflow/project/product.md"),
  "state.design-arch": ctx => fileState(ctx, "devflow/project/arch.md"),
  "state.design-current": ctx => fileState(ctx, "devflow/project/design.md"),
  "state.design-tree": ctx => {
    const projectRoot = root(ctx);
    return projectRoot === null ? "unknown" : existsSync(join(projectRoot, "devflow/tree")) ? "present" : "absent";
  },
  "state.design-request-state": async ctx => {
    const projectRoot = root(ctx);
    return projectRoot === null ? "unknown" : maintenanceState(ctx, projectRoot);
  },
  "state.design-research-state": async ctx => {
    const projectRoot = root(ctx);
    return projectRoot === null ? "unknown" : researchState(ctx, projectRoot);
  },
  "state.compatible-owner": async ctx => {
    const projectRoot = root(ctx);
    return projectRoot === null ? "invalid" : (await compatible(ctx, projectRoot)).owner;
  },
  "state.compatible-landing": async ctx => {
    const projectRoot = root(ctx);
    return projectRoot === null ? "invalid" : (await compatible(ctx, projectRoot)).landing;
  },
  "state.design-frontend": ctx => {
    const projectRoot = root(ctx);
    if (projectRoot === null) return "unknown";
    const arch = text(join(projectRoot, "devflow/project/arch.md"));
    if (arch === null) return "unknown";
    return /^frontend:\s*none\s*$/mi.test(arch) ? "none" : "needed";
  }
});

export const snapshotBasis = null;
