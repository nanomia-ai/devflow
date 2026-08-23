#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";

const OUTPUT_LIMIT = 24 * 1024;
const COMPACT_FIELD_LIMIT = 96;
const COMPACT_LOSSY_FIELDS = new Set(["progressLastPoint"]);
const MAX_BUFFER = 64 * 1024 * 1024;
const CARD_NUMBER = "[0-9]+[a-z]*(?:\\.[0-9]+[a-z]*)+";
const FOLDER_NUMBER = "[0-9]+[a-z]*(?:\\.[0-9]+[a-z]*)*";
const CARD_NUMBER_RE = new RegExp(`^${CARD_NUMBER}$`);
const APPROVAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z; parallel: (?:none|[0-9]+[a-z]*(?:\.[0-9]+[a-z]*)+(?:\+[0-9]+[a-z]*(?:\.[0-9]+[a-z]*)+)*)$/;
const TIMESTAMP = "(?<timestamp>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)";
const RESERVED_JOURNAL_HEADS = [
  "layer opening:",
  "re-split pending:",
  "maintenance routing pending:",
  "product re-run pending:",
  "product verification requested",
  "product verification running:",
  "product verification result:",
  "capability closing:",
  "capability note:",
  "audit requested:",
  "retrospective requested:",
  "evidence-wait:",
  "evidence-finalizing:",
];

// One recognizer owns every canon-fixed progress head. The canon says a progress line that
// starts with the canonical timestamp followed by one of these heads stands in that format
// exactly, so a line that carries a head and misses its format is a shape anomaly — not the
// implementer's prose, which is what a silently unread machine line used to degrade into.
const PROGRESS_HEADS = [
  { head: "completion signal result:", kind: "signal",
    form: /^completion signal result: head: (?<head>[0-9a-f]{40,64}); verdict: (?<verdict>pass|fail|unverified); detail-json: (?<detailJson>.+)$/ },
  { head: "review result:", kind: "review",
    form: /^review result: head: (?<head>[0-9a-f]{40,64}); verdict: (?<verdict>pass|objections|unverified); detail-json: (?<detailJson>.+)$/ },
  { head: "carry:", kind: "carry", form: /^carry: (?<fact>.+)$/ },
  { head: "remote evidence check:", kind: "remote-evidence",
    form: /^remote evidence check: check-json: (?<checkJson>.+); verdict: (?<verdict>unrun|pass|fail|pending|inaccessible|no-verdict); detail-json: (?<detailJson>.+)$/ },
];

// One table owns both the printed zone order and every routable kind.  The absent-order
// numbers are the twelve no-tree branches; setup changes position with its kind, exactly as
// the canonical no-tree table does.  A later release can add or remove one row here without
// rediscovering a condition chain.
export const ZONE_DEFINITIONS = Object.freeze([
  { zone: "git", present: 1, absent: -2, kinds: [{ name: "open-operation", present: 1, absent: -2 }] },
  { zone: "integrity", present: 2, absent: -1, kinds: [
    { name: "blocking", present: 2, absent: -1 },
    { name: "advisory", present: null, absent: null, routing: false },
    { name: "shape", present: null, absent: null, routing: false },
  ] },
  { zone: "transition", present: 3, absent: 7, kinds: [
    "prepared-route", "interrupted", "source-id-migration", "layer-opening",
    "product-running", "product-result", "remote-evidence", "finish-boundary",
    "event-routing", "event-decision", "failure-routing",
  ].map((name, index) => ({ name, present: 3 + index / 100, absent: name === "layer-opening" ? 7 : null })) },
  { zone: "marker", present: 4, absent: 8, kinds: [
    { name: "product-rerun", present: 4, absent: 2 },
    { name: "design-note", present: 4.01, absent: null },
    { name: "design-open-item", present: 4.02, absent: null },
    { name: "capability-closure", present: 4.03, absent: null },
    { name: "re-split", present: 4.04, absent: 8 },
  ] },
  { zone: "setup", present: 5, absent: 5, kinds: [
    { name: "no-product", present: 5, absent: 1 },
    { name: "layer0-incomplete", present: 5.01, absent: 3 },
    { name: "brownfield-field", present: 5.02, absent: 5 },
    { name: "integration-config", present: 5.03, absent: 5 },
    { name: "room-upgrade", present: 5.04, absent: 5 },
  ] },
  { zone: "claim", present: 6, absent: 20, kinds: [
    "depends-anomaly", "needs-reapproval", "blocked-by-prerequisite", "mine",
  ].map((name, index) => ({ name, present: 6 + index / 100, absent: null })) },
  { zone: "baseline", present: 7, absent: 6, kinds: [
    "legacy-v010", "design-refresh", "boundary",
  ].map((name, index) => ({ name, present: 7 + index / 100, absent: 6 + index / 100 })) },
  { zone: "request", present: 8, absent: 9, kinds: [{ name: "existing", present: 8, absent: 9 }] },
  { zone: "event", present: 9, absent: 10, kinds: [
    "product-requested", "pending", "new",
  ].map((name, index) => ({ name, present: 9 + index / 100, absent: name === "product-requested" ? 10 : null })) },
  { zone: "layer", present: 10, absent: 12, kinds: [
    "empty-folder", "folder-boundary", "children-done", "correspondence-gap",
    "no-foundation", "no-tree",
  ].map((name, index) => ({ name, present: 10 + index / 100, absent: name === "no-tree" ? 12 : null })) },
  { zone: "ready", present: 11, absent: 21, kinds: [
    "digest-behind", "needs-normalization", "approval-invalid", "approval-pending", "ready", "waiting-capability",
  ].map((name, index) => ({ name, present: 11 + index / 100, absent: null })) },
  { zone: "blocked", present: 12, absent: 22, kinds: [
    "channel", "audits", "dependencies", "other-claims",
  ].map((name, index) => ({ name, present: 12 + index / 100, absent: null })) },
  { zone: "product", present: 13, absent: 23, kinds: [
    "shape-or-revision", "fail", "unverified",
  ].map((name, index) => ({ name, present: 13 + index / 100, absent: null })) },
  { zone: "complete", present: 14, absent: 11, kinds: [
    { name: "product-pass", present: 14, absent: null },
    { name: "adoption", present: 14.01, absent: 11 },
  ] },
]);

export const FACT_ZONES = Object.freeze(["report", "handoff", "open-item", "existing-request", "finding"]);

// The document grammar is data rather than parser control flow.  A future capability-document
// generation can change one element here and exercise the same shape checker.
export const CAPABILITY_SECTION_HEADINGS = Object.freeze([
  "## Intent",
  "## Concept model",
  "## Invariants",
  "## Non-goals",
  "## Binding ADRs",
  "## Design metadata",
  "## Verified state",
  "### Main flow",
  "### Lifecycle",
  "### Current behavior",
  "### Entrypoints",
  "### Consumed contracts",
  "### Traps",
  "### Verify",
  "### Verification metadata",
]);

const ROUTE_RANK = new Map();
for (const definition of ZONE_DEFINITIONS) {
  for (const kind of definition.kinds) ROUTE_RANK.set(`${definition.zone}.${kind.name}`, kind);
}

class CliError extends Error {
  constructor(message, status = 1) {
    super(message);
    this.status = status;
  }
}

function fail(message, status = 1) {
  throw new CliError(message, status);
}

function decodeUtf8(bytes, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    fail(`${label}: file is not valid UTF-8`);
  }
}

function byteCompare(left, right) {
  return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function canonicalCardCompare(left, right) {
  const parts = (value) => value.split(".").map((part) => {
    const match = /^(\d+)([a-z]*)$/.exec(part);
    return { number: Number(match?.[1] ?? 0), suffix: match?.[2] ?? "" };
  });
  const a = parts(left);
  const b = parts(right);
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    if (a[index].number !== b[index].number) return a[index].number - b[index].number;
    if (a[index].suffix !== b[index].suffix) {
      if (a[index].suffix === "") return -1;
      if (b[index].suffix === "") return 1;
      return byteCompare(a[index].suffix, b[index].suffix);
    }
  }
  if (a.length !== b.length) return a.length - b.length;
  return byteCompare(left, right);
}

function slash(relative) {
  return relative.split(path.sep).join("/");
}

function repositoryPath(root, target) {
  return slash(path.relative(root, target));
}

function inside(root, target) {
  const relative = path.relative(root, target);
  return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function normalizeFileText(text) {
  return text.replace(/\r\n/g, "\n");
}

function readFile(root, relative) {
  const target = path.resolve(root, ...relative.split("/"));
  if (!inside(root, target) || !fs.existsSync(target) || !fs.statSync(target).isFile()) return null;
  return normalizeFileText(decodeUtf8(fs.readFileSync(target), relative));
}

function listFiles(root, relative) {
  const base = path.resolve(root, ...relative.split("/"));
  if (!inside(root, base) || !fs.existsSync(base) || !fs.statSync(base).isDirectory()) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) files.push(repositoryPath(root, target));
    }
  };
  visit(base);
  return files.sort(byteCompare);
}

function listDirectories(root, relative) {
  const base = path.resolve(root, ...relative.split("/"));
  if (!inside(root, base) || !fs.existsSync(base) || !fs.statSync(base).isDirectory()) return [];
  const directories = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const target = path.join(directory, entry.name);
      directories.push(repositoryPath(root, target));
      visit(target);
    }
  };
  visit(base);
  return directories.sort(byteCompare);
}

function gitRun(root, args, { allowFailure = false, input = undefined } = {}) {
  const run = spawnSync("git", args, {
    cwd: root,
    input,
    maxBuffer: MAX_BUFFER,
    windowsHide: true,
  });
  if (run.error) {
    if (allowFailure) return { status: null, stdout: Buffer.alloc(0), stderr: Buffer.from(run.error.message) };
    fail(`git ${args[0]} failed: ${run.error.message}`);
  }
  if (run.status !== 0 && !allowFailure) {
    const detail = Buffer.isBuffer(run.stderr) ? run.stderr.toString("utf8").trim() : "";
    fail(`git ${args[0]} failed${detail ? `: ${detail}` : ""}`);
  }
  return { status: run.status, stdout: run.stdout ?? Buffer.alloc(0), stderr: run.stderr ?? Buffer.alloc(0) };
}

function gitText(root, args, options = {}) {
  return normalizeFileText(decodeUtf8(gitRun(root, args, options).stdout, `git ${args[0]} output`));
}

function gitLine(root, args, options = {}) {
  return gitText(root, args, options).trim();
}

function gitPathExists(root, ref, relative) {
  return gitRun(root, ["cat-file", "-e", `${ref}:${relative}`], { allowFailure: true }).status === 0;
}

function gitFile(root, ref, relative) {
  const run = gitRun(root, ["show", `${ref}:${relative}`], { allowFailure: true });
  return run.status === 0 ? normalizeFileText(decodeUtf8(run.stdout, `${relative}@${ref}`)) : null;
}

function gitNulList(root, args) {
  const bytes = gitRun(root, args, { allowFailure: true });
  if (bytes.status !== 0) return [];
  // File names are only decoded after Git has finished producing its NUL-delimited list.
  // Revision hashes below never cross this conversion boundary.
  return decodeUtf8(bytes.stdout, `git ${args[0]} path list`).split("\0").filter(Boolean);
}

export async function nativeBinaryHash(root, revision, paths) {
  const leftArgs = ["ls-tree", "-r", "-z", "--full-tree", revision, "--", ...paths];
  let input = Buffer.alloc(0);
  if (paths.length > 0) {
    const listed = spawnSync("git", leftArgs, {
      cwd: root, maxBuffer: MAX_BUFFER, windowsHide: true, stdio: ["ignore", "pipe", "ignore"],
    });
    if (listed.error || listed.status !== 0) return null;
    input = listed.stdout;
  }
  const hashed = spawnSync("git", ["hash-object", "--stdin"], {
    cwd: root, input, maxBuffer: MAX_BUFFER, windowsHide: true, stdio: ["pipe", "pipe", "ignore"],
  });
  if (hashed.error || hashed.status !== 0) return null;
  let value;
  try {
    value = decodeUtf8(hashed.stdout, "binary revision hash").trim();
  } catch {
    return null;
  }
  return /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value) ? value : null;
}

export function revisionFromGit(run, emptyValue) {
  if (run.status !== 0) return "unresolved";
  let value;
  try {
    value = decodeUtf8(run.stdout, "revision object id").trim();
  } catch {
    return "unresolved";
  }
  if (value === "") return emptyValue;
  return /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value) ? value : "unresolved";
}

function parseArguments(argv) {
  if (argv.length === 0) fail("missing subcommand (state)");
  if (argv[0] !== "state") fail(`unknown subcommand ${argv[0]}`);
  const options = { root: process.cwd() };
  for (let index = 1; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--root", "--capability"].includes(flag)) fail(`unknown option ${flag}`);
    if (value === undefined || value.startsWith("--")) fail(`${flag} requires a value`);
    index += 1;
    if (flag === "--root") options.root = value;
    if (flag === "--capability") options.capability = value;
  }
  if (options.capability !== undefined && !/^0*[1-9][0-9]*$/.test(options.capability)) {
    fail("--capability must be a positive integer");
  }
  const requested = path.resolve(options.root);
  if (!fs.existsSync(requested) || !fs.statSync(requested).isDirectory()) fail(`root is not a directory: ${requested}`);
  const resolved = gitRun(requested, ["rev-parse", "--show-toplevel"], { allowFailure: true });
  if (resolved.status !== 0) fail(`root is not a Git work tree: ${requested}`);
  options.root = path.resolve(decodeUtf8(resolved.stdout, "repository root").trim());
  return options;
}

function fields(text) {
  const result = new Map();
  for (const line of (text ?? "").split("\n")) {
    const match = /^([A-Za-z][A-Za-z ]*):\s*(.*)$/.exec(line);
    if (match) result.set(match[1], match[2].trim());
  }
  return result;
}

function normalizedHeading(line) {
  return line.replace(/(?:\s*<!--[\s\S]*?-->\s*)+$/g, "").trim();
}

function headingIndex(lines, heading) {
  return lines.findIndex((line) => normalizedHeading(line) === heading);
}

// One plan boundary. A card's one `## Progress log` heading separates the plan the user
// approved from the record the task appends, so every judgment about the plan — its fields
// and its approval freshness alike — reads only above that heading, and a `Field: value`
// line below it is the implementer's prose. The slice always carries both halves of that
// answer: the bounded text to parse, and the reason it cannot be trusted. So no consumer
// invents a fallback. Two or more headings read above the first one; none at all reads the
// whole card, because a legacy migration still has to see its fields. Either way the reason
// travels with the card, and approval fails closed on it whether or not the tree is clean.
function planSlice(text) {
  if (text === null) return { reason: "card-diff" };
  const lines = text.split("\n");
  const first = headingIndex(lines, "## Progress log");
  const count = lines.filter((line) => normalizedHeading(line) === "## Progress log").length;
  if (count === 1) return { plan: lines.slice(0, first).join("\n") };
  return { plan: count === 0 ? text : lines.slice(0, first).join("\n"), reason: "progress-heading" };
}

function statusless(component) {
  return component
    .replace(/\.wip(?:-[a-z0-9]{2,8})?(?=\.|$)/, "")
    .replace(/\.(?:done|stale)(?=\.|$)/, "");
}

function normalizedStatusPath(relative) {
  return relative.split("/").map(statusless).join("/");
}

// A waiting capability file, the folder it opens into, and every status-suffixed form of
// either are one durable tree identity: the status suffix on each component and the terminal
// `.md` are notation, not subject. A HANDOFF path written before the folder existed still
// names it — and two live paths sharing one identity is not a match but an ambiguity, which
// the callers below fail closed on rather than pick from.
function treeIdentity(relative) {
  return normalizedStatusPath(relative.replace(/\/+$/, "")).replace(/\.md$/, "");
}

function handoffPathMatches(snapshot, nextStep) {
  const identity = treeIdentity(nextStep);
  return [...snapshot.cards.map((card) => card.path), ...snapshot.waitingFiles, ...snapshot.directories, ...snapshot.verifyTexts.keys()]
    .filter((relative) => treeIdentity(relative) === identity);
}

function cardIdentity(relative) {
  const basename = path.posix.basename(relative);
  const number = new RegExp(`^(${CARD_NUMBER})(?=[-.])`).exec(basename)?.[1] ?? null;
  if (!number) return null;
  const claimant = /\.wip-([a-z0-9]{2,8})(?=\.|$)/.exec(basename)?.[1] ?? null;
  const bare = /\.wip(?=\.|$)/.test(basename) && claimant === null;
  const status = claimant ? "claimed" : bare ? "bare" : /\.done(?=\.|$)/.test(basename)
    ? "done" : /\.stale(?=\.|$)/.test(basename) ? "stale" : "pending";
  const name = basename
    .replace(/\.md$/, "")
    .replace(/\.(?:wip(?:-[a-z0-9]{2,8})?|done|stale)$/, "")
    .slice(number.length)
    .replace(/^[-.]/, "");
  return { number, claimant, bare, status, name };
}

function folderIdentity(relative) {
  const basename = path.posix.basename(relative);
  const match = new RegExp(`^(?<number>${FOLDER_NUMBER})-(?<name>.+?)(?<status>\\.(?:done|stale))?$`).exec(basename);
  if (!match) return null;
  return { number: match.groups.number, name: match.groups.name, status: match.groups.status?.slice(1) ?? "open" };
}

function parseDepends(raw, legacy) {
  const value = (raw ?? "").trim();
  if (!legacy) {
    if (value === "none") return { canonical: true, numbers: [], anomalies: [] };
    const members = value.split(", ");
    if (members.length > 0 && members.every((member) => CARD_NUMBER_RE.test(member))) {
      return { canonical: true, numbers: members, anomalies: [] };
    }
    return { canonical: false, numbers: [], anomalies: [`noncanonical Depends: ${value || "<blank>"}`] };
  }
  if (["", "—", "none"].includes(value)) return { canonical: false, numbers: [], anomalies: [] };
  const numbers = [];
  const anomalies = [];
  for (const member of value.split(", ")) {
    const match = new RegExp(`^(${CARD_NUMBER})(?:\\s|$)`).exec(member);
    if (!match) anomalies.push(`legacy member has no leading number: ${member}`);
    else numbers.push(match[1]);
  }
  return { canonical: false, numbers, anomalies };
}

function parseCard(root, relative, closedFolder = false) {
  const identity = cardIdentity(relative);
  if (identity === null) return null;
  if (closedFolder) {
    return {
      ...identity,
      path: relative,
      text: null,
      fields: new Map(),
      depends: { canonical: true, numbers: [], anomalies: [] },
      approval: null,
      review: null,
      readFirst: [],
      planReason: null,
      legacy: false,
      closedFolder: true,
    };
  }
  const text = readFile(root, relative);
  if (text === null) return null;
  const slice = planSlice(text);
  const cardFields = fields(slice.plan);
  const legacy = !cardFields.has("Approval") || !cardFields.has("Review");
  const depends = parseDepends(cardFields.get("Depends"), legacy);
  return {
    ...identity,
    path: relative,
    text,
    planReason: slice.reason ?? null,
    fields: cardFields,
    depends,
    approval: cardFields.get("Approval") ?? null,
    review: cardFields.get("Review") ?? null,
    readFirst: parseReadFirst(slice.plan),
    legacy,
    closedFolder: false,
  };
}

// `Read first` is the one card field the canon writes one path per line, so the projection has
// to take its continuation lines too: a consumer given only the first path opens the wrong set,
// and the whole point of the field is that it replaces searching.
function parseReadFirst(plan) {
  const lines = (plan ?? "").split("\n");
  const start = lines.findIndex((line) => /^Read first:/.test(line));
  if (start < 0) return [];
  const values = [lines[start].replace(/^Read first:\s*/, "")];
  for (let cursor = start + 1; cursor < lines.length; cursor += 1) {
    const line = lines[cursor];
    if (line.trim() === "" || /^#/.test(line) || /^[A-Za-z][A-Za-z ]*:/.test(line)) break;
    values.push(line);
  }
  return values.map((value) => value.trim()).filter((value) => value !== "" && value !== "none");
}

function parseOwners(root) {
  const owners = [];
  for (const relative of listFiles(root, "devflow/users")) {
    if (!/\/owner\.md$/.test(relative)) continue;
    const ownerFields = fields(readFile(root, relative));
    const id = ownerFields.get("id") ?? path.posix.basename(path.posix.dirname(relative));
    const identity = ownerFields.get("git") ?? "";
    const comma = identity.indexOf(",");
    owners.push({
      id,
      path: relative,
      name: comma >= 0 ? identity.slice(0, comma).trim() : identity.trim(),
      email: comma >= 0 ? identity.slice(comma + 1).trim() : "",
    });
  }
  return owners.sort((a, b) => byteCompare(a.path, b.path));
}

function currentRoom(root, owners) {
  const name = gitLine(root, ["config", "user.name"], { allowFailure: true });
  const email = gitLine(root, ["config", "user.email"], { allowFailure: true });
  const matches = owners.filter((owner) => {
    const nameMatches = name !== "" && owner.name === name;
    const emailMatches = email !== "" && owner.email === email;
    const nameConflicts = name !== "" && owner.name !== "" && owner.name !== name;
    const emailConflicts = email !== "" && owner.email !== "" && owner.email !== email;
    return (nameMatches || emailMatches) && !(nameMatches && emailConflicts) && !(emailMatches && nameConflicts);
  });
  return matches.length === 1 ? matches[0] : null;
}

function parseProduct(text) {
  const lines = (text ?? "").split("\n");
  const service = /^#\s+(.+)$/.exec(lines.find((line) => /^#\s+/.test(line)) ?? "")?.[1]?.trim() ?? "unknown";
  const start = headingIndex(lines, "## Capabilities");
  const anomalies = text !== null && start < 0
    ? [{ path: "devflow/project/product.md", zone: "product", detail: "capabilities-heading-missing" }]
    : [];
  const body = start < 0 ? [] : lines.slice(start + 1, lines.findIndex((line, index) => index > start && /^##\s+/.test(line)) < 0
    ? lines.length : lines.findIndex((line, index) => index > start && /^##\s+/.test(line)));
  const circled = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
  const capabilities = [];
  for (const line of body) {
    const trimmed = line.replace(/^[-*|\s]+/, "").trim();
    if (!trimmed || /^[-:| ]+$/.test(trimmed)) continue;
    let position = circled.indexOf(trimmed[0]);
    if (position >= 0 && circled.includes(trimmed[1])) continue;
    let name = null;
    if (position >= 0) name = trimmed.slice(1).replace(/^\s*[-:|]\s*/, "").split("|")[0].trim();
    else {
      const numbered = /^(\d+)[.)]\s*(.+)$/.exec(trimmed);
      if (numbered) { position = Number(numbered[1]) - 1; name = numbered[2].split("|")[0].trim(); }
    }
    if (position < 0 || !name) continue;
    name = name.replace(/\s+[—-].*$/, "").replace(/\*\*/g, "").replace(/~~/g, "").trim();
    capabilities.push({ number: position + 2, name, retired: /retired|~~/.test(line) });
  }
  const counts = new Map();
  for (const capability of capabilities) counts.set(capability.number, (counts.get(capability.number) ?? 0) + 1);
  for (const [number, count] of counts) {
    if (count > 1) anomalies.push({
      path: "devflow/project/product.md",
      zone: "product",
      detail: `duplicate-capability-number:${number}`,
    });
  }
  return { service, capabilities, anomalies };
}

function extractSection(text, heading) {
  const lines = (text ?? "").split("\n");
  const index = headingIndex(lines, heading);
  if (index < 0) return null;
  const level = heading.startsWith("### ") ? 3 : 2;
  let end = lines.length;
  for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
    const match = /^(#{1,6})\s/.exec(lines[cursor]);
    if (match && match[1].length <= level) { end = cursor; break; }
  }
  return lines.slice(index + 1, end).join("\n").trim();
}

function parseJsonValue(raw) {
  try { return { ok: true, value: JSON.parse(raw) }; }
  catch (error) { return { ok: false, error: error.message }; }
}

function parseJsonArray(raw) {
  const parsed = parseJsonValue(raw ?? "");
  return parsed.ok && Array.isArray(parsed.value) ? parsed.value : null;
}

function pathStatus(root, relative, headExists) {
  const workingExists = readFile(root, relative) !== null;
  if (!headExists && !workingExists) return "create";
  if (headExists && !workingExists) return "recover";
  if (!headExists && workingExists) return "replace";
  return "present";
}

function legacyV010(text, number) {
  if (text === null || (text.match(/^## Verified state$/gm) ?? []).length !== 0) return false;
  const headings = [...text.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const expected = [
    "Conceptual model", "Main flow", "Lifecycle", "Current behavior", "Invariants",
    "What we decided not to do", "Entrypoints", "Traps", "Verify", "Binding ADRs", "Machine block",
  ];
  if (JSON.stringify(headings) !== JSON.stringify(expected)) return false;
  const machine = extractSection(text, "## Machine block") ?? "";
  const machineFields = fields(machine);
  const allowed = ["Capability number", "Verified at", "Covered cards", "Scope paths", "Scope head", "Docs head"];
  if ([...machineFields.keys()].some((key) => !allowed.includes(key)) || allowed.some((key) => !machineFields.has(key))) return false;
  if (Number(machineFields.get("Capability number")) !== Number(number)) return false;
  if (machineFields.get("Verified at") !== "none" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(machineFields.get("Verified at"))) return false;
  return parseJsonArray(machineFields.get("Covered cards")) !== null && parseJsonArray(machineFields.get("Scope paths")) !== null;
}

function capabilityShape(text, relative, number) {
  const anomalies = [];
  if (text === null) return { boundaryCount: 0, shapeValid: false, anomalies, zone: null };
  const lines = text.split("\n");
  const boundaryCount = lines.filter((line) => line === "## Verified state").length;
  const actualHeadings = lines.filter((line) => /^(?:##|###) /.test(line));
  const boundaryIndex = lines.indexOf("## Verified state");
  const designHeadings = boundaryIndex < 0 ? actualHeadings : actualHeadings.filter((heading) => lines.indexOf(heading) < boundaryIndex);
  const verifiedHeadings = boundaryIndex < 0 ? [] : actualHeadings.filter((heading) => lines.indexOf(heading) >= boundaryIndex);
  if (boundaryCount !== 1) anomalies.push({ path: relative, zone: "boundary", detail: `boundary-count:${boundaryCount}` });
  if (!/^# \d+ \S/.test(lines[0] ?? "")) anomalies.push({ path: relative, zone: "design", detail: "h1-format" });
  if (!/^Purpose: \S/.test(lines[1] ?? "") || !/^Boundary: \S/.test(lines[2] ?? "") || !/^Trust: \S/.test(lines[3] ?? "")) {
    anomalies.push({ path: relative, zone: "design", detail: "fixed-first-four-lines" });
  }
  const designFields = fields(extractSection(text, "## Design metadata") ?? "");
  if (designFields.size !== 2 || !designFields.has("Capability number") || !designFields.has("Design head")) {
    anomalies.push({ path: relative, zone: "design", detail: "design-metadata-field-count" });
  } else if (Number(designFields.get("Capability number")) !== Number(number)) {
    anomalies.push({ path: relative, zone: "design", detail: "capability-number-mismatch" });
  }
  const verificationFields = fields(extractSection(text, "### Verification metadata") ?? "");
  const verificationNames = ["Verified at", "Covered cards", "Scope paths", "Consumed paths", "Scope head"];
  if (verificationFields.size !== 5 || verificationNames.some((key) => !verificationFields.has(key))) {
    anomalies.push({ path: relative, zone: "verified", detail: "verification-metadata-field-count" });
  } else {
    for (const key of ["Covered cards", "Scope paths", "Consumed paths"]) {
      if (parseJsonArray(verificationFields.get(key)) === null) anomalies.push({ path: relative, zone: "verified", detail: `${key.toLowerCase().replace(/ /g, "-")}-json` });
    }
  }
  const expectedDesign = CAPABILITY_SECTION_HEADINGS.slice(0, 6);
  const expectedVerified = CAPABILITY_SECTION_HEADINGS.slice(6);
  if (JSON.stringify(designHeadings) !== JSON.stringify(expectedDesign)) {
    anomalies.push({ path: relative, zone: "design", detail: "section-order" });
  }
  if (boundaryCount === 1 && JSON.stringify(verifiedHeadings) !== JSON.stringify(expectedVerified)) {
    anomalies.push({ path: relative, zone: "verified", detail: "section-order" });
  }
  return {
    boundaryCount,
    shapeValid: anomalies.length === 0,
    anomalies,
    designFields,
    verificationFields,
  };
}

function bindingAdrStatus(root, text) {
  const body = extractSection(text, "## Binding ADRs");
  if (body === null || body === "None." || body === "") return [];
  const paths = [...body.matchAll(/devflow\/project\/decisions\/[A-Za-z0-9._/-]+\.md/g)].map((match) => match[0]);
  return [...new Set(paths)].sort(byteCompare).map((relative) => ({ path: relative, exists: readFile(root, relative) !== null }));
}

async function designHead(root) {
  return gitLine(root, ["log", "-1", "--format=%H", "--",
    "devflow/project/product.md", "devflow/project/arch.md", "devflow/project/glossary.md"], { allowFailure: true });
}

function literalPathspec(relative) {
  return `:(literal)${relative}`;
}

function scopeHead(root, union) {
  if (union.length === 0) return "none";
  return gitLine(root, ["log", "-1", "--format=%H", "--", ...union.map(literalPathspec)], { allowFailure: true });
}

function baselineExpected(snapshot) {
  const treeNames = new Map();
  for (const folder of snapshot.depth1Folders) {
    const identity = folderIdentity(folder);
    if (identity) treeNames.set(Number(identity.number), identity.name);
  }
  for (const card of snapshot.waitingFiles) {
    const match = /^(\d+)-(.+)\.md$/.exec(path.posix.basename(card));
    if (match) treeNames.set(Number(match[1]), match[2]);
  }
  const baselineNames = new Map();
  for (const relative of snapshot.baselineFiles) {
    const match = /^(\d+)-(.+)\.md$/.exec(path.posix.basename(relative));
    if (match) baselineNames.set(Number(match[1]), match[2]);
  }
  const result = [{ number: 1, name: "foundation", retired: false }];
  for (const capability of snapshot.product.capabilities) {
    if (capability.retired) continue;
    result.push({
      number: capability.number,
      name: treeNames.get(capability.number) ?? baselineNames.get(capability.number) ?? capability.name,
      retired: false,
    });
  }
  return result.map((item) => ({
    ...item,
    path: `devflow/project/capabilities/${String(item.number).padStart(2, "0")}-${item.name}.md`,
  }));
}

function currentCompletedFor(snapshot, capabilityNumber) {
  const target = snapshot.depth1Folders.find((folder) => Number(folderIdentity(folder)?.number) === Number(capabilityNumber));
  if (!target) return [];
  return snapshot.cards
    .filter((card) => card.status === "done" && card.path.startsWith(`${target}/`) && !card.path.split("/").some((part) => /\.stale(?:\.|$)/.test(part)))
    .map((card) => card.number)
    .sort(canonicalCardCompare);
}

function sameStringSet(left, right) {
  return JSON.stringify([...left].sort(byteCompare)) === JSON.stringify([...right].sort(byteCompare));
}

async function baselineProjection(snapshot, capabilityFilter) {
  const expected = baselineExpected(snapshot);
  const detailedNumbers = capabilityFilter === undefined ? new Set() : new Set([Number(capabilityFilter)]);
  const output = [];
  const records = [];
  const allAnomalies = [];
  let legacyCount = 0;
  let designRefreshCount = 0;
  let boundaryState = "ok";
  const currentDesignHead = await designHead(snapshot.root);
  for (const item of expected) {
    const sameNumber = snapshot.baselineFiles.filter((relative) => {
      const match = /^(\d+)-/.exec(path.posix.basename(relative));
      return match && Number(match[1]) === item.number;
    });
    const relative = sameNumber.length === 1 ? sameNumber[0] : item.path;
    const headText = gitFile(snapshot.root, snapshot.integration.ref, relative);
    const text = headText;
    const headExists = headText !== null;
    const shape = capabilityShape(text, relative, item.number);
    const legacy = legacyV010(text, item.number);
    if (legacy) legacyCount += 1;
    if (shape.boundaryCount !== 1 && headExists && !legacy) boundaryState = "anomaly";
    const designStored = shape.designFields?.get("Design head") ?? null;
    const designFresh = designStored !== null && currentDesignHead !== "" && designStored === currentDesignHead;
    if (!legacy && (!headExists || (shape.boundaryCount === 1 && (!shape.shapeValid || !designFresh)))) designRefreshCount += 1;
    allAnomalies.push(...shape.anomalies);
    records.push({ capability: item.number, relative, headExists, shape, legacy, designStored, designFresh, currentDesignHead });
    if (!detailedNumbers.has(item.number)) continue;
    const vf = shape.verificationFields ?? new Map();
    const scopePaths = parseJsonArray(vf.get("Scope paths")) ?? [];
    const consumedPaths = parseJsonArray(vf.get("Consumed paths")) ?? [];
    const scopeUnion = [...new Set([...scopePaths, ...consumedPaths])].sort(byteCompare);
    const storedScopeHead = vf.get("Scope head") ?? null;
    const currentScopeHead = scopeHead(snapshot.root, scopeUnion);
    const covered = parseJsonArray(vf.get("Covered cards"));
    const currentCompleted = currentCompletedFor(snapshot, item.number);
    const symmetricDifference = [...new Set([
      ...currentCompleted.filter((value) => !(covered ?? []).includes(value)),
      ...(covered ?? []).filter((value) => !currentCompleted.includes(value)),
    ])].sort(canonicalCardCompare);
    const hasOpen = snapshot.cards.some((card) => card.status !== "done" && card.status !== "stale"
      && Number(folderIdentity(snapshot.depth1Folders.find((folder) => card.path.startsWith(`${folder}/`)) ?? "")?.number) === item.number);
    const consumedSection = extractSection(text, "### Consumed contracts");
    const relationPaths = consumedSection === null || consumedSection === "None." ? []
      : [...consumedSection.matchAll(/(?:^|\|)\s*([^|\n]+)\s*\|/gm)].map((match) => match[1].trim()).filter((value) => value.startsWith("devflow/") || value.includes("/"));
    const verifiedReasons = [];
    if ((vf.get("Verified at") ?? "none") === "none") verifiedReasons.push("verified-at-none");
    if (scopeUnion.length === 0) verifiedReasons.push("empty-scope");
    if (!storedScopeHead || currentScopeHead === "" || storedScopeHead !== currentScopeHead) verifiedReasons.push("scope-head");
    if (!sameStringSet(relationPaths, consumedPaths)) verifiedReasons.push("consumed-contracts");
    if (hasOpen) verifiedReasons.push("open-card");
    const noneSections = CAPABILITY_SECTION_HEADINGS
      .filter((heading) => extractSection(text, heading) === "None.");
    output.push({
      capability: item.number,
      expectedSet: expected.map((entry) => ({ number: entry.number, path: entry.path, retired: entry.retired })),
      pathState: Object.fromEntries(expected.map((entry) => [entry.path,
        pathStatus(snapshot.root, entry.path, gitPathExists(snapshot.root, snapshot.integration.ref, entry.path))])),
      boundary: { count: shape.boundaryCount, status: shape.boundaryCount === 1 ? "ok" : "anomaly" },
      shapeValid: shape.shapeValid,
      anomalies: shape.anomalies,
      noneSections,
      legacyV010: { value: legacy, reasons: legacy ? ["exact-v0.10-shape"] : [] },
      designHead: { stored: designStored, current: currentDesignHead || null },
      scopeHead: { stored: storedScopeHead, current: currentScopeHead || null, union: scopeUnion },
      designFreshness: { value: designFresh ? "fresh" : "hypothesis", reason: designFresh ? null : "design-head" },
      verifiedFreshness: { value: verifiedReasons.length === 0 ? "fresh" : "hypothesis", reasons: verifiedReasons },
      coveredFreshness: { value: covered !== null && !hasOpen && symmetricDifference.length === 0 ? "fresh" : "hypothesis", symmetricDifference },
      bindingAdrStatus: bindingAdrStatus(snapshot.root, text),
    });
  }
  return {
    expected,
    records,
    details: output,
    anomalies: allAnomalies,
    summary: {
      expected: expected.length,
      legacyV010: legacyCount,
      designRefresh: designRefreshCount,
      boundary: boundaryState,
      anomalies: allAnomalies.length,
    },
  };
}

// A note statement may legally contain the literal text `; card-json: `, so the optional design
// suffix is found where the JSON value actually ends, never by splitting on a delimiter the
// value itself can hold.
function jsonStringEnd(text, start) {
  if (text[start] !== "\"") return -1;
  for (let index = start + 1; index < text.length; index += 1) {
    if (text[index] === "\\") { index += 1; continue; }
    if (text[index] === "\"") return index + 1;
  }
  return -1;
}

function capabilityNoteFields(line, start) {
  const noteEnd = jsonStringEnd(line, start);
  const note = noteEnd < 0 ? { ok: false } : parseJsonValue(line.slice(start, noteEnd));
  if (!note.ok || typeof note.value !== "string") return { valid: false, note: note.value };
  const rest = line.slice(noteEnd);
  if (rest === "") return { valid: true, note: note.value };
  const cardHead = "; card-json: ";
  const codeHead = "; code-json: ";
  if (!rest.startsWith(cardHead)) return { valid: false, note: note.value };
  const cardStart = noteEnd + cardHead.length;
  const cardEnd = jsonStringEnd(line, cardStart);
  if (cardEnd < 0 || !line.slice(cardEnd).startsWith(codeHead)) return { valid: false, note: note.value };
  const card = parseJsonValue(line.slice(cardStart, cardEnd));
  const code = parseJsonValue(line.slice(cardEnd + codeHead.length));
  const valid = card.ok && typeof card.value === "string" && code.ok && Array.isArray(code.value)
    && code.value.length > 0 && code.value.every((value) => typeof value === "string");
  return { valid, note: note.value, card: card.value, code: code.value };
}

// The named open item a user-confirmed Intent or Invariant of another capability is written
// as. It is not a reserved head: a line that opens this way and misses the form stays an
// ordinary named open item and stops nothing, so the writer of prose is never blocked. The
// exact form is routable, because the owner the line names is the only writer that can land
// the statement, and that owner is never derived from the card the confirmation happened on.
const DESIGN_OPEN_ITEM = new RegExp(`^${TIMESTAMP} (?<id>\\S+) design open item: capability: (?<capability>\\d+); statement-json: `);

function designOpenItemFields(line) {
  const match = DESIGN_OPEN_ITEM.exec(line);
  if (!match) return {};
  const statementEnd = jsonStringEnd(line, match[0].length);
  if (statementEnd < 0) return {};
  const statement = parseJsonValue(line.slice(match[0].length, statementEnd));
  const cardHead = "; card-json: ";
  if (!statement.ok || typeof statement.value !== "string" || !line.slice(statementEnd).startsWith(cardHead)) return {};
  const card = parseJsonValue(line.slice(statementEnd + cardHead.length));
  if (!card.ok || typeof card.value !== "string" || card.value === "") return {};
  return { design: { id: match.groups.id, capability: match.groups.capability, statement: statement.value, card: card.value } };
}

function parseJournalLine(line, lineNumber) {
  const out = { raw: line, line: lineNumber, kind: "other", valid: true };
  let match;
  if ((match = new RegExp(`^${TIMESTAMP} layer opening: parent: (?<parent>devflow/tree(?:/[^;]+)?); children: (?<children>${FOLDER_NUMBER}(?:\\+${FOLDER_NUMBER})*); source-json: (?<sourceJson>.+)$`).exec(line))) {
    const source = parseJsonValue(match.groups.sourceJson);
    return { ...out, kind: "layer-opening", ...match.groups, source: source.value, valid: source.ok && typeof source.value === "string" };
  }
  if ((match = new RegExp(`^${TIMESTAMP} re-split pending: folder: (?<folder>devflow/tree/[^;]+); stale: (?<stale>${CARD_NUMBER}(?:\\+${CARD_NUMBER})*); source: (?<source>devflow/project/[^#]+#.+)$`).exec(line))) {
    return { ...out, kind: "re-split", ...match.groups };
  }
  if ((match = new RegExp(`^${TIMESTAMP} maintenance routing pending: request-json: (?<requestJson>.+)$`).exec(line))) {
    const request = parseJsonValue(match.groups.requestJson);
    return { ...out, kind: "maintenance-request", ...match.groups, request: request.value, valid: request.ok && typeof request.value === "string" };
  }
  if ((match = new RegExp(`^${TIMESTAMP} product re-run pending: statement-json: (?<statementJson>.+)$`).exec(line))) {
    const statement = parseJsonValue(match.groups.statementJson);
    return { ...out, kind: "product-rerun", ...match.groups, statement: statement.value, valid: statement.ok && typeof statement.value === "string" };
  }
  if ((match = new RegExp(`^${TIMESTAMP} product verification requested$`).exec(line))) return { ...out, kind: "product-requested", ...match.groups };
  if ((match = new RegExp(`^${TIMESTAMP} product verification running: trigger: (?<trigger>requested|automatic); product: (?<product>[^;]+); verification: (?<verification>[^;]+); code: (?<code>[^;]+)$`).exec(line))) return { ...out, kind: "product-running", ...match.groups };
  if ((match = new RegExp(`^${TIMESTAMP} product verification result: trigger: (?<trigger>requested|automatic); product: (?<product>[^;]+); verification: (?<verification>[^;]+); code: (?<code>[^;]+); verdict: (?<verdict>pass|fail|unverified)$`).exec(line))) return { ...out, kind: "product-result", ...match.groups };
  if ((match = new RegExp(`^${TIMESTAMP} capability closing: folder: (?<folder>devflow/tree/[^;]+); head: (?<head>[0-9a-f]{40,64}); product: (?<product>[^;]+); verification: (?<verification>[^;]+); capability: (?<capability>[^;]+)$`).exec(line))) return { ...out, kind: "capability-closing", ...match.groups };
  // One kind, two forms: the bare observation another capability's closure harvests, and the
  // design form a confirmed Intent or Invariant of the capability being worked on carries —
  // the same statement plus the exact card and the exact code paths. No commit basis is
  // written here: the first commit holding this exact line is the anchor, and that checkpoint
  // is itself the card and code snapshot.
  if ((match = new RegExp(`^${TIMESTAMP} capability note: capability: (?<capability>\\d+); note-json: `).exec(line))) {
    return { ...out, kind: "capability-note", ...match.groups, ...capabilityNoteFields(line, match[0].length) };
  }
  if ((match = new RegExp(`^${TIMESTAMP} (?<role>audit|retrospective) requested: (?<target>\\d+|product)$`).exec(line))) return { ...out, kind: `${match.groups.role}-requested`, ...match.groups };
  if ((match = new RegExp(`^${TIMESTAMP} (?<state>evidence-wait|evidence-finalizing): card-json: (?<cardJson>.+); checkpoint: (?<checkpoint>${CARD_NUMBER} wip: [0-9a-f]{40,64}); check-json: (?<checkJson>.+)$`).exec(line))) {
    const card = parseJsonValue(match.groups.cardJson);
    const check = parseJsonValue(match.groups.checkJson);
    return { ...out, kind: match.groups.state, ...match.groups, card: card.value, check: check.value,
      valid: card.ok && check.ok && typeof card.value === "string" && typeof check.value === "string" };
  }
  const timestamped = new RegExp(`^${TIMESTAMP} (?<body>.+)$`).exec(line);
  if (timestamped) {
    const reserved = RESERVED_JOURNAL_HEADS.find((head) => timestamped.groups.body.startsWith(head));
    if (reserved) return { ...out, kind: "invalid", valid: false, ...timestamped.groups, reason: `reserved-format:${reserved}` };
    return { ...out, kind: "attributed", ...timestamped.groups, ...designOpenItemFields(line) };
  }
  const body = line.replace(/^\s*(?:[-*+]\s+)?/, "");
  const reserved = RESERVED_JOURNAL_HEADS.find((head) => body.startsWith(head));
  return reserved ? { ...out, kind: "invalid", valid: false, reason: `reserved-format:${reserved}` } : null;
}

function parseJournal(text) {
  if (text === null || text === "") return [];
  return text.split("\n").map((line, index) => ({ line, index: index + 1 })).filter((item) => item.line !== "")
    .map((item) => parseJournalLine(item.line, item.index)).filter(Boolean);
}

function parseHandoff(snapshot) {
  const { root, room } = snapshot;
  if (!room) return { date: null, stale: true, nextStep: null, openItems: [] };
  const relative = `devflow/users/${room.id}/HANDOFF.md`;
  const text = readFile(root, relative);
  if (text === null || text.trim() === "") return { date: null, stale: false, nextStep: null, openItems: [] };
  const lines = text.split("\n");
  const date = /^# HANDOFF · (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/.exec(lines[0] ?? "")?.[1] ?? null;
  const nextBody = extractSection(text, "## Next single step") ?? "";
  const pathMatch = /devflow\/tree\/[A-Za-z0-9._/ -]+\.md/.exec(nextBody);
  const parsedNextStep = pathMatch?.[0]?.trim() ?? nextBody.split("\n").find((line) => line.trim())?.trim() ?? null;
  const nextStep = parsedNextStep === "none" ? null : parsedNextStep;
  const legacy = extractSection(text, "## Open decisions");
  const openItems = legacy && legacy !== "None." ? legacy.split("\n").filter((line) => line.trim()).map((line) => line.trim()) : [];
  let stale = date === null;
  // Freshness is measured against the history this room claimed, and with nothing claimed
  // there is none: `git log -- ` with no path asks the whole repository instead, which stales
  // a HANDOFF written a moment ago.
  const claimed = [...new Set([
    ...snapshot.cards.filter((card) => card.claimant === room.id).map((card) => card.path),
    ...gitNulList(root, ["ls-tree", "-r", "--name-only", "-z", "HEAD", "--", "devflow/tree"])
      .filter((relative) => {
        const card = cardIdentity(relative);
        return card?.status === "claimed" && card.claimant === room.id;
      }),
  ])].sort(byteCompare);
  if (date !== null && claimed.length > 0) {
    const newest = gitLine(root, ["log", "-1", "--format=%cI", "--", ...claimed], { allowFailure: true });
    if (newest && Date.parse(newest) > Date.parse(date)) stale = true;
  }
  if (nextStep && handoffPathMatches(snapshot, nextStep).length !== 1) stale = true;
  return { date, stale, nextStep, openItems };
}

function parseStatus(root) {
  const bytes = gitRun(root, ["--no-optional-locks", "status", "--porcelain=v1", "-z", "--untracked-files=all"], { allowFailure: true });
  if (bytes.status !== 0) return [];
  const entries = decodeUtf8(bytes.stdout, "git status").split("\0").filter(Boolean);
  const result = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const code = entry.slice(0, 2);
    let relative = entry.slice(3);
    let from = null;
    if (code.includes("R") || code.includes("C")) {
      from = entries[index + 1] ?? null;
      index += 1;
    }
    result.push({ code, path: relative.replace(/\\/g, "/"), from: from?.replace(/\\/g, "/") ?? null });
  }
  return result.sort((a, b) => byteCompare(a.path, b.path));
}

function resolveIntegration(root, archText, head, branch) {
  const archFields = fields(archText);
  const configured = archFields.get("integration");
  const name = !configured || configured === branch ? (branch || "HEAD") : configured;
  const ref = !configured || configured === branch ? "HEAD" : configured;
  const hash = gitLine(root, ["rev-parse", "--verify", ref], { allowFailure: true });
  return { branch: name, ref: hash ? ref : "HEAD", hash: hash || (ref === "HEAD" ? head : null), networkNeeded: !hash && ref !== "HEAD" };
}

function openGitOperation(root) {
  const gitPath = (name) => {
    const relative = gitLine(root, ["rev-parse", "--git-path", name], { allowFailure: true });
    return relative ? path.resolve(root, relative) : null;
  };
  const merge = gitPath("MERGE_HEAD");
  const rebaseMerge = gitPath("rebase-merge");
  const rebaseApply = gitPath("rebase-apply");
  let kind = "none";
  if (merge && fs.existsSync(merge)) kind = "merge";
  else if ((rebaseMerge && fs.existsSync(rebaseMerge)) || (rebaseApply && fs.existsSync(rebaseApply))) kind = "rebase";
  const unmerged = gitNulList(root, ["diff", "--name-only", "-z", "--diff-filter=U"]);
  return { kind, unmerged };
}

function directBaselineFiles(root) {
  const base = path.join(root, "devflow", "project", "capabilities");
  if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `devflow/project/capabilities/${entry.name}`)
    .sort(byteCompare);
}

function directTree(root) {
  const base = path.join(root, "devflow", "tree");
  if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) return { folders: [], files: [] };
  const entries = fs.readdirSync(base, { withFileTypes: true });
  return {
    folders: entries.filter((entry) => entry.isDirectory()).map((entry) => `devflow/tree/${entry.name}`).sort(byteCompare),
    files: entries.filter((entry) => entry.isFile()).map((entry) => `devflow/tree/${entry.name}`).sort(byteCompare),
  };
}

async function revisions(snapshot, capabilityNumber) {
  const product = readFile(snapshot.root, "devflow/project/product.md") === null ? "none"
    : revisionFromGit(gitRun(snapshot.root, ["hash-object", "devflow/project/product.md"], { allowFailure: true }), "unresolved");
  const verificationPaths = [
    "devflow/project/arch.md", "devflow/project/code-style.md", "devflow/project/glossary.md",
  ].filter((relative) => gitPathExists(snapshot.root, "HEAD", relative));
  const verification = await nativeBinaryHash(snapshot.root, "HEAD", verificationPaths) ?? "unresolved";
  const code = revisionFromGit(gitRun(snapshot.root,
    ["log", "-1", "--format=%H", "--", ".", ":(exclude)devflow/**"], { allowFailure: true }), "none");
  let capability = "not-applicable";
  if (capabilityNumber !== undefined) {
    const folders = snapshot.depth1Folders.filter((folder) => Number(folderIdentity(folder)?.number) === Number(capabilityNumber));
    if (folders.length !== 1) capability = "unresolved";
    else {
      const targetCards = doneDescendantCards(snapshot, folders[0]);
      const byNumber = new Map();
      for (const card of snapshot.cards) {
        const values = byNumber.get(card.number) ?? [];
        values.push(card);
        byNumber.set(card.number, values);
      }
      const selected = new Map(targetCards.map((card) => [card.path, card]));
      let unresolved = targetCards.length === 0;
      for (const card of targetCards) {
        for (const number of card.depends.numbers) {
          const matches = (byNumber.get(number) ?? []).filter((candidate) => candidate.status === "done");
          if (matches.length !== 1) unresolved = true;
          else selected.set(matches[0].path, matches[0]);
        }
      }
      const paths = [...selected.keys()].filter((relative) => gitPathExists(snapshot.root, "HEAD", relative)).sort(byteCompare);
      capability = unresolved || paths.length !== selected.size ? "unresolved"
        : await nativeBinaryHash(snapshot.root, "HEAD", paths) ?? "unresolved";
    }
  }
  return { product, verification, code, capability };
}

async function loadSnapshot(options) {
  const root = options.root;
  const head = gitLine(root, ["rev-parse", "--verify", "HEAD"], { allowFailure: true }) || "none";
  const branch = gitLine(root, ["symbolic-ref", "--quiet", "--short", "HEAD"], { allowFailure: true }) || null;
  const productText = readFile(root, "devflow/project/product.md");
  const archText = readFile(root, "devflow/project/arch.md");
  const tree = directTree(root);
  const closedDepth1 = tree.folders.filter((relative) => ["done", "stale"].includes(folderIdentity(relative)?.status));
  const cardPaths = listFiles(root, "devflow/tree").filter((relative) => relative.endsWith(".md") && cardIdentity(relative));
  const cards = cardPaths.map((relative) => parseCard(root, relative,
    closedDepth1.some((folder) => relative.startsWith(`${folder}/`))))
    .filter(Boolean).sort((a, b) => canonicalCardCompare(a.number, b.number) || byteCompare(a.path, b.path));
  const directories = listDirectories(root, "devflow/tree");
  const owners = parseOwners(root);
  const room = currentRoom(root, owners);
  const integration = resolveIntegration(root, archText, head, branch);
  const status = parseStatus(root);
  const journalText = readFile(root, "devflow/journal.md");
  const journal = parseJournal(journalText);
  const verifyFiles = listFiles(root, "devflow/tree").filter((relative) => path.posix.basename(relative) === "verify.md");
  const depth1Folders = tree.folders;
  const waitingFiles = tree.files.filter((relative) => relative.endsWith(".md") && !relative.endsWith("verify.md") && cardIdentity(relative) === null);
  const baselineFiles = directBaselineFiles(root);
  const snapshot = {
    options,
    root,
    head,
    branch,
    integration,
    productText,
    product: parseProduct(productText),
    archText,
    archFields: fields(archText),
    treePresent: fs.existsSync(path.join(root, "devflow", "tree")) && fs.statSync(path.join(root, "devflow", "tree")).isDirectory(),
    depth1Folders,
    closedDepth1,
    directories,
    waitingFiles,
    baselineFiles,
    cards,
    owners,
    room,
    status,
    journalText,
    journal,
    verifyFiles,
    verifyTexts: new Map(verifyFiles.map((relative) => [relative, readFile(root, relative)])),
    handoff: null,
    openOperation: openGitOperation(root),
    worktrees: gitText(root, ["worktree", "list", "--porcelain"], { allowFailure: true }).split("\n").filter((line) => line.startsWith("worktree ")).length,
  };
  snapshot.handoff = parseHandoff(snapshot);
  snapshot.revisions = await revisions(snapshot, options.capability);
  snapshot.baseline = await baselineProjection(snapshot, options.capability);
  return snapshot;
}

function zoneBag() {
  return Object.fromEntries(ZONE_DEFINITIONS.map((definition) => [definition.zone, { summary: null, entries: [] }]));
}

function addEntry(zones, zone, kind, values = {}) {
  if (!ROUTE_RANK.has(`${zone}.${kind}`)) fail(`internal route kind is not registered: ${zone}.${kind}`);
  zones[zone].entries.push({ kind, ...values });
}

function reasonForJournal(line) {
  return line.reason ?? (line.valid ? null : `canonical-${line.kind}-format`);
}

function verificationRecordParts(text) {
  const lines = (text ?? "").split("\n");
  const parts = [];
  const failureStart = lines.findIndex((line) => /^Failure history:\s*/.test(line));
  if (failureStart >= 0) {
    let end = lines.length;
    for (let index = failureStart + 1; index < lines.length; index += 1) {
      if (/^(?:Regression|Standards|Provisional|Journal sweep):/.test(lines[index]) || /^##\s/.test(lines[index])) {
        end = index;
        break;
      }
    }
    const inline = lines[failureStart].replace(/^Failure history:\s*/, "");
    const bodyLines = [...(inline ? [inline] : []), ...lines.slice(failureStart + 1, end)];
    parts.push({ name: "Failure history", role: null, start: failureStart + 1, lines: bodyLines });
  }
  for (const role of ["Audit", "Retrospective"]) {
    const heading = `## ${role}`;
    const start = lines.findIndex((line) => line === heading);
    if (start < 0) continue;
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      if (/^#{1,2}\s/.test(lines[index])) { end = index; break; }
    }
    parts.push({ name: role, role, start: start + 1, lines: lines.slice(start + 1, end) });
  }
  return parts;
}

function eventKeys(part) {
  return new Set(part.lines.flatMap((line) => [...line.matchAll(/event key:\s*([^·;]+?)(?=\s*·|\s*;|$)/g)]
    .map((match) => match[1].trim())));
}

function preparedScopeReason(object) {
  if (object.result.startsWith("routing: fix cards ")) {
    const numbers = object.result.slice("routing: fix cards ".length).split("+");
    const outputs = object.operations.flatMap((operation) => operation.op === "write" ? [operation.path]
      : operation.op === "move" ? [operation.to] : []).map(cardIdentity).filter(Boolean).map((identity) => identity.number);
    if (numbers.some((number) => !outputs.includes(number))) return "prepared-scope-fix-cards";
    return null;
  }
  if (object.result.startsWith("routing: documents ")) {
    const documents = parseJsonArray(object.result.slice("routing: documents ".length));
    if (!documents || documents.length === 0 || documents.some((relative) => typeof relative !== "string" || !relative.startsWith("devflow/project/"))) return "prepared-scope-documents";
    const changed = object.operations.flatMap((operation) => operation.op === "move" ? [operation.from, operation.to] : [operation.path]);
    if (documents.some((relative) => !changed.includes(relative))) return "prepared-scope-documents";
    return null;
  }
  const timestamp = /^routing: product re-run (.+)$/.exec(object.result)?.[1];
  if (timestamp && !object.operations.some((operation) => operation.op === "write" && operation.path === "devflow/journal.md"
      && operation.content.includes(`${timestamp} product re-run pending:`))) return "prepared-scope-product-rerun";
  return null;
}

function preparedPrefix(snapshot, relative, raw, object, states, candidatePaths) {
  const changed = new Set([
    ...gitNulList(snapshot.root, ["diff", "--name-only", "--no-renames", "-z", object.base]),
    ...gitNulList(snapshot.root, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
  const currentVerify = readFile(snapshot.root, relative);
  const token = `routing prepared: ${raw}`;
  if (currentVerify === null || currentVerify.split(token).length !== 2) return { ok: false, reason: "prepared-source-prefix" };
  const normalizedVerify = currentVerify.replace(token, "routing: pending");
  const baseCandidates = [relative];
  let reversed = relative;
  for (const operation of [...object.operations].reverse()) {
    if (operation.op !== "move" || !(reversed === operation.to || reversed.startsWith(`${operation.to}/`))) continue;
    reversed = `${operation.from}${reversed.slice(operation.to.length)}`;
    baseCandidates.push(reversed);
  }
  const baseRelative = baseCandidates.find((candidate) => gitFile(snapshot.root, object.base, candidate) === normalizedVerify);
  if (!baseRelative) return { ok: false, reason: "prepared-source-prefix" };
  if (baseRelative === relative) changed.delete(relative);
  for (let prefix = 0; prefix < states.length; prefix += 1) {
    const state = states[prefix];
    const expectedChanged = new Set();
    for (const candidate of candidatePaths) {
      const baseExists = gitPathExists(snapshot.root, object.base, candidate);
      const currentExists = state.tree.has(candidate);
      const baseContent = baseExists ? gitFile(snapshot.root, object.base, candidate) : null;
      const expectedContent = currentExists ? (state.contents.has(candidate) ? state.contents.get(candidate) : baseContent) : null;
      if (baseExists !== currentExists || (currentExists && baseContent !== expectedContent)) expectedChanged.add(candidate);
    }
    if (JSON.stringify([...changed].sort(byteCompare)) !== JSON.stringify([...expectedChanged].sort(byteCompare))) continue;
    if ([...expectedChanged].every((candidate) => (candidate === relative ? normalizedVerify : readFile(snapshot.root, candidate)) === (state.tree.has(candidate)
      ? (state.contents.has(candidate) ? state.contents.get(candidate) : gitFile(snapshot.root, object.base, candidate)) : null))) return { ok: true, prefix, baseRelative };
  }
  return { ok: false, reason: "prepared-prefix" };
}

function validatePreparedObject(snapshot, relative, raw, lineNumber) {
  const parsed = parseJsonValue(raw);
  if (!parsed.ok || parsed.value === null || Array.isArray(parsed.value) || typeof parsed.value !== "object") {
    return { ok: false, reason: `prepared-json:${parsed.error ?? "not-object"}` };
  }
  const object = parsed.value;
  if (JSON.stringify(Object.keys(object).sort()) !== JSON.stringify(["base", "operations", "result"])) return { ok: false, reason: "prepared-keys" };
  if (!/^[0-9a-f]{40,64}$/.test(object.base ?? "")) return { ok: false, reason: "prepared-base" };
  if (!/^(routing: (?:fix cards [0-9a-z.+]+|documents \[.*\]|product re-run \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z))$/.test(object.result ?? "")) return { ok: false, reason: "prepared-result" };
  if (!Array.isArray(object.operations) || object.operations.length === 0) return { ok: false, reason: "prepared-operations" };
  const tree = new Set(gitNulList(snapshot.root, ["ls-tree", "-r", "--name-only", "-z", object.base]));
  const contents = new Map();
  const states = [{ tree: new Set(tree), contents: new Map(contents) }];
  const candidatePaths = new Set();
  const contentAt = (relativePath) => contents.has(relativePath) ? contents.get(relativePath) : gitFile(snapshot.root, object.base, relativePath);
  for (const operation of object.operations) {
    if (!operation || typeof operation !== "object" || Array.isArray(operation)) return { ok: false, reason: "operation-object" };
    const keys = Object.keys(operation).sort();
    const expected = operation.op === "write" ? ["content", "op", "path"]
      : operation.op === "move" ? ["from", "op", "to"]
        : operation.op === "delete" ? ["op", "path"] : null;
    if (expected === null || JSON.stringify(keys) !== JSON.stringify(expected)) return { ok: false, reason: "operation-schema" };
    const paths = operation.op === "move" ? [operation.from, operation.to] : [operation.path];
    if (operation.op !== "move") for (const value of paths) candidatePaths.add(value);
    if (paths.some((value) => typeof value !== "string" || !value.startsWith("devflow/") || value.split("/").includes(".."))) return { ok: false, reason: "operation-path" };
    if (["write", "delete"].includes(operation.op) && operation.path === relative) return { ok: false, reason: "operation-current-verify" };
    if (operation.op === "write") {
      if (typeof operation.content !== "string") return { ok: false, reason: "operation-write-content" };
      const normalizedContent = normalizeFileText(operation.content);
      if (tree.has(operation.path) && contentAt(operation.path) === normalizedContent) return { ok: false, reason: "operation-write-no-change" };
      tree.add(operation.path);
      contents.set(operation.path, normalizedContent);
    } else if (operation.op === "delete") {
      if (!tree.has(operation.path)) return { ok: false, reason: "operation-delete-input" };
      tree.delete(operation.path);
      contents.delete(operation.path);
    } else {
      if (normalizedStatusPath(operation.from) !== normalizedStatusPath(operation.to)) return { ok: false, reason: "operation-move-status-path" };
      const members = [...tree].filter((member) => member === operation.from || member.startsWith(`${operation.from}/`));
      if (members.length === 0) return { ok: false, reason: "operation-move-input" };
      const destinations = members.map((member) => `${operation.to}${member.slice(operation.from.length)}`);
      if (destinations.some((member) => tree.has(member))) return { ok: false, reason: "operation-move-destination" };
      for (let index = 0; index < members.length; index += 1) {
        const member = members[index];
        const destination = destinations[index];
        candidatePaths.add(member);
        candidatePaths.add(destination);
        const content = contentAt(member);
        tree.delete(member);
        contents.delete(member);
        tree.add(destination);
        contents.set(destination, content);
      }
    }
    states.push({ tree: new Set(tree), contents: new Map(contents) });
  }
  const headRelation = snapshot.head === object.base || gitLine(snapshot.root, ["rev-parse", "HEAD^"], { allowFailure: true }) === object.base;
  if (!headRelation) return { ok: false, reason: "prepared-base-relation" };
  const scopeReason = preparedScopeReason(object);
  if (scopeReason) return { ok: false, reason: scopeReason };
  const prefix = preparedPrefix(snapshot, relative, raw, object, states, candidatePaths);
  if (!prefix.ok) return prefix;
  return { ok: true, object, lineNumber, prefix: prefix.prefix, basePath: prefix.baseRelative };
}

function verifyProjection(snapshot) {
  const result = {
    prepared: [],
    invalidPrepared: [],
    sourceMigration: [],
    eventRouting: [],
    eventDecision: [],
    failureRouting: [],
    eventPending: [],
    findings: [],
    records: [],
    root: null,
  };
  for (const [relative, text] of snapshot.verifyTexts) {
    const lines = (text ?? "").split("\n");
    const parts = verificationRecordParts(text);
    const failure = parts.find((part) => part.name === "Failure history");
    const audit = parts.find((part) => part.name === "Audit");
    const retrospective = parts.find((part) => part.name === "Retrospective");
    const recordFields = fields(text);
    const folder = relative === "devflow/tree/verify.md" ? null : relative.split("/").slice(0, 3).join("/");
    const folderInfo = folderIdentity(folder ?? "");
    const current = ["Product revision", "Verification revision", "Code revision", "Capability revision"].every((name) => recordFields.has(name));
    const executed = recordFields.get("Executed") ?? "";
    const channelMatch = /^unverified: channel unavailable — (?<command>.+); timeout=(?<timeout>.+)$/.exec(executed);
    const channelUnavailable = channelMatch !== null;
    const channel = channelMatch ? { command: channelMatch.groups.command, timeout: channelMatch.groups.timeout } : null;
    const failureIds = [...(failure?.lines.join("\n") ?? "").matchAll(/source id:\s*(\d+)[^\n]*failure:/g)].map((match) => Number(match[1]));
    result.records.push({
      path: relative,
      current,
      target: folderInfo ? Number(folderInfo.number) : "product",
      capabilityDone: folderInfo?.status === "done",
      channelUnavailable,
      channel,
      failureMax: failureIds.length > 0 ? Math.max(...failureIds) : null,
      auditKeys: eventKeys(audit ?? { lines: [] }),
      retrospectiveKeys: eventKeys(retrospective ?? { lines: [] }),
    });
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const role = nearestEventRole(lines, index);
      const prepared = /routing prepared:\s*(\{.*\})\s*$/.exec(line);
      if (prepared) {
        const validated = validatePreparedObject(snapshot, relative, prepared[1], index + 1);
        if (validated.ok) result.prepared.push({
          path: relative,
          base: validated.object.base,
          basePath: validated.basePath,
          result: validated.object.result,
          operations: validated.object.operations,
          prefix: validated.prefix,
          line: index + 1,
          sourceSection: role ?? (!role && failure && index >= failure.start && index < failure.start + failure.lines.length ? "Failure history" : null),
          sourceId: nearestSourceId(lines, index),
          findingNumber: role ? nearestFindingNumber(lines, index) : null,
        });
        else result.invalidPrepared.push({ path: relative, line: index + 1, raw: line, reason: validated.reason });
      }
      if (role && /routing\s*[·:]\s*source id:\s*\d+/i.test(line)) result.eventRouting.push({ path: relative, line: index + 1 });
      if (role && /awaiting user decision/i.test(line)) result.eventDecision.push({ path: relative, line: index + 1 });
      if (!role && /routing:\s*pending\s*$/.test(line) && failure && index >= failure.start && index < failure.start + failure.lines.length) {
        result.failureRouting.push({ path: relative, line: index + 1, sourceId: nearestSourceId(lines, index) });
      }
      if (role && /pending\s*[·:]\s*source id:\s*\d+/i.test(line)) result.eventPending.push({ path: relative, line: index + 1, sourceId: Number(/source id:\s*(\d+)/i.exec(line)?.[1] ?? 0), role });
      if (role && /^\s+\d+\.\s+\S/.test(line)) result.findings.push(`${relative}:${index + 1} ${line.trim()}`);
    }
    for (const part of parts) {
      const body = part.lines.join("\n").trim();
      const empty = body === "" || body === "None."
        || (part.name === "Failure history" && /^-\s+none\.?$/i.test(body));
      if (!empty && body !== "- not run") {
        for (const line of part.lines.filter((value) => /^-\s+/.test(value))) {
          if (!/source id:\s*\d+/.test(line)) result.sourceMigration.push({ path: relative, section: part.name, raw: line.trim() });
        }
      }
    }
    if (relative === "devflow/tree/verify.md") {
      result.root = {
        path: relative,
        verdict: recordFields.get("Verdict") ?? null,
        product: recordFields.get("Product revision") ?? null,
        verification: recordFields.get("Verification revision") ?? null,
        code: recordFields.get("Code revision") ?? null,
        channelUnavailable,
        channel,
        current,
      };
    }
  }
  return result;
}

function nearestSourceId(lines, index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    const match = /source id:\s*(\d+)/.exec(lines[cursor]);
    if (match) return Number(match[1]);
  }
  return null;
}

function nearestFindingNumber(lines, index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    const match = /^\s+(\d+)\.\s+/.exec(lines[cursor]);
    if (match) return Number(match[1]);
    if (/^-\s+/.test(lines[cursor])) return null;
  }
  return null;
}

function nearestEventRole(lines, index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (lines[cursor] === "## Audit") return "Audit";
    if (lines[cursor] === "## Retrospective") return "Retrospective";
    if (/^## /.test(lines[cursor])) return null;
  }
  return null;
}

function claimAuthorMismatch(snapshot, card, owner) {
  const claim = gitLine(snapshot.root, ["log", "-1", "--format=%H", "--diff-filter=A", "--no-renames", "--", card.path], { allowFailure: true });
  if (!claim) return false;
  let commits = gitText(snapshot.root, ["rev-list", "--reverse", `${claim}^..${snapshot.integration.ref}`], { allowFailure: true }).split("\n").filter(Boolean);
  if (commits.length === 0) commits = [claim, ...gitText(snapshot.root, ["rev-list", "--reverse", `${claim}..${snapshot.integration.ref}`], { allowFailure: true }).split("\n").filter(Boolean)];
  for (const commit of commits) {
    const identity = gitText(snapshot.root, ["show", "-s", "--format=%an%x00%ae", commit], { allowFailure: true }).trim().split("\0");
    const changed = gitNulList(snapshot.root, ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", commit]);
    if (!changed.some((relative) => cardIdentity(relative)?.number === card.number)) continue;
    if ((owner.name && identity[0] !== owner.name) || (owner.email && identity[1] !== owner.email)) return true;
  }
  return false;
}

function evidenceIntegrityReason(snapshot, line) {
  if (!line.valid) return "evidence-json";
  const expected = cardIdentity(line.card ?? "");
  const current = snapshot.cards.filter((card) => card.path === line.card && card.status === "claimed");
  const hash = /([0-9a-f]{40,64})$/.exec(line.checkpoint ?? "")?.[1] ?? "";
  if (!hash || gitRun(snapshot.root, ["cat-file", "-e", `${hash}^{commit}`], { allowFailure: true }).status !== 0) return "checkpoint-missing";
  const checkpointCard = gitFile(snapshot.root, hash, line.card);
  let finalizingDone = null;
  if (line.kind === "evidence-finalizing" && current.length === 0 && expected) {
    const candidates = snapshot.cards.filter((card) => card.status === "done" && card.number === expected.number
      && card.name === expected.name && path.posix.dirname(card.path) === path.posix.dirname(line.card));
    if (candidates.length === 1 && checkpointCard !== null && claimMoveBytesMatch(snapshot, line.card, candidates[0].path)) finalizingDone = candidates[0];
    else return `finalizing-done-resolves-${candidates.length}`;
  } else if (current.length !== 1) return `card-resolves-${current.length}`;
  const claimant = current[0]?.claimant ?? /\.wip-([a-z0-9]{2,8})(?=\.|$)/.exec(line.card ?? "")?.[1] ?? null;
  const subject = gitLine(snapshot.root, ["show", "-s", "--format=%s", hash], { allowFailure: true });
  if (!expected || !claimant || subject !== `${claimant} ${expected.number} wip: evidence-wait`) return "checkpoint-subject";
  const changed = gitNulList(snapshot.root, ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", hash]);
  if (!changed.includes(line.card)) return "checkpoint-path";
  if (checkpointCard === null) return "checkpoint-card-missing";
  const checks = progressMachineLines(checkpointCard).filter((line) => line.kind === "remote-evidence" && line.valid);
  if (checks.length === 0) return "checkpoint-check-missing";
  const parsed = parseJsonValue(checks.at(-1).checkJson);
  if (!parsed.ok || typeof parsed.value !== "string" || parsed.value !== line.check) return "checkpoint-check-json";
  return finalizingDone ? null : null;
}

function resolutionCountWithHead(snapshot, relative, currentText, countInText) {
  const currentCount = countInText(currentText);
  return currentCount === 0 ? countInText(gitFile(snapshot.root, snapshot.head, relative)) : currentCount;
}

function verifyLocatorResolutionCount(snapshot, verify, relative, preparedMatches, countInText) {
  const currentCount = countInText(snapshot.verifyTexts.get(relative) ?? readFile(snapshot.root, relative));
  if (currentCount !== 0) return currentCount;
  const seen = new Set();
  let preparedCount = 0;
  for (const item of verify.prepared.filter((candidate) => candidate.basePath === relative && preparedMatches(candidate))) {
    const key = `${item.base}\0${item.basePath}`;
    if (seen.has(key)) continue;
    seen.add(key);
    preparedCount += countInText(gitFile(snapshot.root, item.base, item.basePath));
  }
  return preparedCount === 0 ? countInText(gitFile(snapshot.root, snapshot.head, relative)) : preparedCount;
}

function locatorResolutionCount(snapshot, verify, locator) {
  let match;
  if ((match = /^core:(devflow\/[^#]+)#(.+)$/.exec(locator))) {
    const countInText = (text) => (text ?? "").split("\n")
      .filter((line) => normalizedHeading(line).replace(/^#{1,6}\s+/, "") === match[2]).length;
    return resolutionCountWithHead(snapshot, match[1], readFile(snapshot.root, match[1]), countInText);
  }
  if ((match = /^card:(devflow\/[^@]+)@([0-9a-f]{40,64})$/.exec(locator))) {
    return gitFile(snapshot.root, match[2], match[1]) === null ? 0 : 1;
  }
  if ((match = /^journal:(.+)$/.exec(locator))) {
    const countInText = (text) => (text ?? "").split("\n").filter((line) => line === match[1]).length;
    return resolutionCountWithHead(snapshot, "devflow/journal.md", snapshot.journalText, countInText);
  }
  if ((match = /^verify:(devflow\/[^#]+)#Failure history@(\d+)$/.exec(locator))) {
    const countInText = (text) => verificationRecordParts(text).find((item) => item.name === "Failure history")
      ?.lines.filter((line) => new RegExp(`\\bsource id:\\s*${match[2]}\\s*(?:[;·]|$)`).test(line)).length ?? 0;
    return verifyLocatorResolutionCount(snapshot, verify, match[1],
      (item) => item.sourceSection === "Failure history" && item.sourceId === Number(match[2]), countInText);
  }
  if ((match = /^verify:(devflow\/[^#]+)#(Audit|Retrospective)@(\d+)\/(\d+)$/.exec(locator))) {
    const countInText = (text) => {
      const part = verificationRecordParts(text).find((item) => item.name === match[2]);
      if (!part) return 0;
      let inEvent = false;
      let count = 0;
      for (const line of part.lines) {
        if (/^-\s+/.test(line)) inEvent = new RegExp(`source id:\\s*${match[3]}(?:\\s*[·;]|$)`).test(line);
        else if (inEvent && new RegExp(`^\\s+${match[4]}\\.\\s+`).test(line)) count += 1;
      }
      return count;
    };
    return verifyLocatorResolutionCount(snapshot, verify, match[1],
      (item) => item.sourceSection === match[2] && item.sourceId === Number(match[3]) && item.findingNumber === Number(match[4]), countInText);
  }
  return 0;
}

function integrity(snapshot, verify) {
  const anomalies = [];
  const report = (item, blocking, values) => anomalies.push({ item, blocking, ...values });
  const roomIds = new Set(snapshot.owners.map((owner) => owner.id));

  for (const card of snapshot.cards.filter((item) => !item.closedFolder)) {
    if (card.claimant && !roomIds.has(card.claimant)) report(1, false, { path: card.path, reason: `orphan-claim:${card.claimant}` });
  }
  const byNumber = new Map();
  for (const card of snapshot.cards) {
    const values = byNumber.get(card.number) ?? [];
    values.push(card);
    byNumber.set(card.number, values);
  }
  for (const [number, cards] of byNumber) {
    if (cards.length > 1) report(2, false, { path: cards.map((card) => card.path).join(","), reason: `duplicate-number:${number}` });
  }
  for (const card of snapshot.cards) {
    const parentDone = card.path.split("/").slice(0, -1).some((component) => /\.done$/.test(component));
    if (parentDone && !["done", "stale"].includes(card.status)) report(3, false, { path: card.path, reason: "active-card-in-done-folder" });
    if (!card.closedFolder) {
      for (const reason of card.depends.anomalies) report(4, false, { path: card.path, reason });
      for (const number of card.depends.numbers) {
        if ((byNumber.get(number) ?? []).length !== 1) report(4, false, { path: card.path, reason: `dependency-resolves-${(byNumber.get(number) ?? []).length}:${number}` });
      }
    }
  }
  if (snapshot.handoff.nextStep) {
    const matches = handoffPathMatches(snapshot, snapshot.handoff.nextStep);
    if (matches.length !== 1) report(5, false, { path: snapshot.handoff.nextStep, reason: `handoff-path-resolves-${matches.length}` });
  }
  for (const card of snapshot.cards.filter((item) => item.bare)) report(6, false, { path: card.path, reason: "bare-wip" });
  if (readFile(snapshot.root, "devflow/HANDOFF.md") !== null) report(6, false, { path: "devflow/HANDOFF.md", reason: "root-handoff" });
  const identityOwners = new Map();
  for (const owner of snapshot.owners) {
    const key = `${owner.name}\0${owner.email}`;
    const values = identityOwners.get(key) ?? [];
    values.push(owner);
    identityOwners.set(key, values);
  }
  for (const owners of identityOwners.values()) {
    if (owners.length > 1) report(7, false, { path: owners.map((owner) => owner.path).join(","), reason: "duplicate-git-identity" });
  }
  for (const card of snapshot.cards.filter((item) => item.claimant && !item.closedFolder)) {
    const owner = snapshot.owners.find((candidate) => candidate.id === card.claimant);
    if (owner && claimAuthorMismatch(snapshot, card, owner)) report(8, false, { path: card.path, reason: "claimant-author-mismatch" });
  }
  for (const card of snapshot.cards.filter((item) => item.status === "pending" && !item.closedFolder)) {
    if (!card.fields.has("Approval") || !card.fields.has("Review")) report(9, false, { path: card.path, reason: "missing-approval-or-review" });
    else if (card.approval !== "pending" && !APPROVAL_RE.test(card.approval)) report(9, false, { path: card.path, reason: "approval-format" });
    if (card.review !== null && !["required", "waived", "not-applicable"].includes(card.review)) report(9, false, { path: card.path, reason: "review-format" });
  }
  const layerParents = new Set(snapshot.journal.filter((line) => line.kind === "layer-opening" && line.valid).map((line) => normalizedStatusPath(line.parent)));
  for (const directory of snapshot.directories) {
    const target = path.join(snapshot.root, ...directory.split("/"));
    const children = fs.readdirSync(target);
    const identity = folderIdentity(directory);
    if (children.length === 0 && identity && !["done", "stale"].includes(identity.status) && !layerParents.has(normalizedStatusPath(directory))) {
      report(10, false, { path: directory, reason: "empty-folder-without-layer-opening" });
    }
    if (identity && identity.status === "open") {
      const direct = snapshot.cards.filter((card) => path.posix.dirname(card.path) === directory && card.status !== "stale")
        .map((card) => card.status)
        .concat(snapshot.directories.filter((child) => path.posix.dirname(child) === directory && !/\.stale$/.test(child))
          .map((child) => folderIdentity(child)?.status));
      if (direct.length > 0 && direct.every((status) => status === "done") && directory.split("/").length > 3) {
        report(11, false, { path: directory, reason: "complete-children-without-done-folder" });
      }
    }
  }
  for (const line of snapshot.journal.filter((item) => !item.valid)) {
    report(12, true, { path: "devflow/journal.md", line: line.raw, expected: "canonical reserved journal format", reason: reasonForJournal(line) });
  }
  for (const line of snapshot.journal.filter((item) => item.kind === "layer-opening" && item.valid)) {
    const count = locatorResolutionCount(snapshot, verify, line.source);
    if (count !== 1) report(12, true, { path: "devflow/journal.md", line: line.raw, expected: "canonical source locator resolving to exactly one source", reason: `source-resolves-${count}` });
  }
  for (const line of snapshot.journal.filter((item) => ["evidence-wait", "evidence-finalizing"].includes(item.kind))) {
    if (snapshot.closedDepth1.some((folder) => line.card?.startsWith(`${folder}/`))) continue;
    const reason = evidenceIntegrityReason(snapshot, line);
    if (reason) report(13, true, { path: "devflow/journal.md", line: line.raw, expected: "valid evidence line naming one claimed card with matching checkpoint subject, path, and check JSON", reason });
  }
  for (const invalid of verify.invalidPrepared) report(14, true, { path: invalid.path, line: invalid.raw, expected: "canonical routing prepared object", reason: invalid.reason });
  for (const [relative, text] of snapshot.verifyTexts) {
    for (const part of verificationRecordParts(text)) {
      const section = part.lines.join("\n");
      const ids = [...section.matchAll(/source id:\s*(-?\d+)/g)].map((match) => Number(match[1]));
      if (ids.some((id) => id <= 0) || new Set(ids).size !== ids.length) report(14, true, { path: relative, line: part.name, expected: "positive unique source ids", reason: "source-id" });
      if (part.role) {
        const entries = [];
        for (const line of part.lines) {
          if (/^-\s+/.test(line)) entries.push([line]);
          else if (entries.length > 0) entries.at(-1).push(line);
        }
        for (const entry of entries) {
          if (!/^-\s+routing\s*[·:]/i.test(entry[0])) continue;
          const findings = entry.map((line) => /^\s+(-?\d+)\.\s+/.exec(line)?.[1]).filter((value) => value !== undefined).map(Number);
          if (findings.some((id) => id <= 0) || new Set(findings).size !== findings.length) report(14, true, { path: relative, line: part.name, expected: "positive unique finding numbers in each routing entry", reason: "finding-number" });
          for (let index = 0; index < entry.length; index += 1) {
            if (!/^\s+routing:\s*pending\s*$/.test(entry[index])) continue;
            if (index === 0 || !/^\s+\d+\.\s+/.test(entry[index - 1])) {
              report(14, true, { path: relative, line: part.name, expected: "pending finding has an immediately preceding number", reason: "pending-finding-number" });
            }
          }
        }
      }
    }
  }
  const activeProduct = snapshot.journal.filter((line) => ["product-requested", "product-running", "product-result"].includes(line.kind));
  const counts = new Map();
  for (const line of activeProduct) counts.set(line.kind, (counts.get(line.kind) ?? 0) + 1);
  if (counts.size > 1 || [...counts.values()].some((count) => count > 1)) {
    report(15, true, { path: "devflow/journal.md", line: activeProduct.map((line) => line.raw).join(" | "), expected: "one active product-verification state kind", reason: "product-state-cardinality" });
  }
  const productResult = activeProduct.find((line) => line.kind === "product-result");
  if (productResult && verify.root && ["product", "verification", "code", "verdict"].some((key) => productResult[key] !== verify.root[key])) {
    report(15, true, { path: "devflow/journal.md", line: productResult.raw, expected: "result fields equal root verify.md", reason: "product-result-mismatch" });
  }
  return anomalies;
}

function approvalState(snapshot, card) {
  // A broken plan boundary is not a difference between two revisions, so no clean tree and
  // no committed baseline makes it go away. It is judged before anything reads the fields.
  if (card.planReason) return { value: "invalid", reasons: [card.planReason] };
  if (card.approval === "pending") return { value: "pending", reasons: [] };
  if (!APPROVAL_RE.test(card.approval ?? "")) return { value: "invalid", reasons: ["format"] };
  if (!gitPathExists(snapshot.root, snapshot.integration.ref, card.path)) return { value: "invalid", reasons: ["authority-path-missing"] };
  const changed = new Set([
    ...gitNulList(snapshot.root, ["diff", "--name-only", "-z", "--no-renames", "--", "devflow/tree"]),
    ...gitNulList(snapshot.root, ["diff", "--cached", "--name-only", "-z", "--no-renames", snapshot.integration.ref, "--", "devflow/tree"]),
  ]);
  if (!changed.has(card.path)) return { value: "effective", reasons: [] };
  // Only a card Git already reports as moved costs the three reads below.
  const sides = [
    gitFile(snapshot.root, snapshot.integration.ref, card.path),
    gitFile(snapshot.root, "", card.path),
    readFile(snapshot.root, card.path),
  ].map(planSlice);
  const reason = sides.find((side) => side.reason)?.reason;
  if (reason) return { value: "invalid", reasons: [reason] };
  return sides.every((side) => side.plan === sides[0].plan)
    ? { value: "effective", reasons: [] }
    : { value: "invalid", reasons: ["card-diff"] };
}

function cardJudgment(snapshot, card) {
  const byNumber = new Map();
  for (const item of snapshot.cards) {
    const values = byNumber.get(item.number) ?? [];
    values.push(item);
    byNumber.set(item.number, values);
  }
  const blockers = [];
  for (const number of card.depends.numbers) {
    const matches = byNumber.get(number) ?? [];
    if (matches.length !== 1) blockers.push(`${number}:resolves-${matches.length}`);
    else if (matches[0].status !== "done") blockers.push(`${number}:${matches[0].status}`);
  }
  const approval = approvalState(snapshot, card);
  return { approval, blockers, ready: approval.value === "effective" && card.depends.anomalies.length === 0 && blockers.length === 0 };
}

function addedJournalEntries(snapshot) {
  const shown = gitRun(snapshot.root, ["show", "HEAD:devflow/journal.md"], { allowFailure: true });
  if (shown.status !== 0) return [];
  let head;
  try {
    head = parseJournal(normalizeFileText(decodeUtf8(shown.stdout, "HEAD:devflow/journal.md")));
  } catch {
    return [];
  }
  const remaining = new Map();
  for (const line of head) remaining.set(line.raw, (remaining.get(line.raw) ?? 0) + 1);
  return snapshot.journal.filter((line) => {
    const count = remaining.get(line.raw) ?? 0;
    if (count === 0) return true;
    remaining.set(line.raw, count - 1);
    return false;
  });
}

function classifyWorkingTransition(snapshot, designPrefix) {
  // The design-only write owns its own route, so it is never also a generic output prefix.
  if (designPrefix === "design-only") return null;
  const paths = snapshot.status.map((entry) => entry.path).filter((relative) => relative === "devflow/journal.md"
    || /(?:^|\/)verify\.md$/.test(relative) || /^devflow\/project\/capabilities\/[^/]+\.md$/.test(relative));
  if (paths.length === 0) return null;
  if (snapshot.verifyTexts.size === 0) return null;
  const changedOutput = paths.some((relative) => /(?:^|\/)verify\.md$/.test(relative)
    || /^devflow\/project\/capabilities\/[^/]+\.md$/.test(relative));
  const journalOutput = paths.includes("devflow/journal.md")
    && addedJournalEntries(snapshot).some((line) => ["capability-closing", "product-running", "product-result"].includes(line.kind));
  if (!changedOutput && !journalOutput) return null;
  return { paths, state: "working-tree", case: "canonical-output-prefix" };
}

function claimMoveBytesMatch(snapshot, from, target) {
  const targetPath = path.resolve(snapshot.root, ...target.split("/"));
  if (!inside(snapshot.root, targetPath) || !fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) return false;
  const source = gitRun(snapshot.root, ["show", `${snapshot.head}:${from}`], { allowFailure: true });
  return source.status === 0 && source.stdout.equals(fs.readFileSync(targetPath));
}

function claimDoneMoves(snapshot) {
  const moves = [];
  const add = (from, target) => {
    const source = cardIdentity(from);
    const destination = cardIdentity(target);
    if (source?.status !== "claimed" || destination?.status !== "done") return;
    if (path.posix.dirname(from) !== path.posix.dirname(target)
        || source.number !== destination.number || source.name !== destination.name) return;
    if (!claimMoveBytesMatch(snapshot, from, target)) return;
    if (moves.some((move) => move.card === from && move.path === target)) return;
    moves.push({ card: from, path: target, case: "claim-done-move" });
  };
  for (const status of snapshot.status.filter((item) => (item.code.includes("R") || item.code.includes("C")) && item.from)) {
    add(status.from, status.path);
  }
  const deleted = snapshot.status.filter((item) => item.code.includes("D") && item.from === null);
  const untracked = snapshot.status.filter((item) => item.code === "??");
  for (const source of deleted) {
    for (const target of untracked) {
      add(source.path, target.path);
    }
  }
  return moves.sort((left, right) => byteCompare(left.card, right.card) || byteCompare(left.path, right.path));
}

function directChildren(snapshot, directory) {
  const cards = snapshot.cards.filter((card) => path.posix.dirname(card.path) === directory);
  const folders = snapshot.directories.filter((child) => path.posix.dirname(child) === directory).map((relative) => ({
    path: relative,
    ...folderIdentity(relative),
  }));
  return { cards, folders };
}

function doneDescendantCards(snapshot, directory) {
  return snapshot.cards.filter((card) => card.status === "done" && card.path.startsWith(`${directory}/`));
}

function productPreconditions(snapshot) {
  // Tracked adoption completion is terminal unless a durable product-verification
  // journal state already routed above; it does not fall through to the product layer.
  if (snapshot.archFields.get("Brownfield") === "yes") return false;
  if (!snapshot.treePresent) return false;
  const foundation = snapshot.depth1Folders.some((folder) => Number(folderIdentity(folder)?.number) === 1 && folderIdentity(folder)?.status === "done");
  const capabilities = snapshot.product.capabilities.filter((item) => !item.retired).every((item) =>
    snapshot.depth1Folders.some((folder) => Number(folderIdentity(folder)?.number) === item.number && folderIdentity(folder)?.status === "done"));
  const retired = snapshot.product.capabilities.filter((item) => item.retired).every((item) =>
    snapshot.depth1Folders.some((folder) => Number(folderIdentity(folder)?.number) === item.number && folderIdentity(folder)?.status === "stale")
    || snapshot.waitingFiles.some((file) => Number(/^(\d+)-/.exec(path.posix.basename(file))?.[1]) === item.number && /\.stale\.md$/.test(file)));
  return foundation && capabilities && retired && snapshot.cards.every((card) => ["done", "stale"].includes(card.status)) && snapshot.waitingFiles.length === 0;
}

function firstMine(snapshot) {
  return snapshot.cards.find((card) => card.claimant === snapshot.room?.id && !card.closedFolder) ?? null;
}

function progressLinesFromText(text) {
  return extractSection(text ?? "", "## Progress log")?.split("\n").filter((line) => line.trim()) ?? [];
}

function progressLines(card) {
  if (!card?.text) return [];
  return progressLinesFromText(card.text);
}

function parseProgressLine(raw) {
  const timestamped = new RegExp(`^${TIMESTAMP} (?<body>.+)$`).exec((raw ?? "").trim());
  if (!timestamped) return null;
  const { timestamp, body } = timestamped.groups;
  const out = { raw: (raw ?? "").trim(), timestamp };
  for (const candidate of PROGRESS_HEADS) {
    const match = candidate.form.exec(body);
    if (match) return { ...out, kind: candidate.kind, valid: true, ...match.groups };
  }
  const near = PROGRESS_HEADS.find((candidate) => body.includes(candidate.head));
  return near ? { ...out, kind: near.kind, valid: false, reason: `progress-format:${near.head}` } : null;
}

function progressMachineLines(text) {
  return progressLinesFromText(text).map(parseProgressLine).filter(Boolean);
}

// The carry line is bound to its position — the canon appends it immediately before the final
// task commit — so only the last progress line can be it. The recognizer decides the format.
function carryState(card) {
  const last = parseProgressLine(progressLines(card).at(-1) ?? "");
  return last?.kind === "carry" && last.valid ? { present: true, fact: last.fact } : { present: false, fact: null };
}

// Settled means anchored: the line is in the card as HEAD already holds it. Whether an
// unanchored line is still fresh is work's own judgment over its own diff, not a fact on
// disk, so the tool counts what a commit already carries and reports nothing further.
function progressEvidence(snapshot, card, anchorPath = card?.path ?? null) {
  const machine = progressMachineLines(card?.text).filter((line) => line.valid);
  const signal = machine.filter((line) => line.kind === "signal").at(-1);
  // The anchor is read at the path HEAD still holds. A canonical claim→done move renames a
  // byte-identical card, so its evidence is anchored under the claimed path, not the new one.
  const anchored = new Set(progressMachineLines(anchorPath ? gitFile(snapshot.root, snapshot.head, anchorPath) : null)
    .filter((line) => line.valid).map((line) => line.raw));
  const settled = machine.filter((line) => line.kind === "review" && anchored.has(line.raw));
  return {
    signal: signal?.verdict ?? "absent",
    signalPresent: Boolean(signal) || machine.some((line) => line.kind === "remote-evidence"),
    reviews: settled.length,
    review: settled.at(-1)?.verdict ?? "absent",
  };
}

function boundaryFields(snapshot, card, anchorPath) {
  const missing = [];
  const evidence = progressEvidence(snapshot, card, anchorPath ?? card?.path ?? null);
  if (!carryState(card).present) missing.push("carry");
  if (!evidence.signalPresent) missing.push("signal");
  if (card?.review === "required" && evidence.reviews === 0) missing.push("review");
  if (snapshot.room && snapshot.handoff.stale) missing.push("handoff");
  return { missing };
}

function progressShapeAnomalies(snapshot) {
  const anomalies = [];
  for (const card of snapshot.cards.filter((item) => !item.closedFolder && ["pending", "claimed"].includes(item.status))) {
    for (const line of progressMachineLines(card.text).filter((item) => !item.valid)) {
      anomalies.push({ path: card.path, zone: "progress-log", detail: line.reason });
    }
  }
  return anomalies;
}

// The anchor is read from the journal path alone, and only a status-zero, decodable, full
// object ID is one. It must also be the canonical checkpoint whose tree holds this exact card
// and every named code path, because that tree is the snapshot the writer rederives from.
// Every other outcome is that exact reason, so a design note Git could not place still routes
// ahead of the claim instead of disappearing into it.
function designNoteAnchor(snapshot, line) {
  const exactLine = `^${line.raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`;
  const found = gitRun(snapshot.root, ["log", "--reverse", "-G", exactLine, "--format=%H", "--", "devflow/journal.md"], { allowFailure: true });
  if (found.status !== 0) return { reason: "anchor-unavailable" };
  let candidates;
  try {
    candidates = decodeUtf8(found.stdout, "design note anchor").split("\n").filter(Boolean);
  } catch {
    return { reason: "anchor-undecodable" };
  }
  let first = null;
  for (const candidate of candidates) {
    if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(candidate)) return { reason: "anchor-invalid" };
    const blob = gitRun(snapshot.root, ["show", `${candidate}:devflow/journal.md`], { allowFailure: true });
    if (blob.status !== 0) continue;
    let lines;
    try {
      lines = normalizeFileText(decodeUtf8(blob.stdout, "design note anchor journal")).split("\n");
    } catch {
      return { reason: "anchor-undecodable" };
    }
    if (lines.includes(line.raw)) { first = candidate; break; }
  }
  if (first === null) return { reason: "anchor-missing" };
  const number = cardIdentity(line.card)?.number ?? null;
  const claimant = snapshot.cards.find((card) => card.path === line.card)?.claimant
    ?? /\.wip-([a-z0-9]{2,8})(?=\.|$)/.exec(line.card ?? "")?.[1] ?? null;
  const subject = gitLine(snapshot.root, ["log", "-1", "--format=%s", first], { allowFailure: true });
  if (!number || !claimant || subject !== `${claimant} ${number} wip: capability design note`) return { reason: "anchor-not-checkpoint" };
  const inTree = (relative) => gitRun(snapshot.root, ["cat-file", "-e", `${first}:${relative}`], { allowFailure: true }).status === 0;
  const canonical = (relative) => relative.length > 0 && !relative.includes("\\")
    && relative.split("/").every((part) => part !== "" && part !== "." && part !== "..");
  if (!inTree(line.card)) return { reason: "anchor-card-absent" };
  if (new Set(line.code).size !== line.code.length) return { reason: "code-duplicate" };
  if (!line.code.every(canonical)) return { reason: "code-noncanonical" };
  if (!line.code.every(inTree)) return { reason: "code-absent" };
  return { anchor: first };
}

// One computation owns every route into a capability's design zone: durability against HEAD's
// journal, the live same-capability card and anchor snapshot the design form needs, the named
// owner an open item carries instead, and the interrupted design-only write whose line is
// already deleted from the working tree. A committed line of either form never leaves this
// function silently — it leaves as a route or as an exact blocking reason.
function designNoteRoutes(snapshot) {
  const producerReasons = new Set([
    "card-absent", "capability-mismatch", "anchor-not-checkpoint", "anchor-card-absent",
    "code-duplicate", "code-noncanonical", "code-absent",
  ]);
  // The open item names its own owner and carries no code basis, so it takes no card judgment
  // and no anchor: the card is where the confirmation happened, not a snapshot to rederive from.
  const routable = (item) => (item.kind === "capability-note" && item.valid && item.card !== undefined)
    || (item.kind === "attributed" && item.design !== undefined
      && snapshot.owners.some((owner) => owner.id === item.design.id));
  const project = (line, extra) => ({
    ...(line.design
      ? { form: "open-item", marker: line.raw, capability: line.design.capability, statement: line.design.statement, card: line.design.card }
      : { form: "note", marker: line.raw, capability: line.capability, note: line.note, card: line.card, code: line.code }),
    ...extra, ...(extra.reason ? { recovery: producerReasons.has(extra.reason) ? "producer" : "external" } : {}),
  });
  const unresolved = (reason) => ({ form: "note", marker: "unresolved", reason, recovery: "external" });
  const working = snapshot.journal.filter(routable);
  const changed = snapshot.status.map((entry) => entry.path);
  const journalChanged = changed.includes("devflow/journal.md");
  const shown = gitRun(snapshot.root, ["show", "HEAD:devflow/journal.md"], { allowFailure: true });
  if (shown.status !== 0) {
    const listed = gitRun(snapshot.root, ["ls-tree", "--name-only", "HEAD", "--", "devflow/journal.md"], { allowFailure: true });
    let headOwnsJournal = null;
    if (listed.status === 0) {
      try {
        headOwnsJournal = decodeUtf8(listed.stdout, "HEAD journal tree entry").split("\n").includes("devflow/journal.md");
      } catch {
        headOwnsJournal = null;
      }
    }
    if (headOwnsJournal === false) return { routes: [], prefix: null };
    const routes = working.map((line) => project(line, { reason: "head-journal-unavailable" }));
    if (routes.length === 0 && journalChanged) routes.push(unresolved("head-journal-unavailable"));
    return { routes, prefix: null };
  }
  let headLines;
  try {
    headLines = normalizeFileText(decodeUtf8(shown.stdout, "HEAD:devflow/journal.md")).split("\n");
  } catch {
    const routes = working.map((line) => project(line, { reason: "head-journal-undecodable" }));
    if (routes.length === 0 && journalChanged) routes.push(unresolved("head-journal-undecodable"));
    return { routes, prefix: null };
  }
  const routes = [];
  for (const line of working) {
    if (!headLines.includes(line.raw)) continue;
    if (line.design) { routes.push(project(line, {})); continue; }
    const card = snapshot.cards.find((item) => item.path === line.card && !item.closedFolder && ["pending", "claimed"].includes(item.status));
    if (!card) routes.push(project(line, { reason: "card-absent" }));
    else if (Number(card.number.split(".")[0]) !== Number(line.capability)) routes.push(project(line, { reason: "capability-mismatch" }));
    else routes.push(project(line, designNoteAnchor(snapshot, line)));
  }
  // The writer may have rederived the design zone and deleted the routed line without
  // committing. That prefix is the design-only write, not a generic canonical-output prefix,
  // and any other path in it is a mismatch this stops on.
  let prefix = null;
  for (const [index, raw] of headLines.entries()) {
    const line = raw === "" ? null : parseJournalLine(raw, 0);
    if (!line || !routable(line)) continue;
    if (snapshot.journal.some((current) => current.raw === raw)) continue;
    // The canon's design-only prefix: HEAD's journal with exactly this one occurrence removed.
    const remainder = headLines.filter((_, position) => position !== index).join("\n");
    const capability = String(Number(line.design ? line.design.capability : line.capability)).padStart(2, "0");
    const targetZone = new RegExp(`^devflow/project/capabilities/${capability}-[^/]+(?:\\.md|/K-\\d{3}-[^/]+\\.md)$`);
    const pathsAllowed = changed.includes("devflow/journal.md") && changed.every((relative) => relative === "devflow/journal.md"
      || targetZone.test(relative));
    if (!pathsAllowed || remainder !== (snapshot.journalText ?? "")) {
      routes.push(project(line, { reason: "prefix-mismatch" }));
      continue;
    }
    prefix = "design-only";
    routes.push(project(line, line.design ? { prefix } : { prefix, ...designNoteAnchor(snapshot, line) }));
  }
  return { routes, prefix };
}

function addedIn(snapshot, commit, relative) {
  const present = (revision) => gitRun(snapshot.root, ["cat-file", "-e", `${revision}:${relative}`], { allowFailure: true }).status === 0;
  return present(commit) && !present(`${commit}^`);
}

// A card's number is immutable and only its status suffix moves, so the one legitimate
// predecessor of a card path is the same card under another suffix. Git's similarity search
// does not know that: asked to follow a template-identical card it walks into a different
// card's history and hands back that card's creation commit, which would attribute another
// request's origin. The walk therefore stops at this identity's own add; a chain that leaves
// the identity is either this commit's own add, proved against the parent tree, or an
// ambiguity — never another card's request.
function resolveCardCreation(snapshot, card) {
  const number = cardIdentity(card.path)?.number ?? null;
  if (!number) return { reason: "creation-commit-missing" };
  const run = gitRun(snapshot.root, ["log", "-z", "--follow", "--name-status", "--format=%H", "--", card.path], { allowFailure: true });
  if (run.status !== 0) return { reason: "creation-commit-missing" };
  let fields;
  try {
    fields = decodeUtf8(run.stdout, "card history").split("\0").filter((value) => value !== "");
  } catch {
    return { reason: "creation-history-undecodable" };
  }
  let commit = null;
  for (let index = 0; index < fields.length; index += 1) {
    // `git log -z --name-status --format=%H` prints the commit id, then a newline-led status
    // token, then that record's one or two paths, each field closed by NUL.
    if (!fields[index].startsWith("\n")) {
      if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(fields[index])) return { reason: "creation-history-unreadable" };
      commit = fields[index];
      continue;
    }
    const status = fields[index].slice(1);
    const paths = fields.slice(index + 1, index + 1 + (/^[RC]/.test(status) ? 2 : 1));
    index += paths.length;
    if (!commit || paths.length === 0) return { reason: "creation-history-unreadable" };
    const followed = paths.at(-1);
    if (cardIdentity(followed)?.number !== number) return { reason: "creation-identity-crossed" };
    if (status.startsWith("A")) return { commit };
    if (paths.length === 2 && cardIdentity(paths[0])?.number !== number) {
      return addedIn(snapshot, commit, followed) ? { commit } : { reason: "creation-identity-crossed" };
    }
  }
  return { reason: commit ? "creation-add-unresolved" : "creation-commit-missing" };
}

function cardOrigin(snapshot, card, shallow) {
  if (shallow) return { origin: "unknown", originReason: "shallow-history" };
  const created = resolveCardCreation(snapshot, card);
  if (!created.commit) return { origin: "unknown", originReason: created.reason };
  const creation = created.commit;
  if (gitRun(snapshot.root, ["rev-parse", "--verify", `${creation}^`], { allowFailure: true }).status !== 0) {
    return { origin: "unknown", originReason: "creation-parent-missing" };
  }
  // The creation diff is the one read that decides whether this card has an origin at all, so
  // a command that could not answer is not the answer `none`.
  const shown = gitRun(snapshot.root, ["show", "--format=", "--unified=0", "--no-ext-diff", creation, "--", "devflow/journal.md"], { allowFailure: true });
  if (shown.status !== 0) return { origin: "unknown", originReason: "creation-diff-unavailable" };
  let diff;
  try {
    diff = normalizeFileText(decodeUtf8(shown.stdout, "creation diff"));
  } catch {
    return { origin: "unknown", originReason: "creation-diff-undecodable" };
  }
  const matches = diff.split("\n").filter((line) => line.startsWith("-") && !line.startsWith("---"))
    .map((line) => line.slice(1))
    .map((raw) => ({ raw, parsed: parseJournalLine(raw, 0) }))
    .filter(({ parsed }) => parsed?.valid && ["maintenance-request", "layer-opening"].includes(parsed.kind));
  if (matches.length === 0) return { origin: "none" };
  const identities = new Set(matches.map(({ raw, parsed }) => parsed.kind === "maintenance-request"
    ? `journal:${raw}` : parsed.source));
  if (identities.size !== 1) return { origin: "unknown", originReason: "multiple-matches" };
  // The identity is what groups cards, and it is also what a reader is owed: one request that
  // reaches several natural owners lands its parents in as many passes as it needs, and a
  // pass that did not happen to delete the request line must not quote its own marker as a
  // second origin for the same subject. `none` and `unknown` carry no identity, so cards that
  // merely share an absence are never grouped.
  return { origin: [...identities][0], identity: [...identities][0] };
}

// The request a card came from is also the partition it belongs to: the other current cards
// of that request are exactly what a thin split card is missing, and nothing wider. One
// projection over the current cards — non-closed pending and claimed, never done or stale
// history — serves the report and every candidate route, so the history walk runs once per
// card instead of once per consumer. A card is not its own sibling.
function originProjection(snapshot) {
  const current = snapshot.cards.filter((card) => !card.closedFolder && ["pending", "claimed"].includes(card.status));
  const shallow = current.length > 0
    && gitLine(snapshot.root, ["rev-parse", "--is-shallow-repository"], { allowFailure: true }) === "true";
  const byPath = new Map(current.map((card) => [card.path, cardOrigin(snapshot, card, shallow)]));
  const members = new Map();
  for (const [relative, value] of byPath) {
    if (value.identity === undefined) continue;
    members.set(value.identity, [...(members.get(value.identity) ?? []), relative]);
  }
  const origin = (card) => {
    const value = card ? byPath.get(card.path) : null;
    if (!value) return { origin: "none" };
    const { identity, ...fields } = value;
    return fields;
  };
  return {
    origin,
    candidate: (card) => ({
      ...origin(card),
      siblings: (members.get(byPath.get(card.path)?.identity) ?? []).filter((relative) => relative !== card.path),
    }),
  };
}

// A status-zero Git result is evidence only in Git's own grammar. `rev-list --count` prints
// one canonical decimal integer, and `git log -z` terminates every record with NUL and prints
// nothing after the last one — so the tail to remove is that final empty field, and an empty
// range prints nothing at all. Output in any other shape is not a smaller number or a shorter
// history; it is an answer this tool cannot read, and both parsers say so with null.
export function digestDistance(text) {
  const match = /^(0|[1-9][0-9]*)\n$/.exec(text);
  return match ? Number(match[1]) : null;
}

export function digestRecords(text) {
  const fields = text.split("\0");
  if (fields.pop() !== "" || fields.length % 3 !== 0) return null;
  const records = [];
  for (let index = 0; index < fields.length; index += 3) records.push(fields.slice(index, index + 3));
  return records;
}

function digestLag(snapshot) {
  if (!snapshot.room) return null;
  const relative = `devflow/users/${snapshot.room.id}/digest.md`;
  const markerText = readFile(snapshot.root, relative);
  if (markerText === null) return null;
  const marker = markerText.trim();
  // Git failing to answer is not an answer about history.  An unresolved integration ref, a
  // merge-base that neither proved nor disproved ancestry, a walk that could not run, and
  // output that will not decode are all reported unavailable — never counted as zero, never
  // hardened into a non-ancestor verdict, and never dropped by the suppression at the end.
  const unavailable = (reason) => ({ marker: marker || "invalid", resolution: "unavailable", reason });
  if (!snapshot.integration.hash) return unavailable("integration-ref-unresolved");
  // The marker is a commit locator, so only the unabbreviated object ID Git itself prints
  // resolves — an abbreviation, a ref name, or an invented hash names no commit here.  A
  // marker that resolves to nothing yields no range, and a range is the only thing that may
  // be counted: the integration ref alone would report the whole branch as unseen history.
  const resolved = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(marker)
    && gitLine(snapshot.root, ["rev-parse", "--verify", "--quiet", `${marker}^{commit}`], { allowFailure: true }) === marker;
  let range = null;
  let resolution = "unresolved";
  if (marker === "none") {
    range = snapshot.integration.ref;
    resolution = "none";
  } else if (resolved) {
    // `merge-base --is-ancestor` answers 0 for yes and 1 for no; any other status is Git
    // declining to answer, and a decline is not a divergence.
    const ancestry = gitRun(snapshot.root, ["merge-base", "--is-ancestor", marker, snapshot.integration.ref], { allowFailure: true }).status;
    if (ancestry !== 0 && ancestry !== 1) return unavailable("merge-base-unavailable");
    resolution = ancestry === 0 ? "ancestor" : "non-ancestor";
    if (ancestry === 0) range = `${marker}..${snapshot.integration.ref}`;
  }
  if (range === null) return { marker: marker || "invalid", resolution };
  const counted = gitRun(snapshot.root, ["rev-list", "--count", range], { allowFailure: true });
  const raw = gitRun(snapshot.root, ["log", "-z", "--format=%an%x00%ae%x00%s", range], { allowFailure: true });
  if (counted.status !== 0 || raw.status !== 0) return unavailable("history-unavailable");
  let behind;
  let records;
  try {
    behind = digestDistance(decodeUtf8(counted.stdout, "digest distance"));
    records = digestRecords(decodeUtf8(raw.stdout, "digest history"));
  } catch {
    return unavailable("history-undecodable");
  }
  if (behind === null || records === null) return unavailable("history-unreadable");
  let others = 0;
  for (const [name, email, subject] of records) {
    if (name !== snapshot.room.name || email !== snapshot.room.email || !subject.startsWith(`${snapshot.room.id} `)) others += 1;
  }
  if (behind === 0 && others === 0) return null;
  return { marker, resolution, behind, others };
}

function finalTaskCommit(snapshot, card) {
  if (!card.text) return false;
  const firstLine = /^#\s+(.+)$/.exec(card.text.split("\n")[0] ?? "")?.[1] ?? null;
  if (!firstLine) return false;
  const subject = gitLine(snapshot.root, ["log", "-1", "--format=%s", "--", card.path], { allowFailure: true });
  const expected = snapshot.room ? `${snapshot.room.id} ${firstLine}` : firstLine;
  return subject === expected;
}

function evaluateZones(snapshot) {
  const zones = zoneBag();
  const verify = verifyProjection(snapshot);
  const integrityItems = integrity(snapshot, verify);
  const blocking = integrityItems.filter((item) => item.blocking);
  const nonblocking = integrityItems.filter((item) => !item.blocking);
  const shapeAnomalies = [
    ...snapshot.product.anomalies,
    ...snapshot.baseline.anomalies.filter((item) => item.zone === "verified"),
    ...progressShapeAnomalies(snapshot),
  ];

  const changedOnBranch = snapshot.integration.hash
    ? gitNulList(snapshot.root, ["diff", "--name-only", "-z", `${snapshot.integration.ref}..HEAD`, "--", "devflow/tree", "devflow/journal.md"])
      .filter((relative) => relative === "devflow/journal.md" || cardIdentity(relative))
    : [];
  const outsideDiff = snapshot.status.filter((item) => !item.path.startsWith("devflow/"));
  const chosen = firstMine(snapshot);
  const design = designNoteRoutes(snapshot);
  const origins = originProjection(snapshot);
  const unattributed = snapshot.status.map((entry) => entry.path).filter((relative) => relative !== chosen?.path).sort(byteCompare);
  zones.git.summary = {
    openOperation: snapshot.openOperation.kind,
    worktrees: snapshot.worktrees,
    notYetOnIntegration: changedOnBranch.length,
    uncommittedUnattributed: unattributed.length === 0 ? "none" : unattributed,
  };
  if (snapshot.openOperation.kind !== "none") addEntry(zones, "git", "open-operation", {
    operation: snapshot.openOperation.kind,
    branch: snapshot.branch ?? "detached",
    unmerged: snapshot.openOperation.unmerged,
  });

  zones.integrity.summary = { blocking: blocking.length, advisory: nonblocking.length, shape: shapeAnomalies.length };
  for (const anomaly of blocking) addEntry(zones, "integrity", "blocking", anomaly);
  for (const anomaly of nonblocking) addEntry(zones, "integrity", "advisory", anomaly);
  for (const anomaly of shapeAnomalies) {
    addEntry(zones, "integrity", "shape", { path: anomaly.path, zone: anomaly.zone, detail: anomaly.detail });
  }

  for (const item of verify.prepared) addEntry(zones, "transition", "prepared-route", {
    path: item.path, base: item.base, prefix: item.prefix, result: item.result, operationCount: item.operations.length,
  });
  const interrupted = verify.prepared.length === 0 ? classifyWorkingTransition(snapshot, design.prefix) : null;
  if (interrupted) addEntry(zones, "transition", "interrupted", interrupted);
  for (const item of verify.sourceMigration) addEntry(zones, "transition", "source-id-migration", item);
  for (const line of snapshot.journal.filter((item) => item.kind === "layer-opening" && item.valid).sort((a, b) => a.timestamp.localeCompare(b.timestamp))) {
    addEntry(zones, "transition", "layer-opening", { parent: line.parent, children: line.children, sourceJson: line.source, timestamp: line.timestamp });
  }
  for (const line of snapshot.journal.filter((item) => item.kind === "product-running")) addEntry(zones, "transition", "product-running", {
    path: "devflow/tree/verify.md", product: line.product, verification: line.verification, code: line.code, trigger: line.trigger,
  });
  for (const line of snapshot.journal.filter((item) => item.kind === "product-result")) addEntry(zones, "transition", "product-result", {
    path: "devflow/tree/verify.md", product: line.product, verification: line.verification, code: line.code, verdict: line.verdict, trigger: line.trigger,
  });
  for (const line of snapshot.journal.filter((item) => ["evidence-wait", "evidence-finalizing"].includes(item.kind) && item.card)) {
    const card = snapshot.cards.find((candidate) => candidate.path === line.card);
    if (card?.claimant === snapshot.room?.id) addEntry(zones, "transition", "remote-evidence", {
      path: line.card,
      state: line.kind,
      checkpoint: line.checkpoint,
      nextAction: line.kind === "evidence-wait" ? "run-check" : "finish-boundary",
    });
  }
  for (const card of snapshot.cards.filter((item) => item.claimant === snapshot.room?.id && finalTaskCommit(snapshot, item))) {
    addEntry(zones, "transition", "finish-boundary", { card: card.path, case: "final-task-subject", ...boundaryFields(snapshot, card) });
  }
  for (const move of claimDoneMoves(snapshot)) {
    const card = snapshot.cards.find((item) => item.path === move.path)
      ?? parseCard(snapshot.root, move.path, false);
    addEntry(zones, "transition", "finish-boundary", { ...move, ...boundaryFields(snapshot, card, move.card) });
  }
  for (const item of verify.eventRouting) addEntry(zones, "transition", "event-routing", item);
  for (const item of verify.eventDecision) addEntry(zones, "transition", "event-decision", item);
  for (const item of verify.failureRouting.sort((a, b) => byteCompare(a.path, b.path) || (a.sourceId ?? 0) - (b.sourceId ?? 0))) {
    addEntry(zones, "transition", "failure-routing", item);
  }

  for (const line of snapshot.journal.filter((item) => item.kind === "product-rerun")) addEntry(zones, "marker", "product-rerun", { marker: line.raw, timestamp: line.timestamp });
  for (const { form, ...entry } of design.routes) addEntry(zones, "marker", form === "open-item" ? "design-open-item" : "design-note", entry);
  for (const line of snapshot.journal.filter((item) => item.kind === "capability-closing" && gitFile(snapshot.root, "HEAD", "devflow/journal.md")?.includes(item.raw))) {
    addEntry(zones, "marker", "capability-closure", { marker: line.raw, folder: line.folder, head: line.head });
  }
  for (const line of snapshot.journal.filter((item) => item.kind === "re-split")) addEntry(zones, "marker", "re-split", { marker: line.raw, folder: line.folder, stale: line.stale });

  const missing = [];
  if (snapshot.productText !== null && readFile(snapshot.root, "devflow/project/glossary.md") === null) missing.push("devflow/project/glossary.md");
  if (snapshot.productText !== null && snapshot.archText === null) missing.push("devflow/project/arch.md");
  if (snapshot.productText !== null && readFile(snapshot.root, "devflow/project/code-style.md") === null) missing.push("devflow/project/code-style.md");
  if (snapshot.productText === null) addEntry(zones, "setup", "no-product", { missing: ["devflow/project/product.md"] });
  else if (missing.length > 0) addEntry(zones, "setup", "layer0-incomplete", { missing });
  else if (!snapshot.archFields.has("Brownfield")) addEntry(zones, "setup", "brownfield-field", { missing: ["Brownfield"] });
  else if (!snapshot.archFields.has("integration") || !snapshot.archFields.has("merge")) addEntry(zones, "setup", "integration-config", {
    missing: [!snapshot.archFields.has("integration") ? "integration" : null, !snapshot.archFields.has("merge") ? "merge" : null].filter(Boolean),
    worktreeCount: snapshot.worktrees,
  });
  if (snapshot.cards.some((card) => card.bare) || readFile(snapshot.root, "devflow/HANDOFF.md") !== null) addEntry(zones, "setup", "room-upgrade", {
    paths: [...snapshot.cards.filter((card) => card.bare).map((card) => card.path), ...(readFile(snapshot.root, "devflow/HANDOFF.md") !== null ? ["devflow/HANDOFF.md"] : [])],
  });

  const claimSummary = { mine: 0, others: 0 };
  const cardDetails = new Map();
  for (const card of snapshot.cards.filter((item) => !item.closedFolder)) cardDetails.set(card.path, cardJudgment(snapshot, card));
  for (const card of snapshot.cards.filter((item) => item.status === "claimed" && !item.closedFolder)) {
    if (card.claimant !== snapshot.room?.id) { claimSummary.others += 1; continue; }
    claimSummary.mine += 1;
    const judgment = cardDetails.get(card.path);
    const evidence = progressEvidence(snapshot, card);
    const common = { path: card.path, depends: card.depends.numbers.length === 0 ? "done" : judgment.blockers.length === 0 ? "done" : "blocked", approval: judgment.approval.value, blockers: judgment.blockers, carry: carryState(card).present ? "present" : "absent", signal: evidence.signal, reviews: evidence.reviews, review: evidence.review, readFirst: card.readFirst, ...origins.candidate(card) };
    if (card.depends.anomalies.length > 0 || card.depends.numbers.some((number) => snapshot.cards.filter((candidate) => candidate.number === number).length !== 1)) addEntry(zones, "claim", "depends-anomaly", { ...common, reasons: card.depends.anomalies });
    else if (card.legacy || card.approval === "pending" || !card.depends.canonical) addEntry(zones, "claim", "needs-reapproval", common);
    else if (judgment.blockers.length > 0) addEntry(zones, "claim", "blocked-by-prerequisite", common);
    else addEntry(zones, "claim", "mine", common);
  }
  zones.claim.summary = claimSummary;

  zones.baseline.summary = snapshot.baseline.summary;
  for (const item of snapshot.baseline.expected) {
    const matches = snapshot.baselineFiles.filter((relative) => Number(/^(\d+)-/.exec(path.posix.basename(relative))?.[1]) === item.number);
    const relative = matches.length === 1 ? matches[0] : item.path;
    const text = gitFile(snapshot.root, snapshot.integration.ref, relative);
    const shape = capabilityShape(text, relative, item.number);
    if (legacyV010(text, item.number)) addEntry(zones, "baseline", "legacy-v010", { paths: [relative], stage: snapshot.archFields.get("Brownfield") === "yes" ? "adopt" : "arch" });
    else if (text === null || (shape.boundaryCount === 1 && shape.anomalies.some((anomaly) => anomaly.zone === "design"))
      || (shape.boundaryCount === 1 && !snapshot.baseline.records.find((record) => record.capability === item.number)?.designFresh)) {
      addEntry(zones, "baseline", "design-refresh", { paths: [relative], stage: snapshot.archFields.get("Brownfield") === "yes" ? "adopt" : "arch", reasons: text === null ? ["missing"] : shape.anomalies.filter((anomaly) => anomaly.zone === "design").map((anomaly) => anomaly.detail) });
    } else if (text !== null && shape.boundaryCount !== 1) addEntry(zones, "baseline", "boundary", { paths: [relative], boundaryCount: shape.boundaryCount });
  }

  const requests = snapshot.journal.filter((item) => item.kind === "maintenance-request" && item.valid);
  zones.request.summary = { existing: requests.length };
  for (const line of requests) addEntry(zones, "request", "existing", { timestamp: line.timestamp });

  const productRequested = snapshot.journal.filter((item) => item.kind === "product-requested");
  const pendingEvents = verify.eventPending.filter((item) => !(item.role === "Audit" && outsideDiff.length > 0));
  const newEvents = [];
  const rootRecord = verify.records.find((record) => record.target === "product");
  if (verify.root?.verdict && !verify.root.channelUnavailable && rootRecord?.current && !rootRecord.auditKeys.has("product")) newEvents.push({ role: "Audit", target: "product", key: "product" });
  if (verify.root?.verdict && !verify.root.channelUnavailable && rootRecord?.current && !rootRecord.retrospectiveKeys.has("product")) newEvents.push({ role: "Retrospective", target: "product", key: "product" });
  for (const record of verify.records.filter((item) => item.target !== "product" && item.current && item.capabilityDone)) {
    if (record.failureMax !== null) {
      const key = `post-failure through ${record.failureMax}`;
      if (!record.auditKeys.has(key)) newEvents.push({ role: "Audit", target: record.target, key });
    }
    const key = `first closure ${record.target}`;
    if (!record.retrospectiveKeys.has(key)) newEvents.push({ role: "Retrospective", target: record.target, key });
  }
  for (const request of snapshot.journal.filter((item) => ["audit-requested", "retrospective-requested"].includes(item.kind))) {
    const target = request.target === "product" ? "product" : Number(request.target);
    const record = verify.records.find((candidate) => candidate.target === target);
    if (!record) continue;
    const keys = request.kind === "audit-requested" ? record.auditKeys : record.retrospectiveKeys;
    if (!keys.has(request.timestamp)) newEvents.push({ role: request.kind === "audit-requested" ? "Audit" : "Retrospective", target, key: request.timestamp });
  }
  zones.event.summary = { productRequested: productRequested.length, pending: pendingEvents.length, new: newEvents.length };
  for (const line of productRequested) addEntry(zones, "event", "product-requested", { path: "devflow/journal.md", key: line.timestamp });
  for (const item of pendingEvents) addEntry(zones, "event", "pending", item);
  for (const item of newEvents) addEntry(zones, "event", "new", item);

  let unit = null;
  const layerSummary = { unit: null, empty: 0, folderBoundary: 0, childrenDone: 0, correspondence: "ok", foundation: "present" };
  for (const directory of snapshot.directories.sort((a, b) => byteCompare(a, b))) {
    const identity = folderIdentity(directory);
    if (!identity || ["done", "stale"].includes(identity.status)) continue;
    const children = directChildren(snapshot, directory);
    if (children.cards.length + children.folders.length === 0) {
      layerSummary.empty += 1;
      addEntry(zones, "layer", "empty-folder", { folder: directory });
      unit ??= directory;
    }
    const activeStatuses = [
      ...children.cards.filter((card) => card.status !== "stale").map((card) => card.status),
      ...children.folders.filter((folder) => folder.status !== "stale").map((folder) => folder.status),
    ];
    if (activeStatuses.length > 0 && activeStatuses.every((status) => status === "done")) {
      const capabilityRecord = verify.records.find((record) => record.target === Number(identity.number));
      if (directory.split("/").length === 3 && Number(identity.number) !== 1 && capabilityRecord?.channelUnavailable) continue;
      if (directory.split("/").length === 3 && Number(identity.number) !== 1) {
        layerSummary.childrenDone += 1;
        const carryFacts = doneDescendantCards(snapshot, directory).flatMap((card) => {
          const carry = carryState(card);
          return carry.present && carry.fact !== "none" ? [{ card: card.path, fact: carry.fact }] : [];
        });
        addEntry(zones, "layer", "children-done", { folder: directory, carry: carryFacts.length, carryFacts });
      } else {
        layerSummary.folderBoundary += 1;
        addEntry(zones, "layer", "folder-boundary", { folder: directory });
      }
      unit ??= directory;
    }
  }
  if (snapshot.archFields.get("Brownfield") === "no" && snapshot.treePresent) {
    const represented = (capability) => snapshot.depth1Folders.some((folder) => Number(folderIdentity(folder)?.number) === capability.number)
      || snapshot.waitingFiles.some((relative) => Number(/^(\d+)-/.exec(path.posix.basename(relative))?.[1]) === capability.number);
    const missingCapabilities = snapshot.product.capabilities.filter((item) => !represented(item));
    if (missingCapabilities.length > 0) {
      layerSummary.correspondence = "gap";
      addEntry(zones, "layer", "correspondence-gap", { missing: missingCapabilities.map((item) => item.number) });
    }
    if (!snapshot.depth1Folders.some((folder) => Number(folderIdentity(folder)?.number) === 1)) {
      layerSummary.foundation = "missing";
      addEntry(zones, "layer", "no-foundation", { missing: ["01-foundation"] });
    }
  }
  if (!snapshot.treePresent) addEntry(zones, "layer", "no-tree", { tree: "absent" });
  layerSummary.unit = unit;
  zones.layer.summary = layerSummary;

  const pendingCards = snapshot.cards.filter((card) => card.status === "pending" && !card.closedFolder);
  const readySummary = { count: pendingCards.length };
  const digest = digestLag(snapshot);
  if (digest) addEntry(zones, "ready", "digest-behind", digest);
  for (const card of pendingCards) {
    const judgment = cardDetails.get(card.path);
    const detail = { file: card.path, cards: [card.number], depends: card.depends.numbers, approval: judgment.approval.value, ready: judgment.ready, blockers: judgment.blockers, readFirst: card.readFirst, ...origins.candidate(card) };
    if (card.legacy || !card.depends.canonical) addEntry(zones, "ready", "needs-normalization", { ...detail, missingFields: [!card.fields.has("Approval") ? "Approval" : null, !card.fields.has("Review") ? "Review" : null].filter(Boolean), invalidity: card.depends.anomalies });
    else if (card.approval !== "pending" && judgment.approval.value !== "effective") addEntry(zones, "ready", "approval-invalid", { ...detail, invalidity: judgment.approval.reasons });
    else if (card.approval === "pending") addEntry(zones, "ready", "approval-pending", detail);
    else if (judgment.ready) addEntry(zones, "ready", "ready", detail);
  }
  for (const relative of snapshot.waitingFiles) addEntry(zones, "ready", "waiting-capability", { file: relative });
  zones.ready.summary = readySummary;

  const blockedAudit = verify.eventPending.filter((item) => item.role === "Audit" && outsideDiff.length > 0);
  for (const record of verify.records.filter((item) => item.channelUnavailable)) addEntry(zones, "blocked", "channel", {
    path: record.path, target: record.target, command: record.channel.command, timeout: record.channel.timeout,
  });
  if (blockedAudit.length > 0) addEntry(zones, "blocked", "audits", { candidates: blockedAudit.map((item) => item.path), blockingPaths: outsideDiff.map((item) => item.path), reasons: ["uncommitted-outside-devflow"] });
  if (pendingCards.length > 0 && pendingCards.every((card) => {
    const judgment = cardDetails.get(card.path);
    return judgment.approval.value === "effective" && judgment.blockers.length > 0;
  })) addEntry(zones, "blocked", "dependencies", { cards: pendingCards.map((card) => card.number), reasons: pendingCards.flatMap((card) => cardDetails.get(card.path).blockers) });
  if (snapshot.cards.some((card) => card.status === "claimed") && claimSummary.mine === 0 && pendingCards.length === 0) addEntry(zones, "blocked", "other-claims", {
    cards: snapshot.cards.filter((card) => card.status === "claimed").map((card) => card.path),
    claimants: snapshot.cards.filter((card) => card.status === "claimed").map((card) => card.claimant),
  });

  const projectComplete = productPreconditions(snapshot);
  const rootVerify = verify.root;
  const revisionsMatch = rootVerify && rootVerify.product === snapshot.revisions.product && rootVerify.verification === snapshot.revisions.verification && rootVerify.code === snapshot.revisions.code;
  if (projectComplete) {
    if (!rootVerify || !revisionsMatch || rootVerify.verdict === null || outsideDiff.length > 0) addEntry(zones, "product", "shape-or-revision", {
      reasons: [!rootVerify ? "record-missing" : null, rootVerify && !revisionsMatch ? "revision" : null, rootVerify && !rootVerify.verdict ? "verdict" : null, outsideDiff.length > 0 ? "uncommitted-outside-devflow" : null].filter(Boolean),
      product: snapshot.revisions.product,
      verification: snapshot.revisions.verification,
      code: snapshot.revisions.code,
    });
    else if (rootVerify.verdict === "fail") addEntry(zones, "product", "fail", { reasons: ["recorded-fail"] });
    else if (rootVerify.verdict === "unverified" && !rootVerify.channelUnavailable) addEntry(zones, "product", "unverified", { reasons: ["recorded-unverified"] });
    else if (rootVerify.verdict === "pass" && newEvents.length === 0) addEntry(zones, "complete", "product-pass", { awaitingDecisionCount: verify.eventDecision.length });
  }
  if (snapshot.archFields.get("Brownfield") === "yes" && snapshot.cards.every((card) => ["done", "stale"].includes(card.status))
      && snapshot.waitingFiles.length === 0 && requests.length === 0 && zones.transition.entries.length === 0 && zones.marker.entries.length === 0) {
    addEntry(zones, "complete", "adoption", { awaitingDecisionCount: verify.eventDecision.length });
  }

  for (const detail of snapshot.baseline.details) zones.baseline.entries.push({ detail: true, ...detail });
  const openItems = snapshot.journal.filter((line) => line.kind === "attributed").map((line) => line.raw).concat(snapshot.handoff.openItems);
  const capabilityDocuments = snapshot.baseline.expected.filter((item) => snapshot.baselineFiles.some((relative) => Number(/^(\d+)-/.exec(path.posix.basename(relative))?.[1]) === item.number)).map((item) => path.posix.basename(item.path));
  const chosenProgress = progressLines(chosen);
  const origin = origins.origin(chosen);
  const report = {
    service: snapshot.product.service,
    completeThrough: snapshot.depth1Folders.filter((folder) => folderIdentity(folder)?.status === "done").sort(byteCompare).at(-1) ?? "none",
    taskInProgress: chosen?.path ?? "none",
    progressLastPoint: chosenProgress.at(-1) ?? "none",
    capabilityDocuments: capabilityDocuments.length > 0 ? capabilityDocuments : "none",
    alsoOpen: zones.ready.entries.filter((entry) => !entry.detail).map((entry) => entry.file ?? entry.cards?.[0]).filter(Boolean),
    uncommittedUnattributed: unattributed.length > 0 ? unattributed : "none",
    notYetOnIntegration: changedOnBranch.length > 0 ? changedOnBranch : "none",
    selectionReason: !snapshot.handoff.stale && snapshot.handoff.nextStep ? "last-handoff" : "canonical-order",
    openItems: openItems.length,
    ...origin,
  };
  const facts = {
    report,
    handoff: { date: snapshot.handoff.date ?? "none", stale: snapshot.handoff.stale ? 1 : 0, nextStep: snapshot.handoff.nextStep ?? "none" },
    openItems,
    existingRequests: requests.map((line) => line.raw),
    findings: verify.findings,
  };
  return { zones, facts, verify, integrityItems, changedOnBranch };
}

function scalar(value) {
  if (value === null) return "null";
  if (value === undefined) return "unknown";
  if (typeof value === "string" && /^[^\s=;]+$/.test(value)) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function fieldString(values, omitted = new Set()) {
  return Object.entries(values).filter(([key, value]) => !omitted.has(key) && value !== undefined)
    .map(([key, value]) => `${key}=${scalar(value)}`).join(" ");
}

function boundedUtf8(value, limit = COMPACT_FIELD_LIMIT) {
  if (Buffer.byteLength(value) <= limit) return { value, truncated: false };
  const suffix = "...";
  let prefix = "";
  for (const character of value) {
    if (Buffer.byteLength(`${prefix}${character}${suffix}`) > limit) break;
    prefix += character;
  }
  return { value: `${prefix}${suffix}`, truncated: true };
}

function compactFieldString(values, omitted = new Set()) {
  const fields = [];
  for (const [key, value] of Object.entries(values)) {
    if (omitted.has(key) || value === undefined) continue;
    const rendered = typeof value === "string" ? value : JSON.stringify(value);
    if (!COMPACT_LOSSY_FIELDS.has(key)) {
      fields.push(`${key}=${scalar(value)}`);
      continue;
    }
    const bounded = boundedUtf8(rendered);
    if (bounded.truncated) {
      fields.push(`${key}=${JSON.stringify(bounded.value)}`, `${key}Truncated=1`);
    } else {
      fields.push(`${key}=${scalar(value)}`);
    }
  }
  return fields.join(" ");
}

function zoneOrder(treePresent, zones) {
  return [...ZONE_DEFINITIONS].sort((left, right) => {
    if (treePresent) return left.present - right.present;
    const rank = (definition) => {
      const actual = zones[definition.zone].entries.filter((entry) => entry.kind).map((entry) => ROUTE_RANK.get(`${definition.zone}.${entry.kind}`)?.absent).filter((value) => value !== null && value !== undefined);
      return actual.length > 0 ? Math.min(...actual) : definition.absent;
    };
    return rank(left) - rank(right);
  });
}

function sortedEntries(zone, entries, treePresent) {
  return [...entries].sort((left, right) => {
    if (!left.kind || !right.kind) return left.kind ? -1 : right.kind ? 1 : 0;
    const a = ROUTE_RANK.get(`${zone}.${left.kind}`);
    const b = ROUTE_RANK.get(`${zone}.${right.kind}`);
    return (treePresent ? a.present : a.absent ?? a.present) - (treePresent ? b.present : b.absent ?? b.present);
  });
}

function firstRoute(order, zones, treePresent) {
  for (const definition of order) {
    for (const entry of sortedEntries(definition.zone, zones[definition.zone].entries, treePresent)) {
      if (!entry.kind) continue;
      const registered = ROUTE_RANK.get(`${definition.zone}.${entry.kind}`);
      if (registered.routing === false) continue;
      if (!treePresent && registered.absent === null) continue;
      return `${definition.zone}.${entry.kind}`;
    }
  }
  return "none";
}

function capabilityFromValue(snapshot, value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const tree = /^devflow\/tree\/([^/]+)/.exec(value);
  if (tree) return Number(folderIdentity(`devflow/tree/${tree[1]}`)?.number) || null;
  const baseline = /^devflow\/project\/capabilities\/(\d+)-/.exec(value);
  if (baseline) return Number(baseline[1]);
  const card = new RegExp(`^(${CARD_NUMBER})(?:$|[-.])`).exec(value);
  if (card) return Number(/^\d+/.exec(card[1])?.[0]) || null;
  const folder = /^(\d+)-/.exec(value);
  return folder ? Number(folder[1]) : null;
}

function entryCapabilities(snapshot, entry) {
  const result = new Set();
  const visit = (value) => {
    if (Array.isArray(value)) { for (const item of value) visit(item); return; }
    if (value && typeof value === "object") {
      for (const key of ["capability", "path", "file", "folder", "card", "paths", "cards", "candidates", "missing", "carryFacts"]) {
        if (Object.hasOwn(value, key)) visit(value[key]);
      }
      return;
    }
    const number = capabilityFromValue(snapshot, value);
    if (number !== null) result.add(number);
  };
  visit(entry);
  return result;
}

function projectedEntry(snapshot, zone, entry, selected) {
  if (zone === "blocked" && entry.kind === "channel") {
    return entry.target === selected ? entry : null;
  }
  if (zone === "blocked" && entry.kind === "audits") {
    const candidates = (entry.candidates ?? []).filter((value) => {
      const capability = capabilityFromValue(snapshot, value);
      return capability === null || capability === selected;
    });
    return candidates.length > 0 ? { ...entry, candidates } : null;
  }
  if (zone === "blocked" && entry.kind === "dependencies") {
    const cards = (entry.cards ?? []).filter((value) => capabilityFromValue(snapshot, value) === selected);
    if (cards.length === 0) return null;
    const selectedNumbers = new Set(cards);
    const reasons = snapshot.cards
      .filter((card) => card.status === "pending" && !card.closedFolder && selectedNumbers.has(card.number))
      .flatMap((card) => cardJudgment(snapshot, card).blockers);
    return { ...entry, cards, reasons };
  }
  if (zone === "blocked" && entry.kind === "other-claims") {
    const pairs = (entry.cards ?? []).map((card, index) => ({ card, claimant: entry.claimants?.[index] }))
      .filter((item) => capabilityFromValue(snapshot, item.card) === selected);
    return pairs.length > 0 ? { ...entry, cards: pairs.map((item) => item.card), claimants: pairs.map((item) => item.claimant) } : null;
  }
  if (zone === "layer" && entry.kind === "correspondence-gap") {
    const missing = (entry.missing ?? []).filter((value) => capabilityFromValue(snapshot, value) === selected);
    return missing.length > 0 ? { ...entry, missing } : null;
  }
  const capabilities = entryCapabilities(snapshot, entry);
  return capabilities.size === 0 || capabilities.has(selected) ? entry : null;
}

function projectedBaselineSummary(snapshot, selected) {
  const records = snapshot.baseline.records.filter((record) => Number(record.capability) === selected);
  return {
    expected: records.length,
    legacyV010: records.filter((record) => record.legacy).length,
    designRefresh: records.filter((record) => !record.legacy && (!record.headExists
      || (record.shape.boundaryCount === 1 && (!record.shape.shapeValid || !record.designFresh)))).length,
    boundary: records.some((record) => record.shape.boundaryCount !== 1 && record.headExists && !record.legacy) ? "anomaly" : "ok",
    anomalies: records.flatMap((record) => record.shape.anomalies).length,
  };
}

function renderProjection(snapshot, evaluated) {
  const selected = snapshot.options.capability === undefined ? null : Number(snapshot.options.capability);
  if (selected === null) return { evaluated, narrow: "none", removed: 0 };
  const zones = Object.fromEntries(Object.entries(evaluated.zones).map(([name, zone]) => [name, {
    summary: zone.summary,
    entries: [...zone.entries],
  }]));
  let removed = 0;
  for (const name of ["claim", "baseline", "ready", "blocked", "layer"]) {
    const before = zones[name].entries;
    zones[name].entries = before.map((entry) => projectedEntry(snapshot, name, entry, selected)).filter(Boolean);
    removed += before.length - zones[name].entries.length;
    for (let index = 0; index < Math.min(before.length, zones[name].entries.length); index += 1) {
      if (JSON.stringify(before[index]) !== JSON.stringify(zones[name].entries[index])) removed += 1;
    }
  }
  const selectedCards = snapshot.cards.filter((card) => !card.closedFolder && capabilityFromValue(snapshot, card.path) === selected);
  const summaries = {
    claim: {
      mine: selectedCards.filter((card) => card.status === "claimed" && card.claimant === snapshot.room?.id).length,
      others: selectedCards.filter((card) => card.status === "claimed" && card.claimant !== snapshot.room?.id).length,
    },
    baseline: projectedBaselineSummary(snapshot, selected),
    ready: { count: selectedCards.filter((card) => card.status === "pending").length },
  };
  for (const [name, summary] of Object.entries(summaries)) {
    if (JSON.stringify(zones[name].summary) !== JSON.stringify(summary)) removed += 1;
    zones[name].summary = summary;
  }
  const report = { ...evaluated.facts.report };
  if (Array.isArray(report.alsoOpen)) {
    const before = report.alsoOpen;
    report.alsoOpen = before.filter((value) => capabilityFromValue(snapshot, value) === selected);
    removed += before.length - report.alsoOpen.length;
  }
  const taskCapability = capabilityFromValue(snapshot, report.taskInProgress);
  if (taskCapability !== null && taskCapability !== selected) {
    report.taskInProgress = "none";
    report.progressLastPoint = "none";
    report.origin = "none";
    delete report.originReason;
    removed += 1;
  }
  const facts = { ...evaluated.facts, report };
  return { evaluated: { ...evaluated, zones, facts }, narrow: removed > 0 ? String(selected) : "none", removed };
}

// The priority table is executable data. This narrow export lets the structural
// contract exercise the same selector without manufacturing every filesystem state.
export function selectFirstRoute(activeRoutes, treePresent = true) {
  const zones = zoneBag();
  for (const route of activeRoutes) {
    const [zone, kind] = route.split(".");
    addEntry(zones, zone, kind);
  }
  return firstRoute(zoneOrder(treePresent, zones), zones, treePresent);
}

function renderBody(snapshot, evaluated, form) {
  const order = zoneOrder(snapshot.treePresent, evaluated.zones);
  const body = [];
  const fieldsFor = form === "full" ? fieldString : compactFieldString;
  for (const definition of order) {
    const zone = evaluated.zones[definition.zone];
    if (zone.summary === null && zone.entries.length === 0) body.push(`${definition.zone}: none`);
    else {
      if (zone.summary !== null) body.push(`${definition.zone}: ${fieldsFor(zone.summary)}`);
      else body.push(`${definition.zone}: count=${zone.entries.length}`);
      for (const entry of sortedEntries(definition.zone, zone.entries, snapshot.treePresent)) {
        if (entry.detail === true) body.push(`${definition.zone}: ${fieldsFor(entry, new Set(["detail"]))}`);
        else body.push(`${definition.zone}: kind=${entry.kind} ${fieldsFor(entry, new Set(["kind"]))}`.trimEnd());
      }
    }
  }
  body.push(`report: ${fieldsFor(evaluated.facts.report)}`);
  body.push(`handoff: ${fieldsFor(evaluated.facts.handoff)}`);
  body.push(`revisions: ${fieldsFor(snapshot.revisions)}`);
  for (const line of evaluated.facts.openItems) body.push(`open-item: ${line}`);
  for (const line of evaluated.facts.existingRequests) body.push(`existing-request: ${line}`);
  for (const line of evaluated.facts.findings) body.push(`finding: ${line}`);
  body.push(`next: ${firstRoute(order, evaluated.zones, snapshot.treePresent)}`);
  return body;
}

function stateLine(snapshot, evaluated, form, bytes, narrow) {
  const anomalies = evaluated.integrityItems.length + snapshot.product.anomalies.length + snapshot.baseline.anomalies.length;
  const head = snapshot.head === "none" ? "none" : snapshot.head.slice(0, 8);
  const integration = snapshot.integration.hash ? `${snapshot.integration.branch}@${snapshot.integration.hash.slice(0, 8)}` : `${snapshot.integration.branch}@unknown`;
  return `state: schema=1 root=${scalar(snapshot.root)} head=${head} integration=${integration} networkNeeded=${snapshot.integration.networkNeeded ? 1 : 0} tree=${snapshot.treePresent ? "present" : "absent"} anomalies=${anomalies} narrow=${narrow} bytes=${bytes}/${OUTPUT_LIMIT} form=${form}`;
}

function render(snapshot, evaluated, form, narrow) {
  const body = renderBody(snapshot, evaluated, form);
  let bytes = 0;
  let output = "";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    output = `${stateLine(snapshot, evaluated, form, bytes, narrow)}\n${body.join("\n")}\n`;
    const measured = Buffer.byteLength(output);
    if (measured === bytes) break;
    bytes = measured;
  }
  return { output, bytes: Buffer.byteLength(output) };
}

export async function calculateState(options) {
  const snapshot = await loadSnapshot(options);
  const evaluated = evaluateZones(snapshot);
  const projected = renderProjection(snapshot, evaluated);
  let rendered = render(snapshot, projected.evaluated, "full", projected.narrow);
  if (rendered.bytes <= OUTPUT_LIMIT) return { ...rendered, status: 0, form: "full", snapshot, evaluated };
  rendered = render(snapshot, projected.evaluated, "compact", projected.narrow);
  if (rendered.bytes <= OUTPUT_LIMIT) return { ...rendered, status: 0, form: "compact", snapshot, evaluated };
  const anomalies = evaluated.integrityItems.length + snapshot.product.anomalies.length + snapshot.baseline.anomalies.length;
  const advice = snapshot.options.capability === undefined ? "; narrow --capability <n>" : "";
  const output = `state: schema=1 root=${scalar(snapshot.root)} head=${snapshot.head.slice(0, 8)} integration=${snapshot.integration.branch}@${snapshot.integration.hash?.slice(0, 8) ?? "unknown"} tree=${snapshot.treePresent ? "present" : "absent"} anomalies=${anomalies} narrow=${projected.narrow} bytes=0/${OUTPUT_LIMIT} form=compact emitted=0\nblocked: output budget exceeded${advice}\n`;
  return { output, bytes: Buffer.byteLength(output), status: 3, form: "refused", snapshot, evaluated };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const result = await calculateState(options);
  process.stdout.write(result.output);
  process.exitCode = result.status;
}

const self = path.resolve(fileURLToPath(import.meta.url));
const invoked = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invoked === self) {
  try {
    await main();
  } catch (error) {
    if (error instanceof CliError) {
      console.error(`error: ${error.message}`);
      process.exitCode = error.status;
    } else {
      throw error;
    }
  }
}
