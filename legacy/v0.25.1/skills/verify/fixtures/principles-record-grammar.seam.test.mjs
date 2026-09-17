import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FORMATS } from "../spec.mjs";

const principlesSource = new URL("../../principles/scripts/project-state.mjs", import.meta.url);

test("reserved verification heads retain byte equality with the principles state owner", async () => {
  const source = await readFile(principlesSource);
  for (const format of Object.values(FORMATS)) {
    const emittedHead = `${format.head}:`;
    const expression = new RegExp(`"(${emittedHead.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})"`);
    const canonical = expression.exec(source.toString("utf8"))?.[1];
    assert.ok(canonical, `principles owns ${emittedHead}`);
    assert.deepEqual(Buffer.from(emittedHead, "utf8"), Buffer.from(canonical, "utf8"));
  }
});
