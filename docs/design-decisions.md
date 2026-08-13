# devflow decisions and rejection lineage

This file is the body that `design.md`'s decision index points at. Each subject holds its decisions in full alongside the proposals rejected under it — overturning a decision and re-proposing a rejected idea pass through the same gate.

**To overturn a decision, refute its recorded reason first. To re-propose a rejected idea, refute its recorded rejection reason first.**

## Identity, packaging, platforms

### DD-01 · Output folder named `devflow/` (not docs/)

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Avoid collision with existing projects' docs/

### DD-02 · Name is devflow — Claude uses the `devflow:` namespace, Codex uses the `devflow-` filename prefix

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Blocks skill-name collisions at the source + groups autocompletion. The original name was nano-devflow; shortened in v0.9.0 because commands were needlessly long in real use — the namespace/prefix structure is unchanged, so the collision-blocking reason still holds

### DD-03 · Canonical rules live inside skills/principles/

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Under the skills.sh standard (installers that copy only skills/), the canon travels along

### DD-04 · Codex prompts embed the canon (no file reference)

Subject: Identity, packaging, platforms | Introduced: origin | State: replaced by DD-57 (v0.13.0)

The Codex prompt folder is flat; relative references are unreliable (corrected 2026-08-13: that reason was true only of `~/.codex/prompts/` and does not reach the plugin cache — DD-57 refuted it by live probe and removed the generation channel itself)

### DD-05 · One hook only: SessionStart

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Stop fires every turn — noise; PreCompact is unnecessary given the "progress log is always on disk" covenant. SessionStart also fires right after compaction, so it covers all three

### DD-12 · Cross-references between skills use slash-less stage names

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Actual commands differ per tool (`/devflow:x` vs `/devflow-x`)

### DD-13 · install.ps1 requires UTF-8 **BOM**

Subject: Identity, packaging, platforms | Introduced: origin | State: active

PowerShell 5.1 parses BOM-less files as ANSI → Korean script corruption (actually reproduced)

### DD-16 · Design in Korean, deploy in English (dual language)

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Korean is the language the user can review; English is what AI understands best at the lowest token cost. Procedure and terminology table: AGENTS.md

### DD-18 · The Codex install leads with the native plugin channel (marketplace add + plugin add); generated slash prompts stay as the explicit channel; the hook stays separately registered in ~/.codex/hooks.json (v0.9.9)

Subject: Identity, packaging, platforms | Introduced: v0.9.9 | State: active, partly corrected by DD-57 (v0.13.0)

Probed live: Codex consumes Claude-format marketplaces directly and model-invokes SKILL.md skills — a clean Codex session recognized all 8 devflow skills. Plugin-delivered hooks are a removed feature in Codex, so hook registration stays separate. The old prompts-only channel predates these capabilities and made auto-invocation Claude-only — the last platform asymmetry. Recurrence is guarded by the pre-flight item "install channels target each platform's current native mechanism" (corrected 2026-08-13: the "generated slash prompts stay" clause was superseded by DD-57 (v0.13.0), which removed that channel, and the "hook registered separately" clause by DD-32 (v0.9.20), which rides hooks with the plugin. What survives is the native plugin as the one channel)

### DD-29 · Platform adapters only connect to the shared skill; they do not duplicate its procedure (v0.9.21)

Subject: Identity, packaging, platforms | Introduced: v0.9.21 | State: active

Claude and Codex share the same semantic rules in SKILL.md and the role contracts. The Codex fallback AGENTS copied only part of resume, omitting journal, freshness, and integrity checks; the hook separately decided the next Layer 0 stage; and the local installer registered both the plugin hook and the old global hook. The fallback and hook now only route to shared resume. The hook injects no file content, HANDOFF, or next-stage classification. The installer removes the exact old registration only after the native plugin succeeds, preserving a working predecessor when replacement fails. A malformed `owner.md` keeps multi mode active, but a valid resolved room stays writable; only a session whose identity remains unresolved fails read-only. These are transport repairs to one contract, not platform-specific policies

### DD-32 · Codex hooks ride along with the plugin — `.codex-plugin/plugin.json` declares `hooks`, and installing is two remote lines (v0.9.20)

Subject: Identity, packaging, platforms | Introduced: v0.9.20 | State: active

Probed live (2026-08-11), refuting v0.9.9's recorded ground ("plugin-delivered hooks are a removed feature in Codex"): the Codex binary carries the strings `hooks/hooks.json` and `CLAUDE_PLUGIN_ROOT`, and a plugin in real use (claude-mem) delivers hooks by declaring them in `.codex-plugin/plugin.json`. Giving devflow the same manifest made SessionStart actually fire with the manual registration moved aside. The Claude manifest needs no such declaration — Claude auto-discovers `hooks/hooks.json` (the duplicate was removed). Confirmed alongside it: `codex plugin marketplace add` takes `owner/repo` directly, so no clone is needed. That makes the README's Codex install the same two lines as Claude's. The installers stay — they are the path for local development installs (the canonical route in this repository's own records) and for the slash-prompt channel

### DD-57 · The flat Codex prompt channel is removed; the plugin cache carries the companions (v0.13.0)

Subject: Identity, packaging, platforms | Introduced: v0.13.0 | State: active

Probed live (2026-08-13): Codex installs a plugin into `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`, the whole repository, and the model reads its skill from that absolute path - so `../principles/SKILL.md` resolves there exactly as it does in Claude. The recorded reason for embedding ("the Codex prompt folder is flat, relative references are unreliable") was true of `~/.codex/prompts/` and does not reach the plugin. The eight prompts held 50-120 KB each, embedding the whole rulebook, and two installers each carried their own embedding logic, so every rule change had to be applied twice. Removing generation alone would leave earlier files callable, so cleanup deletes the exact eight names for one release, keyed to the generated marker, and a file a user wrote under one of those names survives

### Rejected under this subject

- **[DR-03 · v0.7.0]** **Journal injection by the hook** — duplicates what resume reads.
- **[DR-44 · v0.13.0]** **Splitting the canonical rules per consumer** — deferred, not rejected. Its failure mode
  is bad: a rule work needs, filed under a verify-only heading, disappears with no error.
  Mixing it into a release that also repairs ten defects would make it impossible to tell
  which change broke what.

## Verification and roles

### DD-08 · TDD procedure not adopted

Subject: Verification and roles | Introduced: origin | State: active

Completion signal + "not executed = unverified" + commit discipline capture TDD's effect without the ceremony

### DD-17 · The terms of the review and verification roles live in the skill text — agents/*.md is Claude packaging (v0.9.5)

Subject: Verification and roles | Introduced: v0.9.5 | State: active

Same reason principles lives inside skills/: on installs that copy only skills/, the terms must travel along or platforms diverge. Found via an owner report (2026-08-09) — never-execute/never-fix, the taste exclusion, speculative marking, and fail-with-reproduction-steps shipped only in the Claude-only agent files. The agent files are a restatement of the same terms; drift between the two is a defect. Superseded in v0.9.6: the terms moved into one contract file beside each skill and Claude registration was dropped — see the v0.9.6 row

### DD-19 · Role contracts are one companion file beside each skill (reviewer.md · verifier.md); every platform runs them by briefing a clean context with the file verbatim — no Claude agent registration (v0.9.6)

Subject: Verification and roles | Introduced: v0.9.6 | State: active

An A/B/C test (2× registered agent · 2× prompt-briefed Claude subagent · 1× Codex CLI, one fixture with 4 planted defects) found all five runs identical — 4/4 detection and full contract adherence — so registration's assumed robustness edge was not observed. One mechanism dissolves the platform fork entirely. The mature precedent is superpowers (7+ harnesses, no registry, contract prompt files beside skills). Delivery must be static — verbatim file briefing (Claude · skills.sh) or install-time embedding (Codex); the only transport that failed in testing was shell interpolation

### DD-21 · The audit — event-triggered deep inspection; findings are not verdicts (v0.9.15, scope amended v0.9.21)

Subject: Verification and roles | Introduced: v0.9.15 | State: active

Grounds: owner field reports (2026-08-10, running ade): one-pass results leave holes, and mistakes pass verification unrecognized as mistakes. Implements two observation items (capability-layer sample width · MVP spec blind spots). Not an always-on step — exactly three events fire it (product layer once · closure of a capability whose verify.md records a fail · user request): the runtime application of "the harness grows only on defects actually met," so a cleanly closed capability costs zero. Convergence devices: non-blocking findings · zero-findings-valid · only user-adopted findings become cards · re-closure never re-runs it (a new leak is a new event). The v0.9.15 scope of "executed paths + the capability folder" assumed that task history represented current topology; that fails for brownfield and flat layouts, exposes card history, and misses current surfaces not yet executed. v0.9.21 therefore excludes past commits, diffs, and cards and bounds the audit to paths mapped exactly by arch or the current capability code scope from external entrypoints to shared-contract boundaries. Adopted only after dual independent validation (refutation walk · whole-system audit) extracted and repaired/cut the draft's trigger-anchor misreadings (dies-by-overwrite / fires-forever), unbounded reading, and the quality prey (unrefuted against the simplification-card experiment-first lineage)

### DD-22 · The retrospective — a fourth role that post-hoc evaluates design alternatives at the MVP boundary; findings are not verdicts (v0.9.16)

Subject: Verification and roles | Introduced: v0.9.16 | State: active

Grounds: owner testimony (2026-08-10): AI never doubts the plan it made itself, reviewer/verifier catch only clear problems, and nobody ever asks whether a better option existed — detection does not happen on its own, which refutes the premise (the user notices) of the "simplification-card experiment first" observation item. The judgment word ("better") is bounded by three requirements: a concretely named alternative + this project's strain evidence as mandatory (fix-card density, `.stale.`, ADR update comments, unresolved Provisional rows — only artifact-observable signals; the refutation pass extracted and cut the draft's escape-card and provisional-churn signals as unobservable) + a switching-cost estimate marked presumed. Input is devflow artifacts only, zero code — reading fully bounded. An auditor second mode was rejected (opposite blinding axes — one name, two concepts). Fires only after the product-layer verdict is recorded (once) and on user request; non-blocking, zero-findings-valid, adopted findings only become cards or a re-baseline (the event list gained capability first closure in v0.9.17 — see that row)

### DD-23 · The retrospective also runs when a capability first closes — scoped to that capability (v0.9.17)

Subject: Verification and roles | Introduced: v0.9.17 | State: active

Overturns v0.9.16's capability-level exclusion on owner direction (2026-08-10), refuting both recorded grounds: "strain evidence is thin" — narrowing the input to the capability thins the cost with it, zero-findings-valid makes it harmless, and early detection before dependent capabilities build on the design is cheaper than MVP-time detection. "It becomes a standing step" — the owner specified this rhythm directly: the planner is human, and a check-in at every large unit beats running solo; an operating direction is direction itself, not imagined risk. Card-level retrospectives remain excluded

### DD-24 · A signal pass goes stale when its inputs change + a fix card's completion signal is the verifier's reproduction steps (v0.9.4, product- and capability-layer extension v0.9.21)

Subject: Verification and roles | Introduced: v0.9.4 | State: active

Two gaps flagged by an external loop-engineering review (2026-08-09) and confirmed against the text: a post-review fix could ride a pre-fix pass into commit (a stale-evidence path), and a fix-card signal could be written unrelated to the observed failure. Backing research verified against sources (blind-retry recovery 0.0 on latent/semantic errors; verifier +14.8%p from real misjudgment cases). Regulates only evidence freshness and signal provenance, not execution order — no red-green reintroduction, the TDD rejection stands (the failing "before" evidence already lives in the verify record). v0.9.21 binds a product-layer verdict to Product revision for product.md, Verification revision for arch.md · code-style.md · glossary.md, and Code revision for the newest commit outside devflow. The capability layer's Capability revision includes only the exact HEAD paths of target `.done.` task cards and their directly depended-on cards. Verification and Capability revisions hash raw `git ls-tree -r -z` bytes instead of JSON whose sorting, Unicode, and path separators can vary. An uncommitted revision input, direct-dependency card, or path outside devflow forbids the verdict

### DD-30 · Verification failures, repairable unverified results, and Audit and Retrospective events survive verify.md overwrites and session interruption (v0.9.21)

Subject: Verification and roles | Introduced: v0.9.21 | State: active

Re-verification erased earlier `Failure history`, Audit, and Retrospective results, so first closure could not be distinguished from re-closure; ending a session after recording the verdict but before a once-only role ran also lost that event forever. Timestamp locators collide when several failures or events occur in one second, so each verify.md section assigns a never-reused positive `source id`, and an adopted finding is identified by event id plus finding number. Legacy timestamp records receive ids in file order without losing their original text. Each failure and repairable unverified result keeps its own route in `Failure history`. Capability fail and unverified results, and pass results with a closure-gate failure, land in a capability-result commit before routing. Only a complete result resumes without execution; a partial write repeats from step 2, and a rerun that cleanly passes proceeds to closing begin. An event's pending, result, and decision state lands in a verification-state commit before role briefing, a user question, or the first route. Failure and finding routing records the base commit, final result, and application order of write, move, and delete in a validated `routing prepared` object before output. The current checkout, including draft cards, must be an exact prefix of that order; after interruption only the remaining suffix is applied before landing it with the compact result in one commit. Product verification and event requests made during work never preempt the current claim. When Audit scope cannot resolve exactly, the event completes with the reason instead of waiting forever. Audit requests and automatic Audits at a dirty boundary remain unselected and do not block product-result reporting; they can run after scope or boundary repair. Multiple adopted findings retain per-finding `routing: pending` state and land one finding at a time in a planning or binding-decision commit. The product Audit and Retrospective key is revision-independent `product`, so each runs once; only timestamp-keyed user requests repeat. Re-verification preserves Failure history and both event sections. split places product-layer fixes in foundation or a capability according to scope

### DD-36 · Capability pass gates are explicit state between verdict and closure, and closure does not change verification revision inputs (v0.9.21)

Subject: Verification and roles | Introduced: v0.9.21 | State: active

If a session ends just after the verifier passes, closing from the success verdict alone skips the standards and Provisional gates. Conversely, changing a core document during closure immediately stales the revisions just computed. A current pass therefore requires current results from both gates, and closure performs only the ordered `verify.md` record → `journal.md` record → capability-folder `.done` rename. A journal decision that belongs in a core document routes to its owning skill before verification; a late decision preserves the marker and repeats revision judgment from the start

### DD-41 · A Record states its own entry count — New entries (v0.9.23)

Subject: Verification and roles | Introduced: v0.9.23 | State: active

Right after a verdict and before the commit, disk alone could not judge whether a dead session's partial Record was complete — the total of required entries lived only in that dead session's context. The self-describing field mechanizes the completeness judgment. A value that does not match is judged a partial write and recovers through the approved rerun path that repeats from step 2. A committed Record with no such field is complete as committed — tolerating an absent field is the same class as verification-predicates' pre-v0.9.21 record

### Rejected under this subject

- **[DR-04 · v0.7.0]** **Relocating the verify-channel document** — the arch pointer suffices.
- **[DR-08 · v0.9.4]** **Adopting graph engineering (typed evidence graphs · an orchestration agent)** — the
  tree, Depends, status suffixes, and revert already form a low-cost graph. A negative
  result was also confirmed: typed-graph retrieval scored 11.2%p below a strong hybrid
  ranker (p=0.0007).
- **[DR-09 · v0.9.4]** **A root-cause documentation stage** — the progress log is already where diagnosis
  lives. Demanding a separate artifact is method prescription.
- **[DR-10 · v0.9.4]** **Held-out / candidate-comparison promotion gates** — for probabilistic optimization
  of prompts and harnesses only. For devflow's own maintenance, the AGENTS.md
  refutation protocol already plays that role.
- **[DR-11 · v0.9.4]** **Harness self-evolution (rewriting its own prompts)** — collides head-on with the
  philosophy of steering without self-modification. Self-improvement stops at folding
  escaped defects into signals (adopted in v0.9.4).
- **[DR-13 · v0.9.6]** **Plan B (contract files + keeping Claude agent registration alongside)** — its
  premise, "registration = harness enforcement = more robust," was not observed in the
  A/B/C test; it would keep a per-platform mechanism fork for no measured benefit.
- **[DR-32 · v0.12.0]** **Narrowing verify's "uncommitted outside devflow" gate to the capability** — it produces a
  false pass while somebody is mid-edit in shared code. That trades a safety device for
  convenience. Under concurrent work, editing runs in parallel while verification and builds
  serialize — not a new constraint, just an existing safety device becoming visible.

## The task tree and its cards

### DD-06 · No model names in files (tiers T-high/T-mid/T-low only)

Subject: The task tree and its cards | Introduced: origin | State: active

Model names always go stale. Mapping is decided per session in split's execution proposal

### DD-09 · 1 task = 1 commit (only after verification passes)

Subject: The task tree and its cards | Introduced: origin | State: active

Rollback = one revert; git log = task history; task boundary = handoff point

### DD-11 · Integrity check reports only, never auto-corrects

Subject: The task tree and its cards | Introduced: origin | State: active

If auto-correction misjudges, it accelerates contamination

### DD-25 · Ready-card semantics, per-card execution-proposal approval, and resume routing are decided from disk state (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active

Two independent literal executions cross-confirmed deterministic session-boundary failures: a card with completed `Depends` remained forever unclaimable under the words "dependency-free"; ending a session after adopt but before split produced an adopt↔resume loop; resume called only work even at split and verify boundaries; and ordinary execution-proposal approval left no disk trace, so the next session could not distinguish before from after approval. Ready means `Depends` is `none`, or exactly one `.done.` card exists for every comma-delimited number. New cards use one dependency format. Only a card missing `Approval` or `Review` is legacy; its leading numbers are parsed mechanically and normalized when next planned, while the user decides an unparseable member. `state-predicates` owns task-card judgments once; `verification-predicates` owns revision and event judgments once. The former enters Claude and Codex input for split, work, verify, and resume; the latter only for verify and resume. Approval, parallel group, and review policy live in each card and land in a planning commit; the claim suffix alone owns assignment. Approval is effective only when the same authority path exists and both index and working tree equal solo HEAD or the fetched multi integration branch under Git-normalized comparison. An out-of-scope prerequisite changes the new card, the original card's `Depends`, approval, and release in one planning commit. The resume table covers partial trees, retired capabilities, blocked dependencies, and a completed product. The arithmetic conflict that forbade a two-card split was removed too

### DD-27 · `.stale.` task cards remain as history, and a `re-split pending` marker recovers interruption before replacement planning (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active

Retrospective reads `.stale.` cards as strain evidence, but closure required every child to be `.done` and product completion prohibited `.stale.` itself, so one normal upper-decision change made permanent incompletion. `.stale.` task cards are kept and excluded from active-child counts, while closure still requires at least one active direct child. An upper decision first leaves one exact `re-split pending` marker per direct parent folder; split deletes it only when the user-approved replacement-card plan lands. work decides whether the current card is invalid before its final task commit, entering this path through a wip checkpoint instead of a completion commit. The marker therefore resumes re-splitting after interruption, while preserved `.stale.` history no longer blocks completion after planning

### DD-38 · `Approval` is effective only with Git-diff freshness, not the card value alone (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active

Failure path: a card changes after approval, the stale approval survives, and a Destination, Forbidden, or completion signal the user never saw gets claimed. Approval is therefore effective only when the same path exists in the authority (solo HEAD or the fetched multi integration branch) and both index and working tree equal that authority under Git-normalized comparison

### DD-50 · A change request is recorded immediately and planned later; a completion signal is scoped to its capability (v0.12.0)

Subject: The task tree and its cards | Introduced: v0.12.0 | State: active

Two halves of the same problem: what happens to work already in flight. Placing the maintenance row below the claim meant the request was never recorded once claims became normal in several units; placing the whole routing above it meant a passing remark interrupted the card. Splitting the row settles both — recording outranks the claim, planning yields to it. The build is the other half. Switching capabilities was supposed to need no procedure, but a half-finished edit in one unit fails the next unit's completion signal, and the failure ladder then treats a sound card as defective and calls the human after three strikes. Two devices close it: the switch checkpoints what is already changed, and split scopes each signal to the paths its capability owns. The second is what makes two terminals in one working tree survivable at all; the plan had left it as a recommendation

### DD-54 · One request that spans several capabilities keeps one source and one marker per parent (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active

Mapping was written in the singular ("go to the matching capability folder"), with no definition for a request that determines three locations. A literal reader picks one and the rest vanish silently, journal line included, so nothing can recover them - the loss the owner guards against most. A client's fix list handled in one session is ordinary practice. Sharing one exact source locator across the parents' markers gives the bundle an identity with no new batch id, so resume recovers them together; one execution proposal and one approval keep a twenty-item list from needing several; and an ambiguous or retired unit asks before the begin commit instead of planning half and losing the rest

### DD-55 · Items that do not change the precondition-to-outcome transition ride one card (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active, partly corrected by DD-61 (v0.14.0)

devflow had promotion for work that turns out too big and no exit for work that is too small, so a button colour paid record - map - card - proposal - approval - claim - fixed reads - implement - signal - review - commit - boundary. That reproduced exactly the heaviness the owner set out to escape. The test needed no new invention: the baseline predicates already exclude a button name, wording, or layout change when the precondition and outcome stay the same, so the same line now separates work too. Bundling is not omission - "too small to record" is never created, because one unrecorded path becomes the default path and turns into the steady loss of what should have been an asset. **Corrected in v0.14.0**: half of that guard stepped back under refutation — a tweak, whose commit is its record, finishes with one commit and no document record. Bundling remains for small items that fail the gate (see the tweak row)

### DD-58 · A finished card's number is never renumbered (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active

The draft had a duplicate number move a completed card to the mid-insertion form and update dependents. But a completed number also lives in commit subjects, external CI, issues, and people's links, which fixing files and dependencies never reaches; if two completed cards are already known outside under one number, which reference means which card is generally unrecoverable. And since numbers are minted only on integration, a duplicate can now only arise while a card is pending and unclaimed, where renumbering is cheap. Beyond that stage it is reported as an integrity anomaly instead

### DD-61 · A tweak's commit is its record (v0.14.0)

Subject: The task tree and its cards | Introduced: v0.14.0 | State: active, partly corrected by DD-66 (v0.14.2)

The recorded reason in the v0.13.0 row's "'too small to record' is never created" — one unrecorded path becomes the default path — is refuted thus: a commit IS a record. This lane does not skip recording; it changes the recording layer, and the owner corrected the direction personally (a button label or a border colour is fully recorded by its diff and almost never revisited). Only when all three gate questions are "no" and none is uncertain — does it change a precondition-to-outcome transition the user sees; does it produce a design decision or conflict with one (design tokens, ADRs); does it leave a trap the next worker must know — the change runs without a card, journal line, or review: read the existing Layer 0 documents, edit, run the cheapest check that touches the changed files once, and land one `tweak` commit. No `devflow/` path is touched. Knowledge-bearing changes are routed to the document layer by the gate, and the discovery→update table applies regardless of change size. A fresh session holding only a tweak request skips state restoration — the lane consumes no prior record and changes no shared state, so bypassing the nets breaks nothing, and it is the first landing of the owner's requirement that inferring from code alone is sometimes exactly right. When the verdict flips mid-change, stop and switch to the ordinary path. The one remaining risk is misclassification — a field observation item (corrected 2026-08-13: "bypassing the nets breaks nothing" was partly refuted by reproduction in the v0.14.0 audit — a tweak commit still advances HEAD, which turns a `routing prepared` recovery pinned to a base commit id into an integrity anomaly, and a stale checkout's documents produce a "no" that conflicts with the latest decision on integration. DD-66's landing checks close this; skipping state restoration itself stands. The judgment inputs gained the existing glossary.md when an item could touch a name or term — term decisions live only there, and nearby code shows a spelling without showing it is a decision)

### DD-65 · A mixed request records only its gate-failing items (v0.14.2)

Subject: The task tree and its cards | Introduced: v0.14.2 | State: active

This resolves the four conditions the v0.14.0 audit (finding 4.1) proved unsatisfiable together — per-item classification · a tweak makes neither card nor journal line · the original request line is deleted whole by the planning commit · per-item completion is recoverable from disk after death at any point. A passing item mixed into the recorded line would be consumed with neither a card nor a record and vanish without trace on interruption (a tier-1 loss path). Following the owner's principle that a tweak makes no record at all, the fourth condition's demand is withdrawn for passing items: the recorded line holds only the items that failed the gate, and the tweak lane handles passing items in the conversation that carries them (the recording commit first, the tweak commits after) — a tweak item now gets one identical treatment whatever request shape it arrives in. A window remains where death right after recording and before the tweak commits loses the passing items with the conversation — the same grade as a pure tweak request's interruption, which DD-61 already accepted. Riding passing items on cards (full durability) was rejected by the owner as a head-on contradiction of that principle, and a durable item list (a new canonical format with item ids, kinds, and completion commits) is on hold as a new state machine needing consumers, merges, interruption recovery, and migration together. split's send-back-to-the-lane sentence is deleted — a recorded line holds no passing item, so it has no reason to exist

### Rejected under this subject

- **[DR-02 · v0.7.0]** **Card-promotion trigger inside work** — a door to silent scope expansion. (What was
  rejected is a standing trigger inside the work loop. The authorized path remains: the
  canonical rules' discovery→update table catches "merely bigger than expected" and routes
  it to split's promotion procedure.)
- **[DR-12 · v0.9.12]** **Unifying contradiction resolution onto the table** — a rewrite sending
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
- **[DR-29 · v0.12.0]** **A session- or date-scoped work bundle file** — all of them need a closing point, and a
  closing point always leaks when a session dies silently. The card already plays that role
  as one completion signal, one commit.
- **[DR-39 · v0.13.0]** **A `legacy signal migration` marker state machine** — 25 to 40 canon lines for a residual
  risk already bounded by work's existing rule that an uncommitted change in another unit's
  claim is checkpointed first.

## Concurrency, claims, integration

### DD-07 · devflow does not create or manage a Git-worktree workflow

Subject: Concurrency, claims, integration | Introduced: origin | State: active

For parallelism: core edits are common, so coordination/merge cost > parallel gain. For showcase: the user confirmed "screen may break during work" → benefit gone. This does not mean ignoring repositories where the user already has several checkouts or worktrees. Recovery distinguishes the current checkout from shared state on the integration branch

### DD-14 · The multi-mode split axis is the **scope of truth**, not people

Subject: Concurrency, claims, integration | Introduced: origin | State: active

Documents with a single truth (project·tree·journal) are shared; only person-owned state (HANDOFF·marker·identity) is isolated into rooms (users/<id>/). Adopted after refutation-fork verification of 4 candidates (5 rounds total, real defects extracted each round) — rejection lineage below

### DD-15 · HANDOFF is committed to git but never in a dedicated commit — it rides the boundary commit only

Subject: Concurrency, claims, integration | Introduced: origin | State: active

A dedicated HANDOFF commit polluted history and was reverted in practice (2026-08-06)

### DD-31 · Shared routing state in multi comes from the integration tip, not the local branch (v0.9.21)

Subject: Concurrency, claims, integration | Introduced: v0.9.21 | State: active

Layer-opening, verification-state, and initial-claim commits land on integration, but another checkout with an existing claim could miss that transition when it read only local HEAD. An initial claim is also a binding decision that prevents duplicate work under the same number; implementation waits until both integration tip and the current branch contain it. Next-stage routing and integrity checks now read project, tree, journal, and verify at the integration tip and include an unfinished transition commit that is not yet an ancestor before local claimed work. Unrelated changes are checkpointed first. Before writing status renames, HANDOFF, journal, or feedback documents, a task boundary integrates the final task commit or checkpoint it records with arch.md's merge method; after rebase it records a changed checkpoint hash in journal. A `card:` source checkpoint for promotion or an out-of-scope prerequisite likewise reaches integration before the layer-opening marker. This is not a policy for devflow to create or assign worktrees; it is compatibility so user-created branches or worktrees see one shared state. Digest diff reading and marker advancement remain clean-boundary-only

### DD-40 · An approved parallel group is claimed together in one step (v0.9.23)

Subject: Concurrency, claims, integration | Introduced: v0.9.23 | State: replaced by DD-60 (v0.14.0)

The cards' own reciprocal parallel Approval (v0.9.21), the branch that permits two claims, and integrity item 1 all existed, but no entry procedure created that state, so the `parallel` field was a dead state nothing could reach (inherited from 0.9.20). One entry rule closes it — solo claims the group together; multi distributes it through ordinary single claims. The single-claim-first principle stands unchanged outside a group. **Corrected in v0.14.0**: free parallel claims replaced this row — the one-step group claim and the reciprocity predicate lost their reason to exist and were removed; claims are taken one at a time with no condition. The `parallel:` field survives as the plan's recorded judgment and an informational source (see the free-parallel row)

### DD-46 · One mode — rooms are always on, and working alone folds the integration branch into the branch you are already on (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active

The solo/multi fork never modeled **work that flows concurrently**. It assumed one person means one flow, so two terminals were an integrity anomaly. The fork cost 59 lines across 8 files, and a solo session read all of them only to be told to ignore them — same reading cost, one extra decision. Unified, the whole cost to a lone user is **one commit per card** (the claim), and that commit is exactly what makes worktrees and concurrent terminals work. When `integration` names the current branch the integration tip is HEAD and every fetch, push, and integrate order collapses into an ordinary commit; a purely local integration branch needs no network command either. This overturns v0.9.23's "solo claims the group together, multi distributes it": that split's recorded ground was "one entry rule closes it", and with no modes the same approval simply permits both consumptions — the split was an artifact of the fork. v0.9.21's approval-freshness ground stands unchanged; only its authority expression collapsed to the integration tip. Outside a Git work tree the reduction is stated explicitly rather than left undefined

### DD-47 · Claims move to the depth-1 unit axis, and one canonical candidate order settles every selection (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active, partly corrected by DD-60 (v0.14.0)

The tree and the capability documents were already a domain axis, but claims stayed tied to the person axis. Keying `.wip.` to (id × depth-1 unit) expresses concurrency with zero new identifiers, and integrity item 1's two exceptions — reciprocal parallel approval and evidence-wait — were always exceptions inside one capability, so the scope now fits them exactly. Above that, several places asked "which one next" and answered differently; the canonical candidate order defines it once as the card the user named, then the session unit, then the carried unit, then the rest. It never changes which routing row matches and never makes an unready card ready. The recognition machine that lived only in domain entry was promoted to canon, and resume and the baseline predicates now cite it. A conversation change request routes above the claimed-card row, not below it as the plan proposed — the persisted `maintenance routing pending` form already outranks a claim, and once claims are normal in several units at once, placing the conversation form below would record it almost never. One person's two terminals share one id, so disk cannot tell them apart — that limit is stated in the README rather than hidden, and the approval on resume's report is the device that actually separates them. **Corrected in v0.14.0**: the unit half of the claim key stepped back — "one claim per id per unit" turned out to rest on a one-terminal-per-person assumption and was replaced by free parallelism, and item 1's two-exception wording went with it (item 1 is redefined as orphan-claim detection). Canonical candidate order and the request-row placement stand unchanged

### DD-49 · Git is a requirement, and worktrees are the flow registry (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active, partly corrected by DD-51 (v0.13.0)

Two soft edges hardened after measurement. The no-Git degradation had to define what Approval, the integration tip, claims, prefixes, and the digest marker mean when none of them can run — six canon lines describing a devflow that is not devflow. Requiring Git costs one sentence and deletes all six; a repository without Git has no recovery, no claim, and no undo, which is not a weaker devflow but a different object under the same name. On worktrees, the recorded fear of needing a remote was measured and refuted: worktrees of one repository share one object store, so `git push . HEAD:<branch>` lands locally with no remote at all, a commit in one folder is visible from another with no fetch, and the only real constraint is that Git refuses to write to a branch another worktree has checked out. `git worktree list --porcelain` therefore enumerates the folders a repository has open, and `git worktree prune` cleans one that is gone. **Corrected in v0.13.0**: this row originally called that listing the durable per-flow identity the rejected `flows/` folder (X2) wanted, and derived shared tree state as the integration tip unioned with each worktree HEAD. A folder list is not a flow's identity — a folder can hold no flow, or a flow that died — and the union is overturned by the row below. devflow still creates and manages no worktree — it reads the one Git already keeps

### DD-51 · Shared truth is one integration branch; another worktree's HEAD is evidence, not authority (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active

v0.12.0 read shared tree state as the union of the integration tip and every worktree HEAD, and that rule breaks in both directions. A worktree that lags revives a card someone already finished, back into a claim. Excluding the laggard instead erases a live sibling's claim and hides work that is finished but not yet integrated, so the same card gets implemented twice. Both failures come from judging card state by branch-level freshness. The initial claim is already a binding decision that lands on integration, so reading integration alone shows every claim; reading another HEAD adds nothing and imports stale state. Its code and progress log are still that flow's evidence and arrive when it integrates - they are simply not used to judge shared state

### DD-52 · A shared transition is published against a remembered integration id (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active, partly corrected by DD-62 (v0.14.0)

Even with integration checked out nowhere, two flows pushing at the same point make one of them lose, and that is concurrency control working rather than a failure. Without separating them, ordinary contention is misread as "integration unusable" and sends the session down the blocked path, scattering claims for no reason. The first measurement suggested the id itself could discriminate — an ordinary race leaves it changed, a worktree holding the branch refuses with it unchanged. The live concurrency run refuted that: a flow that reads integration *after* a sibling has already published remembers an id that then does not change, yet its rejection is an ordinary non-fast-forward. The mechanical test is therefore whether the integration tip is an ancestor of the branch being published — not an ancestor means ordinary contention, an ancestor with a refusal means a structural blocker — and both live cases classify correctly under it. Error text is never the discriminator, because it varies by locale and Git version. Three retries bound it, and sustained contention is reported rather than fed into the failure ladder. When integration truly cannot be written, only code edits and progress-log checkpoints of an already-claimed card continue: with no coordination point, no global answer exists for who minted what, while code and a progress log merge safely (measured on separate cards and on a done-rename against a log append). This is also what lets an orchestrator hold integration - it must then create the cards and claims there before starting a worker. **Corrected in v0.14.0**: the blockade continue list widened — the final task commit, and journal appends that mint nothing and claim nothing (four exactly enumerated kinds), continue too. The "only code and logs" freeze proved to be that round's one silent-loss path (a request spoken during a blockade evaporating); see the blockade-appends row

### DD-53 · Several sessions in one working folder are normal, and their safety is five measured lines rather than a lock (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active

The owner's daily practice is several terminals over different sections of one capability, so forbidding it removes the point of the tool. Measurement found only three collision points and all three close without a lock: a commit that names its own paths carries one file even while another session has staged others; four sessions appending to journal at once lose no line; and HANDOFF stops being contended once open decisions live in journal, because what remains is recomputed from the tree. On shared source files one folder is actually safer than two - a partial edit lands on top of what the other already wrote, while splitting into worktrees defers the same conflict to a human merge. Only a whole-file rewrite overwrites quietly, so one line forbids it. Nothing here blocks; every line is a way of not breaking

### DD-60 · Claims are freely parallel, and a checkpoint carries only the changes this session made (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

The recorded ground for "one claim per id per depth-1 unit" (containing half-done sprawl, keeping claim state simple) rested on a one-terminal-per-person assumption. The owner's actual practice is six or more terminals splitting one capability's sections, and its only legal path was a one-step group claim — miss that door and the parking detour commits a sibling session's half-written diff at an arbitrary moment and releases its card. Measurement had already shown free parallelism safe (own-path commits, append-only journal, coexisting partial edits). So any terminal claims a ready card immediately, and existing claims of mine in the same unit are named in one informational line — sprawl visibility moves to resume's claim listing and its which-claim question when several claims meet an unaddressed resume. The `parallel:` field stays, being part of the Approval value format, but is decoupled from claim legality and feeds the informational line — v0.9.23's one-step group claim and the reciprocity predicate lose their reason to exist and are removed (zero card-format migration). Every checkpoint-style rule is rescoped to "the changes this session made to that card": uncommitted changes cannot be attributed to a session, so the unlimited reading of "checkpoint another unit's uncommitted claim first" could not coexist with several sessions (it still holds for the session that made the changes, so the bounding argument in the legacy-signal-migration rejection stands). Integrity item 1's condition becomes meaningless, so the item is redefined — a claimed card whose id matches no room (an orphan claim) — preserving the item number. Two terminals carrying the same card cannot be machine-prevented (terminals have no identity — the same measurement that rejected per-worktree identities), so the README guideline owns it

### DD-62 · During a blockade, journal appends that mint nothing, claim nothing, and consume nothing are written immediately (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

v0.13.0's publishing paragraph made even journal line creation wait for integration to open, and the real result of that freeze was the loss this system guards against most: a session dying while blocked takes the user's spoken request with it, existing nowhere but the dead conversation (the independent review's only top-grade risk). The original ground — no coordination point, no global answer — does not reach appends: an append needs no global answer, and that decision's own measurements showed appends merge safely. The allowance is an exact enumeration: maintenance requests, capability notes, attributed open items and decisions, product re-run pending. Layer opening (it mints numbers), evidence records (they need a push), verification-state lines, and every consumption (deletion) still wait. The final task commit is named on the continue side — it belongs to the session's own branch, yet sat in neither list, violating the same paragraph's own declaration that nothing waits unnamed

### DD-63 · Journal merge conflicts resolve 3-way, not as a union (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

The recorded reason for "union — keep both sides, date-ordered" was record preservation, but measurements 15–16 already rejected the same semantics in `merge=union`: a line one side consumed and deleted is revived by the other side's nearby append, so a request that was already planned comes back and the same fix is planned twice under a new number. That is not preservation but a ghost replay. The replacement: against the merge base's journal blob, a line present in the base and absent on one side was consumed — never restore it; a line absent from the base is an addition — keep both sides' additions in time order. Additions are all preserved, so 3-way honors the original reason better than union did. Blockade appends raise merge frequency, which makes the two decisions one body

### DD-66 · The tweak lane confirms its landing by machine first, and in same-file contention the tweak side yields (v0.14.2)

Subject: Concurrency, claims, integration | Introduced: v0.14.2 | State: active

This repairs three failures the v0.14.0 audit reproduced with Git fixtures: a tweak commit on a nameless HEAD lands in no branch and survives only in the reflog (4.2) · one tweak commit's HEAD advance turns a `routing prepared` recovery pinned to a base commit id into an integrity anomaly (4.4) · `git commit --only <path>` carries another session's half-done changes left in the same file (4.3). The path where a "no" reached from a stale checkout's documents produces a commit conflicting with a decision already landed on integration (4.5) was also confirmed. So the lane runs machine checks before editing — a named branch (`git symbolic-ref -q HEAD`) · no `routing prepared` in any working-tree verify.md · the readable integration tip an ancestor of HEAD · no uncommitted changes this session did not make on a target path immediately before editing — and compares the diff against its own changes immediately before committing. This is not state restoration but the commit's landing preconditions: the tree, journal, HANDOFF, and projections stay unread, and the checks are Git commands and bounded searches only, so the entry-cost saving (G6) holds. Resolving same-file contention stands on the fact that a session can always back its own changes out and reapply them — the side that steps back is fixed as the tweak side, so no mutual wait can form. The short race between check and commit does not close without a lock or session identity, so it stays in the not-covered table (the rejections of locks, per-terminal identities, and managed worktrees stand). DD-61's "bypassing the nets breaks nothing" statement is partly corrected by this decision

### Rejected under this subject

- **[DR-06 · v0.8.0]** **Candidate A (shared documents + ID tags) · Candidate C (per-user folders)** — absorbed
  into the adopted design D ("scope of truth").
- **[DR-07 · v0.8.0]** **Candidate B′ (gitignored private files + public notes)** — preserved rather than
  rejected: kept as the answer for teams that must leave no devflow traces in the
  repository. Not used on the normal adoption path.
- **[DR-26 · v0.12.0]** **A recorded focus field** — one `## Focus` line in HANDOFF storing "today it is this
  capability" durably. Its recorded ground, "that fact survives nowhere", is false: the
  declaration lands within one step as the claim rename, and past the boundary
  `Next single step` carries it. The one remaining hole is "declared, then the session ended
  with zero disk change", which costs one sentence — while closing it costs three writers
  (resume writes no file), a staleness judgment, and recovery rules. Unobserved friction, so
  it falls to "the harness grows only on a defect actually met".
- **[DR-27 · v0.12.0]** **A per-terminal state folder (`flows/`)** — terminals die silently. With no closing point
  the folder lives forever and needs a cleanup rule. The capability axis never disappears, so
  it never needs closing in the first place.
- **[DR-28 · v0.12.0]** **A second identifier level under the person** (`users/<person>/flows/<flow>/`) — every
  rule written "per id" splits into "per person × per flow", doubling exactly the most
  delicate area, recovery and integrity. Mode unification solves the same problem while
  shrinking the canon.
- **[DR-33 · v0.12.0]** **devflow creating or managing worktrees** — the recorded rejection ("core edits are common,
  so coordination cost beats parallel gain") is not overturned. This design does not create
  worktrees; it is merely compatible with worktrees the user already made.
- **[DR-35 · v0.13.0]** **`merge=union` on journal** — measured and refuted. With one side consuming a request
  and deleting its line while the other appends nearby, union revives the consumed request;
  with one side replacing an `evidence-wait` record by `evidence-finalizing` while the other
  appends, both records survive, which violates integrity item 13 with no handling rule.
  A union that resurrects deleted state is worse than a conflict a person resolves.
- **[DR-36 · v0.13.0]** **devflow creating or managing worktrees** — measured and refuted as a safety device.
  Two worktrees editing the same region of one shared file conflict at merge time, while two
  sessions in one folder do not, because the second edit lands on top of the first. Splitting
  the folder buys build isolation, not safety; the v0.9.x rejection of managed worktrees
  therefore still stands and needed no overturning.
- **[DR-37 · v0.13.0]** **An atomic lock helper for shared files** — made unnecessary by measurement. A commit
  naming its own paths and an append-only journal already give what a lock was wanted for.
- **[DR-38 · v0.13.0]** **A helper script for compare-and-set publishing** — its necessity was never argued.
  `git push . HEAD:<branch>` is fast-forward-only and `git update-ref <ref> <new> <old>` is
  explicit compare-and-set, so no helper is required. Measurement also found `update-ref`
  succeeds against a branch another worktree has checked out, silently desynchronizing that
  worktree, while the push refuses — so the plain push is the safer primitive, not the
  weaker one. Adding a script would change what devflow is: pure prompt text.
- **[DR-41 · v0.13.0]** **Ancestor-aware blob projection of other worktrees** — superseded by reading one
  integration branch. Once no other HEAD is authority, a filter that adds only their claims
  has nothing left to add.
- **[DR-42 · v0.13.0]** **Per-worktree git identity** — technically possible (`extensions.worktreeConfig` plus
  `git config --worktree`), and rejected on what follows: it rewrites commit authorship, so
  integrity item 8's authorship check stops meaning what it says; it leaves a room per
  folder that nothing closes; and it splits one person into several ids that the shared
  documents then have to reconcile. The question "can it be done" was answered before the
  question "what does it cost", which is the mistake this round set out to stop making.

## The knowledge layer and capability documents

### DD-28 · Durable knowledge is connected through bounded consumers of existing records, not through a new document layer (v0.9.21)

Subject: The knowledge layer and capability documents | Introduced: v0.9.21 | State: active

glossary and journal were produced but arch, design, work, verify, and delegated implementers did not read them; conclusions completed after two dependent cards opened together also could not reach the next implementer. The repaired read set is completely enumerated by name: glossary and journal when present, plus only the cards directly named in `Depends`. For brownfields, adopt indexes only exact per-capability paths to existing handoff and specification files under arch.md `Existing records`. The index is neither a read instruction nor canon; work opens only a path that split rechecked against current code and placed in the card's `Read first`. "Related records" and whole-capability-folder reading remain forbidden. Layer 0 completeness includes glossary; when only it is missing, resume sends a brownfield to adopt and a greenfield to product without rewriting another confirmed document. This does not force a second domain-handoff layer in the style of jgnote; it closes reachability within the existing canon, tree, and short-record hierarchy. The retrospective likewise receives exactly one event-specific input set, so capability and whole-project scopes cannot merge. This index differs from the observation-cache registration field rejected in v0.9.18: `Existing records` substantively avoids all three rejection reasons — a rule consumes it (split rechecks each path and puts it in a card's `Read first`), it indexes brownfield existing records instead of restating the outside-records standing declaration, and its only home is arch.md (see that entry in the rejection lineage)

### DD-33 · The knowledge-reachability set — standing of outside records · conversation decisions land immediately · a user-confirmation gate on product's four core sections · a disproof row (replace the statement, or re-run product) · a means row · a pre-HANDOFF landing check · a survival path for research answers that are tools · verify's disproof arbitration (v0.9.18)

Subject: The knowledge layer and capability documents | Introduced: v0.9.18 | State: active

Grounds: cross-corroborated field evidence — the rdsf structural diagnosis (2026-08-11: knowledge vanishing at handoff, disproved auto-injected memory surviving every session, a replan document self-created outside the model and reachable only through a hand-written HANDOFF pointer), owner testimony (a stuck-to-breakthrough conversation omitted from HANDOFF), and matching traces in ade (a self-grown reference layer claiming decision ownership until a wrong statement entered ADR-002; HANDOFF format overflow). Two causes: being on disk is not enough — a fact off every skill's read path does not exist for the next session; and the only landing gate (upper-document feedback) fires at card boundaries, so conversation decisions evaporate. product's heaviest sections were also the only ones modifiable with no user gate (steps 1–4 and the table rows carry no confirmation step — proven from the text). Verification: three independent lenses (refuter · literal-execution over 8 scenarios · whole-system coordinate sweep) → repair → re-verification (all three prior majors confirmed fixed) → local wording repairs. Zero new terms

### DD-42 · The capability knowledge baseline — the domain blueprint a verification closure produces (v0.10.0, lifecycle extended by v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.10.0 | State: active

Grounds are three measurements: across jgnote's 12 existing handoffs the chronology sections held 60–68% of each document while hand-written freshness declarations failed; ade's G-T2 produced a dual-ownership incident; and the rdsf knowledge-reachability diagnosis pointed at the same gap. v0.10.0 adopted option D, where one writer replaces one file wholesale at the last verification closure. A verification campaign (16 refutation findings → 3 research passes → 2 Fable refutation passes with 15 findings → a re-audit with 13) refined that candidate contract. The [proposal](rounds/v0.10.0/proposal.md) now preserves only the grounds and rejection lineage; the executable contract lives in exactly one place, the canonical baseline predicates. The rejections of time decay, continuous refresh, append-only inheritance, Assumptions and Open Questions, an index, automatic glob attachment, staging consumption, and symbol binding all carry forward

### DD-43 · Capability documents physically separate a design zone born with Layer 0 from a verified zone refreshed at closure, and are always on (v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.11.0 | State: active

The owner's operating intent is that a new MVP, a brownfield, and a mid-project join all obtain domain boundaries and concepts before the first card and reach them by number without card wiring. arch, or adopt in a brownfield, replaces the design zone; verify replaces the verified zone. They own disjoint byte ranges separated by the fixed `## Verified state` boundary. This decomposes rather than overturns v0.10.0's one-writer grounds: the two writing moments are serial, no byte is shared, design declares trust through `Design head`, and verification through `Scope head` and `Covered cards`. One seven-field machine block would overlap the two owners again, so the two design-metadata fields sit before the boundary and the five verification-metadata fields after it. The switch is removed because the adopted shape is not a 1,100–1,700-line relay-note second handoff layer: it is capped near 185 lines per capability, forbids chronology, and costs O(1) reads per card; even a small project gets the same lifecycle from a six-section design zone. Design freshness uses only the actual sources product.md, arch.md, and glossary.md. Including code-style.md or design.md would make every capability hypothetical with no failure path that changes its design zone — an over-harness. The exact v0.10 predecessor is separated from damage reset: design is re-derived from current Layer 0 and verified bodies plus compatible metadata migrate mechanically, but its old `Scope head` did not include consumed paths and therefore does not carry forward; verified statements remain hypotheses until the next capability closure

### DD-44 · Domain reachability is owned by the depth-1 number rule and resume's domain-entry branch, not by card fields (v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.11.0 | State: active

If split copies a baseline and ADRs into every card, the path lives in two places and requires a research-card exception. work uses the claimed card's depth-1 number to read one document and only the exact ADRs named by that document. A baseline path left in a v0.10 card's `Read first` is treated only as legacy wiring and deferred to that number rule. resume normally reads only file names and a shape projection, but when the user asks to explain a capability it opens one document by number or name and answers with both freshness states. It opens the entire expected set only when the user explicitly requests that full set. Foundation is reached by the same `01` number rule. Relationships live on the consuming side as exact paths in `Consumed paths`; provider closure, retirement, and split project only bounded metadata plus the Consumed-contract path/number columns and report consumers with their actual current freshness. That column projection detects an unchanged path reassigned to another capability without opening other prose. With no observed failure, this does not automatically expand into execution, card creation, or cross-capability regression

### DD-45 · Capability-document recovery is judged in HEAD, and an interrupted design write finishes by regeneration rather than byte comparison (v0.11.1)

Subject: The knowledge layer and capability documents | Introduced: v0.11.1 | State: active

An independent literal execution opened four paths. Requiring the prefix test to "equal the current writer's final re-derivation from HEAD" is false on every session change, because a design zone is prose the model compressed rather than a mechanical transform — so an ordinary interruption became an integrity anomaly with no repair route. Deleting that condition changes no outcome: the next sentence already orders a whole regeneration from HEAD. Defining absence over both the working tree and HEAD let one torn write of a new file block creation forever, so absence is defined in HEAD alone and a creation replaces working-tree bytes that have no HEAD counterpart to preserve. For the same reason, writer eligibility and begin recovery judge the boundary count in HEAD, and the working-tree count is reported to the user only. A user-confirmed boundary reset leaves no disk trace, so a recovering session would have to guess; it is therefore not recovered as a prefix and the next run confirms it again. The v0.10 migration gate demanded that two heads the migration discards parse, so one field broken by a bad merge left total-loss reset as the only exit — the gate now covers only the three fields the migration actually carries. And an unqualified restore route let a post-rename restore of the old path create two same-numbered files that no ordinary routing row reports, so a restore lands only at the current expected path. One trade is recorded rather than hidden: a recovering session now finishes a regeneration the user never saw, where the deleted condition used to turn that case into a reported anomaly. The batch it regenerates was already confirmed in the dead session, and the alternative was an exit no session could reach. Because writer eligibility, begin recovery, and resume's routing all read the same HEAD values, the boundary count is measured in exactly one place; the working-tree count stays in the report a person reads

### DD-48 · Knowledge that used to die in HANDOFF now lands on two keyed lines (v0.12.0)

Subject: The knowledge layer and capability documents | Introduced: v0.12.0 | State: active

A maintenance card has no dependencies, so the knowledge chain broke there, and HANDOFF's `Just learned` and `Traps` were overwritten at the next boundary — reliably lost. Inside one capability the carrier is the card's `carry:` line: only the residue with nowhere else to land, one to three lines per card, and a reader takes only the lines written since that capability last passed verification, so the set is bounded. About another capability it is journal's `capability note`, which that capability's next closure harvests and deletes in the same sweep, giving it a defined lifetime. Reading whole progress logs was rejected as unachievable — hundreds of lines per card, and before a first closure every card in the capability qualifies. The carry line rides the final task commit so the canonical claim→done move stays byte-identical, and neither reviewer nor verifier receives the set — their ignorance is the asset. HANDOFF keeps only the next single step and open decisions, and that pointer becomes mandatory

### DD-56 · Reading is bounded to open work: a depth-1 folder carrying `.done` is read by name (v0.13.0)

Subject: The knowledge layer and capability documents | Introduced: v0.13.0 | State: active

Twenty capabilities of thirty cards means six hundred filenames read every session, most of them `.done.` cards inside folders already closed, whose knowledge is folded into the capability document. Projecting names and statuses instead makes session cost proportional to open work rather than project history, which is the durability the owner asked for. Preserving only integrity items 3 and 11 is not enough: duplicate numbers, an active card's `Depends` resolving to exactly one `.done.` card, locator resolution, the `Covered cards` comparison, and next-number derivation all read closed history, and all of them are satisfied by names and statuses. Only item 4's field parse is narrowed, and a re-closure strips the folder's `.done` first, which returns those cards to it

### DD-59 · Open decisions live in journal, so HANDOFF holds only what the tree recomputes (v0.13.0)

Subject: The knowledge layer and capability documents | Introduced: v0.13.0 | State: active

v0.7.0 rejected moving open decisions into journal as "one concept, two homes"; that reason is refuted by removing the section from HANDOFF entirely, which leaves exactly one home. The failure it now closes is concrete: HANDOFF is overwritten whole, one person's two sessions share one room, and both overwriting means one side's decisions are gone with no trace. journal is append-only and already accepted attributed open decisions on the departure path. What remains in HANDOFF is `Next single step`, which canonical candidate order recomputes, so a lost overwrite costs an ordering preference and no data

### DD-64 · The third branch of a shared-contract observation is an attributed open item (v0.14.0)

Subject: The knowledge layer and capability documents | Introduced: v0.14.0 | State: active

v0.13.0's K3 row ("otherwise one line in journal.md") created a line with no class and no consumer — it fits none of the canon's three allowed classes (canonical formats, cross-task decisions, attributed open items), and the foundation has no closure rite to harvest it. That is the root of the seam defect where verify's classifier rejects the line as an integrity anomaly, and a hand clearing the blockage by deleting the line converts a stop into a loss. An observation that is neither an ADR nor a Risks entry is written as an attributed open item — where it should land (or whether to discard it) is a person's decision — and the existing open-item semantics (resolve through another table row, then delete) supply the consumer, so no new class and no indefinite residence appear. verify's classifier carries exactly the canon's allowed classes: widening the write side realigns the read side in the same words

### Rejected under this subject

- **[DR-01 · v0.7.0]** **Mid-task handoff document** — hands over a half-truth.
- **[DR-05 · v0.7.0]** **Moving open decisions into the journal** — one concept, two homes. Replaced by the
  HANDOFF carry-over rule.
- **[DR-14 · v0.9.18]** **An observation-cache registration field (an observation_cache line in arch's output
  format)** — rejected by convergence of all three independent lenses: a field no skill's
  rule ever reads cannot change literal execution; its only meaning (a cache of facts —
  decisions stay devflow's) duplicates the outside-records standing declaration; and it
  opens a drift path that splits where observed facts live. The shape of an external
  observation cache stays project-owned — two field projects inventing two different
  shapes is the evidence for not prescribing one.
- **[DR-15 · v0.9.18]** **Promoting "re-baseline" to a canon noun** — 0.9.10 recorded deliberately dropping
  this term for colliding with resume's digest re-baseline, and that reason still holds.
  The table carries the descriptive form ("re-run product") instead.
- **[DR-16 · v0.9.18]** **Changing the HANDOFF format (allowing a skill name in Next single step)** — the
  existing Open decisions section plus the disproof row's journal waiting line already
  close the same path. The format stands.
- **[DR-17 · v0.9.18]** **Obsidian-style free linking** — falls to the no-unbounded-reading lineage and would
  be a second structure competing with the tree (one concept, two homes). devflow's
  relation model stays the typed edges (Depends · Coordinates · Read first · settling
  card) plus the content-carrying discipline.
- **[DR-18 · v0.11.0]** **Expanding the full design per capability inside product.md** — makes the Layer 0 file
  that work reads for every card grow in proportion to the capability count.
- **[DR-19 · v0.11.0]** **Splitting design and verified zones into two files** — creates two paths per capability
  and doubles reading and rename costs.
- **[DR-20 · v0.11.0]** **Pulling the first closure earlier, or having split create documents** — still leaves no
  document during design or in a brownfield with no split, and makes task decomposition own
  domain design.
- **[DR-21 · v0.11.0]** **Having arch create and split refresh** — split's task structure is not a design-zone
  input, and two writers would own the same bytes.
- **[DR-22 · v0.11.0]** **Recording planned main flows and entry points in the design zone** — duplicates the
  same concepts in the verified zone after first closure. Planned entry points already live
  in product.md and arch.md.
- **[DR-23 · v0.11.0]** **Putting all seven fields for both zones in one block at EOF** — places arch-owned
  `Capability number` and `Design head` inside the suffix verify replaces, so the fixed
  boundary no longer separates byte ownership. Physically separating two design fields
  from five verification fields closes this failure.
- **[DR-24 · v0.11.0]** **Assuming resume can answer a domain question after seeing filenames only** — showing a
  path is not an execution branch that makes AI read the document. A separate bounded
  branch must open exactly one document by number or name.
- **[DR-25 · other]** **Any "skim the related records" rule for maintenance reopening** — "related" is a
  judgment word; a literal-minded AI risks a read explosion, reading an entire fattened
  folder. **No unbounded reading rules, ever.** (For the bounded, confirmed wording, see
  the observation items below.)
- **[DR-30 · v0.12.0]** **A new per-capability working-note layer** — the relay note already exists as four layers:
  code, unharvested cards, the capability document, Layer 0. This would be a third home, and
  it borders the relay-note second handoff layer v0.11.0 rejected.
- **[DR-31 · v0.12.0]** **Reading unharvested cards' whole progress logs, or only the last N** — the first is
  unachievable (hundreds of lines per card), and in the second N is both a judgment word and
  an arbitrary number. The `Covered cards` complement is a mechanical boundary already being
  computed.
- **[DR-34 · v0.12.0]** **A capability-document freshness line in resume's report** — planned, then not adopted. No
  wrong action is prevented by it. Approval only picks a stage; work consumes the knowledge,
  work reports the same line, and a hypothesis must be reconfirmed before use. Adding it
  would also have required amending "ordinary resume never reads a body". The reason clause
  and the alternatives list were adopted, because those do change which unit a user picks.
- **[DR-40 · v0.13.0]** **A six-field disposition state machine for `capability note` at retirement** — 30 to 50
  canon lines where one gate before the retirement commit closes it, mirroring the adjacent
  clause that deletes evidence records at retirement.
- **[DR-43 · v0.13.0]** **Splitting the capability knowledge baseline predicates into a read contract and a write
  contract** — attempted, then folded on its own condition. The clause×consumer matrix is
  not clean: identity and expected set, the document contract, metadata and freshness,
  writers and replacement boundaries, the v0.10 migration, and accepted limits are all read
  directly by arch, adopt, verify, and resume alike, which is most of the file. resume, the
  supposed reader, needs the writer-eligibility rules for boundary recovery and the begin
  commit; verify, a writer, needs the domain-entry role inputs. Every consumer would read
  both files, which is the recorded condition for folding. Deferred rather than dropped.
- **[DR-45 · v0.13.0]** **Foundation closure folding observations into the verified zone** — six values would
  have needed defining (when, by whom, which point-in-time input, which section, how to
  mark unverified content, which card list) and the entry-point auto-detection was not
  mechanical: an undecided state at implementation-impossible level. The foundation's
  verified zone stays `None.` — it receives no scenario rite, so having no verified state
  is the honest record.
- **[DR-46 · v0.13.0]** **A source-preserving view on the consuming capability's side for shared parts** — a
  description from the consumer's viewpoint, not of the shared part itself. Shared-part
  knowledge already lives in three homes with reach paths: ADRs, arch.md's Risks, and the
  foundation cards' carry lines.

## Brownfield and entry

### DD-10 · No retroactive tree records (brownfield)

Subject: Brownfield and entry | Introduced: origin | State: active

Backfilling `.done.` cards for existing features is waste. The tree covers only what comes after adoption

### DD-20 · Brownfield entry is its own skill, adopt — split out of arch (v0.9.10)

Subject: Brownfield and entry | Introduced: v0.9.10 | State: active

arch held two concepts under one name — development planning and whole-Layer-0 reverse-derivation — so entry discoverability died (the derivation trigger lived only in the tail of the skill description) and the seam in the body was ambiguous (a literal reader could not settle whether the interview procedure and the verify-channel gate applied after derivation — owner report 2026-08-10). The derivation procedure and field split moved per the 0.9.8 decision — new sentences bounded to the entry guards, the evidence-order line, the gate pointer, and the design note; 0.9.8's "re-interviewing is waste" verdict stands. The output formats stay canonical in product·arch; adopt references them by stage name + the Codex prompt embeds them at install time (same grounds as the flat-folder decision). "adopt" is standard developer vocabulary — the Nx docs section "Adopting Nx", Next.js·React official "Incremental Adoption", the Tech Radar top ring "Adopt"

### DD-26 · Brownfield and layer transitions have explicit disk states, preserving their meaning across interruption (v0.9.21)

Subject: Brownfield and entry | Introduced: v0.9.21 | State: active

An adopted repository and a new project had the same document shape, so resume backfilled existing features into the tree; deriving a multi-domain service from one representative flow also produced capability boundaries that were too coarse. adopt now enumerates candidates from external entry points, top-level modules, and existing documents, then traces one representative flow per candidate. arch.md's `Brownfield` field records only whether implementation existed before adoption, preventing backfill. Completing tracked post-adoption work does not expand automatically into the product layer; only an explicit `product verification requested` marker opens it. That request changes atomically to running and result states, each in its own commit, so the brownfield trigger and revisions survive request deletion. A verbatim `maintenance routing pending` line survives until the planning commit so a session break between adoption and the first card plan cannot erase the change request. Before opening a layer, an exact parent path and child numbers go into a journal marker before the parent is created; the marker is deleted only when every child and task-card approval lands in the planning commit. Root waiting capability files are not task cards and therefore have no Approval or Review fields; a new project's foundation is never an empty folder and is created with its direct cards in the next layer. The boundary after an ordinary final task commit is detected without Git's rename label: the HEAD claim is absent, exactly one same-number/name `.done.` file exists beside it, and bytes match. A begin marker carrying the passing revisions recovers capability closure. Non-capability folders whose active direct children are all `.done` close deepest first; only a capability folder waits for a verify pass

### Rejected under this subject

Nothing has been rejected under this subject yet.

## Git mechanics and interruption recovery

### DD-34 · An open Git rebase or merge in a Git work tree returns to the user before every devflow route (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

If a session ends after an integration command, Git's open operation and conflict index are already durable state. Treating them as claimed work can append the wrong devflow state, while an automatic abort can discard resolutions the user made. No path or commit changes before the user decides; continuing allows only confirmed conflict resolution and commits of the existing Git operation, followed by a fresh integrity check. A non-Git project has no such state, so the gate neither applies nor initializes Git

### DD-35 · Commit locators use Git's full object ID, while path and card order have canonical byte and numeric rules (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

A 40-character requirement rejects SHA-256 repositories. Operating-system or model default collation can choose different first items for Unicode paths and `02.2`, `02.10`, or `02.2b`. Define once: Git's unabbreviated object ID, UTF-8 byte order for repository-relative `/` paths, and numeric-plus-suffix order for dot-separated card numbers

### DD-37 · Remote evidence splits the final task commit into the `evidence-wait` and `evidence-finalizing` states (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

Failure path: when only a remote result remains in the completion signal and the session ends between the checkpoint commit and the journal record commit, the next session judges the same CI result twice or makes a second final task commit. The canonical journal line therefore carries the checkpoint hash and `check-json` so recovery has exactly one point, and a pass becomes `evidence-finalizing`, meaning the final task commit is done and only upper-document feedback and boundary cleanup remain (CHANGELOG 0.9.21)

### DD-39 · Tree-input revision hashes are computed only through a binary pipe inside `cmd /d /s /c` on Windows (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

Actually reproduced: on 2026-08-11 in this repository, the PowerShell 5.1 object pipeline touched the NUL-bearing stdout of `git ls-tree -r -z` and corrupted the hash — the POSIX binary pipe and the `cmd` pipe produced the same hash, and only the object pipeline differed. Same "actually reproduced" class as the install.ps1 BOM row

### Rejected under this subject

Nothing has been rejected under this subject yet.
