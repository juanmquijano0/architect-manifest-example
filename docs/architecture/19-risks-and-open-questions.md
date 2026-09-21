# 19. Risks And Open Questions

## Example

### Assumptions

| ID | Assumption | Validation path |
| --- | --- | --- |
| ASM-001 | Product Catalog can respond within the latency budget for most requests. | Contract/performance validation with catalog owner. |
| ASM-002 | Notification Provider supports idempotent notification requests or duplicate suppression keys. | Provider documentation review. |

### Open Questions

| ID | Question | Why it matters | Owner role | Blocking | Target stage |
| --- | --- | --- | --- | --- | --- |
| OPEN-001 | What is the real notification provider rate limit per environment? | Determines max concurrency and retry policy. | Platform/SRE | Non-blocking for V1 docs | Before load test |
| OPEN-002 | What retention period is required for completed orders? | Affects storage, cost and compliance. | Product/Business | Non-blocking for example | Before production design |

### Risks

| ID | Description | Impact | Likelihood | Mitigation | Owner role | Related |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Catalog latency dominates create order latency. | Medium | Medium | Timeout, bounded retry, catalog SLO review | Tech Lead | CMP-ORDER-API |
| RISK-002 | Notification provider throttling causes DLQ growth. | Low business impact, medium ops impact | Medium | Rate-aware scaling, DLQ alarm, replay process | SRE | CMP-NOTIFICATION-WORKER |
| RISK-003 | Future query needs require new DynamoDB access patterns. | Medium | Medium | No speculative GSIs; add ADR when required | Data specialist | DATA-ORDERS |

## How To Use This In A Real Project

**Purpose:** make uncertainty visible instead of hiding it as fake precision.

**What belongs here:** assumptions, risks and open questions with owner and target stage.

**What does NOT belong here:** vague pending item without accountability.

**Owner / reviewers:** Solution Architect coordinates with all reviewer roles.

**When required:** `REQUIRED`.

**Common mistakes:** no owner; blocking status unclear; using risks to avoid decisions.

**Implementation handoff:** implementers know what is safe to assume and what needs escalation.

