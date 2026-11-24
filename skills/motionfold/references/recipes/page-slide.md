# Page slide

Directional navigation between two views of the same level: list ↔ detail, step ↔ step.

## Use it when

- A view replaces another in the same region and the direction carries meaning (forward/back).
- The transition can run without blocking input.

## Avoid it when

- The navigation is very frequent or keyboard-driven. Use an instant change.
- The View Transitions API is unavailable or motion is reduced: keep the fallback instant.
- The two views are peers with no direction: use `tabs`.

## Anatomy

```html
<section class="mf-page" data-mf-page="list">
  <h2 tabindex="-1">Projects</h2>
  …
</section>
<!-- after navigation -->
<section class="mf-page" data-mf-page="detail">
  <h2 tabindex="-1">Project Atlas</h2>
  …
</section>
```

Give exactly one visible element the `view-transition-name: mf-page` (the recipe class does
it). Do not put the same name on the list and the detail at the same time.

## Motion

| Token | Default | Meaning |
|---|---|---|
| `--mf-page-duration` | `--mf-duration-base` | Slide and fade |
| `--mf-page-ease` | `--mf-ease` | Curve |
| `--mf-page-distance` | `--mf-distance-lg` | Horizontal travel |
| `--mf-page-blur` | `--mf-blur-md` | Cross-blur |

Set `data-mf-direction="back"` on `<html>` to reverse the direction. The fallback class
`mf-page-enter` runs a simple fade/slide when `startViewTransition` is missing.

## Accessibility

- Move focus to the new view's heading (`tabindex="-1"`, `focus({ preventScroll: true })`).
- Do not trap or block the keyboard while the transition runs.
- Announce the new view; the heading is the anchor.
- Under reduced motion, skip the transition entirely.
- Respect the user's scroll position; do not jump to the top unless the view requires it.

## Pitfalls

- Duplicate `view-transition-name` values throw a warning and disable the effect.
- Forgetting the fallback leaves older browsers with a broken blank frame.
- Running a view transition on every keystroke or arrow key delays input.
- Calling `startViewTransition` after the DOM already changed misses the old snapshot. The
  update callback must perform the change.
- A `page-slide` on a very frequent navigation fails the frequency gate; choose `none`.
