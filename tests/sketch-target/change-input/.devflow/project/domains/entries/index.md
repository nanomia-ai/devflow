---
summary: Defines a Ledger Pocket entry and the user-visible fields that survive correction and backup.
read_when:
  - Read when changing entry identity, text, creation time, correction, or backup meaning.
---

# Domain: Entries

An entry has user-visible text and creation time. Correction replaces text while retaining the
entry's user-visible continuity. Backups preserve text, creation time, and correction meaning.
Storage keys are not Domain identity and have no user-visible meaning.

No business question is open.
