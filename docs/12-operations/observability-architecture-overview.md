# Observability Architecture Overview

## Purpose

The platform must explain not only whether a service is running, but whether users receive accurate, fresh and trustworthy shopping results.

## Observability pillars

```text
logs
metrics
traces
events
data-quality signals
business-level indicators
```

## Core flow

```text
Application and worker activity
        ↓
Structured telemetry
        ↓
Collection and enrichment
        ↓
Storage and aggregation
        ↓
Dashboards, SLO evaluation and alerts
```

## Monitoring layers

```text
infrastructure health
application health
pipeline health
data quality
business outcome health
user experience
```

## Main rule

A green server does not mean the product is healthy when prices are stale or product matches are wrong.
