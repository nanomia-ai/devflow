# DD-94 · 정확한 제목의 작업 커밋 뒤에는 미확정 증거가 COMMIT만 금지하고, 증거가 닫히고 상위 문서 환류가 없거나 호환 집합이 전부 소비됐을 때 경계 커밋 하나가 늦은 탈것이 된다

- 상태: 유효
- 주제: 작업 트리와 카드
- 도입: v0.20.0
- 날짜: 2026-09-02

관측된 문제: 첫 그린필드 실사용 카드가 정본의 정확한 H1 제목으로 작업 커밋을 만든 뒤 검토와
`carry`가 아직 없자, work의 `boundary-incomplete` 관문이 모든 stage보다 먼저 영구 `BLOCK`했다.
그 결과 빠진 증거를 만들 수 있는 `review-reduction` 자체가 닿지 않았다. 이 관문을 단순 제거해
늦은 검토를 붙인 재현에서는 다른 소실이 드러났다. 유효한 `carry:` 뒤에 `review result:`를
덧붙이자 상태 도구가 진행 줄 전체의 마지막 줄만 읽어 물리적으로 남은 carry를 `absent`로
바꿨고, work는 같은 carry를 한 번 더 쓰려 했다. 이 사실은 `missing`과 현재 점유뿐 아니라 능력
폐쇄의 `children-done carryFacts`에서도 조용히 사라졌다.

원하는 동작: 정확한 H1 작업 커밋은 하나만 유지하고, 그 뒤에도 커밋하지 않는 완료·검토 증거
생산자는 닿을 수 있어야 한다. 한 증거 종류의 늦은 줄이 다른 종류의 유효한 사실을 철회하지
않는다. 증거가 닫힌 뒤에도 `feedback.action`이 미판정 또는 UNKNOWN이면 모든 경계 효과보다 먼저
그 판단을 요구한다. `none`은 기존 경계 커밋에 빠진 carry와 claim→done 이동을 싣는다.
`compatible`은 정확한 제안이 처음 보이거나 current인 동안 기존 의미 소유자 경로를 마쳐야 하며,
모든 정확한 lifecycle이 `consumed`이고 현재 카드의 current marker가 없을 때만 같은 경계 탈것으로
닫힌다. UNKNOWN·current·never-seen compatible 상태와 그 밖의 관측된 환류 값은 닫히지 않는다.

선택한 경계: 기존 `boundary-incomplete` BLOCK을 없애고, 작업 커밋이 이미 있으며 통합과 HANDOFF가
현재이고 finish-boundary 증거가 미확정인 동안 **`COMMIT` 동사만** 금지하는 `RESTRICT` 관문 하나로
바꾼다. 증거만 쓰는 완료 신호와 독립 검토는 계속 진행하지만, checkpoint나 두 번째 작업 커밋을
품은 갈래는 기계적으로 막힌다. 완료가 `pass`이고 검토가 `pass`·`waived`·`not-applicable` 중
하나로 닫힌 뒤에도 미판정 또는 UNKNOWN `feedback.action`은 경계 표보다 먼저 필요한 판단을 이름으로
대는 `BLOCK`으로 돌아간다. 판단이 알려진 뒤 `feedback.action=none`인 기존 두 행은 그대로다.
carry가 없으면 한 줄만 쓰고 claim→done 이동과 함께 경계 커밋에 싣고, 이미 있으면 다시 쓰지 않고
이동만 싣는다. `feedback.action=compatible`에는 DD-96 위에 세운 정확한 lifecycle을 소비하는 두 행이 더
있다. 모든 제안이 `consumed`이고 현재 marker가 없을 때만 같은 두 효과를 재사용하며, never-seen은
정본 transport를 먼저 쓰고 current는 Resume으로 계속 라우팅하고 UNKNOWN·invalid는 차단한다.
그 밖의 알려진 non-`none` 환류는 기존 `pending`의 `REPORT→WAIT`에 남는다.

같은 변화에서 `carryState`는 전체 진행 줄의 마지막 줄이 아니라 **마지막 유효 carry-kind 줄**을
고른다. signal과 review가 이미 쓰는 종류별 최신값 의미와 같으며, 잘못된 뒤쪽 carry 줄은 기존
`integrity.shape`로 계속 보이되 앞의 유효한 carry를 가리지 않는다. work collector의 구조화된
상태가 없는 fallback도 같은 선택을 쓴다. 상태 도구는 계속 읽기 전용이고 새 field·zone·형식·
writer를 만들지 않는다.

필요한 이유: `RESTRICT`는 판단값마다 복구 stage를 늘리지 않고 실제로 위험한 효과만 거부하므로
증거 생산자와 한 작업 한 커밋을 함께 보존한다. 종류별 마지막 유효 줄은 carry만 갖던 손실성
특례를 없애고 `missing`, 점유, 폐쇄 수확의 한 정본을 함께 고친다. 경계 커밋은 이미 HANDOFF와
상태 이동을 함께 싣는 공유 탈것이라 별도 커밋이나 writer를 만들지 않는다. DD-09·DD-15·DD-83은
그대로 유효하며, 이 결정은 DD-83의 두 재검토 조건 — 도구가 누락을 정확히 잡고도 같은 세션이
닫지 못한 장면, 실제로 있는 carry를 `missing`이라 부른 장면 — 에 대한 유계한 답이다.

기각한 대안: compatible 행을 `missing`까지 범용으로 넓히기 — 도입 당시 durable producer가 없어
기존 work→resume→work 무효과 순환만 넓혔다. 판단값별 recovery stage·conflict 행 추가 — 같은
COMMIT 위험과 기존 pending 동작을 중복한다. 두 번째 H1 또는 post-title checkpoint — DD-09를
어기고 마지막-card-commit 인식을 지운다. collector만 수리 — `missing`과 폐쇄 수확의 소실을
남긴다. carry를 다시 마지막에 쓰기 — 중복을 의도적으로 만든다. 새 carry field나 별도 boundary
writer — 한 사실 두 집과 새 권한을 만든다.

후속 출처 정정(DD-96): 위 `compatible` 기각과 none-only 경계는 durable producer가 없다는
DD-94 도입 당시 전제에 의존했다. DD-96의 정본 `compatible feedback pending` transport와 정확한
never/current/consumed lifecycle은 DD-94가 기록한 「durable producer가 생겨 pending 경로를 끝낼
수 있을 때」를 충족하므로 그 전제는 더 이상 consumed 상태에 적용되지 않는다. 이 정정은 범용
`compatible` 폐쇄를 허용하지 않는다. 증거 생산자는 계속 닿고, 미확정 증거에는 COMMIT이 금지되며,
정확한 H1 작업 커밋 하나·경계 탈것 하나·새 writer 없음은 유지된다. UNKNOWN·current·never-seen
compatible 상태도 계속 닫히지 않는다.

영향 좌표: `skills/work/{spec.mjs,body.md,fixtures/scenarios.json,collectors/index.mjs}`,
`skills/work/collectors/project-state-seam.test.mjs`,
`skills/principles/scripts/project-state.mjs`,
`skills/principles/references/delivery/commit-and-verification.md`,
`scripts/project-state.test.js`. 호환 환류 transport의 소유권은 DD-96에 남고, 이 결정은 그 정확한
consumed lifecycle이 늦은 경계를 끝내는 효과만 인정한다. 자동 활성화 gate는 이 결정 밖이다.
재검토 조건: 마지막 carry-kind 줄이 현재 사실이 아닌 공인 작성 흐름이 관측되거나, 늦은
증거-only 쓰기가 두 번째 작업 경계를 요구함이 실측되거나, DD-96의 정확한 consumed lifecycle이
pending 경로를 결정적으로 끝내지 못할 때. durable producer가 생기는 기존 조건은 DD-96으로
충족되었다.
