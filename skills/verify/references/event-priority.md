# Event and repair priority

Before a new verification run, finish the stored product result when one exists. Otherwise
select exactly one current item in canonical order: an event already routing, an awaiting
user decision that the user did not defer, a pending failure route, then the event selection
order. A claimed card, product re-run marker, re-split marker, malformed timestamped journal
line, or unresolved cross-task decision takes its canonical return path instead of starting
new execution.

Preserve canonical path order, role order, source-id ordering, and request timestamps. The
adapter reports current facts from the state tool; it does not choose a route beyond those
recorded priorities.
