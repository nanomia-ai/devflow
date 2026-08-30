import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { collectors } from "./index.mjs";
import { readFile } from "node:fs/promises";

const template = (await readFile(new URL("../templates/remote-evidence-check.md", import.meta.url), "utf8")).trimEnd();
const canonical = template
  .replace("{{timestamp}}", "2026-08-30T00:00:00Z")
  .replace("{{checkJson}}", JSON.stringify("https://ci.example/run/1; verdict: fail"))
  .replace("{{verdict}}", "pending")
  .replace("{{detailJson}}", JSON.stringify('owner said "wait; detail-json: later"'));

async function observed(line) {
  const root = await mkdtemp(join(tmpdir(), "work-remote-format-"));
  try {
    const tree = join(root, "devflow", "tree");
    await mkdir(tree, { recursive: true });
    const card = join(tree, "00.1-format.wip-jmp.md");
    await writeFile(card, `# card\n\n## Progress\n${line}\n`, "utf8");
    return await collectors["work/remote.state"]({ projectRoot: root, cardPath: "devflow/tree/00.1-format.wip-jmp.md" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("collector accepts exact escaped JSON strings in canonical order", async () => {
  assert.equal(await observed(canonical), "pending");
});

for (const [name, line] of [
  ["bare check token", '2026-08-30T00:00:00Z remote evidence check: check-json: run-1; verdict: pending; detail-json: "waiting"'],
  ["object check token", '2026-08-30T00:00:00Z remote evidence check: check-json: {"run":1}; verdict: pending; detail-json: "waiting"'],
  ["malformed detail token", '2026-08-30T00:00:00Z remote evidence check: check-json: "run-1"; verdict: pending; detail-json: waiting']
]) test(`collector makes ${name} invalid`, async () => {
  assert.equal(await observed(line), "invalid");
});
