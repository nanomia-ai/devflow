# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0067 — migration:SKILL.md:283-290

Source hash: sha256:04fef2885976214ab313980bce6ce331420e6be7b36fce8e42d7cd8eb068ad97

Before taking confirmation on arch.md, enumerate together the decisions in it that meet
all three ADR conditions and those whose ground is not yet in the document, and
confirm with the user, one by one, whether each is kept. At this point also take the
development choices product left as attributed journal lines and land each beside the
conclusion it belongs to in arch.md — confirming the
technical choices product handed over is arch's ownership. A decision that is
enumerated but that the user chooses not to keep stays as it is; the enumeration is not skipped.
After it lands there is no route back to that conversation.

## migration-a0068 — migration:SKILL.md:292-293

Source hash: sha256:1f350fb61e66241515caa9d22b09aaf6a19c7ef202113dadc564da9c76ccbdb3

Immediately after the user confirms arch.md or code-style.md, land it in the canonical
Layer 0 commit.

## migration-a0069 — migration:SKILL.md:295-295

Source hash: sha256:a3cdff43c194c58a78132d092018b60de5d2a70104d29711a460cd2a46fa5d02

## Capability documents — final output after Layer 0

## migration-a0070 — migration:SKILL.md:297-299

Source hash: sha256:f47faf5a4327c833e64b8011aec3cf19dfcd87cd7f60ee4221b5be3d38cd2533

When confirmed arch.md says `Brownfield: yes`, do not run this section. Route to adopt's
capability-document-only branch; adopt owns the last commit of that run, and give the
completion guidance below only after it finishes.

## migration-a0071 — migration:SKILL.md:301-305

Source hash: sha256:03fbaabfeacae66db33390c0a876a5e4912a933f58547f75e8bf50cb030318f1

This section is the biggest single output in the tree. Before starting it, state the size of
the expected set as a document count. When the harness warns about context, do not start it —
end this run at the confirmed Layer 0 commit, say that this run is not arch's completion, tell
the user that with no card claimed the next session enters through resume and runs only this
section, and give none of the completion guidance below.

## migration-a0072 — migration:SKILL.md:307-309

Source hash: sha256:78ecbcdb91ba2eae1cd7ee63dbe9bd1531028979cbec9e564ecacb0bbf8b46d3

After confirmed product.md, arch.md, and glossary.md have all landed in HEAD, run the
canonical baseline predicates' design-writer procedure. Calculate `Design head` from the
current command output for those three paths.

## migration-a0073 — migration:SKILL.md:311-313

Source hash: sha256:4c7aa93d26c883937f1e252dd969f1829aa9f387c7abb9b63d21de038aef56e0

- The expected set is `01-foundation.md` plus one document for every non-retired
  capability in product.md. Assign numbers by the canonical baseline predicates'
  disk-first rule.

## migration-a0074 — migration:SKILL.md:314-316

Source hash: sha256:7f091defed3463b292d8c011af7423bd3a4ddc5393dd67057855df020aff0b9c

- Derive only purpose, boundary, Intent overview, Concept model, invariants, non-goals, and
  the binding ADRs cited by current statements, organized per capability. Do not put planned
  flows, entry points, code fields, code-style.md content, or design.md content in the design zone.

## migration-a0075 — migration:SKILL.md:317-321

Source hash: sha256:6e24c941dd7eee2fc8123ed8a32588d6704b20f15e4c3a3098b660d909aa9ad8

- Domain knowledge overflowing the capability-document budget moves down into the canonical
  baseline predicates' knowledge capsules. Processing a source document uses adopt's capsule
  procedure under the same contract, and capsules ride the same commit as the canonical
  baseline predicates' design batch.
