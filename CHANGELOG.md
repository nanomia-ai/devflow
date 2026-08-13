# Changelog

All notable changes to devflow, newest first. Format: each entry records **what changed
and why** in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

## docs — 2026-08-13 — independent implementation audit of the v0.14.0 plan and the current 0.14.1 source (no version change)

Added a report-only audit that treats the v0.14.0 plan as requirements, the execution
report as implementer claims, and the current 0.14.1 English skill text as authority. The
audit confirms the principal architecture and both platform installations, then separates
two possible silent-loss paths, seven stop-or-wrong-action paths, one trace-precision gap,
one out-of-scope maintenance-canon drift cluster, and the already-recorded design tensions
from their repair options. Three claims were measured in temporary Git repositories: an
integration ancestor can still have one local-only descendant commit; a path-scoped commit
of a shared file carries both sessions' hunks; and a tweak committed on detached HEAD is
left on no named branch after checkout. The report also records a request-shape x branch-
state x dirty-path x routing-state coordinate sweep, self-challenges for every adopted
finding, bounded repair choices, and the fixtures a repair round would need. An owner-
requested anti-misreading pass expands the compressed verdicts, execution-report claim
adjudications, coordinate-sweep notation, and repair-feasibility labels with their causal
mechanism, predicted operating result, and scope boundary; it does not change any finding,
severity, or recommendation. No plan, execution report, audit guideline, deploy artifact,
test, or manifest changed.

Verification: all 87 Node tests pass; Korean/English structure and deploy-language checks
pass inside that suite; both live plugin lists report enabled devflow 0.14.1; twelve core
files are byte-identical across the repository, Codex cache, and Claude cache; the three
input-document SHA-256 values remain recorded in the report. Files:
`docs/rounds/v0.14.0/audit_ko.md`; `CHANGELOG.md`.

## docs — 2026-08-13 — guideline anti-rigidity pass, cold-start context for the report, and dated corrections on four stale design rows (no version change)

Three owner-raised checks, each answered in the documents themselves. (1) The audit
guideline gained a "how to read this document" preamble: every rule is a variation of one
question, only two rules bear load (the acceptance bar and the class-keyed stop
condition), the rest is technique an auditor may override with a stated reason —
plus a context-first reading order (report and design philosophy before the hunted text),
per-lens expected outputs, and a softened citation requirement. (2) The 0.14.0 execution
report now works for a zero-context auditor: a minimal cold-start section (what devflow
is, the three text layers, six terms, canon precedence), the audit guideline added to its
reading list, the eight untouchables inlined with their reasons instead of pointing into
a document marked don't-read. (3) A staleness sweep of docs/design.md found four decision
rows still asserting what v0.14.0 overturned — the v0.9.23 group claim, the v0.12.0
unit-axis claim key, the v0.13.0 blockade freeze, and the v0.13.0 no-skip-recording
guard — each now carries a dated correction note pointing at its superseding row
(lineage preserved, nothing deleted), and the on-hold size entry carries the measured
current figures.

## docs — 2026-08-13 — the audit guideline: sixteen releases of verification practice become a standing instrument (no version change)

Wrote `docs/audit-guideline_ko.md` for external auditors (owner-run GPT sessions and any
clean-context reviewer): the finding classes that have actually shipped defects (each with
its originating incident), the acceptance bar (exact quote + concrete failure path, zero
findings valid), the lens separation and walk-vs-sweep distinction, the use-case matrix as
the coverage instrument, contamination control for briefings, the loop-termination rule
that keys on finding class rather than count (with personal circuit breakers), the
report format with severity tiers, an exception table, and a briefing template for the
owner. Also added the explicit size verdict to the 0.14.0 execution report: the current
corpus is the best of this moment, not the endpoint — three recorded reduction paths
remain (D11 consumer split, the interruption machinery, a post-field subtraction audit),
each deferred for a recorded reason rather than by neglect.

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

## docs — 2026-08-13 — v0.14.0 plan: free parallel claims, a tweak lane, blockade appends with 3-way journal merges (no version change yet)

Wrote `docs/v0.14.0-plan_ko.md` after the owner decided on every open question from the
second verification round. The plan's three structural moves, each with its overturn
refutation recorded for `docs/design.md`: (1) **free parallel claims** — the
one-claim-per-id-per-unit rule assumed one terminal per person; the owner runs six on one
capability daily, and the rule's only escape (parking) sweeps a sibling session's
uncommitted work into a checkpoint. Claims become unconditional with a one-line info
notice; every checkpoint-style rule is rescoped to "changes this session made"; integrity
item 1 is repurposed to orphan-claim detection (number preserved). (2) **a tweak lane** —
changes whose diff is already the complete record (no user-visible transition change, no
design decision or conflict, no trap) skip cards, journal, and state restoration entirely:
declare, read Layer 0 only, cheapest check once, one `<id> tweak NN:` commit. Refutes
D7's no-skip-recording guard: a commit IS a record; knowledge-bearing changes still route
through the discovery table. (3) **blockade appends + 3-way journal merges** — journal
lines that mint nothing and claim nothing may be appended and locally committed while
integration is blocked (closes the round's only silent-loss path), and the
union merge rule is replaced with base-aware 3-way resolution because measurements 15–16
proved union semantics resurrect consumed lines. The plan also folds in all confirmed
round-2 defects (classifier classes, resume-arch integration mismatch, minting-contention
routing, absent-document Design-head gate, and the cleanup tier) and records two
contradictions the pre-plan full sweep found between the decisions themselves
(precondition 3's cross-unit checkpoint sweep; the K3 plain journal line having no class
and no consumer). No skill text changed yet — the plan is the contract for the 0.14.0
round, which starts by committing 0.13.0 as its baseline.

Promoted the use-case matrix to a standing verification instrument at
`docs/usecase-matrix_ko.md` (third edition: three new human forms - same card in two
terminals, unnamed resume with several claims, a tweak reclassified mid-change - one
new AI entry point for tweak sessions, and every cell the 0.14.0 plan will close
marked as pending re-judgment); the versioned copy is deleted, and release
verification now re-judges every pending cell against the implemented text.

## docs — 2026-08-13 — second verification round: four independent passes, a use-case matrix, and two report corrections (no version change)

Ran the independent refutation AGENTS.md requires and the first round could not provide:
four clean-context passes with distinct lenses (literal usage walk over six scenarios ·
refuter over the changed canon · record-loss channel audit · subtraction audit), every
finding adjudicated against the actual text. Result: 18 confirmed defects with prepared
repairs (all local sentence fixes — among them a dead end in work's precondition 3 when the
user names a card in a unit I already claim, verify's two-class journal classifier
rejecting the content classes the canon now allows, and an undefined Design-head gate for
absent candidate documents), 13 judgment calls with recommendations (the one data-loss
path: blocked-integration sessions have no disk parking for new requests and observations),
8 watch items, 4 rejected finding groups with reasons. **No skill text was changed — repairs
await owner approval.** Added `docs/v0.13.0-usecase-matrix_ko.md` (human request, arrangement, and team
forms × AI entry points — widened on owner direction to worktree and team variables, which
surfaced three new gaps: a skill entered from a subfolder can create a nested devflow root,
checkpoints strand on branches nobody reads when a worktree is deleted or a teammate is
away, and nothing records the devflow version a repository assumes, so mixed-version teams
judge shared state differently; plus the earlier reachability gap where provider-document
traps do not reach the first cross-capability consumer) and
`docs/v0.13.0-verification-round2_ko.md` (rewritten as a prose risk review after a
self-check for over-interpretation that retracted one repair, corrected another, and
softened five — repairs stay unapplied by owner decision). Corrected two defects in the execution report directly, as document-fact fixes:
it never said the release is uncommitted (a next session would have pushed a history
missing 0.13.0), and the Codex companion-resolution claim is downgraded from measured to
strong inference. Files: `docs/v0.13.0-usecase-matrix_ko.md`,
`docs/v0.13.0-verification-round2_ko.md`, `docs/v0.13.0-execution-report_ko.md`,
`CHANGELOG.md`.

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

## docs — 2026-08-13 — feasibility resolutions added to the v0.13.0 plan audit (no version change)

Expanded `docs/v0.13.0-plan-validation-report_ko.md` without changing the plan. Every
finding now separates reproduced facts from proposed repairs and design judgment. The new
resolution chapter records measured local and remote Git ref compare-and-swap behavior;
recommends an integration-only coordination plane, claim-generation fencing, isolated card
workspaces, and a finite deterministic transition helper; distinguishes the minimal
one-writer profile from optional same-root managed-worktree routing; and defines recovery
for multi-domain request sources, journal races, foundation knowledge, orchestrators,
clones, and takeover. Added corresponding flow simulations, absolute limits, and acceptance
fixtures. No deployed skill, predicate, role contract, installer, manifest, hook, or version
changed. Files: `docs/v0.13.0-plan-validation-report_ko.md`, `CHANGELOG.md`.

## docs — 2026-08-13 — independent validation of the v0.13.0 implementation plan (no version change)

Added `docs/v0.13.0-plan-validation-report_ko.md`, a report-only design audit of the
unimplemented v0.13.0 plan. It separates same-working-tree terminals, worktrees sharing a
Git common directory, and independent clones; records reproducible failures in the proposed
claim projection and journal union merge; distinguishes normal ref races from structural
integration failures; and gives technical feasibility limits, bounded repair alternatives,
security and platform constraints, an implementation order, and executable acceptance
fixtures. The plan itself and all deployed skills, predicates, role contracts, installers,
manifests, and hooks were left unchanged. Files:
`docs/v0.13.0-plan-validation-report_ko.md`, `CHANGELOG.md`.

## docs — 2026-08-12 — independent validation of the v0.12.0 usage-flow implementation (no version change)

Added `docs/v0.12.0-usage-flow-validation-report_ko.md`, a report-only audit that treats
the v0.12.0 execution report as the current decision record and the deployed skills as
literal runtime truth. It records the flows that work, reproducible state-transition and
platform-delivery defects, coordinate sweeps, technical solvability (including the limits
that require isolation, serialization, or explicit hook trust), repair order, and executable
acceptance fixtures for the next design session. No deployed skill, predicate, role
contract, installer, manifest, hook, or version changed. Files:
`docs/v0.12.0-usage-flow-validation-report_ko.md`, `CHANGELOG.md`.

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

## docs — 2026-08-11 — the capability-knowledge contract becomes v2.2

The GPT candidate contract was revised by an independent verification and research
campaign: sixteen refutation findings, three research passes (AI consumption and token
economy; human operations and irreversibility; external practice with sources), a
synthesis, two Fable adversarial passes (15 findings), and a re-audit of the fixes (13
findings), all adjudicated. The evidence and option analysis of sections 1–3 stand; the
contract of sections 4–7 is superseded. What changed: identity is the capability number
(the stable-key scheme is deleted); freshness is a six-field machine block and two git
commands (the three digests, their NUL pipes, and the comparison digests are deleted);
lifecycle is an arch.md `capability_baseline` switch and the baseline riding the begin
commit (enrollment files and the marker payload array are deleted); the document contract
is a blueprint-first 12-section design with caps, and four durability rules (shape
tolerance, the knowledge layer never blocks the execution axis, byte stability,
delete-only human edits) govern the long horizon. Three owner choices reduce to one — the
per-project switch default. The invariants test re-pins every surviving invariant against
the revised wording, drops only assertions whose mechanism was deleted or whose rule the
revision inverted, and adds pins for the absent-switch default, the size cap, and the
coverage-is-not-task-state rule. Runtime wiring is the next release.

Files: `docs/capability-knowledge-proposal.md`; `docs/capability-knowledge-proposal_ko.md`;
`scripts/repository-invariants.test.js`; `CHANGELOG.md`.

## 0.9.23 — 2026-08-11 — two inherited gaps close: parallel-group entry and Record self-description

Two gaps that v0.9.22's verification campaign deferred are now judged solvable with low
variance and closed before real use, per the owner's direction.

The approved-parallel-group machinery — the cards' reciprocal `parallel` Approval, the
two-claim tolerance branch, and integrity item 1 — governed a state no procedure could
create, because work's single-claim-first rule blocked every second claim (inherited from
0.9.20). One entry rule closes it: in solo, when the next card's effective Approval names
a reciprocal parallel group and every member is ready, the whole group is claimed in one
step; in multi, claims stay single and an approved group is distributed across members
through ordinary claims — the verification pass showed a group-claim mandate in multi
would foreclose exactly the distribution the approval exists for.

A verify Record now describes itself: a `New entries` field written with the verdict
carries the count of this run's Failure-history entries, and a current Record is complete
only when that value equals the count of entries whose source id exceeds the maximum in
HEAD's record (treat that maximum as 0 with no HEAD record). Previously an interrupted
session's partial Record was unjudgeable — the required entry count existed only in the
dead session's context — so recovery had to choose between committing silent loss and
re-running every interruption. A mismatch is now a partial write that repeats from step 2,
the sanctioned re-run path. A committed Record without the field is complete as committed
(the same absence-tolerance pattern as pre-v0.9.21 records).

Verification: an independent Fable pass walked both closures (solo crash-resume, the
multi race with one colliding number, partial-ready groups; six Record kill points
including the no-verifier-briefing paths and legacy records) — both CLOSED, with one
terminology drift and two wording tightenings applied afterward and the multi scoping
decided as recorded above. 51 Node tests: the 50 in scope pass; the one failure pins the
capability-knowledge proposal's old wording against its in-progress revision and is
re-targeted in that document's own change.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `skills/work/SKILL.md`;
`skills/work/SKILL_ko.md`; `skills/verify/SKILL.md`; `skills/verify/SKILL_ko.md`;
`docs/design.md`; `docs/design_ko.md`; `CHANGELOG.md`.

## 0.9.22 — 2026-08-11 — the seams between v0.9.21's flows close

An independent verification campaign over the v0.9.21 redesign — six fresh-context passes
(two literal-execution simulators, a refuter, a design-lineage audit, a mechanical
fact-check, a platform review) — confirmed the redesign's core flows recover
deterministically, and found its defects concentrated at the seams between flows. This
release closes them without touching the v0.9.21 architecture.

Vocabulary and reference repairs: resume's read-prohibition list now names the Record's
actual `Executed` and `Journal sweep` fields; "canonical verification-state transition" is
defined once in the canonical rules and covers the capability begin commit, so a session
that died after writing the passing record and closing marker resumes into finishing that
begin commit instead of a false integrity anomaly (resume's marker row now requires HEAD,
and verify step 8 requires the landed begin commit); four phantom procedure names
(final-task recovery, lost-claim procedure, bounded projection, interrupted-boundary
repair) now resolve to real text; "durably approved" collapsed into the state predicates'
"effective"; the multi state-sync gate tests tip state instead of the undefined
"unfinished transition commit"; the open-Git-operation gate carries its name; the Audit's
scope calculation no longer imports step 5's unverified-and-route action.

State-seam repairs: a canonical **Layer 0 commit** lands each core document immediately
after user confirmation (`<skill> — <document filename>`, `adopt — layer 0`), so verify's
refusal of uncommitted revision inputs has a sanctioned upstream; the product layer's
dirty-path refusal now lands through the running→result single flight with verdict
`unverified` (the capability layer follows the step-2 pattern through step 6); cancelling
a committed maintenance request deletes its layer-opening marker with it; work checks for
an active layer-opening marker naming its own claimed card before resuming an interrupted
promotion; tree numbers have an assignment convention (foundation `01`, capabilities in
product.md list order from `02`, later additions take the next unused number), making the
waiting-file predicate satisfiable; arch gained the Brownfield field-only clause and the
canon sanctions adopt's equivalent; split gained the correspondence-restoration procedure
resume was already routing to, and product covers the retired-without-representation cell;
step 5's Standards scope terms are bounded and judgeable from arch.md alone; the
evidence-finalizing recovery list includes the compatible document update and foundation
closures; the Approval-reset rule is scoped to split's start. The legacy Codex hook
remover now also matches the pre-0.9.0 "Loading nano-devflow state" registration.

docs/design.md: philosophy item 3 now distinguishes task progress (file tree + progress
log) from canonical transition state (journal and verify.md lines with fixed formats);
three missing v0.9.21 lineage rows were added (the remote-evidence state machine, Approval
freshness, and the Windows `cmd /d /s /c` binary pipe — recorded with its 2026-08-11
reproduction in this repository: the PowerShell object pipeline actually corrupts the
hash while POSIX and cmd pipes agree); the durable-knowledge row cites the v0.9.18
observation-cache rejection that `Existing records` avoids; the decision table's three
detached tail rows render again. README: "cross-task decisions" (the canonical term)
replaces a coinage, and the integrity check is attributed to both gates; the two-line
edit adds and removes no `—` or `**` (verified by diff).

Verification of this entry: three Fable passes — a 22-case repair verification that
re-walked every original defect (21 closed, one repair itself introduced a
conflicting-instruction defect), then a micro-batch closing that finding plus two
low-severity ones and one Korean-side phrase variant, spot-checked afterward. 51/51 Node
tests; ko↔en structure parity on every changed pair; zero Korean lines in changed English
deploy artifacts. Codex/Claude reinstall is pending the owner's rerun (noted, not yet
performed).

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `README.md`;
`README_ko.md`; `docs/design.md`; `docs/design_ko.md`; all Korean/English SKILL pairs for
principles, product, arch, design, adopt, split, work, verify, and resume;
`scripts/remove-legacy-codex-hook.js`; `scripts/remove-legacy-codex-hook.test.js`;
`scripts/repository-invariants.test.js`; `CHANGELOG.md`.

## docs — 2026-08-11 — capability knowledge is planned and validated without runtime adoption

JGNote, Nanomia ADE, and RDSF Data Server are treated as failure-path clues rather than
proof of the new runtime. The validated candidate keeps execution in tree, task cards, and
users while combining the last successfully refreshed passing capability baseline with
current cards outside Covered cards. It creates no unverified seed. work keeps its bounded
read set; verify reads one standard refresh set at final closure and adds Covered history only
when the stored comparison changed. Shared dependency paths are deduplicated, retained
historical-stale dependencies are hash-only inputs, binding ADRs enter future cards, and
external references remain nonbinding. A refresh replaces current sections instead of
appending chronology. A long-open capability leaves the baseline as a hypothesis when current
done numbers differ from Covered cards. Component baselines remain excluded until devflow has
an independent component-verification boundary.

The exact template separates stored-Covered comparison from final replacement coverage and
fixes identity, section, byte, and digest rules across Claude, Codex, Windows, and POSIX. Its
candidate begin transaction preserves final baseline bytes, validates empty and nonempty
prefixes and descendant state, and deletes enrollment only with the same successful create.
`Depends: none` is an explicit valid empty set. The recommended product-row owner has one exact
terminal stable-key field, and every enrollment policy uses the same durable pending file.
The candidate integrity check rejects malformed, orphaned, duplicate, or simultaneous
baseline/enrollment files without guessing repairs. Three owner choices remain: enrollment
policy, stable-key owner, and retirement preservation. No skill executes this proposal. The
old-to-new report records evidence, simulations, prompt cost, limitations, and the requested
independent-Claude review procedure.

Verification: the proposal-focused invariant joins the v0.9.21 checks for 50/50 Node tests;
Korean/English structure and meaning-bearing figures match; deploy-language checks pass; and
the earlier independent literal, over-harness, and parity attacks plus the grouped post-fix
re-audit report zero remaining clear defects. Files:
`docs/capability-knowledge-proposal.md`; `docs/capability-knowledge-proposal_ko.md`;
`docs/v0.9.21-redesign-report.md`; `docs/v0.9.21-redesign-report_ko.md`;
`scripts/repository-invariants.test.js`; `AGENTS.md`; `docs/design.md`; `docs/design_ko.md`;
`CHANGELOG.md`.

## 0.9.21 — 2026-08-11 — disk-state contracts survive brownfields, interruption, and multiple checkouts

The v0.9.20 philosophy remains: product direction, a tree opened one layer at a time,
task cards, completion signals, and separated quality roles. The redesign closes the disk
states that a new Claude or Codex session previously had to infer. Brownfield provenance,
card Approval and Review, canonical and legacy Depends parsing, layer-opening and closing
markers, product-verification single flight, source ids, routed failures and findings,
remote evidence, and capability revisions now have explicit producers, landing commits,
and resume consumers. In multi, shared routing and initial claims are visible at the
integration tip before implementation; devflow still neither creates nor assigns
worktrees.

Independent literal and over-harness attacks exposed concrete interruption paths: a
write-first product or capability verdict could execute twice or land incomplete; route
output could be duplicated or fail to represent deletion; a requested product run or event
could preempt its caller's claim; an unresolved or dirty Audit could loop forever; stale
Approval could survive a card change; a task checkpoint could be absent from integration;
and a local hook could inject stale state. The repairs use one `routing prepared` transaction
with an exact base, final result, ordered write/move/delete operations, and exact-prefix
recovery; committed nonclosing capability results; non-preempting requests; nonblocking
dirty Audits; Git-normalized Approval freshness; and activation-only hooks. Multi integrates
task and planning-source checkpoints before any dependent tree mutation.
Every entry skill returns an open Git rebase or merge before normal routing when inside a Git
work tree; non-Git projects skip that gate without initialization. Locators use Git's full
object ID instead of assuming SHA-1 length, while path and card ordering have one byte/numeric
comparator across platforms and task-card syntax bounds that comparator's full input domain.
A capability pass records pending Standards and Provisional gates, and closure accepts only exact prefixes
of `verify.md` → `journal.md` → folder rename. A journal decision for a core revision input
routes to that document's owning skill before closure is judged again.

Shared task-card predicates now live once in `state-predicates.md` and reach split, work,
verify, and resume. Revision and event predicates live separately in
`verification-predicates.md` and reach only verify and resume. Duplicate hook classification,
HANDOFF injection, verification-route restatements, and repeated folder-closure prose were
removed rather than patched around. Codex installation also verifies that the enabled
plugin and marketplace entry both resolve to this repository, not merely the same name and
version.

The brownfield evidence came from JGNote, Nanomia ADE, and RDSF Data Server, but those older
outputs are treated as failure-path clues, not proof of this release. Exact existing-record
paths can be indexed per capability without becoming canon or an automatic read.

Verification before this boundary: 50/50 Node checks; Korean/English structural and figure parity;
zero Korean lines in English deploy artifacts except README.md's one language-switcher
line; strict Claude manifest validation; native Claude and Codex installs both at 0.9.21;
eight regenerated Codex prompts with each predicate companion only in its consumers; and
`git diff --check`. The Windows installer retains its UTF-8 BOM. README tone measurements,
from v0.9.20 to this entry: README_ko `—` 49→49, raw `**` markers 66→66, bureaucratic
closure compounds 0→0; README `—` 82→81, raw `**` markers 80→80, closure compounds 0→0.

Files: `.claude-plugin/plugin.json`; `.codex-plugin/plugin.json`; `AGENTS.md`; `README.md`;
`README_ko.md`; `codex/AGENTS-devflow.md`; `codex/AGENTS-devflow_ko.md`;
`codex/install.ps1`; `codex/install.sh`; `docs/design.md`; `docs/design_ko.md`;
`scripts/session-start.js`; removed `scripts/install-codex-hook.js`;
`scripts/extract-adopt-reference.js`; `scripts/extract-adopt-reference.test.js`;
`scripts/remove-legacy-codex-hook.js`; `scripts/remove-legacy-codex-hook.test.js`;
`scripts/session-start.test.js`;
`scripts/verify-codex-plugin-install.js`; `scripts/verify-codex-plugin-install.test.js`;
all Korean/English `skills/*/SKILL` pairs; `skills/principles/state-predicates.md` and
`skills/principles/verification-predicates.md` with their Korean pairs; all Korean/English reviewer, verifier, auditor, and retrospector role-contract
pairs; `CHANGELOG.md`.

## docs — 2026-08-11 — the README tone rules become part of the maintenance gate (no version change)

The tone pass below fixed one document; without a written rule the next session would
drift back, since an AI writing prose reproduces the same tells by default. AGENTS.md gains
a "Writing the README" section stating why the README cannot buy precision with stiffness,
the four tells to check by counting (noun compounds where a verb belongs, em-dashes used
as breath, bold on every key word, uniform sentence length), the Korean translation-ese
list to keep absent, and the two rules that bound the edit itself — subtract rather than
insert, and keep it local or the meaning has drifted. The pre-flight checklist gains a line
so a README change cannot pass review without the counts. The external taxonomy behind the
list is cited, not vendored; borrowing text still needs prior permission. Files: AGENTS.md.

## docs — 2026-08-11 — README_ko reads like a person wrote it (no version change)

The owner flagged the Korean README as machine-toned, pointing at the phrase built from
"product" + "closure" — each word correct on its own, the compound something no Korean
speaker would say. Measured against a published taxonomy of Korean AI-writing tells, the
document was clean of translation-ese (zero hits on the decisive patterns) but heavy on
three: em-dashes (77), bold spans (41), and bureaucratic noun compounds (5 uses of the
"closure" word). Following that taxonomy's own rule — subtract tells, never insert new
ones, and keep the edit local — closure vocabulary became plain verbs ("when a capability
is closed", "when MVP is reached"), mid-sentence dashes became full stops where they were
decoration (77 → 49; the ones separating a heading or a defined term stay), and emphasis
was thinned to the claims that carry the section. The audit and retrospective paragraphs
were re-sentenced for rhythm rather than trimmed. English mirrors the same fix where the
oddity was shared, most visibly "capability · product closure" → "closing a capability ·
reaching MVP". No facts, numbers, or terms changed; structure parity ko↔en holds
(headings 15/15, table rows 39/39, bullets 17/17, fences 24/24). Files: README{_ko,}.md.

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
