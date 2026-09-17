# Whole-journey observation

This evidence tests one practical claim on one evolving repository: foundation written by prior
Product and Architecture sessions can carry a real change through Direct, Work, Resume, Verify,
and Work closure without transcript reconstruction or durable-memory damage. The precommitted case
and stop conditions are in [cases.md](cases.md).

## Verdict

The precommitted routing, custody, and clean-removal claim is **proven**. Five independent Codex
`gpt-5.6-sol` high-reasoning sessions reached a clean tree in 23 minutes 23 seconds, inside the
five-session and 30-minute ceilings. Every stage selected the current canonical Work home and the
next owner from disk. No Devflow source, plan, foundation document, or index byte was repaired
during the run.

One closure guarantee discovered while reviewing the resulting Git history is **failed**. The
closure actor deleted the ephemeral verification record but left only the subject `Close verified
incident lifecycle work` in commit `9e83a90`; it did not leave the short goal, acceptance, and
verification summary required by `plan/08-document-contracts.md` lines 293-294 and the current Work
entry. The same omission appears in prior fresh closure `0d49f7b`, while control closure `15a278f`
contains all three parts. This is a repeated current-prose behavior failure, not a reason to revoke
the independently observed routing and custody result.

That failure has now received one bounded repair and fresh-use retest. The canonical Work entry
names the closure commit message directly, Work was rebuilt twice to the same tree hash, and a new
Codex `gpt-5.6-sol` high-reasoning session created commit `21185ec` with explicit Goal, Acceptance,
and Verification paragraphs before deleting the evidence. The repaired closure behavior is
therefore **proven for this focused fixture**; broader host and PR-only behavior remains unproven.

This does not make the whole release proven. Clean installed-host behavior and hook effect remain
`unproven` in [host-delivery evidence](../host-delivery/README.md).

## Fixed fixture and request

The disposable repository was
`.tmp/whole-journey/incident-relay`. Product and Architecture were existing session outputs; the
current nine built skills were installed project-locally and committed as `0fdfcd6`. No Work
artifact, implementation, or test was seeded.

The request was the first persistence-independent Incident lifecycle slice: open or join by the
monitored-service/fingerprint pair, keep acknowledgement open, and open a new incident after
resolution, using Node.js 24 and `node:test`. HTTP, SQLite, routing policy, providers, deployment,
and durable-uniqueness claims stayed out of scope.

## Observed chain

| Fresh actor | Actual reads that determined the route | Writes and safe point | Judgment |
|---|---|---|---|
| Direct | local Direct entry, `project-gate`, `work-state`, index, Product, Incident lifecycle Domain, Architecture | Created `.devflow/work/W-incident-lifecycle-6f41b8c2/{spec.md,state.md}`; routed to Work; no implementation | `proven` |
| Work | local Work entry, `project-gate`, `work-state`, the Direct artifact, index, Product, Incident lifecycle Domain, Architecture | Added the 68-line module and 89-line test; `node --test` passed 6/6; safe point `0f3b55e`; state handoff `a182d58` routed to Verify | `proven` |
| Resume | local Resume entry, `project-gate`, index, Work state/spec, Git ancestry and cleanliness | Wrote nothing; selected the Work directory as canonical and `verify` as the route despite the index's baseline `direct` route | `proven` for document-based recovery; see harness friction below |
| Verify | local Verify entry, `project-gate`, `work-state`, index, relevant foundation, Work state/spec, exact safe-point source and tests | Ran Node `v24.18.0`; wrote `verification.md` before changing state; criteria 1-8 were `proven`; routed to Work closure while durable/concurrent/restart/transaction claims remained `unproven` | `proven` |
| Work closure | local Work entry, `project-gate`, `work-state`, index, relevant foundation, Work state/spec/verification | Promoted no knowledge because the candidate set was empty and canon already owned the facts; removed the Work directory; clean closure `9e83a90` | `proven` for knowledge judgment and cleanup; `failed` for the required closure-commit summary |

No actor read the other Devflow stage entries or the parent plan/answer key. The supervised harness
did cause some actors to read Orca lifecycle instructions; that is coordination overhead, not a
Devflow project-memory dependency.

## Final state

- `HEAD`: `9e83a901e331e22b7d382f86ccddac3d61e19f42` (`Close verified incident lifecycle work`).
- Closure review evidence: the commit has no body, so its subject does not preserve the goal,
  acceptance, and verification summary after the Work evidence is deleted.
- Git worktree: clean; `git fsck --no-progress` reported no issue.
- Work artifact: absent.
- Foundation and index: byte-identical to Architecture snapshot `788d966`.
- Implementation: unchanged from safe point `0f3b55e`.
- Final independent rerun: Node `v24.18.0`, 6 tests, 6 passes, 0 failures.
- Remaining `.devflow/` documents: index, Product, Architecture, and the two Domain documents only.
- Final next route: the unchanged index correctly returns to `direct` after the active Work state is
  gone.

## Friction and classification

Two fresh actors mistyped the repeated absolute fixture path as `nanomia\anomia-skills`. Resume
asked the coordinator to restore a repository that was still present; after receiving the same
literal path again, it continued read-only and made the correct routing judgment. Closure recovered
the same typo itself by using the relative path. This is a harness/path-copy failure, not an index,
header, or document-decomposition failure: no project byte was missing or repaired, and the mistake
occurred before either actor read `.devflow/`. Therefore unattended execution of this exact Orca
harness is `unproven`, while the document-routing judgment after entry is `proven`.

The Direct spec was 143 lines for a 68-line module and 89-line test, and Verify produced a 163-line
criterion record. Both were deleted at closure, so they did not bloat durable project memory or
cause a wrong decision. They are nevertheless a cost observation. The ratio follows from the
current required fields, so merely repeating it would add no new evidence. Reopen the form only if
a fresh actor demonstrably misses or delays the decision because of it, or if a smaller complete
form can be compared without losing a required judgment.

## Focused closure-summary repair

The observed cause belonged to the canonical Work entry, not to the index, document headers,
decomposition, state fields, or a missing checker. The earlier phrase `If a PR or commit review
surface exists` let two fresh actors treat a commit they were creating as if no review surface
existed. The replacement makes the condition and destination literal: when closure creates a
commit, the summary goes in that commit message before artifact deletion; a PR is used instead when
it is the review surface.

Delivery evidence:

- changed owner: `source/targets/work/entry.md` only;
- rebuilt target: `work` only;
- two consecutive builds: tree hash
  `b5219b1106c7964af0fd4fd1f71f94ef018315b9b882fdfca0b3338ad9fdbecc`;
- artifact integrity: `true`;
- source currentness: `true`.

Behavior evidence came from disposable repository `.tmp/closure-summary-retest`. Orca task
`task_907951f60694` fixed the expected effect before dispatch: independently establish whether the
verified artifact was closable, then require the closure commit body to retain Goal, Acceptance,
and Verification while preserving unrelated bytes and removing the artifact and bounded team note.
The fresh actor read only the installed Work package, routed project/Work files, relevant source and
test, and Git evidence; it did not read the parent plan, source, tests, answer key, or prior
transcript.

Observed effect:

- closure commit: `21185ec5b8526b98049ee5381ea414c3a7069cce`;
- commit body: explicit Goal, Acceptance, Verification, and Knowledge paragraphs;
- knowledge candidate: landed once in Architecture in that document's own terms;
- Work artifact and bounded team note: absent, including the empty directory;
- verified implementation and test: byte-identical to safe point `d9a2081`;
- focused test: exit `0` before and after closure;
- final Git tree: clean; `git fsck --no-progress` reported no issue.

## Proven, failed, and unproven

**Proven**

- One session-written foundation carried one real change through Direct -> Work -> Resume ->
  Verify -> Work closure on the same evolving tree.
- The active Work state overrode the index's baseline route during recovery, and removal of that
  state restored the baseline route without editing the index.
- Independent verification used the exact implementation safe point and preserved the proof
  boundary.
- Closure did not duplicate task-local evidence into durable Product, Domain, Architecture, or
  index knowledge.
- The repaired Work wording produced the required Goal, Acceptance, and Verification commit body in
  one fresh closure without adding a checker, schema, state field, or broader workflow rule.

**Failed**

- On the previous Work bytes, closure commit `9e83a90` omitted the required goal, acceptance, and
  verification summary before deleting the ephemeral evidence. Prior fresh closure `0d49f7b`
  repeats the omission; `15a278f` is the positive control. The focused current-byte retest no longer
  reproduces this failure.
- The two absolute-path transcription mistakes are recorded as harness failures, not hidden as
  successful Devflow behavior.

**Unproven**

- Zero-intervention execution through this orchestration harness.
- An installed-host continuous journey and observable session-hook on/off effect.
- A failing Verify -> Work fix -> Verify loop within this same fixture.
- Repeated or long-lived Work growth across many changes.
- A current-byte closure whose only review surface is a PR rather than a commit.

## Design consequence

This run closes the prior routing-and-custody composition gap. It does **not** provide evidence to
change the index, headers, document decomposition, add a checker, or add another state field. The
index's baseline route and the immediate Work state's custody route coexisted correctly, and all
task-local detail disappeared at closure.

The bounded Work-source correction and focused retest are complete. Current evidence supports the
one-clause clarification and does not support changing the index, headers, document decomposition,
state contract, or tooling. No broader journey or matrix is needed for this cause. The remaining
release questions are the already recorded host-delivery and unexecuted scenario boundaries, not a
known failure in this routing/custody/closure chain.
