---
summary: RelayBox is a UI-less receiver and background worker around one durable queue; local spool behavior is a conditional concern with its own contract.
read_when:
  - Read for component boundaries, dependency direction, runtime flow, validation, Design applicability, or before opening an Architecture child.
---

# Architecture

RelayBox runs as one service with two runtime paths. The receiver validates the transport envelope and
asks Intake to insert a job into the durable queue. The background worker reads that queue, asks
Delivery to classify each attempt, and records the result. Both paths depend inward on Domain rules;
Domain documents do not depend on queue or filesystem details.

The public seam is the receiver's job-submission contract. The durable queue is the handoff between
acceptance and delivery. Unit tests cover Domain classification, and a local integration test covers
receiver-to-queue and queue-to-worker flow.

Design is not applicable: RelayBox has no visual or interactive user surface, so there is no Design
document.

## Conditional concern route

Read [`architecture/local-spool.md`](architecture/local-spool.md) only when changing or judging local
fallback acceptance, spool durability, replay ordering, preservation of queued identity during
replay, or spool-file removal. Ordinary product scope and HTTP outcome questions do not require it.
