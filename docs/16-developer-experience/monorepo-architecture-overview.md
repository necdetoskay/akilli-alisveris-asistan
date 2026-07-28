# Monorepo Architecture Overview

## Purpose

The repository should keep applications, workers, shared contracts and domain packages together while preserving explicit boundaries.

## Proposed structure

```text
apps/
packages/
infra/
scripts/
docs/
books/
```

## Primary goals

```text
single source of truth
shared types without circular dependencies
consistent tooling
atomic cross-package changes
fast local feedback
independent deployability where needed
```

## Main rule

A monorepo does not mean unrestricted imports. Package boundaries remain explicit and enforceable.
