# Icon swap

**Family:** state · **Primitive:** `button`

## Use it when

A control toggles between two states that each have a familiar icon.

## Avoid it when

A long label changes (use text swap) or more than two states.

## State

`data-mf-active="true|false"` on the button plus `aria-pressed`; both icons stay in the DOM.

## Contract

- **Tokens:** `--mf-icon-swap-duration`, `--mf-icon-swap-ease`, `--mf-icon-swap-rotate`, `--mf-icon-swap-scale`
- **Accessibility:** `aria-pressed`, `accessible-label`, `focus-visible`, `not-icon-only-meaning`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

Two icons cross-fade in the same cell. Keep an accessible name that names the current action ("Switch to list view"), not just the icon. The swap is short: this is a frequent control, so it should feel like a state change, not an entrance.

## Pitfalls

- Do not rotate more than a quarter turn for a utility control.
- Do not use two separate buttons that swap in and out.
- Do not rely on the icon alone; update the label or `aria-label`.
