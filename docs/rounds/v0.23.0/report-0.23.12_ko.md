# v0.23.12 구현 보고 — 제안 입력의 현재 K 깊이 발견

날짜: 2026-09-06
시작 HEAD: `d1d6144ff9562e5eef8b0e56bd9d6fc714c90f7b`
범위: Principles의 독자 계약, Arch의 Product 입력, Design의 Product·Architecture 입력

## 확정 원인과 경계

소유 문서는 항상 읽는 지도이고 독립적으로 읽고 바뀌는 현재 깊이는 같은 stem K에 둘 수 있다.
그런데 Arch의 `read-inputs`는 Product 본문만 읽고 Product/K 머리말을 투영하지 않았으며, Design의
제안·확인도 Product와 Architecture 본문은 입력으로 가지면서 자기 design/K만 투영했다. 따라서
입력 K에 현재 제약이 있는 정상 프로젝트에서 cold AI가 그 제약과 모순되는 선택을 제안할 수 있었다.

이번 수정은 작성자 모델을 바꾸지 않는다. 다른 소유자 지도를 사용자가 확인할 제안의 입력으로 쓰는
독자는 그 입력 소유자의 K 머리말을 먼저 유계 투영하고, 첫 줄 use-when이 현재 판단에 맞는 깊이만
연다는 reader-side 계약을 공유 capsule 정본에 한 번 둔다. DD-105는 이 시점 간선을 기록하며 DD-92의
동적 projection·중앙 index 부재와 DD-104의 물리 작성자·확인 묶음을 그대로 보존한다.

## 구현한 실행 간선

- Arch `read-inputs.needed`: Product READ → exact Product owner의 product/K 머리말 RUN → glossary,
  architecture, code-style, journal, decisions, workflow READ → NEXT. `productKnowledge`는
  `.devflow/project/product`를 가리키는 `external.product` artifact이며 이 단계만 읽는다.
- Design `proposal.needs-choice`와 `confirmation.ask`: exact Product·Architecture 입력 소유자 아래의
  product/K·arch/K 머리말을 각각 투영하는 RUN → 기존 design/K RUN → REPORT → ASK.
  `productKnowledge`와 `archKnowledge`는 두 단계만 읽는 외부 writer artifact다.
- Product/Architecture/Design의 판단 목적과 K 작성 권한은 변하지 않았다. Design commit은 계속
  design/K만 쓰고 Arch approval은 계속 arch/K만 쓴다.

K가 0인 기존 소유자는 빈 결과로 정상 진행한다. owner 전체 scan, K 본문 선개봉, placeholder, hook
주입, 영속 index, 새 state·predicate·classifier·registry·stage·validator는 만들지 않았다.

## 변경 경로

- 배포·결정·증거: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `CHANGELOG.md`,
  `docs/design-decisions.md`, `docs/design-decisions_ko.md`, `docs/usecase-matrix_ko.md`, 이 보고서.
- Principles: `authoring-card.md`, `references/knowledge/capsules-and-provenance.md`, 생성 receipt.
- Arch: `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`, `spec.mjs`,
  `fixtures/scenarios.json`, `fixtures/source/arch-package.test.mjs`, 생성 receipt.
- Design: `.skill-rails/{intent,obligation-ledger}.json`, `authoring-card.md`, `body.md`, `spec.mjs`,
  `fixtures/scenarios.json`, 새 `fixtures/source/design-package.test.mjs`, 생성 receipt.
- 완료 gate: `AGENTS.md`, `docs/maintenance-protocol_ko.md`와 영어 쌍,
  `scripts/repository-invariants.test.js`.
- test 정합: Direct `collectors/project-research-contract.test.mjs`, Resume
  `collectors/project-state-seam.test.mjs`, Verify `collectors/fixtures.test.mjs`와 세 생성 receipt.

생성 `SKILL.md`는 직접 수정하지 않으며 Skill Rails build 결과만 받는다. Adopt, Product, Work, hook,
`project-state`, `project-knowledge`, template과 Direct·Resume·Verify의 runtime source는 수정하지 않는다.

## 검증과 현재 상태

Skill Rails build·lint·25회 eval은 Principles 10/10, Arch 54/54, Design 20/20으로 모두 L0–L18,
mutation 20/20, mismatch 0을 통과했다. Arch·Design package source fixture 7/7과
`project-knowledge.test.js` 45/45가 통과했고, 양 언어 decision index도 DD-105를 같은 현행 행으로
투영했다. package-test inventory는 dedf24a에서 13/13이었지만 v0.23.11의 Direct fixture 뒤 clean
d1d6144는 tracked/expected 14/13이었다. 현재 `git ls-files --cached --others --exclude-standard`
범위는 cached 14와 non-ignored untracked Design fixture를 합쳐 stage 0과 commit 뒤 모두 15/15이며,
불변식은 이 inventory와 두 semantic audit만 소유한다. root와 P2 package test는 같은 runner의 1급
입력으로 실행되며, 그동안 중첩 runner가 가렸던 Direct regex 오타, 제거된 Verify collector 단정,
Resume fixture 입력 누락을 현재 runtime에 맞췄다. 세 파일의 직접 실행은 15/15, repository invariant는
20/20을 통과했고 Direct·Resume·Verify build는 모두 L0–L18, mutation 20/20, mismatch 0이었다. Design의
reader 문장은 writer ownership 문단에서 `stage: confirmation` Judgment로 순증 없이 옮겼고 ledger
target과 정식 build receipt를 같은 anchor로 갱신했다. canonical
`node --test "scripts/*.test.js" "skills/**/*.test.mjs"`는 한 번 실행해 574/574, fail 0,
1,330,528.9939 ms로 통과했고 같은 실행 안의 Gate A도 green이었다.

authored runtime source의 물리 delta는 `+12/-5`줄이고, 추가 중 한 줄인 문단 구분을 제외한 의미
delta는 `+11/-5`줄(순증가 6줄)이다. intent·ledger·fixture·receipt·결정·릴리스 기록은 별도 유지보수
증거다. 이번 gate/test 수렴 hunk는 직전 후보 대비 `+8/-10`줄(순감소 2줄)이며 runtime semantic
source 변화는 `0/0`이다. `git diff --check`, 여섯 package의 최종 build receipt coherence, 사용자 증거 byte/hash와 stage 0을
확인했다. 설치와 사용자의 fresh 실제 프로젝트 실사용은 아직 미검증이다. verification contract
변경이 아니므로 Gate B는 적용 대상이 아니고,
entry system 변경이 아니므로 clean Claude/Codex before/after 비교도 적용 대상이 아니다.

감사 지침 §5의 규칙 충돌·소실 경로, 잔여 finding 등급, 수리 수렴성을 final whole-diff audit와
수리 자리만의 유계 재감사에서 평가했다. 세 종료 절이 모두 참이고 blocking·tier 1·rule-conflict·
patch-on-patch finding과 새 결함이 모두 0이므로 텍스트 감사를 멈춘다. 다음 검증 수단은 사용자의 실전이다.

## 독립 whole-diff 감사 brief

재감사자는 package-test discovery가 cached와 non-ignored others를 한 Git 호출로 모아 정렬하고,
stage 0과 commit 뒤 모두 같은 15개를 단정하는지, completion command가 그 test들을 root test와
나란히 한 runner의 1급 입력으로 실행하는지 확인한다. Design의 input-owner K 문장은
`stage: confirmation` Judgment에만 있고 `why: ownership`은 writer 경계만 소유하며, ledger의
`state-dependent-behaviors-002` body target과 build receipt가 그 이동을 그대로 반영해야 한다.

감사자는 Product map에는 offline 지원 방향만 있고 product/K에는 현재 7-day 재검증 제약이 있는
장면을 기준으로, cold Arch가 Product READ 뒤 정확한 product/K header projection을 거쳐 관련 K만
열 수 있는지 확인한다. Design은 proposal과 confirmation 각각에서 Product/K와 arch/K를 각 owner
경계 안에서 다시 발견한 뒤 기존 design/K와 REPORT로 이어져야 한다. K=0, missing optional K folder,
무관한 sibling/nested owner는 정상·유계여야 하며 입력 artifact는 외부 writer로 남아야 한다.

반대로 Arch의 arch/K·capability/K 작성, Design의 design/K 작성, 초기 Adopt/Product 승인과 zero-K,
Direct의 카드 Read first, Work의 지식 상승, Verify/Resume, hook의 state-free 진입, 중앙 index 부재는
바이트와 동작이 유지되어야 한다. 산문만 있고 RUN이 없거나 RUN만 있고 현재 Decision의 artifact read
surface가 없으면 차단 finding이다. 새 global scan·registry·predicate·write 권한 또는 입력 K를
proposal 전에 열지 못하는 effect 순서도 차단 finding이다.

사용자 증거 `DEVFLOW-KNOWLEDGE-STRUCTURE-REVIEW.md`는 39,268 byte, SHA-256
`f67c29dc0c841118ed61381bdda40420ba0f343203b5bef0d37e2fd683d0a7ea`인 untracked read-only
자료로 보존한다. 이 후보는 commit·push·install하지 않고 whole-diff 감사로 넘긴다.
