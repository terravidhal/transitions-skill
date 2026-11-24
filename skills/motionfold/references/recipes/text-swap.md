# Text swap

A short status label changes in place, with the old value leaving upward and the new one
arriving.

## Use it when

- A label like Draft → Published, Online → Offline, or Idle → Running changes in place.
- The change is short and the width should not jump.

## Avoid it when

- The text is a paragraph or the main content of a view.
- The change is frequent (a live clock): use a plain text update.
- The value is essential and must be read at a glance: a color/status badge may be better.

## Anatomy

```html
<span class="mf-text-swap" data-mf-swapping="false" aria-live="polite">
  <span class="mf-text-swap-value">Draft</span>
  <span class="mf-text-swap-ghost" aria-hidden="true"></span>
</span>
```

Set the ghost's text to the old value, flip `data-mf-swapping="true"`, write the new value,
then reset after the animation.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-text-swap-duration` | `--mf-duration-fast` | Both layers |
| `--mf-text-swap-ease` | `--mf-ease-in-out` | Curve |
| `--mf-text-swap-distance` | `--mf-distance-xs` | Vertical travel |
| `--mf-text-swap-blur` | `--mf-blur-sm` | Blur on both layers |

Both layers share one grid cell, so the container reserves the wider of the two widths while
they cross.

## Accessibility

- One `aria-live="polite"` region around the value. The ghost is `aria-hidden`, so the text is
  announced once.
- Keep the new text short; screen readers should not hear a paragraph swap.
- The color or icon that accompanies the label must still carry meaning.
- Under reduced motion, replace the slide with an instant text change (or a short fade).

## Pitfalls

- Do not leave both layers readable; hide the ghost from assistive technology.
- Do not animate the container's width; let the grid take the wider label.
- Do not use this for the page title or a paragraph.
- Do not forget to reset `data-mf-swapping`, or the next change starts from a finished
  animation.
