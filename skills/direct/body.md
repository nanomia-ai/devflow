## why: purpose

Direct turns an accepted request into durable, user-approved units that Work can execute without losing request identity or duplicating planning. It determines the necessary planning depth and executable unit boundaries, materializes research or task cards, and carries dependencies, order, parallelism, model tiers, and approval to the Work handoff.

Direct owns work direction, not execution management. Work performs the research or implementation, Verify judges the result, and the external coordinator assigns or supervises agent processes. Direct never selects a card by filename order, performs the work, writes current K knowledge, or treats tree-root existence as an active scope.

Read `<skill-root>/../principles/references/policy-index.md` as this stage's shared-policy entry; this consumes common policy without invoking Principles request classification.

## guard: canonical-state-required

Any unavailable project-state, filesystem, containment, Git, origin, scope, or approval observation is unknown rather than absent. Stop before associating a request with a card or writing planning state.

## guard: approved-project-research

Only route a `00-project` research card to work when principles project-state reports effective approval for that exact numeric research card and exact origin. A pending, invalid, unrelated, or merely discovered card stays inside direct's ordinary proposal boundary.

## stage: intake

Judgment: `request.classification` is exactly pre-product-research, design-change, tree-work, small-work, withdraw, or unknown. A canonical Failure-history route is already a durable request and enters as tree work without creating a second journal request. Pre-product research enters materialize with `.devflow/tree/00-project` as its exact active scope, uses the ordinary numbered research-card contract with its exact Origin field and `Approval: pending`, and is never implementation. It then crosses the same proposal write-and-commit boundary as every other card; unrelated research cards do not count. A design decision that must change before implementation is `design-change`; the collector reports the request `design-confirmed` once a `design — design.md` commit lands at or after the commit that carries its line, and only then does the same preserved request proceed as tree work. `withdraw` is the user's explicit drop of the current recorded request: an uncommitted line is removed without a commit, a committed line in one binding integration commit, and a request with drafts is cancelled through the proposal. Tree work with a confirmed product and neither a durable request nor an active origin first writes the canonical request line carrying the whole user request, then rejudges; that line rides the `direct — begin` commit as the source record. Ordinary tree work without product routes product, and a genuinely small request ends with zero tree delta.

Why: Request identity must survive interruption before any scope or card is chosen, while its current owner must settle an upper-document decision before Direct turns the remaining work into cards.

## stage: materialize

Judgment: `bundle.contract` is exactly ready or ask, and `bundle.units` is exactly json. The JSON names one or more independently executable units at the exact active scopes; when the request is `failure-routed`, resolve only its exact `request.current` Failure-history locator as the repair basis. A pre-product research unit uses `.devflow/tree/00-project` and the ordinary research-card template. `00-project` is an exact research-only scope: its canonical `# NN.N Research:` heading selects only that template, and a task-card heading is an integrity block. Each unit becomes one task or research card; several sibling units remain several cards, while one crosscut unit remains one card listing every affected knowledge owner rather than one mirrored card per owner. Reuse a principles-projected active marker bundle without remapping it, never create knowledge-landing markers, and never write K.

Why: The unit boundary follows executable work, while project-state origin and scopes prevent unrelated historical cards from entering the bundle.

## stage: carry-approval

Judgment: Reuse only an approval that project-state reports effective for the same exact origin. The principles-owned layer-opening markers still standing are the sole direct-time representation of remaining scopes and carry the already-approved bundle forward; there is no card-local residual field. Knowledge-landing markers are not planning residuals and direct never creates them: later work or research synthesis owns them only after a confirmed conclusion has a durable consumer.

Why: One request has one approval boundary even when its parent scopes land in several planning passes.

## stage: propose

Judgment: `proposal.decision` is exactly approve, revise, cancel, or ask. Report the complete execution proposal before asking for approval. Approval applies to the whole origin-bound sibling bundle; revision keeps the boundary open, cancellation removes only that origin's drafts, request line, and layer-opening markers, and an approval-invalid card is repaired from the exact project-state reason before asking again. A `failure-routed` request keeps its exact Failure-history source and selected repair plan as the single route result; do not create a second request or choose another route. Approval freshness remains owned by principles and is never reconstructed from a direct-local literal parser. After the planning commit, report the exact approved card set, order, and parallelism as the Work handoff, then wait so a solo caller can choose one exact card through Resume or Work and an external coordinator can assign all approved paths without competing with an automatic claim.

Why: A durable planning decision requires the user's explicit choice, card writes, one planning commit, and a later collected receipt proving that commit consumed the settled origin; the visible post-commit handoff connects planning to execution without making Direct an agent supervisor.

