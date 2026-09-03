import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unknown } from "../scripts/skill-rails/dsl.mjs";

const packageRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
const migrationRoot = realpathSync(resolve(packageRoot, ".."));
const principlesRoot = realpathSync(resolve(migrationRoot, "principles"));
if (dirname(principlesRoot) !== migrationRoot || relative(migrationRoot, principlesRoot) !== "principles") {
  throw new Error("sibling principles root is outside the copied migration set");
}
const stateModule = await import(pathToFileURL(join(principlesRoot, "scripts", "project-state.mjs")).href);
const calculateState = stateModule.calculateState;
const snapshots = new Map();

function suppliedRoot(context) {
  const value = context?.projectRoot ?? context?.project;
  if (typeof value !== "string" || value.length === 0) return null;
  try { return realpathSync(resolve(value)); } catch { return null; }
}

async function snapshot(context) {
  const projectRoot = suppliedRoot(context);
  if (!projectRoot || typeof calculateState !== "function") return null;
  if (!snapshots.has(projectRoot)) {
    snapshots.set(projectRoot, Promise.resolve(calculateState({ root: projectRoot })).then(result => {
      if (result?.schema !== "devflow/project-state/2" || !result.route || !result.zones || !result.facts || !result.metadata) return null;
      return result;
    }).catch(() => null));
  }
  return snapshots.get(projectRoot);
}

function normalizeRelative(value) {
  return value.replaceAll("\\", "/");
}

function isDone(path) {
  return typeof path === "string" && /\.done\.md$/.test(path);
}

function target(context) {
  return typeof context?.targetPath === "string" && context.targetPath.length > 0
    ? context.targetPath
    : unknown();
}

function cardRecord(context) {
  const projectRoot = suppliedRoot(context);
  const supplied = target(context);
  if (!projectRoot || typeof supplied !== "string" || supplied.length === 0) return null;
  if (isAbsolute(supplied) || supplied.includes("\\")) return null;
  const parts = supplied.split("/");
  if (parts.some(part => part === "" || part === "." || part === "..")) return null;
  const candidate = resolve(projectRoot, ...parts);
  const lexical = relative(projectRoot, candidate);
  if (lexical === "" || lexical === ".." || lexical.startsWith(`..${sep}`) || isAbsolute(lexical) || !existsSync(candidate)) return null;
  let physical;
  try {
    physical = realpathSync(candidate);
  } catch {
    return null;
  }
  const contained = relative(projectRoot, physical);
  if (contained === ".." || contained.startsWith(`..${sep}`) || isAbsolute(contained)) return null;
  try {
    return { projectRoot, absolute: physical, path: normalizeRelative(contained), text: readFileSync(physical, "utf8").replace(/\r\n/g, "\n") };
  } catch {
    return null;
  }
}

function field(text, name) {
  return new RegExp(`^${name}:\\s*(.*)$`, "m").exec(text)?.[1]?.trim();
}

function exactProgress(text, head, pattern) {
  const lines = text.split("\n").filter(line => line.includes(head));
  const line = lines.at(-1) ?? "";
  if (!line) return { line: "", value: null };
  const match = pattern.exec(line);
  return match ? { line, value: match.groups ?? match[1] ?? true } : { line, value: "invalid" };
}

function cardEntry(state, card) {
  if (!state || !card) return null;
  const selected = entry => normalizeRelative(entry?.path ?? entry?.file ?? "") === card.path;
  return state.zones.claim?.entries?.find(selected)
    ?? state.zones.ready?.entries?.find(selected)
    ?? state.zones.complete?.entries?.find(selected)
    ?? null;
}

function hasBlockingCardIntegrity(state, card) {
  return state?.zones?.integrity?.entries?.some(entry => entry.path === card?.path && entry.blocking !== false) ?? true;
}

function remoteEntry(state, card) {
  return state?.zones?.transition?.entries?.find(entry => entry.kind === "remote-evidence" && entry.path === card?.path) ?? null;
}

function finishEntry(state, card) {
  return state?.zones?.transition?.entries?.find(entry => entry.kind === "finish-boundary" && (entry.card === card?.path || entry.path === card?.path)) ?? null;
}

function git(projectRoot, args) {
  const result = spawnSync("git", args, { cwd: projectRoot, encoding: "utf8", timeout: 10000, windowsHide: true });
  return result.status === 0 ? result.stdout.trim() : null;
}

function remoteFromCard(card) {
  if (!card) return "invalid";
  const result = exactProgress(card.text, "remote evidence check:", /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) remote evidence check: check-json: (?<check>"(?:[^"\\]|\\.)*"); verdict: (?<verdict>unrun|pass|fail|pending|inaccessible|no-verdict); detail-json: (?<detail>"(?:[^"\\]|\\.)*")$/);
  if (!result.line) return "none";
  if (result.value === "invalid") return "invalid";
  if (result.value.verdict === "pass" || result.value.verdict === "fail" || result.value.verdict === "pending") return result.value.verdict;
  if (result.value.verdict === "inaccessible" || result.value.verdict === "no-verdict") return "unverified";
  return "waiting";
}

async function kernel(context) { return await snapshot(context) ? "available" : "unavailable"; }
async function route(context) { return (await snapshot(context))?.route?.id ?? "unavailable"; }

async function phase(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (isDone(card.path)) return "done";
  const entry = cardEntry(state, card);
  if (entry?.kind === "mine") return "claimed";
  if (entry?.kind === "ready") return "ready";
  return "invalid";
}

function contract(context) {
  const card = cardRecord(context);
  if (!card) return "invalid";
  for (const name of ["Destination", "Completion signal", "Depends", "Read first", "Approval", "Review"]) {
    if (field(card.text, name) === undefined) return "invalid";
  }
  return ["required", "waived", "not-applicable"].includes(field(card.text, "Review")) ? "valid" : "invalid";
}

async function basis(context) {
  const card = cardRecord(context);
  if (!card) return "invalid";
  if (isDone(card.path)) return "complete";
  const state = await snapshot(context);
  if (!state) return "invalid";
  const entry = cardEntry(state, card);
  if (!entry || !Array.isArray(entry.readFirst)) return "invalid";
  const paths = entry.readFirst;
  if (paths.length === 0) return "complete";
  for (const item of paths) {
    if (item.startsWith("/") || item.includes("\\") || item.split("/").some(part => part === "" || part === "." || part === "..")) return "invalid";
    if (/^\.devflow\/project\/capabilities\/[^/]+\.md$/.test(item)) return "invalid";
    const target = resolve(card.projectRoot, ...item.split("/"));
    if (!existsSync(target)) return "missing";
    let physical;
    try { physical = realpathSync(target); } catch { return "missing"; }
    const contained = relative(card.projectRoot, physical);
    if (contained === ".." || contained.startsWith(`..${sep}`) || isAbsolute(contained)) return "invalid";
  }
  return "complete";
}

async function completion(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  const entry = cardEntry(state, card);
  if (["pass", "fail", "unverified"].includes(entry?.signal)) return entry.signal;
  const parsed = exactProgress(card.text, "completion signal result:", /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) completion signal result: head: (?<head>[0-9a-f]{40,64}); verdict: (?<verdict>pass|fail|unverified); detail-json: (?<detail>"(?:[^"\\]|\\.)*")$/);
  if (!parsed.line) return "absent";
  if (parsed.value === "invalid") return "invalid";
  return parsed.value.head === state.metadata.head ? parsed.value.verdict : "stale";
}

async function review(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  const policy = field(card.text, "Review");
  if (policy === "waived" || policy === "not-applicable") return policy;
  if (policy !== "required") return "invalid";
  const entry = cardEntry(state, card);
  if (["pass", "objections", "unverified"].includes(entry?.review)) return entry.review;
  const parsed = exactProgress(card.text, "review result:", /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) review result: head: (?<head>[0-9a-f]{40,64}); verdict: (?<verdict>pass|objections|unverified); detail-json: (?<detail>"(?:[^"\\]|\\.)*")$/);
  if (!parsed.line) return "absent";
  return parsed.value === "invalid" ? "invalid" : parsed.value.verdict;
}

async function carry(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  const entry = cardEntry(state, card);
  if (entry?.carry === "present" || entry?.carry === "absent") return entry.carry;
  const lines = card.text.split("\n").filter(line => line.includes("carry:"));
  if (lines.length === 0) return "absent";
  const last = lines.filter(line => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z carry: .+$/.test(line)).at(-1);
  return last ? "present" : "invalid";
}

async function remote(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (hasBlockingCardIntegrity(state, card)) return "invalid";
  const entry = remoteEntry(state, card);
  if (entry?.state === "evidence-finalizing") return "finalizing";
  const fromCard = remoteFromCard(card);
  if (entry?.state === "evidence-wait") return fromCard === "none" ? "waiting" : fromCard;
  return fromCard === "waiting" ? "none" : fromCard;
}

async function researchCheckpoint(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (!/^#\s+\S+\s+Research:/m.test(card.text)) return "not-applicable";
  const entry = cardEntry(state, card);
  if (entry?.signal !== "pass") return "uncommitted";
  const committed = git(card.projectRoot, ["show", `HEAD:${card.path}`]);
  if (committed === null) return "uncommitted";
  return committed.replace(/\r\n/g, "\n").includes("completion signal result:") ? "committed" : "uncommitted";
}

async function knowledgeMarker(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  const entries = state.zones.marker?.entries?.filter(entry => entry.kind === "knowledge-landing") ?? [];
  if (entries.some(entry => typeof entry.source === "string" && entry.source.startsWith(`${card.path}@`))) return "current-source";
  return entries.length > 0 ? "other-source" : "none";
}

function compatibleLifecyclesForCard(state, cardPath) {
  const lifecycles = state?.facts?.compatibleFeedback?.lifecycles;
  if (!Array.isArray(lifecycles) || typeof cardPath !== "string") return null;
  return lifecycles.filter(item => typeof item?.entry?.source === "string" && item.entry.source.startsWith(`${cardPath}@`));
}

async function feedbackLifecycles(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  return compatibleLifecyclesForCard(state, card.path) ?? "invalid";
}

async function compatibleMarker(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  const entries = state.zones.marker?.entries?.filter(entry => entry.kind === "compatible-feedback") ?? [];
  if (entries.some(entry => typeof entry.source === "string" && entry.source.startsWith(`${card.path}@`))) return "current-source";
  return entries.length > 0 ? "other-source" : "none";
}

async function taskCommit(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (isDone(card.path) || finishEntry(state, card) || remoteEntry(state, card)?.state === "evidence-finalizing") return "present";
  return "absent";
}

async function integration(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (!finishEntry(state, card) && !isDone(card.path)) return "pending";
  const taskHash = git(card.projectRoot, ["log", "-1", "--format=%H", "--", card.path]);
  const integrationHash = state.metadata.integration?.hash;
  if (!taskHash || !integrationHash) return "blocked";
  const ancestor = spawnSync("git", ["merge-base", "--is-ancestor", taskHash, integrationHash], { cwd: card.projectRoot, timeout: 10000, windowsHide: true });
  if (ancestor.status === 0) return "integrated";
  if (ancestor.status === 1) return "pending";
  return "blocked";
}

async function handoff(context) {
  const state = await snapshot(context);
  if (!state || typeof state.facts.handoff?.stale !== "number") return "invalid";
  return state.facts.handoff.stale === 0 ? "current" : "stale";
}

async function boundary(context) {
  const card = cardRecord(context); const state = await snapshot(context);
  if (!card || !state) return "invalid";
  if (isDone(card.path)) return "complete";
  const entry = finishEntry(state, card);
  if (!entry) return "pending";
  if (!Array.isArray(entry.missing)) return "invalid";
  return entry.missing.length === 0 ? "ready" : "missing";
}

export const collectors = Object.freeze({
  "work/card.target": target,
  "work/state.kernel": kernel,
  "work/state.route": async context => {
    const value = await route(context);
    return ["claim.mine", "ready.ready", "transition.remote-evidence", "transition.finish-boundary", "marker.knowledge-landing", "marker.compatible-feedback"].includes(value) ? value : value === "unavailable" ? "unavailable" : "other";
  },
  "work/card.phase": phase,
  "work/card.contract": contract,
  "work/card.basis": basis,
  "work/completion.state": completion,
  "work/review.state": review,
  "work/carry.state": carry,
  "work/remote.state": remote,
  "work/research.checkpoint": researchCheckpoint,
  "work/knowledge.marker": knowledgeMarker,
  "work/feedback.marker": compatibleMarker,
  "work/feedback.lifecycles": feedbackLifecycles,
  "work/task.commit": taskCommit,
  "work/task.integration": integration,
  "work/handoff.state": handoff,
  "work/boundary.state": boundary
});

export const snapshotBasis = null;
