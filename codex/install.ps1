# devflow → Codex CLI installer (Windows)
# Two channels: 1) native plugin (marketplace add + plugin add) — skills with
# frontmatter become model-invocable, same as Claude; 2) ~/.codex/prompts/devflow-<name>.md
# slash prompts — the explicit channel (canonical rules and companion documents embedded);
# the native plugin also delivers SessionStart.
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
$statePredicates = Get-SkillBody (Join-Path $devflowRoot "skills\principles\state-predicates.md")
$verificationPredicates = Get-SkillBody (Join-Path $devflowRoot "skills\principles\verification-predicates.md")
$baselinePredicates = Get-SkillBody (Join-Path $devflowRoot "skills\principles\baseline-predicates.md")

Get-ChildItem (Join-Path $devflowRoot "skills") -Directory | Where-Object { $_.Name -ne "principles" } | ForEach-Object {
    $name = $_.Name
    $body = Get-SkillBody (Join-Path $_.FullName "SKILL.md")
    $usesStatePredicates = $body.Contains('`../principles/state-predicates.md`')
    $usesVerificationPredicates = $body.Contains('`../principles/verification-predicates.md`')
    $usesBaselinePredicates = $body.Contains('`../principles/baseline-predicates.md`')
    # Replace the relative canon reference with the embedded-section pointer
    $body = $body -replace [regex]::Escape('`../principles/SKILL.md`'), "the Canonical Rules section below"
    $body = $body -replace [regex]::Escape('`../principles/state-predicates.md`'), "the Canonical State Predicates section below"
    $body = $body -replace [regex]::Escape('`../principles/verification-predicates.md`'), "the Canonical Verification Predicates section below"
    $body = $body -replace [regex]::Escape('`../principles/baseline-predicates.md`'), "the Canonical Capability Knowledge Baseline Predicates section below"
    # Embed companion documents (role contracts etc.) and repoint their references
    $tick = [char]96
    $companions = @()
    Get-ChildItem $_.FullName -Filter "*.md" | Where-Object { $_.Name -ne "SKILL.md" -and $_.Name -notlike "*_ko.md" } | ForEach-Object {
        $cname = $_.Name
        $body = $body -replace [regex]::Escape("$tick$cname$tick beside this skill"), "the $cname section below"
        $companions += @("", "---", "", "# $cname", "", (Get-SkillBody $_.FullName).TrimEnd())
    }
    # adopt needs bounded producer references in the flat prompt, never the active stage procedures.
    if ($name -eq "adopt") {
        foreach ($ref in @("product", "arch")) {
            $refBody = & node (Join-Path $devflowRoot "scripts\extract-adopt-reference.js") `
                (Join-Path $devflowRoot "skills\$ref\SKILL.md") $ref
            if ($LASTEXITCODE -ne 0) { throw "could not extract the bounded $ref reference" }
            $companions += @("", "---", "", "# $ref reference (bounded output contract)", "", ($refBody -join "`n").TrimEnd())
        }
    }
    if ($usesStatePredicates) {
        $companions += @("", "---", "", $statePredicates.TrimEnd())
    }
    if ($usesVerificationPredicates) {
        $companions += @("", "---", "", $verificationPredicates.TrimEnd())
    }
    if ($usesBaselinePredicates) {
        $companions += @("", "---", "", $baselinePredicates.TrimEnd())
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
$pluginInstalled = $false
if (Get-Command codex -ErrorAction SilentlyContinue) {
    $ea = $ErrorActionPreference; $ErrorActionPreference = "Continue"
    cmd /c "codex plugin marketplace remove nanomia >nul 2>nul"
    $addOut = cmd /c "codex plugin marketplace add ""$devflowRoot"" 2>&1"
    cmd /c "codex plugin remove devflow@nanomia >nul 2>nul"
    cmd /c "codex plugin add devflow@nanomia >nul 2>nul"
    # Confirm the exact installed entry. The human list also prints available-but-not-installed
    # plugin IDs, so a substring check can destroy the working predecessor after a failed add.
    $pluginConfirmed = $false
    $listOut = @()
    $listTemp = [IO.Path]::GetTempFileName()
    try {
        $listOut = cmd /c "codex plugin list --json"
        $listSucceeded = $LASTEXITCODE -eq 0
        if ($listSucceeded) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [IO.File]::WriteAllText($listTemp, (@($listOut) -join "`r`n"), $utf8NoBom)
            & node (Join-Path $devflowRoot "scripts\verify-codex-plugin-install.js") `
                (Join-Path $devflowRoot ".claude-plugin\plugin.json") $devflowRoot $listTemp
            $pluginConfirmed = $LASTEXITCODE -eq 0
        }
    } finally {
        Remove-Item -LiteralPath $listTemp -Force -ErrorAction SilentlyContinue
        $ErrorActionPreference = $ea
    }
    if ($pluginConfirmed) {
        $pluginInstalled = $true
        Write-Host "plugin installed: devflow@nanomia (native Codex skills - model-invocable)"
    } else {
        Write-Host "NOTE: native plugin registration did not take - the slash prompts above still work."
        $broken = @($addOut) + @($listOut) | Select-String -Pattern "does not contain a supported manifest|failed to load"
        if ($broken) {
            Write-Host "  Cause: another marketplace in your Codex config points at a folder that no longer exists,"
            Write-Host "  which makes every 'codex plugin' command fail. Remove that entry from config.toml"
            Write-Host '  ($env:CODEX_HOME, or ~/.codex) and run this installer again. Codex reported:'
            $broken | ForEach-Object { Write-Host "    $_" }
        }
    }
} else {
    Write-Host "NOTE: codex CLI not on PATH - skipped native plugin registration (slash prompts still work)."
}

Write-Host ""
if ($pluginInstalled) {
    node (Join-Path $devflowRoot "scripts\remove-legacy-codex-hook.js")
} else {
    Write-Host "Native plugin unavailable; any legacy global devflow hook was left unchanged."
}

Write-Host ""
Write-Host "Done. /devflow-product ... /devflow-resume are now available in Codex."
if ($pluginInstalled) {
    Write-Host "The native plugin delivers SessionStart. Enable [features] hooks = true in Codex config."
    Write-Host "Only when hooks are disabled or unsupported, add codex/AGENTS-devflow.md to the project's AGENTS.md."
} else {
    Write-Host "If no legacy hook runs, invoke /devflow-resume explicitly; automatic resume requires a model-invocable resume skill."
}
