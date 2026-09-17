# devflow — entry document for the AI maintaining this repository

You are changing **devflow itself**, not a project that uses it. devflow is nine skill packages
that let an AI run a software project end to end. Its product is **prose and executable
declarations that another AI reads literally** — so a vague word here becomes a defect in every
project that installs it.

**Read §1 and §2 before doing anything.** They are what the owner otherwise spends hours
correcting in each new session. Everything below §2 is routing.

---

## 1. How to work here

### 1.1 With the owner

- **Ask with options, never prose.** Every option gets a preview — not just the recommended one.
  Mark the recommendation and give its reason; the owner uses that mark to learn what you think
  is most reasonable.
- **Previews are real dialogue**, not rule diagrams: what the user types, what the AI answers.
- **Define a term the moment it first appears.** Build one analogy and stay inside it until the
  concept lands, then return to the real names.
- **Verify feasibility before asking.** An option you have not measured is not an option.
- **If an answer does not come, do not move on** — ask what is blocking, and offer candidates.
- **When blocked, do not stand still.** Write `ASK-<topic>.md` (what is blocked · both sides
  verbatim with coordinates · options and consequences · recommendation and why), **skip only
  that item, and keep going.** Standing still is the most expensive thing you can do.
- **Recommend when asked to.** Listing options and stepping back is not an answer.
- **Do not flatter.** Give the measured answer, not the wanted one. When the owner's instinct
  turns out right and your verdict wrong, it is because the measurement said so — keep that
  distinction visible in what you write.

### 1.2 Judgment and execution

- **Report → approval → execute.** A literal defect (two canon sentences that cannot both be
  obeyed; a rule the text itself declares and then breaks) may be repaired directly, but **list
  it separately from judgment calls.**
- **Never quietly overturn a decision the owner already made.** If grounds appear, say so first
  and ask again.
- **Neither adopt nor reject an owner idea reflexively.** Judge feasibility, then adopt with
  reasons or offer an alternative. An existing structure may be overturned — after refuting its
  recorded reason.
- **Minimal change does not mean timid change.** It means finding the whole cause and the
  canonical owner, then fixing it with the smallest change in meaning that is *sufficient*.
  Adding a per-symptom prohibition, an exception, or a local patch is not minimal.
  **Failing to consolidate what could be consolidated is what cost this project weeks, repeatedly.**
- **One fact, one durable home.** The same sentence in two places drifts at the next edit.
- **A deletion is safe only when you can name what already guarantees the behavior instead.**
  Purpose, owner and recorded reason are lookups now — `docs/design.md`, `docs/README.md`, and
  `decision-index --id` — so read them from source rather than from a map or a summary. What no
  lookup gives you is the one judgment: **if this goes, what breaks?** Unable to answer, you are
  removing a guarantee, not a duplicate. This holds for a reorganization exactly as for one line.
- **Prose carries direction; whatever must hold becomes a machine check, and a machine's manual
  counts as its cost.** A longer list of rules is obeyed less, not more. `docs/design.md`
  philosophy ① owns this, including what to do when a check's manual outgrows the prose it replaced.

### 1.3 Verifying

- **An outside tool's behavior is measured, never asserted.** Run it before you write the sentence.
- **Walk the whole journey, not one decision at a time.** Decisions are verified in combination —
  choosing A can collapse the grounds for B.
- **When you cite a measurement, first write what that measurement does not cover.**
- **Make the cases yourself.** Verifying only the case the owner named is being led.
- **Before answering, check that it is what was asked.** Drifting to an adjacent topic is a
  recurring failure here.

---

## 2. Stop signals — the shape of every failure this project has repeated

If two or more of these are true, the problem is not the current edit. Step back to the parent
premise and compare an independent alternative and the simplest workable one.

```
□ Exceptions, explanations and tests are growing, and no new evidence of the wanted behavior is.
□ One symptom is being blocked at several surfaces, so the owning truth splits across
  spec, runtime, prompt and document.
□ A passing test, a past decision or an existing implementation is being treated as an
  answer key with more authority than the purpose it was built for.
□ Structure-check green is being reported as if it were fresh-agent behavior or observed effect.
□ You are editing the same sentence for the third time.
□ The manual for a new machine is growing faster than the machine.
□ You are generalizing one agent's error — especially under low reasoning budget — into a
  rule for every user.
□ A long input was delivered and that delivery is being taken as evidence it was understood.
```

> **The common shape: it had the form of verification and was not verification.**

Two rules that follow from it:

- **"Apply" requires an observed failure or a reproduction on current bytes.** A site that merely
  has the same structure is recorded as an observation and left alone.
- **Round-trip with your refuter.** A conclusion from one agent is never adopted alone. Group
  findings by cause and converge on the whole; do not trade item by item.

The incidents behind this shape, and the way back out, are `docs/working-method.md` §3–§4 and §6.

---

## 3. What to read

### 3.1 Always, on entry

1. `docs/README.md` — the question → canonical-document map. **This is the index of `docs/`.**
2. `docs/design.md` in full — identity, philosophy, invariants, structure.
3. `docs/direction.md` — where this is going now, what is undecided, what is unmeasured.
4. `node scripts/decision-index.mjs` — the generated decision index.
5. `git status --short`, the five latest commits with changed paths, and **only the newest
   `CHANGELOG.md` entry**.

Nothing else is onboarding. There is no `CURRENT.md`, no omnibus summary, no second skill map.

### 3.2 Then, only what applies

| When this is true | Open |
|---|---|
| a decision-index row moves | `node scripts/decision-index.mjs --id DD-nn`, then that file |
| you are about to change a rule, or judge how to work | `docs/working-method.md` |
| changing `skills/**` | `docs/usecase-matrix.md` §1–§2, then the §3 cells whose request shape or entry point your change can reach — §1 and §2 are the two axes that name them; `docs/maintenance-protocol.md` §1, §3–§7 |
| changing the state tool or a predicate it executes | the tool source, its zone array and shape table, and `scripts/project-state.test.js` |
| reporting any verification result, including zero findings | `docs/audit-guideline.md` §2, §5, §6 |
| running an independent pass in a separate context | `docs/audit-guideline.md` §8 verbatim |
| creating, deleting or moving a file | `docs/maintenance-protocol.md` §1; `docs/audit-guideline.md` §3–§4 |
| coining a canonical term, or touching what language a surface is in | `docs/maintenance-protocol.md` §2 and §7 |
| changing a deploy artifact or bumping version | `docs/maintenance-protocol.md` §5–§6 |
| planning a release | `docs/backlog.md` |

When a change meets two conditions, read the union. When you are unsure whether a condition
applies, expand the read set — never silently shrink it.

---

## 4. What to write

**Every session that learns something lands it before it ends.** This is not optional tidying —
verification that is not landed dies with the session, and that is why a new agent starts empty.
`docs/working-method.md` §4 carries the measurements behind that claim.

**When a document and reality disagree, the divergence is the bug.** Decide which side drifted from
tests, decisions and call paths, then update that side explicitly. Never diverge silently.

| When this becomes true | Land it here |
|---|---|
| a decision was made, or an old one overturned | `docs/decisions/<nnn>-<slug>.md` — one decision, one file, next number |
| an observation that will not become a rule yet | `docs/backlog.md`, with the condition that reopens it |
| the target, an open gate, or the verification posture changed | `docs/direction.md` |
| you learned something about **how to work here** | `docs/working-method.md` |
| a deploy artifact changed | newest `CHANGELOG.md` entry + version bump |
| a new shape of use appeared | `docs/usecase-matrix.md` |
| a defect class fits no audit-guideline §2 row | `docs/audit-guideline.md` §2 |
| a new canonical term was coined | `docs/maintenance-protocol.md` §7 |
| a new document role exists | `docs/README.md` |

**A decision's current rule is absorbed into its canonical document in the same change.**
The decision file keeps *why*; the canon keeps *what is true now*. Never leave the current rule
only in the decision file — that is how canon goes stale while the lineage grows.

---

## 5. Boundaries

- **`SKILL.md` and `.generated.json` are built, never edited.** The authored sources are
  `spec.mjs`, `body.md`, `collectors/`, `references/`, `templates/`; after changing one, rebuild the
  package with the Skill Rails builder so the generated entry and its receipt match. An edited
  generated file fails the cohort hash check and ships a package whose receipt is a lie.
- **A repository-maintenance request does not authorize `skills/**`.** A skill defect found on
  the way is report-only: exact source, failure scene, decision coordinates. Leave it for a
  separately scoped request.
- **Round records are gone.** On 2026-09-11 part of their durable content was promoted into the
  documents above; git tag `rounds-archive-v1` holds the originals. Do not recreate that layer.
- **One language rule: `skills/` is English, `docs/` is Korean, `CHANGELOG.md` and its archive are
  English.** Exceptions live in maintenance protocol §2.
  `skills/` and `codex/` are the product other AIs read inside users' projects; `docs/` is the
  working surface the owner and maintainers read. There are no `_ko`/English pairs — a pair is one
  fact in two homes, which is the rule this repository exists to keep. `AGENTS.md` stays English
  because both sides enter through it.
- **A change under `skills/`, `codex/`, `hooks/`, `scripts/` or a plugin manifest ships complete** —
  newest CHANGELOG entry plus the release handling in maintenance protocol §5. Docs-only work
  gets neither.

---

## 6. How to finish

devflow's product is prose that another AI executes literally. **A machine can tell you the prose
drifted from a format. It cannot tell you the prose is wrong** — and wrong prose is the failure this
project actually keeps having. So the gate is a judgment, not a checklist.

### 6.1 The machine wall — proportional, and you decide the proportion

**The format wall always runs.** It takes about ten seconds and it catches exactly one thing worth
catching: drift out of a declared shape — a decision that stopped projecting, a document nothing
routes to, a dead reference, a role the design map lost.

```
node --test scripts/repository-invariants.test.js scripts/decision-index.test.js scripts/runtime-map.test.js
```

**A behavior suite runs when you changed that behavior.** Not when you edited a file near it.
`scripts/project-state.test.js` takes twenty minutes and tests the state tool's zone judgments; run it
when you changed what those judgments are, and skip it when you changed prose. The same reasoning
picks `skills/**/*.test.mjs`, `git-state-transitions`, `project-knowledge`. **You judge which
applies — a change is "local" when nothing that any suite asserts could have moved.** If you cannot
tell, run it; if you skip it, say so in the report.

**A release runs everything once**, plus gate B below.

Ask first whether the run can tell you anything. A twenty-minute suite that asserts nothing your
change could have touched is not caution, it is the mechanical completeness §2 warns about. Measured
on the round that wrote this document: the full suite ran many times and caught **none** of the **4**
defects independent logic review found; the format wall fired only on shape drift.

### 6.2 The real wall — does the prose hold

**This is the gate. Answer in writing, one line each** — in the release commit message beside gate B's
raw evidence, or in the report for anything else. The CHANGELOG entry copies only the `unproven`
answer. Skipping a question is not allowed; answering "I do not know" is.

- **Entry.** An AI seeing this repository for the first time — can it find the purpose, where the work
  currently stands, and what to do next? Name where each one came from.
- **Coherence.** Do any two sentences you can now reach disagree? Read what you changed *against what
  routes to it*, not on its own.
- **Holes.** Where does a rule you touched not say what happens? A literal reader takes the gap, not
  the intent.
- **Use.** Walk the actual flow this serves, end to end, and say whether it holds — and what you ran
  to know that. If the answer rests on "the tests are green", you have not answered it.
- **`unproven`.** What did you not verify? Unexecuted behavior is never "passed".

### 6.3 What stays unconditional

Four gates never depend on judgment. **`docs/maintenance-protocol.md` §5 and §6 own how to run
them**; this is only the list, so that no session can claim not to have known:

- **Gate B before every release ships** — one capability through direct → work → verify → closure in
  a throwaway repository, hand-run, never automated.
- **A change touching `skills/**` renders the affected stage branches and roles before and after**,
  verbatim, into the release commit message — against a throwaway project, never this repository.
- **A change to how an AI enters this repository is compared cold, before and after.** Comprehension
  must not fall, and proposing a deletion before reading the affected source must total zero.
- **Name every created, deleted or moved path**, and confirm `git diff HEAD --name-only -- skills`
  is empty when `skills/**` was out of scope.
