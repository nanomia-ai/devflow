# v0.11.0 Domain Knowledge Layer Redesign Implementation Report

Date: 2026-08-11
Target: implementation of the owner intent in `handoff-domain-knowledge_ko.md` and edition 2
of `plan-domain-knowledge_ko.md` in devflow's shared Claude and Codex deployment contract

## 1. Conclusion

The result is **not another relay layer that stores progress. It is one current domain
entry per capability.** It is born before the first card in a new project and immediately
after representative flows are reverse-derived in a brownfield. When capability
verification later passes, only knowledge obtained from actual code is rewritten into the
verified zone of the same file. work reaches it automatically through the depth-1
capability number instead of copying a path into every card.

The AI retains its domain judgment. The system strongly fixes only file identity, section
order, byte ownership, input sets, Git freshness, read bounds, and recovery transitions.
Within the prescribed evidence and caps, the AI still decides how to summarize concepts and
which invariants matter. The section schema and exclusion column carry the content boundary,
without adding another layer of judgment terms that would turn the prompt into patches.

## 2. Final Structure

### 2.1 One file, two zones

The path is `devflow/project/capabilities/NN-<name>.md`. Foundation is always
`01-foundation.md`. Exactly one `## Verified state` H2 in the file is the byte boundary.

| Zone | Writer | First moment | Later moment | Trust input |
|---|---|---|---|---|
| Design zone | arch, or adopt in a brownfield | after confirmed Layer 0 | whole replacement when Layer 0 capability design changes | `Design head` over product.md · arch.md · glossary.md |
| Verified zone | verify | initialized as an empty scaffold, then filled at the first capability pass | whole replacement at every passing capability closure | `Scope head` · `Covered cards` · `Verified at` |

The initialization exception lets arch or adopt create the empty verified scaffold with an
absent file, or after the user explicitly chooses to discard old verified prose in a
boundary-damaged file. After that, only verify writes from the boundary through EOF.
Conversely, verify never edits bytes before the boundary. The one-writer principle holds per
non-overlapping byte zone, rather than for the whole file. resume never writes the damaged
file; it only connects a complete restore from a user-identified known-good Git revision or
a data-loss-explicit reset. The reported HEAD blob ID is provenance, not a presumption that
the currently damaged blob is itself a valid repair source.

### 2.2 Document contract

The implementation does not copy the plan's “13 sections and one seven-field block at EOF”
literally. That shape would put two arch-owned fields inside the suffix verify replaces and
reintroduce overlapping ownership. The implemented contract preserves the content sections
while physically separating design and verification metadata: 14 contract rows and one
fixed boundary.

| Range | Includes | Excludes |
|---|---|---|
| First 4 lines | number and name, purpose, boundary, trust notice | relative claims such as “latest” |
| Design body | concept model, capability-specific invariants, non-goals, ADRs cited by current statements | code type and field inventories, features not built yet, rules equally true of other capabilities |
| Verified body | actual main flow, lifecycle when needed, user actions, exact entrypoints, consumed contracts, reproducible traps, verification run this time | planned behavior, wording-only or layout-only changes, whole related folders, history of past passes |
| Metadata | capability number, two heads, verification time, covered cards, scope and consumed paths | version fields, progress, assignee, next work |

The approximate 45-line design zone plus 140-line verified zone, about 185 lines total, is a
reporting cap rather than an automatic cut. An over-cap write succeeds and reports the exact
section plus its row, node, or step count. Splitting a capability is a product change and
therefore remains a user decision.

### 2.3 Freshness and hypotheses

The design zone stores the last commit touching product.md, arch.md, or glossary.md. The
verified zone stores the last commit touching `Scope paths ∪ Consumed paths` and the current
completed-card set. If the union is empty, the system does not run pathless `git log -1` and
stores `none`. A mismatch between stored and current values makes only that statement group
a hypothesis.

A hypothesis is not failure or deletion. Immediately before use, a design statement is
reconfirmed at an exact Layer 0 section, while a verified statement is reconfirmed in code
or a card inside the existing read set. A baseline is not canon: current code wins a code
conflict, and the document hierarchy resolves a binding-decision conflict. Binding ADRs are
not part of either head set; each exact path is checked when the file is read. This avoids an
over-harness where one ADR needlessly makes every capability hypothetical.

### 2.4 Automatic reachability and relationships

work takes the leading number of the ancestor directly below `devflow/tree/` in the claimed
card path, compares it as an integer, and opens exactly one same-numbered baseline. split does
not duplicate baseline or ADR paths into cards. For a domain question, resume selects one
file by semantic foundation intent, standalone `01`, a complete product.md capability name,
or a standalone number. With zero matches it presents foundation and non-retired candidates;
with multiple matches it presents only matched candidates, and opens no body before the
answer. It opens the whole expected set only when the user explicitly requests that set.

A relationship's machine identity lives once, on the consuming capability, as an exact path
in `Consumed paths`. The same-order Consumed-contract row is its human projection of path,
provider number, and expectation. That path participates in verification freshness but does
not enlarge Standards or Audit capability code scope. At provider closure, split, or
retirement, the system projects bounded metadata plus those table path/number columns and
reports registered consumers with their current states in one line.
It does not automatically execute another capability's verification or create a card.

## 3. Owner Intent I1–I7

| Intent | Implementation evidence | Verdict |
|---|---|---|
| I1 · Accumulate from MVP planning | arch creates the expected set after Layer 0 and before the first split | satisfied |
| I2 · Infer domains from product and arch | design-zone inputs are fixed to product.md, arch.md, and glossary.md | satisfied |
| I3 · Add, remove, rename | addition, split, retirement, and rename each have number, commit-order, consumer-report, and recovery rules | satisfied |
| I4 · Reach without instruction | work's depth-1 number rule and resume's domain-entry branch replace card wiring | satisfied |
| I5 · Grow expertise by capability | every passing closure replaces the verified zone from current code, and the next card consumes it automatically | satisfied |
| I6 · Unambiguous prompt | fixed boundary, exact paths, integer numbers, head commands, and bounded projections reduce judgments to disk conditions | satisfied |
| I7 · Verify flows | new-project, brownfield, upgrade, team, accident, relationship, AI-entry, and inheritance lifecycles were walked | satisfied |

## 4. D1–D25 Decision Ledger

| Decision | Final choice | Reason and landing point |
|---|---|---|
| D1 | Option E | design intent and verified fact share one file in separate zones |
| D2 | final separate arch/adopt commit | Layer 0 must land before `Design head` is calculated or the document is stale at birth |
| D3 | remove the switch | always-on creation gives automatic reachability and one upgrade lifecycle |
| D4 | number keying plus resume entry | both work and explanation requests reach one file without card-field duplication |
| D5 | about 185 lines | a reporting cap preserves fixed cost without truncating the actual domain explanation |
| D6 | prohibit chronology | tree, cards, journal, HANDOFF, and Git already own those distinct states |
| D7 | adopt a foundation document | observe shared-boundary discovery cost while retaining it as the first cut candidate because it has no independent verification boundary |
| D8 | create on addition/split, preserve on retirement | ordinary entry excludes the file without losing number or history |
| D9 | schema as filter | section forms, exclusion columns, and caps decide admissibility instead of T1–T3 judgment terms |
| D10 | reconfirm through entrypoint and consumed paths | only exact paths open, preventing freshness recovery from becoming unbounded search |
| D11 | no new change mechanism | the symmetric difference of current completed cards and `Covered cards` reports additions and exits |
| D12 | relationship layers 1 and 2 plus report-only layer 3 | automate understanding and freshness, but defer execution expansion until observed evidence |
| D13 | S3 at product retrospective over exact provider–consumer pairs, S4/S6 through path projection, S5 through number plus whole re-derivation, no S7 execution | do not claim detection without input; use the mechanism matching relationship identity |
| D14 | inherit all 18 properties | the 17 original properties and self-healing are mapped in a separate table |
| D15 | fixed first 4 lines | show purpose, implementation target, and ownership boundary first, then enter core concepts immediately |
| D16 | fixed trust notice | put non-canonical standing and both zone trust states on the first screen |
| D17 | adopt writes brownfield design zones | reuse representative-flow traces and add an upgrade branch that does not reverse-derive Layer 0 again |
| D18 | exclude decisions | ADRs are checked by direct path; there is no failure path justifying making every capability hypothetical |
| D19 | separate `Consumed paths` | consumer paths do not contaminate Standards or Audit scope |
| D20 | one-line consumer report | removes an N-consumer verification expansion and bounds execution cost |
| D21 | reviewer gets design zone, Binding ADRs, and one projection | avoids judging a hypothesis as fact, retains exact binding intent, and does not duplicate verified input |
| D22 | event-specific baselines for retrospector | one file for a capability event, the full expected set for a product event, plus Design head sources and freshness |
| D23 | retain the baseline name | renaming installers, tests, and docs would cost more than the naming precision gained |
| D24 | no planned flow or entrypoint in design zone | avoids duplicating concepts already in product.md, arch.md, and the later verified zone |
| D25 | proposal is historical | moves the executable contract and its test pins into the canonical baseline predicates |

## 5. Change Surface by File

| File group | Change |
|---|---|
| `skills/principles/baseline-predicates*` | sole executable canon for expected set, 14 contract rows, two zones, freshness, writers, automatic reads, relationships, lifecycle, and recovery |
| `skills/principles/SKILL*` | switch removal, zone ownership, two-commit rename, split/retirement consumer projection, allowed-diff exceptions |
| `skills/product/SKILL*` | append-only capability list, retirement, arch-contradiction-first judgment, brownfield-aware document refresh routing |
| `skills/arch/SKILL*` | expected design zones after Layer 0, final `arch — capabilities` commit, brownfield delegation to adopt |
| `skills/adopt/SKILL*` | reverse-derived design zones from representative flows and document-only upgrade branch for existing brownfields |
| `skills/split/SKILL*` | removal of per-card baseline wiring and simplification around automatic number consumption |
| `skills/work/SKILL*` | automatic one-baseline and exact-ADR reads, hypothesis reconfirmation, reviewer projection, missing/duplicate recovery |
| `skills/work/reviewer*` | explicit judging of fresh, hypothesis, and baseline-missing design projections plus exact Binding ADRs |
| `skills/resume/SKILL*` | domain-entry questions, ordinary shape-only reads, upgrade/damage/missing routes, active-work priority |
| `skills/verify/SKILL*` | whole verified-zone replacement at pass, begin co-commit, no-op on anomaly, registered-consumer status report |
| `skills/verify/retrospector*` | event-specific baseline and Design-head-source input with product-event-only cross-invariant strain detection |
| `docs/capability-knowledge-proposal*` | removal of executable sections, retaining only grounds, alternatives, and rejection lineage |
| `docs/design*` | active decisions and refutation of the v0.10.0 one-writer rejection lineage |
| `README*` | human-facing greenfield, mid-project, brownfield, and domain-entry usage plus project tree |
| `scripts/extract-adopt-reference*` | bounded arch-reference extraction ending before the new capability-document procedure |
| `scripts/repository-invariants.test.js` | replacement of proposal wording pins with canonical contract, consumer, and lifecycle invariants |
| `codex/install*` | baseline companion embedded only in arch, adopt, resume, and verify |
| both plugin manifests | behavior version synchronized at v0.11.0 |

## 6. W1–W8 Lifecycle Walks

| Walk | Literal execution result | Verdict |
|---|---|---|
| W1 · New MVP | confirm product → arch Layer 0 commit → final expected-documents-only commit → split → work auto-read → pass refreshes verified zone | defined |
| W2 · Brownfield | adopt confirms Layer 0 and representative flows → separate final design-zone commit → maintenance card → first pass fills verified zone | defined |
| W3 · Existing-project upgrade | resume shape projection detects absence or exact legacy → Brownfield value selects arch/adopt creation or mechanical migration → no interview or reverse-derivation repeat | defined |
| W4 · Team | design-zone commit is a binding decision on integration branch, work reads one local file by claimed-card number, digest rules remain unchanged | defined |
| W5 · Accident | interruption between Layer 0 and document commit recovers through Design head mismatch, design diff regenerates only a canonical prefix, boundary damage uses user-selected known-good restoration or a data-loss-explicit reset | defined |
| W6 · Relationship | exact consumed path and current provider mapping lower freshness, before/after scope union preserves consumer reporting, no automatic verification | defined |
| W7 · AI entry | resume opens one file by foundation intent, complete name, or standalone number; zero or multiple matches ask from bounded candidates before both freshness states are explained | defined |
| W8 · Inheritance | all 18 properties map to canonical text in the next section | defined |

## 7. S1–S8 Relationship Scenarios

| Scenario | Implemented result | Automatic execution |
|---|---|---|
| S1 · A contract change affects B | B's `Consumed paths` participates in Scope head, so B's verified statements become hypotheses | none |
| S2 · B begins consuming A | the next B pass records the path; the next A closure finds B through machine projection | none |
| S3 · conflicting invariants over one entity | only a product event pairs a consumer with the provider named by its exact consumed path and other-capability number, and only Layer 0/ADR-reconfirmable design invariants become strain evidence | retrospective report only |
| S4 · A retires while B consumes it | A's stored pre-retirement Scope paths keep B reportable | none |
| S5 · A is renamed | the number relation remains and all design zones are re-derived, updating B's neighbor name; no projection is needed when code ownership paths stay put | none |
| S6 · A splits | exact old/new paths plus affected stored scopes report consumers | none |
| S7 · A↔B cyclic consumption | there is no recursive execution, only one machine projection, so no loop occurs | none |
| S8 · incomplete B | B's current state is reported only as fresh, hypothesis, or unknown, without execution | none |

## 8. Coordinate Sweep

### 8.1 Zone × writer

| Actor | Create design | Replace design | Initialize verified scaffold | Replace verified | Edit other zone |
|---|---|---|---|---|---|
| arch | greenfield | greenfield | absent file or confirmed boundary reset | not applicable | forbidden |
| adopt | brownfield | brownfield | absent file or confirmed boundary reset | not applicable | forbidden |
| verify | not applicable | not applicable | not applicable | capability pass | forbidden |
| resume | not applicable | not applicable | not applicable | not applicable | report and route only |
| work/reviewer/retrospector | not applicable | not applicable | not applicable | not applicable | read and judge only |
| person | not applicable | not applicable | not applicable | not applicable | confirmed deletion only, zero added lines, no path move, no mixed change |

### 8.2 Event × project context

| Event | Greenfield solo | Greenfield multi | Brownfield solo | Brownfield multi |
|---|---|---|---|---|
| Initial creation | final arch commit | arch binding decision on integration branch | final adopt commit | adopt binding decision on integration branch |
| Layer 0 change | arch whole re-derivation | re-derive after integration | arch changes structure, then adopt re-derives | adopt re-derives after structure decision integration |
| Capability pass | verified zone in verify begin | same begin after integration gate | verified zone in verify begin | same begin after integration gate |
| Rename | arch path move after name decision | arch after name decision integration | adopt path move after name decision | adopt after name decision integration |
| Split/add | preserve old number and create new number | integrate same decision | adopt creates new expected file | integrate same decision |
| Retirement | file unchanged, leave expected set | same | file unchanged, leave expected set | same |
| v0.10.x upgrade | arch document-only | arch binding decision | adopt document-only | adopt binding decision |
| Boundary damage | whole repair after user confirmation | integrate confirmed repair | whole repair after user confirmation | integrate confirmed repair |

Every cell is defined or not applicable. No cell writes through AI judgment without a
canonical transition.

### 8.3 State × consumer

| State | work | reviewer | resume domain answer | retrospector | verify consumer report |
|---|---|---|---|---|---|
| fresh | use as current statement | judge as current design | explain as current fact | eligible strain evidence | fresh |
| hypothesis | reconfirm at exact authority | requires reconfirmation path to pass | label as hypothesis | verified statement cannot be evidence | hypothesis |
| baseline missing | continue from Layer 0 and card | absence alone is not an objection | expected path and repair route only | no input | unknown |
| shape anomaly | no selection or write | no input | bounded metadata and repair proposal | no input | unknown |

The three verify-consumer report states are not judgment words. `fresh` requires a non-`none`
`Verified at`, a nonempty Scope-and-Consumed-path union, current Scope head and completed-card
set equal to their stored values, and agreement among `Consumed paths`, Consumed contracts,
and the current arch provider mapping. If the required fields parse but any condition is
false, the state is `hypothesis`; an absent or unparseable field or an unexecutable Git
comparison makes it `unknown`.

## 9. 18 Properties Inherited from v0.10.0

| # | Property | Home in v0.11.0 |
|---|---|---|
| 1 | one file per capability and O(1) read per card | number-keyed auto-read and bounded path/number-column relationship report |
| 2 | whole replacement and no chronology | whole replacement per zone and exclusion list |
| 3 | mechanical freshness | `Design head`, `Scope head`, `Covered cards` |
| 4 | hypothesis demotion | three comparisons and consumer projection |
| 5 | not canon | current code and Layer 0/ADR precedence sentence |
| 6 | number is identity | integer comparison across file, tree, and product row |
| 7 | format anomalies and no version field | boundary/number anomaly definitions and fixed seven fields |
| 8 | structure first and first screen | fixed first 4 lines and section schema |
| 9 | four-column trap | symptom, reproduction condition, cause, alternative, and external URL |
| 10 | only a person deletes external | only a person authorizes deletion; verify preserves the HEAD row until then |
| 11 | Verify means actually executed | only commands and scenarios run at this closure |
| 12 | `None.` and no invention | exact empty-section value and prohibition on evidence-free content |
| 13 | do not block execution axis | missing, hypothesis, and refresh no-op do not block work or closure |
| 14 | byte stability | each writer wholly re-derives its zone |
| 15 | person edits by deletion only | body rows/items only, zero added lines, unchanged path, standalone diff; fixed skeleton, metadata, and the section's last item excluded |
| 16 | ride the begin commit | one begin contains passing verify.md, closing record, and verified zone |
| 17 | resume normally reads filenames only | body-free shape projection, domain question as bounded exception |
| 18 | self-healing | arch/adopt re-derive the whole design zone each run; boundary damage gets confirmed whole repair |

## 10. Defects Fixed in the Final Broad Revalidation

| Defect | Failure path | Fix |
|---|---|---|
| Layer 0 and document in one commit | stored `Design head` is stale immediately after commit | land Layer 0 first, then a separate final capability-document commit |
| verify preserves design bytes | malformed design shape survives forever | arch/adopt whole re-derivation, fixed H2, confirmed repair |
| content filters empty the contract | flows, behavior, and entrypoints discoverable from code all disappear | discard T1–T3; section form is the filter |
| regression per consumer | cost, routing, and cycles grow without a consumer bound | reduce to a one-line report from bounded metadata and path/number columns |
| pathless `git log -1` | empty scope is mistaken for the repository's latest commit | empty union means no command and `none` |
| one-commit capability rename | product change immediately stales the new document head | separate name decision from capability-design commit |
| brownfield arch/adopt dual writing | both skills own design bytes after structure change | arch changes Layer 0; adopt owns final document commit |
| baseline repair before active card | an upgrade interrupts claimed work | place repair rows after active claim and permit missing projection |
| damage report reads whole original | bounded resume rule grows with document size | report only path, boundary count, blob ID, and line count |
| consumer disappears after path move | consumer of the old path no longer matches the new scope | use union of before/after Scope paths |
| S3 claim outside product event | one-capability input invents a cross-capability conflict | restrict to product event, exact consumed path, other-capability number, and authority reconfirmation |
| “six-line design zone” | meaning conflicts with the actual six-section contract | correct the design rationale to “six-section” |
| English `indeterminate` | one concept has two names beside canonical `unknown` | standardize on `unknown` |
| English-only all-domain phrase | an explicit request in another language may be missed | use the semantic condition: explicit request for the full expected set |
| Trap and Verify deletion conditions combined | preserving past items contradicted Verify's “run at this closure only” contract | delete a Trap only when reproduction vanishes; replace Verify from this run every time |
| `None.` conditioned on “verified content” | empty design sections could be read through a verified-zone concept | make the condition zone-neutral: no admissible evidence-backed content |
| “core concepts in the first 12 lines” | Markdown headings and table headers make eight concepts physically impossible there | put Concept model immediately after the first 4 lines and order central concepts first |
| Fixed first screen lacked value forms | only the `Purpose`, `Boundary`, and `Trust` keys existed, allowing each AI to invent a shape | add the exact four-line deployed template to canon |
| Canon and work wrapped `Design head` after `--` | a literal executor could run it without path arguments | fix one command line containing all three paths |
| adopt tried to co-commit with Layer 0 after completion | the final capability-document commit had already landed before that instruction | persist a new-adoption marker before Layer 0; let split persist a document-only request next |
| No design-zone confirmation gate | arch/adopt could commit a bad compression of Layer 0 boundaries and invariants without owner review | derive in memory, confirm one batch, then write and make the final commit |
| Consumer projection after provider no-op | unusable before/after Scope paths could be misreported as no consumers | skip projection and report `unknown` with the same no-op reason |
| S5 explained as a code-path move | renaming a capability-file slug is not a move in `Consumed paths` code scope | state number identity plus whole design-zone re-derivation for neighbor-name updates |
| Human deletion included the fixed boundary | one legal deletion could create shape damage that stops both writers | allow body rows/items/nodes only; exclude fixed skeleton and metadata |
| `Concept model` and `conceptual model` coexisted | one section could be read as two concepts | standardize on the deployed heading `Concept model` |
| Domain entry lacked duplicate/shape-anomaly cells | a damaged selection or one bad file in a full-set request could invite guessed prose | gate each number by shape, open no anomalous body, continue valid files in full-set mode |
| Domain entry had no missing-ADR behavior | resume could search for a similar ADR or state design prose as fact | report exact path, demote design to hypothesis, forbid substitute search |
| Active work lacked boundary-damage behavior | work could guess a design zone at zero or two boundaries and brief reviewer with it | open no body, report bounded shape facts, continue with baseline-missing projection |
| “Capability documents only” conflicted with ADR co-commit | ADR supersession intentionally lands ADRs, cards, and capability paths in one binding decision | declare a separate mechanical exact-path-replacement exception |
| Boundary damage had no repair writer | resume only reported while arch/adopt always no-op, so no writer could execute a confirmed repair | resume offers only blob restoration or a data-loss reset; only a confirmed reset routes to arch/adopt's ordinary batch procedure |
| Damaged current blob named as repair source | restoring the same malformed bytes preserves the bad boundary count | report the HEAD blob only as provenance and first validate a user-identified revision's boundary count |
| No pre-tree name-suffix rule | two platforms with only product.md could mint two same-number files with different slugs | use the exact product.md name text that split uses in the tree and forbid separate normalization |
| No zero-match or single-foundation domain entry | “this domain” or foundation could fall into normal resume or invite a guessed document | bounded candidate question for zero or multiple matches, plus semantic foundation and `01` route |
| Reviewer input contradicted baseline-missing wording | it was told to use Layer 0 it never received, while exact Binding ADR bodies were absent | judge from the card and supplied shared documents, and add existing exact ADRs as bounded input |
| Retrospector lacked part of Design head authority | it could reconfirm a design hypothesis from partial product and arch while missing glossary drift | provide product.md, arch.md, glossary.md, and ADRs at both event scopes |
| Same-path provider reassignment was invisible | a split could leave the file path unchanged while arch ownership moved, presenting the old provider number as fresh | project Consumed-contract path/number columns and compare them with current arch mapping |
| Card change list showed additions only | a covered completion becoming `.stale.` or missing made the zone hypothetical while leaving an empty explanation list | report the symmetric difference with current path/status notation |
| Person deletes the last body item | a shape-valid deletion could leave an empty section and break the exact `None.` contract | exclude the last item from the deletion exception and route its `None.` replacement to the zone writer |
| Reviewer input said “every Binding ADR” | it could be read as an unbounded repository-wide search | supply only existing files at exact paths listed in the design zone |
| Consumer status omitted `Verified at` and failure branches | an empty scaffold could appear fresh, while `unknown` and `hypothesis` remained discretionary | canon fixes every fresh conjunct and the two failure branches |
| Retirement and split report depended on path-ownership change | registered consumers could go unreported when those events kept the same paths | make retirement and split unconditional; condition only other binding decisions on path ownership |
| Interrupted-rename prefix excluded the old path | after the product commit, deleting the old file could fall outside the known recovery state | allow old same-numbered deletion plus final-path addition and re-derive from the HEAD verified zone |
| No cardinality invariant joined `Consumed paths` to the contract table | machine identity and human-readable relation could name different consumers | require exact one-to-one rows in canonical path order and no extras |
| S3 compared consumers to one another | the real tension is between a consumer and the provider of its exact path | compare only that provider-consumer pair using the row's other-capability number |
| Whole replacement eroded an `external` Trap | a row that code cannot reconfirm could disappear at the next closure without human approval | preserve the HEAD row bytes and reserve deletion authorization to a person |
| Consumer projection had no candidate universe | it could include retired history or skip a missing expected file and report `none` | visit other non-retired expected numbers and stop unknown at the first zero, duplicate, or parse failure |
| No match set for retirement or split with unchanged paths | reporting was mandatory but no provider paths were defined for finding consumers | use the original capability's stored Scope paths |
| work's read list preceded its shape gate | it could open a damaged body's prose and ADRs before reaching the later no-read rule | select only the path up front; open body and ADRs after the gate |
| “Absent file” had two meanings in begin recovery | a deleted working-tree prefix could be mistaken for a missing-HEAD baseline no-op | separate working-tree state from HEAD source conditions and regenerate only from a unique one-boundary HEAD file |
| Domain entry omitted missing Layer 0 and foundation | with no product or no `01` file, it could open or invent a body | report uninitialized state, generalize absence to every selected number, and name each shape-specific repair owner |
| No commit boundary followed a person's direct deletion | the change could mix with work or be restored by HEAD-based design re-derivation | require a standalone deletion commit before the next skill |
| Paths were extractable from a damaged `Binding ADRs` section | one valid boundary could let AI guess a similar ADR from malformed prose | open only exact paths from a valid section; an unparseable section yields zero paths and a design hypothesis |
| v0.10 baseline paths remained in card `Read first` | work could open an old-format body before the shape gate or report the path missing after rename | treat the field entry as legacy wiring and use only automatic number entry |
| A valid v0.10 baseline was classified as boundary damage | the only offered reset discarded verified knowledge and regressed domain context immediately after upgrade | recognize only the exact 12-section, six-field predecessor; re-derive design and mechanically carry verified bodies plus compatible metadata |
| The v0.10 `Scope head` carried forward | the old value omitted consumed paths, so pairing it with new `Consumed paths: []` could label unobserved relationships fresh | discard the old head and migrate as `Scope head: none`, making verified statements explicit hypotheses until the next capability closure |
| Forbidden noun compound in the README | the new migration explanation used `capability closure` as an event noun and violated the human-facing prose rules | replace it with the verb form “that capability next passes verification” |

## 11. Verification Evidence

Implementation verification is grouped into one broad campaign after the whole change,
instead of restarting a campaign after every small fix. The campaign order is static canon
and Korean/English checks, literal lifecycle walks, over-harness audit, coordinate sweep,
and installed-output inspection.

| Check | Completion criterion | Result |
|---|---|---|
| Node repository-invariant and extractor tests | all pass | 52/52 pass |
| Korean/English structure and figure parity | headings, numbered lists, table rows, diagrams, and meaning-bearing figures 1:1 | every registered pair passes |
| Korean scan of English deploy artifacts | 0 except README's one language-switch line | 0 in each deploy artifact; exactly 1 in README.md |
| Skill frontmatter validation | every skill directory passes | 9/9 pass (`python -X utf8`) |
| Git diff check | zero whitespace errors | 0 in the tracked diff and new report pair |
| Codex installation | native plugin plus generated-prompt companion scope verified | install passes; 8 prompts; baseline only in arch, adopt, resume, and verify |
| Claude installation | native plugin install and discovery verified | 0.11.0 current; manifest validation passes; 9 skills and 1 SessionStart hook |
| Packaging invariants | manifests match and the Windows installer keeps its BOM | 0.11.0 = 0.11.0; BOM `ef-bb-bf` |
| README prose counts | 0 forbidden noun compounds and explained `—`/`**` change | README.md `—` 89→92 and `**` 105→107; README_ko.md `—` 59→62 and `**` 91→93; forbidden compounds 0→0 |

## 12. Read Cost

work's prior fixed card-read budget is about 16,600 tokens. Treating the 140-line verified
cap as about 2,000 tokens adds about 12%. Even if design and verification both fill the
185-line cap at about 2,640 tokens, the increase is about 16%. A small capability is lower
because empty sections contain `None.`. Every card reads one file, so the cost does not grow
with capability count N and remains O(1). Only a product-event retrospective reads the N-file
expected set, and that read is already bounded to an explicit product-layer event.

## 13. How the User Operates It

### 13.1 New project

Confirm the problem, capabilities, and boundaries in the product interview, then confirm
structure in arch. arch lands Layer 0 first and presents the foundation and every
capability's design zone. The user can focus on whether each first screen's purpose,
boundary, concepts, and invariants match their language. From split onward, work reads the
right document by card number without another instruction.

### 13.2 Project with existing code

adopt enumerates capability candidates from external entrypoints, top-level modules, and
existing documents, then traces one representative flow for each candidate. That evidence
produces Layer 0 and the design zones. Existing specifications are not copied; only their
exact paths are indexed under arch.md's `Existing records`. When the first maintenance card
passes, the verified zone is filled from actual code.

### 13.3 Joining mid-project or upgrading a v0.10.x project

Invoke resume first. If Layer 0 is complete but capability documents are absent, the
Brownfield value routes to arch or adopt for documents only. It does not repeat the product
interview or whole-code reverse derivation. A session that already owns a card finishes it
first, using the explicit baseline-missing projection so reviewer judges from the card and
the shared documents it actually receives.
An older card's baseline path in `Read first` needs no separate migration; it is deferred to
automatic number entry so it cannot become a second read route.
When an exact v0.10 baseline already exists, it is not discarded as boundary damage. arch or
adopt derives its design zone from current Layer 0 and mechanically carries the old verified
bodies, timestamp, card set, and scope into the new form. The old `Scope head` did not include
consumed paths, so migration sets it to `none`. The verified zone is a hypothesis immediately
after migration until that capability next passes verification and is refreshed under the
new contract.

### 13.4 Growing domain expertise

Do not manually accumulate domain knowledge in a second note. A card's completion signal
verifies real behavior; when the capability passes, verify wholly rewrites current flows,
behavior, entrypoints, contracts, traps, and verification methods. Later cards consume the
same numbered document automatically. An upper-design change makes only the design zone a
hypothesis; code, card, or consumed-contract changes make only the verified zone a
hypothesis, so just the needed statements are reconfirmed at current authority.

### 13.5 Natural-language prompts for domain explanation

Ask “Explain the payment capability,” “Before entering 05, tell me its boundary and traps,”
“Explain foundation's shared contracts,” or “Compare the boundaries and freshness of every
capability.” The first three open one file; the last explicitly requests the whole expected
set. If a name is absent or ambiguous, AI presents only number/name candidates first. The AI answers path → purpose and
boundary → concepts and invariants → verified current behavior and entrypoints → consumed
contracts and traps → both freshness states → the completed-card symmetric difference. It does not dress up a
hypothesis or `None.` as current fact.

### 13.6 Human editing boundary

A person confirms Layer 0 and the design zones and may delete a body row or item confirmed
wrong when that does not empty its section. For the last item, the writer skill replaces the
section with `None.`. Fixed skeleton and metadata stay untouched. The person making a direct
deletion commits it alone before the next devflow skill. The system does not commit that
deletion automatically or mix it with another change. New text and rewrites go through
arch/adopt or verify so the whole zone regains coherence. Start capability rename, split, or retirement with a product rerun instead of
moving files directly, so number, consumer, and recovery transitions move together.

## 14. Behavior on Both Claude and Codex

The executable canon lives in shared `skills/`, so platform meanings do not fork. The Claude
plugin reads companions by relative path. The Codex installer embeds the same companions in
generated prompts. Baseline predicates are embedded only for the design-zone writers arch
and adopt and the freshness/recovery consumers resume and verify. work and reviewer receive
only their bounded auto-read and projection rules instead of another full copy of the canon
on every card.

The product and arch references delivered to adopt are cut by the extractor at output
contracts. It now stops immediately before arch's new capability-document procedure; copying
that procedure would put another writer's instructions inside the adopt prompt. Both
manifests are v0.11.0 and point to the same SessionStart hook. The Windows installer's UTF-8
BOM remains intact.

## 15. Bounded Environment Limits and Settled Choices

These are not unresolved implementation defects. Canon defines either the safe degraded
behavior or the boundary where automation deliberately stops, and this release has no
remaining implementation action for them.

- There is not yet field evidence that the foundation document reduces rediscovery cost for
  shared boundaries. Its verified zone remains `None.` because it has no independent target
  to verify. D7 retains it; it is the first cut candidate if evidence disproves its value.
- Registered-consumer reporting is an awareness device. Do not automate cross-capability
  regression or card creation. That is the settled safe boundary until an observed miss.
- A shallow clone missing needed commits, paths not tracked by Git, and very long Windows
  path limits are existing Git operating constraints. Failure to obtain a head demotes the
  statements to hypotheses; it never masquerades as success.
- When dynamic dispatch cannot be represented by an exact file path, record it in `Consumed
  paths` only when current trace evidence can produce the path. Do not claim that an
  unrecorded relationship is absent.
- A product-event retrospective reads only the N non-retired expected documents defined by
  product.md. It does not expand into a repository-wide search.

## 16. Requested Claude Re-review Targets

These are not open findings. This verification compared every item with a deterministic
branch in canon; they are coordinates for an independent second attack. The highest-value
Claude review checks that the actual text closes the same paths instead of merely adding
more rules.

- Can HEAD alone recover exactly when a session dies between the Layer 0 commit and the
  capability-design commit?
- Does an old consumed path disappear from the one-line report after rename, split, or
  retirement?
- Does any path remain where arch and adopt write the same bytes after a brownfield
  structure change?
- Does reviewer block an active claim merely because its baseline is absent, or accept a
  hypothesis as fact?
- With zero or two `## Verified state` boundaries, does any writer guess a boundary?
- Does boundary recovery rewrite the same damaged blob or search history without a bound for
  a known-good source?
- Can reviewer and retrospector judge freshness and binding intent from only the inputs their
  contracts actually receive?
- Can a non-product retrospective invent an invariant conflict between two capabilities?
- Can a Korean user request fail domain entry merely because its wording differs from an
  English deploy-prompt example?
- Is any new sentence an over-harness whose deletion changes no execution path?

## 17. Final Judgment

The handoff's intended usability is implemented. Domain documents are born at project
inception, mid-project joiners enter through one page via resume, and each real capability
verification grows the page into current code-grounded expertise. The AI finds it
automatically without blindly trusting stale statements. System constraints are strong,
but they do not replace domain interpretation with a rule list, and relationship automation
does not expand ahead of observed evidence. At final verification, no known reproducible
defect or unresolved implementation path remains.
