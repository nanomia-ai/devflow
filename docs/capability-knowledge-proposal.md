# Capability Knowledge Baseline Proposal — Preserve the Task Tree and Long-Lived Expertise

## Document status

- Status: **candidate contract v2.2 — the original was revised by an independent
  verification and research campaign**
- One owner decision remains: the per-project `capability_baseline` default
  recommendation (section 10).
- Runtime wiring (skills, installers, integrity check) is the next release's work.
- This document is not a canonical rule. Until skills execute this contract, no skill
  executes this proposal.
- Purpose: validate whether the strengths of JGNote-style domain handoffs can combine
  with devflow's tree, cards, and multi mode, then leave an implementable candidate
  contract.

## Design lineage

The draft was a GPT proposal. Sixteen refutation findings were raised against it, three
research passes and measurements followed, and the synthesis then took two Fable
refutation passes (15 findings) and a re-audit (13 findings), all adjudicated and folded
in; the result is v2.2. Sections 4 through 7 carry the v2.2 contract and supersede the
original GPT contract (stable keys, digests, enrollment files, revision fields).
Sections 1 through 3 hold because their problem evidence and option analysis still stand.

## 1. Confirmed problem

Devflow's current records divide distinct responsibilities precisely.

| Record | What it governs | What it does not govern |
|---|---|---|
| `product.md` · `arch.md` · `design.md` | Product boundary and binding decisions | Work progress or a detailed implementation map |
| `devflow/project/decisions/` | Important long-lived choices and their reasons | A complete account of the current implementation |
| `tree/` task cards | Work boundary, dependencies, claims, completion state, and progress log | The current implementation of a whole capability |
| `HANDOFF.md` | The next session's starting point and open decisions | A permanent encyclopedia for a service domain |
| `journal.md` | Reserved events and short binding knowledge | Long explanations or code maps |
| Existing-record index | Location and standing of brownfield documents | Automatic reading instructions or freshness assurance |

This separation is strong for sequential MVP execution. When the same capability is
reopened repeatedly, however, the next reader cannot answer these questions without
reconstructing the result from several completed cards.

- What behavior does a user experience now?
- Where do frontend, API, and data layers meet, and what contract do they preserve?
- Which reproduced traps must not recur, and which verification procedures still work?
- Which conclusions from old cards still apply now?

JGNote's domain handoffs answered those four questions well. They also accumulated a
current summary, past changes, and retired descriptions in the same file. Local “newer”
declarations came to override earlier sections. Reading cost, freshness judgment, and
concurrent-edit conflicts therefore increase over a long horizon.

## 2. The two axes to combine

The candidate design does not merge state and knowledge.

| Axis | Question | Sole authority |
|---|---|---|
| Execution axis | Who is doing what, why, and in which order? | `tree/`, task cards, and `users/` claims |
| Knowledge axis | How did this capability work at its last verification closure? | Proposed capability knowledge baseline |

The conceptual model of current progress is `baseline + current cards absent from the
baseline's Covered cards`. Covered cards is an array of the non-`.stale.` `.done.`
task-card numbers summarized by the baseline, stored in canonical card-number order (for
example, `["02.2","02.2b","02.10"]`). Every current pending, claimed, or done card absent
from that array and not `.stale.` is a post-baseline change. This does not tell work to
read every change card automatically. work keeps its existing read set; at final
capability closure, verify reads the standard refresh set once and replaces the baseline
wholesale. An existing-record index becomes such an input only after split rechecks it
against the current change scope and puts it in a card's `Read first`. A baseline file
copies no current card status, progress, assignee, or next work; Covered cards records
only past inclusion. Capability expertise therefore does not replace task splitting or
team claims.

## 3. Options examined

| Option | Structure | Benefit | Failure path | Judgment |
|---|---|---|---|---|
| A. Keep v0.9.21 only | Use the existing-record index and cards | No added cost | Reconstruct the current implementation from many cards during repeated refinement | Sufficient for small linear projects |
| B. Update one shared handoff from every card | Every card edits one file per capability | Always recent | Parallel cards in one capability collide, and unverified intermediate state becomes the baseline | Rejected |
| C. Store one knowledge fragment per card | Synthesize card fragments later | Parallel writes are safe | Creates a second tree; before synthesis, readers must open every fragment | Rejected |
| D. Store a verification-closure baseline | Replace one file wholesale at the capability verification boundary; separately read current cards outside Covered cards | One writer boundary, bounded reads, verified state only | Baseline refresh is delayed while a capability remains open | **Recommended candidate** |

## 4. Exact meaning of the recommended candidate

The provisional term is **capability knowledge baseline**. Before becoming a runtime
term, it must first enter the terminology table in AGENTS.md.

- Its unit is a vertical product capability. When a user action such as customer
  management spans a screen, API, and data layer, one file covers all three.
- Frontend and backend are not split by default. An `arch.md` component alone does not
  get a separate file. A separately deployed and independently owned component gets a
  file only when product.md also defines it as a separate capability.
- This candidate creates no separate baseline per `arch.md` component. Devflow has no
  independent component-level verification closure, so it cannot determine which
  capability closure settles a component shared by several capabilities. `arch.md`, ADRs
  to which it delegates authority, and current code own shared backend or platform
  knowledge. Each capability baseline records only the contract affecting that capability
  and the exact shared paths. A separate component baseline is a later design to consider
  after an independent verification boundary exists, not an ad hoc exception that splits
  frontend and backend files.
- The file explains this capability at its last verification closure. Current cards
  outside Covered cards hold every later change, and neither in-progress attempts nor
  unverified guesses enter the baseline.
- While a capability remains open for a long time, its baseline stays at the last
  closure. Until the next closure, current code and cards are authoritative; never
  fabricate freshness by appending to the baseline from every card.
- The baseline is not canonical. Code, a binding ADR, and canonical documents win a
  conflict with it, and the hypothesis-demotion rules are never relaxed.
- Git and `.done.` or `.stale.` cards retain history. The baseline has no chronology
  section.
- `devflow/project/decisions/` continues to own the reasons for important choices. The
  baseline may point to those paths but does not copy their reasoning.

The file path and identity are as follows.

```text
devflow/project/capabilities/NN-<capability-name-slug>.md
```

- **NN is the number of that capability's tree folder at this closure.** Closure presumes
  the depth-1 folder exists, so the number is always present on disk. The reason once
  used to reject tree numbers — “a brownfield has no number before it has a tree
  representation” — does not hold, because a baseline is created only at closure.
- Derive the number of a capability not yet assigned one on disk from its position in the
  product.md capability list (the first capability is 02, and a retired row keeps its
  place and counts). **Once a folder, a pending file, or a baseline already holds a
  number, disk is the sole authority.** A capability added to product.md later takes the
  next unused number, and numbers are never reused. This convention presumes one sentence
  of obligation on the product.md side: the capability list is append-only — a retired
  row keeps its place, rows are never deleted or reordered, and additions go at the end
  of the list.
- The name slug carries no authority. It may be updated on a rename, and a mismatch is
  not an anomaly. Judgment uses the number only.
- There are exactly two format anomalies: a file whose number cannot be parsed, and two
  files for one capability. The whole stable-key scheme is deleted.

The design avoids a name such as `knowledge/`, which has no content boundary and can turn
into a free-form dump. It also avoids `domain/` as the default because that word would
merge a product capability with a backend domain.

## 5. Candidate document contract

Form governs content: topology is a diagram, a record set is a table, and intent is
prose. Each file has only these 12 sections, in this order.

| # | Section | Form | Cap |
|---|---|---|---|
| 1 | H1 and a one-line purpose | Prose | 2 lines |
| 2 | Conceptual model | Table: concept / what the user gets / identifier / relation | 8 rows |
| 3 | Main flow | mermaid flowchart LR | 9 nodes |
| 4 | Lifecycle | mermaid stateDiagram-v2 — only when illegal transitions exist | 8 states |
| 5 | Current behavior | Table: action / precondition / what the user sees / entrypoint | 10 rows |
| 6 | Invariants | Numbered list, verifiable statements | 8 items |
| 7 | What we decided not to do | Bullets: item — one clause of reason | 5 items |
| 8 | Entrypoints | Table: path / role / where it is entered (the number, for an external capability) | 12 rows |
| 9 | Traps | Table: symptom / reproduction condition / cause / what to do instead, marking an external-system trap `external` | 10 rows |
| 10 | Verify | The list of commands actually run at this closure, as run (scenario prose allowed for a browser channel) | 8 steps |
| 11 | Binding ADRs | Only paths that exist below `devflow/project/decisions/`, and only those the current narrative cites | 5 lines |
| 12 | Machine block (at the very end) | key: value — section 7 | ~8 lines |

- The total cap is ~140 lines, and the first 40 lines are the domain itself. Restate no
  contract body; keep only locations and invariants. Leave out anything self-evident.
- A write over the cap still succeeds. It leaves one repair-needed line in the closure
  report instead. **The “twice in a row” judgment asks whether the existing file being
  replaced already exceeded the cap in the same section** — it is read straight from
  disk, so no counter is needed, and an absent predecessor file means no. When it fires,
  report the possibility of splitting the capability and let the user decide; an adopted
  split takes the existing maintenance routing path.
- **Rows marked `external` in the Traps section are excluded from the cap count.**
  Accumulating external-system traps is intended preservation, so only non-external rows
  count toward the cap and the split signal; when external rows overflow, only report a
  request for a human deletion pass.
- Write exactly `None.` in a section with no verified content. Invent nothing without
  evidence.
- Links between domains live in the “where it is entered” column of the Entrypoints table
  and in the external-capability nodes of the flow diagram. No separate section.
- Existing brownfield records arrive through arch.md `Existing records` (unchanged).

## 6. Candidate lifecycle

- **A one-line arch.md switch**: `capability_baseline: yes | no`. **Absent means no** (the
  existing absence-detection pattern, unchanged). In a project set to yes, every
  capability's final closure refreshes its baseline. Creation and refresh share one name,
  “refresh”; the first refresh is the creation.
- A flip is a binding decision routed through the arch row of the discovery→update table.
  no→yes starts producing baselines at the next closure, and a capability that is never
  reopened and closed again never gets one. yes→no deletes no file. **When the switch is
  no, an existing file is caught by no wiring, no integrity-check item, and no resume
  listing.** An inactive file is not an anomaly. The gate is stated in one place, the
  wiring predicate: it catches a capability only when the switch is yes and the file
  exists.
- **Riding the begin commit**: the begin commit carries the passing verify.md, the
  capability-closing marker, and the closing capability's baseline file together.
- The “designated state” of the canonical verification-state transition is verify.md plus
  the marker, and **the one exact baseline path of the closing capability may be absent,
  partial, or hold arbitrary bytes.** Regenerate it from the standard refresh set
  (including the HEAD-baseline input rule — partial working-tree bytes are never an
  input) before completing the begin commit. This is the wording of the
  transition-recognition rule itself, not a permitted exception. Any other diff under
  `capabilities/` is still an anomaly. The canonical prefix concept belongs to
  product-result and prepared-route only, so this wording never uses the word “prefix”.
- verify step 7's “only passing verify.md and the marker” · “those two files” · “leaves
  the pass and marker only in the working tree”, and principles' “together with the
  passing verify.md record” — **add the baseline to all four exclusivity phrasings** (the
  last one in the sense of “pass, marker, and any bytes at the closing capability's
  baseline path”).
- Step 8's three operations (verify.md sweep → journal → folder rename) are unchanged. The
  baseline has already landed by then.
- In multi mode, the baseline of a begin that is not yet shared is machine-local, so it
  needs no regeneration rule; the existing pass-reuse condition governs tip advance
  unchanged. Closure and the Scope head calculation happen on the integration branch
  after a fetch, so a stored head always remains an ancestor. The reading cost of another
  capability's baseline diff is accepted.
- **Durability — shape tolerance**: a file with a different section or field set is a
  hypothesis, and the next closure heals it. No version field.
- **Durability — the knowledge layer never blocks the execution axis**: a baseline failure
  is a report plus a no-op, and closure proceeds. One line in the closure report is
  mandatory: “baseline no-op: <reason>”.
- **Durability — the deletion predicate**: delete a trap or a Verify item only when its
  reproduction condition has vanished from current code. A trap marked `external` is
  deleted only by a human.
- **Durability — human edits may only delete** (in a binding-decision commit). No detector
  is added. The next closure's wholesale replacement erases human-added narrative, so
  exposure is bounded to one cycle.
- **Wiring — split**: put the baseline path and the existing paths from the Binding ADRs
  section in `Read first` on a new implementation card for a capability whose switch is
  yes and whose baseline exists. The integrity-check predicate reads: it is an anomaly
  when a pending or claimed implementation card below a capability whose switch is yes
  and whose baseline file exists lacks that baseline's exact path in `Read first`
  (research cards excluded).
- **Wiring — resume and work**: resume reads only the list of filenames under
  `capabilities/` in step 1 (never the contents). work reports one line on entry
  (“baseline <Verified at>, covers N, cards since M”).
- **Wiring — the full machine contract** lives in
  `skills/principles/baseline-predicates.md` and is embedded in verify and resume. The
  principles body grows by one ownership sentence, the begin-ride wording change, and one
  brownfield sentence in the number convention. verify grows by 3 to 4 sentences, work by
  one paragraph, and product by one append-only obligation sentence.
- **Wiring — the terminology table** gains two rows: capability knowledge baseline, and
  hypothesis (the trust state of a baseline, a separate concept from the unverified
  verdict).

## 7. Candidate freshness and conflict rules

The machine block at the very end of a baseline has six fields, all `key: value`.

```text
Capability number: 02
Verified at: <YYYY-MM-DDTHH:MM:SSZ>
Covered cards: ["02.1","02.2","02.2b"]
Scope paths: ["src/customer/...", ...]
Scope head: <output of git log -1 --format=%H -- <one :(literal) pathspec per Scope paths member>>
Docs head: <output of git log -1 --format=%H -- devflow/project/product.md devflow/project/arch.md devflow/project/code-style.md devflow/project/glossary.md devflow/project/design.md>
```

- Capability number is section 4's number, and Verified at is an explicit declaration for
  humans. Covered cards holds every non-`.stale.` `.done.` card number below that
  capability folder at closure, stored and compared in canonical card-number order (which
  blocks the false mismatches of an order-sensitive comparison).
- Scope paths is the exact path list that verify step 5 produced for this closure. Its
  meaning is step 5's unchanged, and a folder is allowed when arch.md maps that folder
  exactly.
- **Pass every Scope paths member as a `:(literal)` pathspec** (blocking filenames that
  contain glob characters). **Pass each pathspec to the shell as one quoted argument** —
  parentheses are metacharacters in both POSIX shells and PowerShell.
- The five paths of Docs head are fixed. When design.md does not exist, that path
  contributes nothing, which keeps the computation deterministic and blocks false
  freshness for design.md.
- **Scope head and Docs head must parse as complete Git object IDs.** Empty output or a
  malformed value makes that group of statements a hypothesis (not a format anomaly —
  this blocks silent false freshness).
- The GPT contract's four revision fields are out of the machine block; the verify Record
  already holds the verification lineage. The NUL pipe, the byte-span procedure, the
  comparison digests, and the historical-stale classification are deleted with them.

The consumption paragraph work reads is self-contained and carries both commands in its
own text.

> The baseline is this capability at its last verification closure. When
> `git log -1 --format=%H -- <one :(literal) pathspec per Scope paths member>` equals
> `Scope head`, the code statements are fresh; when it differs or the output is empty,
> the code statements are a hypothesis. When `git log -1 --format=%H --
> devflow/project/product.md devflow/project/arch.md devflow/project/code-style.md
> devflow/project/glossary.md devflow/project/design.md` differs from `Docs head` or its
> output is empty, the product and document statements are a hypothesis (pass each
> pathspec of the command as a quoted argument). Enumerate the non-`.stale.` `.done.`
> card numbers below this capability folder from names alone in canonical card-number
> order; when that differs from `Covered cards`, the whole baseline is a hypothesis.
> Before using a hypothesis statement in implementation, recheck it at a current
> authority path inside the existing read set and code-search boundary. Do not expand
> those boundaries.

- The refresh at closure compares nothing: read the **standard refresh set** once and
  replace the file wholesale. baseline-predicates enumerates that set: the existing
  baseline (when present — absent at a first closure; always the **baseline at HEAD**,
  and working-tree bytes are never an input), product.md, arch.md, code-style.md,
  glossary.md, journal.md (plus design.md when it exists), the step-5 scope, the paths in
  the Binding ADRs section, and the current non-`.stale.` `.done.` cards outside Covered
  cards together with those cards' direct `Depends` and `Read first` paths.
- **Byte stability is a writing instruction, not a predicate**: “narrative the refresh
  re-derived identically keeps its previous bytes. Rephrasing an unchanged fact is a
  defect.” “Previous bytes” here means **the bytes of the baseline at HEAD**, not partial
  working-tree write bytes. Because of this rule, diff review and `git log -L` lineage
  come as by-products, so no separate lineage field is added.
- Code wins when the baseline conflicts with code. When a binding decision conflicts, the
  canonical Document Hierarchy applies unchanged. An ADR in the Binding ADRs section
  overrides a binding decision only within the scope that a canonical document explicitly
  delegates to that exact path.
- A conclusion from a `.stale.` card cannot support the current baseline. Retain only
  content reconfirmed from the full `capability code scope` that step 5 produced.
- Derive capability retirement from current product.md and tree state. Neither edit nor
  rename the baseline file.
- Four accepted limits are on record: a shallow clone (the boundary commit moves, giving
  conservative false staleness), the command-line limit for a very long scope list,
  invisibility of an uncommitted working tree (the same property as the GPT Code
  revision), and the residual false-freshness class where another capability's card
  changes this domain's behavior through a registry. Symbol binding and tooling under
  `scripts/` are named promotion paths.

## 8. Parallel-work simulations

| Scenario | Execution axis | Knowledge axis | Result |
|---|---|---|---|
| Build a new MVP once | Cards hold the whole flow | With the switch at no there is no baseline; with yes one first appears at the first closure | Same low cost as option A |
| Repeatedly refine one capability by viewing the UI | Reopened cards hold the delta | split puts the baseline in `Read first`, work judges only freshness with the two commands, and verify replaces the file wholesale at closure | No reread of the whole past on every task |
| Keep a capability open for a long time | Pending, claimed, and done cards hold current state | The baseline stays at the last closure, and the whole file becomes a hypothesis when current done numbers differ from Covered cards | Never fabricate freshness; delay compressed refresh until the next closure |
| Two users perform different cards in one capability | Each keeps its claim and dependencies | Both read the baseline; neither edits it mid-task | The knowledge file does not serialize work |
| One card changes UI while another changes API | The tree decides order or parallelism | One file shares the vertical contract | Avoids layer-specific knowledge fragmentation |
| Several capabilities consume a shared contract | Each capability card owns the real change | Only a baseline carrying that shared path in Scope paths moves its Scope head | Refresh only affected baselines at their next closure |
| A brownfield has existing handoffs | Create cards only for post-adoption work | Only documents split rechecked against the current change from arch.md `Existing records` and put in card `Read first` become first-baseline inputs | No retroactive task cards |
| Only unrelated code changes after the baseline | Card state is unchanged | A change outside Scope paths does not move Scope head | No needless demotion to hypothesis |
| Code inside the baseline scope changes directly | A change card or out-of-flow change exists | Scope head differs, making the code statements a hypothesis | Do not use stale prose as settled fact |
| A capability retires | The tree preserves `.stale.` and retired state | The capability number preserves the last-baseline link | Keep knowledge as history instead of deleting it |

## 9. Coordinate sweep

| Axis | Defined | Not applicable | Remaining choice |
|---|---|---|---|
| Project kind: greenfield · brownfield | Candidate flow exists for both | None | Default recommendation |
| Work shape: linear · repeated · parallel | All three stay separate from the execution axis | None | Default recommendation |
| Implementation surface: frontend · backend · vertical | Vertical capability is the default | No layer-specific file unless it is an independent capability | None |
| Shared structure: capability-local · shared component · independent capability | Local paths stay in that baseline; shared paths contribute only the affecting contract; an independent product capability has its own baseline | No component baseline without an independent verification boundary | None |
| Record state: pending · claimed · done · stale · retired | Each has a consumption rule | Stale is excluded as evidence | None |
| Switch: absent · no · yes · no→yes · yes→no | Absent equals no, a flip is a binding decision, an inactive file is not an anomaly | None | Default recommendation |
| Baseline file: absent · present · unparsable number · two files per capability | Refresh, refresh, format anomaly, format anomaly | None | None |
| Closure timing: first closure · reopened · long-open | First refresh is the creation, later ones replace wholesale, an unclosed capability stays a hypothesis | No unverified intermediate refresh | None |
| head-field state: equal · different · empty output · malformed | Fresh, hypothesis, hypothesis, hypothesis | None | None |
| Consumer: split · work · verify · resume · role contracts | All four skills are wiring targets | Role contracts do not automatically read baselines | None |

## 10. Owner choices before adoption

One choice remains.

- **The `capability_baseline` default recommendation** — yes for a large service, no for a
  small MVP. The value differs per project and is collected by one arch interview
  question. Settling this recommendation's wording is all that stands before wiring.

The two earlier choices dissolved as the design changed. The stable-key owner vanished
when identity became the capability number. The reason once used to reject tree numbers —
“a brownfield has no number before it has a tree representation” — was refuted by the fact
that a baseline is created only at closure, and a number not yet assigned is derived from
the product.md list position. Retirement preservation vanished with the adoption of
deriving retirement from current product.md and tree state, because that needs neither a
`.retired.` rename nor the pointer-migration rule attached to it. Enrollment policy shrank
from a choice to a default recommendation. The one-line arch.md switch replaced the
enrollment file and all three policies.

The rejection lineage stays on record too: time decay, continuous refresh (different
concurrency, sharing, and trust properties), append-only inheritance (history is an ADR's
payload, but the present is a baseline's payload), Assumptions and Open Questions
sections, a consumer-list section, an index file, automatic glob attachment, staging
consumption, symbol binding and tooling (held as promotion paths), and a separate lineage
field (replaced by the observational by-product of byte stability).

## Conclusion

The need for a domain-expertise layer is confirmed. Merging task units into domain units
is rejected. The recommendation combines **the baseline of the last verification closure +
current task cards outside Covered cards**, while the tree, cards, and `users/` claims
remain the execution authority.

v2.2 deleted the original's digests, stable keys, enrollment files, and revision fields,
shrinking the contract to a capability number, six machine-block fields, two commands, and
a one-line arch.md switch. The price is accepting conservative false staleness on shallow
clones and uncommitted working trees. One owner choice remains, the `capability_baseline`
default recommendation, and runtime wiring is the next release's work. Until skills
execute this contract, this document is not a canonical rule.
