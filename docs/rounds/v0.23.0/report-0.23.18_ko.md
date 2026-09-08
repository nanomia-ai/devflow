# v0.23.18 구현 보고 — Adopt/Work trace-safe continuation

날짜: 2026-09-08

시작 HEAD: `43c819e2ff33dc077d485b83721bbf6944041754`

범위: Adopt semantic refutation과 Work no-reusable-knowledge의 유효한 continuation을 trace 계약에 정합화

## 실제 원인과 수정

Sol 관찰 trace의 최초 proposal은 `ASK`와 `reinvoke: null`로 끝났지만 caller가 같은 run id를 다시
사용했다. 실제 transcript에는 `resume` 호출이 없으므로 이 관찰 실패 자체는 fixture/host process
오용이다. 수정 proposal의 SHA-256도 최초 proposal과 달랐지만 proposal은 선언 입력이나 project
snapshot이 아니므로 Decision identity를 바꾸지 않는다.

그와 별개로 0.23.13의 DD-106이 추가한 `refutation.state=revise`는 교정과 독립 재검사 뒤 `NEXT`로
같은 run 재진입을 요구했다. 유효한 두 번째 `revise`는 동일한 선언 입력과 snapshot에서 같은 pure
Decision을 만들므로 공통 trace guard가 `duplicate-decision-emission`으로 정확히 거부한다. 이는
0.23.16 신규 결함이 아니라 0.23.13부터 잠복한 Adopt branch 결함이다.

Opus whole-diff 감사가 찾은 Work 경로도 독립 재현했다. 공식
`research-evidence-stays-in-card` fixture와 임시 clean managed Git project 모두에서 committed Research
card가 재사용 지식 없음으로 판정되면 `knowledge-marker/none`의 `REPORT → NEXT`가 선택됐다. 실제
project의 첫 Decision은 `sha256:34a6dc96aa56237ce74bdd49a5ff03d3550539487b4dbf1092a99847a8615dd2`였고,
같은 project·judgment·run id 재호출은 event 90에서 `duplicate-decision-emission`으로 거부됐다. 이
분기는 0.20.0 Skill Rails 전환부터 잠복했고 0.23.11은 일반 card 범위와 표현만 바꿨다.

정본 `skills/adopt/spec.mjs`에서 revise terminal 한 줄만 `NEXT`에서 `ROUTE:adopt`로 바꿨다. 교정과
재검사는 그대로 실행되고 현재 run은 끝나며, 기존 ROUTE 계약에 따라 같은 actor가 사용자 질문 없이
Adopt target을 fresh entry로 즉시 잇는다. `make-scenarios.mjs`의 동일 기대를 바꾸고 scenario와 Skill
Rails receipt를 정본 명령으로 재생성했다. DD-106의 실제 이유와 영향 좌표는 여전히 유효해 결정 문서는
바꾸지 않았다.

Work에는 `ROUTE:work`를 쓰지 않았다. 기존 self-route 선례는 앞선 effect가 snapshot을 바꾸지만 이
분기는 report 외 effect가 없어 fresh run에서도 같은 `none`을 반복한다. P2 계약과 evaluator가
effect-free branch의 loop를 막으려고 정의한 정확한 `none: ["NEXT"]`로 줄여 같은 평가 안에서
`task-finalization`으로 넘어가게 했다. fixture 기대와 Work receipt만 함께 갱신했다. 두 package의 body,
workflow, generated adapter와 공통 evaluator, trace guard, state/resume 및 다른 P2 spec의 의미 변화는
0이다.

## 표적 검증

- Skill Rails lint는 L0–L18을 통과했다. 정본 build는 mutation 20/20, fixture 12/12 × 200회,
  mismatch 0이며 `spec_hash`는
  `sha256:731eda6c60dd93a32d3723c85d0914afe633d5be1e8919d9599351caaa13ed97`이다.
- source `enter`는 exit 0과
  `sha256:3955b4739d99e3a85515976dc59384799cc16df01e1bf11dcd38117c1d787efd`를 냈다.
- 임시 clean unmanaged Git project와 외부 trace directory에서 run A의 `revise`는
  `ROUTE`, `reinvoke: null`, `RUN → RUN → ROUTE:adopt`를 냈다. 같은 actor가 target을 fresh run B로
  이은 두 번째 `revise`도 같은 Decision id
  `sha256:c2a0f7364695445ca51bcd465828f6df46344245cd762b2f22bf9179b9bf639f`로 성공했고, 다음 fresh
  `clear`는 `adoption/prepare`의 `ASK`를 냈다.
- 이전 run id로 같은 revise Decision을 다시 발행하면 `SR_TRACE_INVALID`와
  `duplicate-decision-emission`으로 계속 fail-closed한다. fresh entry에서 judged 값을 생략하면
  `refutation.state`를 needs로 밝힌 `BLOCK`이며 `ASK`로 owner에게 넘기지 않는다.
- Work의 실제 source 재현은 `state.route=claim.mine`, integrity/setup finding 0에서
  `knowledge-marker/none`을 도달시켰다. 수정 후 같은 공식 fixture는 effect-free branch를 내부 통과해
  `task-finalization/carry`의 `WRITE → COMMIT → NEXT`를 낸다.
- Work의 단일 정본 maintain/build 뒤 `spec_hash`는
  `sha256:b4bbf0d019baa9416fc1edc596477b8ffa058a4499468a8c885ced9497488cc8`이고,
  lint L0–L18과 공식 fixture 75/75 × 200회, mismatch 0을 통과했다. source `enter`는 exit 0과
  `sha256:b57717f3f5ecc4c10724dec0bdab62384182543c56d7a5953f4f01cbc824cca5`를 냈고,
  knowledge-marker seam 2/2와 저장소 invariant 21/21도 통과했다.

## 감사 종료 조항과 제한

감사 가이드라인 §5의 규칙 충돌·소실 경로 class는 0이다. `ROUTE:adopt`는 새 상태나 예외를 만들지 않고
Devflow의 기존 same-actor target-stage/fresh-entry 계약으로 수렴한다. Work의 정확한 effect-free
`["NEXT"]`도 공통 계약의 기존 stage-pass 의미를 소비한다. 공통 guard 완화·AI가 만드는 revision id·
proposal이나 no-reusable report를 새 관찰 상태로 승격하는 대안은 모든 P2의 반복 effect 방지를
약화하거나 owner를 늘리므로 채택하지 않았다. Fable의 독립 source 검토는 Work와 Verify의 self-route
선례를 확인했고, body/workflow 또는 adapter 산문 추가는 중복 owner라고 판정했다.

Opus whole-diff 감사는 최초 9경로에서 blocking 0, fingerprint/generated 38 MATCH, Source-basis 회귀와
DD row move 0을 판정한 뒤 Work의 같은-family 결함을 찾았다. `ROUTE:work` 제안은 effect 없는 fresh
self-route 반복으로 반증됐고, Opus 재검토 뒤 exact `["NEXT"]` 통합으로 수렴했다. align은 의도된
reentry이고 K offset은 fixture 작성자 오류이자 validator 계약 밖이며 manifest details는 unverified다.

매트릭스 3.24와 3.20을 다시 판정했다. 각각 기존 Adopt 판단 복귀와 Work의 no-projection/no-marker
결과가 유지되고 새 요청 형태와 row move는 0이므로 standing matrix는 바꾸지 않았다. 대표 실행
상태도 아직 미검증이다. 공통 CLI `resume`이 terminal과 무관하게 마지막 run id를 `next_command`에
넣는 별도 관찰은 이번 인과의 runtime 변경으로 넓히지 않고 `docs/design-backlog{_ko}.md`의 외부 Skill
Rails owner 항목에 착지시켰다.

전체 `node --test "scripts/*.test.js" "skills/**/*.test.mjs"` suite와 gate A, 새 대표 cold project,
provider 설치·재시작 뒤 real-use 흐름은 coordinator가 지시한 시점까지 **unverified**다. 대표 Sol/Opus
fixture와 다른 사용자 project는 수정하지 않았고 push하지 않았다.
