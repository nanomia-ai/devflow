export const SPEC = { version: "5", id: "adopt", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "state.kernel": { collector: "state.kernel", domain: ["available", "unavailable"] },
  "state.route": { collector: "state.route", domain: ["none", "git.open-operation", "integrity.blocking", "setup.unmanaged", "owned-elsewhere"] },
  "state.material": { collector: "state.material", domain: ["present", "none", "unknown"] },
  "approval.action": { decided: true, domain: ["approve", "refuse"] }
};

export const FORMATS = {};

export const TEMPLATES = {
  adoptionProposal: { file: "templates/adoption-proposal.md", fields: { sourceInventory: "list", candidates: "list", flows: "list", documentClaims: "list", product: "block", architecture: "block", design: "block", codeStyle: "block", glossary: "list", capabilityDesigns: "list", knowledgeNodes: "list", followOn: "block", questions: "list", contradictions: "list", verification: "block", binding: "block" }, sections: [] },
  product: { file: "templates/product.md", fields: { serviceName: "line", identity: "block", problem: "block", approach: "block", capabilityRows: "generated", boundary: "block", successCriteria: "list", accessPoints: "list", openQuestions: "block", interface: "line" }, sections: [] },
  architecture: { file: "templates/architecture.md", fields: { brownfield: "line", components: "list", stack: "list", codeStructure: "block", data: "block", existingRecords: "block", provisionalRows: "generated", risks: "list", outOfScope: "list", frontend: "line", workServer: "line", verifyMeans: "line", integration: "line", merge: "line" }, sections: [] },
  design: { file: "templates/design.md", fields: { approach: "line", designSource: "line", tokenStrategy: "line", componentStrategy: "line", decompositionAxis: "line", reviewSurface: "line", buildScope: "block" }, sections: [] },
  codeStyle: { file: "templates/code-style.md", fields: { values: "list", projectChoices: "list", trustPosture: "line", trustBoundaries: "list", nonGoals: "list" }, sections: [] },
  capabilityDesign: { file: "templates/capability-design.md", fields: { number: "line", name: "line", purpose: "line", boundary: "line", concepts: "line", intent: "block", conceptRows: "generated", invariants: "list", nonGoals: "list", bindingAdrs: "list", designHead: "line" }, sections: [] },
  knowledgeNode: { file: "templates/knowledge-node.md", fields: { title: "line", openWhen: "line", about: "line", body: "block", sourceBasis: "generated" }, sections: [] },
  glossary: { file: "templates/glossary.md", fields: { terms: "generated" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block", next: "line" }, sections: [] }
};

export const ORDERS = {};

export const OWNERSHIP = {
  ".devflow/project": "adopt",
  ".devflow/project/product.md": "adopt",
  ".devflow/project/arch.md": "adopt",
  ".devflow/project/code-style.md": "adopt",
  ".devflow/project/design.md": "adopt",
  ".devflow/project/glossary.md": "adopt",
  ".devflow/project/capabilities": "adopt",
  ".devflow/project/capabilities/**": "adopt",
  ".devflow/journal.md": "external.principles",
  ".devflow/tree/**": "external.direct"
};

export const GUARDS = [
  { id: "state-kernel-unavailable", reads: ["state.kernel"], acceptsUnknown: [], when: s => s.state.kernel === "unavailable", then: "BLOCK", body: "guard: state-kernel-unavailable" },
  { id: "canonical-integrity-block", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "integrity.blocking", then: "BLOCK", body: "guard: canonical-integrity-block" },
  { id: "open-git-operation", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "git.open-operation", then: "ASK", body: "guard: open-git-operation" },
  { id: "no-project-material-routes-product", reads: ["state.route", "state.material"], acceptsUnknown: [], when: s => s.state.route === "setup.unmanaged" && s.state.material === "none", then: "ROUTE:product", body: "guard: no-project-material-routes-product" },
  { id: "unknown-project-material", reads: ["state.route", "state.material"], acceptsUnknown: [], when: s => s.state.route === "setup.unmanaged" && s.state.material === "unknown", then: "BLOCK", body: "guard: unknown-project-material" },
  { id: "state-owned-elsewhere", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route !== "setup.unmanaged", then: "ROUTE:resume", body: "guard: state-owned-elsewhere" }
];

export const TABLES = {
  approval: { exclusive: true, rows: [
    { state: "refuse", reads: ["approval.action"], acceptsUnknown: ["approval.action"], when: s => s.approval.action === "refuse" },
    { state: "approve", reads: ["approval.action"], acceptsUnknown: ["approval.action"], when: s => s.approval.action === "approve" },
    { state: "prepare", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "adoption", reads: ["state.route"], acceptsUnknown: [], done: s => s.state.route !== "setup.unmanaged", table: "approval", reentry: "rejudge", branches: {
    prepare: [["READ", { path: "references/workflow.md" }], ["RUN", { action: "inventory-all-maintained-code-docs-specs-and-records-with-exact-coordinates-and-one-disposition-each" }], ["RUN", { action: "trace-one-executable-flow-per-code-backed-capability-candidate-and-record-documentary-basis-for-document-derived-candidates" }], ["RUN", { action: "reverse-derive-complete-layer-zero-applicable-design-capability-zones-glossary-and-all-required-owner-adjacent-knowledge-then-run-one-bounded-clean-context-semantic-refutation-before-report" }], ["REPORT", { template: "adoptionProposal" }], "ASK"],
    refuse: [["REPORT", { template: "result" }], "DONE"],
    approve: [["WRITE", { artifact: "architecture", template: "architecture" }], ["WRITE", { artifact: "design", template: "design", selection: "when-existing-product-evidence-has-a-design-surface", zeroAllowed: true }], ["WRITE", { artifact: "codeStyle", template: "codeStyle" }], ["WRITE", { artifact: "glossary", template: "glossary" }], ["RUN", { action: "append-principles-maintenance-routing-pending-idempotently-with-the-whole-follow-on-request-when-adoption-includes-follow-on-work" }], ["WRITE", { artifact: "product", template: "product", ordering: "last-write-immediately-before-first-commit" }], ["COMMIT", { boundary: "confirmed-brownfield-layer-zero", staging: "only-layer-zero-and-follow-on-paths" }], ["RUN", { action: "calculate-canonical-design-head-from-the-landed-layer-zero-commit" }], ["WRITE", { artifact: "capabilityDesigns", template: "capabilityDesign", fields: { designHead: "canonical-design-head-output" } }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode", selection: "every-approved-domain-body-that-needs-depth-beyond-its-always-read-owner; zero-only-when-source-dispositions-prove-none-is-needed", zeroAllowed: true }], ["RUN", { action: "validate-every-written-knowledge-capsule-with-project-knowledge" }], ["COMMIT", { boundary: "confirmed-brownfield-capabilities-and-knowledge", staging: "only-capability-design-documents-and-their-knowledge-capsules" }], ["REPORT", { template: "result" }], "DONE"]
  }, body: "stage: adoption" }
];

export const ARTIFACTS = {
  product: { path: ".devflow/project/product.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct"], template: "product" },
  architecture: { path: ".devflow/project/arch.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.resume"], template: "architecture" },
  codeStyle: { path: ".devflow/project/code-style.md", writer: "adopt", readers: ["stage.adoption", "external.work"], template: "codeStyle" },
  design: { path: ".devflow/project/design.md", writer: "adopt", readers: ["stage.adoption", "external.design", "external.arch", "external.direct", "external.resume"], template: "design" },
  glossary: { path: ".devflow/project/glossary.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.work"], template: "glossary" },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.adoption"] },
  capabilityDesigns: { path: ".devflow/project/capabilities", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.resume", "external.work"], template: "capabilityDesign" },
  knowledgeNodes: { path: ".devflow/project", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.resume", "external.work"], template: "knowledgeNode" }
};

export const ROLES = {};
export const READ_FIRST = [{ body: "why: purpose", path: "references/purpose.md" }, { body: "why: workflow", path: "references/workflow.md" }];
export const DECLARATIONS = {
  state_api: { value: "Call sibling principles calculateState({ root: explicitRealpath }) and accept only devflow/project-state/2, including its single nonDevflowMaterial observation; never parse its CLI, raw journal, render output, or process.cwd().", consumer: "collector" },
  explicit_entry: { value: "Explicit Adopt consumes setup.unmanaged directly and never uses Principles or Resume as a preflight; all other states retain their canonical owner.", consumer: "guard:state-owned-elsewhere|stage:adoption" },
  representative_flow: { value: "Each capability candidate backed by executable code has one code-observed external entry, ordered path, and observable outcome. A document-derived candidate with no executable code instead cites its maintained documentary basis and marks executable flow as not applicable.", consumer: "stage:adoption" },
  source_coverage: { value: "Every maintained source receives one explicit disposition: landed in a named Product, Architecture, Design, glossary, capability, or K owner; retained as a supporting source with exact coordinates; superseded or contradicted by named evidence; or excluded as non-domain with a reason. The approved coordinates, authority status, disposition, and landing owner persist in Architecture Existing records; no maintained source is silently dropped and no second ledger is created. Before binding, one separate clean-context semantic refutation leaves no unexplained contradicted or unsupported claim and no omitted current constraint that permits a concrete wrong action, erases a required decision or rejected direction, misstates ownership, or omits required verification means; an unavailable or unresolved refutation blocks binding.", consumer: "template:adoptionProposal|template:architecture|stage:adoption" },
  brownfield_effects: { value: "Evidence and the complete proposal precede owner questions and one binding approval; refusal writes nothing. Approval first commits complete confirmed Layer 0 and any optional follow-on record as adopt — layer 0 with product.md written last, then writes capability design documents with Design head equal to that landed commit, writes and validates their K surface beside those owners, and commits both as adopt — capabilities. Before product.md is written the repository remains unmanaged; a post-product pre-commit interruption is reported for owner-directed Git recovery; after the first commit and before second-boundary writes, baseline-missing state is recovered by Resume to Arch, never by Adopt.", consumer: "stage:adoption" },
  follow_on_request: { value: "When the adoption request also contains follow-on work, append the whole request idempotently once through Principles maintenanceRoutingPending in the first adoption commit; adoption-only requests create no marker.", consumer: "stage:adoption" },
  knowledge_shape: { value: "K is created only when selected domain sources overflow the always-read capability document; it has subtree-unique immutable number, exact source basis, zero children allowed, and no Parent, index, residual, or batch metadata.", consumer: "template:knowledgeNode|stage:adoption" }
};
export const DEFERRED = [];
