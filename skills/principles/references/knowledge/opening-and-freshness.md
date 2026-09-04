# Knowledge opening and freshness policy

### Opening budget — a hard cap

- Within one card's execution, opened capsule bodies total at most 240 lines or 24 KiB.
  Beyond that, open none — report the candidates' first-two-lines projection and the total cost,
  then narrow or obtain explicit approval; explicit approval is this cap's only exit. The
  authoring cap is soft and, symmetrically, the opening cap is hard — the right place for
  hard is reading, not writing. 240 lines/24 KiB is provisional (measured: 112–180 opened
  lines per card in the trial processing); the design backlog records the reopen
  conditions.
- Capsule selection and indexing use machine queries that open no body — project each
  capsule's first two lines only. Do not create a hand-written index
  section in the capability document — a summary living in two places drifts apart.
- The index emits each file's last-changed commit date as `changed` beside its first two lines.
  There is no separate command to run — the tool reads it from git into the projection, and the
  compact projection keeps it. The date is the second
  clue when choosing: picking three capsules out of forty, "this one changed yesterday and that
  one eight months ago" earns its keep. The date is read from git rather than held in the first
  two lines — a field a person or a model fills drifts, and git already holds the same value at
  no authoring or upkeep cost. This value is not a freshness judgment: when the capsule is
  unchanged but the code it describes has moved, this date does not see it.
- The only means of projection, selection, and format checking are the read-only
  `project`, `disputes`, `select`, and `validate` subcommands of the capsule tool
  `scripts/project-knowledge.mjs`. `disputes` is the dispute-only projection: it emits the C
  number, both coordinates, and the source content each coordinate points at, with no body,
  while `project` in the same place emits only the C number — a consumer that must show a
  person both arms calls `disputes`. The tool is `scripts/project-knowledge.mjs` under the
  plugin root two levels above this loaded file; in a runtime
  that sets `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_ROOT}/scripts/project-knowledge.mjs`
  is a shortcut to the same place. When the platform gives this file no source path, report
  in one line that the tool cannot be called and open no capsule body. Sessions write capsule files themselves, and a capsule must
  pass `validate` before its commit. The tool is stateless and read-only; it owns its
  judgment internals and this document does not restate them.
- **Call the index projection narrowed to one capability** — `project --capability <number>`
  is the canonical call. An unfiltered `project` gathers every capability's first two lines at once
  and overruns the index budget. The index carries a 24 KiB cap too, kept in two tiers: the
  full projection when it fits (`form=full`), and otherwise an automatic downgrade to a
  compact projection that drops what choosing never reads and keeps the path and the first
  line (`form=compact` — measured: one capability's 100 capsules fit compact in 21 KB
  and all 100 are emitted). When even compact overruns, it reports zero entries and the
  filters to narrow by. When several capabilities must be seen, call once per capability and
  report the total to the person the same way the opening budget is reported.

## Metadata and freshness

Design metadata is the end of the design zone, before `## Verified state`.

```text
Capability number: 02
Design head: <output of the Design head command>
```

Verification metadata is the end of the file.

```text
Verified at: <YYYY-MM-DDTHH:MM:SSZ | none>
Covered cards: ["02.1","02.2","02.2b"]
Scope paths: ["src/payment/...", ...]
Consumed paths: ["src/customer/contract.ts", ...]
Scope head: <output of the Scope head command | none>
```

- `Capability number` equals the filename number. Adopt owns `Design head` only in its initial
  unmanaged projection; Arch owns it after the project becomes managed. Verify owns
  the other five fields.
- `Covered cards` holds every non-`.stale.` `.done.` task-card number below the capability
  folder, without duplicates and in canonical card-number order. It is empty for the
  foundation and at initial creation.
- `Scope paths` stores the duplicate-free exact `capability code scope` produced by verify's
  Standards gate in canonical path order. `Consumed paths` stores, in the same order, the
  exact paths where that trace stopped at another capability boundary. Consumed paths do
  not expand the capability code scope, Standards gate, or Audit scope.
- The **Design head command** is the following single line. Those three paths are the only
  sources for `Design head`.

  ```text
  git log -1 --format=%H -- .devflow/project/product.md .devflow/project/arch.md .devflow/project/glossary.md
  ```
- The **Scope head command** takes the duplicate-free union of `Scope paths ∪ Consumed
  paths` in canonical path order, turns each member into one `:(literal)` pathspec, passes
  each as one shell-quoted argument to `git log -1 --format=%H --`, and runs it. If the
  union is empty, do not run the command and store `Scope head: none`. Never run
  pathless `git log -1`.
- When not `none`, each head must be an unabbreviated complete commit object ID output by
  Git. Empty output or a malformed value is not a filename format anomaly; it makes that
  statement group a hypothesis.

A consumer makes only three comparisons.

1. When the Design head command output equals stored `Design head`, the design statements
   in sections 1–5 are fresh. When it differs or is empty, they are hypotheses.
2. When the union is nonempty, the Scope head command output equals stored `Scope head`,
   the exact-path set in Consumed contracts equals `Consumed paths`, and every
   provider disk NN equals the provider currently mapped by arch.md's Code structure,
   the verified statements in sections 8–14 are fresh under this comparison. When the union
   is empty, the output differs or is empty, or either the path sets or provider mapping
   differ or are ambiguous, they are hypotheses.
3. When the current non-`.stale.` `.done.` card-number set differs from `Covered cards`,
   the verified statements are hypotheses. They are hypotheses too while any non-`.stale.`
   card below that folder lacks a `.done` status. With no capability folder, the current set is
   empty. When `Covered cards` is absent or does not parse as a JSON array, the verified
   statements are hypotheses and the complement consumers use is every current
   non-`.stale.` `.done.` card — never the empty set.

Only the current design-zone writer — Adopt during initial unmanaged projection,
otherwise Arch — updates the Binding ADRs list. `Verified at: none` makes the verified statements hypotheses. Binding ADRs are outside
both statement groups; a consumer checks each exact path when reading it. Metadata is the
comparison itself. The symmetric difference between the current completed-card set and
`Covered cards` is the completed-card change list since the baseline. For a current-only
number use its current filename; for a stored-only number use its one current same-numbered
path and status, `<number> missing` when none exists, or `<number> ambiguous` when multiple
exist. Do not add a chronology section.

A hypothesis is the trust state of baseline prose, separate from the verification result
`unverified`. Before use, reconfirm a design hypothesis at the exact current authority
section in product.md, arch.md, or glossary.md, or at an already-open exact path named by
that zone's valid Binding ADRs; reconfirm a verified hypothesis in current
code or cards inside the existing read set and code-search boundary, which for
reconfirmation alone also holds `Consumed paths`. Expand neither further, and neither
addition widens the Standards gate or the Audit scope. A
baseline is not canonical. Current code wins a code conflict; a binding-decision conflict
follows the canonical Document Hierarchy.
