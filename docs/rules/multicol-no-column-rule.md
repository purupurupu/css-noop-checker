# multicol-no-column-rule

Detects `column-rule` and `column-fill` on elements that are not multi-column containers.

## Why this is a no-op

The `column-rule-style`, `column-rule-width`, and `column-fill` properties only apply when `column-count` or `column-width` establishes a multi-column layout. Without an active multi-column context, these properties are ignored by the browser and produce no visual effect.

## Properties involved

- `column-rule-style`
- `column-rule-width`
- `column-fill`
- `column-count`
- `column-width`

## Examples

### Warn

```html
<div style="column-rule: 1px solid black">No columns defined, rule is invisible</div>
```

### OK

```html
<div style="column-count: 3; column-rule: 1px solid black">Rule appears between columns</div>
```

## Common scenarios

This happens when developers style column rules before setting up the multi-column layout, or when `column-count` is removed while `column-rule` declarations remain.
