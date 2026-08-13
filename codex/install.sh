#!/usr/bin/env sh
# devflow → Codex CLI installer (macOS/Linux)
# One channel: the native plugin (marketplace add + plugin add). Skills keep their
# frontmatter and their companion files, so Codex resolves `../principles/SKILL.md` the
# same way Claude does, and the plugin also delivers SessionStart. Generated slash prompts
# are gone; this run removes the ones devflow wrote.
set -e

DEVFLOW_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Show which Codex home this run targets. A tool that sets CODEX_HOME to its own runtime
# copy makes an install land there and silently miss ~/.codex.
CODEX_HOME_RESOLVED="${CODEX_HOME:-$HOME/.codex}"
echo "Codex home: $CODEX_HOME_RESOLVED"
if [ -n "${CODEX_HOME:-}" ]; then
  echo "NOTE: CODEX_HOME is set - the codex CLI installs the plugin into that home."
fi

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
    echo "NOTE: native plugin registration did not take."
    broken=$(printf '%s\n%s' "$add_out" "$list_out" | grep -E "does not contain a supported manifest|failed to load" || true)
    if [ -n "$broken" ]; then
      echo "  Cause: another marketplace in your Codex config points at a folder that no longer exists,"
      echo "  which makes every 'codex plugin' command fail. Remove that entry from config.toml"
      echo "  (\$CODEX_HOME, or ~/.codex) and run this installer again. Codex reported:"
      printf '%s\n' "$broken" | sed 's/^/    /'
    fi
  fi
else
  echo "NOTE: codex CLI not on PATH - skipped native plugin registration."
fi

echo ""
if [ "$plugin_installed" -eq 1 ]; then
  node "$DEVFLOW_ROOT/scripts/remove-generated-codex-prompts.js"
else
  echo "Native plugin unavailable; generated slash prompts were left unchanged."
fi

echo ""
if [ "$plugin_installed" -eq 1 ]; then
  echo "Done. Codex invokes the devflow skills itself - type a trigger such as 'resume devflow state'."
  echo "The native plugin delivers SessionStart. Enable [features] hooks = true in Codex config."
  echo ""
  echo "Next, and only you can do it: open /hooks in a Codex session and confirm the devflow"
  echo "SessionStart entry runs this exact command:"
  echo "    node \"<plugin root>/scripts/session-start.js\""
  echo "Once you have seen it there, remove the pre-0.9.20 global registration:"
  echo "    node \"$DEVFLOW_ROOT/scripts/remove-legacy-codex-hook.js\""
  echo "Until you run that, the old global hook stays in place, so session start keeps working"
  echo "even if the plugin hook is never trusted."
  echo ""
  echo "Only when hooks are disabled or unsupported, add codex/AGENTS-devflow.md to the project's AGENTS.md."
else
  echo "Done - with no plugin, ask the model to run the devflow resume skill explicitly."
fi
