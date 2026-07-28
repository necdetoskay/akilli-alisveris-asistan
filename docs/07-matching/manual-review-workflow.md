# Manual Review Workflow

## Review queue

Review items should prioritize:

- high commercial impact,
- frequently observed listings,
- close top-candidate margins,
- conflicting identifiers,
- new brands or categories,
- repeated unmatched listings.

## Reviewer view

The reviewer should see:

```text
raw listing title
normalized fields
source image
retailer category
top candidates
score breakdown
positive evidence
negative evidence
price and package comparison
historical decisions
```

## Actions

```text
accept candidate
reject candidate
create new canonical variant
merge duplicate variants
correct normalized fields
defer
block source pattern
```

## Feedback loop

Manual decisions become labeled examples for:

- threshold tuning,
- ruleset improvement,
- alias updates,
- future model training.
