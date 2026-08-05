# nano-devflow → Codex CLI 설치 스크립트 (Windows)
# skills/*/SKILL.md 를 ~/.codex/prompts/nano-devflow-<이름>.md 로 변환한다.
# 규칙 정본(principles)은 각 프롬프트에 동봉되므로 별도 프롬프트로 만들지 않는다.
$ErrorActionPreference = "Stop"

$devflowRoot = Split-Path $PSScriptRoot -Parent
$promptsDir = Join-Path $HOME ".codex\prompts"
New-Item -ItemType Directory -Force $promptsDir | Out-Null

function Get-SkillBody($path) {
    $raw = Get-Content $path -Raw -Encoding UTF8
    return $raw -replace '(?s)^---.*?---\s*', ''   # frontmatter 제거
}

$principles = Get-SkillBody (Join-Path $devflowRoot "skills\principles\SKILL.md")

Get-ChildItem (Join-Path $devflowRoot "skills") -Directory | Where-Object { $_.Name -ne "principles" } | ForEach-Object {
    $name = $_.Name
    $body = Get-SkillBody (Join-Path $_.FullName "SKILL.md")
    # 스킬 본문의 상대 경로 참조를 동봉 안내로 치환
    $body = $body -replace [regex]::Escape('`../principles/SKILL.md`'), "the Canonical Rules section below"
    $out = @(
        "<!-- nano-devflow (generated $(Get-Date -Format yyyy-MM-dd)) -->"
        ""
        $body.TrimEnd()
        ""
        "---"
        ""
        $principles.TrimEnd()
    ) -join "`n"
    Set-Content -Encoding utf8 (Join-Path $promptsDir "nano-devflow-$name.md") $out
    Write-Host "installed: /nano-devflow-$name"
}

Write-Host ""
node (Join-Path $devflowRoot "scripts\install-codex-hook.js")

Write-Host ""
Write-Host "완료. Codex에서 /nano-devflow-product ... /nano-devflow-resume 사용 가능."
Write-Host "SessionStart 훅이 등록되어 세션 시작 시 트리 상태가 자동 주입된다 (Claude와 동일)."
Write-Host "훅을 못 쓰는 환경에서만 폴백으로 codex/AGENTS-devflow.md 블록을 프로젝트 AGENTS.md에 추가."
