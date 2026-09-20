---
title: Architecture foundation and durable technical decisions delivery plan
status: planned
purpose: Give a fresh worker the exact source changes, delivery order, and evidence needed to evolve Architecture without turning Devflow into a fixed architecture framework.
read_when: Implementing or reviewing the Architecture document contract, shared current decisions, Architecture inquiry, or brownfield handling of project-specific registries and checkers.
authority: Execution handoff only. The accepted baseline remains plan/**, and current behavior remains source/** plus recorded evidence.
---

# Architecture foundation과 기술 결정 체계 개선 계획

## 1. 목적과 판단 기준

이 작업은 Architecture 문서에 더 많은 항목을 넣거나 중개노트의 구조를 범용화하는 일이 아니다.
작은 라이브러리부터 여러 앱·서비스·패키지·런타임을 가진 프로젝트까지, AI가 현재 기술 경계와
다음 변경의 위치를 이해할 수 있게 하는 것이 목적이다.

중개노트는 이상적인 완성형이 아니라 **실제로 작동하는 참고 사례**다. 그곳의 상세 문서, ADR,
registry와 checker는 가능한 요구와 실패를 보여 주지만 정답의 형태를 고정하지 않는다. Devflow는
중개노트를 Adopt했을 때 현재 능력을 잃지 않아야 하며, 동시에 전혀 다른 프로젝트가 자기 증거에 맞는
구조를 만들 수 있어야 한다.

Architecture가 사용할 근본 판단은 네 가지다.

1. **구조를 지배하는 조건:** Product 약속, 실행 환경, 운영 책임과 code/runtime evidence 중 무엇이
   기술 선택을 실제로 좌우하는가?
2. **결정 시점:** 지금 정하지 않으면 다음 작업자가 경계를 발명하는가, 아니면 구현하며 싸게 배울 수
   있는 가역적 선택인가?
3. **지식 경계:** 모든 기술 작업이 함께 알아야 하는가, 현재 질문만으로 선택 가능한 독립 concern인가?
4. **검증 방식:** 사람과 AI가 판단할 의미인가, 같은 입력에서 기계가 판정할 수 있는 불변식인가?

스킬 source에는 이 판단만 남긴다. 프로젝트 유형, framework, 폴더와 checker 사례를 계속 열거해 AI의
능동성을 대체하지 않는다. 사례는 이 판단을 공격하는 test evidence에만 둔다.

## 2. 보존할 전체 체계

- `source/**`가 유일한 Skill Rails 저작 원문이다. `skills/**` 생성물을 직접 고치지 않는다.
- Product와 Domain은 제품·업무 의미를, Architecture는 기술 구조를, Design은 경험 원칙을 소유한다.
- `.devflow/project/decisions/`는 프로젝트 전체가 공유하는 현재 결정 이유의 canonical home이다.
  개인 Sketch, member note와 Work state는 공용 결정의 home이 아니다.
- Git은 과거를 소유한다. 현재 정본은 point-in-time log나 완료된 작업 기록이 아니다.
- Architecture root와 선택한 child는 함께 읽는 bundle이다. 길이가 아니라 선택 가능성과 변경 이유로
  나누고 다시 합친다.
- Architecture는 registry, checker, generator 또는 schema를 직접 구현하지 않는다. 필요한 불변식과
  검증 경계를 정하고 구현은 Direct 이후의 별도 Work가 맡는다.
- 기존 brownfield code, configuration, test와 checker는 실행 역할이 있으면 live evidence로 유지할 수
  있다. 오래된 prose의 정본 권위 이전과 실행 자산 삭제를 혼동하지 않는다.
- build와 hash는 전달 증거다. AI 판단과 프로젝트 효과는 fresh-use observation으로 따로 본다.
- `plan/**`은 수정하지 않는다. 이 문서는 accepted plan을 source와 evidence로 실행하기 위한 handoff다.

주요 기준은 다음 문서가 소유한다.

- `plan/02-skill-and-document-architecture.md` §§7–9: subtree, decision route와 canonical home
- `plan/08-document-contracts.md` §§2–3: split/fold와 Architecture·Decision 본문 계약
- `plan/09-reference-boundaries-and-document-decomposition.md`: 참고 사례와 범용 설계의 경계
- `source/modules/project-knowledge.md`: 현재 문서와 조건부 child 게시 규칙
- `source/modules/project-gate.md`: foundation readiness와 adoption decision round trip
- `tests/foundation-target/README.md`: 현재 Architecture의 proven/unproven 경계

## 3. 현재 관찰과 결론

### 3.1 현재 Devflow source

현재 Architecture entry는 이미 Product 선행 조건, 구성요소, 의존 방향, runtime/data flow, public seam,
verification, Design 적용 여부와 작은 문서 기본값을 소유한다. 부족한 것은 항목이 아니라 판단 방법이다.

- 어떤 기술 설명을 먼저 만들고 무엇만 질문할지
- 지금 확정할 결정과 구현하며 배울 결정을 어떻게 나눌지
- 안정된 불변식과 교체 가능한 현재 선택을 어떻게 구분할지
- 상세 배치 규칙과 기계적 guardrail을 언제 도입할지
- adoption에서 받은 Architecture 결정을 게시한 뒤 어떻게 Adopt로 돌아갈지

Product에서 채택한 탐구 방식은 기술 맥락에서도 이어 간다. 먼저 현재 증거로 가장 그럴듯한 설명을
세우고, 함께 성립할 수 없는 해석이 있으면 결과의 차이로 검토한 뒤, 사용자만 정할 수 있는 제약만
질문한다. 철학 이름이나 고정 문답 순서를 source 규칙으로 추가하지 않고 이 행동으로 구현한다.

현재 fresh evidence는 작은 headless Architecture 한 건만 `proven`이다. 기술 질문, concern tree,
brownfield Architecture reconstruction과 adoption round trip은 `unproven`이다.

### 3.2 공용 ADR에 대한 결론

공용 결정 공간은 이미 `.devflow/project/decisions/<id>-<slug>.md`로 설계되어 있다. 다만 설치된
skill source에는 그 문서의 공통 계약이 없어 개인·팀 기록과의 차이가 충분히 드러나지 않는다.

새 append-only ADR subsystem은 만들지 않는다. 대신 공용 **Current Decision** 계약을 source module
하나로 투영한다.

| 전통적인 ADR log | Devflow Current Decision |
|---|---|
| 당시 결정과 status chain을 축적 | 한 결정 질문의 현재 결론과 유효한 이유를 유지 |
| 결론 변경 시 새 ADR로 supersede | 같은 identity의 파일을 현재형으로 교체 |
| 과거를 여러 문서가 보존 | Git이 과거를 보존 |
| 현재 규칙이 ADR에 남기 쉬움 | 현재 규칙은 Product·Architecture·Design·Domain에만 존재 |

미래 독자가 같은 중요한 판단을 반복하지 않도록 이유가 필요할 때만 Decision을 만든다. 날짜, 작성자,
accepted/superseded status는 필수 필드가 아니다. 규제·법적 감사처럼 append-only 이력이 실제 외부
계약이면 그 프로젝트의 별도 운영 concern이 소유하며 범용 Decision을 audit log로 바꾸지 않는다.

### 3.3 중개노트의 registry와 checker에 대한 결론

검토 기준점은 중개노트 commit `c19daf0`이다.

- `tooling/architecture/**`: 15개 파일, 약 8,500줄
- `docs/domains/registry.json`: 800줄 이상, 22개 Domain, 14개 cross-stack use case,
  39개 entrypoint, 6개 verification command
- registry/reference, package graph, client/server leak, layout, naming, cross-domain edge,
  DB lifecycle와 generated drift를 검사하는 약 50개 rule
- CI의 `pnpm architecture:check`

이 장치는 현재 중개노트에서 실제로 작동한다. 선언된 edge와 code drift를 잡고, 반복되는 배치 규칙을
CI에서 거부한다. 포팅 과정에서 이를 없애면 후퇴한다.

그러나 대부분의 rule과 registry field는 중개노트의 경로·런타임·Domain 모델에 묶여 있다. Devflow의
공통 registry나 universal checker로 만들면 다른 프로젝트에 비용과 잘못된 taxonomy를 강제한다.

따라서 다음 경계를 채택한다.

- 중개노트 포팅에서는 active registry·checker·test·CI를 **프로젝트별 live executable evidence**로
  유지한다.
- 의미 규칙은 `.devflow` Architecture에, 중요한 선택 이유는 Current Decision에 둔다.
- registry 항목과 checker rule 목록을 `.devflow` 산문에 복제하지 않는다.
- generated map은 파생 탐색면이지 canon이 아니다.
- 새 프로젝트에는 현재 필요가 입증되기 전까지 registry와 checker를 만들지 않는다.

registry나 checker를 인정하는 기준은 이름이나 프로젝트 규모가 아니다.

```text
registry:
  반복되는 결정 가능한 entity·edge가 있고,
  실제 consumer가 그 입력을 사용해 수작업 목록을 줄이며,
  code와의 drift를 검출할 수 있을 때

checker:
  규칙이 deterministic하고,
  위반을 구체적인 path와 이유로 보고할 수 있으며,
  기존 compiler·linter·test가 같은 실패를 더 싸게 잡지 않고,
  실제 작업이나 CI에서 실패가 행동을 바꿀 때
```

조건을 만족하지 않으면 Architecture 산문과 기존 code/config/test가 더 단순한 답이다.

## 4. source 변경 설계

### 4.1 `architecture-document` module

`source/modules/architecture-document.md`를 다음 원문으로 추가한다.

```markdown
# Architecture 문서 계약

이 계약은 Architecture와 Adopt가 `.devflow/project/architecture.md` 또는 concern child를 만들거나
교체할 때, 그리고 Work가 확인된 기술 지식을 그 경로에 반영할 때 적용한다. 고정 목차나 기술 taxonomy가
아니라, 처음 읽는 사람이나 AI가 현재 기술 경계와 다음 변경의 위치를 발명하지 않게 하는 내용 계약이다.

## root는 하나의 현재 모델을 제공한다

Architecture root는 Product와 Domain을 반복하지 않고 그것이 어떤 실행 가능한 체계로 이루어지는지
설명한다. 다음 네 질문은 고정 heading이 아니라, 처음 읽는 독자가 하나의 구조로 이어서 이해해야 하는
내용 순서다.

1. **왜 이런 모양인가:** Product 약속, 실행·배포 환경, 운영 책임, 외부 제약과 현재 code/runtime
   evidence 중 구조를 실제로 좌우하는 것은 무엇인가?
2. **무엇이 어디서 책임지는가:** 주요 실행 단위와 구성요소, 책임·소유권, 배포 관계는 무엇인가?
3. **어떻게 연결되고 움직이는가:** 의존 방향, data ownership, public seam과 중요한 runtime/data flow는
   무엇인가?
4. **어떻게 믿고 바꾸는가:** failure·운영 경계, verification channel, Design 적용 여부, 안정된 불변식,
   교체 가능한 현재 선택과 열린 질문은 무엇인가?

작은 프로젝트는 네 답을 짧게 이어 쓸 수 있고, 복잡한 프로젝트는 root가 공통 답과 직접 child route만
가진다. 선택한 기술이 구조를 바꾼다면 현재 선택과 짧은 이유를 함께 쓴다. 열린 질문에는 현재 취급과
다시 여는 조건을 둔다. 모든 dependency를 inventory하거나 근거 없는 scale, provider, 보안, 운영과
가능한 미래를 채우지 않는다.

## 현재 필요한 깊이만 사용한다

작은 프로젝트는 `project/architecture.md` 하나가 기본이다. 모든 기술 작업이 함께 알아야 하는 경계,
불변식, 큰 구성요소 관계, 주요 flow, verification과 직접 child route는 root에 남긴다.

`project-knowledge`의 공통 split/fold 판정을 먼저 적용한다. 특정 기술 질문을 다른 작업이 안전하게
건너뛸 수 있고 독립된 계약과 변경 이유가 있을 때만 `project/architecture/<concern>.md`로 분리한다.
frontend, backend, data, security와 operations는 가능한 이름일 뿐 기본 taxonomy가 아니다.

한 Domain에만 적용되는 기술 concern은 그 Domain parent에서 선택할 수 있을 때
`project/domains/<domain>/<concern>.md`에 둘 수 있다. 위치가 Domain subtree여도 업무 의미가 아니라
기술 계약이며 decision route는 Architecture다. 같은 규칙을 Architecture subtree에 다시 요약하지 않는다.

한 concern이 다시 독립된 질문을 가지면 같은 판정을 적용할 수 있다. 해당 concern 문서가 공통 배경과
직접 route를 소유하고 하위 문서가 세부 질문을 소유한다. root는 모든 leaf를 catalog하지 않는다.
대부분의 작업이 sibling을 함께 열거나 parent를 읽기 전에는 child를 고를 수 없다면 다시 합친다.

정확한 file·folder·package 배치는 현재 소유권, 의존, runtime 또는 verification을 실제로 바꿀 때만
규칙으로 둔다. 아직 존재하지 않는 layer, adapter, package와 빈 tree를 미래 가능성만으로 만들지 않는다.

## 의미, 이유와 실행 증거를 분리한다

현재 기술 규칙은 Architecture가 소유한다. 중요한 선택을 지킬 이유, 기각 대안과 재검토 조건이
필요하면 공통 Decision 계약을 사용한다. Product·Domain 업무 규칙, Design 원칙과 Work 진행 상태를
복제하지 않는다.

code, configuration, test, registry와 checker는 구현 또는 실행 증거가 될 수 있지만 두 번째 산문
canon은 아니다. registry는 반복되는 결정 가능한 entity·edge를 실제 consumer가 사용하고 drift를
검출할 때만 유지한다. checker는 deterministic 위반을 구체적인 path와 이유로 거부하고 실제 흐름에서
실행될 때만 verification channel이다.

Architecture skill은 registry, checker, generator 또는 schema를 구현하지 않는다. 필요성이 확인되면
지킬 불변식, 관찰 가능한 위반과 현재 미검증 범위를 Architecture에 두고 구현은 `direct`로 보낸다.
기존 brownfield 장치는 active consumer가 있으면 live evidence로 유지하되 그 내용을 `.devflow`
산문에 복제하지 않는다. generated output은 파생 탐색면이지 canon이 아니다.

## 다음 단계가 기술 경계를 만들 필요가 없을 때 완전하다

다음 단계가 주요 구성요소, 의존 방향, data ownership, public seam, 배포 또는 verification 방식을
새로 발명하지 않고 시작할 수 있어야 한다. 가역적인 local 구현 선택과 현재 구조를 바꾸지 않는 미래
질문은 열려 있을 수 있다.

각 현재 기술 결정은 사용자 제약, Product·Domain 계약, code/runtime evidence 또는 current Decision 중
하나로 뒷받침되어야 한다. verification channel은 실행 가능하거나 사용할 수 없는 이유와 다시 확인할
조건이 있어야 한다. 빈 절, 가상의 component, 사용되지 않는 child, registry, checker와 decision을
문서의 완성도를 위해 만들지 않는다.
```

### 4.2 `decision-document` module

`source/modules/decision-document.md`를 다음 원문으로 추가한다.

```markdown
# 현재 Decision 문서 계약

이 계약은 Product, Architecture, Design 또는 Adopt가, 그리고 Work가 확인된 decision landing을 통해
`.devflow/project/decisions/<id>-<slug>.md`를 만들거나 교체할 때 적용한다. Decision은 프로젝트
전체가 공유하는 현재 결정 이유다. 개인 Sketch, member note, Work state, verification record 또는
시간순 회의 기록이 아니다.

## 미래 판단을 실제로 보호할 때만 만든다

현재 규칙만 알면 다음 작업자가 올바르게 행동할 수 있다면 Decision을 만들지 않는다. 실제 대안 중
하나를 선택한 이유를 잃으면 중요한 논의를 반복하거나, 기각한 대안이 다시 안전성을 해치거나, 현재
선택을 다시 결정할 구체적인 조건이 있을 때만 만든다. 작업이 있었다는 사실, library 선택 하나,
구현 과정 또는 완료 이력을 남기려고 만들지 않는다.

본문은 결정 질문, 현재 결론, 결론을 지배하는 맥락과 제약, 실제로 고려한 중요한 대안과 기각 이유,
현재 영향과 감수한 대가, 재검토 조건, 규칙이 반영된 canonical path를 스스로 설명해야 한다.
Decision은 현재 규칙의 사본이 아니다.

## 한 질문의 현재 답으로 유지한다

Decision ID는 한 질문의 identity다. 같은 질문의 결론이 바뀌면 같은 파일을 현재형으로 교체하고,
독립된 새 질문에만 새 ID를 사용한다. 날짜, 작성자, accepted·superseded status와 과거 결론 목록은
필수 metadata가 아니며 Git이 변경 시점과 이전 내용을 보존한다.

이유가 더 이상 현재 판단을 보호하지 않으면 문서를 삭제하고 route를 갱신한다. redirect와 tombstone을
쌓지 않는다. 규제·감사처럼 append-only 이력이 구속력 있는 프로젝트는 별도 운영 기록이 소유하며,
공통 Decision을 감사 log로 바꾸지 않는다.

Sketch finding, member note와 Work observation은 소유 decision route가 canonical rule과 이 문서를
게시하기 전까지 공용 결정이 아니다. 근거가 부족하거나 owner 결정이 남아 있으면 결정된 것처럼
다듬지 않는다.
```

### 4.3 package와 target imports

`source/skill-package.json`에 다음 module을 등록한다.

```json
"architecture-document": "modules/architecture-document.md",
"decision-document": "modules/decision-document.md"
```

target별 import와 읽기 조건은 다음과 같다.

| target | import | 읽는 조건 |
|---|---|---|
| Architecture | 두 module | Architecture 계약은 항상, Decision 계약은 decision을 쓸 때 |
| Adopt | 두 module | Architecture 또는 decision을 구성·교체할 때 |
| Product | `decision-document` | decision을 쓸 때 |
| Design | `decision-document` | decision을 쓸 때 |
| Work | 두 module | 확인된 pending landing이 Architecture·Domain technical child 또는 Decision을 가리킬 때 해당 계약만 |

Direct, Sketch, Resume와 Verify는 이번 변경에서 module을 import하지 않는다. 질문을 route하거나 문서를
읽는 것과 canonical Decision을 쓰는 것은 다른 책임이다.

### 4.4 Architecture entry 교체 계약

`source/targets/architecture/entry.md`는 기존 trigger와 소유 경계를 유지하고 다음 구조로 교체한다.
구현자는 아래 의미를 보존하면서 자연스러운 문장으로 작성한다. 고정 질문 수나 단계 enum을 만들지
않는다.

```markdown
---
name: architecture
description: 완전한 Product foundation을 바탕으로 Devflow 프로젝트의 현재 기술 경계, 구성요소, 의존 방향, runtime 및 data flow, public seam, verification channel, Design 적용 여부를 정의하거나 수정한다. 열린 Architecture 결정을 다룰 때 사용한다. 제품 의미, UI 원칙, delivery 방향, 구현, brownfield 재구성에는 사용하지 않는다.
---

# 현재 기술 foundation 정의

Architecture는 완전한 Product와 업무 Domain을 이후 변경이 안전하게 작업할 수 있는 현재 기술 구조로
바꾼다. 미래의 완성 설계도를 예측하지 않고, 다음 단계가 주요 기술 경계를 새로 만들지 않아도 되는
가장 작은 일관된 foundation을 게시한다.

수행 전에 `references/communication.md`를 열어 대화와 문서에 적용한다.

## 유효한 조건으로 진입한다

먼저 `references/project-gate.md`의 `architecture` 조건을 적용한다. 이어서
`references/project-knowledge.md`, `references/architecture-document.md`와 읽을 수 있는
`.devflow/index.md`를 연다. Sketch가 Architecture로 route했다면 쓰기 전에
`references/sketch-handoff.md`를 열고 게시와 함께 landing 계약을 완료한다.

완전한 Product를 읽고, 현재 기술 질문이 route한 Domain과 Architecture 계보만 연다. Product 의미가
불완전하거나 모순되면 `product`, 흡수되지 않은 brownfield 의미는 `adopt`로 보낸다. 현재 대화에서
확인할 수 있는 code, configuration, runtime과 공식 기술 근거는 evidence로 쓸 수 있다. 조사나
prototype의 질문과 맥락을 현재 관리권 구간을 넘어 보존해야 하면 불완전한 canon을 남기지 말고
`sketch`로 보낸다.

## 현재 기술 설명을 먼저 만든다

사용자에게 기술 목록을 묻기 전에 Product·Domain 계약, 명시한 제약, current decision과 관련
code/runtime evidence로 하나의 현재 기술 설명을 만든다. 무엇이 실행·배포되어야 하는지, 어떤 힘이
구조를 바꾸는지, 이미 정해진 경계와 근거 없는 선택이 무엇인지 드러낸다.

문서 항목, framework 이름과 pattern 목록을 차례대로 질문하지 않는다. 현재 설명과 공통 Architecture
계약 사이에서, 답에 따라 실제 기술 경계가 달라지는 지점만 질문 후보로 둔다.

## 지금 결정할 질문만 가른다

비어 있는 선택 때문에 다음 단계가 주요 경계를 새로 발명해야 한다면 지금 다룬다. 구현하면서 값싸게
배울 수 있는 가역적인 local 선택은 미리 정하지 않는다. 조사나 prototype 없이는 판단할 수 없고 그
맥락을 현재 관리권 구간 밖에서도 보존해야 하면 `sketch`로 보낸다.

여러 후보가 실제로 성립하면 현재 제약을 만족하는 가장 작은 후보를 결과, 가역성, 운영 책임과 검증
비용으로 비교하고 Architecture가 추천한다. 비용·운영 주체·지원 환경·외부 계약처럼 사용자만 정할 수
있는 제약이 남을 때만 묻는다. 질문에는 현재 이해, 추천과 답에 따라 달라지는 구조를 설명한다.

## 현재 Architecture를 게시한다

`references/architecture-document.md`의 완성 조건과 split/fold 판정을 적용해
`project/architecture.md`와 필요한 child를 구성하고 기존 파일을 교체한다. 장치가 필요하다는 판정이
나오더라도 Architecture에서 구현하지 않는다. 지킬 불변식, 관찰 가능한 위반과 미검증 범위를 게시한 뒤
`direct`로 보낸다.

중요한 이유·기각 대안·재검토 조건이 필요하면 `references/decision-document.md`를 열고 Current
Decision 하나를 만들거나 교체한다. 작업 사실, stack 목록과 현재 규칙의 사본을 남기려고 만들지 않는다.

같은 변경에서 `.devflow/index.md`가 기술 질문을 Architecture root로 route하고 foundation readiness를
판단하게 한다. leaf와 기술 답을 index에 복사하지 않는다.

진행 중인 adoption에서 받은 판단이라면 canonical Architecture·Decision과 route를 먼저 게시한 뒤
공통 gate에 따라 adoption state를 `next_route: adopt`와 이어갈 행동 하나로 교체한다. 독립적인 새
foundation 흐름으로 계속 진행하지 않는다.

## 현재 결과를 다시 읽고 route한다

Architecture root와 현재 질문에 선택된 child 계보를 다시 읽는다. 이 child는 Architecture subtree나
한 Domain의 technical subtree에 있을 수 있다. index와 Product·Domain 경계도 함께 확인한다. 업무 의미가 이동하거나
기술 사실이 다른 home에 복제되지 않았는지, 불변식과 교체 가능한 선택이 섞이지 않았는지, verification
channel이 실행 가능하거나 명시적으로 미검증인지 확인한다.

Design이 필요하면 `design`, 미적용이면 `direct`, 해결되지 않은 제품 전제는 `product`, 보존할 조사가
필요하면 `sketch`, adoption 판단을 처리했으면 `adopt`, 활성 변경의 Architecture update가 끝났으면
`direct`로 route한다.

게시 경로, 현재 구조, 선택 근거, verification, Design 적용 여부, 다음 route와 행동, 미검증 항목과
재개 조건을 보고한다. Product·Domain 의미, Design 원칙, Work artifact, 구현, adoption inventory와
verification verdict를 쓰지 않는다.
```

### 4.5 Adopt와 다른 writer 변경

`source/targets/adopt/entry.md`에는 다음 세 의미만 추가한다.

1. Architecture 또는 Decision을 쓰기 전에 해당 module을 연다.
2. 기존 ADR은 현재 규칙, 현재 필요한 이유, 과거 기록으로 분해한다. 규칙은 원래 canonical home,
   이유는 필요할 때만 Current Decision, 끝난 migration과 superseded history는 현재 정본 밖에 둔다.
3. active registry·checker·test·CI는 live evidence로 유지할 수 있지만 전체 항목을 `.devflow`에 복제하지
   않고, generated output은 파생물로 disposition한다.

기술 source가 서로 충돌하면 기존 `conflicts.md`와 `next_route: architecture`를 사용한다. conflict는
아니지만 source만으로 foundation에 필요한 기술 결정을 닫을 수 없으면 확인한 사실과 필요한 판단을
분리해 Architecture로 보낸다. source가 말하지 않은 미래 선택을 unknown으로 양산하지 않는다.

Product와 Design의 기존 decision 문단은 다음 의미로 통일한다.

```markdown
중요한 기각 대안이나 재검토 조건이 현재 방향을 계속 지키는 데 필요하면
`references/decision-document.md`를 열고 Current Decision 하나를 만들거나 교체한다. 작업이 있었다는
사실이나 현재 규칙의 사본을 남기려고 만들지 않는다.
```

Work는 pending landing이 Architecture 또는 Domain technical child를 가리키면 Architecture 계약을,
Decision path를 가리키면 Decision 계약을 연다. 검증된 사실을 해당 문서의 기존 모델에 통합하고, 새
제품·기술·경험 결정을 내리거나 임시 구현 선택을 Decision으로 승격하지 않는다.

### 4.6 변경하지 않는 것

- `plan/**`
- `project-knowledge`, `project-gate`, `team-context`, `work-state`
- Sketch, Direct, Resume, Verify target
- 중개노트와 legacy repository
- Devflow 공통 registry, checker, generator, renderer, schema 또는 ADR status lifecycle

## 5. 행동 증거

테스트는 사례를 제품 규칙으로 만들기 위한 것이 아니다. 네 판단 기준이 서로 다른 조건에서도 같은
경계를 만드는지 공격한다. 문구·heading 일치가 아니라 실제 read, 질문, write와 route를 관찰한다.

| 사례 | 공격하는 주장 | 기대 행동 |
|---|---|---|
| A. 기존 headless Foundation B | 새 계약이 작은 프로젝트를 과설계하지 않는다 | root 하나, child·Decision·registry·checker 없음, 기존 unknown 보존, `direct` |
| B. 기술 제약이 덜 정해진 새 프로젝트 | Architecture가 stack 설문 대신 구조를 바꾸는 힘을 찾는다 | 현재 설명과 추천을 먼저 제시하고 사용자만 정할 수 있는 상위 제약 하나를 묻고, 답 전 canon을 쓰지 않음 |
| C. 중요한 대안이 있는 결정 | Current Decision이 현재 규칙과 과거 log 사이의 역할을 지킨다 | rule은 Architecture, 이유·대안·재검토 조건은 decision 하나, 날짜/status chain 없음 |
| D. 독립 concern이 있는 큰 fixture | concern tree가 고정 taxonomy 없이 선택적으로 깊어진다 | root는 직접 child만 route하고 선택한 계보만 읽으며 공통 배경을 leaf에 복제하지 않음 |
| E. live registry/checker가 있는 Adopt fixture | 작동하는 guardrail을 잃지 않으면서 Devflow 공통 기계로 만들지 않는다 | live evidence 보존, semantic rule/이유 분리, generated map 비정본, Adopt 복귀 |
| F. checker가 필요 없는 작은 monorepo | monorepo와 규모가 mechanism 입장권이 아니다 | 기존 typecheck/test를 사용하고 새 registry/checker를 만들지 않음 |
| G. 중복·과거 기록·현재 규칙이 섞인 brownfield | Adopt가 원문을 모으는 대신 현재 Architecture를 재구성한다 | 유지 source 전부 회계, 현재 네 질문으로 재서술, 과거·중복 제거, 풀 수 없는 충돌만 decision route |
| H. Architecture를 소비하고 갱신하는 후속 변경 | 문서가 작성 시점뿐 아니라 실제 개발과 갱신에서도 기준이 된다 | fresh agent가 root와 필요한 child만 읽어 owner·seam·검증을 정하고, Work가 확인된 기술 사실을 같은 계약으로 한 canonical home에 반영 |

사례 B의 입력에는 Product상 동일하게 가능한 두 배포 책임이 있고, 답에 따라 component와 data authority가
달라지는 조건을 둔다. 사례 D는 root → concern → subconcern이 실제로 독립된 질문인 fixture를 사용한다.
사례 E는 active consumer, checker test, CI와 generated output을 함께 둬 단순 JSON 파일 존재만으로
registry를 보존하는 결과를 막는다. 사례 G에는 code와 맞는 고유 지식, 중복 설명, 이미 끝난 migration,
code와 충돌하는 주장을 함께 둔다. 사례 H는 문서를 요약해 보라고 하지 않고 실제 변경 위치, 허용 의존,
public seam과 실행할 검증을 선택하게 한 뒤, 검증으로 새로 확인된 사실 하나를 다시 landing하게 한다.

새 source가 A–H를 통과한 뒤 현재 중개노트를 읽기 전용으로 대조한다. 실제 포팅은 하지 않는다.

| 현재 자산 | 예상 home 또는 disposition |
|---|---|
| Architecture의 현재 의미 규칙 | Architecture root와 증명된 concern |
| 현재 ADR의 적용 규칙 | Product·Architecture·Design·Domain owner |
| 현재도 필요한 ADR rationale | Current Decision |
| 끝난 migration·superseded history | Git 또는 명시적인 noncanonical disposition |
| registry와 architecture tooling | retained live executable evidence |
| generated maps | derived surface, canon 아님 |

이 대응으로 새 체계가 중개노트의 파일 위치·의존·runtime·verification 판단 능력을 잃지 않는지 확인한다.
중개노트의 현재 분할과 모든 checker rule이 이상적이라고 승인하는 검사는 아니다.

## 6. 구현 순서

Skill Rails 원칙에 따라 target 하나를 delivery와 fresh-use evidence까지 닫은 뒤 다음 target으로 간다.
이는 Product부터 시작하는 최초 foundation delivery를 다시 수행하는 일이 아니다. 현재 target들이 이미
전달된 상태에서 Architecture를 주 변경 대상으로 개선하고, 그 과정에서 생긴 공통 Decision 계약을
기존 writer와 consumer에 하나씩 연결하는 유지보수 순서다.

### 1차: Architecture

1. package, Architecture target과 현재 owner를 exact inspect한다.
2. 두 module, package registration, Architecture imports와 entry를 한 변경으로 작성한다.
3. Architecture target만 double-build하고 generated diff, receipt, integrity와 source currentness를 본다.
4. standalone fresh session에서 A–D와 F를 실행한다.
5. 실패하면 source owner에서 고치고 Adopt로 진행하지 않는다.

### 2차: Product와 Design

두 target을 한꺼번에 수정하지 않는다. Product, Design 순으로 각각 Decision import와 conditional-open
문장만 추가하고, 해당 target을 build한 뒤 대표 기존 행동을 최소 한 건 회귀 확인한다. 두 target 모두
이유를 보존할 필요가 생긴 경우에만 Decision을 열어야 한다.

### 3차: Adopt

1. Product·Architecture·Design의 현재 작성 계약과 module 소비 관계를 다시 inspect한다.
2. 계획한 import와 세 의미만 추가한다.
3. Adopt target만 double-build/check한다.
4. 기존 Adopt A/B/C를 회귀 확인하고 새 E와 G를 실행한다.
5. Architecture 게시와 `next_route: adopt` 복귀를 실제 state bytes로 확인한다.

### 4차: Work

두 module의 conditional-open 문장만 추가한다. Work는 확인된 Architecture·Domain technical child 또는
Decision landing에 해당 계약을 적용하되, 새 결정을 내리거나 기존 결정의 의미를 바꾸지 않아야 한다.
Work target build와 사례 H의 landing 행동으로 이를 확인한다.

### 5차: consumer audit와 중개노트 대조

모든 writer가 새 module 의무에 도달할 수 있는지 확인한다. 공통 gate와 ownership을 다시 읽고,
중개노트 대응표를 current bytes에서 작성한다. 실제 중개노트 명령 실행과 destructive disposition은
후속 Adopt Work의 acceptance에 둔다.

## 7. 중단 조건

다음이 발견되면 임의로 범위를 넓히지 않고 source 좌표, 실패 장면과 선택지를 보고한다.

- `plan/**`의 canonical ownership, Decision currentness, lifecycle 또는 gate를 바꿔야 함
- Architecture 게시 뒤 Adopt 복귀가 공통 gate로 표현되지 않음
- 한 Decision 계약을 Product·Architecture·Design·Adopt가 공유할 수 없음
- Work가 pending landing을 위해 새 decision authority를 가져야 함
- Architecture landing을 쓰는 Work가 Architecture 문서 계약에 도달할 수 없음
- recursive concern이 accepted subtree 계약으로 표현되지 않음
- Devflow 자체에 registry, checker, generator, schema 또는 migration이 필요해 보임
- old prose disposition과 live code/config/test 삭제 권한을 분리할 수 없음
- 기존 Foundation, Product, Design 또는 Adopt 행동이 회귀함
- 테스트를 통과시키려 fixed taxonomy, 질문 수, child depth 또는 ADR status가 필요함

## 8. 자체 검증 결과

### 소유권

| 정보 | owner |
|---|---|
| 제품·업무 의미 | Product·Domain |
| 현재 기술 규칙 | Architecture root·concern 또는 한 Domain의 technical child |
| 현재 결정을 지킬 이유 | shared Current Decision |
| 과거 결정과 변경 시점 | Git |
| 미확정 탐구 | Sketch |
| Work 좌표와 evidence | Work state·verification |
| 실행 가능한 architecture model·enforcement | 프로젝트별 live registry/config/checker/test, 있을 때만 |
| 파생 탐색 map | generator output, canon 아님 |

중복 owner나 owner 없는 장기 지식이 없다.

### 범용성과 비회귀

- 작은 프로젝트는 Architecture root 하나로 끝날 수 있다.
- 큰 프로젝트는 프로젝트가 증명한 질문 축으로만 깊어진다.
- registry와 checker가 없어도 Architecture는 완전할 수 있다.
- 이미 작동하는 registry와 checker는 Adopt에서 실행 역할을 잃지 않는다.
- 중개노트의 형태는 복사하지 않지만 현재 판단 능력은 보존한다.
- 공용 Decision은 개인 기록과 분리되며 별도 ADR status machine을 만들지 않는다.

### 과잉 방지

- universal Architecture schema와 checker를 만들지 않는다.
- 모든 기술 선택을 Decision으로 기록하지 않는다.
- 프로젝트 규모, 문서 길이와 file 수로 child나 mechanism을 자동 생성하지 않는다.
- generated map, baseline과 registry를 Architecture 완성 조건으로 만들지 않는다.
- source에는 네 판단 기준을 두고 프로젝트 사례 열거는 test에만 둔다.

### 여전히 `unproven`인 것

- 다양한 프로젝트에서 AI가 항상 최선의 기술 후보를 찾는지
- 재귀 concern tree가 초대형 저장소에서도 과분할 없이 유지되는지
- Current Decision과 Git이 모든 규제·감사 요구를 만족하는지
- 중개노트 checker의 모든 현재 rule이 장기적으로 유지할 가치가 있는지
- 실제 중개노트 포팅이 old docs 없이 완전히 독립하는지

이 작업은 답을 미리 고정하지 않고 판정 가능한 경계와 route를 만드는 데서 멈춘다.

## 9. 완료 보고

구현자는 다음을 분리해 보고한다.

- 수정한 canonical source와 target별 생성 경로
- double-build tree hash, integrity와 source currentness
- fresh-use 사례의 실제 read, 질문, write, route와 `proven|failed|unproven`
- Decision을 만든 경우와 만들지 않은 경우의 이유
- registry/checker를 유지하거나 거부한 근거와 verification 범위
- 기존 행동 회귀 여부
- 중개노트 read-only 대응 결과
- 계획과 달라진 점, 충돌 owner와 필요한 사용자 결정

build 성공이나 checker 존재를 AI 행동과 프로젝트 효과의 증거로 표현하지 않는다. 실행하지 않은 실제
포팅, 대형 project scaling과 external-input independence를 통과했다고 보고하지 않는다.
