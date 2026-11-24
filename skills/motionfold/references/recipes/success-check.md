# Success check

A one-shot confirmation after an action completed.

## Use it when

- A save, upload, payment, or send just succeeded and the moment deserves a beat.
- The confirmation includes visible text ("Saved", "Payment complete").

## Avoid it when

- The state is passive or persistent: use a status label or `text-swap`.
- The user needs to act: use a toast or an inline message.
- The action happens dozens of times an hour: keep it instant.

## Anatomy

```html
<span class="mf-success" data-mf-state="success" role="status">
  <svg class="mf-success-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35"/>
    <path class="mf-success-path" d="M7 12.5L10.5 16L17 8"/>
  </svg>
  <span class="mf-success-text">Saved</span>
</span>
```

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-check-duration` | `--mf-duration-emphasis` | Icon pop |
| `--mf-check-ease` | `--mf-ease` | Curve |
| `--mf-check-draw-duration` | `--mf-duration-slow` | Stroke draw |
| `--mf-check-distance` | `--mf-distance-md` | Vertical settle |
| `--mf-check-path-length` | measured | Stroke length |

Replay by resetting `data-mf-state` to `idle`, forcing a reflow, then setting `success`.

## Accessibility

- `role="status"` on the wrapper and **visible text**. The icon is decorative (`aria-hidden`).
- The animation is never the only signal.
- Announce once; do not also fire a toast with the same sentence unless it carries new
  information.
- Under reduced motion, show the final check and text immediately; no pop, no draw.

## Pitfalls

- A hard-coded `stroke-dasharray` that does not match the path pre-reveals the check. Measure
  with `getTotalLength()` and round up by 1.
- Do not loop the animation.
- Do not replay on every render; replay only when the success event occurs.
- Do not center a giant full-screen celebration for a routine save.
