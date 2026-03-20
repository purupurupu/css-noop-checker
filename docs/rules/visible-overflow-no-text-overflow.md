# visible-overflow-no-text-overflow

Detects `text-overflow` on elements with visible overflow.

## Why this is a no-op

`text-overflow` (e.g., `ellipsis`) only takes effect when `overflow-x` is set to something other than `visible`. The property controls how overflowed inline content is signaled to the user, but when overflow is visible, the content simply renders beyond the element's box and there is nothing to truncate.

## Properties involved

- `text-overflow`
- `overflow-x`

## Examples

### Warn

```html
<div style="text-overflow: ellipsis; overflow: visible">...</div>
```

### OK

```html
<div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">...</div>
```

## Common scenarios

This is very common when implementing text truncation with ellipsis. Developers often remember to set `text-overflow: ellipsis` and `white-space: nowrap` but forget `overflow: hidden`, which is required for the ellipsis to appear.
