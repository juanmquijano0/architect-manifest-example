# Glossary

| Term | Meaning |
| --- | --- |
| Architect Manifest | Conjunto versionable de artefactos que documenta decisiones arquitectonicas, contratos, datos, escenarios, NFRs y handoff. |
| OrderFlow | Sistema ficticio de procesamiento de ordenes de Acme Retail. |
| Order API | Componente stateless que expone `POST /orders` y `GET /orders/{orderId}`. |
| Fulfillment Worker | Worker que procesa ordenes aceptadas y decide estado terminal. |
| Notification Worker | Worker que envia notificaciones cuando una orden queda terminal. |
| Domain event | Hecho de negocio ya ocurrido, por ejemplo `order.fulfilled.v1`. |
| Command | Intencion de hacer algo, por ejemplo "process order"; no se modela como evento de dominio. |
| Integration message | Mensaje tecnico usado para mover informacion entre sistemas. Puede transportar un evento de dominio. |
| Idempotency-Key | Header que permite tratar retries de `POST /orders` como una sola operacion logica. |
| DLQ | Dead-letter queue para mensajes que agotaron reintentos. |
| At-least-once | Modelo de entrega donde un mensaje puede llegar una o mas veces. Los consumidores deben ser idempotentes. |

