# Copy button

**Family:** feedback · **Primitive:** `button`

## Use it when

A value is copied to the clipboard and the control confirms the write.

## Avoid it when

A destructive action or a long-running task.

## State

`data-mf-copied="true|false"` on the button; the label and icon change together.

## Contract

- **Tokens:** `--mf-copy-duration`, `--mf-copy-ease`, `--mf-copy-scale`
- **Accessibility:** `announce-copied`, `accessible-label`, `focus-visible`, `fallback-text`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

Copy is a promise, not a click. Wait for the clipboard write, then confirm with the icon, the label, and a live region. Revert after a short hold. If the write fails, keep the original label and show an error; never claim success.

## Pitfalls

- Do not animate before the clipboard promise resolves.
- Do not reset the button while the label is still being read.
- Do not use a check mark without text for screen readers.
