# devflow Repository Maintenance Protocol

This document is the detailed canon for changing the devflow **repository itself**. A new
session does not read it whole. The wiring table in `AGENTS.md` names the exact sections for
the request, paths, and output. Runtime rules remain canonical under `skills/principles/`;
this document does not redefine skill behavior.

## 1. Scope and impact boundary

The wiring table at the automatic entry point, `AGENTS.md`, is the sole owner of conditional
read dispatch. This section bounds work routed here. After reading the files fixed by the
entry gate, fix the change scope as paths before opening additional impact files; do not
narrow it with a judgment word such as relevance. When a path, action, or output also meets
another condition in the wiring table, union the read sets. If applicability is uncertain,
expand the read set and never silently shrink it.

A maintenance-structure task that does not change `skills/**` does not repair a skill defect
it discovers. Report the exact path, failure scene, and related decision, then route it to a
separate request. Whole README, whole CHANGELOG, multiple rounds, and every blueprint are not
the default onboarding set. Open them only after an exact coordinate requires them.

## 2. Dual language and document integrity

**Design in Korean and deploy in English.** `_ko.md` is the design original the owner reviews;
the English pair is the deploy artifact consumed by AI.

```
skills/<name>/SKILL_ko.md ↔ SKILL.md
skills/principles/{state-predicates,verification-predicates,baseline-predicates,planning-evidence,coordinator}_ko.md ↔ same-name .md
skills/work/reviewer_ko.md ↔ reviewer.md
skills/verify/{verifier,auditor,retrospector}_ko.md ↔ same-name .md
codex/AGENTS-devflow_ko.md ↔ AGENTS-devflow.md
README_ko.md ↔ README.md
docs/{design,design-decisions,design-backlog,maintenance-protocol}_ko.md ↔ same-name .md
docs/rounds/v0.10.0/proposal_ko.md ↔ proposal.md
docs/rounds/v0.11.0/report_ko.md ↔ report.md
docs/rounds/v0.9.21/report_ko.md ↔ report.md
```

English-only files are `AGENTS.md`, `CHANGELOG.md`, and `CLAUDE.md`. In this repository,
`CLAUDE.md` stays the one line `@AGENTS.md`. Role contracts are companion files briefed
verbatim to a clean context, not registered agents. Do not mix predicate companions with
role contracts.

The modification order is fixed.

1. Change the `_ko` original first and get owner review.
2. Translate its English pair using the fixed terms in §9. Coin no second English name.
3. Check 1:1 heading count, numbered-list count, table rows, diagram count, and figures,
   percentages, and versions that carry meaning.
4. If a deploy artifact changed, finish the install, CHANGELOG, and version procedure in §7.

External contributors may change English first, but a maintainer back-syncs the Korean
original before the next release. Korean lives only in `_ko.md`, the two Korean-only standing
instruments, unpaired round records, and the terminology table in the Korean original of this
document. English deploy artifacts contain no Korean. The only exception is README's one
language-switcher line `[Korean]`. `node --test "scripts/*.test.js"` owns the zero-Korean and
ko/en structural checks.

## 3. Landing design intent and records

Do not accumulate new information in an arbitrary document. Only information with the same
lifetime shares a home.

| Information | One landing place | Content |
|---|---|---|
| identity, invariants, whole structure | `docs/design.md` | short canon every future change must know |
| binding decision and design intent | `docs/design-decisions.md` | problem, desired behavior, boundary, reason, revisit condition |
| unadopted observation or candidate | `docs/design-backlog.md` | evidence, strain, condition to revisit |
| one round's measurement and judgment | `docs/rounds/<version>/report_ko.md` | execution evidence, limitations, unlanded items |
| actual shipped result | `CHANGELOG.md` | what, why, files |
| explanation for people | `README.md` | adoption decision, use, trust boundary |
| runtime rule | `skills/**` | only in a separately requested skill change |

Do not create a manual `CURRENT.md`, free-form note layer, or omnibus summary. Recover the
current position from Git, manifests, and the bounded carry-forward section of the latest
numeric-version round. Record intent only when one of these is true.

- A future AI could mistake it for redundancy or cost and remove it.
- Current behavior does not reveal why it exists.
- Several implementations work, but only one preserves the original purpose.
- A boundary was added because of a real failure.
- A rejected alternative is likely to recur.
- Tests could pass while the implementation moves in the wrong direction.

Then record `Observed problem / Desired behavior / Chosen boundary / Why the boundary is
needed / Rejected alternative (only when present) / Affected coordinates / Revisit when`.
Do not attach this shape to a self-contained fact such as a typo, path, date, or check count.
Do not repeat one meaning across a round, a decision, and CHANGELOG; each owns only its
lifetime.

## 4. Verification and audit

Skill text executes literally, so verification is adversarial execution simulation. The
finding-adoption criteria, lenses, stop condition, and report format live only in
`docs/audit-guideline_ko.md`.

1. Keep the sequence design → independent refutation → apply → post-audit → re-audit fixes.
2. A typo or formatting change needs a literal re-read; wording needs at least one
   independent refutation; structural or multi-file work needs the full protocol and sweep.
3. Report first and apply after approval. A clear rule conflict may be repaired directly,
   but separate it from judgment calls.
4. A repaired sentence is a new change and is audited again.
5. Rank severity as quiet data loss → structural split → wrong action → stop with no exit → cost.
6. Before reporting, read audit guideline §2·§5·§6 and state every §5 result. A report-only
   pass marks the repair clause not applicable.

Zero findings is valid. Do not manufacture findings under pressure to find defects. Do not
walk the same path again with the same lens. Give an independent pass no implementation
backstory: only the changed files and the verbatim §8 briefing. A sanctioned exception to a
canonical rule can be declared only inside `skills/principles/`.

For external contributors, equivalent PR evidence stands in place of opening the two
Korean-only standing instruments. Their PR description states what they tried to break and
what a literal reader does at every touched step.

A round that changes AI repository entry runs the same questions before and after in clean,
read-only Claude and Codex sessions. Check the lifecycle, why components exist, authority
differences, a hostile deletion prompt, impact paths, recent state, and reporting uncertainty.
Missing a critical invariant, relevant consumer, or design reason, or proposing deletion
before source reading, must each total zero. Lower comprehension rejects the change even when
tokens fall.

## 5. Round records

A change large enough to take its own version is a round, and a round leaves its record in
`docs/rounds/<version>/`.
When the owner requests a versioned implementation without naming a round-document role,
one `report_ko.md` is the default record of the release, verification, and limitations.
Otherwise a round creates only the role document the owner requested. A plan request does
not imply a handoff, report, or audit. Filenames are `request_ko.md`, `handoff_ko.md`,
`plan_ko.md`, `report_ko.md`, `audit_ko.md`, and `plan-audit_ko.md` for an audit of the plan
itself. A repair release with no separate folder records `report-<repair version>_ko.md`
inside the preceding round; its version must have the folder's major and minor and a higher
patch.

Other existing nonstandard names remain as records of their time but do not establish new
roles.
`v0.15.0/progress-review_ko.md` is the sole historical exception: an intermediate progress
review the owner requested, not a reusable round-role name.

A round document changes only when the owner asks to revise that document. Report an error in
another role in conversation; do not repair it. A revision gives the predecessor a positive
ordinal without a leading zero, starting with `-r1`, and the new document takes the plain
name. Additional parallel records use an ordinal of 2 or greater without a leading zero
before `_ko`, as in `request2_ko.md`.

A request preserves what the owner wants in the owner's terms; a handoff preserves what the
next design session must know. They are not two names for one document, and most rounds have
neither. A request is input to a plan and does not rise directly into canon. An unwritten role
is not missing work, and a round with one document can be complete.

The previous round is the greatest version below the current one by integer segment, not the
last string in a directory listing. A repair release recorded inside the prior round without
its own folder is not a new round.

A plan says four things.

1. Why: the measurement, field report, or owner decision that caused the round.
2. What: the exact change at file and sentence level.
3. What it buys: the failure path it closes or property it acquires.
4. Expected result: the observable state an implementer tests its interpretation against.

Every review or report finding carries a source quotation and location, causal mechanism,
concrete predicted scene, and the intersection of conditions where it reaches and where it
does not. Audit guideline §6 owns the detailed form.

| Round artifact | What rises | Landing place |
|---|---|---|
| plan | reversal with refutation, new decision, rejection retained | `docs/design-decisions.md` |
| report | judgment outside the plan, rule overturned by measurement, do-not-touch item | `docs/design-decisions.md`; invariants in `docs/design.md` |
| audit | impossibility verdict, design tension, adopted but unrepaired finding | `docs/design-backlog.md`; invariants in `docs/design.md` |
| any role | new shape of use | `docs/usecase-matrix_ko.md` |
| any role | defect class absent from audit guideline §2 | `docs/audit-guideline_ko.md` §2 |
| any role | new canonical term | this document §9 |
| any role | new document role | the document map in `docs/design.md` |

Promote an audit's adopted findings before its round ends, or record why each did not rise.
The next-round rescue wiring reaches back only one round. A new report may carry a short
boundary output with `Actually shipped / New binding decisions / Unrepaired findings (none
or exact IDs and paths) / Remaining limitations / Next revalidation`. It is not a current
canon that retells history.

## 6. README

Skills are literal execution artifacts; README is for a person deciding whether to adopt.
Keep these prose constraints.

- Prefer verbs to noun compounds.
- Use an em dash between heading and subtitle or term and definition, not as sentence breath.
- Bold only the claim on which a section rests.
- Vary sentence length.
- In Korean, avoid translation-like padding and passive constructions.

**Subtract without inserting a new cliché.** Preserve facts, figures, and canonical terms
byte-for-byte.
**Keep the edit local.** If more than half the document changes, stop because meaning drifted.
README may explain a skill concept plainly but does not coin a second name for it.

For a prose edit, record before/after counts of `—`, `**`, and bureaucratic compounds in that
change's report. When the same change already requires CHANGELOG, include the counts there too.
A docs-only README edit does not create CHANGELOG for this reason. A typo or link path records
that it was not a prose change. Cite external taxonomies rather than vendoring them; importing
text still needs prior permission.

## 7. Release and installation

- The canonical version is `.claude-plugin/plugin.json`. A behavior-changing deploy artifact
  bumps the version and both manifests stay equal. Docs-only work gets no version or CHANGELOG.
- Users install from GitHub; this repository installs from disk. Local verification runs
  `codex/install.ps1` or `install.sh` to register this folder and refresh the snapshot.
- SessionStart ships inside the plugin on both platforms. Claude auto-discovers
  `hooks/hooks.json`; Codex reads the `hooks` declaration in `.codex-plugin/plugin.json`.
- Preserve the UTF-8 BOM in `codex/install.ps1`. PowerShell 5.1 reads a BOM-less file as ANSI.
- Reinstall with `claude plugin install devflow@nanomia` and the local Codex installer.
- The generated `~/.codex/prompts/` channel is gone since DD-57. Installers clean only exact
  names an older devflow generated.

Deploy artifacts are `skills/`, `codex/`, `hooks/`, `scripts/`, and plugin manifests. If any
changes, add the newest CHANGELOG entry with date, what, why, and files. Stop near 60 lines;
audit process, measurements, and finding adjudication belong in the round report. History
before 0.10.0 is in `docs/changelog-archive.md`.

## 8. Pre-flight checklist

- [ ] `node --test "scripts/*.test.js"` passes
- [ ] full `docs/design.md` decision index read; reason read for every moved subject
- [ ] when `skills/**` changes, matrix cells re-judged and new shapes checked
- [ ] `_ko` changed first; fixed terms and ko/en structure and figures match
- [ ] when an audit ran, adopted findings promoted or reasons for not promoting recorded
- [ ] proportional verification reported under audit §2 and §5
- [ ] README prose edit has before/after counts; link or typo records that fact
- [ ] skill, hook, or installer change records whether the local Codex snapshot was refreshed
- [ ] current native skills, plugins, and hooks channel rechecked on both platforms
- [ ] deploy artifact has CHANGELOG and version; docs-only work has neither
- [ ] create, delete, or move swept through document map, references, tests, installers, README
- [ ] when `skills/**` is out of scope, its diff against the base commit is zero

## 9. Fixed terminology

Do not use an alternative English term for a concept in this table. The table does not block
new concepts; add a row in the same change that coins a canonical term.

| Concept | Required English | | Concept | Required English |
|---|---|---|---|---|
| canonical rules | canonical rules | | capability | capability |
| task card | task card | | foundation | foundation |
| Destination | Destination | | Why | Why |
| Forbidden | Forbidden | | completion signal | completion signal |
| Depends | Depends | | Read first | Read first |
| Tier T-high/T-mid/T-low | Tier T-high/T-mid/T-low | | Coordinates | Coordinates |
| Identity | Identity | | verify channel | verify channel |
| research card | research card | | execution proposal | execution proposal |
| integrity check | integrity check | | document hierarchy | document hierarchy |
| failure ladder | failure ladder | | progress log | progress log |
| promotion | promotion | | reasoning effort | reasoning effort |
| Values | Values | | Project choices | Project choices |
| Trust boundary | Trust boundary | | Non-goals | Non-goals |
| unverified | unverified | | pass/fail | pass/fail |
| Provisional | Provisional | | evidence-wait | evidence-wait |
| boundary commit | boundary commit | | upper-document feedback | upper-document feedback |
| freshness | freshness | | journal sweep | sweep |
| retired | retired | | success criteria | success criteria |
| multi mode | multi mode | | solo mode | solo mode |
| room | room | | claim | claim |
| release | release | | digest | digest |
| marker | marker | | binding decision | binding decision |
| integration branch | integration branch | | ownerless claim | ownerless claim |
| assignment | assignment | | incomplete transition | incomplete transition |
| bare | bare | | discovery→update table | discovery→update table |
| adoption | adoption | | brownfield | brownfield |
| unminted | unminted | | settling card | settling card |
| stuck-escape | stuck-escape | | cause hypothesis | cause hypothesis |
| audit | audit | | finding | finding |
| retrospective | retrospective | | strain evidence | strain evidence |
| evidence-finalizing | evidence-finalizing | | remote evidence check | remote evidence check |
| hostile input | hostile input | | capability code scope | capability code scope |
| maintenance routing pending | maintenance routing pending | | re-split pending | re-split pending |
| canonical state predicates | canonical state predicates | | canonical verification predicates | canonical verification predicates |
| canonical path order | canonical path order | | canonical card-number order | canonical card-number order |
| routing prepared | routing prepared | | capability knowledge baseline | capability knowledge baseline |
| hypothesis | hypothesis | | design zone | design zone |
| verified zone | verified zone | | capability document | capability document |
| tweak | tweak | | publish | publish |
| tombstone | tombstone | | closed-folder projection | closed-folder projection |
| structural blocker | structural blocker | | sustained contention | sustained contention |
| bundling | bundling | | orphan claim | orphan claim |
| retirement observation gate | retirement observation gate | | blockade | blockade |
| active | active | | replaced by DD-nn | replaced by DD-nn |
| active, partly corrected by DD-nn | active, partly corrected by DD-nn | | origin | origin |
| planning evidence discipline | planning evidence discipline | | repair lineage | repair lineage |
| recurrence observation | recurrence observation | | pre-commitment review | pre-commitment review |
| signal card | signal card | | planning depth grade | planning depth grade |
| approach | approach | | design source | design source |
| token strategy | token strategy | | component strategy | component strategy |
| decomposition axis | decomposition axis | | review surface | review surface |
| build scope | build scope | | disposition | disposition |
| decision record | decision record | | evidence record | evidence record |
| record gate | record gate | | record tool | record tool |
| knowledge capsule | knowledge capsule | | opening budget | opening budget |
| provenance mark | provenance mark | | Intent overview | Intent overview |
| synthesis | synthesis | | conjecture | conjecture |
| dispute | dispute | | provenance sampling check | provenance sampling check |

A hypothesis is the trust state of a capability knowledge baseline, not the verification
result `unverified`. The artifact's full name is `capability document` and its only short
form is `baseline`. Do not reintroduce `capability file` or `capability baseline`. A `waiting
capability file` is the tree-root placeholder for an unopened capability.

`verify_channel` is the field identifier in arch.md and `verify channel` is its prose form.
`Settled by` is the arch.md column-header form of the settling card.
