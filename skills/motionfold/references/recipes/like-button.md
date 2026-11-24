# Like button

**Family:** feedback · **Primitive:** `button`

## Use it when

A lightweight appreciation toggles with a small, delightful confirmation.

## Avoid it when

A destructive action or a setting that must be quiet.

## State

`data-mf-liked="true|false"` on the button, `aria-pressed`, and a visible count.

## Contract

- **Tokens:** `--mf-like-duration`, `--mf-like-ease`, `--mf-like-scale`, `--mf-like-burst-duration`
- **Accessibility:** `aria-pressed`, `accessible-label`, `visible-count`, `not-motion-only`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The burst is decoration, never the only signal: the heart fill, aria-pressed, and the count all change. Under reduced motion the fill and count still update, but the ring does not run. Keep the hit target at least 44 px on touch.

## Pitfalls

- Do not fire the burst on page load; only on a user toggle.
- Do not hide the count; it is the non-motion confirmation.
- Do not scale so far that the button shifts its neighbors; use transform.
