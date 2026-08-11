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
| devflow does not create or manage a Git-worktree workflow | For parallelism: core edits are common, so coordination/merge cost > parallel gain. For showcase: the user confirmed "screen may break during work" → benefit gone. This does not mean ignoring repositories where the user already has several checkouts or worktrees. Recovery distinguishes the current checkout from shared state on the integration branch |
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
| The audit — event-triggered deep inspection; findings are not verdicts (v0.9.15, scope amended v0.9.21) | Grounds: owner field reports (2026-08-10, running ade): one-pass results leave holes, and mistakes pass verification unrecognized as mistakes. Implements two observation items (capability-layer sample width · MVP spec blind spots). Not an always-on step — exactly three events fire it (product layer once · closure of a capability whose verify.md records a fail · user request): the runtime application of "the harness grows only on defects actually met," so a cleanly closed capability costs zero. Convergence devices: non-blocking findings · zero-findings-valid · only user-adopted findings become cards · re-closure never re-runs it (a new leak is a new event). The v0.9.15 scope of "executed paths + the capability folder" assumed that task history represented current topology; that fails for brownfield and flat layouts, exposes card history, and misses current surfaces not yet executed. v0.9.21 therefore excludes past commits, diffs, and cards and bounds the audit to paths mapped exactly by arch or the current capability code scope from external entrypoints to shared-contract boundaries. Adopted only after dual independent validation (refutation walk · whole-system audit) extracted and repaired/cut the draft's trigger-anchor misreadings (dies-by-overwrite / fires-forever), unbounded reading, and the quality prey (unrefuted against the simplification-card experiment-first lineage) |
| The retrospective — a fourth role that post-hoc evaluates design alternatives at the MVP boundary; findings are not verdicts (v0.9.16) | Grounds: owner testimony (2026-08-10): AI never doubts the plan it made itself, reviewer/verifier catch only clear problems, and nobody ever asks whether a better option existed — detection does not happen on its own, which refutes the premise (the user notices) of the "simplification-card experiment first" observation item. The judgment word ("better") is bounded by three requirements: a concretely named alternative + this project's strain evidence as mandatory (fix-card density, `.stale.`, ADR update comments, unresolved Provisional rows — only artifact-observable signals; the refutation pass extracted and cut the draft's escape-card and provisional-churn signals as unobservable) + a switching-cost estimate marked presumed. Input is devflow artifacts only, zero code — reading fully bounded. An auditor second mode was rejected (opposite blinding axes — one name, two concepts). Fires only after the product-layer verdict is recorded (once) and on user request; non-blocking, zero-findings-valid, adopted findings only become cards or a re-baseline (the event list gained capability first closure in v0.9.17 — see that row) |
| The retrospective also runs when a capability first closes — scoped to that capability (v0.9.17) | Overturns v0.9.16's capability-level exclusion on owner direction (2026-08-10), refuting both recorded grounds: "strain evidence is thin" — narrowing the input to the capability thins the cost with it, zero-findings-valid makes it harmless, and early detection before dependent capabilities build on the design is cheaper than MVP-time detection. "It becomes a standing step" — the owner specified this rhythm directly: the planner is human, and a check-in at every large unit beats running solo; an operating direction is direction itself, not imagined risk. Card-level retrospectives remain excluded |
| A signal pass goes stale when its inputs change + a fix card's completion signal is the verifier's reproduction steps (v0.9.4, product- and capability-layer extension v0.9.21) | Two gaps flagged by an external loop-engineering review (2026-08-09) and confirmed against the text: a post-review fix could ride a pre-fix pass into commit (a stale-evidence path), and a fix-card signal could be written unrelated to the observed failure. Backing research verified against sources (blind-retry recovery 0.0 on latent/semantic errors; verifier +14.8%p from real misjudgment cases). Regulates only evidence freshness and signal provenance, not execution order — no red-green reintroduction, the TDD rejection stands (the failing "before" evidence already lives in the verify record). v0.9.21 binds a product-layer verdict to Product revision for product.md, Verification revision for arch.md · code-style.md · glossary.md, and Code revision for the newest commit outside devflow. The capability layer's Capability revision includes only the exact HEAD paths of target `.done.` task cards and their directly depended-on cards. Verification and Capability revisions hash raw `git ls-tree -r -z` bytes instead of JSON whose sorting, Unicode, and path separators can vary. An uncommitted revision input, direct-dependency card, or path outside devflow forbids the verdict |
| Ready-card semantics, per-card execution-proposal approval, and resume routing are decided from disk state (v0.9.21) | Two independent literal executions cross-confirmed deterministic session-boundary failures: a card with completed `Depends` remained forever unclaimable under the words "dependency-free"; ending a session after adopt but before split produced an adopt↔resume loop; resume called only work even at split and verify boundaries; and ordinary execution-proposal approval left no disk trace, so the next session could not distinguish before from after approval. Ready means `Depends` is `none`, or exactly one `.done.` card exists for every comma-delimited number. New cards use one dependency format. Only a card missing `Approval` or `Review` is legacy; its leading numbers are parsed mechanically and normalized when next planned, while the user decides an unparseable member. `state-predicates` owns task-card judgments once; `verification-predicates` owns revision and event judgments once. The former enters Claude and Codex input for split, work, verify, and resume; the latter only for verify and resume. Approval, parallel group, and review policy live in each card and land in a planning commit; the claim suffix alone owns assignment. Approval is effective only when the same authority path exists and both index and working tree equal solo HEAD or the fetched multi integration branch under Git-normalized comparison. An out-of-scope prerequisite changes the new card, the original card's `Depends`, approval, and release in one planning commit. The resume table covers partial trees, retired capabilities, blocked dependencies, and a completed product. The arithmetic conflict that forbade a two-card split was removed too |
| Brownfield and layer transitions have explicit disk states, preserving their meaning across interruption (v0.9.21) | An adopted repository and a new project had the same document shape, so resume backfilled existing features into the tree; deriving a multi-domain service from one representative flow also produced capability boundaries that were too coarse. adopt now enumerates candidates from external entry points, top-level modules, and existing documents, then traces one representative flow per candidate. arch.md's `Brownfield` field records only whether implementation existed before adoption, preventing backfill. Completing tracked post-adoption work does not expand automatically into the product layer; only an explicit `product verification requested` marker opens it. That request changes atomically to running and result states, each in its own commit, so the brownfield trigger and revisions survive request deletion. A verbatim `maintenance routing pending` line survives until the planning commit so a session break between adoption and the first card plan cannot erase the change request. Before opening a layer, an exact parent path and child numbers go into a journal marker before the parent is created; the marker is deleted only when every child and task-card approval lands in the planning commit. Root waiting capability files are not task cards and therefore have no Approval or Review fields; a new project's foundation is never an empty folder and is created with its direct cards in the next layer. The boundary after an ordinary final task commit is detected without Git's rename label: the HEAD claim is absent, exactly one same-number/name `.done.` file exists beside it, and bytes match. A begin marker carrying the passing revisions recovers capability closure. Non-capability folders whose active direct children are all `.done` close deepest first; only a capability folder waits for a verify pass |
| `.stale.` task cards remain as history, and a `re-split pending` marker recovers interruption before replacement planning (v0.9.21) | Retrospective reads `.stale.` cards as strain evidence, but closure required every child to be `.done` and product completion prohibited `.stale.` itself, so one normal upper-decision change made permanent incompletion. `.stale.` task cards are kept and excluded from active-child counts, while closure still requires at least one active direct child. An upper decision first leaves one exact `re-split pending` marker per direct parent folder; split deletes it only when the user-approved replacement-card plan lands. work decides whether the current card is invalid before its final task commit, entering this path through a wip checkpoint instead of a completion commit. The marker therefore resumes re-splitting after interruption, while preserved `.stale.` history no longer blocks completion after planning |
| Durable knowledge is connected through bounded consumers of existing records, not through a new document layer (v0.9.21) | glossary and journal were produced but arch, design, work, verify, and delegated implementers did not read them; conclusions completed after two dependent cards opened together also could not reach the next implementer. The repaired read set is completely enumerated by name: glossary and journal when present, plus only the cards directly named in `Depends`. For brownfields, adopt indexes only exact per-capability paths to existing handoff and specification files under arch.md `Existing records`. The index is neither a read instruction nor canon; work opens only a path that split rechecked against current code and placed in the card's `Read first`. "Related records" and whole-capability-folder reading remain forbidden. Layer 0 completeness includes glossary; when only it is missing, resume sends a brownfield to adopt and a greenfield to product without rewriting another confirmed document. This does not force a second domain-handoff layer in the style of jgnote; it closes reachability within the existing canon, tree, and short-record hierarchy. The retrospective likewise receives exactly one event-specific input set, so capability and whole-project scopes cannot merge |
| Platform adapters only connect to the shared skill; they do not duplicate its procedure (v0.9.21) | Claude and Codex share the same semantic rules in SKILL.md and the role contracts. The Codex fallback AGENTS copied only part of resume, omitting journal, freshness, and integrity checks; the hook separately decided the next Layer 0 stage; and the local installer registered both the plugin hook and the old global hook. The fallback and hook now only route to shared resume. The hook injects no file content, HANDOFF, or next-stage classification. The installer removes the exact old registration only after the native plugin succeeds, preserving a working predecessor when replacement fails. A malformed `owner.md` keeps multi mode active, but a valid resolved room stays writable; only a session whose identity remains unresolved fails read-only. These are transport repairs to one contract, not platform-specific policies |
| Verification failures, repairable unverified results, and Audit and Retrospective events survive verify.md overwrites and session interruption (v0.9.21) | Re-verification erased earlier `Failure history`, Audit, and Retrospective results, so first closure could not be distinguished from re-closure; ending a session after recording the verdict but before a once-only role ran also lost that event forever. Timestamp locators collide when several failures or events occur in one second, so each verify.md section assigns a never-reused positive `source id`, and an adopted finding is identified by event id plus finding number. Legacy timestamp records receive ids in file order without losing their original text. Each failure and repairable unverified result keeps its own route in `Failure history`. Capability fail and unverified results, and pass results with a closure-gate failure, land in a capability-result commit before routing. Only a complete result resumes without execution; a partial write repeats from step 2, and a rerun that cleanly passes proceeds to closing begin. An event's pending, result, and decision state lands in a verification-state commit before role briefing, a user question, or the first route. Failure and finding routing records the base commit, final result, and application order of write, move, and delete in a validated `routing prepared` object before output. The current checkout, including draft cards, must be an exact prefix of that order; after interruption only the remaining suffix is applied before landing it with the compact result in one commit. Product verification and event requests made during work never preempt the current claim. When Audit scope cannot resolve exactly, the event completes with the reason instead of waiting forever. Audit requests and automatic Audits at a dirty boundary remain unselected and do not block product-result reporting; they can run after scope or boundary repair. Multiple adopted findings retain per-finding `routing: pending` state and land one finding at a time in a planning or binding-decision commit. The product Audit and Retrospective key is revision-independent `product`, so each runs once; only timestamp-keyed user requests repeat. Re-verification preserves Failure history and both event sections. split places product-layer fixes in foundation or a capability according to scope |
| Shared routing state in multi comes from the integration tip, not the local branch (v0.9.21) | Layer-opening, verification-state, and initial-claim commits land on integration, but another checkout with an existing claim could miss that transition when it read only local HEAD. An initial claim is also a binding decision that prevents duplicate work under the same number; implementation waits until both integration tip and the current branch contain it. Next-stage routing and integrity checks now read project, tree, journal, and verify at the integration tip and include an unfinished transition commit that is not yet an ancestor before local claimed work. Unrelated changes are checkpointed first. Before writing status renames, HANDOFF, journal, or feedback documents, a task boundary integrates the final task commit or checkpoint it records with arch.md's merge method; after rebase it records a changed checkpoint hash in journal. A `card:` source checkpoint for promotion or an out-of-scope prerequisite likewise reaches integration before the layer-opening marker. This is not a policy for devflow to create or assign worktrees; it is compatibility so user-created branches or worktrees see one shared state. Digest diff reading and marker advancement remain clean-boundary-only |
| Codex hooks ride along with the plugin — `.codex-plugin/plugin.json` declares `hooks`, and installing is two remote lines (v0.9.20) | Probed live (2026-08-11), refuting v0.9.9's recorded ground ("plugin-delivered hooks are a removed feature in Codex"): the Codex binary carries the strings `hooks/hooks.json` and `CLAUDE_PLUGIN_ROOT`, and a plugin in real use (claude-mem) delivers hooks by declaring them in `.codex-plugin/plugin.json`. Giving devflow the same manifest made SessionStart actually fire with the manual registration moved aside. The Claude manifest needs no such declaration — Claude auto-discovers `hooks/hooks.json` (the duplicate was removed). Confirmed alongside it: `codex plugin marketplace add` takes `owner/repo` directly, so no clone is needed. That makes the README's Codex install the same two lines as Claude's. The installers stay — they are the path for local development installs (the canonical route in this repository's own records) and for the slash-prompt channel |
| The knowledge-reachability set — standing of outside records · conversation decisions land immediately · a user-confirmation gate on product's four core sections · a disproof row (replace the statement, or re-run product) · a means row · a pre-HANDOFF landing check · a survival path for research answers that are tools · verify's disproof arbitration (v0.9.18) | Grounds: cross-corroborated field evidence — the rdsf structural diagnosis (2026-08-11: knowledge vanishing at handoff, disproved auto-injected memory surviving every session, a replan document self-created outside the model and reachable only through a hand-written HANDOFF pointer), owner testimony (a stuck-to-breakthrough conversation omitted from HANDOFF), and matching traces in ade (a self-grown reference layer claiming decision ownership until a wrong statement entered ADR-002; HANDOFF format overflow). Two causes: being on disk is not enough — a fact off every skill's read path does not exist for the next session; and the only landing gate (upper-document feedback) fires at card boundaries, so conversation decisions evaporate. product's heaviest sections were also the only ones modifiable with no user gate (steps 1–4 and the table rows carry no confirmation step — proven from the text). Verification: three independent lenses (refuter · literal-execution over 8 scenarios · whole-system coordinate sweep) → repair → re-verification (all three prior majors confirmed fixed) → local wording repairs. Zero new terms |

| An open Git rebase or merge in a Git work tree returns to the user before every devflow route (v0.9.21) | If a session ends after an integration command, Git's open operation and conflict index are already durable state. Treating them as claimed work can append the wrong devflow state, while an automatic abort can discard resolutions the user made. No path or commit changes before the user decides; continuing allows only confirmed conflict resolution and commits of the existing Git operation, followed by a fresh integrity check. A non-Git project has no such state, so the gate neither applies nor initializes Git |
| Commit locators use Git's full object ID, while path and card order have canonical byte and numeric rules (v0.9.21) | A 40-character requirement rejects SHA-256 repositories. Operating-system or model default collation can choose different first items for Unicode paths and `02.2`, `02.10`, or `02.2b`. Define once: Git's unabbreviated object ID, UTF-8 byte order for repository-relative `/` paths, and numeric-plus-suffix order for dot-separated card numbers |
| Capability pass gates are explicit state between verdict and closure, and closure does not change verification revision inputs (v0.9.21) | If a session ends just after the verifier passes, closing from the success verdict alone skips the standards and Provisional gates. Conversely, changing a core document during closure immediately stales the revisions just computed. A current pass therefore requires current results from both gates, and closure performs only the ordered `verify.md` record → `journal.md` record → capability-folder `.done` rename. A journal decision that belongs in a core document routes to its owning skill before verification; a late decision preserves the marker and repeats revision judgment from the start |

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

Rejected in the v0.9.18 knowledge-reachability verification (2026-08-11):

- **An observation-cache registration field (an observation_cache line in arch's output
  format)** — rejected by convergence of all three independent lenses: a field no skill's
  rule ever reads cannot change literal execution; its only meaning (a cache of facts —
  decisions stay devflow's) duplicates the outside-records standing declaration; and it
  opens a drift path that splits where observed facts live. The shape of an external
  observation cache stays project-owned — two field projects inventing two different
  shapes is the evidence for not prescribing one.
- **Promoting "re-baseline" to a canon noun** — 0.9.10 recorded deliberately dropping
  this term for colliding with resume's digest re-baseline, and that reason still holds.
  The table carries the descriptive form ("re-run product") instead.
- **Changing the HANDOFF format (allowing a skill name in Next single step)** — the
  existing Open decisions section plus the disproof row's journal waiting line already
  close the same path. The format stands.
- **Obsidian-style free linking** — falls to the no-unbounded-reading lineage and would
  be a second structure competing with the tree (one concept, two homes). devflow's
  relation model stays the typed edges (Depends · Coordinates · Read first · settling
  card) plus the content-carrying discipline.

Other:

- **Any "skim the related records" rule for maintenance reopening** — "related" is a
  judgment word; a literal-minded AI risks a read explosion, reading an entire fattened
  folder. **No unbounded reading rules, ever.** (For the bounded, confirmed wording, see
  the observation items below.)

## Field observation items — watch during coming cycles, without adding rules

- **Reaching prior records when maintenance reopens a capability** (verified 2026-08-08 ·
  wording improved 2026-08-11): maintenance cards formally have no dependency, so work's
  direct-dependency read may not fire. The promotion machinery (upper-document feedback · journal
  sweep) has already lifted binding knowledge into shared documents, so the gap is
  cost-type (rework from re-discovering traps), not catastrophic. rdsf field use
  (2026-08-11) produced suggestive evidence, but the environment carried reference-layer
  conflicts, so it is not accepted as the observed friction — if friction is observed,
  insert the confirmed wording (the 0.9.18 re-audit extracted and repaired the prepared
  wording's unguarded imperative and its undefined name "carry rule"): "A maintenance
  card names, in `Depends`, the cards that built or fixed what it modifies, when they
  exist in the tree (findable by name in the tree listing — all of them if several).
  work reads those named direct dependency cards in full." (guard · plural · named
  consumer, 0 new concepts,
  bounded reading)
- In the maintenance phase, when cards keep appending in a capability folder (02.7…02.40),
  does the intermediate grouping-folder rule actually get applied?
- Are ADRs actually used for large scope pivots (e.g. shrinking ade's MVP ①②)? — the
  device exists; it is a matter of usage judgment.
- ~~In complex multi-domain brownfields, does "trace one representative flow" cut the
  capability list too coarsely?~~ — implemented in v0.9.21: enumerate candidates from
  external entry points, top-level modules, and existing documents, then trace one
  representative flow per candidate.
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
- ~~Whether capabilities settle into "works but mediocre" form after closing —
  simplification-card experiment first~~ — the premise (the user notices mediocrity)
  was refuted by owner testimony (2026-08-10: detection does not happen on its own);
  implemented by the v0.9.16 retrospective: post-hoc evaluation of design
  alternatives is the retrospective's question. The audit still does not hunt
  quality, and simplification cards remain the landing path for adopted findings.
- ~~The hole-hunt sample width at the capability layer~~ — implemented by the v0.9.15
  audit: hunting holes outside the sample belongs to the event-triggered audit
  (verify's own sample width is unchanged — one scenario + one boundary input).
- ~~Product-layer (MVP) spec blind spots~~ — implemented by the v0.9.15 audit: one
  audit rides product-layer verification (the independent-perspective axis).
- ~~Mid-point retrospectives~~ — implemented by v0.9.17: the owner specified the
  rhythm directly without waiting for observed friction (at every capability's first
  closure, scoped to it).
- The retrospective never firing on long-unclosed capabilities — when a capability stays
  open for a long stretch (extended research or maintenance), none of the retrospective's
  three events fires. Watch whether the user-request trigger actually gets used; if
  friction is observed, consider defining a mid-point event.
- The research card's identity-injection exemption — hypothesis (rdsf): in projects where
  research cards are the bulk of the work, the unanchored stretch grows long. If drift is
  observed again, re-evaluate the exemption's recorded ground ("a frozen log has no use
  for the injection").
- The scope of HANDOFF's carry-forward duty — currently only Open decisions carry over.
  The landing check (0.9.18) moves durable knowledge into canon, so the remaining gap is
  small — review if loss of Traps or Just-learned content is observed again.
- ~~resume's missing re-run branch~~ — implemented in v0.9.21: resume judges a waiting
  product re-run in journal before work, then branches to product, split, work, or verify
  from disk state.

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
- **A disk representation for Layer 0 draft confirmation state** — files alone cannot
  distinguish an unconfirmed draft from a confirmed document with identical content.
  The choices are (A) write to the canonical path only after confirmation, or (B) put a
  confirmation marker in each document and define migration for older markerless files.
  Their recovery and migration costs differ, so neither is forced before the owner chooses.
- **When design creates its real artifacts in a blank frontend repository** — the current
  token file and preview can be required before a foundation card provides an execution
  base. The choices are (A) make design produce the plan only and put real artifacts in a
  foundation card, or (B) return to design after foundation work. This changes the Layer 0
  and task-tree boundary, so the current order is not forcibly rearranged before the owner chooses.
