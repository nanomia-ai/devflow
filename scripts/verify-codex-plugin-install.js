#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function normalizeLocalPath(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  let candidate = value.replace(/^\\\\\?\\/, "");
  candidate = path.resolve(candidate);
  try {
    candidate = fs.realpathSync.native(candidate);
  } catch {
    // A malformed or stale listing must still compare deterministically and fail equality.
  }
  candidate = candidate.replace(/[\\/]+$/, "");
  return process.platform === "win32" ? candidate.toLowerCase() : candidate;
}

function isExactDevflowInstall(manifest, listing, expectedRoot) {
  const normalizedRoot = normalizeLocalPath(expectedRoot);
  if (!manifest || typeof manifest.version !== "string" || !Array.isArray(listing?.installed)
      || !normalizedRoot) {
    return false;
  }
  const matches = listing.installed.filter((entry) =>
    entry?.pluginId === "devflow@nanomia"
    && entry.name === "devflow"
    && entry.marketplaceName === "nanomia");
  return matches.length === 1
    && matches[0].installed === true
    && matches[0].enabled === true
    && matches[0].version === manifest.version
    && matches[0].source?.source === "local"
    && matches[0].marketplaceSource?.sourceType === "local"
    && normalizeLocalPath(matches[0].source?.path) === normalizedRoot
    && normalizeLocalPath(matches[0].marketplaceSource?.source) === normalizedRoot;
}

function parseJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

if (require.main === module) {
  const [, , manifestPath, expectedRoot, listingPath] = process.argv;
  if (!manifestPath || !expectedRoot) process.exit(2);
  try {
    const manifest = parseJsonFile(manifestPath);
    const listing = listingPath
      ? parseJsonFile(listingPath)
      : JSON.parse(fs.readFileSync(0, "utf8").replace(/^\uFEFF/, ""));
    process.exit(isExactDevflowInstall(manifest, listing, expectedRoot) ? 0 : 1);
  } catch {
    process.exit(1);
  }
}

module.exports = { isExactDevflowInstall };
