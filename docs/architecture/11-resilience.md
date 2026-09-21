# 11. Resilience

## Example

| Dependency | Timeout | Retry | Backoff/jitter | Circuit breaker | Failure behavior | Alerting |
| --- | --- | --- | --- | --- | --- | --- |
| Product Catalog API | 300 ms per attempt | 1 retry for 5xx/connectivity, no retry for 4xx | 50 ms exponential + jitter | SHOULD open after sustained failures in runtime config | Return `503 CATALOG_UNAVAILABLE`; do not persist order or success idempotency record | 5xx/timeout rate > 5% for 5 min |
| DynamoDB writes | SDK timeout 500 ms | SDK retry for throttling/transient errors | AWS SDK adaptive retry | No app circuit breaker | Return 503 for create if write unavailable | throttling or system errors |
| DynamoDB Stream to EventBridge | Lambda timeout 10 s | Lambda event-source mapping retries failed stream batches; partial batch response SHOULD be enabled | Managed retry with bounded maximum record age and on-failure destination | No | Failed publish prevents checkpoint for that record until retry succeeds or failure destination receives record | Lambda errors, iterator age, failure destination |
| Fulfillment queue | visibility timeout 60 s | No app-level retry loop; SQS redelivery max 5 receives | queue redrive policy | No | DLQ after 5 failed receives | DLQ visible > 0 |
| Notification Provider | 500 ms | One provider call per SQS receive; SQS redelivery max 5 receives | queue redrive policy plus provider `Retry-After` when available | SHOULD protect provider during sustained 429/5xx | Do not revert order; DLQ notification after 5 failed receives | failure rate, DLQ |

Retries `MUST` be limited. A retryable error is timeout, connection reset, 429 when documented, or 5xx. Validation errors and authorization errors `MUST NOT` be retried automatically.

Retry layering rule: application code `MUST` document whether it retries inside one processing attempt or delegates retry to the platform. For Notification Provider, the example deliberately uses one external call per SQS receive and five receives, so the maximum expected provider calls for one event is five. For Product Catalog, the synchronous API path uses two total attempts inside one HTTP request because there is no queue redelivery layer.

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
