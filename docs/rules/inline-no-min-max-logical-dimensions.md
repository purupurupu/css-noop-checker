# inline-no-min-max-logical-dimensions

Detects `min-inline-size`, `max-inline-size`, `min-block-size`, or `max-block-size` on non-replaced inline elements.

## Why this is a no-op

The logical min/max sizing properties are writing-mode-aware equivalents of `min-width`, `max-width`, `min-height`, and `max-height`. Like their physical counterparts, they do not apply to non-replaced inline elements because inline elements do not accept explicit size constraints.

## Properties involved

- `min-inline-size`
- `max-inline-size`
- `min-block-size`
- `max-block-size`
- `display`

## Examples

### Warn

```html
<span style="min-inline-size: 100px; max-block-size: 50px">...</span>
```

### OK

```html
<span style="display: block; min-inline-size: 100px">...</span>
```

## Common scenarios

This occurs when logical sizing constraints are applied to inline elements during internationalization work or when migrating from physical to logical CSS properties.
