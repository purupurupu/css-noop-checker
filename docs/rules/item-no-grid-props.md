# item-no-grid-props

Detects grid item properties (`grid-column-start`, `grid-column-end`, `grid-row-start`, `grid-row-end`) on elements that are not grid items.

## Why this is a no-op

Grid placement properties like `grid-column-start`, `grid-column-end`, `grid-row-start`, and `grid-row-end` only apply to direct children of a grid container (`display: grid` or `display: inline-grid`). When set on elements whose parent is not a grid container, these properties are ignored by the browser.

## Properties involved

- `grid-column-start`
- `grid-column-end`
- `grid-row-start`
- `grid-row-end`
- Parent `display`

## Examples

### Warn

```html
<div>
  <div style="grid-column: 1 / 3">...</div>
</div>
```

### OK

```html
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr">
  <div style="grid-column: 1 / 3">...</div>
</div>
```

## Common scenarios

This occurs when grid placement is specified on elements outside a grid context, or when a parent's `display: grid` is removed during refactoring while child grid placement properties remain.
