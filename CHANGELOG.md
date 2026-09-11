# Changelog

What shipped in devflow, newest first. Format: each entry records **what changed and why**
in prose — not Keep a Changelog categories. The version label follows
`.claude-plugin/plugin.json`, which is the canonical version. Entries up to v0.8.3 were
migrated from `DEVLOG.md` (retired at v0.9.0); the Korean originals are preserved in git
history.

**An entry means a deploy artifact changed** — something under `skills/`, `codex/`,
`hooks/`, `scripts/`, or a plugin manifest. Planning, review, audit and document work
leaves no entry here: the document is its own record. A release's raw evidence lives in its
commit message; the round-record layer was removed on 2026-09-11 (git tag `rounds-archive-v1`).
Entries written before that rule existed were removed on 2026-08-14.

**The live file holds the current and previous minor series only.** When a new minor opens, the
series that falls out of that window moves to [docs/changelog-archive.md](docs/changelog-archive.md)
in the same change. The archive is not in any read set — it is recovered from, not read through.

## 0.26.0 - 2026-09-11 - The maintenance document system is rebuilt around one decision per file, one language, and an entry that carries working method

The round-record layer is gone. `docs/rounds/` held 76 files and 1,970 KB; canonical documents named
five of them and 39 files (868 KB) were named by nothing anywhere. What was stranded inside it was not
scaffolding: `v0.13.0/plan_ko.md` §2-§3 carried the owner contract - how to ask, report before
applying, never silently overturn a decision - opening with "you cannot judge without this section",
and no wiring row opened it. That is why every new session started empty. Their rules are now
`AGENTS.md` §1, read on every entry, and the incidents behind them are `docs/working-method.md`.
Git tag `rounds-archive-v1` holds all 76 originals.

Decisions became one file each under `docs/decisions/`. Opening one used to cost 63-76 KB - the whole
subject section - for an average 2.4 KB decision; `decision-index.mjs --id DD-nn` now prints just that
decision. The index is still generated, never hand-written (DD-84's shape, applied to a second source).

`docs/` is Korean, `skills/` and `codex/` and `CHANGELOG.md` are English, and that one line replaces
the declared-pair rules. The `_ko`/English pairs are gone: 720 KB of the same meaning twice, with
fifteen tests watching for a drift they could only detect structurally. Canonical English tokens
that translation had dissolved - journal line heads, card states, `timeout=<value>` style formats,
cross-references - are restored verbatim in a "canonical tokens" section of the decision or backlog
that names them, and the tool-parsed line form of DD-88 is back in English.

`AGENTS.md` is rebuilt as the entry: how to work here, stop signals for non-convergence, read routing,
write routing, and a completion gate where **gate B now runs before every release ships, without
condition** - it had not run since 0.23.8, across eighteen releases, while 588 tests ran on every change.
`docs/README.md` maps every question to one document, `docs/direction.md` holds where this is going
and what is unmeasured, and a GitHub Actions job runs the invariant and projection checks on push.

New: `scripts/runtime-map.mjs` projects stages, guards, declared roles and routes from the nine specs;
the role invariant now discovers roles from it instead of a hardcoded list that guarded five of seven.

The completion gate is rebuilt as judgment rather than a checklist. The format wall - three suites,
about ten seconds - always runs; a behavior suite runs when you changed that behavior, and the AI
judges which. Above it sits the real gate: five questions answered in writing about entry, coherence,
holes, use, and `unproven`, carried by the release commit message. Four invariants that only preserved
a shape were removed in the same change (the exact nine-section count, the four strings `AGENTS.md`
had to contain, and two forbidden strings), two round-layer string checks went with the round layer,
the entry ceilings (`AGENTS.md` 6 KiB, `docs/design.md` 26 KiB, 32 KiB together) became one 42 KiB
ceiling on the four always-read documents, and the protocol-routing invariant - whose regular
expression had lost its escapes during the rewrite and matched no section - checks again.
Measured basis: across this round the full suite caught none of the four defects independent logic
review found; the format wall fired only on shape drift.

The live CHANGELOG now holds the current and previous minor series; 0.10.0-0.24.0 moved to the archive.

Decisions: DD-112 (four bounded entry documents), DD-113 (gate B unconditional, evidence homes named),
DD-114 (round layer removed), DD-115 (one language rule), DD-116 (the gate is judgment, and logic
verification is its body). DD-16 and DD-72 are replaced; DD-71 and DD-93 are partly corrected;
DD-112 is partly corrected by DD-116 in the same release.

`unproven`: **gate B has not been run, so 0.26.0 is a committed candidate and is not pushed until it
runs.** The cold before/after entry comparison ran on a read-only Claude session: comprehension did
not fall and no deletion was proposed before reading source; a second cold run found 34
contradictions, closed in this change, and no cold run has read the tree after those repairs. No
Codex arm was run. No real-use session has entered through the new documents.

Files: `AGENTS.md`, all of `docs/` (renamed, translated, restructured),
`docs/decisions/` (116 files, new), `scripts/{decision-index.mjs,decision-index.test.js,runtime-map.mjs,runtime-map.test.js,repository-invariants.test.js}`,
`.github/workflows/checks.yml` (new), both plugin manifests, deleted `codex/AGENTS-devflow_ko.md`,
deleted `docs/rounds/` and `docs/blueprints/` (git tag `rounds-archive-v1`).

## 0.25.1 - 2026-09-11 - The role briefing rides its own DISPATCH instead of five copied files

0.25.0 closed the role-briefing gap by adding one contract file per dispatching role. Measured after
the fact, those five files were 93.7-97.8% identical: 72% of each was byte-for-byte the same in all
five, and the only per-file difference was the H1 title and one role id. That is the shape this
repository exists to prevent - one instruction changed in five places, drifting apart between edits.

The six contract `READ` effects are gone and no replacement sentence takes their place. An inlined `brief` argument and a shared policy-index row were each built and measured first; both were removed, because either one is a copy or a pointer to a sentence devflow does not own. devflow carries no delivery instruction for this. Verify and Work already declare roles and briefed them correctly without one in 0.23.3 and 0.23.8; the one observed failure was Adopt, which declared no role at all, and declaring it closes that. No evidence shows the sentence is needed.
`adopt/references/refuter-role.md` and `arch/references/channel-verifier-role.md` are deleted.
Verify's three and Work's one return to their locator form, because obligation-ledger atoms and the
repository companion-home invariant hold those exact paths while their content was a second copy of
the `role:` sections in their own `body.md`. Principles' four orphan role sections - reviewer,
verifier, auditor, retrospector, none of them anchored by any ledger atom - are deleted with their
declarations; `coordinator` stays, anchored by 44.

Net -3,692 B of authored bytes, two files fewer, six effects fewer, four role declarations fewer,
and no change to any judgment, state, guard, or commit boundary.

Files: `skills/principles/{spec.mjs,body.md}`, `skills/{adopt,arch,verify}/spec.mjs` and their fixtures, `skills/{verify,work}/references/*-role.md`,
deleted `skills/adopt/references/refuter-role.md` and `skills/arch/references/channel-verifier-role.md`,
three regenerated P2 receipts, `docs/design.md` pair, `docs/design-decisions.md` pair (DD-111 coordinates),
`docs/rounds/v0.25.0/report-0.25.1_ko.md`, both plugin manifests.

## 0.25.0 - 2026-09-10 - Adopt's refutation becomes a declared role, and a premature approval stops at a guard

Two real 0.24.0 Adopt runs reached the irreversible first canonical write set on producer-supplied
values alone. One narrowed the refuter's brief until the blocking check for verification means fell
outside it. The other resumed after an interruption and headed straight for the write plan, because a
stage BLOCK that asks for one caller value seals every value supplied with it and inherits it into the
next call - so an `approve` typed while refutation was still unknown rode a refutation question into
the approve row, skipping the write-free proposal and its question.

Adopt now declares `ROLES.refuter` with its inputs, reads, judgments, and a `refutationResult` return
template. Both refutation branches open the refuter contract and `DISPATCH` that role before `WAIT`,
so the brief is the runtime's own `role` render rather than prose the producer assembles, and the
returned `coverage` field carries initial coverage across a correction. `refutation.state` moves to the
`decided` lane it shares with Verify's returned verdicts, leaving Adopt with no producer self-judgment.
A new guard, `approval-precedes-refutation`, blocks an `approve` that arrives while refutation is not
`clear`; a guard stop carries no needs, so it emits no continuation seal and the next call falls to the
write-free proposal. Verify's three dispatches and Arch's channel-verifier dispatch gained the same
role-contract `READ`, and the three Verify stubs plus two new files now say how to hand a contract to a
clean context. Adopt still writes nothing before approval, and no state, marker, or collector was added.

Files: `skills/adopt/{spec.mjs,body.md,references/workflow.md,references/refuter-role.md,templates/refutation-result.md,fixtures/*}`,
`skills/verify/{spec.mjs,references/{verifier,auditor,retrospector}-role.md,fixtures/scenarios.json}`,
`skills/arch/{spec.mjs,references/channel-verifier-role.md,fixtures/scenarios.json}`,
nine regenerated P2 receipts, `scripts/project-state.test.js`, `docs/design.md`,
`docs/design-decisions.md` (DD-111; DD-102 and DD-106 partly corrected), `docs/usecase-matrix_ko.md`,
`docs/rounds/v0.25.0/report_ko.md`, both plugin manifests.

