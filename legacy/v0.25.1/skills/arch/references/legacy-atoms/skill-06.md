# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0055 — migration:SKILL.md:206-210

Source hash: sha256:fcae22a904193e4dd183c5484a50fc850615f470488a3bbe737318426391ba9c

`Existing records` is only a locator index for handoff and specification files that
adopt checked against code. Each line contains a product.md capability name or `shared`,
a colon, and one exact file path. The same name may repeat on multiple lines. A path here
is not a read instruction and does not make the file canonical. work opens it only after
split rechecks it for the change scope and puts it in the card's `Read first`.

## migration-a0056 — migration:SKILL.md:212-212

Source hash: sha256:ae28e7ee9357a24d40ec5031439b31db41b171533c9c8b1b6d37add0008c7a5e

### Provisional — the architecture you do not know yet

## migration-a0057 — migration:SKILL.md:214-216

Source hash: sha256:199e8f92aa96baacf8ab9f1eee81cc0a98d0a27d86c2565fc05fca271c8c2b7c

Buffer sizes, timeouts, whether a backpressure protocol is needed at all — some things
cannot be settled by thinking. The moment a guess is written in the same sentence form
as a decision, the architecture document starts lying.

## migration-a0058 — migration:SKILL.md:218-225

Source hash: sha256:2558cfd792e4e82e86a7e65d6af0fb67545fddc66e48aaa207d63912f654eaff

**Every value you are guessing goes in this table, and every row names the card that
will settle it.** No settling card means you do not intend to find out — then it is not
provisional, it is a decision, and it belongs in the sections above. This table is not a
progress record; it is a list of the unknown.
If the settling card's number is not known yet (no tree, or its layer not yet opened),
write 'unminted' in the Settled-by cell — split, when opening the layer that settles
that row, creates the card and replaces the cell with its number (that row of the
discovery→update table).

## migration-a0059 — migration:SKILL.md:227-231

Source hash: sha256:c64177ad9178d15be35eb44b3cf90c33a587c57f93bf39acf4e46dea2c94251e

```markdown
| Item | Provisional value | Where it came from | Settled by |
|---|---|---|---|
| stream batch size | 64 KiB | copied from <reference> | 01.3 |
```

## migration-a0060 — migration:SKILL.md:233-237

Source hash: sha256:8f92b9912dcce5855f4358084424408003c44cd681d03d275511a0114d515c46

The contract: when the settling card closes, work's upper-document feedback step checks
this table, and the row is **replaced** by the measured result — promoted into a
decision, or deleted as unnecessary. A row that outlives its own settling card is a bug
in the process, not a detail. Where a provisional value also appears elsewhere in the
body, mark it provisional there too.

## migration-a0061 — migration:SKILL.md:239-241

Source hash: sha256:5e71ea8b1bfcf14b4f5b69aae0a1919974119efe6dbf41e8fccd54981c685ce8

An ADR (Architecture Decision Record — one page per decision: context, options,
decision, consequences) goes into `devflow/project/decisions/ADR-NNN.md` **only when all
three conditions hold**:
