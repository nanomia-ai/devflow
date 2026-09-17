---
name: design
description: Define or revise a Devflow project's user-experience, visual foundation, component and interaction strategy, accessibility, responsive and state principles, and review surface when Architecture says UI Design applies. Use for an open UI-system decision; not for product meaning, technical architecture, delivery direction, implementation, or headless projects.
---

# Define the experience foundation

Design turns an applicable Product and Architecture foundation into current experience principles a
later UI change can implement and review. It owns experience direction, visual foundation,
component and interaction strategy, accessibility, responsive behavior, state presentation, and
the review surface. It does not redefine business rules or technical seams.

## Enter through a valid gate

Before any target-specific action, open `references/project-gate.md` and apply the `design` row.
Then open `references/project-knowledge.md` and the readable `.devflow/index.md`. Read Product and
Architecture before deciding whether Design applies.

If Architecture says Design does not apply, create or edit no project document and route to
`direct`. If applicability is absent, contradictory, or technically open, route to `architecture`
rather than guessing. When Design applies, read only the Domain parents and existing Design
children selected by the UI surface or interaction question. An uncertain experience investigation
that cannot finish in the current custody interval routes to `sketch` instead of leaving a partial
canonical Design.

## Decide experience principles, not product or technology

Use the Product's users and promise, Architecture's supported surfaces and seams, explicit user
choices, and observed UI evidence when available. Ask only for a choice that materially changes the
experience direction, foundation, component system, interaction behavior, accessibility,
responsiveness, state presentation, or review method.

Define the smallest coherent foundation that answers:

- the intended experience and principles for the applicable users and surfaces;
- visual foundation and token strategy without prematurely enumerating every token;
- component strategy and the stable patterns components share;
- interaction, navigation, feedback, and error-recovery principles;
- accessibility and input-method expectations;
- responsive behavior across the presentation ranges Product and Architecture establish;
- loading, empty, error, partial, success, permission, and destructive-action state principles;
- the concrete review surface and what a reviewer must observe; and
- any open Design questions with the evidence or decision that would close them.

Refer to Domain state and rules instead of copying them into Design. Refer to Architecture for
rendering boundaries, data seams, and platform constraints. Do not choose framework internals,
endpoint shapes, storage, or implementation tasks.

## Publish current Design

Compose a complete current `.devflow/project/design.md` before replacing it. Apply the shared split
test before creating `project/design/<concern>.md`; a page, component, or framework name alone is
not an independent concern. The default for a small product is one Design parent.

Update `.devflow/index.md` in the same change so UI and interaction questions route to Design and
foundation readiness derives from Architecture's applicable statement plus the Design document.
Add concern routes only for children that exist; do not copy patterns or domain rules into the
index.

When a rejected alternative or reopen condition is needed to protect the current experience
direction, write one current decision document and reflect the operative rule in Design. Do not
create a decision file merely to narrate that Design work happened.

## Finish at the next open question

Re-read the Design header and body, the index route, and the Product, Architecture, and Domain
boundaries it depends on. Confirm that the experience can be reviewed on the named surface, every
state a user can encounter has a principle, and no business or technical fact was duplicated.

Route a complete foundation to `direct`. Route a product-boundary question to `product`, a
technical applicability or platform question to `architecture`, and an experience question needing
exploration to `sketch`.

Return:

- `Published:` Design, concern, decision, and index paths created or replaced, or `none` when
  Design does not apply;
- `Experience:` the governing experience, component, interaction, accessibility, responsive, and
  state principles;
- `Review surface:` where and how the result will be observed;
- `Route and action:` one next route and one bounded action; and
- `Unproven or open:` experience claims not established by current evidence.

Do not write Product or Domain business meaning, Architecture, Work artifacts, implementation,
adoption inventory, or verification verdicts.
