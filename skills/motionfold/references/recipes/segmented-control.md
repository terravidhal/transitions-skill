# Segmented control

**Family:** state · **Primitive:** `group`

## Use it when

Two to four peer filters or time ranges share one compact track.

## Avoid it when

More than four options (use tabs or a dropdown) or a binary setting (use switch).

## State

`--mf-seg-index` on the root moves one indicator; `aria-pressed` marks the active button.

## Contract

- **Tokens:** `--mf-seg-duration`, `--mf-seg-ease`, `--mf-seg-index`
- **Accessibility:** `role-group`, `aria-pressed`, `arrow-keys`, `focus-visible`, `label`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The indicator is a single element moved with transform, so changing the selection never animates layout. Keep the buttons equal width; if labels differ a lot, use tabs with a measured indicator instead.

## Pitfalls

- Do not animate `left` or `width`; translate the indicator.
- Do not use more than four segments on mobile.
- Keep the active segment distinguishable without the pill, via weight and `aria-pressed`.
