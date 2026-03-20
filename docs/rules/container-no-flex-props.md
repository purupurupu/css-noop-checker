# container-no-flex-props

Detects `flex-direction` or `flex-wrap` on non-flex containers.

## Why this is a no-op

The `flex-direction` and `flex-wrap` properties are defined by the CSS Flexbox specification and only apply to flex containers (`display: flex` or `display: inline-flex`). On any other display type, these properties are accepted by the parser but have no effect on layout.

## Properties involved

- `flex-direction`
- `flex-wrap`
- `display`

## Examples

### Warn

```html
<div style="display: block; flex-direction: column; flex-wrap: wrap">Not a flex container</div>
```

### OK

```html
<div style="display: flex; flex-direction: column; flex-wrap: wrap">Flex layout active</div>
```

## Common scenarios

This typically occurs when `display: flex` is removed or overridden by another rule while the flex-specific properties remain, or when a developer sets flex properties expecting them to work on block elements.
