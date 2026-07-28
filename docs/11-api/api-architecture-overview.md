# API Architecture Overview

## Purpose

The API layer exposes stable application capabilities without leaking database structure or ingestion internals.

## Boundary model

```text
Web / Mobile / Admin Client
        ↓
API Contract Layer
        ↓
Application Services
        ↓
Domain Services
        ↓
Persistence and External Systems
```

## Responsibilities

The API layer handles:

- request validation,
- authentication context,
- authorization checks,
- command and query dispatch,
- idempotency,
- pagination,
- response shaping,
- error mapping,
- correlation identifiers.

## Rule

API contracts are product contracts. They must not mirror tables one-to-one.
