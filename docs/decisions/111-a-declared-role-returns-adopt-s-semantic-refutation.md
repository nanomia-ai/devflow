# DD-111 · Adopt의 의미 반증은 선언된 역할이 반환하고, 현재가 아닌 반증 앞에 도착한 승인은 쓰기에 닿지 않는다

- 상태: 유효
- 주제: 브라운필드와 진입
- 도입: v0.25.0
- 날짜: 2026-08-13

관측된 문제: 0.24.0 실사용 Adopt 두 번이 생산자가 공급한 값만으로 비가역 최초 정본 쓰기에 도달했다.
하나는 반증자 브리프를 좁혀 verification means 차단 검사를 범위 밖으로 밀어냈고, 다른 하나는 중단
뒤 재개하자 곧바로 쓰기 계획으로 갔다. 기계 원인은 부재 하나와 누수 하나다. 부재: 반증자는 devflow에서
유일하게 역할로 선언되지 않은 독립 판단자였다. `ROLES`가 비어 있고 반증은 불투명한 `RUN` 액션이라
입력과 제외와 반환이 생산자 자신이 조립하는 산문에만 있었다. 누수: 호출자 값 하나를 묻는 stage BLOCK은
그 호출에 함께 공급된 값 전부를 봉인해 다음 호출로 물려주므로, 반증이 아직 미지일 때 타이핑된
`approval.action=approve`가 반증 질문을 타고 approve 행에 도달해 쓰기 없는 제안서와 그 질문을 건너뛰었다.

바라는 동작: 깨끗한 문맥은 생산자가 저작하지 않은 계약을 받고 선언된 형태로 반환하며, 이 run이 제시한
적 없는 제안서에 대한 승인은 쓰기에 닿지 않는다. Adopt는 여전히 승인 전에 아무것도 쓰지 않고 새 상태와
마커와 복구 규약을 만들지 않는다.

선택 경계: Adopt는 입력과 reads와 judgments와 `refutationResult` 반환 템플릿을 가진 `ROLES.refuter`를
선언하고, 두 반증 분기가 그 역할을 `DISPATCH`한 뒤 `WAIT`하며 브리핑 지시를 나르는 devflow 문장은
없다(v0.25.1. 0.25.0은 역할마다 계약 파일 하나를 썼는데 다섯이 93.7~97.8% 동일했다).
전달 지시는 devflow 에 두지 않는다. ROLE 이 선언된 verify·work 는 그 지시 없이 0.23.3·0.23.8 실전에서 제대로 브리핑했고, 관측된 실패는 ROLE 이 없던 adopt 하나뿐이며 그것은 ROLE 선언으로 닫혔다. 그 문장이 필요하다는 증거가 없다. 브리프는
런타임 자신의 `role` 렌더이므로 좁히는 것이 더는 생산자의 선택이 아니며, 반환의 `coverage` 필드가
산문만으로는 교정 너머로 넘기지 못하던 초기 커버리지를 나른다. `refutation.state`는 Verify의 반환된
판정과 같은 `decided` lane으로 옮겨 Adopt에 생산자 자기판정이 남지 않는다. guard
`approval-precedes-refutation`은 route가 `setup.unmanaged`이고 승인이 `approve`이며 반증이 `clear`가
아닐 때 막는다. guard 정지는 needs를 싣지 않으므로 continuation seal을 만들지 않고, 따라서 이른 승인이
상속되지 않으며 다음 호출은 쓰기 없는 `prepare` 제안으로 떨어진다. Verify와 Arch의 기존 `DISPATCH` 넷에도
브리핑 문장은 없다. 역할이 선언돼 있고, 각 깨끗한 문맥에 필요한 계약은 그 선언을 런타임이 렌더한
것이기 때문이다.

이 경계가 필요한 이유: devflow의 다른 모든 독립 판단은 collector가 읽을 수 있는 자리에 판정을 착지시키는
선언된 역할이고, 다른 모든 승인 경계에는 디스크 관측이 있다. Adopt에는 둘 다 없고 두 번째는 가질 수
없다. 승인 전 쓰기 0은 DD-102와 DD-108과 DD-109가 기록한 결론이므로 재개 세션과 생신 진입을 가르는
디스크 사실이 존재하지 않는다. 가능한 것은 브리프의 저작권을 생산자에게서 걷어내는 것과, 승인을 자기
질문 너머로 나른 seal 창구를 없애는 것이다. 둘 다 저장소가 이미 돌리는 구성물을 쓴다.

기각 대안: 승인 전에 반증과 승인 증거를 프로젝트에 쓰는 것은 DD-109의 기록된 이유를 뒤집는다. coverage
collector는 제안서가 디스크에 있어야 하고 DD-102가 기각한 답안지가 된다. 공용층에 유지 소스 투영을
더하는 안은, 런타임 snapshot basis가 이미 HEAD와 전체 워킹 트리 status와 worktree 목록을 결속한다는 것이
확인되어 철회했다. 호출자 입력 seal을 Decision이 필요로 하는 필드로 좁히는 것이 옳은 수리지만 그 자리는
여기가 아니라 Skill Rails다.

영향 좌표: `skills/adopt/spec.mjs`의 관측치와 guard와 role과 template과 stage 분기와 선언,
`skills/adopt/body.md`, `skills/adopt/references/workflow.md`,
`skills/adopt/templates/refutation-result.md`,
`skills/verify/spec.mjs`와 그 역할 locator 셋, `skills/arch/spec.mjs`와 그 channel-verifier 역할 필드,
같은 project 해석 read를 갖고 있던 `skills/work/spec.mjs`,
그 fixture와 생성 receipt,
`scripts/project-state.test.js`, DD-102와 DD-106 상태, matrix 3.24.

재검토: 생산자가 여전히 역할 브리프를 손으로 조립하거나, 이른 승인이 다시 쓰기 행에 닿거나, 반환된
커버리지를 교정 너머로 대조할 수 없거나, 같은 호출 안의 잔여 승인이 사람 없이 도달 가능해질 때.
