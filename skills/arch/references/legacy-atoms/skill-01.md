# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0001 — migration:SKILL.md:1-4

Source hash: sha256:6ebdae633a9320b040cc77f1b4db5a4f1a943e652bd5bea24203aa44c238cca4

---
name: arch
description: Development planning. Takes product.md and decides components, stack, code structure, and the verify channel, then writes capability design zones. Use for stack selection, architecture design, or creating and repairing capability documents in a new project.
---

## migration-a0002 — migration:SKILL.md:6-6

Source hash: sha256:6c323da00aae13e379eecf760c64102fcfaad9e496ac6e23f780473a83b44c2e

# arch — Development Planning

## migration-a0003 — migration:SKILL.md:8-11

Source hash: sha256:d3268efe9180ffbea9aa97761f9ea291dbe61c0979fcb364a0d422a68939efa6

glossary.md is an always-read Layer 0 baseline. When capability composition changes, align
capability-header `Concepts:` to exact canonical terms. On `marker.glossary-term`, consume
only the tool payload, first land the glossary definition in a binding commit while retaining
the marker, then in the next `arch — capabilities` batch align the glossary definition and every known affected `Concepts:` line, refresh every Design head, and delete the marker. Shared terms remain in several headers; `[]` is project-root context.

## migration-a0004 — migration:SKILL.md:13-19

Source hash: sha256:83d2f46c92ed6c0cea2f8c7e5940db3f1bad62877defb8bc4b60daa77d04b6b7

First read the canonical rules (`../principles/SKILL.md`), the planning evidence discipline
(`../principles/planning-evidence.md`), and all of `devflow/project/product.md`. Read the
canonical capability knowledge baseline predicates (`../principles/baseline-predicates.md`)
under the capsule gate in the next paragraph.
If present, read all of `devflow/project/arch.md`,
`devflow/project/code-style.md`, `devflow/project/glossary.md`, `devflow/journal.md`, and each legacy `ADR-NNN.md` directly under
`devflow/project/decisions/`.

## migration-a0005 — migration:SKILL.md:21-27

Source hash: sha256:ae1cc020df413c369a98fe25de9da5a134f3a827e89ccff42c3eba97287e98d0

Read the baseline predicates with the range from `## Domain knowledge capsules` up to but
not including `## Metadata and freshness` left out. When this run actually processes a source
document the user named into capsules, or the capability document it derives is about to
exceed that canon's total cap, open and write from that range in full first. Whether capsules
exist on disk right now is not part of this judgment — the first capsule is always born in a
project that has none. When either side is unclear, or the two headings cannot be found, read
all of it.

## migration-a0006 — migration:SKILL.md:29-31

Source hash: sha256:991b524289c9c2da185f5d2ae77dd478dc0f26caa4362807822039ab7988f5b5

If `product.md` is missing: with no code either, direct the user to the product stage
first; with existing code, to adopt (existing-project adoption — it produces
product.md too, by reverse-derivation).

## migration-a0007 — migration:SKILL.md:33-36

Source hash: sha256:373b18551702339e19c12d2d50e75fff0ed112ce494a78eda74652203f17c2cd

Run `node ../principles/scripts/project-state.mjs state --capability <capability number>`
for each capability document in scope. Its `baseline:` lines carry the expected set, path
state, boundary, shape, freshness, and `legacy v0.10` judgments; take them as they stand.
Read the baseline predicates for what earns a place in a body.

## migration-a0008 — migration:SKILL.md:38-41

Source hash: sha256:d4943759175dc60429bd16b890fe077bd9647137cc93099a3d98f168db11d12e

If resume routed here because Layer 0 is complete and only capability documents are
missing or need repair, do not run steps 1–5 or modify arch.md or
code-style.md. Keep the confirmed documents unchanged and run only `Capability documents`
below.
