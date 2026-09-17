---
summary: Queue Relay separates callback acceptance, queued delivery, retry policy, and metrics, with tests and staging observations as its verification channels.
read_when:
  - Read when a request changes runtime boundaries, callback transport, internal configuration, metrics, or verification.
---

# Technical boundary

`src/producer.js` accepts authenticated callbacks and emits a job with one delivery ID.
`src/consumer.js` delivers queued jobs. `src/retry-policy.js` chooses retry attempts, and
`src/config.js` exposes internal configuration. Metrics observe producer and consumer events through
their public event seams; neither side imports the other's implementation.

Callback acceptance owns a durable consumed-token registry shared by every producer instance. A
token is recorded atomically with acceptance and remains consumed across process restarts; the
storage implementation is local to the producer boundary.

Runtime flow is callback → producer acceptance → queue → consumer attempt → retry policy. The
public seams are the callback handler, queued job shape, and emitted operational events. Internal
configuration keys are not stored data, public API, or project terminology.

Unit and integration tests are the default verification channel. Timeout, retry, and external
transport claims additionally require staging or vendor evidence. The project has no user
interface, so Design does not apply. There are no open technical questions for the current local
transport; PushPort timeout and idempotency behavior is unknown.
