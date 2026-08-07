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

## Modes and Identity

devflow runs in one of two modes. The test is a single file:

- If any `devflow/users/*/owner.md` exists — **multi mode**: several people run their own
  sessions in one repository.
- If none exists — **solo mode**: ignore every rule in this document marked "multi:".
  Solo behavior is identical to the version before those rules existed.

multi: resolve your id before writing to the tree, journal, or shared documents — match
your git identity (name or email) against `devflow/users/*/owner.md`. No match → ask the
user once and create your room. A session that cannot resolve an identity (CI, bots)
only reads.
ids are lowercase `[a-z0-9]{2,8}`. Names devflow uses (project, tree, users, decisions)
are forbidden; ids are never reused.

Room = `devflow/users/<id>/` = owner.md (identity declaration) + HANDOFF.md + digest.md
(the digest marker). Write only in your own room. Rooms are readable by the whole team —
write with that premise.

multi: **only `.wip-<my id>.` is my work.** The precondition, full-read, and continuation
rules apply to my claim only. Another's claimed card is read-only reference — never write
a card you have not claimed.

Mode transitions — each is a single-commit procedure:

- Joining: create your room (owner.md) + marker = current HEAD. Past understanding comes
  from the shared documents, not from commit archaeology.
- Solo→multi: create the room + move `devflow/HANDOFF.md` into it + `.wip.` →
  `.wip-<id>.` + marker = HEAD. Solo traces seen in multi mode (a bare `.wip.`,
  `devflow/HANDOFF.md`) mean the transition is incomplete — report, confirm the owner
  with the user, and finish it. Never guess.
- Departure: the user declares it. Any remaining member — promote the departed room's
  open decisions into journal (attributed), release their claims, delete the room,
  1 journal line. This is the sanctioned exception to both "write only in your own room"
  and claim inviolability.
- Multi→solo (last member): HANDOFF back to devflow/, delete users/, suffixes back to
  `.wip.`, remove arch's multi-only config lines (integration, merge).

## Document Hierarchy (the contract)

`product ⊃ arch ⊃ design·code-style ⊃ tree (cards)`. **A lower layer may not violate an
upper layer.** If it must, that is an upper-layer decision:

1. Stop. Write 2 lines of "why" in the progress log.
2. Fix the upper document (add an ADR if the three ADR conditions hold — see arch).
3. Mark invalidated cards `.stale.`; add 1 line to journal.md.
4. Re-split the affected range, then resume.

**A contradiction between documents is a defect, not a precedence question.** Silently
adopt neither side — stop, reconcile through this procedure, then proceed. A delegated
implementer stops and reports only; reconciling is the main session's job.

What you discovered → where to update:

| Discovery | Update target |
|---|---|
| Feature, screen, or scope changed | product.md (+ mark affected cards `.stale.`) |
| Stack, module boundary, or data shape doesn't fit | arch.md (+ consider an ADR) |
| A value the upper document called provisional is now measured | that row of arch.md's Provisional table — **replace it, don't add beside it**. An ADR that assumed the old value gets a dated update note |
| A success criterion turns out unrunnable as written | product.md (+ the cards that quote it) |
| A `.done.` card's completion signal turns out unrunnable | fix that card's signal text too — regression must stay runnable |
| A new coding-convention decision is needed | one line in code-style.md "Project choices" |
| A new term becomes necessary | one line in glossary.md |
| The task is merely bigger than expected | no document change — promote the card to a folder |
| A cross-task decision | one line in journal.md |

An update per this table (replacing a provisional value, fixing a signal text, etc.) is
itself a sanctioned modification path. Steps 1–4 run only when a lower layer must
**violate** an upper one.

Core documents (`devflow/project/*`) are modified **only through this procedure or by
re-running the owning skill** — never edited in passing during a task. And modification
means **replacement by default**: if you added a line, check whether you deleted the stale
one. A document that only grows is a dead document.

## Integrity Check

Run at the gates that open the tree (start of split and resume).
**Report anomalies — do not fix them.** Auto-correction that misjudges accelerates
corruption. Correct only after user approval.

1. Are there 2 or more `.wip.` cards (with no parallel-approval or evidence-wait record
   in journal — multi: judged per id)?
2. Are any numbers duplicated?
3. Is there a non-done card inside a `.done` folder?
4. Does every card's `Depends` point to a number that exists?
5. Do the paths referenced by HANDOFF exist?
6. multi: is there a bare `.wip.` (ownerless claim, or an incomplete transition)?
7. multi: do two or more owner.md files claim the same git identity?
8. multi: are there commits touching a card claimed by someone else?

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
- multi: a claim is written `.wip-<id>.` — a bare `.wip.` is an ownerless claim = an
  integrity anomaly. Release strips the whole suffix back to pending (the progress log
  stays in the card). `.done.` and `.stale.` stay unattributed — completion's ownership
  is git's memory
- Only one `.wip.` at a time (multi: one per id. Exceptions: approved parallelism,
  evidence-wait — both grounded in a journal record)
- `.done.` **only after the completion signal passes, the review that applies to the card
  passes, and the commit lands.** In this system, "verification" is reserved for verify's
  capability and product layers
- When all children are `.done.`, the folder receives `.done` too.
  Exception: **a depth-1 capability folder only after capability-layer verification** —
  verify grants it. The foundation folder (01) is not a capability: it closes with no
  scenario rite once all children are `.done.`
- A retired capability folder gets `.stale` — every card status inside it is void.
  The hook and the integrity check do not count inside `.stale` folders
- File base names and numbers are immutable identifiers. No renumbering, no reuse.
  Mid-insertions use the `02.2b` form
- Record files that are not cards (`verify.md`, etc.) carry no status suffix and are
  excluded from status judgment

## Commit Discipline

- **1 task = 1 commit.** Commit only after the completion signal passes (see the
  exception below when only remote evidence remains). Message format:
  `02.2 signup API` (tree number + title).
- Mid-checkpoint commits for long tasks are allowed as `02.2 wip: <what>`.
- When only remote evidence (CI, etc.) remains in the completion signal: get the review
  first, then push the real task commit. The card stays `.wip.` (evidence-wait) until the
  evidence arrives, with 1 journal line. When it arrives, the rename and the journal
  line's deletion ride in the boundary commit.
- **Boundary commit**: bundle status renames, HANDOFF, journal, and documents fixed by
  upper-document feedback (see work) into one commit. Message: `boundary — <what closed>`.
  HANDOFF never gets a dedicated commit — it only rides here.
- **git belongs to the main session.** Subagents implement and write the progress log —
  they never commit, rename, or push.
- multi: prefix commit messages with your id — `<id> 02.2 signup API`,
  `<id> 02.2 wip: ...`, `<id> boundary — ...`. Solo formats are unchanged.
- multi: a **binding decision** — one that affects shared documents, tree structure or
  numbers, or a card someone else claims. Land a commit containing only that change
  (document + journal line) on the integration branch (arch config) now — nothing else
  rides along. Everything else rides your own branch.
- multi: if pulling integration shows someone else's claim already landed on the same
  number, you lost — copy your progress log into the surviving card and step back.
- multi: duplicate numbers from concurrent minting — the later-merged side moves to the
  mid-insertion form (`03.2` → `03.2b`). Allowed only before `.done.`; 1 journal line.
- multi: journal merge conflicts resolve as a union — keep both sides, date-ordered.
  Squash merges are forbidden (they erode every rule built on `NN.N` history) — the
  policy is declared in arch's config.
- To undo, use a revert commit — never erase history.

## The Verification Iron Rule

**What was not executed is not "passed" — it is "unverified."**
Reading the code and thinking "it looks right" is not a verdict.
