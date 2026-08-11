---
name: verify
description: Verification. Checks acceptance criteria at the capability and product level through real execution. Use for capability-completion verification, MVP verification, or regression checks.
---

# verify — Verification

First read all of the canonical rules (`../principles/SKILL.md`), the canonical state
predicates (`../principles/state-predicates.md`), the canonical verification predicates
(`../principles/verification-predicates.md`), `devflow/project/product.md`,
`devflow/project/arch.md`, and
`devflow/project/code-style.md`. If present, also read all of
`devflow/project/glossary.md` and `devflow/journal.md`.

Purpose: check criteria through real execution.

Before either layer, when one or both of journal and verify.md differ in the working tree,
inspect the full working-tree diff. When it is one canonical verification-state transition
or one Failure-history or event route with its routed output, first finish that transition's
missing output and specified commit. For a canonical prepared-route prefix, first validate
the prepared object under canonical integrity item 14 and finish its missing output and
specified commit only when it passes. Text beginning `routing prepared:` that fails is a
blocking anomaly, not a prefix. At either layer, a complete current Record contains all four current revisions
for that layer; the new verdict and execution evidence; every new `routing: pending` entry
required by each failure, unverified reason, or closure-gate violation; and the Failure
history, Audit, and Retrospective sections from HEAD. A complete capability-layer pass has
neither `Standards` nor `Provisional` equal to the exact value `pending for current pass`;
both contain this run's step-5 result.

When a product-verification running marker remains, the whole diff is only tree-root
verify.md, and that file is a complete Record matching the marker's three revisions with
Capability revision `not-applicable`, this is the canonical interrupted product-result
write. Do not execute again; replace running with the result marker from that verdict and
finish the result commit. Current revisions and a new verdict with any completeness element
missing are a partial write. Do not commit that file. Repeat the product procedure from step
2, replace the partial file with the complete result, and finish the same result transition.

At the capability layer, when the whole diff is only that capability's verify.md and it has
current revisions, a new pass, execution evidence, and every preserved section, but either
`Standards: pending for current pass` or `Provisional: pending for current pass`, do not
brief the verifier again. Recalculate both step-5 gates, replace both fields, and take the
branch below. When that sole changed file is complete, do not execute again. Finish
`boundary — capability verification result
<capability number>` for fail, unverified, or pass with a closure-gate failure. A pass that
clears both gates proceeds to step 7's capability-closing begin commit. Current revisions
and a new verdict with any completeness element missing are a partial write. Do not commit
that file. Repeat the capability procedure from step 2; when the new verdict is pass, repeat
the main session's step-5 closure gates too. Replace the partial file with that complete
result and rejoin the branch determined by steps 4 and 5.

A committed product result marker takes priority over `product re-run pending`; finish its
stored result through step 6, events, and step 9. Without a result marker, process one item
in this order: an existing Event Record `routing` state; `awaiting user decision` unless
the user deferred it in this session; then a Failure-history `routing: pending` entry. Use
the Event Record section's file, role, and source order for either event state. For Failure
history, take the lowest source id in the first verify.md under canonical path order. End this invocation
after that item. Then, if journal has `product re-run pending`, neither execute nor finish an interrupted closure;
return to product. Return to split without executing when a `re-split pending` marker
targets the layer's scope. For a capability layer, it targets the scope when its `folder`
value equals the capability-folder path or starts with `<capability-folder path>/`. Every `re-split pending` marker
targets the product layer.

Before calculating revisions for a new product- or capability-layer verification, classify
every journal line. Retain a line in the canonical format. For cross-task decisions, take
the first line in file order that the discovery→update table maps to an exact core-document
target, report that source line and target, and return without writing or executing to the
canonical target-owning skill. That skill applies the table and lands the core-
document update with deletion of its source line in the same binding-decision commit; then
restart state routing from the beginning. Retain a cross-task decision with no target. A
line in neither class is an integrity anomaly; report it and do not verify.

Start the capability layer only when the target depth-1 capability folder has at least
one direct child that is not `.stale.`, and every such child has a `.done` status. An
empty folder, a folder with no active direct child, or an active direct child without
`.done` returns to split or resume's interrupted-boundary repair. A `.stale.` task card
is history and is excluded from this judgment. At the start of either layer, calculate
the revisions by the verification predicates. Step 2 routes an `unresolved` Capability revision.

Before either layer, combine the non-empty output
of `git diff --name-only`, `git diff --cached --name-only`, and
`git ls-files --others --exclude-standard`. If any path does not start with `devflow/`,
record unverified and do not execute. Neither layer executes with an uncommitted change to
the revision inputs product.md, arch.md, code-style.md, or glossary.md. The capability layer
also refuses an uncommitted change inside its target capability folder or any resolved
direct-dependency card. A product verdict is reusable only for the current Product revision,
Verification revision, and Code revision combination.

Product verification has exactly one active journal-state kind: `product verification
requested`, `product verification running`, or `product verification result`. On an
explicit user request, append one request line only when no active state exists; otherwise
coalesce it into that run without appending. When arch.md says `Brownfield: yes`, never
start a product layer automatically without a request state.

A `product verification requested` line never preempts a task card claimed by this
session. When one exists, retain the request and return to work through that card's boundary
cleanup. Change requested to running only when this session has no claim.

Immediately before a new product-layer run, replace every existing request line with one
running marker whose trigger is `requested`. An automatic run with no request writes one
whose trigger is `automatic`. Put the current Product revision, Verification revision, and
Code revision in it and land `boundary — product verification running` before briefing the
verifier. An existing running marker reruns that same flight. If its revisions differ from
the current values, replace it with a current running marker in a commit with the same
subject, then run. An existing result marker never reruns; finish its stored result through
step 6, events, and step 9.

## Layers

| Layer | Checked against | When | Owner |
|---|---|---|---|
| Task | completion-signal run + pre-commit code review | automatically, by work | implementing context + reviewer |
| **Capability** | one user scenario driven through the channel | when the folder has at least one direct child that is not `.stale.` and every such child has a `.done` status | **verifier (clean context)** |
| **Product** | every success criterion in product.md | on reaching the MVP | verifier (clean context) |

The separation of roles — they never cross:
**the reviewer reads but never executes** (white-box — is the inside right?),
**the verifier executes but never reads implementation** (black-box — is the outside right?),
**the auditor reads and executes but knows no implementation history** (the audit —
findings only, never verdicts. See the Audit section below),
**the retrospector reads only devflow artifacts and never executes** (the
retrospective — post-hoc evaluation of design alternatives. See the Retrospective
section below).

## Procedure

```
1. Read verify_channel. Verification always runs on the work server (the one running
   the currently checked-out code) — it is the new code being verified
2. Complete the target criteria before execution.
   - Product: every success criterion in product.md.
   - Capability: the main session builds exactly three parts from product.md's capability
     description and the Destinations of every `.done.` task card below that folder — a
     primary scenario, one hostile input scaled to the Trust-boundary posture,
     and a regression list. The list contains those cards' completion signals plus the
     signals of cards they directly name in `Depends`, one hop only. Replace a remote-only
     signal with its latest remote-evidence pointer. For a research-card signal, the main
     session checks that the card's progress log contains both the answer and evidence
     required by its completion signal, records that result in verify.md's Regression
     field, and removes the signal from the verifier's regression list. If the answer or
     evidence is absent, record `unverified` and the current Product revision,
     Verification revision, Code revision, and Capability revision; add
     `source id: <new id>; timestamp: <timestamp>; unverified: research evidence absent;
     routing: pending` to Failure history; and send it through step 6. If Capability
     revision is `unresolved`, record `unverified` and the current Product revision,
     Verification revision, Code revision, and Capability revision in verify.md; add
     `source id: <new id>; timestamp: <timestamp>; unverified: dependency cannot be
     resolved; routing: pending` to Failure
     history; send it through step 6; and neither brief the verifier nor guess the regression list.
3. At the capability layer, the verifier actually executes the primary scenario, hostile
   input, and whole runnable regression list through the channel. At the product layer,
   the verifier actually executes every product.md success criterion through the channel.
   Means are browser-control tool clicks and input, HTTP calls, or CLI runs. For a remote-
   evidence pointer, open it and inspect the current execution result. A pointer that
   cannot be opened or contains no execution result is unverified
4. The verifier verdict is exactly one of three: pass · fail · unverified. Immediately
   after it returns, write the verdict, current Product revision, Verification revision,
   Code revision, the capability layer's Capability revision, and execution evidence to
   verify.md. For a capability-layer pass, write or replace the two fields in that same
   write with `Standards: pending for current pass` and `Provisional: pending for current
   pass`. For fail or unverified, give each reproduction, criterion, or unverified
   reason one canonical new source id. Add
   `source id: <id>; timestamp: <timestamp>; failure: <reproduction or criterion>;
   routing: pending` or `source id: <id>; timestamp: <timestamp>; unverified: <reason>;
   routing: pending` to Failure history.
   At the product layer, write the complete tree-root verify.md first, then immediately
   replace the running marker with a result marker that preserves its trigger and three
   revisions. First land both in `boundary — product verification result`. The opening
   rule recovers an interruption between those two writes as the canonical prefix. When
   any of this transition remains in the working tree, finish the commit before routing,
   an event, or a completion report
5. When the capability verdict is pass, the main session checks two closure gates:
   - **Standards**: the main session builds the `capability code scope` from current
     topology, never past commits, diffs, or task cards. When arch.md's Code structure maps
     the capability to exact repository-relative folders or files, use those paths. When
     no exact mapping exists, start at every external entry point for that capability in
     product.md's Screens & access points and arch.md's Components, trace repository-owned
     code, stop before an already-identified boundary of another capability, and use the
     exact traversed files plus directly used shared-contract files. A folder is a scope
     only when arch.md maps it exactly to that capability. If an entry point or boundary
     does not resolve uniquely, record `unverified`, route to arch to correct Code
     structure, and stop. Compare the exact files and current repository-owned source
     under scope folders with code-style.md.
   - **Provisional**: confirm that each arch.md Provisional row whose `Settled by` is a
     task-card number below this folder was replaced by the measured result.
   If either gate fails, record the exact violation and path or row in verify.md and add
   `source id: <new id>; timestamp: <timestamp>; unverified: <violation and path or row>;
   routing: pending` to Failure history. Step 6 creates a card whose completion signal is the exact command or check
   procedure that executes proof that the violation is gone. Do not change the verifier's
   pass verdict, but write no capability-closing marker.
6. The lowest-source-id Failure history entry with `routing: pending` → at the capability
   layer, before selecting the entry, first land this run's complete verify.md and all its
   new pending entries as `boundary — capability verification result <capability number>`
   when they are not yet committed. Then send that failure or unverified entry through split's
   maintenance routing and determine the fix card and number for the same folder (e.g.,
   02.3b-fix-...). Its
   completion signal is the exact failure reproduction or executable check that proves an
   unverified reason is gone. The escaped defect or evidence gap becomes a regression signal.
   Product-layer failure or unverified entry → never create a card at the tree root. Send
   each entry through split's maintenance routing. That routing selects foundation or a
   capability folder from the entry's scope.
   When the cause is not code but a success criterion that cannot execute as written,
   replace its product.md wording through that discovery→update row. When it executes but
    gives a wrong signal, use the disproof row to replace the confirmed wording or write
    `product re-run pending`. Once the exact status renames, markers, and output required by
    the selected canonical discovery→update row are known and required user approval is
    complete, put one final routing result allowed by the canonical rules and every output's
    final content in that canon's `routing prepared` object, then land it by the canonical
    procedure while preserving the source id and timestamp. A card's layer-opening source is
   `verify:<verify.md path>#Failure history@<source id>`. Multiple failures from one
   verdict each retain their own routing.
   multi: fix cards are born unclaimed (pending) and follow the normal proposal and claim
   path
7. **Capability layer passes → capability-closing begin commit.** Write the passing result
   to verify.md and create the canonical capability-closing marker. Its `head` is HEAD
   immediately before committing those two files; `product`, `verification`, and
   `capability` are the run's three revisions. First land only passing verify.md and
   the marker in `boundary — begin <capability number>`; before that commit, do not rename
   the folder or change another journal line. An interruption that leaves the pass and
   marker only in the working tree finishes the same begin commit first.

   After interruption, when the whole working-tree diff is a canonical step-8 closure
   prefix, skip the following checks and go to step 8. Otherwise first reapply the
   uncommitted revision-input prohibition above. If
   an input, including a target or direct-dependency card, is uncommitted, retain the
   marker, report the blocking path, and neither close nor rerun. With clean inputs, reuse
   an existing marker's pass only when verify.md and the marker's
   Product revision, Verification revision, and Capability revision equal the current
   values, verify.md's Code revision also equals the current value, its Verdict is `pass`,
   and no committed or
   uncommitted path outside devflow changed after the marker's head. The changed-path set
   is the union of non-empty output lines from `git diff --name-only <head>..HEAD`,
   `git diff --name-only`, `git diff --cached --name-only`, and
   `git ls-files --others --exclude-standard`. Every path in that set must start with
   `devflow/`. If any condition then fails, rerun the capability layer and replace the pass and
   marker in a new begin commit.
8. When a valid capability-closing marker exists, finish its interrupted closure. Classify
   every journal line. Do not delete a marker, request, evidence-wait, or evidence-
   finalizing line whose exact format the canonical rules define during this sweep; only
   the current capability-closing marker is deleted when closure below finishes. Retain a
   cross-task decision with no target. A cross-task decision that now has an exact core-
   document target is a valid late decision: retain the marker, report its source line and
   target, and return without writing or executing to the canonical target-owning skill
   document. After that skill lands its binding decision, repeat step 7 with the changed
   revisions. A line in neither class is an integrity anomaly; report it and neither write
   nor commit. Before the first write, calculate from current HEAD and the
   marker the final bytes of verify.md with its one-line sweep result and journal.md with
   only this marker removed. Apply them in this order: verify.md below the still-open
   capability folder; journal.md; then the capability-folder rename that adds `.done`.
   The whole working-tree diff must equal exactly one prefix of that order. For a prefix,
   apply only the remaining suffix and land the folder rename, verify.md, and journal in one
   boundary commit. If any other diff is mixed in, report an integrity anomaly and neither
   write nor commit. The folder is not `.done` before this commit
9. Keep a product result marker while this result has a Failure history `routing: pending`
   entry; tree-root Retrospective has a `pending` or `routing` state; Audit has a `routing`
   state or a `pending` state that passes its execution boundary; or an
   automatic Audit or Retrospective due from this product verdict is currently selectable
   and has no completed entry. An Audit that fails the execution boundary below does not
   hold the result marker; it remains unrun until a later clean boundary. Treat `awaiting user decision` as completed for this judgment only when the user defers
   that decision in the current session. Process every other state by the earlier priorities. When all are
   finished, report the stored verdict, revisions, and evidence to the user, then delete
   the result marker and land `boundary — product verification reported`. Interruption
   after the report but before the commit may repeat the report in the next session; never
   rerun the result or rewrite verify.md for that reason
```

Re-closure of a reopened capability may scope the scenario to the changed behavior —
**regression always reruns the whole folder's signals.**

Role ownership: **scenario and regression execution, and verdicts, belong to the verifier.**
The document-reading axes (Standards, Provisional, and research-evidence confirmation),
assembling the regression list, the journal sweep, and fix-card creation belong to the
main session running verify — the verifier reads neither implementation nor devflow
documents. A remote-evidence pointer in the bundle is verifier input for inspecting an
execution result; it is not a devflow document.

multi: execution and verdicts for both verification layers, and capability closure, happen
**only on the integration branch, after a fetch**. A feature or stale branch can point the
verification revisions and "folder all done" at different states. A signal that cannot run
on the executor's platform is handled by remote-evidence substitution (Regression — mode-
neutral) or delegated to the owning member — record the split in verify.md. The journal
sweep is done by the member performing the closure.

## Bias Removal

Verification runs in a context that has **never seen the implementation history**:
brief a clean subagent/fresh session with `verifier.md` beside this skill, **verbatim
— never summarized**. For a product target, give it every success criterion; for a
capability target, give it the capability verification bundle. In either case, add only
verify_channel. Never tell it what
code was changed or how — the progress log IS that history.

Recommended tier: T-high + low effort, kept short (it is a verdict, not an exploration).

## Event Record — shared by Audit and Retrospective

The verification predicates alone own automatic-event keys, due conditions, and duplicate
judgment. Before a user-requested run, write one canonical `audit requested` or
`retrospective requested` line in journal. Its collision-free timestamp selected by the
verification predicates is the event key.

For a capability-number request, the target record is that capability's verify.md; for
`product`, it is tree-root verify.md. Record a user request for the whole project with the
target value `product`. A request is not runnable before that target file
exists. Keep its journal line, let other work proceed, and process it after that boundary
is first verified. For a legacy target file, include the verification predicates' event-section
preparation in the pending-event commit.

resume and verify process exactly one event in this order: an existing `routing` entry → awaiting user decision → an
existing `pending` entry → automatic Audit → automatic Retrospective → a runnable user
request. For ties, use canonical path order for verify.md, then Audit before
Retrospective within one file, then source id ascending within one section. Among user
requests, use the earliest timestamp first.

When this session has a claimed task card, select no event; return to work through that
card's boundary cleanup. Select an Audit candidate only when it also satisfies The Audit's
execution boundary below. For an ineligible automatic candidate, create no pending entry.
For a user-request Audit, retain its journal line, report the exact blocking path or branch
state and reason, and continue the caller's remaining state; resume does not select that
request until the Audit execution boundary passes.

After selecting an automatic event or user request, assign the section's canonical new
source id and choose the event timestamp. Use the current timestamp
for an automatic event and the journal request-line timestamp for a user request. Write
`pending · source id: <id> · event timestamp: <timestamp> · event key: <key>` in the
target verify.md section **before** briefing the role. For a user request, delete its
journal line in the same change. First land both as
`boundary — verify event <Audit|Retrospective> <source id> pending`. If both survive, use
the matching pending or completed key to delete only the journal line in that pending
commit; do not run the event again. If the role is interrupted, pending remains and the
next session runs it again. When the role returns findings, before asking the user replace
pending with `awaiting user decision · source id: <same id> · event timestamp: <same
timestamp> · event key: <same key>` and the verbatim numbered findings. For zero findings,
replace it immediately with `source id: <same id> · event timestamp: <same timestamp> ·
event key: <same key> · 0 findings · 0 adopted · routing: none`. In either case, land
`boundary — verify event <Audit|Retrospective> <source id> result` before asking the user
or entering another state.

After the user's decision, if no finding was adopted, replace the awaiting entry with
`source id: <same id> · event timestamp: <same timestamp> · event key: <same key> · n
findings · 0 adopted · routing: none` and delete the
finding text. If any finding was adopted, do not complete the entry yet. Replace it with:

```text
routing · source id: <same id> · event timestamp: <same timestamp> · event key: <same key> · n findings · m adopted
N. <verbatim adopted finding>
   routing: pending
```

In both cases, land `boundary — verify event <Audit|Retrospective> <source id> decision`
before the first route.

Take the lowest adopted number whose routing is pending and move that one finding to a
maintenance card, a core-document replacement through the canonical discovery→update
table, or a `product re-run pending` journal line. A document replacement includes every
user confirmation, status rename, and marker that table requires. For a card, split uses
`verify:<verify.md path>#<Audit|Retrospective>@<source id>/<finding number>` as its source
and finishes execution-proposal approval so the exact card numbers are known. Once the
exact route is known and required user approval is complete, put one final routing result
allowed by the canonical rules and every output's final content in that canon's `routing
prepared` object, then land it by the canonical procedure. Process another pending finding only after
the active layer-opening marker is gone and that commit has landed. The commit that routes
the last pending finding replaces the whole entry with
`source id: <same id> · event timestamp: <same timestamp> · event key: <same key> · n findings · m adopted · routing: <semicolon-delimited N=result entries in number order>`
and deletes the finding text. Re-verification preserves the whole Audit and
Retrospective sections. When verification state or a finding's routing result differs
between HEAD and the working tree, finish the state, planning, or binding-decision commit
specified above before product re-run or any other stage, event, route, or report.

## The Audit — event-triggered

The audit is findings, not verification — it does not gate a verdict or status transition.

Run an audit only at a boundary with no staged, unstaged, or untracked path outside
devflow. In multi, run it only on the fetched integration branch. Test this before selecting
a new event. When it fails, skip an automatic candidate, retain a user-request journal
line, and do not brief the role. For an already-pending event, retain pending, report
the exact blocking path or branch state and reason, and continue the caller's remaining state.

Brief a clean subagent/fresh session with `auditor.md` beside this skill, **verbatim —
never summarized**, and give it only product.md's description of that capability (the
whole product.md at the product layer), verify_channel, and `capability code scope`. Mark
each item `root: <repository-relative folder>` or `file: <repository-relative file>`.
Before an Audit, regardless of verdict, calculate every needed capability scope at that
time by the current-topology rule in step 5's Standards gate. A capability Audit uses its
one target; a product Audit uses the union for every non-retired capability. If any scope of a pending event does
not resolve exactly, do not brief the role. Replace pending with `source id: <same id> ·
event timestamp: <same timestamp> · event key: <same key> · not run: scope unresolved —
<exact reason> · 0 findings · 0 adopted · routing: none`, land the result commit, and report
the reason and that a new user request can run it after scope repair. This completed entry
suppresses the same automatic key. Never provide implementation commits, diffs, task cards,
or progress logs.
Recommended: T-mid + high effort (it is an exploration, not a verdict).
Findings go into the report to the user — only user-adopted findings become cards
through maintenance routing (split), and declined findings are not recorded
(declining is a decision too).

## The Retrospective — event-triggered

The retrospective is findings, not verification — a post-hoc evaluation of design
alternatives that does not gate a verdict or status transition.

Brief a clean subagent/fresh session with `retrospector.md` beside this skill,
**verbatim — never summarized**, and give it exactly one input set for the event:

- Capability first closure or a capability-number user request: that capability's description from product.md · all of
  arch.md and every `.md` directly under `devflow/project/decisions/` · that capability
  folder's filenames and statuses · all of journal.md · that capability's verify.md.
- First product-layer verdict or a `product`-target user request: all of product.md · arch.md and every
  `.md` directly under `devflow/project/decisions/` · the whole tree's filenames and
  statuses · journal.md · every verify.md (including the tree root).

Code is not given. Recommended: T-mid + high effort.
Findings go into the report to the user — only adopted findings follow the shared
routing above, and declined findings leave only their completed count.

## Record — devflow/tree/<capability folder>/verify.md

The product layer records at `devflow/tree/verify.md` (tree root), same format.
Re-verification overwrites the same file but preserves its existing `Failure history`
list and the whole `Audit` and `Retrospective` sections. Replace Product revision,
Verification revision, Code revision, and Capability revision with the values calculated
for this run. Capability revision is `not-applicable` at the product layer. The grammar
below shows committed states only. The canonical Routing write order alone defines the
uncommitted `routing prepared` state.

```markdown
# Verification · <capability> · <date>
Product revision: <output of git hash-object devflow/project/product.md>
Verification revision: <input hash of arch.md, code-style.md, and glossary.md>
Code revision: <commit hash that last changed a path outside devflow | none>
Capability revision: <target capability and direct-dependency card input hash | unresolved | not-applicable>
Scenario:  <one line>
Executed:  <channel + what was actually run>
Verdict:   pass | fail | unverified
Failure history:
- source id: <id>; timestamp: <timestamp>; <failure: reproduction or criterion | unverified: evidence, Standards, or Provisional repair>; routing: <pending | canonical final routing value>
Regression: <completion signals rerun, substituted, or confirmed + results>
Standards: <code-style violations found or none. Violations become fix cards>
Provisional: <arch rows confirmed replaced, or none>
Journal sweep: <lines promoted/deleted, or none>

## Audit
- <not run | pending · source id · event timestamp · event key | awaiting user decision · same source id · event timestamp · event key + numbered findings | routing · same source id · event timestamp · event key + per-finding routes | same source id · event timestamp · event key · not run: scope unresolved — exact reason · 0 findings · 0 adopted · routing: none | same source id · event timestamp · event key · n findings · m adopted · routing: entries by adopted finding number>

## Retrospective
- <not run | pending · source id · event timestamp · event key | awaiting user decision · same source id · event timestamp · event key + numbered findings | routing · same source id · event timestamp · event key + per-finding routes | same source id · event timestamp · event key · n findings · m adopted · routing: entries by adopted finding number>
```
