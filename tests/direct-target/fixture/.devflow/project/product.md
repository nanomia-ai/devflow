---
summary: Queue Relay accepts authenticated callback jobs and delivers each accepted job without allowing a signed callback token to authorize more than one acceptance.
read_when:
  - Read when a request changes delivery meaning, callback authorization, product boundary, or user-visible reliability.
---

# Product boundary

Queue Relay gives service operators a headless way to submit delivery jobs and survive transient
destination failures. A producer submits a signed callback; a consumer attempts delivery and may
retry the accepted job.

The product accepts callbacks, queues jobs, retries transient delivery failures, and exposes
operational metrics. It does not provide a user interface, author callback credentials, or promise
the behavior of external transports.

`callback token` means the signed authority to accept one job. `delivery ID` means the stable
identity of that accepted job. Producer and consumer are separate runtime roles over the same job.

Current invariants:

- One valid callback token can authorize at most one accepted job, regardless of delivery outcome.
- Retries keep the same delivery ID and cannot create a second accepted job.
- Metrics may observe delivery behavior but cannot change authorization or retry semantics.

There are no open product questions for the current local transport. External transport semantics
must be evidenced before they can be claimed compatible with these invariants.
