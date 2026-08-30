# Verification boundary

Dispatch a clean verifier with only the product criteria or the capability bundle, the
declared channel, and allowed remote-execution pointers. It executes the work-server scene
itself; a missing channel probe, inaccessible pointer, or absent execution result is
`unverified`, never `pass`. The verifier returns only `pass`, `fail`, or `unverified` with
executed evidence and one item per attempted scene, and never reads implementation history,
devflow records, commits, diffs, or progress logs and never repairs code.

The main verify session, not the verifier, owns criterion completion, regression assembly,
recording, integration-branch freshness, and closure. Channel unavailability before a scene
records the exact failed command and observed timeout, creates no failure-history item, and
returns to the person; a restored channel needs a direct new request.
