# Inline edit

**Family:** state · **Primitive:** `input`

## Use it when

A short value can be renamed in place without leaving the page.

## Avoid it when

A long form or a value that needs validation across fields (use a modal).

## State

`data-mf-editing="true|false"` on the root; the view and the form share one grid cell.

## Contract

- **Tokens:** `--mf-inline-duration`, `--mf-inline-ease`, `--mf-inline-distance`
- **Accessibility:** `label`, `enter-to-save`, `escape-to-cancel`, `focus-management`, `value-as-text`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

Inline editing is a mode, so the keyboard contract must be explicit: Enter saves, Escape cancels, blur saves or cancels by policy, and focus returns to the view. The two states share a grid cell so the row does not jump.

## Pitfalls

- Do not lose the typed value when Escape is pressed.
- Do not let the form and the view both take space.
- Do not save on blur if the user clicked Cancel.
