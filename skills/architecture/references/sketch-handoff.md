# Sketch conclusion hand-off

Open this module only when Sketch is publishing a decision-ready conclusion or the current target is
the `next_route` named by a readable Sketch state. This contract lets the sender and receiver share
one custody boundary; it does not make every Devflow route a fixed lifecycle.

A finding remains in `unresolved_findings` until its conclusion is absorbed into the named canonical
home. Its `landing_condition` says when it is ready to hand off, not when it may be removed. Sketch
publishes exactly one ready item at a time by setting its destination as `next_route` and naming the
finding, conclusion, and canonical destination in `next_action`. It keeps the artifact and every
other item unchanged and does not write the destination document.

The receiving actor first confirms that the state names its own route, the selected finding meets
its landing condition, and the destination is within that target's ownership. It reads the brief,
state, the selected finding body when one exists, and only the canonical documents needed for that
landing. If the conclusion is not ready, conflicts with current evidence, or belongs to another
owner, it does not change canon or delete the artifact; it returns custody to `sketch` with one
bounded question or evidence action, or to `user` when only a binding choice can resolve it.

After publishing the conclusion in the destination's own current terms, the receiver removes that
one item from `unresolved_findings`. If items remain, it publishes `sketch` and one evidence action
for an item that is not ready, or the destination and landing action for one that is already ready.
After the final landing, it removes the Sketch directory and every bounded
`.devflow/team/*/<artifact-id>.md` note. It never copies the research narrative into canon, lands one
conclusion in several homes, advances custody before the canonical write succeeds, or deletes the
artifact while any item remains.
