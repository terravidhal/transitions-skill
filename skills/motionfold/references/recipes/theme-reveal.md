# Theme reveal

**Family:** navigation · **Primitive:** `view-transition`

## Use it when

A deliberate theme switch is worth a spatial reveal from the control.

## Avoid it when

A theme that must follow the OS instantly, or a keyboard-heavy control.

## State

`startViewTransition` with a clip-path circle from the button; a plain `apply()` fallback.

## Contract

- **Tokens:** `--mf-theme-duration`, `--mf-theme-ease`, `--mf-theme-radius`
- **Accessibility:** `button`, `aria-pressed`, `reduced-motion-fallback`, `instant-fallback`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

The reveal is a navigation transition: it explains where the new theme comes from. If View Transitions are missing, reduced motion is requested, or the user keeps a quiet interface, apply the theme immediately. Never gate the theme change on the animation.

## Pitfalls

- Do not start a view transition without a fallback that still changes the theme.
- Do not reuse a view-transition name that the page already owns.
- Do not run the reveal on every OS theme change.
