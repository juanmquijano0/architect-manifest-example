# OrderFlow Architecture Manifest

`OrderFlow` es un sistema ficticio de procesamiento de ordenes para `Acme Retail`. Permite que un cliente autenticado cree una orden, consulte su estado y reciba una notificacion cuando el procesamiento termina.

Este manifesto separa decisiones conceptuales de decisiones especificas de AWS. La arquitectura concreta usa API Gateway, ECS/Fargate, Lambda, DynamoDB, DynamoDB Streams, EventBridge, SQS, CloudWatch/OpenTelemetry, Secrets Manager, KMS e IAM. Estas tecnologias son una referencia pedagogica, no la unica arquitectura correcta.

## Normative Language

Este repositorio usa:

- `MUST`: decision obligatoria para mantener coherencia arquitectonica.
- `MUST NOT`: prohibicion explicita.
- `SHOULD`: recomendacion fuerte que puede romperse con justificacion.
- `MAY`: decision local dejada al equipo implementador.

Evita frases ambiguas como "manejar errores apropiadamente". Cada retry, timeout, estado, contrato o decision relevante debe ser concreta o quedar como open question con owner.

## Manifest Sources Of Truth

La narrativa humana vive en este documento y en `docs/architecture`. La metadata machine-readable vive en [manifest/architect-manifest.yaml](/manifest/architect-manifest.yaml). Los contratos viven en `contracts/`. Los diagramas Mermaid en `diagrams/` son la fuente de verdad visual.

No dupliques contratos completos en Markdown. Enlazalos y explica las decisiones alrededor de ellos.

## Solution Summary

OrderFlow acepta ordenes por HTTP, valida productos contra un `Product Catalog API` externo, persiste una orden aceptada en DynamoDB y publica eventos de dominio de forma confiable usando DynamoDB Streams con una Lambda outbox publisher. EventBridge enruta eventos hacia colas SQS. `Fulfillment Worker` procesa la orden y la mueve a `FULFILLED` o `REJECTED`. `Notification Worker` consume eventos terminales y llama a un `Notification Provider` externo con una key estable de deduplicacion.

Pagos esta deliberadamente fuera del alcance. Esta V1 busca mantener el dominio pequeno para concentrarse en contratos, datos, consistencia, resiliencia y handoff.

## Architecture Map

| Concern | Primary artifact | Machine-readable source |
| --- | --- | --- |
| Context and goals | [01-context-and-goals.md](/docs/architecture/01-context-and-goals.md) | [architect-manifest.yaml](/manifest/architect-manifest.yaml) |
| Scope and constraints | [02-scope-and-constraints.md](/docs/architecture/02-scope-and-constraints.md) | manifest constraints |
| Quality attributes | [03-quality-attributes.md](/docs/architecture/03-quality-attributes.md) | manifest quality attributes |
| C4 views | [04](/docs/architecture/04-system-context.md), [05](/docs/architecture/05-containers.md), [06](/docs/architecture/06-components.md) | Mermaid files |
| Runtime scenarios | [07-runtime-scenarios.md](/docs/architecture/07-runtime-scenarios.md) | sequence Mermaid files |
| HTTP contract | [08-interfaces-and-communication.md](/docs/architecture/08-interfaces-and-communication.md) | [orders-api.yaml](/contracts/openapi/orders-api.yaml) |
| Events | [08-interfaces-and-communication.md](/docs/architecture/08-interfaces-and-communication.md) | [order-events.yaml](/contracts/asyncapi/order-events.yaml) |
| Data | [09-data-architecture.md](/docs/architecture/09-data-architecture.md) | manifest data stores |
| Consistency | [10-consistency-and-idempotency.md](/docs/architecture/10-consistency-and-idempotency.md) | state machine diagram |
| Resilience | [11-resilience.md](/docs/architecture/11-resilience.md) | manifest risks |
| Scaling | [12-scaling-and-concurrency.md](/docs/architecture/12-scaling-and-concurrency.md) | quality attributes |
| Security | [13-security.md](/docs/architecture/13-security.md) | implementation constraints |
| Observability | [14-observability.md](/docs/architecture/14-observability.md) | NFRs/SLOs |
| Deployment | [15-deployment-and-infrastructure.md](/docs/architecture/15-deployment-and-infrastructure.md) | deployment diagram |
| Testing and fitness functions | [17-testing-strategy.md](/docs/architecture/17-testing-strategy.md) | npm scripts |
| Risks and open questions | [19-risks-and-open-questions.md](/docs/architecture/19-risks-and-open-questions.md) | manifest risks/open questions |
| Acceptance | [20-architecture-acceptance.md](/docs/architecture/20-architecture-acceptance.md) | validation scripts |

## Decisions

Accepted decisions are in [decisions/](/decisions/README.md):

- `ADR-0001`: use DynamoDB for orders.
- `ADR-0002`: use REST for the public Order API.
- `ADR-0003`: use events for post-order processing.
- `ADR-0004`: use EventBridge and SQS for routing and consumer isolation.
- `ADR-0005`: use `Idempotency-Key` for order creation.
- `ADR-0006`: use DynamoDB Streams for reliable event publication.

## Using This Manifest With An AI Coding Agent

Una IA implementadora `MUST` tratar contratos, ADRs aceptados y restricciones como fuentes autoritativas. `MUST NOT` inventar decisiones que contradigan el manifest. `MUST` reportar contradicciones entre artefactos. `MUST` convertir informacion arquitectonicamente significativa faltante en una pregunta u open question. `MAY` tomar decisiones locales de implementacion solo cuando el manifest las deje abiertas explicitamente.

Ejemplo de prompt:

```text
Implement CMP-FULFILLMENT-WORKER respecting ADR-0003, ADR-0004,
ADR-0006, EVT-ORDER-CREATED-V1, DATA-ORDERS, NFR-PERF-002,
and the idempotency rules in docs/architecture/10-consistency-and-idempotency.md.
If any required architectural decision is missing or contradictory, stop and report it.
```

## How To Evolve This Manifest

Cambios a contratos deben modificar la fuente machine-readable y sus ejemplos. Cambios significativos de arquitectura deben agregar o actualizar ADRs. Nuevos riesgos u open questions deben tener ID, owner role y etapa objetivo de resolucion.

Una arquitectura lista para implementar no esta completa para siempre. Esta lista para que el equipo pueda construir sin inventar decisiones estructurales.
