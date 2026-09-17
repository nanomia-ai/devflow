---
title: Human and AI usage scenarios
status: current-plan
purpose: Test whether the proposed system remains natural across deep planning, iterative shaping, trivial changes, interruptions, and teams.
read_when: Read when evaluating practical usability or deciding how a request should enter the graph.
canonical_for: Human and AI walkthroughs and scenario outcomes; exact runtime contracts live in 08.
tags: [devflow-vnext, scenarios, ai-usability, teams]
---

# 사람·AI 사용 시나리오

## 1. 사용성 기준

사람은 stage 이름이나 문서 종류를 기억하지 않아도 된다. 아이디어를 말하거나, 변경을 요청하거나,
화면을 보며 다음 개선을 말하거나, “어디까지 했지?”라고 물으면 된다. AI는 현재 프로젝트 표식과
질문의 성격을 보고 필요한 읽기와 기록의 무게를 정한다.

AI가 잃지 않아야 할 것은 다음 다섯 가지뿐이다.

1. 지금 판단할 질문의 decision route와 결과가 살 canonical home.
2. 이번 요청에 필요한 최소 read set.
3. 현재 사실, 검증되지 않은 가설, 사용자의 평가를 기다리는 결과의 구분.
4. 이번 변경을 함께 닫아야 하는 범위와 따로 닫을 수 있는 범위.
5. 중단되어도 이어야 하는 작업이라면 디스크에서 찾을 수 있는 next action.

## 2. 서로 섞지 않는 세 축

Devflow는 작업을 “가벼움/무거움” 한 축으로 분류하지 않는다. 다음 세 판단은 서로 독립적이다.

| 축 | 한쪽 | 다른 쪽 | 결정 질문 |
|---|---|---|---|
| 시작 깊이 | 결과와 acceptance가 미리 분명함 | 관찰 가능한 작은 결과부터 shaping | 구현 전에 결과를 충분히 고정할 수 있는가, 아니면 구현이 가장 싼 학습 수단인가? |
| 작업 구조 | 하나의 closure | 여러 독립/연결 closure | 각 결과를 사용자가 독립적으로 수용·취소·검증할 수 있는가? |
| 기록 지속성 | 현재 turn의 ephemeral 변경 | 중단·인계 가능한 tracked 변경 | 코드 diff만으로 잃는 의도·미해결 판단·검증 책임이 남는가? |

따라서 얕은 시작도 tracked일 수 있고, 파일이 많은 기계적 변경도 ephemeral일 수 있다. 상세 spec을
썼다는 이유로 여러 artifact가 필요한 것도 아니며, shaping이라고 해서 Sketch를 먼저 거치는 것도 아니다.

## 3. 진입 시나리오

| 상황 | 진입과 결과 | 만들지 않는 것 |
|---|---|---|
| 모호한 신규 아이디어 | `sketch(project)`의 결론을 Product에 흡수 | 매 대화 transcript |
| 명확한 신규 brief | Product → Architecture → optional Design | 불필요한 Sketch |
| 기존 프로젝트 | Adopt가 유지 source를 내부 정본으로 완전 흡수 | 외부 문서에 의존하는 정본 |
| 닫힌 작은 수정 | 관련 정본을 읽고 ephemeral 구현·비례 검증 | spec/state/verification/team/landing |
| 결과가 분명한 변경 | Direct가 tracked spec을 발행하고 Work → Verify → closure | 전역 task DB |
| 보며 다듬는 변경 | Direct가 shaping envelope와 첫 slice를 발행; Work와 review를 반복 | 처음부터 완성된 화면을 예언하는 상세 spec |
| 제품·도메인 판단이 먼저 필요한 변경 | Direct → `sketch(change)` → Direct | 구현으로 빨리 배울 수 있는 질문의 장기 탐구 |
| 중단·방치된 작업 | Resume이 continue / reconcile / abandon 중 가능한 route를 보고 | transcript 복원·자동 수리 |

## 4. Sketch를 만드는 때

아이디어 대화만으로 문서를 만들지 않는다. 구현보다 먼저 풀어야 할 질문을 다음 turn까지 보존해야 하고
그 결과가 돌아갈 route를 식별할 수 있을 때 Sketch를 만든다. 구현이 가장 싼 증거라면 Direct의 shaping으로 간다.

생성물은 `.devflow/sketches/S-<slug>-<token>/brief.md`와 `state.md`다. 독립 조사 질문이 실제로
조건부 읽기 이익을 가질 때만 `findings/`로 나눈다. Project Sketch는 Product 이전의 탐구를,
Change Sketch는 현재 변경을 막는 판단만 소유한다. 결정된 현재 지식은 목적지에 자기완결 문장으로
흡수하고 Sketch를 삭제한다.

## 5. 명확한 기획과 점진 Adopt

충분한 기획서나 명확한 설명이 있으면 Product로 직행한다. Product는 기술 스택과 작업 순서를 판단하지
않고 Architecture가 구조와 검증 채널을 정한다. UI가 없으면 Design은 건너뛴다.

Adopt는 유지 source를 내부 Product·Architecture·Design·Domain tree로 흡수한다. 큰 저장소도 vertical
slice로 작성할 수 있지만 회계되지 않은 source 의미를 발명하지 않는다. Adoption 중 작업 허용 경계는
08 §5의 readiness 계약을 따른다.

## 6. 하나의 Direct 계약과 선택적 shaping 정보

결과가 분명하면 Work가 구현 방법을 자율 선택하고 Verify가 acceptance를 판정한다. 구현물을 보아야
결정할 수 있으면 Direct는 안정된 결과와 guardrail 안에서 현재 reviewable slice만 정한다. 성공한 관찰은
실패가 아니라 다음 slice 또는 closure를 고르는 입력이다. 별도 spec mode를 만들지 않으며, 정확한 shaping
정보와 amendment 계약은 08 §6이 소유한다. 안전한 slice조차 정할 수 없는 제품·도메인 질문만 Sketch로 보낸다.

## 7. ephemeral과 tracked의 근본 경계

현재 turn 밖으로 복구할 의도, 아직 착지하지 못한 durable knowledge, 남은 검증·위험·조율 책임 중 하나가
있으면 tracked다. 그렇지 않으면 관련 정본을 읽고 같은 turn에 ephemeral하게 닫는다. 크기는 기준이 아니므로
한 줄의 binding change가 tracked이고 큰 기계적 rename이 ephemeral일 수 있다. 도중에 경계가 바뀌면
그 시점의 dirty delta를 인수해 tracked로 승격한다. 정확한 gate와 checkpoint는 08 §6이 소유한다.

## 8. 하나를 갱신할지 새로 만들지

같이 수용·취소할 active 결과의 보완은 같은 spec에서 이어지고, 독립적으로 수용할 결과나 닫힌 작업의
후속은 새 판단으로 시작한다. 파일·페이지·worker 수는 경계가 아니다. 여러 local 결과가 공유 acceptance를
가지면 그 acceptance도 한 canonical spec에 있어야 한다. 정확한 identity·integration·amendment 계약은
08 §6이 소유하며 실행 중 계약을 조용히 바꾸지 않는다.

## 9. Work·review·Verify loop

Work가 전제 오류나 비효율을 발견하면 목표·acceptance를 조용히 바꾸지 않는다. 마지막 안전 지점,
깨진 전제, 가능한 최소 변경, product 경계 영향을 state에 남기고 Direct로 돌린다.

Shaping의 중간 review는 최종 closure 판정과 다르다. Review는 현재 slice에서 무엇을 배웠고 다음 slice가
무엇인지를 결정한다. Risk gate Verify의 `proven`도 criterion 판정일 뿐 자동 closure가 아니다. Stop
condition이 도래하고 closure criteria가 입증됐을 때만 전체를 닫는다.
시각적·질적 criterion은 사용자의 명시적 수용을 evidence로 사용할 수 있으며 자동 regression check가
가능한 부분은 함께 실행한다.

Verify 실패에는 criterion별 evidence와 failure route, 재시도 전에 달라져야 할 것을 남긴다. 관찰할 수
없으면 pass가 아니라 `unproven`이다. 세부 형식은 08 §6이 소유한다.

## 10. 중단, 재개, 방치 정리

Tracked artifact에서는 spec, Git, state가 각각 의도, 실제 bytes, 다음 행동의 canonical home이다.
관리권이 바뀌기 전에 끝내지 못하면 state를 최신 snapshot으로 교체한다. 임의 process kill의 무손실
복구는 약속하지 않으며 불완전·상충 상태를 current로 추측하지 않는다.

Resume은 현재 checkout의 immediate state와 Git을 읽고 다음 중 하나를 보고한다.

- `continue`: 계약과 실제 변경이 맞고 다음 행동이 있다.
- `reconcile`: 코드가 이미 통합됐거나 state와 실제 결과가 달라 custody actor의 확인이 필요하다.
- `abandon`: 목표를 더 진행하지 않고 partial code와 landing을 명시적으로 처분해야 한다.

Resume은 읽기 전용이며 직접 고치거나 삭제하지 않는다. 재개 actor가 state를 쓰면 custody를 인수하고,
파괴적·모호한 처분은 사용자에게 묻는다. Continue/reconcile/abandon의 정확한 처분은 08 §8이 소유한다.

## 11. 팀·worktree·외부 orchestration

공유 사실은 활성 artifact state에, 개인·환경 맥락은 `team/<member>/<artifact-id>.md`에 둔다. 하나의
state snapshot은 한 시점에 한 actor만 쓰며, 병렬 작업은 지역 고유 artifact와 안정적인 seam을 우선한다.
같은 canonical home의 상충 변경은 자동 상태 병합이 아니라 Git/PR의 merge·decision 사건이다.

Orca, Codex subagent, Claude, 단일 agent 중 무엇을 쓰는지는 외부 orchestrator가 정한다. Devflow spec은
host-neutral한 결과·read-first·write boundary·acceptance만 전달한다. worker에게 plugin이 없어도 선택된
spec과 정본으로 작업할 수 있어야 한다.

## 12. 설치 전·오발동·버전 차이

`.devflow/`가 없는 저장소에서 managed-only skill이 호출되면 쓰기 전에 중단하고 Sketch, Product,
Adopt 중 가능한 진입만 안내한다. `.devflow/`는 있지만 index가 없거나 읽히지 않으면 unmanaged로
재초기화하지 않고 02 §6의 복구 gate를 따른다. Hook은 편의 기능이며 없어도 gate가 동작한다. 실제 운영된 구버전
Devflow 프로젝트가 없으므로 vNext는 legacy 호환 state나 migration 없이 시작한다.
