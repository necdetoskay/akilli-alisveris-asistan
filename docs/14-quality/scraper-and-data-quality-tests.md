# Scraper and Data-Quality Tests

## Scraper fixtures

Store representative retailer pages and responses for:

```text
normal product
promotion
out-of-stock product
variant selector
missing price
changed HTML
redirect
large payload
malformed content
```

## Parser regression

Every confirmed parser bug should add a fixture before the fix is merged.

## Data-quality assertions

Examples:

```text
price must be positive
currency must be recognized
package quantity must be plausible
product count cannot drop unexpectedly
all prices cannot become identical
availability cannot flip uniformly without evidence
```

## Production shadow checks

New parsers may run in shadow mode before replacing current extraction.

## Rule

A scraper run can be technically successful but still fail data-quality validation.
