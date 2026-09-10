# devflow decisions and rejection lineage

This file is the one home of a decision, and the decision index is generated from it (`node scripts/decision-index.mjs`). Each subject holds its decisions in full alongside the proposals rejected under it — overturning a decision and re-proposing a rejected idea pass through the same gate.

**To overturn a decision, refute its recorded reason first. To re-propose a rejected idea, refute its recorded rejection reason first.**

## Identity, packaging, platforms

### DD-01 · Output folder named `devflow/` (not docs/)

Subject: Identity, packaging, platforms | Introduced: origin | State: active, partly corrected by DD-98 (v0.21.0)

Avoid collision with existing projects' docs/. DD-98 preserves this reason while narrowing
the current output-root spelling to `.devflow/`.

### DD-02 · Name is devflow — Claude uses the `devflow:` namespace, Codex uses the `devflow-` filename prefix

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Blocks skill-name collisions at the source + groups autocompletion. The original name was nano-devflow; shortened in v0.9.0 because commands were needlessly long in real use — the namespace/prefix structure is unchanged, so the collision-blocking reason still holds

### DD-03 · Canonical rules live inside skills/principles/

Subject: Identity, packaging, platforms | Introduced: origin | State: active, partly corrected by DD-92 (v0.20.0)

Under the skills.sh standard (installers that copy only skills/), the canon travels along

### DD-04 · Codex prompts embed the canon (no file reference)

Subject: Identity, packaging, platforms | Introduced: origin | State: replaced by DD-57 (v0.13.0)

The Codex prompt folder is flat; relative references are unreliable (corrected 2026-08-13: that reason was true only of `~/.codex/prompts/` and does not reach the plugin cache — DD-57 refuted it by live probe and removed the generation channel itself)

### DD-05 · One hook only: SessionStart

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Stop fires every turn — noise; PreCompact is unnecessary given the "progress log is always on disk" covenant. SessionStart also fires right after compaction, so it covers all three

### DD-12 · Cross-references between skills use slash-less stage names

Subject: Identity, packaging, platforms | Introduced: origin | State: active

Actual commands differ per tool (`/devflow:x` vs `/devflow-x`)

### DD-13 · install.ps1 requires UTF-8 **BOM**

Subject: Identity, packaging, platforms | Introduced: origin | State: active

PowerShell 5.1 parses BOM-less files as ANSI → Korean script corruption (actually reproduced)

### DD-16 · Design in Korean, deploy in English (dual language)

Subject: Identity, packaging, platforms | Introduced: origin | State: active, partly corrected by DD-93 (v0.20.0)

Korean is the language the user can review; English is what AI understands best at the lowest token cost. Procedure and terminology: `docs/maintenance-protocol.md` §2 and §9

### DD-93 · P2 runtime skills are generated from English `spec.mjs` and `body.md`, while Korean legacy atoms preserve only migration provenance (v0.20.0)

Subject: Identity, packaging, platforms | Introduced: v0.20.0 | State: active

Observed conflict: applying DD-16's Korean design-original rule to P2 runtime packages creates
a second Korean behavior source that the generator does not read, while DD-92's description of
`spec.mjs` as the sole behavior source omits the prose obligations owned by `body.md`.

Chosen boundary and refutation: declared Korean/English pairs in owner-reviewed documents and
the Codex adapter remain Korean-first and receive 1:1 review. Only P2 runtime skills use English
`spec.mjs` and `body.md` as executable authored canon; `SKILL.md` and `.generated.json` are their
generated projection and receipt. Korean atoms under `references/legacy-atoms/` preserve migration
provenance, not a live pair or behavior source. DD-16's owner-review reason therefore remains valid
for the surviving declared pairs but does not justify a second home for P2 behavior consumed only
from English sources.

Affected coordinates: DD-16, DD-92, the document map, the `AGENTS.md` language boundary,
maintenance protocol §2, and P2 package `spec.mjs`, `body.md`, generated `SKILL.md`, and legacy
provenance. Revisit when the owner must directly review runtime wording or the generator starts
consuming a Korean source or legacy atom as behavior input.

### DD-100 · Repository hard gates block reproducible contract violations; semantic heuristics do not prescribe skill prose (v0.23.6)

Subject: Identity, packaging, platforms | Introduced: v0.23.6 | State: active

Observed problem: devflow's own semantic audit, added during the P2 migration, used the number of
ledger atoms landing on one target as a proxy for semantic landing and failed the whole suite above
a threshold. In Principles it counted three repeated locators inside the same atoms as separate
semantic edges, so it failed even though the unique atom count was below the threshold. In Adopt it
found provenance debt where older designs were projected broadly onto the current stage, but that
result did not demonstrate a current runtime failure in stage selection, state calculation, or
writing. Splitting stages, expanding prose, or mass-changing ledger dispositions merely to clear
that signal would make the check an answer key for the product and create repairs and long
verification work unrelated to behavior.

Desired behavior: repository checks give an AI a wall at quiet loss, wrong action, and broken
execution boundaries, while leaving it free to choose among purpose-equivalent prose and semantic
structures. Smells worth reviewing remain visible, but their number or name alone neither fails the
current skill nor chooses its repair.

Chosen boundary: a repository tool returns nonzero only when current bytes directly establish an
executable or structural contract violation with a concrete failure path under audit guideline §2.
Broken JSON, an unloadable spec module, explicit `review-required`, missing package inputs or
scenarios, and missing collector or raw-fact fixtures in state-calculating packages remain hard
walls. A reserved migration placeholder is also hard: it has no valid authored location, so its
exact byte directly establishes an incomplete artifact. Fan-in size, duplicate locators within one
atom, broad migration projections with no visible current semantic target, apparently unused
observations, judgment or progress-shaped names and completion reads, effect-free `NEXT` branches,
and possible retired-policy-owner wording are advisories. That group is detected through names,
counts, or lexical scans that cannot establish meaning. Target accounting separates unique
atom-to-target edges from raw occurrences. An advisory stays visible in the root suite and starts
review; it grants neither authority to change the skill nor a condition for passing. The audit reads
the observations actually exported by `spec.mjs` instead of guessing a second grammar. Its direct
suite fixes the hard/advisory split, duplicate-edge behavior, explicit unresolved state, multiline
and commented observations, placeholders, and an explicitly requested missing package.

Why the boundary is needed: DD-92 and DD-93 preserve portable provenance as source and generation
evidence; they do not promise that ledger density computes current semantic quality. Skill Rails
also separates deterministic structure from model judgment and rejects using fixtures as product
answer keys. This boundary therefore weakens no upstream guarantee. It limits only the authority of
devflow's added audit to what its evidence can prove. Existing repository tests for paths, formats,
parsers, Git transitions, installation, and trigger consumers retain their hard status because each
has a concrete failure path.

Rejected alternatives: deleting the semantic audit would lose real risks such as explicit
unresolved provenance and self-reported completion. An Adopt or Principles allowlist, or merely
raising the threshold, repeats the same false positive in the next package. Stage splits, prose
growth, and bulk legacy-atom reclassification done to silence a warning fit the product to the
check without proving behavior. Making every semantic signal a hard gate delegates judgment to
names and counts.

Affected coordinates: `scripts/skill-rails-semantic-audit.mjs` and its direct suite,
`scripts/repository-invariants.test.js`, audit guideline §3, DD-92, DD-93, and future maintenance
sessions that inspect P2 obligation ledgers. This audit boundary does not require changes to skill
prose, ledgers, or generated bytes.

Revisit when one advisory class is causally tied to a reproducible current-byte execution or loss
defect, a remaining hard check rejects a valid package, or upstream supplies a deterministic
semantic contract that replaces a heuristic. An observed failure path still comes first; changing
a threshold alone never creates a hard gate.

### DD-101 · Project membership reads only the current `.devflow` root and current index; Git history remains recovery evidence (v0.23.7)

Subject: Identity, packaging, platforms | Introduced: v0.23.7 | State: active

Observed problem: the state tool used `git log --all -- .devflow` as membership evidence. A
checkout with no `.devflow` at all therefore became `setup.no-product` when a sibling worktree
branch or remote-tracking ref had carried that path. Explicit Adopt was diverted to Resume's setup
question. Shallow clones and broken unrelated refs took the same conservative route because of
history observability rather than the current checkout.

Desired behavior: the cheap evidence a person can see in this checkout agrees with membership. A
current working-tree `.devflow` root or any `.devflow` path in the current index protects partial
state. When both are absent, first-time Adopt opens regardless of other refs or prior commits.

Chosen boundary: the canonical state tool first observes the current `.devflow` root, then, only
when it is absent, the current index's `.devflow` entries. An empty, partial, or users-only root is
current evidence. Only absence from both yields `setup.unmanaged`; a staged or committed total
deletion is judged by that current state as well. A failed index command or undecodable output does
not prove absence and remains `setup.no-product`. Git history and other refs are material a person
may recover with Git, not current membership, so the state tool runs no global-history query for
this decision. After membership, current Product absence emits `setup.no-product`, while DD-92's
approved pre-Product `00-project` research retains its earlier position under the existing
`zoneOrder` owner. When current Product exists but current HEAD has no committed Product boundary, the state tool emits
the higher-priority `setup.layer0-uncommitted`: current journal bytes still receive integrity
validation, but history-derived lifecycle and capability-baseline recovery wait for the first Adopt
commit. An unreadable current-HEAD boundary is blocking integrity evidence rather than permission to
skip that net. Product and Direct consume this canonical setup fact even when a higher git or
integrity route coexists: Product returns to Resume instead of treating the draft as committed
truth, and Direct returns before any request, research, or card effect.

Why the boundary is needed: DD-95's asymmetric-error ground fits SessionStart's weak fixed-pointer
eligibility check, but a false managed result from the action-owning state tool has no later
authority to correct it. It demonstrably closed explicit Adopt. By contrast, Resume ends
`setup.unmanaged` without writing, and explicit Adopt remains discoverable by the user's choice.
Current root plus index protects uncommitted and staged partial state without letting a sibling ref
take ownership of this checkout. The committed Product boundary gives every consumer the same point
at which historical recovery becomes authoritative. Ordinary managed recovery without a current
Product precedes a stale marker without taking DD-92's pre-Product research away. This corrects
DD-97's history-recovery and untracked-partial-path clauses while preserving one state owner and
direct named-stage entry.

Rejected alternatives: removing only `--all` needs a new unborn-HEAD branch and still makes prior
commits membership. Excluding only users paths from the index splits one current `.devflow`-root
fact into role-specific exceptions and is unnecessary for this current-evidence purpose. Copying
history or index observation into SessionStart recreates DD-95's rejected second predicate.

Affected coordinates: `skills/principles/scripts/project-state.mjs`,
`scripts/project-state.test.js`, `skills/principles/references/delivery/commit-and-verification.md`,
`skills/principles/references/knowledge/writers-and-migration.md`, Product's canonical-state entry
collector, Direct's canonical-state collector and early recovery guard, Product and Resume P2
recovery rows, Adopt's interruption boundary, DD-95, DD-97, matrix
§3.24, deploy manifests, CHANGELOG, and maintenance protocol §9. The existing zone array owns setup
priority and `zoneOrder` owns DD-92's cross-zone research order; SessionStart, Arch's authoring
contract, and the remaining skills' ordinary entry do not change.

Revisit when a current `.devflow` root or index path is declared unmanaged, a checkout with neither
is kept out of Adopt by another ref, an index-observation failure is mistaken for absence, or this
current-evidence rule sends an existing managed Resume/Arch path back to Adopt.

### DD-18 · The Codex install leads with the native plugin channel (marketplace add + plugin add); generated slash prompts stay as the explicit channel; the hook stays separately registered in ~/.codex/hooks.json (v0.9.9)

Subject: Identity, packaging, platforms | Introduced: v0.9.9 | State: active, partly corrected by DD-57 (v0.13.0)

Probed live: Codex consumes Claude-format marketplaces directly and model-invokes SKILL.md skills — a clean Codex session recognized all 8 devflow skills. Plugin-delivered hooks are a removed feature in Codex, so hook registration stays separate. The old prompts-only channel predates these capabilities and made auto-invocation Claude-only — the last platform asymmetry. Recurrence is guarded by the pre-flight item "install channels target each platform's current native mechanism" (corrected 2026-08-13: the "generated slash prompts stay" clause was superseded by DD-57 (v0.13.0), which removed that channel, and the "hook registered separately" clause by DD-32 (v0.9.20), which rides hooks with the plugin. What survives is the native plugin as the one channel)

### DD-29 · Platform adapters only connect to the shared skill; they do not duplicate its procedure (v0.9.21)

Subject: Identity, packaging, platforms | Introduced: v0.9.21 | State: active, partly corrected by DD-92 (v0.20.0)

Claude and Codex share the same semantic rules in SKILL.md and the role contracts. The Codex fallback AGENTS copied only part of resume, omitting journal, freshness, and integrity checks; the hook separately decided the next Layer 0 stage; and the local installer registered both the plugin hook and the old global hook. The fallback and hook now only route to shared resume. The hook injects no file content, HANDOFF, or next-stage classification. The installer removes the exact old registration only after the native plugin succeeds, preserving a working predecessor when replacement fails. A malformed `owner.md` keeps multi mode active, but a valid resolved room stays writable; only a session whose identity remains unresolved fails read-only. These are transport repairs to one contract, not platform-specific policies

### DD-32 · Codex hooks ride along with the plugin — `.codex-plugin/plugin.json` declares `hooks`, and installing is two remote lines (v0.9.20)

Subject: Identity, packaging, platforms | Introduced: v0.9.20 | State: active

Probed live (2026-08-11), refuting v0.9.9's recorded ground ("plugin-delivered hooks are a removed feature in Codex"): the Codex binary carries the strings `hooks/hooks.json` and `CLAUDE_PLUGIN_ROOT`, and a plugin in real use (claude-mem) delivers hooks by declaring them in `.codex-plugin/plugin.json`. Giving devflow the same manifest made SessionStart actually fire with the manual registration moved aside. The Claude manifest needs no such declaration — Claude auto-discovers `hooks/hooks.json` (the duplicate was removed). Confirmed alongside it: `codex plugin marketplace add` takes `owner/repo` directly, so no clone is needed. That makes the README's Codex install the same two lines as Claude's. The installers stay — they are the path for local development installs (the canonical route in this repository's own records) and for the slash-prompt channel

### DD-57 · The flat Codex prompt channel is removed; the plugin cache carries the companions (v0.13.0)

Subject: Identity, packaging, platforms | Introduced: v0.13.0 | State: active, partly corrected by DD-92 (v0.20.0)

Probed live (2026-08-13): Codex installs a plugin into `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`, the whole repository, and the model reads its skill from that absolute path - so `../principles/SKILL.md` resolves there exactly as it does in Claude. The recorded reason for embedding ("the Codex prompt folder is flat, relative references are unreliable") was true of `~/.codex/prompts/` and does not reach the plugin. The eight prompts held 50-120 KB each, embedding the whole rulebook, and two installers each carried their own embedding logic, so every rule change had to be applied twice. Removing generation alone would leave earlier files callable, so cleanup deletes the exact eight names for one release, keyed to the generated marker, and a file a user wrote under one of those names survives

### DD-71 · The always-read maintenance entry is design in full plus a decision index generated from the source; AGENTS routes detailed procedure conditionally, and history is not onboarding (v0.16.2)

Subject: Identity, packaging, platforms | Introduced: v0.16.2 | State: active, partly corrected by DD-84 (v0.19.0)

Observed problem: a new maintenance session first paid for the automatically entered
30,716B `AGENTS.md` and the always-read 20,080B `design.md`, then walked README at 42,569B,
CHANGELOG at 63,177B, and round records to learn the structure. The Claude baseline spent
68,773 input-token cache creation and 180.3 seconds while still reporting that it had not
opened most entry-skill bodies. The root AGENTS alone also sat near Codex's default 32KiB
project-instruction limit, leaving room for lower instructions to be silently truncated.

A second observation, v0.19.0: the structure built then left the decision index as a **manual
table inside `design.md`**, and that table produced three things. ① **An 8-of-80 drift** from
the source — 8 of the 80 rows carried a sentence different from the decision's own title.
② **A budget collision** — of the 32,679 B always-read fixed cost (AGENTS 6,136 + design
26,543), 14,012 B was that table, and the 26 KiB cap left 81 B of headroom, so v0.18.9's two
decisions could not take a row and their reasons stayed trapped in a round record.
③ That structure grew an **always-read** document in proportion to the decision count.
This decision's always-read entry is therefore not a place that carries the index by hand.

Measured across v0.19.0 (80 → 84 decisions): the always-read entry went from 32,679 B to
**31,370 B** (AGENTS.md 6,136 → 6,142, design.md 26,543 → 13,331, the generated index 11,897).
**The byte reduction is small, 1,309 B** — this change's product is not subtraction but one
home, zero drift, and moving the growth that tracks the decision count **outside the fixed-size
`design.md` and its 26 KiB cap**. The generated index remains always-read, and its per-row cost
fell from 175 B to 141.6 B.

Desired behavior: a new session first understands the whole philosophy, structure,
invariants, decisions, and why every skill exists, then opens every actual source inside the
impact boundary of a concrete change. History and conditional operating procedure are read
only when needed, and lower comprehension rejects the refactor regardless of token savings.

Chosen boundary: **the always-read entry is `design.md` in full plus the output of
`node scripts/decision-index.mjs`.** `design.md` is the only whole-system intent map, and the
decision index is not a table inside it but a read-only projection of the decision source,
whose reason DD-84 owns. `AGENTS.md` owns only an automatic entry gate and wiring capped at
6KiB. Detailed procedure lives by section in one `maintenance-protocol` pair, and every
section must be reachable from root wiring. Whole README, whole CHANGELOG, multiple rounds, and
blueprints are not onboarding. No manual `CURRENT.md`, separate maintenance map, or free-form
note layer is created. The generating command is not a document role, so it takes no row in the
document map. A map alone can never authorize deleting, moving, or consolidating an affected
skill before its source is read.

Why the boundary is needed: `design.md` already owns origin, structure, the document map,
invariants, and the skill intent index, and the decision index is projected from its source. A
separate map creates the second knowledge layer and freshness race DD-28 forbids. Keeping every
detailed procedure in AGENTS instead charges translation, round, README, and release rules to
sessions that never use them. This boundary keeps one home for intent and one for procedure
while making only the reading conditional.

Rejected alternatives: shortening or splitting skill sources is outside this decision and
belongs to a separately scoped session. An AI-written omnibus summary and `CURRENT.md` turn
one missed update into a quiet wrong judgment; a maintenance map gives one concept two homes
with design. Shrinking README or CHANGELOG into onboarding material contaminates human
explanation and shipped history with current-canon duties.

Affected coordinates: `AGENTS.md`, `docs/design{_ko}.md`,
`docs/maintenance-protocol{_ko}.md`, `scripts/decision-index.mjs`, and
`scripts/repository-invariants.test.js`. Revisit
when a clean Claude or Codex entry misses any critical invariant, component, consumer, or
design reason; when input to the first safe plan exceeds 70% of the baseline; when either
`AGENTS.md` or `design.md` exceeds its existing cap; or when the generated index exceeds an
average 150 B per decision without a new column that gives the reader new decision meaning.
Growth caused only by more decisions is measured separately from those four conditions.

### DD-72 · A versioned implementation with no named document role leaves one report_ko.md as its default round record (v0.16.2)

Subject: Identity, packaging, platforms | Introduced: v0.16.2 | State: active

Observed problem: the old rule called a change large enough for its own version a round and
required the round to leave records, while also allowing only the role the owner requested.
An independent audit found both a literal conflict when a versioned implementation named no
role and a missing read edge from the version-bump wiring to that rule.

Desired behavior: a versioned implementation leaves its verification and limitations for
the next session, while plan, request, audit, and every other role remain absent unless the
owner requests them.

Chosen boundary: only when a versioned implementation request names no round-document role,
one `docs/rounds/<version>/report_ko.md` is the default record. Version-bump wiring opens the
round protocol. This default does not create another role or authorize revising an existing
record.

Why the boundary is needed: report is the existing owner of shipped results, verification,
unrepaired findings, and limitations. It joins version to evidence without a new concept.
Making plan the default writes a plan after implementation; leaving no record makes the next
session infer verification boundaries from CHANGELOG alone.

Rejected alternatives: a complete document set for every version adds cost and false
missing-work signals. A roleless free-form record bypasses the document map. Arbitrarily
attaching the change to an older round blurs version lineage.

Affected coordinates: `AGENTS.md`, `docs/maintenance-protocol{_ko}.md`,
`docs/rounds/<version>/report_ko.md`, and `scripts/repository-invariants.test.js`. Revisit if
an existing role smaller than report can preserve the same evidence without loss for an
unnamed versioned implementation, or if a real repair release conflicts with the rule that
keeps its record in the preceding round.

### DD-79 · README is a person's document and lives outside the AI's read set — not read, not updated, not used as grounds for a judgment, and the line holds after README returns (v0.18.5)

Subject: Identity, packaging, platforms | Introduced: v0.18.5 | State: active

Observed problem: the owner had instructed **earlier** that README not be consulted, and the
wiring stayed alive anyway. The instruction was recorded in no decision, so it quietly grew
back round after round. A sweep found all three directions still live — the canon handed a
residual risk to a "README guideline" (`skills/principles/SKILL.md:557`), the role contract
listed README as one of three paths by which it is discovered
(`skills/principles/coordinator.md:2`), maintenance protocol §6 taught an AI how to **edit**
README prose, test assertions read README content as grounds for a judgment, and two matrix
cells set "the guideline exists in README" as a verification condition. As skill development
grew frequent, citing and updating README became a repeated cost on every pass.

Desired behavior: README is a document a person reads, and no AI work is affected by it. The
owner decides directly what goes in it and when.

Chosen boundary: what skills, tools, and procedures reach is `skills/`, `scripts/`, `hooks/`,
`codex/`, `docs/`, and the manifests; README is beyond that edge — not read, not updated, not
used as grounds for a judgment. **This line holds after README returns.** What returns is the
file, not the wiring.

Why the boundary is needed: written as a "suspension", the next session reads it as "the
wiring returns when the file does", and that is precisely the path by which it grew back this
time. Deletion alone is not enough either — deletion removes a file, it does not draw a line.
Only a line keeps the wiring from following the file back. One cost is recorded honestly: the
canon of the list of places devflow **declares it does not guard** now sits outside this line.
Moving that list somewhere an AI reads looks like the answer, but that builds a new home, and
the owner asked for no move. The list stays the owner's.

Rejected alternative: **move the table into `docs/design.md`** — it builds a new home for
people-facing prose, and "one fact, one home" forbids the copy. **Leave §6 marked as
suspended** — rejected for the reason above. **State the same boundary in `AGENTS.md` too** —
it charges the minimal entry gate every session and puts one fact in two places. The boundary
has one home, `docs/design.md`.

Affected coordinates: `docs/design{,_ko}.md` (the boundary paragraph, the invariants section,
the document map), `AGENTS.md` (the wiring row, the one-fact-one-home list, the onboarding
exclusion list), `docs/maintenance-protocol{,_ko}.md` (§1, §2's pair list and Korean
exception, §3's landing table, §6, §8's checklist), `skills/principles/SKILL{,_ko}.md`,
`skills/principles/coordinator{,_ko}.md`, `scripts/repository-invariants.test.js`,
`scripts/session-start.test.js`, `docs/usecase-matrix_ko.md` cells 3.4 and A20, and
`docs/design-backlog{,_ko}.md`.
Revisit when: the owner decides to use README as an input to AI work again. What is reverted
then is this line, not a file.

### DD-80 · The executor of a machine judgment is code, and the document that wrote that judgment down is deleted in the release after its last runtime reader moves (v0.18.7)

Subject: Identity, packaging, platforms | Introduced: v0.18.7 | State: active, partly corrected by DD-83 (v0.19.0)

Observed problem: `resume` entry spends **137,514 B** of canon before it reads one character
of a target project file (measured at 0.18.6 — resume 30,477 + principles 67,498 + canonical
state predicates 2,114 + canonical verification predicates 3,495 + 33,930 of the baseline
predicates outside the capsule gate). Most of that canon is not a rule that asks for the
model's judgment but a **computation whose truth is settled by disk and Git facts alone** — a
full classification of the canon's 295 lines put 221 in what a tool can execute, 23 in
sentences said to a person and judgments of meaning, and 51 on the boundary where a
conversation or an approval lands. Of resume's 48 routing rows, **exactly one reads the
conversation**. And because the prose writes that computation down literally, the model runs
it by hand — "split that output on NUL", "run that same pipe inside `cmd /d /s /c`", "never
drop `--no-renames`" are those sentences.

Desired behavior: a read-only tool executes that computation. `resume` calls the tool **once**,
reads only the **action side** of the first non-empty zone on the sheet the tool produced,
reports, obtains approval, and calls the stage. The canon tax does not disappear — **the stage
actually entered after approval pays it.**

Chosen boundaries, four:

① The tool lives **in the same place as the canon**
(`skills/principles/scripts/project-state.mjs`) — it is reached by the same relative-path rule
that reaches the canon, and it travels with the canon on all three install channels. The
`<plugin root>` resolution defect v0.18.6 removed from eight call sites is not recreated at a
new site.

② Prose does **not restate** the internals of a judgment the tool owns
(`baseline-predicates.md:348-349` already writes that sentence for the capsule tool).

③ **The release after the one that moved a predicate document's last runtime reader deletes
that document. Git carries the past.** Sentences said to a person, judgments of meaning, and
approval discipline stay prose.

④ **The tool emits facts and takes no conversation.** The call is `state` alone and the input
is `--root` plus one filter (`--capability`). The output is **fourteen zones** in
priority order and **an empty zone still prints its line**; the closing `next:` names the first
zone that is not empty and its kind — a summary derived from the facts, not a contract. What
the session knows (a named card, a deferred item, this conversation's request) is written by
the model, not encoded into the tool.

Partly corrected in v0.19.0 (DD-83): read-only and stateless are unchanged; only ④'s input and
output contract narrows. `--card`, which had no consumer at all, is removed — it parsed and
changed no judgment. `--capability` becomes a **render filter applied after the judgment, not a
snapshot filter applied before it**: global consistency is always computed from the whole
snapshot, and only the per-capability lines (claim, ready, blocked, layer, carry) are narrowed
in the render. The expensive capability-document detail has no global consumer, so it is
computed only for the one capability when a number is supplied. The git, integrity,
transition, marker, setup, request, event, product, and
complete facts are not narrowed, and when there is nothing to narrow the output shows
`narrow=none` instead of a false recall instruction. And boundary completeness's `missing` and
`carry`, together with `digest` and `origin`, are not new judgments but **an extension of the
same disk and Git fact emission**.

Why the boundaries are needed: allow restatement and the document and the code diverge, and at
the moment they diverge nobody can say which is canonical. "Keep it as a specification" is a
second home, and the moment two homes exist a mechanism to bind them has a reason to exist —
**make it one home and no mechanism is needed.** And placing the tool outside the canon creates
the scene where "the canon travelled but its executor did not", which then needs another file
to cover. ④ is needed for a different reason: encoding a session fact into a flag requires the
model to **remember that fact first**, and once the memory is in the model, the difference
between judging from it directly and encoding it for the tool is one round trip and eight
contract surfaces. A flag does not replace memory; it transcribes it.

Rejected alternatives: **53 joined keys, six subcommands, and eight session flags** — the
contract surface grows and prose carries the protocol for it, and telling whether a key is
wrong means opening the condition side again, which is why a separate flag for the exhaustive
verdict becomes necessary. Fourteen fact zones with empty ones printed carry the same
information under **fewer contracts**. **Generate the document from the code** — code cannot
hold the *reasons* prose carries. **Keep the document permanently as a specification** — it
breaks one-fact-one-home and stops DD-25's "owns … once" from being literally true. **Put the
tool in `scripts/` and leave the condition-side prose in `skills/`** — one more file, one more
ko/en pair, and one more mechanism, and the placeholder-resolution defect v0.18.6 removed
appears again at a new site. **Shorten the prose with no tool** — an earlier generation already
failed at this and the total recovery stops at 5–10 KB.

Affected coordinates: `skills/principles/scripts/project-state.mjs` (new, 88,382 B),
`scripts/project-state.test.js` (new, 37,898 B, 114 new tests),
`skills/resume/SKILL{,_ko}.md` (rewritten — 30,477→21,713 B, 32,042→22,893 B),
`skills/{verify,work,split,arch,adopt}/SKILL{,_ko}.md` (the entry sentence and the places that
use those judgments), `skills/principles/{state,verification}-predicates{,_ko}.md` (no skill
reads either — deleted in the next release),
`skills/principles/baseline-predicates{,_ko}.md` (dropped from resume's consumers),
`scripts/repository-invariants.test.js`, two rows of the skill intent index in
`docs/design{,_ko}.md`, one wiring row in `AGENTS.md`, two terms in
`docs/maintenance-protocol{,_ko}.md` §9, one observation in `docs/design-backlog{,_ko}.md`. The v0.19.0 correction's own coordinates are
owned by DD-83.

Revisit when: a third-party skills.sh install is actually used and that channel is observed
not to carry `skills/<name>/scripts/*.mjs` · the routing table's conversation-dependent rows
grow past one · leaving integrity item 14's prefix clause at `prefix=unchecked` in v1 is
observed to miss a defect in practice · a real session is observed going to a zone other than
the one `next:` named and the cause is "the facts were visible but the order was misread" —
what moves then is the standing of that one `next:` line, not the return of a key registry

### DD-82 · When two canon rules point to different actions in one place, report both sources and the side taken, then continue (v0.18.9)

Subject: Identity, packaging, platforms | Introduced: v0.18.9 | State: active

Observed problem: the first real-use test produced seven prose-against-prose conflicts. From the
same three ADR conditions one session raised SSE and the other raised SQLite as the ADR — **exactly
opposite conclusions**. The code-structure table's `3+ capabilities` and `Under 20 files` were true
at once. Then the capability document's heading order, `slug` against "do not normalize the slug",
the planning order, the addressee of `always ask`, and the English identity frame. On the heading
order **one session filled the gap silently and the other reported it, then chose.**

Desired behavior: when two canon sentences both apply and produce different actions, do not choose
silently. Report both sources with their coordinates, the side taken, and the reason — then
**continue**.

Chosen boundary: report, then continue. This event alone does not stop the session.

Why the boundary is needed: the rule is not new. `AGENTS.md`'s Hard boundaries already say
*"Report before judgment calls are applied."* — it **lived only in the maintainer's document and
runtime sessions had never received it.** This writes no new rule; it moves an existing one.
devflow already has an arbitration machine for mismatches a machine can check (integrity items
12–15 → present the source, the expected form, and a replacement → user confirmation → landing).
**Prose against prose had no such machine.**

Rejected alternatives: **stop** — a session would halt on every prose conflict, recreating the very
disease this lineage is treating (a harness locking product work). Stopping is decided by the
existing gates (Layer 0 change confirmation, binding decision). **Cover it with DD-11** — DD-11
handles a contradiction **between documents**, and this decision handles **two rules of the canon
itself applying together**. DD-11 does not move.

Affected coordinates: `skills/principles/SKILL{,_ko}.md` and `docs/rounds/v0.18.9/report_ko.md` §4.
Revisit when: reporting and continuing is observed to have produced a wrong artifact.

### DD-83 · One read-only computation shows the difference between the complete transition state the canon already fixed and disk, at entry and before each passenger's commit (v0.19.0)

Subject: Identity, packaging, platforms | Introduced: v0.19.0 | State: active

Observed problem: comparing the 81 commits of the first real use, **every duty with its own
artifact and its own commit was kept, without exception** (card state renames, task commits,
`verify.md`, the progress log, commit-message form), and **only the duties that ride on someone
else's commit eroded** (advancing the digest marker, refreshing HANDOFF, the final card's
`carry:`, arch's channel confirmation). The canon itself wires HANDOFF as a passenger — *"it only
rides here"*. The invalid premise was not "AI follows rules" but **"writing it clearly makes it
run"**: in the same record those sessions kept four rules that cut against their own convenience.

Desired behavior: do not add a rule or a commit per duty. The tool shows the difference between
the complete transition state the canon already enumerates and the current disk state, and the
model reads those facts, judges their meaning, and acts.

Chosen boundary: one computation —
`the complete transition state the canon already fixed − the current disk state = missing` —
used at session entry and just before each commit that carries a passenger. At entry it **finds
what is already missing**. Before the final task commit it shows the current claim's
`carry=absent|present`; before the boundary commit it shows `missing=[carry|handoff]`, so each
vehicle is checked **before it leaves**. Fact fields are attached to
existing output kinds (`finish-boundary missing=[…]`, `claim.mine carry=absent|present`,
`layer.children-done carry=N`). Exactly one new kind is allowed, `ready.digest-behind`, because it
has a separate subject on disk. **The tool performs no rename, record, stage, or commit** —
DD-80 ④'s read-only, stateless identity is unchanged. Records copy no new field but project from
existing facts: `report: origin=…` is computed from the card's creating commit and the request or
layer-opening marker that commit deleted; with no original input it is `none`, and on a shallow
history or multiple matches it is `unknown` with the reason. No new `Origin:` duty is added to
the card.

Why the boundary is needed: every observed failure is a scene where **detection itself was zero**.
Where detection is zero, adding write authority solves nothing and only mints new authority,
input, and call duties. Using the same computation at entry and at each actual commit boundary
makes recovery and prevention share one definition, and removes the one-commit-late path where
a passenger was checked only after its vehicle had left.

Rejected alternatives: **a separate boundary writer** (the tool performs the rename, the record,
the commit) — it cannot hold an integration merge or rebase, it mints new authority, input, and
call duties, and on the present evidence it adds no value. It is not a user preference but the
evidentially weaker option. **The condition that reopens it** is a real-use scene where the tool
caught the omission exactly and the same session still failed to close the boundary. **A state
query that also writes** — read-only is this tool's identity, and combining both in one call
dissolves it. **A new local rule per duty** — that directly contradicts the diagnosis above, that
the cause of erosion is absent observation rather than absent rules. **An `Origin:` field on the
card** — one more passenger unrelated to whether the planning commit succeeded.

Affected coordinates: `skills/principles/scripts/project-state.mjs`,
`scripts/project-state.test.js`, and the boundary-fact readers in
`skills/{work,split,verify,resume}/SKILL{,_ko}.md`.
Revisit when: the writer-reopening condition above is observed in real use. Or when `missing`
calls something absent that is in fact present and a session does needless work because of it.

### DD-84 · The decision index is a read-only projection generated from the source, and the manual table is gone (v0.19.0)

Subject: Identity, packaging, platforms | Introduced: v0.19.0 | State: active

Observed problem: the 80-row manual decision table in `docs/design{,_ko}.md` wrote the same fact
twice as the titles in `docs/design-decisions{,_ko}.md`, and the two had actually diverged —
**8 of the 80 rows** carried a sentence different from the source title. Five (DD-65, 71, 72, 78,
79) had more meaning in the table; three (DD-74, 75, 80) had more meaning in the source. And the
table hit its budget: `design.md` at 26,543 B against a fixed 26 KiB cap left **81 B** of
headroom against roughly 200 B per row. v0.18.9's two decisions could not take a row, so their
reasons stayed trapped in a round record, and the test comment had already forbidden raising the
cap — *"do not raise these again to fit one more row"*.

Desired behavior: one fact lives in one home. The place that owns a decision is the decision
source alone, and the index is computed from it. A new decision grows exactly one place.

Chosen boundary: a read-only `node scripts/decision-index.mjs` parses the decision source's
titles and metadata and prints a complete `ID | Decision | State` index grouped by subject.
English is the default; the Korean source is selected with `--lang ko`. The manual table and the
sentence telling a maintainer to keep it by hand are removed from `docs/design{,_ko}.md`, while
origin, philosophy, structure, the document map, the invariants, and the skill intent index stay
in the full-text entry. Before the table is deleted, **the meaning the table alone carried is
merged into the source titles so the content loss is zero.** The generating command is a
projection of the source, not a document role, so it takes no home in the document map. The
24 KiB value is an observation warning, not a failure cap: crossing it writes a warning to
stderr but neither truncates nor blocks the complete index.

Why the boundary is needed: the 8-of-80 drift is the scheduled outcome of one fact in two homes,
and once the index is a function of the source that drift has no path left. The 81 B collision
has the same root — the always-read design document grew in proportion to the decision count —
and the projection moves that proportionality **outside the fixed-size `design.md` and its 26 KiB
budget**, while the generated index remains part of the always-read entry.

Rejected alternatives: **a new manual index file** — it leaves the two-homes problem exactly as it
is and adds one file. **A large hand-written index block at the head of the source file** — the
same drift returns the same way, and the cost of opening the decision source is welded to the cost
of reading the index. **Delete only the duplicated columns** (subject and introduced) — the cause
of the drift is writing the same fact by hand twice, not the column count, so 8-of-80 comes back.
None of the three makes one source the sole origin of the index. **The full five-column
projection** — 15,166 B against the adopted subject-grouped 11,897 B at the same 84 decisions,
and the introducing version is right there in the source metadata the moment a moving row is
opened.

Affected coordinates: `docs/design{,_ko}.md`, `docs/design-decisions{,_ko}.md` (title merges),
`AGENTS.md` entry gate 1 and the first wiring row, `docs/maintenance-protocol{,_ko}.md` §8,
`scripts/decision-index.mjs` (new), and `scripts/repository-invariants.test.js`.
Revisit when: a clean Claude or Codex entry actually fails to consume a complete projection that
raised the 24 KiB warning. Or when an entry path that cannot call the projection is actually
observed — what is restored then is not the table but **a callable path**.

### DD-92 · Principles entry is state-free, resume owns state, and knowledge/work trees and P2 packages keep separate boundaries (v0.20.0)

Subject: The knowledge layer and capability documents | Introduced: v0.20.0 | State: active, partly corrected by DD-93 (v0.20.0), DD-97 (v0.21.0), DD-103 (v0.23.10), DD-104 (v0.23.11)

Observed problem: if the rulebook recomputes entry state or a hook injects it, it can disagree with resume; if one capability-number structure represents both knowledge and work, research and multi-owner knowledge can disappear. A manual index or central registry makes a second home for new facts, while missing package provenance makes it impossible to verify what a deploy artifact executes.

Chosen boundary: principles entry is state-free and offers one route to resume. SessionStart provides delayed principles guidance only; it neither judges state or next stage nor injects file bodies. Knowledge and work are orthogonal trees: research-only cards live only under `00`, and knowledge expands only through owner-adjacent recursive `K` directories under the same stem; no central/manual index exists and zero `K` children is valid. Six behavioral constraints preserve this boundary: C1 pre-product research survives durably under `00-project`; C2 card/source evidence remains named source evidence; C3 conclusions land at the nearest semantic owner or the exact crosscut owners; C4 only arch or adopt writes `K`; C5 closed history opens only through exact named provenance; and C6 multi-owner conclusions preserve every owner and land atomically. One principles FORMAT owns the exact JSON marker shape; the work template and project-state parser are executable projections bound by a seam test, and this decision does not duplicate the fields. A P2 Skill Rails package keeps English-authored `spec.mjs` and `body.md` as its executable authored canon, generates `SKILL.md` from them, and retains portable provenance plus generation, build, and evaluation evidence inside the package.

Refutation: DD-29's reason about a partial adapter dropping journal, freshness, and integrity does not apply because delayed guidance copies no procedure and only points to resume. DD-44's number-reach/card-field-duplication reason does not apply because knowledge and work are separate trees and `00`/`K` are path ownership, not card fields. DD-76 and DR-17/DR-25's bounded same-number/no-unbounded-link reasons remain satisfied by same-stem adjacency, exact consumers, bounded opening at each recursion, and valid zero children. DD-78 and DR-03's hook-judgment/journal-injection reasons remain because the hook neither judges nor injects; DD-57's plugin-cache-companion reason is strengthened because portable P2 provenance makes that carriage inspectable. Folding every research question, decision path, and intermediate result into one card or progress log would mix current conclusions with transient progress in a mega-log whose readers cannot tell what remains current. A separate cycle, evidence lifecycle, or typed graph would instead create a second authority, lifetime, and maintenance duty beside the existing card, owner/K, Git, and verification boundaries.

Affected coordinates: DD-03, DD-25, DD-28, DD-43, DD-44, DD-76, DD-29, DD-57, DD-54, DD-87; the principles/resume/hook/knowledge writers and package deploy artifacts; and the multi-owner, knowledge, and entry matrix cells. DD-05, DD-11, and DD-83 remain affirmed within their existing boundaries: one SessionStart hook, report-only correction, and one read-only state computation.

Revisit when delayed guidance causes an action different from resume, a C1–C6 behavioral constraint fails, a recursive K opens without an exact consumer, or a P2 package loses its spec, provenance, or build evidence in real use.

### DD-104 · Owner-specific writers preserve current K loci through approval, execution, and promotion (v0.23.11)

Subject: The knowledge layer and capability documents | Introduced: v0.23.11 | State: active

Observed problem: DD-92 C4 and DD-97's managed-refresh language made Arch sound like the physical
writer for every managed K even after v0.23.9 established Product, Architecture, Design, and
Capability as distinct semantic owners. Product and Design could approve an owner-document change
without seeing or updating an existing same-owner K; Direct projected only a target capability's
headers; and Work considered promotion only for Research cards. The result could leave a stale K,
omit a needed execution read, or silently lose a sourced current conclusion from an ordinary task.

Chosen boundary: the shared core-document contract owns one confirmation batch. A writer projects
bounded existing K headers for the confirmed owner, keeps an already-owned unit at its exact current
locus, and carries every changed locus through approval, write, validation, and the same commit. New
K still requires the existing independent-reader/change-reason or owner-map overflow boundary.
Physical authority is narrow: Product writes product.md and product/K; Design writes design.md and
design/K; Arch writes arch/K and managed capability design zones/K; Adopt writes every owner only in
the initial unmanaged projection. Direct, Work, and Verify never write K, and an existing Arch/Adopt
knowledge marker delegates only its exact semantic owner/K batch.

Direct now selects exact card reads from bounded header projections for the needed current Layer 0
owner, target capability, and explicit crosscut owners, using the header's use-when with the card
Destination and target; affected owners are a narrowing hint, not the sole gate. Work retains the
Research checkpoint and also judges an ordinary task only after its exact-title commit is integrated
and completion, review, and handoff evidence are current. It emits only the existing journal marker
from a conclusion already present in that committed card source; a source-less later conclusion is
reported and returned through Direct, while a card with no reusable change creates no marker.

Why this is a correction rather than a new model: semantic ownership, same-stem recursive K,
source provenance, existing marker grammar, and atomic landing remain unchanged. No state field,
predicate family, registry, index, classifier, validator, marker family, scan, or cross-stage
transaction is added. Product, Architecture, Design, Direct, and Work keep their distinct purposes;
the common rule applies only at the durable owner/K result boundary.

Affected coordinates: Principles' owner, writer, routing, capsule, and policy-index references;
Product, Design, Arch, Direct, and Work P2 sources, fixtures, ledgers, and generated receipts; matrix
cells 3.17, 3.18, 3.20, and 3.21; plugin manifests; CHANGELOG; and the v0.23.11 implementation report.
DD-92's C1–C3 and C5–C6 reasons and DD-97's unmanaged-Adopt/managed-Arch routing reason remain active;
only their universal physical-K-writer wording is narrowed here. DD-103 remains a true record of its
release-time correction and is not edited retroactively.

Revisit when an owner change can commit while a changed existing K remains stale, Direct must scan
unrelated owners to find a card dependency, a normal card loses a sourced reusable conclusion, or the
physical-writer boundary prevents an exact marker-named semantic owner from landing atomically.

### DD-110 · AI execution context points purpose, request, and approval to canonical owners before judgment and preserves durable re-entry (v0.24.0)

Subject: The knowledge layer and capability documents | Introduced: v0.24.0 | State: active

Observed problem: repeated stage purposes, common Why prose, and unconditional reads gave detailed
material equal weight before judgment. In long runs, cold Codex and Claude lost the current request,
approved scope, or exact owner. Normal boundaries such as Product completion and an Adopt follow-on
also cannot rely on conversation memory or on ROUTE executing itself; a fresh session must recover
the next owner from canonical disk state.

Desired behavior: before its first judgment, a cold stage keeps purpose, the current request, the
latest explicit approval or approved proposal/card, and the canonical owner/read path salient without
copying their current values. Shared judgment inputs arrive before Decision, branch-only detail beside
its first effect, and a fresh session recovers the next owner from canonical disk state.

Chosen boundary: the nine intent descriptions and stage identities remain. The Principles policy
index owns the sentence that points those inputs to the current owner/read path, and the eight bodies
project it. The state tool projects existing entry data `stage:arch` only when committed Product inputs
equal current bytes and the exact missing set is the two Arch-owned files; Resume consumes that
transient observation. Direct selects Design only when the current request or approved scope has an
actual unresolved Design decision, leaving work under the current or default style on the Work path.
The staged knowledge contract preserves an Adopt whole follow-on, while no-follow-on completion
remains DONE. ROUTE is not an execution command. No new state, approval, route kind, registry, helper,
or model/OS branch is introduced.

Why the boundary is needed: flat repeated delivery obscured purpose and approval, while conversation
continuity and ROUTE execution were not durable facts. Existing owners and artifacts can restore both
salience and normal-boundary re-entry without creating another source of truth.

Rejected alternatives: byte reduction alone does not restore salience; making every reference
READ_FIRST keeps importance flat; blanket edits to nine specs duplicate common ownership; turning
conversation continuity into a recovery contract adds a second state model.

Affected coordinates: `skills/principles/references/policy-index.md` and the eight body projections;
`skills/principles/scripts/project-state.mjs`; Resume's collector and spec; Direct's spec and body;
Adopt's body; Verify's spec; their fixtures, generated receipts, and repository tests.

Revisit when a cold lane loses owner, approval, or a required read; a fresh Resume
cannot safely find the next owner after a normal stage boundary; or branch detail again arrives
with flat pre-judgment priority.

### DD-105 · Proposal readers discover bounded input-owner K depth before confirmation (v0.23.12)

Subject: The knowledge layer and capability documents | Introduced: v0.23.12 | State: active

Observed problem: an owner document is the always-read map, so current reusable detail may correctly
live only in its same-stem K tree. Arch read Product as a planning input but projected only arch/K at
its own approval boundary; Design likewise read Product and Architecture but projected only design/K.
A cold reader could therefore obey every declared input effect and still propose a choice that
contradicted applicable current input-owner depth.

Chosen boundary: when a stage uses another owner's map as input to a proposal it will ask the user to
confirm, it first projects that input owner's K headers through the existing owner-bounded opening
contract and opens only depth whose first-line use-when fits the pending judgment. Arch applies this
to Product in read-inputs. Design applies it to Product and Architecture before both proposal and
confirmation. Reading an input K does not confer write authority or change the stage's specialized
decision surface.

Why this is an extension rather than a new index model: DD-92's owner maps, same-stem K, zero-child
validity, dynamic projection, and state-free hook remain intact, as do DD-104's physical writers and
confirmation batches. The missing edge was reader-side timing, and the existing `project --under`
projection plus policy-index routing already provide its bounded mechanism. No persistent index,
global scan, state predicate, classifier, registry, stage, or new owner is introduced.

Affected coordinates: the shared capsule contract; Arch's read-inputs spec, judgment body,
artifact declaration, intent, ledger, and fixture; Design's proposal/confirmation spec, judgment body,
artifact declarations, intent, ledger, and fixtures; matrix section 3.18; plugin manifests; CHANGELOG;
and the v0.23.12 implementation report. Adopt and Product creation, capability design, Direct, Work,
Verify, Resume, hooks, project-state, project-knowledge, and writer approval behavior remain unchanged.

Revisit when a proposal still misses applicable current depth under an input owner, bounded header
projection forces unrelated owner trees or body preload, a zero-K owner blocks normal planning, or an
input read is mistaken for authority to write that owner's K.

### Rejected under this subject

- **[DR-03 · v0.7.0]** **Journal injection by the hook** — duplicates what resume reads.
- **[DR-44 · v0.13.0]** **Splitting the canonical rules per consumer** — deferred, not rejected. Its failure mode
  is bad: a rule work needs, filed under a verify-only heading, disappears with no error.
  Mixing it into a release that also repairs ten defects would make it impossible to tell
  which change broke what.

### DD-95 · Globally installed devflow stays silent without current evidence; explicit intent and history-aware state preserve the adoption boundary (v0.20.0)

Subject: Identity, packaging, platforms | Introduced: v0.20.0 | State: active, partly corrected by DD-97 (v0.21.0), DD-101 (v0.23.7)

Observed problem: the globally installed plugin's SessionStart injected devflow guidance into
every Git repository, and ordinary development language in the Arch, Design, Split, Work,
Verify, and Resume descriptions could turn that context into implicit stage entry. Broad Product
and Adopt descriptions left the same path open. The state tool also collapsed a never-managed
repository and a partial or historical devflow repository into `setup.no-product`, so the safe
Resume path could ask setup questions. This is the real scene in DD-92's revisit condition:
delayed guidance caused an action different from Resume.

Desired behavior: leave no passive devflow framing in an ordinary project that never adopted it.
Explicit devflow invocation always works, and routes from another devflow skill plus existing
managed-project flow remain unchanged. Partial, deleted, shallow-history, or failed-observation
states are never falsely declared unmanaged.

Chosen boundary: after finding the Git root, SessionStart cheaply checks only the current
`.devflow` path and `.devflow/project/product.md`. When neither exists it exits 0 with no output;
when either exists it emits the existing injection byte-for-byte. This is a weaker, non-binding
eligibility check that gates a fixed pointer only: it reads no index, history, state tool, zone,
or route. The Arch, Design, Split, Work, Verify, and Resume descriptions admit only explicit
invocation, a route from another devflow skill, or work in an existing devflow-managed project.
Product and Adopt admit only explicit devflow intent: direct invocation, naming devflow, or
requesting devflow-shaped artifacts such as Layer 0 and devflow capability documents.

The one action-owning decision remains in `project-state.mjs`. It emits `setup.unmanaged` only
when current and indexed `.devflow` evidence are absent and full history proves that no `.devflow` path
ever existed. Historical evidence remains `setup.no-product`; shallow history, Git failure,
undecodable output, and uncertainty conservatively fall back to the same existing
`setup.no-product`. Resume preserves domain orientation first, then ends `setup.unmanaged` with
one report and DONE—no ASK, route, or write—and mentions Product or Adopt only if the user
intended to opt in.

Why the boundary is needed: hook errors are asymmetric. A false unmanaged result strands
unknown-session recovery for a managed project, while one false managed or ambiguous pointer is
immediately corrected by the authoritative state tool. The hook therefore suppresses only on
overwhelming cheap current evidence; the state tool alone owns index, full-history, and unknown
judgment. DD-92 rejected route judgment and file-body injection in the hook. The existing Git-root
check already refutes the unstated premise that every filesystem read is workflow-state
computation, and this boundary computes neither a route nor a body. DD-05, DD-20, DD-83, DD-92,
and DD-93 remain affirmed within their recorded reasons: one hook, independently discoverable
Adopt, one read-only state computation, state ownership, and P2 authored-canon ownership.

Rejected alternatives: a new init skill or adoption marker creates a second home for one fact.
Copying index and full-history logic into the hook adds permanent session cost and a divergent
second predicate. A fixed negative hook message defeats silence and taxes every ordinary session.
`allow_implicit_invocation: false` also suppresses valid managed-project selection. Leaving broad
Product and Adopt language open recreates the same ambient trigger through those two entries.

Affected coordinates: `scripts/session-start.js`; the eight skills' `.skill-rails/intent.json`
and generated trigger projections; `skills/principles/scripts/project-state.mjs`;
`skills/resume/spec.mjs`, `body.md`, fixtures, and their seam tests; matrix cell A10 (pre-adoption
or accidental entry); and CHANGELOG. No new matrix row, term, marker, or init file is created.

Revisit when a current devflow project is silenced by the hook, explicit Product or Adopt becomes
undiscoverable, an ordinary unmanaged request again selects a downstream skill, the intentional
weak-hook/authoritative-state disagreement changes an action rather than a pointer, or
SessionStart latency rises materially.

### DD-98 · The canonical target-project root is `.devflow/` and only `.devflow/` (v0.21.0)

Subject: Identity, packaging, platforms | Introduced: v0.21.0 | State: active

Observed problem: the undotted `devflow/` directory sits beside product code and product
documents, visually mixing devflow's auxiliary knowledge and progress state with the product's
own artifacts. More importantly, the path is distributed across the state tool, SessionStart,
serialized journal coordinates, Git pathspecs, the K validator, and nine skills' read/write
contracts. A partial rename makes those consumers observe different project states.

Desired behavior: people and AI recognize the devflow knowledge and progress root immediately as
an auxiliary project-management surface while reading and writing Product, Architecture, Design,
glossary, capability documents, K, and task cards normally. Every current reader and writer sees
one root.

Chosen boundary: `.devflow/` is the sole canonical root created in a target project. Current-state
and history observation, SessionStart, the knowledge validator, journal and card path grammars,
and every P2 artifact and ownership declaration read and write only this spelling. The `devflow:`
skill namespace, wire schemas such as `devflow/project-state/2`, and the plugin name are not
project paths and do not change. Historical rounds, CHANGELOG entries, blueprints, and legacy
atoms keep the spelling that was true for their recorded moment or migration source.

No compatibility root, automatic move, or alias is created. The owner confirmed that no managed
project is in use and that test projects will be recreated after installation; a dual root would
therefore split judgment and writes without preserving useful state. The leading dot is a naming
signal, not a permission or hidden-access policy, and does not weaken the human or AI read/write
contract.

Why the boundary is needed: DD-01's reason—avoiding collision with an existing docs tree—still
holds, and `.devflow/` expresses the separation more directly. A one-root hard cut keeps path
constants, regexes, and Git exclusions moving together without growing compatibility machinery or
dividing managed-state and knowledge ownership.

Affected coordinates: `scripts/session-start.js`, `scripts/project-knowledge.mjs`,
`skills/principles/scripts/{project-state,project-knowledge}.mjs`, the authored canon and generated
projections of all nine P2 packages, current design and matrix documents, the v0.21.0 report, and
CHANGELOG. No state, marker, document layer, or migration stage is added.

Revisit when deployed `.devflow/` prevents ordinary human or supported-platform reads or writes,
or a current reader and writer are reproduced observing different roots.

## Verification and roles

### DD-08 · TDD procedure not adopted

Subject: Verification and roles | Introduced: origin | State: active

Completion signal + "not executed = unverified" + commit discipline capture TDD's effect without the ceremony

### DD-17 · The terms of the review and verification roles live in the skill text — agents/*.md is Claude packaging (v0.9.5)

Subject: Verification and roles | Introduced: v0.9.5 | State: active

Same reason principles lives inside skills/: on installs that copy only skills/, the terms must travel along or platforms diverge. Found via an owner report (2026-08-09) — never-execute/never-fix, the taste exclusion, speculative marking, and fail-with-reproduction-steps shipped only in the Claude-only agent files. The agent files are a restatement of the same terms; drift between the two is a defect. Superseded in v0.9.6: the terms moved into one contract file beside each skill and Claude registration was dropped — see the v0.9.6 row

### DD-19 · Role contracts are one companion file beside each skill (reviewer.md · verifier.md); every platform runs them by briefing a clean context with the file verbatim — no Claude agent registration (v0.9.6)

Subject: Verification and roles | Introduced: v0.9.6 | State: active

An A/B/C test (2× registered agent · 2× prompt-briefed Claude subagent · 1× Codex CLI, one fixture with 4 planted defects) found all five runs identical — 4/4 detection and full contract adherence — so registration's assumed robustness edge was not observed. One mechanism dissolves the platform fork entirely. The mature precedent is superpowers (7+ harnesses, no registry, contract prompt files beside skills). Delivery must be static — verbatim file briefing (Claude · skills.sh) or install-time embedding (Codex); the only transport that failed in testing was shell interpolation

### DD-21 · The audit — event-triggered deep inspection; findings are not verdicts (v0.9.15, scope amended v0.9.21)

Subject: Verification and roles | Introduced: v0.9.15 | State: active

Grounds: owner field reports (2026-08-10, running ade): one-pass results leave holes, and mistakes pass verification unrecognized as mistakes. Implements two observation items (capability-layer sample width · MVP spec blind spots). Not an always-on step — exactly three events fire it (product layer once · closure of a capability whose verify.md records a fail · user request): the runtime application of "the harness grows only on defects actually met," so a cleanly closed capability costs zero. Convergence devices: non-blocking findings · zero-findings-valid · only user-adopted findings become cards · re-closure never re-runs it (a new leak is a new event). The v0.9.15 scope of "executed paths + the capability folder" assumed that task history represented current topology; that fails for brownfield and flat layouts, exposes card history, and misses current surfaces not yet executed. v0.9.21 therefore excludes past commits, diffs, and cards and bounds the audit to paths mapped exactly by arch or the current capability code scope from external entrypoints to shared-contract boundaries. Adopted only after dual independent validation (refutation walk · whole-system audit) extracted and repaired/cut the draft's trigger-anchor misreadings (dies-by-overwrite / fires-forever), unbounded reading, and the quality prey (unrefuted against the simplification-card experiment-first lineage)

### DD-22 · The retrospective — a fourth role that post-hoc evaluates design alternatives at the MVP boundary; findings are not verdicts (v0.9.16)

Subject: Verification and roles | Introduced: v0.9.16 | State: active

Grounds: owner testimony (2026-08-10): AI never doubts the plan it made itself, reviewer/verifier catch only clear problems, and nobody ever asks whether a better option existed — detection does not happen on its own, which refutes the premise (the user notices) of the "simplification-card experiment first" observation item. The judgment word ("better") is bounded by three requirements: a concretely named alternative + this project's strain evidence as mandatory (fix-card density, `.stale.`, ADR update comments, unresolved Provisional rows — only artifact-observable signals; the refutation pass extracted and cut the draft's escape-card and provisional-churn signals as unobservable) + a switching-cost estimate marked presumed. Input is devflow artifacts only, zero code — reading fully bounded. An auditor second mode was rejected (opposite blinding axes — one name, two concepts). Fires only after the product-layer verdict is recorded (once) and on user request; non-blocking, zero-findings-valid, adopted findings only become cards or a re-baseline (the event list gained capability first closure in v0.9.17 — see that row)

### DD-23 · The retrospective also runs when a capability first closes — scoped to that capability (v0.9.17)

Subject: Verification and roles | Introduced: v0.9.17 | State: active

Overturns v0.9.16's capability-level exclusion on owner direction (2026-08-10), refuting both recorded grounds: "strain evidence is thin" — narrowing the input to the capability thins the cost with it, zero-findings-valid makes it harmless, and early detection before dependent capabilities build on the design is cheaper than MVP-time detection. "It becomes a standing step" — the owner specified this rhythm directly: the planner is human, and a check-in at every large unit beats running solo; an operating direction is direction itself, not imagined risk. Card-level retrospectives remain excluded

### DD-24 · A signal pass goes stale when its inputs change + a fix card's completion signal is the verifier's reproduction steps (v0.9.4, product- and capability-layer extension v0.9.21)

Subject: Verification and roles | Introduced: v0.9.4 | State: active

Two gaps flagged by an external loop-engineering review (2026-08-09) and confirmed against the text: a post-review fix could ride a pre-fix pass into commit (a stale-evidence path), and a fix-card signal could be written unrelated to the observed failure. Backing research verified against sources (blind-retry recovery 0.0 on latent/semantic errors; verifier +14.8%p from real misjudgment cases). Regulates only evidence freshness and signal provenance, not execution order — no red-green reintroduction, the TDD rejection stands (the failing "before" evidence already lives in the verify record). v0.9.21 binds a product-layer verdict to Product revision for product.md, Verification revision for arch.md · code-style.md · glossary.md, and Code revision for the newest commit outside devflow. The capability layer's Capability revision includes only the exact HEAD paths of target `.done.` task cards and their directly depended-on cards. Verification and Capability revisions hash raw `git ls-tree -r -z` bytes instead of JSON whose sorting, Unicode, and path separators can vary. An uncommitted revision input, direct-dependency card, or path outside devflow forbids the verdict

### DD-30 · Verification failures, repairable unverified results, and Audit and Retrospective events survive verify.md overwrites and session interruption (v0.9.21)

Subject: Verification and roles | Introduced: v0.9.21 | State: active

Re-verification erased earlier `Failure history`, Audit, and Retrospective results, so first closure could not be distinguished from re-closure; ending a session after recording the verdict but before a once-only role ran also lost that event forever. Timestamp locators collide when several failures or events occur in one second, so each verify.md section assigns a never-reused positive `source id`, and an adopted finding is identified by event id plus finding number. Legacy timestamp records receive ids in file order without losing their original text. Each failure and repairable unverified result keeps its own route in `Failure history`. Capability fail and unverified results, and pass results with a closure-gate failure, land in a capability-result commit before routing. Only a complete result resumes without execution; a partial write repeats from step 2, and a rerun that cleanly passes proceeds to closing begin. An event's pending, result, and decision state lands in a verification-state commit before role briefing, a user question, or the first route. Failure and finding routing records the base commit, final result, and application order of write, move, and delete in a validated `routing prepared` object before output. The current checkout, including draft cards, must be an exact prefix of that order; after interruption only the remaining suffix is applied before landing it with the compact result in one commit. Product verification and event requests made during work never preempt the current claim. When Audit scope cannot resolve exactly, the event completes with the reason instead of waiting forever. Audit requests and automatic Audits at a dirty boundary remain unselected and do not block product-result reporting; they can run after scope or boundary repair. Multiple adopted findings retain per-finding `routing: pending` state and land one finding at a time in a planning or binding-decision commit. The product Audit and Retrospective key is revision-independent `product`, so each runs once; only timestamp-keyed user requests repeat. Re-verification preserves Failure history and both event sections. split places product-layer fixes in foundation or a capability according to scope

### DD-36 · Capability pass gates are explicit state between verdict and closure, and closure does not change verification revision inputs (v0.9.21)

Subject: Verification and roles | Introduced: v0.9.21 | State: active

If a session ends just after the verifier passes, closing from the success verdict alone skips the standards and Provisional gates. Conversely, changing a core document during closure immediately stales the revisions just computed. A current pass therefore requires current results from both gates, and closure performs only the ordered `verify.md` record → `journal.md` record → capability-folder `.done` rename. A journal decision that belongs in a core document routes to its owning skill before verification; a late decision preserves the marker and repeats revision judgment from the start

### DD-41 · A Record states its own entry count — New entries (v0.9.23)

Subject: Verification and roles | Introduced: v0.9.23 | State: active

Right after a verdict and before the commit, disk alone could not judge whether a dead session's partial Record was complete — the total of required entries lived only in that dead session's context. The self-describing field mechanizes the completeness judgment. A value that does not match is judged a partial write and recovers through the approved rerun path that repeats from step 2. A committed Record with no such field is complete as committed — tolerating an absent field is the same class as verification-predicates' pre-v0.9.21 record

### DD-68 · Signal cards connect a completed repair's later non-pass to the same root, inherit the previous repair evidence, and return to the human at recurrence observation 2 or higher (v0.15.0)

Subject: Verification and roles | Introduced: v0.15.0 | State: active, partly corrected by DD-81 (v0.18.9)

Preserve the current regression label executed by the verifier in Failure history as the `signal card`, and reverse-index completed fix-card numbers to roots keyed by the existing verify key and source id. Before the verifier, mechanically project only three verify.md paths — the current target, tree root, and label capability — and judge each label's candidate roots as 0, 1, or 2+. Record each item in one run independently, sharing one recurrence observation number only among items with the same root. If one label has two or more candidates or a stored field cannot be parsed, do not choose by meaning; stop both execution and result recording. Create no UUID, symptom-similarity match, or typed evidence graph, so DR-08 remains closed.

A new fix card reads only the union of the current signal card and every route card left by the same root's previous completed repair round, in canonical card-number order. split puts each card's exact path after the final route operations into the existing `Read first`, writes the current non-pass and the previous repair's failure to make the signal pass in `Why`, and writes `Forbidden` only with direct evidence that repeating the same approach unchanged would produce the same result. It requires no separate cause document or work method, keeping DR-09 closed. A new root and recurrence observation 1 use the current fix route; recurrence observation 2 or higher goes to a human gate without an automatic card, and a later non-pass returns to the same gate. Do not backfill legacy entries; closure knowledge remains owned by the existing capability knowledge baseline full refresh, which already harvests the current card and direct `Read first`.

### DD-81 · An unverified result caused by a channel that could not be acquired goes to the person from the first occurrence, and its reason carries the failing command and its timeout (v0.18.9)

Subject: Verification and roles | Introduced: v0.18.9 | State: active

Observed problem: in the first real-use test after 0.18.8 shipped, session B piled up 81 commits
and never closed a single capability. Bias removal requires the verification to run in a clean
session, and that session could not acquire the browser channel the main session had already
driven successfully. A tool failure was handled as a product failure, so fix cards multiplied,
and the state tool then offered the impossible card as `ready=true blockers=[]`.

Desired behavior: when channel acquisition fails (tool bind, attach, timeout) before a single
scenario step has run, that is not information about the product. No card is created, and the
item goes to the person from the first occurrence, whatever the recurrence count.

The item sent to the person is the committed Record's exact `Executed:` result, not a
Failure-history entry. Failure history, repair lineage, and cards stay empty; state projects
its target, verify path, command, and timeout as a human wait without creating a second durable
owner. Suppressing automatic re-entry therefore does not make the result disappear on the next
session.

Chosen boundary: add exactly one `unverified` reason to the verifier and fix its form —
`unverified: channel unavailable — <the exact failing command>; timeout=<value>`. Requiring the
failing command and the timeout value together is the device that closes the escape hatch: to
file a product defect as a tool failure, the model would have to invent both values.

Why the boundary is needed: DD-68 handles the recurrence of a non-pass **about the product** and
returns to the human at recurrence observation 2 or higher. A channel failure is by definition
not product information, so walking that ladder one more time only produces one more impossible
card. DD-68's recorded reason is not negated — the scope divides, which is why DD-68 is partly
corrected rather than replaced.

Rejected alternatives: **carry the first recurrence as usual and escalate on the second** — the
observed scene is precisely "never closed once", so another lap buys nothing. **Leave the reason
as free prose** — without the failing command and the timeout the classification cannot be
checked, and this decision loses its only enforcement device.

Affected coordinates: the `unverified` reason list in `skills/verify/SKILL{,_ko}.md`, the verify
channel confirmation in `skills/arch/SKILL{,_ko}.md`, the durable-result projection in
`skills/principles/scripts/project-state.mjs`, the human-wait consumer in
`skills/resume/SKILL{,_ko}.md`, `scripts/project-state.test.js`,
`scripts/repository-invariants.test.js`, and `docs/rounds/v0.18.9/report_ko.md` §4.
Revisit when: an item classified as a channel acquisition failure turns out to have been a
product defect. Tests cannot close this decision — gate B passes it.

### Rejected under this subject

- **[DR-04 · v0.7.0]** **Relocating the verify-channel document** — the arch pointer suffices.
- **[DR-08 · v0.9.4]** **Adopting graph engineering (typed evidence graphs · an orchestration agent)** — the
  tree, Depends, status suffixes, and revert already form a low-cost graph. A negative
  result was also confirmed: typed-graph retrieval scored 11.2%p below a strong hybrid
  ranker (p=0.0007).
- **[DR-09 · v0.9.4]** **A root-cause documentation stage** — the progress log is already where diagnosis
  lives. Demanding a separate artifact is method prescription.
- **[DR-10 · v0.9.4]** **Held-out / candidate-comparison promotion gates** — for probabilistic optimization
  of prompts and harnesses only. For devflow's own maintenance, the AGENTS.md
  refutation protocol already plays that role.
- **[DR-11 · v0.9.4]** **Harness self-evolution (rewriting its own prompts)** — collides head-on with the
  philosophy of steering without self-modification. Self-improvement stops at folding
  escaped defects into signals (adopted in v0.9.4).
- **[DR-13 · v0.9.6]** **Plan B (contract files + keeping Claude agent registration alongside)** — its
  premise, "registration = harness enforcement = more robust," was not observed in the
  A/B/C test; it would keep a per-platform mechanism fork for no measured benefit.
- **[DR-32 · v0.12.0]** **Narrowing verify's "uncommitted outside devflow" gate to the capability** — it produces a
  false pass while somebody is mid-edit in shared code. That trades a safety device for
  convenience. Under concurrent work, editing runs in parallel while verification and builds
  serialize — not a new constraint, just an existing safety device becoming visible.

## The task tree and its cards

### DD-06 · No model names in files (tiers T-high/T-mid/T-low only)

Subject: The task tree and its cards | Introduced: origin | State: active

Model names always go stale. Mapping is decided per session in split's execution proposal

### DD-09 · 1 task = 1 commit (only after verification passes)

Subject: The task tree and its cards | Introduced: origin | State: active

Rollback = one revert; git log = task history; task boundary = handoff point

### DD-11 · Integrity check reports only, never auto-corrects

Subject: The task tree and its cards | Introduced: origin | State: active

If auto-correction misjudges, it accelerates contamination

### DD-25 · Ready-card semantics, per-card execution-proposal approval, and resume routing are decided from disk state (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active, partly corrected by DD-80 (v0.18.7), DD-92 (v0.20.0)

Two independent literal executions cross-confirmed deterministic session-boundary failures: a card with completed `Depends` remained forever unclaimable under the words "dependency-free"; ending a session after adopt but before split produced an adopt↔resume loop; resume called only work even at split and verify boundaries; and ordinary execution-proposal approval left no disk trace, so the next session could not distinguish before from after approval. Ready means `Depends` is `none`, or exactly one `.done.` card exists for every comma-delimited number. New cards use one dependency format. Only a card missing `Approval` or `Review` is legacy; its leading numbers are parsed mechanically and normalized when next planned, while the user decides an unparseable member. `state-predicates` owns task-card judgments once; `verification-predicates` owns revision and event judgments once. The former enters Claude and Codex input for split, work, verify, and resume; the latter only for verify and resume. Approval, parallel group, and review policy live in each card and land in a planning commit; the claim suffix alone owns assignment. Approval is effective only when the same authority path exists and both index and working tree equal solo HEAD or the fetched multi integration branch under Git-normalized comparison. An out-of-scope prerequisite changes the new card, the original card's `Depends`, approval, and release in one planning commit. The resume table covers partial trees, retired capabilities, blocked dependencies, and a completed product. The arithmetic conflict that forbade a two-card split was removed too

### DD-27 · `.stale.` task cards remain as history, and a `re-split pending` marker recovers interruption before replacement planning (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active

Retrospective reads `.stale.` cards as strain evidence, but closure required every child to be `.done` and product completion prohibited `.stale.` itself, so one normal upper-decision change made permanent incompletion. `.stale.` task cards are kept and excluded from active-child counts, while closure still requires at least one active direct child. An upper decision first leaves one exact `re-split pending` marker per direct parent folder; split deletes it only when the user-approved replacement-card plan lands. work decides whether the current card is invalid before its final task commit, entering this path through a wip checkpoint instead of a completion commit. The marker therefore resumes re-splitting after interruption, while preserved `.stale.` history no longer blocks completion after planning

### DD-38 · `Approval` is effective only with Git-diff freshness, not the card value alone (v0.9.21)

Subject: The task tree and its cards | Introduced: v0.9.21 | State: active

Failure path: a card changes after approval, the stale approval survives, and a Destination, Forbidden, or completion signal the user never saw gets claimed. Approval is therefore effective only when the same path exists in the authority (solo HEAD or the fetched multi integration branch) and both index and working tree equal that authority under Git-normalized comparison

### DD-50 · A change request is recorded immediately and planned later; a completion signal is scoped to its capability (v0.12.0)

Subject: The task tree and its cards | Introduced: v0.12.0 | State: active

Two halves of the same problem: what happens to work already in flight. Placing the maintenance row below the claim meant the request was never recorded once claims became normal in several units; placing the whole routing above it meant a passing remark interrupted the card. Splitting the row settles both — recording outranks the claim, planning yields to it. The build is the other half. Switching capabilities was supposed to need no procedure, but a half-finished edit in one unit fails the next unit's completion signal, and the failure ladder then treats a sound card as defective and calls the human after three strikes. Two devices close it: the switch checkpoints what is already changed, and split scopes each signal to the paths its capability owns. The second is what makes two terminals in one working tree survivable at all; the plan had left it as a recommendation

### DD-54 · One request that spans several capabilities keeps one source and one marker per parent (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active, partly corrected by DD-87 (v0.19.0), DD-92 (v0.20.0)

Mapping was written in the singular ("go to the matching capability folder"), with no definition for a request that determines three locations. A literal reader picks one and the rest vanish silently, journal line included, so nothing can recover them - the loss the owner guards against most. A client's fix list handled in one session is ordinary practice. Sharing one exact source locator across the parents' markers gives the bundle an identity with no new batch id, so resume recovers them together; one execution proposal and one approval keep a twenty-item list from needing several; and an ambiguous or retired unit asks before the begin commit instead of planning half and losing the rest

### DD-87 · One request across several owners lands in as many passes as it needs behind one approval boundary, and the markers still standing carry the remaining targets and consumer reads (v0.19.0)

Subject: The task tree and its cards | Introduced: v0.19.0 | State: active, partly corrected by DD-92 (v0.20.0)

Observed problem: split says both "open one layer at a time" and "the bundle gets one planning
commit." For a twenty-item request across five capabilities those two cannot both be true, and a
literal reader was left with three ways out — break the one-layer discipline, plan one owner and
silently drop the rest, or run out of context before the commit and leave the next session to
retrace the request through the code. The state projection carried the same hole: a card from the
pass that deleted the request line reported that request as its `origin`, while a card from a pass
where the request still stood reported its own layer-opening marker. One request was reported to a
person as two.

Wanted behavior: one request keeps one source identity and one planning boundary however many
owners it reaches. The approval is one for the whole bundle; the landing divides into as many
passes as the work needs.

Chosen boundary: create no bundle identifier and no new state. When a pass fits every parent, land
them in one planning commit; when it does not, land only the parents that pass finished and delete
only their markers. The markers still standing are the exact remaining targets — parent, already
minted child numbers, and the same source — and the request line leaves with the last of them, so
the `request` zone keeps its own place until then. The cards already written keep the bounded
`Read first` that pass grounded them on, and the state tool projects `readFirst` and the
same-origin sibling set on every candidate. And `origin` is now the identity of the input that
card's creation commit deleted — the durable source locator the marker names, not whichever marker
line happened to be in that pass's diff.

Why it is needed: with the remaining targets and the consumer reads absent from disk, the next pass
scans the tree and recomputes the mapping. That recomputation can quietly land a different answer,
and the failure DD-54 closed — planning half and losing the rest — returns through the session
boundary instead. And an origin that differs per owner tells a person that one request is two.

Rejected alternatives: an approval per parent — DD-54's recorded reason rejected exactly that
(several approvals for a twenty-item list). A new bundle identifier — the shared source locator is
already the identity, so there is nothing for new state to add. Keeping the one-planning-commit
rule as it stood — that keeps the side that collides head-on with "open one layer at a time," and
that collision is the observed failure.

Impact coordinates: layer opening and maintenance routing in `skills/split/SKILL{,_ko}.md`, the
`transition.layer-opening` row of `skills/resume/SKILL{,_ko}.md`, `cardOrigin` and `parseReadFirst`
in `skills/principles/scripts/project-state.mjs`, the D8 fixtures of
`scripts/project-state.test.js`. DD-54.
Revisit when: a bundle split across passes is observed leaving one parent unfinished forever, or
the `readFirst` projection is observed diverging from what a card actually has to read.

### DD-55 · Items that do not change the precondition-to-outcome transition ride one card (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active, partly corrected by DD-61 (v0.14.0)

devflow had promotion for work that turns out too big and no exit for work that is too small, so a button colour paid record - map - card - proposal - approval - claim - fixed reads - implement - signal - review - commit - boundary. That reproduced exactly the heaviness the owner set out to escape. The test needed no new invention: the baseline predicates already exclude a button name, wording, or layout change when the precondition and outcome stay the same, so the same line now separates work too. Bundling is not omission - "too small to record" is never created, because one unrecorded path becomes the default path and turns into the steady loss of what should have been an asset. **Corrected in v0.14.0**: half of that guard stepped back under refutation — a tweak, whose commit is its record, finishes with one commit and no document record. Bundling remains for small items that fail the gate (see the tweak row)

### DD-58 · A finished card's number is never renumbered (v0.13.0)

Subject: The task tree and its cards | Introduced: v0.13.0 | State: active

The draft had a duplicate number move a completed card to the mid-insertion form and update dependents. But a completed number also lives in commit subjects, external CI, issues, and people's links, which fixing files and dependencies never reaches; if two completed cards are already known outside under one number, which reference means which card is generally unrecoverable. And since numbers are minted only on integration, a duplicate can now only arise while a card is pending and unclaimed, where renumbering is cheap. Beyond that stage it is reported as an integrity anomaly instead

### DD-61 · A tweak's commit is its record (v0.14.0)

Subject: The task tree and its cards | Introduced: v0.14.0 | State: active, partly corrected by DD-66 (v0.14.2)

The recorded reason in the v0.13.0 row's "'too small to record' is never created" — one unrecorded path becomes the default path — is refuted thus: a commit IS a record. This lane does not skip recording; it changes the recording layer, and the owner corrected the direction personally (a button label or a border colour is fully recorded by its diff and almost never revisited). Only when all three gate questions are "no" and none is uncertain — does it change a precondition-to-outcome transition the user sees; does it produce a design decision or conflict with one (design tokens, ADRs); does it leave a trap the next worker must know — the change runs without a card, journal line, or review: read the existing Layer 0 documents, edit, run the cheapest check that touches the changed files once, and land one `tweak` commit. No `.devflow/` path is touched. Knowledge-bearing changes are routed to the document layer by the gate, and the discovery→update table applies regardless of change size. A fresh session holding only a tweak request skips state restoration — the lane consumes no prior record and changes no shared state, so bypassing the nets breaks nothing, and it is the first landing of the owner's requirement that inferring from code alone is sometimes exactly right. When the verdict flips mid-change, stop and switch to the ordinary path. The one remaining risk is misclassification — a field observation item (corrected 2026-08-13: "bypassing the nets breaks nothing" was partly refuted by reproduction in the v0.14.0 audit — a tweak commit still advances HEAD, which turns a `routing prepared` recovery pinned to a base commit id into an integrity anomaly, and a stale checkout's documents produce a "no" that conflicts with the latest decision on integration. DD-66's landing checks close this; skipping state restoration itself stands. The judgment inputs gained the existing glossary.md when an item could touch a name or term — term decisions live only there, and nearby code shows a spelling without showing it is a decision)

### DD-65 · A mixed request records only its gate-failing items — a passing item enters no journal line (v0.14.2)

Subject: The task tree and its cards | Introduced: v0.14.2 | State: active

This resolves the four conditions the v0.14.0 audit (finding 4.1) proved unsatisfiable together — per-item classification · a tweak makes neither card nor journal line · the original request line is deleted whole by the planning commit · per-item completion is recoverable from disk after death at any point. A passing item mixed into the recorded line would be consumed with neither a card nor a record and vanish without trace on interruption (a tier-1 loss path). Following the owner's principle that a tweak makes no record at all, the fourth condition's demand is withdrawn for passing items: the recorded line holds only the items that failed the gate, and the tweak lane handles passing items in the conversation that carries them (the recording commit first, the tweak commits after) — a tweak item now gets one identical treatment whatever request shape it arrives in. A window remains where death right after recording and before the tweak commits loses the passing items with the conversation — the same grade as a pure tweak request's interruption, which DD-61 already accepted. Riding passing items on cards (full durability) was rejected by the owner as a head-on contradiction of that principle, and a durable item list (a new canonical format with item ids, kinds, and completion commits) is on hold as a new state machine needing consumers, merges, interruption recovery, and migration together. split's send-back-to-the-lane sentence is deleted — a recorded line holds no passing item, so it has no reason to exist

### DD-69 · design confirms six Layer 0 decisions, split cards own the build, and only result facts enter design.md as upper-document feedback (v0.15.2)

Subject: The task tree and its cards | Introduced: v0.15.2 | State: active, partly corrected by DD-99 (v0.22.0)

The former design was an optional stage that ran before the tree while requiring a token file and `/preview` as both the real output and the completion signal. An empty repository has neither an application to run nor a card that owns code output, so one skill split into two readings: the document plans, while the real artifacts are built. design's output is one design.md carrying six Layer 0 decisions — Approach, Design source, Token strategy, Component strategy, Decomposition axis, and Review surface — plus the Build scope. The six fields are Layer 0 regardless of file presence; `not used` and `none`, with their reasons, are also values. Once the user confirms the document, the stage ends with the existing `design — design.md` Layer 0 commit, and split cards and their execution proposal own the token, theme, component, and preview build.

A first entry after the tree and a direction change use DD-50's single record-first path. split first lands the original request in `maintenance routing pending` and sends it to design through 2a. The line is preserved through the design commit and consumed when split plans cards and the execution proposal from the same source. Existing cards follow the upper-document change contract: keep them when they can remain true together, otherwise mark them `.stale.` and re-split. This creates no new state, commit kind, or progress ledger.

When the build confirms a planned path, name, or command, the discovery→update table replaces exactly one line in design.md. When the direction of any of the six decisions changes, design confirmation runs again through the same record-first path. DR-12 recorded the reason table unification failed as “some wrong sides have no landing row in the table (design.md · an existing code-style line · a completion signal that runs but asserts the contradicted behavior).” This decision does not remove the existing document-hierarchy procedure for violations; it only adds design.md's missing landing row, so it does not re-propose the rejected design. It also does not add design.md to DD-43's freshness inputs.

### DD-99 · `direct` names the work-direction stage; the old `split` name described only one technique inside its boundary (v0.22.0)

Subject: The task tree and its cards | Introduced: v0.22.0 | State: active

The stage did more than divide work: it judged planning depth and executable-unit size, decided which uncertainties required durable research, materialized research or task cards, carried dependencies, order, parallelism and model tiers, obtained one bundle approval, and handed those approved units to Work. Calling that whole boundary `split` made one technique look like the purpose and left the planning and handoff responsibilities hard to infer. The invariant “one concept, one word; skill name = artifact name = the single word” therefore requires the broader purpose name `direct`.

The rename changes identity, routing and ownership together: `skills/direct`, `devflow:direct`, `ROUTE:direct`, `external.direct`, `project.direct-or-work`, and `direct — ...` planning receipts are one atomic vocabulary. Direct owns work direction only. Work still performs research or implementation, Verify judges results, Resume chooses a stage from disk state, and the external coordinator alone assigns and supervises agent processes under DD-70. The reserved `re-split pending` marker remains because it names the narrower repair act of decomposing stale cards again; its destination is Direct, and it is neither a stage alias nor a compatibility route.

The owner confirmed that no project uses the former release, so an alias, duplicate package, fallback route, or migration branch would create two names and two possible truths without a consumer. Historical CHANGELOG, rounds, blueprints, legacy atoms, and the old generated-prompt cleanup filename keep their original evidence. Keeping `split` with a longer description was rejected because identity would still contradict purpose; `plan` was rejected because Product, Arch, and Design also plan; `coordinate` and `orchestrate` were rejected because they collide with DD-70's external role; renaming `re-split` merely to remove the token was rejected because it would broaden the data grammar while losing a precise action.

Affected coordinates: all authored P2 package routes, readers, writers, fixtures, and generated adapters; the component and flow maps; deploy manifests and current repository checks; DD-69's stage-name wording; and the current maintenance instruments. DD-25's disk approval boundary, DD-69's document-versus-build separation, and DD-70's external coordinator boundary otherwise remain in force.

Revisit when Direct begins assigning or supervising processes, Work can no longer consume its approved units without another planning owner, `re-split pending` is observed to act as a package alias rather than a card-repair action, or a real installed project requiring migration is produced.

### DD-90 · A T-low card carries its bounded code basis and essential constraint, and a task-specific completion signal owns its named fixture (v0.19.0)

Subject: The task tree and its cards | Introduced: v0.19.0 | State: active

Observed problem: a low-tier backup or export card could be approved with only the upper
documents that work reads automatically. The next executor then had no committed store or
envelope consumer path and no statement that current state must be consumed before export, so
it could implement against a plausible stale snapshot and still satisfy the card literally. A
second responsibility gap let a completion signal name a task-specific fixture that no
Destination owned; passing the command could create or depend on an undeclared artifact, and a
later worker could delete it as out of scope without visibly changing the promised outcome.

Chosen boundary: when T-low work consumes committed providers or current consumers, `Read
first` names only the minimal bounded concrete paths that expose that contract and Destination
or Forbidden carries any essential ordering or dataflow constraint. Truly greenfield or
independent work uses one explicit N/A form. Every completion signal states its expected
observation and what that observation proves; when it names a task-specific test or fixture
path, Destination declares that exact path as a deliverable. A broad suite command that names
no such path is exempt from path declaration, not from stating proof. work checks the contract
before claim or resume and returns a deficient card to split through the existing repair path.

Why it is needed: automatic baseline documents describe the domain but do not identify the
current code edge a mechanical executor must consume. A command proves only the assertion its
card names, and a task-specific fixture has no durable owner when it is present only inside the
command. These are execution boundaries, not implementation directions. One composite card may
still affect several capabilities; paths stay bounded rather than exhaustive, and knowledge
promotion continues to land by semantic owner rather than card number.

Rejected alternatives: every possible code path — unbounded and turns the card into a code map;
one card per capability — regresses composite-card flexibility; copying provider truth into the
card — duplicates its canonical owner; accepting automatic reads as the T-low basis — reproduces
the observed missing consumer edge; declaring every test in a broad suite — noise with no
additional responsibility; and prescribing the implementation method — conflicts with the
card harness boundary.

DD-44 correction evidence (missing record restored in v0.23.20): a cold Direct run copied
automatic Layer 0 and current capability paths into `Read first` while omitting concrete
provider/consumer code/test paths, so Work stopped at `missing-bounded-basis` before
implementation. This is the exact “accepting automatic reads as the T-low basis” alternative
DD-90 already rejects. DD-44's number-rule ownership remains; only its sentence that quietly
defers a duplicated v0.10 baseline path is corrected. Current coordinates are Direct
`spec.mjs`, `body.md`, and `authoring-card.md`; Principles
`references/knowledge/inputs-and-entry.md`; Work `body.md` and the existing basis collector;
matrix §3.23; and the two targeted tests.

Impact coordinates: task-card construction and repair in `skills/split/SKILL{,_ko}.md`, claim,
resume, and delegation preflight in `skills/work/SKILL{,_ko}.md`, the A17 matrix cells, and the
repository invariant fixture. DD-24, DD-25, DD-50, DD-55, and DD-69 remain in force.
Revisit when: a bounded path is shown unable to identify the consumed contract without an
implementation recipe, or a task-specific fixture can acquire another durable owner without
duplicating the completion contract.

### DD-94 · After the exact-title task commit, unsettled evidence forbids only COMMIT; settled evidence with no upper feedback or a fully consumed compatible set uses the boundary commit as its one late vehicle (v0.20.0)

Subject: The task tree and its cards | Introduced: v0.20.0 | State: active

Observed problem: the first greenfield real-use card made its task commit with the canonical
exact-H1 subject while review and `carry` were still absent. Work's `boundary-incomplete` guard
then returned permanent `BLOCK` before every stage, so even `review-reduction`, the producer of
the missing evidence, was unreachable. Removing only that guard exposed a second loss in replay:
after a valid `carry:` line, appending `review result:` made the state tool read the last progress
line overall and change a physically present carry to `absent`, so work would append a duplicate.
The same fact vanished silently from `missing`, the current claim, and capability closure's
`children-done carryFacts` harvest.

Desired behavior: keep exactly one exact-H1 task commit while leaving non-committing completion
and review evidence producers reachable afterward. A late line of one evidence kind never
retracts a valid fact of another kind. After evidence settles, an unjudged or UNKNOWN
`feedback.action` is requested before any boundary effect. A `none` value lets the existing
boundary commit carry a missing carry line and the claim→done move. `compatible` must finish the
existing semantic-owner path while an exact proposal is never-seen or current, and may close on
the same boundary vehicle only when every exact lifecycle is `consumed` and no current marker from
this card remains. UNKNOWN, current, and never-seen compatible states, and every other known
feedback value, do not close.

Chosen boundary: remove the `boundary-incomplete` BLOCK and replace it with one `RESTRICT` guard
that forbids only the `COMMIT` verb while the task commit is present, integration and HANDOFF are
current, finish-boundary is missing, and completion or review evidence is unsettled. Evidence-only
completion-signal and clean-review producers remain reachable, while any branch containing a
checkpoint or second task commit is refused mechanically. Once completion is `pass` and review
is `pass`, `waived`, or `not-applicable`, an unjudged or UNKNOWN `feedback.action` returns an
actionable `BLOCK` naming the required judgment before the boundary table acts. Once known,
the two existing `feedback.action=none` rows remain: absent carry writes one line before the
claim→done move and boundary commit; present carry skips that write and uses the same move and
commit. Two exact-lifecycle rows built on DD-96 also exist for `feedback.action=compatible`. They reuse the
same effects only when every proposal is `consumed` and no current marker remains: never-seen
writes the canonical transport first, current continues routing to Resume, and UNKNOWN or invalid
blocks. Every other known non-`none` feedback value remains on the existing `pending`
`REPORT→WAIT` branch.

In the same change, `carryState` selects the **last valid carry-kind line**, not the last progress
line overall. That matches signal and review's existing last-of-kind meaning; a malformed later
carry line still appears through `integrity.shape` but no longer masks an earlier valid fact. The
work collector's structured-state fallback uses the same selection. The state tool stays
read-only and gains no field, zone, format, or writer.

Why the boundary is needed: `RESTRICT` rejects the dangerous effect rather than proliferating
recovery stages per judgment value, preserving both evidence production and one-task-one-commit.
Last-valid-of-kind removes carry's lone lossy special case and corrects every existing consumer
through one owner: `missing`, claim projection, and closure harvest. The boundary commit already
is the shared passenger vehicle for HANDOFF and status movement, so no new commit or writer is
created. DD-09, DD-15, and DD-83 remain active. This is the bounded answer to both of DD-83's
recorded revisit conditions: the tool caught a real omission that the same session could not
close, and it called an existing carry missing.

Rejected alternatives: widen `compatible` to `missing` generically — at introduction no durable
producer existed, so this would only have extended the existing zero-effect work→resume→work loop;
add recovery stages and conflict rows per
judgment — they duplicate one COMMIT risk and the existing pending behavior; make a second H1 or a
post-title checkpoint — that violates DD-09 and erases last-card-commit recognition; repair only
the collector — `missing` and closure harvest still lose the fact; append carry again at the end —
that deliberately duplicates it; add a carry field or separate boundary writer — one fact gains
two homes and new authority.

Later provenance correction (DD-96): the `compatible` rejection and none-only boundary above
depended on DD-94's introduction-time premise that no durable producer existed. DD-96's canonical
`compatible feedback pending` transport and exact never/current/consumed lifecycle satisfy
DD-94's recorded condition that a durable producer make the pending path terminable, so that
premise no longer applies to the consumed state. This correction does not permit generic
`compatible` closure. Evidence producers remain reachable, unsettled evidence still forbids
COMMIT, and one exact-H1 task commit, one boundary vehicle, and no new writer remain invariant.
UNKNOWN, current, and never-seen compatible states still do not close.

Affected coordinates: `skills/work/{spec.mjs,body.md,fixtures/scenarios.json,collectors/index.mjs}`,
`skills/work/collectors/project-state-seam.test.mjs`,
`skills/principles/scripts/project-state.mjs`,
`skills/principles/references/delivery/commit-and-verification.md`, and
`scripts/project-state.test.js`. DD-96 continues to own compatible-feedback transport; this
decision recognizes only the effect by which its exact consumed lifecycle terminates the late
boundary. Automatic activation gating remains outside this decision.
Revisit when: an authorized authoring flow proves the last carry-kind line is not the current
fact; a late evidence-only write is measured to require a second task boundary; or DD-96's exact
consumed lifecycle fails to terminate the pending path deterministically. DD-96 has satisfied the
former durable-producer condition.

### DD-96 · Compatible feedback persists as a first-complete-set-sealed card-boundary payload and Resume proves one semantic-owner landing at a time (v0.20.0)

Subject: The task tree and its cards | Introduced: v0.20.0 | State: active, partly corrected by DD-97 (v0.21.0)

Observed problem: a clean Work review could discover compatible reusable feedback, yet the
existing `compatible` branch merely reported an owner handoff and then closed the card without
persisting the content. Putting it in K mixes execution evidence with the current reusable-truth
owner; putting it in a free note or HANDOFF has neither a canonical consumer nor an atomic
completion boundary. A superficial owner-file diff also does not prove that content, provenance,
and downstream implication actually landed.

Desired behavior: Work loses no compatible feedback at either a pre-title or post-title boundary.
Only while the card has no lifecycle does it mechanically relate the already-collected pending and
eligible sets to the card target and atomically produce the complete deterministic owner set once.
The first after-state whose lines are all canonical payloads, use one source, name each owner once,
and resolve every owner path seals the set. Every later cold reentry consumes the sealed current and
consumed lifecycle fact plus an empty eligible set instead of inventing proposals or reconstructing
pending state again.
Resume totally routes current owners through the existing Product, Design, Arch, and Adopt stages.
Each stage removes one marker only after canonical state replay proves its exact owner contains
Background, Why/evidence, Conclusion, implication, and the card@commit provenance. Other owners
remain as residual markers.

Chosen boundary: the canonical grammar is one `compatible feedback pending: payload-json:` line
whose payload keys are ordered `owner`, `source`, and `coordinates`. Coordinate keys are ordered
`target`, `background`, `why`, `conclusion`, and `implication`, and every value is non-empty. The
owner is only product, glossary, design, arch, or one exact capability design document; source is
an exact card path plus full commit oid, and every member of the first set uses the same source
revision. The first transition whose after-state leaves every compatible line for one source card
wholly acceptable—canonical valid payloads, one source, one line per owner, and every owner path
present—is the introduction and seals the complete after-state exact-payload set. A transition that
leaves any unacceptable line for that card is not the introduction; an invalid line unattributable
to a card defers every unsealed card in that transition. Reintroducing an existing member or introducing a later same-card owner, oid, or
coordinate paraphrase is an integrity block. No new journal grammar, tombstone, or note layer is
added: existing Git lifecycle history is the canon for the seal and consumption state.

Pre-title first production adds the complete marker-set write to the existing card content and
exact-H1 task commit. Post-title first production is a journal-only boundary commit and never
changes the card. Once any lifecycle exists, Work requires the collected lifecycle fact to be
`settled` and the eligible set to be empty, makes no pending-set comparison, and produces no new marker. Current
members continue routing to Resume, consumed members stay permanently retired, and later feedback
enters a new request and card. Another card's marker does not hijack current work. Unjudged UNKNOWN
still blocks with its named need, while `none`, staling, and design-note paths do not change.

Resume sends product and glossary to Product, design to Design, greenfield arch and capability
owners to Arch, and brownfield arch and capability owners to Adopt. The owner stage writes the
exact content first and waits for state recomputation. Only a reentry whose state proves source
and five-coordinate semantic landing may combine byte-identical marker deletion with the exact
owner diff in one commit. An owner-file change is necessary deletion authority, not sufficient
semantic-landing proof.

Why: this boundary preserves DD-09's one-fact-one-home rule, DD-83's K ownership, DD-87's semantic
owners, and DD-94's single exact-title task commit while carrying reusable truth without a
1000-to-30 summary loss. Using the first wholly acceptable after-state as the seal preserves complete atomic
multi-owner production and partial consumption while making a cold session terminate
deterministically instead of reopening the card under a new oid or rewritten coordinates. The
card owns execution and provenance, the journal owns current pending transport, Git history owns
the seal and consumption lifecycle, and the owner document owns current reusable truth. Work
closes to Verify only after every sealed member is consumed and no current member remains.

Canonical owners: the Principles state tool owns grammar, Git-seal derivation, validation,
lifecycle reconstruction, and priority; Work owns atomic production and the mechanical exact-set
guard over already-collected facts; Resume owns total routing; Product, Design, Arch, and Adopt own semantic
landing and atomic consumption.
Evidence: `skills/principles/spec.mjs`, `skills/principles/scripts/project-state.mjs`,
`skills/work/spec.mjs`, `skills/resume/spec.mjs`, the four owner skills' compatible-feedback
stages, `scripts/project-state.test.js`, and each skill's executable fixtures.
Integration-authority proof (2026-09-02): repair
`c28facc1b9707f06234a32426f9b51a695bad053` keeps the configured integration tip as the only
compatible-feedback lifecycle authority. When it excludes the invoking worktree, the existing
`integrity.blocking` route reports `compatible-feedback-integration-behind` and
`update-current-branch-from-integration`; a competing committed or uncommitted local transition
makes the lifecycle fact `invalid` without unioning local truth into integration truth. Independent
Fable review passed after executing the current five linked-worktree scenes 5/5 and the parent
fifth scene 0/1. This proves the canonical Principles-to-Resume path only. The uncommitted-local,
update-to-overlay, and merge-commit-entry probes and the source-literal Product/Design direct-entry
residual are unverified, not passed.
Revisit when: normal Git history cannot deterministically identify the first complete introduction;
state replay cannot deterministically establish an equivalent semantic landing; or evidence shows
that multi-owner all-at-once landing is necessarily safer than partial consumption. History-derived
blocking compatible-feedback findings are currently permanent and project-wide. Revisit a
clearable-finding design after a non-Work writer reaches one in field use: derive reopen findings
from the current journal, walk consumptions oldest-first, skip removal validation for an identity
already consumed, and treat removal of a consumed nonmember as advisory.

### Rejected under this subject

- **[DR-02 · v0.7.0]** **Card-promotion trigger inside work** — a door to silent scope expansion. (What was
  rejected is a standing trigger inside the work loop. The authorized path remains: the
  canonical rules' discovery→update table catches "merely bigger than expected" and routes
  it to split's promotion procedure.)
- **[DR-12 · v0.9.12]** **Unifying contradiction resolution onto the table** — a rewrite sending
  document-vs-document contradictions to the discovery→update table instead of steps
  1–4. The refutation pass run right after applying extracted two regressions, and the
  original text was restored: steps 1–4's side effects (`.stale.` marking, re-split)
  vanish on the contradiction path, and some wrong sides have no landing row in the
  table (design.md · an existing code-style line · a completion signal that runs but
  asserts the contradicted behavior). Any re-proposal must solve both. The literal
  collision between the contradiction sentence ("reconcile through this procedure")
  and the steps-1–4 scoping sentence ("only when a lower layer must violate") remains
  an open observation item — the field-observed Layer 0 freeze is already covered by
  the draft clause (adopted in the same version).
- **[DR-29 · v0.12.0]** **A session- or date-scoped work bundle file** — all of them need a closing point, and a
  closing point always leaks when a session dies silently. The card already plays that role
  as one completion signal, one commit.
- **[DR-39 · v0.13.0]** **A `legacy signal migration` marker state machine** — 25 to 40 canon lines for a residual
  risk already bounded by work's existing rule that an uncommitted change in another unit's
  claim is checkpointed first.

## Concurrency, claims, integration

### DD-07 · devflow does not create or manage a Git-worktree workflow

Subject: Concurrency, claims, integration | Introduced: origin | State: active

For parallelism: core edits are common, so coordination/merge cost > parallel gain. For showcase: the user confirmed "screen may break during work" → benefit gone. This does not mean ignoring repositories where the user already has several checkouts or worktrees. Recovery distinguishes the current checkout from shared state on the integration branch

### DD-14 · The multi-mode split axis is the **scope of truth**, not people

Subject: Concurrency, claims, integration | Introduced: origin | State: active

Documents with a single truth (project·tree·journal) are shared; only person-owned state (HANDOFF·marker·identity) is isolated into rooms (users/<id>/). Adopted after refutation-fork verification of 4 candidates (5 rounds total, real defects extracted each round) — rejection lineage below

### DD-15 · HANDOFF is committed to git but never in a dedicated commit — it rides the boundary commit only

Subject: Concurrency, claims, integration | Introduced: origin | State: active

A dedicated HANDOFF commit polluted history and was reverted in practice (2026-08-06)

### DD-31 · Shared routing state in multi comes from the integration tip, not the local branch (v0.9.21)

Subject: Concurrency, claims, integration | Introduced: v0.9.21 | State: active

Layer-opening, verification-state, and initial-claim commits land on integration, but another checkout with an existing claim could miss that transition when it read only local HEAD. An initial claim is also a binding decision that prevents duplicate work under the same number; implementation waits until both integration tip and the current branch contain it. Next-stage routing and integrity checks now read project, tree, journal, and verify at the integration tip and include an unfinished transition commit that is not yet an ancestor before local claimed work. Unrelated changes are checkpointed first. Before writing status renames, HANDOFF, journal, or feedback documents, a task boundary integrates the final task commit or checkpoint it records with arch.md's merge method; after rebase it records a changed checkpoint hash in journal. A `card:` source checkpoint for promotion or an out-of-scope prerequisite likewise reaches integration before the layer-opening marker. This is not a policy for devflow to create or assign worktrees; it is compatibility so user-created branches or worktrees see one shared state. Digest diff reading and marker advancement remain clean-boundary-only

### DD-40 · An approved parallel group is claimed together in one step (v0.9.23)

Subject: Concurrency, claims, integration | Introduced: v0.9.23 | State: replaced by DD-60 (v0.14.0)

The cards' own reciprocal parallel Approval (v0.9.21), the branch that permits two claims, and integrity item 1 all existed, but no entry procedure created that state, so the `parallel` field was a dead state nothing could reach (inherited from 0.9.20). One entry rule closes it — solo claims the group together; multi distributes it through ordinary single claims. The single-claim-first principle stands unchanged outside a group. **Corrected in v0.14.0**: free parallel claims replaced this row — the one-step group claim and the reciprocity predicate lost their reason to exist and were removed; claims are taken one at a time with no condition. The `parallel:` field survives as the plan's recorded judgment and an informational source (see the free-parallel row)

### DD-46 · One mode — rooms are always on, and working alone folds the integration branch into the branch you are already on (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active

The solo/multi fork never modeled **work that flows concurrently**. It assumed one person means one flow, so two terminals were an integrity anomaly. The fork cost 59 lines across 8 files, and a solo session read all of them only to be told to ignore them — same reading cost, one extra decision. Unified, the whole cost to a lone user is **one commit per card** (the claim), and that commit is exactly what makes worktrees and concurrent terminals work. When `integration` names the current branch the integration tip is HEAD and every fetch, push, and integrate order collapses into an ordinary commit; a purely local integration branch needs no network command either. This overturns v0.9.23's "solo claims the group together, multi distributes it": that split's recorded ground was "one entry rule closes it", and with no modes the same approval simply permits both consumptions — the split was an artifact of the fork. v0.9.21's approval-freshness ground stands unchanged; only its authority expression collapsed to the integration tip. Outside a Git work tree the reduction is stated explicitly rather than left undefined

### DD-47 · Claims move to the depth-1 unit axis, and one canonical candidate order settles every selection (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active, partly corrected by DD-60 (v0.14.0)

The tree and the capability documents were already a domain axis, but claims stayed tied to the person axis. Keying `.wip.` to (id × depth-1 unit) expresses concurrency with zero new identifiers, and integrity item 1's two exceptions — reciprocal parallel approval and evidence-wait — were always exceptions inside one capability, so the scope now fits them exactly. Above that, several places asked "which one next" and answered differently; the canonical candidate order defines it once as the card the user named, then the session unit, then the carried unit, then the rest. It never changes which routing row matches and never makes an unready card ready. The recognition machine that lived only in domain entry was promoted to canon, and resume and the baseline predicates now cite it. A conversation change request routes above the claimed-card row, not below it as the plan proposed — the persisted `maintenance routing pending` form already outranks a claim, and once claims are normal in several units at once, placing the conversation form below would record it almost never. One person's two terminals share one id, so disk cannot tell them apart — that limit is stated in the README rather than hidden, and the approval on resume's report is the device that actually separates them. **Corrected in v0.14.0**: the unit half of the claim key stepped back — "one claim per id per unit" turned out to rest on a one-terminal-per-person assumption and was replaced by free parallelism, and item 1's two-exception wording went with it (item 1 is redefined as orphan-claim detection). Canonical candidate order and the request-row placement stand unchanged

### DD-49 · Git is a requirement, and worktrees are the flow registry (v0.12.0)

Subject: Concurrency, claims, integration | Introduced: v0.12.0 | State: active, partly corrected by DD-51 (v0.13.0)

Two soft edges hardened after measurement. The no-Git degradation had to define what Approval, the integration tip, claims, prefixes, and the digest marker mean when none of them can run — six canon lines describing a devflow that is not devflow. Requiring Git costs one sentence and deletes all six; a repository without Git has no recovery, no claim, and no undo, which is not a weaker devflow but a different object under the same name. On worktrees, the recorded fear of needing a remote was measured and refuted: worktrees of one repository share one object store, so `git push . HEAD:<branch>` lands locally with no remote at all, a commit in one folder is visible from another with no fetch, and the only real constraint is that Git refuses to write to a branch another worktree has checked out. `git worktree list --porcelain` therefore enumerates the folders a repository has open, and `git worktree prune` cleans one that is gone. **Corrected in v0.13.0**: this row originally called that listing the durable per-flow identity the rejected `flows/` folder (X2) wanted, and derived shared tree state as the integration tip unioned with each worktree HEAD. A folder list is not a flow's identity — a folder can hold no flow, or a flow that died — and the union is overturned by the row below. devflow still creates and manages no worktree — it reads the one Git already keeps

### DD-51 · Shared truth is one integration branch; another worktree's HEAD is evidence, not authority (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active

v0.12.0 read shared tree state as the union of the integration tip and every worktree HEAD, and that rule breaks in both directions. A worktree that lags revives a card someone already finished, back into a claim. Excluding the laggard instead erases a live sibling's claim and hides work that is finished but not yet integrated, so the same card gets implemented twice. Both failures come from judging card state by branch-level freshness. The initial claim is already a binding decision that lands on integration, so reading integration alone shows every claim; reading another HEAD adds nothing and imports stale state. Its code and progress log are still that flow's evidence and arrive when it integrates - they are simply not used to judge shared state

### DD-52 · A shared transition is published against a remembered integration id (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active, partly corrected by DD-62 (v0.14.0), DD-70 (v0.16.0)

Even with integration checked out nowhere, two flows pushing at the same point make one of them lose, and that is concurrency control working rather than a failure. Without separating them, ordinary contention is misread as "integration unusable" and sends the session down the blocked path, scattering claims for no reason. The first measurement suggested the id itself could discriminate — an ordinary race leaves it changed, a worktree holding the branch refuses with it unchanged. The live concurrency run refuted that: a flow that reads integration *after* a sibling has already published remembers an id that then does not change, yet its rejection is an ordinary non-fast-forward. The mechanical test is therefore whether the integration tip is an ancestor of the branch being published — not an ancestor means ordinary contention, an ancestor with a refusal means a structural blocker — and both live cases classify correctly under it. Error text is never the discriminator, because it varies by locale and Git version. Three retries bound it, and sustained contention is reported rather than fed into the failure ladder. When integration truly cannot be written, only code edits and progress-log checkpoints of an already-claimed card continue: with no coordination point, no global answer exists for who minted what, while code and a progress log merge safely (measured on separate cards and on a done-rename against a log append). This is also what lets an orchestrator hold integration - it must then create the cards and claims there before starting a worker. **Corrected in v0.14.0**: the blockade continue list widened — the final task commit, and journal appends that mint nothing and claim nothing (four exactly enumerated kinds), continue too. The "only code and logs" freeze proved to be that round's one silent-loss path (a request spoken during a blockade evaporating); see the blockade-appends row

### DD-53 · Several sessions in one working folder are normal, and their safety is five measured lines rather than a lock (v0.13.0)

Subject: Concurrency, claims, integration | Introduced: v0.13.0 | State: active

The owner's daily practice is several terminals over different sections of one capability, so forbidding it removes the point of the tool. Measurement found only three collision points and all three close without a lock: a commit that names its own paths carries one file even while another session has staged others; four sessions appending to journal at once lose no line; and HANDOFF stops being contended once open decisions live in journal, because what remains is recomputed from the tree. On shared source files one folder is actually safer than two - a partial edit lands on top of what the other already wrote, while splitting into worktrees defers the same conflict to a human merge. Only a whole-file rewrite overwrites quietly, so one line forbids it. Nothing here blocks; every line is a way of not breaking

### DD-60 · Claims are freely parallel, and a checkpoint carries only the changes this session made (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

The recorded ground for "one claim per id per depth-1 unit" (containing half-done sprawl, keeping claim state simple) rested on a one-terminal-per-person assumption. The owner's actual practice is six or more terminals splitting one capability's sections, and its only legal path was a one-step group claim — miss that door and the parking detour commits a sibling session's half-written diff at an arbitrary moment and releases its card. Measurement had already shown free parallelism safe (own-path commits, append-only journal, coexisting partial edits). So any terminal claims a ready card immediately, and existing claims of mine in the same unit are named in one informational line — sprawl visibility moves to resume's claim listing and its which-claim question when several claims meet an unaddressed resume. The `parallel:` field stays, being part of the Approval value format, but is decoupled from claim legality and feeds the informational line — v0.9.23's one-step group claim and the reciprocity predicate lose their reason to exist and are removed (zero card-format migration). Every checkpoint-style rule is rescoped to "the changes this session made to that card": uncommitted changes cannot be attributed to a session, so the unlimited reading of "checkpoint another unit's uncommitted claim first" could not coexist with several sessions (it still holds for the session that made the changes, so the bounding argument in the legacy-signal-migration rejection stands). Integrity item 1's condition becomes meaningless, so the item is redefined — a claimed card whose id matches no room (an orphan claim) — preserving the item number. Two terminals carrying the same card cannot be machine-prevented (terminals have no identity — the same measurement that rejected per-worktree identities), so the README guideline owns it

### DD-62 · During a blockade, journal appends that mint nothing, claim nothing, and consume nothing are written immediately (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

v0.13.0's publishing paragraph made even journal line creation wait for integration to open, and the real result of that freeze was the loss this system guards against most: a session dying while blocked takes the user's spoken request with it, existing nowhere but the dead conversation (the independent review's only top-grade risk). The original ground — no coordination point, no global answer — does not reach appends: an append needs no global answer, and that decision's own measurements showed appends merge safely. The allowance is an exact enumeration: maintenance requests, capability notes, attributed open items and decisions, product re-run pending. Layer opening (it mints numbers), evidence records (they need a push), verification-state lines, and every consumption (deletion) still wait. The final task commit is named on the continue side — it belongs to the session's own branch, yet sat in neither list, violating the same paragraph's own declaration that nothing waits unnamed

### DD-63 · Journal merge conflicts resolve 3-way, not as a union (v0.14.0)

Subject: Concurrency, claims, integration | Introduced: v0.14.0 | State: active

The recorded reason for "union — keep both sides, date-ordered" was record preservation, but measurements 15–16 already rejected the same semantics in `merge=union`: a line one side consumed and deleted is revived by the other side's nearby append, so a request that was already planned comes back and the same fix is planned twice under a new number. That is not preservation but a ghost replay. The replacement: against the merge base's journal blob, a line present in the base and absent on one side was consumed — never restore it; a line absent from the base is an addition — keep both sides' additions in time order. Additions are all preserved, so 3-way honors the original reason better than union did. Blockade appends raise merge frequency, which makes the two decisions one body

### DD-66 · The tweak lane confirms its landing by machine first, and in same-file contention the tweak side yields (v0.14.2)

Subject: Concurrency, claims, integration | Introduced: v0.14.2 | State: active

This repairs three failures the v0.14.0 audit reproduced with Git fixtures: a tweak commit on a nameless HEAD lands in no branch and survives only in the reflog (4.2) · one tweak commit's HEAD advance turns a `routing prepared` recovery pinned to a base commit id into an integrity anomaly (4.4) · `git commit --only <path>` carries another session's half-done changes left in the same file (4.3). The path where a "no" reached from a stale checkout's documents produces a commit conflicting with a decision already landed on integration (4.5) was also confirmed. So the lane runs machine checks before editing — a named branch (`git symbolic-ref -q HEAD`) · no `routing prepared` in any working-tree verify.md · the readable integration tip an ancestor of HEAD · no uncommitted changes this session did not make on a target path immediately before editing — and compares the diff against its own changes immediately before committing. This is not state restoration but the commit's landing preconditions: the tree, journal, HANDOFF, and projections stay unread, and the checks are Git commands and bounded searches only, so the entry-cost saving (G6) holds. Resolving same-file contention stands on the fact that a session can always back its own changes out and reapply them — the side that steps back is fixed as the tweak side, so no mutual wait can form. The short race between check and commit does not close without a lock or session identity, so it stays in the not-covered table (the rejections of locks, per-terminal identities, and managed worktrees stand). DD-61's "bypassing the nets breaks nothing" statement is partly corrected by this decision

### DD-70 · `coordinator` is a declared role, not a devflow stage; one role contract owns its duties, and devflow behavior and state do not branch on whether orchestration is in use

Subject: Concurrency, claims, integration | Introduced: v0.16.0 | State: active

DD-53 made several sessions in one working folder safe, but an outside actor assigning sessions can answer human gates on their behalf, direct whole-file rewrites, or leave knowledge only in an off-disk channel; those actions lie outside the trust boundary, so the existing state machine cannot detect them. A registered skill or new state would make devflow behavior branch on the assignment method, and that mechanism still could not enforce conduct outside the trust boundary. Therefore this decision inherits DD-19's verbatim-briefed role-contract form and puts the duties in one place, `skills/principles/coordinator.md`. The document map and this decision record the contract's existence and role; the hook and README only point to it. Because minting task-card numbers is a binding decision, one split worker lands `split — begin <parent>` and the following planning commit on the integration branch before parallel implementation workers are assigned. Claims are not made in advance on someone else's behalf, and the `coordinator` does not leave the integration branch checked out. The worker carrying the card creates the claim in work's initial claim commit; if the `coordinator` preclaims under the same owner id, several claims accumulate and an unaddressed resume asks which card, adding ambiguity. No existing skill, state, commit kind, id, or room changes.

### DD-109 · Initial Product/Adopt publishes the room atomically in its first binding boundary, not as a standalone commit (v0.23.19)

Subject: Concurrency, claims, integration | Introduced: v0.23.19 | State: active

Observed problem: for the same cold Adopt input, one run created a standalone room-join commit after
proposal approval and made the approved snapshot stale, while another run omitted the room before its
first core write. Interruption after a standalone join leaves a managed room-only checkout with neither
Product nor approved Adopt meaning, so Resume has no durable basis for continuing the same request.
Reclassifying a clean room-only checkout as unmanaged cannot distinguish a fresh join from a formerly
managed tree deleted down to its rooms and would reverse DD-101's partial-state protection.

Desired behavior: initial Product or Adopt resolves the actor and Git identity read-only while preparing
binding confirmation. Refusal or interruption before approval remains write-free. After approval, an
absent canonical room rides the existing first binding commit, while a room already created by
pre-Product research is neither overwritten nor staged again.

Chosen boundary: the shared policy index opens Identity and Rooms for initial Product/Adopt binding
preparation and resolves identity read-only after the open-Git-operation gate. Product `commit-initial`
and Adopt `approve` each own the exact order in their P2 effect plan. Immediately before the existing
first commit, only an absent room materializes as owner.md, empty HANDOFF.md, and digest.md; digest holds
the pre-boundary HEAD or `none` for unborn history, and those three paths are staged with the approved
owner set. This narrow initial publication extends the shared standalone joining transition; DD-46's
one-mode and claim-per-card choice remains unchanged. Existing
rooms, later-member joining, newcomer, research, upgrade, claim, and state-classification paths remain
unchanged.

Why the boundary is needed: each P2 spec is the sole owner of ordered effects, so shared prose cannot
prevent model-dependent omission. A standalone room commit splits approval freshness and interruption
recovery across two boundaries; combining it with the existing first binding commit makes identity and
approved current meaning durable together without an ownerless fragment. The combined boundary-commit
and journal precedents support co-landing the parts of one transition, but did not already authorize this
initial room publication, so this decision grants only that narrow extension.

Rejected alternatives: joining before approval violates write-free refusal/interruption and approval
freshness. Fresh re-entry after join plus a room-only unmanaged classification adds user-visible entry
and misclassifies a deleted managed tree as new Adopt. A standalone post-approval join prefix retains its
immediate interruption gap. Adding the mechanism to every writer stage or a common runtime is wider than
the two reachable roomless initial writers and duplicates the behavior owner.

Affected coordinates: `skills/principles/references/{policy-index.md,state/identity-and-rooms.md,delivery/commit-and-verification.md}`;
Product `spec.mjs`, `body.md`, and approval fixture; Adopt `spec.mjs`, `body.md`, workflow, proposal
template, and approval fixture; `docs/design{_ko}.md` component intent lineages; matrix §3.24; generated receipts for the three packages; plugin
manifests; CHANGELOG; and the v0.23.19 report. project-state, Resume, other stage specs, runtime, trace,
evaluator, existing-room, research, upgrade, and claim effects do not change.

Revisit when a roomless initial binding writer is observed outside these two branches, an existing room
is staged again, either the actor room or approved meaning is absent after the first commit, the digest
points at the containing commit instead of the pre-boundary tip, or atomic publication breaks an existing
integration or room consumer.

### Rejected under this subject

- **[DR-06 · v0.8.0]** **Candidate A (shared documents + ID tags) · Candidate C (per-user folders)** — absorbed
  into the adopted design D ("scope of truth").
- **[DR-07 · v0.8.0]** **Candidate B′ (gitignored private files + public notes)** — preserved rather than
  rejected: kept as the answer for teams that must leave no devflow traces in the
  repository. Not used on the normal adoption path.
- **[DR-26 · v0.12.0]** **A recorded focus field** — one `## Focus` line in HANDOFF storing "today it is this
  capability" durably. Its recorded ground, "that fact survives nowhere", is false: the
  declaration lands within one step as the claim rename, and past the boundary
  `Next single step` carries it. The one remaining hole is "declared, then the session ended
  with zero disk change", which costs one sentence — while closing it costs three writers
  (resume writes no file), a staleness judgment, and recovery rules. Unobserved friction, so
  it falls to "the harness grows only on a defect actually met".
- **[DR-27 · v0.12.0]** **A per-terminal state folder (`flows/`)** — terminals die silently. With no closing point
  the folder lives forever and needs a cleanup rule. The capability axis never disappears, so
  it never needs closing in the first place.
- **[DR-28 · v0.12.0]** **A second identifier level under the person** (`users/<person>/flows/<flow>/`) — every
  rule written "per id" splits into "per person × per flow", doubling exactly the most
  delicate area, recovery and integrity. Mode unification solves the same problem while
  shrinking the canon.
- **[DR-33 · v0.12.0]** **devflow creating or managing worktrees** — the recorded rejection ("core edits are common,
  so coordination cost beats parallel gain") is not overturned. This design does not create
  worktrees; it is merely compatible with worktrees the user already made.
- **[DR-35 · v0.13.0]** **`merge=union` on journal** — measured and refuted. With one side consuming a request
  and deleting its line while the other appends nearby, union revives the consumed request;
  with one side replacing an `evidence-wait` record by `evidence-finalizing` while the other
  appends, both records survive, which violates integrity item 13 with no handling rule.
  A union that resurrects deleted state is worse than a conflict a person resolves.
- **[DR-36 · v0.13.0]** **devflow creating or managing worktrees** — measured and refuted as a safety device.
  Two worktrees editing the same region of one shared file conflict at merge time, while two
  sessions in one folder do not, because the second edit lands on top of the first. Splitting
  the folder buys build isolation, not safety; the v0.9.x rejection of managed worktrees
  therefore still stands and needed no overturning.
- **[DR-37 · v0.13.0]** **An atomic lock helper for shared files** — made unnecessary by measurement. A commit
  naming its own paths and an append-only journal already give what a lock was wanted for.
- **[DR-38 · v0.13.0]** **A helper script for compare-and-set publishing** — its necessity was never argued.
  `git push . HEAD:<branch>` is fast-forward-only and `git update-ref <ref> <new> <old>` is
  explicit compare-and-set, so no helper is required. Measurement also found `update-ref`
  succeeds against a branch another worktree has checked out, silently desynchronizing that
  worktree, while the push refuses — so the plain push is the safer primitive, not the
  weaker one. Adding a script would change what devflow is: pure prompt text.
- **[DR-41 · v0.13.0]** **Ancestor-aware blob projection of other worktrees** — superseded by reading one
  integration branch. Once no other HEAD is authority, a filter that adds only their claims
  has nothing left to add.
- **[DR-42 · v0.13.0]** **Per-worktree git identity** — technically possible (`extensions.worktreeConfig` plus
  `git config --worktree`), and rejected on what follows: it rewrites commit authorship, so
  integrity item 8's authorship check stops meaning what it says; it leaves a room per
  folder that nothing closes; and it splits one person into several ids that the shared
  documents then have to reconcile. The question "can it be done" was answered before the
  question "what does it cost", which is the mistake this round set out to stop making.

## The knowledge layer and capability documents

### DD-28 · Durable knowledge is connected through bounded consumers of existing records, not through a new document layer (v0.9.21)

Subject: The knowledge layer and capability documents | Introduced: v0.9.21 | State: active, partly corrected by DD-76 (v0.18.1), DD-91 (v0.19.0), DD-92 (v0.20.0)

glossary and journal were produced but arch, design, work, verify, and delegated implementers did not read them; conclusions completed after two dependent cards opened together also could not reach the next implementer. The repaired read set is completely enumerated by name: glossary and journal when present, plus only the cards directly named in `Depends`. For brownfields, adopt indexes only exact per-capability paths to existing handoff and specification files under arch.md `Existing records`. The index is neither a read instruction nor canon; work opens only a path that split rechecked against current code and placed in the card's `Read first`. "Related records" and whole-capability-folder reading remain forbidden. Layer 0 completeness includes glossary; when only it is missing, resume sends a brownfield to adopt and a greenfield to product without rewriting another confirmed document. This does not force a second domain-handoff layer in the style of jgnote; it closes reachability within the existing canon, tree, and short-record hierarchy. The retrospective likewise receives exactly one event-specific input set, so capability and whole-project scopes cannot merge. This index differs from the observation-cache registration field rejected in v0.9.18: `Existing records` substantively avoids all three rejection reasons — a rule consumes it (split rechecks each path and puts it in a card's `Read first`), it indexes brownfield existing records instead of restating the outside-records standing declaration, and its only home is arch.md (see that entry in the rejection lineage)

### DD-33 · The knowledge-reachability set — standing of outside records · conversation decisions land immediately · a user-confirmation gate on product's four core sections · a disproof row (replace the statement, or re-run product) · a means row · a pre-HANDOFF landing check · a survival path for research answers that are tools · verify's disproof arbitration (v0.9.18)

Subject: The knowledge layer and capability documents | Introduced: v0.9.18 | State: active

Grounds: cross-corroborated field evidence — the rdsf structural diagnosis (2026-08-11: knowledge vanishing at handoff, disproved auto-injected memory surviving every session, a replan document self-created outside the model and reachable only through a hand-written HANDOFF pointer), owner testimony (a stuck-to-breakthrough conversation omitted from HANDOFF), and matching traces in ade (a self-grown reference layer claiming decision ownership until a wrong statement entered ADR-002; HANDOFF format overflow). Two causes: being on disk is not enough — a fact off every skill's read path does not exist for the next session; and the only landing gate (upper-document feedback) fires at card boundaries, so conversation decisions evaporate. product's heaviest sections were also the only ones modifiable with no user gate (steps 1–4 and the table rows carry no confirmation step — proven from the text). Verification: three independent lenses (refuter · literal-execution over 8 scenarios · whole-system coordinate sweep) → repair → re-verification (all three prior majors confirmed fixed) → local wording repairs. Zero new terms

### DD-42 · The capability knowledge baseline — the domain blueprint a verification closure produces (v0.10.0, lifecycle extended by v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.10.0 | State: active, partly corrected by DD-76 (v0.18.1)

Grounds are three measurements: across jgnote's 12 existing handoffs the chronology sections held 60–68% of each document while hand-written freshness declarations failed; ade's G-T2 produced a dual-ownership incident; and the rdsf knowledge-reachability diagnosis pointed at the same gap. v0.10.0 adopted option D, where one writer replaces one file wholesale at the last verification closure. A verification campaign (16 refutation findings → 3 research passes → 2 Fable refutation passes with 15 findings → a re-audit with 13) refined that candidate contract. The [proposal](rounds/v0.10.0/proposal.md) now preserves only the grounds and rejection lineage; the executable contract lives in exactly one place, the canonical baseline predicates. The rejections of time decay, continuous refresh, append-only inheritance, Assumptions and Open Questions, an index, automatic glob attachment, staging consumption, and symbol binding all carry forward

### DD-43 · Capability documents physically separate a design zone born with Layer 0 from a verified zone refreshed at closure, and are always on (v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.11.0 | State: active, partly corrected by DD-76 (v0.18.1), DD-91 (v0.19.0), DD-92 (v0.20.0), DD-97 (v0.21.0)

The owner's operating intent is that a new MVP, a brownfield, and a mid-project join all obtain domain boundaries and concepts before the first card and reach them by number without card wiring. arch, or adopt in a brownfield, replaces the design zone; verify replaces the verified zone. They own disjoint byte ranges separated by the fixed `## Verified state` boundary. This decomposes rather than overturns v0.10.0's one-writer grounds: the two writing moments are serial, no byte is shared, design declares trust through `Design head`, and verification through `Scope head` and `Covered cards`. One seven-field machine block would overlap the two owners again, so the two design-metadata fields sit before the boundary and the five verification-metadata fields after it. The switch is removed because the adopted shape is not a 1,100–1,700-line relay-note second handoff layer: it is capped near 185 lines per capability, forbids chronology, and costs O(1) reads per card; even a small project gets the same lifecycle from a six-section design zone. Design freshness uses only the actual sources product.md, arch.md, and glossary.md. Including code-style.md or design.md would make every capability hypothetical with no failure path that changes its design zone — an over-harness. The exact v0.10 predecessor is separated from damage reset: design is re-derived from current Layer 0 and verified bodies plus compatible metadata migrate mechanically, but its old `Scope head` did not include consumed paths and therefore does not carry forward; verified statements remain hypotheses until the next capability closure

### DD-44 · Domain reachability is owned by the depth-1 number rule and resume's domain-entry branch, not by card fields (v0.11.0)

Subject: The knowledge layer and capability documents | Introduced: v0.11.0 | State: active, partly corrected by DD-76 (v0.18.1), DD-90 (v0.19.0), DD-91 (v0.19.0), DD-92 (v0.20.0)

If split copies a baseline and ADRs into every card, the path lives in two places and requires a research-card exception. work uses the claimed card's depth-1 number to read one document and only the exact ADRs named by that document. A baseline path left in a v0.10 card's `Read first` is treated only as legacy wiring and deferred to that number rule. resume normally reads only file names and a shape projection, but when the user asks to explain a capability it opens one document by number or name and answers with both freshness states. It opens the entire expected set only when the user explicitly requests that full set. Foundation is reached by the same `01` number rule. Relationships live on the consuming side as exact paths in `Consumed paths`; provider closure, retirement, and split project only bounded metadata plus the Consumed-contract path/number columns and report consumers with their actual current freshness. That column projection detects an unchanged path reassigned to another capability without opening other prose. With no observed failure, this does not automatically expand into execution, card creation, or cross-capability regression

### DD-45 · Capability-document recovery is judged in HEAD, and an interrupted design write finishes by regeneration rather than byte comparison (v0.11.1)

Subject: The knowledge layer and capability documents | Introduced: v0.11.1 | State: active

An independent literal execution opened four paths. Requiring the prefix test to "equal the current writer's final re-derivation from HEAD" is false on every session change, because a design zone is prose the model compressed rather than a mechanical transform — so an ordinary interruption became an integrity anomaly with no repair route. Deleting that condition changes no outcome: the next sentence already orders a whole regeneration from HEAD. Defining absence over both the working tree and HEAD let one torn write of a new file block creation forever, so absence is defined in HEAD alone and a creation replaces working-tree bytes that have no HEAD counterpart to preserve. For the same reason, writer eligibility and begin recovery judge the boundary count in HEAD, and the working-tree count is reported to the user only. A user-confirmed boundary reset leaves no disk trace, so a recovering session would have to guess; it is therefore not recovered as a prefix and the next run confirms it again. The v0.10 migration gate demanded that two heads the migration discards parse, so one field broken by a bad merge left total-loss reset as the only exit — the gate now covers only the three fields the migration actually carries. And an unqualified restore route let a post-rename restore of the old path create two same-numbered files that no ordinary routing row reports, so a restore lands only at the current expected path. One trade is recorded rather than hidden: a recovering session now finishes a regeneration the user never saw, where the deleted condition used to turn that case into a reported anomaly. The batch it regenerates was already confirmed in the dead session, and the alternative was an exit no session could reach. Because writer eligibility, begin recovery, and resume's routing all read the same HEAD values, the boundary count is measured in exactly one place; the working-tree count stays in the report a person reads

### DD-48 · Knowledge that used to die in HANDOFF now lands on two keyed lines (v0.12.0)

Subject: The knowledge layer and capability documents | Introduced: v0.12.0 | State: active, partly corrected by DD-86 (v0.19.0), DD-91 (v0.19.0)

A maintenance card has no dependencies, so the knowledge chain broke there, and HANDOFF's `Just learned` and `Traps` were overwritten at the next boundary — reliably lost. Inside one capability the carrier is the card's `carry:` line: only the residue with nowhere else to land, one to three lines per card, and a reader takes only the lines written since that capability last passed verification, so the set is bounded. About another capability it is journal's `capability note`, which that capability's next closure harvests and deletes in the same sweep, giving it a defined lifetime. Reading whole progress logs was rejected as unachievable — hundreds of lines per card, and before a first closure every card in the capability qualifies. The carry line rides the final task commit so the canonical claim→done move stays byte-identical, and neither reviewer nor verifier receives the set — their ignorance is the asset. HANDOFF keeps only the next single step and open decisions, and that pointer becomes mandatory

### DD-86 · A person-confirmed design statement whose semantic owner is another capability lives on one attributed open-item line that names that owner (v0.19.0)

Subject: The knowledge layer and capability documents | Introduced: v0.19.0 | State: active, partly corrected by DD-88 (v0.19.0)

Observed problem: no row of the discovery→update table received the scene where, during card
work, the user confirms an Intent or an Invariant whose semantic owner is a capability other
than the one being worked on. The `capability` of the `capability note` design form is by
definition the capability being worked on, and the short form is a code-confirmed observation
that capability's next closure harvests into its verified zone and deletes in the same sweep.
Putting a person-confirmed design statement on the short form turns its provenance into an
observation and it disappears with the harvest; putting it on the design form fixes the owner
wrongly to the current capability. The only remaining choice was silent loss. The canon-conflict
report DD-82 requires also stayed in the progress log alone during card work, and the progress
log is no consumer's input and does not survive the boundary.

Wanted behavior: a statement a person confirmed goes to the capability, domain, or root owner it
actually belongs to. A card number does not decide who owns a statement.

Chosen boundary: create no new reserved headword and no new document layer. The attributed
open-item line that already exists is the route — the state tool already emits it as
`open-item:`, and verify's two classifiers already exempt it from harvest and deletion with
"retain an attributed open-item line a person must decide." The line carries the intended
owner's capability number, the confirmed statement, and the card path where the confirmation
happened, and it stays until arch (Brownfield `no`) or adopt (`yes`), which owns that
capability's design zone, lands the statement and deletes the line in the same commit. DD-82's
conflict report writes the same line. The design form's capability anchor is left untouched.

Why it is needed: this loss is silent. A statement a person confirmed once is never recomputed,
so having no row to land on is itself permanent loss, and the next session does not even know
what went missing. The consumer this line needs already existed; what was missing was the one
row leading to it.

Rejected alternatives: allowing the design form's `capability` to name another number — that
form's revision basis is "the `NN.N wip:` checkpoint that first holds the line is that moment's
card and code snapshot," and another capability's code paths are not in that snapshot, so the
basis itself becomes false. A new reserved headword — it grows the parser, gate A, the canonical
format block, and the consumer set at once, while the consumer this line needs (a person's
decision) already exists. Writing it on the short form and letting closure move it into the
design zone — closure writes only the verified zone, so what was not verified becomes a verified
state. Leaving it in the progress log — that is the very loss this decision repairs.

Impact coordinates: the discovery→update table and the canon-conflict report paragraph of
`skills/principles/SKILL{,_ko}.md`, the two classifiers of `skills/verify/SKILL.md` (unchanged,
the ground of this boundary), `scripts/repository-invariants.test.js`.
Revisit when: these lines are observed piling up indefinitely without a person's decision, or a
scene appears where arch or adopt receives the line and still cannot land it in the design zone.

### DD-88 · A confirmed statement another capability owns is routed by one exact form, ahead of ready work, to that owner's design writer (v0.19.0)

Subject: The knowledge layer and capability documents | Introduced: v0.19.0 | State: active, partly corrected by DD-89 (v0.19.0), DD-97 (v0.21.0)

Observed problem: the path DD-86 opened never reached a consumer. The line is produced and the
state tool emits it as an `open-item:` fact, but in a repository whose architecture already
stands and that has a ready card, resume legally continues to work — an open item enters no
routing zone, so it changes no `next:`. And the design-only entry of arch and adopt, the only
consumer that can land the statement in a design zone, opens for `marker.design-note` alone.
The result is the very loss DD-86 set out to repair: a statement a person confirmed once is
visible as a fact and nobody takes it.

Wanted behavior: one line of that exact form reaches the design writer of the capability it
names, ahead of ready work. A card number still does not decide who owns a statement.

Chosen boundary: create no new reserved headword and no new document layer. Inside the named
open item there is one exact form (`<id> design open item: capability: <NN>; statement-json: …;
card-json: …`), and only a line in that form and present in HEAD is routed by the tool, as the
single kind `marker.design-open-item`. The marker zone stands ahead of claim and ready, so
neither a ready card nor a claim outruns it. resume passes that line's `capability`,
`statement`, and `card` through to arch (Brownfield `no`) or adopt (`yes`), and both
consumers' design-only entry now receives `marker.design-note` and this kind alike. The owner
is the capability the line names, not the card number — a card carrying the work of several
capabilities is not split, and `card-json` is only where the confirmation happened, so the
route stands even after that card closes. The landing ends by deleting the byte-identical line
in the same binding capability-document commit, and that one deletion joins the writer-boundary
exception of the canonical baseline predicates.

The reason refuted: DD-86 recorded that "the consumer this line needs already existed; what was
missing was the one row leading to it." That consumer was a person's decision — but to see the
line a person has to read the resume report, and resume legally goes to work when there is ready
work. The only consumer that can actually write a design zone is arch or adopt, and that door
opened with a different key. What was missing was not a row in the table but the routing. This is
one step earlier than the revisit condition DD-86 registered ("a scene where arch or adopt
receives the line and still cannot land it in the design zone") — they never received it. Every
other judgment of DD-86 stands: no new reserved headword, the design form's capability anchor,
no short form, and deletion in the same commit.

Rejected alternatives: routing every named open item — a free-prose line names no owner, so no
consumer can act on it, and it would outrun ready work indefinitely until a person decides. A new
reserved headword — DD-86's recorded rejection stands unchanged (it grows the parser, gate A, the
canonical format block, and the consumer set at once). Splitting the card by owner — a card is an
implementation boundary, not a knowledge owner, and this would change an approved work boundary
to land knowledge. Making a malformed line stop entry — it reverses the line-level ownership
0.18.8 settled, and a person's prose would block the repository again.

Impact coordinates: the journal-format section and the discovery→update table of
`skills/principles/SKILL{,_ko}.md`, the zone table, journal parser, and design-route
computation of `skills/principles/scripts/project-state.mjs`, the routing table of
`skills/resume/SKILL{,_ko}.md`, the design-only entry of `skills/arch/SKILL{,_ko}.md` and
`skills/adopt/SKILL{,_ko}.md`, the writer and replacement boundary of
`skills/principles/baseline-predicates{,_ko}.md`, `scripts/project-state.test.js`, and
`scripts/repository-invariants.test.js`.
Revisit when: one statement a person has not yet decided is observed holding ready work back for
long, or the cost is measured of one session repeating the design-only entry per owner because a
single card produced several confirmed statements with different owners.

### DD-89 · A design open item routes only when its attribution names an existing room (v0.19.0)

Subject: The knowledge layer and capability documents | Introduced: v0.19.0 | State: active

Observed problem: DD-88's exact-form recognizer accepted any non-space token in the `<id>`
position. The journal canon gives an attributed line machine ownership only when that token is
exactly one existing room id; every other line is a person's and must stay outside judgment.
An exact-looking line attributed to `ghost` therefore became `marker.design-open-item`, outran
ready work, entered arch or adopt as person-confirmed knowledge, and was deleted in the landing
commit even though no room owned it.

Wanted behavior: the route recognizes the exact syntax and the existing-room attribution
together. A line that fails either boundary remains an ordinary journal line, changes no
`next:`, and is never consumed by the design writer.

Chosen boundary: the parser preserves the id token with the structured candidate, and the one
design-route computation admits it only when that id exactly equals one id in the existing room
set. It does not derive the semantic capability owner from the card, validate the card's current
status, or split a composite card; all of DD-88's named-capability behavior remains unchanged.

Why it is needed: without the room check, a person's line is silently deleted by a machine route.
That is the line-ownership loss DD-88 explicitly rejected when it kept malformed lines outside
entry judgment.

Rejected alternatives: making the near-match blocking — it would let prose stop the repository
and reverses the 0.18.8 line boundary. Treating every non-space id as attribution — that is the
failed state. Using the card number as a fallback owner — DD-88 rejected it because a card may
carry several capabilities and knowledge ownership is semantic.

Impact coordinates: the exact design-open-item paragraph in
`skills/principles/SKILL{,_ko}.md`, the parser and design-route computation in
`skills/principles/scripts/project-state.mjs`, the C fixture in
`scripts/project-state.test.js`, and matrix cell 3.21.
Revisit when: an existing-room line is observed failing to route, or room identity itself moves
out of `.devflow/users/*/owner.md`.

### DD-56 · Reading is bounded to open work: a depth-1 folder carrying `.done` is read by name (v0.13.0)

Subject: The knowledge layer and capability documents | Introduced: v0.13.0 | State: active

Twenty capabilities of thirty cards means six hundred filenames read every session, most of them `.done.` cards inside folders already closed, whose knowledge is folded into the capability document. Projecting names and statuses instead makes session cost proportional to open work rather than project history, which is the durability the owner asked for. Preserving only integrity items 3 and 11 is not enough: duplicate numbers, an active card's `Depends` resolving to exactly one `.done.` card, locator resolution, the `Covered cards` comparison, and next-number derivation all read closed history, and all of them are satisfied by names and statuses. Only item 4's field parse is narrowed, and a re-closure strips the folder's `.done` first, which returns those cards to it

### DD-59 · Open decisions live in journal, so HANDOFF holds only what the tree recomputes (v0.13.0)

Subject: The knowledge layer and capability documents | Introduced: v0.13.0 | State: active

v0.7.0 rejected moving open decisions into journal as "one concept, two homes"; that reason is refuted by removing the section from HANDOFF entirely, which leaves exactly one home. The failure it now closes is concrete: HANDOFF is overwritten whole, one person's two sessions share one room, and both overwriting means one side's decisions are gone with no trace. journal is append-only and already accepted attributed open decisions on the departure path. What remains in HANDOFF is `Next single step`, which canonical candidate order recomputes, so a lost overwrite costs an ordering preference and no data

### DD-64 · The third branch of a shared-contract observation is an attributed open item (v0.14.0)

Subject: The knowledge layer and capability documents | Introduced: v0.14.0 | State: active

v0.13.0's K3 row ("otherwise one line in journal.md") created a line with no class and no consumer — it fits none of the canon's three allowed classes (canonical formats, cross-task decisions, attributed open items), and the foundation has no closure rite to harvest it. That is the root of the seam defect where verify's classifier rejects the line as an integrity anomaly, and a hand clearing the blockage by deleting the line converts a stop into a loss. An observation that is neither an ADR nor a Risks entry is written as an attributed open item — where it should land (or whether to discard it) is a person's decision — and the existing open-item semantics (resolve through another table row, then delete) supply the consumer, so no new class and no indefinite residence appear. verify's classifier carries exactly the canon's allowed classes: widening the write side realigns the read side in the same words

### DD-67 · Planning evidence discipline settles facts from four authorities before questions and isolates answer-only research, while the main session owns structural understanding and binding decisions (v0.15.0)

Subject: The knowledge layer and capability documents | Introduced: v0.15.0 | State: active

product, arch, adopt, and split treated current repository facts, external contract facts,
execution facts, and owner decisions as the same unknown. That created paths where the user
was asked for a fact the environment could answer or current documentation was used to prove
a pinned older version. Separate the four authorities and first confirm facts within the
permitted scope before asking questions. Explicit research follows the requested scope;
automatic research is bounded to cases where a possible result would change a current
candidate, recommended default, Layer 0 field, or verifiability. Leave the conclusion,
impact, and exact source in an existing owning statement, but create no raw research
document.

When answer-only internal or external evidence search requires following a new path or
source, comparison, or repetition, isolate questions in the same search scope under one
read-only researcher. The researcher does not execute, prototype, write files, re-delegate,
or decide; it returns only a stop condition and evidence coordinates. The main session owns
raw-source understanding such as representative flows, code structure, document structure,
and domain context. After receiving a research result, it confirms only key coordinates,
then owns impact judgment and the binding decision. product, arch, and adopt read the
canonical companion on entry; split reads only the sections needed when judging the maintenance
planning depth grade. work, verify, resume, and role contexts are not consumers and incur no fixed
cost.

### DD-73 · Capability documents are arch's final output and must exist before the first tree opening, while decision and external-contract grounds are preserved at confirmation (v0.17.0)

Subject: The knowledge layer and capability documents | Introduced: v0.17.0 | State: active

The diagnosis separates three intervals. Commits and resume preserve the boundary between one confirmed Layer 0 document and the next. During confirmation of one document there is no cheap intermediate landing because the contract forbids changing a core-document path before approval. The defect is the third interval: a run could end after arch.md and code-style.md landed while producing none of arch's final output, the capability documents. DD-43 requires domain boundaries and concepts before the first card, but arch had no context boundary before its biggest single output and split did not stop a zero-document tree opening.

Five boundaries close it. product's `Approach` now also owns which goal wins when two collide — two canonical consumers require that value (`arch:72`'s candidate tie-break and `planning-evidence:67`'s pre-commitment review) while no producer wrote it, and synky's `product.md:18` consequently cited a speed-and-cost principle defined nowhere as its ground for discarding an approach. Inside the capability-document section, arch first states the expected document count; when the harness warns about context, it stops at the confirmed Layer 0 commit and says that this run is not arch's completion. With no card claimed, the next session enters through resume and runs only that section. At the first tree opening, split checks for `01` and for each non-retired capability number in product.md whether a lowercase `.md` whose leading token before the first `-` is exactly that number exists directly below `.devflow/project/capabilities/`, stops when any is missing, and directs the user back through `resume`. Each piece of the predicate closes a measured bypass: matching the token rather than a prefix because with `10` and `100` both expected a lone `100-*.md` masked the missing `10`; looking only at number-led files because one `.gitkeep` passed the gate; checking per-number existence rather than a count because partial creation passed and then work's `baseline missing` and verify's `baseline no-op` allow a closure with no knowledge document, and because under a count the preserved retired documents and any excess or duplicate file masked a missing number; `directly below` because a recursive reading was satisfied by a number-led file in a subfolder; and lowercase because a case-insensitive environment matched `.MD`. The expected numbers come from the product.md capability list split already reads, whose rows carry retirement marking, so its read set does not grow. The route goes through resume rather than a direct skill call because arch's capability-document-only branch opens only on resume routing, and that recovery holds when no card of the user's is claimed. A deferred run skips this gate together with the rest. Immediately before confirmation of arch.md, arch enumerates every decision that passes the three ADR conditions and confirms whether each is recorded. When a Components or Stack reason rests on an external-contract fact, its exact source stays on the same line. That ADR-screening sentence sits inside the range adopt reads as its output-format reference, so a brownfield receives the same screening — that coordinate is the only ground for brownfield coverage, so moving it refutes this reason first. The value of this boundary is that after landing there is no canonical route back to an unrecorded ADR.

This catches absence at the first tree entrance even when an active claim would preempt resume's capability-document row, while a brownfield keeps the same lifecycle under adopt. In the synky measurement, eight of ten ADR-qualified decisions were unrecorded and all eleven Stack lines carried zero external-contract sources. The plan first set this gate at zero files and left partial creation to resume and the baseline predicates. Simulation refuted that reason: under a self-claim `resume:219` preempts the missing-expected row, and work and verify both continue, so a capability could close with no knowledge document. Per-number existence closes it; a count comparison did not, because preserved retired documents and any excess or duplicate file masked a missing number. Reopen this boundary if an unrecorded ADR is still discovered after this review step, or if requiring one document per non-retired product.md number proves wrong for a project whose capability list and document set legitimately differ.

### DD-74 · The planning record layer — the record gate lands confirmed choices and reproducible observations immediately, the record tool judges the current set and bounded opening, and human deletion is a sanctioned exception (v0.18.0)

Subject: The knowledge layer and capability documents | Introduced: v0.18.0 | State: replaced by DD-77 (v0.18.2)

Observed problem: after 6+ hours of real planning (synky), the only canon left was a
115-line product.md and a 21-line glossary. A same-model session reading only that canon
matched 0 of 6 stack decisions and planned 3–4 days re-verifying an item already proven by
an on-disk spike, and a 1,048-line conversation narrative changed the decisions without
reducing the re-verification — decisions transfer through records, and only reproducible
evidence reduces re-verification. Three earlier mechanisms (planning JSON, a reserved
journal line, incremental Layer 0 landing) all died on the same axis: who deletes what,
when. A context-free third walk additionally self-reported that a literal session would
improvise affects tokens, eye-filter projections, and invent Reproduce commands.

Chosen boundary: decision records and evidence records under `devflow/project/decisions/`
and `devflow/project/evidence/` with one fixed header line (v · kind · during, six
values · affects literals · scope · mode · evidence · checked-at · review-after ·
supersedes) and a 15-line body cap;
the record gate's three literal questions plus a three-line echo and a `record — <filename>`
binding commit; the record tool's five read-only subcommands as the only means of picking, reverse
search, and deletion judgment, with sessions writing the files and passing `validate`; the
current set as all valid files minus supersedes targets; opening capped at 3 with a
pre-bind confirmation listing unopened current candidates; `mode: reported` as the honest
grade for unapproved observations, separated from `mode: reproducible`; the current
decision records a capability document's design statements actually cite entering its
Binding ADRs list (arch and adopt are the only updaters); and human deletion as a
sanctioned exception whose leftover citations are repaired through the discovery→update
table instead of stopping as anomalies.

Why the boundary is needed: immutable-plus-successor has no consumption, deletion, or
merge lifecycle — the axis that killed all three predecessors. The tool exists because the
third walk measured that prompt text alone would not be followed at the two load-bearing
steps (current-set filtering and literal tokens), and honesty in the `mode: reported` grade is
cheaper than fabrication that a missing reproduction path or the next session exposes. The tool is stateless and
read-only — sessions write records, humans delete, and the tool only judges.

Rejected alternatives and lineage refutations: DR-14 — this is not an unread registration
field: the consumers are enumerated (six producers, design and work included; `select`
projections in arch, adopt, resume, and verify's retrospective; card `Read first`; the
Binding list), it is devflow-owned rather than an
outside-cache prescription, and the homes of current value, reason, and observation stay
split. DR-25 — no judgment word: exact affects literals, a tool-computed current set, a
cap of 3, and pre-bind confirmation. DR-29 — not a session or date bundle: records are
permanent decision units with no closing duty, and only tool-judged unreferenced leaves
are ever deleted. DR-38 — its recorded reason was that a helper's necessity was never
argued; the third walk argued it by measurement, the SessionStart hook already runs
`scripts/` code through the same plugin-relative path, and the tool is stateless
read-only — it never writes or deletes anything. The `principles` sentence "never create a new planning document" widens its own
list rather than being overturned.

Affected coordinates: the principles pair (planning-records section, discovery→update
rows, ownership), the planning-evidence pair (record gate and projection), the product,
arch, design, split, work, resume, adopt, and verify pairs, baseline-predicates row 5,
`scripts/project-records.mjs`, and `scripts/repository-invariants.test.js`.
Revisit when: a real 6-hour A/B observes capture-gate omission; bind stops exceed 10% of
ordinary splits; a current-set projection reports over 200 lines; or the share of
reported-mode evidence hollows out the re-verification savings.

### DD-75 · Record succession — one successor changes the present, stale evidence cascades by reverse search, and conflicting or concurrent records are preserved then merged (v0.18.0)

Subject: The knowledge layer and capability documents | Introduced: v0.18.0 | State: replaced by DD-77 (v0.18.2)

Immutability is a property of history, not of the present: every reversal costs one
successor record naming its predecessors in supersedes. A user changing a confirmed
statement with no disproving measurement is a first-class discovery→update row — the
conversation is the confirmation and `owner decision` is a sufficient ground — which
settles the standing backlog observation that such a change used to cost a full product
re-run. When evidence goes stale (a successor exists or its `Invalidates-when` is true),
`reverse-evidence` enumerates the current decision records citing it; each is reconfirmed
or returned to its owning stage, and nothing is invalidated automatically (the integrity
principle that devflow reports and never auto-corrects). Content-addressed filenames make
same-path collisions impossible for differing content; two incompatible current records
raise one user question and are both superseded by a single user-confirmed successor. During a blockade, adding a
unique record file continues as a local commit on the session's own branch without shared
authority — this partly corrects DD-62, whose "new evidence records need a push" clause
named journal `evidence-wait` records; the two concepts now carry distinct names, and
successor, deletion, and Layer 0 changes still wait.

Affected coordinates: the same set as DD-74. Revisit when a merge or concurrency scene
produces a loss or double-plan that these rules do not classify.

### DD-76 · Domain knowledge capsules — knowledge overflowing a capability document lives in on-demand capsules under the same number, and provenance marks separate source, synthesis, conjecture, and dispute (v0.18.1)

Subject: The knowledge layer and capability documents | Introduced: v0.18.1 | State: active, partly corrected by DD-77 (v0.18.2), DD-92 (v0.20.0), DD-97 (v0.21.0), DD-103 (v0.23.10), DD-108 (v0.23.16)

Observed problem: one capability's domain source in a real brownfield (jgnote property) ran
to 3,699 lines — pressed as summary into a 185-line capability document, knowledge is lost;
left out, it does not exist for the next session. Two processed artifacts and a three-arm
comprehension measurement (processed A and B against source control C, the same 13 questions)
gave two facts. Directional understanding does travel through processing: all three arms
correctly rejected the directional questions. But **the processing produced confidence, not
accuracy** — a contradiction in the source (reverse geocoding: §4.1 "does not overwrite"
against the later addendum "replaces") was pushed to one side and written as settled fact,
sentences the processor synthesized were indistinguishable from source sentences, and C's
honest not-knowing was more accurate than the processed text's smooth confidence.

Chosen boundary: keep the capability document as the always-read map (total cap stays about
185 lines; per-section row counts, which never had a measured basis, become soft; add the
Intent overview section as the unconditional reach point for capability-wide intent), and
move overflow down into capsules at `NN-<name>/K-NNN-<topic>.md` under the same capability
number — only the first-line knowledge header (topic, use-when, state, synopsis) is machine
projected, and bodies open only on demand. The authoring cap is soft at 120 lines per capsule
with over-cap reporting; the opening cap is hard at 240 lines / 24 KiB per card with explicit
approval as its only exit (provisional — measured openings were 112–180 lines). Provenance
marking defaults to unmarked (an unmarked body sentence is source and confidence; an unmarked
Intent sentence is synthesis), and only four closed heads mark the exceptions:
`synthesis`, `code`, `conjecture`, `dispute C-n`. Mandatory per-block attachment was rejected:
a required field whose value is the same nine times out of ten is the fill-in form the owner
forbade, and in cross review the artifact carrying mandatory tags shipped a wrong source date
straight through its own checker — proving form validation is not provenance validation.
Source contradictions are not resolved; both dispute arms stay with their coordinates and
rise as an item for a person to decide. Unmarked synthesis escaping machine detection is
caught in the verification layer rather than by a writing-layer stamp — adopt's capsule
procedure now includes, in its clean-session refutation, a provenance sampling check of three
unmarked sentences per capsule. Source disposition (deletion, moving) is not part of the
procedure — it belongs to a person alone.

Rejection lineage refuted: DR-30 (rejecting a new per-capability work-note layer) reasoned
that "relay notes already exist in four layers" — a capsule is not a fifth free-form note
layer but the capability document's overflow moved under the same number, with the same
writer and confirmation bundle as the capability design commit, and it is a bounded
contract of fixed header, closed marks, and an opening budget rather than free recording.
DD-97 narrows only the writer's lifecycle for initial Adopt: Adopt writes K during the initial
unmanaged projection and co-commits each capsule with its capability document in
`adopt — capabilities`; managed Arch does the same in `arch — capabilities`. The preceding
Layer 0 commit preserves every source coordinate, authority, disposition, and landing owner in
Architecture `Existing records`, so interruption recovery rederives from source rather than
using partial bytes. Number, writer, confirmation, address, provenance, validation, and opening
rules remain unchanged.
What justifies the addition is not taste but a 3,699-line measurement. DR-19 (rejecting a
split into two files: "two paths, double the reading") reasoned about an always-read path —
capsules are not always read and their opening cap is hard, so fixed reading does not grow.
DR-25 and DR-17 (rejecting unbounded reading and free linking) stand: capsule reach is only
an exact path (`Read first`) plus a use-when match, and the opening total is a hard cap.
DD-28's "no new document layer" widened its own list the way DD-74 did; DD-42 and DD-43's
sole capability-document ownership and DD-44's number reachability are each partly corrected
by capsule folders and header-projection reach.

Affected coordinates: the canonical baseline predicates (capsule, provenance-mark, and
opening-budget sections), the canonical rules (ownership and the capability-design commit),
the arch, adopt, split, work, resume, and verify pairs, and
`scripts/repository-invariants.test.js`.
Revisit when: comprehension-question failure rate (a processed-text-only session answering a
source contradiction or a synthesis wrongly), the rate of opening-budget overruns, the rate
of disputes that are never collected, and repeated over-cap reports in capabilities with no
capsules, which would reopen the budget numbers.

### DD-77 · A document speaks only of the present — an updated concept overwrites that concept's place, and the dropped direction lives beside that conclusion as a present fact (v0.18.2)

Subject: The knowledge layer and capability documents | Introduced: v0.18.2 | State: active

Observed problem: one canonical file contradicted itself across 55 lines — `SKILL.md:390` said
"add a successor record instead of editing or deleting" while `:445-447` said "modification
means replacement by default: if you added a line, check whether you deleted the stale one. A
document that only grows is a dead document." The first applied only to the record layer and
the second only to documents, and a literally executing session kept that distinction exactly —
documents did not grow and the record folder grew forever. The cost was measured: a scoring
session that opened one discarded decision file wrote "the sentences were firm and it carried
both its grounds and its dropped alternative. I thought I had solved everything … had I opened
selectively I would have confidently reported a discarded decision as current. It was 577 lines
so reading all of it was possible; at 5,770 lines I would have been wrong." The fact that it was
void appeared nowhere in that file — it lived only inside another file's `supersedes` array.

Desired behavior: when the same concept is updated, that concept's place is overwritten — the
concept, not the file. The dropped direction and its reason are not the past but present fact
and live beside that conclusion: what was dropped, why, and when it reopens. Only the reading
condition differs — it is opened only when that conclusion is being overturned. Git carries the
past versions and they are not read routinely; the overwriting commit's subject indexes the
concept by name.

Chosen boundary: four conditions that keep overwriting from being unbounded. (1) Only what can
be recomputed may be overwritten — execution results, observations, and human confirmations land
first, before the overwrite, in the place that document keeps them (which place is fixed by the
discovery→update table). (2) Update or discard is decided by the reader's action — would a
person reading the old sentence now take a wrong action. If yes it stays as a dropped direction;
if no it is simply overwritten. (3) At adoption time (brownfield) nothing is overwritten — only
what code confirmed is newly written, and the remaining old documents are neither deleted nor
promoted but kept as source. (4) "One fact, one durable home" becomes this law's precondition —
when a copy sits on another branch the overwrite finds no place and the contradiction stays.

Why the boundary is needed: DD-74's core argument was that immutable-plus-successor has no
consumption, deletion, or merge lifecycle — the axis that killed all three predecessors. The law
does not evade that axis, it answers it: the session that updates the concept overwrites it, at
that moment, at that concept's single home. No separate consumption, deletion, or merge lifecycle
is needed because there is no separate file, and this is not a new mechanism — the discovery→update
table's 21 rows already do exactly this for every other kind of knowledge ("replace it, don't add
beside it" · "replace just that statement" · "replace or delete that exact path"). The bill for the
evasion is the measurement above: what is not deleted goes on pretending to be alive. DD-74's own
revisit condition, "the share of reported-mode evidence hollows out the re-verification savings",
was met at its maximum: moving the same material into the record layer produced 6 of 6 evidence
records at `mode: reported` with 0 of 6 code coordinates, because the experiment results live
outside the repository and the validator rejects `mode: reproducible` without a real path. And
form was not the value — the same material built in four forms scored 9/13 on the same 13
questions in all four, and what drove "this experiment has to be re-run" to 0 in all four was not
the record grade but one thing: writing, beside the number, the conditions under which it is true
and the command that measures it again. Needing no prompt to enforce beats enforcing well:
current-set filtering has nothing left to filter once nothing is superseded, and the `affects`
literal tokens broke on Korean parentheses, which 28 of 32 decisions used.

Rejected alternative: keeping the record layer but replacing succession with in-place overwriting.
The wiring sweep produced not one item that only that variant could carry and this law could not,
so there was no reason to keep two mechanisms for one job. Existing ADR files are unaffected by
this rejection and stay — only the new succession practice goes unused.

Affected coordinates: the canonical rules pair (the law paragraph before the discovery→update
table, the deleted planning-records section, ownership), the planning-evidence pair, the baseline
predicates pair (the capsule's two header lines, the four body words, the deleted `retired`
tombstone), the product, arch, design, split, work, resume, adopt, and verify pairs,
`scripts/project-knowledge.mjs`, the deleted `scripts/project-records.mjs`, and
`scripts/repository-invariants.test.js`.
Revisit when: keeping reasons inside the owning document is observed pushing that owning document
out of its budget in a real project. Or when a contradiction is actually observed because the
place of "the same concept" could not be found and a copy stayed.

### DD-78 · One canon range goes unread only when a tool proves that range has no subject — the machine cuts, it reads HEAD and the working tree both, and every other answer collapses to the full read (v0.18.5, scope extended v0.19.0)

Subject: The knowledge layer and capability documents | Introduced: v0.18.5 | State: active

Observed problem: resume's entry pays 147,921 B of canon before it reads one byte of the
project. Two design arms decomposed that 147,921 B section by section without knowing about
each other and reached the same conclusion — in the whole canon there is exactly one range a
disk condition can safely cut, the capsule contract. The reason is placement, not size: the
canon is grouped on a **subject axis** and disk state hangs on a **state axis**. The two axes
are skewed, so the rules most conditions point at are not a contiguous range (`evidence-wait`
is scattered over 12 places inside the canon and its recovery rules are one 40-row table). A
condition can only cut a contiguous range.

Desired behavior: a project with no capsule does not read the capsule contract. In every state
where a capsule may exist, the read stays exactly what it is today. **And the session writing
the first capsule is not blocked** — having no capsule yet is precisely the state in which the
first one has to be written.

Chosen boundary: five parts. ① **The machine does the cutting.** The model does not look at
disk and decide — `project-knowledge.mjs presence` answers in one line and the skill reads only
that word. ② **Fail-closed.** `absent` alone closes the range; `present`, `unknown`, and a
nonzero exit all collapse to the full read. ③ **HEAD and the working tree both** are read — a
capsule committed on the integration branch is real while this checkout has not written it yet,
and a capsule deleted here is still in HEAD. ④ **Not one byte of canon moves.** The range is
not split and no new document appears. ⑤ **The first writer's condition is different**
(v0.19.0). resume's and verify's presence gate is unchanged. arch and adopt read the remaining
ranges first and open this one **when they actually process a named source document, or just
before a capability document they derived overflows its budget**. When the judgment is unclear
they read — fail-closed. The capsule contract stays the same 241-line, 16,076 B contiguous
range inside `baseline-predicates{,_ko}.md`; not one byte moves here either.

Why the boundary is needed: the only realistic failure of this gate is "needed it, never read
it", and it has two paths. One is a predicate that is confidently wrong — v0.18.4 showed that
as a real artifact. `project` walks silently past a folder whose name misses the pattern and
reports `capsules=0` (reproduce: put a capsule in such a folder and `project` still answers
`capsules=0`). So `presence` does not **count** capsules; it reads only the **existence** of a
direct child directory under capabilities — whatever its name, and `present` even when the
folder is empty. The other path is a later generation writing a rule a capsule-less project
still executes into this range, and an enumerated seal test holds that place. Both paths have
tests.

Rejected alternative: **the hook judges and injects it.** The predicate would have to live in
the hook (JS) and in the skill sentence (the skill must run without the hook), and when the two
judgments diverge they diverge with no error. DD-05 and DD-29 stand, and so does DR-03 (journal
injection by the hook — it duplicates what resume reads). **Use the existing `project` output's
`capsules=`** — the measurement above answers that this count cannot be the predicate.
**Issue a certificate (authority id and fingerprint) and re-check it before the report** — it
narrows the race between judgment and report, but a session that created a capsule in that
window did not have its capsule missed; the capsule did not exist yet. It spends a new
mechanism where the residual risk is not what it looks like. **Using plain absence (`absent`) as the first writer's condition too** — that is a bootstrap
deadlock. Having no capsule is exactly the state in which the first capsule must be written, so
an absence condition means the first one is never written. arch's and adopt's condition is
therefore not absence on disk but a **writing event**. **This is not a re-proposal of
DR-44** (splitting canon per consumer) — nothing moves, so its rejection reason needs no
refutation and got none. The v0.19.0 scope extension is the same: DR-44's recorded failure mode
is "a rule work needs, filed under a verify-only heading, disappears with no error", and here
**zero range movement, four named consumers (resume, verify, arch, adopt), and a machine
structural seal** each block one path to it.

Honest accounting: this gate's ceiling is **16,076 B (10.87%)**. 95.0% of the entry is the rule
body of three functions a competitor does not perform at all — interruption recovery,
concurrency safety, and the knowledge lifecycle — and this angle does not shrink it.

Affected coordinates: the entry paragraph of `skills/resume/SKILL{,_ko}.md`, the entry paragraph
of `skills/verify/SKILL{,_ko}.md`, the capsule-opening condition in
`skills/arch/SKILL{,_ko}.md` and `skills/adopt/SKILL{,_ko}.md`, the capsule range boundary in
`skills/principles/baseline-predicates{,_ko}.md`, `presence` in `scripts/project-knowledge.mjs`,
`scripts/project-knowledge.test.js`, and `scripts/repository-invariants.test.js`.
Revisit when: a scene is actually observed where a capsule-less project needs a rule from the
capsule contract. Or when a first writer is observed being blocked out of the capsule range by
this condition. Or when measurement finds a second range that cuts the same way.

### DD-91 · glossary is the project-language canon, capability-header concepts are definition-free many-to-many discovery consumers, and confirmed terms promote through the existing journal to the design writer (v0.19.0)

Subject: The knowledge layer and capability documents | Introduced: v0.19.0 | State: active, partly corrected by DD-107 (v0.23.15)

Observed problem: real-use projects had glossary definitions but no header index from those
terms to capability documents. A new session had to open every body to locate an ordinary
term, could mistake one composite card number for a shared term's semantic owner, and had no
interruption-safe path for an important term confirmed during implementation to reach the
glossary writer before synonyms forked.

Chosen boundary: glossary.md is the one durable project-language canon and owns each
`term: definition`. A capability's fixed header adds one `Concepts:` line containing either
a JSON array of exact glossary terms or `none`. It copies no definitions; one term may occur
in several capability headers, and a project-wide term may occur in none. resume's exact-term
query returns every matching capability path, or the glossary definition with project-root
context when no capability maps it. Number, full-name, foundation, and card recognition stay.
An optional card `Concepts:` line is only a definition-free discovery aid; its number implies
no semantic ownership.

When capability, card, or work evidence confirms that a term is important, a person confirms
the exact term, definition, affected-capability set, and evidence locator before one attributed
`glossary term` journal line is committed. Malformed, uncommitted, and unknown-author lines
remain ordinary items. `marker.glossary-term` preempts normal work and sends the payload to the
existing product-owned glossary writer: arch, or adopt for a brownfield. The writer lands the
glossary definition while retaining the marker, then in the same design batch updates every
known affected `Concepts:` line and Design head and deletes the marker. The marker blocks other
work between commits, making the sequence one interruption-safe logical transition; an
observation cannot silently rewrite canon. Product and arch discoveries may land directly at
their normal stage boundary.

Rejected alternatives: copying definitions into capability documents or cards creates two
homes for one fact. One term per capability, or one capability per term, lies about composite
work. A new glossary skill or free note layer duplicates product ownership and the journal's
transport role. Automatic candidate promotion turns observation into decision.

Affected coordinates: canonical recognition, journal form, discovery→update and ownership in
the principles; the capability fixed header in baseline predicates; product, arch, adopt,
resume, split, and work pairs; project-state and focused invariant tests.
Revisit when: a real-use exact-term lookup misses a relevant capability, over-tagging misleads
entry, or the marker fails to guard glossary/header consistency across an interrupted writer.

### DD-103 · A K boundary is one knowledge unit read together and revised for one reason; Adopt lands that knowledge unit at its exact canonical locus (v0.23.10)

Subject: The knowledge layer and capability documents | Introduced: v0.23.10 | State: active, partly corrected by DD-104 (v0.23.11)

Observed problem: v0.23.9's first-project judgment, document-creation flow, and pre-approval
clean-context refutation worked in real use, but the proposed tree and generated documents scattered
verification and constraint knowledge that must be maintained together, diluting its central purpose.
The current canon required source dispositions and a broad owner, yet also described K as one topic or
owner-document overflow, leaving length, headings, or keyword similarity to be mistaken for a semantic
boundary. Adopt had no exact landing path connecting each detailed knowledge unit in its inventory to
the planned K list, and the Foundation content boundary was outside the refuter's read set. During
managed refresh, an instruction to take the next K number even for an existing concept also conflicted
with DD-77's replace-in-place rule.

Chosen boundary: one K keeps one current knowledge unit whose readers need it together and would revise
it for the same reason. A child is created only where both an independent reader and change boundary
exist, never merely for length, headings, or keywords. Concise direction that is always needed stays in
the nearest Product, Architecture, Design, or Capability owner document, selected by the governing
question the knowledge unit answers and the readers who need that answer; depth with its own reading and change
reason lives in that owner's same-stem recursive K. The 120-line value remains a soft reporting line,
not grounds to tear a cohesive norm apart.

Adopt inventories knowledge units and supporting evidence groups, attaching every unit to
the exact current owner document or planned K path. One source may support several knowledge units, but one knowledge unit
is neither scattered nor duplicated across current canonical targets. The proposal and clean-context
refutation both read this unit-to-target mapping and the Foundation shared-contract-and-boundary scope,
treating an omitted required landing or a scattered or duplicated current target as a blocking defect
alongside wrong ownership. Arch uses the owner-bounded projection to find any existing K, replaces an
existing unit at that path, takes the next unused number only for a new unit, and adds current evidence
while preserving still-valid `Source basis`.
Removing a basis requires a current replacement reason or reconfirmation against source. Approval,
commit, and verification boundaries and v0.23.9's same-stem owner shape do not change.

Rejected-lineage rebuttal: DD-76's capsules own current normative depth as well as evidence, so no
intermediate document layer is needed. DR-14's central registration field, DR-17's free links, and
DR-30's new working-note layer still create a second home or unbounded discovery; their rejection
grounds stand. A claim graph, custody registry, fingerprint, or new classifier, validator, or index is
rejected for the same reason. Updating an existing K in place strengthens rather than overturns
DD-77's current-locus replacement rule.

Affected coordinates: Principles K cohesion, ownership, and Foundation boundary; Adopt inventory,
proposal, refutation inputs, and Architecture output; Arch knowledge landing and Architecture output;
DD-76, DD-92, DD-97, and DD-102; matrix §3.18 and §3.24; P2 projections and release records. Product,
Design, Direct, Work, Verify, and Resume stage roles, the state tool, and any new stage, marker, registry,
validator, or index remain unchanged.

Revisit when an artifact that passed unit-to-target mapping and refutation again scatters one current
knowledge unit across owners, when an existing-K refresh creates a second path for the same unit, or
when independently consumed and changed units remain coupled in one K and repeatedly cause needless
opening or simultaneous revision.

### DD-107 · product.md owns the confirmed Working language as one fact and Principles keeps every writer's prose coherent (v0.23.15)

Subject: The knowledge layer and capability documents | Introduced: v0.23.15 | State: active

Observed problem: a real Adopt output mixed Korean and English prose, but exposed no proposal or
confirmation surface for the language that later people and AIs should use for maintenance. Current
English runtime guidance and examples can create pressure to treat English as the content language,
while DD-91's “project-language canon” means the glossary's exact terms and does not own a prose-language
choice. If every stage infers again from documents or the glossary, it loses the confirmed answer in
multilingual, tied, or sparse material, projects with canonical foreign-language terms, and projects
whose owner chooses a language different from the corpus.

Chosen boundary: the exact `Working language: <owner-confirmed description>` line immediately after
identity in `.devflow/project/product.md` is the sole durable value owner for the project's Working
language. The value is not a closed language enum; it may describe one language or an owner-selected
multilingual convention. Adopt inspects meaningful maintained human prose in documentation, code
comments, specifications, and operational records and proposes its dominant language. An explicit owner
preference wins; code/API identifiers, paths, generated material, and vendor text are machine tokens, not
votes, while tied, materially multilingual, sparse, or absent evidence remains visible uncertainty rather
than a false majority. Product naturally proposes the same value from the owner conversation for a new
project with no corpus to adopt. Both stages show the proposal before canonical writes, and a correction
is not approval. Product's existing write-free ask reentry shows its revised proposal again; Adopt first
runs a fresh independent semantic refutation of the complete revision, then returns to its existing
write-free prepare reentry.

Principles' prompt policy, already read by every stage, makes later authored and revised semantic prose
follow the confirmed value. Fixed schema headings and keys, paths and slugs, commands, API and code
identifiers, provenance literals, and exact source or canonical domain terms remain as their contracts
require, and quoted source text keeps its source language. Glossary keys and `Concepts:` therefore keep
exact terms while definitions and synthesized prose follow the Working language. An existing managed
project without the line remains valid and is not rewritten merely to add it; each target artifact's
already coherent prose language is preserved until Product next reconfirms the choice.

Why and rejected alternatives: Product already owns project identity and current planning read by every
later stage, while Principles already owns the one common policy read by every P2 entry. One value and one
behavior therefore each have one home. This differs from DR-14's unconsumed observation-cache field: the
new line has named consumers and neither the state tool nor routing parses it. Glossary metadata, per-stage
reinference, per-document language fields, scanners, registries, crawlers, a closed language list,
identifier translation, and a global semantic validator would add duplicate ownership, heuristic errors,
or unbounded cost and are rejected.

Affected coordinates: Principles prompt policy and capsule-provenance sentence; Product and Adopt spec,
body, proposal and product templates, and focused contract tests; every P2 package's existing shared-policy/product read
edge; DD-91 and DD-97; matrix §3.18 and §3.24; paired design, fixed terminology, plugin manifests,
CHANGELOG, and the v0.23.15 report. The state tool, new markers, a language scanner, and other stages'
sources do not change.

Revisit when a downstream writer that read the confirmed line again mixes prose languages or translates
fixed tokens, when a valid legacy project is blocked only because the line is absent, or when Adopt's
proposal repeatedly chooses the wrong dominant language after meaningful-prose evidence and owner
correction.

### DD-108 · Adopt transfers knowledge ownership; absorbed inputs are not permanent project dependencies (v0.23.16)

Subject: The knowledge layer and capability documents | Introduced: v0.23.16 | State: active

Observed problem: Adopt accounted for every maintained source correctly during reconstruction, but then
persisted that migration inventory in Architecture `Existing records`, K footers, and in-body provenance
marks. Deleting or substantially changing an input document after a successful
adoption therefore made current project knowledge fail validation or sent later readers back to the old
material. The document path became a second owner instead of the temporary evidence from which durable
purpose, domain meaning, decisions, constraints, terminology, modality, and uncertainty were transferred.

Chosen boundary: source coordinates, authority, disposition, and landing targets are complete but transient
proposal and refutation evidence. The approved final owner/K surface is self-contained current knowledge,
and Architecture `Existing records` contains only external inputs the owner explicitly elects to keep live.
A K normally has no `Source basis` after absorbed migration input. When a user-designated live input or an
existing managed card supplies the footer, the array remains nonempty and every coordinate must pass the
same path, revision, and range checks as before; absent and strongly valid are the only two forms. In-body
coordinates likewise name only current code, owner-kept live input, or managed-card evidence. Absorbed
meaning, modality, rejected directions, and uncertainty live in self-contained owner prose; unresolved
contradictions keep both positions and grounds without a machine coordinate mark.

DD-97's two commits remain but their staging partition follows the self-reference boundary. Adopt writes
and validates the complete approved Layer 0, capability, and K set, with capability `Design head: none`,
then lands every owner, same-owner K, and exact follow-on in the first commit. The Design-head command's
pathspec names only product, architecture, and glossary, so the capability-only second commit does not
advance the first commit selected by that command. The second commit changes only capability Design head
lines to that first commit ID. After commit one all approved meaning is
canonical and the committed `none` heads are a stale baseline for Resume-to-Arch recovery; uncommitted
bytes are never recovery input. No state, marker, predicate, ledger, or commit-body mapping is added.

Why and rejected alternatives: keeping historical coordinates, even with a compatibility label, preserves
the dangling dependency. Weakening coordinate validation lets a live input or managed card lie. Banning all
coordinates breaks exact managed-card evidence. A single commit would remove the real Layer 0 hash that
Design head needs. A durable migration ledger or new recovery state duplicates ownership and repeats the
discarded broad redesign. The correction is therefore one causal boundary: transient accounting becomes
self-contained knowledge, with optional evidence strong whenever it exists.

Affected coordinates: Adopt behavior, authoring card, proposal and output templates; the shared capsule,
freshness, writer, commit, and input policies; the common Product/Design/Arch K template; both Architecture
templates and Arch's schema sentence; the one adoption sentence in document-change routing; the root and
deployed knowledge validator pair and focused tests; DD-76 and DD-97; matrix §3.18 and §3.24; design map,
generated receipts, plugin manifests, CHANGELOG, and the v0.23.16 report. Direct, Work, Verify, Resume,
project-state, managed-card landing, journal grammar, and commit messages do not change.

Revisit when a completed adoption still requires an absorbed input to answer or maintain a current domain
question, when absent evidence weakens a live/card coordinate check, or when the committed `none` boundary
does not route as a stale baseline without changing the state model.

### Rejected under this subject

- **[DR-01 · v0.7.0]** **Mid-task handoff document** — hands over a half-truth.
- **[DR-05 · v0.7.0]** **Moving open decisions into the journal** — one concept, two homes. Replaced by the
  HANDOFF carry-over rule.
- **[DR-14 · v0.9.18]** **An observation-cache registration field (an observation_cache line in arch's output
  format)** — rejected by convergence of all three independent lenses: a field no skill's
  rule ever reads cannot change literal execution; its only meaning (a cache of facts —
  decisions stay devflow's) duplicates the outside-records standing declaration; and it
  opens a drift path that splits where observed facts live. The shape of an external
  observation cache stays project-owned — two field projects inventing two different
  shapes is the evidence for not prescribing one.
- **[DR-15 · v0.9.18]** **Promoting "re-baseline" to a canon noun** — 0.9.10 recorded deliberately dropping
  this term for colliding with resume's digest re-baseline, and that reason still holds.
  The table carries the descriptive form ("re-run product") instead.
- **[DR-16 · v0.9.18]** **Changing the HANDOFF format (allowing a skill name in Next single step)** — the
  existing Open decisions section plus the disproof row's journal waiting line already
  close the same path. The format stands.
- **[DR-17 · v0.9.18]** **Obsidian-style free linking** — falls to the no-unbounded-reading lineage and would
  be a second structure competing with the tree (one concept, two homes). devflow's
  relation model stays the typed edges (Depends · Coordinates · Read first · settling
  card) plus the content-carrying discipline.
- **[DR-18 · v0.11.0]** **Expanding the full design per capability inside product.md** — makes the Layer 0 file
  that work reads for every card grow in proportion to the capability count.
- **[DR-19 · v0.11.0]** **Splitting design and verified zones into two files** — creates two paths per capability
  and doubles reading and rename costs.
- **[DR-20 · v0.11.0]** **Pulling the first closure earlier, or having split create documents** — still leaves no
  document during design or in a brownfield with no split, and makes task decomposition own
  domain design.
- **[DR-21 · v0.11.0]** **Having arch create and split refresh** — split's task structure is not a design-zone
  input, and two writers would own the same bytes.
- **[DR-22 · v0.11.0]** **Recording planned main flows and entry points in the design zone** — duplicates the
  same concepts in the verified zone after first closure. Planned entry points already live
  in product.md and arch.md.
- **[DR-23 · v0.11.0]** **Putting all seven fields for both zones in one block at EOF** — places arch-owned
  `Capability number` and `Design head` inside the suffix verify replaces, so the fixed
  boundary no longer separates byte ownership. Physically separating two design fields
  from five verification fields closes this failure.
- **[DR-24 · v0.11.0]** **Assuming resume can answer a domain question after seeing filenames only** — showing a
  path is not an execution branch that makes AI read the document. A separate bounded
  branch must open exactly one document by number or name.
- **[DR-25 · other]** **Any "skim the related records" rule for maintenance reopening** — "related" is a
  judgment word; a literal-minded AI risks a read explosion, reading an entire fattened
  folder. **No unbounded reading rules, ever.** (For the bounded, confirmed wording, see
  the observation items below.)
- **[DR-30 · v0.12.0]** **A new per-capability working-note layer** — the relay note already exists as four layers:
  code, unharvested cards, the capability document, Layer 0. This would be a third home, and
  it borders the relay-note second handoff layer v0.11.0 rejected.
- **[DR-31 · v0.12.0]** **Reading unharvested cards' whole progress logs, or only the last N** — the first is
  unachievable (hundreds of lines per card), and in the second N is both a judgment word and
  an arbitrary number. The `Covered cards` complement is a mechanical boundary already being
  computed.
- **[DR-34 · v0.12.0]** **A capability-document freshness line in resume's report** — planned, then not adopted. No
  wrong action is prevented by it. Approval only picks a stage; work consumes the knowledge,
  work reports the same line, and a hypothesis must be reconfirmed before use. Adding it
  would also have required amending "ordinary resume never reads a body". The reason clause
  and the alternatives list were adopted, because those do change which unit a user picks.
- **[DR-40 · v0.13.0]** **A six-field disposition state machine for `capability note` at retirement** — 30 to 50
  canon lines where one gate before the retirement commit closes it, mirroring the adjacent
  clause that deletes evidence records at retirement.
- **[DR-43 · v0.13.0]** **Splitting the capability knowledge baseline predicates into a read contract and a write
  contract** — attempted, then folded on its own condition. The clause×consumer matrix is
  not clean: identity and expected set, the document contract, metadata and freshness,
  writers and replacement boundaries, the v0.10 migration, and accepted limits are all read
  directly by arch, adopt, verify, and resume alike, which is most of the file. resume, the
  supposed reader, needs the writer-eligibility rules for boundary recovery and the begin
  commit; verify, a writer, needs the domain-entry role inputs. Every consumer would read
  both files, which is the recorded condition for folding. Deferred rather than dropped.
- **[DR-45 · v0.13.0]** **Foundation closure folding observations into the verified zone** — six values would
  have needed defining (when, by whom, which point-in-time input, which section, how to
  mark unverified content, which card list) and the entry-point auto-detection was not
  mechanical: an undecided state at implementation-impossible level. The foundation's
  verified zone stays `None.` — it receives no scenario rite, so having no verified state
  is the honest record.
- **[DR-46 · v0.13.0]** **A source-preserving view on the consuming capability's side for shared parts** — a
  description from the consumer's viewpoint, not of the shared part itself. Shared-part
  knowledge already lives in three homes with reach paths: ADRs, arch.md's Risks, and the
  foundation cards' carry lines.
- **[DR-47 · v0.17.0]** **Broadening Provisional into one definition that also admits blocking facts** —
  Provisional holds follow-up facts with a safe default whose later result changes only optimization.
  `arch:58` says "never push a blocking fact into Provisional", and the blocking/follow-up split in
  `planning-evidence:16-19` stops facts that decide candidate viability or verification before the
  decision. A re-proposal must refute that boundary first.
- **[DR-48 · v0.17.0]** **Relaxing the correspondence between capability names and folder names** — this breaks
  philosophy 4 and prompt principle 1, both "one concept, one word", together with verify's exact-path
  mapping requirement at `verify:190-203`; arch.md `Code structure` is already the canonical mapping.
  A re-proposal must refute all four grounds and supply a mechanical mapping that does not make verify
  reinterpret meaning on every run.
- **[DR-49 · v0.17.0]** **A `.wip.` filename suffix for Layer 0 drafts** — `principles:367-368` forbids changing
  core-document paths before confirmation, `:522-523` treats bare `.wip.` as an integrity anomaly, and
  `:509-511` forbids progress records in product, arch, design, code-style, and glossary. During an
  integration blockade, Layer 0 changes themselves wait, so the proposal also fails in its primary
  interruption scene. A re-proposal must first refute those four conflicts and price recovery.
- **[DR-50 · v0.17.0]** **Using design as the authority channel for outside materials** — `design:12` ends design
  when `frontend: none`, and `Design source` authority is limited to design scope. It is an unavailable
  lower-layer channel for product and arch facts in server, CLI, and library projects. A re-proposal must
  first refute both the entry gate and that ownership boundary.

## Brownfield and entry

### DD-10 · No retroactive tree records (brownfield)

Subject: Brownfield and entry | Introduced: origin | State: active

Backfilling `.done.` cards for existing features is waste. The tree covers only what comes after adoption

### DD-20 · Brownfield entry is its own skill, adopt — split out of arch (v0.9.10)

Subject: Brownfield and entry | Introduced: v0.9.10 | State: active

arch held two concepts under one name — development planning and whole-Layer-0 reverse-derivation — so entry discoverability died (the derivation trigger lived only in the tail of the skill description) and the seam in the body was ambiguous (a literal reader could not settle whether the interview procedure and the verify-channel gate applied after derivation — owner report 2026-08-10). The derivation procedure and field split moved per the 0.9.8 decision — new sentences bounded to the entry guards, the evidence-order line, the gate pointer, and the design note; 0.9.8's "re-interviewing is waste" verdict stands. The output formats stay canonical in product·arch; adopt references them by stage name + the Codex prompt embeds them at install time (same grounds as the flat-folder decision). "adopt" is standard developer vocabulary — the Nx docs section "Adopting Nx", Next.js·React official "Incremental Adoption", the Tech Radar top ring "Adopt"

### DD-26 · Brownfield and layer transitions have explicit disk states, preserving their meaning across interruption (v0.9.21)

Subject: Brownfield and entry | Introduced: v0.9.21 | State: active

An adopted repository and a new project had the same document shape, so resume backfilled existing features into the tree; deriving a multi-domain service from one representative flow also produced capability boundaries that were too coarse. adopt now enumerates candidates from external entry points, top-level modules, and existing documents, then traces one representative flow per candidate. arch.md's `Brownfield` field records only whether implementation existed before adoption, preventing backfill. Completing tracked post-adoption work does not expand automatically into the product layer; only an explicit `product verification requested` marker opens it. That request changes atomically to running and result states, each in its own commit, so the brownfield trigger and revisions survive request deletion. A verbatim `maintenance routing pending` line survives until the planning commit so a session break between adoption and the first card plan cannot erase the change request. Before opening a layer, an exact parent path and child numbers go into a journal marker before the parent is created; the marker is deleted only when every child and task-card approval lands in the planning commit. Root waiting capability files are not task cards and therefore have no Approval or Review fields; a new project's foundation is never an empty folder and is created with its direct cards in the next layer. The boundary after an ordinary final task commit is detected without Git's rename label: the HEAD claim is absent, exactly one same-number/name `.done.` file exists beside it, and bytes match. A begin marker carrying the passing revisions recovers capability closure. Non-capability folders whose active direct children are all `.done` close deepest first; only a capability folder waits for a verify pass

### Rejected under this subject

Nothing has been rejected under this subject yet.

### DD-97 · Explicit Adopt reconstructs an unmanaged brownfield once; managed technical refresh belongs to Arch (v0.21.0)

Subject: Brownfield and entry | Introduced: v0.21.0 | State: active, partly corrected by DD-101 (v0.23.7), DD-103 (v0.23.10), DD-104 (v0.23.11), DD-108 (v0.23.16)

Observed problem: three clean existing-code worktrees invoked Adopt explicitly, yet the installed
entry text told Codex to enter Principles first and Adopt did not accept the state tool's
`setup.unmanaged` route. Principles therefore sent the request to Resume, which correctly ended
the unmanaged state without writing; one more-active model escaped only by inspecting runtime
source and creating an empty `.devflow/` directory, the second-home marker DD-95 rejected. Even
after the missing route was added, Adopt's inherited phase fields asked the model to report that
it had read, inspected, derived, and prepared instead of doing the work. Filename-shaped document
selection and “code exists” stood in for documentary and representative-flow evidence. Its broad
fallback also formed `Resume → Adopt → Resume` cycles for Brownfield design markers and baseline
refreshes.

Desired behavior: an explicit adoption request starts from the purpose the owner selected. It
reconstructs the complete planning and knowledge surface already expressed by maintained documents
and/or code, including applicable product design, and accounts for every maintained source rather than
sampling a convenient subset. It builds enough glossary and domain structure for later cold
maintenance, asks only questions that evidence cannot resolve, presents one coherent write set for
confirmation, and then stops. A
managed project must never be sent back through first-time adoption merely because its
implementation predates devflow.

Chosen boundary: an explicitly named devflow stage is its own entry. Principles classifies only
requests that entered Principles; SessionStart and the Codex fallback state this same topology.
**v0.23.1 boundary clarification:** when a named stage opens the shared Principles policy index from
its own always-read purpose, it consumes policy rather than pre-entering the classifier. This keeps
one policy canon without changing the stage purpose the user selected.
SessionStart remains silent unless `.devflow/project/product.md` exists. In canonical state, an
untracked empty or partial `.devflow/` directory is likewise not managed-project evidence; indexed
or historical `.devflow` paths remain recovery evidence. A folder alone cannot activate Resume
guidance or change explicit Adopt's unmanaged route.
Explicit Adopt consumes `setup.unmanaged` directly when any maintained pre-devflow project source is
present and sends only a repository with no such material to Product. Its collector observes
canonical state and that bounded source presence only. The model inventories every maintained implementation, test, API, schema,
configuration, document, specification, and operational source and gives each one an explicit
named landing, supporting-evidence status, supersession or contradiction, reasoned non-domain
exclusion, or visible unresolved status. It traces one executable flow per code-backed capability
candidate; where a capability exists only in maintained documents, it records that provenance and
derives the candidate without inventing runtime evidence. It reconciles claims and contradictions
and derives Product, Architecture, applicable Design, code
style, glossary, capability design zones, and every owner-adjacent K node needed for deeper durable
  domain knowledge. Zero K nodes is valid only when all maintained domain sources demonstrably land
  in the always-read owners. One complete proposal precedes the owner's binding approval. Refusal or
  interruption before approval writes nothing. Under that one approval, Adopt preserves any follow-on
  work in Principles' canonical maintenance-routing record, writes `product.md` last among the Layer 0
  owner documents, writes and validates every Product-, Architecture-, or Design-owned K node beside
  that owner document, and commits the complete Layer 0 boundary as `adopt — layer 0`. It then calculates
  the canonical Design head from that landed commit, writes the capability documents carrying that exact
  value, writes and validates every capability-owned K node beside its owner document, and commits that
  complete boundary as `adopt — capabilities`, then ends without choosing
  Product, Arch, Design, Split, or Resume on the owner's behalf. Before `product.md` is written an
  interruption remains unmanaged. A post-product pre-commit interruption leaves an unverified dirty
  boundary for owner-directed exact commit or discard; no stage claims it. After the first commit and
  before second-boundary writes, the existing managed baseline-missing state routes through Resume to
  Arch without reopening Adopt. Architecture `Existing records` already holds the source coordinates,
  authority, disposition, and landing owner needed to rederive the second boundary from source.

Document authority is reconstructed rather than assumed. Internal status and corroborating code,
tests, operational evidence, path context, Git history, and last modification time distinguish
implemented/current material, binding plans, exploratory research, superseded records, and unresolved
conflict. A filename, folder, or timestamp is a clue, never sole authority. The model resolves only
disagreements the combined evidence can close and records the provenance of that synthesis; otherwise
it asks the owner with the competing coordinates and the exact current-intent decision still needed.

Once Layer 0 exists, current technical design has one owner: Arch. Resume routes
`marker.glossary-term`, `marker.design-note`, `marker.design-open-item`, `baseline.legacy-v010`, and
  `baseline.design-refresh` there regardless of the historical Brownfield field, and Arch no longer
  redirects those managed refreshes to Adopt. The entry and membership clauses above correct DD-92's
  former all-entry preclassification wording and DD-95's directory-presence activation wording; their
  one state owner, quiet global installation, and indexed/history recovery grounds remain intact. The
  managed technical refresh boundary corrects only the origin-based writer clauses of
DD-43 and DD-88: their exact capability owner, attributed marker, byte-identical consumption,
design/verified byte boundary, and ready-work priority remain intact. The old origin split had a
reason before Adopt was separated from Arch, but after DD-20 it gives one present-tense artifact
two procedural owners and now has an observed route loop. The Brownfield field still records
pre-adoption origin and still prevents Resume from backfilling existing implementation into the
work tree, as DD-26 requires.

**v0.23.9 owner-boundary correction:** DD-92 made Product, Architecture, Design, and Capability the
semantic owners of same-stem K trees. DD-76's same-commit owner rule therefore applies by owner class:
initial Adopt lands Product-, Architecture-, and Design-owned K with Layer 0 in `adopt — layer 0`, and
capability-owned K with the capability documents in `adopt — capabilities`. Every managed capsule
refresh still belongs to Arch.

**v0.23.16 staging correction:** initial Adopt completes and validates every owner and same-owner K before
the first commit, then lands all of them in `adopt — layer 0` with capability `Design head: none`. Because
the Design-head command excludes capability paths, `adopt — capabilities` changes only those head lines to
the first commit hash. If interrupted after the first commit, the committed semantic set remains complete
and the stale `none` heads route through Resume to Arch; no uncommitted capability or K bytes are inputs.

Existing exact `writer=adopt` knowledge markers keep that value as bounded legacy provenance until
consumed, because changing an already committed marker's declaration would break DD-92 provenance.
Resume no longer turns that provenance into a procedural owner: Arch consumes both legacy `adopt`
and current `arch` markers, while Work produces only `writer=arch`. Compatible-feedback
payloads declare a semantic owner but no writer, so canonical state derives their consumer from that
owner alone: Product for product/glossary, Design for design, and Arch for architecture/capability.
This corrects DD-96's Brownfield-based Arch/Adopt route split while preserving its exact payload,
Git seal, semantic-landing proof, and byte-identical consumption grounds. Neither legacy provenance
form is permission to reopen adoption or to route any managed work to Adopt.

Rejected alternatives: adding only `setup.unmanaged` repairs the first route but preserves fake
evidence and model-reported phase loops. Teaching Principles or Resume an Adopt-intent exception
re-couples explicit stage entry to the classifier that obscured it. Reintroducing separate Adopt
branches for every design and baseline state duplicates Arch and recreates the patchwork. Asking
whether to run Product after explicit Adopt contradicts the existing-project evidence and can loop
through Product's own Brownfield guard. A project-local trace-path instruction is also rejected as
an Adopt rule: trace placement is shared Skill Rails adapter behavior and must be corrected once
upstream rather than copied into one domain skill. A single adoption commit is impossible under the
current Git-based Design-head contract because a capability document cannot contain its own future
commit id; changing that contract to a content hash moves every baseline consumer, while leaving all
capability authoring to a later Arch session no longer fulfills Adopt's confirmed projection.

Affected coordinates: the Adopt, Arch, Product, Design, Resume, Work, Verify, and Principles authored P2 packages and generated
adapters, including Principles' current knowledge/delivery references and state tool; SessionStart and its focused
tests; Codex fallback text;
the design component index; matrix cells 3.21 and 3.24; deploy manifests and CHANGELOG. DD-20,
DD-26, DD-89, DD-92, DD-95, and DD-96 otherwise remain affirmed within their recorded reasons.

Revisit when an explicit stage still enters Principles first, an unmanaged repository with maintained
documents or code fails to reach Adopt, Adopt asks the owner for a discoverable repository fact or for a next-stage choice,
a maintained source disappears without an explicit disposition, a follow-on request is lost at the
adoption boundary, a managed design/baseline/Arch-written knowledge route returns to Adopt, or the
resulting glossary and capability/K surface is insufficient for a later cold maintenance session, or
an adopted capability's stored Design head differs immediately after the two approved commits.

### DD-102 · One bounded clean-context semantic refutation precedes Adopt's binding question (v0.23.7)

Subject: Brownfield and entry | Introduced: v0.23.7 | State: active, partly corrected by DD-103 (v0.23.10), DD-106 (v0.23.13), DD-111 (v0.25.0)

Observed problem: the Adopt proposal had an `Evidence verification` section immediately before
binding confirmation, but current canon did not say what was checked, by whom, or what passed. The
same producer could report that coordinates existed while a contradiction or omission across source
dispositions, Layer 0, and capability/K links remained in the set being bound. Adopt also lacked the
value space for the Architecture `verify_channel` it must write, while Product `C<n>` and disk
capability `NN` were offset by one but both called a capability number. Failure evidence on a separate
past lineage showed that these gaps could produce broken links and missing verification means; the
orphan current verification section and the two ambiguous authority coordinates independently prove
that the gap remains on current bytes.

Desired behavior: before the owner binds the complete write set, a small context independent from
production tries once to refute its meaning. It neither mechanizes every fact nor reviews prose taste;
it blocks only load-bearing defects capable of producing a wrong next action.

Chosen boundary: after preparing the complete draft, Adopt's semantic-refutation stage runs one
bounded clean-context semantic refutation and records it under `Evidence verification` before showing the proposal and binding
question. Its inputs are only the full draft; inventory and dispositions; load-bearing current and
proposed source/code coordinates; the selected shared capability/capsule contract; and Arch's
verification-channel table's Surface and Required channel columns plus first proposal paragraph and
ADR conditions. It excludes the Missing-channel action column, producer transcript, earlier audit
conclusions, and all other Arch execution, verification-run, approval, write, and commit instructions.

A finding blocks only when a supported contradiction or omission would cause a wrong action, lose a
required decision or rejected direction, assign the wrong owner, or omit verification means. The
draft may be revised once; afterward only returned coordinates are rechecked and no new full pass is
opened. An unresolved blocking finding or unavailable clean context prevents binding. Refutation state
is a judged pending, clear, or blocked observation; blocked covers either a supported blocking finding
or unavailable clean context. Only pending runs the refutation stage, only clear reaches the proposal
and approved writes, and blocked stops before the proposal while the approval row also requires clear.
The shared baseline contract fixes an unqualified capability number to disk `NN` and writes a Product-local id as
`Product C<n> <name>`, keeping the two coordinate spaces distinct.

Why the boundary is needed: one Adopt approval creates a broad knowledge surface later sessions treat
as canon. Producer self-attestation cannot independently see its omissions, while a full audit or
large validator would turn the stage into a product answer key and grow procedure. Bounded inputs, a
narrow blocking threshold, and one revision cap fix both cost and convergence. Consuming only the two
needed Arch table columns and first proposal paragraph does not move current technical-design ownership.

Rejected alternatives: retaining only the `Evidence verification` heading invites producer
self-attestation to masquerade as verification. Mechanizing every proposal fact in rules and fixtures,
copying all Arch procedure into Adopt, or starting a new full pass per finding expands scope and read
cost. No Product rule is added for refutation; Product's separate DD-101 bridge consumes only the
concurrent canonical interrupted-boundary fact and does not duplicate this judgment.

Affected coordinates: Adopt's refutation observation, stage, approval table, and declaration in `spec.mjs`, `body.md`,
`references/workflow.md`, intent, obligation ledger, fixture, and generated receipts; Principles'
capability baseline contract, `opening-and-freshness.md`, and `relations-and-lifecycle.md`;
`scripts/repository-invariants.test.js`; DD-97; matrix §3.24; deploy manifests; CHANGELOG; and
maintenance protocol §9. Arch runtime, Product's authoring decisions, and the original JZ Note sample
remain unchanged by this decision.

Revisit when the refuter lacks the full draft or load-bearing authority coordinates, earlier
conclusions are injected as answers, findings broaden into prose review without an action failure, a
full sweep repeats after the one revision, a proposal binds with a blocking finding, or Product C and
disk NN confusion points at the wrong capability.

### DD-106 · Adopt semantic refutation converges by independently evidenced causal progress, not a revision count (v0.23.13)

Subject: Brownfield and entry | Introduced: v0.23.13 | State: active, partly corrected by DD-111 (v0.25.0)

Observed problem: a real Adopt run completed the one permitted correction after its initial semantic
refutation, then stopped with `blocked` and `reinvoke: null` while the executing agent judged that
correctable findings remained. The retained raw evidence cannot establish that all three findings were
actually correctable, but the canonical transition closed the next action by count without observing
whether the correction had removed or narrowed a failure.

Desired behavior: keep one complete initial refutation, while a draft correctable from current authority
and returned evidence continues converging as an independent recheck proves real removal or narrowing
of the same cause. Stop when that cause is unchanged, recurs, or creates a new blocker, and also before
binding on an owner decision, authority contradiction, or missing required input.

Chosen boundary: add `revise` to the existing `semantic-refutation` judged state. A first revise is
eligible only with the current draft, returned evidence, and one concrete current-authority correction
for every current blocking finding. The branch corrects that draft, independently rechecks only returned
coordinates, changed targets, and direct consequences, records the current result in existing `Evidence
verification`, and returns to the same stage judgment. A later revise requires independent evidence that
every attempted root was removed or strictly narrowed in its causal scope without introducing a blocker
or reopening a closed failure. Finding names, coordinates, and total count are not progress evidence.

`clear` requires preserved initial coverage, current independent verification, and no supported blocker
or unanswered binding dependency. An unchanged or regressed attempted root, a needed owner answer or
authority contradiction, or unavailable current draft, source, prior evidence, or clean context explains
the current failure and required input and remains on existing `blocked`/`BLOCK`. A future choice falsely
written as confirmed may be accurately retracted when current binding does not depend on resolving it;
moving an unresolved binding fact to Questions does not make the draft clear. An owner answer that
changes load-bearing draft content receives the bounded independent recheck before the current write set
can be confirmed.

Why the boundary is needed: DD-102's bounded inputs, clean independence, load-bearing threshold, and
single initial full refutation still cap cost. But “one revision” stopped a draft that was still being
corrected without observing convergence, so field execution partly refuted the recorded reason that the
count fixed both cost and convergence. A causal recheck of the returned scope plus a hard wall at a
no-progress root fixes both cost and termination without an arbitrary constant.

Rejected alternatives: raising the retry constant to two or three only postpones the same arbitrary
stop, while expanding a finding taxonomy substitutes terminology for canonical judgment. A prose-only
reinvoke has no execution branch, and treating owner decisions or authority contradictions as `clear`
reverses DD-102's binding protection. Opening a new full pass per finding also breaks the bounded cost
and is not adopted.

Affected coordinates: Adopt `refutation.state`, `semantic-refutation` branch, declaration, body and
workflow, current intent and obligation ledger, eval and scenario fixtures, generated receipt, DD-102
state, matrix §3.24, both plugin manifests, CHANGELOG, and the v0.23.13 implementation report. Product,
Arch, Design, and Principles runtime, the proposal template, collector, two confirmed commit boundaries,
and the user's raw evidence remain unchanged.

Revisit when the bounded causal recheck permits the same no-progress root again, opens a new full pass
per correction, clears after disguising a required owner decision as unresolved future work, or Evidence
verification cannot recover initial coverage and current progress.

### DD-111 · A declared role returns Adopt's semantic refutation, and an approval that arrives before it is current never reaches a write (v0.25.0)

Subject: Brownfield and entry | Introduced: v0.25.0 | State: active

Observed problem: two real 0.24.0 Adopt runs reached the irreversible first canonical write set on
producer-supplied values alone. One narrowed the refuter's brief until the blocking check for
verification means fell outside it; the other resumed after an interruption and went straight toward
the write plan. The machine cause is one absence and one leak. Absence: the refuter was the only
independent judge in devflow that was not a declared role - `ROLES` was empty and the refutation was
an opaque `RUN` action, so its inputs, exclusions, and return lived only in prose the producer itself
assembled. Leak: a stage BLOCK that asks for one caller value seals every value supplied with it and
inherits it into the next call, so `approval.action=approve` typed while refutation was still unknown
rode a refutation question into the approve row and skipped the write-free proposal and its question.

Desired behavior: the clean context receives a contract the producer does not author, returns a
declared shape, and an approval taken against a proposal this run never presented cannot reach a
write. Adopt still writes nothing before approval and adds no state, marker, or recovery protocol.

Chosen boundary: Adopt declares `ROLES.refuter` with its inputs, reads, judgments, and a
`refutationResult` return template, and both refutation branches `DISPATCH` the role before `WAIT`,
and no devflow sentence carries the briefing (v0.25.1; 0.25.0 used one contract file per role,
which measured 93.7~97.8% identical across five). devflow carries no delivery instruction for this. Verify and Work already declare roles and briefed them correctly without one in 0.23.3 and 0.23.8; the one observed failure was Adopt, which declared no role at all, and declaring it closes that. No evidence shows the sentence is needed. The brief is the runtime's own `role` render, so narrowing it is no longer a
producer choice; the returned `coverage` field carries the preserved initial coverage that prose alone
could not hand across a correction. `refutation.state` moves to the `decided` lane it shares with
Verify's returned verdicts, leaving Adopt with no producer self-judgment. Guard
`approval-precedes-refutation` blocks while the route is `setup.unmanaged`, the approval is `approve`,
and refutation is not `clear`; because a guard stop carries no needs, it emits no continuation seal, so
the premature approval is not inherited and the next call falls to the write-free `prepare` proposal.
Verify's and Arch's four existing `DISPATCH` effects carry no briefing sentence either: their roles
are declared, and the contract each clean context needs is the runtime's own render of that
declaration.

Why the boundary is needed: every other independent judgment in devflow is a declared role whose
verdict lands where a collector can read it, and every other approval boundary has a disk observation.
Adopt has neither and cannot have the second: write-free-before-approval is the recorded conclusion of
DD-102, DD-108, and DD-109, so no disk fact distinguishes a resumed session from a fresh one. What is
available is removing the producer's authorship of the brief and removing the seal window that carried
an approval past its question. Both use constructs the repository already runs.

Rejected alternatives: writing refutation or approval evidence into the project before approval
reverses DD-109's recorded reason. A coverage collector needs the proposal on disk and turns the stage
into the product answer key DD-102 rejected. Adding a shared-layer maintained-source projection was
withdrawn once the runtime snapshot basis was found to already bind HEAD, full working-tree status,
and the worktree list. Narrowing the caller-input seal to the fields a Decision needs is the right
repair but belongs to Skill Rails, not here.

Affected coordinates: `skills/adopt/spec.mjs` observations, guards, roles, templates, stage
branches, and declaration; `skills/adopt/body.md`; `skills/adopt/references/workflow.md`;
`skills/adopt/templates/refutation-result.md`;
`skills/verify/spec.mjs` and its three role locators; `skills/arch/spec.mjs` and its channel-verifier
role fields; `skills/work/spec.mjs`, whose reviewer contract carried the same project-resolved read; their fixtures and generated receipts;
`scripts/project-state.test.js`; DD-102 and DD-106 state; matrix 3.24.

Revisit when a producer still assembles a role brief by hand, a premature approval reaches a write
row again, the returned coverage cannot be compared across a correction, or the residual same-call
approval becomes reachable without a person in the loop.

## Git mechanics and interruption recovery

### DD-34 · An open Git rebase or merge in a Git work tree returns to the user before every devflow route (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

If a session ends after an integration command, Git's open operation and conflict index are already durable state. Treating them as claimed work can append the wrong devflow state, while an automatic abort can discard resolutions the user made. No path or commit changes before the user decides; continuing allows only confirmed conflict resolution and commits of the existing Git operation, followed by a fresh integrity check. A non-Git project has no such state, so the gate neither applies nor initializes Git

### DD-35 · Commit locators use Git's full object ID, while path and card order have canonical byte and numeric rules (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

A 40-character requirement rejects SHA-256 repositories. Operating-system or model default collation can choose different first items for Unicode paths and `02.2`, `02.10`, or `02.2b`. Define once: Git's unabbreviated object ID, UTF-8 byte order for repository-relative `/` paths, and numeric-plus-suffix order for dot-separated card numbers

### DD-37 · Remote evidence splits the final task commit into the `evidence-wait` and `evidence-finalizing` states (v0.9.21)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active

Failure path: when only a remote result remains in the completion signal and the session ends between the checkpoint commit and the journal record commit, the next session judges the same CI result twice or makes a second final task commit. The canonical journal line therefore carries the checkpoint hash and `check-json` so recovery has exactly one point, and a pass becomes `evidence-finalizing`, meaning the final task commit is done and only upper-document feedback and boundary cleanup remain (CHANGELOG 0.9.21)

### DD-85 · Tree-input revision hashing preserves raw Git bytes at the process boundary; a Buffer handoff supersedes the Windows-only shell pipe (v0.19.0)

Subject: Git mechanics and interruption recovery | Introduced: v0.19.0 | State: active

DD-39 already measured that the legacy `cmd` binary pipe matched the raw-byte hash and that only
the PowerShell object pipeline differed. The v0.19.0 S3 fixture now seals the moved executor
directly: its result equals `git hash-object --stdin` fed the exact `ls-tree -z` stdout `Buffer`.
Paths containing spaces, shell metacharacters, and Unicode preserve those bytes too. The first
Git process's exact stdout `Buffer` becomes `git hash-object --stdin`'s stdin without text decoding
or shell parsing. Appending one NUL byte changes the hash, and a failed source Git command remains
`unresolved` rather than becoming the empty-input hash.

The invariant is therefore raw bytes between the two processes, not a particular shell.
Keeping a Windows-only `cmd /d /s /c` wrapper adds quoting and platform branches without
preserving the bytes better. The PowerShell object pipeline remains forbidden because its
reproduced failure still stands.

Affected coordinates: the tree-input hash executor in
`skills/principles/scripts/project-state.mjs`, the raw-byte invariant in
`skills/principles/verification-predicates{,_ko}.md`, the S3 fixture in
`scripts/project-state.test.js`, `scripts/repository-invariants.test.js`, and DD-39.
Revisit when: the state tool's result differs on a supported platform from the hash fed the
first Git process's raw stdout `Buffer` directly, or when the execution boundary between the
two Git processes changes. Shell preference alone does not reopen this decision.

### DD-39 · Tree-input revision hashes are computed only through a binary pipe inside `cmd /d /s /c` on Windows (v0.9.21, executor moved v0.18.7)

Subject: Git mechanics and interruption recovery | Introduced: v0.9.21 | State: active, partly corrected by DD-85 (v0.19.0)

Actually reproduced: on 2026-08-11 in this repository, the PowerShell 5.1 object pipeline touched the NUL-bearing stdout of `git ls-tree -r -z` and corrupted the hash — the POSIX binary pipe and the `cmd` pipe produced the same hash, and only the object pipeline differed. Same "actually reproduced" class as the install.ps1 BOM row. In v0.18.7 the executor of this computation moved from prose to the state tool and **the boundary is preserved verbatim inside the code** — a native binary pipe on POSIX, the same pipe inside `cmd.exe /d /s /c` on Windows, and NUL-bearing stdout is never decoded to a string. A changed executor **does not mean the boundary became unnecessary**: no prototype has refuted the recorded reason, so this row is preserved rather than discharged, and changing the boundary requires proving equivalence and recording a new decision (during the v0.18.7 implementation Node's argument passing did hand the inner quotes through as literal characters and made a revision `unresolved`; what was fixed was the argument passing, not the boundary)

### Rejected under this subject

Nothing has been rejected under this subject yet.
