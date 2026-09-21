# ADR-0002: Use REST For Public Order API

Status: Accepted

## Context

Clients need a simple API for create and read operations. The domain does not require streaming or low-latency binary RPC for public client access.

## Decision Drivers

- Broad client/tooling support.
- OpenAPI validation and contract tests are mature.
- Operations map naturally to resources.

## Options Considered

- REST over HTTPS.
- gRPC.
- GraphQL.

## Decision

Use REST over HTTPS for `API-ORDERS-V1` with OpenAPI as source of truth.

## Consequences

The API must expose only necessary endpoints. Errors must use machine-readable codes. Internal async work remains outside HTTP response timing.

## Risks / Trade-offs

REST can become inconsistent if teams add endpoints without contract discipline. OpenAPI validation is required.

## Related Artifacts

- [orders-api.yaml](/contracts/openapi/orders-api.yaml)
- [08-interfaces-and-communication.md](/docs/architecture/08-interfaces-and-communication.md)

Supersedes: none. Superseded-by: none.

