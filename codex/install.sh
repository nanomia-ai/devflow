#!/usr/bin/env sh
# devflow → Codex CLI installer (macOS/Linux)
# Three channels: 1) native plugin (marketplace add + plugin add) — skills with
# frontmatter become model-invocable, same as Claude; 2) ~/.codex/prompts/devflow-<name>.md
# slash prompts — the explicit channel (canonical rules and companion documents embedded);
# 3) SessionStart hook via ~/.codex/hooks.json (plugin-delivered hooks are removed in Codex).
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
  body="$(strip_fm "$dir/SKILL.md" | sed 's|`\.\./principles/SKILL\.md`|the Canonical Rules section below|g')"
  # Repoint companion-document references (role contracts etc.)
  for comp in "$dir"*.md; do
    cbase="$(basename "$comp")"
    [ "$cbase" = "SKILL.md" ] && continue
    case "$cbase" in *_ko.md) continue ;; esac
    body="$(printf '%s\n' "$body" | sed "s|\`$cbase\` beside this skill|the $cbase section below|g")"
  done
  {
    echo "<!-- devflow (generated $(date +%Y-%m-%d)) -->"
    echo ""
    printf '%s\n' "$body"
  } > "$PROMPTS_DIR/devflow-$name.md"
  # Embed the companion documents as sections
  for comp in "$dir"*.md; do
    cbase="$(basename "$comp")"
    [ "$cbase" = "SKILL.md" ] && continue
    case "$cbase" in *_ko.md) continue ;; esac
    {
      echo ""
      echo "---"
      echo ""
      echo "# $cbase"
      echo ""
      strip_fm "$comp"
    } >> "$PROMPTS_DIR/devflow-$name.md"
  done
  {
    echo ""
    echo "---"
    echo ""
    printf '%s\n' "$PRINCIPLES"
  } >> "$PROMPTS_DIR/devflow-$name.md"
  echo "installed: /devflow-$name"
done

echo ""
# Native plugin channel — registers the repo as a marketplace and installs the plugin,
# so the skills (frontmatter intact) are model-invocable inside Codex.
if command -v codex >/dev/null 2>&1; then
  codex plugin marketplace remove nanomia >/dev/null 2>&1 || true
  codex plugin marketplace add "$DEVFLOW_ROOT" >/dev/null 2>&1 || true
  codex plugin remove devflow >/dev/null 2>&1 || true
  if codex plugin add devflow@nanomia >/dev/null 2>&1; then
    echo "plugin installed: devflow@nanomia (native Codex skills - model-invocable)"
  else
    echo "NOTE: codex plugin add failed - the slash prompts above still work."
  fi
else
  echo "NOTE: codex CLI not on PATH - skipped native plugin registration (slash prompts still work)."
fi

echo ""
node "$DEVFLOW_ROOT/scripts/install-codex-hook.js"

echo ""
echo "Done. /devflow-product ... /devflow-resume are now available in Codex."
echo "The SessionStart hook is registered: tree state is injected at session start (same as Claude)."
echo "Only in hook-incapable environments, add the codex/AGENTS-devflow.md block to the project's AGENTS.md as a fallback."
