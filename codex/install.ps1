# devflow → Codex CLI installer (Windows)
# Three channels: 1) native plugin (marketplace add + plugin add) — skills with
# frontmatter become model-invocable, same as Claude; 2) ~/.codex/prompts/devflow-<name>.md
# slash prompts — the explicit channel (canonical rules and companion documents embedded);
# 3) SessionStart hook via ~/.codex/hooks.json (plugin-delivered hooks are removed in Codex).
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
    # Embed companion documents (role contracts etc.) and repoint their references
    $tick = [char]96
    $companions = @()
    Get-ChildItem $_.FullName -Filter "*.md" | Where-Object { $_.Name -ne "SKILL.md" -and $_.Name -notlike "*_ko.md" } | ForEach-Object {
        $cname = $_.Name
        $body = $body -replace [regex]::Escape("$tick$cname$tick beside this skill"), "the $cname section below"
        $companions += @("", "---", "", "# $cname", "", (Get-SkillBody $_.FullName).TrimEnd())
    }
    # adopt references the product/arch output formats by stage name — embed them (flat prompt folder)
    if ($name -eq "adopt") {
        foreach ($ref in @("product", "arch")) {
            $refBody = Get-SkillBody (Join-Path $devflowRoot "skills\$ref\SKILL.md")
            $refBody = $refBody -replace [regex]::Escape('`../principles/SKILL.md`'), "the Canonical Rules section below"
            $companions += @("", "---", "", "# $ref skill (referenced output formats)", "", $refBody.TrimEnd())
        }
    }
    $out = (@(
        "<!-- devflow (generated $(Get-Date -Format yyyy-MM-dd)) -->"
        ""
        $body.TrimEnd()
    ) + $companions + @(
        ""
        "---"
        ""
        $principles.TrimEnd()
    )) -join "`n"
    Set-Content -Encoding utf8 (Join-Path $promptsDir "devflow-$name.md") $out
    Write-Host "installed: /devflow-$name"
}

Write-Host ""
# Native plugin channel — registers the repo as a marketplace and installs the plugin,
# so the skills (frontmatter intact) are model-invocable inside Codex.
if (Get-Command codex -ErrorAction SilentlyContinue) {
    $ea = $ErrorActionPreference; $ErrorActionPreference = "Continue"
    cmd /c "codex plugin marketplace remove nanomia >nul 2>nul"
    cmd /c "codex plugin marketplace add ""$devflowRoot"" >nul 2>nul"
    cmd /c "codex plugin remove devflow@nanomia >nul 2>nul"
    cmd /c "codex plugin add devflow@nanomia >nul 2>nul"
    $pluginOk = ($LASTEXITCODE -eq 0)
    $ErrorActionPreference = $ea
    if ($pluginOk) { Write-Host "plugin installed: devflow@nanomia (native Codex skills - model-invocable)" }
    else { Write-Host "NOTE: codex plugin add failed - the slash prompts above still work." }
} else {
    Write-Host "NOTE: codex CLI not on PATH - skipped native plugin registration (slash prompts still work)."
}

Write-Host ""
node (Join-Path $devflowRoot "scripts\install-codex-hook.js")

Write-Host ""
Write-Host "Done. /devflow-product ... /devflow-resume are now available in Codex."
Write-Host "The SessionStart hook is registered: tree state is injected at session start (same as Claude)."
Write-Host "Only in hook-incapable environments, add the codex/AGENTS-devflow.md block to the project's AGENTS.md as a fallback."
