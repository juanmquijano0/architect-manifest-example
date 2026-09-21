# 12. Scaling And Concurrency

## Example

### Order API

`CMP-ORDER-API` is stateless and scales horizontally on ECS/Fargate. Primary scaling metric is request rate and p95 latency, with CPU as supporting signal. Example values: min 2 tasks, max 10 tasks per environment, adjusted by load testing.

### Fulfillment Worker

`CMP-FULFILLMENT-WORKER` scales by backlog per task and age of oldest message. CPU alone can be misleading because fulfillment is I/O-bound.

Illustrative settings:

- concurrency per task: 5 messages.
- max in-flight messages: `tasks * 5`.
- visibility timeout: 60 s.
- target oldest message age: 120 s p95.
- maximum scale: 20 tasks until downstream capacity is proven.
- backpressure: stop increasing consumers when DynamoDB throttling or fulfillment dependency errors exceed threshold.

### Notification Worker

Notification Worker uses lower concurrency to respect provider rate limits. Scaling `MUST` cap requests to the provider. More consumers can make an outage worse by amplifying retries.

## How To Use This In A Real Project

**Purpose:** define scaling signals and concurrency limits.

**What belongs here:** metrics, min/max illustrative ranges, queue visibility, backlog targets, downstream protection.

**What does NOT belong here:** exact production capacity promises without tests.

**Owner / reviewers:** SRE/Platform, Tech Lead and Solution Architect.

**When required:** `REQUIRED` for horizontally scaled services/workers.

**Common mistakes:** autoscale workers by CPU only; no max scale; no downstream protection.

**Implementation handoff:** teams know which metrics drive scaling and what must be load tested.

