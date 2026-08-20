#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";

const OUTPUT_LIMIT = 24 * 1024;
const COMPACT_FIELD_LIMIT = 96;
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
    { name: "capability-closure", present: 4.01, absent: null },
    { name: "re-split", present: 4.02, absent: 8 },
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
    "needs-normalization", "approval-invalid", "approval-pending", "ready", "waiting-capability",
  ].map((name, index) => ({ name, present: 11 + index / 100, absent: null })) },
  { zone: "blocked", present: 12, absent: 22, kinds: [
    "audits", "dependencies", "other-claims",
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

function readFile(root, relative) {
  const target = path.resolve(root, ...relative.split("/"));
  if (!inside(root, target) || !fs.existsSync(target) || !fs.statSync(target).isFile()) return null;
  return decodeUtf8(fs.readFileSync(target), relative).replace(/\r\n/g, "\n");
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
  return decodeUtf8(gitRun(root, args, options).stdout, `git ${args[0]} output`).replace(/\r\n/g, "\n");
}

function gitLine(root, args, options = {}) {
  return gitText(root, args, options).trim();
}

function gitPathExists(root, ref, relative) {
  return gitRun(root, ["cat-file", "-e", `${ref}:${relative}`], { allowFailure: true }).status === 0;
}

function gitFile(root, ref, relative) {
  const run = gitRun(root, ["show", `${ref}:${relative}`], { allowFailure: true });
  return run.status === 0 ? decodeUtf8(run.stdout, `${relative}@${ref}`).replace(/\r\n/g, "\n") : null;
}

function gitNulList(root, args) {
  const bytes = gitRun(root, args, { allowFailure: true });
  if (bytes.status !== 0) return [];
  // File names are only decoded after Git has finished producing its NUL-delimited list.
  // Revision hashes below never cross this conversion boundary.
  return decodeUtf8(bytes.stdout, `git ${args[0]} path list`).split("\0").filter(Boolean);
}

function cmdQuote(argument) {
  return `"${String(argument).replace(/(["^&|<>])/g, "^$1").replace(/%/g, "%%")}"`;
}

async function nativeBinaryHash(root, revision, paths) {
  const leftArgs = ["ls-tree", "-r", "-z", "--full-tree", revision, "--", ...paths];
  if (process.platform === "win32") {
    const command = ["git", ...leftArgs].map(cmdQuote).join(" ")
      + " | " + ["git", "hash-object", "--stdin"].map(cmdQuote).join(" ");
    const run = spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `"${command}"`], {
      cwd: root,
      maxBuffer: MAX_BUFFER,
      windowsHide: true,
      windowsVerbatimArguments: true,
    });
    if (run.error || run.status !== 0) return null;
    return decodeUtf8(run.stdout, "binary revision hash").trim();
  }
  return await new Promise((resolve) => {
    const left = spawn("git", leftArgs, { cwd: root, stdio: ["ignore", "pipe", "ignore"] });
    const right = spawn("git", ["hash-object", "--stdin"], { cwd: root, stdio: ["pipe", "pipe", "ignore"] });
    const chunks = [];
    left.stdout.pipe(right.stdin);
    right.stdout.on("data", (chunk) => chunks.push(chunk));
    let leftStatus = null;
    let rightStatus = null;
    const finish = () => {
      if (leftStatus === null || rightStatus === null) return;
      if (leftStatus !== 0 || rightStatus !== 0) resolve(null);
      else resolve(decodeUtf8(Buffer.concat(chunks), "binary revision hash").trim());
    };
    left.on("close", (status) => { leftStatus = status; finish(); });
    right.on("close", (status) => { rightStatus = status; finish(); });
    left.on("error", () => resolve(null));
    right.on("error", () => resolve(null));
  });
}

function parseArguments(argv) {
  if (argv.length === 0) fail("missing subcommand (state)");
  if (argv[0] !== "state") fail(`unknown subcommand ${argv[0]}`);
  const options = { root: process.cwd() };
  for (let index = 1; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--root", "--capability", "--card"].includes(flag)) fail(`unknown option ${flag}`);
    if (value === undefined || value.startsWith("--")) fail(`${flag} requires a value`);
    index += 1;
    if (flag === "--root") options.root = value;
    if (flag === "--capability") options.capability = value;
    if (flag === "--card") options.card = value.replace(/\\/g, "/").replace(/^\.\//, "");
  }
  if (options.capability !== undefined && !/^0*[1-9][0-9]*$/.test(options.capability)) {
    fail("--capability must be a positive integer");
  }
  if (options.card !== undefined && (path.posix.isAbsolute(options.card)
      || options.card.split("/").some((part) => !part || part === "." || part === ".."))) {
    fail("--card must be a repository-relative / path");
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

function statusless(component) {
  return component
    .replace(/\.wip(?:-[a-z0-9]{2,8})?(?=\.|$)/, "")
    .replace(/\.(?:done|stale)(?=\.|$)/, "");
}

function normalizedStatusPath(relative) {
  return relative.split("/").map(statusless).join("/");
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

function parseCard(root, relative) {
  const text = readFile(root, relative);
  if (text === null) return null;
  const identity = cardIdentity(relative);
  if (identity === null) return null;
  const cardFields = fields(text);
  const legacy = !cardFields.has("Approval") || !cardFields.has("Review");
  const depends = parseDepends(cardFields.get("Depends"), legacy);
  return {
    ...identity,
    path: relative,
    text,
    fields: cardFields,
    depends,
    approval: cardFields.get("Approval") ?? null,
    review: cardFields.get("Review") ?? null,
    legacy,
  };
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
  const output = [];
  const records = [];
  const allAnomalies = [];
  let legacyCount = 0;
  let designRefreshCount = 0;
  let boundaryState = "ok";
  const currentDesignHead = await designHead(snapshot.root);
  const detailedNumbers = capabilityFilter === undefined ? new Set() : new Set([Number(capabilityFilter)]);
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

function parseJournalLine(line, lineNumber) {
  const out = { raw: line, line: lineNumber, kind: "other", valid: true };
  let match;
  if ((match = new RegExp(`^${TIMESTAMP} layer opening: parent: (?<parent>devflow/tree(?:/[^;]+)?); children: (?<children>${CARD_NUMBER}(?:\\+${CARD_NUMBER})*); source-json: (?<sourceJson>.+)$`).exec(line))) {
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
  if ((match = new RegExp(`^${TIMESTAMP} capability note: capability: (?<capability>\\d+); note-json: (?<noteJson>.+)$`).exec(line))) {
    const note = parseJsonValue(match.groups.noteJson);
    return { ...out, kind: "capability-note", ...match.groups, note: note.value, valid: note.ok && typeof note.value === "string" };
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
    return { ...out, kind: "attributed", ...timestamped.groups };
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

function parseHandoff(root, room, cards) {
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
  if (date !== null) {
    const newest = gitLine(root, ["log", "-1", "--format=%cI", "--", ...cards.filter((card) => card.claimant === room.id).map((card) => card.path)], { allowFailure: true });
    if (newest && Date.parse(newest) > Date.parse(date)) stale = true;
  }
  if (nextStep && !cards.some((card) => normalizedStatusPath(card.path) === normalizedStatusPath(nextStep))) stale = true;
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
      from = relative;
      relative = entries[index + 1] ?? relative;
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
    : gitLine(snapshot.root, ["hash-object", "devflow/project/product.md"], { allowFailure: true }) || "none";
  const verificationPaths = [
    "devflow/project/arch.md", "devflow/project/code-style.md", "devflow/project/glossary.md",
  ].filter((relative) => gitPathExists(snapshot.root, "HEAD", relative));
  const verification = await nativeBinaryHash(snapshot.root, "HEAD", verificationPaths) ?? "unresolved";
  const code = gitLine(snapshot.root, ["log", "-1", "--format=%H", "--", ".", ":(exclude)devflow/**"], { allowFailure: true }) || "none";
  let capability = "not-applicable";
  if (capabilityNumber !== undefined) {
    const folders = snapshot.depth1Folders.filter((folder) => Number(folderIdentity(folder)?.number) === Number(capabilityNumber));
    if (folders.length !== 1) capability = "unresolved";
    else {
      const targetCards = snapshot.cards.filter((card) => card.status === "done" && card.path.startsWith(`${folders[0]}/`));
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
  const cardPaths = listFiles(root, "devflow/tree").filter((relative) => relative.endsWith(".md") && cardIdentity(relative));
  const cards = cardPaths.map((relative) => parseCard(root, relative)).filter(Boolean).sort((a, b) => canonicalCardCompare(a.number, b.number) || byteCompare(a.path, b.path));
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
  snapshot.handoff = parseHandoff(root, room, cards);
  snapshot.revisions = await revisions(snapshot, options.capability === undefined ? undefined : Number(options.capability));
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
      ? (state.contents.has(candidate) ? state.contents.get(candidate) : gitFile(snapshot.root, object.base, candidate)) : null))) return { ok: true, prefix };
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
      if (tree.has(operation.path) && contentAt(operation.path) === operation.content) return { ok: false, reason: "operation-write-no-change" };
      tree.add(operation.path);
      contents.set(operation.path, operation.content);
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
  return { ok: true, object, lineNumber, prefix: prefix.prefix };
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
    const failureIds = [...(failure?.lines.join("\n") ?? "").matchAll(/source id:\s*(\d+)[^\n]*failure:/g)].map((match) => Number(match[1]));
    result.records.push({
      path: relative,
      current,
      target: folderInfo ? Number(folderInfo.number) : "product",
      capabilityDone: folderInfo?.status === "done",
      failureMax: failureIds.length > 0 ? Math.max(...failureIds) : null,
      auditKeys: eventKeys(audit ?? { lines: [] }),
      retrospectiveKeys: eventKeys(retrospective ?? { lines: [] }),
    });
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const prepared = /routing prepared:\s*(\{.*\})\s*$/.exec(line);
      if (prepared) {
        const validated = validatePreparedObject(snapshot, relative, prepared[1], index + 1);
        if (validated.ok) result.prepared.push({ path: relative, base: validated.object.base, result: validated.object.result, operations: validated.object.operations, prefix: validated.prefix, line: index + 1 });
        else result.invalidPrepared.push({ path: relative, line: index + 1, raw: line, reason: validated.reason });
      }
      const role = nearestEventRole(lines, index);
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
      if (body && body !== "- not run" && body !== "None.") {
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
    if (candidates.length === 1 && checkpointCard !== null && candidates[0].text === checkpointCard) finalizingDone = candidates[0];
    else return `finalizing-done-resolves-${candidates.length}`;
  } else if (current.length !== 1) return `card-resolves-${current.length}`;
  const claimant = current[0]?.claimant ?? /\.wip-([a-z0-9]{2,8})(?=\.|$)/.exec(line.card ?? "")?.[1] ?? null;
  const subject = gitLine(snapshot.root, ["show", "-s", "--format=%s", hash], { allowFailure: true });
  if (!expected || !claimant || subject !== `${claimant} ${expected.number} wip: evidence-wait`) return "checkpoint-subject";
  const changed = gitNulList(snapshot.root, ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", hash]);
  if (!changed.includes(line.card)) return "checkpoint-path";
  if (checkpointCard === null) return "checkpoint-card-missing";
  const checks = [...checkpointCard.matchAll(/^.*remote evidence check: check-json:\s*(.+);\s*verdict:/gm)];
  if (checks.length === 0) return "checkpoint-check-missing";
  const parsed = parseJsonValue(checks.at(-1)[1]);
  if (!parsed.ok || typeof parsed.value !== "string" || parsed.value !== line.check) return "checkpoint-check-json";
  return finalizingDone ? null : null;
}

function locatorResolutionCount(snapshot, locator) {
  let match;
  if ((match = /^core:(devflow\/[^#]+)#(.+)$/.exec(locator))) {
    const text = readFile(snapshot.root, match[1]);
    if (text === null) return 0;
    return text.split("\n").filter((line) => normalizedHeading(line).replace(/^#{1,6}\s+/, "") === match[2]).length;
  }
  if ((match = /^card:(devflow\/[^@]+)@([0-9a-f]{40,64})$/.exec(locator))) {
    return gitFile(snapshot.root, match[2], match[1]) === null ? 0 : 1;
  }
  if ((match = /^journal:(.+)$/.exec(locator))) {
    return (snapshot.journalText ?? "").split("\n").filter((line) => line === match[1]).length;
  }
  if ((match = /^verify:(devflow\/[^#]+)#Failure history@(\d+)$/.exec(locator))) {
    const part = verificationRecordParts(snapshot.verifyTexts.get(match[1]) ?? readFile(snapshot.root, match[1])).find((item) => item.name === "Failure history");
    return part?.lines.filter((line) => new RegExp(`\\bsource id:\\s*${match[2]}\\s*(?:[;·]|$)`).test(line)).length ?? 0;
  }
  if ((match = /^verify:(devflow\/[^#]+)#(Audit|Retrospective)@(\d+)\/(\d+)$/.exec(locator))) {
    const part = verificationRecordParts(snapshot.verifyTexts.get(match[1]) ?? readFile(snapshot.root, match[1])).find((item) => item.name === match[2]);
    if (!part) return 0;
    let inEvent = false;
    let count = 0;
    for (const line of part.lines) {
      if (/^-\s+/.test(line)) inEvent = new RegExp(`source id:\\s*${match[3]}(?:\\s*[·;]|$)`).test(line);
      else if (inEvent && new RegExp(`^\\s+${match[4]}\\.\\s+`).test(line)) count += 1;
    }
    return count;
  }
  return 0;
}

function integrity(snapshot, verify) {
  const anomalies = [];
  const report = (item, blocking, values) => anomalies.push({ item, blocking, ...values });
  const roomIds = new Set(snapshot.owners.map((owner) => owner.id));

  for (const card of snapshot.cards) {
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
    for (const reason of card.depends.anomalies) report(4, false, { path: card.path, reason });
    for (const number of card.depends.numbers) {
      if ((byNumber.get(number) ?? []).length !== 1) report(4, false, { path: card.path, reason: `dependency-resolves-${(byNumber.get(number) ?? []).length}:${number}` });
    }
  }
  if (snapshot.handoff.nextStep) {
    const matches = snapshot.cards.filter((card) => normalizedStatusPath(card.path) === normalizedStatusPath(snapshot.handoff.nextStep));
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
  for (const card of snapshot.cards.filter((item) => item.claimant)) {
    const owner = snapshot.owners.find((candidate) => candidate.id === card.claimant);
    if (owner && claimAuthorMismatch(snapshot, card, owner)) report(8, false, { path: card.path, reason: "claimant-author-mismatch" });
  }
  for (const card of snapshot.cards.filter((item) => item.status === "pending")) {
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
    const count = locatorResolutionCount(snapshot, line.source);
    if (count !== 1) report(12, true, { path: "devflow/journal.md", line: line.raw, expected: "canonical source locator resolving to exactly one source", reason: `source-resolves-${count}` });
  }
  for (const line of snapshot.journal.filter((item) => ["evidence-wait", "evidence-finalizing"].includes(item.kind))) {
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
  if (card.approval === "pending") return { value: "pending", reasons: [] };
  if (!APPROVAL_RE.test(card.approval ?? "")) return { value: "invalid", reasons: ["format"] };
  if (!gitPathExists(snapshot.root, snapshot.integration.ref, card.path)) return { value: "invalid", reasons: ["authority-path-missing"] };
  const changed = new Set([
    ...gitNulList(snapshot.root, ["diff", "--name-only", "-z", "--no-renames", "--", "devflow/tree"]),
    ...gitNulList(snapshot.root, ["diff", "--cached", "--name-only", "-z", "--no-renames", snapshot.integration.ref, "--", "devflow/tree"]),
  ]);
  return changed.has(card.path) ? { value: "invalid", reasons: ["card-diff"] } : { value: "effective", reasons: [] };
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

function classifyWorkingTransition(snapshot) {
  const paths = snapshot.status.map((entry) => entry.path);
  if (paths.length === 0) return null;
  const allowed = paths.every((relative) => relative === "devflow/journal.md" || /(?:^|\/)verify\.md$/.test(relative)
    || /^devflow\/project\/capabilities\/[^/]+\.md$/.test(relative));
  if (!allowed) return null;
  if (snapshot.verifyTexts.size === 0) return null;
  return { paths, state: "working-tree", case: "canonical-output-prefix" };
}

function directChildren(snapshot, directory) {
  const cards = snapshot.cards.filter((card) => path.posix.dirname(card.path) === directory);
  const folders = snapshot.directories.filter((child) => path.posix.dirname(child) === directory).map((relative) => ({
    path: relative,
    ...folderIdentity(relative),
  }));
  return { cards, folders };
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
  return snapshot.cards.find((card) => card.claimant === snapshot.room?.id) ?? null;
}

function finalTaskCommit(snapshot, card) {
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
  ];

  const changedOnBranch = snapshot.integration.hash
    ? gitNulList(snapshot.root, ["diff", "--name-only", "-z", `${snapshot.integration.ref}..HEAD`, "--", "devflow/tree", "devflow/journal.md"])
      .filter((relative) => relative === "devflow/journal.md" || cardIdentity(relative))
    : [];
  const outsideDiff = snapshot.status.filter((item) => !item.path.startsWith("devflow/"));
  const chosen = firstMine(snapshot);
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
  const interrupted = verify.prepared.length === 0 ? classifyWorkingTransition(snapshot) : null;
  if (interrupted) addEntry(zones, "transition", "interrupted", interrupted);
  for (const item of verify.sourceMigration) addEntry(zones, "transition", "source-id-migration", item);
  for (const line of snapshot.journal.filter((item) => item.kind === "layer-opening" && item.valid).sort((a, b) => a.timestamp.localeCompare(b.timestamp))) {
    addEntry(zones, "transition", "layer-opening", { parent: line.parent, children: line.children, sourceJson: line.source, timestamp: line.timestamp });
  }
  for (const line of snapshot.journal.filter((item) => item.kind === "product-running")) addEntry(zones, "transition", "product-running", {
    product: line.product, verification: line.verification, code: line.code, trigger: line.trigger,
  });
  for (const line of snapshot.journal.filter((item) => item.kind === "product-result")) addEntry(zones, "transition", "product-result", {
    product: line.product, verification: line.verification, code: line.code, verdict: line.verdict, trigger: line.trigger,
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
    addEntry(zones, "transition", "finish-boundary", { card: card.path, case: "final-task-subject" });
  }
  for (const status of snapshot.status.filter((item) => /\.wip-[a-z0-9]+\.md$/.test(item.from ?? "") && /\.done\.md$/.test(item.path))) {
    addEntry(zones, "transition", "finish-boundary", { card: status.from, path: status.path, case: "claim-done-move" });
  }
  for (const item of verify.eventRouting) addEntry(zones, "transition", "event-routing", item);
  for (const item of verify.eventDecision) addEntry(zones, "transition", "event-decision", item);
  for (const item of verify.failureRouting.sort((a, b) => byteCompare(a.path, b.path) || (a.sourceId ?? 0) - (b.sourceId ?? 0))) {
    addEntry(zones, "transition", "failure-routing", item);
  }

  for (const line of snapshot.journal.filter((item) => item.kind === "product-rerun")) addEntry(zones, "marker", "product-rerun", { marker: line.raw, timestamp: line.timestamp });
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
  for (const card of snapshot.cards) cardDetails.set(card.path, cardJudgment(snapshot, card));
  for (const card of snapshot.cards.filter((item) => item.status === "claimed")) {
    if (card.claimant !== snapshot.room?.id) { claimSummary.others += 1; continue; }
    claimSummary.mine += 1;
    const judgment = cardDetails.get(card.path);
    const common = { path: card.path, depends: card.depends.numbers.length === 0 ? "done" : judgment.blockers.length === 0 ? "done" : "blocked", approval: judgment.approval.value, blockers: judgment.blockers };
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
  if (verify.root?.verdict && rootRecord?.current && !rootRecord.auditKeys.has("product")) newEvents.push({ role: "Audit", target: "product", key: "product" });
  if (verify.root?.verdict && rootRecord?.current && !rootRecord.retrospectiveKeys.has("product")) newEvents.push({ role: "Retrospective", target: "product", key: "product" });
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
      if (directory.split("/").length === 3 && Number(identity.number) !== 1) {
        layerSummary.childrenDone += 1;
        addEntry(zones, "layer", "children-done", { folder: directory });
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

  const pendingCards = snapshot.cards.filter((card) => card.status === "pending");
  const readySummary = { count: pendingCards.length };
  for (const card of pendingCards) {
    const judgment = cardDetails.get(card.path);
    const detail = { file: card.path, cards: [card.number], depends: card.depends.numbers, approval: judgment.approval.value, ready: judgment.ready, blockers: judgment.blockers };
    if (card.legacy || !card.depends.canonical) addEntry(zones, "ready", "needs-normalization", { ...detail, missingFields: [!card.fields.has("Approval") ? "Approval" : null, !card.fields.has("Review") ? "Review" : null].filter(Boolean), invalidity: card.depends.anomalies });
    else if (card.approval !== "pending" && judgment.approval.value !== "effective") addEntry(zones, "ready", "approval-invalid", { ...detail, invalidity: judgment.approval.reasons });
    else if (card.approval === "pending") addEntry(zones, "ready", "approval-pending", detail);
    else if (judgment.ready) addEntry(zones, "ready", "ready", detail);
  }
  for (const relative of snapshot.waitingFiles) addEntry(zones, "ready", "waiting-capability", { file: relative });
  zones.ready.summary = readySummary;

  const blockedAudit = verify.eventPending.filter((item) => item.role === "Audit" && outsideDiff.length > 0);
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
    else if (rootVerify.verdict === "unverified") addEntry(zones, "product", "unverified", { reasons: ["recorded-unverified"] });
    else if (rootVerify.verdict === "pass" && newEvents.length === 0) addEntry(zones, "complete", "product-pass", { awaitingDecisionCount: verify.eventDecision.length });
  }
  if (snapshot.archFields.get("Brownfield") === "yes" && snapshot.cards.every((card) => ["done", "stale"].includes(card.status))
      && snapshot.waitingFiles.length === 0 && requests.length === 0 && zones.transition.entries.length === 0 && zones.marker.entries.length === 0) {
    addEntry(zones, "complete", "adoption", { awaitingDecisionCount: verify.eventDecision.length });
  }

  for (const detail of snapshot.baseline.details) zones.baseline.entries.push({ detail: true, ...detail });
  const openItems = snapshot.journal.filter((line) => line.kind === "attributed").map((line) => line.raw).concat(snapshot.handoff.openItems);
  const capabilityDocuments = snapshot.baseline.expected.filter((item) => snapshot.baselineFiles.some((relative) => Number(/^(\d+)-/.exec(path.posix.basename(relative))?.[1]) === item.number)).map((item) => path.posix.basename(item.path));
  const progressLines = chosen ? extractSection(chosen.text, "## Progress log")?.split("\n").filter((line) => line.trim()) ?? [] : [];
  const report = {
    service: snapshot.product.service,
    completeThrough: snapshot.depth1Folders.filter((folder) => folderIdentity(folder)?.status === "done").sort(byteCompare).at(-1) ?? "none",
    taskInProgress: chosen?.path ?? "none",
    progressLastPoint: progressLines.at(-1) ?? "none",
    capabilityDocuments: capabilityDocuments.length > 0 ? capabilityDocuments : "none",
    alsoOpen: zones.ready.entries.filter((entry) => !entry.detail).map((entry) => entry.file ?? entry.cards?.[0]).filter(Boolean),
    uncommittedUnattributed: unattributed.length > 0 ? unattributed : "none",
    notYetOnIntegration: changedOnBranch.length > 0 ? changedOnBranch : "none",
    selectionReason: !snapshot.handoff.stale && snapshot.handoff.nextStep ? "last-handoff" : "canonical-order",
    openItems: openItems.length,
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
    const bounded = boundedUtf8(rendered);
    if (bounded.truncated) {
      fields.push(`${key}=${JSON.stringify(bounded.value)}`, `${key}Truncated=1`);
    } else {
      fields.push(`${key}=${scalar(value)}`);
    }
  }
  return fields.join(" ");
}

function compactFact(prefix, value) {
  const bounded = boundedUtf8(value);
  return `${prefix}: ${bounded.value}${bounded.truncated ? " [truncated]" : ""}`;
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
  for (const line of evaluated.facts.openItems) body.push(form === "full" ? `open-item: ${line}` : compactFact("open-item", line));
  for (const line of evaluated.facts.existingRequests) body.push(form === "full" ? `existing-request: ${line}` : compactFact("existing-request", line));
  for (const line of evaluated.facts.findings) body.push(form === "full" ? `finding: ${line}` : compactFact("finding", line));
  body.push(`next: ${firstRoute(order, evaluated.zones, snapshot.treePresent)}`);
  return body;
}

function stateLine(snapshot, evaluated, form, bytes) {
  const anomalies = evaluated.integrityItems.length + snapshot.product.anomalies.length + snapshot.baseline.anomalies.length;
  const head = snapshot.head === "none" ? "none" : snapshot.head.slice(0, 8);
  const integration = snapshot.integration.hash ? `${snapshot.integration.branch}@${snapshot.integration.hash.slice(0, 8)}` : `${snapshot.integration.branch}@unknown`;
  return `state: schema=1 root=${scalar(snapshot.root)} head=${head} integration=${integration} networkNeeded=${snapshot.integration.networkNeeded ? 1 : 0} tree=${snapshot.treePresent ? "present" : "absent"} anomalies=${anomalies} bytes=${bytes}/${OUTPUT_LIMIT} form=${form}`;
}

function render(snapshot, evaluated, form) {
  const body = renderBody(snapshot, evaluated, form);
  let bytes = 0;
  let output = "";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    output = `${stateLine(snapshot, evaluated, form, bytes)}\n${body.join("\n")}\n`;
    const measured = Buffer.byteLength(output);
    if (measured === bytes) break;
    bytes = measured;
  }
  return { output, bytes: Buffer.byteLength(output) };
}

export async function calculateState(options) {
  const snapshot = await loadSnapshot(options);
  const evaluated = evaluateZones(snapshot);
  let rendered = render(snapshot, evaluated, "full");
  if (rendered.bytes <= OUTPUT_LIMIT) return { ...rendered, status: 0, form: "full", snapshot, evaluated };
  rendered = render(snapshot, evaluated, "compact");
  if (rendered.bytes <= OUTPUT_LIMIT) return { ...rendered, status: 0, form: "compact", snapshot, evaluated };
  const anomalies = evaluated.integrityItems.length + snapshot.product.anomalies.length + snapshot.baseline.anomalies.length;
  const output = `state: schema=1 root=${scalar(snapshot.root)} head=${snapshot.head.slice(0, 8)} integration=${snapshot.integration.branch}@${snapshot.integration.hash?.slice(0, 8) ?? "unknown"} tree=${snapshot.treePresent ? "present" : "absent"} anomalies=${anomalies} bytes=0/${OUTPUT_LIMIT} form=compact emitted=0\nblocked: output budget exceeded; narrow --capability <n>\n`;
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
