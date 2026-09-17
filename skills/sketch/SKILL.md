---
name: sketch
description: Narrow a project idea or change-blocking question that needs evidence before Product, Architecture, Design, or Direct can decide and whose context must survive interruption. Use for durable exploration; not for a clear brief, an implementation-ready change, or a question whose cheapest evidence is implementation.
---
<!-- generated; do not edit; source: targets/sketch/entry.md; receipt: .skill-rails-build.json -->

# Narrow one open question

Sketch preserves only the exploration needed to make one governing question decidable. It can serve
a new project's uncertain idea or an existing project's blocked change, but it does not turn a
conversation into a research archive or prescribe one analysis method.

## Enter only when exploration must persist

Before any target-specific action, open `references/project-gate.md` and apply the `sketch` row.
Then open `references/project-knowledge.md`. Read `.devflow/index.md` first when it is readable and
follow only the project routes relevant to the governing question.

Create a Sketch only when all three statements hold:

1. Product or delivery cannot safely name its next result until an open question is narrowed.
2. Evidence or a user decision is needed before implementation; implementation is not the cheapest
   discriminating evidence.
3. The question, current evidence, or next action must survive the present custody interval.

Otherwise keep the discussion ephemeral and route a clear project brief to `product`, an executable
change to `direct`, or implementation-led learning to Direct shaping. File count, novelty, and the
word “research” do not make exploration durable.

Choose `project` scope when the answer will establish product meaning before a foundation exists.
Choose `change` scope when a current project decision blocks one delivery outcome. Do not combine
unrelated questions merely because they arose in one conversation.

## Open the smallest recoverable artifact

Make a collision-resistant opaque ID such as `S-short-label-<token>` and confirm that it is absent
from the current tree. Create `.devflow/sketches/<artifact-id>/brief.md` and `state.md`; every file
uses the shared routing header.

`brief.md` is the self-contained reason for the exploration. State its project or change scope, one
governing question, the background and user intent, facts already established, explicit non-scope,
and the criteria by which an answer becomes decision-ready. Do not store the conversation,
chronology, proposed implementation, or a generic research plan.

`state.md` is one replaceable current snapshot, not a log. Keep this shape:

```yaml
next_route: sketch
next_action: <one bounded evidence-gathering or decision action>
blockers: []
unresolved_findings:
  - question: <one unresolved question>
    destination: <product | architecture | design | direct>
    landing_condition: <evidence or decision that makes it ready to absorb>
```

All four fields are required while the artifact exists. A finding remains in
`unresolved_findings` until its conclusion is absorbed into the named canonical home; meeting its
`landing_condition` makes it eligible for hand-off but does not remove it. A blocker is something
that prevents the next action, not the fact that the answer is not known yet. Replace the snapshot
before custody can change if the current action cannot finish; do not append attempts, transcript,
progress percentage, or prior routes. The actor for the published `next_route` owns the snapshot.
If custody is unclear, do not overwrite it and route to the user.

For the selected artifact, open `references/team-context.md` when a bounded note for its ID exists
or when you hold local delta, environment-specific, or tentative context that must survive a
hand-off; otherwise skip it.

When Sketch is the first project entry, also publish a small `.devflow/index.md`. Give one-line
project orientation, route open exploration through the bounded Sketch-state glob, expose only the immediate
`sketches/*/state.md`, `adoption/state.md`, and `work/*/state.md` recovery globs, and say that the
foundation is not ready until Product and Architecture plus any applicable Design are complete.
Do not copy the question's evidence or enumerate active IDs in the index. With an existing index,
change it only when a question route or readiness statement actually changes.

## Gather only decision-changing evidence

Choose the cheapest evidence that can change the current decision. The method may be source
inspection, a bounded experiment, external research, comparison, or a user choice; Sketch does not
require a market-analysis sequence, questionnaire, or fixed number of options. Distinguish observed
facts, interpretations, unresolved questions, and the condition that would resolve each one.

Keep evidence in `brief.md` when every reader of the governing question needs it. Create
`findings/<concern>.md` only when its independent question can be selected from the brief before the
file is opened and the avoided reading or write collision exceeds the new route cost. A finding
contains its question, relevant evidence, observation versus interpretation, material options and
trade-offs, current conclusion or unknown, and confirmation condition. It does not repeat its
destination, preserve search-result lists, or become a second brief.

Ask the user only for a binding choice evidence cannot settle. When the next evidence is unavailable,
put the exact dependency in `blockers`, use `next_route: user`, and name what answer would resume
Sketch rather than inventing a conclusion.

## Hand off conclusions to their owners

Before publishing a decision-ready conclusion, open `references/sketch-handoff.md` and follow its
sender contract.

When a finding is decision-ready, express the conclusion in the destination's own terms rather than
as a research narrative. Project-scope product meaning routes mainly to `product`; technical and UI
findings route to `architecture` or `design` when those stages can absorb them. Change-scope answers
route only the delivery decision to `direct`, while facts that remain true beyond the change first
route to their one Product, Domain, Architecture, Design, or decision home.

Publish one bounded landing at a time and keep the selected item and every remaining item in the
snapshot until the receiving actor completes the shared hand-off contract. Do not write the owner
document from Sketch. Git retains the final history after the receiver closes the artifact.

## Return the current decision edge

Return:

- `Scope and question:` `project` or `change`, plus the governing question;
- `Artifact:` the Sketch paths created or updated, or `none` for an ephemeral outcome;
- `Evidence and conclusion:` what is observed, what it currently supports, and what remains unknown;
- `Route and action:` exactly one next route and one bounded action; and
- `Unproven or blocked:` missing evidence, binding user choices, and their reopen condition.

Do not create or amend Product, Domain, Architecture, Design, Work, adoption, implementation, or
verification files. Done means the question either became an ephemeral handoff in the current turn,
or a durable Sketch can be resumed from its brief and current snapshot without the originating
conversation.
