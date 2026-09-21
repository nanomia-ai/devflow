# Work target behavior preflight

This experiment asks whether the standalone Work target can implement one bounded result, preserve
Git and Work-state ownership across interruption, and hand off without changing the contract or
claiming a verification verdict.

Use a fresh disposable Git repository for every independent case or named interruption cut. Install
only the built project-local targets named by that case. Give the fresh session the fixture
`AGENTS.md`, the explicit target invocation, and the case prompt; do not provide this README, the
answer key, or the vNext plan.

Observe separately:

- target and reference files actually opened;
- canonical, Work, source, test, and Git reads;
- code, tests, commits, Work-state snapshots, and unrelated-byte preservation;
- custody route and one bounded next action at each cut;
- whether Work changes the spec, writes a verdict/evidence file, or invents project canon;
- whether Resume recovers from disk rather than conversation;
- delivery, behavior, and effect claims.

## Result

Verdict: **proven for the scoped Phase 4 behavior observed in fresh Codex Sol High sessions.
Delivery is reproducible; cases A, B, D, E, and F passed. Case C preserved one failed state-header
publication, its cause was repaired, and case D exercised the repaired writer contract. Verify
behavior, other hosts, and external product effect remain unproven.**

Built package evidence (Core `1.0.3`, package `0.3.0`):

- current Work tree hash `15b2846a83fc0396f7f606673b7ad89ec029572a57a5d5542ee0a4c524a3a078`;
- two independent scratch builds were byte-identical, and the installed receipt was intact and
  current;
- the generated entry retained the source markers, and both imported references matched their
  authored module bytes.

Observed case A in four independent fresh Codex Sol High sessions on the current shared-module
builds:

- ready Queue Relay Resume opened its target and gate, index, Product, Architecture, and Git;
  bounded enumeration found no immediate active state, and it returned `direct` as the one next
  route without writing;
- missing-index Resume checked every bounded active-state location, found none, read the surviving
  complete Product and Architecture, and routed `architecture` to recreate only the index. It did
  not restart bootstrap or write;
- the six-location rename Direct opened `project-gate` but not `work-state`, found exactly six
  implementation occurrences, returned `ephemeral`, and created no Work artifact or code change;
- the dirty retry-probe Direct opened both shared modules, preserved the sole inherited
  `probeWindow = 2` delta, set the clean current `HEAD` as `base_revision`, omitted
  `last_safe_point`, and published one new tracked contract to Work without committing or
  discarding the dirty byte.

Case A therefore proves the shared gate import and Direct's conditional state-module boundary on
the current Resume and Direct artifacts. The observed host scope is Codex Sol High; other hosts
remain unproven here.

Observed case B in a fresh Codex Sol High session:

- it opened the Work target, `project-gate`, the index, Architecture, Git, and exactly the six
  bounded implementation files; it did not open `work-state` or create a Work artifact;
- it changed and committed exactly the six agreed files at safe point
  `dc17924a74a908a756fb4888afa228cdbe0873a2`;
- the direct Node test, `git diff --check`, and the fixture-wide zero-`retryLimit` search passed;
- it reported the ephemeral result as `closed` with no remaining route.

Case B therefore proves the conditional module boundary and bounded ephemeral Work behavior for
this fixture.

Observed case C across independent fresh Codex Sol High sessions:

- before the implementation commit, Resume recovered base `70457771f0ee79fb6f66aefd35a14c9ddc790162`,
  reported no invented safe point, and routed the selected artifact to Work;
- Work added the bounded source and focused test, passed its checks, committed implementation safe
  point `d9a20814f85d045598de48c2d5959aed7e928e2d`, and replaced state with the Verify hand-off;
- a separate metadata publication commit `0fe26a243d2f30a20a68732841596ff4c5f19607` added the
  previously untracked spec and state without changing the implementation safe point;
- post-publication Resume correctly distinguished the implementation safe point from later clean
  `HEAD` and selected Verify, but it also detected that the state header still said the artifact was
  ready for Work while the snapshot body said `next_route: verify`;
- both valid Resume runs unnecessarily followed the Work spec's `read_first` into Product and
  Architecture. The [Resume target evidence](../resume-target/README.md) owns the resulting
  target-level repair and its current behavior status;
- an earlier attempt that selected a globally cached legacy Resume instead of the exact local target
  was stopped and excluded as harness contamination; it is not a product-behavior result.

The stale header was an actual reader-visible contradiction, not a formatting observation. The
canonical `work-state` module now requires each replacement snapshot to update `summary` and
`read_when` with the body. Direct and Work were rebuilt from that shared owner; both projected module
copies are byte-identical to source.

Observed case D in a fresh Codex Sol High YOLO session on the rebuilt Work target:

- it opened the Work target, both imported modules, index, spec/state, Product, Architecture, the
  inherited diff, bounded source/tests, and Git; it opened no plan, legacy, global, or cached skill;
- it preserved the inherited `probeWindow = 2` byte and added only
  `test/retry-policy.test.js` as focused coverage;
- `node test/retry-policy.test.js`, `node test/config.test.js`, and `git diff --check` passed;
- safe commit `5276103cd182cfc2150a8c02b0d40ceff5abccc9` contains only
  `src/retry-policy.js` and `test/retry-policy.test.js`;
- the replaced state names that commit as `last_safe_point`, routes to Verify, asks for the staging
  observation, and updates its header to describe the current Verify-ready snapshot;
- it did not perform or record the staging verdict, change unrelated configuration, or invent a
  knowledge candidate.

Case D therefore proves the promoted-dirty Work path and the repaired whole-state header contract
for this fixture. Case C's route recovery is behaviorally correct, but its original publication is
retained as failed evidence for the header contradiction.

Observed case E across independent fresh Codex Sol High YOLO sessions:

- Work found that the original spec assigned a non-reproducible staging observation and its
  evidence file to Work, did not implement or run the probe, and replaced only state with a
  self-contained `next_route: direct` amendment request;
- Direct rewrote only the selected spec as a whole. The amended contract assigns the bounded
  implementation and reproducible focused test to Work, and assigns the staging observation,
  evidence, and acceptance judgment to Verify;
- the session was intentionally cut before Direct published matching state, leaving the amended
  spec beside the prior Direct-routed state;
- fresh Resume opened only its target, `project-gate`, index, the selected spec/state, and bounded
  Git queries. It did not open Product or Architecture and changed no file;
- Resume identified that state still described the superseded Work-owned-evidence conflict while
  spec had already resolved it, refused to trust the artifact for Work continuation, and returned
  one action: Direct must reconcile spec and state and publish one consistent contract safe point.

The precommitted key expected Resume to route the interruption to `user`, but the observed
`direct` route is the more precise valid path here: the last published state had already transferred
custody to Direct, the changed spec is exactly Direct's partial publication, and no destructive or
binding choice remains for the user. A `user` route remains appropriate only when those ownership
facts do not identify the writer that must finish or reconcile publication.

Case E therefore proves the Work-to-Direct conflict handoff and interrupted whole-spec publication
recovery for this fixture. During an earlier trust
setup, one synthetic `1` plus Return may have targeted an unrelated Orca workspace before the
conflict task was dispatched. The conflict fixture was unchanged; that interaction is excluded as
a harness incident, and the observed sessions above used explicit terminal selection.

Observed case F across alternating Work and Direct sessions:

- Work produced exactly three focused implementation commits for the same artifact:
  `5ca202cb2beb8b10ad6b8fc21b9be53b772b0fe4` for the retrying shell,
  `28452b79bf37d6b9a6e90bb77d75c92b025e9be3` for the three-state comparison, and
  `e24b9ff4c01b3eed02fa945373b4ff879781bf11` for concise visible timing with all
  machine-readable datetime values preserved;
- after each slice, Work published state to Direct and Direct replaced the same spec as a whole.
  The first two successful reviews produced another bounded slice, not a Verify failure or a new
  artifact;
- the 420 px and 1280 px observations retained explicit queued, retrying, and failed meaning,
  calm failure treatment, and stable layout. The final focused check passed 4/4;
- only the third review satisfied the shaping stop condition. Direct then preserved the accepted
  decisions in one closure contract and published `next_route: verify` at the exact final safe
  commit without claiming an independent verdict;
- during slice two, one editor temporarily left the two implementation files empty before
  immediately rewriting them. No empty byte reached a safe commit, the final render and checks
  passed, and the next session recovered from disk. This is retained as an editing incident, not a
  target-contract failure or grounds for another rule;
- simulated verified closure removed `W-delivery-card-5c8a2f` and committed the index's
  no-active-Work state at `23436ebe04f3720570434d0f528c818c4dcca3c3`. A fully fresh Direct
  session then classified a new narrow-gap follow-up as tracked and created
  `W-tighten-mobile-card-gap-6316d92859`; it did not search for, recreate, or reuse the closed
  artifact and did not touch implementation bytes;
- an earlier follow-up attempt is excluded because the simulated closure's index edit was still
  dirty and leaked into the new spec as an unrelated inherited delta. Committing the closure
  fixture before the fresh rerun removed that harness contamination.

Case F therefore proves the three-review shaping loop, delayed Verify hand-off, and fresh
ephemeral/tracked decision after closed Work for this fixture. Complete state snapshots appeared as
both plain and fenced YAML mappings across the observed fixtures and agent outputs, and readers
recovered the same fields and routes from both. Truncation behavior remains a Phase 5 test variable,
not a demonstrated format defect or a reason to change the shared module now.

Verify behavior and external product effect remain unproven.

Delivery is reported only after two equal builds, receipt inspection, integrity/currentness checks,
and source-to-generated projection checks. Behavior is reported per case after fresh sessions.
External product effect remains unproven unless a case directly observes it.

## Canonical landing and active-Work decision return

Two bounded fresh-use scenes used independent Git repositories and project-local generated skills:

- Work integrated two independently verified eligibility outcomes into the existing Lending Domain
  path, ran the existing test, committed the canonical change, and removed the completed artifact.
  It did not create a new business rule, Domain, or canonical path.
- In the final custody fixture, Verify passed both project tests, proved two behavioral criteria and
  kept the unresolved technical criterion `unproven`: `verification.md` named `architecture` as the decision owner while Work
  state named `direct` as custody. Resume initially collapsed those meanings and reported
  `architecture`; after rule 5 was narrowed at its existing source location, a new session reported
  `direct` and left the project unchanged.
- Direct returned one Architecture question without changing the Work artifact. Architecture
  changed only its canon and returned through its ordinary `direct` route. Direct then reconciled
  the changed canon with the existing spec and verification, amended the Work contract, removed the
  stale verification, and published `work`. A final Work session moved retry ownership to the queue
  worker, passed all four tests, committed a safe point, and published `verify`.

The earlier receiver fixture, in which Architecture directly changed Work state from `architecture`
to `work`, records a superseded intermediate design and is not evidence for the final custody model.
The first Direct fixture also reduced an unresolved Architecture question to a write-boundary choice;
because its `next_action` omitted the required decision route, that observation is excluded. Product,
Design, Adopt, Sketch and user-answer broker paths were not executed. The exact interruption behavior
between stages and behavior on other hosts or models remain `unproven`.

## Reopen boundaries

- A module skipped by a fresh agent is a failed delivery-to-behavior boundary, not a reason to add a
  checker automatically.
- A state formatting difference is an observation until it changes a reader's action.
- Verification preparation, criterion verdicts, and closure landing remain Phase 5 behavior even
  though Work's entry must safely route to them.
- Team-member hand-off and multi-worktree integration remain later-phase behavior.
