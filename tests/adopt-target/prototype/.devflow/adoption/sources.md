---
summary: Accounts for all five maintained Pantry Ledger source paths with zero uncovered paths.
read_when:
  - Read when checking adoption coverage, authority, target homes, or source disposition.
---

# Maintained source accounting

The maintained input universe is `README.md`, `docs/operations.md`, `package.json`, `src/store.js`,
and `test/store.test.js`. `.git/**` and `.agents/**` are environment rather than maintained project
source. Uncovered maintained paths: **0**.

| Group | Include | Exclude | Nature and authority | Knowledge sought | Target and disposition |
|---|---|---|---|---|---|
| Project overview | `README.md` | all other maintained paths | Maintained intent prose; authoritative for audience and explicit non-goals | problem, capabilities, boundary | Product; replace with a minimal noncanonical pointer after conflict resolution |
| Operations guide | `docs/operations.md` | all other maintained paths | Maintained user guidance; authoritative for export fields but contradicted on deletion | category and backup meaning | Expenses/Categories plus conflict; remove or mark noncanonical after resolution |
| Runtime declaration | `package.json` | all other maintained paths | Executable environment declaration | Node range and test command | Architecture; keep as live runtime evidence |
| Store implementation | `src/store.js` | all other maintained paths | Executed behavior, not product authority | persistence rules, identifier/export seams | Architecture and Domains; keep as live code evidence |
| Behavior tests | `test/store.test.js` | all other maintained paths | Executable maintained examples | deletion and export observations | Architecture verification plus conflict evidence; keep as live test evidence |

Path coverage does not settle the deletion meaning; `conflicts.md` owns that contradiction.
