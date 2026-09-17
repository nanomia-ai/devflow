---
summary: Defines Pantry Ledger as a Node 24 local CLI over a file-backed store with executable behavior tests and no Design stage.
read_when:
  - Read when changing runtime, storage seams, serialization, dependency direction, verification, or Design applicability.
---

# Architecture: Pantry Ledger

Pantry Ledger runs on Node.js 24 or later as one local command-line process. Commands depend inward
on Expense and Category business meaning; the file-backed store and CSV serializer are adapters.
Opaque storage identifiers remain internal, while portable rows expose only user-meaningful fields.

The default verification channel is `node --test`, including maintained category-deletion and
export-row behavior. Those tests prove current executable behavior, not which contradictory product
promise the owner should choose. Design does not apply because there is no user interface.
