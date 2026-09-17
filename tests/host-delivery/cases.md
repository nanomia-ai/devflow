# Host delivery precommitted cases

These cases are fixed before installation runs. A generated tree, manifest validator, or npm pack
result is delivery evidence only; host discovery and hook effects require fresh host sessions.

## A. One npm artifact

Build all nine targets from the canonical Skill Rails source into `skills/`, pack the repository,
and inspect a clean extraction.

### Answer key

- The tarball contains root `plugin.json`, `.claude-plugin/plugin.json`, nine built skill folders,
  `hooks/hooks.json`, `scripts/session-start.mjs`, and `LICENSE`.
- It excludes `source/`, `dist/`, `tests/`, `plan/`, `legacy/`, and marketplace catalogs.
- Every packaged skill receipt is intact and current against the canonical source before packing.
- Root portable identity is canonical. A `.codex-plugin/plugin.json` compatibility copy is absent
  unless a current host actually requires it.

Outcome note: this was the candidate-package shape used to run the paired SessionStart case. Case E
produced the precommitted tie, so the final delivery shape omits `hooks/hooks.json` and
`scripts/session-start.mjs`; the nine skill bytes are unchanged.

## B. SessionStart off and on

Compare fresh host sessions in the same small managed fixture with the bundled hook disabled and
enabled. The user asks only what to read first and what route owns recovery.

### Answer key

- With the hook off, explicit skill invocation and `.devflow/index.md` still reach Resume; core
  behavior does not depend on the hook.
- With the hook on, a managed checkout receives only the short index/Resume pointer. An unmanaged
  checkout receives no injected context.
- The hook does not duplicate project rules, inspect project documents, write files, or decide a
  route itself.
- Keep the hook only if the observed enabled session improves discovery without changing the
  answer or adding misleading context.

## C. Claude marketplace lifecycle

Install the packed npm artifact from the Claude marketplace source into a clean isolated host
home, start a fresh session, update to a second local test version, and uninstall it.

### Answer key

- Claude discovers all nine namespaced skills and the SessionStart hook from the installed npm
  artifact.
- Update replaces the installed version without retaining an active old skill or hook definition.
- Uninstall removes host discovery; the tested project `.devflow/` remains untouched.
- Any unavailable authentication, registry, or interactive host step is reported `unproven`, not
  inferred from manifest validation.

## D. Codex marketplace lifecycle

Install that same packed npm artifact from the Codex marketplace source into a clean isolated host
home, compare a fresh session, update, uninstall, and repeat the session with the hook disabled.

### Answer key

- Codex discovers the nine portable skills from root `skills/` and uses root `plugin.json` plus
  `extensions.com.openai`; no compatibility manifest is needed on the tested version.
- Update and uninstall have the same boundaries as the Claude case, and uninstall does not touch
  project state.
- Hook trust or an unavailable app-only install surface is recorded as a host limitation. It is not
  bypassed or counted as passing.

## E. Authenticated installed-host recovery

Install the current packed artifact into isolated Claude and Codex homes. Run Claude Opus medium
and Codex Sol medium against byte-identical clones of one interrupted, UI-less managed project.
The clones must live outside this repository and contain no project-local skill copy. For each host,
compare one fresh session with SessionStart enabled and one with only hooks disabled; keep the
installed plugin, project bytes, question, model, effort, and permissions otherwise identical.

The user asks: `이 프로젝트의 현재 상태와 다음 행동을 알려줘. 어떤 파일을 실제로 읽었는지도 함께 알려줘.`

### Answer key

- The host transcript, not merely the answer, must show the isolated installed Devflow Resume skill
  being selected or read. A correct route derived only from `AGENTS.md` and `.devflow/index.md` does
  not prove installed-skill behavior.
- Read `.devflow/index.md`, then the active `work/*/state.md`, then only that work item's `spec.md`.
  Product or Architecture reads are unnecessary; they are a routing error only if they change or
  obscure the recovered route.
- The canonical home is `.devflow/work/W-incident-lifecycle-6f41b8c2/`.
- The next action is independent Verify execution of the acceptance criteria. Resume reports that
  action and does not perform it or write project files.
- The enabled transcript contains the bundled hook's short index/Resume pointer exactly once; the
  disabled transcript contains it zero times. Both return the same home and route.
- A cell is `unproven` when authentication fails, the requested model or effort is not observable,
  the installed skill cannot be distinguished from another skill source, the fixture's safe point
  is unreachable, or the hook toggle is not observable.
- Retain the hook only if an enabled cell selects Resume where its disabled peer does not, or uses
  strictly fewer tool calls before the installed Resume skill read while returning the same route.
  A tie does not establish effect and therefore triggers the plan's removal decision.
