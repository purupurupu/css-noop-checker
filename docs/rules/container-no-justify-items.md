# container-no-justify-items

Detects `justify-items` on non-grid containers.

## Why this is a no-op

The `justify-items` property sets the default `justify-self` for all items inside a container, but it only has a visible effect in grid layout. In flex layout, inline alignment of items along the main axis is controlled by `justify-content`, not `justify-items`. On block-level elements, `justify-items` is similarly ignored since there is no inline-axis item alignment mechanism.

## Properties involved

- `justify-items`
- `display`

## Examples

### Warn

```html
<div style="display: flex; justify-items: center">Items not centered by this property</div>
```

### OK

```html
<div style="display: grid; justify-items: center">Grid items centered horizontally</div>
```

## Common scenarios

Developers often set `justify-items` on flex containers expecting it to center items, confusing it with `justify-content`. On flex containers, use `justify-content` for main-axis distribution instead.
