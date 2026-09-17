# Canonical Verification Predicates

This document defines only the revision and event disk predicates shared by verify and
resume. Task-card interpretation follows the Canonical State Predicates read alongside
this companion.

## Verification revision predicates

- Product revision: output of `git hash-object .devflow/project/product.md`.
- Verification revision: give `git ls-tree -r -z --full-tree HEAD --` exactly
  `.devflow/project/arch.md`, `.devflow/project/code-style.md`, and
  `.devflow/project/glossary.md` when present. Pass its raw stdout bytes unchanged to the
  stdin of `git hash-object --stdin`.
- Code revision: output of `git log -1 --format=%H -- . ':(exclude).devflow/**'`; use `none`
  when it has no output.
- Capability revision: capability layer only. In HEAD, find exactly one folder whose path
  normalized by removing status suffixes equals the target capability-folder locator.
  Resolve every target `.done.` task card below that HEAD folder and every direct `Depends`
  card of those cards. Parse dependencies by the canonical state predicates. Give only the
  exact HEAD paths of those target and direct-dependency cards to
  `git ls-tree -r -z --full-tree HEAD --`, then hash by the Verification-revision method.
  Git performs path deduplication and tree ordering. If the folder, any target card, or any
  dependency does not resolve exactly, the value is `unresolved`.

For both tree-input revisions, never decode, reorder, or newline-convert Git's NUL-bearing
stdout. The state tool captures the first Git process's raw stdout and must pass the raw
stdout `Buffer` directly as the stdin of `git hash-object --stdin`. An equivalent native
binary pipe is permitted; the PowerShell object pipeline and shell text conversion are not.
