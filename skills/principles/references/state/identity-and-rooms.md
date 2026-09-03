# Identity, rooms, and shared truth

## Identity and Rooms

devflow has one mode. Whether one person or several share the repository, every session
works out of its own room.

Resolve your id before writing to the tree, journal, or a core document
(`.devflow/project/*`), and before landing a tweak commit — read `git config user.name` and `git config user.email` and match
each non-empty value against the `git:` line of each `.devflow/users/*/owner.md`. An empty
value matches nothing, and a value that matches a room's `git:` line while the other
value conflicts with that same line is not a match. Exactly one match is your room. With no room on
disk, propose an id derived from that identity, or ask for one when both values are empty,
and create the room through the joining transition below. With rooms on disk and no match,
show every existing id and ask whether this is a new person or a changed identity: a new
person joins through that same transition, while a changed identity replaces the `git:`
line of the room the user names and creates no room. Whichever skill first writes to the
tree, journal, or a core document does this. A session that cannot resolve an identity, or
cannot put the question to a user (CI, bots), only reads.
ids are lowercase `[a-z0-9]{2,8}`. Names devflow uses (project, tree, users, decisions)
are forbidden; ids are never reused.

Room = `.devflow/users/<id>/` = owner.md + HANDOFF.md + digest.md. owner.md is two lines,
`id: <id>` and `git: <git user.name>, <git user.email>`. digest.md is one line holding the
digest marker, an unabbreviated full commit object ID output by Git or `none`. Write only in
your own room. Rooms are readable by the whole team — write with that premise.

devflow runs only in a Git work tree — claims, approval freshness, integration, and every
undo live in Git. The first skill to run in a folder that is not one proposes `git init`
and stops when the user declines. With `user.name` or `user.email` unset, propose the exact
`git config` line and stop until it is confirmed; Git itself refuses to commit without
them. Every devflow path is relative to the repository root — resolve the root at entry
with `git rev-parse --show-toplevel`. A cwd inside a subfolder never grows a second
devflow there.

**Only `.wip-<my id>.` is my work.** The precondition, full-read, and continuation
rules apply to my claim only. Another's claimed card is read-only reference — never write
a card you have not claimed.
Reassigning a stalled claim = release, then re-claim. Only on the user's explicit
instruction, with 1 journal line (the sanctioned exception to claim inviolability).

**The integration branch.** arch.md's `integration` names the branch where minting,
closure, and binding decisions land. When it names the current branch, or
arch.md is absent, or it carries no `integration` line, **the integration tip is HEAD**, and every
devflow rule that fetches, integrates, pushes, or compares against integration reads the
current branch and runs no network command. When it names another branch, read that
branch's tip, and fetch or push only when that branch tracks a remote — a purely local
integration branch needs no network command. In every ancestor test here, a commit is its
own ancestor.

**Shared truth is the integration branch.** Card status, tree numbers, verify source ids,
`.devflow/journal.md`, capability documents, and binding decisions are judged at the
integration tip. Your own working tree and HEAD hold a transition still in progress, and the
rules below name exactly when to read them. Every worktree of this repository shares one
`.git`, so a commit made in one is visible from another with no fetch and no remote — but
another worktree's HEAD is evidence not yet integrated, never authority: that flow's code
and progress log arrive when it integrates, and no shared-state judgment reads it.
`git worktree list --porcelain` lists this repository's worktrees, and `git worktree prune`
drops one whose folder is gone.

**Publishing a shared transition.** Publishing is the act of landing a transition on
integration, and landing is its result — the two words name one motion. Before
publishing, remember the integration tip's
unabbreviated full commit object ID output by Git. When publishing is rejected, read
integration again; a changed id means the state you judged from is stale, so judge again
from the latest. Classify the rejection by one mechanical test, never by error text, which
varies by locale and Git version. When the integration tip is not an ancestor of the branch
you tried to publish, this is ordinary contention: integrate that tip and retry — three
times at most. When the tip is an ancestor and the publish is still refused, it is a
structural blocker: report the exact cause. After three tries that still find the tip ahead,
report sustained contention; it is not a failure-ladder count. When someone else landed a
claim on the same card first, do not retry — follow the lost-claim rule below. When the
same number was minted for two different cards, that is not claim contention — the minting
rule's mid-insertion (`03.2b`) below handles it. When you cannot publish to integration at
all — another worktree holds it, or permission, protection, or the network blocks it —
these continue: code edits, progress-log checkpoints, tweak commits (the lane's commit is
not a binding decision), and the final task commit (it
belongs to the session's own branch) of a card whose initial claim has already landed on
integration, plus four journal appends and their local commits — `maintenance
routing pending`, `capability note`, attributed open-item and decision lines, `product
re-run pending`. A `capability note` design-form append continues only in its canonical
`<id> <NN.N> wip: capability design note` checkpoint with that exact card and code basis.
Those four are the whole set of journal appends that continue during a
blockade. These wait until integration opens: a new
claim, a new tree number, a new verify source id, a card's `.done.` rename and its
boundary commit, a layer-opening marker (it mints numbers), a `re-split pending` marker
(it lands in one binding-decision commit with the upper-document edit that called for it),
new `evidence-wait` and `evidence-finalizing`
journal lines (their record commit needs a push), `audit requested` and `retrospective requested` lines,
verification-state lines, a `capability closing` marker (it lands in the
`boundary — begin` commit with the passing verify.md record and the refreshed capability
document), consuming (deleting) a canonical journal line, and any
Layer 0 or capability-document change. One exception: when an already-published
`evidence-wait` line passes during the blockade, the final task commit's replacement of
that line with `evidence-finalizing` is not a consumption but a state swap inside that
commit, and it continues on the session's own branch. Report the
exact cause and how to open it the first time it blocks; after that, name in one line each
transition now waiting. The cause is not repeated, and nothing waits unnamed — resume's
report carries the standing count.

**Several hands in one working folder.** Several sessions may carry different cards at the
same time. Change `.devflow/journal.md` by appending — reading it and rewriting it whole
drops the lines another session appended meanwhile. Keep in HANDOFF only values the tree
recomputes: an open decision that needs a person lands as one attributed journal line —
its resolution follows the discovery→update table's open-item row. While another flow is alive, edit the part that changes instead of
rewriting a file whole — whole rewriting is the only edit that silently overwrites another
flow's change. When a completion signal or build fails while this working tree holds
uncommitted paths outside my card's own, report those exact paths before counting the
failure ladder. A worktree is not a safety device; it is the
choice for isolating a build completely.

Before routing, fetch integration and read this shared state at that tip: `.devflow/project/`,
`.devflow/tree/`, `.devflow/journal.md`, and resume's bounded verify projection.
When the integration tip is not an ancestor of the current branch and, at
that tip, journal or any verify.md contains an active marker, an active request or
product-verification line, or an event `pending` or `routing` state, include the integration
tip in the current branch before local claimed work. Checkpoint unrelated uncommitted
changes first. This is state synchronization
and runs even while a card is claimed. Digest diff reading and marker advancement remain
clean-boundary-only.

Apply the following gate (the **open-Git-operation gate**) only when
`git rev-parse --is-inside-work-tree` returns `true`. Otherwise skip the gate and do not initialize Git. Immediately on entry before normal
routing, execution, or any path change, and immediately after an integration rebase or merge
command, product, arch, design, adopt, split, work, verify, and resume check whether `git status` reports an open rebase or merge.
When either is open, stop normal routing and report
the operation kind, current branch or detached HEAD, and every unmerged path. Before the
user decides, change no path and make no commit; even with no unmerged path, ask whether
to continue or abort the existing Git operation. Never abort automatically. To continue,
first present and get confirmation for the exact resolution of each conflict that requires
a semantic choice. Allow only those confirmed conflict-resolution paths and commits Git
makes while continuing the existing operation; write no separate devflow state. After the
open operation disappears, read `git status` again and restart the integrity check at item 1.

Room transitions — joining and departure are each one commit; the upgrade splits three ways:

- Joining: create the room — owner.md, an empty HANDOFF.md, and digest.md holding the marker
  = current HEAD — and land only those three paths as `<id> room — join`. It is a binding
  decision. In a repository with no commit yet, the marker is `none` and the first digest
  starts at the repository's first commit. Past understanding comes
  from the shared documents, not from commit archaeology.
- Upgrading from a version without rooms: arch adds `integration` and `merge` to arch.md, the identity resolution above creates
  the room, and work renames its own bare `.wip.` to `.wip-<id>.` and moves
  `.devflow/HANDOFF.md` into the room. In that same commit, replace with the new path the
  `card-json` of every `evidence-wait` or `evidence-finalizing` line naming the exact path
  that rename changed, preserving its timestamp, checkpoint, and `check-json` byte for
  byte. A bare `.wip.` or a root `.devflow/HANDOFF.md` means
  the upgrade is incomplete — report, confirm the owner with the user, and finish it.
  Never guess.
- Departure: the user declares it. Any remaining member — move any legacy `Open decisions`
  section left in the departed room's HANDOFF into attributed journal lines, release their
  claims, delete the room, 1 journal line. This is the sanctioned exception to both "write
  only in your own room" and claim inviolability.
