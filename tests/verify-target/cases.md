# Verify target precommitted cases

These keys are fixed before each fresh session. A different route is acceptable only when it
preserves the same evidence, owner, and retry condition.

## A. Reproducible checks pass but the required staging channel is unavailable

### Prompt

Independently verify the selected retry-window Work safe point. The session has the repository and
local Node channel, but no staging environment or preserved staging observation. Execute every
available criterion and publish the honest current judgment without changing implementation,
contract, or canon.

### Answer key

- Must read: Verify target, `project-gate`, `work-state`, index, selected state/spec, its Product and
  Architecture reads, exact safe-point code/tests, and Git revision/status/diff.
- Must not do: edit code/tests/spec/canon, invent staging evidence, mark the whole result proven,
  copy verdicts into state, or add a knowledge candidate for code paths and test output.
- Expected evidence: the inherited `probeWindow = 2`, retry-boundary behavior, focused test, safe
  commit, and unrelated-byte criteria are judged from current execution and Git evidence. The
  staging acceptance remains `unproven` with the missing environment as its reopen condition.
- Expected publication: write one current `verification.md` first, then replace state while
  preserving the implementation safe point and empty candidate/landing lists.
- Expected next action: route to `user` or the exact owner of the staging channel to supply and run
  the missing observation against the same revision; do not route to Work because no implementation
  failure was observed.
- Reason: reproducible local success cannot substitute for a required external observation.

## B. Read-only recovery cuts

Each variant starts in a separate copy of the same committed fixture and is given only to a fresh
Resume session. The damaged bytes are authored test inputs; they do not prove that Direct or Verify
actually wrote them.

### B1. Direct checkpoint exists but the spec does not

- Input: one readable state with `next_route: direct` and `next_action` to finish that exact
  contract; sibling `spec.md` is absent.
- Must read: Resume target and project gate, index, the selected state, bounded Work paths, and Git
  evidence. The absent sibling may be tested for existence but cannot be invented.
- Expected judgment: the artifact is not executable or current; route to `direct` to finish the
  same contract. Do not route to Work or write a repair.
- Reason: the minimum state is a recovery checkpoint, not a complete execution contract.

### B2. Verification is newer than a stale Verify route

- Input: a complete `verification.md` for the exact safe point beside the older state whose
  `next_route` is still `verify`.
- Must read: Resume target and project gate, index, selected state/spec/verification, and Git safe
  point evidence.
- Expected judgment: report publication interruption and `reconcile -> verify`; do not infer the
  current verdict, route to Work, or modify either file.
- Reason: verification was published, but the state commit point did not make that evidence
  current.

### B3. Header-only valid prefix

- Input: `state.md` contains a valid `summary/read_when` header and no state body.
- Expected judgment: required state fields are absent, so it is not current; report the
  inconsistency and do not treat the summary as state. When the committed prior state, complete
  spec, and Git safe point identify the plan-owned reconstructing writer, routing to `work` is a
  valid recovery. Route to `direct` only when the spec is incomplete, and to `user` when custody
  remains genuinely ambiguous.
- Pass rule: synthesize no missing field, cite the committed prior state and Git evidence used to
  recover ownership, and choose only a writer justified by those bytes.
- Reason: a readable header is relevance metadata, not a recoverable coordinate, but damage to the
  working copy does not erase a complete committed contract.

### B4. Unreadable state bytes

- Input: `state.md` cannot be parsed or read as a current state contract while spec and Git remain
  available.
- Expected judgment: do not guess custody or a current action; report the inconsistency. When the
  committed prior state, complete spec, and Git safe point identify the plan-owned reconstructing
  writer, routing to `work` is a valid recovery. Route to `direct` only when the spec is incomplete,
  and to `user` when custody remains genuinely ambiguous. Resume remains read-only.
- Pass rule: synthesize no damaged field, cite the committed prior state and Git evidence used to
  recover ownership, and choose only a writer justified by those bytes.

### B5. Mid-body required-field cut

- Input: the fixture's native state representation stops after `base_revision` and `next_route`;
  required `next_action` and `blockers` are absent.
- Expected judgment: not current; reconcile rather than synthesizing the missing action from the
  spec. A representation-specific rule is not expected.
- Reason: this distinguishes a realistic write cut from an empty body without adding a second
  fence-shape case.

## C. A reproducible acceptance failure belongs to Work

### Prompt

Independently verify the selected safe point. Execute the current acceptance contract exactly as
written; do not repair the implementation or weaken the criterion.

### Answer key

- Input: an exact committed safe point whose focused test reproducibly fails one implementation
  criterion while the contract and architecture remain sound.
- Expected evidence: the failed command, observed result, exact revision/environment/channel,
  `failed` criterion, broken implementation premise, and retry condition.
- Expected publication: write `verification.md` first, then state last without a verdict copy.
- Expected next action: `next_route: work` to repair the implementation/test at the same contract
  boundary, then return to Verify.
- Must not do: fix code/tests, change spec or canon, call the result `unproven`, or route to Direct
  merely because verification failed.

## D. Contract failure followed by amendment

This is one root and two fresh sessions: Verify, then Direct. Direct receives only the artifact
published by Verify, not this answer key.

### D1. Verify classifies a contract defect

- Input: implementation and Architecture agree, but one spec acceptance criterion contradicts the
  Architecture boundary.
- Expected judgment: record the affected criterion as `failed`, route to `direct`, name the spec
  premise that must change, and leave implementation/canon untouched.

### D2. Direct publishes the current amended contract

- Must read: Direct target, project gate, work-state contract, index, selected state/spec,
  `verification.md`, Architecture, and Git evidence.
- Expected change: replace the spec as one current contract, retain only failure memory still
  needed to explain the current decision, delete stale `verification.md`, and publish state to
  `work` with one bounded action.
- Must not do: preserve the old verdict as current, append amendment history, change Architecture
  to satisfy the bad criterion, or create a new artifact ID.
- Reason: changed acceptance invalidates the earlier verification while the stable outcome remains
  the same closure.

## E. Abandoned Work recovery and disposal

The three roots are authored reader inputs. They test different meanings and remain separate.

### E1. Partial code, no safe point

- Input: an owned dirty implementation path, state routed to Work, and no `last_safe_point`.
- Resume expectation: report that continuing or abandoning requires disposition of the owned dirty
  bytes; never invent a safe commit or silently choose destructive cleanup.

### E2. Code integrated, stale state remains

- Input: the intended implementation is already committed/integrated, but state still routes to
  Work as if implementation were pending.
- Resume expectation: report `reconcile`; do not route to reimplement the already integrated
  result or delete the artifact itself.

### E3. User cancels the goal

This root uses three fresh sessions: Resume, Direct, then Work.

- Resume expectation: report abandon as the possible disposition and route to the user for the
  destructive or ambiguous decision; make no write.
- Direct prompt input: the explicit user decision to abandon the goal and keep nothing
  goal-specific. Expected action: dispose the goal/spec meaning and publish a blocker-free
  `next_route: work` cleanup action.
- Work prompt input: only Direct's published state. Expected action: revert partial code only as
  approved, preserve or land only facts true independently of the cancelled goal, discard
  goal-specific candidates/pending landings and bounded team files, then delete the artifact.
- Must not do: create a TTL, automatic deletion policy, permanent abandoned tombstone, preserve
  failure narrative, or treat cancellation as successful closure.

## F. Proven result lands one durable fact and closes

This is one root and two fresh sessions: Verify, then Work. The starting candidate is an explicitly
seeded test input and is not evidence that an earlier writer discovered it.

- Input: a safe commit satisfying every criterion and one state candidate for a durable runtime
  fact that Architecture does not yet state.
- Verify expectation: execute every criterion, publish all as `proven`, record evidence supporting
  the durable fact, preserve the candidate, and route to Work for closure.
- Work expectation: judge the candidate, turn only the confirmed current fact into one
  `fact -> project/architecture.md` pending landing, land it without duplication, clear the
  landing, and delete the artifact/member files when no blocker or candidate remains.
- Review surface: if none exists in the throwaway repository, report review-summary behavior as
  `unproven`; do not manufacture a PR or review record.
- Must not do: leave the completed spec as canon, copy verdict into state, or delete before the
  landing is confirmed.

## G. Single closure-card control

- Input: the B2 interruption scene expressed in one merged Markdown card containing contract,
  current route, and verification evidence; no Devflow target is installed.
- Ask a fresh reader for the current trustworthy result and next action.
- Compare with B2: files and bytes read, facts that two writers would need to replace, ambiguity
  after an interrupted write, and recovery steps.
- This case produces a comparison, not a `proven`/`failed` verdict for the split design. It changes
  the design only if the merged card is materially better without losing owner or interruption
  meaning.
