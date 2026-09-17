---
summary: Delivery classifies attempts as delivered, retryable, or rejected; HTTP 409 is a terminal rejection and is not retried.
read_when:
  - Read for delivery-attempt state, HTTP outcome classification, retry eligibility, or terminal-result questions.
---

# Delivery Domain

Delivery owns what happens after Intake has accepted a job. One attempt produces exactly one current
outcome:

- Any 2xx response makes the job terminal `delivered`.
- HTTP 408, HTTP 429, and 5xx responses make the attempt `retryable`; the job remains eligible for a
  later attempt.
- Every other 4xx response, including HTTP 409, makes the job terminal `rejected` and it is not
  retried.

Delivery does not change the job ID, destination, or payload received from Intake. Changes to
acceptance or duplicate handling belong to Intake rather than this Domain.
