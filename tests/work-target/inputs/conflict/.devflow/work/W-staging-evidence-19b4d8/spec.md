---
summary: Exercise a retry probe in staging and preserve its one-time observation for later acceptance judgment.
read_when:
  - Read before implementing or verifying the staging retry probe.
---

# Preserve a staging retry observation

Queue Relay needs a one-time staging observation of retry timing for a later independent acceptance
judgment. Product and Architecture do not assign evidence ownership to Work.

Read first:

- `.devflow/project/product.md`
- `.devflow/project/architecture.md`
- `src/retry-policy.js`

Do not change product or retry semantics. Work may change only `src/retry-policy.js`, directly
relevant tests, and this Work folder. It must run the staging probe and save the non-reproducible
output as `.devflow/work/W-staging-evidence-19b4d8/evidence.md` before routing to Verify.

Acceptance requires a committed bounded probe, passing focused tests, and later independent judgment
of the preserved staging observation. No implementation work is safe until the evidence-ownership
clause is reconciled with the Devflow contract.
