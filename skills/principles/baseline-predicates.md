# Canonical Capability Knowledge Baseline Predicates

This document defines only the disk contract and bounded projections for capability
knowledge baselines. arch, adopt, verify, and resume read this canon directly; work,
reviewer, and retrospector receive only their required projections in their own contracts.
Each skill owns its execution procedure and does not redefine this contract. Capability
knowledge baselines are always on; there is no per-project switch.

## Identity and expected set

- There is one baseline per depth-1 tree unit. The foundation uses
  `devflow/project/capabilities/01-foundation.md`; a capability uses
  `devflow/project/capabilities/NN-<capability-name-slug>.md`. Only `.md` files directly
  below that folder are baselines; deeper paths are not.
- The foundation number is `01`. A capability uses the number on a same-numbered tree
  folder, waiting file, or existing baseline when one exists. Different numbers claimed by
  two or more of those paths are a format anomaly. When no disk path has a number yet,
  derive it from the capability's position in the product.md capability list. The first
  capability is `02`, and retired rows keep their positions and count.
- A filename is the number, `-`, then the name suffix. When a tree folder or waiting file
  exists, use its text after the number unchanged. Before either exists, use the product.md
  capability name exactly as split would use it in the tree; invent no separate slug
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
| 1 | H1 · purpose · boundary · trust notice | design | fixed 4 lines: `# <number> <name>` · purpose · boundary · trust | 4 lines | relative claims (`latest`, `most current`) |
| 2 | Concept model | design | table: concept / what the user gets / identifier / relation | 8 rows | code fields, types, signatures |
| 3 | Invariants | design | numbered list of falsifiable statements | 8 items | rules equally true of other capabilities |
| 4 | Non-goals | design | bullet: item — one-clause reason | 5 items | things merely not built yet |
| 5 | Binding ADRs | design | exact paths under `devflow/project/decisions/` cited by current design statements | 5 lines | uncited ADRs |
| 6 | Design metadata | design | the two `key: value` fields below | 2 fields | every other field |
| — | `## Verified state` | boundary | fixed H2 heading | 1 line | — |
| 7 | Main flow | verified | mermaid flowchart LR | 9 nodes | unimplemented paths |
| 8 | Lifecycle | verified | mermaid stateDiagram-v2, only when illegal transitions exist | 8 states | state sets with only legal transitions |
| 9 | Current behavior | verified | table: action / precondition / what the user sees / entrypoint | 10 rows | planned behavior and display-only wording changes |
| 10 | Entrypoints | verified | table: exact path / role / entered from | 12 rows | a whole “related” folder |
| 11 | Consumed contracts | verified | table: exact path / other capability number / expectation | 6 rows | anything this capability does not consume directly |
| 12 | Traps | verified | table: symptom / reproduction condition / cause / use instead | 10 rows | universal development knowledge |
| 13 | Verify | verified | commands and scenarios actually run at this closure, verbatim | 8 steps | accumulated past passes |
| 14 | Verification metadata | verified | the five `key: value` fields below, at end of file | 5 fields | every other field |

The deployed section headings are exactly `## Concept model`, `## Invariants`,
`## Non-goals`, `## Binding ADRs`, `## Design metadata`, `## Verified state`,
`### Main flow`, `### Lifecycle`, `### Current behavior`, `### Entrypoints`,
`### Consumed contracts`, `### Traps`, `### Verify`, `### Verification metadata`, in that
order. The three keys below the H1 are `Purpose`, `Boundary`, and `Trust`.

The deployed first 4 lines are exactly:

```text
# <NN> <product.md capability name>
Purpose: <why it exists and what it implements, one line>
Boundary: owns <owned scope>; does not own <neighbor capability number and name, or none>
Trust: design reflects confirmed Layer 0; verified state reflects the last passing capability verification, or contains no evidence before one. Judge each zone by its metadata.
```

- The total cap is about 185 lines: about 45 for design and 140 for verified state. An
  over-cap write succeeds; its writer reports the section and actual row, node, or step
  count. Splitting a capability is a user decision about a product change, not an automatic
  result.
- Purpose and ownership boundary must be readable in the first 4 lines, followed immediately
  by `Concept model`; order concepts from most central. Do not copy a contract body from code
  or another document; retain its exact location and only invariants specific to this
  capability.
- Write exactly `None.` in a section with no admissible evidence-backed content. Invent
  nothing without evidence.
- A Current behavior row exists only when one user action changes an externally observable
  precondition-to-outcome transition. Exclude changes to a button name, wording, or layout
  when the precondition and outcome stay the same.
- An Invariant must have a counterexample observable through a completion signal or an exact
  authority path. A Trap requires all four cells: symptom, reproduction condition, cause,
  and alternative. Mark an external-system trap `external` and put its exact source URL in
  the cause cell.
- An `external` row is non-binding evidence. work does not open its URL automatically and it
  cannot overturn a binding decision; only a person authorizes its deletion. Elsewhere a person may delete
  only a complete body row, item, or diagram node; additions remain with the writer skills.
  The H1 and first three fields, fixed section headings, diagram fences and direction
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

- `Capability number` equals the filename number. arch or adopt owns `Design head`; verify
  owns the other five fields.
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
  git log -1 --format=%H -- devflow/project/product.md devflow/project/arch.md devflow/project/glossary.md
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
   in sections 1–4 are fresh. When it differs or is empty, they are hypotheses.
2. When the union is nonempty, the Scope head command output equals stored `Scope head`,
   the exact-path set in Consumed contracts equals `Consumed paths`, and every
   other-capability number equals the provider currently mapped by arch.md's Code structure,
   the verified statements in sections 7–13 are fresh under this comparison. When the union
   is empty, the output differs or is empty, or either the path sets or provider mapping
   differ or are ambiguous, they are hypotheses.
3. When the current non-`.stale.` `.done.` card-number set differs from `Covered cards`,
   the verified statements are hypotheses. With no capability folder, the current set is
   empty.

`Verified at: none` makes the verified statements hypotheses. Binding ADRs are outside
both statement groups; a consumer checks each exact path when reading it. Metadata is the
comparison itself. The symmetric difference between the current completed-card set and
`Covered cards` is the completed-card change list since the baseline. For a current-only
number use its current filename; for a stored-only number use its one current same-numbered
path and status, `<number> missing` when none exists, or `<number> ambiguous` when multiple
exist. Do not add a chronology section.

A hypothesis is the trust state of baseline prose, separate from the verification result
`unverified`. Before use, reconfirm a design hypothesis at the exact current authority
section in product.md, arch.md, or glossary.md; reconfirm a verified hypothesis in current
code or cards inside the existing read set and code-search boundary. Expand neither. A
baseline is not canonical. Current code wins a code conflict; a binding-decision conflict
follows the canonical Document Hierarchy.

## Writers and replacement boundaries

- arch, or adopt in a brownfield, replaces from file start up to but excluding
  `## Verified state`. verify replaces from `## Verified state` through end of file. Their
  byte ranges do not overlap. The initialization exception lets arch or adopt create the
  empty verified scaffold below with an absent file or after the user explicitly chooses to
  reset a zero- or multiple-boundary file. After creation or reset, verify is the sole writer
  that replaces the verified zone. The exact v0.10 migration below is a separate
  content-blind initialization exception.
- arch and adopt first land every user-confirmed Layer 0 document, then calculate Design
  head. Derive every changed design zone in memory and present them as one batch; change no
  capability-document path before the user confirms that batch. After confirmation, a
  commit containing capability documents only, `arch — capabilities` or
  `adopt — capabilities`, is the last commit of that run. When no bytes change, ask no
  confirmation question and make no commit. This applies to ordinary design refreshes, not
  the mechanical ADR-supersession exception below. In multi mode it is a binding decision
  on the integration branch.
- An uncommitted diff from a post-confirmation interrupted write is a capability-design
  commit prefix only when it touches current and final expected capability-document paths
  alone (a rename may delete the old same-numbered path and add the final path), preserves
  each number-matched existing file's HEAD verified zone, gives each new file the initial
  scaffold below, and gives an exact v0.10 file the mechanical verified-zone transformation below. Use no
  partial bytes as input; regenerate the whole expected set from HEAD and finish that
  commit. Any mismatch is an integrity anomaly. A user-confirmed boundary reset is not
  recovered as a prefix. When one is interrupted after confirmation and before its commit,
  report that diff as an integrity anomaly and let the next run confirm the reset again.
- When a file is absent or the user confirms a boundary reset, arch or adopt creates both
  zones; verified sections start as
  `None.`, and verification metadata starts with `Verified at: none`, three empty arrays,
  and `Scope head: none`.
- With exactly one fixed boundary, arch or adopt preserves the heading through end of file
  byte-for-byte and replaces only the design zone. verify preserves the design zone
  byte-for-byte and replaces only the verified zone.
- When the same writer derives identical prose from identical input, preserve the existing
  HEAD bytes. Rephrasing an unchanged fact is a defect. Uncommitted partial-write bytes are
  never input.
- With one valid boundary, the next arch or adopt run heals design-shape damage and the next
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
  prose and lets arch, or adopt in a brownfield,
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
and routes it after any active claim or verification transition to arch, or adopt in a
brownfield. Before migration, work and domain entry open no body and use the baseline-missing
projection.

In the ordinary design batch, arch or adopt derives the design zone anew from current Layer
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
arch or adopt no authority to judge verified content; after migration, verify is again the
verified zone's sole writer.

## Creation and refresh inputs

- The design-zone input is the HEAD design zone for byte stability, product.md, arch.md,
  glossary.md, and only ADR paths actually cited by current design statements. Compress
  purpose, boundary, concepts, invariants, and non-goals per capability; do not copy Layer 0
  paragraphs or code contract bodies.
- The foundation records only shared contracts and boundaries named by arch.md. Do not copy
  coding style, verify-channel details, or universal rules.
- Foundation has no capability-layer verification closure, so its initial verified scaffold
  remains unchanged. Invent no verification event for foundation.
- The verified-zone standard refresh set is the HEAD verified zone; product.md, arch.md,
  code-style.md, glossary.md, journal.md, and design.md when present; this closure's
  capability code scope and consumed paths; and current non-`.stale.` `.done.` cards outside
  `Covered cards` with those cards' direct `Depends` and `Read first` paths.
- A conclusion from a `.stale.` card cannot support current prose. Keep non-`external`
  content only when reconfirmed in this closure's capability code scope. Preserve an
  `external` Trap's HEAD row byte-for-byte unless a person authorizes deletion; verify does
  not open its URL automatically. Delete any other Trap only when its reproduction condition
  has vanished from current code. Replace the Verify section every time with only the
  commands and scenarios actually run at this closure.
- In multi mode, design writing, verified refresh, and both head calculations happen on the
  fetched integration branch.

## Automatic entry and role inputs

- work parses the leading number of the depth-1 ancestor directly below `devflow/tree/` in
  the claimed card path. Compare numbers as integers. When exactly one baseline has that
  number, read it independently
  of `Read first`. When zero or more than one match, report one line and do not guess. This
  includes foundation and research cards.
- A baseline path directly under `devflow/project/capabilities/` that remains in a card's
  `Read first` is legacy wiring. Do not open it or report its absence through that field;
  select and shape-gate only through the number rule above. split puts no such path on a new
  card.
- When the selected file has zero or multiple fixed boundaries, guess no zone and read no
  body. Report the bounded shape facts in one line and continue active work with reviewer's
  `design: baseline missing — judge from the card and supplied shared documents` projection.
  With one boundary but malformed section or metadata shape, read the zones and mark the
  affected one a hypothesis.
- work opens each exact path in a valid Binding ADRs section of the file. If the section itself
  is absent or unparseable, open and infer no ADR path and make the design zone a hypothesis.
  For a path named by a valid section, report a missing path in one line and
  do not search for a substitute. When any is missing, make the design zone a hypothesis and
  reconfirm a statement supported by that path at current canon before use. Do not copy
  baseline or ADR paths into cards.
- Give reviewer the design zone and every existing file at an exact path listed in that
  zone's Binding ADRs section when the zone exists,
  plus exactly one of `design: fresh`,
  `design: hypothesis — <exact path#heading reconfirmed[, ...]>`, or, for an active claim
  with no baseline, `design: baseline missing — judge from the card and supplied shared
  documents`. Put multiple reconfirmation paths without duplicates in canonical path order.
  Review cannot pass when implementation used an unreconfirmed hypothesis statement.
- Give retrospector one capability document for a capability event, and the foundation plus
  all non-retired capability documents for a product event. Attach both statement groups' freshness
  projection to each file; a hypothetical verified statement cannot support a code-blind
  retrospective finding.
- For domain entry, when any of product.md, arch.md, or glossary.md is absent or arch.md lacks
  the `Brownfield` field, resume reports only each exact missing path or field and `domain knowledge not initialized` and opens no capability
  body. It returns to normal resume routing only when the user asks to initialize it. With all
  three present, resume selects foundation when the request semantically identifies it or
  contains a standalone `01` token. Otherwise it selects product.md rows when the request
  contains a complete capability name or standalone number token, comparing file numbers as
  integers. With zero matches it reports only foundation plus non-retired number/name
  candidates and asks; with multiple matches it reports only matched candidates and asks.
  It opens no body before that answer. When one number is selected but no same-numbered file
  exists, including foundation, it reports only the expected path and the arch or adopt repair route and invents
  no body. Before opening a body, exactly one same-numbered file and its fixed boundary,
  sections, and metadata shape must be valid. On a duplicate or shape anomaly, report only
  the canonical bounded shape facts and repair route; open no body. A duplicate requires the
  user to resolve the number/path anomaly; zero or multiple boundaries use Lifecycle and
  recovery below; arch or adopt repairs one-boundary design shape, while the next capability
  closure's verify repairs a verified-only shape anomaly. When the user explicitly
  requests the full expected set, apply this judgment per number, read only valid files, skip anomalous
  numbers, and continue. Ordinary resume reads only filenames and the shape projection,
  never file bodies. When a Binding ADR path is absent during domain entry, report that exact
  path, make the design zone a hypothesis, and search for no substitute.

## Relations and consumer projection

- Only the consuming side records a relation, in Consumed contracts and `Consumed paths`.
  Record a shared invariant once in the enforcing capability's design zone; the other side
  points to its exact path.
- Consumed contracts has exactly one row per `Consumed paths` member in the same canonical
  path order and no other row. With no path, the section is `None.` and the array is `[]`.
  The row's other-capability number is the provider number to which arch.md's Code structure
  maps that exact path.
- A consumed-path member matches a provider Scope path only when their strings are equal, or
  when it is below a folder Scope path that arch.md maps exactly to the provider.
- The consumer projection visits, in ascending integer order, every non-retired capability
  number in the current expected set except the provider; foundation is not a candidate.
  Exactly one same-numbered file must exist for each. At the first zero or multiple match,
  stop and report `registered consumers: unknown — <number, exact paths when any exist, and
  reason>`. A retired historical file outside the expected set is not a candidate. From each
  unique candidate, the projection opens no other baseline prose. It projects only number, `Verified
  at`, `Consumed paths`, `Scope paths`, `Covered cards`, `Scope head`, and the exact-path and
  other-capability-number columns of Consumed contracts. A matched consumer is
  `fresh` only when `Verified at` is not `none`, the scope-and-consumed-path union is nonempty,
  the current Scope head equals the stored value, the current card set equals `Covered
  cards`, and both relation representations and the current provider mapping agree. When
  the required fields parse and any condition is false, it is `hypothesis`; when
  a required field is absent or unparseable or the Git comparison cannot execute, it is
  `unknown`. If a candidate's number or `Consumed paths` cannot be parsed, membership itself
  is unknown: stop at the first such file in the same ascending integer order, report it with the same
  unknown form, and never guess `none`.
- For a provider closure, match against the union of that provider's Scope paths before the
  refresh in HEAD and after the refresh. For retirement or split that does not change path
  ownership, use the original capability's stored Scope paths. For retirement, split, or
  another binding decision that changes path ownership, use the union of affected baselines'
  stored Scope paths and the decision's exact before and after paths. Consumers of an old
  path that moved or vanished therefore remain reportable.
- A provider closure, capability retirement or split, and any other binding decision that
  changes path ownership reports one line:
  `registered consumers: <number (status), ... | none>`. The report executes no verification,
  creates no card, changes no state, and does not infer that this event caused a hypothesis.
- When the provider baseline refresh is a no-op, its stored before-and-after scope cannot be
  trusted. Run no consumer projection and report one line: `registered consumers: unknown —
  provider baseline no-op: <same reason>`. Never guess `none`.

## Lifecycle and recovery

- Every arch or adopt run re-derives the design zone for the whole expected set. A new or
  split capability gets a new file; an existing capability keeps its number.
- A capability rename first lands the product and tree name change as a binding decision.
  The following arch capability-design commit, or adopt in a brownfield, preserves the number
  while changing the baseline path and design zone together. If interrupted between those
  commits, number lookup still reaches the old file and the Design head mismatch recovers the
  second commit. Retirement leaves the file unchanged and excludes it only from ordinary
  resume reports and the automatic-entry expected set.
- A rename re-derives every expected design zone, so neighboring `Boundary` names change too.
  A consumed relation is identified by the other capability's number and exact code path,
  not its name; run no consumer projection unless code-path ownership also changes.
- When an ADR is superseded, arch replaces the old path in the Binding ADRs section of every
  affected design zone in the same binding decision as the successor ADR and the dated note
  on the old ADR. This is not an `arch — capabilities` commit and changes no capability-
  document byte except the old exact path to the new exact path in Binding ADRs. Replace the
  path too on pending or claimed cards that name it directly in `Read first`.
- resume uses a machine query **against the HEAD file** that exposes only filename number,
  fixed-boundary count, fixed
  section order and presence, metadata field presence and parse status, and the Boolean result
  of the v0.10 heading-and-field predicate above. Every routing judgment, including absence
  and boundary count, therefore uses the same HEAD values as writer eligibility, and the
  working-tree count only joins the report a person reads. When an expected
  file is absent, or its boundary is valid but its design shape differs, route at a clean
  boundary after any active claim or verification transition: `Brownfield: yes` to adopt,
  `no` to arch, for design-zone writing only.
- An existing project with complete Layer 0 and no baselines uses the same route. Do not
  repeat Layer 0 interviewing or reverse derivation. If the user defers repair, continue the
  remaining state judgment for that session.

## Capability-closing begin commit

- On a capability-layer pass, verify first attempts the verified-zone refresh. On success,
  put the passing verify.md, capability-closing record, and refreshed baseline together in
  `boundary — begin <capability number>`.
- When a boundary anomaly, number conflict, or input parse failure prevents refresh, write no
  baseline, report `baseline no-op: <reason>`, and continue closure. Restore that path to its HEAD
  content, and leave no working-tree file there when HEAD has none. Every skill
  reports the one same form, and a writer-side no-op, which may concern more than one file,
  names the exact path inside the reason.
- A canonical begin transition permits a baseline diff at the closing capability's exact
  path only. That working-tree path may be absent, partial, or arbitrary bytes and is
  regenerated from the same-numbered HEAD file's design zone and the standard refresh set
  only when exactly one such HEAD file with one boundary exists. With no HEAD file or a HEAD
  boundary anomaly, this is a baseline no-op rather than prefix recovery. A diff at any
  other baseline path is an integrity anomaly.
- The baseline lands only in the begin commit, never again in the later verify.md sweep,
  journal sweep, or capability-folder `.done` rename.

## Accepted limits

These limits do not change the predicates and add no separate checks.

- A shallow clone or multi-mode rebase can produce a conservative false hypothesis.
- A very long union of Scope paths and Consumed paths can hit the command-line length limit.
- Neither head command sees an uncommitted working tree.
- A relation through a registry or dynamic dispatch can retain false freshness under
  path-only tracking.
- Relation reporting is an awareness device. It does not automatically expand cross-domain
  regression execution.
