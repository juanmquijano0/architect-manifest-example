# 04. System Context

Source diagram: [c1-system-context.mmd](/diagrams/c1-system-context.mmd).

## Example

OrderFlow se ubica entre el cliente autenticado y dos sistemas externos: `Product Catalog API` para validar productos y `Notification Provider` para avisos al cliente. OrderFlow posee el estado operacional de la orden, pero no posee catalogo de productos ni canal de notificaciones.

Purpose: mostrar limites de sistema y dependencias externas.

Audience: Product, Architecture, Tech Lead, Security y SRE.

Elements: cliente, OrderFlow, Product Catalog API, Notification Provider, observability platform.

Relevant relationships: cliente usa HTTP; OrderFlow llama catalogo sincronico; OrderFlow envia notificaciones asincronicas.

Do not infer from the diagram: protocolos exactos, timeouts, retry policy, IAM, tablas o ownership interno. Eso vive en otros artefactos.

## How To Use This In A Real Project

**Purpose:** ubicar el sistema en su ecosistema.

**What belongs here:** actores, sistemas externos, responsabilidades y trust boundaries principales.

**What does NOT belong here:** componentes internos detallados o deployment.

**Owner / reviewers:** Solution Architect con Product, Security y Tech Lead.

**When required:** `REQUIRED`.

**Common mistakes:** dibujar infraestructura en C1; omitir sistemas externos incomodos.

**Implementation handoff:** el equipo sabe que dependencias deben mockearse o integrarse.

