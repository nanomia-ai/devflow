#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const { test } = require("node:test");

const tool = path.join(__dirname, "project-knowledge.mjs");

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "devflow-knowledge-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function header(overrides = {}) {
  return {
    topic: "location-trust",
    what: "\uC8FC\uC18C\uC640 \uC88C\uD45C\uC758 \uC2E0\uB8B0 \uC0AC\uB2E4\uB9AC",
    when: "\uC8FC\uC18C\uB098 \uC88C\uD45C \uCDE8\uB4DD\uC744 \uBC14\uAFC0 \uB54C",
    about: "\uB4F1\uB85D, \uC9C0\uC624\uCF54\uB529, \uC704\uCE58 \uC2E0\uB8B0\uB3C4",
    ...overrides,
  };
}

function body(extra = "", value = header()) {
  return [
    `# ${value.what} · ${value.when}`,
    `about: ${value.about}`,
    "",
    extra,
    "",
    "## Concept model",
    "- \uD604\uC7AC \uB3D9\uC791\uC744 \uD655\uC778\uD588\uB2E4.",
    "Source basis: [\"docs/source.md:1-2\"]",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

function writeSource(root, text = "source one\nsource two\nsource three\n") {
  const target = path.join(root, "docs", "source.md");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, "utf8");
  return target;
}

function writeCapsule(root, value = header(), content = body(), number = "006", directory = "02-property") {
  if (!fs.existsSync(path.join(root, "docs", "source.md"))) writeSource(root);
  const base = path.join(root, ".devflow", "project", "capabilities");
  fs.mkdirSync(path.join(base, directory), { recursive: true });
  fs.writeFileSync(path.join(base, `${directory}.md`), `# ${directory}\n`, "utf8");
  const target = path.join(base, directory, `K-${number}-${value.topic}.md`);
  fs.writeFileSync(target, `${content}\n`, "utf8");
  return target;
}

function writeOwnerCapsule(root, owner, { parents = [], number = "006", value = header(), content = body() } = {}) {
  if (!fs.existsSync(path.join(root, "docs", "source.md"))) writeSource(root);
  const project = path.join(root, ".devflow", "project");
  const base = owner === "capability" ? path.join(project, "capabilities", "02-property") : path.join(project, owner);
  const entrance = owner === "capability" ? path.join(project, "capabilities", "02-property.md") : path.join(project, `${owner}.md`);
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(entrance, `# ${owner}\n`, "utf8");
  let directory = base;
  for (const parent of parents) {
    const topic = parent.slice("K-000-".length);
    fs.writeFileSync(path.join(directory, `${parent}.md`), `${body("", header({ topic }))}\n`, "utf8");
    directory = path.join(directory, parent);
    fs.mkdirSync(directory, { recursive: true });
  }
  const target = path.join(directory, `K-${number}-${value.topic}.md`);
  fs.writeFileSync(target, `${content}\n`, "utf8");
  return target;
}

function run(root, command, ...args) {
  return spawnSync(process.execPath, [tool, command, ...args, "--root", root], {
    cwd: root,
    encoding: "utf8",
  });
}

function assertOk(result) {
  assert.equal(result.status, 0, result.stderr);
}

test("both plugin manifest surfaces resolve the shared knowledge tool", () => {
  const root = path.join(__dirname, "..");
  const claudePath = path.join(root, ".claude-plugin", "..", "scripts", "project-knowledge.mjs");
  const codexPath = path.join(root, ".codex-plugin", "..", "scripts", "project-knowledge.mjs");
  assert.equal(fs.realpathSync(claudePath), fs.realpathSync(codexPath));
  assert.equal(fs.realpathSync(claudePath), fs.realpathSync(tool));
});

test("missing capsule folders are valid empty states", (t) => {
  const root = fixture(t);
  for (const command of ["project", "validate"]) {
    const result = run(root, command);
    assertOk(result);
    assert.match(result.stdout, /(?:capsules|valid)=0/);
  }
});

test("project emits the first two lines, costs, and marker counts without bodies and never writes", (t) => {
  const root = fixture(t);
  writeSource(root);
  const target = writeCapsule(root, header(), body(
    "\uC8FC\uC18C\uB97C \uBCF4\uC874\uD55C\uB2E4. (synthesis@docs/source.md:1-2: \uB450 \uADFC\uAC70\uB97C \uD569\uCCD0 \uBC29\uD5A5\uC744 \uC124\uBA85\uD55C\uB2E4.)\n"
    + "\uC2E4\uD589\uC740 \uB2E4\uB974\uB2E4. (code@docs/source.md:2: \uD604\uC7AC \uB3D9\uC791\uB9CC \uD655\uC778\uD588\uB2E4.)\n"
    + "\uC774\uC720\uB294 \uBE44\uC5B4 \uC788\uB2E4. (conjecture: \uB2E4\uC74C \uAC80\uC99D \uC804\uC5D0\uB294 \uC0AC\uC2E4\uB85C \uC4F0\uC9C0 \uC54A\uB294\uB2E4.)\n"
    + "[dispute C-006@docs/source.md:1,docs/source.md:2: \uC6D0\uBB38 \uB450 \uC11C\uC220\uC774 \uCDA9\uB3CC\uD558\uBBC0\uB85C \uACE0\uB974\uC9C0 \uC54A\uB294\uB2E4.]",
  ));
  const before = fs.readFileSync(target);
  const result = run(root, "project", "--capability", "2");
  assertOk(result);
  assert.match(result.stdout, /project: capsules=1 bodies=0/);
  assert.doesNotMatch(result.stdout, /^body:/m);
  const projected = JSON.parse(/^projection: (.+)$/m.exec(result.stdout)[1]);
  assert.equal(projected.path, ".devflow/project/capabilities/02-property/K-006-location-trust.md");
  assert.match(projected.heading, /^# .* · .*$/);
  assert.equal(projected.about, "\uB4F1\uB85D, \uC9C0\uC624\uCF54\uB529, \uC704\uCE58 \uC2E0\uB8B0\uB3C4");
  assert.deepEqual(projected.markers, { synthesis: 1, code: 1, conjecture: 1, dispute: 1 });
  assert.deepEqual(projected.disputes, ["C-006"]);
  assert.deepEqual(fs.readFileSync(target), before);
});

test("select carries the same last-changed date the index promises", (t) => {
  // The canon says the index emits `changed` beside the first two lines. select shows the
  // same candidates when the opening budget is exceeded, so it owes the same field — a null
  // there would make "open the one that changed yesterday" impossible at the moment it matters.
  const root = fixture(t);
  writeSource(root);
  const target = writeCapsule(root, header(), body("The address is preserved."));
  const relative = path.relative(root, target).split(path.sep).join("/");
  const result = run(root, "select", "--path", relative);
  assertOk(result);
  const entry = JSON.parse(result.stdout.match(/^candidate: (.+)$/m)[1]);
  assert.ok("changed" in entry, "select candidate must carry the changed field");
});

test("the canonical call takes the zero-padded number the canon writes on disk", (t) => {
  // The canon numbers the foundation `01` and the first capability `02`, and the capsule
  // folder carries that exact string. A session reading `02-property.md` passes `02`.
  const root = fixture(t);
  writeSource(root);
  writeCapsule(root, header(), body("The address is preserved."));
  for (const value of ["2", "02", "002"]) {
    const result = run(root, "project", "--capability", value);
    assertOk(result);
    assert.match(result.stdout, /project: capsules=1 bodies=0/, `--capability ${value}`);
  }
  for (const value of ["0", "00", "abc", "-1"]) {
    const result = run(root, "project", "--capability", value);
    assert.notEqual(result.status, 0, `--capability ${value} must be rejected`);
  }
});

test("validate rejects headers outside the two-line prose format", (t) => {
  const malformedRoot = fixture(t);
  const malformedDir = path.join(malformedRoot, ".devflow", "project", "capabilities", "02-property");
  fs.mkdirSync(malformedDir, { recursive: true });
  fs.writeFileSync(path.join(malformedRoot, ".devflow", "project", "capabilities", "02-property.md"), "# P\n");
  fs.writeFileSync(path.join(malformedDir, "K-006-location-trust.md"), "knowledge: {no}\n# X\n");
  const malformed = run(malformedRoot, "validate");
  assert.equal(malformed.status, 1);
  assert.match(malformed.stderr, /capsule header format anomaly/);

  const orderRoot = fixture(t);
  writeCapsule(orderRoot, header(), body().replace(/^about: /m, "about "));
  const order = run(orderRoot, "validate");
  assert.equal(order.status, 1);
  assert.match(order.stderr, /capsule header format anomaly/);
});

test("the sibling capability entrance remains a structural requirement", (t) => {
  const entranceRoot = fixture(t);
  const target = writeCapsule(entranceRoot);
  fs.rmSync(path.join(path.dirname(path.dirname(target)), "02-property.md"));
  const entrance = run(entranceRoot, "validate");
  assert.equal(entrance.status, 1);
  assert.match(entrance.stderr, /sibling capability entrance .* is missing/);
});

test("the 120-line authoring target warns but does not reject", (t) => {
  const root = fixture(t);
  const filler = Array.from({ length: 114 }, (_, index) => `\uC790\uC720 \uC0B0\uBB38 ${index}`).join("\n");
  writeCapsule(root, header(), body(filler));
  const result = run(root, "validate");
  assertOk(result);
  assert.match(result.stderr, /exceeds the 120-line soft target/);
  assert.match(result.stdout, /warnings=1/);
});

test("insertion parsing ignores code examples and permits nested natural prose", (t) => {
  const root = fixture(t);
  writeSource(root);
  writeCapsule(root, header(), body([
    "\uC2E4\uC81C \uD45C\uC2DC\uB2E4. (synthesis@docs/source.md:1: \uB9E5\uB77D(\uC8FC\uC18C\uC640 \uC88C\uD45C)\uC744 \uD568\uAED8 \uC124\uBA85\uD55C\uB2E4.)",
    "`(\uC694\uC57D@\uC5C6\uB294.md:1: \uC608\uC2DC)`\uB294 \uCF54\uB4DC\uB77C \uAC80\uC0AC\uD558\uC9C0 \uC54A\uB294\uB2E4.",
    "```text",
    "[dispute C-999@\uC5C6\uB294.md:1,\uC5C6\uB294.md:2: \uBB38\uBC95 \uC608\uC2DC]",
    "```",
  ].join("\n")));
  const result = run(root, "validate");
  assertOk(result);
  assert.match(result.stdout, /markers=1 disputes=0/);
});

test("closed insertion vocabulary and source-confidence rules reject malformed markers", (t) => {
  const cases = [
    ["(\uC694\uC57D@docs/source.md:1: \uB2EB\uD78C \uC5B4\uD718 \uBC16\uC774\uB2E4.)", /unknown insertion head \uC694\uC57D/],
    ["(\uCD94\uCE21: \uADFC\uAC70\uB294 \uC5C6\uB2E4.)", /unknown insertion head \uCD94\uCE21/],
    ["(guess: no evidence.)", /unknown insertion head guess/],
    ["(synthesis: \uC88C\uD45C\uAC00 \uC5C6\uB2E4.)", /malformed synthesis insertion/],
    ["(conjecture@docs/source.md:1: \uCD94\uC815\uC740 \uC88C\uD45C\uB97C \uC778\uC6A9\uD558\uC9C0 \uC54A\uB294\uB2E4.)", /conjecture must not cite/],
    ["[dispute C-006@docs/source.md:1: \uD55C \uD314\uBFD0\uC774\uB2E4.]", /expected 2 coordinate/],
    ["[dispute C-006@docs/source.md:1,docs/source.md:1: \uAC19\uC740 \uC88C\uD45C\uB2E4.]", /arms must use different/],
    ["(\uC885\uD569@docs/source.md:1: \uD55C\uAD6D\uC5B4 \uBA38\uB9AC\uB9D0\uC740 \uAE08\uC9C0.)", /unknown insertion head \uC885\uD569/],
  ];
  for (const [text, expected] of cases) {
    const root = fixture(t);
    writeSource(root);
    writeCapsule(root, header(), body(text));
    const result = run(root, "validate");
    assert.equal(result.status, 1, text);
    assert.match(result.stderr, expected);
  }
});

test("dispute insertions may span lines without compressing both arms", (t) => {
  const root = fixture(t);
  writeSource(root);
  writeCapsule(root, header(), body([
    "[dispute C-006@docs/source.md:1,docs/source.md:2: \uCCAB \uBC88\uC9F8 \uC11C\uC220\uC740 \uC774\uB807\uB2E4.",
    "\uB450 \uBC88\uC9F8 \uC11C\uC220\uC740 \uB2E4\uB974\uB2E4.",
    "\uC18C\uC720\uC790 \uACB0\uC815 \uC804\uC5D0\uB294 \uD574\uC18C\uD558\uC9C0 \uC54A\uB294\uB2E4.]",
  ].join("\n")));
  const result = run(root, "validate");
  assertOk(result);
  assert.match(result.stdout, /markers=1 disputes=1/);
});

test("Source basis requires at least one real coordinate", (t) => {
  const cases = [
    ["Source basis: [\"docs/source.md:1-2\"]", null],
    ["Source basis: []", /non-empty JSON coordinate array/],
    ["Source basis: [\"docs/source.md\"]", /coordinate must be path:line-range/],
    ["Source basis: [\"missing/source.md:1\"]", /coordinate path does not exist/],
  ];
  for (const [basis, expected] of cases) {
    const root = fixture(t);
    writeCapsule(root, header(), body().replace('Source basis: ["docs/source.md:1-2"]', basis));
    const result = run(root, "validate");
    if (expected === null) assertOk(result);
    else {
      assert.equal(result.status, 1, basis);
      assert.match(result.stderr, expected);
    }
  }
});

test("coordinates must resolve to current or historical source lines", (t) => {
  const currentRoot = fixture(t);
  writeSource(currentRoot);
  writeCapsule(currentRoot, header(), body("(code@docs/source.md:4: \uBC94\uC704\uB97C \uB118\uB294\uB2E4.)"));
  const current = run(currentRoot, "validate");
  assert.equal(current.status, 1);
  assert.match(current.stderr, /exceeds 3 source lines/);

  const historyRoot = fixture(t);
  writeSource(historyRoot, "old one\nold two\n");
  execFileSync("git", ["init", "-q"], { cwd: historyRoot });
  execFileSync("git", ["config", "core.autocrlf", "false"], { cwd: historyRoot });
  execFileSync("git", ["config", "user.name", "Fixture"], { cwd: historyRoot });
  execFileSync("git", ["config", "user.email", "fixture@example.test"], { cwd: historyRoot });
  execFileSync("git", ["add", "docs/source.md"], { cwd: historyRoot });
  execFileSync("git", ["commit", "-q", "-m", "source"], { cwd: historyRoot });
  const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: historyRoot, encoding: "utf8" }).trim();
  fs.writeFileSync(path.join(historyRoot, "docs", "source.md"), "new one\n", "utf8");
  const historicalBody = body(`(synthesis@docs/source.md@${revision}:2: \uC5ED\uC0AC \uC88C\uD45C\uAC00 \uB0A8\uB294\uB2E4.)`)
    .replace('Source basis: ["docs/source.md:1-2"]', `Source basis: ["docs/source.md@${revision}:1-2"]`);
  writeCapsule(historyRoot, header(), historicalBody);
  assertOk(run(historyRoot, "validate"));
});

test("duplicate capsule numbers and dispute ids are rejected", (t) => {
  const numberRoot = fixture(t);
  writeCapsule(numberRoot, header({ topic: "location-trust" }), body(), "006");
  writeCapsule(numberRoot, header({ topic: "other-topic" }), body(), "006");
  const duplicateNumber = run(numberRoot, "validate");
  assert.equal(duplicateNumber.status, 1);
  assert.match(duplicateNumber.stderr, /duplicate capsule number/);

  const disputeRoot = fixture(t);
  writeSource(disputeRoot);
  const conflict = "[dispute C-006@docs/source.md:1,docs/source.md:2: \uB450 \uD314\uC744 \uBCF4\uC874\uD55C\uB2E4.]";
  writeCapsule(disputeRoot, header(), body(conflict), "006");
  writeCapsule(disputeRoot, header({ topic: "other-topic" }), body(conflict), "007");
  const duplicateDispute = run(disputeRoot, "validate");
  assert.equal(duplicateDispute.status, 1);
  assert.match(duplicateDispute.stderr, /duplicate dispute id C-006/);
});

test("dispute ids are unique within a capability, not across capabilities", (t) => {
  const root = fixture(t);
  writeSource(root);
  const conflict = "[dispute C-001@docs/source.md:1,docs/source.md:2: \uB450 \uD314\uC744 \uBCF4\uC874\uD55C\uB2E4.]";
  writeCapsule(root, header(), body(conflict), "001", "02-property");
  writeCapsule(root, header(), body(conflict), "001", "03-other");
  assertOk(run(root, "validate"));

  writeCapsule(root, header({ topic: "second-topic" }), body(conflict), "002", "02-property");
  const duplicate = run(root, "validate");
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate dispute id C-001 in capability 2/);
});

test("select opens exact paths under both hard budgets", (t) => {
  const root = fixture(t);
  const target = writeCapsule(root);
  const relative = path.relative(root, target).split(path.sep).join("/");
  const result = run(root, "select", "--path", relative);
  assertOk(result);
  assert.match(result.stdout, /select: candidates=1 opened=1/);
  assert.match(result.stdout, new RegExp(`^body: ${relative.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  assert.match(result.stdout, /^# .* · .*$/m);
});

test("select validates only its exact path set", (t) => {
  const root = fixture(t);
  const target = writeCapsule(root);
  writeCapsule(
    root,
    header({ topic: "broken-neighbor" }),
    body().replace('Source basis: ["docs/source.md:1-2"]', 'Source basis: ["missing.md:1"]'),
    "007",
  );
  const relative = path.relative(root, target).split(path.sep).join("/");
  assertOk(run(root, "select", "--path", relative));
  const global = run(root, "validate");
  assert.equal(global.status, 1);
  assert.match(global.stderr, /coordinate path does not exist/);
});

test("disputes projects ids, coordinates, and both source contents without capsule bodies", (t) => {
  const root = fixture(t);
  writeSource(root, "first arm\nsecond arm\n");
  writeCapsule(root, header(), body(
    "[dispute C-006@docs/source.md:1,docs/source.md:2: \uC11C\uB85C \uB2E4\uB978 \uB450 \uC11C\uC220\uC774\uB2E4.]",
  ));
  const result = run(root, "disputes", "--capability", "2");
  assertOk(result);
  assert.match(result.stdout, /disputes: capsules=1 items=1 bodies=0/);
  assert.doesNotMatch(result.stdout, /^body:/m);
  const projected = JSON.parse(/^dispute: (.+)$/m.exec(result.stdout)[1]);
  assert.equal(projected.id, "C-006");
  assert.deepEqual(projected.coordinates, ["docs/source.md:1", "docs/source.md:2"]);
  assert.deepEqual(projected.arms, [
    { coordinate: "docs/source.md:1", content: "first arm" },
    { coordinate: "docs/source.md:2", content: "second arm" },
  ]);
  assert.match(projected.prose, /\uC11C\uB85C \uB2E4\uB978/);
});

test("a capability of 100 capsules stays selectable through the compact index", (t) => {
  const root = fixture(t);
  let first;
  for (let index = 1; index <= 100; index += 1) {
    const number = String(index).padStart(3, "0");
    const value = header({
      topic: `topic-${number}`,
      about: `projection budget fixture ${number} `.repeat(3).trim(),
    });
    const target = writeCapsule(
      root,
      value,
      body("", value),
      number,
    );
    first ??= path.relative(root, target).split(path.sep).join("/");
  }
  // Choosing a capsule needs its path and first line; dropping the rest keeps 100 selectable.
  const compact = run(root, "project", "--capability", "2");
  assertOk(compact);
  assert.match(compact.stdout, /capsules=100 bodies=0 form=compact index-bytes=\d+\/24576 emitted=100/);
  assert.equal((compact.stdout.match(/^projection:/gm) || []).length, 100);
  const entry = JSON.parse(compact.stdout.match(/^projection: (.+)$/m)[1]);
  assert.deepEqual(Object.keys(entry), ["path", "heading", "changed"]);

  const narrowed = run(root, "project", "--path", first);
  assertOk(narrowed);
  assert.match(narrowed.stdout, /capsules=1 .*form=full .*emitted=1/);
  assert.equal((narrowed.stdout.match(/^projection:/gm) || []).length, 1);
});

test("an index too large even compacted emits zero entries and asks for a narrower filter", (t) => {
  const root = fixture(t);
  const wide = "the situation that opens this capsule ".repeat(8);
  for (let index = 1; index <= 100; index += 1) {
    const number = String(index).padStart(3, "0");
    const value = header({ topic: `topic-${number}`, when: `${wide} ${number}` });
    writeCapsule(root, value, body("", value), number);
  }
  const blocked = run(root, "project", "--capability", "2");
  assert.equal(blocked.status, 3);
  assert.match(blocked.stdout, /form=compact index-bytes=\d+\/24576 emitted=0/);
  assert.doesNotMatch(blocked.stdout, /^projection:/m);
  assert.match(blocked.stderr, /index budget exceeded/);
});

test("the dispute index carries both arms and never degrades to the compact form", (t) => {
  const root = fixture(t);
  writeSource(root, "first source arm\nsecond source arm\nthird line\n");
  writeCapsule(root, header(), body(
    "[dispute C-006@docs/source.md:1,docs/source.md:2: the two statements diverge.]",
  ));
  const result = run(root, "disputes", "--capability", "2");
  assertOk(result);
  assert.match(result.stdout, /items=1 bodies=0 form=full/);
  const item = JSON.parse(result.stdout.match(/^dispute: (.+)$/m)[1]);
  assert.equal(item.id, "C-006");
  assert.deepEqual(item.coordinates, ["docs/source.md:1", "docs/source.md:2"]);
  assert.deepEqual(item.arms.map((arm) => arm.content), ["first source arm", "second source arm"]);
});

test("select emits zero bodies over 240 lines until explicitly approved", (t) => {
  const root = fixture(t);
  const paths = [];
  for (let index = 1; index <= 3; index += 1) {
    const content = body(Array.from({ length: 74 }, (_, line) => `\uBB38\uC7A5 ${index}-${line}`).join("\n"));
    const target = writeCapsule(root, header({ topic: `topic-${index}` }), content, String(index).padStart(3, "0"));
    paths.push(path.relative(root, target).split(path.sep).join("/"));
  }
  const args = paths.flatMap((item) => ["--path", item]);
  const blocked = run(root, "select", ...args);
  assert.equal(blocked.status, 3);
  assert.match(blocked.stdout, /opened=0/);
  assert.equal((blocked.stdout.match(/^candidate:/gm) || []).length, 3);
  assert.doesNotMatch(blocked.stdout, /^body:/m);
  assert.match(blocked.stderr, /opening budget exceeded/);

  const approved = run(root, "select", ...args, "--approved");
  assertOk(approved);
  assert.match(approved.stdout, /opened=3 .*approved=1/);
  assert.equal((approved.stdout.match(/^body:/gm) || []).length, 3);
});

test("select enforces the 24 KiB budget independently of line count", (t) => {
  const root = fixture(t);
  const huge = `\uD55C${"\uAC00".repeat(9000)}`;
  const target = writeCapsule(root, header(), body(huge));
  const relative = path.relative(root, target).split(path.sep).join("/");
  const result = run(root, "select", "--path", relative);
  assert.equal(result.status, 3);
  assert.match(result.stdout, /opened=0/);
  assert.doesNotMatch(result.stdout, /^body:/m);
});

test("invalid UTF-8 is rejected", (t) => {
  const invalidRoot = fixture(t);
  const target = writeCapsule(invalidRoot);
  fs.writeFileSync(target, Buffer.from([0xc3, 0x28]));
  const invalid = run(invalidRoot, "validate");
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /not valid UTF-8/);
});

test("CLI rejects missing selections, unknown options, and invalid roots", (t) => {
  const root = fixture(t);
  const missing = run(root, "select");
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /requires at least one --path/);
  const option = run(root, "project", "--mystery", "x");
  assert.equal(option.status, 1);
  assert.match(option.stderr, /unknown option/);
  const invalid = spawnSync(process.execPath, [tool, "validate", "--root", path.join(root, "missing")], { encoding: "utf8" });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /root is not a directory/);
});

test("a capability folder keeps the product's own capability name, and only its number is read", (t) => {
  // The canon takes the folder name from the capability document's filename, which itself comes
  // from the product.md capability name unchanged. A Korean-language project therefore has
  // `02-<Korean name>`; an ASCII-only parent rule skipped it with no error and reported zero
  // capsules, so knowledge sitting on disk reached nothing.
  for (const directory of ["02-\uACB0\uC81C", "03-order flow", "04-Billing"]) {
    const number = directory.slice(0, directory.indexOf("-"));
    const root = fixture(t);
    writeSource(root);
    writeCapsule(root, header(), body("The address is preserved."), "006", directory);
    const result = run(root, "project", "--capability", number);
    assertOk(result);
    assert.match(result.stdout, /project: capsules=1 bodies=0/, directory);
    const projected = JSON.parse(/^projection: (.+)$/m.exec(result.stdout)[1]);
    assert.equal(projected.path, `.devflow/project/capabilities/${directory}/K-006-location-trust.md`);
  }
});

test("folders whose numbers compare equal as integers are one capability", (t) => {
  const root = fixture(t);
  writeSource(root);
  writeCapsule(root, header(), body("\uD558\uB098"), "006", "02-property");
  writeCapsule(root, header(), body("\uB458"), "007", "2-property-old");
  const both = run(root, "project", "--capability", "2");
  assertOk(both);
  assert.match(both.stdout, /project: capsules=2 bodies=0/);

  const clash = fixture(t);
  writeSource(clash);
  writeCapsule(clash, header(), body("\uD558\uB098"), "006", "02-property");
  writeCapsule(clash, header(), body("\uB458"), "006", "2-property-old");
  const duplicate = run(clash, "project", "--capability", "2");
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate capsule number/);
});

test("one capability's projection survives another capability's malformed capsule", (t) => {
  // `--capability` narrows the folder walk before any capsule is read, so a stale coordinate in
  // a capability this session never named leaves the named capability's index intact.
  const root = fixture(t);
  writeSource(root);
  writeCapsule(root, header(), body("\uD558\uB098"), "006", "02-property");
  writeCapsule(root, header(), body("\uB458").replace("docs/source.md:1-2", "docs/source.md:9999"),
    "006", "09-shipping");

  for (const command of ["project", "disputes"]) {
    const narrowed = run(root, command, "--capability", "2");
    assertOk(narrowed);
    assert.match(narrowed.stdout, /capsules=1/, command);
  }

  const owner = run(root, "project", "--capability", "9");
  assert.equal(owner.status, 1);
  assert.match(owner.stderr, /09-shipping[\s\S]*coordinate exceeds/);

  const global = run(root, "validate");
  assert.equal(global.status, 1);
  assert.match(global.stderr, /09-shipping[\s\S]*coordinate exceeds/);
});

// A1-A13: the recursive-K oracle keeps the old capability entrance while closing the new
// owner roots to product, arch, design, and capability documents.
test("A1 legacy flat capability capsules remain byte-compatible", (t) => {
  const root = fixture(t);
  writeCapsule(root);
  const result = run(root, "project", "--capability", "2");
  assertOk(result);
  assert.match(result.stdout, /project: capsules=1 bodies=0/);
});

test("A2 recursive K folders accept depths one through three", (t) => {
  const root = fixture(t);
  writeOwnerCapsule(root, "product", { parents: ["K-001-root", "K-002-branch"], number: "003" });
  const result = run(root, "validate");
  assertOk(result);
  assert.match(result.stdout, /valid=3/);
});

test("A3 --under projects, disputes, and validates direct children only", (t) => {
  const root = fixture(t);
  const leaf = writeOwnerCapsule(root, "product", { parents: ["K-001-root"], number: "002" });
  const owner = ".devflow/project/product.md";
  const node = ".devflow/project/product/K-001-root.md";
  for (const command of ["project", "disputes", "validate"]) {
    const top = run(root, command, "--under", owner);
    assertOk(top);
    assert.match(top.stdout, /(?:capsules|valid)=1/, command);
    assert.doesNotMatch(top.stdout, new RegExp(leaf.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), command);
    const child = run(root, command, "--under", node);
    assertOk(child);
    assert.match(child.stdout, /(?:capsules|valid)=1/, command);
  }
});

test("A4 K numbers are reusable across the four closed owners", (t) => {
  const root = fixture(t);
  for (const owner of ["product", "arch", "design", "capability"]) writeOwnerCapsule(root, owner, { number: "001" });
  assertOk(run(root, "validate"));
});

test("A5 duplicate K numbers in one owner subtree are rejected", (t) => {
  const root = fixture(t);
  writeOwnerCapsule(root, "product", { number: "001" });
  writeOwnerCapsule(root, "product", { parents: ["K-002-parent"], number: "001" });
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate capsule number/);
});

test("A6 a K folder without its same-stem parent is invalid", (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, ".devflow", "project", "product", "K-001-orphan"), { recursive: true });
  fs.writeFileSync(path.join(root, ".devflow", "project", "product.md"), "# product\n", "utf8");
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /same-stem parent .* is missing/);
});

test("A7 select retains an exact moved nested --path", (t) => {
  const root = fixture(t);
  const target = writeOwnerCapsule(root, "design", { parents: ["K-001-parent"], number: "002" });
  const relative = path.relative(root, target).split(path.sep).join("/");
  const result = run(root, "select", "--path", relative);
  assertOk(result);
  assert.match(result.stdout, new RegExp(`^body: ${relative.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
});

test("A8 recursive capsules still reject dangling source coordinates", (t) => {
  const root = fixture(t);
  const broken = body().replace("docs/source.md:1-2", "missing.md:1");
  writeOwnerCapsule(root, "arch", { parents: ["K-001-parent"], content: broken });
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /coordinate path does not exist/);
});

test("A9 recursive capsules retain the header grammar", (t) => {
  const root = fixture(t);
  writeOwnerCapsule(root, "design", { parents: ["K-001-parent"], content: "# malformed\n" });
  const result = run(root, "validate");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /capsule header format anomaly/);
});

test("A10 presence sees an arch-only artifact across HEAD and the working tree", (t) => {
  const root = repo(t);
  fs.writeFileSync(path.join(root, "seed.txt"), "seed\n", "utf8");
  commit(root, "seed");
  writeOwnerCapsule(root, "arch");
  assert.equal(presenceOf(root).value, "present");
  commit(root, "arch capsule");
  fs.rmSync(path.join(root, ".devflow", "project", "arch"), { recursive: true, force: true });
  assert.equal(presenceOf(root).value, "present");
});

test("A11 nested exact selections retain opening budgets", (t) => {
  const root = fixture(t);
  const paths = ["001", "002", "003"].map((number) => writeOwnerCapsule(root, "product", {
    parents: ["K-010-parent"], number, value: header({ topic: `nested-${number}` }),
    content: body(Array.from({ length: 74 }, (_, line) => `nested ${number}-${line}`).join("\n")),
  }));
  const result = run(root, "select", ...paths.map((item) => ["--path", path.relative(root, item).split(path.sep).join("/")]).flat());
  assert.equal(result.status, 3);
  assert.match(result.stdout, /opened=0/);
});

test("A12 one owner can hold one hundred direct children through the compact index", (t) => {
  const root = fixture(t);
  for (let index = 1; index <= 100; index += 1) {
    const number = String(index).padStart(3, "0");
    writeOwnerCapsule(root, "product", { number, value: header({ topic: `direct-${number}`, about: `direct ${number} `.repeat(4).trim() }) });
  }
  const result = run(root, "project", "--under", ".devflow/project/product.md");
  assertOk(result);
  assert.match(result.stdout, /capsules=100 bodies=0 form=compact/);
});

test("A13 direct --under leaves an untouched nested sibling corpus bounded", (t) => {
  const root = fixture(t);
  writeOwnerCapsule(root, "product", { number: "001" });
  const broken = writeOwnerCapsule(root, "product", { parents: ["K-002-sibling"], number: "003" });
  fs.writeFileSync(broken, "# malformed\n", "utf8");
  assertOk(run(root, "project", "--under", ".devflow/project/product.md"));
  const global = run(root, "validate");
  assert.equal(global.status, 1);
  assert.match(global.stderr, /capsule header format anomaly/);
});

// --- presence: the one predicate an entry skill may gate a canon section on -------------

function repo(t) {
  const root = fixture(t);
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "user.name", "Fixture"], { cwd: root });
  execFileSync("git", ["config", "user.email", "fixture@example.test"], { cwd: root });
  return root;
}

function commit(root, message = "state") {
  execFileSync("git", ["add", "-A"], { cwd: root });
  execFileSync("git", ["commit", "-q", "-m", message], { cwd: root });
}

function presenceOf(root) {
  const result = run(root, "presence");
  assertOk(result);
  const match = /capsuleArtifacts=(absent|present|unknown)/.exec(result.stdout);
  assert.ok(match, result.stdout);
  return { value: match[1], line: result.stdout.trim() };
}

test("presence answers absent only when no capsule artifact exists in HEAD or the working tree", (t) => {
  const root = repo(t);
  fs.mkdirSync(path.join(root, ".devflow", "project", "capabilities"), { recursive: true });
  fs.writeFileSync(path.join(root, "seed.txt"), "seed\n", "utf8");
  commit(root, "seed");
  assert.equal(presenceOf(root).value, "absent", "empty capabilities folder");

  // A capability document is a file beside the capsule folders; it is not a capsule artifact.
  fs.writeFileSync(path.join(root, ".devflow", "project", "capabilities", "02-property.md"), "# 02\n", "utf8");
  commit(root, "capability document");
  assert.equal(presenceOf(root).value, "absent", "capability document only");

  // The tool never opens a body: absent and present alike report bodies=0.
  assert.match(presenceOf(root).line, /bodies=0/);
});

test("presence reports present from the working tree alone and from HEAD alone", (t) => {
  const worktreeOnly = repo(t);
  fs.writeFileSync(path.join(worktreeOnly, "seed.txt"), "seed\n", "utf8");
  commit(worktreeOnly, "seed");
  writeCapsule(worktreeOnly);
  assert.equal(presenceOf(worktreeOnly).value, "present", "never committed, still real");

  const headOnly = repo(t);
  writeCapsule(headOnly);
  commit(headOnly, "capsule");
  fs.rmSync(path.join(headOnly, ".devflow", "project", "capabilities", "02-property"),
    { recursive: true, force: true });
  assert.equal(presenceOf(headOnly).value, "present", "deleted here, still in HEAD");
});

test("presence counts a capsule folder whose name the capability pattern rejects", (t) => {
  const root = repo(t);
  const base = path.join(root, ".devflow", "project", "capabilities", "property");
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(path.join(base, "K-001-settlement.md"), "# body\n", "utf8");
  commit(root, "odd folder");

  // This is the v0.18.4 scene: the projection walks past a folder it cannot name-match and
  // answers zero. presence must not inherit that confidence.
  const projected = run(root, "project");
  assertOk(projected);
  assert.match(projected.stdout, /capsules=0/, "project still reports zero over the skipped folder");
  assert.equal(presenceOf(root).value, "present", "presence sees the artifact project skipped");

  const empty = repo(t);
  fs.mkdirSync(path.join(empty, ".devflow", "project", "capabilities", "02-property"), { recursive: true });
  assert.equal(presenceOf(empty).value, "present", "an empty capsule folder is not proof of absence");
});

test("presence falls to unknown on every uncertainty, and unknown is not absent", (t) => {
  const notARepository = fixture(t);
  fs.mkdirSync(path.join(notARepository, ".devflow", "project", "capabilities"), { recursive: true });
  assert.equal(presenceOf(notARepository).value, "unknown", "no git history to read");

  const notADirectory = repo(t);
  fs.mkdirSync(path.join(notADirectory, ".devflow", "project"), { recursive: true });
  fs.writeFileSync(path.join(notADirectory, ".devflow", "project", "capabilities"), "x\n", "utf8");
  commit(notADirectory, "capabilities is a file");
  assert.equal(presenceOf(notADirectory).value, "unknown", "capabilities is not a directory");

  // An unborn HEAD is proof, not uncertainty: nothing has ever been committed.
  const unborn = repo(t);
  fs.mkdirSync(path.join(unborn, ".devflow", "project", "capabilities"), { recursive: true });
  assert.equal(presenceOf(unborn).value, "absent", "a repository with no commit holds no capsule");
});
