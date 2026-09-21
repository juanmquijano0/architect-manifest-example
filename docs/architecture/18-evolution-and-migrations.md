# 18. Evolution And Migrations

## Example

Event evolution:

- Additive optional fields are compatible.
- Consumers `MUST` ignore unknown fields.
- Removing/renaming required fields is breaking and requires `v2`.

API evolution:

- Backward-compatible changes may add optional response fields.
- Breaking changes require a new API version path or negotiated strategy.

Data evolution:

- New item types may be added when access patterns require them.
- New GSIs require explicit access pattern and capacity review.
- Migrations `MUST` include rollback/dual-read or compatibility plan when they affect existing orders.

## How To Use This In A Real Project

**Purpose:** define safe change rules before change pressure appears.

**What belongs here:** compatibility rules, migration triggers and deprecation expectations.

**What does NOT belong here:** future roadmap wishes without impact.

**Owner / reviewers:** Solution Architect, Tech Lead and Data/SRE reviewers.

**When required:** `CONDITIONAL`; required when APIs/events/data will live beyond one release.

**Common mistakes:** versioning only after breaking consumers.

**Implementation handoff:** teams can extend contracts without guessing compatibility.

