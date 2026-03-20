# nontable-no-empty-cells

Detects `empty-cells` on elements that are not table cells.

## Why this is a no-op

The `empty-cells` property only applies to elements with `display: table-cell`. It controls whether borders and backgrounds are shown on table cells that have no content. On any other display type, the property is ignored by the browser.

## Properties involved

- `empty-cells`
- `display`

## Examples

### Warn

```html
<div style="empty-cells: hide">Not a table cell, no effect</div>
```

### OK

```html
<td style="empty-cells: hide">Table cell respects this</td>
```

## Common scenarios

This occurs when `empty-cells` is explicitly set on a non-table-cell element, often due to inheritance from a parent table element being unintentionally overridden on child elements.
