import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectors } from "./index.mjs";

const fixtureState = join(dirname(fileURLToPath(import.meta.url)), "design-state.mjs");

test("collectors isolate two supplied roots and cannot observe cwd without context", async () => {
  const first = await mkdtemp(join(tmpdir(), "design-collector-first-"));
  const second = await mkdtemp(join(tmpdir(), "design-collector-second-"));
  try {
    await mkdir(join(first, "devflow/project"), { recursive: true });
    await mkdir(join(first, "devflow/tree/00-project"), { recursive: true });
    await writeFile(join(first, "devflow/project/product.md"), "product\n");
    await writeFile(join(first, "devflow/project/arch.md"), "frontend: none\n");
    await writeFile(join(first, "devflow/journal.md"), "2026-08-30T00:00:00Z maintenance routing pending: request-json: design\n");
    await writeFile(join(first, "devflow/tree/00-project/00.1-research.md"), "# 00.1 Research: design\nOrigin: 2026-08-30T00:00:00Z maintenance routing pending: request-json: design\nApproval: pending\n");
    await mkdir(join(second, "devflow/project"), { recursive: true });
    await writeFile(join(second, "devflow/project/arch.md"), "frontend: needed\n");

    assert.equal(await collectors["state.design-product"]({ projectRoot: first }), "present");
    assert.equal(await collectors["state.design-product"]({ projectRoot: second }), "absent");
    assert.equal(await collectors["state.design-tree"]({ projectRoot: first }), "present");
    assert.equal(await collectors["state.design-tree"]({ projectRoot: second }), "absent");
    assert.equal(await collectors["state.design-frontend"]({ projectRoot: first }), "none");
    assert.equal(await collectors["state.design-frontend"]({ projectRoot: second }), "needed");
    const canonical = { projectRoot: first, projectStateTool: fixtureState };
    assert.equal(await collectors["state.design-request-state"](canonical), "current");
    assert.equal(await collectors["state.design-research-state"](canonical), "pending");
    assert.equal(await collectors["state.design-product"](), "unknown");
    assert.equal(await collectors["state.design-arch"](), "unknown");
    assert.equal(await collectors["state.design-current"](), "unknown");
    assert.equal(await collectors["state.design-tree"](), "unknown");
    assert.equal(await collectors["state.design-frontend"](), "unknown");
    assert.equal(await collectors["state.design-request-state"](), "unknown");
    assert.equal(await collectors["state.design-research-state"](), "unknown");
  } finally {
    await Promise.all([rm(first, { recursive: true, force: true }), rm(second, { recursive: true, force: true })]);
  }
});
