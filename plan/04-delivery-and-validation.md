---
title: Incremental delivery and validation plan
status: current-plan
purpose: Sequence implementation so the cheapest discriminating observation precedes each new layer of complexity.
read_when: Read before implementing, approving a phase, or claiming a phase complete.
canonical_for: Proposed phase order, gates, falsifiers, and stop rules.
tags: [devflow-vnext, delivery, validation, skill-rails]
---

# 점진 구현·검증 계획

## 1. 실행 계약

각 phase는 하나의 중요한 주장을 공격한다. 파일 생성, build 성공, schema 통과는 delivery evidence일
뿐이다.

| 증거 | 답하는 질문 |
|---|---|
| delivery | canonical source에서 같은 artifact를 결정적으로 만들 수 있는가 |
| behavior | fresh AI가 필요한 canonical home과 decision route를 찾고 안전한 다음 행동을 하는가 |
| effect | 실제 변경·인계·검증·지식 승격에서 사람의 부담과 실패가 줄었는가 |

결과는 `proven`, `failed`, `unproven`으로 기록한다. 실행하지 못한 검증을 pass로 쓰지 않는다.
Target 하나를 build하고 fresh-use로 관찰하기 전 다음 target을 구현하지 않는다.

## 2. Phase 0 — 승인 후 housekeeping

레거시를 `legacy/v0.25.1/`로 이동하는 일은 필요하지만 설계 검증의 gate나 migration이 아니다. 실제
구버전 운영 프로젝트가 없으므로 compatibility path는 만들지 않는다. 소유자 승인 뒤
tracked/untracked, cache와 source 차이, 이동 전후 파일 목록·hash, Git recovery path를 확인해 별도
변경으로 수행한다. 새 source/build/test 경로는 legacy를 import하거나 fallback으로 사용하지 않는다.
이 단계는 완료되었다. 보존 범위와 이동 검증 결과는 `legacy/README.md`가 기록한다.

## 3. Phase 1 — keyed document-system pilot

### 공격할 주장

수동 `.devflow/index.md`, 내부 Product, Architecture, 두 domain tree, decision, 작은 work state만으로 fresh AI가
전체를 읽지 않고 canonical 문서와 다음 행동을 고를 수 있다.

### fixture와 answer key

중개노트 원본은 수정하지 않는다. 별도 fixture에 두 domain과 실제 경계 난점을 대표하는 10~12개
문서만 재구성한다. 작성 전에 질문별로 다음 answer key를 만든다.

- 반드시 읽어야 할 canonical 문서
- 읽지 않아야 할 무관 문서
- 허용 가능한 읽기 비용
- 올바른 next action

[08-document-contracts.md](08-document-contracts.md)의 조건부 분해 gate도 같은 fixture에서 시험한다.
길지만 한 판단에서 모두 필요한 문서, 짧지만 특정 runtime에서만 필요한 계약, concern 하나만 바꾸는
작업, 여러 concern을 가로지르는 작업, frontend/backend가 자연스러운 축이 아닌 CLI 또는 data-pipeline
project를 포함한다. 일부 장면은 같은 내용을 monolith와 split 두 형태로 제시해 정답성·불필요한 개봉·
재구성·중복 편집을 비교한다. 독립적으로 검증되고 안전하게 통합 가능한 local closure는 별도 Work로,
공유 end-to-end acceptance가 integration artifact의 `spec.md` 한 곳에만 있는지도 본다.
Component merge revision이 base에 들어온 뒤에만 이를 실행하고, 원자적 rollout 때문에 local 결과를
안전하게 수용할 수 없는 대조군은 한 artifact로 남겨야 한다. 추가로 spec `read_first`가 child를
직접 지목하는 장면과 항상 함께 읽히는 기존 child 둘을 fold해야 하는 장면을 둔다.

[08-document-contracts.md](08-document-contracts.md)의 Product·Architecture·Domain·Decision·Spec·State·
Verification 표본을 실제로 작성한다. 각 문서가 자기 질문, 필수 배경과 의도, 현재 결론, 다음 route를
전달하는지 확인하고 빈 template 절이나 복제 요약이 생기면 형식을 먼저 줄인다.

추가 read는 자동 실패가 아니라 원인 분석 신호다. 정답에 도달한 다른 유효 경로를 exact-set 차이만으로
실패 처리하지 않는다. 한 시간 이내 syntax pre-check로 `summary/read_when`과 Domain README 우선 읽기만
확인하며, 범용 schema·renderer는 만들지 않는다.

Fixture의 Devflow 문서는 전부 `.devflow/` 아래에만 둔다. 루트에는 다음 한 줄 성격의 host pointer만
허용한다: “프로젝트 작업 전 `.devflow/index.md`를 읽어라.” 같은 내용을 `docs/`에도 두는 대조군은
만들지 않는다. 외부 참고 문서를 제거한 뒤에도 answer key가 유지되는지를 이 phase에서 바로 검사한다.

### 통과 신호

- canonical 문서와 next action이 맞다.
- 조건부 depth는 relevance가 있을 때만 열린다.
- 무관한 Product/Architecture/domain 전체를 관성적으로 읽지 않는다.
- 문서 구조, header, entry 중 failure source를 분리할 수 있다.
- 외부 참고 경로 없이 내부 project tree만으로 질문의 배경과 현재 결정을 설명한다.
- 최초 Sketch/Product/Adopt가 index를 만들고, 질문→문서 route가 실제로 바뀔 때만 부모 route를 같은
  변경에서 갱신한다. Active artifact는 index에 나열하지 않고 glob으로 발견한다.
- foundation readiness는 index의 저장 상태가 아니라 파일과 Architecture의 Design applicability에서 파생된다.
- 내용의 owner·수명을 먼저 바로잡고, 부모 route만으로 필요한 자식을 고르며, 무관한 형제를 관성적으로
  열거나 같은 현재 사실을 부모·자식에 복제하지 않는다.
- 길지만 함께 판단되는 문서는 하나로 남고, 실제 독립 소비·변경되는 concern만 조건부 자식이 된다.
- 예시 taxonomy를 CLI·data-pipeline 같은 다른 환경에 그대로 복제하지 않는다.

## 4. Phase 2 — Resume target 하나

새 Skill Rails source package와 `resume` prose target 하나만 만든다. 가장 작은 완전한 entry source를
build하고 generated diff·receipt를 검토한다. Phase gate에서 deterministic delivery, integrity,
currentness를 확인한다.

Standalone target을 fresh Claude/Codex session에 주고 status·continue 질문을 관찰한다. Resume은
Domain 설명이나 배치 결정을 대신하지 않고 active state와 다음 route 하나만 반환해야 한다. Build
receipt는 behavior pass가 아니다.

Active item이 0인 두 bootstrap fixture도 포함한다: Product만 완결된 경우에는 Architecture를, Product
작성 중 끊긴 경우에는 반쪽 canonical file을 current로 취급하지 않고 checkpoint 복구를 반환해야 한다.
`.devflow/`는 남았지만 index가 없거나 읽히지 않는 fixture에서는 unmanaged bootstrap을 새로 시작하지
않고 기존 project/artifact에서 복구 route를 찾아야 한다.

## 5. Phase 3 — Direct target

Direct만 추가해 먼저 기록 지속성을 판정하고, tracked라면 시작 깊이와 closure 구조를 독립적으로 정한다.

```text
ephemeral → 관련 정본을 읽고 현재 turn에서 구현·비례 검증·closure
tracked   → work/<id>/spec.md + 초기 state.md
             └─ outcome/non-goal/guardrail/acceptance
                  + 필요할 때만 shaping 정보
```

Ephemeral gate는 “작은가”가 아니라 diff만으로 의도/다음 행동을 복구할 수 있는지, durable fact/decision을
현재 turn에 canon으로 닫을 수 있는지, turn 밖 검증·위험·조율이 남는지로 판정한다. 하나의 적응형 spec은
안정 outcome/non-goal/guardrail과 acceptance를 가지며, 관찰이 필요할 때만 현재 slice·review surface·stop
condition을 더한다. 사용자 승인은 실제 binding choice에만 요구한다.
Blocking unknown은 아직 Sketch target 없이 “exploration needed”로 안전하게 멈추는지만 본다.

Fixture는 다음을 포함한다: 한 줄이지만 인증 불변식을 바꾸는 tracked 변경, 파일이 많지만 기계적이고
같은 turn에 닫히는 ephemeral rename, 작업 중 검증 책임이 커져 ephemeral에서 tracked로 승격되는 변경,
독립 closure 두 개와 공유 integration acceptance를 가진 요청.

## 6. Phase 4 — Work target과 중단 복구

Work의 유효 입력은 `tracked spec | 현재 turn에서 합의한 goal과 check`다. Ephemeral은 별도 contract
파일 없이 같은 turn에서 구현하고 비례 검증한 뒤 durable folder 없이 끝낸다. Tracked Work는 한 결과 또는 shaping slice를 구현하고 state를
갱신한다. Shaping fixture에서는 세 번의 시각 review를 거치며 각 성공 관찰이 Verify 실패가 아니라 Direct의
같은 spec 갱신으로 이어지고, 마지막 stop condition에서만 최종 Verify로 가는지 본다.

Work 전, commit 후 Verify 전, verification 준비 중에 session을 끊고 Resume으로 재개한다. Git은 실제
bytes·revision, spec은 intent·acceptance·write boundary, state는 last safe point·next action을 소유한다.
base나 contract를 바꾸는 충돌만 구현을 막고 다른 불일치는 관할별로 조정한다.

추가 피드백 뒤 현재 Work actor가 custody를 `next_route: direct`로 넘긴 시점과 Direct의 spec write 직후를
각각 끊는다. Route 변경이 실행 중 worker를 취소한다고 가정해서는 안 되며, custody가 불명확하면
reconcile해야 한다. 어느 경우에도 Work가 절반 갱신된 계약을 읽어서는 안 된다. 이미 닫힌 spec을 후속
개선으로 다시 살리지 않고 새 ephemeral/tracked 판단을 하는지도 확인한다.

## 7. Phase 5 — Verify와 knowledge landing closure

Verify target을 별도로 build하고 독립 fresh-use를 본다. Verify는 code를 수정하지 않고 criterion별
`proven|failed|unproven`, evidence, failure route, retry 전에 달라져야 할 조건을 남긴다.

Direct가 최소 state를 쓴 뒤 spec 완결 전에 중단되는 fixture와 Verify가 verification을 쓴 뒤 state route를
공개하기 전후에 중단되는 fixture를 둔다. Valid YAML prefix와 unreadable state를 각각 만들어 08 §6의
필수 contract가 빠졌을 때 Resume이 current로 추측하지 않는지 본다.
Contract amendment 뒤 이전 verification이 삭제되고 필요한 실패 기억만 spec에 남는지도 확인한다.
같은 장면을 단일 closure-card 대조군으로도 실행해 읽기 비용, writer 충돌, 중단 복구 비용을 비교한다.

방치 fixture에서는 partial code만 남은 경우, 코드가 이미 통합됐지만 state가 남은 경우, 목표 자체가
취소된 경우를 둔다. Resume은 각각 continue/reconcile/abandon 가능성을 읽기 전용으로 보고한다. Abandon
custody actor는 partial code, 독립적으로 참인 지식, pending landing, team file을 처분한 뒤 폴더를 삭제하며
TTL·자동 폐기·영구 묘비를 만들지 않아야 한다.

Pass 경로:

```text
Verify → verification에 durable fact evidence 기록, state의 candidate 목록 갱신
       → Work closure가 후보를 채택·기각
       → 열린 판단은 blocker + decision route로 전달
       → 확인된 fact → canonical path만 pending_landings에 기록
       → Work가 landing을 확인해 pending이 비면 artifact와 member files 삭제
       → PR/commit review가 있으면 goal·acceptance·verification 요약을 남김
```

같은 실패 재시도에는 달라진 가설·입력·구현·검증법이 필요하다. 서로 다른 작업에서 같은 이유로
promotion 누락이 반복될 때만 별도 closure skill을 제안한다. 한 번의 누락으로 전역 skill을 만들지
않는다. Cross-domain 계약은 Product/Domain/Architecture/decision의 현재 질문별 home으로 분해되는지 시험한다.
완료된 change spec 자체를 장기 canon으로 승격하지 않는다.

## 8. Phase 6 — Product → Architecture → optional Design

각 target을 순서대로 하나씩 build·관찰한다.

1. 명확한 brief → Product
2. Product를 입력으로 Architecture
3. backend-only brief → Design 생략
4. UI project → Design

Product는 프로젝트 목적·사용자·cross-domain 구도와 domain 업무 의미를 결정한다. Product/Domain tree가
그 지식의 canonical home이고, Architecture는 기술·검증 채널을, Design은 UI 원칙을 결정한다. 같은 사실이 두 문서에
복제되면 phase를 멈춘다.

## 9. Phase 7 — Sketch target

`sketch`는 project/change scope를 함께 다루고 checkpoint와 finding destination만 보존한다. 특정 질문법,
시장 분석 절차, 사고 순서를 강제하지 않는다.

관찰:

- 모호한 신규 idea가 Product로 이어지는가
- uncertain change가 Direct로 필요한 결정만 반환하는가
- 중단된 sketch가 transcript 없이 재개되는가
- project sketch를 일반 work shape로 합치는 편이 더 단순한지

Sketch가 독립 skill 없이 Direct/Product 안에서 동일하게 checkpoint된다면 통합을 재검토하되, 사용자가
명시한 독립 탐구 경험을 잃지 않는지 먼저 본다.

## 10. Phase 8 — Adopt vertical slice와 target

Adopt 문서 prototype을 먼저 작은 brownfield fixture에서 시험한 뒤 target 하나를 build한다.

성공 조건:

- maintained source의 의미가 disposition 없이 사라지지 않는다.
- observed fact, interpretation, unknown, conflict가 구분된다.
- Product/Architecture decision route와 Domain canonical home이 겹치지 않는다.
- 모르는 내용을 문서 완성을 위해 발명하지 않는다.
- 외부 문서를 다시 열지 않아도 내부 Product/Architecture/Domain 문서가 자기완결적으로 이해된다.
- 사람에게는 source로 결정할 수 없는 경계·모순만 묻는다.
- source group의 include/exclude가 입력을 완전히 partition하고 uncovered path가 0이다.
- 보존 외부 문서는 검색면 밖 이동·최소 pointer·명시적 비정본 경계 중 하나를 만족한다.
- 흡수 source를 삭제·이동한 fixture에서도 내부 지식 질문과 다음 변경 routing이 동일하게 성공한다.
- 고의로 모순된 retained 문서가 남은 fixture에서도 fresh AI가 내부 정본을 우선하고 충돌을 보고한다.
- adoption 중 tracked 변경은 08 §5의 세 readiness 증거가 모두 있을 때만 열린다.

원본 중개노트에는 어떤 변경도 하지 않는다.

## 11. Phase 9 — 팀 handoff와 병렬 branch

Sketch·Adopt·Work fixture에서 Agent A가 공유 사실을 artifact `state.md`, 개인 환경·중간 추론을
`team/A/<artifact-id>.md`에 둔다. “관리권이 바뀌기 전에 현재 행동을 끝내지 못하면 snapshot을 갱신한다”는
한 원칙이 session 중단, branch 전환, 다른 agent 인계에서 같은 결과를 만드는지 본다. 매 turn마다
기록하지 않는다.

서로 다른 충돌 저항 artifact ID와 안정적인 seam으로 두 branch를 진행해 정상 merge하고,
같은 package manifest를 함께 고치는 비상충 대조군도 사전 금지 없이 통합되는지 본다. 이어서
의도적으로 같은 canonical home을 상충 변경한 대조군은 명시적 merge·decision으로 멈추는지 본다.
공유 사실 하나를 member file에만 남겼을 때 Agent B가 이를 정본으로 실행하지 않아야 한다. Closure 뒤
artifact와 member file이 삭제되고, 중앙 번호·identity protocol·room·claim 없이 재개되어야 한다.
Member 경로는 repository team identifier를 쓰고 기본값은 `git config user.name`의 안정된 slug이며,
동일 사용자의 여러 agent가 실제로 구분돼야 할 때만 짧은 label을 덧붙인다. Active artifact가 없는 dirty
checkout은 “진행 중 없음”이 아니라 unowned work로 보고되어야 한다.

## 12. Phase 10 — index 기계화의 조건부 도입

다음 중 하나가 관찰될 때만 작은 checker/generator를 검토한다.

- maintained doc이 README에서 빠짐
- dangling link가 남음
- 동일 질문에서 잘못된 `read_when`이 반복됨
- 같은 routing 정보를 둘 이상의 index에 중복 작성함

도입하더라도 title, summary, read_when과 파일 존재만 결정적으로 검사한다. canonical home 선택,
Domain 경계, 좋은 summary를 script가 판단하지 않는다.

## 13. Phase 11 — npm·host adapter와 SessionStart

핵심 behavior가 명시 호출과 프로젝트 문서만으로 통과한 뒤 설치를 검증한다.

```text
plugin.json                         # portable identity + extensions.com.openai
.claude-plugin/plugin.json         # Claude 공식 adapter
skills/                             # Skill Rails built targets
hooks/hooks.json                    # host adapter가 실제 지원할 때
scripts/session-start.*             # marker check + 짧은 Resume pointer
```

프로젝트 AGENTS/CLAUDE pointer는 `.devflow/index.md` 발견만 맡고, hook은 marker 존재와 Resume 진입만 알리는
동적 보조다. 같은 규칙을 두 곳에 복제하지 않는다. Hook을 제거해도 skill gate와 문서 routing이
작동해야 한다. `.codex-plugin`은 실제 요구 host version이 확인될 때만 fallback으로 추가한다.

같은 npm artifact를 두 marketplace source로 설치하고 clean session, update, uninstall, hook on/off를
비교한다. Hook이 effect를 개선하지 않으면 v1 package에서 빼되 공식 지원 경로는 문서화한다.

## 14. Skill Rails regrowth guard

작성 계약은 08 §9를 다시 정의하지 않는다. 각 target에서 build·currentness와 fresh-use 행동을 분리해
관찰하고, 추가 module·script·field는 이미 관찰된 실패를 더 작은 수단으로 해결하지 못할 때만 검토한다.
Authoring 비용이 행동 실험을 잠식하는지도 함께 기록한다.

## 15. 최초 end-to-end fresh-agent 관찰

각 phase의 개별 검사를 통과한 뒤 다음 횡단 장면만 다시 본다.

1. unmanaged 진입과 손상된 managed 복구를 구분한다.
2. 명확한 변경·shaping·ephemeral·tracked가 같은 체계에서 필요한 무게만 쓴다.
3. Direct publication, Work, Verify, 방치 지점에서 끊어도 current를 추측하지 않고 이어 간다.
4. 구현·spec·제품·기술·디자인·Adopt 실패가 맞는 route로 돌아간다.
5. closure가 durable fact만 정본에 남기고 진행 서사와 임시 파일을 제거한다.
6. 관련 parent/child만 읽고 늘 함께 쓰이는 child는 fold한다.
7. 병렬 branch와 개인 handoff가 공유 사실을 복제하지 않고 Git 통합에서 충돌을 드러낸다.
8. Adopt 원문과 hook을 제거해도 내부 정본과 host pointer만으로 축소 동작한다.

`spec/state/verification`과 단일 closure-card 비교처럼 현재 결정을 바꿀 대조군은 해당 phase에 남긴다.
새 시나리오는 기존 결정을 실제로 바꾸는 실패가 있을 때만 추가한다.
