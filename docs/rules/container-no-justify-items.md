# container-no-justify-items

Detects `justify-items` on non-flex/grid containers where it has no effect.

## Why this is a no-op

The `justify-items` property sets the default `justify-self` for all items inside a container. It has a visible effect in both grid and flex layout (flex support since Chrome 129). On block-level elements, `justify-items` is ignored since there is no inline-axis item alignment mechanism.

**Exception:** The `legacy` keyword (e.g. `justify-items: legacy center`) is always meaningful — it propagates `justify-self` resolution to descendants regardless of the container's display type.

## Properties involved

- `justify-items`
- `display`

## Examples

### Warn

```html
<div style="justify-items: center">No effect on block container</div>
```

### OK

```html
<div style="display: grid; justify-items: center">Grid items centered horizontally</div>
<div style="display: flex; justify-items: center">Flex items use justify-self: center</div>
```

## Common scenarios

Developers sometimes set `justify-items` on block-level elements expecting it to center content.
