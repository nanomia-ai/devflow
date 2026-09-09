# v0.23.20 구현 보고서

- 날짜: 2026-09-09
- 기준: `61ed6f62c13b5af59fb4be8d92a4976ca73f156a`

## 결과

0.23.20은 모든 task/research 카드의 `Read first`에 목적지에 맞는 정확한 K 경로만 두고, T-low 실행 카드에는 consumer가 필요로 하는 최소 유계 concrete provider/consumer 코드·테스트 경로를 추가하도록 Direct 작성 계약을 복구했다. Work가 규칙으로 자동 읽는 Layer 0·번호 소유 현재 능력·Binding ADR은 카드에 복제하지 않는다. 실행을 좌우하는 ordering/dataflow 제약과 task-specific fixture는 기존 Destination·Forbidden·Completion signal 소유권에 남고, greenfield/independent 작업은 literal pipe를 포함한 하나의 명시적 N/A 형식을 쓴다.

Work의 기존 fail-closed 경계와 Product·Architecture·Design·Verify·Resume의 행동은 바꾸지 않았다. Work 설명은 collector가 실제로 거부하는 direct capability-document 경로의 depth-1 번호 규칙 소유권으로 바로잡았다. DD-44에는 DD-90의 일부 정정 계보와 cold 실행 증거를 보존했고, Direct authoring card와 유스케이스 행은 현재 정본·검증 경계에 맞췄다.

별도 의미 축으로, 외부 정본 Skill Rails 0.3.4/validator 0.6.2의 공통 생성 runtime을 아홉 P2 패키지에 함께 투영했다. caller가 주는 judged/decided 값만 필요한 effect-free BLOCK은 이제 `reinvoke: after-input`을 내고, traced stage는 완전한 UTF-8 stage-result를 저장해 `result_path`를 돌려주며, `resume/2`는 `after-effects`와 `recompute`에만 다음 명령을 만든다. 생성 adapter는 stale Decision을 effect-free로 취급하고 `reinvoke: recompute`로만 계속한다. 이 축은 Devflow spec·body·fixture를 늘리지 않았고 기존 duplicate-Decision trace guard를 그대로 둔다.

## 변경 범위

- 정본 의미: `skills/direct/spec.mjs`, `skills/direct/body.md`, `skills/principles/references/knowledge/inputs-and-entry.md`, `skills/work/body.md`
- 표적 증거: `skills/direct/fixtures/source/direct-package.test.mjs`, `skills/work/collectors/project-state-seam.test.mjs`
- 의도·결정: `skills/direct/authoring-card.md`, `docs/design-decisions_ko.md`, `docs/design-decisions.md`, `docs/usecase-matrix_ko.md`
- 정본 생성: Direct·Principles·Work의 `.generated.json`과 `.skill-rails/semantic-diff.json`
- 공통 생성 투영: Adopt·Architecture·Design·Direct·Principles·Product·Resume·Verify·Work 각각의 `SKILL.md`, `.generated.json`, `scripts/skill-rails/authoring-ledger.mjs`, `cli.mjs`, `constants.mjs`, `evaluator.mjs`
- 계보 정리: `docs/design-backlog_ko.md`, `docs/design-backlog.md`의 terminal-sensitive `resume` 관찰을 이행·종결 절로 이동
- 릴리스: `CHANGELOG.md`, 두 plugin manifest, 이 보고서

공통 생성 투영은 패키지당 6경로, 합계 54경로다. 기존 후보의 세 `.generated.json`과 겹치므로 새 변경 경로는 51개이며, backlog 쌍까지 포함한 전체 후보는 73경로다. 기준 commit 대비 생성물 57경로(`.skill-rails/semantic-diff.json` 3개 포함)는 `+695/-513`, 나머지 정본·증거·릴리스 16경로(57줄짜리 신규 보고서 포함)는 `+180/-61`이다. CRLF를 가진 설치 원본을 복사하지 않고 공식 builder의 LF 정규화를 사용했으므로 runtime/vendor/schema 줄바꿈 churn은 없다.

## 검증

- 설치 Skill Rails 잠금: `skillFolderHash=0689291780eb2b056cac1ff6cd5a4e69efbaed6e`를 쓰기 전과 생성 뒤에 확인했다.
- 공식 Skill Rails `build`: 아홉 패키지의 최초 생성은 모두 L0–L18, mutation 20/20과 총 fixture 296건을 통과했다. 감사 수리 뒤 Direct와 Work만 각각 한 번 다시 생성해 같은 검사를 28/28, 75/75로 통과했고 runtime `0.3.4`/validator `0.6.2` 및 두 hash는 전 패키지에서 동일하다.
- Skill Rails `eval`: 최초 아홉 패키지는 합계 296/296, 불일치 0이었고, 감사 수리 뒤 Direct 28/28과 Work 75/75를 다시 통과했다.
- 공통 runtime 표적 trace: Adopt의 `semantic-refutation`은 값이 없을 때 effect-free BLOCK·judged `refutation.state`·`after-input`을 냈고 stage-result 파일과 `result_path`가 일치했다. 같은 run id의 bare repeat는 `duplicate-decision-emission`으로 실패했고 저장 결과를 덮지 않았으며, `refutation.state=pending`을 주면 NEXT·`after-effects`에 도달했다. `resume/2`는 전자에서 `next_command: null`, 후자에서 명령을 냈다.
- 두 번째 패키지 확인: Resume의 기존 `ordinary-ready-routes-work` fixture에서 judged 값만 빼면 입력 binding이 stage 선택 전에 effect-free BLOCK을 내며 judged `intent.scope`와 `after-input`을 돌려줬다. 따라서 `stage`는 null이고, 최초 probe가 `scope-entry`를 기대해 실패한 것은 harness 기대 오류이며 제품·fixture 변경 사유가 아니다.
- 표적 테스트: 감사 수리 뒤 Direct card materialization과 Work concrete/missing/automatic basis 회귀 18/18을 다시 통과했다.
- repository invariants 21/21 통과로 아홉 패키지의 공통 runtime/validator 동일성을 확인했다. 결정 색인 ko/en은 기존 후보에서 모두 생성 성공했다.
- AGENTS.md의 정확한 완료 명령 `node --test "scripts/*.test.js" "skills/**/*.test.mjs"`을 코드가 동일한 후보 바이트에서 한 번 실행해 577/577, 실패 0과 Gate A reserved-journal 통과를 확인했다. 이후 소스·runtime·생성물은 바뀌지 않았고 이 보고서만 수정했으므로 전체 suite를 다시 실행하지 않았다.
- 생성 직후 71경로, backlog 계보 정리 뒤 최종 73경로가 각 allowlist와 일치했다. `git diff --check` 통과, 예상 생성 54경로 존재, 예상 밖 경로 0, 생성 경로 CRLF 0을 확인했다.
- 두 disposable cold seed는 같은 초기 HEAD `ef47726981c25b5e1416b0153e32553e655bc5c7`, clean 17 tracked files, `.devflow` 없음으로 동일했고 기존 `devflow-test1`은 건드리지 않았다. Sol과 Opus 모두 Adopt를 끝내 self-contained `.devflow`를 만들었고, 흡수한 `docs/` 삭제 뒤에도 지식 검증과 기존 8/8 테스트가 통과했으며 Direct가 보존된 요청을 자동 발견했다.
- Opus는 이어 Work 구현과 13/13 테스트를 마쳤고 `.devflow`만 받은 clean reviewer가 코드 결함 0을 확인했다. 첫 Adopt binding 제시는 열거 18경로를 “16 files”로 잘못 표기했지만 승인 전에 기계적으로 18경로로 고쳐 재검증·재제시했다.
- cold 근거는 Sol `C:/Users/joinj/AppData/Local/Temp/devflow-cold-02320-sol-a-direct-trace/e2e-evidence.md`와 같은 폴더의 `914e54ac-41f0-4faf-a2c6-fea0adae40c4.{jsonl,stage-result.json}`, Opus `C:/Users/joinj/AppData/Local/Temp/claude/D--Projects-Private-nanomia-nanomia-skills-devflow/a35ef690-0f58-4a01-8199-8b3ef075986f/scratchpad/EVIDENCE.md`와 `trace-direct2/d0418a09-4034-4097-8c71-593f97890262.{jsonl,stage-result.json}`에 남겼다.

## 유지보수 문맥 경계

- 계획 경계 basis: Direct `sha256:f7b025d3…`에서 `spec:TEMPLATES/taskCard`와 `body:stage: materialize`는 relation coverage `closed`, Work `sha256:0effcfd8…`의 `body:guard: missing-bounded-basis`도 `closed`였다.
- 최종 완료 경계 basis: Direct `sha256:7671587e…`에서 `spec:TEMPLATES/taskCard` 5개 relation family와 `body:stage: materialize` 4개가 `closed`, Work `sha256:c9228278…`에서 `body:guard: missing-bounded-basis` 4개가 `closed`였다. Direct authoring card는 정확한 file query의 `discovery-only` 한계를 그대로 보고하며, Principles `sha256:cc040ff4…`와 외부 Skill Rails `sha256:1a7d9333…`에는 이번 감사 수리로 바뀐 정본이 없다.
- Direct `authoring-card.md`, Principles `sha256:5b489926…`의 `references/knowledge/inputs-and-entry.md`, 외부 Skill Rails `sha256:1a7d9333…`의 build/runtime 파일은 정확한 file query가 `discovery-only`다. 이 describer는 generic prose와 자기 build/runtime 관계를 모델링하지 않으므로 이를 closure로 주장하지 않는다.
- Direct `STAGES/materialize` 전체 query의 block은 유효한 terminal fixture 네 개의 `expect.stage: null`을 string이 아니라고 거부하는 외부 Skill Rails describer 결함이다. 더 작은 정직한 카드 형상 소유자 `spec:TEMPLATES/taskCard`로 관계를 닫았지만, 변경된 두 branch action 문자열 자체에는 독립 native locator가 없어 direct source와 표적 실행이 의미 권위다.
- 최신 Skill Rails maintenance-context/index로 현재 정본 소유자, 생성 투영, repository 검사 소비자를 다시 추적한 결과 보호된 후보에서 외부 지원이 직접 대체하는 workaround·중복 설명·bespoke mechanism은 0건이었다. 공통 runtime 투영은 배포물이고 repository suite wiring과 Devflow의 소유자·상태 의미는 Skill Rails 책임이 아니므로 자연스러운 순감축도 없다.

## 제한과 이월

- full cold flow는 통과하지 않았다. Sol은 승인된 `proposal.decision=approve` 재호출에서 앞선 `request.classification`이 누적되지 않아 intake가 같은 값을 다시 요구했고, 그 요청대로 같은 run에 값을 주자 event 173 `duplicate-decision-emission`으로 멈췄다. 이는 runtime이 “이번에 요청한 값만 공급”하게 하면서 재판정에는 앞선 judged 입력까지 요구하는 Skill Rails 0.3.4의 requested-only/cumulative-input 계약 모순이다.
- Opus는 Work 뒤 두 번째 Direct pass에서 이미 존재하는 card write가 관찰 상태를 바꾸지 않아 같은 Decision이 재생되고 event 147에서 멈췄다. 그 직전 `after-effects`에 필요한 `record`+`align`을 생략한 것은 Opus 자신의 절차 누락이지만, Sol이 독립 재현한 누적 입력 모순까지 설명하거나 해소하지는 않는다. 따라서 두 cold flow의 Verify와 최종 Resume, fresh-agent 장기 drift·출력 품질은 unverified다.
- 독립 Opus whole-diff 재감사 `C:/Users/joinj/AppData/Local/Temp/claude/D--Projects-Private-nanomia-nanomia-skills-devflow/760a6317-d1c2-4a13-84ca-71bde759de8a/scratchpad/AUDIT-0.23.20-independent_ko.md`는 최종 후보의 blocking 소견 0을 보고했다. 후속 인과 반증은 Opus가 upper-document staleness를 Direct card-contract objection으로 분류한 것을 정정했다. 코드 review는 pass가 맞고 Work의 별도 `feedback.action=staling`이 소유자 경로여야 한다.
- 별도 Devflow 이월 1: Resume의 dedicated digest commit은 쓸 수 있는 prior HEAD를 marker로 담으므로 자체 커밋 직후 필연적으로 `behind=1, others=0`이고 `ready.digest-behind`가 계속 우선한다. 별도 Devflow 이월 2: Work의 `staling` branch는 checkpoint 뒤 Resume로 보내지만 Product-owned glossary와 Arch-owned capability zones를 지목하는 durable marker가 없어 `claim.mine`이 다시 Work로 돌린다. 둘 다 0.23.19부터 있던 결함이며 이번 릴리스는 드러냈을 뿐 만들지 않았다.
- 두 이월의 자연스러운 수리는 각각 digest freshness/vehicle 의미 결정과 Principles–Work–Resume–Product/Arch의 durable consumer transaction을 요구한다. 0.23.20의 Direct basis 또는 공통 runtime 투영으로 고칠 수 없고 이미 통과한 gate를 무효화할 만큼 같은 원인의 최소 수정도 아니므로 이번 후보에서는 report-only다.
- 설치, 배포 확인, commit, push는 수행하지 않았다.
- Opus whole-diff 감사의 네 소견은 universal K edge와 literal 표기, Work 설명, CHANGELOG 사실을 각 정본에서 한 묶음으로 수리했고 독립 재감사가 이를 닫았다. 남은 relation 한계와 위 이월은 감사 지침 §5의 같은 문장 세 번째 수정·근거 없는 혼동 주장·진자 운동으로 후보를 다시 여는 사유가 아니며, 미실행 행동은 통과로 계산하지 않는다.
