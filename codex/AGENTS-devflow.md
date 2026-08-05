<!-- FALLBACK ONLY. The installer registers a native Codex SessionStart hook (requires
[features] hooks = true in ~/.codex/config.toml) that injects tree state automatically —
same as Claude Code. Add this block to a project's AGENTS.md only where hooks are
unavailable (flag off, or older Codex). Not needed in Claude Code either. -->

## nano-devflow

This project is managed with nano-devflow. At session start:

1. If `devflow/tree/` exists, scan its listing to grasp state (`.wip.` = in progress,
   `.done.` = complete).
2. If any `*.wip.md` exists, read it fully — its progress log says where things stopped.
3. If `devflow/HANDOFF.md` exists, read it (traps, learnings, open decisions).
4. Report the state you grasped in one paragraph and modify code only after approval.

Work discipline: progress state is expressed only through filename suffixes
(`.wip.` `.done.`). 1 task = 1 commit (message format `02.2 signup API`, only after the
completion signal passes). What was not executed is not "passed" — it is "unverified."
For detailed procedures follow the /nano-devflow-product /nano-devflow-arch
/nano-devflow-design /nano-devflow-split /nano-devflow-work /nano-devflow-verify
/nano-devflow-resume commands.
