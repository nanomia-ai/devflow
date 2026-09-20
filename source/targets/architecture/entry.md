---
name: architecture
description: 완전한 Product foundation을 바탕으로 Devflow 프로젝트의 현재 기술 경계, 구성요소, 의존 방향, runtime 및 data flow, public seam, verification channel, Design 적용 여부를 정의하거나 수정한다. 열린 Architecture 결정을 다룰 때 사용한다. 제품 의미, UI 원칙, delivery 방향, 구현, brownfield 재구성에는 사용하지 않는다.
---

# 현재 기술 foundation 정의

Architecture는 완전한 Product와 업무 Domain을 이후 변경이 안전하게 작업할 수 있는 현재 기술 구조로
바꾼다. 미래의 완성 설계도를 예측하지 않고, 다음 단계가 주요 기술 경계를 새로 만들지 않아도 되는
가장 작은 일관된 foundation을 게시한다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `architecture` 조건을 적용한다. 이어서
`references/project-knowledge.md`, `references/architecture-document.md`와 읽을 수 있는
`.devflow/index.md`를 연다. decision 문서를 만들거나 교체할 때만
`references/decision-document.md`를 연다.

현재 member의 Sketch state가 `next_route`로 `architecture`를 지정하면 파일을 쓰기 전에
`references/sketch-handoff.md`를 열고, Architecture 게시와 함께 landing 계약을 완료한다.

완전한 Product를 읽고, 현재 기술 질문이 route한 Domain과 Architecture 계보만 연다. Product 의미가
불완전하거나 모순되면 `product`, 흡수되지 않은 maintained brownfield 의미는 `adopt`로 보낸다.
다만 진행 중인 Adopt가 state로 기술 판단을 이곳에 보냈다면 다시 Adopt로 반송하지 않고 그 판단만
다룬다.
현재 대화에서 확인할 수 있는 code, configuration, runtime과 공식 기술 근거는 먼저 확인한다. 추가
조사나 prototype이 필요하고 그 질문과 맥락을 현재 관리권 구간을 넘어 보존해야 하면 불완전한 canon을
남기지 말고 `sketch`로 보낸다.

## 현재 기술 설명을 먼저 만든다

사용자에게 기술 목록을 묻기 전에 Product·Domain 계약, 명시한 제약, 현재 decision과 관련
code/runtime evidence로 하나의 현재 기술 설명을 만든다. 무엇이 실행·배포되어야 하는지, 어떤 조건이
구조를 바꾸는지, 이미 정해진 경계와 근거 없는 선택이 무엇인지 드러낸다.

문서 항목, framework 이름과 pattern 목록을 차례대로 질문하지 않는다. 현재 설명과 공통 Architecture
계약 사이에서, 답에 따라 실제 기술 경계가 달라지는 지점만 질문 후보로 둔다.

## 지금 결정할 질문만 가른다

비어 있는 선택 때문에 다음 단계가 주요 경계를 새로 발명해야 한다면 지금 다룬다. 구현하면서 값싸게
배울 수 있는 가역적인 local 선택은 미리 정하지 않는다.

여러 후보가 실제로 성립하면 현재 제약을 만족하는 가장 작은 후보를 결과, 가역성, 운영 책임과 검증
비용으로 비교하고 Architecture가 추천한다. 비용·운영 주체·지원 환경·외부 계약처럼 사용자만 정할 수
있는 제약이 남을 때만 묻는다. 질문에는 현재 이해, 추천과 답에 따라 달라지는 구조를 설명한다.

진행 중인 adoption에서 받은 판단을 다른 route로 넘기면, 떠나기 전에 adoption state를 그 판단을
이어받을 route 하나와 범위가 정해진 다음 행동 하나로 교체한다.

## 현재 Architecture를 게시한다

`references/architecture-document.md`의 완성 조건과 split/fold 판정을 적용해
`project/architecture.md`와 필요한 child를 구성하고 기존 파일을 교체한다. 기계 판독 model이나 자동
검사가 필요하다는 판정이 나오더라도 Architecture에서 구현하지 않는다. 지킬 불변식, 관찰 가능한
위반과 미검증 범위를 게시하고, 구현은 이후 `direct`가 다루는 변경으로 남긴다.

중요한 이유·기각 대안·재검토 조건이 필요하면 `references/decision-document.md`를 열고 현재 decision
문서 하나를 만들거나 교체한다. 작업 사실, stack 목록과 현재 규칙의 사본을 남기려고 만들지 않는다.

같은 변경에서 `.devflow/index.md`가 기술 질문을 Architecture root로 route하고 foundation readiness를
판단하게 한다. leaf와 기술 답을 index에 복사하지 않는다.

진행 중인 adoption에서 받은 판단이라면 canonical Architecture·decision과 route를 먼저 게시한 뒤
공통 gate에 따라 adoption state를 `next_route: adopt`와 이어갈 행동 하나로 교체한다. 독립적인 새
foundation 흐름으로 계속 진행하지 않는다.

## 현재 결과를 다시 읽고 route한다

Architecture root와 현재 질문에 선택된 child 계보를 다시 읽는다. 이 child는 Architecture subtree나
한 Domain의 technical subtree에 있을 수 있다. index와 Product·Domain 경계도 함께 확인한다. 업무
의미가 이동하거나 기술 사실이 다른 home에 복제되지 않았는지, 불변식과 교체 가능한 선택이 섞이지
않았는지, verification channel이 실행 가능하거나 명시적으로 미검증인지 확인한다.

진행 중인 adoption에서 받은 판단을 게시했으면 다른 route보다 먼저 `adopt`로 route한다.
Architecture가 Design 필요를 선언했고 완전한 Design이 없거나 이번 변경으로 경험 판단이 다시
필요하면 결정해야 할 surface와 제약을 지정해 `design`으로 route한다. Design이 적용되지 않거나 필요한
Design이 이미 완전하면 새 foundation을 `direct`로 route한다. 해결되지 않은 제품 전제는 `product`,
보존할 조사가 필요하면 `sketch`, canonical update가 끝난 활성 변경 결정은 `direct`로 route한다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 Architecture, concern, decision, index path
- `구조:` 구성요소, 의존 방향, runtime/data flow, public seam
- `선택 근거:` 구조를 지배한 제약·증거와 Architecture가 고른 선택의 짧은 이유
- `검증:` 실행 가능한 channel과 사용할 수 없거나 미검증인 주장
- `Design 적용 여부:` 필요, 미적용, 열림 중 하나와 그 이유
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `미검증 또는 열린 항목:` 현재 증거로 확정하지 못한 기술 주장

Product 또는 Domain의 업무 의미, Design 원칙, Work artifact, 구현, adoption inventory, verification
verdict를 쓰지 않는다.
