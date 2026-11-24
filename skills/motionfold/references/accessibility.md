# Accessibility contract

Motion is an enhancement. Every recipe must remain understandable, operable, and
announceable without it.

## Reduced motion

- Respect `prefers-reduced-motion: reduce` by default. The shared layer sets
  `--mf-scale: 0.001`, `--mf-distance: 0`, and `--mf-blur: 0`.
- Under reduced motion, remove displacement, scale, and blur, and keep a short opacity or
  color change when it helps the user see that something changed.
- Stop ambient loops (`skeleton` pulse). Use a static placeholder with `aria-busy="true"`.
- Provide an app-level override: `data-motion="reduced"` (force less) and
  `data-motion="full"` (force more, for a product preference or a demo). Never default the
  override to `full`.
- JavaScript that waits for an exit must check the same preference; otherwise it waits for a
  transition that will not run. `readMs`/`whenSettled` and the framework presence helpers do
  this.

## Focus

- Modal and drawer: move focus into the dialog, trap it, and return it to the trigger on
  close. Native `<dialog>` + `showModal()` provides the trap, Escape, top layer, and focus
  return. Do not reimplement them.
- Popover: focus the first item when it is a menu; return focus to the trigger on close.
  Native Popover API provides light dismiss but not focus management.
- Tabs: roving `tabindex`, arrows, Home, and End. Focus follows the selected tab.
- Accordion: the trigger is a `<button>` with `aria-expanded` and `aria-controls`. Closed
  content is `inert` and visually collapsed.
- Tooltip: show on `focus-visible`, not only hover. The trigger keeps focus.
- Toast: never steal focus. The close button is reachable with Tab.
- Page slide: move focus to the new view heading after the update. Do not block the keyboard
  while the transition runs.

## ARIA and meaning

| Recipe | Required semantics |
|---|---|
| modal, drawer | `role="dialog"` (native), `aria-modal="true"`, `aria-labelledby`, optional `aria-describedby` |
| popover | `aria-expanded`, `aria-controls`; `role="menu"` only for a real menu |
| tooltip | `role="tooltip"` + `aria-describedby`; never the sole source of essential text |
| toast | `role="status"` or `aria-live="polite"`; `role="alert"` only for errors |
| accordion | `aria-expanded`, `aria-controls`, `inert` on the closed region |
| tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` |
| switch | `role="switch"`, `aria-checked`; Space and Enter toggle |
| checkbox | native `<input type="checkbox">` with a `<label>` |
| skeleton | `aria-busy="true"` on the region; announce when loading finishes |
| success-check | `role="status"` + visible text; the icon is decorative or named |
| error-shake | `role="alert"`, `aria-invalid="true"`, `aria-describedby` to the message |
| text-swap | one `aria-live="polite"` region; the outgoing layer is `aria-hidden` |
| page-slide | announce the new view; the heading receives focus |

## Color and state

- Never use color alone to show checked, selected, invalid, or successful.
- Keep a visible focus ring; do not remove `outline` without a replacement.
- Check contrast in light and dark. A motion token must not be the only cue that a control
  changed state.

## Keyboard checklist

- [ ] Tab reaches every control; the focus ring is visible.
- [ ] Escape closes modal, drawer, popover, tooltip, and menu.
- [ ] Arrows and Home/End work in tabs and menus.
- [ ] Space and Enter toggle switch and checkbox.
- [ ] Focus returns to the trigger after a surface closes.
- [ ] The background is inert while a modal or drawer is open.
- [ ] No animation blocks input or delays the first keystroke.
