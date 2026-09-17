---
title: Intent, failure evidence, and planning contract
status: current-plan
purpose: Preserve the user's intended outcome and separate observed failures from design hypotheses.
read_when: Read before changing the proposed skill set, document ownership, or delivery order.
canonical_for: The planning problem, fixed goals, constraints, and non-goals.
tags: [devflow-vnext, intent, failure-evidence, constraints]
---

# 의도·실패 증거·기획 계약

## 1. 해결하려는 사용자 부담

AI와 함께 장기간 개발할 때 기획·제품·기술·도메인·작업 지식이 사라지거나 서로 경쟁하지 않고,
새 세션과 여러 팀원이 작은 읽기 비용으로 현재 목적과 다음 행동을 찾을 수 있어야 한다. 사용자는
AI를 절차에 가두는 것이 아니라, 충분한 배경과 명확한 소유 경계를 제공해 AI의 판단력을 실제로
활용하려 한다.

## 2. 고정 목적

1. **실사용성 우선:** 내부 형식의 완성도보다 사람과 AI가 실제 요청을 끝낼 수 있는가를 먼저 본다.
2. **AI 자율 판단 보존:** 목적·금지·권위·현재 상태는 분명히 하되 방법과 모든 예외를 미리 쓰지 않는다.
3. **점진적 검증:** 한 번에 전체 체계를 만들지 않고, 하나의 계약과 하나의 관찰을 가진 수직 조각부터 검증한다.
4. **지식의 자연스러운 누적:** 작업에서 확인된 현재 진실이 Product, Architecture, Design, Domain, ADR 중 맞는 canonical home에 반영된다.
5. **선택적 읽기:** AI는 짧은 지도와 문서 헤더만으로 현재 질문에 필요한 문서를 결정하고 나머지는 열지 않는다.
6. **팀·중단 내구성:** 단일 에이전트, 서브에이전트, 외부 터미널, 여러 Git worktree, 세션 중단과 재개를 같은 문서 의미로 다룬다.
7. **실패의 비증식:** 한 실패를 모든 실행의 새 규칙으로 만들지 않으며, 반복 관찰과 소유 층이 확인될 때만 최소 개입을 추가한다.
8. **내부 완전성:** 기존 자료와 모든 skill 산출물은 `.devflow/` 내부 수명 계층으로 흡수하며, 외부 문서의 존속에 프로젝트 이해가 의존하지 않는다.
9. **자연 규칙 우선:** 예측 가능한 사례를 프롬프트에 열거하지 않고, 소유 경계·현재 스냅숏·검증 증거처럼 새 상황에도 그대로 적용되는 원리로 해결한다.
10. **비례하는 의식:** 상세 기획, 관찰 기반 shaping, 즉시 닫히는 수정이 같은 지식 체계를 쓰되 필요 이상의 임시 문서를 만들지 않는다.

기존 Devflow로 실제 운영된 프로젝트는 없고 테스트 fixture만 있다. 따라서 vNext는 hard cut이다.
레거시 상태·파일·API를 읽는 adapter, migration, compatibility layer를 만들지 않는다. `adopt`는 예전
Devflow 프로젝트를 업그레이드하는 기능이 아니라 Devflow가 없는 임의의 기존 프로젝트를 흡수하는
진입이다.

## 3. 성공 증거

- 처음 보는 AI가 짧은 진입 문서만 읽고 올바른 다음 스킬과 정본을 선택한다.
- 단순 수정은 문서 부산물 없이 끝나고, 긴 작업은 중단 후 다른 AI가 실제로 이어서 완료한다.
- 결과가 미리 정해진 작업과 구현물을 보며 다듬는 작업이 서로를 예외 취급하지 않고 같은 closure 규칙으로 끝난다.
- 기능 작업에서 확인된 도메인 지식이 개인 메모나 완료된 spec에 갇히지 않고 올바른 공용 문서로 승격된다.
- verify 실패가 같은 이유로 반복되지 않고, 실패 종류에 따라 work/direct/domain/architecture/product 중 올바른 층으로 돌아간다.
- `.devflow`가 없는 프로젝트에서 관리 단계 스킬이 조용히 발동하지 않는다.
- Claude와 Codex에서 설치·시작·명시/암시 호출이 실제 fresh session 관찰로 확인된다.
- 시간이 지나 문서가 많아져도 현재 질문과 관련된 읽기 집합은 작게 유지된다.

## 4. 관찰된 실패와 해석

| 구분 | 관찰된 사실 | 해석 또는 설계 함의 |
|---|---|---|
| 과대 구현 | 레거시 배포물은 수백 개 파일과 약 8.55MB 규모이며 각 stage에 큰 Skill Rails runtime·fixture·ledger가 반복된다. | 하나의 기술적 완성도를 높이는 동안 전체 사용 경로와 비용이 사라졌다. 새 설계는 모든 stage를 동시에 고도화하지 않는다. |
| AI 판단의 대체 | 생성된 `principles` 진입문은 Decision 생성, effect 기록, align, reinvoke 등 긴 실행 계약을 항상 요구한다. | 결정 가능한 형식과 의미 판단을 분리하지 못했다. 스크립트는 기계 판정만, 의미와 예외 판단은 AI/사용자에게 둔다. |
| 규칙 증식 | 문서 문법, 상태 전이, commit, retry, publish, room, capsule가 서로 결합했다. | 한 실패가 새 전역 규칙이 되는 경로를 막고, 관찰된 반복 실패에만 국소 장치를 추가해야 한다. |
| 읽기 비용 | 레거시 field 기록에는 한 web-app cycle에서 canon 365KB를 읽은 사례와 891-line entry가 tool output 한도를 넘은 사례가 있다. | always-read는 지도·목적·진입 경계만 갖고, 상세는 현재 입력으로 판별 가능한 조건부 문서여야 한다. |
| 전달 미검증 | 역할 brief와 자동 전달 장치가 여러 번 재구성됐으나 cold session 도달 효과는 미검증으로 남았다. | 파일·build·hash는 전달 증거일 뿐이다. fresh-use에서 AI 행동을 관찰하기 전에는 `unproven`이다. |
| Adopt 과부하 | 최초 도입에서 모든 maintained source와 완전한 지식 체계를 한 번에 작성하려 했다. | 전체 source는 회계하되 문서는 vertical slice로 작성한다. Adoption 중 tracked 변경은 08 §5의 세 증거를 만족한 경계에만 연다. |

위 해석은 과거 구조를 반대로 뒤집으면 정답이라는 뜻이 아니다. 새 수단은 독립적으로 검증한다.

## 5. 성공 레퍼런스에서 확인된 것

중개노트는 문서 수가 적어서가 아니라 다음 구조 때문에 안정적으로 작동한다.

- Product, Architecture, Design, 기능 handoff, ADR, registry, 코드는 서로 다른 질문의 canonical home이다.
- `docs/README.md`가 질문별 진입점만 제공하고 상세 문서를 조건부로 여는 원리를 보여 준다. 새 Devflow는 그 원리를 `.devflow/index.md`와 내부 tree로 일반화한다.
- 도메인은 메뉴가 아니라 업무 상태와 규칙의 소유자다.
- registry는 현재 구현 상태·공개 seam·검증을 기계 판독 가능한 형태로 제공한다.
- 생성 지도는 탐색 보조일 뿐 정본이 아니다.
- 임시 계획·연구·실행 로그가 현재 정본과 경쟁하지 않는다.

새 Devflow는 이 원리를 일반화하되 중개노트의 구체 기술 stack, 거대한 auth handoff, 상세 registry
필드를 기본값으로 복사하지 않는다.

## 6. 핵심 긴장과 선택

| 긴장 | 이번 계획의 선택 |
|---|---|
| 기록을 적게 하면 맥락이 사라지고 많이 쓰면 정본이 경쟁한다 | `.devflow/` 안에서 수명과 소유자를 분리한다: sketch/work/member 기록은 임시, 승인된 현재 진실만 project 정본으로 흡수한다. |
| 외부 문서를 참조하면 입력 삭제와 과거·현재 혼재가 생긴다 | Adopt의 inventory는 일시 증거이고 최종 project 문서는 자기완결적이어야 한다. 완료된 scratch는 삭제하고 Git만 과거를 보존한다. |
| 스킬을 분리하면 chaining 비용이 생기고 합치면 거대 진입문이 된다 | 각 스킬을 한 종류의 열린 질문을 결정하는 route로 유지하고 `목적 → 출력 → 다음 선택지`만 연결한다. 슈퍼 라우터를 만들지 않는다. |
| 프로젝트 기획과 기능 기획은 닮았지만 산출물이 다르다 | 하나의 `sketch`가 두 scope를 지원하되, project sketch는 Product로, change sketch는 Direct spec으로 반환한다. |
| 팀 상태를 중앙화하면 충돌하고 분산하면 지식이 흩어진다 | 활성 산출물의 state snapshot은 한 actor만 쓰고 병렬 단위는 별도 artifact로 나눈다. 코드·정본 경계 중첩은 Git/PR에서 통합하며 개인 기록의 공유 사실만 state나 정본으로 승격한다. |
| 모든 중단 경우를 규칙으로 쓰면 프롬프트가 비대해진다 | 관리권이 바뀌기 전에 현재 행동을 끝낼 수 없으면 해당 artifact state를 최신 스냅숏으로 만든다는 한 원칙을 모든 단계에 적용한다. |
| 상세 spec은 안전하지만 탐색적 UI를 거짓으로 고정하고, 얕은 시작은 맥락을 잃기 쉽다 | 시작 깊이, closure 분할, 기록 지속성을 독립 판단한다. Shaping은 안정된 결과·guardrail·현재 slice·관찰 조건만 고정하고 같은 spec을 갱신한다. |
| 작은 작업을 모두 기록하면 마찰이 커지고 크기만으로 생략하면 중요한 결정을 잃는다 | diff로 복구할 수 없는 의도, 현재 turn에 canon으로 닫히지 않는 지식/결정, turn 밖 검증·위험·조율 중 하나가 있으면 tracked로 만든다. 그 외는 ephemeral하게 닫는다. 상세 계약은 08 §6이 소유한다. |
| 추가 개선마다 새 spec을 만들면 파편화되고 기존 spec을 영원히 고치면 과거가 현재가 된다 | 안정 outcome/non-goal/guardrail 아래 하나로 수용할 active 결과는 같은 spec을 갱신하고, 독립 결과·대체된 outcome·닫힌 결과의 후속은 새 판단으로 시작한다. 상세 계약은 08 §6이 소유한다. |
| 기계화는 drift를 막지만 AI 사용을 경직시킨다 | 초기에는 존재·참조·상태값처럼 결정 가능한 최소 검사만 둔다. 반복 실패가 관찰된 뒤에만 checker를 확장한다. |

## 7. 범위 밖

- 레거시 Devflow와의 상태/파일/API 호환·migration·adapter
- 첫 버전에서 모든 프로젝트 유형을 위한 완전한 domain registry schema
- 범용 오케스트레이션, agent launcher, Git worktree 관리자
- 모든 작업에 research, ADR, spec, handoff, retrospective를 의무화하는 체계
- 스킬 문장만으로 정확한 AI 행동을 보장한다는 주장

## 8. 결정 권한

이 계획은 명시된 목적 안에서 스킬 경계, 문서 소유권, 읽기 흐름과 실험 순서를 제안한다. 제품명,
배포 정책, brownfield 완료 기준, 문서 보존 기간처럼 결과를 크게 바꾸는 결정은 소유자 승인 후
확정한다. 미확인 host 동작과 fresh-agent 효과는 추론으로 채우지 않고 `unproven`으로 둔다.
