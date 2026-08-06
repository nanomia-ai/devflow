---
name: product
description: Service-planning interview. Defines the problem, capability composition, and boundaries of a new project, producing devflow/project/product.md. Use when starting a new project, planning a service, defining a product, or deciding MVP scope.
---

# product — Service Planning

First read the canonical rules (`../principles/SKILL.md`).

Purpose: complete the service plan through an interview with the user, producing
`devflow/project/product.md`.
This stage is **service** planning — do not bring up, or entertain, development talk
(stack, DB, framework, architecture). If the user starts talking development, defer it
with one line — "that belongs to arch" — and return.

## The Six Judgments (= the table of contents of product.md)

| Judgment | Question |
|---|---|
| Problem | Who suffers, because of what, and how badly |
| Approach | Why this approach. Which approaches were discarded |
| Capability composition | What chunks (capabilities) are needed to solve this problem |
| Boundary | How far does the MVP go. What will **not** be built |
| Success criteria | What counts as success — stated verifiably, always |
| Screens & access points | Where do users reach the service |

**Capability composition is the heart.** The capability names chosen here become the
module names in the architecture and the folder names in the task tree — the same words,
followed to the very end.

## Interview Rules

- **Always ask questions in batches.** No single-question round-trips. One batch = one
  axis (audience & value / boundary / unresolved), 3–5 questions.
- **Attach my default (recommendation) to every question.** State explicitly:
  "unanswered items proceed with the default."
- Scale rounds actively to scope:
  - 1–3 capabilities → 1–2 rounds. Shallow. Over-questioning is itself waste
  - 4–7 capabilities → 3 rounds. Dig into each capability
  - 8+ capabilities → stop, say "this is not one project," and propose a split
- For every capability, always ask exactly one question: **"Does the service still stand
  without this?"** If no → MVP-exclusion candidate.

## Output — devflow/project/product.md

```markdown
# <service name>

<identity paragraph — exactly this form. This paragraph gets copied into every task card>
This service solves <problem> that <who> suffers because of <what>, by <approach>.
When it succeeds, <what> becomes possible.

## Problem
## Approach            <!-- include 1 line per discarded approach -->
## Capabilities        <!-- ① ② ③ number + name + one-line description. These names go all the way -->
## Boundary            <!-- MVP scope / will-not-build (explicit) -->
## Success criteria    <!-- 3–7 verifiable acceptance criteria -->
## Screens & access points   <!-- list of screens or interfaces -->
## Open questions

interface: web | desktop | cli | server-only | tui | mixed
```

Create alongside it: `devflow/project/glossary.md` — project terms fixed during the
interview, one `term: definition` line each.

When a capability retires during maintenance, do not delete it from the list — leave one
line: `④ ~~name~~ — retired (date, evidence pointer)` (numbers are immutable
identifiers). The capability's tree folder gets `.stale` (the canonical rules' status
notation).

## Gates

- If a success criterion is not verifiable as written, it does not pass. Ask again.
- On completion: one line — "next is arch."
