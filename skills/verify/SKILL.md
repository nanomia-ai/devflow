---
name: verify
description: Verification. Checks acceptance criteria at the capability and product level through real execution. Use for capability-completion verification, MVP verification, or regression checks.
---

# verify — Verification

First read the canonical rules (`../principles/SKILL.md`) and the `verify_channel` in
`devflow/project/arch.md`.

Purpose: check criteria through real execution.

## Layers

| Layer | Checked against | When | Owner |
|---|---|---|---|
| Task | completion-signal run + pre-commit code review | automatically, by work | implementing context + reviewer |
| **Capability** | one user scenario driven through the channel | when a capability folder is all `.done.` | **verifier (clean context)** |
| **Product** | every success criterion in product.md | on reaching the MVP | verifier (clean context) |

This skill's core is the capability and product layers. The task layer (signal run +
review) is absorbed into work.

The duality of roles — they never cross:
**the reviewer reads but never executes** (white-box — is the inside right?),
**the verifier executes but never reads** (black-box — is the outside right?).

## Procedure

```
1. Read verify_channel. Verification always runs on the work server (working tree) —
   it is the new code being verified
2. Read the target layer's criteria (capability: the scenario / product: success criteria)
3. Actually execute through the channel — browser-MCP clicks, HTTP calls, CLI runs
4. The verdict is exactly one of three: pass · fail · unverified
5. Capability layer adds three checks:
   - **Regression**: rerun the completion signals of the `.done.` cards in the same folder
   - **Boundary**: run one scenario input as hostile/abnormal
     (intensity per the posture level in code-style.md's Trust boundary)
   - **Standards**: scan for visible code-style.md violations — an axis separate from
     spec conformance
6. Fail → create a fix card in the same folder (e.g., 02.3b-fix-...) and reflect it in
   the tree
7. **Capability layer passes → grant `.done` to that capability folder.** Never before —
   a capability that looks complete without verification is the worst lie a tree can tell
```

**Iron rule: what was not executed is not "passed" — it is "unverified."**
Reading code and thinking "looks right" is not a verdict. Record the channel's execution
results (responses, screens, output) as the evidence for every verdict.

## Bias Removal

Verification runs in a context that has **never seen the implementation history**.
- Claude: run as the `verifier` agent (bundled with the plugin)
- Elsewhere: give a fresh session/agent only the card (or scenario) + verify_channel.
  Never what code was changed or how.

Recommended tier: T-high + low effort, kept short (it is a verdict, not an exploration).

## Repeated Failure

Same target fails 3 times → stop and call the human. There is no 4th attempt
(the canonical rules' failure ladder).

## Record — devflow/tree/<capability folder>/verify.md

```markdown
# Verification · <capability> · <date>
Scenario:  <one line>
Executed:  <channel + what was actually run>
Verdict:   pass | fail | unverified
Regression: <completion signals rerun + results>
Standards: <code-style violations found or none. Violations become fix cards>
On fail:   <fix cards created>
```
