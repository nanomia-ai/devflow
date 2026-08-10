# Maintaining devflow — read this before changing anything

**Stop.** This repository is not code — it is prompt text that AI sessions execute
literally. A vague word, a conflicting concept, or an unbounded reading rule here becomes
a defect in every project that uses devflow. The bar for changes is therefore higher than
it looks.

The gate, in order:

1. Read `docs/design.md` — the decisions table and the rejection lineage. To overturn a
   decision, refute its recorded reason first. To re-propose a rejected idea, refute its
   recorded rejection reason first. Proposals that skip this do not pass review.
2. Read this file to the end.
3. After any modification, add an entry at the **top** of `CHANGELOG.md` (newest first:
   date / what / why / which files). **A change without a changelog entry is an
   unfinished change.**

## The dual-language workflow

**Design in Korean, deploy in English.** Korean is the language the project owner reviews;
English is what AI consumes best at the lowest token cost.

```
Canonical relation:  *_ko.md = design original (owner review)  →  translate  →  English = deploy artifact (AI consumption)
Pairs:               skills/<name>/SKILL_ko.md ↔ SKILL.md
                     skills/work/reviewer_ko.md ↔ reviewer.md (role contract)
                     skills/verify/verifier_ko.md ↔ verifier.md (role contract)
                     skills/verify/auditor_ko.md ↔ auditor.md (role contract)
                     skills/verify/retrospector_ko.md ↔ retrospector.md (role contract)
                     codex/AGENTS-devflow_ko.md ↔ AGENTS-devflow.md
                     README_ko.md ↔ README.md
                     docs/design_ko.md ↔ docs/design.md
English-only (no pair): AGENTS.md (this file), CHANGELOG.md,
                     CLAUDE.md (a one-line import pointer to this file — never expand it)
```

The role contracts (`reviewer.md` · `verifier.md` · `auditor.md` · `retrospector.md`) are companion files beside their
skills — briefing documents delivered verbatim to a clean context on every platform,
not registered agents. The Codex installers embed every non-`_ko` companion `.md` of a
skill folder into that skill's generated prompt.

Modification procedure (order is fixed):

1. Edit the `_ko` file first → owner review.
2. Apply the translation to the English file. **No meaning drift** — the terminology
   table at the bottom of this file is mandatory; no alternative translations.
3. Structure parity check: heading count, numbered-list count, table rows, diagram
   count, and meaning-bearing figures (counts, percentages, version numbers — not
   numerals a language happens to spell out as words) must match 1:1 between Korean and
   English.
4. Regenerate the Codex prompts (see Releasing below) + add the CHANGELOG entry.

Exception for external contributors: PRs may edit the English deploy files directly; a
maintainer back-syncs the `_ko` originals before the next release. This is the authorized
exception to _ko-first.

**Where Korean lives**: the `_ko.md` design originals (including `README_ko.md` and
`docs/design_ko.md`) and the Korean column of the terminology table below — nowhere else.
Deploy artifacts must contain no Korean: `skills/*/SKILL.md`, the role contracts
(`skills/work/reviewer.md`, `skills/verify/verifier.md`, `skills/verify/auditor.md`,
`skills/verify/retrospector.md`),
`codex/AGENTS-devflow.md`, `codex/install.ps1`, `codex/install.sh`, `scripts/*.js`,
`.claude-plugin/*.json`, `docs/design.md`, `CHANGELOG.md`, and `README.md`.
Check: count `[가-힣]` matches per file with ripgrep run directly (`rg -c`) or a Perl
Unicode scan — proxied grep rewrites have produced false positives on this repository.
The result must be **0 for every file except `README.md`, which returns exactly 1** —
its single language-switcher link `[한국어]`, which is intentional and must stay. This file (AGENTS.md) is exempt from the check: its
terminology table IS the Korean↔English reference data.

## The verification protocol

Skill text is executed by literal-minded AI, so the standard verification method is
simulation against a literal reader, run adversarially:

1. **Design → independent refutation → apply → post-audit → re-audit of the fixes.**
   Wording and design changes are confirmed by attacking them with independent passes: a
   dedicated refuter, and a literal-execution simulator that walks the text as a naive
   AI would. How to run one: start a fresh session or subagent that carries **no
   implementation context**, give it only the changed files, and instruct it to refute
   the change or walk it literally. Differentiate the lenses across passes (refuter ·
   literal-execution simulator · capable-reader flow walk · over-harness auditor) —
   identical lenses re-walk the same paths (item 6) — and always state that **zero
   findings is a valid result**: an agent told to find defects will otherwise
   manufacture them. This pattern found real defects every round it ran —
   internal per-round finding counts converged 13→13→12→13→2 over successive campaigns
   (not every round is itemized in the CHANGELOG), so skipping it is not a shortcut, it
   is a defect generator.
2. **Proportionality.** Typo or formatting fix — a literal re-read of the touched
   section suffices. Wording or rule changes — at least one independent refutation pass.
   Structural or multi-file changes — the full protocol including the re-audit and the
   coordinate sweep (item 6).
3. **Report first; apply after approval.** The owner works in a "report only" → review →
   "proceed" rhythm. Clear-cut defects (literal rule conflicts, violations of a rule the
   text itself declares) may be fixed directly — but always list them separately from
   judgment calls, which require approval.
4. **Your fixes are changes too.** After applying, run a re-audit pass over the
   modifications themselves.
5. Watch for the classic defect classes: ambiguous judgment words ("related", "relevant",
   "as needed"), one concept with two names, two concepts with one name, and unbounded
   reading rules — all four have shipped real defects before; the rejection lineage in
   `docs/design.md` records them. Watch the reverse class too: a sentence whose deletion
   breaks nothing (method prescription, duplication of the canonical rules). Demand a
   concrete failure path for every sentence a change adds — adversarial review only ever
   pushes toward more text, so harness without a failure path is a defect as well.
   Also watch for a sanctioned exception declared outside the canon: exceptions to a
   canonical rule are declared inside `skills/principles/` itself (subordinate documents
   may reference it) — a subordinate-only declaration loses to the canon on conflict
   and goes dead.
6. **Walks find paths; coordinate sweeps find coverage.** Narrative simulations only
   find defects on the paths they walk — convergence across rounds proves the walked
   paths are clean, not that the space is exhausted (the research-card gaps of v0.9.3
   survived every earlier campaign this way). After structural changes, run a
   coordinate sweep: enumerate the axes of what changed (e.g. card kinds × gates) and
   judge every cell — defined / not-applicable / self-evident / gap. Fresh-angle
   reviews, including external ones, are how unwalked paths get found: adjudicate their
   claims against the actual text, never accept or dismiss them wholesale.
7. **Read finding counts honestly.** Text written this round yields double-digit
   findings on its first adversarial pass — that is the pattern working, not the system
   regressing. Only findings against previously-verified text count as escaped defects.

External contributors: demonstrate the equivalent in your PR description — what you tried
to break, and what a literal reader does at each step you touched.

## Releasing

- The canonical version is `.claude-plugin/plugin.json`. Bump it whenever any deploy
  artifact changes behavior (skills, agents, hook, installers); docs-only changes need no
  bump. Version bump and CHANGELOG entry travel in the same change.
- The Codex install is build output generated **outside the repository** by
  `codex/install.ps1` / `install.sh`: a native plugin snapshot (marketplace add +
  plugin add — skills model-invocable, frontmatter intact), the `~/.codex/prompts/`
  slash prompts, and the SessionStart hook (registered separately — plugin-delivered
  hooks are removed in Codex). After any skill edit, rerun the installer on your
  machine if you use Codex — reviewers cannot see the result in a PR, so state in the
  PR whether you ran it. The installers also purge prompts under the pre-0.9.0 name
  `nano-devflow-*`.
- `codex/install.ps1` must keep its UTF-8 **BOM** — PowerShell 5.1 parses BOM-less files
  as ANSI and corrupts non-ASCII text (reproduced in practice).
- Reinstall to verify on both platforms: Claude (`claude plugin install
  devflow@nanomia`, or `/plugin` in-session) and Codex (`codex/install.ps1` or
  `install.sh`).

## Pre-flight checklist

- [ ] `docs/design.md` decisions/rejections read; nothing overturned without refuting its reason
- [ ] `_ko` edited first (or back-sync noted for an English-first external PR)
- [ ] Terminology table applied; structure parity ko↔en checked (headings / lists / tables / figures)
- [ ] Korean check passed: 0 matches in every deploy artifact, exactly 1 in README.md (the switcher link)
- [ ] Verification run at the proportional level; findings listed (defects vs judgment calls separated)
- [ ] Codex install rerun locally — plugin snapshot + prompts (or the PR states it was not)
- [ ] Install channels still target each platform's **current** native mechanism
      (skills · plugins · hooks) — re-verify against platform docs when platforms update
- [ ] CHANGELOG entry added at the top (+ version bump if a deploy artifact changed)

## Terminology table (fixed — no alternative translations)

| Korean | English | | Korean | English |
|---|---|---|---|---|
| 규칙 정본 | canonical rules | | 능력 | capability |
| 작업 카드 | task card | | 골조 | foundation |
| 목적지 | Destination | | 왜 | Why |
| 금지 | Forbidden | | 완료 신호 | completion signal |
| 의존 | Depends | | 읽을 것 | Read first |
| 등급 T-상/중/하 | Tier T-high/T-mid/T-low | | 좌표 | Coordinates |
| 정체성 | Identity | | 검증 창구 | verify channel |
| 조사 카드 | research card | | 실행 제안 | execution proposal |
| 정합성 점검 | integrity check | | 문서 계층 | document hierarchy |
| 실패 사다리 | failure ladder | | 진행 로그 | progress log |
| 승격 | promotion | | 사고량 | reasoning effort |
| 지향 | Values | | 이 프로젝트의 선택 | Project choices |
| 신뢰 경계 | Trust boundary | | 하지 않는 것 | Non-goals |
| 미검증 | unverified | | 통과/실패 | pass/fail |
| 잠정값 | Provisional | | 증거 대기 | evidence-wait |
| 경계 정리 커밋 | boundary commit | | 환류 | upper-document feedback |
| 신선도 | freshness | | (journal) 정리 | sweep |
| 은퇴 | retired | | 성공 판정 | success criteria |
| 다중 모드 | multi mode | | 솔로 모드 | solo mode |
| 방 | room | | 점유 | claim |
| 해제 | release | | 소화 | digest |
| 마커 | marker | | 구속 결정 | binding decision |
| 통합 브랜치 | integration branch | | 무주 점유 | ownerless claim |
| 배정 | assignment | | 전환 미완 | incomplete transition |
| 무기명 | bare | | 발견→갱신 표 | discovery→update table |
| 도입 | adoption | | 브라운필드 | brownfield |
| 미발급 | unminted | | 해소 카드 | settling card |
| 고착 탈출 | stuck-escape | | 원인 가설 | cause hypothesis |
| 감리 | audit | | 소견 | finding |
| 회고 | retrospective | | 긴장 증거 | strain evidence |

Note: as the field name inside `arch.md` the verify channel is written `verify_channel` —
the underscore form is the field identifier; the spaced form is prose. They are one
concept, not two. Likewise `Settled by` is the arch.md column-header form of the
settling card (해소 카드) — header and prose name one concept.
