# devflow design document — why it is built this way

This document is the **canonical "why"** of devflow, and the one layer read on every
change. Identity and philosophy, the invariants that are not touched, and the whole
structural map live here. The decisions in full and the rejection lineage are owned by
`design-decisions.md`, and their index is generated from that source (see the decision
index below); observations and on-hold candidates are in `design-backlog.md`; what every
other document owns and when it is read is fixed by the document map below.

**To overturn a decision recorded here, refute its recorded reason first.**
To re-propose a rejected idea, refute its recorded rejection reason first.
A reversal or re-proposal that does not refute the reason does not pass review.

## Origin and philosophy

Designed by the user (jmp) to manage the entire AI-driven development process
(planning → implementation → verification). On 2026-08-05 the concepts were settled
over six round-trips (v0 → v6) with the user, then implemented.

Core philosophy — every modification must keep to it:

1. **Rich direction + minimal harness.** Top-tier recent models know the how. State the
   destination and the forbidden clearly; do not dictate methods. Strengthen the harness
   only in inverse proportion to model tier. Prose carries goal, intent, and direction;
   whatever must hold becomes a machine check that removes the place to break it. A longer
   list of rules is obeyed less, not more.
2. **Write taste, not knowledge.** Writing universal principles the model already knows
   (e.g. injection defenses) is a tax. Write only what this project prioritizes (declarations).
3. **Progress state lives in the file tree, not in documents.** Filename suffixes
   (.wip./.done./.stale.) and location are canonical. Progress written into documents
   always goes stale. Task progress is owned by the suffixes and the progress log; the
   journal and verify.md state lines whose formats the canonical rules fix are transition
   state, not a progress record, and documents still carry no progress.
4. **One concept, one word.** Skill name = artifact name = the single word for that concept.

## Structure at a glance

```
Layer 0 (once, or inherited): product → arch → [design] · existing project evidence: adopt back-derives     Layer 1 (loop): direct → work ⇄ verify
Shared: resume, principles (canonical rules)
Created in the target project: .devflow/{project/, tree/, journal.md, users/<id>/ rooms}
Distribution: Claude plugin (.claude-plugin) + Codex native plugin (.codex-plugin — registered by codex/install.*)
```

### Skill intent index — the whole map first, rules from source inside the impact boundary

This table is a fast structural map, not a substitute for skill rules. Before judging a
change, read the affected skill and the canonical companions and direct consumers this table
points to from their actual sources.

| Component | Why it exists and what it owns | Input → next consumer | Design lineage |
|---|---|---|---|
| `principles` | owns the shared policy index, commit discipline, and semantic-prose policy that follows the confirmed project Working language; it state-free-classifies only current-project devflow requests that enter Principles. A named stage reads the index projection from its own entry without Principles preflight | unnamed current-project devflow intent → resume; named stage → shared policy index then its named owner; role contract → contract directly | DD-03 · DD-29 · DD-57 · DD-92 · DD-93 · DD-97 · DD-107 · DD-109 · DD-110 |
| `product` | confirms the problem, identity, capabilities, boundary, success criteria, and project Working language with the owner, keeping that choice as one fact in `product.md` | explicit new-project or product-planning request → arch and design; fresh entry after completion rediscovers arch from the preserved Product boundary; initial existing-project reconstruction belongs to Adopt | origin · DD-33 · DD-67 · DD-97 · DD-107 · DD-109 · DD-110 |
| `arch` | confirms and refreshes current technical Layer 0, stack, code structure, data, verify channel, glossary, and capability design zones in managed projects | product or a managed glossary/design/baseline route → direct, work, and verify | DD-42 · DD-43 · DD-69 · DD-97 · DD-99 |
| `design` | optionally confirms UI approach, source, token/component strategies, decomposition axis, and review surface | product and arch → arch capability design and direct | DD-69 · DD-99 |
| `adopt` | transiently accounts for all maintained brownfield sources, proposes the Working language from meaningful human prose, and transfers their durable meaning into self-contained Product, Architecture, applicable Design, code style, glossary, capability design zones, and owner-adjacent K without retaining absorbed inputs as current dependencies | unmanaged documents and/or code → an independently maintainable managed planning and knowledge surface plus the `product.md` Working language; a whole follow-on goes through the journal to direct, otherwise stop | DD-10 · DD-20 · DD-26 · DD-97 · DD-107 · DD-108 · DD-109 · DD-110 · DD-111 |
| `direct` | owns work direction by judging planning depth and executable-unit size, materializing research or task cards, and approving their execution proposal and Work handoff; it does not assign or supervise agent processes | current request and approved scope plus Layer 0, records, and current code → a required unresolved Design decision or work | DD-25 · DD-50 · DD-67 · DD-99 · DD-110 |
| `work` | carries one card's code, progress log, completion signal, and upper-document feedback to completion | approved card, canon, and baseline → verify or the next card | DD-09 · DD-48 · DD-56 |
| `verify` | executes capability and product verdicts and owns survival paths for failure, audit, and retrospective events | closed code, signals, and baseline → repair through direct or closure | DD-21–DD-24 · DD-30 · DD-36 · DD-68 · DD-99 |
| `resume` | solely reads structured disk state and transient entry observations, recovers interrupted transitions, and routes the next stage | Git, work and knowledge trees, journal, and verify projection → the applicable entry skill | DD-11 · DD-25 · DD-26 · DD-44 · DD-92 · DD-110 |
| predicate companions | fix the shared baseline judgment in one place; state and verification judgments moved to the state tool | only named consumers read them; each stage owns its procedure | DD-28 · DD-42 · DD-56 · DD-80 · DD-92 |
| state tool | owns the entry, predicate, and integrity computation, read-only and repairing nothing | disk and Git → fourteen zones, a bounded entry observation, and a derived `next:` line; one call, six consumers | DD-11 · DD-25 · DD-39 · DD-80 · DD-110 |
| role contracts | brief reviewer, verifier, auditor, retrospector, channel-verifier, and refuter verbatim into clean contexts; the runtime renders each contract from its declaration and no devflow prose restates it | an entry-skill event → an independently constrained judgment | DD-19 · DD-21–DD-23 · DD-111 |
| `coordinator` role contract | dispatches and supervises workers above devflow without creating a stage or state | orchestrator → existing entry skills | DD-70 |

The grouped rows name `references/state/task-card-predicates.md`,
`references/verification/revision-predicates.md`, `references/verification/event-predicates.md`,
`references/knowledge/baseline-contract.md`, `references/planning/evidence-discipline.md`,
`work/references/reviewer-role.md`, `verify/references/verifier-role.md`,
`verify/references/auditor-role.md`, `verify/references/retrospector-role.md`,
`references/coordination/coordinator-contract.md`. Their actual consumers and role boundaries are
judged from source and repository checks.

## Document map — what lives where, and when it is read

| Document | Standing | When it is read |
|---|---|---|
| `docs/design.md` (this file) | canon — identity, invariants, structural map | always, on every change |
| `docs/design-decisions.md` | canon — decisions in full and the rejection lineage. The one home of a decision, and the source the index is generated from | when a row the index names moves; the index itself always |
| `docs/design-backlog.md` | canon — observations and on-hold candidates | when planning a release |
| `AGENTS.md` | procedure — minimal entry gate and conditional read wiring | automatically, at session start |
| `docs/maintenance-protocol.md` | procedure canon — translation, record landing, verification, rounds, README, release, terminology | only the sections named by `AGENTS.md` |
| `docs/audit-guideline_ko.md` | standing instrument — the canon of verification method | when reporting a verification result |
| `docs/usecase-matrix_ko.md` | standing instrument — the enumerated shapes of use | when changing `skills/**` |
| `docs/rounds/<version>/` | round record — request, handoff, plan, report, audit | the previous one only, when opening a round |
| `docs/blueprints/` | snapshot — versioned blueprints kept per release (the target-project file system, among others). An existing snapshot is never edited | when a baseline is needed to compare a structure against, or roll it back to |
| `CHANGELOG.md` | history — what shipped in which version, 0.10.0 onward. Deploy changes only | when tracing when a shipped behavior changed |
| `docs/changelog-archive.md` | history — shipped changes before 0.10.0 | when tracing something older than 0.10.0 |
| `skills/<name>/spec.mjs` · `body.md` | P2 executable authored canon — English structured behavior and prose body | when authoring, generating, or evaluating a P2 skill |
| `skills/<name>/SKILL.md` · `.generated.json` | generated deploy artifact and receipt — the runtime entry built from authored canon and its generation identity | at devflow runtime and during build or release verification |
| `skills/<name>/references/**` | exact-consumer companions and migration provenance — runtime references open by named path; `legacy-atoms/` preserves migration lineage and is not authored canon | when `spec.mjs` or `body.md` names the exact consumer; legacy atoms when migration provenance is inspected |
| `skills/principles/references/policy-index.md` | runtime canon — before the first stage judgment, points from purpose, the current request, and the latest explicit approval or approved proposal/card to the current owner and required read path selected by the Decision, without copying those values | at each named-stage entry through the body's identical projection, before Decision opens its selected source |
| `skills/principles/references/planning/evidence-discipline.md` | runtime companion — planning evidence discipline | on entry for product, arch, and adopt; boundedly when direct judges the maintenance planning depth grade |
| `skills/principles/references/coordination/coordinator-contract.md` | role contract — duties of the `coordinator` that dispatches other executors above devflow | before the first dispatch |

The two standing instruments are opened by the session changing this repository **itself**,
not briefed in by the owner. What makes a session open them is fixed by the wiring table in
`AGENTS.md`.

`README.md` and `README_ko.md` are **a person's documents, and they live outside the AI's read
set.** What skills, tools, and procedures reach is `skills/`, `scripts/`, `hooks/`, `codex/`,
`docs/`, and the manifests; README is beyond that edge — not read, not updated, not used as
grounds for a judgment. The owner decides directly what goes in one and when. **This line holds
after README returns** — what returns is the file, not the wiring. Right now the files
themselves are gone and git keeps the last version.

Round records moved out of a flat `docs/` into `docs/rounds/<version>/` on 2026-08-13 and
their filenames became roles (handoff, plan, report, audit). Sentences in `CHANGELOG.md` that
name the older paths were left alone, being true of their moment — an old path resolves inside
that version's round folder.

## Invariants — not touched before the reason is refuted

For the items below the cost is the function, so none of them is an optimization target. The
source is the 0.13.0 plan §14; what follows is the digest the v0.14.0 execution report §6
folded in, carried across unchanged. The list grows through the promotion table, so its
length is not written into the prose.

- **Re-reading Layer 0 for every card** — after compaction, "have read" is not "have".
- **Review runs in a clean session** — implementation history colors the judgment.
- **A closure replaces the whole verified zone** — a partial update leaves a contradiction.
- **The progress log is updated before execution** — you cannot know the moment you die, so "later" is loss.
- **A claim is a commit** — all concurrent work stands on this.
- **resume always runs the integrity check** — it is the only net that catches a merge accident.
- **`Read first` opens all of it** — that is the device that replaces searching.
- **verify, audit and retrospective at closure** — that is the moment knowledge lands in the capability document.

The places devflow **declares it does not guard** are a separate list, and that list lives in a
person's document — that is, beyond the boundary above. The owner decides what enters and
leaves it. That such a decision carries the same weight as overturning a decision here is
unchanged, and the owner is the one who weighs it.

## Decision index — read all of the generated projection, then state which rows this change moves

The one home of a decision is `design-decisions.md`, and the index is a read-only projection
generated from that source's titles and metadata. This document does not carry the index by hand.

```
node scripts/decision-index.mjs
```

An entering session reads this document in full and that output. If even one row moves, open
that row's subject section in `design-decisions.md`. Rejections are not indexed here — open the
subject section for whatever is being proposed and that subject's rejection lineage sits behind
its decisions. A re-proposal starts there.

The output is `ID | Decision | State` grouped by subject; the introducing version is owned by
the source metadata. The Korean pair is projected with `--lang ko`. The command writes nothing.

## Borrowings and their boundary

Borrowed from Matt Pocock's (mattpocock) skills repository: the research card (a distillation
of prototype+wayfinder), the 3 ADR conditions (domain-modeling), the dual verification axes
(code-review), and part of the value declarations in code-style's Values section
(codebase-design·tdd with the procedures removed — taste only), grilling's decision frontier
and fact/decision separation, boundary scenarios, and primary-source discipline. Isolating
answer-only internal and external evidence search borrows research's separation of reading,
but is bounded by grouping questions in the same search scope under one researcher and
keeping raw-source structural understanding with the main session.

**Deliberately not borrowed**: enforced vocabulary, the Red-Green procedure, the 12-smell
list, unbounded grilling, a research-file layer, indirect skill dependencies, and 3-agent
parallel design.

User rule: any further borrowing into this repository requires prior permission.

## How to change this document set

- **A new decision takes the next number.** `DD-` numbers are never reused — round records
  cite decisions by them. Rejections follow the same discipline under `DR-`.
- **An overturned decision is not deleted.** Its body stays; only the state changes. There
  are three states and the format is fixed (a test enforces it): `active` ·
  `replaced by DD-nn (vX.Y.Z)` · and, when only part of a decision has retreated,
  `active, partly corrected by DD-nn (vX.Y.Z)`; when another correction follows, append
  `, DD-nn (vX.Y.Z)` in introduction order under the same state. What replaced it is what the next
  re-proposal has to refute.
- **The index is not maintained by hand.** One source owns the decisions and the index is its
  projection, so a new row appears in exactly one place. A projection that is not 1:1 with the
  source turns a test red.
- **What rises here out of a round record** is fixed by the promotion table in
  `docs/maintenance-protocol.md` §5.
  This document set takes only what that table names.
