# Tooltip

A short complementary hint on hover or keyboard focus.

## Use it when

- The hint explains an icon or a control without repeating its visible label.
- A keyboard user can reach the same information by focusing the trigger.

## Avoid it when

- The information is essential: put it in the layout.
- The target is touch-only: hover does not exist.
- The text is long or interactive: use a popover.

## Anatomy

```html
<span class="mf-tooltip">
  <button type="button" aria-describedby="tip-1">Duplicate</button>
  <span class="mf-tooltip-bubble" role="tooltip" id="tip-1">Copy to a new draft</span>
</span>
```

`data-mf-side` can be `top`, `bottom`, `left`, or `right`.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-tooltip-duration` | `--mf-duration-fast` | Enter duration |
| `--mf-tooltip-delay` | `120ms` | Intent delay before showing |
| `--mf-tooltip-ease` | `--mf-ease-out` | Curve |
| `--mf-tooltip-distance` | `--mf-distance-sm` | Travel |
| `--mf-tooltip-scale` | `0.98` | Starting scale |

The exit uses a micro duration and no delay: a tooltip should leave as soon as the pointer
does. The delay prevents accidental opens while moving across a toolbar.

## Accessibility

- `role="tooltip"` and `aria-describedby` on the trigger. Do not use `title` alone.
- Show on `:focus-within` as well as hover.
- The bubble never captures the pointer; the trigger keeps focus.
- Do not put a link or a button inside a tooltip.
- On small screens, consider a static help text or a popover instead.

## Pitfalls

- Do not hide the trigger with the bubble.
- Do not open a tooltip on touch-and-hold only.
- Do not animate the bubble with a large displacement; 4px is enough.
- Do not let neighboring tooltips all open with the delay each time; once one is open, the
  next can open immediately. That progressive behavior is a product decision, not CSS.
- Do not remove the reduced-motion guard: keep the opacity, drop the travel.
