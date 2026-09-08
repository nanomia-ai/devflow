# v0.23.19 구현 보고 — 최초 identity를 첫 binding 경계에 원자적으로 싣기

날짜: 2026-09-08
기준: `167002a78e2e4fcdd69dbccf0e22f2b804cfcbc8` (`0.23.18`)

## 결과

Cold Product/Adopt가 binding 확인 뒤 별도 room 커밋을 만들거나 room을 생략하던 공통 원인을
정본 owner에서 닫았다. 두 stage는 열린 Git operation gate 뒤 actor와 Git identity를 읽기 전용으로
해소하고, 방이 없을 때만 각 P2의 최초 binding branch가 기존 첫 커밋 직전에 room triple을 만들어
승인된 owner set과 함께 stage한다. digest는 경계 전 HEAD 또는 unborn history의 `none`을 기록하고,
pre-Product research 등에서 이미 존재하던 방은 보존하며 다시 stage하지 않는다. 별도 room 커밋,
fresh re-entry, room-only 상태, project-state/Resume/runtime 변경은 만들지 않았다.

Adopt의 별도 해석 공백도 formal ADR 권한을 늘리지 않고 닫았다. ADR 조건에 해당하거나 근거가 빠진
결정은 제안에서 현재 방향·근거·버린 대안·정확한 owner landing을 밝히고 Architecture 또는 capability
Intent에 자기완결로 남긴다. on-demand K는 추가 깊이만 맡고 `Binding ADRs`는 기존 exact path만 받으며,
formal ADR 작성자는 계속 Arch다. 기존 maintained-source 전수 회계, owner/K custody, 흡수 입력의
`Source basis` 제거와 두 번째 capability-head 전용 커밋 의미는 바꾸지 않았다.

DD-109가 이 좁은 최초 publication 권한을 공통 joining transition의 확장으로 ko/en에 기록하고 DD-101의
partial-state 보호를 유지한다. 매트릭스 §3.24와 두 plugin manifest, 최신 CHANGELOG를 `0.23.19` 후보에
맞췄다. `docs/design{_ko}.md` 쌍에는 Principles/Product/Adopt component intent 계보만 추가했고, state tool/test,
Resume, 다른 stage spec, Skill Rails runtime·trace·evaluator는 바뀌지 않았다.

## 변경 규모와 정본

기능 의미 정본은 Principles 3개 reference, Product `spec.mjs`/`body.md`, Adopt
`spec.mjs`/`body.md`/workflow/proposal template의 9경로다. 물리 diff는 `+42/-23`줄이며, 긴 문장 교체와
P2 object 필드를 의미 단위로 세면 identity/atomic-boundary 축 약 27개, 독립 ADR landing 축 약 8개다.
시나리오 정본 3경로는 Product 최초 승인과 Adopt 승인에 추가된 RUN 하나씩만 반영한다. 생성물은
정식 maintain/build가 만든 Principles/Product/Adopt의 `.generated.json`과
`.skill-rails/semantic-diff.json`에만 한정됐다.

## 표적 검증

- `node --test --test-reporter=dot scripts/repository-invariants.test.js`: 통과.
- Product/Adopt spec focused assertion: room RUN은 Product `commit-initial`과 Adopt `approve`에서만 첫
  COMMIT 바로 앞에 있고, Product ask/rerun 및 Adopt prepare/refuse에는 없으며, room ownership은
  `external.principles`; Adopt 선언은 Arch formal writer를 유지함 — 통과.
- `node scripts/decision-index.mjs` 및 `--lang ko`: DD-46의 유효 상태와 DD-109가 두 언어 index에 투영됨.
- Skill Rails maintain/build: Principles/Product/Adopt 모두 `L-full:pass`, mutation `20/20`, deterministic
  fixtures 각각 `10/10`, `19/19`, `12/12`, mismatch 0.
- 각 package `run.mjs lint`: `L-structural: pass`.
- 각 package `eval.mjs`: L0–L18 통과, deterministic fixtures 통과; spec hash는 Principles
  `sha256:c6400bc7056a79c3e244e7d446bbd0ab411920bc61b0544a0a604102c0c8d1d0`, Product
  `sha256:264b655886dc45ab798d833700b5eeec66fdf6c3d57f51e5910416b007fa556b`, Adopt
  `sha256:6cd2c4cb8dabce010f0d3ff19d9be1bd38b9acf2907d63b55536001d026120bc`.
- `node --test scripts/*.test.js skills/**/*.test.mjs`: exit 0, 전체 577개 중 577개 통과,
  fail/cancelled/skipped/todo 각 0, `duration_ms 1803567.2747`. 같은 실행의 Gate A에서 정본
  journal 수락·거절 양면이 통과했고, 실행 전후 `git status --short`는 동일했으며 양쪽
  `git diff --check`가 통과하고 test task의 파일 변경은 0이었다.
- `git diff --check`: 오류 0; 줄바꿈 변환 경고만 관측했다.

## 감사 종료 조항과 제한

감사 가이드라인 §5의 규칙 충돌·소실 경로를 전체 diff와 직접 소비자에서 재검토했다. room publish가
승인 전·열린 Git operation gate 전에 일어나거나, 기존 room을 다시 stage하거나, 다른 writer branch로
퍼지거나, room-only 상태·새 predicate·recovery를 만드는 경로는 0이다. ADR artifact 또는 K-only 의미,
Source-basis 회귀, sibling stage effect 변화도 0이다. 수리는 기존 owner와 두 reachable 최초 writer에
수렴했고 해석을 여는 새 범용 규칙은 만들지 않았으므로 텍스트 재감사는 여기서 멈춘다.

설치, provider별 cold Product/Adopt 실제 커밋, refusal/interruption, existing-room 보존, legacy 입력 삭제 뒤
Direct/Work/Verify/Resume 이해는 이번 작업에서 실행하지 않아 **미검증**이다. Skill Rails eval도
fresh-agent trigger, 긴 세션 drift와 실제 출력 품질을 증명하지 않는다. 커밋·push·설치는 수행하지 않았다.
다음 단계는 동일 cold fixture에서 roomless와 existing-room 양면을 실행하고 release 여부를 판정하는 것이다.
