# Transition recovery

Preserve prepared, interrupted, layer-opening, event, source-id, folder-boundary, and digest records at their recorded scope. Producer recovery reads its named source before work, external recovery reports and stops, and a canonical snapshot is recomputed only after a real required commit.

When a digest marker has `resolution=unresolved` or `resolution=non-ancestor`, report it and re-anchor only with the user's confirmation. The default candidate is the full object ID in the first record of `git log -z --format=%H%x00%an%x00%ae <integration branch>` (NUL-terminated triples, newest first) whose author name and author email each equal my room owner.md `git:` values exactly: string equality on both, never a regex, a substring, or `--author`, and `none` when no record matches. This branch's HEAD is not a candidate even when it is mine and newest. Neither resolution yields a digest range, and silent full re-digest is forbidden.

`resolution=unavailable` is not a re-anchor: report the failed calculation and its `reason`, then wait or retry with the marker untouched. A marker merge conflict between my machines keeps the descendant hash; an unrelated hash follows the same confirmed re-anchor procedure.
