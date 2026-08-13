<!-- FALLBACK ONLY. The Codex plugin delivers a native SessionStart hook (requires
[features] hooks = true in ~/.codex/config.toml) that detects devflow and routes to the
shared resume procedure, as in Claude Code. Add this block to a project's AGENTS.md only where hooks are
unavailable (flag off, or older Codex). Not needed in Claude Code either. -->

## devflow

This project is managed with devflow. At session start, if a model-invocable resume skill
is available, invoke it and follow it exactly. Do not modify code until resume reports the
state and the user approves.

If no model-invocable resume skill is available, do not modify code. Ask the user to
install or enable the devflow plugin. Never assume that the model can invoke a slash
command itself.
