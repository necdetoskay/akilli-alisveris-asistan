# Conflict Detection and Rejection Rules

## Hard conflicts

Hard conflicts should block auto-match.

Examples:

```text
brand mismatch
baby diaper size 4 versus size 5
tape diaper versus pants diaper
500 g versus 1 kg when package structure is incompatible
cola versus zero-sugar cola
different flavor
different model number
```

## Soft conflicts

Soft conflicts reduce confidence:

```text
missing package count
abbreviated family name
retailer title omits form
minor spelling variation
category path is too broad
```

## Rejection rule

A semantically similar title must not override a hard structured conflict.

Example:

```text
"cırtlı bebek bezi" ≠ "külot bez"
```

even when embeddings are close.

## Contradictory sources

When source title and source attributes disagree:

- preserve both,
- mark the conflict,
- lower confidence,
- route to review when identity is affected.
