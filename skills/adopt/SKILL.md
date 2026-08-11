---
name: adopt
description: Existing-project adoption. In a repository that already has code, traces one representative flow per capability candidate and reverse-derives product.md, arch.md, and code-style.md to inherit. Use for adopting devflow in an existing project, reverse-deriving devflow documents from an existing codebase, or joining a project that already has code mid-way.
---

# adopt — Existing-Project Adoption

First read the canonical rules (`../principles/SKILL.md`). If present, read all of
`devflow/project/product.md`, `devflow/project/arch.md`, `devflow/project/code-style.md`,
`devflow/project/design.md`, `devflow/project/glossary.md`, `devflow/journal.md`, and each
`.md` file directly under `devflow/project/decisions/`.

Purpose: give a **brownfield** (a project that already has code, joined mid-way) its
Layer 0 documents (product.md · arch.md · code-style.md · glossary.md) by
reverse-derivation, inherited from then on. Do not interview. Reverse-derive.
This procedure IS the "understanding stage" — split does not run without it.

The output-format reference is bounded. From `../product/SKILL.md`, read from
`Output — devflow/project/product.md` up to but not including `Gates`. From
`../arch/SKILL.md`, read `Verify-channel decision` and from `Output — devflow/project/arch.md` up to but not
including `On completion`. Do not read or execute interview or procedure text outside those
ranges. In the Codex slash prompt, the installer embeds only those same ranges below.

When it applies:

- No code — then this is not the skill; that is product.
- `devflow/project/` has product.md, code-style.md, glossary.md, and arch.md with its
  `Brownfield` field — nothing to do; continuing is resume's job. If the confirmed
  identity paragraph, capabilities, Boundary, or success criteria must change, re-run
  product; product's gate decides whether arch follows.
- Only some documents exist — respect what exists as upper documents and reverse-derive
  only what is missing. If code contradicts an existing devflow document, do not overwrite
  it; report and confirm the change through the canonical Document Hierarchy procedure.

When only glossary.md is missing, do not repeat steps 1–5 below. Copy verbatim the domain
terms used in product.md's Capabilities and Screens & access points, arch.md's Components
and Data, and code-style.md's Project choices. Ask one confirmation batch only for terms
whose meaning those three documents do not fix, create only glossary.md, and modify no
other document.

Order of evidence: **code is truer than documents outside devflow.** The repository's existing
documents (README, docs, planning notes) are treated as claims, adopted only after
checking them against the code. Commit history is supporting evidence. Only when current
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
   the capability list with one-line descriptions, Boundary's MVP scope — what is
   already built is the answer, screens & access points, interface) is filled by
   derivation; what code cannot answer (Boundary's "will-not-build" · success criteria ·
   whatever the derived identity paragraph missed of Problem and Approach) is asked of
   the owner. No full interview — the single batch of confirmation questions serves both
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

Immediately after the user confirms the adoption documents, land them together in the
canonical Layer 0 commit.

On completion: if the user already requested a post-adoption change, first write split's
exact `maintenance routing pending` line in journal and put it in the same commit as the
confirmed adoption documents, then say "next is split." If no change was requested, say "adoption complete — waiting for a new change
request." Even with a frontend, the existing screens
are the de-facto design canon — recommend design (optional) only when a new screen
system is being built.
