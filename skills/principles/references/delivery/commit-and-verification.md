# Commit and verification policy

## Commit Discipline

- **Consume staged contract checks at the commit boundary.** After staging exactly the
  paths named by the current commit rule, run `node "<skill-root>/../principles/scripts/project-state.mjs"
  check-staged --root "<project-root>"`. Commit only on exit 0 and without changing the index.
  On failure, repair the reported staged bytes and rerun. The check reads only staged journal
  and Product index bytes and does not intercept other Git clients.

- **Every devflow commit carries only its own paths.** Whatever else this working tree has
  staged, a commit contains exactly the paths its own rule names — a file another flow in
  the same folder staged earlier never rides along.
- **Layer 0 commit**: product, arch, and design land each core document in one
  commit immediately after the user confirms it — message `<skill> — <document filename>`
  A document created alongside another (glossary.md with product.md; an owner document's K
  nodes with that document) rides the same commit. A single-field
  completion of an existing document uses the same message form. This commit is a
  binding decision.
- **Initial-adoption commits**: one confirmation binds the complete approved Product,
  Architecture, applicable Design, code style, glossary, capability design zones, K nodes,
  and any exact follow-on marker. Adopt writes and validates that complete semantic set before
  the first commit, writes `product.md` last among the Layer 0 owners, and gives every capability
  `Design head: none`. It stages all approved owner documents, same-owner K nodes, and the optional
  marker, then lands `adopt — layer 0`. The Design head command's pathspec names only
  `product.md`, `arch.md`, and `glossary.md`, so the capability-only follow-up commit does not
  advance the landed commit selected by that command. Adopt replaces only each capability's Design
  head line with that landed commit ID, stages only those changed
  capability documents, and lands `adopt — capabilities`. Before the first Product or Adopt
  binding commit, its P2 effect plan materializes an absent resolved-actor room under the
  shared Identity and Rooms contract and stages that exact triple with the approved owner
  set; an existing room is preserved and omitted from staging. Refusal or interruption before
  approval writes nothing. The checkout remains unmanaged only while no current `.devflow` root
  or indexed path exists. Once either exists, canonical state owns recovery; a missing
  `product.md` alone does not make the checkout unmanaged.
  After the first commit, all approved meaning is
  canonical and `Design head: none` makes the baseline stale, so interruption routes through Resume
  to Arch without treating uncommitted bytes as recovery input.
- **Capability-design commit**: after every confirmed managed Layer 0 commit has landed,
  Arch writes the design zones for the expected capability documents as its final output.
  Land only those capability documents and their knowledge capsules as
  `arch — capabilities`; if no capability bytes change, do not
  commit. This is a binding decision.
- **Planning commit**: Direct bundles newly created or revised pending cards,
  user-confirmed card-dependency format corrections, tree structure, card Approval and
  Review, arch.md `Settled by` replacements, verify.md
  failure or adopted-finding routing, and deletion of every layer-opening marker it settles
  in one commit. It needs no completion signal because it is not an
  implementation result. Message: `direct — <opened layer>`. A promotion's `NN.N promote`
  is the dedicated message for the same commit class. It lands on the
  integration branch as a binding decision.
- **Routing write order**: once the exact result of a Failure-history or adopted-finding
  route is determined and required user approval is complete, replace `routing: pending`
  with `routing prepared: <JSON object>` before output. The object has exactly one each of
  the keys `base`, `result`, and `operations`, and no others. `base` is the unabbreviated full
  commit object ID output by Git for HEAD immediately before that replacement. `result` is one of `routing: fix
  cards <card number>(+<card number>)*`, `routing: documents <JSON array of exact
  .devflow/project paths>`, and `routing: product re-run <journal timestamp>`. In the first
  form, `*` is notation rather than a recorded character: write one or more exact card
  numbers, prefixing every number after the first with `+`.

  `operations` is a JSON array in application order. Each member is exactly one of
  `{"op":"write","path":<path>,"content":<final UTF-8 string>}`,
  `{"op":"move","from":<path>,"to":<path>}`, and
  `{"op":"delete","path":<path>}`, with only the shown keys. Paths are repository-relative
  `/` forms that begin with `.devflow/` and are neither absolute nor contain `..`. A write or
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
- **Progress log machine lines.** The progress log carries exactly four machine formats and
  this list is their only home — `completion signal result:` and `review result:` below,
  `carry:` in the next bullet, and `remote evidence check:` in the remote-evidence bullet.
  A progress line that starts with the canonical timestamp followed by one of those four
  heads stands in that format exactly. A line carrying one of those four heads that does not
  stand in its format is not prose — the state tool reports it as
  `integrity: kind=shape zone=progress-log`, and the work holding that card repairs it.
  Every other progress line is the implementer's prose.
  No machine format, no state-tool predicate, and no recorded result is ever derived from it
  — the four formats above are the whole machine surface, and nothing here adds a fifth.
  What such a line can still carry is a person's own authority: when a procedure asks for an
  explicit human disposition, the answer is one bounded ordinary line and a literal reader
  obeys it as the person's word. Position is its whole binding — same checkpoint,
  immediately after the line it answers — so it needs no format, no key, no new file, and no
  second writer. work fills the values when it actually runs the thing.

  ```text
  YYYY-MM-DDTHH:MM:SSZ completion signal result: head: <full object ID of HEAD captured just before that run>; verdict: pass | fail | unverified; detail-json: <short JSON string>
  YYYY-MM-DDTHH:MM:SSZ review result: head: <full object ID of HEAD captured just before that review input>; verdict: pass | objections | unverified; detail-json: <short JSON string>
  ```

  One line per run of the local completion signal and per clean review. A later line
  replaces an earlier result and no earlier line is deleted.

  `head:` is the full object ID of HEAD captured immediately before that run or review input.
  **`head:` is not the containing commit** — it is the base the execution actually saw, so it
  survives another flow's commit landing between the result and its anchor. When inputs
  change, a rerun writes a new line with its own `head:` and deletes no earlier line.

  Each result's revision anchor is the next canonical task commit that first carries that
  line — a descendant that still contains the line is not the anchor. The result rides that
  commit before the task diff changes and before this path leaves for a boundary or design
  commit. The four shapes are instances of that one rule, not exceptions to it: a
  straight-through final local `pass` and its clean review ride the final task commit;
  `fail`, `objections`, or `unverified` rides that card's `NN.N wip: <what>` checkpoint; a
  clean review on the remote-evidence path rides the `NN.N wip: evidence-wait` checkpoint;
  and a departure that stales the card rides its `NN.N wip: upper-document change`
  checkpoint.

  A reader holding only Git joins each anchor to the cumulative task commits from the claim
  through that anchor — the same card number's canonical `NN.N wip: <what>` commits and the
  exact card-title commit — so two or more checkpoints still reconstruct one whole attempt,
  and the interleaved boundary or design commits between them, whose subjects and owners
  differ, are not task diff. When only remote evidence remains in the completion signal, the
  six-verdict `remote evidence check` line below is its one producer: never write a generic
  completion line for the same result. A `waived` or `not-applicable` review stays owned by
  the card's `Review` field.
- **Carry line.** After the upper-document feedback judgment and immediately before the
  final task commit, work reruns the state tool and reads the current claimed card's
  `claim: kind=mine` line. When it says `carry=absent`, append exactly the line below to
  the progress log and rerun the tool. Continue only when `carry=present`.

  ```text
  YYYY-MM-DDTHH:MM:SSZ carry: <a fact that could make the next card in this depth-1 unit wrong | none>
  ```

  It holds only the residue with nowhere else to land — a trap local to this unit, an
  approach this card disproved, a measurement no document records. Anything the
  discovery→update table, journal, a capability document, or the code already received is
  not written here. The line rides the final task commit, so the canonical claim→done move
  stays byte-identical. If the exact-title task commit has already landed while completion or
  review evidence is unsettled, a later evidence-only line does not retract an earlier valid
  carry line. After that evidence settles, the boundary commit is the only late vehicle
  for a missing carry line and the byte-identical claim→done move under the closure
  conditions defined by the **Boundary commit** bullet; it never creates another exact-title
  task commit.
- **1 task = 1 commit.** Commit only after the completion signal passes (see the
  exception below when only remote evidence remains). The message is exactly the card H1
  with only `# ` removed, such as `02.2 signup API`.
  The card stays claimed after the final task commit until boundary cleanup. When the
  last commit that changed it has this exact subject, the final task commit is complete:
  that commit includes the claimed card and its progress log at that point. work does not
  make it again and finishes only upper-document feedback and the boundary. Compatible
  feedback lifecycle never reopens this commit: the first after-state whose compatible lines
  are all canonical, share one source, name each owner once, and resolve every owner path seals
  the complete exact-payload set for that source card in Git history. Malformed, mixed-source,
  owner-absent, or unattributable input stays unsealed and correctable. Current members continue
  routing and consumed members stay retired; after sealing, a later same-card owner, source
  revision, or coordinate paraphrase is an integrity failure, not another marker producer.
- **Canonical claim→done move**: the claimed card becomes a `.done.` card with the same
  number and name in the same parent, and the two files are byte-identical — that byte
  identity is the writer's contract. An uncommitted move is an unfinished boundary, and the
  state tool's `transition: kind=finish-boundary case=claim-done-move` carries that fact.
- Mid-checkpoint commits for long tasks are allowed as `02.2 wip: <what>`. The "current
  diff" any checkpoint-style commit carries always means the changes this session made
  for that card — the first bullet's own-paths rule, scoped to sessions.
- When only remote evidence (CI, etc.) remains in the completion signal: get the review
  first, then commit the code and progress log as an `NN.N wip: evidence-wait`
  checkpoint. Immediately before that commit, append the exact line below to the progress
  log. `check-json` is a JSON string containing one exact command or URL that returns the
  remote result.

  ```text
  YYYY-MM-DDTHH:MM:SSZ remote evidence check: check-json: <JSON string containing the exact remote-result command or URL>; verdict: unrun | pass | fail | pending | inaccessible | no-verdict; detail-json: <JSON string containing result detail>
  ```

  Before writing journal or any other boundary change, integrate the current
  branch through that checkpoint by arch.md's `merge` method. If rebase changes the hash,
  use the changed hash. Put that hash in the canonical `evidence-wait` line, land the line in a
  `boundary — evidence-wait <number>` commit, and push both commits. The card stays
  `.wip.`. If interruption occurs after the checkpoint but before the record commit,
  work finds that exact checkpoint and finishes only the line, record commit, and push.
  Parse `card-json` and `check-json` as JSON; do not split them on delimiter text.
  The checkpoint's exact message is `<id> NN.N wip: evidence-wait`.

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
  fixed by upper-document feedback (see work) into one commit. They are bundled because they
  are parts of one transition — committed separately, whatever is left over becomes an
  ownerless fragment for the next session. Do not count that bundle by hand: immediately
  before the commit, run the state tool again, and the boundary closes only when that
  transition's `missing=` is empty. When `handoff` is missing, refresh the HANDOFF that
  can ride this commit and rerun the tool. When `signal` or `review` is missing after the
  exact-title task commit, allow only the evidence-only producer; any branch that would
  create another checkpoint or task commit stops. Once completion is `pass`, required review
  is settled, the task commit is integrated, and HANDOFF is current, append a missing carry
  line when necessary and let that line plus the byte-identical claim→done move ride this
  boundary commit when upper-document feedback is `none`, or when it remains `compatible`
  but every exact member of the Git-sealed proposal set is consumed and no current marker
  from this card remains. This established-set arm consumes the settled lifecycle fact and an
  empty eligible set; it does not compare or reconstruct pending entries. Staling, design-note, later same-card introductions, unknown feedback,
  and unsettled evidence never close.
  Message:
  `boundary — <what closed>`.
  HANDOFF never gets a dedicated commit — it only rides here.
  If a task boundary records a final task commit or checkpoint not yet on
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
  Every verification-state commit, including `boundary — verify source ids`, is
  shared state, so land it on the integration branch. A working-tree state that one of these
  commits, or the `boundary — begin <capability number>` commit, specifies before that commit
  lands is a **canonical verification-state transition**; a consumer finishes its specified
  commit first without re-executing. For the `boundary — begin <capability number>` commit,
  the specified state is the passing verify.md record, one exact baseline path of the closing
  capability (absent, partial, or any bytes), and — when already created — the
  capability-closing record; the baseline predicates govern that baseline file's regeneration
  before that commit lands. Outside a canonical capability-design commit, the canonical human-deletion exception,
  restoration of one complete one-boundary file from a user-identified Git revision to its current expected path, or this begin transition, any
  `.devflow/project/capabilities/` diff is an integrity anomaly.
- **git belongs to the main session.** Subagents implement and write the progress log —
  they never commit, rename, or push.
- Prefix commit messages with your id — `<id> 02.2 signup API`,
  `<id> 02.2 wip: ...`, `<id> boundary — ...`. Every message form in this document names
  only the part after the id; prepend `<id> ` to all of them, and read every recorded
  subject the same way.
- A **binding decision** — one that affects shared documents, tree structure or
  numbers (folders, minting), a card someone else claims, the initial
  `.wip-<my id>.` claim rename, or a release that returns my claimed card to pending. Other status renames of my claim already visible on
  integration are not binding decisions. Land a commit containing only the files that constitute that decision on
  the integration branch (arch config) now — when integration cannot be written, the
  publishing paragraph's blockade rules outrank this "now". For a planning commit, the whole bundle
  enumerated above constitutes that decision. No unrelated change rides along. Everything else
  rides your own branch. Do not start implementation until the initial claim commit has
  landed on integration and the current branch contains that integration tip.
- If pulling integration shows someone else's claim already landed on the same
  number, you lost — copy your progress log into the surviving card and step back.
- Numbers are minted only on integration, so duplicates arise only while a card is pending
  and unclaimed. At that stage the later-merged side moves to the mid-insertion form
  (`03.2` → `03.2b`) with 1 journal line. Never renumber a card already claimed or
  finished; report it as an integrity anomaly — that number also lives in commit subjects,
  outside issues, and people's links, which fixing files and dependencies does not reach.
  A verify source id follows the same principle.
- HANDOFF merge conflicts take the side whose `# HANDOFF · <timestamp>` header is newer. A
  digest marker keeps the descendant hash (resume's marker rule).
- Journal merge conflicts resolve 3-way. Compare the conflicted region against the
  conflict's common-ancestor journal blob — the `git merge-base` commit for a merge, the
  replayed commit's parent for a rebase: a line present in the base and absent on
  one side was consumed — never restore it. A line absent from the base is an addition —
  keep both sides' additions in timestamp order, mine first on a tie. A union resolution revives already-consumed
  requests, and the same fix gets planned twice under a new number.
  Squash merges are forbidden (they erode every rule built on `NN.N` history) — the
  policy is declared in arch's config.
- To undo, use a revert commit — never erase history.

## The Verification Iron Rule

**What was not executed is not "passed" — it is "unverified."**
Reading the code and thinking "it looks right" is not a verdict.
