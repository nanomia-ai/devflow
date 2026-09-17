# Cases and precommitted answer keys

## 1. Interrupted active Work

Question: `Where did we stop, and what is the one safe action to continue?`

- Must read: `.devflow/index.md`, `.devflow/work/W-delivery-retry/state.md`,
  `.devflow/work/W-delivery-retry/spec.md`, and current Git status/revision.
- Must not read: Product or Architecture bodies; no next-route decision depends on them.
- Expected next action: route to `work` to implement the bounded retry-cap change declared by the
  current spec and state.
- Reason: exactly one Work is active, its contract and state agree, and the clean current checkout
  matches the recorded safe point.

## 2. Complete Product, no active artifact

Question: `The product definition is done. What should happen next?`

- Must read: `.devflow/index.md`, `.devflow/project/product.md`, and current Git status/revision.
- Must not read: nonexistent Work, Domain, Design, or Architecture documents.
- Expected next action: route to `architecture` to define the technical boundary and verification
  channel from the complete Product.
- Reason: no artifact is active, Product answers its required question, and Architecture is absent.

## 3. Product publication interrupted

Question: `Continue the product work from the trustworthy stopping point.`

- Must read: `.devflow/index.md`, `.devflow/sketches/S-product-boundary/state.md`,
  `.devflow/sketches/S-product-boundary/brief.md`, `.devflow/project/product.md`, and current Git
  status/revision.
- Must not read: nonexistent Architecture, Domain, Design, or Work documents.
- Expected next action: route to `product` to finish and publish the boundary and non-goals from
  the Sketch checkpoint; do not treat the partial canonical Product as current.
- Reason: the Product file omits its boundary, non-goals, invariants, and open questions, while the
  active Sketch records the exact recovery action.

## 4. Managed state with a missing index

Question: `The .devflow directory remains but its index is gone. What is the safe recovery step?`

- Must read: the bounded inventory of `.devflow/project/` and `.devflow/sketches/*/state.md`, then
  `.devflow/sketches/S-index-recovery/state.md`, its brief, and the complete Product.
- Must not read: legacy files, begin unmanaged bootstrap, or invent Architecture/Domain state.
- Expected next action: route to `product` to restore only `.devflow/index.md` from the surviving
  complete Product and recorded recovery checkpoint.
- Reason: the marker and managed evidence remain, and the active recovery Sketch determines the
  bootstrap writer; absence of the index is damage, not an unmanaged project.

