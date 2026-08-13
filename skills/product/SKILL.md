---
name: product
description: Service-planning interview. Defines the problem, capability composition, and boundaries of a new project, producing devflow/project/product.md. Use when starting a new project, planning a service, defining a product, or deciding MVP scope.
---

# product — Service Planning

First read the canonical rules (`../principles/SKILL.md`). If present, read all of
`devflow/journal.md`, `devflow/project/product.md`, and `devflow/project/glossary.md`.
Read the existing `devflow/project/arch.md` only when choosing the next stage after a
re-run.

When `product re-run pending` lines exist, order them by timestamp and then journal line
order, decode each `statement-json` as a JSON string, and present the disproved source
text in this interview. Report as an integrity anomaly a line that begins with that
prefix but does not have the exact format or decode as a JSON string. Do not guess from
or delete that line, and do not start the re-run until the user confirms the source text
again. Repair follows the canonical integrity check's item-12 recovery.

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
- For every capability, always ask exactly one question: **"If this capability is removed
  from the MVP, can every success criterion still pass?"** If yes → MVP-exclusion candidate.

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

When a confirmed product.md exists and only glossary.md is missing, do not repeat the
interview or modify product.md. Copy terms whose meanings product.md already fixes, ask
one question batch only for terms that lack definitions, and create only glossary.md.

The capability list is append-only — a retired row keeps its place, rows are never deleted
or reordered, and additions go at the end of the list. The number of a capability not yet
holding one on disk is derived from that position (the canonical rules' status notation).

When a capability retires during maintenance, do not delete it from the list — leave one
line: `④ ~~name~~ — retired (date, evidence pointer)` (numbers are immutable
identifiers). The capability's tree folder gets `.stale` (the canonical rules' status
notation). If the capability is still a waiting file, give that file `.stale.md` instead.
Under `Brownfield: no`, when a retired capability has no tree representation, create its
`.stale.md` waiting file in the same retirement commit.
When a brownfield has no tree representation for it, create none. Leave the baseline file
in place; the next capability-design refresh reports registered consumers from the retired
file's stored Scope paths.

**Before** asking the user to confirm the retirement, run the canonical rules' retirement
observation gate — enumerate under a bound every `capability note` line carrying that
number. Zero lines proceed as they are. With one or more, show each line verbatim and ask
whether to discard it or re-target it to foundation or an exact non-retired capability
number. Put the chosen replacement or deletion in the retirement commit; when the user
defers, the retirement defers too. Never discard automatically.

## Gates

- If a success criterion is not verifiable as written, it does not pass. Ask again.
- Immediately after the user confirms product.md, or glossary.md created alongside it,
  land it in the canonical Layer 0 commit; a run grounded by `product re-run pending` uses
  the binding-decision commit below instead.
- When this run was grounded by `product re-run pending` journal lines, after the user
  confirms the identity paragraph, Capabilities, Boundary, and success criteria, perform
  every action in the canonical discovery→update row that matches each change. Put the
  product.md change, every status rename and marker required by those rows, and deletion
  of the lines addressed by this run in one binding-decision commit. If interrupted before
  that commit, delete no pending line. Leave any line this run did not address.
- After the first creation, one line — "next is arch." For every re-run, first compare the
  confirmed changes with arch's Components, Stack, Code structure, Data, and verify_channel.
  If any confirmed change contradicts a current statement there, say "next is arch." If arch
  retains `Brownfield: yes`, adopt refreshes only the capability design zones after that run.
  When there is no contradiction but the capability list, a capability name, or a capability
  boundary changed, direct the next stage to adopt's capability-design refresh with
  `Brownfield: yes`, and to arch's with `Brownfield: no`. Those two refreshes repeat neither
  the Layer 0 interview nor reverse-derivation. Otherwise, if a tree exists say "next is
  resume"; if no tree exists, say "next is split."
