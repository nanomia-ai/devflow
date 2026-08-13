# devflow

> A development flow for AI sessions, connecting planning → implementation → verification. Supports Claude Code · Codex CLI.

[한국어](README_ko.md) · **English**

Every AI session starts with its memory wiped. devflow accumulates that memory **on disk,
not in conversation** — documents answer what you are building, the file tree answers how
far you have come, and the records answer why it was decided that way. Whenever a session
dies, the next one reads a small, fixed set of files and picks up where it left off.

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
    subgraph L0["Layer 0 · decided once, inherited from then on"]
        P["product<br>what & why"] --> A["arch<br>how it gets built"]
        A --> D["design · optional<br>when there is a frontend"]
        AD["adopt<br>back-derived from existing code"]
    end
    subgraph L1["Layer 1 · repeated for every capability"]
        S["split<br>open one layer only"] --> W["work<br>one card, all the way"]
        W --> V["verify<br>judged by real execution"]
        V -->|"fail → fix card"| W
        V -->|"pass → next layer"| S
    end
    Start(["starting devflow in this repo"]) --> Q{"does this repo<br>already have code?"}
    Q -->|no| P
    Q -->|yes| AD
    A --> S
    D --> S
    AD --> S
    R(["a new session in a repo that already has devflow state"]) -.->|"hook routes to resume"| X{"resume judges disk state"}
    X -.-> P
    X -.-> A
    X -.-> AD
    X -.-> D
    X -.-> S
    X -.-> W
    X -.-> V
```

| Situation | Entry point |
|---|---|
| New project | product, then in order |
| Adopting in an existing project | adopt (back-derive from code) → split |
| Adding or extending features | split |
| Continuing in a new session | automatic (SessionStart hook — see the install section), or resume |
| A teammate joins | make a room — see "Rooms, claims, and the integration branch" below |

Nothing on disk yet and you ran resume anyway? It asks one question and sends you to product
or adopt. It is also the safety net when you are not sure where you are.

### The first step — starting fresh vs adopting into existing code

**A new project** starts with an interview: product asks about the problem, the
capabilities, and the success criteria (questions come in batches, every question with
a default attached), arch decides the stack, structure, and verify channel, and split
runs three times (capability waiting files → `01-foundation/` with its direct cards →
the first capability's cards), with the work ⇄ verify loop starting after the second. So
the first cards you implement are repo setup and the verify channel.

**A project that already has code** starts with reverse-derivation instead of an
interview: adopt enumerates capability candidates and traces one representative flow
through the code end to end for each candidate, then
reverse-derives product.md · arch.md · code-style.md · glossary.md — product.md is filled in the
product skill's own format, and only what code cannot answer (will-not-build · success
criteria · gaps in Problem and Approach) is asked of the owner. The owner must answer the
success criteria, and each must be verifiable as written. adopt asks again until they are,
and does not move on to the arch derivation until they pass. Only the other unanswered
items stay in Open questions. Already-finished code is never backfilled
into the tree — the tree accumulates only work done after adoption. From there the
path is the same: split → work ⇄ verify.
Existing handoff and specification files are not copied. adopt indexes only their exact
paths by capability in `arch.md`; a change opens one only after rechecking it against
current code and naming it in the card's `Read first`. The old record system remains
usable without gaining global read cost or canonical standing.
When tracked post-adoption work finishes, devflow closes that work and waits. It opens
product-layer verification for the existing service only on an explicit user request.

### The smallest changes — the commit is the record

A change like one button label or one border colour makes no card and no record. The
session checks three things and, when all three are clear, just fixes it. Does the
behaviour a user sees change? Is a design decision involved? Does it leave a trap the next
person could fall into? It reads the product, architecture, design, and code-style
documents when they exist — and the glossary when the change touches wording or a name —
makes the edit, runs one check, and lands a single `tweak` commit. The diff is already the
complete record, so nothing gets written twice. The moment any of the three answers turns
up, it is the ordinary path from there — record, card, approval. You can also just fix it
yourself without devflow at all; the next session's digest reads that commit and catches
up.

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
    capabilities/                 number-keyed capability docs — design + verified zones
      01-foundation.md              foundation's shared boundary
      02-payment.md                 current domain entry for the payment capability
  tree/                        ← canonical progress state — the filename IS the state
    01-foundation/                foundation (shared groundwork)
    02-payment/                   one capability = one folder
      02.1-model.done.md            a completed card
      02.2-api.wip-jmp.md           a card jmp claimed (its progress log lives inside)
      02.3-webhook.md               a waiting card
      verify.md                     capability verification record (left by verify)
    03-reporting.md               one-heading waiting file for an unopened capability
  journal.md                   ← one-line cross-task decisions and open items a person must decide + the fixed-format state lines the canonical rules define (only the decisions are swept)
  users/<id>/                  ← your room — owner.md (identity) · digest.md (marker) · HANDOFF.md (the next single step, overwritten each time)
```

A new project's first tree contains only capability waiting files. The next layer creates
`01-foundation/` together with its direct cards, so an empty folder cannot remain as if it
were finished groundwork.

**The life of a task card:**

```mermaid
stateDiagram-v2
    state "waiting — no suffix" as WAIT
    state "in progress — .wip." as WIP
    state "done — .done." as DONE
    state "stale — .stale." as STALE
    state "promoted to a folder" as FOLDER
    [*] --> WAIT: split creates the card
    WAIT --> WIP: a claim commit renames it
    WIP --> WAIT: release · the suffix comes off
    WIP --> DONE: signal · review · commit passed
    WAIT --> FOLDER: too big for one commit
    WIP --> FOLDER: too big for one commit
    FOLDER --> WAIT: child cards are born
    DONE --> STALE: an upper document changed
    note right of STALE : a card in any state can become .stale.
```

The tree is recursive — a big card is promoted to a folder with the same number and keeps
splitting (`02.3` → `02.3.1`). Aggregate progress stays out of planning documents because
**progress there always goes stale, while a filename changes only when the state changes.**
Detailed progress inside one task stays only in that card's progress log. One `ls` is the
whole-project progress report.

When a **depth-1 capability folder** has at least one direct child that is not `.stale.`
and every such child has a `.done` status, verify checks it by actually running it, and only a pass earns the folder its `.done` (foundation 01 and
intermediate folders close without a verification rite). At that moment the journal is
swept. A cross-task decision whose update target is settled gets routed to the skill that
owns that document, and that skill lands the update and the deletion of the original line
in one commit. Every other line stays. `.stale.` cards are excluded from this count but
remain as history for the retrospective.

One table shows what gets written where, and who reads it:

| Path | Written by | Read by | When it changes |
|---|---|---|---|
| `project/product.md` | product (adopt reverse-derives it in a brownfield) | every skill, and every card through the identity paragraph | the product interview, or the discovery→update table |
| `project/arch.md` | arch (adopt reverse-derives it in a brownfield and owns `Existing records` and `Brownfield`) | split · work · verify · resume · design · adopt | an arch run, or the discovery→update table |
| `project/code-style.md` | arch (adopt reverse-derives it in a brownfield) | work, reviewer, and verify's standards gate | an arch run, or a new convention decision |
| `project/glossary.md` | product (adopt reverse-derives it in a brownfield) | work, reviewer, verify | a term becomes necessary |
| `project/decisions/ADR-*.md` | arch | work when a card names one, retrospector | a binding decision arrives or is superseded |
| `project/design.md` | design | work, split, adopt | a design run |
| `project/capabilities/NN-*.md` | arch owns the design zone (adopt in a brownfield); verify owns the verified zone | work by automatic number lookup · resume for domain questions · reviewer · retrospector · people | the design zone after Layer 0 confirmation, and the verified zone when a capability passes, each replaced whole |
| `tree/**` task cards | split creates them, work fills the progress log | split · work · verify · reviewer · resume | planning, implementation, every status transition |
| `tree/<capability>/verify.md` | verify | resume through its bounded projection, retrospector | every capability verification |
| `tree/verify.md` | verify, at the product layer | resume, retrospector | every product verification |
| `journal.md` | any skill — cross-task decisions and the fixed-format lines | verify classifies it before every run; split · work · resume · reviewer · retrospector | cross-task decisions and transition state |
| `users/<id>/HANDOFF.md` | work, at a task boundary | resume, work | overwritten whole at every boundary |
| `users/<id>/` | that member | that member, and others read owner.md to resolve identity | joining, claiming, leaving |

These are the only state files devflow keeps. Your code and every other document in the
repository stay yours.

Both gates that open the tree, split and resume, run a 15-item integrity check the moment
they start. It looks for duplicate numbers, a live card inside a
closed folder, a dependency that points at no card, a journal line that does not parse, and
**reports without correcting**, because an auto-correction that misjudges spreads
corruption faster than the anomaly it was fixing. A malformed journal line or verification
record goes one step further and blocks every tree write until you confirm the replacement.

## Handoff — you choose when it happens

Every session ends eventually. In devflow, **you** decide when.

An AI cannot see how much context it has left, so instead of a rule hung on a percentage,
the session signals only at events it can actually observe — before opening a new
capability folder, before starting a long card, at checkpoint commits — and it reports
**the size of the next step**. Watching the gauge and saying "hand it over now" are yours.

When you say so, the handoff is produced right there, in a fixed order: anything confirmed
in this conversation that has not yet landed in a document lands **first** (through the
discovery→update table), and only the volatile remainder goes into HANDOFF. And it happens
**at a task boundary, never mid-task** — half-written code and a half-true explanation are
not handed over.

The hook routes the next session to resume, which reads disk state and HANDOFF. The hook
itself neither injects file content nor decides the next stage. HANDOFF holds two things
now: the one next step, and the decisions that need a person. Everything else a session
learns lands somewhere durable instead.

### Where what a card learned goes

A handoff gets overwritten, so anything parked there was one session from being lost. Two
lines carry it now, and both survive.

- **The carry line.** Just before its last commit, a card writes one line into its own
  progress log — the fact that could make the next card in this capability wrong. Usually it
  is `none`. The next card in that capability reads those lines automatically, and only the
  ones written since the capability last passed verification, so the set stays small. A
  passing verification folds them into the capability document and empties the set again.
- **The capability note.** Notice something about a *different* capability while you work
  and it goes into journal.md tagged with that capability's number. That capability's next
  verification picks it up and deletes the line.

A trap found in 04.5 reaches 04.7 on its own, and something you noticed about payment while
fixing customer management reaches payment.

## The 9 skills

| Skill | When | Produces | Design intent |
|---|---|---|---|
| product | new project | product.md · glossary.md | the capability names chosen here carry through as module and folder names, one word to the end |
| arch | after product | arch.md · code-style.md · foundation and capability design zones | separates guesses (Provisional) from decisions and leaves domain boundaries before the first card |
| adopt | adopting in existing code | product.md · arch.md · code-style.md · glossary.md · capability design zones (back-derived) | reverse-derivation instead of an interview — never ask what code answers, ask the owner only what code cannot |
| design | only with a frontend (optional) | design.md · token file · /preview | the canon for colors and spacing is a token file, not a document |
| split | breaking down work | capability folders · task cards in tree/ + the execution proposal (order · parallelism · model tiers — a user approval gate) | opens one layer at a time — earlier implementation reshapes later decomposition |
| work | implementation | code · in-card progress log · commits | log to disk before running — whenever the session dies, reading the card is enough to continue |
| verify | capability complete · MVP reached | verify.md · fix cards (on failure) · audit and retrospective findings (event-triggered) · capability document verified zone | what was not executed is not passed — it is unverified |
| resume | new session · domain entry | a state report and approval, or a domain explanation selected by number. It also closes non-capability folders from the deepest up | when HANDOFF and the tree conflict, the tree wins; never present a hypothesis as fact |
| principles | read before running by the other eight skills | — | the canonical rules live in exactly one place |

Four roles ride along — none crossing into another's territory is the
bias-prevention device:

- **reviewer** — judges before the task commit by reading the card (progress log excluded),
  the diff, coding conventions, and that capability's design zone and freshness projection.
  Never executes. Only the user can waive a review, and the sole other exception is a
  research card with no code diff.
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
    subgraph W["work — the inner loop, one card at a time"]
        I["implement"] --> CS["actually run the completion signal"]
        CS --> RV{{"review · reviewer<br>reads, never executes"}}
        RV -->|"something to fix"| FX["fix"]
        FX -->|"diff changed — signal first"| CS
        RV -->|"pass"| CM["commit → card .done."]
    end
    subgraph V["verify — the outer loop, one capability"]
        SC{{"run the scenario through the channel<br>verifier · executes without reading"}} --> RG["regression — every completion signal in the folder<br>+ one hop of what those cards name in Depends"]
        RG --> VD{"verdict"}
        VD -->|"pass"| CD["capability folder gets .done"]
        VD -->|"fail"| FC["fix card<br>completion signal = that failure, reproduced<br>or proof the unverified reason is gone"]
        VD -->|"unverified"| FC
    end
    CM ==>|"at least one active direct child<br>all active children .done"| SC
    FC ==>|"back into work"| I
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
| A retrospective finding is adopted | user approval — adopted only, becoming cards or a redone plan | a recorded re-evaluation of the design's options |

**The audit looks for what verification structurally cannot see.** Verification checks
against the scenarios, signals, and success criteria this flow wrote for itself, so holes
outside the scenario and expectations the spec missed never surface there. The audit hunts
those two, and it runs in only three cases: when you reach MVP, when you close a capability
that failed verification before, and when you ask for one. The auditor executes through the
channel to look, but issues no verdict, so nothing is blocked, and only findings the user
adopts become cards. A capability that closed cleanly the first time gets no audit at all.

**The retrospective asks one question about the design itself.** Implementers and reviewers
alike work on the premise of the current design, so nobody ever asks "was there a better
option?" That question gets asked twice: once when a capability closes for the first time,
scoped to it, and once when you reach MVP, for the whole. It reads no code. It looks only
at what the project left behind — folders where fix cards piled up, `.stale.` cards, the
update comments on ADRs. A finding stands only with all three of a concrete alternative,
strain evidence observed in this project, and a switching-cost estimate marked as
presumed, and the user decides whether to adopt it.

Three layers stand where something gets closed. The verdict always runs, findings attach
only when an event fires, and the dotted lines block nothing. A pass does not close the
folder by itself. The capability's code scope is compared against code-style.md, and every
Provisional row this capability was meant to settle is checked for its measured
replacement. If either gate catches something, a fix card comes out instead of the `.done`.

```mermaid
flowchart TB
    CL["closing a capability · reaching MVP"] --> VF{{"verifier — verdict: pass · fail · unverified"}}
    VF ==>|"the verdict always runs · only a pass closes it"| DN["capability folder gets .done"]
    VF -.->|"closing a capability that failed before · once at MVP · on request"| AU{{"auditor — findings"}}
    VF -.->|"closing a capability for the first time · once after the MVP verdict · on request"| RT{{"retrospector — findings"}}
    AU -.->|"only findings the user adopts"| MC["maintenance cards, a document fix, or a product re-run"]
    RT -.->|"only findings the user adopts"| RB["maintenance cards, a document fix, or a product re-run"]
```

The outcome this drives: **a defect met once cannot escape through the same door twice.**

## When devflow stops and asks you

The AI judges everything else. At these points it stops and waits for you.

- **The execution proposal** — after split writes the cards it proposes order, parallelism,
  and model tiers. Your approval is recorded on each card, and editing a card by hand
  invalidates that approval, so devflow asks again.
- **Waiving a review** — only you can set a card's `Review` to `waived`. No AI waives its own
  review.
- **Repairing an integrity anomaly** — the check reports a broken line instead of fixing it.
  It shows the raw line beside the whole proposed replacement, and nothing changes until you
  confirm.
- **Adopting an audit or retrospective finding** — findings are not verdicts. Only what you
  adopt becomes a card, and what you decline leaves only its count.
- **Approving a resume report** — resume reports the state in one paragraph and changes no
  code before you approve.
- **Confirming a Layer 0 document** — product, arch, design, and adopt commit each document
  only once you confirm it.
- **Disproving a confirmed statement** — when a measurement contradicts the confirmed identity
  paragraph or a success criterion, devflow will not rewrite it without your confirmation.
- **A capability that looks like two** — when the design and verified zones cannot express
  current structure within the roughly 185-line contract, devflow reports the reason and
  the sections over their caps. Whether to split is yours.
- **An open rebase or merge** — every skill stops on entry and asks whether to continue or
  abort. It never aborts on its own.

## Entering a domain — the capability knowledge baseline

A capability is one thing the product can do, told end to end. Its screen, its API, and its
data are one piece. product.md names them, and every later stage keeps those same words.

One capability has one file at `devflow/project/capabilities/NN-<name>.md`. **The next
session and a newly joined person enter the domain through this one page.** Purpose and
ownership boundary, concepts, invariants, verified main flows and current behavior, entry
points, consumed contracts, traps, and real verification methods live together.

The file exists from the beginning. In a new project, after product and arch are confirmed,
arch writes the design zones for foundation and every non-retired capability. In a project
that already has code, adopt writes the same zones from reverse-derived Layer 0. For a
0.10.x project that has Layer 0 but no capability documents, resume detects the gap and
sends a brownfield to adopt or a new project to arch, which then write only those documents.
It does not repeat the interview or code reverse-derivation. There is no per-project
on/off switch.

One file has two lifecycles.

- **Design zone** — arch writes it before the first card, or adopt in a brownfield. It holds
  purpose, boundary, concepts, invariants, non-goals, and exact Binding ADR paths.
- **Verified zone** — begins at `## Verified state` and runs through EOF. verify rewrites it
  from current code when the capability actually passes verification.

Neither zone edits the other's statements. Each carries its own freshness stamp, and when
an input changes only that zone becomes a hypothesis. A hypothesis is neither deletion nor
failure. It marks that AI must reconfirm the statement at current authority. The baseline
itself is not canonical, so current code, Layer 0, and ADRs win on conflict.

It enters work without card wiring. work finds the capability document from the claimed
card's depth-1 folder number, or `01-foundation.md` for a foundation card. Research cards
are no exception. It also reads only the exact paths the document lists under Binding ADRs.
No user or card needs to duplicate a baseline path. A capability-document path left in a
v0.10 card's `Read first` is legacy wiring and is deferred to automatic number entry. When
an exact v0.10 baseline already exists, current Layer 0 supplies its new design zone while
the old verified bodies, timestamp, scope, and card set move mechanically into the new
verified zone. It is not treated as damage reset. The old head did not include consumed
paths, so it does not carry forward; the verified zone remains a hypothesis until that
capability next passes verification and is refreshed from the new inputs.

To understand a domain first, ask in natural language. For example: “explain the payment
domain,” “what should I know before entering capability 05?”, “explain foundation's shared
contracts,” or “show every domain boundary.” resume selects one file by name or number;
if the name is absent or ambiguous, it first shows only number/name candidates. It reads all
files only when you explicitly request the full expected set. Its answer includes the path,
freshness of both zones, and entries added to or removed from the completed-card set since
the baseline. It does not describe hypothetical verified content as
current fact.

A domain relation is recorded only on the consuming side. Exact contract paths participate
in freshness calculation; closing, splitting, or retiring a provider reports registered
consumers and each one's current freshness in one line. This is an awareness mechanism. It
does not automatically run another capability's verification or create cards.

Your part is small. At first, confirm Layer 0, then confirm the batch of design zones arch
or adopt derives from it. Later, read one when entering a domain; you may delete a body row
or item you confirm is wrong when that does not empty its section. For the last item, let the
writer skill replace the section with `None.`. Do not touch fixed headings or metadata;
commit a direct deletion by itself before the next devflow skill. Each zone's writer owns
additions and replacement. A retired capability remains as history and normally disappears
only from the entry list.

## Design principles

- **Progress lives in files, not in documents.** Three things carry three different truths.
  How far the work got is the suffix (`.wip.` `.done.` `.stale.`) and where the file sits;
  what happened inside one task is that card's progress log; where an interrupted transition
  stopped is the fixed-format state lines the canonical rules define in journal.md and
  verify.md. Documents still carry no progress.
- **The task card completely defines the work unit.** Destination · Why · Forbidden ·
  completion signal stay on one card; fixed shared records (product · arch · code-style ·
  glossary · journal · design when it exists · direct dependency cards) and every exact path in the card's
  `Read first` are read alongside it.
- **What was not executed is not passed — it is unverified.**
- **1 task = 1 commit.** Only after the completion signal and review pass. Rollback = one revert.
- **Measured answers flow back into documents (upper-document feedback).** Guesses live in the Provisional table and are replaced once measured.
- **Handoff carries one pointer.** The tree answers where, the progress
  log answers how, and what a card learned rides its carry line. An open item that needs a
  person stays as one journal line.

Why it is built this way is summarized in [docs/design.md](docs/design.md); the decisions
in full and the rejection lineage are in
[docs/design-decisions.md](docs/design-decisions.md).
**To overturn a decision, refute its recorded reason first.**

## Rooms, claims, and the integration branch

devflow has one mode. Whether you are alone at one terminal or five people share the
repository, every session works out of its own room. No flag to set, no mode to switch.

```
devflow/
  project/  tree/  journal.md   ← shared truth — one service, one set of documents
  users/<id>/                   ← personal room — owner.md (identity) · HANDOFF.md (the next step) · digest.md (marker)
```

The split axis is not people but the **scope of truth**. Documents with a single truth are
shared, and only what one person owns lives in a room. Not everyone on the team needs
devflow either: adopters must not collide with each other, and non-adopters' work must
still be caught up on.

The five key concepts:

- **id** — who you are. A session reads your git name and email and matches them against
  each room's owner.md. In a fresh project with no room, it proposes an id and creates the
  room once you confirm it.
- **claim** — the commit that renames a card to `.wip-<my id>.`. From then on the card is
  mine; others' claimed cards are read-only. On completion it becomes a bare `.done.`
  (git remembers ownership).
- **integration branch** — where minting, closure, and binding decisions land, named by
  `integration` in arch.md. **Alone, that value is the branch you are already on**, and
  every integration step shrinks to an ordinary commit.
- **digest** — catching up on commits made outside your own sessions. A teammate's commits
  land here, and so do your own hand edits:

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
  someone else's card. Never shipped inside feature work — it lands on the integration
  branch immediately.

Three habits are added to daily work: **pull and digest** before claiming a new card,
claim via a **rename commit**, and read shared state from the integration branch before
routing (an active marker there gets pulled into the current branch
first). The first two happen at boundaries; the third runs even while a card is claimed.

Working alone, all of this costs **one commit per card** — the claim. That one commit is
what lets two terminals, or two worktrees, see each other's work in progress.

**Any number of terminals in one folder is safe.** Each session claims its own card and
runs. Cards inside one capability work the same way — a second terminal claims with no
procedure and no question, just a one-line note of which cards of yours are already
claimed.
Three measurements back that. A commit that names its own paths does not pick up a file
another session staged first. Four sessions appending to the journal at once lose no line.
Two people editing different parts of one source file both survive, and the same spot fails
loudly instead of overwriting quietly. One thing is worth knowing. A commit records a
file's final content. When two sessions have edited one file and one commits first, the
other's share rides along. So the tweak lane looks at its target files before editing and
steps back when someone's half-done change is sitting there. Three guidelines are yours to keep. Never point two
terminals at the same card — disk cannot tell terminals apart. While another flow is
alive, never have a file rewritten whole. And don't assign overlapping cards for the same
hours — an overlap never overwrites quietly, but there is no reason to sit through the
loud failures either.

**Worktrees buy build isolation, not safety.** Split the folder and each side gets its own
uncommitted files, so half-written code on one cannot break the other's tests. On shared
files one folder is actually better. Splitting does not remove a conflict; it defers it to
whoever merges. Every worktree of one repository shares a single history store, so a claim
made in one folder is visible from the other with no remote and no fetch.

Three limits are worth knowing. Git will not let one worktree write to a branch another has
checked out, so it pays to leave the integration branch checked out nowhere. Then any
folder can land a binding decision. **If your team protects main and takes only pull
requests, point integration at an unprotected branch and raise the PR from there** —
claiming a card has to land at once, and it cannot wait for a review. And two sessions of
one person share one id, so disk cannot tell them apart; when you hold several claims and
have not said which card you mean, resume asks instead of guessing.

If you work as a team, keep plugin versions matched. 0.12 and 0.13 in particular define
shared state differently, so a mixed team has half its members judging by the old rule. An
outside orchestrator can also drive workers on top of devflow — one ordering is all it
takes. Create the cards and claims on the integration branch before starting a worker, and
let the worker write only code and the progress log.

Every room transition is a single-commit procedure:

| Transition | Procedure |
|---|---|
| Teammate joins | make a room (owner.md) + marker = current HEAD. Done |
| Upgrading from a pre-0.12 project | arch adds `integration` and `merge` → identity resolution makes your room → work renames `.wip.` to `.wip-<id>.` and moves HANDOFF into the room |
| Teammate leaves | (after the user declares it) anyone remaining: move any legacy `Open decisions` section left in that room into journal (attributed) → release their claims → delete the room |

Half-finished upgrades (a bare `.wip.` or a root HANDOFF still sitting there) are
among the things the integrity check above catches, and resume sends them back to work.
Nothing goes wrong silently. Sessions find their room via git identity;
sessions that cannot resolve one (CI · bots) only read.

owner.md is two lines:

```
id: jmp
git: "Jaemin Park", jmp@example.com
```

## Install

Both platforms **register** this repository by its GitHub address and install the plugin —
two lines each, and you get the same thing either way: 9 skills, 4 role contracts,
3 predicate companions, and the SessionStart hook.

### Claude Code

Two lines inside a session, and you are done.

```
/plugin marketplace add nanomia-ai/devflow
/plugin install devflow@nanomia
```

Commands take the `/devflow:product` form — the plugin name is the namespace, so nothing
collides with other skills, and typing just `/devflow` groups the whole set in
autocompletion. The hook activates only in projects that have `devflow/tree/` or Layer 0
documents, and routes session start, resume, and post-compaction turns to the shared resume
procedure. resume, not the hook, reads files and decides the next stage.

### Codex CLI

The same two lines. Skills and the hook install together.

```
codex plugin marketplace add nanomia-ai/devflow
codex plugin add devflow@nanomia
```

For the hook you need one line in `~/.codex/config.toml`, and on the first session Codex
asks once whether to trust it.

```toml
[features]
hooks = true
```

Skills are invoked by the model on its own. Before 0.13.0 a second channel wrote eight
`/devflow-*` slash commands into `~/.codex/prompts/`; it is gone. Every prompt had to
embed the whole rulebook, and one rule change meant matching the embedding logic in two
installers. The plugin now delivers the skills together with their companion files, so a
`../principles/SKILL.md` reference resolves exactly as it does in Claude.
`codex/install.ps1` (Windows) and `codex/install.sh` (macOS/Linux) register this folder as
a marketplace for local development and delete only the prompts devflow generated, keyed to
their marker — a file you wrote under the same name stays.

The hook is handed over in two steps, because trusting a hook is your decision and not the
installer's. The install leaves the pre-0.9.20 global registration running and prints the
one command that removes it, for after you have opened `/hooks` and seen the plugin entry
yourself.

After installing, `codex plugin list` should show `devflow@nanomia`. If it does not, the
usual cause is **another marketplace in your Codex config whose folder is gone** — a
single dead entry makes every `codex plugin` command fail. Remove that entry from
`config.toml` (under `CODEX_HOME`, or `~/.codex`) and try again. The other cause is
`CODEX_HOME` itself. When it points at a different home, the install lands there and
`~/.codex` stays quietly empty. The installer prints `Codex home:` on its first line, so
you can see which home the run used.

> Why there is only one hook: the covenant of writing the progress log to disk at every
> step makes PreCompact protection unnecessary, and a Stop hook fires every turn — noise.
> SessionStart alone covers it.

## What this does not cover

A tool that knows its edges earns trust. These are the places devflow does not protect.

| Situation | Why |
|---|---|
| Two sessions rewriting one file whole | Partial edits are safe against each other, and only a whole rewrite overwrites quietly. One rule stops it; nothing stops you from breaking that rule |
| Minting numbers or claims in two clones with no shared write point | Unable to see each other, both flows legitimately claim the same card. You need a shared ref, a coordinator, or an assignment made in advance |
| Knowing which paths a card will write | `Read first` is an input set. New files and mid-implementation discoveries are future information |
| Trusting a hook without you | That removes the trust boundary; it is not automation |
| Completion signals of two flows sharing one database, port, or dev server | File isolation is not runtime isolation. split keeps work that touches a shared dev server sequential |
| Global consistency of state created outside integration | With no coordination point there is no global answer |
| Commit attribution when two sessions edit one file at once | A commit records the file's final content, not who made each change. The tweak lane's pre-edit check catches the common case; the short gap between check and commit only closes with a lock |
| An administrator rewriting the integration branch with a force-push | devflow itself only undoes with revert, but it cannot stop hands outside the repository. An erased claim shows the card as pending again |
| Judgment quality when routing and planning run on a small model | Cards carry a tier system, but the session model is the user's choice. The odds of misreading the canon follow the model |
| Cost advantage on a small project | One card per session runs about 2.6× ordinary development. More cards per session and a bigger codebase turn that around |

## Other agents (Cursor, Copilot, opencode, …)

The `skills/<name>/SKILL.md` structure is the standard format of the
[skills.sh](https://skills.sh) CLI, so one `npx skills add <owner>/<repo>` installs into
20+ agents. This is also why the canonical rules live inside skills/ (the principles
skill) — even installers that copy only the skills folder carry the canon along.

## Further reading

- [docs/design.md](docs/design.md) — design philosophy · invariants · decision index
- [docs/design-decisions.md](docs/design-decisions.md) — the decisions in full and the rejection lineage
- [CHANGELOG.md](CHANGELOG.md) — per-version change history
- [AGENTS.md](AGENTS.md) — the maintenance gate for people and AI modifying this
  repository (dual-language workflow: Korean `*_ko.md` files are the design originals,
  English is the deploy artifact)

License: [MIT](LICENSE)
