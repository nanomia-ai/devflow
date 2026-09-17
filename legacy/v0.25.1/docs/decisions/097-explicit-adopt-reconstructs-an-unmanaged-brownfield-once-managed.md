# DD-97 · 명시 Adopt는 무관리 브라운필드를 한 번 역산하고, 관리 상태의 기술 갱신은 Arch가 맡는다

- 상태: 유효 · 일부 정정 → DD-101 (v0.23.7), DD-103 (v0.23.10), DD-104 (v0.23.11), DD-108 (v0.23.16)
- 주제: 브라운필드와 진입
- 도입: v0.21.0
- 날짜: 2026-09-03

관측된 문제: 코드가 있는 깨끗한 세 작업 트리에서 사용자가 Adopt를 명시했지만 설치된 진입
문구는 Codex에 Principles부터 실행하라고 했고, Adopt는 상태 도구의 `setup.unmanaged`를
허용하지 않았다. 그 결과 Principles는 Resume으로 보냈고 Resume은 쓰기 없이 무관리 상태를
정상 종료했다. 더 능동적인 모델 하나만 런타임 소스를 읽고 빈 `.devflow/` 폴더를 만들어
빠져나왔는데, 이는 DD-95가 기각한 두 번째 도입 마커다. 누락 경로를 추가한 뒤에도 Adopt가
물려받은 단계 필드는 모델에게 실제 일을 하게 하지 않고 읽음·검사·역산·제안 완료를 스스로
보고하게 했다. 파일명 모양의 문서 선택과 “코드가 있음”은 문서 증거와 대표 흐름 증거를
대신했다. 넓은 fallback은 브라운필드 설계 마커와 기준선 갱신에서
`Resume → Adopt → Resume` 순환도 만들었다.

원하는 동작: 명시 도입 요청은 소유자가 선택한 목적에서 바로 시작한다. 유지 문서 또는 코드가
이미 표현하는 제품·기술·해당 제품 디자인과 완전한 지식 표면을 역산하고, 편한 일부만 뽑지
않고 모든 유지 자료를 다룬다. 뒤의 차가운 유지보수 세션에 충분한 용어집과 도메인 구조를
만들며, 증거로 해소할 수 없는 것만 사람에게 묻고, 하나의 일관된 쓰기 집합을 확인받은 뒤
끝낸다. 관리된 프로젝트는 구현이 devflow보다 먼저 존재했다는 이유만으로 최초 도입을 다시
거쳐서는 안 된다.

채택 경계: 이름을 명시한 devflow 단계는 그 자체가 진입이다. Principles는 Principles로 들어온
요청만 분류하며 SessionStart와 Codex fallback도 같은 위상을 말한다.
**v0.23.1 경계 명료화:** 이름을 명시한 단계가 자체 진입의 항상 읽는 purpose에서 Principles의 공통 정책 색인을
여는 것은 정책 소비이지 분류기 사전 진입이 아니다. 이로써 정책 정본 하나를 유지하면서도 명시
단계의 목적 선택은 바꾸지 않는다. 명시 Adopt는 devflow 이전의
유지할 프로젝트 자료가 문서 또는 코드로 존재할 때 `setup.unmanaged`를 직접 소비한다. SessionStart는 `.devflow/project/product.md`가 없으면
침묵한다. 정본 상태에서도 추적되지 않은 빈 폴더나 일부 `.devflow/` 경로만으로는 관리 프로젝트가
되지 않으며, index 또는 이력의 `.devflow` 경로만 복구 증거로 남는다. 폴더 하나는 Resume 안내를
발동하거나 명시 Adopt의 무관리 경로를 바꾸지 못한다.
그런 자료가 전혀 없는 저장소만 Product로 보낸다. collector는 정본 상태와 유계한 자료 존재만
관찰한다. 모델은 모든 유지 구현·
테스트·API·스키마·설정·문서·명세·운영 자료를 조사하고, 각각에 이름 난 착지, 보조 증거,
대체·모순, 이유 있는 비도메인 제외, 또는 드러난 미해결 중 하나를 부여한다. 코드로 뒷받침되는
능력 후보마다 실행 가능한 흐름 하나를 추적한다. 유지 문서에만 존재하는 능력은 그 출처를 드러내고
실행 증거를 지어내지 않은 채 역산한다. 주장과 모순을 대조해 Product, Architecture, 해당 시 Design, code
style, glossary, 능력 설계 구역과 깊은 영속 도메인 지식에 필요한 모든 소유자 인접 K를 역산한다.
K가 0개인 것은 모든 유지 도메인 자료가 상시 읽는 소유자에 완전히 착지했음을 보일 때만 유효하다.
  완전한 제안 하나가 소유자의 구속 승인보다 먼저다. 거절이나 승인 전 중단은 쓰기 0이다. 그 승인
  하나 아래 뒤따를 작업은 Principles의 정본 유지보수 라우팅 기록으로 보존하고 `product.md`를 Layer 0
  소유자 문서 중 마지막에 쓴다. Product·Architecture·Design 소유 K를 각 소유자 문서 옆에 쓰고
  검증한 뒤 완전한 Layer 0 경계를 `adopt — layer 0`으로 먼저 커밋한다. 그 착지 커밋에서 정본
  Design head를 계산한 뒤 그 값을 담은 능력 문서와 능력 소유 K를 각 소유자 문서 옆에 쓰고 검증해
  완전한 경계를 `adopt — capabilities`로 커밋하고 Product, Arch, Design, Split, Resume을 대신 선택하지 않고
  끝낸다. `product.md` 쓰기 전 중단은 무관리 상태다. 그 쓰기와 첫 커밋 사이의 중단은 어느 단계도
  소유하지 않는 미검증 dirty 경계이므로 정확한 승인 경계의 커밋 또는 폐기를 사람이 정한다. 첫
  커밋 뒤 두 번째 경계 쓰기 전은 기존 관리 상태의 기준선 누락이므로 Resume이 Adopt 재개 없이
  Arch로 보낸다. 첫 커밋의 Architecture `Existing records`에는 두 번째 경계를 원자료에서 다시
  유도할 좌표·권위·처분·착지 소유자가 이미 남아 있다.

문서 권위는 가정하지 않고 역산한다. 문서 내부 상태와 이를 뒷받침하는 코드·테스트·운영 증거,
경로 맥락, Git 이력, 마지막 수정 시각으로 현재 구현, 구속 기획, 탐색적 리서치, 대체된 기록,
미해결 충돌을 구분한다. 파일명·폴더·시각은 조사 단서이지 단독 권위가 아니다. 결합한 증거로 닫히는
불일치는 출처를 남기고 능동적으로 종합하지만, 현재 의도를 결정할 수 없는 충돌은 경쟁 좌표와
사람에게 필요한 정확한 결정을 제시해 묻고 상상으로 채우지 않는다.

Layer 0이 생긴 뒤 현재 기술 설계의 소유자는 Arch 하나다. Resume은
`marker.glossary-term`, `marker.design-note`, `marker.design-open-item`, `baseline.legacy-v010`,
  `baseline.design-refresh`를 역사적 브라운필드 필드와 무관하게 Arch로 보내며 Arch는 이 관리
  상태 갱신을 Adopt로 되돌리지 않는다. 앞의 진입·멤버십 절은 DD-92의 옛 전 진입 사전 분류 문구와
  DD-95의 폴더 존재 활성화 문구를 정정하며, 상태 소유자 하나·조용한 전역 설치·index/이력 복구
  근거는 유지한다. 관리 상태 기술 갱신 경계는 DD-43과 DD-88의 기원 기반 작성자 절만 정정한다.
정확한 능력 소유자, 귀속 마커, byte 동일 소비, 설계/검증 byte 경계, 준비 작업보다 앞선 우선순위는
그대로다. 옛 기원 분리는 Adopt가 Arch에서 갈라지기 전에는 이유가 있었지만 DD-20 뒤에는 현재
산출물 하나에 절차 소유자 둘을 만들며 이제 실제 순환까지 관측됐다. 브라운필드 필드는 여전히
도입 전 기원을 기록하고 DD-26대로 Resume의 기존 구현 소급 생성을 막는다.

**v0.23.9 소유자 경계 정정:** DD-92는 Product·Architecture·Design·Capability를 같은 stem K tree의
의미 소유자로 정했다. 따라서 DD-76의 동일 커밋 소유자 규칙은 소유자 종류마다 적용된다. 최초
Adopt는 Product·Architecture·Design 소유 K를 Layer 0과 함께 `adopt — layer 0`에 착지시키고,
능력 소유 K는 능력 문서와 함께 `adopt — capabilities`에 착지시킨다. 관리 상태의 모든 캡슐 갱신은
계속 Arch가 맡는다.

**v0.23.16 staging 정정:** 최초 Adopt는 모든 owner와 same-owner K를 첫 커밋 전에 완성·검증한 뒤
capability `Design head: none`과 함께 전부 `adopt — layer 0`에 착지시킨다. Design-head command가
capability path를 제외하므로 `adopt — capabilities`는 그 head 줄만 첫 커밋 hash로 바꾼다. 첫 커밋
뒤 중단되면 committed semantic set은 완전하고 stale `none` head는 Resume→Arch로 route되며,
uncommitted capability 또는 K bytes는 입력이 아니다.

이미 커밋된 정확한 `writer=adopt` 지식 마커는 소비될 때까지 그 값을 유계한 과거 출처로 보존한다.
이미 선언된 값을 사후 변경하면 DD-92의 출처가 깨지기 때문이다. Resume은 이 출처를 절차 소유자로
바꾸지 않는다. Arch가 과거 `adopt`와 현재 `arch` 마커를 모두 소비하고 Work는 현재
`writer=arch`만 생산한다. 호환 피드백 payload에는 writer가 없고 의미 소유자만 있으므로 정본 상태는 소유자만으로
소비자를 고른다. product/glossary는 Product, design은 Design, architecture/capability는 Arch다.
이는 DD-96의 Brownfield 기반 Arch/Adopt 분기를 정정하되 정확 payload, Git seal, 의미 착지 증명,
byte 동일 소비 근거는 유지한다. 어떤 과거 출처 형식도 도입을 다시 열거나 관리 상태 작업을 Adopt로
보낼 권한이 아니다.

기각한 대안: `setup.unmanaged`만 추가하면 첫 경로만 고치고 가짜 증거와 모델 자기보고 단계
순환을 남긴다. Principles나 Resume에 Adopt 의도 예외를 가르치면 명시 단계 진입을 다시 그것을
가린 분류기에 결합한다. 설계·기준선 상태마다 Adopt 분기를 다시 넣으면 Arch를 복제하고 누더기를
되살린다. 명시 Adopt 뒤 Product 실행 여부를 묻는 것은 기존 프로젝트 증거와 모순되고 Product의
브라운필드 가드와 순환할 수 있다. 프로젝트 밖 trace 경로를 Adopt 한 곳의 규칙으로 넣는 안도
기각한다. trace 위치는 공용 Skill Rails adapter 동작이므로 한 도메인 스킬에 복사하지 말고
upstream에서 한 번 고쳐야 한다. 한 도입 커밋은 Git 기반 Design head 계약에서 능력 문서가 자기
미래 커밋 id를 미리 담을 수 없어 성립하지 않는다. 이를 내용 hash로 바꾸면 모든 기준선 소비자가
움직이고, 능력 작성을 다음 Arch 세션에 전부 넘기면 Adopt의 확인된 전체 투영 목적을 달성하지 못한다.

영향 좌표: Adopt·Arch·Product·Design·Resume·Work·Verify·Principles 작성 P2 패키지와 생성 adapter(Principles의
현재 knowledge/delivery 참조와 상태 도구 포함), SessionStart와 그 집중 테스트, Codex fallback 문구,
설계 구성요소 색인, 매트릭스
3.21·3.24, 배포 manifest와 CHANGELOG. DD-20, DD-26, DD-89, DD-92, DD-95, DD-96의 나머지
근거는 그대로 유효하다.

재검토 조건: 명시 단계가 여전히 Principles부터 들어가거나, 유지 문서 또는 코드가 있는 무관리
저장소가 Adopt에 닿지 않거나, Adopt가 저장소에서 찾을 수 있는 사실 또는 다음 단계 선택을 사람에게 묻거나,
유지 자료 하나가 명시 처분 없이 사라지거나, 도입 경계에서 후속 요청이 사라지거나, 관리 상태의
설계/기준선/Arch 작성 지식 경로가 Adopt로 돌아오거나, 생성된 glossary와 능력/K 표면이 이후의
차가운 유지보수 세션에 부족하거나 두 승인 커밋 직후 능력 문서의 저장 Design head가 현재 값과
다를 때.
