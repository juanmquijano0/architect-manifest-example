# Conventions

## Normative Language

`MUST`, `MUST NOT`, `SHOULD` y `MAY` tienen el significado definido en [ARCHITECTURE_MANIFEST.md](/ARCHITECTURE_MANIFEST.md#normative-language).

## IDs

Cada elemento importante usa un ID estable:

- `CMP-*` para componentes.
- `API-*` para APIs.
- `EVT-*` para eventos.
- `DATA-*` para data stores.
- `ADR-*` para decisiones.
- `NFR-*` para quality attributes.
- `RISK-*` y `OPEN-*` para riesgos y preguntas.

## C4

Este repositorio usa C4 oficial:

- C1 = System Context.
- C2 = Container.
- C3 = Component.
- Deployment es una vista separada.

Algunas organizaciones usan nombres internos distintos. En esos casos, el manifest `MUST` declarar el mapping para que lectores externos no confundan niveles.

## How To Use This In A Real Project

**Purpose:** reducir ambiguedad de lectura y automatizar trazabilidad.

**What belongs here:** lenguaje normativo, IDs, naming y fuentes de verdad.

**What does NOT belong here:** reglas de estilo de codigo sin impacto arquitectonico.

**Owner / reviewers:** Solution Architect y Tech Lead.

**When required:** `REQUIRED`.

**Common mistakes:** cambiar IDs cuando cambia un titulo; mezclar C3 con deployment.

**Implementation handoff:** un agente puede usar IDs para encontrar artefactos relacionados sin inferir.

