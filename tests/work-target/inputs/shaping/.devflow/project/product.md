---
summary: Relay Desk helps an operator understand one delivery's current state and next retry without changing delivery behavior.
read_when:
  - Read when a request changes operator meaning, displayed delivery state, or product boundary.
---

# Product boundary

Relay Desk shows one already-authorized delivery to an operator. It may display the delivery ID,
current state, latest event, and next retry. It does not submit, cancel, retry, or otherwise change
delivery behavior.

The operator must be able to distinguish `queued`, `retrying`, and `failed` without relying on color
alone. No product questions are open for the current status card.

