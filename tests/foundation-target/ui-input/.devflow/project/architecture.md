---
summary: Defines Ops Board as a browser client over a JSON HTTP API and requires Design for the operator dashboard.
read_when:
  - Read when changing browser/API boundaries, data flow, verification channels, or Design applicability.
---

# Architecture: Ops Board

Ops Board has one browser client and one JSON HTTP service. The client depends on an application API
for queue queries and mutations; it does not reproduce queue business rules. The service owns
authorization, invokes the Queue Domain, persists current queue state, and exposes request revision
tokens so stale mutations can be rejected.

Public seams are the browser experience and JSON API. Framework selection, endpoint details,
storage engine, deployment topology, and live-update transport remain open technical decisions.
Component and interaction behavior belong to Design rather than those choices.

Default verification uses executable Domain tests, API integration tests, browser-level interaction
tests, and visual/accessibility review on a running local workspace. Design is required for the
operator dashboard because prioritization, assignment, dense queue scanning, responsive behavior,
and action feedback are user-facing interaction decisions.

Open technical questions: framework, live-update transport, persistence engine, and deployment
topology.
