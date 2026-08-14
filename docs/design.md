# devflow design document — why it is built this way

This document is the **canonical "why"** of devflow, and the one layer read on every
change. Identity and philosophy, the invariants that are not touched, and an index of
every decision live here. The decisions in full and the rejection lineage are in
`design-decisions.md`; observations and on-hold candidates are in `design-backlog.md`;
what every other document owns and when it is read is fixed by the document map below.

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
   only in inverse proportion to model tier.
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
Layer 0 (once, or inherited): product → arch → [design] · existing code: adopt back-derives     Layer 1 (loop): split → work ⇄ verify
Shared: resume, principles (canonical rules)
Created in the target project: devflow/{project/, tree/, journal.md, users/<id>/ rooms}
Distribution: Claude plugin (.claude-plugin) + Codex native plugin (.codex-plugin — registered by codex/install.*)
```

## Document map — what lives where, and when it is read

| Document | Standing | When it is read |
|---|---|---|
| `docs/design.md` (this file) | canon — identity, invariants, decision index | always, on every change |
| `docs/design-decisions.md` | canon — decisions in full and the rejection lineage | when any index row moves |
| `docs/design-backlog.md` | canon — observations and on-hold candidates | when planning a release |
| `AGENTS.md` | procedure — gate, translation, release, round protocol, promotion | automatically, at session start |
| `docs/audit-guideline_ko.md` | standing instrument — the canon of verification method | when reporting a verification result |
| `docs/usecase-matrix_ko.md` | standing instrument — the enumerated shapes of use | when changing `skills/**` |
| `docs/rounds/<version>/` | round record — request, handoff, plan, report, audit | the previous one only, when opening a round |
| `docs/blueprints/` | snapshot — versioned blueprints kept per release (the target-project file system, among others). An existing snapshot is never edited | when a baseline is needed to compare a structure against, or roll it back to |
| `README.md` | for people — what this is and how to use it | users read it |
| `CHANGELOG.md` | history — what shipped in which version, 0.10.0 onward. Deploy changes only | when tracing when a shipped behavior changed |
| `docs/changelog-archive.md` | history — shipped changes before 0.10.0 | when tracing something older than 0.10.0 |
| `skills/principles/SKILL.md` | canonical rules — what the runtime executes | every session devflow runs in |
| `skills/principles/planning-evidence.md` | canonical companion — planning evidence discipline | on entry for product, arch, and adopt; boundedly when split judges the maintenance planning depth grade |

The two standing instruments are opened by the session changing this repository **itself**,
not briefed in by the owner. What makes a session open them is fixed by the wiring table in
`AGENTS.md`.

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

The places devflow **declares it does not guard** are a separate list, and the "What this
does not cover" table in `README.md` is its canon. A proposal to remove a row from that
table passes the same gate as overturning a decision here.

## Decision index — read all of it, then state that this change moves none of them

This index is always read. If even one row moves, open that subject's section in `design-decisions.md`.
Rejections are not indexed here — open the subject section for whatever is being proposed
and that subject's rejection lineage sits behind its decisions. A re-proposal starts there.

| ID | Decision | Subject | Introduced | State |
|---|---|---|---|---|
| DD-01 | Output folder named `devflow/` (not docs/) | Identity, packaging, platforms | origin | active |
| DD-02 | Name is devflow — Claude uses the `devflow:` namespace, Codex uses the `devflow-` filename prefix | Identity, packaging, platforms | origin | active |
| DD-03 | Canonical rules live inside skills/principles/ | Identity, packaging, platforms | origin | active |
| DD-04 | Codex prompts embed the canon (no file reference) | Identity, packaging, platforms | origin | replaced by DD-57 (v0.13.0) |
| DD-05 | One hook only: SessionStart | Identity, packaging, platforms | origin | active |
| DD-12 | Cross-references between skills use slash-less stage names | Identity, packaging, platforms | origin | active |
| DD-13 | install.ps1 requires UTF-8 **BOM** | Identity, packaging, platforms | origin | active |
| DD-16 | Design in Korean, deploy in English (dual language) | Identity, packaging, platforms | origin | active |
| DD-18 | The Codex install leads with the native plugin channel (marketplace add + plugin add); generated slash prompts stay as the explicit channel; the hook stays separately registered in ~/.codex/hooks.json | Identity, packaging, platforms | v0.9.9 | active, partly corrected by DD-57 (v0.13.0) |
| DD-29 | Platform adapters only connect to the shared skill; they do not duplicate its procedure | Identity, packaging, platforms | v0.9.21 | active |
| DD-32 | Codex hooks ride along with the plugin — `.codex-plugin/plugin.json` declares `hooks`, and installing is two remote lines | Identity, packaging, platforms | v0.9.20 | active |
| DD-57 | The flat Codex prompt channel is removed; the plugin cache carries the companions | Identity, packaging, platforms | v0.13.0 | active |
| DD-08 | TDD procedure not adopted | Verification and roles | origin | active |
| DD-17 | The terms of the review and verification roles live in the skill text — agents/*.md is Claude packaging | Verification and roles | v0.9.5 | active |
| DD-19 | Role contracts are one companion file beside each skill (reviewer.md · verifier.md); every platform runs them by briefing a clean context with the file verbatim — no Claude agent registration | Verification and roles | v0.9.6 | active |
| DD-21 | The audit — event-triggered deep inspection; findings are not verdicts | Verification and roles | v0.9.15 | active |
| DD-22 | The retrospective — a fourth role that post-hoc evaluates design alternatives at the MVP boundary; findings are not verdicts | Verification and roles | v0.9.16 | active |
| DD-23 | The retrospective also runs when a capability first closes — scoped to that capability | Verification and roles | v0.9.17 | active |
| DD-24 | A signal pass goes stale when its inputs change + a fix card's completion signal is the verifier's reproduction steps | Verification and roles | v0.9.4 | active |
| DD-30 | Verification failures, repairable unverified results, and Audit and Retrospective events survive verify.md overwrites and session interruption | Verification and roles | v0.9.21 | active |
| DD-36 | Capability pass gates are explicit state between verdict and closure, and closure does not change verification revision inputs | Verification and roles | v0.9.21 | active |
| DD-41 | A Record states its own entry count — New entries | Verification and roles | v0.9.23 | active |
| DD-68 | Signal cards connect a completed repair's later non-pass to the same root, inherit the previous repair evidence, and return to the human at recurrence observation 2 or higher | Verification and roles | v0.15.0 | active |
| DD-06 | No model names in files (tiers T-high/T-mid/T-low only) | The task tree and its cards | origin | active |
| DD-09 | 1 task = 1 commit (only after verification passes) | The task tree and its cards | origin | active |
| DD-11 | Integrity check reports only, never auto-corrects | The task tree and its cards | origin | active |
| DD-25 | Ready-card semantics, per-card execution-proposal approval, and resume routing are decided from disk state | The task tree and its cards | v0.9.21 | active |
| DD-27 | `.stale.` task cards remain as history, and a `re-split pending` marker recovers interruption before replacement planning | The task tree and its cards | v0.9.21 | active |
| DD-38 | `Approval` is effective only with Git-diff freshness, not the card value alone | The task tree and its cards | v0.9.21 | active |
| DD-50 | A change request is recorded immediately and planned later; a completion signal is scoped to its capability | The task tree and its cards | v0.12.0 | active |
| DD-54 | One request that spans several capabilities keeps one source and one marker per parent | The task tree and its cards | v0.13.0 | active |
| DD-55 | Items that do not change the precondition-to-outcome transition ride one card | The task tree and its cards | v0.13.0 | active, partly corrected by DD-61 (v0.14.0) |
| DD-58 | A finished card's number is never renumbered | The task tree and its cards | v0.13.0 | active |
| DD-61 | A tweak's commit is its record | The task tree and its cards | v0.14.0 | active, partly corrected by DD-66 (v0.14.2) |
| DD-65 | A mixed request records only its gate-failing items — a passing item enters no journal line | The task tree and its cards | v0.14.2 | active |
| DD-69 | design confirms six Layer 0 decisions, split cards own the build, and only result facts enter design.md as upper-document feedback | The task tree and its cards | v0.15.2 | active |
| DD-07 | devflow does not create or manage a Git-worktree workflow | Concurrency, claims, integration | origin | active |
| DD-14 | The multi-mode split axis is the **scope of truth**, not people | Concurrency, claims, integration | origin | active |
| DD-15 | HANDOFF is committed to git but never in a dedicated commit — it rides the boundary commit only | Concurrency, claims, integration | origin | active |
| DD-31 | Shared routing state in multi comes from the integration tip, not the local branch | Concurrency, claims, integration | v0.9.21 | active |
| DD-40 | An approved parallel group is claimed together in one step | Concurrency, claims, integration | v0.9.23 | replaced by DD-60 (v0.14.0) |
| DD-46 | One mode — rooms are always on, and working alone folds the integration branch into the branch you are already on | Concurrency, claims, integration | v0.12.0 | active |
| DD-47 | Claims move to the depth-1 unit axis, and one canonical candidate order settles every selection | Concurrency, claims, integration | v0.12.0 | active, partly corrected by DD-60 (v0.14.0) |
| DD-49 | Git is a requirement, and worktrees are the flow registry | Concurrency, claims, integration | v0.12.0 | active, partly corrected by DD-51 (v0.13.0) |
| DD-51 | Shared truth is one integration branch; another worktree's HEAD is evidence, not authority | Concurrency, claims, integration | v0.13.0 | active |
| DD-52 | A shared transition is published against a remembered integration id | Concurrency, claims, integration | v0.13.0 | active, partly corrected by DD-62 (v0.14.0) |
| DD-53 | Several sessions in one working folder are normal, and their safety is five measured lines rather than a lock | Concurrency, claims, integration | v0.13.0 | active |
| DD-60 | Claims are freely parallel, and a checkpoint carries only the changes this session made | Concurrency, claims, integration | v0.14.0 | active |
| DD-62 | During a blockade, journal appends that mint nothing, claim nothing, and consume nothing are written immediately | Concurrency, claims, integration | v0.14.0 | active |
| DD-63 | Journal merge conflicts resolve 3-way, not as a union | Concurrency, claims, integration | v0.14.0 | active |
| DD-66 | The tweak lane confirms its landing by machine first, and in same-file contention the tweak side yields | Concurrency, claims, integration | v0.14.2 | active |
| DD-28 | Durable knowledge is connected through bounded consumers of existing records, not through a new document layer | The knowledge layer and capability documents | v0.9.21 | active |
| DD-33 | The knowledge-reachability set — standing of outside records · conversation decisions land immediately · a user-confirmation gate on product's four core sections · a disproof row (replace the statement, or re-run product) · a means row · a pre-HANDOFF landing check · a survival path for research answers that are tools · verify's disproof arbitration | The knowledge layer and capability documents | v0.9.18 | active |
| DD-42 | The capability knowledge baseline — the domain blueprint a verification closure produces | The knowledge layer and capability documents | v0.10.0 | active |
| DD-43 | Capability documents physically separate a design zone born with Layer 0 from a verified zone refreshed at closure, and are always on | The knowledge layer and capability documents | v0.11.0 | active |
| DD-44 | Domain reachability is owned by the depth-1 number rule and resume's domain-entry branch, not by card fields | The knowledge layer and capability documents | v0.11.0 | active |
| DD-45 | Capability-document recovery is judged in HEAD, and an interrupted design write finishes by regeneration rather than byte comparison | The knowledge layer and capability documents | v0.11.1 | active |
| DD-48 | Knowledge that used to die in HANDOFF now lands on two keyed lines | The knowledge layer and capability documents | v0.12.0 | active |
| DD-56 | Reading is bounded to open work: a depth-1 folder carrying `.done` is read by name | The knowledge layer and capability documents | v0.13.0 | active |
| DD-59 | Open decisions live in journal, so HANDOFF holds only what the tree recomputes | The knowledge layer and capability documents | v0.13.0 | active |
| DD-64 | The third branch of a shared-contract observation is an attributed open item | The knowledge layer and capability documents | v0.14.0 | active |
| DD-67 | Planning evidence discipline settles facts from four authorities before questions and isolates answer-only research, while the main session owns structural understanding and binding decisions | The knowledge layer and capability documents | v0.15.0 | active |
| DD-10 | No retroactive tree records (brownfield) | Brownfield and entry | origin | active |
| DD-20 | Brownfield entry is its own skill, adopt — split out of arch | Brownfield and entry | v0.9.10 | active |
| DD-26 | Brownfield and layer transitions have explicit disk states, preserving their meaning across interruption | Brownfield and entry | v0.9.21 | active |
| DD-34 | An open Git rebase or merge in a Git work tree returns to the user before every devflow route | Git mechanics and interruption recovery | v0.9.21 | active |
| DD-35 | Commit locators use Git's full object ID, while path and card order have canonical byte and numeric rules | Git mechanics and interruption recovery | v0.9.21 | active |
| DD-37 | Remote evidence splits the final task commit into the `evidence-wait` and `evidence-finalizing` states | Git mechanics and interruption recovery | v0.9.21 | active |
| DD-39 | Tree-input revision hashes are computed only through a binary pipe inside `cmd /d /s /c` on Windows | Git mechanics and interruption recovery | v0.9.21 | active |

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
  `active, partly corrected by DD-nn (vX.Y.Z)`. What replaced it is what the next
  re-proposal has to refute.
- **The index and the body must hold the same set of IDs.** A mismatch turns a test red.
- **What rises here out of a round record** is fixed by the "Promotion" table in `AGENTS.md`.
  This document set takes only what that table names.
