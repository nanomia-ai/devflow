# Knowledge-landing execution contract

Use only `marker.knowledge` from the current Decision. It is `none` or a JSON array projected from valid canonical `marker.knowledge-landing` entries. Every entry already passed the shared state tool's owner grammar, accepted provenance writer (`arch` or legacy `adopt`), exact quoted JSON-string decoding, full committed card hash resolution, duplicate-pair check, and owner existence check. The writer records provenance and does not select the current stage: Arch lands both values. If the canonical route is integrity blocking, stop; never repair or reinterpret the raw journal in arch.

For each selected entry:

1. Open the source card at exactly `<source path>@<full hash>` and select the exact supporting line range. Open the entry's exact `owner`; infer no substitute or semantic owner.
2. Decide from the conclusion, not the source length.
3. Preserve one current locus. If the conclusion changes a knowledge unit already owned in this subtree, update that K at its existing path. Only for a new knowledge unit, put a K root beside its owner or a child beside its parent, scan the owner's whole subtree, choose the next unused `K-NNN-<topic>.md` number, and never renumber. A node with no child is complete and valid.
4. Use `templates/knowledge-node.md`. Its final Source basis is a JSON array of exact `<repository-relative path>@<full committed hash>:<start>-<end>` coordinates, including the selected card range. When updating a K, preserve still-supporting coordinates, add the current card range for changed claims, and remove a coordinate only with its prose or after reconfirming that prose from a replacement source. Do not add Parent, child index, manual index, residual, bundle, or batch metadata.
5. Never create a marker. Never write a K node outside an owner named by a valid marker. For several owners, select only the owners whose updates can complete now. Leaving other entries byte-identical is a valid partial landing, and every remaining valid `arch` or `adopt` provenance marker stays owned by this stage on reentry.
6. Apply the selected owner and/or K updates, delete exactly the selected marker lines, and land those changes in one boundary commit. Marker-only deletion, a write without the matching deletion, and direct commits are failures. Reinvoke stage; any residual valid owner marker must remain routed.

Compact, recursive, partial, and mixed multi-owner branches differ only in selected targets. The atomic boundary and source-basis standard never change.
