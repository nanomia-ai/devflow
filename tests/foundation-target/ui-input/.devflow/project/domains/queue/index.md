---
summary: Defines the queued-request lifecycle, ordering signals, and assignment rules used by Ops Board.
read_when:
  - Read when changing request lifecycle, priority, assignment, or queue membership.
---

# Domain: Queue

Queue owns request membership, priority, assignment, and completion state. A submitted request enters
the queue unassigned. An authorized coordinator may change priority or assignment while it remains
open. Completion removes the request from the active queue without erasing its recorded outcome.

The active queue orders higher priority before lower priority; requests with equal priority retain
submission order. One request has at most one current assignment. Search, layout, keyboard behavior,
and browser presentation do not belong to this Domain.

Open business questions: none.
