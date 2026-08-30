# Status and tweak policy

## Status Notation

**A filename's status suffix is the source of truth for task state; the claimed card's
progress log is the only record of progress inside that task.** Never put task progress
in product, arch, design, code-style, or glossary. journal may contain only cross-task
decisions, open items a person must decide, and lines whose exact formats the canonical
rules define; it never records task progress or approval. verify.md may record
verdicts, failure routing, Audit and Retrospective event states, findings, and user
decisions. These records do not directly change card or folder status. A task card's
`.done.` evidence is its completion signal and applicable review; a capability folder's
`.done` evidence is verify's capability-layer pass verdict.

- No suffix = pending / `.wip.` = in progress / `.done.` = complete / `.stale.` =
  invalidated by an upper-level decision change, or a tombstone a canonical procedure
  left behind (recall)
- A claim is written `.wip-<id>.` — a bare `.wip.` is an ownerless claim = an
  integrity anomaly. Release strips the whole suffix back to pending (the progress log
  stays in the card). `.done.` and `.stale.` stay unattributed — completion's ownership
  is git's memory
- A person may hold several claims. One card is carried by one session at a time: disk cannot tell terminals apart,
  so never directing two terminals at one card is the user's part
- `.done.` **only after the completion signal passes, the review that applies to the card
  passes, and the commit lands.** In this system, "verification" is reserved for verify's
  capability and product layers
- A folder that is not a capability receives `.done` when it has at least one direct child
  that is not `.stale.`, and every such child has a `.done` status. `.stale.` task cards
  remain as history but are excluded from active-child counts and closure judgment.
  **A depth-1 capability folder receives it
  only after capability-layer verification** — verify grants it. The foundation folder
  (01) is not a capability: it closes with no scenario rite under the same condition
- Tree numbers are assigned once: foundation is `01`; capabilities receive `02`, `03`, …
  in product.md's capability-list order at first root opening. A capability not yet holding a number on disk
  derives it from its product.md list position — the first capability is 02, and a retired
  row keeps its place and counts. Once a folder, waiting file, or baseline holds a number,
  disk is the sole authority. At the tree root, a `.md` is a
  waiting capability file, not a task card, when its name equals a non-retired product.md
  capability's name and its number is that assigned tree number. Its body is the single
  line `# <number> <capability name>`; it has no `Approval`, `Review`, or completion signal.
  When opening the capability, split turns this file into the same-numbered, same-named
  folder and creates its direct task cards
- A retired capability gets `.stale` when it is an opened folder, or `.stale.md` when it
  is an unopened waiting file. Every card status inside an opened retired folder is void.
  The hook and the integrity check do not count inside `.stale` folders
- File base names and numbers are immutable identifiers. No renumbering, no reuse. A
  capability's number is likewise immutable; only the name half of its product.md row, its
  tree folder or waiting file, and its baseline file changes, and only together through the
  discovery→update row above. Mid-insertions use the `02.2b` form
- Record files that are not cards (`verify.md`, etc.) carry no status suffix and are
  excluded from status judgment

## The Tweak Lane

The unit of judgment is the item — a request carrying several items judges each against
the three questions separately. The three questions apply only to an item that requests a
change to the repository's artifacts — an item that changes nothing (a question, an
explanation, a status check) is not a tweak item even when all three come out "no"; it
belongs to the normal procedure: a session with nothing to change finds no edit to make,
no check to run, and no commit to land in this lane. An item is a tweak only when all
three answer "no" — any
uncertainty means it
is not one: ① does it change a precondition-to-outcome transition the user sees; ② does it
produce a design decision, or conflict with an existing decision, design token, or ADR;
③ does it leave a trap the next worker must know about.
The three questions are judged from the request itself and the documents this lane
reads — do not search beyond them to manufacture uncertainty. A conflict already visible
in this session's context is not searched-for, though — a visible conflict answers ②
"yes". When no transition change,
conflict, or trap shows there, the answer is "no".
An item that passed the gate is written into no journal line — this lane handles it inside
the conversation that carries it, and a maintenance record line holds only the items that
failed the gate. A recorded request line is consumed whole by the card planning commit, so
a passing item mixed into that line would be consumed with neither a card nor a record and
vanish without trace on interruption.
A tweak's diff is its complete record. So it runs with no card, no journal line, and no
review. This lane presupposes a repository devflow has entered — with no `devflow/` at the
repository root, do not tweak: the lane would plant a room in a repository that never
chose adoption, so the no-tree exception's adoption question comes first.
First confirm by machine that this lane's commit has a safe place to land:

- When `git symbolic-ref -q HEAD` is empty (a nameless HEAD), do not proceed — report that
  fact and the branch selection or creation choices. A tweak commit rides no integration
  boundary, so a commit on a nameless HEAD lands in no branch and survives only in the
  reflog.
- When any verify.md in the working tree contains `routing prepared`, do not proceed —
  judge no item this lane holds as passing and hand those items to the normal path (that
  transition finishes first, and the request-recording row receives them). That transition
  is pinned to a base commit id, so one tweak
  commit advancing HEAD turns a recoverable state into an integrity anomaly.
- When the readable integration tip is not an ancestor of HEAD, the disposition is the
  same — judge no item this lane holds as passing and hand those items to the normal path.
  The readable integration tip is the tip the integration rule above reads without a
  network command — for a remote-tracking branch, the local ref as last fetched; when no
  tip can be read at all, hand off the same way. A "no" reached from a stale checkout's
  documents produces a commit that conflicts with a decision already landed on integration.

When the checks pass, declare "handling as a tweak — <item>" in one line (the
conversational request is
the approval), read the existing product.md, arch.md, design.md, and code-style.md — and,
when the item could touch a name or term (user-visible wording, identifiers, messages —
anything that carries a name), the existing glossary.md too: term decisions live only
there, and nearby code shows the current spelling without marking it as a decision; when
unsure whether the item touches one, read it (it is a small document, one term per
line) —, and make
the change. Immediately before editing, look at each target path's uncommitted changes:
changes this session made for a claimed card land first as that card's wip checkpoint.
This session's edits that a flipped item left in the
working tree are that request's card's share: back them out before this lane's commit
and reapply them to the working tree after (a commit records the file's whole content —
a sibling tweak item's edits in the same bundle are not these, and ride this commit).
And for changes this session did not make, do not guess their owner — report that path
and change and
follow the user's decision. A Git commit records a path's final content without
telling changes apart by author, so another flow's changes left in the same file ride the
tweak commit as they are. After the change, run the one narrowest executable check that
covers the changed files — their
tests when they have them, otherwise lint or build. When the check fails, repair it
within the item until it passes — and when what the failure reveals flips one of the
three questions, the switch rule below applies. Then, immediately before committing,
compare the target paths' diff against the changes made for the items this commit
bundles — when content
outside them shows, do not commit: back my edits out, reapply them after the other flow
has
committed, and say on the spot that I stepped back. When the user confirms those changes
as a dead session's leftovers that no live flow owns, take them over or discard them by
the user's decision and proceed. The side that steps back is fixed as the tweak side, so
no mutual wait arises.
Then land a single
`<id> tweak <unit number>: <what>` commit. Resolve `<id>` by the Identity and Rooms
rules — with no room, the joining transition creates one, and that room commit is the
sanctioned exception to this lane's no-devflow-path rule (it is the product of identity,
not of the request). Creating a room is a binding decision, so it cannot land during a
blockade — a roomless session does not tweak then; it reports the exact cause. The unit
number is the depth-1 unit canonical recognition resolves when applied to that item's own
text — not to the whole conversation: a conversation whose two items each name a different
unit resolves to a set of two, which selects no unit — or `01` when none resolves.
Several tweak items in one request bundle into one commit per depth-1 unit. Beyond that,
no `devflow/` path
is touched — the moment one would be needed, the item is not a tweak. This lane is not
routing — the pre-routing integration read and state restoration do not apply here (the
machine checks above are not restoration but this commit's landing preconditions). When
any of the
three questions flips to "yes" after the declaration — in any phase: the reads, the
change, or the check —
stop, report, and switch to the ordinary path
(starting with the request's journal record) — the edits made so far stay in the working
tree, and the session that claims that request's card takes them over with the user's
confirmation (resume's report of uncommitted paths is what surfaces them). A discovery
during tweak work follows
the discovery→update table regardless of change size. The commit is not a binding
decision — a blockade does not block this lane.
