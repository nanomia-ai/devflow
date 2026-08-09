---
name: adopt
description: Existing-project adoption. In a repository that already has code, traces a flow and reverse-derives product.md, arch.md, and code-style.md to inherit. Use for adopting devflow in an existing project, reverse-deriving devflow documents from an existing codebase, or joining a project that already has code mid-way.
---

# adopt — Existing-Project Adoption

First read the canonical rules (`../principles/SKILL.md`).

Purpose: give a **brownfield** (a project that already has code, joined mid-way) its
Layer 0 documents (product.md · arch.md · code-style.md · glossary.md) by
reverse-derivation, inherited from then on. Do not interview. Reverse-derive.
This procedure IS the "understanding stage" — split does not run without it.

When it applies:

- No code — then this is not the skill; that is product.
- `devflow/project/` already complete — nothing to do; continuing is resume's job,
  and when a big cleanup is needed, re-run product·arch.
- Only some documents exist — respect what exists as upper documents and
  reverse-derive only what is missing.

Order of evidence: **code is truer than documents.** The repository's existing
documents (README, docs, planning notes) are treated as claims, adopted only after
checking them against the code. Commit history is supporting evidence.

## Procedure — in exactly this order

1. **Trace the flow.** Follow one representative request from the entry point to the end,
   confirming capability boundaries with your own eyes.
2. From code, existing documents, and commit history, reverse-derive `product.md` **in
   the product skill's output format**. What code can answer (the identity paragraph,
   the capability list with one-line descriptions, Boundary's MVP scope — what is
   already built is the answer, screens & access points, interface) is filled by
   derivation; what code cannot answer (Boundary's "will-not-build" · success criteria ·
   whatever the derived identity paragraph missed of Problem and Approach) is asked of
   the owner. No full interview — the single batch of confirmation questions serves both
   correcting anything mis-derived and filling those fields. What goes unanswered is
   left in 'Open questions,' never invented.
   Start `glossary.md` from the terms the code actually uses — the code's words are canonical.
3. Reverse-derive `arch.md` **in the arch skill's output format**, present it as a
   draft, and get user confirmation. Inherited forever after. The verify channel
   applies arch's "Verify-channel decision" section as-is, gate included — this skill
   does not finish until it is decided. The git check (propose `git init` if not a
   repository) belongs to that same section.
4. **Reverse-derive code-style.md as well, in the arch skill's "Output 2" format.**
   What the code already does is canonical — do not impose the format's default
   Values and split the style in two.
5. **Never backfill the tree with already-finished code.** `devflow/tree/` starts from
   work done after adoption — filling it with `.done.` cards for existing features is
   waste. Opening the tree is split's job — capability folder names must be the same
   words as the reverse-derived capability list, so new work accumulates in the right place.

On completion: one line — "next is split." Even with a frontend, the existing screens
are the de-facto design canon — recommend design (optional) only when a new screen
system is being built.
