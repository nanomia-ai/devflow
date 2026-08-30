# devflow 설계 문서 — 왜 이렇게 만들었나

이 문서는 devflow의 **"왜"의 정본**이며, 모든 변경에서 항상 읽히는 한 층이다.
정체성과 철학, 건드리면 안 되는 불변식, 그리고 전체 구조 지도가 여기 있다.
결정의 전문과 기각 계보는 `design-decisions_ko.md`가 소유하고 그 색인은 원문에서
생성한다(아래 「결정 색인」). 관찰 항목과 보류 후보는 `design-backlog_ko.md`에 있고,
다른 문서들이 각각 무엇을 소유하고 언제 읽히는지는 아래 「문서 지도」가 정한다.

**여기 기록된 결정을 뒤집으려면, 기록된 이유부터 반박해야 한다.**
기각된 안을 재제안하려면, 기록된 기각 사유부터 반박해야 한다.
이유 반박이 없는 번복·재제안은 검토를 통과하지 못한다.

## 기원과 철학

사용자(jmp)가 AI와의 개발 전 과정(기획→구현→검증)을 관리하기 위해 설계했다.
2026-08-05, 사용자와 v0 → v6 여섯 차례 왕복하며 개념을 확정한 뒤 구현했다.

핵심 철학 — 모든 수정은 이 기조를 지켜야 한다:

1. **풍부한 방향성 + 최소 하네스.** 최신 상위 모델은 방법을 안다. 목적지와 금지만 명확히
   주고 방법은 지시하지 않는다. 하네스는 모델 등급에 반비례해서만 강화한다.
2. **지식은 적지 않는다, 취향은 적는다.** 모델이 이미 아는 보편 원칙(인젝션 방어법 등)을
   적는 것은 세금이다. 이 프로젝트가 무엇을 우선하는지(선언)만 적는다.
3. **진행 상태는 문서가 아니라 파일 트리다.** 파일명 접미사(.wip./.done./.stale.)와
   위치가 정본. 문서에 진행률을 적으면 반드시 낡는다. 작업 진행은 접미사와 진행 로그가
   소유하고, 규칙 정본이 형식을 고정한 journal·verify.md 상태 줄은 전이 상태일 뿐 진행
   기록이 아니며, 문서에는 여전히 진행을 적지 않는다.
4. **1개념 1단어.** 스킬 이름 = 산출물 이름 = 그 개념의 유일한 단어.

## 구조 한눈에

```
Layer 0 (1회·상속): product → arch → [design] · 기존 코드는 adopt가 역산     Layer 1 (반복): split → work ⇄ verify
공통: resume, principles(규칙 정본)
대상 프로젝트에 생기는 것: devflow/{project/, tree/, journal.md, users/<id>/ 방}
배포: Claude 플러그인(.claude-plugin) + Codex 네이티브 플러그인(.codex-plugin — codex/install.*가 등록)
```

### 스킬 의도 색인 — 전체 지형을 먼저, 규칙은 영향 범위에서 원문으로

이 표는 빠른 구조 이해를 위한 지도이지 스킬 규칙의 대체물이 아니다. 변경 판단 전에는 대상
스킬과 이 표가 가리키는 정본·동반 파일·직접 소비자를 실제 원문으로 읽는다.

| 구성요소 | 존재 이유와 소유 범위 | 입력 → 다음 소비자 | 설계 계보 |
|---|---|---|---|
| `principles` | 공통 규칙·커밋 규율을 소유하며 상태는 판정하지 않고 resume으로만 보냄 | 모든 entry skill과 역할 계약 → resume | DD-03 · DD-29 · DD-57 · DD-92 · DD-93 |
| `product` | 문제·정체성·능력·경계·성공 판정을 소유자와 확정 | 요청 → arch·design 또는 adopt 경계 | 기원 · DD-33 · DD-67 |
| `arch` | 컴포넌트·stack·코드 구조·data·verify channel과 능력 설계 구역을 확정 | product → split·work·verify | DD-42 · DD-43 · DD-69 |
| `design` | 선택적 UI 접근 방식·원천·token/component 전략·분해 축·검토 표면을 확정 | product·arch → arch 능력 설계와 split | DD-69 |
| `adopt` | 기존 코드의 대표 흐름을 추적해 Layer 0와 능력 설계 구역을 역산 | brownfield 코드 → split | DD-10 · DD-20 · DD-28 |
| `split` | 한 층씩 task tree와 승인된 실행 제안을 만들어 구현 경계를 소유 | Layer 0·기록·현재 코드 → work | DD-25 · DD-50 · DD-67 |
| `work` | 카드 하나의 코드·진행 로그·완료 신호·상위 문서 환류를 끝까지 운반 | 승인 카드·정본·baseline → verify 또는 다음 카드 | DD-09 · DD-48 · DD-56 |
| `verify` | 실제 실행으로 능력·제품 verdict를 내리고 실패·감리·회고의 생존 경로를 소유 | 닫힌 코드·신호·baseline → split 수리 또는 폐쇄 | DD-21–DD-24 · DD-30 · DD-36 · DD-68 |
| `resume` | 구조화된 디스크 상태를 단독으로 읽고 중단된 전이를 복구해 다음 단계로 라우팅 | Git·작업·지식 tree·journal·verify 투영 → 해당 entry skill | DD-11 · DD-25 · DD-26 · DD-44 · DD-92 |
| predicate 동반 정본 | 여러 단계가 공유하는 baseline 판정을 한 곳에서 고정. 상태·검증 판정은 상태 도구로 옮겼다 | 명시된 소비자만 읽고 절차는 각 단계가 소유 | DD-28 · DD-42 · DD-56 · DD-80 · DD-92 |
| 상태 도구 | 진입·술어·무결성 계산의 소유자, 읽기 전용이고 아무것도 고치지 않는다 | 디스크와 Git → 구역 열넷과 파생 한 줄 `next:`. 부름 하나, 소비자 여섯 | DD-11 · DD-25 · DD-39 · DD-80 |
| 역할 계약 | reviewer·verifier·auditor·retrospector를 깨끗한 컨텍스트에 원문 브리핑 | entry skill의 사건 → 편향을 제한한 독립 판단 | DD-19 · DD-21–DD-23 |
| `coordinator` 역할 계약 | devflow 위에서 worker를 배치·감독하되 새 단계나 상태를 만들지 않음 | orchestrator → 기존 entry skill | DD-70 |

묶음 행이 가리키는 파일은 `references/state/task-card-predicates.md`,
`references/verification/revision-predicates.md`,
`references/verification/event-predicates.md`, `references/knowledge/baseline-contract.md`,
`references/planning/evidence-discipline.md`, `work/references/reviewer-role.md`,
`verify/references/verifier-role.md`, `verify/references/auditor-role.md`,
`verify/references/retrospector-role.md`, `references/coordination/coordinator-contract.md`다. 각 파일의 실제 소비자와 역할 경계는 원문과 저장소 검사가
판정한다.

## 문서 지도 — 무엇이 어디에 살고 언제 읽히나

| 문서 | 지위 | 언제 읽히나 |
|---|---|---|
| `docs/design_ko.md` (이 문서) | 정본 — 정체성 · 불변식 · 구조 지도 | 모든 변경에서 항상 |
| `docs/design-decisions_ko.md` | 정본 — 결정 전문과 기각 계보. 결정의 유일한 집이고 색인은 여기서 생성된다 | 색인이 가리킨 행이 움직일 때. 색인 자체는 항상 |
| `docs/design-backlog_ko.md` | 정본 — 관찰 항목과 보류 후보 | 릴리스를 기획할 때 |
| `AGENTS.md` | 절차 — 최소 진입 게이트와 조건부 읽기 배선 | 세션 시작에 자동으로 |
| `docs/maintenance-protocol_ko.md` | 절차 정본 — 번역 · 기록 착지 · 검증 · 라운드 · README · 릴리스 · 용어 | `AGENTS.md`가 지정한 절만 |
| `docs/audit-guideline_ko.md` | 상시 수단 — 검증 방법의 정본 | 검증 결과를 보고하려 할 때 |
| `docs/usecase-matrix_ko.md` | 상시 수단 — 사용 형태 전수 | `skills/**`를 바꿀 때 |
| `docs/rounds/<버전>/` | 라운드 기록 — request · handoff · plan · report · audit | 새 라운드를 열 때 직전 것만 |
| `docs/blueprints/` | 스냅샷 — 버전 단위 설계도 보관(대상 프로젝트 파일 시스템 등). 기존 스냅샷은 수정하지 않는다 | 구조를 대조하거나 되돌릴 기준이 필요할 때 |
| `CHANGELOG.md` | 이력 — 버전별로 출시된 것, 0.10.0 이후. 배포 변경만 | 출시된 동작이 언제 바뀌었는지 찾을 때 |
| `docs/changelog-archive.md` | 이력 — 0.10.0 이전의 출시 변경 | 0.10.0보다 오래된 것을 찾을 때 |
| `skills/<name>/spec.mjs` · `body.md` | P2 실행 작성 정본 — 영문 구조화 동작과 산문 본문 | P2 스킬 작성·생성·평가 시 |
| `skills/<name>/SKILL.md` · `.generated.json` | 생성 배포물과 영수증 — 작성 정본에서 빌드된 런타임 진입점과 생성 정체성 | devflow 런타임과 빌드·릴리스 검증 시 |
| `skills/<name>/references/**` | 정확 소비자 동반 자료와 이관 출처 — 런타임 참조는 이름 난 경로로 열고 `legacy-atoms/`는 작성 정본이 아닌 이관 계보로만 보존 | `spec.mjs`·`body.md`가 정확 소비자를 지목할 때. legacy atom은 이관 출처를 대조할 때 |
| `skills/principles/references/planning/evidence-discipline.md` | 런타임 동반 자료 — 기획 증거 규율 | product·arch·adopt는 진입 시, split은 유지보수 기획 깊이 등급 판정 시 유계하게 |
| `skills/principles/references/coordination/coordinator-contract.md` | 역할 계약 — devflow 위에서 다른 실행자를 디스패치하는 `coordinator`의 의무 | 첫 디스패치 전에 |

두 상시 수단은 이 저장소를 고치는 세션이 **스스로** 여는 것이지 소유자가 브리핑하는 것이
아니다. 무엇이 그것을 열게 하는지는 `AGENTS.md`의 배선표가 정한다.

`README.md`와 `README_ko.md`는 **사람의 문서이고 AI의 읽기 집합 밖에 산다.** 스킬·도구·절차가
닿는 범위는 `skills/`·`scripts/`·`hooks/`·`codex/`·`docs/`·manifest까지이고 README는 그 바깥이다 —
읽지도, 갱신하지도, 판정 근거로 삼지도 않는다. 무엇을 언제 쓸지는 소유자가 직접 정한다.
**이 선은 README가 돌아온 뒤에도 그대로다** — 돌아오는 것은 파일이지 배선이 아니다.
지금은 파일 자체가 없고 git이 마지막 판본을 보관한다.

라운드 기록은 2026-08-13에 평면 `docs/`에서 `docs/rounds/<버전>/`으로 내려갔고 파일명이
역할(handoff · plan · report · audit)로 통일됐다. 그 이전 경로를 가리키는 `CHANGELOG.md`의
문장은 그때의 사실이므로 고치지 않았다 — 옛 경로는 그 버전의 라운드 폴더에서 찾는다.

## 불변식 — 반박 전에는 건드리지 않는 것

아래 항목들은 비용이 곧 기능이라 최적화 대상이 아니다. 원전은 0.13.0 기획 §14이고, 아래는
v0.14.0 실행 리포트 §6이 접어 둔 요지를 그대로 옮긴 것이다. 이 목록은 승격 표를 통해 자라므로
개수를 본문에 적지 않는다.

- **카드마다 Layer 0 재읽기** — 압축 뒤에는 "읽었다"가 "가지고 있다"가 아니다.
- **검토는 클린 세션으로** — 구현 이력이 판단을 물들인다.
- **폐쇄 시 검증 구역 통째 교체** — 부분 갱신은 모순을 남긴다.
- **진행 로그는 실행 전에 갱신** — 죽는 순간을 모르므로 "나중"이 곧 소실이다.
- **점유=커밋** — 동시 작업 전체가 이 위에 선다.
- **resume의 정합성 상시 실행** — 병합 사고를 잡는 유일한 그물이다.
- **`Read first` 전부 열기** — 탐색을 대체하는 장치 자체다.
- **폐쇄 때의 verify · 감리 · 회고** — 지식이 능력 문서에 쌓이는 그 순간이다.

devflow가 **막아 주지 않는다고 선언한** 자리는 별개의 목록이고, 그 목록은 사람의 문서에 산다 —
곧 위의 경계 밖이다. 무엇을 그 목록에 넣고 뺄지는 소유자가 정한다. 그 결정이 여기 결정을
뒤집는 것과 같은 무게라는 성질은 그대로이며, 그 무게를 다는 것도 소유자다.

## 결정 색인 — 생성된 투영을 전부 읽고, 이번 변경이 어느 것도 바꾸지 않는지 진술하라

결정의 유일한 집은 `design-decisions_ko.md`이고, 색인은 그 원문의 제목과 metadata에서
생성되는 읽기 전용 투영이다. 이 문서는 색인을 손으로 싣지 않는다.

```
node scripts/decision-index.mjs --lang ko
```

진입자는 이 문서 전문과 그 출력을 읽는다. 한 행이라도 움직인다면 그 행의 주제 절을
`design-decisions_ko.md`에서 연다. 기각은 여기 색인하지 않는다 — 제안하려는 것의 주제 절을
열면 그 주제의 결정 뒤에 그 주제의 기각 계보가 함께 있다. 기각된 안을 재제안하려면 거기부터
읽는다.

출력은 주제별로 묶인 `ID | 결정 | 상태`이고, 도입 버전은 원문 metadata가 소유한다.
영어 투영은 `--lang` 없이 부른다. 이 명령은 아무것도 쓰지 않는다.

## 차용과 그 경계

맷 포콕(mattpocock) skills 저장소에서 차용한 것: 조사 카드(prototype+wayfinder의 증류),
ADR 3조건(domain-modeling), 검증 이중축(code-review), code-style 지향 절의 가치 선언 일부
(codebase-design·tdd에서 절차를 빼고 취향만), grilling의 결정 프런티어와 사실/결정 분리,
경계 시나리오, 1차 출처 규율. 답만 필요한 내부·외부 근거 탐색의 격리 조사는 research의
읽기 분리에서 차용하되, 같은 탐색 범위의 질문을 조사자 하나에 묶고 원자료 구조 이해는
메인이 소유하는 경계로 제한했다.

**차용하지 않기로 한 것**: 어휘 강제, Red-Green 절차, 냄새 12종 목록, 무제한 grilling,
조사 파일층, 간접 스킬 의존, 3에이전트 병렬 설계.

사용자 규칙: 이 저장소에서 추가 차용 시 반드시 사전 허락.

## 이 문서군을 고치는 법

- **새 결정은 다음 번호를 받는다.** `DD-` 번호는 재사용하지 않는다 — 라운드 기록이 그
  번호로 결정을 인용하기 때문이다. 기각은 `DR-`로 같은 규율을 따른다.
- **뒤집힌 결정은 지우지 않는다.** 본문을 그대로 두고 상태만 바꾼다. 상태는 셋뿐이고 형식이
  고정돼 있다(테스트가 강제한다): `유효` · `대체됨 → DD-nn (vX.Y.Z)` · 결정의 일부만
  물러났다면 `유효 · 일부 정정 → DD-nn (vX.Y.Z)`; 정정이 더 생기면 같은 상태에서
  `, DD-nn (vX.Y.Z)`를 도입 순서대로 이어 붙인다. 무엇이 그것을 대체했는지가 다음 재제안이
  반박해야 할 대상이다.
- **색인은 손으로 유지하지 않는다.** 원문 하나가 결정을 소유하고 색인은 그 투영이므로,
  새 행은 원문 한 곳에만 생긴다. 투영이 원문과 1:1이 아니면 테스트가 붉어진다.
- **라운드 기록에서 무엇이 여기로 올라오는지**는 `docs/maintenance-protocol_ko.md` §5의 승격 표가 정한다.
  이 문서군은 그 표가 지정한 것만 받는다.
