# 14. Observability

## Example

Logs are structured JSON with at least:

`timestamp`, `level`, `service`, `environment`, `correlationId`, `traceId`, `orderId`, `eventId` when applicable.

Metrics:

- request rate, error rate, latency.
- DynamoDB throttling/system errors.
- queue depth and age of oldest message.
- DLQ messages.
- worker processing duration.
- retry count.
- notification failures.

Tracing: `X-Correlation-Id` and W3C trace context propagate from HTTP into events. Event envelope stores `correlationId` and `causationId` so async traces can be connected.

Example SLI/SLO:

- SLI: percentage of accepted orders that reach terminal state within 5 minutes.
- SLO: 99% over rolling 7 days.
- Measurement: `order.created.v1` timestamp to `order.fulfilled.v1` or `order.rejected.v1`.
- Alert: burn-rate alert when error budget consumption exceeds 2% in 1 hour or 5% in 6 hours.

## How To Use This In A Real Project

**Purpose:** ensure the architecture can be operated and debugged.

**What belongs here:** log fields, metrics, traces, SLOs and alert examples.

**What does NOT belong here:** dashboard pixel layout or every log line.

**Owner / reviewers:** SRE/Platform with Tech Lead.

**When required:** `REQUIRED`.

**Common mistakes:** saying "good observability"; missing correlation across async hops.

**Implementation handoff:** teams can instrument services and build meaningful alarms.

