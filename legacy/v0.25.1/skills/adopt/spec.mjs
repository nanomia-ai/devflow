import { line } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "adopt", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "state.kernel": { collector: "state.kernel", domain: ["available", "unavailable"] },
  "state.route": { collector: "state.route", domain: ["none", "git.open-operation", "integrity.blocking", "setup.unmanaged", "owned-elsewhere"] },
  "state.material": { collector: "state.material", domain: ["present", "none", "unknown"] },
  "approval.action": { decided: true, domain: ["approve", "refuse"] },
  "refutation.state": { decided: true, domain: ["pending", "revise", "clear", "blocked"] }
};

export const FORMATS = {
  maintenanceRoutingPending: line("maintenance routing pending", { "request-json": "json" })
};

export const TEMPLATES = {
  adoptionProposal: { file: "templates/adoption-proposal.md", fields: { workingLanguage: "line", sourceInventory: "list", candidates: "list", flows: "list", documentClaims: "list", adrReview: "list", product: "block", architecture: "block", design: "block", codeStyle: "block", glossary: "list", capabilityDesigns: "list", knowledgeNodes: "list", followOn: "block", questions: "list", contradictions: "list", verification: "block", binding: "block" }, sections: [] },
  product: { file: "templates/product.md", fields: { serviceName: "line", identity: "block", workingLanguage: "line", problem: "block", approach: "block", capabilityRows: "generated", boundary: "block", successCriteria: "list", accessPoints: "list", openQuestions: "block", interface: "line" }, sections: [] },
  architecture: { file: "templates/architecture.md", fields: { brownfield: "line", components: "list", stack: "list", codeStructure: "block", data: "block", existingRecords: "block", provisionalRows: "generated", risks: "list", outOfScope: "list", frontend: "line", workServer: "line", verifyMeans: "line", integration: "line", merge: "line" }, sections: [] },
  design: { file: "templates/design.md", fields: { approach: "line", designSource: "line", tokenStrategy: "line", componentStrategy: "line", decompositionAxis: "line", reviewSurface: "line", buildScope: "block" }, sections: [] },
  codeStyle: { file: "templates/code-style.md", fields: { values: "list", projectChoices: "list", trustPosture: "line", trustBoundaries: "list", nonGoals: "list" }, sections: [] },
  capabilityDesign: { file: "templates/capability-design.md", fields: { number: "line", name: "line", purpose: "line", boundary: "line", concepts: "line", intent: "block", conceptRows: "generated", invariants: "list", nonGoals: "list", bindingAdrs: "list", designHead: "line" }, sections: [] },
  knowledgeNode: { file: "templates/knowledge-node.md", fields: { title: "line", openWhen: "line", about: "line", body: "block", sourceBasis: "generated" }, sections: [] },
  glossary: { file: "templates/glossary.md", fields: { terms: "generated" }, sections: [] },
  refutationResult: { file: "templates/refutation-result.md", fields: { coverage: "list", findings: "list", verdict: "line", uncertainty: "block" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block", next: "line" }, sections: [] }
};

export const ORDERS = {};

export const OWNERSHIP = {
  ".devflow/project": "adopt",
  ".devflow/journal.md#maintenance-routing-pending": "adopt",
  ".devflow/users/<id>/**": "external.principles",
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
  { id: "state-owned-elsewhere", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route !== "setup.unmanaged", then: "ROUTE:resume", body: "guard: state-owned-elsewhere" },
  { id: "approval-precedes-refutation", reads: ["state.route", "refutation.state", "approval.action"], acceptsUnknown: ["refutation.state", "approval.action"], when: s => s.state.route === "setup.unmanaged" && s.approval.action === "approve" && s.refutation.state !== "clear", then: "BLOCK", body: "guard: approval-precedes-refutation" }
];

export const TABLES = {
  approval: { exclusive: true, rows: [
    { state: "refuse", reads: ["approval.action"], acceptsUnknown: ["approval.action"], when: s => s.approval.action === "refuse" },
    { state: "approve", reads: ["approval.action", "refutation.state"], acceptsUnknown: ["approval.action"], when: s => s.approval.action === "approve" && s.refutation.state === "clear" },
    { state: "prepare", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "semantic-refutation", reads: ["refutation.state"], acceptsUnknown: [], done: s => s.refutation.state === "clear", needs: ["refutation.state"], reentry: "rejudge", branches: {
    pending: [["READ", { path: "references/workflow.md" }], ["RUN", { action: "inventory-all-maintained-sources-by-knowledge-unit-with-exact-coordinates-disposition-and-landing-target" }], ["RUN", { action: "trace-one-executable-flow-per-code-backed-capability-candidate-and-record-documentary-basis-for-document-derived-candidates" }], ["RUN", { action: "reverse-derive-complete-layer-zero-applicable-design-capability-zones-glossary-whole-owner-adjacent-knowledge-and-adr-or-missing-ground-owner-landings" }], ["DISPATCH", { role: "refuter", template: "refutationResult" }], "WAIT"],
    revise: [["RUN", { action: "apply-evidence-supported-current-authority-correction-to-every-current-blocker-in-the-current-draft" }], ["DISPATCH", { role: "refuter", template: "refutationResult" }], "WAIT"],
    blocked: ["BLOCK"]
  }, body: "stage: semantic-refutation" },
  { id: "adoption", reads: ["state.route"], acceptsUnknown: [], done: s => s.state.route !== "setup.unmanaged", table: "approval", reentry: "rejudge", branches: {
    prepare: [["REPORT", { template: "adoptionProposal" }], "ASK"],
    refuse: [["REPORT", { template: "result" }], "DONE"],
    approve: [["WRITE", { artifact: "architecture", template: "architecture" }], ["WRITE", { artifact: "design", template: "design", selection: "when-existing-product-evidence-has-a-design-surface", zeroAllowed: true }], ["WRITE", { artifact: "codeStyle", template: "codeStyle" }], ["WRITE", { artifact: "glossary", template: "glossary" }], ["WRITE", { artifact: "maintenanceRoutingTransport", format: "maintenanceRoutingPending", selection: "when-adoption-includes-follow-on-work", idempotent: true, "request-json": "<the whole follow-on user request as one JSON string>" }], ["WRITE", { artifact: "product", template: "product", ordering: "last-layer-zero-owner-write-before-first-commit" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode", selection: "every-approved-layer-zero-owner-body-needing-depth-beyond-its-owner-document", zeroAllowed: true }], ["RUN", { action: "validate-every-written-layer-zero-knowledge-node-with-project-knowledge" }], ["WRITE", { artifact: "capabilityDesigns", template: "capabilityDesign", fields: { designHead: "none" }, ordering: "complete-approved-semantic-set-before-first-commit" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode", selection: "every-approved-capability-body-needing-depth-beyond-its-capability-document", zeroAllowed: true }], ["RUN", { action: "validate-every-written-capability-knowledge-node-with-project-knowledge" }], ["RUN", { action: "materialize the resolved actor room under the Principles Identity and Rooms contract only when absent, with digest equal to the pre-boundary HEAD or none for unborn history; preserve an existing room", artifact: "room" }], ["COMMIT", { boundary: "confirmed-brownfield-semantic-set", staging: "all-approved-owner-documents-same-owner-knowledge-and-follow-on-paths plus the newly materialized resolved-actor room triple when absent" }], ["RUN", { action: "calculate-canonical-design-head-from-the-landed-first-commit" }], ["WRITE", { artifact: "capabilityDesigns", fields: { designHead: "canonical-design-head-output" }, mutation: "replace-only-design-head-lines-equal-to-none" }], ["COMMIT", { boundary: "finalized-brownfield-design-heads", staging: "only-capability-documents-whose-design-head-line-changed" }], ["REPORT", { template: "result" }], "DONE"]
  }, body: "stage: adoption" }
];

export const ARTIFACTS = {
  room: { path: ".devflow/users", writer: "external.principles", readers: ["stage.adoption"] },
  maintenanceRoutingTransport: { path: ".devflow/journal.md#maintenance-routing-pending", writer: "adopt", readers: ["stage.adoption"] },
  product: { path: ".devflow/project/product.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct"], template: "product" },
  architecture: { path: ".devflow/project/arch.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.resume"], template: "architecture" },
  codeStyle: { path: ".devflow/project/code-style.md", writer: "adopt", readers: ["stage.adoption", "external.work"], template: "codeStyle" },
  design: { path: ".devflow/project/design.md", writer: "adopt", readers: ["stage.adoption", "external.design", "external.arch", "external.direct", "external.resume"], template: "design" },
  glossary: { path: ".devflow/project/glossary.md", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.work"], template: "glossary" },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.adoption"] },
  capabilityDesigns: { path: ".devflow/project/capabilities", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.direct", "external.resume", "external.work"], template: "capabilityDesign" },
  knowledgeNodes: { path: ".devflow/project", writer: "adopt", readers: ["stage.adoption", "external.arch", "external.resume", "external.work"], template: "knowledgeNode" }
};

export const ROLES = {
  refuter: {
    body: "role: refuter",
    inputs: ["complete-draft", "knowledge-unit-inventory-dispositions-and-exact-landing-targets", "load-bearing-current-and-proposed-source-and-code-coordinates", "maintained-source-path-list", "shared-baseline-and-knowledge-sections-opened-by-workflow-step-5", "arch-verification-channel-surface-and-required-channel-columns", "arch-first-proposal-paragraph-with-adr-conditions"],
    reads: ["provided-inputs-only", "maintained-source-paths-recomputed-in-clean-context"],
    effects: [],
    judgments: ["clear", "revise", "blocked"],
    returns: "refutationResult"
  }
};
export const READ_FIRST = [{ body: "why: purpose", path: "references/purpose.md" }, { body: "why: workflow", path: "references/workflow.md" }];
export const DECLARATIONS = {
  state_api: { value: "Call sibling principles calculateState({ root: explicitRealpath }) and accept only devflow/project-state/2, including its single nonDevflowMaterial observation; never parse its CLI, raw journal, render output, or process.cwd().", consumer: "collector" },
  explicit_entry: { value: "Explicit Adopt consumes setup.unmanaged directly and never uses Principles or Resume as a preflight; all other states retain their canonical owner.", consumer: "guard:state-owned-elsewhere|stage:adoption" },
  representative_flow: { value: "Each capability candidate backed by executable code has one code-observed external entry, ordered path, and observable outcome. A document-derived candidate with no executable code instead cites its maintained documentary basis and marks executable flow as not applicable.", consumer: "stage:adoption" },
  source_coverage: { value: "Every maintained source is covered during investigation by knowledge unit or supporting group rows with exact coordinates, authority, disposition, and a destination. Current meaning lands in an exact owner document or planned K path; an owner-kept live input also lands in Architecture Existing records and only the K footers it supports; every other nonlanding has exact disposition evidence or reason. A mixed source has one row per knowledge unit. This inventory is transient adoption evidence: absorbed-input coordinates do not persist in owner documents, K nodes, or Architecture Existing records. No maintained source is silently dropped during refutation and no second ledger is created.", consumer: "template:adoptionProposal|template:architecture|stage:adoption" },
  adr_landing: { value: "The proposal screens every ADR-qualified decision and every decision with missing ground and states its current direction, ground, dropped alternatives, and exact owner landing. Adopt creates no ADR artifact: current direction, ground, and dropped alternatives land self-contained in Architecture or capability Intent, with on-demand K only for additional depth; Binding ADRs names only exact existing decision paths, and Arch remains the formal ADR writer.", consumer: "template:adoptionProposal|template:architecture|template:capabilityDesign|stage:adoption" },
  working_language: { value: "Infer a proposed Working language from maintained meaningful human prose, never from code identifiers or other machine tokens; expose uncertainty, explicit owner preference, and the proposal before canonical writes. The owner may correct it without writing; every correction receives fresh independent semantic refutation before proposal reentry. Approved product.md becomes the single durable value owner while shared Principles policy governs every writer.", consumer: "template:adoptionProposal|template:product|stage:adoption" },
  semantic_refutation: { value: "Before binding, the declared refuter role returns one bounded clean-context semantic refutation of the complete draft; that role contract owns its inputs, exclusions, blocking threshold, and bounded recheck. A first revise requires the current draft, returned evidence, and a concrete current-authority correction for every current blocker; a later revise requires evidence that every attempted failure was removed or strictly narrowed in its causal scope without introducing or reopening a blocker. Clear requires preserved initial coverage, current independent verification, and no supported blocker or unanswered binding dependency. Block on no progress or regression, a required owner answer or authority contradiction, or missing required draft, source, prior evidence, or clean context; the returned result records current scope, findings, progress, and outcome under Evidence verification.", consumer: "template:adoptionProposal|template:refutationResult|role:refuter|stage:adoption" },
  brownfield_effects: { value: "Evidence and the complete proposal precede owner questions and one binding approval; refusal writes nothing. Approval writes and validates the complete Layer 0, capability, and K set before the first commit, with capability Design head none, then commits every approved owner document, same-owner K, and optional follow-on as adopt — layer 0. Because the Design-head command reads only product.md, arch.md, and glossary.md, Adopt can replace only the capability Design head lines with that first commit and land those line changes as adopt — capabilities. Once the first commit lands, all approved meaning is canonical and none makes the baseline stale for Resume-to-Arch recovery. Uncommitted bytes are never recovery input and Adopt adds no state or recovery protocol.", consumer: "stage:adoption" },
  follow_on_request: { value: "When the adoption request also contains follow-on work, append the whole request idempotently once through Principles maintenanceRoutingPending in the first adoption commit; adoption-only requests create no marker.", consumer: "stage:adoption" },
  knowledge_shape: { value: "K holds one whole, self-contained current knowledge unit that the always-read owner document should not carry; the shared capsule contract fixes its cohesion and split. It has a subtree-unique immutable number, zero children allowed, and no Parent, index, residual, or batch metadata. Its sourceBasis template field is empty for absorbed migration inputs; only an owner-designated live input or managed card evidence supplies the complete final Source basis line, which remains strongly validated.", consumer: "template:knowledgeNode|stage:adoption" }
};
export const DEFERRED = [];
