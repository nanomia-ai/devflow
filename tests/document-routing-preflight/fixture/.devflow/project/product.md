---
summary: RelayBox reliably delivers caller-addressed opaque webhook payloads; destination discovery and payload transformation are outside the product boundary.
read_when:
  - Read when deciding RelayBox's purpose, users, value, product vocabulary, cross-domain shape, or scope boundary.
---

# Product boundary

RelayBox serves internal producers that need a webhook job accepted independently from the eventual
network delivery. A producer supplies a job ID, a complete destination URL, and payload bytes.
RelayBox preserves that accepted intent and exposes no human-facing UI.

## Boundary

RelayBox accepts an explicitly addressed job, preserves the payload as opaque bytes, and attempts
delivery. It does not infer or discover a destination, inspect payload meaning, migrate payload
schemas, or manage destination configuration. Adding any of those responsibilities is a Product
boundary decision before it can become a change contract.

## Product shape

- **Intake** owns whether a submitted job becomes one accepted job.
- **Delivery** owns attempts and terminal or retryable outcomes after acceptance.

An accepted job keeps the same job ID, destination, and payload across both domains. Open questions
about a single domain's states or rules belong to that Domain's canonical index, not here.
