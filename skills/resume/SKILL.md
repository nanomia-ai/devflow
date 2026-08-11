---
name: resume
description: Resume. In a new session, reads the Layer 0 documents, task tree, verification records, HANDOFF, journal, and git state, then continues from the stage recorded on disk. Use for session restarts, continuing work, or checking where things stand.
---

# resume — Resume

First read the canonical rules (`../principles/SKILL.md`), canonical state predicates
(`../principles/state-predicates.md`), and canonical verification predicates
(`../principles/verification-predicates.md`).

Purpose: a new session restores state from the bounded reads below when the tree exists; without a
tree, it derives the next stage from the Layer 0 documents and continues.

## Procedure — when the tree exists, in exactly this order

```
1. product.md's identity paragraph and capability list; arch.md's Brownfield and
   integration fields
2. devflow/tree/ full listing                      ← how far things got (.done. / .wip. / pending)
3. my claimed card in full. For others' claims, path and claimant only. From every
   pending card, read only `Depends`, `Approval`, and `Review`
4. **Bounded verify projection** — Run a mechanical query that does not put every verify.md
   into model context. For each file, it emits only the four revisions and `Verdict`; the
   maximum source id per section;
   whether an entry lacks a source id; the path, state, source id, and event key of entries
   in `routing prepared`, `routing: pending`, `awaiting user decision`, event `routing`, or
   event `pending`; and whether a record exists for each finite event key currently due
   under the verification predicates. It emits no completed description or finding and no
   event key that is not currently due. Read through the end of only one active or missing-
   source-id entry selected by that output. Until the state table selects the exact file and
   state and calls verify, do not read `Scenario`, `Executed`, `Regression`, `Standards`,
   `Provisional`, or `Journal sweep`
5. devflow/HANDOFF.md (multi: my room's HANDOFF.md) ← traps, learnings, open decisions
6. devflow/journal.md in full (if present — the sweep discipline keeps it short)
                                                   ← cross-task decisions
7. Full git status. If I have a claimed card, compare uncommitted changes against its
   progress log's last entry. For every pending card, check the same path exists in the
   authority and run the state predicates' two Git diffs; in multi, use the fetched
   integration branch as authority
```

**Check HANDOFF's freshness before trusting it.** Compare its date against the newest
task commit (`NN.N` message form, wip included; multi: commits bearing my id prefix or
touching my claimed-card paths). Handoff is written only at boundaries,
so a session that died mid-task leaves the previous boundary's file behind — one that
points at a step already taken. If any task commit is newer than the HANDOFF date,
report it as stale and let the tree and my claimed card decide. A header outside
`# HANDOFF · YYYY-MM-DDTHH:MM:SSZ` also counts as stale. **When HANDOFF conflicts with the
tree, the tree wins.**
Even from a stale HANDOFF, include its Open decisions in the report.

## Report, Then Approval

Report what you read in **one paragraph**:

```
"<service> is complete through <capability>, with <task> in progress.
The progress log reaches <last point>; the next step is <one step>. Proceed?"
```

Once approved, continue into the stage named in the report. Never modify code before
approval.

Derive that next stage by scanning this table from top to bottom and taking the first
matching row:

| Disk state | Next stage |
|---|---|
| `git status` reports an open rebase or merge | resume — stop normal routing and obtain the user's decision through the canonical open-Git-operation gate |
| Any verify.md in HEAD contains a valid `routing prepared` object | verify — compare and apply its payload, then finish the completed state and specified route commit without committing the prepared object again |
| One or both of journal and verify.md differ from HEAD in the working tree, and the full working-tree diff is a canonical verification-state transition, product-result write prefix, uncommitted route with its output, or prepared-route prefix | verify — without repeating execution, first finish the missing output and that state or routing commit |
| Any verify.md has a legacy Failure history, Audit, or Retrospective entry without a source id | verify — first finish the canonical source-id migration commit |
| A valid layer-opening marker exists in the working tree or HEAD | split — finish the earliest marker's interrupted planning commit from its durable source and minted numbers |
| journal contains a `product verification running` line | verify — rerun the recorded flight |
| journal contains a `product verification result` line | verify — finish the stored result's failure routing, events, and report |
| The canonical claim→done move is uncommitted, or the last commit changing one of my claimed cards that no evidence record names has the canonical final task subject | work — make no second final task commit; finish only upper-document feedback and the boundary |
| An Audit or Retrospective section has a `routing · source id:` state | verify — land pending-finding routing one at a time in finding-number order |
| An Audit or Retrospective section contains findings `awaiting user decision` | verify — present the recorded findings verbatim and record the decision |
| Any verify.md Failure history has `routing: pending` | verify — without executing, route one entry: first verify.md in canonical path order, then lowest source id in that file |
| journal contains an exact `product re-run pending` line | product |
| A valid capability-closing marker exists in HEAD | verify — finish the interrupted capability closure |
| journal contains an exact `re-split pending` line | split — finish the replacement-card plan for the earliest marker |
| journal contains an exact `maintenance routing pending` line | split — plan the earliest line's request through maintenance routing |
| arch.md lacks the Brownfield field | ask once, "Did implementation code exist before devflow entered?"; yes makes adopt add only the field, no makes arch add only the field |
| `devflow/project/glossary.md` is missing | with `Brownfield: yes`, adopt reverse-derives only glossary.md; with `no`, product creates only glossary.md without changing the confirmed product.md |
| A task card has a `Depends` member that the state predicates cannot parse, or a dependency number does not point to exactly one card | split — replace it with the user-confirmed canonical dependency value and finish the planning commit |
| My claimed card lacks `Approval` or `Review`, has `Approval: pending`, or has noncanonical `Depends` | split — checkpoint any current diff and progress log, release the card, normalize legacy dependencies, finish execution-proposal approval and the planning commit, then reclaim it |
| My claimed card has a `Depends` target that is not `.done.` | split — release the original card and finish the prerequisite |
| A card of mine is claimed | work |
| journal contains an exact `product verification requested` line | verify — product layer |
| A Retrospective section has a `pending · source id:` state, or an Audit `pending · source id:` state passes the Audit execution boundary | verify — run and record one runnable pending event |
| Under the verification predicates, an automatic Retrospective is unrun; an automatic Audit is unrun and passes the Audit boundary; a user-request Retrospective has its target record; or a user-request Audit has its target record and passes the Audit boundary | verify — run and record one new event |
| A foundation, capability, or intermediate folder that is neither `.done` nor `.stale` is empty | split — finish opening one layer of that folder |
| A non-capability folder has at least one direct child that is not `.stale.`, every such child has a `.done` status, but the folder is not `.done` | resume — add `.done` from the deepest matching folder upward and finish the interrupted boundary |
| A depth-1 capability folder that is neither `.done` nor `.stale` has at least one direct child that is not `.stale.`, and every such child has a `.done` status | verify — capability layer |
| `Brownfield: no` and a non-retired product.md capability has neither a matching depth-1 folder nor waiting file, or a retired capability has neither a matching `.stale` folder nor `.stale.md` waiting file | split — restore product.md-to-tree correspondence |
| `Brownfield: no` and the tree root has neither `01-foundation/` nor `01-foundation.done/` | split — create `01-foundation/` and at least one direct task card in the same layer |
| A pending task card lacks `Approval` or `Review`, or its `Depends` is not canonical | split — normalize legacy `Depends` under the state predicates, ask the user about any unparseable member, add missing fields as `pending` and `required` except a research card's Review is `not-applicable`, then present the execution proposal |
| A pending task card's `Approval` is not `pending` and is not effective under the state predicates | split — report the exact invalidity, reset `Approval` to `pending`, reapprove the execution proposal, and finish the planning commit |
| A pending task card's `Approval` is `pending` | split — present the execution proposal and get approval |
| A pending task card is ready under the state predicates | work |
| A waiting capability file exists | split — open one layer of that capability |
| No earlier executable row matches, and at least one pending Audit, user-request Audit with a target record, or due automatic Audit fails only the Audit execution boundary | verify — run no event and write no state; list those candidates in event-priority order and report each exact blocking path or branch state and reason |
| Pending task cards remain, but every effectively approved card has at least one `Depends` target that is not `.done.` | report the blocking card numbers and claimants; modify no code until a dependency closes |
| In multi, no earlier row matches and the only unfinished work consists of others' claims | report the claimants and cards; wait until a claim is released or closes |

The `awaiting user decision` findings row does not block a pass, `.done`, or other work.
Record a decision when the user makes it now. If the user defers or asks to continue
without deciding, keep the text unchanged and treat only that row as nonmatching for the
rest of this session's table scans.

The blocked-Audit reporting row does not gate a verdict, `.done`, product-result reporting,
or other work. After reporting the current candidates, leave disk unchanged and treat only
those candidates as nonmatching event rows and as not unrun events for the rest of this
session's table scans. Judge them again next session because the execution boundary can change.

When no earlier row matches and `Brownfield: yes`, report the tracked post-adoption work
complete and wait for a new request. Run the product layer only when the user explicitly
requested it and journal has an active product-verification state.

Check the next four rows only with `Brownfield: no`, no earlier match, an absent or
`.done` foundation, a `.done` folder for every non-retired product.md capability, a
`.stale` folder or `.stale.md` waiting file for every retired capability, and no pending,
claimed card or waiting capability file. `Brownfield: yes` entered through an active
product-verification state uses the same four rows without the complete
capability-representation requirement.

| Disk state | Next stage |
|---|---|
| Root verify.md is missing; any of its `Product revision`, `Verification revision`, or `Code revision` differs from the verification predicates' current value; a path outside devflow is uncommitted; or it has no verdict | verify — product layer |
| The product-layer verdict for the current Product revision, Verification revision, and Code revision is fail | verify — finish routing the recorded failure, or rerun the product layer once all fix cards are closed |
| The product-layer verdict for the current Product revision, Verification revision, and Code revision is unverified | verify — rerun the product layer |
| The product-layer verdict for the current Product revision, Verification revision, and Code revision is pass, with no unrun event | report completion and the count of findings awaiting user decision, then wait for a new request |

For the non-capability-folder boundary row above, after approval modify no code: rename matching
folders from deepest to shallowest, make one boundary commit, then rescan the table from
the top.

## Digest — catching up on others' work in multi mode

Digest happens only at a clean boundary — **if I have a claimed card, resuming it comes
first.** Digest runs after that card closes, or right before a new claim.

```
1. Pull the integration branch (arch config)
2. From commits after my room's digest.md marker, pick the digest targets:
   everything not authored by me + anything authored by me without my `<my id>` prefix
   (= work outside my sessions. Prefixed commits — task, wip, claim, promote, boundary —
   are already mine)
3. For each target commit, read its subject and changed paths. Read the diff only when it
   touches a shared document, the capability folder of the next claim candidate, or a
   `Read first` path on that candidate card. A contradiction with a shared document lands
   through the discovery→update table. Fixing a shared document is a binding decision
   (the canonical rules' commit discipline)
4. With a backlog over 30 commits, open no individual diff. Read a `git log --stat` rollup
   by path and capability. If that still cannot select the step-3 diff targets, ask the
   user to confirm the commit for the digest marker and record the exact skipped commit
   range in journal
5. Advance the marker; it rides the boundary commit
```

If the marker is unresolvable (force-push, etc.), report it and re-anchor with user
confirmation — default candidate: my last commit. Silent full re-digestion is forbidden.
A marker merge conflict (my two machines): keep the descendant hash; if unrelated, run
the re-anchor procedure.

## Exceptions

- No claim of mine: derive the next stage from the table above.
  multi: include a one-line summary of others' claims (who holds what) in the report.
- HANDOFF missing or empty: normal. Resume from the tree alone.
- No tree at all: read the Layer 0 file list and all of journal when it exists, first run
  every applicable canonical integrity check, derive the next stage in this order, report
  it in one paragraph, and get approval.
  1. No `devflow/project/product.md`: ask, "Must this work preserve implementation behavior
     that already exists in the repository?" Yes goes to adopt; no goes to product.
  2. If journal has an exact `product re-run pending` line, run product.
  3. product.md exists but glossary.md does not: ask the same question. Yes makes adopt
     reverse-derive every missing Layer 0 document; no makes product create only
     glossary.md without changing product.md.
  4. product.md exists but arch.md or code-style.md does not: ask the same question. Yes
     makes adopt reverse-derive only the missing documents; no runs arch.
  5. product.md, arch.md, code-style.md, and glossary.md all exist but arch.md lacks Brownfield: ask,
     "Did implementation code exist before devflow entered?" Yes makes adopt write only
     `Brownfield: yes`; no makes arch write only `Brownfield: no`.
  6. If a valid layer-opening marker exists in the working tree or HEAD, split selects the
     earliest one and finishes its planning commit from the durable source and minted
     numbers.
  7. If journal has an exact `re-split pending` line, run split.
  8. If journal has an exact `maintenance routing pending` line, run split's maintenance routing.
  9. If journal has an exact `product verification requested` line, run verify's product
     layer.
  10. With `Brownfield: yes`, use split's maintenance routing only when the current
     conversation contains a post-adoption change request. With no request, report
     adoption complete and no active work, then wait.
  11. With `Brownfield: no`, run split. Run design only when the user explicitly selects it.
