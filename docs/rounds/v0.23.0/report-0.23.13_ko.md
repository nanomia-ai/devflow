# v0.23.13 구현 보고 — Adopt 의미 반증의 진전 기반 수렴

날짜: 2026-09-06
시작 HEAD: `cea05e26f4f5d9977588ceef4a5f94efec85c558`
범위: Adopt의 기존 semantic-refutation 판단·재진입, DD-106, 매트릭스 §3.24, 배포 증거

## 확정 원인과 선택한 경계

v0.23.12 Adopt는 완전한 초안을 한 번 clean-context에서 반증하고 clear만 구속 질문으로 보내는
안전 경계를 가졌다. 그러나 초안을 한 번 수정한 뒤에는 실제 차단 원인이 사라졌거나 좁아졌는지와
무관하게 남은 finding을 `blocked`로 닫았다. 실제 사용자 실행이 이 정지를 만났으며, 보존된 원자료가
세 finding의 개별 분류까지 확정하지는 못하므로 이번 수정은 그 분류를 정답으로 쓰지 않는다.

DD-106은 DD-102의 유계 입력, clean independence, load-bearing 차단 기준, 최초 전체 반증 한 번과
clear-only approval을 보존한다. “한 번 수정”이 비용과 수렴을 함께 고정한다는 이유만 부분 반증하고,
반환된 인과 범위의 독립 재검사로 진전을 관측하며 진전 없는 같은 원인에서 멈추게 한다.

## 구현한 실행 흐름

- `refutation.state`는 `pending | revise | clear | blocked`다. 기존 단계에만 `revise` branch를 더했고
  새 stage, terminal, runtime, collector, counter, registry, artifact, template field는 만들지 않았다.
- revise의 effect 순서는 현재 초안의 모든 차단 finding에 현행 권위와 반환 증거가 뒷받침하는 수정을
  적용하는 `RUN` → 반환 좌표·변경 target·직접 결과를 독립 재검사하고 현재 `Evidence verification`을
  기록하는 `RUN` → 기존 re-entry를 여는 `NEXT`다.
- 첫 revise는 현재 초안·반환 증거·모든 현재 차단의 구체적 수정안이 필요하다. 이후 revise는 직전
  수정이 시도한 모든 원인을 인과 범위에서 없애거나 엄격히 좁혔고 새 차단이나 닫힌 실패를 열지
  않았다는 독립 증거가 필요하다. 이름·좌표·finding 총수 변화만으로는 진전이 아니다.
- 같은 원인이 그대로이거나 퇴행한 경우, 필요한 사람 답이나 권위 모순, 현재 초안·출처·직전 증거·
  clean context 부재는 현재 실패와 필요한 입력을 밝히고 기존 `blocked`/`BLOCK`에 남는다.
- clear는 최초 coverage가 보존되고 현재 독립 검증에 차단 finding이나 답하지 않은 구속 의존성이
  없을 때뿐이다. 미래 결정을 확정 사실로 잘못 쓴 것은 현재 구속이 답에 의존하지 않으면 미정으로
  되돌릴 수 있지만, 구속 사실을 Questions로 옮기는 것은 clear가 아니다. 사람 답이 load-bearing
  초안을 바꾸면 현재 쓰기 집합 확인 전에 그 영향 범위를 다시 검사한다.

기존 제안 template의 `Evidence verification`이 최초 coverage, 현재 causal scope, 진전 또는 남은
실패와 결과를 계속 소유한다. 생산자 transcript·verdict는 재검사 입력이 아니며 finding마다 새 전체
pass를 열지 않는다. proposal/approval과 승인 전 write 0, `adopt — layer 0` 및 `adopt — capabilities`
두 commit 경계, Product·Architecture·Design·Capability owner/K 착지는 그대로다.

## 변경 경로와 변경량

- runtime core: `skills/adopt/spec.mjs`, `body.md`, `references/workflow.md` — `+6/-5`줄이다. 물리적
  순증 1줄만으로 규모를 축소하지 않는다. 세 파일은 UTF-8 `28,628 → 31,870` byte
  (`+3,242`, 11.3%), 공백 단어 `3,467 → 3,892`개(`+425`, 12.3%)다.
- P2 authoring·forward evidence: `authoring-card.md`, `.skill-rails/{intent,obligation-ledger,eval-cases}.json`,
  `fixtures/make-scenarios.mjs` — `+36/-15`줄.
- generated evidence: `fixtures/scenarios.json`, `.generated.json` — `+40/-13`줄. 생성 `SKILL.md`, runtime,
  schema, adapter, template에는 diff가 없다.
- 결정·배포: `docs/design-decisions_ko.md`와 영어 쌍, `docs/usecase-matrix_ko.md`, 두 plugin manifest,
  `CHANGELOG.md` — 이 보고서 제외 `+129/-10`줄.
- tracked 후보 합계는 이 보고서 제외 `+211/-43`줄이다. 새 파일은 이 보고서 하나이고 삭제·이동은
  없다. 이 보고서 118줄을 포함한 전체 후보는 `+329/-43`줄이다.

Skill Rails stable-ID maintenance가 observation, 기존 stage, body section, workflow resource, 선언과
현재 intent atoms를 한 transaction으로 갱신했다. historical migration atoms는 그대로이고,
`completion-evidence-004`와 `judgment-points-003`만 새 target·forward evidence에 맞췄다. 생성
semantic-diff는 transaction 검토에 사용한 뒤 이 릴리스 범위 밖의 직전 tracked byte로 복원했다.
그 파일의 오래된 transaction 기술은 runtime reader가 없는 기존 진단 부채이며 이번 릴리스가 새
정본이나 배포 증거로 승격하지 않는다.

## 검증과 현재 상태

- Skill Rails fast lint와 full lint 통과. 최종 formal build는 L0–L18, mutation 20/20, fixture
  12/12, deterministic repeat 200, mismatch 0이며 receipt build id는
  `sha256:75d959b4ef431aa1224767a3cbdaefec81e90f0de3c9fa31a1e7ed5dfa43b60a`이다.
- Adopt eval 25회는 structural L0–L18, behavior 12/12, mismatch 0으로 통과했다. eval case는 여러
  checkpoint에서 진전한 revise와 같은 원인이 그대로인 stop을 한 장면으로 구분하지만, 이는 모델의
  실제 준수를 실행한 증거가 아니라 구조·결정 fixture 증거다.
- 직접 Decision 대조는 pending `READ,RUN,RUN,RUN,RUN,NEXT`; revise `RUN,RUN,NEXT`; clear
  prepare `REPORT,ASK`; refuse `REPORT,DONE`; approve의 기존 16-effect write/validate/commit 순서를
  확인했다. `approval.action=approve`가 이미 있어도 blocked는 `BLOCK`으로 멈춰 approval을 우회하지
  못했다.
- 양 언어 decision index는 DD-102가 DD-103과 DD-106에 일부 정정되고 DD-106이 같은 Brownfield
  주제의 active 행으로 투영됨을 확인했다.
- 원시 표적 출력: `C:/Users/joinj/AppData/Local/Temp/orca/V02313-ADOPT-TARGETED-RAW.txt`.
- 고정된 아홉 cold scenario의 현재 후보 해석은 A–C `revise`, D/E/G/H `blocked`, F `clear` 뒤
  `REPORT,ASK`, I는 누락된 correction/progress 사실에 따라 `revise` 또는 `blocked`다. I의 선행
  `approval.action=approve`는 어느 경우에도 효력이 없고, 아홉 장면 모두 project write를 허용하지
  않았다. 이는 가상 입력의 순수 evaluator projection이지 실제 effect 실행이나 real-use PASS가 아니다.
- 독립 Opus whole-diff 감사 결과는 adopted, blocking, tier-1, rule-conflict, loss-path,
  patch-on-patch finding이 모두 0이었다. 감사 지침 §5는 (1) 규칙 충돌 0, (2) 소실 경로 0,
  (3) 남은 소견이 모두 양갈래 독해 단일화 또는 표현 등급인지, (4) 수리가 수렴형이며 새 해석을
  열지 않는지를 모두 평가했다. 채택 소견은 없었고, 네 번째 항목은 감사가 새 수리를 만들지 않아
  판정 대상이 없다는 단서와 함께 종료를 선언했다.
- 감사와 cold 비교가 닫힌 뒤 canonical runner
  `node --test scripts/*.test.js skills/**/*.test.mjs`를 정확히 한 번 실행했다. exit 0,
  tests/pass `574/574`, fail/cancelled/skipped/todo 0, `duration_ms 1392937.1095`였고 같은 실행의
  Gate A도 green이었다. 원시 log는
  `C:/Users/joinj/AppData/Local/Temp/orca/V02313-CANONICAL-SUITE-RAW.txt`, SHA-256은
  `9b7073f7d72e9163ce9a9302d0a222372b29c4feeae1c806014204ac796a7c73`이다.

`git diff --check`, 최종 path 집합, stage 0, receipt coherence, protected evidence byte/hash를
canonical 실행 전후에 확인했다. 이 pre-commit 기록 시점에는 commit, push, 양측 install이 아직
수행되지 않았고, 실제 완료 증거는 저장소 밖 최종 release receipt가 소유한다.

## 종료 판정과 보존 경계

독립 감사와 아홉 cold scenario는 첫 revise 자격, 두 RUN과 NEXT, 이후 revise의 인과 진전,
무진전·퇴행·닫힌 실패 재발, owner/authority/missing-input stop, current independent clear,
load-bearing owner 답의 재검사와 Questions 우회를 함께 확인했다. pending 최초 전체 pass 한 번,
유계 recheck, producer transcript/verdict 배제, blocked/null, clear-only approval, 두 commit 및 owner/K
경계도 유지됐다. 추가 runtime repair 없이 §5 종료조건과 canonical gate가 닫혔다.

Gate B는 capability/product verification 계약과 Direct–Work–Verify closure가 바뀌지 않아 적용 대상이
아니다. 유지보수 entry 배선도 바뀌지 않아 clean Claude/Codex before/after paired comparison 역시
적용 대상이 아니다. 두 cold 보고서는 이 entry 비교의 대체물이 아니다.

## 미검증과 보호 자료

세 실제 incident finding이 모두 current-authority correction이었는지는 raw sample 부재로 미확정이다.
새 eval case는 실행 계약을 잠그지만 fresh model이 긴 상호작용에서 인과 진전을 정확히 판정하는지는
사용자가 새 설치 뒤 같은 실제 프로젝트에서 재실행하기 전까지 `unverified`다. 자동 suite의 통과 수는
이 실제 semantic behavior를 대신 증명하지 않는다.

사용자 근거 `DEVFLOW-KNOWLEDGE-STRUCTURE-REVIEW.md`는 39,268 byte, SHA-256
`f67c29dc0c841118ed61381bdda40420ba0f343203b5bef0d37e2fd683d0a7ea`인 untracked read-only
evidence로 보존한다. 수정·이동·삭제·stage·commit하지 않았으며, release closeout도 이 파일을 제외한
정확한 17경로만 다룬다.
