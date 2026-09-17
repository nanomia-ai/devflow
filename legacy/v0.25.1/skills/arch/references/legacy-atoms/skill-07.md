# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0062 — migration:SKILL.md:243-246

Source hash: sha256:7ffed2cbe5fc4fa4f307d0a343dc44f8c1f93e71f463810d1de3440e9947268c

```
① hard to reverse  ② non-obvious enough that a future reader would wonder  ③ real alternatives were examined
(e.g., JWT instead of sessions for auth = passes / library A instead of B = fails)
```

## migration-a0063 — migration:SKILL.md:248-251

Source hash: sha256:74f1b325a1a96b8c92a083d031ec5796786ec6a1c68a1510332fafc6e626dceb

A decision below the three conditions makes no ADR — write the choice and its ground on one
line in the arch.md section where that decision lives, and leave each discarded alternative
as a ✘ line in the same section. When the ground is a number, attach the execution
conditions under which it is true and the command that measures it again on the same line.

## migration-a0064 — migration:SKILL.md:253-253

Source hash: sha256:c035689e7b1331d373e4b8e1852ab81f141c23a88fd4581287877409cdd29fa0

## Output 2 — devflow/project/code-style.md

## migration-a0065 — migration:SKILL.md:255-257

Source hash: sha256:ff0f8f4a4ae6f85dace6dbc039c7bfea1013070505928eaaf1a10d7334d1bebe

Where the project-specific decisions created by the selected stack get written down. **Every entry
states "what we prioritize" — never "do it this way."** The implementer decides the
method. Cap: 1 page.

## migration-a0066 — migration:SKILL.md:259-281

Source hash: sha256:b883051ab7d38a0f5f249afbe0c86d0a523bab4a2ab9273dbc2d0a9ec11b883e

```markdown
# Code Style

## Values                        <!-- present these 7 as defaults; curate to fit the project -->
- Few deep modules > many shallow helpers.
  A good module is one whose deletion scatters complexity onto its callers
- Return results > mutate state. Prefer code where the same input yields the same output
- Explicit beats magic. A connection not written in code does not exist
- Tests verify public-interface behavior like a spec. Never mock internals
- Never swallow errors. Handle them or throw them upward
- Delete dead code. Commented-out code is remembered by git
- Comments say "why" only. The code says "what"

## Project choices               <!-- only decisions the model cannot know -->
- (e.g.) validation: zod / errors: Result type, no throw / HTTP: shared/http.ts only / time: UTC

## Trust boundary
- Posture: strict | standard | minimal    <!-- the project's nature sets the dial -->
- Boundary list: <points where external input enters>. Input crossing a boundary is
  treated as hostile

## Non-goals                     <!-- this project's 2–3 YAGNI declarations -->
```
