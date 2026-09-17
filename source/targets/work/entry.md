---
name: work
description: Implement one ready Devflow Work contract or one agreed same-turn action, preserve a recoverable safe point, and route the result without changing its goal or verdict. Use for implementation and Work closure; not for direction, verification, status recovery, or bootstrap.
---

# Work one change

Work turns an already bounded result into actual code, tests, and Git history. Choose local
implementation methods inside the agreed boundary, but never make implementation convenience a new
goal, acceptance rule, or product boundary.

## Enter through a valid gate

Before any target-specific action, open `references/project-gate.md` and apply the `work` row. If
the gate routes elsewhere, make no change.

When the index is usable, read it before selecting or executing an input.

Work accepts exactly one of these inputs:

- a tracked artifact whose readable `state.md` says `next_route: work`, has no blockers, and has a
  self-contained `spec.md`; or
- an ephemeral goal, write boundary, and proportional check agreed in the current session.

For tracked input, open `references/work-state.md` before reading or writing Work state. After
selecting the artifact, open `references/team-context.md` when a bounded note for its ID exists or
when you hold local delta, environment-specific, or tentative context that must survive a hand-off;
otherwise skip it. Read the selected spec and state, the spec's `read_first` documents, context
allowed by that module, and current Git revision, status, and relevant diff. Do not expand into
unrelated project knowledge. Confirm that `base_revision` is reachable and that any inherited dirty
paths named by the contract still match before touching them.

If a required contract document is missing, unreadable, or inconsistent before custody is clear,
do not implement or repair it. Report the exact inconsistency and route to `resume`. If the state is
readable and already gives Work custody, publish `next_route: direct` with the inconsistency as the
decision question.

## Execute within the contract

Implement the smallest current result or shaping slice that satisfies the spec. Work owns local
factoring, names, algorithms, and test technique inside the write boundary. Preserve unrelated
dirty bytes and do not stage or rewrite them.

Run the checks that can reveal whether this implementation and its guardrails hold. When a slice is
safe, create a focused commit containing only the owned change when the repository permits commits,
then record that commit as `last_safe_point`. A dirty tree is never a safe point.

If implementation exposes a broken premise, a required out-of-boundary change, or a contract
conflict defined by `work-state`, stop at the last safe point. Publish `next_route: direct` with the
broken premise, the smallest proposed change, its boundary impact, and one decision question. If
the affected boundary is not Adoption-ready, route to `adopt` instead. Do not amend the spec.

For a shaping contract, complete and observe only the current slice. Route to `direct` with the
observed signal and the next decision question. A successful intermediate review is not a Verify
failure. Route to `verify` when the spec names an interim risk criterion for this slice, or after
its stop condition says the closure result is ready for acceptance judgment.

## Keep the hand-off recoverable

Before another actor or session can take custody, replace state with the actual safe point and one
bounded next action. Use `next_route: work` when the same contract has a bounded continuation,
`direct` for amendment or the next shaping decision, `verify` when the result is ready for an
independent acceptance judgment, `adopt` for a broken adoption boundary, and `user` for destructive
or ambiguous disposition. Never write `verification.md` or a verdict.

Record implementation-discovered durable facts only as `knowledge_candidates` under the shared
state contract. Reproducible tests and code may be handed to Verify; do not invent an evidence file
or put verification evidence in state. A shaping hand-off's `next_action` carries only the bounded
observed signal and decision question needed for Direct. If the spec requires non-reproducible
evidence to survive into a later Verify session, treat that as a contract conflict and route to
`direct` rather than pretending the evidence was preserved.

## Close only after verification

When a published verification returns custody to Work, read its criterion evidence without copying
the verdict into state. A failed or unproven criterion follows its recorded failure route. When the
closure condition is reached and every required criterion is proven, adopt or reject each knowledge
candidate. Send unresolved judgments to the owning decision route as blockers; turn only confirmed
current facts into `fact -> canonical path` pending landings.

Judge each candidate by the invariant it proves rather than the code that exposed it: adopt it when
that invariant would change a later actor's judgment and land it in its home's own terms; reject it
only when no such invariant remains.

Apply each pending landing to its canonical Product, Architecture, Design, Domain, or decision home,
re-read the touched document's `summary`, `read_when`, and related body, and clear the landing only
after the fact is present without duplication. If closure creates a commit, include a short goal,
acceptance, and verification summary in that commit message before deleting the artifact; use the
PR instead when it is the review surface. Delete the Work artifact directory itself and bounded
member files only when no blocker, candidate, or pending landing remains. Git keeps the history; do not
leave a completed-spec tombstone.

## Handle ephemeral work

For an ephemeral input, open no `work-state` module and create no Work artifact. Read the relevant
canon, implement inside the agreed boundary, run the agreed check, and finish in the current
session. If interruption recovery, a durable knowledge decision, independent verification, or
unclosed risk becomes necessary, stop before doing more and route to `direct` to promote the current
dirty delta with `base_revision: HEAD`.

## Report the hand-off

Return:

- `Safe point:` the commit or `none`, plus owned dirty paths that remain;
- `Route and action:` one next route and one bounded action, or `closed`;
- `Divergences:` broken premises, out-of-owner spec clauses, blockers, candidates, and unproven
  observations, or `none`;
- `Read set:` the canonical and Work files actually opened.

Do not direct a new goal, change acceptance, perform the independent Verify judgment, reconstruct
project status, coordinate branches, or absorb maintained brownfield sources.
