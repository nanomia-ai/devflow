---
summary: Preserve the inherited retry-window change, add focused coverage, and prepare it for independent staging verification.
read_when:
  - Read before taking custody of, implementing, or verifying the retry-window change.
---

# Prepare the retry-window change

The current worktree contains an inherited uncommitted change in `src/retry-policy.js` from
`probeWindow = 1` to `probeWindow = 2`. The change became tracked because another session must
perform the final staging acceptance observation.

Keep the same delivery ID and existing retry limit semantics. Do not broaden PushPort behavior,
change configuration, or treat a staging observation as product or architecture canon.

Read first:

- `.devflow/project/product.md`
- `.devflow/project/architecture.md`
- `src/retry-policy.js`
- `src/config.js`

Preserve the inherited source delta and add `test/retry-policy.test.js` with focused coverage for
the probe window and retry-limit boundary. The write boundary is those two files plus this
artifact's `state.md`. Work prepares reproducible code and tests; Verify later performs and records
the staging observation against the committed revision.

Acceptance:

- the inherited `probeWindow = 2` byte is preserved;
- retry decisions still stop at the configured limit;
- `node test/retry-policy.test.js` exits successfully;
- the owned source and test are one focused safe commit;
- unrelated bytes are unchanged.

After the automated check and commit, route to Verify. Unknown external timeout or idempotency
behavior remains outside this contract.
