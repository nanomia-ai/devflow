export const SPEC = { version: "5", id: "design", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "input.product": { collector: "state.design-product", domain: ["present", "absent", "unknown"] },
  "input.arch": { collector: "state.design-arch", domain: ["present", "absent", "unknown"] },
  "input.frontend": { collector: "state.design-frontend", domain: ["none", "needed", "unknown"] },
  "current.design": { collector: "state.design-current", domain: ["present", "absent", "unknown"] },
  "current.tree": { collector: "state.design-tree", domain: ["absent", "present", "unknown"] },
  "maintenance.state": { collector: "state.design-request-state", domain: ["none", "current", "unknown"] },
  "research.card.state": { collector: "state.design-research-state", domain: ["none", "pending", "effective", "unknown"] },
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
export const ORDERS = { refinement: ["input", "record-first", "research", "proposal", "confirmation"] };
export const OWNERSHIP = {
  "devflow/project/design.md": "design",
  "devflow/project/capabilities/**": "external.arch-or-adopt"
};
export const GUARDS = [
  { id: "raw-state-unavailable", reads: ["input.product", "input.arch", "input.frontend", "current.design", "current.tree", "maintenance.state", "research.card.state"], acceptsUnknown: [], when: s => s.input.product === "unknown" || s.input.arch === "unknown" || s.input.frontend === "unknown" || s.current.design === "unknown" || s.current.tree === "unknown" || s.maintenance.state === "unknown" || s.research.card.state === "unknown", then: "BLOCK", body: "guard: raw-state-unavailable" },
  { id: "product-required", reads: ["input.product"], acceptsUnknown: [], when: s => s.input.product === "absent", then: "ROUTE:product", body: "guard: product-required" },
  { id: "arch-required", reads: ["input.arch"], acceptsUnknown: [], when: s => s.input.arch === "absent", then: "ROUTE:arch", body: "guard: arch-required" },
  { id: "existing-design-research", reads: ["research.card.state"], acceptsUnknown: [], when: s => s.research.card.state === "pending" || s.research.card.state === "effective", then: "ROUTE:split", body: "guard: existing-design-research" },
  { id: "existing-maintenance-origin", reads: ["maintenance.state"], acceptsUnknown: [], when: s => s.maintenance.state === "current", then: "ROUTE:split", body: "guard: existing-maintenance-origin" },
  { id: "source-choice-required", reads: ["source.choice"], acceptsUnknown: [], when: s => s.source.choice === "stale" || s.source.choice === "needs-choice", then: "ASK", body: "guard: source-choice-required" }
];
export const STAGES = [
  { id: "input", reads: ["input.frontend"], acceptsUnknown: [], done: s => s.input.frontend === "needed", needs: ["entry.action"], reentry: "rejudge", branches: { skip: [["REPORT", { template: "result" }], "ROUTE:split"] }, body: "stage: input" },
  { id: "record-first", reads: ["current.tree", "request.kind"], acceptsUnknown: ["request.kind"], done: s => s.current.tree === "absent" || s.request.kind === "initial" || s.request.kind === "none" || s.request.kind === "tiny-no-delta", effects: [["RUN", { action: "record-maintenance-routing-request" }], ["COMMIT", { boundary: "request-recorded" }], "ROUTE:split"], reentry: "rejudge", body: "stage: record-first" },
  { id: "research", reads: ["research.state"], acceptsUnknown: [], done: s => s.research.state === "none" || s.research.state === "settled", needs: ["research.state"], reentry: "rejudge", branches: { needed: [["RUN", { action: "record-durable-design-research-origin" }], "ROUTE:split"], blocked: ["WAIT"] }, body: "stage: research" },
  { id: "proposal", reads: ["proposal.completeness"], acceptsUnknown: [], done: s => s.proposal.completeness === "ready", needs: ["proposal.completeness"], reentry: "rejudge", branches: { "needs-choice": [["REPORT", { template: "proposal" }], "ASK"] }, body: "stage: proposal" },
  { id: "confirmation", reads: ["current.design", "request.kind"], acceptsUnknown: [], done: s => s.current.design === "present" && (s.request.kind === "none" || s.request.kind === "tiny-no-delta"), needs: ["approval.action"], reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "proposal" }], "ASK"],
    reject: [["REPORT", { template: "result" }], "DONE"],
    commit: [["WRITE", { artifact: "design", template: "proposal" }], ["COMMIT", { artifact: "design", boundary: "confirmed-design-current" }], "ROUTE:split"]
  }, body: "stage: confirmation" }
];
export const TABLES = {};
export const ARTIFACTS = {
  product: { path: "devflow/project/product.md", writer: "external.product", readers: ["stage.record-first", "stage.proposal", "stage.confirmation"] },
  architecture: { path: "devflow/project/arch.md", writer: "external.arch", readers: ["stage.record-first", "stage.input", "stage.proposal", "stage.confirmation"] },
  codeStyle: { path: "devflow/project/code-style.md", writer: "external.arch", readers: ["stage.proposal", "stage.confirmation"] },
  capabilityDesignZones: { path: "devflow/project/capabilities", writer: "external.arch-or-adopt", readers: ["stage.proposal", "stage.confirmation"] },
  glossary: { path: "devflow/project/glossary.md", writer: "external.product", readers: ["stage.proposal", "stage.confirmation"] },
  journal: { path: "devflow/journal.md", writer: "external.principles", readers: ["stage.record-first", "stage.research", "guard.existing-maintenance-origin", "guard.existing-design-research"] },
  tree: { path: "devflow/tree", writer: "external.split", readers: ["stage.record-first", "stage.research", "guard.existing-maintenance-origin", "guard.existing-design-research"] },
  design: { path: "devflow/project/design.md", writer: "design", readers: ["stage.confirmation", "external.arch", "external.split", "external.resume"], template: "proposal" }
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
  knowledgeLanding: { value: "Only later confirmed work or research synthesis may emit the canonical knowledge-landing marker; arch or adopt is the sole recursive capability knowledge writer.", consumer: "external.arch-or-adopt" },
  compactProject: { value: "No-UI projects skip design without a file, marker, or commit, and small projects may retain one compact current design document.", consumer: "stage:input" }
};
export const DEFERRED = [];
