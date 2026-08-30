import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { calculateState } from "../../principles/scripts/project-state.mjs";
import { collectors } from "./index.mjs";
import { unknown as unknownValue } from "../scripts/skill-rails/dsl.mjs";

async function repository() {
  const root = await mkdtemp(join(tmpdir(), "verify-collector-"));
  execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "collector@example.test"], { cwd: root });
  execFileSync("git", ["config", "user.name", "Collector Fixture"], { cwd: root });
  await writeFile(join(root, "README.txt"), "fixture\n");
  execFileSync("git", ["add", "."], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "fixture"], { cwd: root, stdio: "ignore" });
  return root;
}

test("collectors consume the canonical projection and zones at an explicit project root", async () => {
  const root = await repository();
  try {
    const context = { projectRoot: root };
    assert.equal(await collectors["verify/principles.verification-layer"](context), "invalid");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("an absent explicit root fails closed without a CLI or record fallback", async () => {
  const context = { projectRoot: join(tmpdir(), "missing-verify-collector-root") };
  assert.equal(await collectors["verify/principles.verification-layer"](context), "invalid");
  assert.deepEqual(await collectors["verify/principles.channel"](context), unknownValue());
});

test("collector reads exact canonical record state without invented execution grammar", async () => {
  const root = await repository();
  const withoutExecution = await repository();
  const counterfeit = await repository();
  const ambiguous = await repository();
  try {
    const recordPath = join(root, "devflow", "tree", "verify.md");
    await mkdir(join(root, "devflow", "tree"), { recursive: true });
    const revisions = (await calculateState({ root })).compatibility.snapshot.revisions;
    const base = (values = revisions) => [
      "# Verification",
      `Product revision: ${values.product}`,
      `Verification revision: ${values.verification}`,
      `Code revision: ${values.code}`,
      "Capability revision: not-applicable",
      "Executed:",
      "Verdict: pass"
    ].join("\n");
    await writeFile(recordPath, base().replace("Executed:", "Executed: cli smoke: observed success"));
    const context = { projectRoot: root };
    assert.equal(await collectors["verify/record.current"](context), "current");
    assert.equal(await collectors["verify/record.execution-evidence"](context), "current");

    const missingExecutionPath = join(withoutExecution, "devflow", "tree", "verify.md");
    await mkdir(join(withoutExecution, "devflow", "tree"), { recursive: true });
    const withoutExecutionRevisions = (await calculateState({ root: withoutExecution })).compatibility.snapshot.revisions;
    await writeFile(missingExecutionPath, base(withoutExecutionRevisions));
    assert.equal(await collectors["verify/record.current"]({ projectRoot: withoutExecution }), "current");
    assert.equal(await collectors["verify/record.execution-evidence"]({ projectRoot: withoutExecution }), "missing");

    await mkdir(join(counterfeit, "devflow", "tree"), { recursive: true });
    await writeFile(join(counterfeit, "devflow", "tree", "verify.md"), base({ product: "p", verification: "v", code: "c" }).replace("Executed:", "Executed: claimed success"));
    assert.equal(await collectors["verify/record.freshness"]({ projectRoot: counterfeit }), "stale");
    assert.equal(await collectors["verify/record.current"]({ projectRoot: counterfeit }), "stale");
    assert.equal(await collectors["verify/record.execution-evidence"]({ projectRoot: counterfeit }), "missing");

    await mkdir(join(ambiguous, "devflow", "tree", "02-capability.done"), { recursive: true });
    await writeFile(join(ambiguous, "devflow", "tree", "verify.md"), base().replace("Executed:", "Executed: root execution"));
    await writeFile(join(ambiguous, "devflow", "tree", "02-capability.done", "verify.md"), base().replace("Executed:", "Executed: capability execution"));
    assert.equal(await collectors["verify/record.current"]({ projectRoot: ambiguous }), "mismatched");
    assert.equal(await collectors["verify/record.execution-evidence"]({ projectRoot: ambiguous }), "missing");
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(withoutExecution, { recursive: true, force: true });
    await rm(counterfeit, { recursive: true, force: true });
    await rm(ambiguous, { recursive: true, force: true });
  }
});
