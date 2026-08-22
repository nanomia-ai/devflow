---
name: work
description: Implementation. Takes one task card, codes it, keeps the progress log on disk, runs the completion signal, and commits. Use when starting to code, continuing work, or beginning implementation.
---

# work — Implementation

First read the canonical rules (`../principles/SKILL.md`). Then run
`node ../principles/scripts/project-state.mjs state` and read its `claim:`, `ready:`, and
`integrity:` lines. Those lines carry the card judgments this skill uses; take them as they
stand.

Purpose: carry one task card all the way to its completion signal, then commit.

## Preconditions

When this project is coming up from a version without rooms, finish the canonical room
transition before anything below. For each bare `.wip.` card, ask the user whether it is
mine: rename a confirmed one to `.wip-<my id>.`, and release one the user does not
attribute to me by stripping the whole suffix back to pending — its progress log stays in
the card. In that same commit, replace with the new path the `card-json` of every journal
`evidence-wait` or `evidence-finalizing` line naming the exact path that rename changed,
preserving its timestamp, checkpoint, and `check-json` byte for byte. Never auto-release an
evidence claim whose owner is unconfirmed — the evidence cannot be preserved, so report the
exact blocker and stop. Independently of that answer, move a root `devflow/HANDOFF.md` into
my room. Land whichever of these applies in one `<id> boundary — room upgrade` commit. When
one side is applied and the other is not, judge by that commit subject and finish only the
remainder and the commit.

1. Apply the canonical Git requirement — a work tree and a git identity — before anything
   below.
2. Before choosing an ordinary claim, finish remote-evidence transitions for my claimed
   cards in the order below. Within each state, use timestamp order and then journal line
   order.
   Whenever a branch below executes or rechecks remote evidence, append the canonical exact
   `remote evidence check` line before following that result's branch.

   - A committed `evidence-finalizing` line in HEAD means the final task commit is done.
     Read only the recorded completion-signal, review, and checkpoint linkage from the log
     and commits; never execute the signal again. Then repeat the upper-document feedback
     judgment below. If feedback enters the Document Hierarchy procedure, that procedure
     deletes the evidence line and this completion path ends. Apply a compatible update to
     the working tree through the discovery→update table before the `.done.` rename and
     land it in the boundary commit below. Make no final task commit; finish only the card's
     `.done.` rename, the compatible document update above, applicable foundation and
     intermediate-folder closures, HANDOFF, and line deletion in a boundary commit. If that rename and deletion
     already started in the working tree, finish that boundary first
   - When `evidence-wait`→`evidence-finalizing` and its pass result exist only in the
     working tree, run `check-json` again. On a current pass, make no final task commit yet;
     continue at the upper-document feedback judgment below. Pending, inaccessible, or no
     verdict restores the line to `evidence-wait`. A fail deletes the line in an `NN.N wip: remote evidence
     failed` checkpoint and returns to the failure ladder
   - When HEAD's `evidence-wait` line is deleted only in the working tree and the claimed
     card's last uncommitted `remote evidence check` line has the same `check-json` with
     `verdict: fail`, finish the current changes as the `NN.N wip: remote evidence failed`
     checkpoint and return to the failure ladder. Do not restore the line or recheck the
     remote result
   - When the last commit that changed a claimed card has the canonical exact evidence-wait
     checkpoint message but no evidence line names that card, recover the canonical
     `evidence-wait` line from the last `remote evidence check` JSON in that commit's
     progress log. Land the line in `boundary — evidence-wait <number>` and push the
     checkpoint and record commits. A missing or undecodable JSON line is an integrity
     anomaly
   - For a committed `evidence-wait` line, run its `check-json` command or open its URL only
     after pushing the checkpoint and record commit succeeds. When the line is uncommitted,
     finish its record commit and push first. On a pass, do not change the line or make the final
     task commit yet; continue at the upper-document feedback judgment below. A fail makes
     the failure checkpoint above. Pending, inaccessible, or no verdict retains the line
     and card

   After remote-evidence transitions, if the canonical claim→done move is uncommitted, or
   the last commit changing one of my claimed cards that no `evidence-wait` or
   `evidence-finalizing` line names has the
   canonical final task subject, open no new work. The final task commit is already complete
   under the canonical commit discipline; make no second final task commit and finish only
   upper-document feedback and the boundary.

   Any number of claims of mine, in any units, is ordinary concurrent work — several
   sessions each carry their own card. Others' claims do not count —
   they are read-only reference (the canonical rules' "Identity and Rooms").
   If the claimed card lacks `Approval` or `Review`, has `Approval: pending`, or has
   noncanonical `Depends`, make no new implementation change. First land any current diff
   or progress log in an `NN.N wip: legacy card migration` checkpoint. Then release the
   card, finish split's legacy normalization, execution-proposal approval, and planning
   commit, and reclaim it.
   The claimed card's `claim:` line carries its `Depends` judgment. On
   `kind=depends-anomaly`, report that line's anomaly and stop. On
   `kind=blocked-by-prerequisite`, do not resume implementation; return to split, release
   the original card, and finish the prerequisite.
   If journal in HEAD or the working tree has an active layer-opening marker whose
   `source-json` decodes to a `card:` locator naming my claimed card, do not resume
   implementation; return to split to finish that marker's planning commit first.
3. Select this invocation's card and begin. When this session already reported an exact
   card path and the user approved it, that card. Otherwise the first entry in canonical
   candidate order over my remaining claims plus every pending card the `ready:` zone
   lists. Continue a claim of mine; claim a ready pending card as below. Never
   claim a card that is not ready. When the user named a card and this selection does not
   take it, say which card it took and why before claiming anything. When claiming a
   pending card in a unit where I already hold claims, name those claims in one line, and
   when the claimed card's Approval `parallel:` value does not carry them, add that fact
   in one line — information, not a question, so proceed without waiting for an answer.
   When this session left uncommitted changes on another card of mine, land them as that
   card's `NN.N wip:` checkpoint first — uncommitted changes this session did not make
   belong to another flow, so leave them untouched. The one exception is what the user
   confirms as this card's leftover (edits a tweak flip left behind, for instance) — once
   confirmed, take them over and treat them as changes this session made. Return to split to normalize a
   noncanonical `Depends`; report and stop on an integrity anomaly.
   Before claiming, pull the integration branch and finish the digest (resume's
   digest procedure). The rename commit to `.wip-<my id>.` is the claim (message:
   `<id> 02.4 claim` — a digest.md marker a just-before-claim digest advanced rides this
   commit). Land this initial claim on integration as the canonical binding
   decision and include that tip in the current branch before implementation. If a
   competing claim rejects the integration update, fetch again and follow the canonical
   rules' lost-claim rule (copy my progress log into the surviving card and step back).

## The Loop

```
Read the card fully (including Coordinates and Identity — know what this is a part of)
+ read devflow/project/product.md, devflow/project/code-style.md, and
  devflow/project/arch.md alongside
  (a decision that never reached the card does not exist for the implementer — from arch,
   at minimum the Stack, Code structure, Provisional, Risks, and verify_channel sections)
+ read devflow/project/design.md, devflow/project/glossary.md, and devflow/journal.md in
  full if they exist
+ read every direct dependency card named in `Depends` in full
+ unless `Read first` is `none`, read every exact path it names. If a path is missing,
  report it; do not guess a substitute. A baseline path directly under
  `devflow/project/capabilities/` is legacy wiring: do not open it or report its absence
  through this field; defer it to the number judgment below. Do not open a path listed only
  in arch.md's `Existing records`
+ take the leading number from the claimed card's depth-1 ancestor directly below
  `devflow/tree/`. Comparing numbers as integers, if exactly one document under
  `devflow/project/capabilities/` has that number, select its path but do not open the body
  yet. Apply the consumer judgment below first; only when its shape gate permits, read both
  zones and the exact Binding ADR paths regardless of `Read first`. Foundation and research
  cards follow the same rule
+ when a same-numbered knowledge capsule folder exists beside the capability document just
  read, project only the capsules' first-line headers:
  `node <plugin root>/scripts/project-knowledge.mjs project --capability <capability number>`,
  never without `--capability`. `<plugin root>` is the folder two levels above this loaded
  file, and in a runtime that sets `${CLAUDE_PLUGIN_ROOT}` that variable names the same
  folder. When the platform gives this file no source path, or the tool cannot be run there,
  report that in one line and open no capsule body. Open bodies only for capsules named by the card's
  `Read first` and capsules whose "when to open it" matches the card's destination and
  target, through the same tool's `select --path <exact path>` (repeat `--path` for several).
  The tool enforces the opening budget as a hard cap — over it, it returns zero bodies with
  the candidate list and the cost; pass that report to the user unchanged and either narrow
  or obtain explicit approval (`--approved` on the same command). An opened capsule's `conjecture` sentence is not an
  implementation basis, and a `dispute` leans on neither arm before the decision — when
  continuing requires leaning on one, stop and report. When a capsule's claim moves into the
  progress log, a `carry:` line, or a delegation briefing, its provenance mark moves with it
+ run a mechanical query over every non-`.stale.` `.done.` card below that depth-1 unit whose
  number is not in the capability document's `Covered cards`, emitting each card's number and
  the last `carry:` line of its progress log and nothing else. Read only that output and open
  no card body. With no capability document, or one whose shape gate blocked its body, the
  complement is every such card. When the body was read but `Covered cards` is absent or
  does not parse as a JSON array, the complement is likewise every current non-`.stale.`
  `.done.` card — never guess the empty set. Delivering a line twice is harmless; losing
  knowledge is unrecoverable. A card with no `carry:` line contributes nothing
  ↓
When the current card, its direct-dependency cards, or arch's Code structure or shared
contracts name one or more exact code paths, search only those paths for the responsibility
named by the card. Reuse a matching implementation or report its conflict. Do not search
other paths to prove absence
  ↓
Implement  ←→  append to the progress log (after completing one named card step, after
  ↓            choosing among alternatives, and after a run result changes the next step.
  ↓            Disk is the source of truth. If the session dies at any moment,
  ↓            this log must identify the exact next implementation point)
  ↓            **Gate: the log must be current before starting any run that takes minutes
  ↓            or can fail (build, measurement, completion signal, install).** Those are
  ↓            exactly the runs that tempt you to postpone writing — and exactly when a
  ↓            session dies. Repeats of the same attempt can be batched into one line.
  ↓            On a long card, checkpoint-commit `02.2 wip:` at the same moments
  ↓            (the main session commits)
Run the completion signal — actually run it. Record the result as the canonical `completion signal result:` line in the log
  ↓            Capture the full `git rev-parse HEAD` immediately before the run and write it as that line's `head:`
  ↓            That value keeps the base this run actually saw even when another flow's
  ↓            commit lands between the result and its anchor
  ↓            A signal scoped to this capability's paths survives another flow's
  ↓            uncommitted code in the same working tree; a repository-wide one does not
  ↓            On `fail` or `unverified`, land that line in an `NN.N wip: <what>` checkpoint
  ↓            as its anchor before any further code change
  ↓            An interruption before the anchor commit does not stale a result
  ↓            — what stales it is a changed completion input or task diff
  ↓            After an interruption with both unchanged, finish from that checkpoint; run
  ↓            it again only when they changed or you cannot tell they are the same
  ↓
Review — omit this step when the card's `Review` is `waived`. Omit `not-applicable` only
        when the diff contains no real-code change. Otherwise brief a clean
        subagent/fresh session with `reviewer.md` beside this skill,
        **verbatim — never summarized** — main holds the implementation history, so
        main can never be the clean one — and give it **only the card (Progress log section
        excluded) + the diff limited to this card's paths + code-style.md + glossary.md + journal.md + this card's capability
        document design zone and every existing file at an exact path listed in that zone's
        Binding ADRs section when that zone exists +
        exactly one design-freshness, reconfirmation, or baseline-missing projection +
        every currently existing exact path the card's `Read first` names**
        (project files only when they exist). Holding back a basis split already approved is
        what turns a reviewer into a guesser. Report a missing path and invent no substitute
        — the same rule the loop applies when it opens `Read first` itself. Validate `Read first`
        before assembling: a baseline path directly under `devflow/project/capabilities/` is
        the legacy wiring this loop already refuses to open, and in a card's contract it is a
        defect — start no review and hand the reviewer nothing: checkpoint, name that exact
        invalid path in the progress log, release the claim, and take it to the owner section
        of `Review — one flow` below. Give all of them
        except a knowledge-capsule body at `devflow/project/capabilities/NN-name/K-NNN-topic.md`.
        That path stays visible inside the Progress-excluded card, but synthesize no capsule
        header, provenance, or remaining budget for the reviewer — the loop's capsule gate
        stays the only opener. Do not enter
        review when a design hypothesis used by
        the implementation has not been reconfirmed. No implementation backstory — the
        progress log IS the backstory. The code must explain itself.
        Recommended: T-high + low effort, kept short.
        Capture the full `git rev-parse HEAD` immediately before assembling the review input
        and record the returned result as the canonical `review result:` line, writing that
        value as its `head:`. The line rides the next canonical task commit before the task
        diff changes and before this path leaves for a boundary or design commit — the same
        `NN.N wip: <what>` checkpoint on `objections` or `unverified`, the final task commit
        for a straight-through final `pass`, and the `NN.N wip: evidence-wait` checkpoint for
        a clean review on the remote-evidence path. The third objection about the code is the
        one exception: `Review — one flow` below anchors it together with the person's
        disposition.
        The review lifecycle — the completion precondition, the tail written but not yet
        anchored, the objection count, the human boundary, and recovery — is the
        `Review — one flow` section below
        When only remote evidence remains in the completion signal, finish the canonical
        exact `remote evidence check` log, evidence-wait checkpoint, journal record commit,
        and push, then end this invocation. Upper-document feedback, the final task commit,
        and `.done.` wait for the evidence verdict in the next invocation
  ↓
Upper-document feedback judgment — before the final task commit, ask whether this card
        settled or contradicted anything an upper document left open (a Provisional row
        in arch, a success criterion in product, an ADR premise). If the change would
        make the current card `.stale.`, do not make the final task commit. Instead make
        an `NN.N wip: upper-document change` checkpoint, enter the canonical Document
        Hierarchy procedure, and leave this completion path. For a compatible update,
        write the exact document path, heading, and replacement text in the progress log
        and continue
  ↓
Carry check — immediately before the final task commit, rerun the state tool. Continue
        only when the current card's `claim: kind=mine` line says `carry=present`. When it
        says `carry=absent`, append the canonical `carry:` line to the progress log, rerun
        the tool, and confirm `present`
        Every signal and review result is written before this line, and no machine
        line follows it — a re-run after a human disposition included. That is what lets
        the state tool read one last progress line. If inputs change after it,
        run the signal and review again and append a new final `carry:`
  ↓
Final task commit — the canonical 1 task = 1 commit discipline. On a remote-evidence pass,
        this commit replaces `evidence-wait` with `evidence-finalizing` while preserving
        its fields
  ↓
Integration gate — under the canonical rules, integrate the task commit before any
        boundary working-tree change
  ↓
Land upper-document feedback — when the judgment recorded an update, fix that document
        before renaming through the canonical rules' discovery→update table. **A card that measured an answer but
        left the document that posed the question unchanged is not done** — the stale
        upper document outranks your measurement, and the next implementer follows it.
        User confirmation for product.md edits follows the canonical rules' Document
        Hierarchy section (identity paragraph · Capabilities · Boundary · success criteria).
        When an execution fact this card settled will be reused by later
        cards, promote it to the statement that owns that
        fact — the number, the execution conditions under which it is true, and the command
        that measures it again, in one block. The progress log points only at that document
        and place and never duplicates the observation
  ↓
Rename the card to .done. — only once the canonical rules' status-notation conditions
        for `.done.` are all met
  ↓
Foundation and intermediate folders: close each eligible non-capability ancestor under
        the canonical Status Notation, stopping before the depth-1 capability folder
  ↓
Boundary commit — immediately before the commit, run the state tool again and see this
        transition's `missing=` empty (the canonical Boundary commit). Bundle renames,
        HANDOFF, journal, and the documents fixed by feedback
  ↓
If a depth-1 capability folder reaches the canonical verification gate → propose verify
        (capability layer)
```

The judgment for an automatically read capability document comes from
`node ../principles/scripts/project-state.mjs state --capability <capability number>` called
with that number. Take its `expectedSet`, `pathState`, `legacyV010`, `boundary`,
`shapeValid`, `anomalies`, `bindingAdrStatus`, `designHead`, `scopeHead`,
`designFreshness`, `verifiedFreshness`, and `coveredFreshness` values as they stand, and
recompute no git command or section comparison for the same judgment by hand.

If no document has that number as an integer, report
`no capability document for <number> — nothing on disk describes that capability, so the planning documents and this card carry the work`
in one line, continue from Layer 0 and the card, and give reviewer
`design: baseline missing — judge from the card and supplied shared documents`. If two or more documents have
the same number, report their exact paths, select none, and continue with the same projection.

When `legacyV010` is true, report
`<path> is a capability document in the earlier shape, so it stays unread until it is migrated — the planning documents and this card carry the work`
in one line, open no body, and continue active work with the same
baseline-missing projection.

When the selected file has zero or multiple fixed boundaries, guess no zone and read no
body — that is `boundary` not equal to one. Report the bounded shape facts that line carries
in one line and continue with the baseline-missing
projection above. With one boundary but `shapeValid` false, read the zones and mark the zone
`anomalies` names a hypothesis.

With one boundary, open only exact paths from a valid Binding ADRs section — `bindingAdrStatus`
says which. If that section is
absent or unparseable, open and infer no ADR path and make the design zone a hypothesis. If a
path named by a valid section is missing, report it, make the design zone a hypothesis, and
guess no substitute.

Design statements are Purpose, Boundary, Concept model, Invariants, and Non-goals;
verification statements are Main flow, Lifecycle, Current behavior, Entrypoints, Consumed
contracts, Traps, and Verify. `designFreshness` carries the design side, and verification
statements are fresh only when `verifiedFreshness` and `coveredFreshness` are both `fresh` —
`verifiedFreshness`'s `consumed-contracts` reason is the case where the
exact-path set in Consumed contracts differs from `Consumed paths`.
One further condition sits on top of that and the tool does not carry it — when a Consumed
contracts row's other-capability number differs from or is ambiguous under the current provider
mapping in arch.md's Code structure, verification statements are a hypothesis even
where the tool reports fresh.

Before implementation uses a design hypothesis, reconfirm it in the exact authoritative
section already read from product.md, arch.md, or glossary.md, or at an already-open exact
path from a valid Binding ADRs section. Reconfirm a verification
hypothesis in current code or cards inside the existing read set and code-search boundary,
which for reconfirmation alone also holds `Consumed paths`.
Expand neither further. Keep every design reconfirmation as `exact path#heading`, without duplicates
and in canonical path order, in the reviewer projection. Use the canon's current path/status
notation for `coveredFreshness`'s `symmetricDifference` as the
post-baseline change list. Report one line: `capability document verified <Verified at>,
design <fresh|hypothesis|missing>, verification <fresh|hypothesis|missing>, <M> cards changed
since — fresh means its inputs have not moved, hypothesis means it is reconfirmed before use,
and missing means there is no such statement`; with no
baseline, the Verified-at value is `missing`.

When the user, mid-card, asks for something that qualifies under the canonical rules'
tweak lane, make separate `tweak` commits through that lane — one per depth-1 unit, as
its rule directs — and return to the card —
the commit carries only its own paths, and changes the card work made to the same file
land first as that card's wip checkpoint through the tweak lane's target-path check. A
Git commit records a path's final content, so without that check the same file's card
changes ride the tweak commit.

## Review — one flow

The review lifecycle lives here, in one place, so that no step of it has to be inferred
from half a sentence somewhere else. It turns on three distinctions — the verdict of the
completion result, the tail written but not yet anchored, and the reduction of the anchored
events. All three are functions of evidence already in Git, so an interrupted session reads
them again instead of remembering.

**Boundary.** Everything below is read from the canonical planning commit carrying this
card's current `Approval` forward, in commit order. A new execution-proposal approval is a
new boundary and the objection count starts again at zero. **The objection count** is the
anchored objections about the code after that boundary — one review carrying five objections
is one, and `pass`, `unverified`, and an objection about the card's contract raise nothing.
**The person's disposition** is valid only in the same checkpoint as the third objection
about the code and immediately after that line — it is a bounded ordinary Progress entry that
invents no machine format, and a disposition written anywhere else is not one.

### 1. The completion precondition

Current means both fresh and a verdict: its completion inputs and this card's task diff are
unchanged since it ran, and the line carries one of the three verdicts. No clean review
starts unless the current local completion result is `pass`. "Establish a current `pass`"
below means running this table until `pass` stands.

| The card's completion signal | What happens next |
|---|---|
| running it establishes that only remote evidence remains | no generic completion line is created or required for that result — take the clean review, then the loop's remote-evidence route above. A rerun after an interruption may rediscover the same thing; never wait here for a line the canonical rules forbid |
| its newest local result is absent, unreadable as a verdict, or stale | run the completion signal, record its result, and read this table again |
| its newest local result is current and `fail` | anchor that line in its `NN.N wip: <what>` checkpoint under the canonical rule before any code change, then repair and run it again |
| its newest local result is current and `unverified` | anchor it the same way first, then clear the reason it records and run it again. A reason this loop cannot clear is reported to the person as the blocker it is |
| its newest local result is current and `pass` | the precondition stands. Feed it to the review even when it is not yet anchored — do not run it again merely because it is unanchored |

### 2. Settle the written tail before acting on it

With no `review result:` written but unanchored, go to 3. With one, the row below is where
that line stands, and 3 is read after that settlement.

| A `review result:` written but not yet anchored | What happens next |
|---|---|
| stale — its completion inputs or this card's task diff changed since that review ran | it is not evidence: leave the line where it is and read only the anchored events in 3 |
| a fresh `pass` | it takes no anchor of its own: it is the latest settled event that 3 reads, and the action 3 selects — the final task commit, or the `evidence-wait` checkpoint — carries it. Never take the review again for it, and never carry out an already-consumed disposition again |
| a fresh objection about the code that is the first or the second, an objection about the card's contract, or `unverified` | anchor it in its own `NN.N wip: <what>` checkpoint before the action it selects changes the diff or releases the claim |
| a fresh third objection about the code | anchor it together with the person's disposition in one checkpoint — when that disposition is already written beside it, recognize it and anchor both; when it is not, ask once and anchor both together |

### 3. Reduce the settled events

Read the settled review events after the boundary in commit order: the anchored
`review result` lines, and a fresh unanchored `pass` from 2 as the latest of them. After a
valid disposition that pass is the one consuming result, so it finishes rather than
authorizing another review. The conditions below do not overlap, so the one that holds is the
next action.

| Settled evidence | What happens next |
|---|---|
| a valid disposition with no settled `review result` after it | first carry out what that disposition says, establish a current `pass` by 1, then take exactly one clean review |
| a valid disposition with exactly one settled `review result` after it, and it is `pass` | the carry line, then the final task commit |
| a valid disposition with exactly one settled `review result` after it that is not `pass` | that disposition is spent — stop and report to the person. Later evidence never revives it, and this objection does not go to split |
| a valid disposition with two or more settled `review result` lines after it | the record is broken — stop and report to the person |
| no valid disposition, and no settled `review result` after the boundary | establish a current `pass` by 1, then take the first clean review |
| no valid disposition, and the latest result is `pass` | the carry line, then the final task commit — the remote-evidence path takes the `evidence-wait` checkpoint above |
| no valid disposition, and the latest result objects to the card's contract | the owner section below, whatever the objection count |
| no valid disposition, and the latest result objects to the code and is the first or the second | make the repair it names, establish a current `pass` by 1, then take a new clean review |
| no valid disposition, and the latest result is `unverified` | clear the reason it records, establish a current `pass` by 1, then take a clean review again. It is no objection and calls no one by itself, and a reason this loop cannot clear is reported to the person as the blocker it is |
| no valid disposition, and the latest result objects to the code and is the third or later | stop and report to the person — a disposition written in any other checkpoint authorizes nothing. Only a fresh execution-proposal approval from split is a new boundary and starts the flow over |

**An objection about the card's contract belongs to split.** The reviewer is saying that the
Progress-excluded card plus the exact files it received cannot decide the question, so what
needs fixing is the card, and the card is split's. Before releasing the claim, write the
missing proposition and what this loop observed into the progress log, concretely — that is a
handoff, not authority to change a document outside the card. split changes only what it
already owns: the task card's fields and the exact `Read first` paths already in that card.
It establishes any replacement statement or path from the existing canonical owner under its
own permitted reads. It writes no arch file, capability document, or other `Read first` file
from the progress log, and it neither opens nor infers a capsule. When no legitimate existing
non-capsule basis can go into the card's contract, it does not approve the same card again:
it stops and reports to the person. The same route carries the defect this loop finds itself
before a review: an invalid exact `Read first` path named in the progress log is the same
card-contract defect, and split repairs it under the same limits. That check runs when the
review input is assembled, so a step 3 owes first — carrying out a disposition, making a
repair, clearing an `unverified` reason — happens before it. An approval that does land
is a new boundary, so the objection count starts at zero.

This section and `reviewer.md` are different homes — procedure here, role boundary there.
Do not copy the objection count or the human boundary into the role contract.

## When You Must Leave the Card — stop and go up

If you need to modify something outside the card's scope (shared contracts, core,
another capability):

```
① Stop. Write 2 lines of "why this is needed" in the progress log
② Land the current code and progress log in a `02.2 wip: <blocking reason>` checkpoint
   commit
③ While the original remains claimed, use split to create a card in the required location
   (e.g., 01-foundation/01.7-auth-contract-v2.md), then add its number to the original
   card's `Depends` first. Get the new card's execution proposal approved, then remove the
   original claim suffix last. Put the new card, dependency change, approval, and release
   in one planning commit. When the inserted prerequisite is a research card, that same
   commit also returns the original card to `Approval: pending` — its destination and
   completion signal stand on an answer that does not exist yet
④ Once that planning commit is effective, handle the new card. The original card becomes
   ready again when that card is `.done.`
```

Silently widening scope is the worst failure. Stopping is not failure — it is correct
operation.

If the conflict is with an **upper document** (product, arch, code-style) rather than
code, follow the document-hierarchy procedure in the canonical rules — fixing the
document comes before creating a card.

## Letting Go of a Card — parking only on explicit request

Moving to another card needs no procedure: claim it (precondition 3). Parking — a release —
happens only when the user explicitly asks to let this card go. A card that a journal
`evidence-wait` or `evidence-finalizing`
line names is not parked — releasing it would leave that record pointing at an unclaimed
card, which integrity item 13 reports. Finish its remote-evidence transition first. While
its verdict stays `pending`, answer a park request with that reason and leave the card
claimed — any other card can simply be claimed instead.

```
① Land the changes this session made for that card, and its progress log, as an
   `NN.N wip: <reason for stopping>` checkpoint. Uncommitted changes this session did
   not make belong to another flow and do not ride. With nothing changed, make no commit
② Remove the claim suffix, returning the card to pending
③ Claim, in this same invocation, the replacement card the user named in it, when that
   card is listed in the `ready:` zone. With no card named, or a named card that is
   not ready, claim no automatic candidate: say which condition fails and ask what to do. Integrate the checkpoint first,
   then land the release as the canonical binding decision it is
```

The card just parked keeps its approval and dependencies, so canonical candidate order puts
it first again — an automatic candidate at ③ would make the switch cancel its own purpose.
Invent no state that preserves "later" across sessions: this switch's destination holds
only inside this invocation.

This does not collide with the ban on mid-task handoff: parking is a release, not a handoff.

## Stuck-Escape — event-based

If the same cause hypothesis has failed twice — the same command failing with the same
error twice qualifies with no judgment needed — stop before the third fix attempt.
Write the hypothesis and its refuting evidence as one line in the progress log. If the
hypothesis still stands after writing that line, pick one:

- **Insert a research card in front** — use the "When You Must Leave the Card" procedure
  above so split creates it and adds it to the current card's Depends. A minimal
  reproduction is the deliverable
- **A clean-context diagnosis** — hand over only the card (Progress log section
  excluded) and the failure evidence, and receive a cause diagnosis. A failed
  hypothesis blinding the eyes is what causes stuckness.

A delegated implementer stops and reports blocked — both exits belong to the main session.

## Delegating to Subagents

- **The card defines the work unit.** The briefing is exactly the card path + canonical
  rules path + `devflow/project/product.md` + `devflow/project/arch.md` +
  `devflow/project/code-style.md` + the existing `devflow/project/design.md` + the existing
  `devflow/project/glossary.md` and `devflow/journal.md` + every direct dependency-card
  path + the automatically selected capability document and Binding ADR paths + the carry-
  line query output + the design
  and verification freshness and reconfirmation projection. Give no other conversation
  backstory. After reading the card, the delegate opens
  its `Read first` paths exactly. Never put arch section names in `Read first`. For T-low
  tier, first check the card's `Read first` is complete; reinforce it if not.
- **The stage split is fixed: subagent = implement + run the completion signal + progress
  log. Main = review + commit + feedback + rename (plus the signal re-run triggered by
  its own fix).** Checkpoint commits are the main
  session's too — a subagent's protection is its log (if it dies, main redispatches).
- **Return is fixed at 5 lines:** status (done/blocked) · changed files · completion-signal
  result · learned · open. Details go straight into the progress log by the subagent
  itself. The main session takes only the 5 lines.
- On failure, the canonical rules' failure ladder. Never re-dispatch the same prompt.

## Parallel Delegation — several subagents inside one session

This section covers only one session dispatching several subagents at once — sessions in
the same folder each carrying their own card are the canon's "Several hands in one
working folder" and need no approval. Parallel delegation runs only when approved in
split's execution proposal. Same conditions as split:
only tasks that don't overlap in files AND don't touch a shared dev server. Frontend
work sharing a dev server is sequential.

## Handoff Trigger — events, not percentages

**You cannot observe your own context usage.** A rule hung on a percentage is a rule you
guess at and get wrong. The user sees the gauge; your triggers are events you CAN observe:

```
Before opening a new capability folder     → state the size of the next step and ask the
                                             user (the biggest single commitment in the tree)
Before a long card · at checkpoint commits → report the context concern and the next
                                             step's size. Do not wait for a reply
When the harness warns about context       → whatever the number, open no new task.
                                             Prepare handoff at the boundary
```

Handoff happens **only at task boundaries**. Never mid-task — half-written code and a
half-true explanation get handed over. Mid-task safety belongs to the loop's log gate,
not to a handoff document.

Before writing HANDOFF, check: did this session's conversation produce anything that
matches a row of the discovery→update table but is not yet in that document? If so,
land it through the table first — HANDOFF carries only the volatile remainder. Nothing
to land is the normal case — if you landed things as they happened, this check is empty.

My room's `devflow/users/<my id>/HANDOFF.md` — overwritten
every time. **No position, no progress percentages** (the tree answers those). Volatile
context only:

```markdown
# HANDOFF · <YYYY-MM-DDTHH:MM:SSZ>
## Next single step          <!-- one tree path | none -->
```

`Next single step` is mandatory and holds one tree path. The mechanical next card is owned
by the tool's `ready:` order, so write that value as it stands, and write a different path
only when this session heard a fresher preference from the user — that difference is all
HANDOFF adds. Write `none` only when the tree has no pending and no claimed card
at all. Add no other section to this file, so that when two sessions of one room overwrite
each other, the only thing lost is a value that is recomputed. Anything else this session
learned lands durably instead — the card's carry line inside this unit, a journal
`capability note` about another capability, an attributed journal line for an open item a
person must decide.

The first time this room's HANDOFF still carries a `## Just learned`, `## Traps`, or
`## Open decisions` section,
land that content before overwriting: through the discovery→update table where a row takes it, as a
`capability note` where it belongs to another capability, in this card's carry line
where it belongs to this one, and as an attributed journal line where a person must decide
it. Overwrite only after that landing. Do not backfill carry lines
onto older `.done.` cards.

HANDOFF and journal are main-session-only.
