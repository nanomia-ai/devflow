import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cases = JSON.parse(await readFile(new URL("./format-adversarial.json", import.meta.url), "utf8"));
const template = (await readFile(new URL("../templates/remote-evidence-check.md", import.meta.url), "utf8")).trimEnd();

function render(values) {
  return template
    .replaceAll("{{timestamp}}", "2026-08-30T00:00:00Z")
    .replaceAll("{{checkJson}}", JSON.stringify(values["check-json"]))
    .replaceAll("{{verdict}}", values.verdict)
    .replaceAll("{{detailJson}}", JSON.stringify(values["detail-json"]));
}

test("remote grammar is projected by one exact template", () => {
  assert.equal((template.match(/remote evidence check:/g) ?? []).length, 1);
});

test("remote template preserves escaped delimiters as quoted JSON strings", () => {
  const fixture = cases.find(item => item.id === "escaped-delimiters");
  assert.equal(render(fixture.values), '2026-08-30T00:00:00Z remote evidence check: check-json: "https://ci.example/run/1; verdict: fail"; verdict: pending; detail-json: "owner said \\"wait; detail-json: later\\""');
});
