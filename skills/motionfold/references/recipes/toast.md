# Toast

A transient confirmation that rises from a corner without taking focus.

## Use it when

- An async action succeeds and the user does not need to act.
- A short status ("Copied", "Saved", "Upload started") should appear and leave.

## Avoid it when

- The message requires a decision: use `modal` or an inline alert.
- The information must persist: put it in the page.
- Several errors arrive at once: group them, do not stack a wall of toasts.

## Anatomy

```html
<div class="mf-toast-region" role="status" aria-live="polite">
  <div class="mf-toast" data-mf-state="open" role="status">
    <div class="mf-toast-body">
      <strong class="mf-toast-title">Saved</strong>
      <span>Draft updated just now.</span>
    </div>
    <button class="mf-toast-close" type="button" aria-label="Dismiss">×</button>
  </div>
</div>
```

The region owns the live behavior; each toast may also be a `status`. Use
`data-mf-state="closing"` before removing; the presence helper waits for the exit.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-toast-duration` | `--mf-duration-slow` | Enter duration |
| `--mf-toast-close-duration` | `--mf-duration-base` | Exit duration |
| `--mf-toast-ease` | `--mf-ease` | Curve |
| `--mf-toast-distance` | `--mf-distance-lg` | Rise distance |
| `--mf-toast-scale` | `0.98` | Starting scale |

## Accessibility

- `role="status"` or `aria-live="polite"`. Never `role="alert"` for a routine confirmation.
- Never steal focus. The close button is a normal tab stop.
- Pause auto-dismiss on hover and focus; stay long enough to read (5–8 s).
- The text carries the meaning; the motion is decoration.
- Limit the stack to four visible toasts; queue the rest.

## Pitfalls

- Do not animate the height of the stack; new toasts push the list naturally.
- Do not let an exit be interrupted without keeping a final "closed" state.
- Do not set `pointer-events: none` on the toast itself; only on the region.
- Do not hide a toast with `display: none` before the exit finishes.
- Do not remove the reduced-motion guard: keep the short fade, drop the rise.
