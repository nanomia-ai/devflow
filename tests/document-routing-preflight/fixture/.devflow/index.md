---
summary: RelayBox accepts explicitly addressed opaque webhook jobs and delivers them in the background; this is the starting map for project truth and active work.
read_when:
  - Always read this first for a RelayBox project question or interrupted-work question.
---

# RelayBox project map

RelayBox is a UI-less service that accepts webhook jobs with an explicit destination and delivers the
unchanged payload asynchronously.

## Question routes

- Product purpose, user value, supported behavior, or scope boundary:
  [`project/product.md`](project/product.md).
- System components, dependency direction, runtime flow, validation channel, or whether Design
  applies: [`project/architecture.md`](project/architecture.md).
- Local fallback acceptance, spool durability, replay order, or spool-file removal: read
  [`project/architecture.md`](project/architecture.md) and then
  [`project/architecture/local-spool.md`](project/architecture/local-spool.md).
- Job acceptance, idempotency, or duplicate submission:
  [`project/domains/intake/index.md`](project/domains/intake/index.md).
- Delivery attempts, HTTP outcome classification, or retry eligibility:
  [`project/domains/delivery/index.md`](project/domains/delivery/index.md).

## Active work orientation

Active Work is discovered only at `.devflow/work/*/state.md`. For a selected Work artifact, read its
`state.md`, its sibling `spec.md`, and every document named by the spec's `read_first`. The current
fixture has one active artifact: `W-spool-replay-7k2p`.

Product and Architecture are present. Architecture declares Design inapplicable because RelayBox has
no user interface. Files outside `.devflow/` do not own RelayBox project truth.
