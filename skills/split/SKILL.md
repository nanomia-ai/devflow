---
name: split
description: Task splitting. Opens the task tree (devflow/tree/) one layer at a time, creates task cards, and gets the execution proposal (order, parallelism, model tiers) approved by the user. Use for breaking down work, task decomposition, or planning what to do next.
---

# split — Task Splitting

First read the canonical rules (`../principles/SKILL.md`), `devflow/project/product.md`
(identity paragraph, capability list), `devflow/project/arch.md`, and **`devflow/journal.md`**
— the durable findings of earlier cards live there, and HANDOFF is overwritten and will
not carry them.

Purpose: open the task tree **one layer at a time**, and get the execution proposal approved.

## Preconditions

1. **If product.md is missing, stop.** With no code, direct the user to product first;
   with existing code, to arch (brownfield = the understanding stage). Never split a
   project you don't know.
2. Scan `devflow/tree/` for current state and run the canonical rules' **integrity check**.
   Report anomalies — do not fix them.
3. **Declare what you are opening, then proceed:** "Opening layer 3 under
   02-registration (currently done through 02.3.2)."
   If tree/ doesn't exist yet, "creating the tree" is the declaration. A misaligned
   understanding gets caught by the human at this one line.

## Tree Structure

```
devflow/tree/
  01-foundation/            ← repo setup, verify channel, shared contracts — the skeleton
  02-<capability>/          ← product.md capabilities become folders, names unchanged
    02.1-<task>.md
    02.2-<task>.wip.md
  03-<capability>.md        ← a capability not yet opened waits as a single file
```

- Folder/file names = the exact terms from product.md and arch.md. Coin no new words.
- Status suffixes and numbering follow the Status Notation section of the canonical rules.
- Brownfield: never backfill `.done.` cards for already-finished code. The tree holds
  only post-adoption work. Skip the foundation (01) too if it already exists.

## Open One Layer at a Time

```
Project start            → skeleton (01) + capability list (waiting files) only
Just before a capability → that capability's tasks
A task looks big         → promote it to a folder on the spot and split further
```

Never split everything upfront. Earlier implementation changes later decomposition —
what you don't know, you learn by writing code, and splitting then is accurate and cheap.

When a card you are opening depends on a `.done.` card, read that card's progress-log
conclusions and carry the constraints it names into the new card's `Read first`. For
T-mid cards, as a pointer to the original path; for T-low cards, as a quote with its
source cited — a closed card's log is a frozen record, so quoting it cannot drift.
Evidence left in the tree only helps if someone goes and gets it.

If `design.md` exists, the decomposition axis follows the build strategy:
A mock-first → by screen / B vertical slice → by feature cut front-to-back /
C contract-first → contract card first, then frontend/backend cards in parallel beneath it.

## Size Judgment

```
Looks like more than 1 commit   → split it
Split produced more than 7      → create one intermediate grouping folder
Split produced fewer than 3     → don't split. Revert
```

## The Tree Is Recursive — when it deepens

A card promoting into a folder is not failure; it is normal. The same rule repeats at
any depth:

```
02.3-customer-management.md   ← opened it: won't finish in 1 commit
  ↓ promote
02.3-customer-management/
  02.3.1-list.md
  02.3.2-filter.md
  02.3.3-modal.md             ← if this is big too, promote again to 02.3.3-modal/
```

Promotion procedure (multi: declare the minting first — child numbers are minted
numbers, per the execution proposal section):
1. If the card's progress log is non-empty, commit the card as a checkpoint before
   transforming it (`NN.N wip:` — this commit creates the git guarantee for the log;
   multi: your own branch suffices)
2. Turn the card file into a **folder with the same number and name**
3. Distribute the original card's Destination · Why · Forbidden · Depends and any carried
   quotations into the child cards — the folder itself holds no card (a folder's meaning
   is its name and its children; same principle as capability folders)
4. Child number = parent number + one digit (`02.3` → `02.3.1`). Number immutability
   still applies
5. If the card wore a claim suffix (`.wip.`, multi: `.wip-<my id>.`): the one child the
   claimant will pick up next is born wearing it inside the promotion commit — no
   separate claim commit (the promotion commit doubles as the claim's visibility)
6. If there was a progress log: conclusions and constraints go into the affected child
   cards' `Read first`; the in-progress portion goes into the progress log of the child
   from step 5, or, if there is none, into the `Read first` of the child it belongs to,
   as a quotation — the file disappears, so move content, not pointers
7. Promotion is its own commit, never deferred (`NN.N promote`. multi: a binding
   decision — lands on integration)

- The decomposition axis inside a capability defaults to **feature units** (what a user
  perceives as one action). Technical-axis splits (frontend/backend) only under build
  strategy C (contract-first)
- Scenario verification (verify's capability layer) opens **only at depth-1 capability
  folders**, regardless of depth. Intermediate folders just receive `.done` when all
  children are `.done.` — no separate verification rite
- Splitting past 4 levels → stop and re-examine scope with the user. The tree isn't
  deep; one capability may be as big as a project

## Research Cards — when the destination would be a guess

When one unknown turns a card's destination or completion signal into guesswork, place a
card **whose deliverable is the answer** before the implementation card.

```markdown
# 04.1 Research: does the payment API support partial refunds?
Destination:       An answer exists to "is it supported — limits and constraints?"
Completion signal: Answer + evidence (doc link or a real call result) recorded in the progress log
```

- A research card carries no Coordinates or Identity (the sanctioned exception to the
  canonical rules' identity re-injection — a card whose log freezes once the answer
  lands has no use for the injection). Depends · Read first · Tier are used as needed,
  unchanged.
- Any means is fine: document research, real calls, a **throwaway prototype**.
  A prototype must be marked disposable by name and location and never mixed into the
  real code — only the decision survives.
- Once answered, fix the following card's destination and proceed. Thirty minutes of
  research replaces days of rework.
- **The answer also travels upward.** If the research settled an open statement in an
  upper document (a Provisional row in arch, etc.) and that text is not replaced, the
  value you just disproved keeps winning the hierarchy. work's upper-document feedback
  step enforces this before `.done.`
- The evidence stays in the tree — later it answers "why was it designed this way."

## Routing Change Requests — the maintenance phase

When a request like "fix the filter on this page" arrives:

1. **Map the request to a capability** (by product.md's capability list — folder name =
   capability name = code folder name, so the same word finds it)
2. Add a card to that capability's folder — numbering continues (02.7, 02.8…)
3. If the folder was `.done`, **remove the `.done`** — it holds only while all children
   are done. Forgetting this rename makes the tree lie
4. If the mapping is ambiguous, don't guess — ask the user

## Task Card Format

```markdown
# 02.2 signup API
Coordinates: <service> ▸ ①registration ▸ 02.2
Identity:    <the identity paragraph from product.md, copied verbatim>

Destination:       What becomes true when this is done (1–2 sentences)
Why:               What happens to users without this (1 sentence)
Forbidden:         <3 lines max>
Completion signal: <executable command/check — e.g., `pnpm test auth` passes + 201 via .http>
Depends:           02.1
Read first:        <files/docs to start from. A starting point, not a fence>
Tier:              T-mid | T-low   <!-- omitted = T-mid. For T-low, make Read first,
                                        Forbidden, and the completion signal complete -->

## Progress log
<!-- work appends here while .wip. -->
```

**Never write the implementation method.** Destination, completion signal, and Forbidden
are the entire harness. Only T-low cards additionally get ordering hints (see the harness
dial in the canonical rules).

## Execution Proposal — this skill's final output and gate

Propose, and **get user approval**, for the opened tasks:

```
Execution proposal
02.2–02.4  sequential · T-mid recommended (schemas are entangled; judgment needed)
03.1–03.3  parallelizable · T-low + complete cards (mechanical CRUD; file overlap checked)
→ present an example mapping onto currently available models and let the user choose
```

Parallelism conditions: only tasks that don't overlap in files AND don't touch a shared
dev server. **Frontend work sharing a dev server is sequential** (a single agent's
compile error breaks the whole screen).
When parallelism is approved, leave 1 journal line — the integrity check judges multiple
`.wip.` cards against that record.

multi: **number minting is single-flight per capability folder** (a promotion's child
numbers count as minting too — they stand when the promotion commit lands). Announce the start with
1 journal line (a binding decision — land it on integration now). Mint no numbers in a
folder with a standing announcement — move to another folder or tell the user. A minted
number stands only once the waiting-card commit lands on integration. An announcement
with no minting commit after days is reported as lapsed.
The execution proposal records per-member assignments in journal.

Pre-commit review (work's reviewer) runs by default. Only truly trivial cards may opt
out via an explicit "skip review" in the execution proposal. Research cards need no such
marking — they are not review subjects to begin with (same as work's review rule — the
deliverable is an answer, not code. If a diff touched the real code, it does get
reviewed).

After approval: one line — "next is work."
