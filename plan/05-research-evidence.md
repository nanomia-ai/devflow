---
title: Reference and host research evidence
status: reviewed-evidence
purpose: Record the evidence used by the plan without turning reference implementations into requirements.
read_when: Read when challenging a design premise, packaging choice, hook strategy, or claimed failure lesson.
canonical_for: Planning evidence and explicitly unproven host assumptions.
tags: [devflow-vnext, research, legacy, jgnote, claude, codex]
---

# 레퍼런스·호스트 조사 근거

## 1. 근거 사용 원칙

- 레거시 Devflow는 실패 장면과 고려했던 문제를 찾는 자료이지 새 구조의 기준선이 아니다.
- 중개노트는 실제로 잘 작동하는 사례지만 특정 monorepo와 제품의 세부 규칙을 일반화하지 않는다.
- 공식 Claude/Codex 문서는 현재 host 기능의 근거다. 문서가 말하지 않는 조합은 실제 설치로 검증한다.
- build, hash, schema 검사는 전달·정합성 증거다. AI가 이해하고 행동했다는 효과 증거가 아니다.

## 2. 레거시 Devflow 관찰

관찰 위치: 설치 캐시의 `nanomia/devflow` v0.25.1과 동일 commit의 새 clone.

### 보존할 문제의식

- `adopt`, `product`, `arch`, `design`, `direct`, `work`, `verify`, `resume`의 사용자 의미는 구분 가치가 있다.
- Product/Architecture/Design과 runtime work state를 분리하려는 시도는 타당하다.
- 도메인 지식, 결정 이유, 인덱스, 문서 헤더, 팀 handoff, 중단 복구는 실제 장기 작업에서 필요한 관심사다.
- SessionStart가 값싼 eligibility와 짧은 pointer만 제공하고 route/state 판단을 하지 않는 방향은 적절하다.

### 새 체계로 가져오지 않을 구조

- stage마다 복제된 Skill Rails runtime과 vendor code
- 모든 stage에 공통으로 강제되는 Decision/effect/record/align/reinvoke 절차
- line grammar, commit, state transition, retry, publish, room, capsule을 한 흐름에 결합한 상태 기계
- 최초 Adopt에서 모든 유지 자료와 완전한 지식 기준선을 요구하는 완료 조건
- 역할 brief·wrapper·전달 자동화를 실제 cold-use 효과보다 먼저 확대하는 방식

### 실증적으로 남은 경고

- 긴 always-read entry는 tool output과 attention 한계를 넘는다.
- 여러 중간 산출물에 나눠 적는 부수 의무는 선택적으로 누락된다.
- 역할 계약 파일과 inline brief 모두 복제를 다른 위치로 옮길 수 있다.
- 구조 검증을 통과해도 first reader, stale handoff, 실제 역할 도달은 미검증일 수 있다.

## 3. 중개노트 성공 사례 관찰

읽은 핵심 소유자:

- `docs/README.md`: 질문별 문서 라우팅과 파생 색인 경계
- 중개노트 문서 루트의 `PRODUCT.md`: 제품 목적·사용자·도메인 의미·제품 불변식
- 중개노트 문서 루트의 `ARCHITECTURE.md`: 관할별 권위, 조건부 상세 문서, 배치·의존·registry
- `docs/specs/*-handoff.md`: 기능별 현재 의도·실제 seam·검증·예외
- `docs/adr/`: 결정 이유, 기각 대안, 폐기·재검토 조건
- `docs/domains/registry.json`: 구현 상태, 공개 진입점, 허용 edge와 검증 명령

### 일반화할 원리

1. 문서들은 전역 우선순위가 아니라 서로 다른 질문을 소유한다.
2. 루트 지도는 상세 지식을 복사하지 않고 읽기 경로만 준다.
3. 도메인은 메뉴·폴더 크기가 아니라 업무 상태와 규칙의 소유자다.
4. 현재 구현 사실은 선언만이 아니라 코드·테스트·registry와 연결된다.
5. 생성 지도는 검색 비용을 낮추는 파생물이며 직접 수정하지 않는다.
6. 현재 진실과 작업 중 추론을 분리해 과거 계획이 현재 규칙과 경쟁하지 않는다.

여기서 일반화하는 것은 `docs/`라는 물리 경로가 아니라 **질문별 소유권, 얕은 진입 지도, 조건부
읽기, 현재 진실과 임시 작업의 분리**다. 새 Devflow에서는 이 원리를 `.devflow/` 내부에 배치한다.

## 3.1 기존 Devflow 결정에서 다시 확인한 경계

이번 교정은 저장소의 유효 결정과도 일치한다.

- DD-98: 대상 프로젝트의 정본 루트는 `.devflow/` 하나다.
- DD-108: Adopt는 지식 소유권을 이전하며 흡수 입력은 영구 프로젝트 의존성이 아니다.
- DD-77: 문서는 현재만 말하고 같은 개념은 같은 자리에서 교체하며 과거 판본은 Git이 맡는다.
- DD-103·104: 지식 단위는 함께 읽고 같은 이유로 바꾸는 경계이며 의미 소유자별 작성자가 현재 위치를 유지한다.

따라서 외부 `docs/` 정본 + `.devflow/` 작업 상태라는 이전 수렴안은 성공 사례의 원리를 경로까지 복제해
Devflow 자신의 단일 루트·흡수 원칙을 어긴 것으로 판정했다.

### 일반화하지 않을 특수성

- MUI/seed-design, TanStack, Cloudflare, Postgres/R2와 main/admin 분리
- 중개노트 registry의 모든 필드와 backend admission 규칙
- 고위험 auth 기능에서 필요한 300줄 규모 handoff를 모든 기능의 기본 형식으로 삼는 것
- 성숙한 monorepo의 architecture checker를 초기 범용 Devflow에 바로 이식하는 것

## 4. Claude와 Codex의 공식 배포·훅 근거

조사 기준일: 2026-09-16.

### 확인된 사실

| 항목 | Claude Code | OpenAI Codex |
|---|---|---|
| npm 배포 | marketplace plugin source로 npm package를 설치할 수 있다. | marketplace entry가 npm package/version/registry를 지원한다. |
| plugin identity | `.claude-plugin/plugin.json`과 plugin root의 `skills/`, `hooks/`가 공식 구조다. | portable root `plugin.json`이 권장되고 OpenAI 설정은 `extensions.com.openai`가 소유한다. `.codex-plugin/plugin.json`은 호환 fallback이다. |
| skill 발견 | project/user/plugin scope를 지원하고 body는 사용 시 로드된다. | repo의 `.agents/skills`를 CWD부터 repo root까지, user/system 위치와 함께 탐색한다. |
| SessionStart | session 시작·재개에 실행하며 stdout/additionalContext를 context에 넣을 수 있다. | `startup`, `resume`, `clear`, `compact` source를 지원하고 additionalContext를 developer context로 넣는다. |

### 설계 판정

- npm은 하나의 배포 채널로 사용한다.
- 공통 본체는 portable skills와 source artifact로 유지한다.
- Claude adapter의 `.claude-plugin/plugin.json`은 현재 공식 구조이므로 제거 목표가 아니다.
- Codex는 root `plugin.json`과 `extensions.com.openai.hooks`를 우선하고 `.codex-plugin` fallback은 실제 호환 필요가 있을 때만 둔다.
- SessionStart는 설치나 correctness의 전제가 아니다. 활성 프로젝트에서 짧은 entry pointer를 주는 편의 기능으로만 둔다.
- 긴 정적 지침을 매 session에 주입하지 않는다. skill description과 project index가 선택적 진입을 담당한다.

### 미검증

- root portable manifest와 Claude manifest를 같은 npm artifact에 넣은 실제 host 조합
- Claude가 portable root manifest만으로 identity와 hook을 모두 인식하는지 여부
- 각 host의 marketplace 설치 후 새 session에서 plugin/hook이 활성화되는 정확한 사용자 경험
- SessionStart pointer가 없는 경우와 있는 경우의 fresh-agent 행동 차이

이 항목들은 패키지 구조를 더 복잡하게 만들어 추측으로 해결하지 않는다. 출시 전 최소 설치 실험으로 판정한다.

## 5. 공식 출처

- [OpenAI — Package your plugin](https://developers.openai.com/plugins/build/plugins)
- [OpenAI — Hooks](https://learn.chatgpt.com/docs/hooks)
- [OpenAI — Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Anthropic — Create plugins](https://code.claude.com/docs/en/plugins)
- [Anthropic — Plugins reference](https://code.claude.com/docs/en/plugins-reference)
- [Anthropic — Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Anthropic — Skills](https://code.claude.com/docs/en/skills)
- [Anthropic — Hooks reference](https://code.claude.com/docs/en/hooks)

## 6. 근거 상태

| 주장 | 상태 |
|---|---|
| 레거시 구조가 크고 반복 runtime·절차를 stage마다 포함한다 | proven by repository inspection |
| 중개노트의 관할 분리·routing·registry 검사가 현재 저장소에서 작동한다 | proven by source inspection and repository checks |
| npm source와 각 host의 plugin/hook 구조가 공식 지원된다 | proven by current official documentation |
| 제안한 vNext 문서 트리가 fresh AI의 읽기 비용과 오류를 줄인다 | unproven until pilot |
| 짧은 SessionStart pointer가 실제 재개 성공률을 높인다 | unproven until paired observation |
| domain 중심이 glossary/capability 중심보다 장기 유지에 우월하다 | supported design hypothesis; must be observed in project/change/adopt pilots |
