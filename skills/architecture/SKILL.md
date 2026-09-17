---
name: architecture
description: Define or revise a Devflow project's technical boundaries, components, dependencies, runtime and data flow, public seams, verification channels, and Design applicability from a complete Product foundation. Use for an open architecture decision; not for product meaning, UI principles, delivery direction, implementation, or brownfield reconstruction.
---
<!-- generated; do not edit; source: targets/architecture/entry.md; receipt: .skill-rails-build.json -->

# Define the technical foundation

Architecture turns a complete Product and its business domains into current technical boundaries a
later change can safely work within. It owns structure, dependency direction, runtime and data
flow, public seams, operating boundaries, and verification channels. It does not redefine product
meaning or decide the detailed user experience.

## Enter through a valid gate

Before any target-specific action, open `references/project-gate.md` and apply the `architecture`
row. Then open `references/project-knowledge.md` and the readable `.devflow/index.md`.

When a readable Sketch state names `architecture` as `next_route`, open
`references/sketch-handoff.md` before writing and complete its receiver contract together with the
Architecture publication.

Architecture requires a complete `.devflow/project/product.md`. Read Product for the system promise
and cross-domain composition, then open only the Domain parents and existing Architecture children
routed by the current technical question. If Product meaning is incomplete or contradictory, make
no technical choice and route to `product`. Maintained brownfield meaning not yet absorbed routes to
`adopt`; an investigation that cannot finish in the current custody interval routes to `sketch`
rather than leaving a partial canonical Architecture.

## Decide technical boundaries, not business meaning

Use explicit user constraints, current Product and Domain contracts, relevant code or runtime
evidence when it exists, and already-current technical decisions. Ask only for a choice that would
materially change components, deployment, dependency direction, data ownership, a public seam,
verification, or Design applicability. Preserve unsupported provider, scale, deployment, or
operational claims as explicit unknowns with the condition that would resolve them.

Define the smallest coherent foundation that answers:

- supported environment and deployment shape;
- components and their responsibilities;
- dependency direction and contracts between components and Domains;
- runtime and durable-data flow;
- public seams versus internal implementation details;
- failure and operating boundaries that change implementation decisions;
- executable verification channels and any unavailable external channels; and
- whether Design is required, does not apply, or remains an open technical question, with why.

Do not restate Domain lifecycle or Product invariants as technical rules. Refer to their canonical
parents and describe only the technical contract needed to preserve them. A framework, folder, or
table name is not a reason to create a child document.

## Publish current Architecture

Compose a complete current `.devflow/project/architecture.md` before replacing it. Its body must
state the environment, component and dependency model, runtime/data flow, public seams, verification
channels, Design applicability, optional concern routes, and open technical questions. Apply the
shared split test before creating `project/architecture/<concern>.md`; the default for a small
foundation is one parent document.

Update `.devflow/index.md` in the same change so technical questions route to Architecture and
foundation readiness can be derived from Product, Architecture, and the Design applicability
statement. Add or remove a concern route only when that child actually exists; do not copy the
technical answer into the index.

When a decision's rejected alternative or reopen condition protects the current structure, write
one current decision document and reflect the operative rule in Architecture. Do not create a
decision file merely to narrate that Architecture work happened.

## Finish at the next open question

Re-read the Architecture header, its routed children, the index route, and the Product/Domain
boundaries it depends on. Confirm that no business fact moved into Architecture, no technical fact
was copied into Product or a Domain, and every claimed verification channel is actually available
or explicitly unknown.

If Architecture says Design is required and no complete Design exists, route to `design` with the
surface and constraints it must decide. If Design does not apply, route a new foundation to
`direct`. Route an unresolved product premise to `product`, a technical unknown needing exploration
to `sketch`, and an active change decision back to `direct` after the canonical update.

Return:

- `Published:` Architecture, concern, decision, and index paths created or replaced;
- `Structure:` components, dependency direction, runtime/data flow, and public seams;
- `Verification:` executable channels and unavailable or unproven claims;
- `Design applicability:` required, not applicable, or open, with the reason;
- `Route and action:` one next route and one bounded action; and
- `Unproven or open:` technical claims not established by current evidence.

Do not write Product or Domain business meaning, Design principles, Work artifacts, implementation,
adoption inventory, or verification verdicts.
