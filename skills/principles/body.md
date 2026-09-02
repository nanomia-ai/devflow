## why: purpose

Principles is the canonical shared kernel. Read [Principles kernel](references/purpose.md#principles-kernel) for precedence, scope, and the six redesign invariants.

Stage packages retain their own procedures; local policy and mechanical owners are routed from this package.

## why: entry-topology

Read [Enter and resume contract](references/enter-resume-contract.md#enter-and-resume-contract) only when Principles itself owns the routing or recovery question.

Principles classifies requests that entered Principles; stateful, status, and project-read-only work routes once
to resume, whose only state input is calculateState. Role contracts bypass this classifier.
An explicitly invoked stage is its own entry and does not use Principles as a preflight; its local guards route state recovery to Resume.

## why: policy-index

Read [Local policy index](references/policy-index.md#local-policy-index), then open only the rows whose conditions apply.

An exact local topic owner preserves canonical meaning without making every Decision load the former omnibus source.

## why: exact-journal-progress-grammar

Read [canonical journal and progress grammar](templates/canonical-journal-progress-grammar.md). The selected grammar owns only forms the line DSL cannot represent byte-exactly; project-state remains their deterministic parser.

## guard: authoring-not-ready

Block runtime use until the authored package and its declared evidence are ready. This is a
package-authoring judgment, not a project-state read.

## stage: classify

Judgment: Partition each request item as pure tweak, stateful, project read-only, or policy
read-only. Mixed and uncertain items retain their accepted scope while only failing items enter
the normal flow; after that flow, re-enter the remaining tweak items.

Why: Conversation meaning belongs here, while Git and project state belong to calculateState.
Keeping those owners separate avoids a route loop and a second state kernel.

## role: reviewer

Report objections against declared acceptance criteria with exact source evidence; do not repair the work.

## role: verifier

Execute the declared verification channel, distinguish unrun from pass, and report evidence coordinates.

## role: auditor

Search independently for invariant loss, conflicts, and unsupported completion claims; report findings before judgment fixes.

## role: retrospector

Return only reusable process evidence, its source, and any unresolved uncertainty.

## role: coordinator

Read [Coordinator contract](references/coordination/coordinator-contract.md#coordinator-contract). Sequence owners, preserve single-writer boundaries, and refuse closure while residual work has more than one owner.
