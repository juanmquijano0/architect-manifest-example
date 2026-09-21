# 06. Components

Source diagram: [c3-order-api-components.mmd](/diagrams/c3-order-api-components.mmd).

## Example

`CMP-ORDER-API` contains:

| Component | Responsibility |
| --- | --- |
| `OrderController` | Validates HTTP shape, auth context and headers according to OpenAPI. |
| `CreateOrderUseCase` | Coordinates catalog validation, idempotency and persistence. |
| `GetOrderUseCase` | Reads order state by order ID. |
| `CatalogClient` | Calls Product Catalog API with timeout/retry from resilience matrix. |
| `OrderRepository` | Encapsulates DynamoDB conditional writes and strongly consistent reads when required. |
| `IdempotencyService` | Stores and resolves duplicate `POST /orders` attempts. |
| `TelemetryMiddleware` | Propagates correlation and trace context. |

Implementation `MAY` choose package names and frameworks, but `MUST` preserve responsibilities and contract boundaries.

## How To Use This In A Real Project

**Purpose:** remove ambiguity inside important containers without designing every class.

**What belongs here:** architecturally relevant components, responsibilities and constraints.

**What does NOT belong here:** every method, DTO mapper, dependency injection module or folder name.

**Owner / reviewers:** Tech Lead produces detail with Solution Architect review.

**When required:** `CONDITIONAL`; required for containers with non-trivial responsibility.

**Common mistakes:** overdesigning code structure; leaving cross-cutting concerns like telemetry nowhere.

**Implementation handoff:** developers know where key rules belong.

