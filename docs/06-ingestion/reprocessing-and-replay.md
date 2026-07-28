# Reprocessing and Replay

## Reprocessing use cases

- new parser version,
- improved normalization rules,
- updated category taxonomy,
- better attribute extraction,
- new matching model,
- corrected unit-price formula.

## Replay source

Prefer replaying stored raw observations instead of re-scraping the retailer.

## Reprocessing record

```text
id
source_observation_id
requested_stage
target_version
status
started_at
finished_at
result_ref
error
```

## Safety requirements

Reprocessing must:

- preserve previous outputs,
- produce versioned new outputs,
- avoid duplicate history,
- make superseded decisions auditable,
- support dry-run comparison before activation.
