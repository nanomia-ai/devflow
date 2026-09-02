# v0.20.0 구현 및 최종 릴리스 후보 기록

## 현재 지위와 보관

이 문서는 DD-72가 정한 v0.20.0의 유일한 구현 보고서이며, 현재 최종 후보 바이트의
측정·판정·한계를 보관한다. 현재 사실은 Git과 두 manifest가 소유하고 이 문서는 별도
current-facts 층을 만들지 않는다. 후보 작업 트리는
`jmp-develop/phase4-devflow-final-repair`, runtime 기준 commit은
`c28facc1b9707f06234a32426f9b51a695bad053`다.

이번 최종 기록 편집은 위 committed repair와 제공된 두 보고서만 증거로 삼고, 동시 작업 중인
범위 밖 unstaged byte는 판정이나 커밋에 포함하지 않는다. 두 manifest는 `0.20.0`이다. 이
편집의 유일한 저장소 쓰기 범위는 `CHANGELOG.md`, 이 보고서,
`docs/usecase-matrix_ko.md`, `docs/design-decisions{,_ko}.md`,
`docs/design-backlog.md`다. runtime·generated·manifest는 움직이지 않고 저장소 경로의
생성·삭제·이동은 0이다.

시험한 runtime 바이트와 출하할 runtime 바이트는 같아야 한다. 이후 존재할 수 있는
commit/install 식별자 기록은 `skills/`, `codex/`, `hooks/`, `scripts/`, 두 manifest의
closure가 시험한 후보와 hash-identical임을 먼저 증명하는 identifier-only 문서 갱신이어야
하며 deploy 바이트를 바꾸면 안 된다. 이 기록 커밋의 id는 문서 자체가 들어가는 commit이므로
사전에 추측해 쓰지 않는다.

## 역사적 Phase 3·Phase 4 증거 — 현재 후보의 릴리스 통과로 세지 않음

아래 기존 Phase 3 기록은 당시 브랜치 `jmp-develop/devflow-skill-rails`, HEAD
`080a8cbd031b2da9efa4051bd56197ddbaf54017`부터 이어진 구현 계보를 보존한다. 뒤의 442,
444, 449, 450 wildcard 수치와 14개 clean-entry transcript는 각 당시 바이트의 역사적
문맥일 뿐, 현재 `c28facc` committed 후보의 남은 최종 관문을 통과시킨 증거가 아니다.

## Phase 3 최종 결과

Korean Codex fallback header의 명백한 literal 충돌을 고쳤다. stale shared Resume 문구가
아니라 shared Principles 문구를 가리키도록 했으며, 이는 shared-entry 소유권 DD-92와
P2 authored/runtime 언어 소유권 DD-93에 따른 것이다. 이 clear-literal repair 뒤에는
Korean/English/runtime을 대상으로 한 focused re-audit을 수행했다.

최종 전체 wildcard 실행은 정확히 한 번뿐이었다.

```text
rtk node --test scripts/*.test.js
2026-08-30T08:04:44.521Z .. 2026-08-30T08:23:46.191Z
exit 0; tests 442; pass 442; fail 0; cancelled 0; skipped 0; todo 0;
suites 0; duration_ms 1140559.902
```

독립 Opus bounded review는 clean brownfield의 yes/no 판정과 missing seam을 확인했고,
residual-route/dead-script 정리, package test 13개, central audit, Principles checks=7 및
scenarios=10, lifecycle/parity wiring을 검토했다. 따라서 이 결과가 뒷받침하는 신뢰는
결정론적·구조적 층에서만 높다.

Opus audit가 malformed-present Brownfield blocker를 먼저 제기했고, Fable xhigh
adjudication은 이를 기각했다. malformed-present Brownfield는 의도적으로 fail-closed이며,
그 잘못된 write 경로는 유효한 Principles-to-Resume 진입으로는 도달할 수 없다. 그러므로
코드 수리는 하지 않았다. 다만 unpinned malformed fixture와 human-only recovery는 통과한
동작이 아니라 경험적/견고성 위험으로 남는다.

두 번째 Korean adapter prose 관찰도 기록한다. `codex/AGENTS-devflow_ko.md`는 아직
devflow가 감지될 때 hook이 작동한다고 말하지만, English와 `scripts/session-start.js`는
모든 Git root에서 Principles guidance를 낸다. runtime에는 영향이 없고, 이 불일치는
nonblocking·unrepaired이며 이 literal-correction 범위에서는 adapter를 수정하지 않는다.

## 검증과 정지 경계

`node scripts/decision-index.mjs` 및 `node scripts/decision-index.mjs --lang ko`는
DD-92/DD-93 projection을 확인하고 exit 0으로 끝났다. `git diff --cached --check`와
focused `node --test --test-reporter=dot scripts/repository-invariants.test.js`도 각각
exit 0으로 끝났다.

audit-guideline §5를 literal·causal하게 적용했다. Fable adjudication 뒤에는
rule-conflict/data-loss-path finding이 0개이고, 적용한 Resume-to-Principles header repair는
convergent하며 새 ambiguity를 만들지 않았다. 남은 Korean hook-detection prose observation은
two-way-reading unification/expression grade일 뿐이고, 범위가 정해지지 않은 observation은
report-only이므로 그 수리의 convergence를 조용히 주장하지 않는다. 실행하지 않은 동작은
pass가 아니라 **unverified**이며, product/real-use 결과를 구조 검증으로 대체하지 않는다.
따라서 Phase 4, install/snapshot refresh, clean Codex/Claude 비교, disposable
forward run, 실제 recursive-K 동작, handoff/resume, history-walk latency 및
session-start footprint는 모두 명시적으로 **unverified**다. Gate B는 검증 계약 변화가 없어
해당하지 않는다. 이 보고서는 production
readiness를 주장하지 않는다.

## Staged-snapshot 경로 부록

기준 HEAD는 위의 `080a8cbd031b2da9efa4051bd56197ddbaf54017`이다. outer RTK
PowerShell/native Git으로 확인한 `git diff --cached --name-status -M --diff-filter=ADR`는
정확히 649행(619 A, 24 D, rename 6개)이며, rename은 R099 1개, R100 2개, R051 1개,
R098 1개, R064 1개다. 모든 현재 A/D/R 경로명과 rename source/destination은 이 Git-owned
명령이 기준 HEAD의 staged snapshot에서 열거한다. fingerprint는 주장하지 않으며, 이는
Git이 current facts를 소유한다는 경계를 유지하면서 별도 대형 path-list artifact를
만들지 않는 부록이다.

이 문서 정정 자체가 만든/삭제한/이동한 경로: 없음.

## Phase 4 root repair — 최종 집중 증거

앞선 Phase 3 증거와 한계는 위에 그대로 보존한다. 이 부록의 최초 root repair 증거는
`dedf24a65c2767ff86079cb91e2719bc20a9f973`에서 실행됐다. 2026-08-31 최종 수리는
Product C-row parser 수리 커밋 `0310727b7c51d0b0a6da367c55c44b3ed4a51165`를 직접
선행자로 삼아, 설치된 Skill Rails v0.1.7의 아홉 패키지 동시 재생성과 그 유계 증거만
추가한다. 이 기록은 Phase 4 실사용을 다시 실행했다고 주장하지 않는다.

그 뒤 glossary 정본 수리는 깨끗한 `86a4d19430002b5f90a1ded470a03d5438615390`을
기준으로 Product 소유 원본과 Adopt·Arch 투영만 고쳤다. 아래 glossary 증거는 이 새 diff에
대한 유계 실행이며, Phase 4 AFTER나 wildcard root suite를 다시 실행했다는 뜻이 아니다.

### 원인과 수리 경계

원인은 대상 card를 고르는 공개 입력과 runtime collector가 서로 다른 입력을 보던
경로였다. `stage --target <portable project-relative path>`의 `targetPath`가 API에서
snapshot·collector·trace로 전달되고 Resume 재실행 명령에도 보존되지 않으면, Work는
동시에 존재하는 card 중 어느 것을 판정할지 결정할 수 없고 누락을 `invalid-card`로
오인할 수 있다. `targetPath`는 project root 아래의 portable 상대 경로로 정규화하고
absolute path·parent traversal·경계를 넘는 symlink/junction을 거부한다. `targetPath`는
Decision의 domain field가 아니며, tracing이 켜진 때 `decision_emitted.data.targetPath`와
재실행 명령에만 보존된다.

Fixture의 `UNKNOWN`과 live `unknown()`은 같은 값으로 취급하지 않는다. Fixture는
문자열 `UNKNOWN`을 쓰거나 항목을 생략하고, private sentinel인 live `unknown()`을
주입할 수 없다. 반대로 live collector는 관측을 얻지 못한 때에만 `unknown()`을
반환한다. 이 경계를 소비하는 곳은 정확히 세 곳, Work의 `card.target`, Resume의
`state.brownfield`, Verify의 `principles.channel`이다.

`guard-pending:<id>` coverage를 `L14`가 `guard:<id>`와 함께 인정하도록 고쳤다.
pending guard/event 명칭은 coverage의 사실을 보일 뿐 다른 action을 선택하지 않는다.
`dedf24a` 시점 아홉 패키지의 runtime `0.3.0` 및 validator `0.4.0` 투영은 현재
최종 수리 트리에 대해서는 stale이다. 설치된 Skill Rails v0.1.7 builder가 아홉 P2
패키지(adopt·arch·design·principles·product·resume·split·verify·work)를 한 묶음으로
runtime `0.3.1`, validator `0.4.1`, kernel `6`에 재생성했다. 행동과 판단의 소유자는
계속 각 패키지의 `spec.mjs`와 `body.md`다. authored migration은 Principles의 10/10
scenario와 Verify의 아직 분리되지 않았던 25/28 scenario에만 적용했고, Verify의 이미
분리된 두 fixture에 남은 중복 `history.basis` 두 값도 collector lane에서 제거했다.
나머지 일곱 패키지는 authored source 변경 없이 projection만 재생성했다.

### 집중 실행 증거와 현재성

아래 첫 표는 `dedf24a`에서 실행된 이전 root-repair 증거다. 그 실행 사실은 유효하지만
현재 최종 수리 트리의 통과 증거로는 stale이다.

| 항목 | 결과 |
|---|---|
| collectors/seams | 22/22 |
| K state-consumers | 17/17 |
| eval fixtures (1,800회 반복) | 258/258 |
| mutation checks | 20/20 |
| repository invariants | 19/19 |
| runtime byte mismatches | 0 |

최종 root suite는 위 `dedf24a`에서 정확히 한 번 실행되어 exit 0이었다: tests 444,
suites 0, pass 444, fail/cancelled/skipped/todo 0, `duration_ms 1332167.6359`.
이 수치는 문서 변경 전 추적 modified paths 119개와 문서 변경 후의 그 기존 경로들이
동일하다는 확인과 함께 읽는다. 앞서 standalone wrapper가 604초에서 timeout 난
사건은 `unproven`으로 분류하며, 최종 full suite가 그것을 대체한다. 따라서 그 timeout은
test failure로 세지 않는다. 다만 그 full suite도 현재 최종 수리 트리에 대해서는 stale이며
이번 작업에서 다시 실행하지 않았다.

선행 Product/Adopt schema 수리 트리 `86a4d19430002b5f90a1ded470a03d5438615390`의
root wildcard 결과도 따로 경계한다: tests 449, pass 449, fail/cancelled/skipped/todo 0,
`duration_ms 1279527.7144`. 그 실행 사실은 유효하지만 glossary 수리 뒤 트리에는 stale이며,
이번 작업은 이를 새 통과 수치로 인용하거나 wildcard를 다시 실행하지 않았다.

현재 최종 수리 트리에서 새로 실행하거나 builder receipt로 다시 계산한 유계 증거는 다음과 같다.

| 항목 | 현재 결과 | 증거 경계 |
|---|---:|---|
| installed runtime / validator / kernel | 0.3.1 / 0.4.1 / 6 | 설치본 `constants.mjs` 직접 확인 |
| Skill Rails L-full / L0–L18 | 9/9 package pass | installed builder가 아홉 package를 각각 한 번 build |
| mutation checks | 180/180 | package마다 20/20, survivor 0 |
| scenarios | 258/258 | package마다 200 repeats, 총 1,800 package repeats, mismatch 0 |
| Principles scenario | 10/10 | judged 30개·decided 20개 lane 분리 뒤 pass |
| Verify scenario | 28/28 | 25/28 authored migration과 중복 두 값 제거 뒤 pass |
| formats | 18/18 | 각 format 256 round trips |
| repository invariants | 20/20 | 기존 all-nine 검사가 runtime/validator version과 hash를 함께 비교 |
| canonical runtime byte identity | 225/225 | installed runtime 25개 × package 9개, CR 정규화 비교 |
| generated-file hashes | 342/342 | 아홉 `.generated.json`의 owned hash 재계산 |
| Principles public target | pass | generated CLI에 public `--target` 존재 |
| unexpected delete / move | 0 / 0 | 현재 status와 generated ownership 대조 |

builder가 새로 만들고 각 manifest가 소유·hash한 경로는 정확히 다음 아홉 개다.

- `skills/adopt/scripts/skill-rails/observations.mjs`
- `skills/arch/scripts/skill-rails/observations.mjs`
- `skills/design/scripts/skill-rails/observations.mjs`
- `skills/principles/scripts/skill-rails/observations.mjs`
- `skills/product/scripts/skill-rails/observations.mjs`
- `skills/resume/scripts/skill-rails/observations.mjs`
- `skills/split/scripts/skill-rails/observations.mjs`
- `skills/verify/scripts/skill-rails/observations.mjs`
- `skills/work/scripts/skill-rails/observations.mjs`

감리 지침 §5 정지 조항도 현재 diff에 대해 평가했다. 규칙 충돌과 소실 경로는 0이고,
남은 변화는 decided/judged lane 단일화, generated projection, version split을 막는 기계
invariant, 그리고 stale/fresh/unverified 상태 정정뿐이다. 모두 수렴형이며 새 action 해석을
열지 않는다. 같은 문장의 세 번째 수리, 구체적 오독 둘 없는 가능성 소견, 앞 수리를 되돌리는
진자 운동, 이전 라운드 소견만을 근거로 한 소견은 각각 0이다. 수리 뒤 유계 재감사는 현재
authored fixture·`spec.mjs`/`body.md` ownership·generated bytes·보고 문면만 한 번 걸었고,
신규 충돌·소실·예상 밖 authored change 0으로 종료했다. 다음 검증 수단은 문면 반복이 아니라
아래에 unverified로 남긴 Phase 4 실사용 재실행이다.

### Opus lead, Fable 및 Sol disposition

- Opus가 이끈 판정에 대한 Sol disposition은 위 causal `targetPath`, Fixture `UNKNOWN` 대
  live `unknown()`, `guard-pending`/`L14`, 세 consumer 경계와 all-nine regeneration을
  분리해 확인하는 것으로 정리됐다.
- Opus B1의 Product parser binding은 선행 커밋 `0310727b`가 canonical `C<n> <name>`과
  legacy form을 함께 보존하는 combined parser로 수리했다. 이 작업은 그 source와 test를
  다시 편집하거나 standalone suite를 다시 실행하지 않았다.
- Opus B2의 package split은 installed v0.1.7 all-nine rebuild와 20번째 repository
  invariant로 닫았다. 이전 `0.3.0/0.4.0` projection은 현재 증거가 아니다.
- comma-single-line `Read first`는 지원하지 않으며 안전하게 BLOCK한다. 이는 compatibility
  defect가 아니다.
- `guard-pending`/event naming은 잘못된 action을 만들지 않는다. Fable 아래에서 이를
  accepted terminology debt로 남긴다.
- exact upstream parity는 입증됐다. DD-93이 generated mechanics를 upstream-owned로
  유지하므로 새 decision은 만들지 않는다.
- Fable release-gate의 N-1/N-2는 하나의 수용된 parser 한계로
  `docs/design-backlog_ko.md`에 먼저 기록하고 `docs/design-backlog.md`에 같은 관찰을 옮겼다.
  내용 있는 혼합 행의 조용한 탈락과 `C<n> ` prose의 phantom 투영은 이번 수리보다 앞선
  owner/model hand-edit 경계이며, tail guard는 실제 행의 조용한 탈락을 늘리므로 채택하지 않았다.
  parser·grammar·state zone은 바꾸지 않았다.
- N-3는 `scripts/repository-invariants.test.js`의 기존 all-nine `deepEqual`에
  `runtime_hash`와 `validator_hash`를 더하는 것으로 닫았다. 별도 mechanism이나 test는 만들지
  않았다. N-4 token assertion은 optional로 남겼고 실행 실패가 요구하지 않았으므로 구현하지 않았다.
- Fable N-7의 capabilities-only 안은 Sol의 두 번째 consumer 추적으로 underfix로 판정했다.
  `skills/product/spec.mjs`의 `TEMPLATES.productConfirmed.fields`와
  `skills/product/templates/product-confirmed.md`를 Product 소유 원본으로 유지한 채,
  `skills/adopt/spec.mjs`의 `TEMPLATES.product.fields`와
  `skills/adopt/templates/product.md`만 완전한 confirmed schema 투영으로 맞췄다. 이로써
  state parser뿐 아니라 실제 Product collector의 후속 `product.file=current` 경로도 함께 닫힌다.
  runtime cross-skill import·registry·parser·state zone은 추가하지 않았다.
- 설치된 Skill Rails v0.1.7에서 `product` impact diagnose 뒤 stable-ID transaction 하나
  (`replace-artifact` `spec.mjs` + `replace-resource` `templates/product.md`)만 실행했다. semantic
  diff는 template field map 1건과 template content 1건만 modified였고 observation·guard·stage·
  table·format·body·ownership·artifact·declaration·deferred 변화는 0이었다. line diff도 authored
  두 경로와 builder-owned `skills/adopt/.generated.json`만 남겼다.
- Fable의 glossary release-gate 판정은 frozen brownfield 실물에서 실제 용어 6개가 canon 0개로
  사라지고 `Next`와 malformed invariant-like line을 포함한 phantom definition 둘이 생긴 장면을
  실행했다. Product가 영향받지 않는다는 앞선 주장도
  greenfield 작성자 2/2가 bullet형 glossary를 쓴 실물로, Adopt만 닿는다는 주장도 Arch의 두
  `glossary-term` WRITE 원문으로 각각 기각했다. 채택한 최소 수리는 DD-91의 Product 소유 템플릿과
  Adopt·Arch의 byte-identical 투영이며, Sol의 추가 READ 효과·일반 invariant와 Opus의 Adopt-only
  안은 각각 overbuild·underfix로 기각했다.
- Product `templates/glossary.md`의 제목 줄 HTML 주석이 literal `<term>: <definition>`과 no bullet/
  no bold를 싣고 `TEMPLATES.glossary.terms`는 `generated`다. Adopt와 Arch는 같은 바이트를 가지며,
  Adopt approval의 네 번째 WRITE와 Arch glossary-term 두 갈래의 모든 glossary WRITE가
  `template: "glossary"`를 쓴다. `result` 템플릿과 `knowledgeOwner`/`knowledgeOwnerScope` WRITE,
  collector·parser·zone·registry·runtime import·scenario mechanism은 바꾸지 않았다.
- 설치된 Skill Rails v0.1.7에서 Product·Adopt·Arch를 각각 diagnose한 뒤 stable-ID
  `replace-artifact`/`replace-resource` transaction으로만 고치고 세 package만 rebuild했다.
  semantic diff는 Product template kind/content, Adopt approval/template/artifact, Arch
  glossary-term/template/artifact에만 닿았고 observation·guard·table·format·body·ownership·
  declaration·deferred 변화는 0이었다. 새 canonical path는 Adopt·Arch의 glossary template 둘,
  builder-owned projection 변화는 세 `.generated.json` receipt이며 삭제·이동은 0이다.

이번 수리의 실행 증거는 다음과 같다.

| 항목 | 현재 결과 |
|---|---|
| Skill Rails maintain | Product·Adopt·Arch transaction 3/3 성공 · generated manual edit 0 |
| Product/Adopt/Arch full build | 3/3 L0–L18 pass · mutation 60/60 · scenario 94/94 × 200 repeats, mismatch 0 · format 4/4 |
| Product/Adopt/Arch eval | 3/3 L0–L18 pass · behavior 94/94 × 200 repeats, mismatch 0 |
| Product/Adopt/Arch 집중 T4 | 2/2 pass — canonical Product template의 실제 collector `current`, spec/artifact/effect binding, 세 template byte parity, real state tool의 shape/blocking/design-refresh/Next/Alpha/capability 02 |
| Adopt approval simulate | Decision `sha256:c7dae28d1f6dcab467a7983e660a9f33f11a3594d80e9ed86901593f035b8a68` · effect 4와 stage artifact 모두 `template: "glossary"` |
| repository invariants | 20/20 pass — 같은 기존 all-nine 검사에서 version과 hash를 함께 비교 |
| generated ownership/hash | verifyManifest 9/9 · detectGeneratedEdits 0 · runtime/validator identity variant 1 · generated hash 342/342 · Product/Adopt/Arch glossary SHA-256 `bf7916fa8a6185b21d394ac6230ff32cc8c35c4526da5c5125c5cdb839494e52` · Adopt/Product schema SHA-256 `5bdea011440d1b74c9f375d8d4d9814f20fc6f9be22ea46be28def759034e649` |
| 문서·diff | decision index en/ko exit 0 · `git diff --check` exit 0 |
| final root suite @ `f5655ef` | tests/pass 450/450 · suites/fail/cancelled/skipped/todo 0 · `duration_ms 1268897.1699` · stderr 0 B · start/end clean |

`f5655ef00b49aed9221fabb600e21cee43662afb`에서 먼저 실행한 full-suite wrapper는 604022 ms에
timeout 나 `UNPROVEN`이며 완료 suite로 세지 않는다. harness를 exact PID 추적으로 고친 뒤의 한
실행만 위 450/450을 냈다. complete raw artifact는
`D:\Program Files\orca\workspaces\devflow\phase4-empirical-artifacts-run_3704018d415f\evidence\final-root-suite-f5655ef-complete.txt`다.

독립 Opus 검토의 유일 blocker는 이 completion gate 미실행이었다. 450/450 뒤 mechanism blocker는
0이며, tier-3 소견 여섯은 외부
`D:\Program Files\orca\workspaces\devflow\phase4-empirical-artifacts-run_3704018d415f\reviews\opus-glossary-canon-repair.md`에
그대로 남는다. Phase 4 residual은 계속 `unverified`다.

`docs/usecase-matrix_ko.md` §1 사람 요청과 §2 AI 진입을 다시 대조했다. 이번 Product/Adopt/Arch
수리는 요청 형태·진입·소비 집합을 바꾸지 않고 이미 선언된 Layer 0/glossary WRITE의 템플릿만
복원하므로 기존 standing verdict는 그대로이고 새 행·움직인 칸은 0이다. matrix는 수정하지 않았다.

감리 지침 §5는 이 수리 diff에 다시 적용했다. 수리 뒤 새 규칙 충돌·소실 경로는 0이며, 남은 변화는
한 canonical owner의 package-local 투영, 두 기존 seam의 강화, 수용 한계의 durable landing뿐이다.
수리는 모두 수렴형이고 새 action 해석을 열지 않는다. 같은 문장의 세 번째 수리, 구체적 두 오독 없는
가능성 소견, 앞 수리를 되돌리는 진자 운동, 이전 소견만을 근거로 한 소견은 각각 0이다. 수리 clause는
semantic/line diff와 위 집중 실행으로 한 번 재평가했고 신규 충돌·소실·예상 밖 generated byte 변화
0으로 닫았다. 다음 검증 수단은 wildcard 반복이 아니라 아래 Phase 4 실사용이다.

### Phase 4 AFTER와 운영 경계

Phase 4 AFTER의 same-condition Codex/Claude scenarios, recursive-K use quality, latency,
session-start, handoff/resume, devflow adapter install은 모두 `unverified`다. Gate B는 검증 계약
변화가 없어 해당하지 않는다. `0310727b` handoff의 focused 7/7은 선행 작업의 증거이며 이번 작업이
재실행한 수치가 아니다. `86a4d19`의 449/449와 `duration_ms 1279527.7144`도 이 glossary 수리에는
stale history이고, 현재 통과는 위 `f5655ef`의 한 450/450 suite다. 이 기록은 production readiness를
주장하지 않는다.

이번 glossary 수리는 install·tag·push·merge·release를 하지 않았다. 최종 glossary diff의 생성
경로는 `skills/adopt/templates/glossary.md`와 `skills/arch/templates/glossary.md` 둘이고,
삭제·이동은 0이다. Phase 4 실사용 재실행은 parser와 all-nine projection이 착지한 후 같은
frozen condition을 별도 실행하는 다음 handoff다.

## 최종 후보 바이트의 실제 동작 경계

현재 후보는 다음 한 경계를 이룬다.

1. Principles 진입은 상태를 판단하지 않고 Resume 한 경로로 간다. SessionStart는 현재
   `devflow` 흔적이 없는 저장소에서 침묵하고 명시적 Product/Adopt 진입은 보존한다.
2. P2 아홉 package의 행동·판단 원본은 영문 `spec.mjs`·`body.md`이고 생성 `SKILL.md`와
   `.generated.json`은 projection/receipt다. 현재 최종 receipt의 Skill Rails runtime은
   `0.3.2`, validator는 `0.4.2`이며, 앞선 `0.3.1`/`0.4.1` 표시는 역사적 중간 trail이다.
3. Product의 canonical capability/glossary grammar를 Adopt·Arch가 정확히 투영한다.
   `capability-rows-unparsed`는 내용 있는 미인식 capability 절을 조용히 버리지 않고 막는다.
4. DD-94 경계는 미확정 evidence 동안 COMMIT만 제한하고, carry가 없으면 late-carry,
   이미 있으면 late-anchor를 한 기존 boundary commit에 싣는다.
5. DD-96의 compatible feedback은 카드 하나의 최초 완전 집합만 card-boundary payload로
   제안한다. Work는 collected `card.target`·lifecycle과 actor-computed judged pending/eligible
   summary를 비교해 partial·reordered·empty·duplicate·mixed/foreign-source 제안을 WRITE 전에
   막는다. Established lifecycle은 judged `lifecycleAction=settled`와 empty eligible만 받는다.
6. Principles의 Git-history kernel은 첫 등장 일부가 아니라 **처음으로 전체 after-state가
   canonical이고, source 하나를 공유하며, owner/card 중복이 없고, 모든 owner path가 존재하는
   순간**의 완전 집합을 seal한다. malformed·mixed-source·owner-absent·unattributable 초안은
   unsealed라 같은 자리에서 고칠 수 있다.
7. Resume은 owner-sorted sealed marker 중 하나의 writer만 Product·Design·Arch·Adopt로 보낸다.
   각 writer는 owner 문서에 source·target·Background·Why·Conclusion·implication을 먼저
   착지시키고 byte-identical marker 하나만 원자적으로 소비한다. 다른 owner는 residual marker로
   남고, Work/Verify closure는 sealed member가 모두 소비된 뒤에만 열린다.
8. 이미 소비한 정확한 member의 재도입은 `member-reopened`, 같은 카드의 다른 payload·OID·
   coordinate paraphrase는 `set-reopened`으로 크게 막힌다. current kernel에서 이 history finding은
   project-wide·permanent이며 clearable redesign은 DD-96 revisit/backlog에만 기록돼 있다.
9. Resume의 folder-boundary recovery는 code를 바꾸지 않고 deepest-first `.done` rename과 boundary
   commit 하나만 수행하며, Split은 출처 없는 confirmed-product tree work를 `maintenance routing
   pending`으로 먼저 기록해 요청 identity를 보존한다.
10. configured integration tip이 compatible-feedback lifecycle의 유일한 authority인 상태에서
    호출 worktree가 뒤처지면 상태 도구는 기존 `integrity.blocking` route와
    `compatible-feedback-integration-behind` 사유, `update-current-branch-from-integration`
    해소를 낸다. 그 worktree의 경쟁하는 committed·uncommitted compatible transition은
    integration truth에 합치지 않고 lifecycle 사실을 `invalid`로 만든다.

이 경계의 component purpose는 한 카드의 reusable conclusion을 모든 자연 semantic owner에
소실·중복 없이 착지시키는 것이다. Work가 producer/pre-write guard, Principles와 Git history가
seal, Resume이 route, Product·Design·Arch·Adopt가 semantic landing, Verify가 all-consumed closure의
consumer다. Principles 상태 도구는 integration ancestry와 local transition을 읽어 unsafe owner
action을 막는 authority boundary도 소유한다. 이 경계를 없애면 partial/foreign/reopened set,
residual-owner 소실, lagging worktree의 불가능한 owner landing·local marker 재생산, premature
Verify가 가능해진다. 설계 이유와 재개 조건의 durable owner는 DD-96이다.

## 증거 원장 — MET / FALL / UNVERIFIED

`MET`은 이름 댄 현재 바이트와 명령에서 관측된 것, `FALL`은 같은 조건의 기대를 만족하지 못한
것, `UNVERIFIED`는 실행하지 않았거나 source identity가 다른 것이다. 역사적 성공을 현재 MET로
승격하지 않는다.

| 판정 | 현재 후보에서 확인한 것 | 경계 |
|---|---|---|
| **MET** | fresh Fable final-runtime audit PASS | Tier-1/Tier-2 0, rule-conflict/loss-path 0; exact current runtime boundary의 source·purpose 판정 |
| **MET** | all-nine receipt↔byte identity | 615 entries, mismatch 0, missing 0; runtime `0.3.2`, validator `0.4.2`, 아홉 `spec_hash` 일치 |
| **MET** | Work direct predicate probe | fixture verdict를 미리 주지 않은 19 cases 전부 expected verdict와 일치 |
| **MET** | affected executable tests | decision-index 12/12, Work project-state seam 17/17, compatible-feedback state pattern 17/17, `git diff --check` clean |
| **MET** | runtime ownership/lifecycle walk | first-acceptable seal, reopen block, residual owner, one-owner landing, all-consumed closure가 현재 source와 real Git temp scenes에서 확인됨 |
| **MET** | Sol integration-behind repair execution @ `c28facc` | 새 다섯 번째 scene 1/1, linked-worktree 전체 5/5, compatible-feedback state 22/22, Work direct seam 4/4; `git diff --check` exit 0 |
| **MET** | Fable post-edit PASS @ `c28facc` | 현재 linked-worktree scene 5/5, parent `a7bec151` 다섯 번째 scene 0/1; canonical Principles→Resume 진입의 owner-action dead end·local-marker reproduction 폐쇄 |
| **FALL** | 현재 fresh runtime boundary의 release-blocking 판정 | 0건. 과거 BLOCK·stale fixture는 이 후보가 닫은 history이며 현재 FALL로 중복 계산하지 않음 |
| **UNVERIFIED** | editor-reported Skill Rails build/eval | Work 74/74×200, Principles 10/10×200은 유계 역사 증거이나 fresh auditor가 rebuild/eval을 재실행하지 않음 |
| **UNVERIFIED** | post-`c28facc` build·generation·receipt identity | 이 record-only 편집과 Fable 패스는 build·generation을 실행하지 않았고 generated·manifest byte를 바꾸지 않음 |
| **UNVERIFIED** | release push | repair commit은 `c28facc`로 존재하지만 release publication·push는 실행하지 않음 |
| **UNVERIFIED** | official-home install·installed byte match | clean committed source에서 real Claude/Codex/Orca home으로 설치하고 exact closure를 비교하지 않음 |
| **UNVERIFIED** | frozen clean baseline/candidate comparison | 과거 14 transcript는 context only; final-byte 동일 질문·rubric 비교를 실행하지 않음 |
| **UNVERIFIED** | one hand Gate B | genuine fixture의 create/list/filter/revisit와 Work→Resume→Work→Verify/closure를 현재 바이트로 실행하지 않음 |
| **MET** | final wildcard root suite / Gate A | `rtk node --test "scripts/*.test.js"`: tests/pass 498/498, fail/cancelled/skipped/todo 0, `duration_ms 3536616.9279`; Gate A는 동일 parser·read-only assertion과 60초 유한 하네스 한도에서 통과 |
| **UNVERIFIED** | integration-behind 남은 실행 경계 | I-1 uncommitted local transition, I-2 block→branch update→overlay, I-3 merge-commit lag entry, merge-resolution-only `git log -G`, full Product/Arch/Resume/Work closure는 실행하지 않음 |
| **UNVERIFIED** | R-1 direct Product/Design entry | hook의 Principles→Resume을 우회한 사용자 직접 호출은 source-literal loop residual이지만 end-to-end 실행하지 않음; canonical entry PASS로 승격하지 않음 |

이 보고서 자체는 production readiness 또는 release PASS를 선언하지 않는다.

## DD-96·seal 매트릭스 재판정

`docs/usecase-matrix_ko.md` §1·§2 축을 대조한 결과 새 H/A 요청 shape는 없다. 기존 §3.20
H4×A1·A3이 정확한 칸이다. 한 요청의 `출처-json` identity와 기존 `origin`·`siblings`·
`readFirst` 계산을 보존하면서, Work가 한 카드의 first complete boundary set을 제안하고
Principles가 first wholly acceptable after-state를 seal한다. Resume은 duplicate owner를 만들지
않고 semantic owner 하나씩 착지시키며 residual owner를 지우지 않는다. Verify는 sealed member가
전부 consumed된 뒤에만 닫힌다. §3.20 판정은 **정합**, 새 행 0, 새 공백 0이다. 이 판정은 위
current-byte evidence에 한정하며 final hand Gate B는 계속 UNVERIFIED다.

`c28facc` integration-behind 수리는 새 shape를 만들지 않고 기존 H22(한 도메인
다중 터미널), H24(사용자 관리 worktree 병행), H27×A12(통합 봉쇄 재진입)에
착지한다. 실제 linked worktree에서 integration tip이 앞서고 owner landing·local marker
재생산이 각각 통합 업데이트를 요구하는 하나의 `integrity.blocking` 경계로 수렴했다.
다만 simultaneous shared-folder write와 I-1∼I-3은 실행하지 않았으므로 이 칸들의 기존
실사용 보장으로 부풀리지 않는다.

## fresh audit disposition과 carry-forward

### R-1 — 비정본 direct Product/Design 진입 residual

integration mode의 marker는 `skills/principles/scripts/project-state.mjs:1446`에서
`landing = "pending"`을 유지한다. Product·Design collector는 이 값을 직접 읽지만 두 spec은
`state.route`를 소비하지 않는다. 따라서 lagging worktree에서 사용자가 hook의
Principles→Resume을 우회해 Product 또는 Design을 직접 호출하면 owner를 쓰고 WAIT한
뒤 다시 `pending`을 보는 loop가 source-literal로 남는다. Fable은 이 end-to-end scene을
실행하지 않았다. canonical entry는 `integrity.blocking`을 먼저 보고, 소실·중복 없이
멈추며, kernel-only 수리 경계가 있으므로 release blocker로 승격하지 않는다. 사용자가
direct owner-skill invocation을 정본 진입으로 판정하거나 실전에서 loop가 재현되면 다시 연다.

### R-2·I-1∼I-3 — 비차단 cost와 미실행 probe

R-2는 `integrity.blocking`이 Resume의 사람 ASK로 가므로 merge-commit 운용의 매 lag event가
worktree 전체의 사람 확인 비용을 낼 수 있다는 소유자 설계 cost다. 출구와 해소가
정확히 이름 붙어 있으므로 §2 결함으로 채택하지 않는다. I-1 uncommitted local
transition, I-2 blocked→update→overlay 전이, I-3 merge-commit lag entry는 코드 원문·유사
경로로만 판단했고 실행하지 않았다. 전부 UNVERIFIED이며 새 backlog 항목을
만들지 않는다.

### F-1 — 미수리 Tier-3 precision limitation

`skills/work/body.md`는 judged summary field인 `count`, `uniqueCount`, `sourceCount`,
`sourceCard`, `source`를 “mechanically collected”라고 부른다. 실제 `spec.mjs`는 pending/eligible
set을 `judged: true`로 선언하고 Work actor가 summary를 계산한다. divergent literal reader가
summary 없이 호출하면 domain exact-key 검사 L3 diagnostic에서 WRITE 전에 크게 멈춘다. 따라서
quiet loss나 wrong action은 아니고 retry 비용이다. fresh PASS 뒤 runtime 문구만 다시 고치면
동작상 우월한 root change 없이 repair-on-repair를 하나 더 만드는 셈이므로 이번 frozen boundary는
수리하지 않는다. 별도 scope에서 손댄다면 “actor-computed judged summary”와 judged
`lifecycleAction=settled`로 정확히 좁힌 뒤 유계 재감사한다.

### E-1 — 미수리 evidence-instrument limitation

mixed-source와 duplicate seam/fixture negative는 `sourceCount`/`uniqueCount`와 함께
`pendingSetStatus=invalid`도 설정하므로 두 conjunct를 단독으로 격리하지 못한다. 다만 fresh
independent 19-case direct predicate probe가 `pendingSetStatus=complete` 상태에서 두 conjunct를
각각 실행했고 모두 expected BLOCK이었다. 제품 predicate defect가 아니라 instrument weakness다.
이미 답이 난 뒤 새 harness를 늘리거나 product byte를 바꾸지 않는다.

### O-1~O-6 — blocker가 아닌 관찰

- **O-1:** 최종 receipt는 runtime `0.3.2` / validator `0.4.2`다. 이전 CHANGELOG의
  `0.3.1`/`0.4.1`은 중간 바이트의 stale trail이라 최신 항목을 최종 identity로 정정한다.
- **O-2:** `sourceCard`·`sourceCount`·`uniqueCount`는 DSL/AST 제한 때문에 actor-attested judged
  summary다. kernel은 mixed/duplicate를 unsealed correctable draft로 backstop하지만 의도적
  misattestation을 새 parser로 해결하지 않는다.
- **O-3:** canonical payload key order가 틀리면 first-acceptance 전 loud correctable stop이다.
  Work actor surface에 outer key order가 완전히 적히지 않은 comprehension tension은 남는다.
- **O-4:** sealed source OID가 rebase/prune/gc 뒤 resolve되지 않을 수 있다. 현 계약은
  `ASK:integrity`에서 old source·coordinates를 실제 owner에 착지하고 byte-identical marker를
  소비하는 사람 개입 출구를 보존한다.
- **O-5:** compatible·settled-state의 pending/eligible/lifecycleAction은 의도적으로 judged다.
  unjudged compatible input은 bare BLOCK으로 크게 멈추며 조용한 WRITE는 없다.
- **O-6:** DD-96와 final seal은 이 보고서와 matrix §3.20·§6에서 재판정했다. 새 H/A 행과 새
  공백은 0이다.

## 감리 지침 §5 정지 조항

- 이번 **report-only disposition**의 새 규칙 충돌·소실 경로는 0이다.
- `c28facc`의 수리는 integration authority 하나와 기존 blocking route 하나로 수렴한다.
  Sol의 current 5/5·22/22·4/4와 Fable의 current 5/5·parent 0/1이 수리 문장·실행
  경계를 한 번 재감사했고 신규 충돌·소실 경로는 0이다.
- 남은 제품 소견은 F-1의 판단어/표현 등급과 R-1의 비정본 direct-entry residual이다.
  E-1은 fixture/scoring instrument 약점, R-2는 owner design cost, O-1~O-6은 관찰이며
  Tier-1/Tier-2 blocker가 아니다.
- 수리를 만들지 않은 보고 전용 패스이므로 repair/convergence clause는 **판정 대상 없음**이다.
  post-PASS runtime wording repair를 억지로 열지 않았고 새 action 해석도 만들지 않았다.
- 개인 회로 차단기 네 개는 모두 미발동이다: 같은 문장의 세 번째 수리 0, 구체적 두 오독 없는
  가능성 소견 0, 진자 운동 0, 지난 review만을 근거로 한 소견 0.
- unexecuted behavior를 pass로 바꾸지 않았다. release push, official install/byte match,
  frozen comparison, one hand Gate B, R-1 end-to-end, I-1∼I-3,
  merge-resolution-only `git log -G`는 전부 UNVERIFIED다.

따라서 text loop는 여기서 멈추고 다음 검증 수단을 empirical execution으로 넘긴다.

## 경계 출력

**Actually shipped:** integration-behind 수리는 후보 이력의
`c28facc1b9707f06234a32426f9b51a695bad053`에 commit됐다. configured integration tip authority,
lagging worktree의 `integrity.blocking`, local transition의 non-union `invalid` 판정이 실제 동작
경계다. 다만 v0.20.0 release publication·push·official install은 아직 완료되지 않았다.

**New binding decisions:** 없음. DD-96의 state/reason은 움직이지 않았고 matrix만 현재 바이트에
맞춰 재판정했다.

**Unrepaired findings:** F-1 Tier-3 runtime wording precision, E-1 conjunct-isolation instrument
weakness, R-1 non-canonical Product/Design direct-entry residual. 셋 다 release blocker로
부풀리지 않으며 R-1은 source-literal이지만 end-to-end 미실행이다.

**Remaining limitations:** actor-attested judged summaries, key-order loud-stop ergonomics,
source-OID rebase/prune tension, permanent project-wide reopen finding, R-2 human ASK cost,
I-1∼I-3·merge-resolution-only gap, 그리고 위 UNVERIFIED 관문들.

**Next revalidation:** runtime 바이트를 바꾸지 않은 채 clean committed baseline/candidate의
official-home byte identity와 frozen comparison을 확인한 뒤, 같은 frozen candidate에서 hand
Gate B를 한 번 실행한다. wildcard root suite/Gate A는 위 498/498로 닫혔다.
integration-behind는 I-1 uncommitted local, I-2 update-to-overlay, I-3
merge-commit lag entry와 R-1 direct-entry를 각각 실행 증거로만 올린다. 그 뒤
commit/install 식별자를 문서에 보태야 한다면 deploy closure가 시험 바이트와 hash-identical임을
증명한다.

=== 보고 완료 ===
