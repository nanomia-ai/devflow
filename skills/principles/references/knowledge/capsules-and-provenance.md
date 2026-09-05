# Capsule and provenance policy

## Domain knowledge capsules

The owner document is the map that is always read. A K node, called a capsule by the
tool, keeps one knowledge unit that the map should not carry: current material its readers
need together and would revise for the same reason. Split that knowledge unit only at an
independent reading and change boundary; length, headings, and keyword similarity do not
define the boundary. A knowledge unit keeps one current locus: when an existing K owns it,
every refresh updates that K at its existing path instead of moving or duplicating it. Measured basis: one real brownfield capability's domain source ran to
3,699 lines — pressed into a 185-line vessel as summary, what survives is confidence, not
understanding.

- A K node lives under its owner document's same-stem folder:
  `<owner path without .md>/K-<three digits, zero-padded>-<topic slug>.md`. Canonical owner
  documents are `.devflow/project/product.md`, `arch.md`, `design.md`, and
  `capabilities/<number>-<name>.md`; choose the nearest semantic owner — the document whose
  governing question the knowledge unit answers and whose readers need that answer. A child node lives
  in its parent's same-stem folder. K numbers are immutable and unique across the owner's
  whole subtree. An owner without K is the default; create K for a knowledge unit with its own reader
  and change reason, or when that knowledge would overflow the always-read map. On a capability
  rename, its folder follows the new name in the same capability design commit.
- The first two lines are prose and the third is blank. Line one is
  `# <what it is> · <when to open it>`, line two is
  `about: <the words a searcher would use that are not already in line one>`, and the body
  starts on line four. The owner identity and topic are already in the path, so they
  drop out of the first two lines. When the first two lines match this form, consumers open
  the body. When the shape differs, report the format anomaly in one line.
  The words in `about:` come first from that project's `glossary.md` — the words a project
  actually uses are the words a searcher uses. Proper nouns, error codes, and product names
  that the glossary does not carry are written as they are. Neither a word count nor a closed
  vocabulary is imposed.
- The body is free prose. No section structure, table, or fill-in form is imposed. The four
  words below are place names, not checked slots — write only the ones that apply, and give
  anything the four do not hold a heading of your own choosing. There is no checker.
  - `## Concept model` — how to see this area. It holds the sentence everything below stands on.
  - `## Decisions` — what was decided · why · what was dropped · when it reopens.
  - `## Reproducible scene` — a number, the run conditions under which it is true, and the
    command that measures it again, in one block.
  - `## Unknowns` — what is open and why it is open.
- Four for two reasons. At eight, "payment is idempotent" belonged to two sections and both
  answers were defensible, and a statement written in a different section each session leaves
  a refresh no place to overwrite. And the section count has to be small enough to almost
  always all apply, so that "this section has nothing to fill" stops being a question —
  measured, the fixed-slot form had 5 of 12 capsules pass with a slot filled by "could not
  fill this", and 0 defects were detected. There is no evidence four raises comprehension:
  four forms of the same material all scored 9/13 on the same 13 questions.
- The last line of the file is `Source basis: [...]`. It grounds the unmarked sentences at file
  level, and every element must be a
  string satisfying the coordinate grammar below — it is not a place for free description or
  a bare document name. **It cannot be empty**: a capsule is born only from processing a
  source (see "Creation and refresh inputs" below), so having no coordinate to cite means
  that capsule should not exist.
  **`validate` checks each element's path existence and line range with the same strength as
  an insertion coordinate** — unmarked is the default, so most of a capsule leans on this
  one line.
- The coordinate grammar is `<repository-relative path>[@<revision>]:<start line>[-<end line>]`.
  Anything that does not reopen an exact place for a person is not a coordinate.
- The authoring cap is soft at 120 lines per capsule — exceeding it never blocks the write;
  the writer reports it, and a split that would tear meaning apart is not made — the capsule
  stays with its reason. For example, a maintained normative document with one reading and
  change boundary remains one K past the cap; a subsection becomes a child only when it gains
  its own boundary.
- K nodes are written by the design-zone writer: Adopt only inside the initial unmanaged
  projection, otherwise Arch. They ride the same confirmation bundle and commit as their
  owner document: a Layer 0 owner's K in that owner's Layer 0 commit, and a capability's K
  in `adopt — capabilities` or `arch — capabilities`. Verify never writes K. The human
  deletion exception matches the owner document's.
- K nodes and the owner document are a derived account of the source documents, not
  their owner. Skills never delete, move, or edit the source documents a capsule was
  processed from — disposition is always a person's act.

### Provenance marks — unmarked is the default

When a reading session cannot tell what the source said from what the processor made,
smooth confidence replaces accuracy — in measurement, sessions reading only the processed
text answered a source contradiction as settled fact, while the control group that read
the source was more accurate in its honest not-knowing. So sentences are written unmarked
by default, and only a sentence departing from the default carries an opening bracket and
one closed head. There is no marking quota — a faithful capsule with zero marks is normal.

- Defaults: an unmarked sentence in a capsule body is source content within the
  `Source basis` coordinates, held with no more confidence than the source states. An
  unmarked sentence in the capability document's `Intent` section is the processor's
  synthesis — an overview is synthesis by nature, and marking every sentence there is
  noise. Sentences carried verbatim from the source are the ones marked, with quotes and a
  coordinate.
- The head literals are exactly four, ASCII everywhere in ko and en — a token a machine reads
  does not follow a human language. These four are themselves the canon of that discipline.
  Prose stays in its own language; only the head is ASCII.
  **This section is the canonical home of this vocabulary, and a head that is not listed here
  is rejected whether or not it carries a coordinate** — `conjecture` in particular is the
  only head with no coordinate, so a misspelling of it passing as unmarked would promote a
  guess into source-and-confident. Machines read only the head after the opening delimiter.
  - `(synthesis@<coordinate>[,<coordinate>]: free prose)` — this sentence is not in the
    source. The processor distilled it from those coordinates and the distillation basis
    follows as prose. One or two coordinates.
  - `(code@<coordinate>[,<coordinate>]: free prose)` — confirmed in code, not documents. It
    proves current behavior, never intent or a desired future.
  - `(conjecture: free prose)` — a judgment with no coordinate to pin it to. It carries no
    coordinate, and a later session must not cite it as fact.
  - `[dispute C-<three digits>@<coordinate>,<coordinate>: free prose]` — the source contains
    differing statements. Do not pick one side and smooth it over — keep both contents, each
    with its own coordinate; interpretation candidates (such as "these may be different
    scenes") may be noted, but no resolution. Two distinct coordinates are required; missing
    either is a format anomaly. A dispute is itself an item for a person to decide; before
  that decision no arm is cited as settled fact. C numbers are immutable and never reused
  within one owner document's K subtree.
- Source silence is written as a sentence, not a mark — "the source does not specify the
  mechanism" is a settled statement about the source. Marks carry only the three
  distinctions accurate prose cannot: a synthesized sentence looks identical to a quoted
  one, a preserved contradiction can be "fixed" in good faith by the next editor, and a
  guess hardens into fact within two sessions.
- Travel rule: when a capsule's claim moves into a card, a progress-log `carry:` line, or a
  delegation briefing, its mark moves with it. A dispute's two arms are never reduced to
  one in transit.

### Two worked capsules

The contract for the form is not a checker but the two capsules below. The first uses all four
words; the second uses two — what "write only the ones that apply" means is visible in the
second. In both, most sentences are unmarked. Both examples are capability-owned; a
Product-owned node has the identical form at `.devflow/project/product/K-001-<topic>.md`.

**One — `.devflow/project/capabilities/04-settlement/K-002-payout-hold.md`**

```text
# When a settlement payout is held and how the hold is released · open on a "the payout never arrived" inquiry
about: payout cycle, payout hold, risk review, KYC recheck, receiving account

## Concept model

Settlement is not an event where money moves; it is filling a box called a payout cycle and
then emptying it. Everything below stands on that sentence — while a cycle is open the balance
rises and falls, and only the balance at the instant the cycle closes becomes payable.

A hold attaches to a payout, not to a cycle. The cycle closes on schedule and one payout it
produced stays `held`. (synthesis@docs/ops/settlement-runbook.md@a41c9f2:88-140,docs/ops/risk-review.md@a41c9f2:12-31:
the runbook uses "hold" only as a payout status and never as a cycle status, and the risk
review document also calls the payout the unit under review.)

## Decisions

Cycle close and payout execution were separated, because risk review is a person's work and
cannot hold to a close time. The dropped direction was "keep the cycle open until review
finishes" — while a cycle stays open, that period's new transactions land in the same cycle and
the review set keeps growing. Reopen when: risk review gains an automatic judgment that
finishes inside the close time.

A person releases a hold. The dropped direction was "resume automatically when the reason
disappears" — risk review emits no event announcing that disappearance, so we would have had to
imitate the judgment. Reopen when: risk review emits a reason-cleared event.

## Reproducible scene

How many holds one cycle produces is the input to operations staffing.

    condition: 2026-07 cycle, 12,400 active merchants, risk rules v7
    command:   psql -c "select status, count(*) from payouts where cycle='2026-07' group by 1"
    result:    held 318 — 2.6% of that cycle's 12,207 payouts
               of those, 241 awaiting KYC recheck and 77 with a receiving-account mismatch

The set of hold reasons is fixed by code. (code@src/settlement/payout_state.py:44-79: the
`HeldReason` enum holds only `KYC_RECHECK`, `ACCOUNT_MISMATCH`, and `MANUAL`, and the two
numbers above are its first two.)

## Unknowns

When one payout is held across two cycles, which cycle's balance pays it is stated two ways.
[dispute C-003@docs/ops/settlement-runbook.md@a41c9f2:151-158,docs/finance/close-policy.md@a41c9f2:60-66:
the runbook says "the cycle at the moment the hold was released" and the close policy says "the
cycle that created the hold". The two documents may describe operations of different periods;
no choice is made here.]

Whether a failed payout becomes a hold or enters a separate retry queue is not yet confirmed.
(conjecture: failure codes do not use the same enum as `HeldReason`, which suggests a separate
path.)

Source basis: ["docs/ops/settlement-runbook.md@a41c9f2:80-170", "docs/ops/risk-review.md@a41c9f2:1-58", "docs/finance/close-policy.md@a41c9f2:40-96", "src/settlement/payout_state.py:1-120"]
```

**Two — `.devflow/project/capabilities/06-notification/K-001-delivery-retry.md`**

This capsule has no dropped direction and no open question. One concept and one number are all
of it, so it has two sections: `## Decisions` and `## Unknowns` are absent rather than standing
empty.

```text
# How many times a failed notification is retried and when it gives up · open on a "I got the alert twice" report
about: delivery retry, backoff, duplicate delivery, channel priority

## Concept model

A retry is not sending the same notification again; it is one delivery attempt chain. One chain
can carry several channels, and a chain ends exactly two ways: success or give-up. So a user
who received two alerts got two chains, not one chain going around twice — a duplicate report
is investigated at whatever created the chains, not in the retry settings.

## Reproducible scene

    condition: 2026-08-11 for one day, 1,840,552 delivery attempts, gateway sms-a
    command:   node scripts/notif-stats.mjs --day 2026-08-11 --by chain-outcome
    result:    1,802,301 chains — 1,799,657 succeeded, 2,644 gave up
               every give-up took 4 attempts, spaced 0s · 30s · 5m · 30m

The four intervals are constants in code. (code@src/notify/retry.ts:18-26: `BACKOFF_MS` is
`[0, 30_000, 300_000, 1_800_000]` and its length is the maximum attempt count.)

Source basis: ["docs/ops/notification-runbook.md@a41c9f2:31-92", "src/notify/retry.ts:1-64"]
```
