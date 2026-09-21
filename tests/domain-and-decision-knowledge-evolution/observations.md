# Domain·Decision knowledge evolution 관찰

## Initial handoff와 실제 구현의 차이

- Initial handoff는 현재 Domain 생성 기준을 유지하려 했지만, 작은 Product에서 별도 업무 모델 없이
  Domain을 만드는 실패가 관찰됐다. 문서 분량이 아니라 제품 전체와 구분되는 업무 모델의 상태·규칙·언어를
  독립적으로 판단하고 변경해야 하는지를 기준으로 바꿨다.
- Initial handoff에는 Product 수준의 구속 조건 경계가 없었다. 상세 Domain 규칙의 중복을 줄이는 과정에서
  사용자 약속·업무 계약·규제에서 비롯된 제품 전체 제약까지 사라질 위험이 드러나 이를 Product 의미에
  포함했다. 구현 수단 선택에서 생긴 기술 제약은 Architecture에 남긴다.
- Initial handoff는 landing 대상이 없거나 분류가 모호하면 owner route로 보내도록 했다. Work가 새 문서를
  만들어 닫지 않게 하면서도 의미 유형을 가릴 수 없는 경우의 유효한 route가 필요해, 사실과 후보 owner를
  보존하여 `direct`가 실행 경계를 다시 정하도록 했다.
- Initial handoff의 결제 사례는 결제 parent와 환불·정산 child를 예상했다. 실제 입력에서 각각 독립된
  상태·규칙·계약을 소유할 수도 있으므로 고정 구조를 요구하지 않고, 업무 모델의 독립성에 따라 child 또는
  형제 Domain을 선택하도록 바꿨다.
- Initial handoff는 계속 관리되는 외부 자료의 연결과 접근·변경 시 재확인을 넓게 예상했다. 프로젝트가
  소유한 의미와 프로젝트 밖에서 정해지는 자료를 구분하고, 자료의 접근이나 변경이 실제 판단을 바꿀 때만
  재확인 조건을 두도록 좁혔다.
- Initial handoff는 외부 자료마다 질문과 검토 방법을 함께 보존하려 했다. 실제 구현은 모든 링크에 검토
  절차를 붙이지 않고, 채택한 범위·해석·제약과 판단을 바꾸는 재확인 조건만 내부 canon에 남겼다. 이
  축소는 독립 Git fixture의 Adopt에서 외부 URL과 내부 제약을 함께 보존하는 것으로 관찰했다.
- Initial handoff는 Work artifact의 자기완결성만 보고 `project-knowledge`를 Work에 연결하지 않았다.
  이후 Work가 확인된 사실을 프로젝트 정본에 직접 쓰는 경로를 함께 검토하자, 문서 유형별 계약만으로는
  하나의 canonical path와 외부 자료 경계 등 공통 지식 계약에 도달하지 못하는 공백이 확인됐다. 모듈
  본문은 늘리지 않고 Work가 `.devflow/index.md` 또는 `.devflow/project/`에 실제로 쓰기 직전에만 조건부로
  읽도록 연결했다. Work의 spec·state·verification과 정본을 쓰지 않는 구현에는 적용하지 않는다.

## Proven

- 작은 도서관 입력은 Product만 만들었고, 대여 상태·규칙·언어를 독립적으로 소유하는 입력은 Product와
  `domains/circulation/index.md` 하나를 만들었다. 두 fixture 모두 별도 `.git` 경계에서 실행했으며
  Architecture·Design placeholder와 불필요한 child는 만들지 않았다.
- 결제·환불·정산 입력은 각각 독립된 상태·규칙·계약을 소유한다고 판단하여 세 형제 Domain으로 구성했다.
  결제 Domain의 종속성만으로 환불이나 정산을 child로 고정하지 않았다. 학교 계약 예외 입력은 같은 대출
  모델을 유지하면서 일반 대출 독자가 건너뛸 수 있고 계약 변경 때 독립적으로 검토되는 concern만
  `domains/library-lending/school-partnership.md` child로 분리했다. parent가 공유 상태를, child가 적용 범위,
  예외 규칙, 계약과 parent route를 소유했다.
- 특정 provider가 업무 계약에서 요구된 Product를 Architecture가 다시 읽었을 때, 더 저렴하고 운영성이
  좋은 대안이 기술 입력에 있어도 계약 provider를 유지했다. 구현 수단인 outbox는 Architecture가 골랐고,
  재검토 조건이 실제로 충족된 다음 실행은 같은 `decisions/001-transactional-outbox.md`를 교체하면서
  Architecture의 현재 규칙도 함께 갱신했다. Product와 Domain은 변경하지 않았다.
- Work는 검증된 재활성화 사실을 기존 Domain 업무 child에 통합하고 artifact를 닫았다. 별도 fixture에서는
  확인된 계약 사실이 새 회원 상태와 자격 규칙을 요구하자 canon을 바꾸지 않고 state를 `next_route:
  product`로 교체했다.
- Adopt는 내부 README·운영 prose의 현재 의미를 Product와 Architecture에 흡수했다. Stripe와 PCI DSS는
  외부 출처 URL로 남겼고, 프로젝트가 채택한 검토 조건과 카드 데이터 비저장 제약은 내부 Architecture에
  보존했다. 모순된 중복 보장 기간과 정의되지 않은 용어는 사용자 결정을 받은 뒤 닫았으며, 삭제를 명시적으로
  허가받은 세 prose만 제거하고 code·configuration·repository instruction은 유지했다.
- 위 행동 fixture에는 각각 독립된 `.git`과 비활성 hook 경계를 사용했고 관찰 기준을 acting agent에게
  제공하지 않았다. `project-knowledge`, `product-document`, `decision-document`의 consumer와 Work의
  조건부 import도 source graph에서 확인했다.
- 최종 Product 재검증의 circulation fixture는 `.devflow/project/product.md`에 대여 자격과 도서 가용성을
  지키고 반납된 책을 다시 대여할 수 있게 한다는 결과 수준의 약속과
  `domains/circulation/index.md` route만 남겼다. 반납 후 도서 가용 상태와 연체 도서를 모두 반납한 뒤의
  자격 복구는 Domain에만 기록했다.
- 최종 Provider P fixture는 `.devflow/project/product.md`에 판매자와의 출시 계약에서 비롯된 Provider P
  지정과 재검토 조건을 보존했다. 결제·환불·정산의 상태와 규칙은 각각
  `domains/payments/index.md`, `domains/refunds/index.md`, `domains/settlements/index.md`에만 두었고,
  전달·저장 수단은 선택하지 않았다.
- 독립 Git fixture의 Work는 검증된 active·suspended 자격 사실을 기존
  `domains/lending/eligibility.md`에만 통합하고 완료된 Work artifact를 제거했다. 새 업무 의미나 문서
  경로를 만들지 않았고 `node --test`와 깨끗한 closure commit을 남겼다.
- 최종 관리권 fixture에서 Verify는 실행 테스트가 통과해도 retry owner와 허용 시도 수를 정한
  Architecture가 없어 해당 criterion을 `unproven`으로 남겼다. `verification.md`의 실제 판단 owner는
  `architecture`, Work state의 관리권은 `direct`로 분리했다. Direct는 Work artifact를 바꾸지 않고
  Architecture 질문을 반환했고, Architecture는 자기 정본만 갱신해 일반 종료 규칙으로 Direct에
  돌아왔다. Direct는 변경된 canon과 기존 spec·verification을 대조해 계약을 갱신하고 stale verification을
  제거한 뒤 `work`를 게시했다. 이어진 Work는 구현을 새 경계에 맞추고 4개 테스트를 통과한 safe point를
  만든 뒤 `verify`를 게시했다.

## Failed

- 수정 전 작은 Product 사례는 독립된 업무 모델이 없는데도 중복 Domain을 만들었다. 이 실패를 근거로
  Domain 생성 기준을 Product만으로 담을 수 없는 지속적인 업무 모델로 좁혔다.
- 결제 사례의 한 실행은 Product와 세 Domain에 상세 업무 규칙을 반복했다. Product가 약속과 구성을
  보존하되 Domain 상세를 복제하지 않도록 삭제 기준의 모순을 바로잡았다.
- 후속 결제 실행은 독립 `.git`이 없는 하위 폴더에서 수행되어 상위 devflow repository를 Git root로
  사용했다. hook 실패가 전체 diff를 반복 처리해 과도한 CPU·memory·출력을 일으켰으므로 이 실행의
  성능·안정성과 생성 문서는 완료 증거에서 제외한다.
- 구조 결론을 brief에 미리 적은 초기 Product 사례는 스킬의 판단을 관찰하지 못하므로 증거에서 제외한다.
- 대출 서비스와 Work의 이전 실행도 독립 `.git` 경계가 없었으므로 최종 행동 증거에서 제외한다.
- `.tmp/final-fresh/architecture-provider` 실행은 Product와 기술 입력이 provider 소유자를 미리 정해
  스킬의 경계 판단을 관찰하지 못했으므로 증거에서 제외한다.
- 관찰 기준 파일을 acting agent가 함께 읽은 실행은 기대 결과가 입력에 섞였으므로 최종 행동 증거로
  사용하지 않는다.
- 최초 Work 관리권 roundtrip fixture는 `next_action`에 기술 판단과 Work 반환을 함께 적어 반환 행동을
  일부 유도했고 한 행동만 두는 state 계약에도 맞지 않았다. 이 실행은 최종 관리권 행동 증거에서 제외하고,
  반환 지시를 제거한 같은 의미의 독립 fixture를 한 번만 다시 실행했다.
- 그 정정 실행도 Architecture가 Work state를 직접 `work`로 바꾸는 이후 폐기된 receiver 설계를
  관찰한 것이므로 최종 관리권 계약의 증거에서는 제외한다. 결과를 삭제하지 않고 중간 설계의 관찰로만
  보존한다.
- 첫 Direct broker fixture의 Work state는 `next_action`에 필요한 decision route를 적지 않고 기술 경계를
  단순 write-boundary 승인처럼 제시했다. Direct가 Architecture를 거치지 않은 결과는 source 결함을
  판별할 수 없는 잘못된 입력이므로 `unproven`으로 제외했다.
- 최종 fixture의 첫 Resume는 state의 `next_route: direct`와 verification의 `failure_route: architecture`를
  불일치로 오해해 `architecture`를 보고했다. Resume 규칙 5가 두 의미를 구분하지 않은 source 결함으로
  확인되어 같은 위치의 문장 하나를 좁혔고, 새 세션은 `direct`를 보고하며 파일을 바꾸지 않았다.
- 정정 fixture를 준비하면서 상위 저장소에 로컬 `core.hooksPath`가 잠시 설정된 harness 실수가 있었다.
  source와 fixture 실행 전에 설정과 빈 디렉터리를 즉시 원복했으며, 이 상위 저장소 조작은 행동 증거에서
  제외한다.
- 수정 전 final fixture 두 개에서 Product–Domain 상세 중복이 같은 형태로 반복됐다. circulation Product는
  반납 뒤 도서 가용 상태와 연체 해소 뒤 자격 복구를, school-partnership Product는 연체 해소가
  suspension을 해제하지 않는다는 불변식을 Domain과 함께 서술했다. 따라서 당시 비중복 계약은 한 번의
  경미한 흠이 아니라 `failed`였고, source 수정 전 판정은 partially resolved에 그쳤다.
- 최종 school-partnership 재검증은 `domains/lending/index.md`와
  `domains/lending/school-closure-extension.md`에 공통 상태와 계약 예외를 올바르게 분리했지만,
  `.devflow/project/product.md`에도 “연체 도서를 모두 반납하면 연체로 인한 제한은 사라지지만, 회원 정지는
  별도 상태로 유지된다”를 반복했다. 제품 약속과 Lending route는 남겼으나 이 문장 때문에 해당 fixture의
  Product–Domain 비중복은 `failed`다.

## Unproven

- 복수 Domain의 독립성이 명확한 사례와 동일 모델 안의 조건부 child는 관찰했지만, 경계가 모호한 실제
  업무에서 모델들이 일관되게 같은 구조를 고르는지는 확인하지 않았다. 최종 source는 circulation에서
  상세 중복을 제거했지만 school-partnership에서는 한 불변식을 다시 서술했으므로, Product–Domain 비중복의
  모델 간·실행 간 일관성은 여전히 `unproven`이다. 이미 같은 사실을 Domain에 두고 Product에 결과 약속과
  route만 남기도록 한 두 기준을 특정 표현 사례의 금지 목록으로 확장하지 않았으며, 같은 실패가 다시
  반복되면 결과 수준의 약속 경계를 재검토한다.
- Work가 landing의 의미 유형을 끝내 분류하지 못해 `direct`로 보내는 행동은 실행하지 않았다.
- 관련 규칙의 재검토 조건에서 Decision을 발견하고 교체하는 행동은 관찰했지만, 무관한 변경이 Decision을
  열지 않는 행동은 별도 실행으로 확인하지 않았다.
- 실행 중 Work가 정본 쓰기 직전에 `project-knowledge`를 연 장면은 관찰했지만 저장된 최종 결과만으로
  reference를 연 정확한 시점을 다시 입증할 수는 없다. 정본을 수정하지 않는 Work가 이 모듈을 열지 않는
  행동도 별도 실행하지 않았다.
- Product·Design·Adopt·Sketch와 사용자 답을 거치는 Direct broker 조합은 실행하지 않았다. 단계 사이에서
  프로세스가 중단되는 경우의 복구와 다른 host·모델에서 같은 관리권 해석이 유지되는지도 확인하지 않았다.
- 대형 monorepo, 장기 운용, 다른 host와 모델에서의 일관성 및 실제 사용자 효과는 확인하지 않았다.

이번 최종 `product-document` 수정의 직접 consumer인 adopt, product, work를 각각 double-build하고
check했으며 모두 `artifactIntact: true`, `sourceCurrent: true`였다. 두 build의 target별 tree hash도
일치했다. build, hash와 source graph 결과는 전달 증거이며 위의 행동을 대신 입증하지 않는다.

후속 Work 정본·관리권 연결은 영향받은 아홉 target을 source에서 각각 double-build했다. Resume의
관리권·판단 owner 구분을 보완한 뒤 Resume도 다시 double-build했다. 모든 target의 두 tree hash가 일치했고 최종 check는
`artifactIntact: true`, `sourceCurrent: true`였다. 생성물을 직접 편집하지 않았으며, 이 결과도 전달
정합성만 증명한다.
