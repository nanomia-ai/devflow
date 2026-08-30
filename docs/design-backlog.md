# devflow field observations and on-hold candidates

This is the file a release plan opens. Nothing here is a decision — these are the things that will not become rules until field data arrives.

An observation is never deleted. When something settles it, strike it through, attach what carried it out and when, and move it to "Observations already settled". Deleting it outright lets the next session re-propose the same observation with nothing to refute — the same reason the rejection lineage is kept.

The same holds for on-hold candidates. One that is taken up keeps its entry with the `DD-nn` it landed as; one that is dropped goes to the rejection lineage with its reason. Neither disappears quietly.

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
- Does foundation's (01) design zone reduce the cost of rediscovering shared-contract
  boundaries and invariants in real cards? With no independent verification boundary, its
  verified zone remains `None.`. If no use trace appears, this is the first cut candidate
  from the domain-knowledge layer.
- A change to shared code (the foundation, shared contracts) does not rerun the regressions
  of the capabilities that use it. The baseline may detect this as a hypothesis, but it fires
  no verification. Re-examine if shared changes become frequent.
- **Repeated bulk confirmation when only the Design head line changed** (added as a v0.15.2
  observation) — watch for N repetitions where a bulk diff across all capability documents
  changes only the `Design head` line after a Layer 0 touch. If the user reports confirmation
  fatigue from that repetition, reopen the option to land an `arch|adopt — capabilities`
  commit without a confirmation question when that line is the only diff in every file.
  In synky, settling six Provisional rows made every capability's `Design head` stale six
  times. Until then, keep the current confirmation gate.
- **`verify_channel` mixes selection with current executability in one value** (v0.17.0) —
  a repair must define the value grammar and consumer rules together, including parsing and
  stopping at a planned state, so this round did not repair it. Reopen after one case where
  verify is called incorrectly because a planned means was read as executable.
- **An active claim can defer design-zone refresh indefinitely** (v0.17.0) — under resume's
  first-match rule, the active-claim row precedes the capability-document row. Code correctness
  remains intact; reopen after one owner entering the domain or one new joiner is actually
  misled by stale capability-document content.
- **Death midway through adopt loses the whole representative-flow trace** (v0.17.0) — adopt
  forbids persisting the evidence table and has no progress marker. Re-measure intermediate
  landing cost after an actual brownfield adoption has to rerun adopt.
- **An upper-document change and design-zone re-derivation are not one transition** (v0.17.0) —
  the discovery→update table directly wires re-derivation only for capability rename and split;
  common stack, boundary, and data changes rely on the semantic-review rule. Reopen transition
  wiring after a missed semantic review is found later.
- **Two recovery paths change capability-document bytes without batch confirmation** (v0.17.0) —
  regeneration after an interrupted confirmed write and mechanical path replacement when an ADR
  is superseded. Revisit the confirmation boundary if either path produces an unexpected diff.
- **The term `Layer 0` splits on whether it includes capability documents** (v0.17.0) — the
  runtime contract separates them after Layer 0, while
  `docs/blueprints/memory-fs-0.15.2_ko.md` and `docs/rounds/v0.12.0/handoff_ko.md` read as
  including them or do so explicitly. The blueprint and historical record stay untouched as
  records of their time.
- **No canonical route recovers an unrecorded ADR after arch.md has landed** (v0.17.0) — the
  ADR rows in the discovery→update table cover a mismatched existing ADR, a settled Provisional
  value, a reversed decision, and a code-confirmed fact. If an unrecorded ADR is still discovered
  after DD-73's pre-confirmation review, use that first case to decide whether to add a separate
  discovery→update row.
- verify.md preserves its Failure history, Audit, and Retrospective sections forever and so
  grows without bound. resume is protected by its bounded projection, but the retrospector
  reads every verify.md in full at the product layer.
- Layer 0 lands one document per commit, so a session that dies with only arch.md committed
  gets routed to the design-zone refresh while arch's skip gate, which requires a complete
  Layer 0, reads false and runs steps 1–5 again. The outcome is right — that run actually
  creates the missing code-style.md. The cost is confirming one defaulted question batch a
  second time, so no routing row was added. Review it if the re-interview is observed as a
  real burden.
- **Retiring a capability strands a cross-capability `Depends`** (found by the v0.12.0
  usage-flow walk, not fixed there). A card outside the retired folder whose `Depends` names
  a card inside it is either an integrity item-4 anomaly or permanently not-ready, and
  retirement is explicitly forbidden from creating a `re-split pending` marker, so nothing
  repairs it. Pre-existing and unrelated to the usage-flow axis; fixing it needs its own
  decision about whether retirement rewrites dependents or the user reactivates.
- **Two terminals block each other's closure through journal** — one terminal's uncommitted
  `maintenance routing pending` line makes the other's capability closure report an
  unexplainable integrity anomaly. Safe (nothing is lost, the stop is the strict-prefix
  safety device working), but the user sees a stop they cannot read. Watch whether it is met.
- **Tense tension between arch's verify-channel pass bar and the "first task" creation
  rows** (predates v0.17.0, observed by the v0.18.0 walkthrough) — the bar "confirm it can
  actually run now" and the table rows "create the missing `.http` or run command as the
  first task" coexist before implementation only in the future tense. The walkthrough
  passed by interpreting it as an actual test-runner run plus a first foundation card.
  Pin it in prose only when a real divergence of interpretation is reported.
- **Domain entry needs the capability name verbatim.** "the payment domain" does not contain
  `payments`, so recognition resolves nothing and resume asks. Safe by construction, but the
  most natural phrasing costs a round-trip. Loosening it would introduce fuzzy matching, so
  the round-trip is preferred until the friction is actually reported.
- **Carry-line content quality** (named first-priority by the v0.13.0 review) — "a fact that
  could make the next card wrong" borders on a judgment call, and `none` is the safe
  default, so the lines may drift toward never being written. The failure is silent: every
  line reads `none` while the next card falls into the same trap again. Watch the real
  distribution of carry lines in field use.
- **Tweak-gate misclassification rate** (v0.14.0) — a transition-changing edit that slips
  through the tweak lane changes code with no record. digest and the Scope-head freshness
  downgrade are the after-the-fact signals. Revisit the gate wording if misclassification
  is observed.
- **Noise of the standing publish-wait line** — in worktree flows a constant "N items"
  shows during card work. Accurate, but attention may dull.
- **Stranded flows** — claims land on integration but checkpoints ride their own branch, so
  deleting a worktree or a teammate going away strands that progress on a branch nobody
  reads, and the next session quietly re-implements from the claim point. Journal appends
  left as local commits during a blockade share the same root — re-entry on the same
  branch reads them in step 6, but entry through another branch or worktree does not
  discover them automatically (v0.14.0 audit 6.1). Git preserves the
  bytes, so this is visibility, not loss. Reserve option: a bounded query in resume listing
  unintegrated local branches holding commits with my id prefix — not added before field
  observation.
- **Plugin version skew** — a repository has no way to record the devflow version it
  assumes, so a 0.12 session and a 0.13 session can judge shared state under different
  definitions in one repository. A documentary defense belongs to a person's document and does
  not live inside devflow; the structural limit itself is watched here.
- **Trap reach at first cross-capability consumption** — when an 02 card first consumes an
  03 contract it reads 03's code but has no path to a trap that lives only in 03's
  document. The capability-side version of the problem the shared-parts decision solved for
  the foundation. No real defect observed yet, so this is an entry only.
- **The re-verification tail of bundled cards** — when a bundled card becomes a
  capability's last active card, a re-closure proposing a full regression run follows. The
  proposal needs approval, so the real cost is noise, and the tweak lane shrinks the bundle
  population; watch.
- **Cross-capability repair-lineage route stored in an asymmetric location** (v0.15.0 audit
  C1) — when B's card names A's fix card in `Depends`, that signal's recurrence route lands
  in B's verify.md, but a later A run's projection (current target, tree root, label-owning
  capability) never opens B, so the same root's `max recurrence` can be restored one round
  low. The original failure, root, and route stay on disk (DD-30) and automatic
  implementation stops at execution-proposal approval, so the risk is a delayed lineage
  gate, not loss. Post-hoc signature: the first case where a verify.md whose verification
  target key is B holds `repair lineage: <A>@<id>` with a capability number different from
  B and a completed `routing: fix cards …` — entries whose root prefix is `product` do not
  count, because the label-owning path already covers them. When this signature appears
  even once in real verify records, or a user reports approving repeated fix cards for the
  same signal with no past route visible in the proposal, reopen signal-owner backlinks
  (with persistence, atomicity, and recovery contracts) and a cross-capability
  verify-origin `Depends` restriction as one set of design options. Before that, add no
  full verify scan, shadow state, or extra output rule.
- **Double labels from an original card and its fix card sharing one completion signal**
  (v0.15.0 audit C2) — when a fix card carries the original card's completion signal
  verbatim, one regression bundle holds two `(signal card, signal)` pairs, and the same
  non-pass can split into an existing root and a new root, duplicating fix cards and
  approval round-trips. Both entries and both routes are preserved, and execution-proposal
  approval caps duplicate implementation. Post-hoc signature: the first case where two
  `.done.` cards with different signal cards have byte-identical `Completion signal`
  fields and the same Record's Failure history holds one entry in the second form (no
  root) and one in the third form (with root) — in the latest run the `regression` field
  lists both labels together. When this signature is confirmed in a real Record or card,
  or separate approval round-trips for one identical signal are reported as duplicate
  cost, re-examine the original request proposal (bundling same-command labels) against
  plan3 P3-D2's recorded reason for item independence (the refuted mixed blocking that
  stopped unrelated failures), and first prove with fixtures that exact-signal dedupe does
  not revive that blocking. Before that, add no dedupe, alias, or wrapper rule.

- **The capsule opening budget of 240 lines / 24 KiB is provisional** (v0.18.1) — its
  measured basis is a single trial processing (property), at 112–180 opened lines per card.
  Watch the comprehension-question failure rate and the rate of budget overruns and explicit
  approvals; if overrun approval becomes routine, retune the numbers.
- **The escape rate of unmarked synthesis** (v0.18.1) — the provenance sampling check (three
  unmarked sentences per capsule) is a sample, not a census. If a processed-text-only session
  is observed citing an unmarked synthesized sentence as source fact, revisit the sample size
  and the check's form.
- **Disputes lingering unresolved** (v0.18.1) — a dispute reaches a person only in adopt's
  confirmation batch and verify's closure report. If disputes are seen going uncollected in a
  capability that stays open for a long time, revisit the collection points.
- **The three-arm comprehension re-measurement** (v0.18.1) — the same 13-question three-arm
  measurement has not yet been run against artifacts reprocessed under the confirmed marking
  spec. Until it is, this spec's comprehension recovery is a hypothesis backed only by the
  design evidence of the first measurement.

- **A capability that overruns even the compact index** (v0.18.1) — the index projection
  downgrades from full to compact at 24 KiB, and one capability's 100 capsules fit compact in
  21 KB. Past that only zero entries and the filters to narrow by come back. v0.18.2 removed the
  `--facet` and `--state` axes from both the capsule header and the tool, so the remaining
  filters are `--capability` and `--path`: the first cannot narrow further because this
  observation is already inside one capability, and the second needs the very paths the index was
  to supply. It does not occur at measured scale (12 capsules per capability), so no rule is
  added now. Open index paging (`--after`) or explicit approval when one capability passes 100
  capsules or a compact-index overrun is actually reported.

- **Splitting the canon is blocked by measurement** (v0.18.3) — DR-44's on-hold item, splitting
  `principles/SKILL.md` (67,205 B) per consumer, was mapped section by section: 21 sections
  against the eight entry skills, the four role contracts, and the hook. **46,593 B (69%)** of it
  is executed by all eight, and the six rows with three or fewer consumers total **16,366 B** —
  the maximum a split could win. But all six are coupled to universal sections: read Identity
  without Commit Discipline and a session mints a commit subject with no room id; read the
  journal formats without the Integrity Check and a malformed line passes silently. DR-44's
  recorded reason **moves from asserted to measured.** Reopen when a group of sections with no
  such coupling is found, or when a check exists that catches misplaced content. (The
  repository's own consumer tests catch **wiring mismatches**, not **content placement** — a
  different layer.)
- **Whether capability documents should carry tags and dates — not now** (v0.18.3) — the
  relevance judgment ends at the capability list in `product.md`; even `resume`'s domain entry
  reads only the name and the shape projection, never the body. A tag on the capability document
  arrives **after the choice is already made**, so it separates nothing. Capsules are the
  opposite case — up to 100 under one capability — which is where `about:` and `changed` earn
  their place. Reopen if a project's capabilities grow numerous enough that choosing from the
  `product.md` list alone is observed to be hard.
- **The token weight is left short of the mark** (v0.18.3) — the hook routes every session to
  resume, so in a repository with devflow state a session spends about **148,000 B ≈ 37k tokens**
  before doing anything. 0.18.3 cut between −5,438 B (resume) and −197 B (product) per entry,
  which does not change the order of magnitude. The cause is measured: 69% is universal and the
  rest is coupled to it. **An angle other than splitting is needed.**
- **knowledge-landing history-walk latency** (v0.20.0 Phase 3) — the current package walks Git
  history to recover named provenance, but no real-use timing ledger exists yet. In the first
  Phase 4 real-use run, execute cold knowledge-landing 3 times and record median elapsed time and
  the number of unique revisions opened. Reopen only if that median exceeds generate+build time
  for the same package, or opened revisions exceed 2 times the named provenance-candidate commits.
  Before that threshold is measured, propose no cache, index, or bypass path.

## Observations already settled — lineage

The items below were carried out and left the watch list. Re-proposals consult this lineage first.

- ~~In complex multi-domain brownfields, does "trace one representative flow" cut the
  capability list too coarsely?~~ — implemented in v0.9.21: enumerate candidates from
  external entry points, top-level modules, and existing documents, then trace one
  representative flow per candidate.
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
- ~~resume's missing re-run branch~~ — implemented in v0.9.21: resume judges a waiting
  product re-run in journal before work, then branches to product, split, work, or verify
  from disk state.
- ~~The retrospective does not take capability knowledge baselines as input~~ — implemented
  in v0.11.0: a capability event gets that capability's one document; a product event gets
  foundation and every non-retired capability document, all with freshness projections.
- ~~design.md has no row in the discovery→update table~~ — DD-69 in v0.15.2 implemented a
  row that replaces one exact line for build-result facts and sends direction changes through
  the record-first design re-run.
- ~~When design creates its real artifacts in a blank frontend repository~~ — DD-69 in v0.15.2 adopted
  design as the owner of only six Layer 0 decisions and the build scope, while split cards own
  the real token, component, and preview artifacts. design remains optional before or after the
  foundation, and late entry uses the record-first path.
- ~~Are ADRs actually used for large scope pivots (e.g. shrinking ade's MVP ①②)? — the
  device exists; it is a matter of usage judgment.~~ — DD-73 in v0.17.0 implemented a step before arch.md confirmation that enumerates
  every decision passing the three ADR conditions and confirms whether each is recorded.
- ~~A plain user correction to a confirmed product.md statement has no lightweight row.~~ —
  settled by DD-75 in v0.18.0 and relanded by DD-77 in v0.18.2: a user-initiated change without
  a disproving measurement is a first-class discovery→update row — the conversation is the
  confirmation, and a related decision is overwritten in place with `owner decision` as a
  sufficient one-line ground.
- ~~Capture-gate omission and record volume — whether a real 6-hour interview under-records or
  over-records~~ — voided by DD-77 in v0.18.2: the record gate and the decision and evidence
  record layer are gone, so the item has no subject. Of its four watches, the share of
  `mode: reported` evidence was DD-74's own revisit condition and hit its maximum at 6 of 6 in
  measurement, which became this round's ground. Whether settlements push the owning document
  out of its budget is carried on by DD-77's revisit condition.
- ~~The q>3 self-approval rate~~ — voided by DD-77 in v0.18.2: `select`'s current-set projection
  over records and its per-judgment cap went together, so the bypass has no subject. The
  same-shaped risk (a session substituting itself for the approval subject) is watched on by the
  capsule opening-budget hard cap observation.
- ~~The unused `checked-at` key — a v2 schema candidate~~ — voided by DD-77 in v0.18.2: the
  record header schema itself is gone, so there is no `v:1`→v2 evolution at which to re-evaluate
  removal.
- ~~Whether `--facet` and `--state` are the axes to narrow by at a compact-index overrun~~ —
  settled by v0.18.2 removing both axes from the capsule header and the tool together (a sweep
  confirmed no skill called `--facet`). The observation that carried the question, "a capability
  that overruns even the compact index", stays on the watch list because the index and its 24 KiB
  cap are unchanged; only that sentence was rewritten to the remaining filters.

## Observations settled in v0.20.0

- The observation that principles could recompute state or a hook could inject it, creating a second judge beside resume, moved to DD-92. The hook now gives delayed guidance only and resume alone owns state.
- The observation that a capability-number knowledge shape cannot express research, recursive knowledge, and multi-owner landing moved to DD-92. Its result is research-only `00`, same-stem owner-adjacent recursive `K`, and atomic C1–C6 JSON-marker consumption.
- The observation that an authored package needs a durable behavior source, provenance, and build evidence moved to DD-92. A P2 package keeps `spec.mjs` and portable provenance inside the package.

## On hold — candidates for coming versions

- **The 0.18.9 agenda — the four 0.18.8 left open** — 0.18.8 closed "the tool meets the
  writers it had never met" and deliberately deferred the rest of the same root. The root form is **prose
  states something unconditionally while code acts conditionally**. The four: (1) deleting
  `state-predicates{,_ko}.md` — no skill reads it, but it moves together with the ten
  integrity items whose judgment the tool now owns, and four coordinates cite those items by
  number (three in `principles`, one in `product/SKILL.md`); DR-44's recorded reason applies
  as written, that mixing deletion with repairs hides which change broke what · (2)
  `verification-predicates{,_ko}.md` — `verify` requires a tool output ("the tool reports
  missing") that does not exist and has no test; **the tool output and its test come first** ·
  (3) the closed-folder projection — the canon says a machine query "opens no body" while
  `loadSnapshot` opens every card, with no test · (4) integrity item 8's three exemptions
  (user-authorized reassignment, departure, planning transition) are absent from the
  implementation. Adoption condition: (2)(3)(4) need the tool output and its test standing
  first; (1) follows in the release after that.
- **Two surfaces nothing uses** — `--card` is parsed and validated but reaches no projection
  (0.18.8 removed only the instruction to pass it). `--capability` reaches `baseline` but not
  `integrity`. Until a consumer meaning exists to wire, removing them from the CLI and from
  DD-80's filter list is the smaller move. Adoption condition: a real session is observed
  needing that filter.
This list stays inside this document set. The next AI does not read closed issues, but the
gate forces this set to be read — so the v0.9.0-era plan to migrate the list to GitHub Issues
after going public is retracted, its own reason having refuted it (2026-08-13).

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
  The v0.17.0 filename-suffix exploration was blocked simultaneously by the core-document
  path prohibition at `principles:367-368`, bare `.wip.` being an integrity anomaly at
  `:522-523`, and the ban on progress records in five documents at `:509-511`; it also fails
  during an integration blockade. That proposal was a refinement of (A), not (B), so the
  owner's choice between (A) and (B) remains open.
- **The size of the canonical rules** — the canonical rules grew from 217 lines (v0.9.9)
  through 705 (v0.13.0) to 770 lines (v0.14.1), and all 8 skills plus every delegated implementer read the whole document.
  Counting the predicate companions, resume reads about 1,636 lines each session (measured
  in the v0.14.0 execution report §5) and arch about 1,400.
  Removing the mode fork gave 30 lines back and the usage-flow and concurrency redesigns spent
  more than that, so this stays the largest open cost. For a T-low card, the journal formats,
  the 15 integrity
  items, the routing write order, the remote-evidence state machine, and the verification-state
  commits never
  fire once. The proportional answer is not deletion but **splitting the read scope per
  consumer** (what an implementer needs versus what a router or a recoverer needs), and it
  changes no on-disk data format, so it can be done safely at any time. Giving work, reviewer,
  and retrospector bounded projections in v0.11.0 is the first application of that split.
  v0.13.0 attempted the same split on the baseline predicates and folded it — see the
  rejection lineage for the matrix that decided it.
- **Proportionality of the interrupted-recovery machinery** — about 150 of the canonical
  rules' lines answer "what if the session dies mid-transition": markers, begin commits,
  prefix comparison, byte-identity judgments, the `routing prepared` specification, and the
  evidence-wait state machine, plus 15 to 20 of resume's 49 routing rows. Those transitions
  take seconds; a session dies during a long implementation, not between a rename and a
  commit. And devflow's own philosophy is to report an anomaly and fix it only after
  approval, while these lines try to finish the transition automatically. Detecting the
  half-done state and asking would keep detection and drop the completion, at roughly a
  third of the size. Three reasons it was not done in v0.13.0: it is a different axis from
  concurrency, and mixing them hides which change broke what; the recorded rejection reason
  from v0.9.21 was "the problem was ambiguity, not interruption", and that has to be refuted
  first; and nobody has measured whether those 150 lines actually cost session quality. The
  first real cycles are what answer that.
- **A full ko/en translation-consistency sweep** — v0.18.6 minimally repaired, in
  `skills/principles/SKILL_ko.md`, **the place where the blockade waiting list names the
  audit-requested and retrospective-requested kinds** (`:90-91` as of 0.18.6): it named both
  under their English names, so a Korean session could not match, by name, a line it had
  written in the form **the canonical journal-format block in the same file** gives
  (`:215-216` as of the same release). Later edits push line numbers, so **find those two places by
  name**; the numbers are what they were then. Whether the same drift sits in other pairs has
  not been counted. A full sweep is a separate round — it reads
  whole ko/en pairs rather than one file, so folding it into a minimal repair opens the scope.
- **A generation gap in capability-document grammar** — the capability document (v0.11.0)
  demands fifteen fixed headings, table columns, and `None.` in an empty section, while the
  capsule (v0.18.1) gives only slot names with no checker. There is a measurement behind the
  capsule's choice — five of twelve fixed slots came back filled with "cannot fill", the form
  detected zero defects, and four forms tied across thirteen questions. And **the machine
  actually reads only eight lines of a capability document** (one zone boundary plus seven
  metadata fields). The adoption condition is the share of sections filled with `None.` in the
  first real 0.18 use; before that, changing the grammar is a change with no measurement.
- **The window a person reads** — the roughly 4 KB of "just learned · traps" in v0.9.9's
  HANDOFF was the one place a person read it all at once, and that content is now scattered
  across three, so **a person cannot read it until the capability closes.** A new file is not
  the answer — the query work already runs (the last carry line of a done card outside Covered
  cards) plus the state tool's `ready:` and `claim:` zones, **made callable by a person from a
  shell**, stands the same window up. Zero new files, zero new rules.
- **ADRs and a capsule's `## Decisions` play the same role** — the canon already calls ADRs
  legacy, so this is the one pair that could merge, but the cost is frozen behind that legacy
  label and **it is not the work to do now.** Merging moves the `Binding ADRs` section, the
  reviewer and retrospector inputs, and the tests. arch's three conditions survive unchanged:
  they are a threshold, not a file kind.
- **The tool has two homes** — v0.18.7 put the state tool in `skills/principles/scripts/` and
  the capsule tool stayed in `scripts/`. Moving the capsule tool is a separate round candidate,
  and moving it takes eight call sites and the canonical location sentence (the "where the tool
  lives" section of `baseline-predicates.md`) with it.

The items below are what v0.18.9 — the repair of the first field test — left out of scope. Each
"what remains if it is left out" came from that round's scope judgment.

- **arch does not skip the capsule section either** — `arch/SKILL.md` reads all 50 KB of
  `baseline-predicates.md`, and `:120-360` of that — 241 lines, 16,076 B — is the domain knowledge
  capsule contract. A greenfield project has no source to process, so a capsule cannot structurally
  exist ("never invent a capsule without a source" in the same file), and both test projects ended
  with zero capsules. v0.18.9 left it out because **the observed failures were 0 of 20 and the
  predicate was aimed at the wrong side** — arch is the side that *writes* capsules, so the gate
  cannot be `presence` (do any exist) but "is there a source to process, or is the budget about to
  overflow". What remains if it is left out: greenfield arch entry keeps reading all 50 KB. Nothing
  breaks. **Adopt when it is re-derived as behavior-triggered** — "read that section when processing
  a source document or just before the capability document budget overflows". In that form DD-78
  does not move.
- **`.done` conflates "finished" with "succeeded"** — a research card whose answer is "no" is still
  `.done.` and still releases its dependents. In the test, when 02.5 closed with "the channel cannot
  be acquired", the state tool reported 02.4 as `ready=true blockers=[]`. Instead of a new field,
  v0.18.9 closed only the one observed scene through **P5** — work's leave-the-card route returns the
  original card to `Approval: pending` when the inserted prerequisite is a research card, with zero
  tool change. What remains if it is left out: when later evidence refutes an earlier research card,
  the wrong answer stays behind a `.done` suffix (01.3 did exactly that) — a rediscovery cost, not
  damage. **Adopt when the same misrouting is observed somewhere other than the prerequisite-insertion
  path.** The sample is still one.
- **A closed folder's progress log is sealed** — the canon asserts that for a `.done` depth-1 folder
  a machine query "reads only path names and status suffixes and opens no body — that folder's
  knowledge is already folded into its capability document", yet the `node:sqlite` null-prototype row
  trap that the test's 01.4 isolated closed with `carry: none` and folded into nothing. `carry` is
  defined as a fact that could make **the next card in this depth-1 unit** wrong, so there is no
  channel that carries it out of the unit. v0.18.9 left it out because the sample is one and because
  that trap is equally explained by not using an existing discovery-to-update row (a shared contract
  or the foundation → ADR / Risks / open item). What remains if it is left out: a trap learned in the
  foundation can be buried under `carry: none` again. **Adopt when a trap planted for gate B reaches
  neither Risks nor an ADR nor the capability document.** It is already one of gate B's observations.
- **A platform where the clean judge cannot acquire an execution surface** — v0.18.9 closed this with
  **P4** (arch step 5 runs the channel once in the context that will use it) and the
  **`channel unavailable` rule** (when it still cannot be acquired, a human decides). The two-stage
  "separate the judge from the executor" proposal was left out because it costs three new concepts
  and a change to `verifier.md`. What remains if it is left out: **on a platform where no channel runs
  in a clean context at all, a frontend capability does not close** — that rule sends it to a human.
  Whether such a platform exists is unverified. **Adopt when gate B shows that even a CLI or HTTP
  channel does not run in a clean context.** Adopt after a sample exists, not before.
- **★ Does the product layer need `channel unavailable` too** — the rule is scoped to the capability
  layer. If the channel cannot be acquired at the product layer, every success criterion becomes
  unverified and all of them go through verify's maintenance routing, which could reproduce at a
  larger scale the card growth seen at the capability layer. **The scope exists because product-layer
  verification has run zero times** — widening a rule into a place with zero observations is the
  proliferation this document set guards against. **Adopt when product-layer verification runs at
  least once in real use and that scene is observed.**
- **★ A canon-conflict report has nowhere to land** — when two canon rules collide, the session now
  reports both source texts and coordinates, but a report that goes only into conversation evaporates.
  In the first field test the 20 "sentences whose meaning could not be settled" evaporated exactly that
  way — they survived only because the test demanded a separate log, and in normal use nothing in
  `devflow/` would hold them. Fixing it now would create **a new record kind**, and that is the last
  resort. **Adopt on this measure: among the items a record-comprehension measurement returns as
  "cannot tell" or "read it wrong", how many would this report have filled?** That count sets what a
  new place is worth.
- **Delete the interruption-recovery auto-completion · let the tool execute rename and commit** — the
  first drops roughly 150 lines of canonical auto-completion down to detect, report, and ask; the
  second lifts 186 lines of commit discipline, the room procedures, integrity item 15, and the 13
  reserved journal forms out of prose into the state tool's write commands. **Both are subtraction, so
  neither mixes with a repair round** — DR-44's recorded reason (mixing deletion with repair makes it
  impossible to tell which change broke what) applies unchanged. **Adopt immediately after gates A and
  B are green.** Those two gates are what make the subtraction safe.
- **Integrity items 12–15 as advisory · `Design head` as per-capability freshness · the tweak ② scope ·
  one hook line in an empty repository** — v0.18.9 held all four. Advisory lost value because gate A
  covers the canonical entry path (the 13 reserved heads are a closed list); `Design head` has blocked
  zero failures; tweak ② turns on whether a glossary term counts as an existing decision, which is the
  owner's call; and the hook line has **no settled wording** — session A read 21,889 B of `resume` to
  obtain the single line "go to product", while session B went straight to product. **Adopt when**:
  advisory, if the "no valid replacement" dead end is reached again despite gate A · `Design head`, if
  a re-landing actually causes a conflict or a loss · tweak ② and the hook wording, by owner decision.
- **The implementer brief** — the reviewer works from a 1,909 B contract and caught three real defects
  (01.1's SQLite leak, 02.1's percent-encoding bypass and async exception), while the implementer path
  reads 120,510 B for `resume+principles+work` alone. v0.18.9 left it out because **neither the material
  nor the comparison baseline exists** — a brief is authored from a closed capability document and zero
  capabilities closed, and there is no same-card full-canon run to compare against. The decision record
  must state the distinction that DR-44 rejected and deferred the **static classification** of the canon
  per consumer, while a brief is the **authoring** of a role contract. **Adopt immediately after gate B
  is green** — the material and the baseline appear together at that moment.
- **The record system — transitions evaporate** — a consumed user request is deleted along with its
  routing (in the test "make the voting anonymous" lived 2 minutes 11 seconds and vanished), a reversed
  decision's former value disappears under the overwrite (DD-77's second half unexecuted), and commit
  subjects are not structurally unique (81 commits, 55 distinct subjects). **All three fall out naturally
  as defaults of the round where the tool executes commits** — putting the first few words of the request
  line into the subject is a default for a tool, not a rule. **Adopt together with that round.** Until
  then gate B only observes the three (after a reversal, is the dropped direction beside the conclusion ·
  does an applied decision line remain in journal · can one `git log --oneline` find the transition commit).
- **The 0.18.9 agenda's second, third, and fourth items move to 0.18.10** — the tool report that `verify`
  presupposes but does not exist · the closed-folder projection that actually opens every card · the three
  exceptions to integrity item 8 that are absent from the implementation. Field firings were 0, "fired but
  harmless" (9–15% of the budget), and 0 respectively. **Adopt in the release after gate A's frame stands.**
  All three share one root — the canon asserts, the code does otherwise, and no test sits at that seam — so
  once gate A's shape exists they follow cheaply.
- **★★ Places where a clear rule went unfollowed do exist — and the diagnosis is named** — the owner's
  doubt (*"the AI may have ignored a rule that was plainly there; if so the skill design itself is in
  question"*) was classified blind by two models
  (`handoff/kl/v0188/REPORT-17-compliance-{claude,codex}.md`). **Class (c) is real** — Codex found 7,
  Claude 3 confirmed plus 2 provisional. **The counts diverged and the diagnosis did not**: "selective
  decay of non-blocking secondary obligations" / "an obligation whose result is not observed on the spot
  decays when it rides on another act." **★ The mechanical test**: outputs that carry their own commit
  were never missed across 81 commits (card status renames, task commits, `verify.md`, progress lines,
  commit message form), and **only outputs riding on someone else's commit decayed** (the digest marker,
  HANDOFF, `capability note`, the arch channel confirmation). The canon itself wires HANDOFF as a
  passenger — *"it only rides here"* (`principles:817`). **Both models rejected "the model runs ahead of
  the guidance"** — in the same record the sessions kept four rules that cost them: session A chose a
  permanent stop over a one-line edit it was forbidden to make; session B refused the conductor's wrong
  foundation verification citing the canon; the gate B session declined a fallback the browser contract
  forbids; and it skipped the whole closure procedure because the verdict was not a pass. **What fails is
  "written clearly means executed," not "the model follows rules."** devflow already owns the three
  mechanisms — blocking (integrity), observing (the clean verifier), and giving an output its own commit
  (commit discipline) — and simply never wired them to these obligations. **Adopted — v0.19.0's DD-83
  landed this observation.** The side taken is neither "structure" nor "a detector per obligation" but
  **one computation recalled at the boundaries that need it**: a read-only tool shows the difference
  between the complete transition state the canon already fixed and disk, at entry and again just before
  each commit that carries a passenger
  (`finish-boundary missing=[…]`, `claim.mine carry=…`, `layer.children-done carry=N`,
  `ready.digest-behind`). **What real use still owns**: if a session is observed failing to close the
  boundary after detection exists, a separate writer reopens then — that is DD-83's recorded condition.
- **★ Whether the record alone lets a new session take over — measured by running it** — a clean session
  was given only `devflow/` (no git, no product code, no canon) and answered eight questions, then
  reconciled against git and the code (`REPORT-15-comprehension-{claude,codex}.md`). **Claude: zero
  "wrong"** — it nearly had one at HANDOFF, and what prevented it was not the document but a manual
  comparison of card timestamps. **Codex: one "wrong"** — it followed that same HANDOFF into an
  **unreachable next step** (03.1 presumes cards exist, the product has no card creation at all, and that
  card explicitly forbids adding the card-writing UI). **The three largest gaps, each with a minimal
  repair**: the user's original request text is deleted as the marker is consumed → *one line in the card
  head, `Origin: journal:<timestamp> "<text>"`, would have covered it*; HANDOFF gives no signal that it
  has gone stale → *one line, "N cards changed after this timestamp," would have covered it*; four real
  traps live in card progress logs while all five capability documents say `None.` under `Traps` —
  **"the project with the most traps is the one structurally least able to record them"** (`Traps` sits in
  the verified zone, so it fills only once a capability closes). **All three add zero new record kinds.**
  **The two best-working things are kept**: how a block is recorded (call name, timeout value, the refuted
  hypothesis, what not to do next, the "this is not a product defect" classification) and recording the
  rejected alternative and its cost beside every decision (*"Q4 was the easiest cell in this measurement,
  because the documents left an argument rather than a conclusion"*). And **nothing inside `devflow/` says
  where a first reader should start.** **Partly adopted — v0.19.0's DD-83.** The first gap is closed by
  **projecting from existing facts** rather than by an `Origin:` field on the card (the card's creating
  commit and the request or layer-opening marker it deleted → `report: origin=…`, `none` when there was
  no original input, `unknown` with a reason on a shallow history or multiple matches) — a new field would
  be one more passenger unrelated to whether the planning commit succeeded. The third is reached by showing
  `layer.children-done carry=N` and the carry facts before closure so the model compares them against the
  capability document's `Traps`; the semantic verdict stays the model's. **Still open**: HANDOFF's
  staleness signal is watched in real use rather than given a new rule (the mechanical next action is owned
  by `ready` order, and HANDOFF carries only a fresh human preference that differs from it). And nothing
  still says where a first reader should start.
- **★ Entry density — gate B's accounting measured a whole cycle for the first time** — building a
  one-page web app as a single capability with three cards read roughly **365 KB** of canon and produced
  **13,087 B** of product code plus **34,694 B** of devflow documents across 54 commits. **What was read
  is 28× what was made, and the documents are 2.65× the code.** And **`skills/principles/SKILL.md` (891
  lines) exceeded the tool's output limit, so the session had to read it as 1–300, 301–600, 601–892** —
  a size at which the act of reading mechanically fails. Session A's observation belongs beside it: the
  `bytes=…/24576` the tool reports and the bytes a session puts into context **measure different things,
  the latter 70–180× the former**, so 0.18.7's "−83.35%" was never an answer to this question.
  **Adoption condition: measurement complete.** The subtraction round takes its target numbers from this
  accounting.
- **★ v0.18.9's two rules are deployed with no decision record** — "a verification that could not acquire
  its channel goes to a human rather than a fix card" and "when two canon rules point to different actions
  in one place, report both, name the side taken, and continue" landed in `skills/**` but **have no row in
  the decision index.** The budget collision below is why, and raising the budget is forbidden by the test's
  recorded comment. **Until then the reasons for both rules are owned by the v0.18.9 round record**
  — the field coordinates, the scope-distinction argument against DD-68, and the grounds for "continue
  rather than stop", in full. **Adopted — v0.19.0 landed both decisions together: DD-81 (channel
  acquisition failure) and DD-82 (canon against canon).** Both are introduced at v0.18.9, the release that
  actually deployed the rules, and DD-68 became `active, partly corrected by DD-81 (v0.18.9)`. The home of
  the reasons moved from the round record to the decision source, so these rules are now visible in the
  index itself.
- **★ The decision index collides with a fixed budget on a schedule** — `docs/design.md` grows one row per
  decision forever while `scripts/repository-invariants.test.js` holds it to 26 KiB. v0.18.1 raised it once
  from 24 to 26 KiB at the first collision (headroom 29 B then), and the test comment recorded *"do not raise
  these again to fit one more row"* together with the claim that **this backlog carries the structural
  answer** — yet that item had never been written here. v0.18.9 met the second collision at the two rules of
  the item above (headroom 81 B, roughly 450 B needed). The structural answer is splitting or relocating the
  index, and because it changes what "always read" means, it moves DD-71, the `AGENTS.md` entry sentence,
  protocol §3, and three tests with it. **Adopted — v0.19.0's DD-84.** The structural answer taken is
  neither splitting nor relocating but **generating**: the 80-row manual table (14,012 B) is deleted and
  `node scripts/decision-index.mjs` projects the index from the decision source. Before the table went,
  the 8-of-80 drift was merged into the source titles so the meaning loss is zero. DD-71 became
  `active, partly corrected by DD-84`, and `AGENTS.md` entry gate 1, the first wiring row, and protocol
  §3 and §8 moved with it. **What real use still owns**: the before-and-after comprehension comparison on
  clean Claude and Codex entries has not run, and whether an entry path exists that cannot call the
  generating command is still unknown.
