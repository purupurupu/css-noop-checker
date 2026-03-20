# table-no-margin

Detects margin on internal table elements.

## Why this is a no-op

Per CSS 2.1 section 17.5.3, margins have no effect on internal table elements such as `table-row`, `table-row-group`, `table-cell`, `table-column`, `table-column-group`, `table-header-group`, and `table-footer-group`. The table layout algorithm controls spacing between these elements, ignoring any margin values.

## Properties involved

- `margin-top` / `margin-block-start`
- `margin-right` / `margin-inline-end`
- `margin-bottom` / `margin-block-end`
- `margin-left` / `margin-inline-start`
- `display`

## Examples

### Warn

```html
<div style="display: table-row; margin-top: 10px">...</div>
```

### OK

```html
<div style="display: table; margin-top: 10px">...</div>
```

## Common scenarios

This often occurs when developers apply utility classes or global styles that set margins on elements that happen to have a table-internal display type. Spacing between table rows should be controlled via `border-spacing` on the table element instead.
