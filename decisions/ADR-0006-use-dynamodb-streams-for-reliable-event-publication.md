# ADR-0006: Use DynamoDB Streams For Reliable Event Publication

Status: Accepted

## Context

After creating an order, OrderFlow must publish `order.created.v1`. Writing DynamoDB and publishing EventBridge in the same request risks a dual-write failure.

## Decision Drivers

- Avoid acknowledging an order while losing its event.
- Keep DynamoDB as source of truth for accepted orders.
- Use AWS-native stream mechanism in the reference architecture.

## Options Considered

- Publish to EventBridge directly after DynamoDB write.
- Use DynamoDB Streams and a Lambda outbox-style publisher.
- Use DynamoDB Streams and an ECS stream consumer.
- Store an explicit outbox table in a relational database.

## Decision

Enable DynamoDB Streams on `DATA-ORDERS` and implement `CMP-OUTBOX-PUBLISHER` as Lambda to publish domain events to EventBridge from stream records.

## Consequences

Event publication is eventually consistent. Lambda event-source mapping handles stream shard polling and checkpointing, reducing custom operational logic. The publisher must still be idempotent and observable.

## Risks / Trade-offs

Stream processing adds operational complexity and requires careful event mapping. Lambda has execution limits and batch-failure behavior that Platform/SRE must configure. It avoids the more serious dual-write gap and is simpler for this reference example than documenting custom ECS shard coordination.

## Related Artifacts

- [05-containers.md](/docs/architecture/05-containers.md)
- [sequence-create-order.mmd](/diagrams/sequence-create-order.mmd)

Supersedes: none. Superseded-by: none.
