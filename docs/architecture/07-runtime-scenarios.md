# 07. Runtime Scenarios

## Example

Source diagrams:

- [sequence-create-order.mmd](/diagrams/sequence-create-order.mmd)
- [sequence-process-order.mmd](/diagrams/sequence-process-order.mmd)
- [sequence-failure-retry-dlq.mmd](/diagrams/sequence-failure-retry-dlq.mmd)

### Create Order Happy Path

Client sends `POST /orders` with JWT, `X-Correlation-Id` and `Idempotency-Key`. Order API validates input, calls Product Catalog with a 300 ms timeout and one retry for retryable 5xx/connectivity failures, stores order as `RECEIVED`, and returns `201`. DynamoDB Streams later drives event publication.

### Client Retry

If the same client retries with the same `Idempotency-Key` and equivalent request body, Order API `MUST` return the original result. If the same key is reused with a different body hash, Order API `MUST` return `409 IDEMPOTENCY_KEY_REUSED`.

### Catalog Unavailable

Order API uses timeout 300 ms, max 2 total attempts, exponential backoff starting at 50 ms plus jitter. If catalog still fails, Order API returns `503 CATALOG_UNAVAILABLE`. No order is persisted.

### Duplicate Event

Workers `MUST` treat event delivery as at-least-once. Before applying side effects, a worker writes `PROCESSED_EVENT#<eventId>` conditionally. Duplicate events produce no duplicate state transition or notification.

### Worker Crash

If a worker crashes after receiving a message, SQS visibility timeout expires and the message is redelivered. Conditional writes and processed-event records prevent duplicate effects.

### Poison Message

After 5 failed receives, SQS moves the message to DLQ. An alarm fires on `ApproximateNumberOfMessagesVisible > 0` for 5 minutes. Recovery requires inspection, correction or replay with a new audit note.

### Traffic Spike

Fulfillment scales by backlog per task and age of oldest message, not CPU alone. Backpressure caps max tasks and concurrency to protect DynamoDB and external dependencies.

### Notification Provider Unavailable

The order remains `FULFILLED` or `REJECTED`. Notification failure `MUST NOT` revert order state. Notification Worker retries independently and may DLQ the notification message.

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

