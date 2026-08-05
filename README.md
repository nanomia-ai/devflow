# nano-devflow

기획 → 구현 → 검증을 잇는 개발 흐름 스킬. Claude Code와 Codex CLI를 모두 지원한다.

```
Layer 0 · 프로젝트 정의 (1회, 또는 기존 코드에서 상속)
   product ──▶ arch ──▶ [ design ]        ← design은 프론트엔드 있을 때만

Layer 1 · 작업 루프 (반복)
   split ──▶ work ⇄ verify

공통: resume (재개) · principles (규칙 정본)
```

핵심 설계:

- **진행 상태는 문서가 아니라 파일 트리다.** `devflow/tree/`의 파일명 접미사
  (`.wip.` `.done.` `.stale.`)와 위치가 곧 상태. `ls` 한 번이 진행 보고서다.
- **트리는 재귀다.** 커밋 1개로 안 끝나는 카드는 같은 번호의 폴더로 승격되어
  계속 쪼개진다 (`02.3` → `02.3.1`). 몇 층이든 같은 규칙.
- **진행 로그는 작업 카드 안에 산다.** 세션이 언제 죽어도 카드만 읽으면 이어받는다.
- **1 작업 = 1 커밋.** 검증 통과 후에만. 되돌리기 = revert 하나.
- **핸드오프는 휘발성만.** 위치·진행률은 트리가 답하므로 `HANDOFF.md`는 함정·배운 것만.
- 모델은 등급(T-상/중/하)으로만 기술, 실제 모델은 split의 실행 제안에서 그때그때 선택.
- 규칙의 정본은 `skills/principles/SKILL.md` 하나, 개발 이력의 정본은 `DEVLOG.md` 하나다.

## 이름 충돌과 접두사

스킬이 많아지면 `/product` 같은 짧은 이름은 반드시 겹친다. 도구별 동작:

- **Claude Code**: 플러그인 이름이 네임스페이스다 — `/nano-devflow:product` 형태는
  언제나 동작하고 충돌 불가능. (이름이 유일하면 `/product`도 동작하지만, 겹치는 순간
  Claude가 자동으로 네임스페이스 형태를 요구한다. 항상 `/nano-devflow:` 로 치는 것을 권장.)
- **Codex**: 프롬프트 파일명이 곧 명령이라, 설치 스크립트가 처음부터
  `/nano-devflow-product` 형태로 생성한다. 충돌 원천 차단.

`/nano-devflow` 까지만 쳐도 자동완성에 스킬 전체가 모여 보인다.

## 설치 — Claude Code

```
/plugin marketplace add D:/Projects/Private/nanomia/nanomia-skills/devflow
/plugin install nano-devflow@nanomia
```

스킬 8개 + 에이전트 2개(reviewer·verifier) + SessionStart 훅이 설치된다.
훅은 `devflow/tree/`가 있는 프로젝트에서만 동작하고, 세션 시작·재개·**컨텍스트 압축 직후**에
트리 상태와 HANDOFF를 자동 주입한다 (그래서 resume을 안 쳐도 재개된다).

> 훅이 하나뿐인 이유: 진행 로그를 매 단계 디스크에 쓰는 규약 덕에 PreCompact 보호가
> 불필요하고, Stop 훅은 매 턴 발화라 소음이다. SessionStart 하나로 충분하다.

## 설치 — Codex CLI

```powershell
# Windows
powershell -File D:/Projects/Private/nanomia/nanomia-skills/devflow/codex/install.ps1
```
```sh
# macOS/Linux
sh /path/to/devflow/codex/install.sh
```

`~/.codex/prompts/`에 `/nano-devflow-*` 명령 7개가 생성된다. 규칙 정본은 각 프롬프트에
동봉된다(Codex 프롬프트 폴더는 평면이라 파일 간 참조가 불안정하기 때문).
훅 대신 `codex/AGENTS-devflow.md` 블록을 프로젝트 `AGENTS.md`에 추가하면
세션 시작 시 재개 동작이 걸린다.

**스킬을 수정했으면 설치 스크립트를 다시 실행한다** (프롬프트는 생성물이다).

## 다른 에이전트 (Cursor, Copilot, opencode 등)

`skills/<이름>/SKILL.md` 구조는 [skills.sh](https://skills.sh) CLI의 표준 형식이라,
이 폴더를 GitHub에 올리면 `npx skills add <owner>/<repo>` 한 번으로 20여 개 에이전트에
설치된다. 규칙 정본을 skills/ 안(principles 스킬)에 둔 것도 이 때문이다 —
스킬 폴더만 복사하는 설치기에서도 정본이 함께 이동한다.

## 사용

| 상황 | 진입점 |
|---|---|
| 새 프로젝트 | product 부터 순서대로 |
| 기존 프로젝트에 도입 | arch (코드에서 역산) → split |
| 기능 추가·고도화 | split |
| 새 세션에서 이어하기 | 자동 (훅) 또는 resume |

프로젝트에 생기는 파일:

```
devflow/
  project/          product.md · arch.md · design.md · code-style.md · glossary.md · decisions/
  tree/             작업 트리 = 진행 상태의 정본 (재귀 폴더 구조)
  HANDOFF.md        휘발성 인계 (매번 덮어씀)
  journal.md        작업을 가로지르는 결정, append-only
```

## 구조

```
devflow/
  DEVLOG.md              이 플러그인 자체의 개발 기록·핸드오프. 수정 전 통독, 수정 후 append
  skills/<name>/SKILL.md 스킬 8개 (principles 포함. Claude가 그대로 쓰고, Codex 프롬프트의 소스)
  agents/                reviewer(커밋 전 코드 검토)·verifier(실행 검증) — Claude 전용
  hooks/ + scripts/      SessionStart 훅
  codex/                 Codex 설치 스크립트 + AGENTS 블록
  .claude-plugin/        plugin.json + marketplace.json
```
