# Error shake

A short horizontal correction on a field, with a message that carries the real meaning.

## Use it when

- A form submission failed validation and one field needs attention.
- The field is already visible and the error is local.

## Avoid it when

- The error is systemic: use an inline alert or an error page.
- The error was already announced; do not shake twice for the same submission.
- The whole form is wrong: mark the fields, do not shake the form.

## Anatomy

```html
<div class="mf-field" data-mf-invalid="false">
  <label class="mf-field-label" for="email">Email</label>
  <input class="mf-input" id="email" type="email" aria-describedby="email-error" />
  <p class="mf-field-error" id="email-error" role="alert" hidden>Enter a valid email address.</p>
</div>
```

`data-mf-shake="true"` triggers the animation. Keep it orthogonal to `data-mf-invalid` so the
shake can replay.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-shake-duration` | `--mf-duration-slow` | Shake length |
| `--mf-shake-ease` | `--mf-ease-in-out` | Curve |
| `--mf-shake-distance` | `--mf-distance-sm` | Peak offset |

Six small segments with a decay. One shake per submission, then stop.

## Accessibility

- The message is the source of truth: `role="alert"` and visible text.
- `aria-invalid="true"` on the field; `aria-describedby` points to the message.
- Move focus to the invalid field so keyboard and screen-reader users land on it.
- Never shake when reduced motion is on; the message and focus do the work.
- Do not rely on the red border alone.

## Pitfalls

- Do not shake a container with selectable text; shake the input.
- Do not replay on every render; replay only on a new failed submission.
- Do not shake for a server failure that is not the field's fault.
- Do not use a long or looping shake.
