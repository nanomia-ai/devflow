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

## On hold — candidates for coming versions

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
