---
summary: Explores whether Ledger Pocket backup export should expose storage-local identifiers or only stable user fields.
read_when:
  - Read when deciding the active backup-export contract before Direct shapes the change.
---

# Change Sketch: backup export fields

Scope is `change`. The governing question is whether a portable backup should include the opaque
identifier used by the local repository or only the stable user-facing entry fields.

The user wants a readable backup that can later be imported without coupling it to one storage
file. Product promises preservation of user-meaningful entry data. Architecture says repository
identifiers are storage-local, but the maintained import and viewer consumers had not yet been
checked when this Sketch was interrupted.

The conclusion is ready when every maintained backup consumer is known either to require the
identifier or to reconstruct and display entries without it. Implementation, a new storage format,
and changes to entry meaning are outside this exploration.
