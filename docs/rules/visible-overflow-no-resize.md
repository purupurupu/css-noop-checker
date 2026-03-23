# visible-overflow-no-resize

Detects `resize` on elements with visible overflow.

## Why this is a no-op

The CSS `resize` property only works on elements that have `overflow` set to `auto`, `scroll`, or `hidden`. When overflow is `visible` (the default) or `clip`, the browser ignores the resize property entirely. This is because resizing requires a mechanism to handle content that exceeds the new dimensions, which only scroll containers provide.

For logical values, Chromium resolves the affected axis from `writing-mode`:

- `resize: inline` follows the inline axis
- `resize: block` follows the block axis

In vertical writing modes, that means the relevant overflow axis can swap compared with the physical `horizontal` / `vertical` values.

## Properties involved

- `resize`
- `overflow-x`
- `overflow-y`
- `writing-mode`

## Examples

### Warn

```html
<div style="resize: both; overflow: visible">...</div>
```

### OK

```html
<div style="resize: both; overflow: auto">...</div>
```

## Common scenarios

This commonly occurs when developers add `resize: both` to a container for user-resizable panels but forget to set overflow. Browsers special-case `<textarea>` elements, where resize works even with visible overflow.
