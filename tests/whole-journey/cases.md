# Whole-journey precommitted case

This case attacks one claim: a foundation written by fresh Product and Architecture sessions can
carry one real change through Direct, Work, Resume, Verify, and Work closure on the same evolving
`.devflow/` tree. It is one journey, not another per-target matrix.

## Fixed starting point

Use a disposable copy of the Incident Relay fixture after its Product and Architecture sessions.
Its Product, two Domain parents, Architecture, and index are current. Design does not apply. Install
the current nine built targets project-locally and commit that harness-only installation before the
journey. Do not seed a Work artifact, implementation, test, or later state.

## User request

Deliver the first persistence-independent Incident lifecycle slice. Given submitted events, the
domain operation must open an incident when none is open for the service/fingerprint pair, join a
matching open incident, keep an acknowledged incident open, and after resolution open a new
incident for the same pair. Use Node 24 and `node:test`. Do not add HTTP, SQLite, routing-policy,
provider, or deployment behavior in this slice, and do not claim that the in-memory test seam
proves durable uniqueness.

## Expected journey

1. **Direct** reads the current foundation and Git, classifies the request as tracked because an
   independent Verify session remains, and creates one self-contained Work spec/state pair with a
   bounded domain-and-test write surface. It does not implement.
2. **Work** reads that contract and relevant canon, implements the smallest slice, runs the focused
   test, commits a safe point, and publishes `next_route: verify`. It does not write a verdict.
3. **Resume** starts with no transcript, reads the current artifact and Git, reports exactly the
   same `verify` route and one bounded verification action, and writes nothing.
4. **Verify** executes every acceptance criterion at the exact safe point, writes
   `verification.md` before state, records honest criterion-level verdicts, and routes an all-proven
   result to Work closure. If implementation actually fails, it routes to Work without weakening
   the contract; the journey may continue only within the five-session ceiling.
5. **Work closure** reads the evidence, rejects code-path trivia as project knowledge, lands only a
   genuinely new durable fact if one arose, removes the Work directory itself, leaves Product,
   Domains, Architecture, and index coherent, and commits a clean closure.

## Pass, fail, and stop

- `proven`: the same tree reaches clean closure and each actor uses the prior actor's published
  files without transcript reconstruction or duplicated project truth.
- `failed`: an actor follows a stale index route, cannot consume the prior state, changes another
  owner's document, leaves contradictory current artifacts, or needs an undeclared manual repair.
- `unproven`: the five-session or 30-minute ceiling arrives, the host cannot run a session, or a
  required observation is unavailable.

Do not repair source prose during the journey. Preserve the exact failure and return to its one
owner only after classification. Do not add a checker, schema, renderer, template, or new state
field from this single run.
