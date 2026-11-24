# Tabs

Peer views that swap in place with one shared indicator that slides.

## Use it when

- The views are siblings at the same level: overview/details, day/week/month.
- A small segmented control changes a local view or filter.

## Avoid it when

- The flow is sequential: use a stepper or page navigation.
- The tabs would change the URL and the page: use navigation.
- There are more than about seven tabs; use a menu or a sidebar.

## Anatomy

```html
<div class="mf-tabs" role="tablist">
  <span class="mf-tabs-indicator" aria-hidden="true"></span>
  <button class="mf-tab" type="button" role="tab" id="tab-a" aria-selected="true" aria-controls="panel-a" tabindex="0">Overview</button>
  <button class="mf-tab" type="button" role="tab" id="tab-b" aria-selected="false" aria-controls="panel-b" tabindex="-1">Activity</button>
</div>
<div class="mf-tabpanel" role="tabpanel" id="panel-a" aria-labelledby="tab-a">…</div>
<div class="mf-tabpanel" role="tabpanel" id="panel-b" aria-labelledby="tab-b" hidden>…</div>
```

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-tabs-duration` | `--mf-duration-base` | Indicator and label color |
| `--mf-tabs-ease` | `--mf-ease` | Curve |
| `--mf-tabs-indicator` | `currentColor` | Indicator color (used at low opacity) |

Only the indicator moves. `width` is animated here on purpose: it follows the selected label
and is small; the alternative (a fixed-width pill) breaks with variable labels.

## Accessibility

- `role="tablist"` / `role="tab"` / `role="tabpanel"`.
- Roving `tabindex`: only the selected tab is 0.
- Arrow keys move selection, Home/End jump to the ends.
- `aria-selected`, `aria-controls`, `aria-labelledby`.
- Panels are hidden with the `hidden` attribute when inactive.

## Pitfalls

- Measure the indicator **without** a transition on first paint and on resize. Otherwise it
  slides in from zero.
- Do not animate `left`; use `transform: translateX()`.
- Re-measure after fonts load or the label changes.
- Do not `display: none` the active panel without an entrance if the content needs a fade;
  this recipe is intentionally symmetric and instant for the panel.
- Under reduced motion, snap the indicator and keep the color change.
