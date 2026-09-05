# Baseline writers and migration policy

## Writers and replacement boundaries

- The capability design-zone writer is Adopt only during its initial unmanaged projection;
  otherwise it is Arch. That writer replaces from file start up to but excluding
  `## Verified state`. Verify replaces from `## Verified state` through end of file. Their
  byte ranges do not overlap. The initialization exception lets the design-zone writer create the
  empty verified scaffold below with an absent file or after the user explicitly chooses to
  reset a zero- or multiple-boundary file. After creation or reset, verify is the sole writer
  that replaces the verified zone. The exact v0.10 migration below is a separate
  content-blind initialization exception.
- Each managed Layer 0 writer projects its owner's existing K headers and carries every
  changed existing locus in the same approval, validation, and commit as that owner document:
  Product for product/K, Design for design/K, and Arch for arch/K. Arch first lands its
  user-confirmed Layer 0 documents, then calculates Design head. It derives every changed
  capability design zone and its changed capability/K loci in memory and presents them as one batch;
  change no capability-document path before the user confirms that batch. After confirmation,
  land the batch through [Capability-design commit](../delivery/commit-and-verification.md#commit-discipline),
  including those capability documents and their K nodes; it is the last commit of that run.
  Deleting the one routed line a
  design-only entry consumes — a `capability note` design line or a `design open item` line —
  is the single exception that rides that commit; no
  other journal change does. When no capability-document or K-node bytes change, ask no
  confirmation question and make no commit. It is a binding decision
  on the integration branch.
- Adopt is the bounded initial-unmanaged exception. It derives the complete approved Layer 0,
  capability design zones, and every owner's K nodes in memory under one confirmation. It
  lands them through [Initial-adoption commits](../delivery/commit-and-verification.md#commit-discipline);
  each K node rides its owner document's commit.
  Architecture `Existing records` in the first commit preserves every source coordinate,
  authority, disposition, and landing owner needed to rederive that second boundary from source.
  There is no managed-state Adopt recovery path. A later explicit Adopt ignores partial bytes,
  rederives from maintained pre-devflow sources, and seeks approval again only while no current
  `.devflow` root or indexed path exists. Once either exists, canonical state owns recovery.
  An interruption after the `product.md` write but before the first commit is an unverified
  dirty boundary: report its exact paths and let the owner commit the exact approved boundary or
  discard it. After the first commit and before second-boundary writes, the now-managed
  baseline-missing state is recovered by Resume routing to Arch; it never reopens Adopt.
- An uncommitted diff from a post-confirmation interrupted write is a capability-design
  commit prefix only when it touches current and final expected capability-document paths
  and their same-stem K paths alone (a rename may delete the old same-numbered path and add
  the final path). In a
  design-only entry, `.devflow/journal.md` is the one exception only when its working bytes
  equal HEAD with exactly one byte-identical occurrence of the routed design line removed.
  It preserves each number-matched existing file's HEAD verified zone, gives each new file the initial
  scaffold below, and gives an exact v0.10 file the mechanical verified-zone transformation below. Use no
  partial bytes as input; regenerate the whole expected set from HEAD and, for a design-only
  entry, recalculate that one design-line deletion before finishing the commit. Any other
  journal change or mismatch is an integrity anomaly. A user-confirmed boundary reset is not
  recovered as a prefix. When one is interrupted after confirmation and before its commit,
  report that diff as an integrity anomaly and let the next run confirm the reset again.
- When a file is absent or the user confirms a boundary reset, the design-zone writer creates both
  zones; verified sections start as
  `None.`, and verification metadata starts with `Verified at: none`, three empty arrays,
  and `Scope head: none`.
- With exactly one fixed boundary, the design-zone writer preserves the heading through end of file
  byte-for-byte and replaces only the design zone. verify preserves the design zone
  byte-for-byte and replaces only the verified zone.
- When the same writer derives identical prose from identical input, preserve the existing
  HEAD bytes. Rephrasing an unchanged fact is a defect. Uncommitted partial-write bytes are
  never input.
- With one valid boundary, the next Arch run heals design-shape damage and the next
  capability closure heals verified-shape damage. Except for the exact v0.10 migration below,
  never auto-heal zero or multiple boundaries. Writer eligibility and begin recovery judge
  the boundary count in the HEAD file; uncommitted working-tree bytes are not an input and
  the write replaces them. Only the report below also states the working-tree count.
  Do not load the whole original into the report. Report its path, the HEAD boundary count
  that selected this route, the working-tree
  boundary count and line count, the HEAD blob object ID for that exact path or `none`, and
  the expected boundary. The HEAD blob identifies provenance; it is not presumed valid.
  resume writes no file and offers only two choices: after confirming that a user-identified
  Git revision and path has one boundary, the user restores those bytes to the damaged
  file's current expected path and commits only that file (restoring to any other path
  leaves two same-numbered files, a format anomaly); or the user discards the old verified
  prose and lets Arch
  reset the whole file from current Layer 0 design plus the empty initial verified scaffold.
  Search no history for a known-good revision. State the data loss and HEAD blob ID before
  confirmation; a reset follows the ordinary design-batch confirmation and commit procedure.
  If the user defers, change no file.

## v0.10 Baseline Migration

Only a HEAD file satisfying every condition below is a known v0.10 predecessor.

- It has zero `## Verified state` headings and, after its H1 and one-line purpose, exactly one
  each of `## Conceptual model`, `## Main flow`, `## Lifecycle`, `## Current behavior`,
  `## Invariants`, `## What we decided not to do`, `## Entrypoints`, `## Traps`,
  `## Verify`, `## Binding ADRs`, and `## Machine block`, in that order.
- Its Machine block has only `Capability number`, `Verified at`, `Covered cards`, `Scope
  paths`, `Scope head`, and `Docs head`; the number equals the filename number, and the
  `Verified at`, `Covered cards`, and `Scope paths` the migration carries parse. The two
  head values the migration discards take no part in this judgment.

Apply this section to no other zero-boundary file. resume labels this shape `legacy v0.10`
and routes it after any active claim or verification transition to Arch regardless of
historical Brownfield origin. Before migration, work and domain entry open no body and use the baseline-missing
projection.

In the ordinary design batch, the design-zone writer derives the design zone anew from current Layer
0 and transforms the verified zone mechanically. Preserve the body bytes of the old Main
flow, Lifecycle, Current behavior, Entrypoints, Traps, and Verify under the corresponding new
H3 headings; insert `None.` for Consumed contracts. Copy the old `Verified at`, `Covered
cards`, and `Scope paths` into verification metadata; add `Consumed paths: []` and `Scope
head: none`; and discard the old `Scope head` and `Docs head`. The old `Scope head` was
calculated from Scope paths alone, so it cannot evidence the new field whose inputs also
include consumed paths. Reverify neither code nor cards and rewrite no verified prose;
therefore the verified statements are hypotheses immediately after migration, and the next
passing capability closure refreshes them from the new inputs.

Show the exact migrating paths and this mechanical transformation with the design batch.
After the user confirms the batch, land it in the same capability-design commit. This gives
This gives the design-zone writer no authority to judge verified content; after migration, verify is again the
verified zone's sole writer.
