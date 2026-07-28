# TypeScript and Code Standards

## TypeScript baseline

```text
strict mode enabled
no implicit any
no unchecked indexed access
exact optional property types where practical
explicit return types for public APIs
```

## Coding rules

- prefer immutable data,
- use domain-specific types,
- avoid boolean parameter ambiguity,
- keep side effects at boundaries,
- return typed results for expected failures,
- throw only for exceptional or infrastructure failures.

## Naming

```text
PascalCase: types, classes, components
camelCase: functions, variables
UPPER_SNAKE_CASE: true constants
kebab-case: files and folders
```

## Error handling

Expected business failures should use stable error codes.

## Rule

`any`, unchecked casts and non-null assertions require explicit justification.
