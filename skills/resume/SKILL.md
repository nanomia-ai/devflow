---
name: resume
description: Resume. In a new session, reads the task tree and HANDOFF, works out how far things got, and continues. Use for session restarts, continuing work, or checking where things stand.
---

# resume — Resume

Purpose: a new session restores state from five reads and continues.

## Procedure — in exactly this order

```
1. devflow/project/product.md identity paragraph   ← what this service is
2. devflow/tree/ full listing                      ← how far things got (.done. / .wip. / pending)
3. any *.wip.md — read fully                       ← progress log included. Where it stopped
4. devflow/HANDOFF.md                              ← traps, learnings, open decisions
5. tail of devflow/journal.md (if present)         ← cross-task decisions
```

**Check HANDOFF's freshness before trusting it.** Compare its date against the last commit.
HANDOFF is written only at task boundaries, so a session that died mid-task leaves the
*previous* boundary's file behind — describing a next step already taken. If it is older
than the last commit, report it as stale and let the tree and the `.wip.` card decide.
**When HANDOFF conflicts with the tree, the tree wins.**

While reading, also run the canonical rules' **integrity check** (5 items).
Report anomalies — do not fix them; include them in the report below.

## Report, Then Approval

Report what you read in **one paragraph**:

```
"<service> is complete through <capability>, with <task> in progress.
The progress log reaches <last point>; the next step is <one step>. Proceed?"
```

Once approved, continue into work. Never modify code before approval.

## Exceptions

- No `.wip.`: propose the next dependency-free card from the tree.
- HANDOFF missing or empty: normal. Resume from the tree alone.
- No tree at all: this project doesn't use devflow. Direct to product (new) or
  arch (existing code).
