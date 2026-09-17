import { readFile, writeFile } from "node:fs/promises";

const bodyPath = "body.md";
const specPath = "spec.mjs";
const ledgerPath = ".skill-rails/obligation-ledger.json";
const body = await readFile(bodyPath, "utf8");
const marker = "\n## why: coverage-review-disposition\n";
const [canonical, coverage] = body.split(marker, 2);
if (coverage === undefined) throw new Error("coverage sections are missing");
const sections = [...(`## why: coverage-review-disposition\n${coverage}`).matchAll(/^## why: (coverage-[a-z0-9-]+)\n([\s\S]*?)(?=^## why: |\z)/gm)];
const declarations = sections.map(([, id, content]) => `${id}: { value: ${JSON.stringify(content.trim())}, consumer: "migration:source-coverage" }`).join(", ");
let spec = await readFile(specPath, "utf8");
spec = spec.replace("export const DECLARATIONS = {", `export const DECLARATIONS = { ${declarations},`);
await writeFile(bodyPath, canonical.trimEnd() + "\n", "utf8");
await writeFile(specPath, spec, "utf8");
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
for (const atom of ledger.atoms) for (const key of ["targets", "evidence"]) atom[key] = (atom[key] ?? []).map(locator => locator.replace(/^body:why: (coverage-[a-z0-9-]+)$/, "spec:DECLARATIONS/$1"));
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
