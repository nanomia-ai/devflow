import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FORMATS as PRINCIPLES_FORMATS } from "../../principles/spec.mjs";

const template = (await readFile(new URL("../templates/knowledge-landing-pending.md", import.meta.url), "utf8")).trimEnd();
const stateSource = await readFile(new URL("../../principles/scripts/project-state.mjs", import.meta.url), "utf8");

test("knowledge marker producer and parser project the principles format owner", () => {
  const { kind, head, fields } = PRINCIPLES_FORMATS.knowledgeLandingPending;
  assert.deepEqual({ kind, head, fields }, {
    kind: "line",
    head: "knowledge landing pending",
    fields: {
      owner: "path",
      writer: ["arch", "adopt"],
      "source-json": "json",
    },
  });
  assert.equal(
    template,
    "{{timestamp}} knowledge landing pending: owner: {{owner}}; writer: {{writer}}; source-json: {{sourceJson}}",
  );
  assert.equal(
    stateSource.includes(String.raw`/^(?<owner>[^;]+); writer: (?<writer>arch|adopt); source-json: (?<sourceJson>[^\r\n]+)$/`),
    true,
    "project-state must consume the same field order and writer domain",
  );
});

test("knowledge marker source remains a JSON string, not bare prose or an object", () => {
  const rendered = template
    .replace("{{timestamp}}", "2026-08-30T00:00:00Z")
    .replace("{{owner}}", "devflow/project/capabilities/01-face.md")
    .replace("{{writer}}", "arch")
    .replace("{{sourceJson}}", JSON.stringify("devflow/tree/01-face/01.1.done.md@0123456789012345678901234567890123456789"));
  assert.equal(
    rendered,
    "2026-08-30T00:00:00Z knowledge landing pending: owner: devflow/project/capabilities/01-face.md; writer: arch; source-json: \"devflow/tree/01-face/01.1.done.md@0123456789012345678901234567890123456789\"",
  );
});
