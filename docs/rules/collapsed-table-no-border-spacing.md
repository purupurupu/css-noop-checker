# collapsed-table-no-border-spacing

Detects `border-spacing` on a table with `border-collapse: collapse`.

## Why this is a no-op

Per CSS 2.1 section 17.6.1, when `border-collapse` is set to `collapse`, adjacent table cell borders are merged into a single shared border. In this model the spacing between cells is always zero, so any `border-spacing` value is ignored by the browser.

## Properties involved

- `border-spacing`
- `border-collapse`
- `display` (must be `table` or `inline-table`)

## Examples

### Warn

```html
<table style="border-collapse: collapse; border-spacing: 10px">
  <tr>
    <td>Cell</td>
  </tr>
</table>
```

### OK

```html
<table style="border-collapse: separate; border-spacing: 10px">
  <tr>
    <td>Cell</td>
  </tr>
</table>
```

## Common scenarios

This occurs when switching a table from the separate border model to collapsed borders without removing the `border-spacing` declaration, or when copying table styles from different contexts.
