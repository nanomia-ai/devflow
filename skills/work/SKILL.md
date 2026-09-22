---
name: work
description: 준비된 Devflow Work 계약 하나 또는 합의된 현재 대화의 행동 하나를 구현하고, 복구 가능한 safe point를 보존하며, goal이나 verdict를 바꾸지 않고 결과를 route한다. 구현과 Work closure에 사용하며 지시, 검증, 상태 복구 또는 bootstrap에는 사용하지 않는다.
---
<!-- generated; do not edit; source: targets/work/entry.md; receipt: .skill-rails-build.json -->

# 하나의 변경 구현하기

Work는 이미 경계가 정해진 결과를 실제 코드, test, Git history로 만든다. 합의된 경계 안의 국소 구현
방법은 Work가 선택하지만, 구현 편의를 새 goal, acceptance rule 또는 제품 경계로 만들지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 gate로 진입한다

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `work` 행을 적용한다. gate가 다른
곳으로 route하면 아무것도 변경하지 않는다.

index를 사용할 수 있으면 input을 선택하거나 실행하기 전에 읽는다.

Work는 다음 두 input 중 정확히 하나만 받는다.

- 읽을 수 있는 `state.md`의 `next_route`가 `work`이고 blocker가 없으며 자기완결적인 `spec.md`를
  가진 tracked artifact
- 현재 session에서 합의한 ephemeral goal, write boundary, 비례적인 check

tracked input이라면 Work state를 읽거나 쓰기 전에 `references/work-state.md`를 연다. artifact를
선택한 뒤 그 ID에 해당하는 범위가 정해진 note가 있거나 handoff 뒤에도 보존해야 하는 local delta,
환경 고유 맥락 또는 잠정 맥락을 가지고 있다면 `references/team-context.md`를 연다. 그렇지 않으면
건너뛴다. 선택한 spec과 state, spec의 `read_first` 문서, 그 모듈이 허용하는 context, 현재 Git
revision·status·관련 diff를 읽는다. 무관한 프로젝트 지식까지 확장하지 않는다. 파일을 건드리기 전에
`base_revision`에 도달할 수 있고 계약에 적힌 상속 dirty path가 여전히 일치하는지 확인한다.

관리권이 명확해지기 전에 필수 계약 문서가 없거나 읽을 수 없거나 서로 모순되면 구현하거나 수리하지
않는다. 정확한 불일치를 보고하고 `resume`으로 보낸다. state를 읽을 수 있고 이미 Work에 관리권을
주었다면, 그 불일치를 결정 질문으로 적어 `next_route: direct`를 공개한다.

## 계약 안에서 실행한다

spec을 만족하는 가장 작은 현재 결과 또는 shaping slice를 구현한다. Work는 write boundary 안의
국소 factoring, 이름, algorithm, test 기법을 소유한다. 무관한 dirty bytes를 보존하며 stage하거나
다시 쓰지 않는다.

이 구현과 guardrail이 유지되는지 드러낼 수 있는 check를 실행한다. slice가 안전하면 저장소가 commit을
허용할 때 소유한 변경만 포함하는 집중된 commit을 만들고 그 commit을 `last_safe_point`로 기록한다.
dirty tree는 safe point가 아니다.

구현 중 잘못된 전제, 경계 밖의 필수 변경 또는 `work-state`가 정의한 계약 충돌이 드러나면 마지막
safe point에서 멈춘다. 잘못된 전제, 가장 작은 제안 변경, boundary 영향, 결정 질문 하나를 포함해
`next_route: direct`를 공개한다. 영향을 받는 경계가 Adoption-ready가 아니라면 필요한 Adoption 판단을
`next_action`에 밝힌다. spec은 수정하지 않는다.

shaping 계약이라면 현재 slice만 완성하고 관찰한다. 관찰된 signal과 다음 결정 질문을 가지고
`direct`로 보낸다. 성공한 중간 review는 Verify 실패가 아니다. spec이 이 slice에 대한 중간 risk
criterion을 지정했거나 stop condition이 closure 결과를 acceptance judgment할 준비가 되었다고 말할 때
`verify`로 보낸다.

## 인계를 복구 가능하게 유지한다

다른 actor나 session이 관리권을 받기 전에 실제 safe point와 범위가 정해진 다음 행동 하나로 state를
교체한다. 같은 계약에 범위가 정해진 후속 행동이 있으면 `next_route: work`, amendment 또는 다음
shaping 결정, 상위 판단, 보존할 탐구 또는 사용자 답이 필요하면 `direct`, 독립적인 acceptance judgment
준비가 되었으면 `verify`를 사용한다. `user`는 공통 state 계약이 요구하는 안전 정지에만 사용한다.
`verification.md`나 verdict는 절대 쓰지 않는다.

구현 중 발견한 지속 사실은 공통 state 계약의 `knowledge_candidates`에만 기록한다. 재현 가능한
test와 code는 Verify에 넘길 수 있지만, evidence 파일을 새로 만들거나 verification evidence를 state에
넣지 않는다. shaping handoff의 `next_action`은 Direct에 필요한 범위가 정해진 관찰 signal과 결정
질문만 전달한다. spec이 재현 불가능한 evidence를 이후 Verify session까지 보존하라고 요구하면 보존된
척하지 말고 계약 충돌로 취급하여 `direct`로 보낸다. 후보 기록은 채택이나 canonical write 권한을
뜻하지 않는다.

## 검증이 끝난 tracked Work만 닫는다

공개된 verification이 관리권을 Work로 돌려주면 verdict를 state에 복제하지 않고 criterion evidence를
읽는다. failed 또는 unproven criterion은 verification에 기록된 failure route를 따른다. verification 파일의
존재나 일부 criterion의 `proven`만으로 닫지 않는다.

유효한 tracked Work가 closure condition에 도달하고 모든 필수 criterion이 proven이면 candidate를
채택·기각하거나, pending landing을 새로 반영하거나 재개하거나, Work artifact를 닫기 전에
`references/work-closure.md`를 연다. candidate가 없는 종료도 같은 계약을 따른다. 기존 pending landing은
현재 검증과 종료 자격을 대신하지 않는다.

일반 구현, candidate 기록, failed 검증 수리, closure 전의 shaping·risk 검토와 ephemeral 작업에서는 이
상세를 열기 위한 탐색을 하지 않는다. 확인된 사실을 기존 canonical home에 통합하려면 새 의미·방향,
Domain이나 child 구조, decision identity 판단이 필요하거나 landing home이 없으면 새 문서를 만들어
닫지 않고 필요한 decision route와 질문을 밝혀 `direct`로 보낸다.

## 현재 대화에서 끝나는 작업을 처리한다

ephemeral input에는 `work-state` 모듈을 열지 않고 Work artifact도 만들지 않는다. 관련 canon을 읽고
합의된 경계 안에서 구현하며 합의한 check를 실행하고 현재 session에서 끝낸다. 중단 복구, 지속 지식
결정, 독립 verification 또는 닫히지 않은 risk가 필요해지면 더 진행하기 전에 멈추고, 현재 dirty
delta를 `base_revision: HEAD`로 승격하도록 `direct`로 보낸다.

현재 대화에서 확인된 지속 사실을 합의된 범위 안에서 `.devflow/index.md` 또는 `.devflow/project/`
정본에 직접 반영할 때만 쓰기 직전에 `references/project-knowledge.md`와 해당하는 문서 유형의 계약을 연다.
정본을 수정하지 않는 ephemeral 구현에서는 열지 않는다.

## 인계를 보고한다

다음을 반환한다.

- `Safe point:` commit 또는 `none`, 그리고 남아 있는 소유 dirty path
- `Route와 행동:` 다음 route 하나와 범위가 정해진 행동 하나, 또는 `closed`
- `이탈:` 잘못된 전제, owner 밖의 spec 조항, blocker, candidate, unproven observation, 또는 `none`
- `읽은 범위:` 실제로 연 canonical 및 Work 파일

새 goal을 지시하거나 acceptance를 바꾸거나 독립적인 Verify judgment를 수행하거나 프로젝트 status를
재구성하거나 branch를 조정하거나 유지되는 brownfield source를 흡수하지 않는다.
