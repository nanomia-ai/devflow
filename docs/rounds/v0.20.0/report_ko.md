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
