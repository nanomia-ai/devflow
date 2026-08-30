# Architecture workflow

## Entry and prerequisite reads

Take the canonical sibling state result as it stands. An absent product with no implementation routes to product; existing implementation routes to adopt. A brownfield capability write also routes to adopt. Open Git operations and integrity failures stop before normal effects. Unrelated canonical routes return to resume.

For initial or refresh planning, read the canonical rules and planning-evidence discipline from the sibling principles skill, then read product and glossary completely. Read existing architecture, code-style, journal, and direct legacy ADRs when present. For capability work, open the sibling capability baseline contract. Omit its knowledge-overflow topic until an actual named source is processed or the design-zone budget is about to overflow; uncertainty opens the whole contract.

## Interview and research

Derive components from product capabilities and give every included or excluded component one reason. Before stack candidates, settle only current-repository, platform, pinned-version, license, deployment, or external-contract facts that can remove a candidate, change the recommended default, or change verifiability. One exact source coordinate stays in the main session; answer-only multi-source comparison may use isolated research. Structural source understanding stays in the main session.

An unsettled fact is blocking when candidate availability or completion verification remains undecidable. It cannot be presented or bound. A safe optimization default is Provisional only when it carries source, safe value, and settling card; an unminted card is written as `unminted`. Conflicted or unavailable blocking facts report the affected decision and stop that frontier.

For each surviving component, present two or three candidates, one recommendation, and one-line reason without a comparison table. Compare one genuine counter-design only when the choice is hard to reverse, its boundary is non-obvious, and current evidence exposes a real tradeoff. After stack selection, derive the decisions created by that stack and batch them in the same question form. Decisions that alter product problem, capability composition, boundary, or success criteria route back to product.

## Code structure and verification channel

The structure table is canonical: A is domain-vertical modules and the default for three or more capabilities; B is Feature-Sliced for screen-heavy frontends; C is flat files for projects under twenty files. Capability names are folder names. Prefer unique searchable filenames, explicit wiring, depth no greater than three, files around four hundred lines or less, and one type/schema contract per module boundary.

Select the verification channel by product surface:

| Surface | Required channel | Missing-channel action |
| --- | --- | --- |
| Frontend | Browser control that reads rendered output and performs interaction | Guide connection, then stop |
| Desktop or TUI | Screen/accessibility or real-output tool plus safe operating procedure | Install/connect; create the procedure as first work when absent |
| Web backend | Real HTTP request surface | Create as first work |
| CLI or daemon | Run command, expected output, health check, and log location | Create as first work |
| Library | Test runner | Create as first work |

The clean channel verifier runs one exact command that will be recorded. A frontend additionally reads one rendered element down to its value and performs one interaction down to the observed change. Help, listing, binary presence, an attach, or planning-context success is not confirmation. If the platform cannot create a clean context, report that fact and ask the owner. A repository is required; propose initialization and stop if it is refused.

Immediately before hard-to-reverse stack, structure, data, or channel choices, perform one pre-commitment review. Do not repeat it for a batch the owner merely reselected.

## Proposal, approval, and commits

The proposal carries components, survival evidence, stack and derived choices, structure, data, Provisional rows, risks, exclusions, exact verification evidence, every decision meeting all three ADR conditions, and every decision whose ground is missing. The ADR conditions are hard to reverse, non-obvious to a future reader, and supported by real alternatives. A smaller decision stays with its reason and rejected alternatives in architecture; numeric grounds also carry conditions and a rerun command.

Land product's attributed technical-choice lines beside their owning architecture conclusions. Report the complete proposal and ask for explicit approval. Refusal and interruption write nothing. On approval, write architecture, code style, and only qualifying ADRs, then immediately land the complete Layer 0 boundary. A refresh uses its binding architecture boundary.

Integration defaults to the current branch when one worktree exists. With several worktrees, propose an integration branch checked out by none; if absent, show the exact branch-creation command and let the owner run it. Devflow creates neither branches nor worktrees. Merge is merge-commit or rebase; squash is forbidden.

## Capability design and routing

When Layer 0 is confirmed, report the expected document count before generation. A context warning ends the run at that commit with no partial capability output and routes the next unclaimed session through resume. Brownfield routes to adopt.

For greenfield, generate the foundation plus every non-retired product capability using the disk-first number and name rules. Rederive the entire expected design set from confirmed product, architecture, glossary, and only currently cited ADRs. Preserve an existing valid verified zone byte-for-byte; a new document receives the empty scaffold in the capability template. Process a named source into K only when the design budget requires it; K rides the same confirmed capability-design commit.

A design note or design open item updates only its named capability design zone and deletes the exact routed line in that same binding commit. The note's anchor is the supplied snapshot basis; an open item's confirmed statement is its basis and its card is only the confirmation location.

After the capability-design commit, frontend projects route to design when the owner chooses it, otherwise split. Non-frontend projects route to split. A deliberate session boundary routes to resume. No completion guidance is emitted before the capability batch commits.
