# v0.23.11 결과 보고 — 현재 소유자 지식의 승인·실행 수명 보존

날짜: 2026-09-06
시작 HEAD: `b5f9c6a6c05c45bc7ffdb9bee4e9e65b5b3385a2`
범위: Principles의 공통 owner/K 묶음, Product·Design·Arch의 제한된 K 작성, Direct의 카드 K 읽기 선택, Work의 일반 카드 지식 상승

## 확정한 결함과 보존 경계

v0.23.10은 K의 응집 단위와 한 current locus를 정했지만 그 위치의 수명을 모든 실제 writer와
consumer 끝까지 연결하지 않았다. Product·Design·Arch가 소유 문서를 승인할 때 같은 단위를 가진
기존 자기 K를 배치에서 빠뜨릴 수 있었고, Direct의 카드 생성은 필요한 Layer 0 K 경로를 찾지
않았으며, Work의 기존 지식 상승은 Research 카드에서만 실행됐다. 따라서 owner 문서와 K가 서로
다른 현재 사실을 말하거나 처음 보는 Work가 필요한 깊이를 못 읽거나 일반 카드의 출처 있는 재사용
결론이 조용히 사라질 수 있었다.

이번 수리는 K 모델을 다시 설계하지 않는다. Product는 제품 문제·접근·capability composition·
경계·성공, Design은 UI source·token·component·분해·review surface, Arch는 Layer 0·stack·code
structure·capability design zone, Direct는 카드와 정확한 의존, Work는 한 카드의 구현과 결과 운송을
계속 소유한다. 의미 소유자는 governing question·독자·변경 이유로 고르며 frontend/backend 같은
고정 기술 계층을 만들지 않는다.

## 통합 변경

`core-document-ownership.md`가 기존 owner K의 유계 머리말 투영과 confirmation batch를 한 번
소유한다. 바뀌는 지식 단위가 기존 K에 있으면 그 정확한 current path를 승인·쓰기·검증·같은
commit에 포함하고, 새 단위만 기존 독립 독자/변경 이유 경계에서 K가 된다. 물리 작성 권한은 최초
무관리 전체의 Adopt, product.md와 product/K의 Product, design.md와 design/K의 Design, arch/K와
관리 capability design zone/K의 Arch로 제한된다. Direct·Work·Verify는 K를 쓰지 않으며 기존
`writer=arch|adopt` 마커는 Arch에 정확한 의미 소유자/K 묶음만 위임한다.

Product와 Design은 기존 proposal/confirmation 및 compatible-feedback 경계에서 자기 K만 투영하고
변경 current locus를 보고하며, 승인 뒤 owner 문서와 함께 validate·commit한다. capability/K는
여전히 Arch만 쓴다. Arch의 Layer 0 승인, design marker, compatible feedback, capability batch는
각각 필요한 arch/K 또는 정확한 capability/K만 같은 기존 경계에 포함한다. compatible payload의
Background·Why/evidence·Conclusion·implication·source는 owner 문서에 그대로 남아 현재 landing
증명을 보존한다.

Direct는 card-producing materialize 두 갈래에서 필요한 현재 Layer 0 소유자, target capability,
명시 crosscut 소유자의 기존 K 머리말만 투영한다. first-line use-when과 카드 Destination/target이
맞는 정확한 path만 `Read first`에 넣고, `Affected knowledge owners`는 후보를 좁히는 힌트일 뿐
유일한 gate가 아니다. 본문·다른 capability 전수 scan은 하지 않고 필요한 nested branch만 다시
투영하며 tool 불가나 budget 초과는 기존 loud/narrow 출구를 따른다.

Work는 Research checkpoint를 그대로 두었다. 일반 카드는 exact-title task commit이 통합되고
completion·required review·handoff가 current인 뒤에만, 그 committed card에 결론과 근거가 이미
있는 재사용 단위를 기존 journal marker로 올린다. 변화가 없으면 projection·질문·marker 없이
끝나고, title 뒤 생긴 무출처 결론은 emit을 거부해 기존 request/Direct 경로로 돌린다. marker
commit은 journal만 건드리며 task card·code·compatible payload나 두 번째 H1 checkpoint를 만들지
않는다.

Design을 planning-evidence의 새 소비자로 만들지 않았다. policy index의 넓은 trigger를 DD-67과
매트릭스가 이미 소유한 Product·Arch·Adopt·Direct 네 소비자로 좁혔다. 새 state field·zone·
predicate, stage, registry, index, classifier, validator, graph, fingerprint, marker family,
cross-stage transaction은 없다.

## 결정과 계보

DD-104가 DD-92 C4, DD-97의 전칭 physical-writer 표현과 DD-103의 단계 역할 불변 선언을 좁게 정정한다. DD-92의 knowledge/work
분리·semantic owner·same-stem K·named source·atomic multi-owner 이유와 DD-97의 최초 Adopt/관리
Arch routing 이유는 유지한다. DD-103 본문은 v0.23.10 당시 사실로 보존하고 상태에서 DD-104의 부분 정정만 연결했다.
매트릭스 §3.17·§3.18·§3.20·§3.21은 새 writer·read·promotion 경계를 재판정했고 §3.14의 네
planning-evidence 소비자는 그대로다.

## 변경 경로

- 배포/결정: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `CHANGELOG.md`, `scripts/project-state.test.js`,
  `docs/design-decisions.md`, `docs/design-decisions_ko.md`, `docs/usecase-matrix_ko.md`, 이 보고서.
- Principles: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`,
  `spec.mjs`, `references/policy-index.md`, `references/knowledge/{capsules-and-provenance,writers-and-migration}.md`,
  `references/state/{core-document-ownership,document-change-routing}.md`.
- Product: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`,
  `spec.mjs`, `fixtures/scenarios.json`, `templates/{product-proposal,knowledge-node}.md`.
- Design: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`,
  `spec.mjs`, `references/ownership.md`, `fixtures/scenarios.json`, `templates/{proposal,knowledge-node}.md`.
- Arch: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`,
  `spec.mjs`, `references/workflow.md`, `fixtures/scenarios.json`, `fixtures/source/arch-package.test.mjs`,
  `templates/{proposal,capability-batch}.md`.
- Direct: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`,
  `spec.mjs`, `fixtures/scenarios.json`, `fixtures/source/direct-package.test.mjs`.
- Work: `.generated.json`, `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`,
  `spec.mjs`, `fixtures/scenarios.json`.

생성·이동·삭제는 새 Product/Design knowledge-node shape 두 개, Arch approval-only capability-batch,
Direct source fixture, 이 보고서의 생성뿐이며 이동·삭제는 없다. 생성 `SKILL.md`는 source build 결과가
동일해 tracked diff가 없고 `.generated.json` 여섯 개만 receipt가 갱신됐다.

## 변경량

P2 실행 source는 `+156/-90`, 순증가 `+66`줄이다. 이 수치는 spec/body/reference/template만 세며
Skill Rails 생성 receipt, intent·obligation ledger·authoring card, fixture, 결정·매트릭스·CHANGELOG·
manifest·보고는 분리했다. 같은 규칙을 stage마다 전문 복제하지 않고 공통 owner batch, 각 실제
effect/touches, Work의 기존 marker 수명에만 연결했다.

## 표적 검증

- Skill Rails build `--repeats 25`: Principles 10/10, Product 19/19, Design 20/20, Arch 54/54,
  Direct 28/28, Work 75/75; 여섯 패키지 모두 L0–L18, mutation 20/20, mismatch 0.
- Skill Rails eval `--repeats 25`: 같은 여섯 패키지 전부 structural/behavior pass, mismatch 0.
- 직접 source fixture: Principles·Product·Arch·Direct 묶음 14/14 통과. 여기에는 기존 marker
  provenance/atomicity, 160개 Arch ledger, bounded Direct K projection이 포함된다.
- 양 언어 decision index: DD-104와 DD-92·DD-97·DD-103의 partial correction을 source 순서대로 투영.
- 표적 저장소 검사: repository invariants 20/20, decision-index 12/12, Skill Rails semantic-audit
  8/8, project-knowledge 45/45 통과. 첫 invariant 실행이 공통 선언에서 빠진 기존 “no residual
  object/route/token/batch” 절을 찾아 같은 선언 안에 복원했고 최종 재실행은 20/20이다.
- 완료 게이트 전체 suite는 수리 전 한 번 실행해 514/515였고 Gate A는 green이었다. 유일 실패는
  v0.23.9에서 추가된 Adopt의 Layer 0 K 쓰기를 옛 fixture 기대 배열이 누락한 test-only drift였으며,
  기대 배열 수리 뒤 `node --test scripts/project-state.test.js`는 내장 Gate A와 함께 385/385 통과했다.
- `git diff --check` 통과, stage 0, tracked semantic-diff receipt의 변경 0, 별도 임시 파일 0.

## 미검증과 알려진 한계

fixture 수리 뒤 `node --test "scripts/*.test.js"` 전체 suite를 한 번 실행해 515/515와 Gate A green을
확인했다. 최종 독립 재감사 소견 0건으로 규칙 충돌·소실 경로 클래스와 남은 소견이 모두 0이며,
해석을 새로 여는 수리도 없어 감사 지침 §5의 세 종료 조건을 충족했다.
Gate B와 clean entry-system 전후 비교는 verification contract와 entry system 변경이 아니어서 적용되지
않는다. 설치와 실제 Product·Design·Arch·Direct·Work 실사용은 실행하지 않았다. 자동 의미 validator나 stale detector를 추가하지 않았으므로 올바른 owner·응집도·출처
충실도는 승인 batch와 actual diff를 읽는 작성자 및 독립 감사가 계속 판단한다. title 뒤 생긴
무출처 결론은 자동 승격되지 않고 기존 Direct 경로에서 durable source를 회복해야 한다.

사용자 근거 `DEVFLOW-KNOWLEDGE-STRUCTURE-REVIEW.md`는 39,268 byte,
SHA-256 `f67c29dc0c841118ed61381bdda40420ba0f343203b5bef0d37e2fd683d0a7ea`인 untracked read-only
evidence로 보존했다. 수정·이동·삭제·stage·commit하지 않았다. 이번 결과도 commit·push·install하지
않고 전체 uncommitted diff 독립 감사에 넘긴다.
