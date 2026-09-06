# v0.23.14 구현 보고 — Arch K 착지의 commit 전 유계 검증

날짜: 2026-09-07
시작 HEAD: `8dcc32d89122c2144074145c6c3dfdc2f5e123f2`
범위: Arch의 누락된 여섯 K-writing branch, 표적·전체 검증, 독립 whole-diff 감사, 배포 거버넌스

## 확정 원인과 선택한 경계

Principles의 `references/knowledge/opening-and-freshness.md`는 capsule이 자기 commit 전에
`validate`를 통과해야 한다고 이미 고정한다. Product, Design, Adopt와 Arch의 다른 K-writing
branch는 이 계약을 실행했지만, Arch의 knowledge landing 세 갈래와 capability-design 승인 세
갈래는 K를 쓴 뒤 검증 없이 marker 삭제 또는 commit으로 진행했다. 검증이 marker 삭제 뒤에
실패하면 working-tree journal에서 routing signal이 먼저 사라지고, K 변화가 동반된 삭제는 state
tool의 unauthorized-deletion 차단에도 걸리지 않아 미검증 capsule과 함께 단계가 끝날 수 있었다.

수정은 이 누락을 가진 가장 작은 정본인 `skills/arch/spec.mjs`의 기존 effect plan에만 있다.
새 validator, shared semantic gate, Adopt식 반증, retry count, taxonomy, central INDEX, global scan,
registry, crawler, 고정 frontend/backend template을 만들지 않았다. Product, Design, Adopt, Direct,
Work, Verify, Resume, Principles runtime과 owner-map·same-stem-K 동작은 바뀌지 않았다. 결정 색인 행도
움직이지 않았다.

## 여섯 branch의 실행 흐름과 자연스러운 정지

- `knowledge-landing/recursive`: K write → exact selected knowledge/K validate → consumed-owner marker
  delete → atomic landing commit → `NEXT`.
- `knowledge-landing/partial-recursive`: K write → exact selected knowledge/K validate → selected-owner
  marker delete, residual marker 보존 → atomic partial landing commit → `NEXT`.
- `knowledge-landing/multi-mixed`: owner scope와 K write → exact selected knowledge/K validate → exactly
  consumed marker set delete → atomic multi-owner landing commit → `NEXT`.
- `capability-design/approve-design`: capability design zones와 K write → exact changed capability/K
  validate → capability-design commit → `ROUTE:design`.
- `capability-design/approve-resume`: capability design zones와 K write → exact changed capability/K
  validate → capability-design commit → `ROUTE:resume`.
- `capability-design/approve-direct`: capability design zones와 K write → exact changed capability/K
  validate → capability-design commit → `ROUTE:direct`.

세 knowledge landing에서 validate가 marker deletion보다 앞선 순서는 load-bearing이다. 검증 실패가
발생하면 다음 effect로 진행하지 않는 기존 “must pass” 계약에 따라 marker를 남기고 commit을 막아야 한다.
`compact`, `partial-compact`는 `knowledgeNodes`를 쓰지 않고 `ask`는 write·commit이 없으므로 검증을
추가하지 않았다. 같은 원인의 여섯 누락이 모두 닫혔고, K를 쓰지 않는 대조 갈래도 잠겼으므로 새
규칙이나 다른 owner로 확장하지 않는 자리가 자연스러운 정지다.

## 변경 경로 — runtime, generated, test, governance 분리

- runtime core: `skills/arch/spec.mjs` — 여섯 branch에 기존 유계 validate effect를 올바른 위치로
  연결했다. runtime semantic diff는 `+6/-6`줄이다.
- generated evidence: `skills/arch/.generated.json` — 정본 build가 갱신한 spec/content/build hash와
  반복 측정 receipt다. 생성 `skills/arch/SKILL.md`는 byte-identical이다.
- tests and fixtures: `skills/arch/fixtures/scenarios.json`은 기존 일곱 scenario의 effect 기대에 RUN을
  더했고, `skills/arch/fixtures/source/arch-package.test.mjs`는 action identity와 K write < validate <
  marker delete < commit, 그리고 K write < validate < commit < route를 직접 고정한다. no-K·ask
  대조도 포함한다.
- release governance: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `CHANGELOG.md`,
  `docs/usecase-matrix_ko.md`, 이 보고서다. marketplace source는 여전히 repository root이고 version
  필드가 없으므로 `.claude-plugin/marketplace.json`은 바꾸지 않았다.

시작 HEAD 대비 frozen runtime candidate는 정확히 네 파일 `+44/-22`줄이다. 이 보고서 119줄을
포함한 최종 authorized diff는 아홉 경로 `+189/-24`줄이다. 이 보고서만 새로 만들었고 다른 파일의
생성·삭제·이동은 없다.

## 표적 build·eval·package와 canonical gate

- Skill Rails build: `ok: true`, L-full pass, mutation 20/20, fixtures 54/54, deterministic repeats 200,
  mismatches 0, formats 2/2, isolated import true. Build id는
  `sha256:3b7afed4eb3e240acdebdf6be50a6697bae24864910cad5f3da8fc6f5488e34b`이다.
- lint: L0–L18 전부 pass.
- eval: 54/54, 200 repeats, mismatch 0. 이 결과의 release-readiness는
  `deterministic-fixtures-passed`이며 fresh-agent 의미 품질을 대신하지 않는다.
- Arch package test: 최종 build 뒤 6/6 pass. 여섯 수정 갈래의 exact action order와 no-K·ask 대조를
  함께 실행했다.
- `git diff --check`는 whitespace error 없이 통과했다.
- canonical top-level runner `node --test scripts/*.test.js skills/**/*.test.mjs`는 이 후보에 대해
  정확히 한 번 실행됐다. exit 0, tests/pass 574/574, fail/cancelled/skipped/todo 0,
  `duration_ms 1450450.7753`이며 같은 실행의 Gate A가 green이었다. release closeout은 이 runner를
  다시 실행하지 않는다.

## 독립 감사와 감사 지침 §5 종료 판정

Opus whole-diff 감사는 blocking 0, tier-1 0, tier-2 0, rule-conflict 0, patch-on-patch 0,
candidate가 만든 새 defect 0으로 판정했다. 감사가 공격한 shared gate, delete 뒤 검증, fused
design-marker와의 겉보기 비대칭, 실행 불가능한 judgment word, generated receipt hand patch,
non-writer spray, 다른 skill로의 scope creep도 모두 현재 source에서 반증됐다.

감사 지침 §5의 종료 절을 다음처럼 평가했다.

1. 이번 candidate의 규칙 충돌과 소실 경로는 0이다 — 참.
2. in-scope 채택 소견은 남지 않았다. 세 Tier-3 관찰은 모두 기존 조건이며 이 repair의 새 결함이나
   양갈래 runtime 독해가 아니다 — 참.
3. whole-diff 감사가 새 수리를 만들지 않았으므로 수렴형 수리 절은 `판정 대상 없음`이다. candidate
   자체는 누락 effect를 기존 기계 action으로 연결하며 새 해석 문장을 열지 않는다.
4. 개인 회로 차단기는 걸리지 않았다. 같은 문장의 세 번째 수정, 구체적 오독 없는 “혼동”, 이전
   수리의 반전, 지난 감사 소견만을 근거로 한 finding이 없다.

따라서 새 text-audit round를 열지 않는다. Gate B는 verification contract가 바뀌지 않아 적용
대상이 아니고, entry system도 바뀌지 않아 clean Claude/Codex before/after 비교 대상이 아니다.

## carry-forward와 미검증

- `skills/arch/fixtures/source/generate-scenarios.mjs`는 current `scenarios.json`과 어긋난 pre-existing
  latent overwrite다. 실행하면 이번 일곱 기대를 포함한 기존 기대를 되돌릴 수 있으나, 현재 build와
  evaluator는 이를 실행하지 않는다. generator 정합 또는 삭제 결정은 별도 범위로 carry-forward하며
  이번 release에서 실행·수정하지 않았다.
- adjacent pre-existing ordering coverage gap과 삭제된 vacuous assertion은 runtime 결함이 아니며 이번
  범위를 넓히지 않는다.
- 여섯 갈래의 fresh real use는 `unverified`다.
- 일부러 malformed K를 써서 실제 `validate`가 실패했을 때 marker가 남고 marker deletion·commit·route가
  실행되지 않는지는 `unverified`다. 선언 순서와 대조 fixture의 pass를 이 실제 실패 장면의 pass로
  바꾸어 말하지 않는다.

## 배포 경계와 보호 자료

두 plugin manifest의 정본 version은 `0.23.14`로 맞췄고, CHANGELOG와 매트릭스 §3.18을 갱신했다.
main의 한 cohesive release commit을 push한 뒤 repository official command인 Windows Codex installer와
`claude plugin install devflow@nanomia`로 양측을 갱신한다. commit·push·install 뒤의 exact hash와 설치
version은 repository 밖 `TRUST-RELEASE-SOL.md`가 소유한다.

사용자 근거 `DEVFLOW-KNOWLEDGE-STRUCTURE-REVIEW.md`는 39,268 byte, SHA-256
`f67c29dc0c841118ed61381bdda40420ba0f343203b5bef0d37e2fd683d0a7ea`인 protected untracked evidence다.
내용을 열거나 수정·이동·삭제·stage·commit하지 않는다. sample project도 건드리지 않는다.
