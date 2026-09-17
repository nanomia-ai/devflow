---
summary: A locally spooled job becomes recoverable through atomic file publication and is removed only after the durable queue confirms the same job.
read_when:
  - Read after project/architecture.md when changing fallback acceptance, spool persistence, replay order, replay identity, or spool cleanup.
---

# Local spool contract

This concern applies only when the durable queue is temporarily unavailable during receiver
acceptance or when the worker replays those locally persisted jobs.

- Publish a spool entry by writing a temporary file, flushing it, and atomically renaming it to its
  final name before reporting acceptance.
- Preserve the original job ID as the queue idempotency key; replay must not mint another identity.
- Replay final spool files from the oldest filename first, one file at a time.
- Remove a spool file only after the durable queue confirms insertion of that same job. If insertion
  is not confirmed, leave the file intact for the next replay attempt.

These filesystem rules do not define whether an HTTP delivery result is retryable; Delivery owns that
separate question.
