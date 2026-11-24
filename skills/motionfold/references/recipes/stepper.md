# Stepper

**Family:** navigation · **Primitive:** `progress-steps`

## Use it when

A short wizard moves through ordered steps and the current step matters.

## Avoid it when

Peer views (use tabs) or a long page-level flow.

## State

`data-active` and `data-done` on each step; one panel is visible at a time.

## Contract

- **Tokens:** `--mf-stepper-duration`, `--mf-stepper-ease`, `--mf-stepper-distance`
- **Accessibility:** `aria-current`, `step-labels`, `focus-heading`, `not-keyboard-blocking`
- **Reduced motion:** the stylesheet has a `prefers-reduced-motion` guard and the demo can force it with `data-motion`.

A stepper is navigation with a visible spine. The current step gets aria-current="step", the completed steps keep a non-motion mark, and the panel change moves focus to the new heading. The entrance is a short lift, not a full page slide.

## Pitfalls

- Do not animate between steps so slowly that a quick Next feels laggy.
- Do not rely on color alone for completed versus current.
- Do not trap focus in the step list; the form owns the flow.
