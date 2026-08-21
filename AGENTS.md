# Maintaining devflow — read this before changing anything

**Stop.** This repository is prompt text that AI sessions execute literally. A vague word,
conflicting concept, missing read edge, or unbounded rule becomes a defect in every project
that uses devflow. A cheap edit here can be an expensive behavioral change.

## Entry gate

1. Read `docs/design.md` in full and run `node scripts/decision-index.mjs` (`--lang ko` for
   Korean). design owns identity, invariants, and the component intent index; the command
   projects every decision from `docs/design-decisions.md`. State which rows move, open those
   subjects, and refute a recorded reason before overturning a decision or re-proposing a
   rejection.
2. Establish bounded current state: read both manifest versions, `git status --short`, and
   the latest five commit subjects with changed paths. Read only the newest CHANGELOG entry.
   From the greatest numeric-version round below the current version, read the shipped/result
   and limitations/carry-forward sections; if that report has no such sections, read it in
   full. Do not use the whole CHANGELOG, all rounds, or all blueprints as onboarding.
3. Fix the requested write scope as exact paths. Open only the sections that the wiring
   table below triggers. When uncertain whether a condition applies, expand the read set;
   never silently shrink it.
4. Before proposing deletion, movement, consolidation, or a semantic rule change, state the
   affected component's purpose, canonical owner, direct inputs and consumers, recorded
   reason, concrete failure if removed, and anything still unknown. A map or summary never
   substitutes for the actual affected source.

## What opens what

Detailed procedure lives in `docs/maintenance-protocol.md`; read it by exact section, not
whole by default.

| When this is true | Open this |
|---|---|
| always | `docs/design.md` in full; `node scripts/decision-index.mjs` |
| a decision-index row moves | that subject in `docs/design-decisions.md` |
| planning a release | `docs/design-backlog.md` |
| creating, deleting, or moving a file other than this round's report | `docs/design-backlog.md`; `docs/audit-guideline_ko.md` §3-4; maintenance protocol §1 |
| changing a ko/en pair or coining a canonical term | maintenance protocol §2 and §9 |
| changing `skills/**` | `docs/usecase-matrix_ko.md` §1–§2 and applicable §3 cells; maintenance protocol §1–§4 and §7–§9 |
| changing the state tool or a predicate it executes | the tool source, its zone array and shape table, and `scripts/project-state.test.js` |
| reporting a verification result, including zero findings | `docs/audit-guideline_ko.md` §2, §5, §6; maintenance protocol §4 |
| running an independent pass in a separate context | `docs/audit-guideline_ko.md` §8 verbatim |
| opening a folder under `docs/rounds/` to create, revise, implement, review, or audit its records — not the bounded current-state read in Entry gate 2 | previous numeric-version round report and its unlanded audit findings; maintenance protocol §5 |
| writing or revising a round plan | that round's request and handoff when present, read-only; maintenance protocol §5 |
| changing a deploy artifact or bumping version | maintenance protocol §7–§8; for a version bump, also §5, the full audit guideline, and matrix §6 |
| deciding where new knowledge belongs | maintenance protocol §3 |

An adopted finding fitting no audit-guideline §2 row proposes a new row there; a request shape
fitting no matrix §1–§2 row proposes a matrix row; a new document role adds one row to the
document map in `docs/design.md`.

The audit guideline and use-case matrix are Korean-only standing instruments. External
contributors are not required to open either one; maintenance protocol §4's equivalent PR
evidence stands in their place.

## Hard boundaries

- **A repository-maintenance structure request does not authorize `skills/**`.** A skill
  problem found during it is report-only: give the exact source, failure scene, and decision
  coordinates, then leave it for a separately scoped request.
- **One fact, one durable home.** Do not create `CURRENT.md`, an omnibus summary, a free-form
  note layer, or another skill map. Git and manifests own current facts; design owns intent;
  decisions own reasons; backlog owns unadopted observations; rounds own evidence;
  CHANGELOG owns shipped history; skills own runtime behavior.
- **Round records are immutable moments.** Edit one only when the owner asks to revise that
  exact role. Outside the versioned-implementation report fixed by maintenance protocol §5,
  a new request, handoff, plan, report, or audit is not implied by another.
- **Design in Korean, deploy in English.** Edit `_ko` first, translate with the fixed terms,
  and verify structure and figures 1:1. External English-first work is back-synced before
  release.
- **Report before judgment calls are applied.** Clear literal conflicts may be fixed
  directly, but list them separately. Fixes receive their own re-audit.
- **Deploy changes ship complete.** A change under `skills/`, `codex/`, `hooks/`, `scripts/`,
  or plugin manifests gets the newest CHANGELOG entry and the release handling required by
  the current protocol. Docs-only work gets neither.

## Completion gate

- Run `node --test "scripts/*.test.js"`.
- Gate A rides that run: every canonical reserved journal line parses.
- A release changing the verification contract passes gate B once, by hand.
- Report which audit-guideline §5 stop clauses were evaluated; unexecuted behavior is
  `unverified`, never passed.
- For entry-system changes, compare clean read-only Claude and Codex sessions before and
  after with the same questions. Critical invariant, component, consumer, and design-reason
  omissions must be zero; deletion before reading the affected source must be zero;
  comprehension must not fall. Token reduction is accepted only after those gates pass.
- Confirm the final `skills/**` diff against the base commit is empty when skills were out of
  scope, and name every created, deleted, or moved path.
