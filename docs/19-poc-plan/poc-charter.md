# POC Charter

## Purpose

The POC must prove that the platform can reliably:

```text
collect product data
normalize product information
match equivalent products
calculate comparable prices
search products
display trustworthy comparison results
```

## Primary user scenario

```text
User searches for a product
    ↓
System interprets the query
    ↓
Matching listings are found
    ↓
Equivalent products are grouped
    ↓
Effective and unit prices are calculated
    ↓
Best comparable offers are displayed
```

## Initial operating mode

All ingestion, normalization, matching and AI-assisted actions are manually triggered.

No scheduler, autonomous orchestration or background automation is required in the first POC.

## AI configuration

When an LLM is needed, provider, model and API key are entered manually by an administrator.

Persistent settings management may be introduced after the core flow is proven.

## Main rule

The POC is successful only when the complete flow works with repeatable tests and measurable quality.
