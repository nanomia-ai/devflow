---
name: direct
description: 준비된 Devflow 관리 프로젝트의 변경 요청을 현재 대화에서 끝나는 ephemeral 행동, 추적되는 Work 계약 또는 하나의 소유 결정 route로 바꾼다. scope, 지속 여부 또는 closure를 결정해야 할 때 구현 전에 사용하며 bootstrap, 구현, 검증 또는 상태 복구에는 사용하지 않는다.
---

# 하나의 변경 지시하기

Direct는 사용자의 현재 요청에 필요한 가장 작은 안전한 실행 계약을 결정한다. 요청한 결과를 보존하고
국소 구현 선택은 executor에게 맡긴다. 변경이 크다는 이유만으로 과정 기록을 만들지 않으며, diff가
작다는 이유만으로 지속되어야 할 의도를 숨기지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 진입 gate

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `direct` 행을 적용한다. gate가
다른 곳으로 route하면 아무것도 변경하지 않는다.

index를 사용할 수 있으면 먼저 읽는다. index route를 따라 이 요청을 이해하는 데 필요한 최소한의
Product, Domain, Architecture, Design, decision 문서만 읽는다. 현재 Git revision과 status도 읽는다.
새 artifact를 만들기 전에 index의 범위가 정해진 Work state glob으로 아직 열린 결과가 같은 활성
계약이 있는지 찾는다.

선택한 활성 Work state가 `next_route: direct`로 자신을 지정했다면 판단 전에
`references/work-state.md`를 열고 그 인계만 처리한다.

인계가 상위 판단이나 보존할 탐구를 요구하면 Work state의 관리권은 `direct`에 둔 채 `next_action`이
지정한 `product`, `architecture`, `design`, `adopt` 또는 `sketch`로 질문을 보낸다. 해당 route는 Work
artifact를 수정하지 않고 자신의 책임과 기존 종료 규칙만 따른다. 활성 Work와 관련된 사용자 선택도
Direct가 묻고 답을 같은 조정 흐름에서 처리한다.

현재 member의 Sketch state의 `next_route`가 `direct`라면 쓰기 전에
`references/sketch-handoff.md`를 열고, ephemeral 지시 또는 추적되는 Work 공개와 함께 landing
계약을 완료한다.

## 쓰기 전에 질문을 route한다

먼저 요청을 지시할 준비가 되었는지 판단한다.

- 제품 또는 Domain 의미가 부족하면 `product`, 기술 경계가 부족하면 `architecture`, interaction
  원칙이 부족하면 `design`으로 보낸다.
- 가장 작은 안전한 결과조차 정하기 전에 증거나 탐구가 필요하면 지배 질문과 결정 가능하게 만들
  증거를 적어 `sketch`로 반환한다. 추측에 기반한 Work 계약은 만들지 않는다.
- 실제로 구속력 있는 선택이 남아 있을 때만 사용자에게 묻는다. 요청과 현재 canon이 이미 정한 계약에
  대해 승인을 다시 구하지 않는다.

사용자의 구속력 있는 선택을 실제로 묻기 직전에만 `references/question-dialogue.md`를 열고 질문
표현에 적용한다.

요청이 준비되었다면 크기를 추정하기 전에 지속 여부를 검사한다. 다음 중 하나라도 `yes`면 tracked다.

1. 현재 대화가 중단되면 diff만으로 요청 의도와 다음 안전 행동을 복구할 수 없는가?
2. 현재 대화에서 canonical home에 안전하게 반영할 수 없는 지속 프로젝트 지식이나 구속력 있는 결정을
   바꾸는가?
3. 검증, 위험 또는 조정이 현재 대화 뒤에도 열려 있거나 독립 verifier가 필요한가?

모두 `no`면 변경을 `ephemeral`로 분류한다. Work 디렉터리를 만들지 않는다. 현재 대화에서 수행할
범위가 정해진 행동, 필요한 canonical read, write boundary, 비례적인 검증, closure 조건을 반환한다.
파일 수와 diff 크기만으로 변경을 tracked로 만들지 않는다.

진행 중인 ephemeral 변경이 이 gate를 넘게 되면 더 구현하기 전에 멈춘다. 현재 `HEAD`를
`base_revision`으로 삼아 tracked로 승격하고, spec의 write boundary가 상속된 dirty delta를 포함하게
한다. 새 actor가 상속된 bytes와 이후 작업을 구분하도록 첫 Work 행동에 해당 경로를 적는다. dirty
bytes는 `last_safe_point`가 아니다. artifact를 `work`에 공개하여 해당 actor가 관리권을 받고 Verify
route 전에 safe point를 만들게 한다.

## 추적되는 closure를 구성한다

변경을 tracked로 분류한 뒤 Work 경로를 만들기 전에 `references/work-state.md`를 연다. ephemeral
결과와 decision route 결과는 이 모듈을 열지 않는다.

하나의 artifact는 한 단위로 수용하고 취소하고 검증할 수 있는 결과 하나를 나타낸다. 안정된 outcome,
non-goal, guardrail 아래의 보완은 같은 활성 spec에 유지한다. 독립적으로 수용할 수 있는 결과, 대체된
outcome 또는 닫힌 작업의 후속 결과에는 새 artifact를 사용한다. 파일, 페이지, worker, 구현 단계로
나누지 않는다.

독립적인 국소 결과들이 end-to-end acceptance도 공유한다면 분해하는 시점에 일반 integration
artifact 하나를 만든다. 공유 acceptance는 그 spec에만 둔다. 초기 state는 component artifact와
필요한 merge revision을 blocker로 적고 `next_route: direct`를 사용한다. 그 input들이 base revision에
들어온 뒤에만 실행 가능하게 한다. 원자적으로 rollout해야 해서 국소 결과를 독립 수용할 수 없다면
artifact 하나로 유지한다.

새 artifact마다 `W-short-label-<token>`처럼 충돌하기 어려운 불투명 ID를 만들고 현재 tree에 없는지
확인한다. label이 아니라 token이 identity를 제공한다.

## 추적되는 계약을 공개한다

`.devflow/work/<artifact-id>/`를 만든다. 모든 Markdown 파일은 프로젝트의 표준 `summary`와
`read_when` header를 가진다.

복구 가능한 Direct checkpoint로 `state.md`를 먼저 쓴다.

```yaml
base_revision: <현재 Git full revision>
next_route: direct
next_action: <이 정확한 계약을 완성하고 공개하기>
blockers: []
knowledge_candidates: []
pending_landings: []
```

이어서 `spec.md`를 원래 요청 없이도 이해되는 현재 계약으로 쓴다. 산문만으로 다음을 모두 판단할 수
있어야 한다.

- 배경, 사용자 의도, 문제, 관찰 가능한 결과
- goal, non-goal, 안정된 guardrail
- 현재 맥락과 정확한 `read_first` 경로
- 이미 내려진 제품, 기술, design, 운영 결정
- 국소 구현 선택을 강제하지 않는 변경 대상과 deliverable
- acceptance criteria와 관찰 가능한 완료 signal
- 허용 write boundary, 그리고 실제 병렬 dispatch를 의도할 때만 실행 unit과 안전한 seam
- 열린 결정, 위험, blocker

구현물을 관찰해야 최종 형태를 고를 수 있을 때만 shaping 정보를 추가한다. 추가 승인 없이 executor가
바꿀 수 있는 경계, 현재의 가장 작은 reviewable slice, 관찰할 surface 또는 signal, 필요한 사용자
review 지점, 다음 slice나 전체 closure를 선택하는 stop condition을 쓴다. Shaping은 별도 spec 종류가
아니다.

spec을 완성한 뒤 공통 state 계약에 따라 `state.md`를 교체한다. 실행 가능한 계약은
`next_route: work`, 범위가 정해진 `next_action` 하나, 빈 blockers, 동일한 base revision을 가진다.

다른 actor가 관리권을 가진 동안 spec을 수정하지 않는다. 먼저 그 actor가 `next_route: direct`,
범위가 정해진 delta, 결정 질문을 포함한 safe state를 공개해야 한다. 관리권이나 현재 Git 기준이
불분명하면 계약을 덮어쓰지 말고 멈춘 뒤 `user`로 보낸다. acceptance, guardrail 또는 closure condition이
바뀌고 `verification.md`가 있다면 amendment input으로 읽는다. 여전히 필요한 실패 기억만 spec의 현재
결정에 흡수하고, state를 공개하기 전에 같은 amendment에서 stale verification을 삭제한다.

상위 판단이 Direct로 돌아오면 변경된 canon을 기존 spec과 verification에 대조한다. 계약을 다시 정리해야 하면
위 amendment 경계에서 처리하고, 구현만 이어가면 `work`, 같은 acceptance를 다시 판정해야 하면
`verify`로 state를 공개한다.

## 지시 결과를 반환한다

다음을 보고한다.

- `분류:` `ephemeral`, `tracked` 또는 하나의 소유 decision route
- `Artifacts:` 만들거나 갱신한 모든 Work 경로, 또는 `none`
- `다음 행동:` 독립 artifact마다 범위가 정해진 행동 하나. integration blocker 관계가 있으면 포함한다.
- `근거:` 사용한 canonical 문서와 Git state, 그리고 남은 unproven 가정

세 질문에 따라 지속 여부를 선택했고, 각 tracked artifact가 자기완결적이며 복구 가능하고, 구속력 있는
선택만 상향했으며, 구현이나 검증을 수행하지 않았을 때 완료다. 다음 actor는 ephemeral work의 현재
대화 executor, 실행 가능한 tracked 계약의 `work`, 차단된 integration 또는 amendment의 `direct`,
아니면 위에서 지정한 하나의 decision route다.
