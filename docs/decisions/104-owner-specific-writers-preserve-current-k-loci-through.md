# DD-104 · 소유자별 작성자는 승인·실행·상승을 거쳐 현재 K 위치를 보존한다

- 상태: 유효
- 주제: 지식층과 능력 문서
- 도입: v0.23.11
- 결정일: 2026-09-06
- 최종 수정: 2026-09-06

관찰된 문제: DD-92 C4와 DD-97의 관리 갱신 표현은 v0.23.9가 Product·Architecture·Design·Capability를
서로 다른 의미 소유자로 정한 뒤에도 Arch가 모든 관리 K의 물리 작성자인 것처럼 읽혔다. Product와
Design은 기존 같은 소유자 K를 보거나 갱신하지 않은 채 소유 문서 변경을 승인할 수 있었고, Direct는
대상 능력의 머리말만 투영했으며, Work는 Research 카드에서만 지식 상승을 판단했다. 따라서 K가
stale해지거나 실행에 필요한 읽기가 빠지거나 일반 카드의 출처 있는 현재 결론이 조용히 사라질 수 있었다.

선택 경계: 공유 핵심 문서 계약이 하나의 확인 묶음을 소유한다. 작성자는 확인하는 소유자의 기존 K
머리말을 유계 투영하고, 이미 소유된 단위는 정확한 현재 위치에 두며, 바뀐 모든 위치를 승인·쓰기·검증·
같은 커밋까지 나른다. 새 K는 기존의 독립 독자/변경 이유 또는 소유자 지도 overflow 경계에서만 생긴다.
물리 권한은 좁다. Product는 product.md와 product/K, Design은 design.md와 design/K, Arch는 arch/K와
관리된 능력 설계 구역/K, Adopt는 최초 무관리 투영에서만 모든 소유자를 쓴다. Direct·Work·Verify는
K를 쓰지 않고, 기존 Arch/Adopt 지식 마커는 그 마커가 지정한 정확한 의미 소유자/K 묶음만 위임한다.

Direct는 필요한 현재 Layer 0 소유자, 대상 능력, 명시 crosscut 소유자의 유계 머리말 투영에서 카드의
정확한 읽기를 고른다. 머리말의 use-when을 카드 Destination·target과 대조하며, affected owners는
유계 힌트이지 유일한 gate가 아니다. Work는 Research checkpoint를 유지하면서 일반 작업도 정확한
제목의 커밋이 통합되고 완료·검토·handoff 증거가 현재인 뒤 판단한다. 이미 커밋된 카드 출처에 있는
결론만 기존 journal 마커로 내며, 뒤늦은 무출처 결론은 보고하고 Direct로 돌려보낸다. 재사용 변화가
없는 카드는 마커를 만들지 않는다.

새 모델이 아닌 정정인 이유: 의미 소유권, 같은 stem 재귀 K, 출처 provenance, 기존 마커 문법과 원자적
착지는 그대로다. 새 상태 field·predicate 계열·registry·index·classifier·validator·marker 계열·scan·
교차 단계 transaction을 만들지 않는다. Product·Architecture·Design·Direct·Work의 고유 목적도
유지하고 공통 규칙은 durable owner/K 결과 경계에만 적용한다.

영향 좌표: Principles의 owner·writer·routing·capsule·policy-index 참조, Product·Design·Arch·Direct·
Work P2 source·fixture·ledger·생성 receipt, 매트릭스 3.17·3.18·3.20·3.21, 플러그인 manifest,
CHANGELOG, v0.23.11 구현 보고. DD-92 C1–C3·C5–C6의 이유와 DD-97의 무관리 Adopt/관리 Arch routing
이유는 계속 유효하고 물리 K 작성자를 전칭한 표현만 여기서 좁힌다. DD-103은 당시 정정을 참되게
기록하므로 소급 편집하지 않는다.

재검토: 소유자 변경이 커밋되는데 바뀐 기존 K가 stale로 남거나, Direct가 카드 의존성을 찾으려고
무관한 소유자를 scan해야 하거나, 일반 카드의 출처 있는 재사용 결론이 사라지거나, 물리 작성자 경계가
정확한 마커 지정 의미 소유자의 원자적 착지를 막는 실제 장면이 관측될 때.
