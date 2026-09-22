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

진행 중인 ephemeral 변경이 이 gate를 넘게 되면 더 구현하기 전에 멈추고 tracked로 다시 분류한다.

## 추적되는 계약에만 작성 상세를 적용한다

변경을 tracked로 분류한 뒤 계약을 구성·생성·수정하거나 integration 계약을 활성화하기 전에
`references/work-state.md`와 `references/direct-tracked-contract.md`를 연다. ephemeral 지시, 소유 decision
route 반환 또는 기존 활성 Work의 상위 질문 전달만으로 끝나면 tracked 작성 상세를 열지 않는다.

다른 actor가 관리권을 가진 동안 spec을 수정하지 않는다. 먼저 그 actor가 `next_route: direct`,
범위가 정해진 delta, 결정 질문을 포함한 safe state를 공개해야 한다. 관리권이나 현재 Git 기준이
불분명하면 계약을 덮어쓰지 말고 멈춘 뒤 `user`로 보낸다.

상위 판단이 Direct로 돌아오면 변경된 canon을 기존 spec과 verification에 대조한다. 계약을 다시 정리해야 하면
tracked 작성 상세의 amendment 경계에서 처리하고, 구현만 이어가면 `work`, 같은 acceptance를 다시
판정해야 하면 `verify`로 state를 공개한다.

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
