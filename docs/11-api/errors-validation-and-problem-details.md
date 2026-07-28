# Errors, Validation and Problem Details

## Standard error format

Use a problem-details-compatible response:

```json
{
  "type": "https://errors.example.test/validation-error",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more request fields are invalid.",
  "instance": "/api/v1/watch-subscriptions",
  "correlationId": "uuid",
  "errors": [
    {
      "field": "targetPrice.amount",
      "code": "must_be_positive",
      "message": "Target price must be greater than zero."
    }
  ]
}
```

## Error categories

```text
400 malformed request
401 unauthenticated
403 unauthorized
404 resource not found
409 conflict
412 precondition failed
422 business validation
429 rate limited
500 internal error
503 temporary unavailable
```

## Rule

Do not expose stack traces, SQL text, internal file paths or secrets.
