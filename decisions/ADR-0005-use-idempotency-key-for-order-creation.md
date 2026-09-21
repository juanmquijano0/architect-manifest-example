# ADR-0005: Use Idempotency-Key For Order Creation

Status: Accepted

## Context

Clients may retry `POST /orders` after timeouts or network errors. Without idempotency, retries could create duplicate orders.

## Decision Drivers

- HTTP POST is not naturally idempotent.
- Client retries are expected.
- Duplicate order creation has business impact.

## Options Considered

- Require `Idempotency-Key` header.
- Let clients search before retrying.
- Deduplicate by request body only.

## Decision

Require `Idempotency-Key` for `POST /orders`. Store key, request hash, generated `orderId` and response metadata in an item directly addressable as `PK = IDEMPOTENCY#<key>`. Same key and same hash returns original result. Same key and different hash returns `409`.

## Consequences

Order API must persist the idempotency record transactionally with order creation. Retries can resolve the previous result without knowing `orderId` in advance. Records use TTL.

## Risks / Trade-offs

Key storage adds complexity. TTL must be long enough for realistic client retry windows.

## Related Artifacts

- [orders-api.yaml](/contracts/openapi/orders-api.yaml)
- [10-consistency-and-idempotency.md](/docs/architecture/10-consistency-and-idempotency.md)

Supersedes: none. Superseded-by: none.
