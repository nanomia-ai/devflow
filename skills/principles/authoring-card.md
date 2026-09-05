# authoring card — principles
Purpose: provide one state-free request classifier and the shared policy/grammar kernel for every devflow entry.
Failure scene: duplicated hook-time state collection or prose-only rules make sessions drift, re-enter stages, or accept malformed durable records.
Observations: authoring.readiness; request.partition; tweak.gate; tweak.preflight; tweak.check. These are bounded authoring or conversation judgments, never project-state substitutes.
Terminals: BLOCK when authoring is not ready; ROUTE once for stateful work; DONE for policy-only and completed tiny-tweak paths.
Guards: authoring-not-ready.
Stages: classify.
Effects: read the selected local policy, perform the bounded tweak sequence when every gate passes, or route once to resume.
Passengers: request intent, mixed-item scope, role-contract bypass, and exact tiny-tweak evidence.
Artifacts: no project artifact is collected here; project state belongs to resume and stage collectors.
Templates: action-result, role-result, and canonical journal/progress grammar guidance.
Ownership: spec owns routing and exact machine forms; body owns judgment reasons; templates own output grammar; selected references own topic policy, including the shared owner/K approval batch and physical-writer boundary; sibling state tools own deterministic project facts.
Consumer consumption sets: universal entry reads purpose plus enter/resume contract and the selected policy-index row; tiny tweak additionally reads the tweak/delivery policy and exact target; a role-contract consumer reads only its role body and selected coordination policy.
Consumer closure check: every static policy edge is declared through READ_FIRST; exact project facts are intentionally absent; unrepresentable record forms have one mandatory grammar owner and one parser.
Deferred: none.
