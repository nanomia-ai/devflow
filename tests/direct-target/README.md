# Direct target behavior preflight

This experiment tests whether the standalone Direct target chooses persistence before size, writes
only a usable execution contract, and stops at the owning decision route when no safe contract can
yet be formed.

For each case, copy `fixture/` to a new disposable directory, initialize and commit it as a Git
repository, install only the built project-local `direct` target, and give a fresh session the
fixture `AGENTS.md` plus that case's question. For case 3, apply its named dirty edit after the base
commit. Do not give the session this README, the answer key, or the vNext plan.

Observe separately:

- project and skill files opened;
- persistence decision and its stated basis;
- Work paths and exact bytes written;
- whether the spec is self-contained and the initial state is recoverable;
- next route/action and any user approval requested;
- unrelated project-byte changes or generated-support-file reads.

Delivery and behavior are reported separately as `proven`, `failed`, or `unproven` after the fresh
sessions run.

## Result

Verdict: **delivery proven; behavior proven for the five Phase 3 decisions after one fixture repair
and one source-contract repair.** Each counted run used a fresh disposable Git repository and an
explicitly provided project-local target. No implementation byte was changed by Direct.

### Delivery evidence

- The five Phase 3 behavior cases ran against tree
  `aa281d2a182f7f8dec16658a785989aa668d09cd855bf506bcda6575ee47974d`.
- A later independent review found one dead route word on the unexercised amendment path:
  `reconciliation` was not an allowed state route. Replacing it with the plan-owned `user` route
  produced the current tree `0f58ba29a62dcd58b00a8341eb54ddc183a5ba60c69fd5927244953905b19235`
  in two independent builds. Its first behavior probe belongs to the Phase 4 custody/amendment
  fixture; that path remains `unproven` here.
- `skill-rails check` reported `artifactIntact: true` and `sourceCurrent: true` for `direct`.
- The target remains prose-only with no module, renderer, checker, or declared runtime mechanism.
  Shared state-writer rules reopen at Phase 4 when Work becomes the second writer; the practical
  value of a separate always-read module is currently `unproven`.

### Fresh-use observations

| Case | Host and actual reads | Disposition and writes | Next action | Result |
|---|---|---|---|---|
| 1. binding authentication change | Claude: project `AGENTS.md`; project-local `SKILL.md`; index; Product; Architecture; relevant producer/consumer/retry/test code; Git | `tracked`; one spec/state pair, no code write | `work` implements atomic durable token consumption and replay tests | `proven` after fixture repair |
| 2. large mechanical rename | Claude: project `AGENTS.md`; project-local `SKILL.md`; index; Product/Architecture headers and relevant bodies; six search hits; Git | `ephemeral`; no Work directory and no write | same-turn six-line rename, direct test, and zero old-key search | `proven` |
| 3. dirty change gains later verification | Codex: project `AGENTS.md`; project-local `SKILL.md`; index; Product; Architecture; dirty diff; bounded active-state search; Git | `tracked`; one spec/state pair while preserving the dirty source byte | `work` takes custody, establishes a safe point, then runs bounded staging work before Verify | `proven` after source repair |
| 4. two local closures and shared acceptance | Codex: project `AGENTS.md`; project-local `SKILL.md`; index; Product; Architecture; bounded active-state search; Git | `tracked`; two executable component pairs plus one blocked integration pair | either component may enter `work`; integration stays at `direct` until both land on one merge revision | `proven` after source repair |
| 5. unsafe without vendor evidence | Codex: project `AGENTS.md`; project-local `SKILL.md`; index; Product; Architecture; bounded active-state search; Git | `sketch`; no Work directory and no write | establish PushPort timeout/idempotency behavior from authoritative evidence or controlled staging | `proven` |

The Codex host also read its machine-level RTK instruction and reported an unrelated system-skill
installation permission error. The explicit project-local `SKILL.md` was still the only behavior
target used. No counted run opened generated Direct support-file contents.

### Failure and repair lineage

The first case 1 run chose `tracked` and wrote a usable contract, but asserted that in-memory token
tracking for one process was acceptable. The fixture Product required single consumption while its
Architecture had not stated the already-decided durability seam, so the answer key expected Direct
to know a technical fact the fixture did not contain. Architecture now states that callback
acceptance owns an atomic durable consumed-token registry shared across producers and restarts. A
fresh Claude run then preserved that boundary without asking or inventing another one. This was a
fixture failure, not evidence for more skill prose.

The first case 3 run preserved the dirty byte but called it a `last_safe_point`, routed directly to
Verify, put a code path in `pending_landings`, and added an unrelated knowledge candidate. The same
old entry also let case 4 put component artifact IDs in `pending_landings`. The source was repaired
at the owning state-publication rule:

- dirty bytes are not a safe point and promoted work routes to Work custody before Verify;
- `knowledge_candidates` requires an implementation-discovered durable fact;
- `pending_landings` requires a confirmed fact and its canonical project path, never a code path,
  artifact dependency, or unverified observation.

Fresh Codex reruns produced `next_route: work` with no `last_safe_point` and empty optional lists in
case 3, and kept component dependencies only in the integration blockers with empty optional lists
in case 4. No further exception or field was added.

### Proven, failed, and unproven

- `proven`: persistence is not based on size; the five named routing/decomposition decisions;
  recoverable spec/state publication; collision-checked opaque IDs in observed runs; no code writes.
- `failed then repaired`: missing fixture Architecture evidence in case 1; dirty safe-point and
  optional-list semantics in cases 3 and 4. Both repaired scenes passed fresh reruns.
- `unproven`: amendment of an already active contract, a real binding-choice dialogue, Adoption
  readiness, interruption between checkpoint and spec publication, actual Work/Verify consumption,
  cross-host repetition of every case, and end-to-end effect on delivery. These belong to later
  phases and do not justify a new module, generator, renderer, checker, or fixture family here.
