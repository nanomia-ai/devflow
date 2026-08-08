# devflow → Codex CLI installer (Windows)
# Converts skills/*/SKILL.md into ~/.codex/prompts/devflow-<name>.md.
# The canonical rules (principles) are embedded in each prompt, so no separate prompt is made for them.
$ErrorActionPreference = "Stop"

$devflowRoot = Split-Path $PSScriptRoot -Parent
$promptsDir = Join-Path $HOME ".codex\prompts"
New-Item -ItemType Directory -Force $promptsDir | Out-Null

# Purge prompts from the pre-0.9.0 name (nano-devflow)
Remove-Item (Join-Path $promptsDir "nano-devflow-*.md") -Force -ErrorAction SilentlyContinue

function Get-SkillBody($path) {
    $raw = Get-Content $path -Raw -Encoding UTF8
    return $raw -replace '(?s)^---.*?---\s*', ''   # strip frontmatter
}

$principles = Get-SkillBody (Join-Path $devflowRoot "skills\principles\SKILL.md")

Get-ChildItem (Join-Path $devflowRoot "skills") -Directory | Where-Object { $_.Name -ne "principles" } | ForEach-Object {
    $name = $_.Name
    $body = Get-SkillBody (Join-Path $_.FullName "SKILL.md")
    # Replace the relative canon reference with the embedded-section pointer
    $body = $body -replace [regex]::Escape('`../principles/SKILL.md`'), "the Canonical Rules section below"
    $out = @(
        "<!-- devflow (generated $(Get-Date -Format yyyy-MM-dd)) -->"
        ""
        $body.TrimEnd()
        ""
        "---"
        ""
        $principles.TrimEnd()
    ) -join "`n"
    Set-Content -Encoding utf8 (Join-Path $promptsDir "devflow-$name.md") $out
    Write-Host "installed: /devflow-$name"
}

Write-Host ""
node (Join-Path $devflowRoot "scripts\install-codex-hook.js")

Write-Host ""
Write-Host "Done. /devflow-product ... /devflow-resume are now available in Codex."
Write-Host "The SessionStart hook is registered: tree state is injected at session start (same as Claude)."
Write-Host "Only in hook-incapable environments, add the codex/AGENTS-devflow.md block to the project's AGENTS.md as a fallback."
