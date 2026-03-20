# element-no-table-props

Detects table properties (`border-collapse`, `table-layout`) on non-table elements.

## Why this is a no-op

The CSS properties `border-collapse` and `table-layout` are defined to apply only to elements with `display: table` or `display: inline-table`. When set on elements with any other display value, these properties are ignored by the browser and have no visual effect.

## Properties involved

- `border-collapse`
- `table-layout`
- `display`

## Examples

### Warn

```html
<div style="border-collapse: collapse">...</div>
```

### OK

```html
<table style="border-collapse: collapse">
  ...
</table>
```

## Common scenarios

This often happens when table-related styles are applied via a CSS class to a non-table element, or when refactoring a `<table>` layout to `<div>` elements without removing table-specific properties.

## Known limitation

The current rule implementation exempts all table display types (`table-cell`, `table-row`, etc.), but `border-collapse` and `table-layout` only apply to `table` and `inline-table`. Elements with `display: table-cell` or `display: table-row` are not flagged. See [#155](https://github.com/purupurupu/css-noop-checker/issues/155).
