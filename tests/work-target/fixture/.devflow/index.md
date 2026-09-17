---
summary: Queue Relay is a headless delivery queue whose Product and Architecture are ready; this map routes change questions without duplicating their detail.
read_when:
  - Always read first for project work, direction, or status recovery.
---

# Queue Relay project map

Queue Relay accepts signed delivery callbacks and retries transient delivery failures without a
user interface.

## Foundation readiness

- Product is ready because `project/product.md` states the problem, roles, boundary, non-goals,
  language, cross-domain shape, invariants, and open product questions.
- Architecture is ready because `project/architecture.md` states components, dependency and data
  flow, public seams, verification channel, Design applicability, and open technical questions.
- Design is not applicable because Architecture declares that the product has no user interface.
- No Adoption is active.

## Question routes

- Product boundary, delivery meaning, or delivery invariant → `project/product.md`
- Runtime boundary, callback transport, configuration, metrics, or verification channel →
  `project/architecture.md`
- Current Work → immediate `work/*/state.md`; after selecting one, read its sibling `spec.md`

## Active artifact discovery

Enumerate only immediate `sketches/*/state.md`, `adoption/state.md`, and `work/*/state.md`. Do not
infer activity from source changes alone and do not recursively read absent artifact trees.

## Non-canonical material

Source and tests are implementation evidence. Git preserves history. They do not replace Product,
Architecture, or an active Work contract.
