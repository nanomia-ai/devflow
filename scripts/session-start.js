#!/usr/bin/env node
// nano-devflow SessionStart 훅: 트리 상태·HANDOFF를 새 세션(시작/재개/압축 직후)에 주입한다.
// devflow 미적용 프로젝트(devflow/tree 없음)에서는 조용히 종료한다.
"use strict";
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const treeDir = path.join(cwd, "devflow", "tree");
if (!fs.existsSync(treeDir)) process.exit(0);

function safeRead(p, maxLen) {
  try {
    const t = fs.readFileSync(p, "utf8");
    return t.length > maxLen ? t.slice(0, maxLen) + "\n…(잘림)" : t;
  } catch {
    return null;
  }
}

// devflow/tree 아래 재귀 수집 (얕은 구현으로 충분 — 트리 깊이는 규약상 낮다)
function walk(dir, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const files = walk(treeDir, []);
const rel = (p) => path.relative(cwd, p).replace(/\\/g, "/");
const wip = files.filter((p) => /\.wip\.md$/.test(p));
const done = files.filter((p) => /\.done\.md$/.test(p));
const pending = files.filter((p) => !/\.(wip|done|stale)\.md$/.test(p) && !/verify\.md$/.test(p));

const parts = [];
parts.push("[nano-devflow] 이 프로젝트는 devflow로 관리된다. 트리 상태:");
parts.push(`- 완료 ${done.length} / 진행 중 ${wip.length} / 대기 ${pending.length}`);

// 정합성 경고: 카드 번호 중복 (번호는 불변 식별자이므로 중복 = 오염 신호)
const numOf = (p) => {
  const m = path.basename(p).match(/^(\d+(?:\.\d+)*[a-z]?)-/);
  return m ? m[1] : null;
};
const seen = new Map();
const dups = new Set();
for (const p of files) {
  if (/verify\.md$/.test(path.basename(p))) continue;
  const n = numOf(p);
  if (!n) continue;
  if (seen.has(n)) dups.add(n);
  seen.set(n, p);
}
if (dups.size) parts.push(`⚠ 번호 중복 감지: ${[...dups].join(", ")} — 정합성 점검 필요 (고치지 말고 보고)`);
if (wip.length > 1) parts.push(`⚠ .wip. 카드가 ${wip.length}개 — 승인된 병렬이 아니라면 정합성 이상`);

// 정체성 문단 (product.md 첫 20줄 안에서 첫 빈 줄 전까지의 본문)
const product = safeRead(path.join(cwd, "devflow", "project", "product.md"), 4000);
if (product) {
  const lines = product.split(/\r?\n/).slice(0, 20);
  const idx = lines.findIndex((l, i) => i > 0 && l.trim() === "" && lines.slice(1, i).some((x) => x.trim()));
  const identity = lines.slice(0, idx > 0 ? idx : 6).join("\n").trim();
  if (identity) parts.push("\n정체성:\n" + identity);
}

if (wip.length) {
  parts.push("\n진행 중 작업 (통독 후 이어갈 것):");
  for (const p of wip) parts.push("- " + rel(p));
} else if (pending.length) {
  parts.push("\n진행 중 작업 없음. 다음 대기 카드 예시: " + rel(pending[0]));
}

const handoff = safeRead(path.join(cwd, "devflow", "HANDOFF.md"), 3000);
if (handoff && handoff.trim()) parts.push("\nHANDOFF:\n" + handoff.trim());

parts.push("\n재개 절차는 nano-devflow의 resume 스킬을 따른다. 승인 전에 코드를 고치지 않는다.");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: parts.join("\n"),
    },
  })
);
