# block-no-vertical-align

Detects `vertical-align` on block-level elements.

## Why this is a no-op

The `vertical-align` property only applies to inline-level elements (`inline`, `inline-block`, `inline-table`) and table cells. On block-level elements such as `display: block` or `display: flex`, the property is ignored by the CSS layout algorithm and has no visible effect.

## Properties involved

- `vertical-align`
- `display`

## Examples

### Warn

```html
<div style="display: block; vertical-align: middle">Not vertically aligned</div>
```

### OK

```html
<span style="display: inline-block; vertical-align: middle">Aligned correctly</span>
```

## Common scenarios

Developers frequently set `vertical-align: middle` on block elements expecting it to vertically center content, similar to how it works in table cells. For block containers, use flexbox (`align-items: center`) or grid layout instead.
