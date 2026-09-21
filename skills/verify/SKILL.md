---
name: verify
description: 준비된 Devflow Work 계약 하나의 acceptance check를 독립적으로 실행하고, criterion별 evidence와 verdict를 기록하며, 구현이나 canon을 바꾸지 않고 실패 또는 proven closure를 route한다. verification 준비가 된 유효한 tracked Work artifact에만 사용한다.
---
<!-- generated; do not edit; source: targets/verify/entry.md; receipt: .skill-rails-build.json -->

# 하나의 Work 결과 검증하기

Verify는 실제 실행과 관찰로 수용된 Work 결과를 현재 계약에 비추어 판단한다. 불확실성을 보존한다.
실행하지 않았거나 관찰할 수 없는 항목은 pass가 아니라 `unproven`이다. verification evidence는 선택한
artifact에 속하며, 구현·계약·프로젝트 canon은 각각의 소유 route에 남는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 계약으로 진입한다

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `verify` 행을 적용한다. gate가 다른
곳으로 route하면 아무것도 변경하지 않는다.

index를 사용할 수 있으면 먼저 읽는다. 사용자 또는 현재 route가 지정한 immediate Work state 하나만
선택한다. 대상이 정해지지 않은 채 eligible artifact가 여러 개면 쓰지 않고 사용자에게 보낸다.

`references/work-state.md`를 연 뒤 선택한 state와 sibling spec을 연다. state가 Verify에 관리권을 주고,
blocker가 없고, 도달 가능한 committed safe point를 지정하며, spec이 outcome·acceptance·write boundary를
스스로 설명할 때만 verification을 시작할 수 있다. spec의 `read_first` 문서와 criterion 실행에 필요한
구현·test·환경·team context만 읽는다. 어떤 결과든 evidence로 쓰기 전에 현재 Git revision, 관련 bytes,
safe point를 비교한다.

필수 문서가 없거나 읽을 수 없거나 일치하지 않거나, checkout에서 판단 대상 bytes를 정확히 식별할 수
없다면 current라고 추정하지 않는다. 프로젝트를 변경하지 않고 불일치를 적어 `resume`으로 보낸다.
Verify가 이미 명확한 관리권을 가졌고 실행 중 계약 또는 owner defect가 드러났다면 신뢰할 수 있는
나머지 evidence를 끝까지 기록한 뒤 verification.md에는 failure owner를, Work state에는 공통 인계 계약에 따른 현재 관리권을 공개한다.

## acceptance 계약을 실행한다

현재 acceptance criterion을 하나씩 독립적으로 평가한다. 각각 다음을 기록한다.

- 기대하는 관찰 가능 결과
- 실제로 관찰한 것과 그 revision, 환경, channel
- 관찰을 뒷받침하는 evidence
- 정확히 하나의 verdict: `proven`, `failed`, `unproven`

실제 실행 또는 관찰을 사용한다. 구조 check는 시각 결과를 증명하지 않고, 성공한 review는 다른 환경을
증명하지 않으며, revision이나 전제 조건이 바뀌었다면 과거 실행은 현재 evidence가 아니다. 필요한
channel을 사용할 수 없으면 `unproven`과 재개 조건을 기록한다. spec이 해당 review surface를 지정한
경우 질적 acceptance에 명시적인 사용자 판단을 쓸 수 있지만, 침묵을 acceptance로 꾸며내지 않는다.

criterion verdict로 전체 결과를 도출하며 두 번째 status field를 만들지 않는다. failed 또는 unproven인
criterion마다 깨졌거나 부족한 전제, 하나의 `failure_route`, 그것이 소유하는 구체적인 대상, 재시도 전에
바뀌어야 할 것을 적는다.

- 구현, test 또는 local behavior → `work`
- goal, acceptance, write boundary 또는 shaping contract → `direct`
- 제품 또는 Domain 의미 → `product`
- 구조, dependency, runtime, data flow 또는 verification channel → `architecture`
- UI 또는 interaction 원칙 → `design`
- maintained source readiness 또는 disposition → `adopt`
- 사람이나 외부 결정만 제공할 수 있는 evidence → `user` 또는 해당 decision route

이 목록은 `verification.md`에 기록할 실제 failure owner를 정한다. 구현 결함은 Work state를 `work`로
보내고, 나머지 상위 판단·보존할 탐구·사용자 답은 `references/work-state.md`의 인계 계약에 따라
`direct`로 보낸다.

code, test, spec, Product, Architecture, Design, Domain 또는 adoption canon을 수정하지 않는다.
verification session에서 실패한 결과를 직접 수리하거나 통과시키기 위해 criterion을 약화하지 않는다.

## route보다 evidence를 먼저 공개한다

프로젝트의 표준 `summary`와 `read_when` header를 가진 하나의 현재 whole-file record로
`verification.md`를 먼저 쓴다. 이 파일이 다음을 소유한다.

- 정확한 target revision, 환경, channel
- 각 criterion의 expected result, observation, evidence, verdict
- 도출된 전체 judgment
- 각 failure route와 retry precondition
- verification 중 발견한 지속 가능한 현재 사실의 evidence

verification 파일만 verdict를 소유한다. verdict나 evidence를 state에 복제하지 않는다. 완성한
verification record를 다시 읽은 뒤 공통 state 계약에 따라 `state.md`를 마지막에 교체한다. 구현 safe
point와 기존 unresolved candidate를 보존한다. 새 evidence가 canon에서 판단할 가치가 있는 지속적인
현재 사실을 뒷받침할 때만 `knowledge_candidate`를 추가한다. observation, verdict, code path, test result는
candidate가 아니다.

범위가 정해진 다음 route와 행동 하나를 선택한다.

- failed 또는 unproven criterion은 기록된 failure route와 retry precondition을 보존하되, 구현 결함만
  `work`, 그 밖의 판단은 `direct`로 보낸다.
- proven인 중간 risk criterion은 spec에 범위가 정해진 후속 행동이 남아 있으면 `direct` 또는 `work`로
  돌아간다.
- stop condition에 도달하고 모든 closure criterion이 proven이면 candidate를 판단하고 확인된 사실을
  반영한 뒤 artifact를 닫도록 `work`로 보낸다.

state 공개가 마지막 commit point다. `verification.md`를 쓴 뒤 일치하는 state를 쓰기 전에 session이
멈췄거나, state가 없거나 읽을 수 없는 verification record 너머를 가리킨다면 결과는 current가 아니다.
Resume은 `reconcile -> verify`를 보고해야 한다. 시도를 덧붙이거나 대체된 verdict 사본을 보존하지
않는다. 이후 Direct가 acceptance 또는 guardrail을 수정하면, 여전히 필요한 실패 기억만 이어가고 stale
verification record를 삭제할 책임은 Direct에 있다.

## 판단을 반환한다

다음을 보고한다.

- `대상:` 판단한 artifact와 정확한 revision, 환경, channel
- `Criteria:` 각 criterion, `proven`·`failed`·`unproven` verdict, evidence
- `Route와 행동:` 공개한 다음 route 하나와 범위가 정해진 행동
- `미검증:` 사용할 수 없는 observation과 재개 조건, 또는 `none`
- `읽은 범위:` 실제로 연 모든 project, Work, implementation, evidence 경로

모든 현재 criterion에 정직한 verdict가 있고, route 전에 evidence가 공개되었으며, state에 verdict
사본이 없고, 다음 owner가 무엇을 바꾸거나 닫아야 하는지 알 수 있고, Verify가 구현·계약·프로젝트
canon을 바꾸지 않았을 때 완료다.
