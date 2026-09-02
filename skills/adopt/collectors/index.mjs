import { realpath } from "node:fs/promises";
import { resolve } from "node:path";

const stateModule = new URL("../../principles/scripts/project-state.mjs", import.meta.url);
const cache = new WeakMap();

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

async function hasProjectMaterial(context) {
  const current = await state(context);
  if (!current) return "unknown";
  const material = current.value?.compatibility?.snapshot?.nonDevflowMaterial;
  return ["present", "none"].includes(material) ? material : "unknown";
}

function routeOf(value) {
  const id = value?.route?.id;
  const allowed = new Set(["none", "git.open-operation", "integrity.blocking", "setup.unmanaged"]);
  return allowed.has(id) ? id : "owned-elsewhere";
}

export const collectors = Object.freeze({
  "state.kernel": async context => (await state(context)) ? "available" : "unavailable",
  "state.route": async context => { const current = await state(context); return current ? routeOf(current.value) : "owned-elsewhere"; },
  "state.material": hasProjectMaterial
});
export const snapshotBasis = null;
