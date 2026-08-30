import { line } from "./scripts/skill-rails/dsl.mjs";

// This adapter consumes the canonical project-state projection.  It does not
// redefine its predicates or manufacture an independent state vocabulary.
export const SPEC = { version: "5", id: "verify", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "verification.layer": { collector: "verify/principles.verification-layer", domain: ["capability", "product", "invalid"] },
  "projection.transition": { collector: "verify/principles.transition", domain: ["none", "prepared-route", "interrupted-result", "partial-write"] },
  "projection.channel": { collector: "verify/principles.channel", domain: ["available", "unavailable"] },
  "projection.freshness": { collector: "verify/record.freshness", domain: ["current", "stale"] },
  "verifier.dispatch": { decided: true, domain: ["ready", "returned"] },
  "verifier.verdict": { decided: true, domain: ["pending", "pass", "fail", "unverified"] },
  "result.record": { collector: "verify/record.current", domain: ["missing", "current", "stale", "mismatched"] },
  "record.execution": { collector: "verify/record.execution-evidence", domain: ["missing", "current"] },
  "closure.capability": { decided: true, domain: ["not-applicable", "blocked", "ready", "closed"] },
  "closure.product": { decided: true, domain: ["not-applicable", "continue", "stop"] },
  "history.basis": { decided: true, domain: ["none", "named-card", "nonpass-lineage", "source-basis", "broad", "ambiguous"] },
  "landing.residual": { collector: "verify/principles.residual-landing", domain: ["none", "owner-marker"] },
  "event.pending": { collector: "verify/principles.pending-event", domain: ["none", "audit", "retrospective"] }
};

export const FORMATS = {
  productVerificationRunning: line("product verification running", { trigger: ["requested", "automatic"], product: "hex40", verification: "hex40", code: "hex40" }),
  productVerificationResult: line("product verification result", { trigger: ["requested", "automatic"], product: "hex40", verification: "hex40", code: "hex40", verdict: ["pass", "fail", "unverified"] }),
  auditRequested: line("audit requested", { target: "text" }),
  retrospectiveRequested: line("retrospective requested", { target: "text" })
};

export const TEMPLATES = {
  record: { file: "templates/record.md", fields: { heading: "line", revisions: "block", scenario: "line", executed: "line", verdict: "line", newEntries: "line", failures: "block", regression: "line", standards: "line", provisional: "line", sweep: "line", audit: "block", retrospective: "block" }, sections: [] },
  verifierBundle: { file: "templates/verifier-bundle.md", fields: { target: "line", channel: "line", criteria: "block", remoteEvidence: "block" }, sections: [] },
  route: { file: "templates/route.md", fields: { target: "line", reason: "block", next: "line" }, sections: [] }
};

export const ORDERS = {
  preExecution: ["canonical-project-state", "prepared-or-interrupted-recovery", "residual-owner-marker", "freshness", "clean-verifier-dispatch"],
  resultRouting: ["fail", "unverified", "pass-record", "capability-pass-gates", "capability-close", "product-stop", "audit", "retrospective"],
  effectOrder: ["observe", "recover", "dispatch", "record", "commit", "route", "reobserve"]
};

export const OWNERSHIP = {
  "project-state and verification predicates": "external.principles",
  "devflow/tree/**/verify.md": "verify",
  "devflow/tree/verify.md": "verify",
  "devflow/journal.md": "external.principles",
  "repair cards and re-split markers": "external.split",
  "capability baseline closure": "external.arch-or-adopt"
};

export const ROLES = {
  verifier: { body: "role: verifier", inputs: ["product-criteria-or-capability-bundle", "verify-channel", "allowed-remote-evidence-pointers"], reads: ["provided-bundle", "provided-remote-evidence-pointers"], effects: [], judgments: ["pass", "fail", "unverified", "execution-evidence-only"], returns: "verifierBundle" },
  auditor: { body: "role: auditor", inputs: ["description", "verify-channel", "exact-root-and-file-code-scope"], reads: ["provided-description", "provided-channel", "executed-scope-paths-only"], effects: [], judgments: ["execution-confirmed-or-presumed", "holes-or-plain-expectations", "no-verdict"], returns: "route" },
  retrospector: { body: "role: retrospector", inputs: ["exact-verify-event-artifact-set"], reads: ["provided-artifacts-only"], effects: [], judgments: ["alternative-with-strain-and-presumed-switching-cost", "no-verdict"], returns: "route" }
};

export const GUARDS = [
  { id: "state-kernel-unavailable", reads: ["verification.layer"], acceptsUnknown: [], when: s => s.verification.layer === "invalid", then: "BLOCK", body: "guard: state-kernel-unavailable" },
  { id: "closed-history-refusal", reads: ["history.basis"], acceptsUnknown: ["history.basis"], when: s => s.history.basis === "broad" || s.history.basis === "ambiguous", then: "BLOCK", body: "guard: closed-history-refusal" },
  { id: "refuse-stale-result", reads: ["projection.freshness"], acceptsUnknown: [], when: s => s.projection.freshness === "stale", then: "ROUTE:verify", body: "guard: refuse-stale-result" },
  { id: "channel-unavailable", reads: ["projection.channel"], acceptsUnknown: [], when: s => s.projection.channel === "unavailable", then: "ROUTE:human", body: "guard: channel-unavailable" },
  { id: "residual-owner-marker", reads: ["landing.residual"], acceptsUnknown: [], when: s => s.landing.residual === "owner-marker", then: "ROUTE:arch", body: "guard: residual-owner-marker" }
];

export const STAGES = [
  { id: "recover", reads: ["projection.transition"], acceptsUnknown: [], done: s => s.projection.transition === "none", table: "recovery", reentry: "rejudge", branches: {
    "prepared-route": [["READ", { artifact: "record" }], ["RUN", { action: "validate the prepared disk object and apply its remaining declared suffix exactly once" }], ["COMMIT", { authority: "external.principles", transition: "prepared-route-completion" }], "ROUTE:resume"],
    "interrupted-result": [["READ", { artifact: "record" }], ["RUN", { action: "validate the stored result and finish its exact durable record transition once" }], ["COMMIT", { authority: "external.principles", transition: "product-verification-result-completion" }], "ROUTE:resume"],
    "partial-write": [["READ", { artifact: "record" }], ["REPORT", { template: "route" }], "ROUTE:verify"]
  }, body: "stage: recover" },
  { id: "dispatch-verifier", reads: ["verifier.dispatch"], acceptsUnknown: [], done: s => s.verifier.dispatch === "returned", table: "dispatch", reentry: "rejudge", branches: {
    ready: [["READ", { artifact: "product" }], ["READ", { artifact: "arch" }], ["READ", { artifact: "codeStyle" }], ["READ", { artifact: "glossary" }], ["DISPATCH", { role: "verifier", template: "verifierBundle" }], "WAIT"]
  }, body: "stage: dispatch-verifier" },
  { id: "result-routing", reads: ["verifier.verdict", "result.record", "record.execution"], acceptsUnknown: [], done: s => s.verifier.verdict === "pass" && s.result.record === "current" && s.record.execution === "current", table: "result", reentry: "rejudge", branches: {
    pending: [["REPORT", { template: "route" }], "WAIT"],
    "pass-record": [["WRITE", { artifact: "record", template: "record" }], ["COMMIT", { authority: "external.principles", transition: "verification-result" }], "NEXT"],
    "await-execution-evidence": [["REPORT", { template: "route" }], "WAIT"],
    fail: [["WRITE", { artifact: "record", template: "record" }], ["COMMIT", { authority: "external.principles", transition: "verification-result" }], "ROUTE:split"],
    unverified: [["WRITE", { artifact: "record", template: "record" }], ["COMMIT", { authority: "external.principles", transition: "verification-result" }], "ROUTE:split"]
  }, body: "stage: result-routing" },
  { id: "capability-closure", reads: ["verification.layer", "record.execution", "closure.capability"], acceptsUnknown: [], done: s => (s.closure.capability === "closed" && s.record.execution === "current") || s.verification.layer !== "capability", table: "capability", reentry: "rejudge", branches: {
    "not-applicable": [["REPORT", { template: "route" }], "ROUTE:split"],
    blocked: [["WRITE", { artifact: "record", template: "record" }], ["COMMIT", {}], "ROUTE:split"],
    ready: [["READ", { artifact: "baselines" }], ["WRITE", { artifact: "record", template: "record" }], ["COMMIT", {}], "ROUTE:arch"]
  }, body: "stage: capability-closure" },
  { id: "product-stop", reads: ["verification.layer", "record.execution", "closure.product"], acceptsUnknown: [], done: s => (s.closure.product === "stop" && s.record.execution === "current") || s.verification.layer !== "product", table: "product", reentry: "rejudge", branches: {
    "not-applicable": [["REPORT", { template: "route" }], "ROUTE:product"],
    continue: [["WRITE", { artifact: "record", template: "record" }], ["COMMIT", { authority: "external.principles", transition: "product-verification-result" }], "ROUTE:product"]
  }, body: "stage: product-stop" },
  { id: "event-routing", reads: ["event.pending"], acceptsUnknown: [], done: s => s.event.pending === "none", table: "event", reentry: "rejudge", branches: {
    audit: [["DISPATCH", { role: "auditor", template: "route" }], "WAIT"],
    retrospective: [["DISPATCH", { role: "retrospector", template: "route" }], "WAIT"]
  }, body: "stage: event-routing" }
];

export const ARTIFACTS = {
  product: { path: "devflow/project/product.md", writer: "project.product", readers: ["stage.dispatch-verifier", "stage.product-stop"] },
  arch: { path: "devflow/project/arch.md", writer: "project.arch", readers: ["stage.dispatch-verifier", "stage.capability-closure"] },
  codeStyle: { path: "devflow/project/code-style.md", writer: "project.arch", readers: ["stage.dispatch-verifier", "stage.capability-closure"] },
  glossary: { path: "devflow/project/glossary.md", writer: "project.product", readers: ["stage.dispatch-verifier"] },
  journal: { path: "devflow/journal.md", writer: "external.principles", readers: ["stage.recover", "stage.event-routing"] },
  record: { path: "devflow/tree/**/verify.md", writer: "verify", readers: ["stage.recover", "stage.result-routing", "stage.event-routing"] },
  baselines: { path: "devflow/project/capabilities", writer: "external.arch-or-adopt", readers: ["stage.capability-closure"] }
};

export const TABLES = {
  recovery: { rows: [
    { state: "prepared-route", reads: ["projection.transition"], acceptsUnknown: [], when: s => s.projection.transition === "prepared-route" },
    { state: "interrupted-result", reads: ["projection.transition"], acceptsUnknown: [], when: s => s.projection.transition === "interrupted-result" },
    { state: "partial-write", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  dispatch: { rows: [
    { state: "ready", reads: [], acceptsUnknown: [], when: s => true }
  ] },
  result: { rows: [
    { state: "pass-record", reads: ["verifier.verdict", "result.record"], acceptsUnknown: [], when: s => s.verifier.verdict === "pass" && s.result.record === "missing" },
    { state: "fail", reads: ["verifier.verdict"], acceptsUnknown: [], when: s => s.verifier.verdict === "fail" },
    { state: "unverified", reads: ["verifier.verdict"], acceptsUnknown: [], when: s => s.verifier.verdict === "unverified" },
    { state: "await-execution-evidence", reads: ["verifier.verdict", "result.record", "record.execution"], acceptsUnknown: [], when: s => s.verifier.verdict === "pass" && (s.result.record !== "current" || s.record.execution !== "current") },
    { state: "pending", reads: [], acceptsUnknown: [], when: s => true }
  ] },
  capability: { rows: [
    { state: "blocked", reads: ["closure.capability"], acceptsUnknown: [], when: s => s.closure.capability === "blocked" },
    { state: "ready", reads: ["closure.capability"], acceptsUnknown: [], when: s => s.closure.capability === "ready" },
    { state: "not-applicable", reads: [], acceptsUnknown: [], when: s => true }
  ] },
  product: { rows: [
    { state: "continue", reads: ["closure.product"], acceptsUnknown: [], when: s => s.closure.product === "continue" },
    { state: "not-applicable", reads: [], acceptsUnknown: [], when: s => true }
  ] },
  event: { rows: [
    { state: "audit", reads: ["event.pending"], acceptsUnknown: [], when: s => s.event.pending === "audit" },
    { state: "retrospective", reads: [], acceptsUnknown: [], when: s => true }
  ] }
};

export const READ_FIRST = [
  { body: "why: purpose", path: "references/canonical-projections.md" },
  { body: "why: verification-boundary", path: "references/verification-boundary.md" },
  { body: "why: failure-routing", path: "references/failure-routing.md" },
  { body: "why: capability-closure-guidance", path: "references/capability-closure.md" },
  { body: "why: product-stop-guidance", path: "references/product-stop.md" },
  { body: "why: event-guidance", path: "references/event-guidance.md" },
  { body: "why: event-priority", path: "references/event-priority.md" },
  { body: "why: audit-guidance", path: "references/audit-events.md" },
  { body: "why: retrospective-guidance", path: "references/retrospective-events.md" },
  { body: "why: record-grammar", path: "references/record-grammar.md" },
  { body: "why: recovery-completion", path: "references/recovery-completion.md" },
  { body: "why: execution-evidence", path: "references/execution-evidence.md" }
];

export const DECLARATIONS = {
  stateAuthority: { value: "project-state-and-verification-predicates", consumer: "all-stages" },
  executionEvidence: { value: "exact-revision-current-pass-record-with-nonempty-executed-is-the-strongest-existing-observable-not-external-execution-proof", consumer: "result-routing-and-closure" },
  recovery: { value: "prepared-and-interrupted-records-complete-a-finite-stored-suffix-or-fail-closed-before-resume", consumer: "recover" },
  freshness: { value: "stale-revisions-refuse-result-reuse", consumer: "refuse-stale-result" },
  routing: { value: "fail-unverified-pass-use-canonical-repair-and-closure-boundaries", consumer: "result-routing" },
  residualLanding: { value: "owner-marker-refuses-closure-until-canonical-owner-consumes-it", consumer: "residual-owner-marker" },
  events: { value: "audit-and-retrospective-are-events-not-verdicts", consumer: "event-routing" }
};

export const DEFERRED = [];
