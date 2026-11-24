# Progress bar

**Family:** state · **Primitive:** `progressbar`

## Use it when

A task with a known or estimated completion reports how far it has advanced.

## Avoid it when

A very short wait (use a skeleton) or an unknown duration.

## State

`--mf-progress` (0–100) scales the fill; `aria-valuenow` carries the same number.

## Contract

- **Tokens:** `--mf-progress-duration`, `--mf-progress-ease`, `--mf-progress-sheen`
- **Accessibility:** `role-progressbar`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `visible-label`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The fill is scaled with transform, not animated as width, so the bar never triggers layout. A moving sheen is optional decoration; it must stop under reduced motion while the fill keeps its real position.

## Pitfalls

- Do not animate width or margin on the fill.
- Do not report an outdated `aria-valuenow`.
- Do not loop the sheen when reduced motion is requested.
