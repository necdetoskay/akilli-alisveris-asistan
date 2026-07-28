# Volume 10 — Product Normalization, Matching and Confidence Engine

This volume defines how inconsistent retailer listings are normalized and linked to canonical product variants.

---

## 1. Normalization

The normalization pipeline extracts brand, product family, category, size, package count, weight, volume, form and other identity-bearing attributes.

Transformations are deterministic, versioned and replayable.

---

## 2. Candidate generation

Candidates are produced from verified identifiers, lexical search, full-text search, trigram similarity, semantic vectors, category filters and alias expansion.

Candidate generation can be permissive, but final acceptance remains strict.

---

## 3. Evidence

Matching combines positive and negative evidence.

Positive evidence includes matching brand, category, package count, quantity, family and identifiers.

Negative evidence includes incompatible form, size, flavor, model or quantity.

---

## 4. Confidence score

The score combines identifier, lexical, semantic and structured attribute components.

Weights vary by category.

For diapers, size and product form are critical. For cheese, weight, type and form may carry more weight.

---

## 5. Hard conflicts

A high semantic score never overrides a hard commercial conflict.

Examples:

```text
cırtlı bez ≠ külot bez
500 g ≠ 1 kg
şekerli kola ≠ şekersiz kola
```

---

## 6. Manual review

Uncertain cases enter a review queue.

Reviewers see raw data, normalized fields, candidate scores, evidence and historical decisions.

Manual decisions improve rules and future model quality.

---

## 7. Versioning

Normalization rules, candidate generation, embeddings, scoring weights and thresholds are versioned.

New matcher versions support shadow evaluation, dry runs, partial rollout and rollback.

---

## 8. Evaluation

The system is measured with precision, recall, top-k recall, review rate and category-specific accuracy.

Auto-match precision is the primary safety metric.

It is better to leave a product unmatched than to compare the wrong products.
