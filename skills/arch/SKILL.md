---
name: arch
description: Development planning. Takes product.md and decides components, stack, code structure, and the verify channel, then writes capability design zones. Use for stack selection, architecture design, or creating and repairing capability documents in a new project.
---

# arch — Development Planning

First read the canonical rules (`../principles/SKILL.md`), the canonical capability
knowledge baseline predicates (`../principles/baseline-predicates.md`), and all of
`devflow/project/product.md`. If present, read all of `devflow/project/arch.md`,
`devflow/project/code-style.md`, `devflow/project/glossary.md`, `devflow/journal.md`, and each `.md` file directly under
`devflow/project/decisions/`.
If `product.md` is missing: with no code either, direct the user to the product stage
first; with existing code, to adopt (existing-project adoption — it produces
product.md too, by reverse-derivation).

If resume routed here because Layer 0 is complete and only capability documents are
missing or need repair, do not run steps 1–5 or modify arch.md or
code-style.md. Keep the confirmed documents unchanged and run only `Capability documents`
below.

If resume routed here to complete one missing arch.md field — `Brownfield`, or `integration`
and `merge` — do not run steps 1–5 either. Ask only that one question, add only that field
or those two lines, land the canonical Layer 0 commit, and change nothing else.

Purpose: translate the service plan into a development plan, producing
`devflow/project/arch.md`.

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
Find the decisions that fork because of the chosen stack and ask them as one batch —
per decision, same format as step 2.
(e.g., choosing Next.js → server/client boundary, data-fetching location, auth storage)
These cannot be pre-listed — create them on the spot from the stack.
**The decisions made here become the "Project choices" section of code-style.md.**

### 4. Code structure decision
The criterion is what AI operates well with. Where that differs from human preference:

- File names unique and searchable (`user-repository.ts`; don't multiply `index.ts`)
- No implicit wiring — what is not written in code does not exist for AI
- Folder depth ≤ 3, files ≈ 400 lines or fewer
- Contracts (types/schemas) in one file per module boundary

The A/B/C table under Output is the canonical registry of structure choices and their
conditions. Select one for the scale.

**Folder name = capability name from product.md.** Documents and code use the same words.

### 5. Verify-channel decision — a pass-gate
This skill does not finish until it is decided.

| Type | Channel | If missing |
|---|---|---|
| Has a frontend | **A browser-control tool that can inspect rendered output and interact with it is required** (one provided by the active platform) | Guide connection of an available tool, then stop. UI verification you cannot see is guesswork |
| Non-web with a screen (desktop app · TUI) | A tool that reads the screen/accessibility tree or real output + an operating-procedure document (process safety included) | Guide installation, then stop. Same reason |
| Web backend | Real HTTP calls (`.http` file / curl scripts) | Create it as the first task |
| CLI / daemon | Run command + expected output (+ health check, log location) | Create it as the first task |
| Library | Test runner | Create it as the first task |

Git check: if not a repository, propose `git init`. All recovery and undo in this system
depends on git.

## Output — devflow/project/arch.md

The `Code structure` value must use one of these choices.

| | Structure | When |
|---|---|---|
| A | Domain-vertical modules — route·service·repo·test all inside `src/<capability>/` | Default recommendation. 3+ capabilities |
| B | Feature-Sliced | Screen-heavy frontends |
| C | Flat — just files under `src/` | Under 20 files. A would be overkill here |

```markdown
# Architecture

Brownfield: no

## Components       <!-- ✔/✘ + 1-line reason -->
## Stack            <!-- item: choice — 1-line reason -->
## Code structure   <!-- A/B/C + folder sketch. folder name = capability name -->
## Data             <!-- core entities only -->
## Existing records <!-- Brownfield only. each line: <capability name|shared>: <exact path>. omit if empty -->
## Provisional      <!-- values you are guessing. see below. omit the section if empty -->
## Risks            <!-- 3 things that break first + how to check each -->
## Out of scope     <!-- what this architecture does not carry -->

frontend: none | needed
verify_channel:
  work server: <run command + port>     # verification always happens here
  means: <browser-control tool | .http | CLI command | screen/accessibility tool>
integration: <branch>                   # where minting, closure, and binding decisions land. The current branch when one person works alone
merge: merge-commit | rebase            # Squash forbidden — it erodes NN.N history
```

`Brownfield` records whether implementation code existed before devflow entered this
repository. arch writes `no` for a new project; adopt writes `yes` when deriving from
existing code. This value selects how the first tree is created; it is not implementation
progress. When an existing arch.md lacks only the `Brownfield` field, ask that one
question, add only the field, and change nothing else.

The default for `integration` is the current branch, and in a folder that is not a Git
work tree it is `none`. The canonical rules govern what each value then means.

`Existing records` is only a locator index for handoff and specification files that
adopt checked against code. Each line contains a product.md capability name or `shared`,
a colon, and one exact file path. The same name may repeat on multiple lines. A path here
is not a read instruction and does not make the file canonical. work opens it only after
split rechecks it for the change scope and puts it in the card's `Read first`.

### Provisional — the architecture you do not know yet

Buffer sizes, timeouts, whether a backpressure protocol is needed at all — some things
cannot be settled by thinking. The moment a guess is written in the same sentence form
as a decision, the architecture document starts lying.

**Every value you are guessing goes in this table, and every row names the card that
will settle it.** No settling card means you do not intend to find out — then it is not
provisional, it is a decision, and it belongs in the sections above. This table is not a
progress record; it is a list of the unknown.
If the settling card's number is not known yet (no tree, or its layer not yet opened),
write 'unminted' in the Settled-by cell — split, when opening the layer that settles
that row, creates the card and replaces the cell with its number (that row of the
discovery→update table).

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

Where the project-specific decisions created by the selected stack get written down. **Every entry
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

Immediately after the user confirms arch.md or code-style.md, land it in the canonical
Layer 0 commit.

## Capability documents — final output after Layer 0

When confirmed arch.md says `Brownfield: yes`, do not run this section. Route to adopt's
capability-document-only branch; adopt owns the last commit of that run, and give the
completion guidance below only after it finishes.

After confirmed product.md, arch.md, and glossary.md have all landed in HEAD, run the
canonical baseline predicates' design-writer procedure. Calculate `Design head` from the
current command output for those three paths.

- The expected set is `01-foundation.md` plus one document for every non-retired
  capability in product.md. Assign numbers by the canonical baseline predicates'
  disk-first rule.
- Derive only purpose, boundary, Concept model, invariants, non-goals, and the binding
  ADRs cited by current statements, organized per capability. Do not put planned flows,
  entry points, code fields, code-style.md content, or design.md content in the design zone.
- When a HEAD file has the canon's exact `legacy v0.10` shape, apply the canonical mechanical
  migration and include it in the design-confirmation batch. Do not treat it as boundary
  damage or a data-loss reset.
- For any other file, if it is absent under the canon's initial-creation definition, create its initial verified zone too. If an existing file has
  exactly one fixed boundary, preserve its verified-zone bytes. If it has zero or more
  than one boundary and the user did not choose in resume to discard the old verified
  prose and reset it, do not write it; report `baseline no-op: <reason naming the exact path>`. After
  the user chooses reset with the data loss and HEAD blob ID stated, reset the whole file from
  current Layer 0 design plus the empty initial verified scaffold and include it in the
  ordinary design-batch confirmation below.
- Do not change retired files. When re-derivation yields the same design zone, preserve
  the existing bytes.
- Before changing disk, present all design zones that would change as one batch and obtain
  user confirmation. Change no capability-document path before confirmation. Then put only
  changed capability documents in one `arch — capabilities` commit. It is this run's last
  commit and carries no Layer 0 path. If no file changes, ask no confirmation question and
  do not commit.

When a capability retires or splits, or another code-boundary change alters path ownership, run
the canonical baseline predicates' consumer projection and report the registered
consumers in one line. The report triggers neither verification nor card creation.

On completion: if `frontend: needed` — "design (optional) or split"; if `none` — "split."
