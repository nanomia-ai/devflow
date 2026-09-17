import { line, progressLine } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "principles", profile: "single", imports: [] };

// Principles observes conversation judgments only. Project state, journal, cards,
// dependencies, sibling cards, and canonical route priority belong to calculateState and
// resume; duplicating any of them here would create a second state kernel.
export const OBSERVATIONS = {
  "authoring.readiness": { judged: true, domain: ["ready", "not-ready"] },
  "request.partition": { judged: true, domain: ["pure-tweak", "stateful", "project-read-only", "policy-read-only", "mixed", "uncertain"] },
  "tweak.gate": { judged: true, domain: ["all-no", "not-all-no", "uncertain", "not-applicable"] },
  "tweak.preflight": { decided: true, domain: ["pass", "fail", "uncertain", "not-run"] },
  "tweak.check": { decided: true, domain: ["pass", "fail", "uncertain", "not-run"] }
};

export const FORMATS = {
  maintenanceRoutingPending: line("maintenance routing pending", { "request-json": "json" }),
  productReRunPending: line("product re-run pending", { "statement-json": "json" }),
  productVerificationRequested: line("product verification requested", {}),
  productVerificationRunning: line("product verification running", { trigger: ["requested", "automatic"], product: "hex40", verification: "hex40", code: "hex40" }),
  productVerificationResult: line("product verification result", { trigger: ["requested", "automatic"], product: "hex40", verification: "hex40", code: "hex40", verdict: ["pass", "fail", "unverified"] }),
  capabilityClosing: line("capability closing", { folder: "path", head: "hex40", product: "hex40", verification: "hex40", capability: "hex40" }),
  capabilityNote: line("capability note", { capability: "integer", "note-json": "json" }),
  knowledgeLandingPending: line("knowledge landing pending", { owner: "path", writer: ["arch", "adopt"], "source-json": "json" }),
  compatibleFeedbackPending: line("compatible feedback pending", { "payload-json": "json" }),
  completionSignalResult: progressLine("completion signal result", { head: "hex40", verdict: ["pass", "fail", "unverified"], "detail-json": "json" }),
  reviewResult: progressLine("review result", { head: "hex40", verdict: ["pass", "objections", "unverified"], "detail-json": "json" })
};

export const TEMPLATES = {
  result: { file: "templates/action-result.md", fields: { summary: "block" }, sections: [] },
  roleResult: { file: "templates/role-result.md", fields: { verdict: "line", evidence: "block", uncertainty: "block" }, sections: [] }
  ,canonicalJournalProgressGrammar: { file: "templates/canonical-journal-progress-grammar.md", fields: {}, sections: [] }
};

export const ORDERS = {
  requestPartition: ["pure-tweak", "stateful", "project-read-only", "policy-read-only", "mixed", "uncertain"],
  tweakEffects: ["bounded-preflight", "layer0-and-conditional-glossary-read", "target-edit", "cheapest-sufficient-check", "exact-diff-check", "one-tweak-commit"]
};

export const OWNERSHIP = {
  ".devflow/project/product.md": "project.product",
  ".devflow/project/arch.md": "project.arch",
  ".devflow/project/design.md": "project.design",
  ".devflow/project/code-style.md": "project.arch",
  ".devflow/project/glossary.md": "project.product",
  ".devflow/project/capabilities/**": "project.arch-or-adopt",
  ".devflow/tree/**": "project.direct-or-work",
  ".devflow/journal.md": "project.stage-owner",
  ".git/**": "external.git"
};

export const GUARDS = [
  { id: "authoring-not-ready", reads: ["authoring.readiness"], acceptsUnknown: [], when: s => s.authoring.readiness === "not-ready", then: "BLOCK", body: "guard: authoring-not-ready" }
];

export const TABLES = {
  entryPartition: {
    exclusive: true,
    rows: [
      { state: "tweak", reads: ["request.partition", "tweak.gate", "tweak.preflight", "tweak.check"], acceptsUnknown: [], when: s => s.request.partition === "pure-tweak" && s.tweak.gate === "all-no" && s.tweak.preflight === "pass" && s.tweak.check === "pass" },
      { state: "policy-read-only", reads: ["request.partition"], acceptsUnknown: [], when: s => s.request.partition === "policy-read-only" },
      { state: "normal-stateful", reads: ["request.partition"], acceptsUnknown: [], when: s => s.request.partition === "stateful" },
      { state: "normal-project-read-only", reads: ["request.partition"], acceptsUnknown: [], when: s => s.request.partition === "project-read-only" },
      { state: "normal-mixed", reads: ["request.partition"], acceptsUnknown: [], when: s => s.request.partition === "mixed" },
      { state: "normal-gate", reads: ["request.partition", "tweak.gate"], acceptsUnknown: [], when: s => s.request.partition === "pure-tweak" && (s.tweak.gate === "not-all-no" || s.tweak.gate === "uncertain" || s.tweak.gate === "not-applicable") },
      { state: "normal-preflight", reads: ["request.partition", "tweak.gate", "tweak.preflight"], acceptsUnknown: [], when: s => s.request.partition === "pure-tweak" && s.tweak.gate === "all-no" && (s.tweak.preflight === "fail" || s.tweak.preflight === "uncertain" || s.tweak.preflight === "not-run") },
      { state: "normal-check", reads: ["request.partition", "tweak.gate", "tweak.preflight", "tweak.check"], acceptsUnknown: [], when: s => s.request.partition === "pure-tweak" && s.tweak.gate === "all-no" && s.tweak.preflight === "pass" && (s.tweak.check === "fail" || s.tweak.check === "uncertain" || s.tweak.check === "not-run") },
      { state: "normal-default", reads: [], acceptsUnknown: [], when: () => true }
    ]
  }
};

export const STAGES = [{
  id: "classify",
  reads: ["request.partition"], acceptsUnknown: [],
  done: s => s.request.partition !== s.request.partition,
  table: "entryPartition",
  branches: {
    tweak: [
      ["RUN", { action: "bounded-git-prepared-route-target-path-preflight" }],
      ["READ", { scope: "product-arch-design-code-style-and-conditional-glossary" }],
      ["RUN", { action: "apply-only-accepted-tweak-items" }],
      ["RUN", { action: "cheapest-sufficient-check" }],
      ["RUN", { action: "exact-target-diff-check" }],
      ["COMMIT", { count: 1, subject: "tweak" }],
      "DONE"
    ],
    "policy-read-only": [["REPORT", { template: "result" }], "DONE"],
    "normal-stateful": ["ROUTE:resume"],
    "normal-project-read-only": ["ROUTE:resume"],
    "normal-mixed": ["ROUTE:resume"],
    "normal-gate": ["ROUTE:resume"],
    "normal-preflight": ["ROUTE:resume"],
    "normal-check": ["ROUTE:resume"],
    "normal-default": ["ROUTE:resume"]
  },
  reentry: "rejudge",
  body: "stage: classify"
}];

export const ARTIFACTS = {};

export const ROLES = {
  coordinator: { body: "role: coordinator", effects: [], returns: null }
};

export const READ_FIRST = [
  { body: "why: purpose", path: "references/purpose.md" },
  { body: "why: entry-topology", path: "references/enter-resume-contract.md" },
  { body: "why: policy-index", path: "references/policy-index.md" }
  ,{ body: "why: exact-journal-progress-grammar", path: "templates/canonical-journal-progress-grammar.md" }
];

export const DECLARATIONS = {
  profile: { value: "p2", consumer: "build:profile" },
  entry_contract: { value: "principles-entry-classifier/3; explicit stage invocations are their own entry and bypass Principles preflight", consumer: "principles|explicit stages" },
  state_api: { value: "calculateState -> devflow/project-state/2; CLI text is compatibility only", consumer: "resume|stages" },
  stateful_route: { value: "Every stateful, status, or project-read-only request that enters Principles routes exactly once to resume; explicit stage invocations use that stage's guards.", consumer: "resume|explicit stages" },
  tweak_lane: { value: "Conversation all-no gate, bounded preflight, one edit/check/diff sequence, exactly one tweak commit; card=0, K=0, journal=0.", consumer: "all devflow entries" },
  mixed_items: { value: "Route only failing items through normal flow, retain accepted interruption scope, then re-enter remaining tweak items without loss or a route loop.", consumer: "resume|direct" },
  role_bypass: { value: "Role-contract invocation bypasses request classification and project-state collection.", consumer: "roles" },
  knowledge_landing: { value: "A confirmed owner batch preserves changed existing K loci through approval, validation, and commit. Product writes product/K, Design writes design/K, Arch writes arch/K and managed capability/K; Arch consumes exact marker-delegated owner/K batches for arch|adopt provenance, while Work produces arch markers only; no residual object, route, token, or batch is added.", consumer: "product|design|arch|adopt|work" },
  research_entry: { value: "Ordinary 00-project cards are research-only when their canonical heading is '# NN.N Research: ...'; active or pending research outranks setup.no-product.", consumer: "project-state|resume|direct|work" },
  closed_history: { value: "Legacy closed-history descent remains exact and no automatic migration is added.", consumer: "work|verify|resume" },
  package_portability: { value: "Every runtime and policy reference resolves inside the copied package.", consumer: "build|runtime" }
  ,canonical_format_ownership: { value: "Journal grammar owns the grammar of reserved journal records. Their native FORMATs, canonicalJournalProgressGrammar rows, and package fixtures are exact projections; project-state is their deterministic consumer.", consumer: "principles|project-state|stages" }
  ,compatible_feedback_set: { value: "The first atomic compatible-feedback introduction for one source card seals its complete exact-payload set in Git history. Later same-card introductions cannot enlarge or reopen it, while current and consumed members remain the exact replay lifecycle until every semantic owner lands once and Verify becomes the next consumer.", consumer: "project-state|work|resume|verify" }
};

export const DEFERRED = [];
