# container-no-place

Detects `place-items` on non-flex/grid containers.

## Why this is a no-op

The `place-items` shorthand sets `align-items` and `justify-items` simultaneously. These properties only have a visible effect on flex and grid containers. On other display types such as `block` or `inline`, there is no alignment context for items, so `place-items` has no effect.

**Note:** `place-content` is intentionally NOT checked by this rule. `place-content` is a shorthand for `align-content` and `justify-content`. Since `align-content` works in block layout (Chrome 123+), `place-content` is at least partially effective on block containers and should not be flagged as a complete no-op.

## Properties involved

- `place-items`
- `display`

## Examples

### Warn

```html
<div style="display: block; place-items: center">Not centered</div>
```

### OK

```html
<div style="display: grid; place-items: center">Centered in grid</div>
```

## Common scenarios

The popular one-liner `display: grid; place-items: center` for centering content sometimes gets its `display: grid` removed or overridden, leaving `place-items` with no effect.
