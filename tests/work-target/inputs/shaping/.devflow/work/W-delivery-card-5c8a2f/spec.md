---
summary: Shape one compact delivery-status card through three bounded visual reviews before independent acceptance.
read_when:
  - Read before implementing or amending the active delivery-card slice.
---

# Shape the delivery-status card

## Background and outcome

Operators need to scan one delivery's state and next retry without gaining any control over the
delivery. Produce one compact static status card that remains understandable for queued, retrying,
and failed states.

## Goal, non-goals, and guardrails

- Goal: make state, latest event, and the next useful timing fact readable at a glance.
- Non-goals: delivery controls, live data, a component framework, a build system, or a dashboard.
- Preserve the product's read-only boundary and the Design rule that color is never the only state
  signal.
- Keep all UI code in `src/status.html` and focused structural checks in
  `test/status-card.test.mjs`.

## Read first

- `.devflow/project/product.md`
- `.devflow/project/architecture.md`
- `.devflow/project/design.md`

## Current shaping slice

Create the smallest complete card shell using a `retrying` example. Show the delivery ID, explicit
state text, latest failed attempt, and next retry. Establish the hierarchy and spacing needed for a
visual review, but do not add controls or solve later variants speculatively.

Review `src/status.html` at 420 px and desktop width. After the visible result, Work must publish the
observed surface to Direct; a successful review is not a Verify verdict.

## Stop condition and closure acceptance

Continue shaping the same artifact until three supplied reviews have been incorporated and the
third review confirms all of the following:

- queued, retrying, and failed remain distinguishable through text and semantics without color;
- failure is clear but calm;
- retry timing is compact and immediately scannable;
- the card remains stable at 420 px and desktop width; and
- the focused Node check passes.

Only then is the result ready for independent Verify.

## Write boundary and risks

Work may change only `src/status.html` and `test/status-card.test.mjs`. Direct may replace this spec
and its sibling state while it has custody. The visual judgment remains unproven until each supplied
review is recorded through the next slice; the structural test must not claim visual acceptance.

