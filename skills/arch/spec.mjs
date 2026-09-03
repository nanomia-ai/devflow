import { line } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "arch", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "state.kernel": { collector: "state.arch-kernel", domain: ["available", "unavailable"] },
  "state.route": { collector: "state.arch-route", domain: [
    "none", "git.open-operation", "integrity.blocking", "integrity.shape",
    "marker.glossary-term", "marker.design-note", "marker.design-open-item", "marker.knowledge-landing", "marker.compatible-feedback",
    "setup.no-product", "setup.layer0-incomplete", "setup.brownfield-field", "setup.integration-config",
    "baseline.legacy-v010", "baseline.design-refresh", "baseline.boundary",
    "complete.product-pass", "complete.adoption", "owned-elsewhere", "unrecognized"
  ] },
  "state.brownfield": { collector: "state.arch-brownfield", domain: ["yes", "no", "unknown"] },
  "state.code": { collector: "state.arch-code", domain: ["none", "present", "unknown"] },
  "state.frontend": { collector: "state.arch-frontend", domain: ["none", "needed", "unknown"] },
  "state.worktrees": { collector: "state.arch-worktrees", domain: ["one", "many", "unknown"] },
  "state.layer0": { collector: "state.arch-layer0", domain: ["incomplete", "current", "unknown"] },
  "state.capabilities": { collector: "state.arch-capabilities", domain: ["missing", "refresh", "current", "unknown"] },
  "state.expected": { collector: "state.arch-expected", domain: "integer" },
  "marker.knowledge": { collector: "knowledge.arch-markers", domain: "text" },
  "marker.knowledgeCount": { collector: "knowledge.arch-marker-count", domain: "integer" },
  "compatible.owner": { collector: "state.compatible-owner", domain: ["none", "arch", "capability", "invalid"] },
  "compatible.landing": { collector: "state.compatible-landing", domain: ["none", "pending", "satisfied", "invalid"] },

  "request.kind": { judged: true, domain: ["initial", "refresh", "capability-only", "none"] },
  "glossary.phase": { judged: true, domain: ["definition", "align-capabilities"] },
  "landing.mode": { judged: true, domain: ["compact", "recursive", "partial-compact", "partial-recursive", "multi-mixed"] },
  "inputs.status": { judged: true, domain: ["needed", "read"] },
  "refresh.result": { judged: true, domain: ["compatible", "product-contradiction", "capability-only"] },
  "components.status": { judged: true, domain: ["derive", "proposed", "confirmed"] },
  "research.state": { judged: true, domain: ["none", "needed", "active", "blocked", "settled", "conflicted", "unavailable"] },
  "stack.status": { judged: true, domain: ["propose", "needs-choice", "confirmed"] },
  "project.shape": { judged: true, domain: ["screen-heavy", "under-twenty-files", "three-plus-capabilities", "confirmed"] },
  "verification.state": { judged: true, domain: ["select", "probe", "confirmed", "unavailable"] },
  "proposal.state": { judged: true, domain: ["draft", "interrupted", "ready"] },
  "capacity.state": { judged: true, domain: ["enough", "warned"] },
  "approval.action": { decided: true, domain: ["ask", "approve", "refuse"] },
  "capability.action": { decided: true, domain: ["ask", "approve"] },
  "route.after": { decided: true, domain: ["design", "direct", "resume"] },
  "repair.action": { decided: true, domain: ["ask", "commit"] }
};

export const FORMATS = {
  architectureDecision: line("architecture decision", {
    area: ["component", "stack", "derived", "structure", "data", "verify-channel"],
    status: ["proposed", "confirmed", "superseded"],
    decision: "text"
  }),
  verifyChannelEvidence: line("verify channel evidence", {
    exit: "integer",
    verdict: ["pass", "fail", "unavailable"],
    evidence: "text"
  })
};

export const TEMPLATES = {
  proposal: { file: "templates/proposal.md", fields: {
    components: "list", survivalEvidence: "list", stackChoices: "list", derivedChoices: "list",
    codeStructure: "block", data: "block", verificationChannel: "block", provisionalRows: "generated",
    risks: "list", outOfScope: "list", adrReview: "list", openChoices: "list"
  }, sections: [] },
  architecture: { file: "templates/architecture.md", fields: {
    brownfield: "line", components: "list", stack: "list", codeStructure: "block", data: "block", existingRecords: "block",
    provisionalRows: "generated", risks: "list", outOfScope: "list", frontend: "line", workServer: "line",
    verifyMeans: "line", integration: "line", merge: "line"
  }, sections: [] },
  codeStyle: { file: "templates/code-style.md", fields: {
    values: "list", projectChoices: "list", trustPosture: "line", trustBoundaries: "list", nonGoals: "list"
  }, sections: [] },
  adr: { file: "templates/adr.md", fields: {
    number: "line", title: "line", context: "block", options: "list", decision: "block", consequences: "list"
  }, sections: [] },
  capabilityDesign: { file: "templates/capability-design.md", fields: {
    number: "line", name: "line", purpose: "line", boundary: "line", concepts: "line", intent: "block",
    conceptRows: "generated", invariants: "list", nonGoals: "list", bindingAdrs: "list",
    designHead: "line"
  }, sections: [] },
  knowledgeNode: { file: "templates/knowledge-node.md", fields: {
    title: "line", openWhen: "line", about: "line", body: "block", sourceBasis: "generated"
  }, sections: [] },
  channelEvidence: { file: "templates/channel-evidence.md", fields: {
    command: "line", exitCode: "line", readProbe: "block", interactionProbe: "block", cleanContext: "block", verdict: "line"
  }, sections: [] },
  glossary: { file: "templates/glossary.md", fields: { terms: "generated" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block", next: "line" }, sections: [] }
};

export const ORDERS = {
  workflow: [
    "canonical-entry", "compatible-feedback", "marker-consumption", "read-inputs", "refresh-check", "component-derivation",
    "candidate-survival-research", "stack-and-derived-decisions", "code-structure", "verify-channel",
    "proposal", "explicit-approval", "layer-0-commit", "capability-design", "route-after-commit"
  ],
  landingAtomic: ["read-exact-source", "choose-compact-or-recursive", "write-authorized-owner", "delete-consumed-marker", "boundary-commit"]
};

export const OWNERSHIP = {
  ".devflow/project/arch.md": "arch",
  ".devflow/project/code-style.md": "arch",
  ".devflow/project/glossary.md": "arch",
  ".devflow/project/decisions": "arch",
  ".devflow/project/capabilities": "arch",
  ".devflow/project": "arch",
  ".devflow/project/product.md": "external.product",
  ".devflow/journal.md#compatible-feedback-pending": "arch-on-exact-owner-landing",
  ".devflow/journal.md": "external.principles"
};

export const GUARDS = [
  { id: "state-kernel-unavailable", reads: ["state.kernel"], acceptsUnknown: [], when: s => s.state.kernel === "unavailable", then: "BLOCK", body: "guard: state-kernel-unavailable" },
  { id: "compatible-feedback-shape", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "invalid" || s.compatible.landing === "invalid", then: "BLOCK", body: "guard: compatible-feedback-shape" },
  { id: "layer0-state-unknown", reads: ["state.layer0"], acceptsUnknown: [], when: s => s.state.layer0 === "unknown", then: "BLOCK", body: "guard: layer0-state-unknown" },
  { id: "worktree-state-unknown", reads: ["state.worktrees"], acceptsUnknown: [], when: s => s.state.worktrees === "unknown", then: "ASK", body: "guard: worktree-state-unknown" },
  { id: "canonical-integrity-block", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "integrity.blocking", then: "BLOCK", body: "guard: canonical-integrity-block" },
  { id: "open-git-operation", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "git.open-operation", then: "ASK", body: "guard: open-git-operation" },
  { id: "product-required", reads: ["state.route", "state.code", "state.brownfield"], acceptsUnknown: [], when: s => s.state.route === "setup.no-product" && s.state.code === "none" && s.state.brownfield !== "yes", then: "ROUTE:product", body: "guard: product-required" },
  { id: "partial-setup-owned-by-resume", reads: ["state.route", "state.code", "state.brownfield"], acceptsUnknown: [], when: s => s.state.route === "setup.no-product" && (s.state.code === "present" || s.state.brownfield === "yes"), then: "ROUTE:resume", body: "guard: partial-setup-owned-by-resume" },
  { id: "state-owned-elsewhere", reads: ["state.route"], acceptsUnknown: [], when: s => s.state.route === "owned-elsewhere" || s.state.route === "unrecognized", then: "ROUTE:resume", body: "guard: state-owned-elsewhere" }
];

export const TABLES = {
  compatibleFeedback: { exclusive: true, rows: [
    { state: "write-arch", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "arch" && s.compatible.landing === "pending" },
    { state: "write-capability", reads: ["compatible.owner", "compatible.landing"], acceptsUnknown: [], when: s => s.compatible.owner === "capability" && s.compatible.landing === "pending" },
    { state: "land", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  structureChoice: { exclusive: true, reads: ["project.shape"], rows: [
    { state: "recommend-b", reads: ["project.shape"], acceptsUnknown: [], when: s => s.project.shape === "screen-heavy" },
    { state: "recommend-c", reads: ["project.shape"], acceptsUnknown: [], when: s => s.project.shape === "under-twenty-files" },
    { state: "recommend-a", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  approvalBoundary: { exclusive: true, reads: ["approval.action", "request.kind"], rows: [
    { state: "ask", reads: ["approval.action"], acceptsUnknown: [], when: s => s.approval.action === "ask" },
    { state: "refuse", reads: ["approval.action"], acceptsUnknown: [], when: s => s.approval.action === "refuse" },
    { state: "approve-initial", reads: ["approval.action", "request.kind"], acceptsUnknown: [], when: s => s.approval.action === "approve" && s.request.kind === "initial" },
    { state: "approve-refresh", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  capabilityRoute: { exclusive: true, reads: ["capability.action", "route.after", "state.frontend"], rows: [
    { state: "ask", reads: ["capability.action"], acceptsUnknown: [], when: s => s.capability.action === "ask" },
    { state: "approve-design", reads: ["capability.action", "route.after", "state.frontend"], acceptsUnknown: [], when: s => s.capability.action === "approve" && s.route.after === "design" && s.state.frontend === "needed" },
    { state: "approve-resume", reads: ["capability.action", "route.after"], acceptsUnknown: [], when: s => s.capability.action === "approve" && s.route.after === "resume" },
    { state: "approve-direct", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "compatible-feedback", reads: ["compatible.owner"], acceptsUnknown: [], done: s => s.compatible.owner === "none", table: "compatibleFeedback", reentry: "rejudge", branches: {
    "write-arch": [["WRITE", { artifact: "architecture", source: "compatible-feedback exact coordinates", preserves: ["source", "background", "why", "conclusion", "implication"] }], "WAIT"],
    "write-capability": [["WRITE", { artifact: "capabilityDesignZones", target: "exact compatible-feedback owner", source: "compatible-feedback exact coordinates", preserves: ["source", "background", "why", "conclusion", "implication"] }], "WAIT"],
    land: [["RUN", { action: "delete-byte-identical-compatible-feedback-marker" }], ["COMMIT", { scope: "compatible-feedback-owner-and-marker", touches: ["compatible.owner", ".devflow/journal.md"] }], "ROUTE:resume"]
  }, body: "stage: compatible-feedback" },
  { id: "glossary-term", reads: ["state.route"], acceptsUnknown: [], done: s => s.state.route !== "marker.glossary-term", needs: ["glossary.phase"], reentry: "rejudge", branches: {
    definition: [["READ", { path: "references/workflow.md" }], ["WRITE", { artifact: "glossary", template: "glossary" }], ["COMMIT", { boundary: "glossary-definition-marker-retained" }], "NEXT"],
    "align-capabilities": [["WRITE", { artifact: "glossary", template: "glossary" }], ["WRITE", { artifact: "capabilityDesignZones", template: "capabilityDesign" }], ["RUN", { action: "delete-byte-identical-glossary-marker" }], ["COMMIT", { boundary: "glossary-capability-alignment" }], "NEXT"]
  }, body: "stage: glossary-term" },

  { id: "design-marker", reads: ["state.route"], acceptsUnknown: [], done: s => s.state.route !== "marker.design-note" && s.state.route !== "marker.design-open-item", effects: [
    ["READ", { path: "references/workflow.md" }], ["WRITE", { artifact: "capabilityDesignZones", template: "capabilityDesign" }], ["RUN", { action: "delete-byte-identical-routed-design-line" }], ["COMMIT", { boundary: "binding-capability-design" }], "ROUTE:resume"
  ], reentry: "rejudge", body: "stage: design-marker" },

  { id: "knowledge-landing", reads: ["marker.knowledge", "marker.knowledgeCount"], acceptsUnknown: [], done: s => s.marker.knowledge === "none" && s.marker.knowledgeCount === 0, needs: ["landing.mode"], reentry: "rejudge", branches: {
    compact: [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeOwnerScope", template: "result" }], ["RUN", { action: "delete-only-consumed-owner-marker" }], ["COMMIT", { boundary: "atomic-knowledge-landing" }], "NEXT"],
    recursive: [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["RUN", { action: "delete-only-consumed-owner-marker" }], ["COMMIT", { boundary: "atomic-knowledge-landing" }], "NEXT"],
    "partial-compact": [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeOwnerScope", template: "result" }], ["RUN", { action: "delete-selected-owner-markers-and-preserve-residual-markers" }], ["COMMIT", { boundary: "atomic-partial-knowledge-landing" }], "NEXT"],
    "partial-recursive": [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["RUN", { action: "delete-selected-owner-markers-and-preserve-residual-markers" }], ["COMMIT", { boundary: "atomic-partial-knowledge-landing" }], "NEXT"],
    "multi-mixed": [["READ", { path: "references/knowledge-landing.md" }], ["WRITE", { artifact: "knowledgeOwnerScope", template: "result" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["RUN", { action: "delete-exactly-consumed-marker-set" }], ["COMMIT", { boundary: "atomic-multi-owner-knowledge-landing" }], "NEXT"]
  }, body: "stage: knowledge-landing" },

  { id: "repair-layer0-fields", reads: ["state.route"], acceptsUnknown: [], done: s => s.state.route !== "setup.brownfield-field" && s.state.route !== "setup.integration-config", needs: ["repair.action"], reentry: "rejudge", branches: {
    ask: ["ASK"],
    commit: [["WRITE", { artifact: "architecture", template: "architecture" }], ["COMMIT", { boundary: "canonical-layer-0-field-repair" }], "ROUTE:resume"]
  }, body: "stage: repair-layer0-fields" },

  { id: "read-inputs", reads: ["inputs.status"], acceptsUnknown: [], done: s => s.inputs.status === "read", needs: ["inputs.status"], reentry: "rejudge", branches: {
    needed: [["READ", { artifact: "product" }], ["READ", { artifact: "glossary" }], ["READ", { artifact: "architecture" }], ["READ", { artifact: "codeStyle" }], ["READ", { artifact: "journal" }], ["READ", { artifact: "decisionRecords" }], ["READ", { path: "references/workflow.md" }], "NEXT"]
  }, body: "stage: read-inputs" },

  { id: "refresh-check", reads: ["refresh.result"], acceptsUnknown: [], done: s => s.refresh.result === "compatible", needs: ["refresh.result"], reentry: "rejudge", branches: {
    "product-contradiction": [["REPORT", { template: "result" }], "ROUTE:product"],
    "capability-only": [["REPORT", { template: "result" }], "ROUTE:resume"]
  }, body: "stage: refresh-check" },

  { id: "component-derivation", reads: ["components.status"], acceptsUnknown: [], done: s => s.components.status === "confirmed", needs: ["components.status"], reentry: "rejudge", branches: {
    derive: [["REPORT", { template: "proposal", format: "architectureDecision" }], "ASK"],
    proposed: [["REPORT", { template: "proposal", format: "architectureDecision" }], "ASK"]
  }, body: "stage: component-derivation" },

  { id: "candidate-research", reads: ["research.state"], acceptsUnknown: [], done: s => s.research.state === "none" || s.research.state === "settled", needs: ["research.state"], reentry: "rejudge", branches: {
    needed: [["REPORT", { template: "proposal" }], "ROUTE:direct"],
    active: [["REPORT", { template: "result" }], "ROUTE:work"],
    blocked: [["REPORT", { template: "result" }], "WAIT"],
    conflicted: [["REPORT", { template: "result" }], "BLOCK"],
    unavailable: [["REPORT", { template: "result" }], "BLOCK"]
  }, body: "stage: candidate-research" },

  { id: "stack-and-derived", reads: ["stack.status"], acceptsUnknown: [], done: s => s.stack.status === "confirmed", needs: ["stack.status"], reentry: "rejudge", branches: {
    propose: [["REPORT", { template: "proposal", format: "architectureDecision" }], "ASK"],
    "needs-choice": [["REPORT", { template: "proposal", format: "architectureDecision" }], "ASK"]
  }, body: "stage: stack-and-derived" },

  { id: "code-structure", reads: ["project.shape"], acceptsUnknown: [], done: s => s.project.shape === "confirmed", needs: ["project.shape"], table: "structureChoice", reentry: "rejudge", branches: {
    "recommend-a": [["REPORT", { template: "proposal", recommendation: "A" }], "ASK"],
    "recommend-b": [["REPORT", { template: "proposal", recommendation: "B" }], "ASK"],
    "recommend-c": [["REPORT", { template: "proposal", recommendation: "C" }], "ASK"]
  }, body: "stage: code-structure" },

  { id: "verify-channel", reads: ["verification.state"], acceptsUnknown: [], done: s => s.verification.state === "confirmed", needs: ["verification.state"], reentry: "rejudge", branches: {
    select: [["REPORT", { template: "proposal" }], "ASK"],
    probe: [["DISPATCH", { role: "channel-verifier" }], "WAIT"],
    unavailable: [["REPORT", { template: "channelEvidence" }], "ASK"]
  }, body: "stage: verify-channel" },

  { id: "proposal", reads: ["proposal.state"], acceptsUnknown: [], done: s => s.proposal.state === "ready", needs: ["proposal.state"], reentry: "rejudge", branches: {
    draft: [["REPORT", { template: "proposal" }], "ASK"],
    interrupted: [["REPORT", { template: "proposal" }], "ASK"]
  }, body: "stage: proposal" },

  { id: "approval", reads: ["request.kind"], acceptsUnknown: [], done: s => s.request.kind === "capability-only" || s.request.kind === "none", needs: ["approval.action", "request.kind"], table: "approvalBoundary", reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "proposal" }], "ASK"],
    refuse: [["REPORT", { template: "result" }], "DONE"],
    "approve-initial": [["WRITE", { artifact: "architecture", template: "architecture", fields: { brownfield: "no" } }], ["WRITE", { artifact: "codeStyle", template: "codeStyle" }], ["WRITE", { artifact: "decisionRecords", template: "adr" }], ["COMMIT", { boundary: "confirmed-layer-0" }], "NEXT"],
    "approve-refresh": [["WRITE", { artifact: "architecture", template: "architecture", fields: { brownfield: "state.brownfield" } }], ["WRITE", { artifact: "codeStyle", template: "codeStyle" }], ["WRITE", { artifact: "decisionRecords", template: "adr" }], ["COMMIT", { boundary: "binding-architecture-refresh" }], "NEXT"]
  }, body: "stage: approval" },

  { id: "capability-capacity", reads: ["capacity.state"], acceptsUnknown: [], done: s => s.capacity.state === "enough", needs: ["capacity.state"], reentry: "rejudge", branches: {
    warned: [["REPORT", { template: "result" }], "ROUTE:resume"]
  }, body: "stage: capability-capacity" },

  { id: "capability-design", reads: ["state.capabilities", "state.expected"], acceptsUnknown: [], done: s => s.state.capabilities === "current" || s.state.expected === 0, needs: ["capability.action", "route.after"], table: "capabilityRoute", reentry: "rejudge", branches: {
    ask: [["REPORT", { template: "capabilityDesign", countFrom: "state.expected" }], "ASK"],
    "approve-design": [["WRITE", { artifact: "capabilityDesignZones", template: "capabilityDesign" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["COMMIT", { boundary: "capability-design" }], "ROUTE:design"],
    "approve-resume": [["WRITE", { artifact: "capabilityDesignZones", template: "capabilityDesign" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["COMMIT", { boundary: "capability-design" }], "ROUTE:resume"],
    "approve-direct": [["WRITE", { artifact: "capabilityDesignZones", template: "capabilityDesign" }], ["WRITE", { artifact: "knowledgeNodes", template: "knowledgeNode" }], ["COMMIT", { boundary: "capability-design" }], "ROUTE:direct"]
  }, body: "stage: capability-design" }
];

export const ARTIFACTS = {
  product: { path: ".devflow/project/product.md", writer: "external.product", readers: ["stage.read-inputs", "stage.capability-design", "external.direct"] },
  glossary: { path: ".devflow/project/glossary.md", writer: "arch", readers: ["stage.glossary-term", "stage.read-inputs", "stage.capability-design", "external.direct"], template: "glossary" },
  architecture: { path: ".devflow/project/arch.md", writer: "arch", readers: ["stage.compatible-feedback", "stage.repair-layer0-fields", "stage.read-inputs", "stage.approval", "stage.capability-design", "external.design", "external.direct", "external.resume"], template: "architecture" },
  codeStyle: { path: ".devflow/project/code-style.md", writer: "arch", readers: ["stage.read-inputs", "stage.approval", "external.direct", "external.work"], template: "codeStyle" },
  compatibleFeedbackMarker: { path: ".devflow/journal.md#compatible-feedback-pending", writer: "arch", readers: ["stage.compatible-feedback"] },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.compatible-feedback", "stage.glossary-term", "stage.design-marker", "stage.knowledge-landing", "stage.read-inputs", "external.resume"] },
  decisionRecords: { path: ".devflow/project/decisions", writer: "arch", readers: ["stage.read-inputs", "stage.approval", "stage.capability-design", "external.work"], template: "adr" },
  capabilityDesignZones: { path: ".devflow/project/capabilities", writer: "arch", readers: ["stage.compatible-feedback", "stage.glossary-term", "stage.design-marker", "stage.capability-design", "external.direct", "external.work", "external.verify", "external.resume"], template: "capabilityDesign" },
  knowledgeOwnerScope: { path: ".devflow/project", writer: "arch", readers: ["stage.knowledge-landing", "external.resume"] },
  knowledgeNodes: { path: ".devflow/project", writer: "arch", readers: ["stage.knowledge-landing", "stage.capability-design", "external.work", "external.resume"], template: "knowledgeNode" }
};

export const ROLES = {
  "channel-verifier": { body: "role: channel-verifier", effects: [], returns: "channelEvidence" }
};

export const READ_FIRST = [
  { body: "why: purpose", path: "references/purpose.md" },
  { body: "why: workflow", path: "references/workflow.md" },
  { body: "why: schemas", path: "references/schemas.md" },
  { body: "why: knowledge-landing", path: "references/knowledge-landing.md" },
  { body: "why: legacy", path: "references/legacy-source.md" }
];

export const DECLARATIONS = {
  profile: { value: "p2", consumer: "build:profile" },
  stateApi: { value: "Every project-state observation comes from the context-bound sibling principles calculateState export. The collector never invokes its CLI, renders compatibility text, parses journal bytes, or uses process.cwd().", consumer: "collectors" },
  reportBeforeApproval: { value: "Canonical architecture and code-style writes occur only after the proposal report and explicit approval decision.", consumer: "stage:approval" },
  managedProjectWriter: { value: "Arch is the current design-zone and recursive K writer for every devflow-managed project, including adopted brownfields; Adopt owns only initial unmanaged reconstruction.", consumer: "stage:design-marker|stage:capability-design" },
  brownfieldOrigin: { value: "Initial architecture approval writes Brownfield: no. Managed refresh binds the architecture template's Brownfield field to the canonical observed project origin and preserves it; Brownfield is not a routing predicate.", consumer: "template:architecture|stage:approval" },
  knowledgeAuthority: { value: "Arch consumes every structured valid knowledge marker emitted by calculateState. writer=adopt is legacy provenance and writer=arch is current provenance; neither changes Arch's current managed-project stage ownership, and Arch never produces a marker or writes outside marker-named authorized owners.", consumer: "stage:knowledge-landing" },
  recursiveK: { value: "Recursive K is owner-adjacent through same-stem folders, uses numbers unique in the whole owner subtree, permits a leaf with zero children, cites exact card@fullhash line ranges, and has no Parent field, manual index, residual record, or batch record.", consumer: "templates:knowledgeNode" },
  atomicLanding: { value: "Selected marker deletion, owner or K write, and the matching boundary commit form one effect plan; partial multi-owner landing preserves every unconsumed marker.", consumer: "stage:knowledge-landing" },
  legacySchemas: { value: "The exact Layer 0, capability-document design-zone, verification scaffold, provisional, ADR, and channel-evidence shapes are template-owned and are not reconstructed from the atom ledger.", consumer: "templates" },
  workflowOrder: { value: "Entry and prerequisites precede components, candidate-survival research, stack and derived decisions, code structure, verify channel, report, explicit approval, Layer 0 commit, capability design, and final routing.", consumer: "stages" },
  migrationEvidence: { value: "Each of the 158 imported atoms resolves to a behavioral source locator and an executing fixture; legacy provenance files are never used as behavioral evidence.", consumer: "migration:obligation-ledger" }
};

export const DEFERRED = [];
