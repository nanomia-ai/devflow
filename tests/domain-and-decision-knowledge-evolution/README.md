---
title: Domain and current-decision knowledge evolution plan
status: implemented-partially-observed
purpose: Give an implementation worker the evidence, boundaries, exact source changes, and fresh-use observations needed to make Domain knowledge durable from small projects through deep Domain trees while preventing external prose dependencies.
read_when: Implementing or reviewing Domain document contracts, current Decision documents, Work knowledge landing, or the boundary around external project documentation.
authority: Execution handoff only. plan/** remains the immutable accepted baseline; source/** owns implemented behavior and observations in this directory will own delivery evidence.
---

# Domain과 Current Decision 지식 체계 보완 계획

## 1. 이 작업을 하는 이유

Devflow의 Domain은 별도 실행 단계나 스킬이 아니다. 제품 안에서 독립된 상태, 규칙 또는 언어를
지속적으로 소유하는 지식을 나누는 축이다. Product가 업무 의미를 결정하고, Architecture와 Design은
필요할 때 같은 Domain subtree에 기술 또는 경험 concern을 둔다. Direct·Work·Verify는 변경을 수행하는
동안 발견한 지식을 이 정본으로 되돌려야 한다.

현재 source는 이 큰 방향을 이미 잘 구현한다. 작은 Domain은 `index.md` 하나로 끝나고, 독립적으로
선택할 수 있는 concern만 평범한 child 문서로 분리된다. 중요한 결정 이유는 append-only ADR 일지가
아니라 `.devflow/project/decisions/`의 현재 Decision 문서가 소유한다.

이번 검토에서 구조를 다시 만들 필요는 없었다. 그러나 다음 다섯 공백은 실제 다음 행동을 다르게 만든다.

1. `product-document`는 Domain parent와 조건부 child 분해를 허용하지만 Product가 Domain subtree에
   게시할 업무 concern child의 최소 내용 계약을 source에서 직접 닫지 않는다.
2. Work는 확인된 사실을 Product 또는 Domain에 착지시킬 수 있다고 말하지만, 업무 의미에 적용할
   `product-document` 계약을 읽지 않는다. 새 업무 판단이나 Domain 분해가 필요한 경우 Product로
   되돌리는 경계도 Architecture·Design만큼 분명하지 않다.
3. Decision은 자신이 보호하는 canonical path를 기록하지만, 현재 규칙을 읽은 AI가 이유를 재검토할
   때 해당 Decision을 찾는 반대 방향 route가 명시적이지 않다. 이 상태에서는 active guardrail보다
   기록 보관소처럼 취급될 수 있다.
4. 내부 자기완결성은 plan과 Adopt에 강하게 존재하지만, project knowledge의 공통 source 계약에는
   외부 prose가 왜 현재 의미의 필수 의존성이 될 수 없는지와 프로젝트 밖에서 정해지는 자료의 연결 경계가 직접
   드러나지 않는다.
5. Work와 Verify는 revision을 명시하지만 장기 지식에는 보편적인 날짜가 없다. 이것이 누락인지,
   의도된 현재형 모델인지, 시간에 민감한 사실을 어떻게 표시할지 source에서 설명하지 않는다.

이 작업은 새 Domain skill, ADR registry, checker 또는 고정 taxonomy를 만드는 일이 아니다. 기존
소유 구조에서 빠진 계약만 가장 가까운 owner에 보완하고, 실제 AI가 작은 Domain과 큰 Domain, Work
landing과 Adopt를 올바르게 다루는지 관찰하는 일이다.

## 2. 반드시 보존할 경계

- `plan/**`은 수정하지 않는다.
- Domain은 별도 skill이나 lifecycle stage가 아니다. 업무 의미의 decision route는 Product다.
- Product는 제품 전체의 cross-domain 구도만 소유한다. 한 Domain의 상세 규칙은 그 Domain subtree가
  소유한다.
- Architecture와 Design은 Domain subtree에 각각 technical/design concern을 둘 수 있지만 업무 의미를
  다시 정의하지 않는다.
- Work는 확인된 사실을 기존 정본에 통합할 수 있지만 새 Domain, 새 업무 규칙, child 분리·통합 또는
  Decision identity를 결정하지 않는다.
- Decision 문서는 현재 규칙의 사본이나 시간순 ADR log가 아니다. 현재 규칙은 Product, Domain,
  Architecture 또는 Design에 있고 Decision은 그 방향을 계속 지킬 이유와 재검토 조건만 소유한다.
- 문서 길이, 파일 수, 기술 이름, app/package 구조는 Domain이나 child를 만드는 기준이 아니다.
- 중개노트의 registry schema, handoff 형식, frontend/backend 분할과 checker를 범용 기본값으로 복사하지
  않는다.
- 외부 prose를 내부 정본과 경쟁시키지 않는다. 코드, test, configuration과 실제 운영 asset은 실행
  evidence일 수 있지만 두 번째 산문 정본은 아니다.
- 모든 문서에 `updated_at`을 붙이지 않는다. 문서 나이는 정확성의 증거가 아니며, 시간이 판단을
  바꾸는 사실에만 관찰 기준과 재검토 조건을 그 사실 곁에 둔다.
- 새 schema, generator, registry, linter 또는 link checker는 반복된 실제 실패가 없으면 추가하지 않는다.

## 3. 현재 체계와 중개노트에서 확인한 것

### 3.1 현재 Devflow의 유효한 구조

```text
.devflow/project/
├─ product.md                         제품 전체 목적과 cross-domain 구성
├─ domains/
│  └─ <domain>/
│     ├─ index.md                     Domain 공통 의미와 subtree route
│     └─ <concern>.md                 조건부 업무·기술·경험 concern
├─ architecture.md / architecture/*  프로젝트 공통 기술 구조
├─ design.md / design/*              적용되는 공통 경험 구조
└─ decisions/<id>-<slug>.md          현재 방향을 지킬 이유와 재검토 조건
```

같은 Domain subtree에 서로 다른 관할의 child가 있을 수 있다. 물리적 위치가 decision route를 바꾸지는
않는다.

| 지식 | 결정 route | canonical home |
|---|---|---|
| Domain 목적·언어·업무 상태·규칙·불변식 | Product | Domain parent 또는 업무 child |
| 한 Domain에만 적용되는 기술 seam·흐름·운영 경계 | Architecture | Domain technical child |
| 한 Domain에만 적용되는 경험·interaction 계약 | Design | Domain design child |
| 위 방향을 선택한 중요한 이유·기각 대안·재검토 조건 | 해당 Product/Architecture/Design | Current Decision |

이 구분은 Domain 문서에 기술을 금지한다는 뜻이 아니다. Domain을 작업하는 AI가 코드 전체를 역산하지
않아도 되도록 필요한 기술 설명을 같은 subtree에서 찾을 수 있게 하되, 업무 의미와 기술 구조의
결정 권한을 섞지 않는다는 뜻이다.

### 3.2 중개노트에서 실제로 잘 작동한 부분

중개노트는 다음을 서로 다른 owner로 나눈다.

- `PRODUCT.md`: 제품 목적, 사용자, Domain 이름과 책임 경계, 제품 불변식
- `domains/registry.json`: 구현 위치, 공개 entrypoint, 허용 edge, 상태와 검증 명령
- `ARCHITECTURE.md`와 하위 문서: 배치, 의존과 runtime 경계
- `specs/*-handoff.md`: 기능별 현재 계약과 구현 seam
- `adr/`: 큰 결정의 맥락, 대안, 결과

이 체계는 실제로 작동하지만 범용 Devflow의 최종 모양은 아니다. Domain의 업무 설명은 Product 표,
registry, handoff와 ADR에 흩어질 수 있고, registry는 중개노트의 monorepo와 checker에 강하게 결합돼
있다. 일부 ADR은 현재 규칙과 결정 이유를 모두 길게 품는다.

Devflow가 가져올 것은 물리 구조가 아니라 다음 성공 원리다.

1. Domain은 메뉴가 아니라 상태와 규칙의 owner다.
2. 현재 의미, 구현 증거와 결정 이유는 서로 다른 질문을 답한다.
3. 루트는 얕은 route를 제공하고 상세는 관련 질문에서만 연다.
4. 코드로 알기 비싼 의미와 이유는 문서에 남기고, 코드가 더 정확한 세부는 복제하지 않는다.

중개노트를 Devflow로 흡수할 때 예상되는 대응은 다음과 같다.

| 중개노트 자료 | Devflow에서의 처리 |
|---|---|
| Product의 Domain 표 | Product에는 cross-domain 구도만, 각 상세 의미는 Domain parent로 이동 |
| registry의 구현 위치·entrypoint·edge | 현재 구조를 바꾸는 안정 계약만 Architecture 또는 Domain technical child에 흡수; 나머지는 코드·검사 evidence로 유지 |
| handoff의 현재 업무 규칙 | Domain parent 또는 업무 child에 흡수 |
| handoff의 기술·UI 계약 | Architecture/Design 또는 Domain technical/design child에 흡수 |
| ADR의 현재 규칙 | 알맞은 Product·Domain·Architecture·Design 정본에 반영 |
| ADR의 계속 필요한 이유 | Current Decision으로 재구성 |
| 끝난 구현 과정과 과거 결론 | Git 이력에 맡기고 현재 검색면에서 제거 |

### 3.3 이미 입증된 범위와 아직 부족한 범위

`document-routing-preflight`에서는 두 Domain parent만 있는 작은 fixture에서 fresh AI가 index와 관련
Domain 하나만 읽고 올바른 규칙과 다음 행동을 찾았다. Foundation 관찰에서도 Product가 서로 다른
업무 규칙을 두 Domain parent에 나누고 Architecture가 이를 복제하지 않는 행동이 확인됐다.

아직 source와 행동 양쪽에서 충분히 확인되지 않은 것은 다음이다.

- 하나의 Domain이 업무 child와 technical/design child를 함께 가질 만큼 커졌을 때의 선택적 읽기
- Work가 구현 중 확인한 업무 사실을 기존 Domain에 안전하게 착지시키는 경로
- Work가 새 업무 의미나 child 구조를 스스로 결정하지 않고 Product로 되돌리는 경로
- 외부 prose가 삭제된 뒤에도 Domain과 Decision을 내부 문서만으로 이해하는지
- 같은 결정 질문의 결론이 바뀌었을 때 새 ADR을 쌓지 않고 같은 Current Decision을 교체하는지

## 4. 최종 Domain 문서 계약

이 절은 initial handoff를 그대로 보존한 기록이 아니라 구현 중 검증으로 조정된 계약이다. 최초 기획과
실제 구현이 달라진 이유는 `observations.md`의 `Initial handoff와 실제 구현의 차이`가 소유한다.

### 4.1 Domain을 만드는 기준

Domain은 독립된 제품·업무 의미가 장기간 유지될 때만 만든다. 다음 중 하나 이상이 지속적으로 존재하고
다른 Domain과 구분되는 경우가 그 단서다.

- 자신의 상태와 상태 변화
- 독립된 규칙이나 불변식
- 다른 영역과 혼동하면 판단이 달라지는 핵심 언어
- 다른 Domain에 제공하거나 요구하는 명시적인 계약

화면, route, 폴더, package, 팀, 배포 단위 또는 기술 layer라는 사실만으로는 Domain이 아니다. 순수
library나 작은 backend처럼 독립된 업무 의미가 없다면 Domain 문서를 만들지 않아도 된다.

### 4.2 Domain parent가 제공할 현재 모델

`project/domains/<domain>/index.md` 하나가 기본이다. 고정 목차를 채우는 대신 처음 읽는 사람이나 AI가
다음 내용을 하나의 현재 모델로 이해할 수 있어야 한다.

- 이 Domain이 존재하는 이유와 소유 경계
- 핵심 용어와 서로 구분해야 하는 개념
- 다음 변경의 판단을 바꾸는 대표 상태, 상태 변화, 규칙과 불변식
- 다른 Domain과 주고받는 의미, 책임과 실패 경계
- 현재 질문에서 조건부 child를 선택할 수 있는 짧은 route
- 실제로 남아 있는 업무 질문과 다시 결정할 조건

모든 entity, command, event, API, table, class와 상태를 목록으로 만들지 않는다. 코드에서 바로 확인할
수 있는 세부를 복제하지 않고, 코드를 읽어도 알 수 없는 의미와 코드 전체를 추적해야만 복원되는 안정
계약을 우선한다.

### 4.3 업무 concern child

여기서 말하는 child는 `product.md` 아래에 임의의 Product tree를 만드는 것이 아니다. Product가 소유하는
한 Domain의 독립된 업무 concern을 `project/domains/<domain>/<concern>.md`에 두는 경우다.

업무 concern이 다른 Domain 작업에서 안전하게 생략될 수 있고, 하나의 독자 질문과 독립된 변경 이유를
가질 때만 `project/domains/<domain>/<concern>.md`로 분리한다. 예를 들어 결제 Domain의 정산,
환불·취소 또는 권한 경계는 실제 독립성이 있을 때 child가 될 수 있다. 이름은 예시이며 taxonomy가
아니다.

업무 child는 필요한 만큼 다음을 설명한다.

- concern의 적용 범위와 parent 안에서의 위치
- 현재 업무 규칙, 의미 있는 예외와 불변식
- 입력·출력 또는 상태 변화와 실패 의미
- 다른 Domain과 맺는 관련 계약
- 코드만으로 복원하기 어려운 이유, 검증 근거와 열린 조건
- parent로 돌아가는 route

같은 판단에 항상 필요한 내용은 길어도 parent에 남긴다. entity 하나, 상태 하나, API 하나 또는 파일
수가 많다는 이유로 child를 만들지 않는다. 실제 작업이 parent와 여러 child를 늘 함께 읽고 고치면
공통 split/fold 계약에 따라 다시 합친다.

### 4.4 구현 설명과 기술적 고려사항의 위치

Domain subtree는 업무 의미만 담는 한 장짜리 설명으로 제한되지 않는다. 다만 같은 경로 안에서도
owner는 분명해야 한다.

```text
업무 의미와 현재 규칙              → Domain parent 또는 Product-owned business child
구성요소·의존·data/runtime 흐름    → Architecture 또는 Domain technical child
사용자가 겪는 상태·interaction     → Design 또는 Domain design child
선택 이유와 재검토 조건            → Current Decision
정확한 파일·함수·schema·token 값   → code/test/config/live asset
```

작은 Domain은 parent와 프로젝트 Architecture만으로 충분할 수 있다. 결제처럼 PG 연동, 정산 lifecycle,
실패 복구와 보안 경계가 독립적으로 바뀌는 큰 Domain은 parent 아래 업무·기술 concern을 조건부로 나눌 수
있다. reader는 Domain parent를 공통 배경으로 읽고 현재 질문에 관련된 child만 연다.

## 5. Current Decision 계약에 대한 판정

현재 `decision-document`의 수명과 내용 계약은 유지한다. 새 ADR subsystem이나 append-only ledger는
만들지 않는다. Current Decision은 전통적인 ADR에서 미래 판단에 필요한 이유·대안·trade-off를
보존하되, 과거 결정 사건을 현재 검색면에 계속 쌓지 않는 living record다. Product·Architecture·Design
어느 route의 결정도 담을 수 있고, 같은 질문에는 현재 답 하나만 둔다는 점에서 Architecture 중심의
시간순 ADR과 다르다.

Decision은 다음 중 하나가 실제로 참일 때만 필요하다.

- 이유를 잃으면 중요한 논의를 반복하게 된다.
- 기각한 대안이 다시 들어오면 안전성·제품 의미·운영 책임이 손상될 수 있다.
- 어떤 조건에서 현재 결론을 다시 판단해야 하는지가 다음 작업에 중요하다.

단순 library 선택, 작업 완료, 구현 과정, 현재 규칙의 사본만으로는 만들지 않는다. 필요한 경우에는
결정 질문, 현재 결론, 지배 제약, 실제 중요 대안과 기각 이유, 영향과 감수한 대가, 재검토 조건,
규칙이 반영된 canonical path를 담는다. 복잡한 결정이라면 문서가 길어질 수 있지만 현재 규칙 자체는
Domain이나 Architecture 등 원래 정본에 남는다.

```text
현재 규칙이 무엇인가?       → Product / Domain / Architecture / Design
왜 이 방향을 계속 지키는가? → Current Decision
언제 무엇으로 바뀌었는가?   → Git history
```

같은 결정 질문의 결론이 바뀌면 같은 Decision 파일을 현재형으로 교체한다. 독립된 새 질문에만 새 identity를
사용한다. 규칙과 이유가 더 이상 판단을 보호하지 않으면 Decision을 삭제하고 route를 갱신한다.

Decision을 모든 작업에서 읽히는 문서로 만들지는 않는다. 관련 없는 작업의 prompt를 늘리지 않으면서도
필요한 순간에 기록 보관소로 빠지지 않게, Decision이 보호하는 규칙의 canonical home 또는 가장 가까운
parent route가 “이 선택의 이유나 재검토 조건이 문제될 때” 읽을 Decision 경로를 안내해야 한다.
Decision은 규칙의 canonical path를 되가리키고, canonical home은 이유를 복제하지 않고 조건부 route만
제공한다.

```text
현재 규칙을 읽음
  └─ 이유·대안·재검토 조건이 현재 질문을 바꿀 때만 Decision을 엶
       └─ Decision에서 현재 규칙의 canonical path로 돌아감
```

따라서 이번 구현은 Decision의 생성 기준이나 본문 항목을 늘리지 않고, 만들기·교체·삭제할 때 양방향
route를 함께 유지한다는 한 경계만 `decision-document`에 보완한다. 날짜·작성자·status·과거 결론 목록은
추가하지 않는다.

## 6. 외부 문서 경계

이 절은 initial handoff를 그대로 보존한 기록이 아니라 구현 중 검증으로 조정된 계약이다. 최초 기획과
실제 구현이 달라진 이유는 `observations.md`의 `Initial handoff와 실제 구현의 차이`가 소유한다.

### 6.1 기본 규칙

`.devflow/project/`의 현재 문서는 repository 안팎의 prose 문서 경로나 링크가 계속 존재해야만 뜻을 알 수 있는
구조가 되어서는 안 된다. `docs/`, 외부 issue, wiki, 공유 문서와 Adopt 입력은 발견과 출처 확인에
사용할 수 있지만, “자세한 내용은 그 문서를 보라”는 경로로 프로젝트가 채택한 현재 의미를 넘기지
않는다. 채택된 목적, 규칙, 제약과 판단 근거는 알맞은 내부 canonical home에서 이해할 수 있어야 한다.

Adopt의 `sources.md`는 흡수 중 exact path를 일시적으로 기록할 수 있다. 이는 coverage와 disposition을
위한 작업 자료이며 adoption이 닫힌 뒤 project truth의 필수 route로 남지 않는다.

### 6.2 외부 문서와 live evidence를 구분한다

- code, test, configuration, schema, generated executable model, running catalog와 운영 asset은 자신의
  실행 역할 때문에 유지될 수 있다. Project 문서는 그것을 다시 복사하지 않고 관련 조건과 검토 route를
  줄 수 있다.
- repository 안팎의 prose 문서 경로나 링크는 기본 canonical route가 아니다. 연결 하나를 적는 것으로 내부
  설명을 대신하지 않는다.
- 표준, API, 법령, 외부 제공자 계약, 기술 자료처럼 프로젝트 밖에서 정해지는 자료는 근거와 확인 대상으로
  연결할 수 있고 원문을 내부에 복제하지 않는다. 현재 프로젝트가 채택한 범위·해석·제약과 자료 변화가
  판단을 바꿀 때의 재확인 조건만 내부 문서가 설명한다.

### 6.3 프로젝트 밖에서 정해지는 자료의 연결

프로젝트가 소유하지 않는 표준·API·계약·기술 자료는 정확한 원문을 내부로 복사해 두 정본을 만들지 않고
출처나 검토 대상으로 route할 수 있다. 이때 내부 문서는 다음을 스스로 설명해야 한다.

- 외부 자료의 정확한 역할과 프로젝트가 채택한 범위
- 내부 canonical 문서가 계속 소유하는 목적, 제약과 해석
- 외부 자료를 사용할 질문과 검토 방법
- 자료에 접근할 수 없거나 변경됐을 때 추측하지 않고 다시 확인할 조건

단순 편의, 이미 링크가 있다는 사실, 문서가 길다는 이유로 현재 의미를 외부 자료에 맡기지 않는다.
유지할 가치가 없는 과거 문서는 disposition한 뒤 현재 route에서 제거한다.

### 6.4 날짜와 현재성을 구분한다

현재 설계에는 모든 문서의 `updated_at`이 없다. 이는 단순 누락이 아니라 현재형 정본과 Git을 함께
사용하는 선택이다.

| 알고 싶은 것 | 현재 가장 정확한 근거 |
|---|---|
| 문서 bytes가 마지막으로 바뀐 시점과 이전 내용 | 필요할 때 조회하는 Git history |
| Work가 어느 코드에서 시작했고 어디까지 안전한가 | `base_revision`, `last_safe_point` |
| 작업 카드가 지금 실행 가능하거나 다른 카드에 막혔는가 | `next_route`, blocker, dependency와 현재 Git basis |
| Verify가 어떤 결과를 실제로 판단했는가 | exact target revision, 환경, channel |
| 외부 사실이나 운영 조건을 언제 확인했는가 | 그 사실 곁의 관찰 시점·source version·재확인 조건 |
| 현재 선택을 언제 다시 검토해야 하는가 | Decision의 재검토 조건 |

보편적인 수정일은 사람이 문장을 다듬기만 해도 바뀌고, 내용이 오래됐다는 이유만으로 틀렸음을
증명하지 않으며, 실제 근거가 바뀌었는데 날짜만 갱신돼도 거짓 신뢰를 준다. 모든 read와 write에 이
metadata를 싣는 비용에 비해 판단력은 낮다. 반면 Git 조회는 시간 순서가 실제 질문일 때만 비용을 낸다.

작업 카드도 오래됐다는 이유만으로 abandoned이거나 stale인 것은 아니다. 오래 멈춘 작업이 여전히 정확한
base와 route를 가질 수 있고, 방금 만든 작업도 base가 달라졌으면 실행할 수 없다. 그래서 순서·관리권·
실행 가능성은 timestamp나 TTL이 아니라 현재 state와 Git 대조로 판단한다. 일정·SLA처럼 경과 시간이
실제 요구사항인 프로젝트만 그 요구를 소유하는 artifact에 정확한 시점을 둔다.

다만 Git commit 시점은 외부 요금, 법규, provider capability 또는 운영 관찰을 언제 확인했는지 대신하지
못한다. 시간·revision·version이 바뀌면 결론도 달라지는 사실에는 그 사실 바로 곁에 정확한 확인 기준과
다시 볼 조건을 둔다. 문서 전체에 하나의 날짜를 붙여 서로 다른 사실의 freshness를 대표하게 하지
않는다.

## 7. 구현할 source 변경

### 7.1 `source/modules/project-knowledge.md`

`communication`은 사람이 이해할 수 있게 표현하는 방법만 소유한다. 외부 자료가 현재 지식의 정본이 될
수 있는지와 어떤 시점·revision을 신뢰할지는 표현이 아니라 지식의 완전성과 근거에 관한 문제이므로
그 module을 넓히지 않는다.

Project·Domain·Architecture·Design·Decision과 이를 준비하는 Sketch가 이미 읽는
`project-knowledge`의 자기완결 문장 다음에 두 경계만 짧게 보완한다.

1. repository 안팎의 prose 문서 경로나 링크가 바뀌거나 사라져도 프로젝트의 현재 의미를 잃지 않게 한다.
   프로젝트 밖에서 정해지는 표준·API·계약·기술 자료는 출처·검토 대상으로 연결할 수 있고 원문을 복제하지 않는다.
   프로젝트가 채택한 범위·해석·제약과 자료 변화가 판단을 바꿀 때의 재확인 조건만 내부 정본에 남긴다.
2. 문서의 나이는 정확성의 증거가 아니다. 시간·revision·외부
   version이 실제 판단을 바꾸는 사실에만 확인 기준과 다시 볼 조건을 그 사실 곁에 둔다. 문서 변경
   시점과 이전 내용은 필요할 때 Git에서 확인한다.

구현 문장은 배경과 행동 경계를 함께 보존하되 한 단락을 넘겨 새 외부 자료 처리 절차나 freshness
subsystem으로 자라지 않게 한다. 의미 기준은 다음과 같다.

```text
프로젝트가 채택한 현재 의미를 repository 안팎의 prose 문서 경로나 링크에 맡기지 않고, 목적·규칙·제약은
알맞은 내부 canonical home에서 이해할 수 있게 쓴다. 표준·API·법령·외부 제공자 계약·기술 자료처럼
프로젝트 밖에서 정해지는 자료는 출처와 검토 대상으로 연결할 수 있으며 원문을 복제하지 않는다. 프로젝트가
채택한 범위·해석·제약과 접근할 수 없거나 변경됐을 때의 판단만 내부에 둔다. 문서 나이 자체는 현재성의
증거가 아니며, 시간·revision·version이 판단을 바꾸는 사실에만 확인 기준과 재검토 조건을 그 사실 곁에
둔다. 그 밖의 변경 이력은 Git이 소유한다.
```

Direct spec은 이미 배경·의도·acceptance·`read_first`를 스스로 설명해야 하고, Work state는 Git basis,
Verify record는 정확한 revision·환경·관찰을 소유한다. 이 target들에 `project-knowledge`를 새로 import하지
않는다. 외부 링크가 내용을 대신하는 실제 fresh-use 실패가 나타날 때만 해당 artifact owner의 기존
자기완결 문장을 최소 수정한다.

### 7.2 `source/modules/product-document.md`

적용 범위를 다음처럼 확장한다.

- Product와 Adopt가 Product, Domain parent 또는 Product-owned 업무 concern child를 만들거나 교체할 때
- Work가 확인된 pending landing을 기존 Product, Domain parent 또는 업무 child에 반영할 때

현재 Domain 생성 기준, parent 계약과 공통 split/fold 기준은 유지한다. 빠진 것은 child를 언제 만드는지
다시 설명하는 절이 아니라, Product가 게시하는 Domain 업무 child가 무엇을 답해야 하는지다. 다음 의미를
한두 문장으로만 보완한다.

```text
Domain 업무 child는 독립된 concern의 적용 범위, 현재 업무 규칙·예외·상태 변화와 관련 계약을 다음
판단에 필요한 만큼 설명하고 parent로 돌아가는 route를 둔다. 코드에서 바로 확인할 세부와
Architecture·Design이 소유할 판단은 넣지 않는다.
```

Work는 확인된 사실을 기존 정본의 언어로 통합할 때만 이 계약을 사용한다. 새 Domain, 새 업무 규칙,
Domain 경계, child 분리·통합 또는 기존 의미 변경이 필요하면 Product로 route한다. 고정 heading, entity
catalog, 기술 taxonomy와 분량 제한은 추가하지 않는다.

적용 문구는 다음 의미로 시작할 수 있다.

```text
이 계약은 Product와 Adopt가 Product, Domain parent 또는 업무 concern child를 만들거나 교체할 때,
Work가 확인된 pending landing을 기존 Product 또는 Domain 업무 경로에 반영할 때 적용한다.
```

### 7.3 `source/targets/product/entry.md`

Product가 새 foundation이나 현재 제품 의미를 게시할 때 Domain parent뿐 아니라 실제로 필요한 Domain
업무 child도 공통 split/fold 판정에 따라 게시할 수 있음을 한 문장으로 명확히 한다. 새 child 수나
이름을 미리 정하지 않고, Domain parent 하나로 충분하면 child를 만들지 않는다.

Architecture 또는 Design concern을 Product가 대신 작성하게 만들지 않는다. 현재 decision이 필요한
중요한 이유는 기존처럼 `decision-document`를 조건부로 사용한다.

`foundation 게시`에는 다음 의미만 보완한다.

```text
필요한 Domain parent와, 공통 분해 기준을 실제로 통과한 업무 child만 게시한다. Domain parent로
충분하면 child를 만들지 않는다.
```

### 7.4 `source/targets/work/entry.md`와 `target.json`

Work target에 `product-document`를 import한다. Work 실행 내내 읽지 않고 closure에서 실제 pending
landing이 Product 또는 Domain business 경로를 가리킬 때만 연다. Work의 기존 spec·state·verification
자기완결성과 Git basis 계약은 그대로 유지한다.

```text
Product 또는 Domain business landing
  → product-document를 열어 기존 의미에 확인된 사실만 통합
  → 새 의미·Domain·child 판단이 필요하면 product로 blocker 전달

Domain technical landing
  → 기존 architecture-document 경로 유지

Domain design landing
  → 기존 design-document 경로 유지

기존 Decision landing
  → 기존 decision-document 경로 유지
```

Work가 새 문서 identity를 선택하거나 새 child를 만드는 권한은 주지 않는다. Landing 대상이 존재하지
않거나 분류가 모호하면 문서를 만들어 닫지 말고 owner route로 보낸다.

현재 pending landing 단락에는 다음 의미의 조건부 pointer와 blocker 경계를 둔다.

```text
pending landing이 Product 또는 Domain 업무 경로를 가리킬 때만 product-document를 연다. 확인된 사실을
기존 의미에 통합하는 것만으로 닫히지 않고 새 제품·업무 의미, Domain 경계 또는 child 분리·통합이
필요하면 product로 blocker를 보낸다.
```

### 7.5 `source/modules/decision-document.md`

Decision의 내용, 생성 억제, 같은 질문을 같은 파일에서 교체하는 수명 계약은 바꾸지 않는다. 생성하거나
교체할 때 다음 두 route가 함께 존재해야 한다는 문장만 추가한다.

```text
Decision은 현재 규칙의 canonical path를 밝힌다. 그 canonical home 또는 가장 가까운 parent는 이유나
재검토 조건이 현재 질문을 바꿀 때 이 Decision을 읽도록 조건부 route를 둔다. 이유를 양쪽에 복제하지
않으며 Decision을 삭제할 때 route도 함께 지운다.
```

이 연결은 Decision을 항상 읽게 만드는 index 목록이 아니다. 관련 규칙을 이미 읽고 이유·대안·재검토
조건이 필요한 작업에만 문서를 발견시키는 장치다. Product·Architecture·Design·Adopt는 이미 Decision을
만들거나 교체할 때 이 module을 읽으므로 각 entry에 같은 문장을 반복하지 않는다. Work는 기존 Decision에
확인된 사실만 반영하며 route identity를 새로 결정하지 않는다.

### 7.6 `source/targets/adopt/entry.md`

기본적으로 새 절을 추가하지 않는다. Adopt는 이미 `project-knowledge`와 `product-document`를 읽고,
외부 reference를 자기완결 문장으로 바꾸며 maintained prose의 disposition을 끝낸다. 보완된
`project-knowledge`만으로 외부 prose의 기본 금지와 프로젝트 밖에서 정해지는 자료의 출처·검토 연결 경계가
일관되게 작동하는지 fresh-use로 먼저 확인한다.

관찰에서 Adopt가 `retained live evidence`를 외부 prose에 현재 의미를 맡기는 허가로 넓게 해석할 때만,
code/test/config/operational asset은 그대로 유지할 수 있지만 외부 제공자 contract도 내부 의미를
대신하지 않고 출처·검토 대상으로만 연결한다는 한 문장을 가장 가까운 기존 단락에 보완한다.

### 7.7 변경하지 않을 source

- `source/modules/communication.md`
- Architecture와 Design의 현재 content contract
- Direct, Verify, Resume와 Sketch의 현재 lifecycle 및 artifact schema
- `work-state` schema
- `.devflow` path structure
- plan, registry, checker, generator와 renderer

## 8. fresh-use 검증 시나리오

### A. Domain이 필요 없는 작은 프로젝트

작은 범용 library 또는 단일 기술 도구를 준다. 독립된 업무 상태·규칙·언어가 없다면 Product와
Architecture만 만들고 빈 Domain이나 Decision을 만들지 않아야 한다.

### B. 작은 Domain 하나

독립된 상태와 규칙을 가진 작은 서비스 Domain을 준다. `index.md` 하나가 목적, 상태, 불변식과 계약을
충분히 설명하고 child, registry와 Decision을 만들지 않아야 한다.

### C. 성장한 결제 Domain

결제 목적·수명주기·환불 규칙, PG 연동 경계와 중요한 provider 선택 이유를 함께 제공한다.

기대 결과:

- 결제·정산·환불의 상태·규칙·언어가 공통 의미에 의존하면 결제 Domain parent와 필요한 업무 child로
  나누고, 각각 독립된 모델과 계약을 소유하면 형제 Domain으로 둘 수 있다.
- 어느 형태든 Product에는 결과 수준의 약속과 Domain 구성만 남기고 상세 업무 규칙을 복제하지 않는다.
- PG adapter, retry, idempotency와 장애 경계는 Architecture 또는 Domain technical child가 소유한다.
- 중요한 provider 선택 이유와 재검토 조건만 Current Decision이 소유한다.
- 정확한 SDK call, class, endpoint와 schema는 코드가 더 정확하면 문서에 복제하지 않는다.
- 현재 질문에 관련된 parent와 child만 읽고 모든 sibling을 열지 않는다.

### D. Work knowledge landing

Work와 Verify가 기존 Domain 업무 규칙을 뒷받침하는 사실 하나를 확인한 상황을 만든다.

- 기존 업무 child에 표현만 보강하면 Work가 `product-document`를 읽고 직접 착지시킨다.
- 그 사실이 새 환불 의미, 새 Domain 경계 또는 child 분리를 요구하면 Work가 Product로 blocker를
  보내고 정본을 바꾸지 않는다.
- 확인된 사실이 기존 업무 의미와 모순되면 Work가 이를 덮어쓰지 않고 Product로 보낸다.
- 시간·revision·version이 판단을 바꾸는 사실을 착지시키면 확인 기준과 다시 볼 조건을 그 사실 곁에 둔다.
- 기술 또는 Design 사실은 기존 각각의 계약을 사용한다.
- 외부 문서 링크를 pending landing으로 바꾸지 않는다.

### E. Adopt와 외부 prose 제거

README, 운영 문서, 코드와 test가 있는 brownfield fixture를 사용한다. 기존 prose를 제거하거나
비정본으로 바꾼 뒤 `.devflow/project/`만으로 대표 Product·Domain·Architecture·Decision 질문에 답하고
다음 변경을 route할 수 있어야 한다.

실패 조건:

- Domain 문서가 “자세한 내용은 기존 README 참조”로 끝난다.
- Decision이 외부 ADR의 URL이나 path만 남기고 이유를 흡수하지 않는다.
- 외부 prose 삭제 뒤 현재 규칙 또는 재검토 조건을 알 수 없다.

### F. 프로젝트 밖에서 정해지는 외부 자료

외부 제공자 계약처럼 프로젝트 밖에서 정해지는 자료를 출처·검토 대상으로 연결한 사례와, 프로젝트가
소유한 의미를 외부 문서에 맡긴 대조 사례를 비교한다.

- 프로젝트가 소유한 의미는 문서 위치나 관리 의도와 관계없이 내부 정본으로 흡수한다.
- 프로젝트 밖에서 정해지는 자료도 외부 자료의 역할·채택 범위·내부 의미·검토 route·접근 불가 시 조건을 내부에 둔다.
- 외부 자료를 읽을 수 없으면 내용을 추측하거나 current라고 주장하지 않는다.

같은 경계를 project canon 밖의 문서에서도 대표적으로 확인한다. 외부 issue나 wiki를 입력으로 받은
Direct spec은 origin link만으로 요청 배경·goal·acceptance를 대신하지 않아야 한다. Sketch finding과
Verify evidence도 외부 자료를 출처로 사용할 수는 있지만, 다음 actor가 판단할 의미와 관찰 결과는
현재 문서 안에서 이해할 수 있어야 한다.

### G. Decision 생성과 교체 경계

세 가지를 비교한다.

1. 가역적인 library 선택: 현재 Architecture의 짧은 이유만으로 충분하며 Decision을 만들지 않는다.
2. 중요한 provider 선택: 기각 대안이 다시 들어오면 위험하고 재검토 조건이 있어 Decision을 만든다.
3. 같은 질문의 결론 변경: 새 번호를 만들지 않고 같은 Decision을 현재형으로 교체하며 규칙은 원래
   canonical home에 반영한다.

Decision을 만든 뒤 두 종류의 새 작업을 독립 문맥에서 실행한다.

- provider 선택의 이유나 교체 조건을 건드리는 작업은 현재 규칙의 route에서 Decision을 찾아 읽는다.
- 관련 없는 결제 UI 또는 국소 구현은 Decision을 열지 않는다.
- Decision을 삭제하거나 교체하면 canonical route도 같은 변경에서 갱신된다.

### H. 날짜와 근거의 현재성

오랫동안 바뀌지 않은 안정된 Domain 불변식과, 최근 외부 provider version에 의존하는 제한을 함께 둔다.

- AI는 문서가 오래됐다는 이유만으로 안정된 불변식을 stale이라고 판단하거나 `updated_at`을 추가하지
  않는다.
- provider 제한에는 실제 확인 날짜·version 또는 revision과 다시 확인할 조건이 해당 문장 곁에 남는다.
- Work는 문서 날짜가 아니라 `base_revision`과 현재 Git bytes를, Verify는 정확한 target revision과
  관찰 환경을 사용한다.
- 오래된 카드와 최근이지만 base가 어긋난 카드를 비교해, 나이가 아니라 state와 Git 대조로 실행 가능성을
  판단한다.
- Git history를 읽지 않은 상태에서 과거 변경 시점이나 이전 결론을 추측하지 않는다.

## 9. 구현과 검증 순서

1. 현재 Skill Rails와 source owner를 exact ID로 다시 inspect한다.
2. `product-document`에 짧은 업무 child 내용 문장과 Work 적용 경계를 추가하고 Product entry의 게시
   문장을 맞춘다.
3. Product에서 A–C를 실행해 작은 기본값과 큰 Domain 분해를 관찰한다. 긴 고정 형식을 만들거나 기술·
   Design 판단을 끌어오면 source 문장을 늘리기 전에 원인을 다시 판정한다.
4. Product 결과가 통과한 뒤 Work import와 조건부 pointer를 추가하고 D를 실행한다.
5. `project-knowledge`에 외부 prose 의존 금지와 프로젝트 밖에서 정해지는 자료의 연결 경계, 시간에 민감한 사실의
   기준을 한 단락으로 보완한다. `communication`은 변경하지 않는다.
6. E·F·H를 실행한다. Direct·Verify 등 기존 artifact 계약이 링크만 남기는 실패를 실제로 보일 때만
   그 artifact owner를 최소 보완하고, `project-knowledge`를 무관한 target에 import하지 않는다.
7. `decision-document`에 양방향 조건부 route 경계만 추가하고 G를 실행한다. Decision 본문 항목,
   metadata와 append-only history는 늘리지 않는다.
8. 변경한 target을 하나씩 build·check·double-build하고 generated diff를 검토한다.
9. manifest 또는 shared module 변경 뒤 영향받은 모든 target의 source currentness를 복구한다.
10. 결과를 `proven`, `failed`, `unproven`으로 나눠 이 디렉터리의 `observations.md`에 기록한다.

Build, hash, JSON과 source graph는 delivery만 증명한다. Domain 분해, 외부 입력 독립성과 Decision 억제는
각 시나리오의 실제 fresh-use 행동을 관찰하기 전까지 `unproven`이다.

## 10. 중단하거나 결정으로 올릴 조건

다음이 발견되면 작업자가 임의로 구조를 늘리지 않는다.

- Domain을 별도 skill이나 lifecycle stage로 만들어야만 동작한다고 판단됨
- Product가 Architecture/Design concern을 직접 결정해야만 Domain tree를 유지할 수 있음
- Work가 확인된 사실을 착지시키기 위해 새 Domain 의미나 Decision identity를 결정해야 함
- 외부 자료의 연결 경계가 `.devflow/` 내부 완전성이라는 승인된 목적을 실질적으로 바꿈
- 보편적인 날짜 field가 없으면 해결할 수 없는 실제 freshness 실패가 나타났지만, 어떤 사실이 stale인지
  판정할 source·revision·재검토 조건을 특정할 수 없음
- 중개노트 registry와 같은 schema/checker 없이는 작은 fixture도 반복 실패함
- parent route와 `summary/read_when`으로 관련 child를 찾지 못하는 실제 반복 사례가 나타남
- 현재 path 구조나 canonical ownership을 바꿔야 함

이 경우 현재 실패 장면, 원문 좌표, 가장 작은 선택지와 각 선택의 영향을 보고하고 멈춘다.

## 11. 완료 조건

- Domain parent와 Product-owned 업무 child가 하나의 source 계약에서 명확히 정의된다.
- 작은 프로젝트와 작은 Domain에는 불필요한 Domain, child와 Decision이 생기지 않는다.
- 큰 Domain은 고정 taxonomy 없이 업무·기술·경험 concern을 조건부로 나눌 수 있다.
- Product, Architecture, Design과 Domain 사이에 같은 현재 사실이 복제되지 않는다.
- Work는 기존 업무 정본에 확인된 사실만 착지시키고 새 판단은 Product로 돌려보낸다.
- Project knowledge는 외부 prose를 필수 dependency로 만들지 않으며, 기존 spec·Sketch·verification
  계약도 링크만으로 필요한 의미나 관찰을 대신하지 않는다.
- 프로젝트 밖에서 정해지는 외부 자료도 내부 의미와 검토 조건을 잃지 않고 출처·검토 대상으로만 연결된다.
- Decision은 미래 판단을 보호할 때만 생기고 같은 질문은 같은 파일에서 현재형으로 유지되며, 관련
  canonical rule에서 필요할 때 발견되고 관련 없는 작업에서는 읽히지 않는다.
- 보편적인 `updated_at` 없이 Git basis와 사실별 관찰 기준·재검토 조건으로 시간 비대칭을 판단한다.
- 중개노트 수준의 복잡한 결제·인증·파일 Domain과 결정 이유를 품을 수 있으면서 registry와 장문 ADR을
  다른 프로젝트에 강제하지 않는다.
- 전달 검사와 실제 AI 행동 증거가 구분되어 기록된다.
