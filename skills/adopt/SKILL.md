---
name: adopt
description: Reconstruct an unmanaged brownfield project's maintained knowledge into a self-contained Devflow Product, Architecture, applicable Design, Domains, and decisions while accounting for every source and exposing irreducible conflicts. Use only for explicit adoption of an existing project; not for new-project planning, ordinary changes, or legacy Devflow migration.
---
<!-- generated; do not edit; source: targets/adopt/entry.md; receipt: .skill-rails-build.json -->

# Transfer brownfield knowledge ownership

Adopt moves the authority for understanding an existing unmanaged project into `.devflow/`. It does
not summarize old documents for permanent reference, migrate an earlier Devflow format, or require
the user to restate facts that maintained source can establish.

## Enter through the unmanaged-project gate

Before any target-specific action, open `references/project-gate.md` and apply the `adopt` row. Then
open `references/project-knowledge.md`. When a readable `.devflow/index.md` already exists, read it
first and determine whether this is an active adoption or a newly discovered brownfield boundary.

Enter only when the user explicitly asks to adopt an existing project, or when another Devflow
route has identified maintained brownfield material that lacks an internal foundation. A clear new
brief routes to `product`; an uncertain new idea routes to `sketch`; a managed project change follows
its owning route. Never recognize legacy Devflow files as an upgrade protocol or import them as a
runtime fallback.

Before writing, inspect Git status and identify the repository boundary. Preserve unrelated dirty
bytes. Ask only when the maintained-source boundary itself is irreducible from repository evidence;
generated output, dependencies, caches, and VCS metadata are not maintained knowledge merely because
they exist.

## Account for every maintained source

Create `.devflow/adoption/` as a recoverable current workspace. Publish `state.md`, `sources.md`, and
`conflicts.md`, each with the shared routing header. `state.md` is one replaceable snapshot:

```yaml
next_route: adopt
next_action: <one bounded inventory, reconstruction, decision, or disposition action>
blockers: []
```

It contains no coverage table, conflict copy, progress percentage, phase, transcript, or source-file
list. Replace it before custody changes if the current action cannot finish. The actor for the
published route owns the snapshot; ambiguous custody routes to the user rather than an overwrite.

Open `references/team-context.md` when a bounded note for the fixed `adoption` key exists or when
you hold local delta, environment-specific, or tentative context that must survive a hand-off;
otherwise skip it.

`sources.md` defines the maintained input universe and partitions it into bounded source groups.
For each group record:

- exact include paths or globs and the complementary exclusions that make overlap visible;
- source nature and authority: intent prose, executable behavior, tests, configuration, operations,
  generated evidence, or another concrete role;
- the kinds of knowledge sought and their one internal target home;
- current disposition: landed, conflict, pending, live evidence retained, noncanonical preservation,
  pointer replacement, move, or deletion; and
- the total uncovered maintained-path count.

Maintained prose gets an individual disposition. Homogeneous code, tests, or configuration may be
grouped only when the include/exclude boundary is checkable and the group genuinely shares authority,
knowledge sought, target, and disposition. Coverage is complete only when groups do not leave a
maintained path uncovered; it does not prove that their meaning was understood.

Create or refresh a small `.devflow/index.md` in the same adoption boundary. It orients the project,
routes current Product, Domain, Architecture, Design, and adoption questions without copying their
answers, exposes only the immediate `sketches/*/state.md`, `adoption/state.md`, and
`work/*/state.md` recovery globs, and derives readiness from current canon plus adoption status. It
does not enumerate source groups or active artifact IDs.

## Reconstruct meaning, not prose

Read each source according to the authority recorded in `sources.md`. Executed code and tests can
establish current behavior; they cannot silently choose a contradictory product promise. Intent
prose can establish user meaning; it cannot override observed runtime behavior without exposing the
divergence. Configuration establishes an environment only where it is current and exercised.

Treat something as a knowledge unit only when maintained source asserts or explicitly questions it,
or when current execution is needed to interpret such a source-backed claim. Do not turn other
absences, untested cases, or possible future decisions into facts or unknowns. For every knowledge
unit distinguish:

- an observed fact supported directly by current source or execution;
- an interpretation, with its evidence, remaining uncertainty, and confirmation condition beside it;
- an unknown that a maintained source explicitly raises but no source settles, recorded once with
  the decision it would change; or
- a conflict in which maintained sources support incompatible current answers.

Give each unit one internal home—the document whose decision route resolves it—and keep it beside
the sentence it qualifies. Other homes may link to that unit but do not recatalog it for
completeness.

Publish complete current `.devflow/project/product.md`, the necessary
`.devflow/project/domains/<domain>/index.md` Domain parents,
`project/architecture.md`, and `project/design.md` only when Architecture says Design applies and
maintained sources establish a current interaction, presentation, accessibility, component, or
review rule to reconstruct. A Product promise or goal for a surface is not Design knowledge. When
Design applies but the sources establish no such rule, publish no placeholder Design; Architecture
exposes the applicability and the next foundation route becomes `design` after earlier adoption
decisions close.
Apply the shared split test before creating conditional concern children. Product owns the user,
promise, boundary, shared language, and cross-domain composition; each Domain owns only its business
state and rules; Architecture owns technical seams, dependency direction, runtime/data behavior,
verification channels, and Design applicability; Design owns experience principles and review
surfaces. Refer across those homes instead of copying their facts.

Every published document must remain intelligible after the old prose is removed. Replace external
references with self-contained current statements, not summaries that tell the reader to reopen an
input. Code, tests, and live operational assets may remain as current evidence, but their paths do
not become a second project-knowledge canon.

## Expose only irreducible conflicts

`conflicts.md` contains only contradictions that source authority and current evidence cannot settle.
For each one state the incompatible claims, evidence on both sides, affected current judgment,
interpretations already excluded, the exact decision needed, its owning route, and the condition
that confirms resolution. When none remain, say so directly; do not preserve resolved conflict
history as current truth.

Route product or Domain meaning to `product`, technical meaning to `architecture`, and experience
meaning to `design`; that decision route owns the conflict and absorbs the answer into the
canonical home of the question—a Domain rule into that Domain index, a promise or boundary into
Product—even when the owner must choose. `next_route: user` may carry only a fully framed choice
whose action names the decision route that will absorb the answer. Ask the user only after showing
the competing answers and consequences.
Do not polish an invented answer merely to make a foundation look complete.

## Open work only inside a proven boundary

Adoption may proceed in vertical slices, but an uncovered repository is not globally ready. A
requested tracked change boundary is eligible only when all three facts are visible in current files:

1. every maintained source that can affect that change has a disposition in `sources.md`;
2. required Product, Domain, Architecture, Design, and cross-domain canon for the change is
   self-contained; and
3. no unresolved conflict affects the change boundary.

This is derived evidence, not a status field. If all three hold, state may route that exact boundary
to `direct` and name the bounded change; other adoption remains open. If any is uncertain, keep
`next_route: adopt` or the one decision route and do not create Work.

## Transfer or retire old prose

Existing documentation loses project-truth authority only after all of its unique current knowledge
has landed or become an explicit conflict. Its final disposition is one of: deletion, movement out
of the current search surface, replacement by the minimum host-required pointer, or preservation
with an unmistakable statement that it is not Devflow project truth and contains no unique project
knowledge. Request a user decision before destructive or purpose-changing treatment that was not
already authorized.

Do not mark an old document noncanonical while leaving its only fact there. Do not keep a full old
manual beside the new canon merely for reassurance. Runtime code, tests, and configuration remain
where their operational role requires them; disposition changes their knowledge authority, not
their execution role.

## Close only after complete transfer

Adoption closes when all maintained source groups are landed, retained as live evidence, explicitly
conflicted, or made noncanonical under the rule above; uncovered paths are zero; every conflict is
resolved; and the complete Product, Architecture, applicable Design, Domain, and decision knowledge
is self-contained. Update the index so readiness and the next route reflect that result, then remove
`adoption/` and any `team/*/adoption.md` files. Git retains the reconstruction history.

After closure, test meaning rather than file presence: answer representative Product, Domain, and
Architecture questions using `.devflow/project/` alone, with old prose absent or deliberately
contradictory. A fresh reader must choose internal canon and report the retained contradiction as
non-authoritative. If that has not been observed, external-input independence remains `unproven`.

Return:

- `Coverage:` maintained source groups, exclusions, and uncovered count;
- `Published:` every canonical project and adoption path created or replaced;
- `Conflicts and unknowns:` each open decision and its route, or `none`;
- `Ready boundary:` the requested change boundary satisfying all three readiness facts, or `none`;
- `Source disposition:` old prose and live source treatment still required; and
- `Route and action:` one next route and one bounded action.

Do not implement product changes, create Work contracts, migrate legacy Devflow state, or claim that
path coverage proves semantic completeness.
