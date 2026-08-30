# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0028 — migration:SKILL.md:127-139

Source hash: sha256:1be96941c59f9b27cf00215819af751cd971d6c26dc297f240fb2b38bf568a3f

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

## migration-a0029 — migration:SKILL.md:140-151

Source hash: sha256:afc8112d494a2be5a8525d3cf32da1a4c64ccd836fe5fa84b78a58ed833b8762

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

## migration-a0030 — migration:SKILL.md:152-154

Source hash: sha256:f8bd43dbf343e171a2cbde096665a7458f35e795460f6f81992f93daae0590ca

4. **Reverse-derive code-style.md as well, in the arch skill's "Output 2" format.**
   What the code already does is canonical — do not impose the format's default
   Values and split the style in two.

## migration-a0031 — migration:SKILL.md:155-159

Source hash: sha256:29e5023ad03faecc931da6460c042cd41169800e447b27662dda4a357e9c4009

5. **Never backfill the tree with already-finished code.** `devflow/tree/` starts from
   work done after adoption — filling it with `.done.` cards for existing features is
   waste. Opening the tree is split's job — capability folder names must be the same
   words as the reverse-derived capability list, so new work accumulates in the right place.


## migration-a0032 — migration:SKILL.md:160-164

Source hash: sha256:6da4b584d114a34a98a4d071a9316fc9537c58a5f4ebdbe00ef5bb15b7eb23d2

In a new adoption, when the user has already requested a post-adoption change, first append
split's exact `maintenance routing pending` line to journal and land it with the confirmed
adoption documents in the canonical Layer 0 commit. With no request, put only the adoption
documents in that commit. An existing project's capability-document-only branch makes no
new Layer 0 commit here.
