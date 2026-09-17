---
title: Reference boundaries and conditional document decomposition
status: current-plan
purpose: Separate what Devflow learned from the successful jgnote workflow and the failed legacy system, then explain why vNext uses ordinary conditional child documents instead of a K subsystem.
read_when: Read when tracing a design choice to its evidence, splitting or recombining a project document, or deciding whether a new document layer is justified.
canonical_for: Benchmark provenance and the rationale behind the document-decomposition boundary; operational document rules live in 08 and validation lives in 04.
tags: [devflow-vnext, provenance, jgnote, legacy, decomposition, conditional-reading]
---

# 레퍼런스 경계와 조건부 문서 분해

## 1. 이 문서가 막는 두 실패

첫째, 잘 작동한 중개노트의 **원리**와 그 프로젝트의 물리 구조를 혼동해 범용 Devflow에 복제하는
실패를 막는다. 둘째, 레거시 K가 해결하려던 선택적 읽기 문제를 되살리면서 번호·캡슐·예산·절차까지
다시 들여와 문서보다 문서 관리 체계가 커지는 실패를 막는다.

이 문서는 출처별 공로표가 아니다. 현재 설계의 각 부분을 다음 세 상태로 구분하는 판단 지도다.

```text
중개노트에서 관찰한 성공 원리 ─┐
레거시에서 확인한 필요와 실패 ─┼─▶ vNext의 새 경계 ─▶ 작은 fixture에서 검증
현재 사용자 의도·Skill Rails ──┘
```

- **benchmark:** 실제 사용 중 안정적으로 작동한 원리
- **retained lesson:** 실패한 구현에서도 여전히 유효한 문제와 책임
- **new hypothesis:** 두 사례를 복제하지 않고 현재 목적에 맞게 새로 도출했으며 아직 검증해야 할 구조

새 구조를 benchmark처럼 확정 사실로 부르지 않는다. 구현 전에는 설계 가설이고, fresh-agent
관찰을 통과한 범위만 proven으로 올린다.

## 2. 어디서 무엇을 가져왔고 어디서 멈췄는가

| 출처 | 가져온 것 | 가져오지 않은 것 | vNext에서 도출한 경계 |
|---|---|---|---|
| 중개노트 | 문서마다 서로 다른 질문을 소유하는 구조, 얕은 진입 지도, 조건부 상세 읽기, Product·Architecture·Design·Domain·결정 이유·작업 인계의 관할 분리, 현재 정본과 작업 중 추론의 분리 | `docs/`라는 경로, 특정 monorepo·UI·backend 기술 축, registry의 고정 필드, 큰 handoff 형식, 성숙한 checker를 모든 프로젝트에 선적하는 방식 | 같은 원리를 `.devflow/` 하나에 배치하고, root index는 최상위 질문만, 부모는 자기 subtree만 route한다. 작업 인계는 영구 기능 문서가 아니라 수명이 있는 state/team 문서로 제한한다. |
| 레거시 Devflow | Sketch/Product/Architecture/Design/Adopt/Direct/Work/Verify/Resume가 다루려 한 서로 다른 사용자 문제, Domain 지식·결정 이유·헤더·인덱스·중단 복구·팀 인계의 필요, K가 찾으려 한 “함께 읽고 같은 이유로 바뀌는 지식 단위” | capability 번호, `K-NNN` 정체성, capsule lifecycle, 고정 줄·개봉 예산, 전역 glossary·registry·projection 명령, stage마다 복제된 runtime과 장문 공통 절차, 지식 착지를 별도 상태 기계로 만드는 방식 | K라는 subsystem 없이 평범한 부모·자식 문서와 `summary/read_when`으로 같은 목적을 달성한다. Skill은 판단 경로, 경로는 정본 소유자, Git은 과거, state는 현재 작업 좌표만 소유한다. |
| 새 Skill Rails와 현재 사용자 요구 | 하나의 canonical source graph, 얇고 독립 실행 가능한 entry, 현재 입력으로 판단 가능한 optional-module 조건, delivery와 behavior/effect 증거의 분리 | 저작 도구를 프로젝트 runtime engine으로 쓰는 것, 모든 예외를 산문과 module로 선제 구현하는 것 | 스킬 규칙과 프로젝트 문서법의 authored owner를 분리한다. 분해는 형식 검사기가 아니라 AI가 의미로 판단하고, checker는 경로·header·dangling route만 검사한다. |

이 경계에서 특히 중요한 것은 **성공 사례의 결과 모양을 복사하지 않고 성공을 만든 힘을 옮기는 것**이다.
중개노트의 frontend/backend/validation 분리는 그 프로젝트에서 질문·변경 이유가 실제로 달랐기 때문에
유효하다. 따라서 범용 Devflow는 그 이름들을 기본 폴더로 만들지 않고, 같은 독립성이 관찰될 때 선택할
수 있는 예로만 취급한다.

## 3. K에서 보존할 원리와 폐기할 장치

레거시 K의 핵심 질문은 옳았다.

> 모든 내용을 항상 읽지 않으면서도, 현재 판단에 필요한 깊이를 놓치지 않으려면 지식의 경계를 어디에 두는가?

보존할 답은 두 가지다.

1. 한 지식 단위 안에서는 독자가 내용을 함께 판단하고 같은 이유로 고칠 수 있어야 한다.
2. 부모가 자식의 존재와 개봉 조건을 알려 주어, 독자가 전체 tree를 검색하지 않아도 된다.

폐기할 것은 그 답을 하나의 독립 시스템으로 만든 장치다.

- K 번호와 capsule 전용 명명법
- 문서 길이·줄 수·토큰 예산을 의미 경계로 쓰는 규칙
- capability 번호 아래에만 지식을 배치하는 고정 축
- header projection, 개봉 승인, freshness, marker, validator가 결합된 runtime
- 기존 문서와 K 사이에 같은 결론을 요약해 두는 두 번째 지식 집

vNext에는 K가 없다. 필요한 경우 `architecture/<concern>.md`, `design/<concern>.md`,
`domains/<domain>/<concern>.md` 같은 **평범한 자식 문서**가 있을 뿐이다.
부모의 route와 자식의 `read_when`이 충분하지 않다면 새 이름이나 번호가 아니라 분해 경계 자체를 고친다.

## 4. 유지한 결정을 현재 목적에 맞게 좁힌 경계

일부는 레거시의 유효 결정을 유지한 것이고, 일부는 중개노트와 레거시 어느 한쪽에도 그대로 있지 않다.
현재 목적과 두 사례의 충돌에서 **무엇을 유지했고 무엇을 새로 좁혔는지**를 함께 적는다.

| 현재 vNext 경계 | 도출 이유 | 현재 증거 상태 |
|---|---|---|
| 레거시의 `.devflow/` 단일 정본 결정을 모든 정본·작업 문서의 내부 수명 체계로 강화한다 | Adopt 입력 삭제 뒤에도 자기완결하고 외부 문서가 영구 정본·필수 provenance가 되는 문제를 막는다 | 유지·강화한 설계, behavior 미검증 |
| owner는 canonical home, skill은 decision route다 | 레거시에서 사람·stage·파일 권한이 섞였던 owner 의미를 분리한다 | 설계 확정, behavior 미검증 |
| Domain은 stage가 아니라 지식 분할 축이다 | 업무 의미를 기술 layer나 작업 단계와 독립시키되 별도 Domain runtime은 만들지 않는다 | 설계 가설 |
| 임시 spec은 완료 후 삭제하고 durable fact만 기존 home에 착지한다 | 중개노트 handoff의 유용한 현재 맥락과 과거 spec이 현재 규칙처럼 남는 위험을 함께 처리한다 | 설계 가설 |
| 조건부 child는 올바른 owner·수명을 먼저 확인한다 | 잘못 배치된 Product/Domain 지식이나 영구 지식을 child로 쪼개 정당화하지 않는다 | 독립 검토로 보강된 설계 가설 |
| concern tree는 프로젝트가 증명한 축만 쓴다 | 중개노트의 frontend/backend/validation 성공을 범용 taxonomy로 오해하지 않는다 | 설계 가설 |
| Skill Rails source가 공통 작성 규칙을 소유하고 `.devflow/index.md`는 route·발견·orientation만 소유한다 | 도구 계약과 프로젝트 runtime을 섞거나 index를 두 번째 매뉴얼로 만드는 실패를 막는다 | 독립 검토로 교정된 설계, behavior 미검증 |

## 5. 분해 경계가 이렇게 생긴 이유

조건부 분해의 실행 정본은 [08-document-contracts.md](08-document-contracts.md)다. 이 문서는 그 규칙을
다시 정의하지 않고 출처와 이유만 보존한다. Owner·수명 선행 판정은 잘못 배치된 Product/Domain 지식이나
완료 뒤에도 참인 지식을 child로 쪼개 정당화하는 실패를 막기 위해 추가됐다. Split과 같은 비중의 fold
판정은 실제로 늘 함께 읽고 바뀌는 child가 K와 같은 과분할 체계로 굳는 것을 막는다.

Spec의 artifact 경계와 integration 계약은 08 §6만 소유한다. 여기서는 그 선택이 범용 child-spec tree나
DAG를 뜻하지 않는다는 근거만 보존한다.

## 6. 현재 판정과 재검토 조건

현재 채택안은 **K subsystem 없는 조건부 parent/child tree**다. 실행 계약은 08, 가장 싼 검증은
[04-delivery-and-validation.md](04-delivery-and-validation.md)가 소유한다. 이 안은 중개노트에서 관찰한 질문별
소유·얕은 routing을 벤치마킹하고, 레거시 K의 유효한 응집성 문제를 보존하면서, `.devflow/` 단일 정본과
수명별 artifact라는 새 경계를 결합한 설계 가설이다.

다음 실제 관찰이 있을 때만 구조를 늘린다.

- 올바른 owner·수명을 먼저 판정해도 부모 route만으로 적용 자식을 반복해서 찾지 못한다.
- 서로 독립적으로 소비·변경되는 지식이 한 문서에 묶여 실제 불필요한 개봉이나 충돌을 반복한다.
- 반대로 대부분의 작업이 여러 자식을 함께 열어 탐색 비용이 본문 절약보다 커진다.
- 수동 parent route의 누락·죽은 링크가 반복되어 작은 checker가 사람 비용을 실제로 줄인다.

이때도 먼저 분해 축과 route를 고친다. 새 identity, registry, lifecycle, 숫자 예산은 그보다 작은 수단이
반증된 뒤에만 별도 결정으로 검토한다.
