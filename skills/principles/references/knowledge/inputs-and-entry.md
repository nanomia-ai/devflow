# Knowledge inputs and entry policy

## Creation and refresh inputs

- The design-zone input is the HEAD design zone for byte stability, product.md, arch.md,
  glossary.md, and only ADR paths actually cited by current design statements. Compress
  purpose, boundary, concepts, invariants, and non-goals per capability; do not copy Layer 0
  paragraphs or code contract bodies.
- A capsule's refresh input is its HEAD body for byte stability, current canonical owner/K
  knowledge, current code at points needing confirmation, and only user-designated live inputs
  or managed cards that the current change names. During Adopt, maintained pre-devflow material
  is transient reconstruction evidence: land its durable meaning in the nearest owner or K, then
  maintain that canonical knowledge without reopening absorbed inputs.
- Foundation has no capability-layer verification closure, so its initial verified scaffold
  remains unchanged. Invent no verification event for foundation. Shared code the foundation
  owns lies inside the capability code scope of every capability that uses it, so it is
  verified through those consumers and that knowledge lands in their verified zones.
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
- Design writing, verified refresh, and both head calculations happen on the
  integration branch.

## Automatic entry and role inputs

- work parses the leading number of the depth-1 ancestor directly below `.devflow/tree/` in
  the claimed card path. Compare numbers as integers. When exactly one baseline has that
  number, read it independently
  of `Read first`. When zero or more than one match, report one line and do not guess. This
  includes foundation and research cards.
- A baseline path directly under `.devflow/project/capabilities/` in `Read first` duplicates
  a path work already reads through the number rule. Direct puts no such path on a new card;
  work treats it as invalid card basis instead of opening it from that field.
- When the selected file has zero or multiple fixed boundaries, guess no zone and read no
  body. Report the bounded shape facts in one line and continue active work with reviewer's
  `design: baseline missing — judge from the card and supplied shared documents` projection.
  With one boundary but malformed section or metadata shape, read the zones and mark the
  affected one a hypothesis.
- After reading the selected capability document, work projects only the capsules' first two
  lines by machine query when a same-numbered capsule folder exists. It opens bodies only for
  capsules named by the card's `Read first` and capsules whose first-line "when to open"
  matches the card's destination and target paths. An opened capsule's `conjecture` sentence cannot be cited as
  an implementation basis, and a `dispute` leans on neither arm before the decision — when
  continuing requires leaning on one, stop and report the dispute number with both arms.
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
  three present, resume resolves the target by the canonical rules' canonical recognition,
  and the selected unit's number names the same-numbered capability document.
  With an empty resolution set it reports only foundation plus non-retired number/name
  candidates and asks; with two or more it reports only the resolved candidates and asks.
  It opens no body before that answer. When one number is selected but no same-numbered file
  exists, including foundation, it reports only the expected path and the Arch repair route and invents
  no body. Before opening a body, exactly one same-numbered file and its fixed boundary,
  sections, and metadata shape must be valid. On a duplicate or shape anomaly, report only
  the canonical bounded shape facts and repair route; open no body. A duplicate requires the
  user to resolve the number/path anomaly; zero or multiple boundaries use Lifecycle and
  recovery below; Arch repairs one-boundary design shape, while the next capability
  closure's verify repairs a verified-only shape anomaly. When the user explicitly
  requests the full expected set, apply this judgment per number, read only valid files, skip anomalous
  numbers, and continue. Ordinary resume reads only filenames and the shape projection,
  never file bodies. When a Binding ADR path is absent during domain entry, report that exact
  path, make the design zone a hypothesis, and search for no substitute. When the selected
  capability has a capsule folder, present the first-two-lines projection as an index alongside and
  open only the capsules the user picks, within the opening budget — the user's request for
  all of them is that budget's explicit approval.
