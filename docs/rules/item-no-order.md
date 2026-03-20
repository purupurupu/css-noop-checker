# item-no-order

Detects `order` on elements that are not flex or grid items.

## Why this is a no-op

The `order` property only applies to flex items and grid items. When an element's parent is not a flex or grid container, the `order` value is ignored and the element renders in source order. The CSS Flexbox and Grid specs explicitly limit `order` to items participating in those layout models.

## Properties involved

- `order`
- Parent `display`

## Examples

### Warn

```html
<div style="display: block">
  <div style="order: 2">No effect in block layout</div>
</div>
```

### OK

```html
<div style="display: flex">
  <div style="order: 2">Reordered in flex</div>
</div>
```

## Common scenarios

This typically occurs when a parent container's `display: flex` or `display: grid` is removed during refactoring, leaving behind orphaned `order` declarations on child elements.
