# Resource and Command Boundaries

## Query resources

Examples:

```text
products
offers
price-history
search-results
basket-plans
watchlists
alerts
review-items
```

## Commands

Examples:

```text
optimize basket
create watch subscription
acknowledge alert
retry quarantined observation
approve product match
reject product match
pause retailer adapter
```

## Separation rule

Queries describe current state.

Commands request a business action and may produce asynchronous results.

## Application-service examples

```text
SearchProducts
GetProductComparison
OptimizeBasket
CreateWatchSubscription
EvaluateSavedBasket
ApproveProductMatch
ReplayObservation
```

## Anti-pattern

Avoid endpoints such as:

```text
POST /database/product-table/update
```

Business intent must remain explicit.
