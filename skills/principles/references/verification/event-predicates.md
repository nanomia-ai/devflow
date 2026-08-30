# Verification event policy

## Verification event predicates

Automatic events arise only from the following keys and conditions in a current-format
verify.md. If the same key has a pending, awaiting-user-decision, routing, or completed
state, do not create it again.

| Role | Event key | Due when |
|---|---|---|
| Audit | `product` | tree-root verify.md has a product-layer verdict and Audit has no entry with that key |
| Audit | `post-failure through <largest source id among failure entries>` | the capability folder is `.done`, Failure history has at least one `failure:` entry, and Audit has no entry with that key |
| Retrospective | `first closure <capability number>` | the capability folder is `.done` and Retrospective has no entry with that key |
| Retrospective | `product` | tree-root verify.md has a product-layer verdict and Retrospective has no entry with that key |

A user-request event key is its journal request-line timestamp. For the same role and
target, if an unresolved request line or verify.md event timestamp already equals the
current UTC second, add one second until the value is unused and write that timestamp on
the new request line. Never give two requests for the same role and target the same key.

A verify.md missing any of the four revision fields is a pre-v0.9.21 record. Exclude it
from current failure routing, pass reuse, and automatic-event derivation; do not add its
missing revision fields merely for upgrade. When processing a user-request event against that record, add any
missing `## Audit` and `## Retrospective` sections with `- not run` in the same pending-
event commit. The next actual verification overwrites the record in current format while
preserving those new event sections. Legacy scalar `Audit:` and `Retrospective:` values
neither trigger nor suppress current events; their old content remains in git history.
