# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0052 — migration:SKILL.md:180-189

Source hash: sha256:ca9bad2411431afa44c23e02997eb99d22c61409836228711b36ae9d61251cce

`means` is confirmed only by a record of the channel actually running. Help output, a
capability listing, the binary existing, and an attach that
exits 0 are none of them confirmation — all four come out the same way while the channel
never reached the screen. When `frontend: needed`, a clean context must
**read one actually rendered element** and
**succeed at one real interaction** through the chosen channel before arch writes it down as
confirmed. Write both probes' exact commands and observed outcomes on that line verbatim —
the element read down to its value, the interaction down to the change it caused. Failing
either one leaves the channel unconfirmed, and an unconfirmed channel gets no value written:
report to the user what did not work.

## migration-a0053 — migration:SKILL.md:191-195

Source hash: sha256:78562839ee20ea87ed8f6e69bb39e60c410e863745aad7a06e598f5c9f68f0ab

`Brownfield` records whether implementation code existed before devflow entered this
repository. arch writes `no` for a new project; adopt writes `yes` when deriving from
existing code. This value selects how the first tree is created; it is not implementation
progress. When an existing arch.md lacks only the `Brownfield` field, ask that one
question, add only the field, and change nothing else.

## migration-a0054 — migration:SKILL.md:197-204

Source hash: sha256:ebb2af84eed6f139e67ebd950f7f2045b68f12f72fe02e46c40dbb8b08ff5a5e

The default proposal for `integration` forks on how many worktrees `git worktree list`
reports. With one, it is the current branch and there is no extra question. With two or
more, propose **a branch no worktree has checked out** — Git refuses to update a branch
another worktree has checked out, so when one folder holds integration, every claim,
minting, and closure has to be done in that folder and running several worktrees loses its
point. When no such branch exists, show the exact command that creates one
(`git branch <name> <current integration>`) and let the user run it — devflow creates
neither a branch nor a worktree. The canonical rules govern what that value then means.
