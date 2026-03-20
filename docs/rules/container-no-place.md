# container-no-place

Detects `place-content` or `place-items` on non-flex/grid containers.

## Why this is a no-op

The `place-content` and `place-items` shorthands set alignment in both the block and inline axes simultaneously. They are defined for flex and grid containers only. On other display types such as `block` or `inline`, there is no alignment context, so these properties have no visible effect.

## Properties involved

- `place-content`
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
