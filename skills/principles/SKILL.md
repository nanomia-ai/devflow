---
name: principles
description: devflow canonical rules. Every devflow skill follows this document first — the 7 prompt principles, model tiers, failure ladder, status notation, commit discipline, and the verification iron rule.
---

# devflow Principles (Canonical Rules)

Every devflow skill, card, and prompt follows this document. When any other document
conflicts with it, this document wins.

## The 7 Prompt Principles

1. **One concept, one word.** No synonyms. Register project-specific terms in
   `devflow/project/glossary.md` and use the same word everywhere, to the end.
2. **Destination over instruction.** Write "what must become true," not "what to do."
3. **Rich direction, short prohibitions.** Give context, intent, and the "why" generously.
   Keep the harness (prohibitions) to 3 lines or fewer.
4. **Never prescribe the method.** The executing model decides how to implement.
5. **One example beats five rules.**
6. **Avoid off-the-shelf methodology terms.** Words like spec-driven, TDD, DDD drag in
   baggage you did not choose.
7. **Repeat the identity.** Copy the identity paragraph from `product.md` verbatim into
   every task card. This is the only duplication allowed — it costs one paragraph and
   buys "never getting lost."

## Document Hierarchy (the contract)

`product ⊃ arch ⊃ design·code-style ⊃ tree (cards)`. **A lower layer may not violate an
upper layer.** If it must, that is an upper-layer decision:

1. Stop. Write 2 lines of "why" in the progress log.
2. Fix the upper document (add an ADR if the three ADR conditions hold — see arch).
3. Mark invalidated cards `.stale.`; add 1 line to journal.md.
4. Re-split the affected range, then resume.

What you discovered → where to update:

| Discovery | Update target |
|---|---|
| Feature, screen, or scope changed | product.md (+ mark affected cards `.stale.`) |
| Stack, module boundary, or data shape doesn't fit | arch.md (+ consider an ADR) |
| A new coding-convention decision is needed | one line in code-style.md "Project choices" |
| The task is merely bigger than expected | no document change — promote the card to a folder |
| A cross-task decision | one line in journal.md |

Core documents (`devflow/project/*`) are modified **only through this procedure or by
re-running the owning skill** — never edited in passing during a task. And modification
means **replacement by default**: if you added a line, check whether you deleted the stale
one. A document that only grows is a dead document.

## Integrity Check

Run at the gates that open the tree (start of split and resume).
**Report anomalies — do not fix them.** Auto-correction that misjudges accelerates
corruption. Correct only after user approval.

1. Are there 2 or more `.wip.` cards (without approved parallelism)?
2. Are any numbers duplicated?
3. Is there a non-done card inside a `.done` folder?
4. Does every card's `Depends` point to a number that exists?
5. Do the paths referenced by HANDOFF exist?

## Model Tiers

**Never write model names in files.** Use tiers only. The actual model and reasoning
effort are chosen by the user, per session, in split's execution proposal.

| Tier | Role | Use for |
|---|---|---|
| T-high | Top-tier reasoning | Judgments and reviews. Keep them short — long runs don't justify the cost |
| T-mid | Standard reasoning | The default. Planning, splitting, ambiguous or entangled tasks |
| T-low | Implementation-focused | Implementation with a complete card, mechanical transforms, collection/cleanup |
| Below that | — | Never for coding |

Reasoning-effort rule: **judgments = higher tier + low effort, kept short. Design =
standard tier + high effort, kept deep.**

The harness dial — inversely proportional to tier:

- T-mid and above: destination + 3 lines of prohibitions. No path instructions —
  prescribing the method actively degrades performance.
- T-low: fully enumerate `Read first` + ordering hints + expanded prohibitions +
  the completion-signal commands verbatim.
- **If you don't have time to write a T-low-grade card, don't give that task to T-low.**

## Failure Ladder (applies to every retry)

```
1st failure → reinforce the card and re-dispatch (never re-dispatch the same prompt —
              failure signals a defective card)
2nd failure → raise the tier, or the main session does it directly
3rd failure → call the human. There is no 4th attempt
```

## Status Notation

**The file tree is the single source of truth for progress. Never write progress into
documents.**

- No suffix = pending / `.wip.` = in progress / `.done.` = complete / `.stale.` =
  invalidated by an upper-level decision change
- Only one `.wip.` at a time (approved parallel tasks are the exception)
- `.done.` **only after verification passes AND the commit lands**
- When all children are `.done.`, the folder receives `.done` too.
  Exception: **a depth-1 capability folder only after capability-layer verification** —
  verify grants it
- File base names and numbers are immutable identifiers. No renumbering, no reuse.
  Mid-insertions use the `02.2b` form
- Record files that are not cards (`verify.md`, etc.) carry no status suffix and are
  excluded from status judgment

## Commit Discipline

- **1 task = 1 commit.** Commit only after the completion signal passes. Message format:
  `02.2 signup API` (tree number + title).
- Mid-checkpoint commits for long tasks are allowed as `02.2 wip: <what>`.
- To undo, use a revert commit — never erase history.

## The Verification Iron Rule

**What was not executed is not "passed" — it is "unverified."**
Reading the code and thinking "it looks right" is not a verdict.
