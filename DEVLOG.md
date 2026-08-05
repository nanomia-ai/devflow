# DEVLOG — nano-devflow 개발 기록

**이 파일은 스킬 자체의 핸드오프다.** 어느 세션·어느 AI가 이 플러그인을 수정하든:
① 수정 전에 이 파일을 통독한다 ② 수정 후 맨 아래 변경 로그에 항목을 append한다
(날짜 / 무엇을 / 왜 / 어느 파일). 로그 없는 수정은 미완성 수정이다.

## 왜 만들었나

사용자(jmp)가 AI와의 개발 전 과정(기획→구현→검증)을 관리하기 위해 설계했다.
2026-08-05, 사용자와 v0 → v6 여섯 차례 왕복하며 개념을 확정한 뒤 구현했다.

핵심 철학 — 모든 수정은 이 기조를 지켜야 한다:

1. **풍부한 방향성 + 최소 하네스.** 최신 상위 모델은 방법을 안다. 목적지와 금지만 명확히
   주고 방법은 지시하지 않는다. 하네스는 모델 등급에 반비례해서만 강화한다.
2. **지식은 적지 않는다, 취향은 적는다.** 모델이 이미 아는 보편 원칙(인젝션 방어법 등)을
   적는 것은 세금이다. 이 프로젝트가 무엇을 우선하는지(선언)만 적는다.
3. **진행 상태는 문서가 아니라 파일 트리다.** 파일명 접미사(.wip./.done./.stale.)와
   위치가 정본. 문서에 진행률을 적으면 반드시 낡는다.
4. **1개념 1단어.** 스킬 이름 = 산출물 이름 = 그 개념의 유일한 단어.

## 구조 한눈에

```
Layer 0 (1회·상속): product → arch → [design]     Layer 1 (반복): split → work ⇄ verify
공통: resume, principles(규칙 정본)
대상 프로젝트에 생기는 것: devflow/{project/, tree/, HANDOFF.md, journal.md}
배포: Claude 플러그인(.claude-plugin) + Codex 프롬프트 생성(codex/install.*)
```

## 주요 결정과 이유 (뒤집으려면 이유부터 반박할 것)

| 결정 | 이유 |
|---|---|
| 산출 폴더명 `devflow/` (docs/ 아님) | 기존 프로젝트의 docs/와 충돌 방지 |
| 접두사 nano-devflow (Claude `:`, Codex `-`) | 스킬 이름 충돌 원천 차단, 자동완성 그룹핑 |
| 규칙 정본이 skills/principles/ 안에 있음 | skills.sh 표준(skills/만 복사하는 설치기)에서도 정본이 함께 이동 |
| Codex 프롬프트에 정본 동봉(파일 참조 아님) | Codex 프롬프트 폴더는 평면이라 상대 참조 불안정 |
| 훅은 SessionStart 하나만 | Stop은 매 턴 발화라 소음, PreCompact는 "진행 로그가 항상 디스크에" 규약으로 불필요. SessionStart는 압축 직후에도 발화해 셋을 겸한다 |
| 모델명을 파일에 안 적음 (T-상/중/하 등급만) | 모델명은 반드시 낡는다. 매핑은 split 실행 제안에서 세션 단위 결정 |
| worktree 전면 폐기 | 병렬용: 코어 수정이 흔해 조율·병합 비용 > 병렬 이득. 전시용: 사용자가 "작업 중 화면 깨져도 무방" 확인 → 이점 소멸 |
| TDD 절차 미채택 | 완료 신호 + "실행 없으면 미검증" + 커밋 규율이 TDD의 효과를 의식 없이 확보 |
| 1 작업 = 1 커밋 (검증 통과 후) | 되돌리기 = revert 하나, git log = 작업 이력, 작업 경계 = 핸드오프 지점 |
| 트리 소급 기록 금지 (브라운필드) | 기존 기능을 .done 카드로 채우는 것은 낭비. 트리는 도입 이후만 |
| 정합성 점검은 보고만, 자동 교정 금지 | 자동 교정이 오판하면 오염 가속 |
| 스킬 상호참조는 슬래시 없는 단계명 | 실제 명령이 도구마다 다름(/nano-devflow:x vs /nano-devflow-x) |
| install.ps1은 UTF-8 **BOM** 필수 | PS 5.1이 BOM 없으면 ANSI 파싱 → 한글 스크립트 파손 (실제 재현함) |

맷 포콕 skills 저장소에서 차용한 것: 조사 카드(prototype+wayfinder의 증류),
ADR 3조건(domain-modeling), 검증 이중축(code-review), code-style 지향 절의 가치 선언 일부
(codebase-design·tdd에서 절차를 빼고 취향만). **차용하지 않기로 한 것**: 어휘 강제,
Red-Green 절차, 냄새 12종 목록, 3에이전트 병렬 설계. 사용자 규칙: 이 저장소에서
추가 차용 시 반드시 사전 허락.

## 이중 언어 워크플로 (v0.5.0부터 — 모든 수정이 이 절차를 따른다)

**설계는 한글로, 배포는 영문으로.** 사용자가 검토할 수 있는 언어가 한글이고,
AI가 가장 잘 이해하고 토큰을 적게 쓰는 언어가 영문이기 때문이다.

```
정본 관계:  *_ko.md = 설계 원본 (사용자 검토용)  →  번역  →  영문 = 배포 실물 (AI 소비용)
파일 배치:  skills/<name>/SKILL_ko.md ↔ SKILL.md
           ko/reviewer_ko.md ↔ agents/reviewer.md   ← 에이전트 한글판은 agents/ 밖!
           codex/AGENTS-devflow_ko.md ↔ AGENTS-devflow.md
```

⚠ **에이전트 한글판을 agents/에 두면 안 된다** — agents/ 안의 모든 .md가 에이전트로
등록되어 같은 이름이 이중 등록된다. 그래서 ko/ 폴더에 있다.

수정 절차 (순서 고정):
1. `_ko` 파일을 먼저 수정한다 → 사용자 검토
2. 영문 파일에 번역 반영. **의미 변조 절대 금지** — 아래 용어 대역표를 강제 사용
3. 구조 대조 검증: 헤딩 수·번호 목록 수·수치(%, 개수, 번호 형식)가 한↔영 1:1인지 확인
4. Codex 재생성(install 스크립트) + DEVLOG 로그 append

용어 대역표 (고정 — 다른 번역어 금지):

| 한글 | 영문 | | 한글 | 영문 |
|---|---|---|---|---|
| 규칙 정본 | canonical rules | | 능력 | capability |
| 작업 카드 | task card | | 골조 | foundation |
| 목적지 | Destination | | 왜 | Why |
| 금지 | Forbidden | | 완료 신호 | completion signal |
| 의존 | Depends | | 읽을 것 | Read first |
| 등급 T-상/중/하 | Tier T-high/T-mid/T-low | | 좌표 | Coordinates |
| 정체성 | Identity | | 검증 창구 | verify channel |
| 조사 카드 | research card | | 실행 제안 | execution proposal |
| 정합성 점검 | integrity check | | 문서 계층 | document hierarchy |
| 실패 사다리 | failure ladder | | 진행 로그 | progress log |
| 승격 | promotion | | 사고량 | reasoning effort |
| 지향 | Values | | 이 프로젝트의 선택 | Project choices |
| 신뢰 경계 | Trust boundary | | 하지 않는 것 | Non-goals |
| 미검증 | unverified | | 통과/실패 | pass/fail |

한글이 남아도 되는 곳: DEVLOG(이 파일), README, `_ko` 파일들, 설치 스크립트의 echo(사람용).
한글이 남으면 안 되는 곳: skills/*/SKILL.md, agents/*.md, codex/AGENTS-devflow.md,
scripts/*.js 의 주입 문자열. 검사: `grep -c '[가-힣]' <배포 파일들>` → 전부 0.

## 보류 중 (다음 버전 후보)

- 버그 진단 스킬 — 맷의 diagnosing-bugs("재현 루프가 스킬의 전부, 나머지는 기계적")를
  청사진으로. 한 사이클 실전 후 재평가.
- 트리 아카이브 규칙 — 유지보수 장기화로 트리가 수백 파일이 되면. 그 전엔 YAGNI.
- GitHub 공개 + `npx skills add` 지원 — 구조는 이미 호환.

## 현재 상태

v0.3.0 (2026-08-05). 스킬 8개 + verifier 에이전트 + SessionStart 훅 + Codex 설치기 완성.
설치·훅·생성 스크립트는 격리 환경에서 테스트 통과. **실전 프로젝트 적용은 아직 0회** —
첫 사이클에서 나오는 마찰이 다음 버전의 입력이다.

---

## 변경 로그 (append-only)

### 2026-08-05 v0.1.0
최초 구현. 스킬 7개(product/arch/design/split/work/verify/resume), 훅 1개, Codex 설치기.

### 2026-08-05 v0.2.0
- 접두사 도입: 플러그인 nano-devflow, Codex 명령 nano-devflow-*
- PRINCIPLES.md → skills/principles/SKILL.md 이동 (skills.sh 호환)
- split에 재귀 분할 절(카드→폴더 승격, 02.3.1 번호), arch에 브라운필드 역산 절차
- 교차도구 결함 수정: 스킬 상호참조를 단계명으로, install.ps1 BOM, verifier 도구 제한 해제

### 2026-08-05 v0.6.0
- **Codex 네이티브 SessionStart 훅 지원** — 리서치(서브에이전트 2개, Sonnet)로 확인:
  Codex CLI v0.124.0+에 Claude와 거의 1:1인 훅 시스템 존재 (`~/.codex/hooks.json`,
  같은 JSON 스키마, `hookSpecificOutput.additionalContext` 주입, `[features] hooks = true` 필요).
  이전 "Codex엔 훅이 없다" 판단은 오류였다 — 조사한 유명 이중 지원 플러그인들
  (mattpocock/skills, obra/superpowers, vercel-labs/skills)이 전부 훅 이전 설계라 안 써서 생긴 착시.
- `scripts/install-codex-hook.js` 신설 — hooks.json에 idempotent 병합(타 도구 항목 보존),
  feature flag 검사. 설치기 양쪽에서 호출. **같은 session-start.js가 Claude·Codex 양쪽을 서빙.**
- AGENTS-devflow 블록은 폴백으로 강등 (훅 불가 환경 전용)
- 향후 옵션(미적용): Codex는 `~/.codex/skills`도 네이티브 스캔 — 프롬프트 대신 스킬 설치 경로 가능.
  스킬별 `agents/openai.yaml` 사이드카로 Codex UI 메타데이터 제공 가능 (mattpocock 패턴)

### 2026-08-05 v0.5.0
- **영문화**: 배포 실물(스킬 8·에이전트 2·AGENTS 블록·훅 주입 문자열)을 영문으로 전환.
  한글 원본은 `_ko` 접미사로 보존 (에이전트 한글판만 ko/ — 이중 등록 방지)
- 이중 언어 워크플로 + 용어 대역표를 이 파일에 명문화 (위 절)
- 검증: 한↔영 헤딩 수·번호 목록 수·핵심 수치 1:1 일치 확인, 배포 파일 한글 0건,
  Codex 재생성 통과
- git 리포 초기화. v0.4.0(한글판)이 첫 커밋 — 번역 전 원형이 이력에 보존됨

### 2026-08-05 v0.4.0
- **reviewer 에이전트 신설** — 커밋 전 코드 검토 (의도·논리·범위 3판정).
  verifier와 이원화: reviewer는 읽되 실행 안 함(화이트박스), verifier는 실행하되 안 읽음(블랙박스).
  근거: 완료 신호 통과 ≠ 의도 부합 — 신호가 안 덮는 경로의 결함을 아무도 안 읽던 구멍.
- work 루프에 검토 단계(완료 신호와 커밋 사이), 조사 카드는 생략, T-상 낮은 사고량 권장
- split 실행 제안에 "검토 생략" 옵션(기본은 검토), verify 층 표 갱신

### 2026-08-05 v0.3.1
- 문서 오염·화석화 방어 2줄 (principles 문서 계층): 코어 문서는 절차·스킬 재실행으로만 수정 /
  수정은 대체가 기본("자라기만 하는 문서는 죽은 문서다")
- 용어 정렬: split "강한 카드" → "완전한 카드" (1개념 1단어), work 병렬 조건 문구를 split과 통일

### 2026-08-05 v0.3.0
- 산출 폴더 `docs/` → `devflow/` 전면 교체 (기존 프로젝트 docs/ 충돌 방지)
- principles에 문서 계층(상향 전파 4단계 + 갱신 판정표), 정합성 점검 5항목 신설
- arch: ADR 3조건 교체, code-style.md 산출 추가(지향 7줄 기본), 브라운필드에 흐름 추적·스타일 역산
- split: 시작 조건 게이트(product.md 없으면 중단), 여는 층 선언, 조사 카드, 수정 요청 라우팅(.done 해제 규칙)
- work: code-style 읽기 + 구현 전 기존 코드 확인 + 문서 계층 연결
- verify: 능력층에 경계(악성 입력)·표준(code-style) 축 추가
- 훅: devflow/ 경로, 번호 중복·다중 wip 경고
- DEVLOG.md(이 파일) 신설
