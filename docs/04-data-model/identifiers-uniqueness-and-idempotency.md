# Identifiers, Uniqueness and Idempotency

Use application-generated UUIDs for internal entities.

Important uniqueness examples:

```text
retailer + external_listing_id
retailer + canonicalized_source_url
offer + observed_at + source_hash
product_variant + verified_gtin
category + code
```

Repeated processing of the same source observation must not create duplicate history.

Recommended mechanisms:

- ingestion key,
- unique constraint,
- upsert,
- database transaction,
- outbox message key.
