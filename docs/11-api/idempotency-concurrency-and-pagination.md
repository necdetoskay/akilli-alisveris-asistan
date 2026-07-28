# Idempotency, Concurrency and Pagination

## Idempotency

Commands that can be retried should accept:

```http
Idempotency-Key: uuid
```

Examples:

```text
create watch subscription
start basket optimization
approve match review
retry quarantine item
```

## Concurrency

Mutable resources should support optimistic concurrency using:

```http
ETag
If-Match
```

A stale update returns:

```text
412 Precondition Failed
```

## Cursor pagination

Use cursor pagination for changing datasets:

```http
GET /api/v1/alerts?cursor=opaque-token&limit=50
```

Response:

```json
{
  "items": [],
  "nextCursor": "opaque-token"
}
```

## Rule

Cursors are opaque to clients and must not expose database identifiers unnecessarily.
