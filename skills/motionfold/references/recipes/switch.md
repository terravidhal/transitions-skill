# Switch

An immediate boolean setting with a thumb that travels and a track that changes color.

## Use it when

- The change applies now, without a submit: notifications, dark mode, auto-save.
- The setting is conceptually on/off, not a choice among options.

## Avoid it when

- The value is submitted later with a form: use a checkbox.
- There are more than two exclusive options: use radios or a segmented control.
- The change needs a confirmation: use a button and a dialog.

## Anatomy

```html
<button class="mf-switch" type="button" role="switch" aria-checked="false">
  <span class="mf-switch-track" aria-hidden="true">
    <span class="mf-switch-thumb"></span>
  </span>
  <span>Email notifications</span>
</button>
```

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-switch-duration` | `--mf-duration-fast` | Thumb and track |
| `--mf-switch-ease` | `--mf-ease-spring` | Slight overshoot |
| `--mf-switch-travel` | `20px` | Thumb distance |
| `--mf-switch-overshoot` | `1` | Reserved for a custom curve |

Translate the thumb; never animate `left`. A button with `role="switch"` responds to Space and
Enter natively; the vanilla helper mirrors that for non-button markup.

## Accessibility

- `role="switch"` and `aria-checked`; the accessible name comes from the visible label.
- Space and Enter toggle.
- A visible focus ring on the track, not the thumb.
- The track color change must meet contrast; do not rely on the thumb position alone.
- Do not use a switch for a destructive action.

## Pitfalls

- Do not animate on mount; only when the state changes.
- Do not use `left`/`margin`; use `transform`.
- Do not put the label inside the track.
- Under reduced motion, snap the thumb but keep the color change.
