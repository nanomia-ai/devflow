# Canonical Capability Knowledge Baseline Predicates

This document defines only the disk contract and bounded projections for capability
knowledge baselines. Arch, initial-unmanaged Adopt, and Verify read this canon directly; Resume opens only
the `Writers and replacement boundaries` section, and work, reviewer, and retrospector
receive only their required projections in their own contracts.
Each skill owns its execution procedure and does not redefine this contract. Capability
knowledge baselines are always on; there is no per-project switch.

## Identity and expected set

- There is one baseline per depth-1 tree unit. The foundation uses
  `.devflow/project/capabilities/01-foundation.md`; a capability uses
  `.devflow/project/capabilities/NN-<capability-name>.md`. Only `.md` files directly
  below that folder are baselines; deeper paths are not.
- The foundation number is `01`. A capability uses the number on a same-numbered tree
  folder, waiting file, or existing baseline when one exists. Different numbers claimed by
  two or more of those paths are a format anomaly. When no disk path has a number yet,
  derive it from the capability's position in the product.md capability list. The first
  capability is `02`, and retired rows keep their positions and count. A subfolder in the
  same folder whose name equals a capability document's filename is that number's knowledge
  capsule folder — the "Domain knowledge capsules" section below owns its contract.
- A filename is the number, `-`, then the name suffix. When a tree folder or waiting file
  exists, use its text after the number unchanged. Before either exists, use the product.md
  capability name exactly as direct would use it in the tree; invent no separate slug
  normalization. The name suffix has no authority; every judgment and automatic entry uses
  the string before the first `-`.
- Filename format anomalies are a file with no `-` or with a pre-`-` value that is not one
  or more digits, and two or more files whose numbers compare equal as integers. A name
  mismatch is not a format anomaly.
- The expected set is the foundation plus every non-retired capability number in
  product.md. A retired capability's file leaves this set but is neither deleted nor
  renamed.
- For initial creation, absent means no same-numbered baseline in HEAD. A file present in
  HEAD but absent from the working tree is recovery, not creation. Working-tree bytes with
  no HEAD counterpart have nothing to preserve, so the creation replaces them.

## Document contract and zone boundary

Form governs content. Each file contains exactly one `## Verified state` H2 heading. The
bytes before it are the **design zone**; the heading through end of file is the **verified
zone**. When the fixed heading is absent or appears more than once, neither writer guesses
the boundary.

| # | Section | Zone | Form | Cap | Exclude |
|---|---|---|---|---|---|
| 1 | H1 · purpose · boundary · concept index · trust notice | design | fixed 5 lines: `# <number> <name>` · purpose · boundary · concepts · trust | 5 lines | relative claims (`latest`, `most current`) · term definitions |
| 2 | Intent overview | design | free prose: what we set out to build · why this shape and which directions were dropped · what failures taught | soft | code details, chronology, card states |
| 3 | Concept model | design | table: concept / what the user gets / identifier / relation | soft | code fields, types, signatures |
| 4 | Invariants | design | numbered list of falsifiable statements | soft | rules equally true of other capabilities |
| 5 | Non-goals | design | bullet: item — one-clause reason | soft | things merely not built yet |
| 6 | Binding ADRs | design | exact paths under `.devflow/project/decisions/` of the legacy ADRs this capability document's design statements actually cite | soft | uncited paths and superseded records |
| 7 | Design metadata | design | the two `key: value` fields below | 2 fields | every other field |
| — | `## Verified state` | boundary | fixed H2 heading | 1 line | — |
| 8 | Main flow | verified | mermaid flowchart LR | soft | unimplemented paths |
| 9 | Lifecycle | verified | mermaid stateDiagram-v2, only when illegal transitions exist | soft | state sets with only legal transitions |
| 10 | Current behavior | verified | table: action / precondition / what the user sees / entrypoint | soft | planned behavior and display-only wording changes |
| 11 | Entrypoints | verified | table: exact path / role / entered from | soft | a whole “related” folder |
| 12 | Consumed contracts | verified | table: exact path / other capability number / expectation | soft | anything this capability does not consume directly |
| 13 | Traps | verified | table: symptom / reproduction condition / cause / use instead | soft | universal development knowledge |
| 14 | Verify | verified | commands and scenarios actually run at this closure, verbatim | soft | accumulated past passes |
| 15 | Verification metadata | verified | the five `key: value` fields below, at end of file | 5 fields | every other field |

`soft` in the Cap column means no per-section row count is contract — the total cap and
over-cap reporting govern, and only the form contracts (fixed 5 lines, 1 boundary line,
2 fields, 5 fields) are hard. The Intent overview is the unconditional reach point for
intent that runs through the whole capability — capsules open only on demand, so judgment
criteria, dropped directions, and lessons from failure that every card must reach live
only here.

The deployed section headings are exactly `## Intent`, `## Concept model`, `## Invariants`,
`## Non-goals`, `## Binding ADRs`, `## Design metadata`, `## Verified state`,
`### Main flow`, `### Lifecycle`, `### Current behavior`, `### Entrypoints`,
`### Consumed contracts`, `### Traps`, `### Verify`, `### Verification metadata`, in that
order. The four keys below the H1 are `Purpose`, `Boundary`, `Concepts`, and `Trust`.

The deployed first 5 lines are exactly:

```text
# <NN> <product.md capability name>
Purpose: <why it exists and what it implements, one line>
Boundary: owns <owned scope>; does not own <neighbor capability number and name, or none>
Concepts: <JSON array of exact glossary terms | none>
Trust: design reflects confirmed Layer 0; verified state reflects the last passing capability verification, or contains no evidence before one. Judge each zone by its metadata.
```

`Concepts:` is a bounded, one-line discovery index. Include only canonical glossary.md
terms that materially help locate this capability; exhaustive tagging is not required.
A term may occur in more than one capability header. A project-wide term may occur in none.
Definitions live only in glossary.md: this line creates neither a definition nor semantic
ownership. Use the honest `none` form when no domain term applies.

- The total cap is about 185 lines. An
  over-cap write succeeds; its writer reports the section and actual row, node, or step
  count. Splitting a capability is a user decision about a product change, not an automatic
  result. What moves down into a capsule beyond this budget is only design-zone domain
  knowledge, which initial-unmanaged Adopt or managed-state Arch owns — it is not cut but lowered into the same-number
  capsule. verify writes the fixed verified-zone sections as it normally does, creates no
  capsule and drops no verified fact to meet this cap, and reports whole-document overage.
- Purpose, ownership boundary, and discovery concepts must be readable in the first 5 lines, followed by the
  sections in the order above; in `Concept model`, order concepts from most central. Do not
  copy a contract body from code or another document; retain its exact location and only
  invariants specific to this capability.
- Write exactly `None.` in a section with no admissible evidence-backed content. Invent
  nothing without evidence.
- A Current behavior row exists only when one user action changes an externally observable
  precondition-to-outcome transition. Exclude changes to a button name, wording, or layout
  when the precondition and outcome stay the same.
- An Invariant must have a counterexample observable through a completion signal or an exact
  authority path. A Trap requires all four cells: symptom, reproduction condition, cause,
  and alternative. Mark an external-system trap `external`; its cause cell holds the exact
  source URL, or, when the behavior is undocumented, the number of the card that observed it
  together with the reproduction condition.
- An `external` row is non-binding evidence. work does not open its URL automatically and it
  cannot overturn a binding decision; only a person authorizes its deletion. Elsewhere a person may delete
  only a complete body row, item, or diagram node; additions remain with the writer skills.
  The H1 and first four fields, fixed section headings, diagram fences and direction
  declarations, and metadata fields are not deletion-exception targets.
  Do not use this exception for the last admissible body item in a section; route to that
  zone's writer so it can replace the section body with `None.`.
  A user-confirmed deletion exception changes no path and has a diff with zero added lines.
  The system neither commits it automatically nor mixes it with another change; added lines
  or a path move make it something other than a deletion exception.
  The person making a direct deletion commits that deletion alone before the next devflow
  skill runs.
- Never record chronology, current card status, progress, assignee, or next work. The tree,
  card progress log, commits, HANDOFF, and journal own those facts respectively.
