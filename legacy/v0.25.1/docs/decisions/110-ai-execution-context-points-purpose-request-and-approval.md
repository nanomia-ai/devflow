# DD-110 · AI 실행 문맥은 판단 전에 목적·요청·승인을 정본 owner로 가리키고 durable 재진입을 보존한다

- 상태: 유효
- 주제: 지식층과 능력 문서
- 도입: v0.24.0
- 날짜: 2026-09-10

관찰된 문제: 단계 목적·공통 Why·상시 READ의 반복은 상세 자료를 판단 전에 같은 무게로 보였다.
긴 실행의 cold Codex와 Claude는 현재 요청·승인 범위·정확한 owner를 놓쳤다. Product 완료와
Adopt follow-on 같은 정상 경계도 대화 기억이나 ROUTE의 자동 실행을 기대할 수 없으며, 새 세션은
canonical disk state에서 다음 owner를 복원해야 한다.

바라는 동작: 단계의 첫 판단 전에 cold AI가 목적·현재 요청·최근 명시 승인 또는 승인된 제안/카드와
정본 owner/read path를 현재 값의 복사 없이 먼저 붙잡는다. 공통 판단 입력은 Decision 전에, branch
전용 상세는 첫 effect 직전에 도달하고, 새 세션은 canonical disk state에서 다음 owner를 복원한다.

선택 경계: 아홉 intent description과 단계 정체성은 유지한다. Principles policy-index가 이 입력을
현재 owner/read path로 가리키는 문장을 소유하고 여덟 body는 이를 투영한다. 상태 도구는 committed
Product 입력과 현재 byte가 같고 빠진 것이 정확히 Arch 소유 두 파일일 때만 기존 entry data로
`stage:arch`를 보이며 Resume은 그 transient observation을 소비한다. Direct는 현재 요청·승인 범위에
실제 미해결 Design 판단이 있을 때만 Design을 선택하고 current/default style 작업은 Work 방향으로
유지한다. staged knowledge contract는 Adopt whole follow-on을 보존하고 no-follow-on 완료는 DONE이다.
ROUTE는 실행 명령이 아니다. 새 상태·승인·route kind·registry·helper·model/OS 분기는 만들지 않는다.

이 경계가 필요한 이유: 평평하게 반복된 전달은 목적과 승인의 중요도를 가렸고, 대화 연속성과 ROUTE
실행은 durable 사실이 아니었다. 기존 owner와 artifact만으로 salience와 정상 경계 재진입을 함께
복원해야 별도 정본이 생기지 않는다.

기각 대안: byte 수만 줄이면 salience가 복원되지 않고, 모든 reference를 READ_FIRST로 두면 중요도가
계속 평평하다. 아홉 spec 일괄 수정은 공통 owner를 복제하며, 대화 연속성을 복구 계약으로 만들면 두
번째 상태 모델이 생긴다.

영향 좌표: `skills/principles/references/policy-index.md`와 여덟 body projection,
`skills/principles/scripts/project-state.mjs`, Resume collector·spec, Direct spec·body, Adopt body,
Verify spec, 그 fixture·생성 receipt·저장소 검사.

재검토: cold lane에서 owner·승인·필수 read가 빠지거나, 정상 단계 완료 뒤 fresh Resume이 안전한
다음 owner를 못 찾거나, branch 상세가 판단 전에 다시 평평해질 때.
