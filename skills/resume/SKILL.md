---
name: resume
description: Resume and domain entry. Restores a new session from disk and continues to the next stage, or finds a capability document by number or name and explains the domain. Use for session restarts, continuing work, status checks, or capability and domain onboarding questions.
---

# resume — Resume

First run `node ../principles/scripts/project-state.mjs state`. The output is one sheet
holding this repository's state in priority order, and an empty zone still prints its line.
The closing `next:` names the first zone that is not empty and its kind; it is a summary
derived from the facts, not a contract — every ingredient of that judgment is on the same
screen, so a mismatch shows. Read that name's next stage in `Zones and the next stage`
below.

Judge the three things only this session knows on top of that screen. A card or unit the
user named in this conversation goes first within its own zone. An event or baseline repair
the user deferred this session is skipped as that item alone, and the next zone decides.
When this conversation carries a change request that no `existing-request:` line holds yet,
record it as one canonical journal line before routing — unless `git:` or `integrity:`
blocks — and call the tool again.

On `integration=<branch>@unknown networkNeeded=1`, fetch integration and call the tool again.

When node cannot be run, or the platform gives this file no source path, report the exact
cause in one line and stop. Never proceed on a guessed state.

Purpose: read the next stage from the sheet the tool produced, report it, obtain approval,
and continue into that stage.

## Domain-Entry Questions

When the user's request is to explain or enter a capability or domain rather than resume
state, run this section before normal routing. The selected capability's confirmed reasons
and reproducible observations live inside that capability document — there is no separate
record set to open.

1. When the `setup:` zone is not empty, report only each exact missing path or field it
   names and `domain knowledge not initialized`; open no capability body. When the user asks
   to initialize it, leave this section and use normal resume routing. With that zone empty,
   read product.md's identity paragraph and capability list. Resolve the target by the
   canonical rules' canonical recognition; the selected unit's number names the
   same-numbered capability document. With an empty resolution set, present only foundation
   plus non-retired number/name candidates and ask; with two or more, present only the
   resolved candidates and ask. Open no body before the answer. A general domain question is
   not a full-set request.
   Run `node ../principles/scripts/project-state.mjs state --capability <capability number>`
   for the selected number. Its `expectedSet`, `pathState`, `legacyV010`, `boundary`,
   `shapeValid`, and `anomalies` decide whether a body may be opened. Before opening a body,
   require exactly one same-numbered file with `shapeValid` true and one fixed boundary.
   When no same-numbered file exists for the selection, including foundation, report only
   the expected path and the repair route — adopt with
   `Brownfield: yes`, arch with `no` — and invent no explanation. On `legacyV010`, open no
   body and report only its path and the arch or adopt mechanical migration route. A
   duplicate or shape anomaly returns only bounded shape facts and the repair route — the
   user resolves a duplicate number/path anomaly, zero or multiple boundaries follow the
   `next: baseline.boundary` row after calling the tool, arch or adopt repairs one-boundary
   design shape, and the next capability closure's verify repairs a verified-only shape
   anomaly. Open foundation and every non-retired capability file only when the user
   explicitly requests the full expected set — there the `baseline:` summary from the call
   without `--capability` is the target set; open only valid files, report each anomalous
   number the same way, and continue with the rest.
2. Read the selected file's design and verified zones and the exact paths named by Binding
   ADRs. The Design head, Scope head, and Covered cards comparisons come from the same
   `--capability` output's `designFreshness`, `verifiedFreshness`, `coveredFreshness`,
   `designHead`, `scopeHead`, and `bindingAdrStatus`. Do not present a hypothesis as current
   fact. When a Binding ADR path is absent, report the exact path that line names, make the
   design zone a hypothesis, and search for no substitute.
3. Answer in this order: path; purpose and boundary; concepts and invariants; verified
   current behavior and entry points; consumed contracts and traps; freshness of both zones;
   and the symmetric difference in completed cards since the baseline. When the section is in
   `noneSections`, say it is empty.
   When the selected capability has a knowledge capsule folder, present the header projection
   from
   `node <plugin root>/scripts/project-knowledge.mjs project --capability <capability number>`
   as an index alongside, and open only the capsules the user picks through the same tool's
   `select --path`, within the opening budget — a request for all of them is that budget's
   explicit approval (`--approved`).
   `<plugin root>` is the folder two levels above this loaded file, and in a runtime that
   sets `${CLAUDE_PLUGIN_ROOT}` that variable names the same folder. When the platform gives
   this file no source path, or the tool cannot be run there, report that in one line and
   answer from the capability document alone, with no capsule index.

This answer changes no file or state and asks no normal-resume approval question. If the
user then requests implementation, return to the normal procedure, report state, obtain
approval, and let work automatically read the same numbered document.

## Tweak Entry

When every item of the current conversation's request that asks for a repository change
passes the canonical rules' three tweak questions,
do not call the tool — this lane consumes no prior record
and changes no shared state, so there is nothing for restoration to protect. Apply only
the canonical open-Git-operation gate, read the canonical tweak lane as a range, follow
that lane, and end — when
that lane's machine checks judge it cannot proceed, return as they direct. When items
requesting no change (a question, a status check) ride along, do not end there — handle
the passing items as tweaks, then call the tool to answer them: a status answer
comes only from the sheet the tool produced. A conversation
with no change-requesting item is not this section's subject — a status question belongs
to the normal procedure, a domain question to the domain-entry section. Items
that fail the three questions, or whose verdict flips mid-change, return
to the normal procedure
(the request-recording sentence receives them, and the recorded line holds only those items).
The passing items are handled in this conversation through the canonical tweak lane — the
recording commit first, the tweak commits after. Those edits' approval is the tweak lane's
declaration (the conversational request is the approval); report-then-approval applies
only to planning the recorded items.

## What the tool does not produce — the three things opened directly

The sheet carries every disk and Git fact. Only three things are opened on top of it.

1. **The one claimed card this invocation continues** is read in full and its progress log's
   last entry is compared against the uncommitted changes. That one is settled at once when
   the user named it; otherwise `next:` settles it at report time —
   `transition.remote-evidence` names its card itself, and `ready.ready` means this
   invocation continues no claim. Until it is settled, skip the full read and the
   uncommitted comparison, and report every remaining uncommitted path without attributing
   it to a card. For others' claims, the `claim:` line's path and claimant are enough.
2. **The canonical range the matched row names**, opened only inside that branch.
3. **Capsules** — only in domain-entry step 3.

## Report, Then Approval

Report what you read in **one paragraph**:

```
"<service> is complete through <capability>, with <task> in progress (that card came from: <origin>).
The progress log reaches <last point>; capability documents are
<non-retired filenames|none>. The next step is <one step>, selected by
<your request | the last handoff | canonical order>. Also open:
<every other unit that could be started now for the same reason | none>; uncommitted and
unattributed: <those paths | none>; not yet on integration: <N paths | none>. Proceed?"
```

The `report:`, `handoff:`, and `open-item:` lines fill those blanks verbatim. `<origin>` is
`report:`'s `origin`; pass that value through without interpreting it — `none` means no
original request called that card, and `unknown` goes through together with the reason that
line carries. The selected candidate's own `claim:` or `ready:` line carries its `origin` and
its `siblings` — the current card paths from that same origin, with the card itself left out.
Pass that array on to work (or the next reader) as it stands: never recompute it, never scan
the tree to fill it, and an empty array means there are no siblings. **Quote the
fact line that carries that one step beside the next step** — the report then shows which
line the judgment came from. Include the content of the `open-item:` lines a person must
decide.

The selection reason comes straight out of `selectionReason` — `your request`
when the step came from a card the user named or from the session unit, `the last handoff`
when it came from the carried unit, and `canonical order` otherwise. When the session unit
holds no candidate, say so in that clause. When `next:` names work, the step reported
is the one work's own selection would take — work's precondition 2 takes a remote-evidence
transition first, and only with none left does canonical candidate order over my claims and
every ready pending card choose — so the report and the stage cannot name different cards.
When a remote-evidence transition was chosen, report that card path and the next action its
branch specifies.
When the conversation named no depth-1 unit and two or more units hold a candidate in that
zone, ask which unit to continue instead of proposing one. With a single unit
holding candidates there is nothing to ask; propose it. With
two or more claims of mine and a conversation naming neither a card nor a depth-1
unit, do not guess and continue the first — another terminal may be carrying that
card right now; show the claim paths, ask which one to continue, then read that claim in
full and run its deferred uncommitted comparison. When the `git:` line's `worktrees` is two or more and neither
`uncommittedUnattributed` nor `notYetOnIntegration` holds the card this invocation would
continue, do not guess which folder is running it — show that listing's paths and branches
and ask whether to continue here or open it in that folder. Ask both questions only at
report time, when `next:` names work and this invocation continues that claim.

On `handoff: stale=1`, do not trust the handoff — the tree and my claimed card decide.

Exclude retired capability documents from the list. When the next stage names a capability or
foundation, include that numbered document's exact path. Append each `integrity: kind=shape`
line as one line naming the path and zone.

Once approved, continue into the stage named in the report. Never modify code before
approval. The request-recording commit is the exception that precedes the report —
recording is immediate, and what approval guards is planning and code, not preservation.

## Zones and the next stage

The zones are in priority order: `git:` an open Git operation · `integrity:` integrity
anomalies · `transition:` a transition that started and did not finish · `marker:` a marker
an interrupted stage left · `setup:` Layer 0, the room, or configuration not yet standing ·
`claim:` the state of my claimed cards · `baseline:` capability-document shape and freshness ·
`request:` a change request recorded in journal and not yet routed · `event:` a due Audit,
Retrospective, or product verification · `layer:` the layer state of tree folders · `ready:`
pending cards that could start now · `blocked:` what is blocked · `product:` the product-layer
verdict · `complete:` nothing left to do.

The row for the name `next:` produced is the next stage.

| `next:` | Next stage |
|---|---|
| `git.open-operation` | resume — stop normal routing, read only the canonical rules' open-Git-operation gate section, and obtain the user's decision exactly there |
| `integrity.blocking` | routing and every tree write are blocked — present that line's verbatim text, expected format, and replacement proposal to the user, and change nothing before confirmation |
| `integrity.shape` | not blocking — append that path and zone as one line in the approval paragraph and open no separate stage. A zone inside a capability document is healed when the next capability closure's verify replaces that zone in full. A path outside a capability document is repaired by the stage that writes that document, and the line reappears every session until then |
| `transition.prepared-route` | verify — compare and apply its payload, then finish the completed state and specified route commit without committing the prepared object again |
| `transition.interrupted` | verify — without repeating execution, first finish the missing output and that state or routing commit |
| `transition.source-id-migration` | verify — first finish the canonical source-id migration commit |
| `transition.layer-opening` | split — take that marker together with every marker carrying the same `source-json` as one bundle, and finish the interrupted planning commit from its durable source and minted numbers |
| `transition.product-running` | verify — rerun the recorded flight |
| `transition.product-result` | verify — finish the stored result's failure routing, events, and report |
| `transition.remote-evidence` | work — take that remote-evidence transition first; report the exact card path work's precondition 2 selects and the next action of that branch |
| `transition.finish-boundary` | work — make no second final task commit; finish only upper-document feedback and the boundary |
| `transition.event-routing` | verify — land pending-finding routing one at a time in finding-number order |
| `transition.event-decision` | verify — present the recorded findings verbatim and record the decision |
| `transition.failure-routing` | verify — without executing, route the one entry that line names |
| `marker.product-rerun` | product |
| `marker.design-note` | arch when Brownfield is `no`, adopt when `yes` — design only; pass that line's `capability`, `note`, `card`, `code`, and `anchor` through as they stand. When `reason` came instead of `anchor`, report that reason as it stands and start no design write. When `prefix=design-only` came, that writer's design-only write was interrupted — start no new one and send it back to finish that same commit. Rebuild no Layer 0 and recompute nothing from cards or history |
| `marker.capability-closure` | verify — finish the interrupted capability closure |
| `marker.re-split` | split — finish that marker's replacement-card plan |
| `setup.no-product` | ask, "Must this work preserve implementation behavior that already exists in the repository?"; yes goes to adopt, no goes to product |
| `setup.layer0-incomplete` | ask the same question; yes makes adopt reverse-derive only the documents `missing` names, and no makes product create only glossary.md without changing the confirmed product.md, or runs arch when arch.md or code-style.md is named |
| `setup.brownfield-field` | ask once, "Did implementation code exist before devflow entered?"; yes makes adopt write only that field as `yes`, no makes arch write only that field as `no` |
| `setup.integration-config` | arch — propose under arch's integration default rule (branching on worktree count), confirm it, and add only those two lines |
| `setup.room-upgrade` | work — confirm the owner with the user, then finish the room-upgrade rename and HANDOFF move in one commit |
| `claim.depends-anomaly` | split — replace it with the user-confirmed canonical dependency value and finish the planning commit |
| `claim.needs-reapproval` | split — checkpoint any current diff and progress log, release the card, normalize legacy dependencies, finish execution-proposal approval and the planning commit, then reclaim it |
| `claim.blocked-by-prerequisite` | split — release the original card and finish the prerequisite |
| `claim.mine` | work |
| `baseline.legacy-v010` | with `Brownfield: yes`, adopt; with `no`, arch — migrate to current Layer 0 design plus the mechanically carried verified zone |
| `baseline.design-refresh` | with `Brownfield: yes`, adopt; with `no`, arch — refresh only the expected set's design zones without rebuilding Layer 0 |
| `baseline.boundary` | resume — read only the canonical baseline predicates' `Writers and replacement boundaries` section and apply it exactly |
| `request.existing` | split — plan that line's request through maintenance routing |
| `event.product-requested` | verify — product layer |
| `event.pending` | verify — run and record one runnable pending event |
| `event.new` | verify — run and record one new event |
| `layer.empty-folder` | split — finish opening one layer of that folder |
| `layer.folder-boundary` | resume — after approval modify no code; read only the canonical rules' boundary-commit rule, rename matching folders from deepest to shallowest, make one boundary commit, and call the tool again |
| `layer.children-done` | verify — capability layer |
| `layer.correspondence-gap` | split — restore product.md-to-tree correspondence |
| `layer.no-foundation` | split — create `01-foundation/` and at least one direct task card in the same layer |
| `layer.no-tree` | split — open the first layer. Run design only when the user explicitly selects it |
| `ready.digest-behind` | resume — advance the marker through the digestion procedure below and let it ride the next boundary or claim commit. It does not interrupt a claim in progress |
| `ready.needs-normalization` | split — normalize legacy `Depends`, ask the user about any unparseable member, add missing fields as `pending` and `required` except a research card's Review is `not-applicable`, then present the execution proposal |
| `ready.approval-invalid` | split — report the exact invalidity, reset `Approval` to `pending`, reapprove the execution proposal, and finish the planning commit |
| `ready.approval-pending` | split — present the execution proposal and get approval |
| `ready.ready` | work |
| `ready.waiting-capability` | split — open one layer of that capability |
| `blocked.audits` | verify — run no event and write no state; list those candidates in event-priority order and report each exact blocking path or branch state and reason |
| `blocked.dependencies` | report the blocking card numbers and claimants; modify no code until a dependency closes |
| `blocked.other-claims` | report the claimants and cards; wait until a claim is released or closes |
| `product.shape-or-revision` | verify — product layer |
| `product.fail` | verify — finish routing the recorded failure, or rerun the product layer once all fix cards are closed |
| `product.unverified` | verify — rerun the product layer |
| `complete.product-pass` | report completion and the count of findings awaiting user decision, then wait for a new request |
| `complete.adoption` | report the tracked post-adoption work complete with no active work, then wait for a new request |

`transition.event-decision` does not block a pass, `.done`, or other work.
Record a decision when the user makes it now. If the user defers or asks to continue
without deciding, keep the text unchanged and skip that item alone for the rest of this
session's judgments.

`blocked.audits` does not gate a verdict, `.done`, product-result reporting,
or other work. After reporting the current candidates, leave disk unchanged and skip those
candidates alone for the rest of this session's judgments.
Judge them again next session because the execution boundary can change.

If the user defers baseline repair, skip only the `baseline:` zone's three kinds during the
rest of this session's judgments; do not block the execution axis. split's maintenance-mapping
gate does not open on that deferral — a card mapped from a stale boundary lands in the wrong
capability.

## Digest — catching up on work outside my sessions

Digest happens only at a clean boundary — after a card closes, or right before a new
claim. An in-progress claim is never interrupted to digest.

```
1. Pull the integration branch (arch settings)
2. From the commits after my room digest.md's marker, choose the digest targets:
   every commit not authored by me, plus mine that lack the `<my id>` prefix
3. For each target commit read the subject and changed paths. Read the diff only for
   commits touching a shared document, the capability folder of the next claim candidate,
   or that candidate card's `Read first` paths. A commit whose subject has the canonical
   tweak form (the id prefix followed by `tweak `) touches no `devflow/` path by
   construction, so the shared-document judgment ends at subject and paths — when it
   touches the candidate's capability folder or a `Read first` path, read its diff like any
   other commit. When that diff contradicts a shared document, land it through the
   discovery-to-update table. Changing a shared document is a binding decision (canonical
   rules' commit discipline)
4. Above 30 outstanding commits, open no individual diff. Read a `git log --stat` rollup by
   path and capability; when that still cannot decide step 3's diff targets, confirm with
   the user which commit becomes the digest marker and leave the exact skipped commit range
   in journal
5. Advance the marker and carry it on the next boundary commit — for a digest right before
   a claim, carry it on this claim commit (work's claim-commit rule)
```

When the marker resolves to no commit here (`resolution=unresolved` — a force push or an
abbreviation, say), or resolves to a commit that is not an ancestor of the integration
history (`resolution=non-ancestor`), report it and re-anchor with the user's confirmation —
the default candidate is the full object ID in the first record of
`git log -z --format=%H%x00%an%x00%ae <integration branch>` (NUL-terminated triples, newest
first) whose author name and author email each equal my room owner.md `git:` values exactly:
string equality on both, never a regex, a substring, or `--author`, and `none` when no record
matches. This branch's HEAD is not a candidate even when it is mine and newest — a marker
outside the integration history makes the next entry demand the same re-anchor again. Neither
one yields a digest range. Silent full re-digest is forbidden. `resolution=unavailable` is not
a re-anchor — Git could not answer the history, so report the failed calculation and its
`reason` and wait or call again with the marker untouched. A marker merge conflict (my two
machines) keeps the descendant hash; an unrelated hash follows the re-anchor procedure.

## Exceptions

- On `claim: mine=0`, include a one-line summary of others' claims (who holds what) in the
  report.
- A missing or empty `handoff:` is normal. Resume from the tree alone.
- `tree=absent` is not a separate branch. The tool prints the same zones in that state's
  canonical order, so read top to bottom and follow the row `next:` produced.
