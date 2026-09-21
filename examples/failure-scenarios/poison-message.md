# Poison Message Example

Input: `order.created.v1` is delivered to `CMP-FULFILLMENT-WORKER`.

Failure: the worker fails validation due to a non-retryable payload defect not caught by schema validation.

Behavior:

1. Worker logs the failure with `eventId`, `orderId`, `correlationId` and `failureClass`.
2. Message is retried by SQS until max receive count `5`.
3. Message moves to fulfillment DLQ.
4. CloudWatch alarm notifies Platform/SRE owner role.
5. Operator inspects payload, records audit note and either replays after correction or archives.

Order state is not moved to terminal solely because the message entered DLQ.

