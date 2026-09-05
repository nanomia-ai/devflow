# v0.23.7 결과 보고 — 냉간 작성 산출물 문법의 자연 소유자 복원

상태: 완료 — 이 보고서를 포함하는 0.23.7 릴리스 커밋으로 닫음
기준 커밋: `9479feb7ad468c11c977a9220e1fb6eb45a1761f`

## 목적과 실제 실패

0.23.3과 0.23.4는 Work → Resume → Verify와 Verify non-pass → Direct → repair Work의 상태
흐름을 연결했다. 그러나 disposable project의 실제 냉간 Verify 작성자는 Failure history에
`- 1 · <timestamp> · fail · ... · routing: pending`처럼 그럴듯하지만 정본이 아닌 한 줄을 썼다.
기존 parser는 이를 `transition.source-id-migration`, `failureRouting sourceId=null`로 판정해 이미
구현된 repair 흐름에 진입할 수 없었다. 상태 계층이나 loop가 아니라 작성 산출물과 기존 소비자
문법 사이의 정보 단절이었다.

현행 parser와 migration provenance를 다시 대조한 결과 pending item의 정본은
`- source id: <id>; timestamp: <ts>; <failure: … | unverified: …>; routing: pending`이었다.
`record.md`는 냉간 작성자가 실제로 채우는 반복 산출물의 자연 소유자이고, 주석 한 줄이면 생성
문서를 오염시키지 않으면서 해석 여지만 제거한다. parser·spec·참조 문서에 같은 규칙을 다시
만들거나 generic list DSL을 추가하지 않았다.

## 최소 수정과 두 번째 같은 패턴

- `skills/verify/templates/record.md`에 위 item shape를 한 줄 주석으로 제시했다.
- 기존 `migration-a0057`의 target/evidence에 그 template을 추가하고 Verify만 재빌드했다.
- generated `SKILL.md`, `spec.mjs`, body, parser, collector, test는 바꾸지 않았다.

Gate B의 다음 냉간 Direct 작성자는 task card의 `Read first`를 bullet과 backtick으로 썼고 Work의
기존 collector는 이를 literal path로 읽어 멈췄다. 같은 repeated-item 산출물 문제가 두 번째
나왔으므로 특정 writer를 더 설명하기 전에 전체 경계를 다시 반증했다. 공통 parser나 formatting
framework가 빠진 것이 아니라 서로 다른 정본 artifact template 두 곳에서 각 소비자에게 필요한
최소 shape가 빠진 것이었다.

- Direct의 task/research card template에 `Read first`는 줄마다 하나의 bare repository-relative
  path이며 bullet/backtick을 쓰지 않는다는 한 줄 주석을 같은 위치에 넣었다.
- 기존 `migration-a0082`의 target/evidence에 두 template을 추가하고 Direct만 재빌드했다.
- 최초 proposal에 포함된 capability document가 Work execution basis로 부적합한 문제는 기존
  Direct approval revision loop에서 그 path 하나만 제거해 해결했다. 스킬 규칙은 늘리지 않았다.

이로써 세 template이 각자의 산출물 shape 하나씩을 소유한다. Verify와 Direct의 역할, Resume의
유일한 상태 선택, Work의 카드 단위 구현, Principles의 상태 계산은 바뀌지 않았다.

## 빠른 검증

Verify build와 eval은 각각 L0–L18, fixture 28/28, deterministic 200회, mismatch 0으로
통과했다. build mutation은 20/20, format은 5/5였다. 정본 failure line은 `failure-routing`과
positive source id 1로 읽혔고 migration이 아니었으며, 종전 malformed line은 계속 migration으로
분류됐다.

Direct build와 eval은 각각 L0–L18, fixture 27/27, deterministic 200회, mismatch 0으로
통과했다. build mutation은 20/20, format은 1/1이었다. semantic audit은 206 atoms에서 hard,
advisory, duplicate 모두 0이었다. 독립 해시 재계산은 Direct 55/55, Verify 70/70이 일치했다.

## 실제 Gate B

자동 harness 대신 clean disposable repository에서 다음 경계를 실제 냉간 agent들로 한 번
통과시켰다.

1. 첫 Work 완료 경계 `5d4ba69` 뒤 Resume가 mutation 없이 `ROUTE:verify`를 선택했다.
2. distinct fresh Verify가 실패를 실행하고 `7258f371`에 정본 line을 기록했다. state는
   `failure-routing`, source id 1, migration 없음으로 읽었다.
3. Resume가 `ROUTE:direct`를 선택했다. 첫 냉간 Direct에서 위 `Read first` 결함이 드러나
   수정·재감사한 뒤 `7258f371`에서 fresh retry를 시작했다.
4. revised Direct proposal은 `.devflow/project/product.md`, capability `verify.md`, `app.mjs`,
   `verify-scenario.mjs`, `check.mjs`만 bare path로 읽고 repair card 하나를 만들었다. planning
   commit은 `2e95eb5f845156f9b29ded1c713ad14c9262a755`였다.
5. repair Work task commit은 `890f255d3901f72aa13c2e411907f4fbe9b73f1f`, fixture가 요구한
   disposable integration merge는 `499c9fc5ca71b382b927de3e7a3bb32233c4595e`, canonical Work
   boundary는 `1e2c1d0567b1a25807300ace5a5da921d825a14c`였다. `node verify-scenario.mjs`는
   exact `hello`로 exit 0이었고 packet-only clean Fable review는 `pass`였다.
6. retry-local Resume가 mutation 없이 `ROUTE:verify`를 선택했다. distinct fresh Verify의 clean
   execution verifier는 repository root에서 `node verify-scenario.mjs`를 실행해 stdout
   `verify: greet() returned hello`, exit 0을 반환했다. verifier가 먼저 capability folder에서
   실행한 한 번의 `MODULE_NOT_FOUND`는 cwd가 잘못된 invocation으로 분류했고 root 실행으로
   교정했다.
7. Verify는 result `a79c60fda3979c87f103b4aa012cf04de11eb0e2`, begin
   `d6d742cf487960be8df1ab54d3cbebbbe9977678`, closure
   `d42e4d2b81e768696e6fa883e154ab791fdf5d1f` 세 commit만 남겼다. 최종 path는
   `.devflow/tree/02-greeting.done`, transition/marker/anomaly는 없고 status는 clean이었다.

최종 `verify.md`는 기존 failure source id 1을 `routing: fix cards 02.2`로 보존하고 새 entry 0,
Verdict pass를 기록했다. `node check.mjs`, `node verify-scenario.mjs`, `git diff --check`가 모두
exit 0이었고 final state는 `complete.adoption`이었다. Resume는 closure 뒤 다시 열지 않았다.

## 최종 전체 검증과 Gate A

Gate B가 완전히 닫힌 뒤 완료 명령 `node --test "scripts/*.test.js"`를 정확히 한 번 실행했다.
결과는 **509/509 통과, 실패·취소·skip 0, `duration_ms 1257968.2025`**였다. 같은 실행 안의
Gate A는 18개 canonical reserved journal line을 모두 수용하고 대응하는 damaged line을 모두
거부했다. semantic audit advisory는 기존과 같은 `adopt: provenance-fan-in=1`, `principles:
duplicate-target-locators=28`이며 hard failure는 없었다.

Node 24의 test-context에서는 이 root 명령이 `skills/**/*.test.mjs`를 중첩 실행하지 않는 경계가
관측됐다. 따라서 root 출력만으로 package test 실행을 주장하지 않는다. 이번에 바뀐 Direct와
Verify의 package behavior는 위에 기록한 각 build/eval 직접 실행으로 확인했다. 직접 열면 실패하는
base-identical `skills/verify/collectors/fixtures.test.mjs`의 stale `verify/record.freshness` 기대는
이번 diff가 만든 회귀가 아니며 별도 범위로 남긴다.

## 독립 감사와 범위 판정

수정 전 Fable은 Verify 결함과 `record.md` 한 줄 소유를 확인했다. 수정 직후 diff 감사는 기능
수정·ledger projection·Verify 단독 rebuild가 일치하며 추가 수리가 없다고 판정했다. Direct에서
같은 pattern이 드러났을 때 별도 decision gate는 두 card template이 자연 소유자이며 core/systemic
변경이 불필요하다고 판정했고, 수정 직후 재감사도 correction 없이 통과했다.

Audit/Retrospective의 반복 item 작성은 이번 Gate B가 실행하지 않았으므로 확인하지 않았다. 같은
class를 이유로 범위를 넓히지 않고 미검증으로 남긴다. root suite의 Node 24 재귀 실행 경계와 Verify
collector의 base-identical stale assertion도 이번 변경이 만든 frontier blocker가 아니어서 보고만
한다.

## 배포·감사 경계

두 manifest를 0.23.7로 맞추고 CHANGELOG 최신 항목과 이 수리 보고를 추가했다. 설치·merge·push는
실행하지 않았다. 로컬 Codex snapshot refresh, Claude/Codex 설치 상태, SessionStart hook 표시는
따라서 미검증이다.

결정 index row 이동과 새 binding decision은 없다. use-case matrix의 H13·H43·H44·H45×A7·A13
실제 검증·수리 재발 경계로 설명되며 새 H·A row, 영향 cell, matrix gap은 없다. 생성 경로는 이
보고서 하나이고 삭제·이동 경로는 없다.
