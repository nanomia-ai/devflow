import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { STAGES } from "../spec.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const run = fileURLToPath(new URL("../scripts/skill-rails/run.mjs", import.meta.url));

test("prepared and interrupted recovery perform a finite suffix and resume", () => {
  const recover = STAGES.find((stage) => stage.id === "recover");
  for (const branchName of ["prepared-route", "interrupted-result"]) {
    const branch = recover.branches[branchName];
    assert.equal(branch.at(-1), "ROUTE:resume");
    assert.deepEqual(branch.map((step) => Array.isArray(step) ? step[0] : step), ["READ", "RUN", "COMMIT", "ROUTE:resume"]);
    assert.match(branch[1][1].action, /validate.*(suffix|result).*once/i);
  }
});

test("documented role command emits each complete package-local contract", () => {
  const required = {
    verifier: ["never receive or open past history", "Execute browser clicks/input", "exactly pass, fail, or unverified", "never fix code"],
    auditor: ["exact `root:`/`file:` code scope", "Execute through the channel first", "execution-confirmed or presumed", "never a verdict or a fix"],
    retrospector: ["exact artifact set supplied", "never open other devflow files, code, commits, or progress logs", "mandatory strain evidence", "never a verdict or a fix"]
  };
  for (const [role, phrases] of Object.entries(required)) {
    const output = execFileSync(process.execPath, [run, "role", "--skill", packageRoot, "--role", role], { encoding: "utf8" });
    assert.match(output, new RegExp(`role: ${role}`));
    assert.match(output, /inputs:/);
    assert.match(output, /reads:/);
    assert.match(output, /effects:/);
    assert.match(output, /judgments:/);
    for (const phrase of phrases) assert.ok(output.includes(phrase), `${role} misses ${phrase}`);
  }
});
