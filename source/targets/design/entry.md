---
name: design
description: Architecture가 UI Design이 적용된다고 판단한 경우 Devflow 프로젝트의 사용자 경험, visual foundation, 구성요소 및 interaction 전략, accessibility, responsive 및 state 원칙, review surface를 정의하거나 수정한다. 열린 UI 체계 결정을 다룰 때 사용한다. 제품 의미, 기술 Architecture, delivery 방향, 구현, headless 프로젝트에는 사용하지 않는다.
---

# 경험 foundation 정의

Design은 적용 가능한 Product와 Architecture foundation을 이후 UI 변경이 구현하고 검토할 수 있는 현재 경험 원칙으로 바꾼다. 경험 방향, visual foundation, 구성요소 및 interaction 전략, accessibility, responsive behavior, state 표현, review surface를 소유한다. 업무 규칙이나 기술 seam을 다시 정의하지 않는다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `design` 조건을 적용한다. 이어서 `references/project-knowledge.md`와 읽을 수 있는 `.devflow/index.md`를 연다. Design 적용 여부를 판단하기 전에 Product와 Architecture를 읽는다.

읽을 수 있는 Sketch state가 `next_route`로 `design`을 지정하면 파일을 쓰기 전에 `references/sketch-handoff.md`를 열고, Design 게시와 함께 receiver 계약을 완료한다.

Architecture가 Design 미적용을 선언하면 project 문서를 만들거나 수정하지 않고 `direct`로 route한다. 적용 여부가 없거나 모순되거나 기술적으로 열려 있으면 추측하지 말고 `architecture`로 route한다. Design이 적용되면 UI surface 또는 interaction 질문이 선택한 Domain parent와 기존 Design child만 읽는다. 현재 custody 구간에서 끝낼 수 없는 불확실한 경험 조사는 불완전한 canonical Design을 남기지 말고 `sketch`로 route한다.

## 제품이나 기술이 아닌 경험 원칙 결정

Product의 사용자와 약속, Architecture가 지원하는 surface와 seam, 사용자가 명시한 선택, 존재하는 관찰 가능한 UI 증거를 사용한다. 선택에 따라 경험 방향, visual foundation, 구성요소 체계, interaction behavior, accessibility, responsive behavior, state 표현, review method가 실질적으로 달라질 때만 사용자에게 묻는다.

다음에 답하는 가장 작은 일관된 foundation을 정의한다.

- 적용되는 사용자와 surface를 위한 경험 목표와 원칙
- 모든 token을 미리 열거하지 않는 visual foundation과 token 전략
- 구성요소 전략과 구성요소들이 공유하는 안정적인 pattern
- interaction, navigation, feedback, error-recovery 원칙
- accessibility와 input method 기대
- Product와 Architecture가 정한 presentation range의 responsive behavior
- loading, empty, error, partial, success, permission, destructive-action 상태 원칙
- 구체적인 review surface와 reviewer가 관찰해야 할 내용
- 열린 Design 질문과 이를 닫을 증거 또는 결정

Domain 상태와 규칙을 Design에 복사하지 말고 참조한다. rendering 경계, data seam, platform 제약은 Architecture를 참조한다. framework 내부 구현, endpoint 형태, storage, 구현 task를 선택하지 않는다.

## 현재 Design 게시

완전한 현재 `.devflow/project/design.md`를 구성한 뒤 기존 파일을 교체한다. `project/design/<concern>.md`를 만들기 전에 공통 split test를 적용한다. page, component, framework 이름만으로는 독립된 concern이 되지 않는다. 작은 제품은 Design parent 하나를 기본으로 한다.

같은 변경에서 `.devflow/index.md`를 갱신해 UI 및 interaction 질문을 Design으로 route하고, Architecture의 적용 선언과 Design 문서에서 foundation 준비 상태를 판단할 수 있게 한다. 실제 child가 있을 때만 concern route를 추가한다. pattern이나 Domain 규칙을 index에 복사하지 않는다.

기각한 대안이나 reopen 조건이 현재 경험 방향을 보호하는 데 필요하면 현재 decision 문서 하나를 쓰고, 실제 적용되는 규칙을 Design에 반영한다. Design 작업이 있었다는 사실만 기록하려고 decision 파일을 만들지 않는다.

## 다음 열린 질문에서 종료

Design header와 본문, index route, Design이 의존하는 Product·Architecture·Domain 경계를 다시 읽는다. 지정된 surface에서 경험을 검토할 수 있는지, 사용자가 만날 수 있는 모든 상태에 원칙이 있는지, 업무 또는 기술 사실이 중복되지 않았는지 확인한다.

완전한 foundation은 `direct`로 route한다. 제품 경계 질문은 `product`, 기술 적용 여부 또는 platform 질문은 `architecture`, 조사가 필요한 경험 질문은 `sketch`로 route한다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 Design, concern, decision, index path. Design이 적용되지 않으면 `none`
- `경험:` 경험, 구성요소, interaction, accessibility, responsive, state를 지배하는 원칙
- `검토 surface:` 결과를 어디에서 어떻게 관찰할지
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `미검증 또는 열린 항목:` 현재 증거로 확정하지 못한 경험 주장

Product 또는 Domain의 업무 의미, Architecture, Work artifact, 구현, adoption inventory, verification verdict를 쓰지 않는다.
