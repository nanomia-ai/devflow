## why: purpose

Adopt is the explicit brownfield projection boundary. It reads an unmanaged repository's maintained pre-devflow material—documentation, code, or both—reconstructs the complete devflow knowledge surface that the project already implies, and asks the owner only where evidence cannot settle a decision or contradiction.

The state tool remains the sole route owner. Explicit Adopt consumes `setup.unmanaged`; ordinary Resume, session-start, and state-tool behavior are unchanged. Only a repository with no maintained non-devflow project material routes to Product. Adopt is its own entry and does not run Principles as a preflight.

Before this stage's first judgment, anchor the active skill's objective to the current request and latest explicit approval or approved proposal/card, then use `<skill-root>/../principles/references/policy-index.md` and the selected Decision to open the canonical owner/read path; this does not invoke Principles classification.

When the semantic-refutation stage selects its bounded Arch input, read `<skill-root>/../arch/references/workflow.md` only at the Surface and Required channel columns of the verification-channel table and the first proposal paragraph with its ADR conditions.

## why: workflow

Treat implementation paths, tests, APIs, schemas, configuration, operational records, specifications, and maintained documentation as evidence. The coordinate inventory exists only to account for, classify, refute, and approve the migration; absorbed-input coordinates are not final project knowledge. While reading, infer a proposed Working language from maintained meaningful human prose in documentation, code comments, specifications, and operational records under the shared policy; explicit owner language wins, and machine identifiers do not count as prose evidence. Record one authority status—implemented/current material, binding plan, exploratory research, superseded record, or unresolved conflict—and one separate disposition, exactly as the workflow defines. Grouping related supporting sources is allowed; silently sampling or dropping the remainder is not. Use document-internal status and actual code, test, and operational evidence to judge authority; path/name context, Git history when available, and last-modified time are corroboration only and never decide authority alone. Resolve evidence-supported discrepancies with exact provenance. When competing sources leave current product intent genuinely undecidable, ask with both conflicting coordinates and the exact decision needed instead of inventing a resolution. Trace one representative flow for each code-backed capability candidate; for a document-derived candidate with no executable code, cite its documentary basis and mark executable flow as not applicable.

Read the shared baseline, freshness, and capsule contracts named by the workflow before authoring. Before binding confirmation, resolve actor and Git identity read-only through the shared Identity and Rooms policy. Reverse-derive `product.md`, `arch.md`, applicable `design.md`, `code-style.md`, `glossary.md`, capability design zones, and the durable domain knowledge those owners need. `Brownfield` records whether executable implementation existed before adoption, not whether documents existed. Show each knowledge unit's exact owner-document or planned K landing in the transient inventory. For every ADR-qualified decision and every decision with missing ground, judge its current direction, ground, dropped alternatives, and exact owner landing; do not invent an ADR artifact or hide always-needed meaning in on-demand K. Land the knowledge unit whole at its nearest Product, Architecture, Design, or capability owner under the shared capsule contract; keep concise always-needed direction, ground, and rejected alternatives in Architecture or capability Intent, and use on-demand same-owner K only for additional depth. `Binding ADRs` names only exact existing decision paths; Arch remains the formal ADR writer. The final owner/K surface must preserve purpose, domain meaning, decisions and rejected directions, constraints, modality, uncertainty, and terminology well enough to read and maintain without reopening an absorbed input. Architecture `Existing records` contains only external inputs the owner explicitly chose to keep live. Zero K is valid only when every maintained domain source has a complete exact landing elsewhere. Never create a central knowledge index.

Do not ask the owner to repeat discoverable facts. If the request also contains work after adoption, preserve that whole request through Principles' canonical `maintenanceRoutingPending` record in the first adoption commit; adoption alone creates no continuation marker. Interruption before approval or refusal writes nothing.

## guard: state-kernel-unavailable

Treat an unavailable state kernel as a recovery problem. Do not infer state from filesystem fragments.

## guard: canonical-integrity-block

Canonical integrity findings block before any proposal or write.

## guard: open-git-operation

Return the active Git operation to the user without changing it.

## guard: no-project-material-routes-product

Without any maintained non-devflow project material there is nothing to reconstruct, so new Product discovery owns the entry.

## guard: unknown-project-material

An unavailable or malformed non-devflow material observation is not approval to adopt. Stop until it can be classified safely.

## guard: state-owned-elsewhere

Only explicit Adopt consumes `setup.unmanaged`. Managed, completed, baseline-recovery, and unrelated marker routes remain owned by Resume or their declared stage.

## stage: semantic-refutation

Judgment: refutation.state is one of pending, revise, clear, blocked. Pending means the complete draft has not yet returned from the bounded refutation. A first revise requires returned evidence and a concrete current-authority correction for every current blocker; a later revise additionally requires independent evidence that every attempted root was removed or strictly narrowed in its causal scope without introducing or reopening a blocker. A still-open root may continue only while that progress remains current. An unchanged attempted root, regression, recurrence of a closed failure, or a change only in a finding's name, coordinate, or total count is not progress. Clear requires preserved initial coverage, current independent verification, and no supported blocker or unanswered binding dependency. Blocked means progress failed, a required owner answer or authority contradiction prevents correction, or required draft, source, prior evidence, or clean context is unavailable; it never exposes the binding proposal.

Why: on first entry it inventories code, documents, specifications, and records by knowledge unit; reconciles their claims; traces one executable flow per code-backed capability candidate while using maintained documentary evidence for document-only candidates; and reverse-derives Product, Architecture, applicable Design, code style, glossary, capability zones, and all durable domain knowledge before asking anything.

Every proposal claim distinguishes executable evidence, documentary evidence, contradiction, and inference with exact coordinates and confidence. The refuter receives only the full draft, knowledge unit inventory, dispositions, and exact landing targets, load-bearing current and proposed source/code coordinates, the same shared baseline and knowledge sections opened by workflow step 5, the Surface and Required channel columns of Arch's verification-channel table, and its first proposal paragraph with ADR conditions. It receives no producer transcript, earlier audit conclusion, Missing-channel action column, or other Arch execution, verification-run, approval, write, or commit instruction.

The blocking threshold remains a departure from the opened contracts or a supported contradiction or omission that would cause a wrong action, lose a required decision or rejected direction, assign the wrong owner, omit or split a knowledge unit's current landing, or omit verification means. Each correction rechecks only the returned coordinates, changed targets, and directly affected inventory landing, reference, owner, and source relationships. It may reuse the independent refuter context but still excludes the producer transcript and verdict; Evidence verification preserves initial coverage, the current causal scope, observed progress or remaining failure, and the current result. Retracting a future choice that evidence falsely presented as confirmed may close its finding when current binding does not depend on settling that choice, but moving an unresolved binding fact to Questions does not make the state clear. An owner answer that changes a load-bearing draft receives this bounded recheck before the current write set can be confirmed.

## stage: adoption

Judgment: after refutation is clear, the prepare fallback reads no approval value and presents the complete proposal, including its proposed Working language, for one binding confirmation. Only the approve and refuse rows consume an approval value. A Working language correction is not approval: incorporate it into the complete proposal while preserving fixed tokens and exact terms. After every such correction, run a fresh independent semantic refutation of the complete revised proposal before the same write-free prepare fallback presents it again.

Why: binding and writes remain separate from evidence production, so an owner answer cannot bypass the completed refutation state.

Ask only irreducible decisions or contradictions, then request one confirmation binding the complete write set and its Working language.

Refusal and interruption before approval are write-free. Under that one approval, write the complete Layer 0, capability, and K set before the first commit; capability documents use `Design head: none`. Write `product.md` last among the Layer 0 owners, validate every K, then commit all approved owner documents, same-owner K nodes, any idempotent Principles-owned follow-on record, and the absent resolved-actor room created by the selected effect as `adopt — layer 0`. Calculate the canonical Design head, whose command reads only product, architecture, and glossary, replace only each capability Design head line with that commit hash, and commit only those changed capability documents as `adopt — capabilities`. Interruption remains unmanaged only while no current `.devflow` root or indexed path exists. Once current evidence exists, canonical state owns recovery; never infer unmanaged only because `product.md` is absent. After the first commit, all approved meaning is canonical and the committed `none` heads form a stale baseline routed through Resume to Arch; uncommitted bytes are not recovery input. Any interrupted uncommitted write is unverified, never reported as a landed boundary. Report and stop without synthetic phase values, a new recovery mechanism, a next-route decision, or automatic opt-in to another skill.
