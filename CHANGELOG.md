# Changelog

All notable changes to devflow, newest first. Format: each entry records **what changed
and why** in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

## 0.9.20 — 2026-08-11 — Codex installs in two remote lines; the handoff rhythm gets its own section

Probing why devflow's Codex install was heavier than comparable skill repositories found
the weight was ours, not Codex's. Two facts, both verified live: `codex plugin
marketplace add` accepts `owner/repo` and Git URLs, so the clone step and the
"don't move this folder" warning were self-inflicted; and plugin-delivered hooks are not
a removed feature — the Codex binary carries `hooks/hooks.json` and `CLAUDE_PLUGIN_ROOT`,
a plugin in real use declares hooks in `.codex-plugin/plugin.json`, and giving devflow the
same manifest made its SessionStart hook fire with the manual registration moved aside.
That refutes v0.9.9's recorded ground for registering the hook separately (recorded in
design.md). New file `.codex-plugin/plugin.json` declares skills and hooks for Codex;
the Claude manifest keeps auto-discovery and gained nothing. README's Codex section is now
the same two lines as Claude's, plus the `[features] hooks = true` prerequisite and the
one-time trust prompt; the slash-prompt channel is documented as the optional extra it is,
reached by cloning and running the installer. The installers remain the local-development
path — AGENTS.md now states the split (users install from GitHub, this repository installs
from disk) and how the hook rides along on each platform.

README also gains a **Handoff** section. Handing over at a moment the user picks is one of
devflow's defining behaviors, and it was only visible as a folder-tree line and a design
bullet: an AI cannot see its own context gauge, so the session signals at observable events
(before a new capability folder, before a long card, at checkpoint commits) and reports the
next step's size, while the decision stays with the user; on the word, decisions confirmed
in conversation land in their documents first and only the volatile remainder goes into
HANDOFF, at a task boundary and never mid-task. Files: .codex-plugin/plugin.json (new),
README{_ko,}.md, AGENTS.md, docs/design{_ko,}.md, .claude-plugin/plugin.json.

## 0.9.19 — 2026-08-11 — the Codex installer confirms what it claims; README install and diagrams reworked

The installer reported "plugin installed" from an exit code while registration had in
fact failed — observed live: one marketplace entry in the user's Codex config pointed at
a folder that no longer existed, and that single dead entry makes every `codex plugin`
command fail, so devflow's native plugin channel was silently absent while the installer
declared success. Both installers now confirm by listing (`codex plugin list` must show
`devflow@nanomia`) instead of trusting exit codes, and when registration does not take
they print the likely cause and the fix. install.ps1 keeps its UTF-8 BOM.

README, both languages. The install section is now one section with two symmetric
subsections: Claude Code takes the GitHub address in two lines; Codex CLI gets the steps
it was missing — clone the repository, keep that folder (it becomes the registered
marketplace), run the script for your OS — plus how to confirm the install and what to do
when a dead marketplace blocks it. The quick-start block added earlier the same day is
removed; it duplicated the install section and the entry-point table. Diagrams were
reworked against actual rendered output rather than source reading: adopt is connected
into the flow instead of floating, entry nodes that duplicated the entry-point table are
gone, cross-subgraph edges are declared after their subgraphs so nodes no longer escape
their boxes, the card lifecycle reads top-down and its promotion branch returns to
waiting instead of dead-ending, the closure diagram now shows the mandatory verdict path,
and labels were shortened or explicitly broken so no word splits mid-render. Structure
parity ko↔en verified (headings 14/14, table rows 39/39, bullets 17/17, fences 26/26,
five diagrams line-for-line); README.md's Korean count stays exactly 1 (the language
switcher). Files: codex/install.ps1, codex/install.sh, README{_ko,}.md,
.claude-plugin/plugin.json.

## docs — 2026-08-11 — README: quick start up front, leaner closure prose (no version change)

README only, both languages. A Quick start section right after the premise (install
commands + which skill to run first), fixing the first-time-reader path that reached
install at the 87% mark of the document. The premise now says the next session reads a
small, fixed set of files. The audit paragraph drops its duplicated philosophy tail
(already stated in The approach), the retrospective paragraph is re-sentenced for
natural reading, and the HANDOFF enumerations gain the missing "next single step"
(matching work's format). Structure parity ko↔en verified (headings 16/16, table rows
39/39, bullets 17/17, fences 26/26); README.md's Korean count stays exactly 1 (the
language switcher). Files: README_ko.md, README.md.

## 0.9.18 — 2026-08-11 — knowledge reachability: what lands on disk must land on a skill's read path

Grounded in cross-corroborated field evidence: a structural diagnosis from the rdsf
project (2026-08-11 — knowledge vanishing at handoff, disproved auto-injected memory
surviving every session, a replan document self-created outside the model and reachable
only through a hand-written HANDOFF pointer), owner testimony (a six-hour
stuck-to-breakthrough conversation omitted from a HANDOFF), and matching traces in ade
(a self-grown reference layer claiming decision ownership until a wrong statement
entered ADR-002; HANDOFF format overflow). Two causes: being on disk is not enough — a
fact off every skill's read path does not exist for the next session; and the only
landing gate (upper-document feedback) fires at card boundaries, so decisions made in
conversation evaporate. Also proven textually: product.md's heaviest sections were the
only ones modifiable with no user gate. The changes, all bounded, zero new terms:
principles — outside-records standing (claims, not canon; report contradictions; the
devflow document wins until confirmed), conversation-confirmed decisions land through
the discovery→update table immediately, a user-confirmation gate on product.md's
identity paragraph · Capabilities · Boundary · success criteria, a disproof row
(replace the statement, or re-run product when the fix is a planning question again —
the next session may take it up), and a means row (a new or changed verification means
lands in arch's verify_channel); work — the feedback gate becomes a pointer to the
canon gate, and a pre-HANDOFF landing check (nothing to land is the normal case);
split — a research answer that is also a tool escapes the throwaway-prototype rule via
a following card; verify — a fail caused by a disproved criterion routes to the
disproof row, not a fix card. Rejected with reasons recorded (design.md): the
observation_cache field (a field no skill reads), promoting "re-baseline" to a canon
noun (0.9.10 collision recorded), HANDOFF format changes, Obsidian-style free linking.
Verified by three independent clean-context lenses (refuter · literal-execution
simulator over 8 scenarios · whole-system coordinate sweep), repaired, re-verified
(all three prior majors confirmed fixed), then locally re-worded per the re-audit.
The maintenance-dependency wording stays an observation item — rdsf's evidence is
suggestive but confounded, so the lineage's activation condition (observed friction)
is not declared met; its prepared wording is upgraded in place (guard, plural, section
pointer). Files: skills/principles/SKILL{_ko,}.md, skills/work/SKILL{_ko,}.md,
skills/split/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md, docs/design{_ko,}.md,
.claude-plugin/plugin.json.

## 0.9.17 — 2026-08-10 — the retrospective also fires at each capability's first closure

Owner direction (2026-08-10) overturned v0.9.16's capability-level exclusion, with
both recorded grounds refuted in the design row: thin evidence is answered by
narrowing the input to the capability (cost thins with it; zero-findings-valid makes
a clean capability's retrospective a fast "no findings"), and early detection —
before dependent capabilities build on the design — is cheaper than MVP-time
detection; the standing-step objection dissolves because the owner specified the
rhythm itself (the planner is human; a check-in per large unit beats running solo).
The retrospective's event list becomes three: a depth-1 capability's FIRST closure
(scoped to that capability — its product.md description, its folder listing and
verify.md; arch.md and journal unchanged; re-closure never re-runs it), the first
product-layer verdict, and user request. Card-level retrospectives remain excluded.
The capability-layer verify.md Retrospective field, previously dead, is now live.
The mid-point observation item is struck as implemented. README: retrospective
paragraph and boundary diagram updated. Files: skills/verify/SKILL{_ko,}.md,
README{_ko,}.md, docs/design{_ko,}.md, .claude-plugin/plugin.json.

## 0.9.16 — 2026-08-10 — the retrospective: a fourth role asks whether the design had better options

Grounded in owner testimony (2026-08-10): AI never doubts the plan it made itself,
reviewer/verifier catch only clear problems, and following the plan downward, better
alternatives go unseen — detection does not happen on its own, which refutes the
premise (the user notices mediocrity) of the "simplification-card experiment first"
observation item; that item is struck with the refutation recorded, satisfying the
lineage gate. An existence check confirmed nothing in the flow asks this question
(reviewer forbids taste, the auditor's two prey presuppose the current design,
feedback corrects facts not choices, maintenance routing and re-baselines fire only
after someone already noticed). New: the retrospective — a fourth role
(retrospector) that fires only after the product-layer verdict is recorded (a
re-baseline's new MVP is a new event) or on user request, reads devflow artifacts
ONLY (product.md, arch.md +ADRs, tree listing, journal, verify.md files — zero code,
reading fully bounded), and evaluates whether the design had better options. The
judgment word is bounded by three finding requirements: a concretely named
alternative; this project's strain evidence as MANDATORY (fix-card clustering read
from tree filenames — verify.md is overwritten; `.stale.` cards; journal lines;
ADRs' dated update comments; unresolved Provisional rows; verify.md audit/fail
records) with generic "measurable improvement" demoted to supplementary; and a switching-cost estimate marked presumed,
grounded on card counts. Findings are not verdicts — nothing is blocked or delayed,
zero findings is valid, only user-adopted findings become maintenance cards or a
re-baseline, declined findings are not recorded. Design provenance: the pre-adoption
validation extracted two fantasy evidence signals from the draft (escape-hatch cards
and provisional churn — unobservable from the declared inputs), closed the
measurable-improvement OR-leg (a manufactured-finding backdoor), rejected an
auditor second mode (opposite blinding axes — one name, two concepts), and priced
the pass at ≈0.5–1 verify-equivalent with zero execution round-trips, once per
project. Adoption condition assessed for the owner: purely additive — no canon
change, no existing mechanism modified, non-blocking, deletion-safe. Files:
skills/verify/SKILL{_ko,}.md, skills/verify/retrospector{_ko,}.md (new),
README{_ko,}.md, docs/design{_ko,}.md, AGENTS.md, .claude-plugin/plugin.json.

## 0.9.15 — 2026-08-10 — the audit: event-triggered deep inspection (third role, findings not verdicts)

Grounded in owner field reports (2026-08-10, running ade): one-pass results leave
holes, and mistakes pass verification unrecognized — the exact class verification
cannot see because it checks against scenarios, signals, and success criteria the
flow wrote for itself. New: the audit, a third role (auditor) beside reviewer and
verifier — reads AND executes, blinded only to implementation history, hunting
exactly two prey (holes on paths the scenario never traverses; expected-but-unspecified
behavior), with reading bounded to executed paths plus the capability's folder
(honoring the no-unbounded-reading rejection). Fires on exactly three events, never
as a standing step: once with product-layer verification; after the closure of a
capability whose verify.md recorded a fail (checked when the closing verify starts —
the runtime application of "the harness grows only on defects actually met": a
cleanly closed capability costs zero); and on user request. Findings are not
verdicts: the pass/fail/unverified trichotomy is untouched, `.done` is never blocked
or delayed, every finding names a concrete failure path or violated expectation with
execution-confirmed marked apart from presumed, zero findings is a valid result,
only user-adopted findings become cards (maintenance routing), declined findings are
not recorded, and re-closure never re-runs the audit (a new leak is a new event) —
the endless-polish loop is structurally closed. verify's role sentences widened to
the three-role split (scenario/regression execution and verdicts stay the
verifier's); verify.md gains an Audit field (doubles as the crash-window marker);
recommended tier T-mid + high effort (exploration, not judgment). Design provenance:
the draft passed a dual independent validation (refutation walk · whole-system
coherence audit) which repaired the trigger anchor (the verify.md-overwrite reading
killed it; the folder-durable reading fired forever — now anchored at
verify-session start), cut the quality prey (unrefuted against the
simplification-card experiment-first lineage), and demanded the reading bound —
walk result: 2 audit runs vs 6 verify runs on a 3-capability project, ≈2–3
verify-equivalents of overhead. README: the approach section's dense balance
paragraph deduplicated into a pointer at the loop table; roles rewritten as a
three-role list; an audit paragraph and loop-table row added. English "finding"
collision swept (split "discoveries", work "measurement", README digest diagram
"discoveries") before minting the finding terminology row. Post-application
verification (two independent lenses — applied-text refutation + literal walk;
README accuracy/flow/parity audit): zero refutations landed on the trigger design,
contract, or convergence devices; repaired from findings — the English "duality"
remnant over three roles, the trigger quote now matching the record template's
casing ("Verdict: fail"), the product-scope referent of the auditor's reading bound,
a user-request scope clause (whole-so-far → product-layer form, the owner's
mid-project top-down usage), README card-lifecycle "signal passed" (was "executed"),
adopt outputs gaining glossary.md, role-file naming unified to "contract file", the
audit cost clause reworded to the harness principle (the old wording rewarded
lenient verification), a stuck-escape row added to the loop table, a tier gloss,
and four dedup/reorder flow trims. Owner guidance folded in: initial plans are
never complete — the audit judges built-vs-expectation, never plan evolution
(evolution's sanctioned paths — provisional table, discovery→update, ADR, drafts —
are untouched). Files: skills/verify/SKILL{_ko,}.md,
skills/verify/auditor{_ko,}.md (new), skills/split/SKILL.md, skills/work/SKILL.md,
README{_ko,}.md, docs/design{_ko,}.md, AGENTS.md, .claude-plugin/plugin.json.

## 0.9.14 — 2026-08-10 — arch derived questions inherit the candidate format (anti-anchoring)

An owner-requested evaluation round on the deferred candidates located the flow's
highest-leverage uncovered point for first-idea anchoring: arch step 2 (stack
questions) forces candidate enumeration (2–3 + recommendation + one-line reason, no
comparison tables, defaults stated), but step 3 (derived questions) — where decisions
like polling-vs-push actually live — allowed single proposals. Step 3 now inherits
step 2's format per decision, by bare reference ("per decision, same format as
step 2"). The shipped wording is the refutation pass's own counter-proposal: the
first draft enumerated part of the format in a parenthetical, which a literal reader
takes as the exhaustive import list (silently dropping no-comparison-tables and
state-defaults), and carried a negative sentence ("never propose only your first
thought") with no failure path the format clause did not already cover — both
extracted pre-commit and replaced by the shorter bare inheritance; the fork
criterion ("decisions that fork because of the chosen stack") pre-filters to
≥2-candidate decisions, so no manufactured alternatives. Also this round,
assessment only — recorded, nothing built: the owner asked whether a larger-unit
top-down re-check after completion ("look down at the whole for holes the maker
did not recognize") already exists. Verdict PARTIAL: the behavioral half is
designed (capability close runs one scenario + one hostile boundary input + full
folder regression + a declared-style skim, in a maker-blind context), while the
sample width beyond that, spec blind spots at MVP close (verification against
self-authored success criteria), and beyond-declared-style quality are not; the
loop-risk analysis found the convergence machinery is execution-shaped (no
pass-with-findings verdict slot, no zero-findings-valid clause anywhere in the
deploy skills, no re-run narrowing rule for a full pass at re-closure) — so a
grafted holistic pass would risk exactly the endless-polish loop the owner fears.
Recorded as two design-doc observation items for a future design round. Files:
skills/arch/SKILL{_ko,}.md, docs/design{_ko,}.md, .claude-plugin/plugin.json.

## 0.9.13 — 2026-08-10 — stuck-escape: in-card fixation gets an exit (research-grounded)

A research round (four lower-tier collector agents: methodology landscape · academic
results · practitioner field reports · harness-minimalism evidence, prioritizing the
last month) concluded the architecture needs no replacement — recent controlled
results land on exactly devflow's boundary (feedback structure like verify channels
and executable signals helps at every model tier; procedure prescription hurts strong
models) — and located one gap, matching the owner's felt friction: the failure ladder
counts only card re-dispatches, so a main session grinding inside one card on the
same hypothesis trips no rule. Grounding: agents repeat identical actions in 58.4% of
clean trajectories and fail to revise hypotheses on feedback (StressWeb); behavioral
"you are looping" advisories rescued 0/13 stuck runs while a single
causal-interpretive sentence rescued 7/7 (controlled study); practitioners
consistently report fresh restarts beating continued iteration. Adopted, with the
wording first hardened by a pre-application literal-walk/refutation simulation that
extracted five defects from the draft (a self-classification gaming hole → an
observable event floor "same command, same error, twice"; "execution" → "fix
attempt" so instrumented reruns stay legal; an unconditional two-option menu → gated
on "the hypothesis still stands"; card "conversion" → research-card insertion with a
Depends edit; the diagnosis briefing inheriting reviewer's progress-log exclusion so
the failed hypothesis cannot anchor the fresh diagnoser): (1) canon — the ladder's
first rung now defines reinforcement as the failure's causality (1–2 sentences: what
failed, why, with what consequence), not added instructions, and the ladder declares
its counting unit (per card re-dispatch; in-card attempts belong to stuck-escape).
(2) work — a new event-based "Stuck-Escape" section: stop before the third fix
attempt under an unchanged hypothesis, write the hypothesis and its refuting evidence
as one log line, and only if the hypothesis survives that line choose between
inserting a research card (minimal reproduction as deliverable) or a clean-context
diagnosis. Deferred with recorded re-evaluation conditions (design docs, observation
items): competing attempts as an execution-proposal option (test-time-scaling
evidence vs judge bias and cost — trigger: repeated third-rung exhaustion), and a
simplification-card usage experiment for post-closure mediocrity. Checked and upheld
without change: the self-evolving-harness rejection (new gains are mid-tier-model
evidence and do not refute the philosophy ground), the TDD rejection, file-tree state
over JSON trackers. Terminology: stuck-escape · cause hypothesis. Verification:
post-application independent refutation + literal walk on the canon and work changes —
3 findings, all repaired: the ladder-counting sentence was rescoped to
same-hypothesis fix attempts (its general form falsified verify's and the review
loop's standing ladder citations), stuck-escape gained the delegated-implementer
scoping clause from the hierarchy precedent (both exits are main-session powers —
a multi-mode subagent cannot land a card issuance), and one ko↔en drift aligned
("causes stuckness"). Four mild judgment calls accepted as residuals (ladder heading
breadth, a pre-hypothesis floor fire, the diagnosis briefing leaning on the verifier
precedent with no fixed return format, "in front" realized by the Depends edge).
Korean scan, installers rerun. Files:
skills/principles/SKILL{_ko,}.md, skills/work/SKILL{_ko,}.md, docs/design{_ko,}.md,
AGENTS.md, .claude-plugin/plugin.json.

## 0.9.12 — 2026-08-10 — Layer 0 draft clause; unminted settling cards; two canon copies deleted; contradiction re-route attempted and reverted

Owner adjudication of the four deferred judgment calls, with a canon-grade refutation
pass that reversed one of them mid-round. (1) The arch→adopt routing sentence for the
partial-docs state is RETRACTED, not applied: its trigger ("code exists") cannot
distinguish a mature brownfield from a greenfield project that has merely started
coding without introducing a judgment word, and greenfield arch must keep
interviewing — the state is rare and self-correcting. (2) Provisional-table settling
cards gain an honest placeholder: at arch time the tree does not exist, so the old
rule forced a literal reader to invent a plausible card number — fabricated
bookkeeping of exactly the kind the owner observed in the field. arch now writes
'unminted' when the settling card's number is not yet known (no tree, or its layer
not yet opened — the refutation pass widened this from "no tree", which an arch
re-run falsified), a new discovery→update row sanctions the replacement, and split —
when opening the layer that resolves a row — creates the settling card and fills the
number. Known bounded gap, recorded: a row no layer ever resolves lingers visible in
arch.md with no terminal gate — the prior fabricated-number path was equally orphaned
and also lied. (3) Of the three canonical-duplication deletion candidates, two
deleted (verify's closing restatement of the iron rule — the load-bearing copy stays
in verifier.md, which briefs clean contexts that never read the canon; work's two
verbatim commit/rename parentheticals became pointers to the canon sections) and one
KEPT: split's "evidence left in the tree only helps if someone goes and gets it" is a
why-sentence sanctioned by prompt principle 3, not a rule copy. (4) The contradiction
re-route (discovery→update table instead of steps 1–4) was applied, REFUTED, and
REVERTED within the round: the independent pass showed the table path loses steps
1–4's side effects (staling, re-split) and lacks landing rows for several wrong sides
(design.md; an existing code-style line; a runnable-but-wrong signal). The original
paragraph is restored byte-identical; the sentence-collision deadlock stays open, and
the re-proposal conditions are recorded in the design doc's rejection lineage. What
DID ship for the owner-witnessed freeze is the draft clause: documents still being
produced by a running product/arch/design/adopt session are drafts until user
confirmation — draft contradictions are fixed in the draft on the spot, and edits to
already-inherited upper documents join the same confirmation batch (the Layer 0 case,
where the freeze was actually observed; refutation: zero defects, two mild notes).
Terminology rows added (unminted · settling card) plus an AGENTS note that arch's
'Settled by' header is the column form of settling card. Verification: refutation +
literal walk on the canon changes (5 defects → 1 revert, 1 repair, 1 recorded gap;
draft clause and deletions clean), re-audit of the repairs, Korean scan, installers
rerun. Files: skills/principles/SKILL{_ko,}.md, skills/arch/SKILL{_ko,}.md,
skills/split/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md, skills/work/SKILL{_ko,}.md,
AGENTS.md, docs/design{_ko,}.md, .claude-plugin/plugin.json.

## 0.9.11 — 2026-08-10 — whole-corpus audit: verifier blindness sealed, a term un-collided, hook detector fixes

An owner-prompted trust check ran two fresh lenses over the whole corpus
(cross-document contradiction audit · capable-reader lifecycle walk). Every finding
below predates 0.9.10 — escaped defects, not regressions. Fixed: (1) the Korean term
for "work tree" collided two concepts — the devflow card tree vs the git working
tree; verify and the
verifier contract now say "the work server (the one running the currently checked-out
code)". (2) The verifier's input included the whole card, whose progress log narrates
exactly the implementation history the same sentence forbids handing over — input is
now the card with its progress-log section removed, mirroring the reviewer's existing
exclusion. (3) Integrity-check item 6 now also flags a root devflow/HANDOFF.md in
multi mode — canon prose and README already called that state an incomplete
transition, but the checklist omitted it. (4) resume's integrity-check line now names
the canonical-rules path (resume deliberately skips the read-canon-first opener, so
the checklist's location was unstated for a literal reader). Hook, code only: the
identity-unresolved message now matches the canon (create a room, not pick one), the
verify.md exclusion matches only the exact record filename (a legitimate card named
...-auto-verify.md was silently dropped from pending and duplicate-number checks), and
HANDOFF truncation at 6000 chars is no longer quiet — a ⚠ line instructs reading the
file in full, because the format's tail section is open decisions (fixture-tested:
oversized HANDOFF and an auto-verify card). Deferred as judgment calls, recorded not
applied: pre-tree settle-card numbers in arch's Provisional table; brownfield
first-closure scenario scope (adjudicated acceptable as-is); three
canonical-duplication deletion candidates in verify/work/split. Also caught live
during the reinstall: the installers' cleanup step called `codex plugin remove
devflow` bare, which Codex rejects (it requires plugin@marketplace), leaving the old
plugin in place and failing the subsequent add — both installers now remove
`devflow@nanomia`; rerun verified idempotent. Files: skills/verify/SKILL{_ko,}.md,
skills/verify/verifier{_ko,}.md, skills/principles/SKILL{_ko,}.md,
skills/resume/SKILL{_ko,}.md, scripts/session-start.js, codex/install.{ps1,sh},
.claude-plugin/plugin.json.

## 0.9.10 — 2026-08-10 — brownfield entry becomes its own skill: adopt (split out of arch)

The owner judged the brownfield entry unintuitive and adjudication against the text
agreed: arch carried two concepts under one name — development planning, and
whole-Layer-0 reverse-derivation for existing code — which killed entry
discoverability (the derivation trigger lived only in the tail of arch's description)
and left the seam ambiguous (a literal reader could not settle whether arch's
interview sections and verify-channel gate applied after the brownfield block). The
alternative — running the greenfield product→arch pair with brownfield branches —
was rejected: derivation is one code-reading act yielding all three documents,
splitting it forces either double reading or a mid-flow handoff artifact (the
rejected half-truth), and it would transplant the same two-concepts-one-name defect
into product. New skill `adopt` (its Korean name is the word the Korean README
already used for this event; "adopt" verified as standard developer vocabulary: Nx
"Adopting Nx", Next.js/React "Incremental Adoption", Tech Radar's "Adopt" ring) now
owns the procedure. Content moved verbatim from arch — 0.9.8's field split and
"re-interviewing is waste" verdict stand; genuinely new text is bounded: an
applicability guard (complete project/ = re-baseline via product·arch re-run;
partial = respect existing docs, derive only the missing), an evidence-order line
(code > existing docs as claims > commit history), an explicit verify-channel-gate
pointer into arch (resolving the old ambiguity), and a design-skill note (existing
screens are the de-facto design canon). Entry pointers updated in split, resume,
README (flow table, mermaid, first-step, skill table 8→9), design docs, and the
Codex fallback block. The installers embed the product and arch skill bodies into
the generated devflow-adopt prompt (flat-folder grounds, same as the canon
embedding); the plugin channels pick the new folder up by convention. Verification:
mechanical loss-check of the arch diff against adopt (every removed line accounted
for), plus an independent-context campaign per AGENTS.md — refuter (5 findings),
literal-execution walk (2 + 1 inherited observation), coordinate sweep over entry
situations × guidance surfaces (matrix clean except one shared gap candidate) — the
expected first-pass pattern for round-written text. Fixed: step 4 gained the arch
"Output 2" format pointer (the one derived artifact without a format anchor, and the
"default values" antecedent), the description trigger "understanding an existing
codebase" narrowed to derivation-with-adoption-intent, the re-baseline term dropped
(it collided with resume's digest re-baseline), step 5's folder alignment now names
split as the tree opener, the design-row "no content change" claim corrected to the
bounded-new-sentences list, marketplace.json description aligned with plugin.json.
Deferred as judgment calls (recorded, not applied): routing the
partial-docs-with-existing-code state from arch/split into adopt (both currently
branch only on product.md missing), and an explicit stop verb on arch's redirect.
A re-audit pass over the fixes surfaced two residuals, both repaired: the English
design row's "moved verbatim" overclaim (now anchored to "per the 0.9.8 decision")
and the mid-way trigger naming a devflow project instead of a code-bearing one (the
already-complete guard now also points continuation to resume). Files: skills/adopt/SKILL{_ko,}.md (new),
skills/{arch,split,resume}/SKILL{_ko,}.md, README{_ko,}.md, docs/design{_ko,}.md,
codex/AGENTS-devflow{_ko,}.md, codex/install.{ps1,sh}, AGENTS.md,
.claude-plugin/plugin.json, .claude-plugin/marketplace.json.

## 0.9.9 — 2026-08-09 — Codex install leads with the native plugin channel (installers · marketplace)

The owner asked whether either platform was being installed through a legacy channel.
Audit results: Claude — everything current per the official plugin docs (hooks.json,
${CLAUDE_PLUGIN_ROOT}, convention-based skills discovery), one fix: marketplace.json
gained its recommended top-level description (this was the standing validate warning).
Codex — the prompts-only channel WAS legacy: Codex now supports native plugins and
model-invocable SKILL.md skills (features `plugins` and `skill_search` stable), and
probing confirmed both that `codex plugin marketplace add` consumes our Claude-format
marketplace directly and that a clean Codex session recognizes all 8 devflow skills by
name — restoring auto-invocation parity that prompts (user-typed slash commands,
frontmatter stripped) could never provide. The installers now set up three channels:
native plugin (marketplace add + plugin add, idempotent remove-then-add), the slash
prompts as the explicit channel (unchanged mechanics), and the SessionStart hook —
still registered via ~/.codex/hooks.json because plugin-delivered hooks are a removed
Codex feature. Recurrence guard: a new pre-flight checklist item requires install
channels to target each platform's current native mechanism, re-verified when
platforms update. Also repaired in passing, with the owner informed: a dangling
`scroll-world` marketplace entry (path no longer exists) was blocking every
`codex plugin` command and was removed. Files: codex/install.{ps1,sh},
.claude-plugin/marketplace.json, README{_ko,}.md, AGENTS.md, docs/design{_ko,}.md,
.claude-plugin/plugin.json.

## 0.9.8 — 2026-08-09 — brownfield product.md reaches field parity (arch) + README first-step and loop-mechanics visuals

The owner questioned whether starting brownfield adoption at arch starves the project
of product knowledge. Adjudicated against the text: structurally no — arch's brownfield
procedure already reverse-derives a product.md, and split refuses to run without one —
but the condensed form (identity + capability list) left real consumers unserved:
verify's product layer checks "every success criterion in product.md," work's
upper-document feedback names success criteria as settle targets, and code cannot
answer why/direction/will-not-build at all. Step 2 now derives product.md in the
product skill's output format: code-answerable fields by derivation (identity,
capabilities with one-line descriptions, Boundary's MVP scope — what is built is the
answer, screens & access points, interface), code-blind fields asked of the owner in
the same single batch (will-not-build · success criteria · Problem/Approach gaps),
unanswered items left in Open questions, never invented. Full product-interview parity
was deliberately NOT adopted — re-interviewing what code answers is the recorded
waste. README: a "first step" walkthrough (fresh vs adopting into existing code) and
the work ⇄ verify bullets replaced by a loop-mechanics table (where the loop turns /
what changes before the retry / what each pass leaves behind — no loop circles in
place). Verification: one adversarial pass on the rule change (4 targeted checks
clean; 1 finding — the MVP-scope subfield unassigned to either bucket — fixed) and a
fact-check on the README walkthrough (1 finding — "the why" under-stated the Approach
gaps — fixed). Files: skills/arch/SKILL{_ko,}.md, README{_ko,}.md,
.claude-plugin/plugin.json. Codex prompts regenerated.

## 2026-08-09 — docs only: README opens with the approach (no version change)

The README jumped from the memory hook straight into structure — a first-time reader
got mechanics before stance. A new section, "The approach — rich direction, minimal
harness," now opens the body: what devflow makes explicit (Destination · Forbidden ·
completion signal · Coordinates/Identity) versus what it leaves to the model, the
harness-dial baseline note, and the balance the system aims at (structure without
weight; the same failure never repeated the same way; the harness grows only on a
defect actually met). An independent fact-check pass compared every sentence against
the rule files — 5 findings folded in before landing: the T-low harness-dial
qualifier added under the table, "implementation history" restored (the reviewer does
read the code — it never sees the process), and the regression claim rescoped to the
skill's own wording ("regression reruns it from then on"). Files: README_ko.md,
README.md.

## 2026-08-09 — docs only: install path fixed to the published repository (no version change)

First publication to GitHub (nanomia-ai/devflow). The README's marketplace-add line
said `nanomia/devflow` — a placeholder from before the org existed; both READMEs now
point at `nanomia-ai/devflow`. The marketplace name (`devflow@nanomia`) is unchanged —
it comes from marketplace.json, not the repo path. Files: README_ko.md, README.md.

## 0.9.7 — 2026-08-09 — rename gate aligned with the canon's qualifier (work)

Found by the whole-flow coordinate sweep that closed the 0.9.4–0.9.6 campaign (card
kinds × gates, 20 cells): work's rename step abbreviated the canon's `.done.` condition
to "the completion signal and review passed," dropping the qualifier that exempts cards
whose review is skipped by rule — a literal reader could dispatch a pointless review on
a research card just to satisfy the gate. The parenthetical now quotes the canon
verbatim: "the review that applies to the card." Every end-to-end walk of the campaign
(E1–E6: full lifecycle, verify-fail → fix card → re-closure, delegation, evidence-wait,
research card, fix-on-fix) passed with no other finding. Files:
skills/work/SKILL{_ko,}.md, .claude-plugin/plugin.json. Codex prompts regenerated.

## 0.9.6 — 2026-08-09 — role contracts unified: one file, every platform, no registration (work · verify · installers)

The owner challenged the platform asymmetry that survived 0.9.5: Claude got the role
contracts as registered agents, everyone else a summary. Verified empirically before
redesigning — an A/B/C test ran one review fixture with 4 planted defects through the
registered reviewer agent (×2), a prompt-briefed generic Claude subagent (×2), and
Codex CLI given the same briefing (×1): all five runs detected 4/4 with the same bonus
findings and full contract adherence. Registration's assumed robustness edge was not
observed; the one thing that DID fail was ad-hoc transport (shell interpolation
truncated a briefing — the Codex session recovered by reading the file itself). Three
repositories were surveyed for mature patterns (mattpocock/skills, obra/superpowers,
Q00/ouroboros — structure ideas only, no text borrowed): superpowers, the most
multi-harness-mature, ships no registry and keeps contract prompt files beside skills.

So: agents/reviewer.md → skills/work/reviewer.md and agents/verifier.md →
skills/verify/verifier.md (git mv; _ko pairs moved beside them; agents/ and ko/
folders retired; agent frontmatter stripped — they are briefing documents now, not
registrations). work and verify dispatch identically on every platform: brief a clean
context with the contract file **verbatim — never summarized** plus the fixed inputs;
the 0.9.5 inline term summaries and the Claude/elsewhere fork were removed as
duplication whose failure path had disappeared. The Codex installers now embed every
non-_ko companion .md of a skill folder into that skill's generated prompt and repoint
"`<file>` beside this skill" to the embedded section (the principles pattern,
generalized). AGENTS.md pair table and Korean-check list updated; the "never put agent
Korean files inside agents/" hazard retired with the registry. The decision, the
Plan-B rejection, and a transport observation item are recorded in docs/design.md.
Files: skills/work/{SKILL,SKILL_ko,reviewer,reviewer_ko}.md,
skills/verify/{SKILL,SKILL_ko,verifier,verifier_ko}.md, codex/install.{ps1,sh},
README{_ko,}.md, AGENTS.md, docs/design{_ko,}.md, .claude-plugin/plugin.json.
Codex prompts regenerated and the generated output inspected.

## 0.9.5 — 2026-08-09 — role terms made platform-neutral (work · verify · README)

An owner report caught the README claiming the two agents are "Claude only — not part
of the Codex install." That was literally true of the packaging, and that is the
defect: the installers convert only skills/*/SKILL.md, so the parts of the reviewer
and verifier terms that lived solely in agents/*.md (never execute / never fix, the
taste exclusion, speculative marking, a fail reported with reproduction steps) never
reached non-Claude platforms — the same prescribed process ran under thinner terms.
The fix follows the recorded principles-in-skills logic (what must travel lives in the
skill text): work's review step now states the reviewer terms; verify's bias-removal
section states the verifier terms platform-neutrally and defines the Claude agents as
their packaging; the README paragraph now says the process is identical on every
platform. agents/*.md unchanged — they restate the same terms, and drift between the
two is a defect (decision recorded in docs/design.md). Files:
skills/work/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md, README{_ko,}.md,
docs/design{_ko,}.md, .claude-plugin/plugin.json. Codex prompts regenerated. The
wording survived an adversarial pass — 3 minor findings: the execute obligation made
explicit in the verifier terms, the English README aligned to "execute" (it had coined
"runs"), and the reply-layout delta (the agents' fixed return shapes) adjudicated as
packaging, since the verdict triad and evidence-recording obligations already ship
platform-neutrally in the skill.

## 2026-08-09 — docs only: README gains the work ⇄ verify loop section (no version change)

Between work and verify the README named the two agents but never showed the loop
geometry. A new subsection under "The 8 skills" draws the inner loop (implement →
signal → review → commit, with the fix path re-running the signal) and the outer loop
(scenario + regression → verdict, with fail birthing a reproduction-signal fix card),
then states the three ways the loop improves and the outcome it drives (a defect met
once cannot escape again; the harness grows only on real defects). Files: README_ko.md,
README.md.

## 0.9.4 — 2026-08-09 — loop closure: signal freshness + fix-card reproduction signals (work · verify)

Two literal-walkable gaps in the work⇄verify loop, flagged by an external
loop-engineering review and confirmed against the text before adoption:

- work: after a review objection was fixed, nothing required the completion signal to
  run again — a pre-fix pass could ride into the commit as stale evidence (the verified
  code being version A, the committed code version B). The loop's review step now
  states: a fix that changed the diff re-runs the signal — against the changed code, an
  earlier pass is unverified (the iron rule's own vocabulary; no new status word). The
  delegation stage split names the owner of that re-run (main, for its own fixes) —
  two independent verification passes hit the same seam, which earned the parenthetical.
- verify: a fix card's completion signal had no tie to the failure that created it — a
  weak signal ("build passes") satisfied the letter. A fix card born from the verifier's
  fail now carries those reproduction steps rerun through the channel — the escaped
  defect becomes a signal and joins every future regression rerun. This is the only
  self-improvement adopted: the harness grows exactly one step when a real defect
  escaped, never for imagined risk. Not red-green reintroduced — the failing "before"
  evidence already lives in the verify record; work still runs the signal once.

Verification: the review's cited papers checked against arXiv (the two load-bearing
results match to the digit; one paper's claimed numbers are absent from its abstract and
were dropped from the rationale); a fresh-literature sweep supported both rules
(evidence-freshness gating; failures promoted to regression checks) and flagged
regression-set growth as the cost to watch. Draft wording survived refuter +
literal-walk passes (12 findings folded in — v1's "failing before / passing after"
clause was deleted as a red-green reading colliding with the recorded TDD rejection);
the applied text was re-audited with fresh lenses (capable-reader walk + over-harness
audit): one garden-path phrasing fixed in the English delegation parenthetical, all
additions judged clean. Rejection lineage (graph engineering, root-cause stage,
held-out gates, harness self-evolution) and two field-observation items
(intermittent-failure reproduction power, per-folder regression cost growth) recorded
in docs/design.md. Files: skills/work/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md,
docs/design{_ko,}.md, .claude-plugin/plugin.json, CHANGELOG.md. Codex prompts
regenerated locally.

## 2026-08-09 — docs only: maintenance protocol hardened (no version change)

AGENTS.md verification protocol: two items amended, two added, distilled from the 0.9.x
campaigns — lens differentiation + "zero findings is valid" for verification agents
(item 1); sanctioned-exceptions-outside-the-canon added to the watched defect classes
(item 5); walks-vs-coordinate-sweeps geometry — narrative simulations prove walked
paths only, structural changes get a coordinate sweep, external reviews are adjudicated
against the text (new item 6); honest reading of finding counts — first-pass findings
on new text are the pattern working (new item 7). The Korean-check definition now names
the tool directly (ripgrep run directly or a Perl scan — proxied grep rewrites
false-positive here); Releasing gains the CLI reinstall command. The additions were
themselves refuted before landing (11 findings applied across AGENTS.md and the new
kickoff prompt).

## 0.9.3 — 2026-08-08 — research-card path closed (verify · split · work · principles)

Three gaps on the research-card axis, reported by an external session's review and
adjudicated against the actual text (one claim reported as a literal contradiction was
downgraded to an undefined relation — task card and research card are distinct named
concepts, so principle 7 never bound research cards; what was missing was the
declaration). No prior verification round had walked this axis — narrative walks only
find defects on paths they take, which is also why these survived earlier convergence.

- verify: a research card's completion signal ("answer + evidence recorded in the log")
  is a record, not a run — regression no longer demands a re-execution the verifier is
  forbidden to perform (it may not read documents); the main session confirms the record
  instead (a document axis). The verify.md regression line now counts rerun,
  substituted, and confirmed signals.
- principles + split: principle 7 (identity re-injection) gains its exception in the
  canon — research cards carry no Coordinates or Identity (the log freezes once the
  answer lands); Depends · Read first · Tier remain usable. Declared in principles,
  where every sanctioned exception lives — a split-only declaration would lose to the
  canon on conflict.
- split + work: the review gate is one rule stated identically at both ends — research
  cards are not review subjects (the deliverable is an answer, not code), with the same
  limit on both sides: a diff touching the real code does get reviewed (work's bare
  exemption would have blanket-covered a prototype leaking into real code).
- principles: "authorized exception" unified to "sanctioned exception" (one concept,
  one word).
- The wording was attacked by a refutation fork before landing (7 findings applied —
  among them: the exception must live in the canon; "complete with two fields"
  over-exempted Depends/Tier; "question card" coined a second name; "no code to review"
  was a false ground).

## 0.9.2 — 2026-08-08 — balance audit: philosophy-axis review + flow simulation

Prompted by the owner's concern that this session's high finding count might indicate
over-interpretation, two independent reviews ran with opposite lenses: an over-harness
audit (forbidden from proposing more specification) and a capable-AI flow simulation
(three full walks: solo lifecycle, multi collaboration, death-and-resume). Verdict: the
0.9.1 additions are invariants, not rigidity — every promotion step has a concrete
failure path if deleted; flow fit rated 9/10, "no decorative rituals". Changes:

- split: deleted the ".done." sentence from promotion step 5 — a weaker duplicate of the
  canonical rules (it had already drifted: the commit-landing condition was missing) /
  "frontend is always sequential" relaxed to "frontend work sharing a dev server is
  sequential" — the rule now dies with its reason instead of outliving it
- verify: the capability scenario's origin defined (the main session composes it from
  product.md's capability description and the cards' Destinations) — "read" had sent
  sessions searching for a document that never exists
- resume: read 3 gains the uncommitted-changes cross-check (a session that died mid-card
  leaves uncommitted code; the log alone can overstate progress)
- AGENTS.md: the verification protocol gains the reverse defect class — a sentence whose
  deletion breaks nothing is a defect too; every added sentence must name its concrete
  failure path (counterweight to adversarial review's one-way pressure toward more text)
- README pair: the card state diagram gains the waiting→promotion transition (promotion
  at opening was documented in split but missing from the diagram)
- Deliberately left unchanged (reviewed; fixing judged to be over-polish): arch's
  browser-MCP halt, the claim "visibility" phrasing, the `wip:` checkpoint message on a
  suffix-less card
- A full re-verification on the applied text then caught the relaxation failing to reach
  its replication sites: work still declared "same conditions as split" over the old
  absolute sentence, and split's own general condition ("don't touch the dev server",
  singular) made the relaxed sentence unreachable — both aligned to "a shared dev
  server"; resume's new "mid-card" unified to the existing "mid-task"

## 0.9.1 — 2026-08-08 — promotion of in-progress cards defined (split · principles)

The promotion procedure distributed only Destination·Why, so promoting a card with a
non-empty progress log destroyed the log — violating "if the session dies at any moment,
reading this file alone must be enough to take over" — and in multi mode the claim
suffix vanished, leaving children born unowned. Found by the v0.9.0 literal-execution
audit; the draft wording was then attacked by a refutation fork, which extracted 10
findings — all applied. Key ones: the git guarantee requires a checkpoint commit before
the file disappears (an uncommitted log would die with it); the trigger keys on a
non-empty log, not the `.wip.` suffix (released cards keep their logs; multi suffixes
carry an id); the in-progress portion moves into the continuing child's progress log —
conclusions alone are not enough to resume; the inherited suffix is born inside the
promotion commit, closing the claim race window; promotion is an immediate dedicated
commit (`NN.N promote`); a promotion's child numbers count as minting.

A full-repository final verification then ran on the applied text and extracted 10 more
findings — chiefly: the checkpoint commit was ordered after the file's transformation
(the very window it exists to close), and the suffix inheritance was trapped inside the
non-empty-log branch, so the most common path (claim → read → discover it is too big,
log still empty) lost the claim. The procedure was restructured into 7 steps with the
checkpoint first and the suffix rule as an independent condition.

- split: promotion procedure is now 7 steps — multi minting declaration in the preamble /
  1 checkpoint commit (if log non-empty) / 2 transform / 3 distribute the card head
  (Destination · Why · Forbidden · Depends · carried quotations) / 4 numbering /
  5 suffix inheritance (independent of the log; the inheriting child is born inside the
  promotion commit) / 6 log contents (conclusions → affected children's `Read first`;
  in-progress portion → the inheriting child's progress log, or a quotation if no child
  continues) / 7 immediate dedicated commit `NN.N promote` (multi: binding decision) /
  the minting clause covers promotion child numbers
- principles: the discovery→update table's promotion row points to split's promotion
  procedure / the binding-decision "nothing else rides along" rule gains its authorized
  exception (the promotion commit carries the claim-suffix inheritance)
- resume: the prefixed-commit enumeration gains promote / work: the solo "rename rides
  the next boundary commit" rule notes that riding a wip checkpoint commit is fine

## 0.9.0 — 2026-08-08 — rename to devflow + documentation restructure for publication

- **Renamed nano-devflow → devflow** (plugin name, Codex command prefix `devflow-*`,
  hook messages, installers). Reason: commands were needlessly long in real use; the
  namespace/prefix structure is unchanged, so collision blocking still holds. The Codex
  installers now also delete old `nano-devflow-*.md` prompts on install.
- **DEVLOG.md retired and split by role** (an AI-reader-focused restructure — one file
  was serving four audiences):
  - design philosophy, key decisions, rejection lineage, observation items, on-hold list → `docs/design.md`
  - maintenance gate, dual-language workflow, verification protocol, terminology table → `AGENTS.md`
    (+ `CLAUDE.md` as a one-line import — single source, per the observed ecosystem practice)
  - append-only version log → this file
  - the volatile "current state / next input" section was dropped from the repository —
    it was per-user working state, not project documentation
- **README rewritten for GitHub** — English `README.md` + Korean original `README_ko.md`;
  visual-first (mermaid flow/state diagrams, annotated file trees), install paths no
  longer reference a local absolute path.
- **LICENSE added (MIT)**; plugin metadata (plugin.json, marketplace.json descriptions)
  translated to English (deploy artifacts must contain no Korean).
- Housekeeping: the on-hold item "codify verify.md re-verification overwrite" was removed
  as already resolved — v0.8.2 added the rule to both SKILL_ko.md and SKILL.md (verified).
- Verification: two adversarial audits ran on the restructure itself (content-loss
  old-vs-new comparison + literal-execution simulation of a fresh maintainer and a fresh
  README visitor); ~30 findings applied before release, then the fixes were re-audited
  (6 further findings, also applied).

## 0.8.3 / 0.8.1 — 2026-08-08 — audit follow-ups (logged post-hoc)

v0.8.1: two post-hoc audit fixes — removed resume's hard-coded "5 items" for the
integrity check (the list had grown to 8, and a literal-minded AI would skip the
multi-mode items), and made work's commit line explicit about the multi-mode prefix (protects
digest's "my commit" classification).
v0.8.3: two re-audit fixes on the fixes — clarified the subject of integrity item 8
("the author, not the claimant" — otherwise a teammate's normal commits are all reported
as anomalies, a noise defect), and labeled the reassignment rule as "the authorized
exception to claim inviolability".
(This entry was logged post-hoc — the log was missed at commit time and recovered during
a session-handoff evaluation.)

## 2026-08-08 — docs only: observation item detailed (no version change)

Verified the gap where carry-forward reading does not fire on maintenance reopening —
improvement possible (reuses Depends targeting, no side effects confirmed). Recorded the
confirmed wording alongside the rejected form (unbounded skimming → read explosion) in
the observation items. Application deferred until real-use friction. No skill text changed.

## 0.8.2 — 2026-08-08 — two full simulations reflected (session dynamics + full lifecycle)

Re-verified on the 0.8.1 deployed text with two forks: ① multi-mode multi-day work
simulation (S1–S7) ② solo full lifecycle unrelated to team features (new → MVP →
maintenance, L1–L6). Zero structural rework; 12 local wording fixes:

- principles: resolved the conflict between boundary commits and binding decisions
  (documents already landed on integration must not re-board) / excluded renaming my own
  card's state from the binding definition / stalled-claim reassignment rule (release →
  re-claim, only on user instruction)
- work: restored the solo no-change guarantee — solo renames ride the boundary commit;
  claim commits are multi-only (message `<id> NN.N claim`) / capability-layer verify
  proposals limited to layer-1 capability folders (blocks misrouting to foundation and
  intermediate folders) / progress-log section excluded from review input (fixes a
  self-violation of the no-history premise)
- resume: digest's "my commit" classification simplified to the prefix criterion
  (prevents misclassifying boundary/claim commits)
- verify: remote-only signals (CI) may substitute evidence in both modes / journal sweep
  widened to full scope (resolves ownerless foundation-era and cross-cutting lines) /
  product-layer record home fixed at `devflow/tree/verify.md` + re-verification
  overwrites confirmed / proportionality clause for reopen-then-reclose (scenarios may
  shrink; regression stays full)
- arch: integration/merge lines marked solo-skip / reviewer: progress-log exclusion codified

## 0.8.0 — 2026-08-08 — multi mode (multi-user design split by scope of truth)

Under the premise of partial adoption (only some teammates use devflow), a design that
solves no-conflict-among-adopters and awareness-of-non-adopters' work at once. Four
candidates (A shared+ID / B′ gitignored-private+public-notes / C per-user folders /
D unified) each attacked by refutation forks (5 rounds total, real defects extracted
every round); D adopted — **the split axis is the scope of truth, not people**: documents
with a single truth (project·tree·journal) are shared; only person-owned state
(HANDOFF·marker·identity) is isolated into rooms (users/<id>/).

- principles: new "mode and identity" section (owner.md existence = multi, solo no-change
  guarantee / git identity → room mapping, unresolvable sessions are read-only /
  only `.wip-<my id>.` is my work / 4 transitions: join, solo→multi, leave, multi→solo,
  each a single commit) / claim·release in state notation / integrity check +3 items
  (ownerless claim · duplicate identity · trespass on another's claim) / commit
  discipline: id prefix, binding decisions, double-claim loss adjudication, number-collision
  repair (mid-insertion), journal union merge, no squash
- resume: new digest section (boundary gate — resuming my claim comes first / others'
  commits after my marker + my commits outside my sessions / findings land in shared
  documents via the discovery→update table / roll-up at 30+ backlog / marker re-anchoring) /
  reading·freshness·exceptions keyed to my claim
- work: preconditions recast as claim (rename commit = claim, pull and digest before
  claiming, assigned-card etiquette) / HANDOFF path branches by room / terminology fix
  "digest only 5 lines" → "receive" (digest reserved as the mechanism term)
- split: number issuance single-flight per capability folder (declare·expire·land rules) /
  assignments recorded in journal
- verify: closure only after fetching the integration branch / cross-platform signals via
  CI evidence·delegation / fix cards born bare (unclaimed) / journal sweep owner = the closer
- arch: integration·merge lines in settings (multi-only)
- hook: scans users/*/owner.md, resolves git identity (safe demotion on failure — never
  crash), injects my/others' claims distinctly, incomplete-transition fallback (injected
  with a root-HANDOFF warning), warning logic branches by mode. Solo output verified
  identical via fixtures
- Codex AGENTS fallback block gains multi-only wording / README fully reworked (design
  philosophy · two modes · transition procedures · the 4 multi concepts)
- Verification: D-structure refutation fork (10 findings applied) + literal-execution
  simulation fork on the detailed wording (13 applied, GO verdict) + 3 hook fixture sets
  (solo identity · multi resolution · unresolved identity) passing.
  Rejection lineage: A·C absorbed into D; B′ preserved as "teams that must leave no
  devflow traces in the repository" only

## 2026-08-07 — docs only: on-hold list expanded (no version change)

Recorded homework from post-0.7.0 structural verification (1-year time-axis stress /
multi-user) into the on-hold list. Team mode fixed at 4 directions, verify.md overwrite
codification planned, migration deferred to the card pattern, 4 new field observation
items. No skill text changed.

## 0.7.0 — 2026-08-07 — session handoff · document feedback · git ownership (rewrite)

The 8/6 v0.7.0 commit (9e67612) was largely correct in content but violated the
dual-language workflow (_ko first · DEVLOG) and was reverted. This edition confirmed the
5 defect diagnoses via independent re-verification (refutation + literal-execution
simulation forks ×2 + main cross-check), fixed 15 further defects, added 7 new
protections, and was rewritten by the book. Empirical basis: one nanomia-ade cycle (01-foundation, 13h,
one mid-session death, credit/ack document contradiction).

- principles: 4 rows added to the discovery→update table (Provisional measured · success
  criteria unverifiable · done-card signal rot · new term) / "contradiction between
  documents = defect, silent adoption forbidden" / table updates via the authorized path
  (the 4 steps only on violation) / commit discipline gains evidence-wait · boundary
  commit · git exclusivity for the main session (subagents implement, the main session
  commits) / 2 single-wip exceptions (journal-backed) / foundation
  folder closure conditions / folder .stale (retired) / ".done. = signal+review+commit"
  resolves the term collision
- work: arch co-reading (including Provisional·verify_channel) / progress-log gate
  (before long or failure-prone runs) / feedback step (upper documents replaced before
  rename) / handoff triggers changed from % to events (questions only before opening a
  capability folder; the rest are reports) / delegation split (subagent = implementation·
  signal·log, main = review·commit·feedback·rename) / open-decision carry-over duty
- resume: HANDOFF freshness check (against work commits; tree wins; stale HANDOFF still
  reports open decisions) / full journal read
- split: journal in the first read / carry conclusions from `.done.` dependency cards
  (T-mid pointer · T-low quotation) / research card "answers may go upward too" /
  parallel approvals recorded in journal
- arch: new Provisional section (resolution-card contract) / desktop·TUI rows in the
  verify channel
- verify: regression widened 1 hop to Depends-named cards / Provisional-replacement check
  axis / journal sweep (on capability closure, 1 line recorded) / role ownership
  (execution = verifier, document axes·sweep = main)
- product: desktop in interface / capability retirement notation (numbers immutable)
- reviewer: self-contradictory return format fixed (pass 1 line / findings 4 lines)
- hook: .stale folder skip, multi-wip warning wording synced, HANDOFF truncation 3000→6000
- Decision: HANDOFF is committed to git but never in a dedicated commit — rides the
  boundary commit only (based on the 8/6 reverted dedicated-HANDOFF-commit case)

## 0.6.0 — 2026-08-05 — native Codex SessionStart hook

- Research (2 subagents, Sonnet) confirmed: Codex CLI v0.124.0+ has a hook system nearly
  1:1 with Claude's (`~/.codex/hooks.json`, same JSON schema,
  `hookSpecificOutput.additionalContext` injection, requires `[features] hooks = true`).
  The earlier "Codex has no hooks" judgment was wrong — an illusion caused by the
  well-known dual-support plugins surveyed (mattpocock/skills, obra/superpowers,
  vercel-labs/skills) all predating hooks and not using them.
- New `scripts/install-codex-hook.js` — idempotent merge into hooks.json (preserves other
  tools' entries), feature-flag check. Called from both installers. **The same
  session-start.js serves both Claude and Codex.**
- AGENTS-devflow block demoted to fallback (hook-incapable environments only)
- Future options (not applied): Codex also natively scans `~/.codex/skills` — skills
  could be installed there instead of prompts. Per-skill `agents/openai.yaml` sidecar can
  provide Codex UI metadata (mattpocock pattern)

## 0.5.0 — 2026-08-05 — English deployment

- **English conversion**: deploy artifacts (8 skills · 2 agents · AGENTS block · hook
  injection strings) switched to English. Korean originals preserved with the `_ko`
  suffix (agent Korean versions in ko/ only — avoids double registration)
- Dual-language workflow + terminology table codified (now in AGENTS.md)
- Verification: ko↔en heading counts, numbered-list counts, key figures 1:1; zero Korean
  in deploy files; Codex regeneration passing
- git repo initialized. v0.4.0 (Korean edition) is the first commit — the pre-translation
  original is preserved in history

## 0.4.0 — 2026-08-05 — reviewer agent

- **New reviewer agent** — pre-commit code review (3 verdicts: intent·logic·scope).
  Two-track with verifier: reviewer reads but never runs (white-box); verifier runs but
  never reads (black-box). Basis: completion-signal pass ≠ intent match — nobody was
  reading the paths the signal does not cover.
- work loop gains a review step (between completion signal and commit); research cards
  skip it; low reasoning effort recommended for T-high
- split execution proposal gains a "skip review" option (review is the default); verify
  layer table updated

## 0.3.1 — 2026-08-05

- 2 lines defending against document contamination/fossilization (principles, document
  hierarchy): core documents change only through procedures/skill re-runs / replacement
  is the default ("a document that only grows is a dead document")
- Terminology alignment: split "strong card" → "complete card" (one concept, one word);
  work's parallel-condition wording unified with split's

## 0.3.0 — 2026-08-05

- Output folder `docs/` → `devflow/` across the board (collision with existing projects'
  docs/)
- principles: document hierarchy (4-step upward propagation + update adjudication table),
  5-item integrity check introduced
- arch: ADR 3 conditions replaced, code-style.md output added (Values, 7 lines default),
  brownfield flow tracing · style back-derivation
- split: start-condition gate (halt without product.md), layer-opening declaration,
  research cards, modification-request routing (a `.done` folder loses its suffix when a
  new card is added to it)
- work: code-style reading + existing-code check before implementing + document hierarchy
  hookup
- verify: capability layer gains boundary (malicious input) · standards (code-style) axes
- hook: devflow/ paths, duplicate-number and multi-wip warnings
- DEVLOG.md introduced

## 0.2.0 — 2026-08-05

- Prefix introduced: plugin nano-devflow, Codex commands nano-devflow-*
- PRINCIPLES.md → skills/principles/SKILL.md (skills.sh compatibility)
- split gains the recursive-split section (card→folder promotion, 02.3.1 numbering); arch
  gains the brownfield back-derivation procedure
- Cross-tool defect fixes: skill cross-references as stage names, install.ps1 BOM,
  verifier tool restriction lifted

## 0.1.0 — 2026-08-05

Initial implementation. 7 skills (product/arch/design/split/work/verify/resume), 1 hook,
Codex installer.
