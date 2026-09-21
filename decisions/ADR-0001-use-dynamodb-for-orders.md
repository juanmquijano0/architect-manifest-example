# ADR-0001: Use DynamoDB For Orders

Status: Accepted

## Context

OrderFlow stores operational order state and needs conditional writes, idempotency records and simple lookup by order ID.

## Decision Drivers

- Access patterns are key-value and per-order aggregate oriented.
- Horizontal scale and managed durability are useful for the reference architecture.
- Conditional writes are needed for state transitions and duplicate detection.

## Options Considered

- DynamoDB single-table design for order aggregate.
- Relational database with orders/order_items tables.
- Event store as primary source.

## Decision

Use DynamoDB for `DATA-ORDERS` with `PK = ORDER#<orderId>` and typed `SK` records.

## Consequences

The data model must be access-pattern driven. No speculative GSI is added. Future query needs require explicit design.

## Risks / Trade-offs

DynamoDB is less natural for ad hoc reporting and relational joins. Data specialists should review new access patterns.

## Related Artifacts

- [09-data-architecture.md](/docs/architecture/09-data-architecture.md)
- `DATA-ORDERS`

Supersedes: none. Superseded-by: none.

