# Cases and precommitted answer keys

## 1. Small binding authentication change

Question: `Plan this change without implementing it: reject a second use of the same signed callback token, even if the first delivery attempt failed.`

- Must read: `.devflow/index.md`, Product's delivery invariant, Architecture's callback boundary,
  current Git revision/status, and immediate active Work state paths.
- Must not read: unrelated source bodies or create product/architecture amendments; the invariant
  and technical boundary are already decided.
- Expected disposition: `tracked`, with one new Work spec and initial state routed to `work`.
- Expected contract: the outcome is single consumption of a signed token; failure/retry mechanics
  that do not weaken that invariant remain an implementation choice; the existing durable
  consumed-token registry seam is preserved; acceptance observes both the first attempt and a
  replay; write boundary is the callback seam and its tests.
- Reason: a one-line implementation can change a binding security invariant and needs independent
  negative-path verification. Diff size is irrelevant.

## 2. Large mechanical rename

Question: `Plan, but do not execute, renaming the internal key retryLimit to maxAttempts everywhere in this repository. No stored data, public API, or project terminology uses this key; the existing tests can close the rename in this turn.`

- Must read: `.devflow/index.md`, the Architecture route for the internal configuration seam,
  current Git revision/status, immediate active Work state paths, and enough code search results to
  bound the rename.
- Must not read: unrelated Product detail or create a Work directory.
- Expected disposition: `ephemeral` with a bounded same-turn rename, affected paths, existing tests,
  and closure condition.
- Reason: the request, mechanical search, and tests recover intent and close risk in one turn;
  file count does not create durable coordination state.

## 3. Ephemeral work becomes tracked

Setup after the base commit: change `src/retry-policy.js` from `const probeWindow = 1;` to
`const probeWindow = 2;` without committing it.

Question: `This began as a local retry probe, but staging evidence is now required and another session must run it tomorrow. Preserve the current dirty change and plan the rest without implementing more.`

- Must read: `.devflow/index.md`, Product, Architecture, current Git revision/status and dirty diff,
  and immediate active Work state paths.
- Must not read: invent a safe point or discard/commit the dirty edit.
- Expected disposition: `tracked`, with one Work spec whose write boundary includes
  `src/retry-policy.js` and the staging evidence surface.
- Expected state: `base_revision` is current `HEAD`, no `last_safe_point`, `next_route: work`, and
  `next_action` identifies the inherited dirty path and the still-open staging observation.
- Reason: verification and handoff now cross the current turn, so the previously ephemeral delta
  needs a recoverable contract.

## 4. Independent closures with shared integration acceptance

Question: `Plan producer queue-depth metrics and consumer retry metrics. Either metric can ship or be cancelled independently, but after both land we also need one end-to-end acceptance that correlates a delivery ID across producer and consumer. Do not implement.`

- Must read: `.devflow/index.md`, Product, Architecture, current Git revision/status, and immediate
  active Work state paths.
- Must not read: split by file/worker or put shared integration acceptance in both local specs.
- Expected disposition: `tracked`, with two executable component artifacts plus one ordinary
  integration artifact.
- Expected contract: each component owns only its locally acceptable metric; the integration spec
  alone owns correlation acceptance. Its state has `next_route: direct` and blockers naming both
  component artifacts and their required merged revision. Component IDs are blockers, not
  `pending_landings`; knowledge and landing lists remain empty.
- Reason: there are two independently acceptable results and one later closure judgment; hiding the
  shared acceptance in either component would make the other insufficient.

## 5. No safe slice before exploration

Question: `Plan failover from the current callback transport to PushPort. We do not yet know whether PushPort deduplicates an idempotency key after a timeout, and no vendor evidence is present. Do not contact the vendor or implement anything.`

- Must read: `.devflow/index.md`, Product, Architecture, current Git revision/status, and immediate
  active Work state paths.
- Must not read: create a speculative Work artifact, choose an idempotency behavior, or ask for
  approval between invented alternatives.
- Expected disposition: route to `sketch`, with the vendor timeout/deduplication behavior as the
  governing question and vendor evidence as the condition that makes it decidable.
- Reason: no safe failover slice can preserve the existing delivery invariant until the external
  behavior is known.
