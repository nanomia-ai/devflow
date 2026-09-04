# v0.23.4 결과 보고 — 실패 경로 동일성과 복구 경계 교정

상태: 구현·집중 검증 완료, 전체 suite·설치 미실행
기준 커밋: `006b807`

## 적용

0.23.3 전수 감사에서 실제 실패 경로 두 건을 채택했다. Direct의 로컬 정규식은
`.devflow/tree/verify.md` 제품 검증 실패 origin을 layer-opening 뒤 다시 인식하지 못해 같은
Failure-history source id로 repair bundle을 반복 생성할 수 있었다. 문자열 문법을 넓히는 대신
Principles가 투영한 기존 `failure-routing` 항목과 active origin의 동일성을 비교하도록 바꿨다.

Verify의 invalid-layer guard는 모든 transition을 복구 가능하다고 간주했으나 `partial-write`
분기는 디스크를 바꾸지 않고 Verify로 되돌아갔다. 실제로 suffix를 완료하는 기존 세 transition은
그대로 먼저 복구하고, `none`과 `partial-write`는 기존 무결성 정지로 수렴하게 했다.

작성 동작은 두 줄 교체(`+2/-2`)로 순증 0줄이다. 새 상태, 경로 문법, 단계, 역할,
capability 규칙은 없다. build hash는 `+5/-5`이고, 최신 semantic diff 영수증이 이전 변경의
긴 영수증을 대체해 보고서와 릴리스 기록까지 포함한 전체 diff는 `+75/-375`이다.

## 검증과 한계

- Claude Fable과 Codex Sol의 독립 읽기 감사가 각각 한 건을 발견했고, 코디네이터가 상태 도구와
  실제 분기 순서로 두 경로를 다시 확인했다.
- 수정 뒤 Skill Rails build는 Direct 27/27, Verify 28/28 fixture, 각 200회 결정 반복,
  L0–L18 mutation 20/20, mismatch 0을 기록했다.
- 전체 `node --test "scripts/*.test.js"`와 그 안의 Gate A는 이번 교정에서 실행하지 않아
  **미검증**이다. 0.23.3의 수동 Gate B를 다시 실행하지 않았으며 설치도 사용자 지시에 따라
  실행하지 않았다.
- 수정 후 Fable·Sol 감사와 영수증 교차 확인은 발견 0건이었다. §5 규칙 충돌·정보 손실은 없고,
  미실행 항목만 위와 같이 미검증으로 남겼다.
- 저장소 전체 semantic audit는 범위 밖의 기존 Adopt·Principles provenance 중복 때문에 실패했지만
  이번 범위인 Direct와 Verify는 각각 통과했다.
