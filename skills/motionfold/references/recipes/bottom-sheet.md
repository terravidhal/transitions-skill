# Bottom sheet

**Family:** surface · **Primitive:** `dialog`

## Use it when

A mobile-first task or choice rises from the bottom edge and keeps the page behind it.

## Avoid it when

A desktop side panel (use drawer) or a short menu (use dropdown).

## State

A native `<dialog>`; `open` drives the entry and exit with `@starting-style` and `allow-discrete`.

## Contract

- **Tokens:** `--mf-sheet-duration`, `--mf-sheet-close-duration`, `--mf-sheet-ease`, `--mf-sheet-distance`
- **Accessibility:** `focus-trap`, `escape`, `focus-return`, `aria-modal`, `labelled`, `drag-handle-decorative`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The sheet is the same focus contract as a modal, anchored to the bottom edge. The handle is decorative; it is never the only way to close, and it is not a drag target.

## Pitfalls

- Do not animate `bottom` or `height`; translate the dialog itself.
- Do not remove `max-height`; long content must scroll inside the sheet.
- On desktop, switch to `drawer` rather than stretching the sheet.
