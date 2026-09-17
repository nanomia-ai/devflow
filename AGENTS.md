# devflow vNext — maintainer entry

This repository is implementing devflow vNext. The current design is in `plan/`; the frozen
pre-vNext repository is under `legacy/v0.25.1/` and is evidence only, never an implementation
source, import, fallback, or compatibility target.

Before changing vNext:

1. Read `plan/README.md`.
2. Follow its question-to-document routes and the phase order in
   `plan/04-delivery-and-validation.md`.
3. For skill authoring, follow the current Skill Rails skill and build one target through
   delivery and fresh-use evidence before authoring the next target.

Treat `plan/**` as an immutable accepted baseline. Implementation evidence and any current
plan-execution difference live under `tests/`, routed by `tests/README.md`; never repair a delivery
gap by editing the plan.

Keep these boundaries:

- Preserve the user's practical journey and the design intent before optimizing local mechanics.
- Do not copy or adapt legacy implementation bodies.
- Do not add a checker, generator, schema, hook, plugin adapter, or compatibility layer before the
  plan's stated observation makes it necessary.
- Treat build, hashes, and structure checks as delivery evidence, not AI behavior evidence.
- Record results as `proven`, `failed`, or `unproven`; never report an unexecuted path as passing.
- Make simple corrections that are already determined by the plan. Escalate decisions that change
  skill boundaries, canonical ownership, lifecycle, or user-visible behavior before implementing
  them.

The legacy subtree is self-contained for inspection. Changes to vNext must not require it at
runtime or during build and test.
