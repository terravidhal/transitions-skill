# Checkbox

A native checkbox with a drawn check mark.

## Use it when

- The user selects several options or gives consent in a form.
- The value is submitted later, not applied instantly.

## Avoid it when

- The setting applies immediately: use `switch`.
- Only one option is allowed: use radios.
- The action is immediate and primary: use a button.

## Anatomy

```html
<label class="mf-checkbox">
  <input type="checkbox" />
  <span class="mf-checkbox-box" aria-hidden="true">
    <svg viewBox="0 0 16 16">
      <path class="mf-checkbox-check" d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  </span>
  <span class="mf-checkbox-label">Email me product updates</span>
</label>
```

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-checkbox-duration` | `--mf-duration-fast` | Box fill and border |
| `--mf-checkbox-ease` | `--mf-ease` | Curve |
| `--mf-checkbox-draw-duration` | `--mf-duration-base` | Check stroke |
| `--mf-checkbox-path-length` | measured | Stroke dash length |

The path length is measured once with `getTotalLength()` and written to the box. For a static
path you can set the variable in CSS instead.

## Accessibility

- Keep the real `<input type="checkbox">`; only hide it visually.
- The `<label>` wraps the input, so clicking the text toggles it.
- Focus is drawn on the custom box with `:focus-visible`.
- The checked state is visible through the box fill and the mark, not color alone.
- Use `aria-describedby` or a visible hint for extra help text.

## Pitfalls

- A hard-coded `stroke-dasharray` that is too short pre-reveals the check.
- A hit area smaller than 24×24 px fails touch guidelines; pad the label.
- Do not use `display: none` on the input if you need native focus and form submission.
- Under reduced motion, snap the check; keep the fill change.
