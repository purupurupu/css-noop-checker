# inline-no-vertical-margin

Detects `margin-top` or `margin-bottom` on non-replaced inline elements.

## Why this is a no-op

Per the CSS box model specification, vertical margins (`margin-top` and `margin-bottom`) do not apply to non-replaced inline elements. Inline elements only accept horizontal margins. The vertical margins are silently ignored and produce no spacing.

## Properties involved

- `margin-top`
- `margin-bottom`
- `display`

## Examples

### Warn

```html
<span style="margin-top: 20px; margin-bottom: 10px">...</span>
```

### OK

```html
<span style="display: inline-block; margin-top: 20px">...</span>
```

## Common scenarios

This is one of the most common CSS gotchas. Developers add vertical margins to `<span>`, `<a>`, or other inline elements expecting spacing that never appears, often leading to confusion during layout debugging.
