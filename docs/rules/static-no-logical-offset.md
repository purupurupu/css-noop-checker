# static-no-logical-offset

Detects logical offset properties on statically positioned elements.

## Why this is a no-op

Logical offset properties (`inset-block-start`, `inset-block-end`, `inset-inline-start`, `inset-inline-end`) only apply to positioned elements -- those with `position` set to `relative`, `absolute`, `fixed`, or `sticky`. On a statically positioned element, these properties are ignored.

## Properties involved

- `inset-block-start`
- `inset-block-end`
- `inset-inline-start`
- `inset-inline-end`
- `position`

## Examples

### Warn

```html
<div style="position: static; inset-block-start: 10px">...</div>
```

### OK

```html
<div style="position: relative; inset-block-start: 10px">...</div>
```

## Common scenarios

This occurs when developers use logical offset properties (the writing-mode-aware equivalents of top/right/bottom/left) but forget to set a non-static position, or when position is removed during refactoring.
