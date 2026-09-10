# Changelog

What shipped in devflow, newest first. Format: each entry records **what changed and why**
in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

**An entry means a deploy artifact changed** — something under `skills/`, `codex/`,
`hooks/`, `scripts/`, or a plugin manifest. Planning, review, audit and document work
leaves no entry here: the document is its own record and `docs/rounds/<version>/` holds
the round it belongs to. Entries written before that rule existed were removed on
2026-08-14.

Entries for 0.10.0 and later are here; older ones are in
[docs/changelog-archive.md](docs/changelog-archive.md).

## 0.25.0 - 2026-09-10 - Adopt's refutation becomes a declared role, and a premature approval stops at a guard

Two real 0.24.0 Adopt runs reached the irreversible first canonical write set on producer-supplied
values alone. One narrowed the refuter's brief until the blocking check for verification means fell
outside it. The other resumed after an interruption and headed straight for the write plan, because a
stage BLOCK that asks for one caller value seals every value supplied with it and inherits it into the
next call - so an `approve` typed while refutation was still unknown rode a refutation question into
the approve row, skipping the write-free proposal and its question.

Adopt now declares `ROLES.refuter` with its inputs, reads, judgments, and a `refutationResult` return
template. Both refutation branches open the refuter contract and `DISPATCH` that role before `WAIT`,
so the brief is the runtime's own `role` render rather than prose the producer assembles, and the
returned `coverage` field carries initial coverage across a correction. `refutation.state` moves to the
`decided` lane it shares with Verify's returned verdicts, leaving Adopt with no producer self-judgment.
A new guard, `approval-precedes-refutation`, blocks an `approve` that arrives while refutation is not
`clear`; a guard stop carries no needs, so it emits no continuation seal and the next call falls to the
write-free proposal. Verify's three dispatches and Arch's channel-verifier dispatch gained the same
role-contract `READ`, and the three Verify stubs plus two new files now say how to hand a contract to a
clean context. Adopt still writes nothing before approval, and no state, marker, or collector was added.

Files: `skills/adopt/{spec.mjs,body.md,references/workflow.md,references/refuter-role.md,templates/refutation-result.md,fixtures/*}`,
`skills/verify/{spec.mjs,references/{verifier,auditor,retrospector}-role.md,fixtures/scenarios.json}`,
`skills/arch/{spec.mjs,references/channel-verifier-role.md,fixtures/scenarios.json}`,
nine regenerated P2 receipts, `scripts/project-state.test.js`, `docs/design.md`,
`docs/design-decisions.md` (DD-111; DD-102 and DD-106 partly corrected), `docs/usecase-matrix_ko.md`,
`docs/rounds/v0.25.0/report_ko.md`, both plugin manifests.

## 0.24.0 — 2026-09-10 — Re-anchor cold execution in canonical owners

The staged knowledge-contract repair preserves journal and Product meaning before commit because
actual Adopt projection had copied a wider timestamp/JSON form that the project-state parser silently
lost. It keeps the journal grammar as meaning owner, round-trips the live projection, reports reserved
near-misses with their bytes and locator, and rejects malformed staged Product knowledge instead of
discarding it. Files: `skills/principles/references/state/journal-grammar.md`,
`skills/principles/scripts/project-state.mjs`, Adopt's spec/body/format fixture, the shared commit
discipline, their generated receipts, and targeted tests.

The AI context-delivery redesign keeps all nine stage identities while replacing repeated, flat
delivery with a pre-judgment pointer from current purpose, request, and approval to canonical owners,
stage-owned judgment inputs, and detail beside its first consumer. This lets fresh Resume rediscover
Arch after a complete Product boundary without assuming ROUTE execution, while Direct preserves
optional Design and Verify/Resume defer branch-only reads. Files: the authored policy/body/spec and
collector changes under Principles, Product, Adopt, Direct, Verify, and Resume; all nine generated
package receipts; `skills/principles/body.md`; `scripts/project-state.test.js`;
`skills/verify/fixtures/post-repair.test.mjs`; and `scripts/repository-invariants.test.js`. No new state,
route kind, registry, helper, or automatic ROUTE execution was introduced.

## 0.23.23 — 2026-09-10 — Keep reserved-journal examples parseable

Direct, Verify, and the Principles-owned journal/progress format fixtures now use the
canonical seconds-only UTC timestamp that `project-state.mjs` consumes. This removes an
authored millisecond example which a clean Claude Adopt → Direct run copied literally and
which the state projection then discarded without surfacing the request.

Gate A now discovers the affected packages' actual reserved-head fixtures and traces the
live Direct and Verify journal writers into their projected state. The broader case where a
malformed timestamp prefix bypasses integrity item 12 is recorded for a separate parser-boundary
round; this release does not widen the timestamp contract or change any stage, collector, or
role behavior.

## 0.23.22 — 2026-09-10 — Make runtime evidence input shell-neutral

All nine promoted P2 packages now project the official Skill Rails v0.4.3 runtime 0.3.6,
validator 0.6.2, and kernel 6. Generated Decisions expose structured `record inputs`; the CLI
binds an `effect_claimed` record to its planned Decision effect by index and accepts bounded
UTF-8 JSON through `--data-file`, so generated guidance no longer depends on preserving JSON
bytes through shell quoting. Argument, input, and resume failures also use structured diagnostics
before evidence can reach the trace.

This is an external runtime projection update, not a Devflow semantic change. Every authored
`spec.mjs`, `body.md`, collector, fixture, template, reference, intent, evaluation case, and
obligation ledger remains byte-identical; the official installed builder repaired only its
generated ownership envelope. A fresh Work trace exercised effect-index binding, a Korean UTF-8
data file, alignment, resume, and after-effects re-entry without using an earlier run or repository
project state.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `CHANGELOG.md`;
`docs/usecase-matrix_ko.md`; `docs/rounds/v0.23.0/report-0.23.22_ko.md`; each of
`skills/{adopt,arch,design,direct,principles,product,resume,verify,work}` at `.generated.json`,
`SKILL.md`, and `scripts/skill-rails/{cli,constants,guide}.mjs`.

## 0.23.21 — 2026-09-09 — Carry forward sealed after-input values

All nine promoted P2 packages now project the official Skill Rails v0.4.1 runtime 0.3.5,
validator 0.6.2, and kernel 6. When consecutive effect-free `after-input` Decisions keep the
same package, canonical project, target, stable snapshot, and run, the runtime carries forward
caller-supplied judged and decided values sealed by the immediately preceding Decision; a newly
supplied value replaces the retained value for its field. Changed or unsealed context does not
inherit those values, and the duplicate-Decision emission guard remains fail-closed.

This is an external runtime projection correction, not a Devflow semantic change. Every authored
`spec.mjs`, `body.md`, collector, fixture, intent, and obligation ledger remains byte-identical;
the official installed builder repaired only its generated ownership envelope. A fresh Principles
trace proved A→B cumulative input retention through a terminal route, preserved the duplicate
guard, and resumed from the terminal Decision without a next command.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `CHANGELOG.md`;
`docs/usecase-matrix_ko.md`; `docs/rounds/v0.23.0/report-0.23.21_ko.md`; each of
`skills/{adopt,arch,design,direct,principles,product,resume,verify,work}` at `.generated.json`,
`SKILL.md`, and `scripts/skill-rails/{api,constants,evaluator}.mjs`.

## 0.23.20 — 2026-09-09 — Give T-low cards their concrete execution basis

Direct now puts only destination-matched exact K paths in every task or research card's `Read
first`; T-low implementation cards additionally carry the minimal concrete provider or consumer
code/test paths, essential ordering or dataflow constraints, and any task-owned named fixture.
Layer 0, the number-owned current capability, and Binding ADR inputs remain Work's independent
automatic inputs instead of being copied into `Read first`; truly greenfield or independent cards use the one explicit N/A form.

Work keeps its existing fail-closed basis boundary for absent, escaping, or duplicated capability
paths. DD-44 now records DD-90's narrow correction of the old legacy-defer sentence without
changing the depth-1 number rule, and the Direct authoring card carries the current writer effect.

Separately, all nine promoted P2 packages now project the common Skill Rails runtime 0.3.4 and
validator 0.6.2. An effect-free BLOCK whose needs are all caller-supplied judged or decided values
now carries `reinvoke: after-input`; traced stage writes and returns its UTF-8 stage-result path;
`resume/2` emits a next command only for `after-effects` or `recompute`; generated adapters treat
a stale Decision as effect-free and continue only through `reinvoke: recompute`. The
duplicate-Decision trace guard remains fail-closed, and no Devflow spec, body, fixture, or test was
added for this common-runtime correction.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `skills/direct/spec.mjs`;
`skills/direct/body.md`; `skills/direct/authoring-card.md`;
`skills/direct/fixtures/source/direct-package.test.mjs`; `skills/direct/.skill-rails/semantic-diff.json`;
`skills/principles/references/knowledge/inputs-and-entry.md`;
`skills/principles/.skill-rails/semantic-diff.json`; `skills/work/body.md`;
`skills/work/collectors/project-state-seam.test.mjs`; `skills/work/.skill-rails/semantic-diff.json`;
each of `skills/{adopt,arch,design,direct,principles,product,resume,verify,work}` at `SKILL.md`,
`.generated.json`, and `scripts/skill-rails/{authoring-ledger,cli,constants,evaluator}.mjs`;
`docs/design-decisions_ko.md`; `docs/design-decisions.md`; `docs/usecase-matrix_ko.md`;
`docs/design-backlog_ko.md`; `docs/design-backlog.md`;
`docs/rounds/v0.23.0/report-0.23.20_ko.md`; `CHANGELOG.md`.

## 0.23.19 — 2026-09-08 — Publish initial identity with the binding boundary

Initial Product and Adopt now resolve actor and Git identity read-only before binding approval. When the
resolved actor has no room, only Product `commit-initial` and Adopt `approve` materialize the canonical
room triple immediately before their existing first binding commit and stage it with the approved owner
set. Existing pre-Product research rooms are preserved, and no standalone room commit, fresh re-entry,
room-only state exception, project-state change, or Resume change is introduced.

Adopt's proposal now screens every ADR-qualified decision and every decision missing ground. Current
direction, ground, dropped alternatives, and exact owner landing remain self-contained in Architecture or
capability Intent, with on-demand K only for additional depth; `Binding ADRs` accepts only existing exact
paths and Arch remains the sole formal ADR writer.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `skills/principles/references/policy-index.md`;
`skills/principles/references/state/identity-and-rooms.md`;
`skills/principles/references/delivery/commit-and-verification.md`;
`skills/principles/.skill-rails/semantic-diff.json`; `skills/principles/.generated.json`;
`skills/product/spec.mjs`; `skills/product/body.md`; `skills/product/fixtures/scenarios.json`;
`skills/product/.skill-rails/semantic-diff.json`; `skills/product/.generated.json`;
`skills/adopt/spec.mjs`; `skills/adopt/body.md`; `skills/adopt/references/workflow.md`;
`skills/adopt/templates/adoption-proposal.md`; `skills/adopt/fixtures/make-scenarios.mjs`;
`skills/adopt/fixtures/scenarios.json`; `skills/adopt/.skill-rails/semantic-diff.json`;
`skills/adopt/.generated.json`; `docs/design-decisions_ko.md`; `docs/design-decisions.md`;
`docs/usecase-matrix_ko.md`; `docs/rounds/v0.23.0/report-0.23.19_ko.md`; `CHANGELOG.md`.

## 0.23.18 — 2026-09-08 — Keep no-effect continuations trace-safe

Adopt now ends an evidence-supported proposal correction and its independent bounded recheck with
`ROUTE:adopt`. The same actor immediately continues at a fresh Adopt entry, so a legitimate later
`revise` can repeat the same pure Decision without colliding with the trace guard inside one run or
requiring another user prompt.

Work's no-reusable-knowledge branch is now the exact effect-free `NEXT` plan. The evaluator passes that
branch over inside the current evaluation and proceeds directly to task finalization, instead of emitting
a report-only Decision whose required same-run reinvocation has no observation change and is rejected as
a duplicate.

The common evaluator and duplicate-emission guard remain unchanged and still fail closed when the same
Decision is emitted twice in one run. The Adopt loop was latent from 0.23.13 and the Work branch from the
0.20.0 Skill Rails migration; the observed Sol failure also included a separate caller error that reused
an ASK run even though its Decision had no reinvocation. The common CLI `resume` terminal-run concern is
recorded separately for its external Skill Rails runtime owner and is not changed here.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `skills/adopt/spec.mjs`;
`skills/adopt/fixtures/make-scenarios.mjs`; `skills/adopt/fixtures/scenarios.json`;
`skills/adopt/.skill-rails/semantic-diff.json`; `skills/adopt/.generated.json`;
`skills/work/spec.mjs`; `skills/work/fixtures/scenarios.json`;
`skills/work/.skill-rails/semantic-diff.json`; `skills/work/.generated.json`;
`docs/design-backlog_ko.md`; `docs/design-backlog.md`;
`docs/rounds/v0.23.0/report-0.23.18_ko.md`; `CHANGELOG.md`.

## 0.23.17 — 2026-09-08 — Repair the Adopt package seal

Adopt's authored behavior is unchanged. The 0.23.16 package shipped `body.md` after a final whitespace
cleanup while `.generated.json` still sealed the prior bytes, so the Skill Rails runtime correctly
stopped source and installed entry with `SR_MANIFEST_MISMATCH`.

This hotfix rebuilds `skills/adopt/.generated.json` from the canonical P2 sources with the standard Skill
Rails build, restoring the exact content hash and full 200-repeat evidence. Both plugin manifests move to
0.23.17 so the repaired snapshot can be installed independently on Claude and Codex; no skill prose,
predicate, fixture, runtime loader, state tool, or downstream stage changes.

## 0.23.16 — 2026-09-08 — Adopt transfers knowledge instead of retaining migration inputs

Adopt now keeps its complete source-coordinate inventory on the proposal and refutation surface, then
writes self-contained durable meaning to the canonical Product, Architecture, applicable Design,
glossary, capability, and K owners. Absorbed migration inputs no longer survive as `Existing records` or
mandatory K `Source basis` dependencies; that footer is absent by default and remains nonempty and fully
validated when an owner keeps a live input or an existing managed card supplies evidence.

The existing two-commit self-reference boundary remains without relying on dirty drafts. Commit one lands
the complete approved semantic set with provisional capability `Design head: none`; because the head
command reads only product, architecture, and glossary, commit two changes only those capability head
lines. Absorbed coordinates also leave provenance marks and the worked form now shows both the absorbed
default and explicit live evidence. The release updates the causal Adopt and Principles owners, common K
templates, both Architecture templates, focused validators/tests, generated receipts, decision/design/
matrix records, this changelog, the round report, and both plugin manifests; project-state and downstream
stages remain unchanged.

## 0.23.15 — 2026-09-07 — Project prose keeps one confirmed working language

Product now owns one explicit `Working language` value and confirms it through its existing
write-free question before either Product document is written. Adopt proposes that value from
maintained human prose rather than identifier counts, exposes uncertain, tied, multilingual, or
sparse evidence before canonical writes, and after an owner correction runs fresh independent
refutation before reusing its existing prepare fallback. Principles makes the confirmed value apply
to later semantic prose while
fixed schemas, paths, commands, identifiers, provenance literals, quoted sources, and exact
canonical terms remain stable; older managed projects without the field remain valid.

The shipped paths are the canonical Principles, Product, and Adopt sources and their generated
receipts, focused repository/state tests, and both plugin manifests. The decision record, design
map, paired maintenance terminology, Korean use-case matrix, and round report record ownership,
scope boundaries, verification, and the remaining unverified live multilingual behavior; no
scanner, registry, state predicate, global gate, or per-document language metadata was added.

## 0.23.14 — 2026-09-07 — Arch validates K before landing commits

Arch now executes the existing Principles capsule-validation contract in the six K-writing
branches that omitted it. Recursive knowledge landings write K, validate the exact selected
knowledge paths, and only then delete their marker and commit; capability-design approvals write
their capability zones and K, validate the exact changed capability paths, and only then commit
and route. Marker deletion and commit now remain downstream of validation instead of consuming
the routing signal first.

The change stays inside Arch's existing effect plans and uses existing validator actions: no
shared semantic gate, retry rule, taxonomy, registry, crawler, central index, or other runtime
owner changed. The shipped paths are the Arch spec, its seven scenario expectations, its focused
effect-order test, the generated receipt, and both plugin manifests; the round report and matrix
record the audit, verification, boundaries, and remaining unverified real-use behavior.

## 0.23.13 — 2026-09-06 — Adopt refutation converges on evidenced progress

Adopt keeps its one complete bounded clean-context refutation, but a correctable current draft no
longer stops merely because it has used one revision. The existing semantic-refutation stage now
corrects every current blocker from returned evidence and current authority, independently rechecks
only returned coordinates, changed targets, and direct consequences, and re-enters judgment while
that causal scope is demonstrably removed or strictly narrowed.

No progress, regression, a reopened failure, an owner-owned decision or authority contradiction, and
missing required draft, source, prior evidence, or clean context remain on the existing blocking exit.
Only current independent verification with preserved initial coverage and no binding dependency can
reach the unchanged proposal and approval boundary. No retry counter, taxonomy, stage, collector,
artifact, template field, Principles rule, or full-pass repetition was added; targeted Skill Rails
verification is recorded in the round report, while independent audit, the canonical full suite,
installation, and fresh-project real use remain for the release gate.

## 0.23.12 — 2026-09-06 — Proposal inputs discover their current K depth

The shared capsule contract now tells a proposal reader to project another input owner's bounded
same-stem K headers before confirmation and to open only depth whose first-line use-when fits the
pending judgment. Arch connects that rule to its Product input, while Design reconnects both Product
and Architecture inputs before proposal and confirmation; their specialized judgments and all writer
boundaries remain unchanged.

The change reuses the existing owner-bounded `project --under` projection and policy-index route. It
adds no hook injection, central index, global scan, state predicate, classifier, registry, stage, or
write authority, and does not change initial Adopt/Product, Direct, Work, Verify, or Resume behavior.
Principles, Arch, and Design were rebuilt for the 0.23.12 manifests. The completion gate now passes root
and P2 package tests to one runner as first-class inputs, while its cached and non-ignored untracked
inventory keeps the reviewed 15-file set independent of staging. Three stale test expectations exposed by
real execution were aligned with current runtime and their Direct, Resume, and Verify receipts were rebuilt
without changing runtime projection. Focused verification is recorded in the round report; the full suite,
installation, and fresh-project real use remain for the release gate.

## 0.23.11 — 2026-09-06 — Current owner knowledge survives planning and execution

The shared owner contract now carries a changed unit's existing K locus through the same confirmation,
write, validation, and commit boundary as its owner document. Product and Design update only their own
Layer 0 K, while Arch retains architecture and managed capability K plus exact marker delegation; Adopt's
all-owner authority remains limited to initial unmanaged reconstruction, and Direct, Work, and Verify never
write K.

Product, Design, and Arch expose bounded current-owner K deltas at their existing approval surfaces. Direct
projects only the K headers needed by the current Layer 0 owner, target capability, and explicit crosscut
owners into a card's exact reads. After a normal task's committed result is integrated and its existing
completion boundary is settled, Work now uses the existing journal marker transport for a sourced reusable
unit, creates nothing when no such unit changed, and returns a source-less late conclusion through Direct.
No new state field, stage, registry, index, classifier, validator, marker family, scan, or cross-stage
transaction was added.

The six affected P2 packages were rebuilt and passed full structural lint, 25-repeat Skill Rails builds,
and focused owner-projection and package-source fixtures. Final preflight exposed a v0.23.9 test-only
drift: the project-state fixture now projects Adopt's separate Layer 0 and capability K writes at their
existing commit boundaries, and its 385-test source suite passes. The full repository suite was not
rerun after that repair; Gate B and entry-system before/after checks are not applicable, while
fresh-model behavior, installation, and real-use execution remain unverified.

## 0.23.10 — 2026-09-06 — Cohesive knowledge lands at one exact current locus

Principles now defines one K by the readers who need its content together and the reason it changes,
so length, headings, and keyword similarity no longer masquerade as split boundaries. Concise direction
still stays in the nearest Product, Architecture, Design, or Capability owner, while independently read
and revised depth remains in that owner's same-stem recursive K tree.

Adopt now carries each knowledge unit from source inventory to one exact owner-document or
planned-K target, exposes that mapping and the Foundation content boundary to its existing clean-context
refutation, and blocks omitted, scattered, or duplicated current landings. Arch uses the owner-bounded
projection to find and refresh an existing K, takes a new number only for a new unit, and preserves
still-valid source basis;
no new stage, document layer, registry, state, marker, classifier, validator, or index was added. Arch's
source fixture now matches its already-current 160-atom obligation ledger instead of the stale count 158.

Principles, Adopt, and Arch were rebuilt and passed full structural lint and their 200-repeat deterministic
evaluations; focused source fixtures and Adopt project simulations also pass. Fresh-model document quality,
the full repository suite, Gate B, installation, and real-use regeneration remain for final verification.

## 0.23.9 — 2026-09-05 — Knowledge follows its semantic owner

Principles now gives every Product, Architecture, Design, and Capability document the same owner-shaped
knowledge rule: concise always-needed knowledge stays in the owner document, reusable depth lives in its
same-stem recursive K tree, and bounded discovery uses `project --under` while `--capability` remains a
shorthand. Commit discipline applies the existing same-commit rule to that owner shape instead of
describing every capsule through a capability path.

Adopt now feeds the shared baseline and knowledge sections already opened during preparation into its
existing clean-context semantic refutation, so a proposed filesystem shape that departs from the canon
blocks before approval. After approval it writes and validates Product-, Architecture-, and Design-owned
K with Layer 0, then capability-owned K with capability documents; no new stage, classifier, registry,
validator, state predicate, or index was added. Principles and Adopt were rebuilt, the existing Adopt
scenario projection follows the corrected effect order, and both plugin manifests ship the repair as
0.23.9; installed-model real use, the full repository suite, and installation remain for final verification.

## 0.23.8 — 2026-09-05 — Cold-writer artifact grammar at its natural owners

Verify's record template now gives a cold writer the one exact repeated-item shape that the
existing failure-routing parser consumes. Direct's task and research card templates likewise state
that every `Read first` item is one bare repository-relative path, closing the same practical
artifact-writing gap without adding a parser, workflow stage, or generic formatting DSL.

The existing migration obligations now project to those three templates, and only Direct and
Verify were rebuilt. Their generated instructions and runtime behavior are otherwise unchanged.
A disposable project passed the full failure-and-repair Gate B through Direct, Work, Resume, a
distinct fresh Verify, and capability closure; both plugin manifests ship the repair as 0.23.8.

## 0.23.7 — 2026-09-05 — Current-evidence Adopt recovery

Project membership now uses only the current checkout's `.devflow` root and current index. It no
longer consults all Git refs or prior history, so shallow history and a linked worktree's sibling ref
cannot divert an explicit first Adopt to `setup.no-product`; a failed index observation remains the
conservative boundary. The state regression, Resume wording, DD-101, and matrix cell 3.24 carry that
single predicate consistently. Empty, partial, and users-only `.devflow` roots remain current
evidence; the abandoned users-only exception was not transferred. Managed current journal bytes are
always validated, while history-derived lifecycle recovery begins only after current HEAD contains
the committed Product boundary. A current Product without that boundary routes as
`setup.layer0-uncommitted`; a missing current Product routes as `setup.no-product` without displacing
DD-92's approved pre-Product research. Product consumes the concurrently reported boundary fact,
even when git or integrity owns the selected route, instead of treating an interrupted Adopt draft as current truth.
Direct consumes the same fact before any request, research, or card effect and returns the owner to Resume.

Adopt now performs one bounded clean-context semantic refutation of the complete draft before
showing its binding proposal. The contract fixes the allowed inputs, excludes the producer transcript
and Arch execution instructions, blocks only load-bearing contradictions or
omissions, permits one revision plus returned-coordinate recheck, and records the result in the
existing Evidence verification section. Adopt reads only Arch's Surface and Required channel columns
and first proposal/ADR paragraph for this purpose. The shared capability baseline also distinguishes Product
`C<n>` identifiers from disk `NN` navigation. DD-102 records the reason; the refutation change does
not move Product or Arch authoring ownership.

The authored Adopt, Direct, Principles, Product, and Resume P2 packages were maintained through bounded installed
Skill Rails transactions and rebuilt into current generated receipts without hand-editing generated
files. Both plugin manifests ship the state tool, tests, decisions, matrix,
P2 contract changes, and the v0.23.7 round report as 0.23.7.

## 0.23.6 — 2026-09-04 — Evidence-bounded repository audit

Devflow's repository-owned Skill Rails semantic audit now fails only when current bytes establish
a reproducible structural or execution-contract violation. Provenance fan-in, duplicate locators,
broad migration projections, and name or wording heuristics remain visible review signals without
dictating skill prose or failing the release. Exact unfinished migration placeholders remain hard
failures. Target density now distinguishes unique atom-to-target edges from raw locator occurrences.

The audit reads the observations actually exported by each `spec.mjs`, so valid JavaScript layout
does not create a second accidental grammar. Its direct fixture suite covers the hard/advisory
boundary, duplicate edges, unresolved provenance, multiline and commented observations, unfinished
placeholders, stable finding counts, and missing package inputs. The root suite verifies all nine
reports and prints every advisory.

The completion gate also exposed one duplicate, unguarded decode of the committed journal in the
Principles state tool. An undecodable `HEAD:.devflow/journal.md` now remains on the existing structured
blocking routes instead of terminating the CLI while capability-closing markers are projected. Three
stale or history-coupled test cases now follow the shipped capability template, DD-97 writer ownership,
and isolated marker lifecycles. This repository-owned script is outside the Skill Rails package seal;
the nine generated packages, runtime, validator, kernel, workflow stages, and user-facing instructions
remain unchanged. Both plugin manifests ship these repository verification repairs as 0.23.6.

## 0.23.5 — 2026-09-04 — Skill Rails v0.3.0 cohort migration

All nine P2 packages now seal Skill Rails validator 0.6.1 and runtime 0.3.3 from the
v0.3.0 package. The generated adapters now direct trace state outside both the installed skill
and the repository or directory tree containing the observed project. Validation also rejects
missing or non-regular `READ_FIRST` targets and specification locators whose segment counts do
not match their groups, while `spec:ROLES/<id>` now resolves normally. Maintenance receipts now
hash all of `references/**` and `templates/**`, so resource-only changes are no longer missed.
Version-5 runtime behavior and the existing kernel and specification versions remain unchanged.

Devflow's repository-owned behavior tests, cohort and policy-pointer invariants, repeated-template
grammar checks, and shared collector boundary remain in place; the migration does not move those
unsupported cross-package guarantees into Skill Rails. The project-state suite also refreshes its
stale Adopt glossary projection assertion from the removed `approval` stage to the current
`adoption` stage and its complete WRITE-template order. Both plugin manifests ship the complete
nine-package cohort as 0.23.5.

## 0.23.4 — 2026-09-04 — failure-route identity and recovery boundary

Direct now preserves a product-root Failure-history request after its layer-opening commit by
matching the active origin to the canonical failure-routing entry, rather than re-parsing a
narrower local path grammar. Verify now lets only recoverable transitions bypass an unavailable
verification layer; a partial write stops closed instead of routing back into the same unchanged
state. No state shape, capability contract, workflow stage, or role policy changed. Skill Rails
rebuilt the Direct and Verify receipts, and both plugin manifests ship the result as 0.23.4.

## 0.23.3 — 2026-09-04 — Work–Verify loop continuity

Work now persists every returned review verdict before yielding, and every completed task
boundary returns through Resume so its canonical selector can choose remaining sibling work,
worktree work, or verification. This removes two reachable stalls without changing review
policy, task decomposition, or the agent's implementation judgment.

Verify failure routing now enters Direct with the exact durable Failure-history locator. Direct
reuses its existing materialization and approval path, keeps the existing `routing prepared`
object recoverable until the one planning commit lands, and then hands approved repair cards to
Work. Verify now recovers that existing transition before choosing a fresh verification layer,
while a missing state kernel still stops closed. Its duplicate stale-freshness self-route was
removed: the existing record predicate now lets a fresh pass replace stale evidence, while current
record and execution gates still prevent stale closure. No new workflow stage, state file, verifier
method, event loop, or personalization framework was added. Skill Rails rebuilt the Direct, Work,
Verify, and Resume projections and receipts; both plugin manifests ship the result as 0.23.3.

## 0.23.2 — 2026-09-03 — Resume purpose at the selector boundary

Resume's selector now leads with its actual state-aware role: it re-enters an existing managed
project from canonical disk state, recovers an interrupted transition, and either reports the
current position or routes to the one stage that owns the next step. Its bounded domain-entry
branch remains able to open one capability document by number or name without taking over that
owner's work.

The selector now also states the shared direct-entry boundary: when a request names another
devflow stage, that stage enters directly. This closes the old catch-all reading of “work in an
existing devflow-managed project” without adding request-specific exclusions. Explicit Resume,
cross-stage routing, managed-project activation, unmanaged read-only termination, state predicates,
route priority, orchestration, and worktree behavior are unchanged. Skill Rails regenerated only
Resume's selector projections and receipts; both plugin manifests ship the result as 0.23.2.

## 0.23.1 — 2026-09-03 — Principles entry without policy loss

Principles now activates from positive current-project devflow intent instead of acting as the
owner of any generic devflow mention. Product no longer points unrelated package-information
questions into Principles, while named Product, Arch, Design, Direct, Work, Verify, Resume, and
Adopt entries still consume the same shared canon through one Principles policy index. The index
owns when common policy is read: always-applicable guidance precedes the first judgment, and only
rows exposed by the request, selected stage, observed inputs, requested judgments, decided values,
or returned effects are added before that judgment or effect. Named stages do not re-enter the
Principles classifier, and verbatim reviewer, verifier,
auditor, and retrospector contracts keep their clean-context boundary.

The managed-project SessionStart hook and Codex fallback now describe that same topology and point
only an actual worker coordinator to its role contract. The hook remains silent without current
`product.md`; project-state, memory formats, stage routes, and role-contract bodies are unchanged.
Repository guards now require all eight named stages to carry the byte-identical shared-index entry
and prohibit direct policy-topic bypasses. The Product and Principles selector projections, all
affected Skill Rails receipts, the hook, Codex adapter and installer messages ship at 0.23.1.

## 0.23.0 — 2026-09-03 — usable stage handoffs and closure

The Product, Arch, Design, Direct, Work, and Verify contracts now preserve the intended stage
flow instead of stopping, bouncing, or leaving binding state dirty at their transition edges.
Product routes confirmed initial planning to Arch and re-planning or glossary-only work through
Resume, using the canonical product and re-run facts rather than a duplicate model judgment. A
confirmed re-run now applies its matching discovery updates and consumes only the addressed re-run
lines in the same binding commit, so Resume cannot reopen the same Product decision. Arch treats
capability-only work as an ordinary compatible Layer 0 refresh so its request
kind can reach capability design. Design and Direct now share one request-recording owner, including
an explicit design-change route, and Direct's projected example preserves the required JSON-string
request shape. Direct distinguishes an uncommitted or precommitted request awaiting Design from the
same request after the canonical `design — design.md` commit, and each such commit confirms only
the oldest maintenance request actually present in its journal snapshot before Direct proceeds to
cards. Explicit withdrawal removes a request-only record or reuses the existing cancellation plan
for its drafts and markers, while Design rejection keeps the request resumable.

Direct shows its execution proposal before asking for approval and, after the approved planning
commit, reports the Work handoff while leaving process assignment to the external coordinator.
Work checkpoints progress on the working branch and then releases a claim in a separate rename-only
binding commit on integration. Verify binds the canonical byte-first ready capability (or an explicit
eligible target), rejects foreign-record fallback, and closes it with an explicit baseline, journal
marker, sweep, folder transition, and Resume route rather than cycling through Arch. If interruption
occurs after the begin commit, Verify reads that marker explicitly from HEAD and resumes only its
remaining closure suffix. The state projection keeps committed closing markers visible from HEAD
through an uncommitted journal deletion and removes them only after the closure commit, preventing a
repeated begin boundary.

All generated adapters now obey the Skill Rails terminal-prefix contract: a final ASK, WAIT, BLOCK,
DONE, or ROUTE stops only after every preceding effect has been processed. This common generator
repair is projected into all nine devflow skills, including unchanged Adopt, Resume, and Principles,
so literal Codex execution cannot discard required REPORT, WRITE, COMMIT, or DISPATCH effects.
The Principles entry contract also describes the shipped runtime adapter accurately instead of
claiming that the platform hook invokes the stage directly.

## 0.22.0 — 2026-09-03 — Direct work direction

The former `split` stage is now `direct` throughout the live system. The package, public skill id,
routes, artifact ownership, planning commit receipt, generated adapters, deploy descriptions, and
current repository checks use one name: `skills/direct`, `devflow:direct`, `ROUTE:direct`,
`external.direct`, and `direct — ...`. No alias, fallback route, duplicate package, or migration
branch remains because the owner confirmed that no project uses the former release.

Direct's purpose now matches the work it already owns: determine planning depth and executable-unit
size, decide which uncertainties need durable research, materialize research or task cards, carry
dependencies, order, parallelism and model tiers, obtain one bundle approval, and hand the approved
units to Work. Work still performs research or implementation, Verify judges results, Resume chooses
the next stage from disk state, and only the external coordinator assigns or supervises agent
processes. The reserved `re-split pending` marker remains the precise card-redecomposition action and
routes to Direct; it is not a compatibility alias.

DD-99 records the atomic vocabulary and boundary. Current design, maintenance, and use-case
instruments use Direct, while historical CHANGELOG entries, rounds, blueprints, migration atoms, and
the old generated-prompt cleanup filename preserve their evidence. The design decision-index heading
was also corrected to require naming moved rows instead of claiming that every change moves none.

## 0.21.0 — 2026-09-03 — purpose-first brownfield adoption

Explicit Adopt now enters the stage the user named and consumes the state tool's
`setup.unmanaged` result directly; Principles remains the classifier for requests that actually
enter Principles. SessionStart, the Codex fallback, and installer guidance carry the same entry
topology. SessionStart now requires `.devflow/project/product.md`; an empty `.devflow/` directory
cannot activate managed-project guidance or change canonical unmanaged state unless Git's index or
history contains devflow evidence. Explicit Adopt accepts maintained pre-devflow material in either
documents or code; only a repository with no such material routes to Product.

The canonical target-project root is now `.devflow/`. SessionStart, state and knowledge tools,
Git pathspecs, journal and task-card coordinates, and all nine skills read and write that one
spelling. The skill namespace, plugin name, and wire schemas remain `devflow`; historical release
records and migration atoms retain their original paths. Because the owner confirmed there are no
managed projects to migrate and test projects will be recreated, this is a hard cut with no alias,
dual-root state, or migration code. Split's description now names both task decomposition and
execution planning; its lifecycle semantics are unchanged.
One pre-existing malformed quote escape in Split's project-research source fixture was corrected
while that fixture's canonical path was moved; no runtime branch was added.

Adopt now performs one evidence-led reconstruction instead of asking the model to self-report a
sequence of phase statuses. It inventories every maintained code and documentary source with an
explicit disposition, traces one executable flow per code-backed capability candidate, derives
document-backed capability evidence where no executable flow exists, reconciles claims, and proposes
Product, Architecture, applicable Design, code style, glossary,
capability design zones, and every owner-adjacent K node needed for durable domain knowledge. Zero
K nodes requires evidence that all maintained domain material already lands completely in an
always-read owner. Only irreducible decisions and contradictions become owner questions. One
binding confirmation precedes all writes; refusal writes nothing; approval commits the complete
Layer 0 and optional maintenance-routing record first as `adopt — layer 0`, with `product.md`
written last, then writes capability documents using that commit as their canonical Design head,
writes and validates every K node beside its owner, and commits both as `adopt — capabilities`.
Before the Product write an interruption remains unmanaged. A post-Product pre-commit diff is an
unverified owner-directed Git recovery boundary; after the first commit and before second-boundary
writes, the existing missing-baseline route recovers through Resume to Arch. A documentation-
only project records `Brownfield: no`; `yes` means executable implementation predated adoption. Adopt
then stops without asking whether to run Product or choosing a later stage. Filename proxies,
code-presence-as-flow, pseudo artifact paths, and the
post-adoption route selector were removed.

Document authority is reconstructed from content status and corroborating implementation, test,
operational, path, Git-history, and modification-time evidence. Names, folders, and timestamps guide
inspection but never decide truth alone. Evidence-resolvable disagreement is synthesized with
provenance; genuinely undecidable current intent is presented to the owner with the conflicting
coordinates and exact decision needed.

Managed design markers and legacy/design-refresh baselines now route to Arch regardless of the
historical Brownfield field, so they cannot cycle through Adopt. Already committed exact
`writer=adopt` knowledge markers retain that value as legacy provenance, while Arch consumes both
legacy `adopt` and current `arch` markers and Work produces only `writer=arch`. Compatible feedback
for architecture and capability owners now always lands through Arch because its payload declares
an owner, not a writer. Canonical state keeps a knowledge marker's declared writer rather than
recomputing it from Brownfield, while Arch consumes either valid legacy or current provenance so
mixed sets cannot loop.

Current lifecycle wording now matches that boundary: Arch is the sole managed knowledge writer;
Adopt remains only as initial unmanaged provenance. Resume and compatible-feedback guidance name
current semantic consumers rather than treating legacy `writer=adopt` provenance as a live route.
DD-97 records the ownership correction and the rejection of an Adopt-local trace workaround;
project-local trace placement remains an upstream Skill Rails observation. Package-local Skill
Rails maintain/build checks cover the changed P2 projections. The broad repository suite and new
installed Codex/Claude behavior remain unverified for the owner's direct branch test rather than
being reported as passed.

## 0.20.0 — 2026-08-30 — one state owner, orthogonal trees, and authored portable packages

The release makes the accepted redesign explicit: principles entry is state-free and reaches
resume by one route; `scripts/session-start.js` supplies delayed guidance without judging or
injecting state. SessionStart stays silent in repositories with no current devflow evidence,
while explicit Product/Adopt invocation and managed-project entry remain available. Knowledge and
work use orthogonal trees: pre-product research persists under `00-project`, card/source evidence
keeps exact provenance, conclusions land with their semantic owners, only Arch or Adopt writes
`K`, and multi-owner landings preserve every owner. P2 packages use English `spec.mjs` and
`body.md` as authored behavior and judgment, generate `SKILL.md` plus receipts, and retain Korean
legacy atoms only as migration provenance. Final all-nine receipts identify Skill Rails runtime
`0.3.2` and validator `0.4.2`; the earlier `0.3.1`/`0.4.1` rebuild was an intermediate trail.
Principles retains public `--target`, with portable root-bounded paths and fixture `UNKNOWN` kept
distinct from live `unknown()`.
Compatibility: `## Capabilities` in `devflow/project/product.md` must contain canonical
`C<n> <name>` rows (or the supported legacy circled / `1.` forms), or the single line
`None.`. A section with substantive content but no recognized row now stops at
`integrity.blocking` with `capability-rows-unparsed` instead of disappearing. Adopt projects
Product's complete confirmed field map and byte-identical template for both the state parser and
later Product entry. Product also owns the exact `<term>: <definition>` glossary template;
Adopt and Arch project it byte-identically and bind existing glossary WRITEs to it. No runtime
cross-skill import, registry, parser, state zone, or knowledge-owner route was added.
On 2026-09-01, Work's post-title boundary repair replaced the evidence-blind
`boundary-incomplete` BLOCK with a COMMIT-only RESTRICT while completion or review remains
unsettled. Existing boundary commits add a missing carry once (`late-carry`) or preserve one
(`late-anchor`) before claim→done; non-none, unjudged, and UNKNOWN feedback remains blocked.
The last valid carry-kind line cannot be retracted by a later review or signal. A fully consumed
compatible set closes through that same boundary vehicle. Authored owners are Work's spec/body
and Principles' state/delivery canon, with generated projections and focused tests following.
On 2026-09-01, the activation gate stopped a globally installed devflow from framing ordinary
repositories that never opted in. The state tool proves `setup.unmanaged` only from absent current,
indexed, and historical evidence, validates integration branches with `git check-ref-format`, and
routes `integration-not-a-ref` to `setup.integration-config`. Resume returns unmanaged DONE with
no ASK, route, or write; DD-95 records the boundary.
On 2026-09-01, compatible reusable Work feedback gained a durable card-boundary transport instead
of disappearing at closure or being diverted into K, carry, HANDOFF, or a new note layer.
`compatible feedback pending: payload-json:` records the semantic owner, card@full-oid source,
and ordered target/Background/Why/Conclusion/implication coordinates. Work proposes the complete
current-card set; the Principles state tool validates Git history; Resume routes one sealed owner
to Product, Design, Arch, or Adopt; each owner writes first and then atomically consumes one
byte-identical marker while residual owners remain. DD-96 records this boundary.

On 2026-09-02, the compatible-feedback lifecycle was closed at its actual termination boundary.
The first wholly acceptable journal after-state—canonical payloads, one source, one owner/card,
and existing owner paths—seals the complete exact-payload set. Malformed, mixed-source,
owner-absent, and unattributable drafts remain unsealed and correctable. Reintroduced members,
new same-card payloads/OIDs, and coordinate paraphrases become blocking findings with no new
route. Work compares collected target/lifecycle facts with actor-computed judged pending/eligible
summaries and blocks partial, reordered, empty, duplicate, mixed-source, or foreign-card
proposals before WRITE. Established lifecycles require judged `settled` plus an empty eligible
set. Verify opens only after every sealed member is consumed.

On 2026-09-02, repair `c28facc1b9707f06234a32426f9b51a695bad053` also closed the
integration-behind edge of that lifecycle. The configured integration tip remains the sole
compatible-feedback authority; a lagging user-managed worktree now reaches the existing
`integrity.blocking` route with reason `compatible-feedback-integration-behind` and resolution
`update-current-branch-from-integration`. A competing committed or uncommitted local compatible
transition makes the local lifecycle fact `invalid` without unioning it into integration truth.
Bounded editor evidence is fifth scene 1/1, all linked-worktree scenes 5/5, affected state cases
22/22, and direct Work seams 4/4. Independent Fable evidence is PASS with current scenes 5/5 and
the parent fifth scene 0/1. The uncommitted-local, update-to-overlay, and merge-commit-entry probes,
plus the non-canonical direct Product/Design entry residual, remain UNVERIFIED rather than passed.

The deploy surface for this release is the existing `skills/**`, `scripts/**`, `codex/**`,
`hooks/**`, `.claude-plugin/plugin.json`, and `.codex-plugin/plugin.json`; detailed current-byte
evidence and limitations live in `docs/rounds/v0.20.0/report_ko.md`. Fresh affected evidence
includes all-nine receipt identity (615 entries, zero mismatch), a 19-case Work predicate probe,
17/17 Work seams, 17/17 compatible-history cases, and 12/12 decision-index tests. The final
wildcard root suite and Gate A pass 498/498 on the final candidate bytes. One hand Gate B, frozen
clean baseline/candidate comparison, official install and byte match, candidate commit, and push
remain UNVERIFIED. Tested runtime bytes must equal shipped runtime bytes; later identifier-only
evidence must not mutate deploy/runtime bytes.
Gate A keeps the same parser and read-only assertions but uses a 60-second finite harness bound:
its isolated 35/35 run completed in 28.5 seconds while the loaded wildcard suite crossed the old
30-second bound by 42 milliseconds and cancelled only its derivative child cases.

Resume recovery now projects the existing DD-26 folder-boundary rule: change no code, rename
closing non-capability folders deepest-first to `.done`, and make one boundary commit. Split intake
now records confirmed-product tree work with no durable request or active origin as the canonical
`maintenance routing pending` line before rejudging, so request identity survives interruption.

## 0.18.9 — 2026-08-21 — the first real run found two walls, and two gates now stand where they were

0.18.8 shipped and the first real-use test ran: two sessions, the same request, the same user
answers, different models, with a conductor answering as the user and recording everything.
Both sessions stopped — at opposite ends of the loop. Session A never wrote a line of product
code; session B wrote 81 commits and never closed a single capability. Twenty-six releases had
passed without one project completing a cycle, and this is the first record of what actually
happens.

**Wall one: a new project could not start.** The canon assigns capabilities the numbers `02`,
`03`, … and tells split to write those numbers as a layer-opening marker's `children`. The
parser required at least one dot, so the line the canon asks for could never parse — item 12
blocked routing and every tree write, and the recovery clause the canon prescribes had no
valid replacement to offer. Session A's own words: *following the canonical form exactly is
what stopped it.* The `children` capture now uses `FOLDER_NUMBER`, which already existed;
`re-split pending`'s `stale` field keeps the card grammar, because the canon narrows that
field to direct-child task cards.

**Wall two: a capability could not close.** Bias removal requires a clean session to run the
verification, and that session could not acquire the browser channel the main session had
already driven successfully. A tool failure was handled as a product failure, so cards
multiplied and the state tool then offered the impossible card as `ready=true blockers=[]`.
Two changes answer it. `verify` gains one `unverified` reason — a channel that could not be
acquired before a single scenario step ran goes to the person from the first occurrence, not
after a recurrence, and the reason carries the exact failing command and its timeout so a
product defect cannot be filed as a tool failure. And `arch` now confirms the verifier's
channel by running it once in a clean context, with the exact command and its exit code
recorded in the channel line — a channel that runs only in the current session is not decided.

**Two gates now sit in the completion gate, because "green tests" had said nothing.** All 272
tests passed while a new project could not start; those tests only ever ran the tool against
fixtures its own authors wrote. Gate A feeds every canonical reserved journal line to the
deployed parser — fifteen valid forms plus thirteen deliberately broken ones, so the gate
itself is checked, and two lid locks tie the table to `RESERVED_JOURNAL_HEADS` and to the
canon's format block by headword rather than line number. Gate B carries one capability
through split → work → verify → closure in a real project, by hand, once per release that
changes the verification contract; automating it would rebuild the very harness this round is
treating.

**Gate B found four more defects on its first run, and all four were live under 301 green
tests.** Integrity item 5 searched only task cards, so a HANDOFF pointing at a waiting
capability file always resolved to zero. The prepared-route prefix compared a normalized read
against a raw payload, so on the Git-for-Windows default (`core.autocrlf`) a payload built
from real file content could never match — upper-document feedback was blocked for every
Windows user. The locator resolved only against the working tree where the canon says to
resolve against the prepared object's `base` commit, which fires only when a closed capability
is reopened. And `arch`'s channel confirmation could probe one surface while recording
another, so the confirmation this release added could be satisfied vacuously.

Two prose conflicts were converged rather than reasoned about: the capability-document heading
order now states one order, and the `slug` word left the filename rule that another line
forbids normalizing. Leaving a card to insert a research prerequisite now returns the original
card's `Approval` to `pending`, matching the rule split already carried.

This release removes no bytes. Its product is not subtraction but the two gates that make
subtraction safe; the subtraction round is next, and the reason it waits is recorded in
DR-44. The reasons for the two new decisions live in `docs/rounds/v0.18.9/report_ko.md`
rather than the decision index — the index sits 81 bytes below a fixed budget, and the test
that guards it forbids raising it again to fit one more row.

## 0.18.8 — 2026-08-21 — the tool meets the writers it had never met

0.18.7 moved the entry-state calculation out of prose and into a read-only tool, and that
direction held under two independent reviews. What had not happened was a meeting: the tool
had only ever been run against fixtures it wrote itself. It had never read a person's prose,
an older session's document, or the output skeleton this canon's own `product` skill prints.
Every defect below sits on that unmet boundary.

The measurement that reframed the round: in the two real projects that keep a journal, all
98 blocking integrity reports were notes a person had typed by hand, and the accident item 12
guards — a reserved headword in a broken format — had happened zero times. Machine ownership
of every line had locked people out of a file they use as a notebook, and both projects could
no longer enter devflow at all.

**The canonical timestamp now divides journal ownership line by line.** A line the machine
owns carries one of two marks: the canonical timestamp, or a reserved headword leading the
line. Every other line is the person's — it enters no judgment and stays as it stands. A
reserved headword in a broken format still stops entry, with or without the timestamp before
it, so the accident the check exists for is still caught. The predicate now reads the same in
all three places that state it: the canonical journal-format paragraph, integrity item 12,
and the tool.

**Heading comparison became one function, and silence became a report.** `normalizedHeading`
strips a trailing HTML comment and surrounding space before comparing, and `parseProduct`,
`extractSection`, and the locator count all use it — the canon's own skeleton line
`## Capabilities        <!-- … -->` was unreadable to the parser that the same release
shipped. An arbitrary suffix such as `## Capabilities (draft)` is still refused, because
widening that far replaces the grammar rather than repairing a defect; what changed is that
the refusal now says so. A product file whose canonical heading cannot be found reports
`integrity: kind=shape … detail=capabilities-heading-missing` instead of continuing with zero
capabilities and no anomaly.

**Prose in the capability list stopped becoming a capability, without silencing the authors.**
A sentence like `**①② are the MVP.**` is prose because two circled numerals sit next to each
other, not because it is bold — so the leading decoration class keeps `*`, and the real
authoring form `- **① Name** — …` that a live project uses is read as it always should have
been. A number that resolves twice reports `duplicate-capability-number`, which is what let a
silent overwrite pass with `anomalies=0`.

**`none` is a value, not a path.** The canonical "no next step" value in HANDOFF was resolved
as a path, producing both a false advisory and the staleness that makes `resume` distrust the
handoff. It is filtered before resolution now.

**Compact emits every item again.** The budget ladder is three tiers in this repository — full,
then per-item shortening that keeps every entry, then zero entries plus the filters to narrow
by — and the state tool had implemented the first and third while making the second drop
entries wholesale. One real project reported 82 blocking anomalies and printed not one of
them, in 1,306 of 24,576 bytes, while `resume` is told to present that line's verbatim text.
Long fields are now bounded and marked, and every entry is emitted.

**Four tests were pinning the defects as the contract.** One asserted that compact must *not*
emit `open-item:` under the name "without truncation"; another fixed the inert `--card` as the
documented remedy; a producer fixture wrote a clean heading the real producer never writes.
Fixtures were made red against the canon first and then turned green, and the run went from
263 tests to 272.

Also: `resume` no longer promises that every shape anomaly heals at the next capability
closure — only a zone inside a capability document does, and a path outside it is repaired by
the stage that writes that document. `split` and `work` no longer instruct a reader to pass
`--card`, which reaches no projection. `baseline-predicates` no longer names `resume` as a
direct reader of the whole canon.

Deliberately not in this release, with reasons recorded in `docs/rounds/v0.18.8/report_ko.md`:
deleting `state-predicates` and the ten integrity items whose judgment the tool now owns —
four coordinates cite those items by number and mixing deletion with seven repairs would hide
which change broke what; `verification-predicates`, whose prose still requires a tool output
that does not exist; and three further places where the canon assumes a tool behavior the tool
does not implement.

## 0.18.7 — 2026-08-20 — the entry stops computing the state and calls a tool that owns it

A new session used to pay 137,514 B of canon before it read one character of the project it
was resuming. Most of that was not a rule asking for the model's judgment; it was a
computation whose truth is settled by disk and Git alone, written out literally so the model
would run it by hand — split that output on NUL, run the same pipe inside `cmd /d /s /c`,
never drop `--no-renames`. Classifying all 295 canon lines put 221 of them in that class, and
of resume's 48 routing rows exactly one read the conversation. A model executing a git
plumbing recipe by hand is the expensive way to be wrong quietly: a mis-split output does not
raise an error, it just routes somewhere else.

`skills/principles/scripts/project-state.mjs` now owns that computation. It is read-only and
stateless — it writes no file, runs no fetch or push, and repairs nothing it finds. One call,
`state`, plus two filters (`--capability`, `--card`). Its output is one sheet: fourteen zones
in priority order, and **an empty zone still prints its line**, so "nothing is pending here"
is visible without a second call and there is no separate explain mode. The closing `next:`
names the first zone that is not empty and its kind, and the prose says outright that this is
a summary derived from the facts and not a contract — every ingredient of the judgment is on
the same screen, so a session that disagrees can say why from what it already has.

The tool sits beside the canon on purpose. It is reached by `../principles/scripts/…`, the
same relative rule that reaches `../principles/SKILL.md`, so it needs no `<plugin root>`
placeholder at all — 0.18.6 spent a whole release removing the defect class where a session
meets a placeholder before it can read the rule that resolves it, and putting the new tool
outside `skills/` would have recreated it at a new site. Beside the canon it also travels with
the canon on every install channel.

`resume` became a caller. Its file went from 30,477 B to 21,713 B, the seven-step bounded read
became three things opened on top of the sheet (the one claimed card this invocation
continues, the canonical range the matched row names, and capsules), and the 48-row condition
column became fifty-two `next:` names against the same action text. `verify`, `work`, `split`,
`arch`, and `adopt` all open with the same sentence now and differ only in which zones they
read. `state-predicates.md` and `verification-predicates.md` lost their last runtime reader;
both files stay this release and are deleted in the next, so that a session upgrading across
one version never meets a judgment with no executor. Two rules those files carried that a
*writer* needs — the collision-free event key and the legacy record's event-section
preparation — moved into `verify`, where the writing happens.

What did not move: the `cmd /d /s /c` binary-pipe boundary is preserved verbatim inside the
tool, and a changed executor is not a claim that the boundary became unnecessary (DD-39).
Integrity items still report and never auto-correct (DD-11). Sentences said to a person are
still assembled by prose, not the tool (DD-16).

The measured entry to the approval report is **22,892–22,977 B, down 83.3%** from 137,514.
The design estimated 18,066 B and 86.9%; the implementation came in above it and the estimate
was not defended by cutting sentences — five facts the tests caught being dropped were put
back instead. `docs/rounds/v0.18.7/report_ko.md` carries the block-level accounting of
where the two diverge, and the two numbers that matter to a reader: a session that answers a
status, domain, or tweak question and stops saves the whole 83%, while a session that goes on
to `work` saves about 28% because `principles` is still read in full there. The only real
usage record points at the second kind.

Adversarial verification before release caught the tool reading a syntax the canon does not
write — `## Failure history` as a heading where the canon keeps `Failure history:` as an
ordinary field — so on a real record the source-id migration never appeared and integrity item
14 never checked duplicate source ids, with the tests green because the fixtures modelled the
same wrong syntax. The parser now follows the canon; `audit requested` and `retrospective
requested` journal lines reach the evaluator instead of being parsed and dropped; integrity
items 8, 12, 13 and 14 run their full predicates; `01-foundation` closes as a folder boundary,
not a capability; and non-blocking items 1–11 print as `kind=advisory` and never route, leaving
`integrity.shape` its verified-zone meaning — one more kind, eleven more bytes per sheet.

127 new tests cover the tool against real temporary Git repositories, thirteen of them
adversarial fixtures made to fail before the repair. The suite is 263 and passes.

## 0.18.6 — 2026-08-20 — every capsule-tool call carries the rule that resolves it, and two journal kinds stop having two dispositions

Two repairs where the skill text sent a literal reader somewhere the canon did not mean.

Every site that calls the capsule tool now resolves `<plugin root>` itself. `resume` and
`verify` open by running `node <plugin root>/scripts/project-knowledge.mjs presence`, and the
rule that turns that placeholder into a path — two levels above the loaded file,
`${CLAUDE_PLUGIN_ROOT}` as the same place where a runtime sets it — lived in
`baseline-predicates.md`, the very file whose read range that command decides. The session met
the placeholder before it could read the rule, and a model that meets a placeholder guesses
rather than stops. A guess that misses is silent: the tool never runs, or runs from the wrong
root, and a project with capsules on disk reads as capsule-less, losing 11 KB of canon it
needed. `split` and `work` call the same tool for the header projection and never read that
canon at all — `split` pointed at the rule it could not reach, and `work` had no pointer
either — so the same guess sits there, and what it loses is quieter still: no capsule path
reaches `Read first`, no body is opened, and the card runs on as though the capability had no
capsule. All eight files now carry the same two resolution sentences, in the same words, and
each names its own exit for a tool it cannot reach: the entry gate takes the every-other-output
branch, which is the full read; `split` puts no capsule path on `Read first`; `work` opens no
capsule body. Each exit is the canonical disposition already fixed by
`baseline-predicates.md`, restated where the judgment happens. Fail-closed is unchanged; what
changed is that it now also covers the model reaching the wrong path instead of only the tool
exiting nonzero. `baseline-predicates.md` stays the canonical owner of where the capsule tool
lives, and `split`'s pointer to that rule is gone, since a pointer plus a restatement is two
places for one fact.

The blockade paragraph now gives every canonical journal kind exactly one disposition. Its
continuing side folded four kinds under "journal appends that mint no number and make no
claim", and a literal reader could run that fold as a predicate and derive a fifth member:
`re-split pending` mints no number and makes no claim. But the Document Hierarchy procedure
lands that marker in one binding-decision commit with the upper-document edit that caused it,
and a binding decision waits during a blockade — so the same document answered continue and
wait, and a blockaded session that did either could say it followed the canon. DD-62 already
settled it ("the allowance is an exact enumeration"), so the fold is now written as the closed
set it always was, and the two kinds that sat in neither list — `re-split pending` and
`capability closing` — are named on the waiting side with the commit each one rides. This is
the same defect class the 0.14.0 audit found in this paragraph when the final task commit sat
in neither list, and the paragraph's own promise, "nothing waits unnamed", is what it breaks.
Two test assertions now hold it: every canonical journal kind appears in that paragraph, and
the continuing side stays a closed four rather than a predicate. The Korean waiting list also
stops calling the audit-requested and retrospective-requested kinds by their English names,
since the same file's format block writes them in Korean — a Korean session could not match
its own line by name.

Tests go from 134 to 135. One new case walks every `<plugin root>` call site and fails on a
caller that does not resolve the placeholder or does not name its exit — including a caller
added later that is missing from the table.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`;
`skills/principles/SKILL{,_ko}.md`; `skills/resume/SKILL{,_ko}.md`;
`skills/verify/SKILL{,_ko}.md`; `skills/split/SKILL{,_ko}.md`;
`skills/work/SKILL{,_ko}.md`; `scripts/repository-invariants.test.js`;
`docs/design-backlog{,_ko}.md`; `docs/usecase-matrix_ko.md`.

## 0.18.5 — 2026-08-20 — a project with no capsule stops paying for the capsule contract, and README becomes a line the AI does not cross

One conditional read, and one boundary drawn where a repeated instruction had no decision to stand on.

The entry read is now conditional in exactly one place. `resume` and `verify` run
`project-knowledge.mjs presence` before they read the capability knowledge baseline predicates.
On the single answer `capsuleArtifacts=absent` they read that canon with the range from
`## Domain knowledge capsules` up to but not including `## Metadata and freshness` left out;
on `present`, on `unknown`, and on a nonzero exit they read what they read before. Measured
end to end on fixtures, resume's entry falls from 147,921 B to 136,896 B where no capsule
exists and rises to 148,187 B where one does — a ceiling of 11,025 B, 7.45%. Not one byte of
canon moved and no document was added. `presence` is a new body-free subcommand rather than
the existing `project` count, because `project` walks past a folder whose name misses the
capability pattern and answers `capsules=0` over a capsule that is sitting on disk — the
v0.18.4 defect, still reproducible, now covered by a test. It reads HEAD as well as the
working tree, so a capsule committed on the integration branch and a capsule deleted here both
read as present, and every uncertainty answers `unknown`. Seven tests hold the gate: the
boundary headings exist exactly once in both languages, ten capability-document rules a
capsule-less project still executes are proven to sit outside the range, and all four entry
sentences name the same boundary the canon carries.

README is now a boundary rather than a file that happens to be missing. DD-79 draws the line:
README is a person's document and lives outside the AI's read set — what skills, tools, and
procedures reach is `skills/`, `scripts/`, `hooks/`, `codex/`, `docs/`, and the manifests, and
README is beyond that edge, not read, not updated, not used as grounds for a judgment. The
line holds after README returns, because what returns is the file and not the wiring. The
owner had given this instruction before and the wiring grew back for want of a decision to
record it, so all three directions were swept and cut: the canon no longer hands the
two-terminals-on-one-card risk to a "README guideline" and the `coordinator` contract no
longer lists README among the pointers that find it (its sentence already carried the reason
and the owner, so only the pointer went); maintenance protocol §6 no longer teaches an AI to
edit README prose and now states that the protocol holds no procedure for it; the test
assertions that read README content are gone, and with them the Korean allowance they carried,
so English deploy artifacts now permit zero Korean lines with no exception. `README.md` and
`README_ko.md` are deleted and git keeps the last version. One cost is recorded rather than
hidden: the canon of what devflow declares it does not guard sits outside this line and stays
the owner's.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `skills/resume/SKILL{,_ko}.md`;
`skills/verify/SKILL{,_ko}.md`; `skills/principles/SKILL{,_ko}.md`;
`skills/principles/coordinator{,_ko}.md`; `scripts/project-knowledge.mjs`;
`scripts/project-knowledge.test.js`; `scripts/repository-invariants.test.js`;
`scripts/session-start.test.js`; `README.md`; `README_ko.md`; `AGENTS.md`;
`docs/design{,_ko}.md`; `docs/design-decisions{,_ko}.md`; `docs/design-backlog{,_ko}.md`;
`docs/maintenance-protocol{,_ko}.md`; `docs/usecase-matrix_ko.md`.

## 0.18.4 — 2026-08-20 — a capability keeps its own name, one capability's index stands alone, and seven reports speak to the person reading them

Four defects, each reproduced on a fixture before and after the repair.

The canon takes a capability document's filename from the product.md capability name unchanged
and invents no separate slug normalization, and the capsule folder carries that filename. The
tool required that folder to be ASCII lowercase letters, digits, and hyphens, and the global
walk skipped a folder that did not match with no error at all. In a project whose capability
names are not ASCII, split writes `02-<name>`, the baseline author writes `02-<name>.md` and
`02-<name>/K-001-settlement.md`, and the next session's canonical call `project --capability 2`
answered `capsules=0` and exit 0. The session saw no error and continued as though the
capability had no capsule, while the knowledge sat on disk reaching nothing. The parent-folder
rule is now only "a positive integer before the first hyphen, and something after it"; the rest
of the name keeps its own bytes, and capability selection still reads only that leading number.
`K-NNN-<topic>.md` is unchanged — that is the capsule file's own name and its ASCII contract
still holds.

`--capability` filtered after parsing. `project --capability 2` parsed every capability's
capsules first and threw on the first malformed one anywhere, so a single stale `Source basis`
coordinate in an untouched capability 09 emptied capability 02's index — and because the canon
fixes this tool as the only means of projection and selection, no hand route was left. The
filter now narrows the folder walk before one file is read, for `project` and `disputes`.
Argument-less `validate` still walks every folder, and that is where a global format defect is
caught. `select --path` already validated exact paths only, and that boundary is unchanged.

Seven report strings reached the person in devflow's own vocabulary. resume's report said
"under the same matched row" about a routing table its reader has never seen; work reported
`baseline missing: <number>` and `legacy baseline: migration pending`; verify reported
`baseline no-op`, `registered consumers`, and `repair lineage cannot be determined`. Four are
rewritten so a first-time reader knows what happened and what follows. Three keep their literal
head and gain plain words after it, because something else reads that head: `baseline no-op:`
is quoted by name inside the canonical `registered consumers: unknown — provider baseline
no-op: <same reason>` line, `registered consumers:` is fixed by the baseline canon, and
`fresh|hypothesis|missing` is the canonical status notation other consumers judge on.

Files: `scripts/project-knowledge.mjs`, `scripts/project-knowledge.test.js`,
`scripts/repository-invariants.test.js`, `skills/resume/SKILL{,_ko}.md`,
`skills/work/SKILL{,_ko}.md`, `skills/verify/SKILL{,_ko}.md`, both plugin manifests.

And `select` dropped the date the index promises. 0.18.3 made the index emit each capsule's
last-changed commit date as `changed`, but `select` — the command that shows candidates when
the opening budget is exceeded and asks the person to narrow — projected them without it, so
every candidate read `changed: null` at exactly the moment "open the one that changed
yesterday" would decide. It now reads the same dates from the same single `git log` call.

## 0.18.3 — 2026-08-20 — the index carries the date it already knows, and four rules stop being said twice

Verification after 0.18.2 shipped found two places where the deployed text promised
something the deployed tool did not do. The canon numbers the foundation `01` and the first
capability `02`, and the capsule folder carries that exact string — but the tool rejected
`--capability 02` as "not a positive integer", so the canonical call named in five skills
failed on the number a session actually holds. It now accepts the zero-padded form and a
test pins `2`/`02`/`002` accepted and `0`/`00`/`abc` rejected. And the canon told the session
to run `git log -1 --format=%ad --date=short` beside each capsule's first two lines, but
nothing delivered it. The index now emits that date as `changed` — one `git log` covers every
capsule at once, the compact projection keeps it because choosing reads it, and no header
field is authored, so nothing drifts. This is not a freshness verdict: a capsule can sit
still while the code it describes moves, and this date does not see that.

Four rules that were said in two places now live in one. product defers the dependent-question
rule to the planning evidence canon; resume's boundary-damage row keeps its trigger and points
at the canonical recovery section; arch and adopt drop their restatement of the baseline
authoring contract while keeping the capsule steps, the expected set, and the input derivation;
and verify and resume no longer read the two worked capsules, which only capsule authors need.
The worked capsules themselves are untouched — they are the only contract the capsule form has,
and arch and adopt still read them whole. Measured per-entry fixed input: resume −5,438 B,
verify −4,744 B, arch −1,618 B, adopt −1,579 B, product −197 B.

A measurement decided one thing by not doing it. The largest single load is
`principles/SKILL.md` at 67,205 B, read whole by all eight entry skills, and splitting it by
consumer is a standing backlog item that DR-44 put on hold because "a rule work needs, sitting
under a verify-only heading, disappears with no error." Mapping all 21 sections against the
eight skills, four role contracts, and the hook measured that 46,593 B of it is executed by
every skill, and that every low-consumer section is coupled to a universal one — read Identity
without Commit Discipline and a session mints a commit subject with no room id; read the
journal formats without the Integrity Check and a malformed line passes silently. DR-44's
recorded reason moves from asserted to measured, and the canon stays whole.

## 0.18.2 — 2026-08-20 — a document speaks only of the present, and what is updated overwrites the concept's place

One canonical file contradicted itself across 55 lines. `skills/principles/SKILL.md:390` said
"add a successor record instead of editing or deleting"; `:445-447` said "modification means
replacement by default: if you added a line, check whether you deleted the stale one. A document
that only grows is a dead document." The first governed the record layer and the second governed
documents, and a literally executing session kept that distinction exactly — documents did not
grow and the record folder grew forever. The cost was measured: a session that opened one
discarded decision file reported it as current, because the sentences were firm, the grounds and
the dropped alternative were both attached, and the fact that it was void lived only inside
another file's `supersedes` array. Building the same material in four shapes and scoring all four
on the same 13 questions separated nothing — every shape scored 9/13, and re-verification of
already-proven experiments fell to zero in all four. What separated them was one thing: whether
something dead was still lying in the documents.

This release replaces the planning record layer with one law (DD-77). When the same concept is
updated, that concept's place is overwritten — the concept, not the file. Four conditions bound
it: only what can be recomputed is overwritten, so execution results, observations, and human
confirmations land first in the place that document keeps them, which the discovery→update table
already routes; update versus discard is decided by asking whether a person reading the old
sentence would now take a wrong action; brownfield adoption overwrites nothing and writes anew
only what code confirmed; and "one fact, one durable home" becomes the law's precondition. The
dropped direction and its reason are present fact, not history, and live beside the conclusion
they lost to. Git carries past versions, and the overwriting commit's subject names the concept.

Three accumulating sites are gone. The planning record layer (DD-74, DD-75) and its
`scripts/project-records.mjs` are deleted — six producers now overwrite the owning document's
place instead of minting a successor file, and the root templates already carried "the reason
beside the conclusion" (`arch.md`'s ✔/✘ plus one-line grounds, `product.md`'s dropped
approaches), so no new section was added to them. The ADR succession practice is gone — a
reversed ADR is overwritten in place with a one-line dropped direction, and existing `ADR-NNN.md`
files are never deleted. The capsule `retired` tombstone is gone, and with it the `state` field.

Domain knowledge capsules keep their budgets and their four provenance heads, and their form
gets lighter (DD-76 partly corrected). The one-line `knowledge:` JSON header becomes two prose
lines — `# <what it is> · <when to open it>` and `about: <the words a searcher would use>` —
because the capability number and topic are already in the path, and `facet` had zero skill
consumers. The five fixed body anchors become four place names that apply only when they apply
(`## Concept model`, `## Decisions`, `## Reproducible scene`, `## Unknowns`) with no checker;
two worked capsules now carry the form contract in their place. `Source basis:` and its
coordinate validation stay, because unmarked is the default and that line is what grounds it.
The reaching procedure now reports each sibling's last-changed commit date from git rather than
a header field, which costs nothing to author and cannot drift.

Wired through `skills/principles/{SKILL,baseline-predicates,planning-evidence}{,_ko}.md`, the
product, arch, design, adopt, split, work, resume, and verify pairs, and
`scripts/project-knowledge.mjs` with its tests. The `Execution-check (spike) approval, five
elements` and `Secrets and bulk` disciplines, which had been sitting inside the deleted section
without depending on it, moved into `## Isolated Research` where they are read at the moment of
judgment. DD-28's "not through a new document layer" returns to its original position.

## 0.18.1 — 2026-08-18 — domain knowledge that overflows a capability document lives in capsules, and processing no longer trades accuracy for confidence

A real brownfield capability's domain source ran to 3,699 lines against a 185-line capability
document. Two processed artifacts were built and comprehension measured across three arms
(processed A, processed B, source control C, the same 13 questions). Direction survived
processing — all three arms rejected the same wrong directions for the same reasons — but the
processing produced confidence, not accuracy: a contradiction in the source was pushed to one
side and written as settled fact, synthesized sentences were indistinguishable from quoted
ones, and the control group's honest not-knowing was the more accurate answer. This release
adds domain knowledge capsules (DD-76). A capability document stays the always-read map and
gains an `## Intent` overview — the unconditional reach point for capability-wide intent —
while overflow moves into `capabilities/NN-name/K-NNN-topic.md` capsules under the same
number, selected by projecting their one-line `knowledge:` header and opened only on demand.
Authoring is soft-capped at 120 lines per capsule with over-cap reporting; opening is
hard-capped at 240 lines / 24 KiB per card, whose only exit is explicit approval. Provenance
marking defaults to unmarked — an unmarked body sentence is source, an unmarked Intent
sentence is synthesis — and four closed ASCII heads mark only the exceptions: `synthesis` and
`code` carry coordinates, `conjecture` carries none and cannot be cited as fact, and
`[dispute C-NNN@a,b]` keeps both arms of a source contradiction with their coordinates instead
of resolving it, rising as an item for a person to decide. adopt's capsule processing runs a
clean-session refutation that includes a provenance sampling check, and source documents are
never deleted, moved, or edited by any skill. Per-section row counts in the capability
document, which never had a measured basis, become soft; the total 185-line cap stands. Wired
through `skills/principles/{SKILL,baseline-predicates}{,_ko}.md` and the arch, adopt, split,
work, resume, and verify pairs, with `scripts/project-knowledge.mjs` (`project`, `select`,
`validate`) as the read-only capsule tool.

## 0.18.0 — 2026-08-18 — planning decisions and evidence survive as records, and only reproducible evidence stops re-verification

The first real project left 115 lines of canon after 6+ hours of planning: a fresh session
matched 0 of 6 stack decisions and planned 3–4 days re-verifying a spike already proven on
disk, and a 1,048-line conversation narrative did not reduce that re-verification. This
release adds the planning record layer (DD-74·DD-75): confirmed choices land immediately as
decision records and reproducible observations as evidence records under
`devflow/project/{decisions,evidence}/` — immutable, superseded by successors, never
consumed. The record gate (three literal questions) fires after each confirmed answer batch
in product, arch, design, adopt, and split's maintenance planning, with a three-line echo before
each `record — <filename>` commit; work promotes reusable execution facts and writes
successors while walking the discovery→update table. A user changing a confirmed statement
without a disproving measurement is now a first-class table row (the conversation is the
confirmation). The stateless read-only record tool `scripts/project-records.mjs`
(`summary`·`select`·`reverse-evidence`·`prune-check`·`validate`) owns current-set
projection, bounded opening (≤3 with a pre-bind confirmation of unopened candidates),
fixed-string reverse search from stale evidence to its dependent decisions, and safe-delete
judgment; human deletion stays a sanctioned exception with a citation-repair path.
Capability documents' Binding ADRs lists now also carry the current decision records their
design statements actually cite — arch and adopt are the only updaters — so implementers
reach new grounds through the same automatic channel as legacy ADRs, and verify's
retrospective reads records through the same bounded projection instead of the folder
whole. Unapproved observations are recorded honestly as `mode: reported` evidence,
separated from reproducible runs.
Files: `skills/{principles,product,arch,design,split,work,resume,adopt,verify}/SKILL{,_ko}.md`,
`skills/principles/{planning-evidence,baseline-predicates}{,_ko}.md`,
`scripts/project-records.mjs` + tests, both plugin manifests.

## 0.17.0 — 2026-08-16 — arch finishes only when capability knowledge can survive the session

One real project landed arch.md and code-style.md, exhausted its planning context, and ended
before arch's final output: all six capability documents. The individual Layer 0 commits were
safe and resumable, and a half-confirmed document still has no cheap durable state; the defect
was the unguarded interval between those two boundaries. arch now states the expected document
count before its biggest output, stops at the confirmed Layer 0 commit when context is short,
says that the run is not complete, and tells a card-free next session to enter through resume.
At the first tree opening split checks, for `01` and every non-retired capability number in
product.md, whether a lowercase `.md` whose leading token before the first `-` is exactly that
number sits directly below the capability-document directory, and stops when any is missing,
matching the token rather than a prefix so that `100-*.md` cannot mask a missing `10`, sending
the user back through
resume, which routes by `Brownfield` to arch or adopt; a deferred run skips this gate with the
rest. Each piece of the predicate closes a bypass measured in simulation — a lone `.gitkeep`,
partial creation that work and verify would then carry to a document-free closure, a number-led
file in a subfolder, and `.MD` under a case-insensitive filesystem. Existence is checked per
number rather than by count because preserved retired documents and excess or duplicate files
masked a missing number.

product's `Approach` also gains which goal wins when two collide: `arch` and the planning-evidence
pre-commitment review both require that value to break a tie, no section produced it, and synky's
product.md cited a speed-and-cost principle defined nowhere.

The same field run found that only two of ten ADR-qualified decisions had been recorded and none
of eleven Stack reasons named an external-contract source. Before arch.md confirmation, arch now
enumerates every decision meeting the three ADR conditions and confirms whether each becomes an
ADR; Components and Stack keep an exact source on the same reason line when an external contract
fact supports the choice. This is review, not a new output field: a declined ADR remains declined,
and a landed arch.md still has no retrospective recovery route for an omitted ADR.

The human-facing explanation now says that HANDOFF.md is a cache for one recomputable value,
digest.md is a one-hash bookmark rather than a summary, and a confirmed planning boundary is the
place to end a full context and resume later. Its project tree also separates capability documents
from Layer 0. README tone counts: README.md em dash 100→101, raw `**` 115→121; README_ko.md em dash
73→73, raw `**` 103→109; bureaucratic noun compounds 0→0 in both. The standing use-case matrix
adds H46 for context exhaustion at a Layer 0 boundary and A20 for a session that reads artifacts
but reconstructs implementation judgment without running resume or a skill.

DD-73 records the combined boundary. Four audited proposals remain rejected as DR-47 through
DR-50: broadening Provisional to blocking facts, relaxing capability-name/folder-name identity,
using a `.wip.` suffix for Layer 0 drafts, and making design the authority channel for outside
product or architecture material. Each entry names the existing contract a re-proposal must
refute. The backlog settles the prior ADR-usage observation under DD-73, records why the draft
suffix is not a cheap answer, and carries the seven new measured observations without adding runtime
rules; the repeated Design-head item now includes synky's six-refresh measurement.

Both plugin manifests are 0.17.0. Files changed: `skills/arch/SKILL{_ko}.md`,
`skills/split/SKILL{_ko}.md`, `skills/product/SKILL{_ko}.md`, `README{_ko}.md`,
`docs/usecase-matrix_ko.md`, `docs/audit-guideline_ko.md`,
`docs/design{_ko}.md`, `docs/design-decisions{_ko}.md`, `docs/design-backlog{_ko}.md`,
`docs/rounds/v0.17.0/report_ko.md`, `CHANGELOG.md`, and both plugin manifests.

## 0.16.2 — 2026-08-15 — maintenance starts with complete intent, not accumulated history

Repository-maintenance sessions used to enter through a 30,716-byte `AGENTS.md`, then often
read README, CHANGELOG, and several round records before they could tell why each skill
exists. That repeated procedure and history in every context while still failing to prove
that the affected skill sources had been read. The entry gate is now a bounded router:
`docs/design.md` carries a compact intent index for every skill and companion, while
`docs/maintenance-protocol.md` holds conditional procedure by section. Current state comes
from manifests, Git, one changelog entry, and bounded sections of the latest numeric round;
history and README are no longer onboarding substitutes.

The boundary is enforced in `scripts/repository-invariants.test.js`: `AGENTS.md` and the
always-read design have byte budgets, every protocol section must have a root route, every
skill and companion must appear in the intent index, conditional dispatch may have only one
owner, ko/en structure must remain paired, and English `AGENTS.md` must stay Korean-free.
DD-71 records why a `CURRENT.md`, another skill map, or changes inside `skills/**` were
rejected. DD-72 makes one `report_ko.md` the deterministic record when a versioned
implementation names no document role. Script consumers and document lifecycles are now
closed inventories, including bounded round-role names and explicit historical records.
The source skill tree is unchanged. Files changed: `AGENTS.md`, both plugin manifests,
`scripts/repository-invariants.test.js`, `docs/design{_ko}.md`,
`docs/design-decisions{_ko}.md`, the new `docs/maintenance-protocol{_ko}.md` pair, and
`docs/rounds/v0.16.2/report_ko.md`.

## 0.16.1 — 2026-08-15 — a clean role is no longer told to run resume

Both entry announcements — the SessionStart hook's injected line and the Codex fallback
block — told every session to invoke resume first. A role contract holder must not: the
verifier's first rule is to never open devflow documents, and resume opens them by
definition. The conflict only bites when a role is briefed as a **fresh session** rather
than a subagent, because devflow registers SessionStart and not SubagentStart — and a
fresh session is exactly how an orchestrator briefs a clean role. Left alone, a verifier
could read the state it is supposed to be blind to and return a verdict that looks normal:
a silent break of the black-box guarantee. Both announcements now carry the exclusion, so a
session handed reviewer, verifier, auditor, retrospector, or coordinator follows only that
contract. No skill changed, the injection is still three lines, and `hooks/hooks.json` is
untouched, so no Codex re-trust is needed.

## 0.16.0 — 2026-08-15 — an outside dispatcher is a declared role, and devflow itself does not change

devflow already treated several sessions in one working folder as normal (DD-53), and its
execution proposal already emits what a dispatcher needs — order in `Depends`, concurrency
in `Approval`'s `parallel:`, tier in `Tier`. What was missing was the other side: nothing
said what the dispatcher owes. Of the obligations an outside orchestrator carries, devflow
already detects three (resume asks instead of guessing an ambiguous card, a wrong commit
surfaces as an integrity anomaly, a hand edit invalidates `Approval` freshness), but three
sit outside the trust boundary and no mechanism can reach them: answering a human gate on
the user's behalf, rewriting a file whole, and letting knowledge travel only through the
dispatcher's own messages. So this release adds a contract, not a mechanism.
`skills/principles/coordinator.md` is a fifth role contract — the first with no skill that
dispatches it — and it names no tool, platform, or messaging system, so any orchestrator
can read it. Nine obligations: name the card and folder and mint the layer's cards onto
integration first, one implementation worker per card, workers make their own devflow
commits while the coordinator makes none and never holds the integration branch checked
out, the coordinator edits nothing, gates go to the human (batched, never answered),
partial edits only, messages route while disk carries knowledge, state is read from the
tree, schedules follow what the cards already say, and every worker inherits the owner's
id. **No existing skill changed** — the eight stages, the canonical rules, the three
predicate canons, planning-evidence, and the four role contracts are byte-identical, and a
test now enforces that no skill references the new contract, so the runtime cost is one
conditional line at session start. Discovery walks from the hook (which computes the
contract's absolute path), with the Codex fallback document, README, and the design
document map covering the readers the hook cannot reach. DD-70 records the decision; DD-52's
conditional pre-claim is corrected by it, and the decision-state format now accepts
successive corrections. Also fixes a real hook defect found while verifying Codex support:
SessionStart had no `timeout`, so a stuck hook could hold a session for the 600-second
default. It is now 5.

## 0.15.2 — 2026-08-15 — design decides, split builds: the design stage owns direction, not artifacts

The design stage's contract was deliberately loose because design work is genuinely
plural — a Figma handoff imported as a design system, a component library themed over,
components built one by one, or any mix — and the owner has now fixed the shape that
keeps that plurality. design settles **six Layer 0 decisions** (approach, design source,
token strategy, component strategy, decomposition axis, review surface — where "not
used" is a valid value and the named options are examples, never a closed list), lands
only `design.md` through the existing Layer 0 commit, and stops. The real artifacts —
token files, components, previews — are built by cards that split opens, so the old
completion signal (a running /preview page) that could never execute in a blank
repository is gone (DD-69). design stays optional and deferrable: build the foundation
first and put design on top later, or skip it. The six decisions are Layer 0 fields even
while design.md does not exist, so a direction-changing request in a design-skipped
project routes through 2a to a late first design run — recorded first in journal, planned
after, on the existing maintenance path with no new state. Construction results flow
back: a confirmed fact replaces exactly one line via the discovery→update table's new
design row, and only a change of direction re-runs design; after confirmation split
applies `.stale.` and the re-split marker to affected cards, completing the pattern the
product row already had. Cross-verified in both languages (three adopted findings across
the loop, including restoring grade 2b in the no-design note); terminology gains six
design rows, and the two long-standing design observations in the backlog are settled by
DD-69. Also lands the Design-head-only bulk-confirmation observation (P4) as a watched
item rather than a rule.

## 0.15.1 — 2026-08-15 — a fresh full-repo evaluation and an artifact-lifecycle sweep close seven cross-skill gaps

After 0.15.0 shipped, an independent full-repo evaluation (8.5/10, zero silent-loss
findings) and an artifact-lifecycle sweep — who creates, commits, owns, and recovers every
named artifact — found gaps of a kind five prior campaigns had not walked: contracts that
fall **between** two skills. Seven convergent repairs land, each cross-verified before
application. resume's state table now excludes a research-waiting implementation card from
the re-approval row, so a ready research card is reachable (the no-exit routing window).
split's maintenance mapping gate names its predicates operationally (`## Verified state`
heading and bounded structural queries), the same pattern work already used, instead of
holding predicates it never reads the definitions of. principles pins the draft contract
for interrupted Layer 0 sessions: before confirmation nothing lands on a core-document
path, and an interrupted uncommitted diff is rederived from HEAD — never treated as
partial truth. A research card's final commit now carries its throwaway prototype's
deletion, closing "only the decision survives" mechanically. arch's desktop/TUI channel
row creates its operating-procedure document as a first task when it is missing, matching
its sibling rows. A dead sentence pointing at the Codex slash-prompt channel removed in
0.13.0 leaves adopt, and README's bundle enumeration now counts planning-evidence among
the companions. Two items stay open as owner decisions: greenfield design-artifact
ownership, and Design-head-only batch confirmation.

## 0.15.0 — 2026-08-15 — planning settles facts before asking, and verification recognizes a failure it has repaired before

Two axes land together, implemented from `docs/rounds/v0.15.0/plan3_ko.md`.

**Planning evidence discipline (DD-67).** A new canonical companion,
`skills/principles/planning-evidence.md`, is read by exactly four consumers — product,
arch, adopt, and split. Every unknown is classified by who owns its answer (current
repository fact, external contract fact at a pinned version, execution fact, or owner
decision), and only owner decisions become user questions; the rest the session settles
itself, directly for known coordinates and through one read-only researcher for
answer-only searches that follow new paths or compare sources. A fact whose absence makes
the current choice undecidable is `blocking` and stops binding until settled, conflicted,
or unavailable; anything safe under a default is follow-up and lands in the stage's
existing home. Immediately before binding a decision batch, a pre-commitment review shows
at most one substantive alternative — with no candidate, it produces no output at all.
product batches independent questions (3–5), asks a dependent question alone first, and
recomputes dependencies after free-form input; arch confirms candidate survival and verify
channel executability before presenting options; adopt separates code, pinned-version
contracts, and owner intent as three authorities; split judges sub-chunks by the
planning depth grade (0/1/2a/2b) — card fields decide, not names or sizes — with a
no-progress exit that never repeats a reworded question. A long product interview
summarizes once in conversation and writes no file, state, or commit (D13-A).

**Repair lineage (DD-68).** verify now attaches each runnable regression signal's owning
card as a `signal card` label, and persists `signal card`, `repair lineage`, and
`recurrence observation` with each failure entry. Before calling the verifier, a bounded
projection over exactly three files (current target, tree root, label-owning capabilities)
reindexes completed `routing: fix cards` numbers to their roots; two candidate roots for
one label block the whole run as an integrity anomaly. A recurrence inherits the previous
repair round's cards plus the current signal card into the new fix card's `Read first`,
`Why` carries the evidence, and `Forbidden` is written only when the log directly proves
an unchanged retry fails. At recurrence observation 2 or higher no automatic card is
created — the lineage returns to a person. work, reviewer, resume, and the three predicate
canons are byte-unchanged; the verifier stays clean, receiving labels but never history.

**Why.** Planning interviews were forwarding facts to the user that the environment could
answer, and repeated short lookups were polluting the main context; verification treated a
re-broken repair as a brand-new failure, so nothing learned in the previous attempt
reached the next one. Both axes were verified by cross-model loops (ten adopted findings,
each a one-word-to-one-token defect with branch-inverting consequences) plus a four-lens
independent audit; two narrow cross-capability windows are recorded as backlog
observations with exact signatures rather than speculative rules, following the DD-44
lineage. Files: `skills/principles/planning-evidence*`, `skills/product|arch|adopt|split`,
`skills/verify/SKILL*` and `verifier*`, `skills/principles/SKILL*`,
`scripts/repository-invariants.test.js`, both plugin manifests, AGENTS terminology, and
the design canon (DD-67/DD-68, matrix H42–H45, backlog observations).

## 0.14.2 — 2026-08-13 — the GPT audit's findings land: mixed requests record only what fails the gate, and the tweak lane checks its landing first

An independent GPT audit of the 0.14.1 implementation (`docs/rounds/v0.14.0/audit_ko.md`)
reported eleven findings, three of them reproduced as real Git fixtures. Every one held up
against the deployed originals — zero were rejected — and all are closed here, with three
owner decisions taken over previews: a mixed request records only its gate-failing items
(DD-65), same-file contention gets a pre-edit check with the tweak side yielding (DD-66),
and the tweak lane's judgment reads the glossary when an item could touch a name or term.

**Mixed requests (audit 4.1).** The card planning commit consumes the whole request line,
so a tweak item mixed into it was consumed with neither a card nor a record — a silent
loss on interruption. Now a passing item is written into no journal line: the recorded
line holds only gate-failing items, and the lane handles passing items in the conversation
that carries them (recording commit first). split no longer sends items back out to the
lane. The residual window — death after recording, before the tweak commits — is the same
grade DD-61 already accepted for pure tweak requests.

**The lane's landing checks (audit 4.2–4.5, DD-66).** Before editing, the lane now
confirms by machine: a named branch (a detached-HEAD commit lands in no branch — Git
fixture), no `routing prepared` in any working-tree verify.md (one HEAD advance turns that
recovery into an integrity anomaly), the readable integration tip an ancestor of HEAD
(stale documents produce wrong "no"s), and target paths free of changes this session did
not make (`git commit --only` carries a sibling's half-done hunks — Git fixture). At
commit time the diff is compared against the bundled items' changes; on foreign content
the tweak side backs out and reapplies after, so no mutual wait can form. The check-to-
commit race stays honestly in README's not-covered table. DD-61's "bypassing the nets
breaks nothing" is partly corrected by DD-66.

**resume repairs.** `not yet on integration` now counts the `integration..HEAD` commit
set — the old ancestor guard reported `none` on exactly the ordinary ahead-of-integration
branch (audit 4.6, an escaped 0.13.0 defect, now a fixture and a new guideline defect
class, the wrong predicate). The which-claim question moved to report time beside the
worktree question (audit 4.7); status questions no longer enter the lane (4.8); the unit
number reads the item's own text (5.1); the worktree question's uncommitted half now
tests the claimed card's file, which free parallelism had silently suppressed.

**Docs drift (audit 5.2).** AGENTS.md and the design pair stopped instructing the removed
Codex prompt channel; DD-04 is replaced by DD-57, DD-18 partly corrected by it.

Verified by two clean-context passes (refuter; literal walker over seven scenarios) — 16
deduplicated findings, 15 adopted and repaired, 0 silent-loss class — then a bounded
re-audit of the repairs: 5 findings, all closed convergently, loop closed under the
guideline's §5 stop condition. Tests 87 → 95 (three Git fixtures added), all passing;
ko↔en parity and the Korean check hold. README tone counts unchanged by its two edits
(ko em-dash 74→74, en 99→99; bold pairs unchanged). Adjudication detail:
`docs/rounds/v0.14.0/report-0.14.2_ko.md`.

Files: `skills/{principles,resume,split,work}/SKILL{,_ko}.md`, `README{,_ko}.md`,
`AGENTS.md`, `docs/design{,_ko}.md`, `docs/design-decisions{,_ko}.md`,
`docs/design-backlog{,_ko}.md`, `docs/usecase-matrix_ko.md`, `docs/audit-guideline_ko.md`,
`docs/rounds/v0.14.0/report-0.14.2_ko.md`, `scripts/*.test.js`, both `plugin.json`s
(0.14.2).

## 0.14.1 — 2026-08-13 — the repair re-audit: seven precision forks converge, and the loop closes by its recorded stop condition

A bounded independent pass over only the seventeen 0.14.0 repairs (fixes are changes too)
returned ten clean and seven findings — every one a two-reading fork or a subtraction, no
new rule conflict and no loss path. All seven converge in this release: a roomless
session's tweak waits out a blockade and reports (room creation is a binding decision);
"attributed" requires a token exactly equal to an existing room's id, never a substring;
resume's skip clause no longer references the not-yet-known matched row, and the worktree
question moves to report time on a work row; whether a card "preserves" a request is
judged by canonical recognition instead of an undecidable reading; a tweak commit's
subject-and-paths shortcut ends at the shared-document judgment and still yields a diff
read when it touches a candidate's paths; verify's event preemption binds to a claim the
session still holds, so a closed card cannot starve the first-closure retrospective; and
the duplicated "may be claimed immediately" sentence is deleted. The loop then stops by
the stop condition recorded in advance — findings fell from rule-conflict class to
reading-precision class, and every fix narrows interpretation rather than adding
surface — so no third text pass is opened; the next verification instrument is field use.
The lineage, loop record, and honest size measurement (the fixed session read grew
1,543 → 1,636 lines, over the plan's budget, with the recorded reduction path being
D11 then the interruption machinery) live in `docs/v0.14.0-execution-report_ko.md`, the
process-grade handoff this round leaves behind.

## 0.14.0 — 2026-08-13 — free parallel claims, the tweak lane, blockade appends with 3-way journal merges

Implements `docs/v0.14.0-plan_ko.md` in full. Three structural changes, each refuting a
recorded decision in `docs/design.md` before overturning it:

**Free parallel claims.** The one-claim-per-id-per-unit rule assumed one terminal per
person; the owner runs six on one capability daily, and the rule's only legal path (a
one-step group claim) meant the parking detour would sweep a sibling session's uncommitted
work into a checkpoint and release its card. Any terminal now claims a ready card
immediately — work names existing same-unit claims in one informational line (the
Approval `parallel:` value stays as the plan's recorded judgment and feeds that line);
every checkpoint-style rule is rescoped to "changes this session made"; the group-claim
procedure, reciprocity predicate, and claim-count machinery are removed; integrity item 1
is repurposed to orphan-claim detection (an id matching no room) with its number
preserved; resume asks which claim to continue when several are open and none is named.
README carries the three user guidelines (never two terminals on one card, never
whole-file rewrites, don't assign overlapping cards together).

**The tweak lane.** A change whose diff is its complete record — no user-visible
precondition-to-outcome transition, no design decision or conflict, no trap — runs with
no card, journal line, or review: declare, read Layer 0 only, cheapest check once, one
`<id> tweak NN:` commit, no `devflow/` path. A fresh session holding only a tweak request
skips state restoration entirely. Mid-change flips stop and switch to the ordinary path;
discoveries still land through the discovery→update table. digest classifies `tweak`
commits from subject and paths alone.

**Blockade appends and 3-way merges.** Journal lines that mint nothing and claim nothing
(maintenance requests, capability notes, attributed open items, product re-run pending)
are appended and locally committed even while integration is unwritable — closing the one
silent-loss path the second verification round found — and the final task commit is named
on the continue side, honoring "nothing waits unnamed". The union merge rule is replaced
with base-aware 3-way resolution because measurements 15–16 proved union semantics
resurrect consumed lines; resume's standing count now includes journal changes.

Also lands every confirmed defect from the second verification round: verify's journal
classifier gains the attributed-open-item class and the shared-contract row's third
branch writes exactly that (giving the line a consumer); resume's integration row cites
arch's worktree-count default instead of contradicting it; claim contention and minting
contention route to their own rules; split's Design-head gate treats an absent, legacy,
or damaged candidate document as differing; the retirement observation gate gets its name
and bound in the canon with product citing it; plus the cleanup tier (repository-root
resolution sentence, closed-folder item-13 exception, W4 antecedent and exact-token
match, widened `.stale.` definition, publish=landing binding, marker-bundle request-line
deletion, ten terminology-table entries). Tests grow to 87, including real-Git fixtures
for the 3-way journal merge and three path-scoped same-unit claims. Both plugin
manifests move to 0.14.0 together. README tone counts (per the writing rules): em-dashes
92→98 (en) and 67→73 (ko) across three added sections, bold 57 and 51 unchanged.

Verified before release by two independent clean-context passes — a refuter over the
seven changed deploy files and a literal-execution walker over four owner scenarios (six
terminals on one capability, a tweak session, a blockade with a new request and a session
death, a journal merge conflict) — every finding adjudicated against the text.
Seventeen repairs followed, all sentence-local: the Parallelism section rescoped to
subagent delegation (the sharpest leftover of the old permission model); the blockade
lists naming the evidence-wait→finalizing swap, audit/retro request lines, and the
binding-decision "now" precedence; tweak judged per item, its `<id>` resolved through
the Identity rules (room creation sanctioned), its skip declared inside the canon, its
gate judged from what the lane reads, and its leftover edits taken over with user
confirmation instead of stranding; the attributed line given its two mechanical checks
(canonical timestamp + existing room id); the request-record commit given a message form;
resume's "claim this invocation continues" defined for the no-claim case, its routing
rows anchored to the procedure's own reads, and pending cards added to the
request-preserving list; the digest gate reworded for several claims and its marker given
a commit vehicle before a claim; the 3-way base defined for rebase and ties. The
use-case matrix's pending cells were all re-judged against the implemented text — zero
gaps remain; the walker's journal-merge scenario ran clean on the first pass.

## v0.13.0 — 2026-08-13 — one integration branch, several hands, and reading bounded to open work

**Concurrency became a model instead of a hint.** v0.12.0 read shared tree state as the
union of the integration tip and every worktree HEAD, and that rule fails in both
directions: a lagging worktree revives a finished card back into a claim, and excluding the
laggard erases a live sibling's claim so the same card gets implemented twice. The
canonical rules now carry three consecutive paragraphs in `## Identity and Rooms` where the
scattered `Worktrees are flows` paragraph stood. Shared truth is the integration branch
alone — card status, tree numbers, verify source ids, journal, capability documents, and
binding decisions — and another worktree's HEAD is evidence not yet integrated. A shared
transition is published against a remembered integration commit id, and a rejection is
classified by one mechanical test: integration not an ancestor of the branch being
published is ordinary contention and retries up to three times, integration an ancestor
with a refusal is a structural blocker and is reported with its exact cause. Error text is
never used, because it varies by locale and Git version. When integration truly cannot be
written, only code edits and progress-log checkpoints of an already-claimed card continue.
And several sessions in one working folder are normal, protected by five lines that were
measured rather than assumed. `resume`'s `(the integration tip unioned with each worktree
HEAD)` is gone with it, so the two contradictory authorities no longer coexist.

**Measured before written.** Every claim above was run in throwaway Git repositories first:
`git push . HEAD:<branch>` lands locally with no remote; a worktree holding the branch
refuses the push with the branch id unchanged; a commit naming its own paths carries one
file while another session has others staged; four sessions appending to one journal lose
no line; `git update-ref` *succeeds* against a branch another worktree holds, which is why
the plain push is the safer publish primitive and no compare-and-set helper is added. Those
runs are now fixtures in `scripts/git-state-transitions.test.js` instead of prose.

**And a live concurrency run refuted the plan's own rule.** The plan classified a rejected
publish by whether the remembered integration id had changed. Driving two worktrees for
real produced the case that test cannot see: a flow that reads integration *after* a
sibling has already published remembers an id that then never changes, yet its rejection is
an ordinary non-fast-forward. Classifying it as a structural blocker would have sent a
routine race down the blocked path. The mechanical test is therefore the ancestor relation
— not an ancestor means contention, an ancestor with a refusal means a structural blocker —
and both live cases fall correctly under it. The measurement is pinned as a fixture.

**Knowledge stopped leaking at three seams.** A capability closure used to delete every
`capability note` for that capability from the *current* journal, so an observation another
flow appended after the begin commit was deleted unread; the sweep now removes only lines
byte-identical to the multiset collected from the journal blob at the marker's `head`.
Retiring a capability used to strand its observations forever, because their only consumer
is that capability's next closure; product now enumerates them before the retirement is
confirmed and puts the user's chosen discard or re-target in the same commit. And an
observation about a shared contract or the foundation had no row in the discovery→update
table, though it is the observation most often found while working elsewhere; one row now
sends it to an ADR, to arch.md's `Risks`, or to one journal line.

**Seven reproduced defects closed.** resume reported one card while work would take another,
because work's remote-evidence transitions run before card selection — an evidence row now
sits above both work rows and the report quotes work's own selection. Maintenance mapping
could run against a stale capability boundary; split now projects `Design head` before
mapping and resume routes the design refresh above the maintenance row. A corrupted
`Covered cards` left the carry-line complement undefined; work and the baseline predicates
now make the same decision — treat every completed card as unharvested rather than guess
the empty set. Parking a card re-claimed it immediately through canonical candidate order;
the switch now claims the card the user named or asks. Card recall deleted the original and
let the next minting reuse its number; it now leaves a `.stale.` tombstone and moves
dependents. A room upgrade broke evidence records' card paths; the rename and the
`card-json` replacement now ride one commit. And a duplicate number no longer renumbers a
finished card, whose number also lives in commit subjects and outside links.

**Reading is bounded to open work.** Inside a depth-1 folder carrying `.done`, the integrity
check and resume read path names and status suffixes only — that folder's knowledge is
already folded into its capability document. All fifteen integrity items were mapped against
that projection: only item 4's field parse narrows, and a re-closure strips the folder's
`.done` first, which returns those cards to it. Approval freshness moved from two Git
commands per card to two for the whole tree, but only after a fixture proved the two
methods judge identically across deletion, rename, staged-versus-worktree, nested, Unicode,
and punctuated paths — `-z` and `--no-renames` are what make that hold.

**One Codex channel.** The eight generated `~/.codex/prompts/devflow-*.md` slash prompts are
gone. Probing a live Codex install showed it caches a plugin as the whole repository under
`~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/` and the model reads its skill
from that absolute path, so `../principles/SKILL.md` resolves exactly as it does in Claude
— the recorded reason for embedding applied to the flat prompts folder, not to the plugin.
Each prompt embedded the whole rulebook at 50–120 KB and both installers carried their own
embedding logic, so every rule change had to be applied twice. Generation is removed and a
new marker-keyed cleanup deletes the exact eight names for one release, leaving a file a
user wrote under one of those names alone. `scripts/extract-adopt-reference.js` existed only
for that channel and is deleted with it. Hook trust is now two-stage: the install leaves the
pre-0.9.20 global registration running and prints the command that removes it, for after you
have opened `/hooks` and seen the plugin entry yourself.

**The SessionStart hook finds its checkout.** It read `process.cwd()` directly, so a session
started in any subfolder exited silently. It now takes `cwd` from the hook payload and asks
`git rev-parse --show-toplevel`, with four fixtures covering repository root, one level
down, several levels down, and a checkout with no devflow.

**Open decisions moved out of HANDOFF into journal.** v0.7.0 rejected that move as "one
concept, two homes"; removing the section from HANDOFF entirely leaves exactly one home and
refutes the reason. HANDOFF is overwritten whole and one person's two sessions share one
room, so both writing meant one side's decisions vanished; what remains is `Next single
step`, which canonical candidate order recomputes.

**Folded on its own condition**: splitting the baseline predicates into a read contract and
a write contract. The clause×consumer matrix is not clean — most of the file is read
directly by arch, adopt, verify, and resume alike, resume needs writer-eligibility rules for
recovery, and verify needs the domain-entry role inputs — so every consumer would read both
files. Splitting the canonical rules per consumer stays deferred for the same-round reason.

README tone counts (v0.12.0 → v0.13.0): README.md `—` 92→92, raw `**` markers 113→115,
`-tion/-ure` nouns 6→9; README_ko.md `—` 65→67, raw `**` markers 101→103, `-tion/-ure`
nouns 0→0. The three added English nouns are `build isolation` and `File isolation is not
runtime isolation`, both noun-against-noun contrasts rather than verbs in disguise.

Files: `skills/principles/SKILL_ko.md`·`SKILL.md`;
`skills/principles/state-predicates_ko.md`·`state-predicates.md`;
`skills/principles/baseline-predicates_ko.md`·`baseline-predicates.md`;
`skills/split/SKILL_ko.md`·`SKILL.md`; `skills/work/SKILL_ko.md`·`SKILL.md`;
`skills/verify/SKILL_ko.md`·`SKILL.md`; `skills/resume/SKILL_ko.md`·`SKILL.md`;
`skills/arch/SKILL_ko.md`·`SKILL.md`; `skills/product/SKILL_ko.md`·`SKILL.md`;
`README_ko.md`·`README.md`; `codex/AGENTS-devflow_ko.md`·`AGENTS-devflow.md`;
`codex/install.ps1`; `codex/install.sh`; `scripts/session-start.js`;
`scripts/session-start.test.js`; `scripts/remove-generated-codex-prompts.js`;
`scripts/remove-generated-codex-prompts.test.js`; `scripts/git-state-transitions.test.js`;
`scripts/repository-invariants.test.js`; deleted `scripts/extract-adopt-reference.js` and
`scripts/extract-adopt-reference.test.js`; `docs/design_ko.md`·`design.md`;
`docs/v0.12.0-usage-flow-report_ko.md`; `docs/v0.13.0-execution-report_ko.md`;
`.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `CHANGELOG.md`.

## 0.12.0 — 2026-08-12 — one mode, claims on the capability axis, knowledge that outlives a handoff

devflow modeled the person and never modeled the work that flows concurrently. One person
with five terminals on five domains hit an integrity anomaly on the second terminal, and
what a maintenance card learned reached nobody. This release moves three properties off the
person axis and onto the capability axis, and removes the mode fork that made the move
impossible. Plan: `docs/plan-usage-flow_ko.md`. Decisions and rejection lineage:
`docs/design.md`.

**One mode.** The solo/multi fork is gone from every deploy artifact. Rooms
(`devflow/users/<id>/`) always exist, claims are always `.wip-<id>.`, commit messages are
always id-prefixed, and `arch.md` always carries `integration` and `merge`. The cost to a
lone user is one commit per card — the claim — and that commit is exactly what lets two
terminals or two worktrees see each other's work in progress. When `integration` names the
current branch (or arch.md is absent, or the line is missing) the integration tip is HEAD,
and every fetch, push, integrate, and compare order collapses into an ordinary commit; a
purely local integration branch needs no network command. Identity resolution now states
the empty-value, changed-identity, non-interactive, and non-Git cases it used to leave
open, and `owner.md`'s two-line format and `digest.md`'s one-line marker are written down
for the first time. The `Solo→multi` and `Multi→solo` transitions are replaced by one
upgrade split three ways by existing ownership — arch adds the two fields, identity
resolution creates the room, work renames the bare `.wip.` and moves the root HANDOFF —
with resume rows and integrity item 6 as its detector and route.

**Claims on the depth-1 unit.** One claim per id per depth-1 unit; claims in different
units are ordinary concurrent work. Integrity item 1 is scoped the same way, and its two
exceptions (reciprocal parallel approval, evidence-wait) were always exceptions inside one
capability, so the scope now fits them. work groups its claims by unit, continues the
first in canonical candidate order, and never claims a second card in a unit it already
holds. resume reports every claim but reads only the one it continues in full, and
attributes uncommitted changes only to that card.

**One canonical candidate order.** Several places asked "which one next" and could answer
differently. The canon defines it once: the card the user named, then the session unit,
then the carried unit (from HANDOFF's `Next single step`), then the rest; canonical
card-number order within each. It never changes which routing row matches, never makes an
unready card ready, and never grants a claim. The recognition machine that lived only in
resume's domain entry was promoted to canon, and resume and the baseline predicates now
cite it. resume's report names the reason it chose and lists the other open units, so
"picked arbitrarily" is structurally unavailable. A change request the user makes in
conversation gets its own routing row, placed above the claimed-card row rather than below
it as planned: the persisted form of the same request already outranks a claim one row
higher, and with claims now normal in several units at once, "below" would have meant the
request was recorded almost never.

**Knowledge that outlives a handoff.** A card writes one `carry:` line into its own
progress log before its final commit — only the residue with nowhere else to land, and the
line rides that commit so the canonical claim→done move stays byte-identical. The next card
in the same capability reads, through a mechanical query that opens no card body, only the
carry lines of `.done.` cards outside the capability document's `Covered cards`; closure
harvests them and empties the set. An observation about a different capability becomes a
journal `capability note` keyed to that number, harvested and deleted at that capability's
next closure — unless the baseline refresh was a no-op, in which case the notes are
retained. Neither reviewer nor verifier receives the set; their ignorance is the asset.
HANDOFF drops `Just learned` and `Traps`, `Next single step` becomes mandatory, and the
first boundary after an upgrade lands the old sections before overwriting.

**Bounded repairs.** A reopened capability can no longer report verified statements as
fresh (any non-`.stale.` card without `.done` below the folder makes them hypotheses). An
external trap survives without a source URL by naming the observing card and its
reproduction condition. Foundation's `None.` verified zone is stated as the design — shared
code is verified through the consumers whose code scope contains it. Hypothesis
reconfirmation reaches already-open Binding ADR paths and, for reconfirmation only,
`Consumed paths`, without widening the Standards gate or Audit scope. Every devflow commit
carries only its own paths and the review diff is bounded the same way. HANDOFF merges keep
`Open decisions` as a union and take `Next single step` from the newer header. Integrity
item 5 compares HANDOFF paths with status suffixes removed, so a claim no longer trips a
false alarm. split reads the fixed first four lines of candidate capability documents to
map a maintenance request, and a never-claimed, never-committed card in the wrong folder
has a recall route that retires its number.

**Owner decisions folded in after the first pass.** Git is now a requirement rather than a
soft preference: the first skill in a folder that is not a work tree proposes `git init`
and stops when declined, and an unset `user.name` or `user.email` gets the exact
`git config` line and a stop. That deleted the degraded no-Git mode entirely — one fewer
mode and six fewer canon lines. Worktrees became the flow registry: measurement showed the
earlier claim that they need a remote was wrong — worktrees of one repository share a
single object store, so a claim in one folder is visible in another with no fetch and no
remote, and the only real constraint is that Git will not write to a branch another
worktree has checked out. `git worktree list --porcelain` survives a terminal dying and
self-prunes, which is the durable per-flow identity X2 wanted and could not build, so
shared tree state is read as the integration tip unioned with each worktree HEAD. A change
request made while a card is claimed is now recorded at once as its journal line and
planned only after that card closes, so it neither evaporates nor interrupts. A completion
signal is scoped to the capability's own paths, which is what lets two flows share one
working tree. And when the conversation named no unit and two or more hold candidates,
resume asks instead of proposing.

**Not adopted, recorded in the lineage:** a durable focus field, per-terminal `flows/`
folders, a second identifier level under the person, session or date bundle files, a new
per-capability note layer, reading whole progress logs or the last N, narrowing verify's
uncommitted-outside-devflow gate, devflow managing worktrees, and a freshness line in
resume's report. The worktree rejection is not overturned: devflow still does not create
worktrees, it is merely compatible with ones the user already made. Concurrent editing runs
in parallel while verification and builds serialize — an existing safety device becoming
visible, not a new constraint.

Verification: four independent fresh-context passes with differentiated lenses — a
literal-execution walk of four scenarios (new project, upgrade, non-Git, two terminals), an
adversarial refutation of the mode removal, a subtraction audit hunting sentences with no
failure path, and a usage-flow walk of 17 journeys against 5 conditions with the dialogue
written out for every cell that was not clean. They returned 17, 17, 22, and 16 findings.
Every finding with a reproducible failure path was repaired and the repairs re-audited;
four were recorded as observation items in `docs/design.md` instead, because they are
pre-existing and off this axis. Notable repairs: the non-Git path was dead (an identity was
required to write, and the two Approval Git comparisons could never succeed); the
cross-unit concurrency the design exists for was unreachable because work still refused to
open work while holding any claim; resume and work answered "which card next" differently
on the same disk, so resume now reports the card work's own selection takes; canonical
recognition erased the session unit as soon as a second capability was mentioned, so a
larger resolution set now takes the last mention for ordering; the HANDOFF migration was
gated on a room upgrade and therefore never fired for a project that already had rooms, so
it is gated on the file's own sections instead; two sessions sharing one id could drop an
`Open decision` between them, so HANDOFF is re-read from disk before it is overwritten; a
git name matching one room while the email conflicted counted as a match; arch's "add one
field" routes fell through to its full ordered interview; the joining transition had no
commit message and no marker value in a zero-commit repository; and the group claim met the
claim commit with an undefined message. Test pins: 49 repository invariants, including one mode, unit-keyed claims, one
canonical order, the carry line's position and its exclusion from the review roles, the
capability note's producer and harvester, HANDOFF's two sections, and that verify's
uncommitted-outside-devflow gate was not weakened.

Files: `skills/principles/SKILL.md` (+83) · `skills/work/SKILL.md` (+48) ·
`skills/resume/SKILL.md` (+16) · `skills/arch/SKILL.md` (+7) · `skills/split/SKILL.md`
(+15) · `skills/principles/baseline-predicates.md` (+8) · `skills/verify/SKILL.md` (+2) ·
`skills/principles/state-predicates.md` · every `_ko` pair · `README.md` · `README_ko.md` ·
`docs/design.md` · `docs/design_ko.md` · `scripts/repository-invariants.test.js` · both
plugin manifests. Deploy artifacts net **+179 lines** against a planned +60. The
subtraction pass took 22 lines back out — duplicated glosses, consequence sentences, and a
whole arch paragraph that restated the canon three ways — and the remainder is repair the
verification passes demanded. It is flagged rather than absorbed:
`docs/design.md`'s canonical-rules-size entry now reads 648 lines and names this as the
largest open cost, and the owner's call on whether to spend a follow-up release splitting
the canon per consumer is recorded there rather than made here. README tone counts: English `—` 92→92, `**` 53→55; Korean `—` 62→66,
`**` 46→49; bureaucratic noun compounds 0→0 both.

## 0.11.1 — 2026-08-12 — capability-document recovery keys on HEAD

An independent literal execution of the interruption and damage paths, run against the
shipped 0.11.0 text, opened four blocking readings. The prefix test for an interrupted
capability-design write required the uncommitted bytes to equal the current writer's final
re-derivation from HEAD. A design zone is prose the model compressed, not a mechanical
transform, so that condition is false on every session change and an ordinary interruption
became an integrity anomaly with no repair route. It is deleted: the next sentence already
orders a whole regeneration from HEAD, so the outcome is unchanged and one unsatisfiable
gate is gone.

Absence for initial creation is now defined in HEAD alone. Defining it over both the working
tree and HEAD meant one torn write of a brand-new capability document blocked creation
forever, because the torn file made the path non-absent while its zero boundaries made every
writer refuse it. Working-tree bytes with no HEAD counterpart have nothing to preserve, so
the creation replaces them. For the same reason, writer eligibility and begin recovery judge
the boundary count in the HEAD file, and the working-tree count now appears only in the
report a person reads. A user-confirmed boundary reset leaves no disk trace, so it is no
longer recovered as a prefix; an interruption between the confirmation and its commit is
reported and the next run confirms the reset again.

The v0.10 migration gate demanded that both head values parse even though the migration
discards them, so a single field broken by a bad merge dropped the file into the damage
route, where restoring a pre-0.11 revision is impossible by construction and the only
remaining exit discards every verified body. The gate now covers exactly the three fields
the migration carries. A restore also lands only at the damaged file's current expected
path: after a rename, restoring the old path created two same-numbered files that no
ordinary routing row reports.

Smaller repairs from the same pass: arch's and adopt's skip gates both read "missing or need
repair", so a boundary reset or a v0.10 migration no longer re-runs the whole Layer 0 stage
for one document; resume's no-tree branch regained the one-boundary qualifier its table row already
had, so it can no longer rewrite a damaged file without the data-loss statement; the deferral
sentence names three baseline rows instead of two; verify adds an unparseable refresh input
to its no-op list and recalculates capability code scope and consumed paths on the recovery
path; a no-op now leaves the path at its HEAD content instead of orphaning working-tree
bytes; the `baseline no-op` payload has one grammar; and `Design head`'s three paths are
described as sources for that field rather than for the design zone, which the creation-input
list contradicted. The artifact has one prose name, the capability document — `baseline`
remains only as the identifier prefix, and a waiting capability file stays a different thing.

The README gains one plain-words sentence saying what a capability is, and drops the noun
compound the 0.11.0 migration paragraph introduced. README tone counts: README.md em-dash
92→92, raw `**` 107→107; README_ko.md em-dash 62→62, raw `**` 93→93; bureaucratic compounds
1→0.

An independent literal execution of the repaired text then found two defects the repair batch
had introduced, and both are fixed here. Splitting the boundary judgment left resume's routing
rows measuring the working-tree count while the writers measured HEAD, so a torn uncommitted
write over an intact HEAD file raised a false alarm whose offered remedy discarded a verified
zone that was never damaged, while the mirror state — a valid uncommitted reset over a damaged
HEAD file — matched no row at all and stalled. resume's machine query now runs against the
HEAD file, so every routing judgment uses the same values as writer eligibility, and the
report names both counts. The prefix test also still required an interrupted v0.10 file to
carry "the mechanical migration", whose design half is re-derived prose — the same
unsatisfiable comparison this release deleted elsewhere. It now names the mechanical
verified-zone transformation alone. The naming note in `AGENTS.md` was corrected too: it
claimed `baseline` survives only inside identifiers while ninety-odd prose uses remain, so it
now records one full name and one short form, and names the third form as the one removed.

Verification: 52/52 Node repository-invariant and extractor tests, with the stale wording
pins replaced by pins on the repaired properties and eight new pins covering this release's
rules; structure and figure parity on every registered Korean/English pair; zero Korean in
each English deploy artifact except README.md's one language-switch line; whitespace checks
pass; both manifests report 0.11.1 and `codex/install.ps1` keeps BOM `ef-bb-bf`. Codex
prompt regeneration must be rerun locally — this release changes companion text that the
installer embeds.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `AGENTS.md`; `README.md`;
`README_ko.md`; `docs/design.md`; `docs/design_ko.md`;
`scripts/repository-invariants.test.js`; `skills/adopt/SKILL.md`; `skills/adopt/SKILL_ko.md`;
`skills/arch/SKILL.md`; `skills/arch/SKILL_ko.md`; `skills/principles/SKILL.md`;
`skills/principles/SKILL_ko.md`; `skills/principles/baseline-predicates.md`;
`skills/principles/baseline-predicates_ko.md`; `skills/resume/SKILL.md`;
`skills/resume/SKILL_ko.md`; `skills/verify/SKILL.md`; `skills/verify/SKILL_ko.md`;
`skills/verify/retrospector.md`; `skills/verify/retrospector_ko.md`; `skills/work/SKILL.md`;
`skills/work/SKILL_ko.md`; `CHANGELOG.md`.

## 0.11.0 — 2026-08-11 — capability knowledge becomes the automatic domain-entry layer

The approved domain-knowledge handoff and its second-edition implementation plan now run as
one canonical system. Every non-retired product capability has exactly one expected document
under `devflow/project/capabilities/`, keyed by its depth-1 capability number; `01-foundation`
uses the same shape for shared contracts. Each document has two byte-disjoint ownership
zones separated by the exact `## Verified state` H2. arch or adopt writes the design zone
from confirmed Layer 0, and verify replaces the verified zone only after the capability
passes real execution. The 14-row schema itself filters admissible knowledge, so the prompt
does not grow a second judgment vocabulary for deciding what counts as domain knowledge.

Freshness is now split along the same ownership boundary. `Design head` covers only
product.md, arch.md, and glossary.md and is calculated after those documents land. `Scope
head` covers the literal, duplicate-free union of code scope and consumed paths; an empty
union never runs pathless `git log`. Card-set drift is a separate comparison. Each failed
comparison demotes only its statement group to a hypothesis instead of deleting knowledge or
trusting stale prose. Consumer relationships live only on the consuming capability, use
exact paths plus provider numbers, and produce one bounded status line after provider events;
the system does not invent an unbounded per-consumer regression harness.

The whole lifecycle is wired through the existing skills. product owns capability identity
events; arch and adopt create, re-derive, rename, split, retire, and repair design zones at
explicit commit boundaries; split and work reach one document automatically by the card's
depth-1 number; reviewer receives the same bounded projection and exact listed ADRs; verify
refreshes verified knowledge and metadata as its final commit; resume handles domain questions,
missing or damaged shapes, interrupted transitions, and upgrades; retrospector receives the
authority inputs needed to judge design hypotheses. Exact v0.10 files preserve their verified
bodies, timestamp, covered cards, and scope, but discard the old `Scope head`: it never
covered consumed paths, so migration stores `Scope head: none` and remains a hypothesis until
the capability next passes verification. Legacy card wiring is ignored in favor of number
entry, preventing a second read route.

The former proposal is now explicitly historical; the executable contract lives only in
`baseline-predicates`. The design lineage records the accepted choices and rejected
alternatives, and the new bilingual implementation report records I1–I7, D1–D25, lifecycle
walks, relationship scenarios, a coordinate sweep, every defect repaired during the broad
final campaign, operating instructions, and independent Claude re-review coordinates. The
final pass also removed one README noun compound introduced by the migration explanation.
README tone counts: README.md em-dash 89→92, raw `**` 105→107; README_ko.md em-dash 59→62,
raw `**` 91→93; bureaucratic closure compounds 0→0. The added dashes are heading or defined-
term separators, and the two added raw markers per language form one section-level claim.

Verification: 52/52 Node repository-invariant and extractor tests; structure and
meaning-bearing-figure parity on every registered Korean/English pair; zero Korean in each
English deploy artifact except README.md's single language-switch link; 9/9 skill directories
pass frontmatter validation under UTF-8; tracked and new-file whitespace checks pass. Both
manifests report 0.11.0 and `codex/install.ps1` retains BOM `ef-bb-bf`. The Windows Codex
installer completed, generated all eight slash prompts, and embedded the baseline only in
arch, adopt, resume, and verify. Claude reports the current 0.11.0 plugin with nine skills and
one SessionStart hook, and marketplace validation passes.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `AGENTS.md`; `README.md`;
`README_ko.md`; `codex/install.sh`; `docs/capability-knowledge-proposal.md`;
`docs/capability-knowledge-proposal_ko.md`; `docs/design.md`; `docs/design_ko.md`;
`docs/v0.11.0-domain-knowledge-redesign-report.md`;
`docs/v0.11.0-domain-knowledge-redesign-report_ko.md`;
`scripts/extract-adopt-reference.js`; `scripts/extract-adopt-reference.test.js`;
`scripts/repository-invariants.test.js`; `skills/adopt/SKILL.md`;
`skills/adopt/SKILL_ko.md`; `skills/arch/SKILL.md`; `skills/arch/SKILL_ko.md`;
`skills/principles/SKILL.md`; `skills/principles/SKILL_ko.md`;
`skills/principles/baseline-predicates.md`;
`skills/principles/baseline-predicates_ko.md`; `skills/product/SKILL.md`;
`skills/product/SKILL_ko.md`; `skills/resume/SKILL.md`; `skills/resume/SKILL_ko.md`;
`skills/split/SKILL.md`; `skills/split/SKILL_ko.md`; `skills/verify/SKILL.md`;
`skills/verify/SKILL_ko.md`; `skills/verify/retrospector.md`;
`skills/verify/retrospector_ko.md`; `skills/work/SKILL.md`; `skills/work/SKILL_ko.md`;
`skills/work/reviewer.md`; `skills/work/reviewer_ko.md`; `CHANGELOG.md`.

## 0.10.2 — 2026-08-11 — year-two events get a landing, and the README catches up to the runtime

A completeness audit asked a different question than the defect hunts had: given what this
is for, what is missing? The execution and recovery machinery came back complete, and the
gaps clustered entirely at the events a service meets in its second year rather than its
first week.

Three of them now land through the discovery→update table. **Renaming a capability** used
to corrupt the tree — the folder stopped matching product.md, split's correspondence
restoration minted a second file at the same number, and the integrity check reported a
duplicate with no repair path, while the baseline contract already assumed a rename event no
skill could produce. One row now renames the product row, the same-numbered folder or
waiting file with its body line, the baseline, and every arch.md `Existing records` line
that names the capability, in a single binding-decision commit that also repairs the paths
`Read first` and HANDOFF carry. The number never moves, code paths keep naming what exists
on disk, and the commit lands only while no canonical journal or evidence record names that
folder. **A capability that turns out to be two** had a signal recommending a split whose
only documented landing was incoherent, because the new capability owned code that already
existed and backfilling cards for it is forbidden. It now narrows the product row, appends
the new capability, splits the paths in arch.md's Code structure, and gives the new
capability no folder and no card yet. **A reversed ADR** can be superseded: write the
successor, add a dated update note naming it to the old one, and replace that path in the
cards carrying it. resume's report now names the baseline path when the next stage has one,
so a person can open a domain without holding one of its cards.

The README was two releases behind. 0.9.22, 0.9.23, and 0.10.0 had landed almost nothing in
it, so a documentation audit found 23 factual errors and several mechanisms a human operator
needs but could not learn there. Corrected: resume produces folder closures and a boundary
commit rather than nothing; the journal sweep protects canonical state lines and routes
decisions to their owning skill instead of promoting them; the verdict has three values, not
two; split runs three times before the first capability, with work starting after the
second; the card read set includes product.md and design.md; multi has three standing
habits; reviewer gates the task commit and only the user waives it; the integrity check
moved out of the team section because it runs in solo too. Added: an ownership table naming
every path under `devflow/` with who writes it, who reads it, and when it changes; a **When
devflow stops and asks you** section listing the nine points where a human decides; a
first-time entry in the flow diagram, so the picture no longer answers "where do I start"
with resume; and the three-state-classes principle from v0.9.22, whose absence had made the
whole disk-state layer invisible to a README reader.

docs/design.md records six observations the audit found and this release deliberately leaves
open, including the canon's growth from 217 lines at v0.9.9 to 553, which every skill and
every delegated implementer reads in full. Splitting that read scope by consumer is the next
release's candidate; it changes no on-disk data, so it can wait without a migration.

Verification: two Opus audits (completeness, README accuracy), then a cross-source
verification that found 9 defects at the seams — an incomplete rename guard that could
strand a capability closure unrecoverably, a self-contradictory Code-structure clause, and
seven README claims contradicting their own adjacent text — all repaired and re-audited.
51/51 Node tests; ko↔en structure parity on every pair; zero Korean lines in English deploy
artifacts. README tone counts: README.md em-dash 82→89, raw `**` 84→105; README_ko.md
em-dash 50→59, raw `**` 70→91. The added em-dashes are all the term-definition form, and the
added bold spans are the lead-ins of the new decision-point list.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `README.md`;
`README_ko.md`; `docs/design.md`; `docs/design_ko.md`; `skills/principles/SKILL.md`;
`skills/principles/SKILL_ko.md`; `skills/principles/baseline-predicates.md`;
`skills/principles/baseline-predicates_ko.md`; `skills/resume/SKILL.md`;
`skills/resume/SKILL_ko.md`; `CHANGELOG.md`.

## 0.10.1 — 2026-08-11 — the README explains the baseline to humans; the installers say which Codex home they target

0.10.0 shipped the capability knowledge baseline as machine contract and wiring, with
nothing a person could read to decide whether to turn it on. The README now carries one
section, "Entering a domain — the capability knowledge baseline", placed after the
closing-rite material and before the design principles: what gets written when a
capability closes on a pass, the one `capability_baseline` line in arch.md that turns it
on (and which project shape each value suits), the three devices that keep the file from
going stale (wholesale rewrite, two git-command freshness checks, demotion to hypothesis),
how split and work pick it up without being asked, what little a human does with it, and
the hand-run domain handoff it systematizes. Tone rules applied, counts for this entry:
README_ko `—` 49→50, raw `**` markers 66→70; README `—` 81→82, raw `**` markers 80→84 —
the added em-dash is the new heading's subtitle separator, the added markers are two bold
spans per language, and bureaucratic closure compounds stay 0→0.

Both Codex installers now print `Codex home: <path>` before doing anything, and a second
NOTE line when the `CODEX_HOME` environment variable is set. The reason is an observed
incident: a host tool set `CODEX_HOME` to its own runtime copy of the Codex home, so the
plugin install landed there and the real `~/.codex` silently missed it, with nothing in
the output to show where anything went. The line is visibility only — no path the
installers write to changed.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `README.md`;
`README_ko.md`; `codex/install.ps1`; `codex/install.sh`; `CHANGELOG.md`.

## 0.10.0 — 2026-08-11 — the capability knowledge baseline runs: verified closures write domain blueprints

The v2.2 contract leaves the proposal and enters the runtime. A new canonical companion,
`skills/principles/baseline-predicates.md`, owns the whole machine contract: identity by
capability number (name slug non-authoritative, two format anomalies only, numbers
compared as integers), the blueprint-first 12-section document contract with per-section
caps and a ~140-line total (the first 40 lines are the domain itself; `external` trap
rows are kept out of the split signal), the six-field machine block with two git-command
freshness heads (`:(literal)` pathspecs as quoted arguments, full-object-ID validation,
empty output demotes to hypothesis), the standard refresh set with wholesale replacement
and byte stability, the begin-commit ride with marker-optional recognition of interrupted
states, the `capability_baseline` switch (absent means no; neither flip deletes or
anomalizes files), and the durability rules — shape tolerance without a version field,
the knowledge layer never blocking the execution axis, delete-only human edits, derived
retirement.

Wiring: verify reads the companion and refreshes the baseline inside step 7's begin
transaction (no-op failures report one line to the user and closure proceeds); split
carries one creation-path-neutral rule that wires the baseline and its cited binding-ADR
paths into every new implementation card's `Read first` — maintenance, re-split
replacements, promotion children, prerequisite cards, and fix cards alike; work carries a
self-contained consumption paragraph (three comparisons, the statement-group map, the
recheck-without-expansion rule, a one-line freshness report) and passes the freshness
result to delegated implementers; resume lists the `capabilities/` filenames at step 1;
integrity item 16 detects a baselined capability's card missing the baseline from
`Read first` without blocking tree writes. Both Codex installers embed the companion into
verify and resume only, and the invariants test pins that matrix plus a mis-embedding
guard on split and work. principles grew by the ownership sentence, the begin-ride
recognition, and the brownfield number-derivation rule (product.md's capability list is
now explicitly append-only); arch asks the one switch question; adopt asks it in its
confirmation batch.

Verification: a two-pass Fable campaign (a six-front refuter and an eight-walk literal
simulator) found twelve defects and eleven judgment calls; every one was adjudicated, the
repairs landed as batch C3, and a re-audit of the repairs walked all four begin-commit
kill states to single continuations and surfaced three one-clause conflicts plus one
judgment call, all closed. 51/51 Node tests; ko↔en structure parity on every pair
including the new companion; zero Korean lines in English deploy artifacts. The proposal
pair was micro-synced to the shipped wording. Recorded accepted limits: shallow-clone
false staleness, command-line length on very long scope lists, working-tree invisibility
to the heads, and registry-mediated cross-capability changes.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `AGENTS.md`;
`skills/principles/baseline-predicates.md` and `_ko` (new); all Korean/English SKILL
pairs for principles, product, arch, adopt, split, work, verify, and resume;
`codex/install.ps1`; `codex/install.sh`; `docs/design.md`; `docs/design_ko.md`;
`docs/capability-knowledge-proposal.md`; `docs/capability-knowledge-proposal_ko.md`;
`scripts/repository-invariants.test.js`; `CHANGELOG.md`.
