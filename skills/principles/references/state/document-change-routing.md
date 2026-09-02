# Document change routing

Journal grammar owns the binding upper-layer transition and canonical journal markers; journal routing owns canon-conflict reporting.

A document states only the present. When the same concept is updated, overwrite the place
that concept lives — the concept, not the file. Then whoever reads next takes what they
read as current, with no version to choose between.

What can be overwritten is what can be recomputed. Execution results, observations, and a
person's confirmation are not recomputed, so land them where that fact lives in that
document before overwriting — the place differs by document, and the table just below names
which one. The number, the execution conditions under which that number is true, and the
command that measures it again go in one block — together they let the next person settle
it by measuring again.

One sentence separates an update from a drop — would someone reading the old statement now
take a wrong action? Then keep it as a dropped direction. Otherwise overwrite that place.

A dropped direction is a present fact, not a past one, and it lives beside the conclusion
it lost to — what was dropped, why, and what reopens it. Only the reading condition
differs: open it when you are about to reverse that conclusion.

At brownfield adoption, reconstruct from maintained documentation and/or code. Resolve only
what the combined evidence supports, ask a person about irreducible current-intent conflicts,
and keep the approved source dispositions and exact coordinates in arch.md `Existing records`.

Past versions are git's to carry. Name the overwritten concept in the subject of the commit
that overwrote it — that is git's index, and it is what lets ordinary reading end at the
current document.

What you discovered → where to update:

| Discovery | Update target |
|---|---|
| Feature, screen, or scope changed | product.md (+ mark affected cards that need replacement work `.stale.` + the `re-split pending` markers above) |
| A capability's name changed | first update product.md's capability row + the same-numbered tree folder or waiting file (a waiting file's body line takes the new name too) + every arch.md `Existing records` line naming it in one binding decision (+ replace any path inside that folder named by HANDOFF). The following Arch capability-design commit updates the same-numbered baseline path and design zone together. The baseline predicates own recovery between the two commits. Code paths and arch.md's Code structure keep naming what exists on disk, and that sketch entry still maps to this capability; moving code is a separate card. The number never changes and no card moves. Land the first commit only while no canonical journal marker or `evidence-wait`/`evidence-finalizing` line names that folder or a path inside it |
| A capability turns out to be two | product.md — narrow the existing row and append the new capability — and arch.md's Code structure for the path split. The existing folder keeps its number, cards, and history; the new capability gets no folder or card now. No card is backfilled or moved. Arch re-derives affected design zones and the new capability document and reports the canonical registered-consumer projection. When narrowing also changes the existing capability's name, use the rename row above too |
| Stack, module boundary, or data shape doesn't fit | arch.md (+ consider an ADR) |
| A value the upper document called provisional is now measured | that row of arch.md's Provisional table — **replace it, don't add beside it**. An ADR that assumed the old value gets a dated update note |
| A Provisional row's settling card is 'unminted' and the tree has reached its layer | create the settling card and replace 'unminted' in that arch.md row with its number |
| A design build result confirms or disproves design.md's source, token, component, or review-surface reference | If it remains true with the approved direction, replace only the exact one-line path, name, or command. If the direction of the Approach, Design source authority, Token strategy, Component strategy, Decomposition axis, or Review surface changes, first record it in a canonical `maintenance routing pending` line and re-run design through split 2a. After confirmation, split applies `.stale.` and the `re-split pending` marker above to affected cards that need replacement work |
| A success criterion turns out unrunnable as written | product.md (+ the cards that quote it) |
| A measurement disproves the content of the confirmed identity paragraph or a success criterion (not unrunnable as written — running it as written gives a wrong signal) | After user confirmation — if the replacement statement is settled, replace just that statement; if what replaces it is a planning question again, re-run product with the line below (and arch if the change reaches it). In either case, affected cards that need replacement work receive `.stale.` and the `re-split pending` markers above. The next session may take up the re-run on the strength of its line |
| The user changes a confirmed statement themselves, with no disproving measurement | That conversation IS the confirmation. If the replacement statement is settled, replace just that statement; if what replaces it is a planning question again, re-run product with the line above. Affected cards that need replacement work receive `.stale.` and the `re-split pending` markers above. When a related decision is recorded, overwrite it in place; `owner decision` is a sufficient one-line ground |
| A `.done.` card's completion signal turns out unrunnable | fix that card's signal text too — regression must stay runnable |
| A new coding-convention decision is needed | one line in code-style.md "Project choices" |
| A verification means is newly created or changed | the means line of arch.md's verify_channel |
| A file in arch.md's `Existing records` moved or no longer matches current code | replace or delete that exact path (+ `Read first` in pending or claimed cards carrying it) |
| A decision recorded in an ADR is reversed or no longer applies | overwrite that ADR in place with the decision that now holds, and add one dropped-direction line — what was dropped, why, and what reopens it. The ADR keeps its path, so every reference naming it stays valid |
| Product or arch confirms an important new term | at that stage's normal boundary, land its canonical `term: definition` in glossary.md and have Arch align the affected capability-header `Concepts:` values to that exact term |
| Capability, card, or work evidence confirms an important new term | commit the exact attributed `glossary term` line above. `marker.glossary-term` routes to Arch. Arch lands the glossary definition in a binding commit while retaining the line, then in the next capability-design batch updates every known affected `Concepts:` line and Design head and deletes the line. The marker preempts normal work between commits. `capabilities-json: []` still receives the design-head refresh |
| The task is merely bigger than expected | no document change — promote the card to a folder (split's promotion procedure) |
| An observation confirmed in code about a capability other than the one being worked on | one canonical `capability note` line in journal.md carrying that capability's number. Do not edit the other capability's document directly — its next closure harvests the line |
| The user confirms a statement belonging to the Intent or Invariants of the capability being worked on, with Layer 0 unchanged | one canonical `capability note` design line in journal.md carrying that capability's number, the confirmed statement, this card's path, and the exact code paths. It is durable only once one `NN.N wip:` checkpoint lands that line with the current card and the current code. Do not edit the capability document or a capsule directly — the tool routes that line and Arch rederives the design zone regardless of historical Brownfield origin |
| The user confirms a statement belonging to the Intent or Invariants of a capability other than the one being worked on | one named open-item line in journal.md in the exact `design open item` form above, carrying that capability's number, the confirmed statement, and this card's path. Not a `capability note`: the design form's capability is the one being worked on, and the short form is a code-confirmed observation the other capability's next closure harvests into its verified zone and deletes it in the same sweep. A statement a person confirmed is neither. The tool routes that line as `marker.design-open-item`, so neither a ready card nor a claim outruns it. The line stays until Arch, which owns every managed capability design-zone refresh, lands the statement there and deletes the line in the same commit |
| Something confirmed in code about a shared contract or the foundation | an ADR when it produced a decision hard to reverse (arch's three conditions); arch.md's `Risks` when it is something that breaks first; otherwise one attributed open-item line in journal.md — where it lands (or whether it is discarded) is a person's decision, and the open-item row below (resolve through another row, then delete) is that line's consumer. Never write it into the foundation's verified zone — what was not verified is not a verified state |
| A cross-task decision, or an open item a person must decide | one attributed line in journal.md. When an open item resolves, that line becomes the decision or lands through another row of this table, and is then deleted |

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
and the legacy ADRs — never create a new planning document beyond them.
