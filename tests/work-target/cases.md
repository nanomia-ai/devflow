# Work target precommitted cases

These answer keys are fixed before the fresh sessions. A different result is accepted only when it
preserves the same owner, contract, and observable next action; otherwise it is a failure.

## A. Shared gate and conditional state-module regression

### Prompts

1. Run Resume in the ready Queue Relay fixture and report the current position.
2. Run Resume in a copy whose `.devflow/index.md` is absent but whose Product and Architecture
   survive.
3. Run Direct for the six-location `retryLimit` to `maxAttempts` rename from Direct case 2.
4. Run Direct for the promoted dirty retry probe from Direct case 3.

### Answer key

- Required reads: every run opens its project-local target and `references/project-gate.md`.
  Resume follows only its bounded orientation reads. Direct case 3 additionally opens
  `references/work-state.md`; Direct case 2 does not.
- Forbidden reads/writes: no legacy or plan reads; Resume writes nothing; the ephemeral Direct case
  creates no Work artifact; neither target recursively inventories project knowledge when the index
  is readable.
- Expected action: ready Resume reports no active Work and the foundation-derived next route;
  missing-index Resume inventories all bounded active-state locations before naming recovery;
  ephemeral Direct returns the same-turn action; tracked Direct publishes a recoverable contract
  whose dirty bytes are not a safe point.
- Reason: `project-gate` is now the one gate owner, while `work-state` is conditional on an actual
  tracked contract.

## B. Ephemeral same-turn implementation

### Prompt

Use Work to perform the already-agreed mechanical rename `retryLimit` to `maxAttempts` in the six
known source, test, and configuration locations. Run the direct test and confirm no old key remains.
The change has no durable-knowledge, independent-verification, interruption, or coordination need.

### Answer key

- Required reads: Work target, `references/project-gate.md`, index, relevant Product/Architecture
  routing context, six search hits, current Git status, and the direct test.
- Must not read: `references/work-state.md`, unrelated project canon, any Work artifact, plan, or
  legacy.
- Expected writes: exactly the six agreed locations and no `.devflow/work/` directory.
- Expected next action: run the focused test and zero-old-key search, then report `closed` in the
  current session without a state, commit requirement, or Verify route.
- Reason: all persistence questions remain false; Work accepts an agreed ephemeral goal and check.

## C. Tracked implementation and interruption around a safe commit

### Prompt

Implement the selected config-validation Work contract. At the named cuts, stop before the first
implementation commit and after publishing the safe commit but before Verify. A fresh Resume session
must recover each cut from disk.

### Answer key

- Required reads: Work target, both imported modules, index, selected spec/state, its `read_first`,
  current Git status/diff, and the bounded implementation/test files. Resume opens the gate module,
  index, selected spec/state, and Git evidence only.
- Must not read or write: unrelated domains; Work does not amend spec or write verification;
  Resume writes nothing.
- Expected writes: source and focused test only; a focused commit after checks; state replaced with
  the commit as `last_safe_point`, `next_route: verify`, and one bounded verification action.
- Expected recovery: before the commit, Resume reports `continue` with Work and no invented safe
  point. After publication, Resume reports the actual safe commit and `verify` route.
- Reason: Git owns bytes, spec owns intent, and state owns the latest safe coordinate.

## D. Promoted dirty work

### Prompt

Take custody of the inherited `probeWindow = 2` dirty delta. Preserve it, add only the focused
automated coverage required by the amended contract, establish the first safe commit, and hand the
result to Verify without performing the staging acceptance observation.

### Answer key

- Required reads: Work target, both modules, index, spec/state, Product, Architecture, the inherited
  diff, relevant retry/config code and tests, and Git.
- Must not do: discard or recreate the dirty delta, call it a preexisting safe point, write a
  staging evidence file, change unrelated configuration, or claim the acceptance verdict.
- Expected writes: the inherited source delta plus directly relevant automated test; one focused
  safe commit; state with that commit and `next_route: verify`.
- Expected next action: Verify independently runs the reproducible checks and the staging
  observation required by acceptance.
- Reason: promotion transfers dirty bytes into the tracked write boundary; acceptance evidence is
  Verify-owned.

## E. Contract conflict and safe amendment hand-off

### Prompt

The selected spec tells Work to save non-reproducible staging output in an extra evidence file under
the Work folder. Determine whether implementation may proceed. After Work hands off, run Direct to
amend the spec; interrupt immediately after the spec whole-file write and ask a fresh Resume for the
safe next route before Direct publishes the matching state.

### Answer key

- Required reads: Work and both modules, selected spec/state, Git, then Direct and its two modules;
  Resume reads its gate, bounded state/spec, and Git at the interruption.
- Must not do: create an undeclared evidence file, silently ignore the clause, implement past the
  safe point, let Direct amend while Work retains custody, or have Resume repair either document.
- Expected hand-off: Work publishes `next_route: direct` with the exact conflicting clause and
  decision. Direct changes the spec so Work prepares the implementation and Verify performs and
  records the acceptance observation.
- Expected interruption result: because spec and state disagree during publication, Resume reports
  reconcile and routes the ambiguous custody decision to `user`; it does not guess current.
- Reason: a spec cannot reassign evidence or custody ownership, and amendment publication is not
  atomic across sibling files.

## F. Three-review shaping journey and closed follow-up

### Prompt

Use the shaping fixture to implement three bounded visual slices. After each visible result, collect
the supplied user review and hand custody to Direct so it replaces the same spec with the next slice.
Only after the third review satisfies the stop condition may Work route to Verify. After simulated
verified closure removes the Work artifact, direct a follow-up improvement.

### Answer key

- Required reads: each actor's target and modules; index; the same spec/state; Design and the named
  surface; current source, test/review channel, and Git. Direct rereads the review signal before each
  whole-file amendment.
- Must not do: create a new artifact per slice, call a successful review a Verify failure, amend
  under Work custody, route to Verify before the stop condition, or recreate the deleted spec for
  the follow-up.
- Expected writes: three focused slice commits; state hand-offs Work -> Direct -> Work around each
  amendment; one evolving spec; final `next_route: verify` only after review three.
- Expected follow-up: Direct makes a fresh ephemeral/tracked decision from the new request and
  current canon.
- Reason: shaping refines one stable closure; a closed artifact is history in Git, not a reusable
  task container.
