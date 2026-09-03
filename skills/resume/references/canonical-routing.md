# Canonical routing

The schema-2 `route.id` selected by `calculateState({ root })` selects one table row in priority order. Resume consumes the same result's `zones` and `facts`, then routes once to product, arch, direct, work, verify, an ask, a wait, a report-and-done outcome, or a fail-closed block; it never recomputes predicates, parses a compatibility rendering, or emits an effect-free route back to itself.
