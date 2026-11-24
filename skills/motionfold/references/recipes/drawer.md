# Drawer

A full-height panel that enters from a screen edge and keeps the page in context.

## Use it when

- Navigation, filters, or details need space without leaving the current view.
- The panel is tied to the page, not to a small trigger.

## Avoid it when

- A short anchored menu is enough: use `popover`.
- The task must block everything: use `modal`.
- The action is a quick confirmation: use `toast`.

## Anatomy

```html
<dialog class="mf-drawer" data-side="right" aria-labelledby="filters-title">
  <div class="mf-drawer-header">
    <h2 class="mf-drawer-title" id="filters-title">Filters</h2>
    <button class="mf-drawer-close" type="button" data-mf-close aria-label="Close">×</button>
  </div>
  <div class="mf-drawer-body">…</div>
</dialog>
```

`data-side="left"` mirrors the motion and the shadow. Use `showModal()`/`close()`; the native
dialog provides the focus trap and Escape.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-drawer-duration` | `--mf-duration-slow` | Enter duration |
| `--mf-drawer-close-duration` | `--mf-duration-base` | Exit duration |
| `--mf-drawer-ease` | `--mf-ease` | Curve |
| `--mf-drawer-distance` | `100%` | Travel from the edge |

Only `transform` and `opacity` move. The panel never animates `left` or `right`.

## Accessibility

- Same contract as the modal: focus trap, Escape, focus return, `aria-modal`, labelled title.
- Put the first useful control in focus; do not focus the close button first.
- The internal body scrolls with `overscroll-behavior: contain`; the page does not scroll
  behind it.
- On mobile, respect safe areas: add `padding-block` with `env(safe-area-inset-*)` in the
  project.

## Pitfalls

- Do not animate `right`/`left`; translate the panel.
- Do not use a plain `div` with `role="dialog"` unless you also implement the trap.
- Do not remove the exit until the dialog actually closes.
- Do not stack a drawer and a modal unless the second is a real sub-task.
- Do not forget `data-side` on the element; the CSS needs it for direction.
