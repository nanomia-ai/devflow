# Foundation target precommitted cases

## A. Clear headless product brief

### Prompt

Use Product to establish a new project named Incident Relay.

Incident Relay is a headless service for platform teams. Service operators register monitored
services and decide which responder group should receive incidents. Monitoring systems submit
events. The product groups repeated events for the same service and fingerprint into one open
incident, routes that incident to the configured responder group, and records acknowledgement and
resolution. It does not provide a UI, issue credentials, monitor services itself, or guarantee an
external notification provider's delivery.

Use these terms: `event` is one monitoring observation; `incident` is the grouped operational
problem; `routing policy` maps a monitored service to a responder group. One service and fingerprint
may have at most one open incident. Incident lifecycle and routing policy are distinct business
knowledge boundaries. No product question remains open.

### Answer key

- Must read: Product target, project gate, project-knowledge contract, fixture `AGENTS.md`, and Git
  state. There is no prior project canon.
- Expected writes: `.devflow/index.md`, `project/product.md`, and exactly two Domain parents for
  incident lifecycle and routing policy. Names may vary when their meanings do not.
- Expected ownership: Product holds users, value, scope/non-scope, shared terms, and cross-domain
  composition. The one-open-incident invariant belongs only to Incident lifecycle; each Domain
  holds its own business rules and contract with the other Domain.
- Expected route: `architecture` to decide technical boundaries and verification channels.
- Must not do: create Architecture/Design placeholders, choose stack or components, turn
  capabilities into one Domain each, duplicate detailed rules in index, or invent open questions.

## B. Architecture for the headless product

### Prompt

Use Architecture on the published Incident Relay Product. The approved technical constraints are:
Node.js 24, one deployable HTTP service, SQLite for durable local state, outbound provider adapters
behind one port, and `node:test` plus executable HTTP integration tests as the default verification
channels. Deployment topology beyond a single instance and the external provider's delivery
semantics are still unknown; preserve those unknowns instead of deciding them. There is no user
interface.

### Answer key

- Must read: Architecture target and references, index, Product, both Domain parents, and Git.
- Expected write: `project/architecture.md`; a child is unnecessary unless one concern is genuinely
  optional and independently changeable in this small project.
- Expected content: environment, components, dependency direction, runtime/data flow, public seams,
  verification channels, explicit unknowns, and `Design does not apply` with its reason.
- Expected route: `direct` for the first executable change; no Design file.
- Must not do: change product or Domain meaning, invent multi-instance deployment/provider
  guarantees, or create code/tasks.

## C. Design applicability control

On the backend result, explicit Design invocation must read the Architecture applicability
statement, make no project change, and route to `direct`.

## D. UI foundation

The authored UI input has complete Product and Architecture documents and Architecture explicitly
requires Design for an operator dashboard. Fresh Design must create one self-contained
`project/design.md`, keep business lifecycle rules in Domain canon and technical seams in
Architecture, update the index only for the new UI question route, and route to `direct`. It must
not create component-per-file children or implementation code. The supplied desktop and
narrow-tablet classes may guide responsive behavior and review viewports, but an exact supported
width boundary remains open unless Product or Architecture establishes it.
