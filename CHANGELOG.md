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
