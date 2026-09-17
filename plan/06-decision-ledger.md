---
title: Planning decision ledger
status: current-plan
purpose: Preserve why the current design was chosen, what remains provisional, and what evidence may reverse it.
read_when: Read when challenging the architecture or deciding whether new evidence justifies a change.
canonical_for: Planning rationale and falsifiers, not runtime behavior or design history.
tags: [devflow-vnext, decisions, evidence, inversion]
---

# 기획 결정 원장

## 1. 이 문서의 경계

현재 실행 구조는 02, 문서·artifact 계약은 08, 검증 순서는 04가 소유한다. 이 원장은 그 규칙을 다시
적지 않고 **왜 선택했는지, 무엇이 관찰되면 바꿀지**만 보존한다. 설계 반복의 순서는
[HISTORY.md](HISTORY.md), 조사 근거는 [05-research-evidence.md](05-research-evidence.md)가 소유한다.

현재안은 레거시·중개노트·공식 host를 독립 조사한 뒤 coordinator안과 별도의 Fable안을 대립시키고,
여러 차례 역발상·중단·병렬·shaping 시나리오로 다시 공격해 수렴했다. 검토 합의 자체를 증거로 삼지
않으며, 실제 AI 행동과 host effect는 04의 fresh-use 관찰 전까지 `unproven`이다.

## 2. 채택한 결정과 이유

| 결정 축 | 선택 이유 | 실행 정본 |
|---|---|---|
| 내부 정본 | 모든 Devflow 지식을 `.devflow/`에 흡수해 외부 자료 삭제와 과거·현재 혼재를 견딘다. | 02 §§1, 5, 13; 08 §§3–5 |
| 책임 구조 | Owner는 canonical path, skill은 열린 질문의 route, actor는 현재 writer로 구분한다. | 02 §§2–3, 8 |
| 공개 skill | Sketch·Product·Architecture·Design·Adopt·Direct·Work·Verify·Resume의 서로 다른 판단 책임만 남기고 Principles·Domain·Land runtime은 두지 않는다. | 02 §§3–4 |
| 지식 분할 | Domain은 stage가 아니라 업무 지식 축이며, 길이가 아니라 조건부 독자 질문과 변경 이유로 문서를 나눈다. | 08 §§2.1, 3; 09 |
| 비례하는 작업 | 시작 깊이, closure 구조, 기록 지속성을 분리해 상세 기획·shaping·ephemeral 수정이 같은 체계를 과잉 의식 없이 쓴다. | 03 §§2, 6–8; 08 §6 |
| 실행과 복구 | Tracked 작업은 최소 contract·현재 snapshot·검증 증거만 분리하고 Git을 실제 bytes와 과거 이력으로 사용한다. | 08 §§6–8 |
| 지식 착지 | 완료 spec을 장기 정본으로 보존하지 않고 확인된 현재 사실만 기존 canonical home에 반영한다. | 02 §12; 08 §6 |
| 팀 작업 | 공유 사실과 개인 맥락을 분리하고 state lock이나 room 대신 한 snapshot writer와 Git/PR 통합을 사용한다. | 02 §14; 08 §§7–8 |
| 저작·배포 | Skill Rails는 얇은 prose target의 source/build 경계이며 project runtime engine이 아니다. Hook은 correctness 전제가 아닌 짧은 진입 보조다. | 08 §9; 04 §§13–14 |

## 3. 구현 관찰로만 바꿀 잠정 결정

| 현재 기본안 | 뒤집을 관찰 |
|---|---|
| 별도 Land 없이 canonical-home landing과 Work closure | 서로 다른 작업에서 같은 이유로 durable fact 승격이 반복 누락됨 |
| 독립 Sketch 또는 Resume skill | Product/Direct와 project pointer만으로 checkpoint·재개가 항상 더 자연스럽게 동작함 |
| `team/<member>/<artifact-id>.md` | colocated 개인 파일이 팀원별 공간 의도와 탐색 비용에서 반복적으로 우월함 |
| `summary/read_when` header와 수동 index | prose lede가 두 host에서 같은 relevance를 보이거나 누락·죽은 link·misroute가 반복됨 |
| 분리된 `spec/state/verification` | 단일 closure 문서가 writer 충돌·중단 복구·읽기 비용에서 반복적으로 우월함 |
| Domain tree와 수명별 transient folder | 더 단순한 물리 구조가 의미 손실 없이 반복 misread와 cleanup 비용을 줄임 |
| K 없는 조건부 parent/child tree | owner·수명·선택 가능성으로도 관련 depth를 반복해서 찾지 못함 |
| ephemeral/tracked의 세 질문 | 복구·지식·검증 책임을 예측하지 못하거나 불필요한 artifact를 일관되게 만듦 |
| shaping envelope와 one-closure 경계 | fresh agent가 slice·stop·artifact identity를 반복 오해하고 더 단순한 경계가 이를 줄임 |
| SessionStart adapter | project pointer만으로 충분해 hook on/off가 행동 차이를 만들지 않음 |

잠정은 기능을 미리 더 만든다는 뜻이 아니다. 현재 작은 기본안을 사용하고 해당 관찰이 생길 때만
그 결정을 다시 연다.

## 4. 다시 들이지 않을 대안

| 대안 | 기각 이유 |
|---|---|
| 레거시 runtime·compatibility·전역 lifecycle | 실제 운영 호환 대상이 없고 stage마다 상태·규칙·vendor code를 복제했던 실패를 되살린다. |
| 외부 `docs/` 정본 또는 완료 artifact의 영구 archive·묘비 | 삭제 가능한 입력과 과거 작업이 현재 진실과 경쟁한다. |
| 거대 Principles·super-router·모든 target의 장문 공통 manual | 필요한 판단보다 always-read 규칙이 커지고 AI의 자율 판단을 대체한다. |
| K 번호·capsule·고정 taxonomy·수치 예산 | 의미 경계를 기계적 identity와 분량 기준으로 바꾼다. |
| room·claim·journal·phase enum·중앙 번호 | Git과 현재 snapshot으로 풀 수 있는 문제에 별도 상태 기계를 만든다. |
| 첫날부터 schema·generator·renderer를 확대하는 것 | 관찰되지 않은 drift를 해결하느라 behavior 검증을 미룬다. |
| fixed/shaping 별도 mode, 크기 기반 작업 등급, 사례별 예외 목록 | 같은 근본 판단을 여러 분기로 복제해 새 모순을 만든다. |
| build receipt나 hook 존재를 AI 행동 증거로 보는 것 | 전달과 실제 이해·효과를 혼동한다. |

## 5. 잔여 미검증

- Skill Rails authoring 비용과 generated support file의 실제 AI noise
- project pointer와 SessionStart hook의 effect 차이
- `spec/state/verification` 분리가 단일 closure 문서보다 실제로 작은지
- 팀 namespace와 snapshot custody가 장기 병렬 작업에서도 자연스러운지
- 별도 Land 없이 durable fact가 반복 누락되지 않는지
- `summary/read_when`과 조건부 tree가 장기 편집 뒤에도 관련 depth만 여는지
- Adopt가 큰 brownfield에서도 invention을 억제하고 외부 입력 삭제 뒤 같은 이해를 유지하는지
- shaping과 ephemeral gate가 강한 모델뿐 아니라 약한 모델·비설치 worker에서도 같은 판단을 만드는지

이 항목은 문장을 더 붙여 해결하지 않는다. [04-delivery-and-validation.md](04-delivery-and-validation.md)의
가장 작은 관찰에서 결과가 바뀔 때만 현재 결정을 수정한다.
