export const SPEC = { version: "5", id: "resume", profile: "single", imports: [] };
export const OBSERVATIONS = {
  "intent.scope": { judged: true, domain: ["ordinary", "domain-orientation", "handoff-continuation"] },
  "state.canonicalNext": { collector: "state.canonical-next", domain: ["git.open-operation", "integrity.blocking", "integrity.shape", "transition.prepared-route", "transition.interrupted", "transition.source-id-migration", "transition.layer-opening", "transition.product-running", "transition.product-result", "transition.remote-evidence", "transition.finish-boundary", "transition.event-routing", "transition.event-decision", "transition.failure-routing", "marker.product-rerun", "marker.glossary-term", "marker.design-note", "marker.design-open-item", "marker.capability-closure", "marker.knowledge-landing", "marker.compatible-feedback", "marker.re-split", "setup.unmanaged", "setup.no-product", "setup.layer0-incomplete", "setup.brownfield-field", "setup.integration-config", "setup.room-upgrade", "claim.depends-anomaly", "claim.needs-reapproval", "claim.blocked-by-prerequisite", "claim.mine", "baseline.legacy-v010", "baseline.design-refresh", "baseline.boundary", "request.existing", "event.product-requested", "event.pending", "event.new", "layer.empty-folder", "layer.folder-boundary", "layer.children-done", "layer.correspondence-gap", "layer.no-foundation", "layer.no-tree", "ready.digest-behind", "ready.needs-normalization", "ready.approval-invalid", "ready.approval-pending", "ready.ready", "ready.waiting-capability", "blocked.channel", "blocked.audits", "blocked.dependencies", "blocked.other-claims", "product.shape-or-revision", "product.fail", "product.unverified", "complete.product-pass", "complete.adoption", "unrecognized"] },
  "state.compatibleWriter": { collector: "state.compatible-writer", domain: ["none", "product", "design", "arch", "invalid"] }
};
export const FORMATS = {};
export const TEMPLATES = {
  result: { file: "templates/result.md", fields: { summary: "block", route: "line", facts: "block", continuation: "block", approval: "line" }, sections: [] },
  orientation: { file: "templates/orientation.md", fields: { scope: "line", recognition: "line", documents: "block", freshness: "block", next: "line" }, sections: [] }
};
export const ORDERS = {
  entry: ["explicit-root-schema-2-state", "room-and-integrity-report", "selected-continuation", "bounded-read", "single-route"],
  domain: ["recognize", "shape-gate", "bounded-read", "read-only-answer"],
  continuation: ["transition", "claim", "handoff-and-digest", "integration-report", "owner-route"]
};
export const OWNERSHIP = {
  "schema-2 project state": "external.principles",
  ".devflow/users/<id>/HANDOFF.md": "project.room-owner",
  ".devflow/users/<id>/digest.md": "project.room-owner",
  ".devflow/tree/**": "project.direct-or-work",
  ".devflow/project/capabilities/**": "project.arch-or-adopt",
  ".devflow/journal.md": "external.principles"
};
export const GUARDS = [
  { id: "unrecognized-state", reads: ["intent.scope", "state.canonicalNext"], when: s => s.intent.scope === "handoff-continuation" && s.state.canonicalNext === "unrecognized", then: "BLOCK", body: "guard: unrecognized-state" },
  { id: "compatible-feedback-owner-required", reads: ["state.canonicalNext", "state.compatibleWriter"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.compatible-feedback" && (s.state.compatibleWriter === "none" || s.state.compatibleWriter === "invalid"), then: "BLOCK", body: "guard: compatible-feedback-owner-required" }
];
export const STAGES = [
  { id: "recovery-action", reads: ["state.canonicalNext"], acceptsUnknown: [], done: s => !["marker.design-note", "marker.design-open-item", "baseline.boundary", "layer.folder-boundary", "ready.digest-behind"].includes(s.state.canonicalNext), table: "recovery", reentry: "rejudge", branches: { "route-arch": [["READ", { artifact: "cards" }], ["READ", { path: "references/recovery-policy.md" }], "ROUTE:arch"], "finish-baseline-boundary": [["READ", { artifact: "cards" }], ["READ", { path: "references/recovery-policy.md" }], ["COMMIT", { boundary: "baseline" }], "WAIT"], "commit-folder-boundary": [["READ", { artifact: "cards" }], ["READ", { path: "references/recovery-policy.md" }], ["COMMIT", { boundary: "folder" }], "WAIT"], "commit-digest": [["READ", { artifact: "digest" }], ["READ", { path: "references/recovery-policy.md" }], ["COMMIT", { boundary: "digest" }], "WAIT"] }, body: "stage: recovery-action" },
  { id: "scope-entry", reads: [], acceptsUnknown: [], done: () => false, needs: ["intent.scope"], table: "canonicalNext", branches: { "DONE:orientation": [["REPORT", { template: "orientation" }], "DONE"], "DONE:unmanaged": [["REPORT", { template: "result", scope: "unmanaged-repository" }], "DONE"], "ASK:integrity": ["ASK"], "ASK:setup": ["ASK"], "compatible-product": ["ROUTE:product"], "compatible-design": ["ROUTE:design"], "compatible-arch": ["ROUTE:arch"], "ROUTE:product": ["ROUTE:product"], "ROUTE:arch": ["ROUTE:arch"], "ROUTE:direct": ["ROUTE:direct"], "ROUTE:work": ["ROUTE:work"], "ROUTE:verify": ["ROUTE:verify"], "WAIT:blocked": [["REPORT", { template: "result" }], "WAIT"], "DONE:advisory": [["REPORT", { template: "result" }], "DONE"], "DONE:complete": [["REPORT", { template: "result" }], "DONE"], "BLOCK:unrecognized": ["BLOCK"] }, reentry: "rejudge", body: "stage: scope-entry" }
];
export const TABLES = { recovery: { reads: ["state.canonicalNext"], rows: [
  { state: "route-arch", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.design-note" || s.state.canonicalNext === "marker.design-open-item" },
  { state: "finish-baseline-boundary", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "baseline.boundary" },
  { state: "commit-folder-boundary", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "layer.folder-boundary" },
  { state: "commit-digest", reads: [], acceptsUnknown: [], when: () => true }
] }, canonicalNext: { reads: ["intent.scope", "state.canonicalNext"], rows: [
  { state: "DONE:orientation", reads: ["intent.scope"], acceptsUnknown: [], when: s => s.intent.scope === "domain-orientation" },
  { state: "compatible-product", reads: ["state.canonicalNext", "state.compatibleWriter"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.compatible-feedback" && s.state.compatibleWriter === "product" },
  { state: "compatible-design", reads: ["state.canonicalNext", "state.compatibleWriter"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.compatible-feedback" && s.state.compatibleWriter === "design" },
  { state: "compatible-arch", reads: ["state.canonicalNext", "state.compatibleWriter"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.compatible-feedback" && s.state.compatibleWriter === "arch" },
  { state: "DONE:unmanaged", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "setup.unmanaged" },
  { state: "ROUTE:verify", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "transition.prepared-route" || s.state.canonicalNext === "transition.interrupted" || s.state.canonicalNext === "transition.source-id-migration" || s.state.canonicalNext === "transition.product-running" || s.state.canonicalNext === "transition.product-result" || s.state.canonicalNext === "transition.event-routing" || s.state.canonicalNext === "transition.event-decision" || s.state.canonicalNext === "marker.capability-closure" || s.state.canonicalNext === "event.product-requested" || s.state.canonicalNext === "event.pending" || s.state.canonicalNext === "event.new" || s.state.canonicalNext === "layer.children-done" || s.state.canonicalNext === "product.shape-or-revision" || s.state.canonicalNext === "product.fail" || s.state.canonicalNext === "product.unverified" },
  { state: "ROUTE:work", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "transition.remote-evidence" || s.state.canonicalNext === "transition.finish-boundary" || s.state.canonicalNext === "setup.room-upgrade" || s.state.canonicalNext === "claim.mine" || s.state.canonicalNext === "ready.ready" },
  { state: "ROUTE:direct", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "transition.layer-opening" || s.state.canonicalNext === "transition.failure-routing" || s.state.canonicalNext === "marker.re-split" || s.state.canonicalNext === "claim.depends-anomaly" || s.state.canonicalNext === "claim.needs-reapproval" || s.state.canonicalNext === "claim.blocked-by-prerequisite" || s.state.canonicalNext === "request.existing" || s.state.canonicalNext === "layer.empty-folder" || s.state.canonicalNext === "layer.correspondence-gap" || s.state.canonicalNext === "layer.no-foundation" || s.state.canonicalNext === "layer.no-tree" || s.state.canonicalNext === "ready.needs-normalization" || s.state.canonicalNext === "ready.approval-invalid" || s.state.canonicalNext === "ready.approval-pending" || s.state.canonicalNext === "ready.waiting-capability" },
  { state: "ASK:integrity", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "integrity.blocking" },
  { state: "DONE:advisory", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "integrity.shape" },
  { state: "ASK:setup", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "setup.no-product" || s.state.canonicalNext === "setup.layer0-incomplete" || s.state.canonicalNext === "setup.brownfield-field" || s.state.canonicalNext === "git.open-operation" },
  { state: "ROUTE:arch", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.glossary-term" || s.state.canonicalNext === "marker.design-note" || s.state.canonicalNext === "marker.design-open-item" || s.state.canonicalNext === "marker.knowledge-landing" || s.state.canonicalNext === "setup.integration-config" || s.state.canonicalNext === "baseline.legacy-v010" || s.state.canonicalNext === "baseline.design-refresh" },
  { state: "ROUTE:product", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "marker.product-rerun" },
  { state: "WAIT:blocked", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "blocked.channel" || s.state.canonicalNext === "blocked.audits" || s.state.canonicalNext === "blocked.dependencies" || s.state.canonicalNext === "blocked.other-claims" },
  { state: "DONE:complete", reads: ["state.canonicalNext"], acceptsUnknown: [], when: s => s.state.canonicalNext === "complete.product-pass" || s.state.canonicalNext === "complete.adoption" },
  { state: "BLOCK:unrecognized", reads: [], acceptsUnknown: [], when: () => true }
] } };
export const ARTIFACTS = {
  glossary: { path: ".devflow/project/glossary.md", writer: "project.product", readers: ["stage.scope-entry"] },
  product: { path: ".devflow/project/product.md", writer: "project.product", readers: ["stage.scope-entry"] },
  capability: { path: ".devflow/project/capabilities/**", writer: "project.arch-or-adopt", readers: ["stage.scope-entry"] },
  cards: { path: ".devflow/tree/**", writer: "project.direct-or-work", readers: ["stage.recovery-action", "stage.scope-entry"] },
  handoff: { path: ".devflow/users/*/HANDOFF.md", writer: "project.room-owner", readers: ["stage.scope-entry"] },
  digest: { path: ".devflow/users/*/digest.md", writer: "project.room-owner", readers: ["stage.recovery-action", "stage.scope-entry"] }
};
export const ROLES = {};
export const READ_FIRST = [
  { body: "why: purpose", path: "references/purpose.md" },
  { body: "why: entry-orientation", path: "references/entry-orientation.md" },
  { body: "why: domain-orientation", path: "references/domain-orientation.md" },
  { body: "why: handoff-continuity", path: "references/handoff-continuity.md" },
  { body: "why: report-approval", path: "references/report-approval.md" },
  { body: "why: canonical-routing", path: "references/canonical-routing.md" },
  { body: "why: integrity-approval", path: "references/integrity-approval.md" },
  { body: "why: transition-recovery", path: "references/transition-recovery.md" },
  { body: "why: role-boundaries", path: "references/role-boundaries.md" },
  { body: "why: planning-boundaries", path: "references/planning-boundaries.md" },
  { body: "why: recovery-policy", path: "references/recovery-policy.md" }
];
export const DECLARATIONS = {
  profile: { value: "p2", consumer: "build:profile" },
  canonical_state_owner: { value: "sibling calculateState({ root }) schema-2 route/zones/facts", consumer: "resume" },
  single_route: { value: "Resume consumes route.id once after principles classification; glossary-term, design-note, design-open-item, knowledge-landing, legacy-v010, and design-refresh route to Arch for every managed project, while setup.unmanaged remains DONE.", consumer: "recovery-action|scope-entry" },
  domain_boundary: { value: "Domain orientation is read-only and bounded by exact recognition; implementation returns through normal resume routing.", consumer: "scope-entry" },
  continuation_boundary: { value: "Only the state-selected claim or interrupted transition is continued; stale handoff and digest facts report without inventing work.", consumer: "recovery-action" },
  history_boundary: { value: "Closed history is opened only by an exact named card, a non-pass lineage, or a current K/Trap Source basis.", consumer: "scope-entry" },
  landing_boundary: { value: "Arch consumes both legacy writer=adopt and current writer=arch knowledge markers while preserving writer as provenance; any unselected or partially landed marker remains byte-identical and keeps its exact owner active on canonical replay.", consumer: "scope-entry" }
};
export const DEFERRED = [];
