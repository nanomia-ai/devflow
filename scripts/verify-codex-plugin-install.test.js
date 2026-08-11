#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { test } = require("node:test");
const { isExactDevflowInstall } = require("./verify-codex-plugin-install.js");

const manifest = { version: "0.9.21" };
const expectedRoot = path.resolve("fixture-devflow");
const entry = {
  pluginId: "devflow@nanomia",
  name: "devflow",
  marketplaceName: "nanomia",
  version: "0.9.21",
  installed: true,
  enabled: true,
  source: { source: "local", path: expectedRoot },
  marketplaceSource: { sourceType: "local", source: expectedRoot },
};

test("accepts one installed, enabled devflow entry at the manifest version", () => {
  assert.equal(isExactDevflowInstall(manifest, { installed: [entry], available: [] }, expectedRoot), true);
});

test("rejects a marketplace listing that only says the plugin is available", () => {
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [],
    available: [{ ...entry, installed: false, enabled: false }],
  }, expectedRoot), false);
});

test("rejects disabled, stale-version, and duplicate installed entries", () => {
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [{ ...entry, enabled: false }],
  }, expectedRoot), false);
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [{ ...entry, version: "0.9.20" }],
  }, expectedRoot), false);
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [entry, { ...entry }],
  }, expectedRoot), false);
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [{ ...entry, pluginId: "devflow-copy@nanomia" }],
  }, expectedRoot), false);
});

test("rejects a stale or nonlocal source even when identity and version match", () => {
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [{ ...entry, source: { source: "local", path: `${expectedRoot}-stale` } }],
  }, expectedRoot), false);
  assert.equal(isExactDevflowInstall(manifest, {
    installed: [{ ...entry, marketplaceSource: { sourceType: "git", source: expectedRoot } }],
  }, expectedRoot), false);
});

test("rejects malformed list output", () => {
  assert.equal(isExactDevflowInstall(manifest, {}, expectedRoot), false);
  assert.equal(isExactDevflowInstall({}, { installed: [entry] }, expectedRoot), false);
  assert.equal(isExactDevflowInstall(manifest, { installed: [entry] }), false);
});
