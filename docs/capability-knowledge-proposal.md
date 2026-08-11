# Capability Knowledge Baseline Proposal — Design Grounds and Rejection Lineage

## Document Status

Status: **Historical record of an adopted design. Not an executable contract.**

The v0.10.0 candidate contract was superseded by the v0.11.0 domain-knowledge-layer
redesign. The current executable contract exists only in
`skills/principles/baseline-predicates.md` and the skills that consume it. No skill executes
this proposal as a procedure or output format. This document preserves only why the
capability knowledge baseline was needed and which alternatives were rejected.

## Design History

- 2026-08-11: combined a GPT draft with three field measurements to form a candidate.
- The same day: independent refutation, research, and literal execution produced candidate
  contract v2.2, first shipped in v0.10.0.
- 2026-08-11: checked the long-term-usability handoff and plan edition 2 again, confirming
  the pre-first-closure document gap, card-wiring dependency, per-project switch, and absent
  domain relations.
- v0.11.0: preserved the grounds but moved the executable contract into one canonical
  companion and redesigned the document around two lifecycles, the design zone and verified
  zone.

## Confirmed Problem

The task tree was strong at representing next work and execution state, but it did not give
a first-time reader one bounded view of a capability's current structure. Conversely,
human-written domain handoffs buried structure under chronology, and hand-written freshness
declarations did not follow real code changes.

Three lines of field evidence agreed.

1. Chronology occupied 60–68% of 12 existing handoffs in jgnote.
2. In ade's G-T2, two documents owned the same domain explanation and conflicted.
3. In rdsf's knowledge-reachability diagnosis, a fact on disk did not exist for the next AI
   when it was outside every skill's read path.

The goal was therefore not to accumulate more long-term memory. It was to leave each
capability's current structure at a bounded size and make it comparable with current
authority. The tree and cards continue to own work progress, assignment, and what comes next.

## Options Considered

| Option | Summary | Judgment |
|---|---|---|
| A | Keep only the task tree and Layer 0 | Sufficient for small linear work, but does not close domain re-entry cost or the pre-first-card gap |
| B | Clean up and keep using the existing handoff | Rejected because it inherits chronology bloat, dual ownership, and manual freshness |
| C | Add a separate baseline per card or component | Rejected because there is no independent verification boundary and read count grows with work size |
| D | Replace one file per capability at capability closure | Adopted in v0.10.0. First design to provide current state, mechanical freshness, and O(1) reading |
| E | Split one file into a Layer 0 design zone and a closure-time verified zone | Adopted in v0.11.0. Preserves D while removing the pre-first-closure gap and card wiring |

E keeps D's file count, chronology ban, current-state focus, and mechanical freshness. It
exposes the different writing times of design statements and code observations through a
fixed byte boundary. arch writes design, adopt does so in a brownfield, and verify writes
verification. The canonical predicates, not this document, own the detailed sections,
fields, and commands.

## Rejection Lineage

- **Expire automatically with time** — time is a proxy, not the cause of drift. Git
  boundaries and card sets measure actual input changes.
- **Continuous or per-task refresh** — rewriting the document for every card creates write
  conflicts and cost. Use only the existing serial boundaries of confirmed design and
  capability closure.
- **Append-only inheritance** — history is an ADR's payload, but current structure is a
  capability document's payload. Append-only growth conflicts with the chronology ban.
- **Assumptions and Open Questions sections** — mix verified observation with plans and
  create a second home for open work.
- **Stored consumer list** — a reverse list becomes stale separately from actual paths.
  Project it when needed from exact paths on the consuming side.
- **Global index** — makes entry into one capability read an index plus a body and opens a
  synchronization path.
- **Automatic glob or whole-folder attachment** — breaks O(1) reading per card and turns a
  `related` judgment into an unbounded search.
- **Symbol binding or a separate hash tool** — harness cost is unjustified until a real
  path-based precision failure is observed.
- **Per-project on/off switch** — small projects need the same lifecycle, and an empty
  section costs one `None.` line. A switch adds branches and migration state to every
  consumer.
- **One seven-field machine block** — collecting both zones' owned fields at EOF makes the
  design writer and verify edit the same bytes. Metadata is physically separated inside
  its owner's zone too.
- **Planned flows and entry points in the design zone** — after first closure, the same
  concept would live in both zones. product.md and arch.md already own planned entry points.

## Confirmed Owner Choices

v0.11.0 fixes four choices.

1. Capability documents are always on in every project.
2. The total cap is about 185 lines, intentionally one order of magnitude smaller than a
   hand-written 1,100–1,700-line handoff.
3. The design zone contains purpose, boundary, concepts, invariants, non-goals, and binding
   ADRs; it does not contain planned flows or entry points.
4. Keep `01-foundation.md`, with its verified zone remaining `None.`. It is the first cut
   candidate if real use provides no value.

Changing one of these choices first requires refuting its recorded ground in
`docs/design.md`.

## Accepted Limits

These limits are intentionally retained.

- A shallow clone and a multi rebase can produce a conservative false hypothesis.
- A very long path set can reach a shell command-line limit.
- An uncommitted working tree is invisible to Git head comparison.
- Relationships that pass through registries or dynamic dispatch can retain false freshness
  when represented only by paths.
- A consumer relation reports current freshness but does not automatically run another
  capability's regression. Promote only after frequent shared changes produce a field signal.

## Conclusion

A capability knowledge baseline is not a long-term-memory store. It is a **bounded entrance
to the current domain**. Design exists before the first task, verified observations are
replaced at closure, and AI finds the document by number and reads it with freshness state.
This document explains that decision; it does not execute it.
