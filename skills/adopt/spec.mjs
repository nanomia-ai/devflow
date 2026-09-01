import { line } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "adopt", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "state.kernel": { collector: "state.kernel", domain: ["available", "unavailable"] },
  "state.route": { collector: "state.route", domain: ["none", "git.open-operation", "integrity.blocking", "marker.knowledge-landing", "marker.compatible-feedback", "marker.design-note", "marker.design-open-item", "setup.no-product", "setup.layer0-incomplete", "baseline.design-refresh", "baseline.legacy-v010", "baseline.boundary", "complete.adoption", "owned-elsewhere"] },
  "state.code": { collector: "state.code", domain: ["present", "none", "unknown"] },
  "state.brownfield": { collector: "state.brownfield", domain: ["yes", "no", "unknown"] },
  "state.capabilities": { collector: "state.capabilities", domain: ["missing", "refresh", "current", "unknown"] },
  "evidence.inventory": { collector: "adopt/inventory.project", domain: ["present", "missing", "unknown"] },
  "evidence.flow": { collector: "adopt/flow.project", domain: ["present", "missing", "unknown"] },
  "evidence.records": { collector: "adopt/records.project", domain: ["present", "none", "unknown"] },
  "marker.knowledge": { collector: "state.marker-knowledge", domain: ["present", "none", "unknown"] },
  "marker.count": { collector: "state.marker-count", domain: "integer" },
  "compatible.owner": { collector: "state.compatible-owner", domain: ["none", "arch", "capability", "invalid"] },
  "compatible.landing": { collector: "state.compatible-landing", domain: ["none", "pending", "satisfied", "invalid"] },
  "entry.mode": { judged: true, domain: ["initial", "partial", "glossary-only", "capability-only", "design-only", "none"] },
  "entry.status": { judged: true, domain: ["pending", "read"] },
  "inspection.status": { judged: true, domain: ["needed", "traced", "evidence-missing"] },
  "derivation.status": { judged: true, domain: ["needed", "draft", "confirmed", "contradiction"] },
  "proposal.status": { judged: true, domain: ["draft", "ready", "interrupted"] },
  "landing.mode": { judged: true, domain: ["compact", "recursive", "partial-compact", "partial-recursive"] },
  "request.kind": { judged: true, domain: ["initial", "refresh", "capability-only", "none"] },
  "approval.action": { decided: true, domain: ["ask", "approve", "refuse"] },
  "capability.action": { decided: true, domain: ["ask", "approve"] },
  "route.after": { decided: true, domain: ["split", "resume", "design"] }
};

export const FORMATS = {
  flowEvidence: line("representative flow", { candidate: "path", entry: "path", path: "path", outcome: "text" }),
  existingRecord: line("existing record", { capability: "path", path: "path", ownership: ["single", "shared"] })
};

export const TEMPLATES = {
  adoptionProposal: { file: "templates/adoption-proposal.md", fields: { candidates: "list", flows: "list", documentClaims: "list", records: "list", product: "block", architecture: "block", codeStyle: "block", glossary: "list", questions: "list", contradictions: "list", verification: "block" }, sections: [] },
  product: { file: "templates/product.md", fields: { serviceName: "line", identity: "block", problem: "block", approach: "block", capabilityRows: "generated", boundary: "block", successCriteria: "list", accessPoints: "list", openQuestions: "block", interface: "line" }, sections: [] },
  architecture: { file: "templates/architecture.md", fields: { components: "list", stack: "list", codeStructure: "block", data: "block", existingRecords: "block", brownfield: "line", verification: "block" }, sections: [] },
  codeStyle: { file: "templates/code-style.md", fields: { values: "list", choices: "list", boundaries: "list" }, sections: [] },
  capabilityDesign: { file: "templates/capability-design.md", fields: { number: "line", name: "line", purpose: "line", boundary: "line", concepts: "line", intent: "block", conceptRows: "generated", invariants: "list", nonGoals: "list", adrs: "list", designHead: "line" }, sections: [] },
  knowledgeNode: { file: "templates/knowledge-node.md", fields: { title: "line", openWhen: "line", about: "line", body: "block", sourceBasis: "generated" }, sections: [] },
  glossary: { file: "templates/glossary.md", fields: { terms: "generated" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block", next: "line" }, sections: [] }
};

export const ORDERS = {
  adoption: ["canonical-entry", "compatible-feedback", "inspect-code-and-records", "trace-representative-flow-per-candidate", "derive-boundaries-and-layer-zero", "report", "approval", "layer-zero-commit", "capability-design-commit", "route"],
  landing: ["read-valid-marker", "open-exact-card-revision", "choose-owner-or-recursive-k", "write-owner-and-k", "delete-only-consumed-markers", "boundary-commit"]
};

export const OWNERSHIP = {
  "devflow/project/**": "adopt", "devflow/journal.md#compatible-feedback-pending": "adopt-on-exact-owner-landing", "devflow/journal.md": "external.principles", "devflow/tree/**": "external.split"
};

export const GUARDS = [
  { id: "state-kernel-unavailable", reads: ["state.kernel"], acceptsUnknown: [], when: s => s.state.kernel === "unavailable", then: "BLOCK", body: "guard: state-kernel-unavailable" },
  { id: "compatible-feedback-shape", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "invalid" || s.compatible.landing === "invalid", then: "BLOCK", body: "guard: compatible-feedback-shape" },
  { id: "canonical-integrity-block", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "integrity.blocking", then: "BLOCK", body: "guard: canonical-integrity-block" },
  { id: "open-git-operation", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "git.open-operation", then: "ASK", body: "guard: open-git-operation" },
  { id: "no-code-routes-product", reads: ["state.code"], acceptsUnknown: [], when: s => s.state.code === "none", then: "ROUTE:product", body: "guard: no-code-routes-product" },
  { id: "unknown-code-evidence", reads: ["state.code"], acceptsUnknown: [], when: s => s.state.code === "unknown", then: "BLOCK", body: "guard: unknown-code-evidence" },
  { id: "not-brownfield-writer", reads: ["state.brownfield", "state.route"], acceptsUnknown: [], when: s => s.state.brownfield === "no" && (s.state.route === "baseline.design-refresh" || s.state.route === "baseline.legacy-v010" || s.state.route === "baseline.boundary"), then: "ROUTE:resume", body: "guard: not-brownfield-writer" },
  { id: "state-owned-elsewhere", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "owned-elsewhere", then: "ROUTE:resume", body: "guard: state-owned-elsewhere" }
];

export const TABLES = {
  compatibleFeedback: { exclusive: true, rows: [
    { state: "write-arch", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "arch" && s.compatible.landing === "pending" },
    { state: "write-capability", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "capability" && s.compatible.landing === "pending" },
    { state: "land", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  approval: { exclusive: true, reads: ["approval.action", "request.kind"], rows: [
    { state: "ask", reads: ["approval.action"], acceptsUnknown: [], when: s => s.approval.action === "ask" },
    { state: "refuse", reads: ["approval.action"], acceptsUnknown: [], when: s => s.approval.action === "refuse" },
    { state: "approve", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  capabilityRoute: { exclusive: true, reads: ["capability.action", "route.after"], rows: [
    { state: "ask", reads: ["capability.action"], acceptsUnknown: [], when: s => s.capability.action === "ask" },
    { state: "design", reads: ["capability.action", "route.after"], acceptsUnknown: [], when: s => s.capability.action === "approve" && s.route.after === "design" },
    { state: "resume", reads: ["capability.action", "route.after"], acceptsUnknown: [], when: s => s.capability.action === "approve" && s.route.after === "resume" },
    { state: "split", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "compatible-feedback", reads: ["compatible.owner"], acceptsUnknown: [], done: s => s.compatible.owner === "none", table: "compatibleFeedback", reentry: "rejudge", branches: {
    "write-arch": [["WRITE", { artifact: "architecture", source: "compatible-feedback exact coordinates", preserves: ["source", "background", "why", "conclusion", "implication"] }], "WAIT"],
    "write-capability": [["WRITE", { artifact: "capabilityDesigns", target: "exact compatible-feedback owner", source: "compatible-feedback exact coordinates", preserves: ["source", "background", "why", "conclusion", "implication"] }], "WAIT"],
    land: [["RUN", { action: "delete-byte-identical-compatible-feedback-marker" }], ["COMMIT", { scope: "compatible-feedback-owner-and-marker", touches: ["compatible.owner", "devflow/journal.md"] }], "ROUTE:resume"]
  }, body: "stage: compatible-feedback" },
  { id: "knowledge-landing", reads: ["state.route", "marker.knowledge", "marker.count"], acceptsUnknown: [], done: s => s.state.route !== "marker.knowledge-landing" && s.marker.knowledge === "none" && s.marker.count === 0, needs: ["landing.mode"], reentry: "rejudge", branches: {
    compact: [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeOwner", template: "result" }], ["RUN", { action: "delete-only-selected-byte-identical-markers" }], ["COMMIT", { boundary: "atomic-knowledge-landing" }], "NEXT"],
    recursive: [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["RUN", { action: "delete-only-selected-byte-identical-markers" }], ["COMMIT", { boundary: "atomic-knowledge-landing" }], "NEXT"],
    "partial-compact": [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeOwner", template: "result" }], ["RUN", { action: "preserve-unconsumed-markers" }], ["COMMIT", { boundary: "atomic-partial-knowledge-landing" }], "NEXT"],
    "partial-recursive": [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["RUN", { action: "preserve-unconsumed-markers" }], ["COMMIT", { boundary: "atomic-partial-knowledge-landing" }], "NEXT"]
  }, body: "stage: knowledge-landing" },
  { id: "entry", reads: ["entry.mode", "entry.status"], acceptsUnknown: [], done: s => s.entry.status === "read" || s.entry.mode === "none", needs: ["entry.mode", "entry.status"], reentry: "rejudge", branches: {
    "capability-only": [["READ", { artifact: "layer0" }], "NEXT"],
    "design-only": [["READ", { artifact: "layer0" }], ["READ", { artifact: "journal" }], "NEXT"],
    "glossary-only": [["READ", { artifact: "layer0" }], "NEXT"],
    initial: [["READ", { artifact: "codeEvidence" }], ["READ", { artifact: "existingRecords" }], "NEXT"],
    partial: [["READ", { artifact: "layer0" }], ["READ", { artifact: "codeEvidence" }], "NEXT"]
  }, body: "stage: entry" },
  { id: "inspect-and-trace", reads: ["inspection.status", "evidence.inventory", "evidence.flow", "evidence.records"], acceptsUnknown: [], done: s => s.inspection.status === "traced" && s.evidence.inventory === "present" && s.evidence.flow === "present" && s.evidence.records !== "unknown", needs: ["inspection.status"], reentry: "rejudge", branches: {
    needed: [["RUN", { action: "enumerate-external-entrypoints-and-top-level-modules" }], ["RUN", { action: "trace-one-executable-flow-per-candidate" }], ["REPORT", { template: "adoptionProposal", format: "flowEvidence" }], "NEXT"],
    traced: [["REPORT", { template: "result" }], "BLOCK"],
    "evidence-missing": [["REPORT", { template: "result" }], "BLOCK"]
  }, body: "stage: inspect-and-trace" },
  { id: "derive-layer-zero", reads: ["derivation.status"], acceptsUnknown: [], done: s => s.derivation.status === "confirmed", needs: ["derivation.status"], reentry: "rejudge", branches: {
    needed: [["READ", { path: "references/workflow.md" }], ["REPORT", { template: "adoptionProposal", format: "existingRecord" }], "NEXT"],
    draft: [["REPORT", { template: "adoptionProposal" }], "NEXT"],
    contradiction: [["REPORT", { template: "result" }], "ASK"]
  }, body: "stage: derive-layer-zero" },
  { id: "proposal", reads: ["proposal.status"], acceptsUnknown: [], done: s => s.proposal.status === "ready", needs: ["proposal.status"], reentry: "rejudge", branches: {
    draft: [["REPORT", { template: "adoptionProposal" }], "ASK"], interrupted: [["REPORT", { template: "adoptionProposal" }], "ASK"]
  }, body: "stage: proposal" },
  { id: "approval", reads: ["request.kind"], acceptsUnknown: [], done: s => s.request.kind === "capability-only" || s.request.kind === "none", needs: ["approval.action"], table: "approval", reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "adoptionProposal" }], "ASK"], refuse: [["REPORT", { template: "result" }], "DONE"], approve: [["WRITE", { artifact: "product", template: "product" }], ["WRITE", { artifact: "architecture", template: "architecture" }], ["WRITE", { artifact: "codeStyle", template: "codeStyle" }], ["WRITE", { artifact: "glossary", template: "glossary" }], ["COMMIT", { boundary: "confirmed-brownfield-layer-zero" }], "NEXT"]
  }, body: "stage: approval" },
  { id: "capability-design", reads: ["state.capabilities"], acceptsUnknown: [], done: s => s.state.capabilities === "current", needs: ["capability.action", "route.after"], table: "capabilityRoute", reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "capabilityDesign" }], "ASK"], design: [["WRITE", { artifact: "capabilityDesigns", template: "capabilityDesign" }], ["COMMIT", { boundary: "adopt-capabilities" }], "ROUTE:design"], resume: [["WRITE", { artifact: "capabilityDesigns", template: "capabilityDesign" }], ["COMMIT", { boundary: "adopt-capabilities" }], "ROUTE:resume"], split: [["WRITE", { artifact: "capabilityDesigns", template: "capabilityDesign" }], ["COMMIT", { boundary: "adopt-capabilities" }], "ROUTE:split"]
  }, body: "stage: capability-design" }
];

export const ARTIFACTS = {
  codeEvidence: { path: "<project code entrypoints and modules>", writer: "project.code", readers: ["stage.entry", "stage.inspect-and-trace"] },
  existingRecords: { path: "<project docs and specs selected by filename evidence>", writer: "project.docs", readers: ["stage.entry", "stage.inspect-and-trace", "stage.derive-layer-zero"] },
  layer0: { path: "devflow/project", writer: "adopt", readers: ["stage.entry", "stage.derive-layer-zero", "stage.capability-design"] },
  product: { path: "devflow/project/product.md", writer: "adopt", readers: ["stage.approval", "stage.capability-design", "external.split"], template: "product" },
  architecture: { path: "devflow/project/arch.md", writer: "adopt", readers: ["stage.compatible-feedback", "stage.approval", "stage.capability-design", "external.resume"], template: "architecture" },
  codeStyle: { path: "devflow/project/code-style.md", writer: "adopt", readers: ["stage.approval", "external.split"], template: "codeStyle" },
  glossary: { path: "devflow/project/glossary.md", writer: "adopt", readers: ["stage.approval", "stage.capability-design", "external.split"], template: "glossary" },
  compatibleFeedbackMarker: { path: "devflow/journal.md#compatible-feedback-pending", writer: "adopt", readers: ["stage.compatible-feedback"] },
  journal: { path: "devflow/journal.md", writer: "external.principles", readers: ["stage.compatible-feedback", "stage.entry", "stage.knowledge-landing"] },
  capabilityDesigns: { path: "devflow/project/capabilities", writer: "adopt", readers: ["stage.compatible-feedback", "stage.capability-design", "external.split", "external.resume"], template: "capabilityDesign" },
  knowledgeOwner: { path: "devflow/project/arch.md", writer: "adopt", readers: ["stage.knowledge-landing"] },
  knowledgeNodes: { path: "devflow/project/capabilities", writer: "adopt", readers: ["stage.knowledge-landing"], template: "knowledgeNode" }
};

export const ROLES = {};
export const READ_FIRST = [{ body: "why: purpose", path: "references/purpose.md" }, { body: "why: workflow", path: "references/workflow.md" }, { body: "why: knowledge-landing", path: "references/knowledge-landing.md" }];
export const DECLARATIONS = {
  state_api: { value: "Call sibling principles calculateState({ root: explicitRealpath }) and accept only devflow/project-state/2; never parse its CLI, raw journal, render output, or process.cwd().", consumer: "collector" },
  representative_flow: { value: "Each candidate has a code-observed external entry, ordered path, and observable outcome before it may support a capability boundary.", consumer: "stage:inspect-and-trace" },
  brownfield_effects: { value: "Report evidence and drafts before approval; refusal writes nothing; approval commits Layer 0 before capability design and baseline commits.", consumer: "stage:approval" },
  knowledge_landing: { value: "Consume only exact valid writer=adopt knowledge-landing markers. Compact owner writes or owner-adjacent recursive K writes delete only selected markers atomically; adopt never produces markers.", consumer: "stage:knowledge-landing" },
  knowledge_shape: { value: "K has a subtree-unique immutable number, exact card@full-hash line-range Source basis, zero children allowed, and no Parent, index, residual, or batch metadata.", consumer: "template:knowledgeNode" }
};
export const DEFERRED = [];
