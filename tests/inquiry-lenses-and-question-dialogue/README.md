---
title: Foundation inquiry lenses and human question dialogue delivery plan
status: implemented-representatively-observed
purpose: Give a fresh worker the intent, exact source changes, delivery order, and evidence needed to add bounded philosophical inquiry lenses and open human questioning without widening Devflow lifecycles or burdening runs that do not ask questions.
read_when: Implementing or reviewing the inquiry reasoning of Sketch, Product, Architecture, and Design, or the way Devflow asks a person for intent, constraints, and binding choices.
authority: Execution handoff only. The accepted baseline remains plan/**, current behavior remains source/**, and implementation claims require recorded evidence.
---

# 탐구 관점과 사람에게 묻는 방식 개선 계획

## 1. 이 작업을 하는 이유

Devflow의 Sketch, Product, Architecture와 Design은 이미 무작정 질문하거나 문서 항목을 차례로 채우지
않는다. 각 target은 먼저 현재 설명을 만들고, 증거로 확인할 수 있는 것은 직접 확인하며, 실제 결론을
바꾸는 사용자 소유 선택만 묻도록 작성되어 있다. 이 기반은 보존해야 한다.

다만 지금 source만 처음 읽는 AI는 그 행동들이 왜 중요한지 충분히 알지 못할 수 있다. 예를 들어
`막연한 불확실성을 하나의 문제로 만든다`, `가장 저렴한 증거를 고른다`, `함께 성립하기 어려운 설명을
가른다`는 문장은 올바르지만, 서로 어떤 관계를 가지며 어느 순간에 더 중요해지는지는 짧은 문장만으로
복원해야 한다. 작성 당시의 배경을 아는 AI에게는 강한 기준이지만, 깨끗한 문맥의 AI에게는 여러 지침
중 하나처럼 가볍게 읽힐 여지가 있다.

이전 Product·Architecture·Design 작업에서는 철학 이름이 역할극이나 고정 문답 순서로 변하는 위험을
피하려고 철학의 이름을 source에 넣지 않았다. 그 판단은 과잉 이론화는 막았지만, 이름이 제공하는
압축된 배경지식과 중요도까지 함께 버렸다. 이번 작업은 그 선택을 반대로 뒤집어 철학 설명을 늘리는
일이 아니다. 각 target에서 실제로 사용하는 부분만 이름, 기능, 기대 행동과 적용하지 않는 경계로
묶어, AI가 기존 규칙을 더 깊고 일관되게 해석하도록 만드는 일이다.

질문 방식에도 별도의 간극이 있다. 현재 target들은 언제 무엇을 물어야 하는지는 상당 부분 정하지만,
그 질문을 host의 선택형 form으로 보낼지, 사람이 자신의 말로 설명할 수 있는 대화로 보낼지는 정하지
않는다. 사람의 의도·경험·우선순위는 미리 만든 두세 개 선택지로 충분히 표현되지 않을 수 있다.
선택지는 답을 빠르게 받게 하지만, 아직 발견되지 않은 생각을 선택지 바깥으로 밀어내기도 한다.

따라서 이번 작업에는 서로 다른 두 개선이 포함된다.

1. 네 foundation target이 문제를 만들고 판단하고 검토하는 배경에, 목적이 다른 철학적 관점을
   의도적으로 배치한다.
2. target이 사용자에게 물어야 한다고 이미 판단한 뒤, 그 질문을 사람의 생각이 드러나는 대화로
   표현하는 공통 계약을 추가한다.

첫 번째는 **어떻게 생각할지**에 관한 target 고유 판단이다. 두 번째는 **필요한 질문을 어떻게
전달할지**에 관한 조건부 공통 계약이다. 둘을 한 규칙이나 한 module로 섞지 않는다.

## 2. 반드시 보존할 기준

- `plan/**`은 변경하지 않는 승인된 baseline이다.
- `source/**`만 skill 저작 원문이다. `skills/**`의 생성물을 직접 고치지 않는다.
- 철학은 Product, Architecture, Design 또는 Sketch의 권한을 넓히지 않는다.
- 철학은 evidence, canonical ownership, 사용자 결정과 현재 source보다 높은 권위가 아니다.
- Sketch는 지속할 필요가 있는 하나의 열린 탐구만 보존한다.
- Product는 목적, 사용자, 약속, 제품 경계와 업무 의미를 소유한다.
- Architecture는 기술 구조, 의존, runtime·data 흐름, 운영 책임과 검증 channel을 소유한다.
- Design은 적용되는 경우의 현재 경험 원칙과 review surface를 소유한다.
- 질문 표현 계약은 질문의 필요성과 내용을 새로 결정하지 않는다. 각 target이 이미 소유한 질문 선별
  기준이 먼저다.
- 질문 수 `3`은 목표나 할당량이 아니라 한 번의 메시지에 둘 수 있는 상한이다.
- build, hash와 graph 검사는 전달 증거다. 깨끗한 AI가 실제로 다르게 판단하고 질문했는지는 fresh-use
  관찰 전까지 `unproven`이다.
- 철학 이름 때문에 새 schema, 질문 DSL, checker, renderer, lifecycle, state field 또는 별도 공개 skill을
  만들지 않는다.
- legacy Devflow는 구현 원문, fallback 또는 호환 대상이 아니다.

이번 작업은 다음 기존 문서의 의미를 다시 정의하지 않는다.

- `plan/02-skill-and-document-architecture.md`: route, owner와 canonical home
- `plan/04-delivery-and-validation.md`: target 하나씩 전달하고 행동을 관찰하는 순서
- `plan/08-document-contracts.md`: 문서 내용과 분해 계약
- `source/modules/project-gate.md`: 각 target의 진입과 adoption gate
- `source/modules/project-knowledge.md`: project 문서의 게시·분해·재결합 규칙
- `source/modules/product-document.md`, `architecture-document.md`, `design-document.md`: 문서의 내용과 완료 조건
- `source/modules/communication.md`: 모든 자연어에 적용되는 표현 규칙

### 2.1 이 문서는 복사 실행할 정답지가 아니다

작업자는 아래 source 문장을 그대로 삽입하기 전에 현재 bytes와 전제를 다시 검증한다. 특히
communication 소비자, 각 target의 질문 owner, 조건부 reference의 실제 읽기 방식과 기존 fresh-use
경계를 확인한다. 현재 source가 달라졌거나 더 작은 표현이 같은 행동을 만든다면 목적과 경계를
보존하면서 구현안을 조정할 수 있다.

다만 조정 사실을 숨기지 않는다. 무엇을 다르게 했는지, 어떤 현재 관찰 때문에 달라졌는지, 원래
위험을 여전히 어떻게 막는지를 이 evidence home에 기록한다. lifecycle, canonical ownership 또는
사용자에게 보이는 질문 정책이 달라지는 조정은 구현하지 말고 먼저 결정으로 올린다.

## 3. 현재 source에서 확인한 상태

### 3.1 좋은 행동은 이미 있지만 배경은 고르게 드러나지 않는다

| Target | 현재 source에 있는 유효한 행동 | 철학 적용의 현재 지위 |
|---|---|---|
| Sketch | 하나의 지배 질문, 현재 결정을 바꿀 가장 저렴한 증거, 관찰·해석·미해결의 구분 | 철학과 잘 맞지만 특정 철학을 의도해 배치했다는 source 근거는 없음 |
| Product | 현재 제품 설명을 먼저 만들고, 자연스러운 해석이 여러 개일 때 가장 상위 질문부터 다룸 | 듀이의 탐구와 엘렝코스를 의도적으로 사용했으나 이름을 source에서 제외함 |
| Architecture | 현재 기술 설명을 먼저 만들고, 후보를 결과·가역성·운영 책임·검증 비용으로 비교함 | Product의 탐구 행동을 의도적으로 계승했으나 기술 판단에 맞는 관점의 역할을 명시하지 않음 |
| Design | 현재 경험 설명을 먼저 만들고, 후보를 사용자 결과·일관성·접근성·review 비용으로 비교함 | 같은 탐구 행동을 계승했으나 디자인에 고유한 학습·검토 관점을 명시하지 않음 |

따라서 기존 행동을 철학으로 교체하면 안 된다. 철학은 이미 효과적인 문장의 배경과 관계를 밝혀야
하며, 구체적인 route와 행동 계약은 그대로 남아야 한다.

이 작업은 이전 handoff의 다음 구현 방침만 다시 연다.

> 철학자의 이름을 실제 skill source에 넣지 않는다.

그 문장은 당시의 과잉 방지 수단이었다. 이번에는 사용자가 지적한 이해 비용을 새로운 관찰로 받아들여
다음 방침으로 교체한다.

> 철학 이름만 넣지 않는다. 이 target에서 빌려 쓰는 기능, 기대하는 판단과 적용하지 않는 경계를 함께
> 적는다.

이전 handoff 문서는 당시 판단의 기록이므로 고치지 않는다. 이 README가 이번 변경에서만 위 구현
방침을 뒤따르는 최신 실행 지시다. lifecycle, owner와 문서 계약에 관한 이전 결정은 그대로 유효하다.

### 3.2 `communication.md`는 질문 전용 문서가 아니다

Skill Rails exact inspection 결과 `communication` module은 다음 아홉 target의 소비자다.

```text
adopt, architecture, design, direct, product, resume, sketch, verify, work
```

각 entry는 target 행동을 시작하기 전에 이 module을 열도록 한다. 현재 내용은 설명, 질문, 진행 보고,
결과 보고와 다음 actor에게 전달하는 모든 자연어에 적용된다. 결론과 필요한 배경을 연결하고, 낯선
이름을 설명하며, 사실·해석·제안·미확정을 구분하고, 사람이 이해하는 데 필요한 만큼만 쓰게 하는
항상 필요한 계약이다.

반면 이번에 추가할 열린 질문의 묶음, host form의 사용 경계와 답변 자유도는 질문을 실제로 보낼 때만
필요하다. 이 상세를 `communication.md`에 넣으면 Resume가 상태만 보고하거나 Work가 구현 결과만
보고하는 실행에서도 매번 읽힌다. 질문을 하지 않는 실행이 더 많아질수록 이 비용은 누적된다.

그렇다고 질문 계약을 아무 연결 없이 분리하면, AI가 질문을 만든 뒤에도 module의 존재를 떠올리지
못할 수 있다. 해결은 다음과 같다.

- 상세 규칙은 별도 조건부 module이 한 번만 소유한다.
- 실제로 탐색 질문을 할 수 있는 target만 그 module을 import한다.
- 각 target entry에는 질문을 보내기 직전에 module을 여는 짧고 판정 가능한 조건을 둔다.
- 무엇을 질문할지는 계속 target entry가 정하고, module은 표현 방식만 정한다.

이 구조에서는 질문하지 않는 실행이 읽는 추가 내용이 한 줄짜리 조건에 머문다. 질문이 필요한
실행에서는 그 순간 전체 계약을 읽으므로 질문이 소극적으로 사라지지도 않는다. 조건부 파일을 여는
비용보다 건너뛸 수 있는 본문의 양이 충분히 크므로 Skill Rails의 조건부 module 기준에도 맞는다.

### 3.3 선택형 form이 유효한 경우까지 없애지는 않는다

사람의 목적, 경험, 의미, 우선순위와 제약을 발견하는 질문에는 미리 만든 선택지가 불리하다. 아직
발견하지 못한 답을 선택지로 표현할 수 없고, 추천 표시가 사용자의 생각을 대신할 수도 있다.

그러나 이미 충분히 설명된 두 행동 중 실행 승인을 받는 경우처럼 답의 집합이 실제로 닫혀 있고,
선택지마다 결과가 분명한 운영 확인에서는 form이 더 간단할 수 있다. 따라서 host form 전체를
금지하지 않는다. 다음 경계를 사용한다.

```text
열린 대화가 필요한 것:
  의도, 경험, 의미, 우선순위, 제약 또는 아직 구성되지 않은 대안을 발견하는 질문

닫힌 선택을 사용할 수 있는 것:
  후보가 실제로 유한하고 서로 배타적이며, 빠진 답이 없고, 사용자가 각 결과를 이미 이해하는 승인·운영 선택
```

`기타` 입력칸이 있다는 사실은 불완전한 선택지를 닫힌 선택으로 바꾸지 않는다. 사용자가 선택지의
전제나 표현을 바꾸면 결정 자체가 달라질 수 있다면 일반 문장으로 물어야 한다.

### 3.4 현재에서 무엇이 달라지는가

| 구분 | 현재 | 이번 변경 뒤 | 제거·보존 판단 |
|---|---|---|---|
| 철학적 배경 | Product 계획에는 의도가 기록됐지만 source는 행동만 말함. Architecture·Design은 그 행동을 계승하고 Sketch는 유사한 행동을 가짐 | 네 target entry가 자신에게 필요한 철학의 이름, 기능과 비적용 경계를 짧게 말함 | 기존의 구체적인 행동 기준은 보존하고, 새 절과 뜻이 같은 이유 설명만 evidence 뒤에 합침 |
| 질문 필요성 | 각 target이 evidence와 사용자 권한을 기준으로 판단함 | 그대로 유지 | question module로 옮기거나 공통화하지 않음 |
| 질문 표현 | 현재 이해와 달라지는 결과를 설명하지만 form과 열린 대화의 경계는 없음 | 열린 탐색은 일반 대화, 독립 질문은 한 번에 최대 세 개, 의존 질문은 순차적으로 보냄 | 고정 질문 목록과 설문 순서는 만들지 않음 |
| 공통 communication | 아홉 target이 항상 읽는 자연어 표현 계약 | 변경하지 않음 | 질문 전용 본문을 넣지 않음 |
| 문서·lifecycle | 현재 owner, route, 문서 계약과 state를 사용함 | 변경하지 않음 | 새 공개 skill, state나 산출물을 만들지 않음 |

사전에 삭제할 source 문장은 지정하지 않는다. 새 배경이 기존 문장과 실제로 중복되는지는 target별
fresh-use와 해석 검토에서 확인한다. 중복이 입증되면 이유의 반복만 덜고, 행동을 바꾸는 조건과 경계는
남긴다.

## 4. 철학을 source에 넣는 원칙

### 4.1 이름은 배경을 불러오는 표지이며 행동의 정본은 아니다

철학자의 이름과 이론명은 AI가 이미 학습한 넓은 배경을 짧게 불러오는 데 유용하다. 그러나 모델마다
기억하는 설명이 다르거나, 같은 철학을 지나치게 넓게 적용할 수 있다. 이름만 쓰면 오히려 source에
없는 절차를 AI가 보태는 원인이 된다.

각 target의 `탐구와 검토 관점`에는 다음 네 요소를 자연스러운 문장으로 둔다.

1. 사용하는 철학 또는 이론의 이름
2. 이 target이 그 철학에서 빌려 쓰는 기능
3. 그 기능이 만들어야 하는 관찰 가능한 판단
4. 그 이름으로 해서는 안 되는 일

철학에 관한 역사, 인용문, 학파 비교, 단계별 교본은 넣지 않는다. AI에게 철학자 역할을 맡기지도
않는다. source의 현재 evidence와 사용자 권한이 철학적 설명보다 우선한다.

### 4.2 하나의 철학으로 전 과정을 설명하지 않는다

문제를 만드는 일, 가능한 설명을 세우는 일, 설명을 줄이는 일과 충분한 시점을 판단하는 일은 서로
다르다. 한 철학이 모든 역할을 맡게 하면 이름은 간단해지지만 실제 사고 과정은 흐려진다.

반대로 알려진 철학을 많이 나열하면 AI가 모든 관점을 매번 수행하는 체크리스트로 오해한다. 고정된
개수를 먼저 정하지 않고, 각 관점이 다른 판단을 맡으며 그것을 빼면 실제 행동의 기준이 사라지는지로
선택한다. 아래 제안이 target마다 세 관점을 사용하는 것은 할당량이 아니라, 문제 형성·후보 구성·검토
또는 종료 판단에 필요한 역할이 현재 세 가지로 구분되기 때문이다. 한 관점이 두 기능을 충분히
설명하거나 fresh-use에서 효과가 없으면 줄인다.

### 4.3 철학별 위험과 제한

| 관점 | 이 작업에서 얻는 것 | 잘못 적용했을 때의 위험 | source에서 둘 경계 |
|---|---|---|---|
| 듀이의 탐구 | 막연한 상황을 실제로 결정할 문제로 바꿈 | 이미 충분한 문제를 계속 재정의함 | 현재 결정을 막는 불확실성이 있을 때만 문제를 다시 구성함 |
| 퍼스의 귀추 | 불완전한 증거에서 설명 가능한 후보를 만듦 | 후보 수를 채우거나 그럴듯함을 사실로 부름 | 증거가 하나의 설명을 강제하지 않을 때만 최소 후보를 세우고 가설로 표시함 |
| 포퍼의 비판적 시험 | 후보를 실제로 가르는 관찰을 찾음 | 한 실패로 목적 전체를 폐기하거나 모든 판단을 실험으로 미룸 | 현재 주장이나 후보를 바꿀 수 있는 비례적 관찰에만 사용함 |
| 해석학적 순환 | 부분 사례와 전체 제품 의미를 왕복하며 이해함 | 기존 전체 설명을 권위로 삼아 새 사실을 흡수함 | 전체 설명도 수정 가능한 현재 해석으로 취급함 |
| 소크라테스의 엘렝코스 | 함께 성립하기 어려운 주장과 전제를 드러냄 | 대화를 논박이나 끝없는 반문으로 바꿈 | 제품 약속을 실제로 바꾸는 불일치에만 사용하고 결정은 사용자에게 둠 |
| 시스템 사고 | 구성요소, 흐름, 운영 책임과 2차 효과를 함께 봄 | 작은 결정을 전체 재설계로 키움 | 현재 기술 경계를 바꾸는 관계까지만 추적함 |
| 쇤의 행위 중 성찰 | prototype과 실제 surface에서 드러난 사실로 수단을 고침 | 만들면서 목적과 범위를 조용히 바꿈 | 경험을 표현하는 수단만 수정하고 제품 목적 변경은 owner route로 돌림 |
| 아리스토텔레스의 프로네시스 | 불완전한 정보에서 지금 정할 것과 미룰 것을 고름 | 경험이나 취향을 근거 없는 권위로 사용함 | evidence, 되돌림 비용과 사용자 소유 가치를 함께 밝힘 |

## 5. target별 탐구와 검토 관점

각 내용은 target entry 안에 둔다. 모든 철학을 모은 공통 module은 만들지 않는다. 공통 module을 만들면
각 target이 사용하지 않는 관점까지 열게 되고, AI가 서로 다른 역할을 섞을 가능성이 높다. 아래 문장은
기존 행동 계약을 대체하지 않는 짧은 배경 계약이다.

| Target | 기획·형성에서 쓰는 관점 | 검토·축소에서 쓰는 관점 |
|---|---|---|
| Sketch | 듀이로 문제를 만들고 퍼스로 필요한 후보를 세움 | 포퍼로 후보를 가를 가장 값싼 증거를 찾음 |
| Product | 듀이로 제품 문제를 만들고 해석학적 순환으로 부분과 전체를 조정함 | 엘렝코스로 양립하기 어려운 핵심 약속만 검토함 |
| Architecture | 퍼스로 현재 기술 설명을 세우고 시스템 사고로 관계와 파급을 봄 | 포퍼로 중요한 기술 주장을 실행 가능한 관찰에 연결함 |
| Design | 듀이로 현재 경험을 구성함 | 쇤으로 실제 표현물에서 배우고 프로네시스로 지금 정할 범위를 가름 |

이 구분은 별도의 기획 phase와 검증 phase를 새로 만드는 것이 아니다. 각 target이 현재 설명을 만들고
게시 전에 다시 읽는 기존 흐름 안에서 어느 관점이 어떤 판단을 돕는지 밝힌 것이다.

### 5.1 Sketch: 문제를 만들고 후보를 세우고 증거로 줄인다

사용할 조합은 듀이의 탐구, 퍼스의 귀추와 포퍼의 비판적 시험이다.

- 듀이는 막연한 아이디어나 불편을 하나의 지배 질문과 결정 가능한 상태로 바꾸는 데 사용한다.
- 퍼스는 현재 증거가 하나의 설명을 강제하지 않을 때만, 결정에 의미 있는 최소 후보를 만드는 데
  사용한다.
- 포퍼는 후보를 지지하는 자료를 끝없이 모으기보다 현재 결론을 바꿀 가장 값싼 관찰을 찾는 데
  사용한다.

`source/targets/sketch/entry.md`의 진입 판단 뒤, artifact를 만들기 전에 다음 의미의 짧은 절을 둔다.

```markdown
## 탐구와 검토 관점

Sketch는 듀이의 탐구처럼 막연한 불확실성을 다음 결정을 막는 하나의 문제 상황으로 바꾼다. 현재
증거가 한 설명을 강제하지 않을 때만 퍼스의 귀추를 사용해 결정에 의미 있는 최소 후보를 세우며,
후보 수를 채우거나 가설을 사실로 다루지 않는다. 후보를 가를 때는 포퍼의 비판적 시험처럼 현재
결론을 바꿀 가장 값싼 관찰을 먼저 찾되, 한 번의 실패로 제품 목적 전체를 폐기하지 않는다.
```

현재의 `하나의 지배 질문`, Sketch 생성 세 조건, `가장 저렴한 증거`와 landing 계약은 유지한다.
철학 절 때문에 모든 Sketch에 복수 가설이나 실험이 필수가 되어서는 안 된다.
현재 Sketch가 금지하는 `하나의 분석 방법을 강제`하는 행동과도 함께 성립해야 한다. 세 관점은 모든
Sketch가 순서대로 수행할 방법론이 아니라, 해당 종류의 모름이 실제로 나타났을 때 판단을 돕는
배경이다. 깨끗한 AI가 이를 세 단계 절차로 재현하면 실패로 판정한다.

### 5.2 Product: 전체 제품 의미를 만들고 충돌하는 약속을 가른다

사용할 조합은 듀이의 탐구, 해석학적 순환과 소크라테스의 엘렝코스다.

- 듀이는 불완전한 brief를 사용자, 문제와 핵심 약속이 연결된 제품 문제로 구성하는 데 사용한다.
- 해석학적 순환은 사용자의 개별 사례·역할·Domain 단서와 전체 제품 목적을 서로 대조하는 데
  사용한다. 전체 설명도 언제든 수정 가능한 현재 해석이다.
- 엘렝코스는 중요한 제품 주장들이 실제로 함께 성립하기 어려울 때만 전제와 결과를 드러내는 검토
  수단이다. 사용자를 논박하거나 질문을 계속 만드는 수단이 아니다.

`source/targets/product/entry.md`의 입력·route 판단 뒤, `현재 이해를 먼저 만들고 필요한 것만 묻는다`
앞에 다음 의미를 둔다.

```markdown
## 탐구와 검토 관점

Product는 듀이의 탐구처럼 불완전한 요청을 사용자, 문제와 핵심 약속이 연결된 제품 문제로 구성한다.
개별 사례와 역할은 해석학적 순환처럼 전체 제품 설명과 서로 대조하며, 현재 전체 설명도 새 단서로
고칠 수 있는 해석으로 취급한다. 중요한 약속들이 함께 성립하기 어려울 때만 소크라테스의
엘렝코스로 전제와 결과를 드러내며, 논박하거나 질문 수를 늘리기 위해 사용하지 않는다.
```

현재 Product의 자연스러운 해석 확인, 가장 상위 질문 우선, 사용자와 Sketch의 경계 및 불완전 Product
게시 금지는 유지한다.

### 5.3 Architecture: 가능한 기술 설명을 시스템으로 보고 실행으로 공격한다

사용할 조합은 퍼스의 귀추, 시스템 사고와 포퍼의 비판적 시험이다.

- 퍼스는 Product·Domain 제약과 code/runtime evidence가 불완전할 때 가장 설명력이 높은 현재 기술
  구조를 도출하는 데 사용한다.
- 시스템 사고는 stack 이름을 고르는 데 그치지 않고 구성요소, 의존 방향, data/runtime 흐름, 운영
  책임과 변경의 2차 효과를 함께 보는 데 사용한다.
- 포퍼는 중요한 기술 주장을 실행 가능한 verification channel이나 명시적인 미검증 상태와 연결하는
  데 사용한다.

`source/targets/architecture/entry.md`의 진입·evidence route 뒤, `현재 기술 설명을 먼저 만든다` 앞에
다음 의미를 둔다.

```markdown
## 탐구와 검토 관점

Architecture는 퍼스의 귀추처럼 Product·Domain 제약과 code/runtime evidence를 가장 잘 설명하는
현재 기술 구조를 찾되, 가장 그럴듯한 설명을 확인된 사실로 바꾸지 않는다. 시스템 사고로 구성요소,
흐름, 운영 책임과 현재 경계를 바꾸는 2차 효과를 함께 본다. 중요한 기술 주장은 포퍼의 비판적
시험처럼 실패를 관찰할 수 있는 verification channel과 연결하되, 모든 가역적 선택을 미리 실험하거나
작은 결정을 전체 재설계로 키우지 않는다.
```

현재의 후보 비교 기준인 결과, 가역성, 운영 책임과 검증 비용을 지우지 않는다. 이 구체적인 기준이
철학 이름보다 우선한다.

### 5.4 Design: 경험을 구성하고 실제 표현물을 보며 조정한다

사용할 조합은 듀이의 경험·탐구 관점, 쇤의 행위 중 성찰과 아리스토텔레스의 프로네시스다.

- 듀이는 디자인을 색·화면·component 목록이 아니라 사용자의 상황과 결과가 이어지는 현재 경험으로
  구성하는 데 사용한다.
- 쇤은 prototype, 현재 UI와 live review surface에서 예상하지 못한 사실을 보며 표현 수단을 수정하는
  데 사용한다.
- 프로네시스는 여러 변경이 공유해야 하므로 지금 정할 원칙과 한 surface에서 값싸게 비교할 가역적
  세부를 구분하는 데 사용한다.

`source/targets/design/entry.md`의 적용·evidence route 뒤, `현재 경험 설명을 먼저 만든다` 앞에 다음
의미를 둔다.

```markdown
## 탐구와 검토 관점

Design은 듀이의 경험·탐구 관점처럼 화면과 style 목록보다 사용자가 상황 속에서 겪는 하나의 현재
경험을 먼저 구성한다. prototype, 현재 UI 또는 live review surface가 예상 밖의 사실을 드러내면
쇤의 행위 중 성찰처럼 표현 수단을 고치되 제품 목적을 조용히 바꾸지 않는다. 프로네시스를 사용해
여러 변경이 공유해야 할 원칙과 구현하며 값싸게 비교할 세부를 가르며, 취향이나 경험을 근거 없는
권위로 사용하지 않는다.
```

Design이 적용되지 않는 경우에는 이 관점으로 Design 문서를 만들지 않는다. 현재 applicability gate,
경험 후보 비교 기준과 review surface 계약을 유지한다.

### 5.5 새 배경을 더한 뒤 기존 문장을 다시 덜어 낸다

철학 절을 추가한 뒤 기존 entry를 그대로 쌓아 두는 것도 정답은 아니다. 인접한 문장을 다시 읽어 다음
기준으로 정리한다.

- 조건, 소유자, route, 완료 증거와 금지를 정한 문장은 유지한다. 철학 이름이 이 행동 계약을 대신할
  수 없다.
- 같은 이유를 다른 표현으로 반복하는 문장은 하나로 합칠 수 있다.
- 철학 절이 없어도 충분히 분명한 행동을 이름만 바꾸어 되풀이한다면 철학 쪽 표현을 줄인다.
- 문장을 지웠을 때 깨끗한 AI가 언제 무엇을 하고 언제 하지 않을지를 다르게 답한다면 지우지 않는다.

처음부터 삭제 대상을 정하지 않는다. 각 target의 기준안·변경안 해석과 fresh-use를 비교한 뒤, 의미를
바꾸지 않는 중복만 같은 target 변경 안에서 덜어 낸다. 결과적으로 always-read entry가 이전보다
불필요하게 길어지지 않는 것이 목표지만, 줄 수를 맞추려고 배경이나 경계를 없애지는 않는다.

## 6. 질문 표현은 조건부 공통 module로 분리한다

### 6.1 새 owner

`source/modules/question-dialogue.md`를 추가하고 package ID는 `question-dialogue`로 등록한다. 이 module은
사람에게 질문할 필요가 이미 확정된 뒤의 표현만 소유한다.

다음은 이 module이 소유하지 않는다.

- 질문이 필요한지 여부
- 질문할 제품·기술·경험 또는 delivery 내용
- 사용자와 AI 사이의 결정 권한
- 질문의 답을 기록할 canonical home
- 답을 받지 못했을 때의 route와 state

이 내용은 계속 각 target entry와 기존 공통 계약이 소유한다.

### 6.2 추가할 module 원문

구현자는 현재 source와 fresh-use 검토에서 같은 의미를 더 짧고 자연스럽게 표현할 수 있으면 문장을
다듬을 수 있다. 그러나 아래의 적용 조건, 열린 질문 원칙, 세 질문 상한, 의존 질문 분리와 form 경계는
보존해야 한다.

```markdown
# 사람의 생각을 드러내는 질문

현재 target이 증거나 기존 정본으로 답할 수 없는 사용자 소유의 의도, 경험, 의미, 우선순위, 제약
또는 구속력 있는 선택을 실제로 물어야 한다고 판단한 뒤에만 적용한다. 이 문서는 질문의 필요성과
내용을 새로 만들거나 target의 권한을 넓히지 않는다.

## 선택지보다 대화로 묻는다

사람의 생각을 발견해야 하는 질문은 host의 선택형 form이 아니라 일반 대화문으로 보낸다. 먼저 현재
어떻게 이해했는지와 무엇이 아직 결정되지 않았는지 설명하고, 그 답이 현재 판단이나 결과를 어떻게
바꾸는지 밝힌다. 추천할 수 있는 방향이 있으면 근거와 함께 말하되, 추천을 사용자의 답으로 취급하지
않는다.

한 메시지에는 함께 생각하기 자연스러운 열린 질문을 최대 세 개까지 둘 수 있다. 세 개를 채우지
않는다. 각 질문은 사용자가 자신의 말로 답하거나 전제를 바로잡을 수 있게 쓰며, 일부만 답해도 다음
대화가 가능해야 한다.

질문들을 묶는 것은 서로 같은 배경을 공유하고 한 답이 다른 질문의 내용을 바꾸지 않을 때뿐이다.
상위 질문의 답에 따라 다음 질문이 달라지면 상위 질문 하나만 먼저 묻는다. target이 정한 질문 우선순위와
중단 조건은 이 상한보다 우선한다.

## 실제로 닫힌 선택만 form으로 묻는다

후보가 유한하고 서로 배타적이며 빠진 답이 없고, 사용자가 각 선택에 따른 결과를 이미 이해하는
승인이나 운영 선택에는 host의 선택형 form을 사용할 수 있다. `기타` 입력이 있다는 이유만으로 열린
질문을 닫힌 선택으로 바꾸지 않는다. 답의 표현, 조건이나 새로운 대안이 판단을 바꿀 수 있으면 일반
대화문으로 묻는다.

충분한 답을 얻으면 같은 의도를 다른 표현으로 다시 확인하거나 문서 항목을 질문 목록으로 바꾸지
않는다. 답에서 새 증거 조사나 다른 owner의 판단이 필요해지면 현재 target의 route 계약을 따른다.
```

### 6.3 왜 `communication.md`에 넣지 않는가

`communication.md`는 아홉 target에서 항상 읽고, 질문뿐 아니라 보고·설명·handoff의 모든 자연어에
필요하다. 질문 module의 본문은 질문 없는 실행이 안전하게 건너뛸 수 있다. 두 의미를 합치면 파일 수는
줄지만 전체 읽기 비용이 커지고, communication의 정체성도 흐려진다.

따라서 `source/modules/communication.md`는 이번 작업에서 고치지 않는다. communication은 질문의 문장도
사람이 이해할 수 있게 쓰도록 계속 적용되고, `question-dialogue`는 그 질문을 열린 대화로 구성할 때만
추가로 적용된다. 두 module은 경쟁하지 않는다.

### 6.4 소비 target과 정확한 읽기 조건

현재 source에서 사람의 의도나 구속력 있는 선택을 직접 물을 수 있는 다음 여섯 target만 module을
import한다.

| Target | module을 여는 순간 | 계속 target이 소유하는 판단 |
|---|---|---|
| Sketch | 증거로 정할 수 없는 구속력 있는 선택을 실제로 묻기 직전 | 무엇이 지배 질문이며 증거가 충분한지 |
| Product | 제품 의미를 바꾸는 사용자 소유 선택을 실제로 묻기 직전 | 어떤 제품 갈림길을 먼저 물을지 |
| Architecture | 사용자만 정할 수 있는 기술 제약을 실제로 묻기 직전 | 후보 비교와 기술 경계 |
| Design | 사용자만 정할 수 있는 브랜드·미감·조직 우선순위를 실제로 묻기 직전 | 경험 방향과 review 기준 |
| Adopt | maintained boundary, 풀 수 없는 conflict나 허가가 필요한 처리를 사용자에게 직접 묻기 직전 | source 회계, decision route와 canonical landing |
| Direct | 준비된 변경에 실제 구속력 있는 사용자 선택이 남아 직접 묻기 직전 | persistence, closure, Work 계약과 owner route |

각 entry의 기존 질문 문장 가까이에 다음 의미의 조건부 pointer를 한 번만 둔다.

```markdown
이 규칙에 따라 사용자의 설명이나 구속력 있는 선택을 실제로 묻기 직전에만
`references/question-dialogue.md`를 열고 질문 표현에 적용한다.
```

같은 pointer가 여러 entry에 보이는 것은 질문 규칙의 복제가 아니다. 각 target의 always-read entry가
조건부 module을 언제 열지 스스로 판정할 수 있게 하는 연결이다. 상세 의미는 module 한 곳만 소유한다.

Resume, Work와 Verify는 이번 작업에서 import하지 않는다. 현재 source에서 이 target들은 사람의 의도나
대안을 탐색해 자신의 결정을 만드는 owner가 아니다. 이후 실제 fresh-use에서 같은 종류의 질문을 직접
해야 하는 행동이 관찰되면 그때 소비자를 추가한다. 단순 blocker 보고, 검증 결과 보고와 상태 복구에
미래 가능성만으로 import를 늘리지 않는다.

다만 `source/skill-package.json` 자체는 모든 target receipt에 declared source로 들어간다. 새 module을
등록한 뒤에는 Resume, Work와 Verify도 의미상 소비자는 아니지만 기존 receipt의 source currentness가
오래된 상태가 된다. target import를 늘리는 문제와 생성물을 현재 source에 맞추는 문제를 구분한다.
구현 중에는 Product부터 한 target씩 행동을 검증하고, 최종 전달에서는 아홉 target을 모두 현재
manifest로 다시 build·check한다.

### 6.5 현재 문장과 혼동하기 쉬운 세 경계

- Sketch의 `고정된 선택지 수를 요구하지 않는다`는 경쟁 가설이나 사용자 선택지의 수를 정하지
  않는다는 뜻이다. `최대 세 질문`은 한 메시지의 대화 부담 상한이며, 세 후보나 세 질문을 만들라는
  뜻이 아니다.
- Product의 `가장 상위 질문 하나를 먼저 묻는다`는 인과 순서가 분명할 때 적용된다. 이 규칙은
  question-dialogue의 최대치보다 우선하므로 하위 질문을 함께 보내지 않는다.
- Direct의 지속 여부를 판단하는 기존 세 질문은 AI가 요청을 분류하는 내부 기준이다. 사용자에게
  보내는 세 질문 묶음이 아니며, question-dialogue를 이유로 문구나 개수를 바꾸지 않는다.

## 7. 변경할 파일과 변경하지 않을 파일

### 7.1 변경한다

1. `source/modules/question-dialogue.md`
   - 질문할 필요가 이미 생긴 뒤의 표현 계약을 새로 둔다.
2. `source/skill-package.json`
   - `question-dialogue` module을 등록한다.
3. `source/targets/sketch/entry.md`
   - Sketch 전용 탐구·검토 관점과 질문 직전 pointer를 추가한다.
4. `source/targets/product/entry.md`
   - Product 전용 탐구·검토 관점과 질문 직전 pointer를 추가한다.
5. `source/targets/architecture/entry.md`
   - Architecture 전용 탐구·검토 관점과 질문 직전 pointer를 추가한다.
6. `source/targets/design/entry.md`
   - Design 전용 탐구·검토 관점과 질문 직전 pointer를 추가한다.
7. `source/targets/adopt/entry.md`
   - 기존 질문 판단 가까이에 질문 직전 pointer만 추가한다. 철학 절은 추가하지 않는다.
8. `source/targets/direct/entry.md`
   - 기존 질문 판단 가까이에 질문 직전 pointer만 추가한다. 철학 절은 추가하지 않는다.
9. 위 여섯 target의 `target.json`
   - 실제 소비 target에만 `question-dialogue` import를 추가한다.
10. 이 evidence home의 사례와 관찰 파일
   - 실행한 사례, 실제 출력과 `proven|failed|unproven` 판정을 기록한다.

### 7.2 변경하지 않는다

- `plan/**`
- `source/modules/communication.md`
- `source/modules/project-gate.md`
- `source/modules/project-knowledge.md`
- Product·Architecture·Design 문서 계약 module
- decision과 Sketch landing 계약
- Resume, Work와 Verify source
- state 형식, route 이름과 canonical path
- generated `skills/**`의 직접 편집
- legacy 구현과 중개노트 repository

현재 내용을 구현하기 위해 위 목록 밖의 semantic owner를 바꿔야 한다면 먼저 이 README의 가정이
틀렸는지 검토하고 작업을 멈춘다. 문장을 넣기 편하다는 이유로 공통 module의 책임을 넓히지 않는다.

## 8. 질문 방식의 구체적인 기대 행동

### 8.1 좋은 질문의 형태

질문은 현재 설명과 결정 지점을 연결해야 한다. 아래는 고정 문구가 아니라 의미 예시다.

```text
현재는 이 제품이 공방 운영자의 예약 관리 부담을 줄이는 데 우선순위를 둔다고 이해했습니다.
다만 수강생이 여러 공방을 비교하는 것이 핵심 약속인지에 따라 제품의 경계가 달라집니다.

1. 첫 출시에서 가장 먼저 해결하려는 사람은 공방 운영자와 수강생 중 누구인가요? 그 사람이 지금
   겪는 가장 큰 불편을 실제 상황과 함께 설명해 주세요.
2. 그 문제가 해결됐다고 판단할 수 있는 변화는 무엇인가요?
```

사람은 두 질문에 한 문단으로 답하거나, 첫 문장의 이해가 틀렸다고 바로잡거나, 한 질문만 먼저 답할
수 있다. AI는 정해진 선택지에 맞추도록 답을 다시 요구하지 않는다.

### 8.2 묶지 말아야 하는 질문

다음 질문이 앞선 답에 의존한다면 최대 세 개라는 허용을 사용하지 않는다.

```text
먼저 물을 것:
  어떤 사용자의 어떤 문제가 제품의 우선 문제인가?

아직 묻지 않을 것:
  그 사용자에게 필요한 업무 규칙은 무엇인가?
  그 업무를 어떤 앱과 Domain으로 나눌 것인가?
```

첫 답에 따라 아래 두 질문 자체가 사라지거나 달라질 수 있기 때문이다. 기존 Product의 `가장 상위
질문 하나를 먼저 묻는다`는 규칙이 이 module의 `최대 세 개`보다 우선한다.

### 8.3 form을 사용할 수 있는 좁은 예

두 구현 경로의 결과와 비용이 이미 설명되었고 사용자가 승인할 경로만 고르면 되는 경우에는 선택형
form을 사용할 수 있다. 그러나 제품 목적, 브랜드 감각, 운영 제약처럼 답을 들은 뒤에야 후보를 제대로
만들 수 있는 질문은 form으로 보내지 않는다.

form 제공 여부는 host 기능의 존재로 결정하지 않는다. 질문의 의미가 열려 있는지 닫혀 있는지로
결정한다.

## 9. 구현과 전달 순서

작업자는 시작할 때 현재 Skill Rails의 `SKILL.md`와 `references/skillEvolutionMethod.md` §§0–0.1을
다시 읽고, 자연어 행동 계약이므로 필요한 §8.1–8.3도 읽는다. CLI help와 exact owner inspection은
현재 bytes를 기준으로 다시 실행한다.

### 9.1 1차 — Product에서 두 개선을 함께 관찰한다

Product는 철학 사용이 원래 의도적으로 설계되었고, 열린 사용자 질문도 가장 분명하게 발생하므로 첫
관찰 대상이다.

1. 변경 전 `product`, `communication`, manifest와 Product의 현재 imports를 exact ID로 inspect한다.
2. `question-dialogue` module과 package registration을 추가한다.
3. Product target에만 우선 import와 읽기 조건을 추가한다.
4. Product의 탐구·검토 관점을 추가하되 기존 질문 선별 문장을 지우지 않는다.
5. Product target만 build하고 receipt, generated diff와 source currentness를 검토한다.
6. 같은 source로 다시 build해 tree hash의 결정성을 확인한다.
7. §10의 Product 기준안·변경안 fresh-use를 깨끗한 문맥에서 실행한다.
8. 질문 수가 늘거나 철학 설명이 사용자 응답에 나타나면 다음 target으로 진행하지 않는다.

### 9.2 2차 — Sketch

1. 현재 Product 결과가 `proven`인지 확인한다. 실패나 미판정이면 Sketch로 진행하지 않는다.
2. Sketch import, pointer와 전용 관점을 추가한다.
3. Sketch target만 build·check·double-build한다.
4. 하나의 설명으로 충분한 통제 사례와 후보를 가를 필요가 있는 사례를 모두 관찰한다.
5. 복수 가설이나 실험이 의식처럼 생기지 않는지 확인한다.

### 9.3 3차 — Architecture

1. Architecture owner와 현재 문서 계약을 다시 읽는다.
2. Architecture import, pointer와 전용 관점을 추가한다.
3. target 하나만 build·check·double-build한다.
4. 작은 신규 프로젝트와 evidence가 불완전한 기존 구조 사례를 비교한다.
5. 시스템 사고가 불필요한 concern tree나 전체 재설계를 만들지 않는지 확인한다.

### 9.4 4차 — Design

1. Design applicability와 현재 문서 계약을 다시 읽는다.
2. Design import, pointer와 전용 관점을 추가한다.
3. target 하나만 build·check·double-build한다.
4. Design 비적용, 작은 Design과 실제 review surface가 있는 사례를 관찰한다.
5. 철학 때문에 비적용 프로젝트에 Design을 만들거나 prototype을 의무화하지 않는지 확인한다.

### 9.5 5차 — Adopt와 Direct의 질문 표현만 연결한다

네 foundation target에서 `question-dialogue`의 의미가 입증된 뒤에만 Adopt와 Direct를 연결한다.

1. 각 entry의 현재 질문 조건을 다시 읽고 module이 새 질문을 만들지 않는지 확인한다.
2. import와 질문 직전 pointer만 추가한다.
3. target별 build·check·double-build와 기존 대표 회귀를 수행한다.
4. Adopt가 source evidence 대신 사람에게 더 많이 묻거나 Direct가 이미 정해진 계약을 재승인받으면
   `failed`다.

### 9.6 최종 전달

모든 변경 target이 개별적으로 통과한 뒤 아홉 target을 현재 source로 다시 build한다. Resume, Work와
Verify는 `question-dialogue`를 import하지 않지만, 모든 receipt가 `skill-package.json`을 source로
기록하므로 manifest 변경 뒤 currentness를 회복하려면 재빌드가 필요하다. 생성물, receipt, integrity와
source currentness를 확인한다. 의미상 변경이 없는 세 target의 generated `SKILL.md`와 references에
질문 module이 유입되지 않았는지도 diff로 확인한다. 정적 검사는 delivery만 증명하며 fresh-use 결과와
별도로 기록한다.

현재 CLI의 최소 명령 형태는 다음과 같다. 실제 경로와 help는 작업 시점에 다시 확인한다.

```text
node <skill-rails-cli>/cli.mjs inspect --source source/skill-package.json --id <exact-id> --json
node <skill-rails-cli>/cli.mjs build --source source/skill-package.json --target <target-id> --out skills/<target-id>
node <skill-rails-cli>/cli.mjs check --source source/skill-package.json --target <target-id> --out skills/<target-id>
```

## 10. fresh-use 검증 설계

### 10.1 공통 비교 방법

같은 입력과 성공 기준으로 현재 기준안과 변경안을 비교한다. 철학 용어를 얼마나 많이 출력했는지는
점수가 아니다. 다음 행동이 달라졌는지를 본다.

```text
의미:
  각 관점의 용도와 비적용 경계를 읽는 AI가 같은 행동으로 설명하는가?

전달:
  entry가 필요한 순간에만 question-dialogue를 열고, 생성물에 정확히 포함하는가?

행동:
  더 좋은 갈림길과 증거를 찾되 질문·가설·artifact 수를 불필요하게 늘리지 않는가?

효과:
  사용자가 선택지에 갇히지 않고 자신의 의도와 판단 근거를 더 정확히 전달할 수 있는가?
```

관찰 보고에는 다음을 구분한다.

- `proven`: 실제 실행이 해당 주장과 일치함
- `failed`: 실제 반례가 나타남
- `unproven`: 실행하지 않았거나 그 사례가 해당 위험을 공격하지 않음

### 10.2 Product 사례

기존 Product의 모호한 brief 사례를 같은 입력으로 사용한다.

- 기준안과 변경안 모두 현재 이해를 먼저 구성하는지 본다.
- 변경안이 듀이·해석학·엘렝코스를 사용자에게 강의하지 않는지 본다.
- 서로 독립적인 질문이 두 개 있으면 한 메시지에서 자연스럽게 물을 수 있는지 본다.
- 두 번째 질문이 첫 답에 의존하면 하나만 먼저 묻는지 본다.
- 선택형 form으로 사용자 역할이나 핵심 약속을 미리 제한하지 않는지 본다.
- 답을 얻은 뒤 질문을 계속하지 않고 Product를 게시하는지 본다.

### 10.3 Sketch 사례

서로 다른 원인이 같은 현상을 설명하는 한 사례와, 현재 evidence가 설명 하나만 지지하는 통제 사례를
사용한다.

- 첫 사례에서는 최소 후보와 후보를 가를 값싼 증거가 드러나는지 본다.
- 통제 사례에서는 복수 후보를 억지로 만들지 않는지 본다.
- 사용자 선택이 필요하지 않은데 질문하지 않는지 본다.
- 철학 때문에 별도 finding이나 Sketch artifact가 불필요하게 늘지 않는지 본다.

### 10.4 Architecture 사례

작은 신규 프로젝트 한 건과 code/runtime evidence가 있는 기존 프로젝트 한 건을 사용한다.

- 작은 프로젝트는 필요한 현재 구조만 만들고 future concern을 만들지 않아야 한다.
- 기존 프로젝트는 부분 증거를 가장 그럴듯한 현재 설명으로 구성하되 fact와 interpretation을 구분해야
  한다.
- 중요한 기술 주장은 verification channel 또는 명시적인 미검증으로 남아야 한다.
- 시스템 사고가 package 목록이나 모든 간접 효과의 catalog로 변하면 실패다.
- 사용자만 정할 수 있는 제약을 물을 때 열린 질문 계약을 사용해야 한다.

### 10.5 Design 사례

Design 비적용 backend/library, 작은 UI와 live design surface가 있는 큰 UI 사례를 사용한다.

- 비적용 사례에서는 Design 문서와 질문을 만들지 않아야 한다.
- 작은 UI에서는 경험 원칙과 review surface만 두고 design system taxonomy를 만들지 않아야 한다.
- 큰 UI에서는 실제 surface 관찰로 가역적 표현을 조정하되 Product와 Architecture 의미를 바꾸지 않아야
  한다.
- 브랜드·미감 질문은 선택형 style 목록이 아니라 사용자의 말로 답할 수 있어야 한다.

### 10.6 질문 계약의 경계 사례

다음 네 행동을 따로 공격한다.

| 사례 | 기대 행동 |
|---|---|
| 의도와 우선순위가 열려 있음 | 일반 대화문으로 묻고 form을 사용하지 않음 |
| 서로 독립적인 질문 두세 개 | 같은 배경 아래 한 메시지에 묶되 최대 세 개를 넘지 않음 |
| 두 번째 질문이 첫 답에 의존 | 첫 질문만 보내고 후속 질문을 미리 만들지 않음 |
| 결과가 이미 설명된 두 실행안 중 승인 | 실제로 닫힌 선택이면 form을 사용할 수 있음 |

질문의 정확한 문구를 answer key로 고정하지 않는다. 질문이 드러내야 할 판단, 사용자가 답할 자유와
묻지 말아야 할 내용을 판정한다.

## 11. 전체 체계 회귀 검토

각 fresh-use 뒤에는 결과 문장만 보지 말고 현재 source owner를 다시 읽으며 다음을 확인한다.

- 철학 절이 target의 진입 조건이나 lifecycle처럼 읽히지 않는가
- 철학 이름이 기존의 구체적인 판단 기준을 덮어쓰지 않는가
- Product 의미가 Architecture나 Design으로 이동하지 않았는가
- Architecture의 기술 제약이 Design 취향으로 이동하지 않았는가
- Sketch가 모든 불확실성의 필수 선행 단계가 되지 않았는가
- question-dialogue가 새 질문을 만들거나 사용자 승인 단계를 추가하지 않는가
- 질문의 답이 원래 canonical home에 게시되고 기존 route로 복귀하는가
- communication과 question-dialogue가 같은 표현 규칙을 서로 다르게 소유하지 않는가
- 조건부 module을 읽지 않아도 질문하지 않는 경로가 완전한가
- 기존 문서의 길이와 생성 artifact 수가 철학 이름 때문에 늘지 않는가

다음 인과도 명시적으로 확인한다.

```text
철학 이름을 추가함
  → 관련 배경의 중요도와 관계를 더 잘 이해함
  → 더 나은 질문·후보·검토를 선택함
  → 기존보다 적거나 같은 탐색 비용으로 더 정확한 foundation을 만듦
```

중간 화살표를 실제 행동에서 관찰하지 못했다면 철학 이름의 효과는 `unproven`이다. 문장이 그럴듯하거나
철학 설명이 정확하다는 사실만으로 개선이라고 보고하지 않는다.

질문 계약의 인과도 따로 본다.

```text
열린 질문을 일반 대화로 보냄
  → 사용자가 선택지 밖의 의도와 전제를 표현할 수 있음
  → AI가 더 적은 왕복으로 실제 갈림길을 이해함
  → canonical 문서가 추측보다 사용자 의미를 더 정확히 반영함
```

질문 수가 늘거나 사용자가 더 긴 답을 강요받는데 제품 판단이 나아지지 않으면 효과는 실패다.

## 12. 실패 시 축소·수정 기준

철학 이름은 보호 대상이 아니다. 아래 현상이 나타나면 해당 target에서 그 이름을 제거하거나 기능을
더 좁힌다.

- AI가 사용자에게 철학을 설명하거나 철학자 역할을 연기함
- 모든 run에서 가설, 반증, prototype 또는 전체 시스템 분석을 의무화함
- 기존 source와 evidence보다 철학의 일반 설명을 우선함
- 질문과 문서가 늘지만 판단의 질이나 재사용성이 나아지지 않음
- 서로 다른 깨끗한 AI가 같은 문장을 행동이 달라지는 방식으로 읽음
- 비적용 경계를 보완해도 세 번째 해석 시험에서 같은 혼동이 재발함

이 경우 철학을 더 길게 설명하는 것이 기본 대응이 아니다. 먼저 다음 중 원인을 찾는다.

1. 이름과 기능의 조합이 target에 맞지 않음
2. 적용 조건 또는 비적용 경계가 빠짐
3. 기존의 구체적인 행동 문장이 더 좋은 owner임
4. 철학 이름이 없어도 결과가 같아 읽기 비용만 늘어남

질문 module도 다음 현상이 나타나면 축소하거나 소비자를 줄인다.

- 질문하지 않는 경로에서도 module을 읽음
- `최대 세 개`를 세 질문 작성 의무로 해석함
- 일반 대화를 장문의 설문으로 바꿈
- 닫힌 운영 승인을 불필요하게 여러 차례의 산문 대화로 바꿈
- target이 evidence로 확인할 일을 사용자에게 묻기 시작함
- module을 읽기 위해 질문을 만들거나 질문을 새 artifact로 보존함

## 13. 작업 중 멈춰야 하는 조건

다음 중 하나가 발견되면 작업자가 임의로 고치지 말고 충돌과 최소 선택지를 보고한다.

- `plan/**`의 lifecycle, target boundary 또는 canonical ownership을 바꿔야 함
- 철학 관점을 적용하려면 기존 route나 document completion 조건을 바꿔야 함
- question-dialogue가 질문 필요성을 소유하지 않으면 구현할 수 없다고 판단됨
- Resume, Work 또는 Verify도 반드시 소비해야 한다는 실제 현재 source 충돌이 발견됨
- host form을 제어하기 위해 plugin adapter, hook, schema 또는 새 runtime mechanism이 필요함
- Product의 가장 상위 질문 우선 규칙과 세 질문 상한이 함께 성립하지 않는 실제 사례가 발견됨
- 한 target의 fresh-use 실패를 해결하려면 아직 검증하지 않은 다른 target도 동시에 바꿔야 함
- 기존 명확한 brief, 작은 Architecture, Design 비적용 또는 Adopt source 회계 행동이 회귀함
- generated output을 직접 고쳐야만 통과할 수 있음

## 14. 완료 조건

다음이 모두 충족될 때만 이 작업을 완료로 바꾼다.

- 네 foundation target에서 철학의 이름, 기능, 기대 행동과 비적용 경계가 짧게 연결됨
- 기존 target 고유 행동과 route가 유지됨
- `question-dialogue`가 한 canonical module로 존재하고 실제 소비 target만 import함
- 질문이 필요한 entry마다 module을 여는 판정 가능한 조건이 있음
- `communication.md`는 질문 전용 내용으로 불어나지 않음
- 변경 target별 단계적 build와 double-build가 끝나고, 최종 아홉 target의 receipt, integrity와
  currentness가 확인됨
- Product부터 순서대로 실행한 fresh-use에서 다음 target 진행 근거가 남음
- 열린 질문, 의존 질문과 닫힌 선택 경계가 실제 행동으로 관찰됨
- 질문이나 철학을 쓰지 않아야 할 통제 사례가 회귀하지 않음
- 결과가 `proven`, `failed`, `unproven`으로 분리되어 기록됨

아직 실행하지 않은 대형 monorepo, 장기 운용, 모든 host CLI와 모든 모델에서의 일관성은 완료 시점에도
`unproven`일 수 있다. 이번 작업의 완료는 모든 미래 상황의 보증이 아니라, 현재 변경이 의도한 의미로
전달되고 대표적인 실패 위험을 실제 행동에서 버텼다는 뜻이다.
