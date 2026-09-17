# Prompt authoring policy

## The 7 Prompt Principles

1. **One working language; one word per concept.** The exact `Working language: <owner-confirmed description>` line in `.devflow/project/product.md` is the sole durable language choice. Semantic prose that devflow authors or revises follows it. If that line is absent from a legacy managed project, preserve each target artifact's already coherent prose language until Product reconfirms it; do not rewrite merely to add the line. Preserve fixed schema headings and keys, paths and slugs, commands, API and code identifiers, provenance literals, exact canonical terms, and quoted source text as their contracts require. Register project-specific terms in `.devflow/project/glossary.md` and use the same word everywhere, to the end.
2. **Destination over instruction.** Write "what must become true," not "what to do."
3. **Rich direction, short prohibitions.** Give context, intent, and the "why" generously.
   Keep the harness (prohibitions) to 3 lines or fewer.
4. **Never prescribe the method.** The executing model decides how to implement.
5. **One example beats five rules.**
6. **Avoid off-the-shelf methodology terms.** Words like spec-driven, TDD, DDD drag in
   baggage you did not choose.
7. **Repeat the identity.** Copy the identity paragraph from `product.md` verbatim into
   every task card (exception: research cards — direct's research card section).
   This is the only duplication allowed — it costs one paragraph and
   buys "never getting lost."
