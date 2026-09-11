#!/usr/bin/env node

// Read-only projection of docs/decisions/. One decision is one file; this prints the index the
// entry gate reads, or one decision in full with --id. It writes nothing.
// docs/ is Korean, so decision headers are Korean and there is no language option.

import fs from "node:fs";
import path from "node:path";

const OUTPUT_ADVISORY = 24 * 1024;
const ACTIVE = "유효";
const REPLACED = "대체됨";
const PARTLY = "일부 정정";
const VERSION = "\\(v\\d+\\.\\d+\\.\\d+\\)";
const STATE_RE = new RegExp(
  `^(?:${ACTIVE}|${REPLACED} → DD-\\d+ ${VERSION}`
  + `|${ACTIVE} · ${PARTLY} → DD-\\d+ ${VERSION}(?:, DD-\\d+ ${VERSION})*)$`,
);
const FIELD = { state: "상태", subject: "주제", introduced: "도입" };
// One section per subject holds that subject's rejections (DR-nn). The index names where it lives, so a
// re-proposal reaches the recorded rejection from the always-read projection.
const REJECTED = "기각된 안";

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  let id = null;
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag !== "--id") fail(`unknown option ${flag}`);
    if (value === undefined || value.startsWith("--")) fail("--id requires a decision identifier such as DD-84");
    id = /^\d+$/.test(value) ? `DD-${value}` : value.toUpperCase();
    if (!/^DD-\d+$/.test(id)) fail(`--id must look like DD-84, not ${value}`);
    index += 1;
  }
  return { id };
}

function field(text, name) {
  const match = new RegExp(`^- ${name}: (.+)$`, "m").exec(text);
  return match ? match[1].trim() : "";
}

function parseDirectory(directory) {
  if (!fs.existsSync(directory)) fail(`${directory}: decision directory is missing`);
  const files = fs.readdirSync(directory).filter((name) => name.endsWith(".md")).sort();
  const decisions = [];
  const seen = new Set();
  for (const name of files) {
    const text = fs.readFileSync(path.join(directory, name), "utf8");
    const heading = /^# (DD-\d+) · (.+)$/m.exec(text);
    if (!heading || heading[2].trim() === "") fail(`${name}: first line must be "# DD-nn · <title>"`);
    const [, id, title] = heading;
    if (seen.has(id)) fail(`${name}: duplicate decision identifier ${id}`);
    seen.add(id);
    const state = field(text, FIELD.state);
    const subject = field(text, FIELD.subject);
    const introduced = field(text, FIELD.introduced);
    if (!state || !subject || !introduced) {
      fail(`${name}: header needs nonempty ${FIELD.subject}, ${FIELD.introduced}, and ${FIELD.state}`);
    }
    if (!STATE_RE.test(state)) fail(`${name}: invalid state: ${state}`);
    decisions.push({ id, title: title.trim(), subject, introduced, state, file: name, text, rejection: rejectionSection(name, id, text) });
  }
  if (decisions.length === 0) fail(`${directory}: no decisions found`);
  return decisions;
}

function rejectionSection(name, id, text) {
  const sections = [...text.matchAll(new RegExp(`^## ${REJECTED} — (.+)$`, "gm"))];
  const entries = [...text.matchAll(/\*\*\[(DR-\d+)\s+·/g)];
  if (sections.length > 1) fail(`${name}: more than one rejection section`);
  if (sections.length === 0) {
    if (entries.length) fail(`${name}: ${entries[0][1]} is outside a "## ${REJECTED} — <subject>" rejection section`);
    return null;
  }
  const start = sections[0].index;
  const next = text.indexOf("\n## ", start + 1);
  const end = next < 0 ? text.length : next;
  for (const entry of entries) {
    if (entry.index < start || entry.index > end) fail(`${name}: ${entry[1]} is outside its rejection section`);
  }
  return { subject: sections[0][1].trim(), id, ids: entries.map((entry) => entry[1]) };
}

function rejectionsBySubject(decisions) {
  const bySubject = new Map();
  for (const { rejection } of decisions) {
    if (!rejection) continue;
    if (bySubject.has(rejection.subject)) fail(`subject ${rejection.subject} has two rejection sections`);
    if (!decisions.some((decision) => decision.subject === rejection.subject)) {
      fail(`rejection section names subject ${rejection.subject}, which no decision has`);
    }
    bySubject.set(rejection.subject, rejection);
  }
  return bySubject;
}

function cell(value) {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function subjectOrder(root) {
  const file = path.join(root, "docs", "decisions", ".subjects.json");
  if (!fs.existsSync(file)) return null;
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(parsed.subjects) ? parsed.subjects : null;
}

function render(decisions, order) {
  const rejections = rejectionsBySubject(decisions);
  const groups = new Map();
  for (const decision of decisions) {
    if (!groups.has(decision.subject)) groups.set(decision.subject, []);
    groups.get(decision.subject).push(decision);
  }
  const subjects = order
    ? [...order.filter((s) => groups.has(s)), ...[...groups.keys()].filter((s) => !order.includes(s))]
    : [...groups.keys()];
  const lines = ["# 결정 색인", "",
    "한 결정은 `docs/decisions/` 아래 한 파일이다. 하나만 열려면 `--id DD-nn`.", ""];
  for (const subject of subjects) {
    lines.push(`## ${subject}`, "", "| ID | 결정 | 도입 | 상태 |", "|---|---|---|---|");
    for (const decision of groups.get(subject).sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3)))) {
      lines.push(`| ${decision.id} | ${cell(decision.title)} | ${cell(decision.introduced)} | ${cell(decision.state)} |`);
    }
    const rejection = rejections.get(subject);
    if (rejection) {
      lines.push("", `${REJECTED}: ${rejection.ids.length ? rejection.ids.join(" · ") : "아직 없음"} — \`--id ${rejection.id}\``);
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

try {
  const { id } = parseArguments(process.argv.slice(2));
  const root = process.cwd();
  const decisions = parseDirectory(path.join(root, "docs", "decisions"));
  if (id) {
    const decision = decisions.find((item) => item.id === id);
    if (!decision) fail(`${id} is not a decision in docs/decisions/`);
    process.stdout.write(decision.text.endsWith("\n") ? decision.text : `${decision.text}\n`);
  } else {
    const output = render(decisions, subjectOrder(root));
    const bytes = Buffer.byteLength(output);
    if (bytes > OUTPUT_ADVISORY) {
      process.stderr.write(`warning: decision index is ${bytes} bytes; advisory threshold is ${OUTPUT_ADVISORY}\n`);
    }
    process.stdout.write(output);
  }
} catch (error) {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
}
