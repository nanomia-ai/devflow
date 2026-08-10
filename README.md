# devflow

> A development flow for AI sessions, connecting planning → implementation → verification. Supports Claude Code · Codex CLI.

[한국어](README_ko.md) · **English**

Every AI session starts with its memory wiped. devflow accumulates that memory **on disk,
not in conversation** — documents answer what you are building, the file tree answers how
far you have come, and the records answer why it was decided that way. Whenever a session
dies, the next one reads a small, fixed set of files and picks up where it left off.

## Quick start

```
/plugin marketplace add nanomia-ai/devflow      # Claude Code
/plugin install devflow@nanomia
```

For Codex CLI, run `codex/install.ps1` (Windows) or `codex/install.sh` (macOS/Linux) once.

The first command after installing depends on where you stand — a new project starts
with product (the planning interview), a project that already has code starts with
adopt (back-derived from the code), and open work resumes automatically when you start
a new session (the hook). Platform details live in the two install sections below;
team setup lives in "Using it in a team".

## The approach — rich direction, minimal harness

Today's top models already know how to implement. The more tightly you script the
procedure, the more the model stops judging and starts following. devflow goes the
other way: make clear what must become true (the Destination), what must not happen
(Forbidden — 3 lines max), and how done is known (an executable completion signal) —
and **never prescribe the method.** It is the smallest set of devices that keeps the
work flowing in the intended direction without getting in the model's way.

| Made explicit | Left to the model |
|---|---|
| Destination — what must become true | implementation method and code patterns |
| Forbidden — 3 lines max | the choice of tools and paths |
| Completion signal — an executable check | the order of solving |
| Coordinates · Identity — part of what? | every point that needs judgment |

This split is the baseline for the standard tier (T-mid) and above — models are named
only as tiers T-high/T-mid/T-low, and the actual mapping is chosen in split's
execution proposal. The harness scales inversely with model tier: the lower the tier
a card is written for, the more Read-first, ordering hints, and prohibitions it carries.

Light does not mean unstructured. Review and verification run in independent contexts
that never saw the implementation history; what was not executed is not "passed" — it
is "unverified"; and the harness grows one step only on a defect actually met — never
on imagined risk. How the loops turn, and what every pass leaves behind, is one table
in the work ⇄ verify section below.

## The flow

```mermaid
flowchart LR
    subgraph L0["Layer 0 · project definition — once"]
        P[product<br>what & why] --> A[arch<br>how] --> D["design (optional)<br>only with a frontend"]
        AD["adopt<br>existing code: back-derived"]
    end
    subgraph L1["Layer 1 · work loop — repeats"]
        S[split<br>break down] --> W[work<br>implement] <--> V[verify<br>check]
    end
    L0 --> L1
    R[resume · continue] -.->|the hook runs it automatically| L1
```

| Situation | Entry point |
|---|---|
| New project | product, then in order |
| Adopting in an existing project | adopt (back-derive from code) → split |
| Adding or extending features | split |
| Continuing in a new session | automatic (SessionStart hook — see the install sections), or resume |
| A teammate joins | make a room — see "Using it in a team" below |

### The first step — starting fresh vs adopting into existing code

**A new project** starts with an interview: product asks about the problem, the
capabilities, and the success criteria (questions come in batches, every question with
a default attached), arch decides the stack, structure, and verify channel, split
breaks the first capability into cards, and the work ⇄ verify loop begins.

**A project that already has code** starts with reverse-derivation instead of an
interview: adopt traces one representative flow through the code end to end, then
reverse-derives product.md · arch.md · code-style.md · glossary.md — product.md is filled in the
product skill's own format, and only what code cannot answer (will-not-build · success
criteria · gaps in Problem and Approach) is asked of the owner. Already-finished code is never backfilled
into the tree — the tree accumulates only work done after adoption. From there the
path is the same: split → work ⇄ verify.

## What accumulates in your project

Using devflow creates a single `devflow/` folder in the target project, and documents
accumulate hierarchically inside it:

```
devflow/
  project/                     ← Layer 0 output — upper documents that rarely change
    product.md                    what & why (capability list · success criteria)
    arch.md                       how (stack · structure · Provisional values · verify channel)
    design.md  code-style.md      (optional) design · code taste declarations
    glossary.md  decisions/       glossary · ADRs
  tree/                        ← canonical progress state — the filename IS the state
    01-foundation/                foundation (shared groundwork)
    02-payment/                   one capability = one folder
      02.1-model.done.md            a completed card
      02.2-api.wip.md               a card in progress (its progress log lives inside)
      02.3-webhook.md               a waiting card
      verify.md                     capability verification record (left by verify)
  journal.md                   ← one-line decisions that cross cards (swept when a capability closes)
  HANDOFF.md                   ← volatile handoff — next single step · just learned · traps · open decisions only, overwritten each time
```

**The life of a task card:**

```mermaid
stateDiagram-v2
    [*] --> waiting: created by split — Destination · Why · Forbidden · completion signal
    waiting --> wip: start — rename to .wip. (in multi mode, a claim commit)
    wip --> waiting: release (multi mode) — suffix stripped
    wip --> done: completion signal passed + review passed + 1 commit
    waiting --> promoted_to_folder: opened it — too big for 1 commit
    wip --> promoted_to_folder: too big for 1 commit — recursively split under the same number
    done --> stale: an upper document changed, so it went stale
    note right of stale : a card in any state can become .stale. when an upper document changes
```

The tree is recursive — a big card is promoted to a folder with the same number and keeps
splitting (`02.3` → `02.3.1`). Why progress never goes into documents: **progress written
into a document always goes stale, but a filename changes only when the state changes.**
One `ls` is the progress report.

When every card in a **depth-1 capability folder** is `.done.`, verify checks it by
actually running it, and only a pass earns the folder its `.done` (foundation 01 and
intermediate folders close without a verification rite). At that moment the journal is
swept — spent lines deleted, still-valid lines promoted into upper documents or left in
place.

## The 9 skills

| Skill | When | Produces | Design intent |
|---|---|---|---|
| product | new project | product.md · glossary.md | the capability names chosen here carry through as module and folder names, one word to the end |
| arch | after product | arch.md · code-style.md | separates guesses (Provisional) from decisions at the sentence level, so documents cannot lie |
| adopt | adopting in existing code | product.md · arch.md · code-style.md · glossary.md (back-derived) | reverse-derivation instead of an interview — never ask what code answers, ask the owner only what code cannot |
| design | only with a frontend (optional) | design.md · token file · /preview | the canon for colors and spacing is a token file, not a document |
| split | breaking down work | capability folders · task cards in tree/ + the execution proposal (order · parallelism · model tiers — a user approval gate) | opens one layer at a time — earlier implementation reshapes later decomposition |
| work | implementation | code · in-card progress log · commits | log to disk before running — whenever the session dies, reading the card is enough to continue |
| verify | capability complete · MVP reached | verify.md · fix cards (on failure) · audit and retrospective findings (event-triggered) | what was not executed is not passed — it is unverified |
| resume | new session | nothing — a state report, then approval (only multi mode's digest procedure corrects shared documents) | when HANDOFF and the tree conflict, the tree wins |
| principles | read before running by the other seven skills (all but resume) | — | the canonical rules live in exactly one place |

Four roles ride along — none crossing into another's territory is the
bias-prevention device:

- **reviewer** — judges before each commit by reading only the card (progress log
  excluded), the diff, and code-style.md. Never executes.
- **verifier** — judges by channel execution alone, knowing nothing of the
  implementation history. Never reads.
- **auditor** — reads and executes, but knows no implementation history. Issues
  findings, never verdicts — and only on events (the audit paragraph below).
- **retrospector** — reads devflow artifacts only and never executes. It evaluates,
  as findings only, whether the design had better options — and only on events
  (the retrospective paragraph below).

Each role's terms are one contract file beside its skill (`skills/work/reviewer.md` ·
`skills/verify/verifier.md` · `skills/verify/auditor.md` ·
`skills/verify/retrospector.md`) — every platform runs them by briefing a clean
subagent/fresh session with that file verbatim, so **the process is the same**.

### work ⇄ verify — the inner and outer loops

```mermaid
flowchart TB
    subgraph W["work — task loop (per card)"]
        I[implement] --> CS[run the completion signal]
        CS --> RV{{"review · reviewer — reads, never executes"}}
        RV -->|objection| FX[fix]
        FX -->|"if the diff changed, signal first"| CS
        RV -->|pass| CM["commit → card .done."]
    end
    subgraph V["verify — capability loop (when the folder is all .done.)"]
        SC{{"run the real scenario · verifier — executes, never reads"}} --> RG["regression — rerun every completion signal in the folder"]
        RG --> VD{verdict}
        VD -->|pass| CD["capability folder .done"]
        VD -->|fail| FC["fix card — its completion signal reproduces that failure"]
    end
    CM --> SC
    FC -->|back to work| I
```

No loop circles in place — to repeat, something must change first, and every pass
leaves something behind:

| Where the loop turns | What changes before the retry | What the pass leaves behind |
|---|---|---|
| Completion signal fails | 1st: reinforce the card → 2nd: raise the tier or main does it → 3rd: the human. Never the same prompt again (the failure ladder) | the attempts and causes in the progress log |
| The same hypothesis repeats during implementation | stop at 2 failures — one hypothesis-and-refutation line; if it stands, a research card or a clean-context diagnosis (stuck-escape) | the hypothesis and its refutation in the log |
| Review objection | fix + signal re-run — against the changed code, an earlier pass is unverified | a diff that passed re-review |
| Capability verification fails | a fix card — its completion signal reproduces that failure | a signal permanently folded into regression |
| A provisional value gets measured | that row of the upper document is replaced (upper-document feedback) | a measurement the documents remember |
| An audit finding is adopted | user approval — only adopted findings become cards | a hole outside the sample found, its fix folded into regression |
| A retrospective finding is adopted | user approval — adopted only, becoming cards or a re-baseline | a recorded re-evaluation of the design's options |

**The audit — an event-triggered device for what verification structurally cannot
see.** Verification checks against the scenarios, signals, and success criteria this
flow wrote for itself, so holes outside the scenario and expectations the spec missed
stay invisible to it. On exactly three events — MVP reached, the closure of a
capability whose record shows a verification failure, or a user request — the auditor
hunts those two by actually executing through the channel. Findings are not verdicts:
they never block a pass, and only user-adopted findings become cards. A cleanly
closed capability gets no audit.

**The retrospective — the one question aimed at the design itself.** Implementers and
reviewers alike work on the current design's premise, so "was there a better option?"
is a question nobody asks. The retrospective asks it once when a capability first
closes, at that scope, and once when the MVP is reached, for the whole. It reads no
code — only the traces the project left behind: folders where fix cards clustered,
`.stale.` cards, ADRs' update comments. A finding stands only with a concrete
alternative and this project's strain evidence, and adoption belongs to the user.

Three layers stand at the closure boundary — the verdict is mandatory, findings are
event-triggered, and the dotted lines block nothing:

```mermaid
flowchart TB
    CL["capability/product closure"] --> VF{{"verifier — verdict: pass·fail·unverified"}}
    VF -.->|"closure of a capability that recorded a fail · MVP once · request"| AU{{"auditor — findings"}}
    VF -.->|"first capability closure · after the first product-layer verdict · request"| RT{{"retrospector — findings"}}
    AU -.->|"adopted findings only — the user"| MC["maintenance cards"]
    RT -.->|"adopted findings only — the user"| RB["maintenance cards or a re-baseline"]
```

The outcome this drives: **a defect met once cannot escape through the same door twice.**

## Design principles

- **Progress state lives in the file tree, not in documents.** Suffixes (`.wip.` `.done.` `.stale.`) and location are canonical.
- **The task card is the whole briefing.** Destination · Why · Forbidden · completion signal, on one card.
- **What was not executed is not passed — it is unverified.**
- **1 task = 1 commit.** Only after the completion signal and review pass. Rollback = one revert.
- **Measured answers flow back into documents (upper-document feedback).** Guesses live in the Provisional table and are replaced once measured.
- **Handoff carries crumbs only.** The tree answers where, the progress log answers how —
  HANDOFF keeps only the next single step · just learned · traps · open decisions, and an
  empty file is normal.

The full "why" (decision table · rejection lineage) is in [docs/design.md](docs/design.md).
**To overturn a decision, refute its recorded reason first.**

## Using it in a team — two modes

devflow decides its mode **by file existence** (no settings, no flags):

```
any devflow/users/*/owner.md exists  →  multi mode
none exists                          →  solo mode (all multi rules are ignored)
```

**Solo mode** is the default. It is exactly what was described above — nothing new to learn.

**Multi mode** is for several people sharing one repository. Premise: not everyone on the
team needs devflow — adopters must not collide with each other, and non-adopters' work
must still be caught up on. The split axis is not people but the **scope of truth**:

```
devflow/
  project/  tree/  journal.md   ← shared truth — one service, one set of documents
  users/<id>/                   ← personal room — owner.md (identity) · HANDOFF.md (my handoff) · digest.md (marker)
```

The four key concepts:

- **claim** — the commit that renames a card to `.wip-<my id>.`. From then on the card is
  mine; others' claimed cards are read-only. On completion it becomes a bare `.done.`
  (git remembers ownership).
- **room** — where my session state lives. Everyone writes only in their own room; every
  room is readable by the whole team. The marker (digest.md) is the commit position that
  says "caught up to here".
- **digest** — the procedure for catching up on others' commits (including teammates who
  do not use devflow):

```mermaid
sequenceDiagram
    participant Me as me (before claiming a new card)
    participant Git as git history
    participant Docs as shared documents
    Me->>Git: skim others' commits since my marker
    Me->>Docs: correct documents that discoveries contradict
    Me->>Me: advance my marker to now
    Note over Docs: one person digests, the result lands in documents, everyone benefits
```

- **binding decision** — a decision that affects shared documents, tree structure, or
  someone else's card. Never shipped inside feature work — it lands immediately on the
  integration branch (the multi-only branch designated in arch's settings).

Only two habits are added to daily work: **pull and digest** before claiming a new card,
and claim via a **rename commit**. Everything else is the same as solo.

Every mode transition is a single-commit procedure:

| Transition | Procedure |
|---|---|
| Teammate joins | make a room (owner.md) + marker = current HEAD. Done |
| Solo → multi | create the room + move HANDOFF into it + `.wip.` → `.wip-<id>.` + marker = HEAD |
| Multi → solo | (the last person) HANDOFF moves back + delete users/ + restore suffixes + remove arch's multi-only config lines (integration · merge) |
| Teammate leaves | (after the user declares it) anyone remaining: promote open decisions to journal (attributed) → release their claims → delete the room |

Half-finished transitions (multi mode but a bare `.wip.` or a root HANDOFF remains)
are detected and reported by the hook and the integrity check — nothing goes wrong
silently. Sessions find their room via git identity; sessions that cannot resolve one
(CI · bots) only read.

owner.md is two lines:

```
id: jmp
git: "Jaemin Park", jmp@example.com
```

## Install — Claude Code

```
/plugin marketplace add nanomia-ai/devflow
/plugin install devflow@nanomia
```

(Before the GitHub release, point marketplace add at a local clone path instead.)

Installs 9 skills (with the role contract files riding along) + the SessionStart hook. Commands take the `/devflow:product`
form — the plugin name is the namespace, so collisions are blocked at the source, and
typing just `/devflow` groups the whole set in autocompletion. The hook activates only in
projects that have `devflow/tree/`, and injects tree state and HANDOFF at session start,
resume, and right after context compaction (which is why resuming works without typing
resume).

> Why there is only one hook: the covenant of writing the progress log to disk at every
> step makes PreCompact protection unnecessary, and a Stop hook fires every turn — noise.
> SessionStart alone covers it.

## Install — Codex CLI

```powershell
# Windows
powershell -File codex/install.ps1
```
```sh
# macOS/Linux
sh codex/install.sh
```

The installer sets up three channels at once: ① a **native plugin** — it registers the
repository as a marketplace and installs `devflow@nanomia`, so the 9 skills are visible
to the model with their frontmatter intact (auto-invocation — the same way Claude works).
② the 8 `/devflow-*` commands in `~/.codex/prompts/` — the explicit channel; the
canonical rules and companion documents are embedded in each prompt (the prompt folder
is flat, so cross-file references are unreliable). ③ the native Codex SessionStart
hook — the same `scripts/session-start.js` serves both Claude and Codex. Prerequisite:
`[features] hooks = true` in `~/.codex/config.toml` (the installer checks and explains
if missing). Only in hook-incapable environments, add the `codex/AGENTS-devflow.md`
block to the project's `AGENTS.md` as a fallback.

**After editing any skill, run the installer again** (the plugin snapshot and the
prompts are build artifacts).

## Other agents (Cursor, Copilot, opencode, …)

The `skills/<name>/SKILL.md` structure is the standard format of the
[skills.sh](https://skills.sh) CLI, so one `npx skills add <owner>/<repo>` installs into
20+ agents. This is also why the canonical rules live inside skills/ (the principles
skill) — even installers that copy only the skills folder carry the canon along.

## Further reading

- [docs/design.md](docs/design.md) — design philosophy · key decisions and reasons · rejection lineage
- [CHANGELOG.md](CHANGELOG.md) — per-version change history
- [AGENTS.md](AGENTS.md) — the maintenance gate for people and AI modifying this
  repository (dual-language workflow: Korean `*_ko.md` files are the design originals,
  English is the deploy artifact)

License: [MIT](LICENSE)
