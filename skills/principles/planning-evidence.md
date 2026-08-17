# Planning evidence discipline

This companion is the common discipline product, arch, adopt, and split use to settle facts before binding user decisions.

## Four Kinds of Unknown

| Unknown | Answer owner | First action |
|---|---|---|
| Current repository fact | Current code, config, manifest/lockfile, test, and execution result | Do not ask. Confirm directly when one exact coordinate or bounded query suffices; apply the isolated-research criteria to new path tracing, comparison, or repetition |
| External contract fact | Official documentation, specification, source, or primary API for the pinned version | Find the version in the repository first and fix that version and the lookup time. Do not use current documentation to prove an older version |
| Execution fact | Safe calls, rendering, and state transitions allowed in the current environment | Execute directly or observe through the existing verify channel. Request exact permission when writing, cost, or authority is required |
| Owner decision | The user who determines values, priorities, risk tolerance, and user experience | Ask with confirmed facts and a recommended reason; do not bind before the answer |

## Blocking Facts and Follow-up Facts

A fact is `blocking` when leaving it unsettled makes the current option's admissibility or completion verification undecidable.
A blocking fact stops dependent next steps and binding decisions until it yields an answer, a conflict, or unavailability.
A fact is `follow-up` when a safe default can bind the current decision and its later result would change only optimization.
Leave only its state and the impact that would change in the current stage's existing home, then continue independent work.

## Source Ownership

Set a source's authority by who can change the fact. Plausibility or recency alone does not establish authority.

## Stop Conditions

A fact is `settled` when its owning source or an execution result answers it.
It is `conflicted` when equally authoritative sources cannot coexist, and `unavailable` when allowed tools and permissions cannot confirm it.
When a blocking fact is `conflicted` or `unavailable`, report the conflict or absence and the decision it prevents binding, then stop.

## Persistence

Do not create raw research files. Leave only the conclusion, its impact on the current decision, and the exact source in an existing owning statement.
product puts follow-up facts in `Open questions`; arch uses a `Provisional` value with a safe default and a `settling card`.
split uses an existing `research card` for an unknown that would force guessing the Destination or Completion signal; adopt sends a future decision to its owning stage.
When no home fits, create no file or card and report the exact owning stage.
A settlement caught by the record gate below is the exception — it lands as a decision or evidence record under the canonical rules.

## The Record Gate and Projection

The record gate, the three-line echo, and the record body grammar (`mode`, `Reproduce`,
`Invalidates-when`) are defined once for all six producers in the canonical rules'
planning-records section — this section does not restate them. It owns only the
planning-side procedure around records.

- **Projection and opening**: when picking records at planning re-entry, domain entry, or
  candidate judgment, use only the record tool's `select` — never hand searches or eye
  filtering to compute the current set. Open by affects intersection then newest date, and
  **a session opens at most 3 record bodies for one bind judgment — however many `select`
  calls it splits them across.** This cap is a hard ceiling guarding model input
  independent of the record count, not a default that approval raises — approval only
  picks which of at most 3 to open or whether to proceed with the newest 3, and no body
  is opened outside `select`. **Immediately before binding a binding decision**, when matching current
  candidates remain unopened, present their filename list, and bind only after the user
  picks ones to open, narrows the scope, or explicitly approves proceeding. For every
  evidence record `select` chose, open the body and check `Invalidates-when` —
  `checked-at` is only descriptive metadata for the human reader (ordering comes from the
  filename date), and evidence past its `review-after` is not cited
  before reconfirmation.
- **Stale-evidence cascade**: when an evidence record is judged stale — a successor was
  made or its `Invalidates-when` is true — enumerate every **current** decision record
  citing it with the record tool's `reverse-evidence`; for each, leave only a
  reconfirmation report when the conclusion still stands on new evidence, and ask the user
  through the owning stage when it wavers. Never invalidate a decision automatically.
- **Execution-check (spike) approval, five elements**: obtain one approval for the
  refutation question, artifact paths, command, stop condition, and maximum output size.
  Artifacts live as ordinary repository files outside devflow, and the evidence record
  cites their exact paths and blobs.
- **Secrets and bulk**: never put a secret value in a reproduction command or observation —
  point to secrets only by environment-variable name. For an observation carrying
  personal data or customer confidences, keep only the coordinate of an
  access-controlled source instead of the content — Git records are immutable and cannot
  be erased later. Keep only the values a verdict
  needs from machine results and never commit raw bulk output. A needed binary proof opens
  an exception through one explicit user approval.

## Isolated Research

When the next judgment requires understanding the code flow, document structure, or domain context itself, the main session reads it directly.
When an already-known exact path, symbol, or URL, or one query with an output cap, answers without following a new source, the main session confirms it directly.
When only the answer is needed but a new path or source must be followed, two or more must be compared, or one decision needs two or more independent fact checks, group them under one researcher when the platform supports it.
The same search scope is a question set needed for one current decision whose permitted repository paths, external domains, and versions can be enumerated in one brief.
Do not create a researcher per question or source. When raw-source understanding and answer-only work divide, the main session owns it.
The researcher only reads and searches the repository and external primary sources; it does not re-delegate, write files, change product code, run tests or prototypes, or decide.
Its return contains only `settled`, `conflicted`, or `unavailable`; a conclusion per question; exact internal coordinates or external source, version, and lookup time; the applicability boundary; and remaining conflicts.
Return no search transcript or raw output. The main session confirms only the key coordinates that could change the binding decision and does not repeat the full search scope.
Facts settled only by execution are observed through an allowed safe execution by the main session or the existing verify channel.
Prototype or code changes go through the existing research card and work when a tree exists. Before the tree, the main session performs them under the five-element spike approval, keeps the artifacts as ordinary repository files outside devflow, and the evidence record cites those paths; owner decisions and binding decisions are never assigned to the researcher.
When isolated execution is unavailable, the main session researches the same scope directly. Do not bind a dependent decision before a blocking fact returns.

## Criteria for Options Actually Presented

Two questions are dependent when one option changes a later question's necessity, options, or recommended default.
Settle one dependent question first; put only questions that do not change one another in the same batch.
After free-form user input, recompute remaining dependencies and recommended defaults from the actual answer.

## Pre-commitment Review

Immediately before binding the current decision batch, compare one substantive candidate only when all four conditions hold.

1. Current evidence or evidence from an already permitted research trigger can explain it.
2. It substantively changes a user outcome, product boundary, reversal cost, or verifiability.
3. It has a different trade-off rather than merely a different name or expression.
4. It can be compared within the current stage's ownership.

With no candidate, create no output, question, research, or record. With several candidates, propose one only when success criteria and user priorities distinguish one.
When they do not, keep the current option. Do not apply pre-commitment review again to a batch the user reselected.

| Consumer | Fact-confirmation point | Pre-commitment review point | Boundary it does not cross |
|---|---|---|---|
| product | Before asking the user the current question frontier | After applying an answer, before creating the next frontier or final confirmation | Does not select the stack or DB |
| arch | Before presenting a candidate to the user | After confirming candidate-survival facts, before binding a hard-to-reverse choice | Does not change product's Problem, Capabilities, Boundary, or Success criteria |
| adopt | Before previewing the current implementation and pinned-version external contracts | After separating observation, interpretation, and future decision, before confirmation | Does not delegate representative-flow structural understanding or promote a current fact into future intent |
| split | When reading sources for the maintenance planning depth grade | After the four card fields first become unique, before landing the card | Does not compare a Layer 0 change; routes it back as 2a |
