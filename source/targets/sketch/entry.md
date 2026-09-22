---
name: sketch
description: Product, Architecture, Design 또는 Direct가 결정하기 전에 증거가 필요하고 중단 후에도 맥락을 보존해야 하는 프로젝트 아이디어나 변경 차단 질문을 좁힌다. 명확한 brief, 바로 구현할 수 있는 변경, 또는 구현이 가장 저렴한 증거인 질문이 아니라 지속해야 할 탐구에 사용한다.
---

# 하나의 열린 질문 좁히기

Sketch는 하나의 지배 질문을 결정 가능한 상태로 만드는 데 필요한 탐구만 보존한다. 새 프로젝트의
불확실한 아이디어와 기존 프로젝트에서 변경을 막는 질문 모두를 다룰 수 있지만, 대화를 조사
보관소로 만들거나 하나의 분석 방법을 강제하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 탐구를 지속해야 할 때만 진입한다

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `sketch` 행을 적용한다. `.devflow/index.md`를
읽을 수 있으면 먼저 읽고, 지배 질문에 관련된 프로젝트 route만 따른다.

다음 세 조건이 모두 참일 때만 Sketch를 만든다.

1. 열린 질문을 좁히기 전에는 Product나 delivery가 다음 결과를 안전하게 정할 수 없다.
2. 구현 전에 증거나 사용자 결정이 필요하며, 구현이 후보를 가르는 가장 저렴한 증거가 아니다.
3. 질문, 현재 증거 또는 다음 행동이 현재 관리권 구간을 넘어 보존되어야 한다.

그렇지 않다면 논의를 현재 대화 안에만 두고, 명확한 프로젝트 brief는 `product`로, 실행 가능한
변경은 `direct`로, 구현하며 얻어야 하는 학습은 Direct shaping으로 보낸다. 파일 수, 새로움,
“research”라는 단어 자체는 탐구를 지속할 이유가 아니다.

지속 Sketch를 새로 만들거나 이어갈 때는 `references/project-knowledge.md`를 먼저 연다.

foundation이 생기기 전에 답이 제품 의미를 확립한다면 `project` scope를 선택한다. 현재 프로젝트
결정이 하나의 delivery 결과를 막고 있다면 `change` scope를 선택한다. 한 대화에서 나왔다는 이유만으로
서로 무관한 질문을 합치지 않는다.

## 탐구와 검토 관점

Sketch는 듀이의 탐구처럼 막연한 불확실성을 다음 결정을 막는 하나의 문제 상황으로 바꾼다. 현재
증거가 한 설명을 강제하지 않을 때만 퍼스의 귀추를 사용해 결정에 의미 있는 최소 후보를 세우며,
후보 수를 채우거나 가설을 사실로 다루지 않는다. 후보를 가를 때는 포퍼의 비판적 시험처럼 현재
결론을 바꿀 가장 값싼 관찰을 먼저 찾되, 한 번의 실패로 제품 목적 전체를 폐기하지 않는다.

## 복구 가능한 최소 artifact를 연다

`S-short-label-<token>`처럼 충돌하기 어려운 불투명 ID를 만들고 현재 tree에 없는지 확인한다.
`.devflow/team/<current-member>/sketches/<artifact-id>/brief.md`와 `state.md`를 만들며, 모든 파일은
공통 routing header를 사용한다. 이 폴더는 현재 member의 개인 탐구 작업면이다. 다른 member의 Sketch를
기본 탐색하거나 읽거나 이어받지 않는다. 이 경계는 중간 질문과 가설을 서로의 입력으로 취합하지 않게
하지만 repository 접근 권한을 제한하지는 않는다.

`brief.md`는 탐구 이유를 스스로 설명해야 한다. project/change scope, 하나의 지배 질문, 배경과
사용자 의도, 이미 확인된 사실, 명시적인 비범위, 답이 결정 가능한 상태가 되는 기준을 쓴다. 대화,
시간 순서, 제안 구현, 범용 조사 계획은 저장하지 않는다.

`state.md`는 log가 아니라 교체되는 하나의 현재 snapshot이다. 다음 형태를 지킨다.

```yaml
next_route: sketch
next_action: <하나의 범위가 정해진 증거 수집 또는 결정 행동>
blockers: []
unresolved_findings:
  - question: <하나의 미해결 질문>
    destination: <product | architecture | design | direct>
    landing_condition: <흡수할 준비가 되게 하는 증거나 결정>
```

artifact가 존재하는 동안 네 필드는 모두 필수다. finding은 결론이 지정된 canonical home에 흡수될
때까지 `unresolved_findings`에 남는다. `landing_condition`을 충족하면 게시할 준비가 되었을 뿐, 그
자체로 항목이 제거되지는 않는다. blocker는 다음 행동을 막는 것이며, 아직 답을 모른다는 사실 자체가
아니다. 현재 행동을 끝내지 못한 채 같은 member의 다음 역할로 전환해야 한다면 먼저 snapshot을
교체한다. 시도, 대화, 진행률, 이전 route를 덧붙이지 않는다. `next_route`는 다음 Devflow 역할을
지정하며 member를 바꾸지 않는다. 별도의 `team/<member>/<artifact-id>.md` note는 만들지 않는다.

Sketch가 프로젝트의 첫 진입점이면 작은 `.devflow/index.md`도 공개한다. 프로젝트를 한 줄로 설명하고,
열린 탐구는 범위가 정해진 Sketch state glob으로 route하며, 즉시 복구에 쓰는
`team/<current-member>/sketches/*/state.md`, `adoption/state.md`, `work/*/state.md` glob만 노출한다. Product와
Architecture, 그리고 해당되는 Design이 완료되기 전에는 foundation이 준비되지 않았다고 밝힌다.
질문의 증거를 index에 복제하거나 활성 ID를 열거하지 않는다. index가 이미 있다면 질문 route나
readiness 문장이 실제로 바뀔 때만 수정한다.

## 결정을 바꾸는 증거만 모은다

현재 결정을 바꿀 수 있는 가장 저렴한 증거를 선택한다. 방법은 source 검사, 범위가 정해진 실험,
외부 조사, 비교 또는 사용자 선택일 수 있다. Sketch는 시장 분석 순서, 설문지, 고정된 선택지 수를
요구하지 않는다. 관찰한 사실, 해석, 미해결 질문, 각 질문을 해결하는 조건을 구분한다.

지배 질문을 읽는 모든 독자에게 증거가 필요하면 `brief.md`에 둔다. 독립 질문을 brief만 보고
본문을 열기 전에 선택할 수 있고, 피하는 읽기나 write 충돌이 새 route 비용보다 클 때만
`findings/<concern>.md`를 만든다. finding에는 질문, 관련 증거, 관찰과 해석의 구분, 중요한 선택지와
trade-off, 현재 결론 또는 unknown, 확인 조건을 둔다. destination을 반복하거나 검색 결과 목록을
보존하거나 두 번째 brief가 되게 하지 않는다.

증거로 정할 수 없는 구속력 있는 선택만 사용자에게 묻는다. 다음 증거를 구할 수 없으면 정확한
의존성을 `blockers`에 넣고 `next_route: user`를 사용하며, 결론을 꾸며내는 대신 어떤 답이 Sketch를
재개시키는지 적는다.

이 기준에 따라 사용자의 설명이나 구속력 있는 선택을 실제로 묻기 직전에만
`references/question-dialogue.md`를 열고 질문 표현에 적용한다.

## 확정된 결론만 canonical owner에 반영한다

결정 가능한 결론을 공개하기 전에 `references/sketch-handoff.md`를 열고 landing 계약을 따른다.

finding이 결정 가능한 상태가 되면 조사 서술이 아니라 destination의 언어로 결론을 표현한다.
project scope의 제품 의미는 주로 `product`로 보낸다. 기술 및 UI finding은 해당 stage가 흡수할 수
있을 때 `architecture` 또는 `design`으로 보낸다. change scope의 답은 delivery 결정만 `direct`로
보내며, 해당 변경 뒤에도 계속 참인 사실은 먼저 하나의 Product, Domain, Architecture, Design 또는
decision home으로 보낸다.

다음 역할이 artifact를 닫은 뒤에는 Git이 최종 이력을 보존한다.

## 현재 결정 경계를 반환한다

다음을 반환한다.

- `범위와 질문:` `project` 또는 `change`와 지배 질문
- `Artifact:` 만들거나 갱신한 Sketch 경로, 또는 현재 대화 안에서 끝난 결과라면 `none`
- `증거와 결론:` 관찰한 것, 현재 지지하는 결론, 아직 모르는 것
- `Route와 행동:` 정확히 하나의 다음 route와 범위가 정해진 행동 하나
- `미검증 또는 차단:` 부족한 증거, 구속력 있는 사용자 선택, 각각의 재개 조건

Product, Domain, Architecture, Design, Work, adoption, 구현 또는 verification 파일을 만들거나
수정하지 않는다. 질문이 현재 대화에서 바로 landing할 수 있게 되었거나, 원래 대화 없이도 brief와
현재 snapshot만으로 재개할 수 있는 지속 Sketch가 되었을 때 완료다.
