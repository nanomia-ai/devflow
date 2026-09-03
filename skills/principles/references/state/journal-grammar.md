# Journal grammar

## Document Hierarchy (the contract)

Whenever a canonical procedure says to write or append a journal line, create
`.devflow/journal.md` first when it is absent.

### Exact journal formats

The formats below are the sole canon for reserved journal records. Other skills fill in
their values; they do not redefine the formats. A line that starts with the canonical
timestamp or is led by a reserved headword below is the machine's — with a reserved
headword it stands in that format exactly, and with any other headword after the timestamp
it is a cross-task decision or an open item a person
must decide and carries one token exactly equal to an existing room's id (a substring is
not a match) — starting with the canonical timestamp and carrying that token are the two
checks "attributed" means. Every other line is a person's — it enters no judgment and
stays as it stands. `source-json` contains the whole of one
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

```text
YYYY-MM-DDTHH:MM:SSZ layer opening: parent: <.devflow/tree or folder path with status suffixes removed>; children: <number+number>; source-json: <JSON string containing the exact durable source locator>
YYYY-MM-DDTHH:MM:SSZ re-split pending: folder: <direct parent folder path with status suffixes removed>; stale: <number+number>; source: <.devflow/project file path>#<heading>
YYYY-MM-DDTHH:MM:SSZ maintenance routing pending: request-json: <JSON string containing the whole user request>
YYYY-MM-DDTHH:MM:SSZ product re-run pending: statement-json: <JSON string containing the whole disproved identity or success-criterion text>
YYYY-MM-DDTHH:MM:SSZ product verification requested
YYYY-MM-DDTHH:MM:SSZ product verification running: trigger: requested | automatic; product: <Product revision>; verification: <Verification revision>; code: <Code revision>
YYYY-MM-DDTHH:MM:SSZ product verification result: trigger: requested | automatic; product: <Product revision>; verification: <Verification revision>; code: <Code revision>; verdict: pass | fail | unverified
YYYY-MM-DDTHH:MM:SSZ capability closing: folder: <.devflow/tree/capability folder path with status suffixes removed>; head: <git rev-parse HEAD>; product: <Product revision>; verification: <Verification revision>; capability: <Capability revision>
YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole observation>
YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole confirmed statement>; card-json: <JSON string containing the whole task-card path>; code-json: <JSON array of the exact code paths>
YYYY-MM-DDTHH:MM:SSZ audit requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ retrospective requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ evidence-wait: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
YYYY-MM-DDTHH:MM:SSZ evidence-finalizing: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
YYYY-MM-DDTHH:MM:SSZ knowledge landing pending: owner: <canonical product, arch, design, or capability owner path>; writer: arch | adopt; source-json: <JSON string containing task-card path@unabbreviated committed source hash>
YYYY-MM-DDTHH:MM:SSZ compatible feedback pending: payload-json: {...}
```

`knowledge landing pending` is the sole knowledge-landing marker. Work, including a research
synthesis card, may produce it only after the conclusion and source checkpoint are durable.
State parses and enforces it but never produces it. A source may name several owners; each
owner has one marker and Arch consumes each independently while preserving the exact `writer`
as provenance. Current managed work writes `arch`; `adopt` is accepted only on legacy markers. Marker
deletion is valid only with that owner file's direct update, or with a K update whose final
`Source basis` names the same source and an exact line range. A compact owner update never
forces creation of a K. No residual marker family, route, token, or batch object exists.

`capability note` has two forms. The short form is an observation about a capability other
than the one being worked on, and that capability's next closure harvests it. The design form,
carrying `card-json` and `code-json`, is a confirmed Intent or Invariant of the capability
being worked on, and no commit basis is written into the line — the `NN.N wip:` checkpoint
that first holds that exact line is both the revision anchor and the card and code snapshot of
that moment, and the tool computes it.

When the semantic owner of a user-confirmed Intent or Invariant is a capability other than the
one being worked on, that statement is neither form of `capability note` — it lives as a named
open item. That open item has exactly one form:

```text
YYYY-MM-DDTHH:MM:SSZ <id> design open item: capability: <NN>; statement-json: <JSON string containing the whole confirmed statement>; card-json: <JSON string containing the whole path of the task card the confirmation happened on>
```

This is not a reserved headword — a line that opens this way and misses the form is still an
ordinary named open item and stops no entry. `<id>` must be one token exactly equal to an
existing room's id; a line whose token names no existing room is likewise ordinary and
unrouted. Only a line in this exact attributed form and present in HEAD is routed by the tool.
`capability` is the owner the statement actually belongs to, never
the number of the current card — one card carrying the work of several capabilities is not
split to land it. `card-json` is where the confirmation happened, not a snapshot basis, so the
line stands even after that card closes, and it carries neither code paths nor a commit basis.

Important project-term promotion has one definition-free transport form:

```text
YYYY-MM-DDTHH:MM:SSZ <id> glossary term: term-json: <JSON string>; definition-json: <JSON string>; capabilities-json: <JSON array of canonical capability numbers>; source-json: <JSON string containing one exact durable locator>
```

This is not a reserved headword. A malformed, uncommitted, or unknown-room line remains an
ordinary attributed item. Only a person-confirmed exact term, definition, and affected-capability set enters this form; `[]` means project root. The tool routes only the exact line in HEAD, registered capability numbers, and a source resolving once as `marker.glossary-term`. The line is interruption-safe transport to the glossary writer, not authorization for an observation to rewrite canon.


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
in the retirement commit every `evidence-wait` and `evidence-finalizing` journal line
that names a card inside the retired open folder. Before confirming a retirement, run the **retirement observation gate**: within
the current journal already read in full, enumerate every `capability note`
line carrying that capability's number — that observation's only consumer is that
capability's next closure, and a retired capability has none, so the line would stay
forever. Zero lines retire as they are. With one or more, put the user's chosen discard, or
reassignment to foundation or an exact non-retired capability number, in the same
retirement commit; when the user defers, the retirement defers too. product editing those
lines is the sanctioned exception to journal ownership, and automatic discard is forbidden.
split deletes the marker when the replacement cards' planning commit lands.

`Needs replacement work` has one test. It is needed when the changed upper-document
statement cannot be true together with the card's Destination, Forbidden, Completion
signal, or the implementation produced by that card; it is not needed when all can be true
together. If they cannot all be assumed true while card text and implementation stay
unchanged, rename the card `.stale.`.
