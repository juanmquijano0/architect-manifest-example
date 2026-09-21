# 13. Security

## Example

Trust boundaries:

- Public client to API Gateway.
- API Gateway to Order API.
- OrderFlow services to AWS managed services.
- OrderFlow to external Product Catalog and Notification Provider.

Authentication: `API-ORDERS-V1` requires OIDC/JWT. Tokens are validated at API entry. Required scope for create/read is `orders:write` and `orders:read`.

Authorization: caller can access only its own customer orders. Implementation must map authenticated subject to `customerId`; clients `MUST NOT` submit arbitrary `customerId` for another account.

Service identities: ECS tasks use IAM roles with least privilege. Workers can read their queues and update only required DynamoDB items.

Encryption: TLS in transit; DynamoDB, SQS, EventBridge archives if used, and secrets encrypted with KMS.

Secrets: external provider credentials live in Secrets Manager, never in code or logs.

Logging/redaction: tokens, credentials and sensitive payloads `MUST NOT` be logged. Logs may include `orderId`, `eventId`, `correlationId`.

STRIDE sample:

| Threat | Scenario | Mitigation |
| --- | --- | --- |
| Spoofing | Unauthenticated caller creates order | OIDC/JWT authorizer, required scopes |
| Tampering | Client changes order state directly | No public status update endpoint; conditional writes only in workers |
| Repudiation | User denies creating order | correlationId, request audit fields, authenticated subject |
| Information disclosure | Token logged accidentally | redaction middleware and log tests |
| Denial of service | Request spike overwhelms catalog | API rate limit, bounded catalog retries |
| Elevation of privilege | Worker role accesses all secrets | IAM least privilege per component |

Security decision vs implementation detail: requiring OIDC scopes is an architecture decision; selecting a specific JWT library is an implementation detail unless it affects compliance or interoperability.

## How To Use This In A Real Project

**Purpose:** expose security boundaries and required controls early.

**What belongs here:** auth, scopes, IAM, secrets, encryption, logging rules, threat scenarios and mitigations.

**What does NOT belong here:** real secrets, vendor credentials or exhaustive penetration-test procedure.

**Owner / reviewers:** Security with Solution Architect and Tech Lead.

**When required:** `REQUIRED`.

**Common mistakes:** treating security as a later checklist; logging payloads for convenience.

**Implementation handoff:** developers know mandatory controls and where Security must review.

