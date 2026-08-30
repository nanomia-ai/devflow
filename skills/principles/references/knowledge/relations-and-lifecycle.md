# Knowledge relations and lifecycle policy

## Relations and consumer projection

- Only the consuming side records a relation, in Consumed contracts and `Consumed paths`.
  Record a shared invariant once in the enforcing capability's design zone; the other side
  points to its exact path.
- Consumed contracts has exactly one row per `Consumed paths` member in the same canonical
  path order and no other row. With no path, the section is `None.` and the array is `[]`.
  The row's other-capability number is the provider number to which arch.md's Code structure
  maps that exact path.
- A consumed-path member matches a provider Scope path only when their strings are equal, or
  when it is below a folder Scope path that arch.md maps exactly to the provider.
- The consumer projection visits, in ascending integer order, every non-retired capability
  number in the current expected set except the provider; foundation is not a candidate.
  Exactly one same-numbered file must exist for each. At the first zero or multiple match,
  stop and report `registered consumers: unknown — <number, exact paths when any exist, and
  reason>`. A retired historical file outside the expected set is not a candidate. From each
  unique candidate, the projection opens no other baseline prose. It projects only number, `Verified
  at`, `Consumed paths`, `Scope paths`, `Covered cards`, `Scope head`, and the exact-path and
  other-capability-number columns of Consumed contracts. A matched consumer is
  `fresh` only when `Verified at` is not `none`, the scope-and-consumed-path union is nonempty,
  the current Scope head equals the stored value, the current card set equals `Covered
  cards`, and both relation representations and the current provider mapping agree. When
  the required fields parse and any condition is false, it is `hypothesis`; when
  a required field is absent or unparseable or the Git comparison cannot execute, it is
  `unknown`. If a candidate's number or `Consumed paths` cannot be parsed, membership itself
  is unknown: stop at the first such file in the same ascending integer order, report it with the same
  unknown form, and never guess `none`.
- For a provider closure, match against the union of that provider's Scope paths before the
  refresh in HEAD and after the refresh. For retirement or split that does not change path
  ownership, use the original capability's stored Scope paths. For retirement, split, or
  another binding decision that changes path ownership, use the union of affected baselines'
  stored Scope paths and the decision's exact before and after paths. Consumers of an old
  path that moved or vanished therefore remain reportable.
- A provider closure, capability retirement or split, and any other binding decision that
  changes path ownership reports one line:
  `registered consumers: <number (status), ... | none>`. The report executes no verification,
  creates no card, changes no state, and does not infer that this event caused a hypothesis.
- When the provider baseline refresh is a no-op, its stored before-and-after scope cannot be
  trusted. Run no consumer projection and report one line: `registered consumers: unknown —
  provider baseline no-op: <same reason>`. Never guess `none`.

## Lifecycle and recovery

- Every arch or adopt run re-derives the design zone for the whole expected set. A new or
  split capability gets a new file; an existing capability keeps its number.
- A capability rename first lands the product and tree name change as a binding decision.
  The following arch capability-design commit, or adopt in a brownfield, preserves the number
  while changing the baseline path and design zone together. If interrupted between those
  commits, number lookup still reaches the old file and the Design head mismatch recovers the
  second commit. Retirement leaves the file unchanged and excludes it only from ordinary
  resume reports and the automatic-entry expected set.
- A rename re-derives every expected design zone, so neighboring `Boundary` names change too.
  A consumed relation is identified by the other capability's number and exact code path,
  not its name; run no consumer projection unless code-path ownership also changes.
- resume uses a machine query **against the HEAD file** that exposes only filename number,
  fixed-boundary count, fixed
  section order and presence, metadata field presence and parse status, and the Boolean result
  of the v0.10 heading-and-field predicate above. Every routing judgment, including absence
  and boundary count, therefore uses the same HEAD values as writer eligibility, and the
  working-tree count only joins the report a person reads. When an expected
  file is absent, or its boundary is valid but its design shape differs, route at a clean
  boundary after any active claim or verification transition: `Brownfield: yes` to adopt,
  `no` to arch, for design-zone writing only.
- An existing project with complete Layer 0 and no baselines uses the same route. Do not
  repeat Layer 0 interviewing or reverse derivation. If the user defers repair, continue the
  remaining state judgment for that session.

## Capability-closing begin commit

- On a capability-layer pass, verify first attempts the verified-zone refresh. On success,
  put the passing verify.md, capability-closing record, and refreshed baseline together in
  `boundary — begin <capability number>`.
- When a boundary anomaly, number conflict, or input parse failure prevents refresh, write no
  baseline, report `baseline no-op: <reason>`, and continue closure. Restore that path to its HEAD
  content, and leave no working-tree file there when HEAD has none. Every skill
  reports the one same form, and a writer-side no-op, which may concern more than one file,
  names the exact path inside the reason.
- A canonical begin transition permits a baseline diff at the closing capability's exact
  path only. That working-tree path may be absent, partial, or arbitrary bytes and is
  regenerated from the same-numbered HEAD file's design zone and the standard refresh set
  only when exactly one such HEAD file with one boundary exists. With no HEAD file or a HEAD
  boundary anomaly, this is a baseline no-op rather than prefix recovery. A diff at any
  other baseline path is an integrity anomaly.
- The baseline lands only in the begin commit, never again in the later verify.md sweep,
  journal sweep, or capability-folder `.done` rename.

## Accepted limits

These limits do not change the predicates and add no separate checks.

- A shallow clone or an integration rebase can produce a conservative false hypothesis.
- Foundation's `Covered cards` stays empty, so its carry set grows with the unit instead of
  resetting at a closure. Foundation is small by construction.
- A very long union of Scope paths and Consumed paths can hit the command-line length limit.
- Neither head command sees an uncommitted working tree.
- A relation through a registry or dynamic dispatch can retain false freshness under
  path-only tracking.
- Relation reporting is an awareness device. It does not automatically expand cross-domain
  regression execution.
