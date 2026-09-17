---
summary: Defines Ledger Pocket as one local CLI with storage-local identifiers and executable import/export tests.
read_when:
  - Read when changing the CLI boundary, local persistence, storage identifiers, or verification channels.
---

# Architecture: Ledger Pocket

Ledger Pocket is one local command-line process over a file-backed repository. The repository may
use opaque identifiers internally, but those identifiers are storage-local and are not a public
contract. Commands depend inward on the Entries Domain; serialization adapters remain outside it.

Default verification uses executable Domain tests and command-level import/export round trips.
Design does not apply because the product has no user interface. No technical question is open.
