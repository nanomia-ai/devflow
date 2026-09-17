# Frozen cases and answer keys

These answer keys were written before the fresh sessions ran. They are observer material and are not
part of the fixture's project knowledge.

## Case 1 — product boundary

### Question

RelayBox에 새 요구가 들어왔다. 보내는 쪽이 URL을 주지 않아도 RelayBox가 payload를 분석해 목적지를
찾아주고, payload schema도 최신 버전으로 변환해야 한다. 이 요구는 현재 제품 경계 안인가? 지금의
canonical home과 다음 행동을 답하고, 실제로 연 `.devflow/` 문서를 모두 열거하라.

### Answer key

- **Must read:** `.devflow/index.md`, `.devflow/project/product.md`.
- **Must not read:** Architecture와 그 조건부 child, 두 Domain 문서, Work spec/state.
- **Canonical home:** `.devflow/project/product.md`.
- **Expected next action:** 현재 요구를 구현으로 보내지 않는다. 목적지 자동 발견과 payload 변환은 둘 다
  현재 비범위이므로, 요구를 철회하거나 제품 경계를 바꾸려면 Product 판단으로 보낸다.
- **Reason:** 질문은 기술 방법이나 Domain 상태가 아니라 제품이 책임지는 기능의 경계를 바꾼다. Index가
  이 질문을 Product로 직접 route하며 Product 문서가 명시적 목적지와 opaque payload 경계를 소유한다.

## Case 2 — one Domain only

### Question

Delivery가 목적지에서 HTTP 409를 받았다. 현재 job 상태와 재시도 여부는 무엇인가? canonical home과
다음 행동을 답하고, 실제로 연 `.devflow/` 문서를 모두 열거하라.

### Answer key

- **Must read:** `.devflow/index.md`, `.devflow/project/domains/delivery/index.md`.
- **Must not read:** Product, Architecture와 그 child, Intake Domain, Work spec/state.
- **Canonical home:** `.devflow/project/domains/delivery/index.md`.
- **Expected next action:** job을 terminal `rejected`로 기록하고 재시도하지 않는다.
- **Reason:** HTTP 응답을 delivery outcome으로 분류하는 규칙은 Delivery Domain만 소유한다. 409는
  retryable로 열거된 408/429/5xx가 아닌 4xx이므로 terminal rejection이다.

## Case 3 — interrupted Work

### Question

중단된 `W-spool-replay-7k2p`를 지금 이어가려 한다. 어느 route에서 어떤 한 행동을 먼저 해야 하는가?
판단에 필요한 canonical/coordination home과 실제로 연 `.devflow/` 문서를 모두 열거하라.

### Answer key

- **Must read:** `.devflow/index.md`, `.devflow/work/W-spool-replay-7k2p/state.md`,
  `.devflow/work/W-spool-replay-7k2p/spec.md`, `.devflow/project/architecture.md`,
  `.devflow/project/architecture/local-spool.md`.
- **Must not read:** Product and both Domain documents.
- **Canonical home:** `state.md` owns the current route and next action; `spec.md` owns the change
  contract; Architecture parent plus `local-spool.md` own the implementation constraint.
- **Expected next action:** Continue on the `work` route and implement one oldest-first replay step
  that preserves the idempotency key and removes the spool file only after durable queue insertion is
  confirmed.
- **Reason:** State supplies the current coordinate, the selected Work requires its spec, and the
  spec's `read_first` names a conditional Architecture child. The child cannot be opened without its
  nearest parent, and unrelated product/domain knowledge cannot change this next action.
