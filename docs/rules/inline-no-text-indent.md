# inline-no-text-indent

Detects `text-indent` on non-replaced inline elements.

## Why this is a no-op

The `text-indent` property applies to block-level containers, indenting the first line of text within the block. It does not apply to inline-level elements. Since `text-indent` is inherited, this rule only warns when the property is explicitly authored on the inline element itself, to avoid false positives from inherited values.

## Properties involved

- `text-indent`
- `display`

## Examples

### Warn

```html
<span style="text-indent: 2em">...</span>
```

### OK

```html
<div style="text-indent: 2em">...</div>
```

## Common scenarios

This happens when `text-indent` is applied directly to an inline element like `<span>` instead of its block-level container, or when an element's display is changed to `inline` without removing the indentation.
