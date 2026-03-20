# container-no-gap

Detects `gap`, `row-gap`, or `column-gap` on non-flex/grid containers.

## Why this is a no-op

The `gap` property (and its longhands `row-gap` and `column-gap`) controls spacing between items in flex, grid, and multi-column containers. On other display types such as `block` or `inline`, there are no container items to space, so the property has no visible effect. Note that `column-gap` is also valid on multi-column containers (`column-count` or `column-width` set).

## Properties involved

- `gap`
- `row-gap`
- `column-gap`
- `display`

## Examples

### Warn

```html
<div style="display: block; gap: 16px">No gap between children</div>
```

### OK

```html
<div style="display: flex; gap: 16px">16px gap between flex items</div>
```

## Common scenarios

This frequently happens when developers apply `gap` to a block container expecting it to create spacing between child elements, not realizing that `gap` requires a flex or grid context. Use `margin` on children for block-level spacing instead.
