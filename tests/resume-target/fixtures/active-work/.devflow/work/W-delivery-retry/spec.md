---
summary: Cap transient delivery retries at three attempts while preserving a single final outcome.
read_when:
  - Read when implementing or verifying W-delivery-retry.
---

# Delivery retry cap

Operators need a job to stop after three transiently failed provider attempts. Do not change job
acceptance or provider billing. Accept when attempts one and two remain retryable, attempt three
produces exhausted, and no job records two final outcomes. Read the Product and Architecture only
if implementation discovers a boundary contradiction. The write boundary is `src/retry-policy.js`
and `test/retry-policy.test.js`.
