---
name: adopt
description: Existing-project adoption. In a repository that already has code, traces one representative flow per capability candidate and reverse-derives Layer 0 and capability design zones. Use for adopting an existing project, reverse-deriving codebase documents, or creating and repairing capability documents in a brownfield.
---

# adopt — Existing-Project Adoption

glossary.md is an always-read Layer 0 baseline. Align reverse-derived capability composition
with exact canonical terms in capability-header `Concepts:`. On `marker.glossary-term`,
consume only the tool payload, first land the glossary definition in a binding commit while
retaining the marker, then in the next `adopt — capabilities` batch align the glossary definition and every known affected `Concepts:` line, refresh every Design head, and delete the marker. Never infer semantic ownership from a card number for a shared term or project-root `[]`.

First read the canonical rules (`../principles/SKILL.md`) and the planning evidence discipline
(`../principles/planning-evidence.md`). Read the canonical capability knowledge baseline
predicates (`../principles/baseline-predicates.md`) under the capsule gate in the next paragraph.
If present, read all of
`devflow/project/product.md`, `devflow/project/arch.md`, `devflow/project/code-style.md`,
`devflow/project/design.md`, `devflow/project/glossary.md`, `devflow/journal.md`, and each
legacy `ADR-NNN.md` directly under `devflow/project/decisions/`.

Read the baseline predicates with the range from `## Domain knowledge capsules` up to but
not including `## Metadata and freshness` left out. When this run actually processes a source
document the user named into capsules, or the capability document it derives is about to
exceed that canon's total cap, open and write from that range in full first. Whether capsules
exist on disk right now is not part of this judgment — the first capsule is always born in a
project that has none. When either side is unclear, or the two headings cannot be found, read
all of it.

Run `node ../principles/scripts/project-state.mjs state --capability <capability number>`
for each capability document in scope. Its `baseline:` lines carry the expected set, path
state, boundary, shape, freshness, and `legacy v0.10` judgments; take them as they stand.
Read the baseline predicates for what earns a place in a body.

Purpose: give a **brownfield** (a project that already has code, joined mid-way) its
Layer 0 documents (product.md · arch.md · code-style.md · glossary.md) by
reverse-derivation, inherited from then on. Do not interview. Reverse-derive.
This procedure IS the "understanding stage" — split does not run without it.

The output-format reference is bounded. From `../product/SKILL.md`, read from
`Output — devflow/project/product.md` up to but not including `Gates`. From
`../arch/SKILL.md`, read `Verify-channel decision` and from `Output — devflow/project/arch.md` up to but not
including `Capability documents — final output after Layer 0`. Do not read or execute interview or procedure text outside those
ranges.

When it applies:

- No code — then this is not the skill; that is product.
- `devflow/project/` has product.md, code-style.md, glossary.md, and arch.md with its
  `Brownfield` field, and every
  expected file under the canonical baseline predicates has a valid design zone and current
  `Design head` — nothing to do; continuing is resume's job. When Layer 0 is complete and
  only capability documents are missing or need repair, skip steps
  1–5 and run only `Capability documents` below. If the confirmed identity paragraph,
  capabilities, Boundary, or success criteria must change, re-run product.
- Only some documents exist — respect what exists as upper documents and reverse-derive
  only what is missing. If code contradicts an existing devflow document, do not overwrite
  it; report and confirm the change through the canonical Document Hierarchy procedure.

When only glossary.md is missing, do not repeat steps 1–5 below. Copy verbatim the domain
terms used in product.md's Capabilities and Screens & access points, arch.md's Components
and Data, and code-style.md's Project choices. Ask one confirmation batch only for terms
whose meaning those three documents do not fix, create only glossary.md, and modify no
other document.

## Evidence Authority and Confirmation Batch

The three authorities do not substitute for one another.

- Current implementation is answered by code and current execution results. Code is truer
  than documents outside devflow; treat existing README, docs, and planning documents as
  claims and adopt them only after checking them against code.
- External contracts and possibilities are answered by official documentation,
  specifications, source, and primary APIs for the version the repository pins. First find
  the version in a manifest, lockfile, or config, then fix that version and lookup time.
- Future direction, the trade-off between preservation and improvement, and user experience
  are decided by the owner. Do not promote current behavior or current external
  documentation into that decision.

Mark an external fact whose version cannot be confirmed as `version unconfirmed`. Do not
use current documentation to prove the currently pinned version's contract or close a
version-unconfirmed fact as a safe default. For a blocking fact, stop at the planning
evidence discipline's `unavailable` boundary; for a follow-up fact, leave only the owning
stage and the impact that would change.

While comparing candidates, maintain the following internal evidence table only in the
conversation. Do not store it in a file, journal, or capability document.

| Candidate | Observation | Source/version | Interpretation | Remaining owner decision |
|---|---|---|---|---|

The main session confirms one exact coordinate or one capped query. For answer-only comparison across
multiple paths or external sources, use the planning evidence discipline's isolated-research branch, but
the main session directly follows and understands representative-flow code, document structure, and domain
context. A researcher returns only bounded sub-facts such as locations, usages, and pinned versions.

In a confirmation batch, separate `Observation` (code and the pinned-version contract),
`Interpretation` (what those facts mean for the current boundary), and `Decision preview`
(the future direction for the owner to confirm). Do not turn a current fact into future intent
or present an interpretation as an observation.

Only when preserving current behavior and following the target direction produce actually different
outcomes, compare one alternative through the planning evidence discipline's pre-commitment review
before confirmation. With no substantive candidate, create no additional output, question, or research.

Commit history is supporting evidence. Only when current
code and a document conflict, read the newest commit that touched the exact conflicting
path and the immediately preceding such commit. Do not scan repository-wide history.
The initial existing-document read set is the repository-root README files, files whose
exact paths the user or repository instructions name, and the file-path listing under
root directories whose lowercased names are `docs` or `specs`, or documentation roots named by repository
instructions. Except for a root README or an exactly named file, do not open the body of
a document unless this test passes: lowercase both the document filename stem and a
code-derived candidate name, remove every non-letter and non-digit, and require either
normalized string to contain the other. A test with either normalized string empty fails.

## Procedure — in exactly this order

1. **Enumerate capability candidates and trace their flows.** First list code-derived
   candidates from external entry points and top-level code modules, then open documents
   that pass the filename test above. Add a candidate from an opened feature list or path
   name when it connects to a code flow; otherwise put it in the confirmation-question
   batch. Existing documents remain claims at this point. For each
   candidate, follow one representative execution from an external entry point to the end.
   Merge two candidates only when they have the same externally observable responsibility
   and the same code flow; put any candidate whose boundary remains unconfirmed into the
   confirmation-question batch.
2. From code, existing documents, and commit history, reverse-derive `product.md` **in
   the product skill's output format**. What code can answer (the identity paragraph,
   the capability list through number, name, and user outcome, Boundary's MVP scope — what
   is already built is the answer, screens & access points, interface) is filled by
   derivation; what code cannot answer (Boundary's "will-not-build" · success criteria
   and why each capability's user outcome is needed for them · whatever the derived
   identity paragraph missed of Problem and Approach) is asked of the owner. No full
   interview — the single batch of confirmation questions serves both
   correcting anything mis-derived and filling those fields. Success criteria are the
   exception: the owner must answer, and each must be verifiable as written. Ask again when
   one is not; step 3 does not begin until this condition passes. Only the other unanswered items are left in
   'Open questions,' never invented.
   Start `glossary.md` from the terms the code actually uses — the code's words are canonical.
3. Reverse-derive `arch.md` **in the arch skill's output format**, write
   `Brownfield: yes`, present it as a draft, and get user confirmation. If an existing
   arch.md lacks only this field, add the field without re-deriving its other content.
   Inherited forever after. The verify channel
   applies arch's "Verify-channel decision" section as-is, gate included — this skill
   does not finish until it is decided. The git check (propose `git init` if not a
   repository) belongs to that same section.
   When at least one statement in an existing handoff or specification file matches code
   traced in step 1, write `capability name: exact path` under arch.md's `Existing records`
   when exactly one candidate flow uses the step, contract, or state described by that
   statement. When two or more candidate flows use it, write `shared` instead of a name. Put one path on each line; the
   same name may repeat. Record paths only; do not copy the contents.
4. **Reverse-derive code-style.md as well, in the arch skill's "Output 2" format.**
   What the code already does is canonical — do not impose the format's default
   Values and split the style in two.
5. **Never backfill the tree with already-finished code.** `devflow/tree/` starts from
   work done after adoption — filling it with `.done.` cards for existing features is
   waste. Opening the tree is split's job — capability folder names must be the same
   words as the reverse-derived capability list, so new work accumulates in the right place.

In a new adoption, when the user has already requested a post-adoption change, first append
split's exact `maintenance routing pending` line to journal and land it with the confirmed
adoption documents in the canonical Layer 0 commit. With no request, put only the adoption
documents in that commit. An existing project's capability-document-only branch makes no
new Layer 0 commit here.

## Capability documents — final output after the adoption commit

After confirmed product.md, arch.md, and glossary.md have landed in HEAD, run the canonical
baseline predicates' brownfield design-writer procedure. Representative flows traced during
a new adoption are already evidence for reverse-deriving product.md and arch.md; do not copy
code details or flows into the capability documents again.

- Derive purpose, boundary, Intent overview, Concept model, invariants, non-goals, and
  binding ADRs for `01-foundation.md` and every non-retired capability from Layer 0,
  organized per capability.
- **Capsule processing.** When existing domain documents the user named overflow the
  capability-document budget, process them into the canonical baseline predicates' knowledge
  capsules. The order is five steps: ① inventory the source (headings and line ranges) at the
  revision the user specified ② cut it into topics and check them against code ③ intent that
  runs through the capability goes to the capability document's Intent overview and topic
  knowledge into capsules — provenance marks, dispute preservation, and `Source basis` follow
  the canonical contract exactly, and differing statements inside the source are kept as a
  dispute rather than resolved to one side ④ a clean session's refutation round — omissions
  and inventions of key intent, boundaries, and traps must be zero, it includes a provenance
  sampling check that finds three unmarked sentences per capsule at their source coordinates,
  and a capsule that fails does not land ⑤ land with the same confirmation and the same commit
  as the canonical baseline predicates' design batch. Report the dispute list in the confirmation batch as items for
  the owner to decide. Deleting or moving the source is not part of this procedure — report
  only the material for that judgment.

**Design-only entry.** When the entry handed over a `marker.design-note` or a
`marker.design-open-item`, do not run the
reverse derivation again. Rederive only the design zone of the one capability that line names,
from the confirmed current Layer 0 and that exact statement. Put the statement in Intent or
Invariants when it fits the capability-document budget, and move design-topic detail over that
budget down through the capsule procedure above. The `anchor` handed over is the exact snapshot
basis of that `card` and `code`; recompute no other basis from history or cards, and never
duplicate a capability fact into arch.md to wake the writer — only a real Layer 0 fact takes
the discovery→update table's existing route. A `marker.design-open-item` carries no `anchor`
and no `code`: the person-confirmed `statement` is itself the basis, its `card` is only where
the confirmation happened, and the owner is the `capability` that line names — read no code
from that card, and never move the statement to that card's capability. Delete the journal
line byte-identical to that one
in the same binding capability-document commit.

On completion: if the new-adoption Layer 0 commit included `maintenance routing pending`, or
the current conversation contains an existing-project change request, say "next is split."
split first makes a capability-document-only branch's request durable through its own
maintenance procedure. If no change was requested, say "adoption complete — waiting for a
new change request." Even with a frontend, the existing screens
are the de-facto design canon — recommend design (optional) only when a new screen
system is being built.
