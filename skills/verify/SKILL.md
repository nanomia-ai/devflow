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
2. Establish the target layer's criteria (capability: the scenario — the main session
   composes it from product.md's capability description and the cards' Destinations /
   product: success criteria)
3. Actually execute through the channel — browser-MCP clicks, HTTP calls, CLI runs
4. The verdict is exactly one of three: pass · fail · unverified
5. Capability layer adds four checks:
   - **Regression**: rerun the completion signals of the `.done.` cards in the same
     folder, **plus the signals of the cards this folder's cards name in `Depends`**
     (the number prefix tells you the folder. Named cards only, one hop — a capability
     that breaks the layer below it is invisible from its own folder). A signal that
     cannot run in this environment (remote-only, e.g. CI) is satisfied by the latest
     result of its remote evidence. A research card's signal is a record, not a run —
     instead of re-running, the main session confirms the answer and evidence exist in
     the card's progress log (a document axis)
   - **Boundary**: run one scenario input as hostile/abnormal
     (intensity per the posture level in code-style.md's Trust boundary)
   - **Standards**: scan for visible code-style.md violations — an axis separate from
     spec conformance
   - **Provisional**: confirm the arch.md Provisional rows settled by this folder's cards
     were actually replaced — a document still posing a question its own card already
     answered will misdirect the next capability
6. Fail → create a fix card in the same folder (e.g., 02.3b-fix-...) and reflect it in
   the tree. A fix card born from the verifier's fail carries as its completion signal
   those reproduction steps rerun through the channel — the escaped defect becomes a
   signal, and regression reruns it from then on.
   multi: fix cards are born unclaimed (pending) — assignment goes through the normal
   path (proposal · claim)
7. **Capability layer passes → grant `.done` to that capability folder.** Never before —
   a capability that looks complete without verification is the worst lie a tree can tell
8. With the `.done` grant, sweep the whole journal — whichever capability a line came
   from, delete lines whose force has ended; lines still carrying force get promoted
   into core documents (the discovery→update table) or stay (cross-cutting matters).
   Record the sweep in one line of verify.md. journal aims to stay within one screen
```

Re-closure of a reopened capability may scope the scenario to the changed behavior —
**regression always reruns the whole folder's signals.**

Role ownership: **execution and verdicts belong to the verifier.** The document-reading
axes (Standards, Provisional), assembling the regression list, the journal sweep, and
fix-card creation belong to the main session running verify — the verifier reads neither
implementation nor documents.

multi: capability closure happens **only on the integration branch, after a fetch** —
on a stale branch view, "folder all done" can be falsely true. A signal that cannot run
on the closer's platform is handled by remote-evidence substitution (Regression — mode-
neutral) or delegated to the owning member — record the split in verify.md. The journal
sweep is done by the member performing the closure.

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

The product layer records at `devflow/tree/verify.md` (tree root), same format.
Re-verification overwrites the same file — git remembers the history.

```markdown
# Verification · <capability> · <date>
Scenario:  <one line>
Executed:  <channel + what was actually run>
Verdict:   pass | fail | unverified
Regression: <completion signals rerun, substituted, or confirmed + results>
Standards: <code-style violations found or none. Violations become fix cards>
Provisional: <arch rows confirmed replaced, or none>
Journal sweep: <lines promoted/deleted, or none>
On fail:   <fix cards created>
```
