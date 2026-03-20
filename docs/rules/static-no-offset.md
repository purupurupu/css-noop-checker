# static-no-offset

Detects offset properties (`top`, `right`, `bottom`, `left`) on statically positioned elements.

## Why this is a no-op

The `top`, `right`, `bottom`, and `left` offset properties only apply to positioned elements -- those with `position` set to `relative`, `absolute`, `fixed`, or `sticky`. When `position` is `static` (the default), offset properties are ignored by the browser.

## Properties involved

- `top`
- `right`
- `bottom`
- `left`
- `position`

## Examples

### Warn

```html
<div style="position: static; top: 10px; left: 20px">...</div>
```

### OK

```html
<div style="position: relative; top: 10px; left: 20px">...</div>
```

## Common scenarios

This is one of the most common CSS no-ops. It typically happens when a developer sets `top` or `left` without realizing the element is still statically positioned, or when `position: relative` is removed during a refactor while offsets remain.
