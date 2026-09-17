---
summary: Validate retry configuration at its loading boundary and prove invalid limits are rejected.
read_when:
  - Read before implementing or verifying retry-limit validation.
---

# Validate retry limits

Queue Relay currently exports a retry limit without validating the value. A malformed limit can
make retry behavior ambiguous before producer or consumer logic runs.

The goal is for the configuration boundary to accept positive integers and reject zero, negative,
fractional, and non-numeric values. This work does not change retry semantics, the default value,
delivery identity, callback acceptance, or any product boundary.

Read first:

- `.devflow/project/product.md`
- `.devflow/project/architecture.md`
- `src/config.js`
- `test/config.test.js`

Work may choose the local function name and factoring. Change only `src/config.js` and
`test/config.test.js`, plus this artifact's `state.md`. Do not change the defaults file or other
runtime modules.

Acceptance:

- the exported default remains `3`;
- positive integer input is accepted;
- zero, negative, fractional, and non-numeric input is rejected before consumer or producer use;
- `node test/config.test.js` exits successfully;
- no unrelated source, configuration, or project document changes.

The result is ready for Verify after the implementation and focused test are committed. There are
no open product, architecture, or design decisions.
