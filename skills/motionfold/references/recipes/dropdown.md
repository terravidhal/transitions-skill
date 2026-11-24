# Dropdown

**Family:** surface · **Primitive:** `listbox`

## Use it when

A trigger opens a short list of choices and the current value stays visible.

## Avoid it when

A free-form command search (use command palette) or a block of content (use popover).

## State

`data-mf-state="open|closing|closed"` on the root; `aria-expanded` on the trigger; `aria-selected` on the options.

## Contract

- **Tokens:** `--mf-dropdown-duration`, `--mf-dropdown-close-duration`, `--mf-dropdown-ease`, `--mf-dropdown-distance`, `--mf-dropdown-scale`
- **Accessibility:** `aria-haspopup`, `aria-expanded`, `option`, `aria-selected`, `arrow-keys`, `escape`, `focus-return`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

A dropdown is a listbox with one selected value. It is not a menu of actions: use a popover when the items do something rather than choose a value. The list grows from the trigger, so the transform origin points at the trigger edge.

## Pitfalls

- Do not animate the list's height; keep a fixed max-height and let it scroll.
- Do not leave the trigger focused on the wrong value after selection.
- Close on outside pointerdown, not only on blur.
