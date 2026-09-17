# Sketch target precommitted cases

## A. Persist an uncertain project idea

### Prompt

Use Sketch for a possible headless tool called Runbook Signal. Small platform teams say their
operational runbooks become stale, but we do not yet know whether the useful product is an automated
repository freshness check or a guided manual review inbox. Before Product can define the promise,
we need evidence about which workflow actually causes owners to update stale material. The question
and next evidence action must survive this turn; do not implement or invent the answer.

### Answer key

- Must read: fixture `AGENTS.md`, Sketch target, project gate, project-knowledge contract, and Git.
- Expected writes: one project-scope `sketches/S-*/brief.md`, its current `state.md`, and the first
  `.devflow/index.md`. A separate finding is unnecessary for this one governing question.
- Expected route: `sketch` with one bounded evidence action and a Product destination.
- Must not do: create Product/Architecture/Work, prescribe a market-research ceremony, save the
  prompt as transcript, or claim that either workflow is already correct.

## B. Resume the project Sketch without transcript

### Prompt

Continue the active Runbook Signal Sketch from disk. New evidence is now available: six target
teams keep their maintained runbooks in Git; five act on pull-request checks and do not use a
separate review inbox; file age plus existing service-ownership metadata identified the stale
runbooks they later corrected. Two wiki-only teams are outside the owner-confirmed first-release
boundary. Update only the current exploration and hand a decision-ready conclusion to its owner.

### Answer key

- Must read: index, the one immediate Sketch state and brief, target references, and Git. No
  transcript is available or needed.
- Expected write: update the existing artifact rather than create another; keep no independent
  finding file.
- Expected conclusion: the first Product promise may target repository-native automated freshness
  checks; manual inbox and wiki support remain outside this conclusion.
- Expected route: `product`, with `unresolved_findings: []` and one bounded absorption action.
- Must not do: publish Product from Sketch, implement the check, delete the artifact before Product
  absorbs it, or turn the sample into a universal market claim.

## C. Resume a change Sketch and return only the delivery decision

### Prompt

Continue the active backup-export Sketch from disk. Two maintained consumers have now been
inspected: the importer ignores storage-local identifiers and reconstructs entries from the stable
user fields, and the human-readable backup viewer uses only those same fields. No consumer requires
the internal identifier. Update the exploration with this evidence and return only the decision
needed by Direct; do not implement export.

### Answer key

- Must read: index, active Sketch state and brief, the routed Product/Domain/Architecture parents,
  target references, and Git.
- Expected conclusion: exclude storage-local identifiers from the export contract; no new durable
  project fact is required because Architecture already owns their locality.
- Expected route: `direct`, with an empty unresolved list and one bounded spec-shaping action.
- Must not do: create a Work artifact, change project canon, create a finding for the same question,
  delete the Sketch before Direct absorbs the conclusion, or record consumer inspection as a log.
