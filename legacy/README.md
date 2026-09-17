# Legacy snapshot

`v0.25.1/` is the frozen pre-vNext repository snapshot moved out of the active source tree before
vNext implementation began. Its directory name identifies the last shipped legacy behavior.

The snapshot preserves the tracked bytes from source commit
`3845b2135e66dc7ce01d46b087e23a06b1981314`. That source was ahead of the installed v0.25.1 cache:
it included the unshipped 0.26.0 maintenance-document revision, two new maintenance runtime-map
files, decision-index changes, and removal of the Korean Codex fallback. The skill package bodies
themselves matched the installed v0.25.1 cache after line-ending normalization.

This tree is read-only evidence. vNext source, build, tests, and runtime must not import it or use it
as a fallback. To undo the relocation before it is committed, move the snapshot's original paths
back to the repository root; Git also retains the complete pre-move tree at `HEAD`.
