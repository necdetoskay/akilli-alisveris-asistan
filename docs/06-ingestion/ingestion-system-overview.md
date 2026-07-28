# Ingestion System Overview

## Purpose

The ingestion subsystem turns unstable retailer data into versioned, auditable and reprocessable observations.

## High-level flow

```text
Scheduler
    ↓
Source Adapter
    ↓
Raw Observation
    ↓
Parser
    ↓
Normalizer
    ↓
Validation
    ↓
Catalog / Listing Matching
    ↓
Offer Projection
    ↓
Outbox Events
```

## Core responsibilities

- schedule and execute collection jobs,
- respect retailer-specific rate limits,
- preserve raw source evidence,
- parse source payloads into a common contract,
- normalize titles, brands, categories and quantities,
- validate commercial values,
- update listing and offer projections,
- append price and availability observations,
- publish downstream events reliably.

## Design rule

A failed downstream step must not force the source to be scraped again when the raw observation is already available.
