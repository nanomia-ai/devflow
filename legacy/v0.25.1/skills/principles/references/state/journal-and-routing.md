# Journal routing and source-resolution lifecycle

**Canonical candidate order** is a selection order among candidates, not a comparison order
for paths or card numbers.

A candidate's **depth-1 unit** is the first path component below `.devflow/tree/`, or the
number on an unopened capability's waiting file.

The **session unit** is the depth-1 unit the user named in the current conversation. The
**carried unit** is the depth-1 unit whose number leads the path in `## Next single step`
of my room's HANDOFF, when such a unit exists.

**Canonical recognition** resolves the current conversation's text to a set of units. A
complete product.md capability name, a standalone number token compared with unit numbers
as integers, and text identifying foundation or a standalone `01` each resolve to that
depth-1 unit. A standalone task-card number resolving to exactly one card resolves to that card and
its unit. A resolution set with exactly one member selects it. For candidate ordering, a
canonical glossary.md term resolves through capability-header `Concepts:` to every matching
unit. When several headers carry the term, return all of them and infer no semantic owner.
When the exact canonical term has no header match, resolve it to its glossary definition and
project-root context instead of a unit. This term route does not change name, number,
foundation, or card recognition. For candidate ordering, a
larger set selects the member the conversation mentioned last; every other consumer takes
a larger set as selecting nothing.

Order: the card the user named; then candidates in the session unit; then candidates in the
carried unit; then the rest. Within a depth-1 unit and among the rest, canonical
card-number order.

Where a matched routing row can be satisfied by more than one unit and the row names no
selection order, take candidates in this order. It never changes which row matches and
never makes an unready card ready. Freshness governs trust in HANDOFF's statements; the carried unit is only an
ordering key and is used even when HANDOFF is stale.

- `core:<path>#<heading>` — the exact section in that core document
- `card:<path>@<hash>` — the exact task card at that commit
- `journal:<whole reserved journal line>` — the canonical on-disk line, including timestamp
- `verify:<path>#Failure history@<source id>` — the Failure history entry carrying that id
- `verify:<path>#<Audit|Retrospective>@<source id>/<finding number>` — that adopted finding
  inside the event carrying that id

A conversation request first becomes a `journal:` source through `maintenance routing pending`.
Resolve every locator to its exact working-tree source. When a valid `routing prepared`
object replaced the referenced verify source's `routing: pending`, resolve the locator with
the same source id and finding number in that object's `base` commit. For any other
uncommitted output transition that changed or deleted the source so the exact value is
absent, resolve the exact source from HEAD. This includes deleting a journal source with its
layer-opening marker and changing a verify source to its final result. Folder-path
placeholders have the `.done` and `.stale` status suffix removed from every path
component. Only a layer-opening marker's `parent` may have zero matching actual folders
before creation; it must have exactly one afterward. Every other folder placeholder must
always match exactly one actual folder. Two or more matches are an integrity anomaly in
either case.

Before creating a layer's first child or folder, land its layer-opening record together
with any uncommitted source record in a `direct — begin <parent>` commit. When one source
spans several depth-1 units, write one layer-opening marker per affected parent, all
carrying the same `source-json` value and landing in one begin commit — that locator is the
bundle's identity, so no separate bundle identifier is created. `<parent>` is then those
parent paths joined with `+` in canonical path order. Land a capability-
closing record together with the passing verify.md record and, when the canonical baseline
predicates' verified-zone refresh succeeds, the closing capability's baseline file, in a
`boundary — begin <capability number>` commit before the folder rename or any other journal
change. The canonical baseline predicates govern a refresh no-op. Both remain active until the
next commit deletes them. If the working tree lacks one but HEAD contains it and its deletion
is uncommitted, a consumer treats it as active and finishes the interrupted commit first.
These begin commits are not task commits.



**A contradiction between documents is a defect, not a precedence question.** Silently
adopt neither side — stop, reconcile through this procedure, then proceed. A delegated
implementer stops and reports only; reconciling is the main session's job.

When two canon rules both apply in one place and point to different actions, that is a
defect in this canon, not a contradiction between documents. Report both source texts,
their coordinates, the side you take, and why, then proceed with that choice. A side taken
without that report leaves the next session free to take the opposite with no one noticing.
When that report is made while a card is claimed, it does not live in the progress log alone —
the progress log is no consumer's input and does not survive the boundary. Land the same
report as one attributed open-item line in journal.md as well.
