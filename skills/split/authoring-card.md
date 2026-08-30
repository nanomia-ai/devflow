# authoring card — split
Purpose: convert one approved planning origin into an approved execution proposal and materialized research or implementation cards without mixing the knowledge and work trees.
Failure scene: split invents a missing plan, creates implementation cards under 00-project, writes knowledge markers, or materializes stale/unapproved work.
Observations: product and current request; active/draft/project-research origins; project-research approval; approval boundary/issue; planning receipt; request classification; bundle contract/units; proposal decision.
Terminals: BLOCK when canonical state or project-research approval is unsafe; ASK for origin/bundle/approval choices; WAIT with a durable proposal; ROUTE to work after materialization; DONE on explicit cancellation cleanup.
Guards: canonical-state-required; approved-project-research.
Stages: intake; propose; carry-approval; materialize.
Effects: read the chosen origin, write proposal/approval artifacts, create one bounded card bundle, append only owned journal records, or remove only the exact cancelled draft bundle.
Passengers: chosen origin and source revision, affected owners, dependency/parallel order, model tiers, completion signals, and approval freshness.
Artifacts: product, journal, layer-opening bundle, card bundle, approval bundle/repair, and exact cancellation cleanup artifacts, with readers declared in the spec.
Templates: task card (with Identity and exactly one `## Progress log`), research card, execution proposal, and result.
Ownership: split owns work-tree planning and approval artifacts; product/arch/design/adopt own durable knowledge; principles owns record grammar; work owns execution and marker creation after durable conclusions.
Consumer consumption sets: intake reads product plus the exact chosen origin; proposal reads bundle facts and named affected owners; materialization reads the approved proposal/receipt and its templates; cancellation reads only the exact draft bundle.
Consumer closure check: all static paths are declared in ARTIFACTS; dynamic owner/card paths are Decision facts; `# NN.N Research:` is the only 00-project heading and its materialization both selects research cards and forbids task cards.
Deferred: none.
