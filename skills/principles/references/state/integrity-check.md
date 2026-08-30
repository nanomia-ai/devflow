# Integrity policy

## Integrity Check

Run at the gates that open the tree (start of split and resume). A tweak entry opens no
tree, so it is not such a gate — a disk anomaly is caught by the next full session's check.
**Report anomalies — do not fix them.** Auto-correction that misjudges accelerates
corruption. Correct only after user approval.

**Closed-folder projection.** Inside a depth-1 folder carrying `.done`, a machine query
reads only path names and status suffixes and opens no body — that folder's knowledge is
already folded into its capability document. Item 4 therefore judges only task cards
outside such a folder (a re-closure strips the folder's `.done` first, which returns those
cards to it). Items 1, 8, 9, and 13 concern claimed or pending cards, which item 3 already
reports there from the projection alone, so they add nothing. One exception: when an
evidence line names a path inside a closed folder, item 13 judges by that line — a
journal-side judgment that still opens no folder body. Every other item is judged from the projected names and
statuses, and one body inside is opened only when an item reports an anomaly at that exact
path. The same name set serves next-number derivation, the ban on number reuse, locator
resolution, and the `Covered cards` comparison.

1. Does a claimed card carry an `<id>` that matches no `devflow/users/*/owner.md` room
   (an orphan claim — the residue of a departed member or a typo; a bare `.wip.` belongs
   to item 6 and is not counted here)?
2. Are any numbers duplicated?
3. Is there a task card inside a `.done` folder that is neither `.done.` nor `.stale.`?
4. Does each task card's `Depends` parse under the state predicates' canonical or legacy format, with
   exactly one card existing for every dependency number?
5. Does a path referenced by HANDOFF fail to match exactly one existing path when every
   component's status suffix is removed from both sides of the comparison?
6. Is there a bare `.wip.` or a root `devflow/HANDOFF.md` (an ownerless claim, or an incomplete upgrade)?
7. Do two or more owner.md files claim the same git identity?
8. A bare `.wip.` has no claimant, so item 6 covers it and this item skips it. For every
   other currently claimed card, from the current claim commit that created its
   suffix through the integration tip, does a commit changing a same-number status path for
   that card have an author different from the claimant's owner.md git identity? Exempt a
   canonical commit that releases that claim during a user-authorized reassignment,
   departure, or planning transition. Inspect neither pre-claim commits nor earlier claim
   intervals.
9. Does a pending task card omit an `Approval` or `Review` field defined by split, or carry a
   value outside those formats?
10. Is a foundation, capability, or intermediate folder empty with no active
    layer-opening marker?
11. Does a non-capability folder have at least one direct child that is not `.stale.`, all
    such children with a `.done` status, but no `.done` on the folder?
12. Does a journal line led by `layer opening:`,
    `re-split pending:`, `maintenance routing pending:`, `product re-run pending:`,
    `product verification requested`, `product verification running:`,
    `product verification result:`, `capability closing:`, `capability note:`,
    `audit requested:`, `retrospective requested:`, `evidence-wait:`, or
    `evidence-finalizing:` — with or without the canonical timestamp before it — differ from
    the canonical format above; does any `-json` value fail to parse as a JSON string; or
    does a decoded layer-opening `source-json` fail to match one of the locator forms
    above or resolve to exactly one source?
13. Does an `evidence-wait` or `evidence-finalizing` line's decoded card path fail to name
    exactly one claimed card; does its checkpoint hash not exist in this repository or
    name a commit whose message and card path match; or does the last `remote evidence
    check` line in that commit's card progress log have a JSON value different from the
    journal's `check-json`? A committed `evidence-finalizing` path may instead be absent
    when exactly one same-parent `.done.` card has the same number, name, and bytes; that is
    an interrupted canonical claim→done move, so work finishes its boundary. Otherwise
    first finish an uncommitted binding decision that both deletes the line and renames
    that card `.stale.`, then judge again.
14. Does a verify.md section contain a non-positive or duplicate existing `source id`; or
    does an Audit/Retrospective routing entry have a non-positive or duplicate adopted-
    finding number, or a `routing: pending` finding with no number? Does text after
    `routing prepared:` fail to parse as a JSON object or fail the exact keys, value forms,
    base relation, operation forms, applicability, prefix, or scope conditions in Routing
    write order below?
15. Does journal contain two or more active product-verification state kinds together;
    more than one `product verification running` or `product verification result` line;
    or a result line whose product, verification, code, or verdict field differs from the
    corresponding tree-root verify.md field?
An item-12, item-13, item-14, or item-15 anomaly blocks later routing and every tree write. Present the raw line, the
expected format, and the whole proposed replacement to the user. Use in that proposal
only values that parse from the raw line or are uniquely determined on disk; ask for
every other value. After the user confirms the whole replacement, land only that line
replacement in a binding-decision commit and restart the integrity check from item 1. A
`routing prepared` anomaly is the exception: never commit the corrected object alone.
Replace it in the working tree, compare the already-applied operations prefix with the object,
apply the remainder, change verify.md to `result`'s completed state, and finish the one
specified routing commit. If user confirmation cannot recover a missing object value, stop
without guessing an output or rollback.
