# Adopt target evidence

This experiment uses a small unmanaged CLI whose maintained guide contradicts executable
category-deletion behavior. The hand prototype was an answer hypothesis, not implementation source;
fresh sessions received only the fixture `AGENTS.md`, the case request, and the built Adopt target.

## Current result

Verdict: **proven for this bounded fixture.** A fresh session reconstructed the project without
silently settling the source conflict, another fresh session absorbed the owner's decision and
closed adoption, and two further fresh sessions recovered the same rule and next route without
depending on the superseded inputs.

Delivery was proven for the Phase 8 Adopt target: two builds produced the same tree hash
`f2c08cc1b9dfb20dfd765e9f4a83507261fecf50fe2c8dbb01d1726e0e2d1fa8`, and Skill Rails reported both
artifact integrity and source currentness as true. Phase 9 added the conditional shared
`team-context` module, so the current Adopt tree hash is
`59bf57fa092b9d6835937cb9c01212ebe6b397788d0105b01231a2a8f681afcd`. Its interrupted-adoption path
is freshly proven in [team hand-off evidence](../team-handoff/README.md); the full Phase 8 closure
journey was not rerun byte-for-byte on this new hash. Build determinism does not establish behavior;
the fresh sessions below provide the bounded Phase 8 behavior evidence.

## Observations and corrections

1. The hand prototype predicted five maintained inputs, two Domains, no Design, and a direct user
   route. A fresh reconstruction instead accounted for tracked `AGENTS.md` as repository governance,
   kept the tightly coupled behavior in one Ledger Domain, and routed the business question through
   Product. Those are rational improvements to the answer key, not target failures.
2. The first built-target session created `project/domains/ledger.md`. The target had named Domain
   parents without stating their canonical path, so the source was corrected to require
   `project/domains/<domain>/index.md`; the failed output remains evidence rather than being relabeled.
3. Two sessions identified command-line Design applicability but filled `design.md` with Product and
   Domain facts because "experience knowledge" was undefined. Adopt now defines that ownership
   boundary, forbids a placeholder, leaves applicability in Architecture, and routes to Design after
   earlier adoption decisions close.
4. Two fresh reconstructions then chose different next actors for the deletion conflict. Review
   separated ownership from agency: Product owns the question and conflict route; a fully framed
   choice may name the user as next actor only when the action names the absorbing route.
5. A Design-bounded rerun copied persistence, CLI, CSV, date, naming, and identity interpretations or
   unknowns into several canonical documents. Phase 6 outputs using the same shared module did not,
   which localized the gap to Adopt. Adopt now gives every fact, interpretation, unknown, and
   conflict one internal home; other homes link instead of recataloging it.
6. The next rerun reduced the output but still listed CSV mechanics in Product and Domain and
   cataloged validation absences that no maintained source raised. Adopt now records an unknown only
   when a maintained source raises the question and no source settles it. Unraised absence remains
   with the route that first needs it.
7. The following rerun relabeled unraised validation absences as observed facts, inferred a durable
   storage blocker from `local-only`, and advertised Direct readiness although no change was
   requested. Adopt now admits a knowledge unit only when maintained source asserts or explicitly
   questions it, or current execution is needed to interpret that claim. Readiness is evaluated only
   for a requested tracked change boundary.
8. The next reconstruction invented a second conflict around the promised command-line and CSV
   surfaces and split one source path into semantic inventory rows. Earlier overload did not recur,
   so the target was not changed from a single new error; the same fixture bytes were rerun.
9. That Case A rerun accounted for each maintained path once, kept one Ledger Domain, declared Design
   applicable without creating `design.md`, exposed exactly the deletion conflict, and created no
   Work. It treated CLI and CSV promises as Product truth with Architecture implementation gaps.
   Independent review graded this reconstruction **proven**.
10. The first Case B closure placed the complete deletion rule in Product and the Ledger Domain. The
    target's wording let a literal reader confuse the route that decides with the document that owns
    the answer. Adopt was corrected once at that cause: the decision route owns conflict resolution;
    the answer goes to the canonical home of the question.
11. A fresh closure on the repaired target landed the full deletion invariant only in the Ledger
    Domain, retained only promise-level protection in Product, kept Architecture's seam and Design
    rationale, removed `adoption/`, replaced the three allowed host documents with noncanonical
    pointers, and routed next to Design. The closed snapshot is commit
    `67b98c08b9af16265dc8f7d0a1ac3211b1e39674`; both maintained tests passed. Independent review
    graded Case B **proven**. An earlier closure attempt was excluded because it loaded the global
    legacy skill instead of the fixture-local target and was interrupted before project writes.
12. External-input independence was observed twice from disposable copies of that snapshot. In one,
    `README.md` and `docs/operations.md` were absent; in the other, the operations guide remained only
    as explicitly retired contradictory evidence. Each fresh session opened exactly
    `.devflow/index.md`, the Ledger Domain, and Architecture; rejected deletion of a referenced
    category; named the Ledger Domain as canonical home; and routed the next foundation to Design.
    Neither session opened Product, the retired guide, an installed skill, or a global instruction.

### Product-meaning absence and return path

The current Adopt target imports the shared Product/Domain document contract. Two builds produced
tree `70959ed05cd4d9e96309557d3df331e1606b98585f88cf6de40782a2de9d1105`; integrity and source
currentness passed.

Fresh case C used a disposable variant whose code, tests, and prose described behavior but not the
product's purpose, intended user, promise, or responsibility boundary. Adopt accounted for all
seven maintained paths, published only source-backed Domain and Architecture knowledge, recorded no
source contradiction, kept Direct and Work closed, and routed the missing product judgment to
Product. A fresh Product actor published the owner's answer without editing `sources.md` or
`conflicts.md` and returned the state to Adopt. A third fresh actor reread the canon, completed
source disposition, passed both maintained tests, and removed `adoption/`. This bounded round trip
is proven. The state bytes were inspected at both custody transitions, but a separate Resume actor
was not run between them; Resume's reporting of those routes remains unproven.

Cases A and B were also rerun on the same tree. A exposed only the referenced-category deletion
contradiction and left adoption open without creating Work. B placed the selected deletion rule in
the Domain, replaced the authorized old prose with pointers, passed both tests, and closed adoption.
Architecture/Design decision returns, adoption-to-Sketch transfer, arbitrary repositories, and
other absence shapes remain unproven.

The v4 reconstruction expanded six tiny sources into 319 nonblank document lines, mostly through
repeated interpretations and unknown catalogs. The v6 snapshot reduced this to 260 lines, v7 to 247,
and the successful snapshot to 92. The reduction is supporting evidence only; the gate is the
observed one-home behavior and source-backed judgment, not line count.

## Reopen boundaries

- Path coverage and semantic completeness are separate claims.
- Existing source may remain as evidence during adoption, but final project truth must not depend on
  reopening it.
- CLI-as-Design remains a cross-project interpretation with its falsifiers recorded in
  [`tests/README.md`](../README.md); it is not silently written back into the immutable plan.
- This fixture does not prove Adopt for arbitrary repositories, every host, or every conflict shape.
- This fixture does not justify a migration adapter, inventory database, renderer, schema, or
  compatibility path.
