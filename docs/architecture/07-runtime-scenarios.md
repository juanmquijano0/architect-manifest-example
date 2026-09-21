# 07. Runtime Scenarios

## Example

Source diagrams:

- [sequence-create-order.mmd](/diagrams/sequence-create-order.mmd)
- [sequence-process-order.mmd](/diagrams/sequence-process-order.mmd)
- [sequence-failure-retry-dlq.mmd](/diagrams/sequence-failure-retry-dlq.mmd)

### Create Order Happy Path

Client sends `POST /orders` with JWT, `X-Correlation-Id` and `Idempotency-Key`. Order API validates input, calls Product Catalog with a 300 ms per-attempt timeout and one retry for retryable 5xx/connectivity failures, stores order as `RECEIVED`, stores an idempotency record addressable by the key, and returns `201`. DynamoDB Streams later invokes `CMP-OUTBOX-PUBLISHER` as a Lambda publisher for EventBridge.

### Client Retry

If the same client retries with the same `Idempotency-Key`, Order API reads `PK = IDEMPOTENCY#<key>`. Same key plus equivalent request hash returns the previous `orderId` and result. Same key plus different body hash returns `409 IDEMPOTENCY_KEY_REUSED`.

### Catalog Unavailable

Order API uses timeout 300 ms per attempt, max 2 total attempts, exponential backoff starting at 50 ms plus jitter. If catalog still fails, Order API returns `503 CATALOG_UNAVAILABLE`. No order or idempotency success record is persisted.

### Duplicate Event

Workers `MUST` treat event delivery as at-least-once. For DynamoDB-only effects, a worker records `PROCESSED_EVENT#<eventId>` in the same conditional transaction as the state change. For external notification, the worker `MUST` use a stable provider idempotency/deduplication key derived from `eventId`; it records local success only after the provider confirms. Duplicate delivery may repeat the provider call, but with the same key.

### Worker Crash

If a worker crashes after receiving a message, SQS visibility timeout expires and the message is redelivered. Conditional writes and processed-event records prevent duplicate effects.

### Poison Message

After 5 failed receives, SQS moves the message to DLQ. An alarm fires on `ApproximateNumberOfMessagesVisible > 0` for 5 minutes. Recovery requires inspection, correction or replay with a new audit note.

### Traffic Spike

Fulfillment scales by backlog per task and age of oldest message, not CPU alone. Backpressure caps max tasks and concurrency to protect DynamoDB and external dependencies.

### Notification Provider Unavailable

The order remains `FULFILLED` or `REJECTED`. Notification failure `MUST NOT` revert order state. Notification Worker performs at most one provider call per SQS receive, using the same provider idempotency key on every retry. If the provider does not support deduplication, OrderFlow can only guarantee at-least-once notification attempts and duplicate customer notifications become possible; that must be resolved before production use.

### Concurrent Updates

State changes use conditional writes: current state must match allowed previous state and version. Invalid transitions fail with conditional check and are logged as concurrency conflicts.

## How To Use This In A Real Project

**Purpose:** make behavior observable under happy path and failure path.

**What belongs here:** sequence, retries, timeouts, state effects, idempotency and failure outcomes.

**What does NOT belong here:** framework-specific call stacks.

**Owner / reviewers:** Solution Architect, Tech Lead, SRE and Security when auth/failure behavior matters.

**When required:** `REQUIRED` for critical flows.

**Common mistakes:** documenting only happy path; saying "retry when needed" without limits.

**Implementation handoff:** developers can implement concrete behavior without inventing failure semantics.
