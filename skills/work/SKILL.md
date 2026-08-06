---
name: work
description: Implementation. Takes one task card, codes it, keeps the progress log on disk, runs the completion signal, and commits. Use when starting to code, continuing work, or beginning implementation.
---

# work — Implementation

First read the canonical rules (`../principles/SKILL.md`).

Purpose: carry one task card all the way to its completion signal, then commit.

## Preconditions

1. Is this a git repository? If not, propose `git init` (if declined, proceed but warn
   once: "no recovery possible").
2. If `devflow/tree/**/*.wip.md` already exists, that comes first. Do not open new work.
   (Exception: an evidence-wait card recorded in journal does not block the next card —
   see the canonical rules' commit discipline.)
3. Otherwise rename the next dependency-free card to `.wip.` and begin.

## The Loop

```
Read the card fully (including Coordinates and Identity — know what this is a part of)
+ read devflow/project/code-style.md and devflow/project/arch.md alongside
  (a decision that never reached the card does not exist for the implementer — from arch,
   at minimum the Stack, Code structure, Provisional, Risks, and verify_channel sections)
  ↓
Before implementing: check whether what you're about to build already exists — around
`Read first` and in shared modules (reinvention happens from not knowing; this check,
not a rule, is what prevents it)
  ↓
Implement  ←→  append to the progress log (at every meaningful advance, decision, or
  ↓            discovery. Disk is the source of truth. If the session dies at any moment,
  ↓            reading this file alone must be enough to take over)
  ↓            **Gate: the log must be current before starting any run that takes minutes
  ↓            or can fail (build, measurement, completion signal, install).** Those are
  ↓            exactly the runs that tempt you to postpone writing — and exactly when a
  ↓            session dies. Repeats of the same attempt can be batched into one line.
  ↓            On a long card, checkpoint-commit `02.2 wip:` at the same moments
  ↓            (the main session commits)
Run the completion signal — actually run it. Record the result in the log
  ↓
Review — give a clean context (Claude: the reviewer agent) **only the card + diff +
        code-style.md**. No implementation backstory — the code must explain itself.
        Three verdict axes: intent (destination achieved?) · logic (defects on paths the
        signal doesn't cover?) · scope (Forbidden violated, silent expansion?)
        Recommended: T-high + low effort, kept short. Research cards skip review.
        Objection → fix → re-review. Failure ladder applies — 3 strikes calls the human
  ↓
Commit: `02.2 signup API` format. 1 task = 1 commit (mid-checkpoints for long tasks
        allowed as `02.2 wip: ...`)
  ↓
Upper-document feedback — before renaming, ask: did this card settle or contradict
        anything an upper document left open? (a Provisional row in arch, a success
        criterion in product, an ADR's premise) If yes, fix that document first via the
        canonical rules' discovery→update table. **A card that measured an answer but
        left the document that posed the question unchanged is not done** — the stale
        upper document outranks your finding, and the next implementer follows it.
        Only edits that change product.md's scope need user confirmation
  ↓
Rename the card to .done. (only after the completion signal and review passed AND the
        commit landed)
  ↓
Boundary commit — bundle renames, HANDOFF, journal, and the documents fixed by feedback
        (the canonical rules' commit discipline)
  ↓
If every card in the folder is .done. → propose verify (capability layer)
```

## When You Must Leave the Card — stop and go up

If you need to modify something outside the card's scope (shared contracts, core,
another capability):

```
① Stop. Write 2 lines of "why this is needed" in the progress log
② Create a new card in the upper folder (e.g., 01-foundation/01.7-auth-contract-v2.md,
   split's card format)
③ Handle the upper card first — core work is never parallel
④ Add it to the original card's Depends and resume
```

Silently widening scope is the worst failure. Stopping is not failure — it is correct
operation.

If the conflict is with an **upper document** (product, arch, code-style) rather than
code, follow the document-hierarchy procedure in the canonical rules — fixing the
document comes before creating a card.

## Delegating to Subagents

- **The card IS the briefing.** Hand over only the card path + the canonical rules path.
  A delegated card names the arch sections it needs in `Read first`. For T-low tier,
  first check the card's `Read first` is complete; reinforce it if not.
- **The stage split is fixed: subagent = implement + run the completion signal + progress
  log. Main = review + commit + feedback + rename.** Checkpoint commits are the main
  session's too — a subagent's protection is its log (if it dies, main redispatches).
- **Return is fixed at 5 lines:** status (done/blocked) · changed files · completion-signal
  result · learned · open. Details go straight into the progress log by the subagent
  itself. The main session digests only the 5 lines.
- On failure, the canonical rules' failure ladder. Never re-dispatch the same prompt.

## Parallelism

Only when approved in split's execution proposal. Same conditions as split:
only tasks that don't overlap in files AND don't touch the dev server. Frontend is
always sequential.

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

`devflow/HANDOFF.md` — overwritten every time. **No position, no progress percentages**
(the tree answers those). Volatile context only:

```markdown
# HANDOFF · <date time>
## Next single step          <!-- one tree path -->
## Just learned              <!-- only what is in neither the tree nor any card -->
## Traps
## Open decisions (needs a human)
```

If all four are empty, an empty file is fine — resuming from the tree alone is the
normal case.
Unresolved items from the previous HANDOFF's Open decisions must be carried forward.
Once resolved, record the decision in journal or the owning document, then drop it.

Global record: cross-task decisions, plus the status records the rules require
(parallel approval, evidence-wait) — 1 line appended to `devflow/journal.md`.
The sweep happens when a capability closes, by verify.
HANDOFF and journal are main-session-only.
