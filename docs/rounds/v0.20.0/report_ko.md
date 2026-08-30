# v0.20.0 구현 기록 — Phase 3 최종 증거 및 정정

## 범위와 보관

이 기록은 Phase 3의 최종 증거로, 대상 브랜치 `jmp-develop/devflow-skill-rails`,
HEAD `080a8cbd031b2da9efa4051bd56197ddbaf54017`에서 작성했다. 구현 이관은 작업 트리가
아닌 staged snapshot이 보관한다. 현재 사실의 소유자는 Git과 manifests이며, 이 보고서는
그 스냅샷의 증거와 한계를 기록할 뿐 별도의 current-facts 층을 만들지 않는다.

이번 정정의 문서 쓰기 범위는 이 보고서와 `CHANGELOG.md`뿐이다. 생성·삭제·이동한
경로는 없으며, `skills/**`는 이 문서 정정의 범위 밖이고 이 작업으로 인한 `skills/**`
diff는 없다.

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
따라서 Phase 4, Gate B, install/snapshot refresh, clean Codex/Claude 비교, disposable
forward run, 실제 recursive-K 동작, handoff/resume, history-walk latency 및
session-start footprint는 모두 명시적으로 **unverified**다. 이 보고서는 production
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

앞선 Phase 3 증거와 한계는 위에 그대로 보존한다. 이번 부록은 `HEAD`
`dedf24a65c2767ff86079cb91e2719bc20a9f973`에서 수행된 Phase 4 root repair의 원인,
집중 증거, 독립 판정, 그리고 아직 실사용으로 닫히지 않은 경계를 기록한다.

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
아홉 P2 패키지(adopt·arch·design·principles·product·resume·split·verify·work)는
모두 regeneration했고, runtime `0.3.0` 및 validator `0.4.0`을 사용한다.

### 집중 실행 증거

| 항목 | 결과 |
|---|---|
| collectors/seams | 22/22 |
| K state-consumers | 17/17 |
| eval fixtures (1,800회 반복) | 258/258 |
| mutation checks | 20/20 |
| repository invariants | 19/19 |
| runtime byte mismatches | 0 |

최종 root suite는 위 `HEAD`에서 정확히 한 번 실행되어 exit 0이었다: tests 444,
suites 0, pass 444, fail/cancelled/skipped/todo 0, `duration_ms 1332167.6359`.
이 수치는 문서 변경 전 추적 modified paths 119개와 문서 변경 후의 그 기존 경로들이
동일하다는 확인과 함께 읽는다. 앞서 standalone wrapper가 604초에서 timeout 난
사건은 `unproven`으로 분류하며, 최종 full suite가 그것을 대체한다. 따라서 그 timeout은
test failure로 세지 않는다.

### Opus lead와 Sol disposition

- Opus가 이끈 판정에 대한 Sol disposition은 위 causal `targetPath`, Fixture `UNKNOWN` 대
  live `unknown()`, `guard-pending`/`L14`, 세 consumer 경계와 all-nine regeneration을
  분리해 확인하는 것으로 정리됐다.
- comma-single-line `Read first`는 지원하지 않으며 안전하게 BLOCK한다. 이는 compatibility
  defect가 아니다.
- `guard-pending`/event naming은 잘못된 action을 만들지 않는다. Fable 아래에서 이를
  accepted terminology debt로 남긴다.
- exact upstream parity는 입증됐다. DD-93이 generated mechanics를 upstream-owned로
  유지하므로 새 decision은 만들지 않는다.

### Phase 4 AFTER와 운영 경계

Phase 4 AFTER의 same-condition Codex/Claude scenarios, recursive-K use quality, latency,
session-start, handoff/resume, install, Gate B는 모두 `unverified`다. 이 기록은
production readiness를 주장하지 않는다.

이번 작업은 install·commit·merge·push·cleanup을 하지 않았다. 이 부록은 보고 기록만
갱신했으며, 위의 두 문서 밖 경로를 만들거나 삭제하거나 이동하지 않았다.
