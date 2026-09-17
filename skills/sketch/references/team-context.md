# Bounded member context

A member note supplements and never overrides artifact state, its spec or brief, project canon, or
Git; it may describe bytes that exist only on another branch or worktree. For the selected artifact
key, read only `.devflow/team/*/<artifact-key>.md`, compare each note's coordinates with the current
checkout, and expose disagreement instead of treating the note as shared truth.

Before a hand-off, make state and canon sufficient without the note. If you still hold an actual
local delta since the safe point, an environment-specific detail, or an unconfirmed suspicion the
next actor needs, write or replace your own bounded note; otherwise create none. Name the artifact
key and current branch or worktree, then record only those applicable details. The artifact key is
the opaque Sketch or Work ID; Adoption uses the fixed key `adoption`.

Use a stable slug of repository `git config user.name` as `<member>`. If it is unset or cannot yield
a stable slug, ask the user for one short team label rather than inventing a registry. Add a short
label only when several agents using the same member must keep distinct notes for this artifact.
Do not copy the spec or state, record a verdict, maintain a progress log, or add a pointer from state.
