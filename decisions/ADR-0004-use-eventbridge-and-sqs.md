# ADR-0004: Use EventBridge And SQS

Status: Accepted

## Context

Fulfillment and notification have different scaling and failure behavior. Direct service-to-service calls would couple producers to consumers.

## Decision Drivers

- Route/fan-out domain events without producer knowing consumers.
- Use SQS for consumer isolation, retry and DLQ.
- Keep AWS reference architecture concrete.

## Options Considered

- EventBridge plus SQS queues.
- Direct HTTP calls between services.
- Single shared queue for all consumers.

## Decision

Use EventBridge for event routing and SQS queues per worker category, each with DLQ.

## Consequences

Consumers scale independently and failures are isolated. Event rules and queues must be managed as part of infrastructure.

## Risks / Trade-offs

More moving parts than direct calls. Requires observability for queue depth, oldest message age and DLQ.

## Related Artifacts

- [05-containers.md](/docs/architecture/05-containers.md)
- [12-scaling-and-concurrency.md](/docs/architecture/12-scaling-and-concurrency.md)

Supersedes: none. Superseded-by: none.

