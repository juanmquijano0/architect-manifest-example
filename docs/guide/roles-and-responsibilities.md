# Roles And Responsibilities

El Architect Manifest es colaborativo. El arquitecto no debe fingir ser DBA, Security Engineer y SRE al mismo tiempo.

| Role | Produces | Reviews |
| --- | --- | --- |
| Solution Architect | Scope, context, trade-offs, ADRs, acceptance | Coherence across all artifacts |
| Tech Lead | Component boundaries, implementation constraints, testability | Runtime scenarios, contracts |
| Developers | Local design, tests, examples, implementation feedback | Feasibility and ambiguity |
| DBA / Data specialist | Data model review, access pattern validation | DynamoDB partitioning, retention, backup |
| Security | Threat model, auth, IAM, secrets, logging controls | Security decisions and risks |
| Platform / SRE | Deployment, scaling, SLOs, alarms, runbooks | Operability and CI validation |
| Product / Business | Goals, scope, non-goals, business impact | Assumptions and open questions |

## Example

In OrderFlow, Solution Architecture defines that workers scale by queue backlog. SRE reviews target latency and alarm strategy. Developers decide implementation libraries inside those constraints.

## How To Use This In A Real Project

**Purpose:** avoid hidden ownership gaps.

**What belongs here:** owner role, reviewer role and collaboration points.

**What does NOT belong here:** real names in public examples or ownership theater without decision authority.

**Owner / reviewers:** Solution Architect owns the map; every role reviews its lane.

**When required:** `REQUIRED`.

**Common mistakes:** assigning all rows to architecture; leaving security or operations as late-stage review only.

**Implementation handoff:** a team should know who answers missing architectural questions.

