# 추적되는 Work 계약 구성하기

변경을 tracked로 분류한 뒤 계약을 구성·생성·수정하거나 integration 계약을 활성화할 때 적용한다.
진행 중인 ephemeral 변경이 지속성 gate를 넘으면 더 구현하기 전에 멈추고 이 계약에 따라 승격한다.

ephemeral에서 승격할 때 현재 `HEAD`를 `base_revision`으로 삼고, spec의 write boundary가 상속된 dirty
delta를 포함하게 한다. 새 actor가 상속된 bytes와 이후 작업을 구분하도록 첫 Work 행동에 해당 경로를
적는다. dirty bytes는 `last_safe_point`가 아니다. artifact를 `work`에 공개하여 해당 actor가 관리권을
받고 Verify route 전에 safe point를 만들게 한다.

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

한 결과에 이미 정해진 구현 계약이 많고 현재 행동마다 필요한 부분이 다르면, 공통 맥락·제약과 모든
acceptance는 `spec.md`에 두고 concern별 확정 계약만 `spec/<concern>.md`로 나눌 수 있다. `spec.md`의
지도는 `next_action`의 대상이나 criterion만으로 읽을 상세를 고를 수 있게 쓴다. 상세에는 그 concern의
확정된 값·순서·형식과 적용에 필요한 이유만 두고 공통 제약·acceptance·조사 과정을 반복하지 않는다.
모든 상세는 하나 이상의 criterion이 가리킨다. artifact가 닫힌 뒤에도 판단을 바꾸는 계약과 여러
artifact가 함께 쓰는 미구현 계약은 상세에 두지 않는다. 전자는 해당 owner route로 보내고, 후자는
artifact를 나누지 않는다. 길이만으로 나누지 않고, 대부분의 행동이 대부분의 상세를 열게 되면
`spec.md` 하나로 합친다.

구현물을 관찰해야 최종 형태를 고를 수 있을 때만 shaping 정보를 추가한다. 추가 승인 없이 executor가
바꿀 수 있는 경계, 현재의 가장 작은 reviewable slice, 관찰할 surface 또는 signal, 필요한 사용자
review 지점, 다음 slice나 전체 closure를 선택하는 stop condition을 쓴다. Shaping은 별도 spec 종류가
아니다.

spec과 필요한 상세를 완성한 뒤 공통 state 계약에 따라 `state.md`를 교체한다. 실행 가능한 계약은
`next_route: work`, 범위가 정해진 `next_action` 하나, 빈 blockers, 동일한 base revision을 가진다.

상세를 바꾸는 amendment는 바꿀 상세, `spec.md` 순으로 쓰고 `state.md`를 마지막에 공개하며, 그동안
`next_action`에 바꾸는 concern과 의도를 남긴다. acceptance, guardrail, closure condition 또는 상세가
바뀌고 `verification.md`가 있다면 amendment input으로 읽는다. 여전히 필요한 실패 기억만 spec의 현재
결정에 흡수하고, state를 공개하기 전에 같은 amendment에서 stale verification을 삭제한다.
