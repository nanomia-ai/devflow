---
name: split
description: Task splitting. Opens the task tree (devflow/tree/) one layer at a time, creates task cards, and gets the execution proposal (order, parallelism, model tiers) approved by the user. Use for breaking down work, task decomposition, or planning what to do next.
---

# split — Task Splitting

First read the canonical rules (`../principles/SKILL.md`), canonical state predicates
(`../principles/state-predicates.md`), `devflow/project/product.md`
(identity paragraph, capability list), `devflow/project/arch.md`, and, if they exist,
all of `devflow/project/design.md`, `devflow/project/code-style.md`,
`devflow/project/glossary.md`, and **`devflow/journal.md`** — the durable discoveries
of earlier cards live in journal, and HANDOFF is overwritten and will not carry them.

Read the planning evidence discipline (`../principles/planning-evidence.md`) boundedly only
when judging the maintenance planning depth grade below. First read `Four Kinds of Unknown`,
`Blocking Facts and Follow-up Facts`, `Source Ownership`, `Stop Conditions`, `Criteria for
Options Actually Presented`, and `Pre-commitment Review`; read `Persistence` and `Isolated
Research` additionally only when fact confirmation is required.

Purpose: open the task tree **one layer at a time**, and get the execution proposal approved.

## Preconditions

1. **If product.md is missing, stop.** With no code, direct the user to product first;
   with existing code, to adopt (brownfield = the understanding stage). Never split a
   project you don't know.
2. Scan `devflow/tree/` for current state.
3. **Declare what you are opening, then proceed:** "Opening layer 3 under
   02-registration (currently done through 02.3.2)."
   If tree/ doesn't exist yet, "creating the tree" is the declaration. A misaligned
   understanding gets caught by the human at this one line.

## Tree Structure

```
devflow/tree/
  01-foundation/            ← foundation holds only required repo-setup, verify-channel, and shared-contract cards
  02-<capability>/          ← product.md capabilities become folders, names unchanged
    02.1-<task>.md
    02.2-<task>.wip.md
  03-<capability>.md        ← unopened-capability waiting file; body is one `# 03 <capability>` line
```

- Folder/file names = the exact terms from product.md and arch.md. Coin no new words.
- Status suffixes and numbering follow the Status Notation section of the canonical rules.
- Brownfield: never backfill `.done.` cards for already-finished code. The tree holds
  only post-adoption work. When arch.md says `Brownfield: yes`, do not create a foundation
  or capability waiting files in the first tree. Create only the change the user requested
  after adoption, in the location selected by maintenance routing. With no requested
  change, create no tree and wait for a new request.

## Open One Layer at a Time

```
New-project start        → capability list (waiting files) only; create no empty foundation folder
Before first capability → foundation (01) tasks; create the folder and direct cards together
Just before a capability → that capability's tasks
A task looks big         → promote it to a folder on the spot and split further
```

Never split everything upfront. Earlier implementation changes later decomposition —
what you don't know, you learn by writing code, and splitting then is accurate and cheap.

When first opening the tree root under `Brownfield: no`, create exactly one waiting file
for each non-retired product.md capability, named with its assigned tree number and the
capability name. This file is not
a task card and has no fields beyond the one heading line shown above. Present the
number-to-name mapping for user approval, then land the waiting files and deletion of the
layer-opening marker in one planning commit. Before opening the first capability, the next
split creates `01-foundation/` together with the direct task cards required for repo setup
and the verify channel. `01-foundation/` must have at least one direct card and must never
be committed empty.

**Restoring product.md-to-tree correspondence** (routed by resume): for each non-retired
product.md capability with neither a matching folder nor waiting file, create its waiting
file with its assigned tree number; under `Brownfield: no`, for each retired capability
with neither a `.stale` folder nor `.stale.md` file, create the `.stale.md` file. Write
the canonical layer-opening marker first with source
`core:devflow/project/product.md#Capabilities` and the numbers as `children`, present the
plan for approval, and land the files and marker deletion in one planning commit.

Before first changing the parent folder, children, or waiting file, including when adding
direct children to an existing folder, determine every direct-child number to create and
the exact durable source that requires this layer. Write the canonical layer-opening
marker and first land it, together with any uncommitted source record, in a
`split — begin <parent>` commit. Create or rename no tree path before that commit.
`children` is every number in canonical card-number order, joined with `+`. A new-project root or waiting-
capability conversion uses product.md's capability section; foundation uses arch.md's
document H1; a promotion uses the commit containing the pre-transformation card; a
prerequisite or research card inserted during work uses the current card's checkpoint;
maintenance uses that request's `maintenance routing pending` line; and a card originating
in verification uses the `verify:<path>#Failure history@<source id>` locator of a
`routing: pending` failure, or the
`verify:<path>#<Audit|Retrospective>@<source id>/<finding number>` locator of an adopted
finding. The source id and finding number remain in that entry through the planning commit.
When a `card:` source commit is not an ancestor of integration, integrate the
current branch through that commit by arch.md's `merge` method before writing a marker or
tree diff. When rebase changes the hash, put the changed full commit object ID output by Git in the locator.
The begin commit then lands on integration as the binding decision that mints the numbers.

When a valid layer-opening marker exists in the working tree or HEAD, open no new layer.
Process the earliest timestamp first, breaking a tie by journal line order, and take with it
every marker carrying the same `source-json` — that bundle gets one execution proposal and
one planning commit, never one per parent. That planning commit deletes every marker of
the bundle and, when the journal request line its `source-json` names still remains,
that line too. Decode `source-json` by
the canonical format and open that source, combining it with the upper documents read at
this skill's start. For a maintenance or re-split source, also recheck only the current
code and existing records enumerated by step 2 below. A missing or non-unique source is an
integrity anomaly. Do not substitute the current conversation or another document.

Keep existing direct children and reconstruct only numbers minted by the marker but still
missing, from that same source. Mint no number outside the marker. If the source cannot
determine one Destination, ask the user only for that Destination and create no child
before the answer. A marker child exists when its number matches the leading number of
exactly one direct child under the parent; multiple matches are an integrity anomaly.
Once every number has one match, reapprove any execution proposal whose cards' `Approval`
is not effective under the state predicates, then finish the cards, approvals, structure, and marker deletion in that layer's
planning commit. A layer interrupted after its begin commit mints no new number.

When journal has a `re-split pending` marker, process one before a normal layer: choose
the earliest timestamp, breaking a tie by line order in journal. Read only the exact
folder, `.stale.` cards, source heading, the current code and existing records that
maintenance-routing step 2 enumerates for that flow. Open no document outside this list.
Choose the replacement-card numbers and the replacement-number group for each stale
number. Then first land a layer-opening marker whose `source-json` is the whole re-split
line with the `journal:` locator, in the begin commit.

Create one or more pending replacement cards in that folder. Remove `.done` from that
folder and every ancestor through the depth-1 capability or foundation. In every pending
or claimed non-`.stale.` card in the whole tree, replace a `Depends` member exactly equal
to a stale number with its approved replacement-number group. Include a claimed card in
the change set, then release it first;
reassigning another owner's claim first needs the authorization in the canonical rules.
Reset a changed pending card's `Approval` to `pending`, then reapprove it in the new
execution proposal. Do not rewrite a `.done.` card's historical dependency. If its result
cannot remain true with the new upper decision, the Document Hierarchy procedure should
have marked that card `.stale.` too.

Land the replacement cards, dependency replacements, approvals, ancestor renames, and
deletion of both the layer-opening and re-split markers in one planning commit. This
planning commit, not completion of the replacement cards, settles both markers. Keep the
`.stale.` cards as history. If one stale number has no unique replacement group, ask the
user to choose. If the marker names a missing folder, card, or source, report an integrity
anomaly without guessing.

If arch.md's Provisional table has rows whose settling card is 'unminted', create the
settling cards for the rows this layer resolves and replace 'unminted' with their
numbers (the discovery→update table).

If `devflow/project/design.md` exists, the decomposition axis follows the build strategy:
A mock-first → by screen / B vertical slice → by feature cut front-to-back /
C contract-first → contract card first, then frontend/backend cards in parallel beneath it.

## Size Judgment

```
One card = one completion signal + one task commit
One part can pass its completion signal while another remains unfinished → separate cards
More than 7 sibling cards → create one intermediate grouping folder
```

## The Tree Is Recursive — when it deepens

A card promoting into a folder is not failure; it is normal. The same rule repeats at
any depth:

```
02.3-customer-management.md   ← opened it: won't finish in 1 commit
  ↓ promote
02.3-customer-management/
  02.3.1-list.md
  02.3.2-filter.md
  02.3.3-modal.md             ← if this is big too, promote again to 02.3.3-modal/
```

Promotion procedure (declare the minting first — child numbers are minted
numbers, per the execution proposal section):
1. If the card's progress log is non-empty, commit the card as a checkpoint before
   transforming it (`NN.N wip:` — this commit creates the git guarantee for the log;
   integrate the checkpoint before the marker under the `card:` source rule above)
2. Choose the child numbers. Use the full object ID output by Git for the current commit that
   contains the pre-transformation card and its path as the `card:` source, write the
   layer-opening marker, and land the begin commit first
3. Turn the card file into a **folder with the same number and name**
4. Distribute the original card's Destination · Why · Forbidden · Depends and any carried
   quotations into the child cards — the folder itself holds no card (a folder's meaning
   is its name and its children; same principle as capability folders)
5. Child number = parent number + one digit (`02.3` → `02.3.1`). Number immutability
   still applies
6. In another pending or claimed tree card, if one comma-delimited member of `Depends`
   exactly equals the parent number, replace that member with the child numbers born in
   this promotion and preserve every other member's order. If `Read first` contains the
   exact path of the parent card that will disappear, replace it with the child-card path
   or paths that received that content. Include and release a claimed affected card before
   editing it; stop promotion without the canonical authorization to reassign
   another owner's claim. Reset an affected pending card's Approval to `pending` and
   reapprove it in step 10. Do not edit `.done.` or `.stale.` cards or other text
7. If a Provisional row in arch.md has a `Settled by` value exactly equal to the parent
   number, select the one child that will settle that row and replace the value with its
   number. If no child settles it, repair the child decomposition before the promotion
   commit
8. If the card wore a claim suffix (`.wip-<my id>.`), remove the suffix
   and name in the execution proposal one continuation child that owns the current
   implementation. Every child is born pending
9. If there was a progress log, first land cross-task decisions through the
   discovery→update table. Put remaining task-local prohibitions in the affected child's
   `Forbidden`, and actual file or document paths in `Read first`. Move completed work
   and the exact next implementation point into the progress log of the child named in
   step 8. If no continuation child owns that work, repair the child decomposition
10. Present the children's execution proposal, get approval, and write each card's
   approval field
11. Immediately land the folder transformation, children, replacements from steps 6–7,
     approvals, and layer-opening-marker deletion in one planning commit (`NN.N promote`.
     a binding decision, so it lands on integration). Then claim the continuation child
     through the normal work procedure

- The decomposition axis inside a capability defaults to **feature units** (what a user
  perceives as one action). Technical-axis splits (frontend/backend) only under build
  strategy C (contract-first)
- Scenario verification (verify's capability layer) opens **only at depth-1 capability
  folders**, regardless of depth. Intermediate folders just receive `.done` when they
  have at least one direct child that is not `.stale.` and every such child is `.done.` —
  no separate verification rite
- Splitting past 4 levels → stop and re-examine scope with the user. The tree isn't
  deep; one capability may be as big as a project

## Research Cards — when the destination would be a guess

When one unknown turns a card's destination or completion signal into guesswork, place a
card **whose deliverable is the answer** before the implementation card.

```markdown
# 04.1 Research: does the payment API support partial refunds?
Destination:       An answer exists to "is it supported — limits and constraints?"
Completion signal: Answer + evidence (doc link or a real call result) recorded in the progress log
Depends:           none
Read first:        none
Approval:          pending
Review:            not-applicable
```

- A research card carries no Coordinates or Identity (the sanctioned exception to the
  canonical rules' identity re-injection — a card whose log freezes once the answer
  lands has no use for the injection). Depends, Read first, and Approval are mandatory in
  the task-card forms; an omitted Tier means T-mid. Review is `not-applicable`. If the real
  code gets a diff, work changes Review to `required`.
- Any means is fine: document research, real calls, a **throwaway prototype**.
  A prototype must be marked disposable by name and location and never mixed into the
  real code — only the decision survives.
- When the answer is not only a fact but also a procedure or tool that will run again —
  "does it support partial refunds" answers with a fact; "the comparison procedure
  against the reference data" answers with a tool — the throwaway-prototype rule does
  not apply to that tool. A following card brings it into the real code or registers it
  as the verify channel's means (the discovery→update table's means row).
- Keep the following implementation card at `Approval: pending` and do not claim it before
  the answer exists. Once answered, replace every Destination, Forbidden, Completion
  signal, or Depends value changed by the answer; get the revised execution proposal
  approved and land it in a planning commit before proceeding. If that card is already
  claimed, release it before editing. Thirty minutes of research replaces days of rework.
- **The answer also travels upward.** If the research settled an open statement in an
  upper document (a Provisional row in arch, etc.) and that text is not replaced, the
  value you just disproved keeps winning the hierarchy. work's upper-document feedback
  step enforces this before `.done.`
- The evidence stays in the tree — later it answers "why was it designed this way."

## Routing Change Requests — the maintenance phase

When a request like "fix the filter on this page" arrives:

Before reading code, append a new user request as the canonical `maintenance routing
pending` line. Serialize the whole request — minus any items that passed the canonical
tweak gate — as one JSON string: a passing item is written into no journal line, and the
tweak lane handles it in the conversation that carries it (canonical rules). When nothing
remains after that subtraction, append no line — say those items are the lane's and stop.
The
recording commit
carrying only that line has the message `<id> boundary — request recorded`. When this
session holds a
claimed card, land that commit alone as a binding decision and return to the card — the
request waits and is planned after the card closes. Do not append it again when
an unresolved line decodes to identical request text. When one or more unresolved lines
exist, use the earliest timestamp as the request, breaking a tie by journal line order.
Create no such line when a verify.md `routing: pending` or `awaiting user decision` entry
already preserves the request text, or while handling the `re-split pending` path above.

Before using a line, decode `request-json` as a JSON string. If it does not have the
canonical format or cannot be decoded, report an integrity anomaly. Do not read code,
create a card or folder, or delete the line before canonical item-12 recovery finishes.

Delete the request line and every layer-opening marker of that request in the same planning
commit that lands the cards, approvals, and required folder rename. A request spanning
several units still gets one execution proposal and one approval — approving unit by unit
would need several approvals for one twenty-item fix list.
If the user cancels while the line is
uncommitted, delete it together with any uncommitted marker and draft cards minted for it.
If the line is already committed and its layer-opening markers
exist in HEAD or the working tree, land one binding-decision commit that deletes every one
of those markers and the line and discards any uncommitted draft cards minted for them;
with no marker, land deletion of the line alone as a binding-decision commit. Keep it while a mapping question or execution-proposal approval
remains unresolved. After interruption, its decoded value is the current request.

### Planning Depth Grades
In steps 1–2 below, compare the maintenance request with current code and exact existing
sources. Before writing a card, judge from this table whether each of its four fields —
`Destination`, `Why`, `Forbidden`, and `Completion signal` — has exactly one unique
sentence. Names or sizes such as page, list, or modal are not grade conditions.

| Grade | Mechanical condition | Next action |
|---|---|---|
| 0 | Each of the four fields is one unique sentence in an exact existing source | Write the card without a question |
| 1 | Actual answers from one question batch make the four fields unique | Write the card after one batch carrying a recommendation |
| 2a | An actual option or answer changes a Layer 0 field or requires a decision meeting all three ADR conditions | Create no card; return to the owning stage. Takes precedence over 2b |
| 2b | Layer 0 stays unchanged, but after one batch a card field still has two or more valid sentences | Continue the next dependent frontier in the same maintenance conversation |

Layer 0 fields are product's identity, Capabilities, Boundary, and Success criteria, plus
arch's Components, Stack, Code structure, Data, and verify channel. A 2b answer must land
in one of the four card fields; when it lands in none, route it to 2a. Create no capability
design zone, new planning file, or new state.

In 2b, create the next frontier only when the preceding answer reduced the number of valid
sentences for one of the four fields or opened a new actual dependency. When the unresolved
set is unchanged, do not repeat a reworded question.
Take exactly one exit: show the remaining field and one recommendation and wait for the
user's decision; route an execution fact to the existing research card; or route a Layer 0
fact to 2a.
Keep this comparison only in the conversation and do not store it as state.

When a new term is confirmed, immediately land it through the one-line `glossary.md` route
in the canonical discovery→update table. After the four card fields first become unique and
before writing the card bytes, run the planning evidence discipline's pre-commitment review
once. Do not compare a candidate that changes Layer 0; route it to 2a.

1. **Map the request's scope to a location.** Before mapping, read only the `Design head`
   metadata line of each candidate capability document and run the single-line command
   `git log -1 --format=%H -- devflow/project/product.md devflow/project/arch.md devflow/project/glossary.md`.
   A candidate with no document, with the canon's exact `legacy v0.10` shape, or without
   exactly one fixed boundary has no stored value — judge it the same as differing. When
   any stored value differs from that output, do not map: route `Brownfield: yes` to
   adopt and `no` to arch to refresh the affected design zones first.
   A card mapped from a stale boundary lands in the wrong capability. Shared foundations,
   cross-capability contracts, and the verify channel go to `01-foundation`; everything
   else goes to the matching product.md capability folder. For this mapping step only, read
   the fixed first four lines of each candidate capability document and nothing else —
   `Boundary: owns …; does not own …` is the mapping oracle. **When one request spans
   several locations, map all of them** — never pick one and drop the rest. When any part
   determines no location, or a mapped capability is retired in product.md or has `.stale`
   as its tree representation, ask the user before the begin commit and leave the original
   request line in place. Route a retired unit to product so the user first decides whether
   to reactivate it or define a new capability, and create no card for any unit before that
   answer
2. Trace the request through the current code. Limit candidate handoff and specification
   files to exact paths named by the user, exact paths directly linked once by a file on
   that flow, and paths under the mapped capability and `shared` in arch.md's
   `Existing records`. Do not follow links inside a linked document. Put a path in the card's `Read
   first` only when the statements this card needs still match current code. Do not guess
   another path or list a whole folder
3. Choose the cards and continuing numbers (01.7, 02.8…). When the maintenance line
   exists, use its whole line as a `journal:` source; when verify.md preserves the request,
   use the exact failure or finding `verify:` locator above. When the mapping spans several
   parents, write one marker per parent, all carrying the same `source-json`. First land
   every marker together with any uncommitted maintenance line in one begin commit. This
   also applies when adding cards to an existing folder
4. Add each unit's cards to its mapped folder. If a mapped folder is absent and a root
   waiting capability file has the same number and name, replace that file with the folder
   and create the cards. If neither exists, create the folder and cards together. Create no
   other foundation or capability representation
5. **Remove `.done` from every mapped folder and every ancestor through the depth-1
   capability or foundation** — it holds only while every active child is done. Forgetting this rename
   makes the tree lie
6. Product-layer failures use the same rule. Never create a task card at the tree root

**verify-origin fix-card inheritance.** When a Failure-history source has a `signal card`, use the stored-value set verify passed — `{the current entry's signal card} ∪ {every card recorded under routing: fix cards by the same root's previous repair round}` — plus the current non-pass evidence.
A new root receives only the signal card; recurrence observation 1 receives every route from the root's first entry; after a person approves another repair, receive only the most recently approved and completed repair round.
Remove duplicate numbers, sort them in canonical card-number order, and impose no arbitrary cap or recursive lineage read.
In the final tree after route operations, resolve exactly one card path for each number and put it in the new card's `Read first`; if a final path is absent or not unique, do not guess, write `routing prepared`, or create the route, report an integrity anomaly with the exact card number and paths found, and after human correction restart maintenance routing for the same source from the beginning.
Put the current non-pass evidence in `Why`; when a previous repair round exists, also put there its failure to make this signal pass.
Write one `Forbidden` line only when the previous card's progress log and current execution evidence directly show that repeating the same approach unchanged produces the same result; otherwise invent no prohibition. The Destination is not the signal passing by itself, but the capability statement that signal guarded becoming true.

**Card recall.** When step 1 finds an existing pending card of this request's scope sitting
in the wrong folder, the planning commit that corrects the mapping leaves the original as a
`.stale.` tombstone at the same path and number and creates the replacement under a new
number in the right folder — but only while that card was never claimed and no task
commit subject has named its number. The tombstone keeps that number in the tree, so the
next minting does not reuse it. When another pending or claimed card's `Depends` holds a
member exactly equal to that number, replace it with the replacement card's number in the
same planning commit, releasing a claimed card first. This tombstone is not an
upper-document change, so it creates no `re-split pending` marker, and no implementation
history is invented in its progress log. Once a task commit carried that number, leave the
card where it is and record the correction as one journal line instead.

## Task Card Format

```markdown
# 02.2 signup API
Coordinates: <service> ▸ ①registration ▸ 02.2
Identity:    <the identity paragraph from product.md, copied verbatim>

Destination:       What becomes true when this is done (1–2 sentences)
Why:               What happens to users without this (1 sentence)
Forbidden:         <3 lines max>
Completion signal: <executable command/check — e.g., `pnpm test auth` passes + 201 via .http>
Depends:           none | 02.1, 03.2
Read first:        <exact file/document paths, one per line | none>
Tier:              T-mid | T-low   <!-- omitted = T-mid. For T-low, make Read first,
                                        Forbidden, and the completion signal complete -->
Approval:          pending | YYYY-MM-DDTHH:MM:SSZ; parallel: <number+number|none>
Review:            required | waived

## Progress log
<!-- work appends here while .wip. -->
```

`Depends` follows the canonical format and legacy interpretation in the state predicates.
A new card writes only the canonical value. When split next edits a pending legacy card,
delete trailing prose and replace the field with the canonical value. Ask the user for an
unparseable replacement; never infer it. Put the confirmed correction in a planning
commit without changing other fields or status. Release a claimed card first.

When split starts with a pending card whose
`Approval` is not `pending` but is ineffective under the state predicates, report the
exact reason and reset it to `pending`. Present the whole current card in a new execution
proposal, then land the new approval value and card change together in the planning commit.

**When the user changes the Destination of a card in progress**, use the existing path:
work checkpoints and releases the card, split rewrites its Destination, Why, Forbidden, and
Completion signal, gets the execution proposal approved again and lands it in the planning
commit, and the card is then claimed again. No upper document changed, so this creates
neither `.stale.` nor a `re-split pending` marker.

When the Destination cannot be written in one or two sentences, invent nothing plausible —
ask the user what must become true, and create no card before the answer. A thin
Destination leaves the next session unable to tell what this card is for.

**Bundling small items.** A recorded request line holds no item that passed the tweak
gate — a passing item was handled by the tweak lane in its own conversation at recording
time and is written into no journal line (canonical rules). So do not send an item back
out to the tweak lane from here: the request line is consumed whole by the planning
commit, and an item sent out to the lane sits in no record on interruption. Several small
items that
fail the gate (they change a transition, yet are each too small for a card of their own)
go into one card.
Bundling requires all four: ① they came from the same original request; ② they sit in the
same depth-1 unit; ③ one Destination states every one of their outcomes; ④ one revert may
undo them together. List the bundled items one by one in the execution proposal and get
approval.
**Never create a path that skips recording** — a tweak's record is its commit; a card's
record is its documents.

Scope a completion signal to the paths this capability owns whenever the means allows it
— `pnpm test src/payment`, not `pnpm test`. One working tree runs one build, so a
repository-wide signal fails on another flow's unfinished code and the failure ladder then
blames this card.

**Never write the implementation method.** Destination, completion signal, and Forbidden
are the entire harness. Only T-low cards additionally get ordering hints (see the harness
dial in the canonical rules).

## Execution Proposal — this skill's final output and gate

Propose, and **get user approval**, for the opened tasks. Exclude a following
implementation card whose fields await a research answer from this gate and leave it at
`Approval: pending`:

```
Execution proposal
02.2–02.4  sequential · T-mid recommended (schemas are entangled; judgment needed)
03.1–03.3  parallelizable · T-low + complete cards (mechanical CRUD; file overlap checked)
→ present an example mapping onto currently available models and let the user choose
```

Before approval, encode every required order in the later card's `Depends` and write the
tier in each card's `Tier`. Order and tier text in the proposal is explanation, not a
separate state record.

Parallelism conditions: only tasks that don't overlap in files AND don't touch a shared
dev server. **Frontend work sharing a dev server is sequential** (a single agent's
compile error breaks the whole screen).
When the user approves, replace each card's `Approval` with
`YYYY-MM-DDTHH:MM:SSZ; parallel: <number+number|none>`. `parallel` lists every card
approved to run together, in canonical card-number order and joined with `+`; repeat the identical value in
every card in the group. Use `none` when the card is not parallel. Changing a group
updates every pending card in the old or new group in one planning commit. Do not change
a claimed card's approval; release it first if it must join the new group. Do not rewrite
the historical approval value of a `.done` or `.stale` card. The `parallel:` value is the
plan's recorded judgment — it neither permits nor blocks a claim (the state predicates),
and work reads it as information when naming same-unit claims.

An implementation card's default `Review` is `required`. The main session cannot waive
it; change it to `waived` only when the user explicitly waives that card. A research card
uses `not-applicable`; if the real code gets a diff, change it to `required`. Persist no
assignment. The claim suffix alone names the current owner.

For a task-card layer, land the cards, `Approval`, `Review`, and deletion of the layer-
opening marker together in the canonical planning commit. Do not claim before Approval
meets the state predicates.

After closing the root waiting-capability-file layer, say "next is split" to open the
foundation layer. After approving any other task-card layer, say "next is work."
