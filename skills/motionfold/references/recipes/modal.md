# Modal

A native `<dialog>` that scales up from the page and leaves faster than it arrived.

## Use it when

- A decision or short focused task must block the page.
- The content is contextual to the whole view, not anchored to a trigger.

## Avoid it when

- A non-blocking confirmation is enough: use `toast`.
- The menu is anchored to a trigger: use `popover`.
- The action happens dozens of times an hour: a modal is already heavy; keep it quiet.

## Anatomy

```html
<dialog class="mf-modal" aria-labelledby="modal-title" aria-modal="true">
  <div class="mf-modal-header">
    <h2 class="mf-modal-title" id="modal-title">Rename project</h2>
    <button class="mf-modal-close" type="button" data-mf-close aria-label="Close">×</button>
  </div>
  <div class="mf-modal-body">…</div>
  <div class="mf-modal-actions"><button type="button" data-mf-close>Cancel</button></div>
</dialog>
```

Call `showModal()` to open and `close()` to close. Do not toggle a `hidden` class: the native
`open` attribute plus `@starting-style` gives the enter and exit.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-modal-duration` | `--mf-duration-base` | Enter duration |
| `--mf-modal-close-duration` | `--mf-duration-fast` | Exit duration |
| `--mf-modal-ease` | `--mf-ease` | Curve |
| `--mf-modal-distance` | `--mf-distance-md` | Vertical travel |
| `--mf-modal-scale` | `0.97` | Starting scale |

The exit stays visible through `transition-behavior: allow-discrete` on `display` and
`overlay`. Calling `close()` therefore animates; no timer is needed.

## Accessibility

- Native focus trap, Escape, top layer, and focus return.
- `aria-labelledby` points to the title. Add `aria-describedby` for a short description.
- Put the first meaningful field or the primary action in the initial tab order; use
  `autofocus` sparingly.
- A backdrop click may close, but the decision buttons must remain explicit.
- While open, the rest of the page is inert by native modal behavior.

## Pitfalls

- Do not call `close()` after setting `display: none` yourself; you erase the exit.
- Do not intercept `cancel` without closing the dialog.
- Do not stack two modals unless the second has its own labelled task.
- Do not put the dialog inside a transformed or overflow-hidden ancestor for the top layer;
  the top layer escapes clipping, but the trigger still needs a stable position.
- Do not use `scale(0)`; the scale token keeps the surface perceptible.

## Stacks

`vanilla.js` exports `setupModal(dialog, { onOpenChange })`. React, Vue, Svelte, and Solid
components call `showModal()`/`close()` in an effect and expose `duration`, `easing`, and
`distance` as props that only write the CSS variables.
