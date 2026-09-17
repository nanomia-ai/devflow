# Project gate and route vocabulary

Apply this gate before any target-specific action. Folder presence alone never proves that a
project is ready.

- If `.devflow/` does not exist, only `sketch`, `product`, or `adopt` may write. Every managed-only
  target stops before writing and names the eligible entry that matches the user's intent.
- If `.devflow/` exists but `index.md` is missing or unreadable, do not initialize over it.
  `resume` inventories the bounded surviving project and artifact state and reports the writer that
  can recover the index. Every other target makes no change and routes to `resume`.
- With an index and only an active Sketch, `sketch`, `product`, and `adopt` may write; `resume` may
  inspect. `direct`, `work`, and `verify` are not eligible.
- With a complete Product but no complete Architecture, Product, Architecture, optional Design,
  Sketch, Adopt, and read-only Resume are eligible. `direct`, `work`, and `verify` are not.
- With complete Product and Architecture, any required Design ready, and Adoption closed, every
  target is eligible; `work` and `verify` additionally require a valid Work contract.
- While `.devflow/adoption/` exists, `adopt` and the decision route needed to resolve a conflict are
  the default. Tracked change work is eligible only inside a boundary whose maintained sources are
  dispositioned, required canon is self-contained, and relevant contradictions are closed.

Derive readiness from document content and the index rules, never from path existence alone. Read
the index first when it is usable; it owns project-specific routing, not a global lifecycle.

A coordination state's `next_route` is exactly one of `sketch`, `adopt`, `product`, `architecture`,
`design`, `direct`, `work`, `verify`, or `user`. `resume` is an entry and recovery report, not a
persisted custody route.
