# 01. Context And Goals

## Example

OrderFlow permite a clientes autenticados crear ordenes y consultar su estado. La orden contiene uno o mas productos. Antes de aceptar la orden, `CMP-ORDER-API` consulta `Product Catalog API` para validar productos y guardar un snapshot minimo. Despues de persistir la orden, `CMP-FULFILLMENT-WORKER` procesa asincronicamente y produce `FULFILLED` o `REJECTED`. `CMP-NOTIFICATION-WORKER` notifica estados terminales.

Goals:

- `GOAL-001`: aceptar ordenes validas con un contrato HTTP estable.
- `GOAL-002`: procesar ordenes sin bloquear la respuesta HTTP en trabajo posterior.
- `GOAL-003`: hacer idempotentes retries de cliente y duplicados de eventos.
- `GOAL-004`: documentar fallos, decisiones y handoff para implementacion.

## How To Use This In A Real Project

**Purpose:** definir por que existe el sistema y que resultados debe habilitar.

**What belongs here:** capacidades, actores, dependencias externas, goals y non-goals enlazados.

**What does NOT belong here:** backlog detallado, historias de usuario completas o UI.

**Owner / reviewers:** Solution Architect con Product/Business y Tech Lead.

**When required:** `REQUIRED`.

**Common mistakes:** describir tecnologia antes de objetivos; ocultar dependencias externas.

**Implementation handoff:** el equipo entiende que capacidades implementar y que dependencias simular o integrar.

