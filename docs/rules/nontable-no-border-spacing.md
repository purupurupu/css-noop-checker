# nontable-no-border-spacing

Detects `border-spacing` on elements that are not table containers.

## Why this is a no-op

The `border-spacing` property only applies to elements with `display: table` or `display: inline-table`. It controls the distance between table cell borders in the separated borders model. On non-table elements, the browser ignores this property entirely.

## Properties involved

- `border-spacing`
- `display`

## Examples

### Warn

```html
<div style="border-spacing: 10px">Not a table, no effect</div>
```

### OK

```html
<div style="display: table; border-spacing: 10px">Table with cell spacing</div>
```

## Common scenarios

This typically occurs when `border-spacing` is inherited from a parent `<table>` element and developers mistakenly override it on a non-table child, or when styling is copied from table-based layouts.
