import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const project = ctx => ctx?.projectRoot ?? ctx?.project ?? null;
const readState = (ctx, read) => {
  const root = project(ctx);
  if (!root) return "unknown";
  try { return read(root); } catch { return "unknown"; }
};
const file = (root, path) => existsSync(join(root, path));
const productIsCurrent = (root) => {
  const path = join(root, "devflow/project/product.md");
  if (!existsSync(path)) return "absent";
  const text = readFileSync(path, "utf8");
  const required = ["# ", "## Problem", "## Approach", "## Capabilities", "## Boundary", "## Success criteria", "## Screens & access points", "## Open questions", "interface:"];
  return required.every(part => text.includes(part)) ? "current" : "unknown";
};
const projectStateTool = (ctx) => {
  const declared = ctx?.projectStateTool;
  if (typeof declared === "string" && existsSync(declared)) return declared;
  const skillRoot = ctx?.skillRoot;
  const sibling = typeof skillRoot === "string" ? resolve(skillRoot, "..", "principles", "scripts", "project-state.mjs") : null;
  return sibling && existsSync(sibling) ? sibling : null;
};
const productRequest = async (ctx, root) => {
  const state = await canonicalState(ctx, root);
  const entries = state?.zones.marker?.entries;
  return Array.isArray(entries) ? entries.some(entry => entry.kind === "product-rerun") ? "product-re-run" : "none" : "unknown";
};
const canonicalState = async (ctx, root) => {
  try {
    const tool = projectStateTool(ctx);
    if (!tool) return "unknown";
    const url = pathToFileURL(tool);
    url.searchParams.set("product_research", "canonical");
    const module = await import(url.href);
    if (typeof module.calculateState !== "function") return null;
    const result = await module.calculateState({ root });
    if (result?.schema !== "devflow/project-state/2" || !result.route || !result.zones || !result.facts || !result.metadata) return null;
    return result;
  } catch {
    return null;
  }
};
const projectResearch = async (ctx, root) => {
  try {
    const result = await canonicalState(ctx, root);
    if (result === null) return "unknown";
    const requests = Array.isArray(result.facts.existingRequests) ? result.facts.existingRequests
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => typeof value === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ maintenance routing pending: request-json:/.test(value))
      .sort((left, right) => left.value.slice(0, 20).localeCompare(right.value.slice(0, 20)) || left.index - right.index).map(({ value }) => value) : null;
    if (requests === null) return "unknown";
    if (requests.length === 0) return "none";
    const origin = `journal:${requests[0]}`;
    const entries = [...(result.zones.ready?.entries ?? []), ...(result.zones.claim?.entries ?? [])];
    const matches = entries.filter(entry => {
      const path = entry.file ?? entry.path;
      return typeof path === "string" && path.startsWith("devflow/tree/00-project/") && entry.origin === origin
        && /^# \d+\.\d+ Research:/.test(readFileSync(join(root, path), "utf8"));
    });
    if (matches.length > 1) return "unknown";
    if (matches.length === 0) return "none";
    return matches[0].approval === "effective" ? "effective" : matches[0].approval === "pending" ? "pending" : "unknown";
  } catch { return "unknown"; }
};
export const collectors = Object.freeze({
  "state.product-entry": ctx => readState(ctx, root => (!file(root, "devflow/project/product.md") && file(root, "devflow/project/arch.md") ? "brownfield-no-product" : file(root, "devflow/project/product.md") ? "existing" : "new")),
  "state.product-file": ctx => readState(ctx, productIsCurrent),
  "state.glossary": ctx => readState(ctx, root => file(root, "devflow/project/glossary.md") ? "current" : "missing"),
  "state.product-request": ctx => readState(ctx, root => productRequest(ctx, root)),
  "state.project-research-state": ctx => readState(ctx, async root => projectResearch(ctx, root))
});
export const snapshotBasis = null;
