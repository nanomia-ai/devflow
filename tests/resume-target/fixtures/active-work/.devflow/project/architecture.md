---
summary: Queue Relay is a headless process with an intake adapter, durable queue, worker, and provider port verified through executable integration tests.
read_when:
  - Read when changing components, dependency direction, runtime flow, public seams, or verification.
---

# Architecture

The intake adapter writes jobs to the durable queue. The worker reads jobs, asks Retry Policy for
eligibility, and calls the provider port. Dependencies point inward to the policy; provider code
does not decide retries. The public seams are job submission and provider invocation. Integration
tests run the queue and a fake provider. Design is not applicable because the product has no user
interface. There are no open technical questions for the current Work.
