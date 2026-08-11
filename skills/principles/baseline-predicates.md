# Canonical Capability Knowledge Baseline Predicates

This document defines only the capability-knowledge-baseline predicates shared by verify and
resume. Task-card interpretation follows the Canonical State Predicates read alongside this
companion, and each skill's procedure does not redefine the predicates below.

## Identity

- A baseline file's path is `devflow/project/capabilities/NN-<capability-name-slug>.md`. NN is
  the number of that capability's tree folder at this closure; closure presumes that folder
  exists, so the number is always present on disk.
- The file name is that number, `-`, then the slug, and the number is the text before the
  first `-`. The baselines are every `.md` file directly under
  `devflow/project/capabilities/`; nothing deeper in that folder is a baseline.
- The name slug carries no authority. It may be updated on a rename, and a mismatch is not an
  anomaly. Capability judgment uses the number only.
- There are exactly two format anomalies: a file whose number cannot be parsed because the
  text before the first `-` is not one or more digits or because it has no `-`, and two files
  whose parsed numbers, compared as integers, are equal.

## Document contract

Form governs content: topology is a diagram, a record set is a table, and intent is prose.
Each file has only these 12 sections, in this order.

| # | Section | Form | Cap |
|---|---|---|---|
| 1 | H1 and a one-line purpose | Prose | 2 lines |
| 2 | Conceptual model | Table: concept / what the user gets / identifier / relation | 8 rows |
| 3 | Main flow | mermaid flowchart LR | 9 nodes |
| 4 | Lifecycle | mermaid stateDiagram-v2 — only when illegal transitions exist | 8 states |
| 5 | Current behavior | Table: action / precondition / what the user sees / entrypoint | 10 rows |
| 6 | Invariants | Numbered list, verifiable statements | 8 items |
| 7 | What we decided not to do | Bullets: item — one clause of reason | 5 items |
| 8 | Entrypoints | Table: path / role / where it is entered (the number, for an external capability) | 12 rows |
| 9 | Traps | Table: symptom / reproduction condition / cause / what to do instead, marking an external-system trap `external` | 10 rows |
| 10 | Verify | The list of commands actually run at this closure, as run (scenario prose allowed for a browser channel) | 8 steps |
| 11 | Binding ADRs | Only paths that exist below `devflow/project/decisions/`, and only those the current narrative cites | 5 lines |
| 12 | Machine block (at the very end) | key: value — the Machine block section below | ~8 lines |

- The total cap is ~140 lines, and the first 40 lines are the domain itself. Never copy the
  body of a contract that lives in code or another document; keep only its location and its
  invariants. Leave out anything self-evident.
- Write exactly `None.` in a section with no verified content. Invent nothing without
  evidence.
- Links between domains live in the "where it is entered" column of the Entrypoints table and
  in the external-capability nodes of the flow diagram. No separate section.
- A write over the cap still succeeds. Report one repair-needed line to the user at that
  closure instead. The split signal fires when the same section, or the total cap, is exceeded
  at two consecutive baselines. The preceding baseline is the existing file being
  replaced, and an absent predecessor file means no. When it
  fires, report the possibility of splitting the capability and let the user decide. An
  adopted split is a product.md change through the discovery→update table's feature-scope row.
- Rows marked `external` in the Traps section are excluded from the cap count. Only
  non-external rows count toward the cap and the split signal; when external rows exceed the
  cap, only report a request for a human deletion pass.

## Machine block

The machine block comes at the very end of the file and has six fields, all `key: value`.

```text
Capability number: 02
Verified at: <YYYY-MM-DDTHH:MM:SSZ>
Covered cards: ["02.1","02.2","02.2b"]
Scope paths: ["src/customer/...", ...]
Scope head: <output of the Scope head command>
Docs head: <output of the Docs head command>
```

- Capability number is the number from Identity above, and Verified at is this closure's UTC
  timestamp, an explicit declaration for humans.
- Covered cards holds every non-`.stale.` `.done.` task-card number below that capability's
  tree folder at closure, stored and compared in canonical card-number order.
- Scope paths is the exact path list of the `capability code scope` verify produced for this
  closure.
- **The Scope head command** gives `git log -1 --format=%H --` one `:(literal)` pathspec per
  Scope paths member. Pass each pathspec to the shell as one quoted argument.
- **The Docs head command** is `git log -1 --format=%H -- devflow/project/product.md
  devflow/project/arch.md devflow/project/code-style.md devflow/project/glossary.md
  devflow/project/design.md`. These five paths are fixed, and when design.md does not exist
  that path contributes nothing to the output.
- Both head values must parse as complete Git object IDs. Empty output or a malformed value is
  not a format anomaly; it makes that group of statements a hypothesis.
- A hypothesis is a baseline statement whose freshness was not confirmed. It is a trust state
  of baseline text, a separate concept from the verification iron rule's `unverified` verdict.

## Freshness predicates

The baseline is that capability at its last verification closure. A consumer makes only these
three comparisons.

1. When the Scope head command's output equals `Scope head`, the code statements are fresh.
   When it differs or the output is empty, the code statements are a hypothesis.
2. When the Docs head command's output differs from `Docs head` or its output is empty, the
   product and document statements are a hypothesis.
3. Enumerate the non-`.stale.` `.done.` task-card numbers below that capability's tree folder
   from names alone in canonical card-number order; when that differs from `Covered cards`,
   the whole baseline is a hypothesis.

- The groups map to sections. The code statements are Main flow, Lifecycle, Entrypoints,
  Traps, and Verify; the product and document statements are the one-line purpose,
  Conceptual model, Current behavior, Invariants, and What we decided not to do. The
  Binding ADRs section and the machine block belong to neither group — ADR paths are
  re-checked for existence at wiring, and the machine block is the comparator itself.
- Before using a hypothesis statement in implementation, recheck it at a current authority
  path inside the existing read set and code-search boundary. Do not expand those boundaries.
- work carries these three comparisons as a self-contained paragraph in its own body. That
  paragraph reproduces the predicates above and never defines them differently.
- The baseline is not canonical. Code wins a conflict with it, and a conflict with a binding
  decision follows the canonical Document Hierarchy unchanged. An ADR in the Binding ADRs
  section overrides a binding decision only within the scope that a canonical document
  explicitly delegates to that exact path.

## Refresh at closure

- In a project whose arch.md `capability_baseline` is yes, every capability's capability-layer
  closure refreshes that capability's baseline. Creation and refresh share one name, "refresh"; the
  first refresh is the creation.
- The refresh compares nothing. Read the standard refresh set once and replace the file
  wholesale.
- The standard refresh set is exactly this: the existing baseline at HEAD (absent at a first
  closure — working-tree bytes are never an input), product.md, arch.md, code-style.md,
  glossary.md, journal.md, and design.md when it exists, this closure's `capability code
  scope` (re-derived by verify's Standards current-topology rule when not already in hand),
  the paths in the Binding ADRs section, and the current non-`.stale.` `.done.` cards
  below that capability's tree folder and outside Covered cards, together with those cards'
  direct `Depends` and `Read first` paths.
- Byte stability is a writing instruction, not a predicate: narrative the refresh re-derived
  identically keeps its previous bytes. Rephrasing an unchanged fact is a defect. Previous
  bytes here means the bytes of the baseline at HEAD, not partial working-tree write bytes.
- A conclusion from a `.stale.` card cannot support the current baseline. Retain only content
  reconfirmed from this closure's `capability code scope`.
- Delete a trap or a Verify item only when its reproduction condition has vanished from
  current code. A trap marked `external` is deleted only by a human.
- In multi mode, closure and both head calculations happen on the fetched integration branch.

## Riding the begin commit

- With arch.md `capability_baseline` at `yes`, the `boundary — begin <capability number>`
  commit carries the passing verify.md record, the capability-closing record, and the closing
  capability's baseline file together. With the switch at `no`, none of this section applies.
- The state the canonical verification-state transition specifies for that commit is the
  passing verify.md record, one exact baseline path of the closing capability (absent,
  partial, or any bytes), and — when already created — the capability-closing record; the
  baseline file is regenerated from the standard refresh set before the commit is completed.
- Any other diff under `devflow/project/capabilities/` is an integrity anomaly.
- The baseline lands in that commit and never in the closure operations that follow it.

## The arch.md switch

- The switch is the one arch.md line `capability_baseline: yes | no`. Absent means no.
- The wiring predicate is stated once: it catches a capability only when the switch is yes and
  the baseline file exists. When the switch is no, an existing file is caught by no
  card-creation wiring, no integrity-check item, and no resume listing, and that inactive file
  is not an anomaly.
- Changing the value is a binding decision that lands through the arch row of the
  discovery→update table. no→yes produces baselines from the next closure on, so a capability
  never reopened and closed again never gets one. yes→no deletes no file.

## Durability

- A file with a different section or field set is a hypothesis. The next refresh's wholesale
  replacement heals it, and there is no version field.
- The knowledge layer never blocks the execution axis. When baseline work fails or a format
  anomaly involving the closing capability's number or path is found, report it, write
  nothing, and let closure proceed. Reporting one line to the user at that closure is
  mandatory: `baseline no-op: <reason>`. That report is not durable, and while the cause
  remains the next closure reports the same line again. A format anomaly in another file is
  reported only, and this refresh proceeds.
- Outside the refresh at closure, the only change permitted to a baseline file is a deletion,
  and it lands in a binding-decision commit.
- Derive capability retirement from current product.md and tree state. Neither edit nor rename
  the baseline file.

## Accepted limits

These four limits change none of the predicates above and create no separate check.

- On a shallow clone the boundary commit moves, producing conservative false staleness.
- A very long Scope paths list makes the command hit the command-line length limit.
- An uncommitted working tree is invisible to both head commands.
- When another capability's card changes this capability's behavior through a registry, false
  freshness remains.
