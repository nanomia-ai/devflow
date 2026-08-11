# Capability Knowledge Baseline Proposal — Preserve the Task Tree and Long-Lived Expertise

## Document status

- Status: **candidate contract complete, awaiting runtime-adoption decisions**
- Target: candidate after v0.9.21
- This document is not a canonical rule. No skill may execute this proposal until the
  owner settles the choices below.
- Purpose: validate whether the strengths of JGNote-style domain handoffs can combine
  with devflow's tree, cards, and multi mode, then leave an implementable candidate
  contract.

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
| Knowledge axis | How did this capability work at the last verification whose baseline refresh succeeded? | Proposed capability knowledge baseline |

The conceptual model of current progress is `baseline + current cards absent from the baseline's Covered
cards`. Covered cards is a JSON string array of the non-`.stale.` `.done.` task-card numbers
summarized by the baseline, sorted in canonical card-number order (for example,
`["02.2","02.2b","02.10"]`). Every current pending, claimed, or done card absent from that
array and not `.stale.` is a post-baseline change. This does not tell work to read every
change card automatically. work keeps its existing read set; at an eligible final capability
closure, verify reads the current non-`.stale.` `.done.` cards and their inputs once to create
the baseline. An existing-record index becomes such an input only after split rechecks it
against the current change scope and puts it in a card's `Read first`. A
baseline file copies no current card status, progress, assignee, or next work; Covered cards
records only past inclusion. Capability expertise therefore does not replace task splitting
or team claims.

## 3. Options examined

| Option | Structure | Benefit | Failure path | Judgment |
|---|---|---|---|---|
| A. Keep v0.9.21 only | Use the existing-record index and cards | No added cost | Reconstruct the current implementation from many cards during repeated refinement | Sufficient for small linear projects |
| B. Update one shared handoff from every card | Every card edits one file per capability | Always recent | Parallel cards in one capability collide, and unverified intermediate state becomes the baseline | Rejected |
| C. Store one knowledge fragment per card | Synthesize card fragments later | Parallel writes are safe | Creates a second tree; before synthesis, readers must open every fragment | Rejected |
| D. Store a verification-closure baseline | Refresh one file at the capability verification boundary; separately read current cards outside Covered cards | One writer boundary, bounded reads, verified state only | Baseline refresh is delayed while a capability remains open | **Recommended candidate** |

## 4. Exact meaning of the recommended candidate

The provisional term is **capability knowledge baseline**. Before becoming a runtime
term, it must first enter the terminology table in AGENTS.md.

- Its unit is a vertical product capability. When a user action such as customer
  management spans a screen, API, and data layer, one file covers all three.
- Frontend and backend are not split by default. An `arch.md` component alone does not get a
  separate file. A separately deployed and independently owned component gets a file only
  when product.md also defines it as a separate capability with its own stable key.
- This candidate creates no separate baseline per `arch.md` component. Devflow has no
  independent component-level verification closure, so it cannot determine which
  capability closure settles a component shared by several capabilities. `arch.md`, ADRs
  to which it delegates authority, and current code own shared backend or platform
  knowledge. Each capability baseline records only the contract affecting that capability
  and the exact shared paths. A separate component baseline is a later design to consider
  after an independent verification boundary exists, not an ad hoc exception that splits
  frontend and backend files.
- The file explains the most recent passing implementation whose baseline refresh also
  succeeded. When a later pass was not captured because an input was unresolved, read the
  existing file only as a hypothesis. It excludes in-progress attempts and unverified hypotheses.
- While a capability remains open for a long time, its baseline stays at the last
  successfully captured closure. Current cards outside Covered cards are subsequent delta,
  not a verified current summary. Until the next closure, current code and cards are
  authoritative; never fabricate freshness by appending to the baseline from every card.
- Git and `.done.` or `.stale.` cards retain history. The baseline has no chronology
  section.
- `devflow/project/decisions/` continues to own the reasons for important choices. The baseline may point
  to those paths but does not copy their reasoning.

The proposed path is:

```text
devflow/project/capabilities/<stable-capability-key>.md
```

Whichever owner is selected, a stable key matches `[a-z0-9]+(?:-[a-z0-9]+)*` and is unique
within the product. No fixed length limit is selected. This grammar avoids case, Unicode-
normalization, and path-separator differences; the actual filesystem's filename limit still
applies. The key never changes after first use in an enrollment file or baseline and is never
reused after capability retirement.

The design avoids a name such as `knowledge/`, which has no content boundary and can turn
into a free-form dump. It also avoids `domain/` as the default because that word would
merge a product capability with a backend domain.

## 5. Candidate document contract

Each file has only these sections.

| Section | Contains | Excludes |
|---|---|---|
| Identity | Product capability row, immutable product capability number, stable key, and ownership boundary | Work assignee |
| Baseline | Product, Verification, Code, and Capability revisions; capability product digest; capability code digest; capability input digest; verification time; Covered cards | Relative claims such as “latest” |
| Code scope | Repository-relative entrypoints and shared-contract paths | An entire “related” folder |
| Current behavior | Current user-observable behavior | Planned features |
| Cross-surface contracts | Inputs, outputs, and invariants across UI, API, and data | Full ADR reasoning |
| Operational traps | Reproduced traps, break conditions, and why avoidance matters | Universal development knowledge |
| Verify | Still-executable primary, hostile-input, and regression procedures | An accumulating list of past passes |
| Pointers | Exact repository-path array for binding ADRs, exact HTTPS-URL array for external evidence, and exact repository-path array for existing records | Unbounded “related documents” links |

A refresh never appends a new account after an existing section. Replace the Identity and
Baseline fields and every section from Code scope through Verify from current evidence;
delete statements that no longer have support. Code scope, Current behavior, and Verify
cannot be empty for an implemented capability. When no Cross-surface contracts or
Operational traps have been verified, invent none and write exactly `None.` in that
section. A Pointers array with no values is `[]`. This replacement rule prevents a return
to chronological growth or internal precedence such as “the lower section is newer.” When
current evidence cannot support a section that may not be empty, invent no content and
create no baseline operation.

The following is the sole candidate contract for machine-judged fields and section order.
Write each field on exactly one line, once, in the shown order; parse `-json` values and
Covered cards as JSON. Replace angle-bracket placeholders with actual values. Code scope
through Verify are Markdown bounded by the table above; Pointers contains only its three shown
fields.

```markdown
# Capability baseline

## Identity
Product-capability-row-json: <JSON string containing the exact current product.md capability row without line-ending bytes>
Product-capability-number-json: <JSON string containing the exact immutable capability-number token from product.md>
Stable key: <stable-key>
Ownership-boundary-json: <JSON string describing the capability boundary>

## Baseline
Product revision: <Product revision>
Capability product digest: <capability product digest>
Verification revision: <Verification revision>
Code revision: <Code revision>
Capability revision: <Capability revision>
Capability code digest: <capability code digest>
Capability input digest: <capability input digest>
Verified at: <YYYY-MM-DDTHH:MM:SSZ>
Covered cards: <JSON string array>

## Code scope
<bounded prose and exact repository-relative paths>

## Current behavior
<verified current behavior>

## Cross-surface contracts
<verified UI, API, and data contracts>

## Operational traps
<reproduced traps>

## Verify
<executable verification procedures>

## Pointers
Binding-adrs-json: <JSON string array of exact repository-relative paths to binding ADRs>
External-references-json: <JSON string array of exact absolute HTTPS URLs for external evidence>
Existing-records-json: <JSON string array of exact repository-relative paths to existing records>
```

All three Pointers arrays are duplicate-free JSON string arrays, and array order has no
meaning. Put no repository path in both Binding-adrs-json and Existing-records-json.
Binding-adrs-json contains only current ADRs below `devflow/project/decisions/` to which a
canonical document delegates authority, and it is a freshness input for every future card.
External-references-json contains only absolute `https://` URLs and is nonbinding evidence.
work neither opens it automatically nor lets it override a binding decision. To bind an
external rule, first record the needed current interpretation and source URL in an ADR.
Existing-records-json is not canonical and becomes an input only on a card where it still
matches the current change scope. No array contains explanatory prose or a “related” range.

The capability product digest starts from the committed blob bytes returned by
`git cat-file blob HEAD:devflow/project/product.md`. There must be exactly one
`## Capabilities` H2 heading. A capability row's number token is the first non-whitespace
token of a row inside that section. Select exactly one current non-retired row inside that
section whose whole token is byte-equal to the decoded Product-capability-number-json value.
Prefix matches do not count. Replace Product-capability-row-json with that whole row without
its line-ending bytes.

A line span runs from its first byte through its `LF` or `CRLF` line-ending bytes; a line at
EOF keeps the absence of a terminator. An H2-section span runs from the first byte of its
`## ` heading through the byte immediately before the next `## ` heading, or EOF. The identity
span runs from the byte after the H1 line ending through the byte immediately before
`## Problem`. Concatenate, in this order, `<bytes><NUL>` for the H1 line, identity span,
`## Problem` section, `## Approach` section, exact `## Capabilities` heading line, selected
capability-row line, `## Boundary` section, `## Success criteria` section,
`## Screens & access points` section, and exact `interface:` line. Hash the stream with
`git hash-object --stdin`. A missing or non-unique H1, target number token, row, required
section, interface line, or `## Capabilities` heading makes the value `unresolved` and forbids
baseline creation or refresh. Exclude Open questions and other capability rows.
Product revision remains verification-run evidence; this digest separates another capability
row's change from target-capability freshness.

The code map does not enumerate every file. It records only external entrypoints,
cross-layer contracts, and locations that repeatedly cost time to rediscover. Anything
immediately obvious from reading the code stays out.
The capability code digest uses the full `capability code scope` calculated by verify step
5's current-topology Standards rule, not this short human code map. Give those exact paths
to `git ls-tree -r -z --full-tree HEAD --` and hash its raw bytes by the Verification-
revision method in the canonical verification predicates. A scope that verify step 5 judges
`unresolved` forbids baseline creation or refresh.

The capability-input-digest function contains only the cards resolved by the supplied list
of Covered-card numbers and those cards' direct `Depends` inputs. Each Covered number must
resolve in the final closure tree to exactly one non-`.stale.` `.done.` task card with no
`.stale` ancestor folder. Each direct-dependency number must resolve to exactly one task
card. It may be a current card that is `.done.` with no `.stale` ancestor, or a preserved
**historical-stale dependency** because split does not rewrite a done card's historical
`Depends`. A historical-stale dependency is either itself `.stale.` or below any `.stale`
ancestor. It is only a freshness-hash input, not evidence for baseline narrative.
`Depends: none` is a valid empty dependency set and contributes no dependency items. It is
not `changed` or `unresolved` by itself. When several Covered cards share the same actual path as a
direct dependency, first take the set union of actual paths and use that path as one item. Then
remove only `.done` suffixes from folder components of each actual path and keep the task-
card filename unchanged. Two distinct actual paths that collapse to the same normalized
path are an integrity anomaly. Pair each normalized path with the committed blob object ID
held by its original actual path in the HEAD tree; never rehash the working-tree file. Keep
each path-hash pair intact, sort the items in canonical path order, concatenate each
`<normalized-path UTF-8 bytes><NUL><blob-hash ASCII><NUL>`, and hash the stream with
`git hash-object --stdin`.

The freshness **stored-Covered comparison digest** supplies the existing baseline's Covered
cards to that function. In a successfully enumerated current tree, zero matches for a stored
Covered number, or exactly one match that is not `.done.` or has a `.stale` ancestor, makes
the comparison result `changed`. Zero current-tree matches for any number named by a stored Covered card's direct dependency
also means `changed`. Two or more matches, a dependency state other than an allowed current
card or historical-stale dependency, parse failure, normalization collision between distinct actual
paths, or HEAD-blob lookup failure is an `unresolved` integrity anomaly. The final-refresh
**final replacement-Covered digest** supplies every current non-`.stale.` `.done.` card number below the target
capability, sorted in canonical card-number order. Store only that list and that digest
together in the baseline's Covered cards and Capability input digest. A number or direct
dependency that does not resolve to one card in an allowed state during the final replacement
calculation, or any integrity anomaly above, makes the value `unresolved` and forbids baseline
creation or refresh. A historical-stale dependency remains in the final digest, but
section 7 retains only narrative reconfirmed from section 5's full `capability code scope`.
This digest stays equal when only the closing or reopening status suffix on the
capability folder changes; it changes when a Covered card or its direct dependency changes
path or bytes. Capability revision remains evidence of the verification run and is never
used for baseline-freshness comparison.

For all three digests, send NUL-bearing inputs to `git hash-object --stdin` through a binary-
safe byte path without text decoding or newline conversion. Use a native binary pipe on
POSIX and never the PowerShell object pipeline on Windows. A temporary file or native process
must preserve every byte unchanged.

## 6. Candidate lifecycle

The following is a candidate implementation after the choices are settled. Current skills
do not execute it.

1. split routes a maintenance request for an already implemented capability and applies the
   selected creation-trigger rule to enroll that capability for a baseline. If the
   recommended trigger is selected and neither baseline nor enrollment file exists, the
   same planning commit creates `devflow/project/capabilities/<stable-key>.pending.md` with
   exactly this content. The enrollment file is not a baseline and is not a work Read-first
   input. In the same plan, split rechecks the target capability-name and `shared` rows in
   arch.md `Existing records` against the current change scope and puts only matching exact
   paths in the maintenance card's `Read first`. The index itself is not a read instruction.

   ```markdown
   # Capability baseline enrollment
   Product-capability-row-json: <JSON string containing the exact current product.md capability row without line-ending bytes>
   Product-capability-number-json: <JSON string containing the exact immutable capability-number token from product.md>
   Stable key: <stable-key>
   ```
2. When no baseline exists, do not create one before the final capability-closing boundary
   after the verifier and both closure gates pass. Do not change work's existing read set or
   code-search boundary, and do not add every past card.
3. When a baseline exists, split puts its exact path and every exact repository path in
   Binding-adrs-json in `Read first` on every new card for that capability. It adds an
   Existing-records-json path only when that exact path still matches the current change
   scope. work reads those inputs and its existing read set. If a binding ADR cannot be opened,
   treat the whole baseline as a hypothesis and do not use a statement for
   implementation until current canon or the user settles it again. Even when stored revisions
   match, a current binding ADR wins a conflict with the baseline. split and verify treat
   cards outside Covered cards as the delta; they are not an automatic work read list.
4. Multiple cards may proceed concurrently in one capability. They do not edit the
   baseline while in progress.
5. After both the verifier verdict and step-5 closure gates pass, handle the baseline in the
   begin commit of final capability closure. Refresh an existing file. Create a missing file
   only when the recommended policy's enrollment file exists or another selected policy makes
   that capability eligible. Otherwise create no baseline operation. Write the current four
   revisions, capability product digest, capability code digest, capability input digest, and
   verification time; replace Covered cards with every current non-`.stale.` `.done.` task-
   card number. Resolve exactly one current product capability row by whole-token equality
   with Product-capability-number-json, then replace Product-capability-row-json with that whole
   row without its line-ending bytes. A missing or duplicate number makes the input
    `unresolved`. On creation or refresh, verify reads section 7's standard refresh set once in
    this closure. Only a `changed` stored-Covered comparison result or a comparison digest that
    differs from the stored value adds the Covered-history extension. It then separately
    calculates the final replacement-Covered digest from the complete current card list and
    writes that list and digest together.

When verify step 5 cannot resolve the `capability code scope`, its existing Standards gate
records `unverified` and blocks closure, so this lifecycle is never reached. After both closure
gates pass, an `unresolved` baseline-only product or input digest does not block capability
closure. Preserve the baseline and enrollment file byte-for-byte, close
with no baseline operation, and retry at the next final capability closure. Until then, read
an existing baseline under section 7's hypothesis rules. Inability to execute the defined
binary-safe serialization or hash procedure is not an `unresolved` snapshot input. Apply the
failure ladder before the begin marker and never use that inability as a reason for `[]`.

Runtime adoption extends verify step 7's begin transaction. Add a
`baseline-operations: <JSON array>` field to the existing capability-closing marker. Array
members reuse the exact write and delete syntax, UTF-8 meaning, and path meaning from the
canonical Routing write order. `[]` means no baseline operation. In a nonempty array, the
first member is a write carrying the exact baseline path and its complete final UTF-8 content.
A second member may be a delete of the exact enrollment path only when the same transaction
creates a previously missing baseline and consumes that existing enrollment file. A delete-
backed create requires that second delete. A create write alone is allowed only under a
selected policy that does not use enrollment and when no enrollment file exists. A delete-
only array and a third member are invalid. A refresh deletes no enrollment file.

Before executing the marker array, the canonical marker-validity check must confirm all of
the following against the marker's `head` input snapshot. The marker capability and selected
number and stable-key policy resolve one exact baseline path and one exact enrollment path.
A baseline and enrollment file existing together is a blocking anomaly. For a nonempty array,
the write content follows section 5's document contract and section order; all four revisions
equal the passing Record; Product, Verification, and Capability revisions also equal the
marker; and Code revision is validated through the passing Record and current reuse check.
Its digests and Covered cards equal the final replacement values calculated before the marker
was written. At the marker `head`, the operation is create only when the baseline is absent
and refresh only when the baseline exists and the enrollment file is absent. An enrollment-
backed create must delete the one existing enrollment file consumed by that same create; a
create under a policy without enrollment has neither a delete nor an enrollment file.

`[]` is valid only when marker-head policy makes no baseline operation eligible, or when a
baseline-only product or input digest named in section 6 is
`unresolved` at that snapshot. The check deterministically recalculates that reason against
the same snapshot and preserves the baseline-and-enrollment path pair byte-for-byte. Any other
`[]` is a blocking anomaly that skips a required create or refresh. A failure in either branch
is a blocking anomaly; neither execute nor regenerate the payload.

Apply passing verify.md Record → journal capability-closing marker carrying the payload →
array write → the required delete for an enrollment-backed create. Never regenerate content after the marker exists. For an
uncommitted marker, HEAD must equal the marker's `head`. Apply the existing pass Record and
marker to that `head` tree, then each array member, and compare that expected tree byte-for-
byte with the whole current checkout, including staged, unstaged, and untracked paths. When
it equals exactly one prefix, apply only the remaining suffix and land everything in
`boundary — begin <capability number>`. An untracked baseline with the same final bytes counts
as a prefix through the write.

When the marker is already committed, do not compare the current checkout with that prefix.
Exactly one `boundary — begin <capability number>` commit must first contain the exact marker
line; its first parent must equal the marker's `head`, and its commit tree must byte-equal the
final tree after applying the pass Record → marker → complete array. After that passes, the
resolved baseline-and-enrollment path pair in the current HEAD tree and staged, unstaged, and
untracked checkout must byte-equal the exact post-state produced by applying the array to the
pair at marker `head`. `[]` preserves both paths byte-for-byte. A nonempty create or refresh
produces the payload bytes at the baseline path and an absent enrollment file. A descendant
or step-8 prefix that changes that post-state is a blocking anomaly. After this check, apply the existing revision
and outside-devflow-change reuse checks and proceed to step 8. The
marker and payload remain in that begin commit; existing verify step 8 removes the payload
when it deletes the marker. Add no baseline operation to that step's verify.md → journal.md →
folder-rename order.

In multi, if the integration tip advances beyond the marker `head` before the begin reaches
the integration branch, neither rebase nor push that begin unchanged. First prove that all
staged, unstaged, and untracked state is an exact prefix of this payload, then remove only the
bytes created by that transition and include the latest integration tip. When an unshared
begin commit exists, exclude only that commit and preserve the preceding task commits. At the
new tip, recalculate revisions, both gates, and the payload, then create a new begin with a new
`head`. Return the case to the user when inclusion of the latest tip or removal of only this
transition's bytes cannot be proven exactly.

When an interruption has written only the passing Record, no baseline output exists; compute
the payload once immediately before writing the marker. After the marker exists, only its
array is the byte authority. Serialize the array on one line with newlines JSON-escaped. The
complete baseline content remains once in the begin commit's journal blob. That history cost
is the cost of the smallest recovery design that does not lose the payload. Do not add a
separate prepared→applied state and content hash to avoid it.

The adoption commit must not add only this subordinate wording. Extend together the canonical
rules' capability-closing marker format, begin-operation list, prefix recovery, and project-
document ownership. During normal closure, only split creates enrollment files, and only
verify creates or refreshes baselines and consumes the enrollment file of that same create.
In the product-retirement binding transaction, put in the canonical rules the exception that
product owns deletion of an enrollment with no baseline and the selected `.retired.` rename.
verify step 7 produces and consumes the payload, resume routes the extended prefix as a
canonical transition, and the same commit changes the work and split consumption rules.
Under the recommended stable-key ownership, product writes and preserves the terminal
capability-row field during initial creation, a product re-run, and migration of an existing
document; split enrolls only after that field is settled. Create no exception that exists
only below the canonical rules.

The same adoption commit adds capability-baseline coordinates to the integrity check.
Outside a valid closing prefix, every direct file below `capabilities/` must resolve under
the selected policy to exactly one capability number and stable key; its filename and
internal Stable key must match; it must parse as exactly one baseline or enrollment format;
and every required section and field must occur exactly once. JSON fields must parse as the
shown kind, and Covered cards must be duplicate-free and in canonical card-number order.
More than one file for a capability number or stable key, or a baseline and enrollment file
together, is an integrity anomaly. A stored Product-capability-row-json that differs from
the current row, or a Covered number changed in the current tree, is a freshness judgment,
not a format anomaly. On a format anomaly, report it and neither supply the baseline as a
read input nor create a baseline operation; never auto-correct or guess a value.

Baseline creation and refresh occur only in the capability boundary commit. They do not
create a standalone knowledge commit or a per-card update.

## 7. Candidate freshness and conflict rules

When a rule below makes the baseline unsettled, work reads it only as a hypothesis and does
not expand its existing read set. Before using a hypothesis statement for implementation,
recheck it at an exact current authority path in work's existing read set or an exact current
path inside its existing code-search boundary. Expand neither boundary. Never make every work
invocation read all past cards or the full capability code scope.

Before reading narrative at the next final capability closure, verify calculates revisions
and digests. While calculating a capability input digest, it mechanically extracts only the
exact `Depends` field and hash inputs from Covered cards; it does not put the rest of those
cards into model context.

The **standard refresh set** is the existing baseline when present; current product.md,
arch.md, code-style.md, glossary.md, journal.md, and design.md when it exists; section 5's full
`capability code scope`; every exact repository path in baseline Binding-adrs-json;
and every current non-`.stale.` `.done.` target-capability card outside Covered cards, with
each card's direct `Depends` and existing exact `Read first` paths. With no baseline, every
current non-`.stale.` `.done.` card is outside Covered, so this set contains every first-
creation input.

Add the **Covered-history extension** only when the stored-Covered comparison result is
`changed` or its digest differs from the stored value. When each Covered-cards number has
zero or one current-tree match, read that one match when present and its direct `Depends` and
existing exact `Read first` paths. Open an existing record from Existing-records-json
only when its exact path equals a `Read first` path in the standard set or extension. Resolve
exactly one current product.md row inside the unique `## Capabilities` section whose whole
number token equals Product-capability-number-json. When that number or section is missing or
duplicated, do not create or refresh the baseline; report it. Two or more matches for one
Covered number are an integrity anomaly and stop the flow. Open no arbitrary decisions
directory or code, card, or document outside these two sets.

In work, a changed stored Product revision immediately makes product-related statements a
hypothesis; a changed Verification revision makes the whole baseline a hypothesis; and a
changed Code revision makes code-related statements a hypothesis. work does not recalculate
the digests below. It rechecks only statements it will use within its existing read and code-
search boundaries. The current card and its direct inputs win over the baseline. Before
these judgments, work enumerates only names and statuses for non-`.stale.` `.done.` card
numbers below the target capability in the current tree state defined by the canonical
rules. When that set differs from Covered cards, treat the whole baseline as a hypothesis.
Open no card body and recalculate no digest for this comparison. The four recalculation
items below belong only to verify at final closure.

- When Product revision differs, verify recalculates the capability product digest. Continue using
  product-related baseline statements when it equals the stored value. An `unresolved` or
  different value applies the standard refresh set to the whole baseline.
- When Verification revision differs, verify applies the standard refresh set to the whole baseline.
- When Code revision differs, verify recalculates the full current `capability code scope` and its
  digest. Continue using code-related baseline statements only when the digest matches. An
  unresolved scope or a different digest applies the standard refresh set.
- verify calculates the stored-Covered comparison digest from the existing baseline's Covered
  cards. When it equals the stored value, the standard refresh set reads current target-
  capability cards outside Covered cards as the delta. A `changed` result or different digest
  adds the Covered-history extension. An `unresolved` integrity anomaly creates no baseline
  operation. After revalidating the narrative, verify separately calculates the final
  replacement-Covered digest from the complete current card list; an `unresolved` result
  creates no baseline operation.
- Code wins when the baseline conflicts with code. When a binding decision conflicts, the
  canonical Document Hierarchy applies unchanged. An ADR in Binding-adrs-json overrides a
  binding decision only within the scope that a canonical document explicitly delegates to
  that exact path. External-references-json is evidence and never overrides a binding decision.
- A conclusion from a `.stale.` card cannot support the current baseline. Retain only
  statements reconfirmed from section 5's full `capability code scope`.
- Derive capability retirement from current product.md and tree state. Under the recommended
  preservation choice, neither edit nor rename the baseline file. Only if the `.retired.`
  filename alternative is selected, rename the baseline in the product-retirement binding-
  decision commit; this is the sole baseline change outside a capability-closing boundary.
  When no baseline exists but an enrollment file does, delete that enrollment file in the
  same retirement commit.

A changed Product revision makes work read product-related statements as hypotheses until
verify checks the target-row digest at the next final closure, even when only another
capability row changed. Verification revision combines all of arch.md, code-style.md, and
glossary.md, so a change only to another capability conservatively leaves the whole baseline
a hypothesis until the next closure. Code revision also names the latest commit that changed
anything outside devflow across the whole project, so an unrelated code change makes work
treat code-related statements as hypotheses until the next final closure. At that point,
verify avoids a full refresh when the capability code digest still matches. This candidate
adds no per-capability verification or code revision. Instead, it avoids a full reread on every work invocation, uses the standard refresh
set once at final closure, and adds the Covered-history extension only when the stored-
Covered comparison changed.

## 8. Parallel-work simulations

| Scenario | Execution axis | Knowledge axis | Result |
|---|---|---|---|
| Build a new MVP once | Cards hold the whole flow | No baseline, or create one only at first closure | Same low cost as option A |
| Repeatedly refine one capability by viewing the UI | Reopened cards hold the delta | split identifies numbers outside Covered cards as delta; work reads only exact inputs selected through Depends and Read first; verify compresses the complete delta at closure | No reread of the whole past on every task |
| Keep a capability open for a long time | Pending, claimed, and done cards hold current state | The baseline stays at the last successful closure and becomes a hypothesis when Covered cards differ from current done numbers | Never fabricate freshness; delay compressed refresh until the next closure |
| Two users perform different cards in one capability | Each keeps its claim and dependencies | Both read the baseline; neither edits it mid-task | The knowledge file does not serialize work |
| One card changes UI while another changes API | The tree decides order or parallelism | One file shares the vertical contract | Avoids layer-specific knowledge fragmentation |
| Several capabilities consume a shared contract | Each capability card owns the real change | Each baseline points to exact shared paths | Refresh only affected baselines at their next verification |
| A brownfield has existing handoffs | Create cards only for post-adoption work | split rechecks the index against the current change, puts only matching documents in card `Read first`, and the first baseline rechecks them against section 5's full `capability code scope` | No retroactive task cards |
| Only unrelated code changes after the baseline | Card state is unchanged | Capability code digest remains equal | No unnecessary full refresh |
| Code inside the baseline scope changes directly | A change card or out-of-flow change exists | Treat the baseline as mismatched | Do not use stale prose as settled fact |
| A capability retires | The tree preserves `.stale.` and retired state | The stable key preserves the last-baseline link | Keep knowledge as history instead of deleting it |

## 9. Coordinate sweep

| Axis | Defined | Not applicable | Remaining choice |
|---|---|---|---|
| Project kind: greenfield · brownfield | Candidate flow exists for both | None | Enrollment policy |
| Work shape: linear · repeated · parallel | All three stay separate from the execution axis | None | Enrollment policy |
| Implementation surface: frontend · backend · vertical | Vertical capability is the default | No layer-specific file unless it is an independent capability | Where the stable key lives |
| Shared structure: capability-local · shared component · independent capability | Local paths stay in that baseline; shared paths contribute only the affecting contract; an independent product capability has its own baseline | No component baseline without an independent verification boundary | None |
| Record state: pending · claimed · done · stale · retired | Each has a consumption rule | Stale is excluded as evidence | Retired-file naming policy |
| Baseline file: absent · enrollment only · baseline only · both · malformed | No policy operation, create, refresh, anomaly outside a valid closing prefix, or format anomaly | None | Enrollment policy |
| Closure timing: first closure · reopened · long-open | Create after selected enrollment, refresh, or retain as hypothesis | No unverified intermediate refresh | None |
| Dependency: none · current done · historical stale · missing · duplicate | Empty set, current hash, hash only, changed or unresolved, or unresolved | Historical stale is not narrative evidence | None |
| Freshness: equal · unrelated change · scoped change · uncommitted | Capability product digest, canonical capability code scope, digest, and Covered cards decide it | None | None |
| Consumer: split · work · verify · resume · role contracts | Only split, work, and verify are candidate consumers | resume and review or verification roles do not automatically read all baselines | None |

## 10. Owner choices before adoption

These three choices change the outcome and cost, so this proposal does not settle them
automatically.

1. **Enrollment policy** — select one of three policies. All three use section 6's same
   `.pending.md` as disk evidence and never enroll from conversation alone. Recommended:
   split enrolls an already implemented capability in the approved planning commit that
   creates its first maintenance card, then creates the baseline at that cycle's final
   capability closure after the verifier and both gates pass. Under the first-
   implementation policy, split enrolls a capability while planning its first
   implementation layer and creates the baseline at its first final closure. Under the
   explicit-selection policy, split enrolls only when the user approves a plan that selects
   that capability, then creates the baseline at the next final closure.
2. **Stable-key owner** — recommended: an explicit key in the product.md capability row.
   Under this choice, every current and retired row has exactly one terminal field
   ` [stable-key=<stable-key>]`; an actual value is, for example,
   `[stable-key=customer-management]`. No byte follows that field, and retirement preserves
   its value. Before enrollment, migrate an existing product.md in one user-confirmed
   binding-decision commit. Alternatives are the first tree capability number or a filename slug. The first tree
   number does not exist before a brownfield has a tree representation and couples knowledge
   identity to execution structure. A filename slug has no owner before the file exists and
   needs a separate collision rule.
3. **Retirement preservation** — recommended: keep the same file unchanged and derive
   retirement from current product.md and tree state. An alternative `.retired.` filename
   requires a migration rule that updates every pointer together.

## Conclusion

The need for a domain-expertise layer is confirmed. Merging task units into domain units
is rejected. The recommendation combines **the most recently refreshed passing baseline + current task cards
outside Covered cards**, while the tree, cards, and `users/` claims remain the execution authority.

This structure preserves the handoff's current behavior, contracts, traps, and verification
knowledge while reducing chronological growth and concurrent-write conflicts. Enrollment
policy, stable-key owner, and retirement-preservation method change documentation cost and
migration behavior. They remain owner choices, so v0.9.21 stops at this proposal without
runtime implementation.
