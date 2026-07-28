# Offer Eligibility and Substitution Rules

## Offer eligibility

An offer is eligible when:

- product match confidence is sufficient,
- offer is available,
- price is valid,
- location is supported,
- promotion conditions can be met,
- required quantity can be purchased,
- source data is fresh enough.

## Substitution policies

```text
exact
same_variant_family
same_brand_equivalent
category_equivalent
user_approved_only
no_substitution
```

## Example

A request for:

```text
Prima Premium Care 4 Numara 52 Adet
```

with `exact` policy cannot be replaced by:

```text
Prima Premium Care 4 Numara 44 Adet
```

With a controlled equivalent policy, it may be compared by:

- same brand,
- same size,
- same product form,
- compatible package quantity,
- unit-price basis.

## Safety rule

A cheaper substitute is not automatically a valid substitute.
