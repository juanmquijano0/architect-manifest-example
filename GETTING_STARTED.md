# Getting Started: Create An Order

Este tutorial sigue una historia completa: un cliente crea una orden y el sistema la procesa hasta notificar el resultado.

## 1. Requirement

El requerimiento funcional esta en [context and goals](/docs/architecture/01-context-and-goals.md): un cliente autenticado puede crear una orden con uno o mas productos y consultar su estado despues.

El non-goal relevante esta en [scope and constraints](/docs/architecture/02-scope-and-constraints.md): OrderFlow no procesa pagos.

## 2. C4 Context

Abre [c1-system-context.mmd](/diagrams/c1-system-context.mmd). Veras que el cliente interactua con OrderFlow y que OrderFlow depende de `Product Catalog API` y `Notification Provider`.

La decision que no debes inferir solo del diagrama: el diagrama no define protocolos, retries ni ownership de datos. Eso vive en contratos, resiliencia y datos.

## 3. Container View

Abre [c2-containers.mmd](/diagrams/c2-containers.mmd). `Order API` recibe HTTP, DynamoDB guarda ordenes, DynamoDB Streams invoca una Lambda outbox publisher para publicacion confiable, EventBridge enruta eventos y SQS desacopla workers.

## 4. Component View

Abre [06-components.md](/docs/architecture/06-components.md). `OrderController` valida el contrato HTTP, `CatalogClient` llama al catalogo y `OrderRepository` persiste con conditional writes. La publicacion de eventos derivados del stream ocurre fuera del Order API, en `CMP-OUTBOX-PUBLISHER`.

## 5. Sequence: Happy Path

Abre [sequence-create-order.mmd](/diagrams/sequence-create-order.mmd). El cliente envia `POST /orders` con `Idempotency-Key`, Order API valida el JWT, consulta catalogo, persiste `RECEIVED` y responde `201`.

La publicacion de `order.created.v1` ocurre despues de la escritura, por stream, para evitar dual-write.

## 6. HTTP Contract

El contrato fuente es [contracts/openapi/orders-api.yaml](/contracts/openapi/orders-api.yaml). Busca `POST /orders`:

- `Authorization` usa OIDC/JWT.
- `Idempotency-Key` es obligatorio.
- `X-Correlation-Id` permite trazabilidad.
- Errores tienen `code` machine-readable.

## 7. DynamoDB Access Pattern

En [09-data-architecture.md](/docs/architecture/09-data-architecture.md), `AP-001`, `AP-002` y `AP-006` derivan el modelo. La tabla usa `PK = ORDER#<orderId>` para metadata/items/processed events y `PK = IDEMPOTENCY#<key>` para resolver retries de create order sin conocer previamente el `orderId`.

## 8. Event Contract

Cuando una orden se acepta, el sistema produce `EVT-ORDER-CREATED-V1` con tipo `order.created.v1`. La fuente es [contracts/asyncapi/order-events.yaml](/contracts/asyncapi/order-events.yaml) y el payload reusable esta en [order-created.v1.schema.json](/contracts/schemas/order-created.v1.schema.json).

## 9. Worker, Retry And Idempotency

`Fulfillment Worker` consume el evento desde SQS. Si recibe el mismo evento dos veces, usa `PROCESSED_EVENT#<eventId>` dentro de la misma transaccion que cambia estado. `Notification Worker` usa una key estable de deduplicacion con el proveedor; sin soporte del proveedor, solo puede ofrecer at-least-once notification attempts.

Revisa [10-consistency-and-idempotency.md](/docs/architecture/10-consistency-and-idempotency.md) y [11-resilience.md](/docs/architecture/11-resilience.md).

## 10. Observability

Cada request y evento propaga `correlationId`. Logs JSON incluyen `service`, `traceId`, `orderId` y `eventId` cuando aplica. El SLO de procesamiento se define en [14-observability.md](/docs/architecture/14-observability.md).

## 11. ADR Trail

La historia termina conectando decisiones:

- [ADR-0002](/decisions/ADR-0002-use-rest-for-public-order-api.md) explica REST.
- [ADR-0005](/decisions/ADR-0005-use-idempotency-key-for-order-creation.md) explica retries del cliente.
- [ADR-0006](/decisions/ADR-0006-use-dynamodb-streams-for-reliable-event-publication.md) explica publicacion confiable.

Con eso viste como requirement, diagramas, contrato, datos, eventos, resiliencia y ADRs forman una sola arquitectura.
