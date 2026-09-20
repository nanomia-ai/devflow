---
name: product
description: Devflow 프로젝트의 목적, 사용자, 제품 약속과 책임 경계, 공통 언어, 불변 조건과 업무 Domain 구성을 정의하거나 수정한다. 새 프로젝트의 제품 의미를 정리하거나 열린 제품 판단을 해결할 때 사용한다. 기술 Architecture, UI Design, 변경 실행, 구현 또는 brownfield source 재구성에는 사용하지 않는다.
---
<!-- generated; do not edit; source: targets/product/entry.md; receipt: .skill-rails-build.json -->

# 제품 경계 정의

Product는 처음 대화가 없어도 프로젝트가 왜 존재하고 누구에게 무엇을 약속하는지 이해할 수 있게
만든다. 구현 기술, runtime 구조, UI 체계와 delivery task를 선택하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `product` 조건을 적용한다. 이어서
`references/project-knowledge.md`와 `references/product-document.md`를 연다. 읽을 수 있는
`.devflow/index.md`가 이미 있으면 Product 입력을 선택하기 전에 읽는다.

현재 member의 Sketch state가 `next_route`로 `product`를 지정하면 파일을 쓰기 전에
`references/sketch-handoff.md`를 열고, Product 게시와 함께 landing 계약을 완료한다.

새 프로젝트 brief, Product에 반영할 결론이 준비된 project Sketch, 현재 Product 의미를 바꾸는 열린
질문, 또는 진행 중인 Adopt가 넘긴 제품 판단이 있을 때 Product에 진입한다.

내부 Devflow foundation이 없는 maintained brownfield source의 조사와 재구성은 `adopt`가 맡는다.
다만 진행 중인 Adopt가 제품 판단을 이곳으로 보냈다면 다시 Adopt로 반송하지 않는다. adoption state가
가리키는 근거를 읽고 그 판단만 다루며, `sources.md`와 `conflicts.md`는 고치지 않는다.

답을 얻기 위해 추가 조사나 실험이 필요하고 그 질문과 맥락을 현재 관리권 구간을 넘어 보존해야 한다면
`sketch`로 route한다. 여러 session이 필요한 인터뷰를 보관하려고 불완전한 canonical Product를 게시하지
않는다.

## 탐구와 검토 관점

Product는 듀이의 탐구처럼 불완전한 요청을 사용자, 문제와 핵심 약속이 연결된 제품 문제로 구성한다.
개별 사례와 역할은 해석학적 순환처럼 전체 제품 설명과 서로 대조하며, 현재 전체 설명도 새 단서로
고칠 수 있는 해석으로 취급한다. 중요한 약속들이 함께 성립하기 어려울 때만 소크라테스의
엘렝코스로 전제와 결과를 드러내며, 논박하거나 질문 수를 늘리는 데 사용하지 않는다.

## 현재 이해를 먼저 만들고 필요한 것만 묻는다

brief, 사용자 결정, 관련 project Sketch finding, adoption state가 가리키는 근거, 기존 Product와 Domain
canon을 이용해 현재 제품을 먼저 하나의 설명으로 구성한다. Product 문서의 항목을 설문 문항으로
바꾸거나 이미 알려진 내용을 다시 묻지 않는다.

기능과 역할이 나열됐다는 사실만으로 어느 사용자의 어떤 문제가 우선이고 무엇이 핵심 약속인지
정해졌다고 보지 않는다. 입력이 그 문제나 우선순위를 직접 말하거나, 목적과 책임이 다른 자연스러운
해석을 제외한 경우에만 근거가 있다. 그런 해석이 둘 이상이면 그럴듯한 하나를 고르지 않고 차이를
설명한 뒤, 그 차이를 가르는 가장 상위 질문 하나를 먼저 묻는다. 입력이 말하지 않은 업무 규칙과
제외 범위는 지어내지 않으며, 그 갈림길을 가르지 않는다면 묻지도 않고 비워 둔다.
우선 문제와 핵심 약속이 직접 정해지지 않은 동안에는 그 선택에 따라 달라질 하위 업무 규칙을 묻지
않는다.
모순으로 판단하기 전에 사용자의 설명과 사례가 함께 성립하는 자연스러운 해석이 있는지 먼저 확인한다.

사용자가 자신의 경험이나 의도에 따라 지금 답할 수 있는 제품 선택은 Product가 묻는다. 현재 대화에서
확인할 수 있는 근거는 먼저 확인한다. 추가 조사나 실험이 필요하고 그 맥락을 다음 관리권 구간까지
보존해야 할 때만 `sketch`로 보낸다. 증거로 정할 수 없는 제품 선택은 사용자에게 맡긴다. 그 선택이
현재 대화를 넘어 미결로 남으면 불완전한 Product를 게시하지 않고 `sketch`에 보존한다.

질문할 때는 현재 어떻게 이해했는지, 어느 지점이 비어 있거나 함께 성립하기 어려운지, 답에 따라
무엇이 달라지는지를 평범한 말로 설명한다. 여러 질문이 보이면 다른 질문들의 답까지 바꾸는 질문부터
다룬다.

이 기준에 따라 사용자의 설명이나 구속력 있는 선택을 실제로 묻기 직전에만
`references/question-dialogue.md`를 열고 질문 표현에 적용한다.

답이 기존 설명과 충돌하면 한쪽을 조용히 버리지 않는다. 두 의미가 실제로 함께 성립할 수 있는지
확인하고, 그렇지 않다면 어떤 약속을 유지할지 사용자에게 맡긴다. 사용자가 결정하지 못한 내용이
제품 정의에 반드시 필요하면 Product를 게시하지 않는다. 현재 제품을 일관되게 설명하는 데 필요하지
않다면 현재 취급과 다시 결정할 조건을 열린 제품 질문으로 남길 수 있다.

진행 중인 adoption에서 받은 판단을 다른 route로 넘기면, 떠나기 전에 adoption state를 그 판단을
이어받을 route 하나와 범위가 정해진 다음 행동 하나로 교체한다.

기술, 파일 배치, component, database, test 도구, 시각 스타일과 구현 순서는 묻지 않는다.

## foundation 게시

새 프로젝트에서는 `.devflow/project/product.md`, 필요한
`.devflow/project/domains/<domain>/index.md`, `.devflow/index.md`를 완전한 현재 문서로 구성한 뒤
게시한다. 역할, 구성 단위, Domain과 책임의 병렬 비교가 필요한 경우에는 표를 사용할 수 있지만,
고정된 제목이나 빈 절을 만들지 않는다.

index는 제품 경계 질문을 Product로, Domain 업무 질문을 알맞은 Domain parent로, 기술 질문을 존재하는
Architecture로, UI 질문을 적용 가능한 Design으로 route한다. 활성 작업 복구에는 immediate
`team/<current-member>/sketches/*/state.md`, `adoption/state.md`, `work/*/state.md` glob만 노출한다.
Architecture 준비 상태는 완전한 Product와 `project/architecture.md`에서 판단하고, Design 준비 상태는
Architecture의 적용 여부와 필요한 경우 `project/design.md`에서 판단한다고 설명한다. 존재하지 않는
Architecture나 Design 파일을 placeholder로 만들지 않는다.

기존 Product를 바꿀 때는 영향을 받는 사용자, 기존 약속, 데이터·권한 의미와 Domain 경계를 함께
확인한다. 현재 의미가 바뀐 canonical Product와 Domain 문서만 교체하고, 질문 route가 바뀐 경우에만
가장 가까운 parent index를 갱신한다. 중요한 기각 대안이나 재검토 조건이 현재 방향을 계속 지키는 데
필요하면 `references/decision-document.md`를 열고 현재 decision 문서 하나를 만들거나 교체한다. 작업이
있었다는 사실이나 현재 규칙의 사본을 남기려고 만들지 않는다.

## 다음 열린 질문에서 종료

게시하기 전에 새 문서를 사용할 수 있는 근거와 대조해 다시 읽는다. Product와 Domain 사이에 같은
사실이 반복되지 않는지, 기술 또는 UI 결정이 섞이지 않았는지, 근거에 없는 업무 규칙, 불변 조건이나
제외 범위를 문서의 완성도를 위해 보태지 않았는지 확인한다.

새 foundation은 읽어야 할 Product와 Domain 경로를 지정해 `architecture`로 route한다. 활성 변경은
누락된 기술 foundation 결정이 없으면 `direct`로 돌려보낸다. 진행 중인 adoption에서 받은 판단은 답을
canonical Product 또는 Domain에 게시한 뒤 공통 gate의 복귀 계약에 따라 `adopt`로 route한다. 게시가
끝나기 전에는 state를 바꾸지 않는다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 canonical path
- `현재 제품 정의:` 제품의 목적, 대상과 핵심 약속
- `구성:` 실제로 존재하는 역할·제품 단위·Domain과 책임, 또는 `none`
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `열린 항목:` 현재 결정하지 않은 제품 질문과 닫는 조건이 있을 때만

Architecture, Design, Work artifact, 구현, adoption inventory 또는 verification verdict를 쓰지 않는다.
