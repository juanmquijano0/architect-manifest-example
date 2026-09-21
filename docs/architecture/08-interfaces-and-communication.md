# 08. Interfaces And Communication

## Example

HTTP source of truth: [orders-api.yaml](/contracts/openapi/orders-api.yaml).

Event source of truth: [order-events.yaml](/contracts/asyncapi/order-events.yaml).

JSON Schema sources:

- [order-created.v1.schema.json](/contracts/schemas/order-created.v1.schema.json)
- [order-fulfilled.v1.schema.json](/contracts/schemas/order-fulfilled.v1.schema.json)
- [order-rejected.v1.schema.json](/contracts/schemas/order-rejected.v1.schema.json)

Rules:

- `API-ORDERS-V1` exposes only `POST /orders` and `GET /orders/{orderId}`.
- `Idempotency-Key` is required only for `POST /orders`.
- Error responses `MUST` include machine-readable `code`.
- Domain events use envelope fields `eventId`, `eventType`, `eventVersion`, `occurredAt`, `correlationId`, `causationId`, `aggregateId`, `producer` and `data`.
- Consumers `MUST` ignore additional fields they do not understand when compatible.
- Breaking event changes `MUST` create a new event version.

Domain event vs command vs integration message:

- Domain event: fact already happened, e.g. `order.created.v1`.
- Command: request to do work, e.g. "process this order"; not emitted as a public fact.
- Integration message: technical wrapper transported via SQS/EventBridge.

## How To Use This In A Real Project

**Purpose:** declare boundaries between services and consumers.

**What belongs here:** protocols, versioning, auth, headers, event types and compatibility rules.

**What does NOT belong here:** copying every schema property into prose.

**Owner / reviewers:** Tech Lead and Developers with Solution Architect; Security reviews auth.

**When required:** `REQUIRED` for every external API/event.

**Common mistakes:** Markdown drift from OpenAPI; event payloads without envelope or versioning.

**Implementation handoff:** code can generate clients/tests from contracts and know evolution rules.

