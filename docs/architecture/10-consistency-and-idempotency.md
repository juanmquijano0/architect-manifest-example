# 10. Consistency And Idempotency

Source diagram: [order-state-machine.mmd](/diagrams/order-state-machine.mmd).

## Example

OrderFlow does not depend on exactly-once delivery. It assumes at-least-once for events and client retries.

Valid states:

- `RECEIVED`
- `PROCESSING`
- `FULFILLED`
- `REJECTED`

Valid transitions:

- `RECEIVED -> PROCESSING`
- `PROCESSING -> FULFILLED`
- `PROCESSING -> REJECTED`

Invalid transitions:

- Terminal states `MUST NOT` change.
- `RECEIVED -> FULFILLED` `MUST NOT` skip processing.
- `REJECTED -> FULFILLED` `MUST NOT` occur.

Duplicate requests: `POST /orders` stores `Idempotency-Key`, request hash and response. Same key plus same hash returns original result. Same key plus different hash returns `409`.

Duplicate events: workers conditionally write `PROCESSED_EVENT#<eventId>` before non-idempotent side effects. Duplicate records cause no-op.

Ordering: per-order state transitions rely on DynamoDB conditional writes, not broker ordering.

Eventual consistency: clients may receive `201` before fulfillment starts. `GET /orders/{orderId}` returns current known state.

Race conditions: all status updates include expected previous state and increment version.

## How To Use This In A Real Project

**Purpose:** prevent hidden assumptions about delivery, retries and concurrent updates.

**What belongs here:** idempotency keys, duplicate handling, state machine, concurrency and ordering assumptions.

**What does NOT belong here:** exact library implementation or local variable names.

**Owner / reviewers:** Solution Architect and Tech Lead; SRE reviews retry side effects.

**When required:** `REQUIRED` for distributed flows.

**Common mistakes:** claiming exactly-once; missing terminal-state rules.

**Implementation handoff:** developers know which operations need conditional writes and duplicate detection.

