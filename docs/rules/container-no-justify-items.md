# container-no-justify-items

Detects `justify-items` outside grid or block layout where it has no effect.

## Why this is a no-op

In current Chromium, `justify-items` has a visible effect in grid layout and in block layout containers such as `block`, `inline-block`, `flow-root`, and `list-item`. It does not affect flex, inline, or table layout.

**Exception:** The `legacy` keyword (e.g. `justify-items: legacy center`) is always meaningful — it propagates `justify-self` resolution to descendants regardless of the container's display type.

## Properties involved

- `justify-items`
- `display`

## Examples

### Warn

```html
<div style="display: flex; justify-items: center">No effect on flex container</div>
```

### OK

```html
<div style="display: grid; justify-items: center">Grid items centered horizontally</div>
<div style="justify-items: center">Block-layout children are aligned horizontally</div>
```

## Common scenarios

Developers often try `justify-items` on flex containers expecting it to work like grid or block layout alignment.
