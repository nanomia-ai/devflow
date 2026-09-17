# Project knowledge publication

Devflow project documents are current knowledge interfaces, not activity records. Give every
Markdown file this routing header:

```yaml
---
summary: <the question this document currently answers and its present conclusion>
read_when:
  - <a concrete question or condition that makes this document relevant>
---
```

Make each document self-contained for its one question, keep the body in the present tense, and put
each fact in one canonical path. Separate observations, interpretations, unresolved questions, and
the conditions that would resolve them; do not save dialogue, drafting history, or a second summary
of another document.

`.devflow/index.md` is the always-read map. It gives a one-line project orientation, routes concrete
questions to canonical parents, names the bounded immediate artifact globs used for resumption, and
explains how readiness is derived from the foundation documents. It does not repeat their detailed
knowledge or enumerate active artifact IDs.

Split a conditional child only when a reader can choose it from the current question plus the
parent route before opening the child, the child has one independent question and change reason,
and the avoided reading or collision cost exceeds the extra route. Otherwise keep the knowledge in
the parent. Update a parent route and its child's header together.
