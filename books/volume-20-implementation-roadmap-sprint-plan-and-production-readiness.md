# Volume 20 — Implementation Roadmap, Sprint Plan and Production Readiness

This volume converts architecture into an implementation sequence.

---

## 1. Delivery model

The project uses vertical slices and delivers working software every sprint.

The first slice is:

```text
one retailer
→ one category
→ ingestion
→ normalization
→ matching
→ price comparison
→ search
→ web display
```

---

## 2. Sprint sequence

The roadmap begins with repository and database foundations, then proceeds through catalog, scraper, normalization, matching, pricing, search and web delivery.

Watchlists, basket optimization and broader production hardening follow after the first usable comparison flow.

---

## 3. Definition of done

A completed story includes:

- implementation,
- tests,
- migration validation,
- observability,
- security review,
- documentation,
- reproducible demo.

---

## 4. POC transition

The POC may limit retailers and categories.

Production additionally requires security, backups, observability, rate limits, incident runbooks and rollback capability.

---

## 5. Staged rollout

Capabilities move through:

```text
local → internal → shadow → pilot → percentage rollout → general availability
```

Critical capabilities have kill switches.

---

## 6. Initial production

The first release focuses on trustworthy search and price comparison for a small retailer and category set.

Coverage expands only after quality and operations remain stable.

---

## 7. Launch readiness

Launch requires simultaneous product, data, operations, security and release readiness.
