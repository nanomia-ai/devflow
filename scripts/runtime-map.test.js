"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const tool = path.join(root, "scripts", "runtime-map.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: "utf8" });
}

test("the runtime map projects every P2 package and writes nothing", () => {
  const before = fs.readdirSync(path.join(root, "docs")).sort();
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  const packages = fs.readdirSync(path.join(root, "skills"))
    .filter((name) => fs.existsSync(path.join(root, "skills", name, "spec.mjs"))).sort();
  for (const name of packages) {
    assert.match(result.stdout, new RegExp(`^## ${name}\\b`, "m"), `runtime map omits ${name}`);
  }
  assert.match(result.stdout, /^total: \d+ packages · \d+ stages · \d+ guards · \d+ declared roles$/m);
  assert.deepEqual(fs.readdirSync(path.join(root, "docs")).sort(), before, "the projection wrote into docs/");
});

test("the projection stays small enough to read on entry", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(Buffer.byteLength(result.stdout) <= 10 * 1024,
    `runtime map is ${Buffer.byteLength(result.stdout)} B; a projection over 10 KiB is not a map any more`);
});

test("every stage, guard and role in the projection comes from a spec", () => {
  const result = run(["--skill", "adopt"]);
  assert.equal(result.status, 0, result.stderr);
  const spec = fs.readFileSync(path.join(root, "skills", "adopt", "spec.mjs"), "utf8");
  for (const match of result.stdout.matchAll(/^  (?:stage|guard) ([a-z][\w-]*)/gm)) {
    assert.ok(spec.includes(match[1]), `adopt/spec.mjs does not contain ${match[1]}`);
  }
  assert.match(result.stdout, /^  role refuter/m, "adopt declares refuter and the projection lost it");
  assert.doesNotMatch(result.stdout, /^## (?!adopt)/m, "--skill did not bound the projection");
});

test("an unknown option and an unknown package both fail loudly", () => {
  const bad = run(["--nope"]);
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /unknown option/);
  const missing = run(["--skill", "there-is-no-such-package"]);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /no spec\.mjs/);
});
