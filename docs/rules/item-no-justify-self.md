# item-no-justify-self

Detects `justify-self` on elements where it has no effect — outside flex, grid, block, or positioned contexts.

## Why this is a no-op

The `justify-self` property applies to:

- Grid items
- Block-level children in block formatting contexts (Chrome 119+) — but **not** inline-level children or children of multi-column containers
- Absolutely/fixed-positioned elements (Chrome 105+)

In other formatting contexts, including flex layout and table layout, or on inline-level boxes inside block layout, `justify-self` is ignored by Chromium.

## Properties involved

- `justify-self`
- `display` (child's own display)
- `position`
- Parent `display`
- Parent `column-count` / `column-width`

## Examples

### Warn

```html
<!-- Parent is a table container — justify-self has no effect -->
<div style="display: table">
  <div style="justify-self: center">No effect in table layout</div>
</div>

<!-- Inline child in block parent — justify-self only applies to block-level boxes -->
<div>
  <span style="justify-self: center">No effect on inline elements</span>
</div>

<!-- Multi-column block parent — justify-self does not apply -->
<div style="column-count: 2">
  <div style="justify-self: center">No effect in multi-column layout</div>
</div>
```

### OK

```html
<!-- Parent is a grid container -->
<div style="display: grid">
  <div style="justify-self: center">Works in grid</div>
</div>

<!-- Parent is a block container (supported since Chrome 119) -->
<div>
  <div style="justify-self: center">Works in block layout</div>
</div>
```

## Common scenarios

- Setting `justify-self` on an inline element (`<span>`) inside a block container — only block-level children are affected.
- Setting `justify-self` on a child of a multi-column container — multi-column layout does not support `justify-self`.
- Setting `justify-self` on a flex item, table child, or other unsupported layout item.
