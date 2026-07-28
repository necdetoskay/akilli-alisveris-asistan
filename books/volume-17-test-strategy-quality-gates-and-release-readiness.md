# Volume 17 — Test Strategy, Quality Gates and Release Readiness

This volume defines how the Akıllı Alışveriş Asistanı proves correctness and readiness.

---

## 1. Quality scope

Quality covers:

- functional behavior,
- price and promotion calculations,
- product matching,
- data freshness,
- API compatibility,
- migration safety,
- reliability,
- security,
- explanations.

---

## 2. Test strategy

The platform uses many fast unit and domain tests, focused integration tests, contract tests, critical end-to-end tests and continuous data-quality evaluation.

---

## 3. Golden fixtures

Deterministic fixtures verify:

```text
112,50 TL / 750 g = 150,00 TL/kg
410,00 TL + 35,00 TL fee = 445,00 TL
```

Matching, alerting and basket optimization also use golden datasets.

---

## 4. Scraper quality

Scraper success requires valid data, not only a successful HTTP response.

Confirmed parser bugs become regression fixtures.

---

## 5. Matching and search

Auto-match precision is the primary matching KPI.

Search evaluation covers intent interpretation, typo tolerance, aliases, filters and top-k relevance.

---

## 6. Migration safety

Migrations are tested against existing databases and expand-contract compatibility.

Empty-database success alone is insufficient.

---

## 7. Resilience

The platform is tested against queue delays, duplicate events, retailer timeouts, provider failures and worker restarts.

Recovery must preserve data integrity and prevent duplicate side effects.

---

## 8. Release gates

Releases require passing tests, migration checks, security controls, data-quality checks, observability and rollback planning.

Critical gates cannot be bypassed by schedule pressure.
