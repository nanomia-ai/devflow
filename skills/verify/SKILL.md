---
name: verify
description: Independently execute one ready Devflow Work contract's acceptance checks, record criterion-level evidence and verdicts, and route failures or proven closure without changing implementation or canon. Use only for a valid tracked Work artifact ready for verification.
---
<!-- generated; do not edit; source: targets/verify/entry.md; receipt: .skill-rails-build.json -->

# Verify one Work result

Verify judges the accepted Work result against its current contract through actual execution and
observation. Preserve uncertainty: an unexecuted or unavailable observation is `unproven`, never a
pass. Verification evidence belongs in the selected artifact; implementation, contract, and
project canon remain with their owning routes.

## Enter through a valid contract

Before any target-specific action, open `references/project-gate.md` and apply the `verify` row. If
the gate routes elsewhere, make no change.

When the index is usable, read it first. Select exactly one immediate Work state named by the user
or current route. If several eligible artifacts remain and no selection is determined, route to the
user without writing.

Open `references/work-state.md`, then the selected state and sibling spec. Verification may begin
only when state gives `verify` custody, has no blockers, names a reachable committed safe point, and
the spec is self-contained for outcome, acceptance, and write boundary. Read the spec's
`read_first` documents and only the implementation, test, environment, and team context needed to
execute its criteria. Compare the current Git revision, relevant bytes, and safe point before
using any result as evidence.

If a required document is missing, unreadable, or inconsistent, or the checkout cannot identify
the exact bytes under judgment, do not infer current. Make no project change and route to `resume`
with the inconsistency. If Verify already has clear custody and execution exposes a contract or
owner defect, finish the evidence that remains trustworthy, then publish the owning failure route
through state.

## Execute the acceptance contract

Evaluate every current acceptance criterion separately. For each one record:

- the expected observable result;
- what was actually observed and through which revision, environment, and channel;
- the evidence that supports the observation; and
- exactly one verdict: `proven`, `failed`, or `unproven`.

Use real execution or observation. A structural check does not prove a visual result, a successful
review does not prove a different environment, and a prior run is not current evidence when its
revision or preconditions changed. When a required channel is unavailable, record `unproven` and
the condition that would reopen it. Qualitative acceptance may use an explicit user judgment when
the spec names that review surface, but never invent acceptance from silence.

Derive the overall result from the criterion verdicts; do not create a second status field. For
every failed or unproven criterion name the broken or missing premise, the one `failure_route`, the
specific target it owns, and what must change before retry:

- implementation, tests, or local behavior -> `work`;
- goal, acceptance, write boundary, or shaping contract -> `direct`;
- product or Domain meaning -> `product`;
- structure, dependency, runtime, data flow, or verification channel -> `architecture`;
- UI or interaction principle -> `design`;
- maintained-source readiness or disposition -> `adopt`;
- evidence that only a person or external decision can supply -> `user` or that decision route.

Do not modify code, tests, spec, Product, Architecture, Design, Domain, or adoption canon. Do not
repair a failing result in the verification session or weaken a criterion to make it pass.

## Publish evidence before the route

Write `verification.md` first as one current whole-file record with the project's normal `summary`
and `read_when` header. It owns:

- the exact target revision, environment, and channels;
- every criterion's expected result, observation, evidence, and verdict;
- the derived overall judgment;
- each failure route and retry precondition; and
- evidence for any durable current fact discovered during verification.

The verification file is the only verdict owner. Do not copy its verdict or evidence into state.
After rereading the completed verification record, replace `state.md` last under the shared state
contract. Preserve the implementation safe point and existing unresolved candidates. Add a
`knowledge_candidate` only when the new evidence supports a durable current fact worth judging for
canon; observations, verdicts, code paths, and test results are not candidates.

Choose one bounded next route and action:

- a failed or unproven criterion follows its recorded failure route and retry precondition;
- an interim risk criterion that is proven returns to `direct` or `work` when the spec still has a
  bounded continuation;
- when the stop condition has arrived and every closure criterion is proven, route to `work` to
  judge candidates, land confirmed facts, and close the artifact.

Publishing state is the final commit point. If the session stops after `verification.md` but before
the matching state, or state points past a missing or unreadable verification record, the result is
not current; Resume must report `reconcile -> verify`. Do not append attempts or preserve superseded
verdict copies. If Direct later amends acceptance or guardrails, Direct owns carrying forward only
the still-needed failure memory and deleting the stale verification record.

## Return the judgment

Report:

- `Target:` the artifact and exact revision, environment, and channels judged;
- `Criteria:` each criterion and its `proven`, `failed`, or `unproven` verdict with evidence;
- `Route and action:` the one published next route and bounded action;
- `Unverified:` unavailable observations and their reopen conditions, or `none`;
- `Read set:` every project, Work, implementation, and evidence path actually opened.

Done means every current criterion has an honest verdict, evidence was published before the route,
state contains no verdict copy, the next owner can tell what must change or close, and Verify changed
no implementation, contract, or project canon.
