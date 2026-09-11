# DD-105 · 제안 독자는 확인을 묻기 전에 입력 소유자의 K 깊이를 유계 발견한다

- 상태: 유효
- 주제: 지식층과 능력 문서
- 도입: v0.23.12
- 날짜: 2026-08-13

관찰된 문제: 소유 문서는 항상 읽는 지도이므로 현재의 재사용 가능한 세부가 같은 stem K에만 있는 것은
정상이다. 그러나 Arch는 Product를 기획 입력으로 읽으면서도 자기 승인 경계의 arch/K만 투영했고,
Design도 Product와 Architecture를 읽으면서 design/K만 투영했다. 따라서 cold reader는 선언된 입력
효과를 모두 지키고도 적용되는 입력 소유자 깊이와 모순되는 선택을 제안할 수 있었다.

선택 경계: 한 단계가 다른 소유자의 지도를 사용자가 확인할 제안의 입력으로 쓰면, 기존 소유자 유계
개봉 계약으로 그 입력 소유자의 K 머리말을 먼저 투영하고 첫 줄 use-when이 현재 판단에 맞는 깊이만
연다. Arch는 read-inputs에서 Product에 적용한다. Design은 제안과 확인 전에 Product와 Architecture에
적용한다. 입력 K를 읽는 것은 작성 권한을 주거나 각 단계의 전문 판단 표면을 바꾸지 않는다.

새 index 모델이 아닌 연장인 이유: DD-92의 소유자 지도·같은 stem K·자식 0 유효성·동적 투영·상태 없는
hook과 DD-104의 물리 작성자·확인 묶음은 그대로다. 빠진 것은 독자 쪽 시점의 간선이며, 기존
`project --under` 투영과 policy-index routing이 이미 유계 실행 수단을 제공한다. 영속 index·전역 scan·
상태 predicate·classifier·registry·stage·새 소유자는 만들지 않는다.

영향 좌표: 공유 capsule 계약, Arch의 read-inputs spec·판단 본문·artifact 선언·intent·ledger·
fixture, Design의 proposal/confirmation spec·판단 본문·artifact 선언·intent·ledger·fixture, 매트릭스
3.18, plugin manifest, CHANGELOG, v0.23.12 구현 보고. Adopt와 Product 생성, capability design, Direct,
Work, Verify, Resume, hook, project-state, project-knowledge, writer 승인 동작은 바뀌지 않는다.

재검토: 제안이 입력 소유자 아래의 적용 가능한 현재 깊이를 계속 놓치거나, 유계 머리말 투영이 무관한
소유자 tree나 본문 선개봉을 강제하거나, K가 0인 소유자가 정상 기획을 막거나, 입력 읽기가 그 소유자 K의
작성 권한으로 오해되는 실제 장면이 관측될 때.

## 기각된 안 — 정체성 · 배포 · 플랫폼

- **[DR-03 · v0.7.0]** **훅의 journal 주입** — resume이 읽는 것의 중복.
- **[DR-44 · v0.13.0]** **규칙 정본의 소비자별 분할** — 기각이 아니라 보류다. 실패 방식이 나쁘다 — work가 필요한
  규칙이 verify 전용 제목 아래로 가면 아무 에러 없이 사라진다. 결함 열 건을 함께 수리하는
  릴리스에 섞으면 어느 변경이 무엇을 깼는지 가릴 수 없다.
