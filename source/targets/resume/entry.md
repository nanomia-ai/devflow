---
name: resume
description: Read the canonical .devflow state in the current checkout and report active work, inconsistencies, and exactly one next route and action without changing files. Use for status, continuation, or interrupted-work recovery; not for domain explanation, planning, implementation, or verification.
---

# Resume a devflow project

Devflow keeps project knowledge and active-work state under `.devflow/`. Your only purpose is to
recover the current checkout's trustworthy position and identify one safe next route and action.
This is a read-only orientation task, not an execution stage.

## Entry gate

Before any target-specific action, open `references/project-gate.md` and apply the `resume` row. If
the gate stops Resume, make no change.

If `.devflow/` exists but `index.md` is missing or unreadable, inventory all existing
  `.devflow/project/`, `.devflow/sketches/*/state.md`, `.devflow/adoption/state.md`, and
  `.devflow/work/*/state.md` paths without writing. Check every bounded active-state location before
  choosing a route from foundation documents alone. Use the surviving project or artifact evidence
  to name the writer route that can recover the index. If that route is not determined, route to the
  user. Never restart unmanaged bootstrap over existing state.
Otherwise, read `.devflow/index.md` first and follow its bounded orientation and question routes.
  The index owns the project's routing details; do not replace them with a generic lifecycle.

## Recover the current position

1. Use the index's bounded globs to enumerate immediate active state only. Do not recursively read
   every project or domain document.
2. Compare the current checkout's Git revision and bytes with each selected state's intent, base,
   last safe point, and next action. Dirty changes without an active artifact are unowned work, not
   proof that nothing is in progress.
3. If several active items exist, report them and route to the user to select one. If one exists,
   open only its `spec.md` or `brief.md`, bounded `team/*/<artifact-id>.md` files when present, and
   the project documents Resume itself needs to resolve the current route. A spec or brief's
   `read_first` is input for the routed actor; do not follow it during orientation unless selected
   state, sibling, and Git evidence disagree and that project document is needed to locate the
   recovery owner.
4. Treat a foundation document as current only when its content is complete for the contract and
   readiness rule named by the index. File existence alone does not make a partial Product,
   Architecture, or Design current.
5. Do not guess through missing, unreadable, or disagreeing spec, state, verification, foundation,
   or Git evidence. Report the inconsistency and route to the exact writer or decision route that
   owns recovery.
6. When there is no active item, derive the next foundation route instead of reporting only
   "nothing in progress": missing Product permits bootstrap; complete Product without Architecture
   routes to `architecture`; Architecture that requires missing Design routes to `design`.

## Return one orientation report

Use these four fields and no progress percentage or reconstructed transcript:

- `Active items:` the bounded items found, or `none`.
- `Inconsistencies/blockers:` evidence that prevents trusting or continuing state, or `none`.
- `Next route and action:` exactly one route and one bounded action. Do not perform it.
- `Minimum read set:` every project path actually opened for the judgment.

Do not explain an entire domain, choose batching or implementation strategy, change project files,
repair state, execute the next route, aggregate other branches or worktrees, or claim verification.
Those responsibilities belong to the routed skill, the user, Git, or an external orchestrator.

There are no optional modules for this target. Done means the report is supported by current disk
and Git evidence, contains one safe next route and action, lists its actual read set, and made no
project write.
