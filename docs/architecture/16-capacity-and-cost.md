# 16. Capacity And Cost

## Example

Illustrative capacity assumptions:

- Create order peak: 50 requests/second.
- Average order items: 3.
- Fulfillment processing p95: 2 seconds excluding downstream delays.
- Notification provider limit: 100 requests/minute per environment.

Cost drivers:

- DynamoDB write/read capacity or on-demand usage.
- ECS task count and CPU/memory.
- SQS/EventBridge request volume.
- Observability ingestion volume.
- DLQ/replay operational effort.

Cost controls:

- Bound worker max scale.
- Sample traces while preserving error traces.
- Avoid unnecessary GSIs.
- Retain idempotency and processed-event records with TTL.

## How To Use This In A Real Project

**Purpose:** make capacity assumptions explicit without pretending they are final production numbers.

**What belongs here:** workload assumptions, key cost drivers and validation plan.

**What does NOT belong here:** precise monthly bill without measured traffic.

**Owner / reviewers:** Product, SRE/Platform, Tech Lead and Solution Architect.

**When required:** `CONDITIONAL`; required when scale/cost affect architecture.

**Common mistakes:** no workload model; unbounded async consumers.

**Implementation handoff:** teams know what to load test and what caps protect cost.

