import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const destination = fileURLToPath(new URL("../scenarios.json", import.meta.url));

const S = {
  "state.kernel": "available",
  "state.route": "setup.layer0-incomplete",
  "state.brownfield": "no",
  "state.code": "none",
  "state.frontend": "needed",
  "state.worktrees": "one",
  "state.layer0": "incomplete",
  "state.capabilities": "missing",
  "state.expected": 3,
  "marker.knowledge": "none",
  "marker.knowledgeCount": 0,
  "compatible.owner": "none",
  "compatible.landing": "none"
};

const JUDGED = {
  "request.kind": "initial",
  "glossary.phase": "definition",
  "landing.mode": "compact",
  "inputs.status": "read",
  "refresh.result": "compatible",
  "components.status": "confirmed",
  "research.state": "settled",
  "stack.status": "confirmed",
  "project.shape": "confirmed",
  "verification.state": "confirmed",
  "proposal.state": "ready",
  "capacity.state": "enough"
};

const DECIDED = {
  "approval.action": "ask",
  "capability.action": "ask",
  "route.after": "split",
  "repair.action": "ask"
};

function scenario(id, { s = {}, judged = {}, decided = {}, expect, cover = [] }) {
  return {
    id,
    s: { ...S, ...s },
    judged: { ...JUDGED, ...judged },
    decided: { ...DECIDED, ...decided },
    expect,
    cover
  };
}

const guard = (id, guardId, status, s, effects = []) => scenario(id, {
  s,
  expect: { stage: null, guard: guardId, status, effects },
  cover: [`guard:${guardId}`]
});

const branch = (id, stage, name, status, effects, patch = {}) => scenario(id, {
  ...patch,
  expect: { stage, status, effects },
  cover: [`stage:${stage}`, `branch:${stage}/${name}`, ...(patch.cover ?? [])]
});

const cases = [
  guard("kernel-unavailable", "state-kernel-unavailable", "BLOCK", { "state.kernel": "unavailable" }),
  guard("layer0-state-unknown", "layer0-state-unknown", "BLOCK", { "state.layer0": "unknown" }),
  guard("worktree-state-unknown", "worktree-state-unknown", "ASK", { "state.worktrees": "unknown" }),
  guard("invalid-source-json", "canonical-integrity-block", "BLOCK", { "state.route": "integrity.blocking" }),
  guard("invalid-writer", "canonical-integrity-block", "BLOCK", { "state.route": "integrity.blocking" }),
  guard("open-git-operation", "open-git-operation", "ASK", { "state.route": "git.open-operation" }),
  guard("missing-product-new-project", "product-required", "ROUTE", { "state.route": "setup.no-product", "state.code": "none" }),
  guard("missing-product-existing-code", "partial-setup-owned-by-resume", "ROUTE", { "state.route": "setup.no-product", "state.code": "present" }),
  guard("missing-product-existing-history", "partial-setup-owned-by-resume", "ROUTE", { "state.route": "setup.no-product", "state.code": "none", "state.brownfield": "yes" }),
  guard("state-owned-elsewhere", "state-owned-elsewhere", "ROUTE", { "state.route": "owned-elsewhere" }),

  branch("glossary-definition", "glossary-term", "definition", "NEXT", ["READ", "WRITE", "COMMIT", "NEXT"], { s: { "state.route": "marker.glossary-term" }, judged: { "glossary.phase": "definition" } }),
  branch("glossary-capability-alignment", "glossary-term", "align-capabilities", "NEXT", ["WRITE", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.glossary-term" }, judged: { "glossary.phase": "align-capabilities" } }),
  scenario("design-marker-binding", { s: { "state.route": "marker.design-note" }, expect: { stage: "design-marker", status: "ROUTE", effects: ["READ", "WRITE", "RUN", "COMMIT", "ROUTE:resume"] }, cover: ["stage:design-marker"] }),

  branch("compact-owner-landing", "knowledge-landing", "compact", "NEXT", ["READ", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "[{\"owner\":\".devflow/project/arch.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/01-card.md@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"}]", "marker.knowledgeCount": 1 }, judged: { "landing.mode": "compact" } }),
  branch("legacy-adopt-writer-landing", "knowledge-landing", "recursive", "NEXT", ["READ", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "[{\"owner\":\".devflow/project/capabilities/01-auth.md\",\"writer\":\"adopt\",\"source\":\".devflow/tasks/07-card.md@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\"}]", "marker.knowledgeCount": 1 }, judged: { "landing.mode": "recursive" } }),
  branch("multi-owner-partial-compact", "knowledge-landing", "partial-compact", "NEXT", ["READ", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "[{\"owner\":\".devflow/project/arch.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/01-card.md@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"},{\"owner\":\".devflow/project/capabilities/01-auth.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/07-card.md@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\"}]", "marker.knowledgeCount": 2 }, judged: { "landing.mode": "partial-compact" } }),
  branch("multi-owner-partial-recursive", "knowledge-landing", "partial-recursive", "NEXT", ["READ", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "[{\"owner\":\".devflow/project/capabilities/01-auth.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/07-card.md@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\"},{\"owner\":\".devflow/project/capabilities/02-billing.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/09-card.md@cccccccccccccccccccccccccccccccccccccccc\"}]", "marker.knowledgeCount": 2 }, judged: { "landing.mode": "partial-recursive" } }),
  branch("multi-owner-mixed-landing", "knowledge-landing", "multi-mixed", "NEXT", ["READ", "WRITE", "WRITE", "RUN", "COMMIT", "NEXT"], { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "[{\"owner\":\".devflow/project/arch.md\",\"writer\":\"arch\",\"source\":\".devflow/tasks/01-card.md@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"},{\"owner\":\".devflow/project/capabilities/01-auth.md\",\"writer\":\"adopt\",\"source\":\".devflow/tasks/07-card.md@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\"}]", "marker.knowledgeCount": 2 }, judged: { "landing.mode": "multi-mixed" } }),

  branch("repair-layer0-ask", "repair-layer0-fields", "ask", "ASK", ["ASK"], { s: { "state.route": "setup.integration-config" }, decided: { "repair.action": "ask" } }),
  branch("repair-layer0-commit", "repair-layer0-fields", "commit", "ROUTE", ["WRITE", "COMMIT", "ROUTE:resume"], { s: { "state.route": "setup.integration-config" }, decided: { "repair.action": "commit" } }),
  branch("read-product-glossary-inputs", "read-inputs", "needed", "NEXT", ["READ", "READ", "READ", "READ", "READ", "READ", "READ", "NEXT"], { judged: { "inputs.status": "needed" } }),
  branch("refresh-product-contradiction", "refresh-check", "product-contradiction", "ROUTE", ["REPORT", "ROUTE:product"], { judged: { "request.kind": "refresh", "refresh.result": "product-contradiction" } }),
  branch("refresh-capability-only-change", "refresh-check", "capability-only", "ROUTE", ["REPORT", "ROUTE:resume"], { judged: { "request.kind": "refresh", "refresh.result": "capability-only" } }),
  branch("derive-components", "component-derivation", "derive", "ASK", ["REPORT", "ASK"], { judged: { "components.status": "derive" } }),
  branch("confirm-component-proposal", "component-derivation", "proposed", "ASK", ["REPORT", "ASK"], { judged: { "components.status": "proposed" } }),
  branch("candidate-research-route", "candidate-research", "needed", "ROUTE", ["REPORT", "ROUTE:split"], { judged: { "research.state": "needed" } }),
  branch("candidate-research-active", "candidate-research", "active", "ROUTE", ["REPORT", "ROUTE:work"], { judged: { "research.state": "active" } }),
  branch("candidate-research-blocked", "candidate-research", "blocked", "WAIT", ["REPORT", "WAIT"], { judged: { "research.state": "blocked" } }),
  branch("candidate-research-conflicted", "candidate-research", "conflicted", "BLOCK", ["REPORT", "BLOCK"], { judged: { "research.state": "conflicted" } }),
  branch("candidate-research-unavailable", "candidate-research", "unavailable", "BLOCK", ["REPORT", "BLOCK"], { judged: { "research.state": "unavailable" } }),
  branch("stack-proposal", "stack-and-derived", "propose", "ASK", ["REPORT", "ASK"], { judged: { "stack.status": "propose" } }),
  branch("stack-choice-required", "stack-and-derived", "needs-choice", "ASK", ["REPORT", "ASK"], { judged: { "stack.status": "needs-choice" } }),
  branch("structure-capability-first", "code-structure", "three-plus-capabilities", "ASK", ["REPORT", "ASK"], { judged: { "project.shape": "three-plus-capabilities" }, cover: ["row:structureChoice/recommend-a", "branch:structureChoice/recommend-a"] }),
  branch("structure-screen-first", "code-structure", "screen-heavy", "ASK", ["REPORT", "ASK"], { judged: { "project.shape": "screen-heavy" }, cover: ["row:structureChoice/recommend-b", "branch:structureChoice/recommend-b"] }),
  branch("structure-flat", "code-structure", "under-twenty-files", "ASK", ["REPORT", "ASK"], { judged: { "project.shape": "under-twenty-files" }, cover: ["row:structureChoice/recommend-c", "branch:structureChoice/recommend-c"] }),
  branch("verification-channel-select", "verify-channel", "select", "ASK", ["REPORT", "ASK"], { judged: { "verification.state": "select" } }),
  branch("verification-channel-probe", "verify-channel", "probe", "WAIT", ["DISPATCH", "WAIT"], { judged: { "verification.state": "probe" } }),
  branch("verification-channel-unavailable", "verify-channel", "unavailable", "ASK", ["REPORT", "ASK"], { judged: { "verification.state": "unavailable" } }),
  branch("proposal-draft", "proposal", "draft", "ASK", ["REPORT", "ASK"], { judged: { "proposal.state": "draft" } }),
  branch("interrupted-proposal", "proposal", "interrupted", "ASK", ["REPORT", "ASK"], { judged: { "proposal.state": "interrupted" } }),
  branch("architecture-approval-request", "approval", "ask", "ASK", ["REPORT", "ASK"], { cover: ["row:approvalBoundary/ask", "branch:approvalBoundary/ask"] }),
  branch("approval-refusal", "approval", "refuse", "DONE", ["REPORT", "DONE"], { decided: { "approval.action": "refuse" }, cover: ["row:approvalBoundary/refuse", "branch:approvalBoundary/refuse"] }),
  branch("initial-architecture-creation", "approval", "approve", "NEXT", ["WRITE", "WRITE", "WRITE", "COMMIT", "NEXT"], { decided: { "approval.action": "approve" }, cover: ["row:approvalBoundary/approve-initial", "branch:approvalBoundary/approve-initial"] }),
  branch("refresh-architecture-commit", "approval", "approve", "NEXT", ["WRITE", "WRITE", "WRITE", "COMMIT", "NEXT"], { judged: { "request.kind": "refresh" }, decided: { "approval.action": "approve" }, cover: ["row:approvalBoundary/approve-refresh", "branch:approvalBoundary/approve-refresh"] }),
  branch("capability-capacity-warning", "capability-capacity", "warned", "ROUTE", ["REPORT", "ROUTE:resume"], { judged: { "request.kind": "capability-only", "capacity.state": "warned" } }),
  branch("capability-docs-approval-request", "capability-design", "ask", "ASK", ["REPORT", "ASK"], { judged: { "request.kind": "capability-only" }, decided: { "capability.action": "ask" }, cover: ["row:capabilityRoute/ask", "branch:capabilityRoute/ask"] }),
  branch("capability-docs-route-design", "capability-design", "approve", "ROUTE", ["WRITE", "WRITE", "COMMIT", "ROUTE:design"], { s: { "state.frontend": "needed" }, judged: { "request.kind": "capability-only" }, decided: { "capability.action": "approve", "route.after": "design" }, cover: ["row:capabilityRoute/approve-design", "branch:capabilityRoute/approve-design"] }),
  branch("capability-docs-route-resume", "capability-design", "approve", "ROUTE", ["WRITE", "WRITE", "COMMIT", "ROUTE:resume"], { judged: { "request.kind": "capability-only" }, decided: { "capability.action": "approve", "route.after": "resume" }, cover: ["row:capabilityRoute/approve-resume", "branch:capabilityRoute/approve-resume"] }),
  branch("managed-brownfield-design-refresh", "capability-design", "approve", "ROUTE", ["WRITE", "WRITE", "COMMIT", "ROUTE:resume"], { s: { "state.route": "baseline.design-refresh", "state.brownfield": "yes", "state.layer0": "current", "state.capabilities": "refresh" }, judged: { "request.kind": "capability-only" }, decided: { "capability.action": "approve", "route.after": "resume" } }),
  branch("route-after-commit-split", "capability-design", "approve", "ROUTE", ["WRITE", "WRITE", "COMMIT", "ROUTE:split"], { judged: { "request.kind": "capability-only" }, decided: { "capability.action": "approve", "route.after": "split" }, cover: ["row:capabilityRoute/approve-split", "branch:capabilityRoute/approve-split"] }),
  scenario("already-current", { s: { "state.route": "complete.product-pass", "state.layer0": "current", "state.capabilities": "current", "state.expected": 0 }, judged: { "request.kind": "none" }, expect: { stage: null, status: "DONE", effects: [] } }),
  scenario("compatible-feedback-write-arch", { s: { "state.route": "marker.compatible-feedback", "compatible.owner": "arch", "compatible.landing": "pending" }, expect: { stage: "compatible-feedback", row: "write-arch", status: "WAIT", effects: ["WRITE", "WAIT"] }, cover: ["stage:compatible-feedback", "row:compatibleFeedback/write-arch", "branch:compatibleFeedback/write-arch"] }),
  scenario("compatible-feedback-write-capability", { s: { "state.route": "marker.compatible-feedback", "compatible.owner": "capability", "compatible.landing": "pending" }, expect: { stage: "compatible-feedback", row: "write-capability", status: "WAIT", effects: ["WRITE", "WAIT"] }, cover: ["stage:compatible-feedback", "row:compatibleFeedback/write-capability", "branch:compatibleFeedback/write-capability"] }),
  scenario("compatible-feedback-semantic-landing", { s: { "state.route": "marker.compatible-feedback", "compatible.owner": "capability", "compatible.landing": "satisfied" }, expect: { stage: "compatible-feedback", row: "land", status: "ROUTE", effects: ["RUN", "COMMIT", "ROUTE:resume"] }, cover: ["stage:compatible-feedback", "row:compatibleFeedback/land", "branch:compatibleFeedback/land"] }),
  scenario("compatible-feedback-invalid-shape-blocks", { s: { "state.route": "marker.glossary-term", "compatible.owner": "invalid", "compatible.landing": "invalid" }, expect: { guard: "compatible-feedback-shape", status: "BLOCK" }, cover: ["guard:compatible-feedback-shape"] })
];

await writeFile(destination, `${JSON.stringify(cases, null, 2)}\n`, "utf8");
