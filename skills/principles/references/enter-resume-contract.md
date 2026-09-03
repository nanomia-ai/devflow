# Enter and resume contract

Contract: `principles-entry-classifier/3`.

When Principles is selected, its generated adapter invokes this package's runtime with `enter`,
then requests the `classify` stage. Enter returns only purpose, this contract, and the bounded
local policy index. Explicit stage and role-contract invocations bypass classification. The
classifier judges conversation items only; it does not open project state.

Stateful, status, domain, and project-read-only requests route exactly once to resume. Resume
calls calculateState and uses its structured `route`; the CLI text is compatibility output.
Policy-only questions answer from the bounded policy index. A pure tweak runs only after the
three-question all-no gate and the bounded Git, prepared-route, and target-path preflight.
Mixed or failing items route only those items through normal flow, retain the accepted
interruption scope, then re-enter remaining tweak items without a route loop.
