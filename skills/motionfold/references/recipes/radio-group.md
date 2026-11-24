# Radio group

**Family:** state · **Primitive:** `radio`

## Use it when

One exclusive choice out of a small set, submitted with a form or applied at once.

## Avoid it when

An immediate on/off setting (use switch) or multiple choices (use checkbox).

## State

The native `<input type="radio">` owns the state; the dot is a decorative sibling driven by `:checked`.

## Contract

- **Tokens:** `--mf-radio-duration`, `--mf-radio-ease`, `--mf-radio-dot-scale`
- **Accessibility:** `native-input`, `fieldset-legend`, `focus-visible`, `not-color-only`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

Radios are a form control, so the browser handles arrow-key movement and the group name. Animate only the dot and the ring; never replace the native input with a div. The selected state must still be readable without the dot, through the label and the form value.

## Pitfalls

- Do not animate the whole group when the value changes.
- Do not use a radio group for an immediate setting with no submit step.
- Do not remove the fieldset and legend; they carry the group label.
