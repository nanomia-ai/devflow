# Team hand-off precommitted cases

These keys are fixed before fresh sessions. The experiment asks whether the current prose targets
can preserve shared truth without turning a member note into a second state or a coordination
system.

## A. Work session hand-off before a safe point

Agent A inherits one tracked Work artifact and a source delta made after its last safe point. Its
machine also needs one environment-specific command adjustment. The session must end before the
test or next commit, so A must make the hand-off recoverable without finishing the change.

### Answer key

- Shared artifact state must retain `next_route: work`, name the actual last safe point, and state
  one bounded continuation that another Work actor can execute.
- When such private context exists, `team/<member>/<artifact-id>.md` must name the artifact ID and
  branch/worktree and record the actual local delta since the safe point, the environment-specific
  command adjustment, and the unconfirmed suspicion. `<member>` defaults to a stable slug of the
  repository's `git config user.name`; a short label is added only when same-user agents must be
  distinguished. The note must not copy the spec or state, claim a verdict, or become the only home
  of the continuation.
- A snapshot is written because custody may change before the current action finishes; no per-turn
  progress append is required.

## B. Work continuation by another member

Agent B receives only the repository. It must recover the selected artifact, read the bounded
`team/*/<artifact-id>.md` context, and continue from current Git bytes.

### Answer key

- B treats state, spec, Git, and current project canon as shared authority. A member-only suspicion
  is context to verify, not canonical truth and not permission to change the contract.
- B reads only member files for the selected artifact ID. It does not enumerate every team note or
  require a pointer from state.
- If B can continue, its next state replacement records the real safe point and route. If member
  context conflicts with state, spec, or Git, B exposes the inconsistency instead of choosing the
  member note.

## C. Parallel Git integration

Two branches use different opaque artifact IDs and stable code seams. Each also adds a distinct,
non-conflicting script key to the same package manifest. A second pair changes the same canonical
Domain sentence incompatibly.

### Answer key

- The distinct code and manifest additions may merge through ordinary Git without a predeclared
  lock or claim. After merge, the merging actor rereads the touched manifest and any affected
  canonical document.
- Incompatible edits to the same canonical home stop at an explicit merge or decision event even
  if a textual auto-merge would be possible.
- Devflow does not add a central room, global sequence, branch registry, claim file, or identity
  protocol. Artifact IDs and existing Git integration are sufficient.

## D. Closure and orphan recovery

After verified closure, the artifact and all bounded member files disappear. Separately, a dirty
checkout with no active artifact is inspected by Resume.

### Answer key

- Closure removes `.devflow/work/<artifact-id>/` and every
  `.devflow/team/*/<artifact-id>.md`; Git retains history.
- Resume reports dirty bytes without an active artifact as unowned work and routes to a safe
  decision/ownership action. It does not report “nothing in progress,” invent an artifact, or use a
  member note as an active-state registry.

## E. Interrupted Sketch hand-off

An active change Sketch has inspected only part of the evidence required by its current finding.
The actor must stop before the remaining consumer is inspected and has tentative, host-specific
context that the next Sketch actor may need.

### Answer key

- The Sketch state remains the shared custody record with `next_route: sketch`, the real remaining
  evidence action, and the unresolved finding destination; it does not copy the tentative context.
- `team/<member>/<sketch-id>.md` may preserve the host detail and tentative suspicion while naming
  the opaque Sketch ID and current branch/worktree. It cannot become the conclusion or replace the
  brief/state.
- No team note is required on an ordinary completed Sketch route that has no private context left.

## F. Interrupted Adopt hand-off

An active Adoption actor must stop during one bounded source check while custody remains with
Adopt. The source partition and any current project documents own shared evidence; only an
environment-specific obstacle and unconfirmed interpretation need to survive.

### Answer key

- Adoption state keeps `next_route: adopt` and one bounded continuation. Sources, conflicts, and
  project canon keep their existing authority.
- The optional note is `team/<member>/adoption.md`, names the checkout, and carries only the private
  obstacle and tentative interpretation. Another actor must verify it rather than execute it as
  shared truth.
- The hand-off introduces no member registry, room, claim, global sequence, or state pointer.
