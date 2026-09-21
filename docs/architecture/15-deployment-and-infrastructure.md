# 15. Deployment And Infrastructure

Source diagram: [deployment.mmd](/diagrams/deployment.mmd).

## Example

Environments: `dev`, `test`, `prod` are illustrative. Each environment has isolated AWS resources.

Deployment view includes:

- API Gateway / HTTP entry.
- ECS/Fargate services for Order API and workers.
- Lambda function for DynamoDB Streams to EventBridge publication.
- DynamoDB Orders table with streams enabled.
- EventBridge bus.
- SQS queues and DLQs.
- IAM roles per task/function.
- Secrets Manager for external credentials.
- KMS keys for encryption.
- CloudWatch/OpenTelemetry collector/export path.

Architecture decides trust boundaries, managed service choices, encryption expectation and deployable units. Platform/SRE decides VPC module details, subnet layout, exact IaC module structure and environment sizing.

## How To Use This In A Real Project

**Purpose:** show where the system runs and which infrastructure concerns are architectural.

**What belongs here:** environments, runtime nodes, managed services, security boundaries and operational dependencies.

**What does NOT belong here:** full AWS networking course or every Terraform variable.

**Owner / reviewers:** Platform/SRE with Solution Architect and Security.

**When required:** `REQUIRED`.

**Common mistakes:** mixing deployment with C4 container view; leaving IAM or secrets invisible.

**Implementation handoff:** Platform can build IaC without guessing major topology.
