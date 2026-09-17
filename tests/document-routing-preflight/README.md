# Devflow vNext document-routing preflight

This disposable experiment tests one claim only: whether a fresh AI can use a small `.devflow/`
document tree to select the relevant canonical documents and identify the correct next action before
any vNext skill is implemented.

## Scope

- The fixture is a UI-less webhook delivery service with two domains.
- The fixture contains exactly eight `.devflow/` Markdown files.
- One Architecture concern is conditionally split from its parent.
- No skill, Skill Rails package, hook, plugin, npm package, generator, renderer, schema framework, or
  legacy implementation is created or reused.
- The answer keys in `cases.md` are frozen before the fresh sessions run.

## Observation protocol

Each case is run in a separate fresh AI context. The only project guidance supplied to that context
is `fixture/AGENTS.md`; the only task supplied is that case's question. A participant must report the
`.devflow/` files it actually opened, the canonical home it selected, and its proposed next action.
It must not read this README or `cases.md`, and it must not invoke an installed skill.

The observer compares the actual read set and judgment with the frozen answer key. A different route
is accepted only when it reaches the same canonical owner and next action without relying on copied
knowledge. File existence and Markdown links are checked directly; this experiment does not add a
structural test framework.

## Result

**Verdict: provisional pass.** All three valid fresh sessions selected the frozen required read set,
opened no forbidden document, chose the expected canonical or coordination home, and proposed the
expected next action.

| Case | Actual `.devflow/` reads | Selected home and next action | Result |
|---|---|---|---|
| Product boundary | `index.md`; `project/product.md` | Product is canonical. The requested destination discovery and payload transformation are out of scope; route to Product before any implementation contract. | `proven` for this case |
| Delivery Domain | `index.md`; `project/domains/delivery/index.md` | Delivery is canonical. Record terminal `rejected` and do not retry HTTP 409. | `proven` for this case |
| Interrupted Work | `index.md`; Work `state.md`; Work `spec.md`; `project/architecture.md`; `project/architecture/local-spool.md` | State owns `next_route: work`; spec owns the change; the Architecture bundle owns replay constraints. Implement one oldest-first replay step, preserve job ID, and delete only after confirmed insertion. | `proven` for this case |

No valid session opened Product or a Domain for the Work question, no Product session opened
Architecture, and no Domain session scanned its sibling. There was no answer-key disagreement to
classify as an alternative route or an error.

An initial Work run reached the same read set and answer but invoked the installed legacy
`devflow:resume` skill. That run is excluded because it did not prove document-only navigation. The
cause was experiment isolation, not index, header, or decomposition: the fixture entry had not
explicitly forbidden installed skills. After that control was added, all three cases were rerun in
new contexts and produced the table above without a skill.

### Evidence classification

- **Proven:** the eight expected Markdown files exist; all have `summary/read_when`; all fixture
  Markdown links resolve; and the three bounded clean sessions produced the expected reads and
  judgments.
- **Failed:** none in the valid cohort. The excluded contaminated run is a test-control failure, not
  a document-routing failure.
- **Unproven:** behavior outside these three questions; other hosts or model families; larger trees;
  cross-domain questions; missing or contradictory documents; and behavior after real skills are
  installed.

This experiment produced no evidence that the current index route, headers, or document split should
change. It supports starting the Skill Rails implementation as the next separately approved step,
but does not prove any skill implementation or broader Devflow behavior.
