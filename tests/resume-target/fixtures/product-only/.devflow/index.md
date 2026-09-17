---
summary: Queue Relay is a headless delivery queue whose Product readiness and next foundation route are derived from project files.
read_when:
  - Always read first for project work or status recovery.
---

# Queue Relay project map

Product is ready only when `project/product.md` states the problem, users, boundary, non-goals,
language, cross-domain shape, invariants, and open questions. Architecture readiness requires
`project/architecture.md`; Design applicability is declared there.

Product questions route to `project/product.md`. Technical planning routes to `architecture` when
Architecture is absent. Find active state only at `sketches/*/state.md`, `adoption/state.md`, and
`work/*/state.md`. Resume compares those paths with current Git state before returning one route.

Conversation and completed artifacts are not canonical state.
