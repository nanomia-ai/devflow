# devflow 지식 계층·개발 사이클 재설계 조사

- 조사일: 2026-08-27
- 현행 기준: devflow v0.18.9, `b715fcd`
- 성격: 문제 진단과 설계 제안. 채택된 설계 결정이나 릴리스 계획이 아니다.
- 조사 대상:
  - 현재 devflow 저장소의 설계 문서, 결정 기록, 런타임 스킬과 상태 도구
  - 읽기 전용 사례 `D:/Projects/Public/jgnote/service/jgnote-mono-ts`
  - 아이디어 비교 대상으로서 SkillSpec 공개 저장소
- 변경 범위: 이 조사 문서 한 파일. `skills/**`와 JGNote 저장소는 수정하지 않았다.
- 미래 구현 세션 진입: 대화 맥락 없이 이 문서를 받은 AI는 **25절을 먼저 읽고**, 그 절이 지목한
  consumption set만 단계적으로 연다. 이 문서만으로 `skills/**` 구현을 시작하지 않는다.

## 0. 결론

사용자가 제기한 중심 문제는 타당하다. 현재 devflow는 **작업 실행의 안전한 재개**에는 강하지만,
프로젝트가 완성되기 전 장기간 반복되는 조사·기획·아키텍처 결정과 프로젝트가 시작된 뒤 반복되는
국소 재기획을 **사망 내성 작업**으로 보존하고 재개하지 못한다. product/adopt/arch는 다시 실행할 수
있으므로 문자 그대로 일회성 스킬은 아니다. 그러나 확인 전 사고의 지속 단위는 대화이고, 구현
작업에만 카드·진행 로그·체크포인트·점유라는 생애가 있다. 장기 연구와 부분 기획이 사라지는 공통
원인은 지식 트리가 얕아서가 아니라 **그 지식이 태어나는 작업이 아직 일급 작업이 아니기 때문**이다.

다만 현행 지식 계층을 단순하거나 미구현이라고 평가하면 정확하지 않다. devflow에는 이미 다음의
좋은 토대가 있다.

- product/arch/design의 Layer 0 정본
- 깊이 1 capability별 설계 구역과 검증 구역
- 출처·충돌·읽기 예산을 가진 필요 시 열기 방식의 knowledge capsule
- 재귀 작업 트리, 카드별 진행 로그, 검증과 지식 승격
- 최소 HANDOFF, 도메인 진입, glossary 색인, 상태 도구 기반 재개

최초 권장안은 이 공백을 product/capability·architecture·domain 세 축, change cycle, evidence record,
machine projection으로 해결하려 했다. 그러나 기록층을 폐기한 DD-77의 실측을 반증하지 못했고, 새
일급 객체 3~4종·상태 enum 두 벌·여러 투영과 수기 edge를 요구했다. 기존 제안을 읽지 않은 독립
first-principles 반증도 문제 진단에는 수렴했지만 이 처방은 과설계라고 판정했다. 이 조사에서는 최초
권장안을 철회한다.

> **현재 지식의 집은 유지하고, 기존 재귀 작업 트리와 카드의 시간 범위만 기획·조사까지 넓힌다.**
> 작은 변경은 계속 커밋 하나로 끝낸다. 세션을 넘길 조사만 기존 카드 문법과 진행 로그를 얻고,
> 확정된 결론은 기존 소유 문서·능력 문서·캡슐로 착지한 뒤 카드가 닫힌다.

단, Layer 0 이전과 owner 없는 project-wide synthesis를 위해 **기계가 인식하는 예약 project scope
하나**는 필요하다. 새 문서나 카드 종류는 아니지만 correspondence·baseline·capability verify·state
zone에 명시적 예외를 요구하므로 “새 primitive 0”이라고 과소 신고하지 않는다.

목표 모델은 **재귀 current-knowledge plane 하나 + 재귀 work plane 하나**다. 둘을 관통하는 원리는
“시간을 가진 의미 주소”다. current tree는 의미·책임·소비 목적을, work tree는 목표·의존성·완료
조건을 따라 자라며 서로 같은 폴더 구조를 복제하지 않는다. 작업 카드는 정확한 `Read first`와 착지
경로로 current node에만 연결된다.

현재 capsule은 capability 아래의 출처 기반 지식 단위다. 최종 목표에서는 이 **같은 지식 node 문법을
product·arch·design·capability라는 기존 canonical owner 아래에서 재귀적으로 사용할 수 있게
일반화**한다. frontend/backend, 시장성 조사, UI system, property modal/list 같은 이름을 devflow가 고정
축으로 만들지 않고, 해당 프로젝트의 실제 owner 아래에서만 node가 생긴다. 외부의 방대한 plan/report/
architecture 문서는 처음에는 source이며, 현재 계약은 이 owner tree에 착지한다. runtime은 재귀를
지원하되 작은 프로젝트는 child를 하나도 만들지 않는다.

사람의 진입 방식은 자유롭게 두고, AI는 활성 작업 재개와 새 project/domain/횡단 작업 진입을 구분해
한 단계씩 필요한 깊이만 연다. 다만 이 목표 구조는 아직 배포 계약이 아니다. fresh-consumer 평가와
producer/consumer/test closure가 통과하기 전의 완성도는 “설계 후보”로만 판정한다.

## 1. 조사 질문과 판정 기준

이 조사는 다음 질문을 분리해 다뤘다.

1. 사용자가 지적한 현상이 현재 스킬 원문에서 실제로 발생하는가?
2. 이미 존재하는 장치를 놓치고 같은 기능을 다시 제안하고 있지는 않은가?
3. JGNote의 문서량과 작업 이력은 어떤 지속 지식이 실제로 생기는지 무엇을 보여 주는가?
4. 사람의 자유로운 작업 방식과 AI의 제한된 문맥을 동시에 만족하려면 무엇이 정본이어야 하는가?
5. 기존 결정이 막았던 무제한 링크, 중복 문서, 세션 노트, 전체 재독을 되살리지 않고 어떻게
   확장할 수 있는가?

판정은 세 범주로 구분한다.

- **확인된 결함**: 현재 원문과 실제 실패 장면이 연결되고 중요한 지식 또는 재개 경로가 사라진다.
- **설계 긴장**: 현행이 의도한 안전장치가 있지만 큰 프로젝트에서 비용이나 표현 한계가 발생한다.
- **이미 지원됨**: 사용자 우려와 닮았지만 현재 장치가 이미 해결한다. 재설계 때 보존해야 한다.

### 1.1 사용자 경험과 최종 설계의 추적

| 사용자가 강조한 실제 장면 | 분석/설계 좌표 |
|---|---|
| 새 프로젝트의 수 주 feasibility·시장·기술 조사 | F1, 예약 project scope, research card tree |
| 작고 AI 판단에 맡길 수 있는 변경 | tweak 카드 0·커밋 1, mode 없음 |
| 프로젝트 시작 뒤 domain/전체의 반복 재기획 | F2, capability branch 또는 project synthesis |
| frontend/backend 이상으로 커지는 architecture | arch owner 아래 재귀 K subtree, 고정 축 없음 |
| JGNote급 상세를 잃지 않는 분할 | 9절 disposition과 G1~G6 회수율 |
| 문서 비대화 시 한 단계씩 읽는 트리 | 재귀 K 지원과 조건부 node 생성, direct-child projection |
| AI가 어디에 읽고 쓸지 판단 | semantic address와 10절 두 진입·쓰기 규칙 |
| 세션 직후 이어받기 | state → active card → current owner의 resume 경로 |
| 과거 작업과 무관한 새 domain/횡단 작업 | authority → child header → owner의 orientation 경로 |
| 팀 병렬 작업과 에이전트 드리프트 | child claim, synthesis 한 writer, fresh independent review |
| 이전 설계가 구현에서 반복 실패한 경험 | 13절 구현 전 fixture와 14절 원점 재검토 조건 |

## 2. 현행 구조의 실제 모습

### 2.1 프로젝트 시작과 Layer 0

product는 문제, capability 조합, 경계와 성공 기준을 확정해 `product.md`를 만든다. arch는 그 결과로
component, stack, code structure, verify channel과 capability 설계 구역을 만든다. design은 선택적
Layer 0 결정이다. brownfield에서는 adopt가 capability 후보마다 대표 흐름을 추적해 같은 Layer 0과
capability 설계를 역산한다.

이 단계는 생각보다 유연하다. product와 arch는 나중에 다시 실행할 수 있고 product 재실행 marker도
있다. 따라서 “최초 한 번 실행하고 영원히 닫힌다”는 평가는 틀리다. 그러나 재실행 이전의 질문과
대안은 별도 지속 객체가 아니다. product는 질문 예산 뒤 요약을 대화 안에서만 만들며 파일·상태·
커밋을 만들지 않는다(`skills/product/SKILL.md:64-92`). adopt의 후보 비교 evidence table도 대화에만
두고 저장을 금지한다(`skills/adopt/SKILL.md:85-86`). 사망하거나 며칠 뒤 돌아오면 확정 결과는
남아도 그 결과에 도달하던 미완료 조사 경계는 남지 않는다.

product의 `8+ capabilities → this is not one project` 규칙(`skills/product/SKILL.md:87`)도 작은 서비스의
초기 경계 방어에는 유용하지만, 하나의 장기 제품에 합법적으로 많은 capability와 연구 프로그램이
있는 경우에는 프로젝트 정체성과 작업 크기를 혼동한다. 큰 프로젝트를 무조건 여러 프로젝트로
나누면 공통 product 목적, 교차 아키텍처와 통합 검증의 정본을 잃을 수 있다.

### 2.2 지식 계층

현행의 capability 문서는 깊이 1 작업 단위마다 하나이며 설계 구역과 검증 구역을 같은 정본에서
분리한다. 전체 약 185줄의 경계가 있고(`baseline-predicates.md:93`), 큰 출처나 설계 초과분은
knowledge capsule로 분리할 수 있다. capsule은 다음 강점을 가진다.

- 출처 좌표와 원문 변동을 추적한다.
- 출처와 현재 정본이 충돌하면 그 사실을 숨기지 않는다.
- 헤더는 경량 색인이며 본문은 필요할 때만 연다.
- 한 카드 실행에서 여는 본문을 240줄 또는 24 KiB로 제한한다
  (`baseline-predicates.md:330-334`).
- authoring cap 120줄은 쓰기 손실을 강제하지 않는 soft cap이다
  (`baseline-predicates.md:179`).

따라서 “devflow가 언제나 세부 내용을 요약해 없앤다”는 진술은 현재 버전 전체에는 맞지 않는다.
DD-76 이후 capsule은 바로 그 손실을 줄이기 위해 도입됐다. 하지만 생성 조건과 위치가 제한적이다.
arch/adopt가 사용자가 지정한 기존 문서를 처리하거나 capability 문서가 넘칠 때 주로 태어나며
(`skills/arch/SKILL.md:318-327`, `skills/adopt/SKILL.md:178-196`), work 중 생긴 임의의 장기 연구가
자동으로 이 지식 계층의 하위 연구 트리가 되지는 않는다. capsule 폴더도 capability 아래 한 층의
평면 집합이다. 하위 연구 질문, 실험 계보, 아키텍처 subsystem을 재귀적으로 표현하는 규약은 없다.

### 2.3 실행과 재개

split의 작업 트리는 여러 깊이를 지원한다. 중간 폴더와 카드로 큰 구현을 나누고 work가 카드 하나를
실행하며, verify가 깊이 1 capability와 product 두 층에서 실제 동작을 확인한다. 진행 중 지식은
progress log, carry, feedback, capability note를 통해 다음 단계로 이동한다. work는 HANDOFF를 쓰기
전에 대화에서 얻은 지속 지식을 정본 위치에 먼저 기록하고, HANDOFF에는 변동 가능한 다음 단계만
남기도록 강제한다(`skills/work/SKILL.md:610-645`). 이 최소 HANDOFF 원칙은 유지해야 한다.

하지만 작업 트리의 재귀성과 지식 계층의 재귀성은 같지 않다.

- scenario verification은 깊이 1 capability에서만 열린다(`skills/split/SKILL.md:247`).
- 중간 폴더는 주로 기계적인 완료 투영이다.
- research card의 답과 근거는 progress log에 남는다(`skills/split/SKILL.md:276`).
- 복잡한 유지보수 계획의 2b 경로는 같은 대화에서 비교를 계속하고 새 planning file이나 상태를
  만들지 않으며, 비교 자체도 저장하지 않는다(`skills/split/SKILL.md:347-364`).

즉, split은 “계획을 세운다”기보다 이미 정한 목적을 실행 가능한 카드로 분해한다. 큰 변경의 문제
정의, 여러 대안의 비교, 연구 종료 조건, 계획 수정 계보를 소유하는 일급 객체가 아니다. 닫힌 폴더의
로그는 평상시 재개에서 다시 열지 않으므로, verify가 현재 정본으로 승격하지 않은 연구의 중요한
맥락은 디스크에 있어도 소비 경로 밖에 놓일 수 있다.

### 2.4 AI 문맥 비용

현행은 capability와 capsule 본문 읽기는 잘 제한하지만, 공통 실행 계약은 계속 커지고 있다. 조사
시점의 배포 문서는 대략 다음 크기였다.

| 문서 | 줄 | 바이트 |
|---|---:|---:|
| `skills/principles/SKILL.md` | 1,006 | 79,048 |
| `skills/work/SKILL.md` | 646 | 46,530 |
| `skills/verify/SKILL.md` | 611 | 49,983 |
| `skills/split/SKILL.md` | 608 | 41,893 |
| `skills/resume/SKILL.md` | 344 | 28,064 |
| `skills/arch/SKILL.md` | 338 | 20,632 |

`docs/design-backlog.md`의 측정도 entry 문맥이 약 148 KiB, 약 37k tokens까지 커졌고, 한 사례에서는
13,087바이트의 코드에 진입하기 위해 약 365 KiB의 정본을 읽었다고 기록한다. 이는 지식 본문을
on-demand로 만든 것만으로는 충분하지 않다는 증거다. 공통 불변식, 현재 route, 현재 scope의 계약을
각기 다른 투영으로 제공하되, 안전 규칙이 조각 사이에서 사라지지 않는 기계 검증이 필요하다.

## 3. 객관적 문제 진단

### 3.1 현행 계약과 구현 사이의 확인된 결함

#### D1. `marker.glossary-term`이 resume consumer에 연결되지 않는다

독립 감사에서 이 조사 주제와 별개인 좁은 runtime wiring 결함 한 건이 확인됐다. state registry는
`glossary-term`을 routable marker로 등록하고(`project-state.mjs:64-69`) 실제 next route로 출력한다.
state test도 valid marker가 `next: marker.glossary-term`을 만들고 ready/claim보다 선행하는 동작을
고정한다(`project-state.test.js:3273-3283`). principles, arch, adopt에는 이 marker의 소비 지시가 있다.
그러나 resume의 next-stage table에는 `marker.product-rerun` 다음 `marker.design-note`가 나오며
`marker.glossary-term` 행이 없다(`skills/resume/SKILL.md:239-240`).

실패 장면은 glossary term marker를 commit한 뒤 새 세션이 시작되는 경우다. 상태 도구는 이 marker를
최우선 next로 내지만 resume가 호출할 writer를 정하지 못해 문자 그대로 실행하는 AI는 멈추거나
추정해야 한다. marker 자체는 남으므로 조용한 자료 소실은 아니며, 이 결함 하나가 지식 계층 전체의
재설계를 증명하지도 않는다. 현재 요청은 `skills/**` 수정 권한이 없으므로 별도 수리와 wiring
completeness 재감사가 필요하다.

### 3.2 사용자 목표 대비 확인된 구조적 공백과 아직 증명되지 않은 가설

다음 항목은 현행 명세를 어긴 runtime defect가 아니다. 현재 결정이 의도적으로 선택한 구조와, 이번
요청이 새로 요구하는 장기 연구·재기획 능력 사이에서 원문과 실패 장면으로 확인되는 gap이다. 따라서
해결하려면 기존 결정을 실수로 우회하지 말고 해당 이유를 다시 열어 반증해야 한다.

#### F1. 확인 전 장기 조사와 기획은 사망 복구 단위가 아니다

실패 장면은 프로젝트 전체를 며칠 또는 몇 주 조사하는 중간에 세션이 끝나는 경우다. 확정된
`product.md`가 아직 없으면 질문 frontier, 검토한 대안, 아직 확인하지 못한 가설과 연구 종료 조건을
복원할 일급 파일이 없다. adopt는 대표 흐름 전체를 내부 evidence table로만 유지하므로 긴 brownfield
추적 중 사망할 때 같은 문제가 발생한다. 이 현상은 backlog에도 이미 “death mid-adopt loses the full
representative-flow trace”로 기록돼 있다.

영향은 단순한 불편이 아니다. 다음 AI가 같은 조사를 반복하거나, 불완전한 결과를 완성된 판단으로
오인하거나, 사용자가 기억하는 경계와 다른 프로젝트를 확정할 수 있다.

#### F2. 프로젝트 시작 뒤의 큰 기획에 사망 내성 작업 주인이 없다

유지보수 routing은 작은 tweak와 카드 생성, Layer 0 수정 여부를 잘 구분한다. 그러나 Layer 0는 그대로인
큰 기능이나 subsystem 고도화가 여러 조사 frontier와 설계 결정을 요구하면, 실행 카드로 압축되기 전의
비교와 미결 상태는 대화에만 산다. split 2b가 비교를 상태로 저장하지 않는다는 사실은 이 한계를
의도된 현재 동작으로 만든다.

결과적으로 product/arch를 다시 열기에는 국소적이고, 바로 split하기에는 아직 불확실한 작업이
중간에 걸린다. 비어 있는 것은 새 `plan/spec` 파일 종류가 아니라 **기획·조사도 카드처럼 세션을
넘기고 닫힐 수 있는 시간 범위**다.

#### F3. 조사 결론의 착지 게이트가 구현 경로에 결합돼 있다

research card 결과는 progress log에 남을 수 있다. 그러나 닫힌 깊이 1 폴더는 이름 중심으로 읽고,
verify는 구현 종료 시 현재 행동·trap·결정 중 선택된 내용을 capability 문서에 반영한다. 독립 조사나
기획이 구현으로 바로 이어지지 않으면, 결론·부정 결과·재검토 신호 각각을 현재 소유 문서로 올리거나
역사로만 동결할지를 강제하는 동일한 폐쇄 게이트가 없다.

따라서 필요한 것은 모든 근거를 새 evidence layer로 옮기는 일이 아니다. 조사 작업을 닫기 전에 오래
남을 결론이 기존 발견→갱신 표의 한 집, 재측정 가능한 capsule, 또는 명시적 폐기 중 하나의 처분을
받았는지 확인하는 **착지 게이트의 일반화**다.

#### H1. 별도 architecture hierarchy가 필요하다는 주장은 아직 가설이다

global `arch.md`에 모든 상세를 넣거나 여러 capability에 복제하면 문제가 생긴다는 압력은 타당하다.
JGNote도 짧은 root architecture와 frontend/backend/verification 상세 문서의 조합이 유효함을 보였다.
그러나 JGNote는 devflow로 생성된 프로젝트가 아니며, 현재 devflow 실측에서 골조 능력 문서와 01
capsule이 실제로 넘치거나 소비자가 어긋난 장면은 확인하지 못했다. 따라서 별도 architecture 축은
현재 결함의 해결책이 아니라 **독립 소비자와 검증 종료점이 실측될 때 다시 여는 가설**이다.

#### H2. 여러 capability를 묶는 별도 검증층도 아직 가설이다

task card의 completion signal은 실행 완료를 증명하지만, 연구 프로그램이나 architecture subtree,
여러 capability를 묶는 initiative가 “현재 결론으로 닫혔다”고 판정하는 일급 검증점은 없다. 큰
변경의 중간 synthesis가 틀리면 하위 카드가 각각 통과해도 상위 판단은 검증되지 않을 수 있다. 다만
이것이 새 검증층을 요구하는지는 증명되지 않았다. 상위 조사·synthesis 카드의 완료 신호와 착지
게이트로 같은 폐쇄를 표현할 수 있는지 먼저 실험해야 한다.

### 3.3 설계 긴장

#### T1. 자세히 남기기와 현재 정본을 짧게 유지하기

모든 경험을 정본에 넣으면 AI가 읽을 수 없고, 요약만 남기면 결정 이유와 실패 경험이 사라진다.
해법은 더 긴 단일 문서나 새 기록층이 아니라 **현재 소유 문서와 동결된 작업 기록의 역할 분리**다.
현재 소유 문서는 덮어쓰고, 조사 카드의 로그는 당시 관찰로 동결하며, 재측정이나 반증에 실제로
필요한 근거만 현재 결론 옆이나 capsule의 정확한 Source basis로 도달 가능하게 만든다.

#### T2. 자유로운 사람의 접근과 엄격한 AI routing

사람은 프로젝트 전체, domain, component, 특정 질문, 버그 중 어디서든 시작한다. AI에게도 자유 탐색을
허용하면 과독과 잘못된 정본 선택이 생긴다. 사람에게는 여러 진입 의도를 허용하되 AI에게는 그 의도를
정확한 현재 소유 문서와 활성 카드로 해석하는 기계 route를 줘야 한다.

#### T3. 한 트리의 단순성과 교차 관심사의 현실

capability 하나의 트리는 이해하기 쉽지만 architecture와 domain 관계는 교차할 수 있다. 반대로 일반
graph나 선험적 세 축은 읽기·무결성·분류 비용이 너무 크다. 기본은 현행 소유 구조를 유지하고,
프로젝트에 별도 소유 문서가 실제로 필요해질 때만 정확한 소비자·열기 조건·검증 종료점을 가진 경로를
추가해야 한다. 교차 가능성만으로 포리스트를 먼저 만들면 안 된다.

#### T4. 고정 architecture 어휘와 실제 혼합 구조

arch는 code structure를 domain-vertical, Feature-Sliced, flat 세 선택으로 유도하고 folder depth 3,
file 약 400줄 heuristic을 둔다. Components와 capability design, 재귀 task tree가 이를 보완하므로
현재 결함으로 단정할 실행 증거는 없다. 다만 monorepo, 여러 runtime, frontend/backend/data plane이
섞인 프로젝트에서 이 어휘가 충분한지는 별도 실물 검증이 필요하다. 권장 architecture axis는 이
검증을 먼저 통과해야 하며 단지 JGNote가 복잡하다는 이유로 고정 schema를 늘려서는 안 된다.

### 3.4 이미 지원되므로 보존할 것

- **한 사실 한 집과 권위 우선순위**: 같은 현재 사실의 복제를 막는다.
- **DD-33의 reachability**: 디스크 존재가 아니라 실제 소비 경로를 요구한다.
- **설계/검증 구역 분리**: 예상과 실제를 같은 현재 정본에서 비교한다.
- **capsule의 출처·충돌·읽기 예산**: 세부 내용을 잃지 않고 선택적으로 연다.
- **재귀 task tree와 카드 claim**: 팀 구현 병렬성의 안전한 기반이다.
- **carry와 capability note**: 작업 중 알게 된 지식을 정본으로 올리는 경로다.
- **최소 HANDOFF**: 재계산 가능한 상태를 거대한 세션 요약으로 복제하지 않는다.
- **glossary와 domain entry**: 사람이 이름으로 묻고 AI가 정확한 capability로 들어간다.
- **실제 실행 검증과 독립 판정**: 문서 일치가 아니라 동작을 종료 조건으로 삼는다.

## 4. JGNote 사례에서 확인한 것

### 4.1 문서 생태계 실측

JGNote의 `docs/`에는 최종 실측 시점 기준 51개 파일, 2,391,340바이트, 30,152줄이 있었다. Markdown
50개가 2,374,818바이트·29,667줄이고 machine-readable domain registry JSON 1개가 나머지다. 주요
군집은 다음과 같다.

| 군집 | 파일 | 바이트 | 역할 경향 |
|---|---:|---:|---|
| `docs/specs/` | 18 | 1,080,529 | 요구·구현 계약·다음 작업자 handoff |
| `docs/report/` 전체 | 20 | 1,014,913 | 연구, 역사 증거, 설계 synthesis |
| `docs/plans/` | 2 | 109,471 | 큰 전환의 결정·계획·검증 |
| `docs/architecture/` | 3 | 59,905 | frontend/backend/verification 상세 정본 |

specs와 report가 전체 바이트의 약 87.6%를 차지한다. 가장 큰 문서는 team handoff 약 166 KB,
property handoff 약 150 KB, property wizard 설계 약 151 KB, property spec 약 118 KB였다.
`backend-auth-foundation.md` 하나도 약 93 KB, 1,300줄이며 여러 revision correction, repository facts,
17개 ADR, schema, file placement, request lifecycle, security, migration wave, verification ladder와 open
question을 함께 가진다.

이 수치는 “프로젝트를 한 번 기획한 뒤 구현한다”는 모델이 실제 장기 작업을 설명하지 못한다는 강한
사례다. 한 domain만으로도 조사, 충돌 해소, 구현 계약, 후속 handoff와 재기획이 반복된다.

### 4.2 잘 작동한 구조

JGNote의 핵심 장점은 문서가 많다는 사실이 아니라 권위와 진입면을 구분한 점이다.

- root `docs/ARCHITECTURE.md`가 core → 상세 architecture → ADR/registry → code/check →
  domain 설명/generated/plan/report의 권위 순서를 제시한다.
- frontend, backend, verification을 별도 상세 architecture 문서로 나눠 global 문서의 크기를 제한한다.
- report는 historical evidence이며 현재 규범이 아니라고 명시한다.
- `docs/domains/registry.json`이 domain, capability, handoff의 기계 원본이고 generated map과 CI freshness
  검사가 이를 소비한다.
- `legacy-property/README.md`처럼 연구 묶음에 순서와 범위를 주는 수동 index가 있고,
  `property-design/00-implementation-contract.md`가 여러 설계 문서의 충돌을 해소해 구현자가 읽을
  현재 계약을 만든다.
- handoff는 코드에서 복원하기 어려운 실패 이유, 버려진 대안, server seam과 회귀 장면을 보존한다.

이는 `짧은 현재 권위 문서 → 작업별 정확한 상세 문서 경로 → 필요 시 역사 근거`라는 읽기 패턴이
실전에서 유효함을 보여 준다. 특정 subsystem/domain index나 새 devflow 축의 필요성까지 증명하지는
않는다.

### 4.3 실패하거나 비용이 커진 구조

JGNote를 그대로 모방해서는 안 된다.

- plan과 handoff가 현재 계약, 과거 수정 이력, 결정, 구현 파일, 검증을 함께 누적해 mega-document가
  됐다. 문서 위쪽의 최신 correction이 아래의 오래된 문장을 덮어쓰므로 AI가 시간축을 잘못 읽을 수
  있다.
- architecture가 durable ADR owner를 말하지만 실제 ADR directory는 없고 17개 ADR이 proposed plan
  안에 묻힌 사례가 있다.
- committed current state, dirty in-flight state, dated snapshot, historical evidence 사이에 문구가
  엇갈리는 구간이 있다. 진행 중 작업을 출시 결함이라고 단정할 수는 없지만 새 세션이 상충된 현재
  상태를 읽는 위험은 실재한다.
- 명시적 Markdown link만 보면 27개 문서가 incoming link 0 후보다. generated map처럼 code/CI가
  소비하는 문서는 고립이 아니므로 link 검사만으로 판정하면 오탐이고, 반대로 실제 소비자가 없는
  `billing-plan.md` 같은 후보는 다시 발견되기 어렵다.
- 다수의 handoff/spec은 매우 상세하지만 역할과 종료 조건이 일정하지 않아 새로운 문서가 생길 때
  무엇을 반드시 기록해야 하는지 작업자 판단에 의존한다.

따라서 devflow의 목표는 JGNote만큼 많은 파일을 자동 생성하는 것이 아니다. **현재 규범은 짧은 소유
문서로 유지하고, 진행 중 사고는 재귀 작업 카드에, 재현할 근거는 기존 capsule·검증 결과에 남기며,
역사 문서는 정확한 열기 이유가 있을 때만 도달하는 체계**여야 한다.

### 4.4 일반화하면 안 되는 것

JGNote의 특정 frontend/backend stack, property 모델, auth provider, F0~F4 wave, mock 상태명과 폴더
topology는 사례 데이터다. devflow의 고정 schema가 되어서는 안 된다. 일반화할 수 있는 것은
authority, 현재/역사 분리, 정확한 소비 경로, bounded read, promotion, freshness 검증이다.

## 5. SkillSpec에서 참고할 수 있는 아이디어

SkillSpec은 이 조사에서 구현을 차용할 대상이 아니라 기술적 비유다. 공개 원문에서 확인되는 핵심은
source map이 파일·node·line range·hash·reference를 만들고, query가 정확한 handle을 선택한 뒤 lens가
필요한 block만 단계적으로 여는 방식이다. import는 local relative path와 명시적 section/nesting을
검증하고 cycle, root escape, 누락 section의 임의 fallback을 막는다. 작은 load-bearing 부분은 always,
나머지는 on-demand로 둔다.

devflow에 유효한 원리는 다음 네 가지다. 모두 **새 source map을 만들라는 뜻이 아니라**, 이미 소유한
문서와 카드의 읽기 경계를 더 정확히 만들 때의 제약이다.

1. 현재 소유 문서는 세부 문서를 파일명으로 추측하게 하지 않고 **정확한 path와 열기 이유**를 준다.
2. AI는 폴더 전체가 아니라 현재 작업이 가리키는 문서나 안정된 구간을 한 단계씩 연다.
3. source revision이 바뀌면 stale을 숨기지 않고 기존 상태 도구나 검증 계약이 재검토 route를 만든다.
4. 관계를 새 수기 graph로 복제하지 않고, 행동하는 소비자와 테스트가 이미 쓰는 정확한 경로에서
   필요한 투영만 파생한다.

그대로 복제하면 안 되는 이유도 분명하다. SkillSpec은 별도 구조화 계약, CLI와 runtime loader를
가정한다. devflow의 현재 always-read 불변식과 소비자별 정본 규칙을 token 절감만을 이유로 조각내면
필수 안전 규칙이 조용히 사라질 수 있다. 또한 현행 결정은 추가 borrowing에 별도 허가를 요구한다.
따라서 여기서는 공개 아이디어와 요구 조건만 기록하며 도입을 결정하지 않는다.

## 6. 근본 재점검: 진단은 유지하고 처방은 철회한다

### 6.1 독립 반증 방법

최초 제안의 작성자가 자기 논리를 반복하지 않도록, 별도 Fable 세션은 현재 제안의 결론과 6절 이후를
읽지 않은 채 다음 순서로 조사했다.

1. design 전문, decision index, 지식층 결정과 rejection 원문을 읽었다.
2. principles, baseline, planning evidence, product/adopt/arch/split/work/verify/resume 원문을 읽었다.
3. 첫 pass에서 JGNote의 root architecture와 대표 plan만 spot-check했다. 초안이 나온 뒤 같은 Fable에
   대표 7개 문서의 내부 역할·바이트 부피·세 번의 강제 중단을 별도 공격 과제로 주었다.
4. 아홉 실패 장면을 독립적으로 풀고 가장 작은 primitives를 먼저 스크래치에 고정했다.
5. 그 뒤에만 최초 제안을 읽고 keep/reframe/reject와 자기 폐기 조건을 작성했다.

첫 독립안은 F1·F2·F3의 뿌리에 수렴했다. 그러나 “지식 포리스트 + 별도 cycle + evidence”는 문제보다
큰 해법이라고 판정했다. 특히 evidence의 5상태 생애는 DD-74/75를 대체한 DD-77의 기각 실측을
반증하지 않고 되살렸다. 두 번째 부피 공격은 Fable 자신이 제안한 단일 card log도 JGNote 규모에서
mega-document가 된다고 다시 기각했다. 이 두 소견은 표현 문제가 아니라 설계 방향을 바꾸는
반증이므로 모두 채택한다.

### 6.2 잃으면 안 되는 여섯 작업

| 불변 작업 | 현행에서 이미 있는 기제 | 재설계가 지켜야 할 것 |
|---|---|---|
| 사람이 확정한 사실의 즉시 착지 | 발견→갱신 표, Layer 0 확인 커밋 | 새 중간층이 착지를 늦추지 않는다 |
| 어느 지점에서든 사고의 사망 내성 | 카드 진행 로그와 `wip` 체크포인트 | 기획·조사에도 같은 생애를 준다 |
| 유계 재개 | 상태 도구 한 장과 정확한 열기 순서 | 새 기본 읽기나 전체 검색을 만들지 않는다 |
| 실행 검증과 지식 접힘 | completion signal, verify, capability 갱신 | 조사도 닫히기 전에 결론의 처분을 받는다 |
| 팀 동시성 안전 | room, claim, 통합 tip, journal 3-way | 새 작업도 기존 점유 단위로만 병렬화한다 |
| 사람 자유와 AI 결정론의 비대칭 | 자연어 진입 + 상태 기반 routing | 사람의 진입 종류와 기계 상태 종류를 동일시하지 않는다 |

### 6.3 첫 원인은 작업의 시간 범위, 두 번째는 현재 지식의 규모 한계다

현행에서 유일하게 사망 내성을 가진 사고 단위는 카드와 그 재귀 트리다. 그런데 첫 작업 트리는 Layer
0와 capability 문서가 확정된 뒤에만 열린다. 따라서 다음 네 장면이 같은 자리에서 죽는다.

- 신규 프로젝트의 확인 전 feasibility 조사
- adopt가 긴 대표 흐름을 추적하는 동안의 evidence table
- 큰 국소 변경이 카드 네 필드로 좁혀지기 전의 비교와 frontier
- research card가 끝났지만 구현 종료를 기다리지 않는 결론의 착지

구조는 이미 current owner, capsule, recursive task tree, state projection을 가진다. 첫 번째로 부족한
것은 새 knowledge object가 아니라 **기존 작업 생애가 시작되는 시점과 닫히는 게이트**다. 두 번째는
JGNote급 current corpus와 product/architecture 상세를 같은 방식으로 내릴 수 있는 owner-anchored
재귀 지식 주소다. runtime 지원은 필수이고 실제 child 생성만 조건부다. 이 둘을 별도 문제로 다뤄야
단일 mega-log와 과잉 knowledge graph를 모두 피할 수 있다.

### 6.4 최초 제안 keep / reframe / reject

| 판정 | 최초 제안의 항목 | 재기획 결과 |
|---|---|---|
| keep | current truth, 작업 중 사고, 당시 evidence, machine state의 역할 분리 | 네 역할은 맞지만 모두 기존 객체가 수행한다 |
| keep | HANDOFF 비확장, fail-closed exact read, 작은 작업 비용 불변 | 그대로 수용 기준으로 둔다 |
| keep | fixture와 사망 실험을 구현보다 먼저 수행 | 첫 pilot로 올린다 |
| reframe | change cycle | 새 index가 아니라 기존 재귀 트리 단위의 시간 확장으로 본다 |
| reframe | plan/spec | 진행 중 계획은 재귀 card tree와 로그, 확정 설계는 현재 owner/K node, 실행 경계는 카드가 나눠 가진다 |
| reframe | evidence | 새 record가 아니라 카드 결과·verify·capsule에 기존 재현 규율을 적용한다 |
| defer | architecture/domain 축 | devflow 실사용에서 독립 소비자와 종료점이 관찰될 때만 다시 연다 |
| reject | evidence 5상태와 supersession layer | DD-77의 실측 기각을 되살리고 cleanup owner를 다시 만든다 |
| reject | 8단계 명명 lifecycle | 활동을 상태로 만들고 방법론 어휘와 상태 폭증을 낳는다 |
| reject | 수기 node index와 typed edge | 수기 색인 금지와 자기 커밋 없는 승객 의무가 된다 |
| reject | Lite/Standard/Research mode 표 | 현행 tweak보다 Lite가 무거우며 사람 선택 분기를 늘린다 |
| reject | orphan 등 새 layer를 위한 일괄 검사 | 감시 대상을 만든 뒤 감시자를 만드는 순환이다 |

## 7. 목표 모델: 현재 지식 트리 하나 + 작업 트리 하나

새로운 범용 cycle 객체를 만들지 않는다. 사람에게는 조사·기획·설계·구현·검증이 반복되는 하나의
사이클처럼 보이지만, 디스크에서는 다음 두 생애만 지속한다.

```text
현재 지식(current truth)
  product.md ── product/K-... ── K-.../K-...
  arch.md    ── arch/K-...    ── K-.../K-...
  design.md  ── design/K-...  ── K-.../K-...
  capabilities/02-property.md
    └─ 02-property/K-... ── K-.../K-...

진행 중 작업(work in progress)
  00-project/ 또는 02-<capability>/ 아래의 재귀 task folder
    기존 research card 또는 일반 task card
      progress log + completion signal
```

- **현재 지식 트리**는 지금 참인 계약, 제약, 근거와 사용 조건만 소유한다. Git과 닫힌 카드는 역사를
  소유한다.
- **작업 트리**는 아직 확정되지 않은 질문, 비교, 실험, 계획과 실행을 소유한다. 작업 종류가 달라도
  점유·체크포인트·완료 신호·커밋이라는 같은 생애를 쓴다.
- **상태와 evidence**는 제3의 저장층이 아니다. 상태는 두 트리에서 계산하고, evidence는 카드 결과,
  verify, capsule의 source basis와 재현 명령에 둔다.
- **두 트리는 서로 mirror하지 않는다.** knowledge node가 20개여도 작업이 없으면 card는 0개이고,
  하나의 횡단 작업이 여러 knowledge node를 읽어도 synthesis branch는 하나다. 작업의 `Read first`와
  closure landing만 두 plane을 연결한다.

product, adopt, arch, design의 전문성은 유지한다. 다만 이들을 프로젝트 수명에 한 번만 지나가는
단계로 보지 않고, 현재 scope에서 질문을 만들고 확정 지식의 소유 문서를 갱신하는 authoring lens로
사용한다. split은 모든 기획을 대신하지 않는다. 충분히 좁혀진 질문·계획·구현을 카드 트리로 나누는
operation이다.

### 7.1 작은 작업과 큰 연구는 모드가 아니라 관찰된 복잡도로 갈린다

사용자가 Lite/Research 같은 모드를 고르지 않는다. 알려진 작은 수정은 현행 tweak처럼 카드 0개와
커밋 하나로 끝날 수 있다. 다음 사건이 실제로 생길 때만 기존 트리가 분기한다.

- 독립적으로 완료할 수 있는 두 번째 질문이나 결과가 생긴다.
- 서로 다른 작업자·소유자·검증 표면을 가져야 한다.
- 다음 세션이 현재 대화 없이 이어받아야 한다.
- 한 로그가 150줄 또는 약 8 KiB를 넘어가며 독립 결론이 섞이기 시작한다.
- 확정 결론 하나가 카드 밖의 장기 소비자를 얻는다.

앞의 네 조건은 작업 트리 분기 신호이고 마지막 조건은 현재 지식으로 즉시 착지할 신호다. 크기만
커졌다는 이유로 지식 노드를 만들지 않으며, 작은 수정에 빈 research/spec 구조를 만들지 않는다.

### 7.2 작업 scope의 최소 anchor

현행 tree root는 `01-foundation`과 확정된 product capability만 받으므로 Layer 0 이전 질문과 project
전체·여러 capability를 관통하는 synthesis를 놓을 주소가 없다. 새 작업 종류를 늘리지 않고 기존
tree에 **예약 project-scope anchor 하나**를 둔다. 이것은 새 파일 종류는 아니지만 새 기계 scope
1종이라는 비용을 숨기지 않는다.

```text
devflow/tree/
  00-project/       # Layer 0 owner 또는 project-level 공통 owner에 anchor된 research/synthesis
  01-foundation/    # 현행 의미 유지
  02-<capability>/  # 현행 capability work
```

작업 anchor는 사례 목록이 아니라 **가장 가까운 current-knowledge owner**로 정한다.

1. 한 capability 또는 그 아래 K node만 소유하면 그 capability work folder에 둔다. modal/list처럼
   깊은 하위 작업도 별도 root를 만들지 않고 카드의 `Read first`가 exact K node를 가리킨다.
2. product/arch/design 또는 여러 capability의 가장 가까운 공통 owner가 project라면 `00-project`에
   research/synthesis를 둔다.
3. project synthesis가 구현 경계를 확정하면 실제 코드 카드는 각 capability folder에 열고, 00의
   synthesis card가 결과와 current landing을 닫는다.
4. foundation 자체의 공유 계약 구현만 현행 `01-foundation`에 둔다.

따라서 `00-project`는 구현 코드를 직접 소유하지 않고 기존 research card만 사용한다. plan과 synthesis는
그 카드의 역할이다. 이 규칙은 project 전체, owner 없는 횡단, 여러 capability 혼합, 단일 capability,
깊은 하위 파트를 같은 “nearest owner” 원리로 포괄한다.

이 예약 scope는 현행 capability처럼 취급하면 안 된다. product↔tree correspondence, capability
baseline 자동 개봉, children-done의 capability verify에서 제외되고, `setup.no-product`보다 먼저
비구현 research claim을 복구할 수 있어야 한다. 따라서 이 후보는 “기존 객체만 재사용”이라는 말로
공짜 취급할 수 없으며 DD-73, split root, state zone 순서를 움직이는 하나의 명시적 seam이다. 이
연구안의 목표 경로는 `00-project`로 고정하지만, 13절 fixture가 네 면제의 producer/consumer/test를
닫기 전에는 runtime 계약으로 채택하지 않는다.

### 7.3 작업 트리의 합성과 종료

하나의 조사에서 여러 frontier가 생기면 기존 card를 폴더로 승격하고 각 질문을 child card로 만든다.
폴더 자체에 새 본문을 두지 않는다. 대신 child 중 하나를 `synthesis` 작업으로 두어 다음을 명시적으로
소유하게 한다.

1. 형제 결과를 읽고 충돌을 해결한다.
2. 확정·기각·미결을 구분한다.
3. 확정 내용을 canonical owner/K node에 착지한다.
4. 후속 구현 카드와 검증 표면을 연다.
5. 모든 결론의 처분을 확인한 뒤 branch를 닫는다.

이 convention은 새 문서 종류가 아니다. 기존 research card가 맡는 plan/synthesis 역할이다. JGNote 규모 fixture에서
부모 방향이 실제로 유실되면 그때만 카드 헤더로부터 한 단계 child·상태·다음 경로를 계산하는 투영을
추가한다. 사람이 유지하는 별도 summary/index는 만들지 않는다.

세션 종료는 branch 종료가 아니다. 다음 세션은 긴 HANDOFF 대신 상태 출력 → 활성 branch → 정확한
card → 필요한 현재 owner 순서로 읽는다. HANDOFF는 현재 계약대로 계산할 수 없는 최신 차이와 다음
exact path만 전달한다.

## 8. 실제 저장 계약과 부피 예산

큰 틀보다 이 계약이 실제 성공을 좌우한다. “정리한다”는 말로 내용을 줄이지 않고, 각 종류가 무엇을
보존하고 언제 분기하며 무엇을 기본 읽기에서 제외하는지 고정한다.

### 8.1 카드와 진행 로그

카드는 하나의 질문 또는 완료 신호와 하나의 커밋을 소유한다. 카드 종류는 현행 research card와 일반
task card 둘을 유지한다. plan/synthesis는 새 종류가 아니라 research card의 목적이다. 둘 다 같은 진행
로그를 쓰되, 사람과 AI가 읽는 결론 산문은 기존 capsule의 인식 어휘를 재사용해 다음처럼 구분한다.

- 확인: 주장, 출처/실험 좌표, 제한, 직접 소비자
- 추정: `(conjecture: ...)`로 표시하고 확인 조건을 둔다.
- 충돌: `[dispute: ...]`로 양쪽 근거와 판정자를 둔다.
- 종합: `(synthesis@...)`로 원본 child/source를 가리킨다.
- 기각: 대안, 기각 이유, 다시 열 조건을 남긴다.

이 결론 어휘는 도구가 파싱하는 다섯째 progress 형식이 아니라 산문 규율이다. 현행 progress log의
기계 형식 4종 봉인은 유지한다. 14절의 “로그에만 남은 확정 사실 0”은 branch 폐쇄 때 synthesis
writer와 reviewer가 판단하며, 도구가 의미를 판정한다고 가장하지 않는다.

로그 150줄 또는 약 8 KiB는 삭제·요약 신호가 아니라 **분기 검토 신호**다. 두 번째 독립 frontier가
있으면 즉시 별도 card로 나눈다. 240줄/24 KiB는 카드 자체의 열람 한도가 아니라 **한 카드 실행에서
선택해 여는 capsule 본문 합계의 현행 hard budget**이다. 카드 로그의 soft trigger는 단계 1에서 별도로
측정한다. 형제 7개 초과는 기존 중간 폴더 규칙을 쓰고, 깊이 4단계 초과는 범위 자체를 다시 검토한다.

확정 사실은 카드 종료까지 기다리지 않는다. 장기 소비자가 생기는 즉시 owner 문서에 착지하고,
로그에는 착지 경로와 커밋만 남긴다. 여러 능력 소유 결론이 한꺼번에 생기면 marker 한 건마다 tree를
중단하지 않고, 같은 owner의 다음 design refresh batch 하나가 누적 소비한다. DD-91의 glossary와
Concepts 배치가 이 의미론의 선례다. 따라서 닫힌 100 KiB 로그는 읽지 않아도 현재 계약을 재개할 수
있다. 로그에만 남은 확정 사실은 0이어야 한다.

### 8.2 현재 지식 노드

| 저장 위치 | 소유하는 내용 | 기본 읽기 | 분기 기준 |
|---|---|---|---|
| product/arch/design owner | 프로젝트 전체의 현재 경계·횡단 계약 | 해당 orientation 또는 매-card 불변식대로 | 독립 소비 주제는 same-stem K child로 위임 |
| capability owner | capability의 목적·경계·설계·검증 구역 | domain 진입과 매핑 card 실행 때 | 독립 소비 주제는 capability K child로 위임 |
| recursive K knowledge node | use-when이 분명한 현재 지식 단위와 source basis | direct-child header 후 선택 | 독립 owner·사용 조건·closure를 가진 하위 주제 |
| external/project source | 방대한 원문 조사·plan·report·architecture와 역사 자료 | K node/card의 exact source로만 | current authority가 아니라 근거 |
| glossary | 정본 용어 정의와 사용처 | 필요한 용어만 | 의미가 아니라 용어 단위 |

이 표의 “기본 읽기”는 **새 작업 orientation에서 첫 진입 경로**만 뜻한다. 일반 task card를 실행할 때
product.md·arch.md·code-style.md와 매핑된 capability를 매 카드 다시 읽는 현행 불변식은 줄이지 않는다.
장래에 그 비용을 줄이려면 동일 질문의 clean-session before/after 검증으로 별도 결정을 열어야 한다.

AI가 폴더명을 추측하지 않도록 각 devflow current node의 원본에서 최소 주소 정보를
계산한다: `exact path`, `role/authority`, `open when`, `direct children`, `writer/refresh event`,
`freshness`. 이 정보는 사람이 별도 index에 다시 쓰지 않는다. capsule의 현재 첫 두 줄(`무엇·언제
열지`, `about`)은 이 주소 계약의 좋은 최소 사례다. node 본문은 자유로운 산문을 유지하고, AI는 주소
정보로 근처까지 온 뒤 실제 문맥을 추론한다.

이 여섯 요소를 외부 문서에 요구하거나 그 문서를 current tree로 승격시키지 않는다. 외부 문서는
source로 남고, 현재로 소비할 synthesis만 canonical owner/K node에 착지한다. 프로젝트가 generator와
CI freshness를 가진 자체 정본 체계를 이미 운영하면 adopt가 그 체계를 source authority로 인정할 수
있지만, devflow가 수기 open-when 표를 하나 더 만들어 shadow canon을 만들지는 않는다.

capability 약 185줄, K node 120줄 soft cap은 “그 이상을 버린다”는 뜻이 아니다. 본문을 줄이기 전에
독립 소비자와 use-when을 찾고, 없으면 밀도 높은 같은 문서를 유지한다. 있으면 같은 K node를 한 단계
더 만든다. 모든 K node는 실제 source basis와 exact source coordinate를 가져야 한다. durable research
card 결과를 source로 허용할지는 기존 capsule 입력 경계를 움직이는 별도 결정이며, 허용한다면 그
card의 binding commit과 exact line이 필요하다. 아직 증명되지 않은 생각은 작업 카드에 남는다.

### 8.3 재귀 지식 주소는 target capability이고, node 생성만 조건부다

현행 capsule은 capability 아래 한 단계다. JGNote의 property 문서군만 약 1.16 MiB이고 12 KiB 단위로
약 97개다. 한 capability의 capsule 100개 compact header도 약 21 KiB가 되어 24 KiB 읽기 예산에 거의
닿는다. 더 중요한 것은 product 조사와 architecture 상세에는 capsule owner 자체가 없다는 점이다.
flat capability capsule만으로는 사용자가 요구한 전 범위의 지식 tree를 보장할 수 없다.

따라서 **runtime이 같은 K knowledge node를 기존 canonical owner 아래에서 재귀적으로 지원하는 것**은
최종 설계의 필수 capability로 둔다. 프로젝트마다 node를 실제로 만드는 일만 조건부다.

```text
project/product.md
project/product/
  K-001-market-feasibility.md

project/arch.md
project/arch/
  K-001-frontend-boundary.md
  K-001-frontend-boundary/
    K-002-state-synchronization.md

project/capabilities/02-property.md
project/capabilities/02-property/
  K-003-ui-contract.md
  K-003-ui-contract/
    K-004-filter-state.md
    K-005-edit-session.md
```

- product/arch/design/capability owner는 자신의 current subtree writer와 refresh event를 정한다.
- 부모 node는 자식 요약을 복제하지 않고 자식 사이의 공통 불변식만 소유한다.
- 도구는 파일명·헤더에서 direct child의 title/use-when/status만 한 단계 계산한다.
- AI는 canonical owner → 선택 child → 그 child의 source 순서로 열고 전체 subtree를 기본 읽지 않는다.
- 사람이 관리하는 별도 index, 임의 typed edge, 새로운 evidence 객체는 추가하지 않는다.
- 크기만으로 node를 만들지 않는다. 독립 consumer + 독립 closure + 유지할 owner/event가 모두 있을 때
  한 단계 분기한다. 이 조건이 없으면 큰 원문은 source로 남고 current synthesis만 부모에 둔다.

이 방식은 작은 프로젝트의 node 수를 0으로 유지하면서 JGNote급 프로젝트의 임의 깊이를 보장한다.
“재귀 기능을 지원한다”와 “모든 프로젝트에 깊은 폴더를 만든다”를 구분하는 것이 핵심이다. 단계 1
fixture는 이 capability를 생략할지 결정하는 게 아니라, node 생성 판단과 한 단계 projection이 유실·
오독 없이 작동하는지를 결정한다.

### 8.4 트리 유지보수 계약

재귀화를 열더라도 관계를 AI의 기억에 맡기지 않는다.

- parent/child는 같은 stem의 파일과 폴더에서만 파생한다. 수기 parent id와 관련 링크를 만들지 않는다.
- K 번호는 canonical owner subtree 전체에서 유일하고 재사용하지 않는다. 같은 owner 안에서 이동해도
  번호를 유지하며 projection이 현재 path를 찾는다. owner가 바뀌는 이동은 새 소유 결정과 source/
  consumer 갱신을 요구한다.
- 이동·이름 변경은 source/consumer exact path와 projection freshness를 같은 커밋에서 검증한다.
- 부모는 child 내용을 다시 요약하지 않는다. 공통 계약만 부모에 쓰고 세부 사실은 leaf 한 곳에 쓴다.
- leaf가 여러 소비자를 얻어 공통 계약이 되면 부모로 승격하고 원 leaf에서는 제거한 뒤 history로
  추적한다. 복제 링크를 남기지 않는다.
- 도구는 malformed header, duplicate K, dangling source/consumer, same-stem 불일치와 opening-budget
  초과를 실패시킨다. 의미적 소유가 맞는지는 fixture와 review가 판정한다.

즉 기계는 tree의 형태와 주소 무결성을 보장하고, AI는 의미적 경계를 판단한다. 둘의 책임을 뒤집어
기계가 의미 분류까지 강제하거나 AI가 경로 무결성을 기억하게 만들지 않는다.

## 9. JGNote 문서를 목표 구조에 넣어 본 결과

문서 제목만 재분류한 것이 아니라 가장 큰 문서들의 내부 역할을 분해했다. 핵심은 모든 문장을 capsule로
잘게 쪼개는 것이 아니라 **현재도 소비되는 내용과 당시 작업의 역사를 분리하는 것**이다.

| JGNote 문서/내용 | 목표 저장 위치 | 보존 방식 |
|---|---|---|
| `property-mockup-handoff.md` 상단 correction 연쇄 | 현재 owner를 직접 갱신 | 낡은 문장 위에 새 정정을 쌓지 않음 |
| 같은 문서의 실패 장면·17회 작업 경과 | 닫힌 card branch와 Git | 현재 지식에는 재사용할 invariant/trap만 추출 |
| 같은 문서의 사용자 요구·경계 | product 또는 property capability | 현재 계약으로 유지 |
| 같은 문서의 실제 결정 | 조건을 만족하면 ADR, 국소 계약이면 capability/K node | 대안·이유·재검토 신호 보존 |
| 같은 문서의 open item·중단 조건 | 명명된 open card, provisional 표시, verify의 `unverified` | 다음 세션의 정확한 frontier |
| `backend-auth-foundation.md`의 repository fact·실험 | research card source/result | 재현 좌표와 제한 보존 |
| 같은 문서의 schema·placement·request lifecycle | 구현 전에는 research card의 plan 역할, 확정 후에는 arch/auth owner 또는 K node | 시간축 혼합 방지 |
| 같은 문서의 17개 ADR | 독립 결정 조건을 만족한 것만 ADR owner | 제안 plan 속에 영구 매장하지 않음 |
| `property-design/00-implementation-contract.md` | source 문서, 확정 내용은 property Design zone/K node | 네 설계 원본의 충돌을 해소하되 devflow current owner는 명확히 분리 |
| `legacy-property/README.md` 수동 색인 | K/card 헤더에서 계산한 한 단계 projection | 별도 수기 목차의 drift 제거 |
| root/frontend/backend/verification architecture | source 문서, 현재 synthesis는 arch owner 아래 K subtree | 고정 축 없이 이 프로젝트에서 필요한 주제만 생성 |
| `domains/registry.json`·generated maps | machine source → generated projection → CI freshness | 링크 수가 아닌 실제 consumer로 생존 판정 |

독립 부피 검토는 `property-mockup-handoff.md` 약 146.6 KiB 중 약 65%, 즉 약 95 KiB를 현재 truth가
아니라 당시 작업 경과로 분류했다. 나머지도 하나의 50 KiB 요약으로 줄이는 대신 product,
architecture/ADR, property capability/K node, provisional/open card, verify로 **용도별 착지**할 수 있었다.
이 분해는 내용을 지우는 것이 아니다. 기본 재개에서 역사를 빼고, 필요 시 card/Git exact path로
도달하게 만드는 것이다.

### 9.1 예시 목표 트리

아래 이름은 JGNote에 강제할 migration안이 아니라, 동일한 양을 devflow가 받아낼 수 있는지 확인하는
fixture 모형이다.

```text
project/
  product.md
  product/
    K-001-market-feasibility.md
  arch.md                          # root와 권위·열기 경로
  arch/
    K-001-frontend-boundary.md
    K-002-backend-boundary.md
    K-003-verification-contract.md
  capabilities/
    02-property.md
    02-property/
      K-001-ui-contract.md
      K-001-ui-contract/
        K-002-filter-state.md
        K-003-edit-session.md
      K-004-data-lifecycle.md
      K-005-verification-traps.md
    03-auth.md
    03-auth/
      K-001-request-lifecycle.md
      K-002-provider-constraints.md
tree/
  02-property/
    02.4-property-evolution/
      02.4.1-capture-current-contract.md
      02.4.2-investigate-filter-state/
        02.4.2.1-derive-state-model.md
        02.4.2.2-reproduce-failure-scenes.md
        02.4.2.3-synthesize-and-land.md
```

frontend/backend는 보편 고정 축이 아니라 이 프로젝트의 arch owner 아래에서 독립 소비자를 가진 K
node다. 다른 프로젝트는 ML pipeline, device firmware, market validation 같은 주제를 같은 규약으로
소유할 수 있다.

### 9.2 유실 없이 분할됐는지를 판단하는 방법

원문을 전부 옮겼다는 사실만으로 성공이 아니다. 다음 disposition을 모든 의미 단위에 붙여 대조한다.

- `current`: 현재 canonical owner/K node의 exact path
- `history`: 닫힌 card/Git의 exact path
- `decision`: 현재 결정 owner와 다시 열 조건
- `open`: 활성/provisional card와 stop condition
- `verification`: 실행 명령·결과·`unverified` 사유
- `duplicate/stale`: 권위 owner를 가리킨 뒤 제거 가능한 후보

원문 단락 수와 새 파일 수를 1:1로 맞추지 않는다. 대신 확정 결정, 기각 대안, 재현 장면, 추정,
중단 조건, 함정이라는 의미 범주의 회수율을 재검증한다. 이 보고서의 fixture 기준은 13절에 둔다.

## 10. AI 운용 계약: 목적에서 주소로, 주소에서 필요한 깊이로

전체를 관통하는 개념은 **시간을 가진 의미 주소(semantic address)**다. 지속할 가치가 있는 각 내용은
“무슨 파일 종류인가”보다 다음 세 질문에 답해야 한다.

1. 지금 이 내용은 확정된 현재 지식인가, 진행 중 사고인가?
2. 어느 범위가 이 내용을 책임지고 누가 실제로 소비하는가?
3. AI는 어떤 목적일 때 이 주소를 열고, 바뀌면 어디를 갱신하는가?

이 답이 하나면 파일 깊이는 구현 세부다. 답이 둘이면 내용을 나눠야 하고, 답이 없으면 새 durable
문서를 만들면 안 된다. 이것이 “한 사실 한 집”을 큰 프로젝트에도 적용하는 일반 원리다.

### 10.1 읽기 진입은 두 종류다

**활성 작업 재개(resume/handoff)**는 방금 하던 사고와 실행을 이어받는다.

```text
state projection → 활성 branch/card → 카드가 명시한 current owner → 필요한 source
```

HANDOFF는 이 경로에서 계산할 수 없는 dirty state, 다음 exact action, 외부 차단만 보충한다. 이전 세션의
전체 회고를 다시 현재 지식처럼 읽지 않는다.

**새 작업 진입(orientation)**은 과거 작업이 아니라 현재 프로젝트/도메인을 이해하고 새 질문을 연다.

```text
project identity·권위 → 선택 범위의 child headers → current owner → 새 work branch
```

- 프로젝트 전체 변경은 product/root architecture에서 시작한다.
- domain/capability 유지보수는 그 capability와 선택한 capsule에서 시작한다.
- 횡단 변경은 공통 owner에서 시작해 영향받는 child header만 연다.
- 이유를 다시 심사하거나 회귀를 재현할 때만 닫힌 card/source로 내려간다.

따라서 오래된 HANDOFF가 없어도 새로운 domain 작업을 시작할 수 있고, 반대로 현재 truth 전체를 다시
읽지 않아도 중단된 작업을 이어갈 수 있다. 두 진입을 한 `resume` 동작에 뭉개지 않는 것이 중요하다.

### 10.2 쓰기 위치는 내용의 확실성과 소비 범위로 정한다

- 아직 비교·실험·협의 중이면 현재 work card에 쓴다.
- product owner가 아직 없는 Layer 0 이전의 사람 확정은 기명 journal decision line에 착지하고,
  product 확인 묶음이 이를 수확해 owner에 반영한 뒤 삭제한다.
- 확정됐고 한 capability만 소비하면 그 capability 또는 그 아래 capsule에 쓴다.
- 여러 capability가 공유하는 현재 계약이면 가장 가까운 공통 current owner에 쓴다.
- 프레임워크/도메인 특유의 방대한 원문은 external source로 두고, 현재 synthesis는 가장 가까운
  canonical owner/K node에 쓴다.
- 단순 경과와 폐기된 시도는 card/Git에 남기고 기본 현재 읽기에서 제외한다.
- 알맞은 owner를 결정할 수 없으면 그 사실을 open question으로 남기고 임의의 “misc/research” 문서를
  만들지 않는다.

에이전트의 추론 능력을 schema로 대체하지 않는다. tree와 헤더는 올바른 근처까지 안내하고, 정확한
문맥에서의 판단은 AI가 한다. 드리프트 방지는 많은 상태명이 아니라 권위 순서, exact source, 한 단계
projection, 한 writer, 완료 전 disposition 검사를 통해 달성한다. 경로가 깨지거나 header와 본문이
불일치하면 전체 검색으로 조용히 우회하지 않고 route repair를 요구한다.

### 10.3 사람·팀의 유연성

사람은 자연어로 프로젝트 전체, domain, 특정 기능, 실패 장면, 아이디어 또는 방금 하던 작업 중
어디서든 시작할 수 있다. AI가 이를 current scope와 work scope로 해석한다. 사용자에게 문서 종류나
작업 모드를 먼저 고르게 하지 않는다.

팀에서는 worker가 겹치지 않는 child card를 점유하고, synthesis/현재 owner에는 한 writer만 둔다.
같은 domain의 즉시 후속 조사는 맥락이 신선한 worker를 재사용하되, 독립 판정이나 오염되지 않은
검토는 새 context가 맡는다. 장시간 누적되어 출처가 흐려진 worker는 exact card·source packet으로
교체한다. 모델 이름과 비용 정책은 지식 schema가 아니라 가변 orchestration 정책에 둔다.

## 11. 기존 결정과 rejection을 통과하는가

이 문서는 결정 변경안이 아니라 다음 구현 기획의 근거다. 구현 전에 움직이는 subject의 원문을 다시
열고 기록된 이유를 직접 반증해야 한다.

### 11.1 그대로 보존하는 결정

- **DD-28/33**: 무소유 note layer를 만들지 않고, 확정 지식은 실제 read path에 즉시 착지한다.
- **DD-42/43**: capability의 예상 설계와 실제 검증 구역을 유지한다.
- **DD-48/56/59**: HANDOFF 전 durable landing, 닫힌 작업 비기본 읽기, 최소 HANDOFF를 유지한다.
- **DD-76/78**: capsule의 provenance, compact projection, hard opening budget을 유지한다.
- **DD-77**: current 문서는 현재만 말하고 이전 현재는 Git/작업 역사에 둔다.
- **DD-91**: glossary와 capability projection의 exact routing을 유지한다.

### 11.2 실제로 다시 열어야 하는 결정

- **DD-67**의 answer-only research는 무제한 원문 덤프를 막는 이유가 맞다. 이 제안은 새 raw-research
  파일을 만들지 않는다. 다만 세션을 넘기는 조사도 existing card progress를 사용할 수 있게 범위를
  넓혀야 하므로 “대화 안에서만 조사한다”는 경계가 있다면 그 부분을 반증해야 한다.
- **DD-69/73**은 arch가 capability 문서를 만든 뒤 첫 tree를 연다. product 확인 전 또는 brownfield
  추적 중에 research card를 허용하려면, 미확정 설계로 구현을 시작하지 못하게 한 DD-73의 safety
  reason을 보존하면서 **비구현 research tree만 먼저 여는 predicate**를 증명해야 한다.
- K node를 product/arch/design/capability owner 아래로 일반화하려면 **DD-42/43/76/78**의 위치·깊이·
  projection·읽기 예산을 함께 다시 열어야 한다. flat 실패 여부가 아니라 이 재설계의 필수 target이므로
  단계 1 fixture가 node 생성 판단과 backward compatibility를 증명해야 한다.
- 현행 capsule의 writer는 arch/adopt design-zone writer이고 verify는 쓰지 않는다
  (`baseline-predicates.md:182-185`). 작업 중 확정된 상세 지식을 즉시 capsule에 착지시키려면 work가
  직접 쓰게 할지, 기존 writer에게 명명된 refresh를 요청할지 결정해야 한다. 한 writer 원칙과 source
  basis를 보존하는 후자를 먼저 fixture로 검증한다. product·arch·design·capability subtree 각각의
  writer/refresh event도 기존 canonical writer에 귀속시켜야 하며 generic knowledge writer를 만들지
  않는다.
- 확정 결과의 batch landing은 **DD-88**의 “owner마다 설계 전용 진입을 반복하는 비용” 재검토 조건을
  실제로 건드린다. marker별 선점은 유지하되 같은 owner의 대기 항목을 한 refresh에서 소비하는 것이
  순서·사망 복구를 깨지 않는지 별도 subject로 증명해야 한다.
- 예약 `00-project`는 문서 종류가 아니라 machine scope 1종이다. correspondence, baseline 자동 개봉,
  capability verify, `setup.no-product`보다 research claim을 먼저 복구하는 zone 순서라는 네 면제를
  정확히 열어야 하며, 하나라도 암묵적으로 처리하면 도입하지 않는다.

### 11.3 되살리지 않는 rejection

- **DR-29**의 날짜/세션 bundle: 작업 branch는 목표와 완료 신호로 식별한다.
- **DR-25**의 `related records`: 임의 관련 링크 대신 tree parent와 실제 source/consumer만 둔다.
- **DR-31**의 전체/최근 progress 기본 읽기: current owner와 active card만 기본으로 연다.
- **DR-43**의 별도 verification hierarchy: verify는 capability/architecture의 기존 소비면에 둔다.
- **DR-49/50**의 안전하지 않은 prompt fragmentation: 투영은 source에서 계산하고 fail-closed한다.
- **DD-74/75가 만들었던 별도 record layer**: DD-77을 뒤집는 새 evidence 생애를 만들지 않는다.

### 11.4 현행에서 별도로 고쳐야 할 두 seam

1. `marker.glossary-term`은 상태 도구와 principles가 생산·라우팅하지만 resume route 표에 소비 행이
   없다. 실패 장면은 glossary 갱신 marker가 남은 세션에서 resume이 exact next action을 설명하지
   못하는 것이다. 좌표는 3.1에 기록했고 이번 조사에서는 `skills/**`를 수정하지 않는다.
2. greenfield capsule overflow 규칙과 “source basis 비어 있지 않음/원본 source만 허용”은 미확정
   설계를 capsule로 조기 승격시키려 할 때 충돌한다. 이 제안에서는 source가 생기기 전까지 card에
   남기므로 우회하지 않지만, 실제 규칙 문구는 구현 round에서 fixture로 확인해야 한다.

## 12. 대안 비교와 최종 선택

| 대안 | 실제 부피·드리프트 결과 | 판정 |
|---|---|---|
| research card의 한 progress log에 모두 누적 | 100 KiB급 mega-log가 되고 질문·현재 결론·경과가 다시 섞임 | 기각 |
| 세 개 지식 축 + 별도 cycle + evidence 생애 + typed graph | 문제는 넓게 덮지만 새 객체·상태·edge의 유지 의무가 원 문제보다 큼 | 기각 |
| 현재 지식 plane + 재귀 work plane, 확정 즉시 착지 | 현행 객체를 재사용하되 owner 없는 작업에 예약 project scope 1종이 필요; pre/post-project·국소/횡단 작업을 같은 원리로 포용 | 채택 |
| 위 구조 + owner-anchored recursive K | runtime은 임의 깊이를 지원하고 프로젝트별 node 생성만 관찰된 의미 경계에서 수행 | 채택 |
| 범용 knowledge graph/DB | 임의 query는 강하지만 파일/Git 이식성, 사람 수정성, 단일 정본을 잃음 | 기각 |

선택 이유는 객체 수가 적어서만이 아니다. **작업의 시간축과 지식의 의미축을 직교시키는 것**이 조사,
기획, 아키텍처, 구현, 검증, 유지보수, handoff, 새 domain 진입을 모두 관통한다. 작업이 끝나면 시간축은
기본 읽기에서 사라지고 현재 의미 주소만 남는다. 프로젝트가 커지면 의미축만 필요에 따라 깊어진다.
작은 프로젝트는 두 축 모두 한 파일/한 카드로 축약된다.

owner-anchored recursive K는 이 원리를 보존하는 유일한 지식 구조 확장이다. 기존 capsule 문법 하나를
반복하며, 매 단계에서 AI가 다음 child를 선택할 수 있다. 반대로 수기 graph와 여러 투영은 쓰기 위치를
다시 모호하게 만들므로 금지한다.

## 13. 1차 이행안과 그 한계

이 절은 최초 재설계가 과설계를 제거한 뒤 세운 1차 순서다. 17~20절의 완성도 재검토에서 intent와
kernel을 먼저 동결해야 한다는 공백이 확인됐으므로 **활성 실행 plan은 21절**이다. 아래 fixture와
vertical slice 원리는 보존하지만 이 절만으로 구현을 시작하지 않는다.

이 보고서의 모든 분류어를 runtime schema로 옮기지 않는다.

| 지위 | 이 문서의 어휘 |
|---|---|
| 현행 runtime을 그대로 사용 | research/task card, folder promotion, progress 4형식, marker, current owner, capsule |
| fixture에서만 쓰는 관찰표 | G1~G6, disposition 6종, 150줄/8 KiB 분기 신호, 40 KiB 초기 packet 목표 |
| 통과하면 runtime 후보 | 예약 project scope, 의미 기반 분기/쓰기 판단, batch landing, owner-anchored K와 direct-child projection |

fixture 전용 어휘는 결과를 채점하는 언어이지 에이전트가 매 작업에 작성할 필드가 아니다. runtime으로
승격할 때도 기존 산문 판단이나 기존 marker로 표현되지 않는 최소 항목만 정본화한다.

### 단계 1. JGNote 규모의 무변경 fixture로 논리부터 반증한다

실제 JGNote를 이동하지 않고 동등한 synthetic corpus와 정답표를 만든다. 정답표는 최소 다음을
포함한다.

- G1 확인된 결정 12개
- G2 기각 대안과 재검토 신호 8개
- G3 재현 가능한 실패 장면 6개
- G4 추정 10개(그중 4개는 일부러 확정처럼 서술)
- G5 중단/완료 조건 3개
- G6 장기 유지보수 함정 4개

신규 3D feasibility 조사, brownfield adopt, 한 domain의 큰 고도화, 여러 domain 횡단 변경, 작은 tweak,
팀 병렬 조사를 각각 수행한다. 작업자를 (a) frontier 중간, (b) 결론을 current owner에 착지한 직후,
(c) Layer 0 확인 직전에 강제 종료하고 fresh AI가 이어받게 한다. 같은 의미를 가진 corpus를 두 배로
복제해 초기 읽기량이 전체 크기에 비례하는지도 본다.

이 단계는 세 가지 구조를 서로 비교한다: 현행, card tree+즉시 착지, 여기에 owner-anchored recursive
K를 더한 구조. flat fixture가 통과해도 final runtime의 재귀 지원을 제거하지 않는다. 대신 작은
프로젝트에서 child 0개가 실제로 유지되는지를 확인한다.

### 단계 2. 작업 생애의 가장 좁은 seam만 구현한다

단계 1이 통과하면 existing card/tree/progress를 Layer 0 이전 조사와 post-start 재기획에도 사용할 수
있게 한다. 새 cycle index나 evidence 파일은 만들지 않는다.

1. product/adopt/arch가 미결 질문을 비구현 research branch로 지속할 수 있게 한다.
2. 두 번째 frontier에서 card를 분기하고 synthesis child를 만든다.
3. work 종료가 아니라 사실 확정 시점에 current owner로 착지한다.
4. split/work/verify는 좁혀진 실행 카드에서 지금의 계약을 유지한다.
5. resume은 활성 작업 재개와 새 범위 orientation을 구분해 route한다.

예약 project scope를 쓰는 pilot은 새 machine scope 1종과 정확히 네 구조 면제를 함께 선언한다:
product↔tree correspondence 제외, capability baseline 자동 개봉 제외, children-done capability verify
제외, `setup.no-product`보다 비구현 research claim/recovery를 먼저 보는 zone 순서다. 이보다 더 많은
예외가 필요하면 seam이 좁다는 가정을 폐기한다.

이 단계는 DD-73의 구현 안전, DD-88의 batch 비용과 `marker.glossary-term` route 수리를 각각 별도 결정
좌표로 다뤄야 한다. before/after clean Codex 질문을 같게 유지해 이해도가 떨어지면 배포하지 않는다.

### 단계 3. owner-anchored 재귀 지식 주소를 완성한다

단계 2가 작업 생애를 증명하면 product/arch/design/capability owner 아래에서 같은 K node와
direct-child projection을 지원한다. 기존 파일을 일괄 이동하지 않고, 서로 다른 owner 표본을 복사한
fixture에서 다음 순서로 검증한다.

1. role/currentness/consumer/source inventory를 checkpoint한다.
2. disposition table을 만들고 자동 분할은 하지 않는다.
3. 사람이 승인한 semantic boundary만 이동한다.
4. 원문과 새 구조의 G1~G6 회수율을 대조한다.
5. projection freshness와 기존 flat capsule 호환을 검증한다.

이 단계까지 임의 깊이, 정확한 쓰기 위치, 한 단계 읽기와 small-project child 0개가 함께 성립해야
재설계를 완성으로 판정한다. 성립하지 않으면 규칙을 더 붙이지 않고 근본 모델로 돌아간다.

## 14. 수용 기준과 회로 차단기

세부 규칙의 완성도가 아니라 아래 실제 결과로 판단한다.

### 14.1 지식 보존과 진실성

- G1 결정과 G5 중단 조건은 100% 회수한다.
- G2 기각 대안과 G3 재현 장면은 각각 90% 이상 회수한다.
- G4 추정을 현재 사실로 오인하는 비율은 연속 두 실행에서 0이다.
- 닫히는 branch의 G1~G3 중 card log에만 남은 항목은 0이다.
- 현재 결론에서 source/실험 좌표, 제한, 소비자를 역추적할 수 있다.
- stale/superseded history가 현재 truth로 기본 노출되지 않는다.

### 14.2 AI 읽기·쓰기 효율

- 활성 작업 재개와 새 domain orientation 모두 “어느 current/detail을 열지 선택하는 시점”까지 이
  재설계가 추가한 routing packet이 40 KiB 이하다. 현행 mandatory skill/Layer 0와 선택 뒤 여는 source
  본문은 별도로 측정한다.
- corpus를 두 배로 해도 첫 진입 읽기량은 거의 일정하고 전체 문서량에 비례하지 않는다.
- critical invariant, component, consumer, design reason 누락은 0이다.
- 고정 시나리오에서 새 사실의 owner 선택과 갱신 경로가 모두 일치한다.
- missing/stale route는 전체 검색으로 조용히 fallback하지 않는다.
- 작은 tweak의 필수 산출물과 기본 읽기량 증가는 0이다.

참고로 JGNote의 현행 next-session 지시를 따라가면 최소 약 73 KiB, 흔히 150~220 KiB를 읽은 뒤에야
frontier를 복원한다. 목표는 상세 근거를 영원히 40 KiB 안에 가두는 것이 아니라, **어떤 상세를 열어야
하는지 결정하는 초기 packet**을 제한하는 것이다.

### 14.3 사람·팀·유지보수

- 같은 구조로 greenfield, brownfield, project 전체, domain, 횡단 변경, active resume을 시작할 수 있다.
- 겹치는 worker write는 claim에서 막히고 synthesis/current owner에는 한 writer만 남는다.
- 투영은 원본과 drift하면 실패하며 사람이 같은 정보를 두 군데 갱신하지 않는다.
- 새 artifact 종류·상태 enum·수기 registry·reserved journal 형식은 0개이고, 새 machine scope는
  `project` 하나를 넘지 않는다.
- project scope의 네 구조 면제와 zone 순서가 producer/consumer/test까지 닫힌다. 숨은 다섯째 면제가
  나오면 좁은 seam 판정은 실패다.
- 기존 capability/flat capsule을 그대로 읽을 수 있고 migration은 선택적이다.

### 14.4 즉시 폐기 또는 원점 재검토 조건

- 추정을 확정으로 읽는 사례가 반복된다.
- 초기 읽기량이 corpus 전체 크기와 함께 증가한다.
- 한 실행에서 두 건 이상의 확정 지식 착지 누락이 나오거나 한 건 초과가 반복된다.
- card tree와 capsule tree 사이에 제3의 수기 index/edge 정본이 필요해진다.
- 작은 수정도 새 planning/research 문서를 요구한다.
- 예외를 추가할수록 쓰기 위치가 더 모호해진다.

이 중 하나가 발생하면 규칙을 덧붙여 봉합하지 않는다. 시간축/의미축 분리와 semantic address 자체가
실패 장면을 설명하는지부터 다시 검토한다.

## 15. 감사·검증 상태

### 독립 감사

별도 context가 `docs/audit-guideline_ko.md` §8을 적용해 현재 runtime의 producer, artifact, consumer와
re-entry path를 읽기 전용으로 대조했다. 사용자의 가설을 증거로 사용하지 않고 원문에서 다시
출발했다. 그 결과는 다음과 같다.

- 현재 계약의 조용한 자료 소실 0건, literal rule conflict 0건
- 죽은 참조+조합 결함 1건: 3.1의 `marker.glossary-term` resume 행 누락
- product 확인 전 중간 내구성, 연구 과정 보존, 비재귀 지식 계층, architecture 어휘와 canon 읽기
  비용은 현행 계약 결함이 아니라 새 목표 대비 설계 긴장
- `skills/**` 수정 0건

그 뒤 별도 Fable에 최초 제안을 보이지 않은 채 제1원리 설계를 맡기고, 결과가 나온 뒤 최초 제안과
상호 반증시켰다. Fable은 문제 진단에는 수렴했지만 “지식 포리스트 + cycle + evidence”를 과설계로
기각했다. 같은 Fable을 문맥이 신선한 동안 재사용해 JGNote의 대표 7개 문서와 실제 부피로 두 번째
공격을 맡겼고, 이번에는 Fable 자신의 “카드 로그만 확장” 처방도 mega-log가 된다고 기각했다. 두 번의
반증 뒤 남은 공통분모가 현재 안의 두 plane, 즉시 착지, owner-anchored recursive K다.

개정 전문에 대한 세 번째 공격은 근본 모델을 유지하되 blocker 2건과 major 7건을 보고했다. 자유명
깊이 1 작업 root가 현행 correspondence/baseline/verify를 깨는 문제와 orientation 표가 매 카드 Layer 0
재독을 축소하는 모순은 본문에서 제거했다. 예약 project scope 1종과 네 구조 면제, pre-Layer-0 journal
착지, DD-88 batch, 결론 산문의 비기계 지위, 외부 문서의 source-only 경계, fixture/runtime 어휘
분리를 명시했다. 따라서 최종안은 최초 독립안의 “새 primitive 0” 주장을 유지하지 않는다.

감사 guideline §5의 첫 정지 조건 중 rule-conflict/data-loss 0은 충족하지만 2계층 실결함 한 건이
남아 있으므로 “나머지가 표현/양갈래 독해뿐”이라는 조건은 충족하지 않는다. 이 요청은 보고 전용이라
수렴형 수리 절은 판정 대상이 아니다. 회로 차단기는 발동하지 않았다. 따라서 이 문서의 완료는
runtime 결함이 해결됐다는 뜻이 아니다.

### 아직 증명되지 않은 위험

- JGNote는 강한 실물 사례지만 하나의 프로젝트다. owner-anchored K의 node 생성 판단과 projection
  신뢰도에는 다른 형태의 대규모 corpus와 2배 synthetic corpus 결과가 더 필요하다.
- external 상세 문서를 current open-when 대상으로 승격시키면 shadow canon이 된다. 현재 synthesis는
  반드시 devflow canonical owner/K node에 한 집을 가져야 한다.
- 의미 단위 disposition과 owner 선택은 AI 추론을 사용한다. 자동 migration은 오판을 대량 복제하므로
  표본 대조와 사람 승인 없이 허용하면 안 된다.
- 현행 architecture 전체 재생성 비용은 capability 수에 비례하고, brownfield capsule 처리는 outline
  inventory를 checkpoint하지 않으면 중단 후 처음부터 다시 할 수 있다. 단계 2 fixture가 이 두
  failure를 반드시 포함해야 한다.
- “모든 변수에 허점이 없다”는 선언은 검증할 수 없다. 대신 새 사용 장면이 두 plane과 semantic
  address로 설명되지 않을 때 예외를 추가하지 않고 모델을 폐기하는 기준을 고정했다.

### 기계 검증

- 직접 trailing-whitespace 검사: 0건
- `node --test scripts/decision-index.test.js`: 12/12 통과
- `node --test scripts/project-knowledge.test.js`: 32/32 통과
- `node --test scripts/repository-invariants.test.js`: 98/98 통과
- 첫 repository-invariants 실행은 외부 GitHub deep link의 중간 경로를 내부 경로로 해석해 1건
  실패했다. 불필요한 deep link를 제거한 뒤 같은 테스트를 다시 실행해 98/98 통과했다.
- `node --test "scripts/*.test.js"`: 124초·604초·904초 실행과 완성도 재검토 뒤의 단일 184초 실행이
  모두 TAP summary 없이 제한에 도달했다. 통과로 판정하지 않으며 전체 behavior는
  `unverified (timeout)`이다. 같은 검토 안에서 반복 실행하지 않았다.
- live product/adopt session, H47~H50 재측정과 before/after entry comparison은 이 읽기 전용 조사에서
  실행하지 않았다.
- 문서 통계와 JGNote 표본은 읽기 전용 명령으로 수집했다. 조사 중간에는 외부 작업의 auth 변경이
  관찰됐고 최종 `git status --short`는 clean이었다. 이 조사에서는 JGNote의 어느 파일도 수정하지
  않았다.

## 16. 1차 근본 모델 판정

현재 devflow의 근본 문제는 단계 이름이나 문서 수가 아니다. **현재 지식이 되기 전의 긴 사고에는
사망 내성 주소가 없고, 프로젝트가 커졌을 때 현재 지식의 주소는 한 단계에서 포화된다**는 것이다.
이 때문에 기획·조사 과정은 세션에서 사라지고, 살아남은 내용은 JGNote의 handoff/plan처럼 현재 계약과
역사가 섞인 거대 문서가 되기 쉽다.

최종 선택은 다음 네 문장으로 요약된다.

1. 모든 지속 내용은 현재 지식 주소 또는 진행 중 작업 주소 하나를 가진다.
2. 조사·기획·설계·구현·검증은 별도 cycle 문서가 아니라 같은 재귀 card 생애를 쓴다.
3. 확정 지식은 즉시 현재 owner에 착지하고, 현재 트리는 필요가 증명될 때 같은 capsule 종류로
   재귀한다.
4. AI는 resume과 새 scope orientation을 구분하고, 기계가 계산한 한 단계 header에서 필요한 깊이만
   선택한다.

이것은 resume만을 위한 구조가 아니다. 새 프로젝트의 장기 feasibility, 기존 프로젝트 adopt, 방금
하던 작업의 handoff, 한 domain 유지보수, 프로젝트 전체 재기획, 여러 domain 횡단 개선, 작은 수정과
팀 병렬 작업을 같은 두 축으로 설명한다. 사람은 자유롭게 진입하고 AI는 목적·확실성·소비 범위를
판단해 주소를 선택한다. 드리프트는 AI 판단을 없애서가 아니라 권위, source, 한 writer, derived
projection과 disposition gate로 경계를 만든다.

이 안은 이전 “지식 포리스트”보다 근본적이지만 아직 구현 완료를 보증하는 설계는 아니다. JGNote 규모
fixture에서 회수율·오인율·읽기량·쓰기 위치가 14절 기준을 통과해야 단계 2를 열고, 단계 3의
owner-anchored K까지 fresh AI가 증명해야 재설계를 완료로 판정한다. 실패하면 규칙을 누적하지 않고 이
모델 자체를 다시 기획한다. 반복 실패를 막는 마지막 장치는 더 많은 절차가 아니라 **반증을 구현보다
앞에 두는 순서**다.

## 17. 완성 판단을 위한 동결 intent brief

이 절은 runtime schema가 아니라 이후 검토가 사용자 의도에서 벗어나지 않게 하는 평가 정본이다.
새 소견은 아래 intent를 바꾸는지, 구현 세부를 채우는지, 증거만 추가하는지 먼저 분류한다.

| 항목 | 동결 내용 |
|---|---|
| problem | 개발 과정의 조사·기획·결정·실패 경험이 대화나 mega-document에서 사라지거나 current truth와 섞이고, fresh AI가 필요한 지식과 쓰기 위치를 찾지 못한다 |
| positive use cases | greenfield 장기 기획, brownfield adopt, 깊은 architecture, project 전체·횡단·domain·하위 파트 개선, active resume, 새 orientation, 팀 병렬 작업, 작은 tweak |
| near misses | product 한 번으로 전체를 확정, 모든 것을 session HANDOFF에 누적, 모든 scope를 capability 하나에 강제, 작업 tree와 지식 tree를 mirror, 범용 graph/DB, 작은 작업에도 빈 문서 생성 |
| inputs | 사람의 자연어 목표, 기존 current owners, code와 외부 source, active work state, 과거 card/Git evidence |
| outputs | 현재 지식의 정확한 owner/K node, 진행 중 work branch/card, 검증 결과, 파생 navigation projection, 최소 HANDOFF |
| irreversible boundaries | 추정을 current로 승격하지 않음, owner를 추측해 쓰지 않음, source를 자동 삭제·이동하지 않음, 사람 확인 없이 대량 migration하지 않음 |
| state-dependent behavior | active work면 resume, 아니면 orientation; owner가 하나면 그 scope, 여러 개면 가장 가까운 공통 owner; 확정 전에는 work, 확정 뒤 current landing |
| exact-format candidates | 기존 card/progress/marker 형식, K header와 Source basis, `00-project` machine scope와 네 면제; fixture 전에는 새 형식을 추가하지 않음 |
| external dependencies | Git, state/project-knowledge 도구, source 좌표, canonical writer, 실제 verify channel |
| completion evidence | fresh AI의 읽기·쓰기·재개 transcript, JGNote급/2배 corpus 회수율과 읽기량, 중단 주입, multi-writer test, small-tweak artifact 0 |
| judgment points | 의미 owner 선택, node 분기 가치, source에서 current로 올릴 synthesis, 불명확할 때 ask/root research로 후퇴 |
| deterministic helpers | state projection, direct-child knowledge projection, path/source/freshness validator, claim과 closure 검사 |

## 18. 더 이상 소견마다 흔들지 않을 설계 kernel

### 18.1 불변식

1. **개발은 코드 변경과 지식 생산을 함께 수행한다.** 완료는 실행 결과뿐 아니라 재사용할 현재 지식의
   착지까지 포함한다.
2. **current knowledge와 work는 서로 다른 두 plane이다.** current는 의미·책임·사용 목적, work는
   목표·의존성·완료 조건과 시간축을 소유한다. history와 evidence는 닫힌 work/Git/source이며 제3의
   current authority가 아니다.
3. **두 tree는 mirror하지 않는다.** 하나의 작업이 여러 knowledge node를 읽을 수 있고, 여러 작업이
   하나의 current node를 갱신할 수 있다. 연결은 card의 exact `Read first`와 closure landing뿐이다.
4. **모든 작업은 가장 가까운 지식 owner에 anchor된다.** 한 owner면 그 capability, 여러 owner의
   공통 범위가 project면 `00-project`, 더 깊은 modal/list 작업은 capability branch 안에서 exact K를
   읽는다.
5. **current knowledge는 owner-anchored recursive K로 필요 깊이까지 자란다.** runtime의 재귀 지원은
   필수지만 실제 node 생성은 독립 consumer·closure·writer가 있을 때만 한다.
6. **사람의 진입은 자유롭고 AI의 경로는 유계다.** active 작업은 resume, 새 목적은 orientation이다.
   AI는 한 단계 header로 내려가며 ambiguous owner에서는 임의 분류 대신 ask 또는 상위 research로
   후퇴한다.
7. **작은 작업은 작은 채로 남는다.** 새로운 장기 지식·다중 frontier·세션 경계가 없으면 card와 K
   node를 만들지 않는다.
8. **기계는 주소 무결성을, AI는 의미 판단을 맡는다.** derived projection·validator·claim이 drift를
   막고, schema가 AI의 문맥 판단을 대신하지 않는다.

### 18.2 무엇이 나와야만 kernel을 다시 바꾸는가

다음 중 하나가 실제 fixture에서 나타날 때만 근본 모델을 다시 연다.

- 합법적인 scope가 current/work 두 plane 어느 쪽에도 한 집을 갖지 못한다.
- 동일한 사실이 둘 이상의 current owner에 복제돼야만 작업이 가능하다.
- knowledge tree와 work tree를 mirror하지 않으면 fresh AI가 재개할 수 없다.
- project·domain·하위 파트마다 별도 mode 또는 별도 lifecycle이 반드시 필요하다.
- 한 단계 projection을 사용하면 critical invariant를 보존하면서 corpus 비례 읽기를 피할 수 없다.
- 작은 tweak도 새 persistent artifact 없이는 안전하게 끝낼 수 없다.

반대로 path 문법, writer 호출 순서, marker batch, tool option 미정은 **명세 공백**이고, 아직 fixture를
실행하지 않았다는 사실은 **증거 공백**이다. 둘을 모델 반증으로 오인해 구조를 다시 만들지 않는다.

## 19. 범위와 시간 변수를 하나의 kernel로 시뮬레이션

| 실제 장면 | knowledge anchor와 읽기 | work 위치와 진행 | 종료·다음 진입 |
|---|---|---|---|
| product 전 3주 feasibility | 가장 가까운 알려진 project root; 확정 전 current node 없음 | `00-project` research tree에서 기술·시장·법무 frontier와 synthesis | 사람 확정은 journal, product/arch 확인 뒤 owner/K에 착지; active면 resume |
| 기획 중단 후 다음 세션 | 새 기획을 다시 시작하지 않고 state가 active branch/card를 지목 | 같은 card log와 child 상태를 이어감 | synthesis가 미결·기각·확정을 처분할 때까지 branch 유지 |
| 깊은 product/architecture 조사 | product 또는 arch owner → direct K headers → 선택 source | project-scope research/synthesis; 구현은 capability branch로 분리 | 현재 계약은 product/arch K, 당시 비교는 닫힌 cards |
| project 전체 재기획 | product/arch라는 project current owner | `00-project` synthesis가 영향 capability를 열고 dependency를 조정 | root current와 각 capability landing 뒤 통합 verify |
| 여러 capability 횡단 변경 | 가장 가까운 공통 owner가 project; 관련 child headers만 선택 | 00 synthesis + 각 capability의 실행 card | 공통 계약은 root owner, 국소 계약은 각 capability; 복제 없음 |
| 단일 domain 고도화 | 해당 capability → 필요한 K | capability work folder의 research/task tree | capability/K current와 capability verify |
| modal/list/filter 같은 깊은 파트 | capability → UI K → modal/list leaf K | capability 아래 깊은 card; `Read first`가 exact leaf를 지목 | leaf current와 상위 공통 invariant를 각각 한 집에 착지 |
| 닫힌 domain에 6개월 뒤 새 작업 | project authority → capability/K orientation; 닫힌 card는 기본 읽지 않음 | 새 branch를 열고 과거 이유가 필요할 때만 source/history 접근 | 새 current closure; 과거 HANDOFF에 의존하지 않음 |
| 활성 조사 handoff | state → active card → exact current/source | HANDOFF는 dirty delta·next exact action·외부 blocker만 | 새 AI가 같은 active work를 재개 |
| 작은 명확한 tweak | 필요한 current owner만 기존 불변식대로 읽음 | card 0, 추가 K 0, commit 1 가능 | 새 durable 지식이 없으면 문서 변화 0 |

이 표에서 scope별 새 workflow가 생기지 않는다. 달라지는 것은 anchor와 child 깊이뿐이고, current/work/
landing/resume의 생애는 같다.

### 19.1 작업 지시서와 지식 계층은 왜 다른가

| 구분 | 질문 | 지속 기간 | 예시 |
|---|---|---|---|
| current knowledge node | 지금 무엇이 참이고 언제 읽는가 | 다음 결정으로 갱신될 때까지 | “modal edit session은 list filter와 독립 상태다” |
| active work card | 이번에 무엇을 알아내거나 바꾸고 어떻게 끝내는가 | 목표가 끝날 때까지 | “edit session 취소 시 filter 복원을 실험하고 계약을 확정한다” |
| closed work/Git | 당시 무엇을 시도했고 왜 버렸는가 | 역사·재심사 evidence | 실패한 shared-state prototype과 재현 결과 |
| external source | 원문이 무엇을 주장하거나 관찰했는가 | source 자체의 수명 | JGNote handoff, 논문, code, 운영 측정 |

knowledge tree는 주제 분류이고 work tree는 실행 계획이므로 파일 구조를 맞추지 않는다. 예를 들어
property UI 아래 modal/list/filter 지식 node가 세 개 있어도 한 번의 통합 변경이면 synthesis card 하나와
실행 child 둘일 수 있다. 반대로 한 knowledge leaf를 여러 실험 card가 순차적으로 검증할 수도 있다.

## 20. 현재 완성도 판정

완성도는 하나의 백분율로 말하지 않는다. 구조가 좋아도 fresh AI 행동이 증명되지 않으면 배포 준비가
아니기 때문이다.

| 평가 층 | 현재 판정 | 근거 |
|---|---|---|
| 사용자 목적과 실패 진단 | **A-** | 현행 원문, JGNote 부피, F1~F3와 사용 장면이 연결됨 |
| 전체를 관통하는 kernel | **B+** | 두 plane·nearest owner·recursive K로 모든 제시 scope를 같은 원리로 설명 |
| knowledge/work/history 분리 | **B+** | 소유와 생애는 명확하나 closure landing 강제는 미구현 |
| 사람의 자유로운 진입 | **B** | resume/orientation과 scope mapping은 설명되나 자연어 owner 선택 fixture가 없음 |
| fresh AI 읽기·쓰기 결정성 | **C+** | projection skeleton은 있으나 `00-project`, K writer/source, route repair가 runtime에 없음 |
| JGNote급 규모 내구성 | **B-** | 실제 부피와 topology는 매핑됐지만 recursive tool·2배 corpus 행동은 미증명 |
| 팀 병렬성과 drift 저항 | **B-** | 기존 claim/one-writer를 재사용하지만 project synthesis와 multi-owner landing은 미시험 |
| small-task 비용 | **C** | artifact 증가 0 목표는 명확하지만 before/after 실측이 없음 |
| 배포/마이그레이션 준비 | **D** | decision 변경, producer/consumer/test closure와 실제 skill 구현이 없음 |

두 fresh-context 독립 검토도 같은 방향에 수렴했다. 하나는 여섯 navigation 장면에서 목표 경로는
복원했지만 runtime 미구현 때문에 fresh-consumer closure를 `불충족`으로 판정했다. 다른 하나는 모델
`B`, 실행 가능성 `C`, 배포 준비 `D`로 판정했다. 이 결과는 **agent_claimed 설계 evidence**이지
runtime/harness evidence가 아니다.

따라서 현재 상태는 **높은 수준의 문제 진단과 유망한 설계 kernel을 가진 Design RC**다. 전체 skill
구현을 시작할 정도로 완성됐다고 판정하지 않는다. 다음에 허용할 수 있는 것은 구현이 아니라 아래의
유계 설계 증명 단계다.

## 21. 구현 전에 끝낼 plan

### Gate 0. kernel을 실행 가능한 계약으로 만든다

새 skill 파일을 고치기 전에 한 bounded design package에서 다음만 고정한다.

1. canonical owner와 recursive K의 header, stable identity, source, writer/refresh 계약
2. nearest-owner/LCA 판단과 ambiguous owner의 ask/root-research 후퇴
3. `00-project`의 producer·consumer, 네 구조 면제와 state zone 순서
4. research/synthesis card의 closure landing과 DD-88 batch
5. resume packet과 orientation packet의 최소 durable dependency
6. current/work/history/external-source disposition과 migration 보존 규칙

완료 증거는 각 의무가 canonical target과 fixture 하나를 갖고, 아직 미정인 항목이 `unproven`으로
남는 것이다. 새 cycle/evidence object, 범용 edge, mode는 만들지 않는다.

### Gate 1. 무변경 read/write simulator로 먼저 실패시킨다

현행 skill을 수정하지 않고 synthetic corpus에서 current와 candidate를 같은 질문으로 비교한다.

- 19절 열 장면과 JGNote G1~G6 정답표
- frontier 중간·landing 직후·Layer 0 확인 직전 중단
- corpus 2배, 잘못 확정처럼 쓴 conjecture, stale source, owner 동률
- single writer와 multi-worker conflict
- tiny tweak의 artifact/read delta

fresh AI가 owner, 읽기 경로, 기록 위치, current/history 구분, 다음 action을 맞혀야 한다. critical
omission·false confirmation은 0이고 초기 route는 corpus 크기에 비례하지 않아야 한다. 여기서 실패하면
skill 문구를 늘리지 않고 Gate 0의 kernel/contract만 다시 본다.

### Gate 2. work plane만 한 vertical slice로 pilot한다

한 greenfield feasibility와 한 post-start 횡단 변경에서 `00-project`, research/synthesis card, state resume,
즉시 landing을 구현한다. 기존 capability work·verify와 작은 tweak는 바꾸지 않는다. producer/consumer/
test와 clean-session before/after가 닫힌 뒤에만 다음 gate로 간다.

### Gate 3. current knowledge plane을 완성한다

product·arch·design·capability owner 아래 recursive K, direct-child projection, stable identity, source/
freshness validator와 writer refresh를 구현한다. child 0개인 작은 프로젝트와 JGNote급 다단 tree를 같은
runtime으로 검증한다.

### Gate 4. authoring lenses와 migration을 연결한다

product/adopt/arch/design은 어느 scope에서든 current owner를 갱신하는 lens가 되고, split/work/verify는
work 생애와 landing을 소비하며, resume은 두 진입 view를 route한다. 기존 문서는 inventory와 사람
승인 없이 자동 분할·삭제하지 않는다. before/after comprehension, trigger, team concurrency, release
gate가 통과해야 배포 후보가 된다.

## 22. 현행 대비 무엇이 달라지는가

| 관점 | 현행 | 동결 재설계안 |
|---|---|---|
| 최초 기획 | product/adopt/arch 확인 전 중간 사고는 주로 대화 | project work tree가 장기 조사·중단·synthesis를 보존 |
| 프로젝트 시작 뒤 큰 기획 | split 전에 대화에서 비교하거나 바로 capability card로 압축 | project/capability anchor에서 같은 research→synthesis→landing 생애 반복 |
| 지식 깊이 | Layer 0 + 깊이 1 capability + capability 아래 flat capsule | 기존 owner 아래 같은 K node를 필요한 만큼 재귀 |
| architecture 상세 | root arch와 프로젝트 외부 문서에 의존 | arch owner 아래 프로젝트 고유 K subtree; 외부 문서는 source |
| 작업과 지식 | card log의 답이 current owner로 항상 접히지 않음 | work는 실행 생애, knowledge는 현재 의미; closure landing으로만 연결 |
| 횡단 작업 | capability 하나에 넣거나 Layer 0 재실행을 추정 | nearest common owner가 project면 00 synthesis, 실행은 각 capability |
| 깊은 domain part | task tree는 깊어도 current knowledge는 flat | modal/list/filter current K와 작업 child가 독립적으로 깊어짐 |
| resume | active 실행에는 강하지만 pre-Layer0·긴 planning은 약함 | state가 모든 active work를 재개; HANDOFF는 비계산 delta만 |
| 새 AI의 새 작업 | domain entry는 capability 중심, 상세 경로는 제한적 | orientation이 owner header를 한 단계씩 따라 exact K를 선택 |
| 큰 문서 | 요약 또는 flat capsule/외부 mega-document | current synthesis·닫힌 work·external source로 분리하고 tree로 선택 읽기 |
| 작은 작업 | tweak lane 지원 | 그대로 유지하며 추가 artifact 0을 release gate로 측정 |

### 비교 예시: property modal/list 고도화

현행에서는 property capability 하나, 여러 task card와 큰 spec/handoff가 생길 가능성이 높다. 재설계안은
현재 계약을 `property → UI contract → modal edit session / list filter` K tree에 두고, 이번 작업은
property work folder의 research/synthesis cards로만 진행한다. fresh AI가 새 개선을 시작하면 current K
tree로 orientation하고, 중단 작업을 잇는다면 state에서 active card로 resume한다. 과거 실패 이유가
필요할 때만 닫힌 card source를 연다.

### 비교 예시: frontend/backend/data 횡단 변경

현행에서는 어느 capability가 작업과 공통 결정을 소유할지 애매할 수 있다. 재설계안은 공통 owner인
project의 `00-project`에서 architecture synthesis를 수행하고 각 capability에 구현 card를 연다. 공통
계약은 arch K에 한 번, 국소 계약은 각 capability K에 한 번 착지한다. 작업 tree와 지식 tree가 같은
모양일 필요가 없다.

## 23. 최종 완성도 결론

이번 재검토 뒤에도 두-plane kernel은 유지된다. 바뀐 것은 국소 규칙이 아니라 처음부터 요구됐던 범위를
정확히 일반화한 두 문장이다.

1. recursive knowledge는 capability의 overflow 옵션이 아니라 모든 canonical owner가 공유하는 target
   capability이고, 실제 node 생성만 프로젝트 복잡도에 따라 선택적이다.
2. 작업 scope는 domain 종류별 규칙이 아니라 영향을 완전히 소유하는 nearest knowledge owner로 정하며,
   knowledge tree와 work tree는 서로 mirror하지 않는다.

이 두 문장으로 장기 기획, 깊은 architecture, project 횡단, 단일 domain, modal/list 하위 파트, handoff,
새 AI orientation과 작은 tweak를 같은 체계로 설명할 수 있다. 따라서 **근본 기획의 방향과 포괄성은
높은 편**이라고 판정한다. 그러나 fresh-consumer closure와 runtime evidence가 없으므로 **현재 전체
완성도를 높다고 판정하지는 않는다**. 사용자가 지금 승인할 합리적 다음 범위는 skill 구현이 아니라
Gate 0~1의 유계 설계 증명이다. 그 증명이 통과하면 같은 kernel을 유지한 채 구현으로 들어가고,
통과하지 못하면 문구를 누적하지 않고 kernel 하나만 다시 심사한다.

## 24. 구현 전 대리실험과 최종 운영 계획

### 24.1 왜 이 검증을 다시 했는가

앞선 완성도 표는 현행 배포 스킬, 재설계안의 논리, 아직 없는 runtime evidence를 한 표에 섞었다. 그 결과
“설계가 논리적으로 약하다”와 “아직 구현하지 않아 관찰 증거가 없다”가 같은 낮은 점수로 표현됐다. 이것은
판정 오류다. 구현 전에도 다음은 따로 검증할 수 있다.

- 합법적인 요청 범위가 모두 같은 kernel에 주소를 갖는가
- fresh AI가 제안에 없는 주소를 발명하지 않고 읽기·쓰기 경로를 고를 수 있는가
- work와 current knowledge가 복제되거나 mirror되지 않는가
- 장기 research evidence가 보존되면서 current truth와 섞이지 않는가
- crosscut·resume·closed domain·tiny tweak가 특수 lifecycle 없이 작동하는가
- 제안이 새 artifact와 상태를 얼마나 추가하며 기존 기계를 얼마나 건드리는가

반대로 실제 parser, state projection, 동시 writer, 중단 복구가 그대로 작동하는지는 구현 또는 harness 없이
통과라고 말할 수 없다. 따라서 이번 검증은 **논리적 실행 가능성**과 **runtime 증거**를 분리했다.

### 24.2 오케스트레이션 운영 방침

실험은 파일을 수정하지 않는 worker와 한 명의 통합 writer로 분리했다. 같은 시나리오를 서로 다른 입력으로
병렬 실행하고, 결과 충돌만 다음 판단 단계로 승격했다.

| 역할 | 컨텍스트 | 비용·재사용 원칙 | 산출 |
|---|---|---|---|
| 현행 기준선 소비자 | redesign을 보지 않은 중간급 Codex | 수집·경로 추적이므로 낮은 추론비용; 결과 분류에 한 번 재사용 | 현행 S1~S8 route/read/write 표와 최소 계약 |
| redesign 소비자 | 기존 반증 맥락을 가진 agent | 이미 정본과 JGNote를 읽었으므로 재사용; 장시간 사용 뒤 즉시 교체 | 제안에 명시된 경로와 GAP 5건 |
| 독립 요구 oracle | fresh 중간급 Codex | 제안을 숨기고 사용자 목적과 제한된 JGNote 표본만 제공 | 8개 지표, reject 조건, blind score |
| 범위 공격자 | 앞서 scope 변수를 이해한 중간급 Codex | 같은 문제의 후속 반증이므로 재사용 | 보완 계약 적용 뒤 kernel 반증·새 spec gap 탐색 |
| 마지막 계약 작성자 | fresh 중간급 Codex | 새로운 두 판단만 제한적으로 위임 | multi-owner closure와 legacy policy owner |
| coordinator | 이 문서의 유일 writer | 결과 충돌·정본 좌표·최종 채택만 판단 | 한 번의 통합 수정 |

새 worker 세 개를 동시에 시작했을 때 로컬 agent process가 memory allocation과 prompt injection 단계에서
실패했다. 실패한 dispatch는 결과로 세지 않았고 중복 실행하지 않았다. 이후 기존 idle worker를 재사용하고
fresh 독립 oracle 하나만 별도 실행했다. 이 사건에서 다음 운용 규칙을 고정한다.

1. 독립 task는 먼저 모두 만들고 병렬 dispatch하되, 새 process 기동은 host 여유가 불명확하면 순차적으로 한다.
2. 수집·표 작성·경로 추적은 중간급 agent가 맡는다. 상위 추론은 kernel 반증이나 결과 충돌에만 쓴다.
3. 이미 같은 정본을 읽은 agent는 후속 명세 작업에 재사용한다. 독립 채점과 새로운 가설은 fresh context가 맡는다.
4. 누적 사용 시간이 한 시간을 넘었거나 context가 장기간 누적된 agent는 현재 산출을 끝으로 교체한다.
5. worker는 repository read-only다. 여러 worker가 같은 연구 문서를 동시에 고치지 않는다.
6. 새 실패 유형이 더 나오지 않고 기존 spec gap 또는 evidence gap으로 수렴하면 실험을 중단한다.

### 24.3 고정 시나리오와 채점 기준

현행과 후보에 같은 여덟 시나리오를 적용했다.

| ID | 시나리오 |
|---|---|
| S1 | product 확정 전 3D 얼굴 feasibility를 3주 조사하고 중단·재개 |
| S2 | frontend/backend/data architecture를 깊게 연구하고 외부 출처를 다수 축적 |
| S3 | 기존 property의 modal/list 하위 파트를 심층 재설계 |
| S4 | frontend/backend/data/verification을 동시에 관통하는 기능 |
| S5 | 한 줄 설정 또는 오타 수정 |
| S6 | active implementation을 새 AI가 이어받음 |
| S7 | 6개월 전에 닫힌 domain에 새 기능을 시작 |
| S8 | 외부 과거 문서와 devflow current owner가 충돌 |

독립 oracle은 route correctness, bounded retrieval, write determinism, knowledge retention,
work/knowledge separation, handoff continuity, small-task overhead, team conflict safety를 각각 0~3으로
채점했다. 다음 중 하나면 전체 reject다.

- current truth를 찾기 위해 corpus 전체나 folder 전체를 읽어야 한다.
- research, plan, report, generated map, HANDOFF가 조용히 두 번째 canon이 될 수 있다.
- 하나의 current fact가 여러 writable home을 갖거나 supersession 규칙이 없다.
- chat 없이 active scope·evidence·next action을 복구할 수 없다.
- crosscut work가 affected owner를 열거하고 겹치는 쓰기를 막을 수 없다.
- 작은 tweak가 research/architecture 수준 절차를 부담한다.
- 외부 evidence가 확인 없이 current canon을 덮는다.
- closed domain의 current baseline을 찾을 수 없다.

### 24.4 대리실험 결과

#### 현행 기준선

현행은 생각보다 강한 축도 분명했다. tweak는 card 0이고, active resume은 state → claimed card/log 경로가
결정적이며, multi-owner request도 marker와 한 번의 승인 경계를 갖는다. 그러나 장기 연구 원자료의 durable
address, crosscut current knowledge의 재발견, subpart semantic owner, 여러 owner에 대한 원자적 landing,
closed-domain refresh, 외부 충돌 provenance가 하나의 계약으로 이어지지 않았다.

#### 보완 전 redesign 소비자

보완 전 후보는 S3·S5·S6·S7·S8의 주소를 제안에 적힌 규칙만으로 선택했다. S1·S2·S4에서는 다음
GAP 때문에 멈췄다.

1. pre-product `00-project` 첫 research card를 여는 skill과 승인 경계
2. 외부 source를 보존하고 K가 다시 찾을 수 있게 하는 합법 좌표
3. crosscut request가 즉시 실행 card인지 project synthesis인지 고르는 분기
4. recursive K subtree의 구체 writer
5. 구모델에서 이미 닫힌 domain의 무마이그레이션·선택 하강 경계

범위 공격은 이 다섯 계약을 넣은 뒤 kernel 반증 0건을 보고했다. 대신 두 가지 명세 공백을 더 찾았다.

- affected owner의 모든 landing이 끝나기 전에 synthesis branch가 닫힐 수 있었다.
- legacy no-auto-migration 정책의 canonical home이 선택되지 않았다.

마지막 제한 검토가 두 공백을 기존 marker와 baseline lifecycle로 닫았다. 새 1급 artifact/state/lifecycle은
0개다.

#### 읽기 비용 해석

`card 0, K 0, commit 1`은 **추가 artifact 비용**이지 총 읽기 0을 뜻하지 않는다. passing tweak도 현행
product·arch·design·code-style과 필요할 때 glossary를 읽는다. 다만 state tool, journal, card,
dependency와 sibling card를 읽지 않는다. `108~136 KiB`는 소비자 실험에서 더한 관측치이며 정본의
normative 수치가 아니다. redesign의 release 기준은 다음과 같이 해석해야 한다.

- passing tweak의 artifact와 필수 read **증분**은 현행 대비 0
- normal card의 기존 Layer 0 read는 이번 redesign에서 임의로 축소하지 않음
- 작지만 tweak predicate를 통과하지 못하는 작업의 총 read cost는 별도 성능 위험으로 측정
- 절대 byte가 작다는 사실만으로 comprehension을 주장하지 않고 clean-session before/after로 비교

### 24.5 Gate 0에서 고정할 여섯 실행 계약

| 계약 | observation과 route | durable owner·writer | closure·검증 |
|---|---|---|---|
| C1 pre-product research entry | `setup.no-product/layer0-incomplete`에서 다세션 조사 사건이면 기존 request line → split mapping → `00-project`; 확정 인터뷰와 모호하면 한 번 ask | work는 split/card, 사람 확정은 기명 journal line, product가 수확 | 구현 card 금지; 답+근거+착지 확인 뒤 product 확인 경계에서 branch closure |
| C2 research evidence lifecycle | 외부 관측·URL·버전·조회 시점은 research card log에 두고 current synthesis만 K로 올림 | raw evidence는 closed card/source, current는 nearest owner/K; K writer는 arch/adopt | K `Source basis`는 `card path@binding commit:line range`; 재심사 때만 exact range 하강 |
| C3 crosscut branch rule | depth 0/1은 현행 card, 2a는 Layer 0 owner, 2b에서 독립 질문·실험·다세션·4-field 불충분 사건이 생길 때만 research/synthesis | request 소비와 branch 생성은 split 하나가 소유 | mapping 불가 또는 branch 판단 동률이면 ask; 작은 작업에는 접촉 0 |
| C4 recursive K writer | 의미 owner가 결정되면 marker가 project/capability owner를 지목 | 모든 K writer는 arch, brownfield는 adopt; product/verify가 직접 쓰지 않음 | 같은 refresh batch에서 leaf/parent 승격과 marker 소비; writer 선택 drift 금지 |
| C5 legacy closed-domain boundary | re-entry는 current code와 bounded hypothesis만 확인; 과거 log 일괄 migration 금지 | lifecycle 계약은 `baseline-predicates`가 소유 | exact card를 사용자가 지목, non-pass repair lineage, current K/Trap Source basis의 세 문에서만 closed card 하강 |
| C6 multi-owner atomic landing | synthesis가 affected owner별 기존 landing marker를 만들고 같은 source locator로 묶음 | 각 owner marker는 arch/adopt refresh가 current/K update와 같은 commit에서 소비 | HEAD에 관련 marker가 0이고 log에 owner/K landing path+commit이 모두 있을 때만 closure; partial landing은 residual marker가 state/resume를 선점 |

C2는 별도 research dossier를 만들지 않는다. 닫힌 work card가 source이고 K가 current이므로 두 canon이
아니다. C6도 batch object를 추가하지 않는다. 공유 source locator와 기존 marker의 residual set이 batch를
표현한다.

### 24.6 보완 계약 적용 뒤 객관적 판정

독립 oracle의 반사실 재채점은 S1~S8을 모두 **논리적 pass**로 판정했다. 이 pass는 구현 성공이 아니라
producer·consumer·주소·writer·종료 조건이 설명됐다는 뜻이다.

| 평가 대상 | 현재 판정 | 근거와 남은 한계 |
|---|---:|---|
| 사용자 목적과 실패 진단 | A | 현행 기준선과 JGNote 표본에서 독립 재도출 |
| 두 plane kernel | A- | 마지막 범위 공격까지 kernel 반증 0; 합법 scope 8종이 모두 주소를 가짐 |
| route·writer·landing 논리 | A- | 여섯 계약 적용 시 8/8 논리 pass; 새 1급 객체 0 |
| 방대한 knowledge 분할·회수 | B+ | corpus 비례 read를 피하는 경로는 결정; 2배 corpus와 오선택률은 미측정 |
| 사람의 자유 진입과 AI 결정성 | A- | scope 대신 nearest owner와 관찰 사건을 사용; 동률은 ask/root research로 후퇴 |
| active handoff와 새 orientation | A- | 서로 다른 view로 명시; runtime precedence는 fixture 필요 |
| 작은 작업 비례성 | B | redesign 증분 0이나 현행 core read와 small-non-tweak 비용은 남음 |
| 팀 충돌 안전성 | A- | single writer와 residual marker closure가 논리적으로 닫힘; 실제 multi-writer test 미실행 |
| runtime 행동 증거 | unverified | agent simulation은 `agent_claimed`; parser/state/concurrency 관찰은 아직 없음 |

따라서 현재 target design의 **구현 전 논리 완성도는 A-**로 올려 평가한다. 현행 배포 스킬의 행동이
같이 A-가 된 것은 아니다. 이번 작업은 `skills/**`를 바꾸지 않았으므로 runtime은 그대로다. 또한 A-는
모든 구현을 한 번에 시작해도 된다는 뜻이 아니라, 더 이상 전체 구조를 재설계하지 않고 아래의 제한된
Gate 1 증명으로 넘어갈 수 있다는 뜻이다.

### 24.7 전체 기간을 줄이는 구현 순서

#### Wave 0 — Gate 0 canonical contract

- 위 C1~C6을 정본 decision/ownership/predicate 좌표에 투영한다.
- 새 1급 객체를 만들지 않는다. 예상 형식 접촉은 owner marker의 값 영역 확장 하나뿐이다.
- 각 계약의 producer, consumer, predicate, effect, fixture를 먼저 고정한다.

#### Wave 1 — runtime 무변경 simulator

S1~S8 fixture에 seeded truth를 넣고 기존 skill과 Gate 0 계약을 각각 fresh consumer에게 준다. 산출은
route, read set, work address, current landing, ask/stop, artifact count다. 다음 네 장면을 우선한다.

1. S1: setup precedence와 중단 resume
2. S2: closed card exact source 재개봉과 K synthesis
3. S4: owner A만 착지한 상태에서 closure 거부 후 owner B resume
4. S5: passing tweak와 small-but-non-tweak의 실제 read/artifact delta

이 wave는 skill 구현 전에 가설을 죽인다. 같은 실패가 2회 재현되면 문구를 더 붙이지 않고 해당
predicate/owner/effect 하나만 수정한다.

#### Wave 2 — 한 vertical slice

S1과 S4만 실제로 연결한다. `00-project`, research/synthesis card, state precedence, owner marker, exact
Source basis, residual closure를 한 줄로 관통시키고 S5·S6 회귀를 같이 돌린다. producer/consumer/test가
모두 닫히기 전에는 recursive K 전체와 migration으로 확장하지 않는다.

#### Wave 3 — recursive current knowledge

vertical slice가 통과한 뒤 product/arch/design/capability owner 아래 같은 K 문법과 direct-child projection을
확장한다. JGNote 크기와 같은 corpus, 두 배 corpus에서 critical fact recovery, wrong-owner rate, mandatory
read bytes를 비교한다.

#### Wave 4 — opt-in adoption과 team test

기존 문서를 자동 분할하지 않는다. 현재 작업이 실제로 닿은 owner만 새 closure를 만들고, closed history는
C5의 세 문으로만 하강한다. 마지막으로 두 worker가 서로 다른 owner와 같은 owner를 각각 갱신하는 중단
주입 test를 수행한다.

### 24.8 중단·승격 기준

- 합법 scope가 두 plane 어디에도 집을 갖지 못하거나 두 current canon을 강제할 때만 kernel을 다시 연다.
- path, writer, marker 순서, parser option 문제는 spec gap으로 고치며 전체 구조를 다시 쓰지 않는다.
- fresh AI의 의미 owner 일치율, source 충분성, K 분기 품질은 probabilistic evidence로 따로 보고한다.
- passing tweak의 artifact/read delta가 현행보다 증가하면 release를 막는다.
- corpus를 두 배로 했을 때 필수 읽기가 corpus에 비례하거나 critical fact 누락이 생기면 recursive projection을
  구현하지 않는다.
- crosscut partial landing에서 residual marker를 무시하고 closure가 가능하면 C6를 실패로 판정한다.
- agent가 제안에 없는 주소를 발명하거나 전체 검색으로 fallback하면 route 실패다.
- 새 실패 유형 없이 결과가 spec/evidence gap으로 수렴하면 더 많은 반증 agent를 추가하지 않는다.

이 운영 계획의 목적은 구현 뒤에 근본 가설을 다시 뒤집는 일을 피하는 것이다. 현재 합리적인 다음 승인
범위는 **Wave 0~1**이다. 그 증거가 닫히면 같은 kernel을 유지한 채 vertical slice로 이동하고, 실패하면
전체 문서를 다시 설계하지 않고 실패한 계약 하나만 교체한다.

## 25. 미래 구현 AI용 진입 계약

이 절은 이 조사에 참여하지 않은 새 AI가 의도적 미결정을 빈칸으로 오해해 임의 구현하는 일을 막는다.
이 절은 앞 절의 설계를 요약하는 또 하나의 정본이 아니라 **읽기 순서와 다음 행동을 정하는 handoff
entry**다. 의미와 이유는 아래에 지목한 원래 절과 canonical source가 소유한다.

### 25.1 현재 상태와 첫 행동

| 관찰된 상태 | 새 AI의 첫 행동 | 금지 |
|---|---|---|
| 이 조사 문서만 주어짐 | 아래 최소 consumption set으로 의도·현행·target을 설명하고, 사용자가 원하는 범위가 Wave 0~1인지 확인 | 설계가 채택됐다고 간주, `skills/**` 수정, release plan 발명 |
| Wave 0~1 기획을 요청받음 | AGENTS entry gate를 통과한다. 요청이 정확한 저장 경로와 round role을 승인했다면 그 경로에만 C1~C6 contract sheet와 read-only fixture plan을 작성한다. 승인하지 않았다면 파일을 만들거나 고치지 말고 산출물 내용과 필요한 write scope를 대화로 보고한다. | runtime/skill 변경, recursive K 구현, migration, 새 round record나 저장 경로 추정 |
| 별도의 승인된 Gate 0 contract sheet와 Gate 1 evidence가 함께 주어짐 | 그 artifact가 이 절의 완료 조건을 충족하는지 확인한 뒤 승인된 다음 wave만 계획 | 문서 이름만 보고 통과 추정, 미실행 fixture를 pass 처리 |
| “전부 구현”만 요청받았으나 Gate 0~1 evidence가 없음 | Wave 0~1이 선행되어야 한다고 보고하고 그 범위만 제안 | Wave 2~4 선행 구현 |

이 문서의 `A-`는 **구현 전 논리 완성도**다. 배포 준비도나 runtime 행동 증거가 아니다. 현행
`skills/**`는 바뀌지 않았고 여섯 계약도 아직 canonical decision과 predicate에 투영되지 않았다.

### 25.2 최소 consumption set

전체 115KB 문서를 처음부터 다시 읽는 것이 기본 진입은 아니다. 다음 task별 set을 사용한다.

| 목적 | 먼저 읽기 | 조건부 추가 읽기 |
|---|---|---|
| 의도·상태 설명 | 0절, 17~19절, 23~25절 | 사용자가 근거를 물은 subject의 원래 분석 절 |
| Wave 0 contract 기획 | 위 set + 7.2~7.3, 8.1~8.4, 10~11절 | 아래 C1~C6 source map의 해당 행 |
| Wave 1 simulator 기획 | 위 set + 14.2, 21, 24.3~24.8 | 선택 fixture가 건드리는 current test/source만 |
| 나중의 runtime 구현 | 승인된 Gate 0 contract sheet와 Gate 1 evidence가 필수 입력 | 해당 round request/plan과 AGENTS wiring이 연 source |

모든 repository 작업은 먼저 `AGENTS.md` entry gate를 따른다. 즉 `docs/design.md` 전문과
`node scripts/decision-index.mjs --lang ko`를 열고, 아래 표에서 움직이는 decision subject의 원문만
`docs/design-decisions_ko.md`에서 읽는다. 연구 문서의 요약이 canonical source를 대신하지 않는다.

### 25.3 이미 고정된 것과 Gate 0에서 결정할 것

#### 이미 고정된 설계

- work anchor의 경로는 `devflow/tree/00-project/`, `01-foundation/`, capability work folder다(7.2).
- `00-project`는 기존 folder/card/progress grammar를 쓰는 research/synthesis scope이며 구현 코드를
  소유하지 않는다. 새 card 종류나 project capability가 아니다.
- recursive K path와 identity는 canonical owner 옆 same-stem subtree, owner subtree 전체에서 유일한
  `K-NNN`, same-stem parent/child다(8.3~8.4).
- research evidence는 closed card/source이고 current synthesis는 nearest owner/K다. 별도 dossier와
  두 번째 canon을 만들지 않는다.
- K writer는 greenfield `arch`, brownfield `adopt` 하나다. `product`, `work`, `verify`가 직접 쓰지 않는다.
- legacy history는 자동 migration하지 않고 C5의 세 exact descent gate로만 연다.
- multi-owner landing은 새 batch object 없이 공유 source locator와 residual marker set으로 표현한다.

#### 아직 Gate 0에서 정해야 하는 명세

- 상태 도구에 추가할 predicate/zone row의 stable name, exact observation field와 shape-table row
- C3/C6이 재사용할 기존 marker row와 owner 값 영역, parser 및 interrupted-boundary effect order
- `scripts/project-knowledge.mjs`가 project owner K와 recursive child projection을 맡는지에 대한 정본 결정
- C1~C6 simulator artifact 위치, fixture schema, oracle output과 실행 명령
- fresh-consumer acceptance의 정량 기준과 baseline 비교 방식. 보편 byte threshold를 발명하지 않는다.
- C5의 첫 legacy fixture로 사용할 실제 closed capability/card

이 항목들은 미래 AI가 repository 검색으로 알아서 정할 구현 세부가 아니다. Wave 0의 명시적
decision output이다. 하나라도 선택하지 못하면 `unknown`으로 보고하고 skill edit으로 넘어가지 않는다.

### 25.4 C1~C6 canonical source map

표의 파일은 **변경 확정 목록이 아니라 최초 영향 조사 목록**이다. AGENTS 규칙에 따라 purpose, owner,
input, consumer, recorded reason과 failure scene을 확인한 뒤 실제 target을 contract sheet에서 확정한다.

| 계약 | 먼저 열 canonical source | 움직일 가능성이 있는 decision subject | producer/consumer/test 후보 |
|---|---|---|---|
| C1 pre-product entry | `skills/resume/SKILL_ko.md`, `skills/split/SKILL_ko.md`, `skills/product/SKILL_ko.md`, `skills/principles/scripts/project-state.mjs` | DD-69, DD-73과 state zone ordering subject | request/resume → split; `scripts/project-state.test.js`; 7.2의 네 면제 fixture |
| C2 research evidence | `skills/principles/planning-evidence_ko.md`, `skills/principles/baseline-predicates_ko.md`, `skills/split/SKILL_ko.md`, `skills/work/SKILL_ko.md`, `skills/arch/SKILL_ko.md`, `skills/adopt/SKILL_ko.md` | DD-28, DD-67, DD-76~78 | research log → closed-card Source basis → arch/adopt K; `scripts/project-knowledge.mjs`, `scripts/project-knowledge.test.js` |
| C3 crosscut branch | `skills/split/SKILL_ko.md`, `skills/resume/SKILL_ko.md`, `skills/principles/scripts/project-state.mjs` | DD-54, DD-64, DD-87 | depth/mapping observation → split branch/ask; `scripts/project-state.test.js`의 multi-owner fixture |
| C4 recursive K writer | `skills/principles/SKILL_ko.md` ownership 표, `skills/principles/baseline-predicates_ko.md`, `skills/arch/SKILL_ko.md`, `skills/adopt/SKILL_ko.md` | DD-42/43, DD-76/78, DD-86/88/91 | owner marker → arch/adopt refresh → K projection; project-knowledge script/test |
| C5 legacy boundary | `skills/principles/baseline-predicates_ko.md`의 lifecycle/recovery, `skills/arch/SKILL_ko.md`, `skills/adopt/SKILL_ko.md` | DD-56, DD-68, DD-77 | current/hypothesis recheck → 세 descent gate → 새 closure; project-knowledge fixture |
| C6 atomic landing | `skills/principles/SKILL_ko.md` marker recovery/ownership, `skills/arch/SKILL_ko.md`, `skills/adopt/SKILL_ko.md`, `skills/principles/scripts/project-state.mjs` | DD-36, DD-54, DD-87/88/91 | synthesis markers → owner refresh → residual state/resume → closure; project-state fixture |

영어 deploy pair는 Korean canonical source와 구조·의미가 확정된 뒤 maintenance protocol의 번역 순서로
동기화한다. 위 표가 `_ko`를 먼저 지목하는 이유다.

### 25.5 Wave 0 contract sheet 완료 조건

C1~C6 각 행은 다음 필드를 모두 가져야 한다. 이 중 하나라도 비면 `review-required`이며 Wave 1의
해당 fixture도 실행할 수 없다.

| 필드 | 필요한 내용 |
|---|---|
| ID와 failure scene | 방지하려는 S1~S8 장면과 현재 실패 |
| observation | 기계가 보는 값과 AI가 판단하는 값의 분리, UNKNOWN 처리 |
| ROUTE/ASK/STOP | 한 상태에서 하나의 terminal action |
| canonical owner | 현재 fact, work, source/history 각각 한 집 |
| producer/consumer | 누가 만들고 어느 진입이 소비하는지 |
| exact format | 재사용하는 기존 row/field/locator와 값 영역; 새 형식이면 반증 부담 |
| effect order/reentry | commit 경계, 중단 시 HEAD 기준, 다음 state 우선순위 |
| decision impact | 움직이는 DD/DR subject와 recorded reason을 보존·반증하는 문장 |
| fixture/oracle | 입력 상태, 기대 route/read/write/closure, reject 장면 |
| cost | 새 artifact/state/mandatory read의 현행 대비 delta |

Gate 0은 이 sheet를 만드는 **설계 작업**이다. 그것을 만들기 위해 먼저 skill 문구나 parser를 바꾸지
않는다. Gate 1도 read-only/no-runtime simulator다. 실제 deploy 변경은 이 두 결과가 사용자에게 보고되고
다음 wave가 별도로 승인된 뒤에만 시작한다.

### 25.6 미래 AI의 자기 점검

다음 질문에 모두 답하지 못하면 구현을 시작하지 않는다.

1. 이 문서가 제안이고 아직 canonical decision이 아니라는 점을 말할 수 있는가?
2. 현행 강점과 target 변경을 구분했는가?
3. 두 plane, non-mirror, nearest owner, single writer, source/current 분리를 보존했는가?
4. C1~C6 각각의 producer, consumer, owner, effect, fixture가 contract sheet에 있는가?
5. `00-project`를 capability나 새 artifact로 만들지 않았는가?
6. recursive K를 모든 프로젝트에 강제하거나 legacy history를 일괄 migration하지 않는가?
7. passing tweak의 redesign delta 0과 총 read 0을 혼동하지 않는가?
8. `marker.glossary-term` seam을 이 request에 슬쩍 포함하지 않았는가? 그것은 별도 scoped repair다.
9. agent simulation을 runtime pass로 보고하지 않는가?
10. 승인된 wave 밖의 파일을 수정하지 않는가?

정답을 추론하려고 전체 repository를 검색하거나 문서에 없는 marker/path를 발명하면 fresh-consumer
handoff 실패다. 누락은 질문 또는 Gate 0 `unknown`으로 올리고, kernel을 새로 만들지 않는다.

## 조사 근거

### devflow 내부

- `docs/design.md`
- `docs/design-decisions.md`: DD-28, 33, 42~44, 48, 56, 59, 67, 69, 73, 76~78, 88, 91과
  DR-17~19, 25, 29~31
- `docs/design-backlog.md`
- `docs/research/loop-engineering-2026-08-21_ko.md`
- `docs/rounds/v0.18.8/report_ko.md`
- `skills/product/SKILL.md`
- `skills/adopt/SKILL.md`
- `skills/arch/SKILL.md`
- `skills/design/SKILL.md`
- `skills/split/SKILL.md`
- `skills/work/SKILL.md`
- `skills/verify/SKILL.md`
- `skills/resume/SKILL.md`
- `skills/principles/SKILL.md`
- `skills/principles/baseline-predicates.md`
- `skills/principles/planning-evidence.md`
- `skills/principles/scripts/project-state.mjs`

### JGNote 읽기 전용 사례

- `docs/ARCHITECTURE.md`
- `docs/architecture/FRONTEND.md`
- `docs/architecture/BACKEND.md`
- `docs/architecture/VERIFICATION.md`
- `docs/domains/registry.json`
- `docs/plans/backend-auth-foundation.md`
- `docs/plans/architecture-refactor.md`
- `docs/report/legacy-property/README.md`
- `docs/report/property-design/00-implementation-contract.md`
- `docs/specs/property-mockup-handoff.md`
- `docs/specs/auth-mockup-handoff.md`
- `tooling/architecture/lib/generator.mjs`

### 외부 아이디어 비교

- <https://github.com/modiqo/skillspec>
- <https://github.com/modiqo/skillspec/blob/main/spec/imports.md>
- <https://github.com/modiqo/skillspec/blob/main/spec/relationships.md>
- <https://github.com/modiqo/skillspec/blob/main/crates/skillspec-source/src/source_map.rs>
