# 03. Quality Attributes

Los valores son ilustrativos del ejemplo, no universales.

| ID | Statement | Metric | Target | Measurement point | Validation | Owner | Related |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NFR-AVAILABILITY-001 | Order API SHOULD remain available during single task failure. | Monthly availability | 99.9% | API Gateway 5xx excluding client errors | Synthetic checks and CloudWatch alarms | Platform/SRE | CMP-ORDER-API |
| NFR-PERF-001 | Successful create order requests SHOULD stay within an illustrative end-to-end latency target, including the synchronous Product Catalog call. | p95 latency | <= 800 ms end-to-end | API Gateway + service trace | Load test with catalog stub and dependency timing | Tech Lead | API-ORDERS-V1 |
| NFR-PERF-002 | Accepted orders SHOULD begin fulfillment quickly. | Age of oldest message | <= 120 s p95 | fulfillment queue | Queue metric alarm | SRE | CMP-FULFILLMENT-WORKER |
| NFR-PERF-003 | Product Catalog SHOULD fit within its dependency budget for successful calls. | Catalog client p95 latency and timeout | <= 300 ms p95 successful response; 300 ms per-attempt timeout | Order API outbound trace span | Dependency contract/performance test | Tech Lead | Product Catalog API |
| NFR-DURABILITY-001 | Accepted orders MUST not be lost after successful persistence. | DynamoDB write durability | AWS regional service guarantee | DynamoDB | PITR enabled and write audit | Platform | DATA-ORDERS |
| NFR-SEC-001 | APIs MUST require authenticated callers. | Unauthorized access rate | 0 successful unauthenticated requests | API Gateway authorizer | Contract/security tests | Security | API-ORDERS-V1 |
| NFR-OBS-001 | Each order flow MUST be traceable end to end. | Trace/log correlation coverage | >= 95% sampled flows with correlationId | OpenTelemetry traces/logs | Observability tests | SRE | all components |
| NFR-COST-001 | Scaling SHOULD protect downstream dependencies and cost. | Max worker tasks | Environment-specific cap documented | ECS service | Capacity review | Platform/SRE | workers |

## How To Use This In A Real Project

**Purpose:** transformar atributos vagos en objetivos medibles.

**What belongs here:** statement, metrica, target, punto de medicion, validacion, owner y componentes relacionados.

**What does NOT belong here:** "alta disponibilidad" sin numero o targets inventados como promesa contractual.

**Owner / reviewers:** Solution Architect coordina; SRE, Security, Tech Lead y Product validan.

**When required:** `REQUIRED`.

**Common mistakes:** poner targets sin forma de medirlos; mezclar SLOs de usuario con metricas internas sin relacion.

**Implementation handoff:** el equipo conoce que tests y alarmas demuestran que la arquitectura se cumple.
