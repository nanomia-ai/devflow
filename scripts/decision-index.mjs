#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const OUTPUT_ADVISORY = 24 * 1024;
const KO_ACTIVE = "\uC720\uD6A8";
const KO_REPLACED = "\uB300\uCCB4\uB428";
const KO_PARTLY_CORRECTED = "\uC77C\uBD80 \uC815\uC815";
const STATE_RE = new RegExp(`^(?:active|replaced by DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\)|active, partly corrected by DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\)(?:, DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\))*|${KO_ACTIVE}|${KO_REPLACED} → DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\)|${KO_ACTIVE} · ${KO_PARTLY_CORRECTED} → DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\)(?:, DD-\\d+ \\(v\\d+\\.\\d+\\.\\d+\\))*)$`);
const METADATA_RE = new RegExp(`^(?:Subject|\\uC8FC\\uC81C): (.+) \\| (?:Introduced|\\uB3C4\\uC785): (.+) \\| (?:State|\\uC0C1\\uD0DC): (.+)$`);

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  let lang = "en";
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag !== "--lang") fail(`unknown option ${flag}`);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) fail("--lang requires en or ko");
    if (!['en', 'ko'].includes(value)) fail("--lang must be en or ko");
    lang = value;
    index += 1;
  }
  return { lang };
}

function parseSource(relative) {
  const text = fs.readFileSync(relative, "utf8");
  const lines = text.split(/\r?\n/);
  const decisions = [];
  const seen = new Set();
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith("### DD-")) continue;
    const heading = /^### (DD-\d+) · (.+)$/.exec(lines[index]);
    if (!heading || heading[2].trim() === "") fail(`${relative}:${index + 1}: decision title is missing`);
    const [, id, rawTitle] = heading;
    if (seen.has(id)) fail(`${relative}:${index + 1}: duplicate decision identifier ${id}`);
    seen.add(id);
    let metadataIndex = index + 1;
    while (metadataIndex < lines.length && lines[metadataIndex].trim() === "") metadataIndex += 1;
    const metadata = METADATA_RE.exec(lines[metadataIndex] ?? "");
    if (!metadata || metadata.slice(1).some((value) => value.trim() === "")) {
      fail(`${relative}:${metadataIndex + 1}: metadata must contain nonempty Subject, Introduced, and State`);
    }
    const [, rawSubject, , rawState] = metadata;
    const state = rawState.trim();
    if (!STATE_RE.test(state)) fail(`${relative}:${metadataIndex + 1}: invalid State: ${state}`);
    decisions.push({ id, title: rawTitle.trim(), subject: rawSubject.trim(), state });
  }
  if (decisions.length === 0) fail(`${relative}: no decisions found`);
  return decisions;
}

function assertParallel(english, korean) {
  const en = english.map((item) => item.id);
  const ko = korean.map((item) => item.id);
  if (JSON.stringify(en) !== JSON.stringify(ko)) fail("English/Korean decision identifier set or order differs");
}

function cell(value) {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function decisionTitle(value) {
  return value.replace(/ \(v\d+\.\d+\.\d+(?:, [^()]+ v\d+\.\d+\.\d+)?\)$/, "");
}

function render(decisions) {
  const lines = ["# Decision index", ""];
  let subject = null;
  for (const decision of decisions) {
    if (decision.subject !== subject) {
      if (subject !== null) lines.push("");
      subject = decision.subject;
      lines.push(`## ${subject}`, "", "| ID | Decision | State |", "|---|---|---|");
    }
    lines.push(`| ${decision.id} | ${cell(decisionTitle(decision.title))} | ${cell(decision.state)} |`);
  }
  return `${lines.join("\n")}\n`;
}

try {
  const { lang } = parseArguments(process.argv.slice(2));
  const root = process.cwd();
  const english = parseSource(path.join(root, "docs", "design-decisions.md"));
  const korean = parseSource(path.join(root, "docs", "design-decisions_ko.md"));
  assertParallel(english, korean);
  const output = render(lang === "ko" ? korean : english);
  const bytes = Buffer.byteLength(output);
  if (bytes > OUTPUT_ADVISORY) {
    process.stderr.write(`warning: decision index is ${bytes} bytes; advisory threshold is ${OUTPUT_ADVISORY}\n`);
  }
  process.stdout.write(output);
} catch (error) {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
}
