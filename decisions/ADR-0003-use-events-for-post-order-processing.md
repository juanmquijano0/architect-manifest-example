# ADR-0003: Use Events For Post-Order Processing

Status: Accepted

## Context

Creating an order should not wait for fulfillment and notification. Post-order work may take longer and fail independently.

## Decision Drivers

- Keep create order latency bounded.
- Allow fulfillment and notification to scale independently.
- Make terminal state changes visible to consumers.

## Options Considered

- Synchronous processing inside `POST /orders`.
- Async processing using domain events.
- Scheduled polling of newly created orders.

## Decision

Persist accepted orders first, then use domain events for post-order processing.

## Consequences

Clients observe eventual consistency. Consumers must be idempotent and tolerate duplicate delivery.

## Risks / Trade-offs

Async flows are harder to trace and operate. Observability and DLQ strategy are required.

## Related Artifacts

- [07-runtime-scenarios.md](/docs/architecture/07-runtime-scenarios.md)
- [order-events.yaml](/contracts/asyncapi/order-events.yaml)

Supersedes: none. Superseded-by: none.

