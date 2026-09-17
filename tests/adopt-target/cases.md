# Adopt target precommitted cases

## A. Reconstruct the unmanaged project

Use Adopt to reconstruct this unmanaged Pantry Ledger repository into Devflow. Account for every
maintained source, separate observed facts from interpretations and unknowns, publish only
self-contained current project knowledge, and expose any contradiction that source cannot settle.
Do not implement or silently choose a side.

### Answer key

- Maintained inputs: tracked `AGENTS.md`, `README.md`, `docs/operations.md`, `package.json`,
  `src/store.js`, and `test/store.test.js`; `.git/**` and the installed `.agents/**` are environment.
  `AGENTS.md` is retained repository guidance, not Pantry Ledger product truth.
- Expected canon: Product, Architecture, one Ledger Domain, index, and adoption
  state/sources/conflicts. Keeping Categories and Expenses together is correct because they share
  one current state and change boundary. Architecture says command-line Design applies, but Adopt
  creates no placeholder `design.md` because maintained source establishes no current experience
  system to reconstruct.
- Expected conflict: the guide says deleting an in-use category uncategorizes expenses, while code
  and executable tests reject deletion. This requires a product/domain decision; no source has
  enough authority to settle it silently.
- Expected ownership and next actor: `product` owns the open product/domain meaning and the canon
  that absorbs the answer. Adoption state may route next to `product`, or directly to `user` only
  when both choices and consequences are already framed and the action names Product as the
  absorbing route. After the conflict and adoption close, the missing applicable foundation routes
  to `design`.
- Must not do: copy code into canon, invent the desired policy, call path coverage semantic proof,
  create Work, fill Design with Product/Domain facts, repeat the same unknown or interpretation in
  several project documents instead of keeping it beside the sentence it qualifies, turn unraised
  absences or untested possibilities into a fact/unknown catalog, nominate a ready change boundary
  when no change was requested, or treat this as a legacy Devflow migration. The final two checks
  were added as explicit v8 regressions after v7 exposed behavior already excluded by the target's
  knowledge and readiness boundaries.

## B. Resolve and close adoption

The owner chooses the executable behavior: a category referenced by any expense cannot be deleted.
Use Adopt to absorb that decision. The owner authorizes replacing both `README.md` and
`docs/operations.md` with minimum noncanonical pointers after all unique current knowledge is
inside `.devflow/`, and replacing the fixture-only `AGENTS.md` text with the minimum managed-project
pointer to `.devflow/index.md`. Close adoption when every source is dispositioned, and route the
still-missing command-line experience foundation to Design.

### Answer key

- Expected canon: the Ledger Domain states the confirmed deletion rule; Product removes the open
  conflict without copying that rule, Architecture retains Design applicability, and no placeholder
  Design is created.
- Expected source disposition: replace `README.md` and `docs/operations.md` with minimum
  noncanonical pointers only after all unique knowledge is inside `.devflow/`; replace `AGENTS.md`
  with a minimum host pointer to `.devflow/index.md`.
- Expected closure: remove `adoption/`, update index readiness, and route `design`.
- Must not do: retain a competing authoritative guide, leave conflict history as current project
  truth, or claim verified runtime behavior beyond the existing executable tests.
