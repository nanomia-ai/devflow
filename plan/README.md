---
title: Devflow vNext planning map
status: current-plan
purpose: Route readers through the current whole-system plan and its compact history record.
read_when: Start here when reviewing, implementing, or challenging Devflow vNext.
canonical_for: Current planning state; implemented behavior exists only where phase evidence records it.
tags: [devflow-vnext, planning, index]
---

# Devflow vNext 기획 지도

이 기획의 목표는 스킬을 많이 만드는 것이 아니라, 사람이 요청하고 AI가 판단·구현하는 흐름에서
필요한 지식만 읽히고 검증된 지식이 장기간 자연스럽게 축적되는 최소 체계를 만드는 것이다.
레거시는 실패 증거이며 호환 대상이 아니다. 중개노트는 성공 원리를 관찰하는 읽기 전용 사례이며
복제 대상이 아니다.

## 현재 수렴안

- 프로젝트 정본과 모든 Devflow 산출물은 `.devflow/` 하나에 두고, host 파일은 index를 가리키는 연결부로만 쓴다.
- 공개 skill은 `sketch`, `product`, `architecture`, `design`, `adopt`, `direct`, `work`, `verify`, `resume`이며 Domain은 지식 분할 축이다.
- Owner는 canonical path, skill은 열린 판단의 route, actor는 현재 writer로 구분한다.
- 시작 깊이, closure 구조, 기록 지속성을 독립 판단해 상세 기획·shaping·ephemeral 수정이 필요한 무게만 쓴다.
- Tracked 작업은 실행 계약·현재 snapshot·검증 증거만 보존하고, 확인된 장기 지식만 기존 project home에 흡수한다.
- 문서는 한 독자 질문에 답하며 길이가 아니라 조건부 선택 가능성·응집성·총비용으로 나누고 다시 합친다.
- Skill Rails는 얇은 target의 저작·배포 경계로만 사용하고 project runtime engine으로 만들지 않는다.
- 구현은 작은 fixture와 fresh-agent 관찰에서 시작해 현재 가정이 반증될 때만 구조를 늘린다.

## 문서별 읽기 경로

| 알고 싶은 것 | 읽을 문서 |
|---|---|
| 왜 다시 설계하며 무엇을 성공으로 보는가 | [01-intent-and-evidence.md](01-intent-and-evidence.md) |
| 스킬 관계, gate, 문서 트리, 지식 승격 | [02-skill-and-document-architecture.md](02-skill-and-document-architecture.md) |
| 사람·AI·팀이 실제로 어떻게 사용하는가 | [03-usage-scenarios.md](03-usage-scenarios.md) |
| 무엇부터 구현하고 어떤 관찰로 다음 단계에 가는가 | [04-delivery-and-validation.md](04-delivery-and-validation.md) |
| 레거시·중개노트·공식 호스트 조사 근거 | [05-research-evidence.md](05-research-evidence.md) |
| 합의·잠정·거부 결정과 재검토 조건 | [06-decision-ledger.md](06-decision-ledger.md) |
| 각 문서가 답할 질문, 본문 형식, 병렬·중단 계약과 Skill Rails 작성 구조 | [08-document-contracts.md](08-document-contracts.md) |
| 중개노트·레거시·신규 도출의 경계와 K 없는 조건부 분해의 근거 | [09-reference-boundaries-and-document-decomposition.md](09-reference-boundaries-and-document-decomposition.md) |
| 설계 반복의 변화와 복구 가능한 동결본 | [HISTORY.md](HISTORY.md) |

## 이 계획이 하지 않는 것

- 레거시를 호환 대상이나 신규 구현의 fallback으로 사용하지 않는다.
- 스킬, 훅, 설치 패키지, renderer를 phase gate보다 앞서 구현하지 않는다.
- 아직 문서 schema를 범용 프레임워크로 만들지 않는다.
- 빌드 성공을 AI 사용성의 증거로 간주하지 않는다.
- 미래 가능성만으로 규칙·필드·스크립트를 추가하지 않는다.

## 설계 반복 기록

활성 검색면에는 현재 계약만 둔다. 이전 여섯 전체 스냅샷의 변화 요약과 검증 가능한 압축 보관본은
[HISTORY.md](HISTORY.md)에 있다. 새 검토마다 현재 문서 전체를 복제하지 않고, 판단을 바꾼 근거와
결정 delta만 기록한다. 잠정 결정에는 그것을 뒤집을 가장 값싼 관찰을 둔다.
