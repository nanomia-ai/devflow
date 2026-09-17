# Host delivery evidence

This report applies the precommitted cases in [`cases.md`](cases.md) to Devflow `0.3.0`. It keeps
delivery shape, installed-host behavior, and user effect separate.

## Current result

Verdict: **provisional pass for vNext host delivery and installed recovery.** The same candidate
artifact was installed through the real Claude and Codex plugin CLIs into isolated homes. Fresh
Claude Opus medium and Codex Sol medium sessions both selected the isolated installed Resume skill,
found the active Work home from canonical disk state, and returned Verify as the next action without
writing the project. The four accepted cells and their actual reads are in
[`accepted-observations.md`](accepted-observations.md).

The optional SessionStart hook did execute correctly in Claude, but paired OFF sessions already
selected Resume on their first action. It improved discovery in neither host under the fixed metric,
so the effect hypothesis `failed` and the hook was removed. This is evidence against extra machinery,
not against the document system.

## Final artifact

- Path: `.tmp/final-package/nanomia-devflow-0.3.0.tgz`
- npm pack: 87 files, 33,201 packed bytes, 248,044 unpacked bytes
- npm SHA-1: `ae4580b0a3df44a2052739d823efe425c381e33a`
- SHA-256: `2a4e57178d7a01cc76e34ee2cd22b7f870e5c0253ac0ce52f2dd09c0867ae3ae`
- Contents: root `plugin.json`, Claude adapter manifest, nine generated skill packages, package
  metadata, and license
- Excluded: authored source, tests, plans, legacy material, marketplaces, hooks, and hook scripts

Claude strict plugin validation passed. A fresh final-artifact install through both real host CLIs
reported `devflow@nanomia-vnext-final` version `0.3.0`, enabled, with nine skills and no hook directory
or SessionStart script. These final install checks used new isolated homes; the normal user homes were
not changed.

Classification: deterministic/current Skill Rails output, archive shape, local npm pack, strict
Claude validation, and clean Claude/Codex installation are `proven`. Public registry retrieval is
`unproven` because this preflight did not publish the package.

## Installed behavior

The accepted fixture was a UI-less Incident Relay project at an interrupted Work-to-Verify handoff.
Its host entry contained only the official pointer to `.devflow/index.md`; the index did not duplicate
active Work details. Each host used two byte-identical project clones, one with hooks enabled and one
with hooks disabled.

Across all four cells:

- the transcript identified the isolated installed Resume skill, not a project or legacy copy;
- the project read path was `index.md` → active Work `state.md` → that Work `spec.md`;
- the canonical home was `.devflow/work/W-incident-lifecycle-6f41b8c2/`;
- the next action was independent Verify execution of the bounded Node.js 24 criteria;
- Product, Architecture, domain, implementation, and test contents were not needed;
- the final Git tree was clean.

Classification: installed Resume selection, bounded document routing, Work-home precedence over the
foundation index's broad route, correct next action, and no project writes are `proven` on Claude
Opus medium and Codex Sol medium for this interrupted-work scenario.

A follow-up removed both root host connectors from a closed managed checkout and repeated the same
status question with the final hook-free install. The Claude invocation selected
`devflow:resume` as its first action, and the Codex invocation read the installed Resume entry on its
first custom tool call; both reached `direct` from the index and complete foundation. The CLI
requested Opus medium and Sol medium respectively, but the follow-up traces do not expose every
model/effort field, so that detail remains invocation evidence. A third Claude cell with `AGENTS.md`
but no `CLAUDE.md` behaved identically and did not open `AGENTS.md` in its tool trace. For this
request, the observed entry chain was installed skill metadata → Resume → gate → index → bounded
project documents; neither a hook nor a project pointer was required.

## Hook decision

Claude ON recorded one actual SessionStart event with the intended short pointer; Claude OFF recorded
none. Both selected Resume before any other tool use and used the same five calls overall. Codex ON
and OFF both read the installed Resume entry on their first custom tool call. OFF made one additional
Git comparison only after routing was already correct, so it is outside the fixed before-skill-read
metric.

Classification: the hook command's bounded Claude behavior is `proven`; its discovery improvement is
`failed`. Codex hook firing itself remains `unproven` because its transcript does not expose hook
output, but that cannot rescue the effect claim: OFF was already at the zero-call floor. The final
package therefore contains no hook declaration or script.

## Invalid attempts and why they do not count

The discarded attempts are recorded in [`accepted-observations.md`](accepted-observations.md). They
were caused by permission configuration, malformed settings, a stale fixture branch/safe point, and
home-directory overrides that wrote caches into the project. None was treated as Devflow behavior
evidence. Correcting the harness required no new checker, schema, or product rule.

## Boundaries

This run proves one installed recovery entry on both requested model families. The earlier
[`whole-journey`](../whole-journey/README.md) observation proves the combined Direct → Work → Resume
→ Verify → Work closure flow with fresh actors against one evolving repository. Taken together they
support proceeding beyond preflight without repeating every stage through both installed hosts.

Still `unproven`: public-registry retrieval, installed fresh-session selection of each of the other
eight skills, connector effects for arbitrary project requests, direct Claude loading of root
`AGENTS.md`, long-duration knowledge quality under repeated real project change, and behavior on
host/model versions not observed here. Those are release or longitudinal questions, not blockers to
the current implementation conclusion. No bootstrap skill writes `AGENTS.md` or `CLAUDE.md`; adding
that external write remains unwarranted until a connector-absence failure is observed.
