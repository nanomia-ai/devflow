#!/usr/bin/env sh
# devflow → Codex CLI installer (macOS/Linux)
# Converts skills/*/SKILL.md into ~/.codex/prompts/devflow-<name>.md.
# The canonical rules (principles) are embedded in each prompt, so no separate prompt is made for them.
set -e

DEVFLOW_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPTS_DIR="$HOME/.codex/prompts"
mkdir -p "$PROMPTS_DIR"

# Purge prompts from the pre-0.9.0 name (nano-devflow)
rm -f "$PROMPTS_DIR"/nano-devflow-*.md

strip_fm() { awk 'BEGIN{fm=0} /^---$/{if(fm<2){fm++; next}} fm!=1{print}' "$1"; }

PRINCIPLES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/SKILL.md")"

for dir in "$DEVFLOW_ROOT"/skills/*/; do
  name="$(basename "$dir")"
  [ "$name" = "principles" ] && continue
  {
    echo "<!-- devflow (generated $(date +%Y-%m-%d)) -->"
    echo ""
    strip_fm "$dir/SKILL.md" | sed 's|`\.\./principles/SKILL\.md`|the Canonical Rules section below|g'
    echo ""
    echo "---"
    echo ""
    printf '%s\n' "$PRINCIPLES"
  } > "$PROMPTS_DIR/devflow-$name.md"
  echo "installed: /devflow-$name"
done

echo ""
node "$DEVFLOW_ROOT/scripts/install-codex-hook.js"

echo ""
echo "Done. /devflow-product ... /devflow-resume are now available in Codex."
echo "The SessionStart hook is registered: tree state is injected at session start (same as Claude)."
echo "Only in hook-incapable environments, add the codex/AGENTS-devflow.md block to the project's AGENTS.md as a fallback."
