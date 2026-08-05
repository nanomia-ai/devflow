#!/usr/bin/env sh
# nano-devflow → Codex CLI 설치 스크립트 (macOS/Linux)
# skills/*/SKILL.md 를 ~/.codex/prompts/nano-devflow-<이름>.md 로 변환한다.
# 규칙 정본(principles)은 각 프롬프트에 동봉되므로 별도 프롬프트로 만들지 않는다.
set -e

DEVFLOW_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPTS_DIR="$HOME/.codex/prompts"
mkdir -p "$PROMPTS_DIR"

strip_fm() { awk 'BEGIN{fm=0} /^---$/{if(fm<2){fm++; next}} fm!=1{print}' "$1"; }

PRINCIPLES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/SKILL.md")"

for dir in "$DEVFLOW_ROOT"/skills/*/; do
  name="$(basename "$dir")"
  [ "$name" = "principles" ] && continue
  {
    echo "<!-- nano-devflow (generated $(date +%Y-%m-%d)) -->"
    echo ""
    strip_fm "$dir/SKILL.md" | sed 's|`\.\./principles/SKILL\.md`|the Canonical Rules section below|g'
    echo ""
    echo "---"
    echo ""
    printf '%s\n' "$PRINCIPLES"
  } > "$PROMPTS_DIR/nano-devflow-$name.md"
  echo "installed: /nano-devflow-$name"
done

echo ""
node "$DEVFLOW_ROOT/scripts/install-codex-hook.js"

echo ""
echo "완료. Codex에서 /nano-devflow-product ... /nano-devflow-resume 사용 가능."
echo "SessionStart 훅이 등록되어 세션 시작 시 트리 상태가 자동 주입된다 (Claude와 동일)."
echo "훅을 못 쓰는 환경에서만 폴백으로 codex/AGENTS-devflow.md 블록을 프로젝트 AGENTS.md에 추가."
