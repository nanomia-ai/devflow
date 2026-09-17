---
summary: Intake turns a valid submission into exactly one accepted job and resolves duplicate job IDs without creating another job.
read_when:
  - Read for submission validity, acceptance, job identity, idempotency, or duplicate-submission questions.
---

# Intake Domain

Intake owns the boundary from a submitted envelope to one accepted job. A valid submission contains a
job ID, a complete destination URL, and payload bytes. Invalid submissions are rejected and never
enter Delivery.

`accepted` means RelayBox has durably preserved the job for later delivery. Submitting an already
accepted job ID returns the existing acceptance and never creates a second job. Once accepted, the
job ID, destination, and payload are immutable inputs to Delivery.

Intake does not classify HTTP responses or decide delivery retries; those questions belong to the
Delivery Domain.
