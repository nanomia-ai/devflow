# Knowledge-landing execution contract

Use only `marker.knowledge` from the current Decision. It is `none` or a JSON array projected from valid canonical `marker.knowledge-landing` entries. Every entry already passed the shared state tool's owner grammar, exact `writer=arch` check, exact quoted JSON-string decoding, full committed card hash resolution, duplicate-pair check, and owner existence check. If the canonical route is integrity blocking, stop; never repair or reinterpret the raw journal in arch.

For each selected entry:

1. Open the source card at exactly `<source path>@<full hash>` and select the exact supporting line range. Open the entry's exact `owner`; infer no substitute or semantic owner.
2. Decide from the conclusion, not the source length. Update the owner directly when the conclusion is compact and remains understandable there. Use recursive K only when the topic needs independent depth or reuse.
3. A K root is adjacent to its owner in the owner's same-stem folder. A child is adjacent to its parent in the parent's same-stem folder. The `K-NNN-<topic>.md` number is immutable and unique across the entire owner subtree, not merely its immediate folder. Scan that subtree, choose the next unused number, and never renumber. A node with no child is complete and valid.
4. Use `templates/knowledge-node.md`. Its final Source basis is a JSON array whose entries are exact `<repository-relative card path>@<full committed hash>:<start>-<end>` coordinates. The range is mandatory. Do not add Parent, child index, manual index, residual, bundle, or batch metadata.
5. Never create a marker. Never write a K node outside an owner named by a valid writer=arch marker. For several owners, select only the owners whose updates can complete now. Leaving other entries byte-identical is a valid partial landing.
6. Apply the selected owner and/or K updates, delete exactly the selected marker lines, and land those changes in one boundary commit. Marker-only deletion, a write without the matching deletion, and split commits are failures. Reinvoke stage; any residual valid owner marker must remain routed.

Compact, recursive, partial, and mixed multi-owner branches differ only in selected targets. The atomic boundary and source-basis standard never change.
