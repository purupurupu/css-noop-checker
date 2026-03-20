# item-no-justify-self

Detects `justify-self` on non-grid, non-positioned elements where it has no effect.

## Why this is a no-op

The `justify-self` property only applies to grid items and absolutely/fixed-positioned elements. In a block or flex formatting context, `justify-self` is ignored by the browser. Flex items should use `margin` or container-level `justify-content` instead.

## Properties involved

- `justify-self`
- `position`
- Parent `display`

## Examples

### Warn

```html
<!-- Parent is not a grid container -->
<div style="display: flex">
  <div style="justify-self: center">No effect on flex items</div>
</div>
```

### OK

```html
<!-- Parent is a grid container -->
<div style="display: grid">
  <div style="justify-self: center">Works in grid</div>
</div>
```

## Common scenarios

Developers often set `justify-self` expecting it to work like `align-self` in flexbox. Unlike `align-self`, `justify-self` is only recognized by grid layout and positioned elements.
