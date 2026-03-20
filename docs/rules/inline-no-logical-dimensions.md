# inline-no-logical-dimensions

Detects `inline-size` or `block-size` on non-replaced inline elements.

## Why this is a no-op

The logical properties `inline-size` and `block-size` are the writing-mode-aware equivalents of `width` and `height`. Like their physical counterparts, they do not apply to non-replaced inline elements. The browser ignores these properties on inline elements regardless of writing mode.

## Properties involved

- `inline-size`
- `block-size`
- `display`

## Examples

### Warn

```html
<span style="inline-size: 200px; block-size: 100px">...</span>
```

### OK

```html
<span style="display: inline-block; inline-size: 200px">...</span>
```

## Common scenarios

This occurs when developers adopt CSS logical properties for internationalization support but apply them to inline elements that cannot accept sizing constraints.
