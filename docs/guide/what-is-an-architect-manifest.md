# What Is An Architect Manifest?

Un Architect Manifest es un repositorio de decisiones y artefactos arquitectonicos que puede leerse por humanos y validarse por herramientas. Su funcion es reducir ambiguedad antes de implementar.

## Example

En OrderFlow, el manifest declara que `POST /orders` `MUST` usar `Idempotency-Key`, que eventos se entregan at-least-once, que DynamoDB es owner del estado de ordenes y que EventBridge/SQS desacopla consumidores.

## How To Use This In A Real Project

**Purpose:** crear una fuente compartida para decisiones que afectan implementacion, operacion, seguridad y evolucion.

**What belongs here:** alcance, constraints, componentes, contratos, datos, NFRs medibles, riesgos, ADRs y escenarios no felices.

**What does NOT belong here:** cada clase, cada funcion, estilos de codigo triviales o configuraciones que Platform puede decidir sin cambiar la arquitectura.

**Owner / reviewers:** Solution Architect produce la columna vertebral; Tech Lead, Developers, Data, Security y SRE revisan sus preocupaciones.

**When required:** `REQUIRED`.

**Common mistakes:** escribir solo narrativa sin contratos; dibujar componentes sin responsabilidades; cerrar preguntas que necesitan especialistas.

**Implementation handoff:** un implementador debe saber que construir, que no inventar y donde preguntar.

