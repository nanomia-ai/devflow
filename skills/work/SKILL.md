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
3. Otherwise rename the next dependency-free card to `.wip.` and begin.

## The Loop

```
Read the card fully (including Coordinates and Identity — know what this is a part of)
+ read devflow/project/code-style.md alongside, if it exists (values, choices, trust boundary)
  ↓
Before implementing: check whether what you're about to build already exists — around
`Read first` and in shared modules (reinvention happens from not knowing; this check,
not a rule, is what prevents it)
  ↓
Implement  ←→  append to the progress log (at every meaningful advance, decision, or
  ↓            discovery. Disk is the source of truth. If the session dies at any moment,
  ↓            reading this file alone must be enough to take over)
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
Rename the card to .done. (only after BOTH verification passed and the commit landed)
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
  For T-low tier, first check the card's `Read first` is complete; reinforce it if not.
- **Return is fixed at 5 lines:** status (done/blocked) · changed files · completion-signal
  result · learned · open. Details go straight into the progress log by the subagent
  itself. The main session digests only the 5 lines.
- On failure, the canonical rules' failure ladder. Never re-dispatch the same prompt.

## Parallelism

Only when approved in split's execution proposal. Same conditions as split:
only tasks that don't overlap in files AND don't touch the dev server. Frontend is
always sequential.

## Context Thresholds — handoff

```
~50%    normal
50–65%  before starting the next task, size it. If big, cut here
65%+    start no new task. Write HANDOFF and recommend ending the session
```

Handoff happens **only at task boundaries**. Never mid-task — half-written code and a
half-true explanation get handed over.

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

Global record: only cross-task decisions, 1 line appended to `devflow/journal.md`.
HANDOFF and journal are main-session-only.
