# Administration and Review API

## Match review

```http
GET /api/v1/admin/match-reviews
GET /api/v1/admin/match-reviews/{reviewId}
POST /api/v1/admin/match-reviews/{reviewId}/approve
POST /api/v1/admin/match-reviews/{reviewId}/reject
```

## Ingestion operations

```http
GET /api/v1/admin/ingestion/runs
POST /api/v1/admin/ingestion/runs/{runId}/cancel
POST /api/v1/admin/quarantine/{itemId}/retry
POST /api/v1/admin/observations/{observationId}/replay
```

## Retailer adapters

```http
POST /api/v1/admin/retailers/{retailerId}/pause
POST /api/v1/admin/retailers/{retailerId}/resume
```

## Safety

Administrative commands require:

- elevated role,
- audit log,
- reason or note where destructive,
- correlation identifier,
- optional step-up authentication for critical operations.
