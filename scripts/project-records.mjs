#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const HEADER_KEYS = [
  "v",
  "kind",
  "during",
  "affects",
  "scope",
  "mode",
  "evidence",
  "checked-at",
  "review-after",
  "supersedes",
];
const DURING = new Set(["product", "arch", "design", "adopt", "split", "work"]);
const AFFECTS = new Set([
  "product:Identity",
  "product:Approach",
  "product:Capabilities",
  "product:Boundary",
  "product:Success-criteria",
  "arch:Components",
  "arch:Stack",
  "arch:Code-structure",
  "arch:Data",
  "arch:Verify-channel",
  "design:Approach",
  "design:Design-source",
  "design:Token-strategy",
  "design:Component-strategy",
  "design:Decomposition-axis",
  "design:Review-surface",
]);
const RECORD_NAME = /^(?<prefix>[DE])-(?<date>[0-9]{8})-(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-(?<oid>[0-9a-f]{40})\.md$/;
const EVIDENCE_NAME = /^E-[0-9]{8}-[a-z0-9]+(?:-[a-z0-9]+)*-[0-9a-f]{40}\.md$/;
const CAPABILITY_AFFECT = /^capability:(?<number>[1-9][0-9]*)$/;
const ISO_DATE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const MAX_BODY_BYTES = 8 * 1024;
const MAX_BODY_LINES = 15;
const EVIDENCE_SECTION = /^(?:#{1,6}\s+)?(?<name>Reproduce|Invalidates-when)(?:\s*:\s*(?<inline>.*))?\s*$/;

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

function lfNormalizedBytes(bytes) {
  return Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
}

function gitBlobOid(bytes) {
  const normalized = lfNormalizedBytes(bytes);
  return crypto
    .createHash("sha1")
    .update(Buffer.from(`blob ${normalized.length}\0`, "utf8"))
    .update(normalized)
    .digest("hex");
}

function isRealIsoDate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isRealCompactDate(value) {
  if (typeof value !== "string" || !/^[0-9]{8}$/.test(value)) return false;
  return isRealIsoDate(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`);
}

function uniqueStrings(value, field, { allowEmpty = true } = {}) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(`${field} must be an array of strings`);
  }
  if (!allowEmpty && value.length === 0) fail(`${field} must not be empty`);
  if (new Set(value).size !== value.length) fail(`${field} must not contain duplicates`);
}

function productCapabilityNumbers(root) {
  const product = path.join(root, "devflow", "project", "product.md");
  if (!fs.existsSync(product)) return null;
  const lines = fs.readFileSync(product, "utf8").split(/\r?\n/);
  const start = lines.findIndex((line) => /^## (?:Capabilities|능력)\s*$/.test(line));
  if (start < 0) return null;
  const circled = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
  const numbers = new Set();
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const circleIndex = circled.indexOf(line.trimStart()[0]);
    if (circleIndex >= 0) {
      numbers.add(String(circleIndex + 1));
      continue;
    }
    const match = /^\s*(?:[-*]\s*)?(?<number>[1-9][0-9]*)[.)\s]/.exec(line);
    if (match) numbers.add(String(Number(match.groups.number)));
  }
  return numbers.size > 0 ? numbers : null;
}

function recordDirectories(root) {
  return [
    path.join(root, "devflow", "project", "decisions"),
    path.join(root, "devflow", "project", "evidence"),
  ];
}

function recordPaths(root) {
  const files = [];
  for (const directory of recordDirectories(root)) {
    if (!fs.existsSync(directory)) continue;
    const stat = fs.statSync(directory);
    if (!stat.isDirectory()) fail(`${path.relative(root, directory)} is not a directory`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".md")) files.push(path.join(directory, entry.name));
    }
  }
  return files.sort((left, right) => byteCompare(path.basename(left), path.basename(right)));
}

function newestRecordFirst(left, right) {
  const leftDate = RECORD_NAME.exec(left.name).groups.date;
  const rightDate = RECORD_NAME.exec(right.name).groups.date;
  return byteCompare(rightDate, leftDate) || byteCompare(left.name, right.name);
}

function evidenceSections(body, relative) {
  const lines = body.split(/\r?\n/);
  const sections = new Map();
  for (let index = 0; index < lines.length; index += 1) {
    const match = EVIDENCE_SECTION.exec(lines[index]);
    if (!match) continue;
    if (sections.has(match.groups.name)) {
      fail(`${relative}: evidence body must contain exactly one ${match.groups.name} section`);
    }
    sections.set(match.groups.name, { index, inline: match.groups.inline ?? "" });
  }

  for (const name of ["Reproduce", "Invalidates-when"]) {
    if (!sections.has(name)) fail(`${relative}: evidence body requires the ${name} section`);
  }
  const reproduce = sections.get("Reproduce");
  const invalidates = sections.get("Invalidates-when");
  if (reproduce.index >= invalidates.index) {
    fail(`${relative}: Reproduce must appear before Invalidates-when`);
  }

  function content(section, end) {
    return [section.inline, ...lines.slice(section.index + 1, end)]
      .filter((line) => !/^```/.test(line.trim()))
      .join("\n")
      .trim();
  }
  const reproduceContent = content(reproduce, invalidates.index);
  const invalidatesContent = content(invalidates, lines.length);
  if (reproduceContent.length === 0) fail(`${relative}: Reproduce section must not be empty`);
  if (invalidatesContent.length === 0) fail(`${relative}: Invalidates-when section must not be empty`);
  return { reproduce: reproduceContent, invalidatesWhen: invalidatesContent };
}

function reproducePathCandidates(text) {
  const quoted = [...text.matchAll(/`([^`\r\n]+)`|"([^"\r\n]+)"|'([^'\r\n]+)'/g)]
    .map((match) => match[1] ?? match[2] ?? match[3]);
  const tokens = text
    .replace(/[`"'()[\]{},;<>]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return [...quoted, ...tokens];
}

function existingReproducePaths(root, text) {
  const found = new Set();
  for (const raw of reproducePathCandidates(text)) {
    const candidate = raw
      .replace(/^[>$]+/, "")
      .replace(/#L[0-9]+(?:-L[0-9]+)?$/, "")
      .replace(/:[0-9]+(?::[0-9]+)?$/, "")
      .replace(/[.:]+$/, "");
    if (candidate.length === 0
        || candidate === "."
        || candidate === ".."
        || candidate.startsWith("-")
        || /^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)
        || /[*?\[\]]/.test(candidate)
        || path.isAbsolute(candidate)) {
      continue;
    }
    const resolved = path.resolve(root, candidate);
    const relative = path.relative(root, resolved);
    if (relative.length === 0 || relative === ".." || relative.startsWith(`..${path.sep}`)
        || path.isAbsolute(relative)) {
      continue;
    }
    if (fs.existsSync(resolved)) found.add(relative.split(path.sep).join("/"));
  }
  return [...found].sort(byteCompare);
}

function parseRecord(file, root, knownCapabilities) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const bytes = fs.readFileSync(file);
  const text = bytes.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(bytes)) fail(`${relative}: file is not valid UTF-8`);

  const newline = bytes.indexOf(0x0a);
  const headerBytes = newline < 0 ? bytes : bytes.subarray(0, newline);
  const bodyBytes = newline < 0 ? Buffer.alloc(0) : bytes.subarray(newline + 1);
  const headerLine = headerBytes.toString("utf8").replace(/\r$/, "");
  if (!headerLine.startsWith("record: ")) fail(`${relative}: first line must start with "record: "`);

  let header;
  try {
    header = JSON.parse(headerLine.slice("record: ".length));
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
  if (headerLine !== `record: ${JSON.stringify(header)}`) {
    fail(`${relative}: header JSON must be compact and canonical`);
  }

  const name = path.basename(file);
  const nameMatch = RECORD_NAME.exec(name);
  if (!nameMatch) fail(`${relative}: filename does not match D/E-YYYYMMDD-slug-fulloid.md`);
  if (!isRealCompactDate(nameMatch.groups.date)) fail(`${relative}: filename date is not real`);
  const expectedKind = nameMatch.groups.prefix === "D" ? "decision" : "evidence";
  if (header.v !== 1) fail(`${relative}: v must be 1`);
  if (header.kind !== expectedKind) fail(`${relative}: kind does not match the filename prefix`);
  if (!DURING.has(header.during)) fail(`${relative}: invalid during literal ${JSON.stringify(header.during)}`);

  uniqueStrings(header.affects, "affects", { allowEmpty: false });
  for (const token of header.affects) {
    const capability = CAPABILITY_AFFECT.exec(token);
    if (!AFFECTS.has(token) && !capability) fail(`${relative}: invalid affects literal ${JSON.stringify(token)}`);
    if (capability && knownCapabilities && !knownCapabilities.has(String(Number(capability.groups.number)))) {
      fail(`${relative}: affects names capability ${capability.groups.number}, absent from product.md`);
    }
  }

  if (!new Set(["project", "foundation", "capability"]).has(header.scope)) {
    fail(`${relative}: scope must be project, foundation, or capability`);
  }
  const affectedCapabilities = header.affects
    .map((token) => CAPABILITY_AFFECT.exec(token)?.groups.number)
    .filter(Boolean)
    .map((number) => String(Number(number)));
  if ((header.scope === "project" || header.scope === "foundation")
      && affectedCapabilities.length !== 0) {
    fail(`${relative}: ${header.scope} scope must not include capability affects tokens`);
  }
  if (header.scope === "capability") {
    if (affectedCapabilities.length < 1 || affectedCapabilities.length > 5) {
      fail(`${relative}: capability scope requires one to five capability:<integer> affects tokens`);
    }
    if (!knownCapabilities) {
      fail(`${relative}: capability scope is invalid before product.md fixes capability numbers`);
    }
    for (const number of affectedCapabilities) {
      if (!knownCapabilities.has(number)) {
        fail(`${relative}: capability ${number} is absent from product.md`);
      }
    }
  }

  uniqueStrings(header.evidence, "evidence");
  if (header.evidence.some((item) => !EVIDENCE_NAME.test(item))) {
    fail(`${relative}: evidence entries must be exact E basenames`);
  }
  uniqueStrings(header.supersedes, "supersedes");
  const ownPrefix = expectedKind === "decision" ? "D" : "E";
  if (header.supersedes.some((item) => RECORD_NAME.exec(item)?.groups.prefix !== ownPrefix)) {
    fail(`${relative}: supersedes entries must be exact same-kind basenames`);
  }
  if (header.supersedes.includes(name)) fail(`${relative}: a record cannot supersede itself`);

  if (expectedKind === "decision") {
    if (header.mode !== null || header["checked-at"] !== null || header["review-after"] !== null) {
      fail(`${relative}: decisions require null mode, checked-at, and review-after`);
    }
  } else {
    if (!new Set(["reported", "reproducible"]).has(header.mode)) {
      fail(`${relative}: evidence mode must be reported or reproducible`);
    }
    if (header.evidence.length !== 0) fail(`${relative}: evidence records require evidence:[]`);
    for (const field of ["checked-at", "review-after"]) {
      if (header[field] !== null && !isRealIsoDate(header[field])) {
        fail(`${relative}: ${field} must be null or an exact ISO date`);
      }
    }
  }

  const actualOid = gitBlobOid(bytes);
  if (actualOid !== nameMatch.groups.oid) {
    fail(`${relative}: oid mismatch (filename ${nameMatch.groups.oid}, content ${actualOid})`);
  }
  if (bodyBytes.length > MAX_BODY_BYTES) {
    fail(`${relative}: body is ${bodyBytes.length} bytes; hard limit is ${MAX_BODY_BYTES}`);
  }
  const body = bodyBytes.toString("utf8");
  const bodyLines = body.length === 0 ? 0 : body.replace(/\r?\n$/, "").split(/\r?\n/).length;
  if (bodyLines > MAX_BODY_LINES) {
    fail(`${relative}: body has ${bodyLines} lines; hard limit is ${MAX_BODY_LINES}`);
  }
  if (expectedKind === "evidence") {
    const sections = evidenceSections(body, relative);
    if (header.mode === "reproducible") {
      const paths = existingReproducePaths(root, sections.reproduce);
      if (paths.length === 0) {
        fail(`${relative}: reproducible Reproduce must name an existing repository path`);
      }
    }
  }

  return { file, relative, name, bytes, body, bodyLines, header, warnings: [] };
}

function detectSupersedesCycles(recordsByName) {
  const visiting = new Set();
  const visited = new Set();
  function visit(name) {
    if (visiting.has(name)) fail(`supersedes cycle includes ${name}`);
    if (visited.has(name)) return;
    visiting.add(name);
    const record = recordsByName.get(name);
    if (record) {
      for (const target of record.header.supersedes) {
        if (recordsByName.has(target)) visit(target);
      }
    }
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of recordsByName.keys()) visit(name);
}

function loadRecords(root) {
  const knownCapabilities = productCapabilityNumbers(root);
  const records = recordPaths(root).map((file) => parseRecord(file, root, knownCapabilities));
  const byName = new Map();
  for (const record of records) {
    if (byName.has(record.name)) fail(`duplicate record basename: ${record.name}`);
    byName.set(record.name, record);
  }
  detectSupersedesCycles(byName);
  const superseded = new Set(records.flatMap((record) => record.header.supersedes));
  const current = records.filter((record) => !superseded.has(record.name));
  for (const record of current.filter((item) => item.header.kind === "decision")) {
    for (const evidence of record.header.evidence) {
      if (!byName.has(evidence)) fail(`${record.relative}: current decision cites missing evidence ${evidence}`);
    }
  }
  return {
    records,
    byName,
    superseded,
    current,
    warnings: records.flatMap((record) => record.warnings),
  };
}

function parseArguments(argv) {
  if (argv.length === 0) fail("missing subcommand (summary|select|reverse-evidence|prune-check|validate)");
  const command = argv[0];
  const options = { root: process.cwd(), affects: [], choose: [], approved: false };
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
      case "--affects": options.affects.push(value); break;
      case "--scope": options.scope = value; break;
      case "--kind": options.kind = value; break;
      case "--name": options.name = value; break;
      case "--path": options.path = value; break;
      case "--choose": options.choose.push(...value.split(",").filter(Boolean)); break;
      default: fail(`unknown option ${flag}`);
    }
  }
  options.root = path.resolve(options.root);
  if (!fs.existsSync(options.root) || !fs.statSync(options.root).isDirectory()) {
    fail(`root is not a directory: ${options.root}`);
  }
  return { command, options };
}

function printWarnings(warnings) {
  for (const warning of warnings) console.error(`warning: ${warning}`);
}

function summary(options) {
  const loaded = loadRecords(options.root);
  printWarnings(loaded.warnings);
  const decisions = loaded.current.filter((record) => record.header.kind === "decision").length;
  const evidence = loaded.current.length - decisions;
  const today = new Date().toISOString().slice(0, 10);
  const reviewDue = loaded.current.filter((record) => (
    record.header.kind === "evidence"
      && record.header["review-after"] !== null
      && record.header["review-after"] <= today
  )).length;
  console.log(`summary: valid=${loaded.records.length} current=${loaded.current.length}`
    + ` decisions=${decisions} evidence=${evidence} superseded=${loaded.records.length - loaded.current.length}`
    + ` review-due=${reviewDue}`);
}

function assertQueryAffects(tokens) {
  for (const token of tokens) {
    if (!AFFECTS.has(token) && !CAPABILITY_AFFECT.test(token)) {
      fail(`invalid --affects literal ${JSON.stringify(token)}`);
    }
  }
}

function select(options) {
  assertQueryAffects(options.affects);
  if (options.kind !== undefined && !new Set(["decision", "evidence"]).has(options.kind)) {
    fail("--kind must be decision or evidence");
  }
  if (options.scope !== undefined && !new Set(["project", "foundation", "capability"]).has(options.scope)) {
    fail("--scope must be project, foundation, or capability");
  }
  if (options.choose.length > 3) fail("--choose accepts at most three exact basenames");

  const loaded = loadRecords(options.root);
  printWarnings(loaded.warnings);
  const matches = loaded.current.filter((record) => (
    (options.affects.length === 0
      || options.affects.some((token) => record.header.affects.includes(token)))
    && (options.scope === undefined || record.header.scope === options.scope)
    && (options.kind === undefined || record.header.kind === options.kind)
  )).sort(newestRecordFirst);
  const today = new Date().toISOString().slice(0, 10);
  const reviewDue = matches.filter((record) => (
    record.header.kind === "evidence"
      && record.header["review-after"] !== null
      && record.header["review-after"] <= today
  ));
  let opened = [];
  if (matches.length <= 3) {
    opened = matches;
  } else if (options.choose.length > 0) {
    const matchByName = new Map(matches.map((record) => [record.name, record]));
    for (const name of options.choose) {
      if (!matchByName.has(name)) fail(`--choose is not a current query candidate: ${name}`);
    }
    opened = options.choose.map((name) => matchByName.get(name));
  } else if (options.approved) {
    opened = matches.slice(0, 3);
  }

  const openedReviewDue = opened.filter((record) => reviewDue.includes(record));
  const canBind = (matches.length <= 3 || options.choose.length > 0 || options.approved)
    && openedReviewDue.length === 0;
  console.log(`summary: matched=${matches.length} opened=${opened.length} bind=${canBind ? 1 : 0}`
    + ` review-due=${reviewDue.length}`);
  for (const record of matches) console.log(`candidate: ${record.name}`);
  for (const record of reviewDue) {
    console.log(`review-due: ${record.name} review-after=${record.header["review-after"]}`);
  }
  for (const record of opened) {
    console.log(`body: ${record.name}`);
    if (record.body.length > 0) process.stdout.write(record.body.endsWith("\n") ? record.body : `${record.body}\n`);
    console.log(`end: ${record.name}`);
  }
  if (matches.length > 3 && opened.length === 0) {
    console.error("blocked: q>3; narrow the query, pass --choose with at most three candidates, or pass --approved");
    process.exitCode = 3;
  } else if (openedReviewDue.length > 0) {
    console.error("blocked: selected evidence reached review-after; revalidate it before binding");
    process.exitCode = 5;
  }
}

function reverseEvidence(options) {
  if (!options.name || !EVIDENCE_NAME.test(options.name)) {
    fail("reverse-evidence requires --name with an exact E basename");
  }
  const loaded = loadRecords(options.root);
  printWarnings(loaded.warnings);
  const decisions = loaded.current.filter((record) => (
    record.header.kind === "decision" && record.header.evidence.includes(options.name)
  ));
  console.log(`reverse-evidence: name=${options.name} current-decisions=${decisions.length}`);
  for (const record of decisions) console.log(`decision: ${record.name}`);
}

function nonRecordReferences(root, targetName) {
  const devflow = path.join(root, "devflow");
  if (!fs.existsSync(devflow) || !fs.statSync(devflow).isDirectory()) return [];
  const excluded = new Set(recordDirectories(root).map((item) => path.resolve(item)));
  const references = [];
  function walk(directory) {
    if (excluded.has(path.resolve(directory))) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile() && fs.readFileSync(target).includes(Buffer.from(targetName, "utf8"))) {
        references.push(path.relative(root, target).split(path.sep).join("/"));
      }
    }
  }
  walk(devflow);
  return references;
}

function pruneCheck(options) {
  if (!options.path) fail("prune-check requires --path");
  const loaded = loadRecords(options.root);
  printWarnings(loaded.warnings);
  const requested = path.basename(options.path);
  const target = loaded.byName.get(requested);
  if (!target) fail(`record not found: ${options.path}`);
  if (options.path.includes("/") || options.path.includes("\\")) {
    const resolved = path.resolve(options.root, options.path);
    if (resolved !== path.resolve(target.file)) fail(`path does not resolve to record ${requested}`);
  }

  const references = [];
  for (const record of loaded.current) {
    if (record.name === requested) continue;
    if (record.header.evidence.includes(requested) || record.body.includes(requested)) {
      references.push(record.relative);
    }
  }
  references.push(...nonRecordReferences(options.root, requested));
  const uniqueReferences = [...new Set(references)].sort(byteCompare);
  const isSuperseded = loaded.superseded.has(requested);
  const safe = isSuperseded && uniqueReferences.length === 0;
  console.log(`prune-check: ${safe ? "safe" : "unsafe"} path=${target.relative}`
    + ` superseded=${isSuperseded ? "yes" : "no"} current-references=${uniqueReferences.length}`);
  for (const reference of uniqueReferences) console.log(`reference: ${reference}`);
  if (!safe) process.exitCode = 4;
}

function validate(options) {
  const loaded = loadRecords(options.root);
  printWarnings(loaded.warnings);
  if (options.path) {
    const requested = path.basename(options.path);
    if (!loaded.byName.has(requested)) fail(`record not found: ${options.path}`);
    console.log(`validate: valid=1 warnings=${loaded.byName.get(requested).warnings.length}`);
    return;
  }
  console.log(`validate: valid=${loaded.records.length} warnings=${loaded.warnings.length}`);
}

function main() {
  const { command, options } = parseArguments(process.argv.slice(2));
  switch (command) {
    case "summary": summary(options); break;
    case "select": select(options); break;
    case "reverse-evidence": reverseEvidence(options); break;
    case "prune-check": pruneCheck(options); break;
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
