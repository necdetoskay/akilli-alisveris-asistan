# Volume 14 — API Contracts, Application Services and Authorization Boundaries

This volume defines the client-facing and internal application interfaces of the Akıllı Alışveriş Asistanı.

---

## 1. API boundary

```text
Client
    ↓
API Contract
    ↓
Application Service
    ↓
Domain Service
    ↓
Persistence
```

The API layer validates requests, applies authorization, controls idempotency and maps errors.

---

## 2. Commands and queries

Queries read current state.

Commands request business actions such as:

```text
optimize basket
create watch subscription
approve product match
retry quarantined observation
pause retailer adapter
```

---

## 3. Search and catalog

The search API exposes interpreted intent, result confidence, canonical products, offers and price history.

---

## 4. Basket optimization

Basket optimization accepts products, quantities, substitutions and retailer preferences.

Large calculations may be asynchronous and return an optimization status resource.

---

## 5. Watchlists and alerts

Users can create, update, pause and resume product or basket subscriptions.

Alerts can be acknowledged or dismissed.

---

## 6. Administration

Review and ingestion endpoints require elevated permissions, audit records and correlation identifiers.

---

## 7. Errors

The API uses a standard problem-details response with field-level validation errors.

Sensitive internal details are never exposed.

---

## 8. Reliability

Retryable commands support idempotency keys.

Mutable resources support optimistic concurrency.

Changing result sets use cursor pagination.

---

## 9. Authorization

Authorization checks include:

- authenticated identity,
- role,
- specific permission,
- resource ownership,
- authentication strength for critical operations.

Internal workers use service identities.
