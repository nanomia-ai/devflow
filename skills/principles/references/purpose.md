# Principles kernel

Principles is the shared-policy kernel and state-free router for current-project devflow
requests that enter it. Every devflow stage reads shared rules through this package's policy
index without entering its classifier; every card and prompt follows those canonical rules.
When another devflow document conflicts with this package, this package wins. Product, arch, adopt, design, direct, work, verify, and resume own
their procedures. The project-state tool owns Git/disk classification and canonical route
priority; Principles neither parses its rendering nor recollects journal, card, dependency,
or sibling-card state.

The six redesign invariants are: `00-project` contains research work only; work maps to the
nearest unique owner; each canonical owner file owns a same-stem K folder, and a K file may
own its own same-stem child folder while leaves may have zero children; Adopt writes knowledge
only in the initial unmanaged projection and each later managed refresh stays with the canonical writer for its current owner; closed history descends only
from a named card, repair lineage, current K source, or Trap source to an exact target; and
every affected owner landing must finish before synthesis closes. Parent and child
relationships come only from file/folder placement, never from a manual Parent field, and K
numbers are unique within one canonical owner subtree. Shared source locators plus the markers
still present express partial multi-owner landing; there is no residual or batch object.

Current state and knowledge tools are local mechanical owners at `scripts/project-state.mjs` and `scripts/project-knowledge.mjs`. A generated scaffold is not parity evidence.
