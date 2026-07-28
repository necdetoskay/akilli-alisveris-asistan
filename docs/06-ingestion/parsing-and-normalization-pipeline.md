# Parsing and Normalization Pipeline

## Processing stages

```text
Raw payload
    ↓
Source parser
    ↓
Parsed observation
    ↓
Field normalization
    ↓
Category classification
    ↓
Attribute extraction
    ↓
Validation
    ↓
Persistence
```

## Parsed observation

```json
{
  "rawTitle": "Prima Premium Care 4 Numara 52'li",
  "brandText": "Prima",
  "priceText": "649,90 TL",
  "availabilityText": "Stokta",
  "categoryPath": ["Bebek", "Bebek Bezi"],
  "attributes": {
    "size": "4",
    "packageCount": "52"
  }
}
```

## Normalization examples

```text
649,90 TL → 649.90 TRY
52'li → package_count=52
1,5 kg → net_quantity=1500 g
cırtlı → closure_type=tape
```

## Versioning

Every result should retain:

- parser version,
- normalization ruleset version,
- taxonomy version,
- attribute extractor version.

## Validation

Reject or quarantine observations when:

- price is negative or impossible,
- currency is unknown,
- listing identity is missing,
- package quantity conflicts internally,
- source payload is incomplete beyond tolerance.
