---
summary: Queue Relay is a headless delivery queue; Product and Architecture are ready, and Resume can locate current work through bounded state paths.
read_when:
  - Always read first for project work or status recovery.
---

# Queue Relay project map

Queue Relay accepts delivery jobs and retries transient failures without a user interface.

## Foundation readiness

- Product is ready only when `project/product.md` states the problem, users, boundary, non-goals,
  language, cross-domain shape, invariants, and open product questions.
- Architecture is ready only when `project/architecture.md` states components, dependency and data
  flow, public seams, verification channel, Design applicability, and open technical questions.
- Design is not applicable when Architecture says the product has no user interface.

## Question routes

- Product boundary → `project/product.md`
- Technical boundary or verification → `project/architecture.md`
- Current work → immediate `work/*/state.md`; after selecting one, read its sibling `spec.md`

## Resume orientation

Enumerate only `sketches/*/state.md`, `adoption/state.md`, and `work/*/state.md`. Compare selected
state with current Git revision and bytes. If one item is active, return its next route and action;
if several are active, ask the user to choose. Treat dirty bytes with no artifact as unowned work.

Conversation and completed work folders are not canonical state.
