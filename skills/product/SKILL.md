---
name: product
description: Define or revise a Devflow project's users, problem, value, product boundary, language, invariants, and business-domain composition. Use for a clear new-project brief or an open product decision; not for technical architecture, UI design, change direction, implementation, or brownfield reconstruction.
---
<!-- generated; do not edit; source: targets/product/entry.md; receipt: .skill-rails-build.json -->

# Define the product boundary

Product makes the project's purpose and business meaning usable without the originating
conversation. It decides what problem the product owns, for whom, and where its promise stops. It
does not choose the implementation stack, runtime structure, UI system, or delivery tasks.

## Enter through a valid gate

Before any target-specific action, open `references/project-gate.md` and apply the `product` row.
Then open `references/project-knowledge.md`. When a readable `.devflow/index.md` already exists,
read it before selecting Product inputs.

When a readable Sketch state names `product` as `next_route`, open
`references/sketch-handoff.md` before writing and complete its receiver contract together with the
Product publication.

Enter Product only for a clear new-project brief, a completed project Sketch routed here, or an
open question that changes product meaning. Maintained brownfield sources without an internal
Devflow foundation route to `adopt`; an uncertain idea that still needs investigation routes to
`sketch`. Do not publish a partial canonical Product to hold a multi-session interview: preserve
that uncertainty in a Sketch and publish only a coherent current answer.

## Decide only product meaning

Use the brief, explicit user decisions, relevant project Sketch findings, and existing Product or
Domain canon when present. Ask only for choices whose alternatives would materially change the
problem, user, value, boundary, shared language, invariant, or domain composition. Do not ask for a
technology, file layout, component, database, test tool, visual style, or implementation sequence.

Define:

- the problem, users or operational roles, and value;
- capabilities inside the product boundary and explicit non-goals;
- the stable terms a later reader must use consistently;
- product invariants and genuinely open product questions; and
- business domains only where distinct business state, rules, or language justify separate homes.

A Domain is a knowledge boundary, not a menu item, code module, team, or skill. Its index owns the
domain's purpose, boundary, core terms, states or invariants, contracts with other domains, optional
child routes, and open business questions. Keep cross-domain composition in Product and one
domain's rules in that domain only.

## Publish the foundation

For a new project, compose the complete current documents before publishing
`.devflow/project/product.md`, the necessary `.devflow/project/domains/<domain>/index.md` files, and
`.devflow/index.md`. The Product document must answer who has what problem, the promised value,
scope and non-scope, shared language, cross-domain composition, product invariants, and open product
questions. Omit empty sections and do not invent facts to make the document look complete.

The index routes product-boundary questions to Product, domain-business questions to the matching
Domain parent, technical questions to Architecture when it exists, UI questions to Design when it
applies, and active recovery through only the immediate `sketches/*/state.md`,
`adoption/state.md`, and `work/*/state.md` globs. Say that Architecture readiness is derived from a
complete Product plus `project/architecture.md`, and that Design readiness is derived from the
Architecture applicability statement plus `project/design.md` when required. Do not create absent
Architecture or Design files as placeholders.

When revising an existing project, replace only the canonical Product and Domain documents whose
current meaning changed. Update the nearest parent index only if a question route changed. A reason
whose future presence protects the decision belongs in one current decision document; do not turn
the Product body into a change log.

## Finish at the next open question

After publication, re-read the new headers and the bodies against the brief. Confirm that the
documents are self-contained, no product fact is duplicated across Product and Domains, and no
technical or UI decision slipped in.

Route a new foundation to `architecture` with the Product and Domain paths it should read. Route an
active change back to `direct` when no technical foundation decision is missing. Route unresolved
product meaning to the user or a project Sketch rather than guessing it.

Return:

- `Published:` canonical paths created or replaced;
- `Boundary:` the product promise and explicit non-goals in plain language;
- `Domains:` each business domain and why it has an independent knowledge boundary, or `none`;
- `Route and action:` one next route and one bounded action; and
- `Unproven or open:` decisions not established by the supplied evidence.

Do not write Architecture, Design, Work artifacts, implementation, adoption inventory, or
verification verdicts.
