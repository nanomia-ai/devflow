---
name: work
description: Implementation. Takes one task card, codes it, keeps the progress log on disk, runs the completion signal, and commits. Use when starting to code, continuing work, or beginning implementation.
---

# work — Implementation

First read the canonical rules (`../principles/SKILL.md`) and canonical state predicates
(`../principles/state-predicates.md`).

Purpose: carry one task card all the way to its completion signal, then commit.

## Preconditions

1. Is this a git repository? If not, propose `git init` (if declined, proceed but warn
   once: "no recovery possible").
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
   the last commit changing one of my claimed cards that no evidence record names has the
   canonical final task subject, open no new work. The final task commit is already complete
   under the canonical commit discipline; make no second final task commit and finish only
   upper-document feedback and the boundary.

   Exclude a remaining valid `evidence-wait` card from the claim count below. If one
   `.wip.` (solo) or `.wip-<my id>.` (multi) card remains, it comes first; open no new work.
   If two or more remain, report an integrity anomaly unless their cards carry reciprocal
   parallel Approval. When they do, use the first full card path in canonical path order for
   this invocation. multi: others' claims do not count — they are read-only reference
   (the canonical rules' "Modes and Identity").
   If the claimed card lacks `Approval` or `Review`, has `Approval: pending`, or has
   noncanonical `Depends`, make no new implementation change. First land any current diff
   or progress log in an `NN.N wip: legacy card migration` checkpoint. Then release the
   card, finish split's legacy normalization, execution-proposal approval, and planning
   commit, and reclaim it.
   Read the claimed card's `Depends` under the state predicates' canonical or legacy format. If any
   member is unparseable, or a number does not resolve to exactly one card, report an
   integrity anomaly and stop. If any resolved card is not `.done.`, do not resume
   implementation; return to split, release the original card, and finish the prerequisite.
   If journal in HEAD or the working tree has an active layer-opening marker whose
   `source-json` decodes to a `card:` locator naming my claimed card, do not resume
   implementation; return to split to finish that marker's planning commit first.
3. When no claim of mine remains after excluding evidence-wait, claim the next pending card
   that is ready under the state predicates and begin. Return to split to normalize a
   noncanonical `Depends`; report and stop on an integrity anomaly. Do not claim a card
   that is not ready.
   solo: when the next card's effective `Approval` names a reciprocal parallel group and
   every card of that group is ready, claim the whole group in one step — rename every card
   of the group to `.wip.` together; otherwise claim exactly one card. multi: always claim
   exactly one card — an approved parallel group is distributed across members through
   ordinary claims.
   solo: rename to `.wip.` and begin — the rename rides the next wip checkpoint or final
   task commit that contains the card.
   multi: before claiming, pull the integration branch and finish the digest (resume's
   digest procedure). The rename commit to `.wip-<my id>.` is the claim (message:
   `<id> 02.4 claim`). Land this initial claim on integration as the canonical binding
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
  report it; do not guess a substitute. Do not open a path listed only in arch.md's
  `Existing records`
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
Run the completion signal — actually run it. Record the result in the log
  ↓
Review — omit this step when the card's `Review` is `waived`. Omit `not-applicable` only
        when the diff contains no real-code change. Otherwise brief a clean
        subagent/fresh session with `reviewer.md` beside this skill,
        **verbatim — never summarized** — main holds the implementation history, so
        main can never be the clean one — and give it **only the card (Progress log section
        excluded) + diff + code-style.md + glossary.md + journal.md** (the last three only
        when they exist). No implementation backstory — the
        progress log IS the backstory. The code must explain itself.
        Recommended: T-high + low effort, kept short.
        Objection → fix → re-review. A fix that changed the diff re-runs the completion
        signal — against the changed code, an earlier pass is unverified. Failure ladder
        applies — 3 strikes calls the human
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
Final task commit — the canonical 1 task = 1 commit discipline. On a remote-evidence pass,
        this commit replaces `evidence-wait` with `evidence-finalizing` while preserving
        its fields
  ↓
Multi integration gate — under the canonical rules, integrate the task commit before any
        boundary working-tree change
  ↓
Land upper-document feedback — when the judgment recorded an update, fix that document
        before renaming through the canonical rules' discovery→update table. **A card that measured an answer but
        left the document that posed the question unchanged is not done** — the stale
        upper document outranks your measurement, and the next implementer follows it.
        User confirmation for product.md edits follows the canonical rules' Document
        Hierarchy section (identity paragraph · Capabilities · Boundary · success criteria)
  ↓
Rename the card to .done. — only once the canonical rules' status-notation conditions
        for `.done.` are all met
  ↓
Foundation and intermediate folders: close each eligible non-capability ancestor under
        the canonical Status Notation, stopping before the depth-1 capability folder
  ↓
Boundary commit — bundle renames, HANDOFF, journal, and the documents fixed by feedback
        (the canonical rules' commit discipline)
  ↓
If a depth-1 capability folder reaches the canonical verification gate → propose verify
        (capability layer)
```

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
   in one planning commit
④ Once that planning commit is effective, handle the new card. The original card becomes
   ready again when that card is `.done.`
```

Silently widening scope is the worst failure. Stopping is not failure — it is correct
operation.

If the conflict is with an **upper document** (product, arch, code-style) rather than
code, follow the document-hierarchy procedure in the canonical rules — fixing the
document comes before creating a card.

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
  path. Give no other conversation backstory. After reading the card, the delegate opens
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

## Parallelism

Only when approved in split's execution proposal. Same conditions as split:
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

`devflow/HANDOFF.md` (multi: my room, `devflow/users/<my id>/HANDOFF.md`) — overwritten
every time. **No position, no progress percentages** (the tree answers those). Volatile
context only:

```markdown
# HANDOFF · <YYYY-MM-DDTHH:MM:SSZ>
## Next single step          <!-- one tree path -->
## Just learned              <!-- only what is in neither the tree nor any card -->
## Traps
## Open decisions (needs a human)
```

If all four are empty, an empty file is fine — resuming from the tree alone is the
normal case.
Unresolved items from the previous HANDOFF's Open decisions must be carried forward.
Once resolved, record the decision in journal or the owning document, then drop it.

HANDOFF and journal are main-session-only.
