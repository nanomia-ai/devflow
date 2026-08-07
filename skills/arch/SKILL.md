---
name: arch
description: Development planning. Takes product.md and decides components, stack, code structure, and the verify channel, producing devflow/project/arch.md. Use for stack selection, architecture design, or reverse-deriving from an existing codebase.
---

# arch — Development Planning

First read the canonical rules (`../principles/SKILL.md`) and `devflow/project/product.md`.
If `product.md` is missing: with no code either, direct the user to the product stage
first; **with existing code, produce product.md too via the brownfield procedure below.**

Purpose: translate the service plan into a development plan, producing
`devflow/project/arch.md`.

**Brownfield (joining a project that already has code):** do not interview. Reverse-derive.
This procedure IS the "understanding stage" — split does not run without it.

1. **Trace the flow.** Follow one representative request from the entry point to the end,
   confirming capability boundaries with your own eyes. Code is truer than documents.
2. From code, README, and commit history, **reverse-derive the identity paragraph and the
   capability list** into a condensed `product.md`. No full interview — just one batch of
   confirmation questions (to correct anything mis-derived).
   Start `glossary.md` from the terms the code actually uses — the code's words are canonical.
3. Reverse-derive arch.md, present it as a draft, and get user confirmation. Inherited
   forever after.
4. **Reverse-derive code-style.md as well.** What the code already does is canonical —
   do not impose the default values and split the style in two.
5. **Never backfill the tree with already-finished code.** `devflow/tree/` starts from
   work done after adoption — filling it with `.done.` cards for existing features is
   waste. Only align capability folder names with the reverse-derived capability list,
   so new work accumulates in the right place.

## Procedure — in exactly this order

### 1. Component derivation — I judge first, you only confirm
From the capability list in product.md, derive the needed components, each with a
one-line reason.

```
✔ backend API    (①②③ all need server state)
✔ DB             (registration data must persist)
✘ queue/worker   (no async work — revisit when ⑤settlement arrives)
Correct?
```

### 2. Stack questions — in one batch
2–3 candidates per component + my recommendation + a one-line reason. No comparison
tables. State defaults.

### 3. Derived questions — decisions that only exist once the stack is chosen
Find the decisions that fork because of the chosen stack and ask them as one batch.
(e.g., choosing Next.js → server/client boundary, data-fetching location, auth storage)
These cannot be pre-listed — create them on the spot from the stack.
**The decisions made here become the "Project choices" section of code-style.md.**

### 4. Code structure decision
The criterion is what AI operates well with. Where that differs from human preference:

- File names unique and searchable (`user-repository.ts`; don't multiply `index.ts`)
- No implicit wiring — what is not written in code does not exist for AI
- Folder depth ≤ 3, files ≈ 400 lines or fewer
- Contracts (types/schemas) in one file per module boundary

Choose structure by scale:

| | Structure | When |
|---|---|---|
| A | Domain-vertical modules — route·service·repo·test all inside `src/<capability>/` | Default recommendation. 3+ capabilities |
| B | Feature-Sliced | Screen-heavy frontends |
| C | Flat — just files under `src/` | Under 20 files. A would be overkill here |

**Folder name = capability name from product.md.** Documents and code use the same words.

### 5. Verify-channel decision — a pass-gate
This skill does not finish until it is decided.

| Type | Channel | If missing |
|---|---|---|
| Has a frontend | **Browser MCP required** (Chrome DevTools MCP or Playwright MCP) | Guide installation, then stop. UI verification you cannot see is guesswork |
| Non-web with a screen (desktop app · TUI) | A tool that reads the screen/accessibility tree or real output + an operating-procedure document (process safety included) | Guide installation, then stop. Same reason |
| Web backend | Real HTTP calls (`.http` file / curl scripts) | Create it as the first task |
| CLI / daemon | Run command + expected output (+ health check, log location) | Create it as the first task |
| Library | Test runner | Create it as the first task |

Git check: if not a repository, propose `git init`. All recovery and undo in this system
depends on git.

## Output — devflow/project/arch.md

```markdown
# Architecture

## Components       <!-- ✔/✘ + 1-line reason -->
## Stack            <!-- item: choice — 1-line reason -->
## Code structure   <!-- A/B/C + folder sketch. folder name = capability name -->
## Data             <!-- core entities only -->
## Provisional      <!-- values you are guessing. see below. omit the section if empty -->
## Risks            <!-- 3 things that break first + how to check each -->
## Out of scope     <!-- what this architecture does not carry -->

frontend: none | needed
verify_channel:
  work server: <run command + port>     # verification always happens here
  means: <browser MCP | .http | CLI command | screen/accessibility tool>
integration: <branch>                   # multi mode only. Where minting, closure, and binding decisions land
merge: merge-commit | rebase            # multi mode only. Squash forbidden — it erodes NN.N history
```

### Provisional — the architecture you do not know yet

Buffer sizes, timeouts, whether a backpressure protocol is needed at all — some things
cannot be settled by thinking. The moment a guess is written in the same sentence form
as a decision, the architecture document starts lying.

**Every value you are guessing goes in this table, and every row names the card that
will settle it.** No settling card means you do not intend to find out — then it is not
provisional, it is a decision, and it belongs in the sections above. This table is not a
progress record; it is a list of the unknown.

```markdown
| Item | Provisional value | Where it came from | Settled by |
|---|---|---|---|
| stream batch size | 64 KiB | copied from <reference> | 01.3 |
```

The contract: when the settling card closes, work's upper-document feedback step checks
this table, and the row is **replaced** by the measured result — promoted into a
decision, or deleted as unnecessary. A row that outlives its own settling card is a bug
in the process, not a detail. Where a provisional value also appears elsewhere in the
body, mark it provisional there too.

An ADR (Architecture Decision Record — one page per decision: context, options,
decision, consequences) goes into `devflow/project/decisions/ADR-NNN.md` **only when all
three conditions hold**:

```
① hard to reverse  ② non-obvious enough that a future reader would wonder  ③ real alternatives were examined
(e.g., JWT instead of sessions for auth = passes / library A instead of B = fails)
```

## Output 2 — devflow/project/code-style.md

Where the decisions from the derived questions (step 3) get written down. **Every entry
states "what we prioritize" — never "do it this way."** The implementer decides the
method. Cap: 1 page.

```markdown
# Code Style

## Values                        <!-- present these 7 as defaults; curate to fit the project -->
- Few deep modules > many shallow helpers.
  A good module is one whose deletion scatters complexity onto its callers
- Return results > mutate state. Prefer code where the same input yields the same output
- Explicit beats magic. A connection not written in code does not exist
- Tests verify public-interface behavior like a spec. Never mock internals
- Never swallow errors. Handle them or throw them upward
- Delete dead code. Commented-out code is remembered by git
- Comments say "why" only. The code says "what"

## Project choices               <!-- only decisions the model cannot know -->
- (e.g.) validation: zod / errors: Result type, no throw / HTTP: shared/http.ts only / time: UTC

## Trust boundary
- Posture: strict | standard | minimal    <!-- the project's nature sets the dial -->
- Boundary list: <points where external input enters>. Input crossing a boundary is
  treated as hostile

## Non-goals                     <!-- this project's 2–3 YAGNI declarations -->
```

On completion: if `frontend: needed` — "design (optional) or split"; if `none` — "split."
