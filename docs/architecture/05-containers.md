# 05. Containers

Source diagram: [c2-containers.mmd](/diagrams/c2-containers.mmd).

## Example

Containers:

- `CMP-ORDER-API`: servicio stateless en ECS/Fargate que expone HTTP.
- `DATA-ORDERS`: tabla DynamoDB que contiene metadata de orden, items, idempotency records y processed events.
- `CMP-OUTBOX-PUBLISHER`: Lambda suscrita a DynamoDB Streams que publica eventos a EventBridge.
- `CMP-FULFILLMENT-WORKER`: worker horizontal que consume SQS y actualiza estado.
- `CMP-NOTIFICATION-WORKER`: worker horizontal que consume eventos terminales y llama proveedor.
- EventBridge/SQS: routing y desacoplamiento.

Do not infer: numero exacto de subnets, librerias, nombres de repositorios de codigo o framework web.

## How To Use This In A Real Project

**Purpose:** definir grandes unidades deployables, data stores y responsabilidades.

**What belongs here:** containers, data ownership, protocolos principales, runtime responsibility y managed runtime elegido cuando afecta operacion.

**What does NOT belong here:** clases internas, estructura de paquetes o autoscaling exacto por ambiente.

**Owner / reviewers:** Solution Architect y Tech Lead; SRE revisa operabilidad.

**When required:** `REQUIRED`.

**Common mistakes:** llamar todo "microservice"; esconder colas o data stores detras de una caja generica.

**Implementation handoff:** el equipo sabe que unidades construir y desplegar.
