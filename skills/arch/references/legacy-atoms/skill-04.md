# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0036 — migration:SKILL.md:123-130

Source hash: sha256:585e50f1304d119f8bd4ca528989086641dcb5d0cd52f0bca1fd3298757b3f6a

Confirm the channel the verifier will drive by actually running it once in a clean context —
the same way verify briefs one with `verifier.md`, using the smallest command and its exit
code. **The command you confirm with and the command you write into arch.md are the same
string** — run one of the commands you will record, verbatim, and record that same command.
Confirming through a different selector or a different surface of the same tool is not
confirmation. A channel that runs only in this session is not decided: guide connection of
one that runs in a clean context, or stop as the `If missing` column below says. When the platform
cannot start a clean context, report that fact and let the user decide.

## migration-a0037 — migration:SKILL.md:132-132

Source hash: sha256:85c9f1a262985a2530d8871ba1d61c624b5c02aecf8229f2be8259b5e631aac9

| Type | Channel | If missing |

## migration-a0038 — migration:SKILL.md:134-134

Source hash: sha256:7ba12cd5c6bdd697068e4c957741b00f79196f1692c344f2ab52f44ff2bb58ad

| Has a frontend | **A browser-control tool that can inspect rendered output and interact with it is required** (one provided by the active platform) | Guide connection of an available tool, then stop. UI verification you cannot see is guesswork |

## migration-a0039 — migration:SKILL.md:135-135

Source hash: sha256:fce17ecdebc24934ccc626f482050e8fa2f66cafdba5cc073749cad72c8d755c

| Non-web with a screen (desktop app · TUI) | A tool that reads the screen/accessibility tree or real output + an operating-procedure document (process safety included) | Guide installation of an available tool, then stop until it can actually run — same reason. If the operating-procedure document is missing, create it as the first task |

## migration-a0040 — migration:SKILL.md:136-136

Source hash: sha256:64f8c4b5f091c04682bd57ce5577bcd386d05a1192e08a4482497e35185a82be

| Web backend | Real HTTP calls (`.http` file / curl scripts) | Create it as the first task |

## migration-a0041 — migration:SKILL.md:137-137

Source hash: sha256:15e744972c669a28aa22413dadd2442479e630df646540bba0fa517bce092b08

| CLI / daemon | Run command + expected output (+ health check, log location) | Create it as the first task |

## migration-a0042 — migration:SKILL.md:138-138

Source hash: sha256:26a7ba9421f8a96fdc9825dc6a9c9e9cfcea32f8901d2dd2ee36168c0dc88753

| Library | Test runner | Create it as the first task |

## migration-a0043 — migration:SKILL.md:140-141

Source hash: sha256:c5f17e24f209d06c2ddc0065e396cadb3ca63a081de2dceb272d3fe997de8d2e

Git check: if not a repository, propose `git init` and stop when the user declines. All
recovery and undo in this system depends on git.

## migration-a0044 — migration:SKILL.md:143-146

Source hash: sha256:70c3fe2178a4fb52eaeb6b110ae72b8403bb15af052c209c1f842d8bea35c4d5

Immediately before binding a hard-to-reverse choice such as stack, code structure, data,
or verify channel, run the planning evidence discipline's pre-commitment review once. Do
not compare a candidate that changes product's Problem, Capabilities, Boundary, or Success
criteria; route it back to product. Do not review again a batch the user reselected.

## migration-a0045 — migration:SKILL.md:148-148

Source hash: sha256:c96a42b5803e7aacb29296e0103324dac56279f91645b28ef7f1b08dda774249

## Output — devflow/project/arch.md

## migration-a0046 — migration:SKILL.md:150-150

Source hash: sha256:e59d37521fe144aafc343a085260373555a9d861dcbe160a3c35f28e9ac64c43

The `Code structure` value must use one of these choices.

## migration-a0047 — migration:SKILL.md:152-152

Source hash: sha256:308d04349e60770c4e7e4fb70b85064ac7885e09493c7efabb001ce4b5cdc104

| | Structure | When |

## migration-a0048 — migration:SKILL.md:154-154

Source hash: sha256:447f465a4a833182b589faac74c5810d0dbb4fc08ee1e57e4efb224cffc8a343

| A | Domain-vertical modules — route·service·repo·test all inside `src/<capability>/` | Default recommendation. 3+ capabilities |

## migration-a0049 — migration:SKILL.md:155-155

Source hash: sha256:5529d1c3478bf9f579f0330c30f9f5d3725f49b71e8093839c7dd131d56ee3ee

| B | Feature-Sliced | Screen-heavy frontends |

## migration-a0050 — migration:SKILL.md:156-156

Source hash: sha256:a3643031e125ce8ab5d6bc78a3d03242a5799bed49bac458410c5e5b716a523f

| C | Flat — just files under `src/` | Under 20 files. A would be overkill here |

## migration-a0051 — migration:SKILL.md:158-178

Source hash: sha256:66b401bb8384873d4ebafad91d82c08d6bd4b9816301f241f2a68269cc0f8ec5

```markdown
# Architecture

Brownfield: no

## Components       <!-- ✔/✘ + 1-line reason. resting on an external contract fact, the exact source on the same line -->
## Stack            <!-- item: choice — 1-line reason. resting on an external contract fact, the exact source on the same line -->
## Code structure   <!-- A/B/C + folder sketch. folder name = capability name -->
## Data             <!-- core entities only -->
## Existing records <!-- Brownfield only. each line: <capability name|shared>: <exact path>. omit if empty -->
## Provisional      <!-- values you are guessing. see below. omit the section if empty -->
## Risks            <!-- 3 things that break first + how to check each -->
## Out of scope     <!-- what this architecture does not carry -->

frontend: none | needed
verify_channel:
  work server: <run command + port>     # verification always happens here
  means: <exact commands the verifier drives> — confirmed in a clean context by running one of them verbatim: `<that same command>` exit <code>; read probe: `<the exact command run>` → <the actual rendered element read, with its value>; interaction probe: `<the exact command run>` → <the change it caused>
integration: <branch>                   # where minting, closure, and binding decisions land. The current branch when one person works alone
merge: merge-commit | rebase            # Squash forbidden — it erodes NN.N history
```
