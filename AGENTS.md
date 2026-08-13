# Maintaining devflow — read this before changing anything

**Stop.** This repository is not code — it is prompt text that AI sessions execute
literally. A vague word, a conflicting concept, or an unbounded reading rule here becomes
a defect in every project that uses devflow. The bar for changes is therefore higher than
it looks.

The gate, in order:

1. Read `docs/design.md` — identity, the invariants, and the decision index. Read the
   index in full, then state that this change moves none of its rows. If even one moves,
   open that subject's section in `docs/design-decisions.md`. To overturn a decision,
   refute its recorded reason first. To re-propose a rejected idea, refute its recorded
   rejection reason first. Proposals that skip this do not pass review.
2. Read this file to the end, and open whatever the wiring table below sends you to.
3. After any modification, add an entry at the **top** of `CHANGELOG.md` (newest first:
   date / what / why / which files). **A change without a changelog entry is an
   unfinished change.** An entry says what changed and why, and stops there: a release
   entry runs to about 60 lines, a docs entry to about 25. Process knowledge that does not
   fit — verification records, finding adjudications, measurements — belongs in the round's
   `report_ko.md`, not here. A change that ran independent audit passes opens a round folder
   even when it takes no version, so that detail has somewhere to go; entries reached 136
   lines because it did not. Entries from before 0.10.0 live in
   `docs/changelog-archive.md`, moved there unchanged.

## What opens what — the wiring

Two standing instruments hold knowledge this repository would otherwise re-explain to
every agent: `docs/audit-guideline_ko.md` (how to verify) and `docs/usecase-matrix_ko.md`
(which shapes of use exist). A session changing this repository opens them **itself** — the
owner does not brief them in. No trigger below asks "is this a big change": that is a
judgment word and the answer drifts. Each one keys on a path, an output, a file
operation, or a decision named in an enumerated list you have already read in full — the
last of those is still a judgment, but a bounded one made against 64 written claims
rather than against a sense of size.

| When this is true | Open this |
|---|---|
| always | `docs/design.md` — identity, invariants, decision index |
| the index moves a row | that subject's section in `docs/design-decisions.md` |
| the change touches `skills/**` | `docs/usecase-matrix_ko.md` §1–§2 axis tables, then any §3 section for the cells it lands in. A cell with no §3 section is either carried at 정합 by the list at the head of §3 or has never been judged — if it is neither, that is the new-row case below |
| you are about to report a verification result, zero findings included | `docs/audit-guideline_ko.md` §2 adoption criteria, §5 stop condition, §6 report format |
| you are about to run an independent pass in a separate context | `docs/audit-guideline_ko.md` §8 briefing template — hand it over verbatim |
| the change creates, deletes, or moves a file **that is not this round's own report** | `docs/design-backlog.md`, and run the coordinate sweep guideline §3-4 defines |
| you are about to bump the version | `docs/audit-guideline_ko.md` in full, and re-judge the matrix cells by **the matrix's own §6** |
| you are opening a round folder under `docs/rounds/` | the previous round's `report_ko.md`, plus the findings in its `audit_ko.md` that never landed |
| an adopted finding fits no row of guideline §2 | propose a new row there |
| the change introduces a new entry point or request shape | propose a new row in matrix §1–§2 |

Both instruments are Korean-only; their readers are the owner and audit sessions. External
contributors are not held to any row that opens one of those two files — the PR
requirement at the end of the round protocol below ("demonstrate the equivalent in your
PR description") stands in their place.

## The dual-language workflow

**Design in Korean, deploy in English.** Korean is the language the project owner reviews;
English is what AI consumes best at the lowest token cost.

```
Canonical relation:  *_ko.md = design original (owner review)  →  translate  →  English = deploy artifact (AI consumption)
Pairs:               skills/<name>/SKILL_ko.md ↔ SKILL.md
                     skills/principles/state-predicates_ko.md ↔ state-predicates.md
                     skills/principles/verification-predicates_ko.md ↔ verification-predicates.md
                     skills/principles/baseline-predicates_ko.md ↔ baseline-predicates.md
                     skills/work/reviewer_ko.md ↔ reviewer.md (role contract)
                     skills/verify/verifier_ko.md ↔ verifier.md (role contract)
                     skills/verify/auditor_ko.md ↔ auditor.md (role contract)
                     skills/verify/retrospector_ko.md ↔ retrospector.md (role contract)
                     codex/AGENTS-devflow_ko.md ↔ AGENTS-devflow.md
                     README_ko.md ↔ README.md
                     docs/design_ko.md ↔ docs/design.md
                     docs/design-decisions_ko.md ↔ docs/design-decisions.md
                     docs/design-backlog_ko.md ↔ docs/design-backlog.md
                     docs/rounds/v0.10.0/proposal_ko.md ↔ docs/rounds/v0.10.0/proposal.md
                     docs/rounds/v0.11.0/report_ko.md ↔ docs/rounds/v0.11.0/report.md
                     docs/rounds/v0.9.21/report_ko.md ↔ docs/rounds/v0.9.21/report.md
English-only (no pair): AGENTS.md (this file), CHANGELOG.md,
                     CLAUDE.md (a one-line import pointer to this file — never expand it)
```

The role contracts (`reviewer.md` · `verifier.md` · `auditor.md` · `retrospector.md`) are companion files beside their
skills — briefing documents delivered verbatim to a clean context on every platform,
not registered agents. The Codex installers embed each role contract into its skill's
generated prompt. `state-predicates.md`, `verification-predicates.md`, and
`baseline-predicates.md` are canonical companions, not role contracts. The installers embed
task-card predicates into split, work, verify, and resume, and verification predicates into
verify and resume only. The installers embed baseline predicates into arch, adopt, verify,
and resume. work and the role contracts carry only their bounded baseline projections.

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
Deploy artifacts must contain no Korean: every non-`_ko` `skills/**/*.md` (entry skills,
predicate companions, and role contracts),
`codex/AGENTS-devflow.md`, `codex/install.ps1`, `codex/install.sh`, `scripts/*.js`,
`.claude-plugin/*.json`, `.codex-plugin/plugin.json`, `hooks/hooks.json`, `CLAUDE.md`,
`docs/design.md`, `docs/design-decisions.md`,
`docs/design-backlog.md`, `docs/rounds/v0.10.0/proposal.md`,
`docs/rounds/v0.11.0/report.md`, `docs/rounds/v0.9.21/report.md`,
`CHANGELOG.md`, and `README.md`.
The two standing instruments (`docs/audit-guideline_ko.md`, `docs/usecase-matrix_ko.md`)
and the round records under `docs/rounds/` that carry no `_ko` pair are **Korean-only by
decision**: their readers are the owner and audit sessions, so a translation would double
the maintenance for no reader. They are not deploy artifacts and the check does not cover
them.
Check: `node --test "scripts/*.test.js"` owns this — one test counts lines containing
`[가-힣]` in every deploy artifact and requires **0 everywhere except `README.md`, which
must return exactly 1**: its language-switcher link `[한국어]`, which is intentional and
must stay. This file (AGENTS.md) is exempt: its terminology table IS the Korean↔English
reference data. To see *which* lines when the test goes red, run ripgrep directly (`rg -c`)
or a Perl/Python Unicode scan — proxied grep rewrites have produced false positives here.

## The verification protocol

Skill text is executed by literal-minded AI, so verification is simulation against a
literal reader, run adversarially. **The method itself — which findings count, which
lenses exist, when to stop, how to report — is defined once in
`docs/audit-guideline_ko.md` and nowhere else.** What follows is only this repository's
procedure around it:

1. **Design → independent refutation → apply → post-audit → re-audit of the fixes.**
   Wording and design changes are confirmed by attacking them with independent passes: a
   dedicated refuter, and a literal-execution simulator that walks the text as a naive
   AI would. How to run one: start a fresh session or subagent that carries **no
   implementation context**, give it only the changed files, and instruct it to refute
   the change or walk it literally — the briefing template in guideline §8 is what you
   hand it. Differentiate the lens across passes; the lenses are enumerated in guideline
   §3-3 and nowhere else, because an identical lens re-walks the paths it already walked.
   Always state that **zero findings is a valid result**: an agent told to find defects
   will otherwise
   manufacture them. This pattern found real defects every round it ran —
   internal per-round finding counts converged 13→13→12→13→2 over successive campaigns
   (not every round is itemized in the CHANGELOG), so skipping it is not a shortcut, it
   is a defect generator.
2. **Proportionality.** Typo or formatting fix — a literal re-read of the touched
   section suffices. Wording or rule changes — at least one independent refutation pass.
   Structural or multi-file changes — the full protocol including the re-audit and the
   coordinate sweep that guideline §3-4 defines.
3. **Report first; apply after approval.** The owner works in a "report only" → review →
   "proceed" rhythm. Clear-cut defects (literal rule conflicts, violations of a rule the
   text itself declares) may be fixed directly — but always list them separately from
   judgment calls, which require approval.
4. **Your fixes are changes too.** After applying, run a re-audit pass over the
   modifications themselves.
5. **Severity first; method by reference.** Rank findings by what breaks: silent data
   loss ≫ structure splitting ≫ wrong action ≫ a stop with no exit ≫ cost. A noisy
   failure ranks one step below a quiet one. Which findings count as findings, which
   lenses to run, how a walk differs from a coordinate sweep, and when to stop are
   defined in `docs/audit-guideline_ko.md`. **Do not restate them here.** The restatement
   drifted once already: this file listed six defect classes while the guideline listed
   ten, and the four it was missing included silent-loss paths — the class the guideline
   ranks highest.
6. **A pass reports under the guideline's criteria.** Before reporting a result — zero
   findings included — the pass has read guideline §2 (what counts), §5 (when to stop)
   and §6 (report format). Its report states which of §5's clauses it evaluated and what
   each came out as; a report-only pass produces no repairs, so it says so for the clause
   that judges them rather than leaving that clause silent.

One exception stays here because it governs where rules may live rather than how to hunt
them: a sanctioned exception to a canonical rule is declared inside `skills/principles/`
itself (subordinate documents may reference it). A subordinate-only declaration loses to
the canon on conflict and goes dead.

## The round protocol

A change large enough to take its own version is a round, and a round leaves its records in
`docs/rounds/<version>/`. Filenames are roles: `handoff_ko.md` (optional — what a session
must know before it can design), `plan_ko.md`, `report_ko.md`, `audit_ko.md`. A round that
produced two plans keeps the superseded one as `plan-r1_ko.md`; an audit of a plan rather
than of an implementation is `plan-audit_ko.md`. Folders created before 2026-08-13 predate
this convention and may hold fewer roles or an older name — `v0.10.0/proposal_ko.md` is one.

**Which folder is the previous round.** Not the last line of a directory listing: string
order puts `v0.9.21` after `v0.14.0`. Compare version numbers segment by segment as
integers and take the highest below the one being opened. A version that shipped without
its own folder — a repair release that landed inside the preceding round's records, as
0.14.1 did inside `v0.14.0/` — is not a round for this purpose; its records are in the
folder that carries them.

**A plan says four things.** Prose that specifies only the change lets a literal reader
implement the letter and miss the point. These four are what stop that:

1. **Why** — what was observed that made this round necessary: the measurement, the field
   report, the owner decision. Not "it would be better".
2. **What, exactly** — the change at the level of files and sentences.
3. **What it is meant to achieve** — the failure path it closes, or the property it buys.
4. **The result expected** — what must be observable once it lands for this to have
   worked. This is the sentence an implementer checks its own interpretation against.

**A review or a report says four things per finding**, and this applies to every review
document, not only to audits: what (quoted from the source, with the location as precisely
as it can be confirmed), **why it comes out that way**
(the causal mechanism, which is not the same as why it is dangerous), **the result
predicted** (a concrete scene), and the scope boundary (the condition intersection it
needs, and where it does not reach). The finding format itself is fixed in
`docs/audit-guideline_ko.md` §6; these four are what that format is for.

**Promotion — what rises out of a round into the canon.** A round decides its own content.
It does not decide what the canon keeps. This table does:

| Round artifact | What rises | Where it lands |
|---|---|---|
| plan | overturns with their refutation, new decisions, rejections held | `docs/design-decisions.md` |
| report | judgments made outside the plan, rules a measurement overturned, "do not touch" items | `docs/design-decisions.md`; invariants in `docs/design.md` |
| audit | impossibility verdicts, design tensions, findings adopted but not repaired | `docs/design-backlog.md`; invariants in `docs/design.md` |
| any | a shape of use that did not exist before | a row in `docs/usecase-matrix_ko.md` |
| any | a defect class that fits no row of guideline §2 | a row in `docs/audit-guideline_ko.md` §2 |
| any | a canonical term the terminology table does not carry | a row in that table, in the same change that coins it |
| any | a document this set did not have before | a row in the document map in `docs/design.md` |

The audit row is the one that was missing. Until 2026-08-13 the two largest documents in
this repository — 3,314 lines of independent validation — had no path into the canon at
all, and a verification round had to record that the lineage and observations it produced
never landed.

**A round does not close until its own promotion is done.** The wiring table sends the
next round to the previous round's unlanded audit findings, but that rescue reaches back
exactly one round: miss twice and a finding sits on disk that no rule ever opens again.
So promotion is a closing condition of the round that produced the finding, not a debt the
next one inherits. Its checklist item is below.

External contributors: demonstrate the equivalent in your PR description — what you tried
to break, and what a literal reader does at each step you touched.

## Writing the README

The skills are executed by a literal reader; the README is read by a person deciding
whether to try this at all. Precision bought with stiffness is a fair trade in skill text
and a losing one here — a newcomer who hits a phrase no human would say stops reading.
An AI writing prose drifts toward the same tells every time, so check for them by counting,
not by feel (owner report and measured pass, 2026-08-11):

- **Verbs, not noun compounds.** "when a capability is closed", never "capability closure".
  Each half of such a compound is correct and the whole is bureaucratese. This one shipped:
  the diagram said "product closure" for months.
- **Em-dashes separate, they don't breathe.** Keep them between a heading and its subtitle,
  or a defined term and its definition. Inside a sentence, use a full stop.
- **Bold carries the claim a section rests on**, not every key word in it.
- **Vary sentence length.** A paragraph of same-length sentences reads as machine output.
- Korean also: no translation-ese (`~에 대하여`, `가지고 있다`, `판단되어진다`, `~에 의해`
  passives). These were already absent — keep them absent.

Two rules govern the edit itself. **Subtract, never insert**: removing a tell must not
plant a replacement cliché, and facts, numbers, and canonical terms stay byte-identical.
**Keep it local**: if more than half the document changed, the meaning drifted — stop and
re-read instead. Canonical terms stay canonical inside skills; the README may explain one
in plain words but must never coin a second name for the same concept.

Report the counts (`—`, `**`, bureaucratic compounds) before and after in the CHANGELOG
entry, so the next pass can tell drift from noise. The taxonomy that produced this list is
external (`github.com/epoko77-ai/im-not-ai`, humanize-korean) and is cited, not vendored —
borrowing text into this repository still needs prior permission.

## Releasing

- The canonical version is `.claude-plugin/plugin.json`. Bump it whenever any deploy
  artifact changes behavior (skills, agents, hook, installers); docs-only changes need no
  bump. Version bump and CHANGELOG entry travel in the same change.
- **Users install from GitHub; this repository installs from disk.** README documents the
  remote two-line install on both platforms (`marketplace add nanomia-ai/devflow` +
  `plugin add`). Maintainers testing local edits use `codex/install.ps1` / `install.sh`,
  which register **this folder** as the marketplace and also write the `~/.codex/prompts/`
  slash prompts. After any skill edit, rerun the installer on your machine if you use
  Codex — reviewers cannot see the result in a PR, so state in the PR whether you ran it.
  The installers also purge prompts under the pre-0.9.0 name `nano-devflow-*`.
- The SessionStart hook ships **inside the plugin** on both platforms: Claude
  auto-discovers `hooks/hooks.json`; Codex needs it declared, which
  `.codex-plugin/plugin.json` does (`"hooks": "./hooks/hooks.json"`). Keep that manifest's
  `version` in step with `.claude-plugin/plugin.json` — they are the same release.
- `codex/install.ps1` must keep its UTF-8 **BOM** — PowerShell 5.1 parses BOM-less files
  as ANSI and corrupts non-ASCII text (reproduced in practice).
- Reinstall to verify on both platforms: Claude (`claude plugin install
  devflow@nanomia`, or `/plugin` in-session) and Codex (`codex/install.ps1` or
  `install.sh`).

## Pre-flight checklist

- [ ] `node --test "scripts/*.test.js"` passes — this is what runs the Korean check, the
      ko↔en structure parity check, and the four document-wiring checks
- [ ] `docs/design.md` decision index read in full; nothing overturned without refuting its
      reason; every moved row's subject section opened in `docs/design-decisions.md`
- [ ] `skills/**` touched? Matrix cells re-judged, and any new shape of use added as a row
- [ ] `_ko` edited first (or back-sync noted for an English-first external PR)
- [ ] Terminology table applied; structure parity ko↔en checked (headings / lists / tables
      / figures). An English-first external PR reaches parity only after the maintainer
      back-syncs, so this item is the maintainer's, not the contributor's
- [ ] This round's audit findings promoted per the table above, or listed with the reason
      each was not — a round does not close on an unlanded finding
- [ ] Verification run at the proportional level, reported under guideline §2 criteria with
      the §5 stop condition stated; findings listed (defects vs judgment calls separated)
- [ ] README prose touched? Tone rules applied and the before/after counts recorded
      (Writing the README). A typo or a link path is not prose — record that instead of counting
- [ ] Codex install rerun locally — plugin snapshot + prompts (or the PR states it was not)
- [ ] Install channels still target each platform's **current** native mechanism
      (skills · plugins · hooks) — re-verify against platform docs when platforms update
- [ ] CHANGELOG entry added at the top (+ version bump if a deploy artifact changed)

## Terminology table (fixed — no alternative translations)

Fixed means no alternative translation is allowed for a term that is here, not that the
table stops growing: a change that coins a canonical term adds its row in the same change.

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
| 증거 마감 | evidence-finalizing | | 원격 증거 점검 | remote evidence check |
| 적대 입력 | hostile input | | 능력 코드 범위 | capability code scope |
| 유지보수 라우팅 대기 | maintenance routing pending | | 재분할 대기 | re-split pending |
| 상태 판정 정본 | canonical state predicates | | 검증 판정 정본 | canonical verification predicates |
| 정본 경로 순서 | canonical path order | | 정본 카드 번호 순서 | canonical card-number order |
| 라우팅 준비 | routing prepared | | 능력 지식 기준선 | capability knowledge baseline |
| 가설 | hypothesis | | 설계 구역 | design zone |
| 검증 구역 | verified zone | | 능력 문서 | capability document |
| 경량 변경 | tweak | | 게시 | publish |
| 묘비 | tombstone | | 닫힌 폴더 투영 | closed-folder projection |
| 구조적 막힘 | structural blocker | | 지속 경합 | sustained contention |
| 묶기 | bundling | | 고아 점유 | orphan claim |
| 은퇴 관측 게이트 | retirement observation gate | | 봉쇄 | blockade |
| 유효 | active | | 대체됨 → DD-nn | replaced by DD-nn |
| 유효 · 일부 정정 → DD-nn | active, partly corrected by DD-nn | | 최초 설계 | origin |

Note: a hypothesis is the trust state of a capability knowledge baseline — a separate
concept from the `unverified` verdict, which is a verification result.

Note: the artifact has one full name, the **capability document**, and one short form,
**baseline**, which the predicate canon and the report tokens `baseline no-op:`,
`baseline missing:`, and `legacy baseline:` use. Those two forms name one concept, as with
`verify_channel` below; do not add a third. "capability file" and "capability baseline" were
that third form and are gone — do not reintroduce them. A **waiting capability file** is a
different thing: the tree-root placeholder for an unopened capability.

Note: as the field name inside `arch.md` the verify channel is written `verify_channel` —
the underscore form is the field identifier; the spaced form is prose. They are one
concept, not two. Likewise `Settled by` is the arch.md column-header form of the
settling card (해소 카드) — header and prose name one concept.
