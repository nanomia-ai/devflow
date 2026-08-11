#!/usr/bin/env sh
# devflow → Codex CLI installer (macOS/Linux)
# Two channels: 1) native plugin (marketplace add + plugin add) — skills with
# frontmatter become model-invocable, same as Claude; 2) ~/.codex/prompts/devflow-<name>.md
# slash prompts — the explicit channel (canonical rules and companion documents embedded);
# the native plugin also delivers SessionStart.
set -e

DEVFLOW_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Show which Codex home this run targets. A tool that sets CODEX_HOME to its own runtime
# copy makes an install land there and silently miss ~/.codex.
CODEX_HOME_RESOLVED="${CODEX_HOME:-$HOME/.codex}"
echo "Codex home: $CODEX_HOME_RESOLVED"
if [ -n "${CODEX_HOME:-}" ]; then
  echo "NOTE: CODEX_HOME is set - the codex CLI installs the plugin into that home; generated prompts go to ~/.codex/prompts."
fi

PROMPTS_DIR="$HOME/.codex/prompts"
mkdir -p "$PROMPTS_DIR"

# Purge prompts from the pre-0.9.0 name (nano-devflow)
rm -f "$PROMPTS_DIR"/nano-devflow-*.md

strip_fm() { awk 'BEGIN{fm=0} /^---$/{if(fm<2){fm++; next}} fm!=1{print}' "$1"; }

PRINCIPLES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/SKILL.md")"
STATE_PREDICATES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/state-predicates.md")"
VERIFICATION_PREDICATES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/verification-predicates.md")"
BASELINE_PREDICATES="$(strip_fm "$DEVFLOW_ROOT/skills/principles/baseline-predicates.md")"

for dir in "$DEVFLOW_ROOT"/skills/*/; do
  name="$(basename "$dir")"
  [ "$name" = "principles" ] && continue
  body="$(strip_fm "$dir/SKILL.md" | sed \
    -e 's|`\.\./principles/SKILL\.md`|the Canonical Rules section below|g' \
    -e 's|`\.\./principles/state-predicates\.md`|the Canonical State Predicates section below|g' \
    -e 's|`\.\./principles/verification-predicates\.md`|the Canonical Verification Predicates section below|g' \
    -e 's|`\.\./principles/baseline-predicates\.md`|the Canonical Capability Knowledge Baseline Predicates section below|g')"
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
  # adopt needs bounded producer references in the flat prompt, never the active stage procedures.
  if [ "$name" = "adopt" ]; then
    for ref in product arch; do
      {
        echo ""
        echo "---"
        echo ""
        echo "# $ref reference (bounded output contract)"
        echo ""
        node "$DEVFLOW_ROOT/scripts/extract-adopt-reference.js" "$DEVFLOW_ROOT/skills/$ref/SKILL.md" "$ref"
      } >> "$PROMPTS_DIR/devflow-$name.md"
    done
  fi
  case "$name" in
    resume|split|verify|work)
      {
        echo ""
        echo "---"
        echo ""
        printf '%s\n' "$STATE_PREDICATES"
      } >> "$PROMPTS_DIR/devflow-$name.md"
      ;;
  esac
  case "$name" in
    resume|verify)
      {
        echo ""
        echo "---"
        echo ""
        printf '%s\n' "$VERIFICATION_PREDICATES"
      } >> "$PROMPTS_DIR/devflow-$name.md"
      ;;
  esac
  case "$name" in
    adopt|arch|resume|verify)
      {
        echo ""
        echo "---"
        echo ""
        printf '%s\n' "$BASELINE_PREDICATES"
      } >> "$PROMPTS_DIR/devflow-$name.md"
      ;;
  esac
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
plugin_installed=0
if command -v codex >/dev/null 2>&1; then
  codex plugin marketplace remove nanomia >/dev/null 2>&1 || true
  add_out=$(codex plugin marketplace add "$DEVFLOW_ROOT" 2>&1 || true)
  codex plugin remove devflow@nanomia >/dev/null 2>&1 || true
  codex plugin add devflow@nanomia >/dev/null 2>&1 || true
  # Confirm the exact installed entry. The human list also prints available-but-not-installed
  # plugin IDs, so a substring check can destroy the working predecessor after a failed add.
  list_out=""
  if list_out=$(codex plugin list --json); then
    if printf '%s' "$list_out" | node "$DEVFLOW_ROOT/scripts/verify-codex-plugin-install.js" \
      "$DEVFLOW_ROOT/.claude-plugin/plugin.json" "$DEVFLOW_ROOT"; then
      plugin_installed=1
    fi
  fi
  if [ "$plugin_installed" -eq 1 ]; then
    echo "plugin installed: devflow@nanomia (native Codex skills - model-invocable)"
  else
    echo "NOTE: native plugin registration did not take - the slash prompts above still work."
    broken=$(printf '%s\n%s' "$add_out" "$list_out" | grep -E "does not contain a supported manifest|failed to load" || true)
    if [ -n "$broken" ]; then
      echo "  Cause: another marketplace in your Codex config points at a folder that no longer exists,"
      echo "  which makes every 'codex plugin' command fail. Remove that entry from config.toml"
      echo "  (\$CODEX_HOME, or ~/.codex) and run this installer again. Codex reported:"
      printf '%s\n' "$broken" | sed 's/^/    /'
    fi
  fi
else
  echo "NOTE: codex CLI not on PATH - skipped native plugin registration (slash prompts still work)."
fi

echo ""
if [ "$plugin_installed" -eq 1 ]; then
  node "$DEVFLOW_ROOT/scripts/remove-legacy-codex-hook.js"
else
  echo "Native plugin unavailable; any legacy global devflow hook was left unchanged."
fi

echo ""
echo "Done. /devflow-product ... /devflow-resume are now available in Codex."
if [ "$plugin_installed" -eq 1 ]; then
  echo "The native plugin delivers SessionStart. Enable [features] hooks = true in Codex config."
  echo "Only when hooks are disabled or unsupported, add codex/AGENTS-devflow.md to the project's AGENTS.md."
else
  echo "If no legacy hook runs, invoke /devflow-resume explicitly; automatic resume requires a model-invocable resume skill."
fi
