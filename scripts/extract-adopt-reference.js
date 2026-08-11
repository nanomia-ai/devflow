#!/usr/bin/env node

const fs = require("node:fs");

const [file, stage] = process.argv.slice(2);

if (!file || !stage || !["product", "arch"].includes(stage)) {
  process.stderr.write("usage: extract-adopt-reference.js <SKILL.md> <product|arch>\n");
  process.exit(2);
}

const source = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");

function range(startHeading, endHeading) {
  const start = source.indexOf(startHeading);
  const end = source.indexOf(endHeading, start + startHeading.length);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`missing or out-of-order reference boundary: ${startHeading} -> ${endHeading}`);
  }
  return source.slice(start, end).trimEnd();
}

let result;
if (stage === "product") {
  result = range("## Output — devflow/project/product.md", "## Gates");
} else {
  const verifyChannel = range(
    "### 5. Verify-channel decision — a pass-gate",
    "## Output — devflow/project/arch.md",
  );
  const outputs = range("## Output — devflow/project/arch.md", "On completion:");
  result = `${verifyChannel}\n\n${outputs}`;
}

process.stdout.write(`${result}\n`);
