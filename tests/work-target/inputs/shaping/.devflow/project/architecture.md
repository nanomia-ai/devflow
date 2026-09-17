---
summary: Relay Desk is one static HTML surface with a Node structural check and no runtime service or framework.
read_when:
  - Read when changing file boundaries, runtime dependencies, or the reproducible verification channel.
---

# Technical boundary

`src/status.html` is the complete review surface. Keep markup and local CSS in that file; add no
framework, package, build step, or network dependency. `test/status-card.test.mjs` is the focused
reproducible check and must use only Node built-ins.

Visual acceptance remains a user review signal. The structural test may prove required text and
semantic attributes are present, but it cannot substitute for visual judgment.

