# authoring card — design
Purpose: Optionally settle one coherent current UI design direction from confirmed product and architecture inputs.
Failure scene: record-first duplicates a maintenance request, active research skips its durable card, local exceptions replace the current direction, an existing design/K locus is missed, or Design writes capability K.
Observations: product/arch/frontend/design/tree state, exact maintenance origin, and exact 00-project research origin/card path/state are raw durable facts; request scope, source choice, research need, and proposal quality remain judgment.
Terminals: ROUTE:product or ROUTE:arch when an input is absent; ROUTE:direct to record a new maintenance request or for an observed research card; WAIT for blocked research; DONE after confirmed current design.
Guards: raw-state-unavailable; product-required; arch-required; existing-design-research; source-choice-required.
Stages: input, record-first, research, proposal, confirmation.
Effects: report a design proposal, route direct to record a missing maintenance request, record a missing research origin only before routing direct, and after approval write design.md while carrying the already-recorded request through the canonical design commit.
Passengers: the exact origin/card state follows the Decision into direct; matching routing records are consumed once by direct, never design.
Artifacts: product.md, arch.md, glossary.md, journal, tree, design.md, and design/K.
Templates: proposal.md, result.md, and the shared-shape knowledge-node.md.
Ownership: design owns design.md and design/K only; direct owns maintenance and research routing cards; Arch owns capability/K; external.principles owns journal grammar and K policy.
Consumer consumption sets: design reads declared Layer 0 inputs plus the collector-observed lineage; direct receives the exact observed maintenance or research lineage; arch/resume read design.md.
Consumer closure check: static paths are declared in ARTIFACTS and every lineage route is a Decision fact.
Deferred: intent-backed source obligations remain review-visible until explicit atom resolution.
