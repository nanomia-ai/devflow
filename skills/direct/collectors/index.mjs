import { lstat, realpath, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { TextDecoder } from "node:util";

const NONE = "NONE";
const decoder = new TextDecoder("utf-8", { fatal: true });
const cache = new WeakMap();
const inside = (root, target) => target === root || target.startsWith(`${root}${sep}`);
const portable = value => value.replace(/\\/g, "/");
const unique = values => [...new Set(values)];

async function regularFile(path) {
  try {
    const entry = await lstat(path);
    if (entry.isSymbolicLink()) throw new Error(`symbolic link is not a canonical state tool: ${path}`);
    return entry.isFile();
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function stateTool(context) {
  const skillParent = await realpath(resolve(context.skillRoot, ".."));
  const projectRoot = await realpath(context.projectRoot);
  const candidates = [
    { base: skillParent, path: resolve(skillParent, "principles", "scripts", "project-state.mjs") },
    { base: projectRoot, path: resolve(projectRoot, "skills", "principles", "scripts", "project-state.mjs") }
  ];
  for (const candidate of candidates) {
    if (!await regularFile(candidate.path)) continue;
    const physical = await realpath(candidate.path);
    if (!inside(candidate.base, physical)) throw new Error(`project-state path escapes its canonical root: ${physical}`);
    return { path: physical, projectRoot };
  }
  throw new Error("canonical principles project-state tool is unavailable");
}

async function canonicalState(context) {
  if (!cache.has(context)) cache.set(context, (async () => {
    const tool = await stateTool(context);
    const url = pathToFileURL(tool.path);
    url.searchParams.set("direct_collector", "canonical");
    const module = await import(url.href);
    if (typeof module.calculateState !== "function") throw new Error("project-state does not export calculateState");
    const result = await module.calculateState({ root: tool.projectRoot });
    if (result?.schema !== "devflow/project-state/2" || !result.route || !result.zones || !result.facts || !result.metadata) throw new Error("project-state did not return the schema-2 contract");
    return { ...result, projectRoot: tool.projectRoot };
  })());
  return cache.get(context);
}

function currentRequestLine(state) {
  if (!Array.isArray(state.facts.existingRequests)) throw new Error("project-state existing request facts are unavailable");
  const lines = state.facts.existingRequests.map((line, index) => ({ line, index }))
    .filter(({ line }) => typeof line === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ maintenance routing pending: request-json:/.test(line));
  if (lines.length !== state.facts.existingRequests.length) throw new Error("project-state existing request fact is malformed");
  if (!lines.length) return NONE;
  return lines.sort((left, right) => left.line.slice(0, 20).localeCompare(right.line.slice(0, 20)) || left.index - right.index)[0].line;
}

function failureRequest(state) {
  const entries = state.zones.transition?.entries;
  if (state.route.id === "transition.failure-routing") {
    if (!Array.isArray(entries)) throw new Error("project-state transition entries are unavailable");
    const entry = entries.find(candidate => candidate.kind === "failure-routing");
    if (!entry || typeof entry.path !== "string" || !entry.path.startsWith(".devflow/tree/") || !entry.path.endsWith("verify.md") || !Number.isInteger(entry.sourceId) || entry.sourceId <= 0) throw new Error("project-state failure route is malformed");
    const source = `verify:${entry.path}#Failure history@${entry.sourceId}`;
    return { source, request: source };
  }
  if (!Array.isArray(entries) || !entries.some(entry => entry.kind === "layer-opening")) return NONE;
  const active = activeOrigin(state);
  if (active === NONE || !entries.some(entry => entry.kind === "failure-routing" && `verify:${entry.path}#Failure history@${entry.sourceId}` === active.origin)) return NONE;
  return { source: active.origin, request: active.origin };
}

function currentRequest(state) {
  const failure = failureRequest(state);
  if (failure !== NONE) return failure;
  const raw = currentRequestLine(state);
  if (raw === NONE) return NONE;
  const match = /request-json: (.+)$/.exec(raw);
  if (match === null) throw new Error("project-state current request is incomplete");
  let request;
  try { request = JSON.parse(match[1]); } catch { throw new Error("project-state current request is malformed"); }
  if (typeof request !== "string") throw new Error("project-state current request is incomplete");
  return { source: `journal:${raw}`, request };
}

function activeOrigin(state) {
  const markers = state.zones.transition.entries.filter(entry => entry.kind === "layer-opening")
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
  if (!markers.length) return NONE;
  const origin = markers[0].sourceJson;
  if (typeof origin !== "string" || origin.length === 0) throw new Error("project-state layer-opening origin is unavailable");
  const bundle = markers.filter(marker => marker.sourceJson === origin);
  const scopes = unique(bundle.map(marker => marker.parent));
  if (!scopes.length || scopes.some(scope => typeof scope !== "string" || !scope.startsWith(".devflow/tree"))) throw new Error("project-state active scope is invalid");
  return { origin, scopes, children: unique(bundle.flatMap(marker => String(marker.children).split("+"))) };
}

function pathInScopes(path, scopes) {
  return scopes.some(scope => path.startsWith(`${scope}/`));
}

function newCardPaths(state) {
  const records = git(state, ["--no-optional-locks", "status", "--porcelain=v1", "-z", "--untracked-files=all"]).split("\0").filter(Boolean);
  const paths = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record.length < 4 || record[2] !== " ") throw new Error("git status returned an invalid porcelain record");
    const code = record.slice(0, 2);
    const path = portable(record.slice(3));
    if (code.includes("R") || code.includes("C")) {
      index += 1;
      if (index >= records.length) throw new Error("git status rename record is incomplete");
    }
    if (code === "??" || code.includes("A")) paths.push(path);
  }
  return unique(paths);
}

function draftBundle(state) {
  const active = activeOrigin(state);
  if (active === NONE) return NONE;
  const cardPaths = new Set(projectedCardEntries(state).map(entry => entry.file));
  const addedTreeCards = newCardPaths(state).filter(path => path.startsWith(".devflow/tree/") && path.endsWith(".md"));
  const unparsed = addedTreeCards.filter(path => !cardPaths.has(path));
  if (unparsed.length) throw new Error(`new task-tree cards are not recognized by project-state: ${unparsed.join(",")}`);
  const outside = addedTreeCards.filter(path => !pathInScopes(path, active.scopes));
  if (outside.length) throw new Error(`new card paths are outside the exact active scopes: ${outside.join(",")}`);
  const cards = unique(addedTreeCards.filter(path => pathInScopes(path, active.scopes))).sort();
  return cards.length ? { origin: active.origin, scopes: active.scopes, cards } : NONE;
}

async function projectResearch(state) {
  const receipt = planningReceipt(state);
  const receiptCards = receipt === NONE ? [] : receipt.cards.filter(path => path.startsWith(".devflow/tree/00-project/"));
  const active = activeOrigin(state);
  const request = currentRequest(state);
  const origin = receiptCards.length > 0 ? receipt.origin : active !== NONE ? active.origin : request !== NONE ? request.source : null;
  if (origin === null) return NONE;
  const matches = projectedCardEntries(state).filter(card => card.file.startsWith(".devflow/tree/00-project/")
    && card.origin === origin && (receiptCards.length === 0 || receiptCards.includes(card.file)));
  if (matches.length > 1) throw new Error(`exact origin has multiple 00-project research cards: ${origin}`);
  if (matches.length === 0) return NONE;
  const card = matches[0];
  const heading = await readFile(resolve(state.projectRoot, card.file), "utf8");
  if (!/^# \d+\.\d+ Research:/.test(heading)) throw new Error(`00-project card is not a canonical research card: ${card.file}`);
  const approval = card.approval === "effective" ? "effective" : card.approval === "pending" ? "pending" : "invalid";
  return { origin, path: card.file, approval };
}

function git(state, args) {
  const run = spawnSync("git", ["-C", state.projectRoot, ...args], { encoding: "buffer", windowsHide: true });
  if (run.error || run.status !== 0) throw new Error(`git ${args[0]} failed with status ${run.status ?? "spawn"}`);
  return decoder.decode(run.stdout);
}

function gitOptional(state, args) {
  const run = spawnSync("git", ["-C", state.projectRoot, ...args], { encoding: "buffer", windowsHide: true });
  if (run.error) throw new Error(`git ${args[0]} failed to start`);
  return run.status === 0 ? decoder.decode(run.stdout) : null;
}

function gitAncestry(state, ancestor, descendant) {
  const run = spawnSync("git", ["-C", state.projectRoot, "merge-base", "--is-ancestor", ancestor, descendant], { encoding: "buffer", windowsHide: true });
  if (run.error || ![0, 1].includes(run.status)) throw new Error(`git merge-base failed with status ${run.status ?? "spawn"}`);
  return run.status === 0;
}

function requestPhase(state) {
  if (failureRequest(state) !== NONE) return "failure-routed";
  const raw = currentRequestLine(state);
  if (raw === NONE) return "none";
  const introductions = git(state, ["log", "--reverse", "--format=%H", `-S${raw}`, "--", ".devflow/journal.md"]).split(/\r?\n/).filter(Boolean);
  const introduced = introductions[0];
  if (!introduced) return "uncommitted";
  const designCommits = git(state, ["log", "--format=%H%x1f%s", "--", ".devflow/project/design.md"]).split(/\r?\n/).filter(Boolean);
  for (const record of designCommits) {
    const separator = record.indexOf("\x1f");
    if (separator < 0) throw new Error("design commit history is malformed");
    const commit = record.slice(0, separator);
    const subject = record.slice(separator + 1).trim();
    if (subject !== "design — design.md" && !/^[^\s]+ design — design\.md$/.test(subject)) continue;
    if (!gitAncestry(state, introduced, commit)) continue;
    const journal = gitOptional(state, ["show", `${commit}:.devflow/journal.md`]);
    if (journal === null) throw new Error("design commit does not contain the canonical journal passenger");
    const requests = journal.split(/\r?\n/).map((line, index) => ({ line, index }))
      .filter(({ line }) => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ maintenance routing pending: request-json:/.test(line))
      .sort((left, right) => left.line.slice(0, 20).localeCompare(right.line.slice(0, 20)) || left.index - right.index);
    if (requests[0]?.line === raw) return "design-confirmed";
  }
  return "committed";
}

function headTransaction(state) {
  const head = state.metadata.head;
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(head)) throw new Error("project-state HEAD is unavailable");
  git(state, ["rev-parse", "--verify", `${head}^`]);
  const subject = git(state, ["log", "-1", "--format=%s", head]).trim();
  const paths = git(state, ["diff-tree", "--no-commit-id", "--name-only", "-r", "-z", `${head}^`, head, "--", ".devflow/tree", ".devflow/journal.md"]).split("\0").filter(Boolean);
  const knownCards = new Set(projectedCardEntries(state).map(card => card.file));
  return { head, subject, paths, cards: paths.filter(path => knownCards.has(path)) };
}

function projectedCardEntries(state) {
  return [...state.zones.ready.entries, ...state.zones.claim.entries]
    .map(entry => ({ ...entry, file: entry.file ?? entry.path ?? null }))
    .filter(entry => entry.file);
}

function approvalBoundary(state) {
  const active = activeOrigin(state);
  if (active === NONE) return NONE;
  const entries = projectedCardEntries(state).filter(entry => entry.origin === active.origin && entry.approval === "effective");
  if (!entries.length) return NONE;
  const values = entries.map(entry => ({ card: entry.file, value: entry.approval }));
  if (values.some(item => item.value !== "effective")) throw new Error("project-state effective approval lacks its canonical card value");
  return { origin: active.origin, values, cards: values.map(item => item.card) };
}

function approvalIssue(state) {
  const active = activeOrigin(state);
  const drafts = draftBundle(state);
  const transaction = headTransaction(state);
  const selectors = new Set([...(drafts === NONE ? [] : drafts.cards), ...transaction.cards]);
  const invalid = state.zones.ready.entries.filter(entry => entry.kind === "approval-invalid")
    .filter(entry => (active !== NONE && entry.origin === active.origin) || selectors.has(entry.file));
  if (!invalid.length) return NONE;
  const origins = unique(invalid.map(entry => entry.origin).filter(value => typeof value === "string" && value !== "none" && value !== "unknown"));
  if (origins.length !== 1) throw new Error("approval-invalid cards do not have one exact origin");
  return { origin: origins[0], cards: invalid.map(entry => entry.file), reasons: invalid.flatMap(entry => entry.invalidity ?? []) };
}

function planningReceipt(state) {
  const transaction = headTransaction(state);
  if (!transaction.subject.startsWith("direct — ") || !transaction.paths.includes(".devflow/journal.md") || !transaction.cards.length) return NONE;
  const entries = projectedCardEntries(state);
  const details = transaction.cards.map(card => entries.find(entry => entry.file === card));
  if (details.some(detail => !detail || detail.approval !== "effective")) return NONE;
  const origins = unique(details.map(detail => detail.origin).filter(value => typeof value === "string" && value !== "none" && value !== "unknown"));
  if (origins.length !== 1) throw new Error("planning commit cards do not have one exact project-state origin");
  const origin = origins[0];
  const active = activeOrigin(state);
  const request = currentRequest(state);
  if ((active !== NONE && active.origin === origin) || (request !== NONE && request.source === origin)) return NONE;
  return { origin, scopes: unique(transaction.cards.map(card => portable(dirname(card)))), cards: transaction.cards, commit: transaction.head };
}

export const collectors = Object.freeze({
  "state.project.product": async context => {
    const setup = (await canonicalState(context)).zones.setup.entries;
    if (setup.some(entry => entry.kind === "layer0-uncommitted")) return "uncommitted-layer0";
    return setup.some(entry => entry.kind === "no-product") ? "missing" : "present";
  },
  "state.request.current": async context => currentRequest(await canonicalState(context)),
  "state.request.phase": async context => requestPhase(await canonicalState(context)),
  "state.origin.active": async context => activeOrigin(await canonicalState(context)),
  "state.origin.drafts": async context => draftBundle(await canonicalState(context)),
  "state.origin.project-research": async context => { const value = await projectResearch(await canonicalState(context)); return value === NONE ? NONE : { origin: value.origin, path: value.path }; },
  "state.project-research.approval": async context => { const value = await projectResearch(await canonicalState(context)); return value === NONE ? "none" : value.approval; },
  "state.approval.boundary": async context => approvalBoundary(await canonicalState(context)),
  "state.approval.issue": async context => approvalIssue(await canonicalState(context)),
  "state.planning.receipt": async context => planningReceipt(await canonicalState(context)),
  "state.migration.ledger": () => "unknown"
});
