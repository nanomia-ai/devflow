---
name: architecture
description: 완전한 Product foundation을 바탕으로 Devflow 프로젝트의 기술 경계, 구성요소, 의존 방향, runtime 및 data flow, public seam, verification channel, Design 적용 여부를 정의하거나 수정한다. 열린 Architecture 결정을 다룰 때 사용한다. 제품 의미, UI 원칙, delivery 방향, 구현, brownfield 재구성에는 사용하지 않는다.
---
<!-- generated; do not edit; source: targets/architecture/entry.md; receipt: .skill-rails-build.json -->

# 기술 foundation 정의

Architecture는 완전한 Product와 업무 Domain을 이후 변경이 안전하게 작업할 수 있는 현재 기술 경계로 바꾼다. 구조, 의존 방향, runtime 및 data flow, public seam, 운영 경계, verification channel을 소유한다. 제품 의미를 다시 정의하거나 상세한 사용자 경험을 결정하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `architecture` 조건을 적용한다. 이어서 `references/project-knowledge.md`와 읽을 수 있는 `.devflow/index.md`를 연다.

현재 member의 Sketch state가 `next_route`로 `architecture`를 지정하면 파일을 쓰기 전에 `references/sketch-handoff.md`를 열고, Architecture 게시와 함께 landing 계약을 완료한다.

Architecture에는 완전한 `.devflow/project/product.md`가 필요하다. system promise와 domain 간 구성을 파악하기 위해 Product를 읽고, 현재 기술 질문이 route한 Domain parent와 기존 Architecture child만 연다. Product 의미가 불완전하거나 모순되면 기술 선택을 하지 않고 `product`로 route한다. 아직 흡수되지 않은 maintained brownfield 의미는 `adopt`로 route한다. 현재 custody 구간에서 끝낼 수 없는 조사는 불완전한 canonical Architecture를 남기지 말고 `sketch`로 route한다.

## 업무 의미가 아닌 기술 경계 결정

사용자가 명시한 제약, 현재 Product와 Domain 계약, 존재하는 관련 code 또는 runtime 증거, 이미 current인 기술 결정을 사용한다. 선택에 따라 component, deployment, dependency 방향, data ownership, public seam, verification, Design 적용 여부가 실질적으로 달라질 때만 사용자에게 묻는다. 근거가 없는 provider, scale, deployment, 운영 주장은 해결 조건과 함께 명시적인 unknown으로 남긴다.

다음에 답하는 가장 작은 일관된 foundation을 정의한다.

- 지원 환경과 deployment 형태
- 구성요소와 각 책임
- 구성요소 및 Domain 사이의 의존 방향과 계약
- runtime 및 durable-data flow
- public seam과 internal implementation detail의 경계
- 구현 결정을 바꾸는 failure 및 운영 경계
- 실행 가능한 verification channel과 사용할 수 없는 external channel
- Design이 필요한지, 적용되지 않는지, 열린 기술 질문인지와 그 이유

Domain lifecycle이나 Product 불변 조건을 기술 규칙으로 다시 서술하지 않는다. canonical parent를 참조하고, 이를 지키는 데 필요한 기술 계약만 설명한다. framework, folder, table 이름만으로 child 문서를 만들지 않는다.

## 현재 Architecture 게시

완전한 현재 `.devflow/project/architecture.md`를 구성한 뒤 기존 파일을 교체한다. 본문에는 환경, 구성요소 및 의존 model, runtime/data flow, public seam, verification channel, Design 적용 여부, 선택적인 concern route, 열린 기술 질문이 있어야 한다. `project/architecture/<concern>.md`를 만들기 전에 공통 split test를 적용한다. 작은 foundation은 parent 문서 하나를 기본으로 한다.

같은 변경에서 `.devflow/index.md`를 갱신해 기술 질문을 Architecture로 route하고, Product, Architecture, Design 적용 여부에서 foundation 준비 상태를 판단할 수 있게 한다. 실제 child가 있을 때만 concern route를 추가하거나 제거한다. 기술 답을 index에 복사하지 않는다.

기각한 대안이나 reopen 조건이 현재 구조를 보호하는 데 필요하면 현재 decision 문서 하나를 쓰고, 실제 적용되는 규칙을 Architecture에 반영한다. Architecture 작업이 있었다는 사실만 기록하려고 decision 파일을 만들지 않는다.

## 다음 열린 질문에서 종료

Architecture header, route된 child, index route, Architecture가 의존하는 Product 및 Domain 경계를 다시 읽는다. 업무 사실이 Architecture로 이동하지 않았는지, 기술 사실이 Product 또는 Domain에 복사되지 않았는지, 각 verification channel이 실제로 사용 가능하거나 명시적인 unknown인지 확인한다.

Architecture가 Design 필요를 선언했는데 완전한 Design이 없으면 결정해야 할 surface와 제약을 지정해 `design`으로 route한다. Design이 적용되지 않으면 새 foundation을 `direct`로 route한다. 해결되지 않은 제품 전제는 `product`, 조사가 필요한 기술 unknown은 `sketch`, canonical update가 끝난 활성 변경 결정은 `direct`로 route한다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 Architecture, concern, decision, index path
- `구조:` 구성요소, 의존 방향, runtime/data flow, public seam
- `검증:` 실행 가능한 channel과 사용할 수 없거나 미검증인 주장
- `Design 적용 여부:` 필요, 미적용, 열림 중 하나와 그 이유
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `미검증 또는 열린 항목:` 현재 증거로 확정하지 못한 기술 주장

Product 또는 Domain의 업무 의미, Design 원칙, Work artifact, 구현, adoption inventory, verification verdict를 쓰지 않는다.
