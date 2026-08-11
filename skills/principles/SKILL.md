---
name: principles
description: devflow canonical rules. Every devflow skill follows this document first — the 7 prompt principles, model tiers, failure ladder, status notation, commit discipline, and the verification iron rule.
---

# devflow Principles (Canonical Rules)

Every devflow skill, card, and prompt follows this document. When any other document
conflicts with it, this document wins.

## The 7 Prompt Principles

1. **One concept, one word.** No synonyms. Register project-specific terms in
   `devflow/project/glossary.md` and use the same word everywhere, to the end.
2. **Destination over instruction.** Write "what must become true," not "what to do."
3. **Rich direction, short prohibitions.** Give context, intent, and the "why" generously.
   Keep the harness (prohibitions) to 3 lines or fewer.
4. **Never prescribe the method.** The executing model decides how to implement.
5. **One example beats five rules.**
6. **Avoid off-the-shelf methodology terms.** Words like spec-driven, TDD, DDD drag in
   baggage you did not choose.
7. **Repeat the identity.** Copy the identity paragraph from `product.md` verbatim into
   every task card (exception: research cards — split's research card section).
   This is the only duplication allowed — it costs one paragraph and
   buys "never getting lost."

## Modes and Identity

devflow runs in one of two modes. The test is a single file:

- If any `devflow/users/*/owner.md` exists — **multi mode**: several people run their own
  sessions in one repository.
- If none exists — **solo mode**: ignore every rule in this document marked "multi:".
  Solo behavior is identical to the version before those rules existed.

multi: resolve your id before writing to the tree, journal, or shared documents — match
your git identity (name or email) against `devflow/users/*/owner.md`. No match → ask the
user once and create your room. A session that cannot resolve an identity (CI, bots)
only reads.
ids are lowercase `[a-z0-9]{2,8}`. Names devflow uses (project, tree, users, decisions)
are forbidden; ids are never reused.

Room = `devflow/users/<id>/` = owner.md (identity declaration) + HANDOFF.md + digest.md
(the digest marker). Write only in your own room. Rooms are readable by the whole team —
write with that premise.

multi: **only `.wip-<my id>.` is my work.** The precondition, full-read, and continuation
rules apply to my claim only. Another's claimed card is read-only reference — never write
a card you have not claimed.
Reassigning a stalled claim = release, then re-claim. Only on the user's explicit
instruction, with 1 journal line (the sanctioned exception to claim inviolability).

multi: shared state for next-stage routing and the integrity check comes from the tip of
arch.md's integration branch, not the current branch: `devflow/project/`, `devflow/tree/`,
`devflow/journal.md`, and resume's bounded verify projection. Fetch integration and read this shared state
before routing. When the integration tip is not an ancestor of the current branch and, at
that tip, journal or any verify.md contains an active marker, an active request or
product-verification line, or an event `pending` or `routing` state, include the integration
tip in the current branch before local claimed work. Checkpoint unrelated uncommitted
changes first. This is state synchronization
and runs even while a card is claimed. Digest diff reading and marker advancement remain
clean-boundary-only.

all modes: apply the following gate (the **open-Git-operation gate**) only when
`git rev-parse --is-inside-work-tree` returns `true`. Otherwise skip the gate and do not initialize Git. Immediately on entry before normal
routing, execution, or any path change, and immediately after an integration rebase or merge
command, product, arch, design, adopt, split, work, verify, and resume check whether `git status` reports an open rebase or merge.
When either is open, stop normal routing and report
the operation kind, current branch or detached HEAD, and every unmerged path. Before the
user decides, change no path and make no commit; even with no unmerged path, ask whether
to continue or abort the existing Git operation. Never abort automatically. To continue,
first present and get confirmation for the exact resolution of each conflict that requires
a semantic choice. Allow only those confirmed conflict-resolution paths and commits Git
makes while continuing the existing operation; write no separate devflow state. After the
open operation disappears, read `git status` again and restart the integrity check at item 1.

Mode transitions — each is a single-commit procedure:

- Joining: create your room (owner.md) + marker = current HEAD. Past understanding comes
  from the shared documents, not from commit archaeology.
- Solo→multi: create the room + move `devflow/HANDOFF.md` into it + `.wip.` →
  `.wip-<id>.` + marker = HEAD. Solo traces seen in multi mode (a bare `.wip.`,
  `devflow/HANDOFF.md`) mean the transition is incomplete — report, confirm the owner
  with the user, and finish it. Never guess.
- Departure: the user declares it. Any remaining member — promote the departed room's
  open decisions into journal (attributed), release their claims, delete the room,
  1 journal line. This is the sanctioned exception to both "write only in your own room"
  and claim inviolability.
- Multi→solo (last member): HANDOFF back to devflow/, delete users/, suffixes back to
  `.wip.`, remove arch's multi-only config lines (integration, merge).

## Document Hierarchy (the contract)

Whenever a canonical procedure says to write or append a journal line, create
`devflow/journal.md` first when it is absent.

### Exact journal formats

The formats below are the sole canon for reserved journal records. Other skills fill in
their values; they do not redefine the formats. `source-json` contains the whole of one
locator below as a JSON string. Paths are repository-relative, hashes are unabbreviated full
commit object IDs output by Git, and headings are verbatim document headings. A verify `source id` is a
positive integer within that verify.md section; each new entry takes the previous maximum
plus one and an id is never reused. Before first writing a legacy Failure history, Audit,
or Retrospective entry without a source id, assign every missing id in that section in file
order starting after the existing maximum, preserve its original timestamp and content,
and first land `boundary — verify source ids`.

Canonical ordering has only two orders. **Canonical path order** compares repository paths by
the UTF-8 bytes of their repository-relative `/` path strings. **Canonical card-number order** splits on `.`, comparing each component's leading digits
as an integer, put no suffix before a suffix at the same integer, and compare lowercase-letter
suffixes by ASCII bytes. When all shared components are equal, the number with fewer
components comes first; break any remaining tie by the full number's UTF-8 bytes.

- `core:<path>#<heading>` — the exact section in that core document
- `card:<path>@<hash>` — the exact task card at that commit
- `journal:<whole reserved journal line>` — the canonical on-disk line, including timestamp
- `verify:<path>#Failure history@<source id>` — the Failure history entry carrying that id
- `verify:<path>#<Audit|Retrospective>@<source id>/<finding number>` — that adopted finding
  inside the event carrying that id

A conversation request first becomes a `journal:` source through `maintenance routing pending`.
Resolve every locator to its exact working-tree source. When a valid `routing prepared`
object replaced the referenced verify source's `routing: pending`, resolve the locator with
the same source id and finding number in that object's `base` commit. For any other
uncommitted output transition that changed or deleted the source so the exact value is
absent, resolve the exact source from HEAD. This includes deleting a journal source with its
layer-opening marker and changing a verify source to its final result. Folder-path
placeholders have the `.done` and `.stale` status suffix removed from every path
component. Only a layer-opening marker's `parent` may have zero matching actual folders
before creation; it must have exactly one afterward. Every other folder placeholder must
always match exactly one actual folder. Two or more matches are an integrity anomaly in
either case.

```text
YYYY-MM-DDTHH:MM:SSZ layer opening: parent: <devflow/tree or folder path with status suffixes removed>; children: <number+number>; source-json: <JSON string containing the exact durable source locator>
YYYY-MM-DDTHH:MM:SSZ re-split pending: folder: <direct parent folder path with status suffixes removed>; stale: <number+number>; source: <devflow/project file path>#<heading>
YYYY-MM-DDTHH:MM:SSZ maintenance routing pending: request-json: <JSON string containing the whole user request>
YYYY-MM-DDTHH:MM:SSZ product re-run pending: statement-json: <JSON string containing the whole disproved identity or success-criterion text>
YYYY-MM-DDTHH:MM:SSZ product verification requested
YYYY-MM-DDTHH:MM:SSZ product verification running: trigger: requested | automatic; product: <Product revision>; verification: <Verification revision>; code: <Code revision>
YYYY-MM-DDTHH:MM:SSZ product verification result: trigger: requested | automatic; product: <Product revision>; verification: <Verification revision>; code: <Code revision>; verdict: pass | fail | unverified
YYYY-MM-DDTHH:MM:SSZ capability closing: folder: <devflow/tree/capability folder path with status suffixes removed>; head: <git rev-parse HEAD>; product: <Product revision>; verification: <Verification revision>; capability: <Capability revision>
YYYY-MM-DDTHH:MM:SSZ audit requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ retrospective requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ evidence-wait: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
YYYY-MM-DDTHH:MM:SSZ evidence-finalizing: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
```

Before creating a layer's first child or folder, land its layer-opening record together
with any uncommitted source record in a `split — begin <parent>` commit. Land a capability-
closing record together with the passing verify.md record in a
`boundary — begin <capability number>` commit, before the folder rename or any other
journal change. Both remain active until the
next commit deletes them. If the working tree lacks one but HEAD contains it and its deletion
is uncommitted, a consumer treats it as active and finishes the interrupted commit first.
These begin commits are not task commits.

`product ⊃ arch ⊃ design·code-style ⊃ tree (cards)`. **A lower layer may not violate an
upper layer.** If it must, that is an upper-layer decision:

1. Stop. Write 2 lines of "why" in the progress log.
2. Fix the upper document (add an ADR if the three ADR conditions hold — see arch).
3. Mark cards that need replacement work `.stale.`. For each direct parent folder of
   those cards, write one canonical `re-split pending` marker in journal.md. Delete in
   the same binding-decision commit every `evidence-wait` or `evidence-finalizing` line
   whose card path names one of those cards.
4. Re-split the affected range, then resume.

`stale` is the numbers of direct-child task cards made `.stale.` by this decision, in
canonical card-number order and joined with `+`. First land the upper-document edit, `.stale.` renames, and
markers in one binding-decision commit. Capability retirement follows product's `.stale`
folder and `.stale.md` rules and creates neither replacement work nor this marker. Delete
in the retirement commit every evidence record that names a card inside the retired open
folder. split deletes the marker when the replacement cards' planning commit lands.

`Needs replacement work` has one test. It is needed when the changed upper-document
statement cannot be true together with the card's Destination, Forbidden, Completion
signal, or the implementation produced by that card; it is not needed when all can be true
together. If they cannot all be assumed true while card text and implementation stay
unchanged, rename the card `.stale.`.

**A contradiction between documents is a defect, not a precedence question.** Silently
adopt neither side — stop, reconcile through this procedure, then proceed. A delegated
implementer stops and reports only; reconciling is the main session's job.

What you discovered → where to update:

| Discovery | Update target |
|---|---|
| Feature, screen, or scope changed | product.md (+ mark affected cards that need replacement work `.stale.` + the `re-split pending` markers above) |
| Stack, module boundary, or data shape doesn't fit | arch.md (+ consider an ADR) |
| A value the upper document called provisional is now measured | that row of arch.md's Provisional table — **replace it, don't add beside it**. An ADR that assumed the old value gets a dated update note |
| A Provisional row's settling card is 'unminted' and the tree has reached its layer | create the settling card and replace 'unminted' in that arch.md row with its number |
| A success criterion turns out unrunnable as written | product.md (+ the cards that quote it) |
| A measurement disproves the content of the confirmed identity paragraph or a success criterion (not unrunnable as written — running it as written gives a wrong signal) | After user confirmation — if the replacement statement is settled, replace just that statement; if what replaces it is a planning question again, re-run product with the line below (and arch if the change reaches it). In either case, affected cards that need replacement work receive `.stale.` and the `re-split pending` markers above. The next session may take up the re-run on the strength of its line |
| A `.done.` card's completion signal turns out unrunnable | fix that card's signal text too — regression must stay runnable |
| A new coding-convention decision is needed | one line in code-style.md "Project choices" |
| A verification means is newly created or changed | the means line of arch.md's verify_channel |
| A file in arch.md's `Existing records` moved or no longer matches current code | replace or delete that exact path (+ `Read first` in pending or claimed cards carrying it) |
| A new term becomes necessary | one line in glossary.md |
| The task is merely bigger than expected | no document change — promote the card to a folder (split's promotion procedure) |
| A cross-task decision | one line in journal.md |

For a product re-run, use the canonical `product re-run pending` line above. Serialize
the whole disproved statement as one JSON string so newlines and quotes remain recoverable.

An update per this table (replacing a provisional value, fixing a signal text, etc.) is
itself a sanctioned modification path. Steps 1–4 run only when a lower layer must
**violate** an upper one.

Discoveries do not come only from card work — a decision confirmed in conversation also
lands through this table, immediately. The confirmed product.md's identity paragraph,
Capabilities, Boundary, and success criteria are modified only after user confirmation,
whichever path the change arrives by — the conversation in which the user confirmed that
change IS the confirmation. Planning lives as edits to product.md, arch.md, design.md,
and ADRs — never create a new planning document beyond them.

Core documents (`devflow/project/*`) are modified **only through this procedure or by
re-running the owning skill** — never edited in passing during a task. And modification
means **replacement by default**: if you added a line, check whether you deleted the stale
one. A document that only grows is a dead document.
Target ownership is fixed: product owns product.md and glossary.md; arch owns arch.md,
code-style.md, and decisions/; design owns design.md; adopt owns arch.md `Existing records`
and may add only a missing `Brownfield` field to an existing arch.md;
split owns the tree and task cards; verify owns verify.md.

A document still being produced by a running product, arch, design, or adopt session is
a draft until the user confirms it — reconcile a draft's contradictions by editing the
draft on the spot, not through the procedures above, and when an already-inherited upper
document must change, put that edit into the same confirmation batch.

Records outside devflow — the memory and task lists an execution environment injects
into a session, documents in the repository that are not devflow's — are claims, not
canon. This is not an instruction to seek them out — it applies only to what is already
in context. When such a record contradicts a confirmed devflow document, do not silently
pass over it — report it. Until confirmation, follow the devflow document; after
confirmation, fix the side that is wrong — a devflow document through the
discovery→update table's path; an outside record with no means to fix it, the report is
the end.

## Integrity Check

Run at the gates that open the tree (start of split and resume).
**Report anomalies — do not fix them.** Auto-correction that misjudges accelerates
corruption. Correct only after user approval.

1. Are there 2 or more `.wip.` cards where an additional card is explained by neither
   reciprocal parallel approval in the cards themselves nor evidence-wait in journal
   (multi: judged per id)?
2. Are any numbers duplicated?
3. Is there a task card inside a `.done` folder that is neither `.done.` nor `.stale.`?
4. Does each task card's `Depends` parse under the state predicates' canonical or legacy format, with
   exactly one card existing for every dependency number?
5. Do the paths referenced by HANDOFF exist?
6. multi: is there a bare `.wip.` or a root `devflow/HANDOFF.md` (ownerless claim, or an incomplete transition)?
7. multi: do two or more owner.md files claim the same git identity?
8. multi: for each currently claimed card, from the current claim commit that created its
   suffix through the integration tip, does a commit changing a same-number status path for
   that card have an author different from the claimant's owner.md git identity? Exempt a
   canonical commit that releases that claim during a user-authorized reassignment,
   departure, or planning transition. Inspect neither pre-claim commits nor earlier claim
   intervals.
9. Does a pending task card omit an `Approval` or `Review` field defined by split, or carry a
   value outside those formats?
10. Is a foundation, capability, or intermediate folder empty with no active
    layer-opening marker?
11. Does a non-capability folder have at least one direct child that is not `.stale.`, all
    such children with a `.done` status, but no `.done` on the folder?
12. Does a journal line whose timestamp is followed by `layer opening:`,
    `re-split pending:`, `maintenance routing pending:`, `product re-run pending:`,
    `product verification requested`, `product verification running:`,
    `product verification result:`, `capability closing:`, `audit requested:`,
    `retrospective requested:`, `evidence-wait:`, or `evidence-finalizing:` differ from
    the canonical format above; does any `-json` value fail to parse as a JSON string; or
    does a decoded layer-opening `source-json` fail to match one of the locator forms
    above or resolve to exactly one source?
13. Does an `evidence-wait` or `evidence-finalizing` line's decoded card path fail to name
    exactly one claimed card; does its checkpoint hash not exist in this repository or
    name a commit whose message and card path match; or does the last `remote evidence
    check` line in that commit's card progress log have a JSON value different from the
    journal's `check-json`? A committed `evidence-finalizing` path may instead be absent
    when exactly one same-parent `.done.` card has the same number, name, and bytes; that is
    an interrupted canonical claim→done move, so work finishes its boundary. Otherwise
    first finish an uncommitted binding decision that both deletes the line and renames
    that card `.stale.`, then judge again.
14. Does a verify.md section contain a non-positive or duplicate existing `source id`; or
    does an Audit/Retrospective routing entry have a non-positive or duplicate adopted-
    finding number, or a `routing: pending` finding with no number? Does text after
    `routing prepared:` fail to parse as a JSON object or fail the exact keys, value forms,
    base relation, operation forms, applicability, prefix, or scope conditions in Routing
    write order below?
15. Does journal contain two or more active product-verification state kinds together;
    more than one `product verification running` or `product verification result` line;
    or a result line whose product, verification, code, or verdict field differs from the
    corresponding tree-root verify.md field?

An item-12, item-13, item-14, or item-15 anomaly blocks later routing and every tree write. Present the raw line, the
expected format, and the whole proposed replacement to the user. Use in that proposal
only values that parse from the raw line or are uniquely determined on disk; ask for
every other value. After the user confirms the whole replacement, land only that line
replacement in a binding-decision commit and restart the integrity check from item 1. A
`routing prepared` anomaly is the exception: never commit the corrected object alone.
Replace it in the working tree, compare the already-applied operations prefix with the object,
apply the remainder, change verify.md to `result`'s completed state, and finish the one
specified routing commit. If user confirmation cannot recover a missing object value, stop
without guessing an output or rollback.

## Model Tiers

**Never write model names in files.** Use tiers only. The actual model and reasoning
effort are chosen by the user, per session, in split's execution proposal.

| Tier | Role | Use for |
|---|---|---|
| T-high | Top-tier reasoning | Judgments and reviews. Keep them short — long runs don't justify the cost |
| T-mid | Standard reasoning | The default. Planning, splitting, ambiguous or entangled tasks |
| T-low | Implementation-focused | Implementation with a complete card, mechanical transforms, collection/cleanup |
| Below that | — | Never for coding |

Reasoning-effort rule: **judgments = higher tier + low effort, kept short. Design =
standard tier + high effort, kept deep.**

The harness dial — inversely proportional to tier:

- T-mid and above: destination + 3 lines of prohibitions. No path instructions —
  prescribing the method actively degrades performance.
- T-low: fully enumerate `Read first` + ordering hints + expanded prohibitions +
  the completion-signal commands verbatim.
- **If you don't have time to write a T-low-grade card, don't give that task to T-low.**

## Failure Ladder (applies to every retry)

```
1st failure → reinforce the card and re-dispatch (never re-dispatch the same prompt —
              failure signals a defective card)
              The heart of reinforcement is the failure's causality, not added
              instructions — one or two sentences on the card: what failed, why,
              and what happens as a result
2nd failure → raise the tier, or the main session does it directly
3rd failure → call the human. There is no 4th attempt
```

Repeated fix attempts under the same hypothesis during implementation are not ladder
counts — those belong to work's stuck-escape.

## Status Notation

**A filename's status suffix is the source of truth for task state; the claimed card's
progress log is the only record of progress inside that task.** Never put task progress
in product, arch, design, code-style, or glossary. journal may contain only cross-task
decisions and lines whose exact formats the canonical rules define; it
never records task progress or approval. verify.md may record
verdicts, failure routing, Audit and Retrospective event states, findings, and user
decisions. These records do not directly change card or folder status. A task card's
`.done.` evidence is its completion signal and applicable review; a capability folder's
`.done` evidence is verify's capability-layer pass verdict.

- No suffix = pending / `.wip.` = in progress / `.done.` = complete / `.stale.` =
  invalidated by an upper-level decision change
- multi: a claim is written `.wip-<id>.` — a bare `.wip.` is an ownerless claim = an
  integrity anomaly. Release strips the whole suffix back to pending (the progress log
  stays in the card). `.done.` and `.stale.` stay unattributed — completion's ownership
  is git's memory
- Only one `.wip.` at a time (multi: one per id. Exceptions: reciprocal parallel approval
  in the cards themselves, or evidence-wait recorded in journal)
- `.done.` **only after the completion signal passes, the review that applies to the card
  passes, and the commit lands.** In this system, "verification" is reserved for verify's
  capability and product layers
- A folder that is not a capability receives `.done` when it has at least one direct child
  that is not `.stale.`, and every such child has a `.done` status. `.stale.` task cards
  remain as history but are excluded from active-child counts and closure judgment.
  **A depth-1 capability folder receives it
  only after capability-layer verification** — verify grants it. The foundation folder
  (01) is not a capability: it closes with no scenario rite under the same condition
- Tree numbers are assigned once: foundation is `01`; capabilities receive `02`, `03`, …
  in product.md's capability-list order at first root opening, and a capability added
  later receives the next unused number. At the tree root, a `.md` is a
  waiting capability file, not a task card, when its name equals a non-retired product.md
  capability's name and its number is that assigned tree number. Its body is the single
  line `# <number> <capability name>`; it has no `Approval`, `Review`, or completion signal.
  When opening the capability, split turns this file into the same-numbered, same-named
  folder and creates its direct task cards
- A retired capability gets `.stale` when it is an opened folder, or `.stale.md` when it
  is an unopened waiting file. Every card status inside an opened retired folder is void.
  The hook and the integrity check do not count inside `.stale` folders
- File base names and numbers are immutable identifiers. No renumbering, no reuse.
  Mid-insertions use the `02.2b` form
- Record files that are not cards (`verify.md`, etc.) carry no status suffix and are
  excluded from status judgment

## Commit Discipline

- **Layer 0 commit**: product, arch, design, and adopt land each core document in one
  commit immediately after the user confirms it — message `<skill> — <document filename>`
  (adopt lands all adoption documents together as `adopt — layer 0`). A document created
  alongside another (glossary.md with product.md) rides the same commit. A single-field
  completion of an existing document uses the same message form. In multi this commit is a
  binding decision.
- **Planning commit**: split bundles newly created or revised pending cards,
  user-confirmed card-dependency format corrections, tree structure, card Approval and
  Review, arch.md `Settled by` replacements, verify.md
  failure or adopted-finding routing, and deletion of a layer-opening marker in one
  commit. It needs no completion signal because it is not an
  implementation result. Message: `split — <opened layer>`. A promotion's `NN.N promote`
  is the dedicated message for the same commit class. In multi, it lands on the
  integration branch as a binding decision.
- **Routing write order**: once the exact result of a Failure-history or adopted-finding
  route is determined and required user approval is complete, replace `routing: pending`
  with `routing prepared: <JSON object>` before output. The object has exactly one each of
  the keys `base`, `result`, and `operations`, and no others. `base` is the unabbreviated full
  commit object ID output by Git for HEAD immediately before that replacement. `result` is one of `routing: fix
  cards <card number>(+<card number>)*`, `routing: documents <JSON array of exact
  devflow/project paths>`, and `routing: product re-run <journal timestamp>`. In the first
  form, `*` is notation rather than a recorded character: write one or more exact card
  numbers, prefixing every number after the first with `+`.

  `operations` is a JSON array in application order. Each member is exactly one of
  `{"op":"write","path":<path>,"content":<final UTF-8 string>}`,
  `{"op":"move","from":<path>,"to":<path>}`, and
  `{"op":"delete","path":<path>}`, with only the shown keys. Paths are repository-relative
  `/` forms that begin with `devflow/` and are neither absolute nor contain `..`. A write or
  delete never targets the current verify.md. A move may rename an ancestor status path of
  that file; the current verify.md path then follows beneath the new ancestor. A write
  creates required parent folders and creates or replaces a regular file. A move renames an
  existing status path to an absent path. A delete removes an existing regular file. Every
  member must change its input tree, and
  the full array must apply without error and produce only outputs required by the selected
  canonical route.

  Draft cards written before the execution proposal must be protected by a committed layer-
  opening marker and exactly represented by the first write operations. For an uncommitted
  prepared object, HEAD must equal `base`. If the object was committed to HEAD in violation
  of this rule, that commit's first parent must equal `base` and the current verify.md must
  contain the same object. Apply operations in order to the `base` tree and track the current
  verify.md path through each ancestor move. For comparison, change only that file's one
  exact `routing prepared` field back to the same source's `routing: pending` value from
  `base`; exclude no other byte. The whole difference between `base` and this normalized
  checkout tree, including staged, unstaged, and untracked paths, must equal exactly one
  prefix, including the tracked path move. Anything else is an integrity anomaly outside
  the payload. Without
  committing the prepared object again, apply only the remaining suffix, change the tracked
  verify.md's prepared object to the
  completed state named by `result`, and land all of it in the one specified commit. Never
  select a new route or create the output twice.
- **1 task = 1 commit.** Commit only after the completion signal passes (see the
  exception below when only remote evidence remains). The message is exactly the card H1
  with only `# ` removed, such as `02.2 signup API`; multi prefixes `<claim id> `.
  The card stays claimed after the final task commit until boundary cleanup. When the
  last commit that changed it has this exact subject, the final task commit is complete:
  that commit includes the claimed card and its progress log at that point. work does not
  make it again and finishes only upper-document feedback and the boundary.
- **Canonical claim→done move**: the claimed card path in HEAD is absent from the working
  tree, exactly one `.done.` card in the same parent has the same number and name, and the
  two files are byte-identical. Whether git reports a rename or a deletion plus untracked
  file is not part of the judgment. An uncommitted move is an unfinished boundary.
- Mid-checkpoint commits for long tasks are allowed as `02.2 wip: <what>`.
- When only remote evidence (CI, etc.) remains in the completion signal: get the review
  first, then commit the code and progress log as an `NN.N wip: evidence-wait`
  checkpoint. Immediately before that commit, append the exact line below to the progress
  log. `check-json` is a JSON string containing one exact command or URL that returns the
  remote result.

  ```text
  YYYY-MM-DDTHH:MM:SSZ remote evidence check: check-json: <JSON string containing the exact remote-result command or URL>; verdict: unrun | pass | fail | pending | inaccessible | no-verdict; detail-json: <JSON string containing result detail>
  ```

  In multi, before writing journal or any other boundary change, integrate the current
  branch through that checkpoint by arch.md's `merge` method. If rebase changes the hash,
  use the changed hash. Put that hash in the canonical `evidence-wait` line, land the line in a
  `boundary — evidence-wait <number>` commit, and push both commits. The card stays
  `.wip.`. If interruption occurs after the checkpoint but before the record commit,
  work finds that exact checkpoint and finishes only the line, record commit, and push.
  Parse `card-json` and `check-json` as JSON; do not split them on delimiter text.
  The checkpoint's exact message is `NN.N wip: evidence-wait` in solo and
  `<claim id> NN.N wip: evidence-wait` in multi.

  Immediately before the checkpoint, use `unrun` and an empty string for `detail-json`.
  To process the evidence, run the command or open the URL and append a new line in the
  same format with the current verdict and detail. A pending result retains the journal
  line and card. A pass replaces
  `evidence-wait` with `evidence-finalizing`, preserving the other fields, in the final
  task commit. A committed `evidence-finalizing` line means the task commit is complete
  and only upper-document feedback and boundary cleanup remain. work never reruns the
  completion signal; it renames the card `.done.` and deletes that line
  in the boundary commit; it does not make the final task commit again. A fail records the result in the progress log and
  deletes the line in an `NN.N wip: remote evidence failed` checkpoint, then returns to
  the failure ladder. An inaccessible pointer or one with no verdict is unverified and
  retains the line.
- **Boundary commit**: bundle status renames, HANDOFF, journal, verify.md, and documents
  fixed by upper-document feedback (see work) into one commit. Message: `boundary — <what closed>`.
  HANDOFF never gets a dedicated commit — it only rides here.
  multi: if a task boundary records a final task commit or checkpoint not yet on
  integration, first integrate the current branch through that commit with arch.md's
  `merge` method before writing any status rename, HANDOFF, journal, verify.md, or feedback
  document change to the working tree. Documents already landed on integration as binding
  decisions do not ride again — the boundary commit carries renames, HANDOFF, journal,
  verify.md, and the marker only.
  `merge-commit` makes a non-squash merge commit on integration; `rebase` rebases the current
  branch onto the fetched integration tip, then fast-forwards integration. If rebase changes
  a checkpoint hash, write the changed hash to journal. Only after the commit recorded by
  the boundary is an ancestor of the integration tip, create the boundary commit on that
  branch. A boundary with no task commit to record is created there directly. Then route
  the next stage.
- **Verification-state commit**: land product verification running, result, and reported
  states respectively as `boundary — product verification running`,
  `boundary — product verification result`, and `boundary — product verification reported`.
  Land a capability verification's fail or unverified result, and a pass result with a
  closure-gate failure, as `boundary — capability verification result <capability number>`.
  Land an Audit/Retrospective event's pending, result, and decision states respectively as
  `boundary — verify event <Audit|Retrospective> <source id> <pending|result|decision>`.
  In multi every verification-state commit, including `boundary — verify source ids`, is
  shared state, so land it on the integration branch. A working-tree state that one of these
  commits, or the `boundary — begin <capability number>` commit, specifies before that commit
  lands is a **canonical verification-state transition**; a consumer finishes its specified
  commit first without re-executing.
- **git belongs to the main session.** Subagents implement and write the progress log —
  they never commit, rename, or push.
- multi: prefix commit messages with your id — `<id> 02.2 signup API`,
  `<id> 02.2 wip: ...`, `<id> boundary — ...`. Solo formats are unchanged.
- multi: a **binding decision** — one that affects shared documents, tree structure or
  numbers (folders, minting), a card someone else claims, or the initial
  `.wip-<my id>.` claim rename. Other status renames of my claim already visible on
  integration are not binding decisions. Land a commit containing only the files that constitute that decision on
  the integration branch (arch config) now. For a planning commit, the whole bundle
  enumerated above constitutes that decision. No unrelated change rides along. Everything else
  rides your own branch. Do not start implementation until the initial claim commit has
  landed on integration and the current branch contains that integration tip.
- multi: if pulling integration shows someone else's claim already landed on the same
  number, you lost — copy your progress log into the surviving card and step back.
- multi: duplicate numbers from concurrent minting — the later-merged side moves to the
  mid-insertion form (`03.2` → `03.2b`). Allowed only before `.done.`; 1 journal line.
- multi: journal merge conflicts resolve as a union — keep both sides, date-ordered.
  Squash merges are forbidden (they erode every rule built on `NN.N` history) — the
  policy is declared in arch's config.
- To undo, use a revert commit — never erase history.

## The Verification Iron Rule

**What was not executed is not "passed" — it is "unverified."**
Reading the code and thinking "it looks right" is not a verdict.
