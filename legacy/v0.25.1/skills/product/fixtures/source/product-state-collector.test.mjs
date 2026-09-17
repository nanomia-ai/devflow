import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { collectors } from "../../collectors/index.mjs";

const here = dirname(fileURLToPath(import.meta.url));

test("product collector consumes the canonical state module instead of parsing CLI text", async () => {
  const projectRoot = mkdtempSync(join(tmpdir(), "devflow-product-state-"));
  try {
    const value = await collectors["state.product-request"]({
      projectRoot,
      projectStateTool: join(here, "project-state-rerun.mjs")
    });
    assert.equal(value, "product-re-run");
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("product collector fails closed when canonical state is unavailable", async () => {
  const projectRoot = mkdtempSync(join(tmpdir(), "devflow-product-state-"));
  try {
    const value = await collectors["state.product-request"]({
      projectRoot,
      projectStateTool: join(here, "project-state-unavailable.mjs")
    });
    assert.equal(value, "unknown");
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("product collector internally verifies exact durable lineage and exposes only approval state", async () => {
  const projectRoot = mkdtempSync(join(tmpdir(), "devflow-product-state-"));
  try {
    mkdirSync(join(projectRoot, ".devflow/tree/00-project"), { recursive: true });
    writeFileSync(join(projectRoot, ".devflow/tree/00-project/00.1-research.md"), "# 00.1 Research: product\n");
    const context = {
      projectRoot,
      projectStateTool: join(here, "project-state-research.mjs")
    };
    assert.equal(await collectors["state.project-research-state"](context), "effective");
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});
