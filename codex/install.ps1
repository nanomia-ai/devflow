# devflow → Codex CLI installer (Windows)
# One channel: the native plugin (marketplace add + plugin add). Skills keep their
# frontmatter and their companion files, so Codex resolves `../principles/SKILL.md` the
# same way Claude does, and the plugin also delivers SessionStart. Generated slash prompts
# are gone; this run removes the ones devflow wrote.
$ErrorActionPreference = "Stop"

$devflowRoot = Split-Path $PSScriptRoot -Parent

# Show which Codex home this run targets. A tool that sets CODEX_HOME to its own runtime
# copy makes an install land there and silently miss ~/.codex.
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
Write-Host "Codex home: $codexHome"
if ($env:CODEX_HOME) {
    Write-Host "NOTE: CODEX_HOME is set - the codex CLI installs the plugin into that home."
}

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
        Write-Host "NOTE: native plugin registration did not take."
        $broken = @($addOut) + @($listOut) | Select-String -Pattern "does not contain a supported manifest|failed to load"
        if ($broken) {
            Write-Host "  Cause: another marketplace in your Codex config points at a folder that no longer exists,"
            Write-Host "  which makes every 'codex plugin' command fail. Remove that entry from config.toml"
            Write-Host '  ($env:CODEX_HOME, or ~/.codex) and run this installer again. Codex reported:'
            $broken | ForEach-Object { Write-Host "    $_" }
        }
    }
} else {
    Write-Host "NOTE: codex CLI not on PATH - skipped native plugin registration."
}

Write-Host ""
if ($pluginInstalled) {
    node (Join-Path $devflowRoot "scripts\remove-generated-codex-prompts.js")
} else {
    Write-Host "Native plugin unavailable; generated slash prompts were left unchanged."
}

Write-Host ""
if ($pluginInstalled) {
    Write-Host "Done. Codex invokes the devflow skills itself - type a trigger such as 'resume devflow state'."
    Write-Host "The native plugin delivers SessionStart. Enable [features] hooks = true in Codex config."
    Write-Host ""
    Write-Host "Next, and only you can do it: open /hooks in a Codex session and confirm the devflow"
    Write-Host "SessionStart entry runs this exact command:"
    Write-Host '    node "<plugin root>/scripts/session-start.js"'
    Write-Host "Once you have seen it there, remove the pre-0.9.20 global registration:"
    Write-Host "    node ""$devflowRoot\scripts\remove-legacy-codex-hook.js"""
    Write-Host "Until you run that, the old global hook stays in place, so session start keeps working"
    Write-Host "even if the plugin hook is never trusted."
    Write-Host ""
    Write-Host "Only when hooks are disabled or unsupported, add codex/AGENTS-devflow.md to the project's AGENTS.md."
} else {
    Write-Host "Done - with no plugin, ask the model to run the devflow resume skill explicitly."
}
