# table-no-padding

Detects padding on table internal elements where it has no effect.

## Why this is a no-op

Padding is ignored on `table-row`, `table-row-group`, `table-column`, `table-column-group`, `table-header-group`, and `table-footer-group` elements. Only `table`, `inline-table`, `table-cell`, and `table-caption` support padding. The CSS table model does not define padding behavior for row and column grouping elements.

## Properties involved

- `padding-top` / `padding-block-start`
- `padding-right` / `padding-inline-end`
- `padding-bottom` / `padding-block-end`
- `padding-left` / `padding-inline-start`
- `display`

## Examples

### Warn

```html
<div style="display: table-row; padding: 10px">...</div>
```

### OK

```html
<td style="padding: 10px">...</td>
```

## Common scenarios

This typically happens when padding utility classes are applied to table rows or column groups. The fix is to move the padding to the `table-cell` elements inside the row or group.
