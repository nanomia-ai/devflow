---
name: direct
description: Turn a change request in a ready devflow-managed project into an ephemeral same-turn action, a tracked work contract, or one owning decision route. Use before implementation when scope, persistence, or closure must be decided; not for bootstrap, implementation, verification, or status recovery.
---
<!-- generated; do not edit; source: targets/direct/entry.md; receipt: .skill-rails-build.json -->

# Direct one change

Direct decides the smallest safe execution contract for the user's current request. Preserve the
requested outcome and leave local implementation choices to the executor. Do not create process
records merely because the change is large, and do not hide durable intent merely because the diff
is small.

## Entry gate

Before any target-specific action, open `references/project-gate.md` and apply the `direct` row. If
the gate routes elsewhere, make no change.

When the index is usable, read it first.
Follow index routes to the smallest Product, Domain, Architecture, Design, and decision documents
  needed to understand this request. Read current Git revision and status. Use the index's bounded
  Work-state glob to find an active contract with the same still-open outcome before minting a new
  artifact.

## Route questions before writing

First decide whether the request is ready to direct.

- Route a missing product or domain meaning to `product`, a missing technical boundary to
  `architecture`, and a missing interaction principle to `design`.
- If evidence or exploration is needed before even the smallest safe result can be named, return
  `sketch` with the governing question and the evidence that would make it decidable. Do not create
  a speculative Work contract.
- Ask the user only when a real binding choice remains. Do not seek approval for a contract already
  fixed by the request and current canon.

If the request is ready, test persistence before estimating size. It is tracked when any answer is
yes:

1. If this turn stops, would the diff fail to recover the request's intent and next safe action?
2. Does it change durable project knowledge or a binding decision that cannot be landed in its
   canonical home safely in this turn?
3. Will verification, risk, or coordination remain open beyond this turn or require an independent
   verifier?

When every answer is no, classify the change as `ephemeral`. Create no Work directory. Return the
bounded current-turn action, required canonical reads, write boundary, proportional verification,
and closure condition. File count and diff size never make a change tracked by themselves.

If an ephemeral change crosses the gate while work is under way, stop implementation before doing
more. Promote it to tracked with `base_revision` set to current `HEAD`; make the spec's write boundary
cover the inherited dirty delta, and name those paths in the first Work action so a new actor can
distinguish inherited bytes from future work. Dirty bytes are not a `last_safe_point`: publish the
artifact to `work` so its actor can take custody and establish a safe point before any Verify route.

## Shape tracked closure

After classifying the change as tracked and before creating any Work path, open
`references/work-state.md`. Ephemeral and decision-route outcomes do not open it.

One artifact represents one result that can be accepted, cancelled, and verified as a unit. Keep
refinement under the same stable outcome, non-goal, and guardrail in the same active spec. Use a new
artifact for an independently acceptable result, a replaced outcome, or a follow-up to closed work.
Do not split by file, page, worker, or implementation step.

When independent local results also share an end-to-end acceptance, create one ordinary integration
artifact at decomposition time. Put the shared acceptance only in that spec. Its initial state names
the component artifacts and required merge revision as blockers and uses `next_route: direct`; make
it executable only after those inputs are on its base revision. If local results cannot be accepted
independently because rollout is atomic, keep one artifact instead.

For each new artifact, make a collision-resistant opaque ID such as `W-short-label-<token>` and
verify it does not exist in the current tree. The token, not the label, provides identity.

## Publish a tracked contract

Create `.devflow/work/<artifact-id>/`. Every Markdown file has the project's normal `summary` and
`read_when` header.

Write `state.md` first as a recoverable Direct checkpoint with:

```yaml
base_revision: <current full Git revision>
next_route: direct
next_action: <finish and publish this exact contract>
blockers: []
knowledge_candidates: []
pending_landings: []
```

Then write `spec.md` as a self-contained current contract. Its prose must make all of these
judgments possible without the originating request:

- background, user intent, problem, and observable outcome;
- goal, non-goal, and stable guardrails;
- current context and exact `read_first` paths;
- already-made product, technical, design, and operational decisions;
- what must change and the deliverables, without prescribing local implementation choices;
- acceptance criteria and observable completion signals;
- allowed write boundary, plus execution units and safe seams only when real parallel dispatch is
  intended;
- open decisions, risks, and blockers.

Add shaping information only when observing an implementation is necessary to choose the final
form: the boundary the executor may change without another approval, the smallest current reviewable
slice, the surface or signal to observe, any user review point, and the stop condition that chooses
the next slice or whole closure. Shaping is not a separate spec type.

After the spec is complete, replace `state.md` under the shared state contract. An executable
contract has `next_route: work`, one bounded `next_action`, no blockers, and the same base revision.

Do not amend a spec while Work or Verify has custody. They must first publish a safe state with
`next_route: direct`, the bounded delta, and the decision question. If custody or the current Git
basis is unclear, stop and route to `user` rather than overwriting the contract.
If acceptance, guardrails, or closure conditions change and `verification.md` exists, read it as
amendment input, absorb only the still-needed failure memory into the spec's current decisions, and
delete the stale verification in the same amendment before publishing state.

## Return the direction

Report:

- `Disposition:` `ephemeral`, `tracked`, or the single owning decision route.
- `Artifacts:` every Work path created or updated, or `none`.
- `Next action:` one bounded action for each independent artifact; include the integration blocker
  relationship when one exists.
- `Basis:` the canonical documents and Git state used, plus any remaining unproven assumption.

Done means the persistence choice follows the three questions, each tracked artifact is
self-contained and recoverable, only binding choices were escalated, and no implementation or
verification was performed. Next is the current-turn executor for ephemeral work, `work` for an
executable tracked contract, `direct` for blocked integration or amendment, or the one decision
route named above.
