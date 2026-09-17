#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { removeLegacyDevflowHook } = require("./remove-legacy-codex-hook.js");

test("removes every legacy devflow group and preserves other SessionStart hooks", () => {
  const other = { hooks: [{ type: "command", command: "node other/session-start.js" }] };
  const oldHook = (command) => ({
    hooks: [{
      type: "command",
      command,
      timeout: 15,
      statusMessage: "Loading devflow state",
    }],
  });
  const root = {
    hooks: {
      SessionStart: [
        other,
        oldHook('node "C:/plugins/devflow/scripts/session-start.js"'),
        oldHook('node "C:/plugins/nano-devflow/scripts/session-start.js"'),
        oldHook('node "C:/tools/renamed-clone/scripts/session-start.js"'),
      ],
      Stop: [{ hooks: [{ type: "command", command: "node stop.js" }] }],
    },
  };

  assert.equal(removeLegacyDevflowHook(root), 3);
  assert.deepEqual(root.hooks.SessionStart, [other]);
  assert.equal(root.hooks.Stop.length, 1);
});

test("removes only the predecessor hook from a mixed group", () => {
  const otherHook = { type: "command", command: "node other.js" };
  const legacyHook = {
    type: "command",
    command: 'node "C:/tools/renamed-clone/scripts/session-start.js"',
    timeout: 15,
    statusMessage: "Loading devflow state",
  };
  const root = { hooks: { SessionStart: [{ matcher: "startup", hooks: [legacyHook, otherHook] }] } };
  assert.equal(removeLegacyDevflowHook(root), 1);
  assert.deepEqual(root.hooks.SessionStart, [{ matcher: "startup", hooks: [otherHook] }]);
});

test("matches a double-quoted predecessor path containing an apostrophe", () => {
  const root = {
    hooks: {
      SessionStart: [{
        hooks: [{
          type: "command",
          command: "node \"C:/Users/O'Brien/renamed/scripts/session-start.js\"",
          timeout: 15,
          statusMessage: "Loading devflow state",
        }],
      }],
    },
  };

  assert.equal(removeLegacyDevflowHook(root), 1);
  assert.equal(root.hooks.SessionStart, undefined);
});

test("matches single-quoted and unquoted predecessor commands", () => {
  for (const command of [
    "node 'C:/plugins/devflow/scripts/session-start.js'",
    "node C:/plugins/devflow/scripts/session-start.js",
  ]) {
    const root = {
      hooks: {
        SessionStart: [{
          hooks: [{
            type: "command",
            command,
            timeout: 15,
            statusMessage: "Loading devflow state",
          }],
        }],
      },
    };

    assert.equal(removeLegacyDevflowHook(root), 1, command);
    assert.equal(root.hooks.SessionStart, undefined, command);
  }
});

test("removes a predecessor registered under the nano-devflow status message", () => {
  const root = {
    hooks: {
      SessionStart: [{
        hooks: [{
          type: "command",
          command: 'node "C:/plugins/nano-devflow/scripts/session-start.js"',
          timeout: 15,
          statusMessage: "Loading nano-devflow state",
        }],
      }],
    },
  };

  assert.equal(removeLegacyDevflowHook(root), 1);
  assert.equal(root.hooks.SessionStart, undefined);
});

test("preserves similarly named hooks that lack the predecessor's exact shape", () => {
  const custom = {
    hooks: [{
      type: "command",
      command: 'node "C:/other-devflow/scripts/session-start.js"',
      timeout: 15,
      statusMessage: "Loading another tool",
    }],
  };
  const root = { hooks: { SessionStart: [custom] } };
  assert.equal(removeLegacyDevflowHook(root), 0);
  assert.deepEqual(root.hooks.SessionStart, [custom]);
});

test("leaves documents without a matching legacy group unchanged", () => {
  const root = { hooks: { SessionStart: [{ hooks: [{ command: "node other.js" }] }] } };
  const before = JSON.stringify(root);
  assert.equal(removeLegacyDevflowHook(root), 0);
  assert.equal(JSON.stringify(root), before);
});
