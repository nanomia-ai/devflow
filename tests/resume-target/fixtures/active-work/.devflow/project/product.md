---
summary: Queue Relay accepts delivery jobs and makes bounded retry behavior predictable for service operators.
read_when:
  - Read when a question changes the product boundary or shared delivery language.
---

# Product boundary

Service operators submit delivery jobs and need transient failures retried without duplicate final
delivery. Queue Relay owns job acceptance, retry eligibility, and a final delivery outcome. It does
not own message composition, operator dashboards, or provider billing.

`Job` is an accepted unit; `attempt` is one provider call; `final outcome` is delivered or exhausted.
Retry Policy and Delivery Execution are the two domains. A job reaches at most one final outcome.
There are no open product questions for the retry-cap change.
