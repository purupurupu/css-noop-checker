# perspective-no-origin

Detects `perspective-origin` without an active `perspective` on the element.

## Why this is a no-op

The `perspective-origin` property defines the vanishing point for 3D-transformed children, but it only takes effect when the element has an active `perspective` value (not `none`). Without `perspective`, there is no 3D projection to position, so `perspective-origin` is ignored.

## Properties involved

- `perspective-origin`
- `perspective`
- `will-change`

## Examples

### Warn

```html
<div style="perspective-origin: top left">No perspective set, origin ignored</div>
```

### OK

```html
<div style="perspective: 500px; perspective-origin: top left">Vanishing point at top-left</div>
```

## Common scenarios

This happens when developers set `perspective-origin` to customize the vanishing point but forget to also set `perspective` on the same element, or when `perspective` is removed during refactoring.
