---
summary: Implement the first bounded local-spool replay step without changing Product or Domain behavior.
read_when:
  - Read when executing, resuming, reviewing, or judging the scope of W-spool-replay-7k2p.
---

# W-spool-replay-7k2p change contract

The interrupted change adds one replay step from the existing local spool to the existing durable
queue.

## Goal

Implement a function that selects the oldest final spool file, inserts that exact job into the
durable queue using its original job ID, and removes the file only after insertion is confirmed.

## Non-goals

Do not change product scope, Intake acceptance, Delivery retry classification, queue technology, or
add batch replay.

## Read first

1. [`../../project/architecture.md`](../../project/architecture.md)
2. [`../../project/architecture/local-spool.md`](../../project/architecture/local-spool.md)

## Acceptance

One replay call handles at most the oldest final spool file. A confirmed durable insertion removes
that file. An unconfirmed insertion leaves it intact. The original job ID is used as the queue
idempotency key.

The implementation write boundary is the replay function and its focused tests. This document-only
fixture asks only for the next action; it contains no code to modify.
