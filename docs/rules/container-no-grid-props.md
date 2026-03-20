# container-no-grid-props

Detects grid container properties on non-grid elements.

## Why this is a no-op

Properties like `grid-template-columns`, `grid-template-rows`, `grid-template-areas`, `grid-auto-columns`, `grid-auto-rows`, and `grid-auto-flow` are defined by the CSS Grid Layout specification and only apply to grid containers (`display: grid` or `display: inline-grid`). On any other display type, including flex containers, these properties are ignored.

## Properties involved

- `grid-template-columns`
- `grid-template-rows`
- `grid-template-areas`
- `grid-auto-columns`
- `grid-auto-rows`
- `grid-auto-flow`
- `display`

## Examples

### Warn

```html
<div style="display: flex; grid-template-columns: 1fr 1fr">Not a grid layout</div>
```

### OK

```html
<div style="display: grid; grid-template-columns: 1fr 1fr">Two-column grid</div>
```

## Common scenarios

This occurs when switching from grid to flex layout without removing grid-specific properties, or when mistakenly applying grid template properties to a non-grid container.
