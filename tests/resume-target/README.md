# Resume target behavior preflight

This experiment tests the first devflow vNext Skill Rails target against four independent project
states. It is deliberately smaller than an end-to-end devflow journey.

Each fixture is copied to a disposable directory and initialized as its own Git repository before
the fresh session starts. The session receives the fixture's `AGENTS.md`, the natural-language
question from `cases.md`, and the standalone built `resume` target. It does not receive the answer
key or the vNext plan.

Observe separately:

- every project and skill file opened;
- the active artifact or foundation state selected;
- the reported inconsistency or blocker;
- the single next route and action;
- whether any project byte changed;
- whether generated Skill Rails support files were opened without need.

Build integrity and behavior are reported separately as `proven`, `failed`, or `unproven`.

## Result

Verdict: **delivery proven; behavior proven for the four clean-checkout cases, with one fresh host
observation per case.** This is sufficient for the Phase 2 target-selection gate. Claims not
exercised below remain `unproven`; build success is not counted as behavior evidence.

### Delivery evidence

- `skill-rails build` produced the same tree twice from the current source:
  `4f3196ab49b2605179ef9b609545215b4d2996c84930659c9ec1b3c644d1da9a`.
- `skill-rails check` with core `1.0.3` reported `artifactIntact: true` and
  `sourceCurrent: true` for `resume`.
- An independent Fable High review rebuilt twice into scratch directories and obtained the same
  tree. It did not edit the repository.
- Adding Direct changed only Resume's package-level receipt/config metadata. The current rebuilt
  Resume tree is `2b89b364cb8f2e7d1b66cc4e6032cf609514f9864604e589fe570248ac9bbc6b`;
  its `SKILL.md` bytes are unchanged from the behavior observations above.
- Importing the shared project gate and then adding the bounded `read_first` ownership rule changed
  the current Resume tree to
  `28ca4c519894ccfd9e9d4447c20a9dc98608dc6355af9bf9dbda5ddbb20f6541`.
  Its current `SKILL.md` SHA-256 is
  `5428ae1b93aafd2019c9613a9ab35a9a47dbe492196ff07aff7c3a3abff7f987`.

### Fresh-use observations

| Case | Host and actual reads | Selection and blocker | Next route and action | Write | Result |
|---|---|---|---|---|---|
| 1. interrupted active Work | Claude: project `AGENTS.md`; project-local `SKILL.md`; index; Work state and spec; Git revision/status | `W-delivery-retry`; none | `work`: bounded retry-cap change | none | `proven` |
| 2. complete Product only | Claude: project `AGENTS.md`; project-local `SKILL.md`; index; Product; Git revision/status | complete Product; none | `architecture`: define the technical boundary and verification channel | none | `proven` |
| 3. interrupted Product publication | Codex: project `AGENTS.md`; project-local `SKILL.md`; index; Sketch state and brief; partial Product; Git revision/status | `S-product-boundary`; partial Product is not current | `product`: resume at the recorded checkpoint | none | `proven` |
| 4. missing index, repaired instruction | Codex: project `AGENTS.md`; project-local `SKILL.md`; bounded project and Sketch-state inventory; recovery state and brief; Product; Git revision/status | `S-index-recovery`; index missing | `product`: restore only the index | none | `proven` after one observed failure and repair |

Every counted run returned the four report fields, made no project write, and left its disposable
repository clean. No counted run opened generated Skill Rails support files. Cases 1 and 2 did not
open unrelated Product/Architecture or nonexistent lifecycle documents. Cases 3 and 4 did not
start unmanaged bootstrap or invent later-stage state.

The first Codex run of case 4 was a real failure: a malformed inventory command found Product but
missed the active recovery Sketch, so it reached the expected route for an incomplete reason. The
source entry previously requested an inventory but did not make a foundation-only route conditional
on its completeness. It gained exactly this constraint: `Check every bounded active-state location
before choosing a route from foundation documents alone.` A new build and a fresh Codex session
then found the Sketch and used its checkpoint. This proves the repaired path in that observation;
robustness across agents remains unproven.

### Target-level repair after Phase 4 integration

Two valid Phase 4 Resume runs followed the selected Work spec's `read_first` into Product and
Architecture even though those documents were inputs for Work rather than for orientation. The
canonical Resume entry now says that `read_first` belongs to the routed actor and permits Resume to
open a project document only when state, sibling, and Git evidence disagree and that document is
needed to locate the recovery owner.

The [Work case C and E journey evidence](../work-target/README.md) owns the observed scenes. On the
current Resume bytes, case E opened only the target, gate, index, selected spec/state, and bounded
Git evidence; it found the interrupted Direct publication and returned Direct reconcile without
opening Product or Architecture. The index-present read-set repair is therefore `proven` once.
Cases 1–4 above and the missing-index recovery path were observed on earlier Resume bytes and remain
`unproven` on the current prose rather than being silently carried forward.

### Controls and excluded runs

- A Claude session without the target reached the same case 1 action from the index, as intended
  by the plugin-free orientation contract. It additionally probed two nonexistent implementation
  paths and did not produce the four-field report. One parity observation does not meet the
  plan/06 reversal condition that Product/Direct plus the pointer be *always more natural*.
- Two early Claude attempts omitted the host's Skill tool. Their answers were correct but are
  excluded because they did not exercise the built target.
- One Codex case 3 attempt ran in a read-only sandbox that blocked Git inspection. It is excluded;
  the case was repeated in a disposable writable repository.
- The Codex no-skill control is excluded because an unrelated globally installed pilot skill
  activated. Counted Codex treatment runs explicitly selected the project-local target, so natural
  implicit Codex selection in an uncontaminated host is `unproven` rather than silently inferred.

### Unproven and deferred to its owning phase

- dirty-checkout ownership and Git mismatch (Phases 4 and 9), several simultaneous active items
  (later Resume integration), Adoption state (Phase 8), and `continue / reconcile / abandon`
  disposition (Phase 5);
- implicit natural-language target selection and global-skill coexistence (Phase 11), plus
  cross-host repetition of each case;
- pending-landing precedence once Verify exists, coexistence after Direct exists, and any
  end-to-end effect on implementation or verification work.

These gaps do not justify another field, fixture family, shared module, generator, checker, hook,
or host adapter in Phase 2. They reopen only when their owning later phase supplies the necessary
state and failure scene.

The entry and the hand-written fixture indexes currently repeat part of the normal orientation
procedure, with the index explicitly taking precedence. Removing the entry copy is not yet safe
because no bootstrap target generates the index skeleton. Reopen ownership when the first such
target exists in Phase 6 or later; this is an observation, not a Phase 2 failure.
