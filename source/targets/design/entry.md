---
name: design
description: Architecture가 사람이 직접 사용하는 UI 또는 상호작용 접점에 Design이 적용된다고 판단한 경우 Devflow 프로젝트의 현재 경험 방향, 공통 표현·interaction 체계, 접근성, 상태 원칙과 review surface를 정의하거나 수정한다. 열린 경험 체계 결정을 다룰 때 사용한다. 제품·업무 의미, 기술 surface와 구현, delivery 방향, brownfield 재구성, 비대화형 프로젝트에는 사용하지 않는다.
---

# 현재 경험 foundation 정의

Design은 적용 가능한 Product와 Architecture foundation을 이후 경험 변경이 구현하고 검토할 수 있는
가장 작은 현재 경험 모델로 바꾼다. 모든 component와 화면을 미리 설계하지 않고, 다음 변경이 공통
경험 기준을 새로 발명하지 않아도 되는 foundation을 게시한다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 적용 가능한 상태로 진입한다

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `design` 조건을 적용한다. 이어서
읽을 수 있는 `.devflow/index.md`, 완전한 Product와 Architecture를 연다.

현재 member의 Sketch state가 `next_route`로 `design`을 지정하면 파일을 쓰기 전에
`references/sketch-handoff.md`를 열고, Design 게시와 함께 landing 계약을 완료한다. 진행 중인 adoption이
Design 판단을 넘겼다면 adoption state와 그 판단이 가리키는 source를 읽는다.

진행 중인 adoption에서 받은 판단을 Design 답 없이 다른 route로 넘기면, 떠나기 전에 adoption state를
그 판단을 이어받을 route 하나와 범위가 정해진 다음 행동 하나로 교체한다.

현재 member의 Sketch가 넘긴 결론을 Design이 게시할 수 없으면 다른 target으로 직접 보내지 않는다.
`references/sketch-handoff.md`에 따라 이유와 다음 행동 하나를 지정해 같은 member의 `sketch`로
돌려보낸다.

Architecture가 Design 미적용을 선언하면 다른 Design reference를 열거나 project 문서를 수정하지 않는다.
새 사용자 접점이 생겼거나 현재 evidence가 그 선언과 충돌하면 Design 취향으로 정하지 않고
`architecture`로 보낸다. 그렇지 않고 진행 중인 adoption에서 판단을 받았다면 state를
`next_route: adopt`와 이어갈 행동 하나로 교체하고 `adopt`로 route한다. 그 외에는 `direct`로 route한다.

적용 여부가 없거나 지원 surface가 열려 있거나 모순되면 `architecture`로 route한다. Product 약속이나
Domain 의미가 부족하면 `product`로 route한다.

Design이 적용될 때만 `references/project-knowledge.md`, `references/design-document.md`와 현재 경험
질문이 route한 Domain·Design 계보를 연다. decision 문서를 만들거나 교체할 때만
`references/decision-document.md`를 연다.

## 현재 경험 설명을 먼저 만든다

사용자에게 style 목록을 묻기 전에 Product의 사용자와 약속, Architecture의 지원 surface와 제약,
현재 선택, 관찰 가능한 interaction, 존재하는 경우의 UI·token·component code, live review surface와
명시된 reference로 하나의 현재 경험 설명을 만든다. 이미 정해진 원칙, evidence로 확인할 수 있는
pattern과 근거 없는 취향을 구분한다.

문서 항목, 색·component·화면 목록을 차례대로 질문하지 않는다. 현재 설명과 공통 Design 계약 사이에서,
답에 따라 경험 방향이나 여러 변경이 공유할 pattern·review 기준이 실제로 달라지는 지점만 질문 후보로
둔다.

## 지금 결정할 질문만 가른다

비어 있는 선택 때문에 다음 단계가 공통 경험 원칙이나 system pattern을 새로 발명해야 한다면 지금
다룬다. 한 surface에서 구현하며 값싸게 비교할 수 있는 가역적인 세부 선택은 미리 고정하지 않는다.
별도 조사·prototype·사용자 관찰이 필요하고 그 맥락을 현재 관리권 구간 밖에서도 보존해야 하면
`sketch`로 보낸다.

여러 방향이 실제로 성립하면 Product 결과, 일관성, 접근성, 지원 surface, 되돌림과 review 비용으로
비교하고 Design이 추천한다. 브랜드·미감·조직 우선순위처럼 사용자만 정할 수 있는 선택이 남을 때만
묻는다. 질문에는 현재 이해, 추천과 답에 따라 달라지는 경험을 설명한다.

## 현재 Design을 게시한다

`references/design-document.md`의 완성 조건과 split/fold 판정을 적용해 `project/design.md`와 필요한
child를 구성하고 기존 파일을 교체한다. code, external design source와 live catalog가 필요하면 그
역할, 선택 조건과 review route를 Design에 두되 내용을 복제하지 않는다.

중요한 이유·기각 대안·재검토 조건이 필요하면 `references/decision-document.md`를 열고 현재 decision
문서 하나를 만들거나 교체한다. 작업 사실, component 목록과 현재 규칙의 사본을 남기려고 만들지 않는다.

같은 변경에서 `.devflow/index.md`가 UI·interaction 질문을 Design root로 route하고, Architecture의
적용 선언과 Design 문서에서 foundation readiness를 판단하게 한다. leaf, token과 pattern을 index에
복사하지 않는다.

진행 중인 adoption에서 받은 판단이라면 canonical Design·decision과 route를 먼저 게시한 뒤 공통
gate에 따라 adoption state를 `next_route: adopt`와 이어갈 행동 하나로 교체한다. 독립적인 새
foundation 흐름으로 계속 진행하지 않는다.

## 현재 결과를 다시 읽고 route한다

Design root와 현재 질문에 선택된 Design 또는 Domain design child 계보를 다시 읽는다. index와
Product·Architecture·Domain 경계, 사용한다고 밝힌 live review surface도 확인한다. 업무 상태나 기술
제약이 Design으로 이동하지 않았는지, Design 규칙이 code·catalog와 서로 다른 두 정본이 되지 않았는지
본다.

진행 중인 adoption에서 받은 판단을 게시했으면 다른 route보다 먼저 `adopt`로 route한다. 지정된
surface와 현재 알려진 state에서 결과를 관찰할 수 있고 다음 변경이 공통 경험 기준을 새로 만들지 않아도
되면 `direct`로 route한다. 제품 경계는 `product`, 지원 surface·platform 질문은 `architecture`,
보존할 탐구는 `sketch`로 route한다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 Design, concern, decision, index path. Design이 적용되지 않으면 `none`
- `경험:` 현재 경험 방향과 여러 변경이 공유하는 표현·interaction·접근성·state 원칙
- `검토 surface:` 결과를 어디에서 무엇으로 관찰할지
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `미검증 또는 열린 항목:` 현재 증거로 확정하지 못한 경험 주장과 다시 확인할 조건

Product 또는 Domain의 업무 의미, Architecture 제약, Work artifact, 구현, adoption inventory,
verification verdict를 쓰지 않는다.
