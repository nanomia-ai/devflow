---
name: product
description: Devflow 프로젝트의 사용자, 문제, 가치, 제품 경계, 언어, 불변 조건, 업무 Domain 구성을 정의하거나 수정한다. 명확한 새 프로젝트 brief 또는 열린 제품 결정을 다룰 때 사용한다. 기술 Architecture, UI Design, 변경 방향 결정, 구현, brownfield 재구성에는 사용하지 않는다.
---

# 제품 경계 정의

Product는 처음 대화가 없어도 프로젝트의 목적과 업무 의미를 이해할 수 있게 만든다. 제품이 어떤 문제를 누구를 위해 해결하고, 약속의 경계가 어디에서 끝나는지 결정한다. 구현 기술, runtime 구조, UI 체계, delivery task는 선택하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `product` 조건을 적용한다. 이어서 `references/project-knowledge.md`를 연다. 읽을 수 있는 `.devflow/index.md`가 이미 있으면 Product 입력을 선택하기 전에 읽는다.

현재 member의 Sketch state가 `next_route`로 `product`를 지정하면 파일을 쓰기 전에 `references/sketch-handoff.md`를 열고, Product 게시와 함께 landing 계약을 완료한다.

명확한 새 프로젝트 brief, 여기로 route된 완료된 project Sketch, 또는 제품 의미를 바꾸는 열린 질문이 있을 때만 Product에 진입한다. 내부 Devflow foundation이 없는 maintained brownfield source는 `adopt`로 route한다. 아직 조사가 필요한 불확실한 아이디어는 `sketch`로 route한다. 여러 session이 필요한 인터뷰를 보관하려고 불완전한 canonical Product를 게시하지 않는다. 불확실성은 Sketch에 보존하고, 일관된 현재 답만 Product에 게시한다.

## 제품 의미만 결정

brief, 사용자가 명시한 결정, 관련 project Sketch finding, 기존 Product 또는 Domain canon을 사용한다. 선택에 따라 문제, 사용자, 가치, 경계, 공통 언어, 불변 조건, domain 구성이 실질적으로 달라질 때만 사용자에게 묻는다. 기술, 파일 배치, component, database, test 도구, 시각 스타일, 구현 순서를 묻지 않는다.

다음을 정의한다.

- 문제, 사용자 또는 운영 역할, 제공할 가치
- 제품 경계 안의 capability와 명시적인 non-goal
- 이후 독자가 일관되게 사용해야 하는 안정적인 용어
- 제품의 불변 조건과 실제로 열려 있는 제품 질문
- 서로 다른 업무 상태, 규칙, 언어가 독립된 home을 정당화할 때만 업무 Domain

Domain은 지식 경계이며 menu item, code module, team, skill이 아니다. Domain index는 해당 Domain의 목적, 경계, 핵심 용어, 상태 또는 불변 조건, 다른 Domain과의 계약, 선택적인 child route, 열린 업무 질문을 소유한다. Domain 사이의 구성은 Product에 두고, 한 Domain의 규칙은 그 Domain에만 둔다.

## foundation 게시

새 프로젝트에서는 `.devflow/project/product.md`, 필요한 `.devflow/project/domains/<domain>/index.md`, `.devflow/index.md`를 게시하기 전에 완전한 현재 문서로 구성한다. Product 문서는 누가 어떤 문제를 겪는지, 약속할 가치, scope와 non-scope, 공통 언어, domain 간 구성, 제품 불변 조건, 열린 제품 질문에 답해야 한다. 빈 section은 생략하고 문서를 완전해 보이게 하려고 사실을 만들지 않는다.

index는 제품 경계 질문을 Product로, Domain 업무 질문을 알맞은 Domain parent로, 기술 질문을 존재하는 Architecture로, UI 질문을 적용 가능한 Design으로 route한다. 활성 작업 복구에는 immediate `team/<current-member>/sketches/*/state.md`, `adoption/state.md`, `work/*/state.md` glob만 노출한다. Architecture 준비 상태는 완전한 Product와 `project/architecture.md`에서 판단하고, Design 준비 상태는 Architecture의 적용 여부와 필요한 경우 `project/design.md`에서 판단한다고 설명한다. 존재하지 않는 Architecture나 Design 파일을 placeholder로 만들지 않는다.

기존 프로젝트를 수정할 때는 현재 의미가 바뀐 canonical Product와 Domain 문서만 교체한다. 질문 route가 바뀐 경우에만 가장 가까운 parent index를 갱신한다. 이후에도 존재해야 결정을 보호할 수 있는 이유는 현재 decision 문서 하나에 둔다. Product 본문을 change log로 만들지 않는다.

## 다음 열린 질문에서 종료

게시한 뒤 새 header와 본문을 brief에 대조해 다시 읽는다. 문서가 자기완결적인지, Product와 Domain 사이에 제품 사실이 중복되지 않았는지, 기술 또는 UI 결정이 섞이지 않았는지 확인한다.

새 foundation은 읽어야 할 Product와 Domain 경로를 지정해 `architecture`로 route한다. 활성 변경은 누락된 기술 foundation 결정이 없으면 `direct`로 돌려보낸다. 해결되지 않은 제품 의미는 추측하지 말고 사용자 또는 project Sketch로 route한다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 canonical path
- `제품 경계:` 제품의 약속과 명시적인 non-goal을 평범한 문장으로 설명
- `Domain:` 각 업무 Domain과 독립된 지식 경계가 필요한 이유, 또는 `none`
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `미검증 또는 열린 항목:` 제공된 증거로 확정하지 못한 결정

Architecture, Design, Work artifact, 구현, adoption inventory, verification verdict를 쓰지 않는다.
