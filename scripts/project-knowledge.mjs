#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { TextDecoder } from "node:util";

const HEADER_KEYS = ["v", "capability", "facet", "topic", "use-when", "state", "synopsis"];
const STATES = new Set(["current", "retired"]);
const MARKERS = new Set(["synthesis", "code", "conjecture", "dispute"]);
const CAPSULE_NAME = /^K-(?<number>(?!000)[0-9]{3})-(?<topic>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const CAPABILITY_NAME = /^(?<number>0*[1-9][0-9]*)-(?<name>[a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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
  const first = lines.findIndex((line) => line.trim().length > 0);
  if (first < 0 || !/^# (?!#)/.test(lines[first])) fail(`${relative}: current capsule requires one H1`);
  const positions = [
    lines.findIndex((line) => line.startsWith("Intent: ")),
    lines.findIndex((line) => line.startsWith("Desired outcome: ")),
    lines.indexOf("## Grounded state"),
    lines.indexOf("## Revisit when"),
    lines.findIndex((line) => line.startsWith("Source basis: ")),
  ];
  if (positions.some((position) => position < 0)) {
    fail(`${relative}: current capsule requires Intent, Desired outcome, Grounded state, Revisit when, and Source basis`);
  }
  if (positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    fail(`${relative}: capsule sections are out of order`);
  }
  parseSourceBasis(lines[positions[4]], root, relative);
}

function validateRetiredBody(lines, relative) {
  const present = lines.filter((line) => line.trim().length > 0);
  if (present.length === 0 || !/^# (?!#)/.test(present[0])) fail(`${relative}: retired capsule requires one H1`);
  if (lines.length > 5) fail(`${relative}: retired tombstone has ${lines.length} body lines; hard limit is 5`);
}

function parseCapsule(file, root) {
  const relative = repositoryPath(root, file);
  const bytes = fs.readFileSync(file);
  const text = decodeUtf8(bytes, relative);
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  if (!lines[0]?.startsWith("knowledge: ")) fail(`${relative}: first line must start with "knowledge: "`);
  let header;
  try {
    header = JSON.parse(lines[0].slice("knowledge: ".length));
  } catch (error) {
    fail(`${relative}: first-line JSON is invalid (${error.message})`);
  }
  if (!header || Array.isArray(header) || typeof header !== "object") {
    fail(`${relative}: first-line JSON must be an object`);
  }
  const keys = Object.keys(header);
  if (keys.length !== HEADER_KEYS.length || keys.some((key, index) => key !== HEADER_KEYS[index])) {
    fail(`${relative}: header keys must be exactly ${HEADER_KEYS.join(",")} in that order`);
  }
  if (lines[0] !== `knowledge: ${JSON.stringify(header)}`) {
    fail(`${relative}: header JSON must be compact and canonical`);
  }
  if (header.v !== 1) fail(`${relative}: v must be 1`);
  if (!Number.isInteger(header.capability) || header.capability < 1) {
    fail(`${relative}: capability must be a positive integer`);
  }
  if (typeof header.facet !== "string" || !SLUG.test(header.facet)) fail(`${relative}: facet must be an ASCII slug`);
  if (typeof header.topic !== "string" || !SLUG.test(header.topic)) fail(`${relative}: topic must be an ASCII slug`);
  for (const key of ["use-when", "synopsis"]) {
    if (typeof header[key] !== "string" || header[key].trim().length === 0 || /[\r\n]/.test(header[key])) {
      fail(`${relative}: ${key} must be a non-empty one-line string`);
    }
  }
  if (!STATES.has(header.state)) fail(`${relative}: state must be current or retired`);

  const directoryMatch = CAPABILITY_NAME.exec(path.basename(path.dirname(file)));
  const fileMatch = CAPSULE_NAME.exec(path.basename(file));
  if (!directoryMatch) fail(`${relative}: capsule parent must be NN-ascii-name`);
  if (!fileMatch) fail(`${relative}: filename must be K-NNN-ascii-topic.md`);
  if (Number(directoryMatch.groups.number) !== header.capability) {
    fail(`${relative}: header capability does not match its parent directory`);
  }
  if (fileMatch.groups.topic !== header.topic) fail(`${relative}: header topic does not match its filename`);
  const entry = path.join(path.dirname(path.dirname(file)), `${path.basename(path.dirname(file))}.md`);
  if (!fs.existsSync(entry) || !fs.statSync(entry).isFile()) {
    fail(`${relative}: sibling capability entrance ${repositoryPath(root, entry)} is missing`);
  }

  const bodyLines = lines.slice(1);
  if (header.state === "current") validateCurrentBody(bodyLines, root, relative);
  else validateRetiredBody(bodyLines, relative);
  const insertions = parseInsertions(bodyLines.join("\n"), root, relative);
  const totalLines = lineCount(text);
  const warnings = [];
  if (header.state === "current" && totalLines > SOFT_LINES) {
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
    header,
    insertions,
    warnings,
  };
}

function capsulePaths(root) {
  const base = path.join(root, "devflow", "project", "capabilities");
  if (!fs.existsSync(base)) return [];
  if (!fs.statSync(base).isDirectory()) fail("devflow/project/capabilities is not a directory");
  const files = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory() || !CAPABILITY_NAME.test(entry.name)) continue;
    const directory = path.join(base, entry.name);
    for (const child of fs.readdirSync(directory, { withFileTypes: true })) {
      if (child.isFile() && child.name.startsWith("K-") && child.name.endsWith(".md")) {
        files.push(path.join(directory, child.name));
      }
    }
  }
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

function loadCapsules(root, rawPaths = []) {
  const files = rawPaths.length > 0
    ? requestedCapsulePaths(root, rawPaths)
    : capsulePaths(root);
  const capsules = files.map((file) => parseCapsule(file, root));
  const identities = new Map();
  const disputes = new Map();
  for (const capsule of capsules) {
    const identity = `${capsule.header.capability}:${capsule.number}`;
    if (identities.has(identity)) fail(`duplicate capsule number: ${capsule.relative} and ${identities.get(identity)}`);
    identities.set(identity, capsule.relative);
    for (const dispute of capsule.insertions.disputes) {
      const disputeIdentity = `${capsule.header.capability}:${dispute.id}`;
      if (disputes.has(disputeIdentity)) {
        fail(`duplicate dispute id ${dispute.id} in capability ${capsule.header.capability}: ${capsule.relative} and ${disputes.get(disputeIdentity)}`);
      }
      disputes.set(disputeIdentity, capsule.relative);
    }
  }
  return capsules;
}

function parseArguments(argv) {
  if (argv.length === 0) fail("missing subcommand (project|disputes|select|validate)");
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
      case "--facet": options.facet = value; break;
      case "--state": options.state = value; break;
      default: fail(`unknown option ${flag}`);
    }
  }
  options.root = path.resolve(options.root);
  if (!fs.existsSync(options.root) || !fs.statSync(options.root).isDirectory()) {
    fail(`root is not a directory: ${options.root}`);
  }
  if (options.capability !== undefined && !/^[1-9][0-9]*$/.test(options.capability)) {
    fail("--capability must be a positive integer");
  }
  if (options.facet !== undefined && !SLUG.test(options.facet)) fail("--facet must be an ASCII slug");
  if (options.state !== undefined && !STATES.has(options.state)) fail("--state must be current or retired");
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
    (options.capability === undefined || capsule.header.capability === Number(options.capability))
    && (options.facet === undefined || capsule.header.facet === options.facet)
    && (options.state === undefined || capsule.header.state === options.state)
  ));
}

function printWarnings(capsules) {
  for (const capsule of capsules) {
    for (const warning of capsule.warnings) console.error(`warning: ${warning}`);
  }
}

function projection(capsule) {
  return {
    path: capsule.relative,
    capability: capsule.header.capability,
    facet: capsule.header.facet,
    topic: capsule.header.topic,
    "use-when": capsule.header["use-when"],
    state: capsule.header.state,
    synopsis: capsule.header.synopsis,
    lines: capsule.lines,
    bytes: capsule.bytes.length,
    markers: capsule.insertions.counts,
    disputes: capsule.insertions.disputes.map((item) => item.id),
  };
}

function compactProjection(entry) {
  return {
    path: entry.path,
    facet: entry.facet,
    topic: entry.topic,
    "use-when": entry["use-when"],
    state: entry.state,
  };
}

function disputeProjection(capsule, dispute) {
  return {
    path: capsule.relative,
    capability: capsule.header.capability,
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
    // A capability large enough to overflow the full index still has to be selectable, so drop
    // the fields a chooser never reads and keep the path and use-when it picks by.
    form = "compact";
    lines = render(values.map(compactOf));
    bytes = sizeOf(lines);
  }
  const over = bytes > INDEX_BYTES;
  console.log(`${command}: ${summary} bodies=0 form=${form} index-bytes=${bytes}/${INDEX_BYTES} emitted=${over ? 0 : lines.length}`);
  if (over) {
    console.error(`blocked: index budget exceeded; narrow --path, --capability, --facet, or --state filters`);
    process.exitCode = 3;
    return;
  }
  for (const line of lines) console.log(line);
}

function project(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths), options);
  printWarnings(capsules);
  emitBoundedIndex("project", `capsules=${capsules.length}`, "projection",
    capsules.map(projection), compactProjection);
}

function disputes(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths), options);
  printWarnings(capsules);
  const items = capsules.flatMap((capsule) => (
    capsule.insertions.disputes.map((dispute) => disputeProjection(capsule, dispute))
  ));
  emitBoundedIndex("disputes", `capsules=${capsules.length} items=${items.length}`, "dispute", items);
}

function validate(options) {
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths), options);
  printWarnings(capsules);
  const markers = capsules.reduce((total, capsule) => (
    total + Object.values(capsule.insertions.counts).reduce((sum, count) => sum + count, 0)
  ), 0);
  const disputes = capsules.reduce((total, capsule) => total + capsule.insertions.disputes.length, 0);
  console.log(`validate: valid=${capsules.length} markers=${markers} disputes=${disputes} warnings=${capsules.flatMap((item) => item.warnings).length}`);
}

function select(options) {
  if (options.paths.length === 0) fail("select requires at least one --path");
  const capsules = selectedCapsules(loadCapsules(options.root, options.paths), options, { requirePaths: true });
  printWarnings(capsules);
  const lines = capsules.reduce((total, capsule) => total + capsule.lines, 0);
  const bytes = capsules.reduce((total, capsule) => total + capsule.bytes.length, 0);
  const over = lines > HARD_LINES || bytes > HARD_BYTES;
  const opened = over && !options.approved ? 0 : capsules.length;
  console.log(`select: candidates=${capsules.length} opened=${opened} lines=${lines}/${HARD_LINES} bytes=${bytes}/${HARD_BYTES} approved=${options.approved ? 1 : 0}`);
  for (const capsule of capsules) console.log(`candidate: ${JSON.stringify(projection(capsule))}`);
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
