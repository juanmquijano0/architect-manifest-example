# Architect Manifest Example: OrderFlow

[![Validate architecture](https://github.com/juanmquijano0/architect-manifest-example/actions/workflows/validate-architecture.yml/badge.svg)](https://github.com/juanmquijano0/architect-manifest-example/actions/workflows/validate-architecture.yml)

Este repositorio es un ejemplo educativo de un **Architect Manifest** para `OrderFlow`, un sistema ficticio de procesamiento de ordenes de `Acme Retail`.

## What is this?

Un Architect Manifest es un conjunto versionable de artefactos que conecta decisiones de arquitectura con contratos, datos, escenarios de ejecucion, riesgos y criterios de aceptacion. No es un PDF monolitico: es una puerta de entrada humana con fuentes de verdad especializadas.

La entrada principal es [ARCHITECTURE_MANIFEST.md](/ARCHITECTURE_MANIFEST.md).

## Why does it exist?

Existe para reducir la perdida de contexto entre arquitectura e implementacion. Un developer, Tech Lead, especialista de datos, Security Engineer, SRE o agente de IA deberia poder leer este repositorio y saber que esta decidido, que esta fuera de alcance y que necesita resolverse antes de construir.

## What is it NOT?

No es un estandar oficial, una arquitectura universal, un reemplazo de especialistas ni una especificacion de ninguna empresa real. `Acme Retail`, `OrderFlow` y todos los componentes son ficticios.

No implementa la aplicacion OrderFlow. La V1 documenta una arquitectura navegable, validable y pedagogica.

## Start here

1. Lee [What is an Architect Manifest?](/docs/guide/what-is-an-architect-manifest.md).
2. Sigue el tutorial [GETTING_STARTED.md](/GETTING_STARTED.md).
3. Recorre el indice [ARCHITECTURE_MANIFEST.md](/ARCHITECTURE_MANIFEST.md).
4. Mira C1/C2 en [system context](/docs/architecture/04-system-context.md) y [containers](/docs/architecture/05-containers.md).
5. Revisa el escenario [Create order](/docs/architecture/07-runtime-scenarios.md).
6. Abre el contrato [OpenAPI](/contracts/openapi/orders-api.yaml).
7. Revisa el modelo de datos en [data architecture](/docs/architecture/09-data-architecture.md).
8. Lee un ADR, por ejemplo [ADR-0006](/decisions/ADR-0006-use-dynamodb-streams-for-reliable-event-publication.md).
9. Cierra con [architecture acceptance](/docs/architecture/20-architecture-acceptance.md).

## For each role

**Solution Architect:** empieza por [context and goals](/docs/architecture/01-context-and-goals.md), [scope](/docs/architecture/02-scope-and-constraints.md), ADRs y acceptance.

**Tech Lead:** revisa containers, components, runtime scenarios, consistency, resilience, scaling y testing strategy.

**Developer:** empieza por GETTING_STARTED, OpenAPI, AsyncAPI, schemas, data architecture y implementation handoff.

**DBA/Data specialist:** revisa access patterns, DynamoDB item model, consistency, retention, backup y hot partition considerations.

**Security:** revisa security, threat model, trust boundaries, IAM, secrets, encryption, logging y replay protection.

**SRE/Platform:** revisa deployment, observability, SLOs, scaling, DLQ, alarms y capacity/cost.

**AI coding agent:** lee [Using this manifest with an AI coding agent](/ARCHITECTURE_MANIFEST.md#using-this-manifest-with-an-ai-coding-agent) antes de implementar.

## Local validation

Requisitos locales: Node.js 20.19+ o Node.js 22 LTS, y npm.

```bash
npm ci
npm run validate
```

Opcionalmente puedes validar diagramas por separado:

```bash
npm run diagrams
```

CI ejecuta las mismas validaciones locales. Si algo no puede validarse localmente, no deberia existir una validacion magica solo en GitHub Actions.
