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

- Modal, drawer, bottom sheet, command palette, lightbox: move focus into the dialog, trap
  it, and return it to the trigger on close. Native `<dialog>` + `showModal()` provides the
  trap, Escape, top layer, and focus return. Do not reimplement them.
- Command palette: focus the search input on open, keep the active option announced with
  `aria-selected`, and do not animate the filtered list on every keystroke.
- Popover and dropdown: focus the first or current item; return focus to the trigger on close.
  The Popover API provides light dismiss but not focus management.
- Tabs and segmented control: roving `tabindex`, arrows, Home, and End. Focus follows the
  selected item.
- Stepper: mark the current step with `aria-current="step"` and move focus to the new panel
  heading.
- Accordion and inline edit: the trigger is a `<button>`; Enter saves, Escape cancels, and
  focus returns to the view. Closed accordion content is `inert`.
- Tooltip: show on `focus-visible`, not only hover. The trigger keeps focus.
- Toast and banner: never steal focus. Dismiss controls are reachable with Tab.
- Page slide and theme reveal: move focus to the new view heading or keep it on the toggle;
  never block the keyboard while the transition runs.
- Like, copy, icon swap, switch, radio, and checkbox: the accessible name or visible text
  states the current action and the new state.

## ARIA and meaning

| Recipe | Required semantics |
|---|---|
| modal, drawer, bottom sheet, lightbox | native `<dialog>`, `aria-modal="true"`, `aria-labelledby` (or `aria-label` when the title is a prop), optional `aria-describedby` |
| command palette | native dialog with an accessible name, focused search input, `role="listbox"` + `role="option"` + `aria-selected` |
| popover | `aria-expanded`, `aria-controls`; `role="menu"` only for a real menu |
| dropdown | `aria-haspopup="listbox"`, `aria-expanded`, `role="option"`, `aria-selected` |
| banner | `role="status"` or `aria-live="polite"`, a visible dismiss button, persistent text |
| tooltip | `role="tooltip"` + `aria-describedby`; never the sole source of essential text |
| toast | `role="status"` or `aria-live="polite"`; `role="alert"` only for errors |
| accordion | `aria-expanded`, `aria-controls`, `inert` on the closed region |
| tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` |
| segmented control | `role="group"`, `aria-pressed` on each item, arrow keys |
| stepper | `aria-current="step"`, visible step labels, focus moves to the panel heading |
| switch | `role="switch"`, `aria-checked`; Space and Enter toggle |
| checkbox | native `<input type="checkbox">` with a `<label>` |
| radio group | native `<input type="radio">` in a `<fieldset>` with a `<legend>` |
| icon swap | `aria-pressed` and an accessible name that names the next action |
| skeleton | `aria-busy="true"` on the region; announce when loading finishes |
| progress bar | `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, a label |
| inline edit | a labelled input, Enter saves, Escape cancels, focus returns to the view |
| success-check | `role="status"` + visible text; the icon is decorative or named |
| error-shake | `role="alert"`, `aria-invalid="true"`, `aria-describedby` to the message |
| spinner-to-check | `role="status"`, `aria-busy`, visible or screen-reader text for done |
| like-button | `aria-pressed`, accessible name, visible count |
| copy-button | accessible label, visible label, confirm only after the clipboard promise |
| number-pop | `<output>` or `aria-live="polite"`, the final value as text |
| text-swap | one `aria-live="polite"` region; the outgoing layer is `aria-hidden` |
| page-slide | announce the new view; the heading receives focus |
| theme-reveal | a button with `aria-pressed` when it reflects a theme; instant fallback |

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
