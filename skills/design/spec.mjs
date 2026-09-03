export const SPEC = { version: "5", id: "design", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "input.product": { collector: "state.design-product", domain: ["present", "absent", "unknown"] },
  "input.arch": { collector: "state.design-arch", domain: ["present", "absent", "unknown"] },
  "input.frontend": { collector: "state.design-frontend", domain: ["none", "needed", "unknown"] },
  "current.design": { collector: "state.design-current", domain: ["present", "absent", "unknown"] },
  "current.tree": { collector: "state.design-tree", domain: ["absent", "present", "unknown"] },
  "maintenance.state": { collector: "state.design-request-state", domain: ["none", "current", "unknown"] },
  "research.card.state": { collector: "state.design-research-state", domain: ["none", "pending", "effective", "unknown"] },
  "compatible.owner": { collector: "state.compatible-owner", domain: ["none", "design", "invalid"] },
  "compatible.landing": { collector: "state.compatible-landing", domain: ["none", "pending", "satisfied", "invalid"] },
  "entry.action": { decided: true, domain: ["skip"] },
  "request.kind": { judged: true, domain: ["initial", "refresh", "crosscut", "domain", "tiny-no-delta", "none"] },
  "source.choice": { judged: true, domain: ["settled", "stale", "needs-choice"] },
  "research.state": { judged: true, domain: ["none", "needed", "blocked", "settled"] },
  "proposal.completeness": { judged: true, domain: ["needs-choice", "ready"] },
  "approval.action": { decided: true, domain: ["ask", "commit", "reject"] }
};

export const FORMATS = {};
export const TEMPLATES = {
  proposal: { file: "templates/proposal.md", fields: { approach: "line", designSource: "line", tokenStrategy: "line", componentStrategy: "line", decompositionAxis: "line", reviewSurface: "line", buildScope: "block" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block" }, sections: [] }
};
export const ORDERS = { refinement: ["compatible-feedback", "input", "record-first", "research", "proposal", "confirmation"] };
export const OWNERSHIP = {
  ".devflow/project/design.md": "design",
  ".devflow/journal.md#compatible-feedback-pending": "design-on-exact-owner-landing",
  ".devflow/project/capabilities/**": "external.arch-or-adopt"
};
export const GUARDS = [
  { id: "raw-state-unavailable", reads: ["input.product", "input.arch", "input.frontend", "current.design", "current.tree", "maintenance.state", "research.card.state"], acceptsUnknown: [], when: s => s.input.product === "unknown" || s.input.arch === "unknown" || s.input.frontend === "unknown" || s.current.design === "unknown" || s.current.tree === "unknown" || s.maintenance.state === "unknown" || s.research.card.state === "unknown", then: "BLOCK", body: "guard: raw-state-unavailable" },
  { id: "compatible-feedback-shape", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "invalid" || s.compatible.landing === "invalid", then: "BLOCK", body: "guard: compatible-feedback-shape" },
  { id: "product-required", reads: ["input.product"], acceptsUnknown: [], when: s => s.input.product === "absent", then: "ROUTE:product", body: "guard: product-required" },
  { id: "arch-required", reads: ["input.arch"], acceptsUnknown: [], when: s => s.input.arch === "absent", then: "ROUTE:arch", body: "guard: arch-required" },
  { id: "existing-design-research", reads: ["research.card.state"], acceptsUnknown: [], when: s => s.research.card.state === "pending" || s.research.card.state === "effective", then: "ROUTE:direct", body: "guard: existing-design-research" },
  { id: "source-choice-required", reads: ["source.choice"], acceptsUnknown: [], when: s => s.source.choice === "stale" || s.source.choice === "needs-choice", then: "ASK", body: "guard: source-choice-required" }
];
export const STAGES = [
  { id: "compatible-feedback", reads: ["compatible.owner"], acceptsUnknown: [], done: s => s.compatible.owner === "none", table: "compatibleFeedback", reentry: "rejudge", branches: {
    write: [["WRITE", { artifact: "design", source: "compatible-feedback exact coordinates", preserves: ["source", "background", "why", "conclusion", "implication"] }], "WAIT"],
    land: [["RUN", { action: "delete-byte-identical-compatible-feedback-marker" }], ["COMMIT", { scope: "compatible-feedback-owner-and-marker", touches: [".devflow/project/design.md", ".devflow/journal.md"] }], "ROUTE:resume"]
  }, body: "stage: compatible-feedback" },
  { id: "input", reads: ["input.frontend"], acceptsUnknown: [], done: s => s.input.frontend === "needed", needs: ["entry.action"], reentry: "rejudge", branches: { skip: [["REPORT", { template: "result" }], "ROUTE:direct"] }, body: "stage: input" },
  { id: "record-first", reads: ["current.tree", "maintenance.state", "request.kind"], acceptsUnknown: ["request.kind"], done: s => s.current.tree === "absent" || s.maintenance.state === "current" || s.request.kind === "initial" || s.request.kind === "none" || s.request.kind === "tiny-no-delta", effects: ["ROUTE:direct"], reentry: "rejudge", body: "stage: record-first" },
  { id: "research", reads: ["research.state"], acceptsUnknown: [], done: s => s.research.state === "none" || s.research.state === "settled", needs: ["research.state"], reentry: "rejudge", branches: { needed: [["RUN", { action: "record-durable-design-research-origin" }], "ROUTE:direct"], blocked: ["WAIT"] }, body: "stage: research" },
  { id: "proposal", reads: ["proposal.completeness"], acceptsUnknown: [], done: s => s.proposal.completeness === "ready", needs: ["proposal.completeness"], reentry: "rejudge", branches: { "needs-choice": [["REPORT", { template: "proposal" }], "ASK"] }, body: "stage: proposal" },
  { id: "confirmation", reads: ["current.design", "request.kind"], acceptsUnknown: [], done: s => s.current.design === "present" && (s.request.kind === "none" || s.request.kind === "tiny-no-delta"), needs: ["approval.action"], reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "proposal" }], "ASK"],
    reject: [["REPORT", { template: "result" }], "DONE"],
    commit: [["WRITE", { artifact: "design", template: "proposal" }], ["COMMIT", { artifact: "design", boundary: "confirmed-design-current", subject: "<id> design — design.md", touches: [".devflow/project/design.md", ".devflow/journal.md"] }], "ROUTE:direct"]
  }, body: "stage: confirmation" }
];
export const TABLES = { compatibleFeedback: { exclusive: true, rows: [
  { state: "write", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "design" && s.compatible.landing === "pending" },
  { state: "land", reads: [], acceptsUnknown: [], when: () => true }
] } };
export const ARTIFACTS = {
  product: { path: ".devflow/project/product.md", writer: "external.product", readers: ["stage.record-first", "stage.proposal", "stage.confirmation"] },
  architecture: { path: ".devflow/project/arch.md", writer: "external.arch", readers: ["stage.record-first", "stage.input", "stage.proposal", "stage.confirmation"] },
  codeStyle: { path: ".devflow/project/code-style.md", writer: "external.arch", readers: ["stage.proposal", "stage.confirmation"] },
  capabilityDesignZones: { path: ".devflow/project/capabilities", writer: "external.arch-or-adopt", readers: ["stage.proposal", "stage.confirmation"] },
  glossary: { path: ".devflow/project/glossary.md", writer: "external.product", readers: ["stage.proposal", "stage.confirmation"] },
  compatibleFeedbackMarker: { path: ".devflow/journal.md#compatible-feedback-pending", writer: "design", readers: ["stage.compatible-feedback"] },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.compatible-feedback", "stage.record-first", "stage.research", "stage.confirmation", "guard.existing-design-research"] },
  tree: { path: ".devflow/tree", writer: "external.direct", readers: ["stage.record-first", "stage.research", "guard.existing-design-research"] },
  design: { path: ".devflow/project/design.md", writer: "design", readers: ["stage.compatible-feedback", "stage.confirmation", "external.arch", "external.direct", "external.resume"], template: "proposal" }
};
export const ROLES = {};
export const READ_FIRST = [
  { body: "why: purpose", path: "references/purpose.md" },
  { body: "why: ownership", path: "references/ownership.md" },
  { body: "why: legacy", path: "references/legacy-source.md" }
];
export const DECLARATIONS = {
  currentDesign: { value: "design.md is current only after explicit approval and the matching atomic design commit; drafts are reports, not durable current state.", consumer: "stage:confirmation" },
  refinement: { value: "Initial, refresh, crosscut, and domain requests select the same state-driven design route; a tiny change with no design delta leaves the current owner untouched.", consumer: "stage:record-first" },
  knowledgeLanding: { value: "Only later confirmed work or research synthesis may emit the canonical knowledge-landing marker; Arch is the sole managed recursive capability knowledge writer. Adopt remains only as initial artifact provenance from the unmanaged projection.", consumer: "external.arch-or-adopt" },
  compactProject: { value: "No-UI projects skip design without a file, marker, or commit, and small projects may retain one compact current design document.", consumer: "stage:input" }
};
export const DEFERRED = [];
