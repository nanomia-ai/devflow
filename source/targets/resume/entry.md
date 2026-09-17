---
name: resume
description: 현재 checkout의 canonical .devflow state를 읽고 파일을 바꾸지 않은 채 active work, 불일치, 정확히 하나의 다음 route와 행동을 보고한다. status 확인, 계속 진행 또는 중단된 작업 복구에 사용하며 Domain 설명, planning, 구현 또는 verification에는 사용하지 않는다.
---

# Devflow 프로젝트 재개하기

Devflow는 프로젝트 지식과 active work state를 `.devflow/` 아래에 둔다. Resume의 유일한 목적은 현재
checkout에서 신뢰할 수 있는 위치를 복구하고 안전한 다음 route와 행동 하나를 찾는 것이다. 실행
stage가 아니라 read-only 방향 확인 작업이다.

## 진입 gate

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `resume` 행을 적용한다. gate가
Resume을 멈추면 아무것도 변경하지 않는다.

`.devflow/`는 있지만 `index.md`가 없거나 읽을 수 없다면, 쓰지 않고 현재 존재하는 모든
`.devflow/project/`, `.devflow/sketches/*/state.md`, `.devflow/adoption/state.md`,
`.devflow/work/*/state.md` 경로를 inventory한다. foundation 문서만으로 route를 고르기 전에 범위가
정해진 모든 active state 위치를 확인한다. 남아 있는 project 또는 artifact evidence로 index를 복구할
writer route를 정한다. 그 route를 정할 수 없다면 사용자에게 보낸다. 기존 state 위에서 관리되지 않은
bootstrap을 다시 시작하지 않는다.

그렇지 않다면 `.devflow/index.md`를 먼저 읽고 범위가 정해진 방향 확인 및 question route를 따른다.
프로젝트의 routing detail은 index가 소유하므로 범용 lifecycle로 대체하지 않는다.

## 현재 위치를 복구한다

1. index의 bounded glob으로 immediate active state만 열거한다. 모든 project 또는 Domain 문서를
   재귀적으로 읽지 않는다.
2. 현재 checkout의 Git revision과 bytes를 선택한 각 state의 intent, base, last safe point, next action과
   비교한다. active artifact 없는 dirty change는 소유자 없는 work이며, 진행 중인 것이 없다는 증거가
   아니다.
3. active item이 여러 개면 모두 보고하고 하나를 고르도록 사용자에게 보낸다. 하나라면 해당
   `spec.md` 또는 `brief.md`, 존재하는 범위가 정해진 `team/*/<artifact-id>.md`, Resume 자체가 현재
   route를 해석하는 데 필요한 project 문서만 연다. spec 또는 brief의 `read_first`는 routed actor의
   input이다. 선택한 state·sibling·Git evidence가 서로 어긋나고 recovery owner를 찾는 데 그 project
   문서가 필요한 경우가 아니라면 방향 확인 중에는 따르지 않는다.
4. foundation 문서는 그 내용이 index가 지정한 contract와 readiness rule을 충족할 만큼 완전할 때만
   current로 본다. 파일이 존재한다는 이유만으로 부분적인 Product, Architecture 또는 Design을 current로
   보지 않는다.
5. spec, state, verification, foundation 또는 Git evidence가 없거나 읽을 수 없거나 서로 다를 때
   추측하지 않는다. 불일치를 보고하고 복구를 소유한 정확한 writer 또는 decision route로 보낸다.
6. active item이 없다면 “진행 중인 작업 없음”만 보고하지 말고 다음 foundation route를 도출한다.
   Product가 없으면 bootstrap이 가능하고, Product가 완전하지만 Architecture가 없으면 `architecture`,
   Architecture가 Design을 요구하지만 Design이 없으면 `design`으로 보낸다.

## 방향 확인 보고서 하나를 반환한다

진행률이나 재구성한 대화 없이 다음 네 field를 사용한다.

- `활성 항목:` 발견한 범위가 정해진 item, 또는 `none`
- `불일치/차단:` state를 신뢰하거나 계속하는 것을 막는 evidence, 또는 `none`
- `다음 route와 행동:` 정확히 하나의 route와 범위가 정해진 행동 하나. 실행하지 않는다.
- `최소 읽기 범위:` 판단을 위해 실제로 연 모든 project path

Domain 전체를 설명하거나 batching·구현 전략을 선택하거나 project 파일을 바꾸거나 state를 수리하거나
다음 route를 실행하거나 다른 branch·worktree를 집계하거나 verification을 주장하지 않는다. 그 책임은
routed skill, 사용자, Git 또는 외부 orchestrator에 있다.

이 target에는 optional module이 없다. 현재 disk와 Git evidence가 보고를 뒷받침하고, 안전한 다음
route와 행동 하나가 있으며, 실제 읽은 범위를 나열하고, project write를 하지 않았을 때 완료다.
