---
title: Optional Design foundation and live design-system delivery plan
status: planned
purpose: Give a fresh worker the smallest sufficient source changes and evidence needed to evolve optional Design without imposing one visual system or losing a mature project's working design assets.
read_when: Implementing or reviewing Design applicability, the Design document contract, cross-stage foundation routing, Design reconstruction during Adopt, or later Design knowledge landing.
authority: Execution handoff only. The accepted baseline remains plan/**, and implementation differences or evidence remain under tests/**.
---

# 선택적 Design foundation 개선 계획

## 1. 목적과 결론

이 작업은 모든 프로젝트에 디자인 시스템을 추가하거나, 중개노트의 `DESIGN-SYSTEM.md`를 범용 양식으로
바꾸는 일이 아니다. 사람이 직접 사용하는 UI 또는 상호작용 접점(surface)이 있고 그 경험을 이후 변경에서도
일관되게 지켜야 할 때만 Design을 만든다. 그런 접점이 없는 backend, library와 비대화형 도구는 Design
문서 없이 완전할 수 있다.

Design이 적용될 때의 목표는 처음 읽는 사람이나 AI가 다음 변경에서 경험 방향, 공통 표현, interaction과
검토 방법을 다시 발명하지 않게 하는 것이다. 작은 프로젝트는 `project/design.md` 하나로 끝나고, 실제로
독립된 질문이 생긴 프로젝트만 선택 가능한 child와 live design asset을 가진다.

Design이 사용할 근본 판단은 네 가지다.

1. **적용 여부:** 프로젝트에 지속해서 설계하고 검토할 사용자 UI 또는 상호작용 접점이 있는가?
2. **경험의 공통축:** 어떤 경험 원칙과 표현·interaction 언어가 여러 변경을 함께 지배하는가?
3. **지식의 위치:** 현재 규칙을 Design prose, 한 Domain의 design child, code·token·catalog 또는 외부 live
   source 중 어디에서 가장 정확하고 싸게 유지할 수 있는가?
4. **검토 가능성:** 결과를 어떤 실제 surface, 상태, 입력 방식과 환경에서 관찰해야 옳고 그름을 판단할 수
   있는가?

스킬 source에는 이 판단과 소유 경계만 둔다. component 종류, token 이름, 화면 유형과 design tool 사례는
계속 열거하지 않는다. 사례는 source 규칙이 아니라 행동 증거에서 판단 기준을 공격한다.

## 2. 전체 체계에서 Design의 자리

```text
Sketch ───────────────┐
Product ──────────────┤  어디서든 Design 단서를 발견할 수 있다
Architecture ─────────┤
Direct·Work·Verify ───┘
          │
          ├─ 제품·업무 의미 ───────────────▶ Product·Domain
          ├─ 지원 surface·기술 제약 ───────▶ Architecture
          ├─ 경험 원칙·표현·interaction ───▶ Design
          └─ 더 조사해야 판단 가능 ────────▶ Sketch

Architecture의 현재 적용 상태
          ├─ 미적용이고 새 반증 없음 ───────▶ Design 문서 없이 Direct
          ├─ 적용됨 ────────────────────────▶ Design
          └─ 열림·새 surface 출현 ──────────▶ Architecture 갱신 뒤 Design 여부 재판정
```

소유권은 다음과 같이 나눈다.

| 질문 | canonical owner |
|---|---|
| 사용자, 가치, 제품 약속과 업무 상태 | Product·Domain |
| 지원 surface, platform, rendering·data seam과 기술 제약 | Architecture |
| 경험 방향, 시각·콘텐츠 언어, interaction·접근성·상태 표현과 review 기준 | Design |
| 현재 결정을 계속 지킬 이유, 기각 대안과 재검토 조건 | 현재 decision |
| token 값, theme, component 구현, prototype과 executable catalog의 실제 동작 | 해당 code·asset |
| 구현 목표, 진행 상태와 verification verdict | Direct·Work·Verify artifact |

Design은 Product의 사용자 목표나 Domain 상태를 다시 정의하지 않는다. Architecture가 정한 지원 범위를
임의로 넓히지 않는다. 반대로 Architecture는 색, 밀도, component 사용법과 interaction 원칙을 결정하지
않고 Design 적용 여부와 기술적으로 가능한 surface만 밝힌다.

### 2.1 단서가 생긴 곳과 결정을 소유하는 곳을 구분한다

Architecture의 적용 판단은 Design의 선행 기술 사실이지 유일한 출발점이 아니다. 어느 stage에서든 단서를
발견하면 제품 의미는 Product, 지원 접점은 Architecture, 경험 원칙은 Design으로 보낸다. 중단을 견뎌야
할 때만 기존 coordination artifact를 사용한다. 새 사용자 접점은 과거의 미적용 판단을 다시 열 수 있지만,
이를 위해 별도 inbox나 lifecycle을 만들지는 않는다.

### 2.2 Design이 없는 경우

Architecture가 지속적으로 설계할 사용자 접점이 없다고 판단하면 Design target은 아무 project
문서도 만들거나 고치지 않는다. 일반 흐름은 `direct`로 보내고, 현재 Sketch나 Adopt가 판단을 넘긴
경우에는 그 artifact로 결과를 돌려보내 결론을 흡수하거나 다음 source 회계를 계속하게 한다. `design.md`
placeholder, 빈 token 표와 “해당 없음” 문서를 만들지 않는다. 존재하지 않는 Design은 readiness 결함이
아니다. 다만 현재 요청이나 새 증거가 사용자 접점을 추가한다면 기존 미적용 판단을 그대로 사용하지 않는다.

### 2.3 적용되지만 아직 작은 경우

한 화면, 작은 app 또는 간결한 interaction도 이후 구현자가 경험 방향을 다시 결정해야 한다면 root 하나를
만든다. 참고 site나 기존 system을 사용할 수 있지만 링크만 남기지 않는다. 무엇을 따르고 무엇은 따르지
않는지, 프로젝트 제약에서 어떻게 적용하며 어디서 검토하는지를 현재 문장으로 적는다.

### 2.4 필요한 만큼 깊어지는 경우

root는 전체 경험 모델과 직접 child·live surface route를 소유한다. exact token, component behavior와
rendered specimen이 code·catalog에서 더 정확하게 유지되면 그것을 산문에 복제하지 않는다. 산문은 그
자산을 언제 왜 사용하고, 어떤 원칙·예외·gap으로 판단하는지를 소유한다.

| 현재 규모 | 문서 형태 | 별도로 두는 것 |
|---|---|---|
| Design 없음 | 문서 없음 | 없음 |
| 작은 경험 foundation | `project/design.md` 하나 | 필요한 code·reference route만 |
| 독립된 경험 concern이 생김 | root와 선택 가능한 concern child | 해당 concern의 적용·판단·review 계약 |
| 성숙한 design system | 재귀적으로 선택 가능한 Design tree | token·component 구현과 catalog·prototype은 live asset |

component별 문서는 기본 구조가 아니다. 독립된 경험 질문·변경 이유·review 계약을 가진 component나
component family만 공통 split 기준에 따라 concern이 될 수 있고, 정확한 구현은 code·catalog에 남긴다.

## 3. 현재 관찰과 중개노트에서 배울 것

### 3.1 현재 Devflow source

현재 Design entry에는 적용 여부, 경험·visual foundation·component·interaction·accessibility·responsive·
state·review surface, 작은 parent 기본값과 split test가 이미 있다. Foundation evidence에서는 backend-only
skip과 한 UI parent 게시가 각각 관찰됐다.

부족한 것은 항목보다 다음 연결이다.

- 한 장짜리 Design을 서로 이어지는 현재 경험 모델로 쓰는 기준
- reference site, 외부 design system, token code와 live catalog의 권위 구분
- Design·Adopt·Work가 같은 문서 계약으로 작성하고 갱신하는 경로
- component catalog를 prose inventory로 만들지 않으면서 실제 사용 판단을 보존하는 기준
- brownfield의 방대한 Design 문서를 현재 owner별로 재구성하는 관찰
- 후속 구현자가 Design을 사용해 선택하고 실제 surface에서 검토할 수 있는지 보는 효과 증거

Product와 Architecture에서 채택한 탐구 방식은 Design에도 이어진다. 현재 증거로 가능한 경험 설명을
먼저 만들고, 함께 성립할 수 없는 방향을 사용자 결과·일관성·접근성·검토 비용으로 비교한다. 브랜드,
미감과 우선순위처럼 사용자가 소유한 선택이 남을 때만 추천과 달라지는 결과를 함께 물어본다. 철학 이름,
고정 질문 수와 설문 순서는 source에 추가하지 않는다.

### 3.2 중개노트의 현재 Design 체계

검토 기준점은 중개노트 commit `c19daf0`이다.

- `docs/DESIGN-SYSTEM.md`: 원칙, token 설명, component catalog, 예외, gap과 검증을 함께 가진 큰 문서
- `packages/ui/src/**`: token, theme, override와 공용 component의 실제 구현
- `apps/admin/app/routes/design-system/**`: light·dark와 상태를 볼 수 있는 live catalog
- `.agents/skills/design-system/`과 `add-ui-component/`: 사용과 확장을 분리한 프로젝트별 운영 진입점
- 화면·Domain code의 현재 적용 사례와 일부 상세 근거

이 체계는 현재 중개노트에서 실제로 작동한다. AI가 UI를 만들기 전에 공통 언어를 읽고, live catalog에서
실물을 확인하며, system에 없는 component는 별도 확장 절차로 보낸다. 포팅에서 이 판단과 실행 경로를
잃으면 후퇴한다.

그러나 한 문서에는 서로 다른 owner도 섞여 있다. 이를 파일 모양 그대로 복사하지 않는다.

| 현재 내용 | Devflow에서 예상되는 home 또는 disposition |
|---|---|
| golden rule과 전체 경험·미감 원칙 | Design root |
| 현재 visual foundation과 선택·사용 규칙 | root 또는 증명된 Design child |
| 모든 작업이 외울 필요 없는 component 선택·예외 | 선택 가능한 child 또는 live catalog route |
| 특정 Domain만의 시각·interaction 계약 | 그 Domain의 design child |
| theme 위치, provider, SSR, styling dependency와 file placement | Architecture |
| exact token 값, override와 component 구현 | code·configuration의 live evidence |
| `/design-system` specimen | live review surface |
| design-system 사용·확장 skill | 실행 역할이 있으면 retained operational asset |
| 중요한 선택 이유와 폐기 조건 | 현재 decision, 필요할 때만 |
| 끝난 실험·migration·과거 수치 | Git 또는 명시적 noncanonical disposition |

중개노트의 section과 component 수는 범용 구조의 근거가 아니다. 새 체계는 현재와 같은 판단 능력과 live
review 경로를 보존하되, 공통 원칙·기술 배치·실제 구현·운영 절차를 각 owner로 분리해야 한다.

### 3.3 외부 체계 교차검증

[GOV.UK](https://design-system.service.gov.uk/), [Material Design](https://m3.material.io/)과
[Storybook](https://storybook.js.org/docs/writing-tests/visual-testing)은 문서, 구현과 실제 review surface를
서로 다른 방식으로 연결한다. taxonomy는 서로 다르므로 특정 section을 범용 표준으로 가져오지 않고,
Design canon·정확한 code/asset·관찰 가능한 surface를 구분할 근거로만 사용한다.

## 4. source 변경 설계

### 4.1 `design-document` module

`source/modules/design-document.md`를 다음 원문으로 추가한다.

```markdown
# Design 문서 계약

이 계약은 Design과 Adopt가 `.devflow/project/design.md` 또는 design concern child를 만들거나 교체할 때,
그리고 Work가 확인된 Design 지식을 그 경로에 반영할 때 적용한다. 고정 목차나 design-system taxonomy가
아니라, 처음 읽는 사람이나 AI가 경험 방향과 검토 기준을 발명하지 않게 하는 내용 계약이다.

## root는 하나의 현재 경험 모델을 제공한다

Design root는 Product·Domain 의미와 Architecture 제약을 반복하지 않고, 지원 surface에서 그것들이 어떻게
경험되어야 하는지 설명한다. 다음 네 질문은 고정 heading이 아니라 독자가 하나의 경험으로 이어서
이해해야 하는 내용 순서다.

1. **어떤 경험을 지향하는가:** 적용되는 사용자와 surface에서 무엇을 느끼고 쉽게 판단·행동할 수 있어야
   하며, 어떤 경험 원칙이 선택을 가르는가?
2. **무엇이 일관성을 만드는가:** 현재 필요한 시각·콘텐츠·motion 언어, foundation·token 전략,
   component·composition 전략과 안정된 pattern은 무엇인가? 시각 요소가 없는 surface에는 억지로 만들지 않는다.
3. **상황에 따라 어떻게 행동하는가:** navigation, input, feedback, error recovery, 현재 Product·Domain이
   드러내는 state, accessibility와 Architecture가 지원하는 presentation range에서 무엇이 달라지고
   무엇이 유지되는가?
4. **어디서 확인하고 어떻게 바꾸는가:** 실제 review surface와 관찰할 내용, 안정된 원칙, 교체 가능한
   현재 선택, 알려진 gap·열린 질문과 직접 child·live source route는 무엇인가?

작은 프로젝트는 네 답을 짧게 이어 쓸 수 있다. 모든 token, component, 화면과 상태를 inventory하지
않는다. 다음 변경의 선택을 실제로 바꾸는 원칙·pattern·예외와 검토 경로만 남긴다. 열린 질문에는 현재
취급과 다시 여는 조건을 둔다.

## 현재 필요한 깊이만 사용한다

`project/design.md` 하나가 기본이다. 모든 Design 작업이 함께 알아야 하는 경험 방향, 공통 언어,
interaction·accessibility·state 원칙, review surface와 직접 child route는 root에 남긴다.

`project-knowledge`의 공통 split/fold 판정을 먼저 적용한다. 특정 surface 또는 interaction 계열을 다른
작업이 안전하게 건너뛸 수 있고 독립된 적용·검토 계약과 변경 이유가 있을 때만
`project/design/<concern>.md`로 분리한다. visual foundation, component, accessibility와 platform은 가능한
질문일 뿐 기본 taxonomy가 아니다.

한 Domain에만 적용되는 경험 concern은 그 Domain parent에서 선택할 수 있을 때
`project/domains/<domain>/<concern>.md`에 둘 수 있다. 위치가 Domain subtree여도 업무 규칙이 아니라
Design 계약이며 decision route는 Design이다. 같은 원칙을 Design subtree에 다시 요약하지 않는다.

한 concern이 다시 독립된 질문을 가지면 같은 판정을 적용할 수 있다. parent는 공통 배경과 직접 route를,
child는 세부 계약을 소유한다. 대부분의 작업이 sibling을 함께 열거나 parent를 읽기 전에는 child를 고를
수 없다면 다시 합친다. page, component, framework와 문서 길이만으로 나누지 않는다.

component 이름은 분리 근거가 아니다. 한 component 또는 component family가 여러 기능에서 공유되는
독립된 경험 질문이고, 다른 Design 작업이 그것을 읽지 않아도 되며, 자체 적용 조건·변형·접근성·review
계약이 있을 때만 concern child가 될 수 있다. exact prop, token 값, 구현 상태와 specimen은 code·catalog가
더 정확하면 그곳에 남긴다.

## 정본, live source와 reference의 역할을 구분한다

현재 경험 원칙과 프로젝트별 사용·예외 규칙은 Design이 소유한다. exact token 값, theme, component 구현,
prototype, rendered catalog와 regression asset은 더 정확한 code·asset이 있으면 그곳에 두고 산문에
복제하지 않는다. Design은 필요한 독자가 그 live source를 선택할 조건과 review route를 제공한다. 실제
작업자가 접근할 수 없거나 현재 흐름에서 사용되지 않는 source는 이름만으로 review 근거가 되지 않는다.

외부 site나 design system을 사용하면 영감을 주는 evidence인지 계속 의존하는 live contract인지 밝힌다.
프로젝트가 채택한 범위, 바꾼 부분과 현재 검토 방법은 외부 source를 다시 해석하지 않아도 알 수 있어야
한다. 이름이나 URL만으로 “같이 만든다”고 지시하지 않는다.

중요한 선택을 지킬 이유, 기각 대안과 재검토 조건이 필요하면 공통 Decision 계약을 사용한다. Product·
Domain 상태, Architecture 제약, Work 과정과 verification verdict를 Design에 복제하지 않는다.

## 다음 변경이 경험 기준을 발명할 필요가 없을 때 완전하다

다음 변경이 적용되는 경험 원칙, 공통 표현·interaction pattern, 접근성 기대와 review surface를 새로
발명하지 않고 시작할 수 있어야 한다. 한 화면의 가역적인 세부 배치나 구현하며 비교할 수 있는 표현은
열려 있을 수 있다.

각 현재 Design 판단은 사용자 선택, Product·Domain 계약, Architecture가 정한 surface, 관찰 가능한 live
evidence 또는 현재 decision 중 하나로 뒷받침되어야 한다. review surface는 실제로 열어 볼 수 있거나
사용할 수 없는 이유와 다시 확인할 조건이 있어야 한다. 빈 절, 가상의 token·component·state, 사용되지
않는 child와 catalog를 문서 완성도를 위해 만들지 않는다.
```

### 4.2 package와 target imports

`source/skill-package.json`에 다음 module을 등록한다.

```json
"design-document": "modules/design-document.md"
```

Architecture 개선 작업에서 추가되는 `decision-document`를 다시 정의하지 않는다. 구현을 시작할 때 current
source를 재검사하고 실제 ID와 계약을 사용한다. 그 module이 아직 전달되지 않았거나 의미가 달라졌다면
중복 module을 만들지 말고 Architecture 작업과의 차이를 보고한다.

| target | import | 읽는 조건 |
|---|---|---|
| Design | `design-document`, `decision-document` | Design 계약은 적용 시 항상, Decision 계약은 decision을 쓸 때 |
| Adopt | `design-document`와 기존 shared contract | Design을 구성·교체할 때 |
| Work | `design-document`와 현재 shared writer contract | pending landing이 Design 또는 Domain design child를 가리킬 때 Design 계약만 |

Architecture는 Design 적용 여부만 소유하므로 `design-document`를 import하지 않는다. Product, Direct,
Sketch, Resume와 Verify도 이번 변경에서 import하지 않는다. Design 문서를 읽거나 Design으로 route하는 것과
그 문서를 쓰는 것은 다른 책임이다.

### 4.3 Design entry 교체 계약

`source/targets/design/entry.md`는 기존 trigger와 소유 경계를 유지하고 다음 구조로 교체한다. 구현자는
아래 의미를 보존하면서 자연스러운 문장으로 작성한다. 고정 질문 수, component checklist와 stage enum을
만들지 않는다.

```markdown
---
name: design
description: Architecture가 사람이 직접 사용하는 UI 또는 상호작용에 Design이 적용된다고 판단한 경우 Devflow 프로젝트의 현재 경험 방향, 공통 표현·interaction 체계, 접근성, 상태 원칙과 review surface를 정의하거나 수정한다. 제품·업무 의미, 기술 surface와 구현, delivery 계획 또는 brownfield 재구성에는 사용하지 않는다.
---

# 현재 경험 foundation 정의

Design은 Product와 Architecture foundation을 이후 경험 변경이 구현하고 검토할 수 있는 가장 작은 현재
경험 모델로 바꾼다. 모든 component와 화면을 미리 설계하지 않고, 다음 변경이 공통 경험 기준을 새로
발명하지 않아도 되는 foundation을 게시한다.

수행 전에 `references/communication.md`를 열어 대화와 문서에 적용한다.

## 적용 가능한 상태로 진입한다

먼저 `references/project-gate.md`의 `design` 조건을 적용하고 읽을 수 있는 `.devflow/index.md`, 완전한
Product와 Architecture를 연다. 현재 member의 Sketch state가 `design`을 지정하면
`references/sketch-handoff.md`를 열고, 진행 중인 adoption이 Design 판단을 넘겼다면 필요한 source와
adoption state를 읽는다.

Architecture가 Design 미적용을 선언하면 다른 Design reference를 열거나 project 문서를 수정하지 않는다.
현재 증거도 그 판단과 일치하면 active coordination 계약에 따라 결과를 돌려보내거나 `direct`로 보낸다.
새 사용자 접점이 생겼거나 적용 여부·지원 범위가 열리거나 충돌하면 Design 취향으로 정하지 않고
Architecture 판단으로 보낸다. Product 약속이나 Domain 의미가 부족하면 Product 판단으로 보낸다. Sketch,
Adopt 또는 Work가 질문을 보존하고 있다면 새 전달 절차를 만들지 않고 그 artifact의 기존 복귀 계약을
따른다.

Design이 적용될 때만 `references/project-knowledge.md`, `references/design-document.md`와 현재 경험
질문이 route한 Domain·Design 계보를 연다. coordination artifact가 넘긴 결론은 해당 공통 계약에 따라
게시하고 복귀한다.

## 현재 경험 설명을 먼저 만든다

사용자에게 style 목록을 묻기 전에 Product의 사용자와 약속, Architecture의 지원 surface와 제약,
현재 선택, 관찰 가능한 UI·interaction, token·component code, live review surface와 명시된 reference로
하나의 현재 경험 설명을 만든다. 이미 정해진 원칙, evidence로 확인할 수 있는 pattern과 근거 없는 취향을
구분한다.

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
child를 구성하고 기존 파일을 교체한다. code, external design source와 live catalog가 필요하면 그 역할,
선택 조건과 review route를 Design에 두되 내용을 복제하지 않는다.

중요한 이유·기각 대안·재검토 조건이 현재 방향을 보호하는 데 필요하면
`references/decision-document.md`를 열고 현재 decision 하나를 만들거나 교체한다. 작업 사실,
component 목록과 현재 규칙의 사본을 남기려고 만들지 않는다.

같은 변경에서 `.devflow/index.md`가 UI·interaction 질문을 Design root로 route하고, Architecture의 적용
선언과 Design 문서에서 foundation readiness를 판단하게 한다. leaf, token과 pattern을 index에 복사하지
않는다.

진행 중인 adoption에서 받은 판단이라면 canonical Design·Decision과 route를 먼저 게시한 뒤 공통 gate에
따라 adoption state를 `next_route: adopt`와 이어갈 행동 하나로 교체한다. 독립적인 새 foundation
흐름으로 계속 진행하지 않는다.

## 현재 결과를 다시 읽고 route한다

Design root와 현재 질문에 선택된 Design 또는 Domain design child 계보를 다시 읽는다. index와 Product·
Architecture·Domain 경계, 사용한다고 밝힌 live review surface도 확인한다. 업무 상태나 기술 제약이
Design으로 이동하지 않았는지, Design 규칙이 code·catalog와 서로 다른 두 정본이 되지 않았는지 본다.

지정된 surface와 현재 알려진 상태에서 결과를 관찰할 수 있고 다음 변경이 공통 경험 기준을 새로 만들지
않아도 되면 `direct`로 route한다. 제품 경계는 `product`, 지원 surface·platform 질문은 `architecture`,
보존할 탐구는 `sketch`, adoption 판단을 처리했으면 `adopt`로 route한다.

게시 경로, 현재 경험 방향, 공통 pattern, review surface, 다음 route와 행동, 미검증 항목과 재개 조건을
보고한다. Product·Domain 의미, Architecture 제약, Work artifact, 구현, adoption inventory와 verification
verdict를 쓰지 않는다.
```

### 4.4 Adopt와 Work 변경

`source/targets/adopt/entry.md`에는 다음 의미만 추가한다.

1. Design을 쓰기 전에 `design-document`를 연다.
2. 기존 design material을 현재 경험 규칙, 기술 배치, 업무 의미, 결정 이유, live asset과 과거 기록으로
   나눠 각각 Design, Architecture, Product·Domain, Decision, retained evidence와 noncanonical disposition에
   둔다.
3. token·theme·component code, prototype, rendered catalog와 실제 운영되는 project-local skill은 실행
   역할이 있으면 유지한다. 전체 값과 catalog를 `.devflow` 산문에 복제하지 않는다.
4. Architecture가 Design 적용을 선언했지만 maintained source에 현재 경험 규칙이 없으면 placeholder를
   만들지 않는다. source로 결정할 수 없는 실제 Design 질문만 `next_route: design`으로 보낸다.

기존 Design source가 서로 충돌하면 `conflicts.md`와 `next_route: design`을 사용한다. 단순히 문서가 없거나
미래에 필요할 수 있다는 이유로 unknown을 만들지 않는다. Design이 답을 게시하면 공통 gate에 따라
`next_route: adopt`로 돌아가 나머지 source 회계와 disposition을 계속한다.

`source/targets/work/entry.md`는 pending landing이 Design 또는 Domain design child를 가리킬 때만
`design-document`를 연다. 검증된 사실을 기존 경험 모델에 통합하고 관련 header·route와 live evidence의
관계를 다시 읽는다. Work는 새 경험 방향을 결정하거나 구현 중 선택한 한 표현을 공통 pattern으로
승격하지 않는다. 판단이 필요하면 `design`으로 blocker를 보낸다.

### 4.5 변경하지 않는 것

- `plan/**`
- `project-knowledge`, `project-gate`, `team-context`, `work-state`
- Product, Architecture, Direct, Sketch, Resume와 Verify target의 canonical 소유권
- 중개노트와 legacy repository
- Devflow 공통 token schema, component registry, renderer, screenshot runner 또는 design-tool adapter

Architecture 구현이 진행 중이므로 구현자는 Design 작업을 시작할 때 package, Architecture·Adopt·Work의
current bytes와 import를 다시 inspect한다. 이미 반영된 공통 계약을 덮어쓰거나 과거 배열로 되돌리지 않는다.
Sketch, Product, Direct와 Verify에는 이미 질문을 owner로 보내는 route가 있다. 이번 작업은 같은 의미를
각 entry에 반복하지 않고 아래 교차-stage 행동 증거로 그 연결을 검증한다. 기존 계약으로 단서를 보존할 수
없다는 실패가 관찰되면 Design entry에 임시 우회 규칙을 넣지 않고 중단 조건에 따라 shared owner를 보고한다.

### 4.6 최소 연계 보완

현재 Architecture entry의 `완전한 Product foundation을 바탕으로`와 `Product와 Domain을 ... 기술 구조로
바꾼다`는 표현은 Product를 필수 의미 입력이 아니라 유일한 출발 단계로 오해하게 할 수 있다. Design 작업
전에 current bytes를 확인하고, 같은 의미가 없다면 다음 세 표현만 바로잡는다.

- `완전한 Product`를 `현재 기술 질문에 필요한 Product·Domain 의미`로 한정한다.
- Architecture는 Product 다음의 일회성 단계가 아니라, 발견 위치와 무관하게 열린 기술 판단을 소유한다고
  한 문장으로 밝힌다.
- Product 의미가 부족하거나 coordination 중이면 기존 owner와 handoff 계약으로 route한다. 새 state,
  lifecycle 또는 단계별 예외를 만들지 않는다.

Architecture 문서 계약, concern tree, Decision, registry·checker 판단과 Design applicability 소유권은
바꾸지 않는다. 이미 같은 의미가 있으면 source를 수정하지 않는다.

Product는 추가 수정하지 않는다. 현재 entry가 독립적인 새 project, Sketch 결론, 열린 Product 판단과
Adopt 왕복을 이미 받아들이며 해당 행동 증거도 존재한다. Design 구현 전 current Product entry와 그 증거가
그대로인지 읽기 전용으로 확인한다. 실제 단절이 관찰되기 전에는 새 audit 절차나 Product 규칙을 추가하지
않는다.

## 5. 행동 증거

테스트는 사례를 source 규칙으로 만들기 위한 것이 아니다. 네 판단이 서로 다른 프로젝트에서 적용 여부,
내용 깊이, 자산 권위와 review 가능성을 일관되게 가르는지 공격한다. heading 일치가 아니라 실제 read,
질문, write, route와 후속 사용을 관찰한다.

### 5.1 최소 행동 증거

| 사례 | 공격하는 주장 | 기대 행동 |
|---|---|---|
| A. backend-only library | Design은 선택적이다 | Design 문서나 placeholder 없이 `direct` |
| B. 작은 UI와 reference | 가벼운 Design이 catalog로 부풀지 않는다 | root 하나에 채택 범위·핵심 경험·review route만 기록 |
| C. 두 경험 방향이 가능한 새 project | Design이 설문 대신 결과를 가르는 질문을 찾는다 | 현재 설명과 추천을 먼저 만들고 사용자 소유 선택만 질문 |
| D. concern·Domain·복잡한 component가 있는 큰 system | 고정 taxonomy나 component별 문서 없이 필요한 만큼 깊어진다 | root는 공통 원칙과 route, 독립 concern만 child, 정확한 구현은 code·catalog |
| E. Design prose와 live system이 있는 Adopt | 기존 능력을 잃거나 빈곳을 발명하지 않는다 | 현재 규칙만 재구성하고 live asset을 유지하며 실제 미결정만 Design으로 보내고 Adopt 복귀 |
| F. 후속 UI 변경 | Design이 실제 선택·검토·갱신 기준이다 | 필요한 계보와 live surface만 읽고, 검증된 사실만 같은 계약으로 landing |
| G. 비시각적 사람 대상 interaction | Design이 web·token에 고정되지 않는다 | interaction·feedback·접근성·review만 두고 불필요한 visual 체계는 만들지 않음 |
| H. 다른 단계에서 Design 단서나 선행 결함 발견 | stage 순서보다 owner가 우선하고 단서가 유실되지 않는다 | Product·Architecture·Design으로 알맞게 route하고, 중단을 견뎌야 할 때만 기존 coordination artifact에 보존 |

사례 D는 일반 component와 독립적인 complex editor를 함께 두어 child 판정을 한 번에 본다. 사례 E는 live
asset, 기술 배치, Domain-specific pattern과 실제 evidence gap을 함께 두어 보존과 비발명을 동시에 본다.
사례 H는 새 사용자 접점으로 Design이 나중에 생기는 경우와 Design 중 기술·제품 전제가 열린 경우 중 하나의
작은 흐름으로 충분하다. 여러 왕복을 한 fixture에 억지로 넣지 않는다.

### 5.2 연계 확인

Architecture는 준비된 기존 project의 열린 기술 판단 한 건으로 확인한다. Product를 다시 작성하지 않고
현재 질문에 필요한 의미만 읽어 Architecture를 갱신할 수 있으면 충분하다. Product는 current source와 기존
독립 진입·Adopt 왕복 evidence를 읽기 전용으로 확인하며, 이 Design 작업 때문에 다시 구현하거나 별도
fresh-use matrix를 만들지 않는다.

### 5.3 중개노트 read-only 대조

새 source가 A–H를 통과한 뒤 현재 중개노트를 읽기 전용으로 대조한다. 실제 포팅이나 파일 이동은 하지
않는다. 다음 능력이 유지되는지 본다.

- 새 UI 작업 전에 공통 원칙과 필요한 상세만 찾는다.
- token과 component 사용법을 code·live catalog에서 정확히 확인한다.
- system에 없는 공통 component는 현재 확장 경로로 보낸다.
- light·dark, interaction state와 load-bearing accessibility를 실제 surface에서 검토한다.
- Domain-specific 표현과 공통 design system을 혼동하지 않는다.

이 대조는 중개노트의 현재 한 문서 구성, 모든 component 설명과 운영 skill이 이상적이라고 승인하는
검사가 아니다.

## 6. 구현 순서

Skill Rails 원칙에 따라 target 하나를 delivery와 fresh-use evidence까지 닫은 뒤 다음 target으로 간다.
Architecture 작업이 완료됐다는 보고가 아니라 current source bytes를 기준으로 각 단계의 전제를 확인한다.

### 0차: 연계 전제 확인

1. current Architecture entry를 inspect하고 4.6의 오해가 남아 있을 때만 세 표현을 보완한다.
2. Architecture를 바꿨다면 그 target만 build·check하고 준비된 기존 project의 열린 기술 판단 한 건으로
   Product 직후가 아닌 진입을 관찰한다. 이미 충분하면 수정과 재검증을 반복하지 않는다.
3. current Product entry와 기존 독립 진입·Adopt 왕복 evidence가 유지되는지만 읽는다. Product는 수정하거나
   별도 test matrix를 만들지 않는다.

### 1차: Design

1. package, Design target, Architecture의 applicability 출력과 현재 shared module을 exact inspect한다.
2. `design-document`, package registration, Design imports와 entry를 한 변경으로 작성한다.
3. Design target만 double-build하고 generated diff, receipt, integrity와 source currentness를 본다.
4. standalone fresh session에서 A–D, G와 H를 실행한다.
5. 실패하면 source owner에서 고치고 Adopt로 진행하지 않는다.

### 2차: Adopt

1. current Adopt owner와 Product·Architecture·Design writer 계약을 다시 inspect한다.
2. 계획한 Design import와 네 의미만 추가한다.
3. Adopt target만 double-build/check한다.
4. 기존 Adopt 행동을 회귀 확인하고 E를 실행한다.
5. Design 게시와 `next_route: adopt` 복귀를 실제 state bytes로 확인한다.

### 3차: Work

current Architecture 작업이 그 시점까지 추가한 imports와 문장을 보존한 채 `design-document` conditional-open만
통합한다. Work target을 build하고 사례 F로 새 Design 결정을 만들지 않는 landing을 확인한다.

### 4차: consumer audit와 중개노트 대조

Design을 직접 쓰는 모든 actor가 계약에 도달하는지, read-only consumer가 불필요한 module을 받지 않는지
확인한다. 공통 gate·ownership과 index readiness를 다시 읽고 중개노트 대응표를 current bytes에서
작성한다. 실제 중개노트 포팅과 destructive disposition은 후속 Adopt Work의 acceptance에 둔다.

## 7. 중단 조건

다음이 발견되면 임의로 범위를 넓히지 않고 source 좌표, 실패 장면과 선택지를 보고한다.

- `plan/**`의 Design 소유권, applicability, canonical path 또는 lifecycle을 바꿔야 함
- Architecture가 Design 적용 여부와 지원 surface를 Design에 전달할 수 없음
- Design 게시 뒤 Adopt 복귀가 공통 gate로 표현되지 않음
- Design·Adopt·Work가 한 Design 문서 계약을 공유할 수 없음
- Sketch·Product·Architecture·Design·Direct·Work·Verify 사이에서 새 Design 단서를 canonical owner까지
  보존하려면 전역 lifecycle, inbox 또는 중복 정본이 필요해짐
- Architecture 진입 의미를 바로잡으려 Product readiness나 canonical ownership 자체를 바꿔야 함
- current Product source나 기존 evidence가 독립 진입 또는 Adopt 왕복과 실제로 모순됨
- 현재 Architecture 작업이 그 시점까지 추가한 shared module이나 Work import와 충돌함
- Domain design child가 accepted subtree 계약으로 표현되지 않음
- 외부 design source 또는 live catalog를 유지하려 `.devflow` 밖의 두 번째 prose canon이 필요해 보임
- Devflow 공통 token schema, component registry, renderer, screenshot runner 또는 tool adapter가 필요해 보임
- 기존 backend skip, UI foundation, Product·Architecture·Domain ownership 또는 Adopt 행동이 회귀함
- 테스트를 통과시키려 고정 component 목록, 질문 수, child depth 또는 특정 framework가 필요함

## 8. 자체 검증 결과

### 소유권과 writer reachability

| 정보 | owner | writer contract |
|---|---|---|
| Design 적용 여부와 지원 surface | Architecture | Architecture contract |
| 공통 경험·표현·interaction·review 원칙 | Design root·concern | `design-document` |
| 한 Domain의 경험 계약 | Domain design child | `design-document`, decision route는 Design |
| 현재 방향을 지킬 이유 | 현재 decision | 기존 `decision-document` |
| exact token·component 동작 | code·live asset | 프로젝트별 실행 자산 |
| 검증된 Design 지식의 후속 반영 | Work pending landing | `design-document` |
| 과거와 변경 시점 | Git | 별도 Design log 없음 |

Design, Adopt와 Work가 Design prose를 쓸 때 모두 같은 계약에 도달한다. Architecture는 applicability만
결정하므로 계약을 읽지 않는다.

### 규모별 결과

```text
Design 없음
  └─ design.md 없음

작은 경험 foundation
  └─ design.md

독립 질문이 증명된 project
  ├─ design.md
  ├─ design/<concern>.md
  └─ domains/<domain>/<design-concern>.md

live design system
  ├─ 위 current Design canon
  └─ token/theme/component/catalog/prototype/operational skill
     (실행 자산이며 prose 사본이 아님)
```

### 과잉 방지

- Architecture가 Design 적용 대상을 확인하지 못하면 Design을 만들지 않는다.
- UI가 있다는 이유만으로 token, component catalog와 child를 모두 만들지 않는다.
- 특정 framework, design tool, page와 component 이름을 범용 taxonomy로 만들지 않는다.
- 외부 reference의 이름만으로 프로젝트별 판단을 대신하지 않는다.
- code와 live catalog가 소유하는 exact 값을 Design prose에 복제하지 않는다.
- 모든 구현 선택과 화면별 예외를 Decision이나 Design history로 축적하지 않는다.
- source에는 네 판단 기준을 두고 프로젝트 사례는 test에만 둔다.

### 여전히 `unproven`인 것

- 여러 산업·매체에서 AI가 항상 적합한 경험 방향을 추천하는지
- 시각 UI가 아닌 사람 대상 상호작용에 현재 Design 경계가 충분한지
- 재귀 Design concern tree가 초대형 design system에서도 과분할 없이 유지되는지
- 외부 live design source가 장기간 접근 불가하거나 변경될 때의 복구 비용
- 중개노트의 모든 component catalog 내용과 project-local skill이 장기적으로 유지할 가치가 있는지
- 실제 중개노트 포팅이 old Design prose 없이 완전히 독립하는지
- Architecture 교차 진입과 Product 복귀가 서로 다른 host·중단 상황에서도 항상 같은 finding을 보존하는지

이 작업은 보편적인 미감이나 component 체계를 미리 정하지 않는다. 적용 여부, 현재 경험 모델, 자산의
권위와 검토 가능한 route를 만들고 관찰된 결과만 증명한다.

## 9. 완료 보고

구현자는 다음을 분리해 보고한다.

- 수정한 canonical source와 target별 생성 경로
- current Architecture 작업과 합쳐진 import·문장, 보존한 변경과 충돌 여부
- Architecture 표현을 최소 보완했는지 이미 충족되어 생략했는지
- Product를 변경하지 않은 근거 또는 current source에서 발견한 실제 모순
- double-build tree hash, integrity와 source currentness
- fresh-use 사례의 실제 read, 질문, write, route와 `proven|failed|unproven`
- Design을 생략한 경우와 만든 경우의 applicability 근거
- child, external reference와 live asset을 유지·분리·거부한 근거
- 후속 UI 변경이 읽은 Design 계보와 실제 review surface의 관찰
- 기존 행동 회귀 여부와 중개노트 read-only 대응 결과
- 계획과 달라진 점, 충돌 owner와 필요한 사용자 결정

build 성공, 문서 존재, screenshot 생성과 catalog route 존재만으로 AI 행동이나 경험 품질이 증명됐다고
표현하지 않는다. 실행하지 않은 실제 포팅, 사용자 수용과 다양한 project generalization은 통과했다고
보고하지 않는다.
