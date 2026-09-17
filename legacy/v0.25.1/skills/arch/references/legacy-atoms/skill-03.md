# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0020 — migration:SKILL.md:83-83

Source hash: sha256:85e1ece0c6ea52209a4e58ab642b973947e579a031ff5c285008bda0c254d4ad

### 2. Stack questions — in one batch

## migration-a0021 — migration:SKILL.md:84-87

Source hash: sha256:fc6c496617e4e9ed055fa5ae212804acaf8dcd9779dcefaaa71ce227efcc1cde

For each component whose survival facts are confirmed, give 2–3 candidates + my
recommendation + a one-line reason. Do not use a comparison table for a stack question;
state the default. That prohibition applies only to this question format and does not bar
the conditional design comparison below.

## migration-a0022 — migration:SKILL.md:89-93

Source hash: sha256:f547a2997aa38a404921e9f652739923cecc448578d52f85cb7915bb13b76fe1

Only when a choice is hard to reverse, its boundary is non-obvious, and current evidence
explains a real trade-off, compare one counter-design with the current design. When those
conditions do not hold, create no candidate, question, or output. If current evidence
cannot distinguish the two, ask with success criteria and user priorities; a differently
worded version of the same design is not a candidate.

## migration-a0023 — migration:SKILL.md:94-94

Source hash: sha256:1e3fb8376abea7ba07534752541709508d647eb361acbff2c73aad7303f26826

### 3. Derived questions — decisions that only exist once the stack is chosen

## migration-a0024 — migration:SKILL.md:95-99

Source hash: sha256:146ec85445125dc5ccec0b8bfc83f1a995009a765ea70feaa8e48ef5a3361089

Find the decisions that fork because of the chosen stack and ask them as one batch —
per decision, same format as step 2.
(e.g., choosing Next.js → server/client boundary, data-fetching location, auth storage)
These cannot be pre-listed — create them on the spot from the stack.
**The decisions made here become the "Project choices" section of code-style.md.**

## migration-a0025 — migration:SKILL.md:101-101

Source hash: sha256:74ad2af93128fc0c7276dc86406702230f7b1592cefad1959cd98d72ed5a3b15

### 4. Code structure decision

## migration-a0026 — migration:SKILL.md:102-102

Source hash: sha256:67d501d8d60dd5778e1ea8a38531850cdfdcf9aae8f70fd49c3893320c6c52b3

The criterion is what AI operates well with. Where that differs from human preference:

## migration-a0027 — migration:SKILL.md:104-104

Source hash: sha256:fcf5b6d2863ff6c897883539e6d117f42b05d4073bf29681a68bc8a86b938dd3

- File names unique and searchable (`user-repository.ts`; don't multiply `index.ts`)

## migration-a0028 — migration:SKILL.md:105-105

Source hash: sha256:5cd2415b9bf428fb8a3d4f9b30a83545a1759d2ac7487787decc8245eb217970

- No implicit wiring — what is not written in code does not exist for AI

## migration-a0029 — migration:SKILL.md:106-106

Source hash: sha256:c8896bcb5e3ded6d6d6f32948830c06fb7c27e5481a08467aed59750201db6bb

- Folder depth ≤ 3, files ≈ 400 lines or fewer

## migration-a0030 — migration:SKILL.md:107-108

Source hash: sha256:dd6ea65d4d5c003c56d436906d0870734210435189af33d8001d56b995199bb1

- Contracts (types/schemas) in one file per module boundary


## migration-a0031 — migration:SKILL.md:109-110

Source hash: sha256:95ced8084e5a441d4808eba3fcb2616f38df2758ca48009f45a106acd07ebfcf

The A/B/C table under Output is the canonical registry of structure choices and their
conditions. Select one for the scale.

## migration-a0032 — migration:SKILL.md:112-112

Source hash: sha256:5aaa76cc09c66cae778ccede31c84424d2a3f6f7752586e12de6bf1abc21f4da

**Folder name = capability name from product.md.** Documents and code use the same words.

## migration-a0033 — migration:SKILL.md:114-114

Source hash: sha256:d1ea038a474eb28f0a4f9c490391416a4ddf617bbc6fa105efecb99c6aa5b772

### 5. Verify-channel decision — a pass-gate

## migration-a0034 — migration:SKILL.md:115-115

Source hash: sha256:24dc7fc9cdbf08f7dc9bbe16f8921d4e74c0ddb8846ea5b9e12ef763a4097de4

This skill does not finish until it is decided.

## migration-a0035 — migration:SKILL.md:117-121

Source hash: sha256:e9094ae49fd27283e670b6b47e5c3fb95f99edbaba9dd316d3a5cba9ea38a95e

Do not judge a channel decided from its name or an installation sentence. Confirm that the
commands or tools below can actually run in the current environment. Use an allowed safe
execution; when writing, cost, or authority is required, request exact permission or route
to Provisional according to whether the planning evidence discipline classifies it as
blocking. Do not bind an unconfirmed blocking channel in arch.md.
