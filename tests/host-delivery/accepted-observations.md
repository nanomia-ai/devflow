# Accepted installed-host observations

This is the bounded evidence extract for case E in [`cases.md`](cases.md). The accepted cells used
the same `0.3.0` candidate tarball, byte-identical Git projects outside this repository, isolated
authenticated host homes, the same question, and no project-local skills. The fixture commit was
`59ac1f678f47da5b7b6d18155e375980783bb963`; its recorded safe point
`856e744ad1e546861127801c45cafaf91570df46` was reachable.

The candidate tarball had npm SHA-1 `00654308acf30ec9ad6e63dbce6ae206e0d4033c` and SHA-256
`5903cad306405d8527c09e1cdc37d26ef1827e647104b07f49f432f2c4bb24fa`. It still contained the
SessionStart candidate. The final hook-free tarball is recorded in [`README.md`](README.md).

## Accepted cells

| Cell | Observed model | Hook observation | Installed-skill evidence | Project files actually read | Canonical home and next action | Calls |
|---|---|---|---|---|---|---|
| Claude ON | `claude-opus-5`, medium | One `hook_success` event; its three transcript representations contain the same single emitted pointer | First action `Skill(devflow:resume)`; installed `references/project-gate.md` then read | `.devflow/index.md`, active Work `state.md`, its `spec.md` | `.devflow/work/W-incident-lifecycle-6f41b8c2/`; independently Verify the Node.js 24 acceptance criteria without expanding in-memory proof | Resume selection plus four Bash calls |
| Claude OFF | `claude-opus-5`, medium | No hook event or pointer | First action `Skill(devflow:resume)`; same installed gate reference | Same three project files | Same home and action | Resume selection plus four Bash calls |
| Codex ON | `gpt-5.6-sol`, medium | The Codex transcript does not expose hook output; the invocation enabled hooks and trusted them | First custom tool call read the isolated installed `skills/resume/SKILL.md`; second read its gate reference | Same three project files | Same home and action | Eight custom tool calls; zero calls before Resume read |
| Codex OFF | `gpt-5.6-sol`, medium | Hooks disabled by the host flag | First custom tool call read the isolated installed Resume `SKILL.md`; second read its gate reference | Same three project files | Same home and action | Nine custom tool calls; zero calls before Resume read |

All four final `git status --short --untracked-files=all` results were empty. No cell ran Verify or
wrote project state. Neither Product, Architecture, domain documents, implementation source, nor
test source was opened for content. The agents used Git metadata and directory enumeration to
validate the state record; that did not create a competing knowledge home.

The Codex OFF cell's one extra call happened after the installed Resume read and after the route was
already correct. It is outside the precommitted metric, which counts calls before that read.

## Transcript identity

The raw transcripts remain in the disposable local evidence root
`.tmp/host-delivery-evidence/` so the extracts can be audited without retaining the isolated host
homes or their copied authentication material.

| Cell | Session | Raw transcript SHA-256 |
|---|---|---|
| Claude ON | `81ce3539-afac-4f9f-b50b-6449707bfeac` | `46c88bd1bd1c39f0893cea95527394f1bcd69247ef585d1cee03e74d0173033a` |
| Claude OFF | `da5c3f5b-9068-46a4-aab7-bef0db8e9b83` | `57da3fae5de0c94344f3b3f46bdbe8371ff80b5ea5157afbccff62b9197ed2a3` |
| Codex ON | `01a0aeeb-da9c-7593-8fd5-635e545f8635` | `460ed60e31bbe19bef78ec396acf80b91b5e6eded1cc0c3ed4f2b7a5264169ea` |
| Codex OFF | `01a0aeeb-dadb-7832-b66b-070880e27e3c` | `c949f3e1bd8d2009df08051208bc2642a1c6f7e92f0427c46f35198831c58bfb` |

## Rejected harness attempts

Three earlier attempts are not counted:

- Claude's permission mode prevented the installed reference read, and one OFF invocation supplied
  malformed inline settings JSON.
- An early fixture retained a closed alternate branch and a mismatched safe point.
- Overriding `HOME` and `USERPROFILE` caused host caches to appear inside the project, violating the
  read-only observation.

Each fault was in the test harness. The accepted rerun used only `CLAUDE_CONFIG_DIR` or `CODEX_HOME`,
separate clean clones, a reachable safe point, one branch, and official hook toggles.

## Effect decision

Both OFF cells selected installed Resume on the first action, reached the same home, and proposed
the same action as ON. The enabled cells therefore cannot be strictly earlier than OFF, and they did
not repair any routing failure. The SessionStart improvement hypothesis is `failed` under the fixed
metric. The hook was removed from the final package rather than retained as unearned machinery.

## Follow-up: host connector premise

The hook-off cells above still had a root `AGENTS.md` pointer, and Claude also reached it through a
root `CLAUDE.md` import. They therefore did not establish whether that connector caused Resume
selection. A bounded follow-up used the final hook-free `0.3.0` install and the same Korean status
question against a closed, UI-less Incident Relay checkout whose complete Product and Architecture
route to Direct. Project-local skills were absent and each accepted cell used a new project path and
isolated authenticated host home.

The CLI invocations requested Claude Opus medium and Codex Sol medium. The Claude traces identify
Opus but do not expose effort; the Codex follow-up trace exposes neither model nor effort. Those
settings are invocation evidence rather than transcript-observed properties for this follow-up. The
no-connector Claude and Codex cells report full HEAD
`b536497a5e68f891a32fb3332d28b8586174eb14`; the `AGENTS.md`-only Claude cell reports short HEAD
`154ebf3`, directly after closed-work commit `9e83a90`.

| Cell | Host entry | First action | Project files actually read | Result |
|---|---|---|---|---|
| Claude | root `AGENTS.md` only; no `CLAUDE.md` | `Skill(devflow:resume)` | `.devflow/index.md`, `project/product.md`, `project/architecture.md` | No active item or inconsistency; next route `direct` |
| Claude | no `AGENTS.md` or `CLAUDE.md` | `Skill(devflow:resume)` | Same three files | Same judgment and route |
| Codex | no `AGENTS.md` or `CLAUDE.md` | Read the isolated installed `skills/resume/SKILL.md`, then its gate reference | Same three files | Same judgment and route |

All three working trees remained clean. The Claude `AGENTS.md`-only cell did not open that file in
its tool trace, so this observation does not claim that Claude loaded `AGENTS.md`; it shows that its
presence made no observable difference to this route. The installed skill descriptions were
available before the first action in both hosts and were sufficient to select Resume for the tested
status/continuation request.

Classification:

- `proven`: the current installed Claude and Codex hosts can select Resume and reach the correct
  canonical route for this request with hooks off and no project host connector;
- `failed`: the premise that `AGENTS.md` or `CLAUDE.md` is required to trigger this observed Resume
  entry; and
- `unproven`: transcript-level confirmation of the requested follow-up effort and Codex model,
  connector effects for arbitrary implementation requests, other skills, hosts, models, future host
  versions, and whether Claude directly loads a root `AGENTS.md` without an import.

No bootstrap writer or host-file framework was added. That would create a new write outside
`.devflow/` without an observed failure or an assigned plan owner. Reopen the decision only when a
current fresh-host request fails to enter Devflow because the connector is absent; if that happens,
the shared first-index publication rule is the candidate cause-level owner rather than three
separate Product, Sketch, and Adopt rules.

| Cell | Session/thread | Raw transcript SHA-256 |
|---|---|---|
| Claude, `AGENTS.md` only | `fdf0ebbe-e722-4a15-9386-66f3dfbd5fb4` | `6dc6161df83763a794abac9a20c6756b1b11ba4a80dc34a4b234c24b01e92ad2` |
| Claude, no connector | `c50f1c9e-6352-4f24-ace8-ebaeadd598d5` | `1b4a8242681353c5f580ae0286501294391413ddbc8bf7406bffc11c3a86fd76` |
| Codex, no connector | `01a0af5f-27c8-7b81-a932-a341b0fd695e` | `b9778df776b683c9a3a0b4a27bf848068cda1e908598181544eb526d497bab70` |

Two earlier invocations are excluded: the Korean prompt was lost by `cmd` quoting for Claude and
was transcoded to question marks by a Windows PowerShell pipe for Codex. Neither accepted a task or
read project state as Devflow evidence. The accepted reruns passed the prompt as a Unicode process
argument.
