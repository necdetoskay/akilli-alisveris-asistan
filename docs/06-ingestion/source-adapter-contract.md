# Source Adapter Contract

## Adapter responsibility

Each retailer adapter handles only source-specific concerns:

- URL discovery,
- authentication when permitted,
- pagination,
- request headers,
- browser automation if required,
- rate limiting,
- raw payload retrieval,
- source identity extraction.

## Adapter output

A source adapter returns a common envelope:

```json
{
  "retailerCode": "example-retailer",
  "externalListingId": "12345",
  "sourceUrl": "https://example.test/product/12345",
  "observedAt": "2026-07-28T09:00:00Z",
  "contentType": "text/html",
  "payloadRef": "object://raw/...",
  "contentHash": "sha256:...",
  "httpStatus": 200,
  "metadata": {
    "storeId": "online",
    "pageType": "product"
  }
}
```

## Contract rules

Adapters must not:

- write directly to canonical product tables,
- decide final product matches,
- silently discard malformed payloads,
- overwrite historical observations.

## Capability metadata

Each adapter should expose:

```text
supports_product_pages
supports_category_pages
supports_store_specific_prices
supports_promotions
supports_stock_state
requires_browser
rate_limit_policy
authentication_mode
```
