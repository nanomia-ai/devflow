# Repeated execution context optimization

Status: **implemented-partially-observed**

This change tests whether infrequent Work closure and Direct tracked-contract details can remain
reachable without burdening ordinary implementation, ephemeral direction, or upper-question
handoff. It also removes Sketch-only prose from the Work/Adopt member-note contract. It does not
change project artifact paths, state fields, routes, roles, canonical ownership, or lifecycle.

## Source decision and plan difference

`plan/08-document-contracts.md` §9 says a one-writer artifact contract belongs in its entry. The
current implementation differs deliberately: the entry remains a complete always-read safety and
routing contract, while one target-owned detail file is opened only after the entry can decide that
the current action needs it. Skill Rails registers these files as modules only to deliver them under
`references/`; they remain under their target source directories and have one consumer each.

This difference is accepted here only while the conditional-open decision is possible without
reading the detail and the avoided repeated context exceeds navigation and rare-path rereading. A
missed required read or a detail needed on most runs is a reason to fold it back into the entry, not
to add another rule or checker.

## Meaning preservation

- Work entry still owns valid tracked/ephemeral input, custody and recovery, implementation and
  safe-point rules, candidate recording without adoption authority, failure routing, closure
  eligibility, and the exact condition for opening `work-closure`.
- `work-closure` preserves candidate invariant judgment, pending landing qualification and
  destination contracts, Direct routing for new meaning or a missing home, reread-before-removal,
  review summary, artifact/team-note cleanup, and no tombstone.
- Direct entry still owns bounded canonical and Git reads, upper-decision brokerage, Sketch
  landing, readiness questions, the three persistence questions, ephemeral output, custody safety,
  returned-canon reconciliation, and the exact condition for opening `direct-tracked-contract`.
- `direct-tracked-contract` preserves promotion basis, artifact identity and decomposition,
  integration acceptance and blockers, checkpoint-to-spec-to-state publication, spec contents,
  shaping, and amendment treatment of prior verification.
- Sketch entry now directly owns its personal exploration boundary. `team-context` owns only the
  Work and Adoption member-note contract; its selected key, branch/worktree comparison, precedence,
  note exclusions, and cleanup rules are unchanged.

Independent source reviews reconstructed the moved Work and Direct rules from their new locations
without finding a lost condition, owner, action, order, or result. This is meaning evidence, not
runtime behavior evidence.

## Cost measurement

Counts are Unicode characters from the canonical Markdown source. They exclude project documents,
code, conversation history, model-specific tokenization, and the generated-marker line.

| Path | Before | After | Difference | Additional read |
|---|---:|---:|---:|---:|
| Work ordinary tracked implementation | 10,625 | 9,674 | -951 | none |
| Work ordinary implementation with a member note | 11,842 | 10,445 | -1,397 | none |
| Work closure without a member note | 10,625 | 11,409 | +784 | one reference |
| Work closure with a member note | 11,842 | 12,180 | +338 | one reference |
| Direct ephemeral | 8,498 | 6,577 | -1,921 | none |
| Direct upper-question handoff | 10,447 | 8,526 | -1,921 | none |
| Direct tracked creation or amendment | 10,447 | 10,788 | +341 | one reference |
| Sketch ordinary persistent exploration | 10,418 | 9,230 | -1,188 | one fewer reference |

These values show a frequency trade rather than universal compression. No average saving is claimed
because real invocation frequencies and model token counts have not been observed.

## Fresh-use observations

Five clean-context, read-only sessions received only one standalone generated target and a bounded
scenario. They did not receive source, plan, tests, Git history, or the authoring discussion.

- Work ordinary implementation opened `SKILL.md`, communication, project-gate, and work-state. It
  did not open work-closure, kept custody at Work, and treated the candidate as neither adopted nor
  canonical-write authority.
- Candidate-free Work closure opened work-closure only after applying valid tracked custody,
  closure condition, and all-required-proven eligibility. It required empty blockers, candidates,
  and pending landings before artifact and scoped-note removal.
- Direct ephemeral opened only `SKILL.md`, communication, and project-gate. It opened neither
  work-state nor direct-tracked-contract and returned an ephemeral contract with no artifact.
- Direct tracked creation opened work-state and direct-tracked-contract only after persistence
  classification, then recovered checkpoint → spec → executable state publication in order.
- Sketch opened `SKILL.md`, communication, project-gate, and project-knowledge. It had no
  team-context reference, did not inspect the other member's similar Sketch, kept findings inside
  its own folder, and interpreted `next_route` as a same-member role transition.

## Evidence status

- `proven`: source-to-reference delivery; deterministic double builds; integrity/currentness;
  source meaning reconstruction; the five named conditional-open decisions in the observed fresh-agent sessions.
- `failed`: none in the bounded observations.
- `unproven`: actual implementation bytes, failed/unproven repair, missing-home or new-meaning
  routing, canonical landing writes, artifact deletion, Direct upper-question handoff,
  promotion/amendment/integration, Adopt member-note behavior, repeated-read recovery cost, real
  invocation frequencies, model-specific token savings, other hosts and models, and external
  product effect.

Build, hash, JSON, and source graph checks are delivery evidence only. The read-only fresh sessions
prove the observed reading decisions, not the unexecuted write and closure effects.
