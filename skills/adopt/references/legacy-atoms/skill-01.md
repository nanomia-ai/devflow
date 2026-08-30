# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0001 — migration:SKILL.md:1-4

Source hash: sha256:403c767c3ecc21f2ef0078dbca5116f9e88712797653cea87a8910822fe6c5c1

---
name: adopt
description: Existing-project adoption. In a repository that already has code, traces one representative flow per capability candidate and reverse-derives Layer 0 and capability design zones. Use for adopting an existing project, reverse-deriving codebase documents, or creating and repairing capability documents in a brownfield.
---

## migration-a0002 — migration:SKILL.md:6-6

Source hash: sha256:e4041e9b5b39184fe9cb7c587d9b26507579625738918ac27921187e25db40a8

# adopt — Existing-Project Adoption

## migration-a0003 — migration:SKILL.md:8-11

Source hash: sha256:718423bfb1578839c2be125810bffb41b027110ee6448aa9a216d4dd1501e7b5

glossary.md is an always-read Layer 0 baseline. Align reverse-derived capability composition
with exact canonical terms in capability-header `Concepts:`. On `marker.glossary-term`,
consume only the tool payload, first land the glossary definition in a binding commit while
retaining the marker, then in the next `adopt — capabilities` batch align the glossary definition and every known affected `Concepts:` line, refresh every Design head, and delete the marker. Never infer semantic ownership from a card number for a shared term or project-root `[]`.

## migration-a0004 — migration:SKILL.md:13-19

Source hash: sha256:53c7ba10fb2281fc49656f47c0477a348a49316e551c193f448bc89d8016de5e

First read the canonical rules (`../principles/SKILL.md`) and the planning evidence discipline
(`../principles/planning-evidence.md`). Read the canonical capability knowledge baseline
predicates (`../principles/baseline-predicates.md`) under the capsule gate in the next paragraph.
If present, read all of
`devflow/project/product.md`, `devflow/project/arch.md`, `devflow/project/code-style.md`,
`devflow/project/design.md`, `devflow/project/glossary.md`, `devflow/journal.md`, and each
legacy `ADR-NNN.md` directly under `devflow/project/decisions/`.

## migration-a0005 — migration:SKILL.md:21-27

Source hash: sha256:ae1cc020df413c369a98fe25de9da5a134f3a827e89ccff42c3eba97287e98d0

Read the baseline predicates with the range from `## Domain knowledge capsules` up to but
not including `## Metadata and freshness` left out. When this run actually processes a source
document the user named into capsules, or the capability document it derives is about to
exceed that canon's total cap, open and write from that range in full first. Whether capsules
exist on disk right now is not part of this judgment — the first capsule is always born in a
project that has none. When either side is unclear, or the two headings cannot be found, read
all of it.

## migration-a0006 — migration:SKILL.md:29-32

Source hash: sha256:373b18551702339e19c12d2d50e75fff0ed112ce494a78eda74652203f17c2cd

Run `node ../principles/scripts/project-state.mjs state --capability <capability number>`
for each capability document in scope. Its `baseline:` lines carry the expected set, path
state, boundary, shape, freshness, and `legacy v0.10` judgments; take them as they stand.
Read the baseline predicates for what earns a place in a body.

## migration-a0007 — migration:SKILL.md:34-37

Source hash: sha256:9b9b509842f97823ef9e047f9af64ca3fe21ccba29d05da80e9c3cc2d4a37d99

Purpose: give a **brownfield** (a project that already has code, joined mid-way) its
Layer 0 documents (product.md · arch.md · code-style.md · glossary.md) by
reverse-derivation, inherited from then on. Do not interview. Reverse-derive.
This procedure IS the "understanding stage" — split does not run without it.

## migration-a0008 — migration:SKILL.md:39-43

Source hash: sha256:eb7a8b402d9582c41c83adac76f28b8d61ce7f17dd2e042105fb12c39e1a7360

The output-format reference is bounded. From `../product/SKILL.md`, read from
`Output — devflow/project/product.md` up to but not including `Gates`. From
`../arch/SKILL.md`, read `Verify-channel decision` and from `Output — devflow/project/arch.md` up to but not
including `Capability documents — final output after Layer 0`. Do not read or execute interview or procedure text outside those
ranges.
