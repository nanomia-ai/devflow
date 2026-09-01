import { readdir, realpath, stat } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

const stateModule = new URL("../../principles/scripts/project-state.mjs", import.meta.url);
const cache = new WeakMap();
const codeExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".go", ".rs", ".java", ".rb", ".php", ".cs"]);

async function state(context) {
  if (!context || typeof context !== "object") return null;
  if (!cache.has(context)) cache.set(context, (async () => {
    const supplied = context.projectRoot ?? context.project;
    if (typeof supplied !== "string" || supplied.length === 0) return null;
    try {
      const root = await realpath(resolve(supplied));
      const { calculateState } = await import(stateModule.href);
      const value = await calculateState({ root });
      return value?.schema === "devflow/project-state/2" && value?.metadata?.root === root ? { root, value } : null;
    } catch { return null; }
  })());
  return cache.get(context);
}
async function walk(root, visitor, prefix = "") {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if ([".git", "node_modules", "devflow", ".skill-rails"].includes(entry.name)) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = join(root, entry.name);
    if (entry.isDirectory()) await walk(absolute, visitor, rel);
    else if (entry.isFile()) visitor(rel, entry.name);
  }
}
async function inventory(context) {
  const current = await state(context); if (!current) return "unknown";
  let count = 0; await walk(current.root, (path, name) => { if (codeExtensions.has(name.slice(name.lastIndexOf(".")).toLowerCase())) count += 1; });
  return count > 0 ? "present" : "missing";
}
async function flow(context) { return (await inventory(context)) === "present" ? "present" : "missing"; }
async function records(context) {
  const current = await state(context); if (!current) return "unknown";
  let found = false; await walk(current.root, (path, name) => { if (/^(docs|specs)\//.test(path) || /^readme/i.test(name)) found = true; });
  return found ? "present" : "none";
}
function routeOf(value) {
  const id = value?.route?.id;
  const allowed = new Set(["none", "git.open-operation", "integrity.blocking", "marker.knowledge-landing", "marker.compatible-feedback", "marker.design-note", "marker.design-open-item", "setup.no-product", "setup.layer0-incomplete", "baseline.design-refresh", "baseline.legacy-v010", "baseline.boundary", "complete.adoption"]);
  return allowed.has(id) ? id : "owned-elsewhere";
}
async function compatible(context) {
  const entries = (await state(context))?.value?.zones?.marker?.entries;
  if (!Array.isArray(entries)) return { owner: "invalid", landing: "invalid" };
  const marker = entries.find(item => item?.kind === "compatible-feedback" && item?.writer === "adopt");
  if (!marker) return { owner: "none", landing: "none" };
  const owner = marker.owner === "devflow/project/arch.md" ? "arch"
    : /^devflow\/project\/capabilities\/[0-9]+-[^/]+\.md$/.test(marker.owner) ? "capability" : "invalid";
  const landing = marker.landing === "satisfied" ? "satisfied" : marker.landing === "pending" ? "pending" : "invalid";
  return { owner, landing };
}
export const collectors = Object.freeze({
  "state.kernel": async context => (await state(context)) ? "available" : "unavailable",
  "state.route": async context => { const current = await state(context); return current ? routeOf(current.value) : "owned-elsewhere"; },
  "state.code": async context => { const current = await state(context); if (!current) return "unknown"; return current.value?.compatibility?.snapshot?.revisions?.code === "none" ? "none" : (await inventory(context)) === "present" ? "present" : "none"; },
  "state.brownfield": async context => { const current = await state(context); const value = current?.value?.compatibility?.snapshot?.archFields?.get("Brownfield"); return value === "yes" ? "yes" : value === "no" ? "no" : "unknown"; },
  "state.capabilities": async context => { const records = (await state(context))?.value?.compatibility?.snapshot?.baseline?.records; if (!Array.isArray(records)) return "unknown"; return records.some(item => item?.headExists !== true) ? "missing" : records.some(item => item?.designRefresh || item?.legacyV010) ? "refresh" : "current"; },
  "adopt/inventory.project": inventory, "adopt/flow.project": flow, "adopt/records.project": records,
  "state.marker-knowledge": async context => { const entries = (await state(context))?.value?.zones?.marker?.entries; return Array.isArray(entries) && entries.some(item => item?.kind === "knowledge-landing" && item?.writer === "adopt") ? "present" : "none"; },
  "state.marker-count": async context => { const entries = (await state(context))?.value?.zones?.marker?.entries; return Array.isArray(entries) ? entries.filter(item => item?.kind === "knowledge-landing" && item?.writer === "adopt").length : 0; },
  "state.compatible-owner": async context => (await compatible(context)).owner,
  "state.compatible-landing": async context => (await compatible(context)).landing
});
export const snapshotBasis = null;
