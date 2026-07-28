# Product Matching Records

## Candidate generation

```text
id
retailer_listing_id
product_variant_id
lexical_score
semantic_score
attribute_score
identifier_score
category_score
total_score
candidate_rank
model_version
created_at
```

## Match decision

```text
id
retailer_listing_id
product_variant_id
decision
confidence
decision_source
ruleset_version
model_version
explanation
decided_at
```

Decision values:

```text
matched
rejected
needs_review
unmatched
```

Evidence may include same GTIN, same brand, compatible category, same package count, semantic similarity or conflicting attributes.

A new parser or matcher version may generate a new decision without deleting the previous decision history.
