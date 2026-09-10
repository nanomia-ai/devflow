import { line } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "direct", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "project.product": { collector: "state.project.product", domain: ["present", "missing", "uncommitted-layer0", "unknown"] },
  "request.current": { collector: "state.request.current", domain: { source: "text", request: "text" } },
  "request.phase": { collector: "state.request.phase", domain: ["none", "uncommitted", "committed", "design-confirmed", "failure-routed"] },
  "origin.active": { collector: "state.origin.active", domain: { origin: "text", scopes: "json", children: "json" } },
  "origin.drafts": { collector: "state.origin.drafts", domain: { origin: "text", scopes: "json", cards: "json" } },
  "origin.projectResearch": { collector: "state.origin.project-research", domain: { origin: "text", path: "path" } },
  "projectResearch.approval": { collector: "state.project-research.approval", domain: ["none", "pending", "invalid", "effective"] },
  "approval.boundary": { collector: "state.approval.boundary", domain: { origin: "text", values: "json", cards: "json" } },
  "approval.issue": { collector: "state.approval.issue", domain: { origin: "text", cards: "json", reasons: "json" } },
  "planning.receipt": { collector: "state.planning.receipt", domain: { origin: "text", scopes: "json", cards: "json", commit: "text" } },
  "request.classification": { judged: true, domain: ["pre-product-research", "design-change", "tree-work", "small-work", "withdraw", "unknown"] },
  "bundle.contract": { judged: true, domain: ["ready", "ask"] },
  "bundle.units": { judged: true, domain: "json" },
  "proposal.decision": { judged: true, domain: ["approve", "revise", "cancel", "ask"] }
};

export const FORMATS = {
  maintenanceRoutingPending: line("maintenance routing pending", { "request-json": "json" })
};
export const TEMPLATES = {
  taskCard: { file: "templates/task-card.md", fields: { address: "line", identity: "block", number: "line", title: "line", destination: "block", why: "block", forbidden: "list", signal: "block", depends: "line", reads: "list", tier: "line", owners: "list", review: "line" }, sections: ["## Progress log"] },
  researchCard: { file: "templates/research-card.md", fields: { origin: "line", address: "line", number: "line", question: "line", destination: "block", signal: "block", depends: "line", reads: "list", owners: "list" }, sections: [] },
  proposal: { file: "templates/execution-proposal.md", fields: { scope: "line", order: "list", parallelism: "list", decision: "line", residual: "block" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block" }, sections: [] }
};

export const ORDERS = {
  stageOrder: ["intake", "materialize", "carry-approval", "propose"],
  sourceOrder: ["project-state-route", "current-request", "new-request"],
  planningOrder: ["begin-commit", "card-write", "approval-write", "planning-commit"]
};

export const OWNERSHIP = {
  ".devflow/tree/**": "direct",
  ".devflow/journal.md": "direct",
  ".devflow/project/**": "external.layer0",
  ".git/**": "external.git"
};

export const GUARDS = [
  { id: "canonical-state-required", reads: ["project.product"], acceptsUnknown: [], when: s => s.project.product === "unknown", then: "BLOCK", body: "guard: canonical-state-required" },
  { id: "uncommitted-layer0", reads: ["project.product"], acceptsUnknown: [], when: s => s.project.product === "uncommitted-layer0", then: "ROUTE:resume", body: "guard: uncommitted-layer0" },
  { id: "approved-project-research", reads: ["origin.projectResearch", "projectResearch.approval"], acceptsUnknown: [], when: s => s.origin.projectResearch !== "NONE" && s.projectResearch.approval === "effective", then: "ROUTE:work", body: "guard: approved-project-research" }
];

export const TABLES = {
  intakeSelector: { exclusive: true, rows: [
    { state: "route-product", reads: ["project.product", "request.classification"], acceptsUnknown: ["request.classification"], when: s => s.project.product === "missing" && s.request.classification === "tree-work" },
    { state: "withdraw-uncommitted", reads: ["request.classification", "request.current", "request.phase", "origin.drafts"], acceptsUnknown: ["request.classification"], when: s => s.request.classification === "withdraw" && s.request.current !== "NONE" && s.request.phase === "uncommitted" && s.origin.drafts === "NONE" },
    { state: "withdraw-committed", reads: ["request.classification", "request.current", "request.phase", "origin.drafts"], acceptsUnknown: ["request.classification"], when: s => s.request.classification === "withdraw" && s.request.current !== "NONE" && s.request.phase !== "uncommitted" && s.origin.drafts === "NONE" },
    { state: "small-no-tree-delta", reads: ["request.classification"], acceptsUnknown: ["request.classification"], when: s => s.request.classification === "small-work" },
    { state: "record-request", reads: ["project.product", "request.classification", "request.current", "origin.active"], acceptsUnknown: ["request.classification"], when: s => s.project.product === "present" && (s.request.classification === "tree-work" || s.request.classification === "design-change") && s.request.current === "NONE" && s.origin.active === "NONE" },
    { state: "route-design", reads: ["request.classification", "request.current", "request.phase"], acceptsUnknown: [], when: s => s.request.classification === "design-change" && s.request.current !== "NONE" && s.request.phase !== "design-confirmed" },
    { state: "ASK:intake-uncertain", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  materializeSelector: { exclusive: true, rows: [
    { state: "continue-active-bundle", reads: ["origin.active", "bundle.contract"], acceptsUnknown: ["bundle.contract"], when: s => s.origin.active !== "NONE" && s.bundle.contract === "ready" },
    { state: "begin-request-bundle", reads: ["request.current", "origin.active", "bundle.contract"], acceptsUnknown: ["bundle.contract"], when: s => s.request.current !== "NONE" && s.origin.active === "NONE" && s.bundle.contract === "ready" },
    { state: "ASK:bundle-uncertain", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  proposalSelector: { exclusive: true, rows: [
    { state: "repair-stale-approval", reads: ["approval.issue"], acceptsUnknown: [], when: s => s.approval.issue !== "NONE" },
    { state: "approve-failure-route", reads: ["origin.drafts", "approval.issue", "proposal.decision", "request.current", "request.phase"], acceptsUnknown: ["proposal.decision"], when: s => s.origin.drafts !== "NONE" && s.approval.issue === "NONE" && s.proposal.decision === "approve" && s.request.current !== "NONE" && s.request.phase === "failure-routed" },
    { state: "approve-plan", reads: ["origin.drafts", "approval.issue", "proposal.decision", "request.phase"], acceptsUnknown: ["proposal.decision"], when: s => s.origin.drafts !== "NONE" && s.approval.issue === "NONE" && s.proposal.decision === "approve" && s.request.phase !== "failure-routed" },
    { state: "revise-plan", reads: ["proposal.decision"], acceptsUnknown: ["proposal.decision"], when: s => s.proposal.decision === "revise" },
    { state: "cancel-plan", reads: ["proposal.decision"], acceptsUnknown: ["proposal.decision"], when: s => s.proposal.decision === "cancel" },
    { state: "ASK:proposal-decision", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "intake", reads: ["planning.receipt", "request.classification", "project.product", "request.current", "request.phase", "origin.active", "origin.drafts", "origin.projectResearch"], acceptsUnknown: ["request.classification"], done: s => s.planning.receipt !== "NONE" || (s.request.classification === "withdraw" && s.origin.drafts !== "NONE") || (s.request.classification === "tree-work" && s.project.product === "present" && (s.request.current !== "NONE" || s.origin.active !== "NONE")) || (s.request.classification === "design-change" && s.project.product === "present" && s.request.current !== "NONE" && s.request.phase === "design-confirmed") || (s.request.classification === "pre-product-research" && (s.request.current !== "NONE" || s.origin.active !== "NONE" || s.origin.projectResearch !== "NONE")), needs: ["request.classification"], table: "intakeSelector", reentry: "rejudge", branches: {
    "route-product": ["ROUTE:product"],
    "withdraw-uncommitted": [["WRITE", { artifact: "cancelMarkerCleanup", target: "current-request-line", value: "remove" }], ["REPORT", { template: "result" }], "DONE"],
    "withdraw-committed": [["WRITE", { artifact: "cancelMarkerCleanup", target: "current-request-line", value: "remove" }], ["COMMIT", { authority: "external.principles", scope: "current-request-withdrawal", branch: "integration", files: "request line removal only" }], ["REPORT", { template: "result" }], "DONE"],
    "small-no-tree-delta": [["REPORT", { template: "result" }], "DONE"],
    "record-request": [["WRITE", { artifact: "requestRecord", target: ".devflow/journal.md", format: "maintenanceRoutingPending", "request-json": "<the whole user request as one JSON string>" }], "NEXT"],
    "route-design": ["ROUTE:design"],
    "ASK:intake-uncertain": ["ASK"]
  }, body: "stage: intake" },
  { id: "materialize", reads: ["planning.receipt", "origin.drafts"], acceptsUnknown: [], done: s => s.planning.receipt !== "NONE" || s.origin.drafts !== "NONE", needs: ["bundle.contract", "bundle.units"], table: "materializeSelector", reentry: "rejudge", branches: {
    "continue-active-bundle": [["RUN", { action: "for every task or research card, put only destination-matched exact K paths in Read first; for each T-low implementation card, additionally put the minimal bounded concrete provider or consumer code/test paths its consumer needs there. Never copy automatic Layer 0, number-owned current capability, or Binding ADR inputs into a card; put any essential ordering or dataflow constraint in Destination or Forbidden and any task-specific fixture in both Destination and Completion signal; for greenfield or independent work use exactly the literal Read first: none and Forbidden: T-low basis: N/A — greenfield|independent" }], ["WRITE", { artifact: "cardBundle", target: "<exact-active-scopes>/<one-or-more-sibling-card-addresses>", units: "bundle.units", templates: "00-project=researchCard; all-other-scopes=taskCard", forbiddenTemplates: "taskCard@00-project" }], "NEXT"],
    "begin-request-bundle": [["WRITE", { artifact: "layerOpeningBundle", target: ".devflow/journal.md", source: "request.current.source", scopes: "bundle.units" }], ["COMMIT", { scope: "layer-opening-bundle", message: "direct — begin <parent>" }], ["RUN", { action: "for every task or research card, put only destination-matched exact K paths in Read first; for each T-low implementation card, additionally put the minimal bounded concrete provider or consumer code/test paths its consumer needs there. Never copy automatic Layer 0, number-owned current capability, or Binding ADR inputs into a card; put any essential ordering or dataflow constraint in Destination or Forbidden and any task-specific fixture in both Destination and Completion signal; for greenfield or independent work use exactly the literal Read first: none and Forbidden: T-low basis: N/A — greenfield|independent" }], ["WRITE", { artifact: "cardBundle", target: "<exact-active-scopes>/<one-or-more-sibling-card-addresses>", units: "bundle.units", templates: "00-project=researchCard; all-other-scopes=taskCard", forbiddenTemplates: "taskCard@00-project" }], "NEXT"],
    "ASK:bundle-uncertain": ["ASK"]
  }, body: "stage: materialize" },
  { id: "carry-approval", reads: ["planning.receipt", "approval.boundary", "origin.drafts", "request.classification"], acceptsUnknown: ["request.classification"], done: s => s.planning.receipt !== "NONE" || s.approval.boundary === "NONE" || s.origin.drafts === "NONE" || s.request.classification === "withdraw", effects: [["WRITE", { artifact: "approvalBundle", target: "origin.drafts.cards", source: "approval.boundary.values" }], ["COMMIT", { scope: "current-origin-planning-pass", consumes: "settled-layer-opening-markers" }], ["REPORT", { template: "proposal", scope: "approved-work-handoff" }], "WAIT"], reentry: "rejudge", body: "stage: carry-approval" },
  { id: "propose", reads: ["planning.receipt"], acceptsUnknown: [], done: s => s.planning.receipt !== "NONE", needs: ["proposal.decision"], table: "proposalSelector", reentry: "rejudge", branches: {
    "repair-stale-approval": [["WRITE", { artifact: "approvalRepair", target: "approval.issue.cards", value: "pending" }], "ASK"],
    "approve-failure-route": [["WRITE", { artifact: "failureRoute", target: "request.current.source", state: "routing prepared", contract: "external.principles Routing write order", operations: "whole current-origin planning pass except the tracked Failure-history result" }], ["RUN", { action: "validate the prepared route and apply its remaining operations exactly once while leaving the prepared object intact" }], ["COMMIT", { authority: "external.principles", transition: "prepared-route-completion", scope: "current-origin-planning-pass", consumes: "settled-layer-opening-markers-and-failure-route", action: "replace the prepared object with its declared result and land the whole pass" }], ["REPORT", { template: "proposal", scope: "approved-work-handoff" }], "WAIT"],
    "approve-plan": [["WRITE", { artifact: "approvalBundle", target: "origin.drafts.cards", value: "principles-fresh-approval" }], ["COMMIT", { scope: "current-origin-planning-pass", consumes: "settled-layer-opening-markers-and-request" }], ["REPORT", { template: "proposal", scope: "approved-work-handoff" }], "WAIT"],
    "revise-plan": ["ASK"],
    "cancel-plan": [["WRITE", { artifact: "cancelDraftCleanup", target: "current-origin-drafts", value: "remove" }], ["WRITE", { artifact: "cancelMarkerCleanup", target: "current-origin-request-line-and-layer-opening-markers", value: "remove" }], ["COMMIT", { scope: "current-origin-cancellation" }], "WAIT"],
    "ASK:proposal-decision": [["REPORT", { template: "proposal", scope: "approval-request" }], "ASK"]
  }, body: "stage: propose" }
];

export const ARTIFACTS = {
  product: { path: ".devflow/project/product.md", writer: "external.product", readers: ["stage.intake"] },
  arch: { path: ".devflow/project/arch.md", writer: "external.arch", readers: ["stage.intake"] },
  design: { path: ".devflow/project/design.md", writer: "external.design", readers: ["stage.intake"] },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.intake", "stage.materialize", "stage.carry-approval", "stage.propose"] },
  requestRecord: { path: ".devflow/journal.md", writer: "direct", readers: ["stage.intake", "stage.materialize"] },
  layerOpeningBundle: { path: ".devflow/journal.md", writer: "direct", readers: ["stage.materialize"] },
  cardBundle: { path: ".devflow/tree/<exact-active-scopes>/<one-or-more-sibling-card-addresses>.md", writer: "direct", readers: ["stage.materialize"] },
  approvalBundle: { path: ".devflow/tree/<current-origin-card-paths>.md", writer: "direct", readers: ["stage.carry-approval", "stage.propose"] },
  failureRoute: { path: ".devflow/tree/**/verify.md#Failure history", writer: "direct", readers: ["stage.propose"] },
  approvalRepair: { path: ".devflow/tree/<approval-invalid-current-origin-card-paths>.md", writer: "direct", readers: ["stage.propose"] },
  cancelDraftCleanup: { path: ".devflow/tree/<current-origin-drafts>", writer: "direct", readers: ["stage.propose"] },
  cancelMarkerCleanup: { path: ".devflow/journal.md", writer: "direct", readers: ["stage.intake", "stage.propose"] }
};

export const ROLES = {};
export const READ_FIRST = [{ body: "why: purpose", path: "references/purpose.md" }];
export const DECLARATIONS = {
  profile: { value: "p2", consumer: "build:profile" },
  canonicalStateBoundary: { value: "direct selects no filename; principles project-state supplies the committed Product boundary, exact current journal origin, active layer-opening scopes, approval freshness, and card origin siblings", consumer: "direct" },
  siblingUnitBoundary: { value: "one request may create several independently executable sibling cards; each unit is one card and may list several affected knowledge owners, but is never mirrored once per owner", consumer: "stage.materialize" },
  projectResearchBoundary: { value: "00-project is one many-branch research root; each numeric research card carries the exact Origin field, remains pending until the ordinary proposal boundary, and routes to work only after project-state reports effective approval", consumer: "guard.approved-project-research" },
  residualSeam: { value: "principles-owned layer-opening markers are the only direct-time remaining-scope representation; direct records affected owners but never creates knowledge-landing markers, which later confirmed work or research synthesis owns", consumer: "stage.carry-approval" },
  directWritesNoK: { value: "direct writes task-tree structure and planning records only; it never writes current K knowledge", consumer: "direct" },
  smallWorkBoundary: { value: "when no durable task or research unit is needed, direct emits zero tree delta", consumer: "stage.intake" }
};
export const DEFERRED = [];
