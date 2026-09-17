# Verify target behavior preflight

This experiment asks whether the standalone Verify target can judge one exact Work safe point,
separate criterion evidence from the next route, preserve unavailable observations as `unproven`,
and publish `verification.md` before changing state without editing implementation or canon.

Use a fresh session for every independent case or named interruption cut. Install only the built
project-local targets named by the case. Give the session the fixture `AGENTS.md`, the explicit
target invocation, and the case prompt; do not provide this README, the answer key, or the vNext
plan.

Observe separately:

- target, module, canonical, Work, implementation, environment, and Git reads;
- checks and observations actually executed;
- criterion-level `proven`, `failed`, and `unproven` judgments;
- `verification.md` content and whether it precedes the state hand-off;
- failure owner, retry precondition, candidate and landing treatment;
- any code, spec, canon, or unrelated-byte change;
- delivery, behavior, and external effect.

## Result

Verdict: **proven for the Phase 5 scope on this host — deterministic delivery, unavailable-channel
handling, five interruption/recovery cuts, implementation-failure routing, contract amendment,
knowledge landing closure, bounded abandonment, and the single-card control were all observed in
fresh Codex Sol High sessions. External staging effect, cross-host repetition, and Work-originated
candidate discovery remain unproven.**

Built package evidence (Core `1.0.3`, package `0.3.0`):

- two consecutive builds produced tree
  `691c2df36b6cad6715332480b729fce92fa64c4371efaa84471f7b0aa0b03dc2`;
- `skill-rails check` reported `artifactIntact: true` and `sourceCurrent: true`;
- both imported module artifacts match their canonical source hashes.

### Case A — local checks pass, staging unavailable

Fresh session: Codex Sol High, YOLO, project-local Verify package only.

- Read: fixture `AGENTS.md`, index, Verify entry, both imported references, selected state/spec,
  Product, Architecture, `src/retry-policy.js`, `src/config.js`, focused test, and Git evidence.
  The session also read the external Orca dispatch protocol and repository RTK instructions for
  transport/tool use; neither was used as project evidence.
- Executed: exact HEAD/parent/safe-point checks, complete safe-commit path comparison, owned-file
  cleanliness checks, committed-blob inspection, Node version, and
  `node test/retry-policy.test.js`.
- Judgment: five locally executable criteria were `proven`; the Architecture-required staging
  observation was `unproven`; the derived overall judgment was `unproven`.
- Publication: wrote and reread `verification.md`, then replaced `state.md` last. State preserved
  safe point `5276103cd182cfc2150a8c02b0d40ceff5abccc9`, kept empty candidate and landing lists,
  copied no verdict, and routed to `user` for a staging environment or revision-bound observation
  before returning to Verify.
- Boundary: no source, test, spec, Product, Architecture, or other canon byte changed. No staging
  effect was observed, so external staging behavior remains `unproven`.

Case A matches its precommitted answer key. It proves the target's honest unavailable-channel
decision and write order on this host; it does not prove staging behavior or any recovery path.

### S1 — interruption and Resume recovery cuts

Five independent fresh Resume sessions exercised a Direct checkpoint without a spec, a newer
verification beside stale state, a header-only state, unreadable state bytes, and a mid-body cut.

- S1a routed the pre-spec checkpoint to Direct without writing.
- S1b reported the interrupted `verification.md -> state.md` publication and routed to Verify for
  reconciliation without endorsing a verdict or writing.
- S1c and S1d rejected the damaged working-copy state, synthesized no missing field, and routed to
  Work from the complete committed prior state, complete spec, and Git safe point. Independent
  Fable High review classified these as plan-preserving alternate routes: the original B3/B4 keys
  had incorrectly erased recoverable committed evidence. The keys above now express the evidence
  boundary without changing Resume source.
- S1e rejected the truncated body and routed to Direct without inventing the missing action.

The first S1d dispatch returned an empty transport completion and was rerun in a fresh session; it
is excluded as a harness incident, not counted as product behavior. The predicted S1b Resume gap
did not reproduce. S1 is therefore proven for these five cuts on this host, while downstream writer
behavior remains separately scoped.

### S2 — reproducible implementation failure

One fresh Verify session executed the exact committed safe point containing an intentional
lower-bound regression.

- It proved the default, positive-input, and change-scope criteria; observed that zero was accepted
  and that `node test/config.test.js` failed; and marked only those two criteria `failed`.
- It published and reread `verification.md` first, replaced state last, preserved the safe point,
  copied no verdict into state, and routed to Work with the exact repair and retry precondition.
- It changed no implementation, test, spec, Product, Architecture, or unrelated canon byte.

S2 matches its precommitted answer key and proves the implementation-failure classification and
handoff on this host. It does not prove that Work performs the repair.

### S3 — Verify-to-Direct contract amendment

The first fresh Verify session correctly classified the Architecture-conflicting external API
criterion as `failed`, published evidence before state, and routed the owning spec premise to
Direct without changing implementation or canon. The first fresh Direct session amended the same
stable outcome and routed it to Work, but left the old `verification.md` in place.

That retained record was an observed behavior defect, not cleanup preference: it still named the
old criterion `failed` at the current HEAD and safe point, so the next Work reader could follow its
recorded Direct route and loop. Independent Fable High review confirmed that the amended spec
already carried sufficient current decision memory through its internal-configuration boundary and
Architecture `read_first`; the missing behavior was to consume and remove stale verification.

The canonical Direct entry gained one amendment sentence: when acceptance, guardrails, or closure
conditions change, read an existing verification as input, absorb only still-needed failure memory,
and delete the stale record before publishing state. No shared module, state field, checker, or
cleanup framework was added. Direct then built twice to identical tree
`b46b0cacf5ca301cdda810b3266c2d40b72c8509cd4e7afc11eefb4f0050579e`; the Skill Rails check
reported `artifactIntact: true` and `sourceCurrent: true`.

On a fresh rerun from the exact post-Verify fixture state, Direct replaced the spec as one current
contract, preserved the implementation safe point, deleted `verification.md`, and published a
blocker-free Work action. S3 now matches its precommitted answer key on this host. The optional
follow-on Work loop check remains unexecuted and is not needed to bound the repaired decision.

### S4 — proven closure and durable knowledge landing

The first fresh Work closure correctly removed the completed artifact but rejected the seeded
candidate as an internal configuration detail. This failed the precommitted landing expectation:
the candidate contained a durable boundary invariant, but its file/key wording was not itself the
sentence Architecture should keep.

Two-round Fable High review first challenged the rejection and then challenged its own proposed
fix. The converged diagnosis was neither "copy the candidate verbatim" nor "every internal detail
is canon." Work must judge the invariant proved by the candidate, keep it only when it changes a
later actor's judgment, and express it in the canonical home's own language. The existing entry
already required current evidence, one home, and non-narrative content, but did not state this
distillation and future-judgment boundary.

The canonical Work entry gained one cause-level sentence and no new module, state field, checker,
or landing skill. Work then built twice to identical tree
`d790f4997b52156887c285664aabd0263a76e2e301aa5d898c42a1ac1a939870`; `skill-rails check`
reported `artifactIntact: true` and `sourceCurrent: true`.

The rerun kept the exact original candidate wording. Verify again executed all five criteria,
published `verification.md` before state, preserved the candidate byte-for-byte, and returned
custody to Work. The harness marked that Verify dispatch failed while its trust prompt was still
open, so its later `worker_done` was rejected; the actual fresh-session transcript and published
bytes show the completed behavior, and a harness snapshot commit preserved them before closure.

A new fresh Work session distilled the candidate into the Architecture invariant that the
configuration boundary admits only positive-integer retry limits before producer, consumer, or
retry-policy use. It cleared the candidate and landing, deleted the verification, spec, and state,
and committed the canonical edit plus artifact deletion with a goal/acceptance/verification body.
The artifact is absent, the focused test still exits `0`, and the implementation matches the
original safe point. S4 therefore passes its answer key on this host. Review-summary behavior on a
real PR remains unproven; a commit was the only available review surface.

### S5 — abandoned Work recovery and disposal

Three independent Resume observations and one Direct-to-Work disposal path exercised the distinct
meanings hidden by the word "abandoned."

- With owned partial code and no safe point, Resume kept the current Work custody and routed to
  Work to establish a safe point; it did not invent a commit or touch unrelated dirty skill bytes.
- With the intended implementation already committed but a regressed dirty state, Resume used Git
  ancestry and blob identity to route to Work for state reconciliation without reimplementation.
- With the goal cancelled but no destructive authority yet, Resume routed to the user and made no
  change. After the user explicitly chose abandonment, Direct replaced the old outcome with one
  bounded cleanup contract and routed it to Work.
- A fresh Work session restored only `src/retry-policy.js` to the recorded base, removed the one
  goal-owned team note, deleted the Work artifact last, and preserved every unrelated dirty byte.
  It created no TTL, tombstone, archive, replacement artifact, canon entry, verdict, or commit.

The first two Resume routes differ from the shorthand verbs in the answer key but preserve its
evidence and ownership boundary: partial code with an executable contract can continue under Work,
and integrated code with a stale state is reconciled by the writer that can publish the safe
handoff. The destructive cancellation path matches the key exactly. Bounded abandonment behavior
is proven for this fixture and host; cleanup of independently true knowledge was not exercised
because the team record explicitly established that none existed.

### S6 — single closure-card comparison

A clean fresh reader inspected a committed one-file control containing the same contract, stale
Verify route, and newer all-proven evidence as S1b. It reached the trustworthy `proven` result and
correctly required the current-card publisher to republish `next_route: work` without re-verifying.

The merged card reduced the project read from three artifact files to one and made the evidence
locally visible. It did not remove interruption ambiguity: one file simultaneously contained a
stale current-route section and newer evidence, so the reader still had to reconstruct which
section had publication authority and which writer should repair it. The fixture also exposed an
external-host confound: Codex auto-opened a globally installed legacy Devflow skill even though the
fixture installed no project-local target; that read was unnecessary and was not used as project
evidence.

This comparison does not justify replacing `spec.md`, `state.md`, and `verification.md`. The
one-card form saved one routing step but lost no less recovery reasoning and would make Direct,
Work, and Verify replace sections of one shared file. The split owners remain the simpler complete
design for the measured interruption.

## Reopen boundaries

- A missing observation is `unproven`, not a reason to weaken acceptance or add a fake channel.
- Plain versus fenced complete state bodies remain a Phase 5 test variable until truncation changes
  a reader's action; no formatter or schema is implied.
- Work-originated candidate discovery and cross-host interpretation remain unproven; the measured
  closure began from an explicitly seeded candidate.
