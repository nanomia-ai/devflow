# Canonical journal and progress grammar

This canonical projection presents the meaning owned by [Journal grammar](../references/state/journal-grammar.md), including forms that P2's line DSL cannot parse when a top-level JSON string precedes another field. Render every line byte-for-byte; `project-state.mjs` is the deterministic consumer and rejects malformed, reordered, duplicate, missing, bare, and CRLF forms.

```text
YYYY-MM-DDTHH:MM:SSZ layer opening: parent: <.devflow/tree or folder path with status suffixes removed>; children: <number+number>; source-json: <JSON string containing the exact durable source locator>
YYYY-MM-DDTHH:MM:SSZ re-split pending: folder: <direct parent folder path with status suffixes removed>; stale: <number+number>; source: <.devflow/project file path>#<heading>
YYYY-MM-DDTHH:MM:SSZ maintenance routing pending: request-json: <JSON string containing the whole user request>
YYYY-MM-DDTHH:MM:SSZ audit requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ retrospective requested: <capability number|product>
YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string containing the whole confirmed statement>; card-json: <JSON string containing the whole task-card path>; code-json: <JSON array of the exact code paths>
YYYY-MM-DDTHH:MM:SSZ evidence-wait: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
YYYY-MM-DDTHH:MM:SSZ evidence-finalizing: card-json: <JSON string containing the full task-card path>; checkpoint: <NN.N wip: evidence-wait commit hash>; check-json: <JSON string containing the exact remote-result command or URL>
YYYY-MM-DDTHH:MM:SSZ remote evidence check: check-json: <JSON string containing the exact remote-result command or URL>; verdict: unrun | pass | fail | pending | inaccessible | no-verdict; detail-json: <JSON string containing result detail>
YYYY-MM-DDTHH:MM:SSZ carry: <a fact that could make the next card in this depth-1 unit wrong | none>
```

The short capability-note form remains the `capabilityNote` FORMAT. JSON-string tokens preserve escaped quotes, semicolons, Unicode, and escaped newlines; do not downgrade them to objects, lists, or prose.
