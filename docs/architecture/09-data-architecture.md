# 09. Data Architecture

## Example

### Access Patterns

| ID | Pattern | Consistency | Notes |
| --- | --- | --- | --- |
| AP-001 | Create order | Transactional conditional write | Create `ORDER`, `ITEM` and top-level `IDEMPOTENCY` records atomically. |
| AP-002 | Get order by `orderId` | Strongly consistent for immediate read; eventual acceptable later | Read `ORDER` and `ITEM` records by partition. |
| AP-003 | Get order items | Same partition query | No GSI needed. |
| AP-004 | Update order status conditionally | Conditional write | Requires expected state and version. |
| AP-005 | Detect processed event | Conditional write/read | Prevent duplicate worker effects. |
| AP-006 | Resolve create-order retry by `Idempotency-Key` | Strongly consistent read | Read `PK = IDEMPOTENCY#<idempotencyKey>` before creating another order. |

### DynamoDB Model

Table: `OrderFlowOrders`.

Primary key:

- `PK`: `ORDER#<orderId>`
- `SK`: item discriminator.

No GSI is required in V1 because no access pattern searches by customer, status or date. Adding a dashboard later would require a new access pattern and ADR or data design update.

Item types:

```json
{
  "PK": "ORDER#ord_01HXYZ",
  "SK": "META",
  "entityType": "ORDER",
  "orderId": "ord_01HXYZ",
  "customerId": "cus_123",
  "status": "RECEIVED",
  "version": 1,
  "correlationId": "corr_abc",
  "createdAt": "2026-09-21T10:15:00Z",
  "updatedAt": "2026-09-21T10:15:00Z"
}
```

```json
{
  "PK": "ORDER#ord_01HXYZ",
  "SK": "ITEM#001",
  "entityType": "ORDER_ITEM",
  "productId": "sku_100",
  "quantity": 2,
  "productSnapshot": {
    "name": "Everyday Backpack",
    "category": "bags"
  }
}
```

```json
{
  "PK": "IDEMPOTENCY#idem_789",
  "SK": "IDEMPOTENCY",
  "entityType": "IDEMPOTENCY_RECORD",
  "idempotencyKey": "idem_789",
  "orderId": "ord_01HXYZ",
  "requestHash": "sha256:...",
  "responseStatus": 201,
  "responseBodyRef": "ORDER#ord_01HXYZ",
  "expiresAt": 1790000000
}
```

`POST /orders` creation uses a DynamoDB transaction with conditional puts for the order metadata, order items and the idempotency record. The idempotency record is keyed by `Idempotency-Key`, not by `orderId`, because a retry arrives before the client necessarily knows the generated order ID.

```json
{
  "PK": "ORDER#ord_01HXYZ",
  "SK": "PROCESSED_EVENT#evt_456",
  "entityType": "PROCESSED_EVENT",
  "consumer": "CMP-FULFILLMENT-WORKER",
  "processedAt": "2026-09-21T10:16:20Z"
}
```

For `CMP-NOTIFICATION-WORKER`, a processed/success record is written only after the provider confirms the notification. Retries use the same provider deduplication key, so a crash after provider success but before local recording can be retried without intentionally creating a second customer notification when `ASM-002` holds.

Ownership: `DATA-ORDERS` is owned by OrderFlow. Other systems `MUST NOT` write directly to the table.

Lifecycle: for this reference example, `400 days` is an illustrative retention assumption for completed order records so cost and lifecycle can be discussed. `OPEN-002` remains the explicit question a real project must resolve before production design. Idempotency records use TTL after 24 hours. Processed-event records use TTL after 30 days unless audit needs change.

Durability/security: PITR enabled, AWS-managed regional durability, KMS encryption at rest, least-privilege IAM.

Hot partitions: `orderId` distributes writes. Traffic concentrating on one order is bounded by state machine transitions. If future access patterns query by customer/status, add explicit GSI design.

### Why This Is Enough Architecture Detail

The architect defines access patterns, keys, item types, consistency and lifecycle. Developers and data specialists can still optimize attribute names, SDK use, conditional expression syntax and test data factories without changing the architecture.

## How To Use This In A Real Project

**Purpose:** derive storage design from reads/writes, not from a vague entity list.

**What belongs here:** access patterns, keys, item types, consistency, lifecycle, retention, encryption and backup.

**What does NOT belong here:** every attribute validation already owned by API schema or every SDK expression.

**Owner / reviewers:** Solution Architect and Tech Lead; DBA/Data specialist reviews partitioning and lifecycle.

**When required:** `REQUIRED` for persisted business state.

**Common mistakes:** adding GSIs "just in case"; skipping conditional writes; hiding TTL/retention.

**Implementation handoff:** developers can implement repository behavior and know where not to add ad hoc queries.
