---
summary: Queue Relay accepts delivery jobs and makes bounded retry behavior predictable for service operators.
read_when:
  - Read when recovering the missing project index or changing the product boundary.
---

# Product boundary

Service operators submit delivery jobs and need transient failures retried without duplicate final
delivery. Queue Relay owns job acceptance, retry eligibility, and a final delivery outcome. It does
not own message composition, operator dashboards, or provider billing.

`Job` is an accepted unit; `attempt` is one provider call; `final outcome` is delivered or exhausted.
Retry Policy and Delivery Execution are the two domains. A job reaches at most one final outcome.
The technical decomposition and verification channel remain open for Architecture.
