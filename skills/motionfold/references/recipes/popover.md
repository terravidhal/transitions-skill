# Popover

An origin-aware menu or action panel on the native Popover API.

## Use it when

- A menu or action list opens from a trigger and should visually grow from it.
- Light dismiss and the top layer are useful.

## Avoid it when

- The decision must block the page: use `modal`.
- It is the primary navigation: use a real nav region.
- The hint is not interactive: use `tooltip`.

## Anatomy

```html
<button type="button" aria-expanded="false" aria-controls="account-menu" aria-haspopup="menu">
  Account
</button>
<div id="account-menu" popover="auto" class="mf-popover" role="menu" data-mf-side="bottom">
  <button class="mf-popover-item" role="menuitem">Profile</button>
  <div class="mf-popover-separator"></div>
  <button class="mf-popover-item" role="menuitem">Sign out</button>
</div>
```

`showPopover()`/`hidePopover()` or a `popovertarget` button. Set `data-mf-side` to `top`,
`bottom`, `left`, or `right` so the transform origin follows the placement.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-popover-duration` | `--mf-duration-base` | Enter duration |
| `--mf-popover-close-duration` | `--mf-duration-fast` | Exit duration |
| `--mf-popover-ease` | `--mf-ease` | Curve |
| `--mf-popover-distance` | `--mf-distance-sm` | Travel from the trigger |
| `--mf-popover-scale` | `0.97` | Starting scale |

The scale and the origin are what make it feel anchored. A centered popover reads as a modal.

## Accessibility

- `aria-expanded` on the trigger, `aria-controls` to the panel, `aria-haspopup` when it opens
  a menu.
- `role="menu"` + `role="menuitem"` only for a real menu; a form panel is a `dialog` or a
  labelled region.
- Focus the first item on open, support arrows/Home/End, return focus to the trigger on close.
- Escape closes (the Popover API does it). Light dismiss closes on outside click.
- Do not trap focus in a non-modal menu.

## Pitfalls

- Do not leave `transform-origin: center`; it loses the connection to the trigger.
- Do not animate the popover's `top`/`left`. Position it first, then animate transform/opacity.
- Positioning is viewport-aware in the demo helper, not a full collision engine. In a real
  project use the system already present (Radix, Floating UI, CSS anchor positioning). Say so
  in the report.
- Duplicate ids or a popover left in the normal flow breaks the top layer.
- Reposition on scroll and resize; a fixed surface must follow its trigger.
