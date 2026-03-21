# item-no-justify-self

Detects `justify-self` on elements where it has no effect (non-grid, non-flex, non-positioned).

## Why this is a no-op

The `justify-self` property applies to grid items, flex items (since Chrome 129), and absolutely/fixed-positioned elements. In a block formatting context, `justify-self` is ignored by the browser.

## Properties involved

- `justify-self`
- `position`
- Parent `display`

## Examples

### Warn

```html
<!-- Parent is not a grid/flex container and element is not positioned -->
<div>
  <div style="justify-self: center">No effect in block layout</div>
</div>
```

### OK

```html
<!-- Parent is a grid container -->
<div style="display: grid">
  <div style="justify-self: center">Works in grid</div>
</div>

<!-- Parent is a flex container (supported since Chrome 129) -->
<div style="display: flex">
  <div style="justify-self: center">Works in flex</div>
</div>
```

## Common scenarios

Developers may set `justify-self` on a child of a block container expecting it to work like in flex or grid layout.
