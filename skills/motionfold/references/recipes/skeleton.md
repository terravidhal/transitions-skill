# Skeleton

A pulsing placeholder that cross-fades to the real content, in the same slot.

## Use it when

- The final structure is known and the wait is long enough to notice.
- Preserving layout prevents a shift when the data arrives.

## Avoid it when

- The wait is under ~100 ms: show nothing.
- The structure is unknown: use a spinner or a neutral progress message.
- The content is critical and a skeleton would delay reading.

## Anatomy

```html
<div class="mf-skeleton" data-mf-state="loading" aria-busy="true">
  <div class="mf-skeleton-placeholder" aria-hidden="true">
    <span class="mf-skeleton-block"></span>
    <span class="mf-skeleton-line" data-width="medium"></span>
    <span class="mf-skeleton-line" data-width="short"></span>
  </div>
  <div class="mf-skeleton-content">…real content…</div>
  <span class="mf-sr-only" role="status">Loading</span>
</div>
```

Set `data-mf-state="ready"` and `aria-busy="false"` when the data arrives.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-skeleton-duration` | `1000ms` | Pulse cycle |
| `--mf-skeleton-ease` | `linear` | Pulse curve |
| `--mf-skeleton-reveal-duration` | `--mf-duration-base` | Cross-fade |
| `--mf-skeleton-reveal-distance` | `--mf-distance-sm` | Content rise |

The placeholder and the content occupy the same box (`position: absolute` for the content), so
the swap does not move the layout.

## Accessibility

- `aria-busy="true"` on the region while loading; set it to false when done.
- Announce completion once with `role="status"`, not each placeholder.
- Keep the placeholder out of the accessibility tree (`aria-hidden="true"`).
- Do not trap focus; the page stays usable.

## Pitfalls

- Do not animate the skeleton's own opacity: the reveal needs that property. Pulse the children.
- Stop the loop when the element is off-screen (`content-visibility` or an observer).
- Keep the skeleton height close to the final content to avoid layout shift.
- Do not reveal before the real content has a size; the cross-fade needs a stable box.
- Under reduced motion, use a static placeholder and keep a short opacity reveal.
