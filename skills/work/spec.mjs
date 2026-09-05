import { line, progressLine } from "./scripts/skill-rails/dsl.mjs";

export const SPEC = { version: "5", id: "work", profile: "single", imports: [] };

export const OBSERVATIONS = {
  "card.target": { collector: "work/card.target", domain: "path" },
  "state.kernel": { collector: "work/state.kernel", domain: ["available", "unavailable"] },
  "state.route": { collector: "work/state.route", domain: ["claim.mine", "ready.ready", "transition.remote-evidence", "transition.finish-boundary", "marker.knowledge-landing", "marker.compatible-feedback", "other", "unavailable"] },
  "card.phase": { collector: "work/card.phase", domain: ["ready", "claimed", "done", "invalid"] },
  "card.contract": { collector: "work/card.contract", domain: ["valid", "invalid"] },
  "card.basis": { collector: "work/card.basis", domain: ["complete", "missing", "invalid"] },
  "completion.state": { collector: "work/completion.state", domain: ["absent", "pass", "fail", "unverified", "stale", "invalid"] },
  "review.state": { collector: "work/review.state", domain: ["waived", "not-applicable", "absent", "pass", "objections", "unverified", "invalid"] },
  "carry.state": { collector: "work/carry.state", domain: ["absent", "present", "invalid"] },
  "remote.state": { collector: "work/remote.state", domain: ["none", "waiting", "pending", "pass", "fail", "unverified", "finalizing", "invalid"] },
  "research.checkpoint": { collector: "work/research.checkpoint", domain: ["not-applicable", "uncommitted", "committed", "invalid"] },
  "knowledge.marker": { collector: "work/knowledge.marker", domain: ["none", "current-source", "other-source", "invalid"] },
  "feedback.marker": { collector: "work/feedback.marker", domain: ["none", "current-source", "other-source", "invalid"] },
  "feedback.lifecycles": { collector: "work/feedback.lifecycles", domain: "json" },
  "task.commit": { collector: "work/task.commit", domain: ["absent", "present", "invalid"] },
  "task.integration": { collector: "work/task.integration", domain: ["pending", "integrated", "blocked", "invalid"] },
  "handoff.state": { collector: "work/handoff.state", domain: ["stale", "current", "invalid"] },
  "boundary.state": { collector: "work/boundary.state", domain: ["pending", "missing", "ready", "complete", "invalid"] },
  "implementation.action": { judged: true, domain: ["continue", "signal-ready", "repair", "scope-escape", "park", "handoff"] },
  "review.action": { judged: true, domain: ["dispatch", "repair", "contract-route", "ask-disposition", "apply-disposition", "block-nonpass"] },
  "feedback.action": { judged: true, domain: ["none", "compatible", "staling", "design-note"] },
  "feedback.pendingSet": { judged: true, domain: { bytes: "text", count: "integer", source: "text", sourceCard: "path", sourceCount: "integer", uniqueCount: "integer" } },
  "feedback.eligibleSet": { judged: true, domain: { bytes: "text", count: "integer", source: "text", sourceCard: "path", sourceCount: "integer", uniqueCount: "integer" } },
  "feedback.lifecycleAction": { judged: true, domain: ["produce", "settled", "invalid"] },
  "feedback.pendingSetStatus": { judged: true, domain: ["complete", "invalid"] },
  "history.basis": { judged: true, domain: ["none", "named-card", "nonpass-repair", "current-k-source", "current-trap-source", "broad", "invalid"] },
  "knowledge.action": { judged: true, domain: ["none", "emit-arch", "route-direct"] }
};

export const FORMATS = {};

export const TEMPLATES = {
  handoff: { file: "templates/handoff.md", fields: { timestamp: "line", nextStep: "line" }, sections: ["## Next single step"] },
  progressSnippet: { file: "templates/progress.md", fields: { entry: "line" }, sections: [] },
  completionSignalResult: { file: "templates/completion-signal-result.md", fields: { timestamp: "line", head: "line", verdict: "line", detailJson: "line" }, sections: [] },
  reviewResult: { file: "templates/review-result-line.md", fields: { timestamp: "line", head: "line", verdict: "line", detailJson: "line" }, sections: [] },
  remoteEvidenceCheck: { file: "templates/remote-evidence-check.md", fields: { timestamp: "line", checkJson: "line", verdict: "line", detailJson: "line" }, sections: [] },
  knowledgeLandingPending: { file: "templates/knowledge-landing-pending.md", fields: { timestamp: "line", owner: "line", writer: "line", sourceJson: "line" }, sections: [] },
  carry: { file: "templates/carry.md", fields: { timestamp: "line", fact: "line" }, sections: [] },
  reviewerResult: { file: "templates/reviewer-result.md", fields: { verdict: "line", objections: "block", evidence: "block", speculative: "line" }, sections: [] },
  result: { file: "templates/result.md", fields: { summary: "block" }, sections: [] }
};

export const ORDERS = {
  workLoop: ["claim", "bounded-read", "progress", "implementation", "completion-signal", "independent-review", "upper-feedback", "carry", "task-commit", "integration", "owner-feedback", "done-rename", "handoff", "boundary", "resume"],
  reviewRepair: ["anchor-nonpass", "repair-or-disposition", "completion-signal", "independent-review"],
  remoteEvidence: ["review", "evidence-wait-checkpoint", "evidence-record", "push", "current-check", "final-task-commit-or-repair", "boundary"],
  knowledgeLanding: ["durable-conclusion", "committed-checkpoint", "one-owner-marker", "arch-landing", "source-marker-clear", "closure"],
  closedHistory: ["exact-basis", "exact-target", "bounded-read"]
};

export const OWNERSHIP = {
  ".devflow/tree/**.md": "work",
  ".devflow/users/<id>/HANDOFF.md": "work",
  ".devflow/journal.md#knowledge-landing-pending": "work",
  ".devflow/journal.md#compatible-feedback-pending": "work",
  ".devflow/journal.md#remote-evidence-finalizing": "work",
  ".devflow/project/<semantic-owner>.md#compatible-upper-feedback": "semantic owner",
  "task card and progress lifecycle": "work",
  "task card contract": "direct",
  "Git and devflow route facts": "principles.calculateState",
  "clean review judgment": "reviewer",
  "knowledge marker producer": "work",
  "marker-delegated knowledge writer": "arch",
  "upper-document feedback": "semantic owner"
};

function lateBoundarySettled(s) {
  return s.boundary.state === "missing"
    && s.task.commit === "present"
    && s.task.integration === "integrated"
    && s.handoff.state === "current"
    && s.completion.state === "pass"
    && ["pass", "waived", "not-applicable"].includes(s.review.state);
}

function knowledgeSourceCommitted(s) {
  return s.research.checkpoint === "committed"
    || (s.research.checkpoint === "not-applicable" && lateBoundarySettled(s));
}

function compatibleFeedbackSetInvalid(s) {
  return s.feedback.action === "compatible"
    && (s.feedback.lifecycles === "invalid"
      || s.feedback.pendingSetStatus !== "complete"
      || (s.feedback.lifecycles.length !== 0
        ? ![0].includes(s.feedback.eligibleSet.count) || s.feedback.lifecycleAction !== "settled"
        : [0].includes(s.feedback.pendingSet.count)
          || ![s.card.target].includes(s.feedback.pendingSet.sourceCard)
          || ![1].includes(s.feedback.pendingSet.sourceCount)
          || s.feedback.pendingSet.uniqueCount !== s.feedback.pendingSet.count
          || s.feedback.pendingSet.bytes !== s.feedback.eligibleSet.bytes
          || s.feedback.pendingSet.count !== s.feedback.eligibleSet.count
          || s.feedback.pendingSet.source !== s.feedback.eligibleSet.source
          || s.feedback.pendingSet.sourceCard !== s.feedback.eligibleSet.sourceCard
          || s.feedback.lifecycleAction !== "produce"));
}

export const GUARDS = [
  { id: "card-target-required", reads: ["card.target"], acceptsUnknown: [], when: s => !s.card.target, then: "BLOCK", body: "guard: card-target-required" },
  { id: "state-kernel-unavailable", reads: ["state.kernel"], acceptsUnknown: [], when: s => s.state.kernel === "unavailable", then: "BLOCK", body: "guard: state-kernel-unavailable" },
  { id: "compatible-feedback-set-required", reads: ["card.target", "feedback.action", "feedback.pendingSetStatus", "feedback.lifecycleAction", "feedback.lifecycles", "feedback.pendingSet", "feedback.eligibleSet"], acceptsUnknown: ["feedback.action", "feedback.pendingSetStatus", "feedback.lifecycleAction", "feedback.pendingSet", "feedback.eligibleSet"], when: s => compatibleFeedbackSetInvalid(s), then: "BLOCK", body: "guard: compatible-feedback-set-required" },
  { id: "compatible-feedback-before-closure", reads: ["feedback.marker"], acceptsUnknown: [], when: s => s.feedback.marker === "current-source", then: "ROUTE:resume", body: "guard: compatible-feedback-before-closure" },
  { id: "premature-knowledge-marker", reads: ["state.route", "knowledge.marker", "research.checkpoint", "boundary.state", "task.commit", "task.integration", "handoff.state", "completion.state", "review.state"], acceptsUnknown: [], when: s => s.state.route === "marker.knowledge-landing" && s.knowledge.marker === "current-source" && !knowledgeSourceCommitted(s), then: "BLOCK", body: "guard: premature-knowledge-marker" },
  { id: "knowledge-landing-before-closure", reads: ["state.route", "knowledge.marker", "research.checkpoint", "boundary.state", "task.commit", "task.integration", "handoff.state", "completion.state", "review.state"], acceptsUnknown: [], when: s => s.state.route === "marker.knowledge-landing" && s.knowledge.marker === "current-source" && knowledgeSourceCommitted(s), then: "ROUTE:resume", body: "guard: knowledge-landing-before-closure" },
  { id: "invalid-card", reads: ["card.phase", "card.contract"], acceptsUnknown: [], when: s => s.card.phase === "invalid" || s.card.contract === "invalid", then: "ROUTE:direct", body: "guard: invalid-card" },
  { id: "missing-bounded-basis", reads: ["card.basis"], acceptsUnknown: [], when: s => s.card.basis === "missing" || s.card.basis === "invalid", then: "BLOCK", body: "guard: missing-bounded-basis" },
  { id: "closed-history-refusal", reads: ["history.basis"], acceptsUnknown: [], when: s => s.history.basis === "broad" || s.history.basis === "invalid", then: "BLOCK", body: "guard: closed-history-refusal" },
  { id: "invalid-progress-evidence", reads: ["completion.state", "review.state", "carry.state", "remote.state"], acceptsUnknown: [], when: s => s.completion.state === "invalid" || s.review.state === "invalid" || s.carry.state === "invalid" || s.remote.state === "invalid", then: "BLOCK", body: "guard: invalid-progress-evidence" },
  { id: "post-title-task-diff-closed", reads: ["boundary.state", "handoff.state", "task.integration", "task.commit", "completion.state", "review.state"], acceptsUnknown: [], when: s => s.task.commit === "present" && s.boundary.state === "missing" && s.task.integration === "integrated" && s.handoff.state === "current" && !(s.completion.state === "pass" && ["pass", "waived", "not-applicable"].includes(s.review.state)), then: "RESTRICT", forbids: ["COMMIT"], body: "guard: post-title-task-diff-closed" },
  { id: "non-work-route", reads: ["state.route", "card.phase", "boundary.state"], acceptsUnknown: [], when: s => s.state.route === "other" && s.card.phase !== "done" && s.boundary.state !== "complete", then: "ROUTE:resume", body: "guard: non-work-route" }
];

export const TABLES = {
  remote: { exclusive: true, rows: [
    { state: "waiting", reads: ["remote.state"], acceptsUnknown: [], when: s => s.remote.state === "waiting" },
    { state: "pending", reads: ["remote.state"], acceptsUnknown: [], when: s => s.remote.state === "pending" },
    { state: "fail", reads: ["remote.state"], acceptsUnknown: [], when: s => s.remote.state === "fail" },
    { state: "unverified", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  implementation: { exclusive: true, rows: [
    { state: "scope-escape", reads: ["implementation.action"], acceptsUnknown: [], when: s => s.implementation.action === "scope-escape" },
    { state: "park", reads: ["implementation.action"], acceptsUnknown: [], when: s => s.implementation.action === "park" },
    { state: "handoff", reads: ["implementation.action"], acceptsUnknown: [], when: s => s.implementation.action === "handoff" },
    { state: "repair", reads: ["implementation.action"], acceptsUnknown: [], when: s => s.implementation.action === "repair" },
    { state: "signal-ready", reads: ["implementation.action"], acceptsUnknown: [], when: s => s.implementation.action === "signal-ready" },
    { state: "continue", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  review: { exclusive: true, rows: [
    { state: "contract-route", reads: ["review.action"], acceptsUnknown: [], when: s => s.review.action === "contract-route" },
    { state: "ask-disposition", reads: ["review.action"], acceptsUnknown: [], when: s => s.review.action === "ask-disposition" },
    { state: "apply-disposition", reads: ["review.action"], acceptsUnknown: [], when: s => s.review.action === "apply-disposition" },
    { state: "block-nonpass", reads: ["review.action"], acceptsUnknown: [], when: s => s.review.action === "block-nonpass" },
    { state: "repair", reads: ["review.action"], acceptsUnknown: [], when: s => s.review.action === "repair" },
    { state: "dispatch", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  knowledge: { exclusive: true, rows: [
    { state: "emit-arch", reads: ["knowledge.action"], acceptsUnknown: [], when: s => s.knowledge.action === "emit-arch" },
    { state: "route-direct", reads: ["knowledge.action"], acceptsUnknown: [], when: s => s.knowledge.action === "route-direct" },
    { state: "none", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  finalize: { exclusive: true, rows: [
    { state: "staling", reads: ["feedback.action"], acceptsUnknown: [], when: s => s.feedback.action === "staling" },
    { state: "design-note", reads: ["feedback.action"], acceptsUnknown: [], when: s => s.feedback.action === "design-note" },
    { state: "remote-compatible-carry", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state === "pass" && s.feedback.action === "compatible" && s.carry.state === "absent" },
    { state: "remote-compatible", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state === "pass" && s.feedback.action === "compatible" && s.carry.state === "present" },
    { state: "remote-carry", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state === "pass" && s.feedback.action === "none" && s.carry.state === "absent" },
    { state: "remote", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state === "pass" && s.feedback.action === "none" && s.carry.state === "present" },
    { state: "compatible-carry", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state !== "pass" && s.feedback.action === "compatible" && s.carry.state === "absent" },
    { state: "compatible", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state !== "pass" && s.feedback.action === "compatible" && s.carry.state === "present" },
    { state: "carry", reads: ["remote.state", "feedback.action", "carry.state"], acceptsUnknown: [], when: s => s.remote.state !== "pass" && s.feedback.action === "none" && s.carry.state === "absent" },
    { state: "plain", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  integration: { exclusive: true, rows: [
    { state: "blocked", reads: ["task.integration"], acceptsUnknown: [], when: s => s.task.integration === "blocked" },
    { state: "pending", reads: [], acceptsUnknown: [], when: () => true }
  ] },
  boundary: { exclusive: true, rows: [
    { state: "compatible", reads: ["boundary.state", "completion.state", "review.state", "feedback.action", "feedback.lifecycleAction", "task.commit", "task.integration", "handoff.state"], acceptsUnknown: [], when: s => (s.boundary.state === "ready" || lateBoundarySettled(s)) && s.feedback.action === "compatible" && s.feedback.lifecycleAction === "produce" },
    { state: "compatible-settled-carry", reads: ["boundary.state", "completion.state", "review.state", "carry.state", "feedback.action", "feedback.lifecycleAction", "task.commit", "task.integration", "handoff.state"], acceptsUnknown: [], when: s => (s.boundary.state === "ready" || lateBoundarySettled(s)) && s.feedback.action === "compatible" && s.feedback.lifecycleAction === "settled" && s.carry.state === "absent" },
    { state: "compatible-settled", reads: ["boundary.state", "completion.state", "review.state", "carry.state", "feedback.action", "feedback.lifecycleAction", "task.commit", "task.integration", "handoff.state"], acceptsUnknown: [], when: s => (s.boundary.state === "ready" || lateBoundarySettled(s)) && s.feedback.action === "compatible" && s.feedback.lifecycleAction === "settled" && s.carry.state === "present" },
    { state: "plain", reads: ["boundary.state", "feedback.action"], acceptsUnknown: [], when: s => s.boundary.state === "ready" && s.feedback.action === "none" },
    { state: "late-carry", reads: ["boundary.state", "completion.state", "review.state", "carry.state", "feedback.action", "task.commit", "task.integration", "handoff.state"], acceptsUnknown: [], when: s => lateBoundarySettled(s) && s.feedback.action === "none" && s.carry.state === "absent" },
    { state: "late-anchor", reads: ["boundary.state", "completion.state", "review.state", "carry.state", "feedback.action", "task.commit", "task.integration", "handoff.state"], acceptsUnknown: [], when: s => lateBoundarySettled(s) && s.feedback.action === "none" && s.carry.state === "present" },
    { state: "pending", reads: [], acceptsUnknown: [], when: () => true }
  ] }
};

export const STAGES = [
  { id: "claim-or-reenter", reads: ["card.phase"], acceptsUnknown: [], done: s => s.card.phase === "claimed" || s.card.phase === "done", effects: [["READ", { artifact: "activeCard" }], ["REPORT", { scope: "card-contract-preflight" }], ["COMMIT", { scope: "claim", subject: "<id> <NN.N> claim" }], "NEXT"], reentry: "rejudge", body: "stage: claim-or-reenter" },
  { id: "remote-evidence", reads: ["remote.state"], acceptsUnknown: [], done: s => s.remote.state === "none" || s.remote.state === "pass" || s.remote.state === "finalizing", table: "remote", reentry: "rejudge", branches: {
    waiting: [["RUN", { scope: "check-json" }], ["WRITE", { artifact: "activeCard", template: "remoteEvidenceCheck" }], "WAIT"],
    pending: [["REPORT", { scope: "remote-evidence-pending" }], "WAIT"],
    fail: [["WRITE", { artifact: "activeCard", template: "remoteEvidenceCheck" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: remote evidence failed" }], "NEXT"],
    unverified: [["REPORT", { scope: "remote-evidence-unverified" }], "WAIT"]
  }, body: "stage: remote-evidence" },
  { id: "implement-and-signal", reads: ["completion.state", "remote.state"], needs: ["implementation.action", "history.basis"], acceptsUnknown: [], done: s => s.completion.state === "pass" || s.remote.state === "pass" || s.remote.state === "finalizing", table: "implementation", reentry: "rejudge", branches: {
    "scope-escape": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: blocking reason" }], "ROUTE:direct"],
    park: [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: stopping" }], ["WRITE", { artifact: "activeCard", scope: "release-claim" }], ["COMMIT", { authority: "external.principles", scope: "binding-release", branch: "integration", files: "release rename only", subject: "<id> <NN.N> release" }], "ROUTE:work"],
    handoff: [["REPORT", { scope: "mid-task-handoff-refused" }], "WAIT"],
    repair: [["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: nonpass anchor" }], ["READ", { scope: "declared inputs and exact authorized closed-history target only" }], ["WRITE", { artifact: "activeCard", scope: "card destination repair" }], ["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["RUN", { scope: "completion-signal" }], ["WRITE", { artifact: "activeCard", template: "completionSignalResult" }], "WAIT"],
    "signal-ready": [["READ", { scope: "declared inputs and exact authorized closed-history target only" }], ["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["RUN", { scope: "completion-signal" }], ["WRITE", { artifact: "activeCard", template: "completionSignalResult" }], "WAIT"],
    continue: [["READ", { scope: "declared inputs and exact authorized closed-history target only" }], ["WRITE", { artifact: "activeCard", scope: "card destination" }], ["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["REPORT", { scope: "next-implementation-point" }], "NEXT"]
  }, body: "stage: implement-and-signal" },
  { id: "review-reduction", reads: ["remote.state", "review.state"], needs: ["review.action"], acceptsUnknown: [], done: s => s.review.state === "pass" || s.review.state === "waived" || s.review.state === "not-applicable" || s.remote.state === "finalizing", table: "review", reentry: "rejudge", branches: {
    "contract-route": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: card contract" }], ["WRITE", { artifact: "activeCard", scope: "release-claim" }], ["COMMIT", { authority: "external.principles", scope: "binding-release", branch: "integration", files: "release rename only", subject: "<id> <NN.N> release" }], "ROUTE:direct"],
    "ask-disposition": ["ASK"],
    "apply-disposition": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: review disposition" }], ["WRITE", { artifact: "activeCard", scope: "person-directed repair" }], ["RUN", { scope: "completion-signal" }], ["WRITE", { artifact: "activeCard", template: "completionSignalResult" }], ["READ", { artifact: "reviewerContract" }], ["DISPATCH", { role: "reviewer" }], ["WRITE", { artifact: "activeCard", template: "reviewResult" }], "WAIT"],
    "block-nonpass": [["REPORT", { scope: "spent-disposition-nonpass" }], "BLOCK"],
    repair: [["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: review objections" }], ["WRITE", { artifact: "activeCard", scope: "review repair" }], ["RUN", { scope: "completion-signal" }], ["WRITE", { artifact: "activeCard", template: "completionSignalResult" }], ["READ", { artifact: "reviewerContract" }], ["DISPATCH", { role: "reviewer" }], ["WRITE", { artifact: "activeCard", template: "reviewResult" }], "WAIT"],
    dispatch: [["READ", { artifact: "reviewerContract" }], ["READ", { artifact: "activeCard" }], ["DISPATCH", { role: "reviewer" }], ["WRITE", { artifact: "activeCard", template: "reviewResult" }], "WAIT"]
  }, body: "stage: review-reduction" },
  { id: "research-checkpoint", reads: ["research.checkpoint"], acceptsUnknown: [], done: s => s.research.checkpoint === "not-applicable" || s.research.checkpoint === "committed", effects: [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: research synthesis" }], "NEXT"], reentry: "rejudge", body: "stage: research-checkpoint" },
  { id: "knowledge-marker", reads: ["research.checkpoint", "knowledge.marker", "boundary.state", "task.commit", "task.integration", "handoff.state", "completion.state", "review.state", "knowledge.action"], needs: ["knowledge.action"], acceptsUnknown: ["knowledge.action"], done: s => s.knowledge.marker === "current-source" || (s.research.checkpoint === "not-applicable" && (s.knowledge.action === "none" || !lateBoundarySettled(s))), table: "knowledge", reentry: "rejudge", branches: {
    "emit-arch": [["WRITE", { artifact: "knowledgeMarkerTransport", template: "knowledgeLandingPending", writer: "arch", source: "exact-card-path@fullhash", touches: [".devflow/journal.md"] }], ["COMMIT", { scope: "knowledge-marker", subject: "<id> boundary: knowledge landing", touches: [".devflow/journal.md"] }], "ROUTE:resume"],
    "route-direct": [["REPORT", { scope: "post-title-knowledge-source-missing" }], "ROUTE:direct"],
    none: [["REPORT", { scope: "no-reusable-knowledge-promotion" }], "NEXT"]
  }, body: "stage: knowledge-marker" },
  { id: "task-finalization", reads: ["remote.state", "task.commit"], needs: ["feedback.action"], acceptsUnknown: [], done: s => s.task.commit === "present" || s.remote.state === "finalizing", table: "finalize", reentry: "rejudge", branches: {
    staling: [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: upper-document change" }], "ROUTE:resume"],
    "design-note": [["REPORT", { scope: "canonical-capability-writer-route" }], ["COMMIT", { scope: "checkpoint", subject: "<id> <NN.N> wip: capability design note" }], "ROUTE:resume"],
    "remote-compatible-carry": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["WRITE", { artifact: "activeCard", template: "carry" }], ["WRITE", { artifact: "compatibleFeedbackTransport", grammar: "external.principles.compatibleFeedbackPending", entries: "feedback.eligibleSet.bytes", atomic: true }], ["WRITE", { artifact: "remoteFinalizingTransport", scope: "evidence-finalizing replacement" }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    "remote-compatible": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["WRITE", { artifact: "compatibleFeedbackTransport", grammar: "external.principles.compatibleFeedbackPending", entries: "feedback.eligibleSet.bytes", atomic: true }], ["WRITE", { artifact: "remoteFinalizingTransport", scope: "evidence-finalizing replacement" }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    "remote-carry": [["WRITE", { artifact: "activeCard", template: "carry" }], ["WRITE", { artifact: "remoteFinalizingTransport", scope: "evidence-finalizing replacement" }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    remote: [["WRITE", { artifact: "remoteFinalizingTransport", scope: "evidence-finalizing replacement" }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    "compatible-carry": [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["WRITE", { artifact: "activeCard", template: "carry" }], ["WRITE", { artifact: "compatibleFeedbackTransport", grammar: "external.principles.compatibleFeedbackPending", entries: "feedback.eligibleSet.bytes", atomic: true }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    compatible: [["WRITE", { artifact: "activeCard", template: "progressSnippet" }], ["WRITE", { artifact: "compatibleFeedbackTransport", grammar: "external.principles.compatibleFeedbackPending", entries: "feedback.eligibleSet.bytes", atomic: true }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    carry: [["WRITE", { artifact: "activeCard", template: "carry" }], ["COMMIT", { scope: "task", subject: "exact card H1" }], "NEXT"],
    plain: [["COMMIT", { scope: "task", subject: "exact card H1" }], ["REPORT", { scope: "task-commit-observation" }], "NEXT"]
  }, body: "stage: task-finalization" },
  { id: "integration", reads: ["task.commit", "task.integration"], acceptsUnknown: [], done: s => s.task.commit === "absent" || s.task.integration === "integrated", table: "integration", reentry: "rejudge", branches: {
    blocked: [["REPORT", { scope: "integration-blockade" }], "WAIT"],
    pending: [["COMMIT", { scope: "integration", subject: "merge method from arch" }], ["REPORT", { scope: "integration-ancestor-check" }], "NEXT"]
  }, body: "stage: integration" },
  { id: "handoff", reads: ["task.integration", "handoff.state"], acceptsUnknown: [], done: s => s.task.integration !== "integrated" || s.handoff.state === "current", effects: [["WRITE", { artifact: "roomHandoff", template: "handoff" }], ["REPORT", { scope: "handoff-refresh" }], "NEXT"], reentry: "rejudge", body: "stage: handoff" },
  { id: "boundary", reads: ["boundary.state", "card.phase", "knowledge.marker", "feedback.marker"], needs: ["feedback.action"], acceptsUnknown: [], done: s => s.card.phase === "done" && s.boundary.state === "complete" && s.knowledge.marker !== "current-source" && s.feedback.marker !== "current-source", table: "boundary", reentry: "rejudge", branches: {
    compatible: [["WRITE", { artifact: "compatibleFeedbackTransport", grammar: "external.principles.compatibleFeedbackPending", entries: "feedback.eligibleSet.bytes", atomic: true, touches: [".devflow/journal.md"] }], ["COMMIT", { scope: "compatible-marker", subject: "<id> boundary: compatible feedback", touches: [".devflow/journal.md"] }], "ROUTE:resume"],
    "compatible-settled-carry": [["WRITE", { artifact: "activeCard", template: "carry" }], ["WRITE", { artifact: "activeCard", scope: "canonical claim-done move" }], ["COMMIT", { scope: "boundary", subject: "<id> boundary: task closure" }], "ROUTE:resume"],
    "compatible-settled": [["WRITE", { artifact: "activeCard", scope: "canonical claim-done move" }], ["COMMIT", { scope: "boundary", subject: "<id> boundary: task closure" }], "ROUTE:resume"],
    plain: [["WRITE", { artifact: "activeCard", scope: "canonical claim-done move" }], ["COMMIT", { scope: "boundary", subject: "<id> boundary: task closure" }], "ROUTE:resume"],
    "late-carry": [["WRITE", { artifact: "activeCard", template: "carry" }], ["WRITE", { artifact: "activeCard", scope: "canonical claim-done move" }], ["COMMIT", { scope: "boundary", subject: "<id> boundary: task closure" }], "ROUTE:resume"],
    "late-anchor": [["WRITE", { artifact: "activeCard", scope: "canonical claim-done move" }], ["COMMIT", { scope: "boundary", subject: "<id> boundary: task closure" }], "ROUTE:resume"],
    pending: [["REPORT", { scope: "reobserve-finish-boundary" }], "WAIT"]
  }, body: "stage: boundary" }
];

export const ARTIFACTS = {
  activeCard: { path: ".devflow/tree/**.md", writer: "work", readers: ["stage.claim-or-reenter", "stage.implement-and-signal", "stage.review-reduction", "stage.research-checkpoint", "stage.task-finalization", "stage.boundary"] },
  product: { path: ".devflow/project/product.md", writer: "project.product", readers: ["stage.implement-and-signal", "role.reviewer"] },
  arch: { path: ".devflow/project/arch.md", writer: "project.arch", readers: ["stage.implement-and-signal", "role.reviewer"] },
  codeStyle: { path: ".devflow/project/code-style.md", writer: "project.arch", readers: ["stage.implement-and-signal", "role.reviewer"] },
  design: { path: ".devflow/project/design.md", writer: "project.design", readers: ["stage.implement-and-signal", "role.reviewer"] },
  glossary: { path: ".devflow/project/glossary.md", writer: "project.product", readers: ["stage.implement-and-signal", "role.reviewer"] },
  journal: { path: ".devflow/journal.md", writer: "external.principles", readers: ["stage.implement-and-signal", "stage.knowledge-marker", "stage.task-finalization", "role.reviewer"] },
  knowledgeMarkerTransport: { path: ".devflow/journal.md#knowledge-landing-pending", writer: "work", readers: ["stage.knowledge-marker"] },
  compatibleFeedbackTransport: { path: ".devflow/journal.md#compatible-feedback-pending", writer: "work", readers: ["stage.task-finalization", "stage.boundary", "guard.compatible-feedback-before-closure"] },
  remoteFinalizingTransport: { path: ".devflow/journal.md#remote-evidence-finalizing", writer: "work", readers: ["stage.task-finalization"] },
  roomHandoff: { path: ".devflow/users/<id>/HANDOFF.md", writer: "work", readers: ["stage.handoff"] },
  reviewerContract: { path: "references/reviewer-role.md", writer: "work", readers: ["stage.review-reduction", "role.reviewer"] },
};

export const ROLES = {
  reviewer: {
    body: "role: reviewer",
    inputs: ["progress-excluded active card", "card-bounded diff", "code style", "glossary", "journal", "capability design zone", "binding ADRs", "design freshness projection", "exact non-capsule Read first paths"],
    reads: ["activeCard", "product", "arch", "codeStyle", "design", "glossary", "journal"],
    judgments: { intent: ["pass", "objection"], logic: ["pass", "objection"], scope: ["pass", "objection"], speculative: ["yes", "no"] },
    effects: [],
    returns: "reviewerResult"
  }
};

export const READ_FIRST = [
  { body: "why: purpose", path: "references/purpose.md" }
];

export const DECLARATIONS = {
  profile: { value: "p2; state-dependent guards, evidence gates, recovery, review lineage, and ordered commit effects are mechanical", consumer: "build" },
  state_api: { value: "The context-bound sibling principles scripts/project-state.mjs calculateState({root}) schema devflow/project-state/2 object is the sole shared-state API. Work never parses CLI rendering, calls process.cwd(), rereads journal as a state kernel, or infers a semantic owner.", consumer: "collector" },
  tweak_boundary: { value: "A passing tweak is completed only by principles entry and never invokes work; work has no tweak observation, stage, branch, token, commit, or recovery route.", consumer: "principles|work" },
  c2_research: { value: "Research uses its committed synthesis checkpoint. A general task judges promotion only after its exact-title commit is integrated with current completion, review, and handoff evidence; a reusable conclusion must already be in that committed card source. Work emits one journal-only knowledge landing marker per owner with writer arch and exact card path@full hash, or routes a source-less late conclusion back through Direct.", consumer: "stage.research-checkpoint|stage.knowledge-marker" },
  c5_history: { value: "Closed history opens only for an exact named card, a non-pass repair lineage, or the exact Source basis of the current K or Trap. Broad closed-tree loading is blocked.", consumer: "guard.closed-history-refusal|stage.implement-and-signal" },
  c6_closure: { value: "Completion and branch closure are observed from the current card, structured calculateState facts, and concrete Git evidence. The first complete compatible-feedback proposal set is produced atomically and seals that card's exact members in Git history; later sessions receive current and consumed lifecycle entries as the sealed-set fact, current residual owners block closure, and an all-consumed set follows ordinary or late closure without another marker or exact-title task commit.", consumer: "guard.compatible-feedback-set-required|guard.compatible-feedback-before-closure|stage.task-finalization|stage.boundary" },
  progress_formats: { value: "External principles owns the canonical completion, review, remote-evidence, carry, and knowledge-marker grammar IDs loaded at entry. Work's five local templates are byte projections only and are seam-tested through structured project-state; no local FORMAT owns policy.", consumer: "external.principles|template-projection-test" },
  remote_json_token: { value: "The remoteEvidenceCheck projection substitutes complete serialized JSON string tokens for checkJson and detailJson in canonical order. Structured project-state validation maps a bare, malformed, or duplicate line to invalid progress evidence.", consumer: "template.remoteEvidenceCheck|collector.work/remote.state" },
  legacy_loop: { value: "Claim/progress, completion signal, independent review, objections and repair lineage, carry, evidence wait/finalize, integration, compatible feedback, claim-done rename, boundary, handoff, failure and recovery remain ordered and none is replaced by a judged close action.", consumer: "orders|stages" },
  provenance: { value: "Every migration atom resolves through the canonical obligation ledger to an authored spec, body, template, collector, fixture, or preserved source coordinate; DEFERRED and review-required dispositions are zero.", consumer: "maintainer" }
};

export const DEFERRED = [];
