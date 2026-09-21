# 02. Scope And Constraints

## Example

In scope:

- `POST /orders` para crear ordenes.
- `GET /orders/{orderId}` para consultar estado.
- Validacion sincronica contra `Product Catalog API`.
- Persistencia de ordenes aceptadas.
- Procesamiento asincronico de fulfillment.
- Notificacion posterior cuando la orden queda terminal.

Out of scope:

- Pagos. OrderFlow `MUST NOT` implementar autorizacion, captura, refund o conciliacion de pagos.
- Inventario real-time complejo.
- UI de administracion.
- Analitica historica.

Constraints:

- AWS se usa como referencia concreta.
- Compute de referencia: ECS/Fargate.
- DynamoDB es el data store operacional de ordenes.
- Los consumidores asumen entrega at-least-once.
- No se usan nombres, estandares ni datos de organizaciones reales.

## How To Use This In A Real Project

**Purpose:** evitar crecimiento accidental y dejar claro que decisiones son constraints.

**What belongs here:** in/out scope, non-goals, constraints regulatorios, tecnologicos y organizacionales.

**What does NOT belong here:** preferencias personales o herramientas agregadas solo por sofisticacion.

**Owner / reviewers:** Solution Architect, Product, Tech Lead, Security y Platform cuando aplique.

**When required:** `REQUIRED`.

**Common mistakes:** no declarar non-goals; presentar decisiones reversibles como restricciones absolutas.

**Implementation handoff:** el equipo sabe que no debe construir pagos ni endpoints extra.

