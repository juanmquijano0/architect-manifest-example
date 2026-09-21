# 17. Testing Strategy

## Example

Test layers:

- Unit tests for state transitions, request validation and idempotency hash behavior.
- Integration tests for DynamoDB conditional writes and repository access patterns.
- OpenAPI contract tests for `API-ORDERS-V1`.
- AsyncAPI/schema validation for event envelopes and payloads.
- Consumer contract tests for workers.
- Idempotency tests for duplicate `POST /orders` and duplicate events.
- Concurrency tests for competing status updates.
- Failure injection for catalog timeout, provider timeout and worker crash.
- Retry/DLQ tests for poison messages.
- Load tests for API p95 and queue backlog behavior.
- Security tests for auth scopes and redaction.
- Infrastructure validation for IAM least privilege and encryption settings.

Architecture fitness functions in this repo:

- YAML/JSON parse.
- JSON Schema compile.
- manifest validates against schema.
- OpenAPI validates.
- AsyncAPI parses.
- Mermaid diagrams parse/render check.
- Markdown links resolve.
- Manifest file references exist.
- IDs are unique.
- ADRs listed in manifest exist.

## How To Use This In A Real Project

**Purpose:** tie tests to architectural decisions.

**What belongs here:** test categories and fitness functions that prove constraints.

**What does NOT belong here:** every test case implementation.

**Owner / reviewers:** Tech Lead, Developers, SRE and Solution Architect.

**When required:** `REQUIRED`.

**Common mistakes:** testing only business logic; ignoring contracts and failure modes.

**Implementation handoff:** teams know which architecture promises need automated evidence.

