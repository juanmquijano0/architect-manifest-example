# 11. Resilience

## Example

| Dependency | Timeout | Retry | Backoff/jitter | Circuit breaker | Failure behavior | Alerting |
| --- | --- | --- | --- | --- | --- | --- |
| Product Catalog API | 300 ms | 1 retry for 5xx/connectivity, no retry for 4xx | 50 ms exponential + jitter | SHOULD open after sustained failures in runtime config | Return `503 CATALOG_UNAVAILABLE`; do not persist order | 5xx/timeout rate > 5% for 5 min |
| DynamoDB writes | SDK timeout 500 ms | SDK retry for throttling/transient errors | AWS SDK adaptive retry | No app circuit breaker | Return 503 for create if write unavailable | throttling or system errors |
| EventBridge publish | 500 ms | retry by outbox publisher | exponential + jitter | No | Keep stream checkpoint unadvanced until publish succeeds or retry policy sends to operator queue | publish failures |
| Fulfillment queue | visibility timeout 60 s | SQS redelivery max 5 receives | queue redrive policy | No | DLQ after exhaustion | DLQ visible > 0 |
| Notification Provider | 500 ms | 3 attempts for 429/5xx/connectivity | exponential 100/250/500 ms + jitter | SHOULD protect provider during sustained 429/5xx | Do not revert order; DLQ notification after exhaustion | failure rate, DLQ |

Retries `MUST` be limited. A retryable error is timeout, connection reset, 429 when documented, or 5xx. Validation errors and authorization errors `MUST NOT` be retried automatically.

DLQ strategy: every worker queue has a DLQ, alarm, owner role and replay process. Replay `MUST` preserve original event ID and add an operator audit note.

Graceful degradation: catalog unavailable blocks new orders because product validation is mandatory. notification unavailable degrades customer communication only; order state remains terminal.

## How To Use This In A Real Project

**Purpose:** make failure behavior concrete by dependency.

**What belongs here:** timeout, retry, backoff, jitter, circuit breaker choice, fallback, idempotency, failure result and alerting.

**What does NOT belong here:** "use retries" without parameters.

**Owner / reviewers:** Tech Lead, SRE and Solution Architect.

**When required:** `REQUIRED` for external dependencies and async consumers.

**Common mistakes:** circuit breaker everywhere; retrying non-retryable errors; missing DLQ ownership.

**Implementation handoff:** developers implement bounded retries and SRE can build alarms.

