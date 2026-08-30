# Audit event lifecycle

Select an Audit only at its clean fetched-integration boundary: no staged, unstaged, or
untracked non-devflow path. A user request remains recorded when that boundary or a uniquely
resolved current scope is unavailable; an automatic candidate is skipped. A pending event
with unresolved scope becomes the canonical explicit `not run` result, not a verdict or an
invented finding.

Create its pending entry and commit before dispatch, retain it across interruption, record
zero findings as a completed zero-adoption result, and route only user-adopted numbered
findings one at a time through the canonical route. Audit never blocks a verification verdict
or state transition.
