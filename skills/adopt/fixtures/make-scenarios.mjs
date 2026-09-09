import { writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const base = {
  "state.kernel": "available",
  "state.route": "setup.unmanaged",
  "state.material": "present",
};
const judged = {};
const decided = {};
const fixture = (id, patch, expectation, cover) => ({ id, s: { ...base, ...(patch.s ?? {}) }, judged: { ...judged, ...(patch.judged ?? {}) }, decided: { ...decided, ...(patch.decided ?? {}) }, expect: expectation, cover });

const data = [
  fixture("kernel-unavailable", { s: { "state.kernel": "unavailable" } }, { guard: "state-kernel-unavailable", status: "BLOCK" }, ["guard:state-kernel-unavailable"]),
  fixture("integrity-block", { s: { "state.route": "integrity.blocking" } }, { guard: "canonical-integrity-block", status: "BLOCK" }, ["guard:canonical-integrity-block"]),
  fixture("git-operation", { s: { "state.route": "git.open-operation" } }, { guard: "open-git-operation", status: "ASK" }, ["guard:open-git-operation"]),
  fixture("no-project-material", { s: { "state.material": "none" } }, { guard: "no-project-material-routes-product", status: "ROUTE" }, ["guard:no-project-material-routes-product"]),
  fixture("unknown-project-material", { s: { "state.material": "unknown" } }, { guard: "unknown-project-material", status: "BLOCK" }, ["guard:unknown-project-material"]),
  fixture("managed-state", { s: { "state.route": "owned-elsewhere" } }, { guard: "state-owned-elsewhere", status: "ROUTE" }, ["guard:state-owned-elsewhere"]),
  fixture("refutation-blocked", { judged: { "refutation.state": "blocked" }, decided: { "approval.action": "approve" } }, { stage: "semantic-refutation", status: "BLOCK", effects: ["BLOCK"] }, ["stage:semantic-refutation", "branch:semantic-refutation/blocked"]),
  fixture("refutation-pending", { judged: { "refutation.state": "pending" } }, { stage: "semantic-refutation", status: "NEXT", effects: ["READ", "RUN", "RUN", "RUN", "RUN", "NEXT"] }, ["stage:semantic-refutation", "branch:semantic-refutation/pending"]),
  fixture("refutation-revise", { judged: { "refutation.state": "revise" } }, { stage: "semantic-refutation", status: "ROUTE", effects: ["RUN", "RUN", "ROUTE:adopt"] }, ["stage:semantic-refutation", "branch:semantic-refutation/revise"]),
  fixture("adoption-prepare", { judged: { "refutation.state": "clear" } }, { stage: "adoption", row: "prepare", status: "ASK", effects: ["REPORT", "ASK"] }, ["stage:adoption", "row:approval/prepare", "branch:approval/prepare"]),
  fixture("approval-refuse", { judged: { "refutation.state": "clear" }, decided: { "approval.action": "refuse" } }, { stage: "adoption", row: "refuse", status: "DONE", effects: ["REPORT", "DONE"] }, ["row:approval/refuse", "branch:approval/refuse"]),
  fixture("approval-approve", { judged: { "refutation.state": "clear" }, decided: { "approval.action": "approve" } }, { stage: "adoption", row: "approve", status: "DONE", effects: ["WRITE", "WRITE", "WRITE", "WRITE", "WRITE", "WRITE", "WRITE", "RUN", "WRITE", "WRITE", "RUN", "RUN", "COMMIT", "RUN", "WRITE", "COMMIT", "REPORT", "DONE"] }, ["row:approval/approve", "branch:approval/approve"])
];

await writeFile(new URL("scenarios.json", root), `${JSON.stringify(data, null, 2)}\n`);
