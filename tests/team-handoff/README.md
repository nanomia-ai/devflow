# Team hand-off and parallel-branch evidence

This Phase 9 experiment observes the smallest hand-off that can distinguish shared state from
private member context, then checks that the same rule survives another actor, Git integration, and
closure. It starts from the existing Queue Relay Work fixture and uses disposable Git copies; no
runtime coordination service or general state framework is introduced.

## Current result

Verdict: **proven for the six bounded cases in [`cases.md`](cases.md).** Fresh sessions preserved
shared custody in artifact state, kept private context in bounded member notes, treated Git as the
integration surface, stopped on a canonical policy conflict, removed closed artifact state and its
notes, exposed unowned dirty bytes, and handed off interrupted Sketch and Adopt work without
promoting tentative context to shared truth.

Delivery is separately proven for the three affected targets. Two consecutive Skill Rails builds
produced the same current tree hashes: Work
`a0135df39edc107e8759e8b7ad06fc278e8b8e18b910a775843fd2e713fbf884`, Sketch
`2a9047e54f99873ac7dc3e7c7cf5e471570c7eda1034aa128f03a62a86d7648d`, and Adopt
`59bf57fa092b9d6835937cb9c01212ebe6b397788d0105b01231a2a8f681afcd`. Build determinism does
not establish behavior; the observations below do.

The shared `team-context` module was chosen after an independent Fable High refuter and the primary
implementation exchanged counterexamples and converged on the smaller boundary: state and canon
must remain sufficient, while a member note may carry only a real local delta, a host-specific
detail, or an unconfirmed suspicion. No registry, room, claim, global sequence, or cleanup service
was added.

## Fresh observations

### A. Work session hand-off

The first private-context attempt wrote the wrong terminal UUID as the member path and omitted the
branch/worktree coordinates. That was an actual target defect, not a reasonable alternate path.
The shared module was corrected at the ownership boundary and a new fresh session wrote
`.devflow/team/phase9-agent-a/W-retry-default-k4m9.md`, preserved `next_route: work`, named the real
safe point and checkout, and kept the failed test plus suspicion out of canonical state.

### B. Work continuation by another member

A separate fresh session opened only the selected artifact's note together with state, spec, Git,
and current canon. It treated the note as context rather than authority and chose consumer discovery
as the next action. This matched the answer key.

### C. Parallel Git integration

The first run was invalid because a globally installed legacy Devflow skill contaminated the test
harness; it was stopped and is not behavior evidence. A clean fresh run read
`.devflow/index.md`, the Relay Domain, and the pending merge's Git evidence. It judged the distinct
`lint:a` and `test:b` manifest additions safe, but refused to commit because the canonical Domain
simultaneously required fixed one-second retry and increasing delay. Its next action was an explicit
A-versus-B decision followed by one canonical rewrite and reread. This matched the answer key and
introduced no coordination machinery.

### D. Closure and orphan recovery

Resume found no active state but an unstaged tracked retry-policy change and routed to a user
ownership/disposition decision without inventing an artifact. The first closure session landed the
durable invariant and deleted every Work file and matching member note, but left the now-empty Work
directory on disk. That was a literal delivery failure. Work's canonical entry was repaired once to
require deletion of the artifact directory itself; a new fresh session then removed the directory
and every matching note, left zero active Work states, passed the focused test, and committed a
clean safe point `0d49f7b9253cae3d4470ec7473d4bedd598348bb`.

### E. Interrupted Sketch hand-off

The fresh session stopped before missing consumer inspection, kept the unresolved finding and its
destination in Sketch state, and wrote only the host quoting issue and unconfirmed viewer suspicion
to `.devflow/team/phase9-sketcher/S-backup-fields-a7c3.md`. It selected `next_route: user` rather
than the answer key's `next_route: sketch` because the maintained consumer paths were absent and
only the user could supply them. This is a reasonable, safer alternate route: Sketch retains
artifact custody, and the next action explicitly returns to Sketch after the paths are provided.

### F. Interrupted Adopt hand-off

The fresh session accounted for all six maintained tracked paths exactly once, created the internal
index and Adoption state, kept `next_route: adopt`, and stopped before interpreting source meaning.
The host quoting issue and possible operations/store disagreement appear only in
`.devflow/team/phase9-adopter/adoption.md` as tentative context; the conflict document explicitly
says no semantic conflict has yet been established. This matched the answer key.

## What remains unproven

- Same-user concurrent agents that need distinct labels were not observed.
- The fallback when `git config user.name` is unset was not observed.
- Cross-host transport of notes was not observed; only two local worktrees and fresh sessions were.
- These cases do not prove arbitrary merge shapes or justify a coordination runtime.

## Phase 10 checker decision

Verdict: **proven unnecessary at this evidence boundary.** The observed failures were semantic
instruction defects: member coordinates were underspecified once, and Work closure named files
instead of the directory itself. Neither recurred after its cause-level prose repair. No repeated
missing index, missing required header, dangling link, duplicate routing index, or structurally
invalid state was observed. Therefore no checker, generator, renderer, schema, or framework is
added. File presence and links remain direct delivery checks until a repeated structural failure
provides evidence for a machine-owned invariant.

## Stop and reopen rules

- Add shared prose only after a fresh failure shows that the current entries do not preserve the
  custody/member boundary.
- A Work-only failure is repaired in Work unless the same cause is reachable from Sketch or Adopt.
- Do not add locks, rooms, claims, a central member registry, global numbering, TTL cleanup, or an
  automatic merge engine.
- A member note never proves a shared fact merely because another agent can read it.
