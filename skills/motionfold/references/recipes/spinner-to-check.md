# Spinner to check

**Family:** feedback · **Primitive:** `status`

## Use it when

A short task shows progress, then resolves in the same spot with a success mark.

## Avoid it when

A long task with a known percentage (use progress bar) or a passive status.

## State

`data-mf-state="loading|done"` on the wrapper; the ring fades out while the check path draws.

## Contract

- **Tokens:** `--mf-spinner-duration`, `--mf-spinner-ease`, `--mf-spinner-spin`, `--mf-spinner-draw`
- **Accessibility:** `role-status`, `visible-text`, `aria-busy`, `replay-safe`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The spinner and the check share one cell, so the layout never jumps. Announce the result with text or role="status"; the morph is not the message. Under reduced motion the spinner stops and the check appears without drawing.

## Pitfalls

- Do not show the check before the task actually resolves.
- Do not keep an infinite spin under reduced motion.
- Do not swap the wrapper's size between states.
