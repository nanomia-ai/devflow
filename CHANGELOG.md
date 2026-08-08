# Changelog

All notable changes to devflow, newest first. Format: each entry records **what changed
and why** in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

## 0.9.5 — 2026-08-09 — role terms made platform-neutral (work · verify · README)

An owner report caught the README claiming the two agents are "Claude only — not part
of the Codex install." That was literally true of the packaging, and that is the
defect: the installers convert only skills/*/SKILL.md, so the parts of the reviewer
and verifier terms that lived solely in agents/*.md (never execute / never fix, the
taste exclusion, speculative marking, a fail reported with reproduction steps) never
reached non-Claude platforms — the same prescribed process ran under thinner terms.
The fix follows the recorded principles-in-skills logic (what must travel lives in the
skill text): work's review step now states the reviewer terms; verify's bias-removal
section states the verifier terms platform-neutrally and defines the Claude agents as
their packaging; the README paragraph now says the process is identical on every
platform. agents/*.md unchanged — they restate the same terms, and drift between the
two is a defect (decision recorded in docs/design.md). Files:
skills/work/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md, README{_ko,}.md,
docs/design{_ko,}.md, .claude-plugin/plugin.json. Codex prompts regenerated. The
wording survived an adversarial pass — 3 minor findings: the execute obligation made
explicit in the verifier terms, the English README aligned to "execute" (it had coined
"runs"), and the reply-layout delta (the agents' fixed return shapes) adjudicated as
packaging, since the verdict triad and evidence-recording obligations already ship
platform-neutrally in the skill.

## 2026-08-09 — docs only: README gains the work ⇄ verify loop section (no version change)

Between work and verify the README named the two agents but never showed the loop
geometry. A new subsection under "The 8 skills" draws the inner loop (implement →
signal → review → commit, with the fix path re-running the signal) and the outer loop
(scenario + regression → verdict, with fail birthing a reproduction-signal fix card),
then states the three ways the loop improves and the outcome it drives (a defect met
once cannot escape again; the harness grows only on real defects). Files: README_ko.md,
README.md.

## 0.9.4 — 2026-08-09 — loop closure: signal freshness + fix-card reproduction signals (work · verify)

Two literal-walkable gaps in the work⇄verify loop, flagged by an external
loop-engineering review and confirmed against the text before adoption:

- work: after a review objection was fixed, nothing required the completion signal to
  run again — a pre-fix pass could ride into the commit as stale evidence (the verified
  code being version A, the committed code version B). The loop's review step now
  states: a fix that changed the diff re-runs the signal — against the changed code, an
  earlier pass is unverified (the iron rule's own vocabulary; no new status word). The
  delegation stage split names the owner of that re-run (main, for its own fixes) —
  two independent verification passes hit the same seam, which earned the parenthetical.
- verify: a fix card's completion signal had no tie to the failure that created it — a
  weak signal ("build passes") satisfied the letter. A fix card born from the verifier's
  fail now carries those reproduction steps rerun through the channel — the escaped
  defect becomes a signal and joins every future regression rerun. This is the only
  self-improvement adopted: the harness grows exactly one step when a real defect
  escaped, never for imagined risk. Not red-green reintroduced — the failing "before"
  evidence already lives in the verify record; work still runs the signal once.

Verification: the review's cited papers checked against arXiv (the two load-bearing
results match to the digit; one paper's claimed numbers are absent from its abstract and
were dropped from the rationale); a fresh-literature sweep supported both rules
(evidence-freshness gating; failures promoted to regression checks) and flagged
regression-set growth as the cost to watch. Draft wording survived refuter +
literal-walk passes (12 findings folded in — v1's "failing before / passing after"
clause was deleted as a red-green reading colliding with the recorded TDD rejection);
the applied text was re-audited with fresh lenses (capable-reader walk + over-harness
audit): one garden-path phrasing fixed in the English delegation parenthetical, all
additions judged clean. Rejection lineage (graph engineering, root-cause stage,
held-out gates, harness self-evolution) and two field-observation items
(intermittent-failure reproduction power, per-folder regression cost growth) recorded
in docs/design.md. Files: skills/work/SKILL{_ko,}.md, skills/verify/SKILL{_ko,}.md,
docs/design{_ko,}.md, .claude-plugin/plugin.json, CHANGELOG.md. Codex prompts
regenerated locally.

## 2026-08-09 — docs only: maintenance protocol hardened (no version change)

AGENTS.md verification protocol: two items amended, two added, distilled from the 0.9.x
campaigns — lens differentiation + "zero findings is valid" for verification agents
(item 1); sanctioned-exceptions-outside-the-canon added to the watched defect classes
(item 5); walks-vs-coordinate-sweeps geometry — narrative simulations prove walked
paths only, structural changes get a coordinate sweep, external reviews are adjudicated
against the text (new item 6); honest reading of finding counts — first-pass findings
on new text are the pattern working (new item 7). The Korean-check definition now names
the tool directly (ripgrep run directly or a Perl scan — proxied grep rewrites
false-positive here); Releasing gains the CLI reinstall command. The additions were
themselves refuted before landing (11 findings applied across AGENTS.md and the new
kickoff prompt).

## 0.9.3 — 2026-08-08 — research-card path closed (verify · split · work · principles)

Three gaps on the research-card axis, reported by an external session's review and
adjudicated against the actual text (one claim reported as a literal contradiction was
downgraded to an undefined relation — task card and research card are distinct named
concepts, so principle 7 never bound research cards; what was missing was the
declaration). No prior verification round had walked this axis — narrative walks only
find defects on paths they take, which is also why these survived earlier convergence.

- verify: a research card's completion signal ("answer + evidence recorded in the log")
  is a record, not a run — regression no longer demands a re-execution the verifier is
  forbidden to perform (it may not read documents); the main session confirms the record
  instead (a document axis). The verify.md regression line now counts rerun,
  substituted, and confirmed signals.
- principles + split: principle 7 (identity re-injection) gains its exception in the
  canon — research cards carry no Coordinates or Identity (the log freezes once the
  answer lands); Depends · Read first · Tier remain usable. Declared in principles,
  where every sanctioned exception lives — a split-only declaration would lose to the
  canon on conflict.
- split + work: the review gate is one rule stated identically at both ends — research
  cards are not review subjects (the deliverable is an answer, not code), with the same
  limit on both sides: a diff touching the real code does get reviewed (work's bare
  exemption would have blanket-covered a prototype leaking into real code).
- principles: "authorized exception" unified to "sanctioned exception" (one concept,
  one word).
- The wording was attacked by a refutation fork before landing (7 findings applied —
  among them: the exception must live in the canon; "complete with two fields"
  over-exempted Depends/Tier; "question card" coined a second name; "no code to review"
  was a false ground).

## 0.9.2 — 2026-08-08 — balance audit: philosophy-axis review + flow simulation

Prompted by the owner's concern that this session's high finding count might indicate
over-interpretation, two independent reviews ran with opposite lenses: an over-harness
audit (forbidden from proposing more specification) and a capable-AI flow simulation
(three full walks: solo lifecycle, multi collaboration, death-and-resume). Verdict: the
0.9.1 additions are invariants, not rigidity — every promotion step has a concrete
failure path if deleted; flow fit rated 9/10, "no decorative rituals". Changes:

- split: deleted the ".done." sentence from promotion step 5 — a weaker duplicate of the
  canonical rules (it had already drifted: the commit-landing condition was missing) /
  "frontend is always sequential" relaxed to "frontend work sharing a dev server is
  sequential" — the rule now dies with its reason instead of outliving it
- verify: the capability scenario's origin defined (the main session composes it from
  product.md's capability description and the cards' Destinations) — "read" had sent
  sessions searching for a document that never exists
- resume: read 3 gains the uncommitted-changes cross-check (a session that died mid-card
  leaves uncommitted code; the log alone can overstate progress)
- AGENTS.md: the verification protocol gains the reverse defect class — a sentence whose
  deletion breaks nothing is a defect too; every added sentence must name its concrete
  failure path (counterweight to adversarial review's one-way pressure toward more text)
- README pair: the card state diagram gains the waiting→promotion transition (promotion
  at opening was documented in split but missing from the diagram)
- Deliberately left unchanged (reviewed; fixing judged to be over-polish): arch's
  browser-MCP halt, the claim "visibility" phrasing, the `wip:` checkpoint message on a
  suffix-less card
- A full re-verification on the applied text then caught the relaxation failing to reach
  its replication sites: work still declared "same conditions as split" over the old
  absolute sentence, and split's own general condition ("don't touch the dev server",
  singular) made the relaxed sentence unreachable — both aligned to "a shared dev
  server"; resume's new "mid-card" unified to the existing "mid-task"

## 0.9.1 — 2026-08-08 — promotion of in-progress cards defined (split · principles)

The promotion procedure distributed only Destination·Why, so promoting a card with a
non-empty progress log destroyed the log — violating "if the session dies at any moment,
reading this file alone must be enough to take over" — and in multi mode the claim
suffix vanished, leaving children born unowned. Found by the v0.9.0 literal-execution
audit; the draft wording was then attacked by a refutation fork, which extracted 10
findings — all applied. Key ones: the git guarantee requires a checkpoint commit before
the file disappears (an uncommitted log would die with it); the trigger keys on a
non-empty log, not the `.wip.` suffix (released cards keep their logs; multi suffixes
carry an id); the in-progress portion moves into the continuing child's progress log —
conclusions alone are not enough to resume; the inherited suffix is born inside the
promotion commit, closing the claim race window; promotion is an immediate dedicated
commit (`NN.N promote`); a promotion's child numbers count as minting.

A full-repository final verification then ran on the applied text and extracted 10 more
findings — chiefly: the checkpoint commit was ordered after the file's transformation
(the very window it exists to close), and the suffix inheritance was trapped inside the
non-empty-log branch, so the most common path (claim → read → discover it is too big,
log still empty) lost the claim. The procedure was restructured into 7 steps with the
checkpoint first and the suffix rule as an independent condition.

- split: promotion procedure is now 7 steps — multi minting declaration in the preamble /
  1 checkpoint commit (if log non-empty) / 2 transform / 3 distribute the card head
  (Destination · Why · Forbidden · Depends · carried quotations) / 4 numbering /
  5 suffix inheritance (independent of the log; the inheriting child is born inside the
  promotion commit) / 6 log contents (conclusions → affected children's `Read first`;
  in-progress portion → the inheriting child's progress log, or a quotation if no child
  continues) / 7 immediate dedicated commit `NN.N promote` (multi: binding decision) /
  the minting clause covers promotion child numbers
- principles: the discovery→update table's promotion row points to split's promotion
  procedure / the binding-decision "nothing else rides along" rule gains its authorized
  exception (the promotion commit carries the claim-suffix inheritance)
- resume: the prefixed-commit enumeration gains promote / work: the solo "rename rides
  the next boundary commit" rule notes that riding a wip checkpoint commit is fine

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
