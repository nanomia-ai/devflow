#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { TextDecoder } from "node:util";

const MARKERS = new Set(["synthesis", "code", "conjecture", "dispute"]);
const CAPSULE_NAME = /^K-(?<number>(?!000)[0-9]{3})-(?<topic>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const CAPSULE_STEM = /^(?!000)[0-9]{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
// The folder name equals the capability document's filename, which the canon takes from
// product.md unchanged and in the project's own language. Only the number before the first
// `-` is read, so the rest keeps its own bytes and a Korean capability keeps its folder.
const CAPABILITY_NAME = /^(?<number>0*[1-9][0-9]*)-(?<name>.+)$/;
const CAPSULE_BASE = "devflow/project/capabilities";
const PROJECT_BASE = "devflow/project";
const COORDINATE = /^(?<file>[^@:\r\n]+(?:\/[^@:\r\n]+)*?)(?:@(?<revision>[0-9a-f]{7,40}))?:(?<start>[1-9][0-9]*)(?:-(?<end>[1-9][0-9]*))?$/;
const SOFT_LINES = 120;
const HARD_LINES = 240;
const HARD_BYTES = 24 * 1024;
const INDEX_BYTES = 24 * 1024;

class CliError extends Error {
  constructor(message, status = 1) {
    super(message);
    this.status = status;
  }
}

function fail(message, status = 1) {
  throw new CliError(message, status);
}

function byteCompare(left, right) {
  return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function repositoryPath(root, target) {
  return path.relative(root, target).split(path.sep).join("/");
}

function decodeUtf8(bytes, relative) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    fail(`${relative}: file is not valid UTF-8`);
  }
}

function lineCount(text) {
  if (text.length === 0) return 0;
  const normalized = text.replace(/\r\n/g, "\n");
  return normalized.endsWith("\n")
    ? normalized.slice(0, -1).split("\n").length
    : normalized.split("\n").length;
}

function assertRepositoryRelative(raw, label) {
  if (typeof raw !== "string" || raw.length === 0 || raw.includes("\\") || path.posix.isAbsolute(raw)) {
    fail(`${label}: path must be a non-empty repository-relative / path`);
  }
  const parts = raw.split("/");
  if (parts.some((part) => part.length === 0 || part === "." || part === "..")) {
    fail(`${label}: path must not contain empty, . or .. components`);
  }
}

function sourceBytes(root, file, revision, label) {
  assertRepositoryRelative(file, label);
  if (revision) {
    const run = spawnSync("git", ["show", `${revision}:${file}`], {
      cwd: root,
      encoding: "buffer",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (run.status !== 0) fail(`${label}: historical coordinate does not exist (${file}@${revision})`);
    return run.stdout;
  }
  const target = path.resolve(root, ...file.split("/"));
  const relative = path.relative(root, target);
  if (relative === "" || relative === ".." || relative.startsWith(`..${path.sep}`)
      || path.isAbsolute(relative) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    fail(`${label}: coordinate path does not exist (${file})`);
  }
  return fs.readFileSync(target);
}

function validateCoordinate(root, raw, label) {
  const match = COORDINATE.exec(raw);
  if (!match) {
    fail(`${label}: coordinate must be path:line-range or path@revision:line-range (${raw})`);
  }
  const start = Number(match.groups.start);
  const end = Number(match.groups.end ?? match.groups.start);
  if (end < start) fail(`${label}: coordinate range ends before it starts (${raw})`);
  const bytes = sourceBytes(root, match.groups.file, match.groups.revision, label);
  const source = decodeUtf8(bytes, `${label} source`).replace(/\r\n/g, "\n");
  const lines = lineCount(source);
  if (end > lines) fail(`${label}: coordinate exceeds ${lines} source lines (${raw})`);
  const sourceLines = source.endsWith("\n")
    ? source.slice(0, -1).split("\n")
    : source.split("\n");
  return {
    raw,
    file: match.groups.file,
    revision: match.groups.revision ?? null,
    start,
    end,
    content: sourceLines.slice(start - 1, end).join("\n"),
  };
}

function maskMarkdownCode(text) {
  const lines = text.split(/(?<=\n)/);
  let fence = null;
  return lines.map((line) => {
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1][0];
      else if (fence === fenceMatch[1][0]) fence = null;
      return line.replace(/[^\r\n]/g, " ");
    }
    if (fence !== null) return line.replace(/[^\r\n]/g, " ");
    return line.replace(/(`+)([^\r\n]*?)\1/g, (whole) => whole.replace(/[^\r\n]/g, " "));
  }).join("");
}

function closingDelimiter(text, start, opening, closing, label) {
  let depth = 0;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (char === opening) depth += 1;
    if (char === closing) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  fail(`${label}: insertion has no closing ${closing}`);
}

function splitMarkedBody(content, label) {
  const delimiter = /:\s+/.exec(content);
  if (!delimiter) fail(`${label}: insertion requires ": " before its prose`);
  const left = content.slice(0, delimiter.index);
  const prose = content.slice(delimiter.index + delimiter[0].length).trim();
  if (!prose) fail(`${label}: insertion prose must not be empty`);
  return { left, prose };
}

function coordinates(root, raw, expected, label) {
  const values = raw.split(",").map((item) => item.trim()).filter(Boolean);
  if (values.length !== expected) fail(`${label}: expected ${expected} coordinate(s), found ${values.length}`);
  return values.map((item, index) => validateCoordinate(root, item, `${label} coordinate ${index + 1}`));
}

function parseInsertions(text, root, relative) {
  const masked = maskMarkdownCode(text);
  const counts = { synthesis: 0, code: 0, conjecture: 0, dispute: 0 };
  const disputes = [];
  const known = /(\(synthesis|\(code|\(conjecture|\[dispute)/gu;
  let match;
  while ((match = known.exec(masked)) !== null) {
    const opening = match[0][0];
    const closing = opening === "(" ? ")" : "]";
    const end = closingDelimiter(masked, match.index, opening, closing, relative);
    const raw = text.slice(match.index + 1, end);
    const label = `${relative}:${lineCount(text.slice(0, match.index)) + 1}`;
    if (raw.startsWith("synthesis@") || raw.startsWith("code@")) {
      const kind = raw.slice(0, raw.indexOf("@"));
      const marked = splitMarkedBody(raw.slice(kind.length + 1), label);
      const values = marked.left.split(",").map((item) => item.trim()).filter(Boolean);
      if (values.length < 1 || values.length > 2) {
        fail(`${label}: ${kind} requires one or two coordinates`);
      }
      values.forEach((item, index) => validateCoordinate(root, item, `${label} coordinate ${index + 1}`));
      counts[kind] += 1;
    } else if (raw.startsWith("conjecture:")) {
      const prose = raw.slice("conjecture:".length).trim();
      if (!prose) fail(`${label}: conjecture insertion prose must not be empty`);
      counts.conjecture += 1;
    } else if (raw.startsWith("conjecture@")) {
      fail(`${label}: conjecture must not cite a coordinate`);
    } else if (raw.startsWith("dispute ")) {
      const marked = splitMarkedBody(raw.slice("dispute ".length), label);
      const identity = /^(C-(?!000)[0-9]{3})@(.+)$/.exec(marked.left);
      if (!identity) fail(`${label}: dispute requires C-NNN@coordinate,coordinate`);
      const arms = coordinates(root, identity[2], 2, label);
      if (arms[0].raw === arms[1].raw) fail(`${label}: dispute arms must use different coordinates`);
      counts.dispute += 1;
      disputes.push({
        id: identity[1],
        coordinates: arms.map((arm) => arm.raw),
        arms: arms.map((arm) => ({ coordinate: arm.raw, content: arm.content })),
        prose: marked.prose,
      });
    } else {
      fail(`${label}: malformed ${raw.split(/[@:\s]/, 1)[0]} insertion`);
    }
    known.lastIndex = end + 1;
  }

  const markerLike = /([([])([\p{L}][\p{L}\p{N}-]*)(?=@|:|\s+C-[0-9]{3}@)/gu;
  while ((match = markerLike.exec(masked)) !== null) {
    const opening = match[1];
    const head = match[2];
    const validDelimiter = (opening === "(" && head !== "dispute")
      || (opening === "[" && head === "dispute");
    if (!MARKERS.has(head)) {
      const line = lineCount(text.slice(0, match.index)) + 1;
      fail(`${relative}:${line}: unknown insertion head ${head}`);
    }
    if (!validDelimiter) {
      const line = lineCount(text.slice(0, match.index)) + 1;
      fail(`${relative}:${line}: malformed ${head} insertion`);
    }
  }
  return { counts, disputes };
}

function parseSourceBasis(line, root, relative) {
  const prefix = "Source basis: ";
  if (!line.startsWith(prefix)) fail(`${relative}: Source basis must be a JSON string array`);
  let value;
  try {
    value = JSON.parse(line.slice(prefix.length));
  } catch (error) {
    fail(`${relative}: Source basis JSON is invalid (${error.message})`);
  }
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string")) {
    fail(`${relative}: Source basis must be a non-empty JSON coordinate array`);
  }
  value.forEach((item, index) => validateCoordinate(root, item, `${relative}: Source basis ${index + 1}`));
  return value;
}

function validateCurrentBody(lines, root, relative) {
  if (!/^# (?!#)/.test(lines[0] ?? "")) fail(`${relative}: capsule requires one H1 on line one`);
  parseSourceBasis(lines.at(-1) ?? "", root, relative);
}

function parseCapsule(file, root) {
  const relative = repositoryPath(root, file);
  const fileMatch = CAPSULE_NAME.exec(path.basename(file));
  if (!fileMatch) fail(`${relative}: filename must be K-NNN-ascii-topic.md`);
  const owner = capsuleOwner(root, relative);
  const bytes = fs.readFileSync(file);
  const text = decodeUtf8(bytes, relative);
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  const heading = /^# \S(?:.*\S)? · \S(?:.*\S)?$/u.test(lines[0] ?? "") ? lines[0] : null;
  const about = /^about: (\S(?:.*\S)?)$/u.exec(lines[1] ?? "");
  if (heading === null || about === null || lines[2] !== "") {
    fail(`${relative}: capsule header format anomaly`);
  }
  const entry = path.join(root, ...owner.entry.split("/"));
  if (!fs.existsSync(entry) || !fs.statSync(entry).isFile()) {
    fail(`${relative}: sibling capability entrance ${repositoryPath(root, entry)} is missing`);
  }

  validateCurrentBody(lines, root, relative);
  const bodyLines = lines.slice(3);
  const insertions = parseInsertions(bodyLines.join("\n"), root, relative);
  const totalLines = lineCount(text);
  const warnings = [];
  if (totalLines > SOFT_LINES) {
    warnings.push(`${relative}: ${totalLines} lines exceeds the ${SOFT_LINES}-line soft target`);
  }
  return {
    file,
    relative,
    name: path.basename(file),
    number: fileMatch.groups.number,
    bytes,
    text,
    lines: totalLines,
    capability: owner.capability,
    owner: owner.identity,
    topic: fileMatch.groups.topic,
    heading,
    about: about[1],
    insertions,
    warnings,
  };
}

// `--capability` narrows here, before a single capsule is read, so a session that named one
// capability keeps its projection while a capability it never named holds a malformed capsule.
// Argument-less `validate` still walks every folder, and that is where global format defects
// are caught.
function canonicalRelative(raw, label) {
  const relative = raw.replace(/\\/g, "/").replace(/^\.\//, "");
  assertRepositoryRelative(relative, label);
  return relative;
}

function existingFile(root, relative) {
  const target = path.join(root, ...relative.split("/"));
  return fs.existsSync(target) && fs.statSync(target).isFile();
}

function ownerFromNode(root, raw, label = "--under") {
  const relative = canonicalRelative(raw, label);
  if (!existingFile(root, relative)) fail(`owner or node not found: ${relative}`);
  const direct = ["product", "arch", "design"];
  for (const name of direct) {
    if (relative === `${PROJECT_BASE}/${name}.md`) {
      return { identity: relative, entry: relative, directory: `${PROJECT_BASE}/${name}`, capability: null };
    }
  }
  const capability = new RegExp(`^${CAPSULE_BASE}/(?<name>[^/]+)\\.md$`).exec(relative);
  if (capability && CAPABILITY_NAME.test(capability.groups.name)) {
    return {
      identity: `capability:${Number(CAPABILITY_NAME.exec(capability.groups.name).groups.number)}`,
      entry: relative,
      directory: `${CAPSULE_BASE}/${capability.groups.name}`,
      capability: Number(CAPABILITY_NAME.exec(capability.groups.name).groups.number),
    };
  }
  const roots = ["product", "arch", "design"];
  for (const name of roots) {
    const prefix = `${PROJECT_BASE}/${name}/`;
    if (!relative.startsWith(prefix)) continue;
    const parts = relative.slice(prefix.length).split("/");
    if (!CAPSULE_NAME.test(parts.at(-1) ?? "") || !parts.slice(0, -1).every((part) => CAPSULE_STEM.test(part.slice(2)))) break;
    return { identity: `${PROJECT_BASE}/${name}.md`, entry: relative, directory: relative.slice(0, -3), capability: null };
  }
  const capabilityNode = new RegExp(`^${CAPSULE_BASE}/(?<owner>[^/]+)/(?<tail>.+)$`).exec(relative);
  if (capabilityNode && CAPABILITY_NAME.test(capabilityNode.groups.owner)) {
    const parts = capabilityNode.groups.tail.split("/");
    if (CAPSULE_NAME.test(parts.at(-1) ?? "") && parts.slice(0, -1).every((part) => CAPSULE_STEM.test(part.slice(2)))) {
      return {
        identity: `capability:${Number(CAPABILITY_NAME.exec(capabilityNode.groups.owner).groups.number)}`,
        entry: relative,
        directory: relative.slice(0, -3),
        capability: Number(CAPABILITY_NAME.exec(capabilityNode.groups.owner).groups.number),
      };
    }
  }
  fail(`${label}: must name a canonical owner or K-NNN node`);
}

function capsuleOwner(root, relative) {
  const parent = path.posix.dirname(relative);
  const legacy = new RegExp(`^${CAPSULE_BASE}/(?<owner>[^/]+)$`).exec(parent);
  if (legacy && CAPABILITY_NAME.test(legacy.groups.owner)) {
    return {
      identity: `capability:${Number(CAPABILITY_NAME.exec(legacy.groups.owner).groups.number)}`,
      entry: `${CAPSULE_BASE}/${legacy.groups.owner}.md`,
      capability: Number(CAPABILITY_NAME.exec(legacy.groups.owner).groups.number),
    };
  }
  const node = ownerFromNode(root, relative, "capsule");
  if (node.entry !== relative) fail(`${relative}: capsule is not a canonical K-NNN node`);
  const entry = parent === node.directory ? node.entry : `${parent}.md`;
  const owner = ownerFromNode(root, entry, "capsule parent");
  return { identity: owner.identity, entry, capability: owner.capability };
}

function directCapsulePaths(root, directory, { recursive = false } = {}) {
  const target = path.join(root, ...directory.split("/"));
  if (!fs.existsSync(target)) return [];
  if (!fs.statSync(target).isDirectory()) fail(`${directory} is not a directory`);
  const files = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isFile() && CAPSULE_NAME.test(entry.name)) files.push(path.join(target, entry.name));
    if (!entry.isDirectory() || !CAPSULE_STEM.test(entry.name.slice(2))) continue;
    const parent = path.join(target, `${entry.name}.md`);
    if (!fs.existsSync(parent) || !fs.statSync(parent).isFile()) {
      fail(`${repositoryPath(root, path.join(target, entry.name))}: same-stem parent ${repositoryPath(root, parent)} is missing`);
    }
    if (recursive) files.push(...directCapsulePaths(root, repositoryPath(root, path.join(target, entry.name)), { recursive }));
  }
  return files;
}

function ownerDirectories(root, capability) {
  const owners = capability === undefined
    ? ["product", "arch", "design"].map((name) => `${PROJECT_BASE}/${name}`)
    : [];
  const base = path.join(root, ...CAPSULE_BASE.split("/"));
  if (!fs.existsSync(base)) return owners;
  if (!fs.statSync(base).isDirectory()) fail("devflow/project/capabilities is not a directory");
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const match = entry.isDirectory() ? CAPABILITY_NAME.exec(entry.name) : null;
    if (!match || (capability !== undefined && Number(match.groups.number) !== Number(capability))) continue;
    owners.push(`${CAPSULE_BASE}/${entry.name}`);
  }
  return owners;
}

function capsulePaths(root, capability, under) {
  if (under !== undefined) return directCapsulePaths(root, ownerFromNode(root, under).directory);
  const files = ownerDirectories(root, capability).flatMap((directory) => directCapsulePaths(root, directory, { recursive: true }));
  return files.sort((left, right) => byteCompare(repositoryPath(root, left), repositoryPath(root, right)));
}

function requestedCapsulePaths(root, rawPaths) {
  const normalized = rawPaths.map((raw) => raw.replace(/\\/g, "/").replace(/^\.\//, ""));
  if (new Set(normalized).size !== normalized.length) fail("--path must not contain duplicates");
  return normalized.map((relative) => {
    assertRepositoryRelative(relative, "--path");
    const target = path.resolve(root, ...relative.split("/"));
    const fromRoot = path.relative(root, target);
    if (fromRoot === "" || fromRoot === ".." || fromRoot.startsWith(`..${path.sep}`)
        || path.isAbsolute(fromRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      fail(`capsule not found: ${relative}`);
    }
    return target;
  });
}

function loadCapsules(root, rawPaths = [], capability, under) {
  const files = rawPaths.length > 0
    ? requestedCapsulePaths(root, rawPaths)
    : capsulePaths(root, capability, under);
  const capsules = files.map((file) => parseCapsule(file, root));
  const identities = new Map();
  const disputes = new Map();
  for (const capsule of capsules) {
    const identity = `${capsule.owner}:${capsule.number}`;
    if (identities.has(identity)) fail(`duplicate capsule number: ${capsule.relative} and ${identities.get(identity)}`);
    identities.set(identity, capsule.relative);
    for (const dispute of capsule.insertions.disputes) {
      const disputeIdentity = `${capsule.owner}:${dispute.id}`;
      if (disputes.has(disputeIdentity)) {
        fail(`duplicate dispute id ${dispute.id} in capability ${capsule.capability}: ${capsule.relative} and ${disputes.get(disputeIdentity)}`);
      }
      disputes.set(disputeIdentity, capsule.relative);
    }
  }
  return capsules;
}

function parseArguments(argv) {
  if (argv.length === 0) fail("missing subcommand (presence|project|disputes|select|validate)");
  const command = argv[0];
  const options = { root: process.cwd(), paths: [], approved: false };
  for (let index = 1; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--approved") {
      options.approved = true;
      continue;
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) fail(`${flag} requires a value`);
    index += 1;
    switch (flag) {
      case "--root": options.root = value; break;
      case "--path": options.paths.push(value); break;
      case "--capability": options.capability = value; break;
      case "--under": options.under = value; break;
      default: fail(`unknown option ${flag}`);
    }
  }
  options.root = path.resolve(options.root);
  if (!fs.existsSync(options.root) || !fs.statSync(options.root).isDirectory()) {
    fail(`root is not a directory: ${options.root}`);
  }
  if (options.capability !== undefined && !/^0*[1-9][0-9]*$/.test(options.capability)) {
    fail("--capability must be a positive integer");
  }
  if (options.capability !== undefined && options.under !== undefined) {
    fail("--under and --capability are mutually exclusive");
  }
  if (options.under !== undefined && options.paths.length > 0) {
    fail("--under and --path are mutually exclusive");
  }
  return { command, options };
}

function selectedCapsules(capsules, options, { requirePaths = false } = {}) {
  if (requirePaths && options.paths.length === 0) fail("select requires at least one --path");
  let selected = capsules;
  if (options.paths.length > 0) {
    const byPath = new Map(capsules.map((capsule) => [capsule.relative, capsule]));
    selected = options.paths.map((raw) => {
      const normalized = raw.replace(/\\/g, "/").replace(/^\.\//, "");
      if (!byPath.has(normalized)) fail(`capsule not found: ${raw}`);
      return byPath.get(normalized);
    });
  }
  return selected.filter((capsule) => (
    options.capability === undefined || capsule.capability === Number(options.capability)
  ));
}

function printWarnings(capsules) {
  for (const capsule of capsules) {
    for (const warning of capsule.warnings) console.error(`warning: ${warning}`);
  }
}

// The last-changed date is the second clue when choosing among siblings: what changed
// yesterday is likelier to bear on today's work than what changed eight months ago. Git
// already holds it exactly, so no header field is authored and none can drift. One call
// covers every capsule; `git log` is newest-first, so a path's first appearance is its
// last change. This is not a freshness verdict — a document can sit still while the code
// it describes moves, and that case is invisible here.
function lastChangedDates(root, relativePaths) {
  const dates = new Map();
  if (relativePaths.length === 0) return dates;
  const run = spawnSync("git",
    ["log", "--format=%ad", "--date=short", "--name-only", "--", ...relativePaths],
    { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (run.status !== 0 || typeof run.stdout !== "string") return dates;
  let current = null;
  for (const line of run.stdout.split(/\r?\n/)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(line)) { current = line; continue; }
    if (line === "" || current === null) continue;
    if (!dates.has(line)) dates.set(line, current);
  }
  return dates;
}

function projection(capsule, changed) {
  return {
    path: capsule.relative,
    heading: capsule.heading,
    about: capsule.about,
    changed: changed ?? null,
    lines: capsule.lines,
    bytes: capsule.bytes.length,
    markers: capsule.insertions.counts,
    disputes: capsule.insertions.disputes.map((item) => item.id),
  };
}

function compactProjection(entry) {
  return {
    path: entry.path,
    heading: entry.heading,
    changed: entry.changed,
  };
}

function disputeProjection(capsule, dispute) {
  return {
    path: capsule.relative,
    capability: capsule.capability,
    id: dispute.id,
    coordinates: dispute.coordinates,
    arms: dispute.arms,
    prose: dispute.prose,
  };
}

function emitBoundedIndex(command, summary, prefix, values, compactOf) {
  const render = (items) => items.map((value) => `${prefix}: ${JSON.stringify(value)}`);
  const sizeOf = (rendered) => Buffer.byteLength(rendered.length > 0 ? `${rendered.join("\n")}\n` : "");
  let form = "full";
  let lines = render(values);
  let bytes = sizeOf(lines);
  if (bytes > INDEX_BYTES && compactOf) {
    form = "compact";
    lines = render(values.map(compactOf));
    bytes = sizeOf(lines);
  }
  const over = bytes > INDEX_BYTES;
  console.log(`${command}: ${summary} bodies=0 form=${form} index-bytes=${bytes}/${INDEX_BYTES} emitted=${over ? 0 : lines.length}`);
  if (over) {
    console.error(`blocked: index budget exceeded; narrow --path or --capability filters`);
    process.exitCode = 3;
    return;
  }
  for (const line of lines) console.log(line);
}

// `presence` answers one question and opens no body: does any capsule artifact exist under
// devflow/project/capabilities? It reads HEAD as well as the working tree, because a capsule
// committed on the integration branch is real while this checkout has not written it yet, and
// a capsule deleted in the working tree is still reachable in HEAD. It counts a direct child
// *directory* whatever its name — matching the name here is exactly how v0.18.4 reported a
// confident zero over a folder the walk had silently skipped. Every uncertainty answers
// `unknown`, and only `absent` lets a caller leave a section unread.
function git(root, args) {
  const run = spawnSync("git", args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  if (run.error || !Buffer.isBuffer(run.stdout)) return null;
  return { status: run.status, stdout: run.stdout };
}

function workingTreeArtifacts(root) {
  const project = path.join(root, ...PROJECT_BASE.split("/"));
  try {
    if (!fs.existsSync(project)) return "absent";
    if (!fs.statSync(project).isDirectory()) return "unknown";
    for (const name of ["product", "arch", "design"]) {
      const owner = path.join(project, name);
      if (!fs.existsSync(owner)) continue;
      if (fs.lstatSync(owner).isSymbolicLink() || !fs.statSync(owner).isDirectory()) return "unknown";
      return "present";
    }
    const base = path.join(project, "capabilities");
    if (!fs.existsSync(base)) return "absent";
    if (!fs.statSync(base).isDirectory()) return "unknown";
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) return "unknown";
      if (entry.isDirectory()) return "present";
    }
    return "absent";
  } catch {
    return "unknown";
  }
}

function headArtifacts(root) {
  const head = git(root, ["rev-parse", "--verify", "--quiet", "HEAD"]);
  if (head === null) return "unknown";
  if (head.status !== 0) {
    // An unborn HEAD in a real repository proves no capsule was ever committed. Anything that
    // is not a repository at all is uncertainty and reads as such.
    const directory = git(root, ["rev-parse", "--git-dir"]);
    return directory !== null && directory.status === 0 ? "absent" : "unknown";
  }
  // -z keeps the raw bytes of a path: a capability folder carries the project's own language,
  // and git's default quoting would hide it behind escapes.
  const listed = git(root, ["ls-tree", "-r", "--name-only", "-z", "HEAD", "--", PROJECT_BASE]);
  if (listed === null || listed.status !== 0) return "unknown";
  for (const entry of listed.stdout.toString("utf8").split("\0")) {
    if (["product", "arch", "design"].some((name) => entry.startsWith(`${PROJECT_BASE}/${name}/`))) return "present";
    const prefix = `${CAPSULE_BASE}/`;
    if (entry.startsWith(prefix) && entry.slice(prefix.length).includes("/")) return "present";
  }
  return "absent";
}

function presence(options) {
  const worktree = workingTreeArtifacts(options.root);
  const head = headArtifacts(options.root);
  const combined = worktree === "present" || head === "present"
    ? "present"
    : worktree === "unknown" || head === "unknown" ? "unknown" : "absent";
  console.log(`presence: capsuleArtifacts=${combined} head=${head} worktree=${worktree} bodies=0`);
}

function project(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths, options.capability, options.under), options);
  printWarnings(capsules);
  const changed = lastChangedDates(options.root, capsules.map((capsule) => capsule.relative));
  emitBoundedIndex("project", `capsules=${capsules.length}`, "projection",
    capsules.map((capsule) => projection(capsule, changed.get(capsule.relative))), compactProjection);
}

function disputes(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths, options.capability, options.under), options);
  printWarnings(capsules);
  const items = capsules.flatMap((capsule) => (
    capsule.insertions.disputes.map((dispute) => disputeProjection(capsule, dispute))
  ));
  emitBoundedIndex("disputes", `capsules=${capsules.length} items=${items.length}`, "dispute", items);
}

function validate(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths, undefined, options.under), options);
  printWarnings(capsules);
  const markers = capsules.reduce((total, capsule) => (
    total + Object.values(capsule.insertions.counts).reduce((sum, count) => sum + count, 0)
  ), 0);
  const disputes = capsules.reduce((total, capsule) => total + capsule.insertions.disputes.length, 0);
  console.log(`validate: valid=${capsules.length} markers=${markers} disputes=${disputes} warnings=${capsules.flatMap((item) => item.warnings).length}`);
}

function select(options) {
  if (options.under !== undefined) fail("select does not accept --under");
  if (options.paths.length === 0) fail("select requires at least one --path");
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths), options, { requirePaths: true });
  printWarnings(capsules);
  const lines = capsules.reduce((total, capsule) => total + capsule.lines, 0);
  const bytes = capsules.reduce((total, capsule) => total + capsule.bytes.length, 0);
  const over = lines > HARD_LINES || bytes > HARD_BYTES;
  const opened = over && !options.approved ? 0 : capsules.length;
  console.log(`select: candidates=${capsules.length} opened=${opened} lines=${lines}/${HARD_LINES} bytes=${bytes}/${HARD_BYTES} approved=${options.approved ? 1 : 0}`);
  const changed = lastChangedDates(options.root, capsules.map((capsule) => capsule.relative));
  for (const capsule of capsules) {
    console.log(`candidate: ${JSON.stringify(projection(capsule, changed.get(capsule.relative)))}`);
  }
  if (over && !options.approved) {
    console.error("blocked: opening budget exceeded; narrow --path choices or repeat with explicit --approved");
    process.exitCode = 3;
    return;
  }
  if (over) console.error("warning: opening budget exceeded with explicit approval");
  for (const capsule of capsules) {
    console.log(`body: ${capsule.relative}`);
    process.stdout.write(capsule.text.endsWith("\n") ? capsule.text : `${capsule.text}\n`);
    console.log(`end: ${capsule.relative}`);
  }
}

function main() {
  const { command, options } = parseArguments(process.argv.slice(2));
  switch (command) {
    case "presence": presence(options); break;
    case "project": project(options); break;
    case "disputes": disputes(options); break;
    case "select": select(options); break;
    case "validate": validate(options); break;
    default: fail(`unknown subcommand ${command}`);
  }
}

try {
  main();
} catch (error) {
  if (error instanceof CliError) {
    console.error(`error: ${error.message}`);
    process.exitCode = error.status;
  } else {
    throw error;
  }
}
