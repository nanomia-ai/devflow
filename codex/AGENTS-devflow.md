<!-- FALLBACK ONLY. The Codex plugin delivers a native SessionStart hook (requires
[features] hooks = true in ~/.codex/config.toml) that gives shared principles guidance,
as in Claude Code. Add this block to a project's AGENTS.md only where hooks are
unavailable (flag off, or older Codex). Not needed in Claude Code either. -->

## devflow

This project is managed with devflow. Invoke an explicitly named devflow stage directly and
read shared policy from that stage's own entry. When the user intends to operate, resume,
recover, or inspect this project through devflow without naming a stage, invoke the
model-invocable `devflow:principles` skill to classify the request and follow its route.
If you were handed a devflow role contract, follow that contract directly; do not re-enter
through principles or generic stage entry. Do not modify code before the selected route and
any required approval.

Before dispatching another agent to perform a devflow stage in this project, read and
follow devflow's `coordinator` role contract.

If the required model-invocable skill is unavailable, do not modify code. Ask the user to
install or enable the devflow plugin. Never assume that the model can invoke a slash
command itself.
