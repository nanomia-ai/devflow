# authoring card — design
Purpose: Optionally settle one coherent current UI design direction from confirmed product and architecture inputs.
Failure scene: record-first duplicates a maintenance request, active research skips its durable card, local exceptions replace the current direction, or design writes K directly.
Observations: product/arch/frontend/design/tree state, exact maintenance origin, and exact 00-project research origin/card path/state are raw durable facts; request scope, source choice, research need, and proposal quality remain judgment.
Terminals: ROUTE:product or ROUTE:arch when an input is absent; ROUTE:split for an observed maintenance origin or research card; WAIT for blocked research; DONE after confirmed current design.
Guards: raw-state-unavailable; product-required; arch-required; existing-design-research; existing-maintenance-origin; source-choice-required.
Stages: input, record-first, research, proposal, confirmation.
Effects: report a design proposal, record a missing maintenance/research origin only before routing split, and write/commit design.md only after approval.
Passengers: the exact origin/card state follows the Decision into split; matching routing records are consumed once by split, never design.
Artifacts: product.md, arch.md, glossary.md, journal, tree, and design.md.
Templates: proposal.md and result.md.
Ownership: design owns design.md only; split owns maintenance and research routing cards; external.principles owns journal grammar and K policy.
Consumer consumption sets: design reads declared Layer 0 inputs plus the collector-observed lineage; split receives the exact observed maintenance or research lineage; arch/resume read design.md.
Consumer closure check: static paths are declared in ARTIFACTS and every lineage route is a Decision fact.
Deferred: intent-backed source obligations remain review-visible until explicit atom resolution.
