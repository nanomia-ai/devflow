---
summary: Defines category organization and exposes the unresolved rule for deleting a referenced category.
read_when:
  - Read when changing category creation, rename, deletion, or its effect on expenses.
---

# Domain: Categories

Categories give household expenses user-visible organization and names used in portable backup.
Current executable behavior rejects deletion while any expense refers to the category. Maintained
user guidance instead says those expenses become `Uncategorized`; source evidence cannot determine
which promise should govern.

The owner must choose one rule. Until then, deletion of referenced categories is not canon-ready;
creation, rename, lookup, and portable category names are unaffected.
