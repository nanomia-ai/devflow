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
3. my claimed card, read fully                     ← progress log included. Where it stopped
   (solo `.wip.` / multi `.wip-<my id>.`. multi: others' claims as a one-line list only)
4. devflow/HANDOFF.md (multi: my room's HANDOFF.md) ← traps, learnings, open decisions
5. devflow/journal.md in full (if present — the sweep discipline keeps it short)
                                                   ← cross-task decisions
```

**Check HANDOFF's freshness before trusting it.** Compare its date against the newest
task commit (`NN.N` message form, wip included; multi: commits bearing my id prefix or
touching my claimed-card paths). Handoff is written only at boundaries,
so a session that died mid-task leaves the previous boundary's file behind — one that
points at a step already taken. If any task commit is newer than the HANDOFF date,
report it as stale and let the tree and the `.wip.` card decide. A missing date header
also counts as stale. **When HANDOFF conflicts with the tree, the tree wins.**
Even from a stale HANDOFF, include its Open decisions in the report.

While reading, also run the canonical rules' **integrity check** (5 items).
Report anomalies — do not fix them; include them in the report below.

## Report, Then Approval

Report what you read in **one paragraph**:

```
"<service> is complete through <capability>, with <task> in progress.
The progress log reaches <last point>; the next step is <one step>. Proceed?"
```

Once approved, continue into work. Never modify code before approval.

## Digest — catching up on others' work in multi mode

Digest happens only at a clean boundary — **if I have a claimed card, resuming it comes
first.** Digest runs after that card closes, or right before a new claim.

```
1. Pull the integration branch (arch config)
2. From commits after my room's digest.md marker, pick the digest targets:
   everything not authored by me + anything authored by me whose message's
   `<my id> NN.N` does not correspond to a card in my tree (= work outside my sessions)
3. Skim them; anything that contradicts the shared documents lands via the
   discovery→update table. Fixing a shared document is a binding decision
   (the canonical rules' commit discipline)
4. Backlog over 30 commits: do not walk them one by one — digest as a rollup by
   path/capability (`git log --stat`) or declare a re-baseline
5. Advance the marker; it rides the boundary commit
```

If the marker is unresolvable (force-push, etc.), report it and re-anchor with user
confirmation — default candidate: my last commit. Silent full re-digestion is forbidden.
A marker merge conflict (my two machines): keep the descendant hash; if unrelated, run
the re-anchor procedure.

## Exceptions

- No claim of mine: propose an unclaimed, dependency-free pending card.
  multi: include a one-line summary of others' claims (who holds what) in the report.
- HANDOFF missing or empty: normal. Resume from the tree alone.
- No tree at all: this project doesn't use devflow. Direct to product (new) or
  arch (existing code).
