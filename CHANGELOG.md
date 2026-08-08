# Changelog

All notable changes to devflow, newest first. Format: each entry records **what changed
and why** in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

## 0.9.0 — 2026-08-08 — rename to devflow + documentation restructure for publication

- **Renamed nano-devflow → devflow** (plugin name, Codex command prefix `devflow-*`,
  hook messages, installers). Reason: commands were needlessly long in real use; the
  namespace/prefix structure is unchanged, so collision blocking still holds. The Codex
  installers now also delete old `nano-devflow-*.md` prompts on install.
- **DEVLOG.md retired and split by role** (an AI-reader-focused restructure — one file
  was serving four audiences):
  - design philosophy, key decisions, rejection lineage, observation items, on-hold list → `docs/design.md`
  - maintenance gate, dual-language workflow, verification protocol, terminology table → `AGENTS.md`
    (+ `CLAUDE.md` as a one-line import — single source, per the observed ecosystem practice)
  - append-only version log → this file
  - the volatile "current state / next input" section was dropped from the repository —
    it was per-user working state, not project documentation
- **README rewritten for GitHub** — English `README.md` + Korean original `README_ko.md`;
  visual-first (mermaid flow/state diagrams, annotated file trees), install paths no
  longer reference a local absolute path.
- **LICENSE added (MIT)**; plugin metadata (plugin.json, marketplace.json descriptions)
  translated to English (deploy artifacts must contain no Korean).
- Housekeeping: the on-hold item "codify verify.md re-verification overwrite" was removed
  as already resolved — v0.8.2 added the rule to both SKILL_ko.md and SKILL.md (verified).
- Verification: two adversarial audits ran on the restructure itself (content-loss
  old-vs-new comparison + literal-execution simulation of a fresh maintainer and a fresh
  README visitor); ~30 findings applied before release, then the fixes were re-audited
  (6 further findings, also applied).

## 0.8.3 / 0.8.1 — 2026-08-08 — audit follow-ups (logged post-hoc)

v0.8.1: two post-hoc audit fixes — removed resume's hard-coded "5 items" for the
integrity check (the list had grown to 8, and a literal-minded AI would skip the
multi-mode items), and made work's commit line explicit about the multi-mode prefix (protects
digest's "my commit" classification).
v0.8.3: two re-audit fixes on the fixes — clarified the subject of integrity item 8
("the author, not the claimant" — otherwise a teammate's normal commits are all reported
as anomalies, a noise defect), and labeled the reassignment rule as "the authorized
exception to claim inviolability".
(This entry was logged post-hoc — the log was missed at commit time and recovered during
a session-handoff evaluation.)

## 2026-08-08 — docs only: observation item detailed (no version change)

Verified the gap where carry-forward reading does not fire on maintenance reopening —
improvement possible (reuses Depends targeting, no side effects confirmed). Recorded the
confirmed wording alongside the rejected form (unbounded skimming → read explosion) in
the observation items. Application deferred until real-use friction. No skill text changed.

## 0.8.2 — 2026-08-08 — two full simulations reflected (session dynamics + full lifecycle)

Re-verified on the 0.8.1 deployed text with two forks: ① multi-mode multi-day work
simulation (S1–S7) ② solo full lifecycle unrelated to team features (new → MVP →
maintenance, L1–L6). Zero structural rework; 12 local wording fixes:

- principles: resolved the conflict between boundary commits and binding decisions
  (documents already landed on integration must not re-board) / excluded renaming my own
  card's state from the binding definition / stalled-claim reassignment rule (release →
  re-claim, only on user instruction)
- work: restored the solo no-change guarantee — solo renames ride the boundary commit;
  claim commits are multi-only (message `<id> NN.N claim`) / capability-layer verify
  proposals limited to layer-1 capability folders (blocks misrouting to foundation and
  intermediate folders) / progress-log section excluded from review input (fixes a
  self-violation of the no-history premise)
- resume: digest's "my commit" classification simplified to the prefix criterion
  (prevents misclassifying boundary/claim commits)
- verify: remote-only signals (CI) may substitute evidence in both modes / journal sweep
  widened to full scope (resolves ownerless foundation-era and cross-cutting lines) /
  product-layer record home fixed at `devflow/tree/verify.md` + re-verification
  overwrites confirmed / proportionality clause for reopen-then-reclose (scenarios may
  shrink; regression stays full)
- arch: integration/merge lines marked solo-skip / reviewer: progress-log exclusion codified

## 0.8.0 — 2026-08-08 — multi mode (multi-user design split by scope of truth)

Under the premise of partial adoption (only some teammates use devflow), a design that
solves no-conflict-among-adopters and awareness-of-non-adopters' work at once. Four
candidates (A shared+ID / B′ gitignored-private+public-notes / C per-user folders /
D unified) each attacked by refutation forks (5 rounds total, real defects extracted
every round); D adopted — **the split axis is the scope of truth, not people**: documents
with a single truth (project·tree·journal) are shared; only person-owned state
(HANDOFF·marker·identity) is isolated into rooms (users/<id>/).

- principles: new "mode and identity" section (owner.md existence = multi, solo no-change
  guarantee / git identity → room mapping, unresolvable sessions are read-only /
  only `.wip-<my id>.` is my work / 4 transitions: join, solo→multi, leave, multi→solo,
  each a single commit) / claim·release in state notation / integrity check +3 items
  (ownerless claim · duplicate identity · trespass on another's claim) / commit
  discipline: id prefix, binding decisions, double-claim loss adjudication, number-collision
  repair (mid-insertion), journal union merge, no squash
- resume: new digest section (boundary gate — resuming my claim comes first / others'
  commits after my marker + my commits outside my sessions / findings land in shared
  documents via the discovery→update table / roll-up at 30+ backlog / marker re-anchoring) /
  reading·freshness·exceptions keyed to my claim
- work: preconditions recast as claim (rename commit = claim, pull and digest before
  claiming, assigned-card etiquette) / HANDOFF path branches by room / terminology fix
  "digest only 5 lines" → "receive" (digest reserved as the mechanism term)
- split: number issuance single-flight per capability folder (declare·expire·land rules) /
  assignments recorded in journal
- verify: closure only after fetching the integration branch / cross-platform signals via
  CI evidence·delegation / fix cards born bare (unclaimed) / journal sweep owner = the closer
- arch: integration·merge lines in settings (multi-only)
- hook: scans users/*/owner.md, resolves git identity (safe demotion on failure — never
  crash), injects my/others' claims distinctly, incomplete-transition fallback (injected
  with a root-HANDOFF warning), warning logic branches by mode. Solo output verified
  identical via fixtures
- Codex AGENTS fallback block gains multi-only wording / README fully reworked (design
  philosophy · two modes · transition procedures · the 4 multi concepts)
- Verification: D-structure refutation fork (10 findings applied) + literal-execution
  simulation fork on the detailed wording (13 applied, GO verdict) + 3 hook fixture sets
  (solo identity · multi resolution · unresolved identity) passing.
  Rejection lineage: A·C absorbed into D; B′ preserved as "teams that must leave no
  devflow traces in the repository" only

## 2026-08-07 — docs only: on-hold list expanded (no version change)

Recorded homework from post-0.7.0 structural verification (1-year time-axis stress /
multi-user) into the on-hold list. Team mode fixed at 4 directions, verify.md overwrite
codification planned, migration deferred to the card pattern, 4 new field observation
items. No skill text changed.

## 0.7.0 — 2026-08-07 — session handoff · document feedback · git ownership (rewrite)

The 8/6 v0.7.0 commit (9e67612) was largely correct in content but violated the
dual-language workflow (_ko first · DEVLOG) and was reverted. This edition confirmed the
5 defect diagnoses via independent re-verification (refutation + literal-execution
simulation forks ×2 + main cross-check), fixed 15 further defects, added 7 new
protections, and was rewritten by the book. Empirical basis: one nanomia-ade cycle (01-foundation, 13h,
one mid-session death, credit/ack document contradiction).

- principles: 4 rows added to the discovery→update table (Provisional measured · success
  criteria unverifiable · done-card signal rot · new term) / "contradiction between
  documents = defect, silent adoption forbidden" / table updates via the authorized path
  (the 4 steps only on violation) / commit discipline gains evidence-wait · boundary
  commit · git exclusivity for the main session (subagents implement, the main session
  commits) / 2 single-wip exceptions (journal-backed) / foundation
  folder closure conditions / folder .stale (retired) / ".done. = signal+review+commit"
  resolves the term collision
- work: arch co-reading (including Provisional·verify_channel) / progress-log gate
  (before long or failure-prone runs) / feedback step (upper documents replaced before
  rename) / handoff triggers changed from % to events (questions only before opening a
  capability folder; the rest are reports) / delegation split (subagent = implementation·
  signal·log, main = review·commit·feedback·rename) / open-decision carry-over duty
- resume: HANDOFF freshness check (against work commits; tree wins; stale HANDOFF still
  reports open decisions) / full journal read
- split: journal in the first read / carry conclusions from `.done.` dependency cards
  (T-mid pointer · T-low quotation) / research card "answers may go upward too" /
  parallel approvals recorded in journal
- arch: new Provisional section (resolution-card contract) / desktop·TUI rows in the
  verify channel
- verify: regression widened 1 hop to Depends-named cards / Provisional-replacement check
  axis / journal sweep (on capability closure, 1 line recorded) / role ownership
  (execution = verifier, document axes·sweep = main)
- product: desktop in interface / capability retirement notation (numbers immutable)
- reviewer: self-contradictory return format fixed (pass 1 line / findings 4 lines)
- hook: .stale folder skip, multi-wip warning wording synced, HANDOFF truncation 3000→6000
- Decision: HANDOFF is committed to git but never in a dedicated commit — rides the
  boundary commit only (based on the 8/6 reverted dedicated-HANDOFF-commit case)

## 0.6.0 — 2026-08-05 — native Codex SessionStart hook

- Research (2 subagents, Sonnet) confirmed: Codex CLI v0.124.0+ has a hook system nearly
  1:1 with Claude's (`~/.codex/hooks.json`, same JSON schema,
  `hookSpecificOutput.additionalContext` injection, requires `[features] hooks = true`).
  The earlier "Codex has no hooks" judgment was wrong — an illusion caused by the
  well-known dual-support plugins surveyed (mattpocock/skills, obra/superpowers,
  vercel-labs/skills) all predating hooks and not using them.
- New `scripts/install-codex-hook.js` — idempotent merge into hooks.json (preserves other
  tools' entries), feature-flag check. Called from both installers. **The same
  session-start.js serves both Claude and Codex.**
- AGENTS-devflow block demoted to fallback (hook-incapable environments only)
- Future options (not applied): Codex also natively scans `~/.codex/skills` — skills
  could be installed there instead of prompts. Per-skill `agents/openai.yaml` sidecar can
  provide Codex UI metadata (mattpocock pattern)

## 0.5.0 — 2026-08-05 — English deployment

- **English conversion**: deploy artifacts (8 skills · 2 agents · AGENTS block · hook
  injection strings) switched to English. Korean originals preserved with the `_ko`
  suffix (agent Korean versions in ko/ only — avoids double registration)
- Dual-language workflow + terminology table codified (now in AGENTS.md)
- Verification: ko↔en heading counts, numbered-list counts, key figures 1:1; zero Korean
  in deploy files; Codex regeneration passing
- git repo initialized. v0.4.0 (Korean edition) is the first commit — the pre-translation
  original is preserved in history

## 0.4.0 — 2026-08-05 — reviewer agent

- **New reviewer agent** — pre-commit code review (3 verdicts: intent·logic·scope).
  Two-track with verifier: reviewer reads but never runs (white-box); verifier runs but
  never reads (black-box). Basis: completion-signal pass ≠ intent match — nobody was
  reading the paths the signal does not cover.
- work loop gains a review step (between completion signal and commit); research cards
  skip it; low reasoning effort recommended for T-high
- split execution proposal gains a "skip review" option (review is the default); verify
  layer table updated

## 0.3.1 — 2026-08-05

- 2 lines defending against document contamination/fossilization (principles, document
  hierarchy): core documents change only through procedures/skill re-runs / replacement
  is the default ("a document that only grows is a dead document")
- Terminology alignment: split "strong card" → "complete card" (one concept, one word);
  work's parallel-condition wording unified with split's

## 0.3.0 — 2026-08-05

- Output folder `docs/` → `devflow/` across the board (collision with existing projects'
  docs/)
- principles: document hierarchy (4-step upward propagation + update adjudication table),
  5-item integrity check introduced
- arch: ADR 3 conditions replaced, code-style.md output added (Values, 7 lines default),
  brownfield flow tracing · style back-derivation
- split: start-condition gate (halt without product.md), layer-opening declaration,
  research cards, modification-request routing (a `.done` folder loses its suffix when a
  new card is added to it)
- work: code-style reading + existing-code check before implementing + document hierarchy
  hookup
- verify: capability layer gains boundary (malicious input) · standards (code-style) axes
- hook: devflow/ paths, duplicate-number and multi-wip warnings
- DEVLOG.md introduced

## 0.2.0 — 2026-08-05

- Prefix introduced: plugin nano-devflow, Codex commands nano-devflow-*
- PRINCIPLES.md → skills/principles/SKILL.md (skills.sh compatibility)
- split gains the recursive-split section (card→folder promotion, 02.3.1 numbering); arch
  gains the brownfield back-derivation procedure
- Cross-tool defect fixes: skill cross-references as stage names, install.ps1 BOM,
  verifier tool restriction lifted

## 0.1.0 — 2026-08-05

Initial implementation. 7 skills (product/arch/design/split/work/verify/resume), 1 hook,
Codex installer.
