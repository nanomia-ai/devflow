# Capability closure

Only a capability `pass` reaches Standards and Provisional. Build the code scope from
current topology, stop at uniquely identified capability boundaries, retain consumed paths
separately, and route an unresolved scope or unmet standards/provisional proof as
`unverified` rather than closing. The verifier verdict is not rewritten by these gates.

Closure uses the canonical begin-prefix, baseline refresh, journal sweep, and residual-owner
rules. A marker or record is reusable only with current revision inputs and a clean relevant
working state; malformed, partial, or foreign state is an integrity route, not a fact the
adapter may infer. Carry and consumer observations may inform the main-session report but
do not become verifier verdicts.
