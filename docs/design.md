# devflow design document — why it is built this way

This document is the **canonical "why"** of devflow. Division of labor between documents:
what it is and how to use it — `README.md`; modification procedure and gate — `AGENTS.md`;
per-version change history — `CHANGELOG.md`; canonical rules — `skills/principles/SKILL.md`.

**To overturn a decision recorded here, refute its recorded reason first.**
To re-propose a rejected idea, refute its recorded rejection reason first.
A reversal or re-proposal that does not refute the reason does not pass review.

## Origin and philosophy

Designed by the user (jmp) to manage the entire AI-driven development process
(planning → implementation → verification). On 2026-08-05 the concepts were settled
over six round-trips (v0 → v6) with the user, then implemented.

Core philosophy — every modification must keep to it:

1. **Rich direction + minimal harness.** Top-tier recent models know the how. State the
   destination and the forbidden clearly; do not dictate methods. Strengthen the harness
   only in inverse proportion to model tier.
2. **Write taste, not knowledge.** Writing universal principles the model already knows
   (e.g. injection defenses) is a tax. Write only what this project prioritizes (declarations).
3. **Progress state lives in the file tree, not in documents.** Filename suffixes
   (.wip./.done./.stale.) and location are canonical. Progress written into documents
   always goes stale.
4. **One concept, one word.** Skill name = artifact name = the single word for that concept.

## Structure at a glance

```
Layer 0 (once, or inherited): product → arch → [design] · existing code: adopt back-derives     Layer 1 (loop): split → work ⇄ verify
Shared: resume, principles (canonical rules)
Created in the target project: devflow/{project/, tree/, HANDOFF.md, journal.md}
                               (multi mode: plus users/<id>/ personal rooms)
Distribution: Claude plugin (.claude-plugin) + generated Codex prompts (codex/install.*)
```

## Key decisions and reasons

| Decision | Reason |
|---|---|
| Output folder named `devflow/` (not docs/) | Avoid collision with existing projects' docs/ |
| Name is devflow — Claude uses the `devflow:` namespace, Codex uses the `devflow-` filename prefix | Blocks skill-name collisions at the source + groups autocompletion. The original name was nano-devflow; shortened in v0.9.0 because commands were needlessly long in real use — the namespace/prefix structure is unchanged, so the collision-blocking reason still holds |
| Canonical rules live inside skills/principles/ | Under the skills.sh standard (installers that copy only skills/), the canon travels along |
| Codex prompts embed the canon (no file reference) | The Codex prompt folder is flat; relative references are unreliable |
| One hook only: SessionStart | Stop fires every turn — noise; PreCompact is unnecessary given the "progress log is always on disk" covenant. SessionStart also fires right after compaction, so it covers all three |
| No model names in files (tiers T-high/T-mid/T-low only) | Model names always go stale. Mapping is decided per session in split's execution proposal |
| Worktrees abandoned entirely | For parallelism: core edits are common, so coordination/merge cost > parallel gain. For showcase: the user confirmed "screen may break during work" → benefit gone |
| TDD procedure not adopted | Completion signal + "not executed = unverified" + commit discipline capture TDD's effect without the ceremony |
| 1 task = 1 commit (only after verification passes) | Rollback = one revert; git log = task history; task boundary = handoff point |
| No retroactive tree records (brownfield) | Backfilling `.done.` cards for existing features is waste. The tree covers only what comes after adoption |
| Integrity check reports only, never auto-corrects | If auto-correction misjudges, it accelerates contamination |
| Cross-references between skills use slash-less stage names | Actual commands differ per tool (`/devflow:x` vs `/devflow-x`) |
| install.ps1 requires UTF-8 **BOM** | PowerShell 5.1 parses BOM-less files as ANSI → Korean script corruption (actually reproduced) |
| The multi-mode split axis is the **scope of truth**, not people | Documents with a single truth (project·tree·journal) are shared; only person-owned state (HANDOFF·marker·identity) is isolated into rooms (users/<id>/). Adopted after refutation-fork verification of 4 candidates (5 rounds total, real defects extracted each round) — rejection lineage below |
| HANDOFF is committed to git but never in a dedicated commit — it rides the boundary commit only | A dedicated HANDOFF commit polluted history and was reverted in practice (2026-08-06) |
| Design in Korean, deploy in English (dual language) | Korean is the language the user can review; English is what AI understands best at the lowest token cost. Procedure and terminology table: AGENTS.md |
| The terms of the review and verification roles live in the skill text — agents/*.md is Claude packaging (v0.9.5) | Same reason principles lives inside skills/: on installs that copy only skills/, the terms must travel along or platforms diverge. Found via an owner report (2026-08-09) — never-execute/never-fix, the taste exclusion, speculative marking, and fail-with-reproduction-steps shipped only in the Claude-only agent files. The agent files are a restatement of the same terms; drift between the two is a defect. Superseded in v0.9.6: the terms moved into one contract file beside each skill and Claude registration was dropped — see the v0.9.6 row |
| The Codex install leads with the native plugin channel (marketplace add + plugin add); generated slash prompts stay as the explicit channel; the hook stays separately registered in ~/.codex/hooks.json (v0.9.9) | Probed live: Codex consumes Claude-format marketplaces directly and model-invokes SKILL.md skills — a clean Codex session recognized all 8 devflow skills. Plugin-delivered hooks are a removed feature in Codex, so hook registration stays separate. The old prompts-only channel predates these capabilities and made auto-invocation Claude-only — the last platform asymmetry. Recurrence is guarded by the pre-flight item "install channels target each platform's current native mechanism" |
| Role contracts are one companion file beside each skill (reviewer.md · verifier.md); every platform runs them by briefing a clean context with the file verbatim — no Claude agent registration (v0.9.6) | An A/B/C test (2× registered agent · 2× prompt-briefed Claude subagent · 1× Codex CLI, one fixture with 4 planted defects) found all five runs identical — 4/4 detection and full contract adherence — so registration's assumed robustness edge was not observed. One mechanism dissolves the platform fork entirely. The mature precedent is superpowers (7+ harnesses, no registry, contract prompt files beside skills). Delivery must be static — verbatim file briefing (Claude · skills.sh) or install-time embedding (Codex); the only transport that failed in testing was shell interpolation |
| Brownfield entry is its own skill, adopt — split out of arch (v0.9.10) | arch held two concepts under one name — development planning and whole-Layer-0 reverse-derivation — so entry discoverability died (the derivation trigger lived only in the tail of the skill description) and the seam in the body was ambiguous (a literal reader could not settle whether the interview procedure and the verify-channel gate applied after derivation — owner report 2026-08-10). The derivation procedure and field split moved per the 0.9.8 decision — new sentences bounded to the entry guards, the evidence-order line, the gate pointer, and the design note; 0.9.8's "re-interviewing is waste" verdict stands. The output formats stay canonical in product·arch; adopt references them by stage name + the Codex prompt embeds them at install time (same grounds as the flat-folder decision). "adopt" is standard developer vocabulary — the Nx docs section "Adopting Nx", Next.js·React official "Incremental Adoption", the Tech Radar top ring "Adopt" |
| A signal pass goes stale when the diff changes + a fix card's completion signal is the verifier's reproduction steps (v0.9.4) | Two gaps flagged by an external loop-engineering review (2026-08-09) and confirmed against the text: a post-review fix could ride a pre-fix pass into commit (a stale-evidence path), and a fix-card signal could be written unrelated to the observed failure. Backing research verified against sources (blind-retry recovery 0.0 on latent/semantic errors; verifier +14.8%p from real misjudgment cases). Regulates only evidence freshness and signal provenance, not execution order — no red-green reintroduction, the TDD rejection stands (the failing "before" evidence already lives in the verify record) |

## Borrowings and their boundary

Borrowed from Matt Pocock's (mattpocock) skills repository: the research card (a distillation
of prototype+wayfinder), the 3 ADR conditions (domain-modeling), the dual verification axes
(code-review), and part of the value declarations in code-style's Values section
(codebase-design·tdd with the procedures removed — taste only).

**Deliberately not borrowed**: enforced vocabulary, the Red-Green procedure, the 12-smell
list, the 3-agent parallel design.

User rule: any further borrowing into this repository requires prior permission.

## Rejected ideas — to re-propose, refute the rejection reason first

Reviewed and rejected in v0.7.0:

- **Mid-task handoff document** — hands over a half-truth.
- **Card-promotion trigger inside work** — a door to silent scope expansion. (What was
  rejected is a standing trigger inside the work loop. The authorized path remains: the
  canonical rules' discovery→update table catches "merely bigger than expected" and routes
  it to split's promotion procedure.)
- **Journal injection by the hook** — duplicates what resume reads.
- **Relocating the verify-channel document** — the arch pointer suffices.
- **Moving open decisions into the journal** — one concept, two homes. Replaced by the
  HANDOFF carry-over rule.

Rejected or absorbed in the v0.8.0 multi-mode design:

- **Candidate A (shared documents + ID tags) · Candidate C (per-user folders)** — absorbed
  into the adopted design D ("scope of truth").
- **Candidate B′ (gitignored private files + public notes)** — preserved rather than
  rejected: kept as the answer for teams that must leave no devflow traces in the
  repository. Not used on the normal adoption path.

Rejected in the v0.9.4 loop-engineering review (2026-08-09):

- **Adopting graph engineering (typed evidence graphs · an orchestration agent)** — the
  tree, Depends, status suffixes, and revert already form a low-cost graph. A negative
  result was also confirmed: typed-graph retrieval scored 11.2%p below a strong hybrid
  ranker (p=0.0007).
- **A root-cause documentation stage** — the progress log is already where diagnosis
  lives. Demanding a separate artifact is method prescription.
- **Held-out / candidate-comparison promotion gates** — for probabilistic optimization
  of prompts and harnesses only. For devflow's own maintenance, the AGENTS.md
  refutation protocol already plays that role.
- **Harness self-evolution (rewriting its own prompts)** — collides head-on with the
  philosophy of steering without self-modification. Self-improvement stops at folding
  escaped defects into signals (adopted in v0.9.4).

Attempted and reverted in v0.9.12 (2026-08-10):

- **Unifying contradiction resolution onto the table** — a rewrite sending
  document-vs-document contradictions to the discovery→update table instead of steps
  1–4. The refutation pass run right after applying extracted two regressions, and the
  original text was restored: steps 1–4's side effects (`.stale.` marking, re-split)
  vanish on the contradiction path, and some wrong sides have no landing row in the
  table (design.md · an existing code-style line · a completion signal that runs but
  asserts the contradicted behavior). Any re-proposal must solve both. The literal
  collision between the contradiction sentence ("reconcile through this procedure")
  and the steps-1–4 scoping sentence ("only when a lower layer must violate") remains
  an open observation item — the field-observed Layer 0 freeze is already covered by
  the draft clause (adopted in the same version).

Rejected in the v0.9.6 role-contract redesign:

- **Plan B (contract files + keeping Claude agent registration alongside)** — its
  premise, "registration = harness enforcement = more robust," was not observed in the
  A/B/C test; it would keep a per-platform mechanism fork for no measured benefit.

Other:

- **Any "skim the related records" rule for maintenance reopening** — "related" is a
  judgment word; a literal-minded AI risks a read explosion, reading an entire fattened
  folder. **No unbounded reading rules, ever.** (For the bounded, confirmed wording, see
  the observation items below.)

## Field observation items — watch during coming cycles, without adding rules

- **Reaching prior records when maintenance reopens a capability** (verified 2026-08-08,
  design ready): maintenance cards formally have no dependency, so split's rule that
  carries a dependency's conclusions into `Read first` may not fire. The promotion
  machinery (upper-document feedback · journal sweep) has already lifted binding knowledge
  into shared documents, so the gap is cost-type (rework from re-discovering traps), not
  catastrophic. If friction is observed, insert the confirmed wording into split's routing
  section: "A maintenance card names, in `Depends`, the card that built what it modifies
  (findable by name in the tree listing) — the carry rule then brings that card's
  conclusions into `Read first`." (2 lines, 0 new concepts, bounded reading)
- In the maintenance phase, when cards keep appending in a capability folder (02.7…02.40),
  does the intermediate grouping-folder rule actually get applied?
- Are ADRs actually used for large scope pivots (e.g. shrinking ade's MVP ①②)? — the
  device exists; it is a matter of usage judgment.
- In complex multi-domain brownfields, does "trace one representative flow" cut the
  capability list too coarsely? — if friction is observed, strengthen to "one flow per
  capability candidate".
- Document bloat over a multi-year horizon — the big cleanup is not a new rule but a
  re-run of product/arch (an authorized re-baseline).
- A fix-card signal born from an intermittent failure (races, etc.) has weak
  reproduction power — a single pass can overstate that the defect is gone. Review the
  wording only if friction is observed.
- As fix cards accumulate, per-folder regression rerun cost grows — if it gets heavy,
  re-evaluate together with the tree-archive rule (the on-hold list).
- Whether the contract file is actually briefed verbatim at dispatch (summarized-delivery
  friction) — if the transport lesson from testing recurs in practice, review the wording.
- Whether the failure ladder's third rung (call the human) gets exhausted repeatedly in
  practice — if observed, re-evaluate competing attempts (2 independent implementations +
  comparative selection) as an option in split's execution proposal. Grounds for
  non-adoption: judge bias and cost (the 0.9.13 research plan).
- Whether capabilities settle into "works but mediocre" form after closing — before any
  rule, experiment with requesting simplification cards through maintenance routing.
- The hole-hunt sample width at the capability layer — is one scenario + one boundary
  input enough? If holes outside the scenario, or cross-capability interactions, are
  observed as friction, design the widening then (0.9.14 inspection verdict: the
  behavioral half is designed; undesigned are the sample width, a re-run rule for a
  full pass at re-closure, and the absence of a "pass-with-findings" verdict slot and
  a zero-findings-valid clause).
- Product-layer (MVP) verification checks only against self-authored success criteria —
  it structurally cannot catch the spec's own blind spots. If observed as friction,
  consider an independent-perspective axis at MVP close.

## On hold — candidates for coming versions

After going public this list migrates to GitHub Issues. The rejection lineage, however,
stays in this document, not in Issues (the next AI does not read closed issues, but the
gate forces this document to be read).

- **Bug-diagnosis skill** — blueprint: Matt's diagnosing-bugs ("the reproduction loop is
  the whole skill; the rest is mechanical"). Re-evaluate after one real cycle.
- **Tree archive rule** — trigger condition: when resume's full tree listing becomes a
  burden to read. Preserve names on migration; maintenance routing searches the archive
  too. Until then, YAGNI.
- **GitHub publication + `npx skills add` support** — the structure is already compatible.
  The v0.9.0 documentation overhaul is the preparation for it.
- **Migration skill for older devflow document versions** — for now the "one
  reconciliation card" pattern suffices (integrity check + the contradiction=defect rule
  is the detector). Re-evaluate once multiple projects exist after publication; at that
  point the per-version records in `CHANGELOG.md` become the skill's input.
