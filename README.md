# nano-devflow

기획 → 구현 → 검증을 잇는 개발 흐름 스킬. Claude Code와 Codex CLI를 모두 지원한다.

AI 세션은 매번 기억을 잃고 시작한다. nano-devflow는 그 기억을 **대화가 아니라 디스크에**
쌓는다 — 무엇을 만드는지(문서), 어디까지 왔는지(파일 트리), 왜 그렇게 정했는지(기록).
어느 세션이 언제 죽어도, 다음 세션은 파일만 읽고 이어받는다.

## 흐름 한눈에

```
Layer 0 · 프로젝트 정의 (1회, 또는 기존 코드에서 역산해 상속)
   product ──▶ arch ──▶ [ design ]        ← design은 프론트엔드 있을 때만

Layer 1 · 작업 루프 (반복)
   split(쪼개기) ──▶ work(구현) ⇄ verify(검증)

공통: resume (재개) · principles (규칙 정본)
```

| 상황 | 진입점 |
|---|---|
| 새 프로젝트 | product 부터 순서대로 |
| 기존 프로젝트에 도입 | arch (코드에서 역산) → split |
| 기능 추가·고도화 | split |
| 새 세션에서 이어하기 | 자동 (훅) 또는 resume |
| 팀원 합류 | 방 만들기 — 아래 "다중 모드" |

## 핵심 설계 — 왜 이렇게 만들었나

- **진행 상태는 문서가 아니라 파일 트리다.** `devflow/tree/`의 파일명 접미사
  (`.wip.` `.done.` `.stale.`)와 위치가 곧 상태. `ls` 한 번이 진행 보고서다.
  문서에 적힌 진행률은 반드시 낡지만, 파일명은 상태가 바뀔 때만 바뀐다.
- **작업 카드가 브리핑의 전부다.** 카드 한 장에 목적지·왜·금지·완료 신호가 담기고,
  진행 로그도 카드 안에 산다. 세션이 언제 죽어도 카드만 읽으면 이어받는다.
- **실행하지 않은 것은 통과가 아니라 미검증이다.** 완료 신호는 실제로 실행하고,
  검토자(reviewer)는 읽기만, 검증자(verifier)는 실행만 한다 — 서로 침범하지 않는다.
- **1 작업 = 1 커밋.** 완료 신호·검토 통과 후에만. 되돌리기 = revert 하나.
- **측정된 답은 문서로 돌아간다(환류).** 추측으로 적은 값은 arch의 잠정값 표에 해소
  카드 번호와 함께 살고, 실측되면 교체된다. 낡은 문서가 실측을 이기는 일을 막는다.
- **핸드오프는 부스러기만.** 위치·진행률은 트리가, 과정은 진행 로그가 답하므로
  HANDOFF에는 함정·배운 것·열린 결정만 남는다. 넷 다 비면 빈 파일이 정상.
- 모델은 등급(T-상/중/하)으로만 기술, 실제 모델은 split의 실행 제안에서 그때그때 선택.
- 규칙의 정본은 `skills/principles/SKILL.md` 하나, 개발 이력의 정본은 `DEVLOG.md` 하나다.

## 두 모드 — 솔로와 다중

devflow는 **모드를 파일 존재로 판별한다** (설정도, 플래그도 없다):

```
devflow/users/*/owner.md 가 하나라도 있으면  →  다중 모드
하나도 없으면                              →  솔로 모드 (아래 다중 규칙은 전부 무시됨)
```

### 솔로 모드 (기본)

혼자 쓰는 경우. 지금까지의 devflow 그대로이며 아무것도 새로 배울 것이 없다.

### 다중 모드 — 한 저장소를 여러 사람이 쓸 때

전제: 팀 전원이 devflow를 쓸 필요는 없다. **쓰는 사람들끼리 충돌하지 않고,
안 쓰는 사람들의 작업도 따라잡는** 구조다. 분할의 축은 사람이 아니라 **진실의 범위**다:

```
devflow/
  project/          ← 공유 진실 — 서비스는 하나, 문서도 하나 (표류·중복 구현 원천 차단)
  tree/             ← 공유 장부 — 프로젝트의 일은 하나의 목록. 점유만 이름표를 단다
  journal.md        ← 공유 결정 — 날짜·id 기명 한 줄씩
  users/<id>/       ← 개인 방 — owner.md(신원) · HANDOFF.md(내 인계) · digest.md(소화 마커)
```

핵심 개념 네 가지:

- **점유(claim)** — 카드를 `.wip-<내 id>.`로 rename하는 커밋. 그때부터 그 카드는 내 것,
  남의 점유 카드는 읽기 전용. 완료되면 이름표 없는 `.done.`이 된다 (소유는 git이 기억).
- **방(room)** — 내 세션 상태의 거처. 자기 방에만 쓰고, 방은 팀 전체가 읽는다.
- **소화(digest)** — 남들(devflow를 안 쓰는 팀원 포함)의 커밋을 따라잡는 절차.
  내 마커 이후의 남의 커밋을 훑고, 공유 문서와 어긋나면 문서를 고친다.
  한 사람이 소화하면 결과가 공유 문서에 남아 전원이 수혜받는다.
- **구속 결정(binding decision)** — 공유 문서·트리 구조·남의 카드에 영향을 주는 결정.
  기능 작업에 실어 보내지 않고 즉시 통합 브랜치에 착지시킨다.

일상에서 늘어나는 습관은 둘뿐이다: 새 카드를 점유하기 전에 **당겨오고 소화한다**,
점유는 **rename 커밋**으로 한다. 나머지는 솔로와 같다.

### 모드 전환 — 전부 커밋 1개

```
팀원 합류        방 만들기(owner.md) + 마커 = 현재 HEAD. 끝.
                 (질문은 최대 1개 — git 신원이 등록에 없을 때 id를 묻는 것뿐)
솔로 → 다중      방 생성 + HANDOFF를 방으로 이동 + .wip. → .wip-<id>. + 마커 = HEAD
다중 → 솔로      (마지막 1인) HANDOFF 복귀 + users/ 삭제 + 접미사 원복
팀원 이탈        (사용자 선언 후) 남은 누구든: 열린 결정을 journal로 승격 → 방 삭제
```

전환이 덜 끝난 상태(다중 모드인데 무기명 `.wip.`이나 루트 HANDOFF가 남음)는 훅과
정합성 점검이 감지해 알려준다 — 조용히 잘못되는 일은 없다.

owner.md는 두 줄이다:

```
id: jmp
git: "Jaemin Park", jmp@example.com
```

세션은 git 신원으로 자기 방을 자동으로 찾는다. 신원을 해석 못 하는 세션(CI·봇)은
읽기만 한다.

## 이름 충돌과 접두사

스킬이 많아지면 `/product` 같은 짧은 이름은 반드시 겹친다. 도구별 동작:

- **Claude Code**: 플러그인 이름이 네임스페이스다 — `/nano-devflow:product` 형태는
  언제나 동작하고 충돌 불가능. 항상 `/nano-devflow:` 로 치는 것을 권장.
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
다중 모드에서는 내 점유·남의 점유를 구분해 주입하고, 신원 미해결·전환 미완도 경고한다.

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

`~/.codex/prompts/`에 `/nano-devflow-*` 명령 7개가 생성되고, **Codex 네이티브
SessionStart 훅이 `~/.codex/hooks.json`에 등록된다** — Claude와 같은 스크립트
(`scripts/session-start.js`)가 양쪽에서 돌아 세션 시작 시 트리 상태가 자동 주입된다.
전제: `~/.codex/config.toml`에 `[features] hooks = true` (설치기가 검사해서 없으면 안내).
규칙 정본은 각 프롬프트에 동봉된다(Codex 프롬프트 폴더는 평면이라 파일 간 참조가
불안정하기 때문). 훅을 못 쓰는 환경에서만 `codex/AGENTS-devflow.md` 블록을 프로젝트
`AGENTS.md`에 폴백으로 추가한다.

**스킬을 수정했으면 설치 스크립트를 다시 실행한다** (프롬프트는 생성물이다).

## 다른 에이전트 (Cursor, Copilot, opencode 등)

`skills/<이름>/SKILL.md` 구조는 [skills.sh](https://skills.sh) CLI의 표준 형식이라,
이 폴더를 GitHub에 올리면 `npx skills add <owner>/<repo>` 한 번으로 20여 개 에이전트에
설치된다. 규칙 정본을 skills/ 안(principles 스킬)에 둔 것도 이 때문이다 —
스킬 폴더만 복사하는 설치기에서도 정본이 함께 이동한다.

## 프로젝트에 생기는 파일

```
devflow/
  project/          product.md · arch.md · design.md · code-style.md · glossary.md · decisions/
  tree/             작업 트리 = 진행 상태의 정본 (재귀 폴더 구조)
  HANDOFF.md        휘발성 인계, 매번 덮어씀 (다중 모드: 각자 방 안에)
  journal.md        작업을 가로지르는 결정 한 줄씩 — 능력이 닫힐 때 정리됨
  users/<id>/       (다중 모드만) 개인 방
```

트리는 재귀다 — 커밋 1개로 안 끝나는 카드는 같은 번호의 폴더로 승격되어 계속 쪼개진다
(`02.3` → `02.3.1`). 몇 층이든 같은 규칙이고, 검증 의식은 깊이와 무관하게 1층에서만 연다.

## 저장소 구조 (이 플러그인 자체)

```
devflow/
  DEVLOG.md              이 플러그인 자체의 개발 기록·핸드오프. 수정 전 통독, 수정 후 append
  skills/<name>/SKILL.md 스킬 8개 — 영문 배포 실물. 한글 설계 원본은 SKILL_ko.md
                         (수정은 _ko 먼저 → 검토 → 번역. 절차는 DEVLOG 참조)
  ko/                    에이전트 한글 원본 (agents/에 두면 이중 등록되므로 분리)
  agents/                reviewer(커밋 전 코드 검토)·verifier(실행 검증) — Claude 전용
  hooks/ + scripts/      SessionStart 훅 (Claude·Codex 공용)
  codex/                 Codex 설치 스크립트 + AGENTS 폴백 블록
  .claude-plugin/        plugin.json + marketplace.json
```
