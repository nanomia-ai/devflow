---
title: Product document contract and elicitation delivery plan
status: implemented-and-observed
purpose: Hand a fresh worker the intent, exact source changes, delivery order, and behavior evidence needed to improve Product without widening Devflow.
read_when: Implementing or reviewing the Product document contract, Product elicitation, or the Adopt-to-Product decision round trip.
authority: Execution handoff only. The accepted baseline remains plan/**, and current behavior remains source/** plus recorded evidence.
---

# Product 문서 계약과 질문 방식 개선 계획

## 1. 이 문서를 먼저 읽는 이유

이 작업은 Product 문서의 항목을 늘리는 일이 아니다. 아무것도 모르는 사람이나 AI가 프로젝트의
존재 이유, 사용자, 약속과 업무 의미를 처음 이해할 수 있게 하면서도, Product가 설문지나 저장소
목록이나 변경 이력으로 불어나는 실패를 막는 일이다.

현재 Product는 명확한 brief를 받아 정본을 만드는 경로는 입증되어 있다. 그러나 brief가 불완전할
때 어떤 질문을 먼저 해야 하는지, 언제 질문을 멈춰도 되는지, Adopt가 조사한 source 어디에도
제품의 목적이 없을 때 어떻게 사람의 판단을 구해야 하는지는 아직 입증되지 않았다.

이 문서는 그 간극을 메우기 위한 실행 계획이다. `plan/**`을 수정하거나 다시 정의하지 않는다.
계획과 충돌하는 구현 편의가 발견되면 이 문서를 고치는 것이 아니라 작업을 멈추고 충돌을
보고한다.

## 2. 반드시 보존할 기준

- `source/**`가 유일한 저작 원문이다. `skills/**`의 생성물을 직접 고치지 않는다.
- Product는 목적, 사용자, 가치, 제품 경계와 언어, cross-domain 구도를 결정한다.
- Domain은 별도 스킬이 아니라 독립된 업무 지식의 canonical home이다.
- Architecture는 코드 배치, 의존, runtime, data와 검증 방식을 소유한다.
- Design은 적용되는 제품의 경험·시각·상호작용 원칙을 소유한다.
- Sketch는 Product 양식을 미리 채우는 설문 단계가 아니다. 현재 대화에서 끝낼 수 없는 조사와
  판단을 보존한다.
- Adopt는 기존 문서와 코드를 새 문서에 쏟아붓지 않는다. source에서 단서를 찾아 Devflow의 현재
  문서 체계를 완성하고, 자료만으로 정할 수 없는 판단만 알맞은 decision route로 보낸다.
- 완성되지 않은 Product를 정본 경로에 게시하지 않는다.
- build와 hash는 전달 증거일 뿐 AI 행동 증거가 아니다.
- 기존 레거시 구현은 증거일 뿐 구현 원문, import, fallback 또는 호환 대상으로 사용하지 않는다.
- 중개노트는 읽기 전용 성공 사례다. 파일을 수정하거나 구조를 그대로 복사하지 않는다.

관련 기준은 다음 문서에서 확인한다.

- `plan/02-skill-and-document-architecture.md`: skill, decision route, canonical home과 adoption 관계
- `plan/04-delivery-and-validation.md`: target 하나씩 build하고 fresh-use를 본 뒤 다음 target으로 가는 순서
- `plan/08-document-contracts.md`: 문서 내용, 분해 기준과 Skill Rails module 소유 규칙
- `plan/09-reference-boundaries-and-document-decomposition.md`: 중개노트와 신규 도출의 경계
- `source/modules/project-knowledge.md`: 모든 프로젝트 문서에 적용되는 게시·분해 규칙
- `tests/foundation-target/README.md`: 현재 Product 행동의 proven/unproven 경계
- `tests/adopt-target/README.md`: 현재 Adopt 행동과 과잉 unknown 회귀의 근거

## 3. 현재 확인된 문제

### 3.1 Product는 질문을 거르지만 찾아내지는 못한다

현재 `source/targets/product/entry.md`는 답에 따라 문제, 사용자, 가치, 경계, 언어, 불변 조건이나
Domain 구성이 달라질 때만 사용자에게 묻도록 한다. 불필요한 질문을 거르는 기준으로는 옳다.

하지만 AI가 먼저 가능한 Product 설명을 만들고, 그 설명을 완성하려면 어디에서 근거 없는 선택을
해야 하는지 찾는 원리가 없다. 따라서 다음 두 실패가 모두 가능하다.

- 짧은 brief의 빈 곳을 그럴듯한 해석으로 조용히 채운다.
- Product의 항목 이름을 하나씩 질문하는 긴 설문을 만든다.

현재 fresh-use evidence도 명확한 brief만 `proven`이며 모호하거나 여러 대화가 필요한 Product는
명시적으로 `unproven`이다.

### 3.2 Product와 Sketch의 경계가 대화에서 분명하지 않다

현재 source는 해결되지 않은 제품 의미를 사용자 또는 Sketch로 보내라고 하지만 어느 쪽을 택할지
한 문장으로 설명하지 않는다. 다음 기준을 사용한다.

> 사용자가 자신의 경험이나 의도에 따라 지금 답할 수 있으면 Product가 묻고, 답을 얻기 위해 외부
> 조사나 실험이 필요하면 Sketch로 보낸다.

한 번의 답으로 끝나는 제품 선택을 Sketch artifact로 키우지 않는다. 반대로 사용자도 모르는 사실을
추측하게 만들어 Product 결정으로 기록하지 않는다.

### 3.3 Adopt는 source 충돌은 처리하지만 핵심 의미의 부재는 처리하지 못한다

현재 Adopt는 maintained source가 주장하거나 명시적으로 질문한 내용만 knowledge unit으로 인정한다.
이 규칙은 작은 fixture가 319줄짜리 unknown 목록으로 불어난 실제 실패를 막으므로 유지해야 한다.

하지만 모든 source가 현재 동작만 말하고 제품의 목적, 대상 또는 핵심 약속을 전혀 말하지 않는
경우가 남는다. 코드는 무엇을 하는지는 보여도 왜 그렇게 만들어졌는지는 확정할 수 없다. 이때
Adopt가 목적을 추론해 Product를 완성하거나 빈 Product를 게시해서는 안 된다.

좁은 예외는 다음 하나다.

> Product의 목적·대상·핵심 약속을 뒷받침하는 source 주장이 하나도 없어 자기완결적인 Product를
> 만들 수 없을 때만, 확인된 사실과 필요한 제품 판단을 분리해 Product로 보낸다.

실제 source끼리 충돌하지 않았으므로 이 부재를 `conflicts.md`에 넣지 않는다. 진행 중인 adoption의
`state.md`가 다음 route와 행동을 보존한다.

## 4. 설계 원리

### 4.1 질문 목록이 아니라 현재 설명에서 출발한다

Product는 받은 내용을 문서 항목에 옮기기 전에 현재 제품을 하나의 설명으로 먼저 구성한다. 그
설명을 완성하려면 AI가 선택을 만들어내야 하는 자리만 질문 후보가 된다. 비어 있다는 이유만으로
묻지 않는다.

질문이 필요하면 다음 내용을 자연스러운 문장으로 함께 전달한다.

- 지금까지 어떻게 이해했는지
- 어느 부분이 비어 있거나 함께 성립하기 어려운지
- 답에 따라 제품의 약속이나 책임이 어떻게 달라지는지

질문 개수나 순서를 고정하지 않는다. 여러 질문이 보이면 다른 질문들의 답까지 바꾸는 가장 상위의
질문부터 다룬다.

이 원리는 듀이의 탐구를 전체 방향으로 삼고, 중요한 주장들이 함께 성립하기 어려울 때만
엘렌코스를 점검 수단으로 쓰는 설계에서 나왔다. 철학자의 이름, 단계식 질문법이나 반례 개수는
실제 skill source에 넣지 않는다.

### 4.2 Product 문서 계약과 Product 대화를 분리한다

Product와 Adopt는 같은 `product.md`와 Domain parent를 작성하므로 문서의 내용·완료 조건은
`product-document` module 하나가 소유한다. 그러나 사용자와 대화하며 의미를 결정하는 writer는
Product 하나이므로 질문 방식은 Product entry가 소유한다.

`communication.md`는 표현 방법만 담당한다. 무엇을 언제 물을지는 표현 규칙이 아니므로 이 작업에서
고치지 않는다.

### 4.3 한 파일이 기본이고 내용의 필요성으로 줄인다

Product는 한 파일이 기본이다. 줄 수를 gate로 삼지 않는다. 역할, 제품 단위와 Domain처럼 병렬 관계는
표로 압축할 수 있고, 원인과 책임 경계는 문장으로 설명한다.

각 문장에는 다음 삭제 질문을 적용한다.

> 이 문장을 지웠을 때 독자가 제품의 목적, 약속, 책임 또는 업무 의미를 다르게 이해하는가?

아니라면 Product에서 제거한다. 별도 child는 기존 `project-knowledge`의 owner·사전 선택·의미 응집·
총비용 판정을 통과할 때만 만든다.

## 5. 변경 범위

### 변경한다

1. `source/modules/product-document.md`를 추가한다.
2. `source/skill-package.json`에 `product-document` module을 등록한다.
3. `source/targets/product/target.json`이 그 module을 import하게 한다.
4. `source/targets/product/entry.md`를 아래 계약으로 교체한다.
5. Product target을 build하고 기존 명확한 brief와 새 질문 사례를 관찰한다.
6. Product가 통과한 뒤에만 `source/targets/adopt/target.json`에 같은 module import를 추가한다.
7. `source/targets/adopt/entry.md`에 source 부족과 Product 왕복 규칙을 좁게 추가한다.
8. Adopt target을 build하고 source 부족 왕복 사례를 관찰한다.

### 변경하지 않는다

- `plan/**`
- `source/targets/sketch/entry.md`
- `source/targets/architecture/entry.md`
- `source/modules/communication.md`
- `source/modules/project-knowledge.md`
- `source/modules/project-gate.md`
- `source/modules/sketch-handoff.md`
- 중개노트 repository
- legacy 구현

관찰된 실패 없이 새 Interview skill, 철학 module, schema, renderer, checker, generator 또는 migration
경로를 추가하지 않는다.

## 6. 추가할 Product 문서 계약

`source/modules/product-document.md`를 다음 원문으로 추가한다.

```markdown
# Product와 Domain 문서 계약

이 계약은 Product와 Adopt가 `.devflow/project/product.md` 또는
`.devflow/project/domains/<domain>/index.md`를 만들거나 교체할 때 적용한다.
문서의 제목과 절을 고정하는 양식이 아니라, 처음 읽는 사람이나 AI가 알아야 할 현재 제품 의미를
빠뜨리지 않기 위한 계약이다.

## 제품이 존재하는 이유를 설명한다

Product는 소스 코드나 이전 대화를 보지 않아도 다음 내용을 이해할 수 있게 한다.

- 제품이 왜 존재하는지
- 누가 어떤 상황에서 어떤 문제를 겪는지
- 제품이 그 상황을 어떻게 바꾸겠다고 약속하는지
- 그 약속에 대해 제품이 어디까지 책임지는지

제품이 제공하지 않기로 결정한 내용은 독자가 당연히 기대할 가능성이 있고 그 오해가 실제 판단을
바꿀 때만 밝힌다. 문서를 완전하게 보이게 하려고 non-goal을 만들거나 별도 목록을 채우지 않는다.

역할, 제품을 이루는 단위, 공통 용어, Domain 구성, 불변 조건과 열린 제품 결정은 현재 제품을
올바르게 이해하는 데 필요할 때만 포함한다. 빈 항목이나 빈 절은 만들지 않는다.

## 제품 구성과 저장소 구성을 구분한다

앱, 서비스, 라이브러리, API, 펌웨어, 디바이스 또는 package가 여러 개라는 이유만으로 Product에
저장소 목록을 옮기지 않는다. 서로 다른 사용자, 제품 약속, 권한 또는 책임을 가진 단위만 Product의
구성으로 설명한다. 코드 배치, package 의존과 배포 구조는 Architecture가 소유한다.

여러 역할이나 구성 단위의 책임을 비교해야 한다면 표를 사용할 수 있다. 표의 열과 제목은 고정하지
않으며, 책임 차이를 이해하는 데 필요한 정보만 둔다.

Domain은 독립된 업무 상태, 규칙 또는 언어를 지속적으로 소유할 때만 만든다. 화면, 폴더, package,
팀 또는 기술 계층이라는 이유만으로 만들지 않는다. Product에는 Domain들이 제품을 어떻게 함께
이루는지만 두고, 한 Domain의 상세 규칙은 그 Domain parent에만 둔다.

## 현재 필요한 만큼만 쓴다

Product는 한 파일을 기본으로 한다. 같은 판단에 함께 필요한 내용은 길어져도 함께 두고, 관련 없는
독자가 반복해서 읽어야 하는 독립된 지식만 공통 분해 기준에 따라 Domain 또는 조건부 child로
분리한다.

한 문장을 지웠을 때 독자가 제품의 목적, 약속, 책임 또는 업무 의미를 다르게 이해하지 않는다면
그 문장은 Product에 필요하지 않다. 작업 과정, 과거 판본, 코드 목록, 구현 상태와 다른 정본의 요약은
두지 않는다. 병렬적인 역할·단위·Domain은 표로 압축하고, 원인과 책임 경계는 문장으로 설명한다.

## 다음 단계가 의미를 만들 필요가 없을 때 완전하다

다음 단계가 사용자, 제품 약속, 책임 경계 또는 Domain 의미를 새로 만들어내지 않고 시작할 수 있어야
한다. 함께 성립할 수 없는 제품 약속이 남아 있으면 완전하지 않다.

열린 제품 질문이 남을 수는 있다. 다만 현재는 어떻게 취급하는지, 무엇이 생기면 다시 결정하는지
분명해야 하며 가능한 답이 현재 제품 정의 전체를 뒤집어서는 안 된다. 목적, 대상 또는 핵심 약속을
근거 없이 선택해야만 문서를 쓸 수 있다면 Product는 아직 완전하지 않다.
```

`source/skill-package.json`의 `modules`에는 다음 항목을 추가한다.

```json
"product-document": "modules/product-document.md"
```

## 7. Product entry 교체안

`source/targets/product/entry.md`를 다음 원문으로 교체한다.

```markdown
---
name: product
description: Devflow 프로젝트의 목적, 사용자, 제품 약속과 책임 경계, 공통 언어, 불변 조건과 업무 Domain 구성을 정의하거나 수정한다. 새 프로젝트의 제품 의미를 정리하거나 열린 제품 판단을 해결할 때 사용한다. 기술 Architecture, UI Design, 변경 실행, 구현 또는 brownfield source 재구성에는 사용하지 않는다.
---

# 제품 경계 정의

Product는 처음 대화가 없어도 프로젝트가 왜 존재하고 누구에게 무엇을 약속하는지 이해할 수 있게
만든다. 구현 기술, runtime 구조, UI 체계와 delivery task를 선택하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에
저장하는 자연어에 적용한다. 이어서 `references/product-document.md`를 열어 Product와 Domain 문서의
내용과 완료 기준에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 유효한 조건으로 진입

target별 행동을 시작하기 전에 `references/project-gate.md`를 열고 `product` 조건을 적용한다.
이어서 `references/project-knowledge.md`를 연다. 읽을 수 있는 `.devflow/index.md`가 이미 있으면
Product 입력을 선택하기 전에 읽는다.

현재 member의 Sketch state가 `next_route`로 `product`를 지정하면 파일을 쓰기 전에
`references/sketch-handoff.md`를 열고, Product 게시와 함께 landing 계약을 완료한다.

새 프로젝트 brief, Product에 반영할 결론이 준비된 project Sketch, 현재 Product 의미를 바꾸는 열린
질문, 또는 진행 중인 Adopt가 넘긴 제품 판단이 있을 때 Product에 진입한다.

내부 Devflow foundation이 없는 maintained brownfield source의 조사와 재구성은 `adopt`가 맡는다.
다만 진행 중인 Adopt가 제품 판단을 이곳으로 보냈다면 다시 Adopt로 반송하지 않는다. 필요한 판단만
정리하고, 원자료 회계와 나머지 foundation 완성을 계속하도록 `adopt`로 돌려보낸다.

답을 얻으려면 외부 조사나 실험이 필요하고 그 탐구를 현재 대화에서 끝낼 수 없다면 `sketch`로
route한다. 여러 session이 필요한 인터뷰를 보관하려고 불완전한 canonical Product를 게시하지 않는다.

## 현재 이해를 먼저 만들고 필요한 것만 묻는다

brief, 사용자 결정, 관련 project Sketch finding, 진행 중인 adoption의 근거, 기존 Product와 Domain
canon을 이용해 현재 제품을 먼저 하나의 설명으로 구성한다. Product 문서의 항목을 설문 문항으로
바꾸거나 이미 알려진 내용을 다시 묻지 않는다.

문장을 완성하기 위해 AI가 근거 없는 선택을 해야 하고, 그 선택에 따라 제품의 목적, 대상, 약속,
책임 경계, 공통 언어, 불변 조건 또는 Domain 구성이 달라질 때만 질문한다. 모순으로 판단하기 전에
사용자의 설명과 사례가 함께 성립하는 자연스러운 해석이 있는지 먼저 확인한다.

사용자가 자신의 경험이나 의도에 따라 지금 답할 수 있는 제품 선택은 Product가 묻는다. 외부 증거가
필요하거나 사용자도 추측해야 하는 질문은 `sketch`로 보낸다. 질문할 때는 현재 어떻게 이해했는지,
어느 지점이 비어 있거나 함께 성립하기 어려운지, 답에 따라 무엇이 달라지는지를 평범한 말로 설명한다.
여러 질문이 보이면 다른 질문들의 답까지 바꾸는 질문부터 다룬다.

답이 기존 설명과 충돌하면 한쪽을 조용히 버리지 않는다. 두 의미가 실제로 함께 성립할 수 있는지
확인하고, 그렇지 않다면 어떤 약속을 유지할지 사용자에게 맡긴다. 사용자가 결정하지 못한 내용이
제품 정의에 반드시 필요하면 Product를 게시하지 않고 Sketch로 보낸다. 현재 제품을 일관되게 설명하는
데 필요하지 않다면 현재 취급과 다시 결정할 조건을 열린 제품 질문으로 남길 수 있다.

기술, 파일 배치, component, database, test 도구, 시각 스타일과 구현 순서는 묻지 않는다.

## foundation 게시

새 프로젝트에서는 `.devflow/project/product.md`, 필요한
`.devflow/project/domains/<domain>/index.md`, `.devflow/index.md`를 완전한 현재 문서로 구성한 뒤
게시한다. 역할, 구성 단위, Domain과 책임의 병렬 비교가 필요한 경우에는 표를 사용할 수 있지만,
고정된 제목이나 빈 절을 만들지 않는다.

index는 제품 경계 질문을 Product로, Domain 업무 질문을 알맞은 Domain parent로, 기술 질문을 존재하는
Architecture로, UI 질문을 적용 가능한 Design으로 route한다. 활성 작업 복구에는 immediate
`team/<current-member>/sketches/*/state.md`, `adoption/state.md`, `work/*/state.md` glob만 노출한다.
존재하지 않는 Architecture나 Design 파일을 placeholder로 만들지 않는다.

기존 Product를 바꿀 때는 영향을 받는 사용자, 기존 약속, 데이터·권한 의미와 Domain 경계를 함께
확인한다. 현재 의미가 바뀐 canonical Product와 Domain 문서만 교체하고, 질문 route가 바뀐 경우에만
가장 가까운 parent index를 갱신한다. 이후에도 결정을 지켜야 하는 이유는 현재 decision 문서 하나에
두며 Product 본문을 변경 이력으로 만들지 않는다.

## 다음 열린 질문에서 종료

게시하기 전에 새 문서를 입력과 대조해 다시 읽는다. Product와 Domain 사이에 같은 사실이 반복되지
않는지, 기술 또는 UI 결정이 섞이지 않았는지, 다음 단계가 제품 의미를 새로 만들어야 하는 부분이
남지 않았는지 확인한다.

새 foundation은 읽어야 할 Product와 Domain 경로를 지정해 `architecture`로 route한다. 활성 변경은
누락된 기술 foundation 결정이 없으면 `direct`로 돌려보낸다. 진행 중인 adoption에서 받은 판단을
해결했다면 원자료 조사와 나머지 문서 완성을 계속하도록 `adopt`로 돌아간다.

다음을 보고한다.

- `게시한 경로:` 생성하거나 교체한 canonical path
- `현재 제품 정의:` 제품의 목적, 대상과 핵심 약속
- `구성:` 실제로 존재하는 역할·제품 단위·Domain과 책임, 또는 `none`
- `Route와 행동:` 다음 route 하나와 범위가 제한된 행동 하나
- `열린 항목:` 현재 결정하지 않은 제품 질문과 닫는 조건이 있을 때만

Architecture, Design, Work artifact, 구현, adoption inventory 또는 verification verdict를 쓰지 않는다.
```

`source/targets/product/target.json`의 imports는 다음이 된다.

```json
[
  "communication",
  "project-gate",
  "project-knowledge",
  "product-document",
  "sketch-handoff"
]
```

## 8. Adopt에 추가할 원문

이 단계는 Product target의 build와 fresh-use 관찰이 끝난 뒤에만 시작한다.

`source/targets/adopt/entry.md`에서 `project-knowledge.md`를 여는 문장 뒤에 다음을 추가한다.

```markdown
Product 또는 Domain 문서를 구성하기 전에 `references/product-document.md`를 열고, 재구성한 문서의
내용과 완료 기준에 적용한다.
```

`## 산문이 아니라 의미를 재구성한다`의 knowledge unit 설명 뒤에는 다음을 추가한다.

```markdown
자료에 언급되지 않았다는 이유만으로 새로운 unknown을 만들지는 않는다. 다만 어느 maintained source에도
제품의 목적, 대상 또는 핵심 약속을 뒷받침하는 주장이 없어 자기완결적인 Product를 만들 수 없다면,
동작에서 의도를 꾸며내지 않는다. 현재 자료로 확인한 사실과 그 사실만으로는 결정할 수 없는 제품
의미를 구분해 `product`로 보낸다.
```

`## 풀 수 없는 conflict만 드러낸다`에는 다음을 추가한다.

```markdown
제품 의미가 자료끼리 충돌하는 경우와, 제품 의미를 뒷받침할 자료가 없는 경우를 구분한다. 전자는
`conflicts.md`에 기록하고, 후자는 conflict로 만들지 않는다. 후자는 adoption state에 현재까지 확인한
사실, 필요한 제품 판단과 `next_route: product`를 남긴다.

Product가 사용자 판단을 정리하면 같은 adoption으로 돌아와 그 결정을 canonical Product 또는 Domain에
흡수하고 나머지 source 회계를 계속한다. 답을 받지 못한 동안에도 독립적으로 처리할 수 있는 source
회계는 계속할 수 있지만, 목적·대상·핵심 약속을 추측한 Product를 완성본으로 게시하거나 adoption을
닫지는 않는다.
```

`source/targets/adopt/target.json`의 imports는 다음이 된다.

```json
[
  "communication",
  "project-gate",
  "project-knowledge",
  "product-document",
  "team-context"
]
```

기존 `conflicts.md` 계약, source-backed knowledge admission과 readiness 조건은 줄이거나 넓히지 않는다.

## 9. Product fresh-use 사례

현재 `tests/foundation-target/cases.md`의 명확한 brief 사례 A를 회귀 대조군으로 다시 사용한다. 이
사례에서도 질문을 새로 시작하거나 non-goal을 추가하면 회귀다.

같은 파일에 다음 한국어 사례를 추가한다.

```markdown
## E. 해석에 따라 제품 약속이 달라지는 짧은 brief

이 사례가 없으면 Product가 문서 항목을 설문처럼 묻지 않으면서도 중요한 제품 질문을 찾아내는지
알 수 없다.

### 첫 요청

Product를 사용해 동네 공방이 수업을 등록하고 수강생이 예약과 결제를 할 수 있는 서비스를 정의해 주세요.
운영자는 공방을 승인합니다.

### 사용자 후속 답변

이 제품은 공방 주인이 전화와 메신저로 받던 예약을 한곳에서 관리하도록 돕는 것이 우선입니다.
여러 공방을 비교하거나 추천하는 서비스가 되는 것은 현재 목적이 아닙니다.

### 관찰 기준

- 첫 요청만으로 완성된 Product를 지어내지 않는다.
- 사용자·가치·불변식 같은 문서 항목을 차례대로 묻지 않는다.
- 현재 이해와 가능한 다른 해석이 제품 약속을 어떻게 바꾸는지 설명한 뒤, 두 방향을 가르는 질문을 한다.
- 후속 답변에서 정해진 목적을 반영하고 결제 제공자·화면·기술 구조는 묻지 않는다.
- 사용자가 명시적으로 제외한 비교·추천은 경계로 남길 수 있지만 다른 non-goal을 추가하지 않는다.
```

질문의 정확한 문구를 answer key로 고정하지 않는다. 드러내야 할 갈림길과 묻지 말아야 할 내용만
판정한다.

### Product 통과 조건

- 기존 사례 A가 계속 통과한다.
- 새 사례 E에서 agent가 문서를 쓰기 전에 중요한 제품 갈림길을 드러낸다.
- 항목별 설문을 시작하지 않는다.
- 사용자 답 뒤 Product와 필요한 Domain만 게시한다.
- 저장소 package 목록, 기술, UI와 임의의 non-goal을 Product에 넣지 않는다.
- Architecture가 사용자·목적·핵심 약속을 새로 만들지 않고 시작할 수 있다.

질문을 찾지 못하거나, 첫 입력만으로 목적을 지어내거나, 문서 항목별 질문을 나열하면 `failed`다.
실행하지 않은 Sketch 회귀, 다중 이해관계자와 여러 session 경로는 `unproven`으로 남긴다.

## 10. Adopt fresh-use 사례

`tests/adopt-target/cases.md`에는 source conflict가 아니라 source 부족을 다루는 사례 하나를 추가한다.
fixture에는 현재 동작을 보여 주는 코드·테스트·짧은 사용법만 두고, 누구의 어떤 문제를 풀려는
제품인지에 관한 주장은 의도적으로 두지 않는다.

```markdown
## C. 동작은 있으나 제품 목적이 없는 brownfield

이 사례가 없으면 Adopt가 코드의 현재 동작을 제품 의도로 꾸며내지 않고 필요한 판단을 Product에
맡긴 뒤 adoption으로 돌아오는지 알 수 없다.

### 요청

Use Adopt to reconstruct this unmanaged repository into Devflow. Account for every maintained
source, but do not infer why the product exists from implementation behavior alone.

### 관찰 기준

- 코드와 테스트에서 현재 동작을 확인하되 제품의 목적이나 대상이라고 단정하지 않는다.
- 자료에 없는 모든 가능성을 unknown으로 만들지 않는다.
- 자기완결적인 Product에 반드시 필요한 제품 판단만 `product`로 보낸다.
- Product 결정 전에는 완성된 Product나 완료된 adoption이라고 보고하지 않는다.
- 결정 뒤에는 다시 Adopt로 돌아와 source 회계와 foundation 완성을 계속한다.
- `conflicts.md`에는 실제로 양립하지 않는 source 주장만 둔다.
```

fixture의 구체적인 기술이나 기능은 중요하지 않다. 현재 기능에서 목적을 유일하게 도출할 수 없고,
그 사실이 answer key에서 분명하기만 하면 된다. 새 fixture를 만들기 전에 기존 Adopt fixture를 작은
변형으로 재사용할 수 있는지 먼저 확인한다.

### Adopt 통과 조건

- 기존 conflict 사례 A/B의 행동이 회귀하지 않는다.
- source 부족을 실제 conflict로 기록하지 않는다.
- 제품 목적을 코드에서 추론해 정본으로 게시하지 않는다.
- adoption state가 Product 판단과 복귀 지점을 보존한다.
- Product 결정 뒤 Adopt가 재개되어 완전한 foundation과 source disposition을 끝낸다.
- 기존 과잉 unknown 문제가 되살아나지 않는다.

## 11. 중개노트 비악화 검토

새 계약으로 다음 의미를 모두 표현할 수 있는지 source diff를 검토한다. 중개노트의 문장이나 제목을
복사하는 검사가 아니라, 유효한 의미의 home이 사라지지 않는지 보는 정적 검토다.

| 중개노트의 유효한 내용 | 새 계약의 home |
|---|---|
| 제품 목적과 장기 축 | Product의 항상 필요한 제품 정의 |
| 사용자·계정 맥락 | 필요한 역할과 책임, 관련 Product 불변식 |
| `main`·`admin` 역할 표 | 서로 다른 제품 단위의 책임 비교 표 |
| Domain 언어 표 | Product의 cross-domain 구성과 각 Domain parent |
| 제품 불변식 | 필요한 Product 또는 Domain 불변 조건 |
| 명시적인 책임 경계 | 독자가 기대할 만한 실제 경계만 약속 곁에 기록 |
| 문서 권위 표 | `.devflow/index.md`; Product에 복제하지 않음 |
| 제품 변경 시 영향 확인 | Product entry의 기존 Product 변경 규칙 |

이 정적 검토는 fresh-agent 행동 증거가 아니다. 중개노트 전체 adoption, 다중 제품 repository와 초대형
monorepo에서의 장기 유지성은 별도 관찰 전까지 `unproven`으로 남긴다.

## 12. Skill Rails 전달 순서

Skill Rails 설치본의 `SKILL.md`와 `references/skillEvolutionMethod.md` §§0–0.1을 현재 작업 시점에 다시
읽는다. 아래 명령 형태는 현재 CLI help로 확인한 최소 형식이며, 실제 실행 전 help와 exact owner
inspection을 다시 확인한다.

```text
node <skill-rails-cli>/cli.mjs inspect --source source/skill-package.json --id <exact-id> --json
node <skill-rails-cli>/cli.mjs build --source source/skill-package.json --target product --out skills/product
node <skill-rails-cli>/cli.mjs check --source source/skill-package.json --target product --out skills/product
```

### 1차: Product

1. 변경 전 `product` target, `project-knowledge`, Product entry와 manifest를 exact ID 또는 path로 inspect한다.
2. `product-document` module, package registration, Product import와 Product entry를 한 변경으로 작성한다.
3. Product target만 build한다.
4. 생성 diff와 `.skill-rails-build.json` receipt를 검토한다.
5. 같은 source로 다시 build하여 tree hash가 같은지 확인한다.
6. integrity와 source currentness를 별도로 check한다.
7. standalone copy와 fresh AI 세션에서 기존 A와 새 E를 실행한다.
8. 실제 read, 질문, write와 route를 기록하고 `proven|failed|unproven`을 구분한다.
9. 실패하면 문장·소유 위치·사례 가정 중 실제 원인을 찾아 Product 안에서 고친다. Adopt로 진행하지 않는다.

### 2차: Adopt

1. Product 행동이 입증된 뒤 현재 Adopt owner와 `product-document` 소비 관계를 다시 inspect한다.
2. Adopt manifest import와 세 개의 좁은 entry 문단만 추가한다.
3. Adopt target만 build하고 double-build, receipt, diff, integrity와 currentness를 확인한다.
4. 기존 Adopt A/B를 필요한 최소 범위로 회귀 확인하고 새 C를 fresh AI로 실행한다.
5. 질문이 Product에서 해결된 뒤 같은 adoption으로 돌아오는 전체 왕복을 관찰한다.
6. 결과를 Adopt evidence에 기록한다.

한 target의 build와 fresh-use 판정이 끝나기 전에 다음 target을 구현하지 않는다.

## 13. 작업 중 멈춰야 하는 조건

다음 중 하나가 발생하면 임의로 범위를 넓히지 말고 사용자에게 보고한다.

- Product와 Adopt 외의 target 또는 공통 module을 바꾸지 않으면 해결할 수 없는 실제 충돌이 발견됨
- `plan/**`의 lifecycle, canonical ownership 또는 문서 계약을 바꿔야 함
- Product가 질문한 뒤 Adopt로 돌아오는 경로가 기존 project gate로 표현되지 않음
- 새 module을 Product와 Adopt가 실제로 같은 의미로 소비하지 못함
- 기존 명확한 brief 또는 Adopt conflict 행동이 회귀함
- 중개노트의 목적·역할·앱 책임·Domain·불변식 중 하나가 새 계약에서 home을 잃음
- 테스트를 통과시키기 위해 질문 문구, heading 또는 표 열을 고정해야 함
- schema, renderer, checker, generator 또는 migration layer가 필요해 보임

## 14. 완료 보고

작업자는 다음을 구분해 보고한다.

- 수정한 canonical source 경로
- 생성된 target 경로와 tree hash
- deterministic build, integrity와 currentness 결과
- 각 fresh-use 사례의 실제 관찰과 `proven|failed|unproven` 판정
- 기존 사례의 회귀 여부
- 중개노트 의미 대응 검토 결과
- 여전히 입증되지 않은 경로
- 계획과 달라진 점이 있다면 그 원인과 사용자 결정이 필요한지 여부

빌드 성공을 질문 행동의 성공으로 표현하지 않는다. 실행하지 않은 경로를 통과했다고 보고하지 않는다.

## 15. 실행 결과와 계획 차이

Product와 Adopt source, 공통 `product-document` module, 두 target import와 사례 A/E/C를 구현했다.
Product의 질문·근거 규칙은 tree
`87b6aa30165a11888a05ac54a4b46ad022e00df73612c7db1e53099a3055bb18`에서 기존 A와 새 E를
fresh-use로 관찰했다. 이후 adoption 복귀 계약을 공통 gate로 옮긴 현재 Product tree는
`3a3f6c6874f21be269447afa107f9087ee51d25861f33bc2d65c6c8da38c1866`이며, 사례 C의 Product
구간에서 정본 게시와 Adopt 복귀를 관찰했다. 현재 tree에서 A와 E를 다시 실행하지 않았으므로 그
byte 단위 회귀는 `unproven`이다.

Adopt tree `70959ed05cd4d9e96309557d3df331e1606b98585f88cf6de40782a2de9d1105`에서는 기존 A/B와
새 C 전체 왕복을 fresh-use로 관찰했다. C의 actor 전환 사이 state bytes는 확인했지만 별도 Resume
actor는 실행하지 않았으므로 Resume 보고 기준은 `unproven`이다.

계획과 달리 `source/modules/project-gate.md`도 수정했다. 기존 문구가 adoption 중 conflict 해결 route만
허용해, source 어디에도 제품 목적이 없는 경우 필요한 Product 판단을 막았기 때문이다. 예외를 Product와
Adopt에 복제하지 않고, adoption이 넘긴 `product`, `architecture`, `design` 판단과 canonical 게시 뒤
`adopt` 복귀를 공통 gate가 소유하게 했다. 이 변경으로 직접 소비하는 나머지 target도 다시 생성하고
integrity와 source currentness를 확인했다.

| target | current tree | 현재 bytes의 행동 증거 |
|---|---|---|
| product | `3a3f6c6874f21be269447afa107f9087ee51d25861f33bc2d65c6c8da38c1866` | 사례 C의 Product 구간만 관찰 |
| adopt | `70959ed05cd4d9e96309557d3df331e1606b98585f88cf6de40782a2de9d1105` | 사례 A/B/C 관찰 |
| architecture | `9b7813ee677b95ffba555b005e7b6949372eaf49e8ecacc4269f5d7da2ed2f54` | rebuild/check만 수행, `unproven` |
| design | `42ec63e1c321cf853c7b4a047ecd179d5d05392e686a28c1aeb60d427fc30ab4` | rebuild/check만 수행, `unproven` |
| direct | `3f8c31265222359f07999e01487bace2147bacf6373e5c3cae0d3ae15a04303c` | rebuild/check만 수행, `unproven` |
| resume | `f0780c682e96ff7357b829cadf8001214892b3af475ec9736dacf481d9375116` | rebuild/check만 수행, `unproven` |
| sketch | `0abdc73de5d0ab373adbe9d639cdc7bb2759aa18b44d336039fc607048a28077` | rebuild/check만 수행, `unproven` |
| verify | `00663b5dc6ccbb13869e46c2e31c15d7fbd0e54411624cf46e050008848fe791` | rebuild/check만 수행, `unproven` |
| work | `0cee2496cdfef42f9dde57677a8ccbae5546a0e7a75138d8cffe6710eb701908` | rebuild/check만 수행, `unproven` |

아홉 target 모두 `artifactIntact: true`, `sourceCurrent: true`를 확인했다. 이 표는 전달 상태와 실제 행동
증거를 구분하며, Architecture·Design 판단의 adoption 복귀, adoption 중 Sketch 이관, 여러 이해관계자와
장기 Product 인터뷰는 여전히 `unproven`이다.
