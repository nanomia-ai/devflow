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

## E. 해석에 따라 제품 약속이 달라지는 짧은 brief

이 사례가 없으면 Product가 문서 항목을 설문처럼 묻지 않으면서도 중요한 제품 질문을 찾아내는지
알 수 없다.

### 첫 요청

Product를 사용해 동네 공방이 수업을 등록하고 수강생이 예약과 결제를 할 수 있는 서비스를 정의해 주세요.
운영자는 공방을 승인합니다.

### 사용자 후속 답변

이 제품은 공방 주인이 전화와 메신저로 받던 예약을 한곳에서 관리하도록 돕는 것이 우선입니다.
여러 공방을 비교하거나 추천하는 서비스가 되는 것은 현재 목적이 아닙니다.

### 관찰 기준

- 첫 요청만으로 완성된 Product를 지어내지 않는다.
- 사용자·가치·불변식 같은 문서 항목을 차례대로 묻지 않는다.
- 현재 이해와 가능한 다른 해석이 제품 약속을 어떻게 바꾸는지 설명한 뒤, 두 방향을 가르는 질문을 한다.
- 후속 답변에서 정해진 목적을 반영하고 결제 제공자·화면·기술 구조는 묻지 않는다.
- 사용자가 명시적으로 제외한 비교·추천은 경계로 남길 수 있지만 다른 non-goal을 추가하지 않는다.
