# Command palette

**Family:** surface · **Primitive:** `dialog`

## Use it when

A power user summons a searchable list of commands with a keyboard shortcut.

## Avoid it when

A simple menu (use dropdown) or a blocking confirmation (use modal).

## State

A native `<dialog>` containing a search input and a `role="listbox"` of commands.

## Contract

- **Tokens:** `--mf-command-duration`, `--mf-command-close-duration`, `--mf-command-ease`, `--mf-command-distance`, `--mf-command-scale`
- **Accessibility:** `focus-input`, `escape`, `arrow-keys`, `aria-selected`, `labelled`, `type-ahead`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

Opening a palette is occasional, so the entrance can be expressive; typing inside it is frequent, so filtering stays instant and unanimated. Selection is announced through aria-selected, and the active row scrolls into view without animating the list.

## Pitfalls

- Do not animate the filtered list on every keystroke.
- Keep the input focused when the dialog opens.
- Return focus to the trigger; do not steal it after a command runs.
