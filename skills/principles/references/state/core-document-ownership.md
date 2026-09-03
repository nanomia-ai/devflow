# Core-document writer boundary

### Core document ownership

Core documents (`.devflow/project/*`) are modified **only through this procedure or by
re-running the owning skill** — never edited in passing during a task.
Target ownership is fixed: product owns product.md and glossary.md; arch owns arch.md,
code-style.md, and the legacy ADRs; design owns design.md; Adopt initially projects the whole
confirmed unmanaged knowledge surface, including arch.md `Existing records`; after that boundary,
direct owns the tree and task cards and verify owns verify.md. Adopt owns the capability design
zone only inside that atomic initial projection; Arch owns every managed refresh under
`.devflow/project/capabilities/`, and verify owns the verified zone
after creation. The same-numbered knowledge capsule folder belongs to the design-zone
writer, and the canonical baseline predicates govern its path, header, provenance marks,
and opening budget. Skills never delete, move, or edit the source documents a capsule was
processed from — disposition belongs to a person alone. The canonical baseline predicates
govern the initial empty verified
scaffold, the exact byte boundary,
the exact mechanical v0.10 migration, and the human-deletion exception.
The one narrow delegation is the existing product-writer route for `marker.glossary-term`:
Arch consumes only that confirmed payload and updates the glossary
definition and every known affected `Concepts:` through the two boundaries above. No other
observation, progress-log line, or card tag may edit glossary.md directly.
Fixed target ownership means ownership of rerunning the whole document; the current skill walking this table performs a one-line update named by the table.

A document still being produced by a running product, arch, design, or adopt session is
a draft until the user confirms it — reconcile a draft's contradictions by editing the
draft on the spot, not through the procedures above, and when an already-inherited upper
document must change, put that edit into the same confirmation batch. Derive and present
the whole confirmation batch in memory; before confirmation, change no core-document path.
When an interruption leaves an uncommitted diff on a core-document path, do not use partial
bytes as input or guess whether confirmation occurred: resume does not route to the next
stage, and the owning skill either rederives the whole batch from HEAD and current inputs,
obtains confirmation, and finishes the Layer 0 commit, or lets the user discard that diff.

Records outside devflow — the memory and task lists an execution environment injects
into a session, documents in the repository that are not devflow's — are claims, not
canon. This is not an instruction to seek them out — it applies only to what is already
in context. When such a record contradicts a confirmed devflow document, do not silently
pass over it — report it. Until confirmation, follow the devflow document; after
confirmation, fix the side that is wrong — a devflow document through the
discovery→update table's path; an outside record with no means to fix it, the report is
the end.
