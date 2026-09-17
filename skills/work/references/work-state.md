# Work artifact state contract

`spec.md` owns the current outcome, non-goals, acceptance, `read_first`, and write boundary. Git
owns actual revisions and bytes. `state.md` owns only the current recoverable coordinate and
custody hand-off.

Keep one current snapshot block with these fields:

```yaml
base_revision: <revision from which this Work contract starts>
last_safe_point: <committed revision and optional one-line meaning; omit until one exists>
next_route: <a route allowed by project-gate.md>
next_action: <one bounded action>
blockers: []
knowledge_candidates: []
pending_landings: []
```

`base_revision`, `next_route`, `next_action`, and `blockers` are required. `last_safe_point`,
`knowledge_candidates`, and `pending_landings` are optional; omission means no value is currently
recorded. A safe point names a commit or current `HEAD`, never uncommitted bytes. Replace the small
document as a whole, including a `summary` and `read_when` that describe the new current snapshot;
do not leave the prior route in its header. Do not append progress, attempts, transcripts, verdict
copies, or sibling-path pointers.

Custody belongs to the actor for the last published `next_route`. Only that actor writes the
snapshot. Before custody can change, publish the latest safe point and next action; an actor
reviving an inactive artifact takes custody when it writes the reconciled snapshot. If custody or
the Git basis is ambiguous, do not overwrite it and route to `user`.

Add a `knowledge_candidate` only when implementation or verification exposes a durable current
fact worth judging for canon. Add a `pending_landing` only after that fact is confirmed and pair it
with its one canonical project path. Code paths, artifact dependencies, observations, and verdicts
are not landings.

Do not treat a Work contract as current when state is unreadable, a required field or sibling is
missing, the spec lacks outcome, acceptance, or write boundary, or spec, state, and Git disagree.
Stop and expose the inconsistency to the recovery or decision route instead of guessing through it.

A spec may guide implementation but cannot reassign state, custody, evidence, landing, closure, or
verification ownership. A local method suggestion is non-binding inside the write boundary. If a
spec clause conflicts with those ownership boundaries or with acceptance or write scope, finish
only to the last safe point, publish `next_route: direct`, and name the clause and decision needed
for a whole-file amendment.
