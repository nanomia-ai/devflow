# Model and failure policy

## Model Tiers

**Never write model names in files.** Use tiers only. The actual model and reasoning
effort are chosen by the user, per session, in split's execution proposal.

| Tier | Role | Use for |
|---|---|---|
| T-high | Top-tier reasoning | Judgments and reviews. Keep them short — long runs don't justify the cost |
| T-mid | Standard reasoning | The default. Planning, splitting, ambiguous or entangled tasks |
| T-low | Implementation-focused | Implementation with a complete card, mechanical transforms, collection/cleanup |
| Below that | — | Never for coding |

Reasoning-effort rule: **judgments = higher tier + low effort, kept short. Design =
standard tier + high effort, kept deep.**

The harness dial — inversely proportional to tier:

- T-mid and above: destination + 3 lines of prohibitions. No path instructions —
  prescribing the method actively degrades performance.
- T-low: fully enumerate `Read first` + ordering hints + expanded prohibitions +
  the completion-signal commands verbatim.
- **If you don't have time to write a T-low-grade card, don't give that task to T-low.**

## Failure Ladder (applies to every retry)

```
1st failure → reinforce the card and re-dispatch (never re-dispatch the same prompt —
              failure signals a defective card)
              The heart of reinforcement is the failure's causality, not added
              instructions — one or two sentences on the card: what failed, why,
              and what happens as a result
2nd failure → raise the tier, or the main session does it directly
3rd failure → call the human. There is no 4th attempt
```

Repeated fix attempts under the same hypothesis during implementation are not ladder
counts — those belong to work's stuck-escape.
Review rounds are not ladder counts either — work's `Review — one flow` owns that count,
its human boundary, and what a review that could not judge does next.
The failure ladder counts only prompt reinforcement, tier escalation, and a human call within one work run.
A completed card that crosses the verify boundary and later returns non-pass is counted by verify's `repair lineage` and `recurrence observation`.
A new root and recurrence observation 1 follow the normal fix route; recurrence observation 2 or higher returns to the human without an automatic card.
Do not combine the two counts or create a fourth attempt in the failure ladder.
