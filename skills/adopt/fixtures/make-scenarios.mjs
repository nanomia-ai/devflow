import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("./", import.meta.url);
const base = {
  "state.kernel": "available", "state.route": "setup.no-product", "state.code": "present", "state.brownfield": "yes", "state.capabilities": "missing",
  "evidence.inventory": "present", "evidence.flow": "present", "evidence.records": "present", "marker.knowledge": "none", "marker.count": 0
};
const judged = { "entry.mode": "none", "inspection.status": "traced", "derivation.status": "confirmed", "proposal.status": "ready", "landing.mode": "compact", "request.kind": "initial" };
const decided = { "approval.action": "ask", "capability.action": "ask", "route.after": "split" };
const fixture = (id, patch, expectation, cover) => ({ id, s: { ...base, ...(patch.s ?? {}) }, judged: { ...judged, ...(patch.judged ?? {}) }, decided: { ...decided, ...(patch.decided ?? {}) }, expect: expectation, cover });
const data = [
  fixture("kernel-unavailable", { s: { "state.kernel": "unavailable" } }, { guard: "state-kernel-unavailable", status: "BLOCK" }, ["guard:state-kernel-unavailable"]),
  fixture("integrity-block", { s: { "state.route": "integrity.blocking" } }, { guard: "canonical-integrity-block", status: "BLOCK" }, ["guard:canonical-integrity-block"]),
  fixture("git-operation", { s: { "state.route": "git.open-operation" } }, { guard: "open-git-operation", status: "ASK" }, ["guard:open-git-operation"]),
  fixture("no-code", { s: { "state.code": "none" } }, { guard: "no-code-routes-product", status: "ROUTE" }, ["guard:no-code-routes-product"]),
  fixture("unknown-code", { s: { "state.code": "unknown" } }, { guard: "unknown-code-evidence", status: "BLOCK" }, ["guard:unknown-code-evidence"]),
  fixture("greenfield-baseline", { s: { "state.brownfield": "no", "state.route": "baseline.design-refresh" } }, { guard: "not-brownfield-writer", status: "ROUTE" }, ["guard:not-brownfield-writer"]),
  fixture("elsewhere", { s: { "state.route": "owned-elsewhere" } }, { guard: "state-owned-elsewhere", status: "ROUTE" }, ["guard:state-owned-elsewhere"]),
  fixture("landing-compact", { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "present", "marker.count": 1 } }, { stage: "knowledge-landing", status: "NEXT", effects: ["READ", "WRITE", "RUN", "COMMIT", "NEXT"] }, ["stage:knowledge-landing", "branch:knowledge-landing/compact"]),
  fixture("landing-recursive", { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "present", "marker.count": 1 }, judged: { "landing.mode": "recursive" } }, { stage: "knowledge-landing", status: "NEXT", effects: ["READ", "WRITE", "RUN", "COMMIT", "NEXT"] }, ["branch:knowledge-landing/recursive"]),
  fixture("landing-partial-compact", { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "present", "marker.count": 2 }, judged: { "landing.mode": "partial-compact" } }, { stage: "knowledge-landing", status: "NEXT", effects: ["READ", "WRITE", "RUN", "COMMIT", "NEXT"] }, ["branch:knowledge-landing/partial-compact"]),
  fixture("landing-partial-recursive", { s: { "state.route": "marker.knowledge-landing", "marker.knowledge": "present", "marker.count": 2 }, judged: { "landing.mode": "partial-recursive" } }, { stage: "knowledge-landing", status: "NEXT", effects: ["READ", "WRITE", "RUN", "COMMIT", "NEXT"] }, ["branch:knowledge-landing/partial-recursive"]),
  fixture("entry-initial", { judged: { "entry.mode": "initial" } }, { stage: "entry", status: "NEXT", effects: ["READ", "READ", "NEXT"] }, ["stage:entry", "branch:entry/initial"]),
  fixture("entry-partial", { judged: { "entry.mode": "partial" } }, { stage: "entry", status: "NEXT", effects: ["READ", "READ", "NEXT"] }, ["branch:entry/partial"]),
  fixture("entry-glossary", { judged: { "entry.mode": "glossary-only" } }, { stage: "entry", status: "NEXT", effects: ["READ", "NEXT"] }, ["branch:entry/glossary-only"]),
  fixture("entry-capability", { judged: { "entry.mode": "capability-only" } }, { stage: "entry", status: "NEXT", effects: ["READ", "NEXT"] }, ["branch:entry/capability-only"]),
  fixture("entry-design", { judged: { "entry.mode": "design-only" } }, { stage: "entry", status: "NEXT", effects: ["READ", "READ", "NEXT"] }, ["branch:entry/design-only"]),
  fixture("trace-needed", { judged: { "inspection.status": "needed" } }, { stage: "inspect-and-trace", status: "NEXT", effects: ["RUN", "RUN", "REPORT", "NEXT"] }, ["stage:inspect-and-trace", "branch:inspect-and-trace/needed"]),
  fixture("trace-missing", { judged: { "inspection.status": "evidence-missing" }, s: { "evidence.inventory": "missing", "evidence.flow": "missing" } }, { stage: "inspect-and-trace", status: "BLOCK", effects: ["REPORT", "BLOCK"] }, ["branch:inspect-and-trace/evidence-missing"]),
  fixture("trace-inconsistent", { judged: { "inspection.status": "traced" }, s: { "evidence.inventory": "missing" } }, { stage: "inspect-and-trace", status: "BLOCK", effects: ["REPORT", "BLOCK"] }, ["branch:inspect-and-trace/traced"]),
  fixture("derive-needed", { judged: { "derivation.status": "needed" } }, { stage: "derive-layer-zero", status: "NEXT", effects: ["READ", "REPORT", "NEXT"] }, ["stage:derive-layer-zero", "branch:derive-layer-zero/needed"]),
  fixture("derive-draft", { judged: { "derivation.status": "draft" } }, { stage: "derive-layer-zero", status: "NEXT", effects: ["REPORT", "NEXT"] }, ["branch:derive-layer-zero/draft"]),
  fixture("derive-conflict", { judged: { "derivation.status": "contradiction" } }, { stage: "derive-layer-zero", status: "ASK", effects: ["REPORT", "ASK"] }, ["branch:derive-layer-zero/contradiction"]),
  fixture("proposal-draft", { judged: { "proposal.status": "draft" } }, { stage: "proposal", status: "ASK", effects: ["REPORT", "ASK"] }, ["stage:proposal", "branch:proposal/draft"]),
  fixture("proposal-interrupted", { judged: { "proposal.status": "interrupted" } }, { stage: "proposal", status: "ASK", effects: ["REPORT", "ASK"] }, ["branch:proposal/interrupted"]),
  fixture("approval-ask", {}, { stage: "approval", row: "ask", status: "ASK", effects: ["REPORT", "ASK"] }, ["stage:approval", "branch:approval/ask", "row:approval/ask", "branch:approval/ask"]),
  fixture("approval-refuse", { decided: { "approval.action": "refuse" } }, { stage: "approval", row: "refuse", status: "DONE", effects: ["REPORT", "DONE"] }, ["branch:approval/refuse", "row:approval/refuse", "branch:approval/refuse"]),
  fixture("approval-approve", { decided: { "approval.action": "approve" } }, { stage: "approval", row: "approve", status: "NEXT", effects: ["WRITE", "WRITE", "WRITE", "WRITE", "COMMIT", "NEXT"] }, ["branch:approval/approve", "row:approval/approve", "branch:approval/approve"]),
  fixture("capability-ask", { judged: { "request.kind": "capability-only" } }, { stage: "capability-design", row: "ask", status: "ASK", effects: ["REPORT", "ASK"] }, ["stage:capability-design", "branch:capability-design/ask", "row:capabilityRoute/ask", "branch:capabilityRoute/ask"]),
  fixture("capability-design", { judged: { "request.kind": "capability-only" }, decided: { "approval.action": "approve", "capability.action": "approve", "route.after": "design" } }, { stage: "capability-design", row: "design", status: "ROUTE", effects: ["WRITE", "COMMIT", "ROUTE:design"] }, ["branch:capability-design/approve", "row:capabilityRoute/design", "branch:capabilityRoute/design"]),
  fixture("capability-resume", { judged: { "request.kind": "capability-only" }, decided: { "approval.action": "approve", "capability.action": "approve", "route.after": "resume" } }, { stage: "capability-design", row: "resume", status: "ROUTE", effects: ["WRITE", "COMMIT", "ROUTE:resume"] }, ["branch:capability-design/approve", "row:capabilityRoute/resume", "branch:capabilityRoute/resume"]),
  fixture("capability-split", { judged: { "request.kind": "capability-only" }, decided: { "approval.action": "approve", "capability.action": "approve", "route.after": "split" } }, { stage: "capability-design", row: "split", status: "ROUTE", effects: ["WRITE", "COMMIT", "ROUTE:split"] }, ["branch:capability-design/approve", "row:capabilityRoute/split", "branch:capabilityRoute/split"])
];
await writeFile(new URL("scenarios.json", root), `${JSON.stringify(data, null, 2)}\n`);
